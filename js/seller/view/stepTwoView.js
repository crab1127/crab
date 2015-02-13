/**
 * 商业规则设置-----第二步
 * Created by Island Huang
 * Date: 13-1-30 上午12:45
 */
Can.view.StepTwoView = Can.extend(Can.view.StepView, {
	id: 'businessRuleStepTwoId',
	title: Can.msg.MODULE.BUSINESS_SET.STEP2_TITLE,
	stepNo: 2,
	initDataUrl: null,
	maxSelectedNo: 40,
	selectItems: new Can.util.ArrayMap(),
	onData: function (items) {
	},
	updateData: function (items) {
		this.stepContainer.html('');
		var me = this,
			categoryContainerEL = $('<ul></ul>').addClass('mod-cat').appendTo(this.stepContainer);
		for (var i = 0; i < items.length; i++) {
			var liEL = $('<li class="clear"></li>').appendTo(categoryContainerEL);
			var level1Obj = items[i];
			var levelNameCon = $('<div class="item"></div>').appendTo(liEL);
			levelNameCon.html('<a class="mom-hy industry-s' + level1Obj.categoryId + ' cur" href="javascript:;"></a>' +
				'<p>' + level1Obj.label + '</p>');
			var level2Obj = level1Obj.items;
			var leafDiv = $('<div class="leaf-cat"></div>').appendTo(liEL);
			for (var y = 0; y < level2Obj.length; y++) {
				var item = $('<a href="javascript:;" class="bg-ico cat-chk"></a>').appendTo(leafDiv);
				item.text(level2Obj[y].label);
				item.data('item', level2Obj[y]);
				item.bind('click', function () {
					me.onItemClick($(this));
				});
			}
			$('<div class="bg-ico arrow"></div>').appendTo(leafDiv);
		}
	},
	onItemClick: function (el) {
		var item = el.data('item');
		if (el.hasClass('chked')) {
			//已经选择，则取消选择
			el.removeClass('chked');
			this.selectItems.remove(item.categoryId);
		}
		else {
			el.addClass('chked');
			this.selectItems.put(item.categoryId, item);
		}
		this.fireEvent('onitemselected', this.selectItems, this.maxSelectedNo);
	},
	/**
	 * 返回所选择的item的categoryID
	 * @return {Object} {leafcat: 'id1,id2,id3,...,idn'}
	 */
	getSelectValue: function () {
		var selectItems = this.selectItems.keySet();
		return {leafcat: selectItems.toString()};
	}
});
