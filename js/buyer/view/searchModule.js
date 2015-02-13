/**
 * 采购商搜索模块
 * @Author: lvjw
 * @Update: 2013-08-16
 */

(function () {
    'use strict';

    /**
     * 渲染搜索栏发布需求按钮
     * @param toolbarPanel
     */
    var initSearchResultPbl = function(toolbarPanel) {
        var postBuyingLeadSep = $('<span class="post-buying-lead-sep"></span>');
        var postBuyingLeadImg = $('<span class="post-buying-lead-img"></span>');
        var postBuyingLeadBtn = new Can.ui.toolbar.Button({
            cssName: 'post-buying-lead',
            text: Can.msg.MODULE.SEARCH.LEAD_EXPRESS
        });
        postBuyingLeadBtn.on('onclick', function() {
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

        $tipsWrap.find('.tipAction').on('click', function() {
            if ($.cookie('leadexpress-tip-clicked') != 1) {
                $.cookie('leadexpress-tip-clicked', 1, {expires: 9999, path: '/'});
            }
            $tips.hide();
        });

        // 如cookie不存在点击记录，默认显示
        if ($.cookie('leadexpress-tip-clicked') != 1) {
            $tips.show();
        }
    };

    /**
     * 搜索首页
     * @Author: lvjw
     * @update: 2013-08-19
     */
    Can.module.SearchModule = Can.extend(Can.module.BaseModule, {
        id: 'advanceSearchModuleId',
        title: Can.msg.MODULE.SEARCH.TITLE,
        actionJs: ['js/buyer/action/searchAction.js'],
        requireUiJs: ['js/utils/cateSelectorView.js'],
        constructor: function(jCfg) {
            Can.apply(this, jCfg || {});
            Can.module.SearchModule.superclass.constructor.call(this);
        },
        startup: function() {
            var that = this;
            Can.module.SearchModule.superclass.startup.call(this);
            that.contentEl.css('height', $(document).height() * 0.55);

            // 搜索类型下拉选择框
            this.searchSel = new Can.ui.DropDownField({
                name: 'selectType',
                cssName: 'drop fuck-xhd',
                blankText: Can.msg.MODULE.SEARCH.SEARCH_NORMAL,
                labelItems: Can.msg.MODULE.SEARCH.SEARCH_SELECT,
                valueItems: [ 'Product', 'Supplier' ]
            });

            // 默认搜索产品
            this.searchSel.setValue('Product');
            this.searchSel.triggerEL.addClass('arrow');
            this.searchSel.on('onselected', function () {
                that.searchIpt.autoComplete = this.value === 'Product';
            });

            // 搜索输入框
            this.searchKeywordWp = new Can.ui.Panel({
                cssName: 'search-keyword-wrap'
            });
            this.searchIpt = new Can.ui.TextField({
                id: null,
                name: 'keyword',
                cssName: 'foucs-box',
                width: null,
                blankText: Can.msg.BUYER.INDEX.SEARCH_PLD,
                autoComplete: true,
                autoCompleteURL: Can.util.Config.buyer.searchModule.candidateWord + '?searchType=2'
            });
            this.searchIpt.input.data('submit', function () {
                that.searchBtn.el.click();
            });
            this.searchKeywordError = new Can.ui.Panel({
                cssName: 'error-msg',
                html: Can.msg.MODULE.SEARCH.KEYWORD_ERROR_INFO
            });
            this.searchIpt.input.keyup(function(event) {
                if (event.keyCode != 13) {
                    that.searchKeywordWp.el.removeClass('el-error');
                    that.searchKeywordError.el.hide();
                }
            });
            this.searchKeywordWp.addItem(this.searchIpt);
            this.searchKeywordWp.addItem(this.searchKeywordError);

            // 搜索按钮
            this.searchBtn = new Can.ui.toolbar.Button({
                cssName: 'btn-search',
                text: Can.msg.BUTTON.SEARCH_BTN
            });
            this.searchBtn.el.attr('role', 'search');

            // 构建搜索栏
            this.searchBar = new Can.ui.Panel({
                cssName: 'ind-search search-s4 clear',
                wrapEL: 'form'
            });
            this.searchBar.addItem(this.searchSel);
            this.searchBar.addItem(this.searchKeywordWp);
            this.searchBar.addItem(this.searchBtn);
            initSearchResultPbl(this.searchBar);

            var search = new Can.ui.Panel({
                cssName: 'search mod-filter',
                items: [this.searchBar]
            });
            search.applyTo(this.contentEl);
            this.bindEvent();
        },

        bindEvent: function() {
            var that = this;

            // Enter键搜索
            that.contentEl.delegate('input', 'keypress', function(event) {
                if (event.keyCode === 13) {
                    that.contentEl.find('.btn-search:visible').trigger('click');
                    event.preventDefault();
                }
            });
        },
        routeMark: function(sId) {
            Can.Route.mark(sId);
        }
    });

    /**
     * 搜索结果父类
     * @Author: lvjw
     * @update: 2013-08-19
     */
    Can.module.SearchResultModule = Can.extend(Can.module.BaseModule, {
        title: Can.msg.MODULE.SEARCH.TITLE,
        searchCateUrl: '', // 设置搜索url
        items: null,
        listItemContainerCss: '',
        totalCountTypeInfo: '',
        constructor: function(cfg) {
            Can.apply(this, cfg || {});
            Can.module.SearchResultModule.superclass.constructor.call(this);
            this.items = new Can.util.ArrayMap();
            this.addEvents('onsearchbtnclick', 'onmorebtnclick', 'onfavclick');
        },

        /**
         * 获取搜索下拉选择框
         * @return {Can.ui.DropDownField}
         * @private
         */
        __getSearchCategory: function() {
            var that = this;
            var categoryField = new Can.ui.DropDownField({
                id: 'categoryFieldId',
                name: 'selectType',
                blankText: Can.msg.MODULE.SEARCH.SEARCH_NORMAL,
                value: 'Product',
                valueItems: [ 'Product', 'Supplier' ],
                labelItems: Can.msg.MODULE.SEARCH.SEARCH_SELECT
            });
            categoryField.on('onselected', function() {
                if (this.value === 'Product') {
                    that.searchKeyword.autoComplete = true;
                } else {
                    that.searchKeyword.autoComplete = false;
                }
            });
            return categoryField;
        },

        /**
         * 获取搜索关键词
         * @param searchBtn
         * @return {Can.ui.TextField}
         * @private
         */
        __getSearchKeyword: function(searchBtn) {
            var that = this;
            var searchKeyword = new Can.ui.TextField({
                name: 'keyword',
                value: '',
                width: 550,
                autoComplete: false,
                autoCompleteURL: Can.util.Config.buyer.searchModule.candidateWord + '?searchType=2'
            });
            searchKeyword.input.data('submit', function() {
                searchBtn.el.click();
            });
            searchKeyword.input.keypress(function (e) {
                if (e.keyCode === 13) {
                    searchBtn.el.click();
                    e.preventDefault();
                } else {
                    that.searchKeywordWp.el.removeClass('el-error');
                    that.searchKeywordError.el.hide();
                }
            });
            return searchKeyword;
        },

        /**
         * 渲染搜索栏发布需求按钮
         */
        initSearchResultPbl: initSearchResultPbl,

        /**
         * 渲染搜索工具条
         * @param toolbarPanel
         */
        initSearchToolbar: function(toolbarPanel) {
            this.categoryField = this.__getSearchCategory();
            this.searchBtn = new Can.ui.toolbar.Button({text: Can.msg.BUTTON.SEARCH_BTN, cssName: 'btn btn-s11'});

            this.searchKeyword = this.__getSearchKeyword(this.searchBtn);
            this.searchKeywordWp = new Can.ui.Panel({
                cssName: 'search-keyword-wrap'
            });
            this.searchKeywordError = new Can.ui.Panel({
                cssName: 'error-msg',
                html: Can.msg.MODULE.SEARCH.KEYWORD_ERROR_INFO
            });
            this.searchKeywordWp.addItem(this.searchKeyword);
            this.searchKeywordWp.addItem(this.searchKeywordError);

            this.toolbarPanel.addItem(this.categoryField);
            this.toolbarPanel.addItem(this.searchKeywordWp);
            this.toolbarPanel.addItem(this.searchBtn);
            this.initSearchResultPbl(toolbarPanel);

            var that = this;
            this.searchBtn.click(function(event) {
                if (that.node.category) {
                    that.node.category.val('');
                }
                that.searchKeyword.toggleHelper(false);
                that.fireEvent('onsearchbtnclick', this.searchBtn);
            });
        },

        /**
         * 获取搜索提示
         * @return {*|jQuery|HTMLElement}
         */
        getSearchTip: function() {
            var searchTip = $('<div class="tips-s3 clear"><span class="ico"></span><p class="des">' +
                Can.msg.MODULE.SEARCH.TIP.replace('[@]', '<a href="javascript:;" role="view-my-preference" class="link-to">' +
                    Can.msg.MODULE.SEARCH.VIEW_MY_PREFERENCE + '</a>') + '</p></div>');
            return searchTip;
        },

        /**
         * 渲染底部发布需求按钮
         * @param contentEl
         */
        initBottomSearchResultPbl: function(contentEl) {
            var searchResultPbl = $('<div class="search-result-pbl"><span class="img"></span></span><span style="color: #E04D2C;">'
                + Can.msg.MODULE.SEARCH.SEARCH_RESULT_PBL_ORANGE + ' </span>'
                + Can.msg.MODULE.SEARCH.SEARCH_RESULT_PBL_BLACK + '</div>');
            var searchResultPblBtn = new Can.ui.toolbar.Button({
                cssName: 'btn btn-s11',
                text: Can.msg.POST_BUYING_LEAD.TITLE
            });
            searchResultPblBtn.click(function () {
                $('#pbuyerleadBtnId').trigger('click');
            });
            searchResultPblBtn.el.appendTo(searchResultPbl);
            searchResultPbl.insertAfter(contentEl);
        },

        /**
         * 渲染排序选项
         * @param sortByField
         */
        initSortbyOption: function(sortByField) {
            var that = this;
            $('<label class="col">' + Can.msg.MODULE.SEARCH.SORT_BY + '</label>').appendTo(sortByField);
            this.node.exhCheckbox = $('<input type="checkbox" class="exh-checkbox" value="" />').appendTo(sortByField);
            this.node.exhCheckbox.on('click', function() {
                if ($(this).attr('checked') === 'checked') {
                    that.node.isCantonfairValueItem.val(that.node.exhSelect.getValue());
                } else {
                    that.node.isCantonfairValueItem.val('');
                }

                that.searchKeyword.toggleHelper(false);
                that.fireEvent('onsearchbtnclick', that.searchBtn);
            });

            var exhContent = '<span class="exhibitor"></span><span>' + Can.msg.MODULE.SEARCH.EXHIBITOR + '</span>';
            var nonExhContent =  '<span class="non-exhibitor"></span><span>' + Can.msg.MODULE.SEARCH.NON_EXHIBITOR + '</span>';

            // 下拉选择框
            this.node.exhSelect = new Can.ui.DisplayHtmlDropDownField({
                cssName: 'drop fuck-xhd',
                width: 140,
                blankText: exhContent,
                labelItems: [ exhContent, nonExhContent ],
                valueItems: [ 1, 0 ]
            });
            this.node.exhSelect.on('onselected', function() {
                that.node.exhCheckbox.attr('checked', true);
                if (that.node.exhCheckbox.attr('checked') === 'checked') {
                    that.node.isCantonfairValueItem.val(this.value);
                }

                that.searchKeyword.toggleHelper(false);
                that.fireEvent('onsearchbtnclick', that.searchBtn);
            });
            this.node.exhSelect.applyTo(sortByField);
            this.node.isCantonfairValueItem = $('<input name="isCantonfair" type="hidden" value="" />').appendTo(sortByField);

            // 展会届数过滤
            var $exhibitNumField = $('<div class="exhibit-num-field"></div>').appendTo(sortByField);
            this.node.exhibitNumCheckbox = $('<input id="exhibitNum" name="exhibitNum" type="checkbox" value="116" role="exhibit-num-search" />').appendTo($exhibitNumField);
            $('<label for="exhibitNum"><span class="exhibit-num-img"></span><span class="exhibit-num-text">116<sup>th</sup>'
                + Can.msg.MODULE.SEARCH.EXHIBITOR_NO + '</span></label>').appendTo($exhibitNumField);

            this.node.narrowDownCheckbox = $('<input id="search-narrow-down" name="from" type="checkbox" class="exh-checkbox" value="1" />'
                + '<label class="narrow-down-info" for="search-narrow-down">' + Can.msg.MODULE.SEARCH.NARROW_DOWN_INFO + '</label>');
            this.node.narrowDownCheckbox.on('change', function() {
                that.searchKeyword.toggleHelper(false);
                that.fireEvent('onsearchbtnclick', that.searchBtn);
            });
            this.node.narrowDownCheckbox.appendTo(sortByField);
        },

        /**
         * 渲染排序及快速翻页
         */
        initSortby: function() {
            var sortByField = $('<div class="sort-by search-s3"></div>');
            this.node.fixedField.append(sortByField);

            // 渲染排序参数
            this.initSortbyOption(sortByField);

            // 快速翻页
            var quickPager = $([
                '<span class="page">',
                '<a title="' + 'Next' + '" class="sort-btn-next" href="javascript:;" role="quick-pager" data-turn="next">'
                    + '<span class="btn-next-img"></span><span class="btn-next-text">' + Can.msg.MODULE.SEARCH.NEXT + '</span></a>',
                '<span class="sep"></span>',
                '<a title="' + 'Prev' + '" class="sort-btn-prev" href="javascript:;" role="quick-pager" data-turn="prev">'
                    + '<span class="btn-prev-text">' + Can.msg.MODULE.SEARCH.PREV + '</span><span class="btn-prev-img"></span></a>',
                '</span>'
            ].join(''));
            this.node.prev = quickPager.find('.sort-btn-prev');
            this.node.next = quickPager.find('.sort-btn-next');
            quickPager.appendTo(sortByField);
        },

        /**
         * 设置快速翻页状态
         * @param data
         */
        updateQuickPager: function(data) {
            var prevClass = 'sort-btn-prev',
                nextClass = 'sort-btn-next',
                nodes = this.node,
                page = nodes.page,
                current = data.page,
                max = Math.ceil(data.total / data.pageSize) || 0;

            this.page = {
                min: 0,
                max: max
            };
            if (current <= 1) {
                page.val(1);
                prevClass += ' dis';
            }
            if (current >= max) {
                page.val(max);
                nextClass += ' dis';
            }
            nodes.prev.attr('class', prevClass);
            nodes.next.attr('class', nextClass);
        },

        /**
         * 清空面包屑
         */
        cleanBreadcrumb: function() {
            this.node.breadcrumb.html("");
        },

        /**
         * 面包屑首页点击响应事件
         * @param that
         * @param item
         */
        clickHomeItem: function(that, item) {
            that.categoryField.selectValue(0);
            that.searchKeyword.setValue('');
            that.node.page.val('');
            that.node.category.val('');
            that.node.isCantonfairValueItem.val('');
            that.node.narrowDownCheckbox.removeAttr('checked');
            that.load(Can.util.Config.buyer.searchModule.dosearchproduct, that.node.filter.serialize(), '');

            var productModule = Can.Application.getModule('prdSearchModuleId');
            if (!productModule) {
                productModule = new Can.module.PrdSearchModule();
                Can.Application.putModule(productModule);
                productModule.start();
            }
            productModule.show();
            productModule.load(Can.util.Config.buyer.searchModule.dosearchproduct, that.node.filter.serialize(), '');
        },

        /**
         * 渲染面包屑
         */
        initBreadcrumb: function(data) {
            var that = this;
            that.cleanBreadcrumb();

            // 首页
            var homeItem = $('<a class="path-name" href="javascript:;">' + Can.msg.MODULE.SEARCH.HOME + '</a>').appendTo(this.node.breadcrumb);
            homeItem.on('click', function() {
                that.clickHomeItem(that, this);
            });

            // 分类路径
            if (data.categoryList) {
                $(data.categoryList).each(function(index, item) {
                    var name;
                    if (Can.util.Config.lang === 'en') {
                        name = item.categoryEname;
                    } else {
                        name = item.categoryName;
                    }

                    $('<span class="path-sep">></span>').appendTo(that.node.breadcrumb);
                    var item = $('<a class="path-name" href="javascript:;" data-value="' + item.categoryId + '" data-name="' + name
                        + '" role="filter"><span>' + name + '</span></a>');
                    item.appendTo(that.node.breadcrumb);
                });
            }

            // 当面包屑过长时，限制每个路径的长度
            if (this.node.breadcrumb.width() > this.node.breadcrumb.parent().width() * 0.7) {
                this.node.breadcrumb.find('span').each(function(index, item) {
                    if ($(item).width() > 135) {
                        $(item).css('width', '135px');
                        $(item).on("hover", function() {
                            var $this = $(this);
                            $this.attr('cantitle', 'up:' + $this.text());
                        });
                    };
                });
            }

            that.showTotalCount(data.totalCount);
        },

        /**
         * 在面包屑显示记录数
         */
        showTotalCount: function(totalCount) {
            var that = this;
            if (that.searchKeyword.getValue() != "") {
                $('<span class="path-sep">></span>').appendTo(that.node.breadcrumb);
                $('<span class="path-totalcount">"' + that.searchKeyword.getValue() + '" <span class="num">' + totalCount +
                    '</span> ' + that.totalCountTypeInfo + '</span>').appendTo(that.node.breadcrumb);
            } else {
                $('<span class="path-sep">></span>').appendTo(that.node.breadcrumb);
                $('<span class="path-totalcount"> <span class="num">' + totalCount +
                    '</span> ' + that.totalCountTypeInfo + '</span>').appendTo(that.node.breadcrumb);
            }
        },

        /**
         * 初始化公司类型搜索
         */
        initSearchCompanyType: function() {
            var content = new Array();
            content.push('<div class="field clear">');
            content.push('<label class="col">' + Can.msg.MODULE.SEARCH.COMPANY_TYPE + ':</label>');
            content.push('<div class="el">');

            var aCompanyType = [
                ['company-type-manufacturer', '201001', Can.msg.MODULE.SEARCH.MANUFACTURER],
                ['company-type-trading', '201002', Can.msg.MODULE.SEARCH.TRADING_COMPANY],
                ['company-type-mt', '201003', Can.msg.MODULE.SEARCH.MANUFACTURE_TRADE_COMPANY],
                ['company-type-others', '201999', Can.msg.MODULE.SEARCH.OTHER]
            ];
            $(aCompanyType).each(function(index, item) {
                content.push('<div class="item-checkbox">');
                content.push('<input type="checkbox" id="' + item[0] + '" name="companyType" value="' + item[1] + '" role="company-type-search" />');
                content.push('<label for="' + item[0] + '">' + item[2] + '</label>');
                content.push('</div>');
            });

            content.push('</div>');
            content.push('</div>');
            $(content.join('')).appendTo(this.searchCompanyTypeEl);
        },

        /**
         * 初始化地区搜索
         */
        initSearchRegion: function() {
            var content = new Array();
            content.push('<div class="field clear">');
            content.push('<label class="col">' + Can.msg.MODULE.SEARCH.REGION + ':</label>');
            content.push('<div class="el region-search">');

            content.push('<div class="add-area-item" role="add-area-search">');
            content.push('<a href="javascript:;"></a><span>' + Can.msg.MODULE.SEARCH.ADD_MORE_REGION + '</span>');
            content.push('<div class="china-map">');
            content.push('<div class="china-map1"></div>');
            content.push('<div class="south-china south-china1" role="south-china-search"></div>');
            content.push('<div class="south-china south-china2" role="south-china-search"></div>');
            content.push('<div class="east-china" role="east-china-search"></div>');
            content.push('<div class="central-china" role="central-china-search"></div>');
            content.push('<div class="north-china" role="north-china-search"></div>');
            content.push('<div class="west-china" role="west-china-search"></div>');
            content.push('<div class="fixed"></div>');
            content.push('</div>');
            content.push('</div>')

            content.push('</div>');
            content.push('</div>');
            $(content.join('')).appendTo(this.searchRegionEl);
        },

        startup: function() {
            var that = this;
            Can.module.SearchResultModule.superclass.startup.call(this);

            // 需固定区域
            var fixedField = $('<div></div>');

            var filter = $('<form ></form>')
                , pageField = $('<input type="hidden" name="page" value="1" />')
                , searchTip = this.getSearchTip();
            pageField.appendTo(filter);
            filter.appendTo(this.contentEl);

            this.node = {
                filter: filter,
                page: pageField,
                tip: searchTip,
                fixedField: fixedField
            };
            this.xhr = {
                abort: function() {
                }
            };

            // 初始化搜索条
            this.toolbarPanel = new Can.ui.Panel({
                id: 'toolbarSellerListToolbarPanelId', wrapEL: 'div', cssName: 'mod-filter clear search-result'
            });
            this.toolbarPanel.applyTo(this.node.fixedField);
            this.initSearchToolbar(this.toolbarPanel);

            // 初始化分类搜索
            var tabContainerEl = new Can.ui.Panel({wrapEL: 'div', cssName: 'srh-cate'});
            tabContainerEl.applyTo(this.node.fixedField);
            var tabHeadEl = $('<div class="hd clear"></div>').appendTo(tabContainerEl.getDom());
            var ul = $('<ul class="tab-s3 search-type-tab"></ul>').appendTo(tabHeadEl);
            this.node.breadcrumb = $('<div class="sorts-breadcrumb"></div>').appendTo(tabHeadEl);
            this.pTab = $('<li><a href="javascript:;">' + Can.msg.PRODUCT_LABEL + '</a><div class="underline"></div><div class="arrow"></div></li>').appendTo(ul);
            this.sTab = $('<li><a href="javascript:;">' + Can.msg.SUPPLIER_LABEL + '</a><div class="underline"></div><div class="arrow"></div></li>').appendTo(ul);
            var bdEl = $('<div class="bd"></div>').appendTo(tabContainerEl.getDom());
            this.node.bdEl = bdEl;
            this.searchConditionContainerEl = $('<div class="prop-item"></div>').appendTo(bdEl);

            // 初始化排序
            this.initSortby();
            this.node.fixedField.appendTo(this.node.filter);

            // 初始化列表
            this.initList();

            // 初始化底部发布需求按钮
            this.initBottomSearchResultPbl(this.contentEl);
        },

        /**
         * 初始化列表
         */
        initList: function() {
            this.listPanel = $('<div class="supplier-list"></div>').appendTo(this.contentEl);
            this.listContainer = $('<ul class="' + this.listItemContainerCss + '"></ul>');
            this.listContainer.appendTo(this.listPanel);
            this.pager = new Can.ui.limitButton({
                cssName: 'ui-page fr',
                showTotal: true,
                total: 0,
                limit: 0
            });
            this.pager.el.appendTo(this.listPanel);
        },

        getCheckedSourceType: function (params) {
            var i, kv
                , pairs = params.split('&')
                , checked = {};

            var aCompanyType = new Array();
            var aRegion = new Array();
            for (i = 0; i < pairs.length; i++) {
                kv = pairs[i].split('=');
                if (kv[0] === 'isCantonfair' && kv[1] != '') {
                    checked[kv[0]] = true;
                }
                if (kv[0] === 'from' && kv[1] === '1') {
                    checked[kv[0]] = true;
                }
                if (kv[0] === 'exhibitNum' && kv[1] != '') {
                    checked[kv[0]] = true;
                }
                if (kv[0] === 'companyType' && kv[1] != '') {
                    aCompanyType.push(kv[1]);
                }
                if (kv[0] === 'districtArea' && kv[1] != '') {
                    aRegion.push(kv[1]);
                }
            }

            // 已选择公司类型
            if (aCompanyType.length > 0) {
                checked['companyType'] = aCompanyType;
            }

            // 已选择地区
            if (aRegion.length > 0) {
                checked['districtArea'] = aRegion;
            }

            return checked;
        },

        /**
         * 创建列表的每一个item
         */
        createListItem: Can.emptyFn,

        showLoading: function() {
            this.loadObj = $('<div class="loading"><span></span>' + Can.msg.LOADING + '</div>');
            this.listContainer.html(this.loadObj);
            this.contentEl.find('.srh-cate, .sort-by').show();
        },
        hideLoading: function() {
            if (this.loadObj != undefined) {
                this.loadObj.hide();
            }
        },

        /**
         * 地区名称
         * @type {{218010: string, 218020: string, 218030: string, 218040: string, 218050: string}}
         */
        areaName: {
            '218010': Can.msg.MODULE.SEARCH.EAST_CHINA,
            '218020': Can.msg.MODULE.SEARCH.SOUTH_CHINA,
            '218030': Can.msg.MODULE.SEARCH.WEST_CHINA,
            '218040': Can.msg.MODULE.SEARCH.NORTH_CHINA,
            '218050': Can.msg.MODULE.SEARCH.CENTRAL_CHINA
        },

        /**
         * 选择地图
         * @param name 地区名称
         * @param value 地区编码
         * @param that 当前页面对象
         * @param noSearch 是否搜索
         */
        formatMapItem: function(name, value, that, noSearch) {
            $('.region-search .china-map').hide('slow', function() {
                var $addAreaItem = $('.region-search .add-area-item');
                var $existedItem = $('.region-search input[value="' + value + '"]');

                if ($existedItem.length === 0) {
                    var $item = $('<div class="area-item"><a href="javascript:;"></a><span>' + name + '</span><input type="hidden" name="districtArea" value="'
                        + value + '" /></div>').insertBefore($addAreaItem);
                    $item.find('a').click(function() {
                        $item.remove();
                        that.load(Can.util.Config.buyer.searchModule.dosearchsupplies, that.node.filter.serialize(), that.searchKeyword.getValue());
                    });
                    if (!noSearch) {
                        that.load(Can.util.Config.buyer.searchModule.dosearchsupplies, that.node.filter.serialize(), that.searchKeyword.getValue());
                    }
                }
            });
        },

        /**
         * 渲染分类内容
         * @param data
         * @param checkedSourceType
         * @param paramsUnserialize
         */
        paintFilter: function(data, checkedSourceType, paramsUnserialize) {
            var i, item, hook, filter, value, checked,
                categoryRaw = data.category || [],
                categorys = '',
                sources = '',
                sourceRaw = data.source || [],
                that = this;

            var numPerLine = 3;
            for (i = 0; i < categoryRaw.length; i++) {
                item = categoryRaw[i];
                hook = 'category-label-' + i;
                if (i % numPerLine === 0) {
                    // 默认只显示一行
                    if (i >= numPerLine) {
                        categorys += '<div class="line hidden">';
                    } else {
                        categorys += '<div class="line">';
                    }
                }
                categorys += [
                    '<a href="javascript:;" data-value="' + item.code + '" data-name="' + item.name + '" role="filter"><span class="category-name">'
                        + item.name + '</span><span class="category-count">(' + item.count + ')</span></a>'
                ].join('');

                // 增加more按钮
                if (i === numPerLine - 1 && categoryRaw.length > numPerLine) {
                    categorys += '<a href="javascript:;" style="float: right;width: 60px;font-weight: bold;" role="show-sorts">' + Can.msg.MODULE.SEARCH.SORTS_MORE + '<span class="sorts-img"></span></a>';
                }

                if (i % numPerLine === numPerLine - 1) {
                    categorys += '</div>';
                }
            }
            if (i < categoryRaw.length && i % numPerLine !== numPerLine - 1) {
                categorys += '</div>';
            }

            // 选中广交会参展商过滤
            if (checkedSourceType.isCantonfair) {
                that.node.exhCheckbox.attr('checked', true);
                that.node.exhSelect.setValue(paramsUnserialize.isCantonfair);
                that.node.isCantonfairValueItem.val(paramsUnserialize.isCantonfair);
            } else {
                that.node.exhCheckbox.removeAttr('checked');
                that.node.exhSelect.setValue(1);
                that.node.isCantonfairValueItem.val('');
            }

            // 选中按采购偏好缩小搜索范围
            if (checkedSourceType.from) {
                that.node.narrowDownCheckbox.attr('checked', true);
            } else {
                that.node.narrowDownCheckbox.removeAttr('checked');
            }

            // 选中参加当前届展会
            if (checkedSourceType.exhibitNum) {
                that.node.exhibitNumCheckbox.attr('checked', true);
            } else {
                that.node.exhibitNumCheckbox.removeAttr('checked');
            }

            // 选中公司类型
            $('.prop-item input[role="company-type-search"]').prop('checked', false);
            if (checkedSourceType.companyType) {
                var aCompanyType = checkedSourceType.companyType;
                $(aCompanyType).each(function(index, companyTypeItem) {
                    $('.prop-item input[value="' + companyTypeItem + '"]').prop('checked', true);
                });
            }

            // 选中区域搜索
            $('.region-search .area-item').remove();
            if (checkedSourceType.districtArea) {
                $(checkedSourceType.districtArea).each(function(nIndex, sItem) {
                    that.formatMapItem(that.areaName[sItem], sItem, that, true);
                });
            }

            filter = $([
                '<div class="filed clear">',
                '<label class="col">' + Can.msg.BUYER.SEARCH.TYPE + '</label>',
                '<div class="el">',
                '<input name="categoryId" type="hidden" value="' + (paramsUnserialize.categoryId || '') + '">',
                categorys,
                '</div>',
                '</div>'
            ].join(''));
            that.searchConditionContainerEl.html(filter);
            that.node.category = filter.find('[name=categoryId]');
            that.node.isCantonfair = filter.find('[name=isCantonfair]');
        },

        /**
         * 没有搜索结果时显示逻辑
         */
        showNoSearchResult: function(jData) {
            var that = this;
            that.containerEl.find('.search-result-pbl').hide();
            that.contentEl.find('.ui-page').hide();
            that.contentEl.find('.srh-cate, .sort-by').hide();
           
            that.listContainer.html([
                '<div class="not-search-result">',
                    '<div class="tip">' ,
                        '<span class="img"></span>' ,
                        '<p class="txt2">' + Can.msg.NOT_SEARCH_RESULT + '</p>',
                        '<p class="txt3">' + Can.msg.NOT_SEARCH_SUGGEST + '</p>',
                        '<p class="txt3"><a href="javascript:;" class="btn btn-s11 back">' + Can.msg.CAN_TITLE.BACK + '</a></p>',
                    '</div>' ,
                    '<div class="pbl">' ,
                        '<div class="txt">',
                            '<p>' +  Can.msg.MODULE.SEARCH.SEARCH_NOT_RESULT_TIPS + '</p>',
                            Can.msg.MODULE.SEARCH.SEARCH_RESULT_PBL_ORANGE + Can.msg.MODULE.SEARCH.SEARCH_RESULT_PBL_BLACK  ,
                            
                        '</div>',
                        '<a class="btn btn-s11 btn-s16 post-buying-lead" href="javascript:;">' + Can.msg.POST_BUYING_LEAD.TITLE + '</a>' ,
                    '</div>',
                '</div>'
            ].join(''));

            that.listContainer.find('.back').click(function () {
                history.go(-1);
                return false;
            });
            that.updateQuickPager(jData.page);

            that.listContainer.find('.post-buying-lead').click(function () {
                Can.Route.run('/add-buyinglead');
                return false;
            });
            that.updateQuickPager(jData.page);

            // 用户没有输入关键词搜索时，显示提示
            if (that.searchKeyword.getValue() === '') {
                that.node.filter.append(that.node.tip);
            } else {
                that.node.tip.remove();
            }

            // 设置搜索栏默认定位
            var fixedField = that.node.fixedField;
            fixedField.css('position', 'static');
            that.node.filter.find('.replace-field').remove();

            that.node.page.hide();
            that.hideLoading();
        },

        /*
        * 设置skype BTN*/
        randerSkypeIcon:function(i, skypeName, cfecId){
            if (skypeName) {
                Skype.ui({
                    "name" : "dropdown",
                    "element" : i,
                    "participants" : [skypeName],
                    "statusStyle" : "mediumicon",
                    "millisec" : "5000",
                    "cfecId": cfecId
                });
            }else{
                //删除空没有 SKYPE BTN 的DIV
                $("#"+i).remove()
            }
        },

        /**
         * 设置搜索栏固定定位
         * @private
         */
        __setFixed: function() {
            var fixedField = this.node.fixedField;
            if (fixedField.css("position") != "fixed") {
                fixedField.css("background-color", "white");
                fixedField.css("z-index", "300");
                fixedField.css("width", fixedField.width())

                // 设为fixed需填充原有区域
                var fillField = $('<div class="replace-field"></div>').insertAfter(fixedField);
                fillField.css('height', fixedField.height());
                fixedField.css("position", "fixed");
            }
        },

        /**
         * 屏幕向下滚动时，搜索块往上靠
         */
        bindScrollEvent: function() {
            var that = this;
            var module = $('#' + that.id);

            $(window).scroll(function() {
                if (module.css('display') != 'none') {
                    if ($(window).scrollTop() != 0) {
                        var showSorts = that.contentEl.find('[role=show-sorts]');
                        if (showSorts && showSorts.hasClass('sorts-less')) {
                            showSorts.click();
                        }

                        that.__setFixed();
                        module.find('.hd-tit').css('display', 'none');
                    } else {
                        module.find('.hd-tit').css('display', 'block');
                    }
                }
            });

            that.on('onshow', function() {
                $(document).scrollTop(0);
                that.node.fixedField.css('position', 'static');
                that.node.filter.find('.replace-field').remove();
                $('#prdSearchModuleId .hd-tit').css('display', 'block');
            });
        }
    });

    /**
     *
     * 采购商搜索产品
     * @Author: island
     * @version: v1.0
     * @since:13-02-10 下午10:05
     */
    Can.module.PrdSearchModule = Can.extend(Can.module.SearchResultModule, {
        id: 'prdSearchModuleId',
        searchCateUrl: Can.util.Config.buyer.searchModule.dosearchproduct,
        actionJs: ['js/buyer/action/prdSearchModuleAction.js'],
        listItemContainerCss: 'pro-tj',
        totalCountTypeInfo: Can.msg.MODULE.SEARCH.TOTALCOUNT_PRODUCT_INFO,
        constructor: function(cfg) {
            Can.apply(this, cfg || {});
            Can.module.PrdSearchModule.superclass.constructor.call(this);
            this.addEvents('onsuppliestabclick');
        },

        startup: function() {
            Can.module.PrdSearchModule.superclass.startup.call(this);
            this.categoryField.selectValue(0);
            var that = this;
            this.sTab.click(function () {
                that.fireEvent('onsuppliestabclick');
            });
            this.pTab.addClass('cur');
            that.bindScrollEvent();
        },

        runByRoute: function() {
            if (this._oRoutArgs.keyword) {
                this.searchKeyword.setValue(this._oRoutArgs.keyword);
            }
            this.load(this._oRoutArgs.url, JSON.parse(this._oRoutArgs.params), this._oRoutArgs.keyword);
        },

        routeMark: function() {
            if (this._oRouteData) {
                Can.Route.mark('/search-product', this._oRouteData);
            }
        },

        /**
         * 渲染产品列表
         * @param productRaw
         * @param pageRaw
         */
        __paintProductList: function(productRaw, pageRaw) {
            var i, item;
            var that = this;
            for (i = 0; i < productRaw.length; i++) {
                item = that.createListItem(productRaw[i],i);

                item.appendTo(that.listContainer);

                that.items.put(i, item);
                that.randerSkypeIcon("pro_SkypeButton"+i, productRaw[i].skype, productRaw[i].supplierInfo.supplerId);
            }

            // 更新翻页
            Can.apply(that.pager, {
                current: pageRaw.page, total: pageRaw.total, limit: pageRaw.pageSize
            });
            that.pager.refresh();
            that.updateQuickPager(pageRaw);

            that.hideLoading();
        },
        /*index:skyPe warpID,引入后skyPe补充*/
        createListItem: function (item,index) {
            var skyPeId=index>=0?"pro_SkypeButton"+(index):"pro_SkypeButton";
            var that = this,
            	domainUrl = "",
                id = item.productId,
                itemEl = $('<li class="item clear" data-room="' + Can.util.room.checkin(item) + '" role="product"></li>'),
                conInfoEl = $('<div class="con-info"></div>').appendTo(itemEl),
                modProEl = $('<div class="mod-pro"></div>').appendTo(itemEl),
                btnsEl = $('<div class="con-opt"></div>').appendTo(conInfoEl),
                inqueryBtn = $('<a class="btn btn-s12" role="inquiry" data-id="' + id + '" href="javascript:;" style="background-image:linear-gradient(#65c38f,#40a46d);color:#ffffff"></a>').appendTo(btnsEl),
                favBtn = $('<a class="bg-ico btn-fav" role="mark" data-id="' + id + '" href="javascript:;">' + Can.msg.BUTTON.FAV + '</a>').appendTo(btnsEl),
                IMBtn = $('<div id="'+skyPeId+'" class="io-skype io-skype-min"  style="width:20px; margin-left:15px;"></div>').appendTo(btnsEl),
                //productDetail = 'Can.util.Config.seller.showroom.productURL' + id;
                productDetail = '/products/' + item.productName.replace(/<([^>]*)>/g, '').replace(/[^A-Za-z0-9]/g, " ").replace(/\ +/g, "\-").toLowerCase() + '-' + id + '.html';
            IMBtn.css({
                display: 'block'
            }).data({
                    setStatus: function (status, data) {
                        if (status == 'online') {
                            IMBtn.attr('class', 'bg-ico btn-chat-online').html(Can.msg.IM.CHAT_NOW);
                            IMBtn.attr('data-dd','lkdalj');
                        } else {
                            IMBtn.attr('class', 'bg-ico btn-chat').html(Can.msg.IM.OFFLINE);
                            IMBtn.attr('data-ddss','lkdalj');
                        }
                    }
                });
            if (item.supplierInfo) {
                Can.util.bindIM.add(IMBtn, item.supplierInfo.supplerId);
            }
            var url;
            if(item.supplierInfo.suppDomain){//三级域名
            	domainUrl +="http://"+item.supplierInfo.suppDomain+".en.e-cantonfair.com";
            	url = domainUrl;
            }	
            else{
            	url = domainUrl+productDetail;
            }
            inqueryBtn.html('<i style="display:inline-block;width:16px;height:14px;position: relative;top: 3px;margin-right: 8px;background: url(/image/inquire-icon.png) 0px 0px no-repeat;"></i>' + Can.msg.BUTTON.INQUIRY);

            // supplier detail
            var _detailDiv = $('<div class="txt-info"></div>');
            _detailDiv.appendTo(conInfoEl);
            var _title = $('<h3></h3>').appendTo(_detailDiv);
            _title.html([
                '<a href="' + url + '" target="_blank" class="supplier-company-name">',
                item.supplierInfo.companyName,
                '</a>'
            ].join(''));

            // 显示参加广交会
            var mthContent = '';
            if (item.supplierInfo.cantonfairId != '') {
                mthContent = '<span class="mth" cantitle="' + Can.msg.CAN_TITLE.EXP_NUM.replace('[@]', item.supplierInfo.participation) + '">' + item.supplierInfo.participation + '</span>';
            }

            // 地区如果为空，显示China
            var location = item.supplierInfo.location;
            if (location === '') {
                location = 'China';
            }

            var _c = $('<div class="country"></div>')
                .appendTo(_detailDiv)
                .html('<span class="flags fs' + item.supplierInfo.countryId + '"></span>' +
                    '<span class="txt">' + location + '</span>' + mthContent);

            if ($.trim(item.supplierInfo.cantonfairId) != '') {
                $('<p class="txt-tit"></p>')
                    .appendTo(_detailDiv)
                    .html(Can.msg.MODULE.SEARCH.CANTON_FAIR_ID + '<em>' + item.supplierInfo.cantonfairId + '</em>');
            }
            $('<p class="txt-tit"></p>')
                .appendTo(_detailDiv)
                .html(Can.msg.MODULE.SEARCH.MAIN_PRODUCT + '<div class="detail"><em>' + item.supplierInfo.mainProduct + '</em></div>');
            $('<p class="txt-tit"></p>')
                .appendTo(_detailDiv)
                .html(Can.msg.MODULE.SEARCH.CONTACTER + '<em role="card-view" class="contactor-name">' + item.supplierInfo.supplerName + '</em>');

            // product info
            var _picEl = $('<div class="pic"></div>').appendTo(modProEl);
            var _picBtnEl = $('<a href="'+ domainUrl + productDetail + '" target="_blank">' + Can.util.formatImage(item.productImg, '120x120', '', $('<div' + item.productName + '</div>').text()) + '</a>').appendTo(_picEl);
            var _txtEl = $('<div class="txt-info-s1"></div>').appendTo(modProEl);
            var _titleCon = $('<h3></h3>').appendTo(_txtEl);
            var _titleEl = $('<a href="'+ domainUrl + productDetail + '" target="_blank"></a>').appendTo(_titleCon);
            _titleEl.html(item.productName);
            if (item.isnew == 'true') {
                $('<span class="ico-new"></span>').appendTo(_titleCon);
            }
            $('<p class="des"></p>').html(item.productIntroduction).appendTo(_txtEl);

            if (item.minorder && item.minorder.toString() != '0') {
                $('<p class="txt-tit" ></p>')
                    .appendTo(_txtEl)
                    .html(Can.msg.MODULE.SEARCH.MIN_ORDER + '<em>' + item.minorder + '</em>');
            }
            if (item.fob.indexOf('0.0/0.0') == -1) {
                $('<p class="txt-tit"></p>')
                    .appendTo(_txtEl)
                    .html(Can.msg.MODULE.SEARCH.FOB + '<em>' + item.fob + '</em>');
            }
            if ($.trim(item.paymentTems) != '') {
                $('<p class="txt-tit"></p>')
                    .appendTo(_txtEl)
                    .html(Can.msg.MODULE.SEARCH.PAYMENT + '<em>' + item.paymentTems + '</em>');
            }
            if (item.supplyAblilit && item.supplyAblilit.toString() != '0') {
                $('<p class="txt-tit"></p>')
                    .appendTo(_txtEl)
                    .html(Can.msg.MODULE.SEARCH.SUPPLY + '<em>' + item.supplyAblilit + '</em>');
            }
            return itemEl;
        },


        load: function (url, params, keyword) {
            this.cleanBreadcrumb();
            this._oRouteData = {
                url: url,
                params: JSON.stringify(params),
                keyword: keyword || ''
            };
            this.routeMark();
            this.xhr.abort();

            var that = this,
                checkedSourceType = that.getCheckedSourceType(params),
                params_unserialize = Can.util.canInterface('unserialize', [ params ]);

            that.showLoading();
            if (url == null || url == undefined)
                return;
            this.searchConditionContainerEl.html('');

            this.xhr = $.ajax({
                url: url,
                data: params,
                success: function (d) {
                    that.searchKeyword.toggleHelper(true);
                    var data;

                    if (d['status'] !== 'success') {
                        Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, d);
                        return;
                    }

                    data = d['data'];
                    that.searchKeyword.setValue(keyword);

                    if (!data || !data.itemList) {
                        that.showNoSearchResult(d);
                        return;
                    } else {
                        that.containerEl.find('.search-result-pbl').show();
                        that.contentEl.find('.ui-page').show();
                    }

                    that.paintFilter(data, checkedSourceType, params_unserialize);
                    that.__paintProductList(data.itemList, d.page);
                    that.initBreadcrumb({
                        categoryList: data.categoryList,
                        totalCount: d.page.total
                    });

                    // 用户没有输入关键词搜索时，显示提示
                    if (keyword === '') {
                        that.node.filter.append(that.node.tip);
                    } else {
                        that.node.tip.remove();
                    }
                }
            });
        }
    });

    /**
     * 采购商搜索供应商
     * @Author: lvjw
     * @update: 2013-08-20
     */
    Can.module.SupplierSearchModule = Can.extend(Can.module.SearchResultModule, {
        id: 'spSearchModuleId',
        searchCateUrl: Can.util.Config.buyer.searchModule.dosearchsupplies,
        actionJs: ['js/buyer/action/spSearchModuleAction.js'],
        listItemContainerCss: 'sup-tj',
        totalCountTypeInfo: Can.msg.MODULE.SEARCH.TOTALCOUNT_SUPPLY_INFO,
        constructor: function(cfg) {
            Can.apply(this, cfg || {});
            Can.module.SupplierSearchModule.superclass.constructor.call(this);
            this.addEvents('onprdtabclick');
        },

        startup: function() {
            Can.module.SupplierSearchModule.superclass.startup.call(this);
            var that = this;
            this.categoryField.selectValue(1);
            this.pTab.click(function() {
                that.fireEvent('onprdtabclick');
            });
            this.sTab.addClass('cur');
            that.bindScrollEvent();

            // 初始化公司类型搜索
            this.searchCompanyTypeEl = $('<div class="prop-item mar10"></div>').appendTo(this.node.bdEl);
            this.initSearchCompanyType();

            // 初始化地区搜索
            this.searchRegionEl = $('<div class="prop-item mar10"></div>').appendTo(this.node.bdEl);
            this.initSearchRegion();
        },

        runByRoute: function() {
            if (this._oRoutArgs.keyword) {
                this.searchKeyword.setValue(this._oRoutArgs.keyword);
            }
            this.load(this._oRoutArgs.url, JSON.parse(this._oRoutArgs.params), this._oRoutArgs.keyword);
        },

        routeMark: function() {
            if (this._oRouteData) {
                Can.Route.mark('/search-supplier', this._oRouteData);
            }
        },

        load: function(url, params, keyword) {
            this.cleanBreadcrumb();
            this._oRouteData = {
                url: url,
                params: JSON.stringify(params),
                keyword: keyword || ''
            };
            this.routeMark();
            this.xhr.abort();

            var that = this,
                checkedSourceType = that.getCheckedSourceType(params),
                paramsUnserialize = Can.util.canInterface('unserialize', [ params ]);

            that.showLoading();
            if (url == null || url == undefined)
                return;
            this.searchConditionContainerEl.html('');

            // print the supplier list
            var paintSupplierList = function (productRaw, pageRaw) {
                var i, item;
                for (i = 0; i < productRaw.length; i++) {
                    item = that.createListItem(productRaw[i],i);
                    item.appendTo(that.listContainer);
                    that.items.put(i, item);
                }
                // update the Pager
                Can.apply(that.pager, {
                    current: pageRaw.page, total: pageRaw.total, limit: pageRaw.pageSize
                });
                that.pager.refresh();
                that.updateQuickPager(pageRaw);
                that.hideLoading();
                for (i = 0; i < productRaw.length; i++) {
                    var _i="sup_SkypeButton"+(i+1);
                    that.randerSkypeIcon(_i,productRaw[i].skype, productRaw[i].supplerId)
                }
            };

            this.xhr = $.ajax({
                url: url,
                data: params,
                success: function (d) {
                    that.searchKeyword.toggleHelper(true);

                    var data;
                    if (d['status'] !== 'success') {
                        Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, d);
                        return;
                    }

                    that.categoryId = paramsUnserialize.categoryId;
                    data = d['data'];
                    that.searchKeyword.setValue(keyword);
                    if (!data || !data.itemList) {
                        that.showNoSearchResult(d);
                        return;
                    } else {
                        that.containerEl.find('.search-result-pbl').show();
                        that.contentEl.find('.ui-page').show();
                    }

                    that.paintFilter(data, checkedSourceType, paramsUnserialize);
                    paintSupplierList(data.itemList, d.page);
                    that.initBreadcrumb({
                        categoryList: data.categoryList,
                        totalCount: d.page.total
                    });

                    // 用户没有输入关键词搜索时，显示提示
                    if (keyword === '') {
                        that.node.filter.append(that.node.tip);
                    } else {
                        that.node.tip.remove();
                    }
                }
            });
        },

        createListItem: function(item,index) {
            //var panorama, showroomURL = Can.util.Config.seller.showroom.rootURL + item.companyId;
            var panorama, showroomURL = '/china-supplier/' + item.companyId + '.html',domainUrl="";
            if (item.companyId === '0') {
                showroomURL = '/exhibitor/' + item.corpId+'.html';
            }else if(item.suppDomain){//三级域名 
            	showroomURL ="http://"+item.suppDomain+".en.e-cantonfair.com";
            }
            
            if (item.isPanorama) {
                panorama = '<a href="' + showroomURL + '" class="ico-panorama" title="Booths Panorama" target="_blank"></a>';
            }

            // 是否是参展当前届广交会
            var aExhibitNumContent = [];
            if (item.currExhibitNum) {
                aExhibitNumContent.push('<div class="exhibit-num-field">');
                aExhibitNumContent.push('<span class="exhibit-num-img"><span>115</span></span>');
                aExhibitNumContent.push('</div>');
            }

            // 显示参加广交会
            var mthContent = '';
            if (item.cantonfairId != '') {
                mthContent = '<span class="mth" cantitle="' + Can.msg.CAN_TITLE.EXP_NUM.replace('[@]', item.participation) + '">' + item.participation + '</span>';
            }

            // 显示展会摊位号
            var boothDetailContent = new Array();
            if (!$.isEmptyObject(item.boothNos)) {

                var firstBoothNo = null;
                var boothNoContent = new Array();
                for (var boothNoKey in item.boothNos) {
                    var keyContent = Can.msg.MODULE.SEARCH.PHASE + ' ' + boothNoKey;
                    if (Can.util.Config.lang != 'en') {
                        keyContent =  boothNoKey + ' ' + Can.msg.MODULE.SEARCH.PHASE;
                    }

                    if (!firstBoothNo) {
                        firstBoothNo = '<p class="txt-tit">' + Can.msg.MODULE.SEARCH.BOOTH_NO + ':<em class="product-info" role="show-phase-info">'
                            + keyContent + ': ' + item.boothNos[boothNoKey] + '...</em></p>';
                    }
                    if (!isNaN(boothNoKey)) {
                        boothNoContent.push('<span class="detail-content-key">' + keyContent + ': </span><span class="detail-content-value">'
                            + item.boothNos[boothNoKey] + '</span>');
                    }
                }
                boothDetailContent = [
                    '<div class="booth txt-info">' + firstBoothNo + '</div>',
                    '<div class="detail-booth" role="hide-phase-info">',
                    '<div class="detail-title">'  + Can.msg.MODULE.SEARCH.BOOTH_NO + ':</div>',
                    '<div class="detail-content">',
                    boothNoContent.join(''),
                    '</div><div class="booth-fixed"></div></div>'
                ];
            }

            // 询盘按钮
            var inquiryHtml = '<a href="javascript:;" class="btn btn-s12" role="inquiry" cantitle="' + Can.msg.CAN_TITLE.INQUIRY
                + '" style="background-image:linear-gradient(#65c38f,#40a46d);color:#ffffff" ><i style="display:inline-block;width:16px;height:14px;position: relative;top: 3px;margin-right: 8px;background: url(/image/inquire-icon.png) 0px 0px no-repeat;"></i>' + Can.msg.BUTTON.INQUIRY + '</a>';
            // 收藏按钮
            var favHtml = '<a href="javascript:;" class="bg-ico btn-fav" role="mark" cantitle="' + Can.msg.CAN_TITLE.FAV + '">' + Can.msg.BUTTON.FAV + '</a>';
            // IM按钮
            var skyPeId="sup_SkypeButton"+(index+1);
            var offlineHtml ='<div id="'+skyPeId+'" class="io-skype btn-chat" style="margin-top:10px;"></div>'/* '<a href="javascript:;" class="bg-ico btn-chat" cantitle="' + Can.msg.CAN_TITLE.CHAT + '">' + Can.msg.IM.OFFLINE + '</a>'*/;
            // 产查看产品按钮
            var relatedHtml = '<a href="javascript:;" class="bg-ico btn-related" role="related">' + Can.msg.BUTTON.RELATED_PRODUCT + '</a>';
            // 名片显示
            var cardHtml = '<p class="txt-tit">' + Can.msg.MODULE.SEARCH.CONTACTER + '<em class="contactor-name" role="card-view">' + item.supplerName + '</em></p>';
            if (item.companyId === '0') {
                inquiryHtml = '<a href="' + showroomURL + '" target="_blank" class="btn btn-s12" cantitle="' + Can.msg.MODULE.SEARCH.INQUIRY_EXHIBITOR + '">' + Can.msg.MODULE.SEARCH.INQUIRY_EXHIBITOR + '</a>';
                favHtml = '';
                offlineHtml = '';
                relatedHtml = '';
                cardHtml = '';
            }

            // 地区如果为空显示China
            var location = item['location'];
            if (location === '') {
                location = 'China';
            }

            // 显示主要产品
            var mainProductHtml = '';
            var mgntHtml = '';
            if (item.mainProduct != '') {
                mainProductHtml = '<div class="main-product-info"><p class="txt-tit product-info">' + Can.msg.MODULE.SEARCH.MAIN_PRODUCT
                    + '<div class="detail"><em>' + item.mainProduct + '</em></div></p></div>';
            }
            if (item.mgtCertification) {
                mgntHtml = '<p class="txt-tit"><span class="mgnt-title">' + Can.msg.MODULE.SEARCH.MGNT + '</span><em>' + item.mgtCertification + '</em></p>';
            }

            var itemEl = $([
                '<li class="item clear" role="supplier" data-room="' + Can.util.room.checkin(item) + '">',
                '<div class="con-opt">',
                inquiryHtml, favHtml, offlineHtml, relatedHtml,
                '</div>',
                '<div class="con-pic">' + Can.util.formatImage(item.supplierPhoto, '120x70', '', $('<div' + item.companyName + '</div>').text()) + '</div>',
                '<div class="con-detail clear">',
                '<div class="txt-info it-r">',
                '<div class="country">',
                '<span class="flags fs' + item.countryId + '"></span>',
                '<span class="txt">' + location + '</span>',
                mthContent,
                '</div>',
                cardHtml,
                panorama,
                '</div>',
                '<div class="txt-info it-l">',
                '<h3><a href="'+ showroomURL + '" target="_blank">' + item.companyName + aExhibitNumContent.join('') + '</a></h3>',
                mainProductHtml,
                mgntHtml,
                boothDetailContent.join(''),
                '</div>',
                '</div>',
                '</li>'
            ].join(''));

            itemEl.find('.btn-chat').each(function () {
                var IMBtn = $(this);
                IMBtn.css({
                    display: 'block',
                    marginLeft: 0
                }).data({
                        setStatus: function(status, data) {
                            if (status == 'online') {
                                IMBtn.attr('class', 'bg-ico btn-chat-online').html(Can.msg.IM.CHAT_NOW);
                            } else {
                                IMBtn.attr('class', 'bg-ico btn-chat').html(Can.msg.IM.OFFLINE);
                            }
                        }
                    });
                Can.util.bindIM.add(IMBtn, item.supplerId);
            });

            return itemEl;
        },

        printRelatedProduct: function(data) {
            var i, item, link, name, products = '';

            if (!data || !data.length) {
                products = Can.msg.MODULE.SEARCH.NOT_RELATED;
            } else {
                for (i = 0; i < data.length; i++) {
                    item = data[i];
                    link = item.link;
                    name = item.productName;
                    products += [
                        '<li>',
                        '<a href="javascript:;" class="pic showProduct" data-ix="' + i + '">' + Can.util.formatImage(item.productImg, '80x80', '', name) + '</a>',
                        '<div class="p-info">',
                        '<p class="pro-name"><a href="javascript:;" data-ix="' + i + '" class="showProduct" title="' + name + '">' + name + '</a></p>',
                        '<p class="des" title="' + (item.description || '') + '">' + (item.description || '') + '</p>',
                        '</div>',
                        '</li>'
                    ].join('');
                }
            }

            var el = $([
                '<div class="rel-pro hide">',
                '<span class="bg-ico arrow-t"></span>',
                '<ul class="area-product">',
                products,
                '</ul>',
                '</div>'
            ].join(''));
            el.find('.showProduct').click(function () {
                var that = $(this);
                var v = data[that.attr('data-ix')];
                if (v) {
                    Can.util.canInterface('productDetail', [v.productId, v.productName, 'spSearchModuleId']);
                }
                return false;
            });
            return el;
        }
    });

})();
