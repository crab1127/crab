/**
 * Can前端公共JS类定义
 * @author Island
 * @since 2013-01-08
 */


/**
 * 扩展JS类型数据结构Map
 * 1、该Map必须键值唯一，不然会后面加入的会覆盖前面的元素值
 * 2、key的类型，可以是任意类型，不受限制
 * @author Island
 * @since 2013-01-08
 * @version 1.1
 */

'use strict';

Can.util.ArrayMap = function () {
	var array = [];
	/**
	 * 往map里面放入对象
	 * @param _key
	 *          键值唯一，key值不能重复
	 * @param _value
	 *          要放入的对象
	 */
	this.put = function (_key, _value) {
		var obj = {key: _key, value: _value};
		var has = false;
		for (var i = 0; i < array.length; i++) {
			if (array[i].key == _key) {
				array[i].value = _value;
				has = true;
				break;
			}
		}
		if (!has) {
			array.push(obj);
		}
	};
	this.get = function (_key) {
		var ob = null;
		for (var i = 0; i < array.length; i++) {
			if (array[i].key == _key) {
				ob = array[i].value;
				break;
			}
		}
		return ob;
	};
	/**
	 * 删除以某个key为键的obj
	 */
	this.remove = function (_key) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].key == _key) {
				array.splice(i, 1);
			}
		}
	};
	/**
	 * 删除所有的元素
	 */
	this.removeAll = function () {
		while (array.length != 0)
			array.pop();
	};
	/**
	 * 返回所有item
	 */
	this.getAll = function () {
		var items = [];
		for (var i = 0; i < array.length; i++) {
			items.push(array[i].value);
		}
		return items;
	};
	/**
	 * 返回Map的大小
	 */
	this.size = function () {
		return array.length;
	};
	/**
	 * 判断Map里面是否含有某个映射的key值
	 * @return true 该MAP含有此key，
	 *         false 不含有
	 */
	this.containsKey = function (_key) {
		var contain = false;
		for (var i = 0; i < array.length; i++) {
			if (array[i].key == _key) {
				contain = true;
				break;
			}
		}
		return contain;
	};
	/**
	 * 判断Map里面是否含有某个值
	 */
	this.containsValue = function (_value) {
		var contain = false;
		for (var i = 0; i < array.length; i++) {
			if (array[i].value == _value) {
				contain = true;
				break;
			}
		}
		return contain;
	};
	/**
	 * 返回所有key的数组
	 */
	this.keySet = function () {
//		var keys = [];
//		for (var i = 0; i < array.length; i++) {
//			keys.push(array[i].key)
//		}
		var keys = "";
		for (var i = 0; i < array.length; i++) {
//            keys.push(array[i].key)
			if (i == 0) {
				keys += array[i].key.toString();
			} else {
				keys += "|" + array[i].key.toString();
			}
		}
		return keys;
	};
	/**
	 * 测试该Map是否为空Map
	 */
	this.isEmpty = function () {
		return !this.size();
	};

	/**
	 * 迭代map里面的每个元素
	 * @param fn
	 */
	this.each = function (fn) {
		if (typeof fn == 'function') {
			for (var i = 0; i < array.length; i++) {
				if (fn.call(this, i, array[i].key, array[i].value)) {
					continue;
				} else {
					break;
				}
			}
		}
	}

};

/**
 * 全局事件分发器;
 */
Can.util.EventDispatch = function () {
	var eventManager = new Can.event.Observable();
	return {
		dispatchEvent: function (eventName) {
			eventManager.fireEvent.apply(eventManager, arguments);
		},
		on: function (eventName, fn, scope) {
			eventManager.on(eventName, fn, scope);
		},
		addEvent: function (event) {
			eventManager.addEvents(event);
		}
	}
}();
Can.util.EventDispatch.addEvent('ON_MODULE_VIEW_INIT');//模块初始化结束事件


/**
 * 扩展JQuery
 */
(function ($) {
	/**
	 * 使用jquery直接监听module
	 * @param moduleId
	 * @param fn
	 */
	$.moduleAndViewAction = function (moduleId, fn) {
		Can.util.EventDispatch.on('ON_MODULE_VIEW_INIT', function (module) {
			if (module.getId() != moduleId)return;
			fn.call(this, module);
		});
	};

	/**
	 * jQuery Cookie Plugin v1.3.1
	 */
	(function ($) {

		var pluses = /\+/g;

		function raw(s) {
			return s;
		}

		function decoded(s) {
			return decodeURIComponent(s.replace(pluses, ' '));
		}

		function converted(s) {
			if (s.indexOf('"') === 0) {
				// This is a quoted cookie as according to RFC2068, unescape
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			}
			try {
				return config.json ? JSON.parse(s) : s;
			} catch (er) {
			}
		}

		var config = $.cookie = function (key, value, options) {

			// write
			if (value !== undefined) {
				options = $.extend({}, config.defaults, options);

				if (typeof options.expires === 'number') {
					var days = options.expires, t = options.expires = new Date();
					t.setDate(t.getDate() + days);
				}

				value = config.json ? JSON.stringify(value) : String(value);

				return (document.cookie = [
					config.raw ? key : encodeURIComponent(key),
					'=',
					config.raw ? value : encodeURIComponent(value),
					options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					options.path ? '; path=' + options.path : '',
					options.domain ? '; domain=' + options.domain : '',
					options.secure ? '; secure' : ''
				].join(''));
			}

			// read
			var decode = config.raw ? raw : decoded;
			var cookies = document.cookie.split('; ');
			var result = key ? undefined : {};
			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				var name = decode(parts.shift());
				var cookie = decode(parts.join('='));

				if (key && key === name) {
					result = converted(cookie);
					break;
				}

				if (!key) {
					result[name] = converted(cookie);
				}
			}

			return result;
		};

		config.defaults = {};

		$.removeCookie = function (key, options) {
			if ($.cookie(key) !== undefined) {
				// Must not alter options, thus extending a fresh object...
				$.cookie(key, '', $.extend({}, options, { expires: -1 }));
				return true;
			}
			return false;
		};

	})($);
})(jQuery);

/**
 * 动态加载JS文件 支持类
 * @type {JsManager}
 */
(function () {
	/**
	 * 保存全局的JS文件，以文件为key 和 value
	 * @type {Can.util.ArrayMap}
	 */
	var jsmap = new Can.util.ArrayMap(),
		manager = {
			/**
			 * 判断某个JS文件是否已经加载
			 * @param jsfile
			 */
			isJsLoaded: function (jsfile) {
				return !!jsmap.get(jsfile);
			},
			/**
			 * 导入JS文件，支持多个文件导入，JS文件务必以js为根目录比如：
			 * Can.importjs('js/xx1.js', 'js/xx2.js', 'js/x3.js')
			 */
			imports: function (jsArray) {
				if (jsArray == undefined || jsArray.length == 0) {
					return;
				}
				if (jsArray.length > 1) {
					for (var i = 0; i < jsArray.length; i++) {
						this.injectJS(jsArray[i]);
					}
				}
				else {
					this.injectJS(jsArray[0]);
				}
			},
			/**
			 * 并行加载，并按顺序执行脚本
			 * 主要用于国际站等新项目
			 */
			asyncImport: function (xList, callback, error) {
				var aList = [];
				var self = manager;
				var aLoads = [];
				var oMap = {};
				var nLoad = 0;
				var sRoot = Can.util.Config.app.CanURL;

				error = error || function () {
				};
				callback = callback || function () {
				};
				if ($.isArray(xList)) {
					aList = xList;
				}
				else {
					aList.push(xList);
				}

				if ($.browser.msie) {
					Can.importJS(aList);
					callback();
					return;
				}

				$.each(aList, function (k, sJsFile) {
					if (false === self.isJsLoaded(sJsFile)) {
						aLoads.push(sJsFile);
					}
				});

				if (aLoads.length === 0) {
					return callback();
				}

				//按顺序执行
				var feval = function () {
					var nRun = 0;
					$.each(aLoads, function (k, sUrl) {
						var sCode = oMap[sUrl];
						if (sCode) {
							var el = self.evalGlobal(sCode);

							$(el).ready(function () {
								el.parentNode.removeChild(el);
							});
						}
						nRun++;
						if (nRun === aLoads.length) {
							callback();
						}
					});
				};

				$.each(aLoads, function (k, sUrl) {
					$.ajax({
						url: sRoot + sUrl,
						dataType: 'text',
						error: error,
						success: function (data) {
							oMap[sUrl] = data;
							nLoad++;
							if (nLoad === aLoads.length) {
								feval();
							}
						},
						cache: false,
						async: true
					});

				});


			},
			evalGlobal: function (js) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				try {
					script.innerHTML = js;
				} catch (e) {
					script.text = js;
				}
				if (document.head) {
					document.head.appendChild(script);
				}
				else {
					document.getElementsByTagName('head')[0].appendChild(script);
				}
				return script;

			},
			/**
			 * 加载JS文件，系统不支持异步加载，所以加载均是同步的
			 * @param jsfile
			 * @return {HTMLElement}
			 */
			injectJS: function (jsfile) {
				var self = this;
				if (!this.isJsLoaded(jsfile)) {
					jsmap.put(jsfile, jsfile);
					var onErrorFn = function (e, xhr, exception) {
						//如果文件不存在，有可能是版本升级了
						// 尝试刷新页面
						if (Number(e.status) === 404) {
							//暂时判断时间，不判断url
							//var sURL = this.url;
							//var sVal = Can.util.Base64.encode(sURL, '');
							var sKey = 'hasURL';
							//取cookie值
							//var sCookieVal  = $.cookie(sKey);
							var sCookieTime = $.cookie(sKey + '_time');

							var nTime = (new Date).getTime();
							//1天内不重复刷新；
							//var nSetp = 3600 * 1000;

							//转用会话方式记录，关闭浏览器失效	
							if (!sCookieTime
							//|| !sCookieVal
							//|| nTime - Number(sCookieTime) > nSetp
							//|| sCookieVal != sVal
								) {
								//$.cookie(sKey, sVal, 1);
								//$.cookie(sKey + '_time', nTime, 1);
								//转用会话方式记录，关闭浏览器失效
								$.cookie(sKey + '_time', nTime);
								//直接刷新页面
								window.location.reload();
								return false;
							}
							else {
								//alert('not')
								return false;
							}
						}

						var _newURL = location.href;
						if (_oldURL != _newURL) {
							// 除了报错，我想不出有什么方法能令JS不再执行下去
							// 因为这些请求发送出去后，如果页面跳转了，他们会
							// 一直的报错并alert出来，很差的用户体验。目前无
							// 解，等待更好的方法出现，另外这该死的情况只在
							// FF下出现，爆粗吧，不管是对我还是对FF。by Angus
							this.stopTheFuckAjaxError('do not ask me why.');
						}
						if (console && console.log) {
							console.log('========= Error =========');
							console.log('url:' + this.url);
							//重新解释js,以定位
							manager.evalGlobal(e.responseText.toString());
						}
						return false;

						//alert('无法加载JS文件：' + Can.util.Config.app.CanURL + jsfile);
					};
					var _oldURL = location.href;
					var onSuccessFn = function (data, textStatus, xhr) {
						self.evalGlobal(data);
					};

					var sRoot = Can.util.Config.app.CanURL,
						sTaggedMapping;

					var jStaticFileMapping = window.jStaticFileMapping || 'jStaticFileMapping';

					if (typeof jStaticFileMapping !== 'string') {
						sTaggedMapping = jStaticFileMapping[ '/' + jsfile ];
						if (sTaggedMapping) {
							jsfile = sTaggedMapping.substr(1);
						}
					}

					$.ajax({
						url: sRoot + jsfile,
						dataType: 'SCRIPT',
						//dataType: 'text',
						error: onErrorFn,
						//success: onSuccessFn,
						cache: true,
						async: false
					});

				}
			}
		};
	Can.importJS = function (jsArray) {
		return  manager.imports.call(manager, jsArray);
	};
	Can.asyncImport = manager.asyncImport;
	Can.initBaseWigets = function (callabck) {
		var aList = [
			'js/framework/core/ui.js',
			'js/framework/core/baseView.js',
			'js/framework/widget/actForm.js',
			'js/framework/widget/baseField.js',
			'js/framework/widget/button.js',
			'js/framework/widget/calendar.js',
			'js/framework/widget/comboList.js',
			'js/framework/widget/dropdownField.js',
			'js/framework/widget/favorite.js',
			'js/framework/widget/limitButton.js',
			'js/framework/widget/panel.js',
			'js/framework/widget/panelTree.js',
			'js/framework/widget/percentBar.js',
			'js/framework/widget/smallContacter.js',
			'js/framework/widget/smallPro.js',
			'js/framework/widget/tableList.js',
			'js/framework/widget/tabPage.js',
			'js/framework/widget/textAreaField.js',
			'js/framework/widget/textField.js',
			'js/framework/widget/tick.js',
			'js/framework/widget/tips.js',
			'js/framework/widget/toolbar.js',
			'js/framework/widget/uploader.js',
			'js/framework/widget/window.js',
			'js/plugin/uploadify/jquery.uploadify.min.js'
		];
		if ($.browser.msie) {
			Can.importJS(aList);
			return callabck();
		}
		else {
			Can.asyncImport(aList, callabck);
		}
	};
})();

