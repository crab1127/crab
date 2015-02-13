/**
 * @Author: AngusYoung
 * @Version: 1.4
 * @Update: 13-4-13
 */

$.moduleAndViewAction('activeMapViewId', function (activeMap) {
	/* show NFC id buyer information */
	var buyerView = function (id) {

		var panel = new Can.view.titleWindowView({
			title: Can.msg.INFO_WINDOW.BUYER_TIT,
			width: 980,
			height: 380
		});

		$.ajax({
			url: '/cfone/cfbuyersupplieractivity/getBuyerInfoByNfcId.cf',
			data: {
				nfcId: id
			},
			success: function (d) {
				viewCard(d);
			}
		});

		var viewCard = function (d) {
			var participation,
				data = d['data'];

			if (d['status'] !== 'success') {
				card = 'Can\'t find buyer\'s card';
			} else {
				participation = data.buyerParticipation || 1;
				participation_recently = participation > 5 ? 5 : participation;
				card = [
					'<div class="info-box win-propelling">',
					'<div class="box-cont">',
					'<div class="propell-bd">',
					'<div class="tab-cont p-base clear" style="display: block;">',
					'<div class="ext">',
					'<div class="hd">',
					'<ul class="tab-page">',
					'<li class="cur" style="" tpindex="0">Buyer Profile</li>',
					'</ul>',
					'</div>',
					'<div class="bd">',
					'<div class="buyer-info" style="display: block;">',
					'<div class="txt-info-s1">',
					'<p class="txt-tit">email :<em>' + data.email + '</em></p>',
					'<p class="txt-tit">phone :<em>' + data.telephone + '</em></p>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'<div class="con">',
					'<div class="hd">',
					'<div class="mod-person clear">',
					'<div class="pic">' + Can.util.formatImage(data.buyerLogo, '60x60', 'male') + '</div>',
					'<div class="info">',
					'<p class="name">',
					'<a>' + data.buyerName + '</a>',
					'</p>',
					'<p class="country">',
					'<span class="flags fs' + data.countryId + '"></span>',
					'<span class="txt">' + data.countryEnName + '</span>',
					'</p>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'<div class="bd">',
					'<div class="txt-info-s2"><p class="bg-ico txt-tit face-s9">Area<em>',
					'<span class="flags fs' + data.countryId + '"></span>' + data.countryEnName + '</em></p>',
					'<p class="bg-ico txt-tit face-s9">Type<em>' + data.buyerTypeEnName + '</em></p>',
					'<p class="bg-ico txt-tit face-s9">Participations<em>' + participation + '</em></p>',
					'<p class="bg-ico txt-tit face-s9">Lately Participation',
					'<em>Nearly 5 times in the ' + participation_recently + ' Canton Fair</em></p>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'</div>'
				].join('');
			}

			panel.setContent(card);
			panel.show();
		}
	};

	/**
	 * Item Name click event
	 */
	function __fNameClick(nBuyerId) {
		var _id = parseInt(nBuyerId, 10);
		//if NFCid then
		if (isNaN(_id)) {
			buyerView(nBuyerId);
		}
		else {
			Can.util.canInterface('personProfile', [2, nBuyerId]);
		}
	}

	/**
	 * Item Button click event
	 */
	function __fBtnClick(event) {
		var jBuyer = this.el.data('btnData');
		/**
		 * 0: Push Info
		 * 1: Contact Now
		 * 2: View Detail
		 */
		var _data;
		switch (parseInt(jBuyer.action, 10)) {
			case 0:
				_data = {
					buyerId: jBuyer.buyerId,
					buyerName: jBuyer.buyerName
				};
				Can.util.canInterface('pushInfo', [_data]);
				break;
			case 1:
				var _id = parseInt(jBuyer.buyerId, 10);
				//if NFCid then
				if (isNaN(_id)) {
					buyerView(jBuyer.buyerId);
				}
				else {
					_data = {
						address: {
							value: jBuyer.buyerId,
							text: jBuyer.buyerName
						}
					};
					Can.util.canInterface('writeEmail', [Can.msg.MESSAGE_WINDOW.WRITE_TIT, _data]);
				}
				break;
			case 2:
				Can.util.canInterface('readEmail', [
					{messageId: jBuyer.eventId},
					true
				]);
				break;
			default :
				Can.util.canInterface('whoSay');
		}
	}

	//地图的点切换后，加载对应的数据
	activeMap.on('ON_CHANGE', function () {
		activeMap.cls();
		activeMap.loadData(Can.util.Config.seller.indexModule.activeMap, activeMap.isAllData ? {timeRange: 7} : {timeRange: 7, searchType: 'me'});
	});

	var _tips = new Can.ui.tips({
		target: activeMap.el,
		hasWaiting: true,
		cssName: 'win-tips-s1',
		width: 480
	});
	_tips.el.mouseenter(function () {
		clearTimeout(xTimer);
	});
	_tips.el.mouseleave(function () {
		_tips.hide();
		xTimer = setTimeout(__fAutoShow, 4000);
	});
	// 弹出层的事件委派，对里面的a元素进行相应的操作
	_tips.el.delegate('a', 'click', function () {
		if ($(this).attr('actionType')) {
			var aAction = $(this).attr('actionType').split(':');
			var sTitle = $(this).text();
			var nId = aAction[1];
			switch (parseInt(aAction[0], 10)) {
				case 2://查看产品详情
				//Can.util.canInterface('productDetail', [nId, sTitle, 'sellerIndexModule', true]);
				//break;
				case 4://查看产品详情
					Can.util.canInterface('productDetail', [nId, sTitle, 'sellerIndexModule', true]);
					break;
				case 5://查看询盘详情
					Can.util.canInterface('readEmail', [
						{messageId: aAction[1]},
						true
					]);
					break;
				default :
					//Can.util.canInterface('whoSay');
					return false;
			}
		}
		_tips.hide();
	});
	// 更新完内容后重设位置
	_tips.on('ON_UPDATE_CONTENT', function () {
		var _top = this.el.offset().top;
		var _hei = this.el.innerHeight();
		var _arrow_top = this.arrow.position().top;
		var _client_hei = $('.ab-status').offset().top + $('.ab-status').height();//document.documentElement.clientHeight + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		if (_top + _hei > _client_hei) {
			var _newTop = _client_hei - _hei - 10;
			this.arrow.css('top', _arrow_top + (_top - _newTop));
			this.updateCss({top: _newTop});
		}
	});
	// 初始化箭头位置
	_tips.on('ON_SHOW', function () {
		this.arrow.css('top', 20);
	});

	function __fCreateList(aList) {
		_tips.clear();
		if (!aList.length) {
			_tips.hide();
			return;
		}
		for (var i = 0; i < aList.length; i++) {
			var _data = aList[i];
			//生成动态的日志
			var _getLOG = Can.util.canInterface('buyerActivityLog', [_data]);
			//创建每一条动态的容器
			var oItem = new Can.ui.Panel({cssName: 'item'});
			//动态的标题
			var _item_tit = new Can.ui.Panel({
				wrapEL: 'h3',
				html: Can.util.formatImage(_data.buyerHeader, '30x30') +
					'<span class="buyer" buyerid="' + _data.buyerId + '">' + _data.buyerName + '</span>' +
					_getLOG.eventTitle
			});
			// 非E广通等账号，buyer name可以点击
			if (!activeMap.closeBuyer && typeof __fNameClick === 'function') {
				_item_tit.el.on('click', 'span.buyer', function () {
					__fNameClick($(this).attr('buyerid'));
				});
			}
			//动态的描述
			var _item_des = new Can.ui.Panel({cssName: 'des'});

			//输出整个描述，“XX from XXX 做了XXXX”
			_item_des.addItem([_getLOG.eventDesc]);
			// 为E广通等账号，不显示按钮
			if (activeMap.closeBuyer) {
				oItem.addItem([_item_tit, _item_des]);
			}
			else {
				//动态的触发按钮
				var _item_btn = new Can.ui.toolbar.Button({
					cssName: 'btn btn-s11',
					text: _getLOG.eventBtnText
				});
				_item_btn.el.data('btnData', {
					'action': _getLOG.eventType,
					'buyerId': _data.buyerId,
					'buyerName': _data.buyerName,
					'buyerEmail': _data.buyerEmail,
					'eventId': _data.eventId
				});
				//为触发按钮绑定事件
				typeof __fBtnClick === 'function' && _item_btn.on('onclick', __fBtnClick);
				//输出一条动态
				oItem.addItem([_item_tit, _item_des, _item_btn]);
			}
			//将动态添加进tips里
			_tips.updateContent(oItem.el, true);
		}
	}

	activeMap.el.delegate('a', 'mouseenter', function () {
		var $This = $(this);
		var nCount = parseInt($This.text());

		if (isNaN(nCount)) nCount = 1;
		clearTimeout(xTimer);

		//取位置
		var _css;
		var _left = $This.offset().left;
		var _top = $This.offset().top;
		if (_left + _tips.width > _tips.target.offset().left + _tips.target[0].offsetWidth) {
			_css = 'arrow-r';
			_left -= _tips.width;
			_top -= 20;
		}
		else {
			_css = 'arrow-l';
			_left += 40;
			_top -= 20;
		}
		_tips.arrow && _tips.arrow.removeClass('arrow-l arrow-r').addClass(_css);
		_tips.updateCss({top: _top, left: _left});
		_tips.show();
		var _cacheList = $This.data('actList');
		if (_cacheList) {
			if (_cacheList.length > 0) {
				__fCreateList($This.data('actList'));
			}
		}
		else {
			//最多显示几条动态在TIPS里
			var nMaxShow = 5;
			if (nCount < 5) {
				nMaxShow = nCount;
			}
			if (!$This.data('sending')) {
				$.ajax({
					url: Can.util.Config.seller.indexModule.activeList,
					data: Can.util.formatFormData({
						searchType: activeMap.isAllData ? null : 'me',
						timeRange: activeMap.isAllData ? 7 : 7,
						countryId: activeMap.items[$This.attr('dataIndex')].split(':')[0]
					}),
					beforeSend: function () {
						$This.data('sending', true);
					},
					complete: function () {
						$This.data('sending', false);
					},
					consoleError: false,
					success: function (jData) {
						if (jData.status && jData.status === 'success') {
							//在这里取回列表
							var _list = jData.data.action_list;
							if (_list) {
								$This.data('actList', _list.slice(0, nMaxShow));
								__fCreateList($This.data('actList'));
							}
							else {
								$This.data('actList', []);
								$This.fadeOut();
								_tips.hide();
							}
						}
					}
				});
			}
		}
	});
	activeMap.el.delegate('a', 'mouseleave', function (event) {
		var a = $(event.relatedTarget).parents('.' + _tips.el.attr('class'));
		if (a.length) {
			if (a[0] == _tips.el[0]) {
				return;
			}
		}
		_tips.hide(true);
		xTimer = setTimeout(__fAutoShow, 4000);
	});


	var xTimer, nIndex = 0;
	var $Point;

	function __fAutoShow() {
		xTimer && clearTimeout(xTimer);
		if ($Point.is(':visible')) {
			$Point.eq(nIndex).trigger('mouseenter');
			nIndex++;
			if (nIndex >= $Point.length) {
				nIndex = 0;
			}
		}
		xTimer = setTimeout(__fAutoShow, 4000);
	}

	//初始化完地图的点后，开始自动轮播
	activeMap.on('ON_POINT_INIT', function () {
		$Point = activeMap.el.children('a');
		__fAutoShow();
	});

	$(function () {
		activeMap.loadData(Can.util.Config.seller.indexModule.activeMap, {timeRange: 7});
	});
});
