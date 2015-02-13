/**
 * 定义了Can值对象
 * @author Island 2012-02-15
 */

/**
 * Can基础值对象
 * @author Island verison 1.0
 */
Can.vo.BaseVo = Can.extend(Can.event.Observable,{
	constructor: function(config){
		//do something special when the class is construct
		Can.vo.BaseVo.superclass.constructor.call(this);
	}
    /**
     * 将VO中的值转化成XML字符串，比如
     * <sex>0</sex>
     * <zoneCode>1</zoneCode>
     */
    ,serializeToXML:function(){
        var xml = '';
        for(var p in this){
            if(p == 'filterOptRe'||
                p == 'eventsSuspended')
                continue;
            if(typeof this[p] != 'function'){
                if(this[p] != ''){
                    xml += '<' + p + '><![CDATA[' + this[p] + ']]></' + p + '>\n';
                }
            }
        }
        return xml;
    }
});





