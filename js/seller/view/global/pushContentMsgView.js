/**
 * 推送功能的内容窗口，填写信息部分
 * @Author: AngusYoung
 * @Version: 1.3
 * @Since: 13-2-20
 */

Can.view.pushContentMsgView = Can.extend(Can.view.BaseView, {
	id: 'pushContentMsgViewId',
	actionJs: ['js/seller/action/pushContentMsgAction.js'],
	/*父级窗口，用来在本对象内对父级窗口的一些操作，必须是继承windowView类的对象*/
	parentEl: null,
	/*此data用来保存并提交到后台的数据*/
	data: {},
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.pushContentMsgView.superclass.constructor.call(this);
		this.contentEl = new Can.ui.Panel({
			cssName: 'win-push push-box'
		});
		var _pd_wrap = new Can.ui.Panel({cssName: 'box-cont pd-wrap'});

		var _txt1 = '<p class="t-tit">' + Can.msg.PUSH_WINDOW.YOU_SAY.replace('[@]', this.data.buyerName) + '</p>';
		this.textarea = new Can.ui.textAreaField({
			cssName: 'f-el',
			name: 'push-msg',
			isCount: true,
			isRequireEN: true,
			blankText: Can.msg.PUSH_WINDOW.TEXT_PLACE,
			maxLength: 300,
			width: 630,
			height: 80
		});
		var _txt2 = '<p class="t-tit">' + Can.msg.PUSH_WINDOW.YOU_SHARE.replace('[@]', this.data.buyerName) + '</p>';
		//添加推送产品
		this.addPro = new Can.ui.Panel({cssName: 'add-pro'});
		var _sel_wrap = new Can.ui.Panel({
			cssName: 'mod-wri clear',
			html: '<div class="r-con"><input type="text" name="productId" readonly></div>'
		});
		this.addBtn = new Can.ui.toolbar.Button({cssName: 'btn-add'});

		_sel_wrap.addItem(this.addBtn);
		this.addPro.addItem([_sel_wrap]);
		//更改推送产品
		this.modiPro = new Can.ui.Panel({cssName: 'mod-pro-s1'});
		this.proEl = new Can.ui.smallPro({cssName: 'pic'});

		var _reselect = new Can.ui.Panel({cssName: 'opt'});
		this.modiBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.RESELECT
		});
		this.delBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.DEL_PUSH_PRO
		});
		_reselect.addItem(this.modiBtn);
		_reselect.addItem(this.delBtn);
		this.modiPro.addItem([this.proEl, _reselect]);
		this.modiPro.el.hide();

		_pd_wrap.addItem([_txt1, this.textarea, _txt2, this.addPro, this.modiPro]);
		this.contentEl.addItem(_pd_wrap);

		/*action area*/
		var _tips = new Can.ui.Panel({
			cssName: 'tips-s2',
			html: '<span class="ico"></span><p class="des"></p>'
		});

		//动态最得C币数
		$.get(Can.util.Config.getPushPrice, {
			buyerId: this.data.buyerId
		}, function (data) {
			var coin = data.data;
			$.get(Can.util.Config.seller.coin, function (data) {
				_tips.el.find('.des').html(
					Can.msg.PUSH_WINDOW.SHARE_COINS
						.replace('[@]', coin)
						.replace('[@@]', data.data.availableMoney)
				);
			}, 'json');
		}, 'json');


		this.sendBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.SEND
		});
		this.cancelBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.CANCEL
		});
		this.actionEl = new Can.ui.Panel({
			cssName: 'b-actions win-action ali-r',
			items: [_tips, this.sendBtn, this.cancelBtn]
		});
	},
	startup: function () {
		this.contentEl.addItem(this.actionEl);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.sendBtn.on('onclick', function () {
			if (_this.onBeforeSend()) {
				_this.parentEl.close();
			}
		});
		_this.cancelBtn.on('onclick', function () {
			_this.parentEl.close();
		});
		_this.delBtn.on('onclick', function () {
			_this.modiPro.el.hide();
			_this.addPro.el.find('input[name="productId"]').val('');
			_this.addPro.el.show();
		});
	},
	update: function () {

	},
	getData: function () {
		//this.data['buyerId']
		//this.data['buyerName']
		this.data['description'] = this.textarea.getValue();
		this.data['contentId'] = this.addPro.el.find('input[name="productId"]').val();
		return this.data;
	},
	setValues: function (aPro) {
		//这里只需要一个就行，不进行别的处理
		if (aPro.length) {
			var _pro = aPro[0];
			this.addPro.el.hide();
			this.addPro.el.find('input[name="productId"]').val(_pro.id);
			this.proEl.update(_pro);
			this.modiPro.el.show();
		}
	},
	onBeforeSend: function () {
		return true;
	},
	onSelectPro: function (fFn) {
		if (typeof fFn === 'function') {
			this.addBtn.on('onclick', fFn, this);
			this.modiBtn.on('onclick', fFn, this);
		}
	},
	onSend: function (fFn) {
		if (typeof fFn === 'function') {
			this.onBeforeSend = fFn;
		}
	},
	onCancel: function (fFn) {
		if (typeof fFn === 'function') {
			this.cancelBtn.on('onclick', fFn, this);
		}
	}
});