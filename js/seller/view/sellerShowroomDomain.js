/**
 * 域名设置 
 * - 后端：嘉林
 * - 产品经理： 龙旺
 * @Date: 2014-02-13 15:18:00
 * @Author: vfasky (vfasky@gmail.com)
 * @Version: $Id: sellerShowroomDomain.js 83168 2014-08-25 07:42:51Z gangw $
 */

;(function(Can, view){
    'use strict';

    //加载双向绑定模板引擎
    Can.importJS([
        'js/framework/utils/two-way-tpl.js'
    ]);

    var template   = Can.util.TWtemplate;
    var _          = Can.util.i18n._;
    var oConfig    = Can.util.Config.seller;


    view.sellerShowroomDomainView = Can.extend(Can.view.ShowroowBaseView, {
        startup:function () {
            var self = this;
            Can.view.ShowroowBaseView.superclass.startup.call(this);
            this.container = $('<div class="main"></div>');

            template.load('js/seller/view/sellerShowroomDomain.html', function(tpl){
                self.container.html(tpl);
                self._oAnt = template(self.container,{
                    events: {
                        render: function(){
                            self.onRender(this);
                        },
                        update: function(){
                            self.onUpdate(this);
                        }
                    }
                });
            });
        },
        onRender: function(oAnt){
            var self = this;

            //判断域名状态
            self.fHttps = function(){
                $.ajax({
                    url: oConfig.setShowroomModule.GET_SHOWROOM_DOMAIN,
                    cache: false,
                    dataType:'JSON',
                    success: function(jData){
                        if(jData.status && jData.status==="success"){

                            if(jData.data){
                                if(jData.data.status){
                                    //审核不通过
                                    jData.data.nopass = Number(jData.data.status) === -1;
                                    //审核中
                                    jData.data.pending = Number(jData.data.status) === 2;
                                    //审核通过
                                    jData.data.pass = Number(jData.data.status) === 3;
                                }     
                            }else{
                                jData.data = {};
                                jData.data.nodata = true;
                            }

                            oAnt.set('data',jData.data);

                            //审核不通过时
                            oAnt.el.find('.green').click(function(){

                                jData.data.nopass = false;
                                jData.data.nodata = true;

                                oAnt.set('data',jData.data);

                            });

                        }else{
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                    }
                });
            };
            self.fHttps();

            oAnt.el.on('click','#submit',function(){
                oAnt.el.find('#form1').submit();
            });

            /*oAnt.el.find('#submit').click(function(){
                oAnt.el.find('form').trigger("submit");
            });*/

            oAnt.el.on('submit', 'form', function(){
                return false;
            });

        },
        onUpdate: function(oAnt){

            var _isCheckDomainName = false;
            var _aCPCallbas = [];
            var _isChecking = false;
            var fCheckDomainName = function(callback){
                callback = callback || function(){};

                if(_isCheckDomainName){
                    return callback(_isCheckDomainName);
                }

                _aCPCallbas.push(callback);
                if(_isChecking){
                    return;
                }
                //_isChecking = true;

                var domainName = oAnt.el.find("#domainName").val();
                var rResult = domainName.toLowerCase().match('www');
                if(oAnt.el.find("#domainName").hasClass('error')){
                    return;
                }
                if(rResult){
                    oAnt.el.find('#domainName').addClass('a-error');
                    oAnt.el.find('#domainName').parent().append('<div class="fm-error">'+Can.msg.MODULE.SHOWROOM_SET.DOMAIN_TIPS1+'</div>'); 
                    return;
                }
                if(domainName!=""){
                    $.ajax({
                        url: oConfig.setShowroomModule.EXIST_SHOWROOM_DOMAIN,
                        type: 'POST',
                        data: {"domainName":domainName},
                        success:function(oData){
                            _isChecking = false;

                            if(oData.status && oData.status ==="success"){
                                if(oData.data){
                                    oAnt.el.find("#domainName").data("status", false);
                                    _isCheckDomainName = false;
                                    $.each(_aCPCallbas, function(k,v){
                                        v(_isCheckDomainName);
                                    })
                                    if(oAnt.el.find('#domainName').hasClass('a-error')){
                                        return;
                                    }else{
                                        oAnt.el.find('#domainName').addClass('a-error');
                                        oAnt.el.find('#domainName').parent().append('<div class="fm-error">'+Can.msg.MODULE.SHOWROOM_SET.DOMAIN_TIPS+'</div>'); 
                                    }
                                }else{
                                    oAnt.el.find("#domainName").data("status", true);
                                    _isCheckDomainName = true;
                                    $.each(_aCPCallbas, function(k,v){
                                        v(_isCheckDomainName);
                                    })
                                }
                                
                                
                            }
                            else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, oData);
                            }

                            _aCPCallbas = [];
                        }
                    });
                }
            };
            oAnt.el.find("#domainName").data("status", false).blur(function() {
                _isCheckDomainName = false;
                var that = $(this);
                that.val(that.val().replace(/ /g,''));
                fCheckDomainName();
            });

            oAnt.el.find('#form1').off('validated').on('validated',function(){
                var domainName = oAnt.el.find('#domainName').val();
                //检测当前域名是否可用
                fCheckDomainName(function(){
                    var domainStatus = oAnt.el.find('#domainName').data("status");
                    if (!domainStatus){
                        return false;
                    }
                   $.ajax({
                        url: oConfig.setShowroomModule.SET_SHOWROOM_DOMAIN,
                        type: 'POST',
                        data: {"domainName":domainName},
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
                                $.ajax({
                                    url: oConfig.setShowroomModule.GET_SHOWROOM_DOMAIN,
                                    cache: false,
                                    dataType:'JSON',
                                    success: function(jData){
                                        if(jData.status && jData.status==="success"){

                                            if(jData.data){
                                                if(jData.data.status){
                                                    //审核不通过
                                                    jData.data.nopass = Number(jData.data.status) === -1;
                                                    //审核中
                                                    jData.data.pending = Number(jData.data.status) === 2;
                                                    //审核通过
                                                    jData.data.pass = Number(jData.data.status) === 3;
                                                }     
                                            }else{
                                                jData.data = {};
                                                jData.data.nodata = true;
                                            }

                                            oAnt.set('data',jData.data);

                                            //审核不通过时
                                            oAnt.el.find('.green').click(function(){

                                                jData.data.nopass = false;
                                                jData.data.nodata = true;

                                                oAnt.set('data',jData.data);

                                            });

                                        }else if(jData.status==="error"){
                                            oAnt.el.find('#domainName').addClass('a-error');
                                            oAnt.el.find('#domainName').parent().append('<div class="fm-error">'+Can.msg.MODULE.SHOWROOM_SET.DOMAIN_TIPS+'</div>');
                                        }
                                        else{
                                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                        }
                                    }
                                });
                                //self.showTips(Can.msg.MODULE.MY_SETTING.SUCCESS);
                            }else if(oData.status && oData.status==="error"){
                                //self.showTips(oData.message);
                            }
                            else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, oData);
                            }
                        }
                    });
                });
            });
        }
    });
})(Can, Can.view);
