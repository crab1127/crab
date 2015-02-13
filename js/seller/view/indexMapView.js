/**
 * 显示供应商首页地图
 * @Author: AngusYoung
 * @Version: v1.2
 * @Since: 13-1-18
 */
Can.view.IndexMapView = Can.extend(Can.view.BaseView, {
	id: 'indexMapViewId',
	state: 0,
	closeBuyer: false,
	requireUiJs: [
		'js/seller/view/sellerInfoView.js',
		'js/seller/view/activeMapView.js',
		'js/utils/stepBtnView.js'
	],
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.view.IndexMapView.superclass.constructor.call(this);
	},
	startup: function () {
		this.mapContainerEL = $('<div></div>').attr('class', 'ab-info');
		this.mapContainerEL.insertAfter('#header');
		var _ab = new Can.ui.Panel({cssName: 'ab-status'});
		var _ab_inner = new Can.ui.Panel({cssName: 'inner'});
		var _ab_inner_view = new Can.view.sellerInfoView({target: _ab_inner.getDom()});
		_ab_inner_view.start();
		this.ab_inner_view = _ab_inner_view;
		this.activeMap = new Can.view.activeMapView({closeBuyer: this.closeBuyer});
		this.activeMap.start();

		_ab_inner.addItem(this.activeMap.el);
		_ab.addItem(_ab_inner);

		this.switchBtn = new Can.ui.switchBtn({
			cssName: 'act-status',
			text: [Can.msg.SELLER_INDEX.ALL_STATUS, Can.msg.SELLER_INDEX.MY_STATUS],
			width: 103
		});
		var _swt = new Can.ui.Panel({cssName: 'swt-board'});
		// _swt.addItem(this.switchBtn);

		this.mapContainerEL.append(_ab.el);
		this.mapContainerEL.append(_swt.el);
	},
	show: function () {
		//console.log(Can.util.Config.seller.indexModule.userInfo)
		this.state = 1;
		this.ab_inner_view.loadData(Can.util.Config.seller.indexModule.userInfo);
		this.mapContainerEL.slideDown();
	},
	hide: function (isInit) {
		if (isInit) {
			this.mapContainerEL.hide();
			return;
		}
		this.mapContainerEL.slideUp();
	}
});
