/**
 * 顶部工具栏
 * @author Island 2013-01-6
 */
Can.ui.toolbar.Toolbar = Can.extend(Can.ui.BaseUI, {
	/**
	 * 用于保存toolbar 里面所有Item.
	 * 类型：Can.util.ArrayMap
	 * 以每个UI的ID为key放入到map里面
	 */
	items: new Can.util.ArrayMap(),
	/**
	 * 用于保存当前在toolbar里面的按钮
	 * @param {Object} cfg
	 */
	buttons: new Can.util.ArrayMap(),
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.ui.toolbar.Toolbar.superclass.constructor.call(this);
		this.addEvents('onadditem', 'onitemclick');
	},
	getId: function () {
		return this.id;
	},
	initUI: function () {
		var _html = '<ul></ul>';
		var _el = $(_html);
		_el.attr('id', this.id);
		if (this.cssName && this.cssName != '')
			_el.attr('class', this.cssName);
		this.el = _el;
		//default hide this toolbar
		this.el.hide();
	},
	hide: function () {
		this.el.hide();
	},
	show: function () {
		this.el.show();
	},

	/**
	 * 往Toolbar里面增加一个Item，<br/>
	 * 可以是任何继承了<strong>Can.ui.BaseUI</strong>的实例
	 * @param {Can.ui.toolbar.Button} object 需要增加进Toolbar的Item
	 */
	addItem: function (object) {
		if (typeof object != 'object') {
			return;
		}
		if (!(object instanceof Can.ui.BaseUI)) {
			return;
		}
		var _liObj = $('<li></li>');
		if (arguments[1] && typeof arguments[1] == 'string') {
			//默认第二个参数是每个item的父级样式名
			_liObj.attr('class', arguments[1]);
		}
		_liObj.appendTo(this.el);
		object.applyTo(_liObj);
		var me = this;
		object.click(function (btn) {
			me.fireEvent('onitemclick', me, btn, _liObj);
		});
		this.items.put(object.getId(), object);
		this.fireEvent('onadditem', this, object, _liObj);
	},
	/**
	 * 返回当前toolbar中已经含有的Items
	 */
	getItems: function () {
		return this.items;
	}
});

/**
 * 顶部工具栏的二级栏目
 * @Author: AngusYoung
 * @Version: 1.0
 * @Since: 2013-10-6
 */
Can.ui.toolbar.SubToolbar = Can.extend(Can.ui.BaseUI, {
	cssName: 'child-menu',
	parentBar: null,
	currentItem: null,
	items: new Can.util.ArrayMap(),
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.toolbar.SubToolbar.superclass.constructor.call(this);
		this.addEvents('ON_ITEM_CLICK');
	},
	initUI: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.cssName);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.el.on('click', 'a', function () {
			var _item = $(this);
			var _id = _item.attr('id');
			if (_id) {
				$('.cur', _this.el).removeClass('cur');
				_item.addClass('cur');
				_this.refreshNormal($(_this.getItem(_id).getDom().html()), _id);
				_this.hide();
			}
		});
		_this.parentBar.functionToolbar.on('onitemclick', function (oToolbar, oItem, oElement) {
			var $Obj = oElement.children('a');
			if ($Obj.attr('link')) {
				_this.getItem($Obj.attr('link')).getDom().trigger('click');
			}
			else {
				$('.cur', _this.el).removeClass('cur');
			}
		});
	},
	addItem: function (oObj) {
		if (typeof oObj === 'object' && oObj instanceof Can.ui.BaseUI) {
			oObj.applyTo(this.el);
			this.items.put(oObj.getId(), oObj);
			this.el.css('margin-left', -(this.items.size() * 120 + 20 - 120) / 2);
		}
	},
	getItem: function (sKey) {
		return this.items.get(sKey);
	},
	refreshNormal: function ($Obj, sLink) {
		this.currentItem.empty().append($Obj).attr('link', sLink).children('strong').append('<i class="child triangle-d"></i>');
		this.parentBar.setTopToolbarSelectedItem(this.parentBar, null, this.currentItem.parent());
	},
	hide: function () {
		var _this = this;
		_this.el.addClass('hidden');
		setTimeout(function () {
			_this.el.removeClass('hidden');
		}, 200);
	}
});