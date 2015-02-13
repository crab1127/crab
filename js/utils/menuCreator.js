/**
 * platform menu creator
 * @Author: AngusYoung
 * @Version: 1.8
 * @Since: 13-9-25
 */

Can.util.menuCreate = function () {
	/**
	 * 计算Object的成员数量，并提供过滤器
	 * @private
	 */
	function __fCountObjLen(oObj, aFilter) {
		var n = 0;
		if (typeof oObj === 'object') {
			for (var v in oObj) {
				if ($.inArray(v, aFilter) >= 0) {
					continue;
				}
				n++;
			}
		}
		return n;
	}

	/**
	 * 对两组权限进行比较，并对结果进行差异补偿
	 * @private
	 */
	function __fDiffFlag(sStrA, sStrB) {
		sStrA = sStrA || '';
		sStrB = sStrB || '';
		var _patch = (new Array(Math.abs(sStrA.length - sStrB.length) + 1)).join('0');
		if (sStrA.length > sStrB.length) {
			sStrB += _patch;
		}
		else if (sStrB.length > sStrA.length) {
			sStrA += _patch;
		}
		var _old_len = Math.max(sStrA.length, sStrB.length);
		var _new_str = (parseInt(sStrA, 2) | parseInt(sStrB, 2)).toString(2);
		if (_new_str.length < _old_len) {
			return (new Array(Math.abs(_new_str.length - _old_len) + 1).join('0')) + _new_str;
		}
		else {
			return _new_str;
		}
	}

	/**
	 * 将对应的各种功能服务加入平台顶部入口
	 * @private
	 */
	function __fBuilder(jButton, nType) {
		var sKey = jButton.key;
		//delete jButton.key;
		switch (nType) {
			case 1:
				this[sKey] = new Can.ui.toolbar.ModuleMenuButton(jButton);
				this.toolbar1 && this.toolbar1.addItem(this[sKey]);
				break;
			case 2:
				this[sKey] = new Can.ui.toolbar.FunctionShortcutMenuButton(jButton);
				this.functionToolbar && this.functionToolbar.addItem(this[sKey]);
				break;
			case 3:
				this[sKey].list.el.append(jButton.html);
				break;
			case 4:
				this[sKey] = new Can.ui.toolbar.FunctionShortcutMenuButton(jButton);
				this[sKey].el.attr({'href': jButton.url, 'target': '_blank'});
				this.functionToolbar && this.functionToolbar.addItem(this[sKey]);
				break;
			case 5:
				var $Parent = this[sKey].el.attr('link', this[sKey].el.attr('id')).removeAttr('id').parent();
				this[sKey].titleEl.append('<i class="child triangle-d"></i>');
				var oChild = new Can.ui.toolbar.SubToolbar({
					parentBar: this,
					currentItem: this[sKey].getDom()
				});
				oChild.applyTo($Parent);
				var aChild = jButton.childMenu;
				for (var m = 0; m < aChild.length; m++) {
					var _key = aChild[m].key;
					this[_key] = new Can.ui.toolbar.FunctionShortcutMenuButton(aChild[m]);
					oChild.addItem(this[_key]);
				}
				break;
			default :
				this[sKey] = new Can.ui.Panel(jButton);
				this.toolbar2.addItem(this[sKey]);
				this[sKey].list = new Can.ui.Panel({cssName: 'submenu hidden'});
				var $SupplierService = this[sKey].el.parent();
				this[sKey].list.applyTo($SupplierService);
				$SupplierService.addClass('left');
				(function (oObj) {
					$SupplierService
						.mouseenter(function () {
							oObj[sKey].list.el.removeClass('hidden');
						})
						.mouseleave(function () {
							oObj[sKey].list.el.addClass('hidden');
						});
				})(this);
		}
	}

	/**
	 * 合并相同group id 的服务功能，用于菜单图标超出范围时
	 * @private
	 */
	function __fMergeGroup(nIndex) {
		var oMenu = aMenu[nIndex];
		var _group_id = oMenu.group;
		var _group_list = [];
		for (var i = 0, nLen = aMenu.length; i < nLen; i++) {
			if (aMenu[i].group && aMenu[i].group === _group_id) {
				_group_list.push(aMenu[i]);
				if (oMenu.id !== aMenu[i].id) {
					aMenu[i] = null;
				}
			}
		}
		oMenu['childMenu'] = _group_list;//.slice(1);
		return oMenu;
	}

	/**
	 * 获取当前用户所拥有的套餐包含的功能，并返回一个规则
	 * @private
	 */
	function __fGetFlags(aPackage) {
		var _flag = {};
		for (var i = 0; i < aPackage.length; i++) {
			if (jPackage[aPackage[i]]) {
				var _package = jPackage[aPackage[i]];
				var _tb = _package['tb'];
				var _lb = _package['lb'];
				var _ob = _package['ob'];
				delete _package['tb'];
				delete _package['lb'];
				delete _package['ob'];
				// 只要任何套餐中tb为“开”的，则认定为开启
				if (_flag['tb']) {
					_flag['tb'] = __fDiffFlag(_flag['tb'], _tb);
				}
				else {
					_flag['tb'] = _tb;
				}
				// 如果只有一个套餐并且没有任何shortcut则lb转为shortcut（单一云服务套餐会出现）
				var _short = false;
				if (__fCountObjLen(_package)) {
					for (var j in _package) {
						if (__fCountObjLen(aMenu[j])) {
							_short = true;
							break;
						}
					}
				}
				if (aPackage.length === 1 && !_short) {
					_flag['lb'] = _lb.replace(/1/g, '2');
				}
				else if (_flag['lb']) {
					_flag['lb'] = __fDiffFlag(_flag['lb'], _lb);
				}
				else {
					_flag['lb'] = _lb;
				}
				// 以套餐开启的服务多者的shortcut排序为准
				// 计算当前套餐开启的服务数，并与之前的服务数比较
				if (__fCountObjLen(_package) > __fCountObjLen(_flag, ['ob', 'lb', 'tb'])) {
					_flag['ob'] = _ob;
				}
				// 将正常的套餐服务加入
				$.extend(_flag, _package);
			}
		}
		return _flag;
	}

	var dRealTime = new Date() - Can.util.userInfo().getTimeDiff();

	var jPackage = {
//		1: '匹配采购商',
//		2: '采购商动态',
//		3: '采购需求',
//		4: '添加产品',
//		5: '产品管理',
//		6: '产品统计',
//		7: '直通车统计',
//		8: '交换器统计',
//		9: '推送统计',
//		10: '商业规则设置',
//		11: '展台设置',
//		12: '公司信息',
//		13: '工厂信息',
//		14: '市场信息',
//		15: '产品信息',
//		16: '账户信息',
//		17: '个人信息',
//		18: '修改密码',
//		19: '企业速递',
//		20: '服务商店',
//		'21': '账户管理',	
		// 体验会员
		'1': {
			'tb': '11111',
//			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理',
			'ob': {
//				'3': 1,
				'4': 2,
				'5': 3,
				'11': 4
			}
		},
		// 智航版
		'2': {
			'tb': '11111',
//			'1': '匹配采购商',
			'2': '采购商动态',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
//			'6': '产品统计',
			'9': '推送统计',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理',
			'ob': {
//				'1': 1,
				'2': 2,
				'3': 3,
				'4': 4,
				'5': 5,
				'7': 6,
				'8': 7,
//				'6': 8,
				'11': 9
			}
		},
		// 旗舰会员
		'3': {
			'tb': '11111',
			'2': '采购商动态',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'9': '推送统计',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// 至尊会员
		'4': {
			'tb': '11111',
			'2': '采购商动态',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'9': '推送统计',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		'5': {
			'19': '企业速递'
		},
		'6': {
			'19': '企业速递'
		},
		// 钻石会员
		'7': {
			'tb': '11111',
			'2': '采购商动态',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'9': '推送统计',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// 铂金会员
		'8': {
			'tb': '11111',
			'2': '采购商动态',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'9': '推送统计',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// 广交会速递
		'9': {
			'tb': '11111',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'7': '直通车统计',
			'8': '交换器统计',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理',
			'ob': {
				'3': 1,
				'4': 2,
				'5': 3,
				'11': 4,
				'7': 5,
				'8': 6
			}
		},
		// 预售会员
		'10': {
			'tb': '11111',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理',
			'ob': {
				'3': 1,
				'4': 2,
				'5': 3,
				'11': 4
			}
		},
		// 云服务
		'11': {
			'tb': '10001',
			'lb': '111',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// E广通（终身制）
		'12': {
			'tb': '11111',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// E广通
		'13': {
			'tb': '11111',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// 中国优企
		'14': {
			'tb': '11111',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// 中国尊企
		'15': {
			'tb': '11111',
			'2': '采购商动态',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'9': '推送统计',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// 中国鼎企
		'16': {
			'tb': '11111',
			'2': '采购商动态',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'9': '推送统计',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		//预售e广通（审核通过的产品数量<3）
		'17':{
			'tb': '11011',
			'4': '添加产品',
			'5': '产品管理',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理',
			'ob': {
				'4': 1,
				'5': 2,
				'11': 3
			}
		},
        // 预售e广通（审核通过的产品数量>=3） ------ 预售e广通 菜单(2) ------
		'171': {
			'tb': '11111',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		},
		// 无锡商务局项目会员
		'18': {
			'tb': '11111',
			'3': '采购需求',
			'4': '添加产品',
			'5': '产品管理',
			'10': '商业规则设置',
			'11': '展台设置',
			'12': '公司信息',
			'13': '工厂信息',
			'14': '市场信息',
			'15': '产品信息',
			'16': '账户信息',
			'17': '个人信息',
			'18': '修改密码',
			'20': '服务商店',
			'21': '账户管理'
		}

	};

	var aTool = [
		{key: 'homeBtn', id: 'homeBtnId', cssName: 'ico-n1', text: Can.msg.BUTTON.TOP_BAR_1.HOME},
		{key: 'myShowroom', id: 'myShowroomBtnId', cssName: 'ico-n2', text: Can.msg.BUTTON.TOP_BAR_1.SHOWROOM},
		{key: 'msgBtn', id: 'msgBtnId', cssName: 'ico-n3', text: Can.msg.BUTTON.TOP_BAR_1.MSG_CENTER},
		{key: 'customerBtn', id: 'customerBtnId', cssName: 'ico-n4', text: Can.msg.BUTTON.TOP_BAR_1.CUSTOMER_MANAGE},
		{key: 'settingBtn', id: 'mySettingBtnId', cssName: 'ico-n5', text: Can.msg.BUTTON.TOP_BAR_1.SETTING}
	];
	var aMenu = [
		{key: 'matchBuyerBtn', id: 'matchBuyerBtnId', cssName: 'ico-m1', text: Can.msg.BUTTON.TOP_BAR_2.MATCH_BUYER},
		{key: 'activityBtn', id: 'activityBtnId', cssName: 'ico-m2', text: Can.msg.BUTTON.TOP_BAR_2.ACTIVITY},
		{key: 'buyingLeadBtn', id: 'buyingLeadBtnId', cssName: 'ico-m3', text: Can.msg.BUTTON.TOP_BAR_2.BUYING_LEAD},
		{key: 'addProductBtn', id: 'addPrdBtnId', cssName: 'ico-m4', text: Can.msg.BUTTON.TOP_BAR_2.PRODUCT_FORM},
		{key: 'managePrdBtn', id: 'managePrdBtnId', cssName: 'ico-m5', text: Can.msg.BUTTON.TOP_BAR_2.MANAGE_PRODUCT},
		{key: 'prdCountBtn', group: 1, id: 'prdCountBtnId', cssName: 'ico-m6', text: Can.msg.BUTTON.TOP_BAR_2.PRODUCT_COUNT},
		{key: 'carCountBtn', group: 1, id: 'carCountBtnId', cssName: 'ico-m10', text: Can.msg.BUTTON.TOP_BAR_2.CAR_COUNT},
		{key: 'excCountBtn', group: 1, id: 'excCountBtnId', cssName: 'ico-m9', text: Can.msg.BUTTON.TOP_BAR_2.EXC_COUNT},
		{},
		{},
		{key: 'showroomBtn', id: 'showroomBtnId', cssName: 'ico-m7', text: Can.msg.BUTTON.TOP_BAR_2.SHOWROOM},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{}
	];
	var jLink = {
//		1: '中银广电商通宝',
//		2: '中信保网上投保',
//		3: '国际信用卡收款',
		service: {key: 'supplierService', cssName: 'jer', html: '<a href="javascript:;">' + Can.msg.SERVICES.MENU_TITLE + '<i class="triangle-d"></i></a>'},
		links: [
			{key: 'supplierService', html: '<a href="' + Can.util.Config.seller.services.zhongXB + '" target="_blank">' + Can.msg.SERVICES.ZHONG_XB + '</a>'},
			{key: 'supplierService', html: '<a href="' + Can.util.Config.seller.services.zhongYTB + '" target="_blank">' + Can.msg.SERVICES.ZHONG_YTB + '</a>'},
			{key: 'supplierService', html: '<a href="' + Can.util.Config.seller.services.cardPay + '" target="_blank">' + Can.msg.SERVICES.CARD_PAY + '</a>'}
		],
		shortcut: [
			{key: 'zTbBtn', id: 'zTbBtnId', cssName: 'ico-m8', url: Can.util.Config.seller.services.zhongXB, text: Can.msg.SERVICES.ZHONG_XB},
			{key: 'zXbBtn', id: 'zXbBtnId', cssName: 'ico-m11', url: Can.util.Config.seller.services.zhongYTB, text: Can.msg.SERVICES.ZHONG_YTB},
			{key: 'cardPayBtn', id: 'cardPayBtnId', cssName: 'ico-m12', url: Can.util.Config.seller.services.cardPay, text: Can.msg.SERVICES.CARD_PAY}
		]
	};
	var jModuleId = {
		'sellerIndexModule': 0,
		'expIndexModuleId': 0,
		'matchBuyerModuleId': 1,
		'buyerActivityModuleId': 2,
		'buyerleadModuleId': 3,
		'buyingLeadDetailModuleId': 3,
		'addProductModuleId': 4,
		'mdfProductModuleId': 4,
		'productManageModuleId': 5,
		'productDetailModuleId': 5,
		'productStatusModuleId': 6,
		'statisticsModuleId': 7,
		'sellerSetShowroomModuleId': 11,

		'msgCenterModuleId': -3,
		'myContacterModuleId': -2,
		'mySettingModuleId': -1,
		'businessRuleSettingModuleId': 0,
		'purchasePreferModuleId': 0
	};
	var sFlagToken;

	return {
		create: function (oTopMenu, aPackage) {
			var aAuthority;
			var jFlags = __fGetFlags(aPackage);
//			console.info(jFlags)
			if (!__fCountObjLen(jFlags)) {
				return;
			}
			var sFlags = '';

			function __fCheckShortcut(nIndex) {
				return __fCountObjLen(aMenu[nIndex - 1]) ? '2' : '1';
			}

			for (var i = 1; i < aMenu.length; i++) {
				sFlags += jFlags[i] === undefined ? '0' : __fCheckShortcut(i);
			}
			sFlagToken = sFlags + jFlags['tb'];
			aAuthority = [jFlags['tb'], sFlags, jFlags['lb']];
			var jOrder = jFlags['ob'];
			var j, nLen;

			// toolbar
			var _tools = aAuthority[0] || '';
			for (j = 0, nLen = _tools.length; j < nLen; j++) {
				_tools[j] === '1' && __fBuilder.call(oTopMenu, aTool[j], 1);
			}

			// menubar
			var _menu = aAuthority[1] || '';
			var _total = (_menu.match(/2/g) && _menu.match(/2/g).length) || 0;
			var _child = [];
			if (_total > 8) {
				// 超过八个，将同属性的合并
				for (j = 0, nLen = aMenu.length; j < nLen; j++) {
					if (aMenu[j] && aMenu[j].group) {
						//去到合并进程
						_child.push(__fMergeGroup(j));
					}
				}
			}
			var aQueue = [];
			for (j = 0, nLen = _menu.length; j < nLen; j++) {
				if (_menu[j] === '2' && aMenu[j]) {
					// 加入队列
					aQueue.push({order: (jOrder && jOrder[j + 1]) || aMenu.length, menu: aMenu[j]});
				}
			}
			// 队列排序
			aQueue.sort(function (a, b) {
				return a['order'] > b['order'];
			});
			// 按队列输出
			var _len = 0;
			for (j = 0, nLen = aQueue.length; j < nLen; j++) {
				__fBuilder.call(oTopMenu, aQueue[j]['menu'], 2);
				_len++;
			}
			if (_child.length) {
				var k;
				for (k = 0, nLen = _child.length; k < nLen; k++) {
					__fBuilder.call(oTopMenu, _child[k], 5);
				}
			}
			if (_len > 3) {
				oTopMenu.functionToolbar.el.addClass('m' + _len);
			}

			// linkbar
			var _link = aAuthority[2] || '';
			if (/1/.test(_link)) {
				__fBuilder.call(oTopMenu, jLink.service, 0);
			}
			for (j = 0, nLen = _link.length; j < nLen; j++) {
				if (_link[j] === '1') {
					__fBuilder.call(oTopMenu, jLink.links[j], 3);
				}
				else if (_link[j] === '2') {
					__fBuilder.call(oTopMenu, jLink.shortcut[j], 4);
				}
			}
		},
		check: function (xFlag) {
			if (typeof xFlag === 'string') {
				if (jModuleId[xFlag]) {
					return arguments.callee(parseInt(jModuleId[xFlag], 10));
				}
				return true;
			}
			else {
				if (!sFlagToken || !xFlag || xFlag === 0) {
					return false;
				}
				if (xFlag < 0) {
					return !!parseInt(sFlagToken.slice(xFlag).substr(0, 1), 10);
				}
				else {
					return !!parseInt(sFlagToken.substr(xFlag - 1, 1), 10);
				}
			}
		},
		checkAccount: function(accountType){
			if(accountType == 1){
				return true;
			}else{
				return false;
			}
		}
	};
}();