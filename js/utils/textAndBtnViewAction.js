/**m.
 * User: sam
 * Date: 13-2-21
 * Time: 下午2:34
 */
$.moduleAndViewAction('textAndBtnViewId', function (textAndBtn) {
//    textAndBtn.onTextFieldKeyUp();
	textAndBtn.onAddBtnClick(function () {
		var val = textAndBtn.textfeild.getValue();
		if (!val) {
			textAndBtn.erronTipNav.update(Can.msg.TEXT_BUTTON_VIEW.REQUEST);
			textAndBtn.erronTipNav.el.removeClass("hidden");
			textAndBtn.textfeild.el.addClass('el-error');
		}
		else {
			if (val.length > 50) {
				textAndBtn.erronTipNav.update(Can.msg.TEXT_BUTTON_VIEW.LONG_LIMIT);
				textAndBtn.erronTipNav.el.removeClass("hidden");
				textAndBtn.textfeild.el.addClass('el-error');
				return;
			}
			if (textAndBtn.add_url) {
				$.ajax({
					url: textAndBtn.add_url,
					type: 'POST',
					data: "groupName=" + encodeURIComponent(val),
					success: function (result) {
						if (result.status == "success") {
							textAndBtn.target.removeAllMenu();
							textAndBtn.target.update_Item(result.data);
							textAndBtn.parentEl.close();
							textAndBtn.callback && textAndBtn.callback(result.data);
						}
						else {
							textAndBtn.erronTipNav.update(result.message);
							textAndBtn.erronTipNav.el.removeClass("hidden");
							textAndBtn.textfeild.el.addClass('el-error');
						}
					}
				});
			}
		}
		/*if($("#group_feild")){
		 $("#group_feild em").text(val);
		 var li_html=$('<li order="0"><a href="javascript:;">'+val+'</a></li>');
		 li_html.prependTo( $("ul.mark-s1"));
		 }*/
		//根据设定的URL把新建的值传到后台生成新组，并取回新组的ID和值用于更新下拉列表。
		/* if (textAndBtn.url) {
		 $.ajax({
		 url:textAndBtn.url,
		 async:true,
		 data:val,
		 success:function (result) {
		 if (typeof (textAndBtn.successFun) === "function") {
		 //textAndBtn.target.addValue(result.data);
		 textAndBtn.successFun(result.data);
		 }
		 }
		 })
		 }*/
		// textAndBtn.parentEl.close();
	});
});
