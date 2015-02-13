/**
 *
 * Created by Island Huang
 * Date: 13-1-31 下午12:14
 */
$.moduleAndViewAction('businessRuleSettingModuleId', function (bizSetting) {
	bizSetting.on('oncheckout', function () {
		var v1 = this.stepOne.getSelectValue(),
			v2 = this.stepTwo.getSelectValue(),
			v3 = this.stepThree.getSelectValue(),
			v4 = this.stepFour.getSelectValue(),
			vals = "industry=" + v1.industry + "&leafcat=" + v2.leafcat + "&states=" + v3.states + "&zones=" + v3.zones + v4;

		$.ajax({
			url: Can.util.Config.seller.businessSettingModule.SUBMIT_ALL_DATA,
			data: vals,
			type: 'POST',
			success: function (resultObj) {
				if (resultObj.status == "success") {
					location.reload();
					//reload user info
					/*Can.util.userInfo(Can.util.Config.accountInfo, true);
					 var sellerIndexModule = new Can.module.SellerIndexModule();
					 sellerIndexModule.start();
					 sellerIndexModule.show();
					 var toolbarView = Can.Application.getTopMenuView();
					 toolbarView.showAllFunctions();
					 Can.Application.putModule(sellerIndexModule);*/
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, resultObj);
				}
			}
		})
	}, bizSetting);

	bizSetting.on('onnext', function () {
		this.currentStep = this.currentStep.goNext();
		if (this.currentStep instanceof Can.view.StepFourView) {
			this.nextStepBtn.hide();
			this.doneBtn.show();
		}
		else {
			this.nextStepBtn.show();
			this.nextStepBtn.enable();
		}
		this.nextStepBtn.disable();
		//区域、国家要单独判断下一步的按钮的可用情况
		if (this.currentStep instanceof Can.view.StepThreeView) {
			if (this.currentStep.getSelectValue().states != "" || this.currentStep.getSelectValue().zones != "") {
				this.nextStepBtn.enable();
			}
		}
		this.prevStepBtn.enable();
		$(this.prevStepBtn.el).removeClass("hid");
	}, bizSetting);

	bizSetting.on('onprev', function () {
		this.currentStep = this.currentStep.goLast();
		if (this.currentStep instanceof Can.view.StepOneView) {
			this.prevStepBtn.disable();
			$(this.prevStepBtn.el).addClass("hid");
		}
		else {
			this.prevStepBtn.enable();
		}
		this.nextStepBtn.show();
		this.doneBtn.hide();
		this.nextStepBtn.enable();
	}, bizSetting);
});
