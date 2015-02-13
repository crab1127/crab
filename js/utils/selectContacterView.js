/**
 * Select Contacter View
 * @Author: Mary June
 * @Version: 1.1
 * @Update: 13-2-21
 */

Can.view.selectContacterView = Can.extend(Can.view.BaseView, {
	id: 'selectContacterViewId',
	/*传值过去的目标对象，此对象拥有setValues方法*/
	target: null,
	isMultiple: true,
	values: [],
	getContacterURL: '',
	actionJs: ['js/utils/selectContacterAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.selectContacterView.superclass.constructor.call(this);
		this.addEvents('ON_SELECT', 'ON_NOT_SELECT', 'ON_COMPLETE');
		this.contentEl = $('<div></div>');
		//search condition
		this.searcher = new Can.ui.Panel({
			cssName: 'search-s3 clear'
		});
		this.group = new Can.ui.DropDownField({
			cssName: 'drop',
			blankText: Can.msg.ALL,
			labelItems: [],
			valueItems: []
		});
		this.group.triggerEL.append('<span class="triangle-d1"></span>').addClass('arrow');
		this.group.labelEL.addClass('txt');
		this.input = new Can.ui.TextField({
			cssName: 's-cont',
			id: null,
			width: null
		});
		this.searchBtn = new Can.ui.toolbar.Button({
			cssName: 'btn-search-s3'
		});
		this.searchBtn.updateHtml('<span class="bg-ico"></span>');

		/*product list*/
		this.list = new Can.ui.Panel({
			wrapEL: 'ul',
			cssName: 'list-contact'
		});

		/*action area*/
		this.selectBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.SELECT
		});
		this.cancelBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.CANCEL
		});
		this.actionEl = new Can.ui.Panel({
			cssName: 'win-action ali-r',
			items: [this.selectBtn, this.cancelBtn]
		});
	},
	startup: function () {
		this.searcher.addItem(this.group);
		this.searcher.addItem(this.input);
		this.searcher.addItem(this.searchBtn);
		this.searcher.applyTo(this.contentEl);
		this.list.applyTo(this.contentEl);
		this.actionEl.applyTo(this.contentEl);
		this.contentEl.addClass(this.cssName);

		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.searchBtn.on('onclick', function () {
			var _param = {
				'groupId': _this.group.getValue() || '',
				'keywords': _this.input.getValue() || ''
			};
			_this.loadData(_this.getContacterURL, _param);
		});
		_this.selectBtn.on('onclick', function () {
			if (_this.values.length) {
				//传送选择的联系人信息到前一窗口
				_this.target && _this.target.setValues(_this.getValue());
				_this.parentEl.hide();
				_this.fireEvent('ON_COMPLETE');
			}
			else {
				_this.fireEvent('ON_NOT_SELECT');
			}
		});
		_this.cancelBtn.on('onclick', function () {
			_this.parentEl.hide();
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
		_this.list.update('');
		for (var i = 0; i < aItem.length; i++) {
			/**
			 * 单个联系人的对象，从JSON里读取出来的数据要和这里对应上
			 */
			var _small = new Can.ui.smallContacter({
				cssName: 'mod-person',
				data: {
					id: aItem[i].contacterId,
					img: aItem[i].pic,
					title: aItem[i].name,
					gender: parseInt(aItem[i].gender, 10),
					email: aItem[i].email,
					countryId: aItem[i].countryId,
					countryName: aItem[i].region? Can.util.formatRegion(aItem[i].region) : aItem[i].country
				}
			});
			_small.update();
			_small.on('ON_CLICK', function (jContact, oContact, bSelected) {
				_this.fireEvent('ON_SELECT', jContact, oContact, bSelected);
			});
			_this.list.addItem($('<li><span class="sel"></span></li>').prepend(_small.getDom()));
		}
	},
	loadGroup: function (sURL) {
		var _this = this;
		$.ajax({
			url: sURL,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var aGroup = jData.data;
					var _ = {labelItems: ['All'], valueItems: [0]};
					for (var i = 0; i < aGroup.length; i++) {
						_.labelItems.push(aGroup[i].groupName);
						_.valueItems.push(aGroup[i].groupId);
					}
					_this.group.updateOptions(_);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	},
	loadData: function (sURL, jParam) {
		var _this = this;
		_this.getContacterURL = sURL || _this.getContacterURL;
		$.ajax({
			url: sURL,
			data: jParam,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					_this.updateData(jData.data);
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