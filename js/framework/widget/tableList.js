/**
 * Table list
 * @Author: Mary June
 * @Version: 2.5
 * @Update: 13-6-17
 */

Can.ui.tableList = Can.extend(Can.ui.BaseUI, {
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.tableList.superclass.constructor.call(this);
		this.addEvents('ON_TR_OVER', 'ON_TR_CLICK');
	},
	initUI: function () {
		var _table = $('<table class="' + this.cssName + '"></table>');
		var _cg = $('<colgroup></colgroup>');
		_table.append(_cg);
		var i;
		for (i = 0; i < this.data.col.length; i++) {
			_cg.append('<col class="' + this.data.col[i] + '">');
		}
		if (this.data.head.length) {
			var _ch = $('<tr></tr>');
			for (i = 0; i < this.data.head.length; i++) {
				_ch.append('<th>' + this.data.head[i] + '</th>');
			}
			_table.append($('<thead></thead>').append(_ch));
		}
		this.tbody = $('<tbody></tbody>');
		_table.append(this.tbody);
		this.update();
		this.el = _table;
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.el
			.on('click', 'tbody tr:not([notselect])', function (event) {
				_this.fireEvent('ON_TR_CLICK', $(this), event);
			})
			.on('mouseenter', 'tbody tr:not([notselect])', function () {
				_this.fireEvent('ON_TR_OVER', $(this), $(this).data('dataRoom'));
			});
	},
	update: function (aNewData) {
		!aNewData && this.clear();
		var aData = aNewData || this.data.item;
		if (aData.length) {
			for (var i = 0; i < aData.length; i++) {
				var _tr = $('<tr></tr>');
				var _item = aData[i];
				var v;
				//a=[] / a={css:[]}
				if (!(_item instanceof Array)) {
					for (v in _item) {
						_tr.addClass(v);
						_item = _item[v];
						break;
					}
				}
				this.data.room && this.data.room[i] && _tr.data('dataRoom', this.data.room[i]);
				for (v = 0; v < _item.length; v++) {
					if (typeof _item[v] === 'string') {
						_tr.append('<td>' + _item[v] + '</td>');
					}
					else if (typeof _item[v] === 'object' && _item[v]['getDom']) {
						_item[v].applyTo($('<td></td>').appendTo(_tr));
					}
					else {
						$('<td></td>').append(_item[v]).appendTo(_tr);
					}
				}
				this.tbody.append(_tr);
			}
		}
		else {
			var _emptyTd = $('<td colspan="' + this.data.head.length + '"></td>');
			_emptyTd.append(this.emptyTips);
			this.tbody.append($('<tr notselect></tr>').append(_emptyTd));
		}
	},
	clear: function () {
		this.tbody.empty();
	},
	remove: function () {
		this.el.remove();
	}
});
