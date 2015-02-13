/**
 * 用于处理顶部菜单栏的各种Action，同时发回对应数据给其他的Action
 * @author Island
 * @since 2012-02-19
 * @version 1.9
 */
$.moduleAndViewAction('sellerTopMenuViewId', function (topMenuView) {

	/**
	 * 点击首页按钮 处理事件
	 */
	topMenuView.onLogoClick(function (btn, event) {
		switch (Can.util.userInfo().getPackage()) {
			case -1:			
			case 8:
			case 9:
				var sellerIndexModule = Can.Application.getModule('sellerIndexModule');
				if (!sellerIndexModule) {
					Can.importJS(['js/seller/view/sellerIndexModule.js']);
					sellerIndexModule = new Can.module.SellerIndexModule();
					sellerIndexModule.start();
					Can.Application.putModule(sellerIndexModule);
				}
				if (sellerIndexModule !== Can.Application.getCurrentModule()) {
					sellerIndexModule.show();
					if (topMenuView.currentTopItemContainer) {
						topMenuView.currentTopItemContainer.removeClass('cur');
					}
				}
				break;
			case 5:
			case 6:
			case 7:
				var eSpIndexModule = Can.Application.getModule('sellerIndexModule');
				if (!eSpIndexModule) {
					Can.importJS(['js/seller/view/sellerIndexModule.js']);
					eSpIndexModule = new Can.module.SellerIndexModule({closeBuyer: true});
					eSpIndexModule.start();
					Can.Application.putModule(eSpIndexModule);
				}
				if (eSpIndexModule !== Can.Application.getCurrentModule()) {
					eSpIndexModule.show();
					if (topMenuView.currentTopItemContainer) {
						topMenuView.currentTopItemContainer.removeClass('cur');
					}
				}
				break;
			default :
				var specialIndexModule = Can.Application.getModule('expIndexModuleId');
				if (!specialIndexModule) {
					Can.importJS(['js/seller/view/expIndexModule.js']);
					specialIndexModule = new Can.module.ExpIndexModule();
					specialIndexModule.start();
					Can.Application.putModule(specialIndexModule);
				}
				if (specialIndexModule !== Can.Application.getCurrentModule()) {
					specialIndexModule.show();
					if (topMenuView.currentTopItemContainer) {
						topMenuView.currentTopItemContainer.removeClass('cur');
					}
				}
		}
	});

	/**
	 * 点击顶部我的展台菜单按钮
	 */
	topMenuView.onShowRoomClick(function (btn) {
		$(btn.currentTarget).attr('target', '_blank');
		//$(btn.currentTarget).attr('href', Can.util.Config.seller.showroom.rootURL + Can.util.userInfo().getCompanyId());
		var domainUrl = Can.util.domainUrl(Can.util.userInfo().getCompanyId());
		$(btn.currentTarget).attr('href', domainUrl + '/china-supplier/' + Can.util.userInfo().getCompanyId() + '.html');
	});

	/**
	 * 点击顶部消息中心菜单按钮
	 */
	topMenuView.onMessageCenterClick(function (btn, event) {
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
	 * 点击客户管理菜单按钮
	 */
	topMenuView.onCustomsClick(function (btn) {
		Can.importJS(['js/utils/myContacterModule.js']);
		var mycontacterModule = Can.Application.getModule('myContacterModuleId');
		if (mycontacterModule == null) {
			mycontacterModule = new Can.module.myContacterModule();
			Can.Application.putModule(mycontacterModule);
			mycontacterModule.start();
		}
		mycontacterModule.show();
		mycontacterModule.loadMenu();
		mycontacterModule.setContacterData(Can.util.Config.seller.myContacterModule.mycontacter, {page: 1});
	});

	/**
	 * 点击 顶部菜单 设置按钮事件
	 */
	topMenuView.onTopSettingClick(function (btn, event) {
		Can.Route.run('/setAccount');
	});

	/**
	 * 点击切换语言按钮 处理事件
	 */
	/*topMenuView.onSwitchLocalClick(function (bTurn) {
	 window.localStorage && (window.localStorage.lang = bTurn ? 'zh-cn' : 'en');
	 location.reload();
	 });*/
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

	/**
	 * C币余额的点击
	 */
	topMenuView.onCCoinClick(function () {
		Can.Route.run('/coinsdetail');
	});

	/**
	 * 点击 Match Buyer快捷按钮事件
	 */
	topMenuView.onMatchBuyerClick(function (btn, event) {
		Can.importJS(['js/seller/view/matchBuyerModule.js']);
		var matchBuyerModule = Can.Application.getModule('matchBuyerModuleId');
		if (!matchBuyerModule) {
			matchBuyerModule = new Can.module.matchBuyerModule();
			Can.Application.putModule(matchBuyerModule);
			matchBuyerModule.start();
		}
		matchBuyerModule.show();

	});

	/**
	 * 采购商动态
	 */
	topMenuView.onActivityClick(function (btn, event) {
		Can.Route.run('/buyer-activity');
		/*Can.importJS(['js/seller/view/buyerActivityModule.js']);*/
		//var buyerActivityModule = Can.Application.getModule('buyerActivityModuleId');
		//if (buyerActivityModule == null) {
		//buyerActivityModule = new Can.module.BuyerActivityModule();
		//buyerActivityModule.start();
		//Can.Application.putModule(buyerActivityModule);
		//}
		//buyerActivityModule.show();
		/*buyerActivityModule.load(Can.util.Config.seller.activityModule.allactivity, buyerActivityModule._params ? Can.apply(buyerActivityModule._params, {currentPage: 1, sort: 0}) : {currentPage: 1, sort: 0});*/
	});

	/**
	 * 采购列表
	 */
	topMenuView.onBuyingLeadClick(function (btn, event) {
		Can.Route.run('/buyinglead');
		//console.log('/buyinglead');
		/*Can.importJS(['js/seller/view/buyerleadModule.js']);*/
		//var buyerleadModule = Can.Application.getModule('buyerleadModuleId');
		//if (buyerleadModule == null) {
		//buyerleadModule = new Can.module.BuyerLeadModule();
		//buyerleadModule.start();
		//Can.Application.putModule(buyerleadModule);
		//}
		/*buyerleadModule.show();*/

	});

	/**
	 * 点击 Add Product快捷按钮事件
	 */
	topMenuView.onAddProductClick(function (btn, event) {
		Can.importJS(['js/seller/view/addProductModule.js']);
		var addProductModule = Can.Application.getModule('addProductModuleId');
		if (!addProductModule) {
			addProductModule = new Can.module.addProductModule();
			Can.Application.putModule(addProductModule);
			addProductModule.start();
		}
		addProductModule.show();
	});

	/**
	 * 点击 Product Manage 快捷按钮事件
	 */
	topMenuView.onManageProductClick(function (btn, event) {
		/*Can.importJS(['js/seller/view/productManageModule.js']);*/
		//var productManageModule = Can.Application.getModule('productManageModuleId');
		//if (!productManageModule) {
		//productManageModule = new Can.module.productManageModule();
		//Can.Application.putModule(productManageModule);
		//productManageModule.start();
		//}
		//productManageModule.show();
		//productManageModule.deleteLeftMenuItem();
		//productManageModule.loadMenu();
		//productManageModule.select_textFeild.setValue('');
		//var groupId = $(productManageModule.currentGroup).attr('id') || "";
		/*productManageModule.setProductData(Can.util.Config.seller.manageProduct.productList, {productGroupId: groupId});*/
		Can.Route.run('/product-manage');
	});

	/**
	 * 产品统计
	 */
	topMenuView.onProductStatusClick(function () {
		Can.importJS(['js/seller/view/productStatusModule.js']);
		var productStatusModule = Can.Application.getModule('productStatusModuleId');
		if (!productStatusModule) {
			productStatusModule = new Can.module.productStatusModule();
			productStatusModule.start();
			Can.Application.putModule(productStatusModule);
		}
		productStatusModule.show();
		productStatusModule.loadData(Can.util.Config.seller.productStatus.status);
	});

	/**
	 * 我的展台设置
	 */
	topMenuView.onSetShowRoomClick(function () {
		if(Can.util.userInfo().getAccountType()==1){
			Can.Route.run('/showroom-info');
		}else {
			var win = new Can.view.msgWindowView({
				width: 300,
				height: 150
			});
			var html = '<div class="xxx" style="padding: 20px;"><p class="txt"><h3 style="color: #575757; font-size: 14px; font-weight: bold;">Sorry!</h3><div style="padding-top: 10px; font-size: 12px;">You do not have permission to enter the function module<br></div></p><div class="mod-actions" style="text-align: center; margin-top: 15px;"><a id="ice-mail-activate" href="javascript:;" class="btn btn-s11"><span>OK</span></a></div></div>';

			win.setContent(html);
			win.show();
			
			$("#ice-mail-activate").click(function () {
				win.close();
			});
		}
		/*Can.importJS(['js/seller/view/setShowroomModule.js']);*/
		//var setModule = Can.Application.getModule('sellerSetShowroomModuleId');
		//if (!setModule) {
		//setModule = new Can.module.SetShowroomModule();
		//setModule.start();
		//Can.Application.putModule(setModule);
		//}
		/*setModule.show();*/
	});

	/**
	 * 直通车统计
	 */
	topMenuView.onCarCountClick(function () {
		Can.importJS(['js/seller/view/statisticsModule.js']);
		var statistics = Can.Application.getModule('statisticsModuleId');
		if (!statistics) {
			statistics = new Can.module.statisticsModule();
			statistics.start();
			Can.Application.putModule(statistics);
		}
		statistics.show();
		statistics.showCarView();
	});

	/**
	 * 交换器统计
	 */
	topMenuView.onExcCountClick(function () {
		Can.importJS(['js/seller/view/statisticsModule.js']);
		var statistics = Can.Application.getModule('statisticsModuleId');
		if (!statistics) {
			statistics = new Can.module.statisticsModule();
			statistics.start();
			Can.Application.putModule(statistics);
		}
		statistics.show();
		statistics.showExchangerView();
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
                    if(jData.data.attention){
                        topMenuView.showAttentionTips();
                    }
                }
			}
		})
	});
});
