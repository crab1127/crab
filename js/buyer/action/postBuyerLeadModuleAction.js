/**
 * Created with JetBrains WebStorm.
 * User: sam
 * Date: 13-3-6
 *
 */

'use strict';

$.moduleAndViewAction('postBuyerLeadModuleID', function (postBL) {
	var form = postBL.node.form;

	form.validate({
		ignore: '',
		rules: {
			productName: { required: true, maxlength: 128 },
			categoryId: { required: true },
			description: {
				required: true,
				minlength: 10,
				maxlength: 8000
			},
            //productPhotoValid: {required: true },
			buyingAmt: {required: true, digits: true,min:1 },
			buyingUnit: {required: true },
			yearBuyingAmt: {
				required: function () {
					return postBL.year_buy_dropFeild.getValue() ? true : false;
				},
				digits: true,
                min:1
			},
			yearBuyingUnit: {
				required: function () {
					return postBL.year_buy_inner_eg.val() ? true : false;
				}
			},
			expiredDate: { required: true },
            preferredCurrency: {
				required: function () {
					return postBL.$currency.getValue() ? true : false;
				},
				number: true
			},
            preferredUnit: {
				required: function () {
					return postBL.$preferred.getValue() ? true : false;
				},
				number: true
			},
            preferredPrice: {
                number:true,
				required: function () {
					return postBL.The_price_inner_eg.val() ? true : false;
				}
			},
            procureMoneyUnit:{
                required:function(){
                    return $("input[name=procureMoneyValue]").val() ? true : false;
                }
            },
            procureMoneyValue:{
                number:true,
                required:function(){
                    return postBL.paUnits.getValue() ? true : false;
                }
            },
            yearProcureMoneyUnit:{
                required:function(){
                    return $("input[name=yearProcureMoneyValue]").val() ? true : false;
                }
            },
            yearProcureMoneyValue:{
                number:true,
                required:function(){
                    return postBL.apaUnits.getValue() ? true: false;
                }
            }
		},
		errorElement: "div",
		messages: {
			productName: {
				required: "This field is required."
			},
			categoryId: {
				required: "This field is required."
			},
			description: {
				required: "This field is required."
			},
            productPhotoValid: {required: "This field is required."}
		},
		errorPlacement: function ($error, $element) {
            var $parent = $element.parents(".field");
            if($element.is(":hidden")){
                $element.parents('.inner').find(".txt").addClass('a-error');
            }else{
                $element.addClass("a-error");
            }

            $error.addClass('fm-error');
            $parent.find(".error-holder").html($error);
		},
        unhighlight:function(element){
            var $element = $(element);
            if($element.is(":hidden")){
                $element.parents('.inner').find(".txt").removeClass('a-error');
            }else{
                $element.removeClass("a-error");
            }
        },
		submitHandler: function () {
			postBL.fireEvent('ON_SUBMIT_SUCCESS');
			return false;
		}
	});

    // checkbox
    postBL.onCheck(function(){
        if($(this).data('check')){
            $(this).data('check',false).removeClass('checked').find('input:hidden').val(0);
            postBL.actionNav.pubCount.el.hide();
        }else{
            $(this).data('check',true).addClass('checked').find('input:hidden').val(1);
            if(postBL.isCcoinOpened && !postBL.editId){
                postBL.actionNav.pubCount.el.show();
            }
			if(!postBL.editId){
				postBL.showContactWin();
			}
        }
    });



	postBL.on('onsaveclick', function () {
		if (!form.valid()) {
			return;
		}
        var categoryId = postBL.category_feild.valueField.val();

		this.dateLM.el.val(this.dateLM.el.val() + ' 23:59:59');
		$.ajax({
			url: Can.util.Config.buyer.blManageModule.detail,
			type: 'POST',
			data: form.serialize(),
            beforeSend:function(){
                postBL.actionNav.el.find("#submitBtnId").hide();
                postBL.actionNav.el.find("#action-loading").show();
            },
			success: function (d) {
				if (d['status'] !== 'success') {
					Can.util.canInterface('whoSay', ['Post Failed!']);
					return;
				}

                Can.importJS(['js/buyer/view/buyerLeadManageModule.js']);
                var buyerLeadManage = Can.Application.getModule('buyerLeadManageModuleId');
                if (buyerLeadManage) {
                    if(postBL.editId){
                        buyerLeadManage.fireEvent('ON_LOAD_UNAPPROVED');
                    }else{
                        buyerLeadManage.fireEvent('ON_LOAD_AUDITING');
                    }
                }

				if(window.ga){
                    ga('send', 'event', 'LeadEXpress', 'trigger', 'LeadEXpress - Post');
                }

                $.ajax({
                    url:Can.util.Config.buyer.blManageModule.recommendProduct,
                    data:{
                        categoryId:categoryId
                    },
                    complete: function(){
                        postBL.actionNav.el.find("#submitBtnId").show();
                        postBL.actionNav.el.find("#action-loading").hide();
                    },
                    success:function (res) {
                        var productData = [];
                        if(res && res['status'] && res['status'] === 'success'){
                            productData = res['data'] || [];
                        }
                        Can.importJS(['js/buyer/view/postBuyLeadSuccModule.js']);
                        $("#postBuyLeadSuccModuleID").remove();
                        var succModel = new Can.module.postBuyLeadSuccModule({productData:productData});
                        Can.Application.putModule(succModel);
                        succModel.start();
                        succModel.show();
                    }
                });
			}
		});
	});

    var contValidator;
    postBL.on('ON_CONTACT_LOADED', function(){
        contValidator = postBL.contForm.el.validate({
            ignore: '',
            rules: {
                companyName:{
                    required: true,
                    maxlength: 256
                },
                email: {
                    required: true,
                    email: true
                },
                countryTel: {
                    required: true,
                    digits: true,
                    maxlength: 4
                },
                zoneTel: {
                    required: true,
                    digits: true,
                    maxlength: 4
                },
                telephone: {
                    required: true,
                    digits: true,
                    maxlength: 16
                },
                countryFax: {
                    digits: true,
                    maxlength: 4
                },
                zoneFax: {
                    digits: true,
                    maxlength: 4
                },
                fax: {
                    digits: true,
                    maxlength: 32
                }
            },
            errorElement: "div",
            messages: {
                productName: {
                    required: "This field is required."
                }
            },
            errorPlacement: function ($error, $element) {
                var $parent = $element.parents(".field");
                if($element.is(":hidden")){
                    $element.parents('.inner').find(".txt").addClass('a-error');
                }else{
                    $element.addClass("a-error");
                }

                $error.addClass('fm-error');
                $parent.find(".error-holder").html($error);
            },
            unhighlight:function(element){
                var $element = $(element);
                if($element.is(":hidden")){
                    $element.parents('.inner').find(".txt").removeClass('a-error');
                }else{
                    $element.removeClass("a-error");
                }
            },
            submitHandler: function () {
                postBL.fireEvent('ON_SUBMIT_SUCCESS');
                return false;
            }
        });
    });

    // 保存联系信息
    function saveContact(){
        var oData = postBL.contForm.el.serialize();
        $.post(Can.util.Config.buyer.blManageModule.saveContact,oData, function(){
            postBL.contactWin.close();
        });
    }
    postBL.on('onContactSave', function(){
        if(! postBL.contForm.el.valid()){
            return;
        }
        var $email = postBL.contForm.el.find('input[name=email]');

        // 如果邮箱已经验证激活，就不需要验证
        if($email.data('emailValidation')){
            saveContact();
        }else{
            // 验证邮箱是否存在
            $.get(Can.util.Config.buyer.mySetting.checkEmail,{'email':$email.val()},function(jData){
                var _data = jData['data'] || {};
                if(_data.isExist && contValidator){
                    contValidator.settings.errorPlacement($('<div for="email" class="error">The email have been activated. Please try another one.</div>'), $email);
                }else{
                    // 保存信息
                    saveContact();
                }
            });
        }
    });

	/*upload photo*/
	postBL.uploaderReady();

    postBL.onImgUploadSuccess(function(oFile,jStatus){
        postBL.photo_input.val(postBL.imgUploader.getFileNameList()).valid();
        postBL.imgUploadErrorTip.el.find(".error").hide();
    });

    postBL.onImgRemove(function(oFile){
        postBL.photo_input.val(postBL.imgUploader.getFileNameList()).valid();
    });

    postBL.onImgUploadError(function(oFile,nCode){
        var html = '<div class="error fm-error">'+Can.msg.ERROR_TEXT[nCode]+'</div>';
        postBL.imgUploadErrorTip.el.html($(html));
    });

    postBL.onFileUploadSuccess(function(oFile,jStatus){
        postBL.upload_error_tip.el.removeClass("fm-error").text("");
    });
	postBL.onFileUploadError(function (file, code) {
       postBL.upload_error_tip.el.addClass("fm-error").text(Can.msg.ERROR_TEXT[code]);
	});

});
