/**
 * Can toolbar button
 * @author Island 2012-0217
 */

Can.ui.toolbar.Button = Can.extend(Can.ui.BaseUI, {
	/**
	 * 按钮的名称，接受HTML写法
	 */
	text: '',
	/**
	 * 按钮变灰时的css样式名
	 */
	disableClass: 'dis',
	/**
	 * 默认是否可见
	 */
	visibility: true,
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.ui.toolbar.Button.superclass.constructor.call(this);
		this.addEvents('onclick', 'onmouseover', 'onmouseout');
	},
	initUI: function () {
		var _elHtml = '<a href="javascript:;"></a>';
		var _el = $(_elHtml);

		_el.text(this.text);
		if (!this.visibility)
			_el.hide();
		this.cssName && _el.attr('class', this.cssName);
		this.id && _el.attr('id', this.id);
		this.el = _el;
		this.bindEvents();
	},
	/**
	 * 更新button中的HTML内容
	 */
	updateHtml: function (html) {
		if (html) {
			this.el.html(html);
		}
	},
	updateCss: function (cssName) {
		if (cssName) {
			this.el.attr('class', cssName);
		}
	},
	/**
	 * 点击按钮事件
	 * @param {Object} fn
	 * @param {Object} [scope]
	 */
	click: function (fn, scope) {
		if (typeof fn == 'function') {
			this.on('onclick', fn, scope || this);
		}
	},
	mouseout: function (fn, scope) {
		if (typeof fn == 'function') {
			this.on('onmouseout', fn, scope || this);
		}
	},
	mouseover: function (fn, scope) {
		if (typeof fn == 'function') {
			this.on('onmouseover', fn, scope || this);
		}
	},
	hide: function () {
		this.el.hide();
	},
	show: function () {
		this.el.show();
	},
	/**
	 * 使按钮失效，同时去除绑定的事件
	 */
	disable: function () {
		this.el.addClass(this.disableClass);
		this.el.unbind('click');
		this.el.unbind('mouseout');
		this.el.unbind('mouseover');
		this.initEvents = false;
	},
	/**
	 * 启用按钮，同时恢复事件
	 */
	enable: function () {
		this.el.removeClass(this.disableClass);
		this.bindEvents();
	},
	/**
	 * Button私有方法，禁止外部调用
	 */
	bindEvents: function () {
		if (!this.initEvents) {
			var me = this;
			this.el.bind('click', function (event) {
				me.fireEvent('onclick', event);
			});
			this.el.bind('mouseover', function (event) {
				me.fireEvent('onmouseover', event);
			});
			this.el.bind('mouseout', function (event) {
				me.fireEvent('onmouseout', event);
			});
			this.initEvents = true;
		}
	}
});

/**
 * 顶部一级菜单按钮类
 */
Can.ui.toolbar.ModuleMenuButton = Can.extend(Can.ui.toolbar.Button, {
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.ui.toolbar.ModuleMenuButton.superclass.constructor.call(this);
	},
	initUI: function () {
		var _elHtml = '<a  href="javascript:;"></a>';
		var _el = $(_elHtml);
		_el.attr('title', this.text);
		_el.attr('id', this.id);
		var _demoEl = $('<span class="ico"></span>');
		if (this.cssName && this.cssName != '') {
			_demoEl.attr('class', this.cssName);
		}
		_demoEl.appendTo(_el);
		this.el = _el;
		this.bindEvents();
	},
	/**
	 * 更新按钮的文字
	 */
	updateText: function (txt) {
		this.el.attr('title', txt);
	}
});

/**
 * 功能模块快捷方式 按钮
 */
Can.ui.toolbar.FunctionShortcutMenuButton = Can.extend(Can.ui.toolbar.Button, {
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.ui.toolbar.FunctionShortcutMenuButton.superclass.constructor.call(this);
	},
	initUI: function () {
		var _elHtml = '<a  href="javascript:;"></a>';
		var _el = $(_elHtml);
		_el.attr('id', this.id);
		var _demoEl = $('<span class="ico"></span>');
		if (this.cssName && this.cssName != '') {
			_demoEl.attr('class', this.cssName);
		}
		_demoEl.appendTo(_el);

		this.titleEl = $('<strong>' + this.text + '</strong>');
		this.titleEl.appendTo(_el);
		this.el = _el;
		this.bindEvents();
	},
	/**
	 * 更新按钮的文字
	 */
	updateText: function (txt) {
		this.titleEl.text(txt);
	}
});

/**
 * 数据标识按钮
 */
Can.ui.toolbar.dataIdentButton = Can.extend(Can.ui.toolbar.Button, {
	total: 0,
	tips: '',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.toolbar.dataIdentButton.superclass.constructor.call(this);
	},
	initUI: function () {
		var _this = this;
		_this.el = $('<dl></dl>');
		_this.icon = $('<dd></dd>');
		_this.icon.addClass(_this.cssName);
		_this.word = $('<dt class="txt1"></dt>');
		// _this.btn = $('<a href="javascript:;"><span>' + Can.msg.BUTTON['DATA_IDENT']['ITEM'] + '</span><br />' + _this.text + '</a>');
		_this.btn = $('<a href="javascript:;">' + _this.text + '</a>');
		_this.num = $('<strong>' + this.total + '</strong>');
		_this.btn.prepend(_this.num);
		_this.word.append(_this.btn);

		_this.el.append(_this.icon);
		_this.el.append(_this.word);
		_this.btn.click(function () {
			_this.fireEvent('onclick', _this);
		});
		if (!!_this.tips) {
			_this.tipsLayout = $('<dd class="tips-s6 has-arrow arrow-up">' + _this.tips + '</dd>');
			_this.tipsLayout.hide();
			_this.btn.hover(function () {
				_this.tipsLayout.show();
			}, function () {
				_this.tipsLayout.hide();
			});
			_this.el.append(_this.tipsLayout);
		}
	},
	updateText: function (sTxt) {
		this.num.text(sTxt);
	}
});
/**
 * 带ICON的按钮
 */
Can.ui.toolbar.iconButton = Can.extend(Can.ui.toolbar.Button, {
	iconCss: '',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.toolbar.iconButton.superclass.constructor.call(this);
	},
	initUI: function () {
		Can.ui.toolbar.iconButton.superclass.initUI.call(this);
		this.icon = $('<i class="' + this.iconCss + '"></i>');
		this.el.prepend(this.icon);
	}
});
