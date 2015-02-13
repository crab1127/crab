/**
 * @Author: sam
 * @version: v1.2
 * @since:13-2-18
 */
Can.module.myContacterModule = Can.extend(Can.module.BaseModule, {
	id: 'myContacterModuleId',
	title: Can.msg.MODULE.MY_CONTACTS.TITLE,
	actionUrl: null,
	requireUiJs: ['js/utils/textAndBtnView.js', 'js/utils/stepBtnView.js', 'js/utils/findKeyword.js', 'js/utils/userGradeView.js'],
	actionJs: ['js/utils/myContacterAction.js'],
	modifyMenu_url: Can.util.Config.seller.myContacterModule.newGroup,
	constructor: function (cfg) {
		Can.apply(this, cfg || {});
		Can.module.myContacterModule.superclass.constructor.call(this);
		this.addEvents('STATIC_LiITEM_CLICK'
			, 'onsaveclick'
			, 'onbackclick'
		);
	},
	startup: function () {
		var _this = this,
			role = Can.util.userInfo().getUserType() === 1 ? 'supplier' : 'buyer';

		Can.module.myContacterModule.superclass.startup.call(this);
		this.delIco = $('<a class="bg-ico ico-del" style="display:none" href="javascript:;"></a>').appendTo('body');
		this.delIco.click(function () {
			_this.fireEvent('ON_CLOSE_CLICK', this);
		});
		//主容器内
		this.mod_container = new Can.ui.Panel({
			cssName: 'mod-col clear', id: 'mod-col'
		});
		//左边分组容器
		this.group_left = new Can.ui.Panel({
			wrapEL: 'div', cssName: 'extra', id: 'group_left'
		});
		//层 site-nav
		this.siteNav = new Can.ui.Panel({
			cssName: 'site-nav'
		});
		this.itemNav = new Can.ui.Panel({
			cssName: 'nav-item'
		});
		this.markCur = new Can.ui.Panel({
			cssName: 'bg-ico cur-mark'
		});
		this.markCur.el.attr("style", "top:18px;");
		this.ulNav = new Can.ui.Panel({
			wrapEL: 'ul',
			cssName: "my-apps"
		});
		this.mainLi = new Can.ui.Panel({
			wrapEL: 'li'
		});
		this.ul_inner = new Can.ui.Panel({
			wrapEL: 'ul',
			cssName: 'stage'
		});
		this.group_li = new Can.ui.Panel({wrapEL: 'div', cssName: 'create-group'});
		this.cre_group = new Can.ui.toolbar.Button({cssName: 'btn btn-s12', text: Can.msg.BUTTON.NEW_GROUP});
		this.cre_group.click(function () {
			var _develop = new Can.view.pinWindowView({width: 320, height: 100});
			var txtField = new Can.view.textAndBtnView({
				parentEl: _develop,
				target: _this,
				add_url: Can.util.Config.seller.myContacterModule.newGroup,
				// keyUp_url: Can.util.Config.seller.myContacterModule.VALIDATE_GROUP,
				keyUp_url: Can.util.Config.contacts.group.validation,
				callback: function () {
					_this.loadMenu();
					_this.addtoBtnFeild.set_items();
				}
			});
			txtField.start();
			_develop.setContent(txtField.el);
			_develop.show();
		});
		this.static_menu = new Can.ui.Panel({
			wrapEL: 'ul',
			cssName: 'level-nav'
		});

		if (role === 'supplier') {
			//begin
			this.static_liOne = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupOne = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r2"></span>' + Can.msg.MODULE.MY_CONTACTS.GUEST_TYPE
			});
			this.static_groupOne.el.attr("href", "javascript:;");
			this.static_groupOne.el.attr('title', Can.msg.MODULE.MY_CONTACTS.GUEST_TYPE);
			this.static_inner_uiOne = new Can.ui.Panel({
				wrapEL: 'ul',
				cssName: 'stage hidden'
			});
			this.static_innerOne_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '213010',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CLIENT_TYPE.POTENTIAL + '</a>'
			});
			this.static_innerOne_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '213020',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CLIENT_TYPE.NORMAL + '</a>'
			});
			this.static_innerOne_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '213030',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CLIENT_TYPE.AGENCY + '</a>'
			});
			this.static_innerOne_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '213040',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CLIENT_TYPE.PERSONAL_CLIENT + '</a>'
			});
			this.static_innerOne_e = new Can.ui.Panel({
				wrapEL: 'li',
				id: '213050',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CLIENT_TYPE.INVALID + '</a>'
			});
			this.static_inner_uiOne.addItem([this.static_innerOne_a, this.static_innerOne_b, this.static_innerOne_c, this.static_innerOne_d, this.static_innerOne_e]);
			this.static_liOne.addItem(this.static_groupOne);
			this.static_liOne.addItem(this.static_inner_uiOne);//end
			//begin
			this.static_liTwo = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupTwo = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r3"></span>' + Can.msg.MODULE.MY_CONTACTS.RELATIONSHIP_LEVEL
			});
			this.static_groupTwo.el.attr("href", "javascript:;");
			this.static_groupTwo.el.attr('title', Can.msg.MODULE.MY_CONTACTS.RELATIONSHIP_LEVEL);
			this.static_inner_uiTwo = new Can.ui.Panel({
				wrapEL: 'ul',
				cssName: 'stage hidden'
			});
			this.static_innerTwo_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '214010',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.RELATIONSHIP.CLOSE + '</a>'
			});
			this.static_innerTwo_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '214020',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.RELATIONSHIP.BETTER + '</a>'
			});
			this.static_innerTwo_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '214030',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.RELATIONSHIP.NORMAL + '</a>'
			});
			this.static_innerTwo_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '214050',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.RELATIONSHIP.BAD + '</a>'
			});
			this.static_inner_uiTwo.addItem([this.static_innerTwo_a, this.static_innerTwo_b, this.static_innerTwo_c, this.static_innerTwo_d]);
			this.static_liTwo.addItem(this.static_groupTwo);
			this.static_liTwo.addItem(this.static_inner_uiTwo);//end
			//begin
			this.static_liThr = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupThr = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r4"></span>' + Can.msg.MODULE.MY_CONTACTS.SYMBIOSIS
			});
			this.static_groupThr.el.attr("href", "javascript:;");
			this.static_groupThr.el.attr('title', Can.msg.MODULE.MY_CONTACTS.SYMBIOSIS);
			this.static_inner_uiThr = new Can.ui.Panel({
				wrapEL: 'ul',
				cssName: 'stage hidden'
			});
			this.static_innerThr_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '215010',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.COOPERATION.FOLLOWING + '</a>'
			});
			this.static_innerThr_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '215020',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.COOPERATION.CONTRACT + '</a>'
			});
			this.static_innerThr_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '215030',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.COOPERATION.COOPERATION_STAGE + '</a>'
			});
			this.static_innerThr_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '215050',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.COOPERATION.EOF_CONTRACT + '</a>'
			});
			this.static_inner_uiThr.addItem([this.static_innerThr_a, this.static_innerThr_b, this.static_innerThr_c, this.static_innerThr_d]);
			this.static_liThr.addItem(this.static_groupThr);
			this.static_liThr.addItem(this.static_inner_uiThr);//end
			//begin
			this.static_liFour = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupFour = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r5"></span>' + Can.msg.MODULE.MY_CONTACTS.VAL_ASSESSMENT
			});
			this.static_groupFour.el.attr('title', Can.msg.MODULE.MY_CONTACTS.VAL_ASSESSMENT);
			this.static_groupFour.el.attr("href", "javascript:;");
			this.static_inner_uiFour = new Can.ui.Panel({
				wrapEL: 'ul', cssName: 'stage hidden'
			});

			this.static_innerFour_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '216010',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.ASSESSMENT.VERY_HIGH + '</a>'
			});
			this.static_innerFour_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '216020',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.ASSESSMENT.HIGH + '</a>'
			});
			this.static_innerFour_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '216030',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.ASSESSMENT.MIDDLE + '</a>'
			});
			this.static_innerFour_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '216040',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.ASSESSMENT.LOW + '</a>'
			});
			this.static_innerFour_e = new Can.ui.Panel({
				wrapEL: 'li',
				id: '216050',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.ASSESSMENT.VERY_LOW + '</a>'
			});
			this.static_inner_uiFour.addItem([this.static_innerFour_a, this.static_innerFour_b, this.static_innerFour_c, this.static_innerFour_d, this.static_innerFour_e]);
			this.static_liFour.addItem(this.static_groupFour);
			this.static_liFour.addItem(this.static_inner_uiFour);//end
			//begin
			this.static_liFive = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupFive = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r6"></span>' + Can.msg.MODULE.MY_CONTACTS.CREDIT_RATING
			});
			this.static_groupFive.el.attr("title", Can.msg.MODULE.MY_CONTACTS.CREDIT_RATING);
			this.static_groupFive.el.attr("href", "javascript:;");
			this.static_inner_uiFive = new Can.ui.Panel({
				wrapEL: 'ul',
				cssName: 'stage hidden'
			});
			this.static_innerFive_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '217010',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CREDIT.VERY_HIGH + '</a>'
			});
			this.static_innerFive_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '217020',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CREDIT.HIGH + '</a>'
			});
			this.static_innerFive_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '217030',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CREDIT.MIDDLE + '</a>'
			});
			this.static_innerFive_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '217040',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CREDIT.LOW + '</a>'
			});
			this.static_innerFive_e = new Can.ui.Panel({
				wrapEL: 'li',
				id: '217050',
				html: '<a href="javascript:;">' + Can.msg.MODULE.MY_CONTACTS.CREDIT.VERY_LOW + '</a>'
			});
			this.static_inner_uiFive.addItem([this.static_innerFive_a, this.static_innerFive_b, this.static_innerFive_c, this.static_innerFive_d, this.static_innerFive_e]);
			this.static_liFive.addItem(this.static_groupFive);
			this.static_liFive.addItem(this.static_inner_uiFive);//end

			this.static_menu.addItem(this.static_liOne);
			this.static_menu.addItem(this.static_liTwo);
			this.static_menu.addItem(this.static_liThr);
			this.static_menu.addItem(this.static_liFour);
			this.static_menu.addItem(this.static_liFive);

			this.static_liOne.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});
			this.static_liTwo.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});
			this.static_liThr.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});
			this.static_liFour.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});
			this.static_liFive.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});

			//小项目点击触发器
			this.static_inner_uiOne.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"clientType": $(this).attr("id")});
				e.preventDefault();
			});
			this.static_inner_uiTwo.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"relationshipRanking": $(this).attr("id")});
				e.preventDefault();
			});
			this.static_inner_uiThr.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"cooperationCondition": $(this).attr("id")});
				e.preventDefault();
			});
			this.static_inner_uiFour.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"valueAssessment": $(this).attr("id")});
				e.preventDefault();
			});
			this.static_inner_uiFive.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"creditRating": $(this).attr("id")});
				e.preventDefault();
			});

		}
		else {
			//TODO 静态数据直接写源码和读语言名都不靠谱
			//begin
			this.static_liOne = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupOne = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r2"></span>Relation Ship'
			});
			this.static_groupOne.el.attr("href", "javascript:;");
			this.static_groupOne.el.attr('title', Can.msg.MODULE.MY_CONTACTS.RELATIONSHIP_LEVEL);
			this.static_inner_uiOne = new Can.ui.Panel({
				wrapEL: 'ul',
				cssName: 'stage hidden'
			});
			this.static_innerOne_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '110010',
				html: '<a href="javascript:;">Close</a>'
			});
			this.static_innerOne_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '110020',
				html: '<a href="javascript:;">Contract Stage</a>'
			});
			this.static_innerOne_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '110030',
				html: '<a href="javascript:;">Cooperation Stage</a>'
			});
			this.static_innerOne_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '110050',
				html: '<a href="javascript:;">Bad</a>'
			});
			this.static_inner_uiOne.addItem([this.static_innerOne_a, this.static_innerOne_b, this.static_innerOne_c, this.static_innerOne_d, this.static_innerOne_e]);
			this.static_liOne.addItem(this.static_groupOne);
			this.static_liOne.addItem(this.static_inner_uiOne);//end
			//begin
			this.static_liTwo = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupTwo = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r3"></span>Partner Ship'
			});
			this.static_groupTwo.el.attr("href", "javascript:;");
			this.static_groupTwo.el.attr('title', Can.msg.MODULE.MY_CONTACTS.PARTNER);
			this.static_inner_uiTwo = new Can.ui.Panel({
				wrapEL: 'ul',
				cssName: 'stage hidden'
			});
			this.static_innerTwo_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '111010',
				html: '<a href="javascript:;">Close</a>'
			});
			this.static_innerTwo_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '111020',
				html: '<a href="javascript:;">Contract Page</a>'
			});
			this.static_innerTwo_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '111030',
				html: '<a href="javascript:;">Cooperation Stage</a>'
			});
			this.static_innerTwo_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '111050',
				html: '<a href="javascript:;">Expiration of Contract Stage</a>'
			});
			this.static_inner_uiTwo.addItem([this.static_innerTwo_a, this.static_innerTwo_b, this.static_innerTwo_c, this.static_innerTwo_d]);
			this.static_liTwo.addItem(this.static_groupTwo);
			this.static_liTwo.addItem(this.static_inner_uiTwo);//end
			//begin
			this.static_liThr = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupThr = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r4"></span>Value Assessment'
			});
			this.static_groupThr.el.attr("href", "javascript:;");
			this.static_groupThr.el.attr('title', Can.msg.MODULE.MY_CONTACTS.VAL_ASSESSMENT_BUYER);
			this.static_inner_uiThr = new Can.ui.Panel({
				wrapEL: 'ul',
				cssName: 'stage hidden'
			});
			this.static_innerThr_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '112010',
				html: '<a href="javascript:;">Very High</a>'
			});
			this.static_innerThr_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '112020',
				html: '<a href="javascript:;">High</a>'
			});
			this.static_innerThr_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '112030',
				html: '<a href="javascript:;">Middle</a>'
			});
			this.static_innerThr_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '112040',
				html: '<a href="javascript:;">Low</a>'
			});
			this.static_innerThr_e = new Can.ui.Panel({
				wrapEL: 'li',
				id: '112050',
				html: '<a href="javascript:;">Very Low</a>'
			});
			this.static_inner_uiThr.addItem([this.static_innerThr_a, this.static_innerThr_b, this.static_innerThr_c, this.static_innerThr_d, this.static_innerThr_e]);
			this.static_liThr.addItem(this.static_groupThr);
			this.static_liThr.addItem(this.static_inner_uiThr);//end
			//begin
			this.static_liFour = new Can.ui.Panel({
				wrapEL: 'li'
			});
			this.static_groupFour = new Can.ui.Panel({
				wrapEL: 'a',
				cssName: 'bg-ico tit-retracting',
				html: '<span class="bg-ico c-r5"></span>Credit Rating'
			});
			this.static_groupFour.el.attr('title', Can.msg.MODULE.MY_CONTACTS.CREDIT_RATING_BUYER);
			this.static_groupFour.el.attr("href", "javascript:;");
			this.static_inner_uiFour = new Can.ui.Panel({
				wrapEL: 'ul',
				cssName: 'stage hidden'
			});

			this.static_innerFour_a = new Can.ui.Panel({
				wrapEL: 'li',
				id: '113010',
				html: '<a href="javascript:;">Very High</a>'
			});
			this.static_innerFour_b = new Can.ui.Panel({
				wrapEL: 'li',
				id: '113020',
				html: '<a href="javascript:;">High</a>'
			});
			this.static_innerFour_c = new Can.ui.Panel({
				wrapEL: 'li',
				id: '113030',
				html: '<a href="javascript:;">Middle</a>'
			});
			this.static_innerFour_d = new Can.ui.Panel({
				wrapEL: 'li',
				id: '113040',
				html: '<a href="javascript:;">Low</a>'
			});
			this.static_innerFour_e = new Can.ui.Panel({
				wrapEL: 'li',
				id: '113050',
				html: '<a href="javascript:;">Very Low</a>'
			});
			this.static_inner_uiFour.addItem([this.static_innerFour_a, this.static_innerFour_b, this.static_innerFour_c, this.static_innerFour_d, this.static_innerFour_e]);
			this.static_liFour.addItem(this.static_groupFour);
			this.static_liFour.addItem(this.static_inner_uiFour);//end

			this.static_menu.addItem(this.static_liOne);
			this.static_menu.addItem(this.static_liTwo);
			this.static_menu.addItem(this.static_liThr);
			this.static_menu.addItem(this.static_liFour);

			this.static_liOne.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});
			this.static_liTwo.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});
			this.static_liThr.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});
			this.static_liFour.el.click(function () {
				_this.fireEvent("STATIC_LiITEM_CLICK", this)
			});

			//小项目点击触发器
			this.static_inner_uiOne.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"relationshipLevel": $(this).attr("id")});
				e.preventDefault();
			});
			this.static_inner_uiTwo.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"partnerShip": $(this).attr("id")});
				e.preventDefault();
			});
			this.static_inner_uiThr.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"valueAssessmentBuyer": $(this).attr("id")});
				e.preventDefault();
			});
			this.static_inner_uiFour.el.delegate('li', 'click', function (e) {
				_this.fireEvent("STATIC_liItems_CLICK", {"creditRatingBuyer": $(this).attr("id")});
				e.preventDefault();
			});

		}

		this.group_li.addItem(this.cre_group);
		// this.ul_inner.addItem(this.group_li);
		this.mainLi.addItem(this.ul_inner);
		this.mainLi.addItem(this.group_li);
		this.ulNav.addItem(this.mainLi);

		this.ulNav.addItem(this.mainLi);
		this.siteNav.addItem(this.itemNav);
		this.itemNav.addItem(this.markCur);
		this.itemNav.addItem(this.ulNav);
		this.itemNav.addItem(this.static_menu);


		this.group_left.addItem(this.siteNav);

		this.loadMenu = function () {
			var _this = this;
			this.loadMenuUrl = Can.util.Config.seller.myContacterModule.MENUDATA;

			$.ajax({
				url: this.loadMenuUrl,
				data: null,
				cache: false,
				success: function (resultData) {
					var menuItem_list = [];
					_this.mainLi.el.find('.tit-all').remove();
					_this.ul_inner.el.empty();
					_this.allGroup = new Can.ui.Panel({wrapEL: 'a', cssName: 'tit-all cur', html: '<span class="bg-ico c-all"></span>' + Can.msg.MODULE.MY_CONTACTS.ALL_GROUP});
//                    console.log (resultData.data)
					_this.all_quantity = new Can.ui.Panel({wrapEL: 'em', html: '(' + resultData.data.countNumber + ')'});
					_this.allGroup.addItem(_this.all_quantity);
					//查看所有分组
					_this.allGroup.el.css('cursor', 'pointer')
						.click(function () {
							_this.fireEvent("UPDATE_GROUP_LIST", {});
							return false;
						});
					// _this.allGroup.addItem($('<span class="bg-ico ico-edit" role="group-manage" />'));
					_this.mainLi.el.prepend(_this.allGroup.el);
					if (resultData.data.groupList.length) {
						for (var m = 0; m < resultData.data.groupList.length; m++) {
							_this.menu_li = new Can.ui.Panel({wrapEL: 'li', html: '<a href="javascript:;" role="label">' + resultData.data.groupList[m].groupName + '</a>'});

							_this.menu_li.el.attr('role', 'group-item')
								.data('room', Can.util.room.checkin(resultData.data.groupList[m]));

							_this.menu_li.el.attr("id", resultData.data.groupList[m].groupId);
							_this.edit_icon = new Can.ui.Panel({wrapEL: 'a', cssName: 'bg-ico ico-edit'}).el.attr("href", "javascript:;");
							_this.close_icon = new Can.ui.Panel({wrapEL: 'a', cssName: 'bg-ico ico-close'}).el.attr("href", "javascript:;");
							_this.menu_li.addItem(_this.edit_icon);
							_this.menu_li.addItem(_this.close_icon);
							_this.ul_inner.el.append(_this.menu_li.el);
							_this.edit_icon.click(function () {
								_this.fireEvent("ON_MENU_EDIT", $(this).parent("li"))
							});
							_this.close_icon.click(function () {
								_this.fireEvent("ON_MENU_CLOSE", $(this).parent("li"))
							});
							menuItem_list.push(_this.menu_li)
						}

					}
					for (var l = 0; l < menuItem_list.length; l++) {
						menuItem_list[l].click(function () {
							_this.fireEvent("UPDATE_GROUP_LIST", {"groupId": this.el.attr("id")});
						});
					}
				}
			});

		};
		//内容容器
		this.content_right = new Can.ui.Panel({
			cssName: 'main', id: 'content_right'
		});
		//del_add toolbar
		this.toolbar = new Can.ui.Panel({
			cssName: 'opt-area', id: 'toolbar'
		});
		//上一页下一页按钮
		this.stepButton = new Can.view.stepBtnView({css: ['btn-prev', 'btn-next']});
		this.stepButton.start();
		this.stepBox = new Can.ui.Panel({
			cssName: 'mod-pagination-s2',
			items: this.stepButton.group
		});
		this.stepButton.onRightClick(function () {
			_this.fireEvent('onnextclick');
		});
		this.stepButton.onLeftClick(function () {
			_this.fireEvent('onprevclick');
		});
		//查询表单
		this.select_textFeild = new Can.view.findKeywordView({
			name: 'selsct-keyword',
			css: 'search-s2',
			Surl: Can.util.Config.seller.myContacterModule.mycontacter
		});
		this.select_textFeild.start();
		//设置查询按钮事件
		this.select_textFeild.searchBtn.click(function () {
			var selectVal = _this.select_textFeild.getValue();
			_this.setContacterData(_this.select_textFeild.Surl, {keywords: selectVal})
		});
		//全选选择框
		this.selectAllNav = $('<div class="fil-msg"></div>');
		this.selectAllFeild = new Can.ui.tick();
		this.selectAllFeild.applyTo(this.selectAllNav);
		this.selectAllFeild.on('ON_TICK', function (isChecked) {
			if (isChecked) {
				_this.fireEvent("ON_SELECT_ALL")
			}
			else {
				_this.fireEvent("CANCEL_SELECT_ALL")
			}
		}, this.selectAllFeild.el);
