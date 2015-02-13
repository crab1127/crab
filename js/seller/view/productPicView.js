/**
 *
 * @Author: sam
 * @Version: 1.1
 * @Update: 13-2-1
 */

Can.view.productPicView = Can.extend(Can.view.BaseView, {
	id: 'productPicViewId',
	cssName: null,
	requireUiJs: [ 'js/utils/stepBtnView.js'],
	actionJs: ['js/seller/action/productPicViewAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.productPicView.superclass.constructor.call(this);
		this.addEvents('ON_UPDATE');
		this.mainPic = new Can.ui.Panel({
			cssName: 'slide-pic'
		});

		this.stepBtn = new Can.view.stepBtnView({
			css: ['btn-l-s1 dis', 'btn-r-s1']
		});
		this.stepBtn.start();
		this.littlePic = new Can.ui.Panel({cssName: 'small-pic', items: this.stepBtn.group});

		this.listbox = new Can.ui.Panel({cssName: 'box'});
		this.item = $('<ul></ul>').addClass('w470');
		this.listbox.addItem(this.item);
		this.littlePic.addItem(this.listbox);
	},
	startup: function () {
		this.el = $('<div class="pics"></div>');
		this.mainPic.applyTo(this.el);
		this.littlePic.applyTo(this.el);
	},
	update: function (imgsData) {
		var _item = this.item;
		var picUrlList = [];

		function __fGetSmallPic(sImg) {
			var _img = sImg.split('.');
			_img[_img.length - 2] += '_60x60_3';
			return _img.join('.');
		}

		//
		for (var i in imgsData) {
			var li_htm = $('<li><img src="' + __fGetSmallPic(imgsData[i]) + '" alt="' + Can.util.formatImgSrc(imgsData[i], 320, 320) + '"></li>');
			_item.append(li_htm);
			picUrlList.push('not use');
		}
		_item.find("li").eq(0).addClass("cur");
		this.mainPic.el.html(picUrlList[0]);//设置默认显示图片
		if (picUrlList.length <= 4) {
			this.stepBtn.group[0].hide();
			this.stepBtn.group[1].hide();
		}
        if(picUrlList.length == 1){
            this.littlePic.el.hide();
        }
	},
	hide: function () {
		this.el.hide();
	},
	show: function () {
		this.el.show();
	}
});