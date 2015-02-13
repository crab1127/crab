/**
 * 添加产品模块
 * @Author: lvjw
 * @Update: 14-01-27
 */
$.moduleAndViewAction('addProductModuleId', function(addProduct) {
    addProduct.addProductFrom.validate({
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
            minOrder: {
                digits: true,
                max: 999999999
            },
            minOrderUnit: {
                required: function () {
                    return addProduct.The_quantity_inner_eg.val() ? true : false;
                }
            },
            monthSupply: {
                digits: true,
                max: 999999999
            },
            msUnit: {
                required: function () {
                    return addProduct.The_supply_inner_eg.val() ? true : false;
                }
            },
            fobPriceFrom: {
                number: true,
                max: 999999999
            },
            monetaryUnit: {
                required: function () {
                    return (addProduct.The_feild1.val() || addProduct.The_feild2.val()) ? true : false;
                }
            },
            fobPriceTo: {
                number: true,
                max: 999999999
            },
            fobUnit: {
                required: function () {
                    return (addProduct.The_feild1.val() || addProduct.The_feild2.val()) ? true : false;
                }
            },
            newest: { required: true },
            privacyStatus: { required: true },
            startPort: { nonChinese: true },
            detailDescription: { unEmptyEditor: true, nonChinese: true}
        },
        errorElement: "div",
        messages: {
            productName: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE },
            model: { nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE },
            categoryId: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE },
            keywordList: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE },
            primaryKeyword: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE },
            shortDescription: {
                required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE,
                minlength: jQuery.validator.format(Can.msg.MODULE.PRODUCT_FORM.TEXT_MIN_LEN),
                maxlength: jQuery.validator.format(Can.msg.MODULE.PRODUCT_FORM.TEXT_MAX_LEN),
                nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE
            },
            productImgs: {required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE},
            privacyStatus: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE  },
            newest: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE  },
            minOrder: {
                digits: Can.msg.MODULE.PRODUCT_FORM.DIGITS,
                max: Can.msg.MODULE.PRODUCT_FORM.MAX
            },
            minOrderUnit: { required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE },
            monthSupply: {
                digits: Can.msg.MODULE.PRODUCT_FORM.DIGITS,
                max: Can.msg.MODULE.PRODUCT_FORM.MAX
            },
            msUnit: {required: Can.msg.MODULE.PRODUCT_FORM.REQUIRE},
            fobPriceFrom: {number: Can.msg.MODULE.PRODUCT_FORM.NUMBER},
            fobPriceTo: {number: Can.msg.MODULE.PRODUCT_FORM.NUMBER},
            startPort: {nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE},
            detailDescription: {unEmptyEditor: Can.msg.MODULE.PRODUCT_FORM.REQUIRE, nonChinese: Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE}
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "productName") {
                element.removeClass("a-edit").addClass("a-error");
                addProduct.fm_editNav.el.removeClass("fm-edit").addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='tipNav']"));
            }
            if (element.attr("name") == "model") {
                element.removeClass("a-edit").addClass("a-error");
                addProduct.modelEditNav.el.removeClass("fm-edit").addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='model-tip']"));
            }
            
            if(element.attr("name") == "videoUrl"){
            	element.addClass("a-error");
                addProduct.videoUrl.addClass("a-error");
                addProduct.videoUrl_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='primaryKeyword_tip']"))
            }
            
            if (element.attr("name") == "categoryId") {                           
                addProduct.category_feild.el.addClass("a-error");
                addProduct.category_tip.el.addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='category_tip']"))
            }
            if (element.attr("name") == "productImgs") {                
                addProduct.upload_error_tip.el.addClass("fm-error").text("").removeClass("hidden");
                error.appendTo($("div[id='upload_tip']"))
            }
            if(element.attr("name") == "primaryKeyword"){        
                element.addClass("a-error");
                addProduct.primaryKeyword.addClass("a-error");
                addProduct.primaryKeyword_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='primaryKeyword_tip']"))
            }
            if (element.attr("name") == "keywordList") {
                element.addClass("a-error");
                addProduct.keywordF2.addClass("a-error");
                addProduct.keywordF3.addClass("a-error");
                addProduct.keyword_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='keyword_tip']"))
            }
            if (element.attr("name") == "shortDescription") {
                element.removeClass("a-edit").addClass("a-error");
                addProduct.introduction_error_tip.el.addClass("a-error").text("").removeClass("hidden");
                error.appendTo($("div[id='introduction_tip']"))
            }
            if (element.attr("name") == "newest") {
                addProduct.newProduct_error_tip.el.addClass("a-error").text("").removeClass("hidden");
                error.appendTo($("div[id='newProduct_tip']"))
            }
            if (element.attr("name") == "privacyStatus") {
                addProduct.privacyStatusErrorTip.el.addClass("a-error").text("").removeClass("hidden");
                error.appendTo(addProduct.privacyStatusErrorTip.el)
            }
            if (element.attr("name") == "minOrder" || element.attr("name") == "minOrderUnit") {
                addProduct.The_quantity_tip.el.text("").removeClass("hidden");
                error.addClass('fm-error');
                error.appendTo($("div[id='quantity_tip']"));
            }
            if (element.attr("name") == "monthSupply" || element.attr("name") == "msUnit") {
                addProduct.The_supply_tip.el.text("").removeClass("hidden");
                error.addClass('fm-error');
                error.appendTo($("div[id='supply_tip']"));
            }
            if (element.attr("name") == "fobPriceFrom" || element.attr("name") == "fobPriceTo" || element.attr("name") == "monetaryUnit" || element.attr("name") == "fobUnit") {
                addProduct.The_price_tip.el.text("").removeClass("hidden");
                error.addClass('fm-error');
                error.appendTo($("div[id='price_tip']"));
            }
            if (element.attr("name") == "startPort") {
                addProduct.Fou_feild.addClass('a-error');
                addProduct.lodingpart_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='lodingpart_tip']"));
            }
            if (element.attr("name") == "detailDescription") {
                addProduct.SecField_el_count.el.addClass('fm-kindeditor-error');
                addProduct.SecField_tip.el.text("").removeClass("hidden");
                error.appendTo($("div[id='sec_field_tip']"));
            }
        },
        submitHandler: function () {
            if (addProduct.addProductFrom.valid()) {
                addProduct.save_btn.el.addClass('dis');
                addProduct.fireEvent('ON_SUBMIT_SUCCESS');
            }
            return false;
        }
    });

    addProduct.setData();

    addProduct.setFobPrice();

    // 产品名称
    addProduct.on("onBlurAction", function () {
        var sValue = addProduct.pdt_feildtxt.val();
        if (sValue.length > 0 && sValue.length <= 250 && !Can.util.isChinese(sValue)) {
            addProduct.fm_editNav.el.addClass('hidden');
            addProduct.pdt_feildtxt.removeClass('a-edit');
			//过滤特殊字符
			var pattern = new RegExp("[\\\\_`!=?\"！￥……（）——【】‘；：？]");
			var result = "";
            //将特殊字符串都转换成空格
            for(var i=0;i<sValue.length;i++){
                result = result + sValue.substr(i,1).replace(pattern,' ');
            }
            //多个空格合并成一个空格
            result = result.replace(/ {2,}/g,' ');
            addProduct.pdt_feildtxt.val(result);

        }
    });

    addProduct.on('ON_PRODUCT_NAME', function () {
        var len = 0;
        var str = addProduct.pdt_feildtxt.val();

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
            addProduct.pdt_feildtxt.removeClass("a-edit").addClass("a-error");
            addProduct.fm_editNav.el.removeClass("fm-edit").addClass("fm-error").text("").removeClass("hidden");
            addProduct.fm_editNav.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            return true;
        }
        if (len <= 250) {
            addProduct.fm_editNav.el.removeClass('hidden');
            addProduct.pdt_feildtxt.removeClass('a-error').addClass('a-edit');
            addProduct.fm_editNav.el.attr('class', 'fm-edit');
            addProduct.fm_editNav.el.text(Can.msg.MODULE.PRODUCT_FORM.COUNT_LETTER.replace('[@]', (250 - len)));
        }
        if (len > 250) {
            addProduct.pdt_feildtxt.removeClass('a-edit').addClass('a-error');
            addProduct.fm_editNav.el.attr('class', 'fm-error');
        }
    });

    // model
    addProduct.on('ON_PRODUCT_MODEL', function () {
        // 判断是否中文
        var str = addProduct.modelFeildTxt.val();
        if (Can.util.isChinese(str)) {
            addProduct.modelFeildTxt.removeClass("a-edit").addClass("a-error");
            addProduct.modelEditNav.el.removeClass("fm-edit").addClass("fm-error").text("").removeClass("hidden");
            addProduct.modelEditNav.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
        } else {
            addProduct.modelFeildTxt.removeClass("a-error");
            addProduct.modelEditNav.el.removeClass("fm-error").addClass("fm-edit").addClass("hidden");
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
    //视屏链接
    addProduct.on('ON_VIDEO_URL',function(){    	
    	var urlVal = addProduct.videoUrl.val(),videoUrl = addProduct.videoUrl, videloTipEl = addProduct.videoUrl_tip.el,tipMsgObj = Can.msg.MODULE.PRODUCT_FORM;
    	
		videoUrl.removeClass("a-error");
		videloTipEl.addClass("hidden");
		
    	if(urlVal){
    		var r = /(?!.*alibaba|.*globalsources|.*globalmarket|.*made-in-china)^.*$/;
    		if(!r.test(urlVal)){//TRUE ：Url 包含指定字符
    			showError(videoUrl,videloTipEl,tipMsgObj.VIDEO_URL_FILTER_TIPS);
    		}else if(!isURL(urlVal)){//不合法的URL
    			showError(videoUrl,videloTipEl,tipMsgObj.INVALID_URL_TIPS);
    		}
    	}
    	
    });
    
    

    // 主詞
    addProduct.on('ON_PRIMARY_KEYWORD_KEYUP', function () {
        // 判断是否中文
        var str = addProduct.primaryKeyword.val();
        //判断是否中文
        if (str.length === 0) {
            addProduct.primaryKeyword.addClass("a-error");
            addProduct.primaryKeyword_tip.el.text("").removeClass("hidden");
            addProduct.primaryKeyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
            
        }
        else if(Can.util.isChinese(str)){
            addProduct.primaryKeyword.addClass("a-error");
            addProduct.primaryKeyword_tip.el.text("").removeClass("hidden");
            addProduct.primaryKeyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE); 
        } else {
            addProduct.primaryKeyword.removeClass("a-error");
            addProduct.primaryKeyword_tip.el.addClass("hidden");
        }

    });

    // keyword
    addProduct.on("ON_KEYWORD_KEYUP", function () {
        // 判断是否中文
        var sKeyword1 = addProduct.keywordF1.val();
        var sKeyword2 = addProduct.keywordF2.val();
        var sKeyword3 = addProduct.keywordF3.val();
        if (sKeyword1.length > 0 && Can.util.isChinese(sKeyword1)) {
            addProduct.keywordF1.addClass("a-error");
            addProduct.keywordF2.removeClass("a-error");
            addProduct.keywordF3.removeClass("a-error");
            addProduct.keyword_tip.el.text("").removeClass("hidden");
            addProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            return true;
        }
        if (sKeyword2.length > 0 && Can.util.isChinese(sKeyword2)) {
            addProduct.keywordF2.addClass("a-error");
            addProduct.keywordF1.removeClass("a-error");
            addProduct.keywordF3.removeClass("a-error");
            addProduct.keyword_tip.el.text("").removeClass("hidden");
            addProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            return true;
        }
        if (sKeyword3.length > 0 && Can.util.isChinese(sKeyword3)) {
            addProduct.keywordF3.addClass("a-error");
            addProduct.keywordF1.removeClass("a-error");
            addProduct.keywordF2.removeClass("a-error");
            addProduct.keyword_tip.el.text("").removeClass("hidden");
            addProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            return true;
        }

        // 判断是否为空
        if (sKeyword1.length > 0 || sKeyword2.length > 0 || sKeyword3.length > 0) {
            addProduct.keywordF1.removeClass("a-error");
            addProduct.keywordF2.removeClass("a-error");
            addProduct.keywordF3.removeClass("a-error");
            addProduct.keyword_tip.el.addClass("hidden");
        } else {
            addProduct.keywordF1.addClass("a-error");
            addProduct.keywordF2.addClass("a-error");
            addProduct.keywordF3.addClass("a-error");
            addProduct.keyword_tip.el.removeClass("hidden");
            addProduct.keyword_tip.el.text(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
        }
    });

    // shortDescription
    addProduct.on("ON_TEXTAREA_KEYUP", function (oTextArea) {
        var val_length = Can.util.checkLength(oTextArea.val());
        if (val_length >= 10 && val_length <= 150) {
            oTextArea.removeClass("a-error");
            addProduct.introduction_error_tip.el.addClass("hidden");
        }

        // 判断是否中文
        if (val_length > 0 && Can.util.isChinese(oTextArea.val())) {
            oTextArea.addClass("a-error");
            addProduct.introduction_error_tip.update(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            addProduct.introduction_error_tip.el.removeClass("hidden");
            return true;
        }

        // 判断是否超过最大长度
        if (val_length > 150) {
            oTextArea.addClass("a-error");
            addProduct.introduction_error_tip.update(Can.msg.MODULE.PRODUCT_FORM.TEXT_MAX_LEN.replace('{0}', 150));
            addProduct.introduction_error_tip.el.removeClass("hidden");
        }
    });

    addProduct.on("hide_newProductTip", function () {
        addProduct.newProduct_error_tip.el.addClass("hidden");
    });

    addProduct.on("hide_privacyStatusTip", function () {
        addProduct.privacyStatusErrorTip.el.addClass("hidden");
    });

    /**
     * 出货港口键盘事件响应
     */
    addProduct.on("ON_START_PORT_KEYUP", function () {
        var sStartPort = addProduct.Fou_feild.val();
        if (Can.util.isChinese(sStartPort)) {
            addProduct.Fou_feild.addClass('a-error');
            addProduct.lodingpart_tip.el.text("").removeClass("hidden");
            addProduct.lodingpart_tip.update(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
        } else {
            addProduct.Fou_feild.removeClass('a-error');
            addProduct.lodingpart_tip.el.text("").addClass("hidden");
        }
    });

    /**
     * 规格描述失去焦点事件响应
     */
    addProduct.on("ON_DETAIL_DESCRIPTION_BLUR", function () {
        addProduct.addProductFrom.find('textarea[name="detailDescription"]').html(addProduct.kindeditor.html().replace(/src="data:image(.+?)"/gi, ''));

        var $DetailDescription = addProduct.kindeditor;
        var bIsChinese = Can.util.isChinese($DetailDescription.html());
        var bIsEmpty = $DetailDescription.isEmpty();

        if (!bIsChinese && !bIsEmpty) {
            addProduct.SecField_el_count.el.removeClass('fm-kindeditor-error');
            addProduct.SecField_tip.el.text("").addClass("hidden");
        } else {
            addProduct.SecField_el_count.el.addClass('fm-kindeditor-error');
            addProduct.SecField_tip.el.text("").removeClass("hidden");
            if (bIsEmpty) {
                addProduct.SecField_tip.update(Can.msg.MODULE.PRODUCT_FORM.REQUIRE);
            } else {
                addProduct.SecField_tip.update(Can.msg.MODULE.PRODUCT_FORM.NON_CHINESE);
            }
        }
    });

    addProduct.on('ON_SAVE_CLICK', function () {
        if (addProduct.The_feild1.val() == "" && addProduct.The_feild2.val() == "") {
            addProduct.The_price_inner_ut1.setValue("");
            addProduct.The_price_inner_ut2.setValue("");
        }
        if (addProduct.The_quantity_inner_eg.val() == "") {
            addProduct.The_quantity_dropFeild.setValue("");
        }
        if (addProduct.The_supply_inner_eg.val() == "") {
            addProduct.The_supply_dropFeild.setValue("");
        }
        if (addProduct.upload_error_tip.el.is(":visible")) {
            addProduct.upload_error_tip.el.addClass("hidden");
        }
        if ($(addProduct.The_feild1).val() != "" && $(addProduct.The_feild2).val() != "") {
            if (parseFloat(addProduct.The_feild1.val()) > parseFloat(addProduct.The_feild2.val())) {
                var $PriceTips = $('#price_tip');
                $PriceTips.append('<div class="error fm-error" for="fobUnit">' + Can.msg.MODULE.PRODUCT_FORM.FOB_PRICE_TIPS + '</div>');
                $PriceTips.removeClass("hidden");
                setTimeout(function () {
                    $PriceTips.html('');
                    $PriceTips.addClass("hidden");
                    $(addProduct.save_btn.el).removeClass("dis");
                }, 2000);
                return;
            }
        }
        addProduct.addProductFrom.find('textarea[name="detailDescription"]').html(addProduct.kindeditor.html().replace(/src="data:image(.+?)"/gi, ''));
        addProduct.addProductFrom.submit();
    });

    var _xaddproduct = false;
    addProduct.on('ON_SUBMIT_SUCCESS', function () {
        var $form = $(addProduct.addProductFrom);
        var photo_arr = addProduct.uploader.getFileNameList(true);
        var _productImg = "";

        if (photo_arr.length > 0) {
            for (var img = 0; img < photo_arr.length; img++) {
                _productImg += '<input type="hidden" name="productImgs" value="' + photo_arr[img] + '">';
            }
        }
        else {
            addProduct.upload_error_tip.el.addClass("fm-error").text("").removeClass("hidden");
            $("div[id='upload_tip']").append('<div class="error" for="product_photos">This field is required.</div>');
            $(addProduct.save_btn.el).removeClass("dis");
            return;
        }

        var $PICont = $form.find('div[role=proImg]');
        if ($PICont.length) {
            $PICont.remove();
        }
        $form.append([
            '<div role="proImg">',
            _productImg,
            '</div>'
        ].join(''));

        if (!_xaddproduct) {            

            this.fValideSensitiveWord($form.serialize(),
                function() {
                    addProduct.save_btn.el.addClass('dis');
                },
                function() {
                    addProduct.save_btn.el.removeClass('dis');
                },
                function() {
                    var sPostData = $form.serialize();
                    if(sPostData.indexOf('detailDescription=&') != -1) {
                        var siteLen =  sPostData.indexOf('detailDescription=') + 'detailDescription='.length;
                        sPostData = sPostData.slice(0, siteLen) + encodeURIComponent($('textarea[name="detailDescription"]').text()) + sPostData.slice(siteLen)
                    }
                    $.ajax({
                        url: Can.util.Config.seller.addProduct.ADD,
                        data: sPostData,
                        type: 'POST',                        
                        beforeSend: function () {
                            _xaddproduct = true;
                        },
                        complete: function () {
                            _xaddproduct = false;
                        },
                        success: function (result) {
                            var i;
                            if (result.status == "success") {
                                $('#addProductModuleId').remove();
                                var addProductModule = new Can.module.addProductModule();
                                Can.Application.putModule(addProductModule);
                                addProductModule.start();
                                // 设置跳转到产品管理页显示的是所有分组
                                var productManageModule = Can.Application.getModule('productManageModuleId');
                                if (productManageModule) {
                                    productManageModule.currentGroup = "";
                                    productManageModule.markCur.el.attr("style", "top:18px;");
                                }
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
                                addProduct.save_btn.el.removeClass('dis');
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, result);
                            }
                        }
                    });
                });
        }
    });

    // upload photo
    addProduct.onUploadError(function (file, code) {
        addProduct.upload_error_tip.el.text(Can.msg.ERROR_TEXT[code]);
        addProduct.upload_error_tip.el.removeClass("hidden");
    });

    addProduct.uploaderReady();

    addProduct.onUploadSuccess(function (oFile, jStatus) {
        addProduct.upload_error_tip.el.addClass("hidden");
        addProduct.input_hide.val(addProduct.uploader.getFileNameList());
    });
});
