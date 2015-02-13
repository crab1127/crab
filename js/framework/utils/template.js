Can.importJS([
    'js/plugin/handlebars/handlebars.js',
    'js/framework/utils/i18n.js'
]);

// 注册多国语言
Handlebars.registerHelper('_', function(){
    var args = Array.prototype.slice.call(arguments);
    args.pop();
    //console.log(args);
    return Can.util.i18n._.apply(null, args);
});

// 加载语言包
Can.util.i18n.loadDict(Can.util.Config.lang, Can.msg);
Can.util.i18n.setLang(Can.util.Config.lang);

// 注册名字空间
Can.util.template = Handlebars;
