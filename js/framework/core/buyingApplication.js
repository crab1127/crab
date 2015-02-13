/**

 * 定义Can.util.EventDispatch事件，
 * 类似于MVC里面URL映射文件，我们通过EventDispatch将事件分发到对应
 * 注册的handler里面进行处理，同时绑定一些数据给到handler。
 * <strong>这个事件是全局的，用于View与View之间进行通信</strong>
 */
/**
 * 采购商管理主程序
 */
Can.importJS([
    'js/buyer/view/topMenuView.js',
    'js/utils/buyingLeadDetailModule.js',
    'js/utils/windowView.js'
]);
$(function () {
//    Can.util.userInfo(Can.util.Config.accountInfo);
//    isRightUserType();
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
        var toolbarView1 = new Can.view.TopMenuView({id:'buyerTopMenuViewId'});


        Can.util.EventDispatch.addEvent(initEvents());
        //OK, we are going to trigger the application now
        startupApp();


        var startTime2 = new Date();
        console.log('==== Canton Fair has started, it costs:' + (startTime2.getTime() - startTime1.getTime()) + 'ms  =====');

        function addView(key, view) {
            CanViews.put(key, view);
        }

        function startupApp() {
            var pageUrl = window.location.href, sAllParam, aParam, oParam = {}, blId;
            sAllParam = (pageUrl.split("?"))[1];
            aParam = sAllParam.split("&")
            $.each(aParam, function (i, item) {
                var aTemp = item.split("=")
                oParam[aTemp[0]] = aTemp[1]
            })

            document.title = Can.msg.APP_TITLE['BUYER'];
            CanViews.each(function (index, key, value) {
                if (typeof value == 'object') {
                    value.start();
                }
                return true;
            });


            //默认进入首页
            var buyingLeadModule = new Can.module.BuyingLeadDetailModule();
            if (oParam['user'] && oParam['user'] === "supplier") {
                buyingLeadModule.userType = "supplier";
            }else{
                buyingLeadModule.userType = "buyer";
            }

            buyingLeadModule.isLogin = false;
            buyingLeadModule.start();
//                buyingLeadModule.hide(true);
//				toolbarView1.showAllFunctions();
            startedModules.put(buyingLeadModule.getId(), buyingLeadModule);
            buyingLeadModule.loadData({buyerleadId:oParam['leadId']});
            buyingLeadModule.show();

            currentModule = buyingLeadModule;
            var goHome = function () {
                //默认进入首页
                buyingLeadModule.show();
                currentModule = buyingLeadModule;
            };
            //路由初始化

            /*Can.Route.init({
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
             }, goHome);*/


        }

        function initEvents() {
            return [
                'ON_MODULE_SWITCH', //当前模块显示事件
                'ON_ERROR_HANDLE'//错误处理，在所有的请求返回非success时触发此事件
            ].toString();
        }

        return {
         //			rootUrl: 'js/buyer/',
         getCanViews:function () {
         return CanViews;
         },
         getTopMenuView:function () {
         return CanViews.get(TOOLBAR_TOP1);
         },
         getStartedModules:function () {
         return startedModules;
         },
         getModule:function (moduleId) {
         return startedModules.get(moduleId);
         },
         putModule:function (module) {
         if (module instanceof Can.module.BaseModule ||
         module instanceof Can.view.BaseView) {
         startedModules.put(module.getId(), module);
         }
         },

        /**
         * 放回当前显示的模块
         */

         getCurrentModule:function () {
         return currentModule;
         },
         setCurrentModule:function (m) {
         currentModule = m;
         }
         }

    }();
});
