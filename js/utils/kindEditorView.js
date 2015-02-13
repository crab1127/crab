/**
 * KindEditor View
 * User: sam
 * @Update: 13-4-9
 */
Can.view.kindEditorView = Can.extend(Can.view.BaseView, {
	id: 'kindEditorViewID',
	textareaName: null,
	textArea_id: null,
	className: '',
	height: 0,
	width: 0,
	maxLength: 0,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.kindEditorView.superclass.constructor.call(this);
	},
	menuBar: ['bold', 'italic', 'underline', 'fontname', 'fontsize', 'forecolor', 'hilitecolor',
		'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
		'insertunorderedlist', '|', 'image', 'link'],
	startup: function () {
		this.el = $('<div></div>');
		this.area = $('<textarea></textarea>');
		if (this.textareaName) {
			this.area.attr('name', this.textareaName);
		}
		if (this.textArea_id) {
			this.area.attr('id', this.textArea_id);
		}
		this.area.addClass(this.className);
		this.area.css({
			width: this.width,
			height: this.height
		});
		this.area.appendTo(this.el);
		if (this.maxLength) {
//			this.descr = $('<div class="description">' + Can.msg.CHAR_LEFT + '</div>');
			this.totaler = $('<em class="num-tips-red">' + this.maxLength + '</em>');
			this.totaler.prependTo(this.descr);
//			this.descr.appendTo(this.el);
		}
	},
	showEditer: function () {
		var me = this;
		this.editor = KindEditor.create(this.area, {
			resizeType: 1,
			allowPreviewEmoticons: false,
			allowImageUpload: me.allowImageUpload || false,
			afterChange: function () {
				if (!me.maxLength) {
					return;
				}
				var count = me.maxLength - this.count(),
					errorClass = 'num-tips-red';
				me.totaler.text(count);
			},
            afterCreate: function() {
                var $body = $(this.edit.iframe.get(0).contentDocument).find('body');
                var $edit = null;
                var editRemove = null;

                // 绑定图片事件
                $body.on({
                    mouseenter: function(e) {
                        if (!$edit) {
                            var sEditStyle = "width:16px; height:16px; background:url('/C/css/common/bgimg/ico_bg.png') 0 -2151px; cursor:pointer; display:inline-block;";
                            $edit = $('<div contentEditable="false" class="edit-image"><span style="' + sEditStyle + '"></span></div>').appendTo($body);
                            $edit.css('position', 'absolute');
                        }
                        $edit.editImage = e.target;
                        $edit.css('top', $(this).position().top + 5);
                        $edit.css('left', $(this).position().left + 5);
                        clearTimeout(editRemove);
                    },
                    mouseleave: function(e) {
                        editRemove = setTimeout(function() {
                            $edit.remove();
                            $edit = null;
                        }, 100);
                    },
                    dblclick: function(e) {
                        me.editor.cmd.selection(true);
                        me.editor.cmd.range.selectNode($edit.editImage);
                        me.editor.cmd.select();
                        me.editor.plugin['image']['edit']();

                        // 删除编辑按钮
                        setTimeout(function() {
                            $edit.remove();
                            $edit = null;
                        }, 100);
                    }
                }, 'img');

                // 绑定编辑按钮事件
                $body.on({
                    mouseenter: function(e) {
                        clearTimeout(editRemove);
                    },
                    click: function(e) {
                        me.editor.cmd.selection(true);
                        me.editor.cmd.range.selectNode($edit.editImage);
                        me.editor.cmd.select();
                        me.editor.plugin['image']['edit']();

                        // 删除编辑按钮
                        setTimeout(function() {
                            $edit.remove();
                            $edit = null;
                        }, 100);
                    }
                }, '.edit-image');

                // 处理键盘按键删除图片
                $body.keydown(function(e) {
                    if ((e.keyCode === 8 || e.keyCode === 46) && $edit != null) {
                        $edit.remove();
                        $edit = null;
                    }
                });
            },
			items: me.menuBar,
            langType : (Can.util.Config.lang === 'en' ? 'en' : 'zh_CN'),
            afterBlur: function() {
                // 执行定制的失去焦点响应方法
                if (me.afterBlurAction) me.afterBlurAction();
            }
		});
	},
	sync: function () {
		this.editor.sync();
	},
	html: function (sContent) {
		if (sContent) {
			this.editor.html(sContent);
			return true;
		}
		return this.editor.html();
	},
	count: function () {
		return this.editor.count();
	},
	isEmpty: function () {
		return this.editor.isEmpty();
	}
});

