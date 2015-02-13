/**
 * read message box
 * @Author: AngusYoung
 * @Version: 2.7
 * @Since: 13-4-9
 */

Can.view.readMsgBoxView = Can.extend(Can.view.BaseView, {
	id: 'readMsgBoxViewId',
	currentIndex: -1,
	items: [],
	isFirst: true,
	wipeEmail: false,
	actionJs: ['js/utils/readMsgBoxAction.js'],
	requireUiJs: ['js/utils/stepBtnView.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.readMsgBoxView.superclass.constructor.call(this);
		this.addEvents('ON_DATA_LOADED', 'ON_READ_EMAIL', 'ON_SYS_EMAIL', 'ON_DELETE_EMAIL');

		this.contentEl = $('<div></div>');
		this.itemWrap = $('<div class="msg-item-wrap"></div>');
		/*action area*/
		this.replyBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.REPLY
		});
		this.restoreBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.RESTORE
		});
		this.deleteBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.DELETE
		});
		this.actionEl = new Can.ui.Panel({
			cssName: 'win-action ali-r',
			items: [this.replyBtn, this.restoreBtn, this.deleteBtn]
		});
		/*tips*/
		this.tips = new Can.ui.textTips({
			id: 'msgTips',
			cssName: 'tips-s1',
			iconCss: 'ico',
			arrowIs: 'Y',
			isOpposite: true,
			target: this.parentEl.win.el,
			hasIcon: true,
			hasArrow: false
		});
		this.tips.updateCss({
			'z-index': 901
		});
		/*left right*/
		this.stepArea = $('<div class="readMsg-opaBtn"></div>');
		this.stepBtn = new Can.view.stepBtnView({
			css: ['btn-forward', 'btn-backward']
		});
	},
	startup: function () {
		this.contentEl.addClass(this.cssName);
		this.itemWrap.appendTo(this.contentEl);
		this.actionEl.applyTo(this.contentEl);
		this.stepBtn.applyTo(this.stepArea);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.itemWrap
			// name card
			.on('click', 'a[role=card]', function () {
				var emailData = _this.items[_this.currentIndex];
				var _id = emailData.contacter.id;
				var _type = emailData.contacter.type;
				if (_id && _id > 0) {
					Can.util.canInterface('personProfile', [_type, _id]);
				}
			});
//			//quick reply button
//			.delegate('.send', 'click', function () {
//				var emailData = _this.items[_this.currentIndex];
//				var _content = $(this).siblings('input').val();
//				if ($.trim(_content).length) {
//					_this.sendEmail(Can.util.Config.email.sendEmail, {
//						msgId: _this.items[_this.currentIndex].messageId,
//						subject: Can.msg.MESSAGE_WINDOW.REPLY + emailData.subject,
//						referType: 'email',
//						receiver: emailData.contacter.id,
//						content: _content
//					});
//					$(this).siblings('input').val('');
//				}
//			})
//			//press Enter quick reply
//			.delegate('.quick-word', 'keydown', function (event) {
//				if (event.keyCode === 13) {
//					$(this).siblings('.send').trigger('click');
//				}
//			});
		_this.deleteBtn.on('onclick', function () {
			_this.deleteEmail(_this.wipeEmail);
		});
		_this.restoreBtn.on('onclick', function () {
			_this.restoreEmail();
		});
		_this.on('ON_DATA_LOADED', function () {
			_this.showLeftRight();
		});
		_this.stepBtn.onLeftClick(function () {
			if (_this.currentIndex > 0) {
				_this.showItem(--_this.currentIndex);
			}
			else {
				_this.dataParam['page'] = _this.minPage - 1;
				_this.loadData(_this.dataURL, _this.dataParam, true);
			}
		});
		_this.stepBtn.onRightClick(function () {
			if (_this.currentIndex < _this.items.length - 1) {
				_this.showItem(++_this.currentIndex);
			}
			else {
				_this.dataParam['page'] = ++_this.dataPage;
				_this.loadData(_this.dataURL, _this.dataParam);
			}
		});
	},
	createItem: function (oItem) {
		var verifyTips = "";
		if (oItem.contacter.auditStatus == 2) {
			//verifyTips = '<div class="verify-tips"><span>' + Can.msg.INFO_WINDOW.VERIFY_TIPS_NOTE + '</span>' + Can.msg.INFO_WINDOW.VERIFY_TIPS_UNV + '</div>';
		} else if (oItem.contacter.auditStatus == -1) {
			verifyTips = '<div class="verify-tips"><span>' + Can.msg.INFO_WINDOW.VERIFY_TIPS_NOTE + '</span>' + Can.msg.INFO_WINDOW.VERIFY_TIPS_DIS + '</div>';
		}

		var _html = '<div class="msg-item">' + verifyTips +
			'<div class="hd">' +
			'   <h1>' + oItem.subject + '</h1>' +
			'   <div class="tit-info">' + (oItem.actionType === 'send' ?
			'       <span class="txt-tit">' + Can.msg.MESSAGE_WINDOW.TO + '<em><a role="card">' + oItem.contacter.name + '</a></em></span>' :
			'       <span class="txt-tit">' + Can.msg.MESSAGE_WINDOW.FROM + '<em>' + (oItem.contacter.id > 0 ? '<a role="card">' + oItem.contacter.name + '</a>' : Can.msg.MODULE.MSG_CENTER.SYS_SENDER) + '</em></span>') +
			'       <span class="txt-tit">' + Can.msg.MESSAGE_WINDOW.TIME + '<em>' + Can.util.formatDateTime(oItem.longCreateDate, 'YYYY-MM-DD hh:mm') + '</em></span>' +
			'   </div>' +
			'</div>' +
			'<div class="email-wrap"></div>' +
			'<div class="email-extra"></div>' +
//			'<div class="quick-reply clear">' +
//			'   <span class="bg-ico ico-ms"></span>' +
//			'   <input type="text" class="quick-word" placeholder="' + Can.msg.MESSAGE_WINDOW.QUICK_RE_PD + '" />' +
//			'   <a class="send" href="javascript:;"><i class="bg-ico ico-inquiry"></i></a>' +
//			'</div>' +
			'<div class="tips  newtips" style="padding-left:20px;position:absolute;bottom:0 !important;color:#999;">'+
			'<span style="color:#e04d2c;font-weight:700">' + Can.msg.BL_DETAIL.TIP_TITLE_12 + ': </span>' + Can.msg.BL_DETAIL.TIP_MSG + '</div>' +
			'</div>';
		return $(_html);
	},
	showLeftRight: function () {
		//判断窗口的大小，如果小于1080时隐藏左右按钮
		var nWinWid = document.documentElement.clientWidth;
		if (nWinWid < 1080) {
			this.stepArea.hide();
		}
		else {
			var $Left = this.stepBtn.getDOM(0);
			var $Right = this.stepBtn.getDOM(1);
			this.stepArea.show();
			if (this.currentIndex === 0 && this.minPage === 1) {
				$Left.hide();
			}
			if (this.currentIndex === this.items.length - 1 && this.isEnd()) {
				$Right.hide();
			}
			//如果父级非body表示未插入到DOM之中
			if (this.stepArea[0].parentNode != document.body) {
				//将其插入到win的前面以显示在低一层
				this.stepArea.insertBefore(this.parentEl.win.el);
				//定位
				this.stepArea.css({
					top: this.contentEl.parent().offset().top,
					height: this.contentEl.parent().height()
				});
				//执行自动展开并且在1秒后收缩回去的动画
				this.stepArea.css('left', this.stepArea.offset().left);//fix chrome
				this.stepArea.animate({
					left: this.contentEl.parent().offset().left - $Left.outerWidth(true),
					width: this.contentEl.parent().width() + $Left.outerWidth(true) + $Right.outerWidth(true)
				}, 'slow', function () {
					$(this).css('z-index', 900);
					$Left.delay(1000).animate({
						left: $Left.outerWidth(true)
					});
					$Right.delay(1000).animate({
						right: $Right.outerWidth(true)
					});
				});
				//添加触发的事件
				this.stepArea.mouseenter(function () {
					$Left.stop().animate({
						left: 0
					});
					$Right.stop().animate({
						right: 0
					});
				});
				this.stepArea.mouseleave(function () {
					$Left.stop().delay(500).animate({
						left: $Left.outerWidth(true)
					});
					$Right.stop().delay(500).animate({
						right: $Right.outerWidth(true)
					});
				});
			}
		}
	},
	showItem: function (nIndex) {
		/*go to position*/
		var nPos = -nIndex * this.contentEl.innerWidth();
		//if first show then quick jump to position, else animate to position.
		if (this.isFirst) {
			this.isFirst = false;
			this.itemWrap.css('margin-left', nPos);
		}
		else {
			this.itemWrap.animate({
				marginLeft: nPos
			});
		}
		//check first item
		if (this.currentIndex === 0 && this.minPage === 1) {
			this.stepBtn.getDOM(0).hide();
		}
		else {
			this.stepBtn.getDOM(0).show();
		}
		//check last item
		if (this.currentIndex === this.items.length - 1 && this.isEnd()) {
			this.stepBtn.getDOM(1).hide();
		}
		else {
			this.stepBtn.getDOM(1).show();
		}
		/*read item*/
		var _item = this.items[this.currentIndex];
		var $CurrentItem = this.itemWrap.children('.msg-item').eq(this.currentIndex);
		//check msg actionType
		this.restoreBtn.hide();
		// if at inbox, system email has operation of content
		if (_item['label'] === 'inbox') {
			if (_item['system']) {
				this.replyBtn.hide();
				$CurrentItem.children('.quick-reply').hide();
				this.fireEvent('ON_SYS_EMAIL', _item, $CurrentItem.children('div.email-wrap'));
			}
		}
		else {
			this.replyBtn.hide();
			$CurrentItem.children('.quick-reply').hide();
			if (_item['label'] === 'trash') {
				this.restoreBtn.show();
			}
		}
		this.fireEvent('ON_READ_EMAIL', _item, $CurrentItem.children('div.email-wrap:empty'));
	},
	onReply: function (fFn) {
		if (typeof fFn === 'function') {
			this.replyBtn.on('onclick', fFn);
		}
	},
	update: function (aItems, bBefore) {
		var i, $Item;
		if (bBefore) {
			for (i = aItems.length - 1; i >= 0; i--) {
				$Item = this.createItem(aItems[i]);
				$Item.css('width', this.contentEl.innerWidth());
				this.itemWrap.prepend($Item);
			}
			this.itemWrap.css('margin-left', -this.contentEl.innerWidth() * aItems.length);
		}
		else {
			for (i = 0; i < aItems.length; i++) {
				$Item = this.createItem(aItems[i]);
				$Item.css('width', this.contentEl.innerWidth());
				this.itemWrap.append($Item);
			}
		}
		this.itemWrap.css('width', this.contentEl.innerWidth() * this.items.length);
		this.showItem(this.currentIndex);
	},
	restoreEmail: function () {
		var _this = this;
		$.ajax({
			url: Can.util.Config.email.restoreEmail,
			type: 'POST',
			data: {
				msgIds: _this.items[_this.currentIndex].messageId
			},
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					_this.tips.update('<p class="des">' + Can.msg.MODULE.MSG_CENTER.RESTORE_SUCCESS + '</p>');
					_this.tips.show();
					_this.tips.updateCss({
						'left': '50%',
						'margin-top': -10,
						'margin-left': -_this.tips.el.width() / 2
					});
					_this.tips.el.delay(1000).fadeOut();
					_this.itemWrap.children('.msg-item').eq(_this.currentIndex).hide('slow', function () {
						$(this).remove();
						var _msg_module = Can.Application.getModule('msgCenterModuleId');
						if (_msg_module) {
							_msg_module.fireEvent('ON_REFRESH_LIST');
						}
						if (_this.items.length === 0) {
							_this.parentEl.close();
						}
						else {
							_this.currentIndex = Math.min(_this.currentIndex, _this.items.length - 1);
							_this.showItem(_this.currentIndex);
						}
					});
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	},
	/**
	 * @param [bForever]
	 */
	deleteEmail: function (bForever) {
		var _this = this;
		$.ajax({
			url: bForever ? Can.util.Config.email.wipeEmail : Can.util.Config.email.deleteEmail,
			data: {
				msgIds: _this.items[_this.currentIndex].messageId
			},
			type: 'POST',
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					_this.fireEvent('ON_DELETE_EMAIL', _this.items[_this.currentIndex]);
					_this.items.splice(_this.currentIndex, 1);
					_this.tips.update('<p class="des">' + Can.msg.MESSAGE_WINDOW.DEL_TIPS + '</p>');
					_this.tips.show();
					_this.tips.updateCss({
						'left': '50%',
						'margin-top': -10,
						'margin-left': -_this.tips.el.width() / 2
					});
					_this.tips.el.delay(1000).fadeOut();
					_this.itemWrap.children('.msg-item').eq(_this.currentIndex).hide('fast', function () {
						$(this).remove();
						var _msg_module = Can.Application.getModule('msgCenterModuleId');
						if (_msg_module) {
							_msg_module.fireEvent('ON_REFRESH_LIST');
						}
						if (_this.items.length === 0) {
							_this.parentEl.close();
						}
						else {
							_this.currentIndex = Math.min(_this.currentIndex, _this.items.length - 1);
							_this.showItem(_this.currentIndex);
						}
					});
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	},
	sendEmail: function (sURL, jParam) {
		var _this = this;
		$.ajax({
			url: sURL,
			data: jParam,
			type: 'POST',
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					_this.tips.update('<p class="des">' + Can.msg.MESSAGE_WINDOW.QUICK_RE_TIPS + '</p>');
					_this.tips.show();
					_this.tips.updateCss({
						'left': '50%',
						'margin-top': -10,
						'margin-left': -_this.tips.el.width() / 2
					});
					_this.tips.el.delay(1000).fadeOut();
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	},
	isEnd: function () {
		return !this.dataPage || this.dataPage * 15 >= this.currentTotal;
	},
	findCurrent: function (aList, nId) {
		for (var i = 0; i < aList.length; i++) {
			if (aList[i].messageId === nId) {
				return i;
			}
		}
		return 0;
	},
	loadData: function (sURL, jParam, bBefore) {
		var _this = this;
		_this.dataParam = jParam;
		if (!_this.dataURL) {
			if (jParam.msgSource == 1) {
				_this.dataURL = Can.util.Config.email.readInbox;
			}
			else {
				_this.dataURL = Can.util.Config.email.readOutbox;
			}
		}
		if (jParam.msgSource == 3) {
			_this.wipeEmail = true;
		}
		$.ajax({
			url: sURL,
			data: Can.util.formatFormData(jParam),
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var jEmailData = jData.data;
					var aList = jEmailData.list || [jEmailData.item];
					if (!aList || !aList.length) {
						return;
					}
					//by first request, find a ID in data list index.
					_this.currentIndex = _this.currentIndex + (bBefore ? -1 : 1) || _this.findCurrent(aList, jParam.messageId);
					//local data last page number
					_this.dataPage = _this.dataPage || jEmailData.lastPage;
					//data total, compute the dataPage is end, by first request.
					_this.currentTotal = _this.currentTotal || jData.page.total;
					//local data first page number
					_this.minPage = Math.min(_this.minPage || 999999, jParam.page || 1);
					//add new data to old data
					if (bBefore) {
						_this.items = [].concat(aList, _this.items);
						_this.currentIndex += aList.length;
					}
					else {
						_this.items = _this.items.concat(aList);
					}
					//update message content
					_this.update(aList, bBefore);
					//load complete then fire event
					_this.fireEvent('ON_DATA_LOADED');
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	}
});
