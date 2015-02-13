/**
 * buyer my setting
 * @Author: Allenice Mo
 * @Version: 1.0
 * @Update: 13-5-27
 */
;(function(Can, Module){
    'use strict';

    var oConfig = Can.util.Config.buyer;

    //加载双向绑定模板引擎
    Can.importJS([
        'js/framework/utils/two-way-tpl.js',
        'js/framework/jquery/jquery.validationEngine-en.js',
        'js/utils/windowView.js'
    ]);
    var template = Can.util.TWtemplate;

    Module.mySettingModule = Can.extend(Module.BaseModule, {
        id: 'mySettingModuleId',
        title: Can.msg.MODULE.MY_SETTING.TITLE,
        requireUiJs: [],
        actionJs: [],
        alertWin:null,
        constructor: function (jCfg) {
            Can.apply(this, jCfg || {});
            Module.mySettingModule.superclass.constructor.call(this);
        },
        startup: function () {
            Module.mySettingModule.superclass.startup.call(this);
        },
        goToURL: function (sURL) {
            this._goToURL = sURL;
            this.routeMark();
            var self = this;
            template.load('js/buyer/view/mySettingModule.html', function(tpl){
                self._$Tpl = $(tpl);
                self.contentEl.html(self._$Tpl.find("#tpl-nav-bar").clone().html());
                self.oNavAnt = template(self.contentEl.find(".mod-col"),{
                    events:{
                        render: function(){
                            self.onNavRender();
                        }
                    }
                });
            });
        },
        onNavRender:function(){
            var self = this;
            var actionIndex = 0;

            switch (self._goToURL){
                case Can.util.Config.buyer.mySetting.setAccount:
                    actionIndex = 2;
                    break;
                case Can.util.Config.buyer.mySetting.setBusiness:
                    actionIndex = 3;
                    break;
                case Can.util.Config.buyer.mySetting.personProfile:
                    actionIndex = 0;
                    break;
                default:
                    actionIndex = 1;
                    break;
            }
            var $curAct = self.contentEl.find('.my-apps a').eq(actionIndex);
            $curAct.addClass('cur');
            $curAct.siblings('.bc').addClass('cur-mark').css({'top':'10px'});
            var act = $curAct.attr('act');
            if(self[act]){
                self.contentEl.find('.main').empty();
                self[act]();
            }
            $.ajax({
               url:oConfig.mySetting.getIntegrity,
               success: function(jData){
                   if(jData && jData['status'] == 'success'){
                       var integrity = parseInt(jData.data);
                       if(isNaN(integrity)) integrity = 0;
                       self.oNavAnt.set('integrity',integrity);
                   }
               }
            });
        },
        check: function($checkboxes){
            var $parent = $checkboxes.parents('.el-cont');
            var checkedCount = $parent.find("input:checked").length;
            if (checkedCount <= 0) {
                if ($parent.children('.fm-error').length <= 0) $parent.append("<div class=\"fm-error\">* this filed is required</div>");
                return false;
            }
            return true;
        },
        // set personal profile
        showPP: function(){
            var self = this;

            var bindData = function(oData){
                self.contentEl.find(".main").html(self._$Tpl.find("#tplPP").clone().html());
                oData.buyer.buyerAbsloutePhoto = oData.imageUrl + "/" + oData.buyer.buyerPhoto;

                if(Can.util.Config.lang != 'en'){
                    $.each(oData.countryList, function(index, item){
                        item.enName = item.cnName;
                    });
                }

                var oAnt = template(self.contentEl.find('.main'),{data: oData});
                var $form = self.contentEl.find("#set-personal-form");

                if(oData.buyer.buyerPhoto){
                    oAnt.el.find("#gkcb").attr("checked",true);
                }

                oAnt.set("countryId",oData.buyer.countryId.toString());
                $form.find(".tips-upload").css({"padding-left":"5px"});

                oAnt.el.find('[name=profile]').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){
                    oAnt.set('buyer.buyerAbsloutePhoto',oData.abslouteUrl);
                    oAnt.el.find("#gk").val(oData.url);
                });



                oAnt.el.find('form').bind('validated', function(){
                    var sData = $(this).serialize();
                    $.ajax({
                        url: oConfig.mySetting.savePersonProfile,
                        type: 'POST',
                        data: sData,
                        beforeSend: function(){
                            oAnt.el.find("#submit").hide();
                            oAnt.el.find("#loading").removeClass('hidden');
                        },
                        complete: function(){
                            oAnt.el.find("#submit").show();
                            oAnt.el.find("#loading").addClass('hidden');
                        },
                        success: function(jData){
                            if (jData.status == "success"){
                                self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_SUCCESS);
                            }else{
                                self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_ERROR);
                            }
                        }
                    });
                });

                $form.find("#submit").click(function(){
                    $form.trigger("submit");
                });
            };

            $.ajax({
                url: Can.util.Config.buyer.mySetting.personProfile,
                success:function(jData){
                    if(jData && jData['status'] == "success"){
                        var oData = jData.data || {};
                        bindData(oData);
                    }else{
                        Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                    }
                }
            });
        },
        // set company profile
        showCP: function(){
            var self = this;
            this.contentEl.find(".main").html(this._$Tpl.find("#tplCP").clone().html());
            this.contentEl.find(".tab-s2 a").click(function(){
                $(this).siblings('.cur').removeClass('cur');
                $(this).addClass('cur');

                var act = $(this).attr('act');
                if(self[act]){
                    self.contentEl.find('.main .companyWrap').empty();
                    self[act]();
                }
                return false;

            }).eq(0).click();
        },
        // account setting
        showAS: function(){
            Can.importJS(['js/framework/jquery/jQuery.md5.js']);
            var self = this;

            var bindData = function(oData){
                self.contentEl.find(".main").html(self._$Tpl.find("#tplAS").clone().html());

                oData.buyer.oldEmail = oData.buyer.email;
                var oAnt = template(self.contentEl.find('.main'),{data: oData});

                // 隐私设置
                var $privacy = self.contentEl.find("#privacy");
                if(!oData.isOpenImg){
                    $privacy.find("#avatar").addClass('privacy-secrecy');
                }
                if(!oData.isOpenInfo){
                    $privacy.find("#cont-info").addClass('privacy-secrecy');
                }
                $privacy.find('.op').click(function(){
                    var which = $privacy.find('.op').index(this);
                    var $parent = $(this).parents(".field");
                    var isPublic = !$parent.hasClass('privacy-secrecy');

                    if(isPublic){
                        $parent.addClass('privacy-secrecy');
                    }else{
                        $parent.removeClass('privacy-secrecy');
                    }

                    var status = isPublic? 0 : 1;
                    $.post(oConfig.mySetting.setPublicInfo,{'which':which,'status':status},function(jData){
                        if(jData && jData['status'] == "success"){
                            self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_SUCCESS);
                        }else{
                            self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_ERROR);
                        }
                    });
                });

                var $emailForm = self.contentEl.find('#form-acc');
                // 检测邮箱登录激活
                $.ajax({
                    url:oConfig.mySetting.isEmailActivated,
                    success:function(jData){
                        if(jData.status && jData.status === 'success'){
                            if(jData.data && jData.data.result){
                                $emailForm.find("#email-activate").hide();
                            }else if(jData.data && !jData.data.result) {
                                $emailForm.find("#email-activate").show();
                            }
                        }
                    }
                });
                // 点击编辑邮箱
                $emailForm.find("#email-edit").click(function(){
                    var $parent = $(this).parents(".field");
                    var $text = $parent.find(".text");
                    var $textbox = $parent.find("input");

                    $parent.addClass("s-email-edit");
                    $textbox.val($text.text()).focus();
                });
                // 取消编辑
                $emailForm.find("#email-edit-cancel").click(function(){
                    var $parent = $(this).parents(".field");
                    var $text = $parent.find(".text");
                    var $textbox = $parent.find("input");
                    $textbox.val($text.text());
                    $parent.removeClass("s-email-edit");

                    //删除所有的错误提示
                    $parent.find(".fm-error").remove();
                    $parent.find("input").removeClass('a-error');
                });
                // 保存邮箱
                $emailForm.find("#email-edit-save").click(function(){
                    $emailForm.trigger("submit");
                });
                $emailForm.bind('validated', function(){
                    var $this = $(this);
                    if($this.data('sending')){
                        return;
                    }

                    var $field = $this.find("#email");
                    var newEmail = $.trim($field.val());
                    var oldEmail = $.trim($this.find("#oldEmail").text());

                    if (newEmail == oldEmail) {
                        $this.find("#email-edit-cancel").click();
                        return;
                    }

                    //ajax验证邮箱
                    $.ajax({
                        url:oConfig.mySetting.checkEmail,
                        data:{
                            "email": newEmail
                        },
                        beforeSend:function(xhr,settings){
                            $this.data("sending",true);
                        },
                        complete:function(xhr,settings){
                            $this.data("sending",false);
                        },
                        success:function(res){
                            var isExisted = res.data.isExist;
                            if (!isExisted) {
                                // 发邮件
                                $emailForm.find("#email-activate").click();

                                self.onSuccess($field);
                                $emailForm.find("#email-edit-cancel").click();
                            }
                            else {
                                self.onError($field,'The email have been activated. Please try another one.');
                            }

                        }
                    });
                });
                // 点击邮箱登录激活
                $emailForm.find("#email-activate").click(function(){
                    var $this = $(this);
                    if($this.data("sending")){
                        return;
                    }
                    var win = null;
                    var newEmail = $.trim($emailForm.find("#email").val());
                    $.ajax({
                        type: 'POST',
                        url:oConfig.mySetting.sendEmail,
                        data:{
                            'email':newEmail
                        },
                        beforeSend:function(xhr,settings){
                            $this.data("sending",true);
                            $emailForm.find("#email-loading").css({"display":"inline-block"});
                        },
                        complete:function(xhr,setting){
                            $this.data("sending",false);
                            $emailForm.find("#email-loading").css({"display":"none"});
                        },
                        success:function(jData){
                            if(jData.status && jData.status === 'success'){
                                var url = "";
                                if(jData.data && jData.data.loginPage){
                                    url = jData.data.loginPage;
                                }

                                var html ='<div class="xxx" style="padding: 20px;"><p class="txt"><h3 style="color: #575757; font-size: 14px; font-weight: bold;">Email Login Activation </h3><div style="padding-top: 10px; font-size: 12px;">A verification email has been sent to your email <br>(<span style="color: #e04d2c">'+newEmail+'</span>) to complete actication.</div></p><div class="mod-actions" style="text-align: center; margin-top: 15px;"><a id="ice-mailbox" href="javascript:;" class="btn btn-s11"><span>Go to mailbox</span></a></div></div>';

                                if(Can.util.Config.lang != 'en'){
                                    html ='<div class="xxx" style="padding: 20px;"><p class="txt"><h3 style="color: #575757; font-size: 14px; font-weight: bold;">邮箱登录激活</h3><div style="padding-top: 10px; font-size: 12px;">验证邮件已发送到您的注册邮箱 <br>(<span style="color: #e04d2c">'+newEmail+'</span>) ,请前往邮箱完成验证。</div></p><div class="mod-actions" style="text-align: center; margin-top: 15px;"><a id="ice-mailbox" href="javascript:;" class="btn btn-s11"><span>去验证</span></a></div></div>';
                                }

                                if(!win){
                                    win = new Can.view.pinWindowView({
                                       width:320
                                   });
                                }

                                win.setContent(html);
                                win.show();

                                if(url){
                                   win.content.el.find('#ice-mailbox').attr({'href':url,'target':'_blank'});
                                }
                                win.content.el.find('#ice-mailbox').click(function(){
                                   win.close();
                                });

                            }else{
                                self.showTips("Failed to send activation email !");
                            }
                        },
                        error:function(e){
                            self.showTips("Failed to send activation email !");
                        }
                    });
                });
                
                //密码大小写检测
                oAnt.el.find('input[type=password]').keypress(function(e){
                    var s = String.fromCharCode( e.which );
                    if ( s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey ) {
                        var _tips = $(this).parent().find('.pwdtips').length;
                        if(_tips>0){
                            return;
                        }else{
                           $(this).parent().append('<span class="icons capslock-1"></span><div class="pwdtips"><span class="icons allow-0"></span>'+Can.msg.MODULE.MY_SETTING.PWD_TIPS+'</div>');
                        }
                    }else{
                        oAnt.el.find('.capslock-1').remove();
                        oAnt.el.find('.pwdtips').remove();
                    }
                });
                oAnt.el.find('input[type=password]').blur(function() {
                    oAnt.el.find('.capslock-1').remove();
                    oAnt.el.find('.pwdtips').remove();
                });
                
                var $pwdForm = self.contentEl.find("#password-holder");
                // 点击显示修改密码
                self.contentEl.find("#edit-password").click(function() {
                    $(this).parents(".field").hide();
                    $pwdForm.slideDown(200);
                });
                // 取消修改密码
                $pwdForm.find("#cancel").click(function() {
                    var $pwdfield = self.contentEl.find("#edit-password").parents(".field");
                    $pwdfield.show();
                    $pwdForm.slideUp(200);

                    //删除所有的错误提示
                    $pwdForm.find(".fm-error").remove();
                    $pwdForm.find(".field input").removeClass('a-error');
                });
                // 验证当前密码
                $pwdForm.find("#cur-pwd").data("status", false).blur(function() {
                    var $field = $(this);
                    var curPwd = $field.val();
                    if (curPwd == "") {
                        self.onError($field, "* This field is required");
                        return;
                    }
                    $.post(oConfig.mySetting.checkPassword, {"password": $.md5(curPwd)}, function(jData) {
                        var oData = jData.data || {};
                        var status = oData.result;
                        $pwdForm.find("#cur-pwd").data("status", status);
                        if (status) self.onSuccess($field);
                        else self.onError($field, Can.msg.TEXT_BUTTON_VIEW.CHECK_PASSWORD);
                    });
                });

                $pwdForm.bind('validated',function(){
                    //检测当前密码正不正确
                    var pwdStatus = $pwdForm.find("#cur-pwd").data("status");
                    if (!pwdStatus) {
                        self.onError($pwdForm.find("#cur-pwd"), Can.msg.TEXT_BUTTON_VIEW.CHECK_PASSWORD);
                        return;
                    }

                    var $pwdField = self.contentEl.find("#edit-password").parents(".field");

                    var pwd = $pwdForm.find("#new-pwd").val();
                    var confirmPwd = $pwdForm.find("#confirm-pwd").val();

                    if($.trim(pwd) != $.trim(confirmPwd)){
                        self.onError($pwdForm.find("#confirm-pwd"),Can.msg.TEXT_BUTTON_VIEW.COMFIRM_PASSWORD);
                        return;
                    }

                    if (pwd != "") {
                        pwd = $.md5(pwd);
                    }
                    var old_pwd = $("#cur-pwd").val();
                    if(old_pwd != ""){
                        old_pwd = $.md5(old_pwd);
                    }

                    $pwdForm.find("#save").hide();
                    $pwdForm.find("#cancle").hide();
                    $pwdForm.find("#loading").removeClass('hidden');
                    $.post(oConfig.mySetting.resetPassword, {
                        oldPassword: old_pwd,
                        newPassword: pwd
                    }, function(res) {
                        $pwdForm.find("#save").show();
                        $pwdForm.find("#cancle").show();
                        $pwdForm.find("#loading").addClass('hidden');
                        if (res.status == "success"){
                            self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_SUCCESS);
                            $pwdField.show();
                            $pwdForm.hide();
                        }else{
                            self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_ERROR);
                        }
                    });
                });

            };

            $.ajax({
                url: Can.util.Config.buyer.mySetting.setAccount,
                success:function(jData){
                    if(jData && jData['status'] == "success"){
                        var oData = jData.data || {};
                        bindData(oData);
                    }else{
                        Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                    }
                }
            });
        },
        // business setting
        showBS: function(){
            var self = this;

            var bindData = function(oData){
                self.contentEl.find(".main").html(self._$Tpl.find("#tplBS").clone().html());

                if(Can.util.Config.lang != 'en'){
                    $.each(oData.categoryList, function(index, item){
                        item.categoryEname = item.categoryName;
                    });
                }

                var oAnt = template(self.contentEl.find('.main'),{data: oData});
                var $form = self.contentEl.find("#businessFormId");

                // 选择分类
                $form.find('#select-btn').click(function(){
                    var categoryArr = [];
                    $form.find(".categoryItem").each(function() {
                        var item = {};
                        item.id = $(this).attr("data-id");
                        item.text = $(this).attr("data-text");
                        categoryArr.push(item);
                    });
                    var $field = $form.find("#categorys");
                    var nMaxSelect = 3;
                    fCanGetCate && fCanGetCate($field, nMaxSelect, categoryArr, function(idText, nameText) {
                        var idArr = idText.split('┃');
                        var nameArr = nameText.split(';');
                        var nameArr;
                        var categoryHtml = "";
                        var checkboxHtml = "";
                        for (var i = 0; i < idArr.length; i++) {
                            if (idArr[i] !== "" && i < 3) {
                                checkboxHtml += "<input type=\"checkbox\" name=\"categoryId\" checked=\"checked\" value=\"" + idArr[i] + "\"/>";
                                categoryHtml += "<div class=\"categoryItem\" data-id=\"" + idArr[i] + "\" data-text=\"" + nameArr[i].trim() + "\">" + nameArr[i] + "</div>";
                            }
                        }
                        $form.find("#cateCheckHolder").html(checkboxHtml);
                        $form.find("#category-data").html(categoryHtml);

                        var b2 = $("input[name=categoryId]").val() != undefined;

                        var $parent = $form.find("#categorys").parents('.el-cont');
                        if (!b2) {
                            if ($parent.children('.fm-error').length <= 0) $parent.append("<div class=\"fm-error\">* this filed is required</div>");
                        } else {
                            if ($parent.children('.fm-error').length > 0) $parent.find('.fm-error').remove();
                        }

                    });
                });


                $form.bind('validated', function(){
                    var sData = $(this).serialize();
                    $.ajax({
                        url: oConfig.mySetting.saveBusiness,
                        type: 'POST',
                        data: sData,
                        beforeSend: function(){
                            oAnt.el.find("#submit").hide();
                            oAnt.el.find("#loading").removeClass('hidden');
                        },
                        complete: function(){
                            oAnt.el.find("#submit").show();
                            oAnt.el.find("#loading").addClass('hidden');
                        },
                        success: function(jData){
                            if (jData.status == "success"){
                                self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_SUCCESS);
                            }else{
                                self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_ERROR);
                            }
                        }
                    });
                });

                $form.find("#submit").click(function(){
                    var b1 = self.check($form.find("input[name=companyType]"));
                    var b2 = $form.find("input[name=categoryId]").val() != undefined;

                    var $parent = $form.find("#categorys").parents('.el-cont');
                    if (!b2) {
                        if ($parent.children('.fm-error').length <= 0) $parent.append("<div class=\"fm-error\">* this filed is required</div>");
                    } else {
                        if ($parent.children('.fm-error').length > 0) $parent.find('.fm-error').remove();
                    }
                    if (!b1 || !b2) return;

                    $form.trigger("submit");
                });

                $form.find("input:checkbox").click(function(e) {
                    if (!self.check($(this))) return;
                    var $parent = $(this).parents('.el-cont');
                    var checked = $(this).attr("checked") == "checked";
                    var hasErr = $parent.children('.fm-error').length > 0;
                    if (checked && hasErr) {
                        $(this).parents('.el-cont').find('.fm-error').remove();
                    }
                });
            };

            $.ajax({
                url: Can.util.Config.buyer.mySetting.setBusiness,
                success:function(jData){
                    if(jData && jData['status'] == "success"){
                        var oData = jData.data || {};
                        bindData(oData);
                    }else{
                        Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                    }
                }
            });
        },
        // company profile -> basic info
        showBI: function(){
            var self = this;

            var bindData = function(oData){
                self.contentEl.find(".main .companyWrap").html(self._$Tpl.find("#tplBI").clone().html());

                oData.buyerCompany.companyLogo = oData.buyerCompany.companyLogo || '404.jpg';
                oData.buyerCompany.companyLogo2 = oData.imgeUrl + "/" + oData.buyerCompany.companyLogo;
                oData.year = [];
                for(var i=1960; i<=2030; i++ ){
                    oData.year.push({val:i});
                }

                if(Can.util.Config.lang != 'en'){
                    $.each(oData.countryList, function(index, item){
                        item.enName = item.cnName;
                    });
                }

                var oAnt = template(self.contentEl.find('.main .companyWrap'),{data: oData});
                var $form = self.contentEl.find("#set-cb-form");

                for(var ruleName in $.validationEngineLanguage.allRules){
                    var rule = $.validationEngineLanguage.allRules[ruleName] || {};
                    if(rule.regex){
                        var strRegex = rule.regex.toString();
                        strRegex = strRegex.substr(1,strRegex.lastIndexOf('/')-1);
                        rule.strRegex = strRegex;
                    }
                }
                oAnt.set("countryId",oData.buyerCompany.countryId.toString());
                if(oData.buyerCompany.companyFoundYear){
                    oAnt.set("foundYear",oData.buyerCompany.companyFoundYear.toString());
                }
                oAnt.set("rules", $.validationEngineLanguage.allRules);

                $form.find(".tips-upload").css({"padding-left":"5px"});
                oAnt.el.find('[name=logo]').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){
                    oAnt.set('buyerCompany.companyLogo2',oData.abslouteUrl);
                    oAnt.el.find("input[name=companyLogo]").val(oData.url);
                });

                // 介绍文字计数
                $form.find('#companyDesc').keyup(function(e){
                    var length = $(this).val().length;
                    var left = 1000 - length;
                    if (left >= 0) {
                        $form.find("#cd-tips").html("<span>" + left + "</span> characters left");
                    } else {
                        $form.find("#cd-tips").html("<span>" + Math.abs(left) + "</span> characters more");
                    }
                }).trigger('keyup').css({'float':'none','width':'613px','resize':'none'});
                $form.find('#cd-tips').css({'border':'1px solid #ddd','border-top':'0'});

                oAnt.el.find('form').bind('validated', function(){
                    var sData = $(this).serialize();
                    $.ajax({
                        url: oConfig.mySetting.saveCompanyProfile,
                        type: 'POST',
                        data: sData,
                        beforeSend: function(){
                            oAnt.el.find("#submit").hide();
                            oAnt.el.find("#loading").removeClass('hidden');
                        },
                        complete: function(){
                            oAnt.el.find("#submit").show();
                            oAnt.el.find("#loading").addClass('hidden');
                        },
                        success: function(jData){
                            if (jData.status == "success"){
                                self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_SUCCESS);
                            }else{
                                self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_ERROR);
                            }
                        }
                    });
                });

                $form.find("#submit").click(function(){
                    $form.trigger("submit");
                });
            };

            $.ajax({
                url: Can.util.Config.buyer.mySetting.companyProfile,
                success:function(jData){
                    if(jData && jData['status'] == "success"){
                        var oData = jData.data || {};
                        bindData(oData);
                    }else{
                        Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                    }
                }
            });
        },
        // company profile -> trading info
        showTI: function(){
            var self = this;

            var bindData = function(oData){
                self.contentEl.find(".main .companyWrap").html(self._$Tpl.find("#tplTI").clone().html());

                var oAnt = template(self.contentEl.find('.main .companyWrap'),{data: oData});
                var $form = self.contentEl.find("#companyprofileFormId");

                $form.find("input[name=companyType]").each(function(){
                    if(oData.buyerCompany.companyType.indexOf($(this).val()) >=0){
                        $(this).attr("checked",true);
                    }
                });
                $form.find("input[name=companyNature]").each(function(){
                    if(oData.buyerCompany.companyNature.indexOf($(this).val()) >=0){
                        $(this).attr("checked",true);
                    }
                });
                $form.find("input[name=yearBuyingAmt]").each(function(){
                    if($(this).val() == oData.buyerCompany.yearBuyingAmt){
                        $(this).attr("checked",true);
                    }
                });
                $form.bind('validated', function(){
                    var sData = $(this).serialize();
                    $.ajax({
                        url: oConfig.mySetting.saveCompanyBizProfile,
                        type: 'POST',
                        data: sData,
                        beforeSend: function(){
                            oAnt.el.find("#submit").hide();
                            oAnt.el.find("#loading").removeClass('hidden');
                        },
                        complete: function(){
                            oAnt.el.find("#submit").show();
                            oAnt.el.find("#loading").addClass('hidden');
                        },
                        success: function(jData){
                            if (jData.status == "success"){
                                self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_SUCCESS);
                            }else{
                                self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_ERROR);
                            }
                        }
                    });
                });

                $form.find("#submit").click(function(){
                    var b1 = self.check($form.find("input[name=companyType]"));
                    var b2 = self.check($form.find("input[name=companyNature]"));
                    var b3 = $form.find("input:radio[name=yearBuyingAmt]:checked").val() != null;
                    if (!b3) {
                        var $parent = $form.find("#radioParent");
                        if ($parent.children('.fm-error').length <= 0) {
                            $parent.append("<div class=\"fm-error\">* this filed is required</div>");
                        }
                    }
                    if (!b1 || !b2 || !b3) {
                        return;
                    }

                    $form.trigger("submit");
                });

                $form.find("input:checkbox,input:radio").click(function(e) {
                    if (!self.check($(this))) return;
                    var $parent = $(this).parents('.el-cont');
                    var checked = $(this).attr("checked") == "checked";
                    var hasErr = $parent.children('.fm-error').length > 0;
                    if (checked && hasErr) {
                        $(this).parents('.el-cont').find('.fm-error').remove();
                    }
                });
            };

            $.ajax({
                url: Can.util.Config.buyer.mySetting.companyBizProfile,
                success:function(jData){
                    if(jData && jData['status'] == "success"){
                        var oData = jData.data || {};
                        bindData(oData);
                    }else{
                        Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                    }
                }
            });
        },
        routeMark: function(){
            if(!this._goToURL) return;
            switch(this._goToURL){
                case Can.util.Config.buyer.mySetting.setAccount:
                    Can.Route.mark('/setAccount');
                    break;
                case Can.util.Config.buyer.mySetting.setBusiness:
                    Can.Route.mark('/setBusiness');
                    break;
                case Can.util.Config.buyer.mySetting.personProfile:
                    Can.Route.mark('/personProfile');
                    break;
                default:
                    Can.Route.mark('/companyProfile');
            }
        },
        personProfile: function(){
            this.goToURL(Can.util.Config.buyer.mySetting.personProfile);
        },
        setAccount: function(){
            this.goToURL(Can.util.Config.buyer.mySetting.setAccount);
        },
        setBusiness: function(){
            this.goToURL(Can.util.Config.buyer.mySetting.setBusiness);
        },
        setCompany: function(){
            this.goToURL(Can.util.Config.buyer.mySetting.companyBizProfile);
        },
        // 表单项验证失败
        onError:function($field,msg){
            if (!$field.hasClass("a-error")) {
                $field.addClass("a-error");
                var $parent = $field.parents('.el-cont');
                var errCount = $parent.children('.fm-error').length;
                if (errCount < 1) {
                    $parent.append("<div class=\"fm-error\">" + msg + "</div>");

                } else {
                    $parent.children('.fm-error').html(msg);
                }
            }
        },
        // 表单项验证成功
        onSuccess:function($field){
            if (!$field) return;
            var $sb = $field.siblings();
            if ($sb.hasClass('a-error')) {
                $field.removeClass('a-error');
                return;
            }
            //var $field = $(this);
            var $parent = $field.parents('.el-cont');
            if ($field.hasClass('a-error')) {
                $field.removeClass('a-error');
                $parent.find('.fm-error').remove();
            }
        },
        showTips: function(sMsg){
            if(!this.alertWin){
                this.alertWin = new Can.view.alertWindowView({
                    width:250
                });
            }
            this.alertWin.setContent("<div style='padding: 10px 10px 10px 20px; font-size: 14px;'>"+sMsg+"</div>");
            this.alertWin.show();
        }

    });
})(Can, Can.module);
