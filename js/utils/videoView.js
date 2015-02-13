/**
 * Step button view
 * @Author: sam
 * @Version: 1.0
 * @Update: 14-12-25
 */

Can.view.videoView = Can.extend(Can.view.BaseView, {
	autoPlay:true,
    resourceUrl:"",
    id:"player_view", //
    warp:"",
//    requireUiJs:[Can.util.Config.app.enCantonFair+'js/supplier/ckplayer/ckplayer.min.js'],
	constructor:function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.videoView.superclass.constructor.call(this);
	},
	startup:function () {
        $("#"+this.id).remove();//保證只有一個視頻
        this.el=$('<div id="'+this.id+'"></div>');
        if(this.warp){
            this.el.appendTo(this.warp);
        }else{
            alert('请设置 warp ,播放器放置的位置！')
            return;
        }

        var format = this.resourceUrl.slice(this.resourceUrl.lastIndexOf('.') + 1);
        if ('swf' === format) {
            var _object = '<embed src="' + this.resourceUrl + '" flashvars="autoplay=false&play=false" type="application/x-shockwave-flash" play="false" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="600" height="450"></embed>'
            this.el.append($(_object));
        } else {
            Can.importJS(['js/plugin/jwplayer/jwplayer.js']);
            jwplayer(this.id).setup({
              'controlbar.idlehide': 'true',
              'id': 'playerID',
              'width': '600',
              'height': '450',
              'controlbar': 'over',
              'file': this.resourceUrl,
              'autostart': 'false',
              'repeat': 'always',
              'provider': 'http',
              'http.startparam': 'start',
              'modes': [
                {type: 'flash', src: '/C/js/plugin/jwplayer/player.swf'},
                {type: 'html5'},
                {type: 'download'}
              ]
            }); 
        }        
//        this.initPlayer();
        
	}
});
