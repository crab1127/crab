/**
 * 商机中心
 * @Author: vfasky
 * @Version: 2.0
 * @Date: 13-10-08
 */
;(function(Can, Module){
    'use strict';

    var _oConfg = Can.util.Config.buyer;

    //加载双向绑定模板引擎
    Can.importJS([
        'js/framework/utils/two-way-tpl.js'
    ]);
    var template = Can.util.TWtemplate;

    Module.opportunityModule = Can.extend(Module.BaseModule, {
		title: Can.msg.MODULE.OPPORTUNITY.TITLE,
		id: 'OpportunityModuleId',
		requireUiJs: [],
		actionJs: [],
		constructor: function (jCfg) {
			Can.apply(this, jCfg || {});
			Module.opportunityModule.superclass.constructor.call(this);
            this._isOnRender = false;
            this._nPage = 1;
		},
		startup: function () {
			Module.opportunityModule.superclass.startup.call(this);
        },
        //兼容旧接口
        init: function(){
        },
        //渲染tab
        renderTab: function(){
            var self = this;

            var $Tab = this.titleContainerEL.find('.opt-box').html(
                self._$Tpl.find('#top-tab').html()
            );
            var oTAnt = template($Tab);

            //顶部 tab 渲染完成
            oTAnt.el.on('click', '.co', function(){
                self.initCollections(); 

                //return false;
            }).on('click', '.se', function(){
                self.initEgg();
                //return false;
            });
        },
        //加载模板
        loadTpl: function(callback){
            if(this._$Tpl){
                return callback(this._$Tpl);
            }
            var self = this; 
            template.load('js/buyer/view/opportunity.html', function(tpl){
                //console.log(tpl);
                self._$Tpl = $(tpl);
                self.renderTab();
                callback(self._$Tpl);
            });                        
        },
        //判断路由，开始分发
        routeAct: function(){
            var sRoute = this._oRoutRule ?
                this._oRoutRule.route[0] : '/collections';   

            if(sRoute === '/collections'){
                this.initCollections(); 
            }
            else{
                this.initEgg();
            }
            return sRoute;
        },
        //标记路由
        routeMark: function(){
            Can.Route.mark(this.routeAct());
        },
        initCollections: function(){
            if(this._type === 'collections'){
                return;
            }
            this._type = 'collections';
            var self = this;
            self._nPage = 1;
            //取搜索表单参数
            var fGetArgs = function(){
                $.ajax({
                    url: _oConfg.opportunity.opportunityScreen,
                    cache: false,
                    success: function(oJson){
                        //console.log(oJson);
                        self.oAnt.set('categoryList', oJson.data[0].category);
                        self.oAnt.el.find('#categoryField').change();

                        self.oAnt.set('tagList', oJson.data[1].tag);
                        self.oAnt.el.find('#tagField').change();

                        self.oAnt.set('sourceList', oJson.data[2].source);
                        self.oAnt.el.find('#sourceField').change();
                    }
                });
            };

            //搜索
            var fSearch = function(callback){
                
                var oData = self.oAnt.el.find('form').serialize() + 
                            '&page=' + self._nPage.toString();

                var oAvatarType = {
                    1 : 'male',
                    2 : 'female'
                };

                self.oAnt.set('isShowLoad', true);
                $.ajax({
                    url: _oConfg.opportunity.opportunity_itmes,
                    data: oData,
                    cache: false,                    
                    success: function (oData){
                        $.each(oData.data, function (k, v) {
                            v.ix         = k;
                            v.isProduct  = v.collectType == 2;
                            v.avatarType = oAvatarType[v.gender] || 'defautl';
                            if(typeof(v.thirdDomain)!='undefined' && v.thirdDomain!=null && v.thirdDomain!="")
                            	v.domainUrl = "http://"+v.thirdDomain+".en.e-cantonfair.com";

                        });
                        self.oAnt.set('page', oData.page);
                        self.oAnt.set('isShowLoad', false);
                        self.oAnt.set('data', oData.data);
						
                        if (oData.data.length > 0) {
                            for (var i = 0; i < oData.data.length; i++) {
                                fSkypeUi(oData.data[i].collectionId, oData.data[i].skype, oData.data[i].supplierId);
                            }
                        }
                    }
                });
            };
            //skype方法
            var fSkypeUi = function(i, skypeName,cfecId) {
                if (skypeName) {
                    Skype.ui({
                        "name" : "dropdown",
                        "element" : 'SkypeButton' + i,
                        "participants" : [skypeName],
                        "statusStyle" : "mediumicon",
                        "millisec" : "5000",
                        "cfecId": cfecId
                    });
                }
                
            };

            this.loadTpl(function($Tpl){
                self.titleContainerEL.find('.opt-box .cur').removeClass('cur');
                self.titleContainerEL.find('.co').addClass('cur');
                Can.Route.mark('/collections');

                self.contentEl.find('.content-wrap').remove();
                self.contentEl.html($Tpl.find('#collection-wrap').html());
                
                self.oAnt = template(self.contentEl.find('.content-wrap'));

                fGetArgs();
                self.oAnt.el.on('submit', 'form', function(){
                    self._nPage = 1;
                    fSearch();
                    return false;
                }).on('click', '.action a', function(){
                    self.oAnt.el.find('form').submit();
                    return false;
                }).on('mouseover', '.remove, .tool>a', function () {
                    var self = $(this);
                    if(self.is('a')){
                        self = $(this).find('.icons');
                    }
                    self.attr('class', self.attr('class').replace('-0', '-1'));
                    
                }).on('mouseout', '.remove, .tool>a', function () {
                    var self = $(this);
                    if(self.is('a')){
                        self = $(this).find('.icons');
                    }
                    self.attr('class', self.attr('class').replace('-1', '-0'));
                }).on('click', '[act=inquire]', function () {
                    //产品询盘
                    var $el = $(this);
                    var nIx = $el.attr('data-ix');
                    var aData = self.oAnt.get('data');
                    //console.log(aData[nIx]);
                    var oData = aData[nIx];

                    if(!oData){
                        return false;
                    }

                    var oVal = {inquiry: []};
                    var sTitle = '';
                    
                    if(oData.isProduct){
                        oVal.inquiry.push({
                            supplierId: oData.supplierId,
                            supplierName: oData.superlierName,
                            companyId: oData.companyId,
                            companyName: oData.companyName,
                            products: [
                                {
                                    productId: oData.targetId,
                                    productTitle: oData.subject,
                                    productPhoto: oData.image
                                }
                            ]
                        });

                        sTitle = Can.util.i18n._('MESSAGE_WINDOW.INQUIRY_SUBJECT', oData.subject);
                    }
                    else{
                        oVal.inquiry.push({
                            supplierId: oData.supplierId,
                            supplierName: oData.superlierName,
                            companyId: oData.companyId,
                            companyName: oData.companyName,
                            products: null 
                        });

                        sTitle = Can.util.i18n._('MESSAGE_WINDOW.INQUIRY_SUBJECT', 'company');

                    }

                    Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, oVal, sTitle]);


                    return false;
                }).on('click', '.remove', function () {
                    //删除
                    var nId = $(this).attr('data-id');
                    
                    var sUrl = _oConfg.opportunity.delOpportunity;

                    var fSendPost = function () {
                        $.post(sUrl, {
                            collectionId: nId
                        }, function (oJson) {
                            if(oJson.status === 'success'){
                                if(self._nPage > 1 && self.oAnt.get('data').length <= 1){
                                    self._nPage --;
                                    
                                }
                                return fSearch();

                            }
                        }, 'json');
                    };

                    var confirmWin = new Can.view.confirmWindowView({
                        id: "opportunityConfirmWin",
                        width: 280
                    });
                    confirmWin.setContent('<div style="padding: 10px 20px;">'+ Can.util.i18n._('DELETE_CONFIRM') +'</div>');
                    confirmWin.show();
                    confirmWin.onOK(function () {
                        fSendPost();
                    });
                    
                    return false;
                });

                //绑定分页条事件
                self.oAnt.el.find('[paging]').data('pageChange', function(page){
                    self._nPage = page;
                    fSearch();
                });

                fSearch();

            });
        },
        initEgg: function(){
            if(this._type === 'egg'){
                return;
            }
            this._type = 'egg';

            var self = this;
            self._nPage = 1;
            this.loadTpl(function($Tpl){
                self.titleContainerEL.find('.opt-box .cur').removeClass('cur');
                self.titleContainerEL.find('.se').addClass('cur');
                Can.Route.mark('/collections/sourcing-egg');
                
                self.contentEl.find('.content-wrap').remove();

                self.contentEl.html($Tpl.find('#egg-wrap').html());
                self.oAnt = template(self.contentEl.find('.content-wrap'));

                var fGetData = function (callback) {
                    self.oAnt.set('isShowLoad', true);
                    $.ajax({
                        url: _oConfg.opportunity.getbizOpportunities,
                        data: {page: self._nPage},
                        cache: false,
                        success: function (oData){
                            $.each(oData.data, function (k, v) {
                                v.ix = k;
                            });
                            
                            self.oAnt.set('page', oData.page);
                            self.oAnt.set('isShowLoad', false);
                            self.oAnt.set('data', oData.data);

                            //绑定分页条事件
                            self.oAnt.el.find('[paging]').data('pageChange', function(page){
                                self._nPage = page;
                                fGetData();
                            });
                           
                        }
                    });
                };

                fGetData();


                self.oAnt.el.on('mouseover', '.products', function () {
                    var self = $(this).find('i');
                    self.attr('class', self.attr('class').replace('-0', '-1'));
                    
                }).on('mouseout', '.products', function () {
                    var self = $(this).find('i');
                    self.attr('class', self.attr('class').replace('-1', '-0'));
                }).on('click', '[act=inquire]', function () {
                    //产品询盘
                    var $el = $(this);
                    var nIx = $el.attr('data-ix');
                    var aData = self.oAnt.get('data');
                    //console.log(aData[nIx]);
                    var oData = aData[nIx];

                    if(!oData){
                        return false;
                    }

                    var oVal = {inquiry: []};
                 
                    oVal.inquiry.push({
                            supplierId: oData.superlierId,
                            supplierName: oData.superlierName,
                            companyId: oData.companyId,
                            companyName: oData.subject,
                            products: null 
                        });

                    var sTitle = Can.util.i18n._('MESSAGE_WINDOW.INQUIRY_SUBJECT', 'company');

                    Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, oVal, sTitle]);


                    return false;
                });

                


            });

        }
        
    });

    
})(Can, Can.module);
