/*
 * register window for v2
 * Author: Allenice
 * Date: 2014-2-17
 * */

(function(Can){
    Can.importJS([
        'js/framework/utils/two-way-tpl.js',
        'js/framework/utils/ui/window/baseWindow.js',
        'js/framework/utils/ui/window/actionWindow.js',
        'js/framework/jquery/jQuery.md5.js'
    ]);
    var template = Can.util.TWtemplate;

    var ga = window.ga || function(){};
    var gaEvent, gaPrefix, gaClose = "";

    if(location.pathname.indexOf('/buyinglead/') != -1){
        gaEvent = "BUYINGLEAD";
        gaPrefix = "lead";
    }else if(location.pathname.indexOf('/Inquire/') != -1){
        gaEvent = "INQUIRY";
        gaPrefix = "inquiry";
    }

    var api = {
        vcode: '/cfone/code/loginCode.cf',
        getCountries: '/cfone/user/loadVerifyCountryInfo.cf',
        verifyId: '/cfone/user/verifyCantonfairId.cf',
        verifyPhoto: '/cfone/user/verifyAppearPhotoInfo.cf',
        verifyCode: '/cfone/user/verifyRancode.cf',
        loadPhoto: '/cfone/user/loadVerifyPhotoInfo.cf',
        postVerify: '/cfone/user/postVerifyIdentityInfo.cf',
        loadBuyerInfo: '/cfone/user/loadBuyerInfo.cf',
        loadEdmBuyerInfo: '/cfone/outsideproduct/findActivationInfo.cf',
        postBuyerInfo: '/cfone/user/postBuyerInfo.cf',
        edmActivate: '/cfone/outsideproduct/activate.cf',
        createBuyerInfo: '/cfone/buyer/registerBuyer.cf',
        login: '/cfone/j_spring_security_check',
        verifyEmail: '/cfone/user/existAccount.cf',
        isActived: '/cfone/user/accountIsActived.cf'

    }

    var errorMsg = {
        email: '* This email format is not recognized. Please check again.',
        password: Can.msg.MODULE.MY_SETTING.TIPS_TITLE_3,
        cantonfairId: 'This ID format is not recognized. Please check again.',
        idNotExist: 'This Canton Fair ID is not existed. Please check again.',
        codeNotMatch: "The characters you entered didn't match the word verification. Please try again.",
        required: '* This field is required!'
    };

    var pattern = {
        password: '^[a-zA-Z0-9]{6,20}$',
        cantonfairId:'^(\\d{0}|\\d{9,9}|\\d{15,15})$',
        email: '^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    }

    var contentAnt;

    // '提示窗口'
    var alertWin = new Can.util.ui.window.ActionWindow({'zIndex': 1002});

    Can.util.ui.window.RegisterWindow = Can.extend(Can.util.ui.window.BaseWindow, {
        constructor: function(options){

            options = $.extend({
                'width': 470,
                'cid': null,
                'isEdm': false,
                'onSuccess': function(data){}
            }, options);

            Can.util.ui.window.RegisterWindow.superclass.constructor.call(this, options);
        },
        init: function(){
            var self = this;
            Can.util.ui.window.RegisterWindow.superclass.init.call(this);
            template.load('js/framework/utils/ui/window/registerWindow.html',function(tpl){
                self.setContent(tpl);
                template(self._$Tpl.find('.content'), {
                    events:{
                        render: function(){
                            self._do(this); // do logic
                        }
                    }
                });
            });
        },

        _do: function(oAnt){
            var self = this;
            contentAnt = oAnt;
            contentAnt.set('errorMsg', errorMsg);
            contentAnt.set('pattern', pattern);

            self._onWinResize();
            /*
             * 判断是否在有效期时间内
             * {{saveTime}} 生产日期
             * {{time}} 有效期
             */
            function isValidity(dateManufacture,validity){
                var validTime  = validity * 24 * 60 * 60 * 1000,
                    nowTime = new Date().valueOf(),
                    intervalTime = nowTime - dateManufacture;
                if(intervalTime >= validTime ){
                    return false
                } else {
                    return true
                }
            }
            // get country list
            var countries = localStorage.countries && JSON.parse(localStorage.countries);
            var countriesTime = localStorage.countriesTime || 0;
            var isCountriesBack = isValidity(countriesTime,7); //数据的有效期是7天

            if(isCountriesBack && countries && countries[0] && countries[0].messageEn){
                contentAnt.set('countryList', countries);
            } else{
                $.get(api.getCountries, function(jData){
                    if(jData && jData['status'] == 'success'){
                        contentAnt.set('countryList', jData.data);
                        localStorage.countries = JSON.stringify(jData.data);
                        localStorage.countriesTime = new Date().valueOf();
                    }
                });
            }
            // set password
            var $password = self._$Tpl.find('#password');
            self._createViewPwd($password);

            if(self.settings.cid || self.settings.isEdm){
                // '激活'
                contentAnt.set('cid', self.settings.cid);
                self._activate();
            }else{
                // '注册'
                self._createAccount();
            }

            //edm 隐藏选项卡
            if(self.settings.cid || self.settings.isEdm){
                self._$Tpl.find('.win-tit-tab').addClass('hidden');
                self._$Tpl.find('.title').removeClass('hidden');
            }

            var $panel = self._$Tpl.find('#activate');
            // 是否激活
            var isActivate = false;
            contentAnt.el.find('#activate').bind('validated', function(){
                var cid = contentAnt.get('cid'), data, url;
                data = $panel.serialize();

                //data += "&countryCode="+$panel.find('input[name=countryCode]').val();
                if(isActivate && $panel.find('input[name=cantonfairId]').val() !='') {
                    self.postUrl = api.postBuyerInfo;
                    data += "&company.companyName=" + $panel.find('input[name=companyName]').val();
                } else if(self.settings.cid || self.settings.isEdm) {
                    self.postUrl = api.edmActivate;
                } else {
                    self.postUrl = api.createBuyerInfo;
                }
                $.ajax({
                    url: self.postUrl,
                    type: 'POST',
                    data: data,
                    beforeSend: function(){
                        $panel.find('.btn-orange').hide();
                        $panel.find('.win-loading').show();
                    },
                    complete: function(){
                        $panel.find('.btn-orange').show();
                        $panel.find('.win-loading').hide();
                    },
                    success: function(jData){
                        if(jData && jData['status'] == 'success'){
                            // '登录'
                            var userAccount = $panel.find('input[name=email]').val();
                            var password = $panel.find('input[name=password]').val();

                            if(isActivate && $panel.find('input[name=cantonfairId]').val() !=''){
                                userAccount = cid;
                            }

                            $.post(api.login, {"j_username":userAccount,"j_password":password}, function(res){
                                if(res && res.status == 'success'){
                                    $('body').trigger('login-success');
                                    self.close();
                                    self.settings.onSuccess.call(self, res.data);
                                }else{
                                    alertWin.setTitle('Message').show('Account creation is successful, but login fails!');
                                }
                            });
                        }else{
                            alertWin.setTitle('Create account error!').show('Create account error!');
                        }
                    }
                });

                // 'ga统计'
                if (gaEvent){
                    ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-confirm');
                }

            });

			 //失去焦点验证邮箱
           $panel.find('input[name=email]').blur(function(){
           	// '验证邮箱'
               var email = $panel.find('input[name=email]').val();
           	    $.post(api.isActived, {email: email}, function(jData){
                   //console.log(jData.data.isActived);
                   if(jData.data.isActived){
                       self._showError($panel.find('input[name=email]'),'* This email is already taken');
                   }
               });
           });
           //
           //失去焦点验证ic卡
           //$panel.find('#ic').parent().after('<div class="fm-error hidden"></div>');
           $panel.find('input[name=cantonfairId]').blur(function(){
            // '验证邮箱'
                var _this = $(this);
                    email = _this.val(),
                    alt = _this.attr('error'),
                    reg = /^(\d{0}|\d{9}|\d{15})$/;
                    if(reg.test(email)){
                        self._hideError($panel.find('input[name=cantonfairId]'));
                    } else {
                        self._showError($panel.find('input[name=cantonfairId]'), '* This ID format is not recognized. Please check again.');
                    }
           });

            // '选择国家同时改变countryCode'
            $panel.find('select[name=countryId]').change(function(){
                $panel.find('input[name=countryCode]').val($(this).find('option:selected').data('code'));
            });

            // '填写提示'
            $panel.find('input[name=email], #password').focus(function(){
                self._hideError($(this));
                $(this).siblings('.fm-tips').show();
            }).blur(function(){
                $(this).siblings('.fm-tips').hide();
            });

            // 验证邮箱与ic卡匹配， 快速注册账号

            $panel.find('input[name=email]').change(function(){
                setTimeout(function(){
                    var email = $panel.find('input[name=email]').val();
                    var cid = $panel.find('input[name=cantonfairId]').val();
                    if(($panel.find('input[name=email]').hasClass('a-error') || $panel.find('input[name=cantonfairId]').hasClass('a-error')) || cid == '') return;
                    $.get("/cfone/user/checkMatchAndReturnBuyerInfo.cf", {email: email, cantonfairId: cid}, function(result){
                        if('error' == result.status){
                            self._showError($panel.find('input[name=cantonfairId]'),'* ' + result.message); console.log(result.status);
                            return;
                        }
                        if(result.data){
                            $panel.find('input[name=firstName]').val() || $panel.find('input[name=firstName]').val(result.data.firstName);
                            $panel.find('input[name=companyName]').val() || $panel.find('input[name=companyName]').val(result.data.company.companyName);
                            $panel.find('select[name=countryId]').val() || $panel.find('select[name=countryId]').val(result.data.company.countryId);
                            $panel.find('input[name=countryCode]').val() || $panel.find('input[name=countryCode]').val(result.data.countryCode);
                            $panel.find('input[name=areaCode]').val() || $panel.find('input[name=areaCode]').val(result.data.areaCode);
                            $panel.find('input[name=phoneCode]').val() || $panel.find('input[name=phoneCode]').val(result.data.phoneCode);
                            isActivate = true;
                        }
                    });
                }, 30);
            });
            $panel.find('input[name=cantonfairId]').change(function(){
                setTimeout(function(){
                    var email = $panel.find('input[name=email]').val();
                    var cid = $panel.find('input[name=cantonfairId]').val();
                    if(($panel.find('input[name=email]').hasClass('a-error') || $panel.find('input[name=cantonfairId]').hasClass('a-error')) || email == '' || cid == '') return;
                    $.get("/cfone/user/checkMatchAndReturnBuyerInfo.cf", {email: email, cantonfairId: cid}, function(result){
                    	if('error' == result.status){
                            self._showError($panel.find('input[name=cantonfairId]'),'* ' + result.message);
                            return;
                        }
                        if(result.data){
                            $panel.find('input[name=firstName]').val() || $panel.find('input[name=firstName]').val(result.data.firstName);
                            $panel.find('input[name=companyName]').val() || $panel.find('input[name=companyName]').val(result.data.company.companyName);
                            $panel.find('select[name=countryId]').val() || $panel.find('select[name=countryId]').val(result.data.company.countryId);
                            $panel.find('input[name=countryCode]').val() || $panel.find('input[name=countryCode]').val(result.data.countryCode);
                            $panel.find('input[name=areaCode]').val() || $panel.find('input[name=areaCode]').val(result.data.areaCode);
                            $panel.find('input[name=phoneCode]').val() || $panel.find('input[name=phoneCode]').val(result.data.phoneCode);
                            isActivate = true;
                        }
                    });
                }, 30);
            });


             //登陆弹窗
            self._$Tpl.on('click', '#sign-in', function(){
                // console.log('das');
                var winLogin = new Can.util.ui.window.LoginWindow({
                    onSuccess:function(jData){
                        this.close();
                        //fshowInfo(true);
                    }
                });
                self.close();
                winLogin.show();
            })

            $panel.find('#create-submit').click(function(){
                var hasError = $panel.find('.a-error').length > 0;
                if(hasError) return;
                // '验证邮箱'
                var email = $panel.find('input[name=email]').val();
                var cid = contentAnt.get('cid');
                $.post(api.verifyEmail, {email: email, cantonfairId: cid}, function(jData){
                    if($.isArray(jData) && jData[1]){
                        $panel.trigger('submit');
                    }else{
                        self._showError($panel.find('input[name=email]'),'* This email is already taken');
                    }
                })
            });
        },

        // '验证id'
        _confirmId: function(){
            var self = this;
            var $panel = self._showPanel('confirm-id');

            gaClose = "-layer-close";

            // '如果已经绑定了事件，就不行要再绑定'
            if($panel.data('event-bind')) return;

            // '绑定事件'
            // '刷新验证码'
            self._$Tpl.find('.vcode img, .vcode .refresh').click(function(){
                self._$Tpl.find('.vcode img').attr('src', api.vcode+'?' +Math.random());
                // 'ga统计'
                if (gaEvent){
                    ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-code');
                }
            });

            // '不验证id，直接去注册'
            $panel.find('#quit-confirm').click(function(){
                // 'ga统计'
                if (gaEvent){
                    ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-quit');
                }
                self._createAccount();
            });

            // '检查id是否存在'
            var $cid = $panel.find('input[name=cantonfairId]');
            $panel.find('input[name=cantonfairId]').blur(function(){

                var reg = new RegExp(pattern.cantonfairId);
                if(!reg.test($cid.val())) return;

                var cid = contentAnt.get('cid');
                $.get(api.verifyId, {cantonfairId:cid}, function(jData){
                    if(jData && jData['status'] == 'success'){

                        // '开启选择验证问题'
                        $panel.find('select[name=type]').removeAttr('disabled');
                        $panel.find('input[name=var]').removeAttr('disabled');

                        // '检查头像验证次数'
                        $.post(api.verifyPhoto, {cantonfairId: cid}, function(res){
                            if(res && res['status'] == 'error'){
                                $panel.find('select[name=type] option').eq(3).remove();
                            }
                        })
                    }else{
                        self._showError($cid, errorMsg.idNotExist);
                    }
                });
            });

            // '选择问题'
            $panel.find('select[name=type]').change(function(){
                $panel.find('input[name=var]').val('');
                if($(this).val() == '4'){
                    // 'ga统计'
                    if (gaEvent){
                        ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-Avatar');
                    }

                    $panel.find('input[name=var]').hide();
                    $panel.find('input[name=var]').removeAttr('required');
                    $panel.find('.avatar-list').show();
                    $panel.find('select[name=countryId]').removeClass('hidden');

                    $.get(api.loadPhoto, {cantonfairId: contentAnt.get('cid')} ,function(jData){
                        if(jData && jData['status'] == 'success'){
                            $.each(jData.data, function(i, item){
                                var index = item.photo.lastIndexOf('.');
                                item.photo = item.photo.substring(0, index) + '_60x60_3' + item.photo.substring(index);
                            });
                            contentAnt.set('avatarList', jData.data);
                            self._onWinResize();
                        }
                    });

                }else{
                    // 'ga统计'
                    if (gaEvent){
                        switch ($(this).val()){
                            case '1':
                                ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-passport');
                                break;
                            case '2':
                                ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-tel');
                                break;
                            case '3':
                                ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-email');
                                break;
                        }

                    }

                    $panel.find('input[name=var]').show();
                    $panel.find('.avatar-list').hide();
                    $panel.find('select[name=countryId]').addClass('hidden');
                    self._onWinResize();
                }
            });

            // '选择头像'
            $panel.on('click', '.avatar-list li', function(){
                var code = $(this).find('img').data('code');
                var $var = $panel.find('input[name=var]')
                $var.val(code);
                self._hideError($var);
                $(this).siblings('li').removeClass('selected');
                $(this).addClass('selected');
            });

            // '验证验证码'
            $panel.find('input[name=code]').keyup(function(){
                var $this = $(this);
                var code = $(this).val();
                if(code && code.length == 4){
                    $.post(api.verifyCode, {'code': code, 'cantonfairId': contentAnt.get('cid')}, function(jData){
                        if(jData && jData['status'] != "success"){
                            self._showError($this, jData.message);
                        }else{
                            self._hideError($this);
                        }
                    });
                }
            }).blur(function(){
                var $this = $(this);
                var code = $(this).val();
                if(!code){
                    self._showError($this, errorMsg.required);
                }else if(code.length != 4){
                    self._showError($this, errorMsg.codeNotMatch);
                }
            });

            // '提交表单'
            $panel.bind('validated', function(){
                // 'ga统计'
                if (gaEvent){
                    ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-submit');
                }

                var data = $panel.serialize();
                $.ajax({
                    url: api.postVerify,
                    type: 'POST',
                    data: data,
                    beforeSend: function(){
                        $panel.find('.btn-orange').hide();
                        $panel.find('.win-loading').show();
                    },
                    complete: function(){
                        $panel.find('.btn-orange').show();
                        $panel.find('.win-loading').hide();
                    },
                    success: function(jData){
                        if(!jData) return;

                        if(jData.status == 'error'){
                            if(jData.errorCode == 'actived'){
                                contentAnt.set('email',jData.data);
                                self._activated();
                            }else{
                                //alertWin.setTitle('Verification Failed').show("Verification code error.");
                            	alertWin.setTitle('Verification Failed').show(jData.message);
                            }
                        }else if(jData.status == 'success'){
                            self._activate();
                        }else{
                            alertWin.alertWin.setTitle('Message').show('We have encountered an error while trying to connect to the server.');
                        }
                    }
                });
            });

            $panel.find('#con-submit').click(function(){
                var hasError = $panel.find('.fm-error').length > 0;
                if(hasError) return;

                var $code = $panel.find('input[name=code]');
                if(!$code.val()) {
                    self._showError($code, errorMsg.required);
                    return
                };

                $panel.trigger('submit');
            });

            // '事件绑定完成'
            $panel.data('event-bind', true);

        },

        // '激活流程'
        _activate: function(){
            var self = this;
            var $panel = self._showPanel('activate');

            gaClose = "-signup-close";
            $panel.find('.pic').removeClass('hidden');
            $panel.find('.create').addClass('hidden');
            $panel.find('#companyName').attr('name','company.companyName');

            // '激活相关事件绑定'
            if(!$panel.data('act-event-bind')){
                // not me
                $panel.find('#notme').click(function(){
                    self._notMe();
                });

                $panel.data('act-event-bind', true);
            }

            if(self.settings.isEdm){
                self.postUrl = api.edmActivate;
                $panel.find('#companyName').attr('name','companyName');
                $.get(api.loadEdmBuyerInfo, function(jData){
                    if(jData && jData['status'] == 'success'){
                        if(jData.data){
                            jData.data.company = {
                                companyName: jData.data.companyName
                            }
                            contentAnt.set('buyer', jData.data);
                            contentAnt.set('cid', jData.data.cantonfairId);
                            // $panel.find('.pic p').append('<input type="hidden" name="buyerUserId" value="'+jData.data.buyerUserId+'">');
                        }
                    }

                });
            }else {
                self.postUrl = api.postBuyerInfo;
                var cid = contentAnt.get('cid');
                if(!cid) {
                    alertWin.setTitle('Message').show('Canton fair id is empty!');
                    return;
                }
                $.get(api.loadBuyerInfo, {cantonfairId: cid}, function(jData){
                    if(jData && jData['status'] == 'success'){
                        if(jData.data){
                            contentAnt.set('buyer', jData.data);
                        }
                    }
                });
            }
        },

        // '注册流程'
        _createAccount: function(){
            var self = this;
            var $panel = self._showPanel('activate');
            gaClose = "-signup-close";
            self.postUrl = api.createBuyerInfo;

            $panel.find('.pic').addClass('hidden');
            $panel.find('.create').removeClass('hidden');
            $panel.find('#companyName').attr('name','companyName');

            contentAnt.set('cid', '');
            contentAnt.set('buyer', {});

            // '注册相关事件绑定'
            if(!$panel.data('create-event-bind')){
                // '有id，验证id后走激活流程'
                $panel.find('.create a').click(function(){
                    // 'ga统计'
                    if (gaEvent){
                        ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-layer-bind');
                    }

                    self._confirmId();

                });

                $panel.data('create-event-bind', true);
            }


        },

        // 'id已经被激活'
        _activated: function(){
            var self = this;
            var $panel = self._showPanel('activated');

            // sign in
           $panel.find('.sign-in').click(function(){
               self.close();
               Can.importJS(['js/framework/utils/ui/window/loginWindow.js']);
               var loginWin = new Can.util.ui.window.LoginWindow({
                   onSuccess: function(data){
                       self.settings.onSuccess.call(self, data);
                   }
               });
               loginWin.show();
           });

            // cancel
            $panel.find('.cancel').click(function(){
                self.close();
            });
        },

        // not me
        _notMe: function (){
            var self = this;
            var $panel = self._showPanel('not-me');
            gaClose = "-reclaim-close";

            // '如果已经绑定了事件，就不行要再绑定'
            if($panel.data('event-bind')) return;

            $panel.find('.btn-orange').click(function(){
                // 'ga统计'
                if (gaEvent){
                    ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-reclaim');
                }

                contentAnt.set('buyer', {});
                self._confirmId();
            });

            $panel.data('event-bind', true);

            // 'ga统计'
            if (gaEvent && self.settings.isEdm){
                ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-edm-none');
            }
        },

        // show panel
        _showPanel: function(panelId){
            var self = this;
            var $panel = self._$Tpl.find('#'+panelId);
            self._$Tpl.find('.panel').addClass('hidden');
            $panel.removeClass('hidden');

            $panel.find('input,select').each(function(){
                self._hideError($(this));
            });

            contentAnt.update();

            self._onWinResize();

            return $panel;
        },

        // '使控件具有查看密码功能'
        _createViewPwd: function($password){
            $password.keyup(function(){
                $password.siblings('input:text').val($password.val());
                $password.siblings('input[name=password]').val($.md5($password.val()));
            });
            // view password
            $password.siblings('.icons').hover(function(){
                $(this).removeClass('view-pwd-0').addClass('view-pwd-1');
            }, function(){
                $(this).removeClass('view-pwd-1').addClass('view-pwd-0');
            }).mousedown(function(){
                $password.addClass('hidden').siblings('input:text').removeClass('hidden');
            }).mouseup(function(){
                $password.removeClass('hidden').siblings('input:text').addClass('hidden');
            });

            if($.browser.msie && $.browser.version < 10){
                $password.siblings('input:text').focus(function(){
                    $(this).addClass('hidden');
                    $password.removeClass('hidden').focus();
                });
            }
        },

        _setTitle: function (title){
            var self = this;
            if(contentAnt){
                self._$Tpl.find('.title').html(title);
            }
        },

        _showError: function($field, msg){
            var self = this;
            var $parent = $field.parents('.control');
            if($field.hasClass('error')){
                $parent.find('.fm-error').text(msg);
            }else{
                $field.addClass('error unvalid a-error');
                $parent.append('<div class="fm-error">'+msg+'</div>');
            }
            self._onWinResize();
        },
        _hideError: function($field){
            var self = this;
            $field.removeClass('error unvalid a-error');
            $field.parents('.control').find('.fm-error').remove();
            self._onWinResize();
        },
        close: function (){
            if (gaEvent){
                ga('send', 'event', gaEvent, 'Trigger', gaPrefix + gaClose);
            }

            Can.util.ui.window.RegisterWindow.superclass.close.call(this);
        }
    });

    if(window.define){
        define('RegisterWindow',function(){
            return Can.util.ui.window.RegisterWindow;
        });
    }

})(Can);
