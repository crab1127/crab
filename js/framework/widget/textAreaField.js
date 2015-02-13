/**
 * TextArea Field
 * @Author: Mary June
 * @Version: 1.5
 * @Since: 13-4-2
 */

Can.ui.textAreaField = Can.extend(Can.ui.BaseField, {
	name: 'text-area',
	isRequireEN: true,
	isCount: false,
	hasDesc: true,
	maxLength: 100,
	blankText: 'please input',
	width: 400,
	height: 100,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.ui.textAreaField.superclass.constructor.call(this);
	},
	initUI: function () {
		this.el = $('<div></div>');
		this.el.addClass(this.cssName);
		this.textarea = $('<textarea></textarea>');
		this.textarea.attr({
			'name': this.name,
			'placeholder': this.blankText
		});
		this.textarea.css({
			width: this.width,
			height: this.height
		});
		this.el.append(this.textarea);
		if (this.hasDesc && this.maxLength) {
			this.descr = $('<div class="des">' + Can.msg.CHAR_LEFT + '</div>');
			this.totaler = $('<em class="num-tips-red">' + this.maxLength + '</em>');
			this.totaler.prependTo(this.descr);
			this.el.append(this.descr);
		}

		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		//check IE version by rubylouvre
		var ie = (function () {
			var v = 3, div = document.createElement('div'), a = div.all || [];
			while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->', a[0]) {
			}
			return v > 4 ? v : !v;
		}());
		/*count string*/
		function __fCountLen(sTxt) {
			var nLen = 0;
			for (var i = 0; i < sTxt.length; i++) {
				// to be :sTxt.charCodeAt(i) > 2000
				if (/[\u4e00-\u9fa5]+/.test(sTxt.substr(i, 1))) {
					nLen += 2;
				}
				else {
					nLen++;
				}
			}
			return nLen;
		}

		/*cut string*/
		function __fCutOutside(sTxt) {
			if (__fCountLen(sTxt) > _this.maxLength) {
				return __fCutOutside(sTxt.slice(0, -1));
			}
			else {
				return sTxt;
			}
		}

		/*cut the string for textarea, "this" scope must Textarea elemtns*/
		function __fHandleTooLong(nMaxLength) {
			if (this.tagName.toUpperCase() === 'TEXTAREA') {
				if (__fCountLen(this.value) > nMaxLength) {
					var _old_top = $(this).scrollTop();
					this.value = __fCutOutside(this.value);
					$(this).scrollTop(this.offsetHeight);
					//reset cursor position, but I can't with this moment.
					//$(this).scrollTop(_old_top);
				}
			}
		}

		/*count textarea value length*/
		if (_this.hasDesc && _this.isCount) {
			this.textarea.bind('input', function () {
				if (_this.isRequireEN) {
					this.value = this.value.replace(/[\u4e00-\u9fa5]+/g, '');
				}
				if (_this.maxLength) {
					__fHandleTooLong.call(this, _this.maxLength);
					_this.totaler.text(_this.maxLength - __fCountLen(this.value));
				}
			});
			//for IE9-
			if (ie && ie < 9) {
				this.textarea[0].onpropertychange = function (e) {
					if (_this.maxLength) {
						__fHandleTooLong.call(this, _this.maxLength);
						_this.totaler.text(_this.maxLength - __fCountLen(this.value));
						if (_this.isRequireEN && /[\u4e00-\u9fa5]+/.test(this.value)) {
							this.value = this.value.replace(/[\u4e00-\u9fa5]+/g, '');
							return false;
						}
					}
				};
			}
			this.textarea.bind('keyup', function () {
				if (_this.maxLength) {
					_this.totaler.text(_this.maxLength - __fCountLen(this.value));
				}
			});
			_this.textarea.bind('keydown', function (event) {
				if (_this.maxLength) {
					_this.totaler.text(_this.maxLength - __fCountLen(this.value));
					if (__fCountLen(this.value) + 1 > _this.maxLength
						&& event.keyCode != 8   // backspace
						&& event.keyCode != 9   // tab
						&& event.keyCode != 13  // enter
						&& event.keyCode != 33  // page up
						&& event.keyCode != 34  // page down
						&& event.keyCode != 35  // end
						&& event.keyCode != 36  // home
						&& event.keyCode != 37  // left
						&& event.keyCode != 38  // up
						&& event.keyCode != 39  // right
						&& event.keyCode != 40  // down
						&& event.keyCode != 46  // del
						&& !(event.ctrlKey
						&& (event.keyCode == 65 // ctrl A
						|| event.keyCode == 67  // ctrl C
						|| event.keyCode == 88  // ctrl X
						|| event.keyCode == 90  // ctrl Z
						))
						) {
						return false;
					}
				}
			});
		}
	},
	getValue: function () {
		return this.textarea.val();
	},
	setValue: function (sTxt) {
		this.textarea.val(sTxt);
	},
	empty: function () {
		this.setValue('');
	}
});