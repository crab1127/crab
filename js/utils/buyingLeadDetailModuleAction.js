/**
 * BuyingLead Module Action
 * author: sam
 * Date: 13-8-9
 * Time: 上午1:54
 */
$.moduleAndViewAction('buyingLeadDetailModuleId', function (blDetail) {
    /*查看回复内容的对话框*/
    var oSeeReply = new Can.ui.tips({
        cssName:'win-tips-s1',
        arrowIs:'Y',
        hasWaiting:true,
        mainCss:'win-reply',
        arrowCss:'arrow-b',
        width:470
    });
    /*查看联系信息内容的对话框*/
    var oTipsContent = new Can.ui.tips({
        hasArrow:false,
        cssName:'win-tips-s1',
        arrowIs:'Y',
        hasWaiting:true,
        mainCss:'win-reply-out',
        arrowCss:'arrow-b',
        width:600
    });
    /*查看展位信息的對話框*/
    var oShowBooth = new Can.ui.tips({
        hasArrow:false,
        cssName:'win-tips-s1',
        arrowIs:'Y',
        hasWaiting:true,
        mainCss:'win-reply-out',
        arrowCss:'arrow-b',
        width:280
    });

    function showCompanyInfo(target,oCompanyThis){
        var item = [
            {key:'companyType', value:Can.msg.BL_DETAIL.BUSINESS_TYPE},
            {key:'district', value:Can.msg.BL_DETAIL.REGION},
            {key:'mainProduct', value:Can.msg.BL_DETAIL.MAIN_PRODUCT},
            {key:'exhibitorBooth',value:Can.msg.BL_DETAIL.EXHIBITORS_BOOTH_TITLE},
            {key:'boothCloseup',value:Can.msg.BL_DETAIL.BOOTH_CLOSE_UP},
            {key:'contacter', value:Can.msg.BL_DETAIL.CONTACT},
            {key:'telephone', value:Can.msg.BL_DETAIL.TEL},
            {key:'fax', value:Can.msg.BL_DETAIL.FAX},
            {key:'email', value:Can.msg.BL_DETAIL.EMAIL},
            {key:'position', value:Can.msg.BL_DETAIL.POST},
            {key:'addressEn', value:Can.msg.BL_DETAIL.ADDRESS}
        ]
        var sHtml = "";
        $.each(item, function (i, item) {
            switch (item['key']) {
                case 'district':
                    if (oCompanyThis.district) {
                        sHtml += '<div class="row clear">' +
                            '<label class="tit">' + item['value'] + '</label>' +
                            '<div class="txt"><span class="flags fs' + oCompanyThis.countryId + '"></span> ' + oCompanyThis.district + '</div>' +
                            '</div>';
                    }
                    break;
                case 'mainProduct':
                    if (oCompanyThis.mainProduct) {
                        var sTemp = "";
                        for (var t = 0; t < oCompanyThis.mainProduct.length; t++) {
                            sTemp += '<div class="main-product">' + oCompanyThis.mainProduct[t] + '</div>'
                        }
                        sHtml += '<div class="row clear">' +
                            '<label class="tit">' + item['value'] + '</label>' +
                            '<div class="txt">' + sTemp + '</div>' +
                            '</div>';
                    }
                    break;
                case 'exhibitorBooth':
                    if(oCompanyThis.exhibitionBooth){
                        sHtml += '<div class="row clear">' +
                            '<label class="tit">' + item['value'] + '</label>' +
                            '<div class="txt"> ' + oCompanyThis.exhibitionBooth + '</div>' +
                            '</div>';
                    }
                    break;
                case 'boothCloseup':
                    if (oCompanyThis.exhibitionPhoto) {
                        var nLength = oCompanyThis.exhibitionPhoto.length, sImgHtml="";
                        for (var i = 0; i < nLength; i++) {
                            sImgHtml += '<div class="cleanupImg">' + Can.util.formatImage(oCompanyThis.exhibitionPhoto[i], "60x60") + '</div>';
                        }
                        sHtml += '<div class="row clear border_b1">' +
                            '<label class="tit">' + item['value'] + '</label>' +
                            '<div class="txt"> ' + sImgHtml + '</div>' +
                            '</div>';
                    }
                    break;
                default :
                    if (oCompanyThis[item['key']]) {
                        sHtml += '<div class="row clear">' +
                            '<label class="tit">' + item['value'] + '</label>' +
                            '<div class="txt">' + oCompanyThis[item['key']] + '</div>' +
                            '</div>';
                    }
                    break;
            }
        })

        var _content = '<div class="wb-actions clear">' +
            '<span>' + oCompanyThis.companyName + '</span>' +
            '<a href="javascript:;"></a>' +
            '</div>' +
            '<div class="box-cont">' +
            sHtml +
            '</div>';
        //show window
        oTipsContent.show();
        oTipsContent.updateContent(_content);
        oTipsContent.updateCss({
            left:target.offset().left - 300,
            top:target.offset().top - oTipsContent.el.height() - 10,
            zIndex:851
        });
        oTipsContent.el.delegate('a', 'click', function () {
            oTipsContent.hide();
        })  ;
        return false;
    }


//    blDetail.set_stepBtn_css();
    blDetail.on("onTapClick", function ($obj) {
        var sCode = $obj.attr("data-code");
        $obj.addClass('cur').siblings().removeClass('cur')
        if (sCode === "baseInfo") {
            $(".base-info").removeClass('hidden');
            $(".con-history").addClass('hidden');
        } else {
            $(".con-history").removeClass('hidden');
            $(".base-info").addClass('hidden');
        }
    })
    blDetail.on('onPrevClick', function () {
        if(!blDetail.queue || !blDetail.queue[blDetail.bid]){
            return;
        }

        var queue = blDetail.queue, prev = queue[blDetail.bid].prev;
        blDetail.bid = prev;
        blDetail.loadData({"buyerleadId":prev});
    });
    blDetail.on('onNextClick', function () {
        if(!blDetail.queue || !blDetail.queue[blDetail.bid]){
            return;
        }
        
        var queue = blDetail.queue, next = queue[blDetail.bid].next;
        
        blDetail.bid = next;

        blDetail.loadData({"buyerleadId":next});


    });


    blDetail.on('displayCompany', function (target, isLogin) {

        if (isLogin) {
            var nId = target.attr("pid");
            Can.util.canInterface('personProfile', [1, nId]);
        } else {
            var id = target.attr("pid");
            var oContact = blDetail.oCantact[id];
            //showCompanyInfo(target,oContact);
            Can.util.canInterface('personProfile', [0, oContact.userId]);
        }
    });

    blDetail.on('seeReply', function (isLogin, target) {
        var $Parent = target.parents('.item');
        var nMid = target.attr('mid');
        //修改成已读样式
        if ($Parent.hasClass('unread')) {
            //call api
            $.ajax({
                url:Can.util.Config.buyer.BuyerBlDetailModule.updateStateOuter,
                data:{buyingReplyId:nMid}
            });
            //change class
            $Parent.removeClass('unread');
            $Parent.find('.ico-read').addClass('ico-chked');
        }
        /*内围、外围查看回复内容*/
        if (isLogin) {
            var $Person = $Parent.find('.name a');
            var nPid = $Person.attr('pid');
            var sName = $Person.text();
            var _content = '<div class="box-cont">' +
                '<h3>' + target.text() + '</h3>' +
                '<p class="des visible-overflow">' + target.parent().siblings('input[type="hidden"]').val() + '</p>' +
                '</div>' +
                '<div class="b-actions clear">' +
                '<a href="javascript:;" class="btn btn-s12">' + Can.msg.BUTTON.CANCEL + '</a>' +
                '<a href="javascript:;" class="btn btn-s11">' + Can.msg.BUTTON.REPLY + '</a></div>';
            //show window
            oSeeReply.show();
            oSeeReply.updateContent(_content);
            oSeeReply.updateCss({
                left:target.offset().left - 240,
                top:target.offset().top - oSeeReply.el.height() - 10,
                zIndex:851
            });
            oSeeReply.dataRoom = {
                supplierId:nPid,
                supplierName:sName,
                messageId:nMid
            };
            oSeeReply.el.unbind('click').delegate('.btn-s11', 'click',function () {
                var _data = {
                    inquiry:[
                        {
                            supplierId:oSeeReply.dataRoom.supplierId,
                            supplierName:oSeeReply.dataRoom.supplierName,
                            buyingLeadId:oSeeReply.dataRoom.messageId
                        }
                    ]
                };
                Can.util.canInterface('inquiry', [Can.msg.MESSAGE_WINDOW.INQUIRY_TIT, _data, 'Hey Reply Buying Lead']);
            }).delegate('a.btn-s12', 'click', function () {
                    oSeeReply.remove();
                });
            return false;
        } else {
            var _content = '<div class="wb-actions clear">' +
                '<span>' + Can.msg.BL_DETAIL.MESSAGE + '</span>' +
                '<a href="javascript:;"></a>' +
                '</div>' +
                '<div class="box-cont">' +
                '<h3>' + target.text() + '</h3>' +
                '<div class="des visible-overflow">' + target.parent().siblings('input[type="hidden"]').val() + '</div>' +
                '</div>';
            //show window
            oTipsContent.show();
            oTipsContent.updateContent(_content);
            oTipsContent.updateCss({
                left: ($('body').width() - oTipsContent.el.outerWidth() ) / 2, // target.offset().left - 300,
                top: target.offset().top - oTipsContent.el.height() - 10,
                zIndex:851
            });
            oTipsContent.el.delegate('a', 'click', function () {
                oTipsContent.hide();
            })
            return false;
        }

    });

    blDetail.on('onBackClick', function () {
        var isLogin = blDetail.isLogin;
        var userType = blDetail.userType;
        if (userType == 'supplier' && isLogin) {
            Can.Route.run('/buyinglead');
        }
        if (userType == 'buyer' && isLogin) {
            Can.Route.run('/manage-buyinglead');
        }
    });

    blDetail.on('submitBtnClick', function (target,resultObj) {
        var title_txt = $("#title").val() || $("#title").attr("placeholder").replace("Re:", "");
        var content_txt = $("#content").val();
        var buyingLeadId = blDetail.bid;
        var FB = function (notice, status) {
            var feedback = blDetail.feedback;
            feedback.el.html(notice)
                .slideDown();
            if (status == 'success') {
                blDetail.fireEvent('onbackclick', blDetail.myOrAll_mark);
            }
            else {
                setTimeout(function () {
                    feedback.el.slideUp();
                    target.removeClass("dis");
                }, 3500);
            }
        };
        if (title_txt === "" || content_txt === "") {
            FB(Can.msg.MODULE.BUYING_LEAD.REPLY_EPT_ERROR, 'false');
            return false;
        }
        if (Can.util.checkLength(title_txt) > 250) {
            FB(Can.msg.MODULE.BUYING_LEAD.REPLY_TIT_ERROR, 'false');
            return false;
        }
        if (Can.util.checkLength(content_txt) > 8000) {
            FB(Can.msg.MODULE.BUYING_LEAD.REPLY_CON_ERROR, 'false');
            return false;
        }
        var param = {title:title_txt, buyingLeadId:buyingLeadId, content:content_txt};
        $.ajax({
            url:Can.util.Config.seller.buyerleadDetailModule.contact,
            type:'POST',
            data:param, //blDetail.reply.el.serialize(),
            success:function (data) {
                if (data['status'] !== 'success') {
                    FB(Can.msg.FAILED, data['status']);
                    return;
                }
                Can.util.notice(Can.msg.MODULE.BUYING_LEAD.SUCCESS);
                //提交成功后联系的输入框应该消失，否则可以多次输入提交
//				blDetail.subject_field.setValue('');
//				blDetail.content_field.val('');
//				FB(Can.msg.blDetail.MSG_CENTER.SEND, d['status']);

                /*联系后，出现CONTACT NOW 按钮*/      // #1850取消按钮
               /* blDetail.$BtnNav.find('a.btn-s12').remove();
                blDetail.$BtnNav.append('<a href="javaScript:void(0);" class="btn btn-s12" id="qouteBut">' + Can.msg.BL_DETAIL.CONTACT_NOW + '</a>');*/

                /*在列表页去除当前采购需求*/
                /*var buyingLeadModule = Can.Application.getModule('buyerleadModuleId');*/
                //if(buyingLeadModule){
                    //buyingLeadModule.listContainer.find("div.item[data-id='"+param.buyingLeadId+"']").remove();
                /*}*/
               blDetail.reply.el.find(".tit-s2").nextAll().remove();
//                window.location.reload();
                blDetail.drawUserInfo(resultObj);
            }
        });
    });

    blDetail.on('onExhibitTipClick',function($Li){
        var liList=$Li.parent().find("li"),nWidth=$(".exhibition_content li").eq(0).width();
        var index=liList.index($Li)  ;
        $Li.addClass("cur").siblings().removeClass("cur");
        $(".exhibition_content").stop().animate({"margin-left":-(index*nWidth)+"px"},'slow');
    }) ;

    blDetail.on('onExhibitPicClick',function($Pic,oExhibitor){
        Can.importJS(['js/utils/scanPhotoView.js']);
        var ExhibitPicWin = new Can.view.titleWindowView({
            title:Can.msg.INFO_WINDOW.BOOTH_CLEANUP,
            width:830
        });
        var photoView=new Can.view.scanPhotoView({height:560,pho_List:oExhibitor.imageList});
        photoView.startup();
        ExhibitPicWin.setContent(photoView.ContainerEL) ;
        ExhibitPicWin.show();
    });

    blDetail.on('onCompanyNameClick', function ($CompNameA, oExhibitorList) {
        var nIndex = parseInt($CompNameA.attr('data-id'));
        var oExhibitorThis = (oExhibitorList[nIndex]);
        if(blDetail.isLogin){

        }else{
//            showCompanyInfo($CompNameA,oExhibitorThis);
            Can.util.canInterface('personProfile', [-1, oExhibitorThis.corpId]);
        }
    });

    blDetail.on('showBooth',function($p){
        oShowBooth.show();
        oShowBooth.updateContent($p.attr("data-code"));
        oShowBooth.updateCss({
            left:$p.offset().left - 70,
            top:$p.offset().top + $p.height(),
            zIndex:851
        });
    })
    blDetail.on('hideBooth',function(){
        oShowBooth.hide();
    })
});
