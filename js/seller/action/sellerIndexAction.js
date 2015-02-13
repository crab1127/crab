/**
 * @Author: AngusYoung
 * @Version: 1.3
 * @Since: 13-1-24
 */

$.moduleAndViewAction('sellerIndexModule', function (sellerIndex) {
	sellerIndex.indexMapView.switchBtn.onChange(function () {
		sellerIndex.indexMapView.activeMap.changeData();
	});
	sellerIndex.indexMapView.activeMap.on('ON_POINT_INIT', function () {
		// 将seller info的inquiry数字换成activities数量
		sellerIndex.indexMapView.ab_inner_view.static_iq.updateText(this.total);
	});

	var _cont = sellerIndex.interest.cont.el;
	var _item = sellerIndex.interest.item.el;
	sellerIndex.interest.stepBtn.onLeftClick(function () {
		var _this = this.el;
		sellerIndex.interest.stepBtn.getDOM(1).show();
		_cont.animate({
			scrollLeft: _cont.scrollLeft() - _cont.width() - 20
		}, 'slow', function () {
			if (_cont.scrollLeft() == 0) {
				_this.hide();
			}
		});
	});
	sellerIndex.interest.stepBtn.onRightClick(function () {
		var _this = this.el;
		sellerIndex.interest.stepBtn.getDOM(0).show();
		_cont.animate({
			scrollLeft: _cont.scrollLeft() + _cont.width() + 20
		}, 'slow', function () {
			if (_cont.scrollLeft() + _cont.width() + 20 >= _item.outerWidth(true)) {
				_this.hide();
			}
		});
	});

	sellerIndex.interest.stepBtn.hide();

	sellerIndex.interest.on('ON_UPDATE', function (nLen) {
		var _cont_wid = _cont.width() || 980;
		_item.css('marginLeft', 'auto');
		//如果超过五个的话就把分页显示出来
		if (nLen > 5) {
			this.stepBtn.getDOM(1).show();
			var _wid = Math.ceil(nLen / 5) * (_cont_wid + 20);
			_item.css('width', _wid);
		}
		//如果少于五个就居中显示
		else if (nLen < 5) {
			var $Li = _item.children('li');
			var _li_width = 0;
			$Li.each(function () {
				_li_width += $(this).outerWidth(true);
			});
			_item.css('marginLeft', (_cont_wid - _li_width) / 2);
		}
	});

	sellerIndex.search_btn.on('onclick', function () {
		// Can.importJS(['js/seller/view/buyerleadModule.js']);
		var _keyword = sellerIndex.search_ipt.getValue();
		/*
		var buyerleadModule = Can.Application.getModule('buyerleadModuleId');
		if (buyerleadModule == null) {
			buyerleadModule = new Can.module.BuyerLeadModule();
			buyerleadModule.start();
			Can.Application.putModule(buyerleadModule);
		}
		buyerleadModule.show();
		buyerleadModule.emptylist();
		buyerleadModule.load(Can.util.Config.seller.buyerleadModule.allbuyerlead, {keyword: _keyword});
		*/
	   Can.Route.run('/buyinglead', { keyword: _keyword });	
	});
	//页面完成后才加载
	$(function () {
		sellerIndex.loadData(Can.util.Config.seller.indexModule.interest);

		// Web IM
		if (Can.util.userInfo().getIMAccount()) {
			if (window['WebIM']) {
				WebIM.init({
					accName: Can.util.userInfo().getIMAccount(),
					displayName: Can.msg.IM.YOURSELF,
					userType: Can.util.userInfo().getUserType(),
					password: Can.util.userInfo().getIMToken(),
					domain: Can.ENV.IM.domain,
					serviceUrl: Can.ENV.IM.service
				});
			}
		}
	});
});
