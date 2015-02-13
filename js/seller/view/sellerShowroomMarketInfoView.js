/**
 * Marketing Info View
 * Created by Island Huang
 * Date: 13-3-4 下午11:22
 */
Can.view.SellerShowroomMarketInfoBaseView = Can.extend(Can.view.ShowroowBaseView, {
	tags: [
		{
			title: Can.msg.MODULE.SHOWROOM_SET.MARKET_LABEL_1,
			clkView: 'Can.view.SellerShowroomMktTag1View'
		},
		{
			title: Can.msg.MODULE.SHOWROOM_SET.MARKET_LABEL_2,
			clkView: 'Can.view.SellerShowroomMktTag2View'
		},
		{
			title: Can.msg.MODULE.SHOWROOM_SET.MARKET_LABEL_3,
			clkView: 'Can.view.SellerShowroomMktTag3View'
		}
	],
	startup: function () {
		Can.view.SellerShowroomMarketInfoBaseView.superclass.startup.call(this);
		var me = this,
			tagCon = $('<div class="tab-s2"></div>').appendTo(me.container),
			viewMap = new Can.util.ArrayMap();
		for (var i = 0; i < me.tags.length; i++) {
			var tagEl = $('<a href="javascript:;"></a>').appendTo(tagCon);
			tagEl.text(me.tags[i].title);
			tagEl.data({a: me.tags[i].clkView, index: i});
			tagEl.click(function () {
				var a = $(this).data('a'),
					index = $(this).data('index'),
					view = viewMap.get(index);
				if (view == null) {
					view = eval('new ' + a + '()');
					view.start();
					view.applyTo(me.container);
					viewMap.put(index, view);
				}
				if (view == me.currentView) {
					return;
				}
				me.currentView.hide();
				view.show();
				me.currentView = view;
				me.currentTag.removeClass('cur');
				me.currentTag = $(this);
				me.currentTag.addClass('cur');
			});
		}
		me.currentView = eval('new ' + me.tags[0].clkView + '()');
		me.currentView.start();
		me.currentView.applyTo(me.container);
		viewMap.put(0, me.currentView);
		me.currentView.show();
		//me.currentTag = tagCon.children('a:last-child');
		me.currentTag = tagCon.find('a').eq(0);
		me.currentTag.addClass('cur');
	}
});