/*
 (function () {
 // add google analytics if we are in production
 if (Can.ENV.now === 'prod') {
 var script = document.createElement("script");
 script.src = '/js/count.js';
 document.getElementsByTagName("head")[0].appendChild(script);
 }
 })();
 */
/**
 * 根据CompanyId获取公司域名地址
 * 	
 * @return {String} 如果公司没有可用的域名则返回""
 */
Can.util.domainUrl = function(companyId){
	var result = "";
	if(companyId ===null || $.trim(companyId)===""){
		return "";
	}
	$.ajax({
		url: "/cfone/suppliershowroomsetting/findAvailableDomain.cf"+"?companyId="+companyId,
		async: false,
		cache: false,
		datatype:'json',
		success: function (jData) {
			if(jData.status && jData.status==="success"){
				if(jData.data){
					result += jData.data["domainName"] || "";
					if(result != ""){
						result ="http://"+result+".en.e-cantonfair.com";
					}
				}
			}
		}	
	});	
	return result;
}
/**
 * 根据指定的供应商域名拼接三级域名
 * @return {String} 如果没有可用的域名则返回""
 */
Can.util.thirdDomainURLFor = function(suppDomain){
	var result = "";
	if(suppDomain && suppDomain != ""){
		result="http://"+suppDomain+".en.e-cantonfair.com";
	}
	return result;
}


/**
 * Get Current UserInfo
 * @Author: AngusYoung
 * @Since: 13-10-4
 */
Can.util.userInfo = function (sURL) {
	var user = this;

	function fGetData(sKey, bCoerce) {
        //currentPackage
		// if not user data or coerce refresh data and has url
		if ((!user.userData || bCoerce) && sURL) {
			$.ajax({
				url: sURL,
				async: false,
				cache: false,
				success: function (jData) {
					if (jData.status && jData.status === 'success') {
						user.userData = jData.data;
						window.localStorage && window.localStorage.setItem('localLogin', 1);
					}
					else if (jData.status === 'unlogin') {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, {status: 'abnormal', message: Can.msg.ERROR_TEXT.ERR_ABNORMAL});
					}
				},
				error: function () {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, {status: 'abnormal', message: Can.msg.ERROR_TEXT.ERR_ABNORMAL});
				}
			});
		}
		// if has user data
		if (user.userData) {
			// if has key then return key of user data, else return null
			return sKey ? user.userData[sKey] || '' : null;
		}
		// not data return null
		else {
			return null;
		}
	}

	// public function for userInfo()
	var oPublicFn = {
		isLogin: function () {
			return !!(window.localStorage && window.localStorage.getItem('localLogin'));
		},
		isFirst: function () {
			return !fGetData('hasBizRule');
		},
		getUserId: function () {
			return fGetData('userId');
		},
		getAccount: function () {
			return fGetData('userAccount');
		},
		getUserName: function () {
			if (Can.util.Config.lang === 'en') {
				return (fGetData('firstName') || '').replace(/^\w/, function (s) {
					return s.toUpperCase();
				}) + ' ' + (fGetData('lastName') || '').replace(/^\w/, function (s) {
					return s.toUpperCase();
				});
			}
			else {
				return fGetData('lastName') + fGetData('firstName');
			}
		},
        //返回用戶公司資料是否審核通過
        getContentStatus: function () {
            return fGetData('includePackages')[0].contentStatus;
        },
		getIMAccount: function () {
			return fGetData('imAccount');
		},
		getIMToken: function () {
			return fGetData('imPassword')
		},
		getUserType: function () {
			return fGetData('userType');
		},
		getAccountType: function () {
			return fGetData('accountType');
		},
		getCompanyId: function () {
			return fGetData('companyId');
		},
		getCompanyName: function () {
			return fGetData('companyName');
		},
		getEmail: function () {
			return fGetData('email');
		},
		getCantonFairId: function () {
			return fGetData('cantonfairId');
		},
		getLastLogin: function () {
			return Can.util.formatDateTime(fGetData('lastLoginTime'), 'YYYY-MM-DD hh:mm');
		},
		getPackage: function () {
			return fGetData('currentPackage');
		},
		getServices: function (bAll) {
			var _package = fGetData('includePackages');
			if (bAll) {
				return _package;
			}
			var _services = [];
			for (var v in _package) {
                /*预售e广通 两种情况 处理*/
                if(this.isEgdVip(v)){
                    _services.push(171);
                }else{
                    _package[v] && _package[v]['id'] && _services.push(_package[v]['id']);
                }
			}
			return _services;
		},
		getAvatar: function () {
			return fGetData('userPhoto');
		},
		getTimeDiff: function () {
			return new Date() - Can.util.formatDateTime(fGetData('serverTime') || new Date());
		},
        /*
        EgdPackage : e广通 套餐
        EgdVip: e广通用户并已经上线
        */
        isEgdPackage:function(){
            var _package = fGetData('includePackages');
            if(_package[0]['id']==17){
                return true;
            }else{
                return false;
            }
        },
        isEgdVip:function(){
            var _package = fGetData('includePackages');
            if(_package[0]['id']==17 && _package[0]['auditStatus'] && (_package[0]['auditStatus']==1)){
                return true;
            }else{
                return false;
            }
        },
        getSkype : function() {
        	return fGetData('skype')
        }
	};
	// if has url then coerce refresh user data
	if (sURL) {
		fGetData(null, true);
	}
	// return public function
	return oPublicFn;
};

/**
 * 时间格式化
 * @Author: AngusYoung
 * @Version: 1.1
 * @Update: 13-8-5
 * @param {Number|Date|String} xDate 可以为日期对象，时间戳数字，或者是日期格式的文本e.g: 2013-2-12
 * @param {String} [sFormat] 字符串，有特定的格式（Y,M,D,h,m,s）
 * @param {Boolean} [bEnMonth] 是否显示英文的月份
 * @param {Boolean} [bShort] 是否显示短英文，只有bEnMouth为true时，此参数才生效
 * @return {String|Date} 根据sFormat转换出来的日期格式/或者直接输出日期时间对象
 */

