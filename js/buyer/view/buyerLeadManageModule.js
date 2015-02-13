/**
 * buyerLead manage
 * @Author: AngusYoung
 * @Version: 1.5
 * @Update: 13-3-31
 */

Can.module.buyerLeadManageModule = Can.extend(Can.module.BaseModule, {
	id: 'buyerLeadManageModuleId',
	title: Can.msg.MODULE.BUYER_LEAD_MANAGE.TITLE,
	actionJs: ['js/buyer/action/buyerLeadManageAction.js'],
	requireUiJs: ['js/utils/stepBtnView.js', 'js/buyer/view/buyingLeadListView.js'],
	bOfflineBl: false,
	bOnlineBl: false,
	bDeleteBl: false,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.module.buyerLeadManageModule.superclass.constructor.call(this);
		this.addEvents(
			'ON_LOAD_APPROVED',
			'ON_LOAD_AUDITING',
			'ON_LOAD_UNAPPROVED',
			'ON_LOAD_EXPIRED',
			'ON_LOAD_OFFLINE'
		);
	},
	startup: function () {
		Can.module.buyerLeadManageModule.superclass.startup.call(this);
		this.postBlBtn = new Can.ui.toolbar.Button({
			cssName: 'btn btn-s11',
			text: Can.msg.MODULE.BUYER_LEAD_MANAGE.OPT_BTN
		});
		this.addOptBtn([this.postBlBtn]);
		/*审核通过*/
		this.approvedWrap = new Can.view.buyerLeadListView({
			cssName: 'b-approved',
			hasTickAll: true,
			operaText: Can.msg.MODULE.BUYER_LEAD_MANAGE.OFFLINE,
			tableColCss: ['w36', '', 'w100', 'w130', 'w100', 'w100', 'w70'],
			tableHeadTxt: Can.msg.MODULE.BUYER_LEAD_MANAGE.TABLE_HEAD_APPROVE,
			filter: ['status','reason']
		});
		this.approvedWrap.start();

		/*审核中*/
		this.auditingWrap = new Can.view.buyerLeadListView({
			cssName: 'b-auditing',
			tableColCss: ['', 'w120', 'w120'],
			tableHeadTxt: Can.msg.MODULE.BUYER_LEAD_MANAGE.TABLE_HEAD_AUDITING,
			filter: ['hasNewReply', 'replyTimes', 'status', 'lastReplyTime','reason']
		});
		this.auditingWrap.start();

		/*审核不通过*/
		this.unapprovedWrap = new Can.view.buyerLeadListView({
			cssName: 'b-unapproved',
			hasTickAll: true,
			operaText: Can.msg.MODULE.BUYER_LEAD_MANAGE.DELETE,
			tableColCss: ['w36', '', 'w120', 'w220', 'w120', 'w70'],
			tableHeadTxt: Can.msg.MODULE.BUYER_LEAD_MANAGE.TABLE_HEAD_UNAPPROVED,
			filter: ['hasNewReply', 'replyTimes', 'status', 'lastReplyTime']
		});
		this.unapprovedWrap.start();

		/*过期*/
		this.expiredWrap = new Can.view.buyerLeadListView({
			cssName: 'b-expired',
			tableColCss: ['', 'w100', 'w100', 'w130', 'w100', 'w100'],
			tableHeadTxt: Can.msg.MODULE.BUYER_LEAD_MANAGE.TABLE_HEAD_EXPIRED,
			filter: ['hasNewReply','reason']
		});
		this.expiredWrap.start();

		/*下线*/
		this.offlineWrap = new Can.view.buyerLeadListView({
			cssName: 'b-offline',
			hasTickAll: true,
			operaText: Can.msg.MODULE.BUYER_LEAD_MANAGE.ONLINE,
			tableColCss: ['w36', '', 'w100', 'w130', 'w100', 'w100', 'w70'],
			tableHeadTxt: Can.msg.MODULE.BUYER_LEAD_MANAGE.TABLE_HEAD_OFFLINE,
			filter: ['hasNewReply', 'status','reason']
		});
		this.offlineWrap.start();

		//初始化隐藏，不显示
		this.approvedWrap.hide();
		this.auditingWrap.hide();
		this.unapprovedWrap.hide();
		this.expiredWrap.hide();
		this.offlineWrap.hide();
		//导入tabPage
		this.tab = new Can.ui.tabPage({
			cssName: 'mge-buyerlead',
			innerCss: 'tab-page',
			pageCss: 'tab-cont',
			tabData: [
				Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_APPROVED,
				Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_AUDITING,
				Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_UNAPPROVED,
				Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_EXPIRED,
				Can.msg.MODULE.BUYER_LEAD_MANAGE.TAB_TIT_OFFLINE
			],
			pageData: [
				this.approvedWrap.contentEl,
				this.auditingWrap.contentEl,
				this.unapprovedWrap.contentEl,
				this.expiredWrap.contentEl,
				this.offlineWrap.contentEl
			]
		});
		this.tab.applyTo(this.contentEl);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.tab.on('ON_SWITCH', function ($Wrap, nIndex) {
			switch (parseInt(nIndex, 10)) {
				case 0://approved
					_this.fireEvent('ON_LOAD_APPROVED');
					break;
				case 1://auditing
					_this.fireEvent('ON_LOAD_AUDITING');
					break;
				case 2://unapproved
					_this.fireEvent('ON_LOAD_UNAPPROVED');
					break;
				case 3://expired
					_this.fireEvent('ON_LOAD_EXPIRED');
					break;
				case 4://offline
					_this.fireEvent('ON_LOAD_OFFLINE');
					break;
			}
		});
		/*_this.postBlBtn.on('onclick', function () {*/
			//$('#pbuyerleadBtnId').trigger('click');
		/*});*/
        //修改发布采购需求的连接
        //console.log(_this.postBlBtn.el);
        _this.postBlBtn.el.attr({
            href: Can.util.Config.EN.url.postBuyinglead,
            target: '_blank'
        });
	},
	clickFirst: function (nIndex) {
		this.tab.showTab(nIndex);
	},
	onChangePage: function (sType, fFn) {
		if (typeof fFn === 'function') {
			var _this = this;
			var jView = {
				approved: _this.approvedWrap,
				auditing: _this.auditingWrap,
				unapproved: _this.unapprovedWrap,
				expired: _this.expiredWrap,
				offline: _this.offlineWrap
			};
			jView[sType].on('ON_CHANGE_PAGE', function () {
				fFn(jView[sType].page, jView[sType].searchCond);
			});
		}
	},
	onSearchBL: function (sType, fFn) {
		switch (sType) {
			case 'approved':
				this.approvedWrap.onSearch(fFn);
				break;
			case 'auditing':
				this.auditingWrap.onSearch(fFn);
				break;
			case 'unapproved':
				this.unapprovedWrap.onSearch(fFn);
				break;
			case 'expired':
				this.expiredWrap.onSearch(fFn);
				break;
			case 'offline':
				this.offlineWrap.onSearch(fFn);
				break;
		}
	},
	onAllOpera: function (sType, fFn) {
		if (typeof fFn === 'function') {
			var _this = this;
			var jView = {
				approved: _this.approvedWrap,
				auditing: _this.auditingWrap,
				unapproved: _this.unapprovedWrap,
				expired: _this.expiredWrap,
				offline: _this.offlineWrap
			};
			jView[sType].on('ON_ALL_OPERATION', function (aId) {
				if (aId.length) {
					fFn(aId);
				}
			});
		}
	},
	deleteBl: function (aId) {
		if (aId instanceof Array) {
			var _this = this;
			var $Wrap = _this.unapprovedWrap.dataTable.tbody;
			var _selector = 'input[value="' + aId.join('"],input[value="') + '"]';

			if(!_this.bDeleteBl){
				$.ajax({
					url: Can.util.Config.buyer.blManageModule.deleteBl,
					type: "POST",
					data: Can.util.formatFormData({buyingLeadId: aId}),
					beforeSend: function(){
						_this.bDeleteBl = true;
					},
					complete: function(xhr, status){
						if (status != 'success') {
							_this.bDeleteBl = false;
						};
					},
					success: function (jData) {
						if (jData.status && jData.status === 'success') {
							$Wrap.find(_selector).parents('tr').fadeOut(function () {
								$(this).remove();
								if (!$Wrap.find('tr').length) {
									_this.fireEvent('ON_UNAPPROVED_PAGE');
									_this.unapprovedWrap.tick.unSelect();
								}
								_this.bDeleteBl = false;
							});
						}
						else {
							Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						}
					}
				});
			}
			
		}
	},
	onlineBl: function (aId) {
		if (aId instanceof Array) {
			var _this = this;
			var $Wrap = _this.offlineWrap.dataTable.tbody;
			var _selector = 'input[value="' + aId.join('"],input[value="') + '"]';

			if(!_this.bOnlineBl){
				$.ajax({
					type: 'POST',
					url: Can.util.Config.buyer.blManageModule.onlineBl,
					data: Can.util.formatFormData({buyingLeadId: aId}),
					beforeSend: function(){
						_this.bOnlineBl = true;
						$Wrap.find(_selector).parents('tr').find('.ico-b-online').hide();
					},
					complete: function(xhr, status){
						if (status != 'success') {
							_this.bOnlineBl = false;
						};
					},
					success: function (jData) {
						if (jData.status && jData.status === 'success') {
							$Wrap.find(_selector).parents('tr').fadeOut(function () {
								$(this).remove();
								if (!$Wrap.find('tr').length) {
									_this.fireEvent('ON_OFFLINE_PAGE');
									_this.offlineWrap.tick.unSelect();
								}
								_this.bOnlineBl = false;
							});
						}
						else {
							Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						}
					}
				});
			}
			
		}
	},
	offlineBl: function (aId) {
		if (aId instanceof Array) {
			var _this = this;
			var $Wrap = _this.approvedWrap.dataTable.tbody;
			var _selector = 'input[value="' + aId.join('"],input[value="') + '"]';

			if(!_this.bOfflineBl){
				$.ajax({
					url: Can.util.Config.buyer.blManageModule.offlineBl,
					data: Can.util.formatFormData({buyingLeadId: aId}),
					type: 'POST',
					beforeSend: function(){
						_this.bOfflineBl = true;
						$Wrap.find(_selector).parents('tr').find('.ico-b-offline').hide();
					},
					complete: function(xhr, status){
						if (status != 'success') {
							_this.bOfflineBl = false;
						};
					},
					success: function (jData) {
						if (jData.status && jData.status === 'success') {
							$Wrap.find(_selector).parents('tr').fadeOut(function () {
								$(this).remove();
								if (!$Wrap.find('tr').length) {
									_this.fireEvent('ON_APPROVED_PAGE');
									_this.approvedWrap.tick.unSelect();
								}
								_this.bOfflineBl = false;
							});
						}
						else {
							Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						}
					}
				});
			}
			
		}
	},

	showBuyerLeadDetail: function (jBuyerLead, hideHistory) {
        Can.Route.run('/show-buyingLead', {id: jBuyerLead.buyingLeadId});
		/*Can.importJS(['js/buyer/view/buyerBuyingLeadModule.js']);*/
		//var buyerBlDetailModule = Can.Application.getModule('buyerBuyingLeadModuleId');
		//if (buyerBlDetailModule == null) {
			//buyerBlDetailModule = new Can.module.buyerBuyingLeadModule({
				//title: jBuyerLead.subject
			//});
			//Can.Application.putModule(buyerBlDetailModule);
			//buyerBlDetailModule.start();
		//}
		//buyerBlDetailModule.updateTitle(jBuyerLead.subject);
		//buyerBlDetailModule.show();
		//buyerBlDetailModule.queue = this.queue;
		//buyerBlDetailModule.bid = jBuyerLead.buyingLeadId;
		//buyerBlDetailModule.hideHistory = hideHistory;
		/*buyerBlDetailModule.loadData({"buyerleadId": jBuyerLead.buyingLeadId})*/
	},
	editBuyerLead: function (nId, e) {
        $(e.target).attr({
            href: Can.util.Config.EN.url.postBuyinglead + '?id=' + nId,
            target: '_blank'
        });
        

        /*
		 * Can.importJS(['js/buyer/view/postBuyerLeadModule.js']);
		 * $('#postBuyerLeadModuleID').empty();
		 * var postBuyerleadModule = new Can.module.postBuyerLeadModule();
		 * Can.Application.putModule(postBuyerleadModule);
		 * postBuyerleadModule.editId = nId;
		 * postBuyerleadModule.start();
		 * postBuyerleadModule.show();
         */
	},
	loadData: function (sURL, jParam) {
		var _this = this;
		var oView;
		var jAction = {};
		//根据jParam.type，返回的结果往某个TAB里显示
		switch (jParam.type) {
			case 'approved':
				oView = _this.approvedWrap;
				jAction = {action: ['ico-b-offline', Can.msg.CAN_TITLE.OFFLINE]};
				oView.on('ON_TITLE_CLICK', function (oBl) {
					_this.showBuyerLeadDetail(oBl);
				});
				oView.on('ON_ACTION_CLICK', function (oBl) {
					_this.offlineBl([oBl.buyingLeadId]);
				});
				break;
			case 'auditing':
				oView = _this.auditingWrap;
				oView.on('ON_TITLE_CLICK', function (oBl) {
					_this.showBuyerLeadDetail(oBl, 'hideHistory');
				});
				break;
			case 'unapproved':
				oView = _this.unapprovedWrap;
				jAction = {action: ['ico-trail', Can.msg.CAN_TITLE.MODIFY]};
				oView.on('ON_TITLE_CLICK', function (oBl) {
					_this.showBuyerLeadDetail(oBl, 'hideHistory');
				});
				oView.on('ON_ACTION_CLICK', function (oBl, e) {
					_this.editBuyerLead(oBl.buyingLeadId, e);
				});
				break;
			case 'expired':
				oView = _this.expiredWrap;
				oView.on('ON_TITLE_CLICK', function (oBl) {
					_this.showBuyerLeadDetail(oBl);
				});
				break;
			case 'offline':
				oView = _this.offlineWrap;
				jAction = {action: ['ico-b-online', Can.msg.CAN_TITLE.ONLINE]};
				oView.on('ON_TITLE_CLICK', function (oBl) {
					_this.showBuyerLeadDetail(oBl);
				});
				oView.on('ON_ACTION_CLICK', function (oBl) {
					_this.onlineBl([oBl.buyingLeadId]);
				});
				break;
		}
		//apply queue
		oView.on('ON_ADD_IN', function (oBl) {
			_this.queueUp(oBl.buyingLeadId, oBl.subject);
		});

		var oDataWrap = oView.buildData;
		var $ShowTo = oView.dataTable.el;

		$.ajax({
			url: sURL,
			data: Can.util.formatFormData(jParam),
			showLoadAfter: $ShowTo,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					oDataWrap.call(oView, jData.data, jAction, jData.page);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	},
	queueUp: function (id, subject) {
		var queue = this.queue || {}, prev = queue.prev;

		// set previous one's next
		if (prev) {
			queue[prev]['next'] = id;
		}

		// set current one's prev
		queue[id] = {
			prev: prev,
			subject: subject
		};

		queue.prev = id;

		if (!this.queue) {
			this.queue = queue;
		}
	}
});
