/**
 * @Author: sam
 * @Version: 1.1
 * @Update: 13-2-1
 *
 * @auther: vfasky
 * @date: 13-3-29
 * 增加:
 * - 查看名片
 * - 查看产品
 * - 发送询盘
 * - 加入收藏
 */

$.moduleAndViewAction('myRoomModuleId', function (myRoom) {
	Can.importJS(['js/buyer/view/myRoomModule.js']);

	//加入收藏
	myRoom.on('add_fav', function (data, el) {
		var id,
			type = data.type;

		if (type === 1 || type === 4) {
			// bmark product
			type = 2;
			id = data.productId;
		} else {
			// bmark company
			type = 1;
			id = data.companyId;
		}

		Can.ui.favorite({
			trigger: $(el),
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
	});

	// 发送询盘
	myRoom.on('send_inquiry', function (data) {
		var _subject,
			inquiry = [],
			type = data.type;

		if (type === 1 || type === 4) {
			// product
			inquiry.push({
				supplierId: data.supplierId,
				supplierName: data.supplierName,
				companyId: data.companyId,
				companyName: data.supplierCompany,
				products: [
					{
						productId: data.productId,
						productTitle: data.productTitle,
						productPhoto: data.pushPic
					}
				]
			});
			_subject = Can.msg.MESSAGE_WINDOW.INQUIRY_SUBJECT.replace('[@]', data.productTitle);
		}
		else {
			// company
			inquiry.push({
				supplierId: data.supplierId,
				supplierName: data.supplierName,
				companyId: data.companyId,
				companyName: data.supplierCompany,
				products: null
			});
			_subject = Can.msg.MESSAGE_WINDOW.INQUIRY_SUBJECT.replace('[@]', 'company');
		}

		Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, { inquiry: inquiry }, _subject]);
	});

	// 查看名片
	myRoom.on('person_name_action', function (listObj) {
		Can.util.canInterface('personProfile', [1, listObj.supplierId]);
	});
	// 查看详情
	myRoom.on('title_action', function (data) {
		// 如果是产品的推送则在原界面里查看产品
		if (data['type'] === 1 || data['type'] === 4) {
			var sTitle = ' ';//data.productTitle;
			var nId = data.productId;
			Can.util.canInterface('productDetail', [nId, sTitle, 'myRoomModuleId']);
		}
		$.ajax({
			url: Can.util.Config.buyer.indexModule.markPushInfo,
			type: 'POST',
			data: {
				pushInfoId: data.pushInfoId,
				isReadCollect: 0
			}
		});
	});

	myRoom.on('onreturnclick', function () {

		myRoom.loadSearchList(Can.util.Config.buyer.myroomModule.detail_itmes);
	});

	// inquiry
	myRoom.contentEl.on('click', '[role=filter]', function (e) {
		myRoom.node.page.val(1);
		//console.log(myRoom)
		myRoom.contentEl.find('.fil-none').remove();
		myRoom.filterList();
	});

	// pager
	myRoom.contentEl.on('click', 'li[pagenum]', function (e) {
		myRoom.node.page.val($(this).attr('pagenum'));
		myRoom.filterList();
	});

	// back to all view
	myRoom.contentEl.on('click', '[role=back]', function (e) {
		myRoom.node.page.val(1);
		myRoom.searchField.setValue('');
		myRoom.categoryField.selectValue(0);
		myRoom.filterList();
	});

	// go to search
	myRoom.contentEl.on('click', '[role=search]', function () {
		$('#searchBtnId').trigger('click');
	});

	myRoom.contentEl.on('keyup', 'input[name=keyword]', function (event) {
		if (event.keyCode === 13) {
			myRoom.node.page.val(1);
			myRoom.contentEl.find('.fil-none').remove();
			myRoom.filterList();
		}
	});
	/*
	 * TODO[next]
	 * Auto Loading
	 */
	/*
	 myRoom.on('ON_SCROLL', function () {
	 });
	 */
});
