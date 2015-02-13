/**
 * Combo List UI
 * @Author: AngusYoung
 * @Version: 1.1
 * @Update: 13-4-9
 */

Can.ui.comboList = Can.extend(Can.ui.BaseUI, {
	// 0 is multiple
	maxSelect:0,
	/**
	 * @format {id:0, title:'Hello', display:'<p>Hello</p>'}
	 */
	data:[],
	/* */
	values:{},
	selectTotal:0,
	constructor:function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.comboList.superclass.constructor.call(this);
		this.addEvents('ON_TOGGLE', 'ON_OUT_RANGE');
	},
	initUI:function () {
		this.el = $('<ul></ul>');
		this.el.addClass(this.cssName);
		this.bindEvent();
	},
	bindEvent:function () {
		var _this = this;
		_this.el.undelegate().delegate('li', 'click', function () {
			_this.select($(this));
		});
	},
	select:function ($Item) {
		//if selected total out of maxSelect and current action is add new value.
		if (!$Item.hasClass('cur') && this.selectTotal >= this.maxSelect && this.maxSelect > 0) {
			this.fireEvent('ON_OUT_RANGE');
			return;
		}
		$Item.toggleClass('cur');
		var nID = $Item.attr('cid');
		var sCateName = $Item.attr('title');
		this.toggleValue($Item.hasClass('cur'), nID, sCateName);
		this.fireEvent('ON_TOGGLE', $Item);
	},
	toggleValue:function (bNew, nID, sTitle) {
		if (bNew) {
			this.values[nID] = sTitle;
			this.selectTotal++;
		}
		else {
			delete this.values[nID];
			this.selectTotal--;
		}
	},
	update:function (aData) {
		aData = aData || this.data;
		var _html = '';
		for (var i = 0; i < aData.length; i++) {
			_html += '<li' + (this.values[aData[i].id] ? ' class="cur"' : '') +
				' cid="' + aData[i].id +
				'" title="' + aData[i].title + '">' + aData[i].display + '</li>';
		}
		this.el.html(_html);
	},
	loadData:function (sURL, jParam) {
		var _this = this;
		_this.dataURL = sURL;
		$.ajax({
			url:sURL,
			data:jParam,
			success:function (jData) {
				if (jData.status && jData.status === 'success') {
					_this.update(jData.data);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	}
});