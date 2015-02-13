/**
 * Match Buyers
 * @Author: sam
 * @Version: 1.2
 * @Since: 13-2-1
 */

'use strict';

Can.module.myRoomModule = Can.extend(Can.module.BaseModule, {
	title: Can.msg.MODULE.MY_ROOM.TITLE,
	id: 'myRoomModuleId',
	// requireUiJs:['js/buyer/view/myRoomItemsView.js'],
	actionJs: ['js/buyer/action/myRoomModuleAction.js'],
	constructor: function (jCfg) {
		Can.apply(this, jCfg || {});
		Can.module.myRoomModule.superclass.constructor.call(this);
		this.addEvents('search_action',
			'person_name_action',
			'add_fav',
			'title_action',
			'send_inquiry');
	},
	startup: function () {
		var _this = this;
		Can.module.myRoomModule.superclass.startup.call(_this);

		this.searchBar = new Can.ui.Panel({
			cssName: 'mod-filter clear',
			wrapEL: 'form'
		});

		this.searchBar.el.submit(function () {
			return false;
		});
		this.searchBar.applyTo(this.contentEl);
		//searchField
		this.searchField = new Can.ui.TextField({
			id: 'searchFieldId',
			cssName: 'search-s2',
			name: 'keyword',
			width: 650
		});

		var pageField = $('<input type="hidden" name="page" value="1" />'),
			filter = this.searchBar.el,
			stream = $('<div class="myroom-data" />');

		pageField.appendTo(filter);

		this.node = {
			filter: filter,
			stream: stream,
			page: pageField
		};

		//searchBtn
		this.searchBtn = new Can.ui.toolbar.Button({
			id: 'matchSearchBtn',
			cssName: 'btn btn-s11',
			text: Can.msg.BUTTON.SEARCH
		});
		this.searchBtn.el.attr('role', 'filter');
		var search_action = new Can.ui.Panel({//外层
			cssName: 'action',
			html: '<span class="brace"></span>'
		});
		search_action.addItem(this.searchBtn);

		this.searchBar.addItem(this.searchField);
		this.searchBar.addItem(search_action);

		/*
		 this.selectItemBox = new Can.view.myRoomItemsView({css:'all-cate', target:this.contentEl});
		 this.selectItemBox.start();
		 */

		stream.appendTo(this.contentEl);

		/*this.pager = new Can.ui.limitButton({
		 cssName: 'ui-page fr',
		 showTotal: true,
		 total: 0,
		 limit: 0
		 });
		 this.pager.el.appendTo(this.contentEl);*/

		// this.selectItemBox.getItem();
	},
	printList: function (data,page) {
		var i, n, item, supplier_name, type, country, match, lead, title, description, additional_raw, intro, additional, unit, msg, product_title, value
			, listEls = []
			, that = this
			, formatImage = Can.util.formatImage
			;

		for (i = 0; i < data.length; i++) {
			additional = '';
			description = '';
			item = data[i];
			supplier_name = item.supplierName;
			country = item.country || {};
			match = item.matchNum;
			type = item.type;
			msg = item.msg;
			product_title = item.productTitle;
			// <span class="ico-new"></span>

			if (type === 1 || type === 4) {
				// product

				intro = item.supplierTitle + ' ' + supplier_name + ' from ' + item.supplierTrade + ' recommended their product to you:';
				title = msg || product_title;
				if (msg && product_title) {
					description = product_title;
				} else {
					description = item.productIntroduction;
				}

				description = '<p class="des">' + description + '</p>';

				additional_raw = [
					{ label: 'Min. Order', value: item.minOrder },
					{ label: 'FOB Price', value: item.fob }
				];
			} else {
				// supplier

				intro = item.supplierTitle + ' ' + supplier_name + ' from ' + item.supplierTrade + ' introduce them to you:';
				title = msg || 'HELLO, ' + Can.util.userInfo().getUserName() + '. Welcome to my showroom and have a look';

				additional_raw = [
					{ label: 'Main&nbsp;Product', value: item.mainProduct },
					{ label: 'Mgnt Certification', value: item.mgtCertification }
				];
			}

			for (n = 0; n < additional_raw.length; n++) {
				unit = additional_raw[n];
				value = unit.value;

				if (!value) {
					continue;
				}
				additional += [
					'<p class="txt-tit">',
					unit.label + ':',
					'<em>' + unit.value + '</em>',
					'</p>'
				].join('');
			}
			var html = [
				'<div class="privacy-wd-list" data-room="' + Can.util.room.checkin(item) + '">',
				'<div class="user-pic">',
				'<a href="javascript:;" >' + formatImage(item.supplierPhoto, '60x60', '', supplier_name) + '</a>',
				'</div>',
				'<div class="mod-person clear">',
				'<div class="info">',
				'<p class="name"><a title="' + supplier_name + '" href="javascript:;">' + supplier_name + '</a></p>',
				'<p class="country"><span class="flags fs' + item.countryId + '"></span><span class="txt">' + item.countryEnName + '</span>' + (item.participation ? '<span class="mth">' + item.participation + '</span>' : '') + '</p>',
				'</div>',
				'</div>',
				'<div class="cyp-name"><a href="'+ Can.util.thirdDomainURLFor(item.suppDomain) + Can.util.Config.seller.showroom.rootURL_RE + item.companyId + '.html" target="_blank">' + item.supplierCompany + '</a></div>',
				'<div class="refs-match ' + fCountMatchLevel(match, true) + '">',
				'<span class="ico-mth"></span>',
				'<div class="mth-info">',
				'<p class="tit">' + Can.msg.MATCH + '</p>',
				'<p class="num">' + match + '%</p>',
				'</div>',
				'</div>',
				'<div class="mod-pro clear">',
				'<div class="pic">',
				'<a href="javascript:;" class="autoLink">' + formatImage(item.pushPic, '230x230', '', '') + '</a>',
				'</div>',
				'<div class="txt-info-s1">',
				// '<p class="cf">' + (item.fromMsg || '&nbsp;') + '</p>',
				'<p class="cf">' + intro + '</p>',
				'<h3>' + title + '</h3>',
				description,
				additional,
				'<div class="opt">',
				'<a href="javascript:;" class="bg-ico ico-inquiry" role="inquiry" cantitle="' + Can.msg.CAN_TITLE.INQUIRY + '"></a>',
				'<div id="SkypeButton'+  parseInt((page-1)*20+i) + '" class="io-skype io-skype-r"> </div>',
				'<a href="javascript:;" class="bg-ico ico-fav" role="mark" cantitle="' + Can.msg.CAN_TITLE.FAV + '"></a>',
				'</div>',
				'</div>',
				'</div>',
				'</div>'
			].join('');

			var el = $(html);
			var itemType = Number(item['type']);

			if (itemType != 1 && itemType != 4) {
				el.find('.autoLink')
					.attr('target', '_blank')
					.attr('href', Can.util.thirdDomainURLFor(item.suppDomain) + Can.util.Config.seller.showroom.rootURL_RE + item.companyId + '.html')
			}

			//绑定im  使用skype代替了
			// el.find('.ico-chat').each(function () {
			// 	var IMBtn = $(this);
			// 	IMBtn.data({
			// 		setStatus: function (status, data) {
			// 			if (status == 'online') {
			// 				IMBtn.attr('class', 'bg-ico ico-chat-online')

			// 			}
			// 			else {
			// 				IMBtn.attr('class', 'bg-ico ico-chat')

			// 			}
			// 		}
			// 	});
			// 	//IMBtn.data('setStatus')('online')
			// 	//console.log(item)
			// 	Can.util.bindIM.add(IMBtn, item.supplierId);

			// });


			//闭包
			(function (el, item, that, itemType) {
				//点击标题事件
				//el.find('h3')
				//  .add(el.find('.pic a'))
				el.find('.pic a')
					.click(function () {
						//if (itemType == 1 || itemType == 4) {
							that.fireEvent('title_action', item);
						//}
					});
				//点击用户事件
				el.find('.info .name')
					.add(el.find('.user-pic'))
					.click(function () {
						that.fireEvent('person_name_action', item);
						return false;
					});
				//发送询问
				el.find('.ico-inquiry').click(function () {
					that.fireEvent('send_inquiry', item);
					return false;
				});
				//收藏
				el.find('.ico-fav').click(function () {
					that.fireEvent('add_fav', item, this);
					return false;
				});
                /*没有skype，去除skype wrapper*/
                if(!item.skype){
                    el.find('.io-skype').remove();
                }
                
			})(el, item, that, itemType);


			listEls.push(el);
		}

		return listEls;	
			
	},
	filterList: function () {
		var that = this;
		var sParam = this.node.filter.serialize();
		$.ajax({
			url: Can.util.Config.buyer.myroomModule.detailItems,
			data: sParam,
			showLoadTo: $('.myroom-data'),
			success: function (d) {
				var data = d['data'], stream = that.node.stream, pageRaw = d['page'];

				if (d['status'] !== 'success') {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, d);
					return;
				}
				else if (!data) {
					stream.html('');
					var _param = Can.util.canInterface('unserialize', [sParam]);
					//not search result
					if (_param['productCategoryId'] || _param['keyword']) {
						stream.html([
							'<div class="fil-none">',
							'<p class="txt2">' + Can.msg.NOT_SEARCH_RESULT + '</p>',
							'<p class="txt3">' + Can.msg.NOT_SEARCH_SUGGEST + '</p>',
							'<a class="btn btn-l btn-s11" href="javascript:;" role="back">' + Can.msg.BUTTON.RETURN_LIST + '</a>',
							'</div>'
						].join(''));
					}
					//not data
					else {
						stream.html('<div class="fil-none">' +
							'<p class="txt2">' + Can.msg.MODULE.MY_ROOM.NOT_DATA_TIPS + '</p>' +
							'<p class="txt3">' + Can.msg.MODULE.MY_ROOM.NOT_DATA_SUGGEST + '</p>' +
							'<a class="btn btn-l btn-s11" href="javascript:;" role="search">' + Can.msg.BUTTON.SEARCH_BTN + '</a>' +
							'</div>');
					}
					//that.pager.el.hide();
					that.loadMore && that.loadMore.hide();
					return;
				}
				if (pageRaw.page == 1) {
					stream.html('');
				}
				that.printCategory(d['data']['category']);
				$.each(that.printList(d['data']['itemList'],pageRaw.page), function (k, el) {
					el.appendTo(stream);
				});
				that.maxPage = pageRaw.maxPage;
				if (pageRaw.page < pageRaw.maxPage) {
					that.addLoadMore();
				}

				// update the Pager
				/*Can.apply(that.pager, {
				 current: pageRaw.page,
				 total: pageRaw.total,
				 limit: pageRaw.pageSize
				 });
				 that.pager.refresh();
				 if (pageRaw.total > pageRaw.pageSize) {
				 that.pager.el.show();
				 }
				 else {
				 that.pager.el.hide();
				 }*/

				//console.log(d['data']['itemList'])
				//初始化skype聊天工具
				var userData = d['data']['itemList'];
				if (userData.length > 0) {
					for (var i = 0; i < userData.length; i++) {
                        var index=(pageRaw.page-1)*20+i;
						that.skypeUi(index, userData[i].skype, userData[i].supplierId)
					}
				}
			}
		});
	},
	skypeUi : function(i, skypeName,cfecId) {
        if (/^(live:){0,1}[a-zA-Z][a-zA-Z0-9_\.\-\,]{5,31}$/g.test(skypeName)) {
            Skype.ui({
	            "name" : "dropdown",
	            "element" : 'SkypeButton' + i,
	            "participants" : ['live:' + skypeName],
	            "statusStyle" : "mediumicon",
	            "millisec" : "5000",
	            "cfecId": cfecId
	        });
        }else{
            $("#SkypeButton" + i).remove();
        }
        
	},
	printCategory: function (aCategory) {
		var i, item, nOldVal,
			categoryField = new Can.ui.DropDownField({
				name: 'productCategoryId',
				blankText: 'All'
			}),
			labels = ['All'],
			values = [''];
		if (this.categoryField) {
			nOldVal = this.categoryField.value;
			this.categoryField.el.remove();
		}
		this.categoryField = categoryField;
		for (i = 0; i < aCategory.length; i++) {
			item = aCategory[i];
			labels.push(item.name);
			values.push(item.code);
		}
		categoryField.updateOptions({
			labelItems: labels,
			valueItems: values
		});
		if (nOldVal) {
			this.categoryField.setValue(nOldVal);
		}
		categoryField.el.insertBefore(this.searchField.el);
	},
	addLoadMore: function () {
		var _this = this;
		//添加点击加载的按钮
		if (!_this.loadMore) {
			_this.loadMore = $('<a href="javascript:;" class="load-more">' + Can.msg.MODULE.MY_ROOM.LOAD_MORE + '</a>');
			_this.loadMore.click(function () {
				_this.loadMore.hide();
				var _page = parseInt(_this.node.page.val()) || 1;
				if (_page < _this.maxPage) {
					//自动加载下一页
					_this.node.page.val(_page + 1);
					_this.filterList();
				}
			});
		}
		_this.loadMore.appendTo(_this.contentEl).show();
	}
});
