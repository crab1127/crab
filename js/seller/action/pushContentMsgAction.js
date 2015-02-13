/**
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-8-7
 */

$.moduleAndViewAction('pushContentMsgViewId', function (pushContentMsg) {
	Can.importJS(['js/seller/view/global/selectProductView.js']);
	pushContentMsg.onSelectPro(function () {
		var parentWin = this.parentEl;
		parentWin.hide();
		var _close = function () {
			parentWin.reshow();
		};
		Can.util.canInterface('quickSelectProduct', [pushContentMsg, {}, false, _close]);
	});

	var _xpush_content_msg = false;
	pushContentMsg.onSend(function () {
		var bSendOk;
		var _data = pushContentMsg.getData();
		if (!_data['contentId']) {
			Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', {errorToken: 'ERR_PUSH_'}, {status: 'fail', errorCode: 201});
			return false;
		}
		$.ajax({
			url: Can.util.Config.seller.pushInfo,
			data: Can.util.formatFormData(_data),
			type: 'POST',
			async: false,
			beforeSend: function(){
				_xpush_content_msg = true;
			},
			complete: function(){
				_xpush_content_msg = false;
			},
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					Can.util.canInterface('whoSay', [Can.msg.PUSH_WINDOW.PUSH_SUCCESS]);
					bSendOk = true;
					// refresh C coin
					Can.util.refreshMemberCoin();
				}
				else {
					if (jData.message == "Please do not repeat  push") {
						var tipObj = {status: 'fail', message: Can.msg.PUSH_WINDOW.REPEAT_PUSH};
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, tipObj);
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			}
		});
		return bSendOk;
	});
});
