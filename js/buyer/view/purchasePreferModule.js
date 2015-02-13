/**
 * Buyer Purchase Preference
 * @Author: AngusYoung
 * @Version: 1.3
 * @Since: 13-3-20
 */

Can.module.purchasePreferModule = Can.extend(Can.module.BaseModule, {
	id: 'purchasePreferModuleId',
	currentPanel: 0,
	requireUiJs: [
		'js/utils/stepBtnView.js',
		'js/utils/cateSelectorView.js'
	],
	actionJs: ['js/buyer/action/purchasePreferAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.module.purchasePreferModule.superclass.constructor.call(this);
		this.addEvents('ON_STEP_CHANGE');
	},
	startup: function () {
		Can.module.purchasePreferModule.superclass.startup.call(this);

		//非toolbar下的panel，加入以下css拉回位置
		this.containerEl.addClass('shrink');

		this.titler = new Can.ui.Panel({
			cssName: 'tips-s3 clear',
			html: Can.msg.BUYER.PURCHASE_PREFER.TOP_TIT
		});
		this.mainContent = new Can.ui.Panel({
			cssName: 'settings-cgs',
			wrapEL: 'form'
		});

		this.stepOne = new Can.ui.Panel({cssName: 'step1'});
		this.stepTwo = new Can.ui.Panel({cssName: 'step2'});
		this.stepThree = new Can.ui.Panel({cssName: 'step3'});

		this.stepBtn = new Can.view.stepBtnView({
			css: ['btn-prev-s1', 'btn-next-s1'],
			btnText: [Can.msg.RULE_STEP.BACK, Can.msg.RULE_STEP.NEXT]
		});
		//插入子标题
		var _step1Title = new Can.ui.Panel({
			cssName: 'tit-s3 clear',
			html: Can.msg.BUYER.PURCHASE_PREFER.STEP_1_TIT
		});
		this.stepOne.addItem(_step1Title);

		var _step2Title = new Can.ui.Panel({
			cssName: 'tit-s3 clear',
			html: Can.msg.BUYER.PURCHASE_PREFER.STEP_2_TIT
		});
		this.stepTwo.addItem(_step2Title);

		var _step3Title = new Can.ui.Panel({
			cssName: 'tit-s3 clear',
			html: Can.msg.BUYER.PURCHASE_PREFER.STEP_3_TIT
		});
		this.stepThree.addItem(_step3Title);
		var _step4Title = new Can.ui.Panel({
			cssName: 'tit-s3 clear',
			html: Can.msg.BUYER.PURCHASE_PREFER.STEP_4_TIT
		});

		//插这个input是为了存选中的那些列表，为什么呢？因为这里整个采购偏好是表单来的
		var _input = $('<input type="hidden" name="categoryId" />');
		//加一个window进来，为什么要加一个window呢，哈哈
		var cateSelectorWin = new Can.view.titleWindowView({
			title: Can.msg.CATE_SELECTOR.TITLE,
			width: 978
		});
		this.cateSelector = new Can.view.cateSelectorView({
			cssName: 'selector-box cate-list sel-cate',
			target: _input,
			searchDepth: 1,
			maxSelect: 3,
			maxLevel: 2
		});
		this.cateSelector.start();
		cateSelectorWin.setContent(this.cateSelector.contentEl);
		cateSelectorWin.show(function () {
			// 因为加进来的是一个window但是在这里的这个东西又不应该是window
			// 所以就要把window相应的一些属性给处理掉
			this.maskEl = null;
			this.beforeClose = function () {
				return false;
			};
			this.el.addClass('prefer-win');
		});
		//插入那个window到stepOne
		this.stepOne.addItem(cateSelectorWin.win);
		this.stepOne.addItem(_input);
		//一个请求返回所有的表单数据
		var _form1_data, _form2_data, _form3_data, _form4_data, _form5_data;
		$.ajax({
			url: Can.util.Config.buyer.preference.formData,
			async: false,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					var _data = jData.data;
					_form1_data = [_data['employee']];
					_form2_data = [_data['regCapital']];
					_form3_data = [_data['annualSale']];
					_form4_data = [_data['companyType']];
					_form5_data = [_data['numOfExh']];
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
		/*选项一*/
		var _sp1 = new Can.ui.Panel({cssName: 'sp-extent ext-person'});
		var _sp1_tit = new Can.ui.Panel({
			cssName: 'tit-s4',
			html: Can.msg.BUYER.PURCHASE_PREFER.STEP_2_1_TIT
		});
		var _form1 = new Can.ui.actForm({
			hasForm: true,
			elTag: 'ul',
			itemTag: 'li'
		});
		_form1.createContent(_form1_data);
		_sp1.addItem([_sp1_tit, _form1]);
		this.stepTwo.addItem(_sp1);
		/*选项二*/
		var _sp2 = new Can.ui.Panel({cssName: 'sp-extent ext-person'});
		var _sp2_tit = new Can.ui.Panel({
			cssName: 'tit-s4',
			html: Can.msg.BUYER.PURCHASE_PREFER.STEP_2_2_TIT
		});
		var _form2 = new Can.ui.actForm({
			hasForm: true,
			elTag: 'ul',
			itemTag: 'li'
		});
		_form2.createContent(_form2_data);
		_sp2.addItem([_sp2_tit, _form2]);
		this.stepTwo.addItem(_sp2);
		/*选项三*/
		var _sp3 = new Can.ui.Panel({cssName: 'sp-extent ext-person'});
		var _sp3_tit = new Can.ui.Panel({
			cssName: 'tit-s4',
			html: Can.msg.BUYER.PURCHASE_PREFER.STEP_2_3_TIT
		});
		var _form3 = new Can.ui.actForm({
			hasForm: true,
			elTag: 'ul',
			itemTag: 'li'
		});
		_form3.createContent(_form3_data);
		_sp3.addItem([_sp3_tit, _form3]);
		this.stepTwo.addItem(_sp3);
		/*选项四*/
		var _sp4 = new Can.ui.Panel({cssName: 'f-cont'});
		var _form4 = new Can.ui.actForm({
			cssName: 'row f-chk',
			hasForm: true
		});
		_form4.createContent(_form4_data);
		_sp4.addItem(_form4);
		this.stepThree.addItem(_sp4);
		/*选项五*/
		var _sp5 = new Can.ui.Panel({cssName: 'f-cont'});
		var _form5 = new Can.ui.actForm({
			cssName: 'row',
			hasForm: true
		});
		_form5.createContent(_form5_data);
		_sp5.addItem(_form5);
		this.stepThree.addItem(_step4Title);
		this.stepThree.addItem(_sp5);

		this.panelItem = [this.stepOne, this.stepTwo, this.stepThree];
		this.mainContent.addItem(this.panelItem);
		this.stepTwo.el.hide();
		this.stepThree.el.hide();

		this.titler.applyTo(this.contentEl);
		this.mainContent.applyTo(this.contentEl);
		this.stepBtn.applyTo(this.contentEl);
		this.stepBtn.getDOM().addClass('dis');
		this.stepBtn.getDOM(0).hide();
	},
	onCheckThree: function (fFn) {
		if (typeof fFn === 'function') {
			var _this = this;
			this.stepThree.el.delegate('input', 'click', function () {
				fFn.call(_this.stepThree.el);
			});
		}
	},
	onCheckTwo: function (fFn) {
		if (typeof fFn === 'function') {
			var _this = this;
			this.stepTwo.el.delegate('input', 'click', function () {
				fFn.call(_this.stepTwo.el);
			});
		}
	},
	checkFormData: function ($Form, sKey) {
		var _r = this.getFormData($Form);
		if (sKey) {
			return _r[sKey];
		}
		for (var v in _r) {
			if (!_r[v]) {
				return false;
			}
		}
		return true;
	},
	getFormData: function ($Form) {
		var jFormData = {};
		var aItem = $Form.find('input[name],textarea[name],select[name]');
		for (var i = 0; i < aItem.length; i++) {
			//不要问我为什么不要jQuery.form，就是不想用
			var oItem = aItem.eq(i)[0];
			var sKey = oItem.getAttribute('name');
			var sValue = oItem.value;
			if (!sKey) {
				continue;
			}
			!jFormData[sKey] && (jFormData[sKey] = '');
			var sType = oItem.getAttribute('type').toUpperCase();
			//哦，如果是单选框的话只拿一个值哦
			if (sType === 'RADIO' && oItem.checked) {
				jFormData[sKey] = sValue;
			}
			//多选框的话只拿选中过的值
			else if (sType === 'CHECKBOX' && oItem.checked) {
				if (jFormData[sKey]) {
					jFormData[sKey].push(sValue);
				}
				else {
					jFormData[sKey] = [sValue];
				}
			}
			else if (sType !== 'RADIO' && sType !== 'CHECKBOX') {
				if (sKey === 'categoryId') {
					jFormData[sKey] = sValue.split('┃');
				}
				else {
					jFormData[sKey] = sValue;
				}
			}
		}
		return jFormData;
	},
	submit: function () {
		//提交前先保存一下分类选择器的最终结果
		this.cateSelector.toSave();
		//拿表单来开刀了
		var jFormData = this.getFormData(this.mainContent.el);
		var sFormData = Can.util.formatFormData(jFormData);

		//发送AJAX请求，觉得我很2是吧，确实如此
		var _this = this;
		$.ajax({
			url: Can.util.Config.buyer.preference.saveData,
			type: 'POST',
			data: sFormData,
			success: function (jData) {
				if (jData.status && jData.status === 'success') {
					_this.fireEvent('ON_SUBMITED');
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	}
});
