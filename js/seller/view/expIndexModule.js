/**
 * Canton Fair Express User Index
 * @Author:
 * @Version: 1.1
 * @Update: 13-8-26
 */

Can.module.ExpIndexModule = Can.extend(Can.module.BaseModule, {
	id: 'expIndexModuleId',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.module.ExpIndexModule.superclass.constructor.call(this);

	},
	startup: function () {
		Can.module.ExpIndexModule.superclass.startup.call(this);
		var fGetExpress = function (datas) {
			var oMSG = Can.msg;
			var oMSG_level = oMSG.MEMBER_LEVEL;
			var sMomberLevel = "";
			var sLevel_raw;
			var sLevel;
			var aStatistic = "<div class='e-statistic'></div>";
			var sPic = Can.util.formatImage(datas.data.photo, '90x90', (datas.data.gender * 1 === 2 ? 'female' : 'male'));
			if (datas.data.levelPackages && datas.data.levelPackages.length > 0) {
				aStatistic = [
					'<div class="e-statistic">',
					'<div class="ico-statistic clear">',
					'<div class="ico-pro">' + datas.data.proTotail + '</div>',
					'<div class="txt" id="proTotail">' + Can.msg.MODULE.EXPINDEX.PRO_TOTAIL + '</div>',
					'</div>',
					'</div>'
				].join("");
				for (var i = 0; i < datas.data.levelPackages.length; i++) {
					sLevel_raw = datas.data.levelPackages[i].level;
					sLevel = oMSG_level[sLevel_raw];
					if (sLevel_raw === 9) {
						aStatistic = [
							'<div class="e-statistic">',
							'<div class="ico-statistic clear">',
							'<div class="ico-pro">' + datas.data.proTotail + '</div>',
							'<div class="txt" id="proTotail">' + Can.msg.MODULE.EXPINDEX.PRO_TOTAIL + '</div>',
							'</div>',
							'<div class="ico-statistic clear">',
							'<div class="ico-pro ico-push">' + datas.data.proPush + '</div>',
							'<div class="txt" id="proPush">' + Can.msg.MODULE.EXPINDEX.PUSH_TIME + '</div>',
							'</div>',
							'<div class="ico-statistic clear">',
							'<div class="ico-pro ico-tit">' + datas.data.proCredit + '</div>',
							'<div class="txt" id="proCredit">' + Can.msg.MODULE.EXPINDEX.PROCREDIT + '</div>',
							'</div>',
							'</div>'
						].join("");
					}
					if (sLevel_raw === 11) {
						aStatistic = "<div class='e-statistic'></div>";
					}
					
					var expiredTime = null;
					if (datas.data.levelPackages[i].expiredTime) {
						expiredTime = Can.util.formatDateTime(datas.data.levelPackages[i].expiredTime, 'YYYY-MM-DD');
					} else {
						expiredTime = Can.msg.MODULE.EXPINDEX.NO_EFFECT;
					}
					sMomberLevel += [
						'<div class="member-level l' + sLevel_raw + '">',
						'<label>' + sLevel + '</label>',
						'<span>' + Can.msg.MODULE.EXPINDEX.MEMBER_LEVEL.L2 + '：</span>',
						'<em>' + expiredTime + '</em>',
						'</div>'
					].join("");
				}
			}
			var aData = [
				'<div class="m-left">',
				'<div class="m-profile">',
				'<a class="user-pic">',
				'<div class="placeholder">' + sPic + '</div>',
				'</a>',
				'<div class="info">',
				'<div class="section">',
				'<div class="name">' + datas.data.name + '</div>',
				'</div>',
				'<div class="country">',
				'<span class="flags fs' + datas.data.countryId + '"></span>' ,
				Can.util.formatRegion(datas.data.region),
				'</div>',
				'<a href=""><div class="up-level btn btn-s12">' + Can.msg.MODULE.EXPINDEX.MEMBER_LEVEL.L3 + '</div></a>',
				'</div>',
				'</div>',
				'<div class="member-type">',
				'<div class="level-title">' + Can.msg.MODULE.EXPINDEX.MEMBER_LEVEL.L1 + ':</div>',
				sMomberLevel,
				'</div>',
				aStatistic,
				'</div>'
			];
			return aData.join("");
		};
		var fGetItem = function (Detail) {
			var sDetailTotal = "";
			if (Detail.data && Detail.data.length > 0) {
				for (var i = 0; i < Detail.data.length; i++) {
					sDetailTotal += [
						'<li>',
						'<div class="e-cont">',
						'<div class="e-title">',
						'<div class="name">' + Detail.data[i].buyerName + '</div>',
						'<div class="country">',
						'<span class="flags fs' + Detail.data[i].countryId + '"></span>' + Detail.data[i].countryName + '</em>',
						'</div>',
						'<div class="e-time">' + Can.util.formatDateTime(Detail.data[i].postTime, 'YYYY-MM-DD') + '</div>',
						'</div>',
						'<div class="e-content">' + Detail.data[i].description + '</div>',
						'</div>',
						'</li>'].join("");
				}
			}
			var sMore = "<div class='e-tips'><span></span><a href='http://zh.e-cantonfair.com/custom-service' target='_blank'>" + Can.msg.MODULE.EXPINDEX.WANT_GETBUYLEAD + "</a></div>";
			if (Can.util.menuCreate.check(3)) {
				sMore = "<div class='e-tips'><span></span><a href='/C/supplier/#!/buyinglead'>" + Can.msg.MODULE.EXPINDEX.WANT_GETBUYLEAD + "</a></div>";
			}
			var aDataItem = [
				'<div class="m-right">',
				'<div class="hot-title">',
				'<div class="e-opt">' + Can.msg.MODULE.EXPINDEX.HTO_BUYINGLEAD + '</div>',
				sMore,
				'</div>',
				'<ul class="e-list">',
				sDetailTotal,
				'</ul>',
				'</div>'
			];
			return aDataItem.join("");
		};
		//加载info数据Can.util.Config.seller.express.expressInfo
		var _el = this.contentEl;
		var fShowInfo = function () {
			$.ajax({
				url: Can.util.Config.seller.express.expressInfo,
				cache: false,
				data: {"locale": "zh_cn"},
				success: function (jData) {
					if (jData.status && jData.status === 'success') {
						var sInfo = fGetExpress(jData);
						_el.append(sInfo);
						$("#proTotail").click(function () {
							$('#managePrdBtnId').trigger('click');
						});
						$("#proPush").click(function () {
							$('#carCountBtnId').trigger('click');
						});
						$("#proCredit").click(function () {
							$('#excCountBtnId').trigger('click');
						});
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		};
		fShowInfo();
		//加载Item数据
		var fShowItem = function () {
			$.ajax({
				url: Can.util.Config.seller.express.hotBl,
				cache: false,
				data: {"size": 5, "locale": "zh_cn"},
				success: function (jData) {
					if (jData.status && jData.status === 'success') {
						var sItem = fGetItem(jData);
						_el.append(sItem);
						$(".e-list li:last-child").addClass('no-line');
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		};
		fShowItem();
	}
});