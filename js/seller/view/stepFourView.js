/**
 * 商业规则设置-----第四步
 * Created by Island Huang
 * Date: 13-1-30 上午12:45
 */
Can.view.StepFourView = Can.extend(Can.view.StepView, {
	id: 'businessRuleStepFourId',
	stepNo: 4,
	initDataUrl: Can.util.Config.seller.businessSettingModule.questionnaire,
	selectItems: new Can.util.ArrayMap(),
	onData: function (items) {
		var me = this;
		for (var i = 0; i < items.length; i++) {
			var item = items[i],
				tit1 = $('<div class="tit-s3 clear"></div>').appendTo(this.stepContainer);
			tit1.html('<span class="ico"></span><h3>' + item.label + '</h3>');
			var qcontainer = $('<div class="f-cont"></div>').appendTo(this.stepContainer);
			var q, qtype, qtit, qid, row, optionsContainerEL, b, optionid, qvalue, input;
			if (item.items && item.items.length > 0) {//有二级问题的情况
				var sitems = item.items;
				for (var a = 0; a < sitems.length; a++) {
					q = sitems[a];
					qtit = q.label;
					qtype = q.type;
					qid = q.questionId;
					row = $('<div class="row"></div>').appendTo(qcontainer);
					$('<div class="tit-s4"><span class="mrk"></span><h3>' + qtit + '</h3></div>').appendTo(row);
					optionsContainerEL = $('<div class="el"></div>').appendTo(row);
					for (b = 0; b < q.options.length; b++) {
						optionid = i + '' + a + '' + b;
						qvalue = q.options[b].value;
						input = $('<input id="' + optionid + '" value="' + qvalue + '" name="' + qid + '" type="' + qtype + '">').appendTo(optionsContainerEL);
						input.wrap('<label for="' + optionid + '"></label>');
						$('<span>' + q.options[b][Can.util.Config.lang == 'en' ? 'en_text' : 'text'] + '</span>').insertAfter(input);
						input.data('item', {qid: qid, val: q.options[b].value});
						input.bind('click', function () {
							me.onItemClick($(this), $(this).data('item'));
						});
					}
				}
			}
			else {
				q = item;
				qtype = q.type;
				qid = q.questionId;
				row = $('<div class="row f-chk"></div>').appendTo(qcontainer);
				optionsContainerEL = $('<div class="el"></div>').appendTo(row);
				for (b = 0; b < q.options.length; b++) {
					optionid = i + '' + a + '' + b;
					qvalue = q.options[b].value;
					input = $('<input id="' + optionid + '" value="' + qvalue + '"  name="' + qid + '" type="' + qtype + '">').appendTo(optionsContainerEL);
					input.wrap('<label for="' + optionid + '"></label>');
					$('<span>' + q.options[b][Can.util.Config.lang == 'en' ? 'en_text' : 'text'] + '</span>').insertAfter(input);
					input.data('item', {qid: qid, val: q.options[b].value});
					input.bind('click', function () {
						me.onItemClick($(this), $(this).data('item'));
					});
				}
			}
		}
	},
	onItemClick: function (el, item) {
		var name = el.attr('name'),
			qid = item.qid,
			tsp_name = "";
		if (qid == "205") {
			tsp_name = "exhib";
		} else if (qid == "206") {
			tsp_name = "lastExhib";
		} else if (qid == "100") {
			tsp_name = "companyType";
		} else if (qid == "101") {
			tsp_name = "companyProperty";
		}

		this.selectItems.remove(tsp_name);
		var sValue = [];
		$('input[name=' + name + ']').filter(':checked').each(function () {
			sValue.push(this.value);
		});

		if (sValue.length) {
			this.selectItems.put(tsp_name, sValue.toString());
		}
		this.fireEvent('onitemselected', this.selectItems);
	},
	/**
	 * 返回所选择的item的categoryID
	 * @return {string} 'id1,id2,id3,...,idn'
	 */
	getSelectValue: function () {
		var rtn = "";
		this.selectItems.each(function (index, key, value) {
			if (key == "companyType") {
				value = value.replace(/\,/g, "|")
			}
			if (key == "companyProperty") {
				value = value.replace(/\,/g, "|")
			}
			rtn += "&" + key + "=" + value;
			return true;
		});
		return rtn;
	}
});
