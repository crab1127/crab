/**
 * Marketing Info View
 * Created by Island Huang
 * Date: 13-3-4 下午11:22
 */
Can.view.SellerShowroomPrdsInfoBaseView = Can.extend(Can.view.ShowroowBaseView, {
    tags:[
        {
            title:Can.msg.MODULE.SHOWROOM_SET.MARKET_LABEL_4,
            clkView:'Can.view.SellerShowroomPrdsInfoTag1View'
        },
        {
            title:Can.msg.MODULE.SHOWROOM_SET.MARKET_LABEL_5,
            clkView:'Can.view.SellerShowroomPrdsInfoTag2View'
        },
        {
            title:Can.msg.MODULE.SHOWROOM_SET.MARKET_LABEL_6,
            clkView:'Can.view.SellerShowroomPrdsInfoTag3View'
        }
    ],
    startup:function () {
        Can.view.SellerShowroomMarketInfoBaseView.superclass.startup.call(this);
        var me = this,
            tagCon = $('<div class="tab-s2"></div>').appendTo(me.container),
            viewMap = new Can.util.ArrayMap();
        for (var i = 0; i < me.tags.length; i++) {
            var tagEl = $('<a href="javascript:;"></a>').appendTo(tagCon);
            tagEl.text(me.tags[i].title);
            tagEl.data({a:me.tags[i].clkView, index:i});
            tagEl.click(function () {
                var a = $(this).data('a'),
                    index = $(this).data('index'),
                    view = viewMap.get(index);
                if (view == null) {
                    view = eval('new ' + a + '()');
                    view.start();
                    view.applyTo(me.container);
                    viewMap.put(index, view);
                }
                if (view == me.currentView) {
                    return;
                }
                me.currentView.hide();
                view.show();
                me.currentView = view;
                me.currentTag.removeClass('cur');
                me.currentTag = $(this);
                me.currentTag.addClass('cur');
            });
        }
        me.currentView = eval('new ' + me.tags[0].clkView + '()');
        me.currentView.start();
        me.currentView.applyTo(me.container);
        viewMap.put(0, me.currentView);
        me.currentView.show();
        me.currentTag = tagCon.children('a:first-child');
        me.currentTag.addClass('cur');
    }
});

