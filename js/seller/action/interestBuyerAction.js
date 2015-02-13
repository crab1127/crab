/**
 * 单个interest buyer的信息View Action
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-2-29
 */

$.moduleAndViewAction('interestBuyerViewId', function (interestBuyer) {
	interestBuyer.on('ON_BUTTON_CLICK', function () {
		var jBuyer = {
			buyerId: interestBuyer.dataId,
			buyerName: interestBuyer.dataName
		};
		Can.util.canInterface('pushInfo', [jBuyer]);
	});
	interestBuyer.on('ON_NAME_CLICK', function () {
		Can.util.canInterface('personProfile', [2, interestBuyer.dataId]);
	});
});