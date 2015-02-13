/**
 * @Author: AngusYoung
 * @Version: 1.1
 * @Update: 13-3-7
 */ 
$.moduleAndViewAction('buyerIndexModule', function (buyerIndex) {
	buyerIndex.onSearch(function () {
		Can.importJS(['js/buyer/view/searchModule.js']);
		var _type = buyerIndex.searchSel.getValue(),
            keyword = buyerIndex.searchIpt.getValue() || '';

        // 不允许空搜索
        if (keyword === '') {
            buyerIndex.searchKeywordError.el.show();
            buyerIndex.searchKeywordWp.el.addClass('el-error');
            return;
        }

		if (_type === 'Supplier') {
			// 搜供应商
			var spSearchModule = Can.Application.getModule('spSearchModuleId');
			if (!spSearchModule) {
				spSearchModule = new Can.module.SupplierSearchModule();
				Can.Application.putModule(spSearchModule);
				spSearchModule.start();
			}
			spSearchModule.show();
			spSearchModule.load(Can.util.Config.buyer.searchModule.dosearchsupplies, 'keyword=' + keyword, keyword);
		} else {
			// 搜产品
			var prdSearchModule = Can.Application.getModule('prdSearchModuleId');
			if (!prdSearchModule) {
				prdSearchModule = new Can.module.PrdSearchModule();
				Can.Application.putModule(prdSearchModule);
				prdSearchModule.start();
			}
			prdSearchModule.show();
			prdSearchModule.load(Can.util.Config.buyer.searchModule.dosearchproduct, 'keyword=' + keyword, keyword);
		}
	});
	buyerIndex.onRemmProClick(function () {
		var sTitle = $(this).children('img').attr('alt');
		var nId = $(this).attr('cid');
		Can.util.canInterface('productDetail', [nId, sTitle, 'buyerIndexModule']);
	});

    // 编辑邮箱
    buyerIndex.onMailEditClick(function(){
        if(localStorage){
            localStorage.setItem("ice-et-edit","edit");
        }
        window.location.href = "#!buyer/setAccount";
    });

    // 邮箱登录激活
    buyerIndex.onActivateClick(function(){

        var $activate = buyerIndex.emailTips.el.find("#ice-et-activate");
        if($activate.data("sending")){
            return;
        }

        Can.importJS(["js/utils/windowView.js"]);
        Can.util.userInfo(Can.util.Config.accountInfo);
        var email = Can.util.userInfo().getEmail();
        var win = null;
        $.ajax({
            url:Can.util.Config.buyer.mySetting.sendEmail,
            type: 'POST',
            data:{
                'email':email
            },
            beforeSend:function(xhr,settings){
                buyerIndex.emailTips.el.find(".ice-email-loading").css({"visibility":"visible"});
                $activate.data("sending",true);
            },
            complete:function(xhr,setting){
                buyerIndex.emailTips.el.find(".ice-email-loading").css({"visibility":"hidden"});
                $activate.data("sending",false);
            },
            success:function(jData){
                if(jData.status && jData.status === 'success'){
                    win = new Can.view.pinWindowView({
                        width:320,
                        height:170
                    });
                   var html ='<div class="xxx" style="padding: 20px;"><p class="txt"><h3 style="color: #575757; font-size: 14px; font-weight: bold;">Email Login Activation </h3><div style="padding-top: 10px; font-size: 12px;">A verification email has been sent to your email <br>(<span style="color: #e04d2c">'+email+'</span>) to complete actication.</div></p><div class="mod-actions" style="text-align: center; margin-top: 15px;"><a id="ice-mailbox" href="javascript:;" class="btn btn-s11"><span>Go to mailbox</span></a></div></div>';

                    win.setContent(html);
                    win.show();

                    if(jData.data && jData.data.loginPage && jData.data.loginPage !== ''){
                        $("#ice-mailbox").attr("href",jData.data.loginPage);
                    }

                    //go to mainbox
                    $("#ice-mailbox").click(function(){
                        win.close();
                    });
                }else{
                    win = new Can.view.alertWindowView({
                        width:250,
                        height:50
                    });
                    win.setContent("<div style='font-size: 14px; padding: 20px;' >Failed to send activation email !</div>");
                    win.show();
                }
            },
            error:function(e){
                win = new Can.view.alertWindowView({
                    width:250,
                    height:50
                });
                win.setContent("<div style='font-size: 14px; padding: 20px;' >Failed to send activation email !</div>");
                win.show();
            }
        });
    });

	buyerIndex.onTabSwitch(function () {
		//嘿嘿，可以在这里AJAX请求数据去填充cont，于是this就是对应cont的JQ对象
	});

    buyerIndex.searchIpt.input.keypress(function(e){
        if(e.keyCode === 13){
            buyerIndex.searchBtn.el.click();
        }
    });

	$(function () {
		buyerIndex.loadData(Can.util.Config.buyer.indexModule.pushProduct);
		buyerIndex.loadRemmData(Can.util.Config.buyer.indexModule.remmProduct);

        if (Can.util.userInfo().getIMAccount()) {
            if (window['WebIM']) {
                WebIM.init({
                    accName: Can.util.userInfo().getIMAccount(),
                    displayName: Can.msg.IM.YOURSELF,
                    userType: Can.util.userInfo().getUserType(),
                    password: Can.util.userInfo().getIMToken(),
                    domain: Can.ENV.IM.domain,
                    serviceUrl: Can.ENV.IM.service
                });
            }
        }
	});
});
