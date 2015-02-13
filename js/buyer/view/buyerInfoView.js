/**
 * Buyer Info view
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-7-29
 */

Can.view.buyerInfoView = Can.extend(Can.view.BaseView, {
	id: 'buyerInfoViewId',
	target: null,
	actionJs: ['js/buyer/action/buyerInfoAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.view.buyerInfoView.superclass.constructor.call(this);

		this.profile = new Can.ui.Panel({cssName: 'm-profile clear'});
		//avatar
		this.avatar = new Can.ui.Panel({
			cssName: 'user-pic',
			wrapEL: 'a',
			html: '<img />'
		});

		//information
		this.info = new Can.ui.Panel({cssName: 'info'});
		//name
		this.infoName = new Can.ui.Panel({
			cssName: 'name',
			wrapEL: 'div'
		});
		//region
		this.infoCountry = new Can.ui.Panel({cssName: 'country'});
		//operation area
		this.opera = new Can.ui.Panel({cssName: 'opt'});
		//view opportunities
		this.opera_opp = new Can.ui.toolbar.Button({text: Can.msg.BUYER.INDEX.VIEW_OPP});

		//post buyer lead
		this.opera_bl = new Can.ui.toolbar.Button({text: Can.msg.BUYER.INDEX.POST_BL});
        $(this.opera_bl.el[0]).attr({"href":"/buyinglead/index.html","target":"_blank"});
		//data integrity
		this.integrity = new Can.ui.Panel({
			cssName: 'integrity',
			html: '<p>' + Can.msg.BUYER.INDEX.INFO_INTEGRITY + '</p>'
		});
		//percent bar
		this.integrity_bar = new Can.ui.percentBar();
		//improve data
		this.integrity_edit = new Can.ui.toolbar.Button({
			cssName: 'impro',
			text: Can.msg.BUYER.INDEX.IMPROVE
		});

		//
		this.static_op = new Can.ui.toolbar.dataIdentButton({
			cssName: 'ico-msg',
			text: Can.msg.BUTTON['DATA_IDENT']['OPP']
		});
		this.static_ir = new Can.ui.toolbar.dataIdentButton({
			cssName: 'ico-pro',
			text: Can.msg.BUTTON['DATA_IDENT']['INQ_REPLY']
		});
		this.static_bl = new Can.ui.toolbar.dataIdentButton({
			cssName: 'ico-bl',
			text: Can.msg.BUTTON['DATA_IDENT']['BL_REPLY']
		});
		this.statistic = new Can.ui.Panel({
			cssName: 'm-statistic clear',
			items: [this.static_op, this.static_ir, this.static_bl]
		});

	},
	startup: function () {
		if (this.target) {
			var _el = $('<div></div>');
			_el.addClass('acc-total clear');

			this.opera.addItem(this.opera_opp);
			this.opera.addItem($('<i>|</i>'));
			this.opera.addItem(this.opera_bl);

			this.integrity.addItem(this.integrity_bar);
			this.integrity.addItem(this.integrity_edit);

			this.info.addItem(this.infoName);
			this.info.addItem(this.infoCountry);
			this.info.addItem(this.opera);
			this.info.addItem(this.integrity);

			this.profile.addItem(this.avatar);
			this.profile.addItem(this.info);

			this.profile.applyTo(_el);
			this.statistic.applyTo(_el);
			_el.appendTo(this.target);

            
		}
	},
	loadData: function (sURL) {
		var _this = this;
		$.get(sURL, function (jData) {
			if (jData.status && jData.status === 'success') {
				_this.update(jData.data);
			}
			else {
				Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
			}
		});
	},
	update: function (jData) {
		if (jData) {
			this.avatar.update(Can.util.formatImage(jData.buyerPhoto, '120x120', (jData.gender * 1 === 2 ? 'female' : 'male')));
			this.infoName.update(jData.buyerName);
			this.infoName.el.attr('title', jData.buyerName);
			this.infoCountry.update('<span class="flags fs' + jData.countryId + '"></span><strong>' + jData.countryName + '</strong>');
			this.integrity_bar.update(jData.integrity);
			this.static_op.updateText(jData.bizOppotunity);
			this.static_ir.updateText(jData.inquiryReply);
			this.static_bl.updateText(jData.buyingleadReply);

            //加入 Collections Sourcing Egg 提示
            if(window.localStorage){
                if(!window.localStorage.getItem('hasIsShowSEGGTip')){
                    window.localStorage.setItem('hasIsShowSEGGTip', true);

                    var $Tip = $([
                        '<div class="text-tips has-arrow arrow-left arrow-yellow"></div>'
                    ].join('')); 

                    $Tip.html(Can.msg.MODULE.OPPORTUNITY.HOME_TIP);

                    var $Target = this.static_op.el.find('.ico-msg');

                    var oPosition = $Target.offset();

                    $Tip.css({
                        top: oPosition.top + 12,
                        left: oPosition.left + $Target.width(),
                    }).click(function(){
                        Can.Route.run('/collections');
                        $Tip.hide();
                        return false;
                    });

                    $Tip.appendTo(this.static_op.el);
                }
            }

		}
	},
	onOppClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.opera_opp.on('onclick', fFn);
		}
	},
	onPostBlClick: function (fFn) {
		if (typeof  fFn === 'function') {
			this.opera_bl.on('onclick', fFn);
		}
	},
	onEditClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.integrity_edit.on('onclick', fFn);
		}
	},
	onStOppClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.static_op.on('onclick', fFn);
		}
	},
	onStIrClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.static_ir.on('onclick', fFn);
		}
	},
	onStBlClick: function (fFn) {
		if (typeof fFn === 'function') {
			this.static_bl.on('onclick', fFn);
		}
	}
});
