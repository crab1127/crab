/**
 * 框架资源路径配置文件
 * @Author: AngusYoung
 * @Update: 13-7-30
 */

Can.util.Config = function () {
	return {
		'lang': (window.localStorage && window.localStorage.lang) || 'en',
		'app': {
			/*前端资源访问路径*/
			'CanURL': '/C/',
			/*后端接口访问路径*/
			'CfOneURL': '/cfone/'
		},
		'routeMap': [
		/**
		 * 公共模块
		 */
			{
				'route': ['/msg-center'],
				'topMenuId': 'msgBtnId',
				'module': 'msgCenterModule',
				'moduleId': 'msgCenterModuleId',
				'uri': 'js/utils/msgCenterModule.js'
			},
			{
				'route': ['/msg-center/outbok'],
				'module': 'msgCenterModule',
				'moduleId': 'msgCenterModuleId',
				'uri': 'js/utils/msgCenterModule.js'
			},
			{
				'route': ['/msg-center/trash'],
				'module': 'msgCenterModule',
				'moduleId': 'msgCenterModuleId',
				'uri': 'js/utils/msgCenterModule.js'
			},
			{
				'route': ['/contacter'],
				'topMenuId': 'customerBtnId',
				'module': 'myContacterModule',
				'moduleId': 'myContacterModuleId',
				'uri': 'js/utils/myContacterModule.js'
			},
		/**
		 * 供应商模块
		 */
			{
				'route': ['/'],
				'topMenuId': 'homeBtnId',
				'module': 'SellerIndexModule',
				'moduleId': 'sellerIndexModule',
				'uri': 'js/seller/view/sellerIndexModule.js'
			},
			//个人设置
			{
				'route': ['/setting'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			//特殊套餐的首页
			{
				'route': ['/special'],
				'module': 'expIndexModule',
				'moduleId': 'expIndexModuleId',
				'uri': 'js/seller/view/expIndexModule.js'
			},
			{
				'route': ['/match-buyer'],
				'topMenuId': 'matchBuyerBtnId',
				'module': 'matchBuyerModule',
				'moduleId': 'matchBuyerModuleId',
				'uri': 'js/seller/view/matchBuyerModule.js'
			},
			{
				'route': ['/buyer-activity', '/buyer-activity/my'],
				//'topMenuId': 'activityBtnId',
				'module': 'BuyerActivityModule',
				'moduleId': 'BuyerActivityModule',
				'uri': 'js/seller/view/buyerActivityModule.js'
			},
			{
				'route': ['/buyinglead', '/buyinglead/my', '/buyinglead/unverify'],
				//'topMenuId': 'buyingLeadBtnId',
				'module': 'BuyerLeadModule',
				'moduleId': 'buyerleadModuleId',
				'uri': 'js/seller/view/buyerleadModule.js'
			},
			{
				'route': ['/show-buyinglead'],
				'module': 'BuyingLeadDetailModule',
				'moduleId': 'buyingLeadDetailModuleId',
				'uri': 'js/seller/view/buyingLeadDetailModule.js'
			},
			{
				'route': ['/add-product'],
				'topMenuId': 'addPrdBtnId',
				'module': 'addProductModule',
				'moduleId': 'addProductModuleId',
				'uri': 'js/seller/view/addProductModule.js'
			},
			{
				'route': ['/edit-product'],
				'module': 'mdfProductModule',
				'moduleId': 'mdfProductModuleId',
				'uri': 'js/seller/view/mdfProductModule.js'
			},
			{
				'route': ['/product-manage', '/product-manage/offline'],
				//'topMenuId': 'managePrdBtnId',
				'module': 'ProductManageModule',
				'moduleId': 'ProductManageModule',
				'uri': 'js/seller/view/productManageModule.js'
			},
			{
				'route': ['/product-status'],
				'topMenuId': 'prdCountBtnId',
				'module': 'productStatusModule',
				'moduleId': 'productStatusModuleId',
				'uri': 'js/seller/view/productStatusModule.js'
			},
			{
				'route': [
					'/showroom-info',
					'/showroom-info/manufacturing',
					'/showroom-info/trading',
					'/showroom-info/product',
					'/showroom-info/template',
					'/showroom-info/domain',
				],
				//'topMenuId': 'showroomBtnId',
				'module': 'SetShowroomModule',
				'moduleId': 'sellerSetShowroomModuleId',
				'uri': 'js/seller/view/setShowroomModule.js'
			},
			{
				'route': ['/view-product', 'supplier/view-product'],
				'module': 'ProductDetailModule',
				'moduleId': 'ProductDetailModule',
				'uri': 'js/seller/view/productDetailModule.js'
			},
			{
				'route': ['/setAccount', 'supplier/setAccount'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			{
				'route': ['/personProfile', 'supplier/personProfile'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			{
				'route': ['/setPassword', 'supplier/setPassword'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			{
				'route': ['/setBusiness', 'supplier/setBusiness'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			{
				'route': ['/setStatistics', 'supplier/setStatistics'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			{
				'route': ['/setExpresss', 'supplier/setExpresss'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			{
				'route': ['/setAllAccount', 'supplier/setAllAccount'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			{
				'route': ['/setAccountInfo', 'supplier/setAccountInfo'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/seller/view/mySettingModule.js'
			},
			{
				'route': ['/statistics/car'],
				'topMenuId': 'carCountBtnId',
				'moduleId': 'statisticsModuleId',
				'module': 'statisticsModule',
				'uri': 'js/seller/view/statisticsModule.js'
			},
			{
				'route': ['/statistics/exchanger'],
				'topMenuId': 'excCountBtnId',
				'moduleId': 'statisticsModuleId',
				'module': 'statisticsModule',
				'uri': 'js/seller/view/statisticsModule.js'
			},
			{
				'route': ['/coinsdetail'],
				'moduleId': 'coinsDetailModuleId',
				'module': 'coinsDetailModule',
				'uri': 'js/seller/view/coinsDetailModule.js'
			},
		/**
		 * 采购商模块
		 */
			{
				'route': ['/personProfile'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/buyer/view/mySettingModule.js',
				'acts': ['personProfile']
			},
			{
				'route': ['/buyerBuyingLead'],
				'module': 'buyerBuyingLeadModule',
				'moduleId': 'buyerBuyingLeadModuleId',
				'uri': 'js/buyer/view/buyerBuyingLeadModule.js'
			},
			{
				'route': ['/setting', 'buyer/setting' ],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/buyer/view/mySettingModule.js'
			},
			{
				'route': ['/companyProfile', 'buyer/companyProfile' ],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/buyer/view/mySettingModule.js',
				'acts': ['setCompany']
			},
			{
				'route': ['/setBusiness', 'buyer/setBusiness'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/buyer/view/mySettingModule.js',
				'acts': ['setBusiness']
			},
			{
				'route': ['/setAccount', 'buyer/setAccount'],
				'module': 'mySettingModule',
				'moduleId': 'mySettingModuleId',
				'uri': 'js/buyer/view/mySettingModule.js',
				'acts': ['setAccount']
			},
			//搜索采购商
			{
				'route': ['/search-supplier', 'buyer/search-supplier'],
				'module': 'SupplierSearchModule',
				'moduleId': 'spSearchModuleId',
				'uri': 'js/buyer/view/searchModule.js',
				'acts': ['runByRoute']
			},
			//搜索商品
			{
				'route': ['/search-product', 'buyer/search-product'],
				'module': 'PrdSearchModule',
				'moduleId': 'prdSearchModuleId',
				'uri': 'js/buyer/view/searchModule.js',
				'acts': ['runByRoute']
			},
			{
				'route': ['/'],
				'topMenuId': 'homeBtnId',
				'module': 'buyerIndexModule',
				'moduleId': 'buyerIndexModule',
				'uri': 'js/buyer/view/buyerIndexModule.js'
			},
			{
				'route': ['/exclusive-channel'],
				'topMenuId': 'roomId',
				'module': 'myRoomModule',
				'moduleId': 'myRoomModuleId',
				'uri': 'js/buyer/view/myRoomModule.js'
			},
			{
				'route': ['/search'],
				'topMenuId': 'searchBtnId',
				'module': 'SearchModule',
				'moduleId': 'advanceSearchModuleId',
				'uri': 'js/buyer/view/searchModule.js'
			},
			{
				'route': ['/collections'],
				'topMenuId': 'oppoBtnId',
				'module': 'opportunityModule',
				'moduleId': 'OpportunityModuleId',
				'uri': 'js/buyer/view/opportunityModule.js'
			},
			{
				'route': ['/collections/sourcing-egg'],
				'topMenuId': 'oppoBtnId',
				'module': 'opportunityModule',
				'moduleId': 'OpportunityModuleId',
				'uri': 'js/buyer/view/opportunityModule.js'
			},
			{
				'route': ['/manage-buyinglead'],
				'topMenuId': 'mbuyerleadBtnId',
				'module': 'buyerLeadManageModule',
				'moduleId': 'buyerLeadManageModuleId',
				'uri': 'js/buyer/view/buyerLeadManageModule.js'
			},
			{
				'route': ['/show-buyingLead'],
				'module': 'buyerBuyingLeadModule',
				'moduleId': 'buyerBuyingLeadModuleId',
				'uri': 'js/buyer/view/buyerBuyingLeadModule.js'
			},
			{
				'route': ['/add-buyinglead'],
				'topMenuId': 'pbuyerleadBtnId',
				'module': 'postBuyerLeadModule',
				'moduleId': 'postBuyerLeadModuleID',
				'uri': 'js/buyer/view/postBuyerLeadModule.js'
			},
			{
				'route': ['/view-product', 'buyer/view-product'],
				'module': 'ProductDetailModule',
				'moduleId': 'ProductDetailModule',
				'uri': 'js/buyer/view/productDetailModule.js',
				'acts': ['runByRoute']
			}
		]
	}
}();
/**
 * 资源扩展
 */
$.extend(Can.util.Config, {
	/*静态数据*/
	'static': {
		'pointMap': Can.util.Config.app.CanURL + 'js/data/pointMap.json',
//		category': Can.util.Config.app.CfOneURL + 'js/data/category.json',
		'category': Can.util.Config.app.CfOneURL + 'productcategory/getAllTrees.cf',
		/*logo image*/
		'logoImage': Can.util.Config.app.CanURL + 'img/logo.png',
		'defaultImage': {
			'blank': Can.util.Config.app.CanURL + 'css/common/bgimg/blank_90x90.png',
			'system': Can.util.Config.app.CanURL + 'img/system_headpic.png',
			'video': Can.util.Config.app.CanURL + 'css/common/bgimg/default_video_upload.png'
		}
	},
	/*切换语言*/
	'changeLang': Can.util.Config.app.CfOneURL + 'user/changeLocale.cf',
	/*上传组件*/
	'uploader': {
		'flvPlayer': Can.util.Config.app.CanURL + 'js/plugin/flv.swf',
		'swf': Can.util.Config.app.CanURL + 'js/plugin/uploadify/uploadify.swf',
		//server': Can.util.Config.app.CanURL + 'js/plugin/uploadify/uploadify.php'
		'server': Can.util.Config.app.CfOneURL + 'fdfsupload/uploadSingleFile.cf',
		//server': Can.util.Config.app.CfOneURL + 'uploadservice/uploadSingleFile.cf'
		'imageLocalFileServer': Can.util.Config.app.CfOneURL + 'fdfsupload/uploadLocalImage.cf'
	},
	'getPushPrice': Can.util.Config.app.CfOneURL + 'supmatchbuyers/getPushPrice.cf',
	/*当前账户信息*/
//	'accountInfo': Can.util.Config.app.CanURL + 'js/data/accountInfo.json',
	'accountInfo': Can.util.Config.app.CfOneURL + 'user/getUserInfo.cf',
	/*登录检测*/
	'login': Can.util.Config.app.CfOneURL + 'j_spring_security_check',
	/*退出登录*/
	'logout': Can.util.Config.app.CfOneURL + 'j_spring_security_logout',
	/*行为记录*/
	'actionLog': {
		'seeContact': Can.util.Config.app.CanURL + 'js/data/postComplete.json'
	},
	/*收发邮件窗口*/
	'email': {
//		sendEmail': Can.util.Config.app.CanURL + 'js/data/postComplete.json',
		'sendEmail': Can.util.Config.app.CfOneURL + 'message/saveMessage.cf',
//		deleteEmail': Can.util.Config.app.CanURL + 'js/data/postComplete.json',
		'deleteEmail': Can.util.Config.app.CfOneURL + 'message/moveToSpam.cf',
		'wipeEmail': Can.util.Config.app.CfOneURL + 'message/removeMsgs.cf',
		'restoreEmail': Can.util.Config.app.CfOneURL + 'message/restoreMsgs.cf',
//		readEmail': Can.util.Config.app.CanURL + 'js/data/readEmail.json',
		'readEmail': Can.util.Config.app.CfOneURL + 'message/getMsgDetailById.cf',
		'readList': Can.util.Config.app.CfOneURL + 'message/getMsgDetailList.cf',
		'readInbox': Can.util.Config.app.CfOneURL + 'message/getInbox.cf',
		'readOutbox': Can.util.Config.app.CfOneURL + 'message/getOutbox.cf'
	},
	/*联系人选择组件*/
	'selectContacter': {
//		loadData': Can.util.Config.app.CanURL + 'js/data/loadContactData.json',
		'loadData': Can.util.Config.app.CfOneURL + 'customer/getCustomerList.cf',
//		loadGroup': Can.util.Config.app.CanURL + 'js/data/loadContactGroup.json'
		'loadGroup': Can.util.Config.app.CfOneURL + 'customergroup/loadCustomerGroup.cf'
	},
	/*分类选择器*/
	'cateSelector': {
//		searchCategory': Can.util.Config.app.CanURL + 'js/data/searchCate.json',
		'searchCategory': Can.util.Config.app.CfOneURL + 'productcategory/searchTree.cf',
		'autoComplete': Can.util.Config.app.CanURL + 'js/data/testAutocomplete.json'
	},
	'favorite': {
		'mark': Can.util.Config.app.CfOneURL + 'collect/addCollect.cf',
		'tag': Can.util.Config.app.CfOneURL + 'collecttags/addCollectTags.cf'
	},
	'contacts': {
//		list': Can.util.Config.app.CanURL + 'js/data/manageProduct_menu.json',
		'list': Can.util.Config.app.CfOneURL + 'customer/getCustomerList.cf',
		'group': {
			'list': Can.util.Config.app.CfOneURL + 'customergroup/loadCustomerGroup.cf',
			'validation': Can.util.Config.app.CfOneURL + 'customergroup/validationCustomerGroup.cf',
			'add': Can.util.Config.app.CfOneURL + 'customergroup/addCustomerGroup.cf',
			'edit': Can.util.Config.app.CfOneURL + 'customergroup/editCustomerGroup.cf',
			'remove': Can.util.Config.app.CfOneURL + 'customergroup/removeCustomerGroup.cf'
		},
		/*添加为联系人*/
//		addToContact': Can.util.Config.app.CanURL + 'js/data/saveData.json'
		'addToContact': Can.util.Config.app.CfOneURL + 'customer/addCustomer.cf',
		'credit': Can.util.Config.app.CfOneURL + 'creditrating/creditRatingDetail.cf',
		/*公开信息*/
		'publicInfo': Can.util.Config.app.CfOneURL + 'customer/isOpenInfo.cf'
	},
	'selectOptions': {
		'businessNature': Can.util.Config.app.CfOneURL + 'searchoppotunities/getCompanyType.cf'
	},
	'panorama': {
		'index': Can.util.Config.app.CfOneURL + 'panorama/detail.cf?companyId='
	},
	'seller': {
		/*登录弹窗*/
		'loginPop': {
			'forgotPWD': '/cfone/user/applyUpdatePassword.cf',
			'signUp': '/joinfree/index.html?tab=3'
		},
		/*外贸服务*/
		'services': {
			'zhongXB': Can.util.Config.app.CfOneURL + 'insurance/index.cf',
			'zhongYTB': Can.util.Config.app.CfOneURL + 'financing/index.cf',
			'cardPay': Can.util.Config.app.CfOneURL + 'paymentverification/userVerification.cf'
		},
		/*供应商展台访问地址*/
		'showroom': {
			'rootURL': Can.util.Config.app.CfOneURL + 'showroom/index.cf?companyId=',
			'rootURL_RE': '/china-supplier/',
			'productURL': Can.util.Config.app.CfOneURL + 'showroom/product.cf?productId='
		},
		/*提交推达信息*/
//		pushInfo': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json',
		'pushInfo': Can.util.Config.app.CfOneURL + 'supmatchbuyers/pushInfo.cf',
		/*采购需求*/
		'buyerleadModule': {
			'buyingLeadCondition': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierBuyingLeadCondition.cf',
			'pushBuyingLeads': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierPushBuyingLeads.cf',
			'myBuyingLeads': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierMyBuyingLeads.cf',
			'unverifyBuyingLeads': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierUnverifyBuyingLeads.cf',
			'favorBuyingLead': Can.util.Config.app.CfOneURL + 'buyinglead/favorBuyingLead.cf',

			'autoCompleteTest': Can.util.Config.app.CanURL + 'js/data/testAutocomplete.json',
//			allbuyerlead': Can.util.Config.app.CanURL + 'js/data/allRecommandBuyerlead.json',
			'allbuyerlead': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierPushBuyingLead.cf',
			'buyerleadDetail': Can.util.Config.app.CanURL + 'js/data/buyerleadDetail.json',
//			mybuyerlead': Can.util.Config.app.CanURL + 'js/data/myBuyerlead.json',
			'mybuyerlead': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierBuyingLead.cf',
//			searchItem': Can.util.Config.app.CanURL + 'js/data/buyerlead_searchItem.json',
			'searchItem': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierPushBuyingLeadCondition.cf',
//			searchMyItem': Can.util.Config.app.CanURL + 'js/data/buyerlead_my_searchItem.json'
			'searchMyItem': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierBuyingLeadCondition.cf',
			'updatePushInfoRead': Can.util.Config.app.CfOneURL + 'buyinglead/updatePushInfoRead.cf'
		},
		/*采购需求详情*/
		'buyerleadDetailModule': {
//			buyerleadReply': Can.util.Config.app.CanURL + 'js/data/buyerleadReply_detail.html',
//			'buyerleadReply': Can.util.Config.app.CfOneURL + 'buyinglead/findSupplierBuyingLeadDetail.cf',
			'supplierDetail': Can.util.Config.app.CfOneURL + 'buyinglead/findBuyingLeadDetailBySupplier.cf',
			'supplierDetailOut': Can.util.Config.app.CfOneURL + 'outerbuyinglead/findBuyingLeadByOuter.cf',
			'buyerDetailIn': Can.util.Config.app.CfOneURL + 'buyinglead/findBuyingLeadDetailByBuyer.cf',
			'buyerDetailOut': Can.util.Config.app.CfOneURL + 'outerbuyinglead/findBuyingLeadDetailByOuter.cf',
			'purchaseBuyerContactInfo': Can.util.Config.app.CfOneURL + 'buyinglead/purchaseBuyerContactInfo.cf',

			'contact': Can.util.Config.app.CfOneURL + 'buyinglead/saveBuyingReply.cf'
		},
		/*采购商动态*/
		'activityModule': {
			//'allactivity': Can.util.Config.app.CanURL + 'js/data/allactivitylist.json',
			'allactivity': Can.util.Config.app.CfOneURL + 'buyeractivitylog/getBuyerActivityLog.cf',
			//'searchParam': Can.util.Config.app.CanURL + 'js/data/buyer-activity-tool.json'
			'searchParam': Can.util.Config.app.CfOneURL + 'buyeractivitylog/getSearchParam.cf'
		},
		/*匹配采购商*/
		'matchBuyerModule': {
//			searchCond': Can.util.Config.app.CanURL + 'js/data/matchBuyerSearchCond.json',
			'searchCond': Can.util.Config.app.CfOneURL + 'buyer/supplierPushBuyerCondition.cf',
//			'matchBuyer': Can.util.Config.app.CanURL + 'js/data/matchBuyer.json',
			'matchBuyer': Can.util.Config.app.CfOneURL + 'buyer/supplierPushBuyer.cf',
			'buyerLastAct': Can.util.Config.app.CfOneURL + 'buyeractivitylog/getMatchBuyerLastestActivity.cf',
//			'matchDetail': Can.util.Config.app.CanURL + 'js/data/matchDetail.json'
			'matchDetail': Can.util.Config.app.CfOneURL + 'buyerdetail/viewMatch.cf'
		},
		/*客户管理*/
		'myContacterModule': {
//			selectjson': Can.util.Config.app.CanURL + 'js/data/contacterSearch.json',
//			mycontacter': Can.util.Config.app.CanURL + 'js/data/sellerContacter.json',
			'mycontacter': Can.util.Config.app.CfOneURL + 'customer/getCustomerList.cf',
//			newGroup': Can.util.Config.app.CanURL + 'js/data/newGroup.json',
			'newGroup': Can.util.Config.app.CfOneURL + 'customergroup/addCustomerGroup.cf',
//			CHECK_GROUP_NAME': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json',
			'CHECK_GROUP_NAME': Can.util.Config.app.CfOneURL + 'customergroup/addCustomerGroup.cf',
			//MENUDATA': Can.util.Config.app.CanURL + 'js/data/mycontact_menu.json',
			'MENUDATA': Can.util.Config.app.CfOneURL + 'customergroup/loadCustomerGroup.cf',
//			delete_contacter': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json',
			'delete_contacter': Can.util.Config.app.CfOneURL + 'customer/batchDeleteCustomer.cf',
//			set_group': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json'
			'set_group': Can.util.Config.app.CfOneURL + 'customer/batchCustomerGroup.cf'
		},
		/*首页*/
		'indexModule': {
//			activeMap': Can.util.Config.app.CanURL + 'js/data/allActiveMap.json',
			'activeMap': Can.util.Config.app.CfOneURL + 'buyeractivitylog/findBuyerActivityStatistics.cf',
//			activeList': Can.util.Config.app.CanURL + 'js/data/allactivitylist.json',
			'activeList': Can.util.Config.app.CfOneURL + 'buyeractivitylog/findBuyerActivityLog.cf',
//			userInfo': Can.util.Config.app.CanURL + 'js/data/userInfo.json',
			'userInfo': Can.util.Config.app.CfOneURL + 'supplier/supplierHomeInfo.cf',
//			interest': Can.util.Config.app.CanURL + 'js/data/interest.json',
			'interest': Can.util.Config.app.CfOneURL + 'buyer/homeSupplierPush.cf',
			'search_keyword': Can.util.Config.app.CanURL + 'js/data/testAutocomplete.json'
		},
		/*设置商业规则*/
		'businessSettingModule': {
//			saleCategory': Can.util.Config.app.CanURL + 'js/data/salecategory.json',
			'saleCategory': Can.util.Config.app.CfOneURL + 'supbizrule/findIndusCategory.cf',
//			secondcategory': Can.util.Config.app.CanURL + 'js/data/secondecategory.json',
			'secondcategory': Can.util.Config.app.CfOneURL + 'supbizrule/findProductCategory.cf',
			'saletradeares': Can.util.Config.app.CanURL + 'js/data/saletradeareas.json',
			'questionnaire': Can.util.Config.app.CanURL + 'js/data/questionnaire.json',
//			SUBMIT_ALL_DATA': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json'
			'SUBMIT_ALL_DATA': Can.util.Config.app.CfOneURL + 'supbizrule/saveBizRule.cf'
		},
		/*产品选择组件*/
		'selectPro': {
//			loadData': Can.util.Config.app.CanURL + 'js/data/loadProData.json'
			'loadData': Can.util.Config.app.CfOneURL + 'supproduct/productList.cf'
		},
		/*产品详细页*/
		'productDetail': {
//			datajson': Can.util.Config.app.CanURL + 'js/data/productDetail.json',
			'loadData': Can.util.Config.app.CfOneURL + 'product/viewProduct.cf',
			'ADDTAGS': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json'
		},
		/*添加产品*/
		'addProduct': {
//			MODIFY': Can.util.Config.app.CanURL + 'js/data/productData.json',
			'MODIFY': Can.util.Config.app.CfOneURL + 'supproduct/createSupProduct.cf',
//			UNIT': Can.util.Config.app.CanURL + 'js/data/productData.json',
			'UNIT': Can.util.Config.app.CfOneURL + 'supproduct/productForm.cf',
//			ADD': Can.util.Config.app.CanURL + 'js/data/productData.json',
			'valideSensitiveWord': Can.util.Config.app.CfOneURL + 'supproduct/valideSensitiveWord.cf',
			'ADD': Can.util.Config.app.CfOneURL + 'supproduct/createSupProduct.cf',
			'CHECK_GROUP_NAME': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json',
//			newGroup': Can.util.Config.app.CanURL + 'js/data/newGroup.json'
			'newGroup': Can.util.Config.app.CfOneURL + 'supproductgroup/createProductGroup.cf'
		},
		/*产品管理*/
		'manageProduct': {
//			MODIFY': Can.util.Config.app.CanURL + 'js/data/productData.json',
			'MODIFY': Can.util.Config.app.CfOneURL + 'supproduct/productForm.cf',
			'ADD': Can.util.Config.app.CfOneURL + 'supproduct/createSupProduct.cf',
//			datajson': Can.util.Config.app.CanURL + 'js/data/manageProduct.json',
			'productList': Can.util.Config.app.CfOneURL + 'supproduct/productList.cf',
//			selectjson': Can.util.Config.app.CanURL + 'js/data/manageProduct_select.json',
//			groupData': Can.util.Config.app.CanURL + 'js/data/manageProduct_menu.json',
			'groupData': Can.util.Config.app.CfOneURL + 'supproductgroup/findGroups.cf',
//			createGroup': Can.util.Config.app.CanURL + 'js/data/newGroup.json',
			'createGroup': Can.util.Config.app.CfOneURL + 'supproductgroup/createProductGroup.cf',
//			markNew': Can.util.Config.app.CanURL + 'js/data/markNew.json',
			'markNew': Can.util.Config.app.CfOneURL + 'supproduct/settingNewest.cf',
//			deleteProduct': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json',
			'deleteProduct': Can.util.Config.app.CfOneURL + 'supproduct/settingStatus.cf',
//			itemSetGroup': Can.util.Config.app.CanURL + 'js/data/itemSetGroup.json',
			'itemSetGroup': Can.util.Config.app.CfOneURL + 'supproduct/settingGroup.cf',
//			deleteGroup': Can.util.Config.app.CanURL + 'js/data/deleteProductGroup.json',
			'deleteGroup': Can.util.Config.app.CfOneURL + 'supproductgroup/deleteGroup.cf',
//			updateGroup': Can.util.Config.app.CanURL + 'js/data/updateProductGroup.json',
			'updateGroup': Can.util.Config.app.CfOneURL + 'supproductgroup/updateGroups.cf',
//			CREATE_MENU': Can.util.Config.app.CanURL + 'js/data/manageProduct_menu.json',
			'batchUpdateGroup': Can.util.Config.app.CfOneURL + 'supproductgroup/batchUpdateGroupSortAndName.cf',
			'CREATE_MENU': Can.util.Config.app.CfOneURL + 'supproductgroup/createProductGroup.cf',
			'CHECK_GROUP_NAME': Can.util.Config.app.CanURL + 'js/data/deletePruduct.json',
			'groupUpdateSore': Can.util.Config.app.CfOneURL + 'supproductgroup/updateSort.cf',
			'newGroup': Can.util.Config.app.CfOneURL + 'supproductgroup/createProductGroup.cf',
			//标记、取消橱窗产品
			'UPDATE_SHOWCASE': Can.util.Config.app.CfOneURL + 'supproduct/updateShowCase.cf',
			//取可设置的橱窗产品数据
			'GET_SHOWCASE_COUNT': Can.util.Config.app.CfOneURL + 'supproduct/queryMaxShowCase.cf',
			//设置上下线
			'UPDATE_LINE': Can.util.Config.app.CfOneURL + 'supproduct/settingOnLine.cf'
		},
		/*采购商个人资料窗口*/
		'profileWindow': {
//			'buyerProfile': Can.util.Config.app.CanURL + 'js/data/buyerProfile.json',
			'buyerProfile': Can.util.Config.app.CfOneURL + 'buyerdetail/viewBuyerDetail.cf',
//			singleBuyerActivity': Can.util.Config.app.CanURL + 'js/data/activityList.json',
			'singleBuyerActivity': Can.util.Config.app.CfOneURL + 'buyeractivitylog/findBuyerActivityLogByBuyerId.cf',
//			sendApply': Can.util.Config.app.CanURL + 'js/data/saveData.json',
			'sendApply': Can.util.Config.app.CfOneURL + 'message/saveMessage.cf',
//			saveFollow': Can.util.Config.app.CanURL + 'js/data/saveData.json'
			'saveFollow': Can.util.Config.app.CfOneURL + 'buyercust/saveFollow.cf',
			'webCantonBuyer': Can.util.Config.app.CfOneURL + 'userother/userOtherInfo.cf',
//			'getSku': Can.util.Config.app.CanURL + 'js/data/getSku.json'
			'getSku': Can.util.Config.app.CfOneURL + 'buyeractivitylog/getBuyerSkuActivity.cf'
		},
		/*产品统计*/
		'productStatus': {
//			status': Can.util.Config.app.CanURL + 'js/data/productStatus.json'
			'status': Can.util.Config.app.CfOneURL + 'supproductcount/countProductPv.cf'
		},
		/*消息中心*/
		'messageCenter': {
//			'inboxItem': Can.util.Config.app.CanURL + 'js/data/inboxItem.json',
			'inboxItem': Can.util.Config.app.CfOneURL + 'message/getInbox.cf',
//			'outboxItem': Can.util.Config.app.CanURL + 'js/data/inboxItem.json',
			'outboxItem': Can.util.Config.app.CfOneURL + 'message/getOutbox.cf',
//			'spamItem': Can.util.Config.app.CanURL + 'js/data/spamItem.json',
			'spamItem': Can.util.Config.app.CfOneURL + 'message/getTrashbox.cf',
//			'unreadMsgNum': Can.util.Config.app.CanURL + 'js/data/noReadMsgNum.json',
			'unreadMsgNum': Can.util.Config.app.CfOneURL + 'message/msgUnreadNum.cf',
			'recentUnreadMsg': Can.util.Config.app.CfOneURL + 'message/messageBox.cf'
		},
		/*展台设置*/
		'setShowroomModule': {
			'compInfoTemplate': Can.util.Config.app.CanURL + 'js/seller/view/showroomhtml_cominfo.html',
			'proInfoTemplate': Can.util.Config.app.CanURL + 'js/seller/view/showroomhtml_prdinfo.html',
			'trdInfoTemplate': Can.util.Config.app.CanURL + 'js/seller/view/showroomhtml_trade.html',
			'loadcompanyInfo': Can.util.Config.app.CanURL + 'js/data/companyInfo.json',
			'setShowroomI': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            setShowroomI:Can.util.Config.app.CanURL + 'js/data/setShowroomData.json',
			'saveCompanyInfo': Can.util.Config.app.CfOneURL + 'supshowroom/saveCompanyInfo.cf',
			'saveCompanyPrdInfo': Can.util.Config.app.CfOneURL + 'supshowroom/saveProductionInfo.cf',
			'saveTradeClause': Can.util.Config.app.CfOneURL + 'supshowroom/saveTradeClause.cf',
//            saveCompanyInfo:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json',
//            loadprdinfo': Can.util.Config.app.CanURL + 'js/data/showroomPrdInfo.json',
			'loadprdinfo': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            loadtradeInfo:Can.util.Config.app.CanURL + 'js/data/setShowroomData.json',
			'loadtradeInfo': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            getSaleInfoListForSetShowroom:Can.util.Config.app.CanURL + 'js/data/setShowroomData.json',
			'getSaleInfoListForSetShowroom': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            removeSaleInfo:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json',
			'removeSaleInfo': Can.util.Config.app.CfOneURL + 'supshowroom/removeSalesInfo.cf',
//            saveSaleInfo:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json',
			'saveSaleInfo': Can.util.Config.app.CfOneURL + 'supshowroom/saveSalesInfo.cf',
//            saveOrUpdateSaleInfo:Can.util.Config.app.CanURL + 'js/data/setShowroomData.json',
			'saveOrUpdateSaleInfo': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            loadAreasSaleInfo:Can.util.Config.app.CanURL + 'js/data/setShowroomData.json',
			'loadAreasSaleInfo': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            removeAreaSaleInfo:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json',
			'removeAreaSaleInfo': Can.util.Config.app.CfOneURL + 'supshowroom/removeExportSales.cf',
//            getMainSaleAreas:Can.util.Config.app.CanURL + 'js/data/saletradeareas.json',
			'getMainSaleAreas': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            saveAreasExportSaleInfo:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json',
			'saveAreasExportSaleInfo': Can.util.Config.app.CfOneURL + 'supshowroom/saveExportSales.cf',
//            loadAreasSaleInfoNoData:Can.util.Config.app.CanURL + 'js/data/setShowroomAreasSaleInfoNoData.json',
			'setShowroomGetLatestPrdsInfo': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
			'getNewProductInfo': Can.util.Config.app.CfOneURL + 'supshowroom/listNewProducts.cf',
//            setShowroomGetLatestPrdsInfo:Can.util.Config.app.CanURL + 'js/data/setShowroomData.json',
			'setShowroomCorePrdList': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            setShowroomCorePrdList:Can.util.Config.app.CanURL + 'js/data/setShowroomData.json',
//            removeCoreSalePrd:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json',
			'removeCoreSalePrd': Can.util.Config.app.CfOneURL + 'supshowroom/removeMainSales.cf',
//            saveCoreSalePrd:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json',
			'saveCoreSalePrd': Can.util.Config.app.CfOneURL + 'supshowroom/saveMainSales.cf',
//            setShowroomHotPrdList:Can.util.Config.app.CanURL + 'js/data/setShowroomData.json',
			'setShowroomHotPrdList': Can.util.Config.app.CfOneURL + 'supshowroom/getShowroomInfo.cf',
//            removeHotPrd:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json',
			'removeHotPrd': Can.util.Config.app.CfOneURL + 'supshowroom/removeHotSales.cf',
//            saveHotPrd:Can.util.Config.app.CanURL + 'js/data/saveCompanyInfo.json'
			'saveHotPrd': Can.util.Config.app.CfOneURL + 'supshowroom/saveHotSales.cf',
			'pullOffNewPrd': Can.util.Config.app.CfOneURL + 'supproduct/settingNewest.cf',
//            pullOffNewPrd:Can.util.Config.app.CanURL +'js/data/deletePruduct.json'
			'setNewProduct': Can.util.Config.app.CfOneURL + 'supproduct/settingNewest.cf',
			//获取展台域名- 嘉林 - 高产：龙旺
            'GET_SHOWROOM_DOMAIN': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/findShowRoomDomain.cf',

            //判断域名是否已经被使用了- 嘉林 - 高产：龙旺
            'EXIST_SHOWROOM_DOMAIN': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/existShowRoomDomain.cf',

            'SET_SHOWROOM_DOMAIN': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/saveShowRoomDomain.cf',

            //获取展台设置的接口 - 嘉林 - 高产：龙旺
            'GET_SHOWROOM_MODELS': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/findShowRoomModules.cf',

            //恢復展台店招設置的接口 -甘國威
            'RECOVER_SHOWROOM_BG': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/recoverBaseModule.cf',

            //2	设置展台模块是否显示的接口 - 嘉林 - 高产：龙旺
            'SET_SHOWROOM_MODELS': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/updateModuleDisplay.cf',

            //设置展台店招的接口 - 嘉林 - 高产：龙旺
            'SET_SHOWROOM_BG': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/saveBaseModule.cf',
            //获取主营产品设置 - 嘉林 - 高产：龙旺
            'GET_SHOWROOM_MP': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/findMpModuleInfo.cf',

            //保存主营产品设置 - 嘉林 - 高产：龙旺
            'SET_SHOWROOM_MP': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/saveMpModuleInfo.cf',
            
            //获取通栏大图的设置 - 嘉林 - 高产：龙旺
            'GET_SHOWROOM_BIMG': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/findBannerModuleInfo.cf',

            //保存通栏大图的设置 - 嘉林 - 高产：龙旺
            'SET_SHOWROOM_BIMG': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/updateBannerModuleInfo.cf',

            //展位信息设置—届数接口 - 嘉林 - 高产：龙旺
            'FIND_ALL_FAIR_NUM': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/findAllFairNum.cf',

            //展位信息设置—查看某一届展位 - 嘉林 - 高产：龙旺
            'FIND_FAIR_BOOTH': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/findFairBooth.cf',

            //展位信息设置—保存展位号 - 嘉林 - 高产：龙旺
            'SAVE_FAIR_BOOTH': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/saveFairBoothNum.cf',

            //展位信息设置—删除展位号 - 嘉林 - 高产：龙旺
            'DELETE_FAIR_BOOTHNUM': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/deleteFairBoothNum.cf',

            //展位信息设置—保存展位照片 - 嘉林 - 高产：龙旺
            'SAVE_FAIR_BOOTHPHOTO': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/saveFairBoothPhoto.cf',

            //展位信息设置—保存展位照片 - 嘉林 - 高产：龙旺
            'DELETE_FAIR_BOOTH': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/deleteFairBooth.cf',

            //保存橱窗产品 - 嘉林 - 高产：龙旺
            'SAVE_CASE_PRODUCT': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/saveCaseProductModule.cf',

            //发布展台设置 - 嘉林 - 高产：龙旺
            'RELEASE_SHROWROOM_SETTING': Can.util.Config.app.CfOneURL + 'suppliershowroomsetting/releaseShowroomSetting.cf'

		},
		/*我的设置*/
		'mySetting': {
			'delMainKeyword': Can.util.Config.app.CfOneURL + 'suppliersetting/delMainKeyword.cf',
			'addMainKeyword': Can.util.Config.app.CfOneURL + 'suppliersetting/addMainKeyword.cf',
			'findAccount': Can.util.Config.app.CfOneURL + 'suppliersetting/findSupplierAccount.cf',
			'setAccount': Can.util.Config.app.CfOneURL + 'suppliersetting/saveAccount.cf',
			'findBizCityDistricts': Can.util.Config.app.CfOneURL + 'staticdata/findBizCityDistricts.cf',
			'findPersonProfile': Can.util.Config.app.CfOneURL + 'suppliersetting/findSupplierPersonProfile.cf',
			'personProfile': Can.util.Config.app.CfOneURL + 'suppliersetting/saveProfile.cf',
			'setPassword': Can.util.Config.app.CfOneURL + 'suppliersetting/savePassword.cf',
			'findBusiness': Can.util.Config.app.CfOneURL + 'suppliersetting/findSupplierPreference.cf',
			'setBusiness': Can.util.Config.app.CfOneURL + 'suppliersetting/saveBusiness.cf',
			'findPushStatus': Can.util.Config.app.CfOneURL + 'suppliersetting/findSupplierStatistics.cf',
			'findExpressPackage': Can.util.Config.app.CfOneURL + 'supplierbizexpress/bizExpressPackageInfo.cf',
			'findExpressList': Can.util.Config.app.CfOneURL + 'supplierbizexpress/bizExpressList.cf',
			'findExpressListDetail': Can.util.Config.app.CfOneURL + 'supplierbizexpress/bizExpressListDetail.cf',
			'checkPassword': Can.util.Config.app.CfOneURL + 'suppliersetting/checkPassword.cf',
			'findAllAccount': Can.util.Config.app.CfOneURL + 'supplieraccount/findAllAccount.cf',
			'delSubAccount' : Can.util.Config.app.CfOneURL + 'supplieraccount/delSubAccount.cf',
			'setSubAccount' : Can.util.Config.app.CfOneURL + 'supplieraccount/setSubAccount.cf',
			'findAccountInfo' : Can.util.Config.app.CfOneURL + 'supplieraccount/findAccountInfo.cf',
			'checkUserAccountOrEmail' : Can.util.Config.app.CfOneURL + 'supplieraccount/checkUserAccountOrEmail.cf',
			'updateOrAddSubAccount' : Can.util.Config.app.CfOneURL + 'supplieraccount/updateOrAddSubAccount.cf'
		},
		'CONTACT': {
			'VALIDATE_GROUP': Can.util.Config.app.CanURL + 'js/data/validate_contact_group.json'
		},
		'coin': Can.util.Config.app.CfOneURL + 'supmatchbuyers/getRemainPrice.cf',
		'express': {
			'expressInfo': Can.util.Config.app.CfOneURL + 'suppliercfexpress/getExpressInfo.cf',
			'hotBl': Can.util.Config.app.CfOneURL + 'buyinglead/findHotBuyingLeads.cf',
			// 统计分析
			'car': Can.util.Config.app.CfOneURL + 'suppliercfexpress/getDirectTrainCountList.cf',
			'exchanger': Can.util.Config.app.CfOneURL + 'suppliercfexpress/getCollectorSwipeBuyerCount.cf',
			'carRead': Can.util.Config.app.CfOneURL + 'suppliercfexpress/getReadBuyerDirectTrainCountPageList.cf',
			'exchangerPush': Can.util.Config.app.CfOneURL + 'suppliercfexpress/getBuyerJoinCount.cf',
			'getStartTime': Can.util.Config.app.CfOneURL + 'suppliercfexpress/getCfPackageEffectiveTime.cf'
		},
		/*C币详细*/
		'coinsDetail': Can.util.Config.app.CfOneURL + '/supvirtualmoney/supVirtualMoneyHistoryList.cf'
	},
	'buyer': {
		/*登录弹窗*/
		'loginPop': {
			'forgotPWD': '/cfone/user/applyUpdatePassword.cf',
			'signUp': '/joinfree/index.html?tab=1'
		},
		/*采购偏好设置*/
		'preference': {
//			formData': Can.util.Config.app.CanURL + 'js/data/preferStep2.json',
			'formData': Can.util.Config.app.CfOneURL + 'businesssetting/initBusinessSetting.cf',
//			saveData': Can.util.Config.app.CanURL + 'js/data/saveData.json'
			'saveData': Can.util.Config.app.CfOneURL + 'businesssetting/saveBusinessSetting.cf'
		},
		/*首页*/
		'indexModule': {
//			userInfo': Can.util.Config.app.CanURL + 'js/data/userInfo.json',
			'userInfo': Can.util.Config.app.CfOneURL + 'buyerhome/getHomeBaseInfo.cf',
//			pushProduct': Can.util.Config.app.CanURL + 'js/data/pushPro.json',
			'pushProduct': Can.util.Config.app.CfOneURL + 'secretwindow/getPushInfo.cf',
//			remmProduct': Can.util.Config.app.CanURL + 'js/data/remmPro.json'
			'remmProduct': Can.util.Config.app.CfOneURL + 'buyerhome/getHomeRecommendProducts.cf',
			'markPushInfo': Can.util.Config.app.CfOneURL + 'supmatchbuyers/updatePushInfoRead.cf'
		},
		/*待处理商机*/
		'opportunity': {
//			opportunity_itmes': Can.util.Config.app.CanURL + 'js/data/opportunity.json',
			'opportunity_itmes': Can.util.Config.app.CfOneURL + 'opportunity/getBizOpportunities.cf',
			'live': Can.util.Config.app.CanURL + 'js/data/opportunity.json',
			'delOpportunity': Can.util.Config.app.CfOneURL + 'opportunity/deleteBizOpportunities.cf',
//			opportunityScreen': Can.util.Config.app.CanURL + 'js/data/opportunityScreen.json'
			'opportunityScreen': Can.util.Config.app.CfOneURL + 'opportunity/condition.cf',
			'getbizOpportunities': Can.util.Config.app.CfOneURL + 'buyeractivitylogtemp/getbizOpportunities.cf'
		},
		/*搜索*/
		'searchModule': {
//			getSearchItem': Can.util.Config.app.CanURL + 'js/data/getSearchItem.json',
			'getSearchItem': Can.util.Config.app.CfOneURL + 'searchoppotunities/getCategorys.cf',
			'getPrdSearchCate': Can.util.Config.app.CanURL + 'js/data/getSearchCate.json',
			'getSuppliesSearchCate': Can.util.Config.app.CanURL + 'js/data/getSearchCate.json',
//			relatedProduct': Can.util.Config.app.CanURL + 'js/data/relatedProduct.json',
			'relatedProduct': Can.util.Config.app.CfOneURL + 'buyersupsearch/getRecommendProducts.cf',
//			dosearchsupplies': Can.util.Config.app.CanURL + 'js/data/dosearchsupplies.json',
			'candidateWord': Can.util.Config.app.CfOneURL + 'searchsuggestion/searchByPrefixAndType.cf',
			'dosearchsupplies': Can.util.Config.app.CfOneURL + 'searchsuppliercomp/getCompany.cf',
//			dosearchproduct': Can.util.Config.app.CanURL + 'js/data/searchproductresult.json'
			// 'dosearchproduct': Can.util.Config.app.CfOneURL + 'searchoppotunities/getProducts.cf'
			'dosearchproduct': Can.util.Config.app.CfOneURL + 'searchsupplierprod/getProducts.cf'
		},
		/*私密橱窗*/
		'myroomModule': {
//			detail_items': Can.util.Config.app.CanURL + 'js/data/myroomDetail.json'
			'detailItems': Can.util.Config.app.CfOneURL + 'secretwindow/search.cf'
		},
		/*采购需求管理*/
		'blManageModule': {
//			approvedData': Can.util.Config.app.CanURL + 'js/data/blManageData.json',
			'approvedData': Can.util.Config.app.CfOneURL + 'buyinglead/getAuditBuyingLeads.cf',
//			auditingData': Can.util.Config.app.CanURL + 'js/data/blManageData.json',
			'auditingData': Can.util.Config.app.CfOneURL + 'buyinglead/getAuditingBuyingLeads.cf',
//			unapprovedData': Can.util.Config.app.CanURL + 'js/data/blManageData.json',
			'unapprovedData': Can.util.Config.app.CfOneURL + 'buyinglead/getUnAuditBuyingLeads.cf',
//			expiredData': Can.util.Config.app.CanURL + 'js/data/blManageData.json',
			'expiredData': Can.util.Config.app.CfOneURL + 'buyinglead/getExpiredBuyingLeads.cf',
//			offlineData': Can.util.Config.app.CanURL + 'js/data/blManageData.json',
			'offlineData': Can.util.Config.app.CfOneURL + 'buyinglead/getOfflineBuyingLeads.cf',
//			deleteBl': Can.util.Config.app.CanURL + 'js/data/saveData.json',
			'deleteBl': Can.util.Config.app.CfOneURL + '/buyinglead/deleteBuyingLead.cf',
//			onlineBl': Can.util.Config.app.CanURL + 'js/data/saveData.json',
			'onlineBl': Can.util.Config.app.CfOneURL + '/buyinglead/setBuyingLeadOnline.cf',
//			offlineBl': Can.util.Config.app.CanURL + 'js/data/saveData.json',
			'offlineBl': Can.util.Config.app.CfOneURL + '/buyinglead/setBuyingLeadOffline.cf',
//			detail': Can.util.Config.app.CanURL + 'js/data/saveData.json',
			'detail': Can.util.Config.app.CfOneURL + 'buyinglead/postBuyingLead.cf',
			'findContact': Can.util.Config.app.CfOneURL + 'buyersetting/findBuyerContactInfo.cf',
			'saveContact': Can.util.Config.app.CfOneURL + 'buyersetting/saveBuyerContactInfo.cf',
//			detailTemplate': Can.util.Config.app.CanURL + 'js/data/editBuyingLead.json'
			'detailTemplate': Can.util.Config.app.CfOneURL + 'buyinglead/editBuyingLead.cf',
			'recommendProduct': Can.util.Config.app.CfOneURL + 'buyinglead/findRecommendProduct.cf',
			'sendProductInquiry': Can.util.Config.app.CfOneURL + 'buyinglead/sendProductInquiry.cf'
		},
		/*采购需求详情*/
		'BuyerBlDetailModule': {
//		'	includePage': Can.util.Config.app.CanURL + 'js/buyer/view/buyerlead_detail.html'
			'includePage': Can.util.Config.app.CfOneURL + 'buyinglead/jspLoadBuyingLead.cf',
			'updateState': Can.util.Config.app.CfOneURL + 'buyinglead/viewReplyAndSetRead.cf',
			'updateStateOuter': Can.util.Config.app.CfOneURL + 'outerbuyinglead/viewReplyAndSetReadByOuter.cf',
//            'exhibitor': Can.util.Config.app.CanURL+'js/data/exhibitor.json'
			'exhibitor': Can.util.Config.app.CfOneURL + 'buyinglead/pushKitchenLight.cf',
			'exhibitorOut': Can.util.Config.app.CfOneURL + 'outerbuyinglead/pushKitchenLightByOuter.cf'
		},
		/*供应商个人资料详情窗口*/
		'profileWindow': {
//			'supplierProfile': Can.util.Config.app.CanURL + 'js/data/sellerProfile.json',
			'supplierProfile': Can.util.Config.app.CfOneURL + 'buyercust/getSupplierInfo.cf',
//			'outSupplierProfile': Can.util.Config.app.CanURL + 'js/data/supplierInfo.json',
			'outSupplierProfile': Can.util.Config.app.CfOneURL + 'outerbuyinglead/findSupCardBySupplierId.cf',
			'saveFollow': Can.util.Config.app.CfOneURL + 'buyerdetail/saveBizFollow.cf',
			'360url': '/cfone/panorama/detail.cf?companyId='
		},
		/*我的设置*/
		'mySetting': {
			'personProfile': Can.util.Config.app.CfOneURL + 'buyersetting/findPersonProfile.cf',
			'savePersonProfile': Can.util.Config.app.CfOneURL + 'buyersetting/savePersonProfile.cf',
			'companyProfile': Can.util.Config.app.CfOneURL + 'buyersetting/findCompanyProfile.cf',
			'saveCompanyProfile': Can.util.Config.app.CfOneURL + 'buyersetting/saveCompanyProfile.cf',
			'companyBizProfile': Can.util.Config.app.CfOneURL + 'buyersetting/findCompanyBizProfile.cf',
			'saveCompanyBizProfile': Can.util.Config.app.CfOneURL + 'buyersetting/saveCompanyBizProfile.cf',
			'setAccount': Can.util.Config.app.CfOneURL + 'buyersetting /findAccountSetting.cf',
			'saveAccount': Can.util.Config.app.CfOneURL + 'buyersetting/saveAccountSetting.cf',
			'setBusiness': Can.util.Config.app.CfOneURL + 'buyersetting/findBusinessSetting.cf',
			'saveBusiness': Can.util.Config.app.CfOneURL + 'buyersetting/saveBusinessSetting.cf',
			'isEmailActivated': Can.util.Config.app.CfOneURL + 'buyersetting/isActivedByEmail.cf',
			'sendEmail': Can.util.Config.app.CfOneURL + 'buyersetting/sendVerifyEmail.cf',
			'setPublicInfo': Can.util.Config.app.CfOneURL + '/buyersetting/settingPublicInfo.cf',
			'checkEmail': Can.util.Config.app.CfOneURL + 'buyersetting/verifyEmailIsActivated.cf',
			'checkPassword': Can.util.Config.app.CfOneURL + 'buyersetting/validationPassword.cf',
			'resetPassword': Can.util.Config.app.CfOneURL + 'buyersetting/resetPassword.cf',
			'getIntegrity': Can.util.Config.app.CfOneURL + 'buyersetting/getIntegrity.cf'
		}
	},
	/* IM */
	'IM': {
		'getImUserByIds': Can.util.Config.app.CfOneURL + 'im/getImUserByIds.cf',
		'getImUserOnlineStatus': Can.util.Config.app.CfOneURL + 'im/getImUserOnlineStatus.cf'
		// 'domain': 'webim'
		// 'server': 'http://192.168.10.13/http-bind/'
		//'server': 'http://im.e-cantonfair.com/http-bind/'

	},
	/* C币开关 */
	'checkCcoinOpened': Can.util.Config.app.CfOneURL + 'config/isCcoinServiceOpened.cf',
	'EN': {
		'url': {
			'postBuyinglead': '/buyinglead/index.html'
		},
		'buyinglead': {
			'getStaticData': Can.util.Config.app.CfOneURL + "buyinglead/getBuyingLeadPageStaticData.cf",
			'getBuyerContactInfo': Can.util.Config.app.CfOneURL + "buyersetting/findBuyerContactInfo.cf",
			'setBuyerContactInfo': Can.util.Config.app.CfOneURL + "buyersetting/saveBuyerContactInfo.cf"
		},
		'inquire': {
			'getStaticData': Can.util.Config.app.CfOneURL + "showroom/productsViewInfo.cf",
			'getBuyerContactInfo': Can.util.Config.app.CfOneURL + "buyersetting/findBuyerContactInfo.cf",
			'sendInquire': Can.util.Config.app.CfOneURL + "message/saveInquire.cf",
			'sendVerifyEmail': Can.util.Config.app.CfOneURL + "user/sendVerifyEmailNoLogin.cf"
		}
	}
});

/**
 * 根据语言设置加载资源文件
 * @Author': AngusYoung
 * @Update': 13-3-12
 */
function fGetLangRes(sLang) {
	var sPath = 'js/framework/local/local_';
	$.ajax({
		url: Can.util.Config.app.CanURL + sPath + sLang + '.js',
		dataType: 'SCRIPT',
		async: false,
		cache: false,
		success: function () {
			$(function () {
				if (sLang === 'en') {
					$(document.body).removeClass();
				}
				else {
					$(document.body).addClass(sLang);
				}
				$.post(Can.util.Config.changeLang, {locale: sLang.replace('-', '_')});
			});
		},
		error: function () {
			//改成温和的提示方式
			if (console) {
				console.clear && console.clear();
				console.warn && console.warn('language file is not loaded!');
			}


			/*$(function () {*/
			//$(document.body).empty();
			//Can.importJS(['js/utils/windowView.js']);
			//var _bad = new Can.view.alertWindowView();
			//_bad.setContent('<div class="error-box" style="font-size:13px;font-weight: bold;">' +
			//'Language file load failed!<br />Please refresh and try again.' +
			//'</div>');
			//_bad.onClose(function () {
			//location.reload();
			//});
			//_bad.show();
			//if (console) {
			//console.clear && console.clear();
			//console.warn && console.warn('language file is not loaded!');
			//}
			/*});*/
		}
	});
}
fGetLangRes(Can.util.Config.lang);
