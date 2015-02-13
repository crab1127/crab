/**
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-4-23
 */

$.moduleAndViewAction('buyerLeadManageModuleId', function (buyerLeadManage) {
	/*定义各个TAB请求的地址*/
	var sApprovedDataURL = Can.util.Config.buyer.blManageModule.approvedData;
	var sAuditingDataURL = Can.util.Config.buyer.blManageModule.auditingData;
	var sUnapprovedDataURL = Can.util.Config.buyer.blManageModule.unapprovedData;
	var sExpiredDataURL = Can.util.Config.buyer.blManageModule.expiredData;
	var sOfflineDataURL = Can.util.Config.buyer.blManageModule.offlineData;
	/*切换TAB的时候重新加载数据*/
	buyerLeadManage.on('ON_LOAD_APPROVED', function () {
        // 切换TAB时 要清除其他TAP在queue中的数据
        buyerLeadManage.queue={};
		buyerLeadManage.approvedWrap.page = 1;
		buyerLeadManage.approvedWrap.searchCond = {};
		buyerLeadManage.approvedWrap.searchIpt.val('');
		buyerLeadManage.loadData(sApprovedDataURL, {type: 'approved'});
	});
	buyerLeadManage.on('ON_LOAD_AUDITING', function () {
        buyerLeadManage.queue={};
		buyerLeadManage.auditingWrap.page = 1;
		buyerLeadManage.auditingWrap.searchCond = {};
		buyerLeadManage.auditingWrap.searchIpt.val('');
		buyerLeadManage.loadData(sAuditingDataURL, {type: 'auditing'});
	});
	buyerLeadManage.on('ON_LOAD_UNAPPROVED', function () {
        buyerLeadManage.queue={};
		buyerLeadManage.unapprovedWrap.page = 1;
		buyerLeadManage.unapprovedWrap.searchCond = {};
		buyerLeadManage.unapprovedWrap.searchIpt.val('');
		buyerLeadManage.loadData(sUnapprovedDataURL, {type: 'unapproved'});
	});
	buyerLeadManage.on('ON_LOAD_EXPIRED', function () {
        buyerLeadManage.queue={};
		buyerLeadManage.expiredWrap.page = 1;
		buyerLeadManage.expiredWrap.searchCond = {};
		buyerLeadManage.expiredWrap.searchIpt.val('');
		buyerLeadManage.loadData(sExpiredDataURL, {type: 'expired'});
	});
	buyerLeadManage.on('ON_LOAD_OFFLINE', function () {
        buyerLeadManage.queue={};
		buyerLeadManage.offlineWrap.page = 1;
		buyerLeadManage.offlineWrap.searchCond = {};
		buyerLeadManage.offlineWrap.searchIpt.val('');
		buyerLeadManage.loadData(sOfflineDataURL, {type: 'offline'});
	});
	/*搜索*/
	buyerLeadManage.onSearchBL('approved', function (jSearch) {
		var jParam = $.extend({type: 'approved'}, jSearch);
		buyerLeadManage.loadData(sApprovedDataURL, jParam);
	});
	buyerLeadManage.onSearchBL('auditing', function (jSearch) {
		var jParam = $.extend({type: 'auditing'}, jSearch);
		buyerLeadManage.loadData(sAuditingDataURL, jParam);
	});
	buyerLeadManage.onSearchBL('unapproved', function (jSearch) {
		var jParam = $.extend({type: 'unapproved'}, jSearch);
		buyerLeadManage.loadData(sUnapprovedDataURL, jParam);
	});
	buyerLeadManage.onSearchBL('expired', function (jSearch) {
		var jParam = $.extend({type: 'expired'}, jSearch);
		buyerLeadManage.loadData(sExpiredDataURL, jParam);
	});
	buyerLeadManage.onSearchBL('offline', function (jSearch) {
		var jParam = $.extend({type: 'offline'}, jSearch);
		buyerLeadManage.loadData(sOfflineDataURL, jParam);
	});
	/*页面切换*/
	buyerLeadManage.onChangePage('approved', function (nPage, jSearch) {
		var jParam = $.extend({type: 'approved', page: nPage}, jSearch);
		buyerLeadManage.loadData(sApprovedDataURL, jParam);
	});
	buyerLeadManage.onChangePage('auditing', function (nPage, jSearch) {
		var jParam = $.extend({type: 'auditing', page: nPage}, jSearch);
		buyerLeadManage.loadData(sAuditingDataURL, jParam);
	});
	buyerLeadManage.onChangePage('unapproved', function (nPage, jSearch) {
		var jParam = $.extend({type: 'unapproved', page: nPage}, jSearch);
		buyerLeadManage.loadData(sUnapprovedDataURL, jParam);
	});
	buyerLeadManage.onChangePage('expired', function (nPage, jSearch) {
		var jParam = $.extend({type: 'expired', page: nPage}, jSearch);
		buyerLeadManage.loadData(sExpiredDataURL, jParam);
	});
	buyerLeadManage.onChangePage('offline', function (nPage, jSearch) {
		var jParam = $.extend({type: 'offline', page: nPage}, jSearch);
		buyerLeadManage.loadData(sOfflineDataURL, jParam);
	});

	buyerLeadManage.onAllOpera('approved', function (aId) {
		buyerLeadManage.offlineBl(aId);
	});
	buyerLeadManage.onAllOpera('unapproved', function (aId) {
		buyerLeadManage.deleteBl(aId);
	});
	buyerLeadManage.onAllOpera('offline', function (aId) {
		buyerLeadManage.onlineBl(aId);
	});

	$(function () {
		buyerLeadManage.clickFirst(0);
	});
});