Can.view.SellerShowroomInfoBaseTagView = Can.extend(Can.view.BaseView, {
	containerCssName: 'mod-form-s1',
	removeUrl: null,
	listItem: new Array(),
	hasCreateHD: false,
	hasCreateSaveBtn: false,
	saveUrl: null,
	startup: function () {
		Can.view.SellerShowroomInfoBaseTagView.superclass.startup.call(this);
		var me = this;
		me.container = $('<div class="' + me.containerCssName + '"></div>');
		me.delIco = $('<a class="bg-ico ico-del" style="display:none" href="javascript:;"></a>').appendTo('body');
		me.delIco.click(function () {
			var ico = $(this),
				el = $(this).data('el'),
				obj = $(this).data('obj');
			if (obj != null) {
				var pram = {};
				if (obj.exportSalesId) {
					pram["exportSalesId"] = obj.exportSalesId;
				}
				if (obj.salesInfoId) {
					pram["salesInfoId"] = obj.salesInfoId;
				}
				$.ajax({
					url: me.removeUrl,
					async: "false",
					type: 'POST',
					data: pram,
					success: function (returnData) {
						if (returnData.status == "success") {
							el.fadeOut(function () {
								el.remove();
								ico.hide();
							});
						} else {
							Can.util.notice(Can.msg.MODULE.SHOWROOM_SET.FAIL)
						}
					}
				})

			} else {
				el.fadeOut(function () {
					el.remove();
					ico.hide();
				});

			}
			me.listItem.pop();
			if (me.listItem.length == 0) {
				if (me.hasCreateSaveBtn) {
					me.hasCreateSaveBtn = false;
					me.saveBtnCon.hide();
				}
				me.createNoneRow();
			} else {
				if (me.id == 'SellerShowroomMktTag1View') {
					var field_num = me.findFields();
					if (field_num.length == 0) {
						if (me.hasCreateSaveBtn) {
							me.saveBtnCon.hide();
							me.hasCreateSaveBtn = false;
						}
					}
				}
			}
			var idx = me.listItem.length - 1;
			$(me.listItem[idx]).find(".btn-add").show();
		});
	},
	show: function () {
		this.container.slideDown();
		if (this.tipCon)
			this.tipCon.slideDown();
	},
	hide: function () {
		this.container.slideUp();
		if (this.tipCon)
			this.tipCon.slideUp();
	},
	initTips: function (tips) {
		var me = this;
		me.tipCon = $('<div class="tips-s4"></div>');
		$('<span class="ico"></span>').appendTo(me.tipCon);
		$('<div class="des">' + tips + '</div>').appendTo(me.tipCon);
	},
	createSaveBtn: function () {
		this.saveBtnCon = $('<div class="actions"></div>').appendTo(this.container);
		this.saveBtn = $('<a class="btn btn-s11" href="javascript:;">' + Can.msg.BUTTON.SAVE + '</a>');
		this.saveBtn.appendTo(this.saveBtnCon);
		this.hasCreateSaveBtn = true;
		var me = this;
		this.saveBtn.click(function () {
			me.save();
		});
	},
	findFields: function () {
		return  this.container.find('input');
	},
	createNoneRow: function (years) {
		var me = this;
		var now = new Date();
		var now_y = now.getFullYear();
		var obj_years = [
			{text: now_y, value: now_y},
			{text: now_y - 1, value: now_y - 1},
			{text: now_y - 2, value: now_y - 2},
			{text: now_y - 3, value: now_y - 3},
			{text: now_y - 4, value: now_y - 4},
			{text: now_y - 5, value: now_y - 5},
			{text: now_y - 6, value: now_y - 6},
			{text: now_y - 7, value: now_y - 7},
			{text: now_y - 8, value: now_y - 8},
			{text: now_y - 9, value: now_y - 9}
		]
		var this_years = years || obj_years;
		me.noneItemEl = $('<div class="data-none"></div>').appendTo(me.container);
		$('<p class="txt2">' + Can.msg.MODULE.SHOWROOM_SET.NOT_SALE_RECORD + '</p>').appendTo(me.noneItemEl);
		var addBtn = $('<a class="btn btn-s10" href="javascript:;">' + Can.msg.BUTTON.ADD_NOW + '</a>').appendTo(me.noneItemEl);
		addBtn.click(function () {
			me.createAddRow(this_years);
			me.noneItemEl.hide();
		});
	},
	save: function () {
		var me = this;
		if (!me.isSaving) {
			var error,
				required_error = Can.msg.MODULE.SHOWROOM_SET.REQUIRE,
				number_error = Can.msg.MODULE.SHOWROOM_SET.VALID_NUMBER,
				add_salesVolume_error = Can.msg.MODULE.SHOWROOM_SET.ADD_SALES_ERROR,
				same_year_error = Can.msg.MODULE.SHOWROOM_SET.SAME_YEAR_ERROR,
				maxNumber_error = Can.msg.MODULE.SHOWROOM_SET.MAX_NUMBER_ERROR;

			var isNum = function (v) {
//                return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v)
				return /^\d+(\.\d+)?$/.test(v)
			}
			var gt_maxNum = function (v) {
				if (parseFloat(v) > 9999999999.99)
					return true;
				else
					return false;
			}
			me.isSaving = true;
			var loading = $('<div class="loading-s1"><span></span>Loading ...</div>').insertAfter(me.saveBtn);
			var fields = me.findFields();
			var default_mark = function () {
				$(fields).each(function (i, item) {
					$(item).removeAttr("style");
				})
			};
			default_mark();
			var params = {};
			var add_turnover = 0;
			var exportSalesVolume = 0;
			var exist_fiscalYears = [];
			var editing_fiscalYears = [];
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i],
					value = field.value;
				var error_mark = function (obj) {
					$(obj).attr("style", "border:1px solid #ff0000");
				};
				switch (field.name) {
					case 'accountingYear':
						if (!value) {
							error = required_error;
							error_mark(field);
							break;
						}
						break;
					case 'annualExportSales':
						if (!value) {
							error = required_error;
							error_mark(field);
							break;
						}
						if (!isNum(value)) {
							error = number_error;
							error_mark(field);
							break;
						} else {
							if (gt_maxNum(value)) {
								error = maxNumber_error;
								error_mark(field)
								$(field).css({"float": "none", "margin-top": "0px"});
								break;
							}
						}
						exportSalesVolume = value;
						break;
					case'exportRegion':
						if (!value) {
							error = required_error;
							error_mark(field);
							break;
						}
						break;
					case 'yearTurnover':
						if (!value) {
							error = required_error;
							error_mark(field);
							break;
						}
						if (!isNum(value)) {
							error = number_error;
							error_mark(field)
							break;
						} else {
							if (gt_maxNum(value)) {
								error = maxNumber_error;
								error_mark(field);
								break;
							}
						}
						add_turnover += parseFloat(value);
						break;
					case'yearTurnover_hid':
						add_turnover += parseFloat(value);

					case'fiscalYears':
						if (!value) {
							error = required_error;
							error_mark(field);
							break;
						}
						editing_fiscalYears.push(value);
						break;
					case'exportProportion':
						if (!value) {
							error = required_error;
							error_mark(field);
							break;
						}
						if (!isNum(value)) {
							error = number_error;
							error_mark(field);
							break;
						}
						value *= 1;
						if (value < 0 || value > 100) {
							error = Can.msg.MODULE.SHOWROOM_SET.PERCENT_NUMBER;
							error_mark(field);
							break;
						}
						break;
				}
				if ((me.id == "SellerShowroomMktTag2View") && (add_turnover > exportSalesVolume)) {
					error = add_salesVolume_error;
				}

				if (error) {
					me.isSaving = false;
					loading.remove();
					delete loading;
					Can.util.notice(error)
					return;
				}

				if (params[field.name] && field.name != "yearTurnover_hid") {
					params[field.name].push(field.value);
				}
				else {
					if (field.name != "yearTurnover_hid") {
						params[field.name] = []
						params[field.name].push(field.value);
					}
				}

			}
			var field_num = fields.length;
			if (me.id == "SellerShowroomMktTag1View") {
				var add_same_year = false;
				var txt = $("div.saved");
				for (var t = 0; t < txt.length; t++) {
					exist_fiscalYears.push($(txt[t]).text());
				}
				for (var i = 0; i < editing_fiscalYears.length; i++) {
					for (var j = 0; j < exist_fiscalYears.length; j++) {
						if (editing_fiscalYears[i] == exist_fiscalYears[j]) {
							add_same_year = true;
							break;
						}
					}
					if (add_same_year) {
						error = same_year_error;
						me.isSaving = false;
						loading.remove();
						delete loading;
						Can.util.notice(error)
						return;
					}
				}
			}

			$.ajax({
				data: Can.util.formatFormData(params),
				url: me.saveUrl,
				type: 'POST',
				success: function (resultData) {
					if (resultData.status == "success") {
						Can.util.notice(Can.msg.MODULE.SHOWROOM_SET.SUCCESS);
						/*
						 var tipBox = new Can.ui.textTips({
						 target:me.container.siblings("div.tab-s2"),
						 hasArrow:false,
						 arrowIs:'Y',
						 hasIcon:true,
						 iconCss:'text-tips-icon',
						 text:Can.msg.MODULE.SHOWROOM_SET.SUCCESS,
						 id:'top_tip'
						 });
						 tipBox.show();
						 tipBox.updateCss({
						 marginTop:-105,
						 marginLeft:10
						 });
						 setTimeout(function () {
						 tipBox.hide();
						 }, 1500);
						 */
						me.isSaving = false;
						loading.remove();
						delete loading;
						if (me.id == "SellerShowroomMktTag1View" && me.saveBtnCon) {
							me.saveBtnCon.remove();
							me.hasCreateSaveBtn = false;
							me.saveBtnCon = null;
							me.saveBtn = null;
						}
						me.refreshData();
					} else {
						Can.util.notice(Can.msg.MODULE.SHOWROOM_SET.FAIL);
						/*
						 var tipBox = new Can.ui.textTips({
						 target:me.container.siblings("div.tab-s2"),
						 hasArrow:false,
						 arrowIs:'Y',
						 hasIcon:true,
						 iconCss:'text-tips-icon',
						 text:Can.msg.MODULE.SHOWROOM_SET.FAIL, //Can.msg.MODULE.BUYER_LEAD_MANAGE.SAVE,
						 id:'top_tip'
						 });
						 tipBox.show();
						 tipBox.updateCss({
						 marginTop:-105,
						 marginLeft:10
						 });
						 setTimeout(function () {
						 tipBox.hide();
						 }, 1500);
						 */
					}
				}
			});

//            }
		}
	},
	/**
	 * 将当前步骤显示在某个容器中
	 * @param {Object} container 父级容器
	 */
	applyTo: function (container) {
		if (typeof container == 'object') {
			if (this.tipCon)
				$(container).append(this.tipCon);
			$(container).append(this.container);
			this.topContainer = container;
		}
	},
	bindRowHover: function (rowEl) {
		var me = this;
		rowEl.hover(function (e) {
			$(this).addClass('hover');
			me.delIco.css({
				top: $(this).offset().top,
				left: $(this).offset().left + $(this).width()
			});
			me.delIco.show();
			me.delIco.data({obj: $(this).data('obj'), el: $(this)});
		}, function (e) {
			var t = e.relatedTarget;
			if (t != undefined && t.tagName == 'A') {
				var row = this;
				$(t).mouseout(function () {
					me.delIco.hide();
					$(row).removeClass('hover');
				});
				return;
			}
			$(this).removeClass('hover');
			me.delIco.hide();
		});
	}
});

