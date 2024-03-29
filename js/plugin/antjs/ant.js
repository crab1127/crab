/*! ant.js 2013-09-02 09:26 */
Array.prototype.forEach || (Array.prototype.forEach = function (a, b) {
    for (var c = 0, d = this.length; d > c; ++c)c in this && a.call(b, this[c], c, this)
}), Array.isArray || (Array.isArray = function (a) {
    return"[object Array]" === {}.toString.call(a)
}), String.prototype.trim || (String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "")
}), Array.prototype.indexOf || (Array.prototype.indexOf = function (a) {
    "use strict";
    if (null == this)throw new TypeError;
    var b, c, d = Object(this), e = d.length >>> 0;
    if (0 === e)return-1;
    if (b = 0, arguments.length > 1 && (b = Number(arguments[1]), b != b ? b = 0 : 0 != b && 1 / 0 != b && b != -1 / 0 && (b = (b > 0 || -1) * Math.floor(Math.abs(b)))), b >= e)return-1;
    for (c = b >= 0 ? b : Math.max(e - Math.abs(b), 0); e > c; c++)if (c in d && d[c] === a)return c;
    return-1
}), function (a) {
    var b = this;
    b.Ant = a;
    if ("object" == typeof module && module) {
        var c = b.document || require("jsdom").jsdom();
        module.exports = a(c)
    } else a = a(b.document), "function" == typeof define && define('Ant', function () {
        return a
    }), b.Ant = a
}(function (a) {
    "use strict";
    function b(a) {
        var b, c = arguments.length;
        a = a || {};
        for (var d = 1; c > d; d++)if (null !== (b = arguments[d]))for (var e in b)a[e] = b[e];
        return a
    }

    function c(a) {
        a && (G = a, J.IF = G + "if", J.REPEAT = G + "repeat", J.MODEL = G + "model")
    }

    function d(a, c) {
        c = c || {};
        var d, f = c.data || {}, h = c.events || {};
        d = e(a, c.el), a = d.tpl, d = d.el, this.tpl = a, this.el = d, this.data = {}, this.isRendered = !1, this.isLazy = !!c.lazy, this.options = c, this.partials = null;
        for (var i in h)this.on(i, h[i]);
        g(this), f = b(this.data, f), c.data && this.render(f), this.init.apply(this, arguments)
    }

    function e(b, c) {
        var d;
        return v(b) ? (c ? (d = c = v(c) ? c : a.createElement(c), d.innerHTML = "", c.appendChild(b)) : d = b, b = d.outerHTML) : (d = v(c) ? c : a.createElement(c || "div"), d.innerHTML = b), {el: d, tpl: b}
    }

    function f(a, b, c) {
        a.$$render(b, c)
    }

    function g(a) {
        var b = new l;
        b.$$root = b, b.$$ant = a, a.vm = b, h(a.el, b)
    }

    function h(a, b) {
        if (a.nodeType && !a.length)i(a, b); else for (var c = 0, d = a.length; d > c; c++)i(a[c], b)
    }

    function i(a, b) {
        if (8 !== a.nodeType) {
            if (3 === a.nodeType)return b.$$updateVM(a, a.parentNode), void 0;
            if (!j(a, b))for (var c, d = a.firstChild; d;)c = d.nextSibling, i(d, b), d = c
        }
    }

    function j(a, b) {
        var c, d = a.getAttributeNode(J.REPEAT), e = a.getAttributeNode(J.IF), f = a.getAttributeNode(J.MODEL);
        if (d || e)return b.$$addBinding({name: (d || e).nodeName, path: (d || e).nodeValue, el: a}), !0;
        f && k(a, f.value, b);
        for (var g = 0, h = a.attributes.length; h > g; g++)c = a.attributes[g], b.$$updateVM(c, a), 0 === c.nodeName.indexOf(G) && (a.removeAttribute(c.nodeName), g--, h--)
    }

    function k(a, b, c) {
        b = b.trim();
        var d, e = c.$$root.$$ant, f = c.$$getChild(b), g = "change", h = d = "value", i = w(e.get(f.$$getKeyPath())), j = /\r\n/g, k = function (e) {
            var f = e || c.$$getData(b) || "", e = a[d];
            e && e.replace && (e = e.replace(j, "\n")), f !== e && (a[d] = f)
        }, l = function () {
            var b = a[h];
            b.replace && (b = b.replace(j, "\n")), e.set(f.$$getKeyPath(), b)
        };
        switch (a.tagName) {
            case"INPUT":
            case"TEXTAREA":
                switch (a.type) {
                    case"checkbox":
                        h = d = "checked", K && (g += " click");
                        break;
                    case"radio":
                        d = "checked", K && (g += " click"), k = function () {
                            a.checked = a.value === c.$$getData(b)
                        }, i = a.checked;
                        break;
                    default:
                        e.isLazy || ("oninput"in a && (g += " input"), K && (g += " keyup propertychange cut"))
                }
                break;
            case"SELECT":
                a.multiple && (l = function () {
                    for (var b = [], c = 0, d = a.options.length; d > c; c++)a.options[c].selected && b.push(a.options[c].value);
                    e.set(f.$$getKeyPath(), b)
                }, k = function () {
                    var d = c.$$getData(b);
                    if (d && d.length)for (var e = 0, f = a.options.length; f > e; e++)a.options[e].selected = -1 !== d.indexOf(a.options[e].value)
                }), i = i && !o(a[h])
        }
        f.$$watchers.push(k), g.split(/\s+/g).forEach(function (b) {
            F(a, b, l), E(a, b, l)
        }), a.removeAttribute(J.MODEL), a[h] && i && l()
    }

    function l() {
        this.$$path = "", this.$$watchers = [], this.$$repeaters = []
    }

    function m(a, b) {
        var c, d, e = ["$$repeaters", "$$watchers"];
        if (b) {
            for (var f = 0, g = e.length; g > f; f++) {
                c = a[e[f]];
                for (var h = 0, i = c.length; i > h; h++)d = c[h], d.el && b.contains(d.el) && (c.splice(h, 1), h--, i--)
            }
            for (var j in a)j in l.prototype || m(a[j], b)
        }
    }

    function n(a, b, c) {
        var d, e, f;
        for (var g in b)d = a[g], e = b[g], a !== e && "__ant__" !== g && (x(e) || Array.isArray(e) ? (f = Array.isArray(e) ? d && Array.isArray(d) ? d : [] : d || {}, a[g] = n(f, e, c && c.$$getChild(g))) : a[g] = e);
        return c && Array.isArray(a) && (a.__ant__ = c, a.push !== P.push && n(a, P)), a
    }

    function o(a) {
        return L.lastIndex = 0, a && L.test(a)
    }

    function p(a, b) {
        var c, d, e = [], f = [], g = 0, h = a.nodeValue, i = a.nodeName;
        for (3 === a.nodeType ? d = "text" : 2 === a.nodeType && (d = "attr", 0 === i.indexOf(G) && (i = a.nodeName.slice(G.length)), o(i) && (h = i)), L.lastIndex = 0; c = L.exec(h);)L.lastIndex - g > c[0].length && f.push(h.slice(g, L.lastIndex - c[0].length)), e.push({escape: !c[2], path: (c[2] || c[1]).trim(), position: f.length, el: b, node: a, name: i}), f.push(c[0]), g = L.lastIndex;
        return h.length > g && f.push(h.slice(g, h.length)), {tokens: e, textMap: f, node: a, type: d, attr: i, el: b}
    }

    function q(b, c, d) {
        var e, f = c.position, g = d.node, h = d.el, i = d.type, j = d.textMap, k = d.attr, l = o(g.nodeName);
        if (b + "" != j[f] + "") {
            if ((l ? k : g.nodeValue) !== j.join("") && c.escape)return console.warn("模板内容被修改!"), void 0;
            if (j[f] = b && b + "", e = j.join(""), c.escape || "text" !== i)l || (g.nodeValue = e), "text" !== i && (l ? (k && h.removeAttribute(k), e && r(h, e, g.nodeValue), d.attr = e) : r(h, k, e)); else {
                var m, n = a.createElement("div");
                c.unescapeNodes = c.unescapeNodes || [], n.innerHTML = e, m = n.childNodes, c.unescapeNodes.forEach(function (a) {
                    a.parentNode && a.parentNode.removeChild(a)
                }), c.unescapeNodes = [];
                for (var p = 0, q = m.length; q > p; p++)c.unescapeNodes.push(m[p]), g.parentNode.insertBefore(m[p], g), p--, q--;
                g.nodeValue = ""
            }
        }
    }

    function r(a, b, c) {
        try {
            b in a && K ? "style" === b && a.style.setAttribute ? a.style.setAttribute("cssText", c) : a[b] = "boolean" == typeof a[b] ? !0 : c : a.setAttribute(b, c)
        } catch (d) {
        }
    }

    function s(a, b, c) {
        for (var d = a.__ant__.$$repeaters, e = 0, f = d.length; f > e; e++)d[e].type === J.REPEAT && d[e][b](c, a);
        a.__ant__.$$root.$$ant.trigger("update")
    }

    function t(b, c, d, e) {
        var f = a.createTextNode("");
        this.path = b.getAttribute(e), b.removeAttribute(e), this.el = b, this.vm = c, this.relativeVm = d, this.type = e, this.relateEl = f, this.els = [], e === J.IF && i(this.el, d), this.state = this.STATE_READY, b.parentNode.insertBefore(f, b), b.parentNode.removeChild(b)
    }

    function u() {
    }

    function v(a) {
        return"object" == typeof a && null !== a
    }

    function w(a) {
        return"undefined" == typeof a
    }

    function x(a) {
        return!a || "[object Object]" !== {}.toString.call(a) || a.nodeType || a === a.window ? !1 : !0
    }

    function y(a, b, c) {
        return function () {
            var d = b.apply(this, arguments);
            return c && c.call(this, d) ? d : a.apply(this, arguments)
        }
    }

    function z(a, b, c) {
        return function () {
            var d = a.apply(this, arguments);
            return c && c.call(this, d) ? d : (b.apply(this, arguments), d)
        }
    }

    function A(a, b) {
        return y(a, b, function (a) {
            return a === !1
        })
    }

    function B(a) {
        return a.replace(R, "").split(Q)
    }

    function C(a, c, d) {
        if (a) {
            var e = B(a), f = d;
            e.forEach(function (a, b) {
                b === e.length - 1 ? f[a] = c : f && f.hasOwnProperty(a) ? f = f[a] : (f[a] = {}, f = f[a])
            })
        } else b(d, c);
        return d
    }

    function D(a, b) {
        var c, d, e = b;
        if (a) {
            c = B(a);
            for (var f = 0, g = c.length; g > f; f++) {
                if (d = c[f], !e || !e.hasOwnProperty(d))return;
                e = e[d]
            }
        }
        return e
    }

    function E(a, b, c) {
        a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c)
    }

    function F(a, b, c) {
        a.removeEventListener ? a.removeEventListener(b, c) : a.detachEvent("on" + b, c)
    }

    var G, H = {on: function (a, b, c) {
        var d = c || this;
        return d._handlers = d._handlers || {}, d._handlers[a] = d._handlers[a] || [], d._handlers[a].push({handler: b, context: c, ctx: d}), this
    }, off: function (a, b, c) {
        var d = c || this, e = d._handlers;
        if (a && e[a])if ("function" == typeof b)for (var f = 0; f < e[a].length; f++)e[a][f].handler === b && (e[a].splice(f, 1), f--); else e[a] = [];
        return this
    }, trigger: function (a) {
        var b = this, c = [].slice.call(arguments, 1), d = b._handlers;
        return d && d[a] && d[a].forEach(function (a) {
            a.handler.apply(b, c)
        }), this
    }}, I = {extend: function (a, c) {
        var d = this, e = function () {
            return d.apply(this, arguments)
        }, f = function () {
            this.constructor = e
        };
        return f.prototype = d.prototype, e.prototype = new f, b(e.prototype, a), b(e, d, c), e
    }}, J = {};
    c("a-"), b(d, I, {setPrefix: c, Event: H}), b(d.prototype, H, {update: function (a, b, c) {
        var d, e = this.vm;
        return v(a) ? (c = b, d = b = a) : "string" == typeof a ? (a = B(a).join("."), w(b) && (b = this.get(a)), d = C(a, b, {}), e = e.$$getChild(a)) : b = this.data, w(c) && (c = v(a)), f(e, b, c), this.trigger("update", d), this
    }, render: function (a) {
        return a && this.set(a, {isExtend: !1, silence: !0}), f(this.vm, this.data, !1), this.isRendered = !0, this.trigger("render"), this
    }, clone: function (a) {
        return n({}, this.options), new this.constructor(this.tpl, n(this.options, a))
    }, get: function (a) {
        return D(a, this.data)
    }, set: function (a, b, c) {
        var d, e, f, g, h;
        if (w(a))return this;
        if (v(a))d = !0, c = b, c = c || {}, c.isExtend !== !1 ? (e = !0, n(this.data, a, this.vm)) : (e = !1, this.data = n({}, a, this.vm)); else if (c = c || {}, D(a, this.data) !== b && (d = !0), d)if (c.isExtend !== !0) {
            if (g = B(a), g.length > 1) {
                if (h = g.pop(), f = D(g.join("."), this.data), w(f))C(g.join("."), f = {}, this.data); else if (!v(f)) {
                    var i = f;
                    C(g.join("."), f = {toString: function () {
                        return i
                    }}, this.data)
                }
            } else a ? (f = this.data, h = a) : (f = this, h = "data");
            f[h] = v(b) ? n(Array.isArray(b) ? [] : {}, b, this.vm.$$getChild(a, !Array.isArray(b))) : b, e = !1
        } else n(this.data, C(a, b, {}), this.vm), e = !0;
        return d && !c.silence && (v(a) ? this.update(a, e) : this.update(a, b, e)), this
    }, setPartial: function (c) {
        if (c) {
            this.partials = this.partials || {}, c = b({}, this.partials[c.name], c);
            var f, g, i, j = c.name, k = c.node, l = k && k.parentNode, m = c.content, n = c.path || "";
            if (j && (this.partials[j] = c), m) {
                if (i = this.vm.$$getChild(n), m instanceof d)f = [m.el]; else if (c.escape && !v(m))f = [a.createTextNode(m)]; else {
                    g = e(m, "div").el.childNodes, f = [];
                    for (var o = 0, p = g.length; p > o; o++)f.push(g[o])
                }
                for (var o = 0, p = f.length; p > o; o++)l && l.insertBefore(f[o], k);
                h(f, i), this.isRendered && i.$$render(D(n, this.data))
            }
            return this
        }
    }, parse: function (a) {
        return a
    }, init: u});
    var K = !!a.attachEvent;
    l.prototype = {$$watchers: null, $$root: null, $$parent: null, $$repeaters: null, $$ant: null, $$path: null, $$links: null, $$updateVM: function (b, c) {
        if (o(b.nodeValue) || o(b.nodeName)) {
            var d = p(b, c), e = d.textMap, f = this;
            "text" === d.type && e.length > 1 ? (e.forEach(function (d) {
                var e = a.createTextNode(d);
                c.insertBefore(e, b), f.$$updateVM(e, c)
            }), c.removeChild(b)) : d.tokens.forEach(function (a) {
                f.$$addBinding(a, d)
            })
        }
    }, $$getChild: function (a, b) {
        var c, d, e, f = this;
        if (a += "") {
            e = a.split(/(?!^)\.(?!$)/);
            for (var g = 0, h = e.length; h > g; g++) {
                if (c = e[g], !f[c]) {
                    if (b)return null;
                    d = new l, d.$$parent = f, d.$$root = f.$$root || f, d.$$path = c, f[c] = d
                }
                f = f[c]
            }
        }
        return f
    }, $$getKeyPath: function () {
        for (var a = this.$$path, b = this; (b = b.$$parent) && b.$$path;)a = b.$$path + "." + a;
        return a
    }, $$addBinding: function (a, b) {
        var c, d = a.path, e = a.el, f = a.name;
        switch (f) {
            case J.IF:
                d = d.replace(N, "");
            case J.REPEAT:
                c = this.$$getChild(d), c.$$repeaters.push(new t(e, c, this, f));
                break;
            default:
                M(b, this, a)
        }
    }, $$getData: function (a, b) {
        var c = D(a, this.$$root.$$ant.get(this.$$getKeyPath()));
        return!b && this.$$parent && w(c) ? this.$$parent.$$getData(a) : c
    }, $$render: function (a, b) {
        var c = b ? a : this;
        this.$$repeaters.forEach(function (c) {
            c.generate(a, b)
        });
        for (var d = 0, e = this.$$watchers.length; e > d; d++)this.$$watchers[d].call(this, a);
        if (v(c))for (var f in c)!this.hasOwnProperty(f) || f in l.prototype || this[f].$$render(a ? a[f] : void 0, b)
    }};
    var L = /{{({([^{}\n]+)}|[^{}\n]+)}}/g, M = function (a, b, c) {
        var d = "." === c.path ? b : b.$$getChild(c.path), e = function (d) {
            var e = w(d) ? b.$$getData(c.path) : d;
            q(e, c, a)
        };
        e.el = a.el, d.$$watchers.push(e)
    }, N = /^\^/;
    M = A(M, function (a, b, c) {
        var d = c.path, e = d.split(":"), f = function () {
            var d = b.$$getData(h), e = (N.test(g) ? !d : d) ? i : "";
            q(e, c, a)
        };
        if (2 === e.length) {
            var g = e[0].trim(), h = g.replace(N, ""), i = e[1].trim();
            return f.el = a.el, b.$$getChild(h).$$watchers.push(f), !1
        }
    });
    var O = /^>\s*(?=.+)/;
    M = A(M, function (b, c, d) {
        var e, f, g, h;
        return"text" === b.type && O.test(d.path) ? (e = d.path.replace(O, ""), f = c.$$root.$$ant, g = f.options, h = a.createTextNode(""), b.el.insertBefore(h, b.node), b.el.removeChild(b.node), f.setPartial({name: e, content: g && g.partials && g.partials[e], node: h, escape: d.escape, path: c.$$getKeyPath()}), !1) : void 0
    });
    var P = {splice: z([].splice, function () {
        s(this, "splice", [].slice.call(arguments))
    }), push: z([].push, function () {
        var a = [].slice.call(arguments);
        a.unshift(this.length - a.length, 0), s(this, "splice", a)
    }), pop: z([].pop, function () {
        s(this, "splice", [this.length, 1])
    }), shift: z([].shift, function () {
        s(this, "splice", [0, 1])
    }), unshift: z([].unshift, function () {
        var a = [].slice.call(arguments);
        a.unshift(0, 0), s(this, "splice", a)
    }), sort: z([].sort, function () {
        s(this, "sort")
    }), reverse: z([].reverse, function () {
        s(this, "reverse")
    })};
    b(t, {isGenTempl: function (a) {
        return a && a.hasAttributes && a.hasAttributes(J.REPEAT) || a.hasAttributes(J.IF)
    }}), t.prototype = {STATE_READY: 0, STATE_GENEND: 1, generate: function (a, b) {
        var c = this, a = this.relativeVm.$$getData(this.path.replace(N, ""));
        if (c.type === J.REPEAT) {
            if (a && !Array.isArray(a))return console.warn("需要一个数组"), void 0;
            0 !== this.state && b || a && this.splice([0, this.els.length].concat(a))
        } else N.test(this.path) && (a = !a), a ? c.lastIfState || c.relateEl.parentNode.insertBefore(c.el, c.relateEl) : c.lastIfState && c.el.parentNode.removeChild(c.el), c.lastIfState = a;
        c.state = this.STATE_GENEND
    }, splice: function (b, c) {
        var d, e, f = this.els, g = b.slice(2), h = b[0], j = b[1], k = g.length, l = [], o = a.createDocumentFragment(), p = this.relateEl.parentNode;
        w(j) && (b[1] = j = f.length - h);
        for (var q = h, r = f.length; r > q; q++)if (h + j > q)try {
            p.removeChild(f[q])
        } catch (s) {
        } else {
            if (!k && !j)break;
            f[q][G + "index"] = q - j + k, e = this.vm[q - j + k] = this.vm[q], e.$$path = q - j + k
        }
        for (var t = 0; k > t; t++)d = this.el.cloneNode(!0), e = this.vm.$$getChild(h + t), m(e, f[h + t]), d[G + "index"] = h + t, o.appendChild(d), i(d, e), e.$$render(g[t]), l.push(d), c && v(c[h + t]) && (c[h + t] = n(Array.isArray(c[h + t]) ? [] : {}, c[h + t], e));
        l.length && p.insertBefore(o, f[h + j] || this.relateEl);
        for (var u = r - j + k; r > u; u++)delete this.vm[u];
        b = b.slice(0, 2).concat(l), f.splice.apply(f, b), j !== k && this.vm.$$getChild("length").$$render(f.length)
    }, reverse: function () {
        for (var b, c = this.vm, d = this.relateEl, e = a.createDocumentFragment(), f = 0, g = this.els.length; g > f; f++).5 > f && (b = c[f], c[f] = c[g - f - 1], c[f].$$path = f, b.$$path = g - f - 1, c[g - f - 1] = b), this.els[f][G + "index"] = g - f - 1, e.appendChild(this.els[g - f - 1]);
        d.parentNode.insertBefore(e, d), this.els.reverse()
    }, sort: function () {
        this.generate()
    }};
    var Q = /(?:\.|\[)/g, R = /\]/g;
    return d
});
