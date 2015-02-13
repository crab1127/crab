/**
 * 路由模板
 * @author vfasky
 * @date   2013-07-05
 * @param  {Can} oCan
 * @return {Void}
 */
(function (oCan) {
	oCan.importJS([
		'js/plugin/jquery/hashchange.min.js'
	]);

	var oApplication;

	/**
	 * 指未是否已经初始化
	 * @type {Boolean}
	 */
	var isInit = false;

	/**
	 * 路由规则
	 * @type {Object}
	 */
	var oMap = oCan.util.Config.routeMap;

	/**
	 * 指示路由状态
	 * 0 ：指示触发相应的路由
	 * 1 ：指示标记url, 并不触发
	 * @type {Number}
	 */
	var nStatus = 0;

    var xRout = false;

	var $win = $(window);
	/**
	 * Application 的路由扩展
	 * 目前，所有模板只能通过配置 Can.util.Config.routeMap 生成路由。
	 * @example <caption>配置规则：</caption>
	 * {
     *     'route': ['/msg-center'], //url上显示的地址
     *     'moudleId' : ''msgCenterModuleId', //对应 'js/utils/msgCenterModule.js' 中的 id
     *     'module' : 'msgCenterModule', // 对应 Can.module.msgCenterModule, 省略 Can.module
     *     'uri' : 'js/utils/msgCenterModule.js', // 所在路径
     *     'topMenuId' : 'msgBtnId' //所在顶部菜单 dom id,**非必须**
     * }
	 * @module Can.Route
	 * @author vfasky
	 * @date   2013-07-05
	 * @param  {Can} oCan
	 * @return {Void}
	 */
	var Route = (function () {

		var exports = {};

		/**
		 * 根据id, 取对应的规则
		 * @author vfasky
		 * @date   2013-07-05
		 * @param  {String} sId  路由url 或 module id
		 * @return {Mixed} 存在返回规则，否则返回 False
		 * @example
		 * // return {
         * //     'topMenuId' : 'msgBtnId',
         * //     'route' : ['/msg-center'],
         * //     'module' : 'msgCenterModule',
         * //     'moduleId' : 'msgCenterModuleId',
         * //     'uri' : 'js/utils/msgCenterModule.js',
         * //     'acts' : []
         * // };
		 * Can.Route.get('msgCenterModuleId');
		 */
		exports.get = function (sId) {
			sId = sId.toString();


			var nLen = oMap.length;
			for (var i = 0; i < nLen; i++) {
				var rule = oMap[i];
				rule.acts = rule.acts || ['runByRoute'];
				rule.moduleId = rule.moduleId || sId;

				if (rule.moduleId == sId) {
					//区别采购、供应商规则
					if (rule.uri.indexOf('js/utils') === 0 ||
						rule.uri.indexOf('js/' + exports.app.type) === 0
						) {
						return rule;
					}
				}

				for (var i1 = 0, l = rule.route.length; i1 < l; i1++) {
					var v = rule.route[i1];
					if (v == sId) {
						//区别采购、供应商规则
						if (rule.uri.indexOf('js/utils') === 0 ||
							rule.uri.indexOf('js/' + exports.app.type) === 0
							) {
							return rule;
						}
					}
				}

			}
			return false;
		};

		/**
		 * 根据 路由及参数，生成url
		 * @author vfasky
		 * @date   2013-07-05
		 * @param  {String} sId 路由url 或 module id
		 * @param  {Object} oArgs 要传递的参数，默认为空
		 * @return {String} 生成的url
		 * @example
		 * // return http://192.168.10.11:8080/C/buyer/#!msgCenterModuleId?id=1
		 * Can.Route.urlFor('msgCenterModuleId', {id: 1});
		 */
		exports.urlFor = function (sId, oArgs) {
			oArgs = oArgs || {};
			var rule = exports.get(sId);

			if (false === rule) {
				return '';
			}

            if(-1 === $.inArray(sId, rule.route)){
                sId = rule.route[0];
            }

			var sHost = window.location.href.split('#')[0];
			var sUrl = sHost + '#!' + $.trim(sId);
			var aArgs = [];

			for (var v in oArgs) {
				aArgs.push(v + '=' + encodeURIComponent(oArgs[v]));
			}
            //标记来路
            var sThisRule = sId;
			if (0 < aArgs.length) {
				sUrl += '?' + aArgs.join('&');
                sThisRule = sId + '?' + aArgs.join('&');
			}
            if(xRout && xRout != sThisRule){
                Route._referer = xRout;
            }
            xRout = sThisRule;
            //console.log('referer: ' + Can.Route._referer);

			return sUrl;
		};

		/**
		 * 标志 module , 只用于在浏览器生成url
		 * @author vfasky
		 * @date   2013-07-05
		 * @param  {String} sId module id
		 * @param  {Mixed} oArgs
		 * @return {Void}
		 */
		exports.mark = function (sId, oArgs) {
			var url = exports.urlFor(sId, oArgs);
			if (url !== '') {
                exports.setUrl(url);
			}
            return url;
		};

		/**
		 * 设置浏览器的url,但并不触发路由
		 * @author vfasky
		 * @date   2013-07-05
		 * @param  {String} sUrl 要设置的url
		 * @return {Void}
		 */
		exports.setUrl = function (sUrl) {
			nStatus = 1;
            
			window.location.href = sUrl;
		};

		/**
		 * 解释对应的url
		 * @author vfasky
		 * @date   2013-07-05
		 * @param  {String} sUrl 要解释的url,默认为 window.location.href
		 * @return {Mixed} 解释成功返回数据，否则返回 false
		 * @example
		 * // return {
         * //   id: 'msgCenterModuleId',
         * //   args: {id : 1}
         * // }
		 * Can.Route.analyze('http://192.168.10.11:8080/C/buyer/#!msgCenterModuleId?id=1');
		 */
		exports.analyze = function (sUrl) {
			sUrl = sUrl || window.location.href;
			sUrl = $.trim(sUrl);

			if (sUrl.indexOf('#!') >= 0) {
				sUrl = sUrl.split('#!').pop();

				var aUrlData = sUrl.split('?');
				var sId = aUrlData[0];
				var oArgs = {};

				if (1 < aUrlData.length) {
					var sArgs = aUrlData.pop();
					var aArgs = sArgs.split('&');
					$.each(aArgs, function (k, v) {
						var aV = v.split('=');
						if (2 == aV.length) {
							oArgs[$.trim(aV[0])] = decodeURIComponent(aV[1]);
						}
					});
				}
				return{
					id: sId,
					args: oArgs
				};
			}
			return false;
		};
        
        /**
         * 返回当前的url
         */
        exports.currentUrl = function(){
            if(undefined === Can.Application){
                return false;
            }
            var xModel = Can.Application.getCurrentModule();
            if(xModel){
                if(xModel._aRouteMark){
                    return exports.urlFor(xModel._aRouteMark[0], xModel._aRouteMark[1]);
                }
                //没有经过路由触发
                else{
                    var xData = exports.analyze();
                    //尝试生成
                    if(xData){
                        return exports.urlFor(xData.id, xData.args);
                    }
                }

                //console.log(xModel);
            }
            
            return false;
        };

		/**
		 * 触发对应的路由
		 * @author vfasky
		 * @date   2013-07-05
		 * @param  {String} sId module id
		 * @param  {Object} oArgs 路由参数
		 * @param  {Object|Null} xData 不想在url显示的数据，会放入缓存中传递
		 * @return {Boolean} 触发是否成功
		 * @example
		 * //调用信息中心模块，并传递参数 id = 1
		 * Can.Route.run('msgCenterModuleId', {id: 1});
		 * //注：这时 Can.module.msgCenterModule
		 * //可访问 this._oRoutArgs 取得路由传递过来的参数
		 */
		exports.run = function (sId, oArgs, xData) {
            var oUrlData;
            if(-1 !== sId.indexOf('?')){
                oUrlData = exports.analyze('#!' + sId);
                if(oUrlData){
                    sId = oUrlData.id;
                    oArgs = oUrlData.args;
                }
            }
            else if (0 === sId.indexOf('http')){
                oUrlData = exports.analyze(sId);
                if(oUrlData){
                    sId = oUrlData.id;
                    oArgs = oUrlData.args;
                }
            }
			var rule = exports.get(sId);
			if (false === rule) {
				return false;
			}

            oArgs = oArgs || {};

			oCan.importJS([rule.uri]);
			if (rule.topMenuId) {
				$(function () {
					$('#' + rule.topMenuId).click();
					return true;
				});
                return;
			}

			var oModule = oApplication.getModule(rule.moduleId);
			if (!oModule) {
				if (oCan.module[rule.module]) {
					// 注入相对的路由参数
					oModule = new Can.module[rule.module]({
						_oRoutArgs: oArgs || {},
						_oRoutRule: rule,
                        _sRoutCall: sId
					});
					oModule.start();
					oApplication.putModule(oModule);
				}
				else {
					return false;
				}
			}
			else {
				oApplication.putModule(oModule);
			}

            var sRefererUrl = Can.Route.currentUrl();
            
            if(sRefererUrl){
                xData = xData || {};
                xData._referer = sRefererUrl;
            }
            
            // 注入相对的路由参数
			oModule._oRoutArgs = $.extend(true, {}, oArgs);
			oModule._oRoutRule = rule;
            oModule._sRoutCall = sId;
            // 传递 sId, oData, 用于自动标记时使用
			oModule.show(sId, oArgs, xData);
			oApplication.setCurrentModule(oModule);
			// 调用对应的动作
			$.each(rule.acts, function (k, v) {
				if (oModule[v]) {
					oModule[v]();
				}
			});

			return true;
		};

		/**
		 * 根据路由规则取 model
		 * 注： model 可以是未加载过的
		 * @author vfasky
		 * @date   2013-07-09
		 * @param  {String} sId model id
		 * @return {Mixed} 成功返回 module , 否则 false
		 */
		exports.getModule = function (sId) {
			var oInfo = exports.get(sId);
			if (oInfo) {
				oCan.importJS([oInfo.uri]);
				var oModule = oCan.module[oInfo.module];
				if (oModule) {
					if (exports.app) {
						exports.app.putModule(oModule);
					}
					return oModule;
				}
			}
			return false;
		};


		/**
		 * 路由初始化
		 * @author vfasky
		 * @date   2013-07-05
		 * @param {Object} oApp Application 对象
		 * @param  {Object} oDefModule 默认触发的module
		 * @return {Void}
		 */
		exports.init = function (oApp, oDefModule) {
			if (isInit) {
				return;
			}
			isInit = true;
			oApplication = oApp;

			exports.app = oApp;

			/**
			 * 匹配路由
			 * @author vfasky
			 * @date   2013-07-08
			 * @return {Void}
			 */
			var fMatch = function () {
				if (nStatus === 0) {
					oUrlInfo = exports.analyze();
					if (oUrlInfo) {
						if (false === exports.run(oUrlInfo.id, oUrlInfo.args)) {
							oDefModule();
						}
					}
					else {
						oDefModule();
					}
				}
				nStatus = 0;
			};

			fMatch();

			$win.hashchange(function () {
				fMatch();
			});
		};

		return exports;
	})();

    Route._args = {};
    Route._referer = false;

	oCan.Route = Route;
  })(Can);
