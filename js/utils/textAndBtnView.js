/**
 * User: Sam
 * Date: 13-2-21
 * Time: 上午11:28
 * To change this template use File | Settings | File Templates.
 */
Can.view.textAndBtnView = Can.extend(Can.view.BaseView, {
	id: 'textAndBtnViewId',
	parentEl: null,
	//target 必须要addValue方法，后台返加的对象会传送到这里
	target: null,
	//text中的VAL要传送到的地址  == ACTION中用到
	keyUp_url: null,
	add_url: null,
	actionJs: ['js/utils/textAndBtnViewAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.textAndBtnView.superclass.constructor.call(this);
		//说明文字
		this.tipText = $('<p style="margin: 5px 0;">' + Can.msg.MODULE.PRODUCT_FORM.CREATE_GROUP_NAME + '</p>');
		//account title
		this.feildNav = new Can.ui.Panel({
			cssName: 'mod-form'
		});
		this.feildNav.el.css('float', 'left');
		//表单account
		this.textfeild = new Can.ui.TextField({
			cssName: 'el',
			width: 220,
			blankText: ''
		});
		this.textfeild.input.removeClass().addClass('ipt');
		//错误提示层
		this.erronTipNav = new Can.ui.Panel({
			id: 'tipNav',
			cssName: 'error-msg hidden',
			html: Can.msg.MODULE.PRODUCT_FORM.ERROR_TIPS
		});
		this.textfeild.el.append(this.erronTipNav.el);
		this.feildNav.addItem(this.textfeild);
		//add按钮
		this.addBtn = new Can.ui.toolbar.Button({
			id: 'addBtnId',
			cssName: 'btn btn-s11',
			text: Can.msg.MODULE.PRODUCT_FORM.ADD
		});
		this.addBtn.el.css({
			'float': 'left',
			'line-height': '32px',
			height: 32
		});
	},
	startup: function () {
		this.el = $('<div style="margin:10px 20px;"></div>');
		this.tipText.appendTo(this.el);
		this.feildNav.applyTo(this.el);
		this.addBtn.applyTo(this.el);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.textfeild.input.keyup(function () {
			_this.textfeild.el.removeClass('el-error');
			_this.erronTipNav.el.addClass('hidden');
		});
	},
//    onTextFieldKeyUp:function () {
//        var _this = this;
//        this.keyUp_url&&this.textfeild.el.keyup(function () {
//            var _th = _this;
//            return function () {
//                var val = "groupName="+_th.textfeild.getValue();
//                if (val) {
//                    $.ajax({
//                        url:_th.keyUp_url,
//                        data:val,
//                        success:function (result) {
//                            if(result.data.isExist=="true"){
//                                _th.erronTipNav.update(Can.msg.MODULE.PRODUCT_FORM.ERROR_TIPS);
//                                _th.erronTipNav.el.removeClass("hidden");
//                                return;
//                            }
//                        }
//                    })
//                }
//            }()
//        })
//    },
	onAddBtnClick: function (fn) {
		if (typeof(fn) === 'function') {
			this.addBtn.on("onclick", fn);
		}
	}
});
