/**
 * @Author: sam
 * @version: v1.1
 * @since:13-8-9
 */
'use strict';

Can.module.BuyingLeadDetailModule = Can.extend(Can.module.BaseModule, {
	id: 'buyingLeadDetailModuleId',
	title: 'buyingLeadDetail',
	bid: null,
	buyerL_title: null, //当前的BuyerLead标题，回复时的placeholder用到
	blType_mark: '',
	//默认是外围采购商身分查看，供应商外围查看时要传递参数：user=supplier;内围查看在构造Module时会重置下面两参数
	isLogin: false,
	userType: 'buyer',

	requireUiJs: [ 'js/seller/view/productPicView.js'],
	actionJs: ['js/utils/buyingLeadDetailModuleAction.js'],

	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.module.BuyingLeadDetailModule.superclass.constructor.call(this);
		this.addEvents('onPrevClick', 'onNextClick', 'onBackClick', 'onNameClick', 'submitBtnClick',
			'onTapClick', 'seeReply', 'onExhibitTipClick', 'onExhibitPicClick', 'onCompanyNameClick', 'showBooth', 'hideBooth');
	},

	startup: function (buyingLeadDetail) {
		Can.module.BuyingLeadDetailModule.superclass.startup.call(this);
	},
	/*右上操作按钮*/
	setOperateBtn: function () {
		var _this = this;
		this.fncContainer.el.html('');
		/*返回按钮*/
		this.backBtn = new Can.ui.toolbar.Button({
			id: 'backBtnId',
			cssName: 'btn-back'
		});
		this.backBtn.el.attr('cantitle', Can.msg.CAN_TITLE.BACK);
		this.fncContainer.addItem(this.backBtn);
		this.backBtn.click(function () {
			_this.fireEvent('onBackClick');
		});

     
        /*上一页、下一页按钮，this.queue:只有通过列表进来的才有,路由打开的页面不会有此两个按钮*/
		
        if (this.queue) {
			this.stepBtn = new Can.view.stepBtnView();
			this.stepBtn.startup();
			this.fncContainer.addItem(this.stepBtn.group);
			this.stepBtn.onRightClick(function () {
				if (_this.stepBtn.group[1].el.hasClass("dis"))
					return;
				_this.fireEvent('onNextClick');
			});
			this.stepBtn.onLeftClick(function () {
				if (_this.stepBtn.group[0].el.hasClass("dis"))
					return;
				_this.fireEvent('onPrevClick');
			});
			this.setStepBtnCss(_this);
		}
	},
	/*设置上一步下一步按钮的不可用样式*/
	setStepBtnCss: function (buyingLeadM) {
        if(!this.queue|| !this.queue[buyingLeadM.bid]){
            return;
        }
		if (!(this.queue[buyingLeadM.bid].prev)) {
			this.stepBtn.group[0].el.addClass("dis");
		}
		if (!(this.queue[buyingLeadM.bid].next)) {
			this.stepBtn.group[1].el.addClass("dis");
		}
	},
	/* buyerlead：传进来的对象参数 ---｛buyerleadId：12345｝*/
	loadData: function (buyerlead) {
		if (this.isLogin) {
			//this.routeMark(this._id);
            this._oRoutArgs.id = buyerlead.buyerleadId;
            this.routeMark();
		}
		this.userType = this.userType.toLocaleLowerCase();
//        var sIsPush = (this.blType_mark == "all" ? 0 : 1), url;
		var url;
		var me = this;
		if (this.userType === "supplier") {
			url = Can.util.Config.seller.buyerleadDetailModule.supplierDetail;
		} else {
			if (this.isLogin) {
				url = Can.util.Config.seller.buyerleadDetailModule.buyerDetailIn;
			} else {
				url = Can.util.Config.seller.buyerleadDetailModule.buyerDetailOut;
			}
		}

		if (url) {
			$.get(url, {leadId: buyerlead.buyerleadId}, function (oResult) {
				var jResult = eval('(' + oResult + ')');
				if (jResult.status === "success") {
					me.updateTitle(jResult.data.productName);
					me.contentEl.html('');
					/*标题、时间、用户信息块*/
					me.infoNav = new Can.ui.Panel({cssName: 'detail-box clear'});
					var sUserPhoto;
					/*添加用户信息*/
					if (me.userType === 'supplier') {
						me.setUserInfo_supplier(jResult.data);
						/*添加标题、时间信息*/
						me.showTimeStatus(jResult);
						/*添加联系人、联系按钮         #1850要求去掉按钮*/
						//me.addContactBtn(jResult.data);
						me.drawBaseInfo(jResult);
						me.setOperateBtn();
						// console.log('ox')
					} else {
						if (me.isLogin) {
							me.setOperateBtn();
						}
						me.setUserInfo_buyer(jResult.data);
						/*添加标题、时间信息*/
						me.showTimeStatus(jResult);
						me.drawBaseInfo(jResult);

                        /*参数为采购商的行业ID*/
                        me.getExhibitor(jResult.data.categoryId,jResult.data.leadId);
					}

				}else if(jResult.status === "error"){
                    var _opera_fail = new Can.view.alertWindowView({
                        id: 'operaFailWindowView',
                        width: 280
                    });
                    var _content = new Can.ui.Panel({
                        cssName: 'error-box',
                        html: jResult.message
                    });
                    _opera_fail.setContent(_content);
                    _opera_fail.show();
                }else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jResult, true);
				}
			}, 'html');
		}
	},
	/* CClick */
	cclick: function (buyinglead) {
		var aOptionItems, bodyTemplates, sCclickTitle, sCclickBody, aOptionItemsBody,
			that = this;

		if (that.userType === 'supplier') {
			aOptionItems = [
				Can.msg.cclick.l3,
				Can.msg.cclick.l4,
				Can.msg.cclick.l5,
				Can.msg.cclick.l6,
				Can.msg.cclick.l7,
				Can.msg.cclick.l8
			];

			aOptionItemsBody = [
				'Product images',
				'Purchase Quantity',
				'Application & Usage',
				'Material',
				'Other Specifications(e.g. Dimension)',
				'Background Info'
			];
			bodyTemplates = [
				// model 1:
				'Re. with your request, may I know more about @request@?',
				// model 2:
				'To better know about your request, would you please provide more about @request@?',
				// model 3:
				'We are an experienced producer in this realm. Before more informaion sent, please kindly let me know about @request@.'
			];

			sCclickTitle = Can.msg.cclick.l9.replace('@', Can.msg.cclick.l16);
			sCclickBody = Can.msg.cclick.l10.replace('@', Can.msg.cclick.l18);
			/*
		}else{
			aOptionItems = [
				Can.msg.cclick.l19,
				Can.msg.cclick.l20,
				Can.msg.cclick.l21,
				Can.msg.cclick.l22,
				Can.msg.cclick.l23,
				Can.msg.cclick.l24
			];
			bodyTemplates = [
				// model 1:
				'Re. with your reply, may I know more about @request@?',
				// model 2:
				'After reviewing your profile, I\'d like to get more information on @request@.',
				// model 3:
				'I\'m interested in your company. However, I still need to know more, including @request@.',
			];
			sCclickTitle = '';
			sCclickBody = '';
		*/
		}

		var fCClickSubmit = function(selected, callback){
			var i,
				body = '',
			   	requests = '';

			for(i=0; i<selected.length - 1; i++){
				requests += aOptionItemsBody[selected[i]] + ', ';
			}
			requests += 'and ' + aOptionItemsBody[selected[selected.length - 1]];

			if (that.userType === 'supplier') {
				body = [
					'Hi ' + buyinglead.buyerInfo.name,
					'This is ' + Can.util.userInfo().getUserName() + '. How are you?',
					bodyTemplates[ Math.floor(Math.random() * bodyTemplates.length) ].replace('@request@', requests),
					'It enables me to know more about your target product and provide you with some useful reference.<br>',
					'Here are my contacts.',
					'Do not hesitate to let me know your idea anytime.<br>',
					'Best Regards,',
					Can.util.userInfo().getUserName() + '<br>'
				];
				/*
			}else{
				body = [
					'Hi ' + buyinglead.buyerInfo.name,
					'This is ' + Can.util.userInfo().getUserName() + '. Nice to know you by e-Cantonfair.',
					bodyTemplates[ Math.floor(Math.random() * bodyTemplates.length) ].replace('@request@', requests),
					'It enables me to know more about you for better consideration.',
					'Looking forward to your most prompt reply.',
					'Best Regards,',
					Can.util.userInfo().getUserName() + '<br>'
				];
			*/
			}

			$.ajax({
				type: 'POST',
				url: Can.util.Config.email.sendEmail,
				data: {
					// msgId: _this.msgId,
					subject: buyinglead.buyerInfo.name + ', you\'ve received one feedback about ' + buyinglead.productName + '.',
					referId: buyinglead.leadId,
					referType: 'buy_inquiry',
					receiver: buyinglead.buyerId,
					// attachments: _this.getAttach(),
					content: '<p>' + body.join('</p><p>') + '</p>'
				},
				success: function(jData){
					if(jData['status'] === 'success'){
						callback('success');
					}else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		};

		var oCclickTrigger = $(
			Can.util.cclick({
				title: sCclickTitle,
				body: sCclickBody,
				options: {
					max: 4,
					items: aOptionItems
				},
				type: 1,
				refs: 'cclick_Slead',
				submit: fCClickSubmit
			})
		);

		if (that.userType === 'supplier') {
			// if(!localStorage.getItem('cclick')){
				setTimeout(function(){
					Can.util.tinyTip( oCclickTrigger, Can.msg.cclick.l11, 'cclick' );
				}, 500);
			// }
			this.description_Nav.el.append(oCclickTrigger);
		// }else{
		}
	},
	/* supplier set userInfo */
	setUserInfo_supplier: function (oData) {
		var sUserTypeTxt, nUserType;
		/*采购商类型图标：0 顾问 1 会员， 2 非会员*/
		if (oData.buyAdviserRecommend) {
			sUserTypeTxt = Can.msg.BL_DETAIL.RECOMMEND;
			nUserType = 0;
		} else if (oData.buyerInfo.verified) {
			sUserTypeTxt = Can.msg.BL_DETAIL.VERIFY;
			nUserType = 1;
		} else {
			sUserTypeTxt = Can.msg.BL_DETAIL.UNVERIFY;
			nUserType = 2;
		}
		var sHtml = '<div class="ref-info">' +
			'<div class="mod-person clear">' +
			'<div class="info left0">' +
			' <p class="name"><a href="javascript:void(0);" title="">' + (oData.buyerInfo.name ? oData.buyerInfo.name : "") + '</a></p>';
		var sHtml2 = ' <p class="userType"><span class="user-type ut' + nUserType + '"></span><span class="txt">' + sUserTypeTxt + '</span></p>' +
			' </div> ' +
			' </div> ' +
			'</div> ';   //ref-info
		if (oData.buyerInfo.countryId) {
			sHtml = sHtml + ' <p class="country"><span class="flags fs' + oData.buyerInfo.countryId + '"></span><span class="txt  w-auto">' + oData.buyerInfo.country + '</span></p>' + sHtml2;
		} else {
			sHtml = sHtml + sHtml2;
		}

		this.infoNav.el.append(sHtml);
        if(oData.buyerInfo.name.indexOf("*")>=0){
            $(".name a", this.infoNav.el).css("cursor","default");
        }
		/*my buyingLead 名片信息*/
		var me = this;
		if (oData.buyingReplyLog) {
			$(".name", this.infoNav.el).click(function () {
				if (oData.buyerInfo.verified) {
					//如果用户设置信息保密,不打开名片
					if (!(oData.isShareContact)) {
						return false;
					}
					Can.util.canInterface('personProfile', [2, oData.buyerId]);
				}
				else {
					if ($(this).text().indexOf("*") >= 0) {
						return false;
					}
					me.showUnVerifyInfo(oData);
				}
			})

		}

	},
	/* supplier set userInfo */
	setUserInfo_buyer: function (oData) {
		var countryNav = '';
        oData.buyerInfo.email = oData.buyerInfo.email || '';
		if (oData.buyerInfo.countryId) {
			countryNav = '<p class="country"><span class="flags fs' + oData.buyerInfo.countryId + '"></span><span class="txt w-auto">' + oData.buyerInfo.country + '</span></p>';
		}
		var sHtml = '<div class="ref-info">' +
			'<div class="mod-person clear">' +
			'<div class="info left0">' +
			' <p secret="1" class="name"><a href="javascript:void(0);" title="' + oData.buyerInfo.email + '">' + oData.buyerInfo.email + '</a></p>' + /*这里显示的是采购商自己的email*/
			countryNav +
			' </div> ' +
			' </div> ' +
			'</div> ';   //ref-info
		this.infoNav.el.append(sHtml)
	},
	/* 标题，剩余时间，发布时间，审核状态 */
	showTimeStatus: function (oData) {
		/*var supplier_span = '',//'<span>' + Can.msg.BL_DETAIL.UPDATE + '<em>2013-07-31</em></span>',
		 buyer_span = '<span>' + Can.msg.BL_DETAIL.STATUS + '<em>' + oData.data.status + '</em></span>';*/
		var spanHtm = "", status = '';
		if (this.userType === "supplier") {
			spanHtm = '';
		} else {
			switch (oData.data.status) {
				case 0:
					status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_AUDITING;
					break;
				case 1:
					status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_AUDITING;
					break;
				case 2:
					status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_AUDITING;
					break;
				case 3:
					status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_APPROVED;
					break;
				case 9:
					status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_APPROVED;
					break;
				case -1:
					status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_UNAPPROVED;
					break;
				case 10:
					status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_UNAPPROVED;
					break;
			}
			spanHtm = '<span>' + Can.msg.BL_DETAIL.STATUS + '<em>' + status + '</em></span>';
		}
		var sBuyingInfo = '<div class="des">' +
			' <h2>' + oData.data.productName + '<input type="hidden" value="' + oData.data.source + '" id="sourceId">' +
			'</h2>      ' +
			'<div class="ort-info"> ' +
			' <span>' + Can.msg.BL_DETAIL.TIME_LEFT + '<em>' + Can.util.countDown(oData.data.expiredDate) + '</em></span>    ' +
			' <span>' + Can.msg.BL_DETAIL.DATE_POST + '<em>' + Can.util.formatDateTime(oData.data.postTime, 'YYYY-MM-DD') + '</em></span>    ' +
			spanHtm +
			' </div>  ' +
			'</div>  ';
		this.infoNav.el.append(sBuyingInfo);
		this.infoNav.applyTo(this.contentEl);
	},
	/*整理基本信息块*/
	drawBaseInfo: function (oResult) {
		/*基本信息*/
		var _this = this;
		this.contactTit_Nav = new Can.ui.Panel({cssName: 'tab-s2'});
		this.baseTapBtn = $('<a class="cur" data-code="baseInfo" href="javascript:void(0);">' + Can.msg.BL_DETAIL.BASE_INFO + '</a>');
		this.contactTit_Nav.el.append(this.baseTapBtn);
		this.baseTapBtn.click(function () {
			_this.fireEvent('onTapClick', _this.baseTapBtn)
		});

		this.contactTit_Nav.applyTo(this.contentEl);
		this.content_Nav = new Can.ui.Panel({cssName: 'tab-cont'});
		this.baseInfo_Nav = new Can.ui.Panel({cssName: 'cont base-info'});
		if (oResult.data.productPhotoArray && oResult.data.productPhotoArray.length > 0) {
			this.picNav = new Can.view.productPicView({});
			this.picNav.update(oResult.data.productPhotoArray);
			this.picNav.start();
			this.picNav.el.appendTo(this.baseInfo_Nav.el);
		}
		var sHml = this.showBaseInfo(oResult);
		this.detail_info = $('<div class="clear detail_Info"></div>');
		this.detail_info.append($(sHml));
		this.detail_info.appendTo(this.baseInfo_Nav.el);
		var clearNav = new Can.ui.Panel({cssName: 'clear-both'});
		this.baseInfo_Nav.addItem(clearNav.el);
		/*详细说明、附件*/
		this.description_Nav = new Can.ui.Panel({cssName: 'description'});
		if (oResult.data.description) {
			var sDescription = '<p class="attach-tit1">' + Can.msg.BL_DETAIL.DESCRIPTION + '</p>' + oResult.data.description;
			this.description_Nav.el.append(sDescription);

			if (this.userType === 'supplier') {
				this.cclick(oResult.data);
			}
		}
		if (oResult.data.attachmentArray && oResult.data.attachmentArray.length > 0) {
			var sAttachmentTit = '<p class="attach-tit2">' + Can.msg.BL_DETAIL.ATTACHMENTS + '</p>';
			this.description_Nav.el.append(sAttachmentTit);
			var aFile = oResult.data.attachmentArray, sHtml = "";
			$.each(aFile, function (i, item) {
				var sFileType = /\.[^\.]+$/.exec(item.resourceUrl), sFileName="";
                if(!sFileType) return;
				sFileType = sFileType[0].toLocaleLowerCase();
				sFileType = sFileType.replace(".", "");
				switch (sFileType) {
					case 'xlsx':
						sFileType = 'xls';
						break;
					case 'docx':
						sFileType = 'doc';
						break;
					case 'pptx':
						sFileType = 'ppt';
						break;
                    case 'png':
                        sFileType = 'jpg';
                        break;
                    case 'gif':
                        sFileType = 'jpg';
                        break;
				}
                if(item.resourceName){
                    sFileName = item.resourceName;
                }else{
                    sFileName = item.resourceUrl.substring(item.resourceUrl.lastIndexOf('/')+1,item.resourceUrl.lastIndexOf('.'));
                }
				sHtml += '<a href="' + item.resourceUrl + '" target="_blank" class="attachment" data-code="' + sFileType + '"><span class="icon-' + sFileType + '"></span>' + sFileName + '</a>';
			});
			this.description_Nav.el.append(sHtml);
		}
		this.baseInfo_Nav.addItem(this.description_Nav);

		this.content_Nav.addItem(this.baseInfo_Nav);

		this.content_Nav.applyTo(this.contentEl);

		/*联系历史 回复历史TAP*/
		if (this.userType === 'supplier') {
			if (oResult.data.buyingReplyLog) {
				this.contactHis_supplier(oResult.data.buyingReplyLog);
			}
			if (this.isLogin) {
				if (oResult.data.buyingReplyLog) {
                    this.addReply(oResult, true);
					/*if (!(oResult.data.buyerInfo.verified)) {
						this.addReply(oResult, true);
					}*/
				} else {
					this.addReply(oResult, true);
				}
			} else if (!(this.isLogin)) {
				this.addReply(oResult, false);
			}
		} else {
			if (oResult.data.buyingReplyLogs) {
				this.replyHisTap_buyer(oResult.data.buyingReplyLogs, this.isLogin);
			}
		}
		/*if (this.userType === 'supplier') {

		 }*/
	},
	/*处理十二项基本信息的显示函数*/
	showBaseInfo: function (oResult) {
		var sHtml = '';
		var items = [
			{key: 'category', label: Can.msg.BL_DETAIL.CATEGORY},
			{key: 'buyingAmt', label: Can.msg.BL_DETAIL.PURCHASE},
			{key: 'yearBuyingAmt', label: Can.msg.BL_DETAIL.PURCHASE_AMOUNT},
			{key: 'procureMoneyValue', label: Can.msg.BL_DETAIL.ANNUAL},
			{key: 'yearProcureMoneyValue', label: Can.msg.BL_DETAIL.ANNUAL_PURCHASE_AMT},
			{key: 'transMode', label: Can.msg.BL_DETAIL.MODE_OF_TRANSPORT},
			{key: 'preferredPrice', label: Can.msg.BL_DETAIL.PREFERRED_PRICE},
			{key: 'arrivalPort', label: Can.msg.BL_DETAIL.PORT_OF_ARRIVAL},
			{key: 'payMode', label: Can.msg.BL_DETAIL.PAYMENT},
			{key: 'supplierRequire', label: Can.msg.BL_DETAIL.SUPPLIER_REQUIREMENTS},
			{key: 'expectRece', label: Can.msg.BL_DETAIL.EXPECT_TO_RECEIVE},
			{key: 'expiredDate', label: Can.msg.BL_DETAIL.EXPIRED_DATE}
		];
		var draw_item = function (oitem, oData) {
			var temp_sHtml = "";
			switch (oitem['key']) {
				case 'category':
					if (oData.data[oitem['key']].categoryName) {
						temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']].categoryName + '</div></div>';
					}
					break;
				case 'buyingAmt':
					if (oData.data[oitem['key']])
						temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + " " + oData.data['buyingUnit'] + '</div></div>';
					break;
				case 'yearBuyingAmt':
					if (oData.data['procureMoneyValue'])
						temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data['procureMoneyValue'] + " " + oData.data['procureMoneyUnit'] + '</div></div>';
					break;
				case 'procureMoneyValue':
					if (oData.data['yearBuyingAmt'])
						temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data['yearBuyingAmt'] + " " + oData.data['yearBuyingUnit'] + '</div></div>';
					break;
				case 'yearProcureMoneyValue':
					if (oData.data[oitem['key']])
						temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + " " + oData.data['yearProcureMoneyUnit'] + '</div></div>';
					break;
				/*case 'preferredPrice':
				 if(oData.data[oitem['key']])
				 temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + oData.data['preferredUnit'] + '</div></div>';
				 break;*/
				case 'preferredPrice':
					if (oData.data[oitem['key']])
						temp_sHtml = '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.PREFERRED_PRICE + ' :</label><div class="txt">' + oData.data[oitem['key']] + " " + oData.data['preferredCurrency'] + "/" + oData.data['preferredUnit'] + '</div></div>';
					break;
				case 'expiredDate':
					if (oData.data[oitem['key']])
						temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + Can.util.formatDateTime(oData.data[oitem['key']], 'YYYY-MM-DD') + '</div></div>';
					break;
				case 'supplierRequire':
					if (oData.data[oitem['key']] || oData.data['supplierRequireValue']) {
						var aValue = [];
						if (oData.data[oitem['key']]) {
							aValue.push(oData.data[oitem['key']]);
						}
						if (oData.data['supplierRequireValue']) {
							aValue.push(oData.data['supplierRequireValue']);
						}
						temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + aValue.join() + '</div></div>';
					}
					break;
				default :
					if (oData.data[oitem['key']] && !(oData.data[oitem['key']] == "null")) {
						temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + '</div></div>';
						oData.data[oitem['key']]
					}
			}
			return temp_sHtml;
		};
		$.each(items, function (i, item) {
			sHtml += draw_item(item, oResult);
		});
		return sHtml;
	},
	/*供应商查看页面中的联系历史块（包括联系历史TAP）*/
	contactHis_supplier: function (oHistoryData) {
		var _this = this;
		var $HistoryBtn = $('<a href="javascript:void(0);" data-code="contactHisTap" class="">' + Can.msg.BL_DETAIL.HISTORY + '</a>').attr("class", "cur");
		$('.tab-s2').append($HistoryBtn);
		$HistoryBtn.click(function () {
			_this.fireEvent('onTapClick', $(this));
		});
		$('.tab-s2 a:first-child').removeClass("cur");
		this.history_Nav = $('<div class="cont con-history"></div>');
		var sHtml, message;

		if (oHistoryData.buyerReplyType) {
			message = Can.msg.BL_DETAIL.INQUIRY.replace('[@]', oHistoryData.buyerName ? oHistoryData.buyerName : "");
			sHtml += '<div class="item"><div class="inner">' +
				'<div class="des">' + message + '</div>' +
				'<div class="e-info"><strong>' + Can.util.formatDateTime(oHistoryData.buyerReplyTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oHistoryData.buyerReplyTime, 'DD MM YYYY', true, true) + '</span></div>' +
				'<div class="bg-ico arrow"></div>' +
				'</div></div>'
		}
		if (oHistoryData.buyerChecked) {

			message = Can.msg.BL_DETAIL.BUYER_READ;
			sHtml += '<div class="item"><div class="inner">' +
				'<div class="des">' + message + '</div>' +
				'<div class="e-info"><strong>' + Can.util.formatDateTime(oHistoryData.buyerCheckTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oHistoryData.buyerCheckTime, 'DD MM YYYY', true, true) + '</span></div>' +
				'<div class="bg-ico arrow"></div>' +
				'</div></div>'

		}
		if (oHistoryData.pushEmail) {
			message = Can.msg.BL_DETAIL.PUSH_EMAIL;
			sHtml += '<div class="item"><div class="inner">' +
				'<div class="des">' + message + '</div>' +
				'<div class="e-info"><strong>' + Can.util.formatDateTime(oHistoryData.pushEmailTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oHistoryData.pushEmailTime, 'DD MM YYYY', true, true) + '</span></div>' +
				'<div class="bg-ico arrow"></div>' +
				'</div></div>'
		}
		if (oHistoryData.systemPush) {
			message = Can.msg.BL_DETAIL.SYSTEM_PUSH;
			sHtml += '<div class="item"><div class="inner">' +
				'<div class="des">' + message + '</div>' +
				'<div class="e-info"><strong>' + Can.util.formatDateTime(oHistoryData.systemPushTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oHistoryData.systemPushTime, 'DD MM YYYY', true, true) + '</span></div>' +
				'<div class="bg-ico arrow"></div>' +
				'</div></div>'
		}
		if (oHistoryData.supplierReplyType) {

			message = Can.msg.BL_DETAIL.SUPPLIER_REPLY;
			sHtml += '<div class="item"><div class="inner">' +
				'<div class="des">' + message + '</div>' +
				'<div class="e-info"><strong>' + Can.util.formatDateTime(oHistoryData.supplierReplyTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oHistoryData.supplierReplyTime, 'DD MM YYYY', true, true) + '</span></div>' +
				'<div class="bg-ico arrow"></div>' +
				'</div></div>'
		}

		$('.base-info').addClass('hidden');
		this.history_Nav.append($(sHtml));
		this.content_Nav.addItem(this.history_Nav);
	},
	/*采购商查看页面中的联系历史块（包括联系历史TAP）*/
	replyHisTap_buyer: function (oHistoryData, islogin) {
		var _this = this;
		var $HistoryBtn = $('<a href="javascript:void(0);" data-code="replyHisTap"  class="">' + Can.msg.BL_DETAIL.REPLY_HISTORY + '</a>').attr("class", "cur");
		$('.tab-s2').append($HistoryBtn);
		$HistoryBtn.click(function () {
			_this.fireEvent('onTapClick', $(this));
		});
		$('.tab-s2 a:first-child').removeClass("cur");

		var sHtml, id = 0;
		this.oCantact = [];
		$.each(oHistoryData, function (i, item) {
			if (islogin) {
				var picNav = '';
				if (item.supplierPhoto) {
					picNav = '<div class="pic">' + Can.util.formatImage(item.supplierPhoto, '60x60') + '</div>';
				}
				var sVisitTime = Can.msg.CAN_TITLE.EXP_NUM.replace("[@]", item.visitTimes ? item.visitTimes : 0);
				_this.history_Longin = $('<div class="cont con-history r-his"></div>');
				sHtml += '<div class="item' + (item.readed ? "" : " unread") + '"><div class="inner">' +
					'<div class="des clear">' +
					'<div class="mod-mch ' + fCountMatchLevel(item.matchValue) + '">' + Can.msg.BL_DETAIL.MATCH + '<em>' + item.matchValue + '%</em></div>' +
					'<div class="mod-person">' +
					picNav +
					'<div class="info"> ' +
					'<p class="name"><a pid="' + item.userId + '" href="javascript:;">' + item.contacter + '</a></p> ' +
					'<p class="country"><span class="flags fs' + item.countryId + '"></span><span class="txt">' + item.district + '</span><span class="attend_time" cantitle="' + sVisitTime + '">' + item.visitTimes + '</span></p>   ' +
					'<a class="cpy-name" target="_blank" href="/china-supplier/' + item.companyId + '.html">' + item.companyName + '</a>' +
					'</div></div>' +
					'<div class="r-tit">' +
					'<span class="bg-ico ico-read' + (item.readed ? " ico-chked" : "") + '"></span> ' +
					'<h3><a mid="' + item.buyingReplyId + '" class="bl-reply" href="javascript:;">' + item.title + '</a></h3>' +
					'<input type="hidden" value="' + item.content + '" name="replyContent">' +
					'</div>' +
					'<div class="e-info"><strong>' + Can.util.formatDateTime(item.replyDate, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(item.replyDate, 'DD MM YYYY', true, true) + '</span></div>' +
					'<div class="bg-ico arrow"></div>' +
					'</div></div></div>';
				_this.history_Longin.append($(sHtml));
			} else {
				_this.oCantact.push(item);
				_this.history_unLongin = $('<div class="cont con-history r-his"></div>');
				var sVisitTime = Can.msg.CAN_TITLE.EXP_NUM.replace("[@]", item.visitTimes ? item.visitTimes : 0);
				sHtml += '<div class="item' + (item.readed ? "" : " unread") + '"><div class="inner">' +
					'<div class="des clear">' +
					'<div class="mod-person">' +
					'<div class="info"> ' +
					'<p><a  href="javascript:;" pid="' + id + '">' + item.companyName + '</a></p> ' +
					'<p class="name auto-width" title="' + (item.companyType ? item.companyType : "") + '">' + (item.companyType ? item.companyType : "") + '</p> ' +
					'<p class="country"><span class="flags fs' + item.countryId + '"></span><span class="txt">' + item.district + '</span><span class="attend_time" cantitle="' + sVisitTime + '">' + (item.visitTimes ? item.visitTimes : 0) + '</span></p> ' +
					'<a class="contact-detail"  pid="' + id + '" href="javascript:;">' + Can.msg.BL_DETAIL.CONTACT_DETAIL + '</a>' +
					'</div></div>' +
					'<div class="r-tit">' +
					'<span class="bg-ico ico-read' + (item.readed ? " ico-chked" : "") + '"></span> ' +
					'<h3><a mid="' + item.buyingReplyId + '" class="bl-reply" href="javascript:;">' + item.title + '</a></h3>' +
					'<input type="hidden" value="' + item.content + '" name="replyContent">' +
					'</div>' +
					'<div class="e-info"><strong>' + Can.util.formatDateTime(item.replyDate, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(item.replyDate, 'DD MM YYYY', true, true) + '</span></div>' +
					'<div class="bg-ico arrow"></div>' +
					'</div></div></div>';
				_this.history_unLongin.append($(sHtml));
				id++;
			}
		});
		$('.base-info').addClass('hidden');

		this.content_Nav.addItem(this.history_Longin || this.history_unLongin);
		$(".r-tit a").click(function () {
			_this.fireEvent('seeReply', islogin, $(this));
			return false;
		});
//        内围查看名片 true：已登录
		this.history_Longin && this.history_Longin.delegate('.name a', 'click', function () {
			_this.fireEvent('displayCompany', $(this), true)
		});
//       外围查看名片 false：未登录
		this.history_unLongin && this.history_unLongin.delegate('.info a', 'click', function () {
			_this.fireEvent('displayCompany', $(this), false);
			return false;
		})
	},
	/*添加为联系人、联系历史 按钮的 处理函数*/   //#1850 去掉按钮
	/*addContactBtn: function (oData) {
		var me = this;
		var $infoNav = $('.ref-info');
		this.$BtnNav = $('<div class="action"></div>');
		if (oData.buyingReplyLog) {
			this.$BtnNav.append('<a href="javaScript:void(0);" class="btn btn-s12" id="qouteBut">' + Can.msg.BL_DETAIL.CONTACT_NOW + '</a>');
		}
		if (oData.buyerInfo.verified && !(oData.buyerInfo.friend)) {
			this.$BtnNav.prepend('<a href="javascript:;" class="btn btn-s11" id="' + oData.buyerId + '">' + Can.msg.BL_DETAIL.ADD_CONTACTER + '</a>');
		}

		$infoNav.append(this.$BtnNav);
		this.$BtnNav.delegate('a.btn-s12', 'click', function () {
			var _data = {
				address: {
					text: oData.buyerInfo.name,
					value: oData.buyerId
				}
			};
			Can.util.canInterface('writeEmail', [Can.msg.MESSAGE_WINDOW.WRITE_TIT, _data]);
		});
		this.$BtnNav.find('a.btn-s11').click(function () {
			var _this = me;
			var id = $(this).attr('id');
			var _contact = {
				id: id,
				contactType: 2
			};
			var _th = this;
			Can.util.canInterface('addToContact', [_contact, function () {
				$(_th).hide();
			}]);
		});
	},*/
	/*马上回复 表单 处理函数*/
	addReply: function (resultObj, isLogin) {
		var th = this;
		this.reply = new Can.ui.Panel({
			wrapEL: 'form', cssName: 'reply-box'
		});
		this.contentEl.append(this.reply.el);

		/*draw_reply：回复的表单内容*/
		var draw_reply = function () {
			var that = th;
			var $subject_Nav = '<div class="field"><label class="col"><span class="bg-ico required"></span> ' + Can.msg.BL_DETAIL.SUBJECT + '</label>' +
				'<div class="el"><div class="search-s2 w650">' +
				'<input type="text" autocomplete="off" class="txt w630" name="title" id="title" placeholder=""></div></div>' +
				'<input type="hidden" value="" name="buyingLeadId" id="buyingLeadId"></div>';
			th.reply.addItem($subject_Nav);
			var blankText = Can.msg.MODULE.BUYING_LEAD.SUBJECT_PLACEHOLDER
				.replace('[@]', resultObj.data.productName || th.buyerL_title)
				.replace('[@@]', Can.util.userInfo().getCompanyName());
			$("#title").attr('placeholder', blankText);

			var $content_Nav = '<div class="field"><label class="col"><span class="bg-ico required"></span>' + Can.msg.BL_DETAIL.CONTENT + ' </label><div class="el">' +
				'<textarea name="content" id="content" cols="" rows="" class="txtarea"></textarea></div></div>';
			th.reply.addItem($content_Nav);

			var $submit_Nav = $('<div class="action"><a href="javascript:;" class="btn btn-s11" id="sendID">' + Can.msg.BL_DETAIL.SEND + '</a></div>');
			th.feedback = new Can.ui.Panel({cssName: 'feedback hide'});
			$submit_Nav.append(th.feedback.el);
			th.reply.addItem($submit_Nav);

			$('#sendID').click(function () {
                if($(this).hasClass("dis")){
                    return false;
                }
                $(this).addClass("dis");
				that.fireEvent('submitBtnClick',$(this),resultObj);
			});
		};

		this.boxcontact = new Can.ui.Panel({
			wrapEL: 'div', cssName: 'tit-s2', html: '<h3>' + Can.msg.MODULE.PRODUCT_DETAIL.CONTACT_NOW + '</h3>'
		});
		this.reply.addItem(this.boxcontact);
		if (isLogin) {  //内围
			//查看会员
			if (resultObj.data.buyerInfo.verified) {
                if(resultObj.data.buyingReplyLog){
                    this.drawUserInfo(resultObj.data);
                }else{
                    draw_reply();
                }
			} else {  //查看非会员
				if (resultObj.data.buyingReplyLog) { //复了
					this.drawUserInfo(resultObj.data);
				} else {  //未回复
					var $guide_Nav = $('<p>' + Can.msg.BL_DETAIL.QUESTION + '</p><ol><li>' + Can.msg.BL_DETAIL.ANSWER1 + '</li><li>' + Can.msg.BL_DETAIL.ANSWER2 + '</li></ol>');
					this.reply.addItem($guide_Nav);
					draw_reply();
				}
			}
		} else { //外围
			/* $guide_Nav：引导注册、登录 内容 */
			var $guide_Nav = $('<p>' + Can.msg.BL_DETAIL.QUESTION + '</p>' +
				'<ol><li>' + Can.msg.BL_DETAIL.ANSWER1 + '</li><li>' + Can.msg.BL_DETAIL.ANSWER2 + '</li></ol>' +
				'<div class="guide"><span>' + Can.msg.BL_DETAIL.GUIDE_SING + '</span><span class="guide-split"></span><span>' + Can.msg.BL_DETAIL.GUIDE_JOIN + '</span></div>');
			this.reply.addItem($guide_Nav);
		}
	},
    /*查看非会员联系信息块 页面底部*/
    drawUserInfo:function (param) {
        var th = this, oBuyerInfo = param.buyerInfo;
		this.webBlInfoEl = new Can.ui.Panel({cssName: 'cont content-info'});
		if (param.isShareContact) {
			if (oBuyerInfo.companyName) {
				$('<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.COMPANY + '</label><div class="txt">' + oBuyerInfo.companyName + '</div></div>').appendTo(th.webBlInfoEl.el);
			}
			if (oBuyerInfo.name)
				$('<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.CONTACT + '</label><div class="txt">' + oBuyerInfo.name + '</div></div>').appendTo(th.webBlInfoEl.el);
			if (oBuyerInfo.email)
				$('<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.EMAIL + '</label><div class="txt">' + oBuyerInfo.email + '</div></div>').appendTo(th.webBlInfoEl.el);
			if (oBuyerInfo.telephone)
				$('<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.TEL + '</label><div class="txt">' + oBuyerInfo.telephone + '</div></div>').appendTo(th.webBlInfoEl.el);
			if (oBuyerInfo.fax)
				$('<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.FAX + '</label><div class="txt">' + oBuyerInfo.fax + '</div></div>').appendTo(th.webBlInfoEl.el);
			if (oBuyerInfo.address) {
				$('<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.ADDRESS + '</label><div class="txt">' + oBuyerInfo.address + '</div></div>').appendTo(th.webBlInfoEl.el);
			}
		} else {
			$('<div class="tips_noreply"><span class="ico"></span>' + Can.msg.BL_DETAIL.NO_CONTACT_INFO + '</div>').appendTo(th.webBlInfoEl.el);
		}


		/*推荐采购需求已经取消名片查看功能*/
		/*if (th.blType_mark.toLocaleLowerCase() === "all") {
		 //---  按钮
		 th.sendEmBtn = new Can.ui.toolbar.Button({
		 cssName:'ui-btn btn-s btn-green',
		 text:Can.msg.BUTTON.CONTACT_BTN
		 });
		 th.sendEmBtn.el.attr("href", "mailto:" + (param.email ? param.email : ""));
		 th.sendBtnNav = $('<div class="txt"></div>');
		 th.sendEmBtn.el.appendTo(th.sendBtnNav);
		 th.contactBtnEl = $('<div class="row clear"><label class="tit"></label></div>').appendTo(th.webBlInfoEl.el);
		 th.sendBtnNav.appendTo(th.contactBtnEl);
		 //---  按钮
		 }*/

		this.reply && this.reply.addItem(this.webBlInfoEl);
	},
	/*查看非会员联系信息 名片 */
	showUnVerifyInfo: function (param) {
		if (param.isShareContact) {
			Can.importJS(['js/utils/userInfoBoxView.js']);
			var buyerInfoWin = new Can.view.titleWindowView({
				title: Can.msg.INFO_WINDOW.BUYER_INFO_TIT,
				width: 410
			});
			var buyerInfoContentEl = new Can.view.webCantonBuyerInfoView({
//            parentEl:buyerInfoWin
			});
			buyerInfoContentEl.startup();
			if (param.buyerInfo.companyName) {
				$('<p>' + Can.msg.BL_DETAIL.COMPANY + '<em>' + param.buyerInfo.companyName + '</em>' + '</p>').attr("class", "order-info").appendTo(buyerInfoContentEl.contentDetailEl);
			}
			if (param.buyerInfo.name) {
				$('<p>' + Can.msg.BL_DETAIL.CONTACT + '<em>' + param.buyerInfo.name + '</em>' + '</p>').attr("class", "order-info").appendTo(buyerInfoContentEl.contentDetailEl);
			}
			if (param.buyerInfo.email) {
				$('<p>' + Can.msg.BL_DETAIL.EMAIL + '<em>' + param.buyerInfo.email + '</em>' + '</p>').attr("class", "order-info").appendTo(buyerInfoContentEl.contentDetailEl);
			}
			if (param.buyerInfo.telephone) {
				$('<p>' + Can.msg.BL_DETAIL.TEL + '<em>' + param.buyerInfo.telephone + '</em>' + '</p>').attr("class", "order-info").appendTo(buyerInfoContentEl.contentDetailEl);
			}
			if (param.buyerInfo.fax) {
				$('<p>' + Can.msg.BL_DETAIL.FAX + '<em>' + param.buyerInfo.fax + '</em>' + '</p>').attr("class", "order-info").appendTo(buyerInfoContentEl.contentDetailEl);
			}
			if (param.buyerInfo.address) {
				$('<p>' + Can.msg.BL_DETAIL.ADDRESS + '<em>' + param.buyerInfo.address + '</em>' + '</p>').attr("class", "order-info").appendTo(buyerInfoContentEl.contentDetailEl);
			}
			//---  按钮
			/*  this.sendEmailBtn = new Can.ui.toolbar.Button({
			 cssName: 'ui-btn btn-s btn-green',
			 text: Can.msg.BUTTON.CONTACT_BTN
			 });
			 this.sendEmailBtn.el.attr("href", "mailto:" + param.buyerInfo.email);
			 this.actionEl = $('<div></div>').attr("class", "win-action ali-r");
			 this.sendEmailBtn.el.appendTo(this.actionEl);
			 this.actionEl.appendTo(buyerInfoContentEl.contentDetailEl);*/
			buyerInfoWin.setContent(buyerInfoContentEl.contentEl);
			buyerInfoWin.show();
		}
	},
	/*获取 exhibitor 数据*/
	getExhibitor: function (categoryId,leadId) {
		var url = "" , _this = this;
		if (this.isLogin) {
			url = Can.util.Config.buyer.BuyerBlDetailModule.exhibitor;
		} else {
			url = Can.util.Config.buyer.BuyerBlDetailModule.exhibitorOut;
        }
        $.ajax({
            url:url,
            data:{"leadId":leadId, "categoryId":categoryId},
            success:function (jData) {
                if (jData.status === "success")
                    _this.exhibitorsInfo(jData.data)
            }
        });
	},

	/*推荐的展位信息*/
	exhibitorsInfo: function (aExhibitorList) {
        if(aExhibitorList) {
            var _this = this;
            this.exhibitorTit_Nav && this.exhibitorTit_Nav.el.remove();
            this.exhibitorCon_Nav && this.exhibitorCon_Nav.el.remove();
            /*exhibitorTitle*/
            this.exhibitorTit_Nav = new Can.ui.Panel({cssName: 'tab-s5'});
            this.exhibitorTapBtn = $('<span href="javascript:void(0);">' + Can.msg.BL_DETAIL.EXHIBITOR_TITLE + '</span>');
            this.exhibitorTit_Nav.el.append(this.exhibitorTapBtn);
            /*exhibitor content mark point*/
            /*iIndex要显示的页数*/
            var iIndex = Math.ceil(aExhibitorList.length / 4);
            var $exhibitionPoint = $('<ul class="exhibition_point"></ul>'), sListLi;
            for (var i = 0; i < iIndex; i++) {
                sListLi += "<li></li>";
            }
            $exhibitionPoint.append($(sListLi));
            $exhibitionPoint.find("li").eq(0).addClass("cur");
            $exhibitionPoint.delegate("li", "click", function () {
                _this.fireEvent('onExhibitTipClick', $(this))
            });

            this.exhibitorTit_Nav.el.append($exhibitionPoint);
            this.exhibitorTit_Nav.applyTo(this.contentEl);

            this.exhibitorCon_Nav = new Can.ui.Panel({cssName: 'tab-exhibitor'});
            this.exhibitorCon_Nav.applyTo(this.contentEl);

            var $exhibitionCon = $('<ul class="exhibition_content"></ul>');
            $exhibitionCon.append($(sListLi));
            var $exhibitionLi = $exhibitionCon.find('li');
            for (var j = 0; j < $exhibitionLi.length; j++) {
                var sHtml = this.drawExhibitionCon(j, aExhibitorList);
                $exhibitionLi.eq(j).append($(sHtml));
            }
            this.exhibitorCon_Nav.el.append($exhibitionCon);

            $exhibitionCon.width($exhibitionLi.width()*$exhibitionLi.length);

            $exhibitionCon.delegate("div.exhibition_photo img", "click", function () {
                _this.fireEvent('onExhibitPicClick', $(this), aExhibitorList[$(this).parent().attr('data-id')]);
            });
            $exhibitionCon.delegate("a.companyName", "click", function () {
                _this.fireEvent('onCompanyNameClick', $(this), aExhibitorList);
                return false;
            });
            $exhibitionCon.delegate("p.boothStand_p", "mouseover", function () {
                _this.fireEvent('showBooth', $(this));
            });
            $exhibitionCon.delegate("p.boothStand_p", "mouseout", function () {
                _this.fireEvent('hideBooth');
            });
        }
	},
	drawExhibitionCon: function (i, aExhibitorList) {
		var nBeginIndex = i * 4, sHtml;
		for (var j = 0; j < 4; j++) {
			if (aExhibitorList[nBeginIndex]) {
				var sVisitTime = Can.msg.CAN_TITLE.EXP_NUM.replace("[@]", aExhibitorList[nBeginIndex].seesionTimes ? aExhibitorList[nBeginIndex].seesionTimes : 0);
				/*展位信息提示窗口内容*/
				var sBoothContent = "<span class='boothStand'>" + Can.msg.BL_DETAIL.EXHIBITORS_BOOTH_TITLE + "</span>", sBoothTip = "";
				if (aExhibitorList[nBeginIndex].periodMap["1"]) {
					sBoothContent += "<p><span>" + Can.msg.BL_DETAIL.PHASE1 + "</span> " + aExhibitorList[nBeginIndex].periodMap["1"] + "</p>"
				}
				if (aExhibitorList[nBeginIndex].periodMap["2"]) {
					sBoothContent += "<p><span>" + Can.msg.BL_DETAIL.PHASE2 + "</span> " + aExhibitorList[nBeginIndex].periodMap["2"] + "</p>"
				}
				if (aExhibitorList[nBeginIndex].periodMap["3"]) {
					sBoothContent += "<p><span>" + Can.msg.BL_DETAIL.PHASE3 + "</span> " + aExhibitorList[nBeginIndex].periodMap["3"] + "</p>"
				}
				sBoothTip = "<div class='booth_tip'>" + sBoothContent + "</div>";
				sHtml += '<div class="exhibition_item">' +
					'<div class="exhibition_photo" data-id="' + nBeginIndex + '">' + Can.util.formatImage(aExhibitorList[nBeginIndex].boothImage, '120x90') + '</div>' +
					'<div class="exhibition_itemCon">' +
					'<a class="companyName" href="javascript:alert(0);" data-id="' + nBeginIndex + '">' + aExhibitorList[nBeginIndex].companyName + '</a>' +
					'<p><span class="flags fs' + aExhibitorList[nBeginIndex].countryId + '"></span>' + aExhibitorList[nBeginIndex].region + '<span class="attend_time" cantitle="' + sVisitTime + '">' + (aExhibitorList[nBeginIndex].seesionTimes ? aExhibitorList[nBeginIndex].seesionTimes : 0) + '</span></p>' +
					'<p data-code="' + sBoothTip + '" class="boothStand_p"><span class="boothStand">' + Can.msg.BL_DETAIL.EXHIBITORS_BOOTH_TITLE + '</span>' + aExhibitorList[nBeginIndex].boothName + '</p>' +
					'</div>' + // exhibition_itemCon end
					'</div>';   // exhibition_item end
				nBeginIndex++;
			}

		}
		return sHtml;
	},
	/*路由定义*/
	routeMark: function () {
		if (this._oRoutArgs.id) {
			Can.Route.mark('/show-buyinglead', this._oRoutArgs)
		}
	},
	runByRoute: function () {
        //传递上一页，一下页
        if(Can.Route._args.queue) {
            var aList = Can.Route._args.queue;
            var self  = this;

            this.queue = {};
            
            var fQueueUp = function(id){
                var queue = self.queue, 
                    prev = queue.prev;

                // set previous one's next
                if (prev) {
                    queue[prev]['next'] = id;
                }

                // set current one's prev
                queue[id] = {
                    prev: prev,
                    subject: ''
                };

                queue.prev = id;
            };

            $.each(aList, function(k, v){
                //console.log(v)
                fQueueUp(v);
            });
        }

        //Can.util.userInfo(Can.util.Config.accountInfo);
		this.isLogin = Can.util.userInfo().isLogin();
		var userType = Can.util.userInfo().getUserType();
		this.userType = (userType == 1 ? "supplier" : "buyer");
		this.bid = this._oRoutArgs.id;
		if (this._oRoutArgs.id) {
			this.show();
			this.loadData({"buyerleadId": this._oRoutArgs.id});
		}
	}
});

