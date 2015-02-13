/**
 * User: sam
 * Date: 13-9-11
 * Time: 下午15:04
 * 浏览图片的弹窗，可左右点击
 * pho_width,pho_height  图片的宽高
 * isName: 是否显示图片名称 true 显示（默认）/ false 不显示
 *  pho_List要是一个对象数组或字符串，如：
 * [{"image":"/group1/M00/39/C3/wKgKEVItds-AT5s7AAKceUZy0VI058.JPG","name": "9.1C20" },{"image":"/group1/M00/39/C3/wKgKEVIwMt6ADFgoAAKceUZyOVI229.JPG","name":"5.2C03" }]
 *  "/group1/M00/39/C3/wKgKEVItds-AT5s7AAKceUZy0VI058.JPG,/group1/M00/39/C3/wKgKEVItds-AT5s7AAKceUZy0VI058.JPG"
 *
 */
Can.view.scanPhotoView = Can.extend(Can.view.BaseView, {
    id:'scanPhotoViewID',
    /*要显示的图片的宽、高*/
    pho_width:680,
    pho_height:480,
    pho_List:null,
    isName:true,
    requireUiJs:[ 'js/utils/stepBtnView.js'],
    constructor:function (jCfg) {
        Can.apply(this, jCfg || {});
        Can.view.scanPhotoView.superclass.constructor.call(this);
        this.addEvents('ON_NEXT_CLICK', 'ON_PREV_CLICK');
    },
    startup:function () {
        var _this = this;
        this.ContainerEL = $('<div class="scanPhoto"></div>');

        /*上一张，下一张按钮*/
        this.stepBtn = new Can.view.stepBtnView({
            css:['btn-forward', 'btn-backward']
        });
        this.stepBtn.applyTo(this.ContainerEL);
        this.stepBtn.group[1].el.hide();//一开始隐藏上一张按钮
        /*设置上、下一张的按钮位置*/
        this.stepBtn.group[1].el.css("top",Math.ceil(this.pho_height/2));
        this.stepBtn.group[0].el.css("top",Math.ceil(this.pho_height/2)) ;

        /*显示图片的容器层*/
        this.photoNav = new Can.ui.Panel({cssName:"photo-container"});
        this.photoNav.el.css('width', this.pho_width).css('height', this.pho_height);
        this.photoNav.applyTo(this.ContainerEL);
        /*标题层*/
        if(this.isName){
            this.photoTilNav = new Can.ui.Panel({cssName:"photo-title"});
            this.photoTilNav.applyTo(this.ContainerEL);
        }
        this.setPhotos();
        this.stepBtnEven();
    },
    /*设置图到到 ul */
    setPhotos:function () {
        var photoList = this.pho_List;
        if (typeof (photoList) === "string") {
            photoList = photoList.split(",");
        }
        this.$photoUl = $('<ul class=""></ul>');
        var  sLiHtml = "", sPhoSize = this.pho_width + "x" + this.pho_height;
        if (photoList && photoList.length) {
             /*只有一张图片时，不显示下一张按钮*/
            if (photoList.length === 1) {
                this.stepBtn.group[0].el.hide();
            }

            for (var i = 0; i < photoList.length; i++) {
                if(photoList[i].image) {
                    sLiHtml += '<li>' + Can.util.formatImage(photoList[i].image, sPhoSize) + '</li>';
                }else{
                    sLiHtml += '<li>' + Can.util.formatImage(photoList[i], sPhoSize) + '</li>';
                }
            }
            this.$photoUl.append($(sLiHtml));
        }
        this.$photoUl.appendTo(this.photoNav.el);
        this.$photoUl.find("li").first().addClass("cur");
        if (photoList[0].name && this.photoTilNav) {
            this.ContainerEL.find(".photo-title").text(photoList[0].name)
        }
    },
    /*绑定上一张下一张按钮事件*/
    stepBtnEven:function () {
        var _this = this;
        this.stepBtn.onLeftClick(function () {
            if (_this.stepBtn.group[1].el.is(':hidden')) {
                _this.stepBtn.group[1].el.show()
            }
            var $photoList = _this.$photoUl.find("li"), $photoThis = _this.$photoUl.find("li.cur");
            $photoThis.removeClass('cur').next().addClass("cur");

            var nAfterIndex = $photoList.index(_this.$photoUl.find("li.cur"));
            _this.$photoUl.stop().animate({left:"-" + (nAfterIndex * _this.pho_width) + "px"}, "slow");
            if(_this.photoTilNav && _this.pho_List[nAfterIndex].name){
                _this.ContainerEL.find(".photo-title").text(_this.pho_List[nAfterIndex].name)
            }
            if (nAfterIndex === ($photoList.length - 1)) {
                _this.stepBtn.group[0].el.hide();
            }
        });
        this.stepBtn.onRightClick(function () {
            if (_this.stepBtn.group[0].el.is(':hidden')) {
                _this.stepBtn.group[0].el.show()
            }
            var $photoList = _this.$photoUl.find("li"), $photoThis = _this.$photoUl.find("li.cur");
            $photoThis.removeClass('cur').prev().addClass("cur");

            var nAfterIndex = $photoList.index(_this.$photoUl.find("li.cur"));
            _this.$photoUl.stop().animate({left:"-" + (nAfterIndex * _this.pho_width) + "px"}, "slow");
            if(_this.photoTilNav && _this.pho_List[nAfterIndex].name){
                _this.ContainerEL.find(".photo-title").text(_this.pho_List[nAfterIndex].name)
            }
            if ($photoList.index(_this.$photoUl.find("li.cur")) === 0) {
                _this.stepBtn.group[1].el.hide();
            }
        });
    }
});