Can.view.SellerShowroomPrdsInfoBaseTagView = Can.extend(Can.view.BaseView, {
    containerCssName:'mod-form-s1',
    removeUrl:null,
    listItem:[],
    hasCreateHD:false,
    hasCreateSaveBtn:false,
    saveUrl:null,
    startup:function () {
        Can.view.SellerShowroomInfoBaseTagView.superclass.startup.call(this);
        var me = this;
        me.container = $('<div class="' + me.containerCssName + '"></div>');
        me.delIco = $('<a class="bg-ico ico-del" style="display:none;" href="javascript:;"></a>').appendTo('body');
        me.delIco.click(function () {
            var ico = $(this),
                el = $(this).data('el'),
                obj = $(this).data('obj');
            if (obj != null) {
                var pram = {};
                if (obj.hotSalesId) {
                    pram["hotSalesId"] = obj.hotSalesId;
                }
                if (obj.mainSalesId) {
                    pram["mainSalesId"] = obj.mainSalesId;
                }
                $.ajax({
                    url:me.removeUrl,
                    async:false,
                    type:'POST',
                    data:pram,
                    success:function (resultData) {
                        if (resultData.status == "success") {
                            el.fadeOut(function () {
                                el.remove();
                                ico.hide();
                                me.listItem.pop();
                                if (me.listItem.length == 0) {
                                    if (me.hasCreateSaveBtn)
                                        me.saveBtnCon.hide();
                                    me.createNoneRow();
                                } else {
                                    if (me.container.find("input").length == 0) {
                                        if (me.hasCreateSaveBtn)
                                            me.saveBtnCon.hide();
                                    }
                                }
                            });
                        }
                    }
                })
            }
            else {
                el.fadeOut(function () {
                    el.remove();
                    ico.hide();
                    me.listItem.pop();
                    if (me.listItem.length == 0) {
                        if (me.hasCreateSaveBtn)
                            me.saveBtnCon.hide();
                        me.createNoneRow();
                    }
                });
            }
        });
    },
    show:function () {
        this.container.slideDown();
        if (this.tipCon)
            this.tipCon.slideDown();
    },
    hide:function () {
        this.container.slideUp();
        if (this.tipCon)
            this.tipCon.slideUp();
    },
    initTips:function (tips) {
        var me = this;
        me.tipCon = $('<div class="tips-s4"></div>');
        $('<span class="ico"></span>').appendTo(me.tipCon);
        $('<div class="des">' + tips + '</div>').appendTo(me.tipCon);
    },
    createSaveBtn:function () {
        if (!this.hasCreateSaveBtn) {
            this.saveBtnCon = $('<div class="actions"></div>').appendTo(this.container);
            this.saveBtn = $('<a class="btn btn-s11" href="javascript:;">'+Can.msg.BUTTON.SAVE+'</a>');
            this.saveBtn.appendTo(this.saveBtnCon);
            this.hasCreateSaveBtn = true;
            var me = this;
            this.saveBtn.click(function () {
                me.save();
            });
            this.hasCreateSaveBtn = true
        }
    },
    createNoneRow:function () {
        var me = this;
        me.noneItemEl = $('<div class="data-none"></div>').appendTo(me.container);
        $('<p class="txt2">' + Can.msg.MODULE.SHOWROOM_SET.NOT_PRODUCT_RECORD + '</p>').appendTo(me.noneItemEl);
        var addBtn = $('<a class="btn btn-s10" href="javascript:;">' + Can.msg.BUTTON.ADD_NOW + '</a>').appendTo(me.noneItemEl);
        addBtn.click(function () {
            me.createAddRow();
            me.noneItemEl.hide();
        });
    },
    save:function () {
        var me = this;
        var salesPreoportion = 0;
        if (!me.isSaving) {
            var fields = me.findFields();
            var default_mark = function () {
                fields.each(function (i, item) {
                    $(item).removeAttr("style");
                })
            };
            default_mark();
            var params = {};
            var error,
                required_error = Can.msg.MODULE.SHOWROOM_SET.REQUIRE,
                maxNumber_error = Can.msg.MODULE.SHOWROOM_SET.MAX_NUMBER_ERROR,
                number_error = Can.msg.MODULE.SHOWROOM_SET.VALID_NUMBER;

            var isNum = function (v) {
//                return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v)
                return /^\d+(\.\d+)?$/.test(v)
            }
            var gt_maxNum = function (v) {
                if (parseFloat(v) > 9999999999.99)
                    return true;
                else
                    return false;
            }

            for (var i = 0; i < fields.length; i++) {
                var field = fields[i],
                    value = field.value;
                var error_mark = function (obj) {
                    $(obj).attr("style", "border:1px solid #ff0000");
                };
                switch (field.name) {
                    case 'productName':
                        if (!value) {
                            error = required_error;
                            error_mark(field);
                            break;
                        }
                        break;
                    case 'annualSales':
                        if (!value) {
                            error = required_error;
                            error_mark(field);
                            break;
                        }
                        if (!isNum(value)) {
                            error = number_error;
                            error_mark(field);
                            break;
                        } else {
                            if (gt_maxNum(value)) {
                                error = maxNumber_error;
                                error_mark(field);
                                break;
                            }
                        }
                        break;
                    case 'minOrderNum':
                        if (!value) {
                            error = required_error;
                            error_mark(field);
                            break;
                        }
                        if (!isNum(value)) {
                            error = number_error;
                            error_mark(field);
                            break;
                        } else {
                            if (gt_maxNum(value)) {
                                error = maxNumber_error;
                                error_mark(field);
                                break;
                            }
                        }
                        break;
                    case 'minOrderUnit':
                        if (!value) {
                            error = required_error;
                            error_mark(field);
                            break;
                        }
                        break;
                    case 'mainCategory':
                        if (!value) {
                            error = required_error;
                            $(field).closest('[role=row]').height(110);
                            error_mark(field);
                            break;
                        }
                        break;
                    case'salesAccounting_static':
                        value *= 1;
                        salesPreoportion += value;
                        break;
                    case 'salesAccounting':
                        if (!value) {
                            error = required_error;
                            error_mark(field);
                            break;
                        }
                        if (!isNum(value)) {
                            error = number_error;
                            error_mark(field);
                            break;
                        }
                        value *= 1;
                        if (value < 0 || value > 100) {
                            error = Can.msg.MODULE.SHOWROOM_SET.PERCENT_NUMBER;
                            error_mark(field);
                            break;
                        }
                        if (me.id == "SellerShowroomPrdsInfoTag1ViewId") {
                            salesPreoportion += value;
                            if (salesPreoportion > 100) {
                                error = Can.msg.MODULE.SHOWROOM_SET.SALES_PROPORTION;
                                break;
                            }
                        }
                        break;
                }

                if (error) {
//                    $(field).closest('[role=row]').find('.tip').text(error);
                    Can.util.notice(error)
//                    var tipBox = new Can.ui.textTips({
//                        target:me.container,
//                        hasArrow:false,
//                        arrowIs:'Y',
//                        hasIcon:true,
//                        iconCss:'text-tips-icon',
//                        text:error, //Can.msg.MODULE.BUYER_LEAD_MANAGE.SAVE,
//                        id:'top_tip'
//                    });
//                    tipBox.show();
//                    tipBox.updateCss({
//                        marginTop:-40,
//                        marginLeft:480
//                    });
//                    setTimeout(function () {
//                        tipBox.hide();
//                    }, 1500);
                    return;
                }

                if (params[field.name])
                    params[field.name].push(field.value);
                else {
                    params[field.name] = []
                    params[field.name].push(field.value);
                }

            }
            me.isSaving = true;
            var loading = $('<div class="loading-s1"><span></span>Loading ...</div>').insertAfter(me.saveBtn);
            $.ajax({
                data:Can.util.formatFormData(params),
                url:me.saveUrl,
                type:'POST',
                success:function () {
                    me.isSaving = false;
                    loading.remove();
                    delete loading;
                    if (me.saveBtnCon)
                        me.saveBtnCon.remove();
                    me.hasCreateSaveBtn = false;
                    me.saveBtnCon = null;
                    me.saveBtn = null;
                    me.refreshData();
					Can.util.notice( Can.msg.MODULE.SHOWROOM_SET.SUCCESS );
                }
            });
        }
    },
    /**
     * 将当前步骤显示在某个容器中
     * @param {Object} container 父级容器
     */
    applyTo:function (container) {
        if (typeof container == 'object') {
            if (this.tipCon)
                $(container).append(this.tipCon);
            $(container).append(this.container);
            this.topContainer = container;
        }
    },
    findFields:function () {
        return  this.container.find('input');
    },
    bindRowHover:function (rowEl) {
        var me = this;
        rowEl.hover(function () {
            $(this).addClass('hover');
            me.delIco.css({
                top:$(this).offset().top,
                left:$(this).offset().left + $(this).width()
            });
            me.delIco.show();
            me.delIco.data({obj:$(this).data('obj'), el:$(this)});
        }, function (e) {
            var t = e.relatedTarget;
            if (t != undefined && t.tagName == 'A') {
                var row = this;
                $(t).mouseout(function () {
                    me.delIco.hide();
                    $(row).removeClass('hover');
                });
                return;
            }
            $(this).removeClass('hover');
            me.delIco.hide();
        });
    }
});

