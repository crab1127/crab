/**
 * Category Selector View
 * @Author: Mary June
 * @Version: 1.7
 * @Since: 13-4-9
 */

Can.view.cateSelectorView = Can.extend(Can.view.BaseView, {
	id: 'cateSelectorViewId',
	parentEl: null,
	target: null,
	searchDepth: 0,
	selectParent: false,
	maxSelect: 0,
	maxLevel: 0,
	results: {},
	actionJs: ['js/utils/cateSelectorAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.cateSelectorView.superclass.constructor.call(this);
		this.addEvents('ON_RESULT_UPDATE', 'ON_SAVED');

		this.contentEl = $('<div></div>');
		this.searchbar = new Can.ui.Panel({
			cssName: 'area-search search-s3 clear'
		});
		this.searchInput = new Can.ui.TextField({
			cssName: 's-cont',
			id: null,
			width: null,
			blankText: 'Please enter your keyword...'
		});
		this.searchBtn = new Can.ui.toolbar.iconButton({
			cssName: 'btn-search-s3',
			iconCss: 'bg-ico'
		});

		this.tree = new Can.ui.panelTree({
			selectParent: this.selectParent,
			maxSelect: this.maxSelect,
			maxLevel: this.maxLevel
		});

		this.list = new Can.ui.Panel({
			cssName: 'search-result'
		});
		this.searchResult = new Can.ui.comboList({
			maxSelect: this.maxSelect
		});
		this.result = new Can.ui.Panel({
			cssName: 'roll',
			html: '<div class="tit">' + Can.msg.CATE_SELECTOR.SELECTED + '</div>'
		});
		this.toTreeBtn = new Can.ui.toolbar.Button({
			cssName: 'return-tree',
			text: Can.msg.CATE_SELECTOR.RETURN_TREE
		});

		this.saveBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.CATE_SELECTOR.SAVE
		});
		this.actionEl = new Can.ui.Panel({
			cssName: 'win-action ali-r',
			items: [this.result, this.saveBtn]
		});
	},
	startup: function () {
		this.contentEl.addClass(this.cssName);
		this.searchbar.addItem(this.searchInput);
		this.searchbar.addItem(this.searchBtn);
		this.searchbar.applyTo(this.contentEl);
		this.tree.applyTo(this.contentEl);
		this.list.addItem(this.searchResult);
		this.list.addItem(this.toTreeBtn);
		this.list.applyTo(this.contentEl);
		this.list.el.hide();
		this.actionEl.applyTo(this.contentEl);
		this.reInit();
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.saveBtn.on('onclick', function () {
			if (_this.target && _this.target.is('input')) {
				_this.target.val(_this.getValue().join('┃'));
			}
			_this.parentEl && _this.parentEl.close();
			_this.fireEvent('ON_SAVED', _this.getValue(), _this.getDisplayValue());
		});
		_this.searchInput.on('onchange', function () {
			_this.search();
		});
		_this.searchInput.on('onsubmit', function () {
			_this.search();
		});

		_this.searchBtn.on('onclick', function () {
			_this.search();
		});
		_this.toTreeBtn.on('onclick', function () {
			_this.toTree();
		});
		_this.tree.on('ON_DATA_READY', function (aData) {
			_this.tree.createLevel(aData);
		});
	},
	reInit: function () {
		this.tree.levelObj = [];
		this.tree.values = {};
		this.results = {};
		if (this.normalValue) {
			var _this = this;
			if (!this.normalValue instanceof Array) {
				return;
			}
			function __fCreate(jNormal) {
				var _btn = new Can.ui.toolbar.Button({
					cssName: 'bg-ico btn-close'
				});
				var _item = new Can.ui.Panel({
					cssName: 'mod-item-q',
					items: [_btn],
					html: '<span>' + jNormal.text + '</span>'
				});
				_btn.on('onclick', function () {
					this.getDom().parent().remove();
					$('.cur[cid="' + jNormal.id + '"]').toggleClass('cur');
					_this.delValue(jNormal.id);
				});
				_this.result.addItem(_item);
				return _item;
			}

			for (var i = 0; i < this.normalValue.length; i++) {
				_this.results[this.normalValue[i].id] = [__fCreate(this.normalValue[i]).getDom(), this.normalValue[i].text];
			}
			_this.syncValue();
		}
	},
	onToggleSelect: function (fFn) {
		if (typeof fFn === 'function') {
			this.tree.on('ON_TOGGLE', fFn, this.tree);
			this.searchResult.on('ON_TOGGLE', fFn, this.searchResult);
		}
	},
	onOutRange: function (fFn) {
		if (typeof fFn === 'function') {
			this.tree.on('ON_OUT_RANGE', fFn, this.tree);
			this.searchResult.on('ON_OUT_RANGE', fFn, this.searchResult);
		}
	},
	syncValue: function () {
		this.tree.values = {};
		this.searchResult.values = {};
		for (var v in this.results) {
			if (!this.tree.values[v]) {
				this.tree.values[v] = this.results[v][1];
			}
			if (!this.searchResult.values[v]) {
				this.searchResult.values[v] = this.results[v][1];
			}
		}
		this.tree.selectTotal = this.size();
		this.searchResult.selectTotal = this.size();
		this.fireEvent('ON_RESULT_UPDATE');
	},
	delValue: function (nID) {
		delete this.results[nID];
		this.syncValue();
	},
	size: function () {
		var _n = 0;
		for (var v in this.results) {
			_n++;
		}
		return _n;
	},
	toSave: function () {
		this.saveBtn.el.trigger('click');
	},
	toTree: function () {
		this.tree.reShow();
		this.list.el.hide();
	},
	getValue: function () {
		var _ids = [];
		for (var v in this.results) {
			_ids.push(v);
		}
		return _ids;
	},
	getDisplayValue: function () {
		var _values = [];
		for (var v in this.results) {
			_values.push(this.results[v][1]);
		}
		return _values;
	},
	searchData: function (sTxt) {
		var _data = [];
		var _depth = this.searchDepth || '0';
		var _lang = window.localStorage.lang || 'en';
		var kw = sTxt.trim();
		if(kw.length > 0){
			$.ajax({
				url: Can.util.Config.cateSelector.searchCategory,
				data: {
					keywords: kw,
					type: _depth,
					local:_lang
				},
				async: false,
				timeout: 15,
				success: function (jData) {
					if (jData.status && jData.status === 'success' && jData.data) {
						_data = jData.data;
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		}
		return _data;
	},
	search: function () {
		var listData = this.searchData(this.searchInput.getValue());
		var comBoxData = [];
		for (var i = 0; i < listData.length; i++) {
			comBoxData.push({
				id: listData[i].categoryId,
				title: listData[i].categoryName,
				display: '<div class="cate-last"><span class="ico-ct-sel"></span>' + listData[i].categoryName +
					'</div><div class="cate-path"><b>:</b>' + listData[i].categoryPath.join('<i class="point-at">&gt;&gt;</i>') + '</div>'
			});
		}
		this.searchResult.update(comBoxData);
		this.tree.el.hide();
		this.list.el.show();
	}
});
