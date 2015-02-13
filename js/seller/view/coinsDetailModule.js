/**
 * mySettingProfileView view
 * Created by 
 * Date: 
 */
 ;(function(Can, module){
 	'use strict';
 	//加载双向绑定模板引擎
    Can.importJS([
        'js/framework/utils/two-way-tpl.js'
    ]);
    var template = Can.util.TWtemplate;

    //配置别名
    var oConfig = Can.util.Config.seller;

    module.coinsDetailModule = Can.extend(module.BaseModule, {
    	title: Can.msg.MODULE.COINS_DETAIL.TITLE,
        id: 'coinsDetailModuleId',
        constructor: function(cfg){
            Can.apply(this, cfg || {});
            module.coinsDetailModule.superclass.constructor.call(this);
            this._isShowLoad = true;
            this._isInit = false;
            this._xTime = false;
            this._isSend = false;
        },
        actIndex: function(){
            var self = this;
            template.load('js/seller/view/coinsDetailModule.html', function(tpl){
                self.onTplReady(tpl);
            });
        },
        onTplReady: function(tpl){
        	var self = this;

            this._tpl  = tpl;
            this._$Tpl = $(tpl);

            //开始渲染主内容
            var $Content = this.contentEl;
            $Content.html(
                self._$Tpl.find('#content-tpl').html()
            );

            var oAnt = template($Content, {
                partials: {
                	isShowLoad: self._isShowLoad,
                    tool: self._$Tpl.find('#tool-tpl').html()
                },
                events: {
                    render: function(){
                        self.onRender(this);
                    },
                    update: function(){
                        //self.onUpdate(this);
                    }
                }
            });
        },
        //模板渲染完成
        onRender: function(oAnt){
        	var self = this;

        	var $Title = this.titleContainerEL;
            $Title.html(
            	self._$Tpl.find('#total-tpl').html()
            );

            var oAntTitle = template($Title);

            
            var fSearch = function(page){
            	if(self._xTime){
            		clearTimeout(self._xTime);
            	}

            	var fSend = function(){
            		var _startTime = oAnt.el.find('#startTime').val();
            		if(self._isInit){
            			_startTime = "";
            		}
            		
	            	var _endTime = oAnt.el.find('#endTime').val();
	            	var _type = oAnt.el.find('#coinsType').val();
	            	var _page = page || oAnt.el.find('[paging]').attr('page-current');

	            	oAnt.set('isShowLoad', self._isShowLoad);
	            	
	            	$.ajax({
		        		url:oConfig.coinsDetail,
		        		cache: false,
		        		data:{"beginTime":_startTime, "endTime":_endTime, "virtualMoneyCategory":_type, "page": _page, "pageSize":15},
		                success: function(jData){

		                	self._isShowLoad = false;
		                	oAnt.set('isShowLoad', self._isShowLoad);

		                	if(jData.status && jData.status==="success"){
		                		var oData = jData.data;
		                		oData.page = {
		              				"total":jData.page.total,
		              				"page":jData.page.page,
		              				"pageSize":jData.page.pageSize
		                		};
                                for(var i = 0; i < oData.dataList.length; i++){
                                    var attr = oData.dataList[i].payment.toString().split("-");
                                    oData.dataList[i].payment = attr[attr.length-1];
                                }
		                		oAntTitle.set('title', oData);
		                		oAnt.set('data', oData);
		                	}
		                	self._isInit = false;
		                	self._isSend = false;

		                }
		        	});
            	};

            	self._xTime = setTimeout(function(){
            		fSend();
            	},200);
          	
            }
            if(false === this._isInit){
            	this._isInit = true;
            	this._isSend = true;
            	fSearch(1);
            }
            
            //开始时间
            var fDateStart = function(el){
                var $el = $(el);
                $el.hide();
                self.dateStart = new Can.ui.calendar({
                    cssName: 'bg-ico calendar',
                    elName: 'startTime',
                    blankText: Can.msg.MODULE.COINS_DETAIL.START_TIME,
                    min: '2013-01-01'
                });

                self.dateStart.on('ON_SET_VALUE', function(e){
                    if(e !== $el.val()){
                        self.dateEnd.min = e;
                        $el.val(e);
                        $el.trigger('calendarChange', [e]);
                    }
                });

                self.dateStart.el.insertAfter($el);
            }
            //结束时间
            var fDateEnd = function(el){
                var $el = $(el);
                $el.hide();
                self.dateEnd = new Can.ui.calendar({
                    cssName: 'bg-ico calendar',
                    elName: 'endTime',
                    blankText: Can.msg.MODULE.COINS_DETAIL.END_TIME
                });

                self.dateEnd.on('ON_SET_VALUE', function(e){
                    if(e !== $el.val()){
                        self.dateStart.max = e;
                        $el.val(e);
                        $el.trigger('calendarChange', [e]);
                    }
                });

                self.dateEnd.el.insertAfter($el);
            }

            fDateStart("#startTime");
            fDateEnd("#endTime");

            //触发开始时间||结束时间
            oAnt.el.find('#startTime,#endTime').unbind().bind('calendarChange',function(el, data){
            	if(!self._isSend){
            		fSearch(1);
            	}
            });

            //选择类型
            oAnt.el.find('#coinsType').change().bind('selected',function(e, val){
                fSearch(1);
            });

            //分页
            oAnt.el.find('[paging]').bind('pageChange',function(el,page){
                fSearch(page);
            });
        
        }
        
    });

 })(Can, Can.module);