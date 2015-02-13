/**
 * Created with JetBrains WebStorm.
 * User: sam
 * Date: 13-1-29
 * Time: 上午9:57
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {
	infoContSwitch();
	addCantacter();
	quote();
	nameClick();
});

function infoContSwitch() {
	$(".tab-s2 a", "#buyerleaddetailModuleId").click(function () {
		var index = parseInt($(this).index(), 10);
		$(this).addClass('cur').siblings().removeClass('cur');
		$('.tab-cont').children().addClass('hidden');
		index == 0 ? $('.base-info').removeClass('hidden') : $('.con-history').removeClass('hidden');
	})
}

function addCantacter() {
	$('#addCantacter_leaddetail', "#buyerleaddetailModuleId").click(function () {
		var _contact = {
			id: $("#buyerId").val(),
			contactType: 2
		};
		Can.util.canInterface('addToContact', [_contact]);
	});
}

function quote() {
	$('#qouteBut_leaddetail', "#buyerleaddetailModuleId").click(function () {
		var _data = {
			address: {
				text: buyerlead.userinfo.username,
				value: buyerlead.buyerleadId
			}
		};
		Can.util.singleInstance('writeEmail', [Can.msg.MESSAGE_WINDOW.WRITE_TIT, _data]);
	})
}

function nameClick() {
	$('.name', "#buyerleaddetailModuleId").click(function () {
		if ($('p.name:contains("keep secret")')) {
			return false;
		}

		Can.util.canInterface('personProfile', [2, $("#buyerId").val()]);
	})
}