/**
 * 新产品
 */
Can.view.SellerShowroomPrdsInfoTag3View = Can.extend(Can.view.SellerShowroomPrdsInfoBaseTagView, {
    id:'SellerShowroomPrdsInfoTag3ViewId',
    actionJs:['js/seller/action/sellerShowroomPrdsInfoTag3ViewAction.js'],
    containerCssName:'t-s1 t-s2',
    pullOffPrd:Can.util.Config.seller.setShowroomModule.pullOffNewPrd,
    constructor:function (cfg) {
        Can.apply(this, cfg || {});
        Can.view.SellerShowroomPrdsInfoTag3View.superclass.constructor.call(this);
        this.addEvents('onaddmoreprdclick');
    },
    startup:function () {
        Can.view.SellerShowroomPrdsInfoTag3View.superclass.startup.call(this);
        var me = this;
        me.pagePlug=new Can.ui.limitButton({
            cssName: 'ui-page fr',
            showTotal: true
        });
        me.initTips();
        me.refreshData();

//        me.pagePlug.refresh();
    },
    initTips:function () {
        var me = this;
        me.tipCon = $('<div class="tips-s4"></div>');
        var addMoreCon = new Can.ui.Panel({
            wrapEL:'div',
            cssName:'opt-box'
        });
        addMoreCon.applyTo(me.tipCon);
        var addMoreBtn = new Can.ui.toolbar.Button({
            cssName:'btn btn-s12',
            text:Can.msg.BUTTON.ADD_MORE_PRODUCT
        });
        addMoreCon.addItem(addMoreBtn);
        $('<span class="ico"></span>').appendTo(me.tipCon);
        me.newPrdCountEl = $('<div class="des"></div>').appendTo(me.tipCon);
        addMoreBtn.click(function () {
            me.fireEvent('onaddmoreprdclick', 'onprdclick', 'onpulloffclick');
        });
    },
    refreshData:function (page,pagesize) {
        var pageNo=page||1;
        var pageSize=pagesize||15;
        var dataStr = $.ajax({
            url:Can.util.Config.seller.setShowroomModule.getNewProductInfo,
            async:false,
            type:'get',
            data:{companyId:Can.util.userInfo().getCompanyId(),page:pageNo,pageSize:pageSize}
        }).responseText;
        var data = eval('(' + dataStr + ')');
        var obj = data.data;
        var me = this;
        me.newPrdCountEl.html('<em>' + (data.page==null?0:data.page.total) + '</em> ' + Can.msg.MODULE.SHOWROOM_SET.NEW_PRODUCT_TOTAL);

        me.createHD();
//        me.container.html('');
        me.container.find("div.row-s3").remove();
        me.container.find("div.data-none").remove();
        if (obj && obj.length) {
            for (var i = 0; i < obj.length; i++) {
                var rowEl = $('<div class="row-s3"></div>').appendTo(me.container),
                    modEl = $('<div class="mod-pro"></div>').appendTo(rowEl),
                    picEl = $('<div class="pic"></div>').appendTo(modEl),
                    txtEl = $('<div class="txt-info-s1"></div>').appendTo(modEl),
                    pullDownBtn = $('<a class="bg-ico btn-off" href="javascript:;" cantitle="' + Can.msg.MODULE.SHOWROOM_SET.OFF_STORE + '"></a>').appendTo(rowEl);
                var picBtn = $('<a href="javascript:;"><img src="' + obj[i].productImage + '" width="120" alt="' + obj[i].productName + '"></a>').appendTo(picEl);
                picBtn.click(obj[i], function (event) {
                    me.fireEvent('onprdclick', event.data);
                });
                var titleBtn = $('<h3><a href="javascript:;">' + obj[i].productName + '</a><span class="ico-new"/></h3>').appendTo(txtEl);

                titleBtn.click(obj[i], function (event) {
                    me.fireEvent('onprdclick', event.data);
                });
                $('<p class="txt-tit">' + Can.msg.MODULE.SHOWROOM_SET.MIN_ORDER + '<em>' + obj[i].minOrder + '</em></p>').appendTo(txtEl);
                $('<p class="txt-tit">' + Can.msg.MODULE.SHOWROOM_SET.FOB + '<em>' + obj[i].fobPrice + '</em></p>').appendTo(txtEl);
                $('<p class="txt-tit">' + Can.msg.MODULE.SHOWROOM_SET.PAYMENT + '<em>' + obj[i].paymentTerms + '</em></p>').appendTo(txtEl);
                $('<p class="txt-tit">' + Can.msg.MODULE.SHOWROOM_SET.SUPPLY_ABILITY + '<em>' + obj[i].supplyAbility + '</em></p>').appendTo(txtEl);
                pullDownBtn.data('prd', obj[i]);
                pullDownBtn.click(function () {
                    me.fireEvent('onpulloffclick', $(this).data('prd'));
                });
            }
            Can.apply(me.pagePlug,{
                current:data.page==null?1:data.page.page,
                total:data.page==null?0:data.page.total,
                limit:data.page==null?0:data.page.pageSize
            });
            me.pagePlug.el.appendTo(me.container);
            me.pagePlug.el.show();
            me.pagePlug.refresh();
        } else {
            var noData = $('<div class="data-none">' +
                '<p class="txt2"> ' + Can.msg.MODULE.SHOWROOM_SET.NOT_PRODUCT_RECORD + ' </p>' +
                '</div>').appendTo(me.container);
        }


    },
    turnPage: function () {
        var me = this;
        this.pagePlug.onChange(function (param) {
//            console.log(param)
            me.refreshData(param);
        })
    },
    createHD:function () {
        if (!this.hasCreateHD) {
            var me = this,
                hdCon = $('<div class="hd"></div>');
            hdCon.appendTo(me.container);
            $('<div class="v600">' + Can.msg.MODULE.SHOWROOM_SET.PRODUCT_NAME + '</div>').appendTo(hdCon);
            $('<div class="v80">' + Can.msg.MODULE.SHOWROOM_SET.PRODUCT_ACTION + '</div>').appendTo(hdCon);
            me.hasCreateHD = true;
        }
    },
    cleanList:function () {
        this.container.find("div.row-s3").remove();
    },
    setValues:function (strValues) {
        var me = this;
        var param = {};
        var productIds = [];
        if (strValues && strValues.length) {
            for (var s = 0; s < strValues.length; s++) {
                productIds.push(strValues[s].id);
            }
        }
        param["productIds"] = productIds;
        param["newest"] = 1;
        $.ajax({
            url:Can.util.Config.seller.setShowroomModule.setNewProduct,
            type:"POST",
            data:Can.util.formatFormData(param),
            success:function (resultData) {
                if (resultData.status == "success") {
                    me.refreshData();
                }
            }
        })
    }
});


