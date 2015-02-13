/**
 * Window UI
 * @Author: AngusYoung
 * @Version: 2.4
 * @Update: 13-4-19
 */

Can.ui.BaseWindow = Can.extend(Can.ui.BaseUI, {
	isModal: false,
	isModal2: false,
	isFixed: true,
	isFullScreen: false,
	isMovable: false,
	isDisabled: false,
	hasFade: false,
	hasCloser: true,
	hasBorder: false,
	hasRadius: false,
	closeAction: 'destroy',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.BaseWindow.superclass.constructor.call(this);
		this.addEvents('ON_CLOSE', 'ON_SHOW');
	},
	initUI: function () {
		var _this = this;
		_this.el = $('<div class="ui-win"></div>');
		this.el.addClass(this.cssName);
		this.el.css({
			top: '-10000em'
		});
		if (_this.isModal) {
			_this.maskEl = $('<div class="win-mask"></div>');
		}
		if(_this.isModal2){
			_this.maskEl = $('<div class="win-mask2"></div>');
		}
		_this.isMovable && (_this.isFixed = false);
		if (_this.isFixed) {
			_this.isFullScreen = false;
			_this.el.css('position', 'fixed');
		}
		_this.hasBorder && _this.el.addClass('has-border');
		_this.hasRadius && _this.el.addClass('has-radius');
		if (_this.hasCloser) {
			_this.closer = $('<a class="win-close"></a>');
			_this.el.append(_this.closer);
		}
		_this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		if (_this.isMovable) {
			_this.el.delegate('div.win-tit', 'mousedown', function (event) {
				var _x = event.clientX;
				var _y = event.clientY;
				var _top = _this.el[0].offsetTop;
				var _left = _this.el[0].offsetLeft;
				$(document.body).unbind('mousemove').bind('mousemove', function (event) {
					var _X = event.clientX;
					var _Y = event.clientY;
					var _diff_x = _X - _x;
					var _diff_y = _Y - _y;
					_this.el.css({
						top: _top + _diff_y,
						left: _left + _diff_x
					});
				});
				$(document.body).unbind('mouseup').bind('mouseup', function () {
					$(this).unbind('mousemove');
				});
			});
		}
		$(window).bind('resize', function () {
			_this.rePosition();
		});
	},
	bindCloser: function () {
		var _this = this;
		if (_this.closer) {
			_this.closer.unbind('click').click(function () {
				if (_this.beforeClose()) {
					_this.close();
				}
			});
		}
	},
	updateCss: function (jCss) {
		jCss && this.el.css(jCss);
	},
	toggleFullScreen: function (bFull) {
		bFull = bFull || this.isFullScreen;
		if (bFull) {
			$('html').css('overflow-y', 'hidden');
		}
		else {
			$('html').removeAttr('style');
		}
	},
	rePosition: function () {
		if (!this.isDisabled) {
			var _Top, _Left;
			var _Width = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
			var _Height = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
			if (this.isFixed) {
				_Top = Math.max(document.documentElement.clientHeight / 2 - this.el.height() / 2, 0);
				_Left = Math.max(document.documentElement.clientWidth / 2 - this.el.width() / 2, 0);
			}
			else {
				_Top = Math.max(document.documentElement.clientHeight / 2 - this.el.height() / 2 + _Height, _Height);
				_Left = Math.max(document.documentElement.clientWidth / 2 - this.el.width() / 2 + _Width, 0);
			}
			this.el.css({
				'top': _Top,
				'left': _Left
			});
			return this.el;
		}
	},
	show: function () {
		var _this = this;
		_this.isDisabled = false;
		_this.toggleFullScreen();
		_this.maskEl && _this.maskEl.appendTo('body').show();
		_this.bindCloser();
		_this.el.appendTo('body');
		_this.rePosition().hide();
		if (this.hasFade) {
			_this.el.fadeIn(100);
		}
		else {
			this.el.show();
		}
		_this.fireEvent('ON_SHOW', _this);
	},
	beforeClose: function () {
		return true;
	},
	close: function () {
		var _this = this;
		_this.isDisabled = true;
		_this.toggleFullScreen();
		//默认为destroy，关闭时直接销毁对象
		if (_this.closeAction === 'hide') {
			if (_this.hasFade) {
				_this.el.fadeOut();
			}
			else {
				_this.hide();
			}
		}
		else {
			if (_this.hasFade) {
				_this.el.fadeOut(function () {
					_this.destroy();
				});
			}
			else {
				_this.destroy();
			}
		}
		_this.fireEvent('ON_CLOSE', _this);
	},
	hide: function () {
		this.maskEl && this.maskEl.hide();
		this.el.hide();
	},
	destroy: function () {
		this.maskEl && this.maskEl.remove();
		this.el.remove();
	}
});
