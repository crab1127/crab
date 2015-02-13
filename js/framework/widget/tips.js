/**
 * Tips UI
 * @Author: AngusYoung
 * @Version: 1.5
 * @Update: 13-6-27
 */

Can.ui.tips = Can.extend(Can.ui.BaseUI, {
	hasArrow: true,
	hasWaiting: false,
	hasFade: false,
	arrowIs: 'X',
	isOpposite: false,
	mainCss: 'list',
	arrowCss: '',
	width: 0,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.tips.superclass.constructor.call(this);
		this.addEvents('ON_SHOW', 'ON_HIDE', 'ON_UPDATE_CONTENT');
	},
	initUI: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.cssName);
		if (this.width) {
			this.el.css('width', this.width);
		}
		this.main = $('<div></div>');
		this.main.addClass(this.mainCss);
		this.main.appendTo(this.el);
		if (this.hasArrow) {
			this.arrow = $('<span class="bg-ico"></span>');
			this.arrow.addClass(this.arrowCss);
			this.arrow.appendTo(this.el);
		}
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		Can.util.EventDispatch.on('ON_PAGE_CLICK', function (event) {
			if (!$.contains(_this.el[0], event.target)) {
				_this.hide();
			}
		});
	},
	updateContent: function (xCont, bAdd, sLoad) {
		if (typeof bAdd === 'string') {
			sLoad = bAdd;
			bAdd = false;
		}
		!bAdd && this.clear();
		this.main.append(xCont);
		if (sLoad !== 'load') {
			this.fireEvent('ON_UPDATE_CONTENT');
		}
	},
	updateCss: function (jCss) {
		this.el.css(jCss);
	},
	show: function () {
		this.el.appendTo('body').hide().stop().fadeIn('slow');
		if (this.hasWaiting) {
			this.updateContent('<div class="loading"><span></span></div>', 'load');
		}
		this.fireEvent('ON_SHOW');
	},
	hide: function (bClear) {
		bClear && this.clear();
		this.el.stop().fadeOut();
		this.fireEvent('ON_HIDE');
	},
	clear: function () {
		this.main.empty();
	},
	remove: function () {
		this.el.remove();
	}
});

/**
 * text-bar tips
 * @Author: AngusYoung
 * @Version: 2.2
 * @Update: 13-6-24
 */

Can.ui.barTips = Can.extend(Can.ui.tips, {
	iconCss: 'ico',
	hasClose: true,
	target: null,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.barTips.superclass.constructor.call(this);
	},
	initUI: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.cssName);
		this.icon = $('<span></span>');
		this.icon.addClass(this.iconCss);
		this.main = $('<p class="des"></p>');
		this.closer = $('<a href="javascript:;" class="btn-close">X</a>');
		this.el.append(this.icon);
		this.el.append(this.main);
		this.hasClose && this.el.append(this.closer);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		this.closer.click(function () {
			_this.el.slideUp(function () {
				_this.hide();
			});
		});
	},
	show: function () {
		this.el.insertAfter(this.target).slideDown();
	}
});

/**
 * text tips
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-3-12
 * 本widget建议单例调用，无必要请保持id的不变
 */

Can.ui.textTips = Can.extend(Can.ui.tips, {
	id: 'textTipsId',
	cssName: 'text-tips',
	text: 'Hello world',
	target: null,
	hasIcon: false,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.textTips.superclass.constructor.call(this);
	},
	initUI: function () {
		if ($('#' + this.id).length) {
			this.el = $('#' + this.id);
		}
		else {
			this.el = $('<div id="' + this.id + '"></div>');
			this.el.addClass(this.cssName);
			$(document.body).append(this.el);
			this.el.hide();
		}
		this.update(this.text);
	},
	updateProperty: function (jCfg) {
		Can.apply(this, jCfg || {});
	},
	update: function (sContent) {
		this.el.empty();
		//set icon
		if (this.hasIcon) {
			this.icon = $('<span class="' + this.iconCss + '"></span>');
			this.icon.prependTo(this.el);
		}
		else {
			this.icon && this.icon.hide();
		}
		//set arrow
		if (this.hasArrow) {
			this.el.addClass('has-arrow');
		}
		else {
			this.el.removeClass('has-arrow');
		}
		//set content
		this.el.append(sContent);
	},
	show: function () {
		var jCss;
		var _n = 0;
		this.el.show();
		if (this.arrowIs === 'X') {
			_n = 1
		}
		else {
			_n = 3
		}
		this.isOpposite && (_n += 1);
		this.el.removeClass('arrow-left arrow-right arrow-up arrow-down');
		switch (_n) {
			case 1:
				//tips at right
				jCss = {
					top: this.target.offset().top + this.target.innerHeight() / 2 - this.el.innerHeight() / 2,
					left: this.target.offset().left + this.target.innerWidth() + 5
				};
				this.el.addClass('arrow-left');
				break;
			case 2:
				//tips at left
				jCss = {
					top: this.target.offset().top + this.target.innerHeight() / 2 - this.el.innerHeight() / 2,
					left: this.target.offset().left - this.el.innerWidth() - 8
				};
				this.el.addClass('arrow-right');
				break;
			case 3:
				//tips at down
				jCss = {
					top: this.target.offset().top + this.target.innerHeight() + 8,
					left: this.target.offset().left - 5
				};
				this.el.addClass('arrow-up');
				break;
			case 4:
				//tips at up
				jCss = {
					top: this.target.offset().top - this.el.innerHeight() - 8,
					left: this.target.offset().left - 5
				};
				this.el.addClass('arrow-down');
		}
		this.el.css(jCss);
		this.el.hide();

        // 修复z-index比主体小而导致看不了的问题
        var targetZIndex = this.target.css('z-index');
        if (targetZIndex != 'auto') {
            if (typeof targetZIndex != 'number') {
                targetZIndex = parseInt(targetZIndex);
            }
            this.el.css('z-index', targetZIndex + 1);
        }

		if (this.hasFade) {
			this.el.fadeIn();
		}
		else {
			this.el.show();
		}
	},
	hide: function () {
		//fadeOut 会出现一闪一闪小星星现状，会直接隐藏
		return this.el.hide();

		if (this.hasFade) {
			this.el.fadeOut();
		}
		else {
			this.el.hide();
		}
	}
});
