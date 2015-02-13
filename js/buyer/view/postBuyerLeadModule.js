
/**
 * @Author: sam
 * @version: v1.2
 * @since:13-2-18
 */
Can.module.postBuyerLeadModule = Can.extend(Can.module.BaseModule, {
	id: 'postBuyerLeadModuleID',
	startup: function () {
        window.open(Can.util.Config.EN.url.postBuyinglead);

    }
});
/*Can.module.postBuyerLeadModule = Can.extend(Can.module.BaseModule, {*/
	//id: 'postBuyerLeadModuleID',
	//title: Can.msg.POST_BUYING_LEAD.TITLE,
    //contForm: null,
	//actionUrl: null,
	//formOptions: {},
	//actionJs: ['js/buyer/action/postBuyerLeadModuleAction.js', 'js/framework/jquery/jquery.validate.js','js/utils/windowView.js'],
	//constructor: function (cfg) {
		//Can.apply(this, cfg || {});
		//Can.module.postBuyerLeadModule.superclass.constructor.call(this);

		//this.addEvents('ON_PRODUCT_BLUR', 'ON_PRODUCT_KEYUP', 'submitBtnClick');
	//},
	//startup: function () {
        //window.open(Can.util.Config.EN.url.postBuyinglead);
        //return;
		//Can.module.postBuyerLeadModule.superclass.startup.call(this);
		//var me = this
			//, buyinglead
			//;

		//$.ajax({
			//url: Can.util.Config.buyer.blManageModule.detailTemplate,
			//data: {
				//buyingLeadId: this.editId
			//},
			//async: false,
			//success: function (d) {
				//me.formOptions = d['data'];
				//buyinglead = me.formOptions.buyinglead || {};
			//}
		//});

		//// 发布流程提示
		//this.postTips = new Can.ui.Panel({
			//cssName: 'post-tips',
			//id: 'postTips',
			//html: '<a class="post-tips-close" href="javascript:"></a>'
		//});
		//var $postTips = this.postTips.el;

		//$postTips.find(".post-tips-close").click(function () {
			//$postTips.slideUp(200);
		//});

		//this.postTips.$learnMore = $('<a class="post-tips-learn" href="/leadexpress.html" target="_blank">Learn More &gt;&gt;</a>');
		//this.postTips.$progress = $('<ul class="post-tips-progress"></ul>');
		//this.postTips.$progress.append($('<li class="ptp-li1"><div class="ptp-pic post-bg"></div><div class="ptp-head">' + Can.msg.BUTTON.TOP_BAR_2.POST_BL + '</div><div class="ptp-content">Tell us what you need</div></li>'));
		//this.postTips.$progress.append($('<li class="ptp-li2"><div class="ptp-pic post-bg"></div></li>'));
		//this.postTips.$progress.append($('<li class="ptp-li3"><div class="ptp-pic post-bg"></div><div class="ptp-head">Get Recommendations</div><div class="ptp-content">Get recommendations by email</div></li>'));
		//this.postTips.$progress.append($('<li class="ptp-li4"><div class="ptp-pic post-bg"></div></li>'));
		//this.postTips.$progress.append($('<li class="ptp-li5"><div class="ptp-pic post-bg"></div><div class="ptp-head">Receive Feedbacks</div><div class="ptp-content">Check the feedbacks by email or e-cantonfair.com</div></li>'));

		//this.postTips.addItem(this.postTips.$learnMore);
		//this.postTips.addItem(this.postTips.$progress);

		//this.postTips.applyTo(this.contentEl);

		////第一行提示栏容器
		//this.tips4_nav = new Can.ui.Panel({
			//wrapEL: 'div',
			//cssName: 'tips-s4',
			//id: 'tips4',
			//html: '<span class="post-bg"></span>'
		//});
		////提示栏内容
		//this.inner_des = new Can.ui.Panel({
			//cssName: 'des',
			//html: Can.msg.MODULE.PRODUCT_FORM.TIP
		//});
		//this.tips4_nav.addItem(this.inner_des);
		////添加到容器
		//this.tips4_nav.applyTo(this.contentEl);
		////product-add容器
		//this.product_con = new Can.ui.Panel({
			//cssName: 'product-add',
			//wrapEL: 'form'
		//});
		//this.node = {
			//form: this.product_con.el
		//};

		////第一部分内容容器
		//this.partOneNav = new Can.ui.Panel({cssName: 'mod-add-part'});

		//var getLabel = function (key, data) {
			//var i, item;

			//if (!key) {
				//return '';
			//}
			//for (i = 0; i < data.length; i++) {
				//item = data[i];

				//if (item.code === key) {
					//return item.name;
				//}
			//}
			//return null;
		//};
		//var getValue = function (key) {
			//return buyinglead[key] || '';
		//};
		////第一部分内容2
		//var productName_value = getValue('productName')
			//, category_value = getValue('categoryId')
			//, description_value = getValue('description')
			//, purchaseQuantity_value = getValue('buyingAmt')
			//;

		//this.modForm = new Can.ui.Panel({cssName: 'mod-form-s1'});
		//this.pdt_nam = new Can.ui.Panel({
			//cssName: 'field',
			//html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.POST_BUYING_LEAD.PRODUCT_NAME + '</label>'
		//});
		//this.pdt_feild = new Can.ui.Panel({cssName: 'el'});
		//this.pdt_feild_span = $('<span class="bg-ico ico-help" cantitle="' + Can.msg.MODULE.PRODUCT_FORM.PN_1 + '"></span>');
		//this.pdt_feildINnerNav = new Can.ui.Panel({cssName: 'el-cont'});
		//this.pdt_feildContainer = new Can.ui.Panel({cssName: 'inner'});
		//this.pdt_feildtxt = $('<input class="w400 ipt" type="text" placeholder="Please Enter Product Name" name="productName" value="' + productName_value + '">');//bd1
		//// this.fm_editNav = new Can.ui.Panel({id: 'tipNav', cssName: 'fm-edit hidden', html: Can.msg.MODULE.PRODUCT_FORM.COUNT_LETTER});
		//this.fm_editNav = new Can.ui.Panel({
			//id: 'tipNav',
			//cssName: 'error-holder'
		//});
		//this.pdt_feildtxt.blur(function (event) {
			//me.fireEvent('ON_PRODUCT_BLUR', me.pdt_feildtxt);
		//});
		//this.pdt_feildtxt.keyup(function (event) {
			//me.fireEvent('ON_PRODUCT_KEYUP', me.pdt_feildtxt);
		//});

		//this.pdt_feildtxt.appendTo(this.pdt_feildContainer.el);
		//this.pdt_feildINnerNav.addItem(this.pdt_feildContainer);
		//this.pdt_feildINnerNav.addItem(this.fm_editNav);
		//this.pdt_feild.addItem(this.pdt_feildINnerNav);
		//this.pdt_feild.addItem(this.pdt_feild_span);
		//this.pdt_nam.addItem(this.pdt_feild);

		//this.OneCategoryNav = new Can.ui.Panel({
			//cssName: 'field f-category',
			//html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.MODULE.PRODUCT_FORM.CATEGORY + '</label>'
		//});
		//this.category_el = new Can.ui.Panel({cssName: 'el'});
		//this.category_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.category_inner = new Can.ui.Panel({cssName: 'inner'});
		//this.category_tip = new Can.ui.Panel({
			//cssName: 'error-holder',
			//id: 'category_tip'
		//});
		//var sCatBlankText = getValue('categoryName') || Can.msg.MODULE.SEARCH.SEL_INDUSTRY;
		//this.category_feild = new Can.ui.DropDownField({
			//cssName: 'select-box',
			//name: 'categoryId',
			//value: category_value,
			//blankText: sCatBlankText
		//});
		//this.category_feild.click(function () {
			////show category selector
			//var _normal = [];
			//if (me.category_feild.valueField.val()) {
				//var aVal = me.category_feild.valueField.val().split(',');
				//var aTxt = me.category_feild.labelEL.text().split(';');
				//for (var i = 0; i < aVal.length; i++) {
					//_normal.push({
						//id: aVal[i],
						//text: aTxt[i]
					//});
				//}
			//}
			//var _config = {
				//maxSelect: 1,
				//target: me.category_feild.valueField,
				//normalValue: _normal
			//};
			//var _onSave = function (sIds, sValues) {
				//me.category_feild.labelEL.text(sValues);
				//me.category_feild.valueField.valid();
			//};
			//Can.util.canInterface('categorySelector', [_config, _onSave]);
		//});

		//this.category_inner.addItem(this.category_feild);
		//this.category_el_cont.addItem(this.category_inner);
		//this.category_el_cont.addItem(this.category_tip);
		//this.category_el.addItem(this.category_el_cont);
		//this.OneCategoryNav.addItem(this.category_el);

		////第一部分内容4
		//this.introductionNav = new Can.ui.Panel({
			//cssName: 'field f-introd',
			//html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.POST_BUYING_LEAD.DETAIL + '</label>'
		//});
		//this.introduction_el = new Can.ui.Panel({cssName: 'el'});
		//this.introduction_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		////bd3
		//// this.introduction_inner = new Can.ui.Panel({cssName:'inner', html:'<textarea class="ipt" id="introduction_area" rows="" cols="" name=""></textarea>'});
		//this.introduction_inner = $('<textarea class="ipt" id="introduction_area" rows="" cols="" name="description">' + description_value + '</textarea>');
		//this.introduction_inner.keyup(function (event) {
			//var $this = $(this);

			//if ($this.val().length > 10) {
				//if ($this.valid()) {
					//$this.removeClass('a-error');
					//me.introduction_error_tip.el.addClass('hidden');
				//} else {
					//$this.addClass('a-error');
					//me.introduction_error_tip.el.removeClass('hidden');
				//}
			//}
		//});
		//this.introduction_inner.blur(function (event) {
			//var $this = $(this);

			//if ($this.valid()) {
				//$this.removeClass('a-error');
				//me.introduction_error_tip.el.addClass('hidden');
			//} else {
				//$this.addClass('a-error');
				//me.introduction_error_tip.el.removeClass('hidden');
			//}
		//});

		//this.introduction_error_tip = new Can.ui.Panel({
			//cssName: 'error-holder',
			//id: 'introduction_tip'
		//});
		//this.introduction_letter_tip = new Can.ui.Panel({
			//cssName: 'description',
			//html: Can.msg.POST_BUYING_LEAD.LETTER_TIPS + '&nbsp;&nbsp;<span class="bg-ico ico-help" cantitle="you can include <br> &nbsp;&nbsp;- Exact Product Name<br>&nbsp;&nbsp;- Size/Dimension<br>&nbsp;&nbsp;- Grade/Quality Standard <br>&nbsp;&nbsp;- Material <br> &nbsp;&nbsp;- Application <br> &nbsp;&nbsp;- Packaging/Packing <br> &nbsp;&nbsp;- Any other special factors you care about"></span>'
		//});
		//this.introduction_el_cont.addItem(this.introduction_inner);
		//this.introduction_el_cont.addItem(this.introduction_error_tip);
		//this.introduction_el.addItem(this.introduction_el_cont);
		//this.introduction_el.addItem(this.introduction_letter_tip);
		//this.introductionNav.addItem(this.introduction_el);

		//// 上传图片
		//this.uploadPhotoNav = new Can.ui.Panel({cssName: 'field f-upload', html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.PHOTO + '</label>'});
		//this.imgUploadEl = new Can.ui.Panel({cssName: 'el'});
		//this.imgUploader = new Can.ui.uploader({
			//id: 'addProPhoUploader',
			//cssName: 'attach  preview-photo inner',
			//inputName: 'upload-files',
			//btnCss: 'btn btn-s12',
			//btnText: Can.msg.MODULE.PRODUCT_FORM.UPLOAD,
			//width: 70,
			//maxTotal: 6,
			//fileDesc: 'Image Files',
			//fileType: '*.png;*.gif;*.jpg',
			//fileSize: 3,
			//isPreview: true,
			//imgTemplate: '<div id="${fileID}" class="exist-file file-item">' +
				//'<div class="preview">' +
				//'<img class="up-photo" src="${previewUrl}" alt="${fileName}">' +
				//'</div>' +
				//'<a ${deleteBind} class="exist-close" href="javascript:;" cantitle="Delete"></a>' +
				//'<input type="hidden" name="productPhoto" value="${url}">' +
				//'</div>'
		//});
		//this.photo_input = $('<input type="hidden" name="productPhotoValid">');
		//this.imgUploadTip = new Can.ui.Panel({wrapEL: 'span', cssName: 'tips-upload', html: Can.msg.MODULE.PRODUCT_FORM.UPLOAD_TIPS});
		//this.upload_tip_help = new Can.ui.Panel({wrapEl: 'span', cssName: 'bg-ico ico-help', html: ''});
		//this.upload_tip_help.el.attr("cantitle", "Upload product photos to let suppliers <br> understand your requirements better.");

		//this.imgUploader.el.prepend(this.upload_tip_help.el);
		//this.imgUploader.el.prepend("&nbsp;&nbsp;");
		//this.imgUploader.el.prepend(this.imgUploadTip.el);
		//this.imgUploader.el.append(this.photo_input);
		//this.imgUploadErrorTip = new Can.ui.Panel({id: 'upload_tip', cssName: 'error-holder'});
		//this.imgUploadErrorTip.el.css("width", "530px");
		//this.imgUploadErrorTip.applyTo(this.imgUploader.el);
		//this.imgUploadEl.addItem(this.imgUploader);
		//this.uploadPhotoNav.addItem(this.imgUploadEl);

		//var aProductPhotos = getValue('productPhotos');
		//if (aProductPhotos.length > 0) {
			//for (var i = 0; i < aProductPhotos.length; i++)
				//aProductPhotos[i].id = "exist-file-" + i;

			//this.imgUploader.pushFiles(aProductPhotos);
		//}

		//// purchase quantity
		//this.This_buy = new Can.ui.Panel({
			//cssName: 'field',
			//html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.POST_BUYING_LEAD.THIS_QUANTITY + '</label>'
		//});
		//this.This_buy_el = new Can.ui.Panel({cssName: 'el'});
		//this.This_buy_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.This_buy_inner = new Can.ui.Panel({cssName: 'inner'});
		//this.This_buy_inner_eg = $('<input class="ipt w140" type="text" placeholder="e.g. 1000" name="buyingAmt" maxlength="8" value="' + purchaseQuantity_value + '">');
		//this.thisBuyTip = new Can.ui.Panel({
			//id: 'thisBuyTip',
			//cssName: 'error-holder',
			//html: ''
		//});

		//var i, item
			//, orderUnitLabel = []
			//, orderUnitValue = []
			//, orderUnitRaw = this.formOptions.orderUtils
			//, purchaseQuantityUnit_value = getValue('buyingUnit')
			//, purchaseQuantityUnit_label = getLabel(purchaseQuantityUnit_value, orderUnitRaw) || 'Unit Type'
			//, annualPurchase_value = getValue('yearBuyingAmt')
			//, annualPurchaseUnit_value = getValue('yearBuyingUnit')
			//, annualPurchaseUnit_label = getLabel(annualPurchaseUnit_value, orderUnitRaw) || 'Unit Type'
			//;

		//orderUnitLabel.push('Unit Type');
		//orderUnitValue.push('');
		//for (i = 0; i < orderUnitRaw.length; i++) {
			//item = orderUnitRaw[i];
			//orderUnitLabel.push(item.name);
			//orderUnitValue.push(item.code);
		//}
		//this.This_buy_dropFeild = new Can.ui.DropDownField({
			//id: 'quantity_ut1',
			//name: 'buyingUnit',
			//blankText: purchaseQuantityUnit_label,
			//valueItems: orderUnitValue,
			//labelItems: orderUnitLabel,
			//cssName: 'select-box ml-out',
			//value: purchaseQuantityUnit_value
		//});
		//this.This_buy_inner.addItem(this.This_buy_inner_eg);
		//this.This_buy_inner.addItem(this.This_buy_dropFeild);
		//this.This_buy_el_cont.addItem(this.This_buy_inner);
		//this.This_buy_el_cont.addItem(this.thisBuyTip);
		//this.This_buy_el.addItem(this.This_buy_el_cont);
		//this.This_buy.addItem(this.This_buy_el);
		//this.This_buy_dropFeild.on('onselected', function () {
			//me.This_buy_dropFeild.valueField.valid();
		//});

		//this.year_buy = new Can.ui.Panel({
			//cssName: 'field',
			//html: '<label class="col">' + Can.msg.POST_BUYING_LEAD.YEAR_QUANTITY + '</label>'
		//});
		//this.year_buy_el = new Can.ui.Panel({cssName: 'el'});
		//this.year_buy_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.year_buy_inner = new Can.ui.Panel({cssName: 'inner'});
		//this.year_buy_inner_eg = $('<input class="ipt w140" type="text" placeholder="e.g. 1000" maxlength="8" value="' + annualPurchase_value + '" name="yearBuyingAmt">');
		//this.yearBuyTip = new Can.ui.Panel({
			//id: 'yearBuyTip',
			//cssName: 'error-holder',
			//html: ''
		//});
		//this.year_buy_dropFeild = new Can.ui.DropDownField({
			//id: 'quantity_ut2',
			//name: 'yearBuyingUnit',
			//blankText: annualPurchaseUnit_label,
			//valueItems: orderUnitValue,
			//labelItems: orderUnitLabel,
			//cssName: 'select-box ml-out',
			//value: annualPurchaseUnit_value
		//});
		//this.year_buy_dropFeild.on('onselected', function () {
			//me.year_buy_dropFeild.valueField.valid();
		//});
		//this.year_buy_inner.addItem(this.year_buy_inner_eg);
		//this.year_buy_inner.addItem(this.year_buy_dropFeild);
		//this.year_buy_el_cont.addItem(this.year_buy_inner);
		//this.year_buy_el_cont.addItem(this.yearBuyTip);
		//this.year_buy_el.addItem(this.year_buy_el_cont);
		//this.year_buy.addItem(this.year_buy_el);
		////-----------------------date Limit-----------
		//this.dateLimit = new Can.ui.Panel({
			//cssName: 'field f-calendar',
			//html: '<label class="col"><span class="bg-ico required"></span>' + Can.msg.POST_BUYING_LEAD.DATE_LIMIT + '</label>'
		//});

		//var expiryDateLabel, expiryDateValue
			//, expiryDate = getValue('expiredTime')
			//;

		//if (expiryDate) {
			//expiryDateLabel = Can.util.formatDateTime(expiryDate, 'YYYY-MM-DD');
			//expiryDateValue = expiryDateLabel;
		//} else {
			//expiryDateLabel = 'YYYY-MM-DD';
			//expiryDateValue = undefined;
		//}

		//this.dateLimit_el = new Can.ui.Panel({cssName: 'el'});
		//this.dateLimit_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.dateLimit_inner = new Can.ui.Panel({cssName: 'inner'});
		//this.dateLM = new Can.ui.calendar({
			//cssName: 'bg-ico calendar',
			//blankText: expiryDateLabel,
			//normalValue: expiryDateValue,
			//elName: 'expiredDate',
			//min: Can.util.formatDateTime(new Date(), 'YYYY-MM-DD')
		//});
		//this.dateLM.on('ON_SET_VALUE', function () {
			//this.el.trigger('blur');
		//});
		//this.dateLimit_inner.addItem(this.dateLM);
		//this.dateLimit_el_cont.addItem(this.dateLimit_inner);
		//this.dateLimit_el.addItem(this.dateLimit_el_cont);
		//this.dateLimit.addItem(this.dateLimit_el);

		//this.expiredDateTip = new Can.ui.Panel({
			//id: 'expiredDateTip',
			//cssName: 'error-holder'
		//});
		//this.dateLimit_el_cont.addItem(this.expiredDateTip);

