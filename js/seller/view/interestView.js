/**
 * Seller Index Page interest view
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-2-1
 */

Can.view.interestView = Can.extend(Can.view.BaseView, {
	id: 'interestViewId',
	requireUiJs: ['js/seller/view/interestBuyerView.js', 'js/utils/stepBtnView.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.interestView.superclass.constructor.call(this);
		this.addEvents('ON_UPDATE');
		this.titler = new Can.ui.Panel({
			wrapEL: 'h2',
			html: this.title
		});
		this.stepBtn = new Can.view.stepBtnView({
			css: ['btn-backward', 'btn-forward']
		});
		this.stepBtn.start();
		this.list = new Can.ui.Panel({
			cssName: 'box-list',
			items: this.stepBtn.group
		});
		this.cont = new Can.ui.Panel({cssName: 'det'});
		this.item = new Can.ui.Panel({wrapEL: 'ul'});
	},
	startup: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.css);

		this.titler.applyTo(this.el);

		this.cont.addItem(this.item);
		this.list.addItem(this.cont);

		this.list.applyTo(this.el);
	},
	update: function (aData) {
		var _item = this.item;
		for (var i = 0; i < aData.length; i++) {
			var _interestBuyer = new Can.view.interestBuyerView();
			_interestBuyer.update(aData[i]);
			_interestBuyer.start();
			_item.addItem(_interestBuyer.el);
		}
		Can.util.EventDispatch.dispatchEvent('ON_NEW_UI_APPEND', _item.el);
		this.fireEvent('ON_UPDATE', aData.length);
	},
	hide: function () {
		this.el.hide();
	},
	show: function () {
		this.el.show();
	}
});