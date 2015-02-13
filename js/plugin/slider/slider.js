/**
 * 幻灯片播放插件
 * @author Allenice
 * @date 2013-12-30
 * @version 1.0
* */

var Can = Can || {
        util:{
            Config: {
                'lang': (window.localStorage && window.localStorage.lang) || 'en',
                'app': {
                    /*前端资源访问路径*/
                    'CanURL': '/C/',
                    /*后端接口访问路径*/
                    'CfOneURL': '/cfone/'
                }
            }
        },
        loadedFiles : [],
        importJS: function(jsArray){
            var self = this;
            $.each(jsArray, function(index, jsFile){
                if ($.inArray(jsFile, self.loadedFiles) == -1){
                    return;
                }
                $.ajax({
                    url: self.util.Config.app.CanURL + jsFile,
                    dataType: 'script',
                    cache: true,
                    async: false,
                    success: function(){
                        self.loadedFiles.push(jsFile);
                    }
                });
            });
        }
    };

(function(Can){
    'use strict';

    Can.importJS(['js/framework/utils/two-way-tpl.js', 'js/plugin/jquery/jquery.switchable-2.0.min.js']);

    var instance = null;
    var template = Can.util.TWtemplate;

    /**
     * 构造函数
     * @param aData 图片数据数组 [{img:'', desc:'', alt:''}] or ['img-url', 'img-url','img-url']
     * @param options
     */
    function Slider(aData, options){

        // default settings
        this.settings = $.extend({
            'data': null,
            'autoPlay': false,
            'loop': true,
            'interval': 5,
            'effect': 'scrollLeft', // 'none', 'fade', 'scrollLeft', 'scrollRight'
            'triggerType': 'click', // 'mouse', 'click'
            'zIndex': 1000,
            'startIndex': 0,
            'background': "#000",
            'opacity': "1",
            'onShow': function(){},
            'onClose': function(){},
            'onBeforeSlide': function(){},
            'onAfterSlide': function(){}
        }, options);

        var aEffect = ['none', 'fade', 'scrollLeft', 'scrollRight'];

        if($.inArray(this.settings.effect, aEffect) == -1){
            this.settings.effect = 'scrollLeft';
        }

        this.data = aData || this.settings.data;
        this.callShow = false;
        this.instanceID = "can-plugin-slider";

        var self = this;
        template.load('js/plugin/slider/template.html',function(tpl){
            self._$Tpl = $(tpl);
            $("body").append(self._$Tpl);

            self._$Tpl.attr('id', self.instanceID).addClass('can-plugin-slider').hide().css({'z-index': self.settings.zIndex});
            self._$Tpl.find('.cps-mask').css({'background':self.settings.background, 'opacity': self.settings.opacity});

            self.oAnt = template(self._$Tpl);

            self.init();

            if(self.callShow){
                self._show();
            }
        });

    };
    Slider.prototype = {

        init: function(){
            var self = this;

            // 关闭
            self._$Tpl.find('.cps-close-btn').click(function(){
                self.close();
            });

            // 文字描述的收起和折叠
            self._$Tpl.find('.cps-main').on('click', '.cps-desc a', function(){
                var unfold = $(this).data('unfold');
                if(unfold){
                    $(this).data('unfold', false).removeClass('cps-unfold').addClass('cps-fold');
                    $(this).siblings('div').show()
                    $(this).parents('.cps-desc').css({'height':'auto'});
                }else{
                    $(this).data('unfold', true).removeClass('cps-fold').addClass('cps-unfold');
                    $(this).siblings('div').hide();
                    $(this).parents('.cps-desc').height(60);
                }
            });

            //  Show all text when mouse move in the desc field and hide it when move out.
            self._$Tpl.find('.cps-main').on({
                mouseenter: function(){
                    var $el = $(this).find('div, p');
                    $el.css({'height': 'auto'});

                    var _height = $el.height();
                    $el.height(40);

                    if(_height > 40){
                        $el.animate({'height': _height}, 300);
                    }
                },
                mouseleave: function(){
                    $(this).find('div, p').animate({'height': 40}, 300);
                }
            }, '.cps-desc');

            // 自适应
            $(window).on('resize',function(){
                self._onWinResize();
            });

            // left or right
            self._$Tpl.find('.cps-main-mask .cur-left').click(function(){
                self.slider.prevBtn.click();
            });
            self._$Tpl.find('.cps-main-mask .cur-right').click(function(){
                self.slider.nextBtn.click();
            });


            // 数据赋值
            if(self.data){
                self.updateData(self.data);
            }

            // auto play
            self._$Tpl.find('.cps-auto-play').click(function(){
                var auto = $(this).data('auto');
                if(!auto){
                    $(this).data('auto', true).text('Stop play');
                    self.slider.play();
                }else{
                    $(this).data('auto', false).text('Auto play');
                    self.slider.pause();
                }
            });

            return self;
        },

        show: function(nIndex){
            this.settings.startIndex = nIndex || 0;
            if(this._$Tpl){
                this._show();
            }else{
                this.callShow = true;
            }

            return this;
        },

        close: function(){
            this.callShow = false;
            this._$Tpl.fadeOut(500, function(){
                $('html, body').css({'overflow': 'auto'});
            });

            if(typeof this.settings.onClose === 'function'){
                this.settings.onClose.call(this);
            }

            this._$Tpl.find('.cps-auto-play').data('auto', false).text('Auto play');
            if(this.slider.pause){
                this.slider.pause();
            }

            return this;
        },

        updateData: function(aData){
            var self = this;
            if(aData){
                var _data = [];
                $.each(aData, function(index, item){
                    if(typeof item === 'string'){
                        item = {'img': item, 'desc': '', 'alt': ''}
                    }

                    var url = item.img;
                    var index = url.lastIndexOf(".");
                    item.thumb = url.substr(0,index)+"_60x60_3"+url.substr(index);
                    _data.push(item);
                });

                self.data = _data;
                self.oAnt.set('imgs', self.data);
                self.oAnt.set('curItem', self.data[self.settings.startIndex]);
                self.oAnt.set('curNum', self.settings.startIndex+1);
            }

            self._$Tpl.find('.cps-main .cps-slider .cps-img').on('load',function(){
                $(this).show().siblings('.cps-loading').hide();
            });

            // 轮播
            var $triggers = self._$Tpl.find('.cps-thumb');
            var $trigger = $triggers.find('li');
            var itemWidth = $trigger.width()+parseInt($trigger.css("margin-right"));
            var preIndex = 0, pageCount = Math.ceil($trigger.length / 8), curPage = 1;
            var prevBtn = self._$Tpl.find('.cps-min-map .cps-pre'), nextBtn = self._$Tpl.find('.cps-min-map .cps-next');


            function changePage(page){
                var left = -((page-1) * 8 * itemWidth) + 'px';
                $triggers.animate({'left': left}, 200);
                curPage = page;

                prevBtn.show();
                nextBtn.show();
                if(curPage <= 1){
                    prevBtn.hide();
                }
                if(curPage >= pageCount){
                    nextBtn.hide();
                }
            }

            self.slider = self._$Tpl.find('.cps-main .cps-slider').switchable({
                triggers: self._$Tpl.find('.cps-thumb li'),
                triggerType: self.settings.triggerType,
                currentTriggerCls:'cps-cur',
                effect: self.settings.effect,
                autoplay: true,
                loop: self.settings.loop,
                interval:self.settings.interval,
                api: true,
                prev:self._$Tpl.find('.cps-main .cps-pre'),
                next:self._$Tpl.find('.cps-main .cps-next'),
                onSwitch: function(event, currentIndex) {
                    var api = this;
                    var currentNum = currentIndex + 1;
                    var isToPre = currentIndex<preIndex;
                    var div = isToPre?currentNum:currentIndex;

                    if(!self.settings.loop){
                        api.prevBtn.toggleClass('dis', currentIndex === 0);
                        api.nextBtn.toggleClass('dis', currentIndex === api.length - 1);
                    }

                    if(currentNum < api.length && div % 8 == 0 && currentIndex!=0){
                        curPage = isToPre?curPage-1:curPage+1;
                        if(curPage >=1 && curPage <=pageCount){
                            changePage(curPage);
                        }
                    }else if(currentIndex == 0){
                        changePage(1);
                    }else if(currentIndex == api.length - 1){
                        changePage(pageCount);

                    }

                    preIndex = currentIndex;

                    self.oAnt.set('curItem', self.data[currentIndex]);
                    self.oAnt.set('curNum', currentIndex+1);

                    if(typeof self.onAfterSlide === 'function'){
                        self.settings.onAfterSlide.call(self, event, currentIndex);
                    }
                },
                beforeSwitch: function(event, currentIndex){
                    if(typeof  self.onBeforeSlide === 'function'){
                        self.settings.onBeforeSlide.call(self, event, currentIndex);
                    }
                }
            });

            if(!self.settings.autoPlay && self.data.length>1){
                $(this).data('auto', false).text('Auto play');
                self.slider.pause();
            }

            if(self.data.length>8){
                nextBtn.show();
                prevBtn.click(function(){
                    changePage(curPage-1);
                });
                nextBtn.click(function(){
                    changePage(curPage+1);
                });
            }

            if(self.data.length <= 1){
                self._$Tpl.find('.cps-auto-play').hide();
                self._$Tpl.find('.cps-main-mask').hide();
            }else{
                self._$Tpl.find('.cps-auto-play').show();
                self._$Tpl.find('.cps-main-mask').show();
            }

            return self;

        },

        _show: function(){
            this._$Tpl.fadeIn(500);
            this._onWinResize();
            $('html, body').css({'overflow': 'hidden'});

            this.slider.switchTo(this.settings.startIndex);

            if(typeof this.settings.onShow === 'function'){
                this.settings.onShow.call(this);
            }
        },

        _getWinSize: function(){
            var $win = $(window);

            return {
                width: $win.width(),
                height: $win.height()
            };
        },

        _onWinResize: function(){
            var winSize = this._getWinSize();
            var mainHeight = winSize.height - this._$Tpl.find('.cps-min-map').height() - 80;
            var $main = this._$Tpl.find('.cps-main');
            $main.height(mainHeight).css({'line-height': mainHeight+'px'}).find('img').css('max-height',mainHeight);
        }
    }

    Can.plugin = Can.plugin || {};

    Can.plugin.slider = function(aData, options){
        if(instance){
            instance._$Tpl.remove();
        }

        instance = new Slider(aData, options);

        return instance;
    }



})(Can);