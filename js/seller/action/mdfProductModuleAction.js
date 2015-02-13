/**
 * 编辑产品模块
 * @Author: lvjw
 * @Update: 14-01-27
 */
$.moduleAndViewAction('mdfProductModuleId', function (modifyProduct) {
    modifyProduct.mdfProductFrom.validate({
        ignore: '',
        rules: {
            productName: { required: true, nonChinese: true, maxlength: 250 },
            model: { nonChinese: true },
            categoryId: { required: true },
            primaryKeyword:{required: true, nonChinese: true },
            keywordList: { required: true, nonChinese: true },
            shortDescription: {
                required: true,
                nonChinese: true,
                minlength: 10,
                maxlength: 150
            },
            productImgs: {required: true },
            newest: { required: true },
            privacyStatus: { required: true },
            minOrder: {
                digits: true,
                max: 999999999
            },
            minOrderUnit: {
                required: function () {
                    return modifyProduct.The_quantity_inner_eg.val() ? true : false;
                }
            },
            monthSupply: {
                digits: true,
                max: 999999999
            },
            msUnit: {
                required: function () {
                    return modifyProduct.The_supply_inner_eg.val() ? true : false;
                }
            },
            fobPriceFrom: {
                number: true,
                max: 999999999
            },
            monetaryUnit: {
                required: function () {
                    return (modifyProduct.The_feild1.val() || modifyProduct.The_feild2.val()) ? true : false;
                }
            },
            fobPriceTo: {
                number: true,
                max: 999999999
            },
            fobUnit: {
                required: function () {
                    return (modifyProduct.The_feild1.val() || modifyProduct.The_feild2.val()) ? true : false;
                }
            },
            startPort: { nonChinese: true },
            detailDescription: { unEmptyEditor: true, nonChinese: true }
        },
        errorElement: "div",
        messages: {
            productName: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE },
            model: { nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE },
            categoryId: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE },
            primaryKeyword: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE },
            keywordList: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE },
            shortDescription: {
                required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE,
                nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE,
                minlength: jQuery.validator.format(Can.msg.MODULE.PRODUCT_FORM.TEXT_MIN_LEN),
                maxlength: jQuery.validator.format(Can.msg.MODULE.PRODUCT_FORM.TEXT_MAX_LEN)
            },
            product_photos: {required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE},
            newest: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE  },
            privacyStatus: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE  },
            minOrder: {
                digits: Can.msg.MODULE.PRODUCT_FORM.DIGITS,
                max: Can.msg.MODULE.PRODUCT_FORM.MAX
            },
            minOrderUnit: {required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE },
            monthSupply: {
                digits: Can.msg.MODULE.PRODUCT_FORM.DIGITS,
                max: Can.msg.MODULE.PRODUCT_FORM.MAX
            },
            msUnit: {required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE },
            monetaryUnit: {required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE },
            fobPriceFrom: {number: Can.msg.MODULE.PRODUCT_FORM.NUMBER},
            fobPriceTo: {number: Can.msg.MODULE.PRODUCT_FORM.NUMBER},
            fobUnit: {required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE },
            startPort: {nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE},
            detailDescription: {unEmptyEditor: Can.msg.MODULE.PRODUCT_FORM.REQUIRE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE}
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "productName") {
                element.removeClass("a-edit").addClass("a-error");
                modifyProduct.fm_editNav.el.removeClass("fm-edit").addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='tipNav']"))
            }
            if (element.attr("name") == "model") {
                element.removeClass("a-edit").addClass("a-error");
                modifyProduct.modelEditNav.el.removeClass("fm-edit").addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='model-tip']"));
            }
            if (element.attr("name") == "categoryId") {
                modifyProduct.category_feild.el.addClass("a-error");
                modifyProduct.category_tip.el.addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='category_tip']"))
            }
            if(element.attr("name") == "primaryKeyword"){        
                element.addClass("a-error");
                modifyProduct.primaryKeyword.addClass("a-error");
                modifyProduct.primaryKeyword_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='primaryKeyword_tip']"))
            }
            if (element.attr("name") == "keywordList") {            
                element.addClass("a-error");
                modifyProduct.keywordF2.addClass("a-error");
                modifyProduct.keywordF3.addClass("a-error");
                modifyProduct.keyword_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='keyword_tip']"))
            }
            if (element.attr("name") == "product_photos") {
                modifyProduct.upload_error_tip.el.addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='upload_tip']"))
            }

            if (element.attr("name") == "shortDescription") {

                $(element).removeClass("a-edit").addClass("a-error");
                modifyProduct.introduction_error_tip.el.addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='introduction_tip']"))
            }
            if (element.attr("name") == "newest") {
                modifyProduct.newProduct_error_tip.el.addClass("a-error").text("").removeClass("hidden");
                error.appendTo($("div[id='newProduct_tip']"))
            }
            if (element.attr("name") == "privacyStatus") {
                modifyProduct.privacyStatusErrorTip.el.addClass("a-error").text("").removeClass("hidden");
                error.appendTo(modifyProduct.privacyStatusErrorTip.el)
            }
            if (element.attr("name") == "minOrder" || element.attr("name") == "minOrderUnit") {
                modifyProduct.The_quantity_tip.el.text("").removeClass("hidden");
                error.addClass('fm-error');
                error.appendTo($("div[id='quantity_tip']"));
            }
            if (element.attr("name") == "monthSupply" || element.attr("name") == "msUnit") {
                modifyProduct.The_supply_tip.el.text("").removeClass("hidden");
                error.addClass('fm-error');
                error.appendTo($("div[id='supply_tip']"));
            }
            if (element.attr("name") == "fobPriceFrom" || element.attr("name") == "fobPriceTo" || element.attr("name") == "monetaryUnit" || element.attr("name") == "fobUnit") {
                modifyProduct.The_price_tip.el.text("").removeClass("hidden");
                error.addClass('fm-error');
                error.appendTo($("div[id='price_tip']"));
            }
            if (element.attr("name") == "startPort") {
                modifyProduct.lodingpart_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='lodingpart_tip']"));
            }
            if (element.attr("name") == "detailDescription") {
                modifyProduct.SecField_el_count.el.addClass('fm-kindeditor-error');
                modifyProduct.SecField_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='sec_field_tip']"));
            }
        },
        submitHandler: function () {
            modifyProduct.fireEvent('ON_SUBMIT_SUCCESS');
            return false;
        }
    });

    modifyProduct.on("onBlurAction", function () {
        var sValue = modifyProduct.pdt_feildtxt.val();
        if (sValue.length > 0 && sValue.length <= 250 && !Can.util.isChinese(sValue)) {
            modifyProduct.fm_editNav.el.addClass('hidden');
            modifyProduct.pdt_feildtxt.removeClass('a-edit');
        }
    });

    // model
    modifyProduct.on('ON_PRODUCT_MODEL', function () {
        // 判断是否中文
        var str = modifyProduct.modelFeildTxt.val();
        if (Can.util.isChinese(str)) {
            modifyProduct.modelFeildTxt.removeClass("a-edit").addClass("a-error");
            modifyProduct.modelEditNav.el.removeClass("fm-edit").addClass("fm-error").text("").removeClass("hidden");
            modifyProduct.modelEditNav.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
        } else {
            modifyProduct.modelFeildTxt.removeClass("a-error");
            modifyProduct.modelEditNav.el.removeClass("fm-error").addClass("fm-edit").addClass("hidden");
        }
    });
    
    var isURL = function (url) {
		var r = "^((https?):\\/\\/((((([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:)*@)?(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]))|((([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?)(:\\d*)?)(\\/((([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)+(\\/(([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)*)*)?)?(\\?((([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|[\\uE000-\\uF8FF]|\\/|\\?)*)?(\\#((([a-zA-Z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(%[\\da-f]{2})|[!\\$&'\\(\\)\\*\\+,;=]|:|@)|\\/|\\?)*)?)?)?$";
		return url != "" && (new RegExp(r, "i")).test(url)
	};
	
	var showError = function(el,tipEl,msg){
    	el.addClass("a-error");
    	tipEl.text("").removeClass("hidden");
    	tipEl.text(msg);
    };
    
    // 视屏链接
    modifyProduct.on('ON_VIDEO_URL', function(){
	
    	var urlVal = modifyProduct.videoUrl.val(), videoUrl = modifyProduct.videoUrl, videloTipEl = modifyProduct.videoUrl_tip.el, tipMsgObj = Can.msg.MODULE.PRODUCT_FORM;
    	videoUrl.removeClass("a-error");
		videloTipEl.addClass("hidden");
    	if(urlVal){
    		var r = /(?!.*alibaba|.*globalsources|.*globalmarket|.*made-in-china)^.*$/;
    		if(!isURL(urlVal)){//不合法的URL
    			showError(videoUrl,videloTipEl,tipMsgObj.INVALID_URL_TIPS);
    		}else if(!r.test(urlVal)){//TRUE ：Url 包含指定字符
    			showError(videoUrl,videloTipEl,tipMsgObj.VIDEO_URL_FILTER_TIPS);
    		} 
    	}
    	
    });

    
    // 主詞
    modifyProduct.on('ON_PRIMARY_KEYWORD_KEYUP', function () {
        // 判断是否中文
        var str = modifyProduct.primaryKeyword.val();
        //判断是否中文
        if (str.length === 0) {
            modifyProduct.primaryKeyword.addClass("a-error");
            modifyProduct.primaryKeyword_tip.el.text("").removeClass("hidden");
            modifyProduct.primaryKeyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
            
        }
        else if(Can.util.isChinese(str)){
            modifyProduct.primaryKeyword.addClass("a-error");
            modifyProduct.primaryKeyword_tip.el.text("").removeClass("hidden");
            modifyProduct.primaryKeyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE); 
        } else {
            modifyProduct.primaryKeyword.removeClass("a-error");
            modifyProduct.primaryKeyword_tip.el.addClass("hidden");
        }

    });
    //关键词
    modifyProduct.on("ON_KEYWORD_KEYUP", function () {
        // 判断是否中文
        var sKeyword1 = modifyProduct.keywordF1.val();
        var sKeyword2 = modifyProduct.keywordF2.val();
        var sKeyword3 = modifyProduct.keywordF3.val();
            /*
console.log("modifyProduct.keyword_tip.el.addClass");            
        if (sKeyword1.length < 1) {
            modifyProduct.keywordF1.removeClass("a-error");
            modifyProduct.keyword_tip.el.removeClass("hidden");
            modifyProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
        } else if (sKeyword2.length < 1){
            modifyProduct.keywordF2.removeClass("a-error");
            modifyProduct.keyword_tip.el.removeClass("hidden");
            modifyProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
        }else if(sKeyword3.length < 1){
            modifyProduct.keywordF3.removeClass("a-error");
            modifyProduct.keyword_tip.el.removeClass("hidden");
            modifyProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
        }
*/

        if (sKeyword1.length > 0 && Can.util.isChinese(sKeyword1)) {
            modifyProduct.keywordF1.addClass("a-error");
            modifyProduct.keywordF2.removeClass("a-error");
            modifyProduct.keywordF3.removeClass("a-error");
            modifyProduct.keyword_tip.el.text("").removeClass("hidden");
            modifyProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            return true;
        }
        if (sKeyword2.length > 0 && Can.util.isChinese(sKeyword2)) {
            modifyProduct.keywordF2.addClass("a-error");
            modifyProduct.keywordF1.removeClass("a-error");
            modifyProduct.keywordF3.removeClass("a-error");
            modifyProduct.keyword_tip.el.text("").removeClass("hidden");
            modifyProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            return true;
        }
        if (sKeyword3.length > 0 && Can.util.isChinese(sKeyword3)) {
            modifyProduct.keywordF3.addClass("a-error");
            modifyProduct.keywordF1.removeClass("a-error");
            modifyProduct.keywordF2.removeClass("a-error");
            modifyProduct.keyword_tip.el.text("").removeClass("hidden");
            modifyProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            return true;
        }
        // 判断是否为空
        if (sKeyword1.length > 0 || sKeyword2.length > 0 || sKeyword3.length > 0) {
            modifyProduct.keywordF1.removeClass("a-error");
            modifyProduct.keywordF2.removeClass("a-error");
            modifyProduct.keywordF3.removeClass("a-error");
            modifyProduct.keyword_tip.el.addClass("hidden");
        } else {
            modifyProduct.keywordF1.addClass("a-error");
            modifyProduct.keywordF2.addClass("a-error");
            modifyProduct.keywordF3.addClass("a-error");
            modifyProduct.keyword_tip.el.removeClass("hidden");
            modifyProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
        }
            
        
    });

    modifyProduct.on("ON_TEXTAREA_KEYUP", function (oTextArea) {
        var val_length = Can.util.checkLength(oTextArea.val());
        if (val_length >= 10 && val_length <= 150) {
            oTextArea.removeClass("a-error");
            modifyProduct.introduction_error_tip.el.addClass("hidden");
        }

        // 判断是否中文
        if (val_length > 0 && Can.util.isChinese(oTextArea.val())) {
            oTextArea.addClass("a-error");
            modifyProduct.introduction_error_tip.update(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            modifyProduct.introduction_error_tip.el.removeClass("hidden");
            return true;
        }

        // 判断是否超过最大长度
        if (val_length > 150) {
            oTextArea.addClass("a-error");
            modifyProduct.introduction_error_tip.el.removeClass("hidden").addClass("fm-error");
            modifyProduct.introduction_error_tip.update(Can.msg.MODULE.PRODUCT_FORM.TEXT_MAX_LEN.replace('{0}', 150));
        }
    });

    modifyProduct.on('ON_PRODUCT_NAME', function () {
        var len = 0;
        var str = modifyProduct.pdt_feildtxt.val();

        // 计算字节数
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            // 单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
        }

        // 判断是否中文
        if (len > 0 && Can.util.isChinese(str)) {
            modifyProduct.pdt_feildtxt.removeClass("a-edit").addClass("a-error");
            modifyProduct.fm_editNav.el.removeClass("fm-edit").addClass("fm-error").text("").removeClass("hidden");
            modifyProduct.fm_editNav.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            return true;
        }
        if (len <= 250) {
            modifyProduct.fm_editNav.el.removeClass('hidden');
            modifyProduct.pdt_feildtxt.removeClass('a-error').addClass('a-edit');
            modifyProduct.fm_editNav.el.attr('class', 'fm-edit');
            modifyProduct.fm_editNav.el.text(Can.msg.MODULE.PRODUCT_FORM.COUNT_LETTER.replace('[@]', (250 - len)));
        }
        if (len > 250) {
            modifyProduct.pdt_feildtxt.removeClass('a-edit').addClass('a-error');
            modifyProduct.fm_editNav.el.attr('class', 'fm-error');
        }
    });

    modifyProduct.setFobPrice();

    modifyProduct.on('onBackClick', function () {
        if (false === modifyProduct._isChangeForm) {
            $("a#managePrdBtnId").trigger("click");
        }
        else {
            var confirmWin = new Can.view.confirmWindowView({
                id: "modifyProductConfirmWin",
                width: 280
            });
            confirmWin.setContent('<div style="padding: 10px 20px;">' + Can.msg.CHANGE_CONFIRM + '</div>');
            confirmWin.show();
            confirmWin.onOK(function () {
                $("a#managePrdBtnId").trigger("click");
            });

        }
    });

    /**
     * 出货港口键盘事件响应
     */
    modifyProduct.on("ON_START_PORT_KEYUP", function () {
        var sStartPort = modifyProduct.Fou_feild.val();
        if (Can.util.isChinese(sStartPort)) {
            modifyProduct.Fou_feild.addClass('a-error');
            modifyProduct.lodingpart_tip.el.text("").removeClass("hidden");
            modifyProduct.lodingpart_tip.update(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
        } else {
            modifyProduct.Fou_feild.removeClass('a-error');
            modifyProduct.lodingpart_tip.el.text("").addClass("hidden");
        }
    });

    /**
     * 规格描述失去焦点事件响应
     */
    modifyProduct.on("ON_DETAIL_DESCRIPTION_BLUR", function () {
        modifyProduct.mdfProductFrom.find('textarea[name="detailDescription"]').html(modifyProduct.kindeditor.html().replace(/src="data:image(.+?)"/gi, ''));

        var $DetailDescription = modifyProduct.kindeditor;
        var bIsChinese = Can.util.isChinese($DetailDescription.html());
        var bIsEmpty = $DetailDescription.isEmpty();

        if (!bIsChinese && !bIsEmpty) {
            modifyProduct.SecField_el_count.el.removeClass('fm-kindeditor-error');
            modifyProduct.SecField_tip.el.text("").addClass("hidden");
        } else {
            modifyProduct.SecField_el_count.el.addClass('fm-kindeditor-error');
            modifyProduct.SecField_tip.el.text("").removeClass("hidden");
            if (bIsEmpty) {
                modifyProduct.SecField_tip.update(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
            } else {
                modifyProduct.SecField_tip.update(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            }
        }
    });

    modifyProduct.on('ON_SAVE_CLICK', function () {
        if (modifyProduct.The_feild1.val() == "" && modifyProduct.The_feild2.val() == "") {
            modifyProduct.The_price_inner_ut1.setValue("");
            modifyProduct.The_price_inner_ut2.setValue("");
        }
        if (modifyProduct.The_quantity_inner_eg.val() == "") {
            modifyProduct.The_quantity_dropFeild.setValue("");
        }
        if (modifyProduct.The_supply_inner_eg.val() == "") {
            modifyProduct.The_supply_dropFeild.setValue("");
        }

        if ($(modifyProduct.The_feild1).val() != "" && $(modifyProduct.The_feild2).val() != "") {
            if (parseFloat(modifyProduct.The_feild1.val()) > parseFloat(modifyProduct.The_feild2.val())) {
                var $PriceTips = $('#price_tip');
                $PriceTips.append('<div class="error fm-error" for="fobUnit">' + Can.msg.MODULE.PRODUCT_FORM.FOB_PRICE_TIPS + '</div>');
                $PriceTips.removeClass("hidden");
                setTimeout(function () {
                    $PriceTips.html('');
                    $PriceTips.addClass("hidden");
                }, 3000);
                return;
            }
        }
        if (modifyProduct.upload_error_tip.el.is(":visible")) {
            modifyProduct.upload_error_tip.el.addClass("hidden");
        }

        modifyProduct.kindeditor.sync();
        var photo_arr = modifyProduct.uploader.getFileNameList(true);
        var _productImg = "";
        if (photo_arr.length > 0) {
            for (var img = 0; img < photo_arr.length; img++) {
                _productImg += '<input type="hidden" name="productImgs" value="' + photo_arr[img] + '">';
            }
        }
        else {
            $("div#upload_tip").removeClass("hidden");
            return;
        }
        var mdfForm = $(modifyProduct.mdfProductFrom);
        var $PICont = mdfForm.find('div[role=proImg]');
        if ($PICont.length) {
            $PICont.remove();
        }
        mdfForm.append([
            '<div role="proImg">',
            _productImg,
            '</div>'
        ].join(''));

        modifyProduct.mdfProductFrom.find('textarea[name="detailDescription"]').html(modifyProduct.kindeditor.html().replace(/src="data:image(.+?)"/gi, ''));
        modifyProduct.mdfProductFrom.submit();
    });

    modifyProduct.on('ON_SUBMIT_SUCCESS', function () {
        var mdfForm = $(modifyProduct.mdfProductFrom);
        var sPostData = mdfForm.serialize();
        this.fValideSensitiveWord(sPostData,
            function() {
                modifyProduct.save_btn.el.addClass('dis');
            },
            function() {
                modifyProduct.save_btn.el.removeClass('dis');
            },
            function() {
                $.ajax({
                    url: Can.util.Config.seller.manageProduct.ADD,
                    data: mdfForm.serialize(),
                    type: 'POST',
                    beforeSend: function() {
                        modifyProduct.save_btn.el.addClass('dis');
                    },
                    success: function(result) {
                        modifyProduct.save_btn.el.removeClass('dis');
                        var i;
                        if (result.status == "success") {
                            if (result.data === 1) {
                                // 上线列表
                                Can.Route.run('/product-manage?reload=1');
                            } else {
                                // 下线列表
                                Can.Route.run('/product-manage/offline?reload=1');
                            }
                        } else {
                            for (i in result.data) {
                                result.message += '<br> ' + i + ': ' + result.data[i];
                            }
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, result);
                        }
                    }
                });
            });
    });
});
