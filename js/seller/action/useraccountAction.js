/**
 * 顶部当前登录用户下拉框操作
 * Created by Island Huang
 * Date: 13-1-25 上午12:40
 */
$.moduleAndViewAction('sellerAccountId', function (userMenu) {
	userMenu.on('onitemclick', function (item) {
		var _id = parseInt(item.id, 10);
		if (_id > 0) {
			Can.importJS(['js/seller/view/mySettingModule.js']);
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
				Can.Route.run('/personProfile');
				break;
			case 2:
				Can.Route.run('/setPassword');
				break;
			case 3:
				Can.Route.run('/setBusiness');
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
	$(function () {
		var sAvatar = Can.util.formatImgSrc(Can.util.userInfo().getAvatar(), 24, 24);
		userMenu.ulabel.children('a').first().prepend('<img src="' + sAvatar + '" class="user-avatar" />');
	});
});