/**
 * 上传组件
 * @authors vfasky (vfasky@gmail.com)
 * @date    2013-08-14 16:06:59
 * @version $Id$
 */
(function(Can, $){
    /**
     * 用于生成上传文件的id
     * @type {Number}
     */
    var _nId = 0;

    var console = window['console'] || {
        log: function(){}
    };

    /**
     * 上传基类
     * @author vfasky
     * @date   2013-08-09
     * @param  {Object} oArgs 参数
     * @return {Void} 
     */
    var UploadBase = function(oArgs){

        /**
         * 参数
         * @type {Object}
         */
        this.oArgs = oArgs || {};

        /**
         * 上传框
         * @type {JQselector}
         */
        this.$FileInput = this.oArgs.fileInput;

        /**
         * 上传地址
         * @type {String}
         */
        this.sUploadURL = this.oArgs.uploader || '';

        this.isDisable = false;

        /**
         * 事件默认值
         * @type {Object}
         */
        this.oEvents = $.extend({
            // 选择文件失败
            'ON_SELECT_ERROR'    : function(){},
            // 文件上传失败
            'ON_UPLOAD_ERROR'    : function(){},
            // 文件上传成功
            'ON_UPLOAD_SUCCESS'  : function(){},
            // 文件的上传进度
            'ON_UPLOAD_PROGRESS' : function(){},
            // 准备上传一个文件
            'ON_UPLOAD_BEFORE'   : function(){},
            // 上传组件就绪
            'ON_UPLOADER_READY'  : function(){}
        }, this.oArgs.events || {});

        this.sElId = this.$FileInput.attr('id');

        this.$El = $(
            '<div class="uploadify"></div>'
        ).insertBefore(this.$FileInput);

        this.$Queue = $(
            '<div id="' + this.sElId + '-queue" class="uploadify-queue"></div>'
        ).insertAfter(this.$El);


        this.$El.attr({
            'id'   : this.sElId
        }).css({
            width  : this.oArgs.width ,
            height : this.oArgs.height
        });
        this.$FileInput.attr('id', '').prependTo(this.$El);

        /**
         * 是否禁用上传
         * @author vfasky
         * @date   2013-08-14
         * @param  {Boolean} bType [description]
         * @return {[type]} [description]
         */
        this.disable = function(bType, xUndef){
            bType = bType == xUndef ? true : bType;

            var $Block = this.$El.find('.block');

            //启用
            if(false === bType){
                this.isDisable = false;
                $Block.hide();
            }
            else{ //禁用
                this.isDisable = true;
                if($Block.length === 0){
                    $Block = $('<div class="block"></div>');
                    $Block.css({
                        width: this.oArgs.width + 2,
                        height: this.oArgs.height + 5,
                        zIndex: 10,
                        opacity: 0.4,
                        background: '#fff',
                        top: 0,
                        left: 0,
                        position: 'absolute'
                    }).appendTo(this.$El);
                }
                $Block.show();
            }
        };

        /**
         * 生成不生重复的文件id
         * @author vfasky
         * @date   2013-08-12
         * @return {String} 文件id
         */
        this.getFileId = function(){
            _nId ++;
            return 'UF_' + _nId;
        };
    };

    /**
     * Iframe 方式上传
     * @author vfasky
     * @date   2013-08-09
     * @param  {Object} oArgs 
     *   必填参数：uploadURL, fileInput , events
     * @return {Void}
     */
    var IframeUpload = function(oArgs){
        UploadBase.call(this, oArgs);

        var self = this;

        var $El = this.$El;



        // create iframe
        var $Iframe = $('<iframe src="javascript:false" name="hide-upload" scrolling="no" frameborder="0" style="display: inline-block;"></iframe>');
        $Iframe.css({
            width  : self.oArgs.width ,
            height : self.oArgs.height
        }).appendTo($El);

        //console.log(this)

        // 构造上传表单
        var fBuildForm = function(){
            var oIO  = $Iframe[0];

            var oFile = {
                name : 'UNKNOWN',
                id   : self.getFileId()
            };

            var xTime = setInterval(function(){
                var oDoc = oIO.contentWindow ? oIO.contentWindow.document : oIO.contentDocument ? oIO.contentDocument : oIO.document;
                if(oDoc){
                    clearInterval(xTime);
                    oDoc.write(
                        '<form enctype="multipart/form-data" method="post" action="' +
                        self.sUploadURL + '?fieldName=not-flash">' +
                        '<input class="file-input" type="file" name="not-flash" onchange="this.form.submit()" />' +
                        '<button class="btn btn-s12" type="button">' + self.oArgs.buttonText + '</button>' +
                        '</form>'
                    );

                    oDoc.body.style.cssText = 'margin:0;';

                    var $IFBody = $(oDoc.body);

                    $IFBody.find('form').css({
                        position : 'relative',
                        width    : self.oArgs.width ,
                        height   : self.oArgs.height
                    }).find('.btn').css({
                        position  : 'absolute',
                        zIndex    : 1,
                        top       : 0,
                        left      : 0,
                        width     : self.oArgs.width ,
                        height    : self.oArgs.height
                    });
                   
                    //开始上传
                    $IFBody.find('.file-input').bind('change.IframeUpload', function(){
                        self.oEvents.ON_UPLOAD_BEFORE(oFile, self);
                    }).css({
                        position  : 'absolute',
                        zIndex    : 2,
                        top       : 0,
                        left      : 0,
                        width     : self.oArgs.width ,
                        height    : self.oArgs.height,
                        opacity   : 0,
                        cursor    : 'pointer',
                        size      : 1
                    });
                }
            }, 20);

            return oFile;
        };

        var _oFile = fBuildForm();

        //绑定上传完成事件
        $Iframe.bind('load', function () {
            var sHtml = $.trim(this.contentWindow.document.body.innerHTML);
            if(sHtml.indexOf("{") === 0){
                try{
                    var jData = $.parseJSON(sHtml);
                    
                    if(jData){
                        if (jData.status && jData.status === 'success') {
                            //上传完成事件
                            _oFile.fileName     = jData.data.url;
                            _oFile.fileFullName = jData.data.abslouteUrl;
                            _oFile.title        = _oFile.name;
                            self.oEvents.ON_UPLOAD_SUCCESS(jData.data, _oFile, self);
                        }
                        else {
                            //上传失败
                            self.oEvents.ON_UPLOAD_ERROR(jData.message, _oFile, self, jData.data);
                        }
                        //重新生成一个上传实例
                        _oFile = fBuildForm();
                    }
                    
                }
                catch(e){
                    //上传失败
                    //self.oEvents.ON_UPLOAD_ERROR('Unknown error', _oFile, self);
                }
                
            }
        });
        self.oEvents.ON_UPLOADER_READY(self);
        self.$FileInput.hide();
    };

    /**
     * 拖拉上传助手 helper
     * @author vfasky
     * @date   2013-08-19
     * @return {[type]} [description]
     */
    var fDragHelper = {};
    (function(fDragHelper){
        /**
         * 存放拖拉的监听的对象
         * @type {Array}
         */
        var _aHandlers = [];

        var _aEls  = [];

        fDragHelper.add = function(oHandler){
            _aHandlers.push(oHandler);
        };

        fDragHelper.remove = function(oHandler){
            var nIndex = $.inArray(oHandler, _aHandlers);
            if(nIndex != -1){
                _aHandlers.splice(nIndex, 1);
                return true;
            }
            return false;
        };

        fDragHelper.hide = function(){
            $.each(_aEls, function(k, v){
                v.hide();
            });
        };
        /**
         * 判断对象是否有效
         * @author vfasky
         * @date   2013-08-19
         * @param  {Object} oHandler [上传对象]
         * @return {Boolean} [是否有效]
         */
        fDragHelper.isValid = function(oHandler){
            return oHandler.isDisable === false && oHandler.$FileInput.is(':visible');
        };

        $(function(){
            var _oBody = $(document.body);
            
            _oBody.on('dragenter.fDragHelper',function(){
                _aEls = [];
                $.each(_aHandlers, function(k,v){
                    if(fDragHelper.isValid(v)){
                        v.$Drop.show();
                        _aEls.push(v.$Drop);
                    }
                });
            }).on('click.fDragHelper', function(){
                fDragHelper.hide();
            });
        });
     
    })(fDragHelper);

    /**
     * 剪贴板上传助手
     * @type {Object}
     */
    var fClipboardHelper = {};
    (function(helper){
        
        /**
         * 监听的对象
         * @type {Array}
         */
        var _aHandlers = [];

        var _aEls  = [];

        helper.file = false;

        helper.add = function(oHandler){
            _aHandlers.push(oHandler);
        };

        helper.remove = function(oHandler){
            var nIndex = $.inArray(oHandler, _aHandlers);
            if(nIndex != -1){
                _aHandlers.splice(nIndex, 1);
                return true;
            }
            return false;
        };

        helper.hide = function(){
            $.each(_aEls, function(k, v){
                v.hide();
            });
        };
      
        helper.isValid = function(oHandler){
            return oHandler.isDisable === false && oHandler.$FileInput.is(':visible');
        };

        $(function(){
            if(!document.body.addEventListener){
                return;
            }
            //监听粘贴
            document.body.addEventListener('paste', function(e){
                var clipboardData = e.clipboardData;
                if(!clipboardData){
                    return;
                }
                
  
                helper.file = false;
                $.each(clipboardData.items, function(k,v){
                    if(v.kind=='file'){ 
                        helper.file = v.getAsFile();
                        return false;
                    }
                });   
                if(helper.file){
                    _aEls = [];
                    $.each(_aHandlers, function(k,v){
                        if(fDragHelper.isValid(v)){
                            v.$ClEl.show();
                            _aEls.push(v.$ClEl);
                            var setTitle = v.$ClEl.data('setTitle');
                            setTitle('type:' + helper.file.type + ' size:' + (helper.file.size / 1024 / 1024).toFixed(2) + ' Mb');
                        }
                    });
                }
            });
        });
    })(fClipboardHelper);
    

    /**
     * XMLHttpRequest 方式上传
     * @author vfasky
     * @date   2013-08-09
     * @param  {Object} oArgs 
     *   必填参数：uploadURL, fileInput , events
     * @return {Void}
     */
    var XHRUpload = function(oArgs){
        UploadBase.call(this, oArgs);

        var self       = this;
        var $FileInput = this.$FileInput;
        var $El        = this.$El.append('<div class="uploadify-button"><span class="uploadify-button-text">'+ self.oArgs.buttonText +'</span></div>');

        /**
         * 初始化剪贴板上传
         * @author vfasky
         * @date   2013-08-19
         * @return {Function} [description]
         */
        var fInitClipboardUpload = function(){
            var $ClEl  = $('<div>'+
                            '<div class="c-name"></div>' +
                            '<div class="c-bottons">'+
                                '<button type="button" class="btn btn-s12 cancel">'+ Can.msg.BUTTON.CANCEL +'</button>' +
                                '<button type="button" class="btn btn-s11 upload">'+ Can.msg.BUTTON.UPLOAD +'</button>' +
                            '</div>' +
                           '</div>');
            self.$ClEl = $ClEl;
            $ClEl.css({
                textAlign: 'center',
                background: '#fff',
                position: 'relative',
                borderRadius: 20,
                border: '4px dotted #efefef',
                zIndex: 8,
                boxShadow: '0 0 8px #999'
            }).find('.c-name').css({
                height: 50,
                lineHeight: '50px'
            });
            var nWidth  = 220;
            var nHeight = 85;
            if(self.oArgs.width < nWidth){
                $ClEl.width(nWidth);
            }
            else{
                $ClEl.width(self.oArgs.width);
            }

            if(self.oArgs.height < nHeight){
                $ClEl.height(nHeight);
            }
            else{
                $ClEl.height(self.oArga.height);
            }
            $ClEl.css({
                top : - $ClEl.height() / 2 - self.oArgs.height
            });

            $ClEl.find('.cancel').click(function(){
                fClipboardHelper.hide();
                return false;
            });

            $ClEl.find('.upload').click(function(){
                if(fClipboardHelper.file){
                    fUploadFile(fClipboardHelper.file);
                }
                fClipboardHelper.hide();
                return false;
            });

            $ClEl.data('setTitle', function(sTitle){
                $ClEl.find('.c-name').html(sTitle);
            });
         
            $ClEl.hide();
            $ClEl.appendTo($El);

            //加入粘贴上传
            fClipboardHelper.add(self);
        };

        $(function(){
            if(document.body.addEventListener){
                fInitClipboardUpload();
            }
        });
        

        /**
         * 初始化拖拉上传
         * @author vfasky
         * @date   2013-08-16
         * @return {Function} [description]
         */
        var fInitDropUpload = function(){
            var $Drop  = $('<div>'+ Can.msg.UPLOADER.DRAG_TIPS +'</div>');
            self.$Drop = $Drop;
            $Drop.css({
                textAlign: 'center',
                background: '#fff',
                position: 'relative',
                borderRadius: 20,
                border: '4px dotted #efefef',
                zIndex: 9,
                boxShadow: '0 0 8px #999'
            });
            var nWidth  = 200;
            var nHeight = 120;
            if(self.oArgs.width < nWidth){
                $Drop.width(nWidth);
            }
            else{
                $Drop.width(self.oArgs.width);
            }

            if(self.oArgs.height < nHeight){
                $Drop.height(nHeight);
            }
            else{
                $Drop.height(self.oArga.height);
            }
            $Drop.css({
                top : - $Drop.height() / 2 - self.oArgs.height,
                lineHeight: $Drop.height().toString() + 'px'
            });
         
            $Drop.hide();
            $Drop.appendTo($El);
            $Drop.on('dragenter.dropUpload', function(){
                $Drop.css({
                    background: '#fcffe4'
                });
            }).on('dragleave.dropUpload', function(){
                $Drop.css({
                    background: '#fff'
                });
            });
            var oDrop = $Drop[0];
            oDrop.addEventListener('dragover', function(e){
                e.stopPropagation();
                e.preventDefault();
                return false;
            }, false);
            oDrop.addEventListener('drop', function(e){
                e.stopPropagation();
                e.preventDefault();

                $Drop.css({
                    background: '#fff'
                });

                fDragHelper.hide();

                var files = e.dataTransfer.files;
                /*if (fCheckFiles(files)) {
                    $.each(files, function(k, v) {
                        fUploadFile(v);
                    });
                }*/
                processUploadFiles(files);
                return false;
            }, false);
          

            //加入监听
            fDragHelper.add(self);
        };

        /**
         * 判断是否兼容拖放上传
         */
        if (window.FileReader) {
            fInitDropUpload();
        }
        
        /**
         * 上传单个文件
         * @author vfasky
         * @date   2013-08-12
         * @param  {Mixin} xFile 要上传的html5 file对象
         * @return {void}
         */
        var fUploadFile = function(xFile){
            var oFormData = new FormData();
            if(xFile.name){
                oFormData.append(self.oArgs.fileObjName, xFile);
            }
            else{
                oFormData.append(self.oArgs.fileObjName, xFile, 'x.' + xFile.type.split('/').pop());
            }
            

            for(var v in self.oArgs.formData){
                oFormData.append(v, self.oArgs.formData[v]);
            }

            var oFile = {
                name : xFile.name,
                id   : self.getFileId()
            };

            // 开始上传
            self.oEvents.ON_UPLOAD_BEFORE(oFile, self);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', self.sUploadURL, true);

            // 上传进度
            xhr.upload.addEventListener("progress", function(e){
                self.oEvents.ON_UPLOAD_PROGRESS( Math.round((e.loaded * 100) / e.total), oFile, self);
            });
            // 上传完成
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4){
                    try{
                        var jData = $.parseJSON(xhr.responseText);

                        if (jData.status && jData.status === 'success') {
                            oFile.fileName     = jData.data.url;
                            oFile.fileFullName = jData.data.abslouteUrl;
                            oFile.title        = oFile.name;
                            //console.log($FileInput);
                            $FileInput.val('');
                            self.oEvents.ON_UPLOAD_SUCCESS(jData.data, oFile, self);
                        }
                        else {
                            self.oEvents.ON_UPLOAD_ERROR(jData.message, oFile, self);
                        }
                    }
                    catch(e){
                        self.oEvents.ON_UPLOAD_ERROR('Unknown error', oFile, self);
                    }
                    return false;
                }
            };
            xhr.send(oFormData);
        };

		/**(该方法已废弃,批量上传时只对第一个文件进行校验.替代方法:processUploadFiles())
         * 检查上传文件
         * @author vfasky
         * @date   2013-08-19
         * @param  {[type]} files [description]
         * @return {Function} [description]
         */
        // var fCheckFiles = function(files){
        //     var aFileExts = [];
        //     var aFileType = self.oArgs.fileTypeExts || '' ;

        //     files = files || [];

        //     $.each(aFileType.split(';'), function(k,v){
        //         var ext = $.trim(v.split('.').pop()).toLowerCase();
        //         aFileExts.push(ext);
        //     });

        //     //检查可上传数量  
        //     if(files && files.length > self.oArgs.uploadLimit){
        //         self.oEvents.ON_UPLOAD_ERROR('ERR_UPLOAD_100', {}, self);
        //         return false;
        //     }

        //     //检查扩展名
        //     for (var i = 0, file; file = files[i]; ++i) {
        //         if(file.name){
        //             var ext = $.trim(file.name.split('.').pop()).toLowerCase();
        //         }
        //         else{
        //             var ext = $.trim(file.type.split('/').pop()).toLowerCase();
        //         }

        //         switch(ext){
        //             case 'jpge':
        //                 ext = 'jpg';
        //                 break;
        //             case 'x-flv':
        //                 ext = 'flv';
        //                 break;
        //         }

        //         var oFile = {
        //             name : file.name,
        //             size : file.size,
        //             id   : self.getFileId()
        //         };
        //         if($.inArray(ext, aFileExts) != -1 ||
        //            $.inArray('*', aFileExts) != -1){
        //             //检查大小
        //             if(file.size / 1024 > self.oArgs.fileSizeLimit){
        //                 self.oEvents.ON_UPLOAD_ERROR('ERR_UPLOAD_110', oFile, self);
        //                 return false;
        //             }
        //             else{
        //                 return true;
        //             }
        //         }
        //         else{
        //             self.oEvents.ON_UPLOAD_ERROR('ERR_UPLOAD_130', oFile, self);
        //             return false;
        //         }
        //         return true;
        //     }
        // };
        
        /**
         * 处理上传文件:检查文件是否合法,如果合法则可以上传,否则跳过不处理.
         * @author gangw
         * @date   2014-07-23
         * @param  files 待处理上传的html5 files对象
         * @return {void}
         */
        var processUploadFiles = function(files) {
            var aFileExts = [];
            var aFileType = self.oArgs.fileTypeExts || '';

            //Check the number of flies that can be uploaded
            if (files.length > self.oArgs.uploadLimit) {
                self.oEvents.ON_UPLOAD_ERROR('ERR_UPLOAD_100', {}, self);
                return ;
            }

            $.each(aFileType.split(';'), function(k,v){
                var ext = $.trim(v.split('.').pop()).toLowerCase();
                aFileExts.push(ext);
            });

            for(var i = 0; i < files.length; i++) {
                var file = files[i];

                if(file.name){
                    var ext = $.trim(file.name.split('.').pop()).toLowerCase();
                }else{
                    var ext = $.trim(file.type.split('/').pop()).toLowerCase();
                }

                switch(ext){
                    case 'jpge':
                        ext = 'jpg';
                        break;
                    case 'x-flv':
                        ext = 'flv';
                        break;
                }

                var oFile = {name: file.name, size: file.size, id: self.getFileId()};

                // Check file size
                if(file.size / 1024 > self.oArgs.fileSizeLimit){
                    self.oEvents.ON_UPLOAD_ERROR('ERR_UPLOAD_110', oFile, self);
                    continue;
                }
                // Check file type
                if($.inArray('*', aFileExts) < 0 && $.inArray(ext, aFileExts) < 0 ){                  
                    self.oEvents.ON_UPLOAD_ERROR('ERR_UPLOAD_130', oFile, self);
                    continue;
                }
                //upload
                fUploadFile(file);
            }
        };
        //构造 dom
        $El.css({
            position : 'relative'
        }).find('.uploadify-button').css({
            position  : 'relative',
            zIndex    : 1,
            width     : self.oArgs.width,
            height    : self.oArgs.height,
            padding   : 0,
            margin    : 0,
            textAlign : 'center',
            lineHeight: self.oArgs.height.toString() + 'px'
        }).attr({
            'class' : 'uploadify-button ' + self.oArgs.buttonClass
        });

        $FileInput.css({
            opacity   : 0,
            cursor    : 'pointer',
            position  : 'absolute',
            textAlign : 'right',
            size      : 1,
            zIndex    : 2,
            width     : self.oArgs.width,
            height    : self.oArgs.height,
            top       : 0,
            left      : 0
        }).change(function() { 
            if($FileInput.val() === ''){
                return;
            }
			/*if(fCheckFiles(this.files)){
                $.each(this.files, function(k,v){
                    fUploadFile(v);
                });
            } */
            processUploadFiles(this.files);
        });
        
        self.oEvents.ON_UPLOADER_READY(self);
    };
    

    /**
     * 使用 flash 上传
     * @author vfasky
     * @date   2013-08-12
     * @param  {Object} oArgs 
     *   必填参数：uploadURL, fileInput , events
     * @return {Void} 
     */
    var FlashUpload = function(oArgs){
        UploadBase.call(this, oArgs);

        var self       = this;
        var $FileInput = this.$FileInput;

        var oIdMap = {};

        var fGetFileId = function(sId){
            if(!oIdMap[sId]){
                oIdMap[sId] = self.getFileId();
            }
            
            return oIdMap[sId];
        };

        var oOptions = $.extend(oArgs, {
            swf: Can.util.Config.uploader.swf,
            itemTemplate: '<div></div>',
            onSWFReady : function(){
                self.oEvents.ON_UPLOADER_READY(self);
                self.$El.find('.uploadify-button').css({
                    overflow: 'hidden',
                    padding: 0,
                    textAlign: 'center'
                });
            },
            onFallback : function(){
                // 使用 iframe 上传
                var Onew = new IframeUpload(oArgs);
                self.disable = function(bType){
                    Onew.disable(bType);
                };
            },
            onSelect : function(file){
                var oFile = {
                    name : file.name ,
                    id   : fGetFileId(file.id)
                };
                self.oEvents.ON_UPLOAD_BEFORE(oFile, self);
            },
            onSelectError: function (file, code) {
                self.oEvents.ON_SELECT_ERROR('ERR_UPLOAD_' + Math.abs(code), file, self);
            },
            onUploadError: function (file, code ) {
                self.oEvents.ON_UPLOAD_ERROR('ERR_UPLOAD_' + Math.abs(code), file, self);
            },
            onUploadProgress : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                var oFile = {
                    name : file.name ,
                    id   : fGetFileId(file.id)
                };
                self.oEvents.ON_UPLOAD_PROGRESS( Math.round((totalBytesUploaded * 100) / totalBytesTotal), oFile, self);
            },
            onUploadSuccess: function (file, sData, isSuccess) {
                var oFile = {
                    name : file.name ,
                    id   : fGetFileId(file.id)
                };
                if (isSuccess) {
                    try{
                        var jData = $.parseJSON(sData);

                        if (jData.status && jData.status === 'success') {
                            oFile.fileName     = jData.data.url;
                            oFile.fileFullName = jData.data.abslouteUrl;
                            oFile.title        = oFile.name;
                            self.oEvents.ON_UPLOAD_SUCCESS(jData.data, oFile, self);
                        }
                        else {
                            self.oEvents.ON_UPLOAD_ERROR(jData.message, oFile, self);
                        }
                    }
                    catch(e){
                        self.oEvents.ON_UPLOAD_ERROR('Unknown error', oFile, self);
                    }
                }
                else{
                    self.oEvents.ON_UPLOAD_ERROR('Unknown error', oFile, self);
                }
            }
        });

        //等待dom加载
        $FileInput.attr('id', self.sElId + '-input');
        //console.log($FileInput.attr('id'));
        var xTime = setInterval(function(){
            if($FileInput.length > 0){
                clearInterval(xTime);
                $FileInput.uploadify(oOptions);
            }
        }, 100);
    };
    

    /**
     * 上传助手
     * @author vfasky
     * @date   2013-08-09
     * @param  {Object} oArgs 
     *   必填参数：uploadURL, ( fileInput || file ), events
     * @return {UploadBase}
     */
    var uploadHelper = function(oArgs){
        /**
         * 是否支持html5的文件api
         * @type {Boolean}
         */
        var isFileAPI = window['FormData'] && window['XMLHttpRequest'] || false;

        if($.browser.msie){
            return new FlashUpload(oArgs);
        }

        //return new IframeUpload(oArgs);
        //retutn new XHRUpload(oArgs);
        //return new FlashUpload(oArgs);
        //使用 html5 上传
        if(isFileAPI){
            return new XHRUpload(oArgs);
        }
        //使用 flash 上传(注： 如不支持flash, 会自动降级成 iframe)
        else{
            return new FlashUpload(oArgs);
        }
    };

    //发布方法
    Can.ui.UploadHelper = uploadHelper;

    Can.ui.uploader = Can.extend(Can.ui.BaseUI, {
        id: 'upload-files',
        previewWidth: 80,
        previewHeight: 80,
        company_logo: false,
        maxTotal: 1,
        itemEls: [],
        constructor: function (jCfg) {
            Can.apply(this, jCfg || {});
            this.success = {
                files: {},
                total: 0
            };
            this.options = {
                uploader: Can.util.Config.uploader.server,
                buttonClass: '',
                buttonText: 'SELECT FILES',
                checkExisting: false,
                fileObjName: 'FileData',
                fileTypeDesc: 'All Files',
                fileTypeExts: '*.*',
                height: 20,
                multi: true,
                formData: {},
                width: 120,
                imgTemplate : '<div id="${fileID}" class="exist-file file-item">'+
                                '<div class="preview">' +
                                  '<img class="up-photo" src="${previewUrl}" alt="${fileName}">' +
                                '</div>'+
                                '<a ${deleteBind} class="exist-close" href="javascript:;" cantitle="Delete"></a>' +
                              '</div>',

                itemTemplate :  '<div id="${fileID}" class="file-item">' +
                                '   <label class="name">${fileName} (${fileSize})</label>' +
                                '   <a ${deleteBind} class="close" href="javascript:;"></a>' +
                                '</div>',
              
                flvTemplate : '<div id="${fileID}" class="exist-file file-item">'+
                                '<embed width="${previewWidth}" height="${previewHeight}" wmode="transparent" type="application/x-shockwave-flash" quality="high" src="${flyPlayer}">' +
                                '<a ${deleteBind} class="exist-close" href="javascript:;" cantitle="Delete"></a>' +
                              '</div>'
            };

            Can.ui.uploader.superclass.constructor.call(this);
            this.addEvents('ON_SELECT_ERROR', 'ON_UPLOAD_ERROR', 'ON_UPLOAD_SUCCESS', 'ON_UPLOADER_READY', 'ON_REMOVE_FILE');
        },
        initUI: function () {

            /*set options*/
            var jOpt = this.options;
            // upload url
            jOpt.uploadUrl = this.uploadUrl;
            // button text
            jOpt.buttonText = this.btnText || jOpt.buttonText;
            // button style
            jOpt.buttonClass = this.btnCss || jOpt.buttonClass;
           
            // file description
            jOpt.fileTypeDesc = this.fileDesc || jOpt.fileTypeDesc;
            // file type
            jOpt.fileTypeExts = this.fileType || jOpt.fileTypeExts;
            // file size
            jOpt.fileSizeLimit = (this.fileSize || jOpt.fileSizeLimit) * 1024;         
            // multiple
            jOpt.multi = (this.isMultiple === undefined) ? jOpt.multi : this.isMultiple;         
            // post param name
            jOpt.fileObjName = this.inputName || jOpt.fileObjName;
            // post query string
            jOpt.formData = {fieldName: jOpt.fileObjName};
         
            // width
            jOpt.width = this.width || jOpt.width;
            // height
            jOpt.height = this.height || jOpt.height;
            
            this.el = $('<div></div>');
            this.el.addClass(this.cssName);
            this.fileIpt = $('<input class="uploadify" type="file">');
            this.fileIpt.attr({
                'id': this.id,
                'name': this.inputName
            });
            if(jOpt.multi){
                this.fileIpt.attr('multiple', 'mulitple');
            }
            this.fileIpt.appendTo(this.el);
         
            this.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            //进度队列
            this._progressLine = {};
            this._oUploadArgs = {
                uploader     : self.options.uploadUrl || Can.util.Config.uploader.server,
                fileInput    : self.fileIpt,
                buttonText   : self.options.buttonText,
                width        : self.options.width,
                height       : self.options.height,
                buttonClass  : self.options.buttonClass,
                checkExisting: self.options.checkExisting,
                fileSizeLimit: self.options.fileSizeLimit,
                fileTypeExts : self.options.fileTypeExts,
                fileObjName  : self.options.fileObjName,
                fileTypeDesc : self.options.fileTypeDesc,
                formData     : self.options.formData,
                overrideEvents: self.overrideEvents ? self.overrideEvents : [],
                //uploadLimit  : self.maxTotal,
                events       : {
                    'ON_UPLOADER_READY' : function(uploader){
                        self.fireEvent('ON_UPLOADER_READY', uploader);
                        self.createPreview();
                    },
                    'ON_SELECT_ERROR' : function(msg, file, uploader, sourceData) {
                        self.fireEvent('ON_SELECT_ERROR', file, msg, sourceData);
                    },
                    'ON_UPLOAD_ERROR' : function(msg, file, uploader, sourceData){
                        self.fireEvent('ON_UPLOAD_ERROR', file, msg, sourceData);

                        if(self.$Queue){
                            var sId = '#progress-' + file.id;
                            self.$Queue.find(sId).remove();
                        }
                    },
                    'ON_UPLOAD_PROGRESS' : function(progress, file, uploader){
                        //console.log(file.id)
                        if(self._progressLine[file.id]){
                            clearTimeout(self._progressLine[file.id]);  
                        }
                        self._progressLine[file.id] = setTimeout(function(){
                            //console.log('call?')
                            self.showProgress(progress, file);
                        }, 10);
                    },
                    'ON_UPLOAD_SUCCESS' : function(data, file, uploader){
                        if(self._progressLine[file.id]){
                            clearTimeout(self._progressLine[file.id]);  
                        }
                        //console.log(self.getFileList())
                        //console.log(self.maxTotal)
                        
                        if(self.getFileList().length < self.maxTotal){
                            var oFile = data;
                            oFile.name = file.name;
                            oFile.id   = file.id;
                            oFile.size = data.fileSize;
                            self.pushFiles([oFile]);
                            //console.log(self.getFileList())
                            self.fireEvent('ON_UPLOAD_SUCCESS', file, data);
                        }
                        else{
                            self.fireEvent('ON_UPLOAD_ERROR', file, 'ERR_UPLOAD_100');
                        }
                    }
                }
            };
            
        },
        startUploader: function (jCfg) {
            $.extend(this._oUploadArgs, jCfg || {});
            this.uploader = uploadHelper(this._oUploadArgs);
        },
        toggleUploadBtn: function (nTotal) {
            if(this.uploader){
                this.uploader.disable(Number(nTotal) === this.maxTotal);
            }
        },
        getPreviewURL: function (sURL) {
            var _url  = sURL.split('.');
            var _sExt = _url[_url.length - 1].toLowerCase();

            if($.inArray(_sExt, ['jpg', 'jpge', 'git', 'png', 'bmp']) === -1){
                return sURL;
            }

            _url[_url.length - 2] += '_' + this.previewWidth + 'x' + this.previewHeight + '_3';
            return _url.join('.');
        },
        //加入文件
        pushFiles: function (aFile) {
            var self = this;

            for (var i = 0; i < aFile.length; i++) {
                if(self.getFileList().length === Number(self.maxTotal)){
                    break;
                }
                if (typeof aFile[i] !== 'object') {
                    self.success.files['exist-file-' + i] = {
                        url: aFile[i],
                        abslouteUrl: false,
                        name: '',
                        size: 0
                    };
                }
                else{
                    if(aFile[i].id && aFile[i].url && aFile[i].abslouteUrl){
                        self.success.files[aFile[i].id] = aFile[i];
                    }
                    else{
                        self.success.files['exist-file-' + i] = {
                            url: aFile[i].fileName,
                            abslouteUrl: aFile[i].fileFullName,
                            name: aFile[i].title,
                            size: 0
                        };
                    }
                }
                
            }
            self.createPreview();
        },
        //_createPreviewTime: false,
        //_isShowProgress: false,
        //显示上传进度
        showProgress: function(progress, oFile){
            if(!this.$Queue || !progress || !oFile){
                return;
            }

            //self._isShowProgress = true;
          
            var sId = 'progress-' + oFile.id;
            var $El = this.$Queue.find('#' + sId);

            //console.log($El.length)
            
            if($El.length === 0){
                this.$Queue.find('.upload-preview').each(function(){
                    var _this = $(this);
                    if(!_this.attr('id')){
                        $El = _this;
                        $El.attr('id', sId).
                            show().
                            css({
                                overflow: 'hidden',
                                position: 'relative'
                            });

                        $El.append('<div class="progress"></div><span></span>');
                        return false;
                    }
                });
            }

            $El = $El.eq(0);
            $El.find('.progress').css({
                height: $El.height(),
                width: $El.width() * progress / 100,
                position: 'absolute',
                top: 0,
                left: 0,
                background: '#DE4927'
            });
            try {
                $El.find('span').html(progress.toString() + ' %').
                    css({
                        height: $El.height(),
                        lineHeight: $El.height().toString() + 'px',
                        width: $El.width(),
                        textAlign: 'center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 10,
                        display: 'block',
                        fontWeight: 'bold',
                        color: '#fff'
                    });

            } catch (e) {
                // $El 已经被删
            }
                        
            //self._isShowProgress = false;
            
        },
        //渲染模板
        renderTpl: function(tpl, args){
            args = args || {};
            tpl  = tpl.toString();
            for(var k in args){
                var reg = new RegExp('\\\$\\\{'+ k +'\\\}', 'g');
                tpl = tpl.replace(reg, args[k]);
            }
            return tpl;
        },
        
        // createPreview: function(){
        //     var self = this;
        //     if(self._createPreviewTime){
        //         clearTimeout(self._createPreviewTime);
        //     }
        //     self._createPreviewTime = setTimeout(function(){
        //         //console.log('is s p: ' + self._isShowProgress)
        //         if(false === self._isShowProgress){
        //             self._createPreview();
        //         }
        //     }, 10);
        // },
        createPreview: function () {
            //console.log('previes????')
            this.$Queue = $('#' + this.id + '-queue');
            this.$Queue.find('.upload-preview').remove();
            
            $.each(this.itemEls, function(k,v){
                v.remove();
            });
            this.itemEls = [];

            var self      = this;
            var aFileList = this.getFileList();
            this.toggleUploadBtn(aFileList.length);
            //console.log(aFileList)
            for (var i = 0; i < this.maxTotal; i++) {
                if(aFileList[i]){
                    var v           = aFileList[i];
                    
                    var sExt        = v.abslouteUrl.split('.').pop().toLowerCase();
                    var oArgs       = {
                        fileID: v.id,
                        previewUrl: self.getPreviewURL(v.abslouteUrl),
                        flyPlayer:  Can.util.Config.uploader.flvPlayer + '?vcastr_file=' + v.abslouteUrl,
                        fileName: v.name,
                        url: v.url,
                        deleteBind: ' act="remove" ',
                        previewWidth: self.previewWidth,
                        previewHeight: self.previewHeight,
                        fileSize: v.size<(1024*1024)?(v.size / 1024).toFixed(2).toString() + ' Kb':(v.size / 1024/1024).toFixed(2).toString() + ' Mb',
                        abslouteUrl: v.abslouteUrl,                    
                        fileType: sExt //返回类型
                    };
                    
                    //self.uploader.oArgs.uploadLimit--; 
                    
                    //console.log(self.itemTemplate);

                    switch(sExt){
                        case 'flv':
                            var sTpl = self.flvTemplate || self.options.flvTemplate;
                            break;
                        case 'jpg': case 'png': case 'gif': case 'bmp': case 'jpge':
                            var sTpl = self.imgTemplate || self.options.imgTemplate;
                            break;
                        default:
                            var sTpl = self.itemTemplate || self.options.itemTemplate;
                            
                    }

                    if(v.abslouteUrl){
                        var $El = $(self.renderTpl(sTpl, oArgs));
                        (function(v, $El){
                            $El.find('[act=remove]').click(function(){
                                //console.log(v)
                                //console.log(self.success.files)
                                delete self.success.files[v._id];
                                self.createPreview();
                                self.fireEvent('ON_REMOVE_FILE', v);
                                //self.uploader.oArgs.uploadLimit++;
                                return false;
                            });
                        })(v, $El);
                        self.itemEls.push($El);
                        $El.appendTo(self.$Queue);
                    }
                }
                else{
                    if (this.isPreview) {
                        this.$Queue.append('<div class="upload-preview"></div>');
                    }
                    else{
                        this.$Queue.append('<div class="upload-preview" style="display:none; height:20px; width:120px;"></div>');
                        this.$Queue.css({
                            marginTop: 10
                        });
                    }
                }
            }
                
            
        },
        // get file list with url, name and size.
        getFileList: function () {
            var aFiles = [];
            for (var v in this.success.files) {
                var oV = this.success.files[v];
                oV._id = v;
                aFiles.push(oV);
            }
            return aFiles;
        },
        // get file list only url
        getFileNameList: function (bArray) {
            var aFiles = [];
            for (var v in this.success.files) {
                aFiles.push(this.success.files[v].url);
            }
            if (bArray) {
                return aFiles;
            }
            else {
                return aFiles.join('|');
            }
        }
    });
})(Can, $);

