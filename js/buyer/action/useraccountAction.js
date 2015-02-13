/**
 * 顶部当前登录用户下拉框操作
 * Created by Island Huang
 * Date: 13-1-25 上午12:40
 */
$.moduleAndViewAction('buyerAccountId', function (userMenu) {
	userMenu.on('onitemclick', function (item) {
		var _id = parseInt(item.id, 10);
		if (_id > 0) {
			Can.importJS(['js/buyer/view/mySettingModule.js']);
			var mySetting = Can.Application.getModule('mySettingModuleId');
			if (!mySetting) {
				mySetting = new Can.module.mySettingModule();
				Can.Application.putModule(mySetting);
				mySetting.start();
			}
			mySetting.show();
		}
		switch (_id) {
			case 0:
				$.get(Can.util.Config.logout, function (jData) {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData, true);
				});
				break;
			case 1:
				mySetting.goToURL(Can.util.Config.buyer.mySetting.personProfile);
				break;
			case 2:
				mySetting.goToURL(Can.util.Config.buyer.mySetting.setAccount);
				break;
			case 3:
				mySetting.goToURL(Can.util.Config.buyer.mySetting.setBusiness);
				break;
			default :
				Can.util.canInterface('whoSay', [item.id + '--' + item.txt]);
		}
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
		var $Li = $('#mySettingBtnId').parent();
		$Li.addClass('cur');
		if (oTop) {
			oTop.currentTopItemContainer = $Li;
		}
	});
});