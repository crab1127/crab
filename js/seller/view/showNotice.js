function showNotice () {
	var showNotice = Can.util.Cache.get('showNotice315' + Can.util.userInfo().getAccount(), false);
	if (false === showNotice) {
		var winShowNotice = new Can.view.pinWindowView({
			type: 3,
			width: 650
		});
		winShowNotice.setContent([
			'<div class="alert-reward" style="height:300px;">',
			'<h2>',
			'3月15日更新公告',
			'</h2>',
			'<div class="reward">',
			'<div class="reward-title">',
			'平台搜索优化',
			'</div>',
			'<p class="p-cont">',
			'1、产品相关性，在产品搜索中，关键词检索包括标题、分类、简介、关键词等四个字段；<br/>',
			'2、在供应商搜索中，关键词检索包括公司名称、主营产品、行业、分类、发布的产品等五类信息；<br/>',
			'3、供应商等级，供应商级别（套餐价格）越高，排名相对靠前<br/>',
			'4、橱窗位，在产品搜索中，标注为橱窗产品的产品信息，当相关度匹配命中时，橱窗产品比非橱窗产品排名靠前。',
			'</p>',
			'<div class="reward-title">',
			'采购需求3.0',
			'</div>',
			'<p class="p-cont">',
			'1、报价方式应答采购需求，在回复采购需求时，供应商可以选择一个产品及根据买家的采购信息提供合适的报价，同时可上传相关附件；<br/>',
			'2、采购需求速递，将为您呈现最新最热的买家需求情况，通过分析采购需求的产品类别，数量、规格等信息，判断买家意向，并及时回复，通过审核后您将获得采购商详细信息；<br/>',
			'3、采购需求公共库，供应商会员可通过关键词、产品分类等查询方式，自由搜索合适的采购需求进行报价。<br/>',
			'</p>',
			'</div>',
			'</div>'
		].join(''));
		winShowNotice.show();

		/*var nTime = Can.util.formatDateTime((new Date).getTime(), 'YYYY-MM-DD');
		 nTime = Can.util.formatDateTime(nTime).getTime() + 3600*24*1000 - 1;

		 var nLifeTime = nTime - (new Date).getTime();*/
		Can.util.Cache.set('showNotice315' + Can.util.userInfo().getAccount(), true);
	}
}