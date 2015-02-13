/**
 * 发布采购需求成功
 * @Author: Allenice
 * @version: v1.0
 * @since:13-8-12
 */

Can.module.postBuyLeadSuccModule = Can.extend(Can.module.BaseModule,{
    id:'postBuyLeadSuccModuleID',
    title:Can.msg.POST_BUYING_LEAD.TITLE,
    actionUrl:null,
    actionJs:['js/buyer/action/postBuyLeadSuccAction.js'],
    productData:[],
    constructor:function(cfg){
        Can.apply(this,cfg || {});
        Can.module.postBuyLeadSuccModule.superclass.constructor.call(this);
    },
    startup:function(){
        Can.module.postBuyLeadSuccModule.superclass.startup.call(this);

        // processed tips
        this.processTips = new Can.ui.Panel({
            id:'processTips',
            cssName:'process-tips'
        });

        this.processTips.$img = $('<div class="pt-img"></div>');
        this.processTips.$tip1 = $('<div class="pt-tip1">Post Successfully!</div>');
        this.processTips.$tip2 = $('<div class="pt-tip2">Results will be imformed you by email. Please pay atteention to your mail box.</div>');

        this.processTips.addItem(this.processTips.$img);
        this.processTips.addItem(this.processTips.$tip1);
        this.processTips.addItem(this.processTips.$tip2);
        this.processTips.applyTo(this.contentEl);

        if(this.productData.length==0) return;

        // inquire title
        this.inquireTitle = new Can.ui.Panel({cssName:'tit-s2 inquire-title'});
        this.inquireTitle.el.css({"padding":"0"});
        this.inquireTitle.$title = $("<h3 class='it-h3'>  I would like to inquire on the product(s) above & receive the following information.</h3>");
        this.inquireTitle.$title.prepend("<span class='post-bg bg-check'></span>");
        this.inquireTitle.$title.append('<span class="it-tips">For urgent help? Email us: <a href="mailto:buyer@e-cantonfair.com">buyer@e-cantonfair.com</a></span>');

        this.inquireTitle.$title.find('.post-bg').data("checked",true);
        this.inquireTitle.$title.css("cursor","pointer");
        this.inquireTitle.$title.click(function(){
            $(this).find(".bg-check").trigger('click');
            return false;
        });


        this.inquireTitle.addItem(this.inquireTitle.$title);
        this.inquireTitle.applyTo(this.contentEl);

        // inquire form
        this.inquireForm = new Can.ui.Panel({
            wrapEL:'form',
            cssName:'inquire-form',
            html:'<div class="if-title">The product(s)  might matched to you</div>'
        });

        // 产品轮播
        this.productList = new Can.ui.Panel({cssName:'if-products'});
        this.productList.$list = $("<div class='if-pro-wrap'><ul></ul></div>");
        this.productList.$ul = this.productList.$list.find("ul");
        this.productList.$preBtn = $("<a class='if-btn if-pre' href='javascript:'></a>");
        this.productList.$nextBtn = $("<a class='if-btn if-next' href='javascript:'></a>");

        this.productList.$preBtn.hide();

        for(var i=0; i<this.productData.length; i++){
            var product = this.productData[i];
            var imgUrl = product.image;
            var index = imgUrl.lastIndexOf(".");
            var image = imgUrl.substr(0,index)+"_230x240_3"+imgUrl.substr(index);
            var html='<li class="if-pro-checked" data-checked="true" data-id="'+product.productId+'" >'+
                        "<a href='"+Can.util.Config.app.CanURL+"buyer/#!/view-product?m=buyerIndexModule&t="+product.productName+"&id="+product.productId+"' target='_blank'>"+
                            "<img src='"+image+"' alt='"+product.productName+"' />"+
                        "</a>"+
                        "<a class='if-pro-name' title='"+product.productName+"' href='"+Can.util.Config.app.CanURL+"buyer/#!/view-product?m=buyerIndexModule&t="+product.productName+"&id="+product.productId+"' target='_blank' >"+product.productName+"</a>"+
                        "<div class='if-pro-intro' title='"+product.teaser+"'>"+product.teaser+"</div>"+
                        "<div class='if-ico-checked'></div>"+
                    '</li>';
            this.productList.$ul.append(html);
        }

        this.productList.addItem(this.productList.$list);
        this.productList.addItem(this.productList.$preBtn);
        this.productList.addItem(this.productList.$nextBtn);
        this.inquireForm.addItem(this.productList);

        this.inquireForm.el.append('<div class="if-title">The information you can choose</div>');

        // choose information
        this.checkBoxs = new Can.ui.Panel({
            wrapEl: 'ul',
            cssName: 'if-checkboxs'
        });

        this.checkBoxs.el.append('<li><span class="post-bg bg-check" data-checked="true"></span>Product Catalogue</li>');
        this.checkBoxs.el.append('<li><span class="post-bg bg-check" data-checked="true"></span>Specifications</li>');
        this.checkBoxs.el.append('<li><span class="post-bg bg-check" data-checked="true"></span>FOB Price</li>');
        this.checkBoxs.el.append('<li><span class="post-bg bg-check" data-checked="true"></span>Company Introduction</li>');

        this.checkBoxs.el.find("li").css("cursor","pointer").click(function(){
            $(this).find(".bg-check").trigger('click');
            return false;
        });
        this.inquireForm.addItem(this.checkBoxs);

        // add more requirements
        this.addMore = new Can.ui.Panel({
            cssName:'if-add-more',
            html:'<div class="ifa-title" data-hidded="true">'+
                    '<span class="post-bg pbg-plus"></span>Add more requirements'+
                '</div>'+
                '<textarea class="ifa-cont" placeholder=" Something important that I need to emphasize..."></textarea>'
        });

        this.inquireForm.addItem(this.addMore);

        // 提交询盘按钮
        this.submitPanel = new Can.ui.Panel({cssName:'if-actions'});
        this.submitPanel.el.css("text-align","center");

        this.submitPanel.$btn = new Can.ui.toolbar.Button({
            id:'send-inquiry',
            text:'Inquiry Now',
            cssName:'btn btn-s11 btn-s16'
        });
        this.submitPanel.addItem(this.submitPanel.$btn);
        this.submitPanel.addItem($("<div id='inquiry-loading' class='inquiry-loading'></div>"));
        this.inquireForm.addItem(this.submitPanel);

        this.inquireForm.applyTo(this.contentEl);


    },
    // checkbox check or uncheck
    onBthCheck:function(fFn){
        if (typeof fFn === 'function') {
            $("#"+this.id).find(".bg-check").click(fFn);
        }
    },

    // 显示add more requirements的输入框
    onAddMoreClick:function(fFn){
        if (typeof fFn === 'function') {
            this.addMore.el.find(".ifa-title").click(fFn);
        }
    },

    // 选择产品
    onProductSelect:function(fFn){
        if (typeof fFn === 'function') {
            this.productList.$ul.find("li .if-ico-checked").click(fFn);
        }
    },

    // 前一组产品
    onPreBtnClick:function(fFn){
        if (typeof fFn === 'function') {
            this.productList.$preBtn.click(fFn);
        }
    },

    // 下一组产品
    onNextBtnClick: function(fFn){
        if (typeof fFn === 'function') {
            this.productList.$nextBtn.click(fFn);
        }
    },
    onSubmit:function(fFn){
        if (typeof fFn === 'function') {
            this.submitPanel.$btn.click(fFn);
        }
    }
});