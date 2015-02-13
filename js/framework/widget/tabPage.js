/**
 * TabPage
 * @Author: AngusYoung
 * @Version: 1.5
 * @Since: 13-7-24
 */

Can.ui.tabPage = Can.extend(Can.ui.BaseUI, {
	tabData: [],
	pageData: [],
	isNotAnimate: false,
	isCache: false,
	currentIndex: 0,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.tabPage.superclass.constructor.call(this);
		this.addEvents('ON_SWITCH');
	},
	initUI: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.cssName);

		this.tabWrap = $('<div></div>');
		this.tabWrap.addClass(this.tabCss);
		this.tabInner = $('<ul></ul>');
		this.tabInner.addClass(this.innerCss);
		this.tabInner.appendTo(this.tabWrap);

		this.pageWrap = $('<div></div>');
		this.pageWrap.addClass(this.pageCss);

		this.el.append(this.tabWrap);
		this.el.append(this.pageWrap);

		this.addData();
		this.bindEvent();
		this.resize();
	},
	bindEvent: function () {
		var _this = this;
		_this.tabInner.delegate('li', 'click', function () {
			if (!$(this).hasClass('cur')) {
				var nIndex = $(this).attr('tpindex');
				_this.showTab(nIndex);
			}
		});
	},
	addData: function () {
		var aTab = this.tabData;
		var aPage = this.pageData;
		var i;
		for (i = 0; i < aTab.length; i++) {
			this.tabInner.append('<li' + (this.itemCss ? ' id="' + this.itemCss + (i + 1) + '"' : '') + ' tpindex="' + i + '">' + aTab[i] + '</li>');
		}
		for (i = 0; i < aPage.length; i++) {
			if (aPage[i] instanceof Can.ui.BaseUI) {
				this.pageWrap.append(aPage[i].el);
			}
			else {
				this.pageWrap.append(aPage[i]);
			}
		}
		this.pageWrap.children(':first').show();
	},
	resize: function () {
		var _aLi = this.tabInner.children('li');
		var _wid = 0;
		_aLi.each(function (index) {
			index === 0 && $(this).addClass('cur');
			_wid += $(this).outerWidth(true);
		});
		this.tabInner.css('width', _wid || null);
	},
	showTab: function (nIndex) {
		var _this = this;
		if (_this.currentIndex !== nIndex || !_this.isCache) {
			_this.tabInner.children('li').removeClass('cur').eq(nIndex).addClass('cur');
			if (_this.isNotAnimate) {
				_this.pageWrap.children().hide().eq(nIndex).show();
			}
			else {
				_this.pageWrap.children().slideUp().eq(nIndex).slideDown();
			}
			_this.currentIndex = nIndex;
			_this.fireEvent('ON_SWITCH', _this.pageWrap.children().eq(nIndex), nIndex);
		}
	},
	length: function () {
		return this.tabData.length;
	}
});