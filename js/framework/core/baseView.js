/**
 * 基础VIEW
 * @author Island
 * @since 2013-01-16
 * @version 1.0
 */
Can.view.BaseView = Can.extend(Can.event.Observable, {
    id:''
    /**
     *  依赖的UI JS文件,假如是widget则不需要动态导入
     */
    ,requireUiJs:[]
    /**
     * 对应的action JS
     */
    ,actionJs:[]
    ,constructor:function(cfg){
        Can.apply(this, cfg || {});
        Can.importJS(this.requireUiJs);
        Can.importJS(this.actionJs);
    }
    ,start:function(){
        var startTime1 = new Date()
        this.startup();
        Can.util.EventDispatch.dispatchEvent('ON_MODULE_VIEW_INIT', this);
        var startTime2 = new Date();
        //if(this instanceof Can.module.BaseModule)
            //console.log('==== Module started, it costs:' + (startTime2.getTime() - startTime1.getTime()) + 'ms  =====');
    }
    /**
     * 子类需要继承此方法，用于启动界面构建view的逻辑
     */
    ,startup:Can.emptyFn
    ,getId:function(){
        return this.id;
    }
});
