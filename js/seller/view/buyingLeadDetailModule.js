Can.module.BuyingLeadDetailModule = Can.extend(Can.module.BaseModule, {
	id: 'buyingLeadDetailModuleId',
    constructor: function (cfg) {
        Can.module.BuyingLeadDetailModule.superclass.constructor.call(this);
        this.titleContainerEL = $('<div></div>');
    },
    startup: function (buyingLeadDetail) {
        Can.module.BuyingLeadDetailModule.superclass.startup.call(this);
    },
    actIndex: function(args){
        //console.log(args);
        if(args.id){
            window.open('/buyinglead/supplier.html?id=' + args.id);
        }
    }
});

/**
 * Canton Fair Express User Index
 * @Author:lubenxia
 * @Version: 1.0
 * @Update: 13-8-26
 */

//Can.module.BuyingLeadDetailModule = Can.extend(Can.module.BaseModule, {
	//id: 'buyingLeadDetailModuleId',
	//title: Can.msg.BL_DETAIL.L_DETAIL,
	//requireUiJs:['js/utils/stepBtnView.js', 'js/plugin/slider/slider.js'],
	//actionJs: ['js/seller/action/buyingLeadDetailModuleAction.js'],
	//bid: null,
    //slider: null,
	//bcclick: false,
	//constructor: function (jCfg) {
		//Can.apply(this, jCfg || {});
		//Can.module.BuyingLeadDetailModule.superclass.constructor.call(this);
		//this.addEvents('onPrevClick', 'onNextClick', 'onBackClick', 'submitBtnClick');

	//},
	//startup: function () {
		//Can.module.BuyingLeadDetailModule.superclass.startup.call(this);

		//this.infoNav = new Can.ui.Panel({cssName: 'express-box clear'});
		//this.infoNav.applyTo(this.contentEl);

		////左边容器
		//this.desNav = new Can.ui.Panel({cssName: 'des'});
		//this.desTitle = new Can.ui.Panel({wrapEL: 'h2'});
		//this.desCont = new Can.ui.Panel({
			//wrapEL: 'p',
			//cssName:'attach-tit1',
			//html: Can.msg.BL_DETAIL.DESCRIPTION
		//});

		//this.desInner = new Can.ui.Panel({cssName:'description'});
		//this.desInnerCont = new Can.ui.Panel({wrapEL: 'p'});
		//this.desUl = new Can.ui.Panel({wrapEL: 'ul'});

		////采购范围和本次采购量
		//this.range = new Can.ui.Panel({
			//cssName: 'row',
			//html:'<label>'+Can.msg.MODULE.MATCH_BUYERS.SOURCING+'</label>'
		//});
		//this.purchase = new Can.ui.Panel({
			//cssName: 'row',
			//html:'<label>'+Can.msg.BL_DETAIL.PURCHASE+'</label>'
		//});

		//this.desInner.addItem(this.desInnerCont);
		//this.desInner.addItem(this.desUl);
		//this.desInner.addItem(this.range);
		//this.desInner.addItem(this.purchase);
		//this.desNav.addItem(this.desTitle);
		//this.desNav.addItem(this.desCont);
		//this.desNav.addItem(this.desInner);
		//this.infoNav.addItem(this.desNav);

		////右边容器
		//this.refNav = new Can.ui.Panel({cssName: 'ref-info'});
		//this.favorite = new Can.ui.Panel({cssName: 'favorite icons star-0'});
		//this.favorite.el.attr("cantitle", Can.msg.MODULE.BUYING_LEAD.COLLECTION_TIP);
		//this.timeLeft = new Can.ui.Panel({
			//cssName: 'row',
			//html:'<label>'+Can.msg.BL_DETAIL.TIME_LEFT+'</label>'
		//});
		//this.dataPost = new Can.ui.Panel({
			//cssName: 'row',
			//html:'<label>'+Can.msg.BL_DETAIL.DATE_POST+'</label>'
		//});
		//this.expiredDate = new Can.ui.Panel({
			//cssName: 'row',
			//html:'<label>'+Can.msg.BL_DETAIL.EXPIRED_DATE+' :</label>'
		//});
		//this.view = new Can.ui.Panel({
			//cssName: 'icon-list',
			//html:'<i class="icons view"></i><span>'+Can.msg.MODULE.MY_SETTING.VIEWS+' :</span>'
		//});
		//this.replyCount = new Can.ui.Panel({
			//cssName: 'icon-list',
			//html:'<i class="icons comment"></i><span>'+Can.msg.BL_DETAIL.RELY+' :</span>'
		//});

		//this.refNav.addItem(this.favorite);
		//this.refNav.addItem(this.timeLeft);
		//this.refNav.addItem(this.dataPost);
		//this.refNav.addItem(this.expiredDate);
		//this.refNav.addItem(this.view);
		//this.refNav.addItem(this.replyCount);
		//this.infoNav.addItem(this.refNav);

		////更多信息模块
		//this.contactTitNav = new Can.ui.Panel({cssName: 'express-s2'});
		//this.contactTitNav.applyTo(this.contentEl);

		////买家的联系信息
		//this.buyerInfoNav = new Can.ui.Panel({cssName: 'express-s3'});
		//this.buyerTitle = new Can.ui.Panel({
			//wrapEL: 'p',
			//cssName: 'attach-tit1',
			//html: Can.msg.BL_DETAIL.BUYER_INFO
		//});
		//this.buyerInfo = new Can.ui.Panel({cssName: 'buyerInfo'});
		//this.buyerPic = new Can.ui.Panel({cssName: 'pic'});
		//this.buyerCont = new Can.ui.Panel({cssName: 'info'});
		//this.buyerTitle2 = new Can.ui.Panel({cssName: 'title2'});
		//this.buyerName = new Can.ui.Panel({cssName: 'name'});
		//this.needCoins = new Can.ui.Panel({cssName: 'need-coins'});
		//this.buyerUl = new Can.ui.Panel({wrapEL: 'ul'});

		//this.buyerInfoNav.addItem(this.buyerTitle);
		//this.buyerInfoNav.addItem(this.buyerInfo);
		//this.buyerInfo.addItem(this.buyerPic);
		//this.buyerInfo.addItem(this.buyerCont);
		//this.buyerCont.addItem(this.buyerTitle2);
		//this.buyerTitle2.addItem(this.buyerName);
		//this.buyerTitle2.addItem(this.needCoins);
		//this.buyerCont.addItem(this.buyerUl);
		//this.buyerInfoNav.applyTo(this.contentEl);

		//this.expNav = new Can.ui.Panel({cssName: 'exp'});
		//this.expNav.applyTo(this.contentEl);

	//},
	//[>设置上一步下一步按钮的不可用样式<]
	//setStepBtnCss: function (buyingLeadM) {
        //if(!this.queue|| !this.queue[buyingLeadM.bid]){
            //return;
        //}
		//if (!(this.queue[buyingLeadM.bid].prev)) {
			//this.stepBtn.group[0].el.addClass("dis");
		//}
		//if (!(this.queue[buyingLeadM.bid].next)) {
			//this.stepBtn.group[1].el.addClass("dis");
		//}
	//},
	//showInfo:function(oData){
		//var _this = this;
		////右上角操作
		//this.fncContainer.el.html('');
        //if(Can.Route._referer && Can.Route._referer.indexOf('/show-buyinglead') !== 0){
			//this._referer = Can.Route._referer;
        //}
		//// //console.log(Can.module.BuyingLeadDetailModule._referer);
		//// if(!this._referer){
		//// 	this._referer = Can.Route._referer;
		//// 	console.log(this._referer);
		//// }

        ////上一页、下一页按钮，this.queue:只有通过列表进来的才有,路由打开的页面不会有此两个按钮
        //if (this.queue) {

            //this.stepBtn = new Can.view.stepBtnView({css:['btn-prev', 'btn-next']});
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
		////返回按钮
		//this.backBtn = new Can.ui.toolbar.Button({
			//id: 'backBtnId',
			//cssName: 'btn-back'
		//});
		//this.backBtn.el.attr('cantitle', Can.msg.CAN_TITLE.BACK);
		//this.fncContainer.addItem(this.backBtn);
		//this.backBtn.click(function () {
			//_this.fireEvent('onBackClick');
		//});

		//var formatText = function(text){
			//return ((!text && text !== 0) ? '' : text);
		//};
		////icons图标
		//var sIcons = '';
		//if(oData.hasAttachment){
			//sIcons ='<span cantitle="'+Can.msg.MODULE.BUYING_LEAD.ATTACHMENT+'" class="ico-b3"></span>';
		//}
		//if(oData.currentJoin && oData.currentJoin ===1){
			//sIcons +='<span cantitle="'+Can.msg.MODULE.BUYING_LEAD.LEADEXPRESS+'" class="ico-b10"></span>';
		//}
		//if(oData.currentJoin && oData.currentJoin ===2){
			//sIcons +='<span cantitle="'+Can.msg.MODULE.BUYING_LEAD.LIEV_LEADEXPRESS+'" class="ico-b6"></span>';
		//}
		//if(oData.isCcoinReward){
			//sIcons +='<span cantitle="'+Can.msg.BL_DETAIL.C_COINS+'" class="icons reward"></span>';
		//}
		//this.desTitle.el.html(formatText(oData.productName)+sIcons);

		////cclick
		//this.desCont.el.html(Can.msg.BL_DETAIL.DESCRIPTION+this.cclick(oData));

		//this.desInnerCont.el.html(formatText(oData.description));

		//var sPics = "";
		////有产品图片
		//if (oData.productPhotoArray && oData.productPhotoArray.length > 0){
			//for(var i=0;i<oData.productPhotoArray.length;i++){
				//sPics+='<li>'+Can.util.formatImage(oData.productPhotoArray[i],'120x120')+'</li>';
			//}
		//}
		//this.desUl.el.html(sPics);
        //this.slider = Can.plugin.slider(oData.productPhotoArray);

		////采购范围和本次采购量
		//var sRange = '';
		//if(oData.industry.indusName){
			//sRange = '<span>'+oData.industry.indusName+'</span>';
		//}
		//if(oData.category.categoryName){
			//sRange += '<span>'+oData.category.categoryName+'</span>';
		//}
		
		//this.range.update('<label>'+Can.msg.MODULE.MATCH_BUYERS.SOURCING+'</label>'+sRange);

		//var sBuyingAmt = 'MOQ';
		//if(oData.buyingAmt && oData.buyingAmt !="" && oData.buyingAmt !="0"){
			//sBuyingAmt = '<em>'+oData.buyingAmt+' '+oData.buyingUnit+'</em>';
		//}
		//this.purchase.update('<label>'+Can.msg.BL_DETAIL.PURCHASE+' :</label> '+sBuyingAmt);

		////右边容器
		//this.timeLeft.update('<label>'+Can.msg.BL_DETAIL.TIME_LEFT+'</label><em>'+Can.util.countDown(oData.expiredDate)+'</em>');
		//this.dataPost.update('<label>'+Can.msg.BL_DETAIL.DATE_POST+'</label><em>'+Can.util.formatDateTime(oData.postTime, 'YYYY-MM-DD')+'</em>');
		//this.expiredDate.update('<label>'+Can.msg.BL_DETAIL.EXPIRED_DATE+' :</label><em>'+Can.util.formatDateTime(oData.expiredDate, 'YYYY-MM-DD')+'</em>');
		//this.view.update('<i class="icons view"></i><span>'+Can.msg.MODULE.MY_SETTING.VIEWS+' :</span>'+formatText(oData.viewCount));
		//this.replyCount.update('<i class="icons comment"></i><span>'+Can.msg.BL_DETAIL.RELY+' :</span>'+formatText(oData.replyCount));
		////收藏
		//var $favorite = this.favorite.el;
		//$favorite.attr({ 'is-favorate': formatText(oData.isFavorate), cantitle: Can.msg.MODULE.BUYING_LEAD.COLLECTION_TIP });

		//var isFavorate = Number($favorite.attr('is-favorate')) === 1;
		//if(isFavorate){
            //$favorite.removeClass('star-0');
            //$favorite.addClass('star-3');
        //}else{
            //$favorite.removeClass('star-3');
            //$favorite.addClass('star-0');
        //}
		////更多信息模块
		//var sHtml = '';
		////附件
		//if(oData.attachmentArray && oData.attachmentArray.length > 0){
			//var aFile = oData.attachmentArray;
			//$.each(aFile, function (i, item) {
				//var sFileType = /\.[^\.]+$/.exec(item.resourceUrl), sFileName = "";
                //if(!sFileType) return;
				//sFileType = sFileType[0].toLocaleLowerCase();
				//sFileType = sFileType.replace(".", "");
				//switch (sFileType) {
					//case 'xlsx':
						//sFileType = 'xls';
						//break;
					//case 'docx':
						//sFileType = 'doc';
						//break;
					//case 'pptx':
						//sFileType = 'ppt';
						//break;
                    //case 'png':
                        //sFileType = 'jpg';
                        //break;
                    //case 'gif':
                        //sFileType = 'jpg';
                        //break;
				//}
				//if(item.resourceName){
                    //sFileName = item.resourceName;
                //}else{
                    //sFileName = item.resourceUrl.substring(item.resourceUrl.lastIndexOf('/')+1,item.resourceUrl.lastIndexOf('.'));
                //}
				//sHtml += '<a href="' + item.resourceUrl + '" target="_blank" class="attachment" data-code="' + sFileType + '"><span class="icon-' + sFileType + '"></span>' + sFileName + '</a>';
			//});
			//sHtml = '<div class="row clear"><label class="attachment-left">' + Can.msg.BL_DETAIL.ATTACHMENTS + ':</label>'+
					//'<div class="txt txt-attachment">'+sHtml+'</div></div>';

		//}
		//if (oData.yearBuyingAmt && oData.yearBuyingUnit) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.ANNUAL + ' :</label><div class="txt">' + oData.yearBuyingAmt + " " + oData.yearBuyingUnit + '</div></div>';
		//}
		//if (oData.procureMoneyValue && oData.procureMoneyUnit) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.PURCHASE_AMOUNT + ' :</label><div class="txt">' + oData.procureMoneyValue + " " + oData.procureMoneyUnit + '</div></div>';
		//}
		//if (oData.yearProcureMoneyValue && oData.yearProcureMoneyUnit) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.ANNUAL_AMOUNT + ' :</label><div class="txt">' + oData.yearProcureMoneyValue + " " + oData.yearProcureMoneyUnit+ '</div></div>';
		//}
		//if (oData.transMode) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.MODE_OF_TRANSPORT + ' :</label><div class="txt">' + oData.transMode + '</div></div>';
		//}
		//if (oData.preferredPrice) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.PREFERRED_PRICE + ' :</label><div class="txt">' + oData.preferredPrice + " " + formatText(oData.preferredCurrency) + "/" + formatText(oData.preferredUnit) + '</div></div>';
		//}
		//if (oData.arrivalPort) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.PORT_OF_ARRIVAL + ' :</label><div class="txt">' + oData.arrivalPort + '</div></div>';
		//}
		//if (oData.payMode) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.PAYMENT + ' :</label><div class="txt">' + oData.payMode + '</div></div>';
		//}
		//if (oData.supplierRequire) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.SUPPLIER_REQUIREMENTS + ' :</label><div class="txt">' + oData.supplierRequire + ", " +  formatText(oData.supplierRequireValue) + '</div></div>';
		//}
		//if (oData.expectRece) {
			//sHtml += '<div class="row clear"><label class="tit">' + Can.msg.BL_DETAIL.EXPECT_TO_RECEIVE + ' :</label><div class="txt">' + oData.expectRece + '</div></div>';
		//}
		//if(sHtml!=''){
			//this.contactTitle = new Can.ui.Panel({
				//wrapEL: 'p',
				//cssName: 'attach-tit1',
				//html: Can.msg.BL_DETAIL.MORE_INFO
			//});
			//this.contactInfo = new Can.ui.Panel({
				//cssName: 'moreinfo',
				//html: sHtml
			//});

			//this.contactTitNav.addItem(this.contactTitle);
			//this.contactTitNav.addItem(this.contactInfo);
		//}

		////买家的联系信息
		//var xGender = (oData.buyerInfo.gender * 1 === 2 ? 'female' : 'male');
		//this.buyerPic.update(Can.util.formatImage(oData.buyerInfo.buyerPhoto, '77x77', oData.buyerInfo.gender ? xGender : 'none' ));
		//this.buyerName.update(oData.buyerInfo.name || 'Vistor Buyer'); 
		//this.buyerName.el.attr('title', oData.buyerInfo.name || 'Vistor Buyer');

		//var sUserTypeTxt, nUserType;
		////采购商类型图标：0 顾问 1 会员 2 非会员
		//if (oData.buyAdviserRecommend) {
			//sUserTypeTxt = Can.msg.BL_DETAIL.RECOMMEND;
			//nUserType = 0;
		//} else if (oData.buyerInfo.verified) {
			//sUserTypeTxt = Can.msg.BL_DETAIL.VERIFY;
			//nUserType = 1;
		//} else {
			//sUserTypeTxt = Can.msg.BL_DETAIL.UNVERIFY;
			//nUserType = 2;
		//}
		//var sInfo = '';
		//var sCountry = '';
		//var sUserType = '<p class="userType"><span class="user-type ut' + nUserType + '"></span><span class="txt">' + sUserTypeTxt + '</span></p>';
		//var sEmail = '';
		//var sTelephone = '';
		//var sCompanyName = '';
		//var sFax = '';
		//var sLi = '';

		//if (oData.buyerInfo.countryId){
			//sCountry = '<p><span class="flags fs' + oData.buyerInfo.countryId + '"></span><span class="txt  w-auto">' + oData.buyerInfo.country + '</span></p>';
		//}

		//var fBuyerInfo = function(oData){
			//if(oData.telephone){
				//sTelephone = '<p><span>'+Can.msg.BL_DETAIL.PHONE+'</span><span class="adj">'+oData.telephone+'</span></p>';
			//}
			//if(oData.companyName){
				//sCompanyName = '<p><span>'+Can.msg.BL_DETAIL.COMPANY+'</span><span class="adj">'+oData.companyName+'</span></p>';
			//}
			//if(oData.fax){
				//sFax = '<p><span>'+Can.msg.BL_DETAIL.FAX+'</span><span class="adj">'+oData.fax+'</span></p>';
			//}

			//if(oData.email){
				//sEmail = '<p><span>'+Can.msg.BL_DETAIL.EMAIL+'</span><span class="adj">'+oData.email+'</span></p>';			
			//}
		//}
		//fBuyerInfo(oData.buyerInfo);

		//this.needCoins.el.find('.tips').remove();
		////采购商联系方式 共享
		//if(oData.isShareContact === 1){

			//Can.util.isCcoinOpened(function(isOpened){
				//_this.isCcoinOpened = isOpened;

				////C coins 开启
				//if(_this.isCcoinOpened){

					//sInfo = sEmail+sCompanyName+sTelephone+sFax;
					////查看次数未达 上限 需要购买
					//if(oData.isNeedBuyContact === 1){
						//_this.needCoins.update('<div class="tips"><span></span><label>'+Can.msg.BL_DETAIL.NEED_COINS+'<a href="javascript:;" id="iconsview">'+Can.msg.BL_DETAIL.VIEW+'&gt;&gt;</a></label></div>');
						//_this.needCoins.el.find('#iconsview').click(function(){
							//$.ajax({
								//url: Can.util.Config.seller.buyerleadDetailModule.purchaseBuyerContactInfo,
								//data: {leadId: oData.leadId},
								//type: 'POST',
								//beforeSend:function(){
									//_this.needCoins.update('<div class="tips"><span></span><label>'+Can.msg.BL_DETAIL.NEED_COINS+'<a>'+Can.msg.LOADING+'</a></label></div>');
								//},
								//success:function(jData){
									//if(jData.status && jData.status === 'success') {
										//if(jData.data){
											//_this.needCoins.el.find('.tips').remove();
											//_this.buyerUl.el.find('.li-tips').html('');
											//fBuyerInfo(jData.data);
											//sInfo = sEmail+sCompanyName+sTelephone+sFax;
											//_this.buyerUl.el.find('.li-tips').html(sInfo);
										//}else{
											//var fLimitAlert = new Can.view.alertWindowView({
												//closeAction: 'hide',
												//type: 2
											//});
											//fLimitAlert.setContent([
												//'<div class="alert-status">',
												//'<span class="icon"></span>',
												//Can.msg.BL_DETAIL.LIMIT,
												//'</div>'
											//].join(''));
											//fLimitAlert.main.el.addClass('alert-win-t1');
											//fLimitAlert.show();
										//}
										

									//}else{
										//Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
									//}
								//}
							//});
						
						//});
					//}

				//}else{
					//sInfo = sEmail+sCompanyName+sTelephone+sFax;
				//}

				//_this.buyerUl.el.html('<li class="w130">'+sCountry+sUserType+'</li><li class="li-tips">'+sInfo+'</li>');
			//});
		//}else{
			//sInfo = '<div class="tips"><span></span>'+Can.msg.BL_DETAIL.TIPS+'</div>';
			//_this.buyerUl.el.html('<li class="w130">'+sCountry+sUserType+'</li><li class="li-tips">'+sInfo+'</li>');
		//}

		////判断是否有联系历史
		//if (oData.buyingReplyLog) {
			////联系历史
			//this.contactHisNav = new Can.ui.Panel({cssName: 'express-s3'});
			//this.expNav.addItem(this.contactHisNav);

			//this.contactHisTit = new Can.ui.Panel({
				//cssName: 'tit-s3',
				//html: Can.msg.BL_DETAIL.HISTORY
			//});
			//this.contactHisRe = new Can.ui.Panel({
				//cssName: 're-cont',
				//html: Can.msg.BL_DETAIL.YOUR_CONTENT
			//});
			//this.contactHisReplay = new Can.ui.Panel({
				//cssName: 'replay-cont',
				//html: formatText(oData.buyingReplyLog.supplierContent)
			//});
			//this.contactHisCont = new Can.ui.Panel({cssName: 'cont con-history'});

			//var sHtml1 = '';
			//var sMessage;
			//if (oData.buyingReplyLog.buyerReplyType) {
				//sMessage = Can.msg.BL_DETAIL.INQUIRY.replace('[@]', oData.buyingReplyLog.buyerName ? oData.buyingReplyLog.buyerName : "");
				//sHtml1 += '<div class="item"><div class="inner">' +
					//'<div class="des">' + sMessage + '</div>' +
					//'<div class="e-info"><strong>' + Can.util.formatDateTime(oData.buyingReplyLog.buyerReplyTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oData.buyingReplyLog.buyerReplyTime, 'DD MM YYYY', true, true) + '</span></div>' +
					//'<div class="bg-ico arrow"></div>' +
					//'</div></div>'
			//}
			//if (oData.buyingReplyLog.buyerChecked) {

				//sMessage = Can.msg.BL_DETAIL.BUYER_READ;
				//sHtml1 += '<div class="item"><div class="inner">' +
					//'<div class="des">' + sMessage + '</div>' +
					//'<div class="e-info"><strong>' + Can.util.formatDateTime(oData.buyingReplyLog.buyerCheckTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oData.buyingReplyLog.buyerCheckTime, 'DD MM YYYY', true, true) + '</span></div>' +
					//'<div class="bg-ico arrow"></div>' +
					//'</div></div>'

			//}
			//if (oData.buyingReplyLog.pushEmail) {
				//sMessage = Can.msg.BL_DETAIL.PUSH_EMAIL;
				//sHtml1 += '<div class="item"><div class="inner">' +
					//'<div class="des">' + sMessage + '</div>' +
					//'<div class="e-info"><strong>' + Can.util.formatDateTime(oData.buyingReplyLog.pushEmailTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oData.buyingReplyLog.pushEmailTime, 'DD MM YYYY', true, true) + '</span></div>' +
					//'<div class="bg-ico arrow"></div>' +
					//'</div></div>'
			//}
			//if (oData.buyingReplyLog.systemPush) {
				//sMessage = Can.msg.BL_DETAIL.SYSTEM_PUSH;
				//sHtml1 += '<div class="item"><div class="inner">' +
					//'<div class="des">' + sMessage + '</div>' +
					//'<div class="e-info"><strong>' + Can.util.formatDateTime(oData.buyingReplyLog.systemPushTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oData.buyingReplyLog.systemPushTime, 'DD MM YYYY', true, true) + '</span></div>' +
					//'<div class="bg-ico arrow"></div>' +
					//'</div></div>'
			//}
			//if (oData.buyingReplyLog.supplierReplyType) {

				//sMessage = Can.msg.BL_DETAIL.SUPPLIER_REPLY;
				//sHtml1 += '<div class="item"><div class="inner">' +
					//'<div class="des">' + sMessage + '</div>' +
					//'<div class="e-info"><strong>' + Can.util.formatDateTime(oData.buyingReplyLog.supplierReplyTime, 'hh:mm') + '</strong><br><span>' + Can.util.formatDateTime(oData.buyingReplyLog.supplierReplyTime, 'DD MM YYYY', true, true) + '</span></div>' +
					//'<div class="bg-ico arrow"></div>' +
					//'</div></div>'
			//}
			//this.contactHisCont.update(sHtml1);

			//this.contactHisNav.addItem(this.contactHisTit);
			//this.contactHisNav.addItem(this.contactHisRe);
			//this.contactHisNav.addItem(this.contactHisReplay);
			//this.contactHisNav.addItem(this.contactHisCont);
			
		//}else{
			////回复表单
			//this.reply = new Can.ui.Panel({cssName: 'reply-box content-box'});
			//this.expNav.addItem(this.reply);

			//this.replyTit1 = new Can.ui.Panel({
				//cssName: 'tit-s2',
				//html: '<h3>'+Can.msg.BL_DETAIL.CONTACT_BUYER+'<span class="content-tips">'+Can.msg.BL_DETAIL.CONTACT_TIPS+'</span></h3>'
			//});
			//this.reply.addItem(this.replyTit1);

			//var sBuyerName = 'Vistor Buyer';
			//if(oData.buyerInfo.name){
				//sBuyerName = oData.buyerInfo.name;
			//}
			////标题
			//var sTitle = '<span>'+Can.msg.BL_DETAIL.FROM+':</span>'+Can.util.userInfo().getUserName()+'<span class="to">'+Can.msg.BL_DETAIL.TO+':</span>'+sBuyerName;
			//this.replyTit2 = new Can.ui.Panel({
				//cssName: 'field field2',
				//html: sTitle
			//});

			////内容
			//var sArea = '<div class="el el-cont">'+
				//'<textarea name="content" id="content" cols="" rows="" class="txtarea" placeholder="'+Can.msg.BL_DETAIL.INTER_MSG+'"></textarea>'+
				//'<div class="recontent-tips hide"><span class="icons cont-allow"></span>'+Can.msg.BL_DETAIL.MSG_DETAIL+'</div>'+
				//'</div>';
			//this.replyArea = new Can.ui.Panel({
				//cssName: 'field',
				//html: sArea
			//});

			//this.reply.addItem(this.replyTit2);
			//this.reply.addItem(this.replyArea);

			////textArea tips
			//this.replyArea.el.find('#content').focus(function(){
				//$(this).addClass("edit");
				//_this.replyArea.el.find('.recontent-tips').removeClass('hide');
			//}).blur(function(){
				//$(this).removeClass("edit");
				//_this.replyArea.el.find('.recontent-tips').addClass('hide');
			//});

			////TIP及save按钮
			//this.replyAction = new Can.ui.Panel({cssName: 'action'});
			//this.saveBtn = new Can.ui.toolbar.Button({
				//text: Can.msg.BL_DETAIL.CONTACT_NOW,
				//cssName: 'btn btn-s11',
				//id: 'sendID'
			//});

			//this.reply.addItem(this.replyAction);
			//this.replyAction.addItem(this.saveBtn);

			//this.feedback = new Can.ui.Panel({cssName: 'feedback hide'});
			//this.replyAction.addItem(this.feedback);

			//var sTips = '';
			//var sTips2 = '';
			//if(oData.cCoin && Number(oData.cCoin) !== 0){

				//Number(oData.cCoin) > 0 ? sTips =  Can.msg.BL_DETAIL.REWARD : sTips =  Can.msg.BL_DETAIL.CONSUME ;

				//var aCoins = oData.cCoin.toString().split("-");
                //oData.cCoin = aCoins[aCoins.length-1];

                //sTips2 = '<div class="reward">'+sTips+ '<i>'+oData.cCoin+'</i>' + Can.msg.BL_DETAIL.TIPS_COINS2+'</div>';
			//}
			//this.saveBtn.click(function () {
				//if(this.el.hasClass("dis")){
                    //return false;
                //}
                //this.el.addClass("dis");
				//_this.fireEvent('submitBtnClick', this, oData);
			//});

			//this.replyAction.el.append(sTips2);
		//}
	//},
	//[> CClick <]
	//cclick: function (buyinglead) {
		//var aOptionItems, bodyTemplates, sCclickTitle, sCclickBody,
			//that = this;

		//aOptionItems = [
			//{ key: Can.msg.cclick.l3, value: 'Product images' },
			//{ key: Can.msg.cclick.l4, value: 'Purchase Quantity' },
			//{ key: Can.msg.cclick.l5, value: 'Application & Usage' },
			//{ key: Can.msg.cclick.l6, value: 'Material' },
			//{ key: Can.msg.cclick.l7, value: 'Other Specifications(e.g. Dimension)' },
			//{ key: Can.msg.cclick.l8, value: 'Background Info' }
		//];

		//bodyTemplates = [
			//// model 1:
			//'Re. with your request, may I know more about @request@?',
			//// model 2:
			//'To better know about your request, would you please provide more about @request@?',
			//// model 3:
			//'We are an experienced producer in this realm. Before more informaion sent, please kindly let me know about @request@.'
		//];

		//sCclickTitle = Can.msg.cclick.l9.replace('@', Can.msg.cclick.l16);
		//sCclickBody = Can.msg.cclick.l10.replace('@', Can.msg.cclick.l18);

		//var fCClickSubmit = function(selected, callback){
			//var i, receiver,
				//body = '',
				   //requests = '';

			//for(i=0; i<selected.length - 1; i++){
				//requests += aOptionItems[selected[i]].value + ', ';
			//}
			//requests += 'and ' + aOptionItems[selected[selected.length - 1]].value;

			//body = [
				//'Hi ' + buyinglead.buyerInfo.name,
				//'This is ' + Can.util.userInfo().getUserName() + '. How are you?',
				//bodyTemplates[ Math.floor(Math.random() * bodyTemplates.length) ].replace('@request@', requests),
				//'It enables me to know more about your target product and provide you with some useful reference.<br>',
				//'Here are my contacts.',
				//'Do not hesitate to let me know your idea anytime.<br>',
				//'Best Regards,',
				//Can.util.userInfo().getUserName() + '<br>'
			//];

			//if(buyinglead.source === '002' || buyinglead.source === '004' || buyinglead.source === '005'){
				//receiver = 39361;
			//}else{
				//receiver = buyinglead.buyerId;
			//}
			//if(!that.bcclick){
				//$.ajax({
					//type: 'POST',
					//url: Can.util.Config.email.sendEmail,
					//data: {
						//// msgId: _this.msgId,
						//subject: buyinglead.buyerInfo.name + ', you\'ve received one feedback about ' + buyinglead.productName + '.',
						//referId: buyinglead.leadId,
						//referType: 'cclick',
						//receiver: receiver,
						//// attachments: _this.getAttach(),
						//content: '<p>' + body.join('</p><p>') + '</p>'
					//},
					//beforeSend: function(){
						//that.bcclick = true;
					//},
					//complete: function(){
						//that.bcclick = false;
					//},
					//success: function(jData){
						//if(jData['status'] === 'success'){
							//callback('success');
						//}else {
							//Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						//}
					//}
				//});
			//}
			
		//};

		//return Can.util.cclick({
			//title: sCclickTitle,
			//body: sCclickBody,
			//options: {
				//max: 4,
				//items: aOptionItems
			//},
			//type: 1,
			//refs: 'cclick_Slead',
			//submit: fCClickSubmit
		//})
	//},
	//// buyerlead：传进来的对象参数 ---｛buyerleadId：12345｝
	//loadData: function (buyerlead) {
		//var _this = this;
		////this._referer = '/buyinglead';

		//this._sKeyword = this._oRoutArgs.keyword || '';

		//// if(Can.Route._referer){
		//// 	this._referer = Can.Route._referer || '/buyinglead';
		//// }

        //this._oRoutArgs.id = buyerlead.buyerleadId;
        //this.routeMark();
		//$.ajax({
			//url: Can.util.Config.seller.buyerleadDetailModule.supplierDetail,
			//cache: false,
			//data: {leadId: buyerlead.buyerleadId},
			//success: function (jData) {
				//if (jData.status && jData.status === 'success') {
					//_this.expNav.el.html('');
					//_this.contactTitNav.el.html('');
					//_this.showInfo(jData.data);
				//}else if(jData.status === "error"){
					//var _opera_fail = new Can.view.alertWindowView({
						//id: 'operaFailWindowView',
						//width: 280
					//});
					//var _content = new Can.ui.Panel({
						//cssName: 'error-box',
						//html: jData.message
					//});
					//_opera_fail.setContent(_content);
					//_opera_fail.show();
				//}else {
					//Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				//}
			//}
		//});
	//},
	////路由定义
	//routeMark: function () {
		//if (this._oRoutArgs.id) {
            //if(this._oRoutArgs._referer){
                //delete this._oRoutArgs._referer;
            //}
			//Can.Route.mark('/show-buyinglead', this._oRoutArgs);
		//}
	//},
	//runByRoute: function () {
        ////传递上一页，一下页
        //if(Can.Route._args.queue) {
            //var aList = Can.Route._args.queue;
            //var self  = this;

            //this.queue = {};
            
            //var fQueueUp = function(id){
                //var queue = self.queue, 
                    //prev = queue.prev;

                //// set previous one's next
                //if (prev) {
                    //queue[prev]['next'] = id;
                //}

                //// set current one's prev
                //queue[id] = {
                    //prev: prev,
                    //subject: ''
                //};

                //queue.prev = id;
            //};
            ////console.log(aList);
            //$.each(aList, function(k, v){
                ////console.log(v)
                //fQueueUp(v);
            //});
        //}

		//this.bid = this._oRoutArgs.id;
		//if (this._oRoutArgs.id) {
			//this.loadData({"buyerleadId": this._oRoutArgs.id});
		//}
	//},
	//onFavorite:function(fFn,fEnterFn,fLeaveFn){
		//if(typeof fFn === 'function' && typeof fEnterFn === 'function' && typeof fLeaveFn === 'function' ){
			//this.favorite.el.click(fFn).hover(fEnterFn,fLeaveFn);
		//}
	//},
    //onPhotoClick: function(fFn){
        //if(typeof fFn === 'function'){
            //this.desUl.el.on('click','li', fFn);
        //}
    //}
/*});*/
