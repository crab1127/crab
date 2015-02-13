/**
 *
 * @Author: sam
 * @Version: 1.1
 * @Update: 13-2-22
 */

$.moduleAndViewAction('productPicViewId', function (productPic) {
	var box = productPic.listbox.el;
	var ubox = productPic.item;
	productPic.mainPic.el.html('<img src="' + ubox.children().eq(0).children('img').attr('alt') + '" />');
	productPic.stepBtn.onRightClick(function () {
		var _this = this.el;
		productPic.stepBtn.getDOM(0).removeClass('dis');
		box.animate({
			scrollLeft: box.scrollLeft() + box.width() - 10
		}, 'slow', function () {
			if (box.scrollLeft() + box.width() + 20 >= ubox.outerWidth(true)) {
				_this.addClass('dis');
			}
		})
	});
	productPic.stepBtn.onLeftClick(function () {
		var _this = this.el;
		productPic.stepBtn.getDOM(1).removeClass('dis');
		box.animate({
			scrollLeft: box.scrollLeft() - box.width() + 10
		}, 'slow', function () {
			if (box.scrollLeft() - box.width() - 20 <= ubox.outerWidth(true)) {
				_this.addClass('dis');
			}
		});
	});
	productPic.item.delegate('li', 'click', function (event) {
		$(this).addClass("cur").siblings().removeClass("cur");
		productPic.mainPic.el.html('<img src="' + $(this).children('img').attr('alt') + '" />');
	});
});
