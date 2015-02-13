/**
 * message center
 * @Author: sam
 * @Version: 1.6
 * @Since: 13-3-2
 */
$.moduleAndViewAction('msgCenterInboxViewID', function (inboxView) {
	var jMailList = {};
	/*load data*/
	inboxView.on('ON_LOAD_DATA', function (mailListObj) {
		var _userType = Can.util.userInfo().getUserType();
		var _th = this;
		//邮件数组，生成表格时用到
		var mailList = [];
		var isReadCss = new Array(mailListObj.length);
		var table = this.tableNav;
		for (var i = 0; i < mailListObj.length; i++) {
			//add to Mail List
			jMailList[mailListObj[i].messageId] = mailListObj[i].read;
			mailList[i] = [];

			//TR css
			var isReadTip = null;
			var span_letterboxCss = "bg-ico ico-read ico-chked";
			if (!mailListObj[i].read) {
				isReadCss[i] = "unread";
				isReadTip = Can.msg.MODULE.MSG_CENTER.NOT_READ;
				span_letterboxCss = "bg-ico ico-read";
			} else {
				isReadCss[i] = "read";
				isReadTip = Can.msg.MODULE.MSG_CENTER.READ;
			}
            //TR ATTENTION
            if (mailListObj[i].attention) {
                isReadCss[i] = "attention";
                isReadTip = Can.msg.MODULE.MSG_CENTER.ATTENTION;;
                span_letterboxCss = "bg-ico ico-attention";
            }

            var bSys = false;
			var typeCss, typeTip;
			var _refer_type = (mailListObj[i].referType || 'email').split('_');
			switch (_refer_type[_refer_type.length - 1]) {
				case 'inquiry':
					typeCss = "bg-ico ico-msg-s3";
					typeTip = Can.msg.MODULE.MSG_CENTER.TYPE1;
					break;
				case 'email':
					typeCss = "bg-ico ico-msg-s2";
					typeTip = Can.msg.MODULE.MSG_CENTER.TYPE2;
					break;
				default :
					typeCss = "bg-ico ico-msg-s1";
					typeTip = Can.msg.MODULE.MSG_CENTER.TYPE3;
					bSys = true;
			}

			var selField = new Can.ui.tick({
				elName: 'inboxTick',
				value: mailListObj[i].messageId
			});
			selField.on('ON_TICK', function (isChecked) {
				if (isChecked) {
					$(this).parents("tr").addClass("selected");
				}
				else {
					$(this).parents("tr").removeClass("selected");
				}
			}, selField.el);
			var span_letterbox = $('<span class="' + span_letterboxCss + '" cantitle="' + isReadTip + '"></span>');
			var senderNav = new Can.ui.Panel({cssName: 'mod-person'});
			// 发件人头像
			var senderPic = new Can.ui.Panel({
				cssName: 'pic',
				html: bSys ? '<img width="30" height="30" src="' + Can.util.Config['static']['defaultImage']['system'] + '" />' : Can.util.formatImage(mailListObj[i].contacter.header, '30x30', (mailListObj[i].contacter.gender || 'male'))
			});
			senderNav.addItem(senderPic);
			var senderInfo = new Can.ui.Panel({cssName: 'info'});
			// 发件人名称
			var sendName = new Can.ui.Panel({
				wrapEl: 'p',
				cssName: 'name',
				html: bSys ? '<span>' + Can.msg.MODULE.MSG_CENTER.SYS_SENDER + '</span>' : '<a href="javascript:;" id=' + mailListObj[i].contacter.id + '>' + mailListObj[i].contacter.name + '</a>'
			});
			if (!bSys) {
				sendName.el.children('a').attr("cantitle", Can.msg.MODULE.MSG_CENTER.NAME_P);
				sendName.click(function () {
					if (!this.el.find('a').length) {
						return;
					}
					var $Tr = this.el.parents('tr');
					var oData = $Tr.data('dataRoom');
					Can.util.canInterface('personProfile', [oData.contacter.type , this.el.find('a').attr('id')]);
				});
			}
			senderInfo.addItem(sendName);
			if (!bSys && mailListObj[i].contacter.countryId) {
				var sendCnt = new Can.ui.Panel({
					wrapEl: 'p',
					cssName: 'country',
					html: '<span class="flags fs' + (mailListObj[i].contacter.countryId || '') + '"></span><span class="txt" cantitle="' + (mailListObj[i].contacter.countryName || '') + '">' + (mailListObj[i].contacter.countryName || '') + '</span>'
				});

				//根据/issues/2595 需求 @author lubenxia
				//采购商和供应商类型不同，返回不同地区显示。
				if (_userType == 2) {
					sendCnt.el.find('.txt').attr('cantitle', Can.util.formatRegion(mailListObj[i].contacter.region)).text(Can.util.formatRegion(mailListObj[i].contacter.region));
				}

				senderInfo.addItem(sendCnt);

			}
            //未审核通过ICON
            if (!bSys && (mailListObj[i].contacter.auditStatus==-5)) {
                var verifyCnt = new Can.ui.Panel({
                    wrapEl: 'p',
                    cssName: 'unverify',
                    html: '<span class="member-verify" cantitle="' + Can.msg.MODULE.MSG_CENTER.UNVERIFY  + '"></span>'
                });
                senderInfo.addItem(verifyCnt);
            }
			senderNav.addItem(senderInfo);
			//根据 /issues/334 需求 @author vfasky
			//var myContacterCss = !mailListObj[i].contacter.isCustomer ? "bg-ico ico-contact" : "bg-ico ico-contacted";
			//var myContacterTip = !mailListObj[i].contacter.isCustomer ? Can.msg.MODULE.MSG_CENTER.MY_CONTACT0R_TIP1 : Can.msg.MODULE.MSG_CENTER.MY_CONTACT0R_TIP2;
			// var myContacterIcon = $('<span class="contact-' + mailListObj[i].contacter.id + ' ' + myContacterCss + '" cantitle="' + myContacterTip + '"></span>');
			// //添加为联系人 事件
			// myContacterIcon.click(function () {
			// 	if ($(this).hasClass("ico-contact")) {
			// 		_th.fireEvent('ON_ADD_CONTACT', $(this).parents("tr"));
			// 	}
			// });
			var myContacterIcon = $('<span></span>');
			var subjectNav = $('<div class="msg-title"><a href="javascript:;">' + mailListObj[i].subject + '</a></div>');
			// 阅读消息详细信息 事件
			subjectNav.on('click', 'a', i, function (event) {
				function __fUpdateState(jMsg) {
					if (!jMsg.read) {
						inboxView.updateUnread();
						inboxView.changeState(jMsg.messageId);
					}
				}

				function __fDelItem(jMsg) {
					inboxView.parentEl.menuView.setUnreadNum();
					inboxView.setMessageData();
				}

				var _emailParam = {
					page: inboxView.page_feild.current,
					messageId: mailListObj[event.data].messageId,
					msgType: inboxView.allTypeFeild.getValue(),
					keyword: inboxView.select_textFeild.getValue(),
					msgSource: 1
				};
				Can.util.canInterface('readEmail', [_emailParam, __fUpdateState, __fDelItem]);
			});
			var typeNav = $('<span class="' + typeCss + '" cantitle="' + typeTip + '"></span>');
			var dateTimeNav = $('<span>' + Can.util.formatDateTime(mailListObj[i].createTime, 'YYYY-MM-DD') + '</span>');

			mailList[i].push(selField);
			mailList[i].push(span_letterbox);
			mailList[i].push(senderNav.el);
			mailList[i].push(myContacterIcon);
			mailList[i].push(subjectNav);
			mailList[i].push(typeNav);
			mailList[i].push(dateTimeNav);
		}
		//记录当前面数据的条数
		inboxView.itemCount = i;

		table.data['room'] = mailListObj;
		table.data['item'] = mailList;
		table.update();
		for (var r = 0; r < isReadCss.length; r++) {
			this.tableNav.tbody.children("tr").eq(r).addClass(isReadCss[r]);
		}
	});
	/*add to contact*/
	inboxView.on('ON_ADD_CONTACT', function ($Tr) {
		var oContact = $Tr.data('dataRoom').contacter;
		var _contact = {
			id: oContact.id,
			contactType: oContact.type
		};
		Can.util.canInterface('addToContact', [_contact, function () {
			Can.util.notice(Can.msg.MODULE.MSG_CENTER.ADD_CONTACT_SUCCESS);
			inboxView.tableNav.tbody.find('.contact-' + oContact.id).removeClass('ico-contact').addClass('ico-contacted');
		}]);
	});
	/*click tr to select*/
	inboxView.tableNav.on('ON_TR_CLICK', function ($Tr, event) {
		if (event.target.tagName.toUpperCase() !== 'A') {
			$Tr.toggleClass('selected');
			var $Chk = $Tr.find('input[type="checkbox"]');
			if ($Tr.hasClass('selected')) {
				$Chk.attr('checked', true);
			}
			else {
				//trigger have a problem, so...
				$Chk.attr('checked', true);
				$Chk.attr('checked', false);
				inboxView.selectAllFeild.labelEL.removeClass('ticked');
			}
		}
	});
	/*hover tr to show delete button*/
	inboxView.tableNav.on('ON_TR_OVER', function ($Tr, jData) {
		$Tr.addClass('hover');
		inboxView.delIco
			.show()
			.css({
				top: $Tr.offset().top,
				left: $Tr.offset().left + $Tr.width()
			})
			.data('msgId', jData.messageId)
			.mouseleave(function () {
				$Tr.removeClass('hover');
				$(this).hide();
			});
		$Tr.unbind('mouseleave').bind('mouseleave', function (event) {
			if (event.relatedTarget != inboxView.delIco[0]) {
				$Tr.removeClass('hover');
				inboxView.delIco.hide();
			}
		});
	});

	inboxView.on('ON_EXPORT', function () {
		//后台实现
		/*var checkedBoxes = [];
		 var trs = this.tableNav.tbody.find("tr").find("input[type='checkbox']");
		 for (var i = 0; i < trs.length; i++) {
		 if (trs.eq(i).attr("checked")) {
		 checkedBoxes.push(trs.eq(i).attr("id"));
		 }
		 }
		 if (checkedBoxes.length > 0) {
		 alert(checkedBoxes);
		 }
		 else {
		 alert("EXPORTBTN_CLICK")
		 }*/
	});
	/*click delete button*/
	inboxView.on('ON_DEL_CLICK', function (oDelBtn) {
		var nMsgId = $(oDelBtn).data('msgId');
		oDelBtn.hide();
		inboxView.fireEvent('ON_DELETE_CLICK', nMsgId);
	});
	/*delete msg*/
	inboxView.on('ON_DELETE_CLICK', function (nMessageId) {
		var _this = this;
		var param = [];
		var trs;
		if (nMessageId) {
			param.push(nMessageId);
		}
		else {
			trs = this.tableNav.tbody.find("input[type='checkbox']");
			if (!trs.filter(":checked").size()) {
				Can.util.notice(Can.msg.MODULE.MSG_CENTER.SELECTED);
				return;
			}
			trs.filter(":checked").each(function () {
				param.push($(this).val());
			});
		}
		$.ajax({
			url: Can.util.Config.email.deleteEmail,
			type: 'POST',
			data: Can.util.formatFormData({msgIds: param}),
			success: function (mData) {
				if (mData.status && mData.status == "success" && mData.data.result) {
					// 刷新顶部未读数
					for (var i = 0; i < param.length; i++) {
						if (!jMailList[param[i]]) {
							Can.util.EventDispatch.dispatchEvent('ON_UNREAD_MSG_REFS', param[i]);
						}
					}
					//刷新未读邮件数
					_this.parentEl.menuView.setUnreadNum();
					_this.setMessageData();
					Can.util.notice(Can.msg.MODULE.MSG_CENTER.MOVE_TRASH);
				}
				else {
					Can.util.notice(Can.msg.MODULE.MSG_CENTER.DELETE_FAIL);
				}
			}
		})
	});
	/*refresh list*/
	inboxView.parentEl.on('ON_REFRESH_LIST', function () {
		if (inboxView.el.is(':visible')) {
			inboxView.parentEl.menuView.setUnreadNum();
			inboxView.setMessageData();
		}
	});
});
