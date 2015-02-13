/**
 * Select Product View
 * @Author: AngusYoung
 * @Version: 1.5
 * @Since: 13-4-8
 */

Can.view.selectProductView = Can.extend(Can.view.BaseView, {
	id: 'selectProductViewId',
	/*传值过去的目标对象，此对象拥有setValues方法*/
	target: null,
	isMultiple: true,
	values: [],
	getProURL: '',
	actionJs: ['js/seller/action/selectProductAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.selectProductView.superclass.constructor.call(this);
		this.addEvents('ON_SELECT', 'ON_NOT_SELECT', 'ON_COMPLETE');
		this.contentEl = $('<div></div>');
		//search condition
		this.searcher = new Can.ui.Panel({
			cssName: 'search-s3 clear'
		});
		this.cate = new Can.ui.DropDownField({
			cssName: 'drop',
			blankText: 'All',
			labelItems: ['Test', 'test2', 'test test'],
			valueItems: [1, 2, 3, 4]
		});
		this.cate.triggerEL.append('<span class="triangle-d1"></span>').addClass('arrow');
		this.cate.labelEL.addClass('txt');
		this.input = new Can.ui.TextField({
			cssName: 's-cont',
			id: null,
			width: null
		});
		this.btn = new Can.ui.toolbar.Button({
			cssName: 'btn-search-s3'
		});
		this.btn.updateHtml('<span class="bg-ico"></span>');

		/*product list*/
		this.list = new Can.ui.Panel({
			wrapEL: 'ul',
			cssName: 'list-products'
		});

		/*action area*/
		this.sureBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.SURE
		});
		this.cancelBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.CANCEL
		});
		this.actionEl = new Can.ui.Panel({
			cssName: 'win-action ali-r',
			items: [this.sureBtn, this.cancelBtn]
		});

		//指示是否在加载中, 用于处理加载
		this._isOnLoad = false;
		this._page = 0;
	},
	startup: function () {
		this.searcher.addItem(this.cate);
		this.searcher.addItem(this.input);
		this.searcher.addItem(this.btn);
		this.searcher.applyTo(this.contentEl);
		this.list.applyTo(this.contentEl);
		this.actionEl.applyTo(this.contentEl);
		this.contentEl.addClass(this.cssName);

		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.btn.on('onclick', function () {
			var _param = {
				'productGroupId': _this.cate.getValue() || '',
				'keywords': _this.input.getValue() || '',
				'page': 1
			};
			_this.loadData(_this.getProURL, _param);
		});
		_this.sureBtn.on('onclick', function () {
			if (_this.values.length) {
				//传送选择的产品信息到前一窗口
				_this.target && _this.target.setValues(_this.getValue());
				_this.parentEl.close();
			}
			else {
				_this.fireEvent('ON_NOT_SELECT');
			}
		});
		_this.cancelBtn.on('onclick', function () {
			_this.parentEl.close();
		});
		_this.on('ON_SELECT', function () {
			var bExist;
			//检查当前选择项是否存在于结果里
			var nExist = _this.findValue(arguments[0]);
			bExist = nExist < _this.values.length;
			//如果不能多选那么就清除所有的结果
			if (!_this.isMultiple) {
				_this.clearValue();
			}
			//如果存在结果里则清除掉当前选择的项
			if (bExist) {
				//如果前面为不能多选，则已经全部清除，不能重复清除
				if (_this.isMultiple) {
					_this.onItemUnSelect && _this.onItemUnSelect.apply(_this, _this.values[nExist]);
					_this.values.splice(nExist, 1);
				}
			}
			else {
				_this.values.push(arguments);
				_this.onItemSelect && _this.onItemSelect.apply(_this, arguments);
			}
		});
	},
	updateData: function (aItem) {
		var _this = this;
		aItem = aItem || [];
		for (var i = 0; i < aItem.length; i++) {
			var _small = new Can.ui.smallPro({
				cssName: 'small-pro',
				data: {
					id: aItem[i].productId,
					img: aItem[i].productLogoUrl,
					title: aItem[i].productName,
					detail: aItem[i]
				}
			});
			_small.update();
			_small.on('ON_CLICK', function (jPro, oPro, bSelected) {
				_this.fireEvent('ON_SELECT', jPro, oPro, bSelected);
			});
			_this.list.addItem($('<li><span class="sel"></span></li>').prepend(_small.getDom()));
		}
	},
	pushData: function (aItem) {
		var _this = this;
		aItem = aItem || [];
		for (var i = 0; i < aItem.length; i++) {
			var _small = new Can.ui.smallPro({
				cssName: 'small-pro',
				data: {
					id: aItem[i].productId,
					img: aItem[i].productLogoUrl,
					title: aItem[i].productName,
                    detail: aItem[i]
				}
			});
			_small.update();
			_small.on('ON_CLICK', function (jPro, oPro, bSelected) {
				_this.fireEvent('ON_SELECT', jPro, oPro, bSelected);
			});
			_this.list.addItem($('<li><span class="sel"></span></li>').prepend(_small.getDom()));
		}
	},
	loadData: function (sURL, jParam) {
		var _this = this;
		_this.getProURL = sURL || _this.getProURL;
		jParam = jParam || {page: 1};
		//jParam['pageSize'] = 12;
		$.extend(jParam, _this.param);
		_this._isOnLoad = true;
		_this.updateData([]);

		$.ajax({
			url: sURL,
			data: Can.util.formatFormData(jParam),
			showLoadTo: _this.list.el,
			cache: false,
			success: function (jData) {
				_this._isOnLoad = false;
				if (jData.status && jData.status === 'success') {
					if (jData.data && jData.data.list && jData.data.list.length) {
						//绑定自动分页
						_this._page = jData.page.page;
						// _this.list.el.unbind('scroll.selectProduct');
						if (_this._page == 1) {
							_this.list.update('');
							_this.list.el.scrollTop(0);
							var maxPage = jData.page.maxPage;
							_this.list.el.bind('scroll.selectProduct', function () {
								if (false == _this._isOnLoad && _this._page < jData.page.maxPage) {
									// 自动加载的临界值
									var maxValue = (_this.list.el[0].scrollHeight - _this.list.el.height()) * .95;
									if (_this.list.el.scrollTop() >= maxValue) {
										jParam.page++;
										_this.loadData(_this.getProURL, jParam);
										//console.log(_this.list.el.scrollTop());
									}

								}
							});
							_this.updateData(jData.data.list);

							var aGroup = jData.data.productGroups;
							aGroup.sort(function (a, b) {
								return a.sortOrder > b.sortOrder;
							});
							var _value = [''];
							var _label = ['All'];
							for (var i = 0; i < aGroup.length; i++) {
								_value.push(aGroup[i].groupId);
								_label.push(aGroup[i].groupName);
							}
							_this.cate.updateOptions({labelItems: _label, valueItems: _value});
						}
						else {
							_this.pushData(jData.data.list);
						}
					}
					else {
						//show empty
						_this.list.update('');
						_this.list.addItem('<li class="data-none"><p class="txt2">' + Can.msg.NOT_RELATED_PROD + '</p></li>');
					}
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		})
	},
	clearValue: function () {
		for (var i = 0; i < this.values.length; i++) {
			this.onItemUnSelect && this.onItemUnSelect.apply(this, this.values[i]);
		}
		this.values = [];
	},
	findValue: function (jObj) {
		for (var i = 0; i < this.values.length; i++) {
			if (this.values[i][0] == jObj) {
				return i;
			}
		}
		return this.values.length + 1;
	},
	getValue: function () {
		var aValue = [];
		for (var i = 0; i < this.values.length; i++) {
			aValue.push(this.values[i][0]);
		}
		return aValue;
	},
	onUnSelect: function (fFn) {
		if (typeof fFn === 'function') {
			this.onItemUnSelect = fFn;
		}
	},
	onSelect: function (fFn) {
		if (typeof fFn === 'function') {
			this.onItemSelect = fFn;
		}
	},
	onNotSelect: function (fFn) {
		if (typeof fFn === 'function') {
			this.on('ON_NOT_SELECT', fFn);
		}
	},
	onComplete: function (fFn) {
		if (typeof fFn === 'function') {
			this.on('ON_COMPLETE', fFn);
		}
	}
});
