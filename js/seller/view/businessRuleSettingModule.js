/**
 * 商业规则设置
 * Created by Island Huang
 * Date: 13-1-29 下午11:38
 */
Can.module.BusinessRuleSettingModule = Can.extend(Can.module.BaseModule, {
    id:'businessRuleSettingModuleId',
    requireUiJs:['js/seller/view/global/stepView.js',
        'js/seller/view/stepOneView.js',
        'js/seller/view/stepTwoView.js',
        'js/seller/view/stepThreeView.js',
        'js/seller/view/stepFourView.js'],
    actionJs:['js/seller/action/businessSettingModuleAction.js'],
    cssName:'panel shrink',
    currentStep:null,
    constructor:function (cfg) {
        Can.apply(this, cfg || {});
        Can.module.BusinessRuleSettingModule.superclass.constructor.call(this);
        this.addEvents('oncheckout', 'onprev', 'onnext');
        //定义用于显示错误信息的窗口
        this.errorWin = new Can.view.alertWindowView({
            width:250
        });
    },
    show:function () {
        this.prevStepBtn.show();
        this.nextStepBtn.show();
        Can.module.BusinessRuleSettingModule.superclass.show.call(this);
    },
    hide:function () {
        this.prevStepBtn.hide();
        this.nextStepBtn.hide();
        this.doneBtn.hide();
        Can.module.BusinessRuleSettingModule.superclass.hide.call(this);
    },
    startup:function () {
        Can.module.BusinessRuleSettingModule.superclass.startup.call(this);
        this.contentEl.attr('class', 'content shrink');

        //init the title
        this.titlePanel = new Can.ui.Panel({
            id:'businessSettingTitle',
            wrapEL:'div',
            cssName:'tips-s3 clear',
            html:'<span class="ico"></span>' +
                '<p class="des">' + Can.msg.MODULE.BUSINESS_SET.TITLE + '</p>'
        });
        this.titlePanel.applyTo(this.contentEl);
        this.stepsContainer = $('<div></div>').appendTo(this.contentEl);
        this.stepOne = new Can.view.StepOneView();
        this.stepOne.start();
        this.stepTwo = new Can.view.StepTwoView();
        this.stepTwo.start();
        this.stepOne.setSteps(null, this.stepTwo);
        this.stepThree = new Can.view.StepThreeView();
        this.stepThree.start();
        this.stepTwo.setSteps(this.stepOne, this.stepThree);
        this.stepFour = new Can.view.StepFourView();
        this.stepFour.start();
        this.stepThree.setSteps(this.stepTwo, this.stepFour);
        this.stepFour.setSteps(this.stepThree, null);
        this.stepOne.applyTo(this.stepsContainer);
        this.stepTwo.applyTo(this.stepsContainer);
        this.stepThree.applyTo(this.stepsContainer);
        this.stepFour.applyTo(this.stepsContainer);
        this.stepOne.show();//默认显示第一步
        this.currentStep = this.stepOne;

        //初始化上一步，下一步按钮
        this.prevStepBtn = new Can.ui.toolbar.Button({
            cssName:'btn-prev-s1 hid',
            text:Can.msg.BUTTON.BR_PREV
        });
        this.nextStepBtn = new Can.ui.toolbar.Button({
            cssName:'btn-next-s1',
            text:Can.msg.BUTTON.BR_NEXT
        });
        this.doneBtn = new Can.ui.toolbar.Button({
            cssName:'btn-finish',
            text:Can.msg.BUTTON.BR_DONE,
            visibility:false
        });
        var $Body = $(document.body);
        this.prevStepBtn.applyTo($Body);
        this.prevStepBtn.show();
        this.nextStepBtn.applyTo($Body);
        this.doneBtn.applyTo($Body);

        this.prevStepBtn.click(this.prevStep, this);
        this.nextStepBtn.click(this.nextStep, this);
        this.doneBtn.click(this.doCheckout, this);

        this.nextStepBtn.disable();
        this.prevStepBtn.disable();
        this.doneBtn.disable();
        //绑定stepView 事件
        this.stepOne.on('onitemselected', this.validateSelect1, this);
        this.stepTwo.on('onitemselected', this.validateSelect2, this);
        this.stepThree.on('onitemselected', this.validateSelect3, this);
        this.stepFour.on('onitemselected', this.validateSelect4, this);
    },
    validateSelect4:function (selectedItems) {
        if (selectedItems.size() < 4) {
            this.doneBtn.disable();
        }
        else {
            this.doneBtn.enable();
        }
    },
    validateSelect1:function (selectedItems, maxNo) {
        var me = this;
        if (false == selectedItems.hasOwnProperty('_oldSize')) {
            selectedItems._oldSize = 0;
        }
        if (selectedItems.size() > maxNo) {
            if (selectedItems._oldSize <= selectedItems.size()) {
                me.errorWin.setContent('<div class="error-box ali-c">' + Can.msg.MODULE.BUSINESS_SET.ERROR_1.replace('[@]', maxNo) + '</div>');
                me.errorWin.show();
            }
            selectedItems._oldSize = selectedItems.size();
            me.nextStepBtn.disable();
        }
        else if (selectedItems.size() == 0) {
            // me.errorWin.setContent('<div class="error-box ali-c">' + Can.msg.MODULE.BUSINESS_SET.ERROR_2 + '</div>');
            // me.errorWin.show();
            me.nextStepBtn.disable();
        }
        else {
            this.nextStepBtn.enable();
        }
    },
    validateSelect2:function (selectedItems, maxNo) {
        var me = this;
        if (selectedItems.size() > maxNo) {
            me.errorWin.setContent('<div class="error-box ali-c">' + Can.msg.MODULE.BUSINESS_SET.STEP2_TITLE + '</div>');
            me.errorWin.show();
            me.nextStepBtn.disable();
        }
        else if (selectedItems.size() == 0) {
            me.errorWin.setContent('<div class="error-box ali-c">' + Can.msg.MODULE.BUSINESS_SET.ERROR_2 + '</div>');
            me.errorWin.show();
            me.nextStepBtn.disable();
        }
        else {
            this.nextStepBtn.enable();
        }
    },
    validateSelect3:function (selectedStateItems, stateMaxNo, selectedZoneItems, zoneMaxNo) {
        var me = this;
        if (false == selectedStateItems.hasOwnProperty('_oldSize')) {
            selectedStateItems._oldSize = 0;
        }
        if (false == selectedZoneItems.hasOwnProperty('_oldSize')) {
            selectedZoneItems._oldSize = 0;
        }
        if (selectedStateItems.size() > stateMaxNo || selectedZoneItems.size() > zoneMaxNo) {
            if (selectedStateItems._oldSize <= selectedStateItems.size()) {
                me.errorWin.setContent('<div class="error-box ali-c">' + Can.msg.MODULE.BUSINESS_SET.ERROR_1.replace('[@]', stateMaxNo) + '</div>');
                me.errorWin.show();
            }
            selectedStateItems._oldSize = selectedStateItems.size();
            me.nextStepBtn.disable();
        }
        if (selectedZoneItems.size() > zoneMaxNo) {
            if (selectedZoneItems._oldSize <= selectedZoneItems.size()) {
                me.errorWin.setContent('<div class="error-box ali-c">' + Can.msg.MODULE.BUSINESS_SET.ERROR_1.replace('[@]', zoneMaxNo) + '</div>');
                me.errorWin.show();
            }
            selectedZoneItems._oldSize = selectedZoneItems.size();
            me.nextStepBtn.disable();
        }
        if (selectedStateItems.size() == 0 && selectedZoneItems.size() == 0) {
            // me.errorWin.setContent('<div class="error-box ali-c">' + Can.msg.MODULE.BUSINESS_SET.ERROR_2 + '</div>');
            // me.errorWin.show();
            me.nextStepBtn.disable();
        }
        else {
            this.nextStepBtn.enable();
        }
    },
    nextStep:function () {
        this.fireEvent('onnext');
    },
    prevStep:function () {
        this.fireEvent('onprev');
    },
    doCheckout:function () {
        this.fireEvent('oncheckout');
    }
});
