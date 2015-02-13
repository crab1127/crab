/**
 * 采购商管理主程序
 */
Can.importJS([
	'js/utils/userAccountView.js',
	'js/utils/windowView.js',
	'js/buyer/view/topMenuView.js'
]);
$(function () {
	Can.util.userInfo(Can.util.Config.accountInfo);
	isRightUserType();
	/**
	 * Can入口JS。
	 * 实现加载VIEW、初始化widgets
	 * @author Island
	 * @since 2012-02-19
	 * @version 1.0
	 */
	Can.Application = function () {
		var startTime1 = new Date(),
			currentModule = null;
		//console.log('==== Canton Fair is starting now =====');
		/**
		 * 存放引用所有VIEW
		 */
		var CanViews = new Can.util.ArrayMap();

		/**
		 * 用于存放所有已经初始化的模块
		 */
		var startedModules = new Can.util.ArrayMap();

		//顶部toolbar
		var TOOLBAR_TOP1 = 'Can_toolbar1';
		var toolbarView1 = new Can.view.TopMenuView({id: 'buyerTopMenuViewId'});
		var currentUser = {
			username: Can.util.userInfo().getUserName(),
			userid: Can.util.userInfo().getUserId(),
			firstlogin: Can.util.userInfo().isFirst()
		};

		var useraccountView = new Can.view.UserAccountView({
			id: 'buyerAccountId',
			actionJs: ['js/buyer/action/useraccountAction.js'],
			items: [
				{id: 1, txt: Can.msg.ACCOUNT_MENU.PROFILE},
				{id: 2, txt: Can.msg.ACCOUNT_MENU.CHANGE_PWD},
				{id: 3, txt: Can.msg.ACCOUNT_MENU.SET_BUSS},
				{id: 0, txt: Can.msg.ACCOUNT_MENU.LOGOUT}
			], currentUser: currentUser
		});
		useraccountView.start();
		toolbarView1.setCurrentUserView(useraccountView);
		addView(TOOLBAR_TOP1, toolbarView1);
		startedModules.put('userAccountView', useraccountView);

		Can.util.EventDispatch.addEvent(initEvents());
		//OK, we are going to trigger the application now
		startupApp();


		var startTime2 = new Date();
		console.log('==== Canton Fair has started, it costs:' + (startTime2.getTime() - startTime1.getTime()) + 'ms  =====');

		function addView(key, view) {
			CanViews.put(key, view);
		}

		function startupApp() {
			document.title = Can.msg.APP_TITLE['BUYER'];
			CanViews.each(function (index, key, value) {
				if (typeof value == 'object') {
					value.start();
				}
				return true;
			});
			if (currentUser.firstlogin) {
				//首次登录，加载采购偏好设置
				toolbarView1.hideAllFunctions();
				Can.importJS(['js/buyer/view/purchasePreferModule.js']);
				var purchasePreferModule = new Can.module.purchasePreferModule();
				purchasePreferModule.start();
				purchasePreferModule.show();
				currentModule = purchasePreferModule;
				startedModules.put(purchasePreferModule.getId(), purchasePreferModule);
			}
			else {
				var sRouteId = Can.Route.analyze().id || '/';
				if (sRouteId === '/') {
					//默认进入首页
					Can.importJS(['js/buyer/view/buyerIndexModule.js']);
					var buyerIndexModule = new Can.module.buyerIndexModule();
					buyerIndexModule.start();
					buyerIndexModule.hide(true);
					startedModules.put(buyerIndexModule.getId(), buyerIndexModule);

					var goHome = function () {
						//默认进入首页
						buyerIndexModule.show();
						currentModule = buyerIndexModule;
					};
				}
				toolbarView1.showAllFunctions();
				//路由初始化
				Can.Route.init({
					getModule: function (moduleId) {
						return startedModules.get(moduleId);
					},
					putModule: function (module) {
						if (module instanceof Can.module.BaseModule ||
							module instanceof Can.view.BaseView) {
							startedModules.put(module.getId(), module);
						}
					},
					setCurrentModule: function (m) {
						currentModule = m;
					},
					type: 'buyer'
				}, goHome);
			}
		}

		/**
		 * 定义Can.util.EventDispatch事件，
		 * 类似于MVC里面URL映射文件，我们通过EventDispatch将事件分发到对应
		 * 注册的handler里面进行处理，同时绑定一些数据给到handler。
		 * <strong>这个事件是全局的，用于View与View之间进行通信</strong>
		 */
		function initEvents() {
			return [
				'ON_MODULE_SWITCH', //当前模块显示事件
				'ON_ERROR_HANDLE'//错误处理，在所有的请求返回非success时触发此事件
			].toString();
		}

		return {
//			rootUrl: 'js/buyer/',
			getCanViews: function () {
				return CanViews;
			},
			getTopMenuView: function () {
				return CanViews.get(TOOLBAR_TOP1);
			},
			getStartedModules: function () {
				return startedModules;
			},
			getModule: function (moduleId) {
				return startedModules.get(moduleId);
			},
			putModule: function (module) {
				if (module instanceof Can.module.BaseModule ||
					module instanceof Can.view.BaseView) {
					startedModules.put(module.getId(), module);
				}
			},
			/**
			 * 放回当前显示的模块
			 */
			getCurrentModule: function () {
				return currentModule;
			},
			setCurrentModule: function (m) {
				currentModule = m;
			},
			PushIO: function () {
				// connect socket
				var jMsgInfo = JSON.parse(window.localStorage.getItem('msgSocket'));
				if (jMsgInfo && jMsgInfo['listenUrl'] && typeof io === 'object') {
					var oMsgSocket = io.connect(jMsgInfo['listenUrl'], {'force new connection': true});
					oMsgSocket.on('connect', function () {
						oMsgSocket.emit('loginServer', {
							token: jMsgInfo['token']
						});
					});
					// session 丢失
					oMsgSocket.on('logout', function (jLogout) {
						oMsgSocket.socket.disconnect();
					});
					// 消息中心消息推送
					oMsgSocket.on('news', function (jServerMsg) {
						Can.Application.getTopMenuView().fireEvent('ON_MSG_GET', jServerMsg);
					});
				}
			}
		};
	}();
	Can.Application.PushIO();
});
