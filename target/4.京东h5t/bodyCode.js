// 获取body的加密(是个wp)
window = this;
!function(o) {
    "use strict";
    var e, n, t, o = o, a = {};
    function r(e) {
        var n = a[e];
        if (void 0 !== n)
            return n.exports;
        var t = a[e] = {
            id: e,
            loaded: !1,
            exports: {}
        };
        return o[e].call(t.exports, t, t.exports, r),
        t.loaded = !0,
        t.exports
    }
    r.m = o,
    e = [],
    r.O = function(n, t, o, a) {
        if (!t) {
            var c = 1 / 0;
            for (u = 0; u < e.length; u++) {
                t = e[u][0],
                o = e[u][1],
                a = e[u][2];
                for (var i = !0, f = 0; f < t.length; f++)
                    (!1 & a || c >= a) && Object.keys(r.O).every((function(e) {
                        return r.O[e](t[f])
                    }
                    )) ? t.splice(f--, 1) : (i = !1,
                    a < c && (c = a));
                if (i) {
                    e.splice(u--, 1);
                    var d = o();
                    void 0 !== d && (n = d)
                }
            }
            return n
        }
        a = a || 0;
        for (var u = e.length; u > 0 && e[u - 1][2] > a; u--)
            e[u] = e[u - 1];
        e[u] = [t, o, a]
    }
    ,
    r.n = function(e) {
        var n = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return r.d(n, {
            a: n
        }),
        n
    }
    ,
    r.d = function(e, n) {
        for (var t in n)
            r.o(n, t) && !r.o(e, t) && Object.defineProperty(e, t, {
                enumerable: !0,
                get: n[t]
            })
    }
    ,
    r.f = {},
    r.e = function(e) {
        return Promise.all(Object.keys(r.f).reduce((function(n, t) {
            return r.f[t](e, n),
            n
        }
        ), []))
    }
    ,
    r.u = function(e) {
        return {
            34: "biservicefee",
            336: "quitApply",
            410: "marketActivities",
            621: "entire",
            685: "lineReport",
            869: "createShop",
            886: "create",
            917: "agreement",
            929: "common-731babaf",
            973: "common-43dd7041",
            1131: "appMng",
            1276: "shopActPromotion",
            1288: "myApi",
            1395: "equityPlaza",
            1621: "investmentEffect",
            1666: "planDetails",
            1806: "officalPromotion",
            1884: "taskDetail",
            1913: "jdauthentication",
            1941: "daogou",
            1970: "newWithdraw",
            1992: "cashDetail",
            2004: "investmentDetail",
            2181: "operate-09e32462",
            2337: "withdraw",
            2412: "socialMediaMng",
            2479: "marketingCalendar",
            2481: "realTimeScreen",
            2527: "withdrawRecord",
            2556: "socialpage",
            2690: "couponList",
            2795: "cashGiftCreate",
            2832: "taskSquare",
            2951: "RewardActivity",
            2970: "articlePromotion",
            2992: "myTask",
            3012: "subCommission",
            3386: "cashGiftDeposit",
            3513: "trafficMediaMng",
            3583: "webExtension",
            3712: "openplatform-9a53bcac",
            3756: "shopPromotion",
            3761: "openplatform-9a6b8f1e",
            3765: "skuAnalyse",
            3779: "active",
            3888: "external",
            3940: "cashCoupon",
            4163: "InterfaceManagement",
            4256: "channel",
            4565: "common-d91a9049",
            4716: "user-d91a9049",
            4738: "cpcMedia",
            4843: "openplatform-d91a9049",
            4868: "goodsPromotion",
            4962: "common-8912b8e4",
            5001: "groupList",
            5075: "planList",
            5142: "reverseInvestment",
            5177: "home",
            5313: "myStarEnlist2",
            5379: "investmentLeader",
            5413: "recommendMng",
            5512: "accounting",
            5549: "jingPlanMng",
            5724: "common-69b0bd4f",
            5753: "contentpage",
            5769: "appMedia",
            5847: "socialMediaExtension",
            5863: "projectDetail",
            6026: "InvestmentData",
            6419: "batchMng",
            6596: "404",
            6653: "DataPromotion",
            6659: "common-4720890c",
            6682: "appExtension",
            6810: "common-c7713fe4",
            7012: "shopPromotionDetail",
            7066: "secretOrder",
            7190: "channelManagement",
            7253: "shopAnalyse",
            7468: "openOrder",
            7815: "chatExtension",
            7899: "custompromotion",
            7991: "webMng",
            8022: "cashGiftDepositResult",
            8273: "actAnalyse",
            8277: "cashGift",
            8300: "msg",
            8429: "helpcenter",
            8442: "moreProductList",
            8608: "channelPromotion",
            8722: "common-fb051ecb",
            8924: "initRevGroup",
            8983: "report",
            8989: "common-a07e9f05",
            9028: "accountBinding",
            9206: "trafficMediaExtension",
            9223: "initiate",
            9405: "common-bcec5985",
            9481: "user-d36ce38a",
            9557: "couponPromotion",
            9621: "myInvoice",
            9664: "taskEffectData",
            9704: "batchDetail",
            9734: "myShop",
            9830: "darenBank",
            9847: "userTask",
            9851: "common-c0d952d5",
            9940: "promotionSite",
            9962: "operate-059a6536",
            9974: "myStarEnlist"
        }[e] + "." + {
            34: "8d591fb4",
            336: "67bd3ff9",
            410: "36906e8f",
            621: "0ee68aeb",
            685: "d8b7ea7d",
            869: "a0f684be",
            886: "b52c8439",
            917: "019a384a",
            929: "feffeb39",
            973: "696d2055",
            1131: "a947aa9b",
            1276: "4afef4b0",
            1288: "efd9ca56",
            1395: "c429e93e",
            1621: "d202c6ce",
            1666: "bf720aa7",
            1806: "fc34b266",
            1884: "ca195d3c",
            1913: "6e4ecec4",
            1941: "9ac3df06",
            1970: "6be3f1ca",
            1992: "c94a5ec8",
            2004: "7c02117e",
            2181: "615aab39",
            2337: "e62ba9bf",
            2412: "dbe3545e",
            2479: "c3f58fe0",
            2481: "b520ad13",
            2527: "c4328dcc",
            2556: "446e9f0a",
            2690: "64ddf7cc",
            2795: "d6217b6f",
            2832: "63abb48d",
            2951: "604ac392",
            2970: "49913add",
            2992: "00c55cf4",
            3012: "2347219c",
            3386: "1a1f7d84",
            3513: "167f0c5c",
            3583: "f5d3ef48",
            3712: "975b16ae",
            3756: "4d822a98",
            3761: "8295dcca",
            3765: "bbde6975",
            3779: "c1a897b2",
            3888: "b3c1ead2",
            3940: "d0638aa6",
            4163: "cee51b41",
            4256: "fd687c68",
            4565: "711f7e6e",
            4716: "dea02c81",
            4738: "d5a92ea5",
            4843: "2f6bb590",
            4868: "cdc94092",
            4962: "2de832a4",
            5001: "f70998a5",
            5075: "ac50bd10",
            5142: "8ef49bcd",
            5177: "f64dc52d",
            5313: "6211ee32",
            5379: "23c2ebb2",
            5413: "c7fd2e9a",
            5512: "32136ae9",
            5549: "40d8e1b5",
            5724: "fae8a443",
            5753: "7e6090dd",
            5769: "3026d89e",
            5847: "88f445a5",
            5863: "81b40a8b",
            6026: "8c98c559",
            6419: "53351cae",
            6596: "43477835",
            6653: "8dde037b",
            6659: "25e15d61",
            6682: "9a980d14",
            6810: "10c67998",
            7012: "9c00a26b",
            7066: "ae556e3c",
            7190: "dc5711e7",
            7253: "6975c065",
            7468: "356d24d2",
            7815: "7176c4b5",
            7899: "86e20cac",
            7991: "750e9c70",
            8022: "0b3b8d2b",
            8273: "d9f0aedf",
            8277: "6d116868",
            8300: "b6fe16ba",
            8429: "6787e218",
            8442: "43b3f14b",
            8608: "ce7516bf",
            8722: "d3db8be6",
            8924: "721cfbda",
            8983: "d49e5b5f",
            8989: "8478fcb1",
            9028: "70e7d83f",
            9206: "178b940f",
            9223: "82695cf0",
            9405: "b5b8ed3b",
            9481: "8db9729a",
            9557: "a25c4ce7",
            9621: "78e3430a",
            9664: "025f8cf7",
            9704: "5b800579",
            9734: "74dcc744",
            9830: "bd4ef747",
            9847: "e5b7542b",
            9851: "3269a500",
            9940: "940f6892",
            9962: "a5bde9d6",
            9974: "87d79797"
        }[e] + ".js"
    }
    ,
    r.g = function() {
        if ("object" == typeof globalThis)
            return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window)
                return window
        }
    }(),
    r.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n)
    }
    ,
    n = {},
    t = "JDUnion:",
    r.l = function(e, o, a, c) {
        if (n[e])
            n[e].push(o);
        else {
            var i, f;
            if (void 0 !== a)
                for (var d = document.getElementsByTagName("script"), u = 0; u < d.length; u++) {
                    var s = d[u];
                    if (s.getAttribute("src") == e || s.getAttribute("data-webpack") == t + a) {
                        i = s;
                        break
                    }
                }
            i || (f = !0,
            (i = document.createElement("script")).charset = "utf-8",
            i.timeout = 120,
            r.nc && i.setAttribute("nonce", r.nc),
            i.setAttribute("data-webpack", t + a),
            i.src = e),
            n[e] = [o];
            var b = function(t, o) {
                i.onerror = i.onload = null,
                clearTimeout(l);
                var a = n[e];
                if (delete n[e],
                i.parentNode && i.parentNode.removeChild(i),
                a && a.forEach((function(e) {
                    return e(o)
                }
                )),
                t)
                    return t(o)
            }
              , l = setTimeout(b.bind(null, void 0, {
                type: "timeout",
                target: i
            }), 12e4);
            i.onerror = b.bind(null, i.onerror),
            i.onload = b.bind(null, i.onload),
            f && document.head.appendChild(i)
        }
    }
    ,
    r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    r.nmd = function(e) {
        return e.paths = [],
        e.children || (e.children = []),
        e
    }
    ,
    r.p = "//storage.360buyimg.com/pubfree-bucket/unionpc/344b5e5/",
    function() {
        var e = {
            6700: 0
        };
        r.f.j = function(n, t) {
            var o = r.o(e, n) ? e[n] : void 0;
            if (0 !== o)
                if (o)
                    t.push(o[2]);
                else if (6700 != n) {
                    var a = new Promise((function(t, a) {
                        o = e[n] = [t, a]
                    }
                    ));
                    t.push(o[2] = a);
                    var c = r.p + r.u(n)
                      , i = new Error;
                    r.l(c, (function(t) {
                        if (r.o(e, n) && (0 !== (o = e[n]) && (e[n] = void 0),
                        o)) {
                            var a = t && ("load" === t.type ? "missing" : t.type)
                              , c = t && t.target && t.target.src;
                            i.message = "Loading chunk " + n + " failed.\n(" + a + ": " + c + ")",
                            i.name = "ChunkLoadError",
                            i.type = a,
                            i.request = c,
                            o[1](i)
                        }
                    }
                    ), "chunk-" + n, n)
                } else
                    e[n] = 0
        }
        ,
        r.O.j = function(n) {
            return 0 === e[n]
        }
        ;
        var n = function(n, t) {
            var o, a, c = t[0], i = t[1], f = t[2], d = 0;
            if (c.some((function(n) {
                return 0 !== e[n]
            }
            ))) {
                for (o in i)
                    r.o(i, o) && (r.m[o] = i[o]);
                if (f)
                    var u = f(r)
            }
            for (n && n(t); d < c.length; d++)
                a = c[d],
                r.o(e, a) && e[a] && e[a][0](),
                e[a] = 0;
            return r.O(u)
        }
        //   , t = self.webpackChunkJDUnion = self.webpackChunkJDUnion || [];
        // t.forEach(n.bind(null, 0)),
        // t.push = n.bind(null, t.push.bind(t))
    }(),
    r.nc = void 0
    window.mts = r;
}(
    {
    "84426": function(t, r, e) {
        e(32619);
        var n = e(54058)
          , o = e(79730);
        n.JSON || (n.JSON = {
            stringify: JSON.stringify
        }),
        t.exports = function(t, r, e) {
            return o(n.JSON.stringify, null, arguments)
        }
    },
        
    "626":function(t,r,e){var n=e(54058),o=e(21899),i=e(57475),u=function(t){return i(t)?t:void 0};t.exports=function(t,r){return arguments.length<2?u(n[t])||u(o[t]):n[t]&&n[t][r]||o[t]&&o[t][r]}},
    "2840":function(t,r,e){var n=e(55746),o=e(95981),i=e(61333);t.exports=!n&&!o((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},
    "2861":function(t,r,e){var n=e(626);t.exports=n("navigator","userAgent")||""},
    "4911":function(t,r,e){var n=e(21899),o=Object.defineProperty;t.exports=function(t,r){try{o(n,t,{value:r,configurable:!0,writable:!0})}catch(e){n[t]=r}return r}},
    "7046":function(t,r,e){var n=e(95329);t.exports=n({}.isPrototypeOf)},
    "10941":function(t,r,e){var n=e(57475);t.exports=function(t){return"object"==typeof t?null!==t:n(t)}},
    "14229":function(t,r,e){var n=e(24883);t.exports=function(t,r){var e=t[r];return null==e?void 0:n(e)}},
    "18285":function(t,r,e){var n=e(95981);t.exports=!n((function(){var t=function(){}.bind();return"function"!=typeof t||t.hasOwnProperty("prototype")}))},
    "21899":function(t,r,e){var n=function(t){return t&&t.Math==Math&&t};t.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof e.g&&e.g)||function(){return this}()||Function("return this")()},
    "24883":function(t,r,e){var n=e(21899),o=e(57475),i=e(69826),u=n.TypeError;t.exports=function(t){if(o(t))return t;throw u(i(t)+" is not a function")}},
    "31887":function(t){t.exports=function(t,r){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:r}}},
    "32029":function(t,r,e){var n=e(55746),o=e(65988),i=e(31887);t.exports=n?function(t,r,e){return o.f(t,r,i(1,e))}:function(t,r,e){return t[r]=e,t}},
    "32302":function(t,r,e){var n=e(72497);t.exports=n&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},
    "32619":function(t,r,e){var n=e(76887),o=e(21899),i=e(626),u=e(79730),a=e(95329),c=e(95981),s=o.Array,f=i("JSON","stringify"),p=a(/./.exec),l=a("".charAt),v=a("".charCodeAt),h=a("".replace),d=a(1..toString),y=/[\uD800-\uDFFF]/g,g=/^[\uD800-\uDBFF]$/,m=/^[\uDC00-\uDFFF]$/,x=function(t,r,e){var n=l(e,r-1),o=l(e,r+1);return p(g,t)&&!p(m,o)||p(m,t)&&!p(g,n)?"\\u"+d(v(t,0),16):t},b=c((function(){return'"\\udf06\\ud834"'!==f("\udf06\ud834")||'"\\udead"'!==f("\udead")}));f&&n({target:"JSON",stat:!0,forced:b},{stringify:function(t,r,e){for(var n=0,o=arguments.length,i=s(o);n<o;n++)i[n]=arguments[n];var a=u(f,null,i);return"string"==typeof a?h(a,y,x):a}})},
    "36760":function(t,r){"use strict";var e={}.propertyIsEnumerable,n=Object.getOwnPropertyDescriptor,o=n&&!e.call({1:2},1);r.f=o?function(t){var r=n(this,t);return!!r&&r.enumerable}:e},
    "37026":function(t,r,e){var n=e(21899),o=e(95329),i=e(95981),u=e(82532),a=n.Object,c=o("".split);t.exports=i((function(){return!a("z").propertyIsEnumerable(0)}))?function(t){return"String"==u(t)?c(t,""):a(t)}:a},
    "37252":function(t,r,e){var n=e(95981),o=e(57475),i=/#|\.prototype\./,u=function(t,r){var e=c[a(t)];return e==f||e!=s&&(o(r)?n(r):!!r)},a=u.normalize=function(t){return String(t).replace(i,".").toLowerCase()},c=u.data={},s=u.NATIVE="N",f=u.POLYFILL="P";t.exports=u},
    "39811":function(t,r,e){var n=e(21899),o=e(78834),i=e(57475),u=e(10941),a=n.TypeError;t.exports=function(t,r){var e,n;if("string"===r&&i(e=t.toString)&&!u(n=o(e,t)))return n;if(i(e=t.valueOf)&&!u(n=o(e,t)))return n;if("string"!==r&&i(e=t.toString)&&!u(n=o(e,t)))return n;throw a("Can't convert object to primitive value")}},
    "46935":function(t,r,e){var n=e(21899),o=e(78834),i=e(10941),u=e(56664),a=e(14229),c=e(39811),s=e(99813),f=n.TypeError,p=s("toPrimitive");t.exports=function(t,r){if(!i(t)||u(t))return t;var e,n=a(t,p);if(n){if(void 0===r&&(r="default"),e=o(n,t,r),!i(e)||u(e))return e;throw f("Can't convert object to primitive value")}return void 0===r&&(r="number"),c(t,r)}},
    "48219":function(t,r,e){var n=e(21899).TypeError;t.exports=function(t){if(null==t)throw n("Can't call method on "+t);return t}},
    "49677":function(t,r,e){var n=e(55746),o=e(78834),i=e(36760),u=e(31887),a=e(74529),c=e(83894),s=e(90953),f=e(2840),p=Object.getOwnPropertyDescriptor;r.f=n?p:function(t,r){if(t=a(t),r=c(r),f)try{return p(t,r)}catch(t){}if(s(t,r))return u(!o(i.f,t,r),t[r])}},
    "53385":function(t,r,e){var n,o,i=e(21899),u=e(2861),a=i.process,c=i.Deno,s=a&&a.versions||c&&c.version,f=s&&s.v8;f&&(o=(n=f.split("."))[0]>0&&n[0]<4?1:+(n[0]+n[1])),!o&&u&&(!(n=u.match(/Edge\/(\d+)/))||n[1]>=74)&&(n=u.match(/Chrome\/(\d+)/))&&(o=+n[1]),t.exports=o},
    "54058":function(t){t.exports={}},
    "55746":function(t,r,e){var n=e(95981);t.exports=!n((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},
    "56664":function(t,r,e){var n=e(21899),o=e(626),i=e(57475),u=e(7046),a=e(32302),c=n.Object;t.exports=a?function(t){return"symbol"==typeof t}:function(t){var r=o("Symbol");return i(r)&&u(r.prototype,c(t))}},
    "57475":function(t){t.exports=function(t){return"function"==typeof t}},
    "61333":function(t,r,e){var n=e(21899),o=e(10941),i=n.document,u=o(i)&&o(i.createElement);t.exports=function(t){return u?i.createElement(t):{}}},
    "63030":function(t,r,e){var n=e(21899),o=e(4911),i="__core-js_shared__",u=n[i]||o(i,{});t.exports=u},
    "65988":function(t,r,e){var n=e(21899),o=e(55746),i=e(2840),u=e(83937),a=e(96059),c=e(83894),s=n.TypeError,f=Object.defineProperty,p=Object.getOwnPropertyDescriptor,l="enumerable",v="configurable",h="writable";r.f=o?u?function(t,r,e){if(a(t),r=c(r),a(e),"function"==typeof t&&"prototype"===r&&"value"in e&&h in e&&!e[h]){var n=p(t,r);n&&n[h]&&(t[r]=e.value,e={configurable:v in e?e[v]:n[v],enumerable:l in e?e[l]:n[l],writable:!1})}return f(t,r,e)}:f:function(t,r,e){if(a(t),r=c(r),a(e),i)try{return f(t,r,e)}catch(t){}if("get"in e||"set"in e)throw s("Accessors not supported");return"value"in e&&(t[r]=e.value),t}},
    "68726":function(t,r,e){var n=e(82529),o=e(63030);(t.exports=function(t,r){return o[t]||(o[t]=void 0!==r?r:{})})("versions",[]).push({version:"3.21.1",mode:n?"pure":"global",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE",source:"https://github.com/zloirock/core-js"})},
    "69826":function(t,r,e){var n=e(21899).String;t.exports=function(t){try{return n(t)}catch(t){return"Object"}}},
    "72497":function(t,r,e){var n=e(53385),o=e(95981);t.exports=!!Object.getOwnPropertySymbols&&!o((function(){var t=Symbol();return!String(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&n&&n<41}))},
    "74529":function(t,r,e){var n=e(37026),o=e(48219);t.exports=function(t){return n(o(t))}},
    "76887":function(t,r,e){"use strict";var n=e(21899),o=e(79730),i=e(95329),u=e(57475),a=e(49677).f,c=e(37252),s=e(54058),f=e(86843),p=e(32029),l=e(90953),v=function(t){var r=function(e,n,i){if(this instanceof r){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,i)}return o(t,this,arguments)};return r.prototype=t.prototype,r};t.exports=function(t,r){var e,o,h,d,y,g,m,x,b=t.target,w=t.global,S=t.stat,O=t.proto,A=w?n:S?n[b]:(n[b]||{}).prototype,P=w?s:s[b]||p(s,b,{})[b],j=P.prototype;for(h in r)e=!c(w?h:b+(S?".":"#")+h,t.forced)&&A&&l(A,h),y=P[h],e&&(g=t.noTargetGet?(x=a(A,h))&&x.value:A[h]),d=e&&g?g:r[h],e&&typeof y==typeof d||(m=t.bind&&e?f(d,n):t.wrap&&e?v(d):O&&u(d)?i(d):d,(t.sham||d&&d.sham||y&&y.sham)&&p(m,"sham",!0),p(P,h,m),O&&(l(s,o=b+"Prototype")||p(s,o,{}),p(s[o],h,d),t.real&&j&&!j[h]&&p(j,h,d)))}},
    "78834":function(t,r,e){var n=e(18285),o=Function.prototype.call;t.exports=n?o.bind(o):function(){return o.apply(o,arguments)}},
    "79730":function(t,r,e){var n=e(18285),o=Function.prototype,i=o.apply,u=o.call;t.exports="object"==typeof Reflect&&Reflect.apply||(n?u.bind(i):function(){return u.apply(i,arguments)})},
    "82529":function(t){t.exports=!0},
    "82532":function(t,r,e){var n=e(95329),o=n({}.toString),i=n("".slice);t.exports=function(t){return i(o(t),8,-1)}},
    "83894":function(t,r,e){var n=e(46935),o=e(56664);t.exports=function(t){var r=n(t,"string");return o(r)?r:r+""}},
    "83937":function(t,r,e){var n=e(55746),o=e(95981);t.exports=n&&o((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype}))},
    "86843":function(t,r,e){var n=e(95329),o=e(24883),i=e(18285),u=n(n.bind);t.exports=function(t,r){return o(t),void 0===r?t:i?u(t,r):function(){return t.apply(r,arguments)}}},
    "89678":function(t,r,e){var n=e(21899),o=e(48219),i=n.Object;t.exports=function(t){return i(o(t))}},
    "90953":function(t,r,e){var n=e(95329),o=e(89678),i=n({}.hasOwnProperty);t.exports=Object.hasOwn||function(t,r){return i(o(t),r)}},
    "95329":function(t,r,e){var n=e(18285),o=Function.prototype,i=o.bind,u=o.call,a=n&&i.bind(u,u);t.exports=n?function(t){return t&&a(t)}:function(t){return t&&function(){return u.apply(t,arguments)}}},
    "95981":function(t){t.exports=function(t){try{return!!t()}catch(t){return!0}}},
    "96059":function(t,r,e){var n=e(21899),o=e(10941),i=n.String,u=n.TypeError;t.exports=function(t){if(o(t))return t;throw u(i(t)+" is not an object")}},
    "99418":function(t,r,e){var n=e(95329),o=0,i=Math.random(),u=n(1..toString);t.exports=function(t){return"Symbol("+(void 0===t?"":t)+")_"+u(++o+i,36)}},
    "99813":function(t,r,e){var n=e(21899),o=e(68726),i=e(90953),u=e(99418),a=e(72497),c=e(32302),s=o("wks"),f=n.Symbol,p=f&&f.for,l=c?f:f&&f.withoutSetter||u;t.exports=function(t){if(!i(s,t)||!a&&"string"!=typeof s[t]){var r="Symbol."+t;a&&i(f,t)?s[t]=f[t]:s[t]=c&&p?p(r):l(r)}return s[t]}},
    "78249": function(t, n, e) {
        var i;
        t.exports = (i = i || function(t, n) {
            var i;
            if ("undefined" != typeof window && window.crypto && (i = window.crypto),
            "undefined" != typeof self && self.crypto && (i = self.crypto),
            "undefined" != typeof globalThis && globalThis.crypto && (i = globalThis.crypto),
            !i && "undefined" != typeof window && window.msCrypto && (i = window.msCrypto),
            !i && void 0 !== e.g && e.g.crypto && (i = e.g.crypto),
            !i)
                try {
                    i = e(42480)
                } catch (t) {}
            var r = function() {
                if (i) {
                    if ("function" == typeof i.getRandomValues)
                        try {
                            return i.getRandomValues(new Uint32Array(1))[0]
                        } catch (t) {}
                    if ("function" == typeof i.randomBytes)
                        try {
                            return i.randomBytes(4).readInt32LE()
                        } catch (t) {}
                }
                throw new Error("Native crypto module could not be used to get secure random number.")
            }
              , s = Object.create || function() {
                function t() {}
                return function(n) {
                    var e;
                    return t.prototype = n,
                    e = new t,
                    t.prototype = null,
                    e
                }
            }()
              , o = {}
              , u = o.lib = {}
              , f = u.Base = {
                extend: function(t) {
                    var n = s(this);
                    return t && n.mixIn(t),
                    n.hasOwnProperty("init") && this.init !== n.init || (n.init = function() {
                        n.$super.init.apply(this, arguments)
                    }
                    ),
                    n.init.prototype = n,
                    n.$super = this,
                    n
                },
                create: function() {
                    var t = this.extend();
                    return t.init.apply(t, arguments),
                    t
                },
                init: function() {},
                mixIn: function(t) {
                    for (var n in t)
                        t.hasOwnProperty(n) && (this[n] = t[n]);
                    t.hasOwnProperty("toString") && (this.toString = t.toString)
                },
                clone: function() {
                    return this.init.prototype.extend(this)
                }
            }
              , h = u.WordArray = f.extend({
                init: function(t, n) {
                    t = this.words = t || [],
                    this.sigBytes = null != n ? n : 4 * t.length
                },
                toString: function(t) {
                    return (t || l).stringify(this)
                },
                concat: function(t) {
                    var n = this.words
                      , e = t.words
                      , i = this.sigBytes
                      , r = t.sigBytes;
                    if (this.clamp(),
                    i % 4)
                        for (var s = 0; s < r; s++) {
                            var o = e[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                            n[i + s >>> 2] |= o << 24 - (i + s) % 4 * 8
                        }
                    else
                        for (var u = 0; u < r; u += 4)
                            n[i + u >>> 2] = e[u >>> 2];
                    return this.sigBytes += r,
                    this
                },
                clamp: function() {
                    var n = this.words
                      , e = this.sigBytes;
                    n[e >>> 2] &= 4294967295 << 32 - e % 4 * 8,
                    n.length = t.ceil(e / 4)
                },
                clone: function() {
                    var t = f.clone.call(this);
                    return t.words = this.words.slice(0),
                    t
                },
                random: function(t) {
                    for (var n = [], e = 0; e < t; e += 4)
                        n.push(r());
                    return new h.init(n,t)
                }
            })
              , c = o.enc = {}
              , l = c.Hex = {
                stringify: function(t) {
                    for (var n = t.words, e = t.sigBytes, i = [], r = 0; r < e; r++) {
                        var s = n[r >>> 2] >>> 24 - r % 4 * 8 & 255;
                        i.push((s >>> 4).toString(16)),
                        i.push((15 & s).toString(16))
                    }
                    return i.join("")
                },
                parse: function(t) {
                    for (var n = t.length, e = [], i = 0; i < n; i += 2)
                        e[i >>> 3] |= parseInt(t.substr(i, 2), 16) << 24 - i % 8 * 4;
                    return new h.init(e,n / 2)
                }
            }
              , a = c.Latin1 = {
                stringify: function(t) {
                    for (var n = t.words, e = t.sigBytes, i = [], r = 0; r < e; r++) {
                        var s = n[r >>> 2] >>> 24 - r % 4 * 8 & 255;
                        i.push(String.fromCharCode(s))
                    }
                    return i.join("")
                },
                parse: function(t) {
                    for (var n = t.length, e = [], i = 0; i < n; i++)
                        e[i >>> 2] |= (255 & t.charCodeAt(i)) << 24 - i % 4 * 8;
                    return new h.init(e,n)
                }
            }
              , d = c.Utf8 = {
                stringify: function(t) {
                    try {
                        return decodeURIComponent(escape(a.stringify(t)))
                    } catch (t) {
                        throw new Error("Malformed UTF-8 data")
                    }
                },
                parse: function(t) {
                    return a.parse(unescape(encodeURIComponent(t)))
                }
            }
              , p = u.BufferedBlockAlgorithm = f.extend({
                reset: function() {
                    this._data = new h.init,
                    this._nDataBytes = 0
                },
                _append: function(t) {
                    "string" == typeof t && (t = d.parse(t)),
                    this._data.concat(t),
                    this._nDataBytes += t.sigBytes
                },
                _process: function(n) {
                    var e, i = this._data, r = i.words, s = i.sigBytes, o = this.blockSize, u = s / (4 * o), f = (u = n ? t.ceil(u) : t.max((0 | u) - this._minBufferSize, 0)) * o, c = t.min(4 * f, s);
                    if (f) {
                        for (var l = 0; l < f; l += o)
                            this._doProcessBlock(r, l);
                        e = r.splice(0, f),
                        i.sigBytes -= c
                    }
                    return new h.init(e,c)
                },
                clone: function() {
                    var t = f.clone.call(this);
                    return t._data = this._data.clone(),
                    t
                },
                _minBufferSize: 0
            })
              , g = (u.Hasher = p.extend({
                cfg: f.extend(),
                init: function(t) {
                    this.cfg = this.cfg.extend(t),
                    this.reset()
                },
                reset: function() {
                    p.reset.call(this),
                    this._doReset()
                },
                update: function(t) {
                    return this._append(t),
                    this._process(),
                    this
                },
                finalize: function(t) {
                    return t && this._append(t),
                    this._doFinalize()
                },
                blockSize: 16,
                _createHelper: function(t) {
                    return function(n, e) {
                        return new t.init(e).finalize(n)
                    }
                },
                _createHmacHelper: function(t) {
                    return function(n, e) {
                        return new g.HMAC.init(t,e).finalize(n)
                    }
                }
            }),
            o.algo = {});
            return o
        }(Math),
        i)
    },
    "52153": function(t, n, e) {
        var i;
        t.exports = (i = e(78249),
        function(t) {
            var n = i
              , e = n.lib
              , r = e.WordArray
              , s = e.Hasher
              , o = n.algo
              , u = []
              , f = [];
            !function() {
                function n(n) {
                    for (var e = t.sqrt(n), i = 2; i <= e; i++)
                        if (!(n % i))
                            return !1;
                    return !0
                }
                function e(t) {
                    return 4294967296 * (t - (0 | t)) | 0
                }
                for (var i = 2, r = 0; r < 64; )
                    n(i) && (r < 8 && (u[r] = e(t.pow(i, .5))),
                    f[r] = e(t.pow(i, 1 / 3)),
                    r++),
                    i++
            }();
            var h = []
              , c = o.SHA256 = s.extend({
                _doReset: function() {
                    this._hash = new r.init(u.slice(0))
                },
                _doProcessBlock: function(t, n) {
                    for (var e = this._hash.words, i = e[0], r = e[1], s = e[2], o = e[3], u = e[4], c = e[5], l = e[6], a = e[7], d = 0; d < 64; d++) {
                        if (d < 16)
                            h[d] = 0 | t[n + d];
                        else {
                            var p = h[d - 15]
                              , g = (p << 25 | p >>> 7) ^ (p << 14 | p >>> 18) ^ p >>> 3
                              , m = h[d - 2]
                              , y = (m << 15 | m >>> 17) ^ (m << 13 | m >>> 19) ^ m >>> 10;
                            h[d] = g + h[d - 7] + y + h[d - 16]
                        }
                        var v = i & r ^ i & s ^ r & s
                          , w = (i << 30 | i >>> 2) ^ (i << 19 | i >>> 13) ^ (i << 10 | i >>> 22)
                          , $ = a + ((u << 26 | u >>> 6) ^ (u << 21 | u >>> 11) ^ (u << 7 | u >>> 25)) + (u & c ^ ~u & l) + f[d] + h[d];
                        a = l,
                        l = c,
                        c = u,
                        u = o + $ | 0,
                        o = s,
                        s = r,
                        r = i,
                        i = $ + (w + v) | 0
                    }
                    e[0] = e[0] + i | 0,
                    e[1] = e[1] + r | 0,
                    e[2] = e[2] + s | 0,
                    e[3] = e[3] + o | 0,
                    e[4] = e[4] + u | 0,
                    e[5] = e[5] + c | 0,
                    e[6] = e[6] + l | 0,
                    e[7] = e[7] + a | 0
                },
                _doFinalize: function() {
                    var n = this._data
                      , e = n.words
                      , i = 8 * this._nDataBytes
                      , r = 8 * n.sigBytes;
                    return e[r >>> 5] |= 128 << 24 - r % 32,
                    e[14 + (r + 64 >>> 9 << 4)] = t.floor(i / 4294967296),
                    e[15 + (r + 64 >>> 9 << 4)] = i,
                    n.sigBytes = 4 * e.length,
                    this._process(),
                    this._hash
                },
                clone: function() {
                    var t = s.clone.call(this);
                    return t._hash = this._hash.clone(),
                    t
                }
            });
            n.SHA256 = s._createHelper(c),
            n.HmacSHA256 = s._createHmacHelper(c)
        }(Math),
        i.SHA256)
    },
}


);

// console.log(window.mts);
// 首先获取Y参数（请求参数）
function getYParam(page) {
    const params = {
        "funName": "search",
        "page": {
            "pageNo": page,
            "pageSize": 60
        },
        "param": {
            "bonusIds": null,
            "category1": null,
            "category2": null,
            "category3": null,
            "deliveryType": null,
            "fromCommission": null,
            "toCommission": null,
            "fromPrice": null,
            "toPrice": null,
            "hasCoupon": null,
            "isHot": null,
            "isNeedPreSale": null,
            "isPinGou": null,
            "isZY": null,
            "isCare": null,
            "lock": null,
            "orientationFlag": null,
            "sort": null,
            "sortName": null,
            "keyWord": "",
            "searchType": "st3",
            "keywordType": "kt0",
            "hasSimRecommend": 1,
            "requestScene": 0,
            "requestExtFields": [
                "shopInfo",
                "orientations"
            ],
            "source": 20310
        },
        "clientPageId": "jingfen_pc"
    };
    
    // 使用JSON.stringify将对象转为字符串
    return window.mts('84426')(params);
}

// 然后使用SHA256加密
function getSignature(yParam) {
    // 获取SHA256加密函数
    const SHA256 = window.mts('52153');
    // 对Y参数进行加密
    return SHA256(yParam);
}

// 完整调用过程
function getEncryptedData(page) {
    const yParam = getYParam(page);
    const signature = getSignature(yParam);
    return signature;
}

// 使用示例
const result = getEncryptedData(1).toString();
console.log(result);