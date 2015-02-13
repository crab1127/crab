/**
 * Form表单中field的基类
 * User: island
 * Date: 13-1-20
 * Time: 上午12:12
 */
Can.ui.BaseField = Can.extend(Can.ui.BaseUI, {
    /**
     * 提交到后台的参数名
     */
    name:null
    /**
     * 值
     */
    ,value:null
    ,constructor:function(cfg){
        Can.apply(this,cfg || {});
        Can.ui.BaseField.superclass.constructor.call(this);
        this.addEvents('onchange');
    }
    /**
     * 之类需要实现此方法
     */
    ,getValue:Can.emptyFn()
    /**
     * 之类需要实现此方法
     */
    ,setValue:Can.emptyFn()
});