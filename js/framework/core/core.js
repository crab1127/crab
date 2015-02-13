/**
 * 定义ELI基础JS类库。
 * @author Island
 * @since 2013-01-08
 * @version 1.0_beta
 */

Can = {
	version:'1.0_beta' //define the version
	,date:'2013-01-08' //define the date of the version
};

/** 
 * 兼容 jquery 1.10
 */
if( !jQuery.browser ){
    var uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    var matched = uaMatch( navigator.userAgent );
	var browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;
}

/**
 * 基础继承方法，用以替换Jquery.extend，支持Can的监听者核心类库<br/>
 * 将源对象(c)的属性copy至目标对象(o)中去
 * @param {Object} o
 * @param {Object} c
 * @param {Object} [defaults]
 */
Can.apply = function(o, c, defaults){
    if(defaults){
        Can.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

(function(){
	Can.apply(Can, {
		 /**
		  * 创建一个namespace<br/>
		  * 对于不同的功能、模块，我们需要按照不同包来进行划分，比如：Can.util, Can.search等
		  */
		 namespace : function(){
            var a=arguments, o=null, i, j, d, rt;
            for (i=0; i<a.length; ++i) {
                d=a[i].split(".");
                rt = d[0];
                eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
                for (j=1; j<d.length; ++j) {
                    o[d[j]]=o[d[j]] || {};
                    o=o[d[j]];
                }

            }
        }
		/**
		 * Can空函数，用于某些不许要做任何动作但onChange是又不能出现null异常的逻辑处理
		 */
		,emptyFn : function(){}
		/**
		 * 继承基础方法，用于支持Can事件机制
		 */
		,extend : function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(typeof sp == 'object'){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){}, sbp, spp = sp.prototype;
                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Can.override(sb, o);
                };
                sbp.override = io;
                Can.override(sb, overrides);
                sb.extend = function(o){Can.extend(sb, o);};
                return sb;
            };
        }()
		/**
		 * 使用子类属性覆盖父类属性，之后父类portotype会被子类相同名称的覆盖，其他的属性保持不变,
		 * 子类不会发生变化
		 * @param {Object} origclass	父类
		 * @param {Object} overrides	子类
		 */
		,override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                for(var method in overrides){
                    p[method] = overrides[method];
                }
   
                if(jQuery.browser.msie && overrides.toString != origclass.toString){
                    p.toString = overrides.toString;
                }
            }
        }
	})
})();

/**
 * 创建三个默认系统类包：<br/>
 * <strong>Can.util</strong>
 * 		   系统通用类库包
 * <strong>Can.vo</strong>
 * 		   系统值对象包
 * <strong>Can.event</strong>
 * 		   系统事件管理包
 */
Can.namespace('Can.util','Can.vo','Can.event','Can.ui','Can.ui.toolbar', 'Can.action','Can.view', 'Can.module');

