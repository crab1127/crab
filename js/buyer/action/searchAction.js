/**
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 13-3-7
 */

$.moduleAndViewAction('advanceSearchModuleId', function(advanceSearch) {

    advanceSearch.contentEl.on('click', '[role=search]', function() {
        var trigger = $(this),
            data = trigger.closest('form').serialize(),
            param_format = Can.util.canInterface('unserialize', [ data ]),
            keyword = trigger.closest('form').find('[name=keyword]').val();

        if (keyword === '') {
            advanceSearch.searchKeywordError.el.show();
            advanceSearch.searchKeywordWp.el.addClass('el-error');
            return;
        } else {
            advanceSearch.searchKeywordError.el.hide();
            advanceSearch.searchKeywordWp.el.removeClass('el-error');
        }

        if (param_format.selectType === 'Supplier') {
            // 搜供应商
            var spSearchModule = Can.Application.getModule('spSearchModuleId');
            if (!spSearchModule) {
                spSearchModule = new Can.module.SupplierSearchModule();
                Can.Application.putModule(spSearchModule);
                spSearchModule.start();
            } else {
                spSearchModule.cleanBreadcrumb();
            }
            spSearchModule.show();
            spSearchModule.load(Can.util.Config.buyer.searchModule.dosearchsupplies, data, keyword);
            spSearchModule.categoryField.selectValue(1);
        }
        else {
            // 搜产品
            var prdSearchModule = Can.Application.getModule('prdSearchModuleId');
            if (!prdSearchModule) {
                prdSearchModule = new Can.module.PrdSearchModule();
                Can.Application.putModule(prdSearchModule);
                prdSearchModule.start();
            } else {
                prdSearchModule.cleanBreadcrumb();
            }
            prdSearchModule.show();
            prdSearchModule.load(Can.util.Config.buyer.searchModule.dosearchproduct, data, keyword);
            prdSearchModule.categoryField.selectValue(0);
        }
    });

    advanceSearch.contentEl.on('click', '[name=selectType]', function() {
        var value = $(this).val();
        var nature_N_exhibitor = advanceSearch.nature_N_exhibitor;

        if (value === 'Product') {
            advanceSearch.selIndustry.valueField.data('level', 0);
            nature_N_exhibitor.slideUp().find('input').attr('disabled', 'disabled');
            advanceSearch.keywordAdv.autoComplete = true;
        }
        else {
            advanceSearch.selIndustry.valueField.data('level', 2);
            nature_N_exhibitor.slideDown().find('input').removeAttr('disabled');
            advanceSearch.keywordAdv.autoComplete = false;
        }
    });

    advanceSearch.contentEl.on('click', '[role=enable-advan-search]', function() {
        advanceSearch.searchBar.el.hide();
        advanceSearch.searchWrap.el.show();
    });

});
