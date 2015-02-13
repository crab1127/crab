/**
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-5-16
 */

$.moduleAndViewAction('pushSpCardViewId', function (pushSpCard) {
	pushSpCard.onInqClick(function () {
		var spData = pushSpCard.data;
		var nType = spData.type;
		var _data = {inquiry: []};
		var _subject;
		if (nType === 1 || nType === 4) {
			//发产品询盘
			_data.inquiry.push({
				supplierId: spData.supplierId,
				supplierName: spData.supplierName,
				companyId: spData.companyId,
				companyName: spData.supplierCompany,
				products: [
					{
						productId: spData.productId,
						productTitle: spData.productTitle,
						productPhoto: spData.pushPic
					}
				]
			});
			_subject = Can.msg.MESSAGE_WINDOW.INQUIRY_SUBJECT.replace('[@]', spData.productTitle);
		}
		else {
			//发公司询盘
			_data.inquiry.push({
				supplierId: spData.supplierId,
				supplierName: spData.supplierName,
				companyId: spData.companyId,
				companyName: spData.supplierCompany,
				products: null
			});
			_subject = Can.msg.MESSAGE_WINDOW.INQUIRY_SUBJECT.replace('[@]', 'company');
		}
		Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, _data, _subject]);

	});

	// mark as favorite
	pushSpCard.contentEl.on('click', '[role=mark]', function (e) {
		var trigger = $(this)
			, data = Can.util.room[$(this).closest('[role=item]').data('room')]
			, typeRaw = data.type
			, type = (typeRaw === 1 || typeRaw === 4) ? 2 : 1
			, id = type === 1 ? data.companyId : data.productId
			;

		Can.ui.favorite({
			trigger: trigger,
			url: {
				mark: Can.util.Config.favorite.mark,
				tag: Can.util.Config.favorite.tag
			},
			data: {
				collectContentId: id,
				collectType: type
			}
		});

		$.ajax({
			url: Can.util.Config.buyer.indexModule.markPushInfo,
			type: 'POST',
			data: {
				pushInfoId: data.pushInfoId,
				isReadCollect: 1
			}
		});

		e.stopPropagation();
	});

	/*超长内容hove显示全部*/
	pushSpCard.contentEl.on('mouseenter', '[role=item] .hoe', function () {
		var $Dock = $(this).children('.dock-wrap');
		var $Clone = $Dock.clone();
		$Clone.appendTo($(document.body)).addClass('outer')
			.css({
				left: $Dock.offset().left,
				top: $Dock.offset().top,
				width: $Dock.width()
			})
			.on('mouseleave', function () {
				$Clone.remove();
			});
	});

	pushSpCard.onPushWrapClick(function () {
		var $Obj = this.children('a');
		var nType = pushSpCard.data.type;
		var nId = pushSpCard.data.productId;
		var sTitle = pushSpCard.data.productTitle;
		var productDetailModule;
		switch (nType) {
			case 1://product
				Can.util.canInterface('productDetail', [nId, sTitle, 'buyerIndexModule']);
				break;
			case 2://video
				break;
			case 3://url
				$Obj.attr({
					target: '_blank',
					href:Can.util.thirdDomainURLFor(pushSpCard.data.suppDomain) + Can.util.Config.seller.showroom.rootURL_RE + pushSpCard.data.companyId + '.html'
				});
				break;
			case 4://product
				Can.util.canInterface('productDetail', [nId, sTitle, 'buyerIndexModule']);
				break;
			default ://url
				$Obj.attr({
					target: '_blank',
					href:Can.util.thirdDomainURLFor(pushSpCard.data.suppDomain) + Can.util.Config.seller.showroom.rootURL_RE + pushSpCard.data.companyId + '.html'
				});
		}

		$.ajax({
			type: 'POST',
			url: Can.util.Config.buyer.indexModule.markPushInfo,
			data: {
				pushInfoId: pushSpCard.data.pushInfoId,
				isReadCollect: 0
			}
		});
	});
	pushSpCard.onPersonClick(function () {
		Can.util.canInterface('personProfile', [1, pushSpCard.data.supplierId]);
	});
});
