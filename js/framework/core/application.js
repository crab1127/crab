Can.importJS([
    'js/utils/userAccountView.js',
    'js/utils/windowView.js',
    'js/seller/view/topMenuView.js'
]);

$(function () {
    // global constant variable
    window.CON = {};
    Can.util.userInfo(Can.util.Config.accountInfo);
    if (!Can.util.userInfo().isLogin()) {
        return;
    }
    isRightUserType();

    // refresh C coin
    var refreshCoin = function (data) {
        var $el,
            CON_coin = window.CON.coin,
            left = data.availableMoney;

        if (CON_coin) {
            CON_coin.text(left);
        } else {
            $el = $([
                '<li>',
                '<div class="jer coin">',
                    '<span class="label">' + Can.msg.BALANCE + ':</span>',
                    '<strong class="em"><span id="memberCoin">' + left + '</span></strong>',
                '</div>',
                '</li>'
            ].join(''))
                .appendTo($('#toolbar2'));

            window.CON.coin = $el.find('#memberCoin')
        }
    };
    Can.util.refreshMemberCoin = function (data) {
        if (data) {
            refreshCoin(data);
        } else {
            $.ajax({
                url: Can.util.Config.seller.coin,
                success: function (d) {
                    if (d['status'] !== 'success') {
                        return;
                    }

                    refreshCoin(d['data']);
                }
            });
        }
    };

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
        //console && console.log('==== Canton Fair is starting now =====');
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
        var toolbarView1 = new Can.view.TopMenuView({id: 'sellerTopMenuViewId'});
        // 按权限加载菜单
        Can.importJS(['js/utils/menuCreator.js']);
        Can.util.menuCreate.create(toolbarView1, Can.util.userInfo().getServices());
        //此对象应该从登录之后的那个user获取
        var currentUser = {
            username: Can.util.userInfo().getUserName(),
            userid: Can.util.userInfo().getUserId(),
            firstlogin: Can.util.userInfo().isFirst(),
            specialType: Can.util.userInfo().getPackage() !== -1,
            contentStatus: Can.util.userInfo().getContentStatus()
        };


        var _items = [];
        // 检查个人菜单权限
        Can.util.menuCreate.check(17) && _items.push({id: 1, txt: Can.msg.ACCOUNT_MENU.PROFILE});
        Can.util.menuCreate.check(18) && _items.push({id: 2, txt: Can.msg.ACCOUNT_MENU.CHANGE_PWD});
        Can.util.menuCreate.check(10) && _items.push({id: 3, txt: Can.msg.ACCOUNT_MENU.SET_BUSS});
        var userAccountView = new Can.view.UserAccountView({
            id: 'sellerAccountId',
            actionJs: ['js/seller/action/useraccountAction.js'],
            items: _items.concat(
                [
                    {id: 0, txt: Can.msg.ACCOUNT_MENU.LOGOUT}
                ]
            ),
            currentUser: currentUser
        });
        userAccountView.start();
        toolbarView1.setCurrentUserView(userAccountView);
        addView(TOOLBAR_TOP1, toolbarView1);
        startedModules.put('userAccountView', userAccountView);

        Can.util.EventDispatch.addEvent(initEvents());
        //OK, we are going to trigger the application now
        startupApp();
        var startTime2 = new Date();
        //console.log('==== Canton Fair has started, it costs:' + (startTime2.getTime() - startTime1.getTime()) + 'ms  =====');

        function addView(key, view) {
            CanViews.put(key, view);
        }

        function startupApp() {
            document.title = Can.msg.APP_TITLE['SUPPLIER'];
            CanViews.each(function (index, key, value) {
                if (typeof value == 'object') {
                    value.start();
                }
                return true;
            });
            if (currentUser.firstlogin) {
                // 用户首次登录，
                // 此处需要后期优化，由于时间比较赶，暂时使用隐藏功能按钮的方式实现首次登录无法使用任何按钮的功能，
                // 后期需要使用其他更安全的方式去实现，即需要优化topMenuView初始化功能按钮的方式和顺序
                toolbarView1.hideAllFunctions();
                Can.importJS(['js/seller/view/businessRuleSettingModule.js']);
                var businessRuleSettingModule = new Can.module.BusinessRuleSettingModule();
                businessRuleSettingModule.start();
                businessRuleSettingModule.show();
                currentModule = businessRuleSettingModule;
                startedModules.put(businessRuleSettingModule.getId(), businessRuleSettingModule);
            }
            else {
                var goHome;

                var sRouteId = Can.Route.analyze().id || '/';
                if (sRouteId === '/' || sRouteId === '/special') {
                    //非正常套餐用户，即不显示正常VIP套餐的首页
                    if (currentUser.specialType) {
                        switch (Can.util.userInfo().getPackage()) {
                            case 5:
                            case 6:
                            case 7:
                                Can.importJS(['js/seller/view/sellerIndexModule.js']);
                                var eSpIndexModule = new Can.module.SellerIndexModule({closeBuyer: true});
                                eSpIndexModule.start();

                                eSpIndexModule.hide(true);
                                putModule(eSpIndexModule);
                                goHome = function () {
                                    //进入E广通，优企首页
                                    eSpIndexModule.show();
                                    currentModule = eSpIndexModule;
                                };
                                break;
                            case 8:
                            case 9:
//                                console.log('sss' + Can.util.userInfo().getPackage())
                                Can.importJS(['js/seller/view/sellerIndexModule.js']);
                                var sellerIndexModule = new Can.module.SellerIndexModule();
                                sellerIndexModule.start();

                                sellerIndexModule.hide(true);
                                putModule(sellerIndexModule);
                                goHome = function () {
                                    //进入默认首页
                                    sellerIndexModule.show();
                                    currentModule = sellerIndexModule;
                                };
                                break;
                            default :
                                Can.importJS(['js/seller/view/expIndexModule.js','js/seller/view/setShowroomModule.js']);
                                //默认进入特殊套餐首页
                                var specialIndexModule = new Can.module.ExpIndexModule();
                                //if (packageId=17 && contentSTATUS=0) go to SetShowroomModule 我的展台设置
                                var contentStatus = Can.util.userInfo().getContentStatus(), packageId = Can.util.userInfo().getServices()[0];
                                if ( packageId === 17 && contentStatus === 0) {
                                    specialIndexModule = new Can.module.SetShowroomModule();
                                }
                                specialIndexModule.start();
                                putModule(specialIndexModule);
                                goHome = function () {
                                    //进入特殊首页
                                    specialIndexModule.show();
                                    currentModule = specialIndexModule;
                                }
                        }
                    }
                    else {
                        Can.importJS(['js/seller/view/sellerIndexModule.js']);
                        var sellerIndexModule = new Can.module.SellerIndexModule();
                        sellerIndexModule.start();

                        sellerIndexModule.hide(true);
                        putModule(sellerIndexModule);
                        goHome = function () {
                            //进入默认首页
                            sellerIndexModule.show();
                            currentModule = sellerIndexModule;
                        };
                    }
                }
                toolbarView1.showAllFunctions();
                Can.util.refreshMemberCoin();

                //路由初始化
                Can.Route.init({
                    getModule: getModule,
                    putModule: putModule,
                    setCurrentModule: function (m) {
                        currentModule = m;
                    },
                    type: 'seller'
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
                'ON_PAGE_CLICK', //页面点击事件，widget内部监听此事件来决定是否对自己隐藏
                'ON_KEY_DOWN', //页面按键事件，widget内部监听此事件来决定是否作些默认操作
                'ON_ERROR_HANDLE'//错误处理，在所有的请求返回非success时触发此事件
            ].toString();
        }

        function putModule(module) {
            if (module instanceof Can.module.BaseModule ||
                module instanceof Can.view.BaseView) {
                startedModules.put(module.getId(), module);
            }
        }

        function getModule(moduleId) {
            return startedModules.get(moduleId);
        }

        return {
            getCanViews: function () {
                return CanViews;
            },
            getTopMenuView: function () {
                return CanViews.get(TOOLBAR_TOP1);
            },
            getStartedModules: function () {
                return startedModules;
            },
            getModule: getModule,
            putModule: putModule,
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
//						console.info('login', jMsgInfo['token'])
                        oMsgSocket.emit('loginServer', {
                            token: jMsgInfo['token']
                        });
                    });
                    oMsgSocket.on('reconnect', function (a) {
//						console.info('reconnect', a)
                    });
                    oMsgSocket.on('disconnect', function (a) {
//						console.info('logout', this, a);
                    });
                    // session 丢失
                    oMsgSocket.on('logout', function (jLogout) {
//						console.info('miss session', jLogout)
                        oMsgSocket.socket.disconnect();
                    });
                    // 消息中心消息推送
                    oMsgSocket.on('news', function (jServerMsg) {
                        Can.Application.getTopMenuView().fireEvent('ON_MSG_GET', jServerMsg);
                    });
                    // C币增减推送
                    oMsgSocket.on('cCoinModifyNews', function (jCoinMsg) {
                        Can.util.refreshMemberCoin();
                    });
                }
            }
        };
    }();
    Can.Application.PushIO();
});
