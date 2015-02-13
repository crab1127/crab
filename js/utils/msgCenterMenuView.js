/**
 * message center
 * @Author: sam
 * @Version: 1.1
 * @Update: 13-7-17
 */

Can.view.msgCenterMenuView = Can.extend(Can.view.BaseView, {
	id: 'msgCenterMenuViewID',
	parentEl: null,
	unreadNumUrl: null,
	requireUiJs: ['js/utils/msgCenterMenuAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.msgCenterMenuView.superclass.constructor.call(this);
		this.addEvents('ON_INBOX_CLICK', 'ON_OUTBOX_CLICK', 'ON_SPAMBOX_CLICK', 'ON_COMPOSE_CLICK');
	},
	startup: function () {
		var _this = this;
		//main容器
		this.el = $('<div></div>');
		this.el.attr('class', 'extra');
		//menu容器
		this.opt_menu_box = new Can.ui.Panel({ cssName: 'site-nav'});
		this.composeBtn = $('<a class="btn-compose" href="javascript:;"><i class="bg-ico"></i>' + Can.msg.MODULE.MSG_CENTER.COMPOSE + '</a>');
		this.opt_menu_box.addItem(this.composeBtn);
		//
		this.itme_nav = new Can.ui.Panel({ cssName: 'nav-item'});
		this.mark_nav = new Can.ui.Panel({ cssName: 'bg-ico cur-mark'});
		this.mark_nav.el.attr("style", "top:18px");
		//
		this.ul_nav = $('<ul class="my-apps"></ul>');
		this.item_one = $('<li id="msg-center-inbox"></li>');
		this.item_one_a = $('<a class="cur" href="javascript:;"><span class="bg-ico c-inbox"></span>' + Can.msg.MODULE.MSG_CENTER.INBOX + '</a>');
		this.unread_number = $('<em></em>');
		this.item_one_a.append(this.unread_number);
		this.item_one.append(this.item_one_a);
		this.item_two = $('<li id="msg-center-outbox"></li>');
		this.item_two_a = $('<a class="" href="javascript:;"><span class="bg-ico c-send"></span>' + Can.msg.MODULE.MSG_CENTER.OUTBOX + '</a>');
		this.item_two.append(this.item_two_a);
		this.item_thr = $('<li id="msg-center-trash"></li>');
		this.item_thr_a = $('<a class="" href="javascript:;"><span class="bg-ico c-spam"></span>' + Can.msg.MODULE.MSG_CENTER.SPAM + '</a>');
		this.item_thr.append(this.item_thr_a);
		this.ul_nav.append(this.item_one);
		this.ul_nav.append(this.item_two);
		this.ul_nav.append(this.item_thr);

		this.composeBtn.click(function () {
			_this.fireEvent("ON_COMPOSE_CLICK", _this.opt_menu_box)
		});

		this.item_one.click(function () {
			_this.fireEvent("ON_INBOX_CLICK", _this.item_one);
		});
		this.item_two.click(function () {
			_this.fireEvent("ON_OUTBOX_CLICK", _this.item_two);
		});
		this.item_thr.click(function () {
			_this.fireEvent("ON_SPAMBOX_CLICK", _this.item_thr);
		});

		this.itme_nav.addItem(this.mark_nav);
		this.itme_nav.addItem(this.ul_nav);

		this.opt_menu_box.addItem(this.itme_nav);
		this.el.append(this.opt_menu_box.el);
	},
	setUnreadNum: function () {
		var me = this;
		$.ajax({
			url: me.unreadNumUrl,
			data: null,
			success: function (resultObj) {
				if (resultObj.status && resultObj.status == "success") {
					me.updateNewMsg(resultObj.data.total);
                    if (resultObj.data.attention == false) {
                        me.hideAttentionMsg();
                    }else if(resultObj.data.attention){ //恢复邮件时可能显示出attention
                        me.showAttentionMsg();
                    }
				}
			}
		})
	},
	updateNewMsg: function (nNewNum) {
		if (nNewNum) {
			this.unread_number.text('(' + nNewNum + ')');
		}
		else {
			this.unread_number.text('');
		}
	},
    hideAttentionMsg:function(){
            $("#msgBtnId").removeClass("attention-msg");
    },
    showAttentionMsg:function(){
        $("#msgBtnId").addClass("attention-msg");
    }
});
