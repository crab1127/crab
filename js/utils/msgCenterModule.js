/**
 * message center
 * @Author: sam
 * @Version: 1.4
 * @Update: 13-7-30
 */

Can.module.msgCenterModule = Can.extend(Can.module.BaseModule, {
	id: 'msgCenterModuleId',
	title: Can.msg.MODULE.MSG_CENTER.TITLE,
	requireUiJs: ['js/utils/msgCenterView.js', 'js/utils/msgCenterMenuView.js'],
	currentView: null,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.module.msgCenterModule.superclass.constructor.call(this);
		this.container = new Can.ui.Panel({cssName: 'mod-col clear'});
	},
	startup: function () {
		Can.module.msgCenterModule.superclass.startup.call(this);

		this.menuView = new Can.view.msgCenterMenuView({
			parentEl: this,
			unreadNumUrl: Can.util.Config.seller.messageCenter.unreadMsgNum
		});
		this.menuView.start();

		this.inboxView = new Can.view.msgCntInboxView({parentEl: this});
		this.inboxView.start();
		this.inboxView.setMessageData();

		this.outboxView = new Can.view.msgCntOutboxView({parentEl: this});
		this.outboxView.start();
		this.outboxView.el.hide();

		this.spamboxView = new Can.view.msgCntSpamboxView({parentEl: this});
		this.spamboxView.start();
		this.spamboxView.el.hide();

		this.container.addItem(this.menuView.el);//添加模块菜单
		this.container.addItem(this.inboxView.el);//inbox view
		this.container.addItem(this.outboxView.el);//outbox view
		this.container.addItem(this.spamboxView.el);//spambox view

		this.container.applyTo(this.contentEl);

		var _this = this;
		_this.currentView=_this.inboxView;
		_this.container.el.on('click', '[role=quick-pager]', function () {
			var oView = _this.currentView;
			var $this = $(this), offset = $this.data('turn') === 'next' ? 1 : -1, page = oView.node.page;

			if ($this.hasClass('dis')) {
				return;
			}
			page.val(page.val() * 1 + offset);
			oView.setMessageData();
		});
	},
    runByRoute: function(){
  
        if(this._oRoutRule && this._oRoutRule.route){
            switch(this._oRoutRule.route[0]){
                case '/msg-center/outbok':
                    $('#msg-center-outbox').click();
                    break;
                case '/msg-center/trash': 
                    $('#msg-center-trash').click();
                    break;
            }
        }
        
    }
});
