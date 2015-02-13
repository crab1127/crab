/**
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 13-2-3
 */

$.moduleAndViewAction('selectProductViewId', function (selectProduct) {
	selectProduct.onSelect(function (jPro, oPro) {
		oPro.parent().addClass('cur');
	});
	selectProduct.onUnSelect(function (jPro, oPro) {
		oPro.parent().removeClass('cur');
	});
	selectProduct.onNotSelect(function () {
		Can.util.canInterface('whoSay', ['Please select one.']);
	});

	$(function () {
		selectProduct.loadData(Can.util.Config.seller.selectPro.loadData);
	});
});