/**
 * 贸易条款
 */
Can.view.SellerShowroomMktTag3View = Can.extend(Can.view.SellerShowroomInfoBaseTagView, {
	requireUiJs: ['js/framework/utils/template.js'],
	removeUrl: Can.util.Config.seller.setShowroomModule.removeSaleInfo,
	saveUrl: Can.util.Config.seller.setShowroomModule.saveTradeClause,
	startup: function () {
		Can.view.SellerShowroomMktTag3View.superclass.startup.call(this);
		var me = this;
		me.initTips(Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_2);
		$.ajax({
			url: Can.util.Config.seller.setShowroomModule.trdInfoTemplate,
			dataType: 'text',
			success: function (html) {
				//加载模板引擎
				var template = Can.util.template.compile(html);
				me.container.html(template({}));
				me.refreshData();
			}
		});
	},
	refreshData: function () {
		$('#setShowroom_saleInfoFormId')[0].reset();

		var dataStr = $.ajax({
			url: Can.util.Config.seller.setShowroomModule.loadtradeInfo,
			async: false,
			type: 'POST',
			data: null//{companyId:Can.util.userInfo().getCompanyId()}
		}).responseText;
		var data = eval('(' + dataStr + ')');
		var obj = data.data.marketingInfo.tradeClause;
		var me = this;
		var exports = obj.mainExportMarkets.countries;
		var tradeAreas = obj.mainExportMarkets.tradeAreas;
		$('#export', '#setShowroom_saleInfoFormId').empty();
		if (tradeAreas && tradeAreas.length) {
			for (var i = 0; i < tradeAreas.length; i++) {
				$('<div class="mod-item-q">' +
					'  <span>' + tradeAreas[i].value + '</span>' +
					'</div>').appendTo('#export', '#setShowroom_saleInfoFormId');
			}
		}
		if (exports && exports.length) {
			for (var i = 0; i < exports.length; i++) {
				$('<div class="mod-item-q">' +
					'  <span>' + exports[i].value + '</span>' +
					'</div>').appendTo('#export', '#setShowroom_saleInfoFormId');
			}
		}
		var paytips = obj.form.expectPayTerms.options;
		if ($('#payTip_checkboxes', '#setShowroom_saleInfoFormId').html())$('#payTip_checkboxes', '#setShowroom_saleInfoFormId').html("");
		for (var p = 0; p < paytips.length; p++) {
			$('#payTip_checkboxes', '#setShowroom_saleInfoFormId').append('<label for="' + paytips[p].value + '"><input type="checkbox" class="vertical" id="' + paytips[p].value + '" name="expectPayTerms" value="' + paytips[p].value + '">' + paytips[p].text + '</label>')
		}
		var selected_payTips = obj.form.expectPayTerms['default'];
		$('input[name=expectPayTerms]', '#setShowroom_saleInfoFormId').each(function (index) {
			if (selected_payTips && selected_payTips.length) {
				for (var i = 0; i < selected_payTips.length; i++) {
					if (this.value == selected_payTips[i]) {
						this.checked = 'checked';
						break;
					}
				}
			}
		});
		var tradecurrencies = obj.form.expectPayCurrency.options;
		if ($('#expectPay_checkboxes', '#setShowroom_saleInfoFormId').html())$('#expectPay_checkboxes', '#setShowroom_saleInfoFormId').html("");
		for (var t = 0; t < tradecurrencies.length; t++) {
			$('#expectPay_checkboxes', '#setShowroom_saleInfoFormId').append('<label for="' + tradecurrencies[t].value + '"><input type="checkbox" class="vertical" id="' + tradecurrencies[t].value + '" name="expectPayCurrency" value="' + tradecurrencies[t].value + '">' + tradecurrencies[t].text + '</label>')
		}
		var selected_expectPay = obj.form.expectPayCurrency['default'];
		$('input[name=expectPayCurrency]', '#setShowroom_saleInfoFormId').each(function (index) {
			if (selected_expectPay && selected_expectPay.length) {
				for (var i = 0; i < selected_expectPay.length; i++) {
					if (this.value == selected_expectPay[i]) {
						this.checked = 'checked';
						break;
					}
				}
			}
		});
		var payMethods = obj.form.payMethod.options;
		if ($('#payMethods_checkboxes', '#setShowroom_saleInfoFormId').html()) $('#payMethods_checkboxes', '#setShowroom_saleInfoFormId').html("");
		for (var m = 0; m < payMethods.length; m++) {
			$('#payMethods_checkboxes', '#setShowroom_saleInfoFormId').append('<label for="' + payMethods[m].value + '"><input type="checkbox" class="vertical" id="' + payMethods[m].value + '" name="payMethod" value="' + payMethods[m].value + '">' + payMethods[m].text + '</label>')
		}
		var selected_payMethods = obj.form.payMethod['default'];
		$('input[name=payMethod]', '#setShowroom_saleInfoFormId').each(function (index) {
			if (selected_payMethods && selected_payMethods.length) {
				for (var i = 0; i < selected_payMethods.length; i++) {
					if (this.value == selected_payMethods[i]) {
						this.checked = 'checked';
						break;
					}
				}
			}

		});
		$('#fobPort', '#setShowroom_saleInfoFormId').val(obj.form.fobPort['default']);
		$('#delivery', '#setShowroom_saleInfoFormId').val(obj.form.deliveryDeadline['default']);
		$('input[name=sendSamples]', '#setShowroom_saleInfoFormId').each(function () {
			if (this.value == obj.form.sendSamples['default'])
				this.checked = 'checked';
		});
		$('#saveBtn', '#setShowroom_saleInfoFormId').click(function () {
			me.save();
		});
	},
	findFields: function () {
		return  $('#setShowroom_saleInfoFormId').serializeArray();
	}
});
/**
 * 营业情况view
 */
