/**
 * Showroom Info里面每个view
 * Created by Island Huang
 * Date: 13-3-4 下午11:22
 */
//TODO 必须彻底重构此module
Can.view.ShowroowBaseView = Can.extend(Can.view.BaseView, {
	startup: function () {
		this.container = $('<div class="main"></div>');
	},
	show: function () {
		this.container.show();
	},
	hide: function () {
		this.container.hide();
	},
	/**
	 * 将当前步骤显示在某个容器中
	 * @param {Object} container 父级容器
	 */
	applyTo: function (container) {
		if (typeof container == 'object') {
			$(container).append(this.container);
		}
	}
});


/**
 * 公司信息
 */
Can.view.ShowroomComInfoView = Can.extend(Can.view.ShowroowBaseView, {
	requireUiJs: ['js/framework/utils/template.js', 'js/framework/utils/ui/window/actionWindow.js'],
	show_contactInfo: function () {
		if ($('#contactInfoEdit', '#companyInforFormId').css("display") == "none")
			$('#contactInfoView', '#companyInforFormId').slideUp(function () {
				$('#contactInfoEdit', '#companyInforFormId').slideDown();
			});
	},
	/**
	 * refs #3448
	 *
	 * @return
	 */
	hide: function () {
		Can.view.ShowroomComInfoView.superclass.hide.call(this);

		var self = this;

		if (self._isChangeNoSave) {
			if (!self.leaveWin) {
				self.leaveWin = new Can.util.ui.window.ActionWindow({
					width: 470,
					title: '',
					message: Can.msg.MODULE.SHOWROOM_SET.CONFIRM_LEAVE,
					actions: [
						{
							btnText: Can.msg.MODULE.SHOWROOM_SET.CONFIRM_LEAVE_YES,
							cssName: '',
							onClick: function ($el) {
								self._isChangeNoSave = false;
								this.close();
							}
						},
						{
							btnText: Can.msg.MODULE.SHOWROOM_SET.CONFIRM_LEAVE_NO,
							cssName: '',
							onClick: function ($el) {
								Can.Route.run('/showroom-info');
								this.close();
							}
						}
					]
				});
			}
			self.leaveWin.show();
		}
	},
	startup: function () {
		Can.view.ShowroomComInfoView.superclass.startup.call(this);
		var me = this,
			tipCon = $('<div class="tips-s4"></div>').appendTo(me.container),
            getProvinceUrl='/cfone/platformacitivity/findBizDistricts.cf',
            getCityUrl = '/cfone/platformacitivity/findBizCityDistricts.cf',
            getDistrictUrl = '/cfone/platformacitivity/findBizTownDistricts.cf';;

		$('<span class="ico"></span>').appendTo(tipCon);
		$('<div class="des">' + Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_1 + '</div>').appendTo(tipCon);
		$('<div class="verify-tip" id="verify-room">' + Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_3 + '</div>').appendTo(tipCon);
		$('<div class="tit-s2"><h3>' + Can.msg.MODULE.SHOWROOM_SET.COMP_INFO + '</h3></div>').appendTo(me.container);
		var contentCon = $('<div class="mod-form-s1"><div class="loading-s1"><span></span>Loading ...</div></div>').appendTo(me.container);

		$.ajax({
			url: Can.util.Config.seller.setShowroomModule.compInfoTemplate,
			dataType: 'text',
			success: function (html) {
				//加载模板引擎
				var template = Can.util.template.compile(html);
				contentCon.html(template({}));

                me.hideVerifyIcon();
				/*ready uploader*/
				me.initUploader();
                me.selectRegion(getProvinceUrl,getCityUrl,getDistrictUrl);//設置數據，selectRegion 方法一定要運行在 freshData 之前
				me.refreshData();

                /*  修改公司数据按钮事件
                *   注： 此按钮只有在 E广通用户 的公司资料未审核通过时才出现
                * */
                $('#editCompanyId', '#companyInforFormId').click(function () {
                    $(this).remove();
                    $('#companyInfoView', '#companyInforFormId').slideUp(function () {
                        /*改变可以修改表单的隐藏属性*/
                        //生成修改文本表单
                        var showEditInput=function(fieldId,targetId){
                            var _thisInput=$("#"+fieldId,"#companyInfoView"),_target=$("#"+targetId,"#companyInfoView");
                            _thisInput.text(_target.text()).show();
                            $("#"+targetId,"#companyInfoView").text("");
                        };
                        var $region_warp=$("#region_warp","#companyInfoView");
                        var $employees_warp=$("#employees")

                        //公司类型表单
                        $("#companyType_label").text("");
                       $("#companyType_warp","#companyInfoView").show();

                        //首先清空原有的地区信息再显示下拉表单进行修改
                        $("#region").text("");
                        $region_warp.show();
                        //首先清空原有的公司人数信息再显示下拉表单进行修改
                        $("#employees_label","#companyInfoView").text("");
                        $employees_warp.show();

                        showEditInput("address","address_label")
                        showEditInput("zipCode","zipCode_label")
                        showEditInput("commercialLicense","commercialLicense_label")

                        $(this).slideDown();
                    });
                });/*  修改公司数据按钮事件结束*/
				$('#eidtContactId', '#companyInforFormId').click(function () {
					$('#contactInfoView', '#companyInforFormId').slideUp(function () {
						$('#contactInfoEdit', '#companyInforFormId').slideDown();
					});
				});
				$('#introduction', '#companyInforFormId').keyup(function () {
					var v = this.value.length,
						l = $(this).attr('maxlength');
					$('#lenleft', '#companyInforFormId').text(l - v);
				}).attr('name', 'companyIntro');
				$('#lenleft', '#companyInforFormId').text($('#introduction', '#companyInforFormId').attr('maxlength') - $('#introduction', '#companyInforFormId').val().length);

				$("#companyInforFormId").validate({
					errorElement: 'div',
					errorClass: 'fm-error',
					rules: {
                        'address':'required',
                        'zipCode':{required: true},
                        'commercialLicense':'required',
						'webSite': 'required',
						'companyAd': 'required',
						'companyIntro': 'required',
						'mainProducts': {nonChinese: true,required: true},
						'tel1': 'required',
						'tel2': {required: true, number: true},
						'tel3': {required: true, number: true},
						'fax1': 'required',
						'fax2': {required: true, number: true},
						'fax3': {required: true, number: true},
						'mobile2': {number: true},
						'companyLogo': 'required',
						'companyImages': 'required'
					},
                    messages: {
                      'mainProducts':{nonChinese:"Please input the information in English."}
                    },
					groups: {
						telephoneTip: "tel1 tel2 tel3",
						faxTip: "fax1 fax2 fax3"
					},
					ignore: '',
					errorPlacement: function (errorEl, input) {
						if (input.attr('name') == "companyImages") {
							errorEl.insertBefore(input);
						} else {
							errorEl.appendTo(input.parent());
						};
						if (input.attr('name') == "fax1" || input.attr('name') == "fax2" || input.attr('name') == "fax3" ||
							input.attr('name') == "tel1" || input.attr('name') == "tel2" || input.attr('name') == "tel3") {
							if ($('#contactInfoEdit', '#companyInforFormId').css("display") == "none")
								$('#contactInfoView', '#companyInforFormId').slideUp(function () {
									$('#contactInfoEdit', '#companyInforFormId').slideDown();
								});
						}

						//me.disabledSave();
						//errors++;
					},
					//success: function (label) {
					//label.remove();
					//errors--;
					//if (errors == 0) {
					//me.enabledSave();
					//}
					//},
					submitHandler: function () {
						//addProduct.fireEvent('ON_SUBMIT_SUCCESS');
						me.saveCompany();
						return false;
					}
				});

				/**
				 *
				 * 表单如果更改，离开时提示
				 * @return
				 */
				me._isChangeNoSave = false;
				contentCon.off('change', 'input, textarea')
					.on('change', 'input, textarea', function () {
						me._isChangeNoSave = true;
					});

				// refs #3457
				contentCon.off('change', '#webSite')
					.on('change', '#webSite', function () {
						var $el = $(this);
						var sUrl = $el.val();
						var aBlocks = [
							'alibaba',
							'globalmarket',
							'globalsources',
							'made-in-china',
							'hktdc',
							'aliexpress'
						];

						var isBlock = false;
						$.each(aBlocks, function (k, v) {
							if (-1 !== sUrl.indexOf(v)) {
								isBlock = true;
								return false;
							}
						});

						if (isBlock) {
							if (!me.alertOther) {
								me.alertOther = new Can.util.ui.window.ActionWindow({
									width: 470,
									title: '',
									message: Can.msg.MODULE.SHOWROOM_SET.OTHER_URL_TIP,
									actions: [
										{
											btnText: Can.msg.BUTTON.OK,
											cssName: '',
											onClick: function () {
												$el.val('http://').focus();
												this.close();
											}
										}
									]
								});
							}
							me.alertOther.show();
						}
						return false;

					});


				$('#setshowroom_savebtn', '#companyInforFormId').bind('click', function () {
					if ($(this).hasClass('dis')) {
						return false;
					}
					$('#companyLogo', '#companyInforFormId').val(me.logo_uploader.getFileNameList());
					var companyImages = me.vis_uploader.getFileNameList(true).join(',');
					$('#companyImages', '#companyInforFormId').val(companyImages);
					me._isChangeNoSave = false;
					$('#companyInforFormId').submit();
				});
			}
		})

	},
	initUploader: function () {

		/*上传公司LOGO*/
		this.logo_uploader = new Can.ui.uploader({
			id: 'logoUploader',
			cssName: 'attach preview-photo inner',
			inputName: 'upload-logo',
			btnCss: 'btn btn-s12',
			previewWidth: 120,
			previewHeight: 70,
			btnText: Can.msg.MODULE.PRODUCT_FORM.UPLOAD,
			width: 70,
			maxTotal: 1,
			fileDesc: 'Image Files',
			fileType: '*.png;*.gif;*.jpg',
			fileSize: 1,
			isPreview: true,
			imgTemplate: '' +
				'<div id="${fileID}" class="w120 file-item">' +
				'   <div class="preview preview-logo">' +
				'       <img src="${previewUrl}" class="up-photo up-logo" />' +
				// '       <img src="' + Can.util.Config.static.defaultImage['blank'] + '" class="uploadify-progress-bar" />' +
				//'       <div class="preview-mk"></div>' +
				'   </div>' +

				'	<a ${deleteBind} class="exist-close" href="javascript:;" cantitle="' + Can.msg.CAN_TITLE.DELETE + '"></a>' +
				'</div>'
		});
		var _logo = $('#sr-logo');
		this.logo_uploader.el.prepend(_logo.prev('.tips-upload'));
		_logo.before(this.logo_uploader.el).remove();
		this.logo_uploader.startUploader();
		this.logo_uploader.on('ON_UPLOAD_ERROR', function (data, msg) {
			alert(Can.msg.ERROR_TEXT[msg]);
		});

		/*上传公司Tour*/
		this.tour_uploader = new Can.ui.uploader({
			id: 'tourUploader',
			cssName: 'attach preview-photo inner',
			inputName: 'upload-tour',
			btnCss: 'btn btn-s12',
			btnText: Can.msg.MODULE.PRODUCT_FORM.UPLOAD,
			width: 70,
			maxTotal: 1,
			fileDesc: 'Video Files',
			fileType: '*.flv',
			fileSize: 30,
			previewHeight: 90,
			previewWidth: 120,
			isPreview: true
		});

		var _tour = $('#sr-tour');
		this.tour_uploader.el.prepend(_tour.prev('.tips-upload'));
		this.tour_uploader.on('ON_UPLOAD_ERROR', function (data, msg) {
			alert(Can.msg.ERROR_TEXT[msg]);
		});
		_tour.before(this.tour_uploader.el).remove();
		this.tour_uploader.startUploader();
		/*上传公司Vision*/
		this.vis_uploader = new Can.ui.uploader({
			id: 'visUploader',
			cssName: 'attach preview-photo inner',
			inputName: 'upload-vis',
			btnCss: 'btn btn-s12',
			btnText: Can.msg.MODULE.PRODUCT_FORM.UPLOAD,
			width: 70,
			maxTotal: 8,
			fileDesc: 'Image Files',
			fileType: '*.png;*.gif;*.jpg',
			fileSize: 1,
			isPreview: true
		});
		this.vis_uploader.on('ON_UPLOAD_ERROR', function (data, msg) {
			alert(Can.msg.ERROR_TEXT[msg]);
		});
		var _vis = $('#sr-vis');
		this.vis_uploader.el.prepend(_vis.prev('.tips-upload'));
		_vis.before(this.vis_uploader.el).remove();
		this.vis_uploader.startUploader();
	},
    /*获取公司数据*/
    getCompanyData:function(){
        var dataStr= $.ajax({
            url: Can.util.Config.seller.setShowroomModule.setShowroomI,
            async: false,
            type: 'POST',
            data: {companyId: Can.util.userInfo().getCompanyId()}
        }).responseText;
        return( eval('(' + dataStr + ')') );
    },
	/**
	 * 刷新公司数据
	 */
	refreshData: function () {
		var _this = this;
		$('#companyInforFormId')[0].reset();
        var dataObj = _this.getCompanyData();
		var obj = dataObj.data.companyInfo;
		var jData = dataObj;
		for (var f in obj) {
			if (f == 'companyLogo' || f == 'companyVideo' || f == 'companyImages') {
				var _F;
				var i;
				switch (f) {
					case 'companyLogo':
						this.logo_uploader.company_logo = true;
						_F = [];
						obj[f] = [obj[f]];
						for (i = 0; i < Math.min(obj[f].length, 1); i++) {
							if (obj[f][i] != '' && obj[f][i] != null) {
								//console.log(obj[f][i])
								var v = obj[f][i];
								_F.push({
									fileFullName: v.abslouteUrl,
									fileName: v.url,
									title: 'Company Logo'
								});
							}
						}
						this.logo_uploader.pushFiles(_F);
						//console.log(this.logo_uploader)
						break;
					case 'companyVideo':
						_F = [];
						obj[f] = [obj[f]];
						//var $Queue = $('#' + this.tour_uploader.id + '-queue');
						for (i = 0; i < Math.min(obj[f].length, 1); i++) {
							if (obj[f][i] != '' && obj[f][i] != null) {
								var v = obj[f][i];
								_F.push({
									fileFullName: v.abslouteUrl,
									fileName: v.url,
									title: 'Company Tour'
								});
								// $Queue.append('<div id="exist-file-' + i + '" class="exist-file file-item">' +
								// 	'<div class="preview">' +
								// 	'<video width="120" height="90" poster="' + Can.util.Config['static'].defaultImage['video'] + '">' +
								// 	'<source src="' + v.abslouteUrl + '" type="video/x-flv" />' +
								// 	'<embed src="' + v.abslouteUrl + '" width="120" height="90"></embed>' +
								// 	'</video>' +
								// 	'</div>' +
								// 	'<a class="exist-close" href="javascript:;" cantitle="' + Can.msg.CAN_TITLE.DELETE + '"></a>' +
								// 	'</div>');
							}
						}
						this.tour_uploader.pushFiles(_F);
						break;
					case 'companyImages':
						_F = [];
						$.each(obj[f], function (k, v) {
							_F.push({
								fileFullName: v.abslouteUrl,
								fileName: v.url,
								title: 'Company Vision'
							});
						});
						// for (i = 0; i < Math.min(obj[f].length, 1); i++) {

						//     _F.push({
						//         fileFullName:obj[f][i]['imageUrl'],
						//         fileName: obj[f][i]['imageUrl'].substr(obj[f][i]['imageUrl'].lastIndexOf('/') + 1),
						//         title:'Company Vision'
						//     });

						// }
						this.vis_uploader.pushFiles(_F);
						break;
				}
			}
			//产品分类管理
			else if (f == 'mainProducts') {
				var wrapEl = $('#' + f + '_label', '#companyInforFormId');
				wrapEl.empty();

				var addBtn = $('<a class="btn-add" href="javascript:;"></a> ');
				var prds = obj[f];

				for (var a = 0; a < prds.length; a++) {
					var v = $.trim(prds[a].toString());
					if (v != '') {
						var tagEl = $('<div class="mod-item-q"><span>' + v + '</span></div>').appendTo(wrapEl);
						var closeEl = $('<a class="bg-ico btn-close" href="javascript:;"></a>').appendTo(tagEl);
						var valEl = $('<input name="mainProducts" type="hidden"/>').appendTo(tagEl);
						valEl.val(v);
					}
				}

				wrapEl.on('click', '.btn-close', function () {
					var tagEl = $(this).parents('.mod-item-q');
					var valEl = tagEl.find('input[name=mainProducts]');
					tagEl.fadeOut(function () {
						var _length = wrapEl.find('input[name=mainProducts]').length;
						if (_length <= 1) {
							$('<input type="text" name="mainProducts" class="w100 ipt a-edit" placeholder="' + Can.msg.MODULE.SHOWROOM_SET.MAIN_PRO_PD + '">').insertBefore(addBtn);
						}
						tagEl.remove();
						valEl.remove();
					});
					return false;
				});

				addBtn.appendTo(wrapEl);

				var valEls = [];
				addBtn.click(function () {
					var quantity = $('.mod-item-q', "#mainProducts_label").size() + $('input.a-edit', '#mainProducts_label').size();
					if (quantity >= 6) {
						Can.util.notice(Can.msg.MODULE.SHOWROOM_SET.MAX_MAIN_PRODUCT);
						//Can.util.notice(Can.msg.MODULE.BUYER_LEAD_MANAGE.SAVE);
						return false;
					}
					var valEl = $('<input type="text" name="mainProducts" class="w100 ipt a-edit" placeholder="' + Can.msg.MODULE.SHOWROOM_SET.MAIN_PRO_PD + '">').insertBefore(addBtn);
					valEls.push(valEl);
					valEl.blur(function () {
						$.each(valEls, function (k, el) {
							if (el.val().length > 20) {
								el.val("");
								Can.util.notice(Can.msg.MODULE.SHOWROOM_SET.MAX_PRODUCT_NAME);
								return false;
							}
							if (el[0] != valEl[0] && $.trim(el.val()) == '') {
								el.remove();
							}
							else {
								el.val(el.val().replace(',', ''))
							}
						})
					});
					$.each(valEls, function (k, el) {
						if (el[0] != valEl[0] && $.trim(el.val()) == '') {
							el.remove();
						}
					});
					return false;
				});
			}
			else if (f == 'form') {
				//alert('d')
				var formData = obj[f] || {};
				for (var fd in formData) {
					if (fd == 'webSite') {
						$("input#webSite").val(formData[fd]['default'])
					} else if (fd == 'companyIntro') {
						$('#introduction').text(formData[fd]['default'])
					} else if (fd == 'companyAd') {
						$('input#companyAd').val(formData[fd]['default'])
					}
					// ^ 太TM奇葩的写法,FK
					else if (formData[fd]['default']) {
						$('#' + fd, '#companyInforFormId').val(formData[fd]['default']);
					}
				}
			}
			else if (f == 'category') {
				var data = obj[f];
				var industry_el = $('#industry_label', '#companyInforFormId').empty();
				// 第一行显示大类
				if (data['industryCategories']) {
					$.each(data['industryCategories'], function (k, v) {
						//var name = Can.util.Config.lang == 'en' ? v.en : v.cn;
						industry_el.append('<div class="mod-item-q"><span>' + v.value + '</span></div>');
					});
				}
				var el = $('#' + f + '_label', '#companyInforFormId').empty();
				//el.append('<br/>');
				if (data['productCategories']) {
					$.each(data['productCategories'], function (k, v) {
						//var name = Can.util.Config.lang == 'en' ? v.en : v.cn;
						el.append('<div class="mod-item-q"><span>' + v.value + '</span></div>');
					});
				}
			}
			else if (f == 'region') {
				$('#region', '#companyInforFormId').text(Can.util.formatRegion(obj[f], "town"));
                $("#province").find("option[value='"+obj[f].provinceId+"']").attr("selected",true);
                var cityOption=$('<option value="'+obj[f].cityId+'" selected=true>'+obj[f].city+'</option>'),
                     townOption=$('<option value="'+obj[f].townId+'" selected=true>'+obj[f].town+'</option>');
                $("#city").append(cityOption);
                $("#districtId").append(townOption);
			}
            else if (f == 'companyType'){
                $("#companyType_label").text(obj[f].value)
                $('#companyType', '#companyInforFormId').val(''+obj[f].code);
            }
            else if (f == 'employees'){
                $("#employees_label").text(obj[f].value);
                $("#employees").find("option[value='"+obj[f].code+"']").attr("selected",true);
            }
			else {
				var val = obj[f];
				if (val.hasOwnProperty('value')) {
					//val = Can.util.Config.lang == 'en' ? val.en : val.cn
					val = val.value;
				}
				else if ($.isArray(val)) {
					var item = [];
					$.each(val, function (k, v) {
						if (v.hasOwnProperty('value')) {
							//item.push(Can.util.Config.lang == 'en' ? v.en : v.cn)
							item.push(v.value);
						}
						else {
							item.push(v);
						}
					});
					val = item.join(',');
				}


				$('#' + f + '_label', '#companyInforFormId').text(val);
				$('#' + f, '#companyInforFormId').val(val);
			}
		}

		//未审核
		if (jData.data.contentStatus === 0) {
			_this.container.find("#verify-room").html(Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_3);
			_this.enabledStyle();
			_this.container.find('#setshowroom_savebtn').text(Can.msg.MODULE.SHOWROOM_SET.AUDIT_1);
            _this.container.find('#companyInfoView').append($('<a class="bg-ico btn-edit-s1" cantitle="'+Can.msg.MODULE.SHOWROOM_SET.TEMPLATE_EDIT+'" href="javascript:;" id="editCompanyId"></a>'));
		}
		//审核中
		if (jData.data.contentStatus === 2) {
			_this.container.find("#verify-room").html(Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_4);
			_this.disabledStyle();
		}
		//审核不通过
		if (jData.data.contentStatus === -1) {
			_this.container.find("#verify-room").html(Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_5);
			_this.enabledStyle();
			_this.container.find('#setshowroom_savebtn').text(Can.msg.MODULE.SHOWROOM_SET.AUDIT_1)
		}
		//审核通过
		if (jData.data.contentStatus === 3) {
			_this.container.find("#verify-room").html(Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_6);
			_this.enabledStyle();
			_this.container.find('#setshowroom_savebtn').attr("status", "true");
		}
	},
	/**
	 * 可编辑状态
	 */
	enabledStyle: function () {
		var _this = this;
		_this.container.find('#companyInforFormId input').removeAttr("disabled");
		_this.container.find('#setshowroom_savebtn').removeClass('dis');
		_this.container.find('.exist-close').show();
		_this.container.find('.btn-add').show();
	},
	/**
	 * 不可编辑状态
	 */
	disabledStyle: function () {
		var _this = this;
		_this.container.find('#companyInforFormId input,#companyInforFormId textarea').attr("disabled", "false");
		_this.container.find('#setshowroom_savebtn').text(Can.msg.MODULE.SHOWROOM_SET.AUDIT).addClass('dis');
		_this.container.find('.exist-close').hide();
		_this.container.find('.btn-add').hide();
	},
	disabledSave: function () {
		$('#setshowroom_savebtn', '#companyInforFormId').addClass('dis');
		$('#setshowroom_savebtn', '#companyInforFormId').css('cursor', 'default');
		$('#setshowroom_savebtn', '#companyInforFormId').unbind('click');
	},
//	enabledSave: function () {
//		var me = this;
//		$('#setshowroom_savebtn', '#companyInforFormId').removeClass('dis');
//		$('#setshowroom_savebtn', '#companyInforFormId').bind('click', function () {
//			me.saveCompany();
//		});
//	},
	saveCompany: function () {
		var me = this;
		if (!me.isSaving) {
			me.isSaving = true;
			var loading = $('<div class="loading-s1"><span></span>Loading ...</div>').insertAfter('#setshowroom_savebtn');
			//console.log(me.vis_uploader.getFileNameList())
            $("#editCompanyId").remove();
			$('#companyLogo', '#companyInforFormId').val(me.logo_uploader.getFileNameList());
			$('#companyImages', '#companyInforFormId').val(me.tour_uploader.getFileNameList());
			var companyImages = me.vis_uploader.getFileNameList(true).join(',');

			$('#companyImages', '#companyInforFormId').val(companyImages);
			var fields = $('#companyInforFormId').serializeArray();
			var params = {};
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
                if (params[field.name]){
                    params[field.name] = params[field.name] + ',' + field.value;
                }
				else
					params[field.name] = field.value;
			}
			params.companyImages = me.vis_uploader.getFileNameList(true).join(',');
			params.companyLogo = me.logo_uploader.getFileNameList();
			params.companyVideo = me.tour_uploader.getFileNameList();
			$.ajax({
				data: params,
				url: Can.util.Config.seller.setShowroomModule.saveCompanyInfo,
				type: 'POST',
				success: function () {
					me.isSaving = false;
					// 不知道这里在保存完成后要重新去请求数据是否有意义，现注释掉，
					// 如果后面发现因此注释而引起问题请先与我沟通 by Angus
					// me.refreshData();
					//mainPrd  保存后改变mainPrd的样式为灰色的样式
					var mainPrd = $('#mainProducts_label').find('input[type="text"]');
					$.each(mainPrd, function (i, element) {
						if ($(element).attr("value") != "") {
							$('<div class="mod-item-q"><span>' + $(element).attr("value") + '</span><a class="bg-ico btn-close" href="javascript:;"></a><input type="hidden" name="mainProducts" value="' + $(element).attr('value') + '" /></div>').insertBefore($('#mainProducts_label').find('a:last'));
						}
						$(element).remove();
					})
					//mainPrd  end
					loading.remove();
					delete loading;
					Can.util.notice(Can.msg.MODULE.BUYER_LEAD_MANAGE.SAVE);
					if (!me.container.find('#setshowroom_savebtn').attr("status")) {
						me.container.find("#verify-room").html(Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_4);
						me.disabledStyle();
					}

					/*
					 var tipBox = new Can.ui.textTips({
					 target:$('.actions'),
					 hasArrow:false,
					 hasIcon:true,
					 iconCss:'text-tips-icon',
					 text:Can.msg.MODULE.BUYER_LEAD_MANAGE.SAVE,
					 id:'top_tip'
					 });
					 tipBox.show();
					 tipBox.updateCss({
					 marginLeft:-550
					 });
					 setTimeout(function () {
					 tipBox.hide();
					 }, 1500);
					 */
				}
			});
		}
	},
    selectRegion:function(provinceUrl,cityUrl,districtUrl){
        var createOption = function(obj, data) {
            data.unshift({
                code: '',
                cnName: '请选择',
                enName:'Please select'
            });
            var opObj = $(obj),
                opData = data,
                opStr = '',
                i;
            for (i in opData) {
                opStr += '<option value="' + opData[i].code + '">' +(Can.util.Config.lang=="en"? opData[i].enName:opData[i].cnName)+ '</option>';
            }
            opObj.html(opStr);
            opObj.val(data[0].code);
        }
        /*获取省份数据并渲染地区表单*/
        $.ajax({
            url:provinceUrl,
            async:false,
            success:function(data){
                if(data.status=="success"){
                    createOption("#province",data.data)
                }
            }
        });
        $("#province").change(function() {
            var provinceId = $('#province').val();
            $.ajax({
                type : "post",
                url : cityUrl,
                data : {provinceId: provinceId},
                async : false,
                success : function(jData){
                    if (jData && jData['status'] === 'success' && jData.data) {
                        createOption('#city', jData.data);
                    }
                }
            });
        });
        $("#city").change(function(){
            var cityId = $('#city').val();
            $.ajax({
                type : "post",
                url : districtUrl,
                data : {cityId: cityId},
                async : false,
                success : function(jData){
                    if (jData && jData['status'] === 'success' && jData.data) {
                        createOption('#districtId', jData.data);
                    }
                }
            });
        })
    },
    hideVerifyIcon:function(){
        var _package = Can.util.userInfo().getServices(),
            _contentState = this.getCompanyData().data.contentStatus;
        if(_package[0] == 17 && _contentState != 3){
            var aHideIconLabelId=['companyType_label','region','address_label','zipCode_label','commercialLicense_label','employees_label'];
            var fHideInit=function(aLabelId){
                $.each(aLabelId,function(i,item){
                    $("#"+item).parents(".field").find(".ico-verified").remove();
                })
            }
            fHideInit(aHideIconLabelId);
        }
    }
});

