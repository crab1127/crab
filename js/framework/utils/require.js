Can.util.require = (function(_host){
    var getDataBuyKey = function(data, tree, ix){
        var ix  = Number(ix) || 0;
        var len = tree.length;

        var _getDataBuyKey = getDataBuyKey;

        if(ix < len){
            try{
                if(data && data.hasOwnProperty(tree[ix])){
                    data = data[tree[ix]];
                    ix++;
                    if(ix === len){
                        return data;
                    }
                    return _getDataBuyKey(data, tree, ix);
                }
            }
            catch(e){
                return false;
            }
        }
        return false;
    };

    return function(namespace, host){
        return getDataBuyKey(host || _host, namespace.split('.'), 0);
    };
})(window);