//        this.selectAllFeild.click(function () {
//
//        });
		this.delBtnNav = new Can.ui.Panel({cssName: 'item-opt'});
		this.delBtnFeild = new Can.ui.toolbar.Button({
			text: Can.msg.BUTTON.DELETE,
			cssName: 'btn btn-s12'
		});
		this.delBtnNav.addItem(this.delBtnFeild);
		this.delBtnFeild.click(function () {
			var selected_lists = _this.return_selected_contact();
			_this.fireEvent("ON_DELETE_CLICK", selected_lists)
		});
		this.addBtnNav = new Can.ui.Panel({cssName: 'item-opt'});
		//addtoBtn
		var _movebtn = false;
		this.addtoBtnFeild = new Can.ui.groupDropDownField({
			id: 'group_feild',
			cssName: 'group-button-box',
			blankText: Can.msg.MODULE.MY_CONTACTS.ADD_TO,
			add_url: Can.util.Config.seller.myContacterModule.newGroup,
			// keyUp_url: Can.util.Config.seller.myContacterModule.CHECK_GROUP_NAME,
			keyUp_url: Can.util.Config.contacts.group.validation,
			btnCss: 'btn btn-s12',
			btnTxt: Can.msg.MODULE.PRODUCT_FORM.GROUP_TEXT,
			items_url: Can.util.Config.seller.myContacterModule.MENUDATA,
			itemClick: function (oItem) {
				var order = oItem.attr('order');
				var val = this.valueItems[order];
				this.setValue(val);
				var select_ids = _this.return_selected_contact();
				var pram = "groupId=" + val;
				if (select_ids.length) {
					for (var p = 0; p < select_ids.length; p++) {
						pram += ("&customerId=" + select_ids[p])
					}
					if(!_movebtn){
						$.ajax({
							type: "POST",
							url: Can.util.Config.seller.myContacterModule.set_group,
							data: pram,
							beforeSend: function(){
								_movebtn = true;
							},
							complete: function(){
								_movebtn = false;
							},
							success: function(resultData){
								if (resultData.status == "success") {
									_this.selectAllFeild.unSelect();
									_this.setContacterData(Can.util.Config.seller.myContacterModule.mycontacter, {page: _this.page_feild.current});
		                            Can.util.notice(Can.msg.MODULE.MY_CONTACTS.SET_GROUP_TIPS);
								}
							}
						});
					}
					
					/*$.get(Can.util.Config.seller.myContacterModule.set_group, pram, function (resultData) {
						if (resultData.status == "success") {
							_this.selectAllFeild.unSelect();
							_this.setContacterData(Can.util.Config.seller.myContacterModule.mycontacter, {page: _this.page_feild.current});
                            Can.util.notice(Can.msg.MODULE.MY_CONTACTS.SET_GROUP_TIPS);
						}
					})*/
				}
				else {
                    Can.util.notice(Can.msg.MODULE.MY_CONTACTS.SELECT_SOMEONE);
				}
			},
			add_callback: function () {
				_this.loadMenu();
				_this.addtoBtnFeild.set_items();
			}
		});
		this.addtoBtnFeild.set_items();
		this.addBtnNav.addItem(this.addtoBtnFeild);
		this.addtoBtnFeild.click(function () {
			//获取选择中的产品的ID并传到后台
			//var selectid=null;
			_this.fireEvent("ON_ADDTOBTN_CLICK", this)
		});
		this.addBtnNav.addItem(this.addtoBtnFeild);

		this.toolbar.addItem(this.stepBox);
		this.toolbar.addItem(this.select_textFeild.el);
		this.toolbar.addItem(this.selectAllNav);
		this.toolbar.addItem(this.delBtnNav);
		this.toolbar.addItem(this.addBtnNav);
		this.content_right.addItem(this.toolbar);


		var colgroup, thead
			, tableClass = ''
			;

		if (role === 'buyer') {
			tableClass = '-cgs';
			colgroup = ['w36', '', 'w120', 'w100', 'w120', 'w120'];
			thead = [
				'<div class="th-gap"></div>',
				'<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.CONTACTER + '</div>',
				'<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.MATCH + '</div>',
				'<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.LATEST_CONTACT + '</div>',
				'<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.PRIVACY + '</div>',
				'<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.OPERATE + '</div>'
			];
		} else {
			colgroup = ['w36', '', 'w120', 'w50', 'w100', 'w120', 'w110'];
			thead = ['<div class="th-gap"></div>', '<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.CONTACTER + '</div>', '<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.MATCH + '</div>', '', '<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.SETTING + '</div>', '<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.LATEST_CONTACT + '</div>', '<div class="th-gap">' + Can.msg.MODULE.MY_CONTACTS.OPERATE + '</div>'];
		}
		this.tableNav = new Can.ui.tableList({
			cssName: 'mod-table tbl-contacter' + tableClass,
			data: {
				col: colgroup,
				head: thead,
				item: []
			}
		});
		this.page_mod = $('<div class=""></div>');
		this.page_feild = new Can.ui.limitButton({
			cssName: 'ui-page fr',
			showTotal: true
		});
		this.page_mod.append(this.page_feild.el);
		this.content_right.addItem(this.tableNav);
		this.content_right.addItem(this.page_mod);
		this.mod_container.addItem(this.group_left);
		this.mod_container.addItem(this.content_right);
		//主容器添加入页面
		this.mod_container.applyTo(this.contentEl);
	},
	showLoading: function () {
		if (!this.loadingBar) {
			this.loadingBar = $('<div class="loading"><span></span>' + Can.msg.LOADING + '</div>');
			this.loadingBar.appendTo(this.contentEl);
		}
		this.loadingBar.show();
	},
	hideLoading: function () {
		this.loadingBar && this.loadingBar.hide();
	},
	setContacterData: function (sURL, postDate) {
		var _this = this;
		//_this.showLoading();
		$.ajax({
			url: sURL,
			data: postDate,
			cache: false,
			dataType: 'JSON',
			success: function (returnData) {
				if (returnData.status && returnData.status === 'success') {
					_this.fireEvent('ON_LOAD_DATA', returnData);
				}
				else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, returnData);
				}
				_this.hideLoading();
			}
		});
	},
	//没有联系人时显示
	create_NoContact: function () {
		var me = this;
		var noContact = $('<div class="fil-none">' +
			'<p class="txt2">' + Can.msg.MODULE.MY_CONTACTS.NOT_CONTACT + '</p>' +
			'<p class="txt3">' + Can.msg.MODULE.MY_CONTACTS.TRY_AGAIN + '</p>' +
			'</div>');
		var noContactBtn = $('<a class="btn btn-s10 btn-add-product">' + Can.msg.MODULE.MY_CONTACTS.VIEW_ALL + '</a>');
		noContactBtn.click(function () {
			me.fireEvent("View_All")
		});
		noContact.append(noContactBtn);
		return noContact;
	},
	//清除菜单内容
	removeAllMenu: function () {
		this.ul_inner.el.find("li[id]").remove();
		this.addtoBtnFeild.el.find("li[order]").remove();

	},
	//更新菜单项的方法
	update_Item: function (obj) {
		var _this = this;
		for (var i = 0; i < obj.length; i++) {
			this.add_li = new Can.ui.Panel({
				wrapEL: 'li',
				html: '<a href="javascript:;" role="label">' + obj[i].groupName + '</a>'
			});
			_this.add_li.el.attr('role', 'group-item')
				.data('room', Can.util.room.checkin(obj[i]));
			this.add_li.el.attr("id", obj[i].groupId);
			this.add_edit = new Can.ui.Panel({wrapEL: 'a', cssName: 'bg-ico ico-edit'}).el.attr("href", "javascript:;");
			this.add_close = new Can.ui.Panel({wrapEL: 'a', cssName: 'bg-ico ico-close'}).el.attr("href", "javascript:;");
			this.add_li.addItem(this.add_edit);
			this.add_li.addItem(this.add_close);
			this.ul_inner.el.prepend(this.add_li.el);
			this.add_edit.click(function () {
				_this.fireEvent("ON_MENU_EDIT", $(this).parent("li"))
			});
			this.add_close.click(function () {
				_this.fireEvent("ON_MENU_CLOSE", $(this).parent("li"))
			});
		}
		_this.addtoBtnFeild.update_Item(obj);
	},
	//更新联系人总数方法
	reload_unread_number: function () {
		var me = this;
		$.get(this.loadMenuUrl, null, function (resultData) {
			me.ulNav.el.find("em").html('(' + resultData.data.countNumber + ')')
		})
	},
	//翻页的方法
	turnPage: function () {
		var me = this;
		this.page_feild.onChange(function (stmp) {
			me.setContacterData(Can.util.Config.contacts.list, {page: stmp});
		})
	},
	//返回选中的联系人ID
	return_selected_contact: function () {
		var lists = [];
		var selected_items = this.tableNav.tbody.find("input[type='checkbox']");
		for (var l = 0; l < selected_items.length; l++) {
			if (selected_items[l].checked) {
				lists.push($(selected_items[l]).parents("tr").find(".ico-chk").data("customerid"));
			}
		}
		return  lists;
	}
});