Can.util.formatDateTime = function (xDate, sFormat, bEnMonth, bShort) {
	var privateFn = {
		/*defuse timezone different*/
		fDefuseTimezone: function (dTime) {
			// -Angus 服务器时区只能先写死在这里了，理想的处理还是将服务器的时区也通过请求返回
			//server timezone
			var nServerTimezone = 0;
			//local timezone
			var nLocalTimezone = new Date().getTimezoneOffset() / 60 * -1;
			// 1 timezone = 1 hour
			var nTimezoneDiff = (nServerTimezone - nLocalTimezone) * 3600 * 1000;
			return new Date(dTime - nTimezoneDiff);
		},
		/*new date for string*/
		fCreateDate: function (sDate) {
			//filter format
			//e.g 2013-1-4 13:14:20
			sDate = sDate.replace(' ', '-').replace(/:/g, '-');
			var aDate = sDate.split('-');
			var dDate;

			function __fNewDate(a, b, c, d, e, f, g) {
				a = a || null, b = b - 1 || null, c = c || null, d = d || null, e = e || null, f = f || null, g = g || null;
				return new Date(a, b, c, d, e, f, g);
			}

			dDate = __fNewDate.apply(null, aDate);
			return dDate;
		},
		/*format time*/
		fFriendlyTime: function (dTime) {
			//get server current time
			var dNowDate = this.fDefuseTimezone(new Date(new Date() - parseInt(Can.util.userInfo().getTimeDiff(), 10)));
			var dDate = this.fDefuseTimezone(dTime);
			if (dDate instanceof Date) {
				//time different, sec
				var nSec = Math.abs((dNowDate - dDate) / 1000);
				//24 Hour ago
				if (nSec > 86400) {
					return [dDate.getFullYear(), dDate.getMonth() + 1, dDate.getDate()].join('-') + ' ' + [dDate.getHours(), dDate.getMinutes()].join(':');
				}
				// < 1 hour
				else if (nSec < 3600) {
					// < 1m show xx s ago
					if (nSec < 60) {
						return Math.round(nSec) + Can.msg['DATETIME']['BEFORE_SEC'];
					}
					// > 1m show xx m ago
					else {
						return Math.floor(nSec / 60) + Can.msg['DATETIME']['BEFORE_MIN'];
					}
				}
				//between 1 and 24 hour, show today + time
				else {
					return Can.msg['DATETIME']['TODAY'] + ' ' + [dDate.getHours(), dDate.getMinutes()].join(':');
				}
			}
			else {
				return '[ERROR TIME FORMAT]';
			}
		}
	};
	var dDate;
	if (typeof xDate === 'object' && xDate instanceof Date) {
		dDate = xDate;
	}
	else if (typeof xDate === 'number') {
		dDate = new Date(xDate);
	}
	else if (typeof xDate === 'string') {
		dDate = privateFn.fCreateDate(xDate);
	}
	else {
		return '';
	}
	if (!sFormat) {
		return dDate;
	}
	var sResult = sFormat;
	//get Year
	sResult = sResult.replace(/Y+/g, function (s) {
		var nLen = s.length;
		return dDate.getFullYear().toString().slice(-nLen);
	});
	//get Day
	sResult = sResult.replace(/D+/g, function (s) {
		var nLen = s.length;
		var _s = dDate.getDate().toString();
		return '00'.substr(0, nLen - _s.length) + _s;
	});
	//get Hour
	sResult = sResult.replace(/h+/g, function (s) {
		var nLen = s.length;
		var _s = dDate.getHours().toString();
		return '00'.substr(0, nLen - _s.length) + _s;
	});
	//get Minutes
	sResult = sResult.replace(/m+/g, function (s) {
		var nLen = s.length;
		var _s = dDate.getMinutes().toString();
		return '00'.substr(0, nLen - _s.length) + _s;
	});
	//get Second
	sResult = sResult.replace(/s+/g, function (s) {
		var nLen = s.length;
		var _s = dDate.getSeconds().toString();
		return '00'.substr(0, nLen - _s.length) + _s;
	});
	//because result of the month have english, so this way.
	//get Month
	sResult = sResult.replace(/M+/g, function (s) {
		var nLen = s.length;
		var dMonth = dDate.getMonth();
		if (bEnMonth) {
			var aEnMonth;
			if (bShort) {
				aEnMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			}
			else {
				aEnMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			}
			return aEnMonth[dMonth];
		}
		else {
			var _s = (dMonth + 1).toString();
			return '00'.substr(0, nLen - _s.length) + _s;
		}
	});
	// ger friendly
	if (sResult.indexOf('@') > -1) {
		sResult = privateFn.fFriendlyTime(dDate);
	}
	return sResult;
};

/**
 * 系统内部统一接口
 * @Author: AngusYoung
 * @Version: 1.8
 * @Update: 13-7-29
 * @param {String} sNamespace 接口的名字
 * @param {Array} [aParam] 相应接口所需的参数
 */
