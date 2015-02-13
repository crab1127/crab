/**
 * 定义Can前端事件。
 * @author Island
 * @since 2013-01-08
 *
 */

/**
 * 系统事件机制基础类。
 * 当需要支持对象与对象之间，所有子类需要继承此父类。
 * @author Island
 * @version 1.0
 */
Can.event.Observable = function(){
	if(this.listeners){
        this.on(this.listeners);
        delete this.listeners;
    }
}

Can.event.Observable.prototype = {
	
	filterOptRe : /^(?:scope|delay|single)$/,
    eventsSuspended:false,//是否挂起
	/**
	 * 触发某个事件
	 */
	fireEvent : function(){
		if(this.eventsSuspended !== true){
            var ce = this.events[arguments[0].toLowerCase()];
            if(typeof ce == "object"){
                return ce.fire.apply(ce, Array.prototype.slice.call(arguments, 1));
            }
        }
        return true;	
	}
	/**
	 * 添加一个监听器，此方法等价于 on
	 * @param {Object} eventName String	事件名称，
	 * @param {Object} fn Object 处理事件的函数
	 * @param {Object} scope
	 * @param {Object} o
	 */
	,addListener : function(eventName, fn, scope, o){
        if(typeof eventName != "string")
			return;
        o = (!o || typeof o == "boolean") ? {} : o;
        eventName = eventName.toLowerCase();
        var ce = this.events[eventName] || true;
        if(typeof ce == "boolean"){
            ce = new Can.util.Event(this, eventName);
            this.events[eventName] = ce;
        }
        ce.addListener(fn, scope, o);
    }
    ,removeListener : function(eventName, fn, scope){
        var ce = this.events[eventName.toLowerCase()];
        if(typeof ce == "object"){
            ce.removeListener(fn, scope);
        }
    }
    /**
     * 检查当前是否已经对某个事件绑定了监听器
     * @param {String} eventName 要检查的事件名
     * @return {Boolean} True 此事件已经被静听
     */
   ,hasListener : function(eventName){
        var e = this.events[eventName];
        return typeof e == "object" && e.listeners.length > 0;
    }

    /**
     * Suspend the firing of all events. (see {@link #resumeEvents})
     */
    ,suspendEvents : function(){
        this.eventsSuspended = true;
    }

	/**
	 * 增加一个事件
	 * @param {String} o 事件名称，字符串类型
	 */
	,addEvents : function(o){
        if(!this.events){
            this.events = {};
        }
        if(typeof o == 'string'){
            for(var i = 0, a = arguments, v; v = a[i]; i++){
                if(!this.events[a[i]]){
                    this.events[a[i]] = true;
                }
            }
        }
		return false;
    }
}

Can.event.Observable.prototype.on = Can.event.Observable.prototype.addListener;

(function(){
    var createSingle = function(h, e, fn, scope){
        return function(){
            e.removeListener(fn, scope);
            return h.apply(scope, arguments);
        };
    };

    var createDelayed = function(h, o, scope){
        return function(){
            var args = Array.prototype.slice.call(arguments, 0);
            setTimeout(function(){
                h.apply(scope, args);
            }, o.delay || 10);
        };
    };

	/**
	 * Can事件机制辅助类
	 * @param {Object} obj
	 * @param {Object} name
	 */
    Can.util.Event = function(obj, name){
        this.name = name;
        this.obj = obj;
        this.listeners = [];
    };

    Can.util.Event.prototype = {
        addListener : function(fn, scope, options){
            scope = scope || this.obj;
            if(!this.isListening(fn, scope)){
                var l = this.createListener(fn, scope, options);
                if(!this.firing){
                    this.listeners.push(l);
                }else{ // if we are currently firing this event, don't disturb the listener loop
                    this.listeners = this.listeners.slice(0);
                    this.listeners.push(l);
                }
            }
        },

        createListener : function(fn, scope, o){
            o = o || {};
            scope = scope || this.obj;
            var l = {fn: fn, scope: scope, options: o};
            var h = fn;
            if(o.delay){
                h = createDelayed(h, o, scope);
            }
            if(o.single){
                h = createSingle(h, this, fn, scope);
            }
            l.fireFn = h;
            return l;
        },

        findListener : function(fn, scope){
            scope = scope || this.obj;
            var ls = this.listeners;
            for(var i = 0, len = ls.length; i < len; i++){
                var l = ls[i];
                if(l.fn == fn && l.scope == scope){
                    return i;
                }
            }
            return -1;
        },

        isListening : function(fn, scope){
            return this.findListener(fn, scope) != -1;
        },

        /**
         * 移除某个事件的某个监听器fn，当fn未指定的时候，则移除此事件的所有监听器
         * @param fn
         * @param scope
         */
        removeListener : function(fn, scope){
            var index;
            if(typeof fn == 'undefined'){
                 this.clearListeners();
            }
            else if((index = this.findListener(fn, scope)) != -1){
                if(!this.firing){
                    this.listeners.splice(index, 1);
                }else{
                    this.listeners = this.listeners.slice(0);
                    this.listeners.splice(index, 1);
                }
                return true;
            }

            return false;
        },

        clearListeners : function(){
            this.listeners = [];
        },

		/**
		 * 执行事件处理函数
		 */
        fire : function(){
            var ls = this.listeners, scope, len = ls.length;
            if(len > 0){
                this.firing = true;
                var args = Array.prototype.slice.call(arguments, 0);
                for(var i = 0; i < len; i++){
                    var l = ls[i];
                    if(l.fireFn.apply(l.scope||this.obj||window, arguments) === false){
                        this.firing = false;
                        return false;
                    }
                }
                this.firing = false;
            }
            return true;
        }
    };
})();
