/**
 * @Author: AngusYoung
 * @Version: 1.7
 * @Update: 13-7-24
 */

$.moduleAndViewAction('matchBuyerModuleId', function (matchBuyer) {
	var nPage = 1;
	//是否动态加载
	var bAdd = false;
	//是否非手动搜索
	var bAuto = false;
	var _notCash = new Can.ui.barTips({
		hasClose: false,
		target: matchBuyer.searchBar.el,
		cssName: 'tips-s2',
		iconCss: 'ico'
	});
	var _matchTips = new Can.ui.barTips({
		hasClose: false,
		target: matchBuyer.searchBar.el,
		cssName: 'tips-s2 s21',
		iconCss: 'ico'
	});
	_matchTips.updateContent('<span>' + Can.msg.MATCH_TIPS + '</span>');
	_matchTips.el
		.on('click', '.mdi-pref', function () {
			Can.Application.getModule('userAccountView').fireEvent('onitemclick', {id: 3});
		})
		.on('click', '.add-pro', function () {
			$('#addPrdBtnId').trigger('click');
		});
	/*match tooltips layout*/
	var _match_tips = new Can.ui.tips({
		hasWaiting: true,
		cssName: 'win-tips-s3',
		mainCss: 'match-detail',
		arrowCss: 'arrow-r',
		width: 430
	});
	_match_tips.el.mouseleave(function () {
		_match_tips.hide();
	});
	_match_tips.on('ON_UPDATE_CONTENT', function () {
		var oDom = document.documentElement;
		var _dom_height = (oDom.scrollTop || document.body.scrollTop) + oDom.clientHeight;
		var _old_top = parseInt(this.el.css('top'), 10);
		var _hei = this.el.outerHeight();
		this.arrow.css({top: 20});
		if (_old_top + _hei > _dom_height) {
			var _top = _dom_height - _hei - 10;
			this.updateCss({
				top: _top
			});
			this.arrow.css({
				top: 20 + (_old_top - _top)
			});
		}
	});
	_match_tips.el.on('click', '.see-more a', function () {
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

	//指示是否在加载中
	var _isOnLoad = false;
	var _maxPage = 0;
	var _param = {};

	function __fLoad(jParam) {
		_isOnLoad = true;
		matchBuyer.loadData(Can.util.Config.seller.matchBuyerModule.matchBuyer, jParam);
	}


	function __fLoadCond() {
		$.ajax({
			url: Can.util.Config.seller.matchBuyerModule.searchCond,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					matchBuyer.updateSearchCond(jData.data);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	}

	function __fLoadLastAct(aData) {
		var aIds = [];
		for (var i = 0; i < aData.length; i++) {
			aIds.push(aData[i].buyerId);
		}
		$.ajax({
			url: Can.util.Config.seller.matchBuyerModule.buyerLastAct,
			data: Can.util.formatFormData({buyerIds: aIds}),
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var _data = jData.data;
					for (var v in _data) {
						$('#action-b' + v).append(Can.msg.MODULE.MATCH_BUYERS.BUYER_ACT.replace('[@]', _data[v]['eventTitle'])).show();
					}
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		})
	}

	matchBuyer.on('ON_HISTORY_CLICK', function (oBtn) {
		// 我的设置-推送统计
		/*Can.importJS(['js/seller/view/mySettingModule.js']);
		var mySetting = Can.Application.getModule('mySettingModuleId');
		if (!mySetting) {
			mySetting = new Can.module.mySettingModule();
			Can.Application.putModule(mySetting);
			mySetting.start();
		}
		mySetting.show();
		mySetting.goToURL(Can.util.Config.seller.mySetting.pushStatus);*/
		Can.Route.run('/setStatistics');
	});
	matchBuyer.on('ON_LOAD_DATA', function (aData, pageInfo, param) {
		if (!aData) {
			aData = [];
		}
		_isOnLoad = false;
		_maxPage = pageInfo.maxPage;
		_param = param;
		nPage = pageInfo.page;
		//console.log(aData)
		// console.log(pageInfo.page)

		this.contentEl.find('.load-more').remove();

		if (pageInfo.page == 1) {
			this.dataTable.tbody.find('tr').remove();
		}

		var coins = 0;

		//有数据
		if (aData.length) {
			if (this.notResult) {
				this.notResult.el.remove();
			}

			var dataTable = this.dataTable;
			var aReturnData = [];
			for (var i = 0; i < aData.length; i++) {
				aReturnData[i] = [];
				coins += Number(aData[i].coins);

				/*person*/
				var _pic = new Can.ui.Panel({
					cssName: 'pic',
					html: Can.util.formatImage(aData[i].buyerPhoto, '60x60', (aData[i].gender * 1 === 2 ? 'female' : 'male'))
				});
				var _info = new Can.ui.Panel({cssName: 'info'});
				var _info_name = new Can.ui.Panel({
					cssName: 'person-name',
					wrapEL: 'div'
				});
				var _name_text = aData[i].buyerFullName.replace(/\b\w+\b/g, function (s) {
					return s.substr(0, 1).toUpperCase() + s.substr(1);
				});
				var _info_name_btn = new Can.ui.toolbar.Button({
					text: _name_text
				});
				_info_name_btn.el.attr({
					'cid': aData[i].buyerId,
					'title': _name_text
				});
				_info_name_btn.on('onclick', function () {
					matchBuyer.fireEvent('ON_PERSON_NAME_CLICK', this.el.attr('cid'));
				});
				_info_name.addItem(_info_name_btn);
				var _info_country = new Can.ui.Panel({
					cssName: 'country',
					wrapEL: 'div'
				});
				var _flag = '<span class="flags fs' + aData[i].countryId + '"></span>';
				var _country = '<span class="txt" title="' + aData[i].countryName + '">' + aData[i].countryName + '</span>';
				_info_country.addItem([_flag, _country]);

				var _num = aData[i].numOfExh ? '<span class="person-noe" cantitle="' + Can.msg.CAN_TITLE.EXP_NUM.replace('[@]', aData[i].numOfExh) + '">' + aData[i].numOfExh + '</span>' : '';
				var _email = aData[i].isEmail ? '<span class="valid-mail" cantitle="' + Can.msg.CAN_TITLE.VALID_EMAIL + '"></span>' : '';
				var _phone = aData[i].isPhone ? '<span class="valid-phone" cantitle="' + Can.msg.CAN_TITLE.VALID_PHONE + '"></span>' : '';

				_info.addItem([_info_name, _info_country, _num, _email, _phone]);

				var _person = new Can.ui.Panel({
					cssName: 'ui-person',
					items: [_pic, _info]
				});

				var _match_detail = new Can.ui.Panel({
					cssName: 'win-tips-s1 clear'
				});

				/*sourcing range*/
				var _range = $('<div class="sourcing-range"></div>');
				if (aData[i].category) {
					_range.append('<p>' + Can.msg.MODULE.MATCH_BUYERS.SOURCING + '</p>');
					/*category*/
					var _cate_list = $('<div></div>');
					for (var j = 0, nLen = aData[i].category.length; j < nLen; j++) {
						var _item = aData[i].category[j];
						if (_item.leafCat && _item.leafCat.length) {
							var _dd = _item.leafCat.join('</dd><dd>');
							_cate_list.append('<dl><dt>' + _item.subCat + '</dt><dd>' + _dd + '</dd></dl>');
						}
						else {
							_cate_list.append('<dl><dt class="only">' + _item.subCat + '</dt></dl>');
						}
					}
					_range.append(_cate_list);
					_cate_list.children('dl').each(function () {
						if ($(this).find('dd').length > 5) {
							$(this).append('<dd class="notd">...</dd>');
						}
					});
					nLen > 3 && _range.append('<div class="see-more"><a>' + Can.msg.MODULE.MATCH_BUYERS.SEE_MORE + '</a></div>');
					_range.find('.see-more a').toggle(function () {
						$(this).parents('.sourcing-range').addClass('notmind');
						$(this).text(Can.msg.MODULE.MATCH_BUYERS.SEE_LESS);
					}, function () {
						$(this).parents('.sourcing-range').removeClass('notmind');
						$(this).text(Can.msg.MODULE.MATCH_BUYERS.SEE_MORE);
					});
				}
				/*sku*/
				var _sku = $('<div class="match-sku"><p class="focus">' + Can.msg.MODULE.MATCH_BUYERS.OTHER_FOCUS + '</p></div>');
				var _who = Can.msg.MODULE.MATCH_BUYERS['FOCUS_' + (aData[i].gender * 1 === 1 ? 'MALE' : 'FEMALE')];
				if (aData[i].sku && aData[i].sku.length) {
					var _focus;
					var _count = aData[i].sku.length;
					if (_count > 1) {
						_focus = Can.msg.MODULE.MATCH_BUYERS.FOCUS_DETS.replace('[@]', _who).replace('[@@]', aData[i].sku[0]).replace('[@@@]', _count - 1);
					}
					else {
						_focus = Can.msg.MODULE.MATCH_BUYERS.FOCUS_DET.replace('[@]', _who).replace('[@@]', aData[i].sku[0]);
					}
					_sku.append('<p cid="' + aData[i].buyerId + '">' + _focus + '</p>');
					_sku.on('click', '[role=buyer-sku-hit]', function () {
						matchBuyer.fireEvent('ON_SKU_CLICK', $(this.parentNode).attr('cid'));
					});
				}
				else {
					_sku = null;
				}

				/*match*/
				var _match = new Can.ui.Panel({
					cssName: 'refs-match ' + fCountMatchLevel(aData[i].buyerMatch, true),
					html: '<span class="ico-mth"></span><strong>' + Can.msg.MATCH + ': <em>' + aData[i].buyerMatch + '%</em></strong>'
				});
				_match.el.attr('buyerId', aData[i].buyerId);
				_match.el.hover(function () {
					var _el = $(this);
					var _top = _el.offset().top;
					var _left = _el.offset().left - _match_tips.width;
					if (_top + 60 > (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight) {
						return;
					}
					_match_tips.updateCss({top: _top, left: _left});
					_match_tips.show();
					if (_el.data('matchData')) {
						_match_tips.updateContent(_el.data('matchData'));
					}
					else {
						$.ajax({
							url: Can.util.Config.seller.matchBuyerModule.matchDetail,
							data: Can.util.formatFormData({buyerId: _el.attr('buyerId')}),
							consoleError: false,
							success: function (jData) {
								if (jData.status && jData.status === 'success') {
									var _data = jData.data;
									var _cate = '';
									for (i = 0, nLen = _data.productMatchInfo.length; i < nLen; i++) {
										_cate += '<p><span>[' + _data.productMatchInfo[i].subCat + ']</span>' + (_data.productMatchInfo[i].leafCat && _data.productMatchInfo[i].leafCat.join(', ')) + '</p>';
									}
									var _replace_bgr = {
										"Area": {order: 0, label: Can.msg.INFO_WINDOW.MARKET},
										"Participations": {order: 1, label: Can.msg.INFO_WINDOW.PART},
										"Business Nature": {order: 2, label: Can.msg.INFO_WINDOW.NATURE},
										"Lately Participation": {order: 3, label: Can.msg.INFO_WINDOW.LATELY},
										"Company Type": {order: 4, label: Can.msg.INFO_WINDOW.TYPE}
									};
									var _bgr_array = [];
									for (var w in _data.backgroundMatchInfo) {
										if (_data.backgroundMatchInfo[w] && _replace_bgr[w]) {
											_replace_bgr[w].value = _data.backgroundMatchInfo[w];
											_bgr_array.push(_replace_bgr[w]);
										}
									}
									_bgr_array.sort(function (a, b) {
										return a.order < b.order;
									});
									var _bgr = '';
									for (var i = 0; i < _bgr_array.length; i++) {
										_bgr += '<li><span>' + _bgr_array[i].label + '</span>' + _bgr_array[i].value + '</li>';
									}
									var _html = '' +
										'<div class="match-percent">' +
										'    <div class="match-icon"><span class="mod-mch ' + fCountMatchLevel(_data.generalScore) + '"></span></div>' +
										'    <div class="match-intro">' +
										'        <div>' + Can.msg.INFO_WINDOW.MATCH + '<strong>' + _data.generalScore + '%</strong></div>' +
										'        <span class="match-product">' + Can.msg.INFO_WINDOW.MATCH_PRO + '</span>' +
										'        <span class="match-background">' + Can.msg.INFO_WINDOW.MATCH_BG + '</span>' +
										'    </div>' +
										'</div>' +
										'<dl class="match-list">' +
										'    <dt>' + Can.msg.INFO_WINDOW.PRO_TITLE + '<span>' + _data.productScore + '%</span></dt>' +
										'    <dd class="product-ls">' + _cate + '<div class="see-more"><a>' + Can.msg.MODULE.MATCH_BUYERS.SEE_MORE + '</a></div></dd>' +
										'    <dt>' + Can.msg.INFO_WINDOW.BG_TITLE + '<span>' + _data.backgroundScore + '%</span></dt>' +
										'    <dd>' +
										'        <ul>' + _bgr + '</ul>' +
										'    </dd>' +
										'</dl>';

									_match_tips.updateContent(_html);
									_el.data('matchData', _html);
								}
								else {
									Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
								}
							}
						});
					}
				}, function (event) {
					if (!$.contains(_match_tips.el[0], event.relatedTarget)) {
						_match_tips.hide();
					}
				});

				/*opt*/
				var _opt = new Can.ui.Panel({cssName: 'opt'});
				var _opt_btn = new Can.ui.toolbar.iconButton({
					cssName: 'ui-btn btn-gray-2',
					iconCss: 'bg-ico ico-push',
					text: Can.msg.BUTTON.PUSH_INFO
				});
				_opt_btn.el
					.attr({
						'cid': aData[i].buyerId,
						'cname': aData[i].buyerFullName
					})
					.on('mouseenter', function () {
						$(this).next('.g-coins').show();
					})
					.on('mouseleave', function () {
						$(this).next('.g-coins').hide();
					});
				_opt_btn.on('onclick', function () {
					matchBuyer.fireEvent('ON_PUSH_BTN_CLICK', {
						'buyerId': this.el.attr('cid'),
						'buyerName': this.el.attr('cname')
					});
				});
				var _opt_price = new Can.ui.Panel({
					cssName: 'g-coins',
					wrapEL: 'div',
					html: Can.msg.NEED_COINS.replace('[@]', aData[i].coins)
				});
				_opt.addItem([_opt_btn, _opt_price]);

				_match_detail.addItem([_range, _match, _opt, _sku, '<span class="bg-ico arrow-l"></span>']);

				/*buyer action*/
				var _action = $('<div id="action-b' + aData[i].buyerId + '" class="buyer-action"><span class="mic"></span></div>');

				var _wrap = new Can.ui.Panel({
					cssName: null
				});
				_wrap.addItem([_match_detail, _action]);

				aReturnData[i].push(_person.el);
				aReturnData[i].push(_wrap.el);
			}
			_matchTips.show();
			//如果余额低于xx时出现
			//if(){
//			aData.sort(function (a, b) {
//				return a.coins > b.coins;
//			});
//			_notCash.updateContent('<span>' + Can.msg.COINS_NOT_ENOUGH.replace('[@]', aData[0].coins) + '</span>');
//			_notCash.show();
			//}
			//load last activity
			__fLoadLastAct(aData);
			dataTable.update(aReturnData);

			// 加入分页处理
			//console.log(pageInfo)
			if (pageInfo.maxPage > pageInfo.page) {
				var pageEl = $('<a href="javascript:;" class="load-more">' + Can.msg.MODULE.MATCH_BUYERS.LOAD_MORE + '</a>');
				pageEl.appendTo(this.contentEl);
				pageEl.click(function () {
					pageEl.remove();
					nPage++;
					bAdd = true;
					_param.page = nPage;
					__fLoad(_param);
					return false;
				})
			}
		}
		//没有数据
		else {

			if (this.notResult) {
				this.notResult.el.remove();
			}

			//自动加载
			if (bAdd) {
				//TODO what?
				if (bAuto) {

				}
				else {
					//loading max data
					var _tips = new Can.ui.barTips({
						target: this.dataTable.el,
						cssName: 'tips-s2',
						iconCss: 'ico'
					});
					var _creditNow = new Can.ui.toolbar.Button({text: Can.msg.CREDIT_NOW});
					_tips.updateContent('<span>' + Can.msg.COINS_NOT_ENOUGH.replace('[@]', 90) + '</span>', true);
					_tips.updateContent(_creditNow, true);
				}
			}
			//手动搜索没数据
			else {

				/*not data and new action*/
				var _notResultBtn = new Can.ui.toolbar.Button({cssName: 'btn btn-s10'});
				if (bAuto) {
					//主动搜索
					this.notResult = new Can.ui.Panel({cssName: 'fil-none'});
					_notResultBtn.updateHtml(Can.msg.BUTTON.RETURN_LIST);
					_notResultBtn.on('onclick', function () {
						bAdd = false;
						bAuto = false;
						__fLoad();
					});
					this.notResult.addItem(['<p class="txt2">' + Can.msg.NOT_SEARCH_RESULT + '</p>', '<p class="txt3">' + Can.msg.NOT_SEARCH_SUGGEST + '</p>', _notResultBtn]);
				}
				else {
					//手动搜索
					this.dataTable.tbody.find('tr').remove();
					this.notResult = new Can.ui.Panel({cssName: 'data-none'});
					_notResultBtn.updateHtml(Can.msg.BUTTON.SEARCH_BL);
					_notResultBtn.on('onclick', function () {
						//matchBuyer.searchBtn.el.trigger('click');
						//跳转到采购需求
						$('#funToolbarContainerId').find('#buyingLeadBtnId').click();
					});
					this.notResult.addItem(['<p class="txt2">' + Can.msg.NOT_MATCH_BUYER + '</p>', '<p class="txt3">' + Can.msg.NOT_MATCH_BUYER_SUGGEST + '</p>', _notResultBtn]);
				}
				this.notResult.applyTo(this.contentEl);
			}
		}
	});
	matchBuyer.on('ON_PERSON_NAME_CLICK', function (nID) {
		Can.util.canInterface('personProfile', [2, nID]);
	});
	matchBuyer.on('ON_SKU_CLICK', function (nID) {
		Can.util.canInterface('personProfile', [2, nID, 3]);
	});
	matchBuyer.on('ON_PUSH_BTN_CLICK', function (jBuyer) {
		var _data = {
			buyerId: jBuyer.buyerId,
			buyerName: jBuyer.buyerName
		};
		Can.util.canInterface('pushInfo', [_data]);
	});
	matchBuyer.on('ON_SEARCH_CLICK', function () {
		var _category = this.categoryField.getValue();
		var _region = this.regionField.getValue();
		var _numOfExh = this.numOfExhField.getValue();
		var _recently = this.recentlyField.getValue();
		var _compType = this.compTypeField.getValue();
		var _level = this.levelField.getValue();
		//设为手动搜索状态
		bAuto = false;
		$(this).find(".mod-table").remove();
		__fLoad({
			page: 1,
			category: _category || '',
			region: _region || '',
			numberOfExhibition: _numOfExh || '',
			recently: _recently || '',
			companyType: _compType || '',
			purchaserLevel: _level || ''
		});
	});

	$(function () {
		__fLoadCond();
		__fLoad();
	});
});
