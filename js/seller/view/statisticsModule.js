/**
 * 统计分析 （直通车统计、交换器统计）
 * @Author: Allenice
 * @version: v1.1
 * @date: 2013-8-26
 * */

Can.module.statisticsModule = Can.extend(Can.module.BaseModule, {
	id: 'statisticsModuleId',
	title: Can.msg.MODULE.STATISTICS.TITLE_CAR,
	actionJs: ['js/seller/action/statisticAction.js'],
	lang: Can.msg.MODULE.STATISTICS,
	api: Can.util.Config.seller.express,
	currentView: '',
	buyerListXhr: null,  // 请求采购商分页列表的xhr
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.module.statisticsModule.superclass.constructor.call(this);
	},
	startup: function () {
		Can.module.statisticsModule.superclass.startup.call(this);
		var me = this;
		//主容器内
		this.container = new Can.ui.Panel({
			cssName: 'sta-container mod-col clear',
			id: 'sta-container'
		});
		this.sideBarContainer = new Can.ui.Panel({
			cssName: 'extra',
			html: '<div class="site-nav"></div>'
		});
		this.sideBar = new Can.ui.Panel({cssName: 'nav-item'});

		// 当前标记
		this.sideBar.$markCur = $("<div class='bg-ico cur-mark'></div>" +
			"");
		this.sideBar.addItem(this.sideBar.$markCur);

		// 侧栏功能列表
		this.sideBar.$ul = $("<ul class='my-apps'></ul>");
		this.sideBar.$car = $('<li><a href="javascript:"><span class="bg-ico ico-nav"></span>' + this.lang.CAR + '</a></li>');
		this.sideBar.$exchanger = $('<li><a href="javascript:"><span class="bg-ico ico-nav"></span>' + this.lang.EXCHANGER + '</a></li>');
		this.sideBar.$ul.append(this.sideBar.$car);
		this.sideBar.$ul.append(this.sideBar.$exchanger);
		this.sideBar.addItem(this.sideBar.$ul);

		this.container.addItem(this.sideBarContainer);
		this.sideBarContainer.el.find('.site-nav').append(this.sideBar.el);

		// 内容
		this.content = new Can.ui.Panel({cssName: 'main'});
		this.container.addItem(this.content);

		// 表单
		this.form = new Can.ui.Panel({wrapEL: 'form', cssName: 'date-form clear'});
		this.content.addItem(this.form);

		//日期范围
		this.form.dateLabel = new Can.ui.Panel({
			wrapEL: 'label',
			html: this.lang.DATE_LABEL + " :"
		});
		this.form.addItem(this.form.dateLabel);

		var nNow = (new Date()).getTime();
		var nSpDateTime = (new Date(2013, 10-1, 15)).getTime();
		if (nNow < nSpDateTime) {
			nSpDateTime = nNow - (1000 * 60 * 60 * 24 * 4);
		}

		this.form.dateFrom = new Can.ui.calendar({
			cssName: 'bg-ico calendar',
			normalValue: Can.util.formatDateTime(nSpDateTime, 'YYYY-MM-DD'),
			elName: 'startTime'
		});

		this.form.addItem(this.form.dateFrom);

		// 获取开始时间
		$.ajax({
			url: this.api.getStartTime,
			async: false,
			success: function (jData) {
				if (jData && jData['status'] && jData['status'] === 'success') {
					var oData = jData['data'];
					var sStartTime = oData.effectiveTime || nSpDateTime;
					me.form.dateFrom.setValue(sStartTime);
				}
			}
		});


		this.form.toLabel = new Can.ui.Panel({
			wrapEL: 'label',
			html: this.lang.TO
		});
		this.form.toLabel.el.css({paddingRight: 13});
		this.form.addItem(this.form.toLabel);

		this.form.dateTo = new Can.ui.calendar({
			cssName: 'bg-ico calendar',
			normalValue: Can.util.formatDateTime(nNow, 'YYYY-MM-DD'),
			elName: 'endTime'
		});
		this.form.addItem(this.form.dateTo);
		this.form.addItem('<input type="hidden" name="locale" value="zh_cn">'); // 强制请求中文

		// 直通车表格
		this.carTable = new Can.ui.Panel({
			id: 'sta-car-table',
			wrapEL: 'table',
			cssName: 'mod-table sta-table'
		});
		this.content.addItem(this.carTable);
		this.carTable.head = new Can.ui.Panel({
			wrapEL: 'thead',
			html: '<tr>' +
				'<th class="th1">' + this.lang.COUNTRY + '</th>' +
				'<th class="th2">' + this.lang.PUSH_BUYERS + '</th>' +
				'<th class="th3">' + this.lang.READ + '</th>' +
				'</tr>'
		});
		this.carTable.addItem(this.carTable.head);
		this.carTable.addItem('<tbody></tbody>');
		// 交换器表格
		this.exTable = new Can.ui.Panel({
			id: 'sta-ex-table',
			wrapEL: 'table',
			cssName: 'mod-table sta-table'
		});
		this.content.addItem(this.exTable);
		this.exTable.head = new Can.ui.Panel({
			wrapEL: 'thead',
			html: '<tr>' +
				'<th class="th1">' + this.lang.COUNTRY + '</th>' +
				'<th class="th4">' + this.lang.SWIPE_BUYERS + '</th>' +
				'</tr>'
		});
		this.exTable.addItem(this.exTable.head);
		this.exTable.addItem('<tbody></tbody>');


		// 弹窗显示采购商
		this.popWin = new Can.ui.Panel({cssName: 'sta-pop'});
		this.popWin.addItem("<div class='sta-arrow sta-arrow-inner'></div>");
		this.popWin.addItem("<div class='sta-arrow sta-arrow-outer'></div>");
		this.popWin.addItem("<div class='bg-ico sta-close'></div>");
		this.popWin.addItem("<div class='sta-pop-head'><div>" + this.lang.NAME + "</div><div>" + this.lang.TIMES + "</div></div>");
		this.popWin.addItem("<ul class='sta-pop-list'></ul>");
		this.popWin.addItem("<div class='sta-pop-foot'></div>");

		this.popWin.$list = this.popWin.el.find('.sta-pop-list');

		this.popWin.$preBtn = $('<a class="sta-btn" href="javascript:">' + this.lang.PRE_PAGE + '</a>');
		this.popWin.$nextBtn = $('<a class="sta-btn" href="javascript:">' + this.lang.NEXT_PAGE + '</a>');
		this.popWin.el.find('.sta-pop-foot').append(this.popWin.$nextBtn);
		this.popWin.el.find('.sta-pop-foot').append(this.popWin.$preBtn);

		this.content.addItem(this.popWin);

		this.container.applyTo(this.contentEl);

	},
	showCarView: function () {
		this.popWin.el.find('.sta-close').click();
		this.updateTitle(this.lang.TITLE_CAR);
		this.sideBar.$markCur.css({top: 18});
		this.sideBar.$car.find('a').addClass('cur');
		this.sideBar.$exchanger.find('a').removeClass('cur');
		this.carTable.el.show();
		this.exTable.el.hide();
		this.currentView = 'carView';

		// 显示数据
		this.showCarList();
		this.routeMark('/statistics/car');
	},
	showExchangerView: function () {
		this.popWin.el.find('.sta-close').click();
		this.updateTitle(this.lang.TITLE_EXCHANGER);
		this.sideBar.$markCur.css({top: 50});
		this.sideBar.$exchanger.find('a').addClass('cur');
		this.sideBar.$car.find('a').removeClass('cur');
		this.carTable.el.hide();
		this.exTable.el.show();
		this.currentView = 'exchangerView';

		this.showExchangerList();
		this.routeMark('/statistics/exchanger');
	},

	showCarList: function () {
		var _this = this;
		$.ajax({
			url: _this.api.car,
			data: this.form.el.serialize(),
			dataType: 'json',
			success: function (res) {
				if (res && res['status'] === 'success') {
					var data = res['data'] || [];
					var html = "", pushTotal = 0 , readTotal = 0;
					for (var i = 0; i < data.length; i++) {
						var item = data[i] || {"countryId": 0, "countryName": "", "pushBuyerCount": 0, "readCount": 0};
						pushTotal += item.pushBuyerCount;
						readTotal += item.readCount;
						html += '<tr>' +
							'<td><p><span class="flags fs' + item.countryId + '"></span><span>' + item.countryName + '</span></p></td>' +
							'<td class="text-center">' + item.pushBuyerCount + '</td>' +
							'<td class="text-center ' + (item.readCount > 0 ? 'pop' : '') + '" data-source="1" data-id="' + item.countryId + '"><span>' + item.readCount + '</span></td>' +
							'</tr>';
					}
					html += '<tr>' +
						'<td data-id=""></td>' +
						'<td class="text-center">' + _this.lang.PUSH_TOTAL + "：" + pushTotal + '</td>' +
						'<td class="text-center">' + _this.lang.READ_TOTAL + "：" + readTotal + '</td>' +
						'</tr>';
					_this.carTable.el.find('tbody').html(html);
				} else {

				}
			}
		});
	},

	showExchangerList: function () {
		var _this = this;
		$.ajax({
			url: _this.api.exchanger,
			data: this.form.el.serialize(),
			dataType: 'json',
			success: function (res) {
				if (res && res['status'] === 'success') {
					var data = res['data'] || [];
					var html = "", swipeCount = 0;
					for (var i = 0; i < data.length; i++) {
						var item = data[i] || {"countryId": 0, "countryName": "", "swipeBuyerCount": 0};
						swipeCount += item.swipeBuyerCount;
						html += '<tr>' +
							'<td><p><span class="flags fs' + item.countryId + '"></span><span>' + item.countryName + '</span></p></td>' +
							'<td class="text-center ' + (item.swipeBuyerCount > 0 ? 'pop' : '') + '" data-source="2" data-id="' + item.countryId + '"><span>' + item.swipeBuyerCount + '</span></td>' +
							'</tr>';
					}
					html += '<tr>' +
						'<td></td>' +
						'<td>' + _this.lang.SWIPE_TOTAL + "：" + swipeCount + '</td>' +
						'</tr>';
					_this.exTable.el.find('tbody').html(html);
				}
			}
		});
	},

	showBuyerList: function (oList) {
		var $popWin = this.popWin.el;
		if (oList) {
			var nIndex = oList.curPage - 1;
			var aBuyers = oList.data[nIndex];
			var html = "";
			for (var i = 0; i < aBuyers.length; i++) {
				var item = aBuyers[i];
				html += '<li><div>' + item.name + '</div><div>' + item.times + '</div></li>';
			}
			this.popWin.$list.html(html);
			if (oList.curPage <= 1) {
				this.popWin.$preBtn.addClass('sta-btn-disable');
			} else {
				this.popWin.$preBtn.removeClass('sta-btn-disable');
			}

			if (oList.page.maxPage <= oList.curPage) {
				this.popWin.$nextBtn.addClass('sta-btn-disable');
			}
			else {
				this.popWin.$nextBtn.removeClass('sta-btn-disable');
			}

			if (oList.page.maxPage > 1) {
				var nItemHeight = this.popWin.$list.find('li').height();
				this.popWin.el.find('.sta-pop-list').css({height: nItemHeight * oList.page.pageSize});
			} else {
				this.popWin.el.find('.sta-pop-list').css({height: "auto"});
			}
		}
	},

	getBuyerData: function (nPage) {
		var $popWin = this.popWin.el;
		var $td = $($popWin.data('td'));
		var sUrl = $td.data('source') == '1' ? this.api.carRead : this.api.exchangerPush;
		var oData = {
			countryId: $td.data('id'),
			page: nPage,
			pageSize: 10,
			startTime: this.form.dateFrom.el.val(),
			endTime: this.form.dateTo.el.val(),
			locale: 'zh_cn' // 强制请求中文
		};
		var _this = this;

		this.popWin.$list.html('<li class="sta-loading"></li>');
		if (this.buyerListXhr) this.buyerListXhr.abort();
		this.buyerListXhr = $.ajax({
			url: sUrl,
			data: oData,
			success: function (jData) {
				if (jData && jData['status'] === 'success') {
					var aData = jData['data'] || [];
					var oPage = jData['page'];
					var oList = $td.data('buyerList');
					if (!oList) {
						oList = {
							curPage: 1,
							data: [aData],
							page: oPage
						};
					} else {
						oList.curPage = nPage,
							oList.data.push(aData);
						oList.page = oPage;
					}
					$td.data('buyerList', oList);
					_this.showBuyerList(oList);
				}
			}
		});
	},

	onCarClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.sideBar.$car.click(fFn);
		}
	},
	onExchangerClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.sideBar.$exchanger.click(fFn);
		}
	},
	// 日期变化
	onDateChange: function (fFn) {
		if (typeof fFn === 'function') {
			this.form.dateFrom.on("ON_SET_VALUE", fFn, this.form.dateFrom.el);
			this.form.dateTo.on("ON_SET_VALUE", fFn, this.form.dateTo.el);
		}
	},
	onPopEnter: function (fFn) {
		if (typeof fFn === 'function') {
			this.content.el.on('click', '.pop', fFn);
		}
	},
	onPopCloseBtnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.popWin.el.find('.sta-close').click(fFn);
		}
	},
	// 上一页
	onPreBtnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.popWin.$preBtn.click(fFn);
		}
	},
	// 下一页
	onNextBtnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.popWin.$nextBtn.click(fFn);
		}
	},
	runByRoute: function () {
		if (this._oRoutRule && this._oRoutRule.route) {
			switch (this._oRoutRule.route[0]) {
				case '/statistics/car':
					this.showCarView();
					break;
				case '/statistics/exchanger':
					this.showExchangerView();
					break;
			}
		}
	}
});