/**
 * 单个interest buyer的信息View Action
 * @Author: sam
 * @Version: 1.1
 * @Update: 13-2-22
 */

$.moduleAndViewAction('SellerShowroomPrdsInfoTag1ViewId', function (view) {
   view.on('onaddmoreprdclick',function(){
       //TODO
       // alert('');
   }, view);

    view.on('onprdclick',function(){
//        alert('进去产品详细页');
    }, view);

    view.on('onpulloffclick', function(prd){
//        alert('sdalk')
        //TODO
        // alert('下架此产品:'+prd.prdName+'['+prd.productId+']')
    })
});