/**
 * 主营产品
 */
Can.view.SellerShowroomPrdsInfoTag1View = Can.extend(Can.view.SellerShowroomPrdsInfoBaseTagView, {
    id:'SellerShowroomPrdsInfoTag1ViewId',
    actionJs:['js/seller/action/sellerShowroomPrdsInfoTag1ViewAction.js'],
    containerCssName:'t-s1',
    removeUrl:Can.util.Config.seller.setShowroomModule.removeCoreSalePrd,
    saveUrl:Can.util.Config.seller.setShowroomModule.saveCoreSalePrd,
    constructor:function (cfg) {
        Can.apply(this, cfg || {});
        Can.view.SellerShowroomPrdsInfoTag3View.superclass.constructor.call(this);
        this.addEvents('onaddmoreprdclick');
    },
    startup:function () {
        Can.view.SellerShowroomPrdsInfoTag3View.superclass.startup.call(this);
        var me = this;
        me.refreshData();
    },
    refreshData:function () {
        this.container.children('.row').remove();
        this.listItem = [];
        var dataStr = $.ajax({
            url:Can.util.Config.seller.setShowroomModule.setShowroomCorePrdList,
            async:false,
            type:'POST',
            data:{companyId:Can.util.userInfo().getCompanyId()}
        }).responseText;
        var data = eval('(' + dataStr + ')');
        var obj = data.data.productsInfo.mainSales;
        this.mainProductGroup = obj.mainCategories;
        var me = this;
        me.createHD();
        if (obj.length == 0) {
            me.createNoneRow();
            return;
        }
        if (obj.list && obj.list.length) {
            for (var i = 0; i < obj.list.length; i++) {
                var rowEl = $('<div class="row"></div>').appendTo(me.container),
                    picEl = $('<div class="v400">' + obj.list[i].mainCategory + '</div>').appendTo(rowEl),
                    txtEl = $('<div class="v130">' + obj.list[i].salesAccounting + '%<input type="hidden" value="' + obj.list[i].salesAccounting + '" name="salesAccounting_static"></div>').appendTo(rowEl),
                    editBtn = $('<a class="bg-ico ico-trail" href="javascript:;" product_defaultId="' + obj.form[i].mainSalesId['default'] + '" cantitle="' + Can.msg.CAN_TITLE.MODIFY + '"></a>').appendTo(rowEl),
                    addBtn = $('<a class="btn-add" href="javascript:;"></a>').appendTo(rowEl);
                me.listItem.push(rowEl);
                rowEl.data({obj:obj.list[i], GroupData:this.mainProductGroup, forms:obj.form[i]});
                me.bindRowHover(rowEl);
                addBtn.click(function () {
                    var _rowEl = $(this).parent(),
                        GroupData = _rowEl.data('GroupData');
                    me.createAddRow();
                });
                editBtn.click(function () {
                    var _rowEl = $(this).parent(),
                        data = _rowEl.data('obj'),
                        forms = _rowEl.data('forms'),
                        GroupData = _rowEl.data('GroupData'),
                        cs = _rowEl.children();
                    $(cs[0]).empty();
                    var mainSalesIdEl = $('<input type="hidden" name="mainSalesId" value="' + $(this).attr("product_defaultId") + '">');
                    var s1 = new Can.ui.groupDropDownField({
                        id:'group_feild',
                        name:'mainCategory',
                        blankText:Can.msg.MODULE.PRODUCT_FORM.GROUP_PLACE,
                        update_btn_txt:true,
                        btnCss:'btn btn-s12',
                        btnTxt:Can.msg.MODULE.PRODUCT_FORM.GROUP_TEXT,
                        add_url:Can.util.Config.seller.addProduct.newGroup,
                        keyUp_url:Can.util.Config.seller.addProduct.CHECK_GROUP_NAME,
                        valueItems:[],
                        labelItems:[]
                    });
                    for (var g = 0; g < GroupData.length; g++) {
                        s1.valueItems.push(GroupData[g].value);
                        s1.labelItems.push(GroupData[g].text);
                    }
                    s1.updateOptions();
                    for (var v = 0; v < s1.valueItems.length; v++) {
                        if (forms.mainCategory['default'] == s1.valueItems[v]) {
                            s1.setValue(forms.mainCategory['default']);
                        }
                    }
                    mainSalesIdEl.appendTo($(cs[0]));
                    s1.applyTo($(cs[0]));
                    s1.setValue(data.mainCategoryId);
                    s1.el.find("em").text(data.mainCategory);
                    $(cs[1]).empty();
                    $('<input class="w100 ipt-s1" type="text" name="salesAccounting" value="' + data.salesAccounting + '">').appendTo($(cs[1]));
                    $('<span class="r-txt">%</span>').appendTo($(cs[1]));
                    $(this).hide();
                    me.createSaveBtn();
                });
            }
        } else {
            var noData = $('<div class="data-none">' +
                '<p class="txt2"> ' + Can.msg.MODULE.SHOWROOM_SET.NOT_PRODUCT_RECORD + ' </p>' +
                '</div>').appendTo(me.container);
            var but = $('<a href="javascript:;" class="btn btn-s10">' + Can.msg.MODULE.SHOWROOM_SET.ADD_NOW + '</a>');
            but.appendTo(noData);
            but.click(function () {
                me.createAddRow();
                $(this).parent().remove()
            })
        }

    },
    createHD:function () {
        if (!this.hasCreateHD) {
            var me = this,
                hdCon = $('<div class="hd"></div>').appendTo(me.container);
            $('<div class="v400">' + Can.msg.MODULE.SHOWROOM_SET.MAIN_PRODUCT_CATE + '</div>').appendTo(hdCon);
            $('<div class="v180">' + Can.msg.MODULE.SHOWROOM_SET.SALE_PRODUCT_RATE + '</div>').appendTo(hdCon);
            me.hasCreateHD = true;
        }
    },
    createAddRow:function () {
        var GroupData = this.mainProductGroup
        var me = this,
            rowEl = $('<div class="row"></div>').appendTo(me.container),
            td1 = $('<div class="v400"></div>').appendTo(rowEl),
            td2 = $('<div class="v130"></div>').appendTo(rowEl),
            addBtn = $('<a class="btn-add" href="javascript:;"></a>').appendTo(rowEl),
            random = (new Date()).getTime().toString(),
            testStr = random.substring(8, random.length);
        me.listItem.push(rowEl);
        if (me.hasCreateSaveBtn) {
            rowEl.insertBefore(me.saveBtnCon);
            me.saveBtnCon.show();
        }
        else {
            rowEl.appendTo(me.container);
        }
        var mainSalesIdEl = $('<input type="hidden" name="mainSalesId" value="">')
        var s1 = new Can.ui.groupDropDownField({
            id:'group_feild',
            name:'mainCategory',
            blankText:Can.msg.MODULE.PRODUCT_FORM.GROUP_PLACE,
            update_btn_txt:true,
            btnCss:'btn btn-s12',
            btnTxt:Can.msg.MODULE.PRODUCT_FORM.GROUP_TEXT,
            add_url:Can.util.Config.seller.addProduct.newGroup,
            keyUp_url:Can.util.Config.seller.addProduct.CHECK_GROUP_NAME,
            valueItems:[],
            labelItems:[]
        });
        for (var g = 0; g < GroupData.length; g++) {
            s1.valueItems.push(GroupData[g].value);
            s1.labelItems.push(GroupData[g].text);
        }
        s1.updateOptions();
        mainSalesIdEl.appendTo(td1);
        s1.applyTo(td1);
        $('<input class="w100 ipt-s1" type="text" name="salesAccounting">').appendTo(td2);
        $('<span class="r-txt">%</span>').appendTo(td2);
        addBtn.click(function () {
            me.createAddRow();
        });
        rowEl.data({obj:null});
        me.bindRowHover(rowEl);
        me.createSaveBtn();
    }
});

