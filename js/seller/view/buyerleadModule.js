/**
 * 采购需求搜索列表
 * @Author: vfasky
 * @Version: 2.0\
 * @Date: 2013-09-10
 */
;
(function (Can) {
	'use strict';   

	//加载双向绑定模板引擎
	Can.importJS([
		'js/framework/utils/two-way-tpl.js'
	]);
	var template = Can.util.TWtemplate;

	//配置别名
	var oConfig = Can.util.Config.seller.buyerleadModule;

	/**
	 * 提取数组列表的首字母
	 */
	var fFormatArray = function (aData) {
		var oList = [];
		var oTitle = [];
		$.each(aData, function (k, v) {
			if (!v.categoryName) {
				return false;
			}
			v.categoryName = $.trim(v.categoryName);
			var sB = v.categoryName[0].toUpperCase();
			if (-1 === $.inArray(sB, oTitle)) {
				oTitle.push(sB);
				oList.push({
					isTitle: true,
					categoryName: sB
				});
			}

			v.isTitle = false;
			oList.push(v);

		});
		return oList;
	};


	/**
	 * 下拉选择框 base
	 */
	var BaseDropDown = function ($el) {
		var self = this;

		this.$el = $el;
		this.isShow = false;

		this.$drop = $('<div></div>').hide();


		this.setDisplay = function (text) {
			self.$el.find('.txt em').html(text).attr('title', text);
		};

		this.onShow = function () {
		};
		this.onHide = function () {
		};

		this.show = function () {
			self.$drop.css({
				left: self.$el.offset().left,
				top: self.$el.offset().top,
				position: 'absolute',
				zIndex: 100
			});

			self.isShow = true;
			self.onShow();
			self.$drop.show();
		};

		this.hide = function () {
			self.isShow = false;
			self.onHide();
			self.$drop.hide();
		};

		this.render = function ($el) {
			self.$drop.hide().appendTo($el);
		};

		this.$el.click(function () {
			self.isShow ? self.hide() : self.show();
			return false;
		});

		Can.util.EventDispatch.on('ON_PAGE_CLICK', function (event) {
			if (!$.contains(self.$drop[0], event.target)) {
				self.isShow && self.hide();
			}
		});

	};

	/**
	 * 排序选择框
	 */
	var OrderDropDown = function ($el) {
		var self = this;
		//排序的值
		var _value = Number($el.find('li.cur').attr('data-val'));
		var _defLabel = $el.find('span').text();
		var _onChangeFun = function () {
		};


		BaseDropDown.call(this, $el.find('span'));
		$el.find('ul').appendTo(this.$drop);
		$el.find('i').click(function () {
			$el.find('span').click();
			return false;
		});
        
		this.setValue = function (nVal) {
			if (nVal === 0) {
				_value = 1;
				$el.find('span').text(_defLabel);
				$el.find('input').attr('checked', false).change();
			}
			self.$drop.find('li.cur').removeClass('cur');
			self.$drop.find('li').each(function () {
				var $that = $(this);
				var nV = Number($that.attr('data-val'));
				if (nV === nVal) {
					$that.addClass('cur');
					_value = nV;
					$el.find('span').text($that.text());

					$el.find('input').attr('checked', true).change();
					return false;
				}
			});
		};

		this.getValue = function () {
			return $el.find('input').attr('checked') ? _value : 0;
		};

		this.$drop.find('li').click(function () {
			var nVal = Number($(this).attr('data-val'));
			self.hide();
			self.setValue(nVal);
			_onChangeFun(self.getValue());
		});

		this.onChange = function (fun) {
			_onChangeFun = fun;
		};

		$el.find('input').data('ui').bind('click', function () {
			_onChangeFun(self.getValue());
		});

	};

	/**
	 * 筛选框
	 */
	var TypeDropDown = function ($el, tpl) {
		var self = this;
		var _onChangeFun = function () {
		};
		var _sDefTitle = $el.find('em').html();

		BaseDropDown.call(this, $el);


		this.$content = $(tpl);
        this.$content.width(300);

		this.onChange = function (fun) {
			_onChangeFun = fun;
		};

		this.setValue = function () {
		};

		this.getValue = function () {
			return {};
		};

		this.onRender = function (oAnt) {
			self.getValue = function () {
				var aLabel = [];
				var oVal = {};
				oAnt.el.find('input').each(function () {
					var $el = $(this);
					//console.log($el.data('ui'), $el.closest('ul.type-drop-list').length)
					oVal[$el.attr('name')] = $el.attr('checked') ? 1 : 0;
					if ($el.attr('checked')) {
						aLabel.push($el.parent().parent().find('span').text());
					}
				});
				if (aLabel.length === oAnt.el.find('li').length) {
					self.setDisplay(_sDefTitle);
				}
				else if (aLabel.length === 0) {
					//self.setDisplay(Can.msg.MODULE.BUYING_LEAD.EMPTY);
					self.setDisplay(_sDefTitle);
				}
				else {
					self.setDisplay(aLabel.join('+'));
				}
				return oVal;
			};

			self.setValue = function (oData) {
				for (var v in oData) {
					var $el = oAnt.el.find('[name=' + v + ']');
					//console.log($el.attr('name'), Number(oData[v]));
					$el.attr('checked', Number(oData[v]) === 1);
					$el.data('is_sync', true);
					$el.change();
				}
				self.getValue();
			};

			oAnt.el.on('click', 'li',function () {
				var $el = $(this).find('input');
				$el.attr('checked', $el.attr('checked') ? false : true);
				$el.change();

				return false;
			}).find('li').hover(function () {
					$(this).find('input').data('showHover')();
				}, function () {
					$(this).find('input').data('hideHover')();
				});

			oAnt.el.on('change', 'input', function () {
				var $el = $(this);
				if ($el.attr('checked')) {
					oAnt.el.find('input').each(function () {
						var $input = $(this);
						if ($input.attr('name') != $el.attr('name')) {
							$(this).data('is_sync', true).attr('checked', false).change();
						}
					});
					_onChangeFun(self.getValue());
				}
				else if ($el.data('is_sync')) {
					$el.data('is_sync', false);
				}
				else {
					_onChangeFun(self.getValue());
				}

			});

		};

		this.oAnt = template(this.$content, {
			events: {
				render: function () {
					self.onRender(this);
				}
			}
		});

		this.$content.appendTo(this.$drop);

	};

	//分类选择框
	var CategoryDropDown = function ($el, sTpl) {
		var self = this;
		BaseDropDown.call(this, $el);

		var _sDefTitle = $el.find('em').html();

		var _onSubmit = function () {
		};

		this.$content = $(sTpl);
		this.isReader = false;
		this.aData = [];
		this.aValue = [];
		this.maxSelect = 6;


		this.onSubmit = function (fun) {
			_onSubmit = fun;
		};

		this.onRender = function (oAnt) {
			this.isRender = true;
			oAnt.el.on('click', '.root-list li',function () {
				oAnt.el.find('li.cur').removeClass('cur');
				var $el = $(this).addClass('cur');
				var nIndusId = Number($el.attr('data-id'));
				$.each(self.aData, function (k, v) {
					if (Number(v.indusId) === nIndusId) {
						var aList = fFormatArray(v.childs);

						self.sync();

						$.each(aList, function (k1, v1) {
							if (false === v1.isTitle) {
								v1.checked = false;
								$.each(self.aValue, function (k2, v2) {
									if (v2.id === Number(v1.categoryId)) {
										v1.checked = true;
									}
								});
							}
						});

						oAnt.el.addClass('category-drop-list-big');
						oAnt.set('childsList', aList);

						oAnt.el.find('.child-list li').hover(function () {
							var fun = $(this).find('input').data('showHover');
							fun && fun();
						}, function () {
							var fun = $(this).find('input').data('hideHover');
							fun && fun();
						});
						return false;
					}
				});

				return false;
			}).on('click', '.child-list li .name',function () {
					var $el = $(this).parent().find('input');
					//console.log($el);
					var isChecked = $el.attr('checked') ? true : false;


					$el.attr('checked', isChecked ? false : true);
					$el.change();

					return false;
				}).on('change', '.child-list li input',function () {
					var $el = $(this);
					var isChecked = $el.attr('checked') ? true : false;
					var id = Number($el.val());

					if (isChecked) {
						if (self.aValue.length >= self.maxSelect) {

							var fMaxAlert = new Can.view.alertWindowView({
								closeAction: 'hide',
								hasBorder: false,
								type: 2
							});
							fMaxAlert.setContent([
								'<div class="alert-status">',
								'<span class="icon"></span>',
								Can.util.i18n._('MODULE.BUYING_LEAD.TIP_MAX_SELECT', self.maxSelect),
								'</div>'
							].join(''));

							fMaxAlert.main.el.addClass('alert-win-t1');
							fMaxAlert.show();
							fMaxAlert.onClose(function () {
								setTimeout(function () {
									self.show();
								}, 50);

							});
							$el.attr('checked', false).change();
							return false;
						}

						self.aValue.push({
							id: id,
							title: $el.attr('title')
						});
						self.sync();
					}
					else {
						$.each(self.aValue, function (k, v) {
							if (v.id === id) {
								self.aValue.splice(k, 1);
								self.sync();
								return false;
							}
						});
					}

				}).on('click', '.mod-item-q a',function () {
					var id = Number($(this).attr('data-id'));

					$.each(self.aValue, function (k, v) {
						if (v.id === id) {
							var $input = oAnt.el.find('.child-list input[value=' + id + ']');
							if ($input.length === 1) {
								$input.attr('checked', false).change();
							}
							else {
								self.aValue.splice(k, 1);
								//console.log(self.aValue);
								self.sync();
							}

							return false;
						}
					});
					return false;
				}).on('click', '#buyleadCategorySubmit',function () {
					_onSubmit(self._aValue);
					self.hide();
					return false;
				}).on('click', '#buyleadCategoryClear', function () {
					oAnt.el.find('.return .btn-close').click();
					return false;
				});
		};

		var oAnt = template(this.$content, {
			data: {
				count: 0
			},
			events: {
				render: function () {
					self.onRender(this);
				}
			}
		});

		var xSyncTime = false;
		this.sync = function () {
			if (xSyncTime) {
				clearTimeout(xSyncTime);
			}
			xSyncTime = setTimeout(function () {
				self._sync();
			}, 100);
		};

		this._sync = function () {
			oAnt.set('selectList', this.aValue);
			oAnt.set('count', this.aValue.length);
			if (this.aValue.length === 0) {
				oAnt.el.find('.return').hide();
				var liHeight = 0;
				oAnt.el.find('.root-list li').each(function () {
					//console.log($(this).outerHeight());
					liHeight = liHeight + $(this).outerHeight() + 8;
				});

				if (liHeight > 284) {
					oAnt.el.height(liHeight);
					oAnt.el.find('.child-list')
						.height(oAnt.el.find('.root-list').height());
					oAnt.el.find('.footer').css({
						top: 245 + liHeight - 284
					});
				}
				else {
					oAnt.el.height(284);
				}
				this.setDisplay(_sDefTitle);
			}
			else {
				var $ret = oAnt.el.find('.return').show();
				var xTime = setInterval(function () {
					var nHeight = $ret.height();
					var liHeight = 0;
					oAnt.el.find('.root-list li').each(function () {
						liHeight = liHeight + $(this).outerHeight() + 8;
					});
					liHeight = liHeight < 284 ? 284 : liHeight;
					if (nHeight > 0) {
						clearInterval(xTime);
						oAnt.el.height(liHeight + 296 - 284 + nHeight);
					}
				}, 50);
				var aLabel = [];
				$.each(this.aValue, function (k, v) {
					aLabel.push(v.title);
				});
				this.setDisplay(aLabel.join('+'));
			}
		};

		this.reset = function () {
			this.aValue = [];
			this.sync();

		};

		this.onShow = function () {
			if (this.aValue.length === 0) {
				oAnt.el.css('height', 'auto');
			}
		};


		this.onHide = function () {
			if (this.aValue.length > 0) {
				return;
			}
			oAnt.el.removeClass('category-drop-list-big');
			oAnt.el.find('li.cur').removeClass('cur');
			oAnt.el.css('height', 'auto');
		};

		this.loadData = function (aData) {
			if (false === aData) {
				return;
			}
			self.aData = aData;

			oAnt.set('category', aData);
			oAnt.set('childsList', []);
		};

		this.getValue = function () {
			return this.aValue;
		};

		this.$content.appendTo(this.$drop);

	};

    var _ = Can.util.i18n._;

	var BuyerLeadModule = Can.extend(Can.module.BaseModule, {
		title: _('MODULE.BUYING_LEAD.TITLE'),
		id: 'buyerleadModuleId',
		constructor: function (cfg) {
			Can.apply(this, cfg || {});
			BuyerLeadModule.superclass.constructor.call(this);
			this._oDefType = {read: 0, unread: 0, attachment: 0, live: 0, currentJoin: 0, favorite: 0, matched: 0,authorized: 0};
			this._nType = 1;
			this._nPage = 1;

			this._nScrollTop = 0;

			this._aloadData = [];

			this._isShowLoad = true;
		},
		startup: function () {
			var self = this;
			this.isReader = false;
			BuyerLeadModule.superclass.startup.call(this);

			this.setTabs([
				{ url: '/buyinglead', title: Can.util.i18n._('MODULE.BUYING_LEAD.ALL_LABEL') },
				{ url: '/buyinglead/my', title: Can.util.i18n._('MODULE.BUYING_LEAD.MY_BL') },
				{ url: '/buyinglead/unverify', title: Can.util.i18n._('MODULE.BUYING_LEAD.UNVERIFY_BL') }
			]);
            //+ _('MODULE.BUYING_LEAD.TITLE_LINK', '/leadEXpress/new.html')
            //console.log(this);
            this.containerEl.find('.hd-tit h2')
                .append( 
                    '<span style="font-size: 12px; color: #999; position:absolute; top:46px; left:0px;">'+
                    _('MODULE.BUYING_LEAD.TITLE_LINK', '/leadEXpress/new.html') +
                    '</span>'
                 );

			template.load('js/seller/view/buyerlead.html', function (tpl) {
				self.onTplReady(tpl);
			});
		},
		//模板加载完成
		onTplReady: function (tpl) {
			var self = this;

			this._tpl = tpl;
			this._$Tpl = $(tpl);

			//开始渲染主内容
			var $Content = this.contentEl;
			$Content.html(
				self._$Tpl.find('#content-tpl').html()
			);

			var oAnt = template($Content, {
				data: {
					isShowLoad: self._isShowLoad,
					keyword: self._sKeyword,
					isAll: true
				},
				partials: {
					tool: self._$Tpl.find('#tool-tpl').html()
				},
				events: {
					render: function () {
						self.onRender(this);
					},
					update: function () {
						self.onUpdate(this);
					}
				}
			});
		},
		//模板数据更新时执行
		onUpdate: function (oAnt) {
			var self = this;
			var aBuyingLeads = oAnt.get('buyingLeads');
			var oPage = oAnt.get('page');
			//没有数据， show load
			if (!aBuyingLeads) {
				//self.oPageItem && self.oPageItem.el.hide();
				return;
			}

			//绑定分页条事件
			oAnt.el.find('[paging]').data('pageChange', function (page) {
				oAnt.set('buyingLeads', []);
                self.search(page);
			});

			var aList = [];
			$.each(aBuyingLeads, function (k, v) {
				aList.push(v.leadId);
			});

			Can.Route._args = {
				queue: aList
			};

			//判断vip需求
			oAnt.el.find('.win-tips-s1').each(function () {
				var $el = $(this),
					vip = $el.find('.ico-buying-en').attr('data-title'),
					lang;
				if(vip == '009'){
					$el.find('.export-range').removeClass('hidden');
					lang = localStorage.lang ? localStorage.lang : 'en';
					$el.find('.ico-buying-en').attr('class','ico-buying-'+lang);
				}

			})

			//处理收藏
			oAnt.el.find('[is-favorate]').each(function () {
				var $el = $(this);
				var isFavorate = Number($el.attr('is-favorate')) === 1;
				var nLeadId = $el.attr('lead-id');
				if (isFavorate) {
					/*$el.removeClass('star-0');*/
					//$el.addClass('star-3');

					$el.attr('class', 'favorite icons star-3');

					//$el.hide();
				}

				$el.unbind().bind('click',function () {
					var isFavorate = Number($el.attr('is-favorate')) === 1;

					/*if(isFavorate){*/
					//$el.removeClass('icon-ok-1')
					//.addClass('icon-ok-2');
					//}
					//else{
					//$el.removeClass('icon-fav-b3')
					//.addClass('icon-fav-b4');
					/*}*/

					$.post(oConfig.favorBuyingLead, {
						leadId: nLeadId,
						isFavor: isFavorate ? 0 : 1
					}, function (oJson) {
						if (oJson.status === 'error') {
							return Can.util.notice(oJson.message, 'error');
						}
						if (isFavorate) {
							/*$el.removeClass('star-3')*/
							/*.addClass('star-0');*/
							$el.attr('class', 'favorite icons star-0');


							$el.attr('is-favorate', '0');
						}
						else {
							/*$el.removeClass('star-2')*/
							//.addClass('star-3');

							$el.attr('class', 'favorite icons star-3');


							$el.attr('is-favorate', '1');
						}
					}, 'json');
				}).hover(function () {
						var isFavorate = Number($el.attr('is-favorate')) === 1;

						$el.attr('class', 'favorite icons star-2');

						/*if(isFavorate){*/
						//$el.removeClass('star-3')
						//.addClass('star-2');
						//}
						//else{
						//$el.removeClass('star-1')
						//.addClass('star-2');
						/*}*/

					}, function () {
						var isFavorate = Number($el.attr('is-favorate')) === 1;

						if (isFavorate) {
							$el.attr('class', 'favorite icons star-3');

							/*$el.removeClass('star-2')*/
							/*.addClass('star-3');*/
						}
						else {
							$el.attr('class', 'favorite icons star-1');

							/*$el.removeClass('star-2')*/
							/*.addClass('star-1');*/
						}

					});
			});
			oAnt.el.find('.win-tips-s1').hover(function (e) {
				if ($(e.target).is('.favorite')) {
					return;
				}

				var $item = $(this);
				var $el = $item.find('[is-favorate]');
				var isFavorate = Number($el.attr('is-favorate')) === 1;

				if (false === isFavorate) {
					$el.removeClass('star-0').addClass('star-1');
				}
				else {
					$el.removeClass('star-3').addClass('star-2');
				}

				//$el.show();


			}, function (e) {
				var $item = $(this);
				var $el = $item.find('[is-favorate]');
				var isFavorate = Number($el.attr('is-favorate')) === 1;

				if (isFavorate) {
					$el.removeClass('star-2').addClass('star-3');
				}
				else {
					$el.removeClass('star-1').addClass('star-0');
				}
			});


		},
		//模板渲染完成
		onRender: function (oAnt) {
			//console.log('render')
			var self = this;

			//分类多选框
			this.oCategoryField = new CategoryDropDown(
				oAnt.el.find('#buyleadCategoryField'),
				self._$Tpl.find('#category-tpl').html()
			);
			this.oCategoryField.render(oAnt.el);
			this.oCategoryField.onSubmit(function (aData) {
				//console.log(aData);
				self.search();
			});

			//筛选框
			this.oTypeField = new TypeDropDown(
				oAnt.el.find('#buyleadTypeField'),
				self._$Tpl.find('#type-list').html()
			);
			this.oTypeField.render(oAnt.el);
			this.oTypeField.onChange(function (oData) {
				//oSeachVal = $.extend(oSeachVal, oData);
				//console.log(oSeachVal);
				self.search();
			});


			//搜索框
			this.$searchField = oAnt.el.find('#buyleadSearchField input');
			//console.log(this.$searchField);

			oAnt.el.on('click', '#buyleadSearchBtn', function () {
				self.search();
				return false;
			});

			oAnt.el.on('click', 'a[show-buyinglead]', function () {
				var $a = $(this);
				var nLeadId = $a.attr('show-buyinglead');
				var nSupplierId = $a.attr('supplier-id');
				var sRoute = '/show-buyinglead';

				self._nScrollTop = $('html,body').scrollTop() || $(window).scrollTop();

				var supplierId = 0;
				//将该条数据变成已读
				$.each(oAnt.data.buyingLeads, function (k, v) {
					if (v.leadId.toString() === nLeadId.toString() && v.supplierId.toString() === nSupplierId.toString()) {
						var data = oAnt.data.buyingLeads[k];
						if (data.supplierId)
							supplierId = data.supplierId;
						
						data.productPhotoArray = [];
						//console.log(data);
						if (data.isRead === 0) {
							data.isRead = 1;
							oAnt.update('buyingLeads[' + k.toString() + ']', data);
						}
						return false;
					}
				});

				/*Can.Route.run(sRoute, {*/
					//id: nLeadId
				/*});*/
                window.open('/buyinglead/supplier.html?id=' + nLeadId.toString() + '&supplierId=' + supplierId);


				return false;
			});

			this.isReader = true;
			this.oAnt = oAnt;
			this.resetTool();
		},
		getSearchVal: function () {
			//搜索值
			var oSeachVal = $.extend({
				orderBy: 1,
				keyword: this.$searchField.val(),
				region: this.oAnt.el.find('#buyleadRegion').val()
			}, self._oDefType);

			oSeachVal = $.extend(oSeachVal, this.oTypeField.getValue());

			if (this._nType === 1) {
				oSeachVal.orderBy = this.oOrderField.getValue();
			}
			oSeachVal.page = this._nPage;

			var aData = [];
			for (var k in oSeachVal) {
				aData.push(k.toString() + '=' + oSeachVal[k]);
			}

			$.each(this.oCategoryField.getValue(), function (k, v) {
				aData.push('category=' + v.id.toString());
			});

			return aData.join('&');
		},
		search: function (page, undef) {
			var sUrl = null;
			switch (this._nType) {
				case 1 :
					sUrl = oConfig.pushBuyingLeads;
					break;
				case 2 :
					sUrl = oConfig.myBuyingLeads;
					break;
				case 3 :
					sUrl = oConfig.unverifyBuyingLeads;
					break;
			}

			var self = this;

			self._nPage = page === undef ? 1 : page;
			self._isShowLoad = true;

			self.oAnt.set('isShowLoad', self._isShowLoad);
            
            //换分页方式
            self._aloadData = [];

            //Can.util.isCcoinOpened(function (bOpen) {
                //console.log(self.oTypeField.getValue());
                if(self._nType === 2){
                    self.oTypeField.oAnt.set('isRecommend', true);
                    self.oTypeField.oAnt.set('isJoinFair', true); 
                }
                else if(self._isJoinFair !== undefined && self._isRecommend !== undefined){
                    self.oTypeField.oAnt.set('isRecommend', self._isRecommend);
                    self.oTypeField.oAnt.set('isJoinFair', self._isJoinFair); 
                }

                var sData = self.getSearchVal();

                if (self._nPage === 1) {
                    self._aloadData = [];
                    self.oAnt.set('buyingLeads', self._aloadData);
                    self._nScrollTop = 0;
                }

                $.ajax({
                    url: sUrl,
                    cache: false,
                    data: sData,
                    success: function (oJson) {
                        self._isShowLoad = false;
                        self.oAnt.set('isShowLoad', self._isShowLoad);

                        var oAvatarType = {
                            1: 'male',
                            2: 'female'
                        };

                        self.oAnt.set('keyword', self._sKeyword);

                        //self._load_data = self._load_data || [];

                        var oData = oJson.data || [];
                        $.each(oData, function (k, v) {
                            var sAvatarType = oAvatarType[v.gender] || 'defautl';
                            //console.log(sAvatarType)

                            v.is114 = (Number(v.currentJoin) == 2);
                            v.iscfec = (Number(v.currentJoin) == 1);
                            if ($.trim(v.industry) !== '') {
                                v.categorys = [v.industry, v.category];
                            }
                            else {
                                v.categorys = [v.category];
                            }
                            v.keyword = self.$searchField.val();
                            v.avatarType = sAvatarType;

                            self._aloadData.push(v);
                        });
                        //console.log(self._aloadData.length);
                        self.oAnt.set('_type', self._nType);
                        self.oAnt.set('buyingLeads', self._aloadData);
                        self.oAnt.set('page', oJson.page);
                    }
                });

			//});
			
		},
		//重置 / 初始化搜索条
		resetTool: function () {
			if (false === this.isReader) {
				return;
			}
			var self = this;
			this._nPage = 1;

            self.oAnt.set('isAll', this._nType === 1);
            self.oTypeField.oAnt.set('isAll', self.oAnt.get('isAll'));

            self.oAnt.set('isMatched', this._nType === 2);
            self.oTypeField.oAnt.set('isMatched', self.oAnt.get('isMatched'));
            
            self.oAnt.set('isUnverfiy', this._nType === 3);
            self.oTypeField.oAnt.set('isUnverfiy', self.oAnt.get('isUnverfiy'));

			self.oTypeField.setValue(this._oDefType);
            //console.log(self.oTypeField.getValue())
            
            // 判断C币开关是否开启，否则隐藏奖励筛选项
            /*
			 * Can.util.isCcoinOpened(function (bOpen) {
			 * 	self.oTypeField.oAnt.set('isCCoinOpen', bOpen && self._nType === 1);
             *     //console.log(self.oTypeField.getValue());
			 * });
             */

			if (this._nType === 1) {
				if (!this.oOrderField) {
					//排序框
					this.oOrderField = new OrderDropDown(
						self.oAnt.el.find('#buyleadOrderField')
					);
					this.oOrderField.render(self.oAnt.el);
					this.oOrderField.onChange(function (nVal) {
						//console.log(nVal);
						//oSeachVal.orderBy = nVal;
						self.search();
					});

				}

				this.oOrderField.setValue(1);

			}

			this.$searchField.val(this._sKeyword).
				unbind().bind('change.kw', function () {
					self._sKeyword = this.value;
				});

			this.oCategoryField.reset();
			$.ajax({
				url: oConfig.buyingLeadCondition,
				cache: false,
				data: {type: self._nType},
				success: function (oJson) {
					var oData = oJson.data;
					self.oAnt.set('regionList', oData.region);

					self.oAnt.el.find('#buyleadRegion').change();

					self.oCategoryField.loadData(oData.category);

                    self._isJoinFair  = oJson.data.joinFair;
                    self._isRecommend = oJson.data.recommend;
                    //self._isJoinFair  = false;

                    if(self._nType === 1){
                        self.oTypeField.oAnt.set('isRecommend', self._isRecommend);
                        self.oTypeField.oAnt.set('isJoinFair', self._isJoinFair); 
                        //console.log(self._isJoinFair);
                    }
				}
			});

			this.oAnt.set('buyingLeads', []);


			this.search();
		},
		/* //判断路由，开始分发*/
		//routeAct: function(){
		//var sRoute = this._oRoutRule ?
		//this._oRoutRule.route[0] : '/buyinglead';

		//this._sKeyword = this._oRoutArgs.keyword || '';

		////console.log(this._sKeyword);

		//if(sRoute === '/buyinglead'){
		//this.initRecommended();
		//}
		//else{
		//this.initMy();
		//}
		//return sRoute;
		//},
		//routeMark: function(){
		//if(this._$Tpl){
		//Can.Route.mark(this.routeAct(),{
		//keyword: this._sKeyword
		//});
		//}
		/*},*/
		// Recommended LeadEXpress
		actIndex: function (args) {
			if (1 === this._nType) {
				var nScrollTop = this._nScrollTop;

				if (this._xTime) {
					clearTimeout(this._xTime);
				}

				this._xTime = setTimeout(function () {
					//console.log(nScrollTop)
					$('html,body').animate({
						scrollTop: nScrollTop
					});
				}, 300);

				return;
			}
			var self = this;
			this._sKeyword = args.keyword || '';

			/* self.titleContainerEL.find('.opt-box .cur').removeClass('cur');*/
			//self.titleContainerEL.find('.rl').addClass('cur');
			//Can.Route.mark('/buyinglead',{
			//keyword: this._sKeyword
			/*});*/
			self._nType = 1;
			self.resetTool();

		},
		// My LeadEXpress
		actMy: function (args) {
			if (2 === this._nType) {
				var nScrollTop = this._nScrollTop;

				if (this._xTime) {
					clearTimeout(this._xTime);
				}

				this._xTime = setTimeout(function () {
					$('html,body').animate({
						scrollTop: nScrollTop
					});
				}, 300);

				return;
			}

			var self = this;
			this._sKeyword = args.keyword || '';
			/*self.titleContainerEL.find('.opt-box .cur').removeClass('cur');*/
			//self.titleContainerEL.find('.ml').addClass('cur');
			//Can.Route.mark('/buyinglead/my',{
			//keyword: this._sKeyword
			/*});*/
			self._nType = 2;
			self.resetTool();

		},
		
		actUnverify: function (args) {
			if (3 === this._nType) {
				var nScrollTop = this._nScrollTop;

				if (this._xTime) {
					clearTimeout(this._xTime);
				}

				this._xTime = setTimeout(function () {
					$('html,body').animate({
						scrollTop: nScrollTop
					});
				}, 300);

				return;
			}

			var self = this;
			this._sKeyword = args.keyword || '';
			/*self.titleContainerEL.find('.opt-box .cur').removeClass('cur');*/
			//self.titleContainerEL.find('.ml').addClass('cur');
			//Can.Route.mark('/buyinglead/my',{
			//keyword: this._sKeyword
			/*});*/
			self._nType = 3;
			self.resetTool();

		}
		
	});

	Can.module.BuyerLeadModule = BuyerLeadModule;
})(Can);
