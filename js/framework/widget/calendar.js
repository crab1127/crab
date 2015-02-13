/**
 * calendar
 * @Author: AngusYoung
 * @Version: 1.1
 * @Since: 13-3-5
 */

Can.ui.calendar = Can.extend(Can.ui.BaseUI, {
	elName: 'date',
	mainCss: 'ui-cale',
	blankText: '',
	isShow: false,
	dateFormat: 'YYYY-MM-DD',
	min: '1900-01-01',
	max: null,
	buttons: {
		prevYear: '&laquo;',
		prevMonth: '&lsaquo;',
		nextMonth: '&rsaquo;',
		nextYear: '&raquo;'
	},
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.calendar.superclass.constructor.call(this);
		this.addEvents('ON_SHOW', 'ON_HIDE', 'ON_SET_VALUE');
	},
	initUI: function () {
		this.el = $('<input type="text" readonly="readonly" />');
		this.el.addClass(this.cssName);
		this.el.attr({
			'name': this.elName,
			'placeholder': this.blankText
		});
		if (typeof this.normalValue !== 'undefined') {
			if (!/^(\d{2,4})-(0?[1-9]||1[0-2])-(0?[1-9]||[1-2][0-9]||3[0-1])$/.test(this.normalValue)) {
				this.normalValue = new Date();
			}
			this.normalValue = Can.util.formatDateTime(this.normalValue, this.dateFormat);
		}
		this.el.val(this.normalValue);
		this.main = $('<div style="display: none;"></div>');
		this.main.addClass(this.mainCss);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.el.click(function () {
			_this.show();
		});
		_this.main.delegate('td', 'click', function () {
			_this.setValue($(this).attr('title'));
		});
		_this.main.delegate('button', 'click', function (event) {
			var sAction = $(this).attr('action');
			switch (sAction) {
				case 'y-':
					_this.setCale((_this.seeDate.getFullYear() - 1) + '-' + (_this.seeDate.getMonth() + 1) + '-1');
					break;
				case 'y+':
					_this.setCale((_this.seeDate.getFullYear() + 1) + '-' + (_this.seeDate.getMonth() + 1) + '-1');
					break;
				case 'm-':
					_this.setCale(_this.seeDate.getFullYear() + '-' + _this.seeDate.getMonth() + '-1');
					break;
				case 'm+':
					_this.setCale(_this.seeDate.getFullYear() + '-' + (_this.seeDate.getMonth() + 2) + '-1');
					break;
			}
			event.stopPropagation();
		});
		Can.util.EventDispatch.on('ON_PAGE_CLICK', function (event) {
			if (event.target != _this.el[0] && !$.contains(_this.main[0], event.target)) {
				_this.hide();
			}
		});
	},
	createMain: function (nYear, nMonth, nDay) {
		var dDate = new Date(nYear, nMonth, nDay);
		var dSelDate = Can.util.formatDateTime(this.el.val());
		var dNow = new Date();
		var nLastDay = (new Date(dDate.getFullYear(), dDate.getMonth() + 1, 0)).getDate();
		var dBeginDate = new Date(nYear, nMonth, 1);
		var nBeginWeek = 1 - (new Date(nYear, nMonth, 1)).getDay();

		var sPrevYear = '<button class="prev-year fl" action="y-">' + this.buttons.prevYear + '</button>';
		var sPrevMonth = '<button class="prev-month fl" action="m-">' + this.buttons.prevMonth + '</button>';
		var sNextMonth = '<button class="next-month fr" action="m+">' + this.buttons.nextMonth + '</button>';
		var sNextYear = '<button class="next-year fr" action="y+">' + this.buttons.nextYear + '</button>';
		var sCurrentMonth = Can.msg.CALENDAR.CURRENT.replace('[@]', dDate.getFullYear()).replace('[@@]', dDate.getMonth() + 1);
		var sWeek = Can.msg.CALENDAR.WEEK.split(' ').join('</th><th>');
		var sDateList = '';
		var _tit, _css;

		function __fCompareDay(d1, d2) {
			return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
		}

		for (var i = nBeginWeek; i <= nLastDay; i++) {
			if (i < 1) {
				var _prv_day = new Date(dBeginDate - (Math.abs(i) + 1) * 86400 * 1000);
				_tit = this.checkOutRange(_prv_day) ? '' : ' title="' + Can.util.formatDateTime(_prv_day, this.dateFormat) + '"';
				_css = this.checkOutRange(_prv_day) ? 'enb' : 'not';
				sDateList += '<td class="' + _css + '"' + _tit + '>' + _prv_day.getDate() + '</td>';
				continue;
			}
			var _d = new Date(nYear, nMonth, i);
			_tit = this.checkOutRange(_d) ? '' : ' title="' + Can.util.formatDateTime(_d, this.dateFormat) + '"';
			_css = this.checkOutRange(_d) ? 'enb' : '';
			var _css2 = __fCompareDay(dSelDate, _d) ? 'on-day' : __fCompareDay(dNow, _d) ? 'today' : '';
			if (_css && _css2) {
				_css += ' ' + _css2;
			}
			else if (!_css) {
				_css = _css2;
			}
			if (_css) {
				_css = ' class="' + _css + '"';
			}
			sDateList += '<td' + _css + _tit + '>' + i + '</td>';
			if ((i - nBeginWeek + 1) % 7 === 0) {
				sDateList += '</tr><tr>';
			}
		}
		if ((nLastDay - nBeginWeek + 1) % 7 !== 0) {
			var _a = [];
			_a[7 - (nLastDay - nBeginWeek + 1) % 7] = '';
			for (var j = 1; j < _a.length; j++) {
				var _next_day = new Date(nYear, nMonth, nLastDay + j);
				_tit = this.checkOutRange(_next_day) ? '' : ' title="' + Can.util.formatDateTime(_next_day, this.dateFormat) + '"';
				_css = this.checkOutRange(_next_day) ? 'enb' : 'not';
				sDateList += '<td class="' + _css + '"' + _tit + '>' + j + '</td>';
			}
			sDateList += '</tr>';
		}
		else {
			sDateList = sDateList.slice(0, -4);
		}

		return '<div class="cale-tit">' + sPrevYear + sPrevMonth + sCurrentMonth + sNextYear + sNextMonth + '</div>' +
			'<table><thead><tr><th>' + sWeek + '</th></tr></thead><tbody><tr>' + sDateList + '</tr></tbody></table>';

	},
	getValue: function () {
		return this.el.val();
	},
	setValue: function (sDate) {
		if (sDate) {
			this.el.val(Can.util.formatDateTime(sDate, this.dateFormat));
			this.fireEvent('ON_SET_VALUE', this.el.val());
			this.hide();
		}
	},
	setCale: function (sDate) {
		var _old = this.seeDate || new Date();
		this.seeDate = Can.util.formatDateTime(sDate || new Date());
		if (this.checkOutRange(this.seeDate)) {
			this.seeDate = Can.util.formatDateTime(this.seeDate > _old ? this.max : this.min);
		}
		this.main.html(this.createMain(this.seeDate.getFullYear(), this.seeDate.getMonth(), this.seeDate.getDate()));
	},
	checkOutRange: function (dDate) {
		return  dDate < Can.util.formatDateTime(this.min) || (this.max && dDate > Can.util.formatDateTime(this.max));
	},
	show: function () {
		if (!this.isShow) {
			this.isShow = true;
			this.setCale(this.el.val());
			this.main.appendTo($(document.body));
			this.main.show();
			this.main.css({
				left: this.el.offset().left,
				top: this.el.offset().top + this.el.height()
			});
			this.fireEvent('ON_SHOW');
		}
		else {
			this.hide();
		}
	},
	hide: function () {
		if (this.isShow) {
			this.isShow = false;
			this.main.hide();
			this.fireEvent('ON_HIDE');
		}
	}
});
