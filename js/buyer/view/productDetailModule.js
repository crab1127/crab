/**
 * 产品详细
 * @Date: 2014-01-03 10:18:01
 * @Author: vfasky (vfasky@gmail.com)
 * @Version: 2.0
 */
;
(function (Can, module) {
    'use strict';

    //加载双向绑定模板引擎
    Can.importJS([
        'js/framework/utils/two-way-tpl.js',
        'js/utils/stepBtnView.js',
        'js/utils/videoView.js'
    ]);

    var template = Can.util.TWtemplate;
    var sModelId = 'ProductDetailModule';

    module[sModelId] = Can.extend(module.BaseModule, {
        title: 'See Product',
        id: sModelId,
        constructor: function (cfg) {
            Can.apply(this, cfg || {});
            module[sModelId].superclass.constructor.call(this);

            //默认返回产品管理
            this._sRefererUrl = '/product-manage';

            //当前产品id
            this._nId = false;
            this._oAnt = false;
        },
        startup: function () {
            module[sModelId].superclass.startup.call(this);
            var self = this;

            //左右
            this._stepBtn = new Can.view.stepBtnView({css: ['btn-prev', 'btn-next']});
            this._stepBtn.start();


            //返回
            var _backBtn = new Can.ui.toolbar.Button({
                cssName: 'btn-back',
                text: Can.msg.MODULE.PRODUCT_MANAGE.ADD_PRODUCT
            });
            _backBtn.el.attr('cantitle', 'left:' + Can.msg.CAN_TITLE.BACK);
            _backBtn.el.click(function () {
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
            if (!this._nId) {
                return;
            }

            //处理左右翻页
            this._aIds = [];
            this._xPage = false;
            if (args.page) {
                this._aIds = args.page.page_pageIds;
                this._xPage = args.page;
            }
            this.setPage();

            this.loadTpl(function () {
                self.loadData(function (oData) {
                    self.rendelTpl(oData);
                    self.initSkype(oData)
                });
            });

        },
        //绑定模板事件
        tplBind: function ($el) {
        },
        //模板更新时执行
        tplUpdate: function (oAnt, oData) {
            //绑定im
            var $imBtn = oAnt.el.find('#imBtn');
            var data = oData.data;
            $imBtn.data({
                setStatus: function (status, data) {
                    if (status == 'online') {
                        $imBtn.attr('class', 'bg-ico btn-chat-online')
                            .html(Can.msg.IM.CHAT_NOW);
                    }
                    else {
                        $imBtn.attr('class', 'bg-ico btn-chat')
                            .html(Can.msg.IM.OFFLINE);
                    }
                }
            }).attr('cantitle', Can.msg.CAN_TITLE.CHAT);
            Can.util.bindIM.add($imBtn, data.product.supplierId);

            //询盘
            oAnt.el.find('#inquireBtn').off('click').on('click', function () {
                Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, {
                    inquiry: [
                        {
                            supplierId: data.product.supplierId,
                            supplierName: data.company.contacter,
                            companyId: data.company.companyId,
                            companyName: data.company.companyName,
                            products: [
                                {
                                    productId: data.product.productId,
                                    productTitle: data.product.productName,
                                    productPhoto: data.picture.pic1
                                }
                            ]
                        }
                    ]
                }, Can.msg.MESSAGE_WINDOW.INQUIRY_SUBJECT.replace('[@]', data.product.productName)]);
                return false;
            });

            //收藏
            oAnt.el.find('#favoritesBtn').off('click').on('click', function () {
                Can.ui.favorite({
                    trigger: $(this),
                    url: {
                        mark: Can.util.Config.favorite.mark,
                        tag: Can.util.Config.favorite.tag
                    },
                    data: {
                        collectContentId: data.product.productId,
                        collectType: 2
                    }
                });
                return false;
            });

            var _bsubmit = false;
            //提交回复
            var fFeedback = function (notice) {
                var $el = oAnt.el;
                var $feedback = $el.find('.feedback');
                $feedback.html(notice)
                    .slideDown();

                setTimeout(function () {
                    $feedback.slideUp();
                    $el.find('#save-replay').removeClass('dis');
                    _bsubmit = false;
                }, 3500);
            };

            oAnt.el.find('form.reply-box').off('submit').on('submit', function () {
                var self = $(this);
                var $el = oAnt.el;
                $el.find('#save-replay').addClass('dis');
//				console.log(self.serialize());
                return false;

                if (!_bsubmit) {
                    $.ajax({
                        url: Can.util.Config.email.sendEmail,
                        type: 'POST',
                        data: self.serialize(),
                        beforeSend: function () {
                            _bsubmit = true;
                        },
                        complete: function (xhr, status) {
                            if (status != 'success') {
                                _bsubmit = false;
                            }
                            ;
                        },
                        success: function (jData) {
                            if (jData.status !== 'success') {
                                fFeedback(Can.msg.FAILED);
                                return;
                            }
                            self.find('[name=subject]').val('');
                            var editor = self.find('[kindEditor]').data('editor');
                            editor.html(' ');
                            fFeedback(Can.msg.MODULE.MSG_CENTER.SEND);
                        }
                    });
                }

                return false;
            });

        },
        rendelTpl: function (oData) {
            //更新大标题
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
            this.playerView = new Can.view.videoView({resourceUrl: oData.product.videoUrl, warp: $("#view_wrap")});
            this.playerView.start();
        },
        //加载数据
        loadData: function (callback) {
            callback = callback || function () {
            };

            $.ajax({
                url: Can.util.Config.seller.productDetail.loadData,
                data: {productId: this._nId},
                cache: false,
                success: function (jData) {
                    if (jData.status && jData.status === "success") {
                        var data = jData.data;
                        var domainUrl = Can.util.domainUrl(data.company.companyId);
                        if(domainUrl != ""){
                            data.domainUrl = domainUrl;
                        }else{
                            data.domainUrl = "/china-supplier/"+data.company.companyId+".html";
                        }
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
            callback = callback || function () {
            };

            if (this._oAnt) {
                return callback(this._oAnt);
            }

            template.load('js/buyer/view/productDetail.html', function (tpl) {
                //self._$Tpl = $(tpl);

                var $Content = self.contentEl;
                $Content.html(tpl);

                self._oAnt = template($Content);

                self.tplBind($Content);

                self._oAnt.on('update', function () {
                    self.tplUpdate(self._oAnt, self._oAnt.data);
                });

                callback(self._oAnt);
            });

        },
        //设置左右分页
        setPage: function () {
            var nIndex = $.inArray(this._nId, this._aIds);
            var self = this;
            //pre
            var $pre = this._stepBtn.group[0].el.addClass('dis');

            //next
            var $next = this._stepBtn.group[1].el.addClass('dis');
            this._nPre = false;
            this._nNext = false;

            if (-1 === nIndex) {
                this._aIds = [];
                $pre.hide();
                $next.hide();
            }
            else {
                $pre.show();
                $next.show();
                if (nIndex > 0) {
                    this._nPre = this._aIds[nIndex - 1];
                    $pre.removeClass('dis');
                }
                if (nIndex < this._aIds.length - 1) {
                    this._nNext = this._aIds[nIndex + 1];
                    $next.removeClass('dis');
                }
            }

            $pre.off('click').on('click', function () {
                if ($pre.is('.dis')) {
                    return false;
                }
                Can.Route.run('/view-product', {id: self._nPre}, {
                    page: self._xPage,
                    refererUrl: self._sRefererUrl
                });
            });

            $next.off('click').on('click', function () {
                if ($next.is('.dis')) {
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
            if (args.refererUrl) {
                this._sRefererUrl = args.refererUrl;
            }
            else if (args._referer) {
                this._sRefererUrl = args._referer;
            }
        },
        //渲染skype ICON
        initSkype:function(data){
            var isSkypeBtn=$('#SkypeButton'+data.company.companyId+'_paraElement').length;
            if(data.company.skype){
                if(!isSkypeBtn){
                    $("#SkypeButton"+data.company.companyId).empty();
                    Skype.ui({
                        "name": "dropdown",
                        "element": "SkypeButton"+data.company.companyId,
                        "participants": [data.company.skype],
                        "statusStyle": "mediumicon",
                        "millisec": "5000"
                    });
                }
            }
        }
    });

})(Can, Can.module);