Can.util.canInterface = function (sNamespace, aParam) {
	var _privateObject = {
		/**
		 * 鼠标悬停提示文字
		 * @param {jQuery} $Target 基本于此元素的提示
		 * @param {String} [sPosition] up/down/left/right
		 * @param {String} sText 提示的文字，支持HTML
		 * @param {Function} [fFn] 附带交互的函数
		 */
		canTips: function ($Target, sPosition, sText, fFn) {
			var jCfg = {
				id: 'canTitleTips',
				hasFade: true,
				target: $Target,
				text: sText
			};
			switch (sPosition) {
				case "up":
					jCfg.arrowIs = 'Y';
					jCfg.isOpposite = true;
					break;
				case "down":
					jCfg.arrowIs = 'Y';
					break;
				case "left":
					jCfg.isOpposite = true;
					break;
			}
			var tooltips = new Can.ui.textTips(jCfg);
			$Target.on('mouseleave', function () {
				tooltips.hide();
			});
			$(document).on('click.canTitleObj', function () {
				tooltips.hide();
			});
			$Target.data('canTitleObj', tooltips);
			if (typeof fFn === 'function') {
				$Target.click(fFn);
			}
			tooltips.show();
		},
		/**
		 * 撰写邮件窗口
		 * @param {String} sTitle 窗口标题
		 * @param {JSON} jContent 相关的数据，包括subject, address, content
		 * @param {Boolean} bIsReply 是否为回复邮件
		 */
		writeEmail: function (sTitle, jContent, bIsReply) {
			Can.importJS(['js/utils/writeMsgBoxView.js']);
			var writeEmailWin = new Can.view.titleWindowView({
				title: sTitle,
				width: 980,
				height: 620
			});
			var writeEmail = new Can.view.writeMsgBoxView({
				parentEl: writeEmailWin,
				isReply: bIsReply,
				cssName: 'writeEmail-box win-msg'
			});
			writeEmail.start();
			writeEmailWin.setContent(writeEmail.contentEl);
			writeEmailWin.onShow(function () {
				writeEmail.uploaderReady();
				writeEmail.editorReady();
				writeEmail.setContent(jContent);
			});
			writeEmailWin.show();
		},
		/**
		 * 读取邮件窗口
		 * @param {JSON} jParam 请求数据的参数
		 * @param {Boolean} bSingle 是否单条信息查看
		 * @param {Function} [fReadCallback] 读信回调函数
		 * @param {Function} [fDelCallback] 读信回调函数
		 */
		readEmail: function (jParam, bSingle, fReadCallback, fDelCallback) {
			if (typeof bSingle === 'function') {
				fDelCallback = fReadCallback;
				fReadCallback = bSingle;
				bSingle = false;
			}
			Can.importJS(['js/utils/readMsgBoxView.js']);
			//读信窗口
			var readEmailWin = new Can.view.titleWindowView({
				title: Can.msg.MESSAGE_WINDOW.READ_TIT,
				winConfig: {isMovable: false},
				width: 980,
				height: 620
			});
			var readEmail = new Can.view.readMsgBoxView({
				parentEl: readEmailWin,
				cssName: 'readEmail-box win-msg-read',
				onReadItem: fReadCallback,
				onDelItem: fDelCallback
			});
			readEmail.start();
			readEmailWin.setContent(readEmail.contentEl);
			readEmailWin.onShow(function () {
				this.toggleFullScreen(true);
			});
			readEmailWin.show();
			if (bSingle) {
				readEmail.loadData(Can.util.Config.email.readEmail, jParam || {});
			}
			else {
				readEmail.loadData(Can.util.Config.email.readList, jParam || {});
			}
		},
		/**
		 * 询盘邮件窗口
		 * @param {String} sTitle 窗口标题
		 * @param {JSON} jContent 相关的询盘数据，inquiry
		 * @param {String} [sSubjectPD] 邮件标题的预设提示文字
		 */
		inquiry: function (sTitle, jContent, sSubjectPD) {
			Can.importJS(['js/utils/writeMsgBoxView.js']);
			var inquiryWin = new Can.view.titleWindowView({
				title: sTitle,
				width: 980,
				height: 620
			});
			var sendInquiry = new Can.view.sendInquiryBoxView({
				parentEl: inquiryWin,
				cssName: 'writeEmail-box win-msg',
				presetSubject: sSubjectPD || ''
			});
			sendInquiry.start();
			inquiryWin.setContent(sendInquiry.contentEl);
			inquiryWin.onShow(function () {
				sendInquiry.editorReady();
				sendInquiry.setContent(jContent);
			});
			inquiryWin.show();
		},
		/**
		 * 推送窗口
		 * @param {JSON} jData 推送对象的数据，包含id, name
		 */
		pushInfo: function (jData) {
			Can.importJS(['js/seller/view/global/pushContentMsgView.js']);
			var pushWin = new Can.view.titleWindowView({
				title: Can.msg.PUSH_WINDOW.PUSH_TIT,
				width: 690
			});
			var pushWinContent = new Can.view.pushContentMsgView({
				parentEl: pushWin,
				data: jData
			});
			pushWinContent.start();
			pushWin.setContent(pushWinContent.contentEl);
			pushWin.show();
		},
		/**
		 * 快速选择产品
		 * @param {Object} oTarget 传值过去的目标对象，此对象拥有setValues方法
		 * @param {Boolean} [bIsMulti] 是否多选
		 * @param {Function} [fCloseCB] 关闭时的Callback
		 */
		quickSelectProduct: function (oTarget, param, bIsMulti, fCloseCB) {
			if (typeof bIsMulti === 'function' && !fCloseCB) {
				bIsMulti = false;
				fCloseCB = bIsMulti;
			}
			var selProWin = new Can.view.titleWindowView({width: 730});
			var selProContent = new Can.view.selectProductView({
				target: oTarget,
				parentEl: selProWin,
				cssName: 'addPro-box win-add-pro',
				isMultiple: bIsMulti,
				param: param,
				values: []
			});
			selProContent.start();
			selProWin.setContent(selProContent.contentEl);
			if (typeof fCloseCB === 'function') {
				selProWin.onClose(fCloseCB);
			}
			selProWin.show();
		},
		/**
		 * 分类选择器
		 * @param {Object} jOption 配置项
		 * @param {Function} [fOnSave] 点击save按钮后触发的操作
		 */
		categorySelector: function (jOption, fOnSave) {
			Can.importJS(['js/utils/cateSelectorView.js']);
			var cateSelectorWin = new Can.view.titleWindowView({
				title: Can.msg.CATE_SELECTOR.TITLE,
				width: 980
			});
			var _cfg = $.extend({
				parentEl: cateSelectorWin,
				cssName: 'selector-box cate-list sel-cate'
			}, jOption);
			var _cateSelector = new Can.view.cateSelectorView(_cfg);
			_cateSelector.on('ON_SAVED', function (aValue, aDisplayValue) {
				fOnSave(aValue.join('┃'), aDisplayValue.join('; '));
			});
			_cateSelector.start();
			cateSelectorWin.setContent(_cateSelector.contentEl);
			cateSelectorWin.onShow(function () {
				this.toggleFullScreen(true);
			});
			cateSelectorWin.show();
		},
		/**
		 * 生成采购商动态相应的文字
		 * @param jActiveData 采购商的动态
		 * @return {Object}
		 */
		buyerActivityLog: function (jActiveData) {
			Can.importJS(['js/framework/utils/i18n.js']);
			var sAction, sActDesc;
			if (!jActiveData.isMe) {
				if (jActiveData.action.toString().length === 1 && jActiveData.action != 6 && jActiveData.action != 7) {
					jActiveData.action = '1' + jActiveData.action.toString();
				}
			}
			var sEventId = jActiveData.action + ':', sEventTxt = '';
			//定义默认按钮文字
			var sBtn = Can.msg.BUTTON.PUSH_INFO;
			//定义默认按钮事件
			var nBtnAct = 0;
			//根据不同的action显示不同的文字
			/**
			 * 10-15的类型实际是不存在的，对应的类型为0-5，但是isMe:false
			 * 新增类型，需要注意这一点
			 */
			switch (parseInt(jActiveData.action, 10)) {
				//exchangeCard：交换了名片
				case 0:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['EXCHANGE_CARD'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['EXCHANGE_CARD'];
					sBtn = Can.msg.BUTTON.CONTACT_NOW;
					nBtnAct = 1;
					break;
				case 10:// 和别人交换名片
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['EXCHANGE_CARD_ALL'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['EXCHANGE_CARD_ALL'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//collection：收藏供应商
				case 1:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['COLLECTED_INFO'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['COLLECTED_INFO'];
					break;
				case 11:// 收藏别的供应商
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['COLLECTED_INFO_ALL'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['COLLECTED_INFO_ALL'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//fav：收藏产品
				case 2:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['COLLECTED_PRO'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['INDEX_COLLECTED_PRO'];
					sEventId += jActiveData.eventId;
					sEventTxt = jActiveData['eventTitle'];
					break;
				case 12:// 收藏别人的产品
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['COLLECTED_PRO_ALL'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['COLLECTED_PRO_ALL'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//view me：采购商查看了供应商信息
				case 3:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['BROWSE_INFO'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['BROWSE_INFO'];
					break;
				case 13:// 查看别的供应商信息
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['BROWSE_INFO_ALL'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['BROWSE_INFO_ALL'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//browse：浏览产品
				case 4:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['BROWSE_PRO'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['INDEX_BROWSE_PRO'];
					sEventId += jActiveData.eventId;
					sEventTxt = jActiveData['eventTitle'];
					break;
				case 14:// 浏览别人的产品
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['BROWSE_PRO_ALL'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['BROWSE_PRO_ALL'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//mail：询盘
				case 5:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['SEND_INQ'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['SEND_INQ'];
					sBtn = Can.msg.BUTTON.VIEW_DETAIL;
					nBtnAct = 2;
					sEventId += jActiveData.eventId;
					sEventTxt = jActiveData['eventTitle'];
					break;
				case 15:// 对别人发询盘
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['SEND_INQ_ALL'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['SEND_INQ_ALL'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//business：设定商业规则
				case 6:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['BUSINESS'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['BUSINESS'];
					break;
				//interest: 感兴趣
				case 7:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['INTEREST'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['INTEREST'];
					break;
				//search: 搜索
				case 18:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['SEARCH'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['SEARCH'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//postBl: 发布采购需求
				case 19:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['POST_BL'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['POST_BL'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//readExp: 阅读了企业速递
				case 20:
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['BROWSE_BE'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['BROWSE_BE'];
					sEventTxt = jActiveData['eventTitle'];
					break;
				//readPush：阅读了推送邮件
				//case 21:
				//	sAction = Can.msg.BUYER_ACTIVITY['TIT']['BROWSE_PUSH'];
				//	sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['BROWSE_PUSH'];
				//sEventTxt = jActiveData['eventTitle'];
				//	break;
				default :
					sAction = Can.msg.BUYER_ACTIVITY['TIT']['BROWSE_INFO'];
					sActDesc = Can.msg.BUYER_ACTIVITY['DESC']['BROWSE_INFO'];
			}
			sAction = ' ' + sAction;
			sActDesc = Can.util.i18n._(sActDesc, {
					user: jActiveData.buyerName,
					region: '<span class="flags fs' + jActiveData.countryId + '"></span><span class="txt">' + jActiveData.countryName + '</span>',
					data: '<a' + (parseInt(jActiveData.action, 10) < 10 ? ' href="javascript:;"' : '') + ' actionType="' + sEventId + '" style="color:#e05034; font-weight:normal;">' + sEventTxt + '</a>'
				}
			);

			return {
				eventType: nBtnAct,
				eventBtnText: sBtn,
				eventTitle: sAction,
				eventDesc: sActDesc
			};
		},
		/**
		 * 查看用户个人资料弹窗
		 * @param {Number} nUserType 用户类型 外围供应商:0, 供应商:1, 采购商:2
		 * @param {Number} nUserId 查看的用户ID
		 * @param {Number} nFirstTab 首先显示的第几个tab
		 */
		personProfile: function (nUserType, nUserId, nFirstTab) {
			var sTitle = Can.msg.INFO_WINDOW[(nUserType < 2 ? 'SUPPLIER_TIT' : 'BUYER_TIT')];
			var sURL = nUserType === 1 ? Can.util.Config.buyer.profileWindow.supplierProfile : Can.util.Config.seller.profileWindow.buyerProfile;
			sURL = nUserType < 1 ? Can.util.Config.buyer.profileWindow.outSupplierProfile : sURL;
			var userInfoWin = new Can.view.titleWindowView({
				title: sTitle,
				width: 980,
				height: 570
			});
			if (nUserType < 1) {
				Can.importJS(['js/buyer/view/supplierInfo.js']);
				var supplierInfo = new Can.view.SupplierInfo({
					cssName: 'xs'
				});
				supplierInfo.start();
				supplierInfo.loadData(sURL, nUserType === -1 ? {corpId: nUserId} : {supplierId: nUserId});
				userInfoWin.width = 720;
				userInfoWin.height = 536;
				userInfoWin.win.el.addClass('supplier-win');
				userInfoWin.setContent(supplierInfo.contentEl);
			}
			else {
				Can.importJS(['js/utils/userInfoBoxView.js']);
				var buyerInfo = new Can.view.userInfoBoxView({
					parentEl: userInfoWin,
					cssName: 'info-box win-propelling',
					currentPerson: {userId: nUserId},
					firstTab: nFirstTab || 0
				});
				buyerInfo.loadData(sURL, {userId: nUserId});
				userInfoWin.setContent(buyerInfo.contentEl);
			}
			userInfoWin.show();
		},
		/**
		 * 添加为联系人
		 * @param {JSON} jContacter 要添加的联系人信息
		 * @param {Function} [fCallback] 添加成功之后的回调函数
		 */
		addToContact: function (jContacter, fCallback) {
			/*
			 * @param {Number}  id          添加用户的是userId
			 * @param {Number}  contactType 用户的类型
			 * @param {Number}  [groupId]   添加进的分组ID
			 * @param {Array}   [tags]      联系人印象标签
			 * */
			$.ajax({
				url: Can.util.Config.contacts.addToContact,
				data: Can.util.formatFormData({
					contactId: jContacter.id,
					contactType: jContacter.contactType,
					groupId: jContacter.groupId,
					remarks: jContacter.tags
				}),
				type: 'POST',
				success: function (jData) {
					if (jData.status && jData.status === 'success') {
						if (jData.data) {
							var _data = jData.data;
							/**
							 * add to IM friend
							 * @param {String}  userName        添加用户的名字，IM用
							 * @param {String}  imAccount       添加用户的IM账号，IM用
							 * @param {String}  [groupName]     添加进的分组名，IM用
							 */
							typeof WebIM === 'object' && Can.util.userInfo().getIMAccount() && WebIM.addContact(_data.imAccount, _data.userName, (_data.groupName || 'Friends'));
						}
						typeof fCallback === 'function' && fCallback();
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		},
		/**
		 * 自动消失的提示，如果不传递内容参数则默认显示等待开发的提示
		 * @param {String} [sText] 显示的文字
		 */
		whoSay: function (sText) {
			var develop = new Can.view.msgWindowView({width: 300});
			var sNotFestivalFuck = Can.util.Config.lang === 'en' ? 'Come Soon...' : '功能开发中。。。' +
				[
					'',
					'也许根本没有。。。',
					'你真的觉得会有吗？',
					'不要相信程序员的话',
					'开发人员已加班猝死',
					'伟大的内联网！！！'
				][Math.round(Math.random() * 0)];
			develop.setContent('<div class="friendly-box ali-c">' + (sText || sNotFestivalFuck) + '</div>');
			develop.show(function () {
				setTimeout(function () {
					develop.close();
					develop = null;
				}, 1500);
			});
		},
		/**
		 * 查看产品详情
		 * @param {Number} nId 产品的ID
		 * @param {String} sTitle 产品的标题
		 * @param {String} [sReturnMod] 返回的module
		 * @param {Object} [oPage] 翻页列表对象
		 * @param {Boolean} bSupplier 是否为供应商查看
		 */
		productDetail: function (nId, sTitle, sReturnMod, oPage, bSupplier) {
			var oContext = {page: oPage};
			var sRefererUrl = Can.Route.currentUrl();

			if (sRefererUrl) {
				oContext.refererUrl = sRefererUrl;
			}

			//console.log(oContext);

			Can.Route.run('/view-product', {id: nId}, oContext);
			/*if (typeof sReturnMod === 'boolean') {*/
			//bSupplier = sReturnMod;
			//sReturnMod = null;
			//}
			//else if (typeof sReturnMod === 'object') {
			//oPage = sReturnMod;
			//sReturnMod = null;
			//}
			//else if (typeof sReturnMod !== 'string') {
			//sReturnMod = null;
			//}
			//if (typeof oPage === 'boolean') {
			//bSupplier = oPage;
			//oPage = null;
			//}
			//else if (typeof oPage !== 'object') {
			//oPage = null;
			//}
			//if (bSupplier) {
			//Can.importJS(['js/seller/view/productDetailModule.js']);
			//}
			//else {
			//Can.importJS(['js/buyer/view/productDetailModule.js']);
			//}

			//if (Can.Application && Can.Application.getModule && Can.Application.getModule('productDetailModuleId')) {
			//var productDetailModule = Can.Application.getModule('productDetailModuleId');
			//productDetailModule.updateTitle(sTitle);
			//}
			//else {
			//productDetailModule = new Can.module.productDetailModule({title: sTitle});
			//if(Can.Application){
			//Can.Application.putModule(productDetailModule);
			//}
			//productDetailModule.start();
			//}
			//productDetailModule.pageObj = oPage;
			////console.log(sReturnMod)
			//if (sReturnMod) {
			//productDetailModule.returnModule = sReturnMod;
			//}
			//productDetailModule.loadData(Can.util.Config.seller.productDetail.loadData, {productId: nId});
			/*productDetailModule.show();*/
		},
		/*
		 * Takes a string in format "a=1&b=2" and returns an object { a: '1', b: '2' }.
		 * If the "param1" ends with "[]" the param is treated as an array.
		 */
		unserialize: function (param) {
			var i, item,
				param = decodeURI(param),
				pairs = param.split('&'),
				param_object = {};

			for (i = 0; i < pairs.length; i++) {
				item = pairs[i].split('=');
				if (!item[1]) {
					continue;
				}
				param_object[item[0]] = item[1];

				/*
				 idx = p[0];
				 if (idx.indexOf("[]") == (idx.length - 2)) {
				 // Eh um vetor
				 var ind = idx.substring(0, idx.length-2)
				 if (obj[ind] === undefined) {
				 obj[ind] = [];
				 }
				 obj[ind].push(p[1]);
				 }
				 else {
				 obj[idx] = p[1];
				 }
				 */
			}
			return param_object;
		},
		/**
		 * Credit Rating
		 */
		creditRating: function (id) {
			var i, item, data, table = '',
				msg = Can.msg.CREDIT_RATING,
				panel = new Can.view.titleWindowView({
					// title: Can.msg.CAN_TITLE.SINO_RATING,
					title: msg.L1,
					width: 800,
					height: 450
				});

			panel.setContent([
				'<div class="credit-panel">',
				'<div class="main">',
				'<div class="report">',
				'<div class="sample">',
				'<div class="preview"><img src="/C/img/credit_sample.png"></div>',
				'<a href="/C/img/credit_report_sample.pdf" target="_blank">' + Can.msg.DOWNLOAD + '</a>',
				'</div>',
				'<h1 class="title">' + msg.L1 + '</h1>',
				'<p class="figuration">' + msg.L2 + '</p>',
				'<div class="price">' + Can.msg.PRICE + ': &#165;800.00</div>',
				'<div class="get-now">' + msg.L3 + '! 4006-280-333</div>',
				'</div>',
				'<div class="how-to">',
				'<h1 class="title">' + msg.L4 + '</h1>',
				'<div class="step step-1"><div class="label">' + msg.L5 + ' 1</div>' + msg.L6 + '</div>',
				'<div class="step step-2"><div class="label">' + msg.L5 + ' 2</div>' + msg.L7 + '</div>',
				'<div class="step step-3"><div class="label">' + msg.L5 + ' 3</div>' + msg.L8 + '</div>',
				'</div>',
				'</div>',
				'<div class="win-action ali-r">',
				'<a href="javascript:;" class="btn btn-s12" role="panel-close">' + Can.msg.BUTTON.CANCEL + '</a>',
				'</div>',
				'</div>'
			].join(''));

			panel.content.el.on('click', '[role=panel-close]', function () {
				panel.close();
			});
			panel.show();
		}
	};
	return _privateObject[sNamespace].apply(null, aParam);
};

/**
 * 模版解析
 * @Author: AngusYoung
 * @Version: 0.01 beta
 * @Since: 13-3-16
 * @param {String} sTemplate 模版字符串
 * @param {Object} jModel 数据模型
 * @return {Object} 返回jQuery Object的对象
 */
Can.util.templateParse = function (sTemplate, jModel) {
	var jMap = {};

	function __fParseModel(sKey, jMod) {
		if (!jMod) {
			return undefined;
		}
		if (sKey.indexOf('.') < 0) {
			var _v = jMod[sKey];
			var _ram = Math.random().toString().replace('.', '');
			if (_v instanceof Can.ui.BaseUI) {
				jMap[_ram] = {type: 1, object: _v};
				return '<span id="T' + _ram + '"></span>';
			}
			else if (_v instanceof Can.view.BaseView) {
				jMap[_ram] = {type: 2, object: _v};
				return '<span id="T' + _ram + '"></span>';
			}
			else if (typeof _v === 'object' && _v !== null && (_v.innerHTML || _v.jquery)) {
				jMap[_ram] = {type: 0, object: _v};
				return '<span id="T' + _ram + '"></span>';
			}
			return _v !== undefined ? _v : undefined;
		}
		else {
			var _model = sKey.split('.');
			return __fParseModel(_model.slice(1).join('.'), jMod[_model[0]]);
		}
	}

	function __fParseProperty($Obj, sType) {
		var sProperty = 'pc-' + sType;
		var oProperty = __fParseModel($Obj.attr(sProperty), jModel);
		if (!oProperty) {
			return;
		}
		switch (sType) {
			case 'repeat':
				for (var j = 0, nLen = oProperty.length; j < nLen; j++) {
					var _o = $('<div></div>');
					$Obj.clone().removeAttr(sProperty).appendTo(_o);
					Can.util.templateParse(_o.html(), {i: oProperty[j], __index: j + 1}).insertBefore($Obj);
				}
				$Obj.remove();
				break;
		}
	}

	var sResult = sTemplate.replace(/{.*?}/g, function (s) {
		var sKey = s.replace('{', '').replace('}', '');
		var _s = __fParseModel(sKey, jModel);
		return _s !== undefined ? _s : s;
	});
	sResult = sResult.replace(/<img[^>]+?src=["'](\{)/g, function (s, $1) {
		return s.replace($1, '####' + $1);
	});
	var $Result = $('<div></div>').append(sResult);
	for (var v in jMap) {
		var _obj = jMap[v];
		var $Id = $('#T' + v, $Result);
		if (_obj.type === 1) {
			$Id.before(_obj.object.el);
		}
		else if (_obj.type === 2) {
			//这里必须规范VIEW都有一个方法可以对VIEW里的内容进行APPEND
			//$Id.before(_obj.object.contentEl);
		}
		else if (_obj.type === 0) {
			$Id.before(_obj.object);
		}
		$Id.remove();
	}
	$('[pc-repeat]', $Result).each(function () {
		__fParseProperty($(this), 'repeat');
	});
	$('img', $Result).each(function () {
		var _self = $(this);
		_self.attr('src', _self.attr('src').replace('####', ''));
	});
	return $Result.children();
};

/*
 * Room
 * store data implicitly
 */
Can.util.room = (function () {
	var room = {}, roomNO = 0;
	room.checkin = function (data) {
		roomNO++;
		room[roomNO] = data;
		return roomNO;
	};
	return room;
})();

/*
 * format image, return default image if it is null
 *
 * INPUT:
 * formatImage('/xx/xx.jpg', '60x60', 'male')
 *
 * OUPUT:
 *
 * if the Image URL is valid:
 * <img src="/xx/xx_60x60_3.jpg">
 *
 * or not:
 * <div class="placeholder male" style="width: 60px; height: 60px;"></div>
 *
 */
Can.util.formatImage = function (image, size, type, alt) {
	var extension, dot, _image, node, avatarWidth,
		size = size || '120x120',
		sizeA = size.split('x'),
		width = Number(sizeA[0]),
		height = Number(sizeA[1]),
		zoom = 1,
		cssType = 'b',
		className = '',
		minSize = 0,
		position = {left: 0, top: 0},
		alt = alt || '';

	if (type != 'male' && type != 'female') {
		type = '';
	}
	if (!image) {
		className = 'def-avatar-none';

		minSize = Math.min(width, height)

		if (type != '') {
			if (Can.util.userInfo().getUserType() === 1) {
				cssType = 's';
			}
			className = 'def-avatar-' + type + '-' + cssType;

			zoom = minSize / 90;

			position.left = parseInt(width - zoom * 90) / 2;
			position.top = parseInt(height - zoom * 90) / 2;

		}
		else {
			zoom = minSize / 180;

			position.left = parseInt(width - zoom * 180) / 2;
			position.top = parseInt(height - zoom * 140) / 2;
		}


		var $Avatar = $(([
			'<div class="def-avatar">',
			'<div class="def-avatar-bg ' + className + '"></div>',
			'</div>'
		]).join(''));

		$Avatar.width(width).height(height).
			find('.def-avatar-bg').css({
				transform: 'scale(' + zoom + ')',
				'-webkit-transform': 'scale(' + zoom + ')',
				'-moz-transform': 'scale(' + zoom + ')',
				'-ms-transform': 'scale(' + zoom + ')',
				marginTop: position.top,
				marginLeft: position.left
			});


		if ($.browser.msie && $.browser.version < 9) {
			$Avatar.find('.def-avatar-bg').css({
				marginLeft: 'auto',
				zoom: zoom
			});
		}

		var $Box = $('<div></div>');
		$Avatar.appendTo($Box);
		return $Box.html();


		/*if (type != '') {*/
		//avatarMarginTop = Math.min(width, 90);
		//avatarWidth = width * 2;

		////console.log(Can.util.userInfo().getUserType())
		//if (Can.util.userInfo().getUserType() === 1) {
		//avatarMarginTop = 0;
		//}

		//if (type == 'female') {
		//avatarMarginLeft = width;
		//}

		//} else {
		//avatarMarginTop = Math.min(width, 180);
		//avatarWidth = width;
		//bottom = (height - maxSize.height) / 4;
		//}


		//if (type === '') {
		//maxSize.width = 180;
		//maxSize.height = 140;
		//}

		//if (width > maxSize.width) {
		//right = (width - maxSize.width) / 2;
		//}
		//if (height > maxSize.height) {
		//bottom = (height - maxSize.height) / 2;
		//}


		/*node = '<div class="' + className.join(' ') + '" style="width: ' + width + 'px; height: ' + height + 'px;"><span class="icon" style="right: ' + right + 'px; bottom: ' + bottom + 'px;"><img src="/C/css/common/bgimg/avatar.png" style="width: ' + avatarWidth + 'px; height: auto;margin-left: -' + avatarMarginLeft + 'px; margin-top: -' + avatarMarginTop + 'px;"></span></div>';*/
	} else {
		// image = image.replace(/\.[^/.]+$/, "");
		// extension = ;

		dot = image.lastIndexOf('.');
		_image = image.substr(0, dot);
		extension = image.substr(dot);

		node = '<img width="' + width + '" height="' + height + '" src="' + _image + '_' + size + '_3' + extension + '" alt="' + alt + '">';
	}

	return node;
};

/**
 * 返回字符串的长度，英文1个字节，中文2个字节
 */
Can.util.checkLength = function (s) {
	var sum = 0;
	for (var i = 0; i < s.length; i++) {
		if (s.charCodeAt(i) >= 0 && s.charCodeAt(i) <= 255) {
			sum = sum + 1;
		} else {
			sum = sum + 2;
		}
	}
	return sum;
};

/**
 * 返回地区格式，中文格式：区,省份,城市  英文格式: 城市,省份,区
 */
Can.util.formatRegion = function (region, type) {
	if (!region) {
		return Can.msg.CHINA;
	}
	if (!region.town && !region.city) {
		return region.province;
	}
	if (Can.util.Config.lang === "en") {
		if (!region.town || type != "town") {
			return region.city + " , " + region.province;
		} else {
			return region.town + " , " + region.city + " , " + region.province;
		}
	} else {
		if (!region.town || type != "town") {
			return region.province + " , " + region.city;
		} else {
			return region.province + " , " + region.city + " , " + region.town;
		}
	}
}
/**
 * 只返回图片的路径，按指定的宽高
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 13-4-8
 * @param {String} sSrc 原图路径
 * @param {Number} nWid 宽度
 * @param {Number} nHei 高度
 * @returns {String}
 */
Can.util.formatImgSrc = function (sSrc, nWid, nHei) {
	nWid = nWid || 120;
	nHei = nHei || 120;
	if (!sSrc) {
		return Can.util.Config['static']['defaultImage']['blank'] + '" width="' + nWid + '" height="' + nHei;
	}
	var _src = sSrc.split('.');
	_src[_src.length - 2] += '_' + nWid + 'x' + nHei + '_3';
	return _src.join('.');
};
/**
 * 返回文件大小的格式，比如KB,MB,GB
 * @param {Number} nSize 文件大小的字节数
 * @returns {string}
 */
Can.util.formatFileSize = function (nSize) {
	var aUnit = ['KB', 'MB', 'GB', 'TB'];

	function __fCountSize(nSize, nIndex) {
		var _new = nSize / 1024;
		if (Math.round(_new) > 999) {
			return __fCountSize(_new, ++nIndex);
		}
		else {
			return _new.toFixed(2).toString() + ' ' + aUnit[nIndex];
		}
	}

	return __fCountSize(nSize, 0);
};
/**
 * Base64加密
 * @Author: AngusYoung
 * @Version: 0.0001 beta
 * @update: 13-3-9
 */
Can.util.Base64 = function () {
	// private property
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var _privateFun = {
		/**
		 *
		 *  Base64 encode / decode
		 *
		 *  @author haitao.tu
		 *  @date   2010-04-26
		 *  @email  tuhaitao@foxmail.com
		 *
		 */
		// public method for encoding
		encode: function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = this._utf8_encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
					_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
			}
			return output;
		},
		// public method for decoding
		decode: function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = this._utf8_decode(output);
			return output;
		},
		// private method for UTF-8 encoding
		_utf8_encode: function (string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
			return utftext;
		},

		// private method for UTF-8 decoding
		_utf8_decode: function (utftext) {
			var string = "";
			var i = 0;
			var c = 0, c1 = 0, c2 = 0, c3;
			while (i < utftext.length) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		},
		randInsert: function (sLeft, sRight) {
			var _nRandom = Math.round(Math.random() * (sLeft.length / 2));
			return sLeft.substr(0, _nRandom) + sRight + sLeft.substring(_nRandom);
		},
		sUdL: function (sStr) {
			var _a = [];
			for (var i = 0; i < sStr.length; i++) {
				if (i % 2 === 0) {
					_a.push(sStr.substr(i, 1).toUpperCase());
				}
				else {
					_a.push(sStr.charCodeAt(i));
				}
			}
			return _a.join('');
		},
		confuse: function (sLeft, sRight) {
			var _len = Math.max(sLeft.length, sRight.length);
			var _s = '';
			for (var i = 0; i < _len; i++) {
				_s += sLeft.substr(i, 1) + sRight.substr(i, 1);
			}
			return _s;
		},
		deConfuse: function (sStr, sKey) {
			var _l = '';
			var _r = '';
			for (var i = 0; i < sStr.length; i++) {
				if (i % 2 === 0 || _r.length >= sKey.length) {
					_l += sStr.substr(i, 1);
				}
				else {
					_r += sStr.substr(i, 1);
				}
			}
			return _l;
		},
		encodeNum: function (sStr) {
			var _a = [];
			for (var i = 0; i < sStr.length; i++) {
				var _s = sStr.charCodeAt(i).toString();
				_a.push('000'.substr(0, 3 - _s.length) + _s);
			}
			return _a.join('');
		}
	};
	return {
		encode: function (sString, sSalt) {
			var _s1 = _privateFun.encode(sString);
			var _s2 = _privateFun.sUdL(sSalt.split('').reverse().join(''));
			var _s4 = _privateFun.encodeNum(_s2);
			var _s3 = _privateFun.encode(_privateFun.randInsert(_s1, _s2));
			var _s5 = _privateFun.confuse(_s3, _s4);
			return _privateFun.encode(_s5);
		},
		decode: function (sCipher, sSalt) {
			var _s1 = _privateFun.decode(sCipher);
			var _s2 = _privateFun.sUdL(sSalt.split('').reverse().join(''));
			var _s4 = _privateFun.encodeNum(_s2);
			var _s3 = _privateFun.deConfuse(_s1, _s4);
			var _s5 = _privateFun.decode(_s3);
			_s5 = _s5.replace(_s2, '');
			return _privateFun.decode(_s5);
		}
	};
}();

/**
 * 将表单数据的hash表转换成&连接的字符串，
 * 适用于数据当中包含有需要传输为数组的情况
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-4-7
 * @param jHash
 * @return {String}
 */
Can.util.formatFormData = function (jHash) {
	var aStr = [];
	var i;

	function __fFormatURI(o) {
		if (o instanceof Array) {
			for (i = 0; i < o.length; i++) {
				o[i] = encodeURIComponent(o[i]);
			}
		}
		else {
			o = encodeURIComponent(o);
		}
		return o;
	}

	for (var v in jHash) {
		// if (!jHash[v]) {
		// this gonna to kill value is 0, for example: { a: 0 }

		if (!jHash[v] && jHash[v] !== 0) {
			continue;
		}
		if (jHash[v] instanceof Array) {
			if (jHash[v].length) {
				aStr.push(v + '=' + __fFormatURI(jHash[v]).join('&' + v + '='));
			}
		}
		else if (jHash[v].toString().indexOf('┃') > 0) {
			aStr.push(v + '=' + __fFormatURI(jHash[v]).split('┃').join('&' + v + '='));
		}
		else {
			aStr.push(v + '=' + __fFormatURI(jHash[v]));
		}
	}
	return aStr.join('&');
};

/**
 * 提供页面元素属性改变的监听功能
 * @Author: AngusYoung
 * @Version: 1.1
 * @Update: 13-4-14
 */
Can.util.elementAttrObserve = function () {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	return {
		listen: function ($Elements, aAttribute, fCallback) {
			if (typeof MutationObserver === 'function') {
				var Obs = new MutationObserver(function (aObj) {
					aObj.forEach(function (oObj) {
						typeof fCallback === 'function' && fCallback.call(oObj.target);
					});
				});
				$Elements.each(function () {
					Obs.observe(this, {
						attributes: true,
						childList: false,
						characterData: false,
						attributeOldValue: true,
						attributeFilter: aAttribute
					});
				});
			}
			else {
				$Elements.each(function () {
					this.onpropertychange = function (event) {
						event = event || window.event;
						if ($.inArray(event.propertyName, aAttribute) !== -1) {
							typeof fCallback === 'function' && fCallback.call(this);
						}
					}
				});
			}
		}
	};
}();

/**
 * 主动行为记录
 * @Author: AngusYoung
 * @Version: 1.1
 * @Since: 2013-9-17
 * @param {Number} nTime 记录触发的时长，即低于此长度内不重复触发
 * @param {String} sAction 记录的类型，不同类型有不同的存储空间
 * @param {Object} jParam 需要传输给后端记录的数据
 */
Can.util.tracer = function (nTime, sAction, jParam) {
	var jLogTime = {};
	var jAction = {};
	if (window.localStorage && JSON) {
		jLogTime = JSON.parse(window.localStorage.getItem('logTime')) || jLogTime;
	}
	switch (sAction) {
		case 'viewContact':
			jAction['logName'] = 'b5b937ca4cf24f65d7b6f712705b607f';
			jAction['logURL'] = Can.util.Config.actionLog.seeContact;
			jAction['label'] = 'SupplierID: ' + jParam['targetId'];
			break;
		default :
			return;
	}
	var dRecordTime = Can.util.formatDateTime(jLogTime[jAction.logName] || 0);

	function __fUpdateLogTime() {
		jLogTime[jAction.logName] = new Date() - 0;

		if (window.localStorage && JSON) {
			window.localStorage.setItem('logTime', JSON.stringify(jLogTime));
		}
	}

	if (new Date() - nTime > dRecordTime) {
		if (typeof ga === 'function') {
			ga('send', 'event', 'actionLog', sAction, jAction['label']);
		}
//		$.ajax({
//			url: jAction.logURL,
//			type: 'POST',
//			data: Can.util.formatFormData(jParam),
//			success: function (jData) {
//				if (jData.status && jData.status === 'success') {
		__fUpdateLogTime();
//				}
//			}
//		});
	}
};

/**
 * 绑定IM按钮
 * @author  vfasky
 * @version version
 */
Can.util.bindIM = (function () {
	/*
	 var _time = false;
	 //队列等待200毫秒
	 var _wait = 200;

	 //发送队列
	 var _sendList = [];

	 //对外发布的接口
	 var exports = {};


	 //将按钮加入待发送队列
	 exports.add = function (el, userId) {
	 //console.log(window['WebIM'])
	 if (window['WebIM']) {
	 if (_time) {
	 clearTimeout(_time);
	 }
	 el.click(function () {
	 return false;
	 });
	 // el.bind('click', function(){
	 // 	if(window[''])
	 // })
	 _sendList.push({
	 el: el,
	 userId: userId
	 });

	 _time = setTimeout(function () {
	 exports.send();
	 }, _wait);
	 }
	 };

	 //发送请求队列,取得im 状态
	 exports.send = function () {
	 if (_time) {
	 clearTimeout(_time);
	 }
	 //复制队列
	 var userIds = '';
	 var sendList = [];
	 $.each(_sendList, function (k, v) {
	 //确保传送的id不为空
	 if (v.userId
	 && $.trim(v.userId) != ''
	 && -1 === $.inArray(v.userId, sendList)
	 ) {
	 userIds += 'ids=' + v.userId.toString() + '&';
	 sendList.push(v);
	 }

	 });
	 //console.log(userIds);
	 // 如果id为空，退出
	 if (userIds == '') {
	 return false;
	 }

	 //清空发送队列
	 _sendList = [];
	 var userType = Number(Can.util.userInfo().getUserType()) === 2 ? '1' : '2';
	 $.post(Can.util.Config.IM.getImUserOnlineStatus, userIds + 'type=' + userType, function (data) {
	 $.each(data.data, function (k, info) {
	 $.each(sendList, function (k1, v) {
	 if (v.el.data('imAccount')) {
	 return;
	 }

	 if (Number(info.userId) == Number(v.userId)) {
	 if (false === $.isFunction(v.el.data('setStatus'))) {
	 return;
	 }
	 if (info['status']) {
	 v.el.data('setStatus')('online');
	 }
	 else {
	 v.el.data('setStatus')('off');
	 }
	 v.el.data('imAccount', info.imAccount);
	 //console.log(info.imAccount)
	 if (info.imAccount) {
	 v.el.bind('click', function () {
	 WebIM.openDialogTab(info.imAccount);
	 //更新一次在线状态
	 $.post(Can.util.Config.IM.getImUserOnlineStatus, {
	 ids: info.userId,
	 type: userType
	 }, function (json) {
	 $.each(json.data, function (k3, v3) {
	 if (Number(v3.userId) == Number(info.userId)) {
	 var status = v3['status'] ? 'online' : 'off';

	 v.el.data('setStatus')(status);
	 }
	 })
	 }, 'json')
	 return false;
	 });
	 }
	 }
	 });
	 });
	 for (var id in data.data) {
	 $.each(sendList, function (k, v) {
	 if (Number(id) == Number(v.userId)) {
	 (function (el, name, userId) {
	 el.bind('click', function () {

	 //console.log(name)
	 WebIM.openDialogTab(name);
	 return false;
	 });
	 })(v.el, data.data[id], v.userId);
	 }
	 });
	 }
	 }, 'json');
	 };

	 return exports;
	 */
	return {
		add: function () {
		},
		send: function () {
		}
	};
})();

/*
 * Global Notice
 *
 * INPUT:
 * notice('what you did is wrong', 'error')
 *
 */
Can.util.notice = (function () {
	var ing, done, currentModule,
		$tip = $('<div class="text-tips global-notice" />');

	return function (text, type) {
		/*
		 * @type
		 * default: OK
		 * error:
		 */
		var tone = 'text-tips-icon',
			currentTitle = Can.Application.getCurrentModule().titleEL,
			titleWidth = currentTitle.data('width');

		if (!text) {
			return;
		}
		if (!done) {
			$tip.insertAfter($('#header'));
			done = true;
		}

		switch (type) {
			case 'error':
				break;
		}
		$tip.html($([
			'<div>',
			'<span class="' + tone + '"></span>',
			text,
			'</div>'
		].join('')));

		if (ing) {
			return;
		}

		ing = true;

		if (!titleWidth) {
			titleWidth = currentTitle.html('<span>' + currentTitle.html() + '</span>').find('span').width();
			currentTitle.data('width', titleWidth);
		}

		$tip.css({
			left: ($('body').width() - $('#container').width()) / 2 + titleWidth + 10,
			'top': 130
		});
		$tip.fadeIn();

		setTimeout(function () {
			$tip.fadeOut('slow');
			ing = false;
		}, 1500);
	}
})();

/*
 * turn expired date to human readable text
 *
 * INPUT:
 * countDown(sDate)
 * {sDate}: '2013-08-23 20:42:49' or 1377228347715(milliseconds)
 *
 * OUPUT:
 *
 * 1Y 2D 3H (1 year 2 day 3 hour)
 *
 */
Can.util.countDown = function (sDate) {

	var fCreateDate = function (sDate) {
		//filter format
		//e.g 2013-1-4 13:14:20
		if (!sDate) {
			return '';
		}
		sDate = sDate.replace(' ', '-').replace(/:/g, '-');
		var aDate = sDate.split('-');
		var dDate;

		function __fNewDate(a, b, c, d, e, f, g) {
			a = a || null, b = b - 1 || null, c = c || null, d = d || null, e = e || null, f = f || null, g = g || null;
			return new Date(a, b, c, d, e, f, g);
		}

		dDate = __fNewDate.apply(null, aDate);
		return dDate;
	};

	var i, item,
		sCount = [],
		nOffset = (fCreateDate(sDate)) - (new Date()),
		nHourUnit = 1000 * 60 * 60,
		nDayUnit = nHourUnit * 24,
		nYeahUnit = nDayUnit * 365,
		nYeah = Math.floor(nOffset / nYeahUnit),
		nDay = Math.floor((nOffset - (nYeah * nYeahUnit)) / nDayUnit),
		nHou = Math.floor((nOffset - (nYeah * nYeahUnit + nDay * nDayUnit)) / nHourUnit);
	/*if (nOffset < 0) {
	 nYeah = 0;
	 nDay = "0";
	 nHou = "0";
	 }*/
	var jMeta = [
		{
			label: 'Y',
			value: nYeah
		},
		{
			label: 'D',
			value: nDay
		},
		{
			label: 'H',
			value: nHou
		}
	];

	for (i = 0; i < jMeta.length; i++) {
		item = jMeta[i];

		if (item.value) {
			sCount.push(item.value + item.label);
		}

	}
	if (nOffset < 0) {
		return "Expired";
	} else {
		return sCount.join(' ');
	}

};

/*
 * CClick
 *
 * INPUT:
 * cclick('what you did is wrong', 'error')
 *
 */
Can.util.cclick = (function () {
	var oPanel, currentId, trigger, OT,
		jCC = {},
		nId = 0;

	$(function () {
		$('#container').on('click', '[role=cclick]', function () {
			var $this = $(this);

			trigger = $this;
			fPanel($this.data('id'));
			ga('send', 'event', 'CClick', 'Trigger', jCC[ $this.data('id') ].refs);
		});

		$('body').bind('click', function (e) {
			var $target = $(e.target);

			if (!$target.closest(oPanel).length && !$target.closest('[role=cclick]').length && !$target.closest('.ui-win').length) {
				oPanel && oPanel.remove();
			}
		});
	});

	var pos = function () {
		var jOffset = trigger.position();

		oPanel.css({
			left: jOffset.left + trigger.outerWidth() + 10,
			'top': jOffset.top - (oPanel.outerHeight() - trigger.outerHeight()) / 2
		});
	};

	var closePanelWithout = function (target) {
	};

	var fNewPanel = function (id) {
		oPanel = $([
			'<div class="text-tips has-arrow arrow-left tips-t2 cclick">',
			'</div>'
		].join(''));

		oPanel.insertAfter(trigger);

		var boss = oPanel;

		boss.on('click', '[role=option]', function () {
			var $this = $(this);

			if (( boss.find('.option.selected').length >= jCC[ currentId ].options.max ) && !$this.hasClass('selected')) {

				var fMaxAlert = new Can.view.alertWindowView({
					closeAction: 'hide',
					hasBorder: false,
					type: 2
				});
				fMaxAlert.setContent([
					'<div class="alert-status">',
					'<span class="icon"></span>',
					Can.msg.cclick.l14.replace('@', jCC[currentId].options.max),
					'</div>'
				].join(''));
				fMaxAlert.main.el.addClass('alert-win-t1');
				fMaxAlert.show();
				return;
			}
			$this.toggleClass('selected');
		});

		boss.on('click', '[role=close]', function () {
			boss.hide();
		});

		boss.on('click', '[role=submit]', function () {
			var i,
				selected = [],
				options = boss.find('.option');

			for (i = 0; i < options.length; i++) {
				if ($(options[i]).hasClass('selected')) {
					selected.push(i);
				}
			}

			if (!selected.length) {
				var fMaxAlert = new Can.view.alertWindowView({
					closeAction: 'hide',
					hasBorder: false,
					type: 2
				});
				fMaxAlert.setContent([
					'<div class="alert-status">',
					'<span class="icon"></span>',
					Can.msg.cclick.l13,
					'</div>'
				].join(''));
				fMaxAlert.main.el.addClass('alert-win-t1');
				fMaxAlert.show();
				return;
			}

			jCC[ currentId ].submit(selected, fCallback);

			// if (Can.ENV.now === 'prod') {
			ga('send', 'event', 'CClick', 'Submit', jCC[ currentId ].refs);
			// }
		});
	};

	var fCallback = function (status, msg) {
		oPanel.html([
			'<div class="feedback">',
			'<span class="success"></span>',
			Can.msg.cclick.l15,
			'<span class="close" role="close">X</span>',
			'</div>'
		].join(''));

		pos();

		OT = setTimeout(function () {
			oPanel.remove();
		}, 2000);
	};

	var fPanel = function (id) {
		var i,
			sOptions = '',
			jParams = jCC[ id ],
			aOptionItems = jParams.options.items;

		for (i = 0; i < aOptionItems.length; i++) {
			sOptions += '<li class="option" role="option">' + aOptionItems[i].key + '<span class="check"></span></li>';
		}

		// if (!oPanel) {
		fNewPanel();
		// };

		oPanel.html([
			'<h1 class="title">' + jParams.title + '</h1>',
			'<p class="body">' + jParams.body + '</p>',
			'<ul class="requests">',
			sOptions,
			'</ul>',
			'<a href="javascript:;" class="btn-s17 btn-s18" role="submit">' + Can.msg.MODULE.BUYING_LEAD.SUBMIT + '</a>',
			'<a href="javascript:;" class="btn-s17 btn-s18 btn-s19" role="close">' + Can.msg.BUTTON.CANCEL + '</a>'
		].join(''));

		clearTimeout(OT);
		oPanel.show();

		pos();

		currentId = id;
	};

	return function (jParams) {
		/*
		 * @params
		 * title: OK
		 * body:
		 * options: {
		 *		items: [ ]
		 *		max: 3
		 * }
		 */

		nId++;
		jCC[nId] = jParams;

		var sText = '', sClassName = 'btn-t1 btn-cclick', icon = '';

		switch (jParams.type) {
			case 1:
				sClassName = 'btn-cclick-t1';
				sText = Can.msg.cclick.l25;
				break;
			default:
				icon = '<span class="icon"></span>';
				break;
		}

		return '<a href="javascript:;" class="' + sClassName + '" data-id="' + nId + '" role="cclick" data-scene="' + jParams.scene + '">' + icon + sText + '</a>';
	}
})();

Can.util.tinyTip = (function () {
	$(function () {
		$('body').on('click', '[role=tiny-tip-got-it]', function () {
			var $this = $(this);

			localStorage.setItem($this.data('mark'), true);
			$this.closest('[role=tip]').hide();
		});
	});

	return function (trigger, msg, mark) {
		var $tip = $([
				'<div class="text-tips has-arrow arrow-left tips-t2 pulse" role="tip">',
				msg,
				'<br>',
				'<a href="javascript:;" class="link" role="tiny-tip-got-it" data-mark="' + mark + '">' + Can.msg.cclick.l12 + '</a>',
				'</div>'
			].join('')),
			jOffset = trigger.position();

		$tip.insertAfter(trigger);

		$tip.css({
			left: jOffset.left + trigger.outerWidth() + 10,
			'top': jOffset.top - ($tip.outerHeight() - trigger.outerHeight()) / 2
		});

	};
})();

/**
 * 基本于本储存的缓存
 */
(function (Can) {
	var Cache = {};
	var sNameSpace = '__Can_Cache__';
	var localStorage = window.localStorage || {setItem: function () {
	}, getItem: function () {
	}};

	/**
	 * 设置缓存
	 * @params {String} sKey 缓存的key,
	 * @param {Mixed} xVal 缓存的值，只能是能被 JSON 正常序列化的对象
	 * @param {Number} nLifeTime 缓存在效时间，单位毫秒。 默认为 -1， 永久有效，除非删除
	 */
	Cache.set = function (sKey, xVal, nLifeTime) {
		var nTime = (new Date).getTime();
		var nLifeTime = Number(nLifeTime || -1);
		var oData = {
			time: nTime,
			lifeTime: nLifeTime,
			val: xVal
		};

		var sVal = JSON.stringify(oData);

		return localStorage.setItem(sNameSpace + sKey.toString(), sVal);
	};

	Cache.get = function (sKey, xDef) {
		var sVal = localStorage.getItem(sNameSpace + sKey.toString());
		if (!sVal) {
			return xDef;
		}

		var oData = JSON.parse(sVal);

		if (oData.lifeTime && oData.time && oData.val !== undefined) {
			if (oData.lifeTime === -1) {
				return oData.val;
			}
			var time = (new Date).getTime() - oData.lifeTime;

			if (time <= oData.time) {
				return oData.val;
			}
			else {
				//清除缓存
				Cache.remove(sKey);
				return xDef;
			}
		}
		return xDef;
	};

	Cache.remove = function (sKey) {
		var sKey = sNameSpace + sKey.toString();
		if (localStorage.getItem(sKey)) {
			return localStorage.removeItem(sKey);
		}
		return false;
	};


	Can.util.Cache = Cache;
})(Can);

/**
 * 检测C币开关
 * @param fCallback
 * true: 开启
 */
(function (Can) {
	var aCallbackList = [], isSending = false;
	Can.util.isCcoinOpened = function (fCallback) {

		if (typeof fCallback !== 'function') {
			return;
		}

		aCallbackList.push(fCallback);

		if (true === isSending) {
			return;
		}

		var cacheResult = Can.util.Cache.get("Can.util.isCcoinOpened", null);

		if (null === cacheResult) {
			$.ajax({
				url: Can.util.Config.checkCcoinOpened,
				cache: false,
				beforeSend: function () {
					isSending = true;
				},
				complete: function () {
					isSending = false;
				},
				success: function (jData) {
					cacheResult = jData.data;
					Can.util.Cache.set("Can.util.isCcoinOpened", cacheResult, 5000);
					$.each(aCallbackList, function (k, func) {
						func(cacheResult);
					});
					aCallbackList = [];
				}
			});
		} else {
			$.each(aCallbackList, function (k, func) {
				func(cacheResult);
			});
			aCallbackList = [];
		}

	}
})(Can);

/**
 * 根据采购商动态类型，返回对应的icon样式
 * @param int nActionType 采购商动态类型
 */
(function (Can) {
	Can.util.getActivityIcon = function (nActionType) {
		nActionType = parseInt(nActionType, 10);

		if (!isNaN(nActionType)) {
			switch (nActionType) {
				case 1:
				case 11:
					return "icons fave";
				case 2:
				case 12:
					return "icons fave-info";
				case 3:
				case 13:
					return "icons view-com";
				case 4:
				case 14:
					return "icons view-pro";
				case 5:
				case 15:
					return "icons inquire-2";
				case 7:
					return "icons love";
				case 18:
					return "icons find";
				case 19:
					return "icons demand";
				case 20:
					return "icons courier";
				default:
					return "";

			}
		}

	};
})(Can);

/**
 * 判断是否中文
 * @Author: lvjw
 * @Version: 1.0
 * @Update: 14-01-28
 * @param {String} sValue 需判断字符串
 */
Can.util.isChinese = function (sValue) {
	var chineseRe = /.*[\u4e00-\u9fa5\u3000-\u303F\uff00-\uffef]+.*$/;
	return chineseRe.test(sValue) || sValue.indexOf('“') != -1 || sValue.indexOf('”') != -1;
}
