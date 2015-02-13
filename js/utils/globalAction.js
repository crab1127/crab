/**
 *
 * 处理全局的事件
 * @Author: island
 * @version: v2.6
 * @since:13-1-19
 */

$(function () {
	/*对全局的jQuery Ajax请求进行处理*/
	$.ajaxSetup({
		dataType: 'JSON',
		errorToken: null,
		consoleError: Can.ENV.now === 'local' || Can.ENV.now === 'dev',
		cache: false,
		beforeSend: function () {
			var $Parent, $Load;
			if (this.showLoadTo) {
				$Parent = this.showLoadTo;
				$Load = $('<div class="loading"><span></span>' + Can.msg.LOADING + '</div>');
				$Parent.append($Load);
				this.loader = $Load;
			}
			else if (this.showLoadAfter) {
				$Parent = this.showLoadAfter;
				$Load = $('<div class="loading"><span></span>' + Can.msg.LOADING + '</div>');
				$Parent.after($Load);
				this.loader = $Load;
			}
			/**
			 * compel add 'locale' parameter.
			 */
			var aURL = this.url.split('?');
			var aArgus = aURL.length > 1 ? aURL[aURL.length - 1].split('&') : [];
			var jArgus = {};
			for (var i = 0, nLen = aArgus.length; i < nLen; i++) {
				var aItem = aArgus[i].split('=');
				jArgus[aItem[0]] = aItem[1];
			}
			if (!jArgus['locale']) {
				if (this.url.indexOf('.cf') >= 0) {
					if (this.url.indexOf('?') >= 0) {
						this.url += '&';
					}
					else {
						this.url += '?';
					}
					this.url += 'locale=' + Can.util.Config.lang.replace('-', '_');
				}
			}
		},
		complete: function () {
			if (this.loader) {
				this.loader.remove();
			}
		},
		error: function (e) {
			if (this.consoleError && e.statusText !== 'abort') {
				var _ajax_error = new Can.view.alertWindowView({
					id: 'ajaxErrorWindowView',
					width: 280
				});
				var _content = new Can.ui.Panel({
					cssName: 'error-box',
					html: Can.msg.AJAX_ERROR.replace('[@]', this.url).replace('[@@]', e.statusText)
				});
//				console.log(this.data)
				_ajax_error.setContent(_content);
				_ajax_error.show();
			}
		}
	});
	/*监控页面拥有canTitle属性的元素，调用textTips widget显示*/
	$(document.body).on('mouseenter', '[cantitle]', function () {
		//添加 : 的转义符 \\: @author vfasky
		//添加 /n 转换成 <br/> @author vfasky
		var self = $(this);

		var cantitle = self.attr('cantitle').replace(/\\:/g, '{{=}}');
		cantitle = cantitle.replace(/\n/g, '<br/>');
		var aTitle = cantitle.split(':');
		var _p = aTitle[0], _t = aTitle[1];

		_p = _p.replace(/\{\{=\}\}/g, ":");
		if (!_t) {
			_t = _p;
			_p = '';
		}
		Can.util.canInterface('canTips', [self, _p , unescape(_t)]);
	});
	/*监控页面拥有autoCut属性的元素，调用裁减类*/
	Can.util.EventDispatch.dispatchEvent('ON_NEW_UI_APPEND', $(document.body));
	$(document.body).on('mouseenter', '[autoCut]', function () {
		var _self = $(this);
		var _word = _self.data('word');
		if (_word && _word.length) {
			var $CutLayout = $('<div class="cut-layout"></div>');
			$CutLayout.html(_word);
			$(document.body).append($CutLayout);
			var _parent = _self.parent();
			if (_parent.css('position') == 'static') {
				_parent.css('position', 'relative');
			}
			$CutLayout.css({
				left: _self.offset().left,
				top: _self.offset().top,
				width: _parent.width() - _self.position().left,
				fontWeight: _self.css('fontWeight')
			});
			$CutLayout.on('mouseleave', function () {
				$(this).off().remove();
			});
		}
	});
	/*全局的滚屏事件，用来滚屏LOAD DATA*/
	$(document).scroll(function () {
		//只对当前有ON_SCROLL事件的module执行操作
		if (Can.Application) {
			Can.Application.getCurrentModule().fireEvent('ON_SCROLL');
		}
	});
	/*全局的按键事件，将某些Window会获取回车，空格，ESC等键来关闭窗口*/
	$(document).keydown(function (event) {
		Can.util.EventDispatch.dispatchEvent('ON_KEY_DOWN', event);
	});
	/*全局处理页面点击时隐藏某些元素*/
	$(document).click(function (event) {
		Can.util.EventDispatch.dispatchEvent('ON_PAGE_CLICK', event);
	});
	/*判断是否前端请求地址与用户类型不匹配*/
	window.isRightUserType = function () {
		var matchURL = Can.util.Config.app.CanURL;
		switch (Can.util.userInfo().getUserType()) {
			// supplier
			case 1:
				matchURL += 'supplier';
				break;
			// buyer
			case 2:
				matchURL += 'buyer';
				break;
		}
		if (location.href.indexOf(matchURL) < 0) {
			$(document.body).hide();
			location.href = matchURL;
		}
	}
});
/**
 * 处理AJAX请求的异常状态，即返回结果非success时在此处理
 * 放在这里的目的是为了第一时间捕获到请求的错误，在展示页
 * 面之前就可以处理对应的操作。
 * 目前存在的status有：
 * @success: 成功
 * @fail: 操作失败，用户可以解决的，给出详细LOG
 * @error: 程序失败，用户解决不了，给出官方提示
 * @deny: 表示禁止访问或者账号有异常情况，强制退出系统
 * @unlogin: 表示未登录
 */
