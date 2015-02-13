/**
 * @Author: sam
 * @Version: 2.2
 * @Since: 13-5-1
 */

$.moduleAndViewAction('productManageModuleId', function (productManage) {
	productManage.turnPage();

	productManage.on("ON_LOAD_GROUP_DATA", function ($li) {
		$.ajax({
			url: Can.util.Config.seller.manageProduct.productList,
			data: $li ? {productGroupId: $li.attr('id')} : null,
			cache: false,
			success: function (resultData) {
				if (resultData.status == "success") {
					resultData.page.page = 1;
					productManage.select_textFeild.setValue('');
					productManage.tableNav.emptyTips = productManage.dataEmpty;
					productManage.fireEvent('ON_LOAD_DATA', resultData.data, resultData.page);
				} else {
					Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, resultData);
				}
			}
		});
	});

	productManage.on('ON_MENU_EDIT', function (liObj) {
		var text = liObj.find("a").eq(0).text().split("(")[0];
		productManage.clone_li_input = $('<input type="text" value="' + text + '" class="ipt" name="' + text + '">');
		//productManage.clone_li_btn = $('<a class="btn-save" href="javascript:;">' + Can.msg.BUTTON.SAVE + '</a>');
		liObj.clone().html('').append(productManage.clone_li_input).insertAfter(liObj);
		liObj.hide();

		productManage.clone_li_input
			.focus(function () {
				this.select();
			})
			.focus().blur(function () {
				var new_text = $(this).parent().find("input").val();
				var group_id = $(this).parent().attr("id");
				var maxLength = 35;//分组名最大长度 待定
				if ($.trim(new_text) == text) {
					$(this).parent("li").remove();
					liObj.show();
				}
				else {
					if (new_text == "") {
//                        tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.NOT_NULL);
//                        tipBox.show();
//                        setTimeout(function () {
//                            tipBox.hide();
//                        }, 1500);
						Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.NOT_NULL);
						return;
					}
					else if (new_text.length > maxLength) {
//                        tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.LONG);
//                        tipBox.show();
//                        setTimeout(function () {
//                            tipBox.hide();
//                        }, 1500);
						Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.LONG);
						return;
					}
					var _me = this;
					$.ajax({
						url: productManage.modifyMenu_url,
						data: {
							groupNames: $.trim(new_text),
							groupIds: group_id
						},
						type: 'POST',
						success: function (result) {
							if (result.status == "success") {
								var quantity = liObj.find("a").eq(0).text().split("(")[1];
								liObj.find("a").eq(0).text(new_text + "(" + quantity);
								$(_me).parent("li").remove();
								productManage.removeAllMenu();
								productManage.update_Item(result.data);
								//重新加载产品列表
								$.ajax({
									url: Can.util.Config.seller.manageProduct.productList,
									success: function (resultData) {
										if (resultData.status == "success") {
											productManage.fireEvent('ON_LOAD_DATA', resultData.data, resultData.page);

										} else {
											Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, resultData);
										}
									}
								});
//                                tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.EDIT_GROUP);
								Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.EDIT_GROUP);
							}
							else {
								Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.EDIT_GROUP_FAIL);
							}
						}
					});
				}
			});
	});

	productManage.on('ON_MENU_CLOSE', function (liObj) {
		var _confirm = new Can.view.confirmWindowView({
			id: 'productGroupDelConfirm',
			width: 280
		});
		_confirm.setContent('<div class="error-box" >' +
			Can.msg.DELETE_CONFIRM +
			'</div>');
		_confirm.show();

		_confirm.onOK(function () {
			$.ajax({
				url: Can.util.Config.seller.manageProduct.deleteGroup,
				data: {groupIds: liObj.attr("id")},
				type: 'POST',
				success: function (resultData) {
//                    tipBox.show();
//                    setTimeout(function () {
//                        tipBox.hide();
//                    }, 1500);
					if (resultData.status == "success") {
						productManage.removeAllMenu();
						productManage.update_Item(resultData.data);
//                        tipBox.update();
						Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.DEL_TIPS);
						//重新加载产品列表
						$.ajax({
							url: Can.util.Config.seller.manageProduct.productList,
							success: function (resultData) {
								if (resultData.status == "success") {
									productManage.fireEvent('ON_LOAD_DATA', resultData.data, resultData.page);
								}
							}
						});
					}
					else if (resultData.errorCode == "3003") {
//                        tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.DELETE_ERROR);
						Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.DELETE_ERROR);
					} else {
//                        tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.DELETE_FAIL);
						Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.DELETE_FAIL);
					}
				}
			});
		})
	});

	productManage.on('ON_LOAD_DATA', function (aData, aPage) {
		if (!aPage) {
			aPage = {
				page: 0,
				maxPage: 0,
				total: 0,
				pageSize: 0
			}
		}
		var _this = this;
		var groupData = aData.productGroups;
		var groupLength = aData.productGroups.length;
		var productList = aData.list;
		var group_labelItems = [];
		var group_valueItems = [];
		productManage.page_num = aPage.page;
		productManage.page_maxPage = aPage.maxPage;
		productManage.page_totalItem = aPage.total;
		productManage.page_pageSize = aPage.pageSize;
		productManage.page_titleList.length = 0;
		productManage.page_ids.length = 0;
		for (var p = 0; p < productList.length; p++) {
			productManage.page_titleList.push(productList[p].productName);
			productManage.page_ids.push(productList[p].productId);
		}
		for (var i = 0; i < groupLength; i++) {
            if(groupData[i].groupId == -1) groupData[i].groupName = Can.msg.MODULE.PRODUCT_MANAGE.NOT_GROUP;
			group_valueItems.push(groupData[i].groupId);
			group_labelItems.push(groupData[i].groupName);
		}
		this.addtoBtnFeild.updateOptions({
			labelItems: group_labelItems,
			valueItems: group_valueItems
		});

		//顶部分页的处理
		if (aPage.page > 1) {
			productManage.stepButton.group[0].el.removeClass("dis");
		}
		else {
			productManage.stepButton.group[0].el.addClass("dis")
		}
		if (aPage.page < aPage.maxPage) {
			productManage.stepButton.group[1].el.removeClass("dis")
		}
		else {
			productManage.stepButton.group[1].el.addClass("dis")
		}

		productManage.page_feild.el.show();
		if (aData.list.length) {
			var dataTable = this.tableNav;
			var aReturnData = [];
			this.groupFields = [];
			var pData;
			for (var i = 0; i < aData.list.length; i++) {
				pData = aData.list[i];
				var poductId = pData.productId;
				aReturnData[i] = [];
				//select feild
				var selectNav = $('<input type="checkbox" name="product" style="margin-top: 0;" id="' + pData.productId + '">');
				selectNav.click(function () {
					if (!($(this).is(":checked"))) {
						$("input[id='selectAll']").attr("checked", false);
					}
				});
				//PIC&INFO
				var picNav = new Can.ui.Panel({
					cssName: 'pic'
				});
				var picA = $('<a href="javascript:;">' + Can.util.formatImage(pData.productLogoUrl, '120x120', '', pData.productName) + '</a>');
				picNav.el.attr({
					productId: pData.productId,
					productNM: pData.productName,
					title: pData.productName,
					current_id: i + 1
				});
				picNav.click(function () {
					productManage.fireEvent('ON_PRODUCT_CLICK', {name: this.el.attr('productNM'), id: this.el.attr("productId"), current_id: this.el.attr("current_id")});
				});
				picNav.addItem(picA);
				var infoNav = new Can.ui.Panel({
					cssName: 'txt-info-s1'
				});
				var nameNav = new Can.ui.Panel({
					wrapEL: 'h3',
					html: '<a href="javascript:;">' + pData.productName + '</a>'
				});
				if (pData.newest) {
					nameNav.addItem('<span class="ico-new" cantitle="' + Can.msg.CAN_TITLE.NEW_PRODUCT + '"></span>');
				}
				nameNav.el.attr({
					"productId": pData.productId,
					"productNM": pData.productName,
					current_id: i + 1
				});
				nameNav.on('onclick', function () {
					productManage.fireEvent('ON_PRODUCT_CLICK', {name: this.el.attr('productNM'), id: this.el.attr('productId'), current_id: this.el.attr('current_id')});
				});
				var ortherInfo = $('' +
					(pData.minOrder ? '<p class="txt-tit"> ' + Can.msg.MODULE.PRODUCT_MANAGE.MIN_ORDER + '<em>' + pData.minOrder + pData.minOrderUnit + '</em></p>' : '') +
					(pData.fobPriceTo ? '<p class="txt-tit"> ' + Can.msg.MODULE.PRODUCT_MANAGE.FOB_PRICE + '<em>' + pData.monetaryUnit + ' ' + pData.fobPriceFrom + ' - ' + pData.fobPriceTo + ' / ' + pData.fobUnit + '</em></p>' : '') +
					(pData.payMethods ? '<p class="txt-tit"> ' + Can.msg.MODULE.PRODUCT_MANAGE.PAYMENT + '<em>' + pData.payMethods + '</em></p>' : '') +
					(pData.monthSupply ? '<p class="txt-tit"> ' + Can.msg.MODULE.PRODUCT_MANAGE.SUPPLY + '<em>' + pData.monthSupply + pData.msUnit + '</em></p>' : ''));
				var _container = new Can.ui.Panel({
					cssName: 'mod-pro'
				});
				infoNav.addItem([nameNav, ortherInfo]);
				_container.addItem([picNav, infoNav]);
				/*Groups*/
				var _groupsNav = new Can.ui.Panel({
					cssName: 'mod-sel'
				});
				var product_id = pData.productId;
				var label = group_labelItems;
				var value = group_valueItems;
				var group_blankText = Can.msg.MODULE.PRODUCT_MANAGE.NOT_GROUP,
					group_value = '';
				for (var m = 0; m < groupLength; m++) {
					if (groupData[m].groupId == pData.groupId) {
						group_blankText = groupData[m].groupId == -1 ? Can.msg.MODULE.PRODUCT_MANAGE.NOT_GROUP :groupData[m].groupName;
						group_value = groupData[m].groupId;
						label = group_labelItems.slice(0, m).concat(group_labelItems.slice(m + 1));
						value = group_valueItems.slice(0, m).concat(group_valueItems.slice(m + 1));
					}
				}
				this.item_group = new Can.ui.groupDropDownField({
					id: 'group_field',
					cssName: 'table-groups-btn',
					update_btn_txt: true,
					valueItems: value,
					labelItems: label,
					btnCss: 'btn btn-s12',
					btnTxt: Can.msg.MODULE.PRODUCT_MANAGE.CREATE_GROUP,
					blankText: group_blankText,
					value: group_value,
					add_url: Can.util.Config.seller.manageProduct.CREATE_MENU,
					keyUp_url: Can.util.Config.seller.manageProduct.CHECK_GROUP_NAME,
					add_callback: function (data) {
						var g;
						_this.addtoBtnFeild.el.find("li[order]").remove();
						_this.addtoBtnFeild.update_Item(data);
						for (g = 0; g < _this.groupFields.length; g++) {
							_this.groupFields[g].el.find("li[order]").remove();
						}
						for (g = 0; g < _this.groupFields.length; g++) {
							_this.groupFields[g].update_Item(data);
						}
						_this.deleteLeftMenuItem();
						_this.loadMenu();
					},
					itemClick: function (oItem) {
						var order = oItem.attr('order');
						var val = this.valueItems[order];
						this.setValue(val);
						var pram = "productIds=" + oItem.parents("div.table-groups-btn").attr("productid") + "&productGroupId=" + val;
						var that = this;
						$.ajax({
							url: Can.util.Config.seller.manageProduct.itemSetGroup,
							data: pram,
							type: 'POST',
							success: function (data) {
								if (data.status && data.status == "success") {
									if (_this.selectAll.attr("checked")) {
										_this.selectAll.attr("checked", false)
									}
									var tip = Can.msg.MODULE.PRODUCT_MANAGE.MULTI_SET_GROUP.replace("[@]", that.labelEL.text());
									//由于组内邮件个数改变，需要重新加载菜单。
									_this.deleteLeftMenuItem();
									_this.loadMenu();
									_this.reload_currentGroup();
									Can.util.notice(tip);
//                                    tipBox.update(tip);
//                                    tipBox.show();
//                                    setTimeout(function () {
//                                        tipBox.hide();
//                                    }, 1500)
								} else {
//                                    tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.SET_GROUP_FAIL);
//                                    tipBox.show();
//                                    setTimeout(function () {
//                                        tipBox.hide();
//                                    }, 1500)
									Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.SET_GROUP_FAIL);
								}
							}
						});
					}
				});
				this.item_group.el.attr("productId", product_id);
				this.groupFields.push(this.item_group);
				_groupsNav.addItem(this.item_group);
				/*modified*/
				var _modifyNav = new Can.ui.Panel({
					wrapEL: 'span',
					cssName: 'time',
					html: pData.updateTime
				});
				_modifyNav.el.css("style", "valign:top");
				/*action*/
				var _action = new Can.ui.toolbar.Button({
					cssName: 'bg-ico ico-trail'
				});
				_action.el.attr({
					"productId": pData.productId,
					"cantitle": Can.msg.CAN_TITLE.MODIFY
				});
				_action.on('onclick', function () {
					productManage.fireEvent('ON_EDIT_PRODUCT', this);
				}, pData);

                /* copy action  */
                var _copyAction = new Can.ui.toolbar.Button({
                    cssName: 'icons copy'
                });
                _copyAction.el.attr({
                    "productId": pData.productId,
                    "cantitle": Can.msg.CAN_TITLE.COPY
                });

                _copyAction.on('onclick',function(){
                    productManage.fireEvent('ON_COPY_PRODUCT', this);
                },pData);

                var _actionContainer = new Can.ui.Panel({});
                _actionContainer.addItem([_action,_copyAction]);

				aReturnData[i].push(selectNav);
				aReturnData[i].push(_container.el);
				aReturnData[i].push(_groupsNav.el);
				aReturnData[i].push(_modifyNav.el);
				aReturnData[i].push(_actionContainer.el);
			}
			dataTable.data['item'] = aReturnData;
			dataTable.update();

			if (productManage.page_feild) {
				if (aPage) {
					Can.apply(productManage.page_feild, {
						current: aPage.page || 1,
						total: aPage.total,
						limit: aPage.pageSize
					});
				}
				productManage.page_feild.refresh();
			}
			var hideDelIcoTime = false;
			productManage.delIco.hover(function () {
				if (hideDelIcoTime) {
					clearTimeout(hideDelIcoTime);
				}
				productManage.delIco.show();
			}, function () {
				if (hideDelIcoTime) {
					clearTimeout(hideDelIcoTime);
				}
				productManage.delIco.hide();
			});
			productManage.tableNav.tbody.find("tr").hover(function () {
				if (hideDelIcoTime) {
					clearTimeout(hideDelIcoTime);
				}
				$(this).attr("id", $(this).find("input[type='checkbox']").attr("id"));
				$(this).addClass('hover');
				productManage.delIco.css({
					top: $(this).offset().top,
					left: $(this).offset().left + $(this).width()
				});
				productManage.delIco.show();
				productManage.delIco.data("obj", $(this).attr('id'));
			}, function (e) {
				if (hideDelIcoTime) {
					clearTimeout(hideDelIcoTime);
				}
				var that = this;
				var t = e.relatedTarget;
				if (t != undefined && t.tagName == 'A') {
					var row = that;
					$(t).mouseout(function () {
						productManage.delIco.hide();
						$(row).removeClass('hover');
					});
					return;
				}
				$(that).removeClass('hover');
				hideDelIcoTime = setTimeout(function () {
					productManage.delIco.hide();
				}, 500);
			});
		}
		else {
			//搜索没有结果的显示
			this.tableNav.data['item'] = [];
			this.tableNav.update();
			//console.log(this.tableNav)
			productManage.page_feild.el.hide();
		}
	});

	productManage.on('ON_CLOSE_CLICK', function () {
		var me = productManage;
		var id = me.delIco.data("obj");

		var _confirm = new Can.view.confirmWindowView({
			id: 'productManageModuleDelConfirm',
			width: 280
		});
		_confirm.setContent('<div class="error-box" >' +
			Can.msg.DELETE_CONFIRM +
			'</div>');

		_confirm.onOK(function () {
			$.ajax({
				url: Can.util.Config.seller.manageProduct.deleteProduct,
				data: "productIds=" + id,
				type: 'POST',
				success: function (resultData) {
					if (resultData.status && resultData.status == "success") {
						//me.tableNav.tbody.find("tr[id="+id+"]").remove();
						me.delIco.fadeOut();
						productManage.removeAllMenu();
						$.ajax({
							url: Can.util.Config.seller.manageProduct.groupData,
							success: function (pData) {
								productManage.update_Item(pData.data);
							}
						});
						productManage.setProductData(Can.util.Config.seller.manageProduct.productList, {page: 1});
//                        tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.DEL_TIPS);
//                        tipBox.show();
//                        setTimeout(function () {
//                            tipBox.hide();
//                        }, 1500)
						Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.DEL_TIPS);
					}
					else {
//                        tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.DELETE_FAIL);
//                        tipBox.show();
//                        setTimeout(function () {
//                            tipBox.hide();
//                        }, 1500)
						Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.DELETE_FAIL);
					}
				}
			})
		});
		_confirm.show();
	});

	productManage.on('ON_PRODUCT_CLICK', function (pobj) {
		var turnPageObj = {
			page_num: productManage.page_num,
			page_maxPage: productManage.page_maxPage,
			page_totalItem: productManage.page_totalItem,
			page_pageSize: productManage.page_pageSize,
			page_currentItem: parseInt(pobj.current_id),
			page_titleList: productManage.page_titleList,
			page_pageIds: productManage.page_ids
		};
		Can.util.canInterface('productDetail', [pobj.id, pobj.name , 'productManageModuleId', turnPageObj, true]);
	});

	productManage.on('ON_ADDPRODUCT_CLICK', function () {
		$('#addPrdBtnId').trigger('click');
	});

	productManage.on('ON_VIEWSTATISTICS_CLICK', function () {
		$('#prdCountBtnId').trigger('click');
	});

	productManage.on('ON_DELECTBTN_CLICK', function () {
		var checkboxES = productManage.tableNav.el.find("input[name='product']");
		if (checkboxES.length) {
			var $product_checked = checkboxES.filter(":checked");
			if ($product_checked.size()) {
				var pramp = "";
				$product_checked.each(function (i, t) {
					pramp += "productIds=" + $(t).attr("id") + "&";
				});

				pramp += "status=-3";
				var id = productManage.delIco.data("obj");

				var _confirm = new Can.view.confirmWindowView({
					id: 'productManageModuleDelConfirm',
					width: 280
				});
				_confirm.setContent('<div class="error-box" >' +
					Can.msg.DELETE_CONFIRM +
					'</div>');
				_confirm.onOK(function () {
					$.ajax({
						url: Can.util.Config.seller.manageProduct.deleteProduct,
						data: pramp,
						type: 'POST',
						success: function (data) {
							if (data.status && data.status == "success") {
								//如果全选按钮是选中的，取消
								if (productManage.selectAll.is(":checked")) {
									productManage.selectAll.attr("checked", false);
								}
								//删除所选择中的内容
								$product_checked.each(function (i, item) {
									//alert($(item).attr("id"))
									$(item).parents("tr").remove();
								});
//                                tipBox.update(Can.msg.MODULE.PRODUCT_MANAGE.DEL_TIPS);
//                                tipBox.show();
//                                setTimeout(function () {
//                                    tipBox.hide();
//                                }, 1500);
								Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.DEL_TIPS);
								productManage.removeAllMenu(Can.msg.MODULE.PRODUCT_MANAGE.DEL_TIPS);
								$.ajax({
									url: Can.util.Config.seller.manageProduct.groupData,
									success: function (pData) {
										productManage.update_Item(pData.data);
									}
								});
								productManage.setProductData(Can.util.Config.seller.manageProduct.productList, {page: 1});
							}
							else {
								Can.util.EventDispatch.dispatchEvent('ON_ERROR_HANDLE', this, data);
							}
						}
					})
				});
				_confirm.show();
			}
			else {
				var tip = Can.msg.MODULE.PRODUCT_MANAGE.CHECKED_TIPS;
//                tipBox.update(tip);
//                tipBox.show();
//                setTimeout(function () {
//                    tipBox.remove();
//                }, 1500)
				Can.util.notice(tip)
			}
		}
	});
	
	var _xsetnewpro = false;
	productManage.on('ON_MARK_NEW_CLICK', function (moduleObj) {
		var checkedList = moduleObj.tableNav.tbody.find("input[type='checkbox']");
		if (checkedList.filter(":checked").size()) {
			var pram = [];
			checkedList.filter(":checked").each(function (i, t) {
				pram.push($(t).attr("id"));
			});

			if(!_xsetnewpro){
				$.ajax({
					url: Can.util.Config.seller.manageProduct.markNew,
					data: Can.util.formatFormData({productIds: pram}),
					type: 'POST',
					beforeSend: function(){
						_xsetnewpro = true;
					},
					complete: function(){
						_xsetnewpro = false;
					},
					success: function (data) {
						var tip = Can.msg.MODULE.PRODUCT_MANAGE.MARK_SUCCESS;
						if (moduleObj.selectAll.attr("checked"))  moduleObj.selectAll.attr("checked", false);
						if (data.status && data.status == "success") {
							checkedList.filter(":checked").each(function (i, t) {
								$(t).parents("tr").find("h3").not(":has(span)").append($('<span class="ico-new"></span>'));
								$(t).attr("checked", false);
							});
							Can.util.notice(tip);
						} else {
							Can.util.notice(Can.msg.MODULE.PRODUCT_MANAGE.MARK_FAIL)
						}
					}
				});
			}
			
		} else {
			// 选择产品提示
			var tip = Can.msg.MODULE.PRODUCT_MANAGE.CHECKED_TIPS;
			Can.util.notice(tip);
//            tipBox.update(tip);
//            tipBox.show();
//            setTimeout(function () {
//                tipBox.remove();
//            }, 1500)
		}
	});

	productManage.on('ON_EDIT_PRODUCT', function (productObj) {
		//$('#mdfProductFromId').remove();
		Can.importJS(['js/seller/view/mdfProductModule.js']);
		var mdfProductModule = new Can.module.mdfProductModule();
		$('#' + mdfProductModule.id).remove();
		Can.Application.putModule(mdfProductModule);
		mdfProductModule.start();
		mdfProductModule.updateTitle(productObj.productName);
        mdfProductModule.isCopyAction = 0; // 标记是点击复制按钮跳转的
		mdfProductModule.setData(productObj.productId);
		mdfProductModule.show();

	});

    // 复制产品
    productManage.on('ON_COPY_PRODUCT',function(productObj){
        Can.importJS(['js/seller/view/mdfProductModule.js']);
        var mdfProductModule = new Can.module.mdfProductModule();
        $('#' + mdfProductModule.id).remove();
        Can.Application.putModule(mdfProductModule);
        mdfProductModule.start();
        mdfProductModule.updateTitle(productObj.productName);
        mdfProductModule.isCopyAction = 1; // 标记是点击复制按钮跳转的
        mdfProductModule.setData(productObj.productId);
        mdfProductModule.show();
    });

	//下一页
	productManage.on('onnextclick', function () {
		if (productManage.stepButton.group[1].el.is('.dis')) {
			return;
		}
		productManage.page_feild.current += 1;
		if (productManage.page_feild.current < productManage.page_feild.total) {
			productManage.page_feild.refresh();
			productManage.page_feild.fireEvent('ON_CHANGE', productManage.page_feild.current);
			productManage.stepButton.group[0].el.removeClass("dis");
		} else {
			productManage.stepButton.group[1].el.addClass("dis");
		}
	});

	productManage.on('onprevclick', function () {
		if (productManage.stepButton.group[0].el.is('.dis')) {
			return;
		}
		//上一页
		productManage.page_feild.current -= 1;

		if (productManage.page_feild.current > 0) {
			productManage.page_feild.refresh();
			productManage.page_feild.fireEvent('ON_CHANGE', productManage.page_feild.current);
			if (productManage.page_feild.current == 1) {
				productManage.stepButton.group[0].el.addClass("dis");
			}
			else {
				productManage.stepButton.group[1].el.removeClass("dis");
			}
		}
		else {
			productManage.stepButton.group[0].el.addClass("dis");
		}
	});

	productManage.on('group-manage', function () {
		// productManage.contentEl.on('click', '[role=group-manage]', function(e){
		var menu_group = productManage.ul_inner.el,
			sortClass = 'op-rank',
			groups = menu_group.children(),
			$this = productManage.group_edit,
			submit = $this.data('submit');

		if (!submit) {
			submit = $('<a href="javascript:;" class="btn-save btn-submit">' + Can.msg.BUTTON.SAVE + '</a>');
			$this.data('submit', submit);
			submit.insertAfter(menu_group);
		}

		groups.each(function () {
			var menu = $(this),
				data = Can.util.room[menu.data('room')],
				input = data.input;

			if (!input) {
				input = $('<input type="text" class="ipt" value="' + data.groupName + '" data-id="' + data.groupId + '">');
				data.input = input;
				input.appendTo(menu);
			} else {
				input.show();
			}

			menu.find('a').hide();
		});
		menu_group.addClass(sortClass);

		submit.click(function () {
			/*
			 /supproductgroup/batchUpdateGroupSortAndName.cf?items=1,name&items=2,name& items =4, name
			 */
			var param = [];

			menu_group.find('input').each(function () {
				var item = $(this);

				param.push('items=' + item.data('id') + ',' + item.val());
			});

			$.ajax({
				url: Can.util.Config.seller.manageProduct.batchUpdateGroup,
				data: param.join('&'),
				type: 'POST',
				success: function (d) {
					productManage.update_Item(d.data);
					/*
					 menu.find('a').show();
					 menu.find('[role=label]').text(value);
					 input.hide();
					 menu_group.removeClass(sortClass);
					 */
				}
			});
		});
	});

});
