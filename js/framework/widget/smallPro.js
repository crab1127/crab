/**
 * Small Product
 * @Author: Mary June
 * @Version: 1.1
 * @Update: 13-4-8
 */

Can.ui.smallPro = Can.extend(Can.ui.BaseUI, {
	isSelected: true,
	data: {
		id: 0,
		img: 'about:blank',
		title: ''
	},
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.smallPro.superclass.constructor.call(this);
		this.addEvents('ON_CLICK');
	},
	initUI: function () {
		var _this = this;
		_this.el = $('<div></div>');
		_this.el.addClass(_this.cssName);
		_this.image = $('<img />');
		_this.title = $('<p class="name"></p>');
		_this.el.append(_this.image);
		_this.el.append(_this.title);
		_this.el.click(function () {
			_this.isSelected = !_this.isSelected;
			//first argument must product data object.
			_this.fireEvent('ON_CLICK', _this.data, _this.el, _this.isSelected);
		});
	},
	update: function (jData) {
		var _data = jData || this.data;
		this.image.attr({
			'src': Can.util.formatImgSrc(_data.img, 120, 120),
			'alt': _data.title
		});
		this.title.html(_data.title);
	},
	hide: function () {
		this.el.hide();
	},
	show: function () {
		this.el.show();
	}
});