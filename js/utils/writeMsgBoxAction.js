/**
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-7-17
 */

$.moduleAndViewAction('writeMsgBoxViewId', function (writeMsgBox) {
	//选择联系人弹层
	Can.importJS(['js/utils/selectContacterView.js']);
	writeMsgBox.onContactBtnClick(function (event) {
		var _contactLayer = Can.Application.getCanViews().get('selectCantacter');
		if (!_contactLayer) {
			_contactLayer = new Can.ui.tips({
				cssName: 'win-tips-s1',
				mainCss: 'add-contact',
				arrowCss: 'arrow-t',
				width: 560
			});
			Can.Application.getCanViews().put('selectCantacter', _contactLayer);
		}
		var _contactView = new Can.view.selectContacterView({
			parentEl: _contactLayer,
			target: writeMsgBox.addrs,
			cssName: 'box-cont',
			values: []
		});
		_contactView.start();
		_contactView.loadData(Can.util.Config.selectContacter.loadData);
		_contactLayer.updateContent(_contactView.contentEl);
		_contactLayer.updateCss({
			position: 'fixed',
			top: this.el.offset().top + this.el.outerHeight(true) - $(document).scrollTop(),
			left: this.el.offset().left - _contactLayer.width / 2 + 15,
			zIndex: 900
		});
		_contactLayer.show();
		event.stopPropagation();
	});
	//发送成功
	writeMsgBox.on('ON_SEND_OK', function () {
		Can.util.canInterface('whoSay', ['email send success!']);
	});
	//发送失败
	writeMsgBox.on('ON_EMAIL_FAILED', function (error) {
		Can.util.canInterface('whoSay', [Can.msg.ERROR_TEXT[error.code]]);
	});
	/*附件上传失败*/
	writeMsgBox.onUploadError(function (file, code) {
		Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, {status: 'fail', message: Can.msg.ERROR_TEXT[code]});
	});
});