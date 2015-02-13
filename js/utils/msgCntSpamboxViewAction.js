/**
 * message center
 * @Author: sam
 * @Version: 1.4
 * @Since: 13-3-2
 */
$.moduleAndViewAction('msgCntSpamboxViewID', function (SpamboxView) {
	var jMailList = {};
	/*load data*/
	SpamboxView.on('ON_LOAD_DATA', function (mailListObj) {
		var _userType = Can.util.userInfo().getUserType();
		var table = this.tableNav;
		var i;
		var mailList = [];
		var isReadCss = [];
		for (i = 0; i < mailListObj.length; i++) {
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
				isReadTip = Can.msg.MODULE.MSG_CENTER.READ;
				isReadCss[i] = "read";
			}

			var bSys = false;
			var myContacterCss = '';
			var myContacterTip = !mailListObj[i].contacter.isCustomer ? Can.msg.MODULE.MSG_CENTER.MY_CONTACT0R_TIP1 : Can.msg.MODULE.MSG_CENTER.MY_CONTACT0R_TIP2;
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
				cssName: 'bg-ico ico-chk',
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
					html: '<span class="flags fs' + (mailListObj[i].contacter.countryId || '') + '"></span><span  cantitle="' + (mailListObj[i].contacter.countryName || '') + '" class="txt">' + (mailListObj[i].contacter.countryName || '') + '</span>'
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
			var myContacterIcon = $('<span class="' + myContacterCss + '" cantitle="' + myContacterTip + '"></span>');
			var subjectNav = $('<div class="msg-title"><a href="javascript:;">' + mailListObj[i].subject + '</a></div>');
			subjectNav.on('click', 'a', i, function (event) {
				var _emailParam = {
					page: SpamboxView.page_feild.current,
					messageId: mailListObj[event.data].messageId,
					msgType: SpamboxView.allTypeFeild.getValue(),
					keyword: SpamboxView.select_textFeild.getValue(),
					msgSource: 3
				};

				function __fDelItem(jMsg) {
					SpamboxView.fireEvent('ON_DELETE_FEV', jMsg.messageId);
				}

				Can.util.canInterface('readEmail', [_emailParam, false, null, __fDelItem]);
			});
			var typeNav = $('<span class="' + typeCss + '" cantitle="' + typeTip + '"></span>');
			var dateTimeNav = $('<span>' + mailListObj[i].createTime.split(" ")[0] + '</span>');

			mailList[i].push(selField);
			mailList[i].push(span_letterbox);
			mailList[i].push(senderNav.el);
			mailList[i].push(myContacterIcon);
			mailList[i].push(subjectNav);
			mailList[i].push(typeNav);
			mailList[i].push(dateTimeNav);
		}
		//记录当前面数据的条数
		SpamboxView.itemCount = i;

		table.data['room'] = mailListObj;
		table.data['item'] = mailList;
		table.update();
		for (i = 0; i < isReadCss.length; i++) {
			this.tableNav.tbody.children("tr").eq(i).addClass(isReadCss[i]);
		}
	});
	/*click tr to select*/
	SpamboxView.tableNav.on('ON_TR_CLICK', function ($Tr, event) {
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
				SpamboxView.selectAllFeild.labelEL.removeClass('ticked');
			}
		}
	});
	/*hover tr to show delete button*/
	SpamboxView.tableNav.on('ON_TR_OVER', function ($Tr, jData) {
		$Tr.addClass('hover');
		SpamboxView.delIco
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
			if (event.relatedTarget != SpamboxView.delIco[0]) {
				$Tr.removeClass('hover');
				SpamboxView.delIco.hide();
			}
		});
	});
	/*click delete button*/
	SpamboxView.on('ON_DEL_CLICK', function (oDelBtn) {
		var nMsgId = $(oDelBtn).data('msgId');
		oDelBtn.hide();
		SpamboxView.fireEvent('ON_DELETE_FEV', nMsgId);
	});
	/*wipe msg*/
	SpamboxView.on('ON_DELETE_FEV', function (nMessageId) {
		var _this = this;
		var param = [];
		var trs;
		if (nMessageId) {
			param.push(nMessageId);
			trs = this.tableNav.tbody.find('input[type="checkbox"][value="' + nMessageId + '"]').parents('tr');
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
			url: Can.util.Config.email.wipeEmail,
			data: Can.util.formatFormData({msgIds: param}),
			type: 'POST',
			success: function (mData) {
				if (mData.status && mData.status == "success" && mData.data.result) {
					_this.setMessageData();
					Can.util.notice(Can.msg.MODULE.MSG_CENTER.DEL_SUCCESS);
				}
				else {
					Can.util.notice(Can.msg.MODULE.MSG_CENTER.DELETE_FAIL);
				}
			}
		});
	});
	/*restore msg*/
	SpamboxView.on('ON_RESTORE_CLICK', function () {
		var _this = this;
		var trs = this.tableNav.tbody.find("tr").find("input[type='checkbox']");
		if (!trs.filter(":checked").size()) {
			Can.util.notice(Can.msg.MODULE.MSG_CENTER.SELECTED);
			return;
		}
		var param = [];
		trs.filter(":checked").each(function () {
			param.push($(this).val());
		});
		$.ajax({
			url: Can.util.Config.email.restoreEmail,
			data: Can.util.formatFormData({msgIds: param}),
			type: "post",
			success: function (mData) {
				if (mData.status && mData.status == "success" && mData.data.result) {
					// 刷新顶部未读数
					for (var i = 0; i < param.length; i++) {
						if (!jMailList[param[i]]) {
							Can.util.EventDispatch.dispatchEvent('ON_UNREAD_MSG_REFS', param[i], true);
						}
					}
					//列新未读邮件数
					_this.parentEl.menuView.setUnreadNum();
					Can.util.notice(Can.msg.MODULE.MSG_CENTER.RESTORE_SUCCESS);
					//重新加载列表
					_this.setMessageData();
				}
				else {
					Can.util.notice(Can.msg.MODULE.MSG_CENTER.RESTORE_FAIL);
				}
			}
		})
	});
	/*refresh list*/
	SpamboxView.parentEl.on('ON_REFRESH_LIST', function () {
		if (SpamboxView.el.is(':visible')) {
			SpamboxView.parentEl.menuView.setUnreadNum();
			SpamboxView.setMessageData();
		}
	});
});
