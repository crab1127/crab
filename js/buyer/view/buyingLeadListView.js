/**
 * Buyer lead list
 * @Author: AngusYoung
 * @Version: 1.3
 * @Since: 13-4-23
 */

Can.view.buyerLeadListView = Can.extend(Can.view.BaseView, {
	id: 'buyerLeadListViewId',
	hasTickAll: false,
	operaText: '',
	page: 1,
	searchCond: {},
	filter: [],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.buyerLeadListView.superclass.constructor.call(this);
		this.addEvents(
			'ON_CHANGE_PAGE',
			'ON_ADD_IN',
			'ON_ALL_OPERATION',
			'ON_TITLE_CLICK',
			'ON_ACTION_CLICK'
		);
	},
	startup: function () {
		this.contentEl = $('<div></div>');
		this.contentEl.addClass(this.cssName);

		//operation
		var _opt = $('<div class="opt-area"></div>');
		var _stepWrap = $('<div class="mod-pagination-s2"></div>');
		//step button
		this.stepBtn = new Can.view.stepBtnView();
		this.stepBtn.start();
		this.stepBtn.getDOM().addClass('dis');
		this.stepBtn.getDOM().appendTo(_stepWrap);
		//search
		var _searchWrap = $('<div class="search-s2"></div>');
		this.searchBtn = new Can.ui.toolbar.Button({
			cssName: 'ico-search'
		});
		this.searchBtn.applyTo(_searchWrap);
		this.searchIpt = $('<input class="txt" type="text" placeholder="' + Can.msg.MODULE.BUYER_LEAD_MANAGE.SEARCH_KEYWORD + '" >');
		this.searchIpt.appendTo(_searchWrap);
		//date range
		var _dateWrap = $('<div class="mod-calendar"></div>');
		this.dateStart = new Can.ui.calendar({
			cssName: 'bg-ico calendar',
			blankText: 'From',
			elName: 'from-date',
			min: '2013-01-01'
		});
		this.dateEnd = new Can.ui.calendar({
			cssName: 'bg-ico calendar',
			blankText: 'To',
			elName: 'to-date'
		});
		this.dateStart.applyTo(_dateWrap);
		this.dateEnd.applyTo(_dateWrap);

		//add to operation
		_opt.append(_stepWrap);
		_opt.append(_searchWrap);
		_opt.append(_dateWrap);

		if (this.hasTickAll) {
			//tick all
			var _tickWrap = $('<div class="fil-msg"></div>');
			this.tick = new Can.ui.tick();
			this.tick.applyTo(_tickWrap);
			_tickWrap.appendTo(_opt);

			//operation button
			var _operaWrap = $('<div class="item-opt"></div>');
			this.operaBtn = new Can.ui.toolbar.Button({
				cssName: 'btn btn-s12',
				text: this.operaText
			});
			this.operaBtn.applyTo(_operaWrap);
			_operaWrap.appendTo(_opt);
		}

		//table
		this.dataTable = new Can.ui.tableList({
			cssName: 'mod-table tbl-mge-bl',
			data: {
				col: this.tableColCss,
				head: this.tableHeadTxt,
				item: []
			}
		});

		//limit page
		this.limitPage = new Can.ui.limitButton({
			cssName: 'ui-page fr',
			showTotal: true,
			total: 0,
			limit: 0
		});
		//add to content
		this.contentEl.append(_opt);
		this.contentEl.append(this.dataTable.el);
		this.contentEl.append(this.limitPage.el);

		//bind events
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		if (_this.tick) {
			_this.tick.on('ON_TICK', function (bChecked) {
				var $Chk = _this.dataTable.tbody.find('input[type="checkbox"]');
				if (bChecked) {
					$Chk.attr('checked', true);
				}
				else {
					$Chk.removeAttr('checked');
				}
			});
			_this.operaBtn.on('onclick', function () {
				var $Wrap = _this.dataTable.tbody;
				var aId = [];
				$Wrap.find('input:checked').each(function () {
					aId.push($(this).val());
				});

				_this.fireEvent('ON_ALL_OPERATION', aId);
			});
		}
		_this.dateStart.on('ON_SET_VALUE', function (sDate) {
			_this.dateEnd.min = sDate;
			setTimeout(function () {
				_this.dateEnd.show();
			}, 150);
		});
		_this.dateEnd.on('ON_SET_VALUE', function (sDate) {
			_this.dateStart.max = sDate;
		});
		_this.stepBtn.onLeftClick(function () {
			if (this.el.hasClass('dis')) {
				return;
			}
			_this.page--;
			_this.fireEvent('ON_CHANGE_PAGE');
		});
		_this.stepBtn.onRightClick(function () {
			if (this.el.hasClass('dis')) {
				return;
			}
			_this.page++;
			_this.fireEvent('ON_CHANGE_PAGE');
		});
		_this.limitPage.onChange(function (nPage) {
			_this.page = nPage;
			_this.fireEvent('ON_CHANGE_PAGE');
		});
		_this.on('ON_CHANGE_PAGE', function () {
			_this.limitPage.current = _this.page;
			_this.limitPage.refresh();
		});
	},
	onSearch: function (fFn) {
		if (typeof fFn === 'function') {
			var _this = this;
			_this.searchBtn.on('onclick', function () {
				var dBegin = _this.dateStart.getValue();
				var dEnd = _this.dateEnd.getValue();
				var sKeyword = _this.searchIpt.val();

				_this.page = 1;
				_this.searchCond = {
					startDate: dBegin || null,
					endDate: dEnd || null,
					keyword: sKeyword || null
				};
				fFn(_this.searchCond);
			});
		}
	},
	disassembleData: function (aData, aFilterField) {
		for (var i = 0; i < aData.length; i++) {
			var jData = aData[i];
			for (var v in jData) {
				if ($.inArray(v, aFilterField) !== -1) {
					delete jData[v];
				}
			}
		}
		return aData;
	},
	buildData: function (aData, jAction, jPage) {
		var _this = this;
		_this.dataTable.data.item = [];
		aData = _this.disassembleData(aData, _this.filter);
		for (var i = 0; i < aData.length; i++) {
			var o = aData[i];
			Can.apply(o, jAction || {});
			var _tmp = [];
			var oTick, $Title, $State, $Reply, $ReplyTime, $PublishTime, $ExpiredTime, $ActionBtn, $Reason;
			if (_this.hasTickAll) {
				oTick = new Can.ui.tick({
					value: o.buyingLeadId
				});
				oTick.on('ON_TICK', function (bCheck) {
					if (!bCheck) {
						_this.tick.unSelect();
					}
				});
				_tmp.push(oTick);
			}
			if (typeof o.subject !== 'undefined') {
				$Title = $('<a target="_blank" href="/buyinglead/info.html?id='+ o.buyingLeadId +'" class="subject" title="' + o.subject + '">' + o.subject + '</a>');
				/*$Title.click(o, function (event) {*/
					//_this.fireEvent('ON_TITLE_CLICK', event.data, event);
				/*});*/
				_tmp.push($Title);
			}
			if (typeof o.reason !== 'undefined') {
				var shortReason = o.reason;
				if (o.reason && o.reason.length > 25)
					shortReason = o.reason.substring(0, 25) + "...";
				$Reason = $('<span class="state-issue" title="' + o.reason + '">' + shortReason + '</span>');
				_tmp.push($Reason);
			}
			if (typeof o.status !== 'undefined') {
				var _state_txt = Can.msg.MODULE.BUYER_LEAD_MANAGE.PUBLISH_STATE;
				$State = $('<span class="state-issue">' + _state_txt[o.status] + '</span>');
				_tmp.push($State);
			}
			if (typeof o.replyTimes !== 'undefined') {
				$Reply = $('<div class="state-issue">' + (o.replyTimes == 0 ? '' : '<span class="bg-ico ico-state-reply"></span><em class="s-num">(' + o.replyTimes + ')</em>') + '</div>');
				_tmp.push($Reply);
			}
			if (typeof o.lastReplyTime !== 'undefined') {
				$ReplyTime = $('<span class="time">' + Can.util.formatDateTime(o.lastReplyTime, 'YYYY-MM-DD hh:mm') + '</span>');
				_tmp.push($ReplyTime);
			}
			if (typeof o.postDate !== 'undefined') {
				$PublishTime = $('<span class="time">' + Can.util.formatDateTime(o.postDate, 'YYYY-MM-DD') + '</span>');
				_tmp.push($PublishTime);
			}
			if (typeof o.expirationDate !== 'undefined') {
				$ExpiredTime = $('<span class="time">' + Can.util.formatDateTime(o.expirationDate, 'YYYY-MM-DD') + '</span>');
				_tmp.push($ExpiredTime);
			}
			if (o.action instanceof Array) {
				if (o.freqException === 'undefined' || !o.freqException) {
				
					$ActionBtn = $('<a href="javascript:;" class="bg-ico"></a>');
					$ActionBtn.addClass(o.action[0]);
					$ActionBtn.attr('cantitle', o.action[1]);
	
	                $ActionBtn.click(o, function (event) {
	                    _this.fireEvent('ON_ACTION_CLICK', event.data, event);
	                });
	
	            
	                /*
	                 * if(o.action[1] !== Can.msg.CAN_TITLE.MODIFY){
	                 *     $ActionBtn.click(o, function (event) {
	                 *         _this.fireEvent('ON_ACTION_CLICK', event.data, event);
	                 *     });
	                 * }
	                 * else{
	                 *     $ActionBtn.attr({
	                 *         href: Can.util.Config.EN.url.postBuyinglead + '?id=' + o.buyingLeadId,
	                 *         target: '_blank'
	                 *     });
	                 *     //console.log(o);
	                 * }
	                 */
	                _tmp.push($ActionBtn);
                }
			}
			if (o.hasNewReply) {
				_tmp = {'unread': _tmp};
			}
			_this.dataTable.data.item.push(_tmp);
			_this.fireEvent('ON_ADD_IN', o);
		}
		_this.dataTable.update();
		if (_this.limitPage) {
			Can.apply(_this.limitPage, {
				current: _this.page,
				total: jPage.total,
				limit: jPage.pageSize
			});
			_this.limitPage.refresh();
			//here control the step button status
			var _current = _this.limitPage.current;
			var _max = _this.limitPage.max;
			//left button
			if (_current > 1 && _current <= _max) {
				_this.stepBtn.group[0].enable();
			}
			else {
				_this.stepBtn.group[0].disable();
			}
			//right button
			if (_max > 1 && _current < _max) {
				_this.stepBtn.group[1].enable();
			}
			else {
				_this.stepBtn.group[1].disable();
			}
		}
	},
	hide: function () {
		this.contentEl.hide();
	}
});
