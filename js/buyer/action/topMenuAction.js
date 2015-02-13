/**
 * 用于处理顶部菜单栏的各种Action，同时发回对应数据给其他的Action
 * @author Island
 * @since 2012-01-24
 * @version 1.5
 */
$.moduleAndViewAction('buyerTopMenuViewId', function (topMenuView) {

	/**
	 * 点击首页按钮 处理事件
	 */
	topMenuView.onLogoClick(function (btn, event) {
		var buyerIndexModule = Can.Application.getModule('buyerIndexModule');
		if (!buyerIndexModule) {
			Can.importJS(['js/buyer/view/buyerIndexModule.js']);
			buyerIndexModule = new Can.module.buyerIndexModule();
			buyerIndexModule.start();
			Can.Application.putModule(buyerIndexModule);
		}
		if (buyerIndexModule !== Can.Application.getCurrentModule()) {
			buyerIndexModule.show();
			if (topMenuView.currentTopItemContainer) {
				topMenuView.currentTopItemContainer.removeClass('cur');
			}
		}
	});

	/**
	 * 点击Room按钮
	 */
	topMenuView.onRoomClick(function (btn, event) {
		Can.importJS(['js/buyer/view/myRoomModule.js']);
		var myroomModule = Can.Application.getModule('myRoomModuleId');
		if (!myroomModule) {
			myroomModule = new Can.module.myRoomModule();
			Can.Application.putModule(myroomModule);
			myroomModule.start();
		}
		myroomModule.show();
		// myroomModule.selectItemBox.getMenuItem(Can.util.Config.buyer.myroomModule.myroom_items);
		// myroomModule.firstClick();
		myroomModule.node.page.val(1);
		myroomModule.filterList();
	});

	/**
	 * 点击search按钮
	 */
	topMenuView.onSearchClick(function (btn, event) {
		Can.importJS(['js/buyer/view/searchModule.js']);
		var SearchModule = Can.Application.getModule('advanceSearchModuleId');
		if (!SearchModule) {
			SearchModule = new Can.module.SearchModule();
			Can.Application.putModule(SearchModule);
			SearchModule.start();
		}
		SearchModule.show();
	});

	/**
	 * 点击opportunities按钮
	 */
	topMenuView.onOppoClick(function (btn, event) {
		Can.importJS(['js/buyer/view/opportunityModule.js']);
		var opportunityModule = Can.Application.getModule('OpportunityModuleId');
		if (!opportunityModule) {
			opportunityModule = new Can.module.opportunityModule();
			Can.Application.putModule(opportunityModule);
			// opportunityModule.live = true;
			opportunityModule.start();
		}
		// opportunityModule.live = true;
		opportunityModule.show();
		opportunityModule.init();
		// opportunityModule.OptItemsView.setMenuItem(Can.util.Config.buyer.opportunity.live);
		//opportunityModule.OptItemsView.setMenuItem(Can.util.Config.buyer.opportunity.opportunity_itmes);

	});

	/**
	 * 点击Manager Buyerlead
	 */
	topMenuView.onManageBuyerleadClick(function (btn, event) {
		Can.importJS(['js/buyer/view/buyerLeadManageModule.js']);
		var buyerLeadManage = Can.Application.getModule('buyerLeadManageModuleId');
		if (!buyerLeadManage) {
			buyerLeadManage = new Can.module.buyerLeadManageModule();
			Can.Application.putModule(buyerLeadManage);
			buyerLeadManage.start();
		}
		buyerLeadManage.show();
	});

	// /**
	//  * 点击了Post Buyerlead
	//  */
	// topMenuView.onPostBuyerleadClick(function (btn, event) {
	// 	Can.importJS(['js/buyer/view/postBuyerLeadModule.js']);
	// 	$('#postBuyerLeadModuleID').remove();
	// 	var postBuyerleadModule = new Can.module.postBuyerLeadModule();
	// 	Can.Application.putModule(postBuyerleadModule);
	// 	postBuyerleadModule.start();
	// 	postBuyerleadModule.show();
	// 	$('#postBuyerLeadModuleID').show();
	// 	Can.Application.setCurrentModule(postBuyerleadModule);
	// 	// postBuyerleadModule.OptItemsView.setMenuItem(Can.util.Config.buyer.opportunity.opportunity_itmes)
	// });

	/**
	 * 客户管理
	 */
	topMenuView.onCustomerBtnClick(function (btn, even) {
		Can.importJS(['js/utils/myContacterModule.js']);
		var mycontacterModule = Can.Application.getModule('myContacterModuleId');
		if (!mycontacterModule) {
			mycontacterModule = new Can.module.myContacterModule();
			Can.Application.putModule(mycontacterModule);
			mycontacterModule.start();
		}
		mycontacterModule.show();
		mycontacterModule.setContacterData(Can.util.Config.contacts.list, {page: 1});
	});

	/**
	 * 消息中心
	 */
	topMenuView.onMsgBtnClick(function (btn, even) {
		Can.importJS(['js/utils/msgCenterModule.js']);
		var msgCenterModule = Can.Application.getModule('msgCenterModuleId');
		if (!msgCenterModule) {
			msgCenterModule = new Can.module.msgCenterModule();
			Can.Application.putModule(msgCenterModule);
			msgCenterModule.start();
		}
		msgCenterModule.show();
	});

	/**
	 * 我的设置
	 */
	topMenuView.onSettingBtn1CLICK(function (btn, even) {
		Can.importJS(['js/buyer/view/mySettingModule.js']);
		var mySetting = Can.Application.getModule('mySettingModuleId');
		if (!mySetting) {
			mySetting = new Can.module.mySettingModule();
			Can.Application.putModule(mySetting);
			mySetting.start();
		}
		mySetting.show();
		mySetting.goToURL(Can.util.Config.buyer.mySetting.personProfile);
	});


	/**
	 * 捕获到新消息更新
	 */
	topMenuView.on('ON_MSG_GET', function (jData) {
		var nTotal = 1;
		var jMsg = {
			messageId: jData.sourceId,
			subject: jData.subject
		};
		this.showNewMsgTips(nTotal);
		this.showMsgCount(jMsg);
		// 如果是在消息中心界面，刷新列表
		var _msg_center = Can.Application.getCurrentModule();
		if (_msg_center.id === 'msgCenterModuleId') {
			_msg_center.fireEvent('ON_REFRESH_LIST');
		}
	});
	topMenuView.on('ON_MSG_READ', function (bIncrease) {
		this.showNewMsgTips(bIncrease ? 1 : -1);
	});
	// 首次进入都读取一次未读消息
	$(function () {
		$.ajax({
			url: Can.util.Config.seller.messageCenter.recentUnreadMsg,
			consoleError: false,
			success: function (jData) {
				if (jData && jData.data) {
					if (jData.data.list) {
						for (var i = jData.data.list.length; i > 0; i--) {
							topMenuView.showMsgCount(jData.data.list[i - 1]);
						}
					}
					topMenuView.showNewMsgTips(jData.data.total || 0);
				}
			}
		})
	});

	/**
	 * 点击切换语言按钮 处理事件
	 */
	topMenuView.onSwitchLangCnClick(function () {
        sessionStorage.categoryTree = [];
		window.localStorage && (window.localStorage.lang = 'zh-cn');
		location.reload();
	});

	topMenuView.onSwitchLangEnClick(function () {
        sessionStorage.categoryTree = [];
		window.localStorage && (window.localStorage.lang = 'en');
		location.reload();
	});
});
