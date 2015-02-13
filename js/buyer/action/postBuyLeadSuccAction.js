/**
 * 发布采购需求成功 action
 * @Author: Allenice
 * @version: v1.0
 * @since:13-8-12
 */

$.moduleAndViewAction('postBuyLeadSuccModuleID', function (pbSucc) {

	if (pbSucc.productData.length == 0) return;

	// checkbox action
	pbSucc.onBthCheck(function (e) {
		if ($(this).data("checked")) {
			$(this).data("checked", false).addClass('bg-uncheck');
		} else {
			$(this).data("checked", true).removeClass('bg-uncheck');
		}
		return false;
	});

	// add more requirements
	pbSucc.onAddMoreClick(function () {
		if ($(this).data("hidded")) {
			$(this).data("hidded", false).siblings('.ifa-cont').slideDown(200).focus();
			$(this).find('.post-bg').removeClass('pbg-plus').addClass('pbg-min');
		} else {
			$(this).data("hidded", true).siblings('.ifa-cont').slideUp(200).focus();
			$(this).find('.post-bg').removeClass('pbg-min').addClass('pbg-plus');
		}
	});

	// 选择产品
	pbSucc.onProductSelect(function () {
		var $li = $(this).parents('li');
		if ($li.data("checked")) {
			$li.data("checked", false).removeClass("if-pro-checked");
		} else {
			$li.data("checked", true).addClass("if-pro-checked");
		}
	});

	// 产品轮播 -> 数据
	if (pbSucc.productData.length <= 3) pbSucc.productList.$nextBtn.hide();
	var list = pbSucc.productList.$ul.find('li');
	var productCount = Math.ceil(list.length / 3);
	var current = 1;
	var offset = list.width() * 3 + parseInt(list.css("margin-right")) * 3 + 6;
	var left = parseInt(pbSucc.productList.$ul.css("left"));

	// 产品轮播-》pre
	pbSucc.onPreBtnClick(function () {
		pbSucc.productList.$nextBtn.show();
		left = (offset + left);
		current--;
		pbSucc.productList.$ul.animate({"left": left}, 500);
		if (current <= 1) {
			pbSucc.productList.$preBtn.hide();
		}
	});

	// 产品轮播-》next
	pbSucc.onNextBtnClick(function () {
		pbSucc.productList.$preBtn.show();
		left = -(offset - left);
		current++;
		pbSucc.productList.$ul.animate({"left": left}, 500);
		if (current >= productCount) {
			pbSucc.productList.$nextBtn.hide();
		}
	});

	Can.importJS(['js/utils/windowView.js']);
	// 询盘
	function inquiry() {
		var content = pbSucc.addMore.el.find("textarea").val();
		var data = "content=" + content;
		var inquiryInfo = "";
		var referId = "";

		pbSucc.checkBoxs.el.find(".bg-check").each(function () {
			if ($(this).data("checked")) {
				data += ("&inquiryInfo=" + $(this).parents('li').text());
			}
		});
		pbSucc.productList.$ul.find("li").each(function () {
			if ($(this).data("checked")) {
				data += ("&referId=" + $(this).data("id"));
			}
		});
		$.ajax({
			type: "POST",
			url: Can.util.Config.buyer.blManageModule.sendProductInquiry,
			data: data,
			beforeSend: function () {
				pbSucc.submitPanel.el.find("#send-inquiry").hide();
				pbSucc.submitPanel.el.find("#inquiry-loading").css("display", "inline-block");
			},
			complete: function () {
				pbSucc.submitPanel.el.find("#send-inquiry").show();
				pbSucc.submitPanel.el.find("#inquiry-loading").hide();
			},
			success: function (res) {
				if (res && res['status'] != "success") {
					Can.util.canInterface('whoSay', ['Inquiry Failed!']);
					return;
				}
				var tipBox = new Can.ui.textTips({
					target: pbSucc.titleContainerEL,
					hasArrow: false,
					arrowIs: 'Y',
					hasIcon: true,
					iconCss: 'text-tips-icon',
					text: Can.msg.MODULE.BUYER_LEAD_MANAGE.SAVE,
					id: 'top_tip'
				});
				tipBox.show();
				tipBox.updateCss({
					position: 'fixed',
					left: ($(document).width() - tipBox.el.width()) / 2,
					top: 130
				});
				setTimeout(function () {
					tipBox.hide();
					// 发布成功跳回首页，不进入采购需求管理
					$('#logoPanelId').trigger('click');
				}, 3500);
			}
		});

	}

	pbSucc.onSubmit(function () {
		// 判断第一个checkbox有没有被选中
		var checked = pbSucc.inquireTitle.$title.find(".bg-check").data("checked");
		if (!checked) {
			var confirmWin = new Can.view.confirmWindowView({
				id: "pbSuccConfirmWin",
				width: 280
			});
			confirmWin.setContent('<div style="padding: 10px 20px;">Do you want to inquire all the products as above, and recieve full information from relevant suppliers?</div>');
			confirmWin.show();
			confirmWin.onOK(function () {
				pbSucc.productList.$ul.find("li").data("checked", true).addClass('if-pro-checked');
				pbSucc.checkBoxs.el.find(".bg-check").data("checked", true).removeClass('bg-uncheck');
				inquiry();
			});
		} else {
			inquiry();
		}
	});

});