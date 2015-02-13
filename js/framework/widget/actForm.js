/**
 * Act Form
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-7-29
 */

Can.ui.actForm = Can.extend(Can.ui.BaseUI, {
	hasForm: false,
	isImitate: false,
	formAction: '',
	formMethod: 'post',
	formTarget: '',
	elTag: 'div',
	itemTag: 'div',
	itemCss: null,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.actForm.superclass.constructor.call(this);
		this.addEvents('ON_CLICK');
	},
	initUI: function () {
		this.createParent();
		this.loadData();
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.el.delegate('input', 'click', function (event) {
			_this.fireEvent('ON_CLICK', event);
		});
	},
	createParent: function () {
		if (this.hasForm) {
			this.el = $('<' + this.elTag + '></' + this.elTag + '>');
		}
		else {
			this.el = $('<form></form>');
			this.el.attr({
				action: this.formAction,
				method: this.formMethod,
				target: this.formTarget
			});
		}
		this.el.addClass('ui-form act-form');
		this.el.addClass(this.cssName);
	},
	createContent: function (aFormData) {
		if (!aFormData) {
			return;
		}
		var _html = '';
		for (var j = 0; j < aFormData.length; j++) {
			var jForm = aFormData[j];
			var aData = jForm.options;
			for (var i = 0; i < aData.length; i++) {
				var $ElWrap = $('<' + this.itemTag + (this.itemCss ? ' class="' + this.itemCss + '"' : '') + '></' + this.itemTag + '>');
				var _icon = '';
				if (aData[i].icon) {
					_icon = '<div class="' + aData[i].icon + '"></div>';
				}
				var _text = aData[i].text || '';
				if (this.isImitate) {
					var oInput;
					var $Label = $('<label>' + _icon + '</label>');
					switch (jForm.type) {
						case 'radio':
							//TODO -Angus imitate radio
							oInput = new Can.ui.Panel({
								wrapEL: 'span',
								html: aData[i].value
							});
							break;
						case 'checkbox':
							oInput = new Can.ui.tick({
								elName: jForm.name,
								value: aData[i].value
							});
							break;
					}
					oInput.applyTo($Label);
					$Label.attr('for', oInput.elId);
					$Label.append(_text);
					$Label.appendTo($ElWrap);
				}
				else {
					var _id = Math.random();
					_html = '<label for="ram_' + _id + '">';
					var _input = '<input type="' + jForm.type +
						'" id="ram_' + _id +
						'" name="' + jForm.name +
						'" value="' + aData[i].value;
					if (jForm.type === 'radio' || jForm.type === 'checkbox') {
						if (jForm.normal == aData[i].value) {
							_input += '" checked="checked';
						}
					}
					_input += '" />';
					_html += _icon + _input + _text + '</label>';
					$ElWrap.html(_html);
				}
				this.el.append($ElWrap);
			}
		}
	},
	loadData: function (sURL) {
		var _this = this;
		sURL && (_this.dataURL = sURL);
		if (_this.dataURL) {
			_this.empty();
			$.ajax({
				url: _this.dataURL,
				success: function (jData) {
					if (jData.status && jData.status === 'success') {
						_this.createContent(jData.data);
					}
					else {
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
					}
				}
			});
		}
	},
	empty: function () {
		this.el.empty();
	}
});