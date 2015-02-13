/**
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 13-3-9
 */

$.moduleAndViewAction('sendInquiryBoxId', function (sendInquiry) {
	sendInquiry.on('ON_SUPPLIER_CLICK', function ($Obj) {
		//Can.util.canInterface('personProfile', [1, $Obj.attr('sid')]);
	});
	sendInquiry.on('ON_PRODUCT_CLICK', function ($Obj) {
		/*$Obj.attr({
		 target:'_blank',
		 href:Can.util.Config.seller.showroom.productURL + $Obj.attr('pid')
		 });*/
	});
	sendInquiry.on('ON_COMPANY_CLICK', function ($Obj) {
		/*$Obj.attr({
		 target:'_blank',
		 href:Can.util.Config.seller.showroom.rootURL + $Obj.attr('cid')
		 });*/
	});
	//发送成功
	sendInquiry.on('ON_SEND_OK', function () {
		Can.util.canInterface('whoSay', ['inquiry send success!'])
	});
	//发送失败
	sendInquiry.on('ON_EMAIL_FAILED', function (error) {
		Can.util.canInterface('whoSay', [Can.msg.ERROR_TEXT[error.code]]);
	});

});