/**
 * 热销产品
 */
Can.view.SellerShowroomPrdsInfoTag2View = Can.extend(Can.view.SellerShowroomPrdsInfoBaseTagView, {
    id:'SellerShowroomPrdsInfoTag2ViewId',
    containerCssName:'t-s1',
    removeUrl:Can.util.Config.seller.setShowroomModule.removeHotPrd,
    saveUrl:Can.util.Config.seller.setShowroomModule.saveHotPrd,
    unitTxt_list:[],
    unitVal_list:[],
    startup:function () {
        Can.view.SellerShowroomPrdsInfoTag3View.superclass.startup.call(this);
        var me = this;
        me.refreshData();
    },
    refreshData:function () {
        this.container.children('.row,.row-s2,.row-s10').remove();
        this.listItem = [];
        // var dataStr = $.ajax({
        var data;
        $.ajax({
            url:Can.util.Config.seller.setShowroomModule.setShowroomHotPrdList,
            async:false,
            type:'POST',
            data:{companyId:Can.util.userInfo().getCompanyId()},
            success:function (d) {
                data = d;
            }
        });
        // }).responseText;

        // var data = eval('(' + dataStr + ')');
        var obj = data.data.productsInfo.hotSales;
        for (var n = 0; n < obj.orderUnits.length; n++) {
            this.unitVal_list.push(obj.orderUnits[n].value);
            this.unitTxt_list.push(obj.orderUnits[n].text);
        }
//        console.log(obj)
        var me = this;
        me.createHD();
        if (obj.length == 0) {
            me.createNoneRow();
            return;
        }
        if (obj.list && obj.list.length) {
            for (var i = 0; i < obj.list.length; i++) {
                var rowEl = $('<div class="row row-s10"></div>').appendTo(me.container),
                    td1El = $('<div class="v210" style="overflow: hidden">' + obj.list[i].productName + '</div>').appendTo(rowEl),
                    td2El = $('<div class="v130">' + obj.list[i].annualSales + '</div>').appendTo(rowEl),
                    td3El = $('<div class="v180">' + obj.list[i].minOrder + '</div>').appendTo(rowEl),
                    td4El = $('<div class="v100" cantitle="' + obj.list[i].majorBuyers + '">' + obj.list[i].majorBuyers + '</div>').appendTo(rowEl),
                    editBtn = $('<a class="bg-ico ico-trail" href="javascript:;" cantitle="' + Can.msg.CAN_TITLE.MODIFY + '"></a>').appendTo(rowEl),
                    addBtn = $('<a class="btn-add" href="javascript:;"></a>').appendTo(rowEl);
                me.listItem.push(rowEl);
                rowEl.data({obj:obj.list[i], formObj:obj.form[i]});
                me.bindRowHover(rowEl);
                addBtn.click(function () {
                    me.createAddRow();
                });
                editBtn.click(function () {
                    var _rowEl = $(this).parent(),
                        data = _rowEl.data('obj'),
                        formdata = _rowEl.data('formObj'),
                        cs = _rowEl.children();
                    _rowEl.removeClass('row');
                    _rowEl.addClass('row-s2');
//                    console.log(data)
                    $(cs[0]).empty();
                    $('<input name="hotSalesId" type="hidden" value="' + data.hotSalesId + '">').appendTo($(cs[0]));
                    $('<input class="w140 ipt-s1" type="text" name="productName" value="' + data.productName + '">').appendTo($(cs[0]));
                    $(cs[1]).empty();
                    $('<input class="w60 ipt-s1" type="text" name="annualSales" value="' + formdata.annualSales['default'] + '">').appendTo($(cs[1]));
                    $('<span class="r-txt">USD</span>').appendTo($(cs[1]));

                    $(cs[2]).empty();
                    $('<input class="w60 ipt-s1" type="text" name="minOrderNum" value="' + formdata.minOrderNum['default'] + '">').appendTo($(cs[2]));
                    var _df = $('<div></div>').appendTo($(cs[2]));
                    var s1 = new Can.ui.DropDownField({
                        name:'minOrderUnit',
                        blankText:Can.msg.MODULE.SHOWROOM_SET.SELECT_BLANK_TXT,
                        width:40,
                        valueItems:me.unitVal_list,
                        labelItems:me.unitTxt_list
                    });
                    s1.setValue(formdata.minOrderUnit['default']);
                    s1.applyTo(_df);
                    $(cs[3]).empty();
                    $(cs[3]).removeAttr("cantitle");
                    var cuts = data.majorBuyers.split(',');
                    for (var i = 0; i < 3; i++) {
                        $('<input class="w80 ipt-s1 ' + (i == 0 ? '' : 'mt6') + '" type="text" name="majorBuyer' + (i + 1) + '" value="' + (cuts[i] ? cuts[i] : '') + '">').appendTo($(cs[3]));
                    }
                    $(this).hide();
                    me.createSaveBtn();
                });
            }
        } else {
            var noData = $('<div class="data-none">' +
                '<p class="txt2"> ' + Can.msg.MODULE.SHOWROOM_SET.NOT_PRODUCT_RECORD + ' </p>' +
                '</div>').appendTo(me.container);
            var but = $('<a href="javascript:;" class="btn btn-s10">' + Can.msg.MODULE.SHOWROOM_SET.ADD_NOW + '</a>');
            but.appendTo(noData);
            but.click(function () {
                me.createAddRow();
                $(this).parent().remove()
            })
        }

    },
    createHD:function () {
        if (!this.hasCreateHD) {
            var me = this,
                hdCon = $('<div class="hd"></div>').appendTo(me.container);
            $('<div class="v210">' + Can.msg.MODULE.SHOWROOM_SET.SALE_PRODUCT_NAME + '</div>').appendTo(hdCon);
            $('<div class="v130">' + Can.msg.MODULE.SHOWROOM_SET.SALE_YEAR_AMOUNT + '</div>').appendTo(hdCon);
            $('<div class="v180">' + Can.msg.MODULE.SHOWROOM_SET.SALE_MIN_ORDER + '</div>').appendTo(hdCon);
            $('<div class="v130">' + Can.msg.MODULE.SHOWROOM_SET.SALE_MAIN_CUSTOMER + '</div>').appendTo(hdCon);
            me.hasCreateHD = true;
        }
    },
    createAddRow:function () {
        var me = this,
            rowEl = $('<div class="row-s2" role="row"></div>').appendTo(me.container),
            td1El = $('<div class="v210"></div>').appendTo(rowEl),
            td2El = $('<div class="v130"></div>').appendTo(rowEl),
            td3El = $('<div class="v180"></div>').appendTo(rowEl),
            td4El = $('<div class="v130"></div>').appendTo(rowEl),
            addBtn = $('<a class="btn-add" href="javascript:;"></a>').appendTo(rowEl),
            tip = $('<div class="num-tips-red tip"></div>').appendTo(rowEl),
            random = (new Date()).getTime().toString(),
            testStr = random.substring(8, random.length);
        me.listItem.push(rowEl);
        if (me.hasCreateSaveBtn) {
            rowEl.insertBefore(me.saveBtnCon);
            me.saveBtnCon.show();
        }
        else {
            rowEl.appendTo(me.container);
        }
        rowEl.data({obj:null});
        me.bindRowHover(rowEl);
        $('<input name="hotSalesId" type="hidden" value="">').appendTo(td1El);
        $('<input class="w140 ipt-s1" type="text" name="productName" value="">').appendTo(td1El);
        $('<input class="w60 ipt-s1" type="text" name="annualSales" value="">').appendTo(td2El);
        $('<span class="r-txt">USD</span>').appendTo(td2El);
        $('<input class="w60 ipt-s1" type="text" name="minOrderNum" value="">').appendTo(td3El);
        var _scon = $('<div></div>').appendTo(td3El);
//        var val_item=[],lab_item=[];

        var s1 = new Can.ui.DropDownField({
            name:"minOrderUnit",
            blankText:Can.msg.MODULE.SHOWROOM_SET.SELECT_BLANK_TXT,
            width:40,
            valueItems:me.unitVal_list,
            labelItems:me.unitTxt_list
        });

        s1.applyTo(_scon);
        for (var i = 0; i < 3; i++) {
            $('<input class="w80 ipt-s1 ' + (i == 0 ? '' : 'mt6') + '" type="text" name="majorBuyer' + (i + 1) + '" value="">').appendTo(td4El);
        }
        addBtn.click(function () {
            me.createAddRow();
        });
        me.bindRowHover(rowEl);
        me.createSaveBtn();
    }
});
