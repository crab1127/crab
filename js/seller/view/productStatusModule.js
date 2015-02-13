/**
 * product status
 * @Author: AngusYoung
 * @Version: 1.4
 * @Update: 13-4-13
 */

Can.module.productStatusModule = Can.extend(Can.module.BaseModule, {
	id: 'productStatusModuleId',
	title: Can.msg.MODULE.PRODUCT_STATISTICS.TITLE,
	requireUiJs: [
		'js/plugin/highcharts/highcharts.js'
	],
	previewId: 'previewStId',
	areaId: 'areaStId',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.module.productStatusModule.superclass.constructor.call(this);

		this.weekBtn = new Can.ui.toolbar.Button({
			text: Can.msg.MODULE.PRODUCT_STATISTICS.ITEM_WEEK
		});
		this.monthBtn = new Can.ui.toolbar.Button({
			text: Can.msg.MODULE.PRODUCT_STATISTICS.ITEM_MONTH
		});

		this.previewCont = $('<div></div>');
		this.areaCont = $('<div><h2>' + Can.msg.MODULE.PRODUCT_STATISTICS.AREA_TIT + '</h2></div>');
		this.areaMap = $('<div class="maps"></div>');
		this.rankList = $('<ul class="rank-cont"></ul>');
	},
	startup: function () {
		Can.module.productStatusModule.superclass.startup.call(this);
		this.addTagItem([this.weekBtn, this.monthBtn]);
		this.setCurrentRightBtn(this.weekBtn);
		this.previewCont.attr('id', this.previewId);
		this.contentEl.append(this.previewCont);
		this.areaCont.attr('id', this.areaId);
		this.areaCont.append(this.areaMap);
		this.contentEl.append(this.areaCont);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.weekBtn.on('onclick', function () {
			_this.loadData(null, {timeRange: 7});
		});
		_this.monthBtn.on('onclick', function () {
			_this.loadData(null, {timeRange: 30});
		});
	},
	draw: function (aData) {
		var _this = this;
		//line
		if (this.chart) {
			this.chart.series[0].remove();
		}
		this.chart = new Highcharts.Chart({
			chart: {
				renderTo: this.previewId
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			title: {
				text: Can.msg.MODULE.PRODUCT_STATISTICS.PREVIEW_TIT,
				align: 'left',
				margin: 30,
				y: 50,
				style: {
					color: '#64584c',
					font: 'bold 48px Arial'
				}
			},
			xAxis: {
				gridLineWidth: 1,
				lineColor: '#c0c0c0',
				tickColor: '#c0c0c0',
				tickInterval: 24 * 3600000,
				tickPosition: 'inside',
				endOnTick: false,
				showLastLabel: true,
				tickLength: 10,
				labels: {
					staggerLines: 2,
					y: 20,
					formatter: function () {
						return Can.util.formatDateTime(this.value + _this.pointStart, 'MM-DD');
					}
				}
			},
			yAxis: {
				title: {
					text: 'follows',
					style: {
						fontSize: '12px',
						color: '#4db07a'
					}
				},
				labels: {
					formatter: function () {
						return this.value + 'PV'
					}
				},
				min: 0
			},
			plotOptions: {
				series: {
					lineWidth: 1,
					shadow: false,
					color: '#5bba86',
					pointInterval: 24 * 3600000,
					marker: {
						lineWidth: 2,
						lineColor: '#ececec',
						radius: 8
					}
				}
			},
			tooltip: {
				formatter: function () {
					return '<b>' + this.series.name + '</b>: ' + this.y + ' PV<br>' + Can.util.formatDateTime(this.x + _this.pointStart, 'YYYY-MM-DD');
				}
			},
			series: aData
		});
	},
	build: function (aData) {
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

		this.areaMap.empty();
		this.rankList.empty();
		//3D Bar
		aData.sort(function (a, b) {
			return a.total < b.total;
		});
		var nFullHeight = 300;
		var nMax = aData[0].total;
		var nSum = nMax / 100;
		for (var i = 0; i < aData.length; i++) {
			var $Rank_li = $('<li class="rank-item rank-s' + (i + 1) + '">' +
				'<div class="rank-num">' + (i + 1) + '</div>' +
				'<span class="flags fs' + aData[i].countryId + '"></span>' +
				'<span class="rank-country">' + aData[i].countryName + '</span>' +
				'<div class="rank-total">' + aData[i].total + '</div>' +
				'<div class="rank-per">' + aData[i].percent + '%</div>' +
				'</li>');
			var $Map_item = $('<div class="area-st"><span>' + aData[i].total + '</span><div class="bar-3d s' + (i + 1) + '"></div></div>');
			this.rankList.append($Rank_li);
			_this.areaMap.append($Map_item);
			$Map_item.css(__fGetMapPoint(aData[i].countryId));
			var _hei = aData[i].total / nSum * (nFullHeight / 100);
			$Map_item.children('div.bar-3d').delay(500).animate({
				height: _hei
			}, function () {
				var _diff = _this.areaMap.offset().top - $(this).parent().offset().top;
				if (_diff > (_this.areaMap.data('pdt') || 1)) {
					_this.areaMap.data('pdt', _diff);
					_this.areaMap.stop().animate({'padding-top': _diff});
				}
			});
			$Map_item
				.mouseenter(function () {
					$(this).css('z-index', 10);
				})
				.mouseleave(function () {
					$(this).css('z-index', '');
				});
		}
		this.rankList.appendTo(_this.areaCont);
	},
	loadData: function (sURL, jParam) {
		var _this = this;
		_this.dataURL = sURL || _this.dataURL;
		$.ajax({
			url: _this.dataURL,
			data: Can.util.formatFormData(jParam || {timeRange: 7}),
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var bHaveData = false;
					if (jData.data.area && jData.data.area.length) {
						_this.build(jData.data.area);
						bHaveData = true;
					}
					if (jData.data.preview && jData.data.preview.length) {
						jData.data.preview[0].data = jData.data.preview[0].data.slice(0, jParam ? jParam.timeRange : 7);
						_this.pointStart = jData.data.preview[0].pointStart;
						delete jData.data.preview[0].pointStart;
						_this.draw(jData.data.preview);
						bHaveData = true;
					}
					if (!bHaveData) {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, {status: 'fail', message: Can.msg.MODULE.PRODUCT_STATISTICS.NOT_DATA});
					}
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	}
});
