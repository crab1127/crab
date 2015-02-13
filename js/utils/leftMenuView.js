/**
 * KindEditor View
 * User: sam
 * @Update: 13-2-20
 */
Can.view.leftMenuView = Can.extend(Can.view.BaseView, {
	id:'leftMenuViewID',
	textareaName:'',
	className:'',
	height:'',
	width:'',
	maxLength:'',
	constructor:function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.kindEditorView.superclass.constructor.call(this);
	},

	startup:function () {
		this.el = $('<div></div>');
		this.area = $('<textarea name="' + this.textareaName + '"></textarea>');
		this.area.addClass(this.className);
		this.area.css({
			width:this.width,
			height:this.height
		});
		this.descr = $('<div class="description">' + Can.msg.CHAR_LEFT + '</div>');
		this.totaler = $('<em class="num-tips-red">' + this.maxLength + '</em>');
		this.area.appendTo(this.el);
		this.totaler.prependTo(this.descr);
		this.descr.appendTo(this.el);
	}


});