Can.view.SellerShowroomMktTag1View = Can.extend(Can.view.SellerShowroomInfoBaseTagView, {
	id: 'SellerShowroomMktTag1View',
	containerCssName: 't-s1',
	saveUrl: Can.util.Config.seller.setShowroomModule.saveSaleInfo,
	removeUrl: Can.util.Config.seller.setShowroomModule.removeSaleInfo,
	startup: function () {
		Can.view.SellerShowroomMktTag1View.superclass.startup.call(this);
		var me = this;
		me.refreshData();
	},
	refreshData: function () {
		this.container.children('.row').remove();
		this.listItem = new Array();
		var dataStr = $.ajax({
			url: Can.util.Config.seller.setShowroomModule.getSaleInfoListForSetShowroom,
			async: false,
			type: 'POST',
			data: {companyId: Can.util.userInfo().getCompanyId()}
		}).responseText;
		var data = eval('(' + dataStr + ')');
		var obj = data.data.marketingInfo.salesInfo;
		if (obj.list.length == 0) {
			this.createNoneRow(obj.fiscalYears);
		}
		else {
			if (!this.hasCreateHD)
				this.createHD();
			var me = this;
			for (var i = 0; i < obj.list.length; i++) {
				var rowEl = $('<div class="row"></div>'),
					yearEl = $('<div class="v210 saved">' + obj.list[i].fiscalYear + '</div>').appendTo(rowEl),
					moneyEl = $('<div class="v180">' + obj.list[i].yearTurnover + '</div>').appendTo(rowEl),
					exportEl = $('<div class="v130">' + obj.list[i].exportProportion + '</div>').appendTo(rowEl);
				var editEl = $('<a class="bg-ico ico-trail" href="javascript:;" cantitle="' + Can.msg.CAN_TITLE.MODIFY + '"></a>').appendTo(rowEl);
				var addEl = $('<a class="btn-add" href="javascript:;"></a>').css("display", "none").appendTo(rowEl);
				addEl.click(function () {
					$(this).hide();
					me.createAddRow(obj.fiscalYears);
				});
				if (i == obj.list.length - 1) {
					addEl.css("display", "block");
				}
				if (!me.hasCreateSaveBtn)
					rowEl.appendTo(me.container)
				else
					rowEl.insertBefore(me.saveBtnCon)
				rowEl.data({obj: obj.list[i]});
				me.bindRowHover(rowEl);
				editEl.click(function () {
					var _listItem = me.FiscalYear(obj.fiscalYears);
					var _rowEl = $(this).parent();
					var data = _rowEl.data('obj');
					var cs = _rowEl.children();
					$(cs[0]).empty();
					$('<input name="salesInfoId" type="hidden" value="' + data.salesInfoId + '">').appendTo($(cs[0]));
					var s1 = new Can.ui.DropDownField({
						id: 's1Id',
						name: "fiscalYears",
						blankText: Can.msg.MODULE.SHOWROOM_SET.SELECT_BLANK_TXT,
						valueItems: _listItem.valueItem,
						labelItems: _listItem.labelItem,
						width: 80
					});
					s1.setValue(data.fiscalYear);
					s1.applyTo($(cs[0]));
					$(cs[0]).append('<span class="bg-ico required"></span>');
					$(cs[0]).removeClass("saved");
					$(cs[1]).empty();
					$('<input type="text" class="w100 ipt-s1" name="yearTurnover" value="' + ((data.yearTurnover.replace(/\,/g, "")).replace("USD", "")).replace(/\ /g, "") + '"><span>USD</span>').appendTo($(cs[1]));
					$(cs[1]).append('<span class="bg-ico required"></span>');
					$(cs[2]).empty();
					$('<input type="text" class="w100 ipt-s1" name="exportProportion" value="' + data.exportProportion.replace("%", "") + '"><span>%</span>').appendTo($(cs[2]));
					$(cs[2]).append('<span class="bg-ico required"></span>');
					if (!me.hasCreateSaveBtn) {
						me.createSaveBtn();
					}
					$(this).hide();
				});

				me.listItem.push(rowEl);
			}

		}
	},
	createAddRow: function (years) {
		var me = this;
		if (!me.hasCreateHD)
			me.createHD();
		if (me.container.find("div.row").length < 5) {
			var rowEl = $('<div class="row"></div>'),
				random = (new Date()).getTime().toString(),
				testStr = random.substring(8, random.length),
				salesInfoIdEl = $('<input type="hidden" valeu="" name="salesInfoId">').appendTo(rowEl)
			s1El = $('<div class="v210"></div>').appendTo(rowEl),
				s2El = $('<div class="v180"><span class="bg-ico required"></span><input type="text" name="yearTurnover" class="w100 ipt-s1"><span class="r-txt">USD</span></div>').appendTo(rowEl),
				s3El = $('<div class="v130"><span class="bg-ico required"></span><input type="text" name="exportProportion" class="w100 ipt-s1"><span class="r-txt">%</span></div>').appendTo(rowEl);
			if (me.container.find("div.row").length < 4) {
				var addEl = $('<a class="btn-add" href="javascript:;"></a>').appendTo(rowEl);
				addEl.click(function () {
					$(this).hide();
					me.createAddRow(years);
				});
			}

			if (me.hasCreateSaveBtn) {
				rowEl.insertBefore(me.saveBtnCon);
				me.saveBtnCon.show();
			}
			else {
				rowEl.appendTo(me.container);
			}
			var _listItem = me.FiscalYear(years);
			var s1 = new Can.ui.DropDownField({
				id: 's1Id',
				name: "fiscalYears",
				blankText: Can.msg.MODULE.SHOWROOM_SET.SELECT_BLANK_TXT,
				valueItems: _listItem.valueItem,
				labelItems: _listItem.labelItem,
				width: 80
			});
			s1.applyTo(s1El);
			s1El.append('<span class="bg-ico required"></span>')
			rowEl.data({obj: null});
			me.bindRowHover(rowEl);
			if (!me.hasCreateSaveBtn) {
				me.createSaveBtn();
			}

			me.listItem.push(rowEl);
		} else {
			Can.util.notice(Can.msg.MODULE.SHOWROOM_SET.MAX_ITEM)
//            var tipBox = new Can.ui.textTips({
//                target:me.container,
//                hasArrow:false,
//                arrowIs:'Y',
//                hasIcon:true,
//                iconCss:'text-tips-icon',
//                text:Can.msg.MODULE.SHOWROOM_SET.MAX_ITEM
//            });
//            tipBox.updateCss({
//                marginTop:-540,
//                marginLeft:10
//            });
//            tipBox.show();
//            setTimeout(function () {
//                tipBox.hide();
//            }, 3000)
		}
	},
	createHD: function () {
		var me = this,
			hdEl = $('<div class="hd"></div>').appendTo(me.container);
		$('<div class="v210">' + Can.msg.MODULE.SHOWROOM_SET.FISCAL_YEAR + '</div>').appendTo(hdEl);
		$('<div class="v180">' + Can.msg.MODULE.SHOWROOM_SET.YEAR_INCOME + '</div>').appendTo(hdEl);
		$('<div class="v130">' + Can.msg.MODULE.SHOWROOM_SET.EXPORT_RATE + '</div>').appendTo(hdEl);
		me.hasCreateHD = true;
	},
	FiscalYear: function (selectYears) {
		var valueItemList = [], labelItemList = [];
		if (selectYears.length) {
			for (var sy = 0; sy < selectYears.length; sy++) {
				labelItemList.push(selectYears[sy].text);
				valueItemList.push(selectYears[sy].value);
			}
		}
		var itemList = {valueItem: valueItemList, labelItem: labelItemList}
		return itemList;
	}
});

