/**
 * 搜索供应商
 * @Author: lvjw
 * @Update: 2013-08-25
 */
$.moduleAndViewAction('spSearchModuleId', function(searchSupplier) {

    // 收藏按钮事件
    searchSupplier.contentEl.on('click', '[role=mark]', function(e) {
        var trigger = $(this);

        Can.ui.favorite({
            trigger: trigger,
            url: {
                mark: Can.util.Config.favorite.mark,
                tag: Can.util.Config.favorite.tag
            },
            data: {
                collectContentId: Can.util.room[$(this).closest('[role=supplier]').data('room')].companyId,
                collectType: 1
            }
        });
        e.stopPropagation();
    });

    // 询盘按钮事件
    searchSupplier.contentEl.on('click', '[role=inquiry]', function(e) {
        var data = Can.util.room[$(this).closest('[role=supplier]').data('room')];

        Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, {
            inquiry: [
                {
                    supplierId: data.supplerId,
                    supplierName: data.supplerName,
                    companyId: data.companyId,
                    companyName: data.companyName
                }
            ]
        }, Can.msg.MESSAGE_WINDOW.INQUIRY_SUBJECT.replace('[@]', 'company')]);
    });

    // 相关产品按钮事件
    searchSupplier.contentEl.on('click', '[role=related]', function(e) {
        var trigger = $(this);

        if (trigger.data('isLoad')) {
            return;
        }

        trigger.toggle(function() {
            // hide
            trigger.closest('[role=supplier]')
                .find('.rel-pro').slideToggle();
        }, function() {
            // show
            trigger.closest('[role=supplier]')
                .find('.rel-pro').slideToggle();
        });

        $.ajax({
            url: Can.util.Config.buyer.searchModule.relatedProduct,
            data: {
                supplierId: Can.util.room[trigger.closest('[role=supplier]').data('room')].supplerId,
                indusId: '',
                categoryId: searchSupplier.categoryId
            },
            success: function(d) {
                trigger.data('isLoad', true);
                var related_product;

                related_product = searchSupplier.printRelatedProduct(d.data);
                related_product.appendTo(trigger.closest('[role=supplier]'));
                related_product.slideToggle();
            }
        });
    });

    /**
     * 搜索按钮事件
     */
    searchSupplier.on('onsearchbtnclick', function() {
        var secType = searchSupplier.categoryField.getValue();
        var keyword = searchSupplier.searchKeyword.getValue() || '';

        // 不允许空搜索
        if (keyword === '') {
            searchSupplier.searchKeyword.toggleHelper(true);
            searchSupplier.searchKeywordError.el.show();
            searchSupplier.searchKeywordWp.el.addClass('el-error');
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
            spSearchModule.load(Can.util.Config.buyer.searchModule.dosearchsupplies, searchSupplier.node.filter.serialize(), keyword);
        } else {
            var prdSearchModule = Can.Application.getModule('prdSearchModuleId');
            if (!prdSearchModule) {
                prdSearchModule = new Can.module.PrdSearchModule();
                Can.Application.putModule(prdSearchModule);
                prdSearchModule.start();
            }
            prdSearchModule.categoryField.selectValue(0);
            prdSearchModule.show();
            prdSearchModule.load(Can.util.Config.buyer.searchModule.dosearchproduct, searchSupplier.node.filter.serialize(), keyword);
        }
    }, searchSupplier);

    /**
     * 点击产品页面
     */
    searchSupplier.on('onprdtabclick', function() {
        var productModule = Can.Application.getModule('prdSearchModuleId'),
            keyword = searchSupplier.searchKeyword.getValue() || '';

        // 清空分类及分页
        searchSupplier.node.category.val('');
        searchSupplier.node.page.val('');

        if (!productModule) {
            productModule = new Can.module.PrdSearchModule();
            Can.Application.putModule(productModule);
            productModule.start();
        }
        productModule.cleanBreadcrumb();
        productModule.show();
        productModule.categoryField.selectValue(0);
        productModule.load(Can.util.Config.buyer.searchModule.dosearchproduct, searchSupplier.node.filter.serialize(), keyword);

        // 是否选中参展商
        var exhCheckboxChecked = searchSupplier.node.exhCheckbox.attr('checked');
        if (typeof exhCheckboxChecked != 'undefined' && exhCheckboxChecked === 'checked') {
            productModule.node.exhCheckbox.attr('checked', exhCheckboxChecked);
        } else {
            productModule.node.exhCheckbox.removeAttr('checked');
        }

        var exhSelected = searchSupplier.node.exhSelect.getValue();
        productModule.node.exhSelect.setValue(exhSelected);

        // 是否选中采购偏好
        var narrowChecked = searchSupplier.node.narrowDownCheckbox.attr('checked');
        if (typeof narrowChecked != 'undefined' && narrowChecked === 'checked') {
            productModule.node.narrowDownCheckbox.attr('checked', narrowChecked);
        } else {
            productModule.node.narrowDownCheckbox.removeAttr('checked');
        }
    });

    // 点击分类事件
    searchSupplier.contentEl.on('click', '[role=filter]', function(e) {
        var target, value,
            $this = $(this),
            node = searchSupplier.node;

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
        searchSupplier.node.page.val(1);
        searchSupplier.load(Can.util.Config.buyer.searchModule.dosearchsupplies, searchSupplier.node.filter.serialize(), searchSupplier.searchKeyword.getValue());
    });

    // pager
    searchSupplier.contentEl.on('click', 'li[pagenum]', function(e) {
        if (!$(this).hasClass('disable')) {
            searchSupplier.node.page.val($(this).attr('pagenum'));
            searchSupplier.load(Can.util.Config.buyer.searchModule.dosearchsupplies, searchSupplier.node.filter.serialize(), searchSupplier.searchKeyword.getValue());
        }
    });

    // quick pager
    searchSupplier.contentEl.on('click', '[role=quick-pager]', function(e) {
        var $this = $(this),
            pageField = searchSupplier.node.page,
            offset = $this.data('turn') === 'prev' ? -1 : 1,
            max = searchSupplier.page.max,
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

        searchSupplier.load(Can.util.Config.buyer.searchModule.dosearchsupplies, searchSupplier.node.filter.serialize(), searchSupplier.searchKeyword.getValue());
    });

    // view Business Card
    searchSupplier.contentEl.on('click', '[role=card-view]', function(e) {
        Can.util.canInterface('personProfile', [1, Can.util.room[$(this).closest('[role=supplier]').data('room')].supplerId]);
    });

    // back to all view
    searchSupplier.contentEl.on('click', '[role=back]', function(e) {
        searchSupplier.load(Can.util.Config.buyer.searchModule.dosearchsupplies, 'page=1&from=' + (searchSupplier.node.from.val() * 1 || ''));
    });

    // 收缩/展开类型
    searchSupplier.contentEl.on('click', '[role=show-sorts]', function(e) {
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
    searchSupplier.contentEl.on('click', '[role=view-my-preference]', function() {
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

    // 选择公司类型搜索
    searchSupplier.contentEl.on('click', '[role=company-type-search]', function() {
        searchSupplier.load(Can.util.Config.buyer.searchModule.dosearchsupplies, searchSupplier.node.filter.serialize(), searchSupplier.searchKeyword.getValue());
    });

    // 选择展会届数搜索
    searchSupplier.contentEl.on('click', '[role=exhibit-num-search]', function() {
        searchSupplier.load(Can.util.Config.buyer.searchModule.dosearchsupplies, searchSupplier.node.filter.serialize(), searchSupplier.searchKeyword.getValue());
    });

    /**
     * 地区编码
     * @type {{east: string, sourth: string, west: string, north: string, central: string}}
     */
    var areaCode = {
        east: '218010',
        sourth: '218020',
        west: '218030',
        north: '218040',
        central: '218050'
    };

    // 点击地图进行搜索
    searchSupplier.contentEl.on('click', '[role=add-area-search]', function() {
        $(this).find('.china-map').show('slow');
    });
    searchSupplier.contentEl.on('mouseleave', '.china-map', function() {
        $(this).hide('slow');
    });

    searchSupplier.contentEl.find('[role=south-china-search]').hover(
        function() {
            $('.china-map1').css('background-position', '-326px -1px');
        },
        function() {
            $('.china-map1').css('background-position', '0 -1px');
        }).click(function(e) {
            e.stopPropagation();
            $('.china-map').hide('slow', function() {
                var value = areaCode.sourth;
                var name = searchSupplier.areaName[value];
                searchSupplier.formatMapItem(name, value, searchSupplier, false);
            });
        });

    searchSupplier.contentEl.find('[role=east-china-search]').hover(
        function() {
            $('.china-map1').css('background-position', '-653px -1px');
        },
        function() {
            $('.china-map1').css('background-position', '0 -1px');
        }).click(function(e) {
            e.stopPropagation();
            $('.china-map').hide('slow', function() {
                var value = areaCode.east;
                var name = searchSupplier.areaName[value];
                searchSupplier.formatMapItem(name, value, searchSupplier, false);
            });
        });

    searchSupplier.contentEl.find('[role=central-china-search]').hover(
        function() {
            $('.china-map1').css('background-position', '0 -240px');
        },
        function() {
            $('.china-map1').css('background-position', '0 -1px');
        }).click(function(e) {
            e.stopPropagation();
            $('.china-map').hide('slow', function() {
                var value = areaCode.central;
                var name = searchSupplier.areaName[value];
                searchSupplier.formatMapItem(name, value, searchSupplier, false);
            });
        });

    searchSupplier.contentEl.find('[role=north-china-search]').hover(
        function() {
            $('.china-map1').css('background-position', '-325px -240px');
        },
        function() {
            $('.china-map1').css('background-position', '0 -1px');
        }).click(function(e) {
            e.stopPropagation();
            $('.china-map').hide('slow', function() {
                var value = areaCode.north;
                var name = searchSupplier.areaName[value];
                searchSupplier.formatMapItem(name, value, searchSupplier, false);
            });
        });

    searchSupplier.contentEl.find('[role=west-china-search]').hover(
        function() {
            $('.china-map1').css('background-position', '-653px -240px');
        },
        function() {
            $('.china-map1').css('background-position', '0 -1px');
        }).click(function(e) {
            e.stopPropagation();
            $('.china-map').hide('slow', function() {
                var value = areaCode.west;
                var name = searchSupplier.areaName[value];
                searchSupplier.formatMapItem(name, value, searchSupplier, false);
            });
        });

    // 显示展位信息
    searchSupplier.contentEl.on('click', '[role=show-phase-info]', function() {
        $(this).parents('.txt-info').find('.detail-booth').show();
    });
    searchSupplier.contentEl.on('mouseleave', '[role=hide-phase-info]', function() {
        $(this).parents('.txt-info').find('.detail-booth').hide();
    });

});
