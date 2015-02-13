/**
 * 提供一个简易的Panel，供内容展示。
 * 抛弃复杂的layout概念，所有的Panel内的东西，都需要开发者自己
 * 根据实际情况编写css
 * @author Island
 * @since 2012-01-16
 */
Can.ui.Panel = Can.extend(Can.ui.BaseUI, {
	/**
	 * 默认的，我们都使用DIV作为panel HTML的元素。
	 * 开发者可以自己指定此属性进行改变。
	 */
	wrapEL: 'div',
	html: ''//内容
	,
	items: [],
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.ui.Panel.superclass.constructor.call(this);
		this.addEvents('onadditem', 'onclick');
	},
	initUI: function () {
		var _html = '<' + this.wrapEL + '></' + this.wrapEL + '>';
		var _el = $(_html);
		this.cssName && _el.addClass(this.cssName);
		this.id && _el.attr('id', this.id);
		if (this.html != '')
			_el.html(this.html);

		var me = this;
		_el.click(function () {
			me.fireEvent('onclick', me);
		});

		this.el = _el;
		if (this.items && this.items.length > 0) {
			for (var i = 0; i < this.items.length; i++) {
				this.addItem(this.items[i]);
			}
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
	/**
	 * 改变panel内部的内容
	 * @param {String} _html
	 */
	update: function (_html) {
		var _el = this.el;
		_el.html(_html);
	},
	/**
	 * 往Panel里面加入一个物件，必须要是Can.ui.BaseUI的子类
	 * 此方法会触发 <strong>onadditem</strong> 事件
	 * @param {Can.ui.BaseUI|String|Array|Object} item
	 */
	addItem: function (item) {
		if (!item) {
			return;
		}

		if (typeof item == 'object') {
			if (item['getDom']) {
				this.el.append(item.getDom());
			}
			else if (item instanceof Array) {
				for (var i = 0; i < item.length; i++) {
					this.addItem(item[i]);
				}
			}
			else {
				this.el.append(item);
			}
			this.fireEvent('onadditem', this, item);
		}
		else if (typeof item === 'string') {
			this.el.append(item);
			this.fireEvent('onadditem', this, item);
		}
	}
});