////组装第一部分容器
		//this.modForm.addItem(this.pdt_nam);
		//this.modForm.addItem(this.OneCategoryNav);
		//this.modForm.addItem(this.keywordContainer);
		//this.modForm.addItem(this.introductionNav);
		//this.modForm.addItem(this.uploadPhotoNav);
		//this.modForm.addItem(this.This_buy);
		//this.modForm.addItem(this.year_buy);
		//this.modForm.addItem(this.dateLimit);
		//this.modForm.addItem(this.groupNav);

		//this.partOneNav.addItem(this.OneTitleNav);
		//this.partOneNav.addItem(this.modForm);

////第二部分内容容器
		//this.partSecNav = new Can.ui.Panel({cssName: 'mod-add-part'});
		//this.partSecNav.el.click(function () {
			//var bHided = $("#moreInfoCont").data('hided');
			//if (bHided) {
				//me.partTheNav.el.slideDown(200).data('hided', false);
				//$(this).find(".post-bg").removeClass("pbg-plus").addClass('pbg-min');
			//} else {
				//me.partTheNav.el.slideUp(200).data('hided', true);
				//$(this).find(".post-bg").removeClass("pbg-min").addClass('pbg-plus');
			//}
		//});
////第二部分内容
		//this.SecTitleNav = new Can.ui.Panel({cssName: 'tit-s2'});
		//this.SecTitleNav.el.css({"padding": '0'});
		//this.SecTitle_h3 = new Can.ui.Panel({
			//wrapEL: 'h3',
			//cssName: 'post-moreInfo',
			//html: '<span class="post-bg pbg-plus"></span>&nbsp;&nbsp;' + Can.msg.POST_BUYING_LEAD.MORE_INFO
		//});
		//this.SecTitle_h3.el.css("cursor", "pointer");
		//this.SecSpan_h3Inner = new Can.ui.Panel({
			//wrapEL: 'span',
			//cssName: 'exrtip',
			//html: Can.msg.MODULE.PRODUCT_FORM.EXR_TIPS_2
		//});
		//this.SecTitle_h3.addItem(this.SecSpan_h3Inner);
		//this.SecTitleNav.addItem(this.SecTitle_h3);
		//this.partSecNav.addItem(this.SecTitleNav);

