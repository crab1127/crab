/**
 * Step button view
 * @Author: AngusYoung
 * @Version: 2.1
 * @Update: 13-3-16
 */

Can.view.stepBtnView = Can.extend(Can.view.BaseView, {
	css:['btn-prev', 'btn-next'],
	btnText:['Prev', 'Next'],
	constructor:function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.stepBtnView.superclass.constructor.call(this);
	},
	startup:function () {
		var _this = this;
		//left
		var _left = new Can.ui.toolbar.Button({
			cssName:_this.css[0]
		});
		_left.el.attr('title', _this.btnText[0]);
		_left.el.text(_this.btnText[0]);
		//right
		var _right = new Can.ui.toolbar.Button({
			cssName:_this.css[1]
		});
		_right.el.attr('title', _this.btnText[1]);
		_right.el.text(_this.btnText[1]);
		_this.group = [_left, _right];
	},
	applyTo:function (oParent) {
		if (!this.group) {
			this.start();
		}
		for (var i = 0; i < this.group.length; i++) {
			this.group[i].getDom().appendTo(oParent);
		}
	},
	hide:function () {
		for (var i = 0; i < this.group.length; i++) {
			this.group[i].el && this.group[i].el.hide();
		}
	},
	getDOM:function (nIndex) {
		var aDOM = [];
		for (var i = 0; i < this.group.length; i++) {
			aDOM.push(this.group[i].el[0]);
		}
		if (!isNaN(parseInt(nIndex, 10))) {
			return $(aDOM).eq(nIndex);
		}
		return $(aDOM);
	},
	onLeftClick:function (fFn) {
		if (typeof fFn === 'function') {
			this.group[0].on('onclick', fFn);
		}
	},
	onRightClick:function (fFn) {
		if (typeof fFn === 'function') {
			this.group[1].on('onclick', fFn);
		}
	}
});
