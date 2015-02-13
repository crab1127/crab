/**
 * 添加产品模块
 * @Author: lvjw
 * @Update: 14-01-22
 */
(function() {
    'use strict';
    /**
     * 添加产品基础模块 
     * @Author: lvjw
     * @update: 2013-08-19
     */
    Can.module.addProductBaseModule = Can.extend(Can.module.BaseModule, {
    	title: Can.msg.MODULE.PRODUCT_FORM.TITLE,
    	actionUrl: null,
    	requireUiJs: ['js/utils/kindEditorView.js', 'js/utils/textAndBtnView.js'],

        /**
         * 初始化提示栏
         */
        fInitTips: function() {
    		// 提示栏容器
    		this.tips4_nav = new Can.ui.Panel({
    			wrapEL: 'div', cssName: 'tips-s4', id: 'tips4', html: '<span class="ico"></span>'
    		});

    		// 提示栏内容
    		this.inner_des = new Can.ui.Panel({cssName: 'des', html: Can.msg.MODULE.PRODUCT_FORM.TIP});
    		this.tips4_nav.addItem(this.inner_des);

    		//添加到容器
    		this.tips4_nav.applyTo(this.contentEl);
        },

        /**
         * 初始化基本信息头部
         */
        fInitBaseInfoHead: function(container) {
    		this.oneTitleNav = new Can.ui.Panel({cssName: 'tit-s2', html: '<h3>' + Can.msg.MODULE.PRODUCT_FORM.TITLE_1 + '<span class="exrtip">' + Can.msg.MODULE.PRODUCT_FORM.EXR_TIPS_1 + '</span></h3>'});
    		container.addItem(this.oneTitleNav);
        },

        /**
         * 初始化产品名称
         */
        fInitProductName: function(container) {
            var that = this;

            // 初始化输入框
    		this.pdt_feildContainer = new Can.ui.Panel({cssName: 'inner'});
    		this.pdt_feildtxt = $('<input id="product_name" class="w400 ipt" type="text" name="productName">');
    		this.pdt_feildtxt.blur(function(event) {
    			that.fireEvent('onBlurAction', this.pdt_feildtxt);
    		});
    		this.pdt_feildtxt.keyup(function(event) {
    			that.fireEvent('ON_PRODUCT_NAME', this.pdt_feildtxt);
    		});
    		this.pdt_feildtxt.appendTo(this.pdt_feildContainer.el);
    		this.pdt_feildINnerNav = new Can.ui.Panel({cssName: 'el-cont'});
    		this.pdt_feildINnerNav.addItem(this.pdt_feildContainer);

            // 初始化输入提示区域
    		this.fm_editNav = new Can.ui.Panel({id: 'tipNav', cssName: 'fm-edit hidden'});
    		this.pdt_feildINnerNav.addItem(this.fm_editNav);

            // 初始化业务提示
    		this.pdt_feild = new Can.ui.Panel({cssName: 'el'});
    		this.pdt_feild.addItem(this.pdt_feildINnerNav);
    		this.pdt_feild_span = $('<span class="bg-ico ico-help" cantitle="' + Can.msg.MODULE.PRODUCT_FORM.PN_1 + '"></span>');
    		this.pdt_feild.addItem(this.pdt_feild_span);

            // 初始化Label
    		this.pdt_nam = new Can.ui.Panel({cssName: 'field', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.PRODUCT_NAME + '</label>'});
    		this.pdt_nam.addItem(this.pdt_feild);
    		this.product_id = $('<input id="product_id" class="w400 ipt hidden" type="text" name="productId">');
    		this.pdt_nam.addItem(this.product_id);
            container.addItem(this.pdt_nam);
        },

        /**
         * 初始化型号
         */
        fInitProductModel: function(container) {
            var that = this;

            // 初始化输入框
    		this.modelFeildContainer = new Can.ui.Panel({cssName: 'inner'});
    		this.modelFeildTxt = $('<input class="w400 ipt" type="text" name="model">');
    		this.modelFeildTxt.blur(function(event) {
    		});
    		this.modelFeildTxt.keyup(function(event) {
    			that.fireEvent('ON_PRODUCT_MODEL', this.modelFieldTxt);
    		});
    		this.modelFeildTxt.appendTo(this.modelFeildContainer.el);
    		this.modelFeildInnerNav = new Can.ui.Panel({cssName: 'el-cont'});
    		this.modelFeildInnerNav.addItem(this.modelFeildContainer);

            // 初始化输入提示区域
    		this.modelEditNav = new Can.ui.Panel({id: 'model-tip', cssName: 'fm-edit hidden'});
    		this.modelFeildInnerNav.addItem(this.modelEditNav);

            // 初始化业务提示
    		this.modelFeild = new Can.ui.Panel({cssName: 'el'});
    		this.modelFeild.addItem(this.modelFeildInnerNav);

            // 初始化Label
    		this.pdtModel = new Can.ui.Panel({cssName: 'field', html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.PRODUCT_MODEL + '</label>'});
    		this.pdtModel.addItem(this.modelFeild);
            container.addItem(this.pdtModel);
        },

        /**
         *初始化视屏链接输入框
         *
         */

        fInitProductVideoUrl: function(container){
            var that = this;
            // 初始化输入框
            this.videoUrlContainer = new Can.ui.Panel({cssName: 'field', html: '<label class="col"><span class="bg-ico"></span>' + Can.msg.MODULE.PRODUCT_FORM.PRODUCT_VIDEO_URL + '</label>'});
            this.videoUrl_el = new Can.ui.Panel({cssName: 'el'});
            this.videoUrl_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
            this.videoUrl_inner = new Can.ui.Panel({cssName: 'inner'});
            this.videoUrl_tip = new Can.ui.Panel({cssName: 'fm-error hidden', id: 'videoUrl_tip'});

            this.videoUrl_tip.el.attr("id", "videoUrl_tip");
            this.videoUrl = $('<input id="videoUrl" class="ipt w400" type="text" placeholder="http://www.example.com" value="" name="videoUrl">');
            this.videoUrl_inner.addItem([this.videoUrl]);
            this.videoUrl_span_help = $('<span class="bg-ico ico-help" cantitle="' + Can.msg.MODULE.PRODUCT_FORM.VIDEO_URL_TIPS + '"></span>');
//            this.videoUrl.keyup(function (event) {
//                that.fireEvent('ON_PRIMARY_KEYWORD_KEYUP', this.videoUrl);
//            });
            this.videoUrl.blur(function (event) {
                that.fireEvent('ON_VIDEO_URL', this.videoUrl);
            });
    
            this.videoUrl_el_cont.addItem(this.videoUrl_inner);
            this.videoUrl_el_cont.addItem(this.videoUrl_tip);
            this.videoUrl_el.addItem(this.videoUrl_el_cont);
            this.videoUrl_el.addItem(this.videoUrl_span_help);
            this.videoUrlContainer.addItem(this.videoUrl_el);            
            container.addItem(this.videoUrlContainer);
        },

        /**
         * 初始化产品分类
         */
        fInitProductCategory: function(container) {
            // 下拉选择框
    		var that = this;
    		this.category_feild = new Can.ui.DropDownField({
    			cssName: 'select-box',
    			name: 'categoryId',
    			valueItems: [],
    			labelItems: [],
    			blankText: Can.msg.MODULE.SEARCH.SEL_INDUSTRY
    		});
    		this.category_feild.click(function() {
    			that.category_feild.el.removeClass("a-error");
    			that.category_tip.el.addClass("hidden");

    			var _normal = [];
    			if (that.category_feild.valueField.val()) {
    				var aVal = that.category_feild.valueField.val().split(',');
    				var aTxt = that.category_feild.labelEL.text().split(';');
    				for (var i = 0; i < aVal.length; i++) {
    					_normal.push({
    						id: aVal[i],
    						text: aTxt[i]
    					});
    				}
    			}
    			var _config = {
    				maxSelect: 1,
    				target: that.category_feild.valueField,
    				normalValue: _normal
    			};
    			var _onSave = function(sIds, sValues) {
    				that.category_feild.labelEL.text(sValues);
    			};
    			Can.util.canInterface('categorySelector', [_config, _onSave]);
    		});
    		this.category_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.category_inner.addItem(this.category_feild);
    		this.category_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.category_el_cont.addItem(this.category_inner);

            // 提示区域
    		this.category_tip = new Can.ui.Panel({cssName: 'fm-error hidden', id: 'category_tip'});
    		this.category_el_cont.addItem(this.category_tip);
    		this.category_el = new Can.ui.Panel({cssName: 'el'});
    		this.category_el.addItem(this.category_el_cont);

            // Label
    		this.OneCategoryNav = new Can.ui.Panel({cssName: 'field f-category', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.CATEGORY + '</label>'});
    		this.OneCategoryNav.addItem(this.category_el);
            container.addItem(this.OneCategoryNav);
        },
       
         /**
         * 初始化产品主词
         */
        fInitProductPrimaryKeyword: function(container) {
            // 初始化输入框
            var that = this;
            //提示
            this.primaryKeywordContainer = new Can.ui.Panel({cssName: 'field', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.PRIMARY_KEYWORD + '</label>'});
            this.primaryKeyword_el = new Can.ui.Panel({cssName: 'el'});
            this.primaryKeyword_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
            this.primaryKeyword_inner = new Can.ui.Panel({cssName: 'inner'});
            this.primaryKeyword_tip = new Can.ui.Panel({cssName: 'fm-error hidden', id: 'primaryKeyword_tip'});

            this.primaryKeyword_tip.el.attr("id", "primaryKeyword_tip");
            this.primaryKeyword = $('<input id="keyword0" class="ipt w400" type="text" maxLength="30" placeholder="' + Can.msg.FORM.PRIMARY_KEYWORD + '" value="" name="primaryKeyword">');
            this.primaryKeyword_inner.addItem([this.primaryKeyword]);
            this.primaryKeyword_span_help = $('<span class="bg-ico ico-help" cantitle="' + Can.msg.MODULE.PRODUCT_FORM.RRIMARY_KEYWORD + '"></span>');
            this.primaryKeyword.keyup(function (event) {
                that.fireEvent('ON_PRIMARY_KEYWORD_KEYUP', this.primaryKeyword);
            });
            this.primaryKeyword.blur(function (event) {
                that.fireEvent('ON_PRIMARY_KEYWORD_KEYUP', this.primaryKeyword);
            });
    
            this.primaryKeyword_el_cont.addItem(this.primaryKeyword_inner);
            this.primaryKeyword_el_cont.addItem(this.primaryKeyword_tip);
            this.primaryKeyword_el.addItem(this.primaryKeyword_el_cont);
            this.primaryKeyword_el.addItem(this.primaryKeyword_span_help);
            this.primaryKeywordContainer.addItem(this.primaryKeyword_el);
            container.addItem(this.primaryKeywordContainer);
        },
        /**
         * 初始化产品关键词
         */
        fInitProductKeyword: function(container) {
            var that = this;
    		this.keywordContainer = new Can.ui.Panel({cssName: 'field', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.KEYWORD + '</label>'});
    		this.keyword_el = new Can.ui.Panel({cssName: 'el'});
    		this.keyword_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.keyword_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.keyword_tip = new Can.ui.Panel({cssName: 'fm-error hidden', id: 'keyword_tip'});
    		this.keyword_tip.el.attr("id", "keyword_tip");
    		this.keywordF1 = $('<input id="keyword1" class="ipt w140" type="text" maxLength="38" placeholder="' + Can.msg.FORM.KEYWORD + '" value="" name="keywordList">');
    		this.keywordF2 = $('<input id="keyword2" class="ipt w140 ml-out" type="text" maxLength="38" placeholder="' + Can.msg.FORM.KEYWORD + '" value="" name="keywordList">');
    		this.keywordF3 = $('<input id="keyword3" class="ipt w140 ml-out" type="text" maxLength="38" placeholder="' + Can.msg.FORM.KEYWORD + '" value="" name="keywordList">');
    		this.keyword_inner.addItem([this.keywordF1, this.keywordF2, this.keywordF3]);
    		this.keyword_span_help = $('<span class="bg-ico ico-help" cantitle="' + Can.msg.MODULE.PRODUCT_FORM.KEYWORD_1 + '"></span>');
    		this.keywordF1.keyup(function (event) {
    			that.fireEvent('ON_KEYWORD_KEYUP', this.keywordF1);
    		});
    		this.keywordF1.blur(function (event) {
    			that.fireEvent('ON_KEYWORD_KEYUP', this.keywordF1);
    		});
    		this.keywordF2.keyup(function (event) {
    			that.fireEvent('ON_KEYWORD_KEYUP', this.keywordF2);
    		});
    		this.keywordF2.blur(function (event) {
    			that.fireEvent('ON_KEYWORD_KEYUP', this.keywordF2);
    		});
    		this.keywordF3.keyup(function (event) {
    			that.fireEvent('ON_KEYWORD_KEYUP', this.keywordF3);
    		});
    		this.keywordF3.blur(function (event) {
    			that.fireEvent('ON_KEYWORD_KEYUP', this.keywordF3);
    		});
    
    		this.keyword_el_cont.addItem(this.keyword_inner);
    		this.keyword_el_cont.addItem(this.keyword_tip);
    		this.keyword_el.addItem(this.keyword_el_cont);
    		this.keyword_el.addItem(this.keyword_span_help);
    		this.keywordContainer.addItem(this.keyword_el);
            container.addItem(this.keywordContainer);
        },

        /**
         * 初始化产品简介
         */
        fInitProductIntroduction: function(container) {
            var that = this;
    		this.text_shortDescription = new Can.ui.textAreaField({
    			cssName: 'inner',
    			name: 'shortDescription',
    			isRequireEN: false,
    			isCount: true,
    			hasDesc: false,
    			maxLength: 150,
    			blankText: '',
    			width: 469,
    			height: 120
    		});
    		this.text_shortDescription.textarea.keyup(function (event) {
    			that.fireEvent('ON_TEXTAREA_KEYUP', that.text_shortDescription.textarea);
    		});
    		this.introduction_error_tip = new Can.ui.Panel({cssName: 'fm-error hidden ', html: Can.msg.MODULE.PRODUCT_FORM.REQUIRE});
    		this.introduction_error_tip.el.attr("id", "introduction_tip");
    		this.introduction_letter_tip = new Can.ui.Panel({cssName: 'description', html: Can.msg.MODULE.PRODUCT_FORM.LETTER_TIPS});

    		this.introduction_el = new Can.ui.Panel({cssName: 'el'});
    		this.introduction_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.introduction_el_cont.addItem(this.text_shortDescription);
    		this.introduction_el_cont.addItem(this.introduction_error_tip);
    		this.introduction_el.addItem(this.introduction_el_cont);
    		this.introduction_el.addItem(this.introduction_letter_tip);
    		this.introductionNav = new Can.ui.Panel({cssName: 'field f-introd', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.INTRO + '</label>'});
    		this.introductionNav.addItem(this.introduction_el);
            container.addItem(this.introductionNav);
        },

        /**
         * 初始化产品简介
         */
        fInitProductPhoto: function(container, id) {
    		this.uploader = new Can.ui.uploader({
    			id: id || 'addProUploader',
    			cssName: 'attach preview-photo inner',
    			inputName: 'upload-files',
    			btnCss: 'btn btn-s12',
    			btnText: Can.msg.MODULE.PRODUCT_FORM.UPLOAD,
    			width: 70,
    			maxTotal: 6,
    			fileDesc: 'Image Files',
    			fileType: '*.png;*.gif;*.jpg',
    			fileSize: 3,
    			isPreview: true
    		});
    		this.upload_tip_tip = new Can.ui.Panel({wrapEL: 'span', cssName: 'tips-upload', html: Can.msg.MODULE.PRODUCT_FORM.UPLOAD_TIPS});
    		this.uploader.el.prepend(this.upload_tip_tip.el);
    		this.upload_error_tip = new Can.ui.Panel({id: 'upload_tip', cssName: 'fm-error hidden', html: Can.msg.MODULE.PRODUCT_FORM.REQUIRE});
    		this.upload_error_tip.el.css("width", "530px");
    		this.upload_error_tip.applyTo(this.uploader.el);

    		this.upload_el = new Can.ui.Panel({cssName: 'el'});
    		this.upload_el.addItem(this.uploader);
    		this.upload_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.upload_el.addItem(this.upload_el_cont);
    		this.input_hide = $('<input id="product_photos"  type="hidden" name="productImgs" value="" disabled=true>');
    		this.upload_el.addItem(this.input_hide);

    		this.uploadNav = new Can.ui.Panel({cssName: 'field f-upload', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.PHOTO + '</label>'});
    		this.uploadNav.addItem(this.upload_el);
            container.addItem(this.uploadNav);
        },

        /**
         * 初始化是否新产品
         */
        fInitIsNewProduct: function(container) {
    		this.isNewSpan1 = $('<label for="a1">' + Can.msg.MODULE.PRODUCT_FORM.YES + '</label>');
    		this.isNewSpan2 = $('<label for="a2">' + Can.msg.MODULE.PRODUCT_FORM.NO + '</label>');
    		this.isNewPro1 = $('<input id="a1" class="vertical" type="radio" name="newest" value="1">').prependTo(this.isNewSpan1);
    		this.isNewPro2 = $('<input id="a2" class="vertical" type="radio" name="newest" value="0">').prependTo(this.isNewSpan2);
    		this.newProduct_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.newProduct_inner.el.append(this.isNewSpan1).append(this.isNewSpan2);

    		this.newProduct_error_tip = new Can.ui.Panel({cssName: 'fm-error hidden', id: 'newProduct_tip', html: Can.msg.MODULE.PRODUCT_FORM.REQUIRE});
    		this.newProduct_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.newProduct_el_cont.addItem(this.newProduct_inner);
    		this.newProduct_el_cont.addItem(this.newProduct_error_tip);
    		this.newProduct_el = new Can.ui.Panel({cssName: 'el'});
    		this.newProduct_el.addItem(this.newProduct_el_cont);
    		this.newProductNav = new Can.ui.Panel({cssName: 'field f-rdchk', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.NEW_PRODUCT + '</label>'});
    		this.newProductNav.addItem(this.newProduct_el);

    		// 控制红色边框与提示内容同步显示
            var that = this;
    		this.isNewPro1.click(function () {
    			that.fireEvent('hide_newProductTip', this);
    		});
    		this.isNewPro2.click(function () {
    			that.fireEvent('hide_newProductTip', this)
    		});
            container.addItem(this.newProductNav);
        },

        /**
         * 初始化是否私密设置
         */
        fInitProductPrivacy: function(container) {
    		this.privacyStatusInner = new Can.ui.Panel({cssName: 'inner'});
    		this.privacyStatusSpan1 = $('<label for="ps1">' + Can.msg.MODULE.PRODUCT_FORM.OPEN + '</label>');
    		this.privacyStatusSpan2 = $('<label for="ps2">' + Can.msg.MODULE.PRODUCT_FORM.PRIVACY + '</label>');
    		this.privacyStatusPro1 = $('<input id="ps1" class="vertical" type="radio" name="privacyStatus" value="1">')
    			.prependTo(this.privacyStatusSpan1);
    		this.privacyStatusPro2 = $('<input id="ps2" class="vertical" type="radio" name="privacyStatus" value="0">')
    			.prependTo(this.privacyStatusSpan2);
    		this.privacyStatusInner.el.append(this.privacyStatusSpan1)
    			.append(this.privacyStatusSpan2);
    
    		this.privacyStatusEl = new Can.ui.Panel({cssName: 'el'});
    		this.privacyStatusElCont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.privacyStatusElCont.addItem(this.privacyStatusInner);
    		this.privacyStatusErrorTip = new Can.ui.Panel({
    			cssName: 'fm-error hidden',
    			id: 'privacyStatus_tip',
    			html: Can.msg.MODULE.PRODUCT_FORM.REQUIRE
    		});
    		this.privacyStatusElCont.addItem(this.privacyStatusErrorTip);
    		this.privacyStatusEl.addItem(this.privacyStatusElCont);

    		this.privacyStatusNav = new Can.ui.Panel({cssName: 'field f-rdchk', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.PRIVACY_STE + '</label>'});
    		this.privacyStatusNav.addItem(this.privacyStatusEl);
    		this.privacyStatusHelp = $('<span class="bg-ico ico-help" cantitle="' + Can.msg.MODULE.PRODUCT_FORM.PRIVACY_STE_TIPS + '"></span>');
    		this.privacyStatusNav.addItem(this.privacyStatusHelp);
    
    		// 控制红色边框与提示内容同步显示
            var that = this;
    		this.privacyStatusPro1.click(function () {
    			that.fireEvent('hide_privacyStatusTip', this);
    		});
    		this.privacyStatusPro2.click(function () {
    			that.fireEvent('hide_privacyStatusTip', this)
    		});

            container.addItem(this.privacyStatusNav);
        },

        /**
         * 初始化产品分组
         */
        fInitProductGroup: function(container) {
    		this.select_feild = new Can.ui.groupDropDownField({
    			id: 'group_feild',
    			name: 'productGroupId',
    			blankText: Can.msg.MODULE.PRODUCT_FORM.GROUP_PLACE,
    			update_btn_txt: true,
    			btnCss: 'btn btn-s12',
    			btnTxt: Can.msg.MODULE.PRODUCT_FORM.GROUP_TEXT,
    			add_url: Can.util.Config.seller.addProduct.newGroup,
    			keyUp_url: Can.util.Config.seller.addProduct.CHECK_GROUP_NAME
    		});
    		this.group_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.group_inner.addItem(this.select_feild);
    		this.group_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.group_el_cont.addItem(this.group_inner);
    		this.group_el = new Can.ui.Panel({cssName: 'el'});
    		this.group_el.addItem(this.group_el_cont);

    		this.groupNav = new Can.ui.Panel({cssName: 'field', html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.GROUP + '</label>'});
    		this.groupNav.addItem(this.group_el);
            container.addItem(this.groupNav);
        },

        /**
         * 初始化规格描述
         */
        fInitProductDescription: function(container) {
            var that = this;
    		this.SecTitleNav = new Can.ui.Panel({cssName: 'tit-s2'});
    		this.SecTitle_h3 = new Can.ui.Panel({wrapEL: 'h3', html: Can.msg.MODULE.PRODUCT_FORM.TITLE_2});
    		this.SecSpan_h3Inner = new Can.ui.Panel({wrapEL: 'span', cssName: 'exrtip', html: Can.msg.MODULE.PRODUCT_FORM.EXR_TIPS_2});
    		this.SecTitle_h3.addItem(this.SecSpan_h3Inner);
    		this.SecTitleNav.addItem(this.SecTitle_h3);

    		this.SecmodFormNav = new Can.ui.Panel({cssName: 'mod-form-s1'});
    		this.SecFieldEditor = new Can.ui.Panel({cssName: 'field editor', html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.SPEC + '</label>'});
    		this.SecField_el = new Can.ui.Panel({cssName: 'el'});
    		this.SecField_el_count = new Can.ui.Panel({cssName: 'el-cont'});
    		this.SecField_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.kindeditor = new Can.view.kindEditorView({textareaName: 'detailDescription',
                                                           className: 'checktextarea',
                                                           width: 800,
                                                           height: 300,
                                                           afterBlurAction: function() {    
    			                                                that.fireEvent('ON_DETAIL_DESCRIPTION_BLUR', this.SecFieldEditor);
                                                           }
                                                          });
    		this.kindeditor.start();
    		this.SecField_help = $('<span class="bg-ico ico-help" cantitle="' + Can.msg.MODULE.PRODUCT_FORM.DETAIL_1 + '"></span>');
    		this.SecField_inner.addItem(this.kindeditor.el);
    		this.SecField_tip = new Can.ui.Panel({cssName: 'fm-error hidden', id: 'sec_field_tip'});
    		this.SecField_inner.addItem(this.SecField_tip);

    		this.SecField_el_count.addItem(this.SecField_inner);
    		this.SecField_el.addItem(this.SecField_el_count);
    		this.SecField_el.addItem(this.SecField_help);
    		this.SecFieldEditor.addItem(this.SecField_el);
    		this.SecmodFormNav.addItem(this.SecFieldEditor);
    		container.addItem(this.SecTitleNav);
    		container.addItem(this.SecmodFormNav);
        },

        /**
         * 初始化贸易信息标题
         */
        fInitTradeInfoHead: function(container) {
    		this.TheSpan_h3Inner = new Can.ui.Panel({wrapEL: 'span', cssName: 'exrtip', html: Can.msg.MODULE.PRODUCT_FORM.EXR_TIPS_3});
    		this.TheTitle_h3 = new Can.ui.Panel({wrapEL: 'h3', html: Can.msg.MODULE.PRODUCT_FORM.TITLE_3});
    		this.TheTitle_h3.addItem(this.TheSpan_h3Inner);

    		this.TheTitleNav = new Can.ui.Panel({cssName: 'tit-s2'});
    		this.TheTitleNav.addItem(this.TheTitle_h3);
            container.addItem(this.TheTitleNav);
        },

        /**
         * 初始化最小批量
         */
        fInitLeastAmount: function(container) {
    		this.The_quantity = new Can.ui.Panel({cssName: 'field', html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.QUANTITY + '</label>'});
    		this.The_quantity_el = new Can.ui.Panel({cssName: 'el'});
    		this.The_quantity_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.The_quantity_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.The_quantity_inner_eg = $('<input id="quantity_eg" class="ipt w140" type="text" placeholder="e.g. 1000" value="" name="minOrder" maxlength="9">');
    		this.The_quantity_tip = new Can.ui.Panel({cssName: 'hidden', id: 'quantity_tip'});
    		this.The_quantity_dropFeild = new Can.ui.DropDownField({
    			id: 'quantity_ut',
    			blankText: Can.msg.MODULE.PRODUCT_FORM.UNIT,
    			valueItems: [],
    			labelItems: [],
    			name: 'minOrderUnit',
    			cssName: 'select-box ml-out'
    		});
    		this.The_quantity_inner.addItem(this.The_quantity_inner_eg);
    		this.The_quantity_inner.addItem(this.The_quantity_dropFeild);
    		this.The_quantity_el_cont.addItem(this.The_quantity_inner);
    		this.The_quantity_el_cont.addItem(this.The_quantity_tip);
    		this.The_quantity_el.addItem(this.The_quantity_el_cont);
    		this.The_quantity.addItem(this.The_quantity_el);
            container.addItem(this.The_quantity);
        },

        /**
         * 初始化月产量
         */
        fInitProductionPerMonth: function(container) {
    		this.The_supply = new Can.ui.Panel({cssName: 'field', html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.SUPPLY + '</label>'});
    		this.The_supply_el = new Can.ui.Panel({cssName: 'el'});
    		this.The_supply_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.The_supply_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.The_supply_inner_eg = $('<input id="supply_eg" class="ipt w140" type="text" placeholder="e.g. 1000" value="" name="monthSupply" maxlength="9">');
    		this.The_supply_tip = new Can.ui.Panel({cssName: 'hidden', id: 'supply_tip'});
    		this.The_supply_dropFeild = new Can.ui.DropDownField({
    			id: 'supply_ut',
    			blankText: Can.msg.MODULE.PRODUCT_FORM.UNIT,
    			valueItems: [],
    			labelItems: [],
    			name: 'msUnit',
    			cssName: 'select-box ml-out'
    		});
    		this.The_supply_inner.addItem(this.The_supply_inner_eg);
    		this.The_supply_inner.addItem(this.The_supply_dropFeild);
    
    		this.The_supply_el_cont.addItem(this.The_supply_inner);
    		this.The_supply_el_cont.addItem(this.The_supply_tip);
    		this.The_supply_el.addItem(this.The_supply_el_cont);
    		this.The_supply.addItem(this.The_supply_el);
            container.addItem(this.The_supply);
        },

        /**
         * 初始化离岸价格
         */
        fInitOffShorePrice: function(container) {
    		this.The_price = new Can.ui.Panel({cssName: 'field f-fob-price', html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.PRICE + '</label>'});
    		this.The_price_el = new Can.ui.Panel({cssName: 'el'});
    		this.The_price_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.The_price_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.The_price_inner_ut1 = new Can.ui.DropDownField({
    			id: 'price_ut1',
    			blankText: Can.msg.MODULE.PRODUCT_FORM.MONEY_UNIT,
    			name: 'monetaryUnit',
    			valueItems: [],
    			labelItems: [],
    			cssName: 'select-box ml-out'
    		});
    		this.The_feild1 = $('<input id="price_fed2" class="ipt w140 ml-out" type="text" placeholder="" value="" name="fobPriceFrom">');
    		this.splitIcon = $('<i> -- </i>');
    		this.The_feild2 = $('<input id="price_fed3"  class="ipt w140" type="text" placeholder="" value="" name="fobPriceTo">');
    		this.splitTxt = $('<i> ' + Can.msg.MODULE.PRODUCT_FORM.PER + ' </i>');
    		this.The_price_inner_ut2 = new Can.ui.DropDownField({id: 'price_ut2', blankText: Can.msg.MODULE.PRODUCT_FORM.UNIT, cssName: 'select-box ml-out', name: 'fobUnit', valueItems: [], labelItems: [] });
    		this.The_price_inner.addItem(this.The_price_inner_ut1);
    		this.The_price_inner.addItem(this.The_feild1);
    		this.The_price_inner.addItem(this.splitIcon);
    		this.The_price_inner.addItem(this.The_feild2);
    		this.The_price_inner.addItem(this.splitTxt);
    		this.The_price_inner.addItem(this.The_price_inner_ut2);
    		this.The_price_tip = new Can.ui.Panel({cssName: 'hidden', id: 'price_tip'});
    		this.The_price_el_cont.addItem(this.The_price_inner);
    		this.The_price_el_cont.addItem(this.The_price_tip);
    		this.The_price_el.addItem(this.The_price_el_cont);
    		this.The_price.addItem(this.The_price_el);
            container.addItem(this.The_price);
        },

        /**
         * 初始化出货港口
         */
        fInitLoadingPort: function(container) {
            var that = this;
    		this.Fou_feild = $('<input class="w400 ipt" id="lodingpart" type="text" placeholder="' + Can.msg.MODULE.PRODUCT_FORM.LOAD_PORT_BAN_TXT + '" name="startPort">');
    		this.Fou_feild.keyup(function (event) {
    			that.fireEvent('ON_START_PORT_KEYUP', this.Fou_field);
    		});
    		this.Fou_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.Fou_inner.addItem(this.Fou_feild);

    		this.Fou_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.Fou_el_cont.addItem(this.Fou_inner);

    		this.lodingpart_tip = new Can.ui.Panel({cssName: 'fm-error hidden', id: 'lodingpart_tip'});
    		this.Fou_el_cont.addItem(this.lodingpart_tip);
    		this.Fou_el = new Can.ui.Panel({cssName: 'el'});
    		this.Fou_el.addItem(this.Fou_el_cont);

    		this.Fou_loadingPort = new Can.ui.Panel({cssName: 'field', html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.PORT + '</label>'});
    		this.Fou_loadingPort.addItem(this.Fou_el);
            container.addItem(this.Fou_loadingPort);
        },

        /**
         * 初始化付款方式
         */
        fInitPayMethod: function(container) {
    		this.Fir_inner = new Can.ui.Panel({cssName: 'inner'});
    		this.Fir_lc = $('<label for="c1"><input id="c1" class="vertical" type="checkbox" name="payMethods" value="904001">' + Can.msg.MODULE.PRODUCT_FORM.LC + '</label>');
    		this.Fir_tt = $('<label for="c2"><input id="c2" class="vertical" type="checkbox" name="payMethods" value="904002">' + Can.msg.MODULE.PRODUCT_FORM.TT + '</label>');
    		this.Fir_dp = $('<label for="c3"><input id="c3" class="vertical" type="checkbox" name="payMethods" value="904003">' + Can.msg.MODULE.PRODUCT_FORM.DP + '</label>');
    		this.Fir_mg = $('<label for="c4"><input id="c4" class="vertical" type="checkbox" name="payMethods" value="904004">' + Can.msg.MODULE.PRODUCT_FORM.MG + '</label>');
    		this.Fir_cc = $('<label for="c5"><input id="c5" class="vertical" type="checkbox" name="payMethods" value="904005">' + Can.msg.MODULE.PRODUCT_FORM.CC + '</label>');
    		this.Fir_pa = $('<label for="c6"><input id="c6" class="vertical" type="checkbox" name="payMethods" value="904006">' + Can.msg.MODULE.PRODUCT_FORM.PP + '</label>');
    		this.Fir_wu = $('<label for="c7"><input id="c7" class="vertical" type="checkbox" name="payMethods" value="904007">' + Can.msg.MODULE.PRODUCT_FORM.WU + '</label>');
    		this.Fir_ca = $('<label for="c8"><input id="c8" class="vertical" type="checkbox" name="payMethods" value="904008">' + Can.msg.MODULE.PRODUCT_FORM.CA + '</label>');
    		this.Fir_es = $('<label for="c9"><input id="c9" class="vertical" type="checkbox" name="payMethods" value="904009">' + Can.msg.MODULE.PRODUCT_FORM.ES + '</label>');
    		this.Fir_ot = $('<label for="c999"><input id="c999" class="vertical" type="checkbox" name="payMethods" value="904999">' + Can.msg.MODULE.PRODUCT_FORM.OT + '</label>');
    		this.Fir_inner.addItem(this.Fir_lc);
    		this.Fir_inner.addItem(this.Fir_tt);
    		this.Fir_inner.addItem(this.Fir_dp);
    		this.Fir_inner.addItem(this.Fir_mg);
    		this.Fir_inner.addItem(this.Fir_cc);
    		this.Fir_inner.addItem(this.Fir_pa);
    		this.Fir_inner.addItem(this.Fir_wu);
    		this.Fir_inner.addItem(this.Fir_ca);
    		this.Fir_inner.addItem(this.Fir_es);
    		this.Fir_inner.addItem(this.Fir_ot);
    
    
    		this.Fir_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
    		this.Fir_el_cont.addItem(this.Fir_inner);
    		this.Fir_el = new Can.ui.Panel({cssName: 'el'});
    		this.Fir_el.addItem(this.Fir_el_cont);
    		this.Fir_payment = new Can.ui.Panel({cssName: 'field f-rdchk', html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.PAYMENT + '</label>'});
    		this.Fir_payment.addItem(this.Fir_el);
            container.addItem(this.Fir_payment);
        },

        /**
         * 初始化敏感词标志位
         */
        fInitSensitiveWord: function(container) {
    		this.sensitiveWord = $('<input class="w400 ipt hidden" type="text" name="validateStatus" value="1" />');
    		container.addItem(this.sensitiveWord);
        },

        /**
         * 初始化提交说明
         */
        fInitSubmitTip: function(container) {
    		this.tips_sure = new Can.ui.Panel({wrapEL: 'p', cssName: 'tips-s5', html: Can.msg.MODULE.PRODUCT_FORM.TIPS});
    		container.addItem(this.tips_sure);
        },

        /**
         * 初始化提交按钮
         */
        fInitSubmitBtn: function(container) {
            var that = this;
    		this.save_btn = new Can.ui.toolbar.Button({text: Can.msg.MODULE.PRODUCT_FORM.SAVE, cssName: 'btn btn-s11', id: 'submitBtnId'});
    		this.save_btn.click(function(event) {
    			if (this.el.hasClass("dis")) {
    				return false;
    			}
    			that.fireEvent('ON_SAVE_CLICK', this);
    		});
    		container.addItem(this.save_btn);
        },

        /**
         * 显示敏感词弹出框
         * @param {String} sMessage 敏感词
         * @param {Function} fCallback 强制提交的回调方法
         */
        fShowSensitiveWord: function(sMessage, fCallback) {
            var that = this;
            var confirm = new Can.view.confirmWindowView({
                width: 280
            });
            confirm.setContent('<div class="error-box">' + Can.msg.MODULE.PRODUCT_FORM.SENSITIVE_WORD.replace('@', sMessage) + '</div>');
            confirm.onOK(function() {
                that.sensitiveWord.val(0);
                if (fCallback) fCallback();
            });
            confirm.show();
        },

        /**
         * 显示重名弹出框
         */
        fShowDoubleName: function() {
            var win = new Can.view.alertWindowView({
                width: 280
            });
            var content = new Can.ui.Panel({
                cssName: 'error-box',
                html: Can.msg.MODULE.PRODUCT_FORM.SAME_NAME
            });
            win.setContent(content);
            win.show();
        },

        /**
         * 校验敏感词以及重名
         * @param {String} sPostData 表单提交数据
         * @param {Function} fBeforeSend 提交校验前 
         * @param {Function} fAfterSend 提交校验后
         * @param {Function} fCallback 强制提交的回调方法
         */
        fValideSensitiveWord: function(sPostData, fBeforeSend, fAfterSend, fCallback) {
            //补丁，第一次添加产品时没有产品描述，后期手动添加上;
            if(sPostData.indexOf('detailDescription=&') != -1) {
                var siteLen =  sPostData.indexOf('detailDescription=') + 'detailDescription='.length;
                sPostData = sPostData.slice(0, siteLen) + encodeURIComponent($('textarea[name="detailDescription"]').text()) + sPostData.slice(siteLen)
            }
             var that = this;
             $.ajax({
                url: Can.util.Config.seller.addProduct.valideSensitiveWord,
                data: sPostData,
                type: 'POST',
                beforeSend: function() {
                    fBeforeSend();
                },
                success: function(result) {
                    fAfterSend();
                    if (result.status == "success") {
                        if (fCallback) fCallback();
                    } else {
                        if (result.errorCode === '3005') {
                            that.fShowSensitiveWord(result.data.sensitiveword, fCallback);
                        } else if (result.errorCode === '3006') {
                            that.fShowDoubleName();
                        } else {
                            var i;
                            for (i in result.data) {
                                result.message += '<br> ' + i + ': ' + result.data[i];
                            }
                            that.save_btn.el.removeClass('dis');
                            Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', that, result);
                        }
                    }
                }
            });
        },

    	setFobPrice: function() {
    		var that = this;
    		$("#price_fed2").keyup(function() {
    			var price1 = that.The_feild1.val();
    			that.The_feild2.attr("placeholder", price1);
    		});
    		$("#price_fed3").keyup(function() {
    			var price2 = that.The_feild2.val();
    			that.The_feild1.attr("placeholder", price2);
    		});
    	},

    	onUploadError: function(fFn) {
    		if (typeof fFn === 'function') {
    			this.uploader.on('ON_UPLOAD_ERROR', fFn);
    		}
    	},

    	uploaderReady: function() {
    		this.uploader.startUploader();
    	},

    	onUploadSuccess: function(fFn) {
    		if (typeof fFn === 'function') {
    			this.uploader.on('ON_UPLOAD_SUCCESS', fFn);
    		}
    	},

        cleanFormData: function() {
            var that = this;

            // 重置产品名称
			that.product_id.val('');
			that.pdt_feildtxt.val('');

            // 重置型号
            that.modelFeildTxt.val('');

            //视屏url
            this.videoUrl.val('');

            // 重置分类
			that.category_feild.setValue('');
			that.category_feild.el.find("em").text('');
            
            //重置主词
            that.primaryKeyword.val('');

            // 重置关键字
            that.keywordContainer.el.find('input[type=text]').val('');

            // 重置简介
			that.text_shortDescription.setValue('');

            // 重置产品图片
            that.uploader.success.files = {};
			that.uploader.pushFiles([]);

            // 重置是否新产品
			that.isNewPro1.prop("checked", false);
			that.isNewPro2.prop("checked", false);
            
            // 重置私密设置
		    that.privacyStatusPro1.attr("checked", false);
			that.privacyStatusPro2.attr("checked", false);

            // 重置分组 
			that.select_feild.setValue('');
			that.select_feild.el.find("em").text(Can.msg.MODULE.PRODUCT_FORM.GROUP_PLACE);

			// 重置规格描述
			that.kindeditor.editor.html('');

            // 重置最小批量
			that.The_quantity_inner_eg.val('');
            that.The_quantity_dropFeild.selectValue(0);

			// 重置月产量
			that.The_supply_inner_eg.val('');
            that.The_supply_dropFeild.selectValue(0);

			// 重置离岸价格
			that.The_feild1.val('');
            that.The_price_inner_ut1.selectValue(0);
			that.The_feild2.val('');
            that.The_price_inner_ut2.selectValue(0);

			// 重置出货港口
			that.Fou_feild.val('');

			// 重置付款方式
			that.Fir_inner.el.find("input[type=checkbox]").prop("checked", false);
        }
    });
    
    Can.module.addProductModule = Can.extend(Can.module.addProductBaseModule, {
    	id: 'addProductModuleId',
    	actionJs: ['js/seller/action/addProductModuleAction.js', 'js/framework/jquery/jquery.validate.js'],
    	constructor: function(cfg) {
    		Can.apply(this, cfg || {});
    		Can.module.addProductModule.superclass.constructor.call(this);
    		this.addEvents('ON_PRODUCT_NAME', 'ON_PRODUCT_MODEL', 'ON_SAVE_CLICK', 'ON_SUBMIT_SUCCESS');
    	},
    	startup: function(addProduct) {
    		Can.module.addProductModule.superclass.startup.call(this);
    		var that = this;
    		this.modForm = new Can.ui.Panel({cssName: 'mod-form-s1'});

            // 初始化提示栏
            this.fInitTips();

    		// 基本信息
    		this.partOneNav = new Can.ui.Panel({cssName: 'mod-add-part'});
            this.fInitBaseInfoHead(this.partOneNav);
    		// 产品名称
            this.fInitProductName(this.modForm);
            // 型号
            this.fInitProductModel(this.modForm);
            // 产品分类
            this.fInitProductCategory(this.modForm);
            // 主词
            this.fInitProductPrimaryKeyword(this.modForm);
    		// 关键词
    		this.fInitProductKeyword(this.modForm);
            // 简介
    		this.fInitProductIntroduction(this.modForm);
    		//视屏URl
    		this.fInitProductVideoUrl(this.modForm);
            // 产品图片
            this.fInitProductPhoto(this.modForm);
            // 是否新产品
    		this.fInitIsNewProduct(this.modForm);
            // 私密设置
            this.fInitProductPrivacy(this.modForm);
            // 分组
            this.fInitProductGroup(this.modForm);
    		this.partOneNav.addItem(this.modForm);
    
    		// 规格描述
    		this.partSecNav = new Can.ui.Panel({cssName: 'mod-add-part'});
            this.fInitProductDescription(this.partSecNav);
    
    		// 贸易信息
    		this.partTheNav = new Can.ui.Panel({cssName: 'mod-add-part'});
            // 标题
            this.fInitTradeInfoHead(this.partTheNav);
    		this.ThemodFormNav = new Can.ui.Panel({cssName: 'mod-form-s1'});
    		// 最小批量
            this.fInitLeastAmount(this.ThemodFormNav);
    		// 月产量
            this.fInitProductionPerMonth(this.ThemodFormNav);
    		// 离岸价格
            this.fInitOffShorePrice(this.ThemodFormNav);
    		// 出货港口
            this.fInitLoadingPort(this.ThemodFormNav);
            // 敏感词
            this.fInitSensitiveWord(this.ThemodFormNav);
    		// 付款方式
            this.fInitPayMethod(this.ThemodFormNav);
    		this.partTheNav.addItem(this.ThemodFormNav);
    
    		// TIP
    		this.actionNav = new Can.ui.Panel({cssName: 'actions'});
            this.fInitSubmitTip(this.actionNav);
            // 提交按钮
            this.fInitSubmitBtn(this.actionNav);
    
    		// 组装主容器
    		this.product_con = new Can.ui.Panel({cssName: 'product-add'});
    		this.product_con.addItem(this.partOneNav);
    		this.product_con.addItem(this.partSecNav);
    		this.product_con.addItem(this.partTheNav);
    		this.product_con.addItem(this.actionNav);

    		// 表单
    		this.addProductFrom = $('<form id="addProductFromId" name="addProductFrom"></form>');
    		this.addProductFrom.append(this.product_con.el);
    		this.addProductFrom.appendTo(this.contentEl);
    		this.kindeditor.showEditer();
    	},

	    show: function() {
    		Can.module.addProductModule.superclass.show.call(this);
            this.cleanFormData();
	    },

    	setData: function() {
    		var that = this;
    		$.ajax({
    			url: Can.util.Config.seller.addProduct.UNIT,
    			data: null,
    			type: "POST",
    			success: function(result) {
    				if (result.status === "success") {
    					// 清空页面的下拉列表内容
    					that.The_quantity_dropFeild.labelItems.length = 0;
    					that.The_quantity_dropFeild.valueItems.length = 0;
    					that.The_quantity_dropFeild.labelItems.push(Can.msg.MODULE.PRODUCT_FORM.UNIT);
    					that.The_quantity_dropFeild.valueItems.push("");
    
    					that.The_supply_dropFeild.labelItems.length = 0;
    					that.The_supply_dropFeild.valueItems.length = 0;
    					that.The_supply_dropFeild.labelItems.push(Can.msg.MODULE.PRODUCT_FORM.UNIT);
    					that.The_supply_dropFeild.valueItems.push('');
    
    					that.The_price_inner_ut1.labelItems.length = 0;
    					that.The_price_inner_ut1.valueItems.length = 0;
    					that.The_price_inner_ut1.labelItems.push(Can.msg.MODULE.PRODUCT_FORM.MONEY_UNIT);
    					that.The_price_inner_ut1.valueItems.push("");
    
    					that.The_price_inner_ut2.labelItems.length = 0;
    					that.The_price_inner_ut2.valueItems.length = 0;
    					that.The_price_inner_ut2.labelItems.push(Can.msg.MODULE.PRODUCT_FORM.UNIT);
    					that.The_price_inner_ut2.valueItems.push("");
    
    					that.select_feild.labelItems.length = 0;
    					that.select_feild.valueItems.length = 0;

    					// 设置四个单位下拉列表内容
    					for (var q = 0; q < result.data.orderUtils.length; q++) {
    						that.The_quantity_dropFeild.labelItems.push(result.data.orderUtils[q].name);
    						that.The_quantity_dropFeild.valueItems.push(result.data.orderUtils[q].code);
    					}
    					that.The_quantity_dropFeild.updateOptions();

    					for (var q = 0; q < result.data.orderUtils.length; q++) {
    						that.The_supply_dropFeild.labelItems.push(result.data.orderUtils[q].name);
    						that.The_supply_dropFeild.valueItems.push(result.data.orderUtils[q].code);
    					}
    					that.The_supply_dropFeild.updateOptions();

    					for (var i = 0; i < result.data.monetayUtils.length; i++) {
    						that.The_price_inner_ut1.labelItems.push(result.data.monetayUtils[i].name);
    						that.The_price_inner_ut1.valueItems.push(result.data.monetayUtils[i].code);
    					}
    					that.The_price_inner_ut1.updateOptions();

    					for (var q = 0; q < result.data.orderUtils.length; q++) {
    						that.The_price_inner_ut2.labelItems.push(result.data.orderUtils[q].name);
    						that.The_price_inner_ut2.valueItems.push(result.data.indivOrderUtils[q].code);
    					}
    					that.The_price_inner_ut2.updateOptions();

    					for (var q = 0; q < result.data.productGroups.length; q++) {
    						that.select_feild.labelItems.push(result.data.productGroups[q].groupName);
    						that.select_feild.valueItems.push(result.data.productGroups[q].groupId);
    					}
    					that.select_feild.updateOptions();

                        // 清空上传组件内容
                        that.uploader.success.files = {};
    				} else {
    					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, result);
    				}
    			}
    		});
    	}
    });

})();
