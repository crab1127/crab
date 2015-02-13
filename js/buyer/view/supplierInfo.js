/**
 * Supplier Info view
 * @Author: AngusYoung
 * @Version: 1.7
 * @Since: 13-9-12
 */

Can.view.SupplierInfo = Can.extend(Can.view.BaseView, {
	id: 'supplierInfo',
	userId: null,
	actionJs: ['js/buyer/action/supplierInfoAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.SupplierInfo.superclass.constructor.call(this);
		this.addEvents('ON_PRO_TURN', 'ON_CONTACT_CLICK', 'ON_PRODUCT_CLICK');
		this.contentEl = $('<div></div>');
		this.userInfo = $('<div class="sup-info"></div>');
		this.productTab = $('<div class="child-tab"></div>');
		this.contactTab = $('<div class="child-tab"></div>');
		this.introTab = $('<div class="child-tab"></div>');
		this.visitTab = $('<div class="child-tab"></div>');
		this.menuTab = new Can.ui.tabPage({
			tabCss: 'sup-win-opera',
			innerCss: 'new-card',
			itemCss: 'ico-c',
			pageCss: 'sup-win-content',
			tabData: [Can.msg.INFO_WINDOW.TAB.PRODUCT, Can.msg.INFO_WINDOW.TAB.CONTACT, Can.msg.INFO_WINDOW.TAB.INTRO, Can.msg.INFO_WINDOW.TAB.BOOTH],
			pageData: [this.productTab, this.contactTab, this.introTab, this.visitTab]
		});
	},
	startup: function () {
		var _this = this;
		_this.contentEl.addClass(_this.cssName);
		_this.menuTab.applyTo(_this.contentEl);
		_this.menuTab.tabWrap.prepend(_this.userInfo);
		_this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.menuTab.pageWrap
			.on('click', 'a[role=contact]', function () {
				_this.menuTab.showTab(1);
				_this.fireEvent('ON_CONTACT_CLICK', _this.menuTab.currentIndex);
			})
			.on('click', 'a[role=product]', function () {
				_this.fireEvent('ON_PRODUCT_CLICK', $(this).attr('pid'));
			});
		_this.menuTab.on('ON_SWITCH', function (a, b) {
			if (b === 1) {
				_this.fireEvent('ON_CONTACT_CLICK');
			}
		});
	},
	updateInfo: function (jData) {
		if (!jData) {
			return;
		}
		var sTemplate = '' +
			'<div class="sup-avatar{cantonFair}">{avatar}</div>' +
			'<div class="sup-name">{name}</div>' +
			'<div>{data.companyName}</div>' +
			'<div class="sup-country"><span class="flags fs{countryId}"></span>{address}</div>' +
			'';
		var jModel = {
			avatar: Can.util.formatImage(jData.profile.avatar, '90x90', (jData.contact.gender === 1 ? 'male' : jData.contact.gender === 2 ? 'female' : ''), 'ss'),
			cantonFair: jData.profile.cantonfair ? ' canton-fair' : '',
			name: jData.profile.legalPerson,
			data: {companyName: jData.profile.companyName},
			countryId: jData.profile.countryId
		};
		if (Can.util.Config.lang === 'en') {
			jModel.address = jData.profile.region;
		}
		else {
			jModel.address = jData.profile.region;
		}
		this.userId = jData.profile.userId;
		this.userInfo.append(Can.util.templateParse(sTemplate, jModel));
	},
	updateData: function (jData) {
		var _this = this;
		_this.updateInfo(jData);
		var sTemp;
		for (var v in jData) {
			sTemp = '';
			var jModel = jData[v];
			jModel && (jModel.lang = Can.msg.INFO_WINDOW);
			switch (v) {
				case 'product':
					if (!jModel) {
						_this.productTab.append('<div class="sup-not-data"><p class="not-tips">' + Can.msg.INFO_WINDOW.NOT_PRODUCT + '</p><p>' + Can.msg.INFO_WINDOW.SUGGEST_ACTION + '</p></div>');
						break;
					}
					if (jModel.mainProduct && jModel.mainProduct.length) {
						jModel.mainProduct = jModel.mainProduct.slice(0, 3);
						sTemp += '<dl class="main-pro"><dt>{lang.MAIN_PRODUCT}</dt><dd pc-repeat="mainProduct">{i}</dd></dl>';
					}
					if (jModel.productList && jModel.productList.length) {
						Can.importJS(['js/utils/stepBtnView.js']);
						var _stepBtn = new Can.view.stepBtnView({
							css: ['pro-left disable', 'pro-right']
						});
						_stepBtn.start();
						_stepBtn.onLeftClick(function () {
							if (!this.el.hasClass('disable')) {
								_this.fireEvent('ON_PRO_TURN', _stepBtn, this.el, 1);
							}
						});
						_stepBtn.onRightClick(function () {
							if (!this.el.hasClass('disable')) {
								_this.fireEvent('ON_PRO_TURN', _stepBtn, this.el, 2);
							}
						});

						jModel.leftRight = $('<div></div>');
						if (jModel.productList.length > 2) {
							_stepBtn.applyTo(jModel.leftRight);
						}
						for (var i = 0, nLen = jModel.productList.length; i < nLen; i++) {
							jModel.productList[i].productImg = Can.util.formatImgSrc(jModel.productList[i].productImg, 150, 150);
							jModel.productList[i]['new'] = jModel.productList[i].newProduct ? '<span class="ico-new" cantitle="' + Can.msg.CAN_TITLE.NEW_PRODUCT + '"></span>' : '';
						}
						sTemp += '<div class="product-list">{leftRight}<ul><li pc-repeat="productList"><a href="javascript:;" pid="{i.productId}" role="product"><img src="{i.image}" /></a><a href="javascript:;" pid="{i.productId}" class="pro-text" role="product"><span>{i.productName}</span>{i.new}</a></li></ul></div>';
					}
					_this.productTab.append(Can.util.templateParse(sTemp, jModel));
					break;
				case 'contact':
					var _profile_array = [];
					var _profile_prototype = {
						/* */gender: {order: 1, label: Can.msg.INFO_WINDOW.GENDER},
						/*  */position: {order: 2, label: Can.msg.INFO_WINDOW.POSTS},
						/*  */email: {order: 3, label: Can.msg.INFO_WINDOW.EMAIL},
						/*    */telephone: {order: 5, label: Can.msg.INFO_WINDOW.PHONE},
						/*    */fax: {order: 6, label: Can.msg.INFO_WINDOW.FAX},
						/**/address: {order: 7, label: Can.msg.INFO_WINDOW.ADDRESS}
					};
					for (var u in jModel) {
						if (_profile_prototype[u]) {
							_profile_prototype[u].key = u;
							_profile_prototype[u].value = u === 'gender' && jModel[u] ? (jModel[u] === 1 ? Can.msg.INFO_WINDOW.MALE : Can.msg.INFO_WINDOW.FEMALE ) : jModel[u];
							if (_profile_prototype[u].value) {
								_profile_array.push(_profile_prototype[u]);
							}
						}
					}
					_profile_array.sort(function (a, b) {
						return a.order > b.order;
					});
					sTemp = '<div class="txt-info-s1"><p class="txt-tit" pc-repeat="array">{i.label}<em>{i.value}</em></p></div>';
					_this.contactTab.append(Can.util.templateParse(sTemp, {array: _profile_array}));
					break;
				case 'intro':
					if (!jModel || (!jModel.description && !jModel.brandExp)) {
						_this.introTab.append('<div class="sup-not-data"><p class="not-tips">' + Can.msg.INFO_WINDOW.NOT_INTRO + '</p><p>' + Can.msg.INFO_WINDOW.SUGGEST_ACTION + '</p></div>');
						break;
					}
					if (jModel.description) {
						sTemp += '<div class="sup-des">{description}</div>';
					}
					if (jModel.brandExp) {
						sTemp += '<dl class="brand-exp"><dt>{lang.BRAND_EXP}</dt><dd class="c{__index}" pc-repeat="brandExp">{i}</dd></dl>';
					}
					_this.introTab.append(Can.util.templateParse(sTemp, jModel));
					break;
				case 'exhibit':
					if (!jModel || !jModel.length) {
						_this.visitTab.append('<div class="sup-not-data"><p class="not-tips">' + Can.msg.INFO_WINDOW.NOT_BOOTH + '</p><p>' + Can.msg.INFO_WINDOW.SUGGEST_ACTION + '</p></div>');
						break;
					}
					jModel.sort(function (a, b) {
						return a['times'] < b['times'];
					});
					// 暂只显示一届
					jModel = jModel[0];
					sTemp = '';
					if (jModel.booth && jModel.booth.length) {
						sTemp += '<div class="sup-exhibit"><h4>' + Can.msg.INFO_WINDOW.BOOTH_TIT + '</h4>' +
							'<dl><dt>' + Can.msg.INFO_WINDOW.BOOTH_TIPS.replace('[@]', '{times}') + '</dt>' +
							'<dd pc-repeat="booth">' + Can.msg.INFO_WINDOW.PHASE.replace('[@]', '{i.periodNum}') + '<span>{i.actualBoothNo}</span></dd>' +
							'</dl></div>';
					}
					if (jModel.view && jModel.view.length) {
						sTemp += '<ul class="sup-exh-view"><li pc-repeat="view"><img src="{i}" /></li></ul>';
					}
					if (jModel['360view']) {
						sTemp += '<a href="' + Can.util.Config.buyer.profileWindow['360url'] + '{companyId}" target="_blank" class="sup-exh-360"><img src="{360view}" /></a>';
					}
					jModel.companyId = jData.profile.companyId;
					_this.visitTab.append(Can.util.templateParse(sTemp, jModel));
					break;
			}
		}
	},
	loadData: function (sURL, jParam) {
		var _this = this;
		$.ajax({
			url: sURL || Can.util.Config.buyer.profileWindow.supplierProfile,
			data: jParam,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var _data = jData.data;
					_this.updateData(_data);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	}
});