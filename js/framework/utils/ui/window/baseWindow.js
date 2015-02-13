/*
* baseWindow of all v2 window
* Author: Allenice
* Date: 2014-2-14
* */

(function (Can){

    Can.importJS(['js/framework/utils/two-way-tpl.js']);
    var template = Can.util.TWtemplate;

    /* constructor */
    function BaseWindow (options){
        // default settings
        this.settings = {
            'width': 360,
            'height': 140,
            'showCloseBtn': true,
            'zIndex': 1000,
            'onShow': function(){},
            'onClose': function(){}
        };

        this.settings = $.extend(this.settings, options);
        this.callShow = false;

        var self = this;
        template.load('js/framework/utils/ui/window/baseWindow.html',function(tpl){
            self._$Tpl = $(tpl);
            $("body").append(self._$Tpl);
            self._$Tpl.hide();
            self._$Tpl.css({'z-index': self.settings.zIndex});
            self._$Tpl.find('.shade-div').css({'z-index': self.settings.zIndex});
            self._$Tpl.find('.win-pop').css({
                'width': self.settings.width,
                'min-height': self.settings.height,
                'margin-left': -self.settings.width / 2,
                'margin-top': -self.settings.height /2,
                'z-index': self.settings.zIndex + 1
            });

            template(self._$Tpl, {
                events:{
                    render: function(){
                        self.init();

                        if(self.callShow){
                            // 如果模板加载之前调用了show，则加载后调用_show()
                            self._show();
                        }

                        if(self.callSetContent){
                            self.setContent();
                        }
                    }
                }
            });
        });
    }

    BaseWindow.prototype = {
        init: function (){
            var self = this;

            var $closeBtn = self._$Tpl.find('.close');
            if(self.settings.showCloseBtn){
                $closeBtn.click(function(){
                    self.close();
                });
            }else{
                $closeBtn.hide();
            }

            // 自适应
            $(window).on('resize',function(){
                self._onWinResize();
            });

        },

        setContent: function(content){
            if(content){
                this.content = content;
            }

            if(this._$Tpl){
                this._$Tpl.find('.content').html(this.content);
                this._onWinResize();
            }else{
                // '延时调用'
                this.callSetContent = true;
            }

            return this;
        },

        show: function(){

            if(this._$Tpl){
                this._show();
            }else{
                // show delay because of template not loaded
                this.callShow = true;
            }

            return this;
        },

        close: function(){
            this.callShow = false;
            this._$Tpl.hide();

            if(typeof this.settings.onClose === 'function'){
                this.settings.onClose.call(this);
            }

            return this;
        },

        _show: function(){
            this._$Tpl.show();
            this._onWinResize();
            if(typeof this.settings.onShow === 'function'){
                this.settings.onShow.call(this);
            }
        },

        _onWinResize: function(){
            var winHeight = $(window).height();
            var $popWin = this._$Tpl.find('.win-pop');
            var popWinHeight = $popWin.height();

            if (winHeight > popWinHeight){
                $popWin.css({
                    'position': 'fixed',
                    'top': '50%',
                    'margin-top': -popWinHeight/2
                });
            }else{
                $popWin.css({
                    'position': 'absolute',
                    'top': 20,
                    'margin-top': 0
                });
            }
        }
    }

    Can.namespace('Can.util.ui.window');
    Can.util.ui.window.BaseWindow = BaseWindow;

    // Compatible require js
    if(window.define){
        define('BaseWindow', function(){
            return BaseWindow;
        });
    }

})(Can)