/**
 * Function Name
 * @Author: AngusYoung
 * @Version: 1.1
 * @Since: 13-9-13
 */

$.moduleAndViewAction('supplierInfo', function (supplierInfo) {
	supplierInfo.on('ON_PRO_TURN', function (oStep, $Obj, nDir) {
		var $Ul = $Obj.parent().siblings('ul');
		var $Li = $Ul.children('li');
		$Ul.css('width', $Li.width() * $Li.length);

		function __fCalc() {
			var _margin_left = parseInt($Ul.css('margin-left'), 10);
			if (_margin_left < 0) {
				oStep.getDOM(0).removeClass('disable');
			}
			else {
				oStep.getDOM(0).addClass('disable');
			}
			if (Math.abs(_margin_left) + 630 >= $Ul.width()) {
				oStep.getDOM(1).addClass('disable');
			}
			else {
				oStep.getDOM(1).removeClass('disable');
			}
		}

		if ($Ul.length) {
			var nMarginLeft = parseInt($Ul.css('margin-left'), 10);
			if (nDir === 1) {
				//left
				$Ul.animate({marginLeft: nMarginLeft + 630}, 'slow', __fCalc);
			}
			else {
				//right
				$Ul.animate({marginLeft: nMarginLeft - 630}, 'slow', __fCalc);
			}
		}
	});

	supplierInfo.on('ON_PRODUCT_CLICK', function (nId) {
		//alert(nId);
	});

	supplierInfo.on('ON_CONTACT_CLICK', function (nIndex) {
		var nMyId = Can.util.userInfo().getUserId();
		var nThatId = supplierInfo.userId;
		// 超过30天，记录此行为
		Can.util.tracer(0, 'viewContact', {myId: nMyId, targetId: nThatId});
		//console.log('click at ' + nIndex + ' tab');
	});
});