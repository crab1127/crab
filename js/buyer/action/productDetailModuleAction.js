/**
 * Buyer Activity Action
 * Created by sam
 * Date: 13-2-22
 */
$.moduleAndViewAction('productDetailModuleId', function (productDetail) {
	productDetail.on('oninquireBtnclick', function (trigger) {
		/*$('html,body').animate({
		 scrollTop: productDetail.subject_field.el.offset().top
		 }, 1300);
		 productDetail.subject_field.el.focus();*/
		//产品询盘
		var _data = productDetail.data;
		Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, {
			inquiry: [
				{
					supplierId: _data.product.supplierId,
					supplierName: _data.company.contacter,
					companyId: _data.company.companyId,
					companyName: _data.company.companyName,
					products: [
						{
							productId: _data.product.productId,
							productTitle: _data.product.productName,
							productPhoto: _data.picture.pic1
						}
					]
				}
			]
		}, Can.msg.MESSAGE_WINDOW.INQUIRY_SUBJECT.replace('[@]', _data.product.productName)]);
	});

	productDetail.on('onfavoritesBtnclick', function (trigger) {
		Can.ui.favorite({
			trigger: $(trigger.el),
			url: {
				mark: Can.util.Config.favorite.mark,
				tag: Can.util.Config.favorite.tag
			},
			data: {
				collectContentId: this.data.product.productId,
				collectType: 2
			}
		});
	});

	productDetail.on('onsaveBtnclick', function (saveBtn) {
		productDetail.content_field.sync();

		var FB = function (notice) {
			var feedback = productDetail.feedback;
			feedback.el.html(notice)
				.slideDown(function () {
					saveBtn.el.removeClass('dis');
				});

			setTimeout(function () {
				feedback.el.slideUp();
			}, 3500);
		};

		$.ajax({
			url: Can.util.Config.email.sendEmail,
			type: 'POST',
			data: productDetail.contactNav.el.serialize(),
			success: function (d) {
				if (d['status'] !== 'success') {
					FB(Can.msg.FAILED);
					return;
				}
				productDetail.subject_field.setValue('');
				productDetail.content_field.editor.html('');
				FB(Can.msg.MODULE.MSG_CENTER.SEND);
			}
		});
	});

	productDetail.on('ON_BACK_CLICK', function () {
		if (productDetail.returnModule) {
			if(false == Can.Route.run(productDetail.returnModule)){
				var returnModule = Can.Application.getModule(productDetail.returnModule);
				if (returnModule) {
					returnModule.show();
				}
			}
		}
	});

});
