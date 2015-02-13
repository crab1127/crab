/**
 * window base view
 * @Author: AngusYoung
 * @Version: 2.6
 * @Update: 13-3-28
 */

Can.view.windowView = Can.extend(Can.view.BaseView, {
	win: null,
	main: null,
	content: null,
	openRelated: null,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.windowView.superclass.constructor.call(this);
		this.addEvents('ON_SCROLL');

		this.winConfig = {};
	},
	startup: function () {
		var _this = this;
		Can.util.EventDispatch.on('ON_KEY_DOWN', function (event) {
			var nCode = event.keyCode;
			var _lastWin = $('.ui-win:visible').last();
			//默认最上层的可见窗口如果按了ESC键就关闭
			if (!_this.win.isDisabled && _this.win.el[0] == _lastWin[0]) {
				if (nCode == 27) {
					_this.close();
					event.preventDefault();
				}
			}
		});
	},
	onBeforeClose: function (fFn) {
		if (typeof fFn === 'function') {
			this.win.beforeClose = fFn;
		}
	},
	onClose: function (fFn) {
		if (typeof fFn === 'function') {
			this.win.on('ON_CLOSE', fFn);
		}
	},
	onShow: function (fFn) {
		if (typeof fFn === 'function') {
			this.win.on('ON_SHOW', fFn);
		}
	},
	close: function () {
		if (this.win.closer) {
			this.win.closer.trigger('click');
		}
		else {
			this.win.close();
		}
	},
	show: function (fFn) {
		var _this = this;
		_this.start();
		if (typeof fFn === 'function') {
			fFn.call(_this.win);
		}
		_this.win.show();
	},
	hide: function () {
		this.win.hide();
	},
	reshow: function () {
		this.win.show();
	},
	updateCss: function (jCss) {
		this.win && this.win.updateCss(jCss);
	},
	set: function (jCfg) {
		jCfg = jCfg || {};
		for (var v in jCfg) {
			switch (v) {
				case 'content':
					this.setContent(jCfg[v]);
					break;
				case 'closer':
					jCfg[v].getDom() && (this.win.closer = jCfg[v].getDom());
					break;
				case 'cssName':
					this.main.el.addClass(jCfg[v]);
					break;
			}
		}
	},
	setContent: function (oObj) {
		if (!this.content) {
			return;
		}
		//this.content.el.empty();
		if (typeof oObj === 'object') {
			this.content.addItem(oObj);
		}
		else {
			this.content.el.html(oObj);
		}
	}
});

/**
 * 正规的弹窗VIEW
 * @Author: AngusYoung
 * @Version: 2.3
 * @Update: 13-7-15
 */

Can.view.titleWindowView = Can.extend(Can.view.windowView, {
	id: 'titleWindowViewId',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.titleWindowView.superclass.constructor.call(this);

		this.winConfig = $.extend({
			isMovable: true,
			isModal: true
		}, jCfg.winConfig);
		this.win = new Can.ui.BaseWindow(this.winConfig);
		this.main = new Can.ui.Panel({cssName: 'win-wrap'});
		if (this.title) {
			this.titler = new Can.ui.Panel({
				cssName: 'win-tit',
				html: this.title
			});
		}
		this.content = new Can.ui.Panel({cssName: 'win-content'});
	},
	startup: function () {
		var _this=this;
		Can.view.titleWindowView.superclass.startup.call(_this);
		_this.on('ON_SCROLL', function () {
			_this.win.rePosition();
		});
		_this.onClose(function () {
            if(Can.Application){
                Can.Application.setCurrentModule(_this.openRelated);
            }
		});
		if (Can.Application) {
			_this.openRelated = Can.Application.getCurrentModule();
			Can.Application.setCurrentModule(_this);
		}
		this.main.applyTo(this.win.getDom());
		this.titler && this.main.addItem(this.titler);
		this.main.addItem(this.content);

		this.main.el.css({
			width: this.width,
			height: this.height
		});
	}
});

/**
 * 大头钉式的弹窗VIEW
 * @Author: AngusYoung
 * @Version: 2.1
 * @Update: 13-1-30
 */

Can.view.pinWindowView = Can.extend(Can.view.windowView, {
	id: 'pinWindowViewId',
	constructor: function (jCfg) {
		var cssName = 'pin-win',
			hasBorder = true,
			isModal = false,
			isModal2 = false,
			hasRadius = true;

		Can.apply(this, jCfg || {});
		Can.view.pinWindowView.superclass.constructor.call(this);

		switch(this.type){
			case 1:
				break;
			case 2:
				cssName = 'pin-win pin-win-2';
				hasBorder = false;
				isModal = true;
				break;
			case 3:
				cssName = 'pin-win pin-win-2';
				hasBorder = false;
				isModal2 = true;
				hasRadius = false;
				break;
		};
		this.winConfig = $.extend({
			cssName: cssName,
			isFixed: true,
			hasFade: true,
			isModal: isModal,
			isModal2: isModal2,
			hasBorder: hasBorder,
			closeAction: this.closeAction,
			hasRadius: hasRadius
		}, jCfg.winConfig);
		this.win = new Can.ui.BaseWindow(this.winConfig);
		this.main = new Can.ui.Panel({cssName: 'win-wrap'});
		this.content = new Can.ui.Panel({cssName: 'win-content'});
	},
	startup: function () {
		Can.view.titleWindowView.superclass.startup.call(this);
		this.main.applyTo(this.win.getDom());
		this.main.addItem(this.content);

		this.main.el.css({
			width: this.width,
			height: this.height
		});
	}
});

