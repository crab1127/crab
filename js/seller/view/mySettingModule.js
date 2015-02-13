/**
 * mySettingProfileView view
 * Created by 
 * Date: 
 */
;(function(Can, module){
    'use strict';
    //加载双向绑定模板引擎
    Can.importJS([
        'js/framework/utils/two-way-tpl.js',
        'js/framework/jquery/jquery.validationEngine-en.js',
        'js/framework/jquery/jQuery.md5.js'
    ]);
    var template = Can.util.TWtemplate;
    
    //配置别名
    var oConfig = Can.util.Config.seller;    

    module.mySettingModule = Can.extend(module.BaseModule, {
        title: Can.msg.MODULE.MY_SETTING.TITLE,
        id: 'mySettingModuleId',
        constructor: function(cfg){
            Can.apply(this, cfg || {});
            module.mySettingModule.superclass.constructor.call(this);
            this._act = '';
            this._bDelectPro = false;
            this._bAddPro = false;
        },
        startup: function(){
            var self = this;
          
            module.mySettingModule.superclass.startup.call(this);

            
        },
        show: function(){
            module.mySettingModule.superclass.show.call(this);
            Can.Route.mark(this.routeAct());
        },
        //判断路由，开始分发
        routeAct: function(){
            var self = this;
            var sRoute = this._oRoutRule ? 
                this._oRoutRule.route[0] : '/setting';   

            template.load('js/seller/view/mySettingModule.html', function(tpl){
                self.onTplReady(tpl);
            })

            return sRoute;
        },
        
        onTplReady: function(tpl){
            var act  = this._oRoutRule.route[0] || '/setAccount';
            var self = this;
            if(this._act == act){
                return;
            }
            this._act = act;
            this._tpl = tpl;
            this._$Tpl = $(tpl);
            switch(act){
                case '/setAccount': case 'supplier/setAccount': case '/setting':
                    self.account();
                    break;
                case '/personProfile': case 'supplier/personProfile':
                    self.profile();
                    break;
                case '/setPassword': case 'supplier/setPassword':
                    self.password();
                    break;
                case '/setBusiness': case 'supplier/setBusiness':
                    self.business();
                    break;
                case '/setStatistics': case 'supplier/setStatistics':
                    self.statistics();
                    break;
                case '/setExpresss': case 'supplier/setExpresss':
                    self.express();
                    break;
                case '/setAllAccount': case 'supplier/setAllAccount':
                    self.allAccount();
                    break;
                case '/setAccountInfo':case 'supplier/setAccountInfo':
                	self.accountInfo();
                	break;
            }
        },
        account: function(){
            var self = this;
            
            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.find('.setting-warp').remove();
            $Content.html(
                self._$Tpl.find('#my-setAC').html()
            );

            //删除主营产品
            var fDelProducts = function(oAnt){
                oAnt.el.find('.setting-warp').on('click','.btn-close',function () {
                    var $product = $(this).parent();
                    var sDeleproduct = $product.find('span').text();
                    if(!self._bDelectPro){
                        $.ajax({
                            url: oConfig.mySetting.delMainKeyword,
                            cache: false,
                            type: 'POST',
                            data: {"productKeyword":sDeleproduct},
                            beforeSend:function(){
                                self._bDelectPro = true;
                            },
                            complete:function(){
                                self._bDelectPro = false;
                            },
                            success: function(jData){
                                 if (jData.status && jData.status === 'success') {
                                    $product.remove();
                                 }else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                 }
                            }
                        });
                    }
                })
            };

            //添加主营产品
            var fAddProducts = function(oAnt){

                oAnt.el.find('#btn-add').click(function(){
                    var nLen = oAnt.el.find('.mainKeywords').length;
                    if (nLen >= 6) {
                        Can.util.notice(Can.msg.MODULE.SHOWROOM_SET.MAX_MAIN_PRODUCT);
                        return false;
                    }
                    oAnt.el.find('#productKeyword').removeClass('hidden');
                    $(this).addClass('hidden');
                    oAnt.el.find('#btn-pro').removeClass('hidden');
                });

                oAnt.el.find('#btn-pro').click(function(){
                    var sProKeyWord = oAnt.el.find('#productKeyword').val();
                    if(sProKeyWord != ''){
                        if(!self._bAddPro){
                            $.ajax({
                                url: oConfig.mySetting.addMainKeyword,
                                cache: false,
                                type: 'POST',
                                data: {"productKeyword":sProKeyWord},
                                beforeSend:function(){
                                    self._bAddPro = true;
                                },
                                complete:function(){
                                    self._bAddPro = false;
                                },
                                success: function(jData){
                                     if (jData.status && jData.status === 'success') {
                                        var sMainkeywords = '<div class="mod-item-q mainKeywords"><span>'+sProKeyWord+'</span><a class="bg-ico btn-close" href="javascript:;"></a></div>';
                                        oAnt.el.find('#productKeyword').before(sMainkeywords);
                                        oAnt.el.find('#productKeyword').addClass('hidden');
                                        oAnt.el.find('#btn-pro').addClass('hidden');
                                        oAnt.el.find('#btn-add').removeClass('hidden');
                                     }else{
                                        Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                     }
                                }
                            });
                        }
                    }
                });
            };

            var onRender = function(oAnt){
                oAnt.set('curs', {
                            'acc' : 'cur',
                            'pro' : '',
                            'pw' : '',
                            'bs' : '',
                            'ps' : '',
                            'ex' : '',
                            'aac' : ''
                        });

                oAnt.set("oPerm",{
                    'bAccount': Can.util.menuCreate.check(16),
                    'bPersonProfile': Can.util.menuCreate.check(17),
                    'bPassword': Can.util.menuCreate.check(18),
                    'bBusiness': Can.util.menuCreate.check(10),
                    'bStatistics': Can.util.menuCreate.check(9),
                    'bExpresss': Can.util.menuCreate.check(19),
                    'bAllAccount': (Can.util.menuCreate.check(21) && Can.util.menuCreate.checkAccount(Can.util.userInfo().getAccountType()))
                });

                for(var ruleName in $.validationEngineLanguage.allRules){
                    var rule = $.validationEngineLanguage.allRules[ruleName] || {};
                    if(rule.regex){
                        var strRegex = rule.regex.toString();
                        strRegex = strRegex.substr(1,strRegex.lastIndexOf('/')-1);
                        rule.strRegex = strRegex;
                    }
                }
                oAnt.set("rules", $.validationEngineLanguage.allRules);
                $.ajax({
                    url: oConfig.mySetting.findAccount,
                    cache: false,
                    success: function(jData){
                        if(jData.status&&jData.status==="success"){
                            var oData = jData.data;
                            if(oData.registeredCapital){
                                oData.registeredCapital = "$"+oData.registeredCapital;
                            }
                            var _region = Can.util.formatRegion(oData.region,"town");
                            oAnt.set('data', oData);
                            oAnt.set('region',_region);
                            var aIndustry = [];
                            if(oData.industry&&oData.industry.length>0){
                                for(var i=0; i<oData.industry.length;i++){
                                    aIndustry.push({"val":oData.industry[i]});
                                }
                            }
                            oAnt.set('data.industry',aIndustry);
                            
                            oAnt.set('data.accountType',oData.accountType);
                            
                            var aMainKeywords = [];
                            if(oData.mainKeywords&&oData.mainKeywords.length>0){
                                for(var i=0; i<oData.mainKeywords.length;i++){
                                    aMainKeywords.push({"val":oData.mainKeywords[i]});
                                }
                            }
                            oAnt.set('data.mainKeywords',aMainKeywords);

                            fDelProducts(oAnt);
                            fAddProducts(oAnt);

                            oAnt.el.find('form').bind('validated',function(){
                                var formData = oAnt.el.find('form').serialize();

                                $.ajax({
                                    url: oConfig.mySetting.setAccount,
                                    type: 'POST',
                                    data: formData,
                                    beforeSend: function(){
                                        oAnt.el.find("#submit").hide();
                                        oAnt.el.find("#loading").removeClass('hidden');
                                    },
                                    complete: function(){
                                        oAnt.el.find("#submit").show();
                                        oAnt.el.find("#loading").addClass('hidden');
                                    },
                                    success: function(oData){
                                        if(oData.status && oData.status==="success"){
                                            self.showTips(Can.msg.MODULE.MY_SETTING.SUCCESS);
                                        }else if(oData.status && oData.status==="error"){
                                            self.showTips(oData.message);
                                        }else{
                                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, oData);
                                        }
                                    }
                                });
                                
                            });
                            oAnt.el.find('#submit').click(function(){
                                oAnt.el.find('form').trigger("submit");
                            });
                        }else{
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                    }
                });
            };

            this.oAnt = template($Content, { 
                partials: {
                    sb: self._$Tpl.find('#my-setNav').html()
                },
                events: {
                    render: function(){
                        onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            });
        },
        profile: function(){
            var self = this;
            
            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.find('.setting-warp').remove();
            $Content.html(
                self._$Tpl.find('#my-setPF').html()
            );

            var onRender = function(oAnt){
                var getCity = function(val, callback){
                    if(!val){
                        return;
                    }
                    $.ajax({
                        url: oConfig.mySetting.findBizCityDistricts,
                        cache: false,
                        data: {"provinceId":val},
                        success: function (oCity) {
                            oAnt.set('cityList', oCity.data);
                            if(callback){
                                callback();
                            }
                            oAnt.el.find('#city').change();
                        }
                    });
                };

                oAnt.set('curs', {
                            'acc' : '',
                            'pro' : 'cur',
                            'pw' : '',
                            'bs' : '',
                            'ps' : '',
                            'ex' : '',
                            'aac' : ''
                        });

                oAnt.set("oPerm",{
                    'bAccount': Can.util.menuCreate.check(16),
                    'bPersonProfile': Can.util.menuCreate.check(17),
                    'bPassword': Can.util.menuCreate.check(18),
                    'bBusiness': Can.util.menuCreate.check(10),
                    'bStatistics': Can.util.menuCreate.check(9),
                    'bExpresss': Can.util.menuCreate.check(19),
                    'bAllAccount': (Can.util.menuCreate.check(21) && Can.util.menuCreate.checkAccount(Can.util.userInfo().getAccountType()))
                });

                for(var ruleName in $.validationEngineLanguage.allRules){
                    var rule = $.validationEngineLanguage.allRules[ruleName] || {};
                    if(rule.regex){
                        var strRegex = rule.regex.toString();
                        strRegex = strRegex.substr(1,strRegex.lastIndexOf('/')-1);
                        rule.strRegex = strRegex;
                    }
                }
                oAnt.set("rules", $.validationEngineLanguage.allRules);

                $.ajax({
                    url: oConfig.mySetting.findPersonProfile,
                    cache: false,
                    success: function (jData) {
                        if(jData.status && jData.status ==="success"){
                            var oData = jData.data;
                            oData.gender = oData.gender.toString();
                            oData.province = oData.province || oData.provinceList[0].code;
                            
                            var pGender = "male";
                            if(oData.gender === "2"){
                                pGender = "female";
                            }
                            oAnt.set('pGender', pGender);
                            oAnt.set('data', oData);
                            
                            /*oAnt.el.find('#province').val(oData.province).change().bind('selected',function(e, val){
                            	console.log("kkk");
                                getCity(val);
                            });*/
                            
                            oAnt.el.find('#province').val(oData.province);
                                                           
                            oAnt.el.on('click', '#province_ui li', function(){
                                var provinceId = oAnt.el.find('input[name="province"]').val();
                                if(!provinceId) return;
                                oAnt.el.find('#city').val('');
                                getCity(provinceId);
                            }) 
                            
                            getCity(oData.province, function(){
                                if(oData.city){
                                    oAnt.el.find('#city').val(oData.city)
                                }
                            });
                            oAnt.el.find('form').bind('validated',function(){

                                var formData = oAnt.el.find('form').serialize();

                                $.ajax({
                                    url: oConfig.mySetting.personProfile,
                                    type: 'POST',
                                    data: formData,
                                    beforeSend: function(){
                                        oAnt.el.find("#submit").hide();
                                        oAnt.el.find("#loading").removeClass('hidden');
                                    },
                                    complete: function(){
                                        oAnt.el.find("#submit").show();
                                        oAnt.el.find("#loading").addClass('hidden');
                                    },
                                    success: function(oData){
                                        if(oData.status && oData.status==="success"){
                                            self.showTips(Can.msg.MODULE.MY_SETTING.SUCCESS);
                                        }else if(oData.status && oData.status==="error"){
                                            self.showTips(oData.message);
                                        }else{
                                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, oData);
                                        }
                                    }
                                });
                                
                            });
                            
                            oAnt.el.find('#submit').click(function(){
                                oAnt.el.find('form').trigger("submit");
                            });

                            oAnt.el.find('.uploadPic').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){
                                oAnt.set('data.photo',oData.abslouteUrl);
                            });
                        }else{
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                            
                    }

                });

            };

            this.oAnt = template($Content, {
                partials: {
                    sb: self._$Tpl.find('#my-setNav').html()
                },
                events: {
                    render: function(){
                        onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            });
        },
        password: function(){
            var self = this;
            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.find('.setting-warp').remove();
            $Content.html(
                self._$Tpl.find('#my-setPW').html()
            );

            var onRender = function(oAnt){
                oAnt.set('curs', {
                            'acc' : '',
                            'pro' : '',
                            'pw' : 'cur',
                            'bs' : '',
                            'ps' : '',
                            'ex' : '',
                            'aac' : ''
                        });

                oAnt.set("oPerm",{
                    'bAccount': Can.util.menuCreate.check(16),
                    'bPersonProfile': Can.util.menuCreate.check(17),
                    'bPassword': Can.util.menuCreate.check(18),
                    'bBusiness': Can.util.menuCreate.check(10),
                    'bStatistics': Can.util.menuCreate.check(9),
                    'bExpresss': Can.util.menuCreate.check(19),
                    'bAllAccount': (Can.util.menuCreate.check(21) && Can.util.menuCreate.checkAccount(Can.util.userInfo().getAccountType()))
                });

                //密码大小写检测
                oAnt.el.find('input[type=password]').keypress(function(e){
                    var _charCode = String.fromCharCode( e.which );
                    if ( _charCode.toUpperCase() === _charCode && _charCode.toLowerCase() !== _charCode && !e.shiftKey ) {
                        var _tips = $(this).parent().find('.pwdtips').length;
                        if(_tips>0){
                            return;
                        }else{
                           $(this).parent().append('<span class="icons capslock-1"></span><div class="pwdtips"><span class="icons allow-0"></span><span i18n>'+Can.msg.MODULE.MY_SETTING.PWD_TIPS+'</span></div>'); 
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

                var _isCheckPassword = false;
                var _aCPCallbas = [];
                var _isChecking = false;
                var fCheckPassword = function(callback){
                    callback = callback || function(){};

                    if(_isCheckPassword){
                        return callback(_isCheckPassword);
                    }

                    _aCPCallbas.push(callback);
                    if(_isChecking){
                        return;
                    }
                    _isChecking = true;

                    var oldPassword = oAnt.el.find("#oldPassword").val();
                    if(oldPassword!=""){
                        oldPassword = $.md5(oldPassword);
                        $.ajax({
                            url: oConfig.mySetting.checkPassword,
                            type: 'POST',
                            data: {"password":oldPassword},
                            success:function(oData){
                                _isChecking = false;

                                if(oData.status && oData.status ==="success"){
                                    oAnt.el.find("#oldPassword").data("status", true);
                                    _isCheckPassword = true;
                                    $.each(_aCPCallbas, function(k,v){
                                        v(_isCheckPassword);
                                    })
                                    
                                }else if(oData.status && oData.status ==="error"){
                                    oAnt.el.find("#oldPassword").data("status", false);
                                    _isCheckPassword = false;
                                    $.each(_aCPCallbas, function(k,v){
                                        v(_isCheckPassword);
                                    })
                                    if(oAnt.el.find('#oldPassword').hasClass('a-error')){
                                        return;
                                    }else{
                                        oAnt.el.find('#oldPassword').addClass('a-error');
                                        oAnt.el.find('#oldPassword').parent().append('<div class="fm-error">'+Can.msg.TEXT_BUTTON_VIEW.CHECK_PASSWORD+'</div>'); 
                                    }
                                }else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, oData);
                                }

                                _aCPCallbas = [];
                            }
                        });
                    }
                };
                oAnt.el.find("#oldPassword").data("status", false).blur(function() {
                    _isCheckPassword = false;
                    
                    fCheckPassword();
                });

                oAnt.el.find('form').bind('validated',function(el){
                    var oldPassword = $(el.target).find('#oldPassword').val();
                    var newPassword =  $(el.target).find('input[name=newPassword]').val();
                    var confirmPassword = $(el.target).find('#confirmPassword').val();

                    //检测当前密码正不正确
                    fCheckPassword(function(){
                        var pwdStatus = $(el.target).find('#oldPassword').data("status");
                        if (!pwdStatus){
                            return false;
                        }

                        if(newPassword != confirmPassword){
                            $(el.target).find('#confirmPassword').addClass('a-error');
                            $(el.target).find('#confirmPassword').parent().append('<div class="fm-error">'+Can.msg.TEXT_BUTTON_VIEW.COMFIRM_PASSWORD+'</div>');
                            return false;
                        }

                        oldPassword = $.md5(oldPassword);
                        newPassword = $.md5(newPassword);
                        confirmPassword = $.md5(confirmPassword);

                        var oData={
                            "oldPassword":oldPassword,
                            "newPassword":newPassword,
                            "confirmPassword":confirmPassword
                        };
                       $.ajax({
                            url: oConfig.mySetting.setPassword,
                            type: 'POST',
                            data: oData,
                            beforeSend: function(){
                                oAnt.el.find("#submit").hide();
                                oAnt.el.find("#loading").removeClass('hidden');
                            },
                            complete: function(){
                                oAnt.el.find("#submit").show();
                                oAnt.el.find("#loading").addClass('hidden');
                            },
                            success: function(oData){
                                if(oData.status && oData.status==="success"){
                                    self.showTips(Can.msg.MODULE.MY_SETTING.SUCCESS);
                                }else if(oData.status && oData.status==="error"){
                                    self.showTips(oData.message);
                                }
                                else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, oData);
                                }
                            }
                        });
                    });
                    
                });
                
                oAnt.el.find('#submit').click(function(){
                    oAnt.el.find('form').trigger("submit");
                });
            };

            this.oAnt = template($Content, { 
                partials: {
                    sb: self._$Tpl.find('#my-setNav').html()
                },
                events: {
                    render: function(){
                        onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            });
        },
        business: function(){
           var self = this;
            
            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.find('.setting-warp').remove();
            $Content.html(
                self._$Tpl.find('#my-setBS').html()
            );
            
            var onRender = function(oAnt){
                oAnt.set('curs', {
                            'acc' : '',
                            'pro' : '',
                            'pw' : '',
                            'bs' : 'cur',
                            'ps' : '',
                            'ex' : '',
                            'aac' : ''
                        });

                oAnt.set("oPerm",{
                    'bAccount': Can.util.menuCreate.check(16),
                    'bPersonProfile': Can.util.menuCreate.check(17),
                    'bPassword': Can.util.menuCreate.check(18),
                    'bBusiness': Can.util.menuCreate.check(10),
                    'bStatistics': Can.util.menuCreate.check(9),
                    'bExpresss': Can.util.menuCreate.check(19),
                    'bAllAccount': (Can.util.menuCreate.check(21) && Can.util.menuCreate.checkAccount(Can.util.userInfo().getAccountType()))
                });

                $.ajax({
                    url: oConfig.mySetting.findBusiness,
                    cache: false,
                    success:function(jData){
                        if(jData.status&&jData.status==="success"){
                            var oData = jData.data;

                            var aIndusBizRule = [];
                            if(oData.indusBizRule && oData.indusBizRule.length>0){
                                for(var i=0; i<oData.indusBizRule.length;i++){
                                    aIndusBizRule.push({"val":oData.indusBizRule[i]});
                                }
                            }

                            var aIndusBizRule = [];
                            if(oData.indusBizRule && oData.indusBizRule.length>0){
                                for(var i=0; i<oData.indusBizRule.length;i++){
                                    aIndusBizRule.push({"val":oData.indusBizRule[i]});
                                }
                            }
                            
                            var aProductBizRule = [];
                            if(oData.productBizRule && oData.productBizRule.length>0){
                                for(var i=0; i<oData.productBizRule.length;i++){
                                    aProductBizRule.push({"val":oData.productBizRule[i]});
                                }
                            }
                            
                            var aExportMarketBizRule = [];
                            if(oData.exportMarketBizRule && oData.exportMarketBizRule.length>0){
                                for(var i=0; i<oData.exportMarketBizRule.length;i++){
                                    aExportMarketBizRule.push({"val":oData.exportMarketBizRule[i]});
                                }
                            }
                            
                            var aCountryBizRule = [];
                            if(oData.countryBizRule && oData.countryBizRule.length>0){
                                for(var i=0; i<oData.countryBizRule.length;i++){
                                    aCountryBizRule.push({"val":oData.countryBizRule[i]});
                                }
                            }
                            if(oData.exhibNoList && oData.exhibNoList.length>0){
                                 for(var i=0;i<oData.exhibNoList.length; i++){

                                    if(oData.exhibNoList[i].isSelect===true){
                                        oAnt.set('exhib' , oData.exhibNoList[i].code.toString());
                                        break;
                                    }
                                }
                            }
                           
                            if(oData.lastExhibNoList && oData.lastExhibNoList.length>0){
                                for(var i=0;i<oData.lastExhibNoList.length; i++){
                                    if(oData.lastExhibNoList[i].isSelect===true){
                                        oAnt.set('lastExhib' , oData.lastExhibNoList[i].code.toString());
                                        break;
                                    }
                                }
                            }
                            

                            oAnt.set('data', oData);
                            oAnt.set('data.indusBizRule',aIndusBizRule);
                            oAnt.set('data.productBizRule',aProductBizRule);
                            oAnt.set('data.exportMarketBizRule',aExportMarketBizRule);
                            oAnt.set('data.countryBizRule',aCountryBizRule);

                            oAnt.el.find('#submit').bind('click',function(){
                                var $exhib=oAnt.el.find("input[name='exhib']");
                                var $lastExhib=oAnt.el.find("input:radio[name='lastExhib']");

                                if($exhib.is(":checked") && $lastExhib.is(":checked")){

                                    oAnt.el.find('.fm-error').addClass('hidden');

                                    var oData = oAnt.el.find('form').serialize();
                                    $.ajax({
                                        url: oConfig.mySetting.setBusiness,
                                        type: "POST",
                                        cache: false,
                                        data: oData,
                                        beforeSend: function(){
                                            oAnt.el.find("#submit").hide();
                                            oAnt.el.find("#loading").removeClass('hidden');
                                        },
                                        complete: function(){
                                            oAnt.el.find("#submit").show();
                                            oAnt.el.find("#loading").addClass('hidden');
                                        },
                                        success: function(jData){
                                            if(jData.status&&jData.status==="success"){
                                                self.showTips(Can.msg.MODULE.MY_SETTING.SUCCESS);
                                            }else if(jData.status&&jData.status==="error"){
                                                self.showTips(jData.message);
                                            }
                                            else{
                                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                            }
                                        }
                                    });
                                }else{
                                    oAnt.el.find('.fm-error').removeClass('hidden');
                                }
                            });

                        }else{
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                    }
                });
            };

            this.oAnt = template($Content, {
                data: {
                    photo: ''
                },   
                partials: {
                    sb: self._$Tpl.find('#my-setNav').html()
                },
                events: {
                    render: function(){
                        onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            }); 
        },
        statistics: function(){
            var self = this;
            
            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.find('.setting-warp').remove();
            $Content.html(
                self._$Tpl.find('#my-setPS').html()
            );

            var onRender = function(oAnt){
                oAnt.set('curs', {
                                'acc' : '',
                                'pro' : '',
                                'pw' : '',
                                'bs' : '',
                                'ps' : 'cur',
                                'ex' : '',
                                'aac' : ''
                            });

                oAnt.set("oPerm",{
                    'bAccount': Can.util.menuCreate.check(16),
                    'bPersonProfile': Can.util.menuCreate.check(17),
                    'bPassword': Can.util.menuCreate.check(18),
                    'bBusiness': Can.util.menuCreate.check(10),
                    'bStatistics': Can.util.menuCreate.check(9),
                    'bExpresss': Can.util.menuCreate.check(19),
                    'bAllAccount': (Can.util.menuCreate.check(21) && Can.util.menuCreate.checkAccount(Can.util.userInfo().getAccountType()))
                });

                var fGetItem = function(page){
                    $.ajax({
                        url: oConfig.mySetting.findPushStatus,
                        cache:false,
                        data:{"page": page,"pageSize":15},
                        success: function(jData){
                            if(jData.status&&jData.status==="success"){

                                var oData = jData.data;
                                for(var i=0;i<oData.supPushInfolist.items.length; i++){

                                    if(oData.supPushInfolist.items[i].gender===1){
                                        oData.supPushInfolist.items[i].gender = 'male';
                                    }else{
                                        oData.supPushInfolist.items[i].gender = 'female';
                                    }
                                }
                                
                                if(!oData.collectIsTypeList){
                                    oData.collectIsTypeList = [
                                        {
                                            "total":"0",
                                            "sumCompany":"0",
                                            "sumProduct":"0",
                                        },
                                        {
                                            "total":"0",
                                            "sumCompany":"0",
                                            "sumProduct":"0"
                                        },
                                        {
                                            "total":"0",
                                            "sumCompany":"0",
                                            "sumProduct":"0"
                                        }
                                    ];
                                }
                                if(!oData.average){
                                    oData.average = "0";
                                }

                                oAnt.set('data', oData);

                                fStatisticsType();
                            }else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                            }
                        }
                    });
                };

                fGetItem(1);

                oAnt.el.find('[paging]').bind('pageChange',function(el,page){
                    fGetItem(page);
                });

                //统计率
                var fStatisticsType = function(){
                   var zeropos = 320;
                    oAnt.el.find(".percent").each(function(index, element) {
                        var $bar = $(this).find('.graphbar');
                        var $vt = $(this).find('.views-total');
                        var $sm = parseInt($vt.text());
                        if($sm=="0"){
                            $bar.css("top",320);    
                            $vt.css("top",290);
                        }else if($sm=="100"){
                            $bar.animate({top: 30}, "slow");
                            $vt.animate({"top": 0}, "slow");
                        }else{
                            //var salary =zeropos-($sm*3.55);
                            var salary =290-($sm*2.9);
                            var val=salary+30;
                            var viewst=val-30;
                            $bar.animate({top: val}, "slow");
                            $vt.animate({"top": viewst}, "slow");
                        }
                        
                    });
                    oAnt.el.find(".two").each(function(index, element) {
                        var $twobar = $(this).find('.graphbar');
                        var $vm = $(this).find('.views-total');
                        var $gTotal = $(this).closest('.grapharea').find('.gTotal');
                        var $vTotal = $(this).closest('.grapharea').find('.valTotal');
                        if($vTotal.text()=="0"){
                            $gTotal.css("top",320);
                            $vTotal.css("top",290);
                             
                        }else{
                            $gTotal.animate({top: 30}, "slow");
                            $vTotal.animate({top: 0}, "slow");
                        }
                        if($vm.text()=="0"){
                            $twobar.css("top",320); 
                            $vm.css("top",290);
                        }else{
                            var sal = ($vm.text()*290)/$vTotal.text();
                            var sale = 290-sal+30;
                            var viewnum = sale-30;
                            $twobar.animate({"top":sale}, "slow");
                            $vm.animate({"top":viewnum}, "slow");
                        }
                    });
                };
            };

            this.oAnt = template($Content, {
                partials: {
                    sb: self._$Tpl.find('#my-setNav').html()
                },
                events: {
                    render: function(){
                        onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            });
        },
        express: function(){

            var self = this;
            
            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.find('.setting-warp').remove();
            $Content.html(
                self._$Tpl.find('#my-setEP').html()
            );

            var onRender = function(oAnt){
                oAnt.set('isShowList', true);
                oAnt.set('curs', {
                            'acc' : '',
                            'pro' : '',
                            'pw' : '',
                            'bs' : '',
                            'ps' : '',
                            'ex' : 'cur',
                            'aac' : ''
                        });

                oAnt.set("oPerm",{
                    'bAccount': Can.util.menuCreate.check(16),
                    'bPersonProfile': Can.util.menuCreate.check(17),
                    'bPassword': Can.util.menuCreate.check(18),
                    'bBusiness': Can.util.menuCreate.check(10),
                    'bStatistics': Can.util.menuCreate.check(9),
                    'bExpresss': Can.util.menuCreate.check(19),
                    'bAllAccount': (Can.util.menuCreate.check(21) && Can.util.menuCreate.checkAccount(Can.util.userInfo().getAccountType()))
                });
                //加载套餐数据
                $.ajax({
                    url: oConfig.mySetting.findExpressPackage,
                    cache: false,
                    success: function(jData){
                        oAnt.set('data', jData);                           
                    }

                });

                //详细记录
                var fGetDetail = function(page,sDetail,sTime){
                    $.ajax({
                        url: oConfig.mySetting.findExpressListDetail,
                        cache:false,
                        data:{"expressId":sDetail,"pageSize":15,"page":page},
                        success:function(jData){
                            if(jData.status&&jData.status==="success"){
                                var oData = jData.data;
                                oAnt.set('detail', oData);
                                oAnt.set('time', sTime);
                                oAnt.set('detailPage', jData.page);
                                oAnt.set('expressId',sDetail);
                            }else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                            }
                        }
                    });
                };
                //企业速递记录
                var fGetItem = function(page){
                    $.ajax({
                        url: oConfig.mySetting.findExpressList,
                        cache: false,
                        data:{"pageSize":15,"page":page},
                        success: function(jData){
                            if(jData.status&&jData.status==="success"){
                                var oData = jData.data;
                                var oPage = jData.page;
                                oAnt.set('recode', oData);
                                oAnt.set('recodePage', oPage);

                                oAnt.el.find('.detail').bind('click',function(){
                                    var sDetail = $(this).attr('dataId');
                                    var sTime = $(this).attr('timeId');
                                    oAnt.set('isShowList', false);
                                    fGetDetail(1,sDetail,sTime);
                                });
                            }else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                            }
                        }
                    });
                };

                fGetItem(1);

                oAnt.el.find('[paging]').bind('pageChange',function(el,page){
                    fGetItem(page);
                });

                oAnt.el.on('pageChange','#detailPage',function(el,page){
                    var sDetail = $(this).attr('detailPaging');
                    var sTime = $(this).attr('time');
                    fGetDetail(page,sDetail,sTime);
                });

                /*oAnt.el.find('#detailPage').bind('pageChange',function(el,page){
                    console.log('1111');
                    var sDetail = $(this).attr('detailPaging');
                    var sTime = $(el.target).find('.time').html();
                    fGetDetail(page,sDetail,sTime);
                });*/

                oAnt.el.on('click','.back',function(){
                    oAnt.set('isShowList' , true);
                })

            };

            this.oAnt = template($Content, {  
                partials: {
                    sb: self._$Tpl.find('#my-setNav').html()
                },
                events: {
                    render: function(){
                        onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            });
        },
        
        allAccount: function(){
            var self = this;
            
            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.find('.setting-warp').remove();
            $Content.html(
                self._$Tpl.find('#my-setALLAC').html()
            );
            
            var onRender = function(oAnt){
                oAnt.set('curs', {
                            'acc' : '',
                            'pro' : '',
                            'pw' : '',
                            'bs' : '',
                            'ps' : '',
                            'ex' : '',
                            'aac' : 'cur'
                        });
                oAnt.set("oPerm",{
                    'bAccount': Can.util.menuCreate.check(16),
                    'bPersonProfile': Can.util.menuCreate.check(17),
                    'bPassword': Can.util.menuCreate.check(18),
                    'bBusiness': Can.util.menuCreate.check(10),
                    'bStatistics': Can.util.menuCreate.check(9),
                    'bExpresss': Can.util.menuCreate.check(19),
                    'bAllAccount': (Can.util.menuCreate.check(21) && Can.util.menuCreate.checkAccount(Can.util.userInfo().getAccountType()))
                });
                

                //详细记录
                var fGetAccount = function(){
                    $.ajax({
                        url: oConfig.mySetting.findAllAccount,
                        cache:false,
//                        data:{"pageSize":15,"page":page},
                        success:function(jData){
                            if(jData.status&&jData.status==="success"){
                                var oData = jData.data;
                                for(var i =0;i<oData.length;i++){
                                	if(oData[i].accountType==1){
                                		oData[i].accountType=true;
                                	}else{
                                		oData[i].accountType=false;
                                	}
                                }
                                if(oData.length >= 3){
                                	oAnt.set('hasAdd',false);
                                }else{
                                	oAnt.set('hasAdd',true);
                                }
                                oAnt.set('userList', oData);
                            }else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                            }
                        }
                    });
                };

                fGetAccount();
                
                oAnt.el.on('click','.del',function(){
                	var userId =$(this).attr("data-id");
                	var confirmWin = new Can.view.confirmWindowView({
        				id: "pbSuccConfirmWin",
        				width: 280
        			});
        			confirmWin.setContent('<div style="padding: 10px 20px;">' + Can.msg.MODULE.MY_SETTING.DELETE_ACCOUNT + '</div>');
        			confirmWin.show();
        			confirmWin.onOK(function () {
        				$.ajax({
        					url: oConfig.mySetting.delSubAccount,
        					cache:false,
        					data:{"userId":userId},
        					success:function(jData){
        						if(jData.status&&jData.status==="success"){
        							self.showTips(Can.msg.MODULE.MY_SETTING.DELETE_SUCCESS);
        							fGetAccount();
        						}else if(jData.status&&jData.status==="error"){
                                	self.showTips(jData.message);
                            	}else{
                            		Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                           	    }
        					}
        				});
        			});
                })
                
                 oAnt.el.on('click','.update',function(){
                	 var updateId =$(this).attr("data-id");
                	 $.ajax({
                         url: oConfig.mySetting.setSubAccount,
                         cache:false,
                         data:{"updateId":updateId},
                         success:function(jData){
                             if(jData.status&&jData.status==="success"){
                            	 window.location.href="#!/setAccountInfo";
                             }else if(jData.status&&jData.status==="error"){
                             	 self.showTips(jData.message);
                         	 }else{
                         		 Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        	 }
                         }
                     });
                })
                
                oAnt.el.on('click','.add',function(){
                	 $.ajax({
                         url: oConfig.mySetting.setSubAccount,
                         cache:false,
                         data:{"updateId":0},
                         success:function(jData){
                             if(jData.status&&jData.status==="success"){
                            	 window.location.href="#!/setAccountInfo";
                             }else if(jData.status&&jData.status==="error"){
                             	 self.showTips(jData.message);
                         	 }else{
                         		 Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        	 }
                         }
                     });
                })
                
            };

            this.oAnt = template($Content, {  
                partials: {
                    sb: self._$Tpl.find('#my-setNav').html()
                },
                events: {
                    render: function(){
                        onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            });
        },
        
        accountInfo: function(){
            var self = this;
            
            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.find('.setting-warp').remove();
            $Content.html(
                self._$Tpl.find('#my-setACInfo').html()
            );
            
            var onRender = function(oAnt){
                oAnt.set('curs', {
                            'acc' : '',
                            'pro' : '',
                            'pw' : '',
                            'bs' : '',
                            'ps' : '',
                            'ex' : '',
                            'aac' : 'cur'
                        });
                
                oAnt.set("oPerm",{
                    'bAccount': Can.util.menuCreate.check(16),
                    'bPersonProfile': Can.util.menuCreate.check(17),
                    'bPassword': Can.util.menuCreate.check(18),
                    'bBusiness': Can.util.menuCreate.check(10),
                    'bStatistics': Can.util.menuCreate.check(9),
                    'bExpresss': Can.util.menuCreate.check(19),
                    'bAllAccount': (Can.util.menuCreate.check(21) && Can.util.menuCreate.checkAccount(Can.util.userInfo().getAccountType()))
                });
                
                for(var ruleName in $.validationEngineLanguage.allRules){
                    var rule = $.validationEngineLanguage.allRules[ruleName] || {};
                    if(rule.regex){
                        var strRegex = rule.regex.toString();
                        strRegex = strRegex.substr(1,strRegex.lastIndexOf('/')-1);
                        rule.strRegex = strRegex;
                    }
                }
                oAnt.set("rules", $.validationEngineLanguage.allRules);

                //详细记录
                var fGetAccount = function(){
                    $.ajax({
                        url: oConfig.mySetting.findAccountInfo,
                        cache:false,
//                        data:{"pageSize":15,"page":page},
                        success:function(jData){
                            if(jData.status&&jData.status==="success"){
                                var oData = jData.data;
                                //性别默认为男
                                if(oData.gender == null){
                                	oData.gender = 1;
                                }
                                oAnt.set('user', oData);
                                if(oData.password != null){
                                	 $('#newPasswordDiv').remove();
                                	 $('#confirmPasswordDiv').remove();
                                }
                            }else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                            }
                        }
                    });
                };
                
                fGetAccount();
                
                var _isCheckAccount = false;
                var _aCPCallbas = [];
                var _isChecking = false;
                var fCheckUserAccount = function(callback){
                    callback = callback || function(){};

                    if(_isCheckAccount){
                        return callback(_isCheckAccount);
                    }

                    _aCPCallbas.push(callback);
                    if(_isChecking){
                        return;
                    }
                    _isChecking = true;

                    var userAccount = oAnt.el.find("#userAccount").val();
                    var userId = oAnt.data.user.userId;
                    if(userAccount!=""){
                        $.ajax({
                            url: oConfig.mySetting.checkUserAccountOrEmail,
                            type: 'POST',
                            data: {"strCheck":userAccount
                            },
                            success:function(oData){
                                _isChecking = false;
                                
                                if(oData.status && oData.status ==="success"){
                                    oAnt.el.find("#userAccount").data("status", true);
                                    _isCheckAccount = true;
                                    $.each(_aCPCallbas, function(k,v){
                                        v(_isCheckAccount);
                                    })
                                    
                                }else if(oData.status && oData.status ==="error"){
                                    oAnt.el.find("#userAccount").data("status", false);
                                    _isCheckAccount = false;
                                    $.each(_aCPCallbas, function(k,v){
                                        v(_isCheckAccount);
                                    })
                                    if(oAnt.el.find('#userAccount').hasClass('a-error')){
                                        return;
                                    }else{
                                        oAnt.el.find('#userAccount').addClass('a-error');
                                        oAnt.el.find('#userAccount').parent().append('<div class="fm-error">'+Can.msg.TEXT_BUTTON_VIEW.CHECK_ACCOUNT+'</div>'); 
                                    }
                                }else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, oData);
                                }

                                _aCPCallbas = [];
                            }
                        });
                    }
                };
                
                oAnt.el.find("#userAccount").data("status", false).blur(function() {
                	_isCheckAccount = false;
                    
                    fCheckUserAccount();
                });
                
                var _isCheckEmail = false;
                var _aCPCallbasEmail = [];
                var _isEmailChecking = false;
                var fCheckEmail = function(callback){
                    callback = callback || function(){};

                    if(_isCheckEmail){
                        return callback(_isCheckEmail);
                    }

                    _aCPCallbasEmail.push(callback);
                    if(_isEmailChecking){
                        return;
                    }
                    _isEmailChecking = true;

                    var email = oAnt.el.find("#email").val();
                    if(userAccount!=""){
                        $.ajax({
                            url: oConfig.mySetting.checkUserAccountOrEmail,
                            type: 'POST',
                            data: {"strCheck":email
                            },
                            success:function(oData){
                            	_isEmailChecking = false;
                                
                                if(oData.status && oData.status ==="success"){
                                    oAnt.el.find("#email").data("status", true);
                                    _isCheckEmail = true;
                                    $.each(_aCPCallbasEmail, function(k,v){
                                        v(_isCheckEmail);
                                    })
                                    
                                }else if(oData.status && oData.status ==="error"){
                                    oAnt.el.find("#email").data("status", false);
                                    _isCheckAccount = false;
                                    $.each(_aCPCallbasEmail, function(k,v){
                                        v(_isCheckEmail);
                                    })
                                    if(oAnt.el.find('#email').hasClass('a-error')){
                                        return;
                                    }else{
                                        oAnt.el.find('#email').addClass('a-error');
                                        oAnt.el.find('#email').parent().append('<div class="fm-error">'+Can.msg.TEXT_BUTTON_VIEW.CHECK_ACCOUNT+'</div>'); 
                                    }
                                }else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, oData);
                                }

                                _aCPCallbasEmail = [];
                            }
                        });
                    }
                };
                
                oAnt.el.find("#email").data("status", false).blur(function() {
                	_isCheckEmail = false;
                    
                    fCheckEmail();
                });
                
                oAnt.el.find('form').bind('validated',function(el){
                    var newPassword =  $(el.target).find('input[name=newPassword]').val();
                    var confirmPassword = $(el.target).find('#confirmPassword').val();

                    if(newPassword != confirmPassword){
                        $(el.target).find('#confirmPassword').addClass('a-error');
                        $(el.target).find('#confirmPassword').parent().append('<div class="fm-error">'+Can.msg.TEXT_BUTTON_VIEW.COMFIRM_PASSWORD+'</div>');
                        return false;
                    }
                    $(el.target).find('#password').val(newPassword);
                    
                    var str = $("form").serialize();
                    $.ajax({
                        url: oConfig.mySetting.updateOrAddSubAccount,
                        cache:false,
                        data:str,
                        success:function(jData){
                            if(jData.status&&jData.status==="success"){
                            	self.showTips(Can.msg.MODULE.MY_SETTING.UPDATE_SUCCESS);
                            	window.location.href="#!/setAllAccount";
                            }else if(jData.status&&jData.status==="error"){
                                self.showTips(jData.message);
                            }
                            else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                            }
                        }
                    });
                });
                
                oAnt.el.find('#submit').click(function(){
                    oAnt.el.find('form').trigger("submit");
                });
                
                oAnt.el.on('click','#bottom',function(){
                	window.location.href="#!/setAllAccount";
               })
            };
            
            this.oAnt = template($Content, {  
                partials: {
                    sb: self._$Tpl.find('#my-setNav').html()
                },
                events: {
                    render: function(){
                        onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            });
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