////第三部分内容容器
		//this.partTheNav = new Can.ui.Panel({cssName: 'mod-add-part', id: 'moreInfoCont'});
		//this.partTheNav.el.hide().data("hided", true);
////第三部分内容
		//this.TheTitleNav = new Can.ui.Panel({cssName: 'tit-s2'});
		//this.TheTitle_h3 = new Can.ui.Panel({
			//wrapEL: 'h3',
			//html: Can.msg.MODULE.PRODUCT_FORM.TITLE_3
		//});
		//this.TheSpan_h3Inner = new Can.ui.Panel({
			//wrapEL: 'span',
			//cssName: 'exrtip',
			//html: Can.msg.MODULE.PRODUCT_FORM.EXR_TIPS_3
		//});
		//this.TheTitle_h3.addItem(this.TheSpan_h3Inner);
		//this.TheTitleNav.addItem(this.TheTitle_h3);


////第三部分正内容容器

		//this.ThemodFormNav = new Can.ui.Panel({cssName: 'mod-form-s1'});
////运输方式
		//this.The_quantity = new Can.ui.Panel({
			//cssName: 'field',
			//html: '<label class="col">' + Can.msg.POST_BUYING_LEAD.TRANSPORT + '</label>'
		//});
		//this.The_quantity_el = new Can.ui.Panel({cssName: 'el'});
		//this.The_quantity_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.The_quantity_inner = new Can.ui.Panel({cssName: 'inner'});
