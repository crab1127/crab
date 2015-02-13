/**
 * 替换字符串 
 */
(function(ctx) {
    var sprintf = function() {
		if (!sprintf.cache.hasOwnProperty(arguments[0])) {
			sprintf.cache[arguments[0]] = sprintf.parse(arguments[0]);
		}
		return sprintf.format.call(null, sprintf.cache[arguments[0]], arguments);
	};

	sprintf.format = function(parse_tree, argv) {
		var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			}
			else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				}
				else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch (match[8]) {
					case 'b': arg = arg.toString(2); break;
					case 'c': arg = String.fromCharCode(arg); break;
					case 'd': arg = parseInt(arg, 10); break;
					case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
					case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
					case 'o': arg = arg.toString(8); break;
					case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
					case 'u': arg = arg >>> 0; break;
					case 'x': arg = arg.toString(16); break;
					case 'X': arg = arg.toString(16).toUpperCase(); break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	sprintf.cache = {};

	sprintf.parse = function(fmt) {
		var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			}
			else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			}
			else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [], replacement_field = match[2], field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else {
								throw('[sprintf] huh?');
							}
						}
					}
					else {
						throw('[sprintf] huh?');
					}
					match[2] = field_list;
				}
				else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
                    console.log(fmt);
					throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else {
				throw('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	var vsprintf = function(fmt, argv, _argv) {
		_argv = argv.slice(0);
		_argv.splice(0, 0, fmt);
		return sprintf.apply(null, _argv);
	};

	/**
	 * helpers
	 */
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}

	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
		return output.join('');
	}

	/**
	 * export to either browser or node.js
	 */
	ctx.sprintf = sprintf;
	ctx.vsprintf = vsprintf;
})(Can.util);

/**
 * 多国语言支持
 * @author  vfasky
 * @version 1.0
 * @module  cfec/locale/i18n
 * 
 */
Can.util.i18n = (function(sprintf){

    var exports = {};

    /**
     * 存放已经加载的字典
     * @type {Object}
     */
    var _dicts = {};

    /**
     * 要翻译的默认语言
     * @type {String}
     */
    var _lang = 'en';

    /**
     * @author  vfasky
     * @param   {String} lang 语言标识: en, zh-cn, zh-tw
     * @param   {Object} dict 字典
     * @return  {Void}  
     * @description
     * ``` js
     * //加载语言字典
     * var I18N = require('cfec/locale/i18n');
     * I18N.loadDict('en',{
     *     'hello' : 'hello %s !'
     * });
     * ```
     */
    exports.loadDict = function(lang, dict){
        _dicts[lang] = dict;
    };


    /**
     * 设置要翻译的语言
     * @author  vfasky
     * @param   {String} lang 语言标识: en, zh-cn, zh-tw
     * @return  {Void} 
     */
    exports.setLang = function(lang){
        _lang = lang;
    };

    /**
     * 翻译语言
     * @author  vfasky
     * @param   {String} key 字典对应的key
     * @return  {String} 翻译后的语言
     * @description
     * ``` js
     * //翻译语言
     * var I18N = require('cfec/locale/i18n');
     * console.log(I18N._('Can.msg.PAGE_COUNT', '500'));
     * ```
     */
    exports.translations = function(key){
        var sprintfDict = function(str, dict){
            //替换 %(x) 这样的语言包
            for(var k in dict){
                var reg = new RegExp('\\%\\('+ $.trim(k) + '\\)', 'g');
                str = str.replace(reg, dict[k]);
            }
            return str;
        };

        var xDict = arguments[1];
        
        if(_dicts.hasOwnProperty(_lang)){
            var dict    = _dicts[_lang];
            var keyTree = key.toString().split('.');

            var str = getDataBuyKey(dict, keyTree, 0);

            if(str){
                if($.isPlainObject(xDict)){
                    return sprintf(str, xDict);
                    //return sprintfDict(key, xDict);
                }
                //替换 @@@, @@, @, [%s] 为 %s
                str = str.toString()
                         .replace(/\@\@\@/g, '%s')
                         .replace(/\@\@/g, '%s')
                         .replace(/\@/g, '%s')
                         .replace(/\[\%s\]/g, '%s');
                //console.log(str)
                arguments[0] = str;
                return sprintf.apply(null, arguments);
            }
        }

        if($.isPlainObject(xDict)){
            return sprintf(key, xDict);
            //return sprintfDict(key, xDict);
        }

        arguments[0] = key;
        return sprintf.apply(null, arguments);
    };

    /**
     * translations 别名
     * @type {cfec/locale/i18n:translations}
     */
    exports._ = exports.translations;

    var getDataBuyKey = function(data, tree, ix){
        var ix  = Number(ix) || 0;
        var len = tree.length;

        var _getDataBuyKey = getDataBuyKey;

        if(ix < len){
            if(data.hasOwnProperty(tree[ix])){
                data = data[tree[ix]];
                ix++;
                if(ix === len){
                    return data;
                }
                return _getDataBuyKey(data, tree, ix);
            }
        }
        return false;
    };

    return exports;
})(Can.util.sprintf);
