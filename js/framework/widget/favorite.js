/* 
 * favorite product/supplier
 * 
 * mark as favorite
 * cfone/collect/addCollect.cf?collectContentId=100&collectType=1
 * collectContentId (product id/company id)
 * collectType (1：supplier 2：product)
 * return collectId
 *
 * tag it
 * cfone/collecttags/addCollectTags.cf?collectId=1&tags=name1&tags=name2
 *
 */

Can.ui.favorite = function(params){
    var trigger = params.trigger
        , mid = trigger.data('id')
        , pos = trigger.offset()
        , data = params.data
        , feedback = new Can.ui.tips({
            cssName:'win-tips-s1', mainCss:'win-fav'
        })
        // store tag added
        , basket = {}
        , feedback_item = feedback.el
        ;

    var tag = function(d){
        feedback.updateContent(
            $([
                '<form action="' + params.url.tag + '">',
                    '<div class="box-cont">',
                        '<div class="succ">',
                            '<p class="bg-ico txt-ok">' + Can.msg.MODULE.PRODUCT_DETAIL.COLLECT + '</p>',
                            '<p class="tips">' + Can.msg.MODULE.PRODUCT_DETAIL.TIP + '</p>',
                        '</div>',
                        '<p class="tit-s6">' + Can.msg.MODULE.PRODUCT_DETAIL.ADD_TAG + '</p>',
                        '<div class="mod-wri clear">',
                            '<div class="r-con">',
                                '<input name="" type="text" placeholder="' + Can.msg.FORM.KEYWORD + '" class="word">',
                                '<input name="collectId" type="hidden" value="' + d.collectId + '">',
                            '</div>',
                            '<a href="javascript:;" class="btn-add" role="tag-add"></a>',
                        '</div>',
                        '<div class="clear" role="tagged">',
                        '</div>',
                    '</div>',
                    '<div class="b-actions clear">',
                        '<a href="javascript:;" class="btn btn-s12" role="panel-close">' + Can.msg.BUTTON.CANCEL + '</a>',
                        '<a href="javascript:;" class="btn btn-s11" role="submit">' + Can.msg.BUTTON.SAVE + '</a>',
                    '</div>',
                    '<span class="bg-ico arrow-t"></span>',
                '</form>'
            ].join(''))
        );

        // Tag adding
        feedback_item.on('click', '[role=tag-add]', function () {
            var el = $(this)
                , field = el.parent().find('.word')
                , value = $.trim(field.val())
                ;

            if (!value) {
                return;
            }
            if(basket[value]) {
                alert(Can.msg.FAVORITE.ALREADY_ADDED);
                return;
            }
            feedback_item.find('[role=tagged]').append(
                $([
                    '<div class="mod-item-q">',
                        '<span>' + value + '</span>',
                        '<input name="tags" type="hidden" value="' + value + '">',
                        '<a class="bg-ico btn-close" href="javascript:;" role="tag-remove"></a>',
                    '</div>'
                ].join(''))
            );
            basket[value] = true;
            field.val('');
        });

        // Tag removing
        feedback_item.on('click', '[role=tag-remove]', function (e) {
            var $this = $(this);

            $this.parent().remove();
            basket[$this.siblings('input').val()] = '';
            e.stopPropagation();
        });

        // tag panel close
        feedback_item.on('click', '[role=panel-close]', function () {
            feedback.hide();
        });

        // tag save
        feedback_item.on('click', '[role=submit]', function () {
            $.ajax({
                type: 'POST',
                url: params.url.tag,
                data: $(this).closest('form').serialize(),
                success: function(d){
                    feedback.hide();
                }
            });
        });
    }

    //alert(params.url.mark)
    $.ajax({
        url: params.url.mark,
        data: data,
        type: 'POST',
        success: function(d){
            var _status = d['status'];

            switch(d['status']){
                case 'success':
                    tag(d['data']);
                    break;
                case 'fail':
                    feedback.main.addClass('win-fav-done');
                    feedback.updateContent([
                        '<div class="box-cont">',
                            '<p class="">' + d['message'] + '</p>',
                        '</div>',
                        '<span class="bg-ico arrow-t"></span>'
                    ].join(''));
                    break;
                default:
                    break;
            }

            feedback.on('ON_SHOW', function () {
                feedback.updateCss({
                    'top':pos['top'] + trigger.outerHeight() + 20, left:pos.left - (feedback_item.outerWidth() - trigger.outerWidth()) / 2
                })
            });
            feedback.show();
        }
    });
}
