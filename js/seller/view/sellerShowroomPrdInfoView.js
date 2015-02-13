/**
 * Production Info view
 * Created by Island Huang
 * Date: 13-3-5 下午6:33
 */
Can.view.SellerShowroomPrdInfoView = Can.extend(Can.view.ShowroowBaseView, {
    requireUiJs: ['js/framework/utils/template.js', 'js/framework/utils/ui/window/actionWindow.js'],
    /**
     * refs #3448
     *
     * @return
     */
    hide: function () {
		Can.view.ShowroomComInfoView.superclass.hide.call(this);

        var self = this;

        if(self._isChangeNoSave){
            if(!self.leaveWin){
                self.leaveWin = new Can.util.ui.window.ActionWindow({
                    width: 470,
                    title: '',
                    message: Can.msg.MODULE.SHOWROOM_SET.CONFIRM_LEAVE,
                    actions: [{
                        btnText: Can.msg.MODULE.SHOWROOM_SET.CONFIRM_LEAVE_YES,
                        cssName: '',
                        onClick: function($el){
                            self._isChangeNoSave = false;
                            this.close();
                        }
                    },{
                        btnText: Can.msg.MODULE.SHOWROOM_SET.CONFIRM_LEAVE_NO,
                        cssName: '',
                        onClick: function($el){
                            Can.Route.run('/showroom-info/manufacturing');
                            this.close();
                        }
                    }]
                });
            }
            self.leaveWin.show();
        }
    },
    startup:function () {
        Can.view.SellerShowroomPrdInfoView.superclass.startup.call(this);
        var me = this,
            tipCon = $('<div class="tips-s4"></div>').appendTo(me.container);
        $('<span class="ico"></span>').appendTo(tipCon);
        $('<div class="des">' + Can.msg.MODULE.SHOWROOM_SET.COMP_INFO_TIPS_2 + '</div>').appendTo(tipCon);
        var contentCon = $('<div class="mod-form-s1"><div class="loading-s1"><span></span>Loading ...</div></div>').appendTo(me.container);
        $.ajax({
            url:Can.util.Config.seller.setShowroomModule.proInfoTemplate,
            dataType:'text',
            success:function (html) {
               
                //加载模板引擎
                var template = Can.util.template.compile(html);
                contentCon.html(template({}));

                me.engField = new Can.ui.DropDownField({
                    id:'engSelectFieldId',
                    name:'engineerNum',
                    blankText:Can.msg.MODULE.PRODUCT_FORM.GROUP_PLACE,
                    valueItems:[207001, 207002, 207003, 207004, 207005],
                    labelItems:['<10', '10-50', '50-100', '100-150', 'Over 150'],
                    width:140
                });
                var engCon = $('#engFieldId', '#prdInforFormId');

                me.engField.applyTo(engCon);

                me.devField = new Can.ui.DropDownField({
                    id:'devSelectFieldId',
                    name:'researchNum',
                    blankText:Can.msg.MODULE.PRODUCT_FORM.GROUP_PLACE,
                    valueItems:[208001, 208002, 208003, 208004, 208005],
                    labelItems:['<10', '10-50', '50-100', '100-150', 'Over 150'],
                    width:140
                });
                me.devField.setValue(208001);
                var devCon = $('#devPersonFieldId', '#prdInforFormId');
                me.devField.applyTo(devCon);

                me.checkPersonField = new Can.ui.DropDownField({
                    id:'checkSelectFieldId',
                    name:'qualityTestNum',
                    blankText:Can.msg.MODULE.PRODUCT_FORM.GROUP_PLACE,
                    valueItems:[209001, 209002, 209003, 209004, 209005],
                    labelItems:['<10', '10-50', '50-100', '100-150', 'Over 150'],
                    width:140
                });
                me.checkPersonField.setValue(209001);
                var checkCon = $('#checkPersonFieldId', '#prdInforFormId');
                me.checkPersonField.applyTo(checkCon);

                var formEl = $('#prdInforFormId');
                formEl.find('[name=odmExper]').change(function(){
                    var that = $(this);
                    if(Number(that.val()) == 0){
                        formEl.find('#odmdescCon').hide()
                    }
                    else{
                        formEl.find('#odmdescCon').show();
                    }
                });
                formEl.find('[name=oemExper]').change(function(){
                    var that = $(this);
                    if(Number(that.val()) == 0){
                        formEl.find('#oemdescCon').hide()
                    }
                    else{
                        formEl.find('#oemdescCon').show();
                    }
                });
                var errors = 0;
                formEl.validate({
                    wrapper:'div',
                    errorClass:'fm-error',
                    errorPlacement:function (errorEl, input) {
                        errorEl.appendTo(input.parent());
                        me.disabledSave();
                        errors++;
                    },
                    success:function (label) {
                        label.remove();
                        errors--;
                        if (errors == 0) {
                            me.enabledSave();
                        }
                    }
                });

                /**
                 * 
                 * 表单如果更改，离开时提示
                 * @return
                 */
                me._isChangeNoSave = false;
                contentCon.off('change', 'input, textarea')
                          .on('change', 'input, textarea', function(){
                              me._isChangeNoSave = true;
                           });
               
                contentCon.off('click', '.mark-s1 li')
                          .on('click', '.mark-s1 li', function(){
                              me._isChangeNoSave = true;
                           });


                me.enabledSave();
                me.refreshData();
            }
        });
    }
    /**
     * 刷新公司数据
     */, refreshData:function () {
        $('#prdInforFormId')[0].reset();
        var dataStr = $.ajax({
            url:Can.util.Config.seller.setShowroomModule.loadprdinfo,
            async:false,
            type:'POST',
            data:{companyId:Can.util.userInfo().getCompanyId()}
        }).responseText;
        var data = eval('(' + dataStr + ')');
        var obj = data.data.productionInfo.form;
        var me = this;

        var formEl = $('#prdInforFormId');
        //根据参数构造 Certification
        formEl.find('#systemCertificationEls').empty();
        $.each(obj.systemCertification.options, function(k,v){
            formEl.find('#systemCertificationEls').append(
                '<label for="c'+k+'">' +
                   '<input type="checkbox" class="vertical" id="c'+k+'" name="systemCertification" value="'+ v.value +'">' +
                   v.text +
                '</label>'
            )
        });

        $('#fsize', '#prdInforFormId').val(obj.factoryArea['default']);
        $('input[name=odmExper]', '#prdInforFormId').each(function (index) {
            if (this.value == obj.odmExper['default']) {
                this.checked = "checked";
            }
        });
        if (obj.odmExper['default'] == '1') {
            $('#odmdescCon', '#prdInforFormId').show();
            $('#odmdesc', '#prdInforFormId').val(obj.odmDesc['default']);
        }
        $('input[name=oemExper]', '#prdInforFormId').each(function (index) {
            if (this.value == obj.oemExper['default']) {
                this.checked = "checked";
            }
        });
       
        if (obj.oemExper['default'].toString() == '1') {
            $('#oemdescCon', '#prdInforFormId').show();
            $('#oemDesc', '#prdInforFormId').val(obj.oemDesc['default']);
        }
        var cers = obj.systemCertification['default'];
        for (var i = 0; i < cers.length; i++) {
            $('input[value="' + cers[i] + '"]', '#prdInforFormId').each(function (index) {
                this.checked = "checked";
            });
        }
        obj.engineerNum['default'] === 0 ? me.engField.setValue(207001) : me.engField.setValue(obj.engineerNum['default']);
        obj.researchNum['default'] === 0 ? me.devField.setValue(208001) : me.devField.setValue(obj.researchNum['default']);
        obj.qualityTestNum['default'] === 0 ? me.checkPersonField.setValue(209001) : me.checkPersonField.setValue(obj.qualityTestNum['default']);
    }, disabledSave:function () {
        $('#saveBtn', '#prdInforFormId').addClass('dis');
        $('#saveBtn', '#prdInforFormId').css('cursor', 'default');
        $('#saveBtn', '#prdInforFormId').unbind('click');
    },
    enabledSave:function () {
        var me = this;
        $('#saveBtn', '#prdInforFormId').removeClass('dis');
        $('#saveBtn', '#prdInforFormId').bind('click', function () {
            me.saveInfo();
        });
    },
    saveInfo:function () {
        var me = this;
        me._isChangeNoSave = false;
        if (!me.isSaving) {
            me.isSaving = true;
            var loading = $('<div class="loading-s1"><span></span>Loading ...</div>').insertAfter('#saveBtn', '#prdInforFormId');
            // var fields = $('#prdInforFormId').serializeArray();
            // var params = {};
            // for (var i = 0; i < fields.length; i++) {
            //     var field = fields[i];
            //     if (params[field.name])
            //         params[field.name] = params[field.name] + ',' + field.value;
            //     else
            //         params[field.name] = field.value;
            // }
            // var certificationList = params['systemCertification'].split(",");
            // // console.log(certificationList);
            // // var certifications = ""
            // // for (var c = 0; c < certificationList.length; c++) {
            // //     if (c == 0)certifications += certificationList[c];
            // //     else
            // //         certifications += "&systemCertification=" + certificationList[c];
            // // }
            // params['systemCertification'] = certificationList;
            //console.log($('#prdInforFormId').serialize());
         
            $.ajax({
                data:$('#prdInforFormId').serialize(),
                url:Can.util.Config.seller.setShowroomModule.saveCompanyPrdInfo,
                type:'POST',
                success:function () {
                    me.isSaving = false;
                    me.refreshData();
                    loading.remove();
                    delete loading;
					Can.util.notice( Can.msg.MODULE.BUYER_LEAD_MANAGE.SAVE );
                }
            });
        }
    }
});
