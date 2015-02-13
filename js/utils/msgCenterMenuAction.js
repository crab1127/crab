/**
 * message center
 * @Author: sam
 * @Version: 1.2
 * @Update: 13-7-24
 */
$.moduleAndViewAction('msgCenterMenuViewID', function (msgCenterMenu) {
	msgCenterMenu.setUnreadNum();
	msgCenterMenu.on('ON_INBOX_CLICK', function (contactersID) {
		Can.Route.mark('/msg-center');
		msgCenterMenu.parentEl.outboxView.el.slideUp();
		msgCenterMenu.parentEl.spamboxView.el.slideUp();
		msgCenterMenu.item_one_a.addClass("cur");
		msgCenterMenu.item_two_a.removeClass("cur");
		msgCenterMenu.item_thr_a.removeClass("cur");
		msgCenterMenu.mark_nav.el.animate({top: "18px"}, "slow");
		//msgCenterMenu.parentEl.inboxView.tableNav.tbody.empty();

		var node = msgCenterMenu.parentEl.inboxView.node;
		node.page.val(1);
		node.label.val('inbox');

		msgCenterMenu.parentEl.inboxView.setMessageData('');
		msgCenterMenu.parentEl.inboxView.el.slideDown();
		msgCenterMenu.parentEl.currentView = msgCenterMenu.parentEl.inboxView;
	});
	msgCenterMenu.on('ON_OUTBOX_CLICK', function (contactersID) {
		Can.Route.mark('/msg-center/outbok');
		msgCenterMenu.parentEl.inboxView.el.slideUp();
		msgCenterMenu.parentEl.spamboxView.el.slideUp();
		msgCenterMenu.item_one_a.removeClass("cur");
		msgCenterMenu.item_two_a.addClass("cur");
		msgCenterMenu.item_thr_a.removeClass("cur");
		msgCenterMenu.mark_nav.el.animate({top: "55px"}, "slow");

		var node = msgCenterMenu.parentEl.outboxView.node;
		node.page.val(1);
		node.label.val('outbox');

		msgCenterMenu.parentEl.outboxView.el.slideDown();
		msgCenterMenu.parentEl.outboxView.setMessageData('');
		msgCenterMenu.parentEl.currentView = msgCenterMenu.parentEl.outboxView;
	});
	msgCenterMenu.on('ON_SPAMBOX_CLICK', function () {
		Can.Route.mark('/msg-center/trash');
		msgCenterMenu.parentEl.inboxView.el.slideUp();
		msgCenterMenu.parentEl.outboxView.el.slideUp();
		msgCenterMenu.item_one_a.removeClass("cur");
		msgCenterMenu.item_two_a.removeClass("cur");
		msgCenterMenu.item_thr_a.addClass("cur");
		msgCenterMenu.mark_nav.el.animate({top: "90px"}, "slow");

		var node = msgCenterMenu.parentEl.spamboxView.node;
		node.page.val(1);
		node.label.val('spam');

		msgCenterMenu.parentEl.spamboxView.el.slideDown();
		msgCenterMenu.parentEl.spamboxView.setMessageData('');
		msgCenterMenu.parentEl.currentView = msgCenterMenu.parentEl.spamboxView;
	});
	msgCenterMenu.on('ON_COMPOSE_CLICK', function () {
		Can.util.canInterface('writeEmail', [Can.msg.MESSAGE_WINDOW.WRITE_TIT]);
	});

});
