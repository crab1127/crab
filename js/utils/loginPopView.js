/**
 * User: sam
 * Date: 13-1-30
 * Time: 下午5:27
 */
Can.view.loginPopView = Can.extend(Can.view.BaseView, {
	id: 'loginPopViewID',
	parentEl: null,
	continuePrg: null,
	actionJs: ['js/utils/loginPopAction.js', 'js/framework/jquery/jquery.validate.js', 'js/framework/jquery/jQuery.md5.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.loginPopView.superclass.constructor.call(this);
		this.addEvents('ON_SAVE_CLICK', 'ON_SUBMIT_SUCCESS');
	},
	startup: function () {
		var _this = this;
		this.ContainerEL = $('<div class="bd mod-form"></div>');
		this.loginFrom = $('<form id="loginForm" name="loginForm"></form>');
		//子表单容器1
		this.subBox1 = new Can.ui.Panel({
			id: 'account',
			cssName: 'field'
		});
		//account title
		this.accountLabel = new Can.ui.Panel({
			wrapEL: 'label',
			cssName: 'tit',
			html: Can.msg.CANTON_FAIR_ID
		});
		//表单account
		this.accountfeild = new Can.ui.Panel({
			cssName: 'el',
			html: '<input class="ipt w350" type="text" name="username" tabindex="1" value="' + (window.localStorage.getItem('account') || '') + '" />'
		});
		this.account_tip = $('<div id="requestaccount" class="bg-ico error-msg hidden">' + Can.msg.REQUIRE_ACCOUNT + '</div>');
		this.accountfeild.addItem(this.account_tip);
		//子表单容器2
		this.subBox2 = new Can.ui.Panel({
			id: 'password',
			cssName: 'field'
		});
		//account title
		this.passwordLabel = new Can.ui.Panel({
			wrapEL: 'label',
			cssName: 'tit',
			html: Can.msg.PASSWORD
		});
		//表单password
		this.passwordfeild = new Can.ui.Panel({
			cssName: 'el pwd',
			html: '<input class="ipt w350" type="password" name="password_field" tabindex="2" />'
		});
		this.password_tip = $('<div id="requestpassword" class="bg-ico error-msg hidden">' + Can.msg.REQUIRE_PASSWORD + '</div>');
		this.passwordfeild.addItem(this.password_tip);
		/*this.passwordfeild.click(function () {
		 _this.fireEvent('ON_SAVE_CLICK', this);
		 });*/

		//密码大小写检测
		$password_capslock = $('<span class="icons capslock-0"></span><div class="pwdtips pwdtips2"><span class="icons allow-0"></span><span i18n>' + Can.msg.MODULE.MY_SETTING.PWD_TIPS + '</span></div>');
		this.passwordfeild.el.keypress(function (e) {
			var _charCode = String.fromCharCode(e.which);
			if (_charCode.toUpperCase() === _charCode && _charCode.toLowerCase() !== _charCode && !e.shiftKey) {
				var _tips = $(this).parent().find('.pwdtips').length;
				if (_tips > 0) {
					return;
				} else {
					$(this).append($password_capslock);
				}
			} else {
				$('.capslock-0').remove();
				$('.pwdtips').remove();
			}
		});
		this.passwordfeild.el.find('.ipt').blur(function () {
			$('.capslock-0').remove();
			$('.pwdtips').remove();
		});

		//子表单容器 验证码
		this.subBox6 = new Can.ui.Panel({
			id: 'authCode-box',
			cssName: 'field hidden cc'
		});
		//account title
		this.authCodeLabel = new Can.ui.Panel({
			wrapEL: 'label',
			cssName: 'tit',
			html: Can.msg.CODE
		});
		//表单account
		this.authCodeinput = new Can.ui.Panel({
			cssName: 'el authCode-input',
			html: '<input class="ipt" type="text" id="authCode" value="" name="authCode"><div id="authCodereq" class="bg-ico error-msg hidden">' + Can.msg.CODE_ERROR + '</div>'
		});
		this.authCodeimg = new Can.ui.Panel({
			id: 'authCodeimg',
			cssName: 'authCode-img',
			html: '<img src="" alt="authCode" height="32px"><a href="javascript:;" class="code-refresh">' + Can.msg.CODE_REFRESH + '</a>'
		});

		//子表单容器3
		this.subBox3 = new Can.ui.Panel({
			id: 'password',
			cssName: 'extra-info',
			html: '<a class="forget" href="' + Can.util.Config[Can.util.userInfo().getUserType() === 1 ? 'seller' : 'buyer'].loginPop.forgotPWD + '" target="_blank">' + Can.msg.FORGOT_PASSWORD + '</a><label class="remenber" for="rem"><input id="rem" type="checkbox" value="" name="">' + Can.msg.REMEMBER_ME + '</label>'
		});
		//子表单容器4(按纽)
		this.subBox4 = new Can.ui.Panel({
			cssName: 'action',
			id: ''
		});
		//登录按钮
		this.signinBut = new Can.ui.toolbar.Button({
			id: 'signinButID',
			cssName: 'btn btn-s13',
			text: Can.msg.BUTTON.SIGN_IN
		});

		this.signinBut.click(function () {
			_this.fireEvent('ON_SAVE_CLICK', this);
		});
		//子表单容器5(sign up)
		this.subBox5 = new Can.ui.Panel({
			wrapEL: 'p',
			cssName: 'sign-up',
			html: Can.msg.NOT_MEMBER + ' <a href="' + Can.util.Config[Can.util.userInfo().getUserType() === 1 ? 'seller' : 'buyer'].loginPop.signUp + '" target="_blank">' + Can.msg.SIGN_UP + '</a>'
		});

		//组成子表单容器1
		this.subBox1.addItem(this.accountLabel);
		this.subBox1.addItem(this.accountfeild);

		//组成验证码容器
		this.subBox6.addItem(this.authCodeLabel);
		this.subBox6.addItem(this.authCodeinput);
		this.subBox6.addItem(this.authCodeimg);

		//组成子表单容器2
		this.subBox2.addItem(this.passwordLabel);
		this.subBox2.addItem(this.passwordfeild);
		this.subBox4.addItem(this.signinBut);
		this.loginFrom.append(this.subBox1.getDom());
		this.loginFrom.append(this.subBox2.getDom());
		this.loginFrom.append(this.subBox6.getDom());
		this.loginFrom.append(this.subBox3.getDom());
		this.loginFrom.append(this.subBox4.getDom());
		this.loginFrom.append(this.subBox5.getDom());
		this.ContainerEL.append(this.loginFrom);

	}
});

