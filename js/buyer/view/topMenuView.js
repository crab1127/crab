/**
 * 顶部系统菜单
 * @author island
 * @since 2013-01-16
 */
Can.view.TopMenuView = Can.extend(Can.view.BaseView, {
	actionJs: ['js/buyer/action/topMenuAction.js'],
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.view.TopMenuView.superclass.constructor.call(this);
		this.addEvents('ON_MSG_GET', 'ON_MSG_READ');

		//最顶部左侧系统功能模块菜单按钮
		this.toolbar1 = new Can.ui.toolbar.Toolbar({id: 'toolbar1', cssName: 'nav'});

		this.toolbar1.on('onitemclick', this.setTopToolbarSelectedItem, this);

		//消息提示
		this.msgList = new Can.ui.Panel({cssName: 'submenu'});

		//最顶部右侧系统辅助功能按钮
		this.toolbar2 = new Can.ui.toolbar.Toolbar({id: 'toolbar2', cssName: 'ec-person'});
		this.toolbar2.show();

		//系统功能模块快捷方式按钮
		this.functionToolbar = new Can.ui.toolbar.Toolbar({id: 'functionToolbar', cssName: 'm-menu clear'});
		this.functionToolbar.on('onitemclick', this.setTopToolbarSelectedItem, this);

		//初始化系统模块按钮组[start]
		this.homeBtn = new Can.ui.toolbar.ModuleMenuButton({id: 'homeBtnId', cssName: 'ico-n1', text: Can.msg.BUTTON.TOP_BAR_1.HOME});
		this.msgBtn = new Can.ui.toolbar.ModuleMenuButton({id: 'msgBtnId', cssName: 'ico-n3', text: Can.msg.BUTTON.TOP_BAR_1.MSG_CENTER});
		this.customerBtn = new Can.ui.toolbar.ModuleMenuButton({id: 'customerBtnId', cssName: 'ico-n4', text: Can.msg.BUTTON.TOP_BAR_1.CUSTOMER_MANAGE});
		this.settingBtn1 = new Can.ui.toolbar.ModuleMenuButton({id: 'mySettingBtnId', cssName: 'ico-n5', text: Can.msg.BUTTON.TOP_BAR_1.SETTING});
		this.logoPanel = new Can.ui.Panel({
			id: 'logoPanelId', wrapEL: 'h1', cssName: 'logo', html: '<a title="" href="/"><img width="185" height="30" src="' + Can.util.Config['static'].logoImage + '" alt=""></a><span class="beta"></span>'
		});
		this.supplierService = new Can.ui.Panel({
			cssName: 'jer',
			html: '<a href="javascript:;">' + Can.msg.SERVICES.MENU_TITLE + '<i class="triangle-d"></i></a>'
		});
		this.toolbar2.addItem(this.supplierService);

		this.serviceList = new Can.ui.Panel({
			cssName: 'submenu hidden',
			html: '<a href="' + Can.util.Config.seller.services.cardPay + '" target="_blank">' + Can.msg.SERVICES.CARD_PAY + '</a>'
		});

		this.switchLanguage = new Can.ui.Panel({
			cssName: 'jer',
			html: '<a href="javascript:;">' + Can.msg.BUTTON.TOP_BAR_1.LANGUAGE + '<i class="triangle-d"></i></a>'
		});
		this.toolbar2.addItem(this.switchLanguage);

		this.switchLocalList = new Can.ui.Panel({
			cssName: 'submenu switchLocal hidden',
			html: '<a href="javascript:;">' + Can.msg.BUTTON.TOP_BAR_1.LANGUAGE_CN + '</a><a href="javascript:;">' + Can.msg.BUTTON.TOP_BAR_1.LANGUAGE_EN + '</a>'
		});
		//初始化系统模块按钮组[end]

		//初始化功能模块快捷方式组[start]
		this.funToolbarContainer = new Can.ui.Panel({
			id: 'funToolbarContainerId', wrapEL: 'div', cssName: 'bd'
		});
		this.funToolbarInnerPanel = new Can.ui.Panel({
			wrapEl: 'div', cssName: 'inner'
		});
		this.roomBtn = new Can.ui.toolbar.FunctionShortcutMenuButton({id: 'roomId', cssName: 'ico-m1', text: Can.msg.BUTTON.TOP_BAR_2.MY_ROOM});
		this.searchBtn = new Can.ui.toolbar.FunctionShortcutMenuButton({id: 'searchBtnId', cssName: 'ico-m2', text: Can.msg.BUTTON.TOP_BAR_2.SEARCH});
		this.oppoBtn = new Can.ui.toolbar.FunctionShortcutMenuButton({id: 'oppoBtnId', cssName: 'ico-m3', text: Can.msg.BUTTON.TOP_BAR_2.COLLECTIONS});
		this.mbuyerleadBtn = new Can.ui.toolbar.FunctionShortcutMenuButton({id: 'mbuyerleadBtnId', cssName: 'ico-m4', text: Can.msg.BUTTON.TOP_BAR_2.MANAGE_BL});
		this.pbuyerleadBtn = new Can.ui.toolbar.FunctionShortcutMenuButton({id: 'pbuyerleadBtnId', cssName: 'ico-m5', text: Can.msg.BUTTON.TOP_BAR_2.POST_BL});

        //修改发布采购需求的连接
        this.pbuyerleadBtn.el.attr({
            href: Can.util.Config.EN.url.postBuyinglead,
            target: '_blank'
        });

		//初始化功能模块快捷方式组[end]
	},
	/**
	 * 隐藏所有的功能
	 */
	showAllFunctions: function () {
		this.toolbar1.show();
		this.toolbar2.show();
		this.funToolbarContainer.getDom().show();
	},
	/**
	 * 隐藏所有的功能
	 */
	hideAllFunctions: function () {
		this.toolbar1.hide();
		this.toolbar2.hide();
		this.funToolbarContainer.getDom().hide();
	},
	setTopToolbarSelectedItem: function (toolbar, selectedItem, selectItemContainer) {
		if (this.currentTopItemContainer) {
			this.currentTopItemContainer.removeClass('cur');
		}
		this.currentTopItemContainer = selectItemContainer;
		this.currentTopItemContainer.addClass('cur');
	},
	/**
	 * 加入当前用户的操作下拉框
	 */
	setCurrentUserView: function (view) {
		if (view instanceof Can.view.UserAccountView) {
			view.applyTo(this.toolbar2.getDom());
		}
	},
	/**
	 * 启动Can。
	 * 所有UI均需要在此方法中进行初始化
	 */
	startup: function () {
		//初始化第一级菜单[start]
		var toptoolbarContainer1 = new Can.ui.Panel({
			id: 'toptoolbarContainer1Id',
			wrapEL: 'div',
			cssName: 'hd'
		});
		var toptoolbarInnerPanel = new Can.ui.Panel({
			wrapEl: 'div',
			cssName: 'inner clear'
		});
		this.logoPanel.applyTo(toptoolbarInnerPanel.getDom());
		this.toolbar1.applyTo(toptoolbarInnerPanel.getDom());
		this.toolbar2.applyTo((toptoolbarInnerPanel.getDom()));
		toptoolbarInnerPanel.applyTo(toptoolbarContainer1.getDom());
		toptoolbarContainer1.applyTo('header');
		this.toolbar1.addItem(this.homeBtn);
		this.toolbar1.addItem(this.msgBtn);
		this.toolbar1.addItem(this.customerBtn);
		this.toolbar1.addItem(this.settingBtn1);
		/*外贸服务*/
		var $SupplierService = this.supplierService.el.parent();
		var _this = this;
		$SupplierService.addClass('left');
		this.serviceList.applyTo($SupplierService);
		$SupplierService
			.mouseenter(function () {
				_this.serviceList.el.removeClass('hidden');
			}).mouseleave(function () {
				_this.serviceList.el.addClass('hidden');
			});

		var $switchLocal = this.switchLanguage.el.parent();
		this.switchLocalList.applyTo($switchLocal);
		$switchLocal
			.mouseenter(function () {
				_this.switchLocalList.el.removeClass('hidden');
			}).mouseleave(function () {
				_this.switchLocalList.el.addClass('hidden');
			});
		//初始化第一级菜单[end]

		//初始化第二级菜单[start]
		this.functionToolbar.applyTo(this.funToolbarInnerPanel.getDom());
		this.funToolbarInnerPanel.applyTo(this.funToolbarContainer.getDom());
		this.funToolbarContainer.applyTo('header');
		this.functionToolbar.addItem(this.roomBtn);
		this.functionToolbar.addItem(this.searchBtn);
		this.functionToolbar.addItem(this.oppoBtn);
		this.functionToolbar.addItem(this.mbuyerleadBtn);
		this.functionToolbar.addItem(this.pbuyerleadBtn);
		this.functionToolbar.show();
		//初始化第二级菜单[end]
	},
	onLogoClick: function (fn) {
		if (typeof fn == 'function') {
			this.homeBtn.click(fn);
		}
	},
	onRoomClick: function (fn) {
		if (typeof fn == 'function') {
			this.roomBtn.click(fn);
		}
	},
	onSearchClick: function (fn) {
		if (typeof fn == 'function') {
			this.searchBtn.on('onclick', fn);
		}
	},
	onOppoClick: function (fn) {
		if (typeof fn == 'function') {
			this.oppoBtn.click(fn);
		}
	},
	onManageBuyerleadClick: function (fn) {
		if (typeof fn == 'function') {
			this.mbuyerleadBtn.click(fn);
		}
	},
	onPostBuyerleadClick: function (fn) {
		if (typeof fn == 'function') {
			this.pbuyerleadBtn.click(fn);
		}
	},
	onCustomerBtnClick: function (fn) {
		if (typeof fn == 'function') {
			this.customerBtn.click(fn);
		}
	},
	onMsgBtnClick: function (fn) {
		if (typeof fn === "function") {
			this.msgBtn.click(fn);
		}
	},
	onSettingBtn1CLICK: function (fn) {
		if (typeof fn === "function") {
			this.settingBtn1.click(fn);
		}
	},
	showNewMsgTips: function (nLen) {
		var oMsgBtn = this.toolbar2.getItems().get('msgBtnId').el;
		if (oMsgBtn.length) {
			var nTotal = parseInt(oMsgBtn.attr('newMsg') || 0, 10);
			nTotal += nLen;
			if (nTotal > 0) {
				oMsgBtn.attr('newMsg', nTotal);
				oMsgBtn.addClass('new-msg');
			}
			else {
				oMsgBtn.removeClass('new-msg');
			}
		}
	},
	showMsgCount: function (obj) {
		var _this = this,
			$msg = _this.toolbar1.el.find('#msgBtnId');

		$msg.after(_this.msgList.getDom());
		var _more = '';
		if (Can.Application.getCurrentModule() && Can.Application.getCurrentModule().id === 'msgCenterModuleId') {
			_this.msgList.el.addClass('hidden');
			_more = ' hidden';
		}
		else {
			$msg.parent().addClass('msgcur');
			_this.msgList.el.removeClass('hidden');
			$msg.parent().find('.more').removeClass('hidden');
		}

		if (obj) {
			var $html = $('<a href="javascript:;" msgId=' + obj.messageId + ' style="display:none;">' + obj.subject + '</a>');

			_this.msgList.el.prepend($html);

			$html.slideDown(function () {
				if (_this.msgList.el.find('a').length > 3) {
					if (_this.msgList.el.parent().find('.more').length > 0) {
						return;
					}
					_this.msgList.el.after('<div class="more' + _more + '">' + Can.msg.BUTTON.VIEW_DETAIL + '</div>');
				}
				_this.msgList.el.off('click', 'a').on('click', 'a', function () {
					var msgId = $(this).attr('msgId');
					_this.MsgDelete(msgId, "read");

				});
				_this.msgList.el.parent().off('click', '.more').on('click', '.more', function () {
					Can.Route.run('/msg-center');
					_this.msgList.el.remove();
					$(this).remove();
				});

				$msg.parent()
					.mouseenter(function () {
						$(this).addClass('msgcur');
						_this.msgList.el.removeClass('hidden');
						$(this).parent().find('.more').removeClass('hidden');
					}).mouseleave(function () {
						$(this).removeClass('msgcur');
						_this.msgList.el.addClass('hidden');
						$(this).parent().find('.more').addClass('hidden');
					});
			});
		}
	},
	MsgDelete: function (sId, sRead) {
		var _this = this;
		var $msg = _this.toolbar1.el.find('#msgBtnId');
		var $msgId = _this.msgList.el.find('a[msgId=' + sId + ']');

		$msgId.slideUp(function () {
			$(this).remove();
			if (sRead === 'read') {
				Can.util.canInterface('readEmail', [
					{messageId: sId},
					true
				]);
				_this.fireEvent('ON_MSG_READ');
			}
			if (_this.msgList.el.find('a').length < 4) {
				$msg.parent().find('.more').remove();
			}
			if (_this.msgList.el.find('a').length <= 0) {
				$msg.parent().removeClass('msgcur');
				_this.msgList.el.remove();
			}
		});
	},
	onSwitchLangCnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.switchLocalList && this.switchLocalList.el.find("a:first").click(fFn);
		}
	},
	onSwitchLangEnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.switchLocalList && this.switchLocalList.el.find("a:last").click(fFn);
		}
	}
});
