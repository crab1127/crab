/**
 * 搜索产品
 * @Author: lvjw
 * @update: 2013-08-23
 */
$.moduleAndViewAction('prdSearchModuleId', function(searchProduct) {

    /**
     * 收藏按钮事件
     */
    searchProduct.contentEl.on('click', '[role=mark]', function(e) {
        var trigger = $(this);

        Can.ui.favorite({
            trigger: trigger,
            url: {
                mark: Can.util.Config.favorite.mark,
                tag: Can.util.Config.favorite.tag
            },
            data: {
                collectContentId: Can.util.room[$(this).closest('[role=product]').data('room')].productId,
                collectType: 2
            }
        });
        e.stopPropagation();
    });

    /**
     * 询盘按钮事件
     */
    searchProduct.contentEl.on('click', '[role=inquiry]', function(e) {
        var data = Can.util.room[$(this).closest('[role=product]').data('room')]
            , supplier = data.supplierInfo;
        var prd_name = $('<div>' + data.productName + '</div>').text();
        Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, {
            inquiry: [
                {
                    supplierId: supplier.supplerId,
                    supplierName: supplier.supplerName,
                    companyName: supplier.companyName,
                    products: [
                        {
                            productId: data.productId,
                            productTitle: data.productName,
                            productPhoto: data.productImg
                        }
                    ]
                }
            ]
        }, Can.msg.MESSAGE_WINDOW.INQUIRY_SUBJECT.replace('[@]', prd_name)]);
    });

    /**
     * 搜索按钮事件
     */
    searchProduct.on('onsearchbtnclick', function() {
        var secType = searchProduct.categoryField.getValue();
        var keyword = searchProduct.searchKeyword.getValue() || '';

        // 不允许空搜索
        if (keyword === '') {
            searchProduct.searchKeyword.toggleHelper(true);
            searchProduct.searchKeywordError.el.show();
            searchProduct.searchKeywordWp.el.addClass('el-error');
            return;
        }

        if (secType == "Supplier") {
            var spSearchModule = Can.Application.getModule('spSearchModuleId');
            if (!spSearchModule) {
                spSearchModule = new Can.module.SupplierSearchModule();
                Can.Application.putModule(spSearchModule);
                spSearchModule.start();
            }
            spSearchModule.categoryField.selectValue(1);
            spSearchModule.show();
            spSearchModule.load(Can.util.Config.buyer.searchModule.dosearchsupplies, searchProduct.node.filter.serialize(), keyword);
        } else {
            var prdSearchModule = Can.Application.getModule('prdSearchModuleId');
            if (!prdSearchModule) {
                prdSearchModule = new Can.module.PrdSearchModule();
                Can.Application.putModule(prdSearchModule);
                prdSearchModule.start();
            }
            prdSearchModule.categoryField.selectValue(0);
            prdSearchModule.show();
            prdSearchModule.load(Can.util.Config.buyer.searchModule.dosearchproduct, searchProduct.node.filter.serialize(), keyword);
        }
    }, searchProduct);

    /**
     * 点击供应商页面
     */
    searchProduct.on('onsuppliestabclick', function() {
        var supplierModule = Can.Application.getModule('spSearchModuleId'),
            keyword = searchProduct.searchKeyword.getValue() || '';

        // 清空分类及翻页
        searchProduct.node.category.val('');
        searchProduct.node.page.val('');

        if (!supplierModule) {
            supplierModule = new Can.module.SupplierSearchModule();
            Can.Application.putModule(supplierModule);
            supplierModule.start();
        }
        supplierModule.cleanBreadcrumb();
        supplierModule.show();
        supplierModule.categoryField.selectValue(1);
        supplierModule.load(Can.util.Config.buyer.searchModule.dosearchsupplies, searchProduct.node.filter.serialize(), keyword);

        // 是否选中参展商
        var exhCheckboxChecked = searchProduct.node.exhCheckbox.attr('checked');
        if (typeof exhCheckboxChecked != 'undefined' && exhCheckboxChecked === 'checked') {
            supplierModule.node.exhCheckbox.attr('checked', exhCheckboxChecked);
        } else {
            supplierModule.node.exhCheckbox.removeAttr('checked');
        }

        var exhSelected = searchProduct.node.exhSelect.getValue();
        supplierModule.node.exhSelect.setValue(exhSelected);

        // 是否选中采购偏好
        var narrowChecked = searchProduct.node.narrowDownCheckbox.attr('checked')
        if (typeof narrowChecked != 'undefined' && narrowChecked === 'checked') {
            supplierModule.node.narrowDownCheckbox.attr('checked', narrowChecked);
        } else {
            supplierModule.node.narrowDownCheckbox.removeAttr('checked');
        }
    });

    // filter
    searchProduct.contentEl.on('click', '[role=filter]', function(e) {
        var target, value,
            $this = $(this),
            node = searchProduct.node;

        switch ($this.attr('name')) {
            case 'isCantonfair':
                target = node.isCantonfair;
                if (this.checked) {
                    value = $this.val();
                } else {
                    value = '';
                }
                break;
            default:
                target = node.category;
                value = $this.data('value');
                break;
        }
        target.val(value);
        searchProduct.node.page.val(1);
        searchProduct.load(Can.util.Config.buyer.searchModule.dosearchproduct, searchProduct.node.filter.serialize(), searchProduct.searchKeyword.getValue());
    });

    // quick pager
    searchProduct.contentEl.on('click', '[role=quick-pager]', function(e) {
        var $this = $(this),
            pageField = searchProduct.node.page,
            offset = $this.data('turn') === 'prev' ? -1 : 1,
            max = searchProduct.page.max,
            page = pageField.val() * 1 + offset;

        if ($this.hasClass('dis')) {
            return;
        }

        if (page > max) {
            page = max;
        } else if (page < 1) {
            page = 1;
        }
        pageField.val(page);

        searchProduct.load(Can.util.Config.buyer.searchModule.dosearchproduct, searchProduct.node.filter.serialize(), searchProduct.searchKeyword.getValue());
    });

    // pager
    searchProduct.contentEl.on('click', 'li[pagenum]', function(e) {
        if (!$(this).hasClass('disable')) {
            searchProduct.node.page.val($(this).attr('pagenum'));
            searchProduct.load(Can.util.Config.buyer.searchModule.dosearchproduct, searchProduct.node.filter.serialize(), searchProduct.searchKeyword.getValue());
        }
    });

    // view Business Card
    searchProduct.contentEl.on('click', '[role=card-view]', function(e) {
        Can.util.canInterface('personProfile', [1, Can.util.room[$(this).closest('[role=product]').data('room')].supplierInfo.supplerId]);
    });

    // 收缩/展开类型
    searchProduct.contentEl.on('click', '[role=show-sorts]', function(e) {
        var $this = $(this);
        if ($this.hasClass('sorts-less')) {
            $this.html(Can.msg.MODULE.SEARCH.SORTS_MORE + '<span class="sorts-img"></span>');
            $this.removeClass('sorts-less');
            $this.parents('.prop-item').find('div.need-hidden').addClass('hidden').removeClass('need-hidden');
        } else {
            $this.html(Can.msg.MODULE.SEARCH.SORTS_LESS + '<span class="sorts-img"></span>');
            $this.addClass('sorts-less');
            $this.parents('.prop-item').find('div.hidden').addClass('need-hidden').removeClass('hidden');
        }
    });

    // viw my preference
    searchProduct.contentEl.on('click', '[role=view-my-preference]', function() {
        Can.importJS(['js/buyer/view/mySettingModule.js']);

        var mySetting = Can.Application.getModule('mySettingModuleId');
        if (!mySetting) {
            mySetting = new Can.module.mySettingModule();
            Can.Application.putModule(mySetting);
            mySetting.start();
        }

        mySetting.show();
        mySetting.goToURL(Can.util.Config.buyer.mySetting.setBusiness);

        var $Cur = $('#header .cur');
        if ($Cur) {
            $Cur.removeClass('cur');
        }
    });

    // 选择展会届数搜索
    searchProduct.contentEl.on('click', '[role=exhibit-num-search]', function() {
        searchProduct.load(Can.util.Config.buyer.searchModule.dosearchproduct, searchProduct.node.filter.serialize(), searchProduct.searchKeyword.getValue());
    });

});
