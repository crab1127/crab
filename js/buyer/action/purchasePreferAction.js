/**
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-7-24
 */

$.moduleAndViewAction('purchasePreferModuleId', function (purchasePrefer) {
	purchasePrefer.stepBtn.onLeftClick(function () {
		if (!this.el.hasClass('dis')) {
			purchasePrefer.currentPanel--;
			purchasePrefer.fireEvent('ON_STEP_CHANGE', false);
		}
	});
	purchasePrefer.stepBtn.onRightClick(function () {
		if (!this.el.hasClass('dis')) {
			if (purchasePrefer.currentPanel == 2) {
				purchasePrefer.submit();
				return;
			}
			purchasePrefer.currentPanel++;
			purchasePrefer.fireEvent('ON_STEP_CHANGE', true);
		}
	});

	purchasePrefer.cateSelector.on('ON_RESULT_UPDATE', function () {
		if (this.size() > 0) {
			purchasePrefer.stepBtn.getDOM(1).removeClass('dis');
		}
		else {
			purchasePrefer.stepBtn.getDOM(1).addClass('dis');
		}
	});

	purchasePrefer.on('ON_STEP_CHANGE', function (bIncrease) {
		var nIndex = purchasePrefer.currentPanel;
		var _stepBtn = purchasePrefer.stepBtn.getDOM(),
			prev = $(_stepBtn[0]);

		if (nIndex === 0) {
			prev.hide();
		} else {
			prev.show();
		}
		_stepBtn.addClass('dis');
		if (bIncrease) {
			purchasePrefer.panelItem[nIndex - 1].el.slideUp();
			purchasePrefer.panelItem[nIndex].el.slideDown();
		}
		else {
			_stepBtn.eq(1).removeClass('dis');
			purchasePrefer.panelItem[nIndex + 1].el.slideUp();
			purchasePrefer.panelItem[nIndex].el.slideDown();
		}
		if (nIndex == 2) {
			_stepBtn.eq(1).removeClass('btn-next-s1').addClass('btn-finish');
			_stepBtn.eq(1).attr('title', Can.msg.RULE_STEP.DONE);
			_stepBtn.eq(1).text(Can.msg.RULE_STEP.DONE);
		}
		else {
			_stepBtn.eq(1).removeClass('btn-finish').addClass('btn-next-s1');
			_stepBtn.eq(1).attr('title', Can.msg.RULE_STEP.NEXT);
			_stepBtn.eq(1).text(Can.msg.RULE_STEP.NEXT);
		}
		if (nIndex > 0) {
			_stepBtn.eq(0).removeClass('dis');
			if (purchasePrefer.checkFormData(purchasePrefer.panelItem[nIndex].el)) {
				_stepBtn.eq(1).removeClass('dis');
			}
		}
	});

	purchasePrefer.onCheckTwo(function () {
		if (purchasePrefer.checkFormData(this)) {
			purchasePrefer.stepBtn.getDOM(1).removeClass('dis');
		}
		else {
			purchasePrefer.stepBtn.getDOM(1).addClass('dis');
		}
	});
	purchasePrefer.onCheckThree(function () {
		if (purchasePrefer.checkFormData(this)) {
			purchasePrefer.stepBtn.getDOM(1).removeClass('dis');
		}
		else {
			purchasePrefer.stepBtn.getDOM(1).addClass('dis');
		}
	});

	purchasePrefer.on('ON_SUBMITED', function () {
		//reload user info
		/*Can.util.userInfo(Can.util.Config.accountInfo, true);
		 //进入采购商首页
		 var buyerIndexModule = new Can.module.buyerIndexModule();
		 buyerIndexModule.start();
		 buyerIndexModule.show();
		 var toolbarView = Can.Application.getTopMenuView();
		 toolbarView.showAllFunctions();
		 Can.Application.putModule(buyerIndexModule);*/
		location.reload();
	});
});