////this.The_quantity_inner_eg=$('<input id="quantity_eg" class="ipt w140" type="text" placeholder="e.g. 1000" value="" name="">');

		//var transOptionLabel = []
			//, transOptionValue = []
			//, transOptions = this.formOptions.transModes
			//;

		//for (i = 0; i < transOptions.length; i++) {
			//item = transOptions[i];
			//transOptionLabel.push(item.name);
			//transOptionValue.push(item.code);
		//}
		//var transMethod_value = getValue('transMode')
			//, transMethod_label = getLabel(transMethod_value, transOptions) || Can.msg.POST_BUYING_LEAD.UNIT
			//;

		//this.The_quantity_dropFeild = new Can.ui.DropDownField({
			//id: 'quantity_ut3',
			//name: 'transMode',
			//blankText: transMethod_label,
			//valueItems: transOptionValue,
			//labelItems: transOptionLabel,
			//cssName: 'select-box ml-out',
			//value: transMethod_value
		//});
		//this.The_quantity_dropFeild.on('onselected', function () {
			//me.The_quantity_dropFeild.valueField.valid();
		//});
		//this.The_quantity_dropFeild.el.attr("style", "margin-left:0");
		//this.The_quantity_inner.addItem(this.The_quantity_inner_eg);
		//this.The_quantity_inner.addItem(this.The_quantity_dropFeild);
		//this.The_quantity_el_cont.addItem(this.The_quantity_inner);
		//this.The_quantity_el.addItem(this.The_quantity_el_cont);
		//this.The_quantity.addItem(this.The_quantity_el);
		//this.ThemodFormNav.addItem(this.The_quantity);

////首选价格
		//this.The_price = new Can.ui.Panel({
			//cssName: 'field',
			//html: '<label class="col">' + Can.msg.POST_BUYING_LEAD.FIRST_PRICE + '</label>'
		//});
		//this.The_price_el = new Can.ui.Panel({cssName: 'el'});
		//this.The_price_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.The_price_inner = new Can.ui.Panel({cssName: 'inner'});
		//this.priceTip = new Can.ui.Panel({
			//id: 'priceTip',
			//cssName: 'error-holder',
			//html: ''
		//});

		//var price_value = getValue('preferredPrice')
			//, priceUnit_value = getValue('currency')
			//, priceUnit_label = getLabel(priceUnit_value, orderUnitRaw) || Can.msg.POST_BUYING_LEAD.UNIT
			//;

