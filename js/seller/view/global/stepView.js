/**
 * 商业规则设置基础view
 * Created by Island Huang
 * Date: 13-1-29 下午10:59
 */
Can.view.StepView = Can.extend(Can.view.BaseView, {
	/**
	 * 当前步骤的标题
	 */
	title: '',
	/**
	 * 当前步骤的序号
	 */
	stepNo: 0,
	lastStep: null,
	nextStep: null,
	/**
	 * 请求初始化数据的URL，当不需要时，为null
	 */
	initDataUrl: null, constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.view.StepView.superclass.constructor.call(this);
		this.addEvents('ondataloaded', 'onitemselected');
		this.on('ondataloaded', this.onData, this);
	},
	/**
	 * 显示当前步骤
	 */
	show: function () {
		this.stepContainer.toggle('fast');
	},
	/**
	 * 隐藏当前步骤
	 */
	hide: function () {
		this.stepContainer.toggle('fast');
	},
	/**
	 * 设置当前step的上一步和下一步
	 */
	setSteps: function (lastStep, nextStep) {
		this.lastStep = lastStep;
		this.nextStep = nextStep;
	},
	/**
	 * 去到下一步
	 */
	goNext: function () {
		if (this.nextStep && this.nextStep instanceof Can.view.StepView) {
			var t = this.getSelectValue();
			if (this.stepNo == 1) {
				var nextObj = this.nextStep;
				$.ajax({
					url: Can.util.Config.seller.businessSettingModule.secondcategory,
					data: this.getSelectValue(),
					success: function (resultData) {
						var objList = resultData.data;
						nextObj.updateData(objList);
					}
				});
                this.nextStep.selectItems.removeAll();
			}
			this.nextStep.show();
			this.hide();
			return this.nextStep;
		}
	},
	/**
	 * 回到上一步
	 */
	goLast: function () {
		if (this.lastStep && this.lastStep instanceof Can.view.StepView) {
            if(this.stepNo==1){

            }
			this.lastStep.show();
			this.hide();
			return this.lastStep;
		}
		return false;
	},
	/**
	 * 每一个步骤获取初始化数据的方法
	 */
	loadConfigData: function () {
		var me = this;
		if (!me.initDataUrl)
			return;
		$.ajax({
			url: me.initDataUrl,
			data: {},
			async: false,
			type: 'POST',
			dataType: 'TEXT',
			success: function (jData) {
				jData = eval('(' + jData + ')');
				if (jData.status && jData.status === 'success') {
					var items = jData.data;
					me.fireEvent('ondataloaded', items);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
				}
			}
		});
	},
	/**
	 * 子类需要实现此方法，用以处理从后台返回的数据
	 */
	onData: Can.emptyFn,
	/**
	 * 获取当前步骤user所设置的value
	 * @return {key:value}
	 */
	getSelectValue: Can.emptyFn,
	startup: function () {
		this.stepContainer = $('<div></div>').hide();
		this.stepContainer.attr('class', 'busin-step' + this.stepNo);
		if (this.stepNo != 4) {
			//因为HTML结构第4步时，包含多个标题，因此，在第4步，需要由子类自己实现标题
			this.titleContainer = $('<div class="tit-s3 clear"></div>');
			this.titleContainer.html('<span class="ico"></span><h3>' + this.title + '</h3>');
			this.titleContainer.appendTo(this.stepContainer);
		}

		this.loadConfigData();
	},
	/**
	 * 将当前步骤显示在某个容器中
	 * @param {Object} container 父级容器
	 */
	applyTo: function (container) {
		if (typeof container == 'object') {
			$(container).append(this.stepContainer);
		}
	}
});