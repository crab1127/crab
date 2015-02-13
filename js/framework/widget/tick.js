/**
 * tick
 * @Author: Mary June
 * @Version: 1.3
 * @Update: 13-3-29
 */

Can.ui.tick = Can.extend(Can.ui.BaseUI, {
	cssName: 'bg-ico ico-chk',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.tick.superclass.constructor.call(this);
		this.addEvents('ON_TICK');
	},
	initUI: function () {
		this.elId = 'tick-' + Math.random();
		this.el = $('<label for="' + this.elId + '"></label>');
		this.el.addClass(this.cssName);
		this.entity = $('<input type="checkbox" />');
		this.entity.attr({
			'id': this.elId,
			'name': this.elName
		});
		this.entity.addClass('tick-imitate');
		this.entity.val(this.value);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;

		function __fToggleCss(oObj) {
			if (oObj.checked) {
				_this.el.addClass('ico-chked');
			}
			else {
				_this.el.removeClass('ico-chked');
			}
		}

		_this.entity.click(function () {
			__fToggleCss(this);
			_this.fireEvent('ON_TICK', this.checked);
		});
		Can.util.elementAttrObserve.listen(_this.entity, ['checked'], function () {
			__fToggleCss(this);
		});
		_this.on('onapply', function (oEl, oParent) {
			oParent.append(_this.entity);
		});
	},
	getValue: function () {
		return this.entity.val();
	},
	unSelect: function () {
		this.el.removeClass('ico-chked');
		this.entity.removeAttr('checked');
	}
});
