/**
 * Buyer Activity Action
 * Created by Island Huang
 * Date: 13-1-23 下午11:26
 */
$.moduleAndViewAction('buyerActivityModuleId', function (buyerActivity) {
	Can.importJS(['js/seller/view/buyerleadModule.js']);

	var buyerView = function (id) {

		var panel = new Can.view.titleWindowView({
			title: Can.msg.INFO_WINDOW.BUYER_TIT,
			width: 980,
			height: 380
		});

		$.ajax({
			url: '/cfone/cfbuyersupplieractivity/getBuyerInfoByNfcId.cf',
			data: {
				nfcId: id
			},
			success: function (d) {
				viewCard(d);
			}
		});

		var viewCard = function (d) {
			var participation,
				data = d['data'];

			if (d['status'] !== 'success') {
				card = 'Can\'t find buyer\'s card';
			} else {
				participation = data.buyerParticipation || 1;
				participation_recently = participation > 5 ? 5 : participation;
				card = [
					'<div class="info-box win-propelling">',
					'<div class="box-cont">',
					'<div class="propell-bd">',
					'<div class="tab-cont p-base clear" style="display: block;">',
					'<div class="ext">',
					'<div class="hd">',
					'<ul class="tab-page">',
					'<li class="cur" style="" tpindex="0">Buyer Profile</li>',
					'</ul>',
					'</div>',
					'<div class="bd">',
					'<div class="buyer-info" style="display: block;">',
					'<div class="txt-info-s1">',
					'<p class="txt-tit">email :<em>secret</em></p>',
					'<p class="txt-tit">phone :<em>secret</em></p>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'<div class="con">',
					'<div class="hd">',
					'<div class="mod-person clear">',
					'<div class="pic">' + Can.util.formatImage(data.buyerLogo, '60x60', 'male') + '</div>',
					'<div class="info">',
					'<p class="name">',
					'<a>' + data.buyerName + '</a>',
					'</p>',
					'<p class="country">',
					'<span class="flags fs' + data.countryId + '"></span>',
					'<span class="txt">' + data.countryEnName + '</span>',
					'</p>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'<div class="bd">',
					'<div class="txt-info-s2"><p class="bg-ico txt-tit face-s9">Area<em>',
					'<span class="flags fs' + data.countryId + '"></span>' + data.countryEnName + '</em></p>',
					'<p class="bg-ico txt-tit face-s9">Type<em>' + data.buyerTypeEnName + '</em></p>',
					'<p class="bg-ico txt-tit face-s9">Participations<em>' + participation + '</em></p>',
					'<p class="bg-ico txt-tit face-s9">Lately Participation',
					'<em>Nearly 5 times in the ' + participation_recently + ' Canton Fair</em></p>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'</div>',
					'</div>'
				].join('');
			}

			panel.setContent(card);
			panel.show();
		}
	};

	buyerActivity.on('onvisitornameclick', function (activiy) {
		var _id = parseInt(activiy.buyerId, 10);
		//if NFCid then
		if (isNaN(_id)) {
			buyerView(activiy.buyerId);
		}
		else {
			Can.util.canInterface('personProfile', [2, activiy.buyerId]);
		}
	});

	buyerActivity.on('onproductnameclick', function (activiy) {
		if (activiy.action == '4') {
			var nId = activiy.eventId;
			var sTitle = activiy.eventTitle;
			Can.util.canInterface('productDetail', [nId, sTitle, 'buyerActivityModuleId']);
		}
	});

	buyerActivity.on('onitembtnclick', function (log) {
		/**
		 * 0: Push Info
		 * 1: Contact Now
		 * 2: View Detail
		 */
		var _data;

		switch (parseInt(log.action, 10)) {
			case 0:
				_data = {
					buyerId: log.buyerId,
					buyerName: log.buyerName
				};
				Can.util.canInterface('pushInfo', [_data]);
				break;
			case 1:
				var _id = parseInt(log.buyerId, 10);
				//if NFCid then
				if (isNaN(_id)) {
					buyerView(log.buyerId);
				}
				else {
					_data = {
						address: {
							value: log.buyerId,
							text: log.buyerName
						}
					};
					Can.util.canInterface('writeEmail', [Can.msg.MESSAGE_WINDOW.WRITE_TIT, _data]);
				}
				break;
			case 2:
				Can.util.canInterface('readEmail', [
					{messageId: log.msgId},
					true
				]);
				break;
			default :
				Can.util.canInterface('whoSay');
		}
	});
	/**
	 * 搜索buyerlead
	 */
	buyerActivity.onSearchBtnClick(function () {
		var searchType = 'all';
		/*
		 if ($(".hd-tit .tab-s1 a:last").hasClass("cur")) {
		 searchType = 'me';
		 }
		 */
		var param = {
			categoryId: buyerActivity.categoryField.getValue(),
			countryId: buyerActivity.regionField.getValue(),
			actionId: buyerActivity.activityTypeField.getValue(),
			timeRange: buyerActivity.latestField.getValue(),
			searchType: searchType,
			currentPage: 1,
			sort: 0
		};
		buyerActivity.load(Can.util.Config.seller.activityModule.allactivity, param);
		// if(istest){
		//     buyerActivity.load(Can.util.Config.seller.buyerleadModule.NOT_SEARCH_RESULT);
		// }
		// else{
		//     buyerActivity.load(Can.util.Config.seller.buyerleadModule.nobuyerlead);
		// }
	});

	buyerActivity.on('onreturnclick', function () {
		buyerActivity.load(Can.util.Config.seller.activityModule.allactivity, {currentPage: 1, sort: 0});
	});

	buyerActivity.on('onbuyersearchclick', function () {
		Can.importJS(['js/seller/view/buyerleadModule.js']);
		var buyerleadModule = Can.Application.getModule('buyerleadModuleId');
		if (buyerleadModule == null) {
			buyerleadModule = new Can.module.BuyerLeadModule();
			buyerleadModule.start();
			Can.Application.putModule(buyerleadModule);
		}
		buyerleadModule.show();
		buyerleadModule.load(Can.util.Config.seller.buyerleadModule.allbuyerlead, {"page": 1});
	});

	buyerActivity.on('onallactivityclick', function () {
		this.load(Can.util.Config.seller.activityModule.allactivity, {currentPage: 1, sort: 0});
	}, buyerActivity);

	buyerActivity.on('onmyactivityclick', function () {
		_fLoadSearch({ searchType: 'me' });
		this.load(Can.util.Config.seller.activityModule.allactivity, {currentPage: 1, searchType: 'me', sort: 0});
	}, buyerActivity);
	function _fLoadSearch(data) {
		data = data || {};
//		data.locale = Can.util.Config.lang === "en" ? 'enUS' : 'zhCN';
		$.ajax({
			url: Can.util.Config.seller.activityModule.searchParam,
			data: data,
			success: function (jData) {
				if (jData.status && jData.status === "success") {
					buyerActivity.updateSearch(jData.data);
				}
				else {
					Can.util.EventDispatch.dispatchEvent("ON_ERROR_HANDLE", this, jData);
				}
			}
		});
	}

	$(function () {
		_fLoadSearch();
	})
});
