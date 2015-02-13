/**
 * 单个interest buyer的信息View Action
 * @Author: sam
 * @Version: 1.1
 * @Update: 13-2-22
 */

$.moduleAndViewAction('SellerShowroomPrdsInfoTag3ViewId', function (view) {
    Can.importJS(['js/seller/view/global/selectProductView.js']);
    view.turnPage();
	view.on('onaddmoreprdclick', function () {
//            var parentWin = this.parentEl;
//            parentWin.hide();
//            var _close = function () {
//                parentWin.reshow();
//            };
            Can.util.canInterface('quickSelectProduct', [view, { newest: 0 }, true]);
	}, view);

	view.on('onprdclick', function (product) {
		var nId = product.productId;
		var sTitle = product.productName;
		Can.util.canInterface('productDetail', [nId, sTitle, 'sellerSetShowroomModuleId',true]);
	}, view);

	view.on('onpulloffclick', function (prd) {
		$.ajax({
			url: view.pullOffPrd,
			type: "post",
			data: {productIds: prd.productId, newest: 0},
			success: function (resultData) {
				view.cleanList();
				view.refreshData();
			}
		});
	});
});
