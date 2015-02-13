/**
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-7-22
 */

$.moduleAndViewAction('buyerInfoViewId', function (buyerInfo) {
	buyerInfo.onOppClick(function () {
		$('#oppoBtnId').trigger('click');
	});
	/*buyerInfo.onPostBlClick(function () {
		$('#pbuyerleadBtnId').trigger('click');
	});*/
	buyerInfo.onEditClick(function () {
		$('#mySettingBtnId').trigger('click');
	});
	buyerInfo.onStOppClick(function () {
		$('#oppoBtnId').trigger('click');
	});
	buyerInfo.onStIrClick(function () {
		Can.importJS(['js/utils/msgCenterModule.js']);
		var msgCenterModule = Can.Application.getModule('msgCenterModuleId');
		if (!msgCenterModule) {
			msgCenterModule = new Can.module.msgCenterModule();
			Can.Application.putModule(msgCenterModule);
			msgCenterModule.start();
		}
		msgCenterModule.show();
		msgCenterModule.inboxView.setMessageData('');
		var oTop = Can.Application.getCanViews().get('Can_toolbar1');
		var $Cur;
		if (oTop) {
			$Cur = oTop.currentTopItemContainer;
		}
		else {
			$Cur = $('#header .cur');
		}
		if ($Cur) {
			$Cur.removeClass('cur');
		}
		var $Li = $('#msgBtnId').parent();
		$Li.addClass('cur');
		if (oTop) {
			oTop.currentTopItemContainer = $Li;
		}
	});
	buyerInfo.onStBlClick(function () {
		$('#mbuyerleadBtnId').trigger('click');
	});

	$(function () {
		//get data
		buyerInfo.loadData(Can.util.Config.buyer.indexModule.userInfo);
	});
});
