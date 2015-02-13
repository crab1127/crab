/**
 * Buyer Active Map View
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-8-9
 */

Can.view.activeMapView = Can.extend(Can.view.BaseView, {
	id: 'activeMapViewId',
	css: 'ind-trend',
	isAllData: true,
	length: 0,
	total: 0,
	items: [],
	actionJs: ['js/seller/action/activeMapAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.activeMapView.superclass.constructor.call(this);
		this.addEvents('ON_CHANGE', 'ON_POINT_INIT');
	},
	startup: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.css);
		if (this.items.length) {
			for (var i = 0; i < this.items.length; i++) {
				this.addItem(this.items[i]);
			}
		}
	},
	addItem: function (sItem) {
		var _this = this;

		function __fGetMapPoint(nID) {
			var _data;
			if (_this.mapData) {
				_data = _this.mapData[nID];
			}
			else {
				$.ajax({
					url: Can.util.Config['static'].pointMap,
					dataType: 'JSON',
					async: false,
					success: function (jData) {
						_this.mapData = jData;
						_data = _this.mapData[nID];
					}
				});
			}
			return _data || {"bottom": 460, "left": 0};
		}

		var aItemData = sItem.split(':');
		var nMapId = parseInt(aItemData[0], 10);
		var sPointTitle = aItemData[1];
		var nTotal = parseInt(aItemData[2], 10);
		if (nTotal) {
			var _el = $('<a href="javascript:;">' + (nTotal > 1 ? '<span>' + nTotal + '</span>' : '') + '</a>');
			_el.attr('dataIndex', _this.length);
			_el.attr('title', sPointTitle);
			_el.css(__fGetMapPoint(nMapId));
			_this.el.append(_el);
			_this.total += nTotal;
		}
		if (!_this.items[_this.length]) {
			_this.items.push(sItem);
		}
		_this.length++;
	},
	changeData: function () {
		this.isAllData = !this.isAllData;
		this.fireEvent('ON_CHANGE', this);
	},
	loadData: function (sURL, jParam) {
		var _this = this;
		$.ajax({
			url: sURL,
			data: jParam,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					if (jData.data && jData.data.countryIds) {
						var _list = jData.data.countryIds;
						for (var i = 0; i < _list.length; i++) {
							_this.addItem(_list[i]);
						}
						_this.fireEvent('ON_POINT_INIT');
					}
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	},
	cls: function () {
		this.total = 0;
		this.length = 0;
		this.items = [];
		this.el.empty();
	}
});