/**
 * 各地出口销售情况
 */
Can.view.SellerShowroomMktTag2View = Can.extend(Can.view.SellerShowroomInfoBaseTagView, {
	id: 'SellerShowroomMktTag2View',
	containerCssName: 't-s1',
	areasData: null,
	data: null,
	_fiscalYears: [],
	_salesVolume: null,
	saveUrl: Can.util.Config.seller.setShowroomModule.saveAreasExportSaleInfo,
	removeUrl: Can.util.Config.seller.setShowroomModule.removeAreaSaleInfo,
	startup: function () {
		Can.view.SellerShowroomMktTag2View.superclass.startup.call(this);
		var me = this;
		me.refreshData();
	},
	refreshData: function () {
		this.listItem = [];
		this.container.empty();
		var me = this,
			dataStr = $.ajax({
//            url:Can.util.Config.seller.setShowroomModule.loadAreasSaleInfoNoData,//用这条URL测试没有数据的情况
				url: Can.util.Config.seller.setShowroomModule.loadAreasSaleInfo,
				async: false,
				type: 'POST',
				data: {companyId: Can.util.userInfo().getCompanyId()}
			}).responseText;
		var data = eval('(' + dataStr + ')');
		me.data = data.data.marketingInfo.exportSales;
		me._salesVolume = (((data.data.marketingInfo.exportSales.annualExportSales).replace(/\ /g, "")).replace("USD", "")).replace(/\,/g, "");
		for (var f = 0; f < data.data.marketingInfo.exportSales.accountingYears.length; f++) {
			me._fiscalYears.push(data.data.marketingInfo.exportSales.accountingYears[f].value);
		}
		if (me.data.list.length) {//当前有数据的情况
			//console.log(me.data)
			me.createTopRow(false);
			for (var i = 0; i < me.data.list.length; i++) {
				if (me.areasData == null) {
					var areaStr = $.ajax({
						url: Can.util.Config.seller.setShowroomModule.getMainSaleAreas,
						type: 'POST',
						async: false
					}).responseText;
					me.areasData = eval('(' + areaStr + ')').data.marketingInfo.exportSales;
				}
				var _row = $('<div class="row-s1"></div>').appendTo(me.container);
				var _rowData = me.data.list[i];
				$('<div class="v180">' + _rowData.exportRegion + '</div>').appendTo(_row);
				$('<div class="v130">' + _rowData.yearTurnover + '<input type="hidden" value="' + parseFloat((((_rowData.yearTurnover).replace(/\,/g, "")).replace(/\ /g, "")).replace("USD", "")) + '" name="yearTurnover_hid"></div>').appendTo(_row);
				var tempValue = (parseFloat((((_rowData.yearTurnover).replace(/\,/g, "")).replace(/\ /g, "")).replace("USD", "") / me._salesVolume)) * 100
				tempValue = tempValue.toFixed(2);
				var rateField = $('<div class="v80">' + tempValue + '%</div>').appendTo(_row);
				$('<div class="v100" cantitle="' + _rowData.majorCustomer + '">' + _rowData.majorCustomer + '</div>').appendTo(_row);
				var editBtn = $('<a class="bg-ico ico-trail" href="javascript:;" cantitle="' + Can.msg.CAN_TITLE.MODIFY + '"></a>').appendTo(_row);
				var addBtn = $('<a class="btn-add" href="javascript:;"></a>').css("display", "none").appendTo(_row);
				addBtn.click(function () {
					$(this).hide();
					var dataItem_length = me.container.find("div.row").length + me.container.find("div.row-s1").length + me.container.find("div.row-s4").length;
					if (dataItem_length >= 11) {
						addBtn.remove();
//                            var tipBox = new Can.ui.textTips({
//                                target:me.container.siblings("div.tab-s2"),
//                                hasArrow:false,
//                                arrowIs:'Y',
//                                hasIcon:true,
//                                iconCss:'text-tips-icon',
//                                text:Can.msg.MODULE.SHOWROOM_SET.DATA_LIMIT,
//                                id:'top_tip'
//                            });
//                            tipBox.show();
//                            tipBox.updateCss({
//                                marginTop:-105,
//                                marginLeft:10
//                            });
//                            setTimeout(function () {
//                                tipBox.hide();
//                            }, 1500);
						return;
					}

					me.createAddRow();
				});
				if (i == (me.data.list.length - 1)) {
					addBtn.css("display", "block");
				}

				_row.data({obj: _rowData, rateField: rateField});
				me.bindRowHover(_row);

				editBtn.click(function () {
					var _rowEl = $(this).parent(),
						data = _rowEl.data('obj'),
						_rField = _rowEl.data('rateField'),
						cs = _rowEl.children();
					_rowEl.removeClass('row-s1');
					_rowEl.addClass('row-s4');
					$(this).hide();
					$(cs[0]).empty();
					var areaObj = null,
						valArray = [],
						labArray = [];
					areaObj = me.areasData.exportRegions;
					for (var i = 0; i < areaObj.length; i++) {
						valArray[i] = areaObj[i].value;
						labArray[i] = areaObj[i].text;
					}
					var exportId = $('<input type="hidden" name="exportSalesId" value="' + data.exportSalesId + '">')
					var s1 = new Can.ui.DropDownField({
						id: 's1Id',
						name: "exportRegion",
						blankText: Can.msg.MODULE.SHOWROOM_SET.SELECT_BLANK_TXT,
						valueItems: valArray,
						labelItems: labArray,
						width: 140
					});

					for (var t = 0; t < labArray.length; t++) {
						var select_data = data.exportRegion;
						if (labArray[t] == select_data) {
							s1.setValue(valArray[t]);
						}
					}
					exportId.appendTo($(cs[0]));
					s1.applyTo($(cs[0]));
					$(cs[0]).append('<span class="bg-ico required"></span>');
					$(cs[1]).empty();
					var amountField = $('<input type="text" class="w60 ipt-s1" name="yearTurnover" value="' + (((data.yearTurnover).replace(/\,/g, "")).replace(/\ /g, "")).replace("USD", "") + '">');
					amountField.appendTo($(cs[1]));
					$(cs[1]).append('USD');
					$(cs[1]).append('<span class="bg-ico required"></span>');
					amountField.keyup(function () {
						var v = this.value;

						if (!v)
							return
						me.calculate(v, me._salesVolume, _rField);
					});
					$(cs[3]).empty();
					var cuss = [];
					if (data.majorCustomer.indexOf(","))
						cuss = data.majorCustomer.split(',');
					else
						cuss[0] = data.majorCustomer;
					$(cs[3]).removeAttr("cantitle");
					for (var i = 0; i < 3; i++) {
						$('<input type="text" class="w60 ipt-s1" name="majorCustomer' + (i + 1) + '" value="' + (cuss[i] ? cuss[i] : "") + '">').appendTo($(cs[3]));
					}
					if (!me.hasCreateSaveBtn) {
						me.createSaveBtn();
					}
				});
				me.listItem.push(_row);
			}
			me.createSaveBtn();
		}
		else {//当前无数据的情况
			me.createTopRow(true);
			me.createAddRow();
		}
	},
	calculate: function (val, total, el) {
		//这个地方计算出来的“所在比例”将不会传到后端，假如后端需要保存此数据，后端应该需要自己重新计算，以保证安全
		var v = parseFloat(val);
		var result = (parseFloat(v / total).toFixed(4)) * 100;
		el.text((result.toFixed(2)) + '%');
	},
	createAddRow: function () {
		var me = this;
		var rowEl = $('<div class="row"></div>'),
			random = (new Date()).getTime().toString(),
			testStr = random.substring(8, random.length),
			esId = $('<input type="hidden" value="" name="exportSalesId">').appendTo(rowEl),
			s1El = $('<div class="v180"><span class="bg-ico required"></span></div>').appendTo(rowEl),
			s2El = $('<div class="v130"><span class="bg-ico required"></span></div>').appendTo(rowEl),
			s3El = $('<div class="v80">%</div>').appendTo(rowEl),
			s4El = $('<div class="v250">' +
				'<input type="text" name="majorCustomer1" class="w60 ipt-s1">' +
				'<input type="text" name="majorCustomer2" class="w60 ipt-s1">' +
				'<input type="text" name="majorCustomer3" class="w60 ipt-s1">' +
				'</div>').appendTo(rowEl);
		var dataItem_length = me.container.find("div.row").length + me.container.find("div.row-s1").length + me.container.find("div.row-s4").length;
		if (dataItem_length < 10) {
			var addEl = $('<a class="btn-add"  href="javascript:;"></a>').appendTo(rowEl);
			addEl.click(function () {
				$(this).hide();
				me.createAddRow();
			});
		}

		var usdField = $('<input type="text" name="yearTurnover" class="w80 ipt-s1">').appendTo(s2El);
		usdField.keyup(function () {
			var v = this.value;
			if (!v)
				return
			me._salesVolume = $('input[name="annualExportSales"]').val();
			me.calculate(v, me._salesVolume, s3El);

		});
		$('<span class="r-txt">USD</span>').appendTo(s2El);
		if (me.hasCreateSaveBtn) {
			rowEl.insertBefore(me.saveBtnCon);
			me.saveBtnCon.show();
		}
		else {
			rowEl.appendTo(me.container);
		}
		if (me.areasData == null) {
			var areaStr = $.ajax({
				url: Can.util.Config.seller.setShowroomModule.getMainSaleAreas,
				type: 'POST',
				async: false
			}).responseText;
			me.areasData = eval('(' + areaStr + ')').data.marketingInfo.exportSales;
		}
		var areaObj = null,
			valArray = [],
			labArray = [];
		areaObj = me.areasData.exportRegions;
		for (var i = 0; i < areaObj.length; i++) {
			valArray[i] = areaObj[i].value;
			labArray[i] = areaObj[i].text;
		}
		var s1 = new Can.ui.DropDownField({
			id: 's1Id',
			name: "exportRegion",
			blankText: Can.msg.MODULE.SHOWROOM_SET.SELECT_BLANK_TXT,
			valueItems: valArray,
			labelItems: labArray,
			width: 120
		});
		s1.applyTo(s1El);
		rowEl.data({obj: null});
		me.bindRowHover(rowEl);
		if (!me.hasCreateSaveBtn) {
			me.createSaveBtn();
		}

		me.listItem.push(rowEl);
	},
	createTopRow: function (isNoData) {
		var me = this,
			yearRow = $('<div class="row"></div>').appendTo(me.container),
			titleTipRow = $('<div class="row-s1"><em>' + Can.msg.MODULE.SHOWROOM_SET.MARKET_TIPS_1 + '</em></div>').appendTo(me.container),
			titleRow = $('<div class="row-s1"></div>').appendTo(me.container);
		if (!isNoData) {
			var fiscal_year = $('<div class="text"><span class="bg-ico required"></span>' + Can.msg.MODULE.SHOWROOM_SET.FISCAL_YEAR + ':</div>').appendTo(yearRow);
			var s1 = new Can.ui.DropDownField({
				id: 'syearSelectId',
				name: 'accountingYear',
				blankText: Can.msg.MODULE.SHOWROOM_SET.SELECT_BLANK_TXT,
				valueItems: me._fiscalYears,
				labelItems: me._fiscalYears,
				width: 70
			});
			s1.el.attr("style", "float:left");
			s1.setValue(me.data.accountingYear);
			s1.applyTo(yearRow);
			$('<div class="space"></div>').appendTo(yearRow);
			$('<div class="text"><span class="bg-ico required"></span>' + Can.msg.MODULE.SHOWROOM_SET.YEAR_EXPORT_AMOUNT +
				'<input name="annualExportSales" style="float:none; margin-top: 0px;" class="w130 ipt-s1" type="text" VALUE="' + me._salesVolume + '">' + 'USD</div>').appendTo(yearRow);
		}
		else {
			$('<div class="text"><span class="bg-ico required"></span>' + Can.msg.MODULE.SHOWROOM_SET.FISCAL_YEAR + ':</div>').appendTo(yearRow);
			var s1 = new Can.ui.DropDownField({
				id: 'syearSelectId',
				name: 'accountingYear',
				blankText: Can.msg.MODULE.SHOWROOM_SET.SELECT_BLANK_TXT,
				valueItems: me._fiscalYears,
				labelItems: me._fiscalYears,
				width: 70
			});
			s1.el.attr("style", "float:left");
			s1.applyTo(yearRow);
			$('<div class="space"></div>').appendTo(yearRow);
			$('<div class="text"><span class="bg-ico required"></span>' + Can.msg.MODULE.SHOWROOM_SET.YEAR_EXPORT_AMOUNT +
				'</div>').appendTo(yearRow);
			var amount = $('<input name="annualExportSales" style="float:none; margin-top: 0px;" class="w130 ipt-s1" type="text" VALUE="' + me._salesVolume + '">').appendTo(yearRow);
			$('<span>USD</span>').appendTo(yearRow);
			amount.keyup(function () {
				me.data.amount = this.value
			});
		}

		$('<div class="v180">' + Can.msg.MODULE.SHOWROOM_SET.SALE_AREA + '</div>').appendTo(titleRow);
		$('<div class="v130">' + Can.msg.MODULE.SHOWROOM_SET.YEAR_SALE_AMOUNT + '</div>').appendTo(titleRow);
		$('<div class="v80">' + Can.msg.MODULE.SHOWROOM_SET.RATE_PERCENT + '</div>').appendTo(titleRow);
		$('<div class="v180">' + Can.msg.MODULE.SHOWROOM_SET.MAIN_CUSTOMER + '</div>').appendTo(titleRow);
	}
});
