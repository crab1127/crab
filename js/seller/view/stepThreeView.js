/**
 * 商业规则设置-----第三步
 * Created by Island Huang
 * Date: 13-1-30 上午12:45
 */
Can.view.StepThreeView = Can.extend(Can.view.StepView, {
	id:'businessRuleStepThreeId',
	title:Can.msg.MODULE.BUSINESS_SET.STEP3_TITLE,
	stepNo:3,
	initDataUrl:Can.util.Config.seller.businessSettingModule.saletradeares,
	selectZoneItems:new Can.util.ArrayMap(),
	selectStateItems:new Can.util.ArrayMap(),
	maxZoneNo:12,
	maxStateNo:20,
	onData:function (items) {
		var me = this,
			tradeZoneEL = $('<div></div>').addClass('trade-zone').appendTo(this.stepContainer),
			tradeStateEL = $('<div></div>').addClass('trade-state').appendTo(this.stepContainer),
			tradeZoneTitleEL = $('<div class="tit-s4"></div>').appendTo(tradeZoneEL),
			tradeStateTitleEL = $('<div class="tit-s4"></div>').appendTo(tradeStateEL),
			zoneContainerEL = $('<div class="mod-swhich"></div>').appendTo(tradeZoneEL),
			stateContainerEL = $('<div class="mod-swhich"></div>').appendTo(tradeStateEL),
			zoneSlightEL = $('<div class="slight"></div>').appendTo(zoneContainerEL),
			stateSlightEL = $('<div class="slight"></div>').appendTo(stateContainerEL),
			zoneUlEL = $('<ul></ul>').appendTo(zoneSlightEL),
			stateUlEL = $('<ul></ul>').appendTo(stateSlightEL);
		var zonePage = new Can.ui.limitButton({
			cssName:'ui-page color-block business-switch',
			option:[0, 1, 0],
			total:2,
			limit:1
		});
		//贸易区分页
		zonePage.onChange(function (nPage) {
			var _w = zoneSlightEL.width();
			var _l = (nPage - 1) * _w;
			zoneUlEL.animate({
				left:-_l
			}, 'slow', 'swing');
		});
		zoneContainerEL.append(zonePage.el);
		//国家及地区分页
		var statePage = new Can.ui.limitButton({
			cssName:'ui-page color-block business-switch',
			option:[0, 1, 0],
			total:2,
			limit:1
		});
		statePage.onChange(function (nPage) {
			var _w = stateSlightEL.width();
			var _l = (nPage - 1) * _w;
			stateUlEL.animate({
				left:-_l
			}, 'slow', 'swing');
		});
		stateContainerEL.append(statePage.el);

		zoneUlEL.css('position', 'relative');
		stateUlEL.css('position', 'relative');
		tradeZoneTitleEL.html('<span class="mrk"></span>' +
			'<h3>' + Can.msg.MODULE.BUSINESS_SET.STEP3_TITLE_1 + '</h3>');
		tradeStateTitleEL.html('<span class="mrk"></span>' +
			'<h3>' + Can.msg.MODULE.BUSINESS_SET.STEP3_TITLE_2 + '</h3>');

		var zoneItems = items.areas;
		var stateItems = items.countries;
		var i, item, itemEL;
		for (i = 0; i < zoneItems.length; i++) {
			item = zoneItems[i];
			itemEL = $('<li></li>').appendTo(zoneUlEL);
			itemEL.html('<div class="mod-zone zone-s' + item.areaId + '"></div>' +
				'<a class="bg-ico cat-chk" href="javascript:;">' + (Can.util.Config.lang == 'en' ? item.enLabel : item.label) + '</a>');
			itemEL.data('item', item);
			itemEL.bind('click', function () {
				me.onItemClick($(this), $(this).data('item'), 'zone');
			});
		}
		for (i = 0; i < stateItems.length; i++) {
			item = stateItems[i];
			itemEL = $('<li></li>').appendTo(stateUlEL);
			itemEL.html('<div class="mod-statue statue-s' + item.countryId + '"></div>' +
				'<a class="bg-ico cat-chk" href="javascript:;">' + (Can.util.Config.lang == 'en' ? item.enLabel : item.label) + '</a>');
			itemEL.data('item', item);
			itemEL.bind('click', function () {
				me.onItemClick($(this), $(this).data('item'), 'state');
			});
		}
	},
	onItemClick:function (el, item, iszone) {
		var sItems = null,
			no = 0,
			id = null;
		if (iszone === 'zone') {
			sItems = this.selectZoneItems;
			no = this.maxZoneNo;
			id = item.areaId;
		}
		else {
			sItems = this.selectStateItems;
			no = this.maxStateNo;
			id = item.countryId;
		}
		if (el.children('a').hasClass('chked')) {
			//已经被选择，则取消选择
			el.children('a').removeClass('chked');
			sItems.remove(id);
		}
		else {
			el.children('a').addClass('chked');
			sItems.put(id, item);
		}
		this.fireEvent('onitemselected', this.selectStateItems, this.maxStateNo,this.selectZoneItems,this.maxZoneNo);
	},
	/**
	 * 返回所选择的item的categoryID
	 * @return {string} 'id1,id2,id3,...,idn'
	 */
	getSelectValue:function () {
		var zones = this.selectZoneItems.keySet();
		var state = this.selectStateItems.keySet();
		return {'states':state.toString(), 'zones':zones.toString()};
	}
});