/////////////////////////////
//// 根据 issues/99 需求更改 //
//// @author vfasky        //
/////////////////////////////

		/**
		 * 货币单位 value
		 * @type {Array}
		 */
		//var aCurrencyValues = [];
		/**
		 * 货币单位 label
		 * @type {Array}
		 */
		//var aCurrencyLabels = [];
		//aCurrencyValues.push('');
		//aCurrencyLabels.push('Unit Type');

		//$.each(this.formOptions.currncyUtils, function (k, v) {
			//aCurrencyValues.push(v.code);
			//aCurrencyLabels.push(getLabel(v.code, me.formOptions.currncyUtils));
		//});


		/**
		 * 货币单位值
		 * @type {String}
		 */
		//var sCurrencyValue = getValue('preferredCurrency');

		/**
		 * 货币单位值对应的名称
		 * @type {String}
		 */
		//var sCurrencyLabel = getLabel(sCurrencyValue, this.formOptions.currncyUtils) || aCurrencyLabels[0];

		/**
		 * 货币单位 DropDownField
		 * @type {Can.ui.DropDownField}
		 */
		//this.$currency = new Can.ui.DropDownField({
			//id: 'currncyUtils',
			//name: 'preferredCurrency',
			//blankText: sCurrencyLabel,
			//value: sCurrencyValue,
			//valueItems: aCurrencyValues,
			//labelItems: aCurrencyLabels,
			//cssName: 'select-box'
		//});
		//this.$currency.on('onselected', function () {
			//me.$currency.valueField.valid();
		//});

		//this.The_price_inner_eg = $('<input id="price_eg" class="ipt w140 ml-out" type="text" maxlength="8"  placeholder="e.g. 1000" value="' + price_value + '" name="preferredPrice">');

		/**
		 * 订单单位 value
		 * @type {Array}
		 */
		//var aPreferredValues = [];
		/**
		 * 订单单位 label
		 * @type {Array}
		 */
		//var aPreferredLabels = [];

		//aPreferredValues.push('');
		//aPreferredLabels.push('Unit Type');

		//$.each(this.formOptions.indivOrderUtils, function (k, v) {
			//aPreferredValues.push(v.code);
			//aPreferredLabels.push(getLabel(v.code, me.formOptions.indivOrderUtils));
		//});


		/**
		 * 订单单位值
		 * @type {String}
		 */
		//var sPreferredValue = getValue('preferredUnit');

		/**
		 * 订单单位值对应的名称
		 * @type {String}
		 */
		//var sPreferredLabel = getLabel(sPreferredValue, this.formOptions.indivOrderUtils) || aPreferredLabels[0];
		//var $Per = $('<i>' + Can.msg.POST_BUYING_LEAD.PER + '</i>');
		//$Per.addClass('ml-out');
		//this.$preferred = new Can.ui.DropDownField({
			//id: 'preferredUnit',
			//name: 'preferredUnit',
			//blankText: sPreferredLabel,
			//valueItems: aPreferredValues,
			//labelItems: aPreferredLabels,
			//cssName: 'select-box ml-out',
			//value: sPreferredValue
		//});
		//this.$preferred.on('onselected', function () {
			//me.$preferred.valueField.valid();
		//});

/////////////
//// end //
/////////////


//// this.The_price_dropFeild = new Can.ui.DropDownField({
//// 	id: 'preferredUnit',
//// 	name: 'preferredUnit',
//// 	blankText: priceUnit_label,
//// 	valueItems: orderUnitValue,
//// 	labelItems: orderUnitLabel,
//// 	cssName: 'select-box ml-out',
//// 	value: priceUnit_value
//// });
//// this.The_price_dropFeild.on('onselected', function () {
//// 	me.The_price_dropFeild.valueField.valid();
//// });
		//this.The_price_inner.addItem(this.$currency);
		//this.The_price_inner.addItem(this.The_price_inner_eg);
		//this.The_price_inner.addItem($Per);
		//this.The_price_inner.addItem(this.$preferred);
////this.The_price_inner.addItem(this.The_price_dropFeild);

		//this.The_price_el_cont.addItem(this.The_price_inner);
		//this.The_price_el.addItem(this.The_price_el_cont);
		//this.The_price_el.addItem(this.priceTip);
		//this.The_price.addItem(this.The_price_el);

		//this.ThemodFormNav.addItem(this.The_price);
////到达港
		//this.The_destination = new Can.ui.Panel({
			//cssName: 'field f-fob-price',
			//html: '<label class="col">' + Can.msg.POST_BUYING_LEAD.DESTINATION + '</label>'
		//});
		//this.The_destination_el = new Can.ui.Panel({cssName: 'el'});
		//this.The_destination_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.The_destination_inner = new Can.ui.Panel({cssName: 'inner'});

		//var loadingPort_value = getValue('arrivalPort');
		//this.The_feild1 = $('<input id="price_fed2" class="ipt w140 ml-out" type="text" placeholder="" value="' + loadingPort_value + '" name="arrivalPort">');
		//this.The_feild1.attr("style", "margin-left:0");

		//this.The_destination_inner.addItem(this.The_feild1);
		//this.The_destination_el_cont.addItem(this.The_destination_inner);
		//this.The_destination_el.addItem(this.The_destination_el_cont);
		//this.The_destination.addItem(this.The_destination_el);

////付款方式
		//this.paymentNav = new Can.ui.Panel({
			//cssName: 'field',
			//html: '<label class="col">' + Can.msg.POST_BUYING_LEAD.PAYMENT + '</label>'
		//});
		//this.payment_el = new Can.ui.Panel({cssName: 'el'});
		//this.payment_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.payment_inner = new Can.ui.Panel({cssName: 'inner'});

		//var paymentOptionLabel = []
			//, paymentOptionValue = []
			//, paymentOption = this.formOptions.paymethods
			//;

		//for (i = 0; i < paymentOption.length; i++) {
			//item = paymentOption[i];
			//paymentOptionLabel.push(item.name);
			//paymentOptionValue.push(item.code);
		//}
		//var can_supplierRequired = ''
			//, brand_supplierRequired = ''
			//, payment_value = getValue('payMode')
			//, payment_label = getLabel(payment_value, paymentOption) || Can.msg.POST_BUYING_LEAD.UNIT
			//, supplierRequired = buyinglead.supplierRequires
			//;

		//if (supplierRequired) {
			//for (i = 0; i < supplierRequired.length; i++) {
				//if (supplierRequired[i] * 1 === 108001) {
					//can_supplierRequired = ' checked="checked"';
				//} else if (supplierRequired[i] * 1 === 108002) {
					//brand_supplierRequired = ' checked="checked"';
				//}
			//}
		//}
		//this.paywayField = new Can.ui.DropDownField({
			//id: 'price_ut1',
			////name:'paymentUnit',
			//name: 'payMode',
			//blankText: payment_label,
			//valueItems: paymentOptionValue,
			//labelItems: paymentOptionLabel,
			//cssName: 'select-box ml-out',
			//value: payment_value
		//});
		//this.paywayField.el.attr("style", "margin-left:0");
		//this.payment_inner.addItem(this.paywayField);
		//this.payment_el_cont.addItem(this.payment_inner);
		//this.payment_el.addItem(this.payment_el_cont);
		//this.paymentNav.addItem(this.payment_el);
