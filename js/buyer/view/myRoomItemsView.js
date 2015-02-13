/**
 * Created with JetBrains WebStorm.
 * User: sam
 * Date: 13-1-31
 * Time: 下午5:36
 * To change this template use File | Settings | File Templates.
 */

Can.view.myRoomItemsView = Can.extend(Can.view.BaseView, {
	id:'myRoomItems',
	title:'myRoomItems',
	target:null,
	constructor:function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.myRoomItemsView.superclass.constructor.call(this);
		//容器
		this.list = new Can.ui.Panel({
			cssName:'all-cate'
		});
		this.item = new Can.ui.Panel({cssName:'tab-s2'});//item container
		this.cont = new Can.ui.Panel({cssName:'tab-cont'});//inner container
		this.cont.addItem(this.item);
		this.list.addItem(this.cont);
	},
	getMenuItem:function (url) {
		var t = this;
		if (url != null) {
			$.ajax({
				async:false,
				type:'post',
				url:url,
				success:function (selData) {
					// console.dir(selData);
					t.update(selData);
				}
			})
		}
	},
	startup:function () {
		if (this.target) {
			this.list.addItem(this.cont);
			this.target.append(this.list.getDom());
		}
	},

	update:function (itemsObj) {

		var me = this;
		if (me.item.el.html().length > 0) {
			me.item.el.html('');
		}
		/*for (i in itemObj) {
		 var _itemTxtnav =new Can.ui.Panel({wrapEL:'a'});
		 _itemTxtnav.update(itemObj[i]);
		 me.item.addItem(_itemTxtnav);
		 }*/
		for (i = 0; i < itemsObj.data.length; i++) {
			var _itemTxtnav = new Can.ui.Panel({wrapEL:'a'});
			_itemTxtnav.update(itemsObj.data[i].name);
			_itemTxtnav.el.attr("valueID", itemsObj.data[i].code);
			me.item.addItem(_itemTxtnav);
		}

	},

	show:function () {
		this.el.show();
	},
	hide:function () {
		this.el.hide();
	}
});
