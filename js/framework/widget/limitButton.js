/**
 * Limit Button UI
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-4-23
 */

Can.ui.limitButton = Can.extend(Can.ui.BaseUI, {
	total: 0,
	limit: 1,
	current: 1,
	showNum: 7,
	max: 0,
	/**
	 * 下标0表示第一页/最后一页是否显示，1:on 0:off
	 * 下标1表示上一页/下一页是否显示，1:on 0:off
	 * 下标2表示中间单页项是否显示，1:on 0:off
	 */
	option: [1, 1, 1],
	showTotal: false,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.limitButton.superclass.constructor.call(this);
	},
	initUI: function () {
		this.el = $('<ul></ul>');
		this.el.addClass(this.cssName);
		this.refresh();
		this.bindEvent();
	},
	refresh: function () {
		var _html = '';
		var _count = '';
		var _first = '', _last = '';
		var _prev = '', _next = '';
		var nMax = Math.ceil(this.total / this.limit) || 0;
		var nMid = Math.ceil(this.showNum / 2);

		this.max = nMax;

		if (this.showTotal) {
			_count = '<li class="count">' + Can.msg.PAGE_COUNT.replace('[@]', this.total) + '</li>';
		}
		if (this.option[0]) {
			/*first*/
			_first = '<li pagenum="1" class="first' + (this.current == 1 ? ' disable' : '') + '" title="' + Can.msg.PAGE.HOME + '"><a>first</a></li>';
			/*last*/
			_last = '<li pagenum="' + nMax + '" class="last' + (this.current == nMax || nMax < 1 ? ' disable' : '') + '" title="' + Can.msg.PAGE.END + '"><a>last</a></li>';
		}
		if (this.option[2]) {
			/*previous*/
			_prev = '<li pagenum="' + (this.current - 1) + '" class="prev' + (this.current == 1 ? ' disable' : '') + '"><a>previous</a></li>';
			/*next*/
			_next = '<li pagenum="' + (this.current + 1) + '" class="next' + (this.current == nMax || nMax < 1 ? ' disable' : '') + '"><a>next</a></li>';
		}
		if (this.option[1]) {
			/*number list*/
			var nStart = Math.max(1, this.current - nMid + 1);
			nStart = Math.max(1, nStart + (this.showNum - 1) > nMax ? nMax - (this.showNum - 1) : nStart);
			var nEnd = Math.min(nMax + 1, this.showNum + nStart);
			for (var i = nStart; i < nEnd; i++) {
				if (i > nEnd - 3 && i < nEnd) {
					if (i + 1 == nEnd && i != nMax) {
						//end
						_html += '<li pagenum="' + nMax + '"><a>' + nMax + '</a></li>';
						continue;
					}
					else if (i + 2 == nEnd && i + 1 != nMax) {
						//next end
						_html += '<li>...</li>';
						continue;
					}
				}
				_html += '<li pagenum="' + i + '"' + (this.current == i ? ' class="current"' : '') + '><a>' + i + '</a></li>';
			}
		}
		this.el.html(_count + _first + _prev + _html + _next + _last);
	},
	bindEvent: function () {
		var _this = this;
		_this.el.delegate('li', 'click', function () {
			if ($(this).attr('pagenum') && !$(this).hasClass('disable')) {
				_this.current = Math.max(1, parseInt($(this).attr('pagenum'), 10));
				_this.refresh();
				_this.fireEvent('ON_CHANGE', _this.current);
			}
		});
	},
	onChange: function (fFn) {
		if (typeof fFn === 'function') {
			this.on('ON_CHANGE', fFn);
		}
	}
});
