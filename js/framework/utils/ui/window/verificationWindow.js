(function(Can){
	Can.importJS(['js/framework/utils/two-way-tpl.js','js/framework/utils/ui/window/baseWindow.js']);
    var template = Can.util.TWtemplate;

    var api = {
        vcode: '/cfone/code/loginCode.cf',
        getCountries: '/cfone/user/loadVerifyCountryInfo.cf',
        verifyId: '/cfone/user/verifyCantonfairId.cf',
        verifyPhoto: '/cfone/user/verifyAppearPhotoInfo.cf',
        verifyCode: '/cfone/user/verifyRancode.cf',
        loadPhoto: '/cfone/user/loadVerifyPhotoInfo.cf',
        postVerify: '/cfone/user/postVerifyIdentityInfo.cf',
        loadBuyerInfo: '/cfone/user/loadBuyerInfo.cf',
        postBuyerInfo: '/cfone/user/postBuyerInfo.cf',
        createBuyerInfo: '/cfone/buyer/registerBuyer.cf',
        login: '/cfone/j_spring_security_check',
        verifyEmail: '/cfone/user/existAccount.cf'

    }

    var errorMsg = {
        email: '* This email format is not recognized. Please check again.',
        password: Can.msg.MODULE.MY_SETTING.TIPS_TITLE_3,
        passwordNotMatch: Can.msg.MODULE.MY_SETTING.TIPS_TITLE_4,
        cantonfairId: 'This ID format is not recognized. Please check again.',
        idNotExist: 'This Canton Fair ID is not existed. Please check again.',
        codeNotMatch: "The characters you entered didn't match the word verification. Please try again.",
        required: '* This field is required!'
    };

    var pattern = {
        password: '^[a-zA-Z0-9]{6,20}$',
        cantonfairId:'^(\\d{9,9}|\\d{15,15})$',
        email: '^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    }

    var contentAnt, oParam = ECan.util.analyzeUrl();
    
    // '提示窗口'
    var alertWin = new Can.util.ui.window.ActionWindow({'zIndex': 1002});

    Can.util.ui.window.VerificationWindow = Can.extend(Can.util.ui.window.BaseWindow, {
        constructor: function(options){

            options = $.extend({
                'width': 470,
                'height': 470,
                'cid': null,
                'onSuccess': function(data){}
            }, options);

            Can.util.ui.window.VerificationWindow.superclass.constructor.call(this, options);
        },
        init: function(){
            Can.util.ui.window.VerificationWindow.superclass.init.call(this);
            var self = this;
            template.load('js/framework/utils/ui/window/verificationWindow.html',function(tpl){
                self.setContent(tpl);
                //template(self._$Tpl.find('.content'));
                template(self._$Tpl.find('.content'), {
                    events:{
                        render: function(){
                            self._do(this); // do logic
                        }
                    }
                });
                // self._onWinResize();
                // self._fixPlaceHolder(self._$Tpl.find('form'));
                // self._do(); // do logic
            });
        },
        _do: function(oAnt){
        	 var self = this;
             contentAnt = oAnt;
             contentAnt.set('errorMsg', errorMsg);
             contentAnt.set('pattern', pattern);
             contentAnt.set('cid', self.settings.cid);
             
             self._onWinResize();
             
             self._confirmId();

             // '加载国家'
             $.get(api.getCountries, function(jData){
                 if(jData && jData['status'] == 'success'){
                     contentAnt.set('countryList', jData.data);
                 }
             });
        },
        
        // '验证id'
        _confirmId: function(){
            var self = this;
            var $panel = self._showPanel('confirm-id');

            $panel.find("#question").addClass('hidden');
            
            $panel.find("input[name='tempcid']").val(contentAnt.get('cid'));

            // '如果已经绑定了事件，就不行要再绑定'
            if($panel.data('event-bind')) return;

            // '绑定事件'
            // '刷新验证码'
            /*self._$Tpl.find('.vcode img, .vcode .refresh').click(function(){
                self._$Tpl.find('.vcode img').attr('src', api.vcode+'?' +Math.random());
            });*/

            // '显示canton fair id图片提示'
            /*$panel.find('input[name=cantonfairId]').focus(function(){
                $(this).siblings('.pic-tips').show();
            }).blur(function(){
                $(this).siblings('.pic-tips').hide();
            });*/

            // '显示passport图片提示'
            $panel.find('input[name=var]').focus(function(){
                if($panel.find('select[name=type]').val() == '1'){
                    $(this).siblings('.pic-tips').show();
                }
            }).blur(function(){
                    $(this).siblings('.pic-tips').hide();
                });

            // '检查id是否存在'
           /* var $cid = $panel.find('input[name=cantonfairId]');
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
            });*/

            // 默认进入头像选择
            $panel.find('select[name=type]').val("4");
            $panel.find('#question').removeClass('hidden');
            $panel.find('input[name=var]').val('');
            self._showPhoto();
            
            // '选择问题'
            $panel.find('select[name=type]').change(function(){
                $panel.find('#question').removeClass('hidden');
                $panel.find('input[name=var]').val('');
                if($(this).val() == '4'){
                	self._showPhoto();
                }else{
                    $panel.find('input[name=var]').show();
                    $panel.find('.avatar-list').hide();
                    $panel.find('select[name=countryId]').addClass('hidden');                                       
                    $panel.find('.label-left').addClass('hidden');
                    self._hideError($panel.find('select[name=countryId]'));
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
            
            // 选择国家/地区
            $panel.find('select[name=countryId]').change(function(){
            	if ($(this).val() == '')
            		self._showError($(this), errorMsg.required);
            	else
            		self._hideError($(this));
            });
            
            // 表单提交
            /*$panel.find('#confirm').bind('validated', function(){
            	var hasError = $panel.find('.fm-error').length > 0;
                if(hasError) return;

                var $code = $panel.find('input[name=code]');
                if(!$code.val()) {
                    self._showError($code, errorMsg.required);
                    return
                };
                
                var $type = $panel.find('select[name=type]');
                var $var = $panel.find('input[name=var]');
                var $countryId = $panel.find('select[name=countryId]');
                // 验证问题答案
                $.get(api.postVerify, {type : $type.val(), 'var' : $var.val(), cantonfairId : contentAnt.get('cid'), countryId : $countryId.val()}, function(jData){
                	if(jData && jData['status'] == 'success'){
                		contentAnt.set('verificationFlag', true);
                		$.get(api.loadBuyerInfo, {cantonfairId : contentAnt.get('cid')}, function(jData){
                			self.settings.onSuccess(jData);
                		});
                	} else {
                		contentAnt.set('verificationFlag', false);
                	}
                	
                	self.close();
                });
            });*/
            
            // 确定按钮
            $panel.find('#confirm').click(function(){
                var $type = $panel.find('select[name=type]');
                var $var = $panel.find('input[name=var]');
                var $countryId = $panel.find('select[name=countryId]');
                
                // 验证字段
                if ($type.val() == "")
                	self._showError($type, errorMsg.required);
                else
                	self._hideError($type);
                
                if ($var.val() == "")
                	self._showError($var, errorMsg.required);
                else
                	self._hideError($var);
                
                if ($type.val() == '4' && $countryId.val() == '') 
                	self._showError($countryId, errorMsg.required);
                else
                	self._hideError($countryId);
                
                var hasError = $panel.find('.fm-error').length > 0;
                if(hasError) return;
                
                // 验证问题答案
                $.get(api.postVerify, {type : $type.val(), 'var' : $var.val(), cantonfairId : contentAnt.get('cid'), countryId : $countryId.val()}, function(jData){
                	if(jData && jData['status'] == 'success'){
                		self.settings.onSuccess();
                		self.close();
                	} else {
                		if (jData.errorCode == 'errorCount') {
                			alertWin.setTitle('More than three times').show('More than three times');
                		} else {
                			alertWin.setTitle('Verification failed').show('Verification failed');
                		}
                	}
                	
                });
            });
            
            // 取消按钮
            $panel.find('#cancel').click(function(){
            	self.close();
            });

            // '事件绑定完成'
            $panel.data('event-bind', true);

        },
        
        // 显示头像
        _showPhoto : function() {
        	var self = this;
            var $panel = self._showPanel('confirm-id');
            
        	$panel.find('input[name=var]').hide();
            $panel.find('.avatar-list').show();
            $panel.find('select[name=countryId]').removeClass('hidden');                    
            $panel.find('.label-left').removeClass('hidden');
            $.get(api.loadPhoto, {cantonfairId: contentAnt.get('cid')} ,function(jData){
                if(jData && jData['status'] == 'success'){
                    $.each(jData.data, function(i, item){
                        var index = item.photo.lastIndexOf('.');
                        item.photo = item.photo.substring(0, index) + '_60x60_3' + item.photo.substring(index);
                    });
                    contentAnt.set('avatarList', jData.data);
                }
            });
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

            var $right = self._$Tpl.find('.right');
            panelId == 'supplier' ? $right.hide(): $right.show();

            contentAnt.update();

            return $panel;
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
        },
        _hideError: function($field){
            var self = this;
            $field.removeClass('error unvalid a-error');
            $field.parents('.control').find('.fm-error').remove();
        }
    });
    
    if(window.define){
        define('VerificationWindow', function(){
            return Can.util.ui.window.VerificationWindow;
        });
    }
})(Can);