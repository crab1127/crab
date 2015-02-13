/**
 * user information box
 * @Author: AngusYoung
 * @Version: 2.1
 * @Since: 13-4-13
 *
 */

Can.view.userInfoBoxView = Can.extend(Can.view.BaseView, {
	id: 'userInfoBoxViewId',
	actionJs: ['js/utils/userInfoBoxAction.js'],
	requireUiJs: ['js/utils/userGradeView.js'],
	currentPerson: {},
	firstTab: 0,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.userInfoBoxView.superclass.constructor.call(this);
		this.addEvents('ON_MY_REQUEST', 'ON_TIPS_CLICK');
		this.contentEl = $('<div></div>');
		/*tips*/
		this.operaTips = new Can.ui.textTips({
			id: 'msgTips',
			cssName: 'tips-s1',
			iconCss: 'ico',
			arrowIs: 'Y',
			isOpposite: true,
			target: this.parentEl.win.el,
			hasIcon: true,
			hasArrow: false
		});
		this.operaTips.updateCss({
			'z-index': 901
		});
		/*action area*/
		//IM 按钮 
		this.chatBtn = new Can.ui.toolbar.iconButton({
			cssName: 'ui-btn btn-s btn-gray hidden',
			iconCss: 'bg-ico ico-chat',
			text: Can.msg.IM.OFFLINE
		});
		var that = this;
		this.chatBtn.el.data('setStatus', function (status) {
			that.setChatStatus(status);
		});
		//Can.util.bindIM.add(this.chatBtn.el);
		//this.chatBtn.el.data('setStatus')('online');
		//设置 IM 按钮状态为在线
		//this.setChatStatus('online');
		//绑定 IM 按钮事件, 注: 只在在线状态下才触发. 回调返回 Can.view.userInfoBoxView
		//this.onChatBtnClick(function(view){})
		this.pushBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.PUSH_INFO_TO_HIM
		});
		this.contactBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.CONTACT_NOW
		});
		this.addContactBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.ADD_CONTACT
		});
		this.actionEl = new Can.ui.Panel({
			cssName: 'win-action ali-r'
		});
	},
	startup: function () {
		this.contentEl.addClass(this.cssName);

		this.tabPage = new Can.ui.tabPage({
			isCache: true,
			cssName: 'box-cont',
			tabCss: 'propell-hd',
			tabData: this.tabs,
			innerCss: 'tab-s4 clear',
			pageCss: 'propell-bd',
			pageData: this.pages
		});
		this.contentEl.append(this.tabPage.el);
		this.actionEl.applyTo(this.contentEl);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.contentEl
			.on('click', '.view a', function () {
				_this.fireEvent('ON_MY_REQUEST', _this.currentPerson);
			})
			.on('click', '.tips-s2 .des a', function () {
				_this.fireEvent('ON_TIPS_CLICK', $(this).attr('action'), this);
				return false;
			})
			.on('click', '.see-more a', function () {
				var _parent = $(this).parents('dd');
				if (_parent.hasClass('auto')) {
					$(this).text(Can.msg.MODULE.MATCH_BUYERS.SEE_MORE);
					_parent.scrollTop(0);
					_parent.removeClass('auto');
				}
				else {
					$(this).text(Can.msg.MODULE.MATCH_BUYERS.SEE_LESS);
					_parent.addClass('auto');
				}
				return false;
			});
	},
	//设置IM状态
	setChatStatus: function (status) {
		var el = this.chatBtn.el;
		if (status === 'online') {
			el.html('<i class="bg-ico ico-chat-online"></i>' + Can.msg.IM.CHAT_NOW);
		}
		else {
			el.html('<i class="bg-ico ico-chat"></i>' + Can.msg.IM.OFFLINE);
		}
	},
	onAddContactBtnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.addContactBtn.on('onclick', fFn);
		}
	},
	onPushBtnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.pushBtn.on('onclick', fFn);
		}
	},
	onContactBtnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.contactBtn.on('onclick', fFn);
		}
	},
	onActivityTabClick: function (fFn) {
		var _this = this;
		if (typeof fFn === 'function' && _this.currentPerson['userType'] === 2) {
			_this.tabPage.on('ON_SWITCH', function (oObj, nIndex) {
				if (nIndex == _this.tabPage.tabData.length - 1) {
					fFn.call(oObj);
				}
			});
		}
	},
	onFollowSaveBtnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.followSaveBtn && this.followSaveBtn.on('onclick', fFn);
		}
	},
	showTips: function (sContent) {
		/*tips*/
		this.operaTips.update('<p class="des">' + sContent + '</p>');
		this.operaTips.show();
		this.operaTips.updateCss({
			'left': '50%',
			'margin-top': -10,
			'margin-left': -this.operaTips.el.width() / 2
		});
		this.operaTips.el.delay(1000).fadeOut();
	},
	parseContent: function (jData) {
		/**
		 * 0: 未建立联系
		 * 1: 建立联系但保密，未添加联系人
		 * 2: 建立联系但保密，已添加为联系人
		 * 3: 建立联系完全公开，未添加联系人
		 * 4: 建立联系完全公开，已添加为联系人
		 */
		var nType = jData['socialType'];
		this.currentPerson['userType'] = jData['userType'];

		switch (nType) {
			case 1:
				this.actionEl.addItem([this.contactBtn, this.addContactBtn]);
				break;
			case 2:
				this.actionEl.addItem(this.chatBtn);
				this.actionEl.addItem(this.contactBtn);
				//绑定IM
				Can.util.bindIM.add(this.chatBtn.el, this.currentPerson.userId);
				break;
			case 3:
				this.actionEl.addItem([this.contactBtn, this.addContactBtn]);
				break;
			case 4:
				this.actionEl.addItem(this.chatBtn);
				this.actionEl.addItem(this.contactBtn);
				//绑定IM
				Can.util.bindIM.add(this.chatBtn.el, this.currentPerson.userId);
				break;
			default :
				this.actionEl.addItem(this.pushBtn);
		}
		this.tabs = [];
		this.pages = [];
		var i, j;

        // '审核提示信息'
        var verifyTips = '';
        if(jData.auditStatus == 2){
            verifyTips = '<div class="verify-tips"><i class="icons mark"></i>'+Can.msg.INFO_WINDOW.VERIFY_TIPS_UNV+'</div>';
        }else if(jData.auditStatus == -1){
            verifyTips = '<div class="verify-tips"><i class="icons mark"></i>'+Can.msg.INFO_WINDOW.VERIFY_TIPS_DIS+'</div>';
        }

		for (var v in jData) {
			var _html = '';
			var _data = jData[v];
			switch (v) {
				case 'baseInfo':
					var _dataProfile = _data.profile;
					if (!_dataProfile.length) {
						break;
					}
					this.currentPerson['userGender'] = _dataProfile[0].gender.toUpperCase() === 'MALE' ? 1 : 2;
					var _profileTD = [], _profilePD = [];
					_profileTD.push(this.currentPerson['userType'] === 1 ? Can.msg.INFO_WINDOW.SUPPLIER_PROFILE : Can.msg.INFO_WINDOW.BUYER_PROFILE);
					if (_dataProfile.length === 2 && nType > 0) {
						_profileTD.push(Can.msg.INFO_WINDOW.COMPANY_PROFILE);
					}
					for (i = 0; i < _dataProfile.length; i++) {
						var _profileData = _dataProfile[i];
						var _profileArray = [];
						var _profilePrototype = {
							/*           */gender_0: {order: 1, label: Can.msg.INFO_WINDOW.GENDER},
							/*         */position_0: {order: 2, label: Can.msg.INFO_WINDOW.POSTS},
							/*            */email_0: {order: 3, label: Can.msg.INFO_WINDOW.EMAIL},
							/*            */phone_0: {order: 5, label: Can.msg.INFO_WINDOW.PHONE},
							/*              */fax_0: {order: 6, label: Can.msg.INFO_WINDOW.FAX},
							/*          */address_0: {order: 7, label: Can.msg.INFO_WINDOW.ADDRESS},
							/*         */postCode_0: {order: 8, label: Can.msg.INFO_WINDOW.ZIP},
							/*            */skype_0: {order: 4, label: Can.msg.INFO_WINDOW.SKYPE},
							/*             */logo_1: {order: 0, label: 'logo'},
							/*          */company_1: {order: 1, label: Can.msg.INFO_WINDOW.COMPANY},
							/*      */typeOfBuyer_1: {order: 2, label: Can.msg.INFO_WINDOW.TYPE_BUYER},
							/*    */companyNature_1: {order: 3, label: Can.msg.INFO_WINDOW.NATURE_BUYER},
							/* */companyFoundYear_1: {order: 4, label: Can.msg.INFO_WINDOW.ESTABLISHMENT_TIME},
							/*        */employees_1: {order: 5, label: Can.msg.INFO_WINDOW.EMPLOYEES},
							/*    */yearBuyingAmt_1: {order: 6, label: Can.msg.INFO_WINDOW.ANNUAL},
							/*          */address_1: {order: 7, label: Can.msg.INFO_WINDOW.ADDRESS},
							/*         */postCode_1: {order: 8, label: Can.msg.INFO_WINDOW.ZIP},

							/*      */companyType_1: {order: 2, label: Can.msg.INFO_WINDOW.TYPE_SUPPLIER},
							/*     */mainProducts_1: {order: 3, label: Can.msg.INFO_WINDOW.MAIN_PRODUCT},
							/*            */staff_1: {order: 4, label: Can.msg.INFO_WINDOW.STAFF},
							/**/registeredCapital_1: {order: 5, label: Can.msg.INFO_WINDOW.REGISTERED},
							/*        */telephone_1: {order: 8, label: Can.msg.INFO_WINDOW.PHONE},
							/*              */fax_1: {order: 9, label: Can.msg.INFO_WINDOW.FAX}
						};
						for (var u in _profileData) {
							//console.log(u, u + '_' + i)
							var _ = u + '_' + i;
							if (_profilePrototype[_]) {
								_profilePrototype[_].key = u;
								_profilePrototype[_].value = _profileData[u];
								if (typeof _profilePrototype[_].value === 'string') {
									_profilePrototype[_].value = _profilePrototype[_].value.replace(/\|/g, ' ')
										.replace(/,(?=[^\s])/g, ', ');
									_profilePrototype[_].value = _profilePrototype[_].value.length > 396 ? _profilePrototype[_].value.substr(0, 393) + '...' : _profilePrototype[_].value;
								}
								_profileArray.push(_profilePrototype[_]);
							}
						}
						_profileArray.sort(function (a, b) {
							return a.order > b.order;
						});

						var _ss = '<div class="txt-info-s1">';
						for (var k = 0; k < _profileArray.length; k++) {
							var _itemData = _profileArray[k];
							if (!_itemData) {
								continue;
							}
							var w = _profileArray[k].key;
							if (w === 'logo' && _itemData.value) {
								_ss = '<div class="cpy-logo"><img src="' + Can.util.formatImgSrc(_itemData.value, 120, 70) + '"></div>' + _ss;
							}
							else {
								if (w === 'email') {
									this.currentPerson['userEmail'] = _itemData.value;
								}
								if (w === 'gender') {
									_ss += '<p class="txt-tit">' + _itemData.label + '<em>' + _itemData.value + '</em></p>';
								}
								else if (_itemData.value && _itemData.value.toUpperCase() !== 'SECRECY') {
									_ss += '<p class="txt-tit">' + _itemData.label + '<em>' + _itemData.value + '</em></p>';
								}
							}
						}
						_ss += '</div>';
						_profilePD.push($('<div class="' + (i == 0 ? 'buyer-info' : 'company-info') + '">' + _ss + '</div>'));
					}
					var _profileTab = new Can.ui.tabPage({
						isNotAnimate: true,
						cssName: 'ext',
						tabCss: 'hd',
						tabData: _profileTD,
						innerCss: 'tab-page',
						pageCss: 'bd',
						pageData: _profilePD
					});
					_profilePD[_profilePD.length - 1].hide();
					//未完全公开信息，插入提示
					if (nType < 3) {
						_profileTab.el.append('<div class="tips-s2">' +
							(nType > 0 ?
								Can.msg.INFO_WINDOW.PRIVACY_APPLY
									.replace(/\[@\]/g, Can.msg.INFO_WINDOW[this.currentPerson['userGender'] === 1 ? 'APPLY_MALE' : 'APPLY_FEMALE'])
									.replace('[@@]', _data.userName) :
								Can.msg.INFO_WINDOW.PRIVACY
									.replace(/\[@\]/g, Can.msg.INFO_WINDOW[this.currentPerson['userGender'] === 1 ? 'APPLY_MALE' : 'APPLY_FEMALE'])
									.replace('[@@]', _data.coins)
								)
							+ '</div>');
					}
					var _dd = '';
					for (j = 0; j < _data.dataList.length; j++) {
						var _dl = _data.dataList[j];
						_dd += '<p class="bg-ico txt-tit face-s' + _dl.level + '">' + _dl.label + '<em autoCut="146">' + (_dl.countryId ? '<span class="flags fs' + (_dl.countryId || '') + '"></span>' : '') + _dl.text + '</em></p>';
					}
					/*供应商查看采购商的个人信息展示*/
					if (this.currentPerson['userType'] === 2) {
						var _data_list = _data.dataList;
						var _cate = '';
						var countryMeta = '';
						var nLen;
						for (i = 0, nLen = _data_list.productMatchInfo.length; i < nLen; i++) {
							_cate += '<p><span>[' + _data_list.productMatchInfo[i].subCat + ']</span>' + (_data_list.productMatchInfo[i].leafCat && _data_list.productMatchInfo[i].leafCat.join(', ')) + '</p>';
						}
						var _replace_bgr = {
							"Area": {order: 0, label: Can.msg.INFO_WINDOW.MARKET},
							"Participations": {order: 1, label: Can.msg.INFO_WINDOW.PART},
							"Business Nature": {order: 2, label: Can.msg.INFO_WINDOW.NATURE},
							"Lately Participation": {order: 3, label: Can.msg.INFO_WINDOW.LATELY},
							"Company Type": {order: 4, label: Can.msg.INFO_WINDOW.TYPE}
						};
						var _bgr_array = [];
						for (var l in _data_list.backgroundMatchInfo) {
							if (_data_list.backgroundMatchInfo[l] && _replace_bgr[l]) {
								_replace_bgr[l].value = _data_list.backgroundMatchInfo[l];
								_bgr_array.push(_replace_bgr[l]);
							}
						}
						_bgr_array.sort(function (a, b) {
							return a.order > b.order;
						});
						var _bgr = '';
						for (i = 0; i < _bgr_array.length; i++) {
							_bgr += '<li><span>' + _bgr_array[i].label + '</span>' + _bgr_array[i].value + '</li>';
						}

						if (_data.countryId) {
							countryMeta = '' +
								'                   <span class="flags fs' + (_data.countryId || '') + '"></span>' +
								'                   <span class="txt" title="' + (_data.countryName || '') + '">' + (_data.countryName || '') + '</span>';
						}
						_html = '' +
							'<div class="con">' +
							'   <div class="mod-person ui-person">' +
							'           <div class="pic">' + Can.util.formatImage(_data.userPhoto, '60x60', this.currentPerson['userGender'] === 1 ? 'male' : 'female', _data.userName) + '</div>' +
							'           <div class="info">' +
							'               <div class="person-name">' +
							'                   <a title="' + _data.userName + '">' + _data.userName + '</a>' +
							'               </div>' +
							'               <div class="country">' +
							countryMeta +
							'               </div>' +
							(_data.numOfExh ? ' <span class="person-noe" cantitle="' + Can.msg.CAN_TITLE.EXP_NUM.replace('[@]', _data.numOfExh) + '">' + _data.numOfExh + '</span>' : '') +
							(_data.isEmail ? ' <span class="valid-mail" cantitle="' + Can.msg.CAN_TITLE.VALID_EMAIL + '"></span>' : '') +
							(_data.isPhone ? ' <span class="valid-phone" cantitle="' + Can.msg.CAN_TITLE.VALID_PHONE + '"></span>' : '') +
							//'               <div class="mod-crt ' + fCountCreditLevel(_data.credit) + '" cantitle="' + Can.msg.CAN_TITLE.CF_LEVEL.replace('[@]', (_data.credit || '')) + '">' + Can.msg.CREDIT + ':<em>' + (_data.credit || '') + '</em></div>' +
							'           </div>' +
							'       </div>' +
							'<div class="match-percent">' +
							'    <div class="match-icon"><span class="mod-mch ' + fCountMatchLevel(_data_list.generalScore) + '"></span></div>' +
							'    <div class="match-intro">' +
							'        <div>' + Can.msg.INFO_WINDOW.MATCH + '<strong>' + _data_list.generalScore + '%</strong>' +
							'           <span class="bg-ico ico-help" cantitle="' + Can.msg.CAN_TITLE.HOW_COUNT + '"></span>' +
							'       </div>' +
							'        <span class="match-product">' + Can.msg.INFO_WINDOW.MATCH_PRO + '</span>' +
							'        <span class="match-background">' + Can.msg.INFO_WINDOW.MATCH_BG + '</span>' +
							'    </div>' +
							'</div>' +verifyTips+
							'<dl class="match-list">' +
							'    <dt>' + Can.msg.INFO_WINDOW.PRO_TITLE + '<span>' + _data_list.productScore + '%</span></dt>' +
							'    <dd class="product-ls">' + _cate + (nLen > 2 ? '<div class="see-more"><a>' + Can.msg.MODULE.MATCH_BUYERS.SEE_MORE + '</a></div>' : '') + '</dd>' +
							'    <dt>' + Can.msg.INFO_WINDOW.BG_TITLE + '<span>' + _data_list.backgroundScore + '%</span></dt>' +
							'    <dd>' +
							'        <ul>' + _bgr + '</ul>' +
							'    </dd>' +
							'</dl>' +
							'</div>';
					}
					/*采购商查看供应商的个人信息*/
					else {
						_html = '' +
							'<div class="con">' +
							'   <div class="hd">' +
							'       <div class="match">' +
							'           <div class="refs-match ' + fCountMatchLevel(_data.match, true) + '">' +
							'               <span class="ico-mth"></span>' +
							'               <div class="mth-info">' +
							'                   <p class="tit">' + Can.msg.MATCH + ':</p>' +
							'                   <p class="num">' + _data.match + '%</p>' +
							'               </div>' +
							'           </div>' +
							'           <p class="view"><a href="javascript:;">' + Can.msg.INFO_WINDOW.PREFERENCE + '</a></p>' +
							'       </div>' +
							'       <div class="mod-person clear">' +
							'           <div class="pic">' + Can.util.formatImage(_data.userPhoto, '60x60', this.currentPerson['userGender'] === 1 ? 'male' : 'female', _data.userName) + '</div>' +
							'           <div class="info">' +
							'               <p class="name">' +
							'                   <a>' + _data.userName + '</a>' +
							'               </p>' +
							'               <p class="country">' +
							'                   <span class="flags fs' + (_data.countryId || '') + '"></span>' +
							'                   <span class="txt" title="' + Can.util.formatRegion(_data.region,"town") + '">' + Can.util.formatRegion(_data.region,"town") + '</span>' +
							//(_data.numOfExh ? ' <span class="mth" cantitle="' + Can.msg.CAN_TITLE.EXP_NUM.replace('[@]', _data.numOfExh) + '">' + _data.numOfExh + '</span>' : '') +
							'               </p>' +
							'               <div class="mod-crt ' + fCountCreditLevel(_data.credit) + '" cantitle="' + Can.msg.CAN_TITLE.CF_LEVEL.replace('[@]', (_data.credit || '')) + '">' + Can.msg.CREDIT + ':<em>' + (_data.credit || '') + '</em></div>' +
							'           </div>' +
							'       </div>' +
							'   </div>' +
							'   <div class="bd">' +
							'       <div class="txt-info-s2">' + _dd + '</div>' +
							'   </div>' +
							'</div>';
					}
					this.currentPerson['userName'] = _data.userName;
					this.currentPerson['IM'] = _data.userName;
					this.tabs[0] = Can.msg.INFO_WINDOW.BASE_INFO;
					this.pages[0] = $('<div class="tab-cont p-base clear"></div>').append(_profileTab.el).append(_html);
					break;
				case 'follow':
					if (!_data) {
						break;
					}
					this.userGradeForm = new Can.view.userGradeView({
						cssName: 'tab-cont p-follow',
						gradeCss: 'mod-form-s1',
						tagCss: 'impression-eva clear',
						groupCss: 'f-group clear',
						maxHeight: 145
					});
					var _aLabel = [];
					var _aValue = [];
					var _normal;
					for (i = 0; i < _data.group.length; i++) {
						var ww = _data.group[i];
						if (!_normal && ww.isSelect) {
							_normal = ww.groupId;
						}
						_aLabel.push(ww.groupName);
						_aValue.push(ww.groupId);
					}
					this.userGradeForm.setContent({
						gradeData: _data.form,
						tagData: _data.remarks,
						groupData: {
							normal: _normal,
							labelItems: _aLabel,
							valueItems: _aValue
						}
					});
					var _follow = this.userGradeForm.contentEl;
					//Save button
					var $SaveNode = $('<div style="margin-left: 140px;"></div>');
					this.followSaveBtn = new Can.ui.toolbar.Button({
						cssName: 'ui-btn btn-s btn-gray',
						text: Can.msg.BUTTON.SAVE
					});
					this.followSaveBtn.applyTo($SaveNode);
					$SaveNode.appendTo(_follow);

					this.tabs[1] = Can.msg.INFO_WINDOW.FOLLOW;
					this.pages[1] = _follow;
					break;
				case 'evaluate':
					//TODO 坐等数据有返回？
					var _evaluate = $('<div class="tab-cont p-evaluate"></div>');
					//未完全公开信息，插入提示
					if (nType < 3) {
						_evaluate.append('<div class="tips-s2">' + (nType > 0 ? Can.msg.INFO_WINDOW.PRIVACY_APPLY.replace(/\[@\]/g, Can.msg.INFO_WINDOW[this.currentPerson['userGender'] === 1 ? 'APPLY_MALE' : 'APPLY_FEMALE']) : Can.msg.INFO_WINDOW.PRIVACY.replace('[@]', Can.msg.INFO_WINDOW[this.currentPerson['userGender'] === 1 ? 'APPLY_MALE' : 'APPLY_FEMALE'])) + '</div>');
					}
					this.tabs.push(Can.msg.INFO_WINDOW.EVALUATE);
					this.pages.push(_evaluate);
					break;
			}
		}
		this.currentPerson['userType'] === 2 && this.attActivity();
	},
	attActivity: function () {
		var _this = this;
		var _tab_cont = $('<div class="tab-cont p-activity"><div class="activity-all-list"></div></div>');
		var _list = _tab_cont.children('.activity-all-list');
		$.ajax({
			url: Can.util.Config.seller.profileWindow.getSku,
			data: {
				buyerId: _this.currentPerson['userId']
			},
			async: false,
			consoleError: false,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var _data = jData.data;
					if (!_data || !_data.length) {
						return;
					}
					var _sku = $('<div class="buyer-sku"><ul></ul></div>');
					var $Ul = _sku.find('ul');
					for (var i = 0, nLen = _data.length; i < nLen; i++) {
						$Ul.append('<li class="industry-ico industry-i' + _data[i].industryId + '"><span class="bg-ico arrow-l"></span><dl><dt>[' + _data[i].industryName + ']</dt><dd>' + _data[i].skuList + '</dd></dl></li>');
					}
					$Ul.css('width', 400 * _data.length);
					$Ul
						.on('mouseenter', 'dl', function () {
							var $this = $(this);
							var _hei = $this.innerHeight();
							if (_hei > 120) {
								var _mt = (_hei - 120) / 2;
								$this.addClass('hover').css('margin-top', -_mt);
							}
						})
						.on('mouseleave', 'dl', function () {
							$(this).removeClass('hover').removeAttr('style');
						});
					_list.append(_sku);
					_sku.before('<h4>' + _this.currentPerson['userName'] + Can.msg.INFO_WINDOW.SKU_TITLE + '</h4>');
					if (_data.length > 2) {
						_sku.before('<span role="sku-left" class="bg-ico sku-arrow-l disable"></span>');
						_sku.before('<span role="sku-right" class="bg-ico sku-arrow-r"></span>');
					}
					_list.on('click', function (event) {
						var $Hit = $(event.target);
						if ($Hit.attr('role') && !$Hit.hasClass('disable')) {
							_this.fireEvent('ON_SKU_TURN', $Hit, $Ul);
						}
					});
				}
			}
		});
		_list.append('<h4>' + Can.msg.INFO_WINDOW.ACTIVITY_TITLE + '</h4><div class="data-none"><p class="txt2">' + Can.msg.INFO_WINDOW.ACTIVITY_EMPTY + '</p></div>');
		_list.find('.data-none').hide();
		_this.tabs.push(Can.msg.INFO_WINDOW.ACTIVITY);
		_this.pages.push(_tab_cont);
	},
	getFollowData: function () {
		return this.userGradeForm.getValue();
	},
	loadData: function (sURL, jParam) {
		var _this = this;
		_this.dataURL = sURL || _this.dataURL;
		$.ajax({
			url: sURL,
			data: jParam,
			cache: false,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var _data = jData.data;
					_this.parseContent(_data);
					_this.start();
					Can.util.EventDispatch.dispatchEvent('ON_NEW_UI_APPEND', _this.contentEl);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	}
});


