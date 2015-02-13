/**
 * 展台设置 
 * - 后端：嘉林
 * - 产品经理： 龙旺
 * @Date: 2014-02-13 15:18:00
 * @Author: vfasky (vfasky@gmail.com)
 * @Version: $Id: sellerShowroomTemplate.js 84185 2014-09-05 06:06:40Z gangw $
 */
;(function(Can, view){
    'use strict';

    //加载双向绑定模板引擎
    Can.importJS([
        'js/utils/windowView.js',
        'js/framework/utils/two-way-tpl.js',
        'js/framework/utils/ui/window/actionWindow.js',
        'js/framework/jquery/jquery.cxcolor.js'
    ]);

    var template   = Can.util.TWtemplate;
    var _          = Can.util.i18n._;
    var oConfig    = Can.util.Config.seller;
    var sFontColor = '#71b81c';
    var baseTemplate = null;

    view.SellerShowroomTemplateView = Can.extend(Can.view.ShowroowBaseView, {
        startup:function () {
            var self = this;
            Can.view.ShowroowBaseView.superclass.startup.call(this);
            this.container = $('<div class="main"></div>');

            template.load('js/seller/view/sellerShowroomTemplate.html', function(tpl){
                self._$Tpl = $(tpl);

                self.container.html(self._$Tpl.find('#temple-cont').html());
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
            var oBase = {};
            var companyId = Can.util.userInfo().getCompanyId();
            var domainUrl = Can.util.domainUrl(companyId);
            oAnt.set('companyId',companyId);
            oAnt.set('domainUrl',domainUrl);
            
            //获取展台设置接口
            var fCallback = function(){
                $.ajax({
                    url: oConfig.setShowroomModule.GET_SHOWROOM_MODELS,
                    cache: false,
                    dataType:'JSON',
                    success: function(jData){
                        if(jData.status && jData.status==="success"){
                            for(var i = 0; i <jData.data.length; i++){
                                jData.data[i].moduleDisplay = jData.data[i].moduleDisplay.toString();
                                switch(jData.data[i].moduleType){
                                    case 1:
                                        //店招
                                        jData.data[i].isShowBase = true;
                                        oBase.companyLogo = jData.data[i].moduleData.companyLogo;
                                        oBase.companyName = jData.data[i].moduleData.companyName;
                                        oBase.backgroundImg = jData.data[i].moduleData.backgroundImg;
                                        oBase.totalCustomImg = jData.data[i].moduleData.totalCustomImg;
                                        oBase.backgroundType = jData.data[i].moduleData.backgroundType;
                                        oBase.fontColor = jData.data[i].moduleData.fontColor || '#71b81c';
                                        sFontColor = jData.data[i].moduleData.fontColor || '#71b81c';
                                        if(jData.data[i].moduleData.backgroundType ===null){

                                            jData.data[i].moduleData.tips = true;
                                        }else{
                                           jData.data[i].moduleData.tips = false; 
                                        }
                                        break;
                                    case 2:
                                        //广交会参展商展位信息
                                        jData.data[i].isShowBooth = true;
                                        break;
                                    case 3:
                                        //企业信息模块
                                        jData.data[i].isShowCompany = true;
                                        break;
                                    case 4:
                                        //橱窗产品展示
                                        jData.data[i].isShowCase = true;
                                        jData.data[i].moduleData.sccrow = [];
                                        //jData.data[i].moduleData.scRow = jData.data[i].moduleData.scRow.toString();
                                        if(jData.data[i].moduleData.scCol && jData.data[i].moduleData.scCol !==0){
                                            var num = (jData.data[i].moduleData.scProductMaxCount/jData.data[i].moduleData.scCol);
                                            for(var j = 1; j <= num; j++){
                                                
                                                jData.data[i].moduleData.sccrow.push({
                                                    "srow":j
                                                });
                                            }
                                        }
                                        break;
                                    case 5:
                                        //新产品展示
                                        jData.data[i].isShowNewProducts = true;
                                        break;
                                    case 6:
                                        //主营产品展示
                                        jData.data[i].isShowMainProducts = true;
                                        break;
                                    case 7:
                                        //自定义产品展示模块
                                        jData.data[i].isShowDiyProducts = true;
                                        break;
                                    case 8:
                                        //自定义通栏大图
                                        jData.data[i].isShowBanner = true;
                                        break;
                                }
                                if(jData.data[i].moduleData && jData.data[i].moduleData.newProductCount <12){
                                    jData.data[i].moduleData.lessNewProductCount = true;
                                }
                                if(jData.data[i].moduleData && jData.data[i].moduleData.scProductCount <10){
                                    jData.data[i].moduleData.lessProductCount = true;
                                }
                            }

                            jData.data = jData.data.sort(function(a,b){
                                return (a.moduleSeq - b.moduleSeq);
                            });

                            oAnt.set('data',jData.data);
                            //oAnt.update();
                            
                        }else{
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                    }
                });
            };
            fCallback();
        
            oAnt.el.on('change', 'select', function(){
                var oData = {};

                oData.moduleId = $(this).parent().attr('moduleId');
                oData.moduleDisplay = this.value;

                //设置展台模块是否显示
                $.ajax({
                    url: oConfig.setShowroomModule.SET_SHOWROOM_MODELS,
                    cache: false,
                    type: 'POST',
                    data: oData,
                    success: function(jData){
                        if(jData.status && jData.status==="success"){

                        }else{
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                    }
                });
            }).on('click','#release',function(){
                //发布
                $.ajax({
                    url: oConfig.setShowroomModule.RELEASE_SHROWROOM_SETTING,
                    cache: false,
                    success: function(jData){
                        if(jData.status && jData.status==="success"){
                            //Can.util.notice(Can.msg.MODULE.BUYER_LEAD_MANAGE.SAVE);
                            var $tip = oAnt.el.find('.text-tips');
                            $tip.fadeIn();
                            setTimeout(function () {
                                $tip.fadeOut('slow');
                            }, 1500);
                        }else{
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                    }
                })
            });

            //店招設置恢復
            var $cont = oAnt.el.find('#shoroom_base');
            
            oAnt.el.on('click','#base-recover',function(){
                $.ajax({
                    url:oConfig.setShowroomModule.RECOVER_SHOWROOM_BG,
                    type:'GET',
                    cache:false,
                    success:function(jData){
                        if (jData.status && jData.status === "success") {                         
                            if(baseTemplate && baseTemplate.get('base')){
                                var baseObj = baseTemplate.get('base');
                                baseObj.backgroundImg ='';
                                baseObj.totalCustomImg = '';
                                baseObj.backgroundType = 1;
                                baseObj.isUploadbg = false;
                                baseTemplate.set('base',baseObj);
                                baseTemplate.update();
                            }
                            fCallback();
                        } else {
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                    }
                });

            });
            
            //店招点击弹窗
            oAnt.el.on('click','#base-diy',function(){
                if(self.baseWin){
                    self.baseWin.show();
                    return false;
                }
                var $wcon = $(self._$Tpl.find('#my-base').html());

                var main = function(oAntBase){
                
                    self.baseWin = new Can.util.ui.window.ActionWindow({
                        width: 770,
                        zIndex: 850,
                        title: Can.msg.MODULE.SHOWROOM_SET.TEMPLATE_SET_BASETITLE,
                        actions: []
                    });
                    self.baseWin.setMessage(oAntBase.el);
                    self.baseWin.show();
                    oBase.isUpload = true;
                    oBase.isUploadbg = true;
                    if(!oBase.totalCustomImg){
                       oBase.isUpload = false; 
                    }
                    if(!oBase.backgroundImg){
                       oBase.isUploadbg = false;  
                    }
                    if(oBase.backgroundType === 0){
                        oBase.isDisplay = true;
                        oAntBase.el.find('.diy').eq(0).addClass('cur').find('.icons').attr('class','icons select-6');
                        oAntBase.el.find('.cont').addClass('hidden').eq(0).removeClass('hidden');
                    }else{
                        oBase.isDisplay = false;
                        oAntBase.el.find('.diy').eq(1).addClass('cur').find('.icons').attr('class','icons select-6');
                        oAntBase.el.find('.cont').addClass('hidden').eq(1).removeClass('hidden');
                    }                    
                    oAntBase.set('base',oBase);
                    
                    oAntBase.el.on('click','.diy',function(){
                        //tab切换
                        oAntBase.el.find('.diy').removeClass('cur');
                        oAntBase.el.find('.diy .icons').attr('class','icons select-5');
                        $(this).addClass('cur');
                        $(this).find('.icons').attr('class','icons select-6');
                        
                        var index = $(this).index();
                        //var aData = oAntBase.get('base');

                        if(index === 0){
                            oAntBase.el.find('.cont').addClass('hidden').eq(0).removeClass('hidden');
                        }else{
                            oAntBase.el.find('.cont').addClass('hidden').eq(1).removeClass('hidden');
                        }
                        //oAntBase.set('oBase',aData);
                        //oAntBase.update();
                    });
                    oAntBase.el.find('.ico-color').cxColor({
                        color:oBase.fontColor
                    });

                    oAntBase.el.find('#color').bind("change",function(){
                        oAntBase.el.find('#colorCompanyName').css("color",this.value);
                    });

                    //保存自定义背景图
                    oAntBase.el.on('click','#save-base',function(){
                        var aData = oAntBase.get('base');
                        var oData = {
                            "type":0,
                            "background":aData.totalCustomImg
                        };
                        $.ajax({
                            url: oConfig.setShowroomModule.SET_SHOWROOM_BG,
                            cache: false,
                            type: 'POST',
                            data: oData,
                            success: function(jData){
                                if(jData.status && jData.status==="success"){
                                    self.baseWin.close();
                                    fCallback();
                                }
                            }
                        });
                    });

                    //保存背景自定义图
                    oAntBase.el.on('click','#save-basebg',function(){
                        var aData = oAntBase.get('base');
                        //var fontColor = oAntBase.el.find('#colorCompanyName').css("color");
                        var fontColor = oAntBase.el.find('#color').attr('title');
                        var oData = {
                            "type":1,
                            "background":aData.backgroundImg,
                            "fontColor":fontColor
                        };
                        $.ajax({
                            url: oConfig.setShowroomModule.SET_SHOWROOM_BG,
                            cache: false,
                            type: 'POST',
                            data: oData,
                            success: function(jData){
                                if(jData.status && jData.status==="success"){
                                    self.baseWin.close();
                                    fCallback();
                                }
                            }
                        });
                    });
                
                    self.baseWin.show();
                };

                var upload = function(oAntBase){
                    oAntBase.el.find('#colorCompanyName').css('color',sFontColor);
                    //上传完全自定义背景图
                    oAntBase.el.find('.base1[uploader]').unbind('uploadSuccess').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){
                        var aData = oAntBase.get('base');
                        aData.totalCustomImg = oData.abslouteUrl;
                        aData.isUpload = true;
                        oAntBase.set('base', aData);
                        oAntBase.update();
                    });
                     //上传背景自定义图
                    oAntBase.el.find('.base2[uploader]').unbind('uploadSuccess').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){
                        var aData = oAntBase.get('base');
                        aData.backgroundImg = oData.abslouteUrl;
                        aData.isUploadbg = true;
                        oAntBase.set('base', aData);
                        oAntBase.update();
                    });
                };

                baseTemplate =  template($wcon, {
                    events: {
                        render: function(){                       
                            main(this);
                        },
                        update: function(){                         
                            upload(this);
                        }
                    }
                });
           
            });

            //通栏大图
            var $contbanner = oAnt.el.find('#shoroom_banner');
            var $wconbanner = $(self._$Tpl.find('#my-banner').html());

            //通栏大图点击弹窗
            oAnt.el.on('click',"#edit-banner",function(){
                if(self.bannerPicWin){
                    self.bannerPicWin.show();
                    return false;
                }
                var main = function(oAntbanner){
                
                    self.bannerPicWin = new Can.util.ui.window.ActionWindow({
                        width: 770,
                        zIndex: 850,
                        title: Can.msg.MODULE.SHOWROOM_SET.TEMPLATE_SET_BANNER,
                        actions: []
                    });
                    self.bannerPicWin.setMessage(oAntbanner.el);

                    $.ajax({
                        url: oConfig.setShowroomModule.GET_SHOWROOM_BIMG,
                        cache: false,
                        dataType:'JSON',
                        success: function(jData){
                            if(jData.status && jData.status==="success"){
                                jData.data[0].isAdd = (jData.data[0].photos.length <= 4);
                                jData.data[0].tips = false;
                                if(!jData.data[0].isDisplay &&!jData.data[1].isDisplay){
                                    jData.data[0].isDisplay = 1;
                                }
                                if(jData.data[0].photos.length <= 0){
                                    jData.data[0].tips = true;
                                }

                                oAntbanner.set('bigpic',jData.data[0]);
                                if(jData.data[0].photos.length <= 0){
                                    oAntbanner.el.find('#save-bigpic').addClass('dis');
                                }

                                jData.data[1].isAdd = (jData.data[1].photos.length < 9);

                                jData.data[1].tips = false;
                                if(jData.data[1].photos.length < 3){
                                    jData.data[1].tips = true;
                                }
                                oAntbanner.set('roompic',jData.data[1]);

                                if(jData.data[1].photos.length < 3){
                                    oAntbanner.el.find('#save-roompic').addClass('dis');
                                }

                                if(jData.data[0].isDisplay === 1){
                                    oAntbanner.el.find('.diy').eq(0).addClass('cur');
                                    oAntbanner.el.find('.diy').eq(0).find('.icons').attr('class','icons select-6');
                                }else{
                                    oAntbanner.el.find('.diy').eq(1).addClass('cur');
                                    oAntbanner.el.find('.diy').eq(1).find('.icons').attr('class','icons select-6');
                                }
                            }else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                            }
                        }
                    });
                    oAntbanner.el.on('click','.diy',function(){
                        //tab切换
                        oAntbanner.el.find('.diy').removeClass('cur');
                        oAntbanner.el.find('.diy .icons').attr('class','icons select-5');
                        $(this).addClass('cur');
                        $(this).find('.icons').attr('class','icons select-6');
                        

                        var index = $(this).index();
                        var aDataBig = oAntbanner.get('bigpic');
                        var aDataRoom = oAntbanner.get('roompic');
                        if(index === 0){
                            aDataBig.isDisplay = 1;
                            aDataRoom.isDisplay = 0;
                        }else{
                            aDataBig.isDisplay = 0;
                            aDataRoom.isDisplay = 1;
                        }

                        oAntbanner.set('bigpic',aDataBig);
                        oAntbanner.set('roompic',aDataRoom);
                        oAntbanner.update();

                    }).on('click','.close-bg',function(){
                        //展台轮播背景图删除
                        var aData = oAntbanner.get('roompic');
                        aData.useDefaultBg = 0;
                        oAntbanner.set('roompic', aData);
                        oAntbanner.update();
                    }).on('click','#add-bigpic',function(){
                        //通栏轮播添加
                        var aData = oAntbanner.get('bigpic');
                        oAntbanner.el.find('#save-bigpic').removeClass('dis');
                        if(aData.photos.length >=1){
                            if(!aData.photos[aData.photos.length-1].photoUrl ||!aData.photos[aData.photos.length-1].photoName ||!aData.photos[aData.photos.length-1].photoUrl){
                                oAntbanner.el.find('#form1').submit();
                                return;
                            }
                        }

                        aData.photos.push({});
                        aData.isAdd = (aData.photos.length <= 4);
                        aData.tips = false;
                        for(var i = 0; i < aData.photos.length; i++){
                            aData.photos[i].index = Math.floor(Math.random()*100);
                        }
                        //oAntbanner.set('roompic', aData);
                        oAntbanner.set('bigpic', aData);
                        oAntbanner.update();
                    }).on('click','.close-bigpic',function(){
                        //通栏轮播小图删除
                        var aData = oAntbanner.get('bigpic');
                        var nIndex = $(this).parent().index();

                        aData.photos.splice(nIndex,1);
                        aData.isAdd = true;
                        if(aData.photos.length<1){
                            aData.tips = true;
                            oAntbanner.el.find('#save-bigpic').addClass('dis');
                        }
                        oAntbanner.set('bigpic', aData);
                        oAntbanner.update();

                    }).on('click','#add-roompic',function(){
                        //展台轮播小图添加
                        var aData = oAntbanner.get('roompic');
                        if(aData.photos.length >=1){
                            if(!aData.photos[aData.photos.length-1].photoUrl ||!aData.photos[aData.photos.length-1].photoName ||!aData.photos[aData.photos.length-1].photoUrl){
                                oAntbanner.el.find('#form2').submit();
                                return;
                            }
                        }

                        aData.photos.push({});
                        aData.isAdd = (aData.photos.length < 9);
                        if(aData.photos.length<3){
                            aData.tips = true;
                            oAntbanner.el.find('#save-roompic').addClass('dis');
                        }else{
                            aData.tips = false;
                            oAntbanner.el.find('#save-roompic').removeClass('dis');
                        }
                        for(var i = 0; i < aData.photos.length; i++){
                            aData.photos[i].index = Math.floor(Math.random()*1000);
                        }
                        oAntbanner.set('roompic', aData);
                        oAntbanner.update();
                    }).on('click','.close-roompic',function(){
                        //展台轮播小图删除
                        var aData = oAntbanner.get('roompic');
                        var nIndex = $(this).parent().index();

                        aData.photos.splice(nIndex,1);
                        aData.isAdd = true;
                        if(aData.photos.length<3){
                            aData.tips = true;
                            oAntbanner.el.find('#save-roompic').addClass('dis');
                        }
                        oAntbanner.set('roompic', aData);
                        oAntbanner.update();
                    }).on('click','#save-bigpic',function(){
                        oAntbanner.el.find('#form1').submit();
                    }).on('click','#save-roompic',function(){
                        oAntbanner.el.find('#form2').submit(); 
                    });
                    
                    oAntbanner.el.on('submit', 'form', function(){
                        return false;
                    });
            
                

                    self.bannerPicWin.show();
                };

                var upload = function(oAntbanner){
                    $(window).trigger('resize');
                    var nNumpic = oAntbanner.get('bigpic.photos');
                    oAntbanner.el.find('#add-npic span').text(nNumpic.length);

                    var nNumroompic = oAntbanner.get('roompic.photos');
                    oAntbanner.el.find('#add-nroom span').text(nNumroompic.length);
                    if(nNumroompic.length<3){
                       oAntbanner.el.find('#save-roompic').addClass('dis'); 
                    }

                    //上传展台轮播背景图
                    oAntbanner.el.find('.upload-bigbtn[uploader]').unbind('uploadSuccess').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){
                        var aData = oAntbanner.get('roompic');
                        aData.useDefaultBg = 1;
                        aData.backgroundImg = oData.abslouteUrl;
                        setTimeout(function(){
                            oAntbanner.set('roompic', aData);
                            oAntbanner.update();
                        },300);
                        
                    });

                    //上传通栏轮播小图
                    oAntbanner.el.find('.upload-bigpic[uploader]').unbind('uploadSuccess').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){
                        var aData = oAntbanner.get('bigpic');
                        aData.photos[aData.photos.length-1].photoUrl = oData.abslouteUrl;
                        setTimeout(function(){
                            oAntbanner.set('bigpic', aData);
                            oAntbanner.update();
                        },300);
                    });

                    //上传展台轮播小图
                    oAntbanner.el.find('.upload-roompic[uploader]').unbind('uploadSuccess').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){
                        var aData = oAntbanner.get('roompic');
                        aData.photos[aData.photos.length-1].photoUrl = oData.abslouteUrl;
                        setTimeout(function(){
                            oAntbanner.set('roompic', aData);
                            oAntbanner.update();
                        },300);
                    });
                    //保存通栏轮播
                    oAntbanner.el.find('#form1').off('validated').on('validated', function(){

                        var oData = oAntbanner.get('bigpic');
                        if(oData.tips){
                            return;
                        }
                        var aPhotoName = [];
                        var aPhotoHttp = [];
                        var aPhotoUrl = [];

                        $.each(oData.photos ,function(k, v){

                            aPhotoName.push(v.photoName);
                            aPhotoHttp.push(v.photoHttp);
                            aPhotoUrl.push(v.photoUrl);

                        });

                        var oData1 = {
                            "bannerType":1,
                            "bannerPhotoNames":aPhotoName,
                            "bannerPhotoHttps":aPhotoHttp,
                            "bannerPhotoUrls":aPhotoUrl
                        }
                        var sData = Can.util.formatFormData(oData1);
                        $.ajax({
                            url: oConfig.setShowroomModule.SET_SHOWROOM_BIMG,
                            cache: false,
                            type: 'POST',
                            data: sData,
                            success: function(jData){
                                if(jData.status && jData.status==="success"){
                                    self.bannerPicWin.close();
                                }else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                }
                            }
                        });
                    });
                    //保存展台轮播
                    oAntbanner.el.find('#form2').off('validated').on('validated', function(){
                        var oData = oAntbanner.get('roompic');
                        if(oData.tips){
                            return;
                        }
                        var aPhotoName = [];
                        var aPhotoHttp = [];
                        var aPhotoUrl = [];

                        $.each(oData.photos ,function(k, v){

                            aPhotoName.push(v.photoName);
                            aPhotoHttp.push(v.photoHttp);
                            aPhotoUrl.push(v.photoUrl);

                        });
                        var oData1 = {
                            "bannerType":2,
                            "useDefaultImg":oData.useDefaultBg,
                            "backgroundImg":oData.backgroundImg,
                            "srPhotoNames":aPhotoName,
                            "srPhotoHttps":aPhotoHttp,
                            "srPhotoUrls":aPhotoUrl
                        }
                        var oData2 = $.param(oData1, true);
                        $.ajax({
                            url: oConfig.setShowroomModule.SET_SHOWROOM_BIMG,
                            cache: false,
                            type: 'POST',
                            data: oData2,
                            success: function(jData){
                                if(jData.status && jData.status==="success"){
                                    self.bannerPicWin.close();
                                }else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                }
                            }
                        });
                    });
                }

                self.wconbannerAnt = template($wconbanner, {
                    events: {
                        render: function(){
                            main(this);
                        },
                        update: function(){
                            upload(this);
                        }
                    }
                });
            });

            //主营产品
            var $contmainproducts = oAnt.el.find('#showroom_mainproducts');
            var $wconmainproducts = $(self._$Tpl.find('#my-mainproducts').html());

            //主营产品点击弹窗
            oAnt.el.on('click',"#win-mainproducts",function(){
                if(self.mainproductsWin){
                    self.mainproductsWin.show();
                    return false;
                }
                var main = function(oAnt){
                
                    self.mainproductsWin = new Can.util.ui.window.ActionWindow({
                        width: 600,
                        zIndex: 850,
                        title: Can.msg.MODULE.SHOWROOM_SET.TEMPLATE_SET_PRODUCTS,
                        actions: []
                    });
                    self.mainproductsWin.setMessage(oAnt.el);
                    self.mainproductsWin.show();
                    $.ajax({
                        url: oConfig.setShowroomModule.GET_SHOWROOM_MP,
                        cache: false,
                        dataType:'JSON',
                        success: function(jData){
                            if(jData.status && jData.status==="success"){
                                var aGroupList  = [];
                                var aSelectList = [];

                                $.each(jData.data.groupList,function(k, v){
                                    
                                    var isIn = false;
                                    $.each(jData.data.selected, function(k1, v1){
                                        if(Number(v.groupId) === Number(v1)){
                                            aSelectList.push(v);
                                            isIn = true;
                                            return false;
                                        }
                                    });
                                    if(false === isIn){
                                        aGroupList.push(v);
                                    }
                                    
                                });

                                if(aSelectList.length<=1){
                                    oAnt.el.find('#del-select').addClass('dis');
                                }
                                if(aSelectList.length>=7){
                                    oAnt.el.find('#list-select').addClass('dis');
                                }

                                oAnt.set('list',aGroupList);
                                oAnt.set('mainpro-select',aSelectList);
                                oAnt.el.find('#nselect span').text(aSelectList.length);
                            }else{
                                Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                            }
                        }
                    });
                    oAnt.el.on('click', '#list-select', function(){
                        //add
                        if($(this).hasClass('dis')){
                            return;
                        }

                        var $leftSelect = oAnt.el.find('select[name=type]');

                        var aSelects    = $leftSelect.val();
                        if(!aSelects){
                            return;
                        }

                        var aGroupList  = [];
                        var aSelectList = oAnt.get('mainpro-select');
                        if((aSelectList.length+aSelects.length)>7){
                            var $tip = oAnt.el.find('.text-tips');
                            $tip.fadeIn();
                            setTimeout(function () {
                                $tip.fadeOut('slow');
                            }, 1500);
                            return;
                        }

                        $.each(oAnt.get('list') ,function(k, v){
                                    
                            var isIn = false;
                            $.each(aSelects, function(k1, v1){
                                if(Number(v.groupId) === Number(v1)){
                                    aSelectList.push(v);
                                    isIn = true;
                                    return false;
                                }
                            });
                            if(false === isIn){
                                aGroupList.push(v);
                            }
                            
                        });

                        if(aSelectList.length >=7){
                            $(this).addClass('dis');
                        }

                        oAnt.set('list',aGroupList);
                        oAnt.set('mainpro-select',aSelectList);
                        oAnt.el.find('#nselect span').text(aSelectList.length);

                        oAnt.el.find('#del-select').removeClass('dis');

                    }).on('click','#del-select',function(){
                        //del
                        if($(this).hasClass('dis')){
                            return;
                        }
                        var $rightSelect = oAnt.el.find('select[name=groupIds]');

                        var aSelects    = $rightSelect.val();
                        if(!aSelects){
                            return;
                        }
                        if(aSelects.length>=7){
                            var $tip = oAnt.el.find('.text-tips');
                            $tip.fadeIn();
                            setTimeout(function () {
                                $tip.fadeOut('slow');
                            }, 1500);
                            return;
                        }

                        var aGroupList  = [];
                        var aSelectList = oAnt.get('list');

                        $.each(oAnt.get('mainpro-select') ,function(k, v){
                                    
                            var isIn = false;
                            $.each(aSelects, function(k1, v1){
                                if(Number(v.groupId) === Number(v1)){
                                    aSelectList.push(v);
                                    isIn = true;
                                    return false;
                                }
                            });
                            if(false === isIn){
                                aGroupList.push(v);
                            }
                            
                        });

                        if(aGroupList.length<=1){
                            $(this).addClass('dis');
                        }
                        oAnt.set('list',aSelectList);
                        oAnt.set('mainpro-select',aGroupList);
                        oAnt.el.find('#nselect span').text(aGroupList.length);
                        oAnt.el.find('#list-select').removeClass('dis');

                    }).on('click','#save-mainpro',function(){

                        var aData = [];
                        $.each(oAnt.get('mainpro-select') ,function(k, v){                           
                            aData.push(v.groupId);
                        });
                        var oData = {
                            "groupIds":aData
                        };
                        oData = $.param(oData, true);
                        //保存
                        $.ajax({
                            url: oConfig.setShowroomModule.SET_SHOWROOM_MP,
                            cache: false,
                            type: 'POST',
                            data: oData,
                            success: function(jData){
                                if(jData.status && jData.status==="success"){
                                    self.mainproductsWin.close();
                                }else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                }
                            }
                        });
                    });
                };

                template($wconmainproducts, {
                    events: {
                        render: function(){
                            main(this);
                        }
                    }
                });
            });

            //展位信息点击弹窗
            var $contbooth = oAnt.el.find('#showroom_booth');
            var $wconbooth = $(self._$Tpl.find('#my-booth').html());

            oAnt.el.on('click','#win-booth',function(){
                if(self.boothPicWin){
                    self.boothPicWin.show();
                    return false;
                }
                var main = function(oAntbooth){
                
                    self.boothPicWin = new Can.util.ui.window.ActionWindow({
                        width: 770,
                        zIndex: 850,
                        title: Can.msg.MODULE.SHOWROOM_SET.TEMPLATE_SET_BOOTH,
                        actions: []
                    });
                    self.boothPicWin.setMessage(oAntbooth.el);

                    //show每一届的详细信息
                    var fFairBooth = function(nId, isNumber){
                        isNumber = isNumber === undefined ? true : isNumber;
                        $.ajax({
                            url: oConfig.setShowroomModule.FIND_FAIR_BOOTH,
                            cache: false,
                            dataType:'JSON',
                            data:{"fairNum":nId},
                            success: function(jData){
                                if(jData.status && jData.status==="success"){
            
                                    var oData  = oAntbooth.get('settedBooth');
                                    $.each(oData, function(k, v){
                                        if(nId !== v.setted){
                                            v.isShowBoothItem = false;
                                            return;
                                        }
                                        v.isShowBoothItem = true;
                                        v.boothNums       = jData.data.boothNums;
                                        v.boothPhotos     = jData.data.boothPhotos;
                                        
                                        oAntbooth.set('boothIndex', k);

                                    });
                                    oAntbooth.set('settedBooth',oData);
                                    oAntbooth.set('isformbooth',false);
                                    oAntbooth.set('isNumber', isNumber);
                                    oAntbooth.set('nId',nId);
                                    oAntbooth.update();
                                    $(window).trigger('resize');
                                }
                            }
                        });
                    };
                    self.fairBooth = fFairBooth;

                    $.ajax({
                        url: oConfig.setShowroomModule.FIND_ALL_FAIR_NUM,
                        cache: false,
                        dataType:'JSON',
                        success: function(jData){
                            if(jData.status && jData.status==="success"){
                                var aGroupList = [];
                                var aSelect = [];

                                $.each(jData.data.all,function(k, v){
    
                                    var isIn = false;
                                    $.each(jData.data.setted, function(k1, v1){
                                        if(Number(v) === Number(v1)){
       
                                            isIn = true;
                                            return false;
                                        }
                                    });
                                    if(false === isIn){
                                        aGroupList.push({
                                            "boothNum":v
                                        });
                                    }
                                    
                                });
                                if(aGroupList.length<=0){
                                    oAntbooth.set('isShowBoothNum',false);
                                }else{
                                    oAntbooth.set('isShowBoothNum',true);
                                }
                                oAntbooth.set('boothAll',aGroupList);

                                //自己添加的届数
                                if(jData.data.setted && jData.data.setted.length > 0){
                                    $.each(jData.data.setted, function(index, val) {
                                        if(val !== ''){
                                            aSelect.push({
                                                "setted":val,
                                                "isShowBoothItem":false,
                                                "isShowBoothName":true
                                            });
                                        }

                                    });
                                    
                                    oAntbooth.set('settedBooth',aSelect);
                                    self.fairBooth(aSelect[0].setted);
                                }else{
                                    oAntbooth.set('settedBooth',[]);
                                }
                                $(window).trigger('resize');
                            }
                        }
                    });

                    oAntbooth.el.on('click','#add-booth',function(){
                        //添加某一届信息
                        var aData = oAntbooth.get('settedBooth');
                        var sNum = oAntbooth.el.find('#booth').val();
                        aData.push({
                            "setted":sNum,
                            "isShowBoothList":true,
                            "isShowBoothName":true,
                            "index":aData.length
                        });
                        oAntbooth.set('settedBooth',aData);

                        var aDatabooth = oAntbooth.get('boothAll');

                        for(var i = 0; i < aDatabooth.length; i++){
                            if(sNum === aDatabooth[i].boothNum){
                                aDatabooth.splice(i,1);
                            }
                        }
                        if(aDatabooth.length<=0){
                            oAntbooth.set('isShowBoothNum',false);
                        }
                        oAntbooth.set('boothAll',aDatabooth);
                        oAntbooth.update();
                        fFairBooth(sNum);

                    }).on('click','.add-boothnum',function(){
                        //save展位号
                        oAntbooth.el.find('.save-booth').submit(); 
                    }).on('click','#add-boothName',function(){
                        //添加展位号
                        if(oAntbooth.get('isformbooth') === true){
                            return;
                        }
                        oAntbooth.set('isformbooth',true);
                        oAntbooth.update();
                    }).on('click','.down',function(){
                        //点击展开
                        var $el = $(this);
                        var nId = $el.attr('data-id');
                        fFairBooth(nId);

                    }).on('click','#add-boothpic',function(){
                        //添加展位图-一张张
                        
                        var nBoothIndex = oAntbooth.data.boothIndex;
                        var oData  = oAntbooth.data.settedBooth[nBoothIndex] || {};

                        oData.boothPhotos = oData.boothPhotos || [];
                        if(oData.boothPhotos.length >=1){
                            if(!oData.boothPhotos[oData.boothPhotos.length-1].photoName ||!oData.boothPhotos[oData.boothPhotos.length-1].photoUrl){
                                oAntbooth.el.find('.save-boothpic').submit();
                                return;
                            }
                        }
                        oData.boothPhotos.push({});

                        oAntbooth.set('settedBooth[' + nBoothIndex + ']', oData);
                        oAntbooth.update();

                    }).on('click','#save-roompic',function(){
                        //add展位图
                        oAntbooth.el.find('.save-boothpic').submit();
                    }).on('click','.del',function(){
                        //删除某一届展位
                        var nId = $(this).attr('data-id');
                        $.ajax({
                            url: oConfig.setShowroomModule.DELETE_FAIR_BOOTH,
                            cache: false,
                            type: 'POST',
                            data: {"fairNum":nId},
                            success: function(jData){
                                if(jData.status && jData.status==="success"){
                                    var aData = oAntbooth.get('settedBooth');
                                    var aDatabooth = oAntbooth.get('boothAll');
                                    for(var i = 0; i < aData.length; i++){
                                        if(nId === aData[i].setted){
                                            aData.splice(i,1);

                                            aDatabooth.push({
                                                "boothNum":nId
                                            });

                                            aDatabooth = aDatabooth.sort(function(a,b){
                                                return (b.boothNum - a.boothNum);
                                            });

                                            oAntbooth.set('settedBooth',aData);
                                            oAntbooth.set('isShowBoothNum',true);
                                            oAntbooth.set('boothAll',aDatabooth);
                                            return;
                                        }
                                    }

                                }else{
                                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                }
                            }
                        });
                    }).on('click','.mode span', function(){
                        //tab切换
                        var $el     = $(this);
                        var index   = $el.index();
                        var nId     = $el.attr('data-id');
                        var oData   = oAntbooth.get('settedBooth');
                       
                        oAntbooth.set('settedBooth',oData);
                        oAntbooth.set('isNumber', index === 0);
                        oAntbooth.update();

                    });

                    oAntbooth.el.on('submit', 'form', function(){
                        return false;
                    });

                
                    self.boothPicWin.show();
                };
                var upload = function(oAntbooth){
                    $(window).trigger('resize');
                    //展台图片
                    if(false === oAntbooth.data.isNumber){
                        var $con        = oAntbooth.el.find('#booth-image-wrap');
                        var nBoothIndex = oAntbooth.data.boothIndex;

                        $con.html(self._$Tpl.find('#booth-image-tpl').html());

                        var imgMain = function(oAntImg){

                            var fSave = function(){
                                //save展位图片
                                var nId = oAntbooth.data.nId;
                                var oData = oAntImg.data.boothPhotos;
                                var aName = [];
                                var aUrl = [];
                                var aPhotos = [];

                                $.each(oData ,function(k, v){
                                    aName.push(v.photoName);
                                    aUrl.push(v.photoUrl);
                                    aPhotos.push({
                                        "name":v.photoName,
                                        "url":v.photoUrl
                                    });

                                });
                                var oData1 = {
                                    "fairNum":nId,
                                    "name":aName,
                                    "url":aUrl
                                }
                                var sData = Can.util.formatFormData(oData1);
                                $.ajax({
                                    url: oConfig.setShowroomModule.SAVE_FAIR_BOOTHPHOTO,
                                    cache: false,
                                    type: 'POST',
                                    data: sData,
                                    success: function(jData){
                                        if(jData.status && jData.status==="success"){
                                            var $tip = oAntImg.el.find('.text-tips');
                                            $tip.fadeIn();
                                            setTimeout(function () {
                                                $tip.fadeOut('slow');
                                                self.fairBooth(oAntbooth.data.nId, false);
                                                //$(window).trigger('resize');
                                            }, 1500);
                                            //fShowTips();
                                            //fFairBooth(nId,oAntbooth);
                                        }else{
                                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                        }
                                    }
                                });
                            };

                            oAntImg.el.on('click','.del-boothpic',function(){

                                var nIndex = $(this).parent().index();
                                //del展位图
                                $.each(oAntImg.data.boothPhotos,function(k,v){
                                    if(k === nIndex){
                                        oAntImg.data.boothPhotos.splice(k,1);
                                        //oAntImg.set('boothPhotos',oAntImg.data.boothPhotos);
                                        //self.fairBooth(oAntbooth.data.nId);
                                        return false;
                                    }
                                });
                                fSave();
                            });
                            //上传展位图
                            oAntImg.el.find('.upload-boothpic[uploader]').unbind('uploadSuccess').bind('uploadSuccess',function(oEl, oData, oFile, oUploader){

                                oAntImg.data.boothPhotos[oAntImg.data.boothPhotos.length-1].photoUrl  = oData.abslouteUrl;
                                oAntImg.data.boothPhotos[oAntImg.data.boothPhotos.length-1].photoName = 'Image name';
                                oAntImg.set('boothPhotos', oAntImg.data.boothPhotos);
                                oAntImg.update();
                                fSave();

                            });
                            
                            //保存展位图
                            oAntImg.el.find('.save-boothpic').off('validated').on('validated', function(){
                                fSave();
                                
                            })
                        };

                        template($con, {
                            data: {
                                boothPhotos: oAntbooth.data.settedBooth[nBoothIndex].boothPhotos
                            },
                            events: {
                                render: function(){
                                    imgMain(this);
                                }
                            }
                        });
                    }else{
                        var $conName    = oAntbooth.el.find('#booth-name-wrap');
                        var nBoothIndex = oAntbooth.data.boothIndex;
                        var oData       = oAntbooth.data.settedBooth[nBoothIndex] || {};

                        $conName.html(self._$Tpl.find('#booth-name-tpl').html());

                        var nameMain = function(oAntName){
                            oAntName.el.on('click','.del-boothnum',function(){
                                //删除展位号
                                var fairNum = $(this).attr('data-fairNum');
                                var srBsId = $(this).attr('data-srbsid');
                                $.ajax({
                                    url: oConfig.setShowroomModule.DELETE_FAIR_BOOTHNUM,
                                    cache: false,
                                    type: 'POST',
                                    data: {"fairNum":fairNum,"srBsId":srBsId},
                                    success: function(jData){
                                        if(jData.status && jData.status==="success"){
                                            self.fairBooth(oAntbooth.data.nId);
                                            //fFairBooth(fairNum,oAntbooth);
                                        }else{
                                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                        }
                                    } 
                                });
                            })
                            //保存展位号
                            oAntName.el.find('.save-booth').off('validated').on('validated', function(){
                                //var nId = oAntbooth.data.nId;
                                var sData = $(this).serialize();
                                $.ajax({
                                    url: oConfig.setShowroomModule.SAVE_FAIR_BOOTH,
                                    cache: false,
                                    type: 'POST',
                                    data: sData,
                                    success: function(jData){
                                        if(jData.status && jData.status==="success"){
                                            //oData.boothNums.push
                                            //oAntName.set('boothNums',jData.data.boothNums);
                                           // oAntName.update();
                                            self.fairBooth(oAntbooth.data.nId);

                                        }else{
                                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                                        }
                                    }
                                });
                            });
                        };


                        template($conName, {
                            data: {
                               boothNums: oData.boothNums || [],
                               nId: oAntbooth.data.nId
                            },
                            events: {
                                render: function(){
                                    nameMain(this);
                                }
                            }
                        });
                    }
                };

                template($wconbooth, {
                    events: {
                        render: function(){
                            main(this);
                        },
                        update: function(){
                            upload(this);
                        }
                    }
                });
            });
            //oAnt.el.find('#test').cxColor();
        },
        onUpdate: function(oAnt){
            //console.log(oAnt);
            //橱窗产品选择行数
            oAnt.el.find('.name').css('color',sFontColor);
            oAnt.el.find('#seletc-row').bind('selected',function(e, val){
                var oData = {
                    "row":val,
                    "col":5
                };
                $.ajax({
                    url: oConfig.setShowroomModule.SAVE_CASE_PRODUCT,
                    cache: false,
                    data: oData,
                    type: 'POST',
                    success: function(jData){
                        if(jData.status && jData.status==="success"){
                        }
                        else{
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
                        }
                    }
                });
            });
        }

    });
})(Can, Can.view);
