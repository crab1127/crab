/**
 * Match Buyers
 * @Author: AngusYoung
 * @Version: 1.5
 * @Update: 13-7-30
 */

Can.module.matchBuyerModule = Can.extend(Can.module.BaseModule, {
	title: Can.msg.MODULE.MATCH_BUYERS.TITLE,
	id: 'matchBuyerModuleId',
	actionJs: ['js/seller/action/matchBuyerAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.module.matchBuyerModule.superclass.constructor.call(this);
		this.addEvents('ON_SCROLL', 'ON_HISTORY_CLICK', 'ON_SEARCH_CLICK', 'ON_LOAD_DATA', 'ON_PERSON_NAME_CLICK', 'ON_PUSH_BTN_CLICK');
	},
	startup: function () {
		var _this = this;
		Can.module.matchBuyerModule.superclass.startup.call(_this);
		var viewMyPushHistory = new Can.ui.toolbar.Button({
			cssName: 'btn btn-s12',
			text: Can.msg.MODULE.MATCH_BUYERS['VIEW_HISTORY']
		});
		viewMyPushHistory.click(function () {
			_this.fireEvent('ON_HISTORY_CLICK', this);
		});
		_this.addOptBtn([viewMyPushHistory]);

		this.searchBar = new Can.ui.Panel({cssName: 'mod-filter clear'});
		this.searchBar.applyTo(this.contentEl);

		this.categoryField = new Can.ui.DropDownField({
			id: 'matchCateId',
			name: 'matchCate',
			cssName: 'select-box trade-sort',
			blankText: Can.msg.MODULE.MATCH_BUYERS.CATEGORY
		});
		this.regionField = new Can.ui.DropDownField({
			id: 'matchRegionId',
			name: 'matchRegion',
			cssName: 'select-box sel-region',
			blankText: Can.msg.MODULE.MATCH_BUYERS.REGION
		});
		this.numOfExhField = new Can.ui.DropDownField({
			id: 'matchNumOfExhId',
			name: 'matchNumOfExh',
			cssName: 'select-box sel-exh',
			blankText: Can.msg.MODULE.MATCH_BUYERS.EXHIBITION
		});
		this.recentlyField = new Can.ui.DropDownField({
			id: 'matchRecentlyId',
			name: 'matchRecently',
			cssName: 'select-box sel-recent',
			blankText: Can.msg.MODULE.MATCH_BUYERS.RECENTLY
		});
		this.compTypeField = new Can.ui.DropDownField({
			id: 'compTypeId',
			name: 'compType',
			cssName: 'select-box sel-company',
			blankText: Can.msg.MODULE.MATCH_BUYERS.COMP_TYPE
		});
		this.levelField = new Can.ui.DropDownField({
			id: 'matchLevelId',
			name: 'matchLevel',
			cssName: 'select-box sel-level',
			blankText: Can.msg.MODULE.MATCH_BUYERS.PURCHASE_LEVEL
		});
		this.splitNav = new Can.ui.Panel({cssName: 'action', html: '<span class="brace"></span>'});
		this.searchBtn = new Can.ui.toolbar.Button({
			id: 'matchSearchBtn',
			cssName: 'btn btn-s11',
			text: Can.msg.BUTTON.SEARCH
		});
		this.searchBtn.on('onclick', function () {
			_this.fireEvent('ON_SEARCH_CLICK');
		});
		this.splitNav.addItem(this.searchBtn);
		this.searchBar.addItem(this.categoryField);
		this.searchBar.addItem(this.regionField);
		this.searchBar.addItem(this.numOfExhField);
		this.searchBar.addItem(this.recentlyField);
		this.searchBar.addItem(this.compTypeField);
		this.searchBar.addItem(this.levelField);
		this.searchBar.addItem(this.splitNav);

		this.dataTable = new Can.ui.tableList({
			cssName: 'mod-table tbl-match-buyer',
			data: {
				col: ['per20', ''],
				head: [],
				item: []
			}
		});

		this.dataTable.applyTo(this.contentEl);
	},
	updateSearchCond: function (jData) {
		for (var v in jData) {
			var _tmp_field;
			var aOptions = jData[v];
			var aValues = [''];
			var aLabels = [Can.msg.ALL];

			switch (v) {
				case 'region':
					_tmp_field = this.regionField;
					break;
				case 'category':
					_tmp_field = this.categoryField;
					break;
				case 'purchaserLevel':
					_tmp_field = this.levelField;
					break;
				case 'numberOfExhibition':
					_tmp_field = this.numOfExhField;
					break;
				case 'recently':
					_tmp_field = this.recentlyField;
					break;
				case 'companyType':
					_tmp_field = this.compTypeField;
					break;
			}
			for (var i = 0; i < aOptions.length; i++) {
				aValues.push(aOptions[i]['code']);
				aLabels.push(aOptions[i]['name']);
			}
			_tmp_field && _tmp_field.updateOptions({
				labelItems: aLabels,
				valueItems: aValues
			});
		}
	},
	showLoading: function () {
		if (!this.loadingBar) {
			this.loadingBar = $('<div class="loading"><span></span>' + Can.msg.LOADING + '</div>');
			this.loadingBar.appendTo(this.contentEl);
		}
		this.loadingBar.show();
	},
	hideLoading: function () {
		this.loadingBar && this.loadingBar.hide();
	},
	loadData: function (sURL, jParam) {
		var _this = this;
		_this.showLoading();
		$.ajax({
			url: sURL,
			data: jParam,
			dataType: 'JSON',
			success: function (jData) {
				if (jData.status
					&& jData.status === 'success') {
					_this.fireEvent('ON_LOAD_DATA', jData.data, jData.page, jParam || {});
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
				_this.hideLoading();
			}
		});
	}
});
