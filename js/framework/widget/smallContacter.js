/**
 * Small Contacter
 * @Author: Mary June
 * @Version: 1.2
 * @Since: 13-4-12
 */

Can.ui.smallContacter = Can.extend(Can.ui.BaseUI, {
	isSelected: true,
	data: {
		id: 0,
		img: 'about:blank',
		title: '',
		countryId: 0,
		countryName: ''
	},
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.smallContacter.superclass.constructor.call(this);
		this.addEvents('ON_CLICK');
	},
	initUI: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.cssName);
		var _pic = $('<div class="pic"></div>');
		this.image = $('<img />');
		_pic.append(this.image);
		var _info = $('<div class="info"></div>');
		this.title = $('<p class="name" autoCut="11"></p>');
		this.country = $('<p class="country"></p>');
		_info.append(this.title);
		_info.append(this.country);
		this.el.append(_pic);
		this.el.append(_info);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.el.click(function () {
			_this.isSelected = !_this.isSelected;
			//first argument must product data object.
			_this.fireEvent('ON_CLICK', _this.data, _this.el, _this.isSelected);
		});
	},
	update: function (jData) {
		var _data = jData || this.data;
		var _src = Can.util.formatImgSrc(_data.img, 32, 32);
		var _src_arr = _src.replace('"', '').split(' ');
		if (_src_arr.length > 1) {
			_src = _src_arr[0];
			this.image.addClass(_data.gender === 1 ? ' placeholder male' : 'placeholder female');
		}
		this.image.attr({
			'src': _src,
			'alt': _data.title,
			'width': 32,
			'height': 32
		});
		this.title.html(_data.title);
		this.country.html('<span class="flags fs' + _data.countryId + '"></span><span class="txt">' + _data.countryName + '</span>');
		Can.util.EventDispatch.dispatchEvent('ON_NEW_UI_APPEND', this.el);
	},
	hide: function () {
		this.el.hide();
	},
	show: function () {
		this.el.show();
	}
});