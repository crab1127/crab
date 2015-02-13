/**
 *
 * 系统模块定义基类
 * @Author: island
 * @version: v1.1
 * @since:13-1-11 上午12:03
 */
Can.module.BaseModule = Can.extend(Can.view.BaseView, {
	constructor: function (config) {
		Can.apply(this, config || {});
		Can.module.BaseModule.superclass.constructor.call(this);
		this.addEvents('onshow', 'onhide');
	},
	/**
	 * 每个子类必须指定module ID,
	 */
	id: '',
	/**
	 * 模块的名称，将显示在顶部
	 */
	title: '',
	/**
	 * 从路由传递过来的参数
	 * @type {Object}
	 */
	_oRoutArgs: {},
	/**
	 * 模块的基本样式名，默认为panel
	 */
	cssName: 'panel',
	/**
	 * 模块的父级元素标签，默认是DIV
	 */
	wrapEL: 'div',
	/**
	 * 模块标题容易样式名
	 */
	titleContainerCss: 'hd-tit',
	/**
	 * 标识当前模块是否显示的，即是否是活动的<br/>
	 * @return {boolean} false 不是活动，当前隐藏中
	 *                    true  是活动的，当前显示中
	 */
	current: false,
	/**
	 * 前一个moduleID，主要用于查看详情之类的返回
	 */
	returnModule: null,
	/**
	 * 顶部右边功能按钮，每一个item必须为Can.ui.toolbar.Button的子类
	 */
	rightButtons: [],
	isCurrent: function () {
		return this.current;
	},
	getId: function () {
		return this.id;
	},
	/**
	 * 更新模块标题
	 */
	updateTitle: function (newTitle) {
		if (this.titleEL != undefined) {
			this.titleEL.text(newTitle);
		}
		this.title = newTitle;
	},
	/**
	 * 在模块顶部的右边增加tab按钮
	 * @param {[Can.ui.toolbar.Button]} items 必须为Can.ui.toolbar.Button的子类
	 */
	addTagItem: function (items) {
		if (!items || !items.length) {
			return;
		}
		var me = this;
		//先封装一层DIV
		var _tab_div = new Can.ui.Panel({cssName: 'tab-s1'});
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item instanceof Can.ui.toolbar.Button) {
				_tab_div.addItem(item);
				item.click(function (event) {
					if (me.currentFncBnt === this) {
						event.stopPropagation();
						return false;
					}
					me.setCurrentRightBtn(this);
				});
			}
		}
		this.fncContainer.addItem(_tab_div);
	},
	/**
	 * 在模块顶部的右边增加功能按钮
	 * @param {Array} items 必须为Can.ui.toolbar.Button的子类
	 */
	addOptBtn: function (items) {
		if (!items) return;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item instanceof Can.ui.toolbar.Button) {
				this.fncContainer.addItem(item);
			}
		}
	},
	/**
	 * 设置当前顶部右边某个功能按钮为current
	 */
	setCurrentRightBtn: function (btn) {
		if (this.currentFncBnt != undefined) {
			this.currentFncBnt.getDom().removeClass('cur');
		}
		this.currentFncBnt = btn;
		this.currentFncBnt.getDom().addClass('cur');
	},
	isCurrentFncBtn: function (btn) {
		return this.currentFncBnt === btn;
	},
	routeMark: function (sId) {
		if (Can.Route) {
			Can.Route.mark(sId || this.id);
		}
	},
	/**
	 * 定义顶部的tab
	 * @demo
	 * this.setTabs([
	 *      {url: '/buyer-activity', title: 'All Activities'},
	 *      {url: '/buyer-activity/my', title: 'My Status'}
	 * ]);
	 */
	setTabs: function (aTags) {
		var $dom, $item;

		this.titleContainerEL.find('.opt-box .tab-s1').remove();
		$dom = $('<div class="tab-s1"></div>').appendTo(this.titleContainerEL.find('.opt-box'));

		$.each(aTags, function (k, v) {
			$item = $('<a></a>');
			$item.attr('href', '#!' + v.url);
			$item.text(v.title);
			$item.appendTo($dom);

			(function ($item, url) {
				$item.click(function () {
					Can.Route.run(url);
					return false;
				});
			})($item, v.url);

		});
	},
	/**
	 * 显示当前模块
	 */
	show: function (sRouteRule, oArgs, xData) {
		if (Can.util.menuCreate && !Can.util.menuCreate.check(this.id)) {
//			console.log(Can.Application && Can.Application.getCurrentModule())
			var _path = Can.Application ? (Can.Application.getCurrentModule()._sRoutCall || Can.Application.getCurrentModule().id) : '/';
//			console.info(_path)
			setTimeout(function () {
				Can.Route.run(_path);
			}, 200);
			return;
		}
		if (Can.Application) {
			if (!Can.Application.getModule(this.id)) {
				Can.Application.putModule(this);
			}
		}
		var self = this;

		//同一个 model, 根据 route ,  调用不同的 act
		//只支持两级：
		//如 /collections ， 对应的方法是 this.actIndex
		//如 /collections/egg ，对应的方法是 this.actEgg
		//如 /collections/test ，对应的方法是 this.actTest
		var isMake = false;

		//console.log('run: ' + sRouteRule);
		if (sRouteRule) {
			var sStorageKey = '__RouteData__';
			var oData;

			self._sFullUrl = Can.Route.urlFor(sRouteRule, oArgs);

			//尝试从本地储存中取数据
			var sVal = window.localStorage.getItem(sStorageKey);
			if (sVal) {
				oData = JSON.parse(sVal);
				if (oData.id !== self._sFullUrl) {
					//删除
					window.localStorage.removeItem(sStorageKey);
				}
				else {
					//追加到 _oRoutArgs
					self._oRoutArgs = $.extend(true, self._oRoutArgs, oData.data);
				}
			}

			//有数据，将数据放入本地储存
			if ($.isPlainObject(xData)) {
				xData = $.extend(true, self._oRoutArgs, xData);
				oData = {
					id: self._sFullUrl,
					data: xData
				};
				window.localStorage.setItem(sStorageKey, JSON.stringify(oData));
				//追加到 _oRoutArgs
				self._oRoutArgs = xData;
			}


			//如果存在跟 route[0] 一样的 act, 则触发，并标记路由
			var sName = sRouteRule.replace(/^\//, '');
			var nTmp = sName.split('/');
			var sActName = 'actIndex';

			if (nTmp.length > 1) {
				var nName = nTmp[1].split('');
				nName[0] = nName[0].toUpperCase();
				sActName = 'act' + nName.join('');
			}

			if ($.isFunction(this[sActName])) {
				isMake = true;
				//console.log('mark: ', sRouteRule);
				Can.Route.mark(sRouteRule, oArgs);
				self._aRouteMark = [sRouteRule, oArgs];

				//选中tab
				var $tabs = this.titleContainerEL.find('.opt-box .tab-s1');
				var $oldTab = $tabs.find('a.cur').removeClass('cur');
				var isCur = false;

				$tabs.find('a').each(function () {
					var $a = $(this);
					if ($a.attr('href').indexOf('#!' + sRouteRule) === 0) {
						$a.addClass('cur');
						isCur = true;
						return false;
					}
				});
				//如果没有选中新tab, 重新选中旧tab
				if (false === isCur) {
					$oldTab.addClass('cur');
				}
				self[sActName](self._oRoutArgs);
			}
		}

		/*if (console && console.debug) {
		 console.debug('show module ' + this.id)
		 console.debug(this.containerEl)
		 }*/
		if (this.containerEl != undefined) {
			var me = this;
			if (Can.Application) {
				var cModule = Can.Application.getCurrentModule();
				if (cModule && cModule.getId() == me.id) {
					return;
				}
				// scroll to top
				$(document).scrollTop(0);
				/*if (console && console.debug) {
				 console.debug('old module ', cModule)
				 }*/
				if (cModule) {
					cModule.hide();
				}
				me.containerEl.slideDown('slow', function () {
					me.fireEvent('onshow');
				});
				Can.Application.setCurrentModule(me);
			}
			else {
				me.containerEl.slideDown('slow', function () {
					me.fireEvent('onshow');
				});
			}
		}

		//简单路由, 标记当前模块
		if (false === isMake) {
			this.routeMark(this.id);
		}

		// 触发GA统计，假如有GA的话
		if (typeof ga === 'function') {
			ga('send', 'pageview', {
				page: location.href.replace('http://' + location.host, ''),
				title: me.title || document.title
			});
		}
	},
	/**
	 * 隐藏当前模块
	 */
	hide: function () {
		if (this.containerEl != undefined) {
			this.containerEl.css('height', document.documentElement.clientHeight).slideUp('slow', function () {
				$(this).css('height', 'auto');
			});
			this.fireEvent('onhide');
		}
	},
	startup: function () {
		this.containerEl = $('<' + this.wrapEL + '></' + this.wrapEL + '>');
		this.containerEl.attr('class', this.cssName).hide();
		if (this.id) {
			this.containerEl.attr('id', this.id);
		}
		this.containerEl.appendTo('#container');

		//init the title
		if (this.title && (typeof this.title == 'string') && this.title != '') {
			this.titleContainerEL = $('<div></div>').attr('class', this.titleContainerCss).appendTo(this.containerEl);
			//初始化每个模块头部右边的功能按钮
			this.fncContainer = new Can.ui.Panel({cssName: 'opt-box', wrapEL: 'div'});
			this.fncContainer.applyTo(this.titleContainerEL);
			this.titleEL = $('<h2></h2>').text(this.title);
			this.titleEL.appendTo(this.titleContainerEL);
		}
		//初始化顶部右边的功能按钮
		this.addTagItem(this.rightButtons);
		//init the panel content
		this.contentEl = $('<div class="content clear"></div>').appendTo(this.containerEl);
	},
	/**
	 * 支持动态的从服务器中获取数据或者页面，然后在module中进行显示
	 */
	loadModuleContent: function (url, param) {
		if (url) {
			var _param = Can.apply({}, param);
			var me = this;
			$.get(url, _param, function (data) {
				me.containerEl.html(data);
			})
		}
	},
	/**
	 * 直接加载URL进iframe
	 */
	loadIframe: function (sURL) {
		if (!this.iframe) {
			this.iframe = $('<iframe frameborder="0" scrolling="no" src="about:blank" style="width:100%;"></iframe>');
			this.iframe.bind('load', function () {
				var BODY = this.contentWindow.document.body;
				$(this).css('height', 0);
				$(this).css('height', BODY.scrollHeight);
				isRightUserType();
			});
			this.contentEl.empty().append(this.iframe);
		}
		this.iframe.attr('src', sURL);
	}
});
