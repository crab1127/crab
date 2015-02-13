/**
 * @Author: AngusYoung
 * @Version: 1.9
 * @Since: 13-4-12
 */

$.moduleAndViewAction('userInfoBoxViewId', function (userInfoBox) {
	userInfoBox.onAddContactBtnClick(function () {
		var $Btn = this.el;
		var _fCb = function () {
			userInfoBox.showTips('<p class="des">' + Can.msg.INFO_WINDOW.ADD_CONTACT_TIPS + '</p>');
			$Btn.hide();
		};
		var _contact = {
			id: userInfoBox.currentPerson['userId'],
			contactType: userInfoBox.currentPerson['userType']
		};
		Can.util.canInterface('addToContact', [_contact, _fCb]);
	});

	userInfoBox.onPushBtnClick(function () {
		var _data = {
			buyerId: userInfoBox.currentPerson['userId'],
			buyerName: userInfoBox.currentPerson['userName']
		};
		Can.util.canInterface('pushInfo', [_data]);
	});

	userInfoBox.onContactBtnClick(function () {
		var _data = {
			address: {
				value: userInfoBox.currentPerson['userId'],
				text: userInfoBox.currentPerson['userName']
			}
		};
		Can.util.canInterface('writeEmail', [Can.msg.MESSAGE_WINDOW.WRITE_TIT, _data]);
	});

	userInfoBox.onActivityTabClick(function () {
		var $Cont = this;
		var $Wrap = $Cont.children('.activity-all-list');
		//console.info($Wrap[0].scrollTop, $Wrap[0].offsetHeight, $Wrap[0].scrollHeight)
		function __fCheckLoad() {
			if ($Wrap[0].scrollTop + $Wrap[0].offsetHeight == $Wrap[0].scrollHeight && !$Wrap.data('notLoad') && !$Wrap.data('loading')) {
				$Wrap.data('loading', true);
				$Wrap.ajaxComplete(function () {
					$Wrap.data('loading', false);
				});
				$.ajax({
					url: Can.util.Config.seller.profileWindow.singleBuyerActivity,
					showLoadTo: $Wrap,
					data: {
						buyerId: userInfoBox.currentPerson['userId'],
//						timeRange: 30,
						currentPage: $Wrap.data('page') || 1
					},
					success: function (jData) {
						$Wrap.find('.data-none').show();
						if (jData.status && jData.status === 'success') {
							if (!jData.data) {
								$Wrap.data('notLoad', true);
								return;
							}
							var _data = jData.data.action_list;
							if (!_data || !_data.length) {
								$Wrap.data('notLoad', true);
							}
							else {
								$Wrap.find('.data-none').remove();
								var _html = '';
								for (var i = 0; i < _data.length; i++) {
									var _item = _data[i];
									//生成动态的日志
									var _getLOG = Can.util.canInterface('buyerActivityLog', [_item]);
									_html += '<div class="item type-s1 clear">' +
										'   <div class="inner">' +
										'       <h3>' + _item.buyerName + _getLOG.eventTitle + '</h3>' +
										'       <div class="des">' + _getLOG.eventDesc +
										'       </div>' +
										'       <div class="e-info">' +
										'           <div class="ico-type"><span class="'+Can.util.getActivityIcon(_item.action)+'"></span></div>' +
										'           <div class="time">' +
										'               <strong>' + Can.util.formatDateTime(_item.createTime, 'hh:mm') + '</strong><br>' +
										'               <span>' + Can.util.formatDateTime(_item.createTime, 'DD MM YYYY', true) + '</span>' +
										'           </div>' +
										'       </div>' +
										'       <div class="bg-ico arrow"></div>' +
										'   </div>' +
										'</div>';
								}
								var _nScrollHei = $Wrap.scrollTop();
								$Wrap.append(_html);
								if ($Wrap.data('page') > 1) {
									$Wrap.animate({
										scrollTop: _nScrollHei + $Wrap.height() - 100
									}, 'slow');
								}
								$Wrap.data('page', ($Wrap.data('page') || 1) + 1);
								/*if ($Wrap.data('page') > jData.page.maxPage) {
								 $Wrap.data('notLoad', true);
								 }*/
							}
						}
						else {
							Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						}
					}
				});
			}
		}

		$Wrap.scroll(function () {
			__fCheckLoad();
		});
		__fCheckLoad();
	});
	
	var _xFllow = false;
	userInfoBox.onFollowSaveBtnClick(function () {
		var jRe = userInfoBox.getFollowData();
		//拆分数据
		var _contact = {
			id: userInfoBox.currentPerson['userId'],
			contactType: userInfoBox.currentPerson['userType'],
			groupId: jRe['groupId'],
			tags: jRe['remarks']
		};
		//添加为联系人
		Can.util.canInterface('addToContact', [_contact, function () {
			userInfoBox.addContactBtn.el.hide();
			//须先完成添加联系人addCustomer操作再继续下面的商务跟踪
			jRe[(userInfoBox.currentPerson['userType'] == 1 ? 'supplierId' : 'buyerId')] = userInfoBox.currentPerson['userId'];
			delete jRe.remarks;
			delete jRe.groupId;
			delete jRe.groupName;
			//保存商务跟踪
			if(!_xFllow){
				$.ajax({
					url: userInfoBox.currentPerson['userType'] == 1 ? Can.util.Config.seller.profileWindow.saveFollow : Can.util.Config.buyer.profileWindow.saveFollow,
					data: Can.util.formatFormData(jRe),
					type: 'POST',
					beforeSend: function(){
						userInfoBox.followSaveBtn.el.addClass('dis');
						_xFllow = true;
					},
					complete: function(){
						userInfoBox.followSaveBtn.el.removeClass('dis');
						_xFllow = false;
					},
					success: function (jData) {
						if (jData.status && jData.status === 'success') {
							userInfoBox.showTips(Can.msg.INFO_WINDOW.SAVED);
						}
						else {
							Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						}
					}
				});
			}
			
		}]);
	});
	
	var _xTips = false;
	userInfoBox.on('ON_TIPS_CLICK', function (sAction, obj) {
		switch (sAction) {
			case "push":
				userInfoBox.pushBtn.el.trigger('click');
				break;
			case "say":
				//如果有IM就调IM聊天否则就发申请
				//因为IM现在没有相应功能，所以暂时不加
				var _apply = Can.Application.getCanViews().get('applyPublicWindow');
				if (!_apply) {
					_apply = new Can.ui.tips({
						cssName: 'win-tips-s1',
						mainCss: 'apply-view',
						arrowCss: 'arrow-b',
						width: 420
					});
					var _applyTextArea = new Can.ui.textAreaField({
						isCount: true,
						maxLength: 400,
						blankText: '',
						width: 370,
						height: 80
					});
					var _applyWrap = $('<div class="box-cont"><p class="tit">' +
						Can.msg.INFO_WINDOW.APPLY_TIPS
							.replace('[@]', userInfoBox.currentPerson['userName'])
							.replace('[@@]', Can.msg.INFO_WINDOW[userInfoBox.currentPerson['userGender'] === 1 ? 'APPLY_MALE' : 'APPLY_FEMALE'])
						+ '</p></div>');
					_applyTextArea.applyTo(_applyWrap);
					_apply.updateContent(_applyWrap);

					var _applyAction = $('<div class="b-actions clear"></div>');
					var _sendBtn = new Can.ui.toolbar.Button({
						cssName: 'ui-btn btn-s btn-green',
						text: Can.msg.BUTTON.SEND
					});

					var _cancelBtn = new Can.ui.toolbar.Button({
						cssName: 'ui-btn btn-s btn-gray',
						text: Can.msg.BUTTON.CANCEL
					});
					_cancelBtn.applyTo(_applyAction);
					_sendBtn.applyTo(_applyAction);
					_apply.updateContent(_applyAction, true);

					//add button event
					_sendBtn.on('onclick', function () {
						var jParam = {
							referType: 'contact_apply',
							receiver: userInfoBox.currentPerson['userId'],
							subject: 'Contact to access application',
							content: _applyTextArea.getValue()
						};
						if(!_xTips){
							$.ajax({
								url: Can.util.Config.seller.profileWindow.sendApply,
								data: jParam,
								type: 'POST',
								beforeSend: function(){
									_sendBtn.el.addClass('dis');
									_xTips = true;
								},
								complete: function(){
									_sendBtn.el.removeClass('dis');
									_xTips = false;
								},
								success: function (jData) {
									if (jData.status && jData.status === 'success') {
										_applyTextArea.empty();
										_apply.hide();
										userInfoBox.showTips('<p class="des">Apply is send.</p>');
									}
									else {
										Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
									}
								}
							});
						}
						
					});
					_cancelBtn.on('onclick', function () {
						_apply.hide();
					});
					Can.Application.getCanViews().put('applyPublicWindow', _apply);
				}

				_apply.show();
				_apply.updateCss({
					top: $(obj).offset().top - _apply.el.outerHeight(true),
					left: $(obj).offset().left - _apply.width / 2 + $(obj).outerWidth() / 2,
					zIndex: 900
				});
				break;
		}
	});

	userInfoBox.on('ON_MY_REQUEST', function (jPerson) {
		userInfoBox.parentEl.close();
		var mySetting;
		if (Can.util.userInfo().getUserType() === 1) {
			Can.importJS(['js/seller/view/mySettingModule.js']);
			mySetting = Can.Application.getModule('mySettingModuleId');
			if (!mySetting) {
				mySetting = new Can.module.mySettingModule();
				Can.Application.putModule(mySetting);
				mySetting.start();
			}
			mySetting.show();
			mySetting.goToURL(Can.util.Config.seller.mySetting.setBusiness);
		}
		else {
			Can.importJS(['js/buyer/view/mySettingModule.js']);
			mySetting = Can.Application.getModule('mySettingModuleId');
			if (!mySetting) {
				mySetting = new Can.module.mySettingModule();
				Can.Application.putModule(mySetting);
				mySetting.start();
			}
			mySetting.show();
			mySetting.goToURL(Can.util.Config.buyer.mySetting.setBusiness);
		}
	});

	userInfoBox.on('ON_SKU_TURN', function ($Obj, $Wrap) {
		var sDir = $Obj.attr('role');
		var _old_ml = parseInt($Wrap.css('margin-left'), 10);
		var _new_ml;
		$Obj.siblings('span[role]').removeClass('disable');
		if (sDir === 'sku-left') {
			_new_ml = _old_ml + 800;
			$Wrap.animate({
				marginLeft: _new_ml
			}, 'slow');
			if (_new_ml >= 0) {
				$Obj.addClass('disable');
			}

		}
		else {
			_new_ml = _old_ml - 800;
			$Wrap.animate({
				marginLeft: _new_ml
			}, 'slow');
			if (Math.abs(_new_ml) + $Wrap.parent().width() >= $Wrap.width()) {
				$Obj.addClass('disable');
			}
		}
	});

	userInfoBox.tabPage.showTab(Math.min(userInfoBox.firstTab, userInfoBox.tabPage.length() - 1));
});