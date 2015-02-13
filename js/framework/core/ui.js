/**
 * 定义了Can UI底层对象，子类需要实现以下方法：
 * initUI  初始化界面元素
 * @author Island 2012-02-15
 */

Can.ui.BaseUI = Can.extend(Can.event.Observable,{
	constructor: function(config){
		Can.apply(this, config || {});
        Can.importJS(this.requireUiJs);
        Can.importJS(this.actionJs);
		Can.ui.BaseUI.superclass.constructor.call(this);
		this.addEvents('onapply','oninit');
		this.init();
	}
    /**
     * ID，可以是DOM的ID也可以用来标示当前instance的ID
     */
    ,id:''
    ,cssName:''
	,el:null
    /**
     *  依赖的UI JS文件,假如是widget则不需要动态导入
     */
    ,requireJS:[]
    /**
     * 对应的action JS
     */
    ,actionJs:[]
	/**
	 * 获取此UI的document元素，返回Jquery对象。
	 * 假如有需要，子类可以覆盖此方法。
	 */
	,getDom:function(){
		return this.el;
	}
	/**
	 * 返回当前UI的ID
	 */
	,getId:function(){
        return this.id;
    }
	/**
	 * 初始化UI，完成之后将触发
	 * oninit
	 * 事件
	 */
	,init:function(){
		this.initUI();
		this.fireEvent('oninit', this);
	}
	/**
	 * 初始化界面元素
	 * @param {Object} obj
	 */
	,initUI:Can.emptyFn
	/**
	 * 将此UI渲染到某个元素。
	 * 调用此方法将会触发：onapply 事件
	 * @param {Object} obj ID或者jquery对象
	 */
	,applyTo:function(obj){
		var _container = null;
		if(typeof obj == 'string')
			_container = $('#' + obj);
		else
			_container = $(obj)
		if(_container.length > 0){
			var _el = $(this.getDom());
			if (_el) {
				_container.append(_el);
				this.fireEvent('onapply', _el, _container);
			}
		}
	}
});
