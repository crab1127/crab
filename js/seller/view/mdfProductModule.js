/**
 * 编辑产品模块
 * @Author: lvjw
 * @Update: 14-01-24
 */
Can.importJS(['js/seller/view/addProductModule.js']);
Can.module.mdfProductModule = Can.extend(Can.module.addProductBaseModule, {
	id: 'mdfProductModuleId',
	actionJs: ['js/seller/action/mdfProductModuleAction.js', 'js/framework/jquery/jquery.validate.js'],
	constructor: function(cfg) {
		Can.apply(this, cfg || {});
		Can.module.mdfProductModule.superclass.constructor.call(this);
		this.addEvents('ON_PRODUCT_NAME', 'ON_SAVE_CLICK', 'ON_BACK_CLICK');
	},

	startup: function() {
    	Can.module.mdfProductModule.superclass.startup.call(this);
    	var that = this;
    	this.modForm = new Can.ui.Panel({cssName: 'mod-form-s1'});

         // 用户是否修改表单 
         this._isChangeForm = false;
         this.contentEl.on('change', 'form [name]', function() {
             that._isChangeForm = true;
         });

         // 返回按钮
         this.backBtn = new Can.ui.toolbar.Button({
             id: 'backBtnId',
             cssName: 'btn-back'
         });
         this.backBtn.el.attr('cantitle', Can.msg.CAN_TITLE.BACK);
         this.fncContainer.addItem(this.backBtn);
         this.backBtn.click(function() {
             that.fireEvent('onBackClick');
         });

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
        //主词
        this.fInitProductPrimaryKeyword(this.modForm);
    	// 关键词
    	this.fInitProductKeyword(this.modForm);
        // 简介
    	this.fInitProductIntroduction(this.modForm);
    	//视屏链接
    	this.fInitProductVideoUrl(this.modForm);
        // 产品图片
        this.fInitProductPhoto(this.modForm, 'mdfProUploader');
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
    	this.mdfProductFrom = $('<form id="mdfProductFromId" name="mdfProductFrom"></form>');
    	this.mdfProductFrom.append(this.product_con.el);
    	this.mdfProductFrom.appendTo(this.contentEl);
    	this.kindeditor.showEditer();

        // 初始化上传组件
	    that.onUploadSuccess(function(oFile, jStatus) {
	    	that.input_hide.val(that.uploader.getFileNameList());
	    });
        that.onUploadError(function (file, code) {
            that.upload_error_tip.el.text(Can.msg.ERROR_TEXT[code]);
            that.upload_error_tip.el.removeClass("hidden");
        });

        that.uploaderReady();
	},

	show: function() {
    	Can.module.mdfProductModule.superclass.show.call(this);
        this.cleanFormData();
	},

	setData: function(nProId) {
		var that = this;
		$.ajax({
			url: Can.util.Config.seller.manageProduct.MODIFY,
			data: {productId: nProId},
			success: function(result) {
				if (result.status === "success") {
					// 清空页面上的下拉列表内容
					that.The_quantity_dropFeild.labelItems.length = 0;
					that.The_quantity_dropFeild.valueItems.length = 0;
					that.The_quantity_dropFeild.labelItems.push(Can.msg.MODULE.PRODUCT_FORM.UNIT);
					that.The_quantity_dropFeild.valueItems.push("");

					that.The_supply_dropFeild.labelItems.length = 0;
					that.The_supply_dropFeild.valueItems.length = 0;
					that.The_supply_dropFeild.labelItems.push(Can.msg.MODULE.PRODUCT_FORM.UNIT);
					that.The_supply_dropFeild.valueItems.push("");

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

                    // 设置产品名称
					if (result.data.product.productId && !that.isCopyAction) {
						that.product_id.val(result.data.product.productId);
					}
					if (result.data.product.productName) {
                        if(that.isCopyAction) result.data.product.productName = result.data.product.productName+'-copy';
						that.pdt_feildtxt.val(result.data.product.productName);
					}

                    // 设置型号
                    if (result.data.product.model) {
                        that.modelFeildTxt.val(result.data.product.model);
                    }                   
                    
                    //设置视屏链接
                    if(result.data.product.videoUrl){
                    	that.videoUrl.val(result.data.product.videoUrl);
                    }

                    // 设置分类
					if (result.data.product.categoryName) {
						that.category_feild.setValue(result.data.product.categoryId);
						that.category_feild.el.find("em").text(result.data.product.categoryName);
					}
												
					// 设置主词
					if (result.data.product.primaryKeyword) {
						that.primaryKeyword.val(result.data.product.primaryKeyword);
					}

                    // 设置关键字
					if (result.data.product.keywords.length > 0) {
						for (var k = 0; k < result.data.product.keywords.length; k++) {
							var kf = 'that.keywordF' + (k + 1);
                            var _keywordObj = eval(kf);
							if (_keywordObj) {
                                _keywordObj.val(result.data.product.keywords[k]);
                            }
						}
					}

                    // 设置简介
					if (result.data.product.shortDescription) {
					    that.text_shortDescription.setValue(result.data.product.shortDescription);
					}

                    // 设置产品图片
					if (result.data.product.productImgs.length > 0) {
						var _i = [];
						var _u = [];
						for (i = 0; i < result.data.product.productImgs.length; i++) {
							_u.push({
								fileName: result.data.product.productImgs[i].url,
								fileFullName: result.data.product.productImgs[i].abslouteUrl,
								title: ''
							});
							_i.push(result.data.product.productImgs[i].url);
						}
                        that.uploader.success.files = {};
						that.uploader.pushFiles(_u);
					}

                    // 设置是否新产品
					if (result.data.product.newest == 0) {
						that.isNewPro2.attr("checked", true);
					} else {
						that.isNewPro1.attr("checked", true);
					}

                    // 设置私密设置
					if (result.data.product.privacyStatus == 1) {
						that.privacyStatusPro1.attr("checked", true);
					} else {
						that.privacyStatusPro2.attr("checked", true);
					}

					// 设置规格描述
					if (result.data.product.detailDescription) {
						that.kindeditor.html(result.data.product.detailDescription);
					}

					// 设置最小批量
					if (result.data.product.minOrder) {
						that.The_quantity_inner_eg.val(result.data.product.minOrder);
					}
					if (result.data.product.minOrderUnit) {
						for (var moq = 0; moq < that.The_quantity_dropFeild.valueItems.length; moq++) {
							if (that.The_quantity_dropFeild.valueItems[moq] == result.data.product.minOrderUnit) {
								that.The_quantity_dropFeild.setValue(that.The_quantity_dropFeild.valueItems[moq]);
								that.The_quantity_dropFeild.el.find("em").text(that.The_quantity_dropFeild.labelItems[moq]);
							}
						}
					}

					// 设置月产量
					if (result.data.product.monthSupply) {
						that.The_supply_inner_eg.val(result.data.product.monthSupply);
					}
					if (result.data.product.msUnit) {
						for (var moq = 0; moq < that.The_supply_dropFeild.valueItems.length; moq++) {
							if (that.The_supply_dropFeild.valueItems[moq] == result.data.product.msUnit) {
								that.The_supply_dropFeild.setValue(that.The_supply_dropFeild.valueItems[moq]);
								that.The_supply_dropFeild.el.find("em").text(that.The_supply_dropFeild.labelItems[moq]);
							}
						}
					}

					// 设置离岸价格
					if (result.data.product.monetaryUnit) {
						for (var moq = 0; moq < that.The_price_inner_ut1.valueItems.length; moq++) {
							if (that.The_price_inner_ut1.valueItems[moq] == result.data.product.monetaryUnit) {
								that.The_price_inner_ut1.setValue(that.The_price_inner_ut1.valueItems[moq]);
								that.The_price_inner_ut1.el.find("em").text(that.The_price_inner_ut1.labelItems[moq]);
							}
						}
					}
					if (result.data.product.fobUnit) {
						for (var moq = 0; moq < that.The_price_inner_ut2.valueItems.length; moq++) {
							if (that.The_price_inner_ut2.valueItems[moq] == result.data.product.fobUnit) {
								that.The_price_inner_ut2.setValue(that.The_price_inner_ut2.valueItems[moq]);
								that.The_price_inner_ut2.el.find("em").text(that.The_price_inner_ut2.labelItems[moq]);
							}
						}
					}
					if (result.data.product.groupId) {
						that.select_feild.setValue(result.data.product.groupId);
					}
					if (result.data.product.fobPriceFrom) {
						that.The_feild1.val(result.data.product.fobPriceFrom);
					}
					if (result.data.product.fobPriceTo) {
						that.The_feild2.val(result.data.product.fobPriceTo);
					}

					// 设置出货港口
					if (result.data.product.startPort) {
						that.Fou_feild.val(result.data.product.startPort);
					}

					// 设置付款方式
					if (result.data.product.payMethods) {
						for (var moq = 0; moq < result.data.product.payMethods.length; moq++) {
							var val = result.data.product.payMethods[moq];
							that.Fir_inner.el.find("input[value=" + val + "]").attr("checked", true);
						}
					}
				} else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, result);
				}
			}
		});
	},

	routeMark: function (sId) {
		if (this._oRoutArgs.id) {
			Can.Route.mark(this.id, this._oRoutArgs);
		}
	},

	runByRoute: function () {
        if(typeof this._oRoutArgs.copy !== 'undefined'){
            this.isCopyAction = parseInt(this._oRoutArgs.copy);
        }

		if (this._oRoutArgs.id) {
			this.updateTitle(this._oRoutArgs.title);
			this.setData(this._oRoutArgs.id);
		}
	}
});
