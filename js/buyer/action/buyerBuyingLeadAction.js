/**
 * @Author: sam
 * @Version: 1.1
 * @Update:
 */
$.moduleAndViewAction('buyerBuyingLeadModuleId', function (blDetail) {

	/*查看展位信息的對話框*/
	var oShowBooth = new Can.ui.tips({
		hasArrow: false,
		cssName: 'win-tips-s1',
		arrowIs: 'Y',
		hasWaiting: true,
		mainCss: 'win-reply-out',
		arrowCss: 'arrow-b',
		width: 280
	});


//    blDetail.set_stepBtn_css();
	blDetail.on("onTapClick", function ($obj) {
		var sCode = $obj.attr("data-code");
		$obj.addClass('cur').siblings().removeClass('cur')
		if (sCode === "baseInfo") {
			$(".base-info").removeClass('hidden');
			$(".con-history").addClass('hidden');
		} else {
			$(".con-history").removeClass('hidden');
			$(".base-info").addClass('hidden');
		}
	})
	blDetail.on('onPrevClick', function () {
		var buyerLeadMod;

		buyerLeadMod = Can.Application.getModule('buyerLeadManageModuleId');
		if (!buyerLeadMod) {
			return false;
		}
		var queue = buyerLeadMod.queue, prev = queue[this.bid].prev;
		blDetail.bid = prev;
		blDetail.loadData({"buyerleadId": prev});
	});
	blDetail.on('onNextClick', function () {
		var buyerLeadMod;

		buyerLeadMod = Can.Application.getModule('buyerLeadManageModuleId');

		if (!buyerLeadMod) {
			return false;
		}
		var queue = buyerLeadMod.queue, next = queue[this.bid].next;
		blDetail.bid = next;

		blDetail.loadData({"buyerleadId": next});


	});


	blDetail.on('onBackClick', function () {
//            Can.Route.run('/manage-buyBuyingLead');
		$("#mbuyerleadBtnId").trigger("click");
	});


	blDetail.on('onExhibitTipClick', function ($Li) {
		var liList = $Li.parent().find("li"), nWidth = $(".exhibit_content li").eq(0).width();
		var index = liList.index($Li);
		$Li.addClass("cur").siblings().removeClass("cur");
		$(".exhibit_content").stop().animate({"margin-left": -(index * nWidth) + "px"}, 'slow');
	});

	blDetail.on('onExhibitPicClick', function ($Pic, oExhibitor) {
		Can.importJS(['js/utils/scanPhotoView.js']);
		var ExhibitPicWin = new Can.view.titleWindowView({
			title: Can.msg.INFO_WINDOW.BOOTH_CLEANUP,
			width: 830
		});
		var photoView = new Can.view.scanPhotoView({height: 560, pho_List: oExhibitor.imageList});
		photoView.startup();
		ExhibitPicWin.setContent(photoView.ContainerEL);
		ExhibitPicWin.show();
	});


	blDetail.on('showBooth', function ($p) {
		oShowBooth.show();
		oShowBooth.updateContent($p.attr("data-code"));
		oShowBooth.updateCss({
			left: $p.offset().left - 70,
			top: $p.offset().top + $p.height(),
			zIndex: 851
		});
	})
	blDetail.on('hideBooth', function () {
		oShowBooth.hide();
	})

	blDetail.contentEl.on('click', '[role=reply]', function () {
		var $this = $(this);

		$this.hide();
		$this.siblings('.send').show()
			.find('input').animate({
				width: '600'
			});
	});

	var _breplay = false;
	blDetail.contentEl.on('click', '[role=submit-reply]', function () {
		var $this = $(this);
        var _content = $this.siblings('input[name=content]').val();

        if(!$.trim(_content)){
            var _win = new Can.view.alertWindowView({
                width:200
            });
            _win.setContent('<div class="error-box">the content is empty</div>');
            _win.show();
            return;
        }

        if(!_breplay){
        	$.ajax({
				type: 'POST',
				url: Can.util.Config.email.sendEmail,
				data: $this.parent().serialize(),
				beforeSend: function(){
					_breplay = true;
				},
				complete: function(){
					_breplay = false;
				},
				success: function (d) {
					$this.parent().hide()
						.siblings('.btn-reply').show();
					if(d['status'] === 'success'){
						Can.util.notice(Can.msg.cclick.l15);
					} else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, d, true);
					}
				}
			});
        }

	});

	/*名片触发*/
	blDetail.on('ON_CARD_CLICK', function (nId) {
		Can.util.canInterface('personProfile', [1, nId]);
	});
});
