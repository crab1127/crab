/**
 *
 * 供应商首页
 * @Author: island
 * @Version: v1.3
 * @Since: 13-1-18
 */
Can.module.SellerIndexModule = Can.extend(Can.module.BaseModule, {
	id: 'sellerIndexModule',
	// #3151 如果是E广通套餐和优企套餐用户则关闭match buyer 以及 push info
	closeBuyer: false,
	/**
	 * 因为在此module，需要初始化indexMapView,需要用到一个UI的JS  indexMapView.js，
	 * 因此需要定义在requireUiJs中
	 */
	requireUiJs: ['js/seller/view/indexMapView.js', 'js/seller/view/interestView.js'],
	actionJs: ['js/seller/action/sellerIndexAction.js'],
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.module.SellerIndexModule.superclass.constructor.call(this);
		this.interest = new Can.view.interestView({
			css: 'mod-interested',
			title: Can.msg.SELLER_INDEX.INTEREST
		});
		this.search = new Can.ui.Panel({cssName: 'ind-search clear'});
		var _text = new Can.ui.Panel({
			cssName: 'txt',
			html: Can.msg.SELLER_INDEX.ALSO_U_CAN
		});
		this.search_ipt = new Can.ui.TextField({
			cssName: 'foucs-box',
			id: null,
			width: null,
			blankText: Can.msg.SELLER_INDEX.KEYWORD
		});
		this.search_btn = new Can.ui.toolbar.Button({
			cssName: 'btn-search',
			text: Can.msg.SELLER_INDEX.SEARCH_BL
		});
		var _btn_box = new Can.ui.Panel({cssName: 'btn-box'});
		_btn_box.addItem(this.search_btn);
		this.search_ipt.input.removeClass();
		this.search.addItem([_text, this.search_ipt, _btn_box]);
	},
	startup: function () {
		Can.module.SellerIndexModule.superclass.startup.call(this);
		this.indexMapView = new Can.view.IndexMapView({id: 'indexMapView', closeBuyer: this.closeBuyer});
		this.indexMapView.startup();
		//非toolbar下的panel，加入以下css拉回位置
		this.containerEl.addClass('shrink');
		// 如果E广通/优企账号，将地图丢进container里，不显示match buyer
		if (!this.closeBuyer) {
			this.interest.start();
			this.containerEl.append(this.interest.el.hide());
			this.containerEl.append(this.search.el);

		}
	},
	hide: function (isInit) {
		if (this.closeBuyer) {
			$('#container').show();
		}
		this.indexMapView.hide(isInit);

		if (isInit) {
			this.fireEvent('onhide');
			return;
		}
		Can.module.SellerIndexModule.superclass.hide.call(this, arguments[0]);
	},
	show: function () {
		if (this.closeBuyer) {
			$('#container').hide();
		}
		if (!this.indexMapView.state || !this.indexMapView.mapContainerEL.is(':visible')) {
			this.indexMapView.show();
		}
		Can.module.SellerIndexModule.superclass.show.call(this);
	},
	update: function (aData) {
		if (this.closeBuyer) {
			return;
		}
		if (aData && aData.length) {
			this.interest.show();
			this.interest.update(aData);
		}
		else {
			$('#container').css('min-height', 60);
			this.interest.hide();
		}
	},
	loadData: function (sURL) {
		var _this = this;
		$.ajax({
			url: sURL,
			//consoleError: false,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					_this.update(jData.data);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	}
});