/**
 * 登录的弹窗VIEW
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-3-29
 */

Can.view.loginWindowView = Can.extend(Can.view.windowView, {
	id: 'loginWindowViewId',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.loginWindowView.superclass.constructor.call(this);

		this.winConfig = $.extend({
			hasCloser: false,
			isFixed: true
		}, jCfg.winConfig);
		this.win = new Can.ui.BaseWindow(this.winConfig);
		this.main = new Can.ui.Panel({cssName: 'win-inner'});
		this.titler = new Can.ui.Panel({
			cssName: 'hd',
			html: this.title
		});
		this.content = new Can.ui.Panel({cssName: 'win-login'});
	},
	startup: function () {
		Can.view.titleWindowView.superclass.startup.call(this);
		this.main.applyTo(this.win.getDom());
		this.content.addItem(this.titler);
		this.main.addItem(this.content);
		this.main.el.css({
			width: this.width,
			height: this.height
		});
	}
});

/**
 * 消息窗口
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 13-2-1
 */

Can.view.msgWindowView = Can.extend(Can.view.windowView, {
	id: 'msgWindowViewId',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.msgWindowView.superclass.constructor.call(this);

		this.winConfig = $.extend({
			isModal: true,
			isFixed: true,
			hasCloser: false,
			hasBorder: jCfg.hasBorder === undefined ? true : jCfg.hasBorder,
			hasRadius: true
		}, jCfg.winConfig);
		this.win = new Can.ui.BaseWindow(this.winConfig);
		this.main = new Can.ui.Panel({cssName: 'win-wrap'});
		this.content = new Can.ui.Panel({cssName: 'win-content'});
	},
	startup: function () {
		Can.view.titleWindowView.superclass.startup.call(this);
		this.main.applyTo(this.win.getDom());
		this.main.addItem(this.content);
		this.main.el.css({
			width: this.width,
			height: this.height
		});
	}
});

/**
 * 提示窗口
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-3-21
 */
Can.view.alertWindowView = Can.extend(Can.view.msgWindowView, {
	id: 'alertWindowViewId',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.alertWindowView.superclass.constructor.call(this, jCfg || {});
		var _btn = new Can.ui.toolbar.Button({
			cssName: 'btn-s17 btn-s18',
			text: 'OK'
		});
		this.actioner = new Can.ui.Panel({
			cssName: 'win-action ali-c',
			items: [_btn]
		});
		this.set({
			cssName: 'alert-win',
			closer: _btn
		});
	},
	startup: function () {
		Can.view.alertWindowView.superclass.startup.call(this);
		this.main.addItem(this.actioner);
		var _this = this;
		Can.util.EventDispatch.on('ON_KEY_DOWN', function (event) {
			if (_this.win.el) {
				var nCode = event.keyCode;
				var _lastWin = $('.ui-win:visible').last();
				//当前显示在最上一层的窗口，在按下回车或空格键的时候关闭
				if (!_this.win.isDisabled && _this.win.el[0] == _lastWin[0]) {
					if (nCode == 13 || nCode == 32) {
						_this.close();
						event.preventDefault();
					}
				}
			}
		});
	}
});

/**
 * 确认框
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 13-4-7
 */
Can.view.confirmWindowView = Can.extend(Can.view.msgWindowView, {
	id: 'confirmWindowViewId',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.confirmWindowView.superclass.constructor.call(this, jCfg || {});
		this.addEvents('ON_OK_CLICK');
		var _ok_btn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.YES
		});
		_ok_btn.on('onclick', function () {
			this.fireEvent('ON_OK_CLICK');
		}, this);
		var _no_btn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.NO
		});
		this.actioner = new Can.ui.Panel({
			cssName: 'win-action ali-r',
			items: [_ok_btn, _no_btn]
		});
		this.set({
			cssName: 'confirm-win',
			closer: _no_btn
		});
	},
	onOK: function (fFn) {
		if (typeof fFn === 'function') {
			this.on('ON_OK_CLICK', function () {
				fFn();
				this.close();
			}, this);
		}
	},
	startup: function () {
		Can.view.confirmWindowView.superclass.startup.call(this);
		this.main.addItem(this.actioner);
		var _this = this;
		Can.util.EventDispatch.on('ON_KEY_DOWN', function (event) {
			if (_this.win.el) {
				var nCode = event.keyCode;
				var _lastWin = $('.ui-win:visible').last();
				//当前显示在最上一层的窗口，在按下回车或空格键的时候关闭
				if (!_this.win.isDisabled && _this.win.el[0] == _lastWin[0]) {
					if (nCode == 13 || nCode == 32) {
						_this.fireEvent('ON_OK_CLICK');
						event.preventDefault();
					}
				}
			}
		});
	}
});
