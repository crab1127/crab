/**
 * 产品详细
 * @Date: 2014-01-03 10:18:01
 * @Author: vfasky (vfasky@gmail.com)
 * @Version: 2.0
 */
;(function(Can, module){
    'use strict';

    //加载双向绑定模板引擎
    Can.importJS([
        'js/framework/utils/two-way-tpl.js',
        'js/utils/stepBtnView.js',
        'js/utils/videoView.js'
    ]);

    var template   = Can.util.TWtemplate;
    var sModelId   = 'ProductDetailModule';

    module[sModelId] = Can.extend(module.BaseModule, {
        title: 'See Product',
        id: sModelId,
        constructor: function(cfg){
            Can.apply(this, cfg || {});
            module[sModelId].superclass.constructor.call(this);

            //默认返回产品管理
            this._sRefererUrl = '/product-manage';

            //当前产品id
            this._nId = false;
            this._oAnt = false;
        },
        startup:function () {
            module[sModelId].superclass.startup.call(this);
            var self = this;

            //左右
            this._stepBtn = new Can.view.stepBtnView({css:['btn-prev', 'btn-next']});
            this._stepBtn.start();




            //返回
            var _backBtn = new Can.ui.toolbar.Button({
                cssName:'btn-back',
                text:Can.msg.MODULE.PRODUCT_MANAGE.ADD_PRODUCT
            });
            _backBtn.el.attr('cantitle', 'left:' + Can.msg.CAN_TITLE.BACK);
            _backBtn.el.click(function(){
                Can.Route.run(self._sRefererUrl);
                return false;
            });
            this.addOptBtn([_backBtn]);
            this.addOptBtn(this._stepBtn.group);

        },
        //入口
        actIndex: function (args) {
            var self = this;
            this.setRefererUrl(args);
            this._nId = Number(args.id);
            if(!this._nId){
                return;
            }

            //处理左右翻页
            this._aIds = [];
            this._xPage = false;
            if(args.page){
                this._aIds = args.page.page_pageIds;
                this._xPage = args.page;
            }
            this.setPage();

            this.loadTpl(function(){
                self.loadData(function(oData){
                    self.rendelTpl(oData);
                });
            });

        },
        //绑定模板事件
        tplBind: function($el){

        },
        //模板更新时执行
        tplUpdate: function(oAnt, oData){

        },
        rendelTpl: function(oData){
            //更新大标题
//            oData.product.videoUrl="http://local.e-cantonfair.com/flash/1.flv";///=========
            this.updateTitle(oData.product.productName);

            oData.product.fobPrice = oData.product.fobPrice || 'To be determined';
            oData.product.tags = [];
            for (var i in oData.product.keywords) {
                oData.product.tags.push(oData.product.keywords[i]);
            }
            oData.company.region = Can.util.formatRegion(oData.company.region);
            oData.company.showPM = (oData.company.mainProduct && oData.company.mainProduct.length) > 46;
            //oData.pictureJSON    = JSON.stringify(oData.picture);
 			// #3402 因为不想惊动到后端，所以就由前端来对对象进行数组排序转换了，根据关键字的“pic*”来决定顺序
			oData.pictureJSON = fSortPicObj(oData.picture);
            //console.log(oData);
            this._oAnt.set('data', oData);
//            添加 视频  12-25-2014
            this.playerView = new Can.view.videoView({resourceUrl: oData.product.videoUrl, warp: $("#view_wrap")});
            this.playerView.start();
        },
        //加载数据
        loadData: function(callback){
            callback = callback || function(){};

            $.ajax({
                url:Can.util.Config.seller.productDetail.loadData,
                data: {productId: this._nId},
                cache: false,
                success:function (jData) {
                    if (jData.status && jData.status === "success") {
                    	var data = jData.data;
						data.domainUrl = Can.util.domainUrl(data.company.companyId);
                        callback(data);
                    }
                    else {
                        Can.util.EventDispatch.dispatchEvent("ON_ERROR_HANDLE", this, jData);
                    }
                }
            });
        },
        loadTpl: function (callback) {
            var self = this;
            callback = callback || function () {};

            if(this._oAnt){
                return callback(this._oAnt);
            }

            template.load('js/seller/view/productDetail.html', function(tpl){
                //self._$Tpl = $(tpl);

                var $Content = self.contentEl;
                $Content.html(tpl);

                self._oAnt = template($Content);

                self.tplBind($Content);

                self._oAnt.on('update', function(){
                    self.tplUpdate(self._oAnt, self._oAnt.data);
                });

                callback(self._oAnt);
            });

        },
        //设置左右分页
        setPage: function(){
            var nIndex  = $.inArray(this._nId, this._aIds);
            var self = this;
            //pre
            var $pre = this._stepBtn.group[0].el.addClass('dis');

            //next
            var $next = this._stepBtn.group[1].el.addClass('dis');
            this._nPre  = false;
            this._nNext = false;

            if(-1 === nIndex){
                this._aIds  = [];
                $pre.hide();
                $next.hide();
            }
            else{
                $pre.show();
                $next.show();
                if(nIndex > 0){
                    this._nPre = this._aIds[nIndex - 1];
                    $pre.removeClass('dis');
                }
                if(nIndex < this._aIds.length - 1){
                    this._nNext = this._aIds[nIndex + 1];
                    $next.removeClass('dis');
                }
            }

            $pre.off('click').on('click', function(){
                if($pre.is('.dis')){
                    return false;
                }
                Can.Route.run('/view-product', {id: self._nPre}, {
                    page: self._xPage,
                    refererUrl: self._sRefererUrl
                });
            });

            $next.off('click').on('click', function(){
                if($next.is('.dis')){
                    return false;
                }
                Can.Route.run('/view-product', {id: self._nNext}, {
                    page: self._xPage,
                    refererUrl: self._sRefererUrl
                });
            });

        },
        //设置来路，用于返回
        setRefererUrl: function (args) {
            //兼容旧方案
            if(args.refererUrl){
                this._sRefererUrl = args.refererUrl;
            }
            else if (args._referer){
                this._sRefererUrl = args._referer;
            }
        }
    });

})(Can, Can.module);
