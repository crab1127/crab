/**
 * 下拉选择框
 * @author Island
 * @since 2013-01-18
 */
Can.ui.DropDownField = Can.extend(Can.ui.BaseField, {
	id: null,
	/**
	 * Field的宽度，默认为不设置，需要宽度的自己在new的时候设置
	 * 如果设置了宽度会同时设置下拉选项的宽度，不设置则由css决定 __by angus
	 */
	width: null,
	/**
	 * 限制下拉菜单的最大高度
	 * @type {int}
	 */
	maxHeight: 0,
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
	cssName: 'select-box',
	/**
	 * 下拉框父级元素样式名
	 */
	optionsContainerCssName: 'mark-s1',
	/**
	 * 提示选择文字
	 */
	blankText: Can.msg.FORM.SELECT_NORMAL,
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.ui.DropDownField.superclass.constructor.call(this);
		this.addEvents('onselected', 'onclick');
	},
	initUI: function () {
		var _containerHtml = '<div></div>';
		this.el = $(_containerHtml);
		this.el.attr({'class': this.cssName, 'id': this.id});
		this.displayEL = $('<div></div>')
			.attr('class', 'txt')
			.appendTo(this.el);
		this.triggerEL = $('<a href="javascript:;"></a>').appendTo(this.displayEL);
		this.labelEL = $('<em></em>').appendTo(this.displayEL);
		this.labelEL.text(this.blankText);
		if (this.name && this.name.length > 0) {
			this.valueField = $('<input type="hidden" name="' + this.name + '"/>');
			this.valueField.val(this.value);
			this.valueField.appendTo(this.el);
		}
		/*Angus:需要宽度自己在new的时候定义，不应该全部设置默认为140*/
		this.labelEL.css('width', this.width); //[island:]控制下拉框的宽度，不同地方宽度不同，不能去掉
		//init the options
		this.initOptions();
		this.isOptionShow = false;//标识当前下拉框的状态
		var me = this;
		this.displayEL.click(function (e) {
			me.fireEvent('onclick');
			if (me.isOptionShow) {
				me.hideOptions();
			} else {
				me.showOptions();
			}
			e.stopPropagation();
		});
		/*
		this.triggerEL.click(function (event) {
			if (me.isOptionShow) {
				me.hideOptions();
			} else {
				me.showOptions();
			}
		});
		this.labelEL.click(function (event) {
			if (me.isOptionShow) {
				me.hideOptions();
			} else {
				me.showOptions();
			}
		});
		*/
		//监听页面事件，当有点击时判断是否为当前对象，非当前则隐藏下拉选项
		Can.util.EventDispatch.on('ON_PAGE_CLICK', function (event) {
			if (!$.contains(me.displayEL[0], event.target)) {
				me.isOptionShow && me.hideOptions();
			}
		});
	},
	initOptions: function () {
		this.optionsContainerEL = $('<ul></ul>').attr('class', this.optionsContainerCssName + ' hidden').appendTo(this.el);
		this.width && this.optionsContainerEL.css('width', this.width + 43);
		this.addOption();
	},
	/**
	 * 显示下拉框选项
	 */
	hideOptions: function () {
		if (this.optionsContainerEL) {
			this.isOptionShow = false;
			this.optionsContainerEL.attr('class', this.optionsContainerCssName + ' hidden');
		}
	},
	/**
	 * 显示下拉框选项
	 */
	showOptions: function () {
		if (this.optionsContainerEL) {
			//判断下拉框显示位置
			var top = this.el.height();
			var that = this;
			var maxCount = 500;
			var tryCount = 0;
			that.isOptionShow = true;
			that.optionsContainerEL.attr('class', that.optionsContainerCssName);
			
			if(this.maxHeight > 0){
				that.optionsContainerEL.css({
					maxHeight: this.maxHeight
				});
			}
			else{
				that.optionsContainerEL.css({
					maxHeight: 'auto'
				});
			}

			//防止最不到高度
			/*var time = setInterval(function () {
				tryCount++;
				var elHeight = that.optionsContainerEL.height();

				if (tryCount >= maxCount || elHeight > 0) {
					clearInterval(time);
					var oTop = that.optionsContainerEL.offset().top
					var wTop = $(window).height() * .6;

					oTop = oTop - parseInt(that.optionsContainerEL.css('top'))

					if (oTop >= wTop) {
						top = -that.optionsContainerEL.height();
					}
					that.optionsContainerEL.css({
						top: top
					});
				}
			}, 1);*/

		}
	},
	/**
	 * 设置当前Field的value, value必须要要是valueItems数组当中的一个，否则将无法生效
	 */
	setValue: function (val) {
		this.value = val;
		var order = 0;
		for (var i = 0; i < this.valueItems.length; i++) {
			if (this.valueItems[i] == val) {
				order = i;
				break;
			}
		}
		var label = this.labelItems[order];
		this.labelEL.text(label);
		this.valueField && this.valueField.val(val);
		this.hideOptions();
		this.fireEvent('onselected', val, label);
	},
	/**
	 * 设置label显示的内容
	 * @param sTxt
	 */
	setDisplayValue: function (sTxt) {
		this.labelEL.text(sTxt);
	},
	/**
	 * 选择下拉框中的某个值
	 * @param {int} index 要选择的值的index，从0开始
	 */
	selectValue: function (index) {
		var val = this.valueItems[index];
		this.setValue(val);
	},
	/**
	 * 获取当前field的选择值
	 */
	getValue: function () {
		return this.value
	},
	/**
	 * 获取当前field选择值的显示值
	 */
	getValueLabel: function () {
		return this.labelEL.text();
	},
	/**
	 * 点击按钮事件
	 * @param {Object} fn
	 */
	click: function (fn) {
		if (typeof fn == 'function') {
			this.on('onclick', fn, this);
		}
	},
	/**
	 * 更新options里的项和对应的values
	 */
	updateOptions: function (jData) {
		if (jData) {
			this.labelItems = jData.labelItems;
			this.valueItems = jData.valueItems;
		}
		var oCont = this.optionsContainerEL;
		if (oCont) {
			//如果原来有数据，清空
			oCont.empty();
			this.addOption();
		}
		else {
			this.initOptions();
		}
	},
	/**
	 * 根据labelItems和valueItems将值加入到optionsContainerEL里
	 */
	addOption: function () {
		var me = this;
		var _len = Math.min(this.valueItems.length, this.labelItems.length);
		this.labelEL.text(this.blankText);
		for (var i = 0; i < _len; i++) {
			var _liObj = $('<li style="line-height: 1.5em;"><a href="javascript:;">' + this.labelItems[i] + '</a></li>');
			_liObj.appendTo(this.optionsContainerEL);
			_liObj.attr('order', i);
			_liObj.click(function () {
				me.itemClick && me.itemClick($(this));
//				me.setAction && me.setgroup(me, me.productId);
			});
		}
	},
	//处理把产品添加到新组的程序
//	setgroup:function (droupObj, product, label) {
//		var order = droupObj.getValue();
//		var proid = product;
//		$.ajax({
//			url:this.setGroupUrl,
//			data:{productIds:product, productGroupId:order},
//			success:function (result) {
//				if (result.status && result.status === "success") {
//					// 提示已添加到分组，模块重新加载
////					alert(Can.msg.MODULE.PRODUCT_MANAGE.ADD_GROUP_PROMPT.replace("[@]",label));
//				} else {
//					// 提示添加分组失败
////					alert(result.message);
//				}
//			}
//		})
//	},
	itemClick: function (oItem) {
		var order = oItem.attr('order');
		var val = this.valueItems[order];
		this.setValue(val);
	}
});

