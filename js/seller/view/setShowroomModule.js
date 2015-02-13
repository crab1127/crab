/**
 *
 * Showroom Setting Module
 * @Author: island
 * @version: v1.0
 * @since:13-3-01 下午10:05
 */
Can.module.SetShowroomModule = Can.extend(Can.module.BaseModule, {
	id:'sellerSetShowroomModuleId',
	title:Can.msg.MODULE.SHOWROOM_SET.SHOWROOM_INFO,
	actionJs:['js/framework/jquery/jquery.validate.js', 'js/seller/action/sellerSetShowroomAction.js'],
	requireUiJs:[
		'js/framework/utils/require.js',
		'js/seller/view/sellerShowroomView.js',
		'js/seller/view/sellerShowroomPrdInfoView.js',
		'js/seller/view/sellerShowroomMarketInfoView.js',
		'js/seller/view/sellerShowroomPrdsInfoView.js',
        'js/seller/view/sellerShowroomTemplate.js',
        'js/seller/view/sellerShowroomDomain.js'
	],
	constructor:function (cfg) {
		Can.apply(this, cfg || {});
		Can.module.SetShowroomModule.superclass.constructor.call(this);
		this.addEvents('onsettingclick', 'onviewmypushclick');
        this._nIndex = -1;
	},
	showroomMenus:[
		{
			title:Can.msg.MODULE.SHOWROOM_SET.COMP_INFO,
			className:'bg-ico c-company',
			clkView:'Can.view.ShowroomComInfoView',
            show:Can.util.menuCreate.check(12),
            href: '#!/showroom-info',
			top:18
		},
		{
			title:Can.msg.MODULE.SHOWROOM_SET.FACTORY_INFO,
			className:'bg-ico c-production',
			clkView:'Can.view.SellerShowroomPrdInfoView',
            show:Can.util.menuCreate.check(13),
            href: '#!/showroom-info/manufacturing',
			top:54
		},
		{
			title:Can.msg.MODULE.SHOWROOM_SET.MARKET_INFO,
			className:'bg-ico c-marketing',
			clkView:'Can.view.SellerShowroomMarketInfoBaseView',
            show:Can.util.menuCreate.check(14),
            href: '#!/showroom-info/trading',
			top:90
		},
		{
			title:Can.msg.MODULE.SHOWROOM_SET.PRODUCT_INFO,
			className:'bg-ico c-products',
			clkView:'Can.view.SellerShowroomPrdsInfoBaseView',
            show:Can.util.menuCreate.check(15),
            href: '#!/showroom-info/product',
			top:125
		},//, 这版先不上。先隐藏 
		{
			title:Can.msg.MODULE.SHOWROOM_SET.TEMPLATE_SETTING,
			className:'icons template',
			clkView:'Can.view.SellerShowroomTemplateView',
            show: true, //TODO 加入规则 Can.util.menuCreate.check(16),
            href: '#!/showroom-info/template',
			top:160
		},
		{
			title:Can.msg.MODULE.SHOWROOM_SET.HTTP_SETTING,
			className:'icons domain',
			clkView:'Can.view.sellerShowroomDomainView',
            show: true, //TODO 加入规则 Can.util.menuCreate.check(17),
            href: '#!/showroom-info/domain',
			top:195
		}
	],
	startup:function () {
		Can.module.SetShowroomModule.superclass.startup.call(this);
		this.modColPanel = new Can.ui.Panel({
			wrapEL:'div', cssName:'mod-col clear'
		});
		this.modColPanel.applyTo(this.contentEl);
		this.toolbarPanel = new Can.ui.Panel({
			wrapEL:'div', cssName:'extra'
		});
		this.modColPanel.addItem(this.toolbarPanel);
		var integrityPanel = new Can.ui.Panel({
			cssName:'integrity', wrapEL:'div', html:'<p>' + Can.msg.MODULE.SHOWROOM_SET.INFO_INTEGRITY + '</p>'
		});
		this.toolbarPanel.addItem(integrityPanel);
		this.integrity_bar = new Can.ui.percentBar();
		integrityPanel.addItem(this.integrity_bar);
		this.initMenu();
		this.loadIndex();
		this.refreshMainData();
	},
	/**
	 * 初始化左边菜单
	 */
	initMenu:function () {
		var me = this,
			menus = this.showroomMenus,
			navPanel1 = new Can.ui.Panel({wrapEL:'div', cssName:'site-nav'}),
			navPanel2 = new Can.ui.Panel({wrapEL:'div', cssName:'nav-item'}),
			itemCon = new Can.ui.Panel({wrapEL:'ul', cssName:'my-apps'}),
			anchorEl = $('<div class="bg-ico cur-mark" style="top:18px"></div>').appendTo(navPanel2.getDom()),
			viewMap = new Can.util.ArrayMap();

		me.toolbarPanel.addItem(navPanel1);
		navPanel1.addItem(navPanel2);
		navPanel2.addItem(itemCon);
        me.itemCon = itemCon;

		for (var i = 0; i < menus.length; i++) {

            if(!menus[i].show) continue;

			var cName = menus[i].className,
				actionModule = menus[i].clkView,
				title = menus[i].title,
				liHtml = '<li><a href="' + menus[i].href + '"><span class="' + cName + '"></span>' + title + '</a></li>',
				liEl = $(liHtml).appendTo(itemCon.getDom());

			liEl.data({a:actionModule});

			liEl.click(function () {
				var a = $(this).data('a'),
					index = $(this).index(),
                    t = 18+index*36;

                if(me._nIndex === index){
                    return false;
                }
                if(me.currentView){
					me.currentView.hide();
				}
                me._nIndex = index;
                //console.log(me._nIndex);

				anchorEl.animate({
					top:t
				}, 500, function () {
				});
				var view = viewMap.get(index);
				if (view == null) {
					//view = new (Can.util.require(a))();
					view = eval('new ' + a + '()');
					view.start();
					view.applyTo(me.modColPanel.getDom());
					viewMap.put(index, view);
				}
				if (view == me.currentView) {
					return;
				}
                //console.log(me.currentView);
				view.show();
				me.currentView = view;
                //return false;
			});
		}
	},
    actIndex: function(args){
        //显示第一个
        this.itemCon.el.find('li').first().click();
    },
    actManufacturing: function(args){
        this.itemCon.el.find('li').eq(1).click();
    },
    actTrading: function(args){
        this.itemCon.el.find('li').eq(2).click();
    },
    actProduct: function(args){
        this.itemCon.el.find('li').eq(3).click();
    },
    actTemplate: function(args){
        this.itemCon.el.find('li').eq(4).click();
    },
    actDomain: function(args){
        this.itemCon.el.find('li').eq(5).click();
    },
	loadIndex:function () {

	},
	refreshMainData:function () {
		// var me = this;
		// var jData = {supplierIntegrity:85};
		// me.integrity_bar.update(jData.supplierIntegrity);
		var that = this;
		//更新资料完成度
		$.get(Can.util.Config.seller.indexModule.userInfo, function (jData) {
			if (jData.status && jData.status === 'success') {
				that.integrity_bar.update(jData.data.supplierIntegrity || 0);
			}
			else {
				Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
			}
		},'json');
	}
});
