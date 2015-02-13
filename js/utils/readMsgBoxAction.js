/**
 * @Author: AngusYoung
 * @Version: 2.0
 * @Since: 13-4-13
 */

$.moduleAndViewAction('readMsgBoxViewId', function (readMsgBox) {

	var fExtra = function (oItem, oStage) {
		var aExtra = [],
			rid = Math.ceil(Math.random() * 100000);

		/* Buyinglead Inquiry */
		if (oItem.actionType === 'receive' && oItem.referType === 'cclick') {
			// var sSentence = Can.util.userInfo().getUserType() * 1 === 1 ? Can.msg.cclick.l2 : Can.msg.cclick.l1,
			var sSentence = Can.msg.cclick.l2,
				sBuyigleadTitleID = 'random-id-' + Math.ceil(Math.random() * 100);


			aExtra = [
				'<div class="inquiry-buyinglead">',
				'<p>' + sSentence + ': <a id="' + sBuyigleadTitleID + '" target="_blank" href="' + (Can.util.userInfo().getUserType() === 1 ? '/C/supplier/#!/show-buyinglead?id=' + oItem.referId : '/C/buyer/#!/show-buyingLead?id=' + oItem.referId) + '">LeadEXpress</a></p>',
				'<div id="inquiry-bl-card-' + rid + '"></div>',
				'</div>'
			];

			$.ajax({
				url: (Can.util.userInfo().getUserType() === 1 ? Can.util.Config.seller.buyerleadDetailModule.supplierDetail : Can.util.Config.seller.buyerleadDetailModule.buyerDetailIn),
				data: {
					leadId: oItem.referId
				},
				success: function (d) {
					$('#' + sBuyigleadTitleID).text(d.data.productName);
				}
			});

			if (aExtra.length) {
				oStage.html(aExtra.join(''));
			}

			/* buyer */
			if (Can.util.userInfo().getUserType() === 2) {
				fCard(oItem, rid);
			}
		}
	};

	var fCard = function (oItem, rid) {
		$.ajax({
			url: Can.util.Config.buyer.profileWindow.supplierProfile + '?userId=' + oItem.contacter.id,
			success: function (d) {
				var jInfo = d.data.baseInfo;

				$('#inquiry-bl-card-' + rid).html([
					'<div class="mod-card mod-card-t2">',
					'<div class="mod-title">',
					jInfo.profile[1].company + '<span class="mth-icon">' + jInfo.numOfExh + '</span>',
					'</div>',
					'<div class="mod-body">',
					'<div class="mod-person">',
					'<div class="pic">' + Can.util.formatImage(jInfo.userPhoto, '60x60', jInfo.profile[0].gender) + '</div>',
					'<div class="info txt-tit">',
					'<p class="name">' + jInfo.userName + '</p>',
					'<p class="txt-tit"><span class="flags fs' + jInfo.countryId + '"></span><span class="txt">' + jInfo.countryName + '</span></p>',
					'<p class="txt-tit">' + Can.msg.INFO_WINDOW.GENDER + '<em>' + jInfo.profile[0].gender + '</em></p>',
					'<p class="txt-tit">' + Can.msg.INFO_WINDOW.POSTS + '<em>' + jInfo.profile[0].position + '</em></p>',
					'</div>',
					'</div>',
					'<div class="txt-info-s1">',
					'<p class="txt-tit">' + Can.msg.INFO_WINDOW.EMAIL + '<em><a href="mailto:' + jInfo.profile[0].email + '">' + jInfo.profile[0].email + '</a></em></p>',
					'<p class="txt-tit">' + Can.msg.INFO_WINDOW.SKYPE + '<em>' + jInfo.profile[0].skype + '</em></p>',
					'<p class="txt-tit">' + Can.msg.INFO_WINDOW.TELEPHONE + ':<em>' + jInfo.profile[0].telephone + '</em></p>',
					'<p class="txt-tit">' + Can.msg.INFO_WINDOW.FAX + '<em class="price">' + jInfo.profile[0].fax + '</em></p>',
					'<p class="txt-tit">' + Can.msg.INFO_WINDOW.ADDRESS + '<em class="price">' + jInfo.profile[0].address + '</em></p>',
					'<p class="txt-tit">' + Can.msg.INFO_WINDOW.ZIP + '<em class="price">' + jInfo.profile[0].zipCode + '</em></p>',
					'</div>',
					'</div>',
					'</div>'
				].join(''));
			}
		});
	};

	/*关闭邮件窗口*/
	readMsgBox.parentEl.onClose(function () {
		readMsgBox.stepArea.remove();
	});
	/*回复邮件*/
	readMsgBox.onReply(function () {
		var _item = readMsgBox.items[readMsgBox.currentIndex];
		var _data = {
			msgId: _item.messageId,
			subject: Can.msg.MESSAGE_WINDOW.REPLY + _item.subject,
			address: {
				value: _item.contacter.id,
				text: _item.contacter.name
			},
			content: '<p>&nbsp;</p><p>&nbsp;</p><hr>' +
				'<h1>' + _item.subject + '</h1>' +
				'<span style="color: #999;">' + Can.msg.MESSAGE_WINDOW.FROM + '&nbsp;<em style="color: #333;">' + _item.contacter.name + '</em></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
				/*'<span style="color: #999;">' + Can.msg.MESSAGE_WINDOW.TO + '&nbsp;<em style="color: #333;">' + _item.emailTo + '</em></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +*/
				'<span style="color: #999;">' + Can.msg.MESSAGE_WINDOW.TIME + '&nbsp;<em style="color: #333;">' + Can.util.formatDateTime(_item.createTime, 'YYYY-MM-DD hh:mm') + '</em></span>' +
				'<div>' + _item.content + '</div>'
		};
		Can.util.canInterface('writeEmail', [Can.msg.MESSAGE_WINDOW.REPLY_TIT, _data , true]);
	});
	/*读取邮件内容*/
	readMsgBox.on('ON_READ_EMAIL', function (oItem, $Wrap) {
		
		if ($Wrap.length) {
			$.ajax({
				url: Can.util.Config.email.readEmail,
				data: {messageId: oItem['messageId']},
				success: function (jData) {
					if (jData.status && jData.status === 'success') {
						//append attachments
						var oAttach = jData.data.item.attachments;
						var $Attach = $Wrap.prev();
						var _attach = '';
						if (oAttach) {
							for (var i = 0; i < oAttach.length; i++) {
								var _attachments = oAttach[i].split('|').concat(['UNKNOWN', '0']);
								var _file = _attachments[0];
								var _file_limit = _file.split('.');
								var _extension = _file_limit[_file_limit.length - 1];
								var _name = _attachments[1];
								var _size = Can.util.formatFileSize(_attachments[2]);
								_attach += '<li class="ext-name-' + _extension + '"><a href="' + _file + '" target="_blank">' + _name + '</a><em>(' + _size + ')</em></li>';
							}
							if (_attach) {
								_attach = '<ul class="attach-list">' + _attach + '</ul>';
							}
						}

						$Attach.append(_attach);
						

						//update content
						var _content = jData.data.item.content;
						$Wrap.html(_content);
						readMsgBox.items[readMsgBox.currentIndex].content = _content;
						// add relative object
						if (oItem['label'] === 'inbox') {
							switch (oItem['referType']) {
								case 'system_ccoin':
									// add the view more button
									$Wrap.append('<!-- <br> --><a class="btn btn-s11 go-to-coin-more" href="javascript:;">' + Can.msg.MODULE.MSG_CENTER.VIEW_MORE + '</a>');
									break;
							}
							
						}

						fExtra(jData.data.item, $Wrap.siblings('.email-extra'));
						// readMsgBox.items[readMsgBox.currentIndex].content = _content;
						//run callback
						if (typeof readMsgBox.onReadItem === 'function') {
							readMsgBox.onReadItem(oItem);
						}
						if (!oItem['read']) {
							//set read state for this item.
							oItem['read'] = true;
							if (oItem['label'] === 'inbox') {
								// trigger unread msg refresh
								Can.util.EventDispatch.dispatchEvent('ON_UNREAD_MSG_REFS', oItem['messageId']);
							}
						}

						// add by xdz time 2014年5月21日11:00:23
						var parentH=$(".msg-item").height();
						var sonH=$Wrap.height();
						//alert("parentH="+parentH)
						//alert("sonH="+sonH)
						 if(sonH>=parentH){
							 //alert("内容较长");
							$Wrap.parent().find('.newtips').css("position","relative");
						 }else{
							 //alert("内容适中");
							$Wrap.parent().find('.newtips').css("position","absoulute");
						 }
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		}
	});
	/*删除邮件回调*/
	readMsgBox.on('ON_DELETE_EMAIL', function (oItem) {
		if (typeof readMsgBox.onDelItem === 'function') {
			readMsgBox.onDelItem(oItem);
		}
	});
	/*系统邮件，邮件内容带操作的*/
	readMsgBox.on('ON_SYS_EMAIL', function (jMsg, $Wrap) {
		$Wrap.off('click')
			// 查看C币消费详情
			.on('click', '.go-to-coin-more', function () {
				readMsgBox.parentEl.close();
				Can.Route.run('/coinsdetail');
			})
			// 去到联系人管理
			.on('click', '.go-to-contacter', function () {
				readMsgBox.parentEl.close();
				$('#customerBtnId').trigger('click');
			})
			// 拒绝申请
			.on('click', '.sys-apply-no', function () {
				readMsgBox.sendEmail(Can.util.Config.email.sendEmail, {
					referType: 'contact_apply_n',
					receiver: jMsg.contacter.id
				});
				readMsgBox.deleteEmail(true);
			})
			// 同意申请
			.on('click', '.sys-apply-yes', function () {
				$.ajax({
					url: Can.util.Config.contacts.publicInfo,
					type: 'POST',
					data: {
						customerId: jMsg.contacter.customerId,
						infoDisclosed: 1
					},
					success: function (jData) {
						if (jData.status && jData.status === 'success') {
							readMsgBox.sendEmail(Can.util.Config.email.sendEmail, {
								referType: 'contact_apply_y',
								receiver: jMsg.contacter.id
							});
							readMsgBox.deleteEmail(true);
						}
						else {
							Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						}
					}
				});
			});
	});
});