////供应商要求
		//this.Fir_payment = new Can.ui.Panel({
			//cssName: 'field f-rdchk',
			//html: '<label class="col">' + Can.msg.POST_BUYING_LEAD.SUPPLIER_TYPE + '</label>'
		//});
		//this.Fir_el = new Can.ui.Panel({cssName: 'el'});
		//this.Fir_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.Fir_inner = new Can.ui.Panel({cssName: 'inner'});

		//this.Fir_lc = $('<label for="c1"><input id="c1" class="vertical" type="checkbox" name="supplierRequire"' + can_supplierRequired + ' value="108001">' + Can.msg.POST_BUYING_LEAD.CONDITION_1 + '</label>');
		//this.Fir_da = $('<label for="c2"><input id="c2" class="vertical" type="checkbox" name="supplierRequire"' + brand_supplierRequired + ' value="108002">' + Can.msg.POST_BUYING_LEAD.CONDITION_2 + '</label>');
		//this.dropNav = new Can.ui.Panel({
			//wrapEL: 'span',
			//cssName: 'select-box'
		//});

		//var participateOptionLabel = []
			//, participateOptionValue = []
			//, participateOption = this.formOptions.sessions
			//, participate_value = getValue('supplierRequireValue')
			//, participate_label = getLabel(participate_value, participateOption) || Can.msg.POST_BUYING_LEAD.NON_REQUIRED
			//;

		//for (i = 0; i < participateOption.length; i++) {
			//item = participateOption[i];
			//participateOptionLabel.push(item.name);
			//participateOptionValue.push(item.code);
		//}
		//this.canTimes = new Can.ui.DropDownField({
			//id: 'price_ut1',
			////name:'canTimes',
			//name: 'supplierRequireValue',
			//blankText: participate_label,
			//value: participate_value,
			//valueItems: participateOptionValue,
			//labelItems: participateOptionLabel,
			//cssName: 'select-box ml-out'
		//});
		//this.dropNav.addItem(this.canTimes);
		//this.Fir_inner.addItem(this.Fir_lc);
		//this.Fir_inner.addItem(this.dropNav);
		//this.Fir_inner.addItem(this.Fir_da);
		//this.Fir_el_cont.addItem(this.Fir_inner);
		//this.specialRequirementTip = new Can.ui.Panel({
			//id: 'specialRequirementTip',
			//cssName: 'error-holder'
		//});
		//this.Fir_el_cont.addItem(this.specialRequirementTip);

		//this.Fir_el.addItem(this.Fir_el_cont);
		//this.Fir_payment.addItem(this.Fir_el);
////期望收到
		//this.hopeReceive = new Can.ui.Panel({
			//cssName: 'field f-rdchk',
			//html: '<label class="col">' + Can.msg.POST_BUYING_LEAD.HOPE_RECEIVE + '</label>'
		//});
		//this.hopeReceive_el = new Can.ui.Panel({cssName: 'el'});
		//this.hopeReceive_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.hopeReceive_el_inner = new Can.ui.Panel({cssName: 'inner'});

		//var extraRequirement = '', code, checked
			//, extraRequirementChecked = {}
			//, extraRequirementChecked_raw = buyinglead.expectReces || []
			//;

		//for (i = 0; i < extraRequirementChecked_raw.length; i++) {
			//extraRequirementChecked[extraRequirementChecked_raw[i]] = true;
		//}
		//for (i = 0; i < this.formOptions.supExpects.length; i++) {
			//item = this.formOptions.supExpects[i];
			//code = item.code;
			//checked = extraRequirementChecked[code] ? 'checked="checked"' : '';
			//extraRequirement += [
				//'<label for="extraRequirement-' + i + '">',
				//'<input id="extraRequirement-' + i + '" class="vertical" type="checkbox" name="expectRece" value="' + code + '"' + checked + '>' + item.name,
				//'</label>'
			//].join('');
		//}
		//[>
		 //this.directory = $('<label for="c3"><input id="c3" class="vertical" type="checkbox" name="expectRece" value="">' + Can.msg.POST_BUYING_LEAD.DETAIL_MENU + '</label>');
		 //this.pirce = $('<label for="c4"><input id="c4" class="vertical" type="checkbox" name="expectRece" value="">' + Can.msg.POST_BUYING_LEAD.DETAIL_PRICE + '</label>');
		 //this.certificate = $('<label for="c5"><input id="c5" class="vertical" type="checkbox" name="expectRece" value="">' + Can.msg.POST_BUYING_LEAD.CERT + '</label>');
		 //this.otherField = $('<label for="c6"><input id="c6" class="vertical" type="checkbox" name="expectRece" value="">' + Can.msg.POST_BUYING_LEAD.OTHER + '</label>');
		 //this.hopeReceive_el_inner.addItem(this.directory);
		 //this.hopeReceive_el_inner.addItem(this.pirce);
		 //this.hopeReceive_el_inner.addItem(this.certificate);
		 //this.hopeReceive_el_inner.addItem(this.otherField);
		 //*/
		//this.extraRequirementTip = new Can.ui.Panel({
			//id: 'extraRequirementTip',
			//cssName: 'error-holder'
		//});
		//this.hopeReceive_el_inner.addItem($(extraRequirement));
		//this.hopeReceive_el_cont.addItem(this.hopeReceive_el_inner);
		//this.hopeReceive_el_cont.addItem(this.extraRequirementTip);
		//this.hopeReceive_el.addItem(this.hopeReceive_el_cont);
		//this.hopeReceive.addItem(this.hopeReceive_el);

//// Purchase Amount
		//this.purchaseAmount = new Can.ui.Panel({
			//cssName: 'field',
			//html: '<label class="col">Purchase Amount:</label>'
		//});

		//this.pur_amount_eL = new Can.ui.Panel({cssName: 'el'});
		//this.pur_amount_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.pur_amount_inner = new Can.ui.Panel({cssName: 'inner'});

		//var paValue = getValue('procureMoneyValue') || '';
		//var paUnitValue = getValue('procureMoneyUnit') || '';
		//var paUnitLabel = getLabel(paUnitValue, this.formOptions.currncyUtils) || 'Monetary Unit';

		//this.$paField = $('<input id="purchaseAmount" class="ipt w140 ml-out" type="text" placeholder="e.g. 1000" value="' + paValue + '" name="procureMoneyValue">');

		//this.paUnits = new Can.ui.DropDownField({
			//id: 'paUnits',
			////name:'paymentUnit',
			//name: 'procureMoneyUnit',
			//blankText: paUnitLabel,
			//valueItems: aCurrencyValues,
			//labelItems: aCurrencyLabels,
			//cssName: 'select-box',
			//value: paUnitValue
		//});

		//this.pur_amount_eL.errorTips = new Can.ui.Panel({cssName: 'error-holder'});

		//this.pur_amount_inner.addItem(this.paUnits);
		//this.pur_amount_inner.addItem(this.$paField);

		//this.pur_amount_cont.addItem(this.pur_amount_inner);
		//this.pur_amount_eL.addItem(this.pur_amount_cont);
		//this.pur_amount_eL.addItem(this.pur_amount_eL.errorTips);
		//this.purchaseAmount.addItem(this.pur_amount_eL);

