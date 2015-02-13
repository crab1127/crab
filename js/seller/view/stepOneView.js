/**
 * 商业规则设置-----第一步
 * Created by Island Huang
 * Date: 13-1-30 上午12:45
 */
Can.view.StepOneView = Can.extend(Can.view.StepView, {
	id: 'businessRuleStepOneId',
	title: Can.msg.MODULE.BUSINESS_SET.STEP1_TITLE,
	stepNo: 1,
	initDataUrl: Can.util.Config.seller.businessSettingModule.saleCategory,
	selectItems: new Can.util.ArrayMap(),
	/**
	 * 最多可选项
	 */
	maxSelectedNo: 2,
	onData: function (items) {
		var me = this,
			categoryContainerEL = $('<ul></ul>').addClass('mod-industry clear').appendTo(this.stepContainer);
		for (var i = 0; i < items.length; i++) {
			var val = items[i];
			var itemEL = $('<li></li>').appendTo(categoryContainerEL);
			itemEL.html('<a class="mom-hy industry-s' + (val.categoryId) + '" href="javascript:;"></a>' +
				'<p>' + val.label + '</p>');
			itemEL.data('level1cat', val);
			itemEL.bind('click', function () {
				me.onItemClick($(this), $(this).data('level1cat'));
			});
		}
	},
	onItemClick: function (el, item) {
		if (el.children('a').hasClass('cur')) {
			//已经被选择，则取消选择
			el.children('a').removeClass('cur');
			this.selectItems.remove(item.categoryId);
		}
		else {
//            if(this.selectItems.size() >= this.maxSelectedNo){
//                return false;
//            }

			el.children('a').addClass('cur');
			this.selectItems.put(item.categoryId, item);
		}
		this.fireEvent('onitemselected', this.selectItems, this.maxSelectedNo);
	},
	/**
	 * 返回所选择的item的categoryID
	 * @return {Object} {industry: 'id1,id2,id3,...,idn'}
	 */
	getSelectValue: function () {
		var selectItems = this.selectItems.keySet();
		return {industry: selectItems.toString()};
	}
});
