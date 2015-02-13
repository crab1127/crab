/*
 * login window for v2
 * Author: Allenice
 * Date: 2014-2-17
 * */

(function(Can){
    Can.importJS(['js/framework/utils/two-way-tpl.js','js/framework/utils/ui/window/baseWindow.js']);
    var template = Can.util.TWtemplate;

    // 'ga统计'
    var ga = window.ga || function(){};
    var gaEvent, gaPrefix;

    if(location.pathname.indexOf('/buyinglead/') != -1){
        gaEvent = "BUYINGLEAD";
        gaPrefix = "lead";
    }else if(location.pathname.indexOf('/Inquire/') != -1){
        gaEvent = "INQUIRY";
        gaPrefix = "inquiry";
    }

    Can.util.ui.window.LoginWindow = Can.extend(Can.util.ui.window.BaseWindow, {
        constructor: function(options){

            options = $.extend({
                'width': 470,
                'onSuccess': function(data){}
            }, options);

            Can.util.ui.window.LoginWindow.superclass.constructor.call(this, options);
        },
        init: function(){
            Can.util.ui.window.LoginWindow.superclass.init.call(this);
            var self = this;
            template.load('js/framework/utils/ui/window/loginWindow.html',function(tpl){
                self.setContent(tpl);
                template(self._$Tpl.find('.content'));
                self._onWinResize();
                // self._fixPlaceHolder(self._$Tpl.find('form'));                
                self._do(); // do logic
            });
        },
        _do: function(){
            var self = this;
            $.when(
                    $.getScript('/login/jQuery.md5-mini.js'),
                    $.getScript('/js/common.js')
            ).then(function(){
                // 登录框处理逻辑
                var $form = self._$Tpl.find('form');
                var $account = $form.find('input[name=account]');
                var $password = $form.find('input[name=password]');
                var $authCode = $form.find('input[name=authCode]');
                var $remember = $form.find('.remember input:checkbox');
                if ($.cookie('secureCode')) {
                    $form.find('#authCode-box').removeClass('hidden').find('img').attr('src', '/cfone/authcode/geneimage.cf');
                }
                $form.find('.remember select').change(function(){
                    if($(this).val() == '1'){
                        $remember.prop('checked', true);
                    }else{
                        $remember.prop('checked', false);
                    }
                });

                cfec.common.createCantonfairLogin($form, {
                    // 账号输入框
                    accountInt: $account,
                    accountReq: $account.siblings('.err-msg'),
                    accountBox: null,
                    fShowAccountError: function() {
                        this.accountInt.addClass('a-error');
                        this.accountReq.css('display', 'block').html('Please input your account!');
                    },
                    fHideAccountError: function() {
                        this.accountInt.removeClass('a-error');
                        this.accountReq.hide();
                    },
                    // 密码输入框
                    passwordInt: $password,
                    passwordReq: $password.siblings('.err-msg'),
                    passwordBox: null,
                    fShowPasswordError: function() {
                        this.passwordInt.addClass('a-error');
                        this.passwordReq.css('display', 'block').html('Please input your password!');
                    },
                    fHidePasswordError: function() {
                        this.passwordInt.removeClass('a-error');
                        this.passwordReq.hide();
                    },
                    fShowLoginError: function(sMsg) {
                        this.accountInt.addClass('a-error');
                        this.accountReq.css('display', 'block').html(sMsg);
                    },

                    // 验证码入框
                    authCodeInt: $authCode,
                    authCodeReq: $authCode.siblings('.err-msg'),
                    authCodeBox: null,
                    fShowAuthCodeError: function() {
                        this.authCodeInt.addClass('a-error');
                        this.authCodeReq.css('display', 'block').html('Verification code error!');
                    },
                    fHideAuthCodeError: function() {
                        this.authCodeInt.removeClass('a-error');
                        this.authCodeReq.hide();
                    },
                    // 密码大小写提示
                    capsLock: $form.find('.capslock'),
                    capsLockTips: $password.siblings('.tips'),
                    rememberCheck: $remember,
                    loginSuccess: function(data){
                        $('body').trigger('login-success');
                        if(typeof self.settings.onSuccess === 'function'){
                            self.close();
                            self.settings.onSuccess.call(self, data);
                        }
                    }
                });
            });

            // sign up
            self._$Tpl.find('#sign-up').click(function(){
                Can.importJS(['js/framework/utils/ui/window/registerWindow.js']);
                var regWin = new Can.util.ui.window.RegisterWindow({
                    onSuccess: function(data){
                        self.settings.onSuccess.call(self, data);
                    }
                });
                self.close();
                regWin.show();
            });

            self._$Tpl.find('#join-free').click(function(){
                Can.importJS(['js/framework/utils/ui/window/registerWindow.js']);
                var regWin = new Can.util.ui.window.RegisterWindow({
                    onSuccess: function(data){
                        self.settings.onSuccess.call(self, data);
                    }
                });
                self.close();
                regWin.show();
            });
            
            // ga统计
            self._$Tpl.on('click','.forget', function(){
                if (gaEvent){
                    ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-forgot');
                }
            });
            self._$Tpl.on('change', '.remember select', function(){
                if (gaEvent){
                    ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-remember');
                }
            });

            self._$Tpl.find('form').submit(function(){
                if (gaEvent){
                    ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-signin');
                }
            });
        },

        close: function (){
            if (gaEvent){
                ga('send', 'event', gaEvent, 'Trigger', gaPrefix+'-signin-close');
            }

            Can.util.ui.window.LoginWindow.superclass.close.call(this);
        }
    });

    if(window.define){
        define('LoginWindow', function(){
            return Can.util.ui.window.LoginWindow;
        });
    }

})(Can);