/**
 * 下拉带按钮选择框
 * @author: Sam
 */

Can.ui.groupDropDownField = Can.extend(Can.ui.DropDownField, {
	requireUiJs: ['js/utils/windowView.js', 'js/utils/textAndBtnView.js'],
	/*
	 列表单击事件
	 a.显示按钮文字不改变
	 b.显示按钮文字改变
	 添加按钮单击事件
	 生成一个新TEXT_AND_BUTTON VIEW

	 set_items是设置初始下拉列表的方法，可以重写
	 */
	//TEXT_AND_BUTTON VIEW的KEY_UP 及 ADD   url
	add_url: null,
	keyUp_url: null,
	//点击ITEM后是否改变EM的文字,
	update_btn_txt: false,
	//添加按钮的文字
	btnTxt: null,
	//添加按钮的样式
	btnCss: null,
	//默认设置下拉的列表项R的地址
	items_url: null,
	//添加按钮的回调函数
	add_callback: null,
	/**
	 * 根据labelItems和valueItems将值加入到optionsContainerEL里,并写入分组按钮
	 */
	addOption: function () {
		var me = this;
		var _len = Math.min(this.valueItems.length, this.labelItems.length);

		for (var i = 0; i < _len; i++) {
			var _liObj = $('<li><a href="javascript:;">' + this.labelItems[i] + '</a></li>');
			_liObj.appendTo(this.optionsContainerEL);
			_liObj.attr('order', i);
			_liObj.click(function () {
				me.itemClick && me.itemClick($(this));
//                me.setAction && me.setgroup(me, me.productId, $(this).text());
			});
		}
		var groupBtn_li = $('<li class="create-group"><a class="' + this.btnCss + '" href="javascript:void(0);">' + this.btnTxt + '</a></li>');
		groupBtn_li.appendTo(this.optionsContainerEL);
		groupBtn_li.click(function () {
			var _develop = new Can.view.pinWindowView({width: 320, height: 100});
			var txtField = new Can.view.textAndBtnView({
				parentEl: _develop,
				target: me,
				add_url: me.add_url,
				keyUp_url: me.keyUp_url,
				callback: me.add_callback
			});
			txtField.start();
			_develop.setContent(txtField.el);
			_develop.show();
		})
	},
	set_items: function () {
		if (this.items_url) {
			var me = this;
			$.ajax({
				url: me.items_url,
				data: null,
				// type: "POST",
				cache: false,
				success: function (resultData) {
					var _data = resultData.data.groupList;
					var labels = [], values = [];
					for (var d = 0; d < _data.length; d++) {
						labels.push(_data[d].groupName);
						values.push(_data[d].groupId);
					}
					var menuObj = {labelItems: labels, valueItems: values}
					me.updateOptions(menuObj);
				}
			})
		}
	},
	removeAllMenu: function () {
		this.optionsContainerEL.find("li[order]").remove();
	},
	update_Item: function (jValue) {
		this.labelItems.length = 0;
		this.valueItems.length = 0;
		for (var d = 0; d < jValue.length; d++) {
			this.labelItems.push(jValue[d].groupName);
			this.valueItems.push(jValue[d].groupId);
		}
		this.updateOptions();
	},
	/**
	 * 设置当前Field的value, value必须要要是valueItems数组当中的一个，否则将无法生效
	 */
	setValue: function (val) {
		this.value = val;
		var order = 0;
		for (var i = 0; i < this.valueItems.length; i++) {
			if (this.valueItems[i] == val) {
				order = i;
				break;
			}
		}
		var label = this.labelItems[order];
		this.update_btn_txt && this.labelEL.text(label);
		this.valueField && this.valueField.val(val);
		this.hideOptions();
		this.fireEvent('onselected', val, label);
	}
});

