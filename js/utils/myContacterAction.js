/**
 * @Author: sam
 * @Version: 1.3
 * @Update: 13-6-17
 */

$.moduleAndViewAction('myContacterModuleId', function (contacter) {
//	var tipBox = new Can.ui.textTips({
//		target: contacter.titleContainerEL,
//		hasArrow: false,
//		arrowIs: 'Y',
//		hasIcon: true,
//		iconCss: 'text-tips-icon'
//	});
//	tipBox.updateCss({
//		marginTop: -55,
//		marginLeft: 220
//	});
	contacter.loadMenu();
	contacter.turnPage();

	var _xdelgroup = null;
	contacter.on('ON_MENU_EDIT', function (menu) {
		var data = Can.util.room[menu.data('room')],
			input = data.input;

		if (!input) {
			input = $('<input type="text" class="ipt" value="' + data.groupName + '">');
			data.input = input;
			input.appendTo(menu);
		} else {
			input.show();
		}

		menu.find('a').hide();
		input.select();

		input.blur(function () {
			var value = input.val();
			if(_xdelgroup){
				_xdelgroup.abort();
			}
			_xdelgroup = $.ajax({
				url: Can.util.Config.contacts.group.edit,
				type: 'POST',
				data: {
					groupId: data.groupId,
					groupName: value
				},
				success: function () {
					menu.find('a').show();
					menu.find('[role=label]').text(value);
					input.hide();
				}
			});
			
		});

	});

	var _xremove = false;
	contacter.on('ON_MENU_CLOSE', function (menu) {
		var data = Can.util.room[menu.data('room')];
		if(!_xremove){
			$.ajax({
				type: 'POST',
				url: Can.util.Config.contacts.group.remove,
				data: {
					groupId: data.groupId
				},
				beforeSend: function(){
					_xremove = true;
				},
				complete: function(){
					_xremove = false;
				},
				success: function () {
					menu.remove();
				}
			});
		}

		/*
		 $.ajax({
		 url: Can.util.Config.delete_contacter,
		 data: {
		 },
		 success: function (resultData) {
		 if (resultData.status == "success") {
		 contacter.removeAllMenu();
		 contacter.update_Item(resultData.data);
		 tipBox.update(Can.msg.MODULE.MY_CONTACTS.DELETE);
		 tipBox.show();
		 setTimeout(function () {
		 tipBox.hide();
		 }, 1500)
		 }
		 else {
		 tipBox.update(Can.msg.MODULE.MY_CONTACTS.DELETE_FAIL);
		 tipBox.show();
		 setTimeout(function () {
		 tipBox.hide();
		 }, 1500)
		 }
		 }
		 })
		 */
	});
	//静态表单点击
	contacter.on('STATIC_LiITEM_CLICK', function (Obj) {
		$(Obj).find("ul").removeClass("hidden");
		$(Obj).find("a[class='bg-ico tit-retracting']").removeClass("tit-retracting").addClass("tit-unfold");
		$(Obj).siblings().find("a[class='bg-ico tit-unfold']").removeClass("tit-unfold").addClass("tit-retracting");
		$(Obj).siblings().find("ul").addClass("hidden");
	});
	var _xupdate_group = null;
	contacter.on("UPDATE_GROUP_LIST", function (groupId) {
		if (groupId) {
			if(_xupdate_group){
				_xupdate_group.abort();
			}
			_xupdate_group = $.ajax({
					url: Can.util.Config.seller.myContacterModule.mycontacter,
					data: groupId,
					cache: false,
					success: function (resultData) {
						if (resultData.status == "success") {
							contacter.fireEvent('ON_LOAD_DATA', resultData);
						}
					}
				})
		}
		return false;
	});


	//静态表单小项目点击
	contacter.on('STATIC_liItems_CLICK', function (Obj) {
		if (Obj) {
			$.ajax({
				url: Can.util.Config.seller.myContacterModule.mycontacter,
				type: 'POST',
				data: Obj,
				success: function (resultData) {
					if (resultData.status == "success") {
						contacter.fireEvent('ON_LOAD_DATA', resultData);
					}
				}
			})
		}
//        $(Obj).find("a[class='bg-ico tit-retracting']").removeClass("tit-retracting").addClass("tit-unfold");
//        $(Obj).siblings().find("a[class='bg-ico tit-unfold']").removeClass("tit-unfold").addClass("tit-retracting");
//        $(Obj).siblings().find("ul").addClass("hidden");
	});


	contacter.on('ON_LOAD_DATA', function (Obj) {
		var _this = this;
		var aData = Obj.data;
		if (!Obj.page) {
			Obj.page = {page: 1, total: 0, pageSize: 0}
		}
		if (_this.page_feild) {
			Can.apply(_this.page_feild, {
				current: Obj.page.page,
				total: Obj.page.total,
				limit: Obj.page.pageSize
			});
			_this.page_feild.refresh();
		}
		var dataTable = this.tableNav;
		var aReturnData = [];
		var role = Can.util.userInfo().getUserType() === 1 ? 'supplier' : 'buyer';

		if (aData.length > 0) {
			for (var i = 0; i < aData.length; i++) {

				aReturnData[i] = [];
				//select field
				var selectNav = new Can.ui.tick();
				selectNav.el.data('customerid', aData[i].customerId);
				selectNav.on('ON_TICK', function (isChecked) {
					if (isChecked) {
						$(this).parents("tr").addClass("selected");
					}
					else {
						$(this).parents("tr").removeClass("selected");
					}
				}, selectNav.el);
				/*person*/
				var _pic = new Can.ui.Panel({
					cssName: 'pic',
					html: Can.util.formatImage(aData[i].pic, '60x60', (aData[i].gender * 1 === 2 ? 'female' : 'male'))
				});
				var _info = new Can.ui.Panel({cssName: 'info'});
				var _info_name = new Can.ui.Panel({
					cssName: 'name',
					wrapEL: 'p'
				});
				var _info_name_btn = new Can.ui.toolbar.Button({
					text: aData[i].name
				});
				_info_name_btn.el.attr('id', aData[i].contacterId);
				_info_name_btn.on('onclick', function () {
					contacter.fireEvent('ON_CONTACTERNAME_CLICK', this.el.attr('id'));
				});
				_info_name.addItem(_info_name_btn);

				var _info_more = new Can.ui.Panel({
					cssName: 'country',
					wrapEL: 'p'
				});
				var _flag = '<span class="flags fs' + aData[i].countryId + '"></span>';
				var _country = '<span class="txt">' + aData[i].country + '</span>';
				var _num = aData[i].numOfExh;
				if (_num) {
					_num = new Can.ui.Panel({cssName: 'mth', wrapEL: 'span', html: aData[i].numOfExh});
					_num.el.attr({
						"canID": aData[i].numOfExh,
						"cantitle": Can.msg.CAN_TITLE.EXP_NUM.replace('[@]', aData[i].numOfExh)
					});
					(function (data, _num, contacter) {
						_num.el.click(function () {
							contacter.fireEvent('ON_numOfEx_CLICK', _num.el, data);
							return false;
						}).css({
								cursor: 'pointer'
							});
						// _num.on('onclick', function (numOfExh) {
						// 	contacter.fireEvent('ON_numOfEx_CLICK', this.el, data);
						// 	return false;
						// });
					})(aData[i], _num, contacter);
				}

				var company_name, company_name_raw = aData[i].companyName;

				if (role === 'buyer') {
					company_name = new Can.ui.Panel({
						cssName: 'cpy-name',
						wrapEL: 'p',
						html: company_name_raw
					});
					company_name.el.attr('title', company_name_raw);
					_country = '<span class="txt">' + Can.util.formatRegion(aData[i].region) + '</span>';
				}

				_info_more.addItem([_flag, _country, _num]);
				_info.addItem([_info_name, _info_more, company_name]);

				var _person = new Can.ui.Panel({
					cssName: 'mod-person',
					items: [_pic, _info]
				});

				/*match*/
				var _match = new Can.ui.Panel({
					cssName: 'mod-mch ' + fCountMatchLevel(aData[i].match),
					html: Can.msg.MATCH + ': <em>' + aData[i].match + '%</em>'
				});
				_match.el.attr("cantitle", Can.msg.CAN_TITLE.MATCH.replace('[@]', aData[i].match));
				/*credit*/
				/*
				 var _credit = new Can.ui.Panel({
				 cssName: 'mod-crt ' + fCountCreditLevel(aData[i].credit),
				 html: Can.msg.CREDIT + ': <em>' + aData[i].credit + '</em>'
				 });
				 _credit.el.attr({
				 "contacterID": aData[i].customerId,
				 "cantitle": Can.msg.CAN_TITLE.CF_LEVEL.replace('[@]', aData[i].credit)
				 });
				 (function (data, _credit, contacter) {
				 _credit.el.click(function () {
				 contacter.fireEvent('ON_credit_CLICK', data, _credit.el)
				 return false;
				 });
				 // _credit.on("onclick", function (numOfExh) {
				 // 	contacter.fireEvent('ON_credit_CLICK', this.el.attr('contacterID'));
				 // });
				 })(aData[i], _credit, contacter);
				 */
				if (aData[i].credit) {
					var _credit = new Can.ui.Panel({
						cssName: 'mod-crt mod-crt-token',
						html: ''
					});
					_credit.el.attr({
						"contacterid": aData[i].contacterId,
						"cantitle": Can.msg.CAN_TITLE.SINO_RATING
					});
					(function (data, _credit, contacter) {
						_credit.el.click(function () {
							contacter.fireEvent('ON_credit_CLICK', data, _credit.el);
							return false;
						});
						// _credit.on("onclick", function (numOfExh) {
						// 	contacter.fireEvent('ON_credit_CLICK', this.el.attr('contacterID'));
						// });
					})(aData[i], _credit, contacter);
				} else {
					_credit = '';
				}

				/*opt*/
				var infoSet = new Can.ui.Panel({
					wrapEL: 'span',
					cssName: aData[i].infoDisclosed === 0 ? 'bg-ico ico-encrypt' : 'bg-ico ico-public'
				});
				if (aData[i].infoDisclosed === 0) {
					infoSet.el.attr('cantitle', Can.msg.MODULE.PRODUCT_FORM.PRIVACY);
				}
				else {
					infoSet.el.attr('cantitle', Can.msg.MODULE.MY_CONTACTS.PRIVATE_OPEN);
				}

				var privacy
					, privacy_raw = aData[i].infoDisclosed
					, switcher = privacy_raw === 1 ? '1px' : '-43px'
					, privacy_locale = Can.msg.PRIVACY;

				if (role === 'buyer') {
					privacy = $([
						'<div class="mod-switch" style="height:22px;">',
						'<div style="margin-left:' + switcher + ';" class="op" role="switch-privacy" data-id="' + aData[i].customerId + '" data-privacy="' + privacy_raw + '"><span class="txt">' + privacy_locale['PUBLIC'] + '</span><span class="turn-ico"></span><span class="txt">' + privacy_locale['SECRET'] + '</span></div>',
						'<div class="bg"></div>',
						'</div>'
					].join(''));
				}

				//last contact time
				var contacttime = new Can.ui.Panel({
					wrapEL: 'span',
					cssName: 'time',
					html: Can.util.formatDateTime(aData[i].lastcontact, 'YYYY-MM-DD hh:mm')
				});
				var track = new Can.ui.toolbar.Button({
					cssName: 'bg-ico ico-lx'
				});
				track.el.attr({
					"contacterid": aData[i].contacterId,
					"cantitle": Can.msg.CAN_TITLE.BUSINESS_FOLLOW
				});
				track.on('onclick', function () {
					contacter.fireEvent('ON_track_CLICK', this.el.attr('contacterid'));
				});
				var concateNow = new Can.ui.toolbar.Button({
					cssName: 'bg-ico ico-quote'
				});

				concateNow.el.attr({
					"cantitle": Can.msg.CAN_TITLE.CONTACT_CUSTOMER
				});
				concateNow.el.data({
					'contacter': aData[i],
					"cantitle": Can.msg.CAN_TITLE.CONTACT_CUSTOMER
				});
				concateNow.on('onclick', function () {
					contacter.fireEvent('ON_CONTACT_CLICK', this.el.data('contacter'));
				});
				//创建 im 图标: vfasky
				var chatIcon = new Can.ui.Panel({
					id: 'SkypeButton' + i,
					cssName: 'io-skype io-skype-c',
				});					
				
      									
				/*chatIcon.el.attr({
					"cantitle": Can.msg.IM.OFFLINE
				}).css({
						marginLeft: 6
					}).data({
						'contacter': aData[i],
						'cantitle': Can.msg.IM.OFFLINE,
						'setStatus': function (status, data) {
							if (status == 'online') {
								chatIcon.el.attr({
									'class': 'bg-ico ico-chat-online',
									'cantitle': Can.msg.IM.CHAT_NOW
								}).data('cantitle', Can.msg.IM.CHAT_NOW)
							}
							else {
								chatIcon.el.attr({
									'class': 'bg-ico ico-chat',
									'cantitle': Can.msg.IM.OFFLINE
								}).data('cantitle', Can.msg.IM.OFFLINE)
							}
						}
					});*/
				//绑定Im
				// (function (el, userId) {
				// 	Can.util.bindIM.add(el, userId);
				// })(chatIcon.el, aData[i].contacterId);

				var oprateNav = new Can.ui.Panel({
				});
				oprateNav.addItem(track);
				oprateNav.addItem(concateNow);
				oprateNav.addItem(chatIcon);

				aReturnData[i].push(selectNav);
				aReturnData[i].push(_person.el);
				aReturnData[i].push(_match.el);
				if (role === 'supplier') {
					aReturnData[i].push(_credit.el);
					aReturnData[i].push(infoSet.el);
				}
				aReturnData[i].push(contacttime.el);
				if (role === 'buyer') {
					aReturnData[i].push(privacy);
				}
				aReturnData[i].push(oprateNav.el);
				
			}
//            console.log(aData)
//            contacter.content_right.addItem(contacter.tableNav);
//            contacter.content_right.addItem(contacter.page_mod);

		} else {
			var noContact = contacter.create_NoContact();
		}
		dataTable.data['room'] = aData;
		dataTable.data['item'] = aReturnData;
		dataTable.update();

		//如果联系人为空的情况
		if (noContact) {
			dataTable.el.find("tbody").find("tr").unbind("mouseenter");
			dataTable.el.find("tbody").find("td:first").html(noContact);
		}

		if (contacter.page_feild.current < Math.ceil(contacter.page_feild.total / contacter.page_feild.limit)) {
			contacter.stepButton.group[0].el.removeClass("dis");
		} else {
			contacter.stepButton.group[1].el.addClass("dis");
		}
		if (contacter.page_feild.current > 1) {
			contacter.stepButton.group[1].el.removeClass("dis");
		} else {
			contacter.stepButton.group[0].el.addClass("dis");
		}
		
		//skype渲染
		if (aData.length > 0) {
			for (var i = 0; i < aData.length; i++) {
			//console.log(aData[i].skype)
				if (aData[i].skype) {
                    Skype.ui({
	                    "name" : "dropdown",
	                    "element" : 'SkypeButton' + i,
	                    "participants" : [aData[i].skype],
	                    "statusStyle" : "mediumicon",
	                    "millisec" : "5000",
	                    "cfecId": aData[i].contacterId
	                });
                }                
			}
		}
	});

	contacter.on('View_All', function () {
		contacter.fireEvent("UPDATE_GROUP_LIST", {});
	});

	/*click tr to select*/
	contacter.tableNav.on('ON_TR_CLICK', function ($Tr, event) {
		if (event.target.tagName.toUpperCase() === 'TD') {
			$Tr.toggleClass('selected');
			var $Chk = $Tr.find('input[type="checkbox"]');
			if ($Tr.hasClass('selected')) {
				$Chk.attr('checked', true);
			}
			else {
				//trigger have a problem, so...
				$Chk.attr('checked', true);
				$Chk.attr('checked', false);
			}
		}
	});
	/*hover tr to show delete button*/
	contacter.tableNav.on('ON_TR_OVER', function ($Tr, jData) {
		$Tr.addClass('hover');
		contacter.delIco
			.show()
			.css({
				top: $Tr.offset().top,
				left: $Tr.offset().left + $Tr.width()
			})
			.data('customerid', jData.customerId)
			.mouseleave(function () {
				$Tr.removeClass('hover');
				$(this).hide();
			});
		$Tr.unbind('mouseleave').bind('mouseleave', function (event) {
			if (event.relatedTarget != contacter.delIco[0]) {
				$Tr.removeClass('hover');
				contacter.delIco.hide();
			}
		});
	});

	var _bDelContacter = false;
	contacter.on('ON_CLOSE_CLICK', function (_thisObj) {
		if(!_bDelContacter){
			var id = contacter.delIco.data("customerid");
			$.ajax({
				url: Can.util.Config.seller.myContacterModule.delete_contacter,
				data: {"customerId": id},
				type: 'POST',
				beforeSend: function(){
					_bDelContacter = true;
				},
				complete: function(){
					_bDelContacter = false;
				},
				success: function(resultData){
					if(resultData.status == "success"){
						//提示成功
						Can.util.notice(Can.msg.MODULE.MY_CONTACTS.DEL_TIPS);
						//从IM里删除相应联系人
						if (window['WebIM']) {
							for (var i = 0; i < resultData.data.length; i++) {
								WebIM.removeContact(resultData.data[i]);
							}
						}
						//重新加载列表内容
						contacter.setContacterData(Can.util.Config.seller.myContacterModule.mycontacter, {page: 1});
					}else{
	                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, resultData);
	                }
				}
			});
		}

//		$.post(Can.util.Config.seller.myContacterModule.delete_contacter, {"customerId": id}, function (resultData) {
//			if (resultData.status == "success") {
				//提示成功
//				Can.util.notice(Can.msg.MODULE.MY_CONTACTS.DEL_TIPS)
//				var tipBox = new Can.ui.textTips({
//					target: contacter.titleContainerEL,
//					hasArrow: false,
//					arrowIs: 'Y',
//					hasIcon: true,
//					iconCss: 'text-tips-icon',
//					text: Can.msg.MODULE.MY_CONTACTS.DEL_TIPS, id: 'top_tip'
//				});
//				tipBox.show();
//				tipBox.updateCss({
//					marginTop: -50,
//					marginLeft: 200
//				});
//				setTimeout(function () {
//					tipBox.hide();
//				}, 1500);
				//从IM里删除相应联系人
//				if (window['WebIM']) {
//					for (var i = 0; i < resultData.data.length; i++) {
//						WebIM.removeContact(resultData.data[i]);
//					}
//				}
				//重新加载列表内容
//				contacter.setContacterData(Can.util.Config.seller.myContacterModule.mycontacter, {page: 1});
//			}
			///更新列表及菜单组的个数

//		});
//        alert("delete this")
	});

	contacter.on('ON_CONTACTERNAME_CLICK', function (id) {
		Can.util.canInterface('personProfile', [Can.util.userInfo().getUserType() === 1 ? 2 : 1, id]);
	});
	contacter.on('ON_numOfEx_CLICK', function (el, data) {
		//显示出具休届数
		var html = '<br/>' + data.exhDetail.join('; ');
		var lan = Can.msg.MODULE.MY_CONTACTS.EXH_DETAIL.replace('@', html);
		el.data('canTitleObj').update(lan);
	});
	contacter.on('ON_track_CLICK', function (id) {
		var tracelWin = new Can.view.titleWindowView({
			title: Can.msg.MODULE.MY_CONTACTS.TRACE,
			width: 980,
			height: 480
		});
		tracelWin.content.el.addClass('win-propelling');

		var url, that = this, submitURL, id_name, form;

		if (Can.util.userInfo().getUserType() === 1) {
			url = Can.util.Config.seller.profileWindow.buyerProfile;
			submitURL = Can.util.Config.buyer.profileWindow.saveFollow;
			id_name = 'buyerId';
		} else {
			url = Can.util.Config.buyer.profileWindow.supplierProfile;
			submitURL = Can.util.Config.seller.profileWindow.saveFollow;
			id_name = 'supplierId';
		}

		form = new Can.ui.Panel({
			wrapEL: 'form'
		});
		form.addItem($('<input type="hidden" name="' + id_name + '" value="' + id + '">'));
		form.addItem($('<input type="hidden" name="from" value="1">'));

		this.userGradeForm = new Can.view.userGradeView({
			cssName: 'tab-cont p-follow',
			gradeCss: 'mod-form-s1',
			tagCss: 'impression-eva clear',
			groupCss: 'f-group clear'
		});
		form.addItem(this.userGradeForm.contentEl);
		var _aLabel = [];
		var _aValue = [];
		var _normal;
		var _data;

		$.ajax({
			url: url,
			data: {
				userId: id
			},
			type: 'POST',
			// async: false,
			success: function (d) {
				_data = d.data.follow;
				for (var i = 0; i < _data.group.length; i++) {
					var w = _data.group[i];
					if (!_normal && w.isSelect) {
						_normal = w.groupId;
					}
					_aLabel.push(w.groupName);
					_aValue.push(w.groupId);
				}
				that.userGradeForm.setContent({
					gradeData: _data.form,
					tagData: _data.remarks,
					groupData: {
						normal: _normal,
						labelItems: _aLabel,
						valueItems: _aValue
					}
				});
				var _follow = that.userGradeForm.contentEl;
				//Save button
				var $SaveNode = $('<div style="margin-left: 140px;"></div>');
				that.followSaveBtn = new Can.ui.toolbar.Button({
					cssName: 'ui-btn btn-s btn-gray',
					text: Can.msg.BUTTON.SAVE
				});
				that.followSaveBtn.el.attr('role', 'submit');
				that.followSaveBtn.applyTo($SaveNode);
				$SaveNode.appendTo(_follow);
				tracelWin.setContent(form);
				tracelWin.show();
			}
		});

		tracelWin.main.el.on('click', '[role=submit]', function () {
			$.ajax({
				url: submitURL,
				data: form.el.serialize(),
				type: 'POST',
				success: function (jData) {
					if (jData.status && jData.status === 'success') {
						tracelWin.close();
						Can.util.canInterface('whoSay', ['Saved!'])
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		});
	});

	contacter.on('ON_CONTACT_CLICK', function (contacter) {
		var _data = {
			address: {
				text: contacter.name,
				value: contacter.contacterId
			}
		};
		Can.util.canInterface('writeEmail', [Can.msg.MESSAGE_WINDOW.WRITE_TIT, _data]);
	});

	contacter.on('ON_credit_CLICK', function (data, el) {
		/*
		 var sTit, sURL;
		 if (data.userType == 1) {
		 sTit = Can.msg.INFO_WINDOW.SUPPLIER_TIT;
		 sURL = Can.util.Config.buyer.profileWindow.supplierProfile
		 }
		 else {
		 sTit = Can.msg.INFO_WINDOW.BUYER_TIT;
		 sURL = Can.util.Config.seller.profileWindow.buyerProfile;
		 }
		 Can.util.canInterface('personProfile', [sTit, sURL , el.attr('contacterID')]);
		 */
		Can.util.canInterface('creditRating', [el.attr('contacterID')]);
	});
	contacter.on('onnextclick', function () {
		if (contacter.stepButton.group[1].el.hasClass("dis")) {
			return;
		}
		contacter.page_feild.current += 1;
		if (contacter.page_feild.current < Math.ceil(contacter.page_feild.total / contacter.page_feild.limit)) {
			contacter.page_feild.refresh();
			contacter.page_feild.fireEvent('ON_CHANGE', contacter.page_feild.current);
			contacter.stepButton.group[0].el.removeClass("dis");
		} else {
			contacter.stepButton.group[1].el.addClass("dis");
		}
	});
	contacter.on('onprevclick', function () {
		if (contacter.stepButton.group[0].el.hasClass("dis")) {
			return;
		}
		contacter.page_feild.current -= 1;
		if (contacter.page_feild.current > 1) {
			contacter.page_feild.refresh();
			contacter.page_feild.fireEvent('ON_CHANGE', contacter.page_feild.current);
			contacter.stepButton.group[1].el.removeClass("dis");
		} else {
			contacter.stepButton.group[0].el.addClass("dis");
		}
	});

	var xdelete_click = false;
	contacter.on('ON_DELETE_CLICK', function (selected_lists) {
		if (selected_lists.length) {
			var pram = "customerId=";
			for (var l = 0; l < selected_lists.length; l++) {
				if (l == 0)
					pram += selected_lists[l]
				else
					pram += "&customerId=" + selected_lists[l]
			}
			if(!xdelete_click){
				$.ajax({
					url: Can.util.Config.seller.myContacterModule.delete_contacter,
					data: pram,
					beforeSend: function(){
						xdelete_click = true;
					},
					complete: function(){
						xdelete_click = false;
					},
					type: 'POST',
					success: function (resultData) {
						if (resultData.status == "success") {
							//重新加载内容项
							contacter.setContacterData(Can.util.Config.seller.myContacterModule.mycontacter, {page: contacter.page_feild.current});
							contacter.selectAllFeild.unSelect();

	//                        alert(contacter.ulNav.el.find("a").text());
							contacter.reload_unread_number();
							Can.util.notice(Can.msg.MODULE.MY_CONTACTS.DEL_TIPS);
	//						var tipBox = new Can.ui.textTips({target: contacter.titleContainerEL, hasArrow: false, arrowIs: 'Y', hasIcon: true, iconCss: 'text-tips-icon', text: Can.msg.MODULE.MY_CONTACTS.DEL_TIPS});
	//						tipBox.show();
	//						tipBox.updateCss({
	//							marginTop: -50,
	//							marginLeft: 200
	//						});
	//						setTimeout(function () {
	//							tipBox.hide();
	//						}, 1500);
							if (window['WebIM']) {
								for (var i = 0; i < resultData.data.length; i++) {
									WebIM.removeContact(resultData.data[i]);
								}
							}
						} else {
							Can.util.notice(Can.msg.MODULE.MY_CONTACTS.DEL_FAIL)
	//						var tipBox = new Can.ui.textTips({target: contacter.titleContainerEL, hasArrow: false, arrowIs: 'Y', hasIcon: true, iconCss: 'text-tips-icon', text: Can.msg.MODULE.MY_CONTACTS.DEL_FAIL});
	//						tipBox.show();
	//						tipBox.updateCss({
	//							marginTop: -50,
	//							marginLeft: 200
	//						});
	//						setTimeout(function () {
	//							tipBox.hide();
	//						}, 1500);
						}
					}
				})
			}
			
		} else {
			Can.util.notice(Can.msg.MODULE.MY_CONTACTS.SELECT_SOMEONE)
//			var tipBox = new Can.ui.textTips({target: contacter.titleContainerEL, hasArrow: false, arrowIs: 'Y', hasIcon: true, iconCss: 'text-tips-icon', text: Can.msg.MODULE.MY_CONTACTS.SELECT_SOMEONE});
//			tipBox.show();
//			tipBox.updateCss({
//				marginTop: -50,
//				marginLeft: 200
//			});
//			setTimeout(function () {
//				tipBox.hide();
//			}, 1500);
		}
	});

	contacter.on('ON_SELECT_CLICK', function (_th) {
		if (_th.attr("checked")) {
			_th.parents("tr").addClass("selected")
		} else {
			_th.parents("tr").removeClass("selected")
		}
	});
	contacter.on('ON_SELECT_ALL', function () {
		contacter.tableNav.el.find("input[type='checkbox']").attr("checked", true);
		contacter.tableNav.tbody.find("tr").addClass("selected");
	});

	contacter.on('CANCEL_SELECT_ALL', function () {
		contacter.tableNav.el.find("input[type='checkbox']").attr("checked", false);
		contacter.tableNav.tbody.find("tr").removeClass("selected");
	});

	/*
	 cfone/customer/isOpenInfo.cf?customerId=XX&infoDisclosed=0
	 是否公开信息
	 0 未公开 1 公开
	 */
	contacter.contentEl.on('click', '[role=switch-privacy]', function () {
		var $this = $(this)
			, privacy = $(this).data('privacy')
			, value = privacy === 0 ? 1 : 0
			;

		$.ajax({
			url: Can.util.Config.contacts.publicInfo,
			type: 'POST',
			data: {
				customerId: $(this).data('id'),
				infoDisclosed: value
			},
			success: function (d) {
				if (d['status'] !== 'success') {
					return;
				}

				$this.animate({
					marginLeft: (privacy === 0 ? '1px' : '-43px')
				}, 500, function () {
					$this.data('privacy', value);
				});
			}
		});

	});

	/*
	 contacter.ul_inner.el.on('click', '[role=group-item]', function(e){
	 contacter.fireEvent("UPDATE_GROUP_LIST", {"groupId": Can.util.room[$(this).data('room')].groupId});
	 e.preventDefault();
	 });
	 */

});
