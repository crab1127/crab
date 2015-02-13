/**
 * BuyerLead Module Action
 * User: island
 * Date: 13-1-20
 * Time: 上午1:54
 */
$.moduleAndViewAction('buyerleadModuleId', function (buyingLead) {

	buyingLead.setSearchItem(Can.util.Config.seller.buyerleadModule.searchItem);

	/**
	 * 搜索buyerlead
	 */
	buyingLead.onSearchBtnClick(function () {
		var selectData = {
			"category": buyingLead.categoryField.getValue() || null,
			"region": buyingLead.regionField.getValue() || null,
			"latest": buyingLead.latestField.getValue() || 0,
			"keyword": buyingLead.searchField.getValue() || null,
			"page": 1
		};
		if (buyingLead.showTabIs == "all") {
			buyingLead.emptylist();
			buyingLead.conditionAll = buyingLead.collectCondition();
			buyingLead.load(Can.util.Config.seller.buyerleadModule.allbuyerlead, selectData);
		} else {
			buyingLead.emptylist();
			buyingLead.conditionMy = buyingLead.collectCondition();
			buyingLead.load(Can.util.Config.seller.buyerleadModule.mybuyerlead, selectData);
		}
	});


	//curren是当前记录在本页中的序号，方便下/上一页时快速找到相应buyerLeadID
	//blType 标注BL的类型，002为网上导入BL
	buyingLead.on('onbuyerleadtitleclick', function (buyerlead, obj) {
		Can.importJS(['js/utils/buyingLeadDetailModule.js']);
		var blDetailModule = Can.Application.getModule('buyingLeadDetailModuleId');
		if (blDetailModule == null) {
			blDetailModule = new Can.module.BuyingLeadDetailModule();
			Can.Application.putModule(blDetailModule);
			blDetailModule.start();
		}
		blDetailModule.isLogin = true;
		blDetailModule.userType = 'supplier';
		blDetailModule.updateTitle(buyerlead.subject);
		blDetailModule.bid = buyerlead.leadId;
		blDetailModule.queue = this.queue;
//         blDetailModule.blType_mark=buyingLead.showTabIs;
		blDetailModule.loadData({"buyerleadId": buyerlead.leadId});
		blDetailModule.show();
		if (obj.parents("div.item").hasClass("unread")) {
			obj.parents("div.item").removeClass("unread").addClass("read").find(".ico-b4").removeClass("ico-b4").addClass("ico-b5");
		}
		/*把bl设为已读状态*/
		if (buyingLead.showTabIs === "all") {
			$.ajax({
				url: Can.util.Config.seller.buyerleadModule.updatePushInfoRead,
				data: {pushInfoId: buyerlead.leadId},
				type: 'post',
				success: function (resultData) {
					/*if(resultData.status!="success"){
					 Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, resultData);
					 }*/
				}
			});
		}
	});

//    buyingLead.on('onquoteclick', function (buyerlead) {
//        var _data = {
//            address:{
//                text:buyerlead.userinfo.username,
//                value:buyerlead.userinfo.buyerid
//            }
//        };
//        Can.util.canInterface('writeEmail', [Can.msg.MESSAGE_WINDOW.WRITE_TIT, _data]);
//    });

	buyingLead.on('onShowInfoView', function (buyerlead) {
		Can.importJS(['js/utils/userInfoBoxView.js']);
		var buyerInfoWin = new Can.view.titleWindowView({
			title: Can.msg.INFO_WINDOW.BUYER_INFO_TIT,
			width: 410
		});
		var buyerInfoContentEl = new Can.view.webCantonBuyerInfoView({
			parentEl: buyerInfoWin
		});
		buyerInfoContentEl.startup();
		buyerInfoContentEl.loadData(Can.util.Config.seller.profileWindow.webCantonBuyer, {buyerId: buyerlead.buyerId})
		buyerInfoWin.setContent(buyerInfoContentEl.contentEl);
		buyerInfoWin.show();
	});

	buyingLead.on('onviewsellinfoclick', function () {
		$('#activityBtnId').trigger('click');
	});

	buyingLead.on('onviewnowclick', function () {
		$('#matchBuyerBtnId').trigger('click');
	});

	buyingLead.on('onreturnclick', function () {
		buyingLead.load(Can.util.Config.seller.buyerleadModule.allbuyerlead, {});
	});

	buyingLead.on('onbuyerleadusernameclick', function (buyerlead, text) {
		Can.util.canInterface('personProfile', [2, buyerlead.buyerId]);
	});

	buyingLead.on('ON_TAB_SWITCH', function (sType) {
		buyingLead.emptylist();
		sType = sType.toUpperCase();
		buyingLead.queue = {};
		if (sType === 'ALL') {
			if ($.isEmptyObject(buyingLead.conditionAll)) {
				buyingLead.setSearchItem(Can.util.Config.seller.buyerleadModule.searchItem);
			} else {
				buyingLead.regionField.valueItems = buyingLead.conditionAll.regValueItem;
				buyingLead.regionField.labelItems = buyingLead.conditionAll.regLabelItem;
				buyingLead.regionField.updateOptions();
				buyingLead.categoryField.valueItems = buyingLead.conditionAll.ctgValueItem;
				buyingLead.categoryField.labelItems = buyingLead.conditionAll.ctgLabelItem;
				buyingLead.categoryField.updateOptions();
			}
			buyingLead.load(Can.util.Config.seller.buyerleadModule.allbuyerlead, {"category": buyingLead.conditionAll.category, "region": buyingLead.conditionAll.region,
				"latest": buyingLead.conditionAll.latest || buyingLead.latestField.valueItems[3], "keyword": buyingLead.conditionAll.keyword, "page": 1});
		}
		else {
			if ($.isEmptyObject(buyingLead.conditionMy)) {
				buyingLead.setSearchItem(Can.util.Config.seller.buyerleadModule.searchMyItem);
			} else {
				buyingLead.regionField.valueItems = buyingLead.conditionMy.regValueItem;
				buyingLead.regionField.labelItems = buyingLead.conditionMy.regLabelItem;
				buyingLead.regionField.updateOptions();
				buyingLead.categoryField.valueItems = buyingLead.conditionMy.ctgValueItem;
				buyingLead.categoryField.labelItems = buyingLead.conditionMy.ctgLabelItem;
				buyingLead.categoryField.updateOptions();
			}
			buyingLead.load(Can.util.Config.seller.buyerleadModule.mybuyerlead, {"category": buyingLead.conditionMy.category, "region": buyingLead.conditionMy.region,
				"latest": buyingLead.conditionMy.latest, "keyword": buyingLead.conditionMy.keyword, "page": 1});
		}
	});
});