//// Annual Purchase Amount
		//this.aPurchaseAmount = new Can.ui.Panel({
			//cssName: 'field',
			//html: '<label class="col">Annual Purchase Amount:</label>'
		//});

		//this.apur_amount_eL = new Can.ui.Panel({cssName: 'el'});
		//this.apur_amount_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.apur_amount_inner = new Can.ui.Panel({cssName: 'inner'});

		//var apaValue = getValue('yearProcureMoneyValue') || '';
		//var apaUnitValue = getValue('yearProcureMoneyUnit');
		//var apaUnitLabel = getLabel(apaUnitValue, this.formOptions.currncyUtils) || 'Monetary Unit';

		//this.$apaField = $('<input id="aPurchaseAmount" class="ipt w140 ml-out" type="text" placeholder="e.g. 1000" value="' + apaValue + '" name="yearProcureMoneyValue">');

		//this.apaUnits = new Can.ui.DropDownField({
			//id: 'apaUnits',
			////name:'paymentUnit',
			//name: 'yearProcureMoneyUnit',
			//blankText: apaUnitLabel,
			//valueItems: aCurrencyValues,
			//labelItems: aCurrencyLabels,
			//cssName: 'select-box',
			//value: apaUnitValue
		//});

		//this.apur_amount_eL.errorTips = new Can.ui.Panel({cssName: 'error-holder'});

		//this.apur_amount_inner.addItem(this.apaUnits);
		//this.apur_amount_inner.addItem(this.$apaField);

		//this.apur_amount_cont.addItem(this.apur_amount_inner);
		//this.apur_amount_eL.addItem(this.apur_amount_cont);
		//this.apur_amount_eL.addItem(this.apur_amount_eL.errorTips);
		//this.aPurchaseAmount.addItem(this.apur_amount_eL);


//// 附件
		//this.uploadNav = new Can.ui.Panel({
			//cssName: 'field f-upload',
			//html: '<label class="col">' + Can.msg.MODULE.PRODUCT_FORM.ATTACHMENT + '</label>'
		//});
		//this.upload_el = new Can.ui.Panel({cssName: 'el'});
		//this.upload_el_cont = new Can.ui.Panel({cssName: 'el-cont'});
		//this.uploader = new Can.ui.uploader({
			//id: 'addProUploader',
			//cssName: 'attach file-list inner',
			//inputName: 'upload-files',
			//btnCss: 'btn btn-s12',
			//btnText: Can.msg.MODULE.PRODUCT_FORM.UPLOAD,
			//width: 70,
			//maxTotal: 3,
			//fileDesc: 'Attachment Files',
			//fileType: '*.docx;*.doc;*.xls;*.xlsx;*.ppt;*.pptx;*.txt;*.pdf;',
			//fileSize: 2,
			//itemTemplate: [
				//'<div id="${fileID}" class="file-item">',
				//'	<label class="name">${fileName}</label>',
				//'	<a  ${deleteBind} class="close" href="javascript:;" cantitle="' + Can.msg.CAN_TITLE.DELETE + '"></a>',
				//'   <input type="hidden" name="attachment" value="${url}">',
				//'</div>'
			//].join('')
		//});
		//this.upload_tip_tip = new Can.ui.Panel({
			//wrapEL: 'span',
			//cssName: 'tips-upload',
			//html: Can.msg.POST_BUYING_LEAD.ATTACH_TIPS
		//});
		//this.uploader.el.prepend(this.upload_tip_tip.el);
		//this.upload_error_tip = new Can.ui.Panel({
			//id: 'upload_attach_tip',
			//cssName: 'error-holder'
		//});
		//this.upload_error_tip.applyTo(this.uploader.el);
		//this.upload_el_cont.addItem(this.uploader);
		//this.upload_el.addItem(this.upload_el_cont);
		//this.uploadNav.addItem(this.upload_el);

		//var attachments = getValue('attachments');
		//if (attachments.length > 0) {
			//for (var i = 0; i < attachments.length; i++) {
				//attachments[i].id = 'exist-file-' + i;
				//attachments[i].name = 'file' + (i + 1);
			//}
			//me.uploader.pushFiles(attachments);
		//}

////封装各部分内容
		//this.ThemodFormNav.addItem(this.The_quantity);
		//this.ThemodFormNav.addItem(this.The_supply);
		//this.ThemodFormNav.addItem(this.The_price);
		//this.ThemodFormNav.addItem(this.The_price);
		//this.ThemodFormNav.addItem(this.The_destination);
		//this.ThemodFormNav.addItem(this.paymentNav);
		//this.ThemodFormNav.addItem(this.Fir_payment);
		//this.ThemodFormNav.addItem(this.hopeReceive);
		//this.ThemodFormNav.addItem(this.purchaseAmount);
		//this.ThemodFormNav.addItem(this.aPurchaseAmount);
		//this.ThemodFormNav.addItem(this.uploadNav);

		//this.partTheNav.addItem(this.ThemodFormNav);

//// actions: 分享联系方式，提交需求等操作
        //this.actionNav = new Can.ui.Panel({cssName: 'actions'});

//// 分享联系方式
		//this.actionNav.shareCheck = new Can.ui.Panel({
			//cssName: 'post-checkbox'
		//});
		//this.actionNav.shareCheck.el.data('check', false);
		//this.actionNav.shareCheck.addItem($('<span class="ico-checkbox"></span><span class="share-label">Set my contacts public to suppliers. (Usually faster to get response)</span>'));
		//this.actionNav.shareCheck.addItem($('<input type="hidden" name="isShareContact" value="0"/>'));
        //this.actionNav.addItem(this.actionNav.shareCheck);


//// public count
        //this.actionNav.pubCount = new Can.ui.Panel({
            //cssName:'pub-count'
        //});
        //this.actionNav.pubCount.addItem($('<span>Public count (supplier): </span>'));
        //this.actionNav.pubCount.addItem($('<label for="pc1"><input id="pc1" type="radio" value="10" name="shareContactLimit"/>Less than 10</label>'));
        //this.actionNav.pubCount.addItem($('<label for="pc2"><input id="pc2" type="radio" value="30" name="shareContactLimit"/>Less than 30</label>'));
        //this.actionNav.pubCount.addItem($('<label for="pc3"><input id="pc3" type="radio" value="-1" name="shareContactLimit" checked/>Not limited</label>'));
        //this.actionNav.addItem(this.actionNav.pubCount);

        //if(this.editId){
            //this.actionNav.shareCheck.el.addClass('hidden');
            //this.actionNav.pubCount.el.addClass('hidden');
        //}

        //Can.util.isCcoinOpened(function(isOpened){
            //me.isCcoinOpened = isOpened;
        //});

