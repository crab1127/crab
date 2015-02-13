/**
 * Auto Tags
 * @Author: AngusYoung
 * @Version: 1.4
 * @Update: 13-4-8
 */

Can.ui.autoTags = Can.extend(Can.ui.BaseUI, {
	isEllipsis: true,
	isEmailFormat: false,
	isDisabled: false,
	itemCss: 'tags-item',
	maxLen: 50,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.autoTags.superclass.constructor.call(this);
	},
	initUI: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.cssName);
		this.input = $('<input size="1" />');
		this.input.attr('disabled', this.isDisabled);
		this.el.append(this.input);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;

		_this.el.click(function (event) {
			var _x = event.clientX, _y = event.clientY;
			var $Item = $(this).children('.' + _this.itemCss);
			var oBackup, oConfirm;
			$Item.each(function () {
				var _t = $(this).offset().top - 2;
				var _h = _t + $(this).innerHeight() + 3;
				var _l = $(this).offset().left;
				if (_y > _t && _y < _h) {
					oBackup = $(this).next(':not(input)');
					if (_l > _x) {
						oConfirm = $(this);
						return false;
					}
				}
			});
			var oGolfShine = oConfirm || oBackup;
			if (oGolfShine && oGolfShine.length) {
				oGolfShine.before(_this.input);
			}
			else {
				_this.el.append(_this.input);
			}
			_this.input.focus();
		});
		_this.el.delegate('.' + _this.itemCss, 'click', function (event) {
			if ($(event.target).is('.tags-del')) {
				$(this).remove();
			}
			event.stopPropagation();
		});
		_this.el.delegate('.' + _this.itemCss, 'dblclick', function () {
			// -Angus edit this value?
			//alert($(this).data('tagvalue'))
		});
		_this.input.keyup(function () {
			if ($(this).innerWidth() < $(this).parent().innerWidth() - 15) {
				$(this).attr('size', Math.max(1, this.value.length));
			}
		});
		_this.input.keypress(function (event) {
			//非Firefox只能通过keypress获取keycode
			if (event.keyCode) {
				if (event.keyCode === _this.splitChar.charCodeAt(0)) {
					if ($.trim(this.value)) {
						_this.setValues([
							{
								value: this.value,
								text: _this.__fValueToText(this.value)
							}
						]);
					}
					return false;
				}
			}
		});
		_this.input.keydown(function (event) {
			//console.info(event.keyCode)
			if (event.keyCode === 8 && this.value === '') {
				$(this).prev().remove();
				return false;
			}
			// -Angus 删除时后面没有字符即触发，不用等到全部
			if (event.keyCode === 46 && this.value === '') {
				$(this).next().remove();
				return false;
			}
			if ($(this).innerWidth() < $(this).parent().innerWidth() - 15) {
				$(this).attr('size', Math.max(1, this.value.length + 1));
			}
			if (event.keyCode === 13 || event.keyCode === _this.splitChar.charCodeAt(0)) {
				if ($.trim(this.value)) {
					_this.setValues([
						{
							value: this.value,
							text: _this.__fValueToText(this.value)
						}
					]);
				}
				return false;
			}
			$(this).attr('title', this.value);
		});
		_this.input.blur(function () {
			if ($.trim(this.value)) {
				_this.setValues([
					{
						value: this.value,
						text: _this.__fValueToText(this.value)
					}
				]);
			}
		});
	},
	setValues: function (aValues) {
		var _this = this;
		//将不满足格式的数据进行格式化
		function __fFormatVal(jVal) {
			//AY: 从选择联系人那里过来的数据会在这里做格式化
			var sVal = jVal.value || jVal.id || '';
			var sText = jVal.text || jVal.title || jVal.value || 'Error';
			return {
				value: sVal,
				text: _this.__fValueToText(sText)
			}
		}

		//数据排重
		function __fDeDupe(jVal) {
			var aVal = _this.getValue();
			for (var i = 0; i < aVal.length; i++) {
				if (aVal[i] === jVal.value) {
					return false;
				}
			}
			return true;
		}

		this.input.val('');
		this.input.attr('title', '');
		this.input.attr('size', 1);
		for (var i = 0; i < aValues.length; i++) {
			var jVal = aValues[i];
			if (!jVal.text || !jVal.value) {
				jVal = __fFormatVal(jVal);
			}
			if (__fDeDupe(jVal)) {
				var _item = $('<div></div>');
				_item.addClass(this.itemCss);
				_item.html(jVal.text);
				_item.data('tagvalue', jVal.value);
				var _item_close = $('<span class="tags-del"></span>');
				_item.append(_item_close);
				this.input.before(_item);
			}
		}
	},
	getValue: function () {
		var aValue = [];
		var _this = this;
		var $Item = _this.el.children('.' + _this.itemCss);
		$Item.each(function () {
			aValue.push($(this).data('tagvalue'));
		});
		return aValue;
	},
	disable: function () {
		this.input.attr('disabled', true);
	},
	enabled: function () {
		this.input.removeAttr('disabled');
	},
	__fValueToText: function (sValue) {
		var _this = this;
		var _result = sValue;
		var _domain = '';
		if (_this.isEmailFormat) {
			var _n = _result.indexOf('@');
			if (_n > 0) {
				_domain = '<span class="tags-domain">' + _result.substr(_n) + '</span>';
				_result = _result.substr(0, _n);
			}
		}
		if (_this.isEllipsis) {
			_result = _result.length > _this.maxLen ? _result.substr(0, _this.maxLen - 3) + '...' : _result;
		}
		return _result + _domain;
	}
});