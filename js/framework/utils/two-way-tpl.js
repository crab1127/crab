/**
 * 双向绑定的模板引擎
 * @Author vfasky
 * @Date 2013-09-10
 */
;(function(Can){
    Can.importJS([
        'js/plugin/antjs/ant.js',
        'js/framework/utils/i18n.js',
        'js/plugin/validator/validator.js'
    ]);

    // 加载语言包
    Can.util.i18n.loadDict(Can.util.Config.lang, Can.msg);
    Can.util.i18n.setLang(Can.util.Config.lang);
    
    /**
     * 模板缓存
     */
    var _oTplCache = {};

    /**
     * 存放渲染指令
     */
    var _oRender = {};
    
    /**
     * 格式化 i18n, 支持参数传递
     * this %s ，hello %s | me | word 
     * ## 新加：
     *  this %(name), hello %(you) | you: word | name: ddd 
     * 这样的格式
     *
     */
    var fFormatI18n = function (sTxt) {
        if(sTxt !== ''){
            var aT = sTxt.split('|');
            var aArgs = [];
            var oDict = {};
            var sStr, i;
            $.each(aT, function(k, v){
                var text = $.trim(v);
                if(0 === k){
                    sStr = text;
                }
                else if(text.indexOf(':') > 0){
                    var ix = text.indexOf(':');
                    var key = '';
                    var val = '';
                    var len = text.length;
                    for(i=0; i<ix; i++){
                        key = key + text[i].toString();
                    }
                    for(i=(ix+1); i<len; i++){
                        val = val + text[i].toString();
                    }
                    oDict[$.trim(key)] = $.trim(val);
                }
                aArgs.push(text);
            });

            if (typeof Object.getOwnPropertyNames !== "function") {
                Object.getOwnPropertyNames = function (obj) {
                    var keys = [];
                    if (typeof obj === "object" && obj !== null) {    
                        for (var x in obj) {
                            if (obj.hasOwnProperty(x)) {
                                keys.push(x);
                            }
                        }
                    }
                    return keys;
                };
            }

            if(Object.getOwnPropertyNames(oDict).length !== 0){
                sTxt = Can.util.i18n._(sStr, oDict);
            }
            else{
                sTxt = Can.util.i18n._.apply(null, aArgs);
            }
        }

        return sTxt;
    };

    /**
     * 渲染自定义指令
     */
    var fRendes = function($rootEl, model){
        if(!($rootEl instanceof $)){
            $rootEl = $($rootEl);
        }
        var aList = [];
        //console.log($rootEl);
        for(var sSelect in _oRender){
            var oV = _oRender[sSelect];
            $rootEl.find(sSelect).each(function(){
                var $el = $(this);
                if(false === oV.isRepeat && $el.data('_is_render_' + sSelect)){
                    return true;
                }
                //console.log(sSelect);
                //oV.callback($el);
                //加入队列, 降低并发
                aList.push({ 
                    fun: oV.callback, 
                    $el: $el
                });
                $el.data('_is_render_' + sSelect, true);
            });
        }

        //console.log(aList);
        $.each(aList, function(k, v){
            v.fun(v.$el, model);
        });
    };
    
    /**
     * 注册自定义指令
     */
    var fRegRender = function(sSelect, fun, isRepeat){
        _oRender[sSelect] = {
            callback: fun,
            isRepeat: isRepeat ? true : false
        };
    };

    
    /**
     * 渲染多国语言
     */
    fRegRender('[i18n]', function($el){
        
        $el.html(fFormatI18n($el.html()));
        /*
         * if($el.css('visibility') === 'hidden' || $el.css('visibility') === ''){
         *     $el.css('visibility', 'visible');
         * }
         */
        $el.css('visibility', 'visible');

        if($el.is('[placeholder]')){  
            $el.attr('placeholder', fFormatI18n($el.attr('placeholder')));
        }
    });

    
    /**
     * 截取文字
     */
    fRegRender('[substr]', function($el){
        var maxLength = Number($el.attr('substr'));
        var text      = $el.text();
               
        /**
         * 裁剪字符串
         */
        var fCutStr = function(sStr, nLen) {
            if(!sStr){
                return '';
            }
            
            sStr = $.trim(sStr.toString());
            if(sStr.length <= nLen){
                return sStr;
            }
            var aStr = [];
            for(var i=0; i < nLen - 3; i++){
                aStr.push(sStr[i]);
            }
            return aStr.join('') + '...';
        };

        $el.html(fCutStr(text, maxLength));
        
    });

    
    /**
     * 渲染路由
     */
    fRegRender('a', function($el, model){
        if($el.attr('target') === '_blank'){
            return;
        }
        var sHref = $el.attr('href') || '';
        if(sHref.indexOf('#!/') !== 0){
            return;
        }

        $el.attr('route', 1);

        $el.bind('click.route', function(e){
            //console.log(model);
            var sHref = $el.attr('href') || '';
            var oArgs = Can.Route.analyze(sHref);
            Can.Route.run(oArgs.id, oArgs.args);

            //return false;
            //e.preventDefault();
            if(e && e.preventDefault) {  
                //阻止默认浏览器动作(W3C)
                e.preventDefault();
            } else {  
                //IE中阻止函数器默认动作的方式
                window.event.returnValue = false;
            } 

        });

    });

    
    /**
     * 渲染提示框
     */
    fRegRender('[can-tip]', function($el){
        if($el.attr('cantitle')){
            return;
        }
        
        var sType = $el.attr('can-tip-type') || 'right';
        var sTip  = escape(fFormatI18n($el.attr('can-tip')));

        $el.attr('cantitle', sType + ':' + sTip);

    });

    /**
     * 渲染时间控件
     */
    fRegRender('[calendar]', function($el){

        var nSpDateTime, calendar;

        if($.trim($el.attr('calendar')) !== '' && $.trim($el.attr('calendar')) !== 'YYYY-MM-DD'){
            nSpDateTime = $el.attr('calendar');

        }else{
            nSpDateTime = Can.util.formatDateTime((new Date()).getTime(), 'YYYY-MM-DD');
            $el.val(nSpDateTime);
        }

        if($el.data('calendar')){
            if($el.val() == $el.attr('calendar')){
                return;
            }
            calendar = $el.data('calendar');

            if($el.val() !== nSpDateTime){
                calendar.setValue(nSpDateTime);
            }
            
        }
        else{
            $el.hide();
            calendar = new Can.ui.calendar({
                cssName: 'bg-ico calendar',
                normalValue: nSpDateTime,
                elName: $el.attr('name'),
                min: $el.attr('start-date') || '1900-01-01'
            });
            $el.attr('name', '');
            if($.trim($el.attr('calendar')) !== ''){
                calendar.setValue(nSpDateTime);
            }

            calendar.on('ON_SET_VALUE', function(e){
                if(e !== $el.val()){
                    $el.val(e);
                    $el.attr('calendar', e);
                    $el.trigger('calendarChange', [e]);
                }
            });

            calendar.el.insertAfter($el);
            $el.data('calendar', calendar);
        }
        
    }, true);
    /**
     * 渲染分页条( more 样式 )
     */
    fRegRender('[more-paging]', function($el){
        var oPagingItem;

        var oPageInfo = {
            current: Number($el.attr('page-current') || 1),
            total: Number($el.attr('page-total') || 0),
            limit: Number($el.attr('page-limit') || 1)
        };

        //console.log(oPageInfo.total, oPageInfo.current * oPageInfo.limit);
        
        if(oPageInfo.total <= oPageInfo.limit || oPageInfo.total <= oPageInfo.current * oPageInfo.limit){
            //console.log(oPageInfo);
            if(oPageInfo.total !== -1){
                $el.hide();
            }
        }
        else{
            $el.show();
        }

        if(!$el.data('ui')){
            $el.data('ui', true);

            $el.unbind().bind('click', function(){
                var fun  = $el.data('pageChange');
                var page = Number($el.attr('page-current') || 1) + 1;
                if(fun){
                    //console.log(oPageInfo.current + 1)
                    fun(page);
                }
                else{
                    $el.trigger('pageChange', [page]);
                }
                return false;
            });
        }
 
    }, true);

    /**
     * 渲染分页条
     * 依赖 Can.ui.limitButton
     */
    fRegRender('[paging]', function($el){
        var oPagingItem;

        var oPageInfo = {
            current: Number($el.attr('page-current') || 0),
            total: Number($el.attr('page-total') || 0),
            limit: Number($el.attr('page-limit') || 1)
        };

        var isShowCount = $el.attr('show-count') === '1';
        
        if(oPageInfo.total <= oPageInfo.limit || 
           (oPageInfo.total <= oPageInfo.current * oPageInfo.limit && oPageInfo.current <= 1)){
            if(false === isShowCount){
                $el.hide();
            }
            else{
                $el.show();

            }
        }
        else{
            $el.show();
        }

        if($el.data('ui')){
            //console.log(oPageInfo)
            oPagingItem = $el.data('ui');
            oPagingItem.current = oPageInfo.current;
            oPagingItem.total = oPageInfo.total;
            oPagingItem.limit = oPageInfo.limit;
            oPagingItem.refresh();
        }
        else{
            oPagingItem = new Can.ui.limitButton({
                cssName:'ui-page fr',
                showTotal:true,
                current: oPageInfo.current,
                total: oPageInfo.total,
                limit: oPageInfo.limit
            });

            oPagingItem.onChange(function(){
                var fun = $el.data('pageChange');
                if(fun){
                    fun(this.current);
                }
                else{
                    $el.trigger('pageChange', [this.current]);
                }
            });

            oPagingItem.el.appendTo($el);
            $el.data('ui', oPagingItem);
        }
    }, true);

    
    /**
     * 倒计时
     * 依赖 Can.util.countDown
     */
    fRegRender('[countDown]', function($el){

        var sTime = $el.attr('countDown') || $.trim($el.text());
        var sStr  = Can.util.countDown(sTime);
        if('' === sStr){
            return;
        }

        sStr = sStr == '0D 0H' ? Can.util.i18n._('MODULE.BUYER_LEAD_MANAGE.TAB_TIT_EXPIRED') : sStr;
        $el.html(sStr);
    }, true);


    /**
     * 产品图片展示
     */
    fRegRender('[pic-view]', function($el){
        $el.find('div.pics').remove();
        // #3402 因为产品需要按照后端传递的顺序
        //var oPics = JSON.parse($el.attr('pic-view') || '{}');
        var oPics = $el.attr('pic-view').split(',') || [];
        
        var nPage  = 1;
        var $pic   = $('<div class="pics"></div>');
        var $slide = $('<div class="slide-pic"></div>').appendTo($pic);
        var $small = $('<div class="small-pic"></div>').appendTo($pic);
        var $pre   = $('<a href="#" class="btn-l-s1 dis" title="Prev">Prev</a>').appendTo($small);
        var $next  = $('<a href="#" class="btn-r-s1 dis" title="Next">Next</a>').appendTo($small);
        
        var $box = $('<div class="box"><ul class="w470"></ul></div>').appendTo($small);
        var nCount = 0;
        for(var i in oPics){
            var sSrc = oPics[i];
            //#4664  IE8兼容性BUG
            if(typeof sSrc!=="string"){
                break;
            }
            var $li  = $('<li><img src="' + Can.util.formatImgSrc(sSrc, 60, 60) + '" alt=""/></li>');
            $li.appendTo($box.find('ul'));
            nCount ++;

            (function($li, sSrc){
                $li.click(function(){
                    var $img = $slide.find('img');
                    $box.find('li.cur').removeClass('cur');
                    $li.addClass('cur');
                    if($img.length === 0){
                        $img = $('<img width="320" height="320"/>').appendTo($slide);
                        $img.attr('src', Can.util.formatImgSrc(sSrc, 320, 320));
                    }
                    else{
                        $img.stop().fadeOut(function(){
                            $img.attr('src', Can.util.formatImgSrc(sSrc, 320, 320)).fadeIn();
                        });
                    }
                });
            })($li, sSrc);
        }
        var nPageCount = Math.ceil(nCount / 4);

        //处理左右分页
        $next.click(function () {
            if($next.is('.dis')){
                return false;
            }
            nPage++;
            if(nPage > nPageCount){
                nPage = nPageCount;
                $next.addClass('dis');
                return false;
            }

            if(nPage === nPageCount){
                $next.addClass('dis');
            }
            var nIx = (nPage - 1) * 4;
            var $li = $box.find('li').eq(nIx);

            $li.click();

            $box.find('ul').css({
                marginLeft: -8
            }).animate({
                marginLeft: - $li.position().left + 4
            });
            if(nPage > 1){
                $pre.removeClass('dis');
            }
            return false;  
        });
        $pre.click(function () {
            if($pre.is('.dis')){
                return false;
            }
            nPage--;
            if(nPage < 1){
                nPage = 1;
                $pre.addClass('dis');
                return false;
            }
            if(nPage === 1){
                $pre.addClass('dis');
            }
            var nIx = (nPage - 1) * 4;
            var $li = $box.find('li').eq(nIx);

            $li.click();

            $box.find('ul').css({
                marginLeft: -8
            }).animate({
                marginLeft: - $li.position().left + 4
            });

            if(nPage + 1 <=nPageCount){
                $next.removeClass('dis');
            }
            return false;  
        });
        if(nCount > 4){
            $next.removeClass('dis');
        }

        $box.find('li').eq(0).click();

        if(nCount === 1){
            $small.hide();
        }

        $pic.appendTo($el);
    }, true);

    /**
     * 渲染复选框
     */
    fRegRender('[checkbox]', function($el){
        var $ui = $('<div></div>');

        $el.hide();

        $ui.click(function(){
            $el.attr('checked', $el.attr('checked') ? false : true);
            $el.change();
            
            return false;
        });
        
        var fSync = function(){
            $ui.attr('class', 'icon-bg');
            if($el.attr('checked')){
                $ui.addClass('icon-checkbox-3');
            }
            else{
                $ui.addClass('icon-checkbox-2');
            }
        };
        fSync();
        $el.unbind().bind('change.checkbox', function(){
            fSync();
        });

        $el.data('ui', $ui);
        $el.data('syncUi', fSync);
        $el.data('showHover', function(){
            if($ui.is('.icon-checkbox-2')){
                $ui.removeClass('icon-checkbox-2')
                   .addClass('icon-checkbox-1');
            }
        });

        $el.data('hideHover', function(){
            if($ui.is('.icon-checkbox-1')){
                $ui.removeClass('icon-checkbox-1')
                   .addClass('icon-checkbox-2');
            }
        });
        
        $ui.hover(function(){
            $el.data('showHover')();
        }, function(){
            $el.data('hideHover')();
        });


        $ui.insertAfter($el);
    });

    /**
     * 渲染下拉框
     * 依赖 Can.ui.DropDownField
     */
    var fBindSelect = function(oUi, $el){
        var aVal   = [];
        var aLabel = [];
        //var isSync = false;
        $el.find('option').each(function(){
            var self = $(this);
            aVal.push(self.val());
            aLabel.push(self.text());
        });
        oUi.valueItems = aVal;
        oUi.labelItems = aLabel;
        oUi.updateOptions();
        oUi.setDisplayValue($el.find('option:selected').text());
        oUi.setValue($el.val());

        //$el.bind('selected', function(val){});

        oUi.on('onselected', function(val){
            //isSync = true;
            //console.log(val);
            $el.val(val);
            $el.trigger('selected', [val]);

            //console.log($el.val());
            return false;
        });

        $el.unbind().bind('change.dropDown', function(){
            /*if(isSync){*/
                //isSync = false;
                //console.log($el.val());
                //return;
            /*}*/
            //console.log('sync drop');
            fBindSelect(oUi, $el);
        });

        $el.data('syncUi', function(){
            fBindSelect(oUi, $el);    
        });

        //$el.data('ui', oUi);

    };
    fRegRender('[dropDown]', function($el){
        var oUi = $el.data('ui');
        if(!oUi){
            var nWidth = $el.width();
            if( nWidth > 100 ){
                nWidth = nWidth - 26;
            }
            oUi = new Can.ui.DropDownField({
                id: $el.attr('id') + '_ui',
                name: $el.attr('name'),
                blankText: $el.find('option:selected').text(),
                width: nWidth
            });
            $el.attr('name', '').hide();
            fBindSelect(oUi, $el);
            oUi.el.insertAfter($el);
            $el.data('ui', oUi);
        }
        else
        {
            fBindSelect(oUi, $el);
        }

    }, true);
    
    /**
     * 高亮关键字
     */
    var _oRegCache = {};
    fRegRender('[highlight]', function($el){
        var text = $.trim($el.attr('highlight') || '');
        var reg;
        if('' === text){
            return;
        }
        if(!_oRegCache[text]){
            _oRegCache[text] = new RegExp(text, 'ig');
        }
        reg = _oRegCache[text];
        var html = $el.html().replace(reg, '<span class="highlight">' + text + '</span>');
        $el.html(html);
    });

    
    /**
     * 渲染图像
     * 依赖 Can.util.formatImage
     */
    fRegRender('img[can-src]', function($el){
        if($el.data('src') == $el.attr('can-src')){
            return;
        }

        $el.data('src', $el.attr('can-src'));

        if($el.data('ui')){
            $el.data('ui').remove();
        }
        var avatar = $el.attr('avatar');
        var sSrc   = $el.attr('can-src');
        var sSize  = ($el.attr('width') || '120') + 'x' + ($el.attr('height') || '120');
        var $img   = $(Can.util.formatImage(sSrc, sSize, avatar));

        $el.hide();

        $img.on('error', function(){
            $img.remove();
            $empty = $(Can.util.formatImage(false, sSize, avatar));
            $empty.addClass('no-img');
            $empty.insertAfter($el);

            $el.data('ui', $empty);
        });
        $img.insertAfter($el);
        $el.data('ui', $img);

    }, true);

    /**
     * 渲染表单验证
     * @link https://github.com/sofish/validator.js
     */
    fRegRender('form[validator]', function($el){
        var fShowError = function(item){
            var $parent = item.$el.parent();
            var $root   = $parent.parent();
            var sErrMsg = item.$el.attr('error') || '';
            var $err    = $('<div class="fm-error"></div>');
            item.$el.addClass('a-error');

            sErrMsg = fFormatI18n(sErrMsg);

            //移除旧的错误提示
            $root.find('.fm-error').remove();

            if('' === sErrMsg){
        
                switch(item.error){
                    case 'empty':
                        if(item.$el.attr('minlength')){
                            sErrMsg = Can.util.i18n._('VALIDATOR.MIN_TIP', item.$el.attr('minlength'));
                        }
                        if(item.$el.attr('maxlength')){
                            sErrMsg = sErrMsg + ' ' + Can.util.i18n._('VALIDATOR.MAX_TIP', item.$el.attr('maxlength'));
                        }
                        if('' === sErrMsg){
                            sErrMsg = '* ' + Can.util.i18n._('TEXT_BUTTON_VIEW.REQUEST');
                        }
                        break;
                }
                
                switch(item.type){
                    case 'number':
                        sErrMsg = '';
                        if(item.$el.is('[min]') && item.$el.is('[max]')){
                            sErrMsg = '* ' + item.$el.attr('min') + ' -  ' + item.$el.attr('max') + '';

                        }
                        else{
                            sErrMsg = '* ' + Can.util.i18n._('TEXT_BUTTON_VIEW.NUMBER');
                        }
                        break;
                }
            }
            if('' === sErrMsg){
                sErrMsg =  Can.util.i18n._('TEXT_BUTTON_VIEW.REQUEST');
            }

            $parent.after($err.html(sErrMsg));
        };

        $el.validator({
            identifie: '[required],[validator]',
            before: function(){
                //移除旧的错误提示
                $el.find('.a-error').removeClass('a-error');
                $el.find('.fm-error').remove();
            },
            after: function(){
                //表单验证成功的处理
                var events = $el.data('events') || $._data($el[0], 'events');
                if(events['validated']){
                    $el.trigger('validated');
                    return false;
                }
                return true;
            },
            liveCallback: function(item, ret){
                if(false === ret){
                    fShowError(item);
                }
                else{
                    var $parent = item.$el.parent();
                    var $root   = $parent.parent();

                    //移除旧的错误提示
                    $root.find('.a-error').removeClass('a-error');
                    $root.find('.fm-error').remove();
                }
            },
            errorCallback: function(unvalidFields){
                $(unvalidFields).each(function(i,item){
                    fShowError(item);
                });
            }
        });
    }, true);

    /**
     * 渲染匹配度
     * 依赖 fCountMatchLevel
     */
    fRegRender('[match]', function($el){
        var nMatch = Number($el.attr('match'));
        $el.attr('class', 'mod-mch ' + fCountMatchLevel(nMatch)).
            attr('cantitle', Can.util.i18n._('CAN_TITLE.MATCH', nMatch));
    }, true);

    /**
     * 渲染 kindEditor
     * 依赖 js/utils/kindEditorView.js
     */
    fRegRender('[kindEditor]', function($el){
        Can.importJS(['js/utils/kindEditorView.js']);
        var textareaName = $el.attr('kindEditor');
        var maxLength    = Number( $el.attr('max-length') || '0');
        var className    = $el.attr('class-name') || 'checktextarea';

        var editor = new Can.view.kindEditorView({
            textareaName: textareaName, 
            className: className, 
            width: Number($el.attr('width') || '500'), 
            height: Number($el.attr('height') || '200'),
            maxLength: maxLength
        });
        editor.start();
        editor.el.appendTo($el);
        editor.showEditer();

        $el.data('editor', editor);
    });

    /**
     * 渲染广交会参加次数
     */
    fRegRender('[join-count]', function($el){
        var nCount = Number($el.attr('join-count'));
        $el.addClass('mth-icon').
            addClass('mth').
            html(nCount).
            attr('cantitle',  Can.util.i18n._('CAN_TITLE.EXP_NUM', nCount));
    });

    /**
     * 渲染查看供应商名片
     * 依赖 Can.util.canInterface
     */
    fRegRender('[show-supplier]', function ($el) {
        Can.importJS([
            'js/utils/windowView.js',
            'js/framework/widget/autoTags.js'
        ]);

        var nId = Number($el.attr('show-supplier'));
        //console.log(nId);
        $el.unbind('click.personProfile').
            bind('click.personProfile', function () {
                Can.util.canInterface('personProfile', [1, nId]);
                return false;
            });
    });

    /**
     * 渲染上传助手
     * 依赖 Can.ui.UploadHelper
     * 注意， 事件绑定的选择器，不能用 #id 的方式， 必须是 '.class[uploader]', 不然flash会有问题
     * @Demo:
     *
     * ```html
     * <input type="file" uploader="上传" btn-class="btn btn-s12">
     * ```
     * ### 事件绑定
     * var $Btn = $('[uploader]');
     *
     * ### 准备上传
     * $Btn.bind('uploadReady', function(){oEl});
     *  
     * ### 上传进度
     * $Btn.bind('uploadProgress', function(oEl, nProgress, oFile, oUploader);
     *
     * ### 上传失败
     * $Btn.bind('uploadError', function(oEl, sMsg, oFile, oUploader);
     *
     * ### 上传成功 
     * $Btn.bind('uploadSuccess', function(oEl, oData, oFile, oUploader);
     */
    fRegRender('[uploader]', function ($el) {
        var uploader = $el.data('uploader');

        if(!uploader){
            var buttonText = $el.attr('uploader') || 'upload';
            var fileSize   = $el.attr('fileSize') || 2048;
            uploader = Can.ui.UploadHelper({
                uploader: Can.util.Config.uploader.server,
                fileInput: $el,
                fileObjName: $el.attr('file-name') || 'Filedata',
                fileTypeExts: $el.attr('file-type') || '*.png;*.gif;*.jpg',
                formData:{ fieldName: ($el.attr('file-name') || 'Filedata') },
                buttonText: fFormatI18n(buttonText),
                buttonClass: $el.attr('btn-class') || 'btn btn-s12',
                fileSizeLimit: Number(fileSize),
                width: Number( $el.attr('width') || '70'),
                height: Number($el.attr('height') || '35'),
                events:{
                    ON_UPLOADER_READY:function(){
                        $el.trigger('uploadReady');
                    },
                    ON_UPLOAD_ERROR: function(sMsg, oFile, oUploader){
                        //console.log(sMsg);
                        if($el.data('events')['uploadError']){
                            $el.trigger('uploadError', [sMsg, oFile, oUploader]);
                        }
                        else{
                            var sErrMsg = 'Upload error!';

                            if(Can.msg.ERROR_TEXT[sMsg]){
                                sErrMsg = Can.msg.ERROR_TEXT[sMsg];
                            }

                            var fMaxAlert = new Can.view.alertWindowView({
                                closeAction: 'hide',
                                hasBorder: false,
                                type: 2
                            });
                            fMaxAlert.setContent([
                                '<div class="alert-status">',
                                '<span class="icon"></span>',
                                sErrMsg,
                                '</div>'
                            ].join(''));

                            fMaxAlert.main.el.addClass('alert-win-t1');
                            fMaxAlert.show();
                        }
                        
                    },
                    ON_UPLOAD_PROGRESS: function (nProgress, oFile, oUploader) {
                        //console.log(nProgress);

                        $el.trigger('uploadProgress', [nProgress, oFile, oUploader]);
                    },
                    ON_UPLOAD_SUCCESS: function(oData, oFile, oUploader){
                        //console.log($el.data());
                        $el.trigger('uploadSuccess', [oData, oFile, oUploader]);
                    }

                }
            });
            //console.log(uploader);

            $el.data('uploader', uploader);
        }
    });

    /**
     * 渲染查看采购商名片
     * 依赖 Can.util.canInterface
     */
    fRegRender('[show-buyer]', function ($el) {
        var nId = Number($el.attr('show-buyer'));
        $el.unbind('click.personProfile').
            bind('click.personProfile', function () {
                Can.util.canInterface('personProfile', [2, nId]);
                return false;
            });
    });

    /**
     * 格式化日期, 只支持 **时间戳**
     * 依赖 Can.util.formatDateTime     
     */
    fRegRender('[format-date]', function ($el) {
        var nDate = $el.attr('date') || $el.text();
        if($.isNumeric(nDate)){
            nDate = Number($el.text());
        }
        else{
            nDate = Can.util.formatDateTime(nDate).getTime();
            if(isNaN(nDate)){
                return;
            }
        }
        var bEnMonth = ($el.attr('en-month') || false) === '1';
        var bShort   = ($el.attr('short') || false) === '1';
        var sFormat  = $el.attr('format-date');

        if(nDate < 9999999999){
            nDate = nDate * 1000;
        }

        $el.html(Can.util.formatDateTime(nDate, sFormat, bEnMonth, bShort));
    }, true);

    /**
     * 渲染一个内容列表，超过指定数量，能左右滑动
     * @demo:
     * <div max-length="3" box-width="200" height="70" con-boxs>
     *      <div class="box">cont</div>
     *      <div class="box">cont</div>
     *      <div class="box">cont</div>
     *      <div class="box">cont</div>
     * </div>
     */
    fRegRender('[con-boxs]', function ($el) {
        var nMaxLength = Number($el.attr('max-length') || 3);
        var nBoxWidth  = Number($el.attr('box-width') || 200);
        var nHeight    = Number($el.attr('height') || 70);
        var nWidth     = Number($el.attr('width') || $el.width());
        
        //内容容器
        var $con = $('<div></div>');

        //计算单个box的最大宽度
        var nOutWidt = 32 * 2;
        var nConW = nWidth - nOutWidt;
        var nMaxBoxW = nConW / nMaxLength;
        var nBoxLen = $el.find('.box').length;
        //一个很长的容许，能将box都放在同一行
        var $wrap = $('<div></div>'); 
        $wrap.width(nMaxBoxW * nBoxLen);

        $el.height(nHeight);

        $con.width(nConW);
        $wrap.appendTo($con);

        //定位内容容器
        $con.css({
            top: 0,
            left:32,
            position: 'absolute',
            overflow: 'hidden',
            height:nHeight
        });

        $wrap.css({
            position: 'absolute',
            left:0,
            top:0
        });
        
        //将box放入$wrap
        $el.find('.box').each(function () {
            var self = $(this);
            self.width(nMaxBoxW);
            self.appendTo($wrap);   
        });

        if(nBoxLen > nMaxLength){
            var $left = $('<i class="icons left"></i>');
            var $right = $('<i class="icons right"></i>');
            var nTop = $el.height() / 2 - 32 / 2;

            $left.css({
                top: nTop,
                left: 0
            }).hide();

            $right.css({
                top: nTop,
                left: nConW + 32
            });

            var nPage = 1;

            //向左
            $left.click(function () {
                nPage = nPage - 1;
                if(nPage <= 0){
                    nPage = 1;
                    $left.hide();
                    return false;
                }

                var nIndex = nMaxLength * (nPage - 1);
                var self = $el.find('.box').eq(nIndex);

                var oPosition = self.position();
                $wrap.animate({left: -oPosition.left});

                if(nPage === 1){
                    $left.hide();
                }
                $right.show();

                return false;
            });

            //向右
            $right.click(function () {
                nPage = nPage + 1;
                var nIndex = nMaxLength * (nPage - 1);

                var self = $el.find('.box').eq(nIndex);

                if(self.length > 0){
                    var oPosition = self.position();
                    $wrap.animate({left: -oPosition.left});

                    if(nMaxLength * nPage >= nBoxLen){
                        $right.hide();
                    }
                }
                else{
                    nPage = nPage - 1;
                    $right.hide();
                }
                $left.show();
                
                return false;
            });
            
            $left.appendTo($el);
            $right.appendTo($el);
        }

        $con.appendTo($el);
        
    });
    
    /** 
     * switch
     */
    var WidgetSwitch = function(aConfig){
        aConfig = $.extend(true, {
            width: 100,
            left: {
                txt: 'left',
                val: '1'
            },
            right: {
                txt: 'right',
                val: '0'
            },
            val: '1',
            onChange: function(){}
        }, aConfig);

        var $el = $([
            '<div class="widget-switch">',
                '<span class="txt l" cantitle="'+aConfig.left.txt+'">'+ aConfig.left.txt +'</span>',
                '<i class="icon"></i>',
                '<span class="txt r" cantitle="'+aConfig.right.txt+'">'+ aConfig.right.txt +'</span>',
            '</div>'
        ].join(''));

        $el.width(aConfig.width);
        var $lEl = $el.find('.l').width(aConfig.width - 16);
        var $rEl = $el.find('.r').width(aConfig.width - 16);
        var self = this;

        this.el = $el;

        this.setValue = function(val){
            if(val.toString() === aConfig.left.val.toString()){
                $lEl.css({marginLeft: 0});
            }
            else if(val.toString() === aConfig.right.val.toString()){
                $lEl.css({marginLeft: - aConfig.width - 16});
            }
        };

        $el.click(function(){
            if(aConfig.val === aConfig.left.val){
                aConfig.val = aConfig.right.val;
            }
            else{
                aConfig.val = aConfig.left.val;
            }

            self.setValue(aConfig.val);
            aConfig.onChange(aConfig.val);

            return false;
        });
        
        this.setValue(aConfig.val);

    };

    /**
     * 渲染一个 switch
     */
    fRegRender('select[switch]', function($el){
        var oUi = $el.data('ui');
        if(!oUi){
            oUi = new WidgetSwitch({
                width: $el.attr('width') || 100,
                left: {
                    txt: $el.find('option').eq(0).text(),
                    val: $el.find('option').eq(0).val()
                },
                right: {
                    txt: $el.find('option').eq(1).text(),
                    val: $el.find('option').eq(1).val()
                },
                onChange: function(val){
                    $el.val(val).change();
                },
                val: $el.val()
            });

            oUi.el.insertAfter($el);
            
            $el.hide();
            $el.data('ui', oUi);
        }
        else{
            oUi.setValue($el.val());
        }
    }, true);

    /**
     * 渲染一个简单的图片左右滑动组件组件
     * @desc
     *
     * ```html
     * <ul image-play-lr with="120" height="120">
	 *     <li>http://58.248.138.13:81/group1/M00/3E/FC/wKgKEVMK18GAPFE2AAEgVlT4ahw821.png</li>
     *     <li>http://58.248.138.13:81/group1/M00/3E/FC/wKgKEVMK18GAdBPJAANfy9Qc4fM400.jpg</li>
     * </ul>
     * ```
     */
    fRegRender('[image-play-lr]', function ($el) {
        if($el.data('ui')){
            $el.data('ui').remove();
        }
        var nIx = 0;
        var oSize = {
            width: Number($el.attr('width') || '120'),
            height: Number($el.attr('height') || '120')
        };
        var aList = [];
        $el.find('li').each(function(){
            var sSrc = $.trim($(this).text());
            aList.push(Can.util.formatImgSrc(sSrc, oSize.width, oSize.height));
        });

        if(aList.length === 0){
            $el.hide();
            return;
        }

        var $main = $('<div></div>');
        var $wrap = $('<div></div>').appendTo($main);

        $main.css({
            position: 'relative',
            width: oSize.width,
            height: oSize.height
        });
        
        $wrap.css({
            overflow: 'hidden',
            position: 'relative',
            width: oSize.width,
            height: oSize.height
        });
        
        var $imgList = $('<div></div>').appendTo($wrap);
        $imgList.css({
            position: 'absolute',
            width: (oSize.width * aList.length),
            height: oSize.height
        });
        
        var aImg = [];
        $.each(aList,function(k,v){
            var $img = $('<img src="' + v + '" width="' + oSize.width + '" height="' + oSize.height + '">');
            $img.css({
                'float': 'left'
            });
            $img.appendTo($imgList);
            aImg.push($img);
        });

        if(aList.length > 1){
            $lIcon = $('<span class="icons arrow-m-l"></span>').appendTo($main);
            $rIcon = $('<span class="icons arrow-m-r"></span>').appendTo($main);

            $lIcon.add($rIcon).css({
                position: 'absolute',
                top: (oSize.height - 13) / 2,
                cursor: 'pointer'
            });
            $lIcon.css({
                left: -16
            });
            $rIcon.css({
                right: -16
            });

            $main.on('click', '.arrow-m-l', function(){
                if(nIx < 1){
                    nIx = 0;
                    $rIcon.click();
                    return false;
                }
                nIx --;
                var oPosition = aImg[nIx].position();
                $imgList.stop().animate({
                    left: -oPosition.left
                }, 100);

            }).on('click', '.arrow-m-r', function(){
                if(nIx >= aList.length -1){
                    nIx = aList.length - 1;
                    $lIcon.click();
                    return false;
                }
                nIx ++;
                var oPosition = aImg[nIx].position();
                $imgList.stop().animate({
                    left: -oPosition.left
                }, 100);
            });
        }

        $main.insertAfter($el);
        $el.data('ui', $main);
        $el.hide();
        //console.log(aList);
    }, true);

    /**
     * 渲染一个图片列表，超过指定数量，能左右滑动
     * 依赖 Can.util.formatImgSrc
     * @demo:
     * <div class="img-boxs" max-length="6" img-boxs>
     *    <a href="#" width="120" height="120" title="test">http://58.248.138.13:81/group1/M00/3B/08/wKgKEVKCAemAEfqrAAHjmN5DrOA664.jpg</a>
     *    <a href="#" width="120" height="120" title="test">http://58.248.138.13:81/group1/M00/3B/08/wKgKEVKCAemAEfqrAAHjmN5DrOA664.jpg</a>
     * </div>
     */
    fRegRender('[img-boxs]', function ($el) {
        var nMaxLength = Number($el.attr('max-length') || 3);
        var aData = [];
        var aItems = [];
        var self, oVal, $a, $con;
        var nPage = 1;

        if($el.find('a').length === 0){
            return;
        }

        $con = $('<div class="cont"></div>');
        $box = $('<div class="box"></div>');
        $el.find('a').each(function () {
            self = $(this);
            oVal = {
                width: Number(self.attr('width') || 60),
                height: Number(self.attr('height') || 60),
                title: self.attr('title') || '',
                url: self.attr('href'),
                img: $.trim(self.text()),
                time: Number(self.attr('time'))
            };   
            self.remove();

            aData.push(oVal);

            $a = $('<a href="#" route cantitle="<div class=\'actvities-tip\'>'+oVal.title+'<p>'+ Can.util.formatDateTime(oVal.time, 'hh\\:mm M DD, YYYY', true, true) + '</p></div>' +'" class="img-box"><img width="'+ oVal.width +'" src="' + Can.util.formatImgSrc (oVal.img, oVal.width, oVal.height) + '" height="' + oVal.height +'"></a>');

            $a.appendTo($con);

            (function($a, sUrl, title){
                $a.click(function (e) {
                    /*var xData = Can.Route.analyze(sUrl);*/
                    
                    //if(xData && xData.args){
                        //Can.util.canInterface('productDetail', [xData.args.id, title, xData.args.m]);
                    /*}*/
                    if(sUrl.indexOf('#!/') === 0){
                        $a.attr('route', 1);
                        Can.Route.run(sUrl.replace('#!/', '/'));

                        if(e && e.preventDefault) {  
                            //阻止默认浏览器动作(W3C)
                            e.preventDefault();
                        } else {  
                            //IE中阻止函数器默认动作的方式
                            window.event.returnValue = false;
                        } 
                    }
                }); 
            })($a, oVal.url, oVal.title);

            
            aItems.push($a);
        });
        //$con.height(oVal.height);
        $con.width((oVal.width + 20) * aData.length);
        $con.appendTo($box);
        $box.height(oVal.height + 22);
        $box.width((oVal.width + 16) * nMaxLength );
        $el.width($box.width());
        $box.appendTo($el);
        if(aData.length > nMaxLength){
            var $left = $('<i class="icons left"></i>');
            var $right = $('<i class="icons right"></i>');
            var nTop = $box.height() / 2 - 32 / 2;

            $left.css({
                top: nTop,
                left: - 38
            }).hide();

            $right.css({
                top: nTop,
                right: - 38
            });


            //向左
            $left.click(function () {
                nPage = nPage - 1;
                if(nPage <= 0){
                    nPage = 1;
                    $left.hide();
                    return false;
                }

                var nIndex = nMaxLength * (nPage - 1);
                var self = $con.find('a').eq(nIndex);

                var oPosition = self.position();
                $con.animate({left: -oPosition.left});

                if(nPage === 1){
                    $left.hide();
                }
                $right.show();

                return false;
            });

            //向右
            $right.click(function () {
                nPage = nPage + 1;
                var nIndex = nMaxLength * (nPage - 1);
                //console.log(nIndex)

                var self = $con.find('a').eq(nIndex);

                //console.log($con);

                if(self.length > 0){
                    var oPosition = self.position();
                    $con.animate({left: -oPosition.left});

                    if(nMaxLength * nPage >= aData.length){
                        $right.hide();
                    }
                }
                else{
                    nPage = nPage - 1;
                    $right.hide();
                }
                $left.show();
                
                return false;
            });

            $left.appendTo($el);
            $right.appendTo($el);
        }
    });

    /**
     * 让ie8, ie9 支持 placeholder
     */
    fRegRender('[placeholder]', function($el){
        if($.browser.msie && $.browser.version < 10){
            var $placeholder = $el.data('placeholder');

            var fCheckShow = function(){
                if('' === $.trim($el.val()) && false === $el.is(':hidden')){
                    var oPosition    = $el.position();
                    $placeholder.css({
                        left        : oPosition.left,
                        top         : oPosition.top,
                        height      : $el.height(),
                        width       : $el.width(),
                        lineHeight  : $el.css('lineHeight') || $el.height(),
                        zIndex      : $el.css('zIndex') == 'auto' ? 10 : Number($el.css('zIndex')) + 1,
                        paddingLeft : $el.css('paddingLeft') || 12

                    }).show();
                }
                else{
                    $placeholder.hide();
                }
            };

            if(!$placeholder){
                var $parent   = $el.parent();
                var sPostion  = $parent.css('position');
                
                $placeholder = $('<div></div>');

                $el.data('placeholder', $placeholder);
                
                if(sPostion !== 'relative' && sPostion !== 'absolute'){
                    $parent.css('position', 'relative');
                }

                $placeholder.html($el.attr('placeholder'));

                $placeholder.css({
                    color       : '#999',
                    position    : 'absolute',
                    overflow    : 'hidden'
                });

                $placeholder.click(function(){
                    $placeholder.hide();
                    $el.focus();
                });

                
                $el.on('blur.placeholder', function(){
                    //console.log($placeholder);
                    fCheckShow();
                }).on('focus.placeholder', function(){
                    $placeholder.hide();
                }).on('change.placeholder', function(){
                    fCheckShow();
                });

                fCheckShow();

                $placeholder.appendTo($parent);
            }
            else{
                fCheckShow();
            }

        }
    }, true);


       
    /**
     * 模板引擎
     * @param {String} tpl 模板内容
     * @param {Object} options 渲染参数
     * @return {Ant} 返回一个ant实例
     * @link http://antjs.org
     */
    Can.util.TWtemplate = function(tpl, options, model){
        if(undefined === model && Can.Application){
            var xModel = Can.Application.getCurrentModule();
            if(xModel){
                model = xModel;
            }
        }

        options        = options || {};
        options.data   = options.data || {};
        options.events = options.events || {};
        var fReader    = options.events.render || function(){};
        var fUpdate    = options.events.update || function(){};

        options.events.render = function(){
            this.el.addClass('ant-render');
            fRendes(this.el, model);
            fReader.apply(this);
        };
        
        //更新事件加入队列，防止过多的重复更新
        var xTime = false;
        options.events.update = function(){
            var oAnt = this;
            if(xTime){
                clearTimeout(xTime);
            }
            xTime = setTimeout(function(){
                fRendes(oAnt.el, model);
                fUpdate.apply(oAnt);
            }, 50);
        };

        var ant = new Ant(tpl, options);
        //绑定当前model
        ant._model = model;
        return ant;
    };
    
    /**
     * 注册自定义指令
     * @param {String}   sSelect   jQuery 的选择规则
     * @param {Function} callback  渲染方法
     * @param {Boolen}   isRepeat  是否容许重复渲染，默认为 false
     * @example
     * //给 a 加上 title 属性
     * Can.util.TWtemplate.regRender('a', function($el){
     *   $el.attr('title', $el.text());
     * });
     */
    Can.util.TWtemplate.regRender = fRegRender;

    /**
     * 加载模板
     * @param {String}    sUrl    相对框架的地址
     * @param {Function}  fun     模板加载成功后回调
     * @param {Boolen}    noCache 是否不缓存已加载的模板，默认为 false 
     */
    Can.util.TWtemplate.load = function(sUrl, fun, noCache){
        if(_oTplCache[sUrl] && !noCache){
            fun(_oTplCache[sUrl]);
            return;
        }

        var sTplUrl = Can.util.Config.app.CanURL + sUrl;
    
		$.ajax({
			url: sTplUrl,
			dataType: 'text',
            cache: false,
			success: function(html){
                _STpl = '<div>' + html + '</div>';
                _oTplCache[sUrl] = _STpl;
                fun(_STpl);
            }
        });

    };
})(Can);
