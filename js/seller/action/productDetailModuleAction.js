/**
 * Buyer Activity Action
 * Created by sam
 * Date: 13-2-22
 */
$.moduleAndViewAction('productDetailModuleId', function (productDetail) {
	productDetail.on('ON_PREVER_CLICK', function (id) {
//        page_currentItem从1开始
		productDetail.pageObj.page_currentItem--;
		if (productDetail.pageObj.page_currentItem == 0 && productDetail.pageObj.page_num > 1) {
			productDetail.pageObj.page_num--;
			productDetail.load_PageData(productDetail.pageObj.page_num);
			productDetail.pageObj.page_currentItem = productDetail.pageObj.page_pageSize;
		}
		var nId = productDetail.pageObj.page_pageIds[productDetail.pageObj.page_currentItem - 1];
		productDetail.updateTitle(productDetail.pageObj.page_titleList[productDetail.pageObj.page_currentItem - 1]);
		productDetail.loadData(Can.util.Config.seller.productDetail.loadData, {productId: nId});
//        productDetail.setStepBtn_css();
	});

	productDetail.on('ON_NEXT_CLICK', function (id) {
		//        page_currentItem从1开始
		productDetail.pageObj.page_currentItem++;
		//翻页
		if (productDetail.pageObj.page_currentItem > productDetail.pageObj.page_pageSize && productDetail.pageObj.page_num < productDetail.pageObj.page_maxPage) {
			productDetail.pageObj.page_num++;
			productDetail.load_PageData(productDetail.pageObj.page_num);
			productDetail.pageObj.page_currentItem = 1;
		}
		var nId = productDetail.pageObj.page_pageIds[productDetail.pageObj.page_currentItem - 1];
		productDetail.updateTitle(productDetail.pageObj.page_titleList[productDetail.pageObj.page_currentItem - 1]);
		productDetail.loadData(Can.util.Config.seller.productDetail.loadData, {productId: nId});
//        productDetail.setStepBtn_css();

	});

	productDetail.on('ON_BACK_CLICK', function () {
		//console.log(productDetail.returnModule)

        if('BuyerActivityModule' === productDetail.returnModule && productDetail._referer){
            return Can.Route.run(productDetail._referer);
        }

		var returnModule = Can.Application.getModule(productDetail.returnModule);
		if (returnModule) {
			returnModule.show();
		}
		else {
			var oData = Can.Route.get(productDetail.returnModule);
			if (false != oData) {
				Can.Route.run(oData.route[0]);
			}
		}
	});
});