Can.util.EventDispatch.on('ON_ERROR_HANDLE', function (ajaxObj, returnData) {
	switch (returnData.status) {
		case 'fail':
			var _opera_fail = new Can.view.alertWindowView({
				id: 'operaFailWindowView',
				width: 280
			});
			var _content = new Can.ui.Panel({
				cssName: 'error-box',
				html: (returnData.errorCode && ajaxObj.errorToken) ? Can.msg.ERROR_TEXT[ajaxObj.errorToken + returnData.errorCode] : returnData.message
			});
			_opera_fail.setContent(_content);
			_opera_fail.show();
			break;
		case 'error':
			ajaxObj.consoleError && Can.util.canInterface('whoSay', [Can.msg.ERROR_TEXT['ERR_NORMAL_000']]);
			break;
		case 'deny':
			var _deny = new Can.view.alertWindowView();
			_deny.setContent('<div class="error-box" style="font-size:13px;font-weight: bold;">' +
				'Forbidden!' +
				'</div>');
			_deny.onClose(function () {
				Can.Application.getModule('userAccountView').fireEvent('onitemclick', {id: 0});
			});
			_deny.show();
			break;
		case 'unlogin':
			//get the last argument but not {returnData}, it is that when the user click logout menu.
			var _manual = arguments.length > 2 ? arguments[arguments.length - 1] : false;
			var _logout = _manual || !Can.util.userInfo().isLogin();
			if (window.sessionStorage) {
				//clear all user session data
				window.sessionStorage.clear && window.sessionStorage.clear();
			}
			if (window.localStorage) {
				//clear local login state
				window.localStorage.removeItem('localLogin');
			}
			//logout and login Pop window is not show
			if (_logout && !Can.util.Config['loginPop']) {
				var _referrer = '/login.html';
				if (!_manual) {
					_referrer += '?redirectUrl=' + encodeURIComponent(location.href);
				}
				location.href = _referrer;
			}
			else {
				if (Can.util.Config['loginPop']) {
					return;
				}
				Can.util.Config['loginPop'] = true;
				Can.importJS(['js/utils/windowView.js', 'js/utils/loginPopView.js']);
				var popWin = new Can.view.loginWindowView({
					title: Can.msg.PLEASE_LOGIN,
					winConfig: {
						isModal: true
					},
					width: 400,
					height: 400
				});
				var loginCont = new Can.view.loginPopView({
					parentEl: popWin,
					continuePrg: ajaxObj,
					outUser: Can.util.userInfo().getAccount()
				});
				loginCont.start();
				popWin.show();
				popWin.onClose(function () {
					delete Can.util.Config['loginPop'];
				});
				popWin.setContent(loginCont.ContainerEL);
				popWin.win.maskEl.fadeTo(null, 1);
				$.ajaxSetup({
					beforeSend: function (xhr) {
						xhr.abort();
					}
				});
			}
			break;
		case 'abnormal':
			var _abnormal = new Can.view.alertWindowView();
			_abnormal.setContent('<div class="error-box" style="font-size:13px;font-weight: bold;">' + returnData.message + '</div>');
			_abnormal.onClose(function () {
				Can.Application.getModule('userAccountView').fireEvent('onitemclick', {id: 0});
				location.href = '/';
			});
			_abnormal.show();
			$('#wrap').hide();
			$('.win-mask').css('opacity', '1');
			break;
		default :
			alert('ERROR:' + returnData.message);
	}
});

Can.util.EventDispatch.on('ON_NEW_UI_APPEND', function ($Obj) {
	$('[autoCut]', $Obj).each(function () {
		var _self = $(this);
		if (_self.data('formatted')) {
			return;
		}
		_self.data('formatted', true);
		var _max = parseInt(_self.attr('autoCut'), 10) || 0;
		var _word = _self.html();
		if (_word.length > _max) {
			_self.data('word', _word);
			_self.html(fCutWord(_word, _max));
		}
	});
});

Can.util.EventDispatch.on('ON_UNREAD_MSG_REFS', function (sMsgId, bIncrease) {
	var oTopMenu = Can.Application.getTopMenuView();
	// 移除对应的消息条
	oTopMenu.MsgDelete(sMsgId);
	// 更新消息数
	oTopMenu.fireEvent('ON_MSG_READ', bIncrease);
});

/**
 * count user match level
 * @param {Number} nMatch match number
 * @param {Boolean} bBig big icon
 * @returns {String}
 */
function fCountMatchLevel(nMatch, bBig) {
	return (bBig ? 'refs-match-s' : 'mod-mch-s') + Math.min(5, Math.round(6 - nMatch / 20)).toString();
}

/**
 * count user credit level
 * @param {String} sCredit credit level
 * @returns {String}
 */
function fCountCreditLevel(sCredit) {
	var nLevel = 10;
	if (sCredit) {
		switch (sCredit.toUpperCase()) {
			case 'AAA':
				nLevel = 1;
				break;
			case'AA':
				nLevel = 2;
				break;
			case'A':
				nLevel = 3;
				break;
			case'BBB':
				nLevel = 4;
				break;
			case'BB':
				nLevel = 5;
				break;
			case'B':
				nLevel = 6;
				break;
			case'CCC':
				nLevel = 7;
				break;
			case'CC':
				nLevel = 8;
				break;
			case'C':
				nLevel = 9;
				break;
			case'NR':
				nLevel = 10;
				break;
		}
	}
	return 'mod-crt-s' + nLevel.toString();
}

/**
 * 截取字符串
 * @param {String} sWord
 * @param {Number} nLen
 * @returns {string}
 */
function fCutWord(sWord, nLen) {
	return sWord.substr(0, nLen) + (sWord.length > nLen ? '...' : '');
}

/**
 * for Iframe public interface
 */

function fCanGetCate($inp, nMax, aNormal, fCallback) {
	var _config = {
		target: $inp,
		maxLevel: 2,
		maxSelect: nMax || 0,
		normalValue: aNormal
	};
	Can.util.canInterface('categorySelector', [_config, fCallback]);
}

/**
 * #3402 因为不想惊动到后端，所以就由前端来对对象进行数组排序转换了，根据关键字的“pic*”来决定顺序
 */
function fSortPicObj(oPic) {
	var _pic = [];
	for (var x in oPic) {
		_pic.push({
			index: x.replace('pic', ''),
			value: oPic[x]
		});
	}
	_pic.sort(function (a, b) {
		return a.index > b.index;
	});
	var _new = [];
	for (var i = 0; i < _pic.length; i++) {
		_new.push(_pic[i].value);
	}
	return _new.join();
}