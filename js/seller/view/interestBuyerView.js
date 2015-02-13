/**
 * Interest Buyer View
 * @Author: AngusYoung
 * @Version: 1.7
 * @Since: 13-4-8
 */

Can.view.interestBuyerView = Can.extend(Can.view.BaseView, {
	id: 'interestBuyerViewId',
	actionJs: ['js/seller/action/interestBuyerAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.interestBuyerView.superclass.constructor.call(this);
		this.person = new Can.ui.Panel({cssName: 'mod-person clear'});
		this.avatar = new Can.ui.Panel({cssName: 'pic'});
		this.info = new Can.ui.Panel({cssName: 'info'});

		this.matchInfo = new Can.ui.Panel({cssName: 'match-info'});
		this.purchase = new Can.ui.Panel({cssName: 'cat', html: '&nbsp;'});
		this.match = new Can.ui.Panel({cssName: 'mod-mch'});
		this.credit = new Can.ui.Panel({cssName: 'mod-crt'});

		this.act = new Can.ui.Panel({cssName: 'action'});
		this.btn = new Can.ui.toolbar.Button({
			cssName: 'btn btn-s10',
			text: Can.msg.BUTTON.PUSH_INFO
		});
		this.addEvents('ON_BUTTON_CLICK', 'ON_NAME_CLICK');
	},
	startup: function () {
		var _el = $('<li></li>');

		this.person.addItem([this.avatar, this.info]);
		this.matchInfo.addItem([this.purchase, this.match, this.credit]);
		this.act.addItem(this.btn);

		_el.append(this.person.el);
		_el.append(this.matchInfo.el);
		_el.append(this.act.el);

		this.el = _el;
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.btn.on('onclick', function () {
			_this.fireEvent('ON_BUTTON_CLICK');
		});
		_this.info.el.delegate('.name', 'click', function () {
			_this.fireEvent('ON_NAME_CLICK');
		});
	},
	update: function (jData) {
		this.dataId = jData.buyerId;
		this.dataName = jData.buyerFullName;
		this.avatar.update(Can.util.formatImage(jData.buyerPhoto, '60x60', jData.gender * 1 ? 'male' : 'female', jData.buyerFullName));
		this.info.update('<a href="javascript:;" class="name" title="' + jData.buyerFullName + '" autoCut="12">' + jData.buyerFullName + '</a><p class="country"><span class="flags fs' + jData.countryId + '"></span><span class="txt">' + jData.countryName + '</span></p>');
		if (jData.category) {
			//组装category字符
			var aCate = [];
			for (var i = 0, nLen = jData.category.length; i < nLen; i++) {
				aCate.push(jData.category[i].subCat);
			}
			var sCate = aCate.join(', ');
			this.purchase.update(Can.msg.PURCHASE + ':<strong>' + sCate + '</strong>');
		}
		this.match.update(Can.msg.MATCH + ':<strong>' + jData.buyerMatch + '%</strong>');
		this.match.el.addClass(fCountMatchLevel(jData.buyerMatch));
		this.match.el.attr('cantitle', Can.msg.CAN_TITLE.MATCH.replace('[@]', jData.buyerMatch));
		if (jData.buyerCredit) {
			this.credit.update(Can.msg.CREDIT + ':<strong>' + jData.buyerCredit + '</strong>');
			this.credit.el.addClass(fCountCreditLevel(jData.buyerCredit));
			this.credit.el.attr('cantitle', Can.msg.CAN_TITLE.CF_LEVEL.replace('[@]', jData.buyerCredit));
		}
		else {
			this.credit.el.hide();
		}
	}
});
