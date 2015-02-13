/*
 * action window for v2
 * Author: Allenice
 * Date: 2014-2-17
 *
 * */

(function(Can){
    Can.importJS(['js/framework/utils/two-way-tpl.js','js/framework/utils/ui/window/baseWindow.js']);

    Can.util.ui.window.ActionWindow = Can.extend(Can.util.ui.window.BaseWindow, {
        constructor: function(options){

            // '默认设置'
            options = $.extend({
                'title': 'Message',
                'message': '',
                'actions': [
                    {
                        'btnText': 'OK',
                        'cssName': '',
                        'onClick': function($el){
                            this.close();
                        }
                    }
                ]
            }, options);

            Can.util.ui.window.ActionWindow.superclass.constructor.call(this, options);
        },

        init: function(){
            Can.util.ui.window.ActionWindow.superclass.init.call(this);
            var self = this;

            var html = '<div class="win-inner action-win">' +
                            '<div class="title">'+self.settings.title+'</div>' +
                            '<div class="message"></div>' +
                            '<div class="inner"></div>' +
                        '</div>';
            var $tpl = $(html);

            // '添加按钮和动作'
            $.each(this.settings.actions, function(i, action){
                var $item = $('<a class="action-btn" href="javascript:;">'+action.btnText+'</a>');
                $tpl.find('.inner').append($item);

                if(action.cssName){
                    $item.addClass(action.cssName);
                }

                if(typeof action.onClick == 'function'){
                    $item.click(function(){
                        action.onClick.call(self, $(this));
                    });
                }
            });

            self.setContent($tpl);

            // '延时调用'
            if(this.callSetTitle){
                this.setTitle();
            }
            if(this.callSetMessage || this.settings.message){
                this.setMessage(this.settings.message);
            }

            self._onWinResize();

        },

        show: function(message){
            Can.util.ui.window.ActionWindow.superclass.show.call(this);
            if(message){
                this.setMessage(message);
            }

            return this;
        },

        // '设置标题'
        setTitle: function(title){

            if(title){
                this.settings.title = title;
            }

            if(this._$Tpl){
                this._$Tpl.find('.title').html(this.settings.title);
                this._onWinResize();
            }else{
                // '模板还没有加载，延时调用'
                this.callSetTitle = true;
            }
            return this;
        },

        // '设置提示信息'
        setMessage: function(message){

            if(message){
                this.settings.message = message;
            }

            if(this._$Tpl){
                var messageType = typeof this.settings.message;
                var $message = this._$Tpl.find('.message');
                if (messageType == 'string'){
                    $message.html(this.settings.message);
                }
                else if(messageType == 'object' && this.settings.message.appendTo){
                    $message.html('');
                    this.settings.message.appendTo($message);
                }
                this._onWinResize();
            }else{
                // '模板还没有加载，延时调用'
                this.callSetMessage = true;
            }

            return this;

        }
    });

    if(window.define){
        define('ActionWindow', function(){
            return Can.util.ui.window.ActionWindow;
        });
    }

})(Can);