/**
 * @Author: Mary June
 * @Version: 1.6
 * @Update: 13-4-9
 */

$.moduleAndViewAction('cateSelectorViewId', function (cateSelector) {
	cateSelector.onToggleSelect(function ($Item) {
		var dataSource = this;
		var nID = $Item.attr('cid');
		var sCrumbs = $Item.data('path') || '';
		if (!cateSelector.results[nID] || !cateSelector.results[nID][0]) {
			var _btn = new Can.ui.toolbar.Button({
				cssName: 'bg-ico btn-close'
			});
			_btn.on('onclick', function () {
				this.getDom().parent().remove();
				$('.cur[cid="' + nID + '"]').toggleClass('cur');
				cateSelector.delValue(nID);
			});
			var _item = new Can.ui.Panel({
				cssName: 'mod-item-q',
				items: [_btn],
				html: '<span' + (sCrumbs ? ' cantitle="' + sCrumbs + '"' : '') + '>' + dataSource.values[nID] + '</span>'
			});
			cateSelector.result.addItem(_item);
			cateSelector.results[nID] = [_item.getDom(), dataSource.values[nID]];
			cateSelector.syncValue();
		}
		else {
			cateSelector.results[nID][0].remove();
			cateSelector.delValue(nID);
		}
	});
	cateSelector.onOutRange(function () {
		Can.util.canInterface('whoSay', [Can.msg.ERROR_TEXT['ERR_TREE_000']]);
	});

	$(function () {
		cateSelector.tree.loadData(Can.util.Config['static'].category);
	});
});
