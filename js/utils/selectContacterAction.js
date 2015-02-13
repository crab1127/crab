/**
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 13-2-20
 */

$.moduleAndViewAction('selectContacterViewId', function (selectContacter) {
	selectContacter.onSelect(function (jContact, oContact) {
		oContact.parent().addClass('cur');
	});
	selectContacter.onUnSelect(function (jContact, oContact) {
		oContact.parent().removeClass('cur');
	});
	selectContacter.onNotSelect(function () {
		Can.util.canInterface('whoSay', ['Please select one.']);
	});
	selectContacter.onComplete(function () {
		selectContacter.clearValue();
	});

	$(function () {
		selectContacter.loadGroup(Can.util.Config.selectContacter.loadGroup);
	});
});