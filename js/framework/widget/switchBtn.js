/**
 * Switch Button
 * @Author: Mary June
 * @Version: 2.1
 * @Update: 13-2-28
 */

Can.ui.switchBtn = Can.extend(Can.ui.BaseUI, {
	//right is ON
	isON:false,
	text:[],
	constructor:function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.switchBtn.superclass.constructor.call(this);
		this.addEvents('ON_CHANGE');
	},
	initUI:function () {
		this.el = $('<div class="ui-switch"></div>');
		this.el.addClass(this.cssName);
		this.el.css('width', this.width);

		this.inner = $('<div></div>');
		this.turnBtn = $('<a class="turn-btn"></a>');
		this.inner.append('<span class="item">' + this.text[0] + '</span>');
		this.inner.append(this.turnBtn);
		this.inner.append('<span class="item">' + this.text[this.text.length - 1] + '</span>');
		this.inner.appendTo(this.el);
		this.inner.css({
			marginLeft:this.isON ? -this.el.width() : 0,
			width:this.width * 2,
			height:'100%'
		});
		this.bindEvents();
	},
	bindEvents:function () {
		var _this = this;
		_this.el.click(function () {
			_this.isON = !_this.isON;
			_this.animate(function () {
				_this.fireEvent('ON_CHANGE', _this.isON);
			});
		});
	},
	animate:function (fFn) {
		this.inner.animate({
			marginLeft:this.isON ? -this.el.width() : 0
		}, fFn);
	},
	onChange:function (fFn) {
		if (typeof fFn === 'function') {
			this.on('ON_CHANGE', fFn);
		}
	},
	click:function () {
		//fuck off, nothing doing at here.
	}
});