/**
 *
 * @author: Sam
 */

Can.ui.msgSelectMSGType = Can.extend(Can.ui.DropDownField, {
	id: "msgSelectMSGTypeID",
	//传递给添加新分组事件的URL
	postUrl: null,
	//如果需要则把产品ID传送过来
	target: null,
	productId: null,
	blankText: '',
	initUI: function () {
		var _this = this;
		Can.ui.msgSelectMSGType.superclass.initUI.call(_this);
        _this.displayEL.unbind('click');
		_this.labelEL.unbind('click').click(function () {
			if (typeof _this.itemCallback === 'function') {
				if ($(this).hasClass('ticked')) {
                    $(this).toggleClass('ticked');
					_this.itemCallback(-1);
				}
				else {
					_this.itemCallback(0);
				}
			}
		});
        _this.triggerEL.click(function (event) {
            if (_this.isOptionShow) {
                _this.hideOptions();
            } else {
                _this.showOptions();
            }
        });
		_this.setValue(0);
		this.labelEL.text('');
	},
	/**
	 * 根据labelItems和valueItems将值加入到optionsContainerEL里,并写入分组按钮
	 */
	addOption: function () {
		Can.ui.msgSelectMSGType.superclass.addOption.call(this);
		this.optionsContainerEL.css('width', 'auto');
//		var groupBtn_li = $('<li class="create-group"><a class="' + this.btnCss + '" href="javascript:void(0);"></a></li>');
//		groupBtn_li.appendTo(this.optionsContainerEL);
	},
	addValue: function (jValue) {
		this.labelItems.push(jValue.label);
		this.valueItems.push(jValue.value);
		this.updateOptions();
	},
	itemClick: function (oItem) {
        this.labelEL.removeClass('ticked');
		Can.ui.msgSelectMSGType.superclass.itemClick.call(this, oItem);
		this.labelEL.text('');
		oItem.siblings('li').removeClass('selected');
		oItem.addClass('selected');
		if (typeof this.itemCallback === 'function') {
			this.itemCallback(this.getValue());
		}
	}
});

/**
 * @author: lvjw
 * @type {*}
 */
Can.ui.DisplayHtmlDropDownField = Can.extend(Can.ui.DropDownField, {

    initUI: function() {
        var _this = this;
        Can.ui.DisplayHtmlDropDownField.superclass.initUI.call(_this);
        this.labelEL.html(this.blankText);
    },

    /**
     * 设置当前Field的value, value必须要要是valueItems数组当中的一个，否则将无法生效
     */
    setValue: function (val) {
        this.value = val;
        var order = 0;
        for (var i = 0; i < this.valueItems.length; i++) {
            if (this.valueItems[i] == val) {
                order = i;
                break;
            }
        }
        var label = this.labelItems[order];
        this.labelEL.html(label);
        this.valueField && this.valueField.val(val);
        this.hideOptions();
    },

    /**
     * 只有手工选择时，才抛出onselected事件
     */
    __setValue: function (val) {
        this.value = val;
        var order = 0;
        for (var i = 0; i < this.valueItems.length; i++) {
            if (this.valueItems[i] == val) {
                order = i;
                break;
            }
        }
        var label = this.labelItems[order];
        this.labelEL.html(label);
        this.valueField && this.valueField.val(val);
        this.hideOptions();
        this.fireEvent('onselected', val, label);
    },

    itemClick: function (oItem) {
        var order = oItem.attr('order');
        var val = this.valueItems[order];
        this.__setValue(val);
    }

});

