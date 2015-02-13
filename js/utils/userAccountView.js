/**
 * 顶部系统菜单 中，当前登录用户的下拉框菜单
 * @author island
 * @since 2013-01-25
 */
Can.view.UserAccountView = Can.extend(Can.view.BaseView, {
	/**
	 * 下框中，每一项的配置项，形如：
	 * [
	 *  {id:1, txt:'HWM'}
	 *  ,{id:2, txt:'HWM'}
	 *  ,{id:3, txt:'HWM'}
	 * ]
	 */
	items: [],
	currentUser: null,
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.view.UserAccountView.superclass.constructor.call(this);
		this.addEvents(
			/**
			 * 点击下拉框中item的事件
			 */
			'onitemclick'
		);
	},
	startup: function () {
		this.el = $('<li class="left"></li>');
		this.ulabel = $('<div class="jer"></div>').appendTo(this.el);
		this.ulabel.html('<a href="javascript:;">' + this.currentUser.username +
			'<i class="triangle-d"></i>' +
			'</a>');
		var me = this;
		me.isOptionDisplay = false;

		this.createItem();
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.el.mouseenter(function () {
			_this.showOptions();
		});
		_this.el.mouseleave(function (event) {
			_this.hideOptions();
		});
	},
	createItem: function () {
		if (this.items && this.items.length > 0) {
			this.listContainer = $('<div class="submenu hidden"></div>').appendTo(this.el);
			var me = this;
			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];
				var itemEl = $('<a href="javascript:;">' + item.txt + '</a>').appendTo(this.listContainer);
				itemEl.data('item', item);
				itemEl.click(function () {
					me.hideOptions();
					me.fireEvent('onitemclick', $(this).data('item'));
				});
			}
		}
	},
	showOptions: function () {
		if (this.listContainer) {
			this.isOptionDisplay = true;
			//this.el
			this.listContainer.removeClass('hidden');
		}
	},
	hideOptions: function () {
		if (this.listContainer) {
			this.isOptionDisplay = false;
			this.listContainer.addClass('hidden');
		}
	},
	applyTo: function (jqObject) {
		if (typeof jqObject == 'object') {
			this.el.appendTo(jqObject);
		}
	}

});

