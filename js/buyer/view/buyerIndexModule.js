/**
 * Buyer Index module
 * @Author: AngusYoung
 * @Version: 1.6
 * @Update: 13-7-17
 */

Can.module.buyerIndexModule = Can.extend(Can.module.BaseModule, {
    id: 'buyerIndexModule',
    requireUiJs: ['js/buyer/view/pushSpCard.js', 'js/buyer/view/buyerInfoView.js'],
    actionJs: ['js/buyer/action/buyerIndexAction.js'],
    pushItem: [],
    constructor: function (jCfg) {
        var that = this;

        Can.apply(this, jCfg || {});
        Can.module.buyerIndexModule.superclass.constructor.call(this);
        var _search_wp = new Can.ui.Panel({
            cssName: 'ind-search search-s4 clear buyer-index'
        });

        // 搜索类型下拉搜索框
        this.searchSel = new Can.ui.DropDownField({
            cssName: 'drop fuck-xhd',
            blankText: Can.msg.MODULE.SEARCH.SEARCH_NORMAL,
            labelItems: Can.msg.MODULE.SEARCH.SEARCH_SELECT,
            valueItems: [ 'Product', 'Supplier' ]
        });
        this.searchSel.setValue('Product');

        this.searchSel.on('onselected', function () {
            if (this.value === 'Product') {
                that.searchIpt.autoComplete = true;
            } else {
                that.searchIpt.autoComplete = false;
            }
        });
        this.searchSel.triggerEL.addClass('arrow');

        // 关键字搜索
        this.searchKeywordWp = new Can.ui.Panel({
            cssName: 'search-keyword-wrap'
        });
        this.searchIpt = new Can.ui.TextField({
            cssName: 'foucs-box',
            id: null,
            width: null,
            autoComplete: false,
            autoCompleteURL: Can.util.Config.buyer.searchModule.candidateWord + '?searchType=2',
            blankText: Can.msg.BUYER.INDEX.SEARCH_PLD
        });
        this.searchKeywordError = new Can.ui.Panel({
            cssName: 'error-msg',
            html: Can.msg.MODULE.SEARCH.KEYWORD_ERROR_INFO
        });
        this.searchIpt.input.keyup(function (event) {
            if (event.keyCode != 13) {
                that.searchKeywordWp.el.removeClass('el-error');
                that.searchKeywordError.el.hide();
            }
        });
        this.searchKeywordWp.addItem(this.searchIpt);
        this.searchKeywordWp.addItem(this.searchKeywordError);
        this.searchIpt.input.removeClass('txt');
        this.searchIpt.input.data('submit', function () {
            that.searchBtn.el.click();
        });
        this.searchBtn = new Can.ui.toolbar.Button({
            cssName: 'btn-search',
            text: Can.msg.BUTTON.SEARCH_BTN
        });

        _search_wp.addItem(this.searchSel);
        _search_wp.addItem(this.searchKeywordWp);
        _search_wp.addItem(this.searchBtn);
        this.__initSearchResultPbl(_search_wp);
        this.searchBar = new Can.ui.Panel({
            cssName: 'mod-filter',
            items: [_search_wp]
        });

        this.pushProduct = new Can.ui.Panel({
            cssName: 'pro-rec-s1'
        });
        this.pushLimtPage = new Can.ui.limitButton({
            cssName: 'ui-page color-block fr',
            option: [0, 1, 0],
            limit: 7
        });

        // Allenice add {
        Can.util.userInfo(Can.util.Config.accountInfo);
        var email = Can.util.userInfo().getEmail();
        var et_html = "<span class='bg-ico ice-icon-warn'></span>" +
            "Want to sign in with your email " +
            "<span class='ice-gray'>" +
            "(" + email + "  <a id='ice-et-edit' class='ice-green' href='javascript:;'>edit</a> )?  " +
            "</span>" +
            "<a id='ice-et-activate' class='ice-green' href='javascript:;'>Activate your email login</a> to receive more up-to-date Canton Fair information!." +
            "<span class='ice-email-loading'></span>" +
            "<span class='bg-ico ice-icon-close'></span>";

        this.emailTips = new Can.ui.Panel({
            cssName: "ice-email-tips",
            items: [et_html]
        });
        // Allenice add }
    },

    /**
     * 渲染搜索栏发布需求按钮
     * @param toolbarPanel
     * @private
     */
    __initSearchResultPbl: function (toolbarPanel) {
        var postBuyingLeadSep = $('<span class="post-buying-lead-sep"></span>');
        var postBuyingLeadImg = $('<span class="post-buying-lead-img"></span>');
        var postBuyingLeadBtn = new Can.ui.toolbar.Button({
            cssName: 'post-buying-lead',
            text: Can.msg.MODULE.SEARCH.LEAD_EXPRESS
        });
        postBuyingLeadBtn.on('onclick', function () {
            $('#pbuyerleadBtnId').trigger('click');
        });

        var $tipsWrap = $('<div class="tips-wrap"></div>');
        toolbarPanel.addItem($tipsWrap);

        postBuyingLeadSep.appendTo($tipsWrap);
        postBuyingLeadImg.appendTo($tipsWrap);
        postBuyingLeadBtn.el.appendTo($tipsWrap);
        var $tips = $(['<div class="tips">',
            '<div class="tipContent">',
                '<span>' + Can.msg.MODULE.SEARCH.LEAD_EXPRESS_TIPS + '</span>',
                '<a href="javascript:;" class="tipAction link-to">' + Can.msg.MODULE.SEARCH.LEAD_EXPRESS_ACTION + '</a>',
            '</div>',
            '<div class="tipOutter"><div class="tipInner"></div></div>',
            '<div class="tipFill"></div>',
            '</div>'].join('')).appendTo($tipsWrap);

        $tipsWrap.find('.tipAction').on('click', function () {
            if ($.cookie('leadexpress-tip-clicked') != 1) {
                $.cookie('leadexpress-tip-clicked', 1, {expires: 9999, path: '/'});
            }
            $tips.hide();
        });

        // 如cookie不存在点击记录，默认显示
        if ($.cookie('leadexpress-tip-clicked') != 1) {
            $tips.show();
        }
    },

    startup: function () {
        Can.module.buyerIndexModule.superclass.startup.call(this);

        // Allenice add{
        this.emailTips.applyTo(this.contentEl);
        this.checkEmailActivated(); //检测邮箱是否激活
        this.checkEmailTrans(); //检测是否是邮箱跳转过来的
        // Allenice add }

        var buyerInfo = new Can.view.buyerInfoView({target: this.contentEl});
        buyerInfo.start();
        this.searchBar.applyTo(this.contentEl);

        this.pushProduct.addItem(['<h3 class="opp-title">' + Can.msg.BUYER.INDEX.OPP_TIT + '</h3>', this.pushLimtPage]);
        this.pushProduct.applyTo(this.contentEl);

        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        _this.pushLimtPage.onChange(function () {
            for (var i = 0; i < _this.pushItem.length; i++) {
                if (i + 1 === this.current) {
                    _this.pushItem[i].slideDown();
                }
                else {
                    _this.pushItem[i].slideUp();
                }
            }
        });

        // Allenice add {
        var $emailTips = _this.emailTips.el;
        $emailTips.find(".ice-icon-close").click(function () {
            $emailTips.slideUp(200);
        });
        // Allenice add }

    },
    addPush: function (aData) {
        if (aData && aData.length) {
            this.pushLimtPage.total = aData.length;
            this.pushLimtPage.refresh();
            if (this.pushLimtPage.max > 1) {
                this.pushLimtPage.el.show();
            }
            else {
                this.pushLimtPage.el.hide();
            }
            //build push list
            for (var i = 0; i < aData.length; i++) {
                if (i % 7 == 0) {
                    var _div = $('<div class="tab-cont"></div>');
                    var _ul = $('<ul class="mod-list-s2"></ul>');
                    _div.append(_ul);
                    _div.hide();
                    this.pushItem.push(_div);
                    this.pushProduct.addItem(_div);
                }
                var _card = new Can.view.pushSpCardView({
                    data: aData[i],
                    cssName: 'item-box-s1',
                    wrapTag: 'li',
                    target: _ul,
                    index: i
                });
                _card.contentEl.data('room', Can.util.room.checkin(aData[i]));
                _card.contentEl.attr('role', 'item');
                _card.start();
                _card.initSkypeBtn(aData[i], i);
            }
            var _tabWrapper = $(".tab-cont .mod-list-s2");
            $.each(_tabWrapper, function (i, item) {
               var liList = $(item).find("li.item-box-s1");
                $.each(liList, function (i, item) {
                    if (liList.length <= 3||i>2) {
                        $(item).find(".io-skype").addClass("io-skype-up");
                    }
                })
            })
            this.pushItem[0].show();
        }
    },
    onTabSwitch: function (fFn) {
        if (typeof fFn === 'function') {
            this.remmSwitch = fFn;
        }
    },
    onSearch: function (fFn) {
        if (typeof fFn === 'function') {
            this.searchBtn.on('onclick', fFn);
        }
    },
    onRemmProClick: function (fFn) {
        if (typeof fFn === 'function') {
            this.clickPro = fFn;
        }
    },

    // 编辑邮箱
    onMailEditClick: function (fFn) {
        if (typeof fFn === 'function') {
            this.emailTips.el.find("#ice-et-edit").click(fFn);
        }
    },
    // 邮箱登录激活
    onActivateClick: function (fFn) {
        if (typeof fFn === 'function') {
            this.emailTips.el.find("#ice-et-activate").click(fFn);
        }
    },
    //检测邮箱登录是否激活
    checkEmailActivated: function () {
        var _this = this;
        $.ajax({
            url: Can.util.Config.buyer.mySetting.isEmailActivated,
            success: function (jData) {
                if (jData.status && jData.status === 'success') {
                    if (jData.data && jData.data.result) {
                        _this.emailTips.el.hide();
                    } else if (jData.data && !jData.data.result) {
                        _this.emailTips.el.show();
                    }
                }
            }
        });
    },
    //检测是否是邮箱跳转过来的
    checkEmailTrans: function () {
        var email = "";
        if (localStorage) {
            email = localStorage.getItem("email_transform");
        }
        if (email) {
            localStorage.removeItem("email_transform");
            var win = new Can.view.msgWindowView({
                width: 300,
                height: 150
            });
            var html = '<div class="xxx" style="padding: 20px;"><p class="txt"><h3 style="color: #575757; font-size: 14px; font-weight: bold;">Activated successfully!</h3><div style="padding-top: 10px; font-size: 12px;">You can login with your Canton Fair ID or email<br>(<span style="color: #e04d2c">' + email + '</span>)</div></p><div class="mod-actions" style="text-align: center; margin-top: 15px;"><a id="ice-mail-activate" href="javascript:;" class="btn btn-s11"><span>OK</span></a></div></div>';

            win.setContent(html);
            win.show();

            $("#ice-mail-activate").click(function () {
                win.close();
            });
        }
    },
    loadRemmData: function (sURL) {
        var _this = this;
        $.ajax({
            url: sURL,
            success: function (jData) {
                if (jData.status && jData.status === 'success') {
                    var _data = jData.data;
                    var _td = [];
                    var _pd = [];
                    var _sort_data = [];
                    for (var v in _data) {
                        var _data_json = {title: v, item: _data[v]};
                        _sort_data.push(_data_json);
                    }
                    _sort_data.sort(function (a, b) {
                        return a.item.length < b.item.length;
                    });
                    for (var i = 0, nLen = _sort_data.length; i < nLen; i++) {
                        var _tit = _sort_data[i].title;
                        var _pro = _sort_data[i].item;
                        _td.push(_tit);

                        function __fCreateItem(data, size) {
                            size = size || '230x230';

                            return '<a href="javascript:;" cid="' + data.productId + '" cantitle="' + data.productIntroduction + '">' + Can.util.formatImage(data.productPhoto, size, '', data.productTitle) + '</a><div class="shadow"><p class="tit"><a href="javascript:;" cid="' + data.productId + '">' + data.productTitle + '</a></p><div class="shadow-bg"></div></div>';
                        }

                        var __html = '<div class="tab-cont"><ul class="mod-list-s1">';
                        if (_pro.length > 1) {
                            __html += '<li>' + __fCreateItem(_pro[1]) + '</li>';
                        }
                        if (_pro.length > 2) {
                            __html += '<li>' + __fCreateItem(_pro[2]) + '</li>';
                        }
                        if (_pro.length > 0) {
                            __html += '</ul><div class="rem-main">' + __fCreateItem(_pro[0], '480x480') + '</div><ul class="mod-list-s1">';
                        }
                        if (_pro.length > 3) {
                            __html += '<li>' + __fCreateItem(_pro[3]) + '</li>';
                        }
                        if (_pro.length > 4) {
                            __html += '<li>' + __fCreateItem(_pro[4]) + '</li>';
                        }
                        __html += '</ul></div>';
                        var _cont = $(__html);

                        _cont.hide();
                        _pd.push(_cont);
                    }
                    //append recommend product
                    _this.remmProduct = new Can.ui.tabPage({
                        cssName: 'pro-rec-s2',
                        tabCss: 'hd',
                        pageCss: 'bd',
                        innerCss: 'tab-page',
                        tabData: _td,
                        pageData: _pd
                    });
                    _this.remmProduct.applyTo(_this.contentEl);
                    _this.remmProduct.pageWrap.delegate('a', 'click', function () {
                        typeof _this.clickPro === 'function' && _this.clickPro.call(this);
                    });
                    _this.remmProduct.on('ON_SWITCH', function ($Cont) {
                        _this.remmSwitch.call($Cont);
                    });

                }
                else {
                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                }
            }
        })
    },
    loadData: function (sURL) {
        var _this = this;
        $.ajax({
            url: sURL,
            success: function (jData) {
                if (jData.status && jData.status === 'success') {
                    _this.addPush(jData.data);
                }
                else {
                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                }
            }
        })
    },
    hide: function (isInit) {
        if (isInit) {
            this.fireEvent('onhide');
            return;
        }
        Can.module.buyerIndexModule.superclass.hide.call(this, arguments[0]);
    }
});
