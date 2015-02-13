
Can.module.buyerBuyingLeadModule = Can.extend(Can.module.BaseModule, {
	id: 'buyerBuyingLeadModuleId',
    constructor: function (cfg) {
        Can.module.buyerBuyingLeadModule.superclass.constructor.call(this);
        this.titleContainerEL = $('<div></div>');
    },
    startup: function (buyingLeadDetail) {
        Can.module.buyerBuyingLeadModule.superclass.startup.call(this);
    },
    actIndex: function(args){
        //console.log(args);
        if(args.id){
            //window.open('/buyinglead/info.html?id=' + args.id);
            window.location.href = '/buyinglead/info.html?id=' + args.id;
        }
    }
});

/**
 * @Author: sam
 * @version: v1.1
 * @since:13-8-9
 */
//Can.module.buyerBuyingLeadModule = Can.extend(Can.module.BaseModule, {
	//id: 'buyerBuyingLeadModuleId',
	//title: 'buyingLeadDetail',
	//bid: null,

	//requireUiJs: [ 'js/utils/scanPhotoView.js'],
	//actionJs: ['js/buyer/action/buyerBuyingLeadAction.js'],

	//constructor: function (cfg) {
		//Can.apply(this, cfg || {});
		//Can.module.buyerBuyingLeadModule.superclass.constructor.call(this);
		//this.addEvents('onPrevClick', 'onNextClick', 'onBackClick', 'onNameClick', 'submitBtnClick',
			//'onTapClick', 'seeReply', 'onExhibitTipClick', 'onExhibitPicClick', 'onCompanyNameClick',
			//'ON_CARD_CLICK');
	//},

	//startup: function (buyingLeadDetail) {
		//Can.module.buyerBuyingLeadModule.superclass.startup.call(this);
	//},
	//[>右上操作按钮<]
	//setOperateBtn: function () {
		//var _this = this;
		//this.fncContainer.el.html('');
		//[>返回按钮<]
		//this.backBtn = new Can.ui.toolbar.Button({
			//id: 'backBtnId',
			//cssName: 'btn-back'
		//});
		//this.backBtn.el.attr('cantitle', Can.msg.CAN_TITLE.BACK);
		//this.fncContainer.addItem(this.backBtn);
		//this.backBtn.click(function () {
			//_this.fireEvent('onBackClick');
		//});

		//[>上一页、下一页按钮，this.queue:只有通过列表进来的才有,路由打开的页面不会有此两个按钮<]
		//if (this.queue) {
			//this.stepBtn = new Can.view.stepBtnView();
			//this.stepBtn.startup();
			//this.fncContainer.addItem(this.stepBtn.group);
			//this.stepBtn.onRightClick(function () {
				//if (_this.stepBtn.group[1].el.hasClass("dis"))
					//return;
				//_this.fireEvent('onNextClick');
			//});
			//this.stepBtn.onLeftClick(function () {
				//if (_this.stepBtn.group[0].el.hasClass("dis"))
					//return;
				//_this.fireEvent('onPrevClick');
			//});
			//this.setStepBtnCss(_this);
		//}
	//},
	//[>设置上一步下一步按钮的不可用样式<]
	//setStepBtnCss: function (buyingLeadM) {
		//if (!(buyingLeadM.queue[buyingLeadM.bid].prev)) {
			//this.stepBtn.group[0].el.addClass("dis");
		//}
		//if (!(buyingLeadM.queue[buyingLeadM.bid].next)) {
			//this.stepBtn.group[1].el.addClass("dis");
		//}
	//},
	//[> buyerlead：传进来的对象参数 ---｛buyerleadId：12345｝<]
	//loadData: function (buyerlead) {
		////if (this.isLogin) {
		//this._id = buyerlead.buyerleadId;
		//this.routeMark(this._id);
		//// }
		//var me = this;
		//$.get(Can.util.Config.seller.buyerleadDetailModule.buyerDetailIn, {leadId: buyerlead.buyerleadId}, function (oResult) {
			//var jResult = eval('(' + oResult + ')');
			//if (jResult.status === "success") {
				//me.bdata = jResult.data;

				//me.updateTitle(jResult.data.productName);
				//me.contentEl.html('');
				//[>页面上半部分<]
				//me.infoNav = new Can.ui.Panel({cssName: 'detail-box clear'});
				//me.infoNav.applyTo(me.contentEl);
				//[>页面下半部分<]
				//me.replyInfoNav = new Can.ui.Panel({cssName: "supplierReplyNav"});
				//me.replyInfoNav.applyTo(me.contentEl);
				//[>页面下半部分 左右两个层<]
				//me.replyNav = new Can.ui.Panel({cssName: "reply-supplier"});
				//me.exhibitorNav = new Can.ui.Panel({cssName: "push-supplier"});
				//me.replyInfoNav.addItem(me.replyNav);
				//me.replyInfoNav.addItem(me.exhibitorNav);
				//[>标题栏：All the Suppliers's replies <]
				//var titleNav = $('<div class="titleReply"><h1>' + Can.msg.BL_DETAIL.SUPPLIERS_REPLIE + '</h1><label>' + Can.msg.BL_DETAIL.REMINDER + '</label></div>');
				//me.replyNav.el.append(titleNav);

				//me.drawReplyList(jResult.data.buyingReplyLogs);

				//[>右上角按钮<]
				//me.setOperateBtn();
				//[>设置图片VIEW（右上角）<]
				//me.setBlPhoto(jResult.data);
				//[>添加简述部分内容<]
				//me.showSimpleInfo(jResult);

				//[>参数为采购商的行业ID<]
				//me.getExhibitor(jResult.data.categoryId, jResult.data.leadId);

				//[>右下角提示<]
				//if (me.tipNav) {
					//me.tipNav.el.remove();
				//}
				//me.tipNav = new Can.ui.Panel({cssName: "reply-tips"});
				//var $tipLogo = $('<span class="tipLogo"></span><p class="txt"><span>' + Can.msg.BL_DETAIL.AD_TXT1 + '</span>' + Can.msg.BL_DETAIL.AD_TXT2 + '</p>');
				//me.postBlBtn = new Can.ui.toolbar.Button({
					//cssName: 'btn btn-s11',
					//text: Can.msg.BL_DETAIL.POST_BL
				//});
				//me.tipNav.addItem($tipLogo);
				//me.tipNav.addItem(me.postBlBtn);

				//me.postBlBtn.click(function () {
					//$('#pbuyerleadBtnId').trigger('click')
				//})

				//me.exhibitorNav.addItem(me.tipNav);

				//// if (!localStorage.getItem('cclick')) {
					//$.each($('.btn-t1.btn-cclick'), function (i, item) {
						//Can.util.tinyTip($(item), Can.msg.cclick.l11, 'cclick');
					//});
				//// }

			//} else if (jResult.status === "error") {
				//var _opera_fail = new Can.view.alertWindowView({
					//id: 'operaFailWindowView',
					//width: 280
				//});
				//var _content = new Can.ui.Panel({
					//cssName: 'error-box',
					//html: jResult.message
				//});
				//_opera_fail.setContent(_content);
				//_opera_fail.show();
			//} else {
				//Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jResult, true);
			//}
		//}, 'html');

	//},

	//[> setBuyingLead photo <]
	//setBlPhoto: function (oData) {
		//if (oData.productPhotoArray) {
			//this.view_photo = new Can.ui.Panel({cssName: "mod-photo w150 clear"});
			//this.scanPhoto = new Can.view.scanPhotoView({
				//pho_width: 120,
				//pho_height: 120,
				//pho_List: oData.productPhotoArray,
				//isName: false
			//});
			//this.scanPhoto.startup();
			//this.view_photo.addItem(this.scanPhoto.ContainerEL)
			//this.infoNav.addItem(this.view_photo)
		//}
	//},
	//[> 未展开的基本信息 <]
	//showSimpleInfo: function (oData) {
		//var _this = this, spanHtm = "", sBuyingRequire = '';
		//[>if (this.userType === "supplier") {
		 //spanHtm = '';
		 //} else {
		 //switch (oData.data.status) {
		 //case 0:
		 //status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_AUDITING;
		 //break;
		 //case 1:
		 //status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_AUDITING;
		 //break;
		 //case 2:
		 //status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_AUDITING;
		 //break;
		 //case 3:
		 //status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_APPROVED;
		 //break;
		 //case 9:
		 //status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_APPROVED;
		 //break;
		 //case -1:
		 //status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_UNAPPROVED;
		 //break;
		 //case 10:
		 //status = Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_UNAPPROVED;
		 //break;
		 //}
		 //var buyer_span = '<span>' + Can.msg.BL_DETAIL.STATUS + '<em>' + status + '</em></span>';
		 //spanHtm = buyer_span;
		 //}*/
		//if (oData.data.attachment) {
			//spanHtm += '<span class="ico-b3"></span>'
		//}
		//if (oData.data.buyingAmt) {
			//sBuyingRequire = ' <span>' + Can.msg.BL_DETAIL.PURCHASE + ':<em>' + oData.data.buyingAmt + ' ' + oData.data['buyingUnit'] + '</em></span> '
		//}

		//var sBuyingInfo = '<div class="des-info">' +
			//' <h2>' + oData.data.productName + '<input type="hidden" value="' + oData.data.source + '" id="sourceId">' +
			//spanHtm +
			//'<span class="postTime">' + Can.util.formatDateTime(oData.data.postTime, 'YYYY-MM-DD hh:mm') + '</span> ' +
			//'</h2>      ' +
			//'<div class="ort-info"> ' +
			//'<p>' + oData.data.description.substring(0, 200) + ' ...</p>    ' +
			//'<div class="infoMore">' + sBuyingRequire + '</div>' +
			//'<a href="javascript:;" class="more"><span></span>' + Can.msg.BL_DETAIL.MORE + '</a>' +
			//'<a href="javascript:;" class="less"><span></span>' + Can.msg.BL_DETAIL.LESS + '</a>' +
			//'</div>' +
			//'</div>';
		//this.infoNav.el.append(sBuyingInfo)

		//$("a.more", ".des-info").click(function () {
			//_this.showMoreBuyingLead(oData)
		//})
		//$("a.less", ".des-info").click(function () {
			//_this.hideMoreBuyingLead(oData, sBuyingRequire)
		//})
	//},
	//[> 展开更多 BuyingLead Info <]
	//showMoreBuyingLead: function (param) {
		//$(".des-info .ort-info p").text(param.data.description);
		//$(".infoMore").text("");
		//var moreInfo = this.showBaseInfo(param);
		//$(".infoMore").html(moreInfo);
		//$(".more").hide();
		//$(".less").show();
	//},
	//hideMoreBuyingLead: function (oData, sBuyingRequire) {
		//$(".des-info .ort-info p").text(oData.data.description.substring(0, 200) + " ...");
		//$(".infoMore").html(sBuyingRequire);
		//$(".more").show();
		//$(".less").hide();
	//},
	//[>处理基本信息的显示函数<]
	//showBaseInfo: function (oResult) {
		//var sHtml = '';
		//var items = [
			//{key: 'exhibitor', label: Can.msg.BL_DETAIL.SPECIAL_PREFERENCES},
			//{key: 'experience', label: Can.msg.BL_DETAIL.SPECIAL_PREFERENCES},
			//{key: 'category', label: Can.msg.BL_DETAIL.CATEGORY},
			//{key: 'buyingAmt', label: Can.msg.BL_DETAIL.PURCHASE},
			//{key: 'yearBuyingAmt', label: Can.msg.BL_DETAIL.PURCHASE_AMOUNT},
			//{key: 'procureMoneyValue', label: Can.msg.BL_DETAIL.ANNUAL},
			//{key: 'yearProcureMoneyValue', label: Can.msg.BL_DETAIL.ANNUAL_PURCHASE_AMT},
			//{key: 'transMode', label: Can.msg.BL_DETAIL.MODE_OF_TRANSPORT},
			//{key: 'preferredPrice', label: Can.msg.BL_DETAIL.PREFERRED_PRICE},
			//{key: 'arrivalPort', label: Can.msg.BL_DETAIL.PORT_OF_ARRIVAL},
			//{key: 'payMode', label: Can.msg.BL_DETAIL.PAYMENT},
			//{key: 'supplierRequire', label: Can.msg.BL_DETAIL.SUPPLIER_REQUIREMENTS},
			//{key: 'expectRece', label: Can.msg.BL_DETAIL.EXPECT_TO_RECEIVE},
			//{key: 'expiredDate', label: Can.msg.BL_DETAIL.EXPIRED_DATE}
		//];
		//var draw_item = function (oitem, oData) {
			//var temp_sHtml = "";
			//switch (oitem['key']) {
				//case 'exhibitor' :
					//if (oData.data[oitem['key']] && oData.data['experience']) {
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt"><div class="exhibitorIcon"></div><div class="specialExperienceIcon"></div></div></div>'
					//} else if (oData.data[oitem['key']]) {
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt"><div class="exhibitorIcon"></div></div></div>'
					//}
					//break;
				//case 'experience':
					//if (oData.data[oitem['key']] && oData.data['exhibitor']) {
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt"><div class="exhibitorIcon"></div><div class="specialExperienceIcon"></div></div></div>'
					//} else if (oData.data[oitem['key']]) {
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt"><div class="specialExperienceIcon"></div></div></div>'
					//}
					//break;
				//case 'category':
					//if (oData.data[oitem['key']].categoryName) {
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']].categoryName + '</div></div>';
					//}
					//break;
				//case 'buyingAmt':
					//if (oData.data[oitem['key']])
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + " " + oData.data['buyingUnit'] + '</div></div>';
					//break;
				//case 'yearBuyingAmt':
					//if (oData.data[oitem['key']])
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + " " + oData.data['yearBuyingUnit'] + '</div></div>';
					//break;
				//case 'procureMoneyValue':
					//if (oData.data[oitem['key']])
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + " " + oData.data['procureMoneyUnit'] + '</div></div>';
					//break;
				//case 'yearProcureMoneyValue':
					//if (oData.data[oitem['key']])
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + " " + oData.data['yearProcureMoneyUnit'] + '</div></div>';
					//break;
				//case 'preferredPrice':
					//if (oData.data[oitem['key']])
						//temp_sHtml = '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.PREFERRED_PRICE + ' :</label><div class="txt">' + oData.data[oitem['key']] + " " + oData.data['preferredCurrency'] + "/" + oData.data['preferredUnit'] + '</div></div>';
					//break;
				//case 'expiredDate':
					//if (oData.data[oitem['key']])
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + Can.util.formatDateTime(oData.data[oitem['key']], 'YYYY-MM-DD') + '</div></div>';
					//break;
				//case 'supplierRequire':
					//if (oData.data[oitem['key']] || oData.data['supplierRequireValue']) {
						//var aValue = [];
						//if (oData.data[oitem['key']]) {
							//aValue.push(oData.data[oitem['key']]);
						//}
						//if (oData.data['supplierRequireValue']) {
							//aValue.push(oData.data['supplierRequireValue']);
						//}
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + aValue.join() + '</div></div>';
					//}
					//break;
				//default :
					//if (oData.data[oitem['key']] && !(oData.data[oitem['key']] == "null")) {
						//temp_sHtml = '<div class="row clear"><label class="tit">' + oitem.label + ' :</label><div class="txt">' + oData.data[oitem['key']] + '</div></div>';
						//oData.data[oitem['key']]
					//}
			//}
			//return temp_sHtml;
		//}
		//$.each(items, function (i, item) {
			//sHtml += draw_item(item, oResult);
		//})
		//return sHtml;
	//},

	//drawReplyList: function (aReplyLogs) {
		//var _this = this;
		//if (aReplyLogs && aReplyLogs.length) {
			//$.each(aReplyLogs, function (i, item) {
				//var $ItemNav = $('<div class="item-reply"></div>');

				//var $replyInfoNav = $('<div class="replyInfo"></div>');

				//var $moreInfoNav = $('<div class="moreInfo"></div>');

				//$ItemNav.append($replyInfoNav).append($moreInfoNav);

				//item['bid'] = _this.bid;

				//$ItemNav.append([
					//'<div class="reply-action">',
					//_this.cclick(item),
					//'<div class="reply-form">',
					//'<a href="javascript:;" class="btn-t1 btn-reply" data-id="' + '' + '" role="reply"><span class="icon"></span></a>',
					//'<form class="send">',
					//'<input type="hidden" name="subject" value="Re: ' + item.title + '">',
					//'<input type="hidden" name="referId" value="' + item.buyingReplyId + '">',
					//'<input type="hidden" name="referType" value="buy_inquiry">',
					//'<input type="hidden" name="receiver" value="' + item.userId + '">',
					//'<input type="text" class="body" name="content" placeholder="' + Can.msg.BL_DETAIL.ADD_COMMENT + '">',
					//'<a class="submit-reply" role="submit-reply" href="javascript:;"><span class="icon"></span></a>',
					//'</form>',
					//'</div>',
					//'</div>'
				//].join('')
				//);

				//_this.replyNav.el.append($ItemNav);

				//var $SupplierPhoto = $('<div class="pic" role="card" data-id="' + item.userId + '">' + Can.util.formatImage(item.supplierPhoto, "60x60", (item.gender ? "male" : "female")) + '</div>')
				//var $ReplyTxt = $('<div class="txt clear"><label class="cpy-contator" role="card" data-id="' + item.userId + '">' +
					//item.contacter + '</label><a href="/cfone/showroom/index.cf?companyId=' + item.companyId + '"  target="_blank" class="cpy-name">' + item.companyName + '</a></div>')
				//var $ReplyTime = $('<span>' + Can.util.formatDateTime(item.replyDate, "hh:mm MM DD", true, true) + '</span>');
				//$ReplyTxt.append($ReplyTime);
				//var $contentTxt = $('<p>' + item.content.substring(0, 200) + '</p>')
				//var $more = $('<a href="javascript:;" class="more"><span></span>' + Can.msg.BL_DETAIL.MORE + '</a>'),
					//$less = $('<a href="javascript:;" class="less"><span></span>' + Can.msg.BL_DETAIL.LESS + '</a>');

				//$replyInfoNav.append($SupplierPhoto).append($ReplyTxt).append($contentTxt);

				//if (item.content.length > 200) {
					//$replyInfoNav.append($more).append($less)
				//}

				//[>右边两个隐藏的 地区、参展商标志<]
				//var $RightIcoNav = $('<div class="rightIco"></div>').appendTo($ItemNav);
				//if (item.region) {
					//var $RegionIcoNav = $('<div class="region">' + item.region + '</div>');
					//$RegionIcoNav.appendTo($RightIcoNav);
				//}
				//[>如果是114供应商<]
                //if (item.session === 114) {
					//var $ExhibitorLogo = $('<span class="ExhibitorLogo"></span>').appendTo($SupplierPhoto);
					//var $ExhibitorIcoNav = $('<div class="Exhibitor">' + Can.msg.BL_DETAIL.EXHIBIT_IN_OCTOBER + '</div>');
					//$ExhibitorIcoNav.appendTo($RightIcoNav)
				//}
				//[>绑定hover事件<]
				//$RightIcoNav.hover(function () {
                    //$RegionIcoNav && $RegionIcoNav.css({"background-color": "#999999", "font-size": "12px"});
					//$ExhibitorIcoNav && $ExhibitorIcoNav.css({"background-color": "#999999", "font-size": "12px"});
                    //$RegionIcoNav && $RegionIcoNav.stop().animate({"width": "80px"}, "slow");
					//$ExhibitorIcoNav && $ExhibitorIcoNav.stop().animate({"width": "120px"}, "slow")
				//}, function () {
                    //$RegionIcoNav && $RegionIcoNav.css({"background-color": "#e7e7e7", "font-size": "0px"});
					//$ExhibitorIcoNav && $ExhibitorIcoNav.css({"background-color": "#e7e7e7", "font-size": "0px"});
                    //$RegionIcoNav && $RegionIcoNav.stop().animate({"width": "5px"}, "fast");
					//$ExhibitorIcoNav && $ExhibitorIcoNav.stop().animate({"width": "5px"}, "fast")
				//});

				//[>FUCK UP<]
				//$replyInfoNav.on('click', '[role=card]', function () {
					//_this.fireEvent('ON_CARD_CLICK', $(this).data('id'));
				//});
				//[>FUCK DOWN<]
				//[>更多按钮事件<]
				//$more.click(function () {
					//$(this).parent().find("p").text(item.content);
					//$(this).hide().next().show();
				//});
				//$less.click(function () {
					//$(this).parent().find("p").text(item.content.substring(0, 200));
					//$(this).hide().prev().show();
				//});
				//[>SUPPLIER REPLY MORE INFO<]

				//[>item.exhibitionOCF = {exhihitionPho:"http://58.248.138.13:81/group1/M00/39/B3/wKgKEVIbCsaALvDhAAAT-7Wad3A785.jpg",
				 //1:"3.1 A38,3.2 A39",
				 //2:"3.2 B35,3.2 B34",
				 //3:"3.2 C35,3.2 C36",
				 //4:"11.1 A42"};*/
