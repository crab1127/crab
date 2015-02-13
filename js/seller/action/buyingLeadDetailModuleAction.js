/**
 * BuyingLead Module Action
 * author: sam
 * Date: 13-8-9
 * Time: 上午1:54
 */
$.moduleAndViewAction('buyingLeadDetailModuleId', function (blDetail) {

	var _xPostTime = false;
	var _xFavorite = false;
	//上一步
	blDetail.on('onPrevClick', function () {
		if (!blDetail.queue || !blDetail.queue[blDetail.bid]) {
			return;
		}

		var queue = blDetail.queue, prev = queue[blDetail.bid].prev;
		if (prev) {
			blDetail.bid = prev;
			if (_xPostTime) {
				clearTimeout(_xPostTime);
			}
			_xPostTime = setTimeout(function () {
				blDetail.loadData({"buyerleadId": prev});
			}, 500);
		}
	});
	//下一步
	blDetail.on('onNextClick', function () {
		if (!blDetail.queue || !blDetail.queue[blDetail.bid]) {
			return;
		}

		var queue = blDetail.queue, next = queue[blDetail.bid].next;

		if (next) {
			blDetail.bid = next;
			if (_xPostTime) {
				clearTimeout(_xPostTime);
			}
			_xPostTime = setTimeout(function () {
				blDetail.loadData({"buyerleadId": next});
			}, 500);
		}

	});
	//返回
	blDetail.on('onBackClick', function () {
		//var _back = Can.Application.getModule(Can.Route._referer['moduleId']);
		if (blDetail._referer) {
            Can.Route.run(blDetail._referer);	
		}else{
			Can.Route.run("/buyinglead");
		}
		// 产品要求不刷新
//        Can.Route.run(blDetail._referer,{
//            keyword: blDetail._sKeyword
//        });
	});

	//提交表单
	blDetail.on('submitBtnClick', function (target, oData) {

		var title_txt = 'Re: ' + oData.productName + ' Feedbacks from ' + Can.util.userInfo().getCompanyName();
		var content_txt = blDetail.replyArea.el.find('#content').val();

		var buyingLeadId = blDetail.bid;

		var fError = function (notice) {
			var feedback = blDetail.feedback;
			feedback.el.html(notice).slideDown();
			setTimeout(function () {
				feedback.el.slideUp();
				target.el.removeClass("dis");
			}, 3500);
		};

		if (content_txt === "") {
			fError(Can.msg.MODULE.BUYING_LEAD.REPLY_EPT_ERROR);
			return false;
		}

		if (Can.util.checkLength(content_txt) > 8000) {
			fError(Can.msg.MODULE.BUYING_LEAD.REPLY_CON_ERROR);
			return false;
		}

		$.ajax({
			url: Can.util.Config.seller.buyerleadDetailModule.contact,
			type: 'POST',
			data: { title: title_txt, leadId: buyingLeadId, content: content_txt, consumerCode:oData.ckey},
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var ExhibitPicWin = new Can.view.pinWindowView({
						type: 2,
						width: 400
					});
					ExhibitPicWin.onClose(function () {
						blDetail.reply.el.find(".tit-s2").nextAll().remove();
						blDetail.loadData({'buyerleadId': buyingLeadId});
					});
					ExhibitPicWin.setContent([
						'<div class="pro-pic">',
						'<div class="express-send"><span class="icons current"></span>' + Can.msg.BL_DETAIL.SEND_SUCCESS + '</div>',
						'</div>'
					].join(''));
					ExhibitPicWin.show();
				} else {
					fError(Can.msg.FAILED);
				}

			}
		});
	});

	var $favorite = blDetail.favorite.el;
	//收藏
	blDetail.onFavorite(function () {
		var isFavorate = Number($favorite.attr('is-favorate')) === 1;
		if(!_xFavorite){
			$.ajax({
				type: 'POST',
				cache: false,
				url: Can.util.Config.seller.buyerleadModule.favorBuyingLead,
				data: { leadId: blDetail.bid, isFavor: isFavorate ? 0 : 1},
				beforeSend:function(){
					_xFavorite = true;
				},
				complete:function(){
					_xFavorite = false;
				},
				success: function (jData) {
					if (jData.status === 'error') {
						return Can.util.notice(oJson.message, 'error');
					}
					if (isFavorate) {
						$favorite.removeClass('star-3')
							.addClass('star-0');

						$favorite.attr('is-favorate', '0');
					}
					else {
						$favorite.removeClass('star-2 star-0')
							.addClass('star-3');

						$favorite.attr('is-favorate', '1');
					}
				}
			})
		}
		
	}, function () {
		var isFavorate = Number($favorite.attr('is-favorate')) === 1;
		if (isFavorate) {
			$favorite.removeClass('star-3')
				.addClass('star-2');
		}
		else {
			$favorite.removeClass('star-0')
				.addClass('star-2');
		}
	}, function () {
		var isFavorate = Number($favorite.attr('is-favorate')) === 1;

		if (isFavorate) {
			$favorite.removeClass('star-2')
				.addClass('star-3');
		}
		else {
			$favorite.removeClass('star-2')
				.addClass('star-0');
		}
	})

    // view big photo
    blDetail.onPhotoClick(function(){
        if(blDetail.slider){
            blDetail.slider.show($(this).index());
        }
    });

});
