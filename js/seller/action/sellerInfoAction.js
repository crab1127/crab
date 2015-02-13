/**
 * @Author: AngusYoung
 * @Version: 1.2
 * @Since: 13-1-24
 */

$.moduleAndViewAction('sellerInfoViewId', function (sellerInfo) {
	sellerInfo.onSearchBuyleadClick(function () {
		$('#buyingLeadBtnId').trigger('click');
	});
	sellerInfo.onAddProClick(function () {
		$('#addPrdBtnId').trigger('click');
	});
	sellerInfo.onEditClick(function () {
		$('#showroomBtnId').trigger('click');
	});
	sellerInfo.onStIqClick(function () {
		/*Can.importJS(['js/utils/msgCenterModule.js']);
		var msgCenterModule = Can.Application.getModule('msgCenterModuleId');
		if (!msgCenterModule) {
			msgCenterModule = new Can.module.msgCenterModule();
			Can.Application.putModule(msgCenterModule);
			msgCenterModule.start();
		}
		msgCenterModule.show();
		msgCenterModule.inboxView.setMessageData('');
		Can.Application.getTopMenuView().setTopToolbarSelectedItem(null, null, $('#msgBtnId').parent());*/
		$('#activityBtnId').trigger('click');
	});
	sellerInfo.onStIpClick(function () {
		$('#managePrdBtnId').trigger('click');
	});
	sellerInfo.onStBlClick(function () {
		$('#buyingLeadBtnId').trigger('click');
	});

	$(function () {
		var TO;

		//get data
		//sellerInfo.loadData(Can.util.Config.seller.indexModule.userInfo);

		sellerInfo.level.el.hover(
			function () {
				clearTimeout(TO);
				var $this = $(this);

				$(this).find('.tip').show();
				/*
				 $.ajax({
				 url: Can.util.Config.seller.coin,
				 success: function(d){
				 if(d['status'] !== 'success'){
				 return;
				 }
				 var coin = d['data'];

				 $this.find('.coin-left').text(coin.availableMoney);
				 $this.find('.coin-consumed').text(coin.usedMoney);
				 Can.util.refreshMemberCoin(coin);
				 }
				 });
				 */
			},
			function () {
				var $this = $(this);

				TO = setTimeout(function () {
					$this.find('.tip').hide();
				}, 300);
			}
		);
	});
});