////                item.encircle= "http://58.248.138.13:81/group1/M00/39/B3/wKgKEVIbCsaALvDhAAAT-7Wad3A785.jpg";
				//if (item.boothList && item.boothList.length > 0) {
					//if (item.boothImage && item.boothImage.length > 0) {
						//var $exhibitorPho = $('<a class="more-pho" target="_blank" href="/cfone/showroom/index.cf?companyId=' + item.companyId + '">' + Can.util.formatImage(item.boothImage[0], "200x150") + '</a>');
						//$moreInfoNav.append($exhibitorPho);
					//}
					//var $exhibitorTxt = $('<div class="more-txt"><h2>' + Can.msg.BL_DETAIL.EXHIBITOR_TIT + '</h2><span class="booth-num"></span><p>' + Can.msg.BL_DETAIL.BOOTH_NUM + '</p></div>');
					//var aBoothList = [
							//{key: '1', value: Can.msg.BL_DETAIL.PHASE1},
							//{key: '2', value: Can.msg.BL_DETAIL.PHASE2},
							//{key: '3', value: Can.msg.BL_DETAIL.PHASE3},
							//{key: '4', value: Can.msg.BL_DETAIL.PHASE4}
						//],
                        //isShowMore = false,
						//aHtml = [];
					//$.each(item.boothList, function (j, BoothItem) {
                        //if(aHtml.length >= 3){
                            //isShowMore = true;
                            //return false;
                        //}
                        //switch(BoothItem.periodNum){
                            //case 1:
                                //aHtml.push('<div class="boothItem"><span>' + aBoothList[0].value + '</span>' + BoothItem.actualBoothNo.join(" ") + '</div>');
                                //break;
                            //case 2:
                                //aHtml.push('<div class="boothItem"><span>' + aBoothList[1].value + '</span>' + BoothItem.actualBoothNo.join(" ") + '</div>');
                                //break;
                            //case 3:
                                //aHtml.push('<div class="boothItem"><span>' + aBoothList[2].value + '</span>' + BoothItem.actualBoothNo.join(" ") + '</div>');
                                //break;
                            //case 4:
                                //aHtml.push('<div class="boothItem"><span>' + aBoothList[3].value + '</span>' + BoothItem.actualBoothNo.join(" ") + '</div>');
                                //break;
                        //}
					//});
                    //$exhibitorTxt.append( aHtml.join('') );

                    //if(isShowMore){
                        ////vfasky 点击查看更多
                        //var $morrEl = $('<p><a href="">...</a></p>');
                        //var $infoEl = $([
                            //'<div class="more-info">',
                                //'<p>' +  Can.msg.BL_DETAIL.BOOTH_NUM + ': </p>',
                            //'</div>'
                        //].join(''));

                        //$.each(item.boothList, function (j, BoothItem) {
                            //switch(BoothItem.periodNum){
                                //case 1:
                                    //$infoEl.append('<div class="boothItem"><span>' + aBoothList[0].value + '</span>' + BoothItem.actualBoothNo.join(" ") + '</div>');
                                    //break;
                                //case 2:
                                    //$infoEl.append('<div class="boothItem"><span>' + aBoothList[1].value + '</span>' + BoothItem.actualBoothNo.join(" ") + '</div>');
                                    //break;
                                //case 3:
                                    //$infoEl.append('<div class="boothItem"><span>' + aBoothList[2].value + '</span>' + BoothItem.actualBoothNo.join(" ") + '</div>');
                                    //break;
                                //case 4:
                                    //$infoEl.append('<div class="boothItem"><span>' + aBoothList[3].value + '</span>' + BoothItem.actualBoothNo.join(" ") + '</div>');
                                    //break;
                            //}
                        //});

                        //$infoEl.css({
                            //width: 248,
                            //height: 160,
                            //padding: 6,
                            //paddingLeft: 12,
                            //border: '1px solid #dcdcdc',
                            //top:20,
                            //left:120,
                            //background: '#fff',
                            //boxShadow: '1px 1px 2px #CCC',
                            //overflowY: 'scroll',
                            //position: 'absolute'
                        //}).hide();

                        //$exhibitorTxt.css({
                            //position: 'relative'
                        //})

                        //$infoEl.appendTo($exhibitorTxt);
                        
                        //$morrEl.appendTo($exhibitorTxt).hover(function () {
                            //$infoEl.show();
                        //}, function () {
                            //$infoEl.hide();
                        //}).click(function () {
                            //return false;
                        //});
                    //}
					
                    //var $clear = $('<div class="clear"></div>')
					//$moreInfoNav.append($exhibitorTxt).append($clear);
				//} else if (item.panorama) {
					//var $encircle = $('<a href="/cfone/showroom/index.cf?companyId=' + item.companyId + '" target="_blank">' + Can.util.formatImage(item.panorama, "435x115") + '</a>')
					//$moreInfoNav.append($encircle)
				//} else {
					//var aInfoList = [
							//{key: 'companyType', value: Can.msg.BL_DETAIL.BUSINESS_TYPE},
							//{key: 'mainProduct', value: Can.msg.BL_DETAIL.MAIN_PRODUCT},
							//{key: 'targetMarket', value: Can.msg.BL_DETAIL.TARGET_MARKET},
							//{key: 'certification', value: Can.msg.BL_DETAIL.CERTIFICATION}
						//],
						//sTempHtml = "";

					//$.each(aInfoList, function (m, _item) {
						//switch (_item.key) {
							//case 'mainProduct':
								//if (item.mainProduct && (item.mainProduct.length > 0)) {
									//var sTemp = "";
									//sTempHtml += '<div class="boothItem"><span>' + _item.value + '</span>';
									//for (var i = 0; i < item.mainProduct.length; i++) {
										//sTemp += ('<div class="blockNav">' + item.mainProduct[i] + '</div>');
									//}
									//sTempHtml += (sTemp + '</div>');
								//}
								//break;
							//case'targetMarket':
								//if (item.targetMarket && (item.targetMarket.length > 0)) {
									//var sTemp = "";
									//sTempHtml += '<div class="boothItem"><span>' + _item.value + ':</span>';
									//for (var i = 0; i < item.targetMarket.length; i++) {
										//sTemp += ('<div class="blockNav">' + item.targetMarket[i] + '</div>');
									//}
									//sTempHtml += (sTemp + '</div>');
								//}
								//break;
							//case'certification':
								//if (item.certification && (item.certification.length > 0)) {
									//var sCertification = item.certification.join(", ");
									//sTempHtml += '<div class="boothItem"><span>' + _item.value + ':</span>' + sCertification + '</div>';
								//}
								//break;
							//default :
								//if (item[_item['key']]) {
									//sTempHtml += '<div class="boothItem"><span>' + _item.value + '</span>' + item[_item['key']] + '</div>';
								//}
								//break;
						//}
					//})
					//$moreInfoNav.append($(sTempHtml));
				//}
			//})
		//} else {//没有供应商回复
			//var $noResult = $('<div class="noReply"><span class="noIcon"></span><p class="sorTxt">' + Can.msg.BL_DETAIL.SORRY_TXT + '</p><p class="adviceTxt">' + Can.msg.BL_DETAIL.ADVICE_TXT + '</p></div>');
			//_this.replyNav.el.append($noResult);
		//}
	//},

	//[> CClick <]
	//cclick: function (jData) {
		//var that = this,
			//aOptionItems = [
				//{ key: Can.msg.cclick.l19, value: 'Relevant Product Image' },
				//{ key: Can.msg.cclick.l20, value: 'Technical Data & Specifications' },
				//{ key: Can.msg.cclick.l21, value: 'Price List' },
				//{ key: Can.msg.cclick.l22, value: 'Certifications' },
				//{ key: Can.msg.cclick.l23, value: 'Export Experience on Relative Products' },
				//{ key: Can.msg.cclick.l24, value: 'Background Info & Brand Experience' }
			//],
			//bodyTemplates = [
				//// model 1:
				//'Re. with your reply, may I know more about @request@?',
				//// model 2:
				//'After reviewing your profile, I\'d like to get more information on @request@.',
				//// model 3:
				//'I\'m interested in your company. However, I still need to know more, including @request@.'
			//],
			//sCclickTitle = Can.msg.cclick.l9.replace('@', Can.msg.cclick.l17),
			//sCclickBody = Can.msg.cclick.l10.replace('@', Can.msg.cclick.l17);

		//var _bclick_submit = false;
		//var fCClickSubmit = function (selected, callback) {
			//var i,
				//body = '',
				//requests = '';

			//for (i = 0; i < selected.length - 1; i++) {
				//requests += aOptionItems[selected[i]].value + ', ';
			//}
			//requests += 'and ' + aOptionItems[selected[selected.length - 1]].value;

			//body = [
				//'Hi ' + jData.contacter,
				//'This is ' + Can.util.userInfo().getUserName() + '. Nice to know you by e-Cantonfair.',
				//bodyTemplates[ Math.floor(Math.random() * bodyTemplates.length) ].replace('@request@', requests),
				//'It enables me to know more about you for better consideration.',
				//'Looking forward to your most prompt reply.',
				//'Best Regards,',
				//Can.util.userInfo().getUserName() + '<br>'
			//];

			//if(!_bclick_submit){
				//$.ajax({
					//type: 'POST',
					//url: Can.util.Config.email.sendEmail,
					//data: {
						//// msgId: _this.msgId,
						//subject: jData.contacter + ', you\'ve received one feedback about ' + that.bdata.productName + '.',
						//referId: that.bdata.leadId,
						//referType: 'cclick',
						//receiver: jData.userId,
						//// attachments: _this.getAttach(),
						//content: '<p>' + body.join('</p><p>') + '</p><p role="extra" class="hide">' + that.bdata.productName + '</p>'
					//},
					//beforeSend: function(){
						//_bclick_submit = true;
					//},
					//complete: function(xhr, status){
						//if (status != 'success') {
							//_bclick_submit = false;
						//};
					//},
					//success: function (jData) {
						//if(jData['status'] === 'success'){
							//callback('success');
							//_bclick_submit = false;
						//}else {
							//Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						//}
					//}
				//});
			//}
			
		//};

		//// var oCclickTrigger = $(
		//return Can.util.cclick({
			//customClassName: 'btn-cclick-t1',
			//title: sCclickTitle,
			//body: sCclickBody,
			//options: {
				//max: 4,
				//items: aOptionItems
			//},
			//refs: 'cclick_Blead',
			//submit: fCClickSubmit
		//});
		//// );

		//// this.description_Nav.el.append(oCclickTrigger);
	//},

	//[>获取 exhibitor 数据<]
	//getExhibitor: function (categoryId, leadId) {
		//var url = "" , _this = this;
		//url = Can.util.Config.buyer.BuyerBlDetailModule.exhibitor;
		//$.ajax({
			//url: url,
			//async: false,
			//data: {"leadId": leadId, "categoryId": categoryId},
			//success: function (jData) {
				//if (jData.status === "success") {
					//_this.exhibitorsInfo(jData.data)
				//}

			//}
		//});
	//},

	//[>推荐的展位信息<]
	//exhibitorsInfo: function (aExhibitorList) {
		//if (aExhibitorList) {
			//var _this = this;
			//this.exhibitorTit_Nav && this.exhibitorTit_Nav.el.remove();
			//this.exhibitorCon_Nav && this.exhibitorCon_Nav.el.remove();
			//[>exhibitorTitle<]
			//this.exhibitorTit_Nav = new Can.ui.Panel({cssName: 'tab-push'});
			//this.exhibitorTapBtn = $('<span href="javascript:void(0);">' + Can.msg.BL_DETAIL.EXHIBITOR_TITLE + '</span>');
			//this.exhibitorTit_Nav.el.append(this.exhibitorTapBtn);
			//[>exhibitor content mark point<]
			//[>iIndex要显示的页数<]
			//var iIndex = Math.ceil(aExhibitorList.length / 4);
			//var $exhibitionPoint = $('<ul class="exhibition_point margin_top40"></ul>'), sListLi;
			//for (var i = 0; i < iIndex; i++) {
				//sListLi += "<li></li>";
			//}
			//$exhibitionPoint.append($(sListLi));
			//$exhibitionPoint.find("li").eq(0).addClass("cur");
			//$exhibitionPoint.delegate("li", "click", function () {
				//_this.fireEvent('onExhibitTipClick', $(this))
			//})

			//this.exhibitorTit_Nav.el.append($exhibitionPoint);
			//this.exhibitorTit_Nav.applyTo(this.exhibitorNav.el);

			//this.exhibitorCon_Nav = new Can.ui.Panel({cssName: 'tab-exhibit'});
			//this.exhibitorCon_Nav.applyTo(this.exhibitorNav.el);

			//var $exhibitionCon = $('<ul class="exhibit_content clear"></ul>');
			//$exhibitionCon.append($(sListLi));
			//[>根据页LI的个数，制作内容的LI个数，即页面数<]
			//var $exhibitionLi = $exhibitionCon.find('li');
			//for (var j = 0; j < $exhibitionLi.length; j++) {
				//var sHtml = this.drawExhibitionCon(j, aExhibitorList);
				//$exhibitionLi.eq(j).append($(sHtml));
			//}
			//this.exhibitorCon_Nav.el.append($exhibitionCon);

			//$exhibitionCon.delegate("div.exhibition_photo img", "click", function () {
				//_this.fireEvent('onExhibitPicClick', $(this), aExhibitorList[$(this).parent().attr('data-id')]);
			//})
			//$exhibitionCon.delegate("a.companyName", "click", function () {
				//_this.fireEvent('onCompanyNameClick', $(this), aExhibitorList);
				//return false;
			//})
			//$exhibitionCon.delegate("p.boothStand_p", "mouseover", function () {
				//_this.fireEvent('showBooth', $(this));
			//})
			//$exhibitionCon.delegate("p.boothStand_p", "mouseout", function () {
				//_this.fireEvent('hideBooth');
			//})
		//}
	//},
	//drawExhibitionCon: function (i, aExhibitorList) {
		//var nBeginIndex = i * 4, sHtml;
		//for (var j = 0; j < 4; j++) {
			//if (aExhibitorList[nBeginIndex]) {
				//var sVisitTime = Can.msg.CAN_TITLE.EXP_NUM.replace("[@]", aExhibitorList[nBeginIndex].seesionTimes ? aExhibitorList[nBeginIndex].seesionTimes : 0);
				//[>展位信息提示窗口内容<]
				//var sBoothContent = "<span class='boothStand'>" + Can.msg.BL_DETAIL.EXHIBITORS_BOOTH_TITLE + "</span>";
				//if (aExhibitorList[nBeginIndex].periodMap["1"]) {
					//sBoothContent += "<p><span>" + Can.msg.BL_DETAIL.PHASE1 + "</span> " + aExhibitorList[nBeginIndex].periodMap["1"] + "</p>"
				//}
				//if (aExhibitorList[nBeginIndex].periodMap["2"]) {
					//sBoothContent += "<p><span>" + Can.msg.BL_DETAIL.PHASE2 + "</span> " + aExhibitorList[nBeginIndex].periodMap["2"] + "</p>"
				//}
				//if (aExhibitorList[nBeginIndex].periodMap["3"]) {
					//sBoothContent += "<p><span>" + Can.msg.BL_DETAIL.PHASE3 + "</span> " + aExhibitorList[nBeginIndex].periodMap["3"] + "</p>"
				//}
				//var sBoothTip = "<div class='booth_tip'>" + sBoothContent + "</div>", sBoothUrl = "";
				//if (aExhibitorList[nBeginIndex].companyId) {
					//sBoothUrl = "/cfone/showroom/index.cf?companyId=" + aExhibitorList[nBeginIndex].companyId
				//} else if (aExhibitorList[nBeginIndex].corpId) {
					//sBoothUrl = "/showroom/index.html?corpId=" + aExhibitorList[nBeginIndex].corpId
				//}
				//sHtml += '<div class="exhibit_item">' +
					//'<div class="exhibit_photo"><a href="' + sBoothUrl + '" target="_blank">' + Can.util.formatImage(aExhibitorList[nBeginIndex].boothImage, '150x120') + '</a></div>' +
					//'<div class="exhibit_itemCon">' +
					//'<a href="' + sBoothUrl + '" target="_blank">' + aExhibitorList[nBeginIndex].companyName + '</a>' +
					//'<p data-code="' + sBoothTip + '" class="boothStand_p"><span class="boothStand">' + Can.msg.BL_DETAIL.EXHIBITORS_BOOTH_TITLE + '</span>' + aExhibitorList[nBeginIndex].boothName + '</p>' +
					//'</div>' + // exhibition_itemCon end
					//'</div>';   // exhibition_item end
				//nBeginIndex++;
			//}
		//}
		//return sHtml;
	//},


	//[>路由定义<]
	//routeMark: function (id) {
		//if (this._id) {
			//Can.Route.mark('/show-buyingLead', {
				//id: this._id
			//})
		//}

	//},
	//runByRoute: function () {
////        this.isLogin = Can.util.userInfo().isLogin();
////        var userType = Can.util.userInfo().getUserType();
////        this.userType = (userType == 1 ? "supplier" : "buyer");
		//this.bid = this._oRoutArgs.id;
		//if (this._oRoutArgs.id) {
			//this.show();
			//this.loadData({"buyerleadId": this._oRoutArgs.id});
		//}
	//}
//});

