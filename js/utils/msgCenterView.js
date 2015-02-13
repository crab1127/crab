/**
 * message center
 * @Author: sam
 * @Version: 2.7
 * @Update: 13-7-24
 */

Can.view.msgCenterView = Can.extend(Can.view.BaseView, {
    id: 'msgCenterViewID',
    requireUiJs: [ 'js/utils/stepBtnView.js', 'js/utils/findKeyword.js'],
    parentEl: null,
    showLoading: function () {
        if (!this.loadingBar) {
            this.loadingBar = $('<div class="loading"><span></span>' + Can.msg.LOADING + '</div>');
            this.loadingBar.appendTo(this.contentEl);
        }
        this.loadingBar.show();
    },
    hideLoading: function () {
        this.loadingBar && this.loadingBar.hide();
    },
    setMessageData: function (sMsgType) {
        var URL, _this = this, msgURL = Can.util.Config.seller.messageCenter;

        if (typeof sMsgType === 'string') {
            _this.allTypeFeild.setValue(sMsgType);
        }
        _this.selectAllFeild.labelEL.removeClass('ticked');
        _this.showLoading();

        switch (this.node.label.val()) {
            case 'inbox':
                URL = msgURL.inboxItem;
                break;
            case 'outbox':
                URL = msgURL.outboxItem;
                break;
            case 'spam':
                URL = msgURL.spamItem;
                break;
        }

        $.ajax({
            url: URL,
            data: this.node.filter.serialize(),
            cache: false,
            success: function (returnData) {
                if (returnData.status && returnData.status === 'success') {
                    _this.el.find(".mod-table tbody").empty();
                    if (_this.page_feild) {
                        Can.apply(_this.page_feild, {
                            current: returnData.page.page,
                            total: returnData.page.total,
                            limit: returnData.page.pageSize
                        });
                        _this.page_feild.refresh();
                    }
                    _this.fireEvent('ON_LOAD_DATA', returnData.data.list);
                    _this.updatePager(returnData.page);
                }
                else {
                    Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, returnData);
                }
                _this.hideLoading();
            }
        });
    },
    constructor: function (jCfg) {
        Can.apply(this, jCfg || {});
        Can.view.msgCenterView.superclass.constructor.call(this);
        this.addEvents('ON_SELECT_ALL_CLICK', 'ON_LOAD_DATA', 'ON_DEL_CLICK', '', '');
    },
    startup: function () {
        var _this = this;
        //main容器
        this.el = $('<div class="main"></div>');
        //operate容器
        this.opt_toolbar = new Can.ui.Panel({cssName: 'opt-area'});
        //prev&next btn
        this.stepButton = new Can.view.stepBtnView({css: ['btn-prev', 'btn-next']});
        this.stepButton.start();
        this.stepBox = new Can.ui.Panel({
            cssName: 'mod-pagination-s2',
            items: this.stepButton.group
        });
        this.stepButton.getDOM(0).attr('role', 'quick-pager').data('turn', 'prev');
        this.stepButton.getDOM(1).attr('role', 'quick-pager').data('turn', 'next').addClass('dis');
        //查询表单
        this.select_textFeild = new Can.view.findKeywordView({
            name: 'keyword',
            css: 'search-s2',
            width: 150
        });
        this.select_textFeild.start();
        var filter = new Can.ui.Panel({ wrapEL: 'form'})
            , label = $('<input type="hidden" name="label" value="inbox" />')
            , page = $('<input type="hidden" name="page" value="1" />')
            ;

        filter.el.submit(function () {
            return false;
        });

        filter.el.append(page);
        filter.el.append(label);
        this.node = {
            filter: filter.el,
            page: page,
            label: label
        };

        //全选选择框
        this.selectAllFeild = new Can.ui.msgSelectMSGType({
            id: 'group_feild',
            cssName: 'filtype-msg',
            target: _this,
            postUrl: Can.util.Config.newGroup,
            valueItems: [0, 1, 2],
            labelItems: Can.msg.MODULE.MSG_CENTER.SELECT_LABEL,
            itemCallback: function (nVal) {
                var $Table = this.target.tableNav.tbody;
                $Table.children("tr").removeClass("selected").find("input[type='checkbox']").attr("checked", false);
                switch (parseInt(nVal, 10)) {
                    case 1://read
                        $Table.children("tr.read:not([notselect])").addClass("selected").find("input[type='checkbox']").attr("checked", true);
                        if ($Table.children("tr.read:not([notselect])").length == this.target.itemCount) {
                            this.labelEL.addClass('ticked');
                        }
                        break;
                    case 2://unread
                        $Table.children("tr.unread:not([notselect])").addClass("selected").find("input[type='checkbox']").attr("checked", true);
                        if ($Table.children("tr.unread:not([notselect])").length == this.target.itemCount) {
                            this.labelEL.addClass('ticked');
                        }
                        break;
                    case 0 ://all
                        $Table.children("tr:not([notselect])").addClass("selected").find('input[type="checkbox"]').attr('checked', true);
                        if ($Table.children("tr:not([notselect])").length == this.target.itemCount) {
                            this.labelEL.addClass('ticked');
                        }
                }
            }
        });

        //All Type Field
        this.allTypeFeild = new Can.ui.DropDownField({
            cssName: 'select-box all-type',
            valueItems: ['', 'inquiry', 'email', 'system'],
            labelItems: Can.msg.MODULE.MSG_CENTER.SEARCH_LABEL,
            blankText: Can.msg.MODULE.MSG_CENTER.ALL_TYPE, optionsContainerCssName: 'mark-s1',
            name: 'msgType'
        });

        filter.addItem(this.select_textFeild.el);
        filter.addItem(this.allTypeFeild);

        this.allTypeFeild.el.find(".mark-s1").css("width", "auto");
        this.opt_toolbar.addItem(this.stepBox);
        this.opt_toolbar.addItem(filter);
        /*
         this.opt_toolbar.addItem(this.select_textFeild.el);
         this.opt_toolbar.addItem(this.allTypeFeild);
         */
        this.opt_toolbar.addItem(this.selectAllFeild);

        /*delete button*/
        this.delIco = $('<a class="bg-ico ico-del" style="display:none" href="javascript:;"></a>').appendTo(document.body);
        this.delIco.click(function () {
            _this.fireEvent('ON_DEL_CLICK', _this.delIco);
        });
    },
    updatePager: function (page) {
        var disClass = 'dis'
            , current = page.page
            , pagesize = page.pageSize
            , total = page.total
            , pageNav = this.stepButton
            , prev = pageNav.getDOM(0)
            , next = pageNav.getDOM(1)
            ;


        if (current * pagesize < total) {
            next.removeClass(disClass);
            //this.stepButton.getDOM(1).removeClass('dis');
        } else {
            next.addClass(disClass);
            //this.stepButton.getDOM(1).addClass('dis');
        }
        if (current === 1) {
            prev.addClass(disClass);
        } else {
            prev.removeClass(disClass);
        }
    }
});

Can.view.msgCntInboxView = Can.extend(Can.view.msgCenterView, {
    id: 'msgCenterInboxViewID',
    actionJs: ['js/utils/msgCntInboxViewAction.js'],
    constructor: function (jCfg) {
        Can.apply(this, jCfg || {});
        Can.view.msgCntInboxView.superclass.constructor.call(this);
        this.addEvents('ON_DELETE_CLICK', 'ON_EXPORT');
    },
    startup: function () {
        var _this = this;
        Can.view.msgCntInboxView.superclass.startup.call(this);
        //delete btn
        this.delBtnNav = new Can.ui.Panel({cssName: 'item-opt'});
        this.delBtnFeild = new Can.ui.toolbar.Button({
            text: Can.msg.BUTTON.DELETE,
            cssName: 'btn btn-s12'
        });
        this.delBtnNav.addItem(this.delBtnFeild);
        this.delBtnFeild.click(function () {
            _this.fireEvent("ON_DELETE_CLICK", '');
        });
        //export Btn
        this.exportBtnNav = new Can.ui.Panel({cssName: 'item-opt'});
        this.exportBtn = new Can.ui.toolbar.Button({
            text: Can.msg.MODULE.MSG_CENTER.EXPORT,
            cssName: 'btn btn-s12'
        });
        //暂时屏蔽导出功能
        //this.exportBtnNav.addItem(this.exportBtn);
        this.exportBtn.click(function () {
            //获取选择中的产品的ID并传到后台
            _this.fireEvent("ON_EXPORT");
        });
        //设置查询按钮事件
        this.select_textFeild.searchBtn.click(function () {
            _this.el.find('[name=page]').val(1);
            _this.setMessageData();
        });


        this.opt_toolbar.addItem(this.delBtnNav);
        this.opt_toolbar.addItem(this.addBtnNav);
        this.opt_toolbar.addItem(this.exportBtnNav);
        this.opt_toolbar.applyTo(this.el);//完成Toolbar

        //table list
        this.tableNav = new Can.ui.tableList({
            cssName: 'mod-table tbl-msg-center',
            data: {
                col: ['w30', 'w30', 'w180', 'w30', '', 'w50', 'w90'],
                head: ['<div class="th-gap"></div>', '<div class="th-gap"></div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.SENDER + '</div>', '<div class="th-gap"></div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.SUBJECT + '</div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.TYPE + '</div>', '<div class="th-gap"></div>'],
                item: []
            },
            emptyTips: '<div class="data-none"><p class="txt2">' + Can.msg.MODULE.MSG_CENTER.NO_MSG + '</p></div>'
        });
        this.page_mod = $('<div class=""></div>');
        this.page_feild = new Can.ui.limitButton({
            cssName: 'ui-page fr',
            showTotal: true
        });

        //分页处理
        var _this = this;
        _this.page_feild.onChange(function () {
            var page = this.current;
            //更改页数
            _this.node.filter.find('[name=page]').val(page);
            _this.setMessageData();
        });

        this.page_mod.append(this.page_feild.el);
        this.el.append(this.tableNav.el);
        this.el.append(this.page_mod);
    },
    /*刷新未读邮件数*/
    updateUnread: function () {
        var _this = this;
        $.ajax({
            url: Can.util.Config.seller.messageCenter.unreadMsgNum,
            success: function (resultData) {
                if (resultData.status && resultData.status === "success") {
                    //调用更新数字的函数
                    _this.parentEl.menuView.updateNewMsg(resultData.data.total);
                    //取消Attention Msg
                    if (resultData.data.attention == false) {
                        _this.parentEl.menuView.hideAttentionMsg();
                    }else if(resultData.data.attention){ //恢复邮件时可能显示出attention
                        _this.parentEl.menuView.showAttentionMsg();
                    }
                }
            }
        });
    },
    /*更新邮件为已读状态*/
    changeState: function (messageId) {
        if (messageId) {
            //find id at tr
            var $Tr = this.tableNav.tbody.find('input[value="' + messageId + '"]').parents('tr');
            //toggle tr class
            $Tr.removeClass('unread').addClass('read');
            $Tr.find('.ico-read').addClass('ico-chked').attr('cantitle', Can.msg.MODULE.MSG_CENTER.READ);
        }
    }
});


Can.view.msgCntOutboxView = Can.extend(Can.view.msgCenterView, {
    id: 'msgCntOutboxViewID',
    actionJs: ['js/utils/msgCntOutboxViewAction.js'],
    constructor: function (jCfg) {
        Can.apply(this, jCfg || {});
        Can.view.msgCntOutboxView.superclass.constructor.call(this);
    },
    startup: function () {
        var _this = this;
        Can.view.msgCntOutboxView.superclass.startup.call(this);

        //delect btn
        this.delBtnNav = new Can.ui.Panel({cssName: 'item-opt'});
        this.delBtnFeild = new Can.ui.toolbar.Button({
            text: Can.msg.BUTTON.DELETE,
            cssName: 'btn btn-s12'
        });
        this.delBtnNav.addItem(this.delBtnFeild);
        this.delBtnFeild.click(function () {
            _this.fireEvent("ON_DELETE_CLICK");
        });

        this.opt_toolbar.addItem(this.delBtnNav);
        this.opt_toolbar.applyTo(this.el);//完成Toolbar
        //设置查询按钮事件
        this.select_textFeild.searchBtn.click(function () {
            _this.el.find('[name=page]').val(1);
            _this.setMessageData();
        });

        //table list
        this.tableNav = new Can.ui.tableList({
            cssName: 'mod-table tbl-msg-center',
            data: {
                col: ['w30', 'w180', 'w30', '', 'w50', 'w90'],
                head: ['<div class="th-gap"></div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.RECIPIENT + '</div>', '<div class="th-gap"></div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.SUBJECT + '</div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.TYPE + '</div>', '<div class="th-gap"></div>'],
                item: []
            },
            emptyTips: '<div class="data-none"><p class="txt2">' + Can.msg.MODULE.MSG_CENTER.NO_MSG + '</p></div>'
        });
        this.page_mod = $('<div class=""></div>');
        this.page_feild = new Can.ui.limitButton({
            cssName: 'ui-page fr',
            showTotal: true
        });
        //分页处理
        var _this = this;
        _this.page_feild.onChange(function () {
            var page = this.current;
            //更改页数
            _this.node.filter.find('[name=page]').val(page);
            _this.setMessageData();
        });
        this.page_mod.append(this.page_feild.el);
        this.el.append(this.tableNav.el);
        this.el.append(this.page_mod);
    }
});


Can.view.msgCntSpamboxView = Can.extend(Can.view.msgCenterView, {
    id: 'msgCntSpamboxViewID',
    actionJs: ['js/utils/msgCntSpamboxViewAction.js'],
    constructor: function (jCfg) {
        Can.apply(this, jCfg || {});
        Can.view.msgCntSpamboxView.superclass.constructor.call(this);
        this.addEvents('ON_RESTORE_CLICK');
    },
    startup: function () {
        var _this = this;
        Can.view.msgCntSpamboxView.superclass.startup.call(this);

        //restor btn
        this.restoreBtnNav = new Can.ui.Panel({cssName: 'item-opt'});
        this.restoreBtnFeild = new Can.ui.toolbar.Button({
            text: Can.msg.MODULE.MSG_CENTER.RESTORE, cssName: 'btn btn-s12'
        });
        this.restoreBtnNav.addItem(this.restoreBtnFeild);
        this.restoreBtnFeild.click(function () {
            _this.fireEvent("ON_RESTORE_CLICK", '')
        });
        //addtoBtn
        this.delForeverBtnNav = new Can.ui.Panel({cssName: 'item-opt'});
        this.deleteFevBtn = new Can.ui.toolbar.Button({
            text: Can.msg.MODULE.MSG_CENTER.DELETE_FOREVER, cssName: 'btn btn-s12'
        });
        this.delForeverBtnNav.addItem(this.deleteFevBtn);
        this.deleteFevBtn.click(function () {
            _this.fireEvent("ON_DELETE_FEV", '');
        });

        //email source type
        this.sourceType = new Can.ui.DropDownField({
            cssName: 'select-box all-type',
            name: 'previousLabel',
            valueItems: ['', 'inbox', 'outbox'],
            labelItems: Can.msg.MODULE.MSG_CENTER.SOURCE_LABEL,
            blankText: Can.msg.MODULE.MSG_CENTER.ALL_TYPE,
            optionsContainerCssName: 'mark-s1'
        });
        this.sourceType.applyTo(this.node.filter);

        this.opt_toolbar.addItem(this.restoreBtnNav);
        this.opt_toolbar.addItem(this.delForeverBtnNav);
        this.opt_toolbar.applyTo(this.el);//完成Toolbar
        //设置查询按钮事件
        this.select_textFeild.searchBtn.click(function () {
            _this.el.find('[name=page]').val(1);
            _this.setMessageData();
        });

        //table list
        this.tableNav = new Can.ui.tableList({
            cssName: 'mod-table tbl-msg-center',
            data: {
                col: ['w30', 'w30', 'w180', 'w30', '', 'w50', 'w90'],
                head: ['<div class="th-gap"></div>', '<div class="th-gap"></div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.SENDER + '</div>', '<div class="th-gap"></div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.SUBJECT + '</div>', '<div class="th-gap">' + Can.msg.MODULE.MSG_CENTER.TYPE + '</div>', '<div class="th-gap"></div>'],
                item: []
            },
            emptyTips: '<div class="data-none"><p class="txt2">' + Can.msg.MODULE.MSG_CENTER.NO_MSG + '</p></div>'
        });
        this.page_mod = $('<div class=""></div>');
        this.page_feild = new Can.ui.limitButton({
            cssName: 'ui-page fr',
            showTotal: true
        });
        //分页处理
        var _this = this;
        _this.page_feild.onChange(function () {
            var page = this.current;
            //更改页数
            _this.node.filter.find('[name=page]').val(page);
            _this.setMessageData();
        });
        this.page_mod.append(this.page_feild.el);
        this.el.append(this.tableNav.el);
        this.el.append(this.page_mod);
    }
});