//// TIP及save按钮
        //var save_btn = new Can.ui.toolbar.Button({
            //text: 'Submit',
            //cssName: 'btn btn-s11 btn-s16',
            //id: 'submitBtnId'
        //});
        //save_btn.click(function (event) {
            //me.fireEvent('onsaveclick', save_btn);
        //});
		//this.actionNav.addItem(save_btn);
		//this.actionNav.addItem($("<div id='action-loading' class='action-loading'></div>"));
        //this.actionNav.addItem($("<div class='action-tips'><span>Tips:</span>&nbsp; If no replies within 3 days, e-Cantonfair will make further follow-up to recommend you selected supplier.</div>"));

////组装主容器
		//this.product_con.addItem(this.partOneNav);
		//this.product_con.addItem(this.partSecNav);
		//this.product_con.addItem(this.partTheNav);
		//this.product_con.addItem(this.actionNav);

		//if (this.editId) {
			//this.product_con.addItem($('<input type="hidden" name="leadId" value="' + this.editId + '" />'));
		//}
////主容器添加入页面
		//this.product_con.applyTo(this.contentEl);
	//},

//// 确认联系方式的弹窗
    //buildContactWin: function(){
        //this.contactWin = new Can.view.titleWindowView({
            //titler: $('<div class="cont-win-title">Confirm your contact info</div>'),
            //width:480
        //});

        //this.contForm = new Can.ui.Panel({
            //cssName: 'mod-form-s1 pb-cont-form',
            //wrapEL: 'form'
        //});

        //var fields = [
            //{
                //label:'Company Name: ',
                //controls: [
                    //{
                        //name: 'companyName',
                        //width: 295
                    //}
                //]
            //},
            //{
                //label:'E-mail: ',
                //controls: [
                    //{
                        //name: 'email',
                        //width: 295
                    //}
                //]
            //},
            //{
                //label:'Tel: ',
                //controls: [
                    //{
                        //name: 'countryTel',
                        //width: 70
                    //},
                    //{
                        //name: 'zoneTel',
                        //width: 70
                    //},
                    //{
                        //name: 'telephone',
                        //width: 120
                    //}
                //]
            //},
            //{
                //label:'Fax: ',
                //controls: [
                    //{
                        //name: 'countryFax',
                        //width: 70
                    //},
                    //{
                        //name: 'zoneFax',
                        //width: 70
                    //},
                    //{
                        //name: 'fax',
                        //width: 120
                    //}
                //]
            //}
        //];

        //(function(me, fields, Can){
            //$.each(fields,function(index,field){
                //var fieldItem = new Can.ui.Panel({
                    //cssName: 'field clear',
                    //html: '<label class="col adj">'+field.label+'</label>'
                //});
                //fieldItem.el.css({'margin':'15px 0 0 0'});
                //var elCont = new Can.ui.Panel({cssName:'el-cont'});
                //var inner = new Can.ui.Panel({cssName:'inner'});

                //for(var i = 0; i<field.controls.length; i++){
                    //var control = field.controls[i];
                    //var $input = $('<input name="'+control.name+'" class="ipt" >');
                    //$input.width(control.width);
                    //if(i>0) $input.css({'margin-left':'5px'});
                    //inner.addItem($input);

                    //if(control.name == 'email'){
                        //inner.addItem($('<div class="email-vali"><span></span><span class="icons vali"></span><span class="vali-label">Verified</span></div>'));
                    //}
                //}

                //elCont.addItem(inner);
                //elCont.addItem($('<div class="error-holder"></div>'));
                //fieldItem.addItem(elCont);
                //me.contForm.addItem(fieldItem);
            //});
            //var saveBtn = new Can.ui.toolbar.Button({
                //text: 'Save',
                //cssName: 'btn btn-s11 btn-s16'
            //});
            //saveBtn.el.css({'margin':'15px 0 15px 115px'});

            //saveBtn.click(function(event){
                //me.fireEvent('onContactSave',saveBtn);
            //});

            //me.contForm.addItem(saveBtn);
        //})(this, fields, Can);

        //this.contactWin.setContent(this.contForm);
    //},

    //showContactWin: function(){
        //var me = this;
        //me.buildContactWin();
        //$.ajax({
            //url: Can.util.Config.buyer.blManageModule.findContact,
            //success: function(jData){
                //if(jData && jData['status'] == 'success'){
                    //var oData = jData.data || {};
                    //for(var sName in oData){
                        //if(oData[sName]){
                            //me.contForm.el.find('input[name='+sName+']').val(oData[sName]);
                        //}
                    //}
                    //var $email = me.contForm.el.find('input[name=email]');
                    //$email.data('emailValidation', oData.emailValidation);
                    //if(oData.emailValidation){
                        //$email.hide();
                        //$email.parents('.inner').find('.email-vali').show().find('span').first().text(oData.email);
                    //}else{
                        //$email.show();
                        //$email.parents('.inner').find('.email-vali').hide();
                    //}

                    //me.fireEvent('ON_CONTACT_LOADED', me);
                //}
            //}
        //});
        //me.contactWin.show();
    //},

	//onCheck: function (fFn) {
		//if (typeof  fFn === 'function') {
			//this.actionNav.shareCheck.el.click(fFn);
		//}
	//},
	//uploaderReady: function () {
		//this.imgUploader.startUploader();
		//this.uploader.startUploader();
	//},
	//onImgUploadSuccess: function (fFn) {
		//if (typeof fFn === 'function') {
			//this.imgUploader.on('ON_UPLOAD_SUCCESS', fFn);
		//}
	//},
	//onImgRemove: function (fFn) {
		//if (typeof fFn === 'function') {
			//this.imgUploader.on('ON_REMOVE_FILE', fFn);
		//}
	//},
	//onImgUploadError: function (fFn) {
		//if (typeof fFn === 'function') {
			//this.imgUploader.on('ON_UPLOAD_ERROR', fFn);
		//}
	//},
	//onFileUploadSuccess: function (fFn) {
		//if (typeof fFn === 'function') {
			//this.uploader.on('ON_UPLOAD_SUCCESS', fFn);
		//}
	//},
	//onFileUploadError: function (fFn) {
		//if (typeof fFn === 'function') {
			//this.uploader.on('ON_UPLOAD_ERROR', fFn);
		//}
	//}
//})
//;


