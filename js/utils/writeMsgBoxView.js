/**
 * write message box
 * @Author: AngusYoung
 * @Version: 1.8
 * @Update: 13-7-24
 */

Can.view.writeMsgBoxView = Can.extend(Can.view.BaseView, {
	id: 'writeMsgBoxViewId',
	isReply: false,
	parentEl: null,
	requireUiJs: ['js/utils/kindEditorView.js'],
	actionJs: ['js/utils/writeMsgBoxAction.js'],
	textareaName: 'email-content',
	referType: 'email',
	presetSubject: Can.msg.MESSAGE_WINDOW.SUBJECT_PH,
	isSend: false,
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.writeMsgBoxView.superclass.constructor.call(this);
		this.addEvents('ON_SEND_OK', 'ON_EMAIL_FAILED');
		this.contentEl = $('<div></div>');
		this.subject = new Can.ui.TextField({
			cssName: 'el',
			id: null,
			name: 'email-subject',
			width: null,
			blankText: this.presetSubject
		});
		this.addrs = new Can.ui.autoTags({
			cssName: 'ui-tags min',
			isEmailFormat: true,
			isDisabled: true,
			splitChar: ';'
		});
		this.contactBtn = new Can.ui.toolbar.Button({
			cssName: 'btn-add'
		});
		this.attach = new Can.ui.uploader({
			id: 'addEmailAttach',
			cssName: 'attach file-list',
			inputName: 'upload-files',
			btnCss: ' bg-ico atch-file',
			btnText: Can.msg.ATTACH_FILE,
			maxTotal: 3,
			fileDesc: 'Files',
			fileType: '*.doc;*.xls;*.ppt;*.docx;*.xlsx;*.pptx;*.gif;*.jpg;*.png;*.pdf;*.txt',
			fileSize: 3,
			imgTemplate: '' +
				'<div id="${fileID}" class="file-item">' +
				'	<label class="name">${fileName} (${fileSize})</label>' +
				'	<a ${deleteBind} class="close" href="javascript:;"></a>' +
				'</div>'
			// itemTemplate: '' +
			// 	'<div id="${fileID}" class="file-item">' +
			// 	'	<label class="name">${fileName} (${fileSize})</label>' +
			// 	'	<div class="progress-bar">' +
			// 	'		<div class="num data"></div>' +
			// 	'		<div class="scale uploadify-progress-bar"></div>' +
			// 	'	</div>' +
			// 	'	<a class="close" href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\');"></a>' +
			// 	'</div>'
		});

		this.editor = new Can.view.kindEditorView({
			textareaName: this.textareaName,
			width: '95%',
			height: 280
		});

		/*action area*/
		this.sendBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-green',
			text: Can.msg.BUTTON.SEND
		});
		this.cancelBtn = new Can.ui.toolbar.Button({
			cssName: 'ui-btn btn-s btn-gray',
			text: Can.msg.BUTTON.CANCEL
		});
		this.actionEl = new Can.ui.Panel({
			cssName: 'win-action ali-r',
			items: [this.sendBtn, this.cancelBtn]
		});
	},
	startup: function () {
		this.contentEl.addClass(this.cssName);
		var _field1 = new Can.ui.Panel({
			cssName: 'field',
			html: '<label class="col">' + Can.msg.MESSAGE_WINDOW.SUBJECT + '</label>',
			items: [this.subject]
		});
		if (this.isReply) {
			this.subject.input.attr('readonly', true).removeClass().addClass('txt-readonly');
		}
		var _field2 = new Can.ui.Panel({
			cssName: 'field',
			html: '<label class="col">' + Can.msg.MESSAGE_WINDOW.TO + '</label>'
		});
		var _field2_el = new Can.ui.Panel({
			cssName: 'el clear',
			items: [this.addrs, this.contactBtn, this.attach]
		});
		_field2.addItem(_field2_el);
		this.editor.start();
		this.editor.el.addClass('el');
		var _field3 = new Can.ui.Panel({
			cssName: 'field',
			html: '<label class="col">' + Can.msg.MESSAGE_WINDOW.CONTENT + '</label>',
			items: [this.editor.el]
		});

		_field1.applyTo(this.contentEl);
		_field2.applyTo(this.contentEl);
		_field3.applyTo(this.contentEl);
		this.actionEl.applyTo(this.contentEl);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		_this.sendBtn.on('onclick', function () {
			_this.sendEmail();
		});
		_this.cancelBtn.on('onclick', function () {
			_this.parentEl.close();
		});
	},
	uploaderReady: function () {
		this.attach.startUploader();
	},
	editorReady: function () {
		this.editor.showEditer();
	},
	setContent: function (jCfg) {
		if (jCfg) {
			this.msgId = jCfg.msgId;
			this.subject && this.subject.setValue(jCfg.subject || '');
			this.addrs && this.addrs.setValues([].concat(jCfg.address) || []);
			this.editor && this.editor.html(jCfg.content || '');
		}
	},
	onUploadError: function (fFn) {
		if (typeof fFn === 'function') {
			this.attach.on('ON_UPLOAD_ERROR', fFn);
		}
	},
	onContactBtnClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.contactBtn.on('onclick', fFn);
		}
	},
	getAttach: function () {
		var aAttach = [];
		var _attach = this.attach ? this.attach.getFileList() : [];
		for (var i = 0; i < _attach.length; i++) {
			aAttach.push(_attach[i].url + '|' + _attach[i].name + '|' + _attach[i].size);
		}
		return aAttach;
	},
	/**
	 * 检测Email内容是否通过并提交，可在ACTION里覆盖此方法
	 */
	checkEmail: function () {
		//console.info("checkEmail ...");
		var _pass = true;
		var _object;
		var _error = 'ERR_EMAIL_000';
		var tempStr="";		
		 
		//.......
		if (!this.subject.getValue()) {
			_pass = false;
			_object = this.subject;
			_error = 'ERR_EMAIL_101';
		}else{
			//去掉" ",包括全角的"　" 
			tempStr=this.subject.getValue().replace("　"," ").trim();
			this.subject.setValue(tempStr);
			
            if(tempStr.length<1){//check email subject is null or " "
				_pass = false;
				_object = this.subject;
				_error = 'ERR_EMAIL_101';
			}else if (!this.addrs.getValue().length) {
				_pass = false;
				_object = this.addrs;
				_error = 'ERR_EMAIL_201';
			}else if (!this.editor.count()) {
				_pass = false;
				_object = this.editor;
				_error = 'ERR_EMAIL_301';
			}
		}
		//console.info("pass:"+ _pass+", code:"+ _error+", element: "+_object);
		return {pass: _pass, code: _error, element: _object};
	},
	sendEmail: function () {
		
		var _this = this;				
		var _validator= _this.checkEmail();

		if (_validator.pass) {
			var _isOpenInfo = this.shareCheck ? this.shareCheck.el.find('input[name=isOpenInfo]').val() : 0;
			var emailData = {
				msgId: _this.msgId,
				subject: _this.subject.value || '',
				referId: _this.referId,
				referType: _this.referType,
				receiver: _this.addrs.getValue(),
				attachments: _this.getAttach(),
				content: _this.editor.html(),
				isOpenInfo: _isOpenInfo
			};
			if (!_this.isSend) {
				$.ajax({
					beforeSend: function () {
						_this.isSend = true;
					},
					url: Can.util.Config.email.sendEmail,
					data: Can.util.formatFormData(emailData),
					type: 'POST',
					success: function (jData) {
						if (jData.status && jData.status === 'success') {
							_this.parentEl.close();
							_this.fireEvent('ON_SEND_OK');
						}
						else {
							 if(jData.status && jData.errorCode){
								var win = new Can.view.msgWindowView({
			                        hasCloser:true,
			                        //width:320,
			                    });
			                    win.setContent('<div class="friendly-box ali-c">'+jData.errorCode);
			                    win.show();
			                    setTimeout(function(){
			                    	win.hide();
			                    },3000)

							} else {
								Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
							 }
						}
					},
					complete: function () {
						_this.isSend = false;
					}
				});
			}
		}else {
			_this.fireEvent('ON_EMAIL_FAILED', _validator);			
		}
	}
});
/**
 * 询盘信息窗口
 * @Author: AngusYoung
 * @Version: 2.0
 * @Update: 13-4-7
 */

