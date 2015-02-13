/**
 * 采购商动态
 * @Date: 2013-11-25 10:18:01
 * @Author: vfasky (vfasky@gmail.com)
 * @Version: 2.0
 */
;(function(Can, module){
    'use strict';

    //加载双向绑定模板引擎
    Can.importJS([
        'js/framework/utils/two-way-tpl.js'
    ]);

    var template   = Can.util.TWtemplate;
    var sModelId   = 'BuyerActivityModule';
    var sTitleI18n = 'MODULE.BUYER_ACTIVITY.TITLE';

    module[sModelId] = Can.extend(module.BaseModule, {
        title: Can.util.i18n._(sTitleI18n),
        id: sModelId,
        constructor: function(cfg){
            Can.apply(this, cfg || {});
            module[sModelId].superclass.constructor.call(this);
            this._sAct = '';
            this._isLoadTool = false;
        },
        startup: function () {
            module[sModelId].superclass.startup.call(this);
            this.setTabs([
                {url: '/buyer-activity', title: Can.util.i18n._('BUYER_ACTIVITY.TIT.ALL_ACTIVITIES')},
                {url: '/buyer-activity/my', title: Can.util.i18n._('BUYER_ACTIVITY.TIT.MY_STATUS')}
            ]);
        },
        loadTpl: function(callback){
            var self = this;
            if(this._oAnt){
                return callback(this._oAnt);
            }
            template.load('js/seller/view/buyerActivity.html', function(tpl){
                self._$Tpl = $(tpl);

                var $Content = self.contentEl;
                $Content.html(
                    self._$Tpl.find('#content-tpl').html()
                );

                var aIds = [4, 14, 2, 12, 5, 20, 7, 19, 18, 3, 13, 1, 11];
                $.each(aIds, function(k, v){
                    var sName = '#item-' + v.toString();
                    $Content.find(sName)
                            .attr('a-if', 'item-' + v.toString())
                            .html(self._$Tpl.find(sName).html());

                });

                self._oAnt = template($Content);

                self.bindEvent(self._oAnt);

                callback(self._oAnt);

            });
        },
        //帮定事件
        bindEvent: function(oAnt){
            var self = this;

            //根据值，从列表中返回对应的数据
            var fGetData = function(key, value){
                var oData = false;
                $.each(oAnt.data.activities, function (k, v) {
                    if(v[key] && v[key] == value){
                        oData = v;
                        return false;
                    }
                });

                return oData;
            };

            //监听搜索事件
            oAnt.el.on('submit', 'form', function(){
                self._nPage = 1;
                self.search(oAnt);
                return false;
            }).on('click', '[push-info]', function () {
                //pushInfo
                var $el   = $(this);
                var oData = fGetData('buyerId', Number($el.attr('push-info')));
                if(false === oData){
                    return false;
                }
                var _data = {
                    buyerId: oData.buyerId,
                    buyerName: oData.buyerName
                };
                Can.util.canInterface('pushInfo', [_data]);
                return false;
            }).on('click', '[read-email]', function () {
                //显示邮件内容
                var $el    = $(this);
                var sMsgId = $el.attr('read-email');

                Can.util.canInterface('readEmail', [
                    {messageId: sMsgId},
                    true
                ]);

                return false;
            }).on('click', 'a[route]', function(){
                self._nScrollTop = $('html,body').scrollTop() || $(this).offset().top - 160;
                //console.log(self._nScrollTop);
            }).on('click', '.live', function(){
                self._isPartCurrentSession = (false === self._isPartCurrentSession);
                self._nPage = 1;
                self._nScrollTop = 0;
                self.search(oAnt);
            });

/*
 *             //记录点击位置
 * 	        oAnt.el.on('click', '.desc a', function(){
 * //            oAnt.el.find('a[route]').bind('click', function(){
 *                 self._nScrollTop = $('html,body').scrollTop() || $(this).offset().top - 160;
 *                 //console.log(self._nScrollTop);
 *             });
 */


            //分页
            oAnt.el.find('[more-paging]').bind('pageChange', function(oEl, nPage){
                //console.log(nPage);
                self._nPage = nPage;
                self.search(oAnt);
            });

        },
        //更新后，事件绑定
        bindUpdateEvent: function(oAnt){
            var self = this;
            /*oAnt.el.find('.live-act').hover(function () {*/
                //var $el   = $(this);
                //var xTime = $el.data('time');
                //if(xTime){
                    //clearTimeout(xTime);
                //}
                //$el.find('.live').show();
            //},function () {
                //var $el = $(this);
                //var xTime = $el.data('time');
                //if(xTime){
                    //clearTimeout(xTime);
                //}
                //xTime = setTimeout(function(){
                    //$el.find('.live').hide();
                //}, 300);

                //$el.data('time', xTime);
            /*})*/
            /*
             * oAnt.el.find('.live').unbind().click(function(){
             *     //console.log('1');
             *     self._isPartCurrentSession = (false === self._isPartCurrentSession);
             *     self._nPage = 1;
             *     self._nScrollTop = 0;
             *     self.search(oAnt);
             * });
             */

        },
        //加载搜索条的数据
        loadToolData: function (callback, isMe) {
            var self = this;
            $.ajax({
                url: Can.util.Config.seller.activityModule.searchParam,
                data: {isMe: (isMe ? true : false)},
                cache: false,
                success: function (jData) {
                    if (jData.status && jData.status === "success") {
                        callback(jData.data);
                        self._isLoadTool = true;
                    }
                    else {
                        Can.util.EventDispatch.dispatchEvent("ON_ERROR_HANDLE", this, jData);
                    }
                }
            });
        },
        //重置搜索条
        resetTool: function () {
            var self = this;
            if(self._isLoadTool && self._oAnt){
                self._oAnt.el.find('form')[0].reset();
                self._oAnt.el.find('form select').change();
            }
        },
        //触发搜索
        search: function (oAnt) {
            var self  = this;
            var sData = oAnt.el.find('form').serialize();
            oAnt.set('isShowLoad', true);

            sData = sData + '&isPartCurrentSession=' + (self._isPartCurrentSession ? 'true' : 'false');
            sData = sData + '&pageSize=10';
            sData = sData + '&currentPage=' + self._nPage.toString();
            sData = sData + '&isMe=' + (self._sAct === 'my' ? 'true' : 'false');

            if(1 === this._nPage){
                oAnt.set('activities', []);
            }
            oAnt.set('page', this._nPage);
            //console.log(sData);
            $.ajax({
                url: Can.util.Config.seller.activityModule.allactivity,
                data: sData,
                cache: false,
                success: function (jData) {
                    oAnt.set('isShowLoad', false);
                    var oData = oAnt.get('activities');
                    jData.data = jData.data || [];
                    //console.log('loaded');
                    if (jData.status && jData.status === "success") {
                        $.each(jData.data, function(k,v){
                            if(false === v.isMe && $.inArray(v.action, [0,1,2,3,4,5]) !== -1){
                                v.action = v.action + 10;

                            }
                            //console.log($.inArray(v.action, [0,1,2,3,4,5]), v.action);

                            v['item-' + v.action.toString()] = true;

                            //查看另人产品
                            if(v.action === 14){
                                v['private'] = false;
                                $.each(v.products, function(k1, v1){
                                    //v1.isPrivate = v1.isSecret;
                                    if(true === v1.isSecret){
                                        v['private'] = true;
                                        return false;
                                    }
                                });
                                //console.log(v.products);
                            }
                            //发布采购需求
                            else if(v.action === 19){
                                v.isShowImg = false;
                                v.images = [];
                                if(v.buyingleadImg && v.buyingleadImg.length > 0){
                                    //v.isShowImg = true;
                                    $.each(v.buyingleadImg, function(k1,v1){
                                        if(v1.sourceType === '001'){
                                            v.images.push(v1.source);
                                        }
                                    });

                                    if(v.images.length > 0){
                                        v.isShowImg = true;
                                    }
                                }
                            }
                            //查看我的产品
                            else if(v.action === 4){
                                v.isShowHistory = (v.historyProducts && v.historyProducts.length > 0);
                            }

                            oData.push(v);
                        });

                        //console.log(jData.data)

                        if(!jData.data || jData.data.length === 0 || jData.data.length < 10){
                            oAnt.el.find('[more-paging]').hide();
                        }
                        else{
                            oAnt.el.find('[more-paging]').show();
                        }
                        if(jData.data.length === 0 && self._nPage === 1){
                            oAnt.set('isNoData', true);
                        }
                        else{
                            oAnt.set('isNoData', false);
                        }
                        //console.log(jData.data)
                        oAnt.set('activities', oData);

                        self.bindUpdateEvent(oAnt);

                    }
                    else {
                        Can.util.EventDispatch.dispatchEvent("ON_ERROR_HANDLE", this, jData);
                    }
                }
            });
        },
        actIndex: function (args) {
            var self = this;

            //console.log(nScrollTop);

            //不重复刷新
            if(self._sAct === 'index'){
                var nScrollTop = self._nScrollTop;

				if (self._xTime) {
					clearTimeout(self._xTime);
				}

				this._xTime = setTimeout(function () {
					$('html,body').animate({
						scrollTop: nScrollTop
					});
				}, 300);

                return;
            }

            self._nPage = 1;
            self._sAct  = 'index';
            self._nScrollTop = 0;
            self._isPartCurrentSession = false;

            self.loadTpl(function(oAnt){
                //self.resetTool();
                //加载搜索条数据
                self.loadToolData(function (oData) {
                    self._oAnt.set('tool', oData);
                    self._oAnt.el.find('form select').change();
                    self.search(oAnt);
                }, false);
            });
        },
        actMy: function (args) {
            var self = this;

            //不重复刷新
            if(self._sAct === 'my'){
                var nScrollTop = self._nScrollTop;

				if (self._xTime) {
					clearTimeout(self._xTime);
				}

				this._xTime = setTimeout(function () {
					$('html,body').animate({
						scrollTop: nScrollTop
					});
				}, 300);

                return;
            }



            self._nPage      = 1;
            self._sAct       = 'my';
            self._nScrollTop = 0;
            self._isPartCurrentSession = false;

            self.loadTpl(function(oAnt){
                //self.resetTool();
                //加载搜索条数据
                self.loadToolData(function (oData) {
                    self._oAnt.set('tool', oData);
                    self._oAnt.el.find('form select').change();
                    self.search(oAnt);
                }, true);
            });

        }
    });

})(Can, Can.module);
