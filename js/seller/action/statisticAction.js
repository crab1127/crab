/**
 * 统计分析 Action （直通车统计、交换器统计）
 * @Author: Allenice
 * @version: v1.0
 * @date: 2013-8-26
 * */

$.moduleAndViewAction("statisticsModuleId",function(module){

    // 直通车统计和交换器统计切换
    module.onCarClick(function(){
        var menu = Can.Application.getTopMenuView();
        menu.carCountBtn.el.click();
    });
    module.onExchangerClick(function(){
        var menu = Can.Application.getTopMenuView();
        menu.excCountBtn.el.click();
    });

    //
    module.onDateChange(function(){
        if(module.currentView === 'carView'){
            module.showCarView();
        }else{
            module.showExchangerView();
        }
    });

    // 鼠标进入要弹窗的td
    module.onPopEnter(function(e){
        var $popWin = module.popWin.el;
        var $td = $(e.target);

        if(e.target.tagName === 'SPAN') {
            $td = $td.parents('td');
            e.target = $td.get(0);
        }

        /*if(!$popWin.data('close') || e.target !== $popWin.data('td')){*/
            var $popSpan = $td.find('span');

            var x = $popWin.parents('.main').width() - $popWin.width()-2 - $td.width()/2 - $popSpan.width()/2 - 25;
            var y = $td.offset().top - $td.parents('table').offset().top + $td.height()/2 + 15;

            $popWin.css({left:x,top: y});
            module.popWin.$preBtn.addClass('sta-btn-disable');
            module.popWin.$nextBtn.addClass('sta-btn-disable');
            $popWin.show();
            $popWin.data('td', e.target);

            var oList = $td.data('buyerList');
            if(!oList){
                module.getBuyerData(1);
            }else{
                module.showBuyerList(oList);
            }

        /*}*/
    });

    // 关闭弹窗
    module.onPopCloseBtnClick(function(){
        module.popWin.el.hide();
       /* module.popWin.el.data('close',true).hide();
        setTimeout(function(){
            module.popWin.el.data('close',false);
        },2000);*/
    });

    // 上一页
    module.onPreBtnClick(function(){
        var $popWin = module.popWin.el;
        var $td = $($popWin.data('td'));
        var oList = $td.data('buyerList');
        if(oList){
            oList.curPage--;
            if(oList.data[oList.curPage-1]){
                $td.data('buyList',oList);
                module.showBuyerList(oList);
            }else{
                module.getBuyerData(oList.curPage);
            }
        }
    });

    // 下一页
    module.onNextBtnClick(function(){
        var $popWin = module.popWin.el;
        var $td = $($popWin.data('td'));
        var oList = $td.data('buyerList');
        if(oList){
            oList.curPage++;
            if(oList.data[oList.curPage-1]){
                $td.data('buyList',oList);
                module.showBuyerList(oList);
            }else{
                module.getBuyerData(oList.curPage);
            }
        }

    });

});