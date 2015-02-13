/**
 * user grade
 * @Author: AngusYoung
 * @Version: 1.3
 * @Since: 13-4-9
 */

Can.view.userGradeView = Can.extend(Can.view.BaseView, {
	id: 'userGradeViewId',
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.userGradeView.superclass.constructor.call(this);
		this.contentEl = $('<div></div>');
		this.gradeNode = $('<div></div>');
		this.tagNode = $('<div></div>');
		this.groupNode = $('<div></div>');
		this.followGroupList = new Can.ui.groupDropDownField({
			cssName: 'group-button-box btn-group',
			blankText: Can.msg.INFO_WINDOW.ADD_TO,
			btnCss: 'ui-btn btn-s btn-gray',
			btnTxt: Can.msg.BUTTON.NEW_GROUP,
			maxHeight: jCfg.maxHeight || 0,
			name: 'groupId',
			add_url: Can.util.Config.seller.myContacterModule.newGroup,
			keyUp_url: Can.util.Config.seller.myContacterModule.CHECK_GROUP_NAME,
			items_url: Can.util.Config.seller.myContacterModule.MENUDATA,
			update_btn_txt: true,
			add_callback: function (jData) {
				this.target.set_items();
				var contactModule = Can.Application.getModule('myContacterModuleId');
				if (contactModule) {
					contactModule.loadMenu();
					contactModule.addtoBtnFeild.set_items();
				}
			}
		});
	},
	startup: function () {
		this.contentEl.addClass(this.cssName);
		this.gradeNode.addClass(this.gradeCss);
		this.tagNode.addClass(this.tagCss);
		this.groupNode.addClass(this.groupCss);

		this.contentEl.append(this.gradeNode);
		this.contentEl.append(this.tagNode);
		this.contentEl.append(this.groupNode);
	},
	setContent: function (jData) {
		if (jData.gradeData) {
			this.createGrade(jData.gradeData);
		}
		if (jData.tagData) {
			this.createTag(jData.tagData);
		}
		if (jData.groupData) {
			this.createGroup(jData.groupData);
		}
		this.start();
	},
	getValue: function () {
		//评级
		var jRe = this.getFormData(this.contentEl);
		//标签
		var $Tags = this.contentEl.find('.impression-eva .eva .roll .mod-item-q');
		var aTags = [];
		$Tags.each(function () {
			aTags.push($(this).children('span').text());
		});
		jRe['remarks'] = aTags;
		//分组
		jRe['groupId'] = this.followGroupList.getValue();
		jRe['groupName'] = this.followGroupList.getValueLabel();
		return jRe;
	},
	getFormData: function ($Form) {
		var $Input = $Form.find('input:checked');
		var jRe = {};
		$Input.each(function () {
			jRe[$(this).attr('name')] = $(this).val();
		});
		return jRe;
	},
	createGroup: function (jData) {
		this.groupNode.append('<p class="l-tit">' + Can.msg.INFO_WINDOW.GROUP + '</p>');
		var _eva = $('<div class="eva"></div>');
		this.followGroupList.updateOptions(jData);
		this.followGroupList.setValue(jData.normal);
		this.followGroupList.applyTo(_eva);
		this.groupNode.append(_eva);
	},
	createTag: function (aData) {
		function __fCreateTag(aTag) {
			var sResult = '';
			for (var i = 0; i < aTag.length; i++) {
				var value = aTag[i];
				sResult += '<div class="mod-item-q"><input type="hidden" name="remarks" value="' + value + '"><span>' + value + '</span><a class="bg-ico btn-close" href="javascript:;"></a></div>'
			}
			return sResult;
		}

		var _html = '<p class="l-tit">' + Can.msg.INFO_WINDOW.REMARKS + '</p>' +
			'   <div class="eva">' +
			'       <div class="mod-wri clear">' +
			'           <div class="r-con"><input type="text"></div>' +
			'           <a class="btn-add" href="javascript:;"></a>' +
			'       </div>' +
			'       <div class="roll clear">' + __fCreateTag(aData) + '</div>' +
			'   </div>' +
			'</div>';
		this.tagNode.append(_html);
		var $Roll = this.tagNode.find('div.roll');
		this.tagNode.find('a.btn-add').click(function () {
			var _ipt = $(this).prev().children('input');
			var _v = $.trim(_ipt.val());
			//如果标签为空则添加失败
			if (_v) {
				var _h = __fCreateTag([_v]);
				$Roll.append(_h);
			}
			else {
				Can.util.canInterface('whoSay', [Can.msg.ERROR_TEXT['ERR_TAG_001']]);
			}
			_ipt.val('');
		});
		$Roll.delegate('a', 'click', function () {
			$(this).parent().remove();
		});
	},
	createGrade: function (aData) {
		for (var i = 0; i < aData.length; i++) {
			var _line = aData[i];
			var _fieldPanel = new Can.ui.Panel({cssName: 'field'});

			var _fieldEl = new Can.ui.Panel({cssName: 'el'});

			var _formPanel = new Can.ui.Panel({cssName: 'el-cont'});
			var _actForm = new Can.ui.actForm({
				hasForm: true,
				cssName: 'inner',
				itemCss: 'rd'
			});
			_actForm.createContent([_line]);
			_formPanel.addItem(_actForm);

			_fieldEl.addItem(_formPanel);

			_fieldPanel.addItem(['<label class="col">' + _line.label + '</label>', _fieldEl]);

			_fieldPanel.applyTo(this.gradeNode);
		}
	}
});
