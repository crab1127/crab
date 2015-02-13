/**
 * 产品管理
 * @Date: 2014-01-17 10:18:01
 * @Author: vfasky (vfasky@gmail.com)
 * @Version: 2.1
 */
;
(function (Can, module) {

	'use strict';

	//加载双向绑定模板引擎
	Can.importJS([
		'js/framework/utils/two-way-tpl.js',
		'js/utils/windowView.js'
	]);

	var template = Can.util.TWtemplate;
	var sModelId = 'ProductManageModule';
	var sTitleI18n = 'MODULE.PRODUCT_MANAGE.TITLE';
	var _ = Can.util.i18n._;
	var oConfig = Can.util.Config.seller;

	module[sModelId] = Can.extend(module.BaseModule, {
		title: _(sTitleI18n),
		id: sModelId,
		constructor: function (cfg) {
			Can.apply(this, cfg || {});
			module[sModelId].superclass.constructor.call(this);

			this._sUri = '';
			this._nOnLine = -1;
		},
		startup: function () {
			module[sModelId].superclass.startup.call(this);

			this._sUserId = Can.util.userInfo().getUserId().toString();
			//console.log(this._sUserId)
			//是否显示 showcase 套餐提示
			this._isShowST = Can.util.Cache.get('Showcase_Tip_' + this._sUserId, true);

			this.initTopBtns();
		},
		//on-line 状态入口
		actIndex: function (args) {
			var sUri = this.setArgs(args);
			var self = this;

			if (args.reload !== '1' &&
				this._nOnLine === 1 &&
				this._sUri === sUri) {
				return;
			}
			this._sUri = sUri;
			this._nOnLine = 1;

			this.initTemplate(function (oAnt) {
				self.loadGroup(oAnt);
				self.loadData(oAnt);
			});
		},
		//off-line 状态入口
		actOffline: function (args) {
			var sUri = this.setArgs(args);
			var self = this;
			if (args.reload !== '1' &&
				this._nOnLine === 0 &&
				this._sUri === sUri) {
				return;
			}
			this._sUri = sUri;
			this._nOnLine = 0;

			this.initTemplate(function (oAnt) {
				self.loadGroup(oAnt);
				self.loadData(oAnt);
			});

		},
		//设置从路由传过来的参数
		setArgs: function (args) {
			//选中的组id
			this._sGroupId = args.gid || '';
			//关键字
			this._sKeyword = args.s || '';
			//筛选
			this._sFilter = args.f || '';
			//页数
			this._nPage = Number(args.page || '1');

			return this._sGroupId + '_' +
				this._sKeyword + '_' +
				this._sFilter + '_' +
				this._nPage.toString();
		},
		getArgs: function () {
			return {
				gid: this._sGroupId,
				s: this._sKeyword,
				f: this._sFilter,
				page: this._nPage
			};
		},
		//在本model跳转
		goTo: function (args, sAct) {
			var sRoute;
			sAct = sAct || this._sAct;
			args = $.extend(this.getArgs(), args || {});
			//console.log(this._nOnLine)
			if (this._nOnLine === 1) {
				sRoute = '/product-manage';
			}
			else {
				sRoute = '/product-manage/offline';
			}
			Can.Route.run(sRoute, args);
		},
		//加载模板
		loadTpl: function (callback) {
			var self = this;
			if (this._$tpl) {
				return callback(this._$tpl);
			}
			template.load('js/seller/view/productManage.html', function (tpl) {
				self._$tpl = $(tpl);
				return callback(self._$tpl);
			});
		},
		//绑定下拉分组的事件
		buildGroupDrop: function ($el, callback) {
			var oAnt = this._oAnt;
			var oOffset = $el.offset();
			var $drop = $('#group-drop');

			callback = callback || function () {
			};

			$drop.css(oOffset).show().data('isShow', false);

			if (this._groupTime) {
				clearTimeout(this._groupTime);
			}

			this._groupTime = setTimeout(function () {
				$drop.data('isShow', true);
			}, 100);

			$drop.off('click').on('click', 'li[data-id]',function () {
				callback($(this).data('id'));
				$drop.hide().data('isShow', false);
				return false;
			}).on('click', '.create-group a', function () {
					oAnt.el.find('.create-group a').click();
					return false;
				});

		},
		//加载分组
		loadGroup: function (oAnt, callback) {
			oAnt = oAnt || this._oAnt;

			callback = callback || function () {
			};

			var $groupEl = oAnt.el.find('.stage');
			var xTime = false;
			var self = this;

			//console.log('bind', $groupEl.sortable);
			$groupEl.sortable({
				items: '.order-li',
				placeholder: "group-order-highlight",
				stop: function (event, ui) {
					var aOrder = [];
					$groupEl.find('.order-li').each(function () {
						aOrder.push($(this).attr('group-id'));
					});
					//清除等待任务
					if (xTime) {
						clearTimeout(xTime);
					}
					//加入等待任务
					xTime = setTimeout(function () {
						self.updateGroupOrder(aOrder.reverse(), oAnt);
					}, 200);
				}
			});

			$.ajax({
				url: oConfig.manageProduct.groupData,
				data: this.getQueryData(),
				cache: false,
				success: function (jData) {
					if (jData.status === "success" &&
						jData.data.length) {
						//console.log(jData.data);
						var groupCount = 0;
						$.each(jData.data, function (k, v) {
							groupCount += v.productNum;
							v.isNone = v.groupId === -1;

							if (v.groupId === 1) {
								v.groupName = _('MODULE.PRODUCT_MANAGE.NOT_GROUP');
							}
						});
						oAnt.set('group', jData.data);
						oAnt.set('groupCount', groupCount);
						callback();
					}
				}
			});
		},
		//初始化添加分组
		initAddGroup: function (oAnt, $el) {
			var self = this;
			var $groupCon = $el.find('.group-con');
			var win = new Can.view.pinWindowView({
				width: 320,
				height: 100
			});
			$groupCon.appendTo(win.content.el);

			win.content.el.on('click', '.addBtn', function () {
				//发送新分组
				var $el = $(this);
				var $input = win.content.el.find('.ipt');
				var sVal = $.trim($input.val());
				if ($el.is('.dis')) {
					return false;
				}
				if (sVal === '') {
					$groupCon.find('#tipNav').html(_('TEXT_BUTTON_VIEW.REQUEST')).removeClass('hidden');
					$groupCon.find('.el').addClass('el-error');
					return false;
				}
				else if (sVal.length > 50) {
					$groupCon.find('#tipNav').html(_('TEXT_BUTTON_VIEW.LONG_LIMIT')).removeClass('hidden');
					$groupCon.find('.el').addClass('el-error');
					return false;

				}

				$groupCon.find('#tipNav').addClass('hidden');
				$groupCon.find('.el').removeClass('el-error');
				$el.addClass('dis');

				$.post(oConfig.manageProduct.CREATE_MENU, {
					groupName: sVal
				}, function (jData) {
					//重新加载分组
					self.loadGroup(oAnt);
					win.hide();
					$el.removeClass('dis');

                    //console.log(jData);
				}, 'json');

			}).on('keydown', '.ipt', function (e) {
					if (e.keyCode === 13) {
						win.content.el.find('.addBtn').click();
					}
				});

			return win;
		},
		//更新分组排序
		updateGroupOrder: function (aOrder, oAnt) {
			var self = this;
			var sURL = oConfig.manageProduct.groupUpdateSore;
			var aValue = [];

			for (var i = aOrder.length; i > 0; i--) {
				aValue.push(i);
			}
			var aData = [];
			$.each(aOrder, function (k, v) {
				aData.push('groupIds=' + v.toString());
			});
			$.each(aValue, function (k, v) {
				aData.push('sort=' + v.toString());
			});
			//console.log(aData);
			$.post(sURL, aData.join('&'), function (d) {
				self.loadGroup(oAnt);
			}, 'json');
		},
		//返回当前状态
		getStatus: function () {
			//与后端的约定转换
			var oStatuMap = {
				'pass': 3,
				'pending': 2,
				'rejected': -1,
			};

			return oStatuMap[this._sAct];
		},
		//组合传递给后端的查询条件
		getQueryData: function () {
			var oData = {
				//filter: this._sFilter,
				keywords: this._sKeyword,
				page: this._nPage,
				//status: this.getStatus(),
				isOnline: this._nOnLine,
				productGroupId: this._sGroupId
			};

			if (this._sFilter !== '') {
				oData[this._sFilter] = 1;
			}

			//console.log(oData);
			return oData;
		},
		//加载数据
		loadData: function (oAnt, callback) {
			var self = this;
			oAnt.set('isShowLoad', true);

			callback = callback || function () {
			};

			//console.log('load');

			$.ajax({
				url: oConfig.manageProduct.productList,
				data: this.getQueryData(),
				cache: false,
				success: function (jData) {
					oAnt.set('isShowLoad', false);
 
					if (jData.status !== 'success') {
					
						Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, jData);
						return;
					}
					var groups = jData.data.productGroups;
					//处理一下数据
					$.each(jData.data.list, function (k, v) {
//					console.log(v.productName)
//					v.abc=1;
//					console.info(v.abc)
						var urlProName=v.productName;
						if(urlProName){
							v.urlproductName=encodeURIComponent(urlProName);
						}
						
						
						//分组名
						if (v.groupId === 0) {
							v.groupName = _('MODULE.PRODUCT_MANAGE.NOT_GROUP');
						}
						else {
							$.each(groups, function (k1, g) {
								if (g.groupId === v.groupId) {
									v.groupName = g.groupName;
									return false;
								}
							});
						}
						v.isNew = (v.newest === 1);
						v.isShowcase = (v.showCase === 1);

						v.isPending = v.status === 2;
						v.isPass = v.status === 3;
						v.isRejected = v.status === -1;

					});
					oAnt.set('page', jData.page);
					oAnt.set('products', jData.data.list);

					//console.log(jData);

					//处理顶部分页
					if (jData.page.page > 1) {
						oAnt.el.find('.btn-prev').removeClass('dis');
					}
					else {
						oAnt.el.find('.btn-prev').addClass('dis');
					}
					if (jData.page.page < jData.page.maxPage) {
						oAnt.el.find('.btn-next').removeClass('dis');
					}
					else {
						oAnt.el.find('.btn-next').addClass('dis');
					}
					callback();
				}
			});

		},
		//取还可以设置多少个橱窗产品
		getShowcaseCount: function (callback) {
			var self = this;
			callback = callback || function () {
			};

			$.ajax({
				url: oConfig.manageProduct.GET_SHOWCASE_COUNT,
				type: 'GET',
				success: function (jData) {
					if (jData.status !== "success") {
						Can.util.notice(_('MODULE.PRODUCT_MANAGE.DEL_TIPS'));
						return;
					}
					self._nPackCount = jData.data.codeValue;
					self._isHavePack = jData.data.haveSetting === 'true';
					//console.log(jData);
					callback(jData.data.codeValueCan);
				}
			});

		},
		//显示橱窗数量提示
		showShowcaseTip: function (oAnt, offset) {
			var $tip = oAnt.el.find('#showcase-tip');
			var self = this;
			if (this._xSTime) {
				clearTimeout(this._xSTime);
			}

			this._xSTime = setTimeout(function () {
				self.getShowcaseCount(function (sNum) {
					$tip.find('.tip').html(
						_('MODULE.PRODUCT_MANAGE.SHOWCASE_SELECTED', sNum)
					);

					$tip.css({
						top: offset.top - $tip.height() / 2,
						left: offset.left - $tip.width() - 30
					}).show();

				});

				if (self._xHSTime) {
					clearTimeout(self._xHSTime);
				}

				self._xHSTime = setTimeout(function () {
					$tip.hide();
				}, 1500);
			}, 200);

		},
		//标记为新产品
		markNewProducts: function (aIds, isNewProducts, callback) {
			var aData = [
				'newest=' + (isNewProducts === 1 ? '1' : '0')
			];

			$.each(aIds, function (k, v) {
				aData.push('productIds=' + v.toString());
			});

			callback = callback || function () {
			};

			$.ajax({
				url: oConfig.manageProduct.markNew,
				data: aData.join('&'),
				type: 'POST',
				success: function (jData) {
					if (jData.status !== "success") {
						Can.util.notice(_('MODULE.PRODUCT_MANAGE.DEL_TIPS'));
						return;
					}
					callback();
				}
			});

		},
		//显示弹窗内容
		showPopWin: function (sTip) {
			var fAlert = new Can.view.alertWindowView({
				closeAction: 'hide',
				hasBorder: false,
				type: 2
			});
			fAlert.setContent([
				'<div class="alert-status">',
				'<span class="icon"></span>',
				sTip,
				'</div>'
			].join(''));

			fAlert.main.el.addClass('alert-win-t1');
			fAlert.show();

		},
		//更新上线状态
		updateOnline: function (aIds, isOnline, callback) {
			var aData = [
				'isOnline=' + (isOnline === 1 ? '1' : '0')
			];
			var self = this;
			$.each(aIds, function (k, v) {
				aData.push('productIds=' + v.toString());
			});

			callback = callback || function () {
			};

			$.ajax({
				url: oConfig.manageProduct.UPDATE_LINE,
				data: aData.join('&'),
				type: 'POST',
				success: function (jData) {
					if (jData.status !== "success") {
						Can.util.notice(_('MODULE.PRODUCT_MANAGE.DEL_TIPS'));
						return;
					}
					callback();
				}
			});

		},
		//标记为橱窗产品
		markShowcase: function (aIds, isShowCase, callback) {
			var aData = [
				'showCase=' + (isShowCase === 1 ? '1' : '0')
			];
			var self = this;
			$.each(aIds, function (k, v) {
				aData.push('productIds=' + v.toString());
			});

			callback = callback || function () {
			};
			$.ajax({
				url: oConfig.manageProduct.UPDATE_SHOWCASE,
				data: aData.join('&'),
				type: 'POST',
				success: function (jData) {
					if (jData.status !== "success") {
						// 超过上限，清除已勾选上的产品
						if (aIds.length > 1) {
							self.loadData(self._ant);
						}
						else {
							$('input[data-id="' + aIds + '"]').attr('checked', false).trigger('change', true);
						}
						self.showPopWin(
							Can.util.i18n._('MODULE.PRODUCT_MANAGE.NOT_SHOWCASE')
						);
						return;
					}
					callback();
				}
			});

		},
		//删除产品
		deleteProducts: function (aIds, callback) {
			var confirm = new Can.view.confirmWindowView({
				id: 'productManageModuleDelConfirm',
				width: 280
			});

			var aData = [];
			$.each(aIds, function (k, v) {
				aData.push('productIds=' + v.toString());
			});

			callback = callback || function () {
			};

			confirm.setContent('<div class="error-box" >' + _('DELETE_CONFIRM') + '</div>');

			confirm.onOK(function () {
				$.ajax({
					url: oConfig.manageProduct.deleteProduct,
					data: aData.join('&'),
					type: 'POST',
					success: function (jData) {
						if (jData.status !== "success") {
							Can.util.notice(_('MODULE.PRODUCT_MANAGE.DEL_TIPS'));
							return;
						}
						callback();
					}
				});
			});

			confirm.show();
		},
		//模板渲染完成
		onRender: function (oAnt, oData) {
			var self = this;
			self._ant = oAnt;
			var fGetIds = function () {
				var aEl = oAnt.el.find('input[name=product]');
				var aIds = [];
				aEl.each(function () {
					var $el = $(this);
					if ($el.attr('checked')) {
						aIds.push($el.val());
					}
				});
				return aIds;
			};

			//删除按钮
			var $delIcon = oAnt.el.find('.ico-del').hide();
			//删除按钮的隐藏时间
			var xDelTime;

			//showcase 套餐提示
			var $showcaseTip = oAnt.el.find('#pack-tip');
			var xShowcaseTime;

			//将分组下拉框移到body里
			var $drop = oAnt.el.find('#group-drop').appendTo($('body'));
			var $maskDrop = oAnt.el.find('#mask-drop').appendTo($('body'));

			$maskDrop.on('click', '[act=makeNew]',function () {
				//批量标为新产品
				$maskDrop.hide();
				var aIds = fGetIds();
				if (aIds.length === 0) {
					Can.util.notice(_('MODULE.PRODUCT_MANAGE.CHECKED_TIPS'));
					return false;
				}
				self.markNewProducts(aIds, 1, function () {
					//self.loadGroup(oAnt);
					self.loadData(oAnt);
				});
				return false;
			}).on('click', '[act=showcase]', function () {
					//批量标为橱窗产品
					$maskDrop.hide();
					var aIds = fGetIds();
					if (aIds.length === 0) {
						Can.util.notice(_('MODULE.PRODUCT_MANAGE.CHECKED_TIPS'));
						return false;
					}
					self.getShowcaseCount(function (aCount) {
						if (self._isHavePack !== true) {
							self.showPopWin(
								Can.util.i18n._('MODULE.PRODUCT_MANAGE.NOT_SHOWCASE')
							);
							return;
						}

						if (aIds.length > self._nPackCount || aCount < aIds.length) {
							self.showPopWin(
								Can.util.i18n._('MODULE.PRODUCT_MANAGE.SHOWCASE_MAX_TIP', self._nPackCount)
							);
						}

						self.markShowcase(aIds, 1, function () {
							//self.loadGroup(oAnt);
							self.loadData(oAnt);
						});

					});
					return false;
				});


			$showcaseTip.hover(function () {
				if (xShowcaseTime) {
					clearTimeout(xShowcaseTime);
				}
				$showcaseTip.show();
			},function () {
				if (xShowcaseTime) {
					clearTimeout(xShowcaseTime);
				}
				xShowcaseTime = setTimeout(function () {
					$showcaseTip.hide();
				}, 200);
			}).on('change', 'input',function () {
					//console.log('c');
					Can.util.Cache.set('Showcase_Tip_' + self._sUserId, false);
					self._isShowST = false;
				}).on('click', '.text-right span', function () {
					$showcaseTip.find('input').attr('checked', true).change();
					return false;
				});

			$delIcon.hover(function () {
				if (false === oAnt.data.isShowDel) {
					return;
				}

				if (xDelTime) {
					clearTimeout(xDelTime);
				}
				var $tr = $delIcon.data('$tr');
				if (!$tr) {
					return;
				}
				$tr.addClass('hover');
				$delIcon.show();
			},function () {
				if (false === oAnt.data.isShowDel) {
					return;
				}

				if (xDelTime) {
					clearTimeout(xDelTime);
				}
				xDelTime = setTimeout(function () {
					var $tr = $delIcon.data('$tr');
					if (!$tr) {
						return;
					}
					$tr.removeClass('hover');
					$delIcon.hide();
				}, 200);
			}).click(function () {
					if (false === oAnt.data.isShowDel) {
						return false;
					}

					var nId = $delIcon.data('pid');
					if (!nId) {
						return false;
					}
					self.deleteProducts([nId], function () {
						self.loadGroup(oAnt);
						self.loadData(oAnt);
					});
					return false;
				});

			//分组窗口内容
			var win = self.initAddGroup(oAnt, oAnt.el.find('#group-win'));

			//加载jquery ui
			if (!oAnt.el.sortable) {
				Can.importJS([
					'js/plugin/jquery/jquery-ui-1.10.3.custom.min.js'
				]);
			}

			oAnt.el.off('click', '.create-group a').
				on('click', '.create-group a',function () {
					//创建分组
					win.show();
					win.content.el.find('.ipt').focus().val('');
					return false;
				}).off('click', '#group_left [act=groupName]').
				on('click', '#group_left [act=groupName]',function () {
					//选择分组
					var $el = $(this);
					self.goTo({gid: $el.data('id'), page: 1});
					return false;
				}).off('click', '#group_left .tit-all').
				on('click', '#group_left .tit-all',function () {
					//选择所有分组
					self.goTo({gid: '', page: 1});
					return false;

				}).off('click', '[act=groupEdit]'
				).on('click', '[act=groupEdit]',function () {
					//编辑分组名
					var nMaxLength = 35;//分组名最大长度 待定

					var sName = $(this).data('name');
					var $el = $(this).prev();
					var $li = $el.parent();
					var $input = $('<input type="text" value="' + sName + '" class="ipt">');
					//console.log($el);

					$li.find('a').hide();

					$input.focus(function () {
						this.select();
					}).blur(function () {
							var sVal = $.trim($input.val());
							if (sVal === sName) {
								$input.remove();
								$li.find('a').show();
								return;
							}
							if (sVal === '') {
								Can.util.notice(_('MODULE.PRODUCT_MANAGE.NOT_NULL'));
								return;
							}
							else if (sVal.length > nMaxLength) {
								Can.util.notice(_('MODULE.PRODUCT_MANAGE.LONG'));
								return;
							}

							$.ajax({
								url: oConfig.manageProduct.updateGroup,
								data: {
									groupNames: sVal,
									groupIds: $el.data('id')
								},
								type: 'POST',
								success: function (result) {
									if (result.status == "success") {
										Can.util.notice(_('MODULE.PRODUCT_MANAGE.EDIT_GROUP'));
										self.loadGroup(oAnt);

									}
									else {
										Can.util.notice(_('MODULE.PRODUCT_MANAGE.EDIT_GROUP_FAIL'));
									}
								}
							});
						});

					$input.appendTo($li);
					$input.focus();
					return false;
				}).off('click', '[act=groupClose]'
				).on('click', '[act=groupClose]',function () {
					//删除分组
					var $el = $(this);
					var nId = $el.data('del-id');
					var pNum =$el.data('pnum');

					var confirm = new Can.view.confirmWindowView({
						id: 'productGroupDelConfirm',
						width: 280
					});
					confirm.setContent(
						'<div class="error-box" >' +
							_('DELETE_CONFIRM') +
							'</div>');
					confirm.show();
					
					confirm.onOK(function () {						
						if(pNum>0){
							Can.util.notice(_('MODULE.PRODUCT_MANAGE.DELETE_ERROR'));
						}else{							
							$.ajax({
								url: oConfig.manageProduct.deleteGroup,
								data: {groupIds: nId},
								type: 'POST',
								success: function (jData) {
									if (jData.status === "success") {
										self.loadGroup(oAnt);
										return;
									}
									else if (jData.errorCode == "3003") {
										Can.util.notice(jData.message);
										//Can.util.notice(_('MODULE.PRODUCT_MANAGE.DELETE_ERROR'));
									} else {
										Can.util.notice(_('MODULE.PRODUCT_MANAGE.DELETE_FAIL'));
									}

								}
							});
						}
					});
					return false;
				}).on('click', '.ico-search',function () {
					//搜索产品
					var sKw = oAnt.el.find('#search-kewyord').val();
					//var sF  = oAnt.data.filter;
					//console.log(sF);
					sKw = $.trim(sKw);
					self.goTo({
						s: sKw,
						//f: sF,
						page: 1
					});
					return false;
				}).on('keydown', '#search-kewyord',function (e) {
					//按回车提交
					if (e.keyCode === 13) {
						oAnt.el.find('.ico-search').click();
					}
				}).off('click', '#filter_ui li').
				on('click', '#filter_ui li',function () {
					//筛选
					var $el = oAnt.el.find('[name=filter]');
					self.goTo({
						f: $el.val(),
						page: 1
					});

				}).on('click', '.group_field',function () {
					//移动到分组

					var $el = $(this);
					var nId = $el.data('id');
					var aIds;
					if (!nId) {
						aIds = fGetIds();
					}
					else {
						aIds = [nId];
					}

					self.buildGroupDrop($el, function (groupId) {
						if (aIds.length === 0) {
							Can.util.notice(_('MODULE.PRODUCT_MANAGE.CHECKED_TIPS'));
							return false;
						}

						var aData = ['productGroupId=' + groupId.toString()];
						$.each(aIds, function (k, v) {
							aData.push('productIds=' + v.toString());
						});

						$.ajax({
							url: oConfig.manageProduct.itemSetGroup,
							data: aData.join('&'),
							type: 'POST',
							success: function (jData) {
								if (jData.status !== "success") {
									Can.util.notice(_('MODULE.PRODUCT_MANAGE.SET_GROUP_FAIL'));
									return;
								}
								self.loadGroup(oAnt);
								self.loadData(oAnt);
							}
						});

					});

					return false;
				}).on('click', '.btn-prev',function () {
					//前一页
					var $el = $(this);
					if ($el.is('.dis')) {
						return false;
					}
					if (self._nPage > 1) {
						self.goTo({page: (self._nPage - 1)});
					}
					return false;
				}).on('click', '.btn-next',function () {
					//下一页
					var $el = $(this);
					if ($el.is('.dis')) {
						return false;
					}
					self.goTo({page: (self._nPage + 1)});
					return false;
				}).bind('pageChange', '[page]',function (e, page) {
					//分页条
					self.goTo({page: page});
					return false;
				}).on('change', '#selectAll',function () {
					//批量选择
					var $el = $(this);
					var isChecked = $el.attr('checked') === 'checked';
					oAnt.el.find('input[name=product]').attr('checked', isChecked).each(function () {
						$(this).change();
					});
				}).on('change', 'input[name=product]',function () {
					//选中产品
					var $el = $(this);
					var $tr = $el.parent().parent();
					var $allSelect = oAnt.el.find('#selectAll');

					if ($el.attr('checked')) {
						$tr.addClass('selected');
						$tr.find('.bg-icon').attr('class', 'bg-icon icons select-1');
					}
					else {
						$tr.removeClass('selected');
						$tr.find('.bg-icon').attr('class', 'bg-icon icons select-0');
					}

					if ($el.attr('checked') !== $allSelect.attr('checked')) {
						$allSelect.attr('checked', false).data('syncUi')();
					}

					//oAnt.el.find('#selectAll').attr('checked', false).data('syncUi')();
				}).on('click', '[act=delProduct]',function () {
					//批量删除产品
					var aIds = fGetIds();
					//console.log(aIds);
					if (aIds.length === 0) {
						Can.util.notice(_('MODULE.PRODUCT_MANAGE.CHECKED_TIPS'));
						return false;
					}
					self.deleteProducts(aIds, function () {
						self.loadGroup(oAnt);
						self.loadData(oAnt);
					});
					return false;
				}).on('mouseenter', 'tr.unread',function () {
					//移动到
					var $el = $(this);
					$el.addClass('hover');

					if (false === oAnt.data.isShowDel) {
						return;
					}
					if (xDelTime) {
						clearTimeout(xDelTime);
					}
					//要删除的id
					$delIcon.data('pid', $el.data('id'));
					$delIcon.data('$tr', $el);
					//console.log($el.data('id'));

					$delIcon.css({
						top: $el.position().top
					}).show();

				}).on('mouseleave', 'tr.unread',function () {
					//移走
					var $el = $(this);
					$el.removeClass('hover');

					if (false === oAnt.data.isShowDel) {
						return;
					}

					if (xDelTime) {
						clearTimeout(xDelTime);
					}

					xDelTime = setTimeout(function () {
						$delIcon.hide();
					}, 200);
				}).on('click', 'tr.unread',function () {
					var $el = $(this);
					var $check = $el.find('[name=product]');
					$check.attr('checked', ($check.attr('checked') !== 'checked')).change();
				}).on('click', '[act=changeMakeNew]',function () {
					//触发更改产品的“新产品”状态
					var $el = $(this);
					var $cb = $el.find('input');

					$cb.attr('checked', ($cb.attr('checked') !== 'checked')).change();
					return false;
				}).on('change', '[name=changeMakeNew]',function () {
					//更改产品的“新产品”状态
					var $el = $(this);
					// 标记为“新产品”, 可以取消
					var isChecked = $el.attr('checked') === 'checked' ? 1 : 0;
					var nId = $el.data('id');

					//console.log(nId);
					self.markNewProducts([nId], isChecked, function () {
						//self.loadGroup(oAnt);
						//self.loadData(oAnt);
					});

				}).on('click', '[act=changeShowcase]',function () {
					//触发更改产品的“橱窗”状态
					var $el = $(this);
					//
					self.getShowcasePackageCount(function (nNumber, isHavePack) {
						if (isHavePack !== true) {
							self.showPopWin(Can.util.i18n._('MODULE.PRODUCT_MANAGE.NOT_SHOWCASE')
							);
							return;
						}
						var $cb = $el.find('input');
						$cb.attr('checked', ($cb.attr('checked') !== 'checked')).change();
					});

					return false;
				}).on('change', '[name=changeShowcase]',function (event, bNotTips) {
					//更改产品的“橱窗”状态
					var $el = $(this);
					var isChecked = $el.attr('checked') === 'checked' ? 1 : 0;
					var nId = $el.data('id');

					$showcaseTip.hide();

					if (isChecked === 1) {
						$el.parent().data('selected', '1');
					}
					else {
						$el.parent().data('selected', '');
					}

					//console.log(nId);
					self.markShowcase([nId], isChecked, function () {
						if (bNotTips) {
							return;
						}
						var offset = $el.parent().offset();
						self.showShowcaseTip(oAnt, offset);
						//self.loadGroup(oAnt);
						/*self.loadData(oAnt, function(){*/
						////显示数据
						//self.showShowcaseTip(oAnt, offset);
						/*});*/
					});

				}).on('mouseenter', '[act=changeShowcase]',function () {
					//移动到
					var $el = $(this);
					if (xShowcaseTime) {
						clearTimeout(xShowcaseTime);
					}

					if ($el.data('selected') !== '' || self._isShowST === false) {
						return;
					}

					var offset = $el.offset();
					$showcaseTip.css({
						top: offset.top - $showcaseTip.height() / 2,
						left: offset.left - $showcaseTip.width() - 30
					}).show();

				}).on('mouseleave', '[act=changeShowcase]',function () {
					//移走
					var $el = $(this);

					if (xShowcaseTime) {
						clearTimeout(xShowcaseTime);
					}
					xShowcaseTime = setTimeout(function () {
						$showcaseTip.hide();
					}, 200);
				}).on('click', '[act=maskAs]',function () {
					//显示 mask as 菜单
					var $el = $(this);

					var oOffset = $el.offset();
					$maskDrop.css(oOffset).show();

					return false;
				}).on('click', '[act=offLines]',function () {
					//批量下线
					var aIds = fGetIds();
					//console.log(aIds);
					if (aIds.length === 0) {
						Can.util.notice(_('MODULE.PRODUCT_MANAGE.CHECKED_TIPS'));
						return false;
					}
					self.updateOnline(aIds, 0, function () {
						self.loadGroup(oAnt);
						self.loadData(oAnt);
					});
					return false;

				}).on('click', '[act=offLine]',function () {
					//下线产品
					var sId = $(this).data('id');
					self.updateOnline([sId], 0, function () {
						self.loadGroup(oAnt);
						self.loadData(oAnt);
					});
					return false;

				}).on('click', '[act=onLine]', function () {
					//上线产品
					var sId = $(this).data('id');
					self.updateOnline([sId], 1, function () {
						self.loadGroup(oAnt);
						self.loadData(oAnt);
					});
					return false;

				});


			Can.util.EventDispatch.on('ON_PAGE_CLICK', function (e) {
				if ($drop.data('isShow') && false === $.contains(e.target, $drop[0])) {
					$drop.hide().data('isShow', false);
				}
				if (false === $.contains(e.target, $maskDrop[0])) {
					$maskDrop.hide();
				}

			});
		},
		//模板数据更新
		onUpdate: function (oAnt, oData) {
			var self = this, $curGroup;
			var $markCur = oAnt.el.find('.cur-mark');

			//取消全选
			oAnt.el.find('#selectAll').attr('checked', false).data('syncUi')();

			//选中对应的分组
			oAnt.el.find('#group_left').find('.cur').removeClass('cur');
			if (this._sGroupId === '') {
				$curGroup = oAnt.el.find('.tit-all').addClass('cur');
			}
			else {
				$curGroup = oAnt.el.find('#group_left').find('[group-id=' + this._sGroupId + ']');
				$curGroup.find('[act=groupName]').addClass('cur');
			}
			if ($curGroup.length === 0) {
				$curGroup = oAnt.el.find('.tit-all').addClass('cur');

			}
			$markCur.stop().animate({top: $curGroup.position().top + 15});

			//选中对应的tab
			var $tab = oAnt.el.find('#top-tab');
			$tab.find('a.cur').removeClass('cur');
			var nIx = 0;
			if (this._nOnLine === 0) {
				nIx = 1;
			}

			$tab.find('a').eq(nIx).addClass('cur');

		},
		//显示套餐剩下数量
		showcasePackage: function (oAnt, callback) {
			var self = this;
			var $el = oAnt.el.find('#pack-tip .tip');

			if (false === this._isShowST) {
				return callback();
			}

			self.getShowcasePackageCount(function (nNumber) {
				if (nNumber < 1) {
					$el.html(_('MODULE.PRODUCT_MANAGE.NOT_SHOWCASE'));
				}
				else {
                        $el.html(_('MODULE.PRODUCT_MANAGE.SHOWCASE_TIP', nNumber));
				}
				callback();

			});
		},
		//取套餐总娄星
		getShowcasePackageCount: function (callback) {
			var self = this;

			if (this._nPackCount && this._isHavePack) {
				callback(this._nPackCount, this._isHavePack);
				return;
			}

			$.ajax({
				url: oConfig.manageProduct.GET_SHOWCASE_COUNT,
				type: 'GET',
				success: function (jData) {
					if (jData.status !== "success") {
						Can.util.notice(_('MODULE.PRODUCT_MANAGE.DEL_TIPS'));
						return;
					}
					self._nPackCount = jData.data.codeValue;
					self._isHavePack = jData.data.haveSetting === 'true';
					//console.log(jData);
					callback(self._nPackCount, self._isHavePack);
				}
			});

		},
		//初始化模板引擎
		initTemplate: function (callback) {
			var _oDefData = {
				keyword: this._sKeyword,
				/*isPass: this._sAct === 'pass',*/
				//isPending: this._sAct === 'pending',
				//isRejected: this._sAct === 'rejected',
				/*isShowDel: this._sAct !== 'pending',*/
				isOnline: this._nOnLine === 1,
				filter: this._sFilter
			};
			var self = this;
			var $content = this.contentEl;


			if (this._oAnt) {
				this._oAnt.set(_oDefData);
				this.showcasePackage(this._oAnt, function () {
					return callback(self._oAnt);
				});
				return;
			}

			self.loadTpl(function ($tpl) {
				$content.html($tpl.html());

				self._oAnt = template($content, {
					data: _oDefData,
					events: {
						render: function () {
							//console.info(this.data);
							self.onRender(this, this.data);
						},
						update: function () {
							self.onUpdate(this, this.data);
						}
					}
				});

				self.showcasePackage(self._oAnt, function () {
					return callback(self._oAnt);
				});
			});
		},
		//初始化顶部按钮
		initTopBtns: function () {
			var $addBtn = $('<a href="" class="btn btn-s11">' + _('MODULE.PRODUCT_MANAGE.ADD_PRODUCT') + '</a>').click(function () {
				Can.Route.run('/add-product');
				return false;
			});

			var $viewBtn = $('<a href="" class="btn btn-s12" style="display:none">' + _('MODULE.PRODUCT_MANAGE.STATE') + '</a>').click(function () {
				Can.Route.run('/product-status');
				return false;
			});

			var $optBox = this.containerEl.find('.opt-box');

			$addBtn.appendTo($optBox);
			$viewBtn.appendTo($optBox);

		}
	});

})(Can, Can.module);

