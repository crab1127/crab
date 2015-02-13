/**
 * Percent bar
 * @Author: AngusYoung
 * @Version: 1.1
 * @Update: 13-1-31
 */

Can.ui.percentBar = Can.extend(Can.ui.BaseUI, {
	css:'progress-bar',
	value:0,
	constructor:function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.percentBar.superclass.constructor.call(this);
		this.addEvents('ON_UPDATE');
	},
	initUI:function () {
		this.el = $('<div></div>');
		this.el.addClass(this.css);
		this.numer = $('<span class="num">' + this.value + '%</span>');
		this.bar = $('<div class="scale" style="width:' + this.value + '%;"></div>');

		this.numer.appendTo(this.el);
		this.bar.appendTo(this.el);
	},
	update:function (nNum) {
		var _this = this;
		if (!isNaN(parseInt(nNum, 10))) {
			_this.value = parseInt(nNum, 10);
		}
		_this.bar.animate({
			width:_this.value + '%'
		}, {
			speed:'fast',
			step:function () {
				_this.numer.text(Math.round($(this).width() / _this.el.width() * 100) + '%');
			},
			complete:function () {
				_this.numer.text(_this.value + '%');
				_this.fireEvent('ON_UPDATE', _this);
			}
		});
	}
});