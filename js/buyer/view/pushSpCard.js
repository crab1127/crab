/**
 * Push supplier card
 * @Author: AngusYoung
 * @Version: 1.5
 * @Update: 13-7-12
 */

Can.view.pushSpCardView = Can.extend(Can.view.BaseView, {
    id: 'pushSpCardViewId',
    actionJs: ['js/buyer/action/pushSpCardAction.js'],
    wrapTag: 'div',
    data: null,
    /**
     * 推送的类型
     * 1：产品+内容
     * 2：内容，显示企业视频
     * 3：内容，显示形象照片
     * 4：产品
     * 0：空，系统出提示
     */
    pushType: 0,
    constructor: function (jCfg) {
        var proDiv = '';
        var size = jCfg.index % 7 === 0 ? '480x480' : '230x230';
        Can.apply(this, jCfg || {});
        Can.view.pushSpCardView.superclass.constructor.call(this);
        this.contentEl = $('<' + this.wrapTag + '></' + this.wrapTag + '>');
        if ($.browser.msie && ($.browser.version == "8.0")) {
            proDiv = '<div class="ie-pro-after"></div>'
        }

        this.pushWrap = new Can.ui.Panel({
            cssName: 'pro-pic',
            html: '<a href="javascript:;">' + Can.util.formatImage(this.data.pushPic, size) + '</a>' + proDiv
        });


        this.personPic = new Can.ui.Panel({
            html: '<a href="javascript:;">' + Can.util.formatImage(this.data.supplierPhoto, '60x60') + '</a>'
        });
        var _pic = new Can.ui.Panel({
            cssName: 'pic',
            items: [this.personPic]
        });

        this.personName = new Can.ui.toolbar.Button({
            text: this.data.supplierName
        });
        var _name = new Can.ui.Panel({
            cssName: 'name',
            wrap: 'p',
            items: [this.personName]
        });

        var _match = new Can.ui.Panel({
            cssName: 'mod-mch ' + fCountMatchLevel(this.data.matchNum),
            html: Can.msg.MATCH + ':<em>' + this.data.matchNum + '%</em>'
        });
        _match.el.attr('cantitle', Can.msg.CAN_TITLE.MATCH.replace('[@]', this.data.matchNum));

        var _url = this.data.supplierURL ? this.data.supplierURL : Can.util.thirdDomainURLFor(this.data.suppDomain);
        var html = '<a href="' + _url + '" target="_blank" title="' + this.data.supplierCompany + '">' + this.data.supplierCompany + '</a>';

        this.personComp = new Can.ui.Panel({
            cssName: 'company-name',
            html: html
        });

        var _info = new Can.ui.Panel({
            cssName: 'info',
            items: [_name, _match, this.personComp]
        });

        this.person = new Can.ui.Panel({
            cssName: 'mod-person clear',
            items: [_pic, _info]
        });
        var _txt = Can.msg.BUYER.INDEX.MSG_GUIDE.replace('[@]', this.data.supplierTrade)
            .replace('[@@]', Can.util.Config.lang === 'en' ? (this.data.supplierTitle + ' ' + this.data.supplierName) : (this.data.supplierName + this.data.supplierTitle));

        var _pushMsg = '<p class="txt2">' + _txt + '</p>';
        switch (this.data.type) {
            case 1:
                //推荐了产品和介绍了他们公司
                _pushMsg = _pushMsg.replace('[@@@]', Can.msg.BUYER.INDEX.TYPE_1);
                _pushMsg += '<p class="txt3">' + this.data.msg + '</p>';
                break;
            case 2:
                //介绍了他们公司
                _pushMsg = _pushMsg.replace('[@@@]', Can.msg.BUYER.INDEX.TYPE_2);
                _pushMsg += '<p class="txt3">' + this.data.msg + '</p>';
                break;
            case 3:
                //介绍了他们公司
                _pushMsg = _pushMsg.replace('[@@@]', Can.msg.BUYER.INDEX.TYPE_2);
                _pushMsg += '<p class="txt3">' + this.data.msg + '</p>';
                break;
            case 4:
                //推荐了他们的产品
                _pushMsg = _pushMsg.replace('[@@@]', Can.msg.BUYER.INDEX.TYPE_3);
                _pushMsg += '<p class="txt3">' + this.data.productTitle + '</p>' +
                    '<p class="txt4">' + this.data.productIntroduction + '</p>';
                break;
            default :
                //打了个招呼
                _pushMsg = _pushMsg.replace('[@@@]', Can.msg.BUYER.INDEX.TYPE_4);
                _pushMsg += '<p class="txt3">' + this.data.msg + '</p>';
        }
        //处理字符超长的情况
        var _css_name = 'txt-ap';
        var _long = _pushMsg.replace(/<[^>]+>/g, '').length;
        if (_long > 260) {
            _css_name += ' hoe'
        }

        this.pushMsg = new Can.ui.Panel({
            cssName: _css_name,
            html: '<div class="dock-wrap">' + _pushMsg + '</div>'
        });

        this.pushOpa = new Can.ui.Panel({
            cssName: 'box-b'
        });
        this.inqBtn = new Can.ui.toolbar.Button({
            cssName: 'bg-ico ico-inquiry'
        });

        this.inqBtn.el.attr('cantitle', Can.msg.CAN_TITLE.INQUIRY);
        /*把IM替换成skype*/

        /*var IMBtn = new Can.ui.toolbar.Button({
         cssName: 'bg-ico ico-chat'
         });
         //绑定im
         IMBtn.el.data({
         setStatus: function (status, data) {
         if (status == 'online') {
         IMBtn.el.attr('class', 'bg-ico ico-chat-online')
         }
         else {
         IMBtn.el.attr('class', 'bg-ico ico-chat')
         }
         }
         });
         IMBtn.el.attr('cantitle', Can.msg.CAN_TITLE.CHAT);
         //IMBtn.el.data('setStatus')('online')
         //console.log(this.data)
         Can.util.bindIM.add(IMBtn.el, this.data.supplierId);*/
        this.IMBtn = $('<div id="SkypeButton100' + jCfg.index + '" class="io-skype io-skype-min" style="margin: 0;vertical-align:bottom"></div>');
        this.favBtn = new Can.ui.toolbar.Button({
            cssName: 'bg-ico ico-fav'
        });
        this.favBtn.el.attr({
            'role': 'mark',
            'cantitle': Can.msg.CAN_TITLE.FAV
        });
        this.pushOpa.addItem([this.inqBtn, '<i> | </i>', this.IMBtn, '<i> | </i>', this.favBtn]);
    },
    startup: function () {
        this.contentEl.addClass(this.cssName);
        this.pushWrap.applyTo(this.contentEl);
        this.person.applyTo(this.contentEl);
        this.pushMsg.applyTo(this.contentEl);
        this.pushOpa.applyTo(this.contentEl);
        this.target && this.contentEl.appendTo(this.target);
    },
    onPushWrapClick: function (fFn) {
        if (typeof fFn === 'function') {
            this.pushWrap.on('onclick', fFn, this.pushWrap.el);
        }
    },
    onPersonClick: function (fFn) {
        if (typeof fFn === 'function') {
            this.personPic.on('onclick', fFn);
            this.personName.on('onclick', fFn);
        }
    },
    onInqClick: function (fFn) {
        if (typeof fFn === 'function') {
            this.inqBtn.on('onclick', fFn);
        }
    },
    initSkypeBtn: function (jCfg,index) {
        if(/^(live:){0,1}[a-zA-Z][a-zA-Z0-9_\.\-\,]{5,31}$/g.test(jCfg.skype)){
            Skype.ui({
                "name": "dropdown",
                "element": "SkypeButton100"+index,
                "participants" : [jCfg.skype],
                "statusStyle" : "mediumicon",
                "millisec" : "5000",
                "cfecId": jCfg.supplierId
        });
        }else{
            this.IMBtn.next().remove();
            this.IMBtn.remove();
        }
    }
});
