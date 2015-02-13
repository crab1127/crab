/**
 * User: sam
 * Date: 13-8-2
 * Time: 下午2:34
 */
$.moduleAndViewAction('loginPopViewID', function (loginView) {
	loginView.loginFrom.find('input').keydown(function (event) {
		if (event.keyCode === 13) {
			loginView.fireEvent('ON_SAVE_CLICK');
		}
	});
	loginView.loginFrom.validate({
		rules: {
			username: { required: true },
			password_field: { required: true }
		},
		messages: {
			username: { required: "Please input your account!"},
			password_field: { required: "Please input your password!"}
		},
		errorPlacement: function (error, element) {
			if (element.attr("name") == "username") {
				loginView.accountfeild.el.addClass("el-error");
				loginView.account_tip.text("").removeClass("hidden");
				error.appendTo($("div[id='requestaccount']"));
			}
			if (element.attr("name") == "password_field") {
				loginView.passwordfeild.el.addClass("el-error");
				loginView.password_tip.text("").removeClass("hidden");
				error.appendTo($("div[id='requestpassword']"));
			}
		},
		submitHandler: function () {
			loginView.fireEvent('ON_SUBMIT_SUCCESS');
			return false;
		}
	});
	var account_nav = loginView.accountfeild;
	var account_tip = loginView.account_tip;
	var account_field = loginView.accountfeild.el.find("input[name='username']");
	account_field.keyup(function () {
		if (account_nav.el.hasClass('el-error') && !(account_tip.hasClass("hidden"))) {
			account_nav.el.removeClass('el-error');
			account_tip.addClass("hidden");
		}
	});
	var password_nav = loginView.passwordfeild;
	var password_tip = loginView.password_tip;
	var password_field = loginView.passwordfeild.el.find("input[name='password_field']");

	password_field.keyup(function () {
		if (account_nav.el.hasClass('el-error') && !(account_tip.hasClass("hidden"))) {
			account_nav.el.removeClass('el-error');
			account_tip.addClass("hidden");
		}
		if (password_nav.el.hasClass('el-error') && !(password_tip.hasClass("hidden"))) {
			password_nav.el.removeClass('el-error');
			password_tip.addClass("hidden");
		}
	});

	var authCodeImgSrc = '/cfone/authcode/geneimage.cf';
	var authCode_box = loginView.authCodeinput;
	var authCode = loginView.authCodeinput.el.find('#authCode');
	var authCode_tip = loginView.authCodeinput.el.find('#authCodereq');
	var authCode_img = loginView.authCodeimg;
	authCode.keyup(function () {
		if (authCode_box.el.hasClass('el-error') && !(authCode_tip.hasClass("hidden"))) {
			authCode_box.el.removeClass('el-error');
			authCode_tip.addClass("hidden");
		}
	});

	// 绑定刷新验证码事件
    authCode_img.el.on('click', 'img, .code-refresh', function() {
        var timestamp = new Date().getTime();
        authCode_img.el.find('img').attr('src', authCodeImgSrc + '?' + timestamp);
    })
    //判断显示验证码
	if ($.cookie('secureCode')) {
      loginView.subBox6.el.removeClass('hidden').find('img').attr('src', authCodeImgSrc + '?' + new Date().getTime());
    }
	loginView.on('ON_SAVE_CLICK', function () {
		loginView.loginFrom.submit();
	});
	loginView.on("ON_SUBMIT_SUCCESS", function () {
		var account = loginView.accountfeild.el.find("input[name='username']").val();
		var password = $.md5(loginView.passwordfeild.el.find("input[name='password_field']").val());
		var authCodeVal = authCode.val();
		//dp ajax before send
		$.ajaxSetup({
			beforeSend: null
		});
		var param = {j_username:account, j_password:password};
		if ($.cookie('secureCode')) {
            if (authCodeVal == "" || authCodeVal.length == 0) {
                authCode_box.el.addClass("el-error");
				authCode_tip.removeClass("hidden");
                return false;
            }
            param.j_authcode = authCodeVal;
        }
		//post
		$.ajax({
			url: Can.util.Config.login,
			type: 'POST',
			dataType: 'JSON',
			data: param,
			success: function (result) {
				if (result.status && result.status === 'success') {
					var jAccountData = result.data;
					// rewrite socket cfg
					var jItem = {
						listenUrl: jAccountData['listenUrl'],
						token: jAccountData['token']
					};
					window.localStorage.setItem('msgSocket', JSON.stringify(jItem));
					// if current login user is before the expiration
					// continue the action
					if (loginView.outUser === jAccountData['userAccount']) {
						if (loginView.continuePrg) {
							if (loginView.continuePrg.type.toUpperCase() === 'GET') {
								$.get(loginView.continuePrg.url, loginView.continuePrg.success);
							}
						}
						loginView.parentEl.close();
						// reconnect socket
						Can.Application.PushIO();
						return;
					}
					else {
						window.localStorage && window.localStorage.setItem('account', account);
					}
					if (jAccountData.userType === 1) {
						window.location.href = Can.util.Config.app.CanURL + 'supplier/';
					}
					else if (jAccountData.userType === 2) {
						window.location.href = Can.util.Config.app.CanURL + 'buyer/';
					}
				} else if (result && result.status == "unlogin"){
					var nCode = result.data ? result.data['retCode'] : "", sMsg;
					if (nCode) {
						switch (nCode) {
							case 1:
								sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_001'];
								break;
							case 4:
								sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_004'];
								break;
							case 10:
								sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_010'];
								break;
							case 11:
								sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_011'];
								break;
							case 13:
								sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_013'];
								break;
							case 14:
								sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_014'];
								break;
							case 21:
								sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_021'];
								break;
							default:
								sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_000'];
						}
					} else {
						sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_100'];
					}
					loginView.accountfeild.el.addClass("el-error");
					loginView.account_tip.text(sMsg).removeClass("hidden");
					return false
                }
				else {
					if ($.cookie('secureCode')) {
	            if (result.data.needCode && $('#authCode-box').hasClass('hidden')) {
	                 $('#authCode-box').removeClass('hidden');
	             }
	           $('#authCode-box').find('img').attr('src', authCodeImgSrc + '?' + new Date().getTime());
		            authCode.val('');
 					}

	        if (result.data.codeError) {
	          authCode_box.el.addClass('el-error');
						authCode_tip.removeClass("hidden");
	        }else {
	          sMsg = Can.msg.ERROR_TEXT['ERR_LOGIN_100'];
						loginView.accountfeild.el.addClass("el-error");
						loginView.account_tip.text(sMsg).removeClass("hidden");
	        }
				}
			}
		});
	});
});
