/**
 * Step button view
 * @Author: SAM
 * @Version: 2.0
 * @Update: 13-2-26
 */

Can.view.findKeywordView = Can.extend(Can.view.BaseView, {
    width:200,
    id:'findKeywordViewId',
    /**
     * AutoComplete下拉框父级元素样式名
     */
    optionsContainerCssName:'autocomplete',
    /**
     * 提示输入文字
     */
    blankText:Can.msg.FORM.KEYWORD,
    /**
     * 是否AutoComplete<br/>
     * true--必须提供数据请求URL
     * false--默认不异步请求数据
     */
    autoComplete:false,
    autoCompleteURL:'',
    Surl:null,
    /**
     * 提交到后台的参数名
     */
    name:null,
    requireUiJs:['js/framework/widget/textField.js'],
    constructor:function (jCfg) {
        var _th = this;
        Can.apply(this, jCfg || {});
        Can.view.findKeywordView.superclass.constructor.call(this);
        this.addEvents('ON_UPDATE');
        this.titler = new Can.ui.Panel({
            wrapEL:'h2',
            html:this.title
        });
        this.searchBtn = $('<a class="ico-search" href="javascript:;"></a>');
        this.input = $('<input class="txt" type="text">');
        this.input.css({width:this.width - 50});
        if (this.name) {
            this.input.attr('name', this.name);
        }
        if (this.blankText) {
            this.input.attr('placeholder', this.blankText);
        }
        var me = this;
        this.input.click(function () {
            if (me.value == '' || me.value == null) {
                me.input.val('')
            }
            me.fireEvent('onclick', me, me.input);
        });
        this.input.blur(function () {
            me.fireEvent('onblur', me, me.input);
        });
        this.input.keyup(function (event) {
            if (event.keyCode == 27) {//ESC
                me.hideOptions();
                return;
            }
            me.value = this.value;
            me.getRemoteData.call(me);
            me.fireEvent('onchange', me, me.input);
        });
        this.searchBtn.click(function () {
            var keyword = _th.getValue();
        });

    },
    startup:function () {
        this.el = $('<div></div>');
        this.el.attr('style', 'width:' + this.width + 'px');
        this.el.addClass(this.css);
        this.el.append(this.searchBtn);
        this.el.append(this.input);
    },
    /**
     * 如果textField被设置成AutoComplete，则请求数据，数据格式必须是一个字符串数组。
     * 提交的参数名取决于name
     */
    getRemoteData:function () {
        if (this.autoComplete && this.autoCompleteURL.length > 0) {
            if (this.isOnLoading) {
                //正在请求数据，则停止新的请求
                return;
            }
            this.isOnLoading = true;
            if (!this.optionsContainerEL) {
                this.optionsContainerEL = $('<ul></ul>').attr('class', this.optionsContainerCssName + ' hidden').appendTo(this.el);
                this.optionsContainerEL.css({
                    'width':this.el.outerWidth(true) - 16
                });
            }
            this.optionsContainerEL.empty();//清空所有的data
            var _param = {};
            this.name && (_param[this.name] = this.input.val());
            var me = this;

            $.ajax({
                url:this.autoCompleteURL,
                data:_param,
                success:function (jData) {
                    if (jData.data) {
                        var aData = jData.data.items;
                        for (var i = 0; i < aData.length; i++) {
                            var _liObj = $('<li><a href="javascript:;">' + aData[i] + '</a></li>');
                            _liObj.appendTo(me.optionsContainerEL);
                            _liObj.click(function (event) {
                                event.stopPropagation();
                                me.setValue($(this).text());
                            });
                            me.isOnLoading = false;
                        }
                        me.showOptions();
                    }
                },
                complete:function () {
                    //因为有可能是出错的停止，所以必须在这里清除掉isOnLoading的状态，不然之后就无法再出现提示
                    me.isOnLoading = false;
                }
            });
        }
    },
    /**
     * 显示下拉框选项
     */
    hideOptions:function () {
        if (this.optionsContainerEL) {
            this.isOptionShow = false;
            this.optionsContainerEL.attr('class', this.optionsContainerCssName + ' hidden');
        }
    },
    /**
     * 显示下拉框选项
     */
    showOptions:function () {
        if (this.optionsContainerEL) {
            this.isOptionShow = true;
            this.optionsContainerEL.attr('class', this.optionsContainerCssName);
        }
        //获取页面的高度，如果弹出的提示层位置超过它，则显示在上面
        var _body_height = document.body.offsetHeight;
        if (this.optionsContainerEL.offset().top + this.optionsContainerEL.height() > _body_height) {
            this.optionsContainerEL.css({
                top:this.el.offset().top - this.optionsContainerEL.height()
            });
        }
    },
    /**
     * 设置当前Field的value, value必须要要是valueItems数组当中的一个，否则将无法生效
     */
    setValue:function (val) {
        this.value = val;
        this.input.val(val);
        this.hideOptions();
        this.fireEvent('onselected', val);
    },

    /**
     * 获取当前field的选择值
     */
    getValue:function () {
        return this.value;
    },
    /**
     * 获取当前field选择值的显示值
     */
    getValueLabel:function () {

    },
    /**
     * 点击按钮事件
     * @param {Object} fn
     */

    hide:function () {
        this.el.hide();
    },
    show:function () {
        this.el.show();
    }
});
