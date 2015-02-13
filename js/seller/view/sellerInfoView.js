/**
 * Function Name
 * @Author: AngusYoung
 * @Version: 1.4
 * @Since: 13-1-24
 */

Can.view.sellerInfoView = Can.extend(Can.view.BaseView, {
	id: 'sellerInfoViewId',
	target: null,
	actionJs: ['js/seller/action/sellerInfoAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.sellerInfoView.superclass.constructor.call(this);

		this.profile = new Can.ui.Panel({cssName: 'm-profile clear'});
		//头像
		this.avatar = new Can.ui.Panel({
			cssName: 'user-pic',
			wrapEL: 'a',
			html: '<img />'
		});

		//信息
		this.info = new Can.ui.Panel({cssName: 'info'});

		this.part = new Can.ui.Panel({
			wrapEL: 'div',
			cssName: 'section'
		});
		//名字
		this.infoName = new Can.ui.Panel({
			cssName: 'name',
			wrapEL: 'div'
		});
		// Customer Level
		this.level = new Can.ui.Panel({
			cssName: 'level',
			wrapEL: 'div'
		});
		//地区
		this.infoCountry = new Can.ui.Panel({cssName: 'country'});
		//操作块
		this.opera = new Can.ui.Panel({cssName: 'opt'});
		//搜索buy lead
		this.opera_sb = new Can.ui.toolbar.Button({text: Can.msg.SELLER_INDEX.SEARCH_BL});

		//添加产品
		this.opera_ap = new Can.ui.toolbar.Button({text: Can.msg.SELLER_INDEX.ADD_PRO});
		//资料完善度
		this.integrity = new Can.ui.Panel({
			cssName: 'integrity',
			html: '<p>' + Can.msg.SELLER_INDEX.INFO_INTEGRITY + '</p>'
		});
		//进度条
		this.integrity_bar = new Can.ui.percentBar();
		//完善资料
		this.integrity_edit = new Can.ui.toolbar.Button({
			cssName: 'impro',
			text: Can.msg.SELLER_INDEX.IMPROVE
		});

		//
		this.static_iq = new Can.ui.toolbar.dataIdentButton({
			cssName: 'ico-msg',
			text: Can.msg.BUTTON['DATA_IDENT']['ACTIVITY'],
			tips: Can.msg.BUTTON['DATA_IDENT']['ACT_TIPS']
		});
		this.static_ip = new Can.ui.toolbar.dataIdentButton({
			cssName: 'ico-pro',
			text: Can.msg.BUTTON['DATA_IDENT']['PRODUCT'],
			tips: Can.msg.BUTTON['DATA_IDENT']['PRO_TIPS']
		});
		this.static_bl = new Can.ui.toolbar.dataIdentButton({
			cssName: 'ico-bl',
			text: Can.msg.BUTTON['DATA_IDENT']['BUYING_LEAD'],
			tips: Can.msg.BUTTON['DATA_IDENT']['BL_TIPS']
		});
		this.statistic = new Can.ui.Panel({
			cssName: 'm-statistic clear',
			items: [this.static_iq, this.static_ip, this.static_bl]
		});

	},
	startup: function () {
		if (this.target) {
			var _el = $('<div></div>');
			_el.addClass('acc-total clear');

			this.opera.addItem(this.opera_sb);
			this.opera.addItem($('<i>|</i>'));
			this.opera.addItem(this.opera_ap);

			this.integrity.addItem(this.integrity_bar);
			this.integrity.addItem(this.integrity_edit);

			this.part.addItem(this.infoName);
			this.part.addItem(this.level);

			this.info.addItem(this.part);
			this.info.addItem(this.infoCountry);
			this.info.addItem(this.opera);
			this.info.addItem(this.integrity);

			this.profile.addItem(this.avatar);
			this.profile.addItem(this.info);

			this.profile.applyTo(_el);
			this.statistic.applyTo(_el);
			_el.appendTo(this.target);
		}
	},
	loadData: function (sURL) {
		var _this = this;
		$.get(sURL, function (jData) {
			if (jData.status && jData.status === 'success') {
				_this.update(jData.data);
			}
			else {
				Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
			}
		});
	},
	update: function (jData) {
		if (jData) {
			this.avatar.update(Can.util.formatImage(jData.supplierPhoto, '120x120', (jData.gender * 1 === 2 ? 'female' : 'male')));
			this.infoName.update('<span autoCut="9">' + jData.supplierName + '</span>');
			Can.util.EventDispatch.dispatchEvent('ON_NEW_UI_APPEND', this.infoName.el);

			var i, item, id,
				MSG = Can.msg,
				MSG_level = MSG.MEMBER_LEVEL,
				sPackage = '',
				aServices = Can.util.userInfo().getServices('all');

			/*
			 aServices = [
			 {
			 expireTime: "2014-08-26 16:14:10.0",
			 id: 1
			 },
			 {
			 expireTime: "2014-08-26 16:14:10.0",
			 id: 2
			 },
			 {
			 expireTime: "2014-08-26 16:14:10.0",
			 id: 3
			 },
			 {
			 expireTime: "2014-08-26 16:14:10.0",
			 id: 4
			 },
			 {
			 expireTime: "2015-02-26 16:14:10.0",
			 id: 7
			 },
			 {
			 expireTime: "2014-03-26 16:14:10.0",
			 id: 8
			 },
			 {
			 expireTime: "2014-03-26 16:14:10.0",
			 id: 9
			 },
			 {
			 expireTime: "2014-03-26 16:14:10.0",
			 id: 10
			 },
			 {
			 expireTime: "2014-03-26 16:14:10.0",
			 id: 11
			 }
			 ]
			 */

			if (aServices.length) {
				for (i = 0; i < aServices.length; i++) {
					item = aServices[i];
					id = item.id;

					if (!item.expireTime) {
						continue;
					}
					sPackage += [
						'<li>',
						'<span class="member-level l' + id + '">',
						MSG_level[id],
						'</span>',
						'<span class="time">',
						MSG_level.L3 + ': ' + Can.util.formatDateTime(item.expireTime, 'YYYY-MM-DD'),
						'</span>',
						'</li>'
					].join('');
				}

				this.level.update([
					'<span class="divider">|</span>',
					'<span class="member-level l' + aServices[0].id + '">',
					MSG_level[aServices[0].id],
					'</span>',
					'<span class="arrow"></span>',
					'<div class="win-tips-s1 tip hide">',
					'<ul>',
					sPackage,
					'</ul>',
					'<span class="bg-ico arrow-t"></span>',
					'</div>'
				].join(''));
			}
			else {
				this.level.el.remove();
			}

			/*var _province = jData.provinceDistrictName;
			 var _city = jData.cityDistrictName;
			 var _district = [];
			 if (Can.util.Config.lang === 'en') {
			 _city && _district.push(_city);
			 _province && _district.push(_province);
			 }
			 else {
			 _province && _district.push(_province);
			 _city && _district.push(_city);
			 }*/
			this.infoCountry.update('<span class="flags fs' + jData.countryId + '"></span>' + Can.util.formatRegion(jData.region));
			this.integrity_bar.update(jData.supplierIntegrity);
			//this.static_iq.updateText(jData.inquiryMsg);
			this.static_ip.updateText(jData.improvableProd);
			this.static_bl.updateText(jData.buyingLead);
		}
	},
	onSearchBuyleadClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.opera_sb.on('onclick', fFn);
		}
	},
	onAddProClick: function (fFn) {
		if (typeof  fFn === 'function') {
			this.opera_ap.on('onclick', fFn);
		}
	},
	onEditClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.integrity_edit.on('onclick', fFn);
		}
	},
	onStIqClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.static_iq.on('onclick', fFn);
		}
	},
	onStIpClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.static_ip.on('onclick', fFn);
		}
	},
	onStBlClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.static_bl.on('onclick', fFn);
		}
	}
});
