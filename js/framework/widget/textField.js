/**
 * 文字输入框
 * @author Island
 * @since 2013-01-19
 */
Can.ui.TextField = Can.extend(Can.ui.BaseField, {
	/**
	 * Field的宽度，默认为140px
	 */
	width: 175,
	/**
	 * 下拉框中每个option的value
	 * field会以下标和labelItems进行一一对应，因此valueItems和labelItems
	 * 的长度必须要一致，否则尾部不对应的item将被忽略
	 */
	valueItems: [],
	/**
	 * 下拉框中每个option的text
	 */
	labelItems: [],
	/**
	 * 当前field的value
	 */
	value: null,
	/**
	 * 下拉框默认样式名
	 */
	cssName: 'search-s2',
	/**
	 * AutoComplete下拉框父级元素样式名
	 */
	optionsContainerCssName: 'autocomplete',
	/**
	 * 提示输入文字
	 */
	blankText: Can.msg.FORM.KEYWORD,
	/**
	 * 是否AutoComplete<br/>
	 * true--必须提供数据请求URL
	 * false--默认不异步请求数据
	 */
	autoComplete: false,
	autoCompleteURL: '',
	/**
	 * 提交到后台的参数名
	 */
	name: null,
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.ui.TextField.superclass.constructor.call(this);
		this.addEvents('onselected', 'onclick');
	},
	initUI: function () {
		// TO   =>  setTimeout handler
		var TO
			, _containerHtml = '<div></div>'
			;

		this.el = $(_containerHtml);
		// this.el.attr({'class':this.cssName, 'id':this.id});
		this.el.attr({'class': this.cssName});
		if (this.id) {
			this.el.attr({ 'id': this.id });
		}
		
        this.input = $('<input class="txt" type="text" autocomplete="off">').appendTo(this.el);
        if(this.width){
            this.el.css({width: this.width});
            this.input.css({width: this.width - 20});
        }
		if (this.name) {
			this.input.attr('name', this.name);
		}
		if (this.blankText) {
			this.input.attr('placeholder', this.blankText);
		}
		var me = this;
		this.input.click(function () {
			if (me.value == '' || me.value == null) {
				me.input.val('')
			}
			me.fireEvent('onclick', me, me.input);
		});
		this.input.blur(function () {
			me.value = me.input.val();
			me.fireEvent('onblur', me, me.input);
		});
		this.inputOffset = this.input.offset();

		/*
		 this.submitCandidate = function(){
		 me.input.val(me.candidateList.find(':eq(' + me.currentCandidate + ')').text());
		 me.candidateList.hide();
		 };
		 */

		/* move candidate item
		 *
		 * @sign 
		 * -1 backward
		 * 1 forward
		 */
		this.moveCandidate = function (sign, target) {
			var prev, next, length,
				index = me.currentCandidate;

			if (index === -2) {
				return;
			}

			if (target !== undefined) {
				prev = index;
				next = target;
			} else {
				length = me.candidateList.children().length;
				next = index + sign;

				if (next === length) {
					next = 0;
				} else if (next < 0) {
					next = length - 1;
				}
				prev = next === 0 && index === length - 1 ? length - 1 : index;
			}

			me.candidateList.find(':eq(' + prev + ')').removeClass('active');
			me.candidateList.find(':eq(' + next + ')').addClass('active');
			me.currentCandidate = next;

			if (target === undefined) {
				me.setValue(me.candidateList.find(':eq(' + me.currentCandidate + ')').text());
			}
		};


		this.toggleHelper = function (value) {
			me.helperActive = value;
			clearTimeout(TO);
			if (me.candidateList) {
				me.candidateList.hide();
			}
		};

		this.input.keyup(function (event) {
			var oThis = this,
				sKeyword = me.input.val();

			me.value = oThis.value;

			if (me.helperActive === false) {
				return;
			}
			switch (event.keyCode) {
				// ESC
				case 27:
					me.hideOptions();
					return;
					break;
				// up key
				case 38:
					me.moveCandidate(-1);
					return;
					break;
				// down key
				case 40:
					me.moveCandidate(1);
					return;
					break;
				// enter
				case 13:
					/*
					 me.candidateList.hide();
					 return;
					 */
					break;
			}

			// Enter/Return keyboard event listener
			/*
			 if (event.keyCode === 13) {
			 me.fireEvent('onsubmit', me, me.input);
			 return;
			 }
			 */

			// avoid multiple unnecessary requests when type quickly
			clearTimeout(TO);
			TO = setTimeout(function () {
				// console.log(sKeyword.indexOf(me.failedCadidate))
				if (sKeyword.indexOf(me.failedCadidate) !== 0) {
					me.getRemoteData(sKeyword);
				}
				me.fireEvent('onchange', me, me.input);
			}, 300);
		});
		//监听页面事件，当有点击时判断是否为当前对象，非当前则隐藏下拉选项
		Can.util.EventDispatch.on('ON_PAGE_CLICK', function (event) {
			if (event.target.parentNode != me.input[0].parentNode) {
				me.hideOptions();
			}
		});
	},
	/*
	 * get candidate list
	 */
	getRemoteData: function (sKeyword) {
		if (!this.autoComplete || !this.autoCompleteURL) {
			return;
		}
		var that = this,
			$input = that.input,
			offset = $input.parent().offset(),
			list = '';

		if (!this.candidateList) {
			this.candidateList = $('<ul class="candidate-word hide"></ul>').appendTo($input.parent());
			this.candidateList.on('mouseenter', 'li', function () {
				var $item = $(this),
					next = that.candidateList.find('li').index($item);

				that.moveCandidate('', next);
			});
			this.candidateList.on('click', 'li', function () {
				that.setValue($(this).text());
				that.candidateList.hide();
				that.input.data('submit')();
			});
		}

		var fUpdateList = function (data) {

			if (!data.length) {
				that.failedCadidate = sKeyword;
				that.candidateList.hide();
				that.currentCandidate = -2;
				return;
			}

			for (var i = 0; i < data.length; i++) {
				list += '<li>' + data[i].keywords + '</li>';
			}


			that.candidateList.html(list)
				.css({
					'top': $input.parent().outerHeight(true),
					left: 0,
					width: $input.parent().outerWidth(true)
				})
				.show();

			that.currentCandidate = -1;
		};

		$.ajax({
			url: that.autoCompleteURL,
			data: {
				prefix: sKeyword
			},
			success: function (d) {
				if (d['status'] !== 'success') {
					that.candidateList.hide();
					return;
				}

				fUpdateList(d.data.keywordList);
			}
		});

		/*
		 if (this.autoComplete && this.autoCompleteURL.length > 0) {
		 if (this.isOnLoading) {
		 //正在请求数据，则停止新的请求
		 return;
		 }
		 this.isOnLoading = true;
		 if (!this.optionsContainerEL) {
		 this.optionsContainerEL = $('<ul></ul>').attr('class', this.optionsContainerCssName + ' hidden').appendTo(this.el);
		 this.optionsContainerEL.css({
		 'width': this.el.outerWidth(true) - 2
		 });
		 }
		 this.optionsContainerEL.empty();//清空所有的data
		 var _param = {};
		 this.name && (_param[this.name] = this.input.val());
		 var me = this;

		 $.ajax({
		 url: this.autoCompleteURL,
		 data: _param,
		 success: function (jData) {
		 if (jData.data) {
		 var aData = jData.data.items;
		 for (var i = 0; i < aData.length; i++) {
		 var _liObj = $('<li><a href="javascript:;">' + aData[i] + '</a></li>');
		 _liObj.appendTo(me.optionsContainerEL);
		 _liObj.click(function (event) {
		 event.stopPropagation();
		 me.setValue($(this).text());
		 });
		 me.isOnLoading = false;
		 }
		 me.showOptions();
		 }
		 },
		 complete: function () {
		 //因为有可能是出错的停止，所以必须在这里清除掉isOnLoading的状态，不然之后就无法再出现提示
		 me.isOnLoading = false;
		 }
		 });
		 }
		 */
	},
	/**
	 * 显示下拉框选项
	 */
	hideOptions: function () {
		if (this.candidateList) {
			this.candidateList.hide();
		}
		/*
		 if (this.optionsContainerEL) {
		 this.isOptionShow = false;
		 this.optionsContainerEL.attr('class', this.optionsContainerCssName + ' hidden');
		 }
		 */
	},
	/**
	 * 显示下拉框选项
	 */
	showOptions: function () {
		if (this.optionsContainerEL) {
			this.isOptionShow = true;
			this.optionsContainerEL.attr('class', this.optionsContainerCssName);
		}
		//获取页面的高度，如果弹出的提示层位置超过它，则显示在上面
		var _body_height = document.body.offsetHeight;
		if (this.optionsContainerEL.offset().top + this.optionsContainerEL.height() > _body_height) {
			this.optionsContainerEL.css({
				top: this.el.offset().top - this.optionsContainerEL.height()
			});
		}
	},
	/**
	 * 设置当前Field的value, value必须要要是valueItems数组当中的一个，否则将无法生效
	 */
	setValue: function (val) {
		this.value = val;
		this.input.val(val);
		this.hideOptions();
		this.fireEvent('onselected', val);
	},

	/**
	 * 获取当前field的选择值
	 */
	getValue: function () {
		return this.value;
	},
	/**
	 * 获取当前field选择值的显示值
	 */
	getValueLabel: function () {

	},
	/**
	 * 点击按钮事件
	 * @param {Object} fn
	 */
	click: function (fn) {
		if (typeof fn == 'function') {
			this.on('onclick', fn, this);
		}
	}

});