Can.view.sendInquiryBoxView = Can.extend(Can.view.writeMsgBoxView, {
	id: 'sendInquiryBoxId',
	actionJs: ['js/buyer/action/sendInquiryAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.sendInquiryBoxView.superclass.constructor.call(this);
		this.addEvents('ON_SUPPLIER_CLICK', 'ON_PRODUCT_CLICK', 'ON_COMPANY_CLICK','ON_EMAIL_FAILED');

		//清除不再需要的addrs/contacBtn/attach
		delete this.addrs;
		delete this.contactBtn;
		delete this.attach;
		//公司询盘和产品询盘 多产品，多供应商
		this.inquiry = new Can.ui.Panel({
			cssName: 'inquiry-field field',
			html: '<label class="col">' + Can.msg.MESSAGE_WINDOW.TO + '</label>'
		});
	},
	startup: function () {
		this.contentEl.addClass(this.cssName);
		var _field1 = new Can.ui.Panel({
			cssName: 'field',
			html: '<label class="col">' + Can.msg.MESSAGE_WINDOW.SUBJECT + '</label>',
			items: [this.subject]
		});
		this.editor.start();
		this.editor.el.addClass('el');
		var _field3 = new Can.ui.Panel({
			cssName: 'field',
			html: '<label class="col">' + Can.msg.MESSAGE_WINDOW.CONTENT + '</label>',
			items: [this.editor.el]
		});

		_field1.applyTo(this.contentEl);
		this.inquiry.applyTo(this.contentEl);
		_field3.applyTo(this.contentEl);

		this.shareCheck = new Can.ui.Panel({
			cssName: 'post-checkbox checked'
		});
		this.shareCheck.addItem('<span class="ico-checkbox"></span><span class="share-label">Share my contact to suppliers</span><input type="hidden" name="isOpenInfo" value="1"/>');
		this.shareCheck.el.data('check', true).css({'float': 'left', marginBottom: 0});
		this.actionEl.addItem(this.shareCheck);

		this.actionEl.applyTo(this.contentEl);
		this.bindEvent();
	},
	bindEvent: function () {
		var _this = this;
		Can.view.sendInquiryBoxView.superclass.bindEvent.call(_this);
		_this.inquiry.el.delegate('a[sid]', 'click', function () {
			_this.fireEvent('ON_SUPPLIER_CLICK', $(this));
		});
		_this.inquiry.el.delegate('a[pid]', 'click', function () {
			_this.fireEvent('ON_PRODUCT_CLICK', $(this));
		});
		_this.inquiry.el.delegate('a[cid]', 'click', function () {
			_this.fireEvent('ON_COMPANY_CLICK', $(this));
		});

		_this.shareCheck.el.click(function () {
			if ($(this).data('check')) {
				$(this).data('check', false).removeClass('checked').find('input:hidden').val(0);
			} else {
				$(this).data('check', true).addClass('checked').find('input:hidden').val(1);
			}
		});
	},
	checkEmail: function () {		
		var _pass = true;
		var _error = 'ERR_EMAIL_000';
		var tempStr="";		
		 
		//.......
		if (!this.subject.getValue()) {
			_pass = false;
			_error = 'ERR_EMAIL_101';
		}else{
			tempStr=this.subject.getValue().replace("　"," ").trim();
			this.subject.setValue(tempStr);
			
            if(tempStr.length<1){
				_pass = false;
				_error = 'ERR_EMAIL_101';
			}
		}
		return {pass: _pass, code: _error};
	},
	setContent: function (jCfg) {
		if (jCfg) {
			jCfg.subject = this.presetSubject;
			Can.view.sendInquiryBoxView.superclass.setContent.call(this, jCfg);
			if (jCfg.inquiry) {
				this.addrs = {
					getValue: function () {
						var _a = [];
						for (var i = 0; i < jCfg.inquiry.length; i++) {
							_a.push(jCfg.inquiry[i].supplierId);
						}
						return _a;
					}
				};
				this.referId = [];
				this.referType = null;
				for (var i = 0; i < jCfg.inquiry.length; i++) {
					var _item = jCfg.inquiry[i];
					var _html = '<div class="el clear"><div class="tx-l"><span href="javascript:;" sid="' + _item.supplierId + '">' + _item.supplierName + '</span></div><div class="tx-r">';
					if (_item.products) {
						//产品询盘
						this.referType = this.referType || 'product_inquiry';
						for (var j = 0; j < _item.products.length; j++) {
							var _pro = _item.products[j];
							this.referId.push(_pro.productId);
							_html += '<div class="mod-pro-s2">' +
								'   <div class="pic"><span pid="' + _pro.productId + '"><img src="' + _pro.productPhoto + '" alt="' + _pro.productTitle + '"></span></div>' +
								'   <div class="info">' +
								'       <p class="txt1"><span pid="' + _pro.productId + '">' + _pro.productTitle + '</span></p>' +
								'       <p class="txt2"><span cid="' + _item.companyId + '">' + _item.companyName + '</span></p>' +
								'   </div>' +
								'</div>';
						}
					}
					else if (_item.companyId) {
						//公司询盘
						this.referType = this.referType || 'company_inquiry';
						this.referId.push(_item.companyId);
						_html += '<p><span class="c-cpy" cid="' + _item.companyId + '">' + _item.companyName + '</span></p>';
					}
					else {
						//需求询盘
						this.referType = this.referType || 'buy_inquiry';
						this.referId.push(_item.buyingLeadId);
					}
					_html += '</div></div>';
					this.inquiry.addItem(_html);
				}
				if (!this.referId.length) {
					delete this.referId;
				}
			}
		}
	}
});