Can.view.webCantonBuyerInfoView = Can.extend(Can.view.BaseView, {
	id: 'webCantonBuyerInfoViewId',
	actionJs: ['js/utils/webCantonBuyerInfoAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.webCantonBuyerInfoView.superclass.constructor.call(this);
		this.addEvents('ON_CONTACT');
		this.contentEl = $('<div></div>');
	},
	startup: function () {
		var me = this;
		this.contentDetailEl = $('<div></div>').attr("class", "con_webBL");

		this.contentDetailEl.appendTo(this.contentEl);

	},
	setData: function (param) {
		var me = this;
		if (param.buyerName)
			$('<p>' + Can.msg.MODULE.CF_BUYER_INFO.CONTACT + ':<em>' + param.buyerName + '</em>' + '</p>').attr("class", "order-info").appendTo(this.contentDetailEl);
		if (param.countryName) {
			var _countryId = param.countryId;
			var _countryLogo = "";
			if (_countryId) {
				_countryLogo = '<span class="flags fs' + (_countryId || '') + '"></span>'
			}
			$('<p>' + Can.msg.MODULE.CF_BUYER_INFO.COUNTRY + ':<em>' + _countryLogo + param.countryName + '</em>' + '</p>').attr("class", "order-info").appendTo(this.contentDetailEl);
		}
		if (param.companyName)
			$('<p>' + Can.msg.MODULE.CF_BUYER_INFO.COMPANY + ':<em>' + param.companyName + '</em>' + '</p>').attr("class", "order-info").appendTo(this.contentDetailEl);
		if (param.email)
			$('<p>' + Can.msg.MODULE.CF_BUYER_INFO.EMAIL + ':<em>' + param.email + '</em>' + '</p>').attr("class", "order-info").appendTo(this.contentDetailEl);
		if (param.telephone)
			$('<p>' + Can.msg.MODULE.CF_BUYER_INFO.TELEPHONE + ':<em>' + param.telephone + '</em>' + '</p>').attr("class", "order-info").appendTo(this.contentDetailEl);
		if (param.fax)
			$('<p>' + Can.msg.MODULE.CF_BUYER_INFO.FAX + ':<em>' + param.fax + '</em>' + '</p>').attr("class", "order-info").appendTo(this.contentDetailEl);
//        if(param.Address)
//            $('<p>'+Can.msg.MODULE.CF_BUYER_INFO.FAX + ':<em>'+param.Address+'</em>' + '</p>').attr("class", "fa").appendTo(this.contentDetailEl);

		//---  按钮
		this.sendEmailBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.CONTACT_BTN
		});
		this.sendEmailBtn.el.attr("href", "mailto:" + param.email);
		this.actionEl = $('<div></div>').attr("class", "win-action ali-r");
		this.sendEmailBtn.el.appendTo(this.actionEl);
		this.actionEl.appendTo(this.contentEl);
		//---   按钮
	},
	loadData: function (sURL, param) {
		var me = this;
		$.ajax({
			url: sURL,
			data: param,
			success: function (resultData) {
				if (resultData.status && resultData.status === "success") {
					me.setData(resultData.data);
				}
			}
		})

	}
});
