/**
 * Panel Tree
 * @Author: Mary June
 * @Version: 1.8
 * @Update: 13-4-9
 */

Can.ui.panelTree = Can.extend(Can.ui.BaseUI, {
	cssName: 'situation',
	// can select parent because add a tick to item.
	selectParent: false,
	// 0 is multiple
	maxSelect: 0,
	maxLevel: 0,
	//if always load data then treeData don't saved all data.
	isAlwaysLoad: false,
	//data format: [{},{},{}]
	treeData: [],
	levelObj: [],
	values: {},
	pathValues: {},
	selectTotal: 0,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.panelTree.superclass.constructor.call(this);
		this.addEvents('ON_DATA_READY', 'ON_TOGGLE', 'ON_OUT_RANGE');
	},
	initUI: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.cssName);
		this.main = $('<div class="panel-container"></div>');
		this.el.append(this.main);
	},
	bindEvent: function (oObj) {
		var _this = this;
		oObj
			.delegate('li', 'click', function () {
				_this.select(oObj, this);
			})
			.delegate('li[ctype="sub-cate"] span.ico-ct-sel', 'click', function () {
				var $Parent = $(this).parent();
				var nId = $Parent.attr('cid');
				if (!$Parent.hasClass('mark') && _this.selectTotal >= _this.maxSelect && _this.maxSelect !== 0) {
					_this.fireEvent('ON_OUT_RANGE');
					return;
				}
				$Parent.toggleClass('mark');
				var bMark = $Parent.hasClass('mark');
				_this.selectItem($Parent, bMark);
				if (bMark) {
					for (var v in _this.values) {
						var _i = _this.pathValues[v];
						if ($.inArray(nId, _i) !== -1) {
							var _div = _this.main.find('li[cid="' + v + '"]');
							if (_div.length) {
								_div.removeClass('cur mark');
							}
							else {
								_div = $('<div cid="' + v + '"></div>');
							}
							_this.selectItem(_div, false);
						}
					}
				}
			});
	},
	/**
	 *
	 * @param {Array} aData
	 * @param {Number} [nParentId]
	 * @param {String} [sCrumbs]
	 */
	createLevel: function (aData, nParentId, sCrumbs) {
		var _level = $('<div class="level"></div>');
		_level.data('levelIndex', this.levelObj.length + 1);
		_level.data('levelPath', sCrumbs);
		var _ul = $('<ul></ul>');
		var _html = '';
		for (var i = 0; i < aData.length; i++) {
			// if out of the maxLevel then remove his childNoes
			// this operation change subCate to leafCate
			if (this.levelObj.length + 1 >= this.maxLevel && this.maxLevel !== 0) {
				aData[i].childNodes = [];
			}
			//subCate or leafCate
			var _ctype = aData[i].childNodes.length ? 'sub-cate' : 'leaf-cate';
			var _css = [];
			//subCate selected class
			if (this.values[aData[i].categoryId] && aData[i].childNodes.length) {
				_css.push('mark');
			}
			// leafCate selected class
			else if (this.values[aData[i].categoryId]) {
				_css.push('cur');
			}
			// this category's parent id
			var _pid = nParentId ? ' pid="' + nParentId + '"' : '';
			// then icon for diff category type
			var _ico = aData[i].childNodes.length ? 'ico-nx-stage' : 'ico-ct-sel';
			// if can select parent then add this tick
			var _tick_ico = this.selectParent && this.levelObj.length && aData[i].childNodes.length ? '<span class="ico-ct-sel"></span>' : '';

			_html += '<li' + _pid + ' cid="' + aData[i].categoryId + '" ctype="' + _ctype + (_css.length ? '" class="' + _css.join(' ') : '') + '">' + aData[i].categoryName + '<span class="' + _ico + '"></span>' + _tick_ico + '</li>';
		}
		_ul.html(_html).appendTo(_level);
		this.main.append(_level);
		this.main.css({
			width: (this.levelObj.length + 1) * _level.outerWidth(true) - 20
		});
		this.el.animate({
			scrollLeft: this.main.width()
		}, 1000, 'swing');
		this.levelObj.push(_level);
		this.bindEvent(_level);
	},
	reShow: function () {
		this.levelObj = [];
		this.main.empty();
		this.createLevel(this.treeData);
		this.el.show();
	},
	selectItem: function (oItem, bSelect) {
		var _this = this;
		var nCateId = oItem.attr('cid');
		var sCateName = oItem.text();
		if (bSelect) {
			//save the path for clear
			if (!this.pathValues[nCateId]) {
				this.pathValues[nCateId] = (function __fGetPath(oItem, sId) {
					var _pid = oItem.attr('pid');
					var _parent = _this.main.find('li[cid="' + _pid + '"]');
					if (_parent.length) {
						return __fGetPath(_parent, (sId ? sId + ',' : '') + _pid);
					}
					else {
						return sId;
					}
				})(oItem, 0).split(',');
			}
			//cancel parent, if inside current path.
			for (var v in _this.values) {
				if ($.inArray(v, _this.pathValues[nCateId]) !== -1) {
					var _div = _this.main.find('li[cid="' + v + '"]');
					if (_div.length) {
						_div.removeClass('mark');
					}
					else {
						_div = $('<div cid="' + v + '"></div>');
					}
					_this.selectItem(_div, false);
				}
			}
		}
		//toggle value
		_this.toggleValue(bSelect, nCateId, sCateName);
		//fire event
		_this.fireEvent('ON_TOGGLE', oItem);
	},
	select: function ($Parent, oObj) {
		var _this = this;
		var $Item = $(oObj);
		var sType = $Item.attr('ctype');

		//if not leaf category and has cur class then return.
		if ($Item.hasClass('cur') && sType === 'sub-cate') {
			return;
		}
		//if select total out of maxSelect and current select is leaf category then fire the event.
		if (!$Item.hasClass('cur') && sType !== 'sub-cate' &&
			_this.selectTotal >= _this.maxSelect && _this.maxSelect !== 0) {
			_this.fireEvent('ON_OUT_RANGE');
			return;
		}
		//toggle class
		$Item.toggleClass('cur');
		//if has child category, load it
		if (sType === 'sub-cate') {
			//load next data fn
			function __fGetDataLoad() {
				//show next level
				var _data, _crumbs;
				var _id = parseInt($Item.attr('cid'), 10);
				if (_this.isAlwaysLoad) {
					//load data from URL.
					_data = _this.loadData(_this.loadDataURL, {categoryId: _id});
				}
				else {
					//load data from treeData.
					_data = _this.findCate(_this.treeData, _id).data;
					_crumbs = _this.findCate(_this.treeData, _id).crumbs;
				}
				//remove levels after $Item.
				for (var i = nStart; i < _this.levelObj.length; i++) {
					_this.levelObj[i].remove();
				}
				_this.levelObj = _this.levelObj.slice(0, nStart);
				//create new level
				_this.createLevel(_data, _id, _crumbs);
			}

			//remove other 'cur' sub category in this level.
			$Parent.find('.cur[ctype="sub-cate"]').not($Item).removeClass('cur');
			//get current index
			var nStart = $Parent.data('levelIndex');
			//animate to current level
			if (nStart + 1 < _this.levelObj.length) {
				_this.el.animate({
					scrollLeft: $Parent.position().left
				}, 'slow', __fGetDataLoad);
			}
			else {
				__fGetDataLoad();
			}
		}
		//is leaf category, select it.
		else {
			//$Item.attr('cantitle', $Parent.data('levelPath'));
			$Item.data('path', $Parent.data('levelPath'));
			_this.selectItem($Item, $Item.hasClass('cur'));
		}

		//***********************************************************************************
		/*if ($Item.attr('ctype') === 'sub-cate') {
		 //if sub category and has 'cur' then anything is not changed.
		 if ($Item.hasClass('cur')) {
		 console.log('te')
		 if (this.selectParent) {
		 this.toggleValue(false, nCateId, sCateName);
		 this.fireEvent('ON_TOGGLE', $Item);
		 }
		 return;
		 }
		 var _this = this;

		 function __fGetDataLoad() {
		 //show next level
		 var _data;
		 var _id = parseInt($Item.attr('cid'), 10);
		 if (_this.isAlwaysLoad) {
		 //load data from URL.
		 _data = _this.loadData(_this.loadDataURL, {categoryId: _id});
		 }
		 else {
		 //load data from treeData.
		 _data = _this.findCate(_this.treeData, _id);
		 }
		 //remove levels after $Item.
		 for (var i = nStart; i < _this.levelObj.length; i++) {
		 _this.levelObj[i].remove();
		 }
		 _this.levelObj = _this.levelObj.slice(0, nStart);
		 //create new level
		 _this.createLevel(_data, _id);
		 }

		 if(this.selectParent&&)
		 //remove class 'cur' of other sub-cate elements.
		 $Item.siblings('[ctype="sub-cate"]').removeClass('cur');
		 var nStart = $Parent.data('levelIndex');
		 //animate to current level
		 if (nStart + 1 < this.levelObj.length) {
		 this.el.animate({
		 scrollLeft: $Parent.position().left
		 }, 'slow', __fGetDataLoad);
		 }
		 else {
		 __fGetDataLoad();
		 }
		 }
		 else {
		 //if selected total out of maxSelect and current action is add new value.
		 if (!$Item.hasClass('cur') && this.selectTotal >= this.maxSelect && this.maxSelect > 0) {
		 this.fireEvent('ON_OUT_RANGE');
		 return;
		 }
		 //if not multiple then remove other 'cur' elements.
		 if (!this.isMultiple) {
		 this.main.find('li[ctype!="sub-cate"]').not($Item).removeClass('cur');
		 }
		 }
		 //toggle class for 'cur'.
		 $Item.toggleClass('cur');
		 var nIndex = $Item.parents('.level').data('levelIndex');
		 var sType=$Item.attr('ctype');
		 //if $Item is leaf category or allow select sub category then toggle value it.
		 if ((sType != 'sub-cate' || this.selectParent) && nIndex > 1) {
		 this.toggleValue($Item.hasClass('cur'), nCateId, sCateName);
		 this.fireEvent('ON_TOGGLE', $Item);
		 //if selected child category then remove parent category selected status.
		 $Parent.siblings().find('li[cid="' + $Item.attr('pid') + '"][pid]').trigger('click');
		 }*/
	},
	toggleValue: function (bNew, nID, sTitle) {
		if (bNew) {
			this.values[nID] = sTitle;
			this.selectTotal++;
		}
		else {
			delete this.values[nID];
			this.selectTotal--;
		}
	},
	findCate: function (aData, nID, sParentCrumbs) {
		// return category crumbs?
		if (aData.length) {
			for (var i = 0; i < aData.length; i++) {
				var _crumbs = (sParentCrumbs ? sParentCrumbs + '>' : '') + aData[i].categoryName;
				if (aData[i].categoryId == nID) {
					//console.log(_crumbs)
					return {
						data: aData[i].childNodes,
						crumbs: _crumbs
					};
				}
				else if (aData[i].childNodes.length) {
					var recursion = this.findCate(aData[i].childNodes, nID, _crumbs);
					if (recursion.data.length) {
						return recursion;
					}
				}
			}
		}
		return {data: [], crumbs: ''};
	},
	loadData: function (sURL, jParam) {
		var returnData = [];
		var _this = this;
		if (!_this.isAlwaysLoad && window.sessionStorage && window.sessionStorage.categoryTree) {
			returnData = eval(window.sessionStorage.categoryTree);
			_this.treeData = returnData;
			_this.fireEvent('ON_DATA_READY', returnData);
		}
		else {
			_this.loadDataURL = sURL;
			$.ajax({
				url: sURL,
				data: jParam,
				showLoadTo: _this.el,
				//async: false,
				success: function (jData) {
					if (jData.status && jData.status === 'success') {
						//save data to treeData with first load.
						if (!_this.treeData.length) {
							_this.treeData = jData.data;
							if (_this.treeData && _this.treeData.length) {
								window.sessionStorage.categoryTree = JSON.stringify(jData.data);
							}
						}
						returnData = jData.data;
						_this.fireEvent('ON_DATA_READY', returnData);
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		}
	}
});
