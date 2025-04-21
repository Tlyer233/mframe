// [Tool]框架内存 
var mframe = {};
/** mframe.memory.config
 * proxy(boolean):     是否开启代理(default:false)
 * pluginArray[array]: 插件列表
 * jsdomArray[array]:  注入的jsdom元素,命名必须为jsdomXXX
 */
mframe.memory = {
    // mframe相关配置的内存空间
    config: {
        proxy: false,   
        pluginArray: [
            {// 插件1: PDF查看器
                description: "Portable Document Format",
                filename: "internal-pdf-viewer",
                name: "PDF Viewer",
                mimeTypeArray: [
                    {
                        description: "Portable Document Format",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "application/pdf",
                    },
                    {
                        description: "PDF Embedded Document",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "application/x-google-chrome-pdf",
                    }
                ]
            },
            {// 插件2: Chrome Native Client
                description: "Native Client Module",
                filename: "internal-nacl-plugin",
                name: "Native Client",
                mimeTypeArray: [
                    {
                        description: "Native Client Executable",
                        enabledPlugin: "Plugin",
                        suffixes: "nexe",
                        type: "application/x-nacl",
                    },
                    {
                        description: "Portable Native Client Executable",
                        enabledPlugin: "Plugin",
                        suffixes: "pexe",
                        type: "application/x-pnacl",
                    }
                ]
            },
            {// 插件3: Widevine内容解密模块
                description: "Enables Widevine licenses for playback of HTML audio/video content.",
                filename: "widevinecdmadapter.dll",
                name: "Widevine Content Decryption Module",
                mimeTypeArray: [
                    {
                        description: "Widevine Content Decryption Module",
                        enabledPlugin: "Plugin",
                        suffixes: "",
                        type: "application/x-ppapi-widevine-cdm",
                    }
                ]
            },
            {// 插件4: Chrome媒体路由器
                description: "Handles media routing for Cast-enabled sites",
                filename: "internal-media-router",
                name: "Chrome Media Router",
                mimeTypeArray: [
                    {
                        description: "Google Cast",
                        enabledPlugin: "Plugin",
                        suffixes: "",
                        type: "application/vnd.google.cast.receiver",
                    },
                    {
                        description: "Media Router Implementation",
                        enabledPlugin: "Plugin",
                        suffixes: "",
                        type: "application/x-media-router-plugin",
                    }
                ]
            },
            { // 插件5: Chromium PDF插件
                description: "Chromium PDF Renderer",
                filename: "chrome-pdf.plugin",
                name: "Chromium PDF Plugin",
                mimeTypeArray: [
                    {
                        description: "Chromium PDF Format",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "application/x-chromium-pdf",
                    },
                    {
                        description: "PDF Inline Document",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "text/pdf",
                    },
                    {
                        description: "PDF Embedded Content",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "application/pdf-embedded",
                    }
                ]
            }
        ],
        jsdomArray : ['jsdomDocument', 'jsdomWindow', 'jsdomNavigator', ],
    },
};

// 一.HTMLXXXElement的内存空间
mframe.memory.htmlelements = {};

// 二.jsdom专属的空间 mframe.memory.jsdom.document
mframe.memory.jsdom = {};
for (let i = 0; i < mframe.memory.config.jsdomArray.length; i++) {
    const elementName = mframe.memory.config.jsdomArray[i];
    if (typeof global[elementName] !== 'undefined') {
        // 根据元素名称确定在 mframe.memory.jsdom 中的属性名
        const propertyName = elementName.replace('jsdom', '').toLowerCase();
        mframe.memory.jsdom[propertyName] = global[elementName];  // 将元素存储到 mframe 内存中
        delete global[elementName];// 在全局中删除该元素(保证只有通过我们的内存才能访问)
    }
}
// [Tool]统一错误类
mframe.memory.get_invocation_error = function get_invocation_error() {
    let e = new Error();
    e.name = "TypeError";
    e.message = "Illegal constructor";
    e.stack = "VM988:1 Uncaught TypeError: Illegal invocation \r\n at <anonymous>:1:21";
    return e;
}
// [Tool]代理方法
/**
 * 对某个"东西"进行代理Proxy后, 以后是使用"代理对象", 而不是原对象
 * eval(`${o} = new Proxy(${o}, ${handler})`); 帮你完成 window = proxy("window")的操作
 * @param {需要代理的对象(str)} o 
一. 输出彩色文本到控制台
console.log('\x1b[33m%s\x1b[0m', '这是黄色的文字'); // 输出黄色文本
console.log('\x1b[31m%s\x1b[0m', '这是红色的文字'); // 输出红色文本
console.log('\x1b[36m%s\x1b[0m', '这是青色的文字'); // 输出青色文本
console.log('\x1b[32m%s\x1b[0m', '这是绿色的文字'); // 输出绿色文本
*/

mframe.proxy = function (o) {
    if (mframe.memory.config.proxy == false) return o;
    // 定义特殊属性数组(这些属性,尽管代理还是可以正常访问)
    const specialProperties = ['prototype', 'constructor',];
    return new Proxy(o, {
        set(target, property, value, receiver) {
            // 特殊属性直接通过原对象处理
            if (specialProperties.includes(property)) {
                return Reflect.set(target, property, value);
            }

            console.log(`方法:set 对象 ${target.constructor.name} 属性 ${property} 值类型 ${typeof value}`);
            return Reflect.set(target, property, value, receiver);
        },
        get(target, property, receiver) {
            
            // 特殊属性直接通过原对象处理
            if (specialProperties.includes(property)) {
                return Reflect.get(target, property, receiver);
            }

            const value = Reflect.get(target, property, receiver);
            const displayValue = typeof value === 'symbol' ? `[Symbol: ${value.description}]` : value;

            if (value === undefined)
                console.log(`方法:\x1b[32mget\x1b[0m 对象 ${target.constructor.name} 属性 ${String(property)} 值类型 \x1b[31m${typeof value}\x1b[0m`);
            else
                console.log(`方法:\x1b[32mget\x1b[0m 对象 ${target.constructor.name} 属性 ${String(property)} 值类型 ${typeof value}`);

            return value;
        }
    });
}


// [Tool] toString 保护
!(() => {
    "use strict";
    const $toString = Function.toString;
    const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
    const myToString = function() {
        return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
    };
    function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,
            "configurable": true,
            "writable": true,
            "value": value
        })
    };
    delete Function.prototype['toString']; //删除原型链上的toString
    set_native(Function.prototype, "toString", myToString); //自己定义个getter方法
    set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }"); //套个娃 保护一下我们定义的toString 否则就暴露了
    mframe.safefunction = (func) => {
        set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`);
    }; //导出函数到globalThis
}).call(this);


////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

const { JSDOM } = require('jsdom');
const dom = new JSDOM(` 
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <!--[if lt IE 9]><script r='m'>document.createElement("section")</script><![endif]-->
        <meta content="Z5C5cpze1cRruUpcpZ9naTO2yex.vPBqXzsflcFgeRG" r="m">
        
        <script type="text/javascript" charset="utf-8" src="/H9Ml1X1DHajj/BmTojS75ExXf.6771a74.js" r="m"></script>
    </head>
</html>
`); 

webcrypto = crypto;
mframe.memory.jsdom={};
mframe.memory.jsdom.window = dom.window;
mframe.memory.jsdom.document = dom.window.document;



////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////





mframe.memory.config.proxy=true
// 创建 Crypto 类

_crypto = crypto; // 保留从vm2加载的crypto
var Crypto = function Crypto() {
    throw new TypeError("Illegal constructor");
}; mframe.safefunction(Crypto);

Object.defineProperties(Crypto.prototype, {
    [Symbol.toStringTag]: {
        value: "Crypto",
        configurable: true,
    }
})

// 使用原生crypto对象的方法
var crypto = {}
///////////////////////////////////////////
Crypto.prototype.getRandomValues = function getRandomValues(array) {
    return _crypto.getRandomValues(array);
}; mframe.safefunction(Crypto.prototype.getRandomValues)

Crypto.prototype.randomUUID = function randomUUID(array) {
    return _crypto.randomUUID(array);
}; mframe.safefunction(Crypto.prototype.randomUUID)

// 使用SubtleCrypto
// crypto.subtle = _crypto.subtle ? mframe.proxy(_crypto.subtle) : mframe.proxy(new (class SubtleCrypto { }));
///////////////////////////////////////////
crypto.__proto__ = Crypto.prototype

crypto = mframe.proxy(crypto)
Crypto = mframe.proxy(Crypto)
var Storage = function Storage() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Storage)

Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        configurable: true,
    }
})


//////////////////////////////////
//===================Storage 的原型属性 START===================
// 长度(hook但未保护hook方法)
Storage.prototype.length = 0;
Storage.prototype.__defineGetter__("length", function length() {
    return Object.keys(this).length;
})
// 通过键获取值
Storage.prototype.getItem = function getItem(keyName) {
    console.log("Storage的getItem, keyName: ", keyName, "存的值是:", this[keyName]);

    debugger
    return this[keyName] || null; // 这个this是指向实例的
}; mframe.safefunction(Storage.prototype.getItem);

// 设置键值对
Storage.prototype.setItem = function setItem(keyName, keyValue) {
    this[keyName] = keyValue;
    return undefined;
}; mframe.safefunction(Storage.prototype.setItem);

// 清空所有
Storage.prototype.clear = function clear() {
    let keyArray = Object.keys(this);
    for (let i = 0; i < keyArray.length; i++) {
        delete this[keyArray[i]];
    }
    return undefined;
}; mframe.safefunction(Storage.prototype.clear);

// 返回第index个value
Storage.prototype.key = function key(index) {
    return Object.keys(this)[index];
}; mframe.safefunction(Storage.prototype.key);

// 删除指定的键
Storage.prototype.removeItem = function removeItem(keyName) {
    delete this[keyName];
    return undefined;
}; mframe.safefunction(Storage.prototype.removeItem);
//================ ↑↑↑Storage 的原型属性 END↑↑↑ ================
//////////////////////////////////


/** 小变量定义 && 原型链的定义 */
var localStorage = {};

// h5st这个应该缓存在mframe的内存中
localStorage['WQ_gather_wgl1'] = { "v": "dee3cb94c529ac524a0996146a0176b8", "t": 1743691606906, "e": 31536000 };
localStorage['WQ_gather_cv1'] = { "v": "bb6feb71f0a492c0860d44d557d509be", "t": 1743865720216, "e": 31536000 };
localStorage['WQ_dy1_vk'] = { "5.0": { "b5216": { "e": 31536000, "v": "aw9p3rdscsxrxd29", "t": 1741588342540 } } };
localStorage['WQ_dy1_tk_algo'] = { "aw9p3rdscsxrxd29": { "b5216": { "v": "eyJ0ayI6InRrMDN3YWYzMjFiZDkxOG5hb1R6MjVjM0FpMnZZeUtXcXhkcEhRNzlxTWxnMzNGeklhaVpLeUdqZ0xVUVJWTWZiOGZoUjRtTkxUMEVBQ2hNRUNkanNfQzBWVWQzIiwiYWxnbyI6ImZ1bmN0aW9uIHRlc3QodGssZnAsdHMsYWksYWxnbyl7dmFyIHJkPSdLcHVPQjVndTBpOGInO3ZhciBzdHI9XCJcIi5jb25jYXQodGspLmNvbmNhdChmcCkuY29uY2F0KHRzKS5jb25jYXQoYWkpLmNvbmNhdChyZCk7cmV0dXJuIGFsZ28uTUQ1KHN0cik7fSJ9", "e": 86400, "t": 1743865720414 } } }
localStorage['_$rc'] = 'nyzoIC0GMP_YPpkzSNJDPvE.mqKCOq2L7YhYuP1M1bI0GaX0hnROh6w.ZTW'; // [瑞5]
// localStorage['$_YWTU'] = '1XYrRYRYAb1WmiPXvS.Vciic7yKhgyDi.Vy1Sn7wMSL'
localStorage.__proto__ = Storage.prototype;
localStorage = mframe.proxy(localStorage);

var sessionStorage = {};
sessionStorage.__proto__ = Storage.prototype;
sessionStorage = mframe.proxy(sessionStorage);



var Screen = function Screen() {
    debugger;
    throw new TypeError('Screen 不允许被new');
}; mframe.safefunction(Screen)
Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true,
    }
})

screen = {}
//////////////////////////////////

//////////////////////////////////
screen.__proto__ = Screen.prototype;

/**代理 */
Screen = mframe.proxy(Screen)
var EventTarget = function EventTarget() { }; mframe.safefunction(EventTarget)
Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true,
    }
})

// 方法
EventTarget.prototype.addEventListener = function addEventListener(arg) {
    console.log(`EventTarget.prototype.addEventListener:${arg}`);
}; mframe.safefunction(EventTarget.prototype.addEventListener)
EventTarget.prototype.removeEventListener = function removeEventListener(arg) {
    console.log(`EventTarget.prototype.removeEventListener:${arg}`);
}; mframe.safefunction(EventTarget.prototype.removeEventListener)
EventTarget.prototype.dispatchEvent = function dispatchEvent(arg) {
    console.log(`EventTarget.prototype.dispatchEvent:${arg}`);
}; mframe.safefunction(EventTarget.prototype.dispatchEvent)


// 代理
EventTarget = mframe.proxy(EventTarget)
var WindowProperties = function () {
    debugger;
    throw new TypeError('WindowProperties不允许被new')
}; mframe.safefunction(WindowProperties);

Object.defineProperties(WindowProperties.prototype, {
    [Symbol.toStringTag]: {
        value: "WindowProperties",
        configurable: true,
    }
});


WindowProperties.prototype.__proto__ = EventTarget.prototype




window = this;
var Window = function Window() {
    debugger;
    throw new TypeError('WindowProperties不允许被new');
}; mframe.safefunction(Window)
Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        configurable: true,
    }
})


//////////////////////////////////
// 原型属性
Window.prototype.PERSISTENT = 1;
Window.prototype.TEMPORARY = 0;

// ///////////////////////////////////////////////////////
// 方法
window.setTimeout = function setTimeout(x, d) { // 小window才是this
    if (mframe.memory.jsdom.window) { // 如果有jsdomn
        return mframe.memory.jsdom.window.setTimeout(arguments);
    }

    //x 有可能是方法 也有可能是文本
    typeof (x) == "function" ? x() : undefined;
    typeof (x) == "string" ? eval(x) : undefined;
    //正确应该 生成UUID  并且保存到内存
    return 0;
}; mframe.safefunction(window.setTimeout);
window["clearInterval"] = function clearInterval(arguments) {
    if (mframe.memory.jsdom.window) { // 如果有jsdomn
        return mframe.memory.jsdom.window.clearInterval(arguments);
    }
}; mframe.safefunction(window["clearInterval"]);
window["setInterval"] = function setInterval(arguments) {
    if (mframe.memory.jsdom.window) { // 如果有jsdomn
        return mframe.memory.jsdom.window.setInterval(arguments);
    }
}; mframe.safefunction(window["setInterval"]);
// window.execScript = function execScript() { // 瑞5
//     window.eval(arguments[0]);
// }; mframe.safefunction(window.execScript);
// window.DOMParser = function DOMParser() { //瑞5, 不能补?
//     debugger;
//     return new window.DOMParser;
// }; mframe.safefunction(window.DOMParser);
window["Request"] = function Request() { debugger; }; mframe.safefunction(window["Request"]); // 瑞5
window["fetch"] = function fetch() { debugger; }; mframe.safefunction(window["fetch"]);       // 瑞5
//////////////////////////////////////////////////
//属性
window.outerWidth = 2050;
window.outerHeight = 1154;
window.devicePixelRatio = 1.125



window.crypto = crypto;
window.screen = screen;
window.localStorage = localStorage;
window.sessionStorage = sessionStorage;
window.chrome = mframe.proxy(new (class chrome { }));
window.top = window; //[瑞5] 这玩意居然等于window
window.self = window; //[瑞5]
window.name = ""



window.Y = {
    "0": "GET",
    "1": "https://ctbpsp.com/cutominfoapi/recommand/type/5/pagesize/10/currentpage/3?province=&industry=",
    "2": true
}
window.PcSign = {
    "_token": "tk03waf321bd918naoTz25c3Ai2vYyKWqxdpHQ79qMlg33FzIaiZKyGjgLUQRVMfb8fhR4mNLT0EAChMECdjs_C0VUd3",
    "_defaultToken": "",
    "_isNormal": true,
    "_appId": "b5216",
    "_defaultAlgorithm": {},
    "_algos": {},
    "_version": "5.0",
    "_fingerprint": "aw9p3rdscsxrxd29",
    "_debug": false
}
if (mframe.memory.jsdom.window != undefined)
    window.btoa = mframe.memory.jsdom.window.btoa
//////////////////////////////////

/** 小变量定义 && 原型链的定义 */
Window.prototype.__proto__ = WindowProperties.prototype;
window.__proto__ = Window.prototype;

/**代理 */
Window = mframe.proxy(Window)
window = mframe.proxy(window)
delete global;
delete Buffer;
delete require;
require=undefined;
var Location = function () {
    debugger;
    throw new TypeError('Location 不允许被new')
}; mframe.safefunction(Location);

Object.defineProperties(Location.prototype, {
    [Symbol.toStringTag]: {
        value: "Location",
        configurable: true,
    }
});
location = {}; //针对有大小写的, Location/location, Window/window
location.__proto__ = Location.prototype;

///////////////////////////////////////////////////
location.href = 'https://ec.chng.com.cn/channel/home/#/';
location.origin = 'https://ec.chng.com.cn';
location.host = 'ec.chng.com.cn';
location.protocol = 'https:';
location.hostname = 'ec.chng.com.cn';
location.port = '';
location.pathname = '/channel/home/';
location.search = '';
location.hash = '#/';

location.ancestorOrigins= {},
///////////////////////////////////////////////////

location = mframe.proxy(location)
var IDBFactory = function IDBFactory() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(IDBFactory)
Object.defineProperties(IDBFactory.prototype, {
    [Symbol.toStringTag]: {
        value: "IDBFactory",
        configurable: true,
    }
})









///////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.IDBFactory = {};

//============== Constant START ==================
Object.defineProperty(IDBFactory, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(IDBFactory, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
IDBFactory.prototype["cmp"] = function cmp() { debugger; }; mframe.safefunction(IDBFactory.prototype["cmp"]);
IDBFactory.prototype["databases"] = function databases() { debugger; }; mframe.safefunction(IDBFactory.prototype["databases"]);
IDBFactory.prototype["deleteDatabase"] = function deleteDatabase() { debugger; }; mframe.safefunction(IDBFactory.prototype["deleteDatabase"]);
IDBFactory.prototype["open"] = function open() { debugger; }; mframe.safefunction(IDBFactory.prototype["open"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////////

// indexedDB = {};
// indexedDB.__proto__ = IDBFactory.prototype;
// indexedDB = mframe.proxy(indexedDB);
var Navigator = function () {
    debugger;
    throw new TypeError('Navigator 不允许被new')
}; mframe.safefunction(Navigator);

Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true,
    }
});

navigator = {};
///////////////////////////////////////////////////
navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36';

navigator.webdriver = false;
navigator.language = 'zh-CN';
navigator.languages = ['zh-CN', 'en', 'zh']

navigator.appVersion = '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
navigator.platform = 'Win32';
navigator.hardwareConcurrency  = 16


Navigator.prototype["getBattery"] = function getBattery() { 
    return new Promise();
 }; mframe.safefunction(Navigator.prototype["getBattery"]);
///////////////////////////////////////////////////



navigator.__proto__ = Navigator.prototype;

// 解决Navigator.prototype.属性抛异常, 只能通过navigator.属性去调用 (本质上可以理解为代理的简写); Navigator中所有属性都是这样的
for (var prototype_ in Navigator.prototype) {
    navigator[prototype_] = Navigator.prototype[prototype_];
    Navigator.prototype.__defineGetter__(prototype_, function () {
        debugger;// 啥网站啊,这都检测-_-!
        throw new TypeError('不允许Navigator.prototype.属性 这样的操作')
    });
}




navigator = mframe.proxy(navigator)
var MimeType = function MimeType() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(MimeType)
Object.defineProperties(MimeType.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeType",
        configurable: true,
    }
})


//////////////////////////////////
var curMemoryArea = mframe.memory.MimeType = {};

//%%%%%%% Attribute START %%%%%%%%%%
// type
curMemoryArea.type_getter = function type() { debugger; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", { value: "get type", configurable: true, });
Object.defineProperty(MimeType.prototype, "type", { get: curMemoryArea.type_getter, enumerable: true, configurable: true, });
curMemoryArea.type_smart_getter = function type() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的type的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
MimeType.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// suffixes
curMemoryArea.suffixes_getter = function suffixes() { debugger; }; mframe.safefunction(curMemoryArea.suffixes_getter);
Object.defineProperty(curMemoryArea.suffixes_getter, "name", { value: "get suffixes", configurable: true, });
Object.defineProperty(MimeType.prototype, "suffixes", { get: curMemoryArea.suffixes_getter, enumerable: true, configurable: true, });
curMemoryArea.suffixes_smart_getter = function suffixes() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的suffixes的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.suffixes_smart_getter);
MimeType.prototype.__defineGetter__("suffixes", curMemoryArea.suffixes_smart_getter);

// description
curMemoryArea.description_getter = function description() { debugger; }; mframe.safefunction(curMemoryArea.description_getter);
Object.defineProperty(curMemoryArea.description_getter, "name", { value: "get description", configurable: true, });
Object.defineProperty(MimeType.prototype, "description", { get: curMemoryArea.description_getter, enumerable: true, configurable: true, });
curMemoryArea.description_smart_getter = function description() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的description的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.description_smart_getter);
MimeType.prototype.__defineGetter__("description", curMemoryArea.description_smart_getter);

// enabledPlugin
curMemoryArea.enabledPlugin_getter = function enabledPlugin() { debugger; }; mframe.safefunction(curMemoryArea.enabledPlugin_getter);
Object.defineProperty(curMemoryArea.enabledPlugin_getter, "name", { value: "get enabledPlugin", configurable: true, });
Object.defineProperty(MimeType.prototype, "enabledPlugin", { get: curMemoryArea.enabledPlugin_getter, enumerable: true, configurable: true, });
curMemoryArea.enabledPlugin_smart_getter = function enabledPlugin() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的enabledPlugin的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.enabledPlugin_smart_getter);
MimeType.prototype.__defineGetter__("enabledPlugin", curMemoryArea.enabledPlugin_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////

// 保持原型属性和实例属性相同(如果没有原型,会直接报错)
for (let prototypeName in MimeType.prototype) {
    // 这样不会触发 直接访问实例属性的报错
    const descriptor = Object.getOwnPropertyDescriptor(MimeType.prototype, prototypeName);
    if (descriptor && (descriptor.value && typeof descriptor.value === 'function')) { //是方法

    } else {// 是属性or类
        MimeType.prototype.__defineGetter__(prototypeName, function () {
            return this[prototypeName];
        })
    }
}

/** 支持内部 new MimeType
 * 
 * @param {*} mimeTypeObj 
 * @returns 
 * 传入mimeTypeObj示例:
 * 
var mm = mframe.memory.MimeType.new({
    description: "Portable Document Format1",
    enabledPlugin: "Plugin1",
    suffixes: "pd1f",
    type: "application/pdf1",
});
 */
mframe.memory.MimeType.new = function (mimeTypeObj, initPlugin) {
    var mimeType = {};
    mimeType.description = mimeTypeObj.description;
    mimeType.enabledPlugin = initPlugin; //这个属性是Plugin的实例
    mimeType.suffixes = mimeTypeObj.suffixes;
    mimeType.type = mimeTypeObj.type;
    mimeType.__proto__ = MimeType.prototype;
    return mimeType;
}


/**代理 */
MimeType = mframe.proxy(MimeType)
mframe.memory.Plugin = {}; // 内存给Plugin开一片空间, 存储Plugin的全局变量,避免污染window的全局

var Plugin = function Plugin() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Plugin)


mframe.memory.Plugin.iterator = function values() { // 迭代器
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.Plugin.iterator);

Object.defineProperties(Plugin.prototype, {
    [Symbol.toStringTag]: {
        value: "Plugin",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.Plugin.iterator,
        configurable: true
    },
})


//////////////////////////////////
//===================Plugin 的原型属性 START===================
Plugin.prototype.name = "";
Plugin.prototype.filename = "";
Plugin.prototype.description = "";
Plugin.prototype.length = 0;

Plugin.prototype.item = function item() { debugger; }; mframe.safefunction(Plugin.prototype.item);
Plugin.prototype.namedItem = function namedItem() { debugger; }; mframe.safefunction(Plugin.prototype.namedItem);
//================ ↑↑↑Plugin 的原型属性 END↑↑↑ ================

//////////////////////////////////


// 保持原型属性和实例属性相同(如果没有原型,会直接报错)
for (let prototypeName in Plugin.prototype) {
    if (typeof (Plugin.prototype[prototypeName]) != "function") {
        Plugin.prototype.__defineGetter__(prototypeName, function () {
            return this[prototypeName];
        })
    }
}


/** 支持内部 new Plugin
 * 
 * @param {*} pluginObj 包含Plugin基本信息的对象
 * Plugin不允许被new, 那Plugin从哪来呢???
 * 但Plugin只是我们用, 网站只会检测, 不可能new一个Plugin往里加入
 * 所以new只有我们会用, so, 给一个方法来new即可
传入的pluginObj示例:
var aa = mframe.memory.Plugin.new({
    description: "Portable Document Format",
    filename: "internal-pdf-viewer",
    name: "PDF Viewer",
    mimeTypeArray: [
        {
          description: "Portable Document Format",
          enabledPlugin: "Plugin",
          suffixes: "pdf",
          type: "application/pdf",
        },
        {
          description: "Portable Document Format1",
          enabledPlugin: "Plugin1",
          suffixes: "pd1f",
          type: "application/pdf1",
        },
    ]
});
 */
mframe.memory.Plugin.new = function (pluginObj) {
    var plugin = {};
    plugin.description = pluginObj.description;
    plugin.filename = pluginObj.filename;
    plugin.name = pluginObj.name;

    for (let i = 0; i < pluginObj.mimeTypeArray.length; i++) {
        // part1: MineType索引: MineType实例
        plugin[i] = mframe.memory.MimeType.new(pluginObj.mimeTypeArray[i], plugin);

        // part2: MineType名字表示; 处理名字为灰色的
        Object.defineProperty(
            plugin,                                    // 哪个对象
            pluginObj.mimeTypeArray[i].type,           // 哪个属性
            { value: pluginObj.mimeTypeArray[i] }      // 属性的值,还是属性的是否可写...
        );
    }
    plugin.length = pluginObj.mimeTypeArray.length;
    plugin.__proto__ = Plugin.prototype;
    /** 实例和原型的 属性名相同, 原型的该属性会被实例的该属性覆盖*/
    return plugin;
}


/**代理 */
Plugin = mframe.proxy(Plugin)
mframe.memory.PluginArray = {}
var PluginArray = function PluginArray() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(PluginArray)

mframe.memory.PluginArray.iterator = function values() {
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.PluginArray.iterator);
Object.defineProperties(PluginArray.prototype, {
    [Symbol.toStringTag]: {
        value: "PluginArray",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.PluginArray.iterator,
        configurable: true,
    },
})


//////////////////////////////////
var curMemoryArea = mframe.memory.PluginArray;

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// length
curMemoryArea.length_getter = function length() { debugger; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(PluginArray.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    let defaultValue = this.length;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    return defaultValue; // 已经正确修改返回值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
PluginArray.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
PluginArray.prototype["item"] = function item() { debugger; }; mframe.safefunction(PluginArray.prototype["item"]);
PluginArray.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(PluginArray.prototype["namedItem"]);
PluginArray.prototype["refresh"] = function refresh() { debugger; }; mframe.safefunction(PluginArray.prototype["refresh"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////


// window里面不能有 PluginArray 的实例, 只有navigator中可以有
mframe.memory.PluginArray._ ={};
for (let index = 0; index < mframe.memory.config.pluginArray.length; index++) {
    // part1: 索引
    mframe.memory.PluginArray._[index] = mframe.memory.Plugin.new( mframe.memory.config.pluginArray[index]);
    // part2: 名字变色
    Object.defineProperty(mframe.memory.PluginArray._,
        mframe.memory.config.pluginArray[index].name, {
        value: mframe.memory.config.pluginArray[index]
    });
    mframe.memory.PluginArray._.length = mframe.memory.config.pluginArray.length;
}

mframe.memory.PluginArray._.__proto__ = PluginArray.prototype;
navigator.plugins = mframe.memory.PluginArray._;

/**代理 */
navigator.plugins = mframe.proxy(navigator.plugins)
mframe.memory.MimeTypeArray = {}
var MimeTypeArray = function MimeTypeArray() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(MimeTypeArray)

mframe.memory.MimeTypeArray.iterator = function values() {
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.MimeTypeArray.iterator);
Object.defineProperties(MimeTypeArray.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeTypeArray",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.MimeTypeArray.iterator,
        configurable: true,
    },
})


//////////////////////////////////
var curMemoryArea = mframe.memory.MimeTypeArray;

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// length
curMemoryArea.length_getter = function length() { debugger; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(MimeTypeArray.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    let defaultValue = this.length;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    return defaultValue; // 已经正确修改返回值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
MimeTypeArray.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
MimeTypeArray.prototype["item"] = function item() { debugger; }; mframe.safefunction(MimeTypeArray.prototype["item"]);
MimeTypeArray.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(MimeTypeArray.prototype["namedItem"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////



mframe.memory.MimeTypeArray._ = {}
// 初始化所有MimeType并和PluginArray建立关联

let mimeTypeIndex = 0; // 记录mimeTypeArray的长度
for (let pluginIndex = 0; pluginIndex < mframe.memory.config.pluginArray.length; pluginIndex++) {
    const pluginConfig = mframe.memory.config.pluginArray[pluginIndex];
    const pluginInstance = mframe.memory.PluginArray._[pluginIndex];
    
    for (let mimeIndex = 0; mimeIndex < pluginConfig.mimeTypeArray.length; mimeIndex++) {
        const mimeConfig = pluginConfig.mimeTypeArray[mimeIndex];
        
        // 创建MimeType实例，enabledPlugin参数传入对应的Plugin实例
        const mimeInstance = mframe.memory.MimeType.new(mimeConfig, pluginInstance);
        
        // 添加到MimeTypeArray中，使用数字索引
        mframe.memory.MimeTypeArray._[mimeTypeIndex] = mimeInstance;
        
        // 添加到MimeTypeArray中，使用类型名称作为索引
        Object.defineProperty(mframe.memory.MimeTypeArray._, mimeConfig.type, {
            value: mimeInstance,
            enumerable: false,
            configurable: true
        });
        
        mimeTypeIndex++;
    }
}
mframe.memory.MimeTypeArray._.length = mimeTypeIndex; // mimeTypeArray的长度


mframe.memory.MimeTypeArray._.__proto__ = MimeTypeArray.prototype;
navigator.mimeTypes = mframe.memory.MimeTypeArray._;


/**代理 */
navigator.mimeTypes = mframe.proxy(navigator.mimeTypes)

var History = function () { 
    debugger;
    throw new TypeError('History 不允许被new')
}; mframe.safefunction(History);

Object.defineProperties(History.prototype, {
    [Symbol.toStringTag]: {
        value: "History",
        configurable: true,
    }
});


///////////////////////////////////////////////////
History.prototype.back = function back(){debugger;}; mframe.safefunction(History.prototype.back);


///////////////////////////////////////////////////
history= {} 
history.__proto__ = History.prototype;
history=mframe.proxy(history) // 代理
var Node = function Node() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Node)

Object.defineProperties(Node.prototype, {
    [Symbol.toStringTag]: {
        value: "Node",
        configurable: true,
    }
})


////////////////Prototype Prototype Prototype////////////////
var curMemoryArea = mframe.memory.Node = {};

//============== Constant START ==================
Object.defineProperty(Node, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Node, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Node, "ELEMENT_NODE", { configurable: false, enumerable: true, value: 1, writable: false, });
Object.defineProperty(Node, "ATTRIBUTE_NODE", { configurable: false, enumerable: true, value: 2, writable: false, });
Object.defineProperty(Node, "TEXT_NODE", { configurable: false, enumerable: true, value: 3, writable: false, });
Object.defineProperty(Node, "CDATA_SECTION_NODE", { configurable: false, enumerable: true, value: 4, writable: false, });
Object.defineProperty(Node, "ENTITY_REFERENCE_NODE", { configurable: false, enumerable: true, value: 5, writable: false, });
Object.defineProperty(Node, "ENTITY_NODE", { configurable: false, enumerable: true, value: 6, writable: false, });
Object.defineProperty(Node, "PROCESSING_INSTRUCTION_NODE", { configurable: false, enumerable: true, value: 7, writable: false, });
Object.defineProperty(Node, "COMMENT_NODE", { configurable: false, enumerable: true, value: 8, writable: false, });
Object.defineProperty(Node, "DOCUMENT_NODE", { configurable: false, enumerable: true, value: 9, writable: false, });
Object.defineProperty(Node, "DOCUMENT_TYPE_NODE", { configurable: false, enumerable: true, value: 10, writable: false, });
Object.defineProperty(Node, "DOCUMENT_FRAGMENT_NODE", { configurable: false, enumerable: true, value: 11, writable: false, });
Object.defineProperty(Node, "NOTATION_NODE", { configurable: false, enumerable: true, value: 12, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_DISCONNECTED", { configurable: false, enumerable: true, value: 1, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_PRECEDING", { configurable: false, enumerable: true, value: 2, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_FOLLOWING", { configurable: false, enumerable: true, value: 4, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_CONTAINS", { configurable: false, enumerable: true, value: 8, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_CONTAINED_BY", { configurable: false, enumerable: true, value: 16, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", { configurable: false, enumerable: true, value: 32, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// nodeType
curMemoryArea.nodeType_getter = function nodeType() { debugger; }; mframe.safefunction(curMemoryArea.nodeType_getter);
Object.defineProperty(curMemoryArea.nodeType_getter, "name", { value: "get nodeType", configurable: true, });
Object.defineProperty(Node.prototype, "nodeType", { get: curMemoryArea.nodeType_getter, enumerable: true, configurable: true, });
curMemoryArea.nodeType_smart_getter = function nodeType() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的nodeType的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nodeType_smart_getter);
Node.prototype.__defineGetter__("nodeType", curMemoryArea.nodeType_smart_getter);

// nodeName
curMemoryArea.nodeName_getter = function nodeName() { debugger; }; mframe.safefunction(curMemoryArea.nodeName_getter);
Object.defineProperty(curMemoryArea.nodeName_getter, "name", { value: "get nodeName", configurable: true, });
Object.defineProperty(Node.prototype, "nodeName", { get: curMemoryArea.nodeName_getter, enumerable: true, configurable: true, });
curMemoryArea.nodeName_smart_getter = function nodeName() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的nodeName的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nodeName_smart_getter);
Node.prototype.__defineGetter__("nodeName", curMemoryArea.nodeName_smart_getter);

// baseURI
curMemoryArea.baseURI_getter = function baseURI() { debugger; }; mframe.safefunction(curMemoryArea.baseURI_getter);
Object.defineProperty(curMemoryArea.baseURI_getter, "name", { value: "get baseURI", configurable: true, });
Object.defineProperty(Node.prototype, "baseURI", { get: curMemoryArea.baseURI_getter, enumerable: true, configurable: true, });
curMemoryArea.baseURI_smart_getter = function baseURI() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的baseURI的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.baseURI_smart_getter);
Node.prototype.__defineGetter__("baseURI", curMemoryArea.baseURI_smart_getter);

// isConnected
curMemoryArea.isConnected_getter = function isConnected() { debugger; }; mframe.safefunction(curMemoryArea.isConnected_getter);
Object.defineProperty(curMemoryArea.isConnected_getter, "name", { value: "get isConnected", configurable: true, });
Object.defineProperty(Node.prototype, "isConnected", { get: curMemoryArea.isConnected_getter, enumerable: true, configurable: true, });
curMemoryArea.isConnected_smart_getter = function isConnected() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的isConnected的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.isConnected_smart_getter);
Node.prototype.__defineGetter__("isConnected", curMemoryArea.isConnected_smart_getter);

// ownerDocument
curMemoryArea.ownerDocument_getter = function ownerDocument() { debugger; }; mframe.safefunction(curMemoryArea.ownerDocument_getter);
Object.defineProperty(curMemoryArea.ownerDocument_getter, "name", { value: "get ownerDocument", configurable: true, });
Object.defineProperty(Node.prototype, "ownerDocument", { get: curMemoryArea.ownerDocument_getter, enumerable: true, configurable: true, });
curMemoryArea.ownerDocument_smart_getter = function ownerDocument() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的ownerDocument的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ownerDocument_smart_getter);
Node.prototype.__defineGetter__("ownerDocument", curMemoryArea.ownerDocument_smart_getter);

// parentNode
curMemoryArea.parentNode_getter = function parentNode() { debugger; }; mframe.safefunction(curMemoryArea.parentNode_getter);
Object.defineProperty(curMemoryArea.parentNode_getter, "name", { value: "get parentNode", configurable: true, });
Object.defineProperty(Node.prototype, "parentNode", { get: curMemoryArea.parentNode_getter, enumerable: true, configurable: true, });
curMemoryArea.parentNode_smart_getter = function parentNode() {
    if(mframe.memory.jsdom.document) {
        console.log(`jsdom parentNode: ${this.jsdomMemory.parentNode.tagName}`);
        return this.jsdomMemory.parentNode;
    }
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的parentNode的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.parentNode_smart_getter);
Node.prototype.__defineGetter__("parentNode", curMemoryArea.parentNode_smart_getter);

// parentElement
curMemoryArea.parentElement_getter = function parentElement() { debugger; }; mframe.safefunction(curMemoryArea.parentElement_getter);
Object.defineProperty(curMemoryArea.parentElement_getter, "name", { value: "get parentElement", configurable: true, });
Object.defineProperty(Node.prototype, "parentElement", { get: curMemoryArea.parentElement_getter, enumerable: true, configurable: true, });
curMemoryArea.parentElement_smart_getter = function parentElement() {
    if(mframe.memory.jsdom.document) {
        console.log(`jsdom parentElement: ${this.jsdomMemory.parentElement.tagName}`);
        return this.jsdomMemory.parentElement;
    }

    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的parentElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.parentElement_smart_getter);
Node.prototype.__defineGetter__("parentElement", curMemoryArea.parentElement_smart_getter);

// childNodes
curMemoryArea.childNodes_getter = function childNodes() { debugger; }; mframe.safefunction(curMemoryArea.childNodes_getter);
Object.defineProperty(curMemoryArea.childNodes_getter, "name", { value: "get childNodes", configurable: true, });
Object.defineProperty(Node.prototype, "childNodes", { get: curMemoryArea.childNodes_getter, enumerable: true, configurable: true, });
curMemoryArea.childNodes_smart_getter = function childNodes() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的childNodes的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.childNodes_smart_getter);
Node.prototype.__defineGetter__("childNodes", curMemoryArea.childNodes_smart_getter);

// firstChild
curMemoryArea.firstChild_getter = function firstChild() { debugger; }; mframe.safefunction(curMemoryArea.firstChild_getter);
Object.defineProperty(curMemoryArea.firstChild_getter, "name", { value: "get firstChild", configurable: true, });
Object.defineProperty(Node.prototype, "firstChild", { get: curMemoryArea.firstChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstChild_smart_getter = function firstChild() {
    debugger
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的firstChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.firstChild_smart_getter);
Node.prototype.__defineGetter__("firstChild", curMemoryArea.firstChild_smart_getter);

// lastChild
curMemoryArea.lastChild_getter = function lastChild() { debugger; }; mframe.safefunction(curMemoryArea.lastChild_getter);
Object.defineProperty(curMemoryArea.lastChild_getter, "name", { value: "get lastChild", configurable: true, });
Object.defineProperty(Node.prototype, "lastChild", { get: curMemoryArea.lastChild_getter, enumerable: true, configurable: true, });
curMemoryArea.lastChild_smart_getter = function lastChild() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的lastChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.lastChild_smart_getter);
Node.prototype.__defineGetter__("lastChild", curMemoryArea.lastChild_smart_getter);

// previousSibling
curMemoryArea.previousSibling_getter = function previousSibling() { debugger; }; mframe.safefunction(curMemoryArea.previousSibling_getter);
Object.defineProperty(curMemoryArea.previousSibling_getter, "name", { value: "get previousSibling", configurable: true, });
Object.defineProperty(Node.prototype, "previousSibling", { get: curMemoryArea.previousSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.previousSibling_smart_getter = function previousSibling() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的previousSibling的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.previousSibling_smart_getter);
Node.prototype.__defineGetter__("previousSibling", curMemoryArea.previousSibling_smart_getter);

// nextSibling
curMemoryArea.nextSibling_getter = function nextSibling() { debugger; }; mframe.safefunction(curMemoryArea.nextSibling_getter);
Object.defineProperty(curMemoryArea.nextSibling_getter, "name", { value: "get nextSibling", configurable: true, });
Object.defineProperty(Node.prototype, "nextSibling", { get: curMemoryArea.nextSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.nextSibling_smart_getter = function nextSibling() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的nextSibling的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nextSibling_smart_getter);
Node.prototype.__defineGetter__("nextSibling", curMemoryArea.nextSibling_smart_getter);

// nodeValue
curMemoryArea.nodeValue_getter = function nodeValue() { debugger; }; mframe.safefunction(curMemoryArea.nodeValue_getter);
Object.defineProperty(curMemoryArea.nodeValue_getter, "name", { value: "get nodeValue", configurable: true, });
// nodeValue
curMemoryArea.nodeValue_setter = function nodeValue(val) { debugger; }; mframe.safefunction(curMemoryArea.nodeValue_setter);
Object.defineProperty(curMemoryArea.nodeValue_setter, "name", { value: "set nodeValue", configurable: true, });
Object.defineProperty(Node.prototype, "nodeValue", { get: curMemoryArea.nodeValue_getter, set: curMemoryArea.nodeValue_setter, enumerable: true, configurable: true, });
curMemoryArea.nodeValue_smart_getter = function nodeValue() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的nodeValue的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nodeValue_smart_getter);
Node.prototype.__defineGetter__("nodeValue", curMemoryArea.nodeValue_smart_getter);

// textContent
curMemoryArea.textContent_getter = function textContent() { debugger; }; mframe.safefunction(curMemoryArea.textContent_getter);
Object.defineProperty(curMemoryArea.textContent_getter, "name", { value: "get textContent", configurable: true, });
// textContent
curMemoryArea.textContent_setter = function textContent(val) { debugger; }; mframe.safefunction(curMemoryArea.textContent_setter);
Object.defineProperty(curMemoryArea.textContent_setter, "name", { value: "set textContent", configurable: true, });
Object.defineProperty(Node.prototype, "textContent", { get: curMemoryArea.textContent_getter, set: curMemoryArea.textContent_setter, enumerable: true, configurable: true, });
curMemoryArea.textContent_smart_getter = function textContent() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的textContent的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.textContent_smart_getter);
Node.prototype.__defineGetter__("textContent", curMemoryArea.textContent_smart_getter);

Node.prototype.ELEMENT_NODE = 1;
Node.prototype.ATTRIBUTE_NODE = 2;
Node.prototype.TEXT_NODE = 3;
Node.prototype.CDATA_SECTION_NODE = 4;
Node.prototype.ENTITY_REFERENCE_NODE = 5;
Node.prototype.ENTITY_NODE = 6;
Node.prototype.PROCESSING_INSTRUCTION_NODE = 7;
Node.prototype.COMMENT_NODE = 8;
Node.prototype.DOCUMENT_NODE = 9;
Node.prototype.DOCUMENT_TYPE_NODE = 10;
Node.prototype.DOCUMENT_FRAGMENT_NODE = 11;
Node.prototype.NOTATION_NODE = 12;
Node.prototype.DOCUMENT_POSITION_DISCONNECTED = 1;
Node.prototype.DOCUMENT_POSITION_PRECEDING = 2;
Node.prototype.DOCUMENT_POSITION_FOLLOWING = 4;
Node.prototype.DOCUMENT_POSITION_CONTAINS = 8;
Node.prototype.DOCUMENT_POSITION_CONTAINED_BY = 16;
Node.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
Node.prototype["appendChild"] = function appendChild(aChild) {
    if (mframe.memory.jsdom.document != undefined) { // 有jsdom
        // 一定是一个实例来调用appendChild才有用,this.jsdomMemory是jsdom的; aChild是我们伪造的,aChild.jsdomMemory是jsdom创建的
        return this.jsdomMemory.appendChild(aChild.jsdomMemory);
    }
    // 没有jsdom, 就只能返回一个空对象了.
    else {
        debugger;
        return {};
    }
}; mframe.safefunction(Node.prototype["appendChild"]);


Node.prototype["cloneNode"] = function cloneNode() { debugger; }; mframe.safefunction(Node.prototype["cloneNode"]);
Node.prototype["compareDocumentPosition"] = function compareDocumentPosition() { debugger; }; mframe.safefunction(Node.prototype["compareDocumentPosition"]);
Node.prototype["contains"] = function contains() { debugger; }; mframe.safefunction(Node.prototype["contains"]);
Node.prototype["getRootNode"] = function getRootNode() { debugger; }; mframe.safefunction(Node.prototype["getRootNode"]);
Node.prototype["hasChildNodes"] = function hasChildNodes() { debugger; }; mframe.safefunction(Node.prototype["hasChildNodes"]);
Node.prototype["insertBefore"] = function insertBefore() { debugger; }; mframe.safefunction(Node.prototype["insertBefore"]);
Node.prototype["isDefaultNamespace"] = function isDefaultNamespace() { debugger; }; mframe.safefunction(Node.prototype["isDefaultNamespace"]);
Node.prototype["isEqualNode"] = function isEqualNode() { debugger; }; mframe.safefunction(Node.prototype["isEqualNode"]);
Node.prototype["isSameNode"] = function isSameNode() { debugger; }; mframe.safefunction(Node.prototype["isSameNode"]);
Node.prototype["lookupNamespaceURI"] = function lookupNamespaceURI() { debugger; }; mframe.safefunction(Node.prototype["lookupNamespaceURI"]);
Node.prototype["lookupPrefix"] = function lookupPrefix() { debugger; }; mframe.safefunction(Node.prototype["lookupPrefix"]);
Node.prototype["normalize"] = function normalize() { debugger; }; mframe.safefunction(Node.prototype["normalize"]);
Node.prototype["removeChild"] = function removeChild(child) { 
    console.log("jsdom removeChild", child);
    
    if(mframe.memory.jsdom.document) {
        var aa =  this.jsdomMemory.removeChild(child)
        console.log("使用jsdom removeChild ", aa);
        
        return aa;
    }
 }; mframe.safefunction(Node.prototype["removeChild"]);
Node.prototype["replaceChild"] = function replaceChild() { debugger; }; mframe.safefunction(Node.prototype["replaceChild"]);
//==============↑↑Function END↑↑====================


////////////////Instance Instance Instance///////////////////

// === hook jsdom====
// remove
const or_removeChild = mframe.memory.jsdom.window.Node.prototype.removeChild
mframe.memory.jsdom.window.Node.prototype.removeChild = function (child) {
    console.log(`调用jsdom内部的 Node.prototype.removeChild: ${child}`, child);
    debugger;
    return or_removeChild.call(this, child.jsdomMemory ? child.jsdomMemory : child);
    
}
// =======end========

/////////////////////////////////////////////////////////////


/**代理 */
Node.prototype.__proto__ = EventTarget.prototype;
Node = mframe.proxy(Node)
var Element = function Element() {
    debugger;
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Element)

Object.defineProperties(Element.prototype, {
    [Symbol.toStringTag]: {
        value: "Element",
        configurable: true,
    }
})

////////////////////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Element = {};

//============== Constant START ==================
Object.defineProperty(Element, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Element, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// namespaceURI
curMemoryArea.namespaceURI_getter = function namespaceURI() { return this._namespaceURI; }; mframe.safefunction(curMemoryArea.namespaceURI_getter);
Object.defineProperty(curMemoryArea.namespaceURI_getter, "name", { value: "get namespaceURI", configurable: true, });
Object.defineProperty(Element.prototype, "namespaceURI", { get: curMemoryArea.namespaceURI_getter, enumerable: true, configurable: true, });
curMemoryArea.namespaceURI_smart_getter = function namespaceURI() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.namespaceURI; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._namespaceURI !== undefined ? this._namespaceURI : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.namespaceURI_smart_getter);
Element.prototype.__defineGetter__("namespaceURI", curMemoryArea.namespaceURI_smart_getter);

// prefix
curMemoryArea.prefix_getter = function prefix() { return this._prefix; }; mframe.safefunction(curMemoryArea.prefix_getter);
Object.defineProperty(curMemoryArea.prefix_getter, "name", { value: "get prefix", configurable: true, });
Object.defineProperty(Element.prototype, "prefix", { get: curMemoryArea.prefix_getter, enumerable: true, configurable: true, });
curMemoryArea.prefix_smart_getter = function prefix() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.prefix; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._prefix !== undefined ? this._prefix : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.prefix_smart_getter);
Element.prototype.__defineGetter__("prefix", curMemoryArea.prefix_smart_getter);

// localName
curMemoryArea.localName_getter = function localName() { return this._localName; }; mframe.safefunction(curMemoryArea.localName_getter);
Object.defineProperty(curMemoryArea.localName_getter, "name", { value: "get localName", configurable: true, });
Object.defineProperty(Element.prototype, "localName", { get: curMemoryArea.localName_getter, enumerable: true, configurable: true, });
curMemoryArea.localName_smart_getter = function localName() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.localName; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._localName !== undefined ? this._localName : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.localName_smart_getter);
Element.prototype.__defineGetter__("localName", curMemoryArea.localName_smart_getter);

// tagName
curMemoryArea.tagName_getter = function tagName() { return this._tagName; }; mframe.safefunction(curMemoryArea.tagName_getter);
Object.defineProperty(curMemoryArea.tagName_getter, "name", { value: "get tagName", configurable: true, });
Object.defineProperty(Element.prototype, "tagName", { get: curMemoryArea.tagName_getter, enumerable: true, configurable: true, });
curMemoryArea.tagName_smart_getter = function tagName() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.tagName; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._tagName !== undefined ? this._tagName : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.tagName_smart_getter);
Element.prototype.__defineGetter__("tagName", curMemoryArea.tagName_smart_getter);

// id
curMemoryArea.id_getter = function id() { return this._id; }; mframe.safefunction(curMemoryArea.id_getter);
Object.defineProperty(curMemoryArea.id_getter, "name", { value: "get id", configurable: true, });
// id
curMemoryArea.id_setter = function id(val) { this._id = val; }; mframe.safefunction(curMemoryArea.id_setter);
Object.defineProperty(curMemoryArea.id_setter, "name", { value: "set id", configurable: true, });
Object.defineProperty(Element.prototype, "id", { get: curMemoryArea.id_getter, set: curMemoryArea.id_setter, enumerable: true, configurable: true, });
curMemoryArea.id_smart_getter = function id() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.id; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._id !== undefined ? this._id : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.id_smart_getter);
Element.prototype.__defineGetter__("id", curMemoryArea.id_smart_getter);

// className
curMemoryArea.className_getter = function className() { return this._className; }; mframe.safefunction(curMemoryArea.className_getter);
Object.defineProperty(curMemoryArea.className_getter, "name", { value: "get className", configurable: true, });
// className
curMemoryArea.className_setter = function className(val) { this._className = val; }; mframe.safefunction(curMemoryArea.className_setter);
Object.defineProperty(curMemoryArea.className_setter, "name", { value: "set className", configurable: true, });
Object.defineProperty(Element.prototype, "className", { get: curMemoryArea.className_getter, set: curMemoryArea.className_setter, enumerable: true, configurable: true, });
curMemoryArea.className_smart_getter = function className() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.className; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._className !== undefined ? this._className : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.className_smart_getter);
Element.prototype.__defineGetter__("className", curMemoryArea.className_smart_getter);

// classList
curMemoryArea.classList_getter = function classList() { return this._classList; }; mframe.safefunction(curMemoryArea.classList_getter);
Object.defineProperty(curMemoryArea.classList_getter, "name", { value: "get classList", configurable: true, });
// classList
curMemoryArea.classList_setter = function classList(val) { this._classList = val; }; mframe.safefunction(curMemoryArea.classList_setter);
Object.defineProperty(curMemoryArea.classList_setter, "name", { value: "set classList", configurable: true, });
Object.defineProperty(Element.prototype, "classList", { get: curMemoryArea.classList_getter, set: curMemoryArea.classList_setter, enumerable: true, configurable: true, });
curMemoryArea.classList_smart_getter = function classList() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.classList; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._classList !== undefined ? this._classList : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.classList_smart_getter);
Element.prototype.__defineGetter__("classList", curMemoryArea.classList_smart_getter);

// slot
curMemoryArea.slot_getter = function slot() { return this._slot; }; mframe.safefunction(curMemoryArea.slot_getter);
Object.defineProperty(curMemoryArea.slot_getter, "name", { value: "get slot", configurable: true, });
// slot
curMemoryArea.slot_setter = function slot(val) { this._slot = val; }; mframe.safefunction(curMemoryArea.slot_setter);
Object.defineProperty(curMemoryArea.slot_setter, "name", { value: "set slot", configurable: true, });
Object.defineProperty(Element.prototype, "slot", { get: curMemoryArea.slot_getter, set: curMemoryArea.slot_setter, enumerable: true, configurable: true, });
curMemoryArea.slot_smart_getter = function slot() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.slot; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._slot !== undefined ? this._slot : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.slot_smart_getter);
Element.prototype.__defineGetter__("slot", curMemoryArea.slot_smart_getter);

// attributes
curMemoryArea.attributes_getter = function attributes() { return this._attributes; }; mframe.safefunction(curMemoryArea.attributes_getter);
Object.defineProperty(curMemoryArea.attributes_getter, "name", { value: "get attributes", configurable: true, });
Object.defineProperty(Element.prototype, "attributes", { get: curMemoryArea.attributes_getter, enumerable: true, configurable: true, });
curMemoryArea.attributes_smart_getter = function attributes() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.attributes; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._attributes !== undefined ? this._attributes : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.attributes_smart_getter);
Element.prototype.__defineGetter__("attributes", curMemoryArea.attributes_smart_getter);

// shadowRoot
curMemoryArea.shadowRoot_getter = function shadowRoot() { return this._shadowRoot; }; mframe.safefunction(curMemoryArea.shadowRoot_getter);
Object.defineProperty(curMemoryArea.shadowRoot_getter, "name", { value: "get shadowRoot", configurable: true, });
Object.defineProperty(Element.prototype, "shadowRoot", { get: curMemoryArea.shadowRoot_getter, enumerable: true, configurable: true, });
curMemoryArea.shadowRoot_smart_getter = function shadowRoot() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.shadowRoot; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._shadowRoot !== undefined ? this._shadowRoot : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.shadowRoot_smart_getter);
Element.prototype.__defineGetter__("shadowRoot", curMemoryArea.shadowRoot_smart_getter);

// part
curMemoryArea.part_getter = function part() { return this._part; }; mframe.safefunction(curMemoryArea.part_getter);
Object.defineProperty(curMemoryArea.part_getter, "name", { value: "get part", configurable: true, });
// part
curMemoryArea.part_setter = function part(val) { this._part = val; }; mframe.safefunction(curMemoryArea.part_setter);
Object.defineProperty(curMemoryArea.part_setter, "name", { value: "set part", configurable: true, });
Object.defineProperty(Element.prototype, "part", { get: curMemoryArea.part_getter, set: curMemoryArea.part_setter, enumerable: true, configurable: true, });
curMemoryArea.part_smart_getter = function part() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.part; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._part !== undefined ? this._part : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.part_smart_getter);
Element.prototype.__defineGetter__("part", curMemoryArea.part_smart_getter);

// assignedSlot
curMemoryArea.assignedSlot_getter = function assignedSlot() { return this._assignedSlot; }; mframe.safefunction(curMemoryArea.assignedSlot_getter);
Object.defineProperty(curMemoryArea.assignedSlot_getter, "name", { value: "get assignedSlot", configurable: true, });
Object.defineProperty(Element.prototype, "assignedSlot", { get: curMemoryArea.assignedSlot_getter, enumerable: true, configurable: true, });
curMemoryArea.assignedSlot_smart_getter = function assignedSlot() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.assignedSlot; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._assignedSlot !== undefined ? this._assignedSlot : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.assignedSlot_smart_getter);
Element.prototype.__defineGetter__("assignedSlot", curMemoryArea.assignedSlot_smart_getter);

// innerHTML
curMemoryArea.innerHTML_getter = function innerHTML() { return this._innerHTML; }; mframe.safefunction(curMemoryArea.innerHTML_getter);
Object.defineProperty(curMemoryArea.innerHTML_getter, "name", { value: "get innerHTML", configurable: true, });
// innerHTML
curMemoryArea.innerHTML_setter = function innerHTML(val) {
    console.log("innerHTML: ", val);
    
    if (mframe.memory.jsdom.document) { this.jsdomMemory.innerHTML = val; }
    this._innerHTML = val;
}; mframe.safefunction(curMemoryArea.innerHTML_setter);
Object.defineProperty(curMemoryArea.innerHTML_setter, "name", { value: "set innerHTML", configurable: true, });
Object.defineProperty(Element.prototype, "innerHTML", { get: curMemoryArea.innerHTML_getter, set: curMemoryArea.innerHTML_setter, enumerable: true, configurable: true, });
curMemoryArea.innerHTML_smart_getter = function innerHTML() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.innerHTML; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._innerHTML !== undefined ? this._innerHTML : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.innerHTML_smart_getter);
Element.prototype.__defineGetter__("innerHTML", curMemoryArea.innerHTML_smart_getter);

// outerHTML
curMemoryArea.outerHTML_getter = function outerHTML() { return this._outerHTML; }; mframe.safefunction(curMemoryArea.outerHTML_getter);
Object.defineProperty(curMemoryArea.outerHTML_getter, "name", { value: "get outerHTML", configurable: true, });
// outerHTML
curMemoryArea.outerHTML_setter = function outerHTML(val) { this._outerHTML = val; }; mframe.safefunction(curMemoryArea.outerHTML_setter);
Object.defineProperty(curMemoryArea.outerHTML_setter, "name", { value: "set outerHTML", configurable: true, });
Object.defineProperty(Element.prototype, "outerHTML", { get: curMemoryArea.outerHTML_getter, set: curMemoryArea.outerHTML_setter, enumerable: true, configurable: true, });
curMemoryArea.outerHTML_smart_getter = function outerHTML() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.outerHTML; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._outerHTML !== undefined ? this._outerHTML : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.outerHTML_smart_getter);
Element.prototype.__defineGetter__("outerHTML", curMemoryArea.outerHTML_smart_getter);

// scrollTop
curMemoryArea.scrollTop_getter = function scrollTop() { return this._scrollTop; }; mframe.safefunction(curMemoryArea.scrollTop_getter);
Object.defineProperty(curMemoryArea.scrollTop_getter, "name", { value: "get scrollTop", configurable: true, });
// scrollTop
curMemoryArea.scrollTop_setter = function scrollTop(val) { this._scrollTop = val; }; mframe.safefunction(curMemoryArea.scrollTop_setter);
Object.defineProperty(curMemoryArea.scrollTop_setter, "name", { value: "set scrollTop", configurable: true, });
Object.defineProperty(Element.prototype, "scrollTop", { get: curMemoryArea.scrollTop_getter, set: curMemoryArea.scrollTop_setter, enumerable: true, configurable: true, });
curMemoryArea.scrollTop_smart_getter = function scrollTop() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.scrollTop; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scrollTop !== undefined ? this._scrollTop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scrollTop_smart_getter);
Element.prototype.__defineGetter__("scrollTop", curMemoryArea.scrollTop_smart_getter);

// scrollLeft
curMemoryArea.scrollLeft_getter = function scrollLeft() { return this._scrollLeft; }; mframe.safefunction(curMemoryArea.scrollLeft_getter);
Object.defineProperty(curMemoryArea.scrollLeft_getter, "name", { value: "get scrollLeft", configurable: true, });
// scrollLeft
curMemoryArea.scrollLeft_setter = function scrollLeft(val) { this._scrollLeft = val; }; mframe.safefunction(curMemoryArea.scrollLeft_setter);
Object.defineProperty(curMemoryArea.scrollLeft_setter, "name", { value: "set scrollLeft", configurable: true, });
Object.defineProperty(Element.prototype, "scrollLeft", { get: curMemoryArea.scrollLeft_getter, set: curMemoryArea.scrollLeft_setter, enumerable: true, configurable: true, });
curMemoryArea.scrollLeft_smart_getter = function scrollLeft() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.scrollLeft; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scrollLeft !== undefined ? this._scrollLeft : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scrollLeft_smart_getter);
Element.prototype.__defineGetter__("scrollLeft", curMemoryArea.scrollLeft_smart_getter);

// scrollWidth
curMemoryArea.scrollWidth_getter = function scrollWidth() { return this._scrollWidth; }; mframe.safefunction(curMemoryArea.scrollWidth_getter);
Object.defineProperty(curMemoryArea.scrollWidth_getter, "name", { value: "get scrollWidth", configurable: true, });
Object.defineProperty(Element.prototype, "scrollWidth", { get: curMemoryArea.scrollWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollWidth_smart_getter = function scrollWidth() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.scrollWidth; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scrollWidth !== undefined ? this._scrollWidth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scrollWidth_smart_getter);
Element.prototype.__defineGetter__("scrollWidth", curMemoryArea.scrollWidth_smart_getter);

// scrollHeight
curMemoryArea.scrollHeight_getter = function scrollHeight() { return this._scrollHeight; }; mframe.safefunction(curMemoryArea.scrollHeight_getter);
Object.defineProperty(curMemoryArea.scrollHeight_getter, "name", { value: "get scrollHeight", configurable: true, });
Object.defineProperty(Element.prototype, "scrollHeight", { get: curMemoryArea.scrollHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollHeight_smart_getter = function scrollHeight() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.scrollHeight; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scrollHeight !== undefined ? this._scrollHeight : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scrollHeight_smart_getter);
Element.prototype.__defineGetter__("scrollHeight", curMemoryArea.scrollHeight_smart_getter);

// clientTop
curMemoryArea.clientTop_getter = function clientTop() { return this._clientTop; }; mframe.safefunction(curMemoryArea.clientTop_getter);
Object.defineProperty(curMemoryArea.clientTop_getter, "name", { value: "get clientTop", configurable: true, });
Object.defineProperty(Element.prototype, "clientTop", { get: curMemoryArea.clientTop_getter, enumerable: true, configurable: true, });
curMemoryArea.clientTop_smart_getter = function clientTop() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.clientTop; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._clientTop !== undefined ? this._clientTop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.clientTop_smart_getter);
Element.prototype.__defineGetter__("clientTop", curMemoryArea.clientTop_smart_getter);

// clientLeft
curMemoryArea.clientLeft_getter = function clientLeft() { return this._clientLeft; }; mframe.safefunction(curMemoryArea.clientLeft_getter);
Object.defineProperty(curMemoryArea.clientLeft_getter, "name", { value: "get clientLeft", configurable: true, });
Object.defineProperty(Element.prototype, "clientLeft", { get: curMemoryArea.clientLeft_getter, enumerable: true, configurable: true, });
curMemoryArea.clientLeft_smart_getter = function clientLeft() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.clientLeft; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._clientLeft !== undefined ? this._clientLeft : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.clientLeft_smart_getter);
Element.prototype.__defineGetter__("clientLeft", curMemoryArea.clientLeft_smart_getter);

// clientWidth
curMemoryArea.clientWidth_getter = function clientWidth() { return this._clientWidth; }; mframe.safefunction(curMemoryArea.clientWidth_getter);
Object.defineProperty(curMemoryArea.clientWidth_getter, "name", { value: "get clientWidth", configurable: true, });
Object.defineProperty(Element.prototype, "clientWidth", { get: curMemoryArea.clientWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.clientWidth_smart_getter = function clientWidth() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.clientWidth; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._clientWidth !== undefined ? this._clientWidth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.clientWidth_smart_getter);
Element.prototype.__defineGetter__("clientWidth", curMemoryArea.clientWidth_smart_getter);

// clientHeight
curMemoryArea.clientHeight_getter = function clientHeight() { return this._clientHeight; }; mframe.safefunction(curMemoryArea.clientHeight_getter);
Object.defineProperty(curMemoryArea.clientHeight_getter, "name", { value: "get clientHeight", configurable: true, });
Object.defineProperty(Element.prototype, "clientHeight", { get: curMemoryArea.clientHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.clientHeight_smart_getter = function clientHeight() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.clientHeight; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._clientHeight !== undefined ? this._clientHeight : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.clientHeight_smart_getter);
Element.prototype.__defineGetter__("clientHeight", curMemoryArea.clientHeight_smart_getter);

// onbeforecopy
curMemoryArea.onbeforecopy_getter = function onbeforecopy() { return this._onbeforecopy; }; mframe.safefunction(curMemoryArea.onbeforecopy_getter);
Object.defineProperty(curMemoryArea.onbeforecopy_getter, "name", { value: "get onbeforecopy", configurable: true, });
// onbeforecopy
curMemoryArea.onbeforecopy_setter = function onbeforecopy(val) { this._onbeforecopy = val; }; mframe.safefunction(curMemoryArea.onbeforecopy_setter);
Object.defineProperty(curMemoryArea.onbeforecopy_setter, "name", { value: "set onbeforecopy", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforecopy", { get: curMemoryArea.onbeforecopy_getter, set: curMemoryArea.onbeforecopy_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecopy_smart_getter = function onbeforecopy() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onbeforecopy; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforecopy !== undefined ? this._onbeforecopy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforecopy_smart_getter);
Element.prototype.__defineGetter__("onbeforecopy", curMemoryArea.onbeforecopy_smart_getter);

// onbeforecut
curMemoryArea.onbeforecut_getter = function onbeforecut() { return this._onbeforecut; }; mframe.safefunction(curMemoryArea.onbeforecut_getter);
Object.defineProperty(curMemoryArea.onbeforecut_getter, "name", { value: "get onbeforecut", configurable: true, });
// onbeforecut
curMemoryArea.onbeforecut_setter = function onbeforecut(val) { this._onbeforecut = val; }; mframe.safefunction(curMemoryArea.onbeforecut_setter);
Object.defineProperty(curMemoryArea.onbeforecut_setter, "name", { value: "set onbeforecut", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforecut", { get: curMemoryArea.onbeforecut_getter, set: curMemoryArea.onbeforecut_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecut_smart_getter = function onbeforecut() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onbeforecut; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforecut !== undefined ? this._onbeforecut : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforecut_smart_getter);
Element.prototype.__defineGetter__("onbeforecut", curMemoryArea.onbeforecut_smart_getter);

// onbeforepaste
curMemoryArea.onbeforepaste_getter = function onbeforepaste() { return this._onbeforepaste; }; mframe.safefunction(curMemoryArea.onbeforepaste_getter);
Object.defineProperty(curMemoryArea.onbeforepaste_getter, "name", { value: "get onbeforepaste", configurable: true, });
// onbeforepaste
curMemoryArea.onbeforepaste_setter = function onbeforepaste(val) { this._onbeforepaste = val; }; mframe.safefunction(curMemoryArea.onbeforepaste_setter);
Object.defineProperty(curMemoryArea.onbeforepaste_setter, "name", { value: "set onbeforepaste", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforepaste", { get: curMemoryArea.onbeforepaste_getter, set: curMemoryArea.onbeforepaste_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforepaste_smart_getter = function onbeforepaste() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onbeforepaste; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforepaste !== undefined ? this._onbeforepaste : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforepaste_smart_getter);
Element.prototype.__defineGetter__("onbeforepaste", curMemoryArea.onbeforepaste_smart_getter);

// onsearch
curMemoryArea.onsearch_getter = function onsearch() { return this._onsearch; }; mframe.safefunction(curMemoryArea.onsearch_getter);
Object.defineProperty(curMemoryArea.onsearch_getter, "name", { value: "get onsearch", configurable: true, });
// onsearch
curMemoryArea.onsearch_setter = function onsearch(val) { this._onsearch = val; }; mframe.safefunction(curMemoryArea.onsearch_setter);
Object.defineProperty(curMemoryArea.onsearch_setter, "name", { value: "set onsearch", configurable: true, });
Object.defineProperty(Element.prototype, "onsearch", { get: curMemoryArea.onsearch_getter, set: curMemoryArea.onsearch_setter, enumerable: true, configurable: true, });
curMemoryArea.onsearch_smart_getter = function onsearch() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onsearch; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onsearch !== undefined ? this._onsearch : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onsearch_smart_getter);
Element.prototype.__defineGetter__("onsearch", curMemoryArea.onsearch_smart_getter);

// elementTiming
curMemoryArea.elementTiming_getter = function elementTiming() { return this._elementTiming; }; mframe.safefunction(curMemoryArea.elementTiming_getter);
Object.defineProperty(curMemoryArea.elementTiming_getter, "name", { value: "get elementTiming", configurable: true, });
// elementTiming
curMemoryArea.elementTiming_setter = function elementTiming(val) { this._elementTiming = val; }; mframe.safefunction(curMemoryArea.elementTiming_setter);
Object.defineProperty(curMemoryArea.elementTiming_setter, "name", { value: "set elementTiming", configurable: true, });
Object.defineProperty(Element.prototype, "elementTiming", { get: curMemoryArea.elementTiming_getter, set: curMemoryArea.elementTiming_setter, enumerable: true, configurable: true, });
curMemoryArea.elementTiming_smart_getter = function elementTiming() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.elementTiming; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._elementTiming !== undefined ? this._elementTiming : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.elementTiming_smart_getter);
Element.prototype.__defineGetter__("elementTiming", curMemoryArea.elementTiming_smart_getter);

// onfullscreenchange
curMemoryArea.onfullscreenchange_getter = function onfullscreenchange() { return this._onfullscreenchange; }; mframe.safefunction(curMemoryArea.onfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onfullscreenchange_getter, "name", { value: "get onfullscreenchange", configurable: true, });
// onfullscreenchange
curMemoryArea.onfullscreenchange_setter = function onfullscreenchange(val) { this._onfullscreenchange = val; }; mframe.safefunction(curMemoryArea.onfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onfullscreenchange_setter, "name", { value: "set onfullscreenchange", configurable: true, });
Object.defineProperty(Element.prototype, "onfullscreenchange", { get: curMemoryArea.onfullscreenchange_getter, set: curMemoryArea.onfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenchange_smart_getter = function onfullscreenchange() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onfullscreenchange; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onfullscreenchange !== undefined ? this._onfullscreenchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onfullscreenchange_smart_getter);
Element.prototype.__defineGetter__("onfullscreenchange", curMemoryArea.onfullscreenchange_smart_getter);

// onfullscreenerror
curMemoryArea.onfullscreenerror_getter = function onfullscreenerror() { return this._onfullscreenerror; }; mframe.safefunction(curMemoryArea.onfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onfullscreenerror_getter, "name", { value: "get onfullscreenerror", configurable: true, });
// onfullscreenerror
curMemoryArea.onfullscreenerror_setter = function onfullscreenerror(val) { this._onfullscreenerror = val; }; mframe.safefunction(curMemoryArea.onfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onfullscreenerror_setter, "name", { value: "set onfullscreenerror", configurable: true, });
Object.defineProperty(Element.prototype, "onfullscreenerror", { get: curMemoryArea.onfullscreenerror_getter, set: curMemoryArea.onfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenerror_smart_getter = function onfullscreenerror() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onfullscreenerror; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onfullscreenerror !== undefined ? this._onfullscreenerror : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onfullscreenerror_smart_getter);
Element.prototype.__defineGetter__("onfullscreenerror", curMemoryArea.onfullscreenerror_smart_getter);

// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_getter = function onwebkitfullscreenchange() { return this._onwebkitfullscreenchange; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_getter, "name", { value: "get onwebkitfullscreenchange", configurable: true, });
// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_setter = function onwebkitfullscreenchange(val) { this._onwebkitfullscreenchange = val; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_setter, "name", { value: "set onwebkitfullscreenchange", configurable: true, });
Object.defineProperty(Element.prototype, "onwebkitfullscreenchange", { get: curMemoryArea.onwebkitfullscreenchange_getter, set: curMemoryArea.onwebkitfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenchange_smart_getter = function onwebkitfullscreenchange() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onwebkitfullscreenchange; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitfullscreenchange !== undefined ? this._onwebkitfullscreenchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_smart_getter);
Element.prototype.__defineGetter__("onwebkitfullscreenchange", curMemoryArea.onwebkitfullscreenchange_smart_getter);

// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_getter = function onwebkitfullscreenerror() { return this._onwebkitfullscreenerror; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_getter, "name", { value: "get onwebkitfullscreenerror", configurable: true, });
// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_setter = function onwebkitfullscreenerror(val) { this._onwebkitfullscreenerror = val; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_setter, "name", { value: "set onwebkitfullscreenerror", configurable: true, });
Object.defineProperty(Element.prototype, "onwebkitfullscreenerror", { get: curMemoryArea.onwebkitfullscreenerror_getter, set: curMemoryArea.onwebkitfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenerror_smart_getter = function onwebkitfullscreenerror() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onwebkitfullscreenerror; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitfullscreenerror !== undefined ? this._onwebkitfullscreenerror : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_smart_getter);
Element.prototype.__defineGetter__("onwebkitfullscreenerror", curMemoryArea.onwebkitfullscreenerror_smart_getter);

// role
curMemoryArea.role_getter = function role() { return this._role; }; mframe.safefunction(curMemoryArea.role_getter);
Object.defineProperty(curMemoryArea.role_getter, "name", { value: "get role", configurable: true, });
// role
curMemoryArea.role_setter = function role(val) { this._role = val; }; mframe.safefunction(curMemoryArea.role_setter);
Object.defineProperty(curMemoryArea.role_setter, "name", { value: "set role", configurable: true, });
Object.defineProperty(Element.prototype, "role", { get: curMemoryArea.role_getter, set: curMemoryArea.role_setter, enumerable: true, configurable: true, });
curMemoryArea.role_smart_getter = function role() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.role; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._role !== undefined ? this._role : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.role_smart_getter);
Element.prototype.__defineGetter__("role", curMemoryArea.role_smart_getter);

// ariaAtomic
curMemoryArea.ariaAtomic_getter = function ariaAtomic() { return this._ariaAtomic; }; mframe.safefunction(curMemoryArea.ariaAtomic_getter);
Object.defineProperty(curMemoryArea.ariaAtomic_getter, "name", { value: "get ariaAtomic", configurable: true, });
// ariaAtomic
curMemoryArea.ariaAtomic_setter = function ariaAtomic(val) { this._ariaAtomic = val; }; mframe.safefunction(curMemoryArea.ariaAtomic_setter);
Object.defineProperty(curMemoryArea.ariaAtomic_setter, "name", { value: "set ariaAtomic", configurable: true, });
Object.defineProperty(Element.prototype, "ariaAtomic", { get: curMemoryArea.ariaAtomic_getter, set: curMemoryArea.ariaAtomic_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaAtomic_smart_getter = function ariaAtomic() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaAtomic; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaAtomic !== undefined ? this._ariaAtomic : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaAtomic_smart_getter);
Element.prototype.__defineGetter__("ariaAtomic", curMemoryArea.ariaAtomic_smart_getter);

// ariaAutoComplete
curMemoryArea.ariaAutoComplete_getter = function ariaAutoComplete() { return this._ariaAutoComplete; }; mframe.safefunction(curMemoryArea.ariaAutoComplete_getter);
Object.defineProperty(curMemoryArea.ariaAutoComplete_getter, "name", { value: "get ariaAutoComplete", configurable: true, });
// ariaAutoComplete
curMemoryArea.ariaAutoComplete_setter = function ariaAutoComplete(val) { this._ariaAutoComplete = val; }; mframe.safefunction(curMemoryArea.ariaAutoComplete_setter);
Object.defineProperty(curMemoryArea.ariaAutoComplete_setter, "name", { value: "set ariaAutoComplete", configurable: true, });
Object.defineProperty(Element.prototype, "ariaAutoComplete", { get: curMemoryArea.ariaAutoComplete_getter, set: curMemoryArea.ariaAutoComplete_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaAutoComplete_smart_getter = function ariaAutoComplete() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaAutoComplete; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaAutoComplete !== undefined ? this._ariaAutoComplete : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaAutoComplete_smart_getter);
Element.prototype.__defineGetter__("ariaAutoComplete", curMemoryArea.ariaAutoComplete_smart_getter);

// ariaBusy
curMemoryArea.ariaBusy_getter = function ariaBusy() { return this._ariaBusy; }; mframe.safefunction(curMemoryArea.ariaBusy_getter);
Object.defineProperty(curMemoryArea.ariaBusy_getter, "name", { value: "get ariaBusy", configurable: true, });
// ariaBusy
curMemoryArea.ariaBusy_setter = function ariaBusy(val) { this._ariaBusy = val; }; mframe.safefunction(curMemoryArea.ariaBusy_setter);
Object.defineProperty(curMemoryArea.ariaBusy_setter, "name", { value: "set ariaBusy", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBusy", { get: curMemoryArea.ariaBusy_getter, set: curMemoryArea.ariaBusy_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBusy_smart_getter = function ariaBusy() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaBusy; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaBusy !== undefined ? this._ariaBusy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaBusy_smart_getter);
Element.prototype.__defineGetter__("ariaBusy", curMemoryArea.ariaBusy_smart_getter);

// ariaBrailleLabel
curMemoryArea.ariaBrailleLabel_getter = function ariaBrailleLabel() { return this._ariaBrailleLabel; }; mframe.safefunction(curMemoryArea.ariaBrailleLabel_getter);
Object.defineProperty(curMemoryArea.ariaBrailleLabel_getter, "name", { value: "get ariaBrailleLabel", configurable: true, });
// ariaBrailleLabel
curMemoryArea.ariaBrailleLabel_setter = function ariaBrailleLabel(val) { this._ariaBrailleLabel = val; }; mframe.safefunction(curMemoryArea.ariaBrailleLabel_setter);
Object.defineProperty(curMemoryArea.ariaBrailleLabel_setter, "name", { value: "set ariaBrailleLabel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBrailleLabel", { get: curMemoryArea.ariaBrailleLabel_getter, set: curMemoryArea.ariaBrailleLabel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBrailleLabel_smart_getter = function ariaBrailleLabel() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaBrailleLabel; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaBrailleLabel !== undefined ? this._ariaBrailleLabel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaBrailleLabel_smart_getter);
Element.prototype.__defineGetter__("ariaBrailleLabel", curMemoryArea.ariaBrailleLabel_smart_getter);

// ariaBrailleRoleDescription
curMemoryArea.ariaBrailleRoleDescription_getter = function ariaBrailleRoleDescription() { return this._ariaBrailleRoleDescription; }; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_getter);
Object.defineProperty(curMemoryArea.ariaBrailleRoleDescription_getter, "name", { value: "get ariaBrailleRoleDescription", configurable: true, });
// ariaBrailleRoleDescription
curMemoryArea.ariaBrailleRoleDescription_setter = function ariaBrailleRoleDescription(val) { this._ariaBrailleRoleDescription = val; }; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_setter);
Object.defineProperty(curMemoryArea.ariaBrailleRoleDescription_setter, "name", { value: "set ariaBrailleRoleDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBrailleRoleDescription", { get: curMemoryArea.ariaBrailleRoleDescription_getter, set: curMemoryArea.ariaBrailleRoleDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBrailleRoleDescription_smart_getter = function ariaBrailleRoleDescription() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaBrailleRoleDescription; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaBrailleRoleDescription !== undefined ? this._ariaBrailleRoleDescription : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_smart_getter);
Element.prototype.__defineGetter__("ariaBrailleRoleDescription", curMemoryArea.ariaBrailleRoleDescription_smart_getter);

// ariaChecked
curMemoryArea.ariaChecked_getter = function ariaChecked() { return this._ariaChecked; }; mframe.safefunction(curMemoryArea.ariaChecked_getter);
Object.defineProperty(curMemoryArea.ariaChecked_getter, "name", { value: "get ariaChecked", configurable: true, });
// ariaChecked
curMemoryArea.ariaChecked_setter = function ariaChecked(val) { this._ariaChecked = val; }; mframe.safefunction(curMemoryArea.ariaChecked_setter);
Object.defineProperty(curMemoryArea.ariaChecked_setter, "name", { value: "set ariaChecked", configurable: true, });
Object.defineProperty(Element.prototype, "ariaChecked", { get: curMemoryArea.ariaChecked_getter, set: curMemoryArea.ariaChecked_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaChecked_smart_getter = function ariaChecked() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaChecked; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaChecked !== undefined ? this._ariaChecked : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaChecked_smart_getter);
Element.prototype.__defineGetter__("ariaChecked", curMemoryArea.ariaChecked_smart_getter);

// ariaColCount
curMemoryArea.ariaColCount_getter = function ariaColCount() { return this._ariaColCount; }; mframe.safefunction(curMemoryArea.ariaColCount_getter);
Object.defineProperty(curMemoryArea.ariaColCount_getter, "name", { value: "get ariaColCount", configurable: true, });
// ariaColCount
curMemoryArea.ariaColCount_setter = function ariaColCount(val) { this._ariaColCount = val; }; mframe.safefunction(curMemoryArea.ariaColCount_setter);
Object.defineProperty(curMemoryArea.ariaColCount_setter, "name", { value: "set ariaColCount", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColCount", { get: curMemoryArea.ariaColCount_getter, set: curMemoryArea.ariaColCount_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColCount_smart_getter = function ariaColCount() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaColCount; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaColCount !== undefined ? this._ariaColCount : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaColCount_smart_getter);
Element.prototype.__defineGetter__("ariaColCount", curMemoryArea.ariaColCount_smart_getter);

// ariaColIndex
curMemoryArea.ariaColIndex_getter = function ariaColIndex() { return this._ariaColIndex; }; mframe.safefunction(curMemoryArea.ariaColIndex_getter);
Object.defineProperty(curMemoryArea.ariaColIndex_getter, "name", { value: "get ariaColIndex", configurable: true, });
// ariaColIndex
curMemoryArea.ariaColIndex_setter = function ariaColIndex(val) { this._ariaColIndex = val; }; mframe.safefunction(curMemoryArea.ariaColIndex_setter);
Object.defineProperty(curMemoryArea.ariaColIndex_setter, "name", { value: "set ariaColIndex", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColIndex", { get: curMemoryArea.ariaColIndex_getter, set: curMemoryArea.ariaColIndex_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColIndex_smart_getter = function ariaColIndex() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaColIndex; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaColIndex !== undefined ? this._ariaColIndex : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaColIndex_smart_getter);
Element.prototype.__defineGetter__("ariaColIndex", curMemoryArea.ariaColIndex_smart_getter);

// ariaColSpan
curMemoryArea.ariaColSpan_getter = function ariaColSpan() { return this._ariaColSpan; }; mframe.safefunction(curMemoryArea.ariaColSpan_getter);
Object.defineProperty(curMemoryArea.ariaColSpan_getter, "name", { value: "get ariaColSpan", configurable: true, });
// ariaColSpan
curMemoryArea.ariaColSpan_setter = function ariaColSpan(val) { this._ariaColSpan = val; }; mframe.safefunction(curMemoryArea.ariaColSpan_setter);
Object.defineProperty(curMemoryArea.ariaColSpan_setter, "name", { value: "set ariaColSpan", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColSpan", { get: curMemoryArea.ariaColSpan_getter, set: curMemoryArea.ariaColSpan_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColSpan_smart_getter = function ariaColSpan() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaColSpan; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaColSpan !== undefined ? this._ariaColSpan : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaColSpan_smart_getter);
Element.prototype.__defineGetter__("ariaColSpan", curMemoryArea.ariaColSpan_smart_getter);

// ariaCurrent
curMemoryArea.ariaCurrent_getter = function ariaCurrent() { return this._ariaCurrent; }; mframe.safefunction(curMemoryArea.ariaCurrent_getter);
Object.defineProperty(curMemoryArea.ariaCurrent_getter, "name", { value: "get ariaCurrent", configurable: true, });
// ariaCurrent
curMemoryArea.ariaCurrent_setter = function ariaCurrent(val) { this._ariaCurrent = val; }; mframe.safefunction(curMemoryArea.ariaCurrent_setter);
Object.defineProperty(curMemoryArea.ariaCurrent_setter, "name", { value: "set ariaCurrent", configurable: true, });
Object.defineProperty(Element.prototype, "ariaCurrent", { get: curMemoryArea.ariaCurrent_getter, set: curMemoryArea.ariaCurrent_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaCurrent_smart_getter = function ariaCurrent() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaCurrent; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaCurrent !== undefined ? this._ariaCurrent : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaCurrent_smart_getter);
Element.prototype.__defineGetter__("ariaCurrent", curMemoryArea.ariaCurrent_smart_getter);

// ariaDescription
curMemoryArea.ariaDescription_getter = function ariaDescription() { return this._ariaDescription; }; mframe.safefunction(curMemoryArea.ariaDescription_getter);
Object.defineProperty(curMemoryArea.ariaDescription_getter, "name", { value: "get ariaDescription", configurable: true, });
// ariaDescription
curMemoryArea.ariaDescription_setter = function ariaDescription(val) { this._ariaDescription = val; }; mframe.safefunction(curMemoryArea.ariaDescription_setter);
Object.defineProperty(curMemoryArea.ariaDescription_setter, "name", { value: "set ariaDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDescription", { get: curMemoryArea.ariaDescription_getter, set: curMemoryArea.ariaDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDescription_smart_getter = function ariaDescription() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaDescription; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaDescription !== undefined ? this._ariaDescription : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaDescription_smart_getter);
Element.prototype.__defineGetter__("ariaDescription", curMemoryArea.ariaDescription_smart_getter);

// ariaDisabled
curMemoryArea.ariaDisabled_getter = function ariaDisabled() { return this._ariaDisabled; }; mframe.safefunction(curMemoryArea.ariaDisabled_getter);
Object.defineProperty(curMemoryArea.ariaDisabled_getter, "name", { value: "get ariaDisabled", configurable: true, });
// ariaDisabled
curMemoryArea.ariaDisabled_setter = function ariaDisabled(val) { this._ariaDisabled = val; }; mframe.safefunction(curMemoryArea.ariaDisabled_setter);
Object.defineProperty(curMemoryArea.ariaDisabled_setter, "name", { value: "set ariaDisabled", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDisabled", { get: curMemoryArea.ariaDisabled_getter, set: curMemoryArea.ariaDisabled_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDisabled_smart_getter = function ariaDisabled() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaDisabled; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaDisabled !== undefined ? this._ariaDisabled : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaDisabled_smart_getter);
Element.prototype.__defineGetter__("ariaDisabled", curMemoryArea.ariaDisabled_smart_getter);

// ariaExpanded
curMemoryArea.ariaExpanded_getter = function ariaExpanded() { return this._ariaExpanded; }; mframe.safefunction(curMemoryArea.ariaExpanded_getter);
Object.defineProperty(curMemoryArea.ariaExpanded_getter, "name", { value: "get ariaExpanded", configurable: true, });
// ariaExpanded
curMemoryArea.ariaExpanded_setter = function ariaExpanded(val) { this._ariaExpanded = val; }; mframe.safefunction(curMemoryArea.ariaExpanded_setter);
Object.defineProperty(curMemoryArea.ariaExpanded_setter, "name", { value: "set ariaExpanded", configurable: true, });
Object.defineProperty(Element.prototype, "ariaExpanded", { get: curMemoryArea.ariaExpanded_getter, set: curMemoryArea.ariaExpanded_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaExpanded_smart_getter = function ariaExpanded() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaExpanded; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaExpanded !== undefined ? this._ariaExpanded : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaExpanded_smart_getter);
Element.prototype.__defineGetter__("ariaExpanded", curMemoryArea.ariaExpanded_smart_getter);

// ariaHasPopup
curMemoryArea.ariaHasPopup_getter = function ariaHasPopup() { return this._ariaHasPopup; }; mframe.safefunction(curMemoryArea.ariaHasPopup_getter);
Object.defineProperty(curMemoryArea.ariaHasPopup_getter, "name", { value: "get ariaHasPopup", configurable: true, });
// ariaHasPopup
curMemoryArea.ariaHasPopup_setter = function ariaHasPopup(val) { this._ariaHasPopup = val; }; mframe.safefunction(curMemoryArea.ariaHasPopup_setter);
Object.defineProperty(curMemoryArea.ariaHasPopup_setter, "name", { value: "set ariaHasPopup", configurable: true, });
Object.defineProperty(Element.prototype, "ariaHasPopup", { get: curMemoryArea.ariaHasPopup_getter, set: curMemoryArea.ariaHasPopup_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaHasPopup_smart_getter = function ariaHasPopup() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaHasPopup; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaHasPopup !== undefined ? this._ariaHasPopup : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaHasPopup_smart_getter);
Element.prototype.__defineGetter__("ariaHasPopup", curMemoryArea.ariaHasPopup_smart_getter);

// ariaHidden
curMemoryArea.ariaHidden_getter = function ariaHidden() { return this._ariaHidden; }; mframe.safefunction(curMemoryArea.ariaHidden_getter);
Object.defineProperty(curMemoryArea.ariaHidden_getter, "name", { value: "get ariaHidden", configurable: true, });
// ariaHidden
curMemoryArea.ariaHidden_setter = function ariaHidden(val) { this._ariaHidden = val; }; mframe.safefunction(curMemoryArea.ariaHidden_setter);
Object.defineProperty(curMemoryArea.ariaHidden_setter, "name", { value: "set ariaHidden", configurable: true, });
Object.defineProperty(Element.prototype, "ariaHidden", { get: curMemoryArea.ariaHidden_getter, set: curMemoryArea.ariaHidden_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaHidden_smart_getter = function ariaHidden() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaHidden; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaHidden !== undefined ? this._ariaHidden : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaHidden_smart_getter);
Element.prototype.__defineGetter__("ariaHidden", curMemoryArea.ariaHidden_smart_getter);

// ariaInvalid
curMemoryArea.ariaInvalid_getter = function ariaInvalid() { return this._ariaInvalid; }; mframe.safefunction(curMemoryArea.ariaInvalid_getter);
Object.defineProperty(curMemoryArea.ariaInvalid_getter, "name", { value: "get ariaInvalid", configurable: true, });
// ariaInvalid
curMemoryArea.ariaInvalid_setter = function ariaInvalid(val) { this._ariaInvalid = val; }; mframe.safefunction(curMemoryArea.ariaInvalid_setter);
Object.defineProperty(curMemoryArea.ariaInvalid_setter, "name", { value: "set ariaInvalid", configurable: true, });
Object.defineProperty(Element.prototype, "ariaInvalid", { get: curMemoryArea.ariaInvalid_getter, set: curMemoryArea.ariaInvalid_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaInvalid_smart_getter = function ariaInvalid() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaInvalid; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaInvalid !== undefined ? this._ariaInvalid : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaInvalid_smart_getter);
Element.prototype.__defineGetter__("ariaInvalid", curMemoryArea.ariaInvalid_smart_getter);

// ariaKeyShortcuts
curMemoryArea.ariaKeyShortcuts_getter = function ariaKeyShortcuts() { return this._ariaKeyShortcuts; }; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_getter);
Object.defineProperty(curMemoryArea.ariaKeyShortcuts_getter, "name", { value: "get ariaKeyShortcuts", configurable: true, });
// ariaKeyShortcuts
curMemoryArea.ariaKeyShortcuts_setter = function ariaKeyShortcuts(val) { this._ariaKeyShortcuts = val; }; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_setter);
Object.defineProperty(curMemoryArea.ariaKeyShortcuts_setter, "name", { value: "set ariaKeyShortcuts", configurable: true, });
Object.defineProperty(Element.prototype, "ariaKeyShortcuts", { get: curMemoryArea.ariaKeyShortcuts_getter, set: curMemoryArea.ariaKeyShortcuts_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaKeyShortcuts_smart_getter = function ariaKeyShortcuts() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaKeyShortcuts; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaKeyShortcuts !== undefined ? this._ariaKeyShortcuts : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_smart_getter);
Element.prototype.__defineGetter__("ariaKeyShortcuts", curMemoryArea.ariaKeyShortcuts_smart_getter);

// ariaLabel
curMemoryArea.ariaLabel_getter = function ariaLabel() { return this._ariaLabel; }; mframe.safefunction(curMemoryArea.ariaLabel_getter);
Object.defineProperty(curMemoryArea.ariaLabel_getter, "name", { value: "get ariaLabel", configurable: true, });
// ariaLabel
curMemoryArea.ariaLabel_setter = function ariaLabel(val) { this._ariaLabel = val; }; mframe.safefunction(curMemoryArea.ariaLabel_setter);
Object.defineProperty(curMemoryArea.ariaLabel_setter, "name", { value: "set ariaLabel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLabel", { get: curMemoryArea.ariaLabel_getter, set: curMemoryArea.ariaLabel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLabel_smart_getter = function ariaLabel() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaLabel; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaLabel !== undefined ? this._ariaLabel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaLabel_smart_getter);
Element.prototype.__defineGetter__("ariaLabel", curMemoryArea.ariaLabel_smart_getter);

// ariaLevel
curMemoryArea.ariaLevel_getter = function ariaLevel() { return this._ariaLevel; }; mframe.safefunction(curMemoryArea.ariaLevel_getter);
Object.defineProperty(curMemoryArea.ariaLevel_getter, "name", { value: "get ariaLevel", configurable: true, });
// ariaLevel
curMemoryArea.ariaLevel_setter = function ariaLevel(val) { this._ariaLevel = val; }; mframe.safefunction(curMemoryArea.ariaLevel_setter);
Object.defineProperty(curMemoryArea.ariaLevel_setter, "name", { value: "set ariaLevel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLevel", { get: curMemoryArea.ariaLevel_getter, set: curMemoryArea.ariaLevel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLevel_smart_getter = function ariaLevel() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaLevel; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaLevel !== undefined ? this._ariaLevel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaLevel_smart_getter);
Element.prototype.__defineGetter__("ariaLevel", curMemoryArea.ariaLevel_smart_getter);

// ariaLive
curMemoryArea.ariaLive_getter = function ariaLive() { return this._ariaLive; }; mframe.safefunction(curMemoryArea.ariaLive_getter);
Object.defineProperty(curMemoryArea.ariaLive_getter, "name", { value: "get ariaLive", configurable: true, });
// ariaLive
curMemoryArea.ariaLive_setter = function ariaLive(val) { this._ariaLive = val; }; mframe.safefunction(curMemoryArea.ariaLive_setter);
Object.defineProperty(curMemoryArea.ariaLive_setter, "name", { value: "set ariaLive", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLive", { get: curMemoryArea.ariaLive_getter, set: curMemoryArea.ariaLive_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLive_smart_getter = function ariaLive() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaLive; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaLive !== undefined ? this._ariaLive : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaLive_smart_getter);
Element.prototype.__defineGetter__("ariaLive", curMemoryArea.ariaLive_smart_getter);

// ariaModal
curMemoryArea.ariaModal_getter = function ariaModal() { return this._ariaModal; }; mframe.safefunction(curMemoryArea.ariaModal_getter);
Object.defineProperty(curMemoryArea.ariaModal_getter, "name", { value: "get ariaModal", configurable: true, });
// ariaModal
curMemoryArea.ariaModal_setter = function ariaModal(val) { this._ariaModal = val; }; mframe.safefunction(curMemoryArea.ariaModal_setter);
Object.defineProperty(curMemoryArea.ariaModal_setter, "name", { value: "set ariaModal", configurable: true, });
Object.defineProperty(Element.prototype, "ariaModal", { get: curMemoryArea.ariaModal_getter, set: curMemoryArea.ariaModal_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaModal_smart_getter = function ariaModal() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaModal; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaModal !== undefined ? this._ariaModal : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaModal_smart_getter);
Element.prototype.__defineGetter__("ariaModal", curMemoryArea.ariaModal_smart_getter);

// ariaMultiLine
curMemoryArea.ariaMultiLine_getter = function ariaMultiLine() { return this._ariaMultiLine; }; mframe.safefunction(curMemoryArea.ariaMultiLine_getter);
Object.defineProperty(curMemoryArea.ariaMultiLine_getter, "name", { value: "get ariaMultiLine", configurable: true, });
// ariaMultiLine
curMemoryArea.ariaMultiLine_setter = function ariaMultiLine(val) { this._ariaMultiLine = val; }; mframe.safefunction(curMemoryArea.ariaMultiLine_setter);
Object.defineProperty(curMemoryArea.ariaMultiLine_setter, "name", { value: "set ariaMultiLine", configurable: true, });
Object.defineProperty(Element.prototype, "ariaMultiLine", { get: curMemoryArea.ariaMultiLine_getter, set: curMemoryArea.ariaMultiLine_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaMultiLine_smart_getter = function ariaMultiLine() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaMultiLine; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaMultiLine !== undefined ? this._ariaMultiLine : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaMultiLine_smart_getter);
Element.prototype.__defineGetter__("ariaMultiLine", curMemoryArea.ariaMultiLine_smart_getter);

// ariaMultiSelectable
curMemoryArea.ariaMultiSelectable_getter = function ariaMultiSelectable() { return this._ariaMultiSelectable; }; mframe.safefunction(curMemoryArea.ariaMultiSelectable_getter);
Object.defineProperty(curMemoryArea.ariaMultiSelectable_getter, "name", { value: "get ariaMultiSelectable", configurable: true, });
// ariaMultiSelectable
curMemoryArea.ariaMultiSelectable_setter = function ariaMultiSelectable(val) { this._ariaMultiSelectable = val; }; mframe.safefunction(curMemoryArea.ariaMultiSelectable_setter);
Object.defineProperty(curMemoryArea.ariaMultiSelectable_setter, "name", { value: "set ariaMultiSelectable", configurable: true, });
Object.defineProperty(Element.prototype, "ariaMultiSelectable", { get: curMemoryArea.ariaMultiSelectable_getter, set: curMemoryArea.ariaMultiSelectable_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaMultiSelectable_smart_getter = function ariaMultiSelectable() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaMultiSelectable; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaMultiSelectable !== undefined ? this._ariaMultiSelectable : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaMultiSelectable_smart_getter);
Element.prototype.__defineGetter__("ariaMultiSelectable", curMemoryArea.ariaMultiSelectable_smart_getter);

// ariaOrientation
curMemoryArea.ariaOrientation_getter = function ariaOrientation() { return this._ariaOrientation; }; mframe.safefunction(curMemoryArea.ariaOrientation_getter);
Object.defineProperty(curMemoryArea.ariaOrientation_getter, "name", { value: "get ariaOrientation", configurable: true, });
// ariaOrientation
curMemoryArea.ariaOrientation_setter = function ariaOrientation(val) { this._ariaOrientation = val; }; mframe.safefunction(curMemoryArea.ariaOrientation_setter);
Object.defineProperty(curMemoryArea.ariaOrientation_setter, "name", { value: "set ariaOrientation", configurable: true, });
Object.defineProperty(Element.prototype, "ariaOrientation", { get: curMemoryArea.ariaOrientation_getter, set: curMemoryArea.ariaOrientation_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaOrientation_smart_getter = function ariaOrientation() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaOrientation; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaOrientation !== undefined ? this._ariaOrientation : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaOrientation_smart_getter);
Element.prototype.__defineGetter__("ariaOrientation", curMemoryArea.ariaOrientation_smart_getter);

// ariaPlaceholder
curMemoryArea.ariaPlaceholder_getter = function ariaPlaceholder() { return this._ariaPlaceholder; }; mframe.safefunction(curMemoryArea.ariaPlaceholder_getter);
Object.defineProperty(curMemoryArea.ariaPlaceholder_getter, "name", { value: "get ariaPlaceholder", configurable: true, });
// ariaPlaceholder
curMemoryArea.ariaPlaceholder_setter = function ariaPlaceholder(val) { this._ariaPlaceholder = val; }; mframe.safefunction(curMemoryArea.ariaPlaceholder_setter);
Object.defineProperty(curMemoryArea.ariaPlaceholder_setter, "name", { value: "set ariaPlaceholder", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPlaceholder", { get: curMemoryArea.ariaPlaceholder_getter, set: curMemoryArea.ariaPlaceholder_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPlaceholder_smart_getter = function ariaPlaceholder() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaPlaceholder; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaPlaceholder !== undefined ? this._ariaPlaceholder : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaPlaceholder_smart_getter);
Element.prototype.__defineGetter__("ariaPlaceholder", curMemoryArea.ariaPlaceholder_smart_getter);

// ariaPosInSet
curMemoryArea.ariaPosInSet_getter = function ariaPosInSet() { return this._ariaPosInSet; }; mframe.safefunction(curMemoryArea.ariaPosInSet_getter);
Object.defineProperty(curMemoryArea.ariaPosInSet_getter, "name", { value: "get ariaPosInSet", configurable: true, });
// ariaPosInSet
curMemoryArea.ariaPosInSet_setter = function ariaPosInSet(val) { this._ariaPosInSet = val; }; mframe.safefunction(curMemoryArea.ariaPosInSet_setter);
Object.defineProperty(curMemoryArea.ariaPosInSet_setter, "name", { value: "set ariaPosInSet", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPosInSet", { get: curMemoryArea.ariaPosInSet_getter, set: curMemoryArea.ariaPosInSet_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPosInSet_smart_getter = function ariaPosInSet() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaPosInSet; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaPosInSet !== undefined ? this._ariaPosInSet : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaPosInSet_smart_getter);
Element.prototype.__defineGetter__("ariaPosInSet", curMemoryArea.ariaPosInSet_smart_getter);

// ariaPressed
curMemoryArea.ariaPressed_getter = function ariaPressed() { return this._ariaPressed; }; mframe.safefunction(curMemoryArea.ariaPressed_getter);
Object.defineProperty(curMemoryArea.ariaPressed_getter, "name", { value: "get ariaPressed", configurable: true, });
// ariaPressed
curMemoryArea.ariaPressed_setter = function ariaPressed(val) { this._ariaPressed = val; }; mframe.safefunction(curMemoryArea.ariaPressed_setter);
Object.defineProperty(curMemoryArea.ariaPressed_setter, "name", { value: "set ariaPressed", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPressed", { get: curMemoryArea.ariaPressed_getter, set: curMemoryArea.ariaPressed_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPressed_smart_getter = function ariaPressed() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaPressed; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaPressed !== undefined ? this._ariaPressed : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaPressed_smart_getter);
Element.prototype.__defineGetter__("ariaPressed", curMemoryArea.ariaPressed_smart_getter);

// ariaReadOnly
curMemoryArea.ariaReadOnly_getter = function ariaReadOnly() { return this._ariaReadOnly; }; mframe.safefunction(curMemoryArea.ariaReadOnly_getter);
Object.defineProperty(curMemoryArea.ariaReadOnly_getter, "name", { value: "get ariaReadOnly", configurable: true, });
// ariaReadOnly
curMemoryArea.ariaReadOnly_setter = function ariaReadOnly(val) { this._ariaReadOnly = val; }; mframe.safefunction(curMemoryArea.ariaReadOnly_setter);
Object.defineProperty(curMemoryArea.ariaReadOnly_setter, "name", { value: "set ariaReadOnly", configurable: true, });
Object.defineProperty(Element.prototype, "ariaReadOnly", { get: curMemoryArea.ariaReadOnly_getter, set: curMemoryArea.ariaReadOnly_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaReadOnly_smart_getter = function ariaReadOnly() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaReadOnly; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaReadOnly !== undefined ? this._ariaReadOnly : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaReadOnly_smart_getter);
Element.prototype.__defineGetter__("ariaReadOnly", curMemoryArea.ariaReadOnly_smart_getter);

// ariaRelevant
curMemoryArea.ariaRelevant_getter = function ariaRelevant() { return this._ariaRelevant; }; mframe.safefunction(curMemoryArea.ariaRelevant_getter);
Object.defineProperty(curMemoryArea.ariaRelevant_getter, "name", { value: "get ariaRelevant", configurable: true, });
// ariaRelevant
curMemoryArea.ariaRelevant_setter = function ariaRelevant(val) { this._ariaRelevant = val; }; mframe.safefunction(curMemoryArea.ariaRelevant_setter);
Object.defineProperty(curMemoryArea.ariaRelevant_setter, "name", { value: "set ariaRelevant", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRelevant", { get: curMemoryArea.ariaRelevant_getter, set: curMemoryArea.ariaRelevant_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRelevant_smart_getter = function ariaRelevant() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRelevant; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRelevant !== undefined ? this._ariaRelevant : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRelevant_smart_getter);
Element.prototype.__defineGetter__("ariaRelevant", curMemoryArea.ariaRelevant_smart_getter);

// ariaRequired
curMemoryArea.ariaRequired_getter = function ariaRequired() { return this._ariaRequired; }; mframe.safefunction(curMemoryArea.ariaRequired_getter);
Object.defineProperty(curMemoryArea.ariaRequired_getter, "name", { value: "get ariaRequired", configurable: true, });
// ariaRequired
curMemoryArea.ariaRequired_setter = function ariaRequired(val) { this._ariaRequired = val; }; mframe.safefunction(curMemoryArea.ariaRequired_setter);
Object.defineProperty(curMemoryArea.ariaRequired_setter, "name", { value: "set ariaRequired", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRequired", { get: curMemoryArea.ariaRequired_getter, set: curMemoryArea.ariaRequired_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRequired_smart_getter = function ariaRequired() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRequired; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRequired !== undefined ? this._ariaRequired : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRequired_smart_getter);
Element.prototype.__defineGetter__("ariaRequired", curMemoryArea.ariaRequired_smart_getter);

// ariaRoleDescription
curMemoryArea.ariaRoleDescription_getter = function ariaRoleDescription() { return this._ariaRoleDescription; }; mframe.safefunction(curMemoryArea.ariaRoleDescription_getter);
Object.defineProperty(curMemoryArea.ariaRoleDescription_getter, "name", { value: "get ariaRoleDescription", configurable: true, });
// ariaRoleDescription
curMemoryArea.ariaRoleDescription_setter = function ariaRoleDescription(val) { this._ariaRoleDescription = val; }; mframe.safefunction(curMemoryArea.ariaRoleDescription_setter);
Object.defineProperty(curMemoryArea.ariaRoleDescription_setter, "name", { value: "set ariaRoleDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRoleDescription", { get: curMemoryArea.ariaRoleDescription_getter, set: curMemoryArea.ariaRoleDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRoleDescription_smart_getter = function ariaRoleDescription() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRoleDescription; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRoleDescription !== undefined ? this._ariaRoleDescription : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRoleDescription_smart_getter);
Element.prototype.__defineGetter__("ariaRoleDescription", curMemoryArea.ariaRoleDescription_smart_getter);

// ariaRowCount
curMemoryArea.ariaRowCount_getter = function ariaRowCount() { return this._ariaRowCount; }; mframe.safefunction(curMemoryArea.ariaRowCount_getter);
Object.defineProperty(curMemoryArea.ariaRowCount_getter, "name", { value: "get ariaRowCount", configurable: true, });
// ariaRowCount
curMemoryArea.ariaRowCount_setter = function ariaRowCount(val) { this._ariaRowCount = val; }; mframe.safefunction(curMemoryArea.ariaRowCount_setter);
Object.defineProperty(curMemoryArea.ariaRowCount_setter, "name", { value: "set ariaRowCount", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowCount", { get: curMemoryArea.ariaRowCount_getter, set: curMemoryArea.ariaRowCount_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowCount_smart_getter = function ariaRowCount() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRowCount; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRowCount !== undefined ? this._ariaRowCount : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRowCount_smart_getter);
Element.prototype.__defineGetter__("ariaRowCount", curMemoryArea.ariaRowCount_smart_getter);

// ariaRowIndex
curMemoryArea.ariaRowIndex_getter = function ariaRowIndex() { return this._ariaRowIndex; }; mframe.safefunction(curMemoryArea.ariaRowIndex_getter);
Object.defineProperty(curMemoryArea.ariaRowIndex_getter, "name", { value: "get ariaRowIndex", configurable: true, });
// ariaRowIndex
curMemoryArea.ariaRowIndex_setter = function ariaRowIndex(val) { this._ariaRowIndex = val; }; mframe.safefunction(curMemoryArea.ariaRowIndex_setter);
Object.defineProperty(curMemoryArea.ariaRowIndex_setter, "name", { value: "set ariaRowIndex", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowIndex", { get: curMemoryArea.ariaRowIndex_getter, set: curMemoryArea.ariaRowIndex_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowIndex_smart_getter = function ariaRowIndex() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRowIndex; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRowIndex !== undefined ? this._ariaRowIndex : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRowIndex_smart_getter);
Element.prototype.__defineGetter__("ariaRowIndex", curMemoryArea.ariaRowIndex_smart_getter);

// ariaRowSpan
curMemoryArea.ariaRowSpan_getter = function ariaRowSpan() { return this._ariaRowSpan; }; mframe.safefunction(curMemoryArea.ariaRowSpan_getter);
Object.defineProperty(curMemoryArea.ariaRowSpan_getter, "name", { value: "get ariaRowSpan", configurable: true, });
// ariaRowSpan
curMemoryArea.ariaRowSpan_setter = function ariaRowSpan(val) { this._ariaRowSpan = val; }; mframe.safefunction(curMemoryArea.ariaRowSpan_setter);
Object.defineProperty(curMemoryArea.ariaRowSpan_setter, "name", { value: "set ariaRowSpan", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowSpan", { get: curMemoryArea.ariaRowSpan_getter, set: curMemoryArea.ariaRowSpan_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowSpan_smart_getter = function ariaRowSpan() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRowSpan; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRowSpan !== undefined ? this._ariaRowSpan : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRowSpan_smart_getter);
Element.prototype.__defineGetter__("ariaRowSpan", curMemoryArea.ariaRowSpan_smart_getter);

// ariaSelected
curMemoryArea.ariaSelected_getter = function ariaSelected() { return this._ariaSelected; }; mframe.safefunction(curMemoryArea.ariaSelected_getter);
Object.defineProperty(curMemoryArea.ariaSelected_getter, "name", { value: "get ariaSelected", configurable: true, });
// ariaSelected
curMemoryArea.ariaSelected_setter = function ariaSelected(val) { this._ariaSelected = val; }; mframe.safefunction(curMemoryArea.ariaSelected_setter);
Object.defineProperty(curMemoryArea.ariaSelected_setter, "name", { value: "set ariaSelected", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSelected", { get: curMemoryArea.ariaSelected_getter, set: curMemoryArea.ariaSelected_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSelected_smart_getter = function ariaSelected() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaSelected; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaSelected !== undefined ? this._ariaSelected : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaSelected_smart_getter);
Element.prototype.__defineGetter__("ariaSelected", curMemoryArea.ariaSelected_smart_getter);

// ariaSetSize
curMemoryArea.ariaSetSize_getter = function ariaSetSize() { return this._ariaSetSize; }; mframe.safefunction(curMemoryArea.ariaSetSize_getter);
Object.defineProperty(curMemoryArea.ariaSetSize_getter, "name", { value: "get ariaSetSize", configurable: true, });
// ariaSetSize
curMemoryArea.ariaSetSize_setter = function ariaSetSize(val) { this._ariaSetSize = val; }; mframe.safefunction(curMemoryArea.ariaSetSize_setter);
Object.defineProperty(curMemoryArea.ariaSetSize_setter, "name", { value: "set ariaSetSize", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSetSize", { get: curMemoryArea.ariaSetSize_getter, set: curMemoryArea.ariaSetSize_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSetSize_smart_getter = function ariaSetSize() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaSetSize; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaSetSize !== undefined ? this._ariaSetSize : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaSetSize_smart_getter);
Element.prototype.__defineGetter__("ariaSetSize", curMemoryArea.ariaSetSize_smart_getter);

// ariaSort
curMemoryArea.ariaSort_getter = function ariaSort() { return this._ariaSort; }; mframe.safefunction(curMemoryArea.ariaSort_getter);
Object.defineProperty(curMemoryArea.ariaSort_getter, "name", { value: "get ariaSort", configurable: true, });
// ariaSort
curMemoryArea.ariaSort_setter = function ariaSort(val) { this._ariaSort = val; }; mframe.safefunction(curMemoryArea.ariaSort_setter);
Object.defineProperty(curMemoryArea.ariaSort_setter, "name", { value: "set ariaSort", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSort", { get: curMemoryArea.ariaSort_getter, set: curMemoryArea.ariaSort_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSort_smart_getter = function ariaSort() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaSort; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaSort !== undefined ? this._ariaSort : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaSort_smart_getter);
Element.prototype.__defineGetter__("ariaSort", curMemoryArea.ariaSort_smart_getter);

// ariaValueMax
curMemoryArea.ariaValueMax_getter = function ariaValueMax() { return this._ariaValueMax; }; mframe.safefunction(curMemoryArea.ariaValueMax_getter);
Object.defineProperty(curMemoryArea.ariaValueMax_getter, "name", { value: "get ariaValueMax", configurable: true, });
// ariaValueMax
curMemoryArea.ariaValueMax_setter = function ariaValueMax(val) { this._ariaValueMax = val; }; mframe.safefunction(curMemoryArea.ariaValueMax_setter);
Object.defineProperty(curMemoryArea.ariaValueMax_setter, "name", { value: "set ariaValueMax", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueMax", { get: curMemoryArea.ariaValueMax_getter, set: curMemoryArea.ariaValueMax_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueMax_smart_getter = function ariaValueMax() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaValueMax; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaValueMax !== undefined ? this._ariaValueMax : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaValueMax_smart_getter);
Element.prototype.__defineGetter__("ariaValueMax", curMemoryArea.ariaValueMax_smart_getter);

// ariaValueMin
curMemoryArea.ariaValueMin_getter = function ariaValueMin() { return this._ariaValueMin; }; mframe.safefunction(curMemoryArea.ariaValueMin_getter);
Object.defineProperty(curMemoryArea.ariaValueMin_getter, "name", { value: "get ariaValueMin", configurable: true, });
// ariaValueMin
curMemoryArea.ariaValueMin_setter = function ariaValueMin(val) { this._ariaValueMin = val; }; mframe.safefunction(curMemoryArea.ariaValueMin_setter);
Object.defineProperty(curMemoryArea.ariaValueMin_setter, "name", { value: "set ariaValueMin", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueMin", { get: curMemoryArea.ariaValueMin_getter, set: curMemoryArea.ariaValueMin_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueMin_smart_getter = function ariaValueMin() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaValueMin; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaValueMin !== undefined ? this._ariaValueMin : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaValueMin_smart_getter);
Element.prototype.__defineGetter__("ariaValueMin", curMemoryArea.ariaValueMin_smart_getter);

// ariaValueNow
curMemoryArea.ariaValueNow_getter = function ariaValueNow() { return this._ariaValueNow; }; mframe.safefunction(curMemoryArea.ariaValueNow_getter);
Object.defineProperty(curMemoryArea.ariaValueNow_getter, "name", { value: "get ariaValueNow", configurable: true, });
// ariaValueNow
curMemoryArea.ariaValueNow_setter = function ariaValueNow(val) { this._ariaValueNow = val; }; mframe.safefunction(curMemoryArea.ariaValueNow_setter);
Object.defineProperty(curMemoryArea.ariaValueNow_setter, "name", { value: "set ariaValueNow", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueNow", { get: curMemoryArea.ariaValueNow_getter, set: curMemoryArea.ariaValueNow_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueNow_smart_getter = function ariaValueNow() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaValueNow; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaValueNow !== undefined ? this._ariaValueNow : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaValueNow_smart_getter);
Element.prototype.__defineGetter__("ariaValueNow", curMemoryArea.ariaValueNow_smart_getter);

// ariaValueText
curMemoryArea.ariaValueText_getter = function ariaValueText() { return this._ariaValueText; }; mframe.safefunction(curMemoryArea.ariaValueText_getter);
Object.defineProperty(curMemoryArea.ariaValueText_getter, "name", { value: "get ariaValueText", configurable: true, });
// ariaValueText
curMemoryArea.ariaValueText_setter = function ariaValueText(val) { this._ariaValueText = val; }; mframe.safefunction(curMemoryArea.ariaValueText_setter);
Object.defineProperty(curMemoryArea.ariaValueText_setter, "name", { value: "set ariaValueText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueText", { get: curMemoryArea.ariaValueText_getter, set: curMemoryArea.ariaValueText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueText_smart_getter = function ariaValueText() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaValueText; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaValueText !== undefined ? this._ariaValueText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaValueText_smart_getter);
Element.prototype.__defineGetter__("ariaValueText", curMemoryArea.ariaValueText_smart_getter);

// children
curMemoryArea.children_getter = function children() { return this._children; }; mframe.safefunction(curMemoryArea.children_getter);
Object.defineProperty(curMemoryArea.children_getter, "name", { value: "get children", configurable: true, });
Object.defineProperty(Element.prototype, "children", { get: curMemoryArea.children_getter, enumerable: true, configurable: true, });
curMemoryArea.children_smart_getter = function children() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.children; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._children !== undefined ? this._children : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.children_smart_getter);
Element.prototype.__defineGetter__("children", curMemoryArea.children_smart_getter);

// firstElementChild
curMemoryArea.firstElementChild_getter = function firstElementChild() { return this._firstElementChild; }; mframe.safefunction(curMemoryArea.firstElementChild_getter);
Object.defineProperty(curMemoryArea.firstElementChild_getter, "name", { value: "get firstElementChild", configurable: true, });
Object.defineProperty(Element.prototype, "firstElementChild", { get: curMemoryArea.firstElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstElementChild_smart_getter = function firstElementChild() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.firstElementChild; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._firstElementChild !== undefined ? this._firstElementChild : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.firstElementChild_smart_getter);
Element.prototype.__defineGetter__("firstElementChild", curMemoryArea.firstElementChild_smart_getter);

// lastElementChild
curMemoryArea.lastElementChild_getter = function lastElementChild() { return this._lastElementChild; }; mframe.safefunction(curMemoryArea.lastElementChild_getter);
Object.defineProperty(curMemoryArea.lastElementChild_getter, "name", { value: "get lastElementChild", configurable: true, });
Object.defineProperty(Element.prototype, "lastElementChild", { get: curMemoryArea.lastElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.lastElementChild_smart_getter = function lastElementChild() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.lastElementChild; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._lastElementChild !== undefined ? this._lastElementChild : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.lastElementChild_smart_getter);
Element.prototype.__defineGetter__("lastElementChild", curMemoryArea.lastElementChild_smart_getter);

// childElementCount
curMemoryArea.childElementCount_getter = function childElementCount() { return this._childElementCount; }; mframe.safefunction(curMemoryArea.childElementCount_getter);
Object.defineProperty(curMemoryArea.childElementCount_getter, "name", { value: "get childElementCount", configurable: true, });
Object.defineProperty(Element.prototype, "childElementCount", { get: curMemoryArea.childElementCount_getter, enumerable: true, configurable: true, });
curMemoryArea.childElementCount_smart_getter = function childElementCount() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.childElementCount; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._childElementCount !== undefined ? this._childElementCount : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.childElementCount_smart_getter);
Element.prototype.__defineGetter__("childElementCount", curMemoryArea.childElementCount_smart_getter);

// previousElementSibling
curMemoryArea.previousElementSibling_getter = function previousElementSibling() { return this._previousElementSibling; }; mframe.safefunction(curMemoryArea.previousElementSibling_getter);
Object.defineProperty(curMemoryArea.previousElementSibling_getter, "name", { value: "get previousElementSibling", configurable: true, });
Object.defineProperty(Element.prototype, "previousElementSibling", { get: curMemoryArea.previousElementSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.previousElementSibling_smart_getter = function previousElementSibling() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.previousElementSibling; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._previousElementSibling !== undefined ? this._previousElementSibling : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.previousElementSibling_smart_getter);
Element.prototype.__defineGetter__("previousElementSibling", curMemoryArea.previousElementSibling_smart_getter);

// nextElementSibling
curMemoryArea.nextElementSibling_getter = function nextElementSibling() { return this._nextElementSibling; }; mframe.safefunction(curMemoryArea.nextElementSibling_getter);
Object.defineProperty(curMemoryArea.nextElementSibling_getter, "name", { value: "get nextElementSibling", configurable: true, });
Object.defineProperty(Element.prototype, "nextElementSibling", { get: curMemoryArea.nextElementSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.nextElementSibling_smart_getter = function nextElementSibling() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.nextElementSibling; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._nextElementSibling !== undefined ? this._nextElementSibling : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.nextElementSibling_smart_getter);
Element.prototype.__defineGetter__("nextElementSibling", curMemoryArea.nextElementSibling_smart_getter);

// currentCSSZoom
curMemoryArea.currentCSSZoom_getter = function currentCSSZoom() { return this._currentCSSZoom; }; mframe.safefunction(curMemoryArea.currentCSSZoom_getter);
Object.defineProperty(curMemoryArea.currentCSSZoom_getter, "name", { value: "get currentCSSZoom", configurable: true, });
Object.defineProperty(Element.prototype, "currentCSSZoom", { get: curMemoryArea.currentCSSZoom_getter, enumerable: true, configurable: true, });
curMemoryArea.currentCSSZoom_smart_getter = function currentCSSZoom() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.currentCSSZoom; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._currentCSSZoom !== undefined ? this._currentCSSZoom : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.currentCSSZoom_smart_getter);
Element.prototype.__defineGetter__("currentCSSZoom", curMemoryArea.currentCSSZoom_smart_getter);

// ariaColIndexText
curMemoryArea.ariaColIndexText_getter = function ariaColIndexText() { return this._ariaColIndexText; }; mframe.safefunction(curMemoryArea.ariaColIndexText_getter);
Object.defineProperty(curMemoryArea.ariaColIndexText_getter, "name", { value: "get ariaColIndexText", configurable: true, });
// ariaColIndexText
curMemoryArea.ariaColIndexText_setter = function ariaColIndexText(val) { this._ariaColIndexText = val; }; mframe.safefunction(curMemoryArea.ariaColIndexText_setter);
Object.defineProperty(curMemoryArea.ariaColIndexText_setter, "name", { value: "set ariaColIndexText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColIndexText", { get: curMemoryArea.ariaColIndexText_getter, set: curMemoryArea.ariaColIndexText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColIndexText_smart_getter = function ariaColIndexText() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaColIndexText; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaColIndexText !== undefined ? this._ariaColIndexText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaColIndexText_smart_getter);
Element.prototype.__defineGetter__("ariaColIndexText", curMemoryArea.ariaColIndexText_smart_getter);

// ariaRowIndexText
curMemoryArea.ariaRowIndexText_getter = function ariaRowIndexText() { return this._ariaRowIndexText; }; mframe.safefunction(curMemoryArea.ariaRowIndexText_getter);
Object.defineProperty(curMemoryArea.ariaRowIndexText_getter, "name", { value: "get ariaRowIndexText", configurable: true, });
// ariaRowIndexText
curMemoryArea.ariaRowIndexText_setter = function ariaRowIndexText(val) { this._ariaRowIndexText = val; }; mframe.safefunction(curMemoryArea.ariaRowIndexText_setter);
Object.defineProperty(curMemoryArea.ariaRowIndexText_setter, "name", { value: "set ariaRowIndexText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowIndexText", { get: curMemoryArea.ariaRowIndexText_getter, set: curMemoryArea.ariaRowIndexText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowIndexText_smart_getter = function ariaRowIndexText() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRowIndexText; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRowIndexText !== undefined ? this._ariaRowIndexText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRowIndexText_smart_getter);
Element.prototype.__defineGetter__("ariaRowIndexText", curMemoryArea.ariaRowIndexText_smart_getter);

// ariaActiveDescendantElement
curMemoryArea.ariaActiveDescendantElement_getter = function ariaActiveDescendantElement() { return this._ariaActiveDescendantElement; }; mframe.safefunction(curMemoryArea.ariaActiveDescendantElement_getter);
Object.defineProperty(curMemoryArea.ariaActiveDescendantElement_getter, "name", { value: "get ariaActiveDescendantElement", configurable: true, });
// ariaActiveDescendantElement
curMemoryArea.ariaActiveDescendantElement_setter = function ariaActiveDescendantElement(val) { this._ariaActiveDescendantElement = val; }; mframe.safefunction(curMemoryArea.ariaActiveDescendantElement_setter);
Object.defineProperty(curMemoryArea.ariaActiveDescendantElement_setter, "name", { value: "set ariaActiveDescendantElement", configurable: true, });
Object.defineProperty(Element.prototype, "ariaActiveDescendantElement", { get: curMemoryArea.ariaActiveDescendantElement_getter, set: curMemoryArea.ariaActiveDescendantElement_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaActiveDescendantElement_smart_getter = function ariaActiveDescendantElement() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaActiveDescendantElement; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaActiveDescendantElement !== undefined ? this._ariaActiveDescendantElement : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaActiveDescendantElement_smart_getter);
Element.prototype.__defineGetter__("ariaActiveDescendantElement", curMemoryArea.ariaActiveDescendantElement_smart_getter);

// ariaControlsElements
curMemoryArea.ariaControlsElements_getter = function ariaControlsElements() { return this._ariaControlsElements; }; mframe.safefunction(curMemoryArea.ariaControlsElements_getter);
Object.defineProperty(curMemoryArea.ariaControlsElements_getter, "name", { value: "get ariaControlsElements", configurable: true, });
// ariaControlsElements
curMemoryArea.ariaControlsElements_setter = function ariaControlsElements(val) { this._ariaControlsElements = val; }; mframe.safefunction(curMemoryArea.ariaControlsElements_setter);
Object.defineProperty(curMemoryArea.ariaControlsElements_setter, "name", { value: "set ariaControlsElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaControlsElements", { get: curMemoryArea.ariaControlsElements_getter, set: curMemoryArea.ariaControlsElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaControlsElements_smart_getter = function ariaControlsElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaControlsElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaControlsElements !== undefined ? this._ariaControlsElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaControlsElements_smart_getter);
Element.prototype.__defineGetter__("ariaControlsElements", curMemoryArea.ariaControlsElements_smart_getter);

// ariaDescribedByElements
curMemoryArea.ariaDescribedByElements_getter = function ariaDescribedByElements() { return this._ariaDescribedByElements; }; mframe.safefunction(curMemoryArea.ariaDescribedByElements_getter);
Object.defineProperty(curMemoryArea.ariaDescribedByElements_getter, "name", { value: "get ariaDescribedByElements", configurable: true, });
// ariaDescribedByElements
curMemoryArea.ariaDescribedByElements_setter = function ariaDescribedByElements(val) { this._ariaDescribedByElements = val; }; mframe.safefunction(curMemoryArea.ariaDescribedByElements_setter);
Object.defineProperty(curMemoryArea.ariaDescribedByElements_setter, "name", { value: "set ariaDescribedByElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDescribedByElements", { get: curMemoryArea.ariaDescribedByElements_getter, set: curMemoryArea.ariaDescribedByElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDescribedByElements_smart_getter = function ariaDescribedByElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaDescribedByElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaDescribedByElements !== undefined ? this._ariaDescribedByElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaDescribedByElements_smart_getter);
Element.prototype.__defineGetter__("ariaDescribedByElements", curMemoryArea.ariaDescribedByElements_smart_getter);

// ariaDetailsElements
curMemoryArea.ariaDetailsElements_getter = function ariaDetailsElements() { return this._ariaDetailsElements; }; mframe.safefunction(curMemoryArea.ariaDetailsElements_getter);
Object.defineProperty(curMemoryArea.ariaDetailsElements_getter, "name", { value: "get ariaDetailsElements", configurable: true, });
// ariaDetailsElements
curMemoryArea.ariaDetailsElements_setter = function ariaDetailsElements(val) { this._ariaDetailsElements = val; }; mframe.safefunction(curMemoryArea.ariaDetailsElements_setter);
Object.defineProperty(curMemoryArea.ariaDetailsElements_setter, "name", { value: "set ariaDetailsElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDetailsElements", { get: curMemoryArea.ariaDetailsElements_getter, set: curMemoryArea.ariaDetailsElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDetailsElements_smart_getter = function ariaDetailsElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaDetailsElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaDetailsElements !== undefined ? this._ariaDetailsElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaDetailsElements_smart_getter);
Element.prototype.__defineGetter__("ariaDetailsElements", curMemoryArea.ariaDetailsElements_smart_getter);

// ariaErrorMessageElements
curMemoryArea.ariaErrorMessageElements_getter = function ariaErrorMessageElements() { return this._ariaErrorMessageElements; }; mframe.safefunction(curMemoryArea.ariaErrorMessageElements_getter);
Object.defineProperty(curMemoryArea.ariaErrorMessageElements_getter, "name", { value: "get ariaErrorMessageElements", configurable: true, });
// ariaErrorMessageElements
curMemoryArea.ariaErrorMessageElements_setter = function ariaErrorMessageElements(val) { this._ariaErrorMessageElements = val; }; mframe.safefunction(curMemoryArea.ariaErrorMessageElements_setter);
Object.defineProperty(curMemoryArea.ariaErrorMessageElements_setter, "name", { value: "set ariaErrorMessageElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaErrorMessageElements", { get: curMemoryArea.ariaErrorMessageElements_getter, set: curMemoryArea.ariaErrorMessageElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaErrorMessageElements_smart_getter = function ariaErrorMessageElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaErrorMessageElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaErrorMessageElements !== undefined ? this._ariaErrorMessageElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaErrorMessageElements_smart_getter);
Element.prototype.__defineGetter__("ariaErrorMessageElements", curMemoryArea.ariaErrorMessageElements_smart_getter);

// ariaFlowToElements
curMemoryArea.ariaFlowToElements_getter = function ariaFlowToElements() { return this._ariaFlowToElements; }; mframe.safefunction(curMemoryArea.ariaFlowToElements_getter);
Object.defineProperty(curMemoryArea.ariaFlowToElements_getter, "name", { value: "get ariaFlowToElements", configurable: true, });
// ariaFlowToElements
curMemoryArea.ariaFlowToElements_setter = function ariaFlowToElements(val) { this._ariaFlowToElements = val; }; mframe.safefunction(curMemoryArea.ariaFlowToElements_setter);
Object.defineProperty(curMemoryArea.ariaFlowToElements_setter, "name", { value: "set ariaFlowToElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaFlowToElements", { get: curMemoryArea.ariaFlowToElements_getter, set: curMemoryArea.ariaFlowToElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaFlowToElements_smart_getter = function ariaFlowToElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaFlowToElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaFlowToElements !== undefined ? this._ariaFlowToElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaFlowToElements_smart_getter);
Element.prototype.__defineGetter__("ariaFlowToElements", curMemoryArea.ariaFlowToElements_smart_getter);

// ariaLabelledByElements
curMemoryArea.ariaLabelledByElements_getter = function ariaLabelledByElements() { return this._ariaLabelledByElements; }; mframe.safefunction(curMemoryArea.ariaLabelledByElements_getter);
Object.defineProperty(curMemoryArea.ariaLabelledByElements_getter, "name", { value: "get ariaLabelledByElements", configurable: true, });
// ariaLabelledByElements
curMemoryArea.ariaLabelledByElements_setter = function ariaLabelledByElements(val) { this._ariaLabelledByElements = val; }; mframe.safefunction(curMemoryArea.ariaLabelledByElements_setter);
Object.defineProperty(curMemoryArea.ariaLabelledByElements_setter, "name", { value: "set ariaLabelledByElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLabelledByElements", { get: curMemoryArea.ariaLabelledByElements_getter, set: curMemoryArea.ariaLabelledByElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLabelledByElements_smart_getter = function ariaLabelledByElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaLabelledByElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaLabelledByElements !== undefined ? this._ariaLabelledByElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaLabelledByElements_smart_getter);
Element.prototype.__defineGetter__("ariaLabelledByElements", curMemoryArea.ariaLabelledByElements_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
Element.prototype["after"] = function after() { debugger; }; mframe.safefunction(Element.prototype["after"]);
Element.prototype["animate"] = function animate() { debugger; }; mframe.safefunction(Element.prototype["animate"]);
Element.prototype["append"] = function append() { debugger; }; mframe.safefunction(Element.prototype["append"]);
Element.prototype["attachShadow"] = function attachShadow() { debugger; }; mframe.safefunction(Element.prototype["attachShadow"]);
Element.prototype["before"] = function before() { debugger; }; mframe.safefunction(Element.prototype["before"]);
Element.prototype["checkVisibility"] = function checkVisibility() { debugger; }; mframe.safefunction(Element.prototype["checkVisibility"]);
Element.prototype["closest"] = function closest() { debugger; }; mframe.safefunction(Element.prototype["closest"]);
Element.prototype["computedStyleMap"] = function computedStyleMap() { debugger; }; mframe.safefunction(Element.prototype["computedStyleMap"]);
Element.prototype["getAnimations"] = function getAnimations() { debugger; }; mframe.safefunction(Element.prototype["getAnimations"]);
Element.prototype["getAttributeNS"] = function getAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNS"]);
Element.prototype["getAttributeNames"] = function getAttributeNames() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNames"]);
Element.prototype["getAttributeNode"] = function getAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNode"]);
Element.prototype["getAttributeNodeNS"] = function getAttributeNodeNS() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNodeNS"]);
Element.prototype["getBoundingClientRect"] = function getBoundingClientRect() { debugger; }; mframe.safefunction(Element.prototype["getBoundingClientRect"]);
Element.prototype["getClientRects"] = function getClientRects() { debugger; }; mframe.safefunction(Element.prototype["getClientRects"]);
Element.prototype["getElementsByClassName"] = function getElementsByClassName() { debugger; }; mframe.safefunction(Element.prototype["getElementsByClassName"]);
Element.prototype["getElementsByTagName"] = function getElementsByTagName(tagName) {
    debugger;
    if (mframe.memory.jsdom.document) { // 有jsdom
        console.log('Element.prototype["getElementsByTagName"]==>', tagName);
        // 这个方法返回是tageName为name的所有标签, 是返回数组, so我们要代理这个数组中的所有对象
        var elements = mframe.memory.jsdom.document.getElementsByTagName(tagName);
        return mframe.memory.htmlelements['collection'](elements);
    }
    debugger;

}; mframe.safefunction(Element.prototype["getElementsByTagName"]);
Element.prototype["getElementsByTagNameNS"] = function getElementsByTagNameNS() { debugger; }; mframe.safefunction(Element.prototype["getElementsByTagNameNS"]);
Element.prototype["getHTML"] = function getHTML() { debugger; }; mframe.safefunction(Element.prototype["getHTML"]);
Element.prototype["hasAttribute"] = function hasAttribute() { debugger; }; mframe.safefunction(Element.prototype["hasAttribute"]);
Element.prototype["hasAttributeNS"] = function hasAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["hasAttributeNS"]);
Element.prototype["hasAttributes"] = function hasAttributes() { debugger; }; mframe.safefunction(Element.prototype["hasAttributes"]);
Element.prototype["hasPointerCapture"] = function hasPointerCapture() { debugger; }; mframe.safefunction(Element.prototype["hasPointerCapture"]);
Element.prototype["insertAdjacentElement"] = function insertAdjacentElement() { debugger; }; mframe.safefunction(Element.prototype["insertAdjacentElement"]);
Element.prototype["insertAdjacentHTML"] = function insertAdjacentHTML() { debugger; }; mframe.safefunction(Element.prototype["insertAdjacentHTML"]);
Element.prototype["insertAdjacentText"] = function insertAdjacentText() { debugger; }; mframe.safefunction(Element.prototype["insertAdjacentText"]);
Element.prototype["matches"] = function matches() { debugger; }; mframe.safefunction(Element.prototype["matches"]);
Element.prototype["moveBefore"] = function moveBefore() { debugger; }; mframe.safefunction(Element.prototype["moveBefore"]);
Element.prototype["prepend"] = function prepend() { debugger; }; mframe.safefunction(Element.prototype["prepend"]);
Element.prototype["querySelector"] = function querySelector() { debugger; }; mframe.safefunction(Element.prototype["querySelector"]);
Element.prototype["querySelectorAll"] = function querySelectorAll() { debugger; }; mframe.safefunction(Element.prototype["querySelectorAll"]);
Element.prototype["releasePointerCapture"] = function releasePointerCapture() { debugger; }; mframe.safefunction(Element.prototype["releasePointerCapture"]);
Element.prototype["remove"] = function remove() { debugger; }; mframe.safefunction(Element.prototype["remove"]);
Element.prototype["removeAttribute"] = function removeAttribute() { debugger; }; mframe.safefunction(Element.prototype["removeAttribute"]);
Element.prototype["removeAttributeNS"] = function removeAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["removeAttributeNS"]);
Element.prototype["removeAttributeNode"] = function removeAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["removeAttributeNode"]);
Element.prototype["replaceChildren"] = function replaceChildren() { debugger; }; mframe.safefunction(Element.prototype["replaceChildren"]);
Element.prototype["replaceWith"] = function replaceWith() { debugger; }; mframe.safefunction(Element.prototype["replaceWith"]);
Element.prototype["requestFullscreen"] = function requestFullscreen() { debugger; }; mframe.safefunction(Element.prototype["requestFullscreen"]);
Element.prototype["requestPointerLock"] = function requestPointerLock() { debugger; }; mframe.safefunction(Element.prototype["requestPointerLock"]);
Element.prototype["scroll"] = function scroll() { debugger; }; mframe.safefunction(Element.prototype["scroll"]);
Element.prototype["scrollBy"] = function scrollBy() { debugger; }; mframe.safefunction(Element.prototype["scrollBy"]);
Element.prototype["scrollIntoView"] = function scrollIntoView() { debugger; }; mframe.safefunction(Element.prototype["scrollIntoView"]);
Element.prototype["scrollIntoViewIfNeeded"] = function scrollIntoViewIfNeeded() { debugger; }; mframe.safefunction(Element.prototype["scrollIntoViewIfNeeded"]);
Element.prototype["scrollTo"] = function scrollTo() { debugger; }; mframe.safefunction(Element.prototype["scrollTo"]);
Element.prototype["setAttributeNS"] = function setAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNS"]);
Element.prototype["setAttributeNode"] = function setAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNode"]);
Element.prototype["setAttributeNodeNS"] = function setAttributeNodeNS() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNodeNS"]);
Element.prototype["setHTMLUnsafe"] = function setHTMLUnsafe() { debugger; }; mframe.safefunction(Element.prototype["setHTMLUnsafe"]);
Element.prototype["setPointerCapture"] = function setPointerCapture() { debugger; }; mframe.safefunction(Element.prototype["setPointerCapture"]);
Element.prototype["toggleAttribute"] = function toggleAttribute() { debugger; }; mframe.safefunction(Element.prototype["toggleAttribute"]);
Element.prototype["webkitMatchesSelector"] = function webkitMatchesSelector() { debugger; }; mframe.safefunction(Element.prototype["webkitMatchesSelector"]);
Element.prototype["webkitRequestFullScreen"] = function webkitRequestFullScreen() { debugger; }; mframe.safefunction(Element.prototype["webkitRequestFullScreen"]);
Element.prototype["webkitRequestFullscreen"] = function webkitRequestFullscreen() { debugger; }; mframe.safefunction(Element.prototype["webkitRequestFullscreen"]);
Element.prototype["setAttribute"] = function setAttribute(name, value) {
    if (mframe.memory.jsdom.document) {
        return this.jsdomMemory.setAttribute(name, value);
    }
}; mframe.safefunction(Element.prototype["setAttribute"]);

// 2025年4月12日14:28:38; 你知道吗? 这个bug我找了2天(20h)
// 终于明白日志的重要性, 准备封装完整的日志功能 TODO
Element.prototype["getAttribute"] = function getAttribute(name) {
    console.log(`Element.prototype["getAttribute"] name:${name}; value:${this.jsdomMemory.getAttribute(name)}`);
    if (mframe.memory.jsdom.document) {
        return this.jsdomMemory.getAttribute(name);
    }
}; mframe.safefunction(Element.prototype["getAttribute"]);

//==============↑↑Function END↑↑====================


// === hook jsdom====
// append
const or_append = mframe.memory.jsdom.window.Element.prototype.append
mframe.memory.jsdom.window.Element.prototype.append = function (child) {
    console.log("调用jsdom内部的 Element.prototype.append", child);
    return or_append.call(this, child.jsdomMemory ? child.jsdomMemory : child);
}
// =======end========

////////////////////////////////////////////////////////////////////


/**代理 */
Element.prototype.__proto__ = Node.prototype;
Element = mframe.proxy(Element)
var HTMLElement = function HTMLElement() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(HTMLElement)

Object.defineProperties(HTMLElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLElement",
        configurable: true,
    }
})


//////////////////////////////////
var curMemoryArea = mframe.memory.HTMLElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// title
curMemoryArea.title_getter = function title() { return this._title; }; mframe.safefunction(curMemoryArea.title_getter);
Object.defineProperty(curMemoryArea.title_getter, "name", {value: "get title",configurable: true,});
// title
curMemoryArea.title_setter = function title(val) { this._title = val; }; mframe.safefunction(curMemoryArea.title_setter);
Object.defineProperty(curMemoryArea.title_setter, "name", {value: "set title",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "title", {get: curMemoryArea.title_getter,set: curMemoryArea.title_setter,enumerable: true,configurable: true,});
curMemoryArea.title_smart_getter = function title() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.title;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._title !== undefined ? this._title : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.title_smart_getter);
HTMLElement.prototype.__defineGetter__("title", curMemoryArea.title_smart_getter);

// lang
curMemoryArea.lang_getter = function lang() { return this._lang; }; mframe.safefunction(curMemoryArea.lang_getter);
Object.defineProperty(curMemoryArea.lang_getter, "name", {value: "get lang",configurable: true,});
// lang
curMemoryArea.lang_setter = function lang(val) { this._lang = val; }; mframe.safefunction(curMemoryArea.lang_setter);
Object.defineProperty(curMemoryArea.lang_setter, "name", {value: "set lang",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "lang", {get: curMemoryArea.lang_getter,set: curMemoryArea.lang_setter,enumerable: true,configurable: true,});
curMemoryArea.lang_smart_getter = function lang() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.lang;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._lang !== undefined ? this._lang : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.lang_smart_getter);
HTMLElement.prototype.__defineGetter__("lang", curMemoryArea.lang_smart_getter);

// translate
curMemoryArea.translate_getter = function translate() { return this._translate; }; mframe.safefunction(curMemoryArea.translate_getter);
Object.defineProperty(curMemoryArea.translate_getter, "name", {value: "get translate",configurable: true,});
// translate
curMemoryArea.translate_setter = function translate(val) { this._translate = val; }; mframe.safefunction(curMemoryArea.translate_setter);
Object.defineProperty(curMemoryArea.translate_setter, "name", {value: "set translate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "translate", {get: curMemoryArea.translate_getter,set: curMemoryArea.translate_setter,enumerable: true,configurable: true,});
curMemoryArea.translate_smart_getter = function translate() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.translate;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._translate !== undefined ? this._translate : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.translate_smart_getter);
HTMLElement.prototype.__defineGetter__("translate", curMemoryArea.translate_smart_getter);

// dir
curMemoryArea.dir_getter = function dir() { return this._dir; }; mframe.safefunction(curMemoryArea.dir_getter);
Object.defineProperty(curMemoryArea.dir_getter, "name", {value: "get dir",configurable: true,});
// dir
curMemoryArea.dir_setter = function dir(val) { this._dir = val; }; mframe.safefunction(curMemoryArea.dir_setter);
Object.defineProperty(curMemoryArea.dir_setter, "name", {value: "set dir",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "dir", {get: curMemoryArea.dir_getter,set: curMemoryArea.dir_setter,enumerable: true,configurable: true,});
curMemoryArea.dir_smart_getter = function dir() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.dir;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._dir !== undefined ? this._dir : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.dir_smart_getter);
HTMLElement.prototype.__defineGetter__("dir", curMemoryArea.dir_smart_getter);

// hidden
curMemoryArea.hidden_getter = function hidden() { return this._hidden; }; mframe.safefunction(curMemoryArea.hidden_getter);
Object.defineProperty(curMemoryArea.hidden_getter, "name", {value: "get hidden",configurable: true,});
// hidden
curMemoryArea.hidden_setter = function hidden(val) { this._hidden = val; }; mframe.safefunction(curMemoryArea.hidden_setter);
Object.defineProperty(curMemoryArea.hidden_setter, "name", {value: "set hidden",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "hidden", {get: curMemoryArea.hidden_getter,set: curMemoryArea.hidden_setter,enumerable: true,configurable: true,});
curMemoryArea.hidden_smart_getter = function hidden() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.hidden;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._hidden !== undefined ? this._hidden : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.hidden_smart_getter);
HTMLElement.prototype.__defineGetter__("hidden", curMemoryArea.hidden_smart_getter);

// inert
curMemoryArea.inert_getter = function inert() { return this._inert; }; mframe.safefunction(curMemoryArea.inert_getter);
Object.defineProperty(curMemoryArea.inert_getter, "name", {value: "get inert",configurable: true,});
// inert
curMemoryArea.inert_setter = function inert(val) { this._inert = val; }; mframe.safefunction(curMemoryArea.inert_setter);
Object.defineProperty(curMemoryArea.inert_setter, "name", {value: "set inert",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "inert", {get: curMemoryArea.inert_getter,set: curMemoryArea.inert_setter,enumerable: true,configurable: true,});
curMemoryArea.inert_smart_getter = function inert() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.inert;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._inert !== undefined ? this._inert : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.inert_smart_getter);
HTMLElement.prototype.__defineGetter__("inert", curMemoryArea.inert_smart_getter);

// accessKey
curMemoryArea.accessKey_getter = function accessKey() { return this._accessKey; }; mframe.safefunction(curMemoryArea.accessKey_getter);
Object.defineProperty(curMemoryArea.accessKey_getter, "name", {value: "get accessKey",configurable: true,});
// accessKey
curMemoryArea.accessKey_setter = function accessKey(val) { this._accessKey = val; }; mframe.safefunction(curMemoryArea.accessKey_setter);
Object.defineProperty(curMemoryArea.accessKey_setter, "name", {value: "set accessKey",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "accessKey", {get: curMemoryArea.accessKey_getter,set: curMemoryArea.accessKey_setter,enumerable: true,configurable: true,});
curMemoryArea.accessKey_smart_getter = function accessKey() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.accessKey;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._accessKey !== undefined ? this._accessKey : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.accessKey_smart_getter);
HTMLElement.prototype.__defineGetter__("accessKey", curMemoryArea.accessKey_smart_getter);

// draggable
curMemoryArea.draggable_getter = function draggable() { return this._draggable; }; mframe.safefunction(curMemoryArea.draggable_getter);
Object.defineProperty(curMemoryArea.draggable_getter, "name", {value: "get draggable",configurable: true,});
// draggable
curMemoryArea.draggable_setter = function draggable(val) { this._draggable = val; }; mframe.safefunction(curMemoryArea.draggable_setter);
Object.defineProperty(curMemoryArea.draggable_setter, "name", {value: "set draggable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "draggable", {get: curMemoryArea.draggable_getter,set: curMemoryArea.draggable_setter,enumerable: true,configurable: true,});
curMemoryArea.draggable_smart_getter = function draggable() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.draggable;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._draggable !== undefined ? this._draggable : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.draggable_smart_getter);
HTMLElement.prototype.__defineGetter__("draggable", curMemoryArea.draggable_smart_getter);

// spellcheck
curMemoryArea.spellcheck_getter = function spellcheck() { return this._spellcheck; }; mframe.safefunction(curMemoryArea.spellcheck_getter);
Object.defineProperty(curMemoryArea.spellcheck_getter, "name", {value: "get spellcheck",configurable: true,});
// spellcheck
curMemoryArea.spellcheck_setter = function spellcheck(val) { this._spellcheck = val; }; mframe.safefunction(curMemoryArea.spellcheck_setter);
Object.defineProperty(curMemoryArea.spellcheck_setter, "name", {value: "set spellcheck",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "spellcheck", {get: curMemoryArea.spellcheck_getter,set: curMemoryArea.spellcheck_setter,enumerable: true,configurable: true,});
curMemoryArea.spellcheck_smart_getter = function spellcheck() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.spellcheck;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._spellcheck !== undefined ? this._spellcheck : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.spellcheck_smart_getter);
HTMLElement.prototype.__defineGetter__("spellcheck", curMemoryArea.spellcheck_smart_getter);

// autocapitalize
curMemoryArea.autocapitalize_getter = function autocapitalize() { return this._autocapitalize; }; mframe.safefunction(curMemoryArea.autocapitalize_getter);
Object.defineProperty(curMemoryArea.autocapitalize_getter, "name", {value: "get autocapitalize",configurable: true,});
// autocapitalize
curMemoryArea.autocapitalize_setter = function autocapitalize(val) { this._autocapitalize = val; }; mframe.safefunction(curMemoryArea.autocapitalize_setter);
Object.defineProperty(curMemoryArea.autocapitalize_setter, "name", {value: "set autocapitalize",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "autocapitalize", {get: curMemoryArea.autocapitalize_getter,set: curMemoryArea.autocapitalize_setter,enumerable: true,configurable: true,});
curMemoryArea.autocapitalize_smart_getter = function autocapitalize() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.autocapitalize;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._autocapitalize !== undefined ? this._autocapitalize : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.autocapitalize_smart_getter);
HTMLElement.prototype.__defineGetter__("autocapitalize", curMemoryArea.autocapitalize_smart_getter);

// editContext
curMemoryArea.editContext_getter = function editContext() { return this._editContext; }; mframe.safefunction(curMemoryArea.editContext_getter);
Object.defineProperty(curMemoryArea.editContext_getter, "name", {value: "get editContext",configurable: true,});
// editContext
curMemoryArea.editContext_setter = function editContext(val) { this._editContext = val; }; mframe.safefunction(curMemoryArea.editContext_setter);
Object.defineProperty(curMemoryArea.editContext_setter, "name", {value: "set editContext",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "editContext", {get: curMemoryArea.editContext_getter,set: curMemoryArea.editContext_setter,enumerable: true,configurable: true,});
curMemoryArea.editContext_smart_getter = function editContext() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.editContext;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._editContext !== undefined ? this._editContext : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.editContext_smart_getter);
HTMLElement.prototype.__defineGetter__("editContext", curMemoryArea.editContext_smart_getter);

// contentEditable
curMemoryArea.contentEditable_getter = function contentEditable() { return this._contentEditable; }; mframe.safefunction(curMemoryArea.contentEditable_getter);
Object.defineProperty(curMemoryArea.contentEditable_getter, "name", {value: "get contentEditable",configurable: true,});
// contentEditable
curMemoryArea.contentEditable_setter = function contentEditable(val) { this._contentEditable = val; }; mframe.safefunction(curMemoryArea.contentEditable_setter);
Object.defineProperty(curMemoryArea.contentEditable_setter, "name", {value: "set contentEditable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "contentEditable", {get: curMemoryArea.contentEditable_getter,set: curMemoryArea.contentEditable_setter,enumerable: true,configurable: true,});
curMemoryArea.contentEditable_smart_getter = function contentEditable() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.contentEditable;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._contentEditable !== undefined ? this._contentEditable : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.contentEditable_smart_getter);
HTMLElement.prototype.__defineGetter__("contentEditable", curMemoryArea.contentEditable_smart_getter);

// enterKeyHint
curMemoryArea.enterKeyHint_getter = function enterKeyHint() { return this._enterKeyHint; }; mframe.safefunction(curMemoryArea.enterKeyHint_getter);
Object.defineProperty(curMemoryArea.enterKeyHint_getter, "name", {value: "get enterKeyHint",configurable: true,});
// enterKeyHint
curMemoryArea.enterKeyHint_setter = function enterKeyHint(val) { this._enterKeyHint = val; }; mframe.safefunction(curMemoryArea.enterKeyHint_setter);
Object.defineProperty(curMemoryArea.enterKeyHint_setter, "name", {value: "set enterKeyHint",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "enterKeyHint", {get: curMemoryArea.enterKeyHint_getter,set: curMemoryArea.enterKeyHint_setter,enumerable: true,configurable: true,});
curMemoryArea.enterKeyHint_smart_getter = function enterKeyHint() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.enterKeyHint;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._enterKeyHint !== undefined ? this._enterKeyHint : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.enterKeyHint_smart_getter);
HTMLElement.prototype.__defineGetter__("enterKeyHint", curMemoryArea.enterKeyHint_smart_getter);

// isContentEditable
curMemoryArea.isContentEditable_getter = function isContentEditable() { return this._isContentEditable; }; mframe.safefunction(curMemoryArea.isContentEditable_getter);
Object.defineProperty(curMemoryArea.isContentEditable_getter, "name", {value: "get isContentEditable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "isContentEditable", {get: curMemoryArea.isContentEditable_getter,enumerable: true,configurable: true,});
curMemoryArea.isContentEditable_smart_getter = function isContentEditable() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.isContentEditable;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._isContentEditable !== undefined ? this._isContentEditable : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.isContentEditable_smart_getter);
HTMLElement.prototype.__defineGetter__("isContentEditable", curMemoryArea.isContentEditable_smart_getter);

// inputMode
curMemoryArea.inputMode_getter = function inputMode() { return this._inputMode; }; mframe.safefunction(curMemoryArea.inputMode_getter);
Object.defineProperty(curMemoryArea.inputMode_getter, "name", {value: "get inputMode",configurable: true,});
// inputMode
curMemoryArea.inputMode_setter = function inputMode(val) { this._inputMode = val; }; mframe.safefunction(curMemoryArea.inputMode_setter);
Object.defineProperty(curMemoryArea.inputMode_setter, "name", {value: "set inputMode",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "inputMode", {get: curMemoryArea.inputMode_getter,set: curMemoryArea.inputMode_setter,enumerable: true,configurable: true,});
curMemoryArea.inputMode_smart_getter = function inputMode() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.inputMode;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._inputMode !== undefined ? this._inputMode : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.inputMode_smart_getter);
HTMLElement.prototype.__defineGetter__("inputMode", curMemoryArea.inputMode_smart_getter);

// virtualKeyboardPolicy
curMemoryArea.virtualKeyboardPolicy_getter = function virtualKeyboardPolicy() { return this._virtualKeyboardPolicy; }; mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_getter);
Object.defineProperty(curMemoryArea.virtualKeyboardPolicy_getter, "name", {value: "get virtualKeyboardPolicy",configurable: true,});
// virtualKeyboardPolicy
curMemoryArea.virtualKeyboardPolicy_setter = function virtualKeyboardPolicy(val) { this._virtualKeyboardPolicy = val; }; mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_setter);
Object.defineProperty(curMemoryArea.virtualKeyboardPolicy_setter, "name", {value: "set virtualKeyboardPolicy",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "virtualKeyboardPolicy", {get: curMemoryArea.virtualKeyboardPolicy_getter,set: curMemoryArea.virtualKeyboardPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.virtualKeyboardPolicy_smart_getter = function virtualKeyboardPolicy() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.virtualKeyboardPolicy;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._virtualKeyboardPolicy !== undefined ? this._virtualKeyboardPolicy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_smart_getter);
HTMLElement.prototype.__defineGetter__("virtualKeyboardPolicy", curMemoryArea.virtualKeyboardPolicy_smart_getter);

// offsetParent
curMemoryArea.offsetParent_getter = function offsetParent() { return this._offsetParent; }; mframe.safefunction(curMemoryArea.offsetParent_getter);
Object.defineProperty(curMemoryArea.offsetParent_getter, "name", {value: "get offsetParent",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetParent", {get: curMemoryArea.offsetParent_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetParent_smart_getter = function offsetParent() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetParent;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetParent !== undefined ? this._offsetParent : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetParent_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetParent", curMemoryArea.offsetParent_smart_getter);

// offsetTop
curMemoryArea.offsetTop_getter = function offsetTop() { return this._offsetTop; }; mframe.safefunction(curMemoryArea.offsetTop_getter);
Object.defineProperty(curMemoryArea.offsetTop_getter, "name", {value: "get offsetTop",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetTop", {get: curMemoryArea.offsetTop_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetTop_smart_getter = function offsetTop() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetTop;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetTop !== undefined ? this._offsetTop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetTop_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetTop", curMemoryArea.offsetTop_smart_getter);

// offsetLeft
curMemoryArea.offsetLeft_getter = function offsetLeft() { return this._offsetLeft; }; mframe.safefunction(curMemoryArea.offsetLeft_getter);
Object.defineProperty(curMemoryArea.offsetLeft_getter, "name", {value: "get offsetLeft",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetLeft", {get: curMemoryArea.offsetLeft_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetLeft_smart_getter = function offsetLeft() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetLeft;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetLeft !== undefined ? this._offsetLeft : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetLeft_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetLeft", curMemoryArea.offsetLeft_smart_getter);

// offsetWidth
curMemoryArea.offsetWidth_getter = function offsetWidth() { return this._offsetWidth; }; mframe.safefunction(curMemoryArea.offsetWidth_getter);
Object.defineProperty(curMemoryArea.offsetWidth_getter, "name", {value: "get offsetWidth",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetWidth", {get: curMemoryArea.offsetWidth_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetWidth_smart_getter = function offsetWidth() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetWidth;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetWidth !== undefined ? this._offsetWidth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetWidth_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetWidth", curMemoryArea.offsetWidth_smart_getter);

// offsetHeight
curMemoryArea.offsetHeight_getter = function offsetHeight() { return this._offsetHeight; }; mframe.safefunction(curMemoryArea.offsetHeight_getter);
Object.defineProperty(curMemoryArea.offsetHeight_getter, "name", {value: "get offsetHeight",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {get: curMemoryArea.offsetHeight_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetHeight_smart_getter = function offsetHeight() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetHeight;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetHeight !== undefined ? this._offsetHeight : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetHeight_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetHeight", curMemoryArea.offsetHeight_smart_getter);

// popover
curMemoryArea.popover_getter = function popover() { return this._popover; }; mframe.safefunction(curMemoryArea.popover_getter);
Object.defineProperty(curMemoryArea.popover_getter, "name", {value: "get popover",configurable: true,});
// popover
curMemoryArea.popover_setter = function popover(val) { this._popover = val; }; mframe.safefunction(curMemoryArea.popover_setter);
Object.defineProperty(curMemoryArea.popover_setter, "name", {value: "set popover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "popover", {get: curMemoryArea.popover_getter,set: curMemoryArea.popover_setter,enumerable: true,configurable: true,});
curMemoryArea.popover_smart_getter = function popover() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.popover;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._popover !== undefined ? this._popover : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.popover_smart_getter);
HTMLElement.prototype.__defineGetter__("popover", curMemoryArea.popover_smart_getter);

// innerText
curMemoryArea.innerText_getter = function innerText() { return this._innerText; }; mframe.safefunction(curMemoryArea.innerText_getter);
Object.defineProperty(curMemoryArea.innerText_getter, "name", {value: "get innerText",configurable: true,});
// innerText
curMemoryArea.innerText_setter = function innerText(val) { this._innerText = val; }; mframe.safefunction(curMemoryArea.innerText_setter);
Object.defineProperty(curMemoryArea.innerText_setter, "name", {value: "set innerText",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "innerText", {get: curMemoryArea.innerText_getter,set: curMemoryArea.innerText_setter,enumerable: true,configurable: true,});
curMemoryArea.innerText_smart_getter = function innerText() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.innerText;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._innerText !== undefined ? this._innerText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.innerText_smart_getter);
HTMLElement.prototype.__defineGetter__("innerText", curMemoryArea.innerText_smart_getter);

// outerText
curMemoryArea.outerText_getter = function outerText() { return this._outerText; }; mframe.safefunction(curMemoryArea.outerText_getter);
Object.defineProperty(curMemoryArea.outerText_getter, "name", {value: "get outerText",configurable: true,});
// outerText
curMemoryArea.outerText_setter = function outerText(val) { this._outerText = val; }; mframe.safefunction(curMemoryArea.outerText_setter);
Object.defineProperty(curMemoryArea.outerText_setter, "name", {value: "set outerText",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "outerText", {get: curMemoryArea.outerText_getter,set: curMemoryArea.outerText_setter,enumerable: true,configurable: true,});
curMemoryArea.outerText_smart_getter = function outerText() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.outerText;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._outerText !== undefined ? this._outerText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.outerText_smart_getter);
HTMLElement.prototype.__defineGetter__("outerText", curMemoryArea.outerText_smart_getter);

// writingSuggestions
curMemoryArea.writingSuggestions_getter = function writingSuggestions() { return this._writingSuggestions; }; mframe.safefunction(curMemoryArea.writingSuggestions_getter);
Object.defineProperty(curMemoryArea.writingSuggestions_getter, "name", {value: "get writingSuggestions",configurable: true,});
// writingSuggestions
curMemoryArea.writingSuggestions_setter = function writingSuggestions(val) { this._writingSuggestions = val; }; mframe.safefunction(curMemoryArea.writingSuggestions_setter);
Object.defineProperty(curMemoryArea.writingSuggestions_setter, "name", {value: "set writingSuggestions",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "writingSuggestions", {get: curMemoryArea.writingSuggestions_getter,set: curMemoryArea.writingSuggestions_setter,enumerable: true,configurable: true,});
curMemoryArea.writingSuggestions_smart_getter = function writingSuggestions() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.writingSuggestions;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._writingSuggestions !== undefined ? this._writingSuggestions : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.writingSuggestions_smart_getter);
HTMLElement.prototype.__defineGetter__("writingSuggestions", curMemoryArea.writingSuggestions_smart_getter);

// onbeforexrselect
curMemoryArea.onbeforexrselect_getter = function onbeforexrselect() { return this._onbeforexrselect; }; mframe.safefunction(curMemoryArea.onbeforexrselect_getter);
Object.defineProperty(curMemoryArea.onbeforexrselect_getter, "name", {value: "get onbeforexrselect",configurable: true,});
// onbeforexrselect
curMemoryArea.onbeforexrselect_setter = function onbeforexrselect(val) { this._onbeforexrselect = val; }; mframe.safefunction(curMemoryArea.onbeforexrselect_setter);
Object.defineProperty(curMemoryArea.onbeforexrselect_setter, "name", {value: "set onbeforexrselect",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforexrselect", {get: curMemoryArea.onbeforexrselect_getter,set: curMemoryArea.onbeforexrselect_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforexrselect_smart_getter = function onbeforexrselect() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onbeforexrselect;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforexrselect !== undefined ? this._onbeforexrselect : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforexrselect_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforexrselect", curMemoryArea.onbeforexrselect_smart_getter);

// onabort
curMemoryArea.onabort_getter = function onabort() { return this._onabort; }; mframe.safefunction(curMemoryArea.onabort_getter);
Object.defineProperty(curMemoryArea.onabort_getter, "name", {value: "get onabort",configurable: true,});
// onabort
curMemoryArea.onabort_setter = function onabort(val) { this._onabort = val; }; mframe.safefunction(curMemoryArea.onabort_setter);
Object.defineProperty(curMemoryArea.onabort_setter, "name", {value: "set onabort",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onabort", {get: curMemoryArea.onabort_getter,set: curMemoryArea.onabort_setter,enumerable: true,configurable: true,});
curMemoryArea.onabort_smart_getter = function onabort() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onabort;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onabort !== undefined ? this._onabort : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onabort_smart_getter);
HTMLElement.prototype.__defineGetter__("onabort", curMemoryArea.onabort_smart_getter);

// onbeforeinput
curMemoryArea.onbeforeinput_getter = function onbeforeinput() { return this._onbeforeinput; }; mframe.safefunction(curMemoryArea.onbeforeinput_getter);
Object.defineProperty(curMemoryArea.onbeforeinput_getter, "name", {value: "get onbeforeinput",configurable: true,});
// onbeforeinput
curMemoryArea.onbeforeinput_setter = function onbeforeinput(val) { this._onbeforeinput = val; }; mframe.safefunction(curMemoryArea.onbeforeinput_setter);
Object.defineProperty(curMemoryArea.onbeforeinput_setter, "name", {value: "set onbeforeinput",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforeinput", {get: curMemoryArea.onbeforeinput_getter,set: curMemoryArea.onbeforeinput_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforeinput_smart_getter = function onbeforeinput() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onbeforeinput;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforeinput !== undefined ? this._onbeforeinput : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforeinput_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforeinput", curMemoryArea.onbeforeinput_smart_getter);

// onbeforematch
curMemoryArea.onbeforematch_getter = function onbeforematch() { return this._onbeforematch; }; mframe.safefunction(curMemoryArea.onbeforematch_getter);
Object.defineProperty(curMemoryArea.onbeforematch_getter, "name", {value: "get onbeforematch",configurable: true,});
// onbeforematch
curMemoryArea.onbeforematch_setter = function onbeforematch(val) { this._onbeforematch = val; }; mframe.safefunction(curMemoryArea.onbeforematch_setter);
Object.defineProperty(curMemoryArea.onbeforematch_setter, "name", {value: "set onbeforematch",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforematch", {get: curMemoryArea.onbeforematch_getter,set: curMemoryArea.onbeforematch_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforematch_smart_getter = function onbeforematch() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onbeforematch;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforematch !== undefined ? this._onbeforematch : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforematch_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforematch", curMemoryArea.onbeforematch_smart_getter);

// onbeforetoggle
curMemoryArea.onbeforetoggle_getter = function onbeforetoggle() { return this._onbeforetoggle; }; mframe.safefunction(curMemoryArea.onbeforetoggle_getter);
Object.defineProperty(curMemoryArea.onbeforetoggle_getter, "name", {value: "get onbeforetoggle",configurable: true,});
// onbeforetoggle
curMemoryArea.onbeforetoggle_setter = function onbeforetoggle(val) { this._onbeforetoggle = val; }; mframe.safefunction(curMemoryArea.onbeforetoggle_setter);
Object.defineProperty(curMemoryArea.onbeforetoggle_setter, "name", {value: "set onbeforetoggle",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforetoggle", {get: curMemoryArea.onbeforetoggle_getter,set: curMemoryArea.onbeforetoggle_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforetoggle_smart_getter = function onbeforetoggle() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onbeforetoggle;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforetoggle !== undefined ? this._onbeforetoggle : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforetoggle_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforetoggle", curMemoryArea.onbeforetoggle_smart_getter);

// onblur
curMemoryArea.onblur_getter = function onblur() { return this._onblur; }; mframe.safefunction(curMemoryArea.onblur_getter);
Object.defineProperty(curMemoryArea.onblur_getter, "name", {value: "get onblur",configurable: true,});
// onblur
curMemoryArea.onblur_setter = function onblur(val) { this._onblur = val; }; mframe.safefunction(curMemoryArea.onblur_setter);
Object.defineProperty(curMemoryArea.onblur_setter, "name", {value: "set onblur",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onblur", {get: curMemoryArea.onblur_getter,set: curMemoryArea.onblur_setter,enumerable: true,configurable: true,});
curMemoryArea.onblur_smart_getter = function onblur() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onblur;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onblur !== undefined ? this._onblur : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onblur_smart_getter);
HTMLElement.prototype.__defineGetter__("onblur", curMemoryArea.onblur_smart_getter);

// oncancel
curMemoryArea.oncancel_getter = function oncancel() { return this._oncancel; }; mframe.safefunction(curMemoryArea.oncancel_getter);
Object.defineProperty(curMemoryArea.oncancel_getter, "name", {value: "get oncancel",configurable: true,});
// oncancel
curMemoryArea.oncancel_setter = function oncancel(val) { this._oncancel = val; }; mframe.safefunction(curMemoryArea.oncancel_setter);
Object.defineProperty(curMemoryArea.oncancel_setter, "name", {value: "set oncancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncancel", {get: curMemoryArea.oncancel_getter,set: curMemoryArea.oncancel_setter,enumerable: true,configurable: true,});
curMemoryArea.oncancel_smart_getter = function oncancel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncancel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncancel !== undefined ? this._oncancel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncancel_smart_getter);
HTMLElement.prototype.__defineGetter__("oncancel", curMemoryArea.oncancel_smart_getter);

// oncanplay
curMemoryArea.oncanplay_getter = function oncanplay() { return this._oncanplay; }; mframe.safefunction(curMemoryArea.oncanplay_getter);
Object.defineProperty(curMemoryArea.oncanplay_getter, "name", {value: "get oncanplay",configurable: true,});
// oncanplay
curMemoryArea.oncanplay_setter = function oncanplay(val) { this._oncanplay = val; }; mframe.safefunction(curMemoryArea.oncanplay_setter);
Object.defineProperty(curMemoryArea.oncanplay_setter, "name", {value: "set oncanplay",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncanplay", {get: curMemoryArea.oncanplay_getter,set: curMemoryArea.oncanplay_setter,enumerable: true,configurable: true,});
curMemoryArea.oncanplay_smart_getter = function oncanplay() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncanplay;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncanplay !== undefined ? this._oncanplay : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncanplay_smart_getter);
HTMLElement.prototype.__defineGetter__("oncanplay", curMemoryArea.oncanplay_smart_getter);

// oncanplaythrough
curMemoryArea.oncanplaythrough_getter = function oncanplaythrough() { return this._oncanplaythrough; }; mframe.safefunction(curMemoryArea.oncanplaythrough_getter);
Object.defineProperty(curMemoryArea.oncanplaythrough_getter, "name", {value: "get oncanplaythrough",configurable: true,});
// oncanplaythrough
curMemoryArea.oncanplaythrough_setter = function oncanplaythrough(val) { this._oncanplaythrough = val; }; mframe.safefunction(curMemoryArea.oncanplaythrough_setter);
Object.defineProperty(curMemoryArea.oncanplaythrough_setter, "name", {value: "set oncanplaythrough",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncanplaythrough", {get: curMemoryArea.oncanplaythrough_getter,set: curMemoryArea.oncanplaythrough_setter,enumerable: true,configurable: true,});
curMemoryArea.oncanplaythrough_smart_getter = function oncanplaythrough() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncanplaythrough;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncanplaythrough !== undefined ? this._oncanplaythrough : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncanplaythrough_smart_getter);
HTMLElement.prototype.__defineGetter__("oncanplaythrough", curMemoryArea.oncanplaythrough_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { return this._onchange; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", {value: "get onchange",configurable: true,});
// onchange
curMemoryArea.onchange_setter = function onchange(val) { this._onchange = val; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", {value: "set onchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onchange", {get: curMemoryArea.onchange_getter,set: curMemoryArea.onchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onchange_smart_getter = function onchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onchange !== undefined ? this._onchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// onclick
curMemoryArea.onclick_getter = function onclick() { return this._onclick; }; mframe.safefunction(curMemoryArea.onclick_getter);
Object.defineProperty(curMemoryArea.onclick_getter, "name", {value: "get onclick",configurable: true,});
// onclick
curMemoryArea.onclick_setter = function onclick(val) { this._onclick = val; }; mframe.safefunction(curMemoryArea.onclick_setter);
Object.defineProperty(curMemoryArea.onclick_setter, "name", {value: "set onclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onclick", {get: curMemoryArea.onclick_getter,set: curMemoryArea.onclick_setter,enumerable: true,configurable: true,});
curMemoryArea.onclick_smart_getter = function onclick() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onclick;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onclick !== undefined ? this._onclick : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onclick_smart_getter);
HTMLElement.prototype.__defineGetter__("onclick", curMemoryArea.onclick_smart_getter);

// onclose
curMemoryArea.onclose_getter = function onclose() { return this._onclose; }; mframe.safefunction(curMemoryArea.onclose_getter);
Object.defineProperty(curMemoryArea.onclose_getter, "name", {value: "get onclose",configurable: true,});
// onclose
curMemoryArea.onclose_setter = function onclose(val) { this._onclose = val; }; mframe.safefunction(curMemoryArea.onclose_setter);
Object.defineProperty(curMemoryArea.onclose_setter, "name", {value: "set onclose",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onclose", {get: curMemoryArea.onclose_getter,set: curMemoryArea.onclose_setter,enumerable: true,configurable: true,});
curMemoryArea.onclose_smart_getter = function onclose() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onclose;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onclose !== undefined ? this._onclose : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onclose_smart_getter);
HTMLElement.prototype.__defineGetter__("onclose", curMemoryArea.onclose_smart_getter);

// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_getter = function oncontentvisibilityautostatechange() { return this._oncontentvisibilityautostatechange; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_getter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_getter, "name", {value: "get oncontentvisibilityautostatechange",configurable: true,});
// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_setter = function oncontentvisibilityautostatechange(val) { this._oncontentvisibilityautostatechange = val; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_setter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_setter, "name", {value: "set oncontentvisibilityautostatechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontentvisibilityautostatechange", {get: curMemoryArea.oncontentvisibilityautostatechange_getter,set: curMemoryArea.oncontentvisibilityautostatechange_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontentvisibilityautostatechange_smart_getter = function oncontentvisibilityautostatechange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncontentvisibilityautostatechange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncontentvisibilityautostatechange !== undefined ? this._oncontentvisibilityautostatechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontentvisibilityautostatechange", curMemoryArea.oncontentvisibilityautostatechange_smart_getter);

// oncontextlost
curMemoryArea.oncontextlost_getter = function oncontextlost() { return this._oncontextlost; }; mframe.safefunction(curMemoryArea.oncontextlost_getter);
Object.defineProperty(curMemoryArea.oncontextlost_getter, "name", {value: "get oncontextlost",configurable: true,});
// oncontextlost
curMemoryArea.oncontextlost_setter = function oncontextlost(val) { this._oncontextlost = val; }; mframe.safefunction(curMemoryArea.oncontextlost_setter);
Object.defineProperty(curMemoryArea.oncontextlost_setter, "name", {value: "set oncontextlost",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextlost", {get: curMemoryArea.oncontextlost_getter,set: curMemoryArea.oncontextlost_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextlost_smart_getter = function oncontextlost() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncontextlost;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncontextlost !== undefined ? this._oncontextlost : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncontextlost_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextlost", curMemoryArea.oncontextlost_smart_getter);

// oncontextmenu
curMemoryArea.oncontextmenu_getter = function oncontextmenu() { return this._oncontextmenu; }; mframe.safefunction(curMemoryArea.oncontextmenu_getter);
Object.defineProperty(curMemoryArea.oncontextmenu_getter, "name", {value: "get oncontextmenu",configurable: true,});
// oncontextmenu
curMemoryArea.oncontextmenu_setter = function oncontextmenu(val) { this._oncontextmenu = val; }; mframe.safefunction(curMemoryArea.oncontextmenu_setter);
Object.defineProperty(curMemoryArea.oncontextmenu_setter, "name", {value: "set oncontextmenu",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextmenu", {get: curMemoryArea.oncontextmenu_getter,set: curMemoryArea.oncontextmenu_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextmenu_smart_getter = function oncontextmenu() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncontextmenu;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncontextmenu !== undefined ? this._oncontextmenu : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncontextmenu_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextmenu", curMemoryArea.oncontextmenu_smart_getter);

// oncontextrestored
curMemoryArea.oncontextrestored_getter = function oncontextrestored() { return this._oncontextrestored; }; mframe.safefunction(curMemoryArea.oncontextrestored_getter);
Object.defineProperty(curMemoryArea.oncontextrestored_getter, "name", {value: "get oncontextrestored",configurable: true,});
// oncontextrestored
curMemoryArea.oncontextrestored_setter = function oncontextrestored(val) { this._oncontextrestored = val; }; mframe.safefunction(curMemoryArea.oncontextrestored_setter);
Object.defineProperty(curMemoryArea.oncontextrestored_setter, "name", {value: "set oncontextrestored",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextrestored", {get: curMemoryArea.oncontextrestored_getter,set: curMemoryArea.oncontextrestored_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextrestored_smart_getter = function oncontextrestored() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncontextrestored;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncontextrestored !== undefined ? this._oncontextrestored : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncontextrestored_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextrestored", curMemoryArea.oncontextrestored_smart_getter);

// oncuechange
curMemoryArea.oncuechange_getter = function oncuechange() { return this._oncuechange; }; mframe.safefunction(curMemoryArea.oncuechange_getter);
Object.defineProperty(curMemoryArea.oncuechange_getter, "name", {value: "get oncuechange",configurable: true,});
// oncuechange
curMemoryArea.oncuechange_setter = function oncuechange(val) { this._oncuechange = val; }; mframe.safefunction(curMemoryArea.oncuechange_setter);
Object.defineProperty(curMemoryArea.oncuechange_setter, "name", {value: "set oncuechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncuechange", {get: curMemoryArea.oncuechange_getter,set: curMemoryArea.oncuechange_setter,enumerable: true,configurable: true,});
curMemoryArea.oncuechange_smart_getter = function oncuechange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncuechange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncuechange !== undefined ? this._oncuechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncuechange_smart_getter);
HTMLElement.prototype.__defineGetter__("oncuechange", curMemoryArea.oncuechange_smart_getter);

// ondblclick
curMemoryArea.ondblclick_getter = function ondblclick() { return this._ondblclick; }; mframe.safefunction(curMemoryArea.ondblclick_getter);
Object.defineProperty(curMemoryArea.ondblclick_getter, "name", {value: "get ondblclick",configurable: true,});
// ondblclick
curMemoryArea.ondblclick_setter = function ondblclick(val) { this._ondblclick = val; }; mframe.safefunction(curMemoryArea.ondblclick_setter);
Object.defineProperty(curMemoryArea.ondblclick_setter, "name", {value: "set ondblclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondblclick", {get: curMemoryArea.ondblclick_getter,set: curMemoryArea.ondblclick_setter,enumerable: true,configurable: true,});
curMemoryArea.ondblclick_smart_getter = function ondblclick() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondblclick;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondblclick !== undefined ? this._ondblclick : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondblclick_smart_getter);
HTMLElement.prototype.__defineGetter__("ondblclick", curMemoryArea.ondblclick_smart_getter);

// ondrag
curMemoryArea.ondrag_getter = function ondrag() { return this._ondrag; }; mframe.safefunction(curMemoryArea.ondrag_getter);
Object.defineProperty(curMemoryArea.ondrag_getter, "name", {value: "get ondrag",configurable: true,});
// ondrag
curMemoryArea.ondrag_setter = function ondrag(val) { this._ondrag = val; }; mframe.safefunction(curMemoryArea.ondrag_setter);
Object.defineProperty(curMemoryArea.ondrag_setter, "name", {value: "set ondrag",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondrag", {get: curMemoryArea.ondrag_getter,set: curMemoryArea.ondrag_setter,enumerable: true,configurable: true,});
curMemoryArea.ondrag_smart_getter = function ondrag() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondrag;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondrag !== undefined ? this._ondrag : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondrag_smart_getter);
HTMLElement.prototype.__defineGetter__("ondrag", curMemoryArea.ondrag_smart_getter);

// ondragend
curMemoryArea.ondragend_getter = function ondragend() { return this._ondragend; }; mframe.safefunction(curMemoryArea.ondragend_getter);
Object.defineProperty(curMemoryArea.ondragend_getter, "name", {value: "get ondragend",configurable: true,});
// ondragend
curMemoryArea.ondragend_setter = function ondragend(val) { this._ondragend = val; }; mframe.safefunction(curMemoryArea.ondragend_setter);
Object.defineProperty(curMemoryArea.ondragend_setter, "name", {value: "set ondragend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragend", {get: curMemoryArea.ondragend_getter,set: curMemoryArea.ondragend_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragend_smart_getter = function ondragend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragend !== undefined ? this._ondragend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragend_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragend", curMemoryArea.ondragend_smart_getter);

// ondragenter
curMemoryArea.ondragenter_getter = function ondragenter() { return this._ondragenter; }; mframe.safefunction(curMemoryArea.ondragenter_getter);
Object.defineProperty(curMemoryArea.ondragenter_getter, "name", {value: "get ondragenter",configurable: true,});
// ondragenter
curMemoryArea.ondragenter_setter = function ondragenter(val) { this._ondragenter = val; }; mframe.safefunction(curMemoryArea.ondragenter_setter);
Object.defineProperty(curMemoryArea.ondragenter_setter, "name", {value: "set ondragenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragenter", {get: curMemoryArea.ondragenter_getter,set: curMemoryArea.ondragenter_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragenter_smart_getter = function ondragenter() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragenter;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragenter !== undefined ? this._ondragenter : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragenter_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragenter", curMemoryArea.ondragenter_smart_getter);

// ondragleave
curMemoryArea.ondragleave_getter = function ondragleave() { return this._ondragleave; }; mframe.safefunction(curMemoryArea.ondragleave_getter);
Object.defineProperty(curMemoryArea.ondragleave_getter, "name", {value: "get ondragleave",configurable: true,});
// ondragleave
curMemoryArea.ondragleave_setter = function ondragleave(val) { this._ondragleave = val; }; mframe.safefunction(curMemoryArea.ondragleave_setter);
Object.defineProperty(curMemoryArea.ondragleave_setter, "name", {value: "set ondragleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragleave", {get: curMemoryArea.ondragleave_getter,set: curMemoryArea.ondragleave_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragleave_smart_getter = function ondragleave() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragleave;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragleave !== undefined ? this._ondragleave : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragleave_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragleave", curMemoryArea.ondragleave_smart_getter);

// ondragover
curMemoryArea.ondragover_getter = function ondragover() { return this._ondragover; }; mframe.safefunction(curMemoryArea.ondragover_getter);
Object.defineProperty(curMemoryArea.ondragover_getter, "name", {value: "get ondragover",configurable: true,});
// ondragover
curMemoryArea.ondragover_setter = function ondragover(val) { this._ondragover = val; }; mframe.safefunction(curMemoryArea.ondragover_setter);
Object.defineProperty(curMemoryArea.ondragover_setter, "name", {value: "set ondragover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragover", {get: curMemoryArea.ondragover_getter,set: curMemoryArea.ondragover_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragover_smart_getter = function ondragover() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragover;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragover !== undefined ? this._ondragover : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragover_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragover", curMemoryArea.ondragover_smart_getter);

// ondragstart
curMemoryArea.ondragstart_getter = function ondragstart() { return this._ondragstart; }; mframe.safefunction(curMemoryArea.ondragstart_getter);
Object.defineProperty(curMemoryArea.ondragstart_getter, "name", {value: "get ondragstart",configurable: true,});
// ondragstart
curMemoryArea.ondragstart_setter = function ondragstart(val) { this._ondragstart = val; }; mframe.safefunction(curMemoryArea.ondragstart_setter);
Object.defineProperty(curMemoryArea.ondragstart_setter, "name", {value: "set ondragstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragstart", {get: curMemoryArea.ondragstart_getter,set: curMemoryArea.ondragstart_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragstart_smart_getter = function ondragstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragstart !== undefined ? this._ondragstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragstart_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragstart", curMemoryArea.ondragstart_smart_getter);

// ondrop
curMemoryArea.ondrop_getter = function ondrop() { return this._ondrop; }; mframe.safefunction(curMemoryArea.ondrop_getter);
Object.defineProperty(curMemoryArea.ondrop_getter, "name", {value: "get ondrop",configurable: true,});
// ondrop
curMemoryArea.ondrop_setter = function ondrop(val) { this._ondrop = val; }; mframe.safefunction(curMemoryArea.ondrop_setter);
Object.defineProperty(curMemoryArea.ondrop_setter, "name", {value: "set ondrop",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondrop", {get: curMemoryArea.ondrop_getter,set: curMemoryArea.ondrop_setter,enumerable: true,configurable: true,});
curMemoryArea.ondrop_smart_getter = function ondrop() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondrop;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondrop !== undefined ? this._ondrop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondrop_smart_getter);
HTMLElement.prototype.__defineGetter__("ondrop", curMemoryArea.ondrop_smart_getter);

// ondurationchange
curMemoryArea.ondurationchange_getter = function ondurationchange() { return this._ondurationchange; }; mframe.safefunction(curMemoryArea.ondurationchange_getter);
Object.defineProperty(curMemoryArea.ondurationchange_getter, "name", {value: "get ondurationchange",configurable: true,});
// ondurationchange
curMemoryArea.ondurationchange_setter = function ondurationchange(val) { this._ondurationchange = val; }; mframe.safefunction(curMemoryArea.ondurationchange_setter);
Object.defineProperty(curMemoryArea.ondurationchange_setter, "name", {value: "set ondurationchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondurationchange", {get: curMemoryArea.ondurationchange_getter,set: curMemoryArea.ondurationchange_setter,enumerable: true,configurable: true,});
curMemoryArea.ondurationchange_smart_getter = function ondurationchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondurationchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondurationchange !== undefined ? this._ondurationchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondurationchange_smart_getter);
HTMLElement.prototype.__defineGetter__("ondurationchange", curMemoryArea.ondurationchange_smart_getter);

// onemptied
curMemoryArea.onemptied_getter = function onemptied() { return this._onemptied; }; mframe.safefunction(curMemoryArea.onemptied_getter);
Object.defineProperty(curMemoryArea.onemptied_getter, "name", {value: "get onemptied",configurable: true,});
// onemptied
curMemoryArea.onemptied_setter = function onemptied(val) { this._onemptied = val; }; mframe.safefunction(curMemoryArea.onemptied_setter);
Object.defineProperty(curMemoryArea.onemptied_setter, "name", {value: "set onemptied",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onemptied", {get: curMemoryArea.onemptied_getter,set: curMemoryArea.onemptied_setter,enumerable: true,configurable: true,});
curMemoryArea.onemptied_smart_getter = function onemptied() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onemptied;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onemptied !== undefined ? this._onemptied : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onemptied_smart_getter);
HTMLElement.prototype.__defineGetter__("onemptied", curMemoryArea.onemptied_smart_getter);

// onended
curMemoryArea.onended_getter = function onended() { return this._onended; }; mframe.safefunction(curMemoryArea.onended_getter);
Object.defineProperty(curMemoryArea.onended_getter, "name", {value: "get onended",configurable: true,});
// onended
curMemoryArea.onended_setter = function onended(val) { this._onended = val; }; mframe.safefunction(curMemoryArea.onended_setter);
Object.defineProperty(curMemoryArea.onended_setter, "name", {value: "set onended",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onended", {get: curMemoryArea.onended_getter,set: curMemoryArea.onended_setter,enumerable: true,configurable: true,});
curMemoryArea.onended_smart_getter = function onended() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onended;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onended !== undefined ? this._onended : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onended_smart_getter);
HTMLElement.prototype.__defineGetter__("onended", curMemoryArea.onended_smart_getter);

// onerror
curMemoryArea.onerror_getter = function onerror() { return this._onerror; }; mframe.safefunction(curMemoryArea.onerror_getter);
Object.defineProperty(curMemoryArea.onerror_getter, "name", {value: "get onerror",configurable: true,});
// onerror
curMemoryArea.onerror_setter = function onerror(val) { this._onerror = val; }; mframe.safefunction(curMemoryArea.onerror_setter);
Object.defineProperty(curMemoryArea.onerror_setter, "name", {value: "set onerror",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onerror", {get: curMemoryArea.onerror_getter,set: curMemoryArea.onerror_setter,enumerable: true,configurable: true,});
curMemoryArea.onerror_smart_getter = function onerror() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onerror;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onerror !== undefined ? this._onerror : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onerror_smart_getter);
HTMLElement.prototype.__defineGetter__("onerror", curMemoryArea.onerror_smart_getter);

// onfocus
curMemoryArea.onfocus_getter = function onfocus() { return this._onfocus; }; mframe.safefunction(curMemoryArea.onfocus_getter);
Object.defineProperty(curMemoryArea.onfocus_getter, "name", {value: "get onfocus",configurable: true,});
// onfocus
curMemoryArea.onfocus_setter = function onfocus(val) { this._onfocus = val; }; mframe.safefunction(curMemoryArea.onfocus_setter);
Object.defineProperty(curMemoryArea.onfocus_setter, "name", {value: "set onfocus",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onfocus", {get: curMemoryArea.onfocus_getter,set: curMemoryArea.onfocus_setter,enumerable: true,configurable: true,});
curMemoryArea.onfocus_smart_getter = function onfocus() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onfocus;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onfocus !== undefined ? this._onfocus : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onfocus_smart_getter);
HTMLElement.prototype.__defineGetter__("onfocus", curMemoryArea.onfocus_smart_getter);

// onformdata
curMemoryArea.onformdata_getter = function onformdata() { return this._onformdata; }; mframe.safefunction(curMemoryArea.onformdata_getter);
Object.defineProperty(curMemoryArea.onformdata_getter, "name", {value: "get onformdata",configurable: true,});
// onformdata
curMemoryArea.onformdata_setter = function onformdata(val) { this._onformdata = val; }; mframe.safefunction(curMemoryArea.onformdata_setter);
Object.defineProperty(curMemoryArea.onformdata_setter, "name", {value: "set onformdata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onformdata", {get: curMemoryArea.onformdata_getter,set: curMemoryArea.onformdata_setter,enumerable: true,configurable: true,});
curMemoryArea.onformdata_smart_getter = function onformdata() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onformdata;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onformdata !== undefined ? this._onformdata : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onformdata_smart_getter);
HTMLElement.prototype.__defineGetter__("onformdata", curMemoryArea.onformdata_smart_getter);

// oninput
curMemoryArea.oninput_getter = function oninput() { return this._oninput; }; mframe.safefunction(curMemoryArea.oninput_getter);
Object.defineProperty(curMemoryArea.oninput_getter, "name", {value: "get oninput",configurable: true,});
// oninput
curMemoryArea.oninput_setter = function oninput(val) { this._oninput = val; }; mframe.safefunction(curMemoryArea.oninput_setter);
Object.defineProperty(curMemoryArea.oninput_setter, "name", {value: "set oninput",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oninput", {get: curMemoryArea.oninput_getter,set: curMemoryArea.oninput_setter,enumerable: true,configurable: true,});
curMemoryArea.oninput_smart_getter = function oninput() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oninput;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oninput !== undefined ? this._oninput : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oninput_smart_getter);
HTMLElement.prototype.__defineGetter__("oninput", curMemoryArea.oninput_smart_getter);

// oninvalid
curMemoryArea.oninvalid_getter = function oninvalid() { return this._oninvalid; }; mframe.safefunction(curMemoryArea.oninvalid_getter);
Object.defineProperty(curMemoryArea.oninvalid_getter, "name", {value: "get oninvalid",configurable: true,});
// oninvalid
curMemoryArea.oninvalid_setter = function oninvalid(val) { this._oninvalid = val; }; mframe.safefunction(curMemoryArea.oninvalid_setter);
Object.defineProperty(curMemoryArea.oninvalid_setter, "name", {value: "set oninvalid",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oninvalid", {get: curMemoryArea.oninvalid_getter,set: curMemoryArea.oninvalid_setter,enumerable: true,configurable: true,});
curMemoryArea.oninvalid_smart_getter = function oninvalid() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oninvalid;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oninvalid !== undefined ? this._oninvalid : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oninvalid_smart_getter);
HTMLElement.prototype.__defineGetter__("oninvalid", curMemoryArea.oninvalid_smart_getter);

// onkeydown
curMemoryArea.onkeydown_getter = function onkeydown() { return this._onkeydown; }; mframe.safefunction(curMemoryArea.onkeydown_getter);
Object.defineProperty(curMemoryArea.onkeydown_getter, "name", {value: "get onkeydown",configurable: true,});
// onkeydown
curMemoryArea.onkeydown_setter = function onkeydown(val) { this._onkeydown = val; }; mframe.safefunction(curMemoryArea.onkeydown_setter);
Object.defineProperty(curMemoryArea.onkeydown_setter, "name", {value: "set onkeydown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeydown", {get: curMemoryArea.onkeydown_getter,set: curMemoryArea.onkeydown_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeydown_smart_getter = function onkeydown() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onkeydown;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onkeydown !== undefined ? this._onkeydown : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onkeydown_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeydown", curMemoryArea.onkeydown_smart_getter);

// onkeypress
curMemoryArea.onkeypress_getter = function onkeypress() { return this._onkeypress; }; mframe.safefunction(curMemoryArea.onkeypress_getter);
Object.defineProperty(curMemoryArea.onkeypress_getter, "name", {value: "get onkeypress",configurable: true,});
// onkeypress
curMemoryArea.onkeypress_setter = function onkeypress(val) { this._onkeypress = val; }; mframe.safefunction(curMemoryArea.onkeypress_setter);
Object.defineProperty(curMemoryArea.onkeypress_setter, "name", {value: "set onkeypress",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeypress", {get: curMemoryArea.onkeypress_getter,set: curMemoryArea.onkeypress_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeypress_smart_getter = function onkeypress() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onkeypress;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onkeypress !== undefined ? this._onkeypress : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onkeypress_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeypress", curMemoryArea.onkeypress_smart_getter);

// onkeyup
curMemoryArea.onkeyup_getter = function onkeyup() { return this._onkeyup; }; mframe.safefunction(curMemoryArea.onkeyup_getter);
Object.defineProperty(curMemoryArea.onkeyup_getter, "name", {value: "get onkeyup",configurable: true,});
// onkeyup
curMemoryArea.onkeyup_setter = function onkeyup(val) { this._onkeyup = val; }; mframe.safefunction(curMemoryArea.onkeyup_setter);
Object.defineProperty(curMemoryArea.onkeyup_setter, "name", {value: "set onkeyup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeyup", {get: curMemoryArea.onkeyup_getter,set: curMemoryArea.onkeyup_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeyup_smart_getter = function onkeyup() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onkeyup;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onkeyup !== undefined ? this._onkeyup : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onkeyup_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeyup", curMemoryArea.onkeyup_smart_getter);

// onload
curMemoryArea.onload_getter = function onload() { return this._onload; }; mframe.safefunction(curMemoryArea.onload_getter);
Object.defineProperty(curMemoryArea.onload_getter, "name", {value: "get onload",configurable: true,});
// onload
curMemoryArea.onload_setter = function onload(val) { this._onload = val; }; mframe.safefunction(curMemoryArea.onload_setter);
Object.defineProperty(curMemoryArea.onload_setter, "name", {value: "set onload",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onload", {get: curMemoryArea.onload_getter,set: curMemoryArea.onload_setter,enumerable: true,configurable: true,});
curMemoryArea.onload_smart_getter = function onload() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onload;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onload !== undefined ? this._onload : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onload_smart_getter);
HTMLElement.prototype.__defineGetter__("onload", curMemoryArea.onload_smart_getter);

// onloadeddata
curMemoryArea.onloadeddata_getter = function onloadeddata() { return this._onloadeddata; }; mframe.safefunction(curMemoryArea.onloadeddata_getter);
Object.defineProperty(curMemoryArea.onloadeddata_getter, "name", {value: "get onloadeddata",configurable: true,});
// onloadeddata
curMemoryArea.onloadeddata_setter = function onloadeddata(val) { this._onloadeddata = val; }; mframe.safefunction(curMemoryArea.onloadeddata_setter);
Object.defineProperty(curMemoryArea.onloadeddata_setter, "name", {value: "set onloadeddata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadeddata", {get: curMemoryArea.onloadeddata_getter,set: curMemoryArea.onloadeddata_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadeddata_smart_getter = function onloadeddata() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onloadeddata;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onloadeddata !== undefined ? this._onloadeddata : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onloadeddata_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadeddata", curMemoryArea.onloadeddata_smart_getter);

// onloadedmetadata
curMemoryArea.onloadedmetadata_getter = function onloadedmetadata() { return this._onloadedmetadata; }; mframe.safefunction(curMemoryArea.onloadedmetadata_getter);
Object.defineProperty(curMemoryArea.onloadedmetadata_getter, "name", {value: "get onloadedmetadata",configurable: true,});
// onloadedmetadata
curMemoryArea.onloadedmetadata_setter = function onloadedmetadata(val) { this._onloadedmetadata = val; }; mframe.safefunction(curMemoryArea.onloadedmetadata_setter);
Object.defineProperty(curMemoryArea.onloadedmetadata_setter, "name", {value: "set onloadedmetadata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadedmetadata", {get: curMemoryArea.onloadedmetadata_getter,set: curMemoryArea.onloadedmetadata_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadedmetadata_smart_getter = function onloadedmetadata() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onloadedmetadata;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onloadedmetadata !== undefined ? this._onloadedmetadata : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onloadedmetadata_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadedmetadata", curMemoryArea.onloadedmetadata_smart_getter);

// onloadstart
curMemoryArea.onloadstart_getter = function onloadstart() { return this._onloadstart; }; mframe.safefunction(curMemoryArea.onloadstart_getter);
Object.defineProperty(curMemoryArea.onloadstart_getter, "name", {value: "get onloadstart",configurable: true,});
// onloadstart
curMemoryArea.onloadstart_setter = function onloadstart(val) { this._onloadstart = val; }; mframe.safefunction(curMemoryArea.onloadstart_setter);
Object.defineProperty(curMemoryArea.onloadstart_setter, "name", {value: "set onloadstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadstart", {get: curMemoryArea.onloadstart_getter,set: curMemoryArea.onloadstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadstart_smart_getter = function onloadstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onloadstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onloadstart !== undefined ? this._onloadstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onloadstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadstart", curMemoryArea.onloadstart_smart_getter);

// onmousedown
curMemoryArea.onmousedown_getter = function onmousedown() { return this._onmousedown; }; mframe.safefunction(curMemoryArea.onmousedown_getter);
Object.defineProperty(curMemoryArea.onmousedown_getter, "name", {value: "get onmousedown",configurable: true,});
// onmousedown
curMemoryArea.onmousedown_setter = function onmousedown(val) { this._onmousedown = val; }; mframe.safefunction(curMemoryArea.onmousedown_setter);
Object.defineProperty(curMemoryArea.onmousedown_setter, "name", {value: "set onmousedown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousedown", {get: curMemoryArea.onmousedown_getter,set: curMemoryArea.onmousedown_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousedown_smart_getter = function onmousedown() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmousedown;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmousedown !== undefined ? this._onmousedown : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmousedown_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousedown", curMemoryArea.onmousedown_smart_getter);

// onmouseenter
curMemoryArea.onmouseenter_getter = function onmouseenter() { return this._onmouseenter; }; mframe.safefunction(curMemoryArea.onmouseenter_getter);
Object.defineProperty(curMemoryArea.onmouseenter_getter, "name", {value: "get onmouseenter",configurable: true,});
// onmouseenter
curMemoryArea.onmouseenter_setter = function onmouseenter(val) { this._onmouseenter = val; }; mframe.safefunction(curMemoryArea.onmouseenter_setter);
Object.defineProperty(curMemoryArea.onmouseenter_setter, "name", {value: "set onmouseenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseenter", {get: curMemoryArea.onmouseenter_getter,set: curMemoryArea.onmouseenter_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseenter_smart_getter = function onmouseenter() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseenter;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseenter !== undefined ? this._onmouseenter : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseenter_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseenter", curMemoryArea.onmouseenter_smart_getter);

// onmouseleave
curMemoryArea.onmouseleave_getter = function onmouseleave() { return this._onmouseleave; }; mframe.safefunction(curMemoryArea.onmouseleave_getter);
Object.defineProperty(curMemoryArea.onmouseleave_getter, "name", {value: "get onmouseleave",configurable: true,});
// onmouseleave
curMemoryArea.onmouseleave_setter = function onmouseleave(val) { this._onmouseleave = val; }; mframe.safefunction(curMemoryArea.onmouseleave_setter);
Object.defineProperty(curMemoryArea.onmouseleave_setter, "name", {value: "set onmouseleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseleave", {get: curMemoryArea.onmouseleave_getter,set: curMemoryArea.onmouseleave_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseleave_smart_getter = function onmouseleave() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseleave;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseleave !== undefined ? this._onmouseleave : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseleave_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseleave", curMemoryArea.onmouseleave_smart_getter);

// onmousemove
curMemoryArea.onmousemove_getter = function onmousemove() { return this._onmousemove; }; mframe.safefunction(curMemoryArea.onmousemove_getter);
Object.defineProperty(curMemoryArea.onmousemove_getter, "name", {value: "get onmousemove",configurable: true,});
// onmousemove
curMemoryArea.onmousemove_setter = function onmousemove(val) { this._onmousemove = val; }; mframe.safefunction(curMemoryArea.onmousemove_setter);
Object.defineProperty(curMemoryArea.onmousemove_setter, "name", {value: "set onmousemove",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousemove", {get: curMemoryArea.onmousemove_getter,set: curMemoryArea.onmousemove_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousemove_smart_getter = function onmousemove() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmousemove;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmousemove !== undefined ? this._onmousemove : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmousemove_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousemove", curMemoryArea.onmousemove_smart_getter);

// onmouseout
curMemoryArea.onmouseout_getter = function onmouseout() { return this._onmouseout; }; mframe.safefunction(curMemoryArea.onmouseout_getter);
Object.defineProperty(curMemoryArea.onmouseout_getter, "name", {value: "get onmouseout",configurable: true,});
// onmouseout
curMemoryArea.onmouseout_setter = function onmouseout(val) { this._onmouseout = val; }; mframe.safefunction(curMemoryArea.onmouseout_setter);
Object.defineProperty(curMemoryArea.onmouseout_setter, "name", {value: "set onmouseout",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseout", {get: curMemoryArea.onmouseout_getter,set: curMemoryArea.onmouseout_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseout_smart_getter = function onmouseout() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseout;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseout !== undefined ? this._onmouseout : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseout_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseout", curMemoryArea.onmouseout_smart_getter);

// onmouseover
curMemoryArea.onmouseover_getter = function onmouseover() { return this._onmouseover; }; mframe.safefunction(curMemoryArea.onmouseover_getter);
Object.defineProperty(curMemoryArea.onmouseover_getter, "name", {value: "get onmouseover",configurable: true,});
// onmouseover
curMemoryArea.onmouseover_setter = function onmouseover(val) { this._onmouseover = val; }; mframe.safefunction(curMemoryArea.onmouseover_setter);
Object.defineProperty(curMemoryArea.onmouseover_setter, "name", {value: "set onmouseover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseover", {get: curMemoryArea.onmouseover_getter,set: curMemoryArea.onmouseover_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseover_smart_getter = function onmouseover() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseover;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseover !== undefined ? this._onmouseover : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseover_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseover", curMemoryArea.onmouseover_smart_getter);

// onmouseup
curMemoryArea.onmouseup_getter = function onmouseup() { return this._onmouseup; }; mframe.safefunction(curMemoryArea.onmouseup_getter);
Object.defineProperty(curMemoryArea.onmouseup_getter, "name", {value: "get onmouseup",configurable: true,});
// onmouseup
curMemoryArea.onmouseup_setter = function onmouseup(val) { this._onmouseup = val; }; mframe.safefunction(curMemoryArea.onmouseup_setter);
Object.defineProperty(curMemoryArea.onmouseup_setter, "name", {value: "set onmouseup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseup", {get: curMemoryArea.onmouseup_getter,set: curMemoryArea.onmouseup_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseup_smart_getter = function onmouseup() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseup;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseup !== undefined ? this._onmouseup : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseup_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseup", curMemoryArea.onmouseup_smart_getter);

// onmousewheel
curMemoryArea.onmousewheel_getter = function onmousewheel() { return this._onmousewheel; }; mframe.safefunction(curMemoryArea.onmousewheel_getter);
Object.defineProperty(curMemoryArea.onmousewheel_getter, "name", {value: "get onmousewheel",configurable: true,});
// onmousewheel
curMemoryArea.onmousewheel_setter = function onmousewheel(val) { this._onmousewheel = val; }; mframe.safefunction(curMemoryArea.onmousewheel_setter);
Object.defineProperty(curMemoryArea.onmousewheel_setter, "name", {value: "set onmousewheel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousewheel", {get: curMemoryArea.onmousewheel_getter,set: curMemoryArea.onmousewheel_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousewheel_smart_getter = function onmousewheel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmousewheel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmousewheel !== undefined ? this._onmousewheel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmousewheel_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousewheel", curMemoryArea.onmousewheel_smart_getter);

// onpause
curMemoryArea.onpause_getter = function onpause() { return this._onpause; }; mframe.safefunction(curMemoryArea.onpause_getter);
Object.defineProperty(curMemoryArea.onpause_getter, "name", {value: "get onpause",configurable: true,});
// onpause
curMemoryArea.onpause_setter = function onpause(val) { this._onpause = val; }; mframe.safefunction(curMemoryArea.onpause_setter);
Object.defineProperty(curMemoryArea.onpause_setter, "name", {value: "set onpause",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpause", {get: curMemoryArea.onpause_getter,set: curMemoryArea.onpause_setter,enumerable: true,configurable: true,});
curMemoryArea.onpause_smart_getter = function onpause() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpause;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpause !== undefined ? this._onpause : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpause_smart_getter);
HTMLElement.prototype.__defineGetter__("onpause", curMemoryArea.onpause_smart_getter);

// onplay
curMemoryArea.onplay_getter = function onplay() { return this._onplay; }; mframe.safefunction(curMemoryArea.onplay_getter);
Object.defineProperty(curMemoryArea.onplay_getter, "name", {value: "get onplay",configurable: true,});
// onplay
curMemoryArea.onplay_setter = function onplay(val) { this._onplay = val; }; mframe.safefunction(curMemoryArea.onplay_setter);
Object.defineProperty(curMemoryArea.onplay_setter, "name", {value: "set onplay",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onplay", {get: curMemoryArea.onplay_getter,set: curMemoryArea.onplay_setter,enumerable: true,configurable: true,});
curMemoryArea.onplay_smart_getter = function onplay() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onplay;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onplay !== undefined ? this._onplay : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onplay_smart_getter);
HTMLElement.prototype.__defineGetter__("onplay", curMemoryArea.onplay_smart_getter);

// onplaying
curMemoryArea.onplaying_getter = function onplaying() { return this._onplaying; }; mframe.safefunction(curMemoryArea.onplaying_getter);
Object.defineProperty(curMemoryArea.onplaying_getter, "name", {value: "get onplaying",configurable: true,});
// onplaying
curMemoryArea.onplaying_setter = function onplaying(val) { this._onplaying = val; }; mframe.safefunction(curMemoryArea.onplaying_setter);
Object.defineProperty(curMemoryArea.onplaying_setter, "name", {value: "set onplaying",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onplaying", {get: curMemoryArea.onplaying_getter,set: curMemoryArea.onplaying_setter,enumerable: true,configurable: true,});
curMemoryArea.onplaying_smart_getter = function onplaying() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onplaying;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onplaying !== undefined ? this._onplaying : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onplaying_smart_getter);
HTMLElement.prototype.__defineGetter__("onplaying", curMemoryArea.onplaying_smart_getter);

// onprogress
curMemoryArea.onprogress_getter = function onprogress() { return this._onprogress; }; mframe.safefunction(curMemoryArea.onprogress_getter);
Object.defineProperty(curMemoryArea.onprogress_getter, "name", {value: "get onprogress",configurable: true,});
// onprogress
curMemoryArea.onprogress_setter = function onprogress(val) { this._onprogress = val; }; mframe.safefunction(curMemoryArea.onprogress_setter);
Object.defineProperty(curMemoryArea.onprogress_setter, "name", {value: "set onprogress",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onprogress", {get: curMemoryArea.onprogress_getter,set: curMemoryArea.onprogress_setter,enumerable: true,configurable: true,});
curMemoryArea.onprogress_smart_getter = function onprogress() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onprogress;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onprogress !== undefined ? this._onprogress : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onprogress_smart_getter);
HTMLElement.prototype.__defineGetter__("onprogress", curMemoryArea.onprogress_smart_getter);

// onratechange
curMemoryArea.onratechange_getter = function onratechange() { return this._onratechange; }; mframe.safefunction(curMemoryArea.onratechange_getter);
Object.defineProperty(curMemoryArea.onratechange_getter, "name", {value: "get onratechange",configurable: true,});
// onratechange
curMemoryArea.onratechange_setter = function onratechange(val) { this._onratechange = val; }; mframe.safefunction(curMemoryArea.onratechange_setter);
Object.defineProperty(curMemoryArea.onratechange_setter, "name", {value: "set onratechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onratechange", {get: curMemoryArea.onratechange_getter,set: curMemoryArea.onratechange_setter,enumerable: true,configurable: true,});
curMemoryArea.onratechange_smart_getter = function onratechange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onratechange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onratechange !== undefined ? this._onratechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onratechange_smart_getter);
HTMLElement.prototype.__defineGetter__("onratechange", curMemoryArea.onratechange_smart_getter);

// onreset
curMemoryArea.onreset_getter = function onreset() { return this._onreset; }; mframe.safefunction(curMemoryArea.onreset_getter);
Object.defineProperty(curMemoryArea.onreset_getter, "name", {value: "get onreset",configurable: true,});
// onreset
curMemoryArea.onreset_setter = function onreset(val) { this._onreset = val; }; mframe.safefunction(curMemoryArea.onreset_setter);
Object.defineProperty(curMemoryArea.onreset_setter, "name", {value: "set onreset",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onreset", {get: curMemoryArea.onreset_getter,set: curMemoryArea.onreset_setter,enumerable: true,configurable: true,});
curMemoryArea.onreset_smart_getter = function onreset() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onreset;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onreset !== undefined ? this._onreset : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onreset_smart_getter);
HTMLElement.prototype.__defineGetter__("onreset", curMemoryArea.onreset_smart_getter);

// onresize
curMemoryArea.onresize_getter = function onresize() { return this._onresize; }; mframe.safefunction(curMemoryArea.onresize_getter);
Object.defineProperty(curMemoryArea.onresize_getter, "name", {value: "get onresize",configurable: true,});
// onresize
curMemoryArea.onresize_setter = function onresize(val) { this._onresize = val; }; mframe.safefunction(curMemoryArea.onresize_setter);
Object.defineProperty(curMemoryArea.onresize_setter, "name", {value: "set onresize",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onresize", {get: curMemoryArea.onresize_getter,set: curMemoryArea.onresize_setter,enumerable: true,configurable: true,});
curMemoryArea.onresize_smart_getter = function onresize() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onresize;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onresize !== undefined ? this._onresize : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onresize_smart_getter);
HTMLElement.prototype.__defineGetter__("onresize", curMemoryArea.onresize_smart_getter);

// onscroll
curMemoryArea.onscroll_getter = function onscroll() { return this._onscroll; }; mframe.safefunction(curMemoryArea.onscroll_getter);
Object.defineProperty(curMemoryArea.onscroll_getter, "name", {value: "get onscroll",configurable: true,});
// onscroll
curMemoryArea.onscroll_setter = function onscroll(val) { this._onscroll = val; }; mframe.safefunction(curMemoryArea.onscroll_setter);
Object.defineProperty(curMemoryArea.onscroll_setter, "name", {value: "set onscroll",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscroll", {get: curMemoryArea.onscroll_getter,set: curMemoryArea.onscroll_setter,enumerable: true,configurable: true,});
curMemoryArea.onscroll_smart_getter = function onscroll() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onscroll;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscroll !== undefined ? this._onscroll : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscroll_smart_getter);
HTMLElement.prototype.__defineGetter__("onscroll", curMemoryArea.onscroll_smart_getter);

// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_getter = function onsecuritypolicyviolation() { return this._onsecuritypolicyviolation; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_getter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_getter, "name", {value: "get onsecuritypolicyviolation",configurable: true,});
// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_setter = function onsecuritypolicyviolation(val) { this._onsecuritypolicyviolation = val; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_setter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_setter, "name", {value: "set onsecuritypolicyviolation",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsecuritypolicyviolation", {get: curMemoryArea.onsecuritypolicyviolation_getter,set: curMemoryArea.onsecuritypolicyviolation_setter,enumerable: true,configurable: true,});
curMemoryArea.onsecuritypolicyviolation_smart_getter = function onsecuritypolicyviolation() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onsecuritypolicyviolation;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onsecuritypolicyviolation !== undefined ? this._onsecuritypolicyviolation : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_smart_getter);
HTMLElement.prototype.__defineGetter__("onsecuritypolicyviolation", curMemoryArea.onsecuritypolicyviolation_smart_getter);

// onseeked
curMemoryArea.onseeked_getter = function onseeked() { return this._onseeked; }; mframe.safefunction(curMemoryArea.onseeked_getter);
Object.defineProperty(curMemoryArea.onseeked_getter, "name", {value: "get onseeked",configurable: true,});
// onseeked
curMemoryArea.onseeked_setter = function onseeked(val) { this._onseeked = val; }; mframe.safefunction(curMemoryArea.onseeked_setter);
Object.defineProperty(curMemoryArea.onseeked_setter, "name", {value: "set onseeked",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onseeked", {get: curMemoryArea.onseeked_getter,set: curMemoryArea.onseeked_setter,enumerable: true,configurable: true,});
curMemoryArea.onseeked_smart_getter = function onseeked() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onseeked;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onseeked !== undefined ? this._onseeked : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onseeked_smart_getter);
HTMLElement.prototype.__defineGetter__("onseeked", curMemoryArea.onseeked_smart_getter);

// onseeking
curMemoryArea.onseeking_getter = function onseeking() { return this._onseeking; }; mframe.safefunction(curMemoryArea.onseeking_getter);
Object.defineProperty(curMemoryArea.onseeking_getter, "name", {value: "get onseeking",configurable: true,});
// onseeking
curMemoryArea.onseeking_setter = function onseeking(val) { this._onseeking = val; }; mframe.safefunction(curMemoryArea.onseeking_setter);
Object.defineProperty(curMemoryArea.onseeking_setter, "name", {value: "set onseeking",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onseeking", {get: curMemoryArea.onseeking_getter,set: curMemoryArea.onseeking_setter,enumerable: true,configurable: true,});
curMemoryArea.onseeking_smart_getter = function onseeking() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onseeking;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onseeking !== undefined ? this._onseeking : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onseeking_smart_getter);
HTMLElement.prototype.__defineGetter__("onseeking", curMemoryArea.onseeking_smart_getter);

// onselect
curMemoryArea.onselect_getter = function onselect() { return this._onselect; }; mframe.safefunction(curMemoryArea.onselect_getter);
Object.defineProperty(curMemoryArea.onselect_getter, "name", {value: "get onselect",configurable: true,});
// onselect
curMemoryArea.onselect_setter = function onselect(val) { this._onselect = val; }; mframe.safefunction(curMemoryArea.onselect_setter);
Object.defineProperty(curMemoryArea.onselect_setter, "name", {value: "set onselect",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselect", {get: curMemoryArea.onselect_getter,set: curMemoryArea.onselect_setter,enumerable: true,configurable: true,});
curMemoryArea.onselect_smart_getter = function onselect() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onselect;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onselect !== undefined ? this._onselect : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onselect_smart_getter);
HTMLElement.prototype.__defineGetter__("onselect", curMemoryArea.onselect_smart_getter);

// onslotchange
curMemoryArea.onslotchange_getter = function onslotchange() { return this._onslotchange; }; mframe.safefunction(curMemoryArea.onslotchange_getter);
Object.defineProperty(curMemoryArea.onslotchange_getter, "name", {value: "get onslotchange",configurable: true,});
// onslotchange
curMemoryArea.onslotchange_setter = function onslotchange(val) { this._onslotchange = val; }; mframe.safefunction(curMemoryArea.onslotchange_setter);
Object.defineProperty(curMemoryArea.onslotchange_setter, "name", {value: "set onslotchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onslotchange", {get: curMemoryArea.onslotchange_getter,set: curMemoryArea.onslotchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onslotchange_smart_getter = function onslotchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onslotchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onslotchange !== undefined ? this._onslotchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onslotchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onslotchange", curMemoryArea.onslotchange_smart_getter);

// onstalled
curMemoryArea.onstalled_getter = function onstalled() { return this._onstalled; }; mframe.safefunction(curMemoryArea.onstalled_getter);
Object.defineProperty(curMemoryArea.onstalled_getter, "name", {value: "get onstalled",configurable: true,});
// onstalled
curMemoryArea.onstalled_setter = function onstalled(val) { this._onstalled = val; }; mframe.safefunction(curMemoryArea.onstalled_setter);
Object.defineProperty(curMemoryArea.onstalled_setter, "name", {value: "set onstalled",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onstalled", {get: curMemoryArea.onstalled_getter,set: curMemoryArea.onstalled_setter,enumerable: true,configurable: true,});
curMemoryArea.onstalled_smart_getter = function onstalled() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onstalled;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onstalled !== undefined ? this._onstalled : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onstalled_smart_getter);
HTMLElement.prototype.__defineGetter__("onstalled", curMemoryArea.onstalled_smart_getter);

// onsubmit
curMemoryArea.onsubmit_getter = function onsubmit() { return this._onsubmit; }; mframe.safefunction(curMemoryArea.onsubmit_getter);
Object.defineProperty(curMemoryArea.onsubmit_getter, "name", {value: "get onsubmit",configurable: true,});
// onsubmit
curMemoryArea.onsubmit_setter = function onsubmit(val) { this._onsubmit = val; }; mframe.safefunction(curMemoryArea.onsubmit_setter);
Object.defineProperty(curMemoryArea.onsubmit_setter, "name", {value: "set onsubmit",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsubmit", {get: curMemoryArea.onsubmit_getter,set: curMemoryArea.onsubmit_setter,enumerable: true,configurable: true,});
curMemoryArea.onsubmit_smart_getter = function onsubmit() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onsubmit;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onsubmit !== undefined ? this._onsubmit : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onsubmit_smart_getter);
HTMLElement.prototype.__defineGetter__("onsubmit", curMemoryArea.onsubmit_smart_getter);

// onsuspend
curMemoryArea.onsuspend_getter = function onsuspend() { return this._onsuspend; }; mframe.safefunction(curMemoryArea.onsuspend_getter);
Object.defineProperty(curMemoryArea.onsuspend_getter, "name", {value: "get onsuspend",configurable: true,});
// onsuspend
curMemoryArea.onsuspend_setter = function onsuspend(val) { this._onsuspend = val; }; mframe.safefunction(curMemoryArea.onsuspend_setter);
Object.defineProperty(curMemoryArea.onsuspend_setter, "name", {value: "set onsuspend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsuspend", {get: curMemoryArea.onsuspend_getter,set: curMemoryArea.onsuspend_setter,enumerable: true,configurable: true,});
curMemoryArea.onsuspend_smart_getter = function onsuspend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onsuspend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onsuspend !== undefined ? this._onsuspend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onsuspend_smart_getter);
HTMLElement.prototype.__defineGetter__("onsuspend", curMemoryArea.onsuspend_smart_getter);

// ontimeupdate
curMemoryArea.ontimeupdate_getter = function ontimeupdate() { return this._ontimeupdate; }; mframe.safefunction(curMemoryArea.ontimeupdate_getter);
Object.defineProperty(curMemoryArea.ontimeupdate_getter, "name", {value: "get ontimeupdate",configurable: true,});
// ontimeupdate
curMemoryArea.ontimeupdate_setter = function ontimeupdate(val) { this._ontimeupdate = val; }; mframe.safefunction(curMemoryArea.ontimeupdate_setter);
Object.defineProperty(curMemoryArea.ontimeupdate_setter, "name", {value: "set ontimeupdate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontimeupdate", {get: curMemoryArea.ontimeupdate_getter,set: curMemoryArea.ontimeupdate_setter,enumerable: true,configurable: true,});
curMemoryArea.ontimeupdate_smart_getter = function ontimeupdate() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontimeupdate;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontimeupdate !== undefined ? this._ontimeupdate : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontimeupdate_smart_getter);
HTMLElement.prototype.__defineGetter__("ontimeupdate", curMemoryArea.ontimeupdate_smart_getter);

// ontoggle
curMemoryArea.ontoggle_getter = function ontoggle() { return this._ontoggle; }; mframe.safefunction(curMemoryArea.ontoggle_getter);
Object.defineProperty(curMemoryArea.ontoggle_getter, "name", {value: "get ontoggle",configurable: true,});
// ontoggle
curMemoryArea.ontoggle_setter = function ontoggle(val) { this._ontoggle = val; }; mframe.safefunction(curMemoryArea.ontoggle_setter);
Object.defineProperty(curMemoryArea.ontoggle_setter, "name", {value: "set ontoggle",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontoggle", {get: curMemoryArea.ontoggle_getter,set: curMemoryArea.ontoggle_setter,enumerable: true,configurable: true,});
curMemoryArea.ontoggle_smart_getter = function ontoggle() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontoggle;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontoggle !== undefined ? this._ontoggle : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontoggle_smart_getter);
HTMLElement.prototype.__defineGetter__("ontoggle", curMemoryArea.ontoggle_smart_getter);

// onvolumechange
curMemoryArea.onvolumechange_getter = function onvolumechange() { return this._onvolumechange; }; mframe.safefunction(curMemoryArea.onvolumechange_getter);
Object.defineProperty(curMemoryArea.onvolumechange_getter, "name", {value: "get onvolumechange",configurable: true,});
// onvolumechange
curMemoryArea.onvolumechange_setter = function onvolumechange(val) { this._onvolumechange = val; }; mframe.safefunction(curMemoryArea.onvolumechange_setter);
Object.defineProperty(curMemoryArea.onvolumechange_setter, "name", {value: "set onvolumechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onvolumechange", {get: curMemoryArea.onvolumechange_getter,set: curMemoryArea.onvolumechange_setter,enumerable: true,configurable: true,});
curMemoryArea.onvolumechange_smart_getter = function onvolumechange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onvolumechange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onvolumechange !== undefined ? this._onvolumechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onvolumechange_smart_getter);
HTMLElement.prototype.__defineGetter__("onvolumechange", curMemoryArea.onvolumechange_smart_getter);

// onwaiting
curMemoryArea.onwaiting_getter = function onwaiting() { return this._onwaiting; }; mframe.safefunction(curMemoryArea.onwaiting_getter);
Object.defineProperty(curMemoryArea.onwaiting_getter, "name", {value: "get onwaiting",configurable: true,});
// onwaiting
curMemoryArea.onwaiting_setter = function onwaiting(val) { this._onwaiting = val; }; mframe.safefunction(curMemoryArea.onwaiting_setter);
Object.defineProperty(curMemoryArea.onwaiting_setter, "name", {value: "set onwaiting",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwaiting", {get: curMemoryArea.onwaiting_getter,set: curMemoryArea.onwaiting_setter,enumerable: true,configurable: true,});
curMemoryArea.onwaiting_smart_getter = function onwaiting() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwaiting;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwaiting !== undefined ? this._onwaiting : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwaiting_smart_getter);
HTMLElement.prototype.__defineGetter__("onwaiting", curMemoryArea.onwaiting_smart_getter);

// onwebkitanimationend
curMemoryArea.onwebkitanimationend_getter = function onwebkitanimationend() { return this._onwebkitanimationend; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_getter, "name", {value: "get onwebkitanimationend",configurable: true,});
// onwebkitanimationend
curMemoryArea.onwebkitanimationend_setter = function onwebkitanimationend(val) { this._onwebkitanimationend = val; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_setter, "name", {value: "set onwebkitanimationend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationend", {get: curMemoryArea.onwebkitanimationend_getter,set: curMemoryArea.onwebkitanimationend_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationend_smart_getter = function onwebkitanimationend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwebkitanimationend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitanimationend !== undefined ? this._onwebkitanimationend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationend_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationend", curMemoryArea.onwebkitanimationend_smart_getter);

// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_getter = function onwebkitanimationiteration() { return this._onwebkitanimationiteration; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_getter, "name", {value: "get onwebkitanimationiteration",configurable: true,});
// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_setter = function onwebkitanimationiteration(val) { this._onwebkitanimationiteration = val; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_setter, "name", {value: "set onwebkitanimationiteration",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationiteration", {get: curMemoryArea.onwebkitanimationiteration_getter,set: curMemoryArea.onwebkitanimationiteration_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationiteration_smart_getter = function onwebkitanimationiteration() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwebkitanimationiteration;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitanimationiteration !== undefined ? this._onwebkitanimationiteration : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationiteration", curMemoryArea.onwebkitanimationiteration_smart_getter);

// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_getter = function onwebkitanimationstart() { return this._onwebkitanimationstart; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_getter, "name", {value: "get onwebkitanimationstart",configurable: true,});
// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_setter = function onwebkitanimationstart(val) { this._onwebkitanimationstart = val; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_setter, "name", {value: "set onwebkitanimationstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationstart", {get: curMemoryArea.onwebkitanimationstart_getter,set: curMemoryArea.onwebkitanimationstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationstart_smart_getter = function onwebkitanimationstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwebkitanimationstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitanimationstart !== undefined ? this._onwebkitanimationstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationstart", curMemoryArea.onwebkitanimationstart_smart_getter);

// onwebkittransitionend
curMemoryArea.onwebkittransitionend_getter = function onwebkittransitionend() { return this._onwebkittransitionend; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_getter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_getter, "name", {value: "get onwebkittransitionend",configurable: true,});
// onwebkittransitionend
curMemoryArea.onwebkittransitionend_setter = function onwebkittransitionend(val) { this._onwebkittransitionend = val; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_setter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_setter, "name", {value: "set onwebkittransitionend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkittransitionend", {get: curMemoryArea.onwebkittransitionend_getter,set: curMemoryArea.onwebkittransitionend_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkittransitionend_smart_getter = function onwebkittransitionend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwebkittransitionend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkittransitionend !== undefined ? this._onwebkittransitionend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkittransitionend_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkittransitionend", curMemoryArea.onwebkittransitionend_smart_getter);

// onwheel
curMemoryArea.onwheel_getter = function onwheel() { return this._onwheel; }; mframe.safefunction(curMemoryArea.onwheel_getter);
Object.defineProperty(curMemoryArea.onwheel_getter, "name", {value: "get onwheel",configurable: true,});
// onwheel
curMemoryArea.onwheel_setter = function onwheel(val) { this._onwheel = val; }; mframe.safefunction(curMemoryArea.onwheel_setter);
Object.defineProperty(curMemoryArea.onwheel_setter, "name", {value: "set onwheel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwheel", {get: curMemoryArea.onwheel_getter,set: curMemoryArea.onwheel_setter,enumerable: true,configurable: true,});
curMemoryArea.onwheel_smart_getter = function onwheel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwheel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwheel !== undefined ? this._onwheel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwheel_smart_getter);
HTMLElement.prototype.__defineGetter__("onwheel", curMemoryArea.onwheel_smart_getter);

// onauxclick
curMemoryArea.onauxclick_getter = function onauxclick() { return this._onauxclick; }; mframe.safefunction(curMemoryArea.onauxclick_getter);
Object.defineProperty(curMemoryArea.onauxclick_getter, "name", {value: "get onauxclick",configurable: true,});
// onauxclick
curMemoryArea.onauxclick_setter = function onauxclick(val) { this._onauxclick = val; }; mframe.safefunction(curMemoryArea.onauxclick_setter);
Object.defineProperty(curMemoryArea.onauxclick_setter, "name", {value: "set onauxclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onauxclick", {get: curMemoryArea.onauxclick_getter,set: curMemoryArea.onauxclick_setter,enumerable: true,configurable: true,});
curMemoryArea.onauxclick_smart_getter = function onauxclick() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onauxclick;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onauxclick !== undefined ? this._onauxclick : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onauxclick_smart_getter);
HTMLElement.prototype.__defineGetter__("onauxclick", curMemoryArea.onauxclick_smart_getter);

// ongotpointercapture
curMemoryArea.ongotpointercapture_getter = function ongotpointercapture() { return this._ongotpointercapture; }; mframe.safefunction(curMemoryArea.ongotpointercapture_getter);
Object.defineProperty(curMemoryArea.ongotpointercapture_getter, "name", {value: "get ongotpointercapture",configurable: true,});
// ongotpointercapture
curMemoryArea.ongotpointercapture_setter = function ongotpointercapture(val) { this._ongotpointercapture = val; }; mframe.safefunction(curMemoryArea.ongotpointercapture_setter);
Object.defineProperty(curMemoryArea.ongotpointercapture_setter, "name", {value: "set ongotpointercapture",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ongotpointercapture", {get: curMemoryArea.ongotpointercapture_getter,set: curMemoryArea.ongotpointercapture_setter,enumerable: true,configurable: true,});
curMemoryArea.ongotpointercapture_smart_getter = function ongotpointercapture() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ongotpointercapture;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ongotpointercapture !== undefined ? this._ongotpointercapture : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ongotpointercapture_smart_getter);
HTMLElement.prototype.__defineGetter__("ongotpointercapture", curMemoryArea.ongotpointercapture_smart_getter);

// onlostpointercapture
curMemoryArea.onlostpointercapture_getter = function onlostpointercapture() { return this._onlostpointercapture; }; mframe.safefunction(curMemoryArea.onlostpointercapture_getter);
Object.defineProperty(curMemoryArea.onlostpointercapture_getter, "name", {value: "get onlostpointercapture",configurable: true,});
// onlostpointercapture
curMemoryArea.onlostpointercapture_setter = function onlostpointercapture(val) { this._onlostpointercapture = val; }; mframe.safefunction(curMemoryArea.onlostpointercapture_setter);
Object.defineProperty(curMemoryArea.onlostpointercapture_setter, "name", {value: "set onlostpointercapture",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onlostpointercapture", {get: curMemoryArea.onlostpointercapture_getter,set: curMemoryArea.onlostpointercapture_setter,enumerable: true,configurable: true,});
curMemoryArea.onlostpointercapture_smart_getter = function onlostpointercapture() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onlostpointercapture;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onlostpointercapture !== undefined ? this._onlostpointercapture : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onlostpointercapture_smart_getter);
HTMLElement.prototype.__defineGetter__("onlostpointercapture", curMemoryArea.onlostpointercapture_smart_getter);

// onpointerdown
curMemoryArea.onpointerdown_getter = function onpointerdown() { return this._onpointerdown; }; mframe.safefunction(curMemoryArea.onpointerdown_getter);
Object.defineProperty(curMemoryArea.onpointerdown_getter, "name", {value: "get onpointerdown",configurable: true,});
// onpointerdown
curMemoryArea.onpointerdown_setter = function onpointerdown(val) { this._onpointerdown = val; }; mframe.safefunction(curMemoryArea.onpointerdown_setter);
Object.defineProperty(curMemoryArea.onpointerdown_setter, "name", {value: "set onpointerdown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerdown", {get: curMemoryArea.onpointerdown_getter,set: curMemoryArea.onpointerdown_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerdown_smart_getter = function onpointerdown() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerdown;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerdown !== undefined ? this._onpointerdown : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerdown_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerdown", curMemoryArea.onpointerdown_smart_getter);

// onpointermove
curMemoryArea.onpointermove_getter = function onpointermove() { return this._onpointermove; }; mframe.safefunction(curMemoryArea.onpointermove_getter);
Object.defineProperty(curMemoryArea.onpointermove_getter, "name", {value: "get onpointermove",configurable: true,});
// onpointermove
curMemoryArea.onpointermove_setter = function onpointermove(val) { this._onpointermove = val; }; mframe.safefunction(curMemoryArea.onpointermove_setter);
Object.defineProperty(curMemoryArea.onpointermove_setter, "name", {value: "set onpointermove",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointermove", {get: curMemoryArea.onpointermove_getter,set: curMemoryArea.onpointermove_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointermove_smart_getter = function onpointermove() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointermove;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointermove !== undefined ? this._onpointermove : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointermove_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointermove", curMemoryArea.onpointermove_smart_getter);

// onpointerrawupdate
curMemoryArea.onpointerrawupdate_getter = function onpointerrawupdate() { return this._onpointerrawupdate; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_getter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_getter, "name", {value: "get onpointerrawupdate",configurable: true,});
// onpointerrawupdate
curMemoryArea.onpointerrawupdate_setter = function onpointerrawupdate(val) { this._onpointerrawupdate = val; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_setter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_setter, "name", {value: "set onpointerrawupdate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerrawupdate", {get: curMemoryArea.onpointerrawupdate_getter,set: curMemoryArea.onpointerrawupdate_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerrawupdate_smart_getter = function onpointerrawupdate() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerrawupdate;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerrawupdate !== undefined ? this._onpointerrawupdate : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerrawupdate_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerrawupdate", curMemoryArea.onpointerrawupdate_smart_getter);

// onpointerup
curMemoryArea.onpointerup_getter = function onpointerup() { return this._onpointerup; }; mframe.safefunction(curMemoryArea.onpointerup_getter);
Object.defineProperty(curMemoryArea.onpointerup_getter, "name", {value: "get onpointerup",configurable: true,});
// onpointerup
curMemoryArea.onpointerup_setter = function onpointerup(val) { this._onpointerup = val; }; mframe.safefunction(curMemoryArea.onpointerup_setter);
Object.defineProperty(curMemoryArea.onpointerup_setter, "name", {value: "set onpointerup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerup", {get: curMemoryArea.onpointerup_getter,set: curMemoryArea.onpointerup_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerup_smart_getter = function onpointerup() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerup;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerup !== undefined ? this._onpointerup : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerup_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerup", curMemoryArea.onpointerup_smart_getter);

// onpointercancel
curMemoryArea.onpointercancel_getter = function onpointercancel() { return this._onpointercancel; }; mframe.safefunction(curMemoryArea.onpointercancel_getter);
Object.defineProperty(curMemoryArea.onpointercancel_getter, "name", {value: "get onpointercancel",configurable: true,});
// onpointercancel
curMemoryArea.onpointercancel_setter = function onpointercancel(val) { this._onpointercancel = val; }; mframe.safefunction(curMemoryArea.onpointercancel_setter);
Object.defineProperty(curMemoryArea.onpointercancel_setter, "name", {value: "set onpointercancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointercancel", {get: curMemoryArea.onpointercancel_getter,set: curMemoryArea.onpointercancel_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointercancel_smart_getter = function onpointercancel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointercancel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointercancel !== undefined ? this._onpointercancel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointercancel_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointercancel", curMemoryArea.onpointercancel_smart_getter);

// onpointerover
curMemoryArea.onpointerover_getter = function onpointerover() { return this._onpointerover; }; mframe.safefunction(curMemoryArea.onpointerover_getter);
Object.defineProperty(curMemoryArea.onpointerover_getter, "name", {value: "get onpointerover",configurable: true,});
// onpointerover
curMemoryArea.onpointerover_setter = function onpointerover(val) { this._onpointerover = val; }; mframe.safefunction(curMemoryArea.onpointerover_setter);
Object.defineProperty(curMemoryArea.onpointerover_setter, "name", {value: "set onpointerover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerover", {get: curMemoryArea.onpointerover_getter,set: curMemoryArea.onpointerover_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerover_smart_getter = function onpointerover() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerover;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerover !== undefined ? this._onpointerover : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerover_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerover", curMemoryArea.onpointerover_smart_getter);

// onpointerout
curMemoryArea.onpointerout_getter = function onpointerout() { return this._onpointerout; }; mframe.safefunction(curMemoryArea.onpointerout_getter);
Object.defineProperty(curMemoryArea.onpointerout_getter, "name", {value: "get onpointerout",configurable: true,});
// onpointerout
curMemoryArea.onpointerout_setter = function onpointerout(val) { this._onpointerout = val; }; mframe.safefunction(curMemoryArea.onpointerout_setter);
Object.defineProperty(curMemoryArea.onpointerout_setter, "name", {value: "set onpointerout",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerout", {get: curMemoryArea.onpointerout_getter,set: curMemoryArea.onpointerout_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerout_smart_getter = function onpointerout() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerout;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerout !== undefined ? this._onpointerout : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerout_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerout", curMemoryArea.onpointerout_smart_getter);

// onpointerenter
curMemoryArea.onpointerenter_getter = function onpointerenter() { return this._onpointerenter; }; mframe.safefunction(curMemoryArea.onpointerenter_getter);
Object.defineProperty(curMemoryArea.onpointerenter_getter, "name", {value: "get onpointerenter",configurable: true,});
// onpointerenter
curMemoryArea.onpointerenter_setter = function onpointerenter(val) { this._onpointerenter = val; }; mframe.safefunction(curMemoryArea.onpointerenter_setter);
Object.defineProperty(curMemoryArea.onpointerenter_setter, "name", {value: "set onpointerenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerenter", {get: curMemoryArea.onpointerenter_getter,set: curMemoryArea.onpointerenter_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerenter_smart_getter = function onpointerenter() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerenter;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerenter !== undefined ? this._onpointerenter : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerenter_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerenter", curMemoryArea.onpointerenter_smart_getter);

// onpointerleave
curMemoryArea.onpointerleave_getter = function onpointerleave() { return this._onpointerleave; }; mframe.safefunction(curMemoryArea.onpointerleave_getter);
Object.defineProperty(curMemoryArea.onpointerleave_getter, "name", {value: "get onpointerleave",configurable: true,});
// onpointerleave
curMemoryArea.onpointerleave_setter = function onpointerleave(val) { this._onpointerleave = val; }; mframe.safefunction(curMemoryArea.onpointerleave_setter);
Object.defineProperty(curMemoryArea.onpointerleave_setter, "name", {value: "set onpointerleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerleave", {get: curMemoryArea.onpointerleave_getter,set: curMemoryArea.onpointerleave_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerleave_smart_getter = function onpointerleave() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerleave;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerleave !== undefined ? this._onpointerleave : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerleave_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerleave", curMemoryArea.onpointerleave_smart_getter);

// onselectstart
curMemoryArea.onselectstart_getter = function onselectstart() { return this._onselectstart; }; mframe.safefunction(curMemoryArea.onselectstart_getter);
Object.defineProperty(curMemoryArea.onselectstart_getter, "name", {value: "get onselectstart",configurable: true,});
// onselectstart
curMemoryArea.onselectstart_setter = function onselectstart(val) { this._onselectstart = val; }; mframe.safefunction(curMemoryArea.onselectstart_setter);
Object.defineProperty(curMemoryArea.onselectstart_setter, "name", {value: "set onselectstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselectstart", {get: curMemoryArea.onselectstart_getter,set: curMemoryArea.onselectstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onselectstart_smart_getter = function onselectstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onselectstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onselectstart !== undefined ? this._onselectstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onselectstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onselectstart", curMemoryArea.onselectstart_smart_getter);

// onselectionchange
curMemoryArea.onselectionchange_getter = function onselectionchange() { return this._onselectionchange; }; mframe.safefunction(curMemoryArea.onselectionchange_getter);
Object.defineProperty(curMemoryArea.onselectionchange_getter, "name", {value: "get onselectionchange",configurable: true,});
// onselectionchange
curMemoryArea.onselectionchange_setter = function onselectionchange(val) { this._onselectionchange = val; }; mframe.safefunction(curMemoryArea.onselectionchange_setter);
Object.defineProperty(curMemoryArea.onselectionchange_setter, "name", {value: "set onselectionchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselectionchange", {get: curMemoryArea.onselectionchange_getter,set: curMemoryArea.onselectionchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onselectionchange_smart_getter = function onselectionchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onselectionchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onselectionchange !== undefined ? this._onselectionchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onselectionchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onselectionchange", curMemoryArea.onselectionchange_smart_getter);

// onanimationend
curMemoryArea.onanimationend_getter = function onanimationend() { return this._onanimationend; }; mframe.safefunction(curMemoryArea.onanimationend_getter);
Object.defineProperty(curMemoryArea.onanimationend_getter, "name", {value: "get onanimationend",configurable: true,});
// onanimationend
curMemoryArea.onanimationend_setter = function onanimationend(val) { this._onanimationend = val; }; mframe.safefunction(curMemoryArea.onanimationend_setter);
Object.defineProperty(curMemoryArea.onanimationend_setter, "name", {value: "set onanimationend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationend", {get: curMemoryArea.onanimationend_getter,set: curMemoryArea.onanimationend_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationend_smart_getter = function onanimationend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onanimationend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onanimationend !== undefined ? this._onanimationend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onanimationend_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationend", curMemoryArea.onanimationend_smart_getter);

// onanimationiteration
curMemoryArea.onanimationiteration_getter = function onanimationiteration() { return this._onanimationiteration; }; mframe.safefunction(curMemoryArea.onanimationiteration_getter);
Object.defineProperty(curMemoryArea.onanimationiteration_getter, "name", {value: "get onanimationiteration",configurable: true,});
// onanimationiteration
curMemoryArea.onanimationiteration_setter = function onanimationiteration(val) { this._onanimationiteration = val; }; mframe.safefunction(curMemoryArea.onanimationiteration_setter);
Object.defineProperty(curMemoryArea.onanimationiteration_setter, "name", {value: "set onanimationiteration",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationiteration", {get: curMemoryArea.onanimationiteration_getter,set: curMemoryArea.onanimationiteration_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationiteration_smart_getter = function onanimationiteration() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onanimationiteration;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onanimationiteration !== undefined ? this._onanimationiteration : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onanimationiteration_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationiteration", curMemoryArea.onanimationiteration_smart_getter);

// onanimationstart
curMemoryArea.onanimationstart_getter = function onanimationstart() { return this._onanimationstart; }; mframe.safefunction(curMemoryArea.onanimationstart_getter);
Object.defineProperty(curMemoryArea.onanimationstart_getter, "name", {value: "get onanimationstart",configurable: true,});
// onanimationstart
curMemoryArea.onanimationstart_setter = function onanimationstart(val) { this._onanimationstart = val; }; mframe.safefunction(curMemoryArea.onanimationstart_setter);
Object.defineProperty(curMemoryArea.onanimationstart_setter, "name", {value: "set onanimationstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationstart", {get: curMemoryArea.onanimationstart_getter,set: curMemoryArea.onanimationstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationstart_smart_getter = function onanimationstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onanimationstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onanimationstart !== undefined ? this._onanimationstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onanimationstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationstart", curMemoryArea.onanimationstart_smart_getter);

// ontransitionrun
curMemoryArea.ontransitionrun_getter = function ontransitionrun() { return this._ontransitionrun; }; mframe.safefunction(curMemoryArea.ontransitionrun_getter);
Object.defineProperty(curMemoryArea.ontransitionrun_getter, "name", {value: "get ontransitionrun",configurable: true,});
// ontransitionrun
curMemoryArea.ontransitionrun_setter = function ontransitionrun(val) { this._ontransitionrun = val; }; mframe.safefunction(curMemoryArea.ontransitionrun_setter);
Object.defineProperty(curMemoryArea.ontransitionrun_setter, "name", {value: "set ontransitionrun",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionrun", {get: curMemoryArea.ontransitionrun_getter,set: curMemoryArea.ontransitionrun_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionrun_smart_getter = function ontransitionrun() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontransitionrun;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontransitionrun !== undefined ? this._ontransitionrun : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontransitionrun_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionrun", curMemoryArea.ontransitionrun_smart_getter);

// ontransitionstart
curMemoryArea.ontransitionstart_getter = function ontransitionstart() { return this._ontransitionstart; }; mframe.safefunction(curMemoryArea.ontransitionstart_getter);
Object.defineProperty(curMemoryArea.ontransitionstart_getter, "name", {value: "get ontransitionstart",configurable: true,});
// ontransitionstart
curMemoryArea.ontransitionstart_setter = function ontransitionstart(val) { this._ontransitionstart = val; }; mframe.safefunction(curMemoryArea.ontransitionstart_setter);
Object.defineProperty(curMemoryArea.ontransitionstart_setter, "name", {value: "set ontransitionstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionstart", {get: curMemoryArea.ontransitionstart_getter,set: curMemoryArea.ontransitionstart_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionstart_smart_getter = function ontransitionstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontransitionstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontransitionstart !== undefined ? this._ontransitionstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontransitionstart_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionstart", curMemoryArea.ontransitionstart_smart_getter);

// ontransitionend
curMemoryArea.ontransitionend_getter = function ontransitionend() { return this._ontransitionend; }; mframe.safefunction(curMemoryArea.ontransitionend_getter);
Object.defineProperty(curMemoryArea.ontransitionend_getter, "name", {value: "get ontransitionend",configurable: true,});
// ontransitionend
curMemoryArea.ontransitionend_setter = function ontransitionend(val) { this._ontransitionend = val; }; mframe.safefunction(curMemoryArea.ontransitionend_setter);
Object.defineProperty(curMemoryArea.ontransitionend_setter, "name", {value: "set ontransitionend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionend", {get: curMemoryArea.ontransitionend_getter,set: curMemoryArea.ontransitionend_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionend_smart_getter = function ontransitionend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontransitionend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontransitionend !== undefined ? this._ontransitionend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontransitionend_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionend", curMemoryArea.ontransitionend_smart_getter);

// ontransitioncancel
curMemoryArea.ontransitioncancel_getter = function ontransitioncancel() { return this._ontransitioncancel; }; mframe.safefunction(curMemoryArea.ontransitioncancel_getter);
Object.defineProperty(curMemoryArea.ontransitioncancel_getter, "name", {value: "get ontransitioncancel",configurable: true,});
// ontransitioncancel
curMemoryArea.ontransitioncancel_setter = function ontransitioncancel(val) { this._ontransitioncancel = val; }; mframe.safefunction(curMemoryArea.ontransitioncancel_setter);
Object.defineProperty(curMemoryArea.ontransitioncancel_setter, "name", {value: "set ontransitioncancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitioncancel", {get: curMemoryArea.ontransitioncancel_getter,set: curMemoryArea.ontransitioncancel_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitioncancel_smart_getter = function ontransitioncancel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontransitioncancel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontransitioncancel !== undefined ? this._ontransitioncancel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontransitioncancel_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitioncancel", curMemoryArea.ontransitioncancel_smart_getter);

// oncopy
curMemoryArea.oncopy_getter = function oncopy() { return this._oncopy; }; mframe.safefunction(curMemoryArea.oncopy_getter);
Object.defineProperty(curMemoryArea.oncopy_getter, "name", {value: "get oncopy",configurable: true,});
// oncopy
curMemoryArea.oncopy_setter = function oncopy(val) { this._oncopy = val; }; mframe.safefunction(curMemoryArea.oncopy_setter);
Object.defineProperty(curMemoryArea.oncopy_setter, "name", {value: "set oncopy",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncopy", {get: curMemoryArea.oncopy_getter,set: curMemoryArea.oncopy_setter,enumerable: true,configurable: true,});
curMemoryArea.oncopy_smart_getter = function oncopy() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncopy;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncopy !== undefined ? this._oncopy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncopy_smart_getter);
HTMLElement.prototype.__defineGetter__("oncopy", curMemoryArea.oncopy_smart_getter);

// oncut
curMemoryArea.oncut_getter = function oncut() { return this._oncut; }; mframe.safefunction(curMemoryArea.oncut_getter);
Object.defineProperty(curMemoryArea.oncut_getter, "name", {value: "get oncut",configurable: true,});
// oncut
curMemoryArea.oncut_setter = function oncut(val) { this._oncut = val; }; mframe.safefunction(curMemoryArea.oncut_setter);
Object.defineProperty(curMemoryArea.oncut_setter, "name", {value: "set oncut",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncut", {get: curMemoryArea.oncut_getter,set: curMemoryArea.oncut_setter,enumerable: true,configurable: true,});
curMemoryArea.oncut_smart_getter = function oncut() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncut;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncut !== undefined ? this._oncut : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncut_smart_getter);
HTMLElement.prototype.__defineGetter__("oncut", curMemoryArea.oncut_smart_getter);

// onpaste
curMemoryArea.onpaste_getter = function onpaste() { return this._onpaste; }; mframe.safefunction(curMemoryArea.onpaste_getter);
Object.defineProperty(curMemoryArea.onpaste_getter, "name", {value: "get onpaste",configurable: true,});
// onpaste
curMemoryArea.onpaste_setter = function onpaste(val) { this._onpaste = val; }; mframe.safefunction(curMemoryArea.onpaste_setter);
Object.defineProperty(curMemoryArea.onpaste_setter, "name", {value: "set onpaste",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpaste", {get: curMemoryArea.onpaste_getter,set: curMemoryArea.onpaste_setter,enumerable: true,configurable: true,});
curMemoryArea.onpaste_smart_getter = function onpaste() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpaste;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpaste !== undefined ? this._onpaste : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpaste_smart_getter);
HTMLElement.prototype.__defineGetter__("onpaste", curMemoryArea.onpaste_smart_getter);

// dataset
curMemoryArea.dataset_getter = function dataset() { return this._dataset; }; mframe.safefunction(curMemoryArea.dataset_getter);
Object.defineProperty(curMemoryArea.dataset_getter, "name", {value: "get dataset",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "dataset", {get: curMemoryArea.dataset_getter,enumerable: true,configurable: true,});
curMemoryArea.dataset_smart_getter = function dataset() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.dataset;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._dataset !== undefined ? this._dataset : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.dataset_smart_getter);
HTMLElement.prototype.__defineGetter__("dataset", curMemoryArea.dataset_smart_getter);

// nonce
curMemoryArea.nonce_getter = function nonce() { return this._nonce; }; mframe.safefunction(curMemoryArea.nonce_getter);
Object.defineProperty(curMemoryArea.nonce_getter, "name", {value: "get nonce",configurable: true,});
// nonce
curMemoryArea.nonce_setter = function nonce(val) { this._nonce = val; }; mframe.safefunction(curMemoryArea.nonce_setter);
Object.defineProperty(curMemoryArea.nonce_setter, "name", {value: "set nonce",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "nonce", {get: curMemoryArea.nonce_getter,set: curMemoryArea.nonce_setter,enumerable: true,configurable: true,});
curMemoryArea.nonce_smart_getter = function nonce() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.nonce;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._nonce !== undefined ? this._nonce : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.nonce_smart_getter);
HTMLElement.prototype.__defineGetter__("nonce", curMemoryArea.nonce_smart_getter);

// autofocus
curMemoryArea.autofocus_getter = function autofocus() { return this._autofocus; }; mframe.safefunction(curMemoryArea.autofocus_getter);
Object.defineProperty(curMemoryArea.autofocus_getter, "name", {value: "get autofocus",configurable: true,});
// autofocus
curMemoryArea.autofocus_setter = function autofocus(val) { this._autofocus = val; }; mframe.safefunction(curMemoryArea.autofocus_setter);
Object.defineProperty(curMemoryArea.autofocus_setter, "name", {value: "set autofocus",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "autofocus", {get: curMemoryArea.autofocus_getter,set: curMemoryArea.autofocus_setter,enumerable: true,configurable: true,});
curMemoryArea.autofocus_smart_getter = function autofocus() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.autofocus;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._autofocus !== undefined ? this._autofocus : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.autofocus_smart_getter);
HTMLElement.prototype.__defineGetter__("autofocus", curMemoryArea.autofocus_smart_getter);

// tabIndex
curMemoryArea.tabIndex_getter = function tabIndex() { return this._tabIndex; }; mframe.safefunction(curMemoryArea.tabIndex_getter);
Object.defineProperty(curMemoryArea.tabIndex_getter, "name", {value: "get tabIndex",configurable: true,});
// tabIndex
curMemoryArea.tabIndex_setter = function tabIndex(val) { this._tabIndex = val; }; mframe.safefunction(curMemoryArea.tabIndex_setter);
Object.defineProperty(curMemoryArea.tabIndex_setter, "name", {value: "set tabIndex",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "tabIndex", {get: curMemoryArea.tabIndex_getter,set: curMemoryArea.tabIndex_setter,enumerable: true,configurable: true,});
curMemoryArea.tabIndex_smart_getter = function tabIndex() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.tabIndex;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._tabIndex !== undefined ? this._tabIndex : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.tabIndex_smart_getter);
HTMLElement.prototype.__defineGetter__("tabIndex", curMemoryArea.tabIndex_smart_getter);

// style
curMemoryArea.style_getter = function style() { return this._style; }; mframe.safefunction(curMemoryArea.style_getter);
Object.defineProperty(curMemoryArea.style_getter, "name", {value: "get style",configurable: true,});
// style
curMemoryArea.style_setter = function style(val) { this._style = val; }; mframe.safefunction(curMemoryArea.style_setter);
Object.defineProperty(curMemoryArea.style_setter, "name", {value: "set style",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "style", {get: curMemoryArea.style_getter,set: curMemoryArea.style_setter,enumerable: true,configurable: true,});
curMemoryArea.style_smart_getter = function style() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.style;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._style !== undefined ? this._style : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.style_smart_getter);
HTMLElement.prototype.__defineGetter__("style", curMemoryArea.style_smart_getter);

// attributeStyleMap
curMemoryArea.attributeStyleMap_getter = function attributeStyleMap() { return this._attributeStyleMap; }; mframe.safefunction(curMemoryArea.attributeStyleMap_getter);
Object.defineProperty(curMemoryArea.attributeStyleMap_getter, "name", {value: "get attributeStyleMap",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "attributeStyleMap", {get: curMemoryArea.attributeStyleMap_getter,enumerable: true,configurable: true,});
curMemoryArea.attributeStyleMap_smart_getter = function attributeStyleMap() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.attributeStyleMap;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._attributeStyleMap !== undefined ? this._attributeStyleMap : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.attributeStyleMap_smart_getter);
HTMLElement.prototype.__defineGetter__("attributeStyleMap", curMemoryArea.attributeStyleMap_smart_getter);

// oncommand
curMemoryArea.oncommand_getter = function oncommand() { return this._oncommand; }; mframe.safefunction(curMemoryArea.oncommand_getter);
Object.defineProperty(curMemoryArea.oncommand_getter, "name", {value: "get oncommand",configurable: true,});
// oncommand
curMemoryArea.oncommand_setter = function oncommand(val) { this._oncommand = val; }; mframe.safefunction(curMemoryArea.oncommand_setter);
Object.defineProperty(curMemoryArea.oncommand_setter, "name", {value: "set oncommand",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncommand", {get: curMemoryArea.oncommand_getter,set: curMemoryArea.oncommand_setter,enumerable: true,configurable: true,});
curMemoryArea.oncommand_smart_getter = function oncommand() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncommand;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncommand !== undefined ? this._oncommand : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncommand_smart_getter);
HTMLElement.prototype.__defineGetter__("oncommand", curMemoryArea.oncommand_smart_getter);

// onscrollend
curMemoryArea.onscrollend_getter = function onscrollend() { return this._onscrollend; }; mframe.safefunction(curMemoryArea.onscrollend_getter);
Object.defineProperty(curMemoryArea.onscrollend_getter, "name", {value: "get onscrollend",configurable: true,});
// onscrollend
curMemoryArea.onscrollend_setter = function onscrollend(val) { this._onscrollend = val; }; mframe.safefunction(curMemoryArea.onscrollend_setter);
Object.defineProperty(curMemoryArea.onscrollend_setter, "name", {value: "set onscrollend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollend", {get: curMemoryArea.onscrollend_getter,set: curMemoryArea.onscrollend_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollend_smart_getter = function onscrollend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onscrollend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscrollend !== undefined ? this._onscrollend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscrollend_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollend", curMemoryArea.onscrollend_smart_getter);

// onscrollsnapchange
curMemoryArea.onscrollsnapchange_getter = function onscrollsnapchange() { return this._onscrollsnapchange; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_getter, "name", {value: "get onscrollsnapchange",configurable: true,});
// onscrollsnapchange
curMemoryArea.onscrollsnapchange_setter = function onscrollsnapchange(val) { this._onscrollsnapchange = val; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_setter, "name", {value: "set onscrollsnapchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollsnapchange", {get: curMemoryArea.onscrollsnapchange_getter,set: curMemoryArea.onscrollsnapchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollsnapchange_smart_getter = function onscrollsnapchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onscrollsnapchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscrollsnapchange !== undefined ? this._onscrollsnapchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscrollsnapchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollsnapchange", curMemoryArea.onscrollsnapchange_smart_getter);

// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_getter = function onscrollsnapchanging() { return this._onscrollsnapchanging; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_getter, "name", {value: "get onscrollsnapchanging",configurable: true,});
// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_setter = function onscrollsnapchanging(val) { this._onscrollsnapchanging = val; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_setter, "name", {value: "set onscrollsnapchanging",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollsnapchanging", {get: curMemoryArea.onscrollsnapchanging_getter,set: curMemoryArea.onscrollsnapchanging_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollsnapchanging_smart_getter = function onscrollsnapchanging() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onscrollsnapchanging;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscrollsnapchanging !== undefined ? this._onscrollsnapchanging : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscrollsnapchanging_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollsnapchanging", curMemoryArea.onscrollsnapchanging_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLElement.prototype["attachInternals"] = function attachInternals() { debugger; }; mframe.safefunction(HTMLElement.prototype["attachInternals"]);
HTMLElement.prototype["blur"] = function blur() { debugger; }; mframe.safefunction(HTMLElement.prototype["blur"]);
HTMLElement.prototype["click"] = function click() { debugger; }; mframe.safefunction(HTMLElement.prototype["click"]);
HTMLElement.prototype["focus"] = function focus() { debugger; }; mframe.safefunction(HTMLElement.prototype["focus"]);
HTMLElement.prototype["hidePopover"] = function hidePopover() { debugger; }; mframe.safefunction(HTMLElement.prototype["hidePopover"]);
HTMLElement.prototype["showPopover"] = function showPopover() { debugger; }; mframe.safefunction(HTMLElement.prototype["showPopover"]);
HTMLElement.prototype["togglePopover"] = function togglePopover() { debugger; }; mframe.safefunction(HTMLElement.prototype["togglePopover"]);
//==============↑↑Function END↑↑====================

//////////////////////////////////

HTMLElement.prototype.__proto__ = Element.prototype;
/**代理 */
HTMLElement = mframe.proxy(HTMLElement)
var HTMLAnchorElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLAnchorElement);

Object.defineProperties(HTMLAnchorElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLAnchorElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLAnchorElement = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// target
curMemoryArea.target_getter = function target() { return this._target; }; mframe.safefunction(curMemoryArea.target_getter);
Object.defineProperty(curMemoryArea.target_getter, "name", {value: "get target",configurable: true,});
// target
curMemoryArea.target_setter = function target(val) { this._target = val; }; mframe.safefunction(curMemoryArea.target_setter);
Object.defineProperty(curMemoryArea.target_setter, "name", {value: "set target",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "target", {get: curMemoryArea.target_getter,set: curMemoryArea.target_setter,enumerable: true,configurable: true,});
curMemoryArea.target_smart_getter = function target() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.target;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._target !== undefined ? this._target : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.target_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("target", curMemoryArea.target_smart_getter);

// download
curMemoryArea.download_getter = function download() { return this._download; }; mframe.safefunction(curMemoryArea.download_getter);
Object.defineProperty(curMemoryArea.download_getter, "name", {value: "get download",configurable: true,});
// download
curMemoryArea.download_setter = function download(val) { this._download = val; }; mframe.safefunction(curMemoryArea.download_setter);
Object.defineProperty(curMemoryArea.download_setter, "name", {value: "set download",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "download", {get: curMemoryArea.download_getter,set: curMemoryArea.download_setter,enumerable: true,configurable: true,});
curMemoryArea.download_smart_getter = function download() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.download;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._download !== undefined ? this._download : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.download_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("download", curMemoryArea.download_smart_getter);

// ping
curMemoryArea.ping_getter = function ping() { return this._ping; }; mframe.safefunction(curMemoryArea.ping_getter);
Object.defineProperty(curMemoryArea.ping_getter, "name", {value: "get ping",configurable: true,});
// ping
curMemoryArea.ping_setter = function ping(val) { this._ping = val; }; mframe.safefunction(curMemoryArea.ping_setter);
Object.defineProperty(curMemoryArea.ping_setter, "name", {value: "set ping",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "ping", {get: curMemoryArea.ping_getter,set: curMemoryArea.ping_setter,enumerable: true,configurable: true,});
curMemoryArea.ping_smart_getter = function ping() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ping;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ping !== undefined ? this._ping : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ping_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("ping", curMemoryArea.ping_smart_getter);

// rel
curMemoryArea.rel_getter = function rel() { return this._rel; }; mframe.safefunction(curMemoryArea.rel_getter);
Object.defineProperty(curMemoryArea.rel_getter, "name", {value: "get rel",configurable: true,});
// rel
curMemoryArea.rel_setter = function rel(val) { this._rel = val; }; mframe.safefunction(curMemoryArea.rel_setter);
Object.defineProperty(curMemoryArea.rel_setter, "name", {value: "set rel",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "rel", {get: curMemoryArea.rel_getter,set: curMemoryArea.rel_setter,enumerable: true,configurable: true,});
curMemoryArea.rel_smart_getter = function rel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.rel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._rel !== undefined ? this._rel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.rel_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("rel", curMemoryArea.rel_smart_getter);

// relList
curMemoryArea.relList_getter = function relList() { return this._relList; }; mframe.safefunction(curMemoryArea.relList_getter);
Object.defineProperty(curMemoryArea.relList_getter, "name", {value: "get relList",configurable: true,});
// relList
curMemoryArea.relList_setter = function relList(val) { this._relList = val; }; mframe.safefunction(curMemoryArea.relList_setter);
Object.defineProperty(curMemoryArea.relList_setter, "name", {value: "set relList",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "relList", {get: curMemoryArea.relList_getter,set: curMemoryArea.relList_setter,enumerable: true,configurable: true,});
curMemoryArea.relList_smart_getter = function relList() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.relList;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._relList !== undefined ? this._relList : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.relList_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("relList", curMemoryArea.relList_smart_getter);

// hreflang
curMemoryArea.hreflang_getter = function hreflang() { return this._hreflang; }; mframe.safefunction(curMemoryArea.hreflang_getter);
Object.defineProperty(curMemoryArea.hreflang_getter, "name", {value: "get hreflang",configurable: true,});
// hreflang
curMemoryArea.hreflang_setter = function hreflang(val) { this._hreflang = val; }; mframe.safefunction(curMemoryArea.hreflang_setter);
Object.defineProperty(curMemoryArea.hreflang_setter, "name", {value: "set hreflang",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hreflang", {get: curMemoryArea.hreflang_getter,set: curMemoryArea.hreflang_setter,enumerable: true,configurable: true,});
curMemoryArea.hreflang_smart_getter = function hreflang() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.hreflang;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._hreflang !== undefined ? this._hreflang : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.hreflang_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hreflang", curMemoryArea.hreflang_smart_getter);

// type
curMemoryArea.type_getter = function type() { return this._type; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", {value: "get type",configurable: true,});
// type
curMemoryArea.type_setter = function type(val) { this._type = val; }; mframe.safefunction(curMemoryArea.type_setter);
Object.defineProperty(curMemoryArea.type_setter, "name", {value: "set type",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "type", {get: curMemoryArea.type_getter,set: curMemoryArea.type_setter,enumerable: true,configurable: true,});
curMemoryArea.type_smart_getter = function type() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.type;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._type !== undefined ? this._type : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// referrerPolicy
curMemoryArea.referrerPolicy_getter = function referrerPolicy() { return this._referrerPolicy; }; mframe.safefunction(curMemoryArea.referrerPolicy_getter);
Object.defineProperty(curMemoryArea.referrerPolicy_getter, "name", {value: "get referrerPolicy",configurable: true,});
// referrerPolicy
curMemoryArea.referrerPolicy_setter = function referrerPolicy(val) { this._referrerPolicy = val; }; mframe.safefunction(curMemoryArea.referrerPolicy_setter);
Object.defineProperty(curMemoryArea.referrerPolicy_setter, "name", {value: "set referrerPolicy",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "referrerPolicy", {get: curMemoryArea.referrerPolicy_getter,set: curMemoryArea.referrerPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.referrerPolicy_smart_getter = function referrerPolicy() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.referrerPolicy;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._referrerPolicy !== undefined ? this._referrerPolicy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.referrerPolicy_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("referrerPolicy", curMemoryArea.referrerPolicy_smart_getter);

// text
curMemoryArea.text_getter = function text() { return this._text; }; mframe.safefunction(curMemoryArea.text_getter);
Object.defineProperty(curMemoryArea.text_getter, "name", {value: "get text",configurable: true,});
// text
curMemoryArea.text_setter = function text(val) { this._text = val; }; mframe.safefunction(curMemoryArea.text_setter);
Object.defineProperty(curMemoryArea.text_setter, "name", {value: "set text",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "text", {get: curMemoryArea.text_getter,set: curMemoryArea.text_setter,enumerable: true,configurable: true,});
curMemoryArea.text_smart_getter = function text() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.text;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._text !== undefined ? this._text : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.text_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("text", curMemoryArea.text_smart_getter);

// coords
curMemoryArea.coords_getter = function coords() { return this._coords; }; mframe.safefunction(curMemoryArea.coords_getter);
Object.defineProperty(curMemoryArea.coords_getter, "name", {value: "get coords",configurable: true,});
// coords
curMemoryArea.coords_setter = function coords(val) { this._coords = val; }; mframe.safefunction(curMemoryArea.coords_setter);
Object.defineProperty(curMemoryArea.coords_setter, "name", {value: "set coords",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "coords", {get: curMemoryArea.coords_getter,set: curMemoryArea.coords_setter,enumerable: true,configurable: true,});
curMemoryArea.coords_smart_getter = function coords() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.coords;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._coords !== undefined ? this._coords : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.coords_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("coords", curMemoryArea.coords_smart_getter);

// charset
curMemoryArea.charset_getter = function charset() { return this._charset; }; mframe.safefunction(curMemoryArea.charset_getter);
Object.defineProperty(curMemoryArea.charset_getter, "name", {value: "get charset",configurable: true,});
// charset
curMemoryArea.charset_setter = function charset(val) { this._charset = val; }; mframe.safefunction(curMemoryArea.charset_setter);
Object.defineProperty(curMemoryArea.charset_setter, "name", {value: "set charset",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "charset", {get: curMemoryArea.charset_getter,set: curMemoryArea.charset_setter,enumerable: true,configurable: true,});
curMemoryArea.charset_smart_getter = function charset() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.charset;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._charset !== undefined ? this._charset : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.charset_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("charset", curMemoryArea.charset_smart_getter);

// name
curMemoryArea.name_getter = function name() { return this._name; }; mframe.safefunction(curMemoryArea.name_getter);
Object.defineProperty(curMemoryArea.name_getter, "name", {value: "get name",configurable: true,});
// name
curMemoryArea.name_setter = function name(val) { this._name = val; }; mframe.safefunction(curMemoryArea.name_setter);
Object.defineProperty(curMemoryArea.name_setter, "name", {value: "set name",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "name", {get: curMemoryArea.name_getter,set: curMemoryArea.name_setter,enumerable: true,configurable: true,});
curMemoryArea.name_smart_getter = function name() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.name;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._name !== undefined ? this._name : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.name_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("name", curMemoryArea.name_smart_getter);

// rev
curMemoryArea.rev_getter = function rev() { return this._rev; }; mframe.safefunction(curMemoryArea.rev_getter);
Object.defineProperty(curMemoryArea.rev_getter, "name", {value: "get rev",configurable: true,});
// rev
curMemoryArea.rev_setter = function rev(val) { this._rev = val; }; mframe.safefunction(curMemoryArea.rev_setter);
Object.defineProperty(curMemoryArea.rev_setter, "name", {value: "set rev",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "rev", {get: curMemoryArea.rev_getter,set: curMemoryArea.rev_setter,enumerable: true,configurable: true,});
curMemoryArea.rev_smart_getter = function rev() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.rev;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._rev !== undefined ? this._rev : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.rev_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("rev", curMemoryArea.rev_smart_getter);

// shape
curMemoryArea.shape_getter = function shape() { return this._shape; }; mframe.safefunction(curMemoryArea.shape_getter);
Object.defineProperty(curMemoryArea.shape_getter, "name", {value: "get shape",configurable: true,});
// shape
curMemoryArea.shape_setter = function shape(val) { this._shape = val; }; mframe.safefunction(curMemoryArea.shape_setter);
Object.defineProperty(curMemoryArea.shape_setter, "name", {value: "set shape",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "shape", {get: curMemoryArea.shape_getter,set: curMemoryArea.shape_setter,enumerable: true,configurable: true,});
curMemoryArea.shape_smart_getter = function shape() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.shape;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._shape !== undefined ? this._shape : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.shape_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("shape", curMemoryArea.shape_smart_getter);

// origin
curMemoryArea.origin_getter = function origin() { return this._origin; }; mframe.safefunction(curMemoryArea.origin_getter);
Object.defineProperty(curMemoryArea.origin_getter, "name", {value: "get origin",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "origin", {get: curMemoryArea.origin_getter,enumerable: true,configurable: true,});
curMemoryArea.origin_smart_getter = function origin() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.origin;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._origin !== undefined ? this._origin : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.origin_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("origin", curMemoryArea.origin_smart_getter);

// protocol
curMemoryArea.protocol_getter = function protocol() { return this._protocol; }; mframe.safefunction(curMemoryArea.protocol_getter);
Object.defineProperty(curMemoryArea.protocol_getter, "name", {value: "get protocol",configurable: true,});
// protocol
curMemoryArea.protocol_setter = function protocol(val) { this._protocol = val; }; mframe.safefunction(curMemoryArea.protocol_setter);
Object.defineProperty(curMemoryArea.protocol_setter, "name", {value: "set protocol",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "protocol", {get: curMemoryArea.protocol_getter,set: curMemoryArea.protocol_setter,enumerable: true,configurable: true,});
curMemoryArea.protocol_smart_getter = function protocol() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.protocol;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._protocol !== undefined ? this._protocol : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.protocol_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("protocol", curMemoryArea.protocol_smart_getter);

// username
curMemoryArea.username_getter = function username() { return this._username; }; mframe.safefunction(curMemoryArea.username_getter);
Object.defineProperty(curMemoryArea.username_getter, "name", {value: "get username",configurable: true,});
// username
curMemoryArea.username_setter = function username(val) { this._username = val; }; mframe.safefunction(curMemoryArea.username_setter);
Object.defineProperty(curMemoryArea.username_setter, "name", {value: "set username",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "username", {get: curMemoryArea.username_getter,set: curMemoryArea.username_setter,enumerable: true,configurable: true,});
curMemoryArea.username_smart_getter = function username() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.username;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._username !== undefined ? this._username : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.username_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("username", curMemoryArea.username_smart_getter);

// password
curMemoryArea.password_getter = function password() { return this._password; }; mframe.safefunction(curMemoryArea.password_getter);
Object.defineProperty(curMemoryArea.password_getter, "name", {value: "get password",configurable: true,});
// password
curMemoryArea.password_setter = function password(val) { this._password = val; }; mframe.safefunction(curMemoryArea.password_setter);
Object.defineProperty(curMemoryArea.password_setter, "name", {value: "set password",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "password", {get: curMemoryArea.password_getter,set: curMemoryArea.password_setter,enumerable: true,configurable: true,});
curMemoryArea.password_smart_getter = function password() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.password;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._password !== undefined ? this._password : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.password_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("password", curMemoryArea.password_smart_getter);

// host
curMemoryArea.host_getter = function host() { return this._host; }; mframe.safefunction(curMemoryArea.host_getter);
Object.defineProperty(curMemoryArea.host_getter, "name", {value: "get host",configurable: true,});
// host
curMemoryArea.host_setter = function host(val) { this._host = val; }; mframe.safefunction(curMemoryArea.host_setter);
Object.defineProperty(curMemoryArea.host_setter, "name", {value: "set host",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "host", {get: curMemoryArea.host_getter,set: curMemoryArea.host_setter,enumerable: true,configurable: true,});
curMemoryArea.host_smart_getter = function host() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.host;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._host !== undefined ? this._host : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.host_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("host", curMemoryArea.host_smart_getter);

// hostname
curMemoryArea.hostname_getter = function hostname() { return this._hostname; }; mframe.safefunction(curMemoryArea.hostname_getter);
Object.defineProperty(curMemoryArea.hostname_getter, "name", {value: "get hostname",configurable: true,});
// hostname
curMemoryArea.hostname_setter = function hostname(val) { this._hostname = val; }; mframe.safefunction(curMemoryArea.hostname_setter);
Object.defineProperty(curMemoryArea.hostname_setter, "name", {value: "set hostname",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hostname", {get: curMemoryArea.hostname_getter,set: curMemoryArea.hostname_setter,enumerable: true,configurable: true,});
curMemoryArea.hostname_smart_getter = function hostname() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.hostname;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._hostname !== undefined ? this._hostname : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.hostname_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hostname", curMemoryArea.hostname_smart_getter);

// port
curMemoryArea.port_getter = function port() { return this._port; }; mframe.safefunction(curMemoryArea.port_getter);
Object.defineProperty(curMemoryArea.port_getter, "name", {value: "get port",configurable: true,});
// port
curMemoryArea.port_setter = function port(val) { this._port = val; }; mframe.safefunction(curMemoryArea.port_setter);
Object.defineProperty(curMemoryArea.port_setter, "name", {value: "set port",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "port", {get: curMemoryArea.port_getter,set: curMemoryArea.port_setter,enumerable: true,configurable: true,});
curMemoryArea.port_smart_getter = function port() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.port;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._port !== undefined ? this._port : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.port_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("port", curMemoryArea.port_smart_getter);

// pathname
curMemoryArea.pathname_getter = function pathname() { return this._pathname; }; mframe.safefunction(curMemoryArea.pathname_getter);
Object.defineProperty(curMemoryArea.pathname_getter, "name", {value: "get pathname",configurable: true,});
// pathname
curMemoryArea.pathname_setter = function pathname(val) { this._pathname = val; }; mframe.safefunction(curMemoryArea.pathname_setter);
Object.defineProperty(curMemoryArea.pathname_setter, "name", {value: "set pathname",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "pathname", {get: curMemoryArea.pathname_getter,set: curMemoryArea.pathname_setter,enumerable: true,configurable: true,});
curMemoryArea.pathname_smart_getter = function pathname() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.pathname;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._pathname !== undefined ? this._pathname : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.pathname_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("pathname", curMemoryArea.pathname_smart_getter);

// search
curMemoryArea.search_getter = function search() { return this._search; }; mframe.safefunction(curMemoryArea.search_getter);
Object.defineProperty(curMemoryArea.search_getter, "name", {value: "get search",configurable: true,});
// search
curMemoryArea.search_setter = function search(val) { this._search = val; }; mframe.safefunction(curMemoryArea.search_setter);
Object.defineProperty(curMemoryArea.search_setter, "name", {value: "set search",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "search", {get: curMemoryArea.search_getter,set: curMemoryArea.search_setter,enumerable: true,configurable: true,});
curMemoryArea.search_smart_getter = function search() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.search;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._search !== undefined ? this._search : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.search_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("search", curMemoryArea.search_smart_getter);

// hash
curMemoryArea.hash_getter = function hash() { return this._hash; }; mframe.safefunction(curMemoryArea.hash_getter);
Object.defineProperty(curMemoryArea.hash_getter, "name", {value: "get hash",configurable: true,});
// hash
curMemoryArea.hash_setter = function hash(val) { this._hash = val; }; mframe.safefunction(curMemoryArea.hash_setter);
Object.defineProperty(curMemoryArea.hash_setter, "name", {value: "set hash",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hash", {get: curMemoryArea.hash_getter,set: curMemoryArea.hash_setter,enumerable: true,configurable: true,});
curMemoryArea.hash_smart_getter = function hash() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.hash;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._hash !== undefined ? this._hash : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.hash_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hash", curMemoryArea.hash_smart_getter);

// href
curMemoryArea.href_getter = function href() { return this._href; }; mframe.safefunction(curMemoryArea.href_getter);
Object.defineProperty(curMemoryArea.href_getter, "name", {value: "get href",configurable: true,});
// href
curMemoryArea.href_setter = function href(val) { this._href = val; }; mframe.safefunction(curMemoryArea.href_setter);
Object.defineProperty(curMemoryArea.href_setter, "name", {value: "set href",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "href", {get: curMemoryArea.href_getter,set: curMemoryArea.href_setter,enumerable: true,configurable: true,});
curMemoryArea.href_smart_getter = function href() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.href;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._href !== undefined ? this._href : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.href_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("href", curMemoryArea.href_smart_getter);

// hrefTranslate
curMemoryArea.hrefTranslate_getter = function hrefTranslate() { return this._hrefTranslate; }; mframe.safefunction(curMemoryArea.hrefTranslate_getter);
Object.defineProperty(curMemoryArea.hrefTranslate_getter, "name", {value: "get hrefTranslate",configurable: true,});
// hrefTranslate
curMemoryArea.hrefTranslate_setter = function hrefTranslate(val) { this._hrefTranslate = val; }; mframe.safefunction(curMemoryArea.hrefTranslate_setter);
Object.defineProperty(curMemoryArea.hrefTranslate_setter, "name", {value: "set hrefTranslate",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hrefTranslate", {get: curMemoryArea.hrefTranslate_getter,set: curMemoryArea.hrefTranslate_setter,enumerable: true,configurable: true,});
curMemoryArea.hrefTranslate_smart_getter = function hrefTranslate() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.hrefTranslate;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._hrefTranslate !== undefined ? this._hrefTranslate : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.hrefTranslate_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hrefTranslate", curMemoryArea.hrefTranslate_smart_getter);

// attributionSrc
curMemoryArea.attributionSrc_getter = function attributionSrc() { return this._attributionSrc; }; mframe.safefunction(curMemoryArea.attributionSrc_getter);
Object.defineProperty(curMemoryArea.attributionSrc_getter, "name", {value: "get attributionSrc",configurable: true,});
// attributionSrc
curMemoryArea.attributionSrc_setter = function attributionSrc(val) { this._attributionSrc = val; }; mframe.safefunction(curMemoryArea.attributionSrc_setter);
Object.defineProperty(curMemoryArea.attributionSrc_setter, "name", {value: "set attributionSrc",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "attributionSrc", {get: curMemoryArea.attributionSrc_getter,set: curMemoryArea.attributionSrc_setter,enumerable: true,configurable: true,});
curMemoryArea.attributionSrc_smart_getter = function attributionSrc() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.attributionSrc;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._attributionSrc !== undefined ? this._attributionSrc : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.attributionSrc_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("attributionSrc", curMemoryArea.attributionSrc_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLAnchorElement.prototype["toString"] = function toString() { debugger; }; mframe.safefunction(HTMLAnchorElement.prototype["toString"]);
//==============↑↑Function END↑↑====================

///////////////////////////////////////////////////////////

HTMLAnchorElement.__proto__ = HTMLElement;
HTMLAnchorElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['a'] = function () {
    var a = new (function () { });
    a.__proto__ = HTMLAnchorElement.prototype;

    return a;
}
var HTMLMetaElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLMetaElement);

Object.defineProperties(HTMLMetaElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLMetaElement",
        configurable: true,
    }
});
//////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLMetaElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLMetaElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLMetaElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// name
curMemoryArea.name_getter = function name() { return this._name; }; mframe.safefunction(curMemoryArea.name_getter);
Object.defineProperty(curMemoryArea.name_getter, "name", {value: "get name",configurable: true,});
// name
curMemoryArea.name_setter = function name(val) { this._name = val; }; mframe.safefunction(curMemoryArea.name_setter);
Object.defineProperty(curMemoryArea.name_setter, "name", {value: "set name",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "name", {get: curMemoryArea.name_getter,set: curMemoryArea.name_setter,enumerable: true,configurable: true,});
curMemoryArea.name_smart_getter = function name() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.name;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._name !== undefined ? this._name : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.name_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("name", curMemoryArea.name_smart_getter);

// httpEquiv
curMemoryArea.httpEquiv_getter = function httpEquiv() { return this._httpEquiv; }; mframe.safefunction(curMemoryArea.httpEquiv_getter);
Object.defineProperty(curMemoryArea.httpEquiv_getter, "name", {value: "get httpEquiv",configurable: true,});
// httpEquiv
curMemoryArea.httpEquiv_setter = function httpEquiv(val) { this._httpEquiv = val; }; mframe.safefunction(curMemoryArea.httpEquiv_setter);
Object.defineProperty(curMemoryArea.httpEquiv_setter, "name", {value: "set httpEquiv",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "httpEquiv", {get: curMemoryArea.httpEquiv_getter,set: curMemoryArea.httpEquiv_setter,enumerable: true,configurable: true,});
curMemoryArea.httpEquiv_smart_getter = function httpEquiv() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.httpEquiv;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._httpEquiv !== undefined ? this._httpEquiv : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.httpEquiv_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("httpEquiv", curMemoryArea.httpEquiv_smart_getter);

// content
curMemoryArea.content_getter = function content() { return this._content; }; mframe.safefunction(curMemoryArea.content_getter);
Object.defineProperty(curMemoryArea.content_getter, "name", {value: "get content",configurable: true,});
// content
curMemoryArea.content_setter = function content(val) { this._content = val; }; mframe.safefunction(curMemoryArea.content_setter);
Object.defineProperty(curMemoryArea.content_setter, "name", {value: "set content",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "content", {get: curMemoryArea.content_getter,set: curMemoryArea.content_setter,enumerable: true,configurable: true,});
curMemoryArea.content_smart_getter = function content() {
    if(mframe.memory.jsdom.document) {
        console.log(`Meta content: ${this.jsdomMemory.content}`);
        return this.jsdomMemory.content;
    }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._content !== undefined ? this._content : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.content_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("content", curMemoryArea.content_smart_getter);

// media
curMemoryArea.media_getter = function media() { return this._media; }; mframe.safefunction(curMemoryArea.media_getter);
Object.defineProperty(curMemoryArea.media_getter, "name", {value: "get media",configurable: true,});
// media
curMemoryArea.media_setter = function media(val) { this._media = val; }; mframe.safefunction(curMemoryArea.media_setter);
Object.defineProperty(curMemoryArea.media_setter, "name", {value: "set media",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "media", {get: curMemoryArea.media_getter,set: curMemoryArea.media_setter,enumerable: true,configurable: true,});
curMemoryArea.media_smart_getter = function media() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.media;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._media !== undefined ? this._media : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.media_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("media", curMemoryArea.media_smart_getter);

// scheme
curMemoryArea.scheme_getter = function scheme() { return this._scheme; }; mframe.safefunction(curMemoryArea.scheme_getter);
Object.defineProperty(curMemoryArea.scheme_getter, "name", {value: "get scheme",configurable: true,});
// scheme
curMemoryArea.scheme_setter = function scheme(val) { this._scheme = val; }; mframe.safefunction(curMemoryArea.scheme_setter);
Object.defineProperty(curMemoryArea.scheme_setter, "name", {value: "set scheme",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "scheme", {get: curMemoryArea.scheme_getter,set: curMemoryArea.scheme_setter,enumerable: true,configurable: true,});
curMemoryArea.scheme_smart_getter = function scheme() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.scheme;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scheme !== undefined ? this._scheme : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scheme_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("scheme", curMemoryArea.scheme_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////////////////////////

HTMLMetaElement.__proto__ = HTMLElement;
HTMLMetaElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['meta'] = function () {
    var meta = new (function () { }); // new一个假的,通过换原型,换为HTMLMetaElement去实现
    meta.__proto__ = HTMLMetaElement.prototype;
    //////////{HTMLMetaElement特有的 属性/方法}//////////////

    //////////////////////////////////////////////////////
    return meta;
}
var HTMLDivElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLDivElement);

Object.defineProperties(HTMLDivElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDivElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLDivElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLDivElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLDivElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// align
curMemoryArea.align_getter = function align() { return this._align; }; mframe.safefunction(curMemoryArea.align_getter);
Object.defineProperty(curMemoryArea.align_getter, "name", {value: "get align",configurable: true,});
// align
curMemoryArea.align_setter = function align(val) { this._align = val; }; mframe.safefunction(curMemoryArea.align_setter);
Object.defineProperty(curMemoryArea.align_setter, "name", {value: "set align",configurable: true,});
Object.defineProperty(HTMLDivElement.prototype, "align", {get: curMemoryArea.align_getter,set: curMemoryArea.align_setter,enumerable: true,configurable: true,});
curMemoryArea.align_smart_getter = function align() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.align;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._align !== undefined ? this._align : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.align_smart_getter);
HTMLDivElement.prototype.__defineGetter__("align", curMemoryArea.align_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////


HTMLDivElement.__proto__ = HTMLElement;
HTMLDivElement.prototype.__proto__ = HTMLElement.prototype;

// 如果调用 mframe.memory.htmlelements['div'], 就返回 HTMLDivElement
mframe.memory.htmlelements['div'] = function () {
    var div = new (function () { }); // new一个假的,通过换原型,换为HTMLDivElement去实现
    div.__proto__ = HTMLDivElement.prototype;
    return div;
}
var HTMLScriptElement = function () {
    debugger;
    throw new TypeError('HTMLScriptElement 不允许被new')
}; mframe.safefunction(HTMLScriptElement);

Object.defineProperties(HTMLScriptElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLScriptElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLScriptElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLScriptElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLScriptElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// src
curMemoryArea.src_getter = function src() { return this._src; }; mframe.safefunction(curMemoryArea.src_getter);
Object.defineProperty(curMemoryArea.src_getter, "name", {value: "get src",configurable: true,});
// src
curMemoryArea.src_setter = function src(val) { this._src = val; }; mframe.safefunction(curMemoryArea.src_setter);
Object.defineProperty(curMemoryArea.src_setter, "name", {value: "set src",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "src", {get: curMemoryArea.src_getter,set: curMemoryArea.src_setter,enumerable: true,configurable: true,});
curMemoryArea.src_smart_getter = function src() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.src;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._src !== undefined ? this._src : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.src_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("src", curMemoryArea.src_smart_getter);

// type
curMemoryArea.type_getter = function type() { return this._type; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", {value: "get type",configurable: true,});
// type
curMemoryArea.type_setter = function type(val) { this._type = val; }; mframe.safefunction(curMemoryArea.type_setter);
Object.defineProperty(curMemoryArea.type_setter, "name", {value: "set type",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "type", {get: curMemoryArea.type_getter,set: curMemoryArea.type_setter,enumerable: true,configurable: true,});
curMemoryArea.type_smart_getter = function type() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.type;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._type !== undefined ? this._type : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// noModule
curMemoryArea.noModule_getter = function noModule() { return this._noModule; }; mframe.safefunction(curMemoryArea.noModule_getter);
Object.defineProperty(curMemoryArea.noModule_getter, "name", {value: "get noModule",configurable: true,});
// noModule
curMemoryArea.noModule_setter = function noModule(val) { this._noModule = val; }; mframe.safefunction(curMemoryArea.noModule_setter);
Object.defineProperty(curMemoryArea.noModule_setter, "name", {value: "set noModule",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "noModule", {get: curMemoryArea.noModule_getter,set: curMemoryArea.noModule_setter,enumerable: true,configurable: true,});
curMemoryArea.noModule_smart_getter = function noModule() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.noModule;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._noModule !== undefined ? this._noModule : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.noModule_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("noModule", curMemoryArea.noModule_smart_getter);

// charset
curMemoryArea.charset_getter = function charset() { return this._charset; }; mframe.safefunction(curMemoryArea.charset_getter);
Object.defineProperty(curMemoryArea.charset_getter, "name", {value: "get charset",configurable: true,});
// charset
curMemoryArea.charset_setter = function charset(val) { this._charset = val; }; mframe.safefunction(curMemoryArea.charset_setter);
Object.defineProperty(curMemoryArea.charset_setter, "name", {value: "set charset",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "charset", {get: curMemoryArea.charset_getter,set: curMemoryArea.charset_setter,enumerable: true,configurable: true,});
curMemoryArea.charset_smart_getter = function charset() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.charset;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._charset !== undefined ? this._charset : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.charset_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("charset", curMemoryArea.charset_smart_getter);

// async
curMemoryArea.async_getter = function async() { return this._async; }; mframe.safefunction(curMemoryArea.async_getter);
Object.defineProperty(curMemoryArea.async_getter, "name", {value: "get async",configurable: true,});
// async
curMemoryArea.async_setter = function async(val) { this._async = val; }; mframe.safefunction(curMemoryArea.async_setter);
Object.defineProperty(curMemoryArea.async_setter, "name", {value: "set async",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "async", {get: curMemoryArea.async_getter,set: curMemoryArea.async_setter,enumerable: true,configurable: true,});
curMemoryArea.async_smart_getter = function async() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.async;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._async !== undefined ? this._async : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.async_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("async", curMemoryArea.async_smart_getter);

// defer
curMemoryArea.defer_getter = function defer() { return this._defer; }; mframe.safefunction(curMemoryArea.defer_getter);
Object.defineProperty(curMemoryArea.defer_getter, "name", {value: "get defer",configurable: true,});
// defer
curMemoryArea.defer_setter = function defer(val) { this._defer = val; }; mframe.safefunction(curMemoryArea.defer_setter);
Object.defineProperty(curMemoryArea.defer_setter, "name", {value: "set defer",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "defer", {get: curMemoryArea.defer_getter,set: curMemoryArea.defer_setter,enumerable: true,configurable: true,});
curMemoryArea.defer_smart_getter = function defer() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.defer;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._defer !== undefined ? this._defer : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.defer_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("defer", curMemoryArea.defer_smart_getter);

// crossOrigin
curMemoryArea.crossOrigin_getter = function crossOrigin() { return this._crossOrigin; }; mframe.safefunction(curMemoryArea.crossOrigin_getter);
Object.defineProperty(curMemoryArea.crossOrigin_getter, "name", {value: "get crossOrigin",configurable: true,});
// crossOrigin
curMemoryArea.crossOrigin_setter = function crossOrigin(val) { this._crossOrigin = val; }; mframe.safefunction(curMemoryArea.crossOrigin_setter);
Object.defineProperty(curMemoryArea.crossOrigin_setter, "name", {value: "set crossOrigin",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "crossOrigin", {get: curMemoryArea.crossOrigin_getter,set: curMemoryArea.crossOrigin_setter,enumerable: true,configurable: true,});
curMemoryArea.crossOrigin_smart_getter = function crossOrigin() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.crossOrigin;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._crossOrigin !== undefined ? this._crossOrigin : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.crossOrigin_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("crossOrigin", curMemoryArea.crossOrigin_smart_getter);

// text
curMemoryArea.text_getter = function text() { return this._text; }; mframe.safefunction(curMemoryArea.text_getter);
Object.defineProperty(curMemoryArea.text_getter, "name", {value: "get text",configurable: true,});
// text
curMemoryArea.text_setter = function text(val) { this._text = val; }; mframe.safefunction(curMemoryArea.text_setter);
Object.defineProperty(curMemoryArea.text_setter, "name", {value: "set text",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "text", {get: curMemoryArea.text_getter,set: curMemoryArea.text_setter,enumerable: true,configurable: true,});
curMemoryArea.text_smart_getter = function text() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.text;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._text !== undefined ? this._text : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.text_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("text", curMemoryArea.text_smart_getter);

// referrerPolicy
curMemoryArea.referrerPolicy_getter = function referrerPolicy() { return this._referrerPolicy; }; mframe.safefunction(curMemoryArea.referrerPolicy_getter);
Object.defineProperty(curMemoryArea.referrerPolicy_getter, "name", {value: "get referrerPolicy",configurable: true,});
// referrerPolicy
curMemoryArea.referrerPolicy_setter = function referrerPolicy(val) { this._referrerPolicy = val; }; mframe.safefunction(curMemoryArea.referrerPolicy_setter);
Object.defineProperty(curMemoryArea.referrerPolicy_setter, "name", {value: "set referrerPolicy",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "referrerPolicy", {get: curMemoryArea.referrerPolicy_getter,set: curMemoryArea.referrerPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.referrerPolicy_smart_getter = function referrerPolicy() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.referrerPolicy;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._referrerPolicy !== undefined ? this._referrerPolicy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.referrerPolicy_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("referrerPolicy", curMemoryArea.referrerPolicy_smart_getter);

// fetchPriority
curMemoryArea.fetchPriority_getter = function fetchPriority() { return this._fetchPriority; }; mframe.safefunction(curMemoryArea.fetchPriority_getter);
Object.defineProperty(curMemoryArea.fetchPriority_getter, "name", {value: "get fetchPriority",configurable: true,});
// fetchPriority
curMemoryArea.fetchPriority_setter = function fetchPriority(val) { this._fetchPriority = val; }; mframe.safefunction(curMemoryArea.fetchPriority_setter);
Object.defineProperty(curMemoryArea.fetchPriority_setter, "name", {value: "set fetchPriority",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "fetchPriority", {get: curMemoryArea.fetchPriority_getter,set: curMemoryArea.fetchPriority_setter,enumerable: true,configurable: true,});
curMemoryArea.fetchPriority_smart_getter = function fetchPriority() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.fetchPriority;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._fetchPriority !== undefined ? this._fetchPriority : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.fetchPriority_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("fetchPriority", curMemoryArea.fetchPriority_smart_getter);

// event
curMemoryArea.event_getter = function event() { return this._event; }; mframe.safefunction(curMemoryArea.event_getter);
Object.defineProperty(curMemoryArea.event_getter, "name", {value: "get event",configurable: true,});
// event
curMemoryArea.event_setter = function event(val) { this._event = val; }; mframe.safefunction(curMemoryArea.event_setter);
Object.defineProperty(curMemoryArea.event_setter, "name", {value: "set event",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "event", {get: curMemoryArea.event_getter,set: curMemoryArea.event_setter,enumerable: true,configurable: true,});
curMemoryArea.event_smart_getter = function event() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.event;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._event !== undefined ? this._event : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.event_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("event", curMemoryArea.event_smart_getter);

// htmlFor
curMemoryArea.htmlFor_getter = function htmlFor() { return this._htmlFor; }; mframe.safefunction(curMemoryArea.htmlFor_getter);
Object.defineProperty(curMemoryArea.htmlFor_getter, "name", {value: "get htmlFor",configurable: true,});
// htmlFor
curMemoryArea.htmlFor_setter = function htmlFor(val) { this._htmlFor = val; }; mframe.safefunction(curMemoryArea.htmlFor_setter);
Object.defineProperty(curMemoryArea.htmlFor_setter, "name", {value: "set htmlFor",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "htmlFor", {get: curMemoryArea.htmlFor_getter,set: curMemoryArea.htmlFor_setter,enumerable: true,configurable: true,});
curMemoryArea.htmlFor_smart_getter = function htmlFor() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.htmlFor;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._htmlFor !== undefined ? this._htmlFor : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.htmlFor_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("htmlFor", curMemoryArea.htmlFor_smart_getter);

// integrity
curMemoryArea.integrity_getter = function integrity() { return this._integrity; }; mframe.safefunction(curMemoryArea.integrity_getter);
Object.defineProperty(curMemoryArea.integrity_getter, "name", {value: "get integrity",configurable: true,});
// integrity
curMemoryArea.integrity_setter = function integrity(val) { this._integrity = val; }; mframe.safefunction(curMemoryArea.integrity_setter);
Object.defineProperty(curMemoryArea.integrity_setter, "name", {value: "set integrity",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "integrity", {get: curMemoryArea.integrity_getter,set: curMemoryArea.integrity_setter,enumerable: true,configurable: true,});
curMemoryArea.integrity_smart_getter = function integrity() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.integrity;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._integrity !== undefined ? this._integrity : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.integrity_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("integrity", curMemoryArea.integrity_smart_getter);

// blocking
curMemoryArea.blocking_getter = function blocking() { return this._blocking; }; mframe.safefunction(curMemoryArea.blocking_getter);
Object.defineProperty(curMemoryArea.blocking_getter, "name", {value: "get blocking",configurable: true,});
// blocking
curMemoryArea.blocking_setter = function blocking(val) { this._blocking = val; }; mframe.safefunction(curMemoryArea.blocking_setter);
Object.defineProperty(curMemoryArea.blocking_setter, "name", {value: "set blocking",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "blocking", {get: curMemoryArea.blocking_getter,set: curMemoryArea.blocking_setter,enumerable: true,configurable: true,});
curMemoryArea.blocking_smart_getter = function blocking() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.blocking;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._blocking !== undefined ? this._blocking : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.blocking_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("blocking", curMemoryArea.blocking_smart_getter);

// attributionSrc
curMemoryArea.attributionSrc_getter = function attributionSrc() { return this._attributionSrc; }; mframe.safefunction(curMemoryArea.attributionSrc_getter);
Object.defineProperty(curMemoryArea.attributionSrc_getter, "name", {value: "get attributionSrc",configurable: true,});
// attributionSrc
curMemoryArea.attributionSrc_setter = function attributionSrc(val) { this._attributionSrc = val; }; mframe.safefunction(curMemoryArea.attributionSrc_setter);
Object.defineProperty(curMemoryArea.attributionSrc_setter, "name", {value: "set attributionSrc",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "attributionSrc", {get: curMemoryArea.attributionSrc_getter,set: curMemoryArea.attributionSrc_setter,enumerable: true,configurable: true,});
curMemoryArea.attributionSrc_smart_getter = function attributionSrc() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.attributionSrc;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._attributionSrc !== undefined ? this._attributionSrc : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.attributionSrc_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("attributionSrc", curMemoryArea.attributionSrc_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================

///////////////////////////////////////////////////

HTMLScriptElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['script'] = function () {
    var script = new (function () { });
    script.__proto__ = HTMLScriptElement.prototype;

    //////////{HTMLScriptElement 特有的 属性/方法}//////////////
    // 无,都是从父类继承的
    /////////////////////////////////////////////////////
    return script;
}
var HTMLCanvasElement = function () {
    debugger;
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLCanvasElement);

Object.defineProperties(HTMLCanvasElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLCanvasElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLCanvasElement = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// width
curMemoryArea.width_getter = function width() { debugger; }; mframe.safefunction(curMemoryArea.width_getter);
Object.defineProperty(curMemoryArea.width_getter, "name", { value: "get width", configurable: true, });
// width
curMemoryArea.width_setter = function width(val) { debugger; }; mframe.safefunction(curMemoryArea.width_setter);
Object.defineProperty(curMemoryArea.width_setter, "name", { value: "set width", configurable: true, });
Object.defineProperty(HTMLCanvasElement.prototype, "width", { get: curMemoryArea.width_getter, set: curMemoryArea.width_setter, enumerable: true, configurable: true, });
curMemoryArea.width_smart_getter = function width() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLCanvasElement"中的width的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.width_smart_getter);
HTMLCanvasElement.prototype.__defineGetter__("width", curMemoryArea.width_smart_getter);

// height
curMemoryArea.height_getter = function height() { debugger; }; mframe.safefunction(curMemoryArea.height_getter);
Object.defineProperty(curMemoryArea.height_getter, "name", { value: "get height", configurable: true, });
// height
curMemoryArea.height_setter = function height(val) { debugger; }; mframe.safefunction(curMemoryArea.height_setter);
Object.defineProperty(curMemoryArea.height_setter, "name", { value: "set height", configurable: true, });
Object.defineProperty(HTMLCanvasElement.prototype, "height", { get: curMemoryArea.height_getter, set: curMemoryArea.height_setter, enumerable: true, configurable: true, });
curMemoryArea.height_smart_getter = function height() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLCanvasElement"中的height的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.height_smart_getter);
HTMLCanvasElement.prototype.__defineGetter__("height", curMemoryArea.height_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
HTMLCanvasElement.prototype["captureStream"] = function captureStream() { debugger; }; mframe.safefunction(HTMLCanvasElement.prototype["captureStream"]);
HTMLCanvasElement.prototype["getContext"] = function getContext(contextType, contextAttributes) {
    console.log("HTMLCanvasElement:",this.jsdomMemory);
    console.log("HTMLCanvasElement: getContext",this.jsdomMemory.getContext);
    return this.jsdomMemory.getContext(contextType,contextAttributes)

}; mframe.safefunction(HTMLCanvasElement.prototype["getContext"]);
HTMLCanvasElement.prototype["toBlob"] = function toBlob() { debugger; }; mframe.safefunction(HTMLCanvasElement.prototype["toBlob"]);
HTMLCanvasElement.prototype["toDataURL"] = function toDataURL() { debugger; }; mframe.safefunction(HTMLCanvasElement.prototype["toDataURL"]);
HTMLCanvasElement.prototype["transferControlToOffscreen"] = function transferControlToOffscreen() { debugger; }; mframe.safefunction(HTMLCanvasElement.prototype["transferControlToOffscreen"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////
HTMLCanvasElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['canvas'] = function () {
    var canvas = new (function () { });
    canvas.__proto__ = HTMLCanvasElement.prototype;

    //////////{HTMLCanvasElement 特有的 属性/方法}//////////////

    /////////////////////////////////////////////////////
    return canvas;
}
var HTMLHeadElement = function () {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(HTMLHeadElement);

Object.defineProperties(HTMLHeadElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHeadElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////
HTMLHeadElement.__proto__ = HTMLElement;
HTMLHeadElement.prototype.__proto__ = HTMLElement.prototype;


mframe.memory.htmlelements['head'] = function () {
    var head = new (function () { });
    head.__proto__ = HTMLHeadElement.prototype;

    //////////{HTMLHeadElement 特有的 属性/方法}//////////////

    /////////////////////////////////////////////////////
    return head;
}
var HTMLBodyElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLBodyElement);

Object.defineProperties(HTMLBodyElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLBodyElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLBodyElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLBodyElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLBodyElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// text
curMemoryArea.text_getter = function text() { return this._text; }; mframe.safefunction(curMemoryArea.text_getter);
Object.defineProperty(curMemoryArea.text_getter, "name", { value: "get text", configurable: true, });
// text
curMemoryArea.text_setter = function text(val) { this._text = val; }; mframe.safefunction(curMemoryArea.text_setter);
Object.defineProperty(curMemoryArea.text_setter, "name", { value: "set text", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "text", { get: curMemoryArea.text_getter, set: curMemoryArea.text_setter, enumerable: true, configurable: true, });
curMemoryArea.text_smart_getter = function text() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._text !== undefined ? this._text : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.text_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("text", curMemoryArea.text_smart_getter);

// link
curMemoryArea.link_getter = function link() { return this._link; }; mframe.safefunction(curMemoryArea.link_getter);
Object.defineProperty(curMemoryArea.link_getter, "name", { value: "get link", configurable: true, });
// link
curMemoryArea.link_setter = function link(val) { this._link = val; }; mframe.safefunction(curMemoryArea.link_setter);
Object.defineProperty(curMemoryArea.link_setter, "name", { value: "set link", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "link", { get: curMemoryArea.link_getter, set: curMemoryArea.link_setter, enumerable: true, configurable: true, });
curMemoryArea.link_smart_getter = function link() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._link !== undefined ? this._link : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.link_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("link", curMemoryArea.link_smart_getter);

// vLink
curMemoryArea.vLink_getter = function vLink() { return this._vLink; }; mframe.safefunction(curMemoryArea.vLink_getter);
Object.defineProperty(curMemoryArea.vLink_getter, "name", { value: "get vLink", configurable: true, });
// vLink
curMemoryArea.vLink_setter = function vLink(val) { this._vLink = val; }; mframe.safefunction(curMemoryArea.vLink_setter);
Object.defineProperty(curMemoryArea.vLink_setter, "name", { value: "set vLink", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "vLink", { get: curMemoryArea.vLink_getter, set: curMemoryArea.vLink_setter, enumerable: true, configurable: true, });
curMemoryArea.vLink_smart_getter = function vLink() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._vLink !== undefined ? this._vLink : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.vLink_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("vLink", curMemoryArea.vLink_smart_getter);

// aLink
curMemoryArea.aLink_getter = function aLink() { return this._aLink; }; mframe.safefunction(curMemoryArea.aLink_getter);
Object.defineProperty(curMemoryArea.aLink_getter, "name", { value: "get aLink", configurable: true, });
// aLink
curMemoryArea.aLink_setter = function aLink(val) { this._aLink = val; }; mframe.safefunction(curMemoryArea.aLink_setter);
Object.defineProperty(curMemoryArea.aLink_setter, "name", { value: "set aLink", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "aLink", { get: curMemoryArea.aLink_getter, set: curMemoryArea.aLink_setter, enumerable: true, configurable: true, });
curMemoryArea.aLink_smart_getter = function aLink() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._aLink !== undefined ? this._aLink : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.aLink_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("aLink", curMemoryArea.aLink_smart_getter);

// bgColor
curMemoryArea.bgColor_getter = function bgColor() { return this._bgColor; }; mframe.safefunction(curMemoryArea.bgColor_getter);
Object.defineProperty(curMemoryArea.bgColor_getter, "name", { value: "get bgColor", configurable: true, });
// bgColor
curMemoryArea.bgColor_setter = function bgColor(val) { this._bgColor = val; }; mframe.safefunction(curMemoryArea.bgColor_setter);
Object.defineProperty(curMemoryArea.bgColor_setter, "name", { value: "set bgColor", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "bgColor", { get: curMemoryArea.bgColor_getter, set: curMemoryArea.bgColor_setter, enumerable: true, configurable: true, });
curMemoryArea.bgColor_smart_getter = function bgColor() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._bgColor !== undefined ? this._bgColor : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.bgColor_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("bgColor", curMemoryArea.bgColor_smart_getter);

// background
curMemoryArea.background_getter = function background() { return this._background; }; mframe.safefunction(curMemoryArea.background_getter);
Object.defineProperty(curMemoryArea.background_getter, "name", { value: "get background", configurable: true, });
// background
curMemoryArea.background_setter = function background(val) { this._background = val; }; mframe.safefunction(curMemoryArea.background_setter);
Object.defineProperty(curMemoryArea.background_setter, "name", { value: "set background", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "background", { get: curMemoryArea.background_getter, set: curMemoryArea.background_setter, enumerable: true, configurable: true, });
curMemoryArea.background_smart_getter = function background() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._background !== undefined ? this._background : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.background_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("background", curMemoryArea.background_smart_getter);

// onblur
curMemoryArea.onblur_getter = function onblur() { return this._onblur; }; mframe.safefunction(curMemoryArea.onblur_getter);
Object.defineProperty(curMemoryArea.onblur_getter, "name", { value: "get onblur", configurable: true, });
// onblur
curMemoryArea.onblur_setter = function onblur(val) { this._onblur = val; }; mframe.safefunction(curMemoryArea.onblur_setter);
Object.defineProperty(curMemoryArea.onblur_setter, "name", { value: "set onblur", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onblur", { get: curMemoryArea.onblur_getter, set: curMemoryArea.onblur_setter, enumerable: true, configurable: true, });
curMemoryArea.onblur_smart_getter = function onblur() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onblur !== undefined ? this._onblur : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onblur_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onblur", curMemoryArea.onblur_smart_getter);

// onerror
curMemoryArea.onerror_getter = function onerror() { return this._onerror; }; mframe.safefunction(curMemoryArea.onerror_getter);
Object.defineProperty(curMemoryArea.onerror_getter, "name", { value: "get onerror", configurable: true, });
// onerror
curMemoryArea.onerror_setter = function onerror(val) { this._onerror = val; }; mframe.safefunction(curMemoryArea.onerror_setter);
Object.defineProperty(curMemoryArea.onerror_setter, "name", { value: "set onerror", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onerror", { get: curMemoryArea.onerror_getter, set: curMemoryArea.onerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onerror_smart_getter = function onerror() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onerror !== undefined ? this._onerror : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onerror_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onerror", curMemoryArea.onerror_smart_getter);

// onfocus
curMemoryArea.onfocus_getter = function onfocus() { return this._onfocus; }; mframe.safefunction(curMemoryArea.onfocus_getter);
Object.defineProperty(curMemoryArea.onfocus_getter, "name", { value: "get onfocus", configurable: true, });
// onfocus
curMemoryArea.onfocus_setter = function onfocus(val) { this._onfocus = val; }; mframe.safefunction(curMemoryArea.onfocus_setter);
Object.defineProperty(curMemoryArea.onfocus_setter, "name", { value: "set onfocus", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onfocus", { get: curMemoryArea.onfocus_getter, set: curMemoryArea.onfocus_setter, enumerable: true, configurable: true, });
curMemoryArea.onfocus_smart_getter = function onfocus() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onfocus !== undefined ? this._onfocus : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onfocus_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onfocus", curMemoryArea.onfocus_smart_getter);

// onload
curMemoryArea.onload_getter = function onload() { return this._onload; }; mframe.safefunction(curMemoryArea.onload_getter);
Object.defineProperty(curMemoryArea.onload_getter, "name", { value: "get onload", configurable: true, });
// onload
curMemoryArea.onload_setter = function onload(val) { this._onload = val; }; mframe.safefunction(curMemoryArea.onload_setter);
Object.defineProperty(curMemoryArea.onload_setter, "name", { value: "set onload", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onload", { get: curMemoryArea.onload_getter, set: curMemoryArea.onload_setter, enumerable: true, configurable: true, });
curMemoryArea.onload_smart_getter = function onload() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onload !== undefined ? this._onload : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onload_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onload", curMemoryArea.onload_smart_getter);

// onresize
curMemoryArea.onresize_getter = function onresize() { return this._onresize; }; mframe.safefunction(curMemoryArea.onresize_getter);
Object.defineProperty(curMemoryArea.onresize_getter, "name", { value: "get onresize", configurable: true, });
// onresize
curMemoryArea.onresize_setter = function onresize(val) { this._onresize = val; }; mframe.safefunction(curMemoryArea.onresize_setter);
Object.defineProperty(curMemoryArea.onresize_setter, "name", { value: "set onresize", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onresize", { get: curMemoryArea.onresize_getter, set: curMemoryArea.onresize_setter, enumerable: true, configurable: true, });
curMemoryArea.onresize_smart_getter = function onresize() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onresize !== undefined ? this._onresize : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onresize_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onresize", curMemoryArea.onresize_smart_getter);

// onscroll
curMemoryArea.onscroll_getter = function onscroll() { return this._onscroll; }; mframe.safefunction(curMemoryArea.onscroll_getter);
Object.defineProperty(curMemoryArea.onscroll_getter, "name", { value: "get onscroll", configurable: true, });
// onscroll
curMemoryArea.onscroll_setter = function onscroll(val) { this._onscroll = val; }; mframe.safefunction(curMemoryArea.onscroll_setter);
Object.defineProperty(curMemoryArea.onscroll_setter, "name", { value: "set onscroll", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onscroll", { get: curMemoryArea.onscroll_getter, set: curMemoryArea.onscroll_setter, enumerable: true, configurable: true, });
curMemoryArea.onscroll_smart_getter = function onscroll() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscroll !== undefined ? this._onscroll : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscroll_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onscroll", curMemoryArea.onscroll_smart_getter);

// onafterprint
curMemoryArea.onafterprint_getter = function onafterprint() { return this._onafterprint; }; mframe.safefunction(curMemoryArea.onafterprint_getter);
Object.defineProperty(curMemoryArea.onafterprint_getter, "name", { value: "get onafterprint", configurable: true, });
// onafterprint
curMemoryArea.onafterprint_setter = function onafterprint(val) { this._onafterprint = val; }; mframe.safefunction(curMemoryArea.onafterprint_setter);
Object.defineProperty(curMemoryArea.onafterprint_setter, "name", { value: "set onafterprint", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onafterprint", { get: curMemoryArea.onafterprint_getter, set: curMemoryArea.onafterprint_setter, enumerable: true, configurable: true, });
curMemoryArea.onafterprint_smart_getter = function onafterprint() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onafterprint !== undefined ? this._onafterprint : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onafterprint_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onafterprint", curMemoryArea.onafterprint_smart_getter);

// onbeforeprint
curMemoryArea.onbeforeprint_getter = function onbeforeprint() { return this._onbeforeprint; }; mframe.safefunction(curMemoryArea.onbeforeprint_getter);
Object.defineProperty(curMemoryArea.onbeforeprint_getter, "name", { value: "get onbeforeprint", configurable: true, });
// onbeforeprint
curMemoryArea.onbeforeprint_setter = function onbeforeprint(val) { this._onbeforeprint = val; }; mframe.safefunction(curMemoryArea.onbeforeprint_setter);
Object.defineProperty(curMemoryArea.onbeforeprint_setter, "name", { value: "set onbeforeprint", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onbeforeprint", { get: curMemoryArea.onbeforeprint_getter, set: curMemoryArea.onbeforeprint_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforeprint_smart_getter = function onbeforeprint() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforeprint !== undefined ? this._onbeforeprint : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforeprint_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onbeforeprint", curMemoryArea.onbeforeprint_smart_getter);

// onbeforeunload
curMemoryArea.onbeforeunload_getter = function onbeforeunload() { return this._onbeforeunload; }; mframe.safefunction(curMemoryArea.onbeforeunload_getter);
Object.defineProperty(curMemoryArea.onbeforeunload_getter, "name", { value: "get onbeforeunload", configurable: true, });
// onbeforeunload
curMemoryArea.onbeforeunload_setter = function onbeforeunload(val) { this._onbeforeunload = val; }; mframe.safefunction(curMemoryArea.onbeforeunload_setter);
Object.defineProperty(curMemoryArea.onbeforeunload_setter, "name", { value: "set onbeforeunload", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onbeforeunload", { get: curMemoryArea.onbeforeunload_getter, set: curMemoryArea.onbeforeunload_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforeunload_smart_getter = function onbeforeunload() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforeunload !== undefined ? this._onbeforeunload : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforeunload_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onbeforeunload", curMemoryArea.onbeforeunload_smart_getter);

// onhashchange
curMemoryArea.onhashchange_getter = function onhashchange() { return this._onhashchange; }; mframe.safefunction(curMemoryArea.onhashchange_getter);
Object.defineProperty(curMemoryArea.onhashchange_getter, "name", { value: "get onhashchange", configurable: true, });
// onhashchange
curMemoryArea.onhashchange_setter = function onhashchange(val) { this._onhashchange = val; }; mframe.safefunction(curMemoryArea.onhashchange_setter);
Object.defineProperty(curMemoryArea.onhashchange_setter, "name", { value: "set onhashchange", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onhashchange", { get: curMemoryArea.onhashchange_getter, set: curMemoryArea.onhashchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onhashchange_smart_getter = function onhashchange() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onhashchange !== undefined ? this._onhashchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onhashchange_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onhashchange", curMemoryArea.onhashchange_smart_getter);

// onlanguagechange
curMemoryArea.onlanguagechange_getter = function onlanguagechange() { return this._onlanguagechange; }; mframe.safefunction(curMemoryArea.onlanguagechange_getter);
Object.defineProperty(curMemoryArea.onlanguagechange_getter, "name", { value: "get onlanguagechange", configurable: true, });
// onlanguagechange
curMemoryArea.onlanguagechange_setter = function onlanguagechange(val) { this._onlanguagechange = val; }; mframe.safefunction(curMemoryArea.onlanguagechange_setter);
Object.defineProperty(curMemoryArea.onlanguagechange_setter, "name", { value: "set onlanguagechange", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onlanguagechange", { get: curMemoryArea.onlanguagechange_getter, set: curMemoryArea.onlanguagechange_setter, enumerable: true, configurable: true, });
curMemoryArea.onlanguagechange_smart_getter = function onlanguagechange() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onlanguagechange !== undefined ? this._onlanguagechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onlanguagechange_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onlanguagechange", curMemoryArea.onlanguagechange_smart_getter);

// onmessage
curMemoryArea.onmessage_getter = function onmessage() { return this._onmessage; }; mframe.safefunction(curMemoryArea.onmessage_getter);
Object.defineProperty(curMemoryArea.onmessage_getter, "name", { value: "get onmessage", configurable: true, });
// onmessage
curMemoryArea.onmessage_setter = function onmessage(val) { this._onmessage = val; }; mframe.safefunction(curMemoryArea.onmessage_setter);
Object.defineProperty(curMemoryArea.onmessage_setter, "name", { value: "set onmessage", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onmessage", { get: curMemoryArea.onmessage_getter, set: curMemoryArea.onmessage_setter, enumerable: true, configurable: true, });
curMemoryArea.onmessage_smart_getter = function onmessage() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmessage !== undefined ? this._onmessage : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmessage_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onmessage", curMemoryArea.onmessage_smart_getter);

// onmessageerror
curMemoryArea.onmessageerror_getter = function onmessageerror() { return this._onmessageerror; }; mframe.safefunction(curMemoryArea.onmessageerror_getter);
Object.defineProperty(curMemoryArea.onmessageerror_getter, "name", { value: "get onmessageerror", configurable: true, });
// onmessageerror
curMemoryArea.onmessageerror_setter = function onmessageerror(val) { this._onmessageerror = val; }; mframe.safefunction(curMemoryArea.onmessageerror_setter);
Object.defineProperty(curMemoryArea.onmessageerror_setter, "name", { value: "set onmessageerror", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onmessageerror", { get: curMemoryArea.onmessageerror_getter, set: curMemoryArea.onmessageerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onmessageerror_smart_getter = function onmessageerror() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmessageerror !== undefined ? this._onmessageerror : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmessageerror_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onmessageerror", curMemoryArea.onmessageerror_smart_getter);

// onoffline
curMemoryArea.onoffline_getter = function onoffline() { return this._onoffline; }; mframe.safefunction(curMemoryArea.onoffline_getter);
Object.defineProperty(curMemoryArea.onoffline_getter, "name", { value: "get onoffline", configurable: true, });
// onoffline
curMemoryArea.onoffline_setter = function onoffline(val) { this._onoffline = val; }; mframe.safefunction(curMemoryArea.onoffline_setter);
Object.defineProperty(curMemoryArea.onoffline_setter, "name", { value: "set onoffline", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onoffline", { get: curMemoryArea.onoffline_getter, set: curMemoryArea.onoffline_setter, enumerable: true, configurable: true, });
curMemoryArea.onoffline_smart_getter = function onoffline() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onoffline !== undefined ? this._onoffline : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onoffline_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onoffline", curMemoryArea.onoffline_smart_getter);

// ononline
curMemoryArea.ononline_getter = function ononline() { return this._ononline; }; mframe.safefunction(curMemoryArea.ononline_getter);
Object.defineProperty(curMemoryArea.ononline_getter, "name", { value: "get ononline", configurable: true, });
// ononline
curMemoryArea.ononline_setter = function ononline(val) { this._ononline = val; }; mframe.safefunction(curMemoryArea.ononline_setter);
Object.defineProperty(curMemoryArea.ononline_setter, "name", { value: "set ononline", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "ononline", { get: curMemoryArea.ononline_getter, set: curMemoryArea.ononline_setter, enumerable: true, configurable: true, });
curMemoryArea.ononline_smart_getter = function ononline() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ononline !== undefined ? this._ononline : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ononline_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("ononline", curMemoryArea.ononline_smart_getter);

// onpagehide
curMemoryArea.onpagehide_getter = function onpagehide() { return this._onpagehide; }; mframe.safefunction(curMemoryArea.onpagehide_getter);
Object.defineProperty(curMemoryArea.onpagehide_getter, "name", { value: "get onpagehide", configurable: true, });
// onpagehide
curMemoryArea.onpagehide_setter = function onpagehide(val) { this._onpagehide = val; }; mframe.safefunction(curMemoryArea.onpagehide_setter);
Object.defineProperty(curMemoryArea.onpagehide_setter, "name", { value: "set onpagehide", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onpagehide", { get: curMemoryArea.onpagehide_getter, set: curMemoryArea.onpagehide_setter, enumerable: true, configurable: true, });
curMemoryArea.onpagehide_smart_getter = function onpagehide() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpagehide !== undefined ? this._onpagehide : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpagehide_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onpagehide", curMemoryArea.onpagehide_smart_getter);

// onpageshow
curMemoryArea.onpageshow_getter = function onpageshow() { return this._onpageshow; }; mframe.safefunction(curMemoryArea.onpageshow_getter);
Object.defineProperty(curMemoryArea.onpageshow_getter, "name", { value: "get onpageshow", configurable: true, });
// onpageshow
curMemoryArea.onpageshow_setter = function onpageshow(val) { this._onpageshow = val; }; mframe.safefunction(curMemoryArea.onpageshow_setter);
Object.defineProperty(curMemoryArea.onpageshow_setter, "name", { value: "set onpageshow", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onpageshow", { get: curMemoryArea.onpageshow_getter, set: curMemoryArea.onpageshow_setter, enumerable: true, configurable: true, });
curMemoryArea.onpageshow_smart_getter = function onpageshow() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpageshow !== undefined ? this._onpageshow : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpageshow_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onpageshow", curMemoryArea.onpageshow_smart_getter);

// onpopstate
curMemoryArea.onpopstate_getter = function onpopstate() { return this._onpopstate; }; mframe.safefunction(curMemoryArea.onpopstate_getter);
Object.defineProperty(curMemoryArea.onpopstate_getter, "name", { value: "get onpopstate", configurable: true, });
// onpopstate
curMemoryArea.onpopstate_setter = function onpopstate(val) { this._onpopstate = val; }; mframe.safefunction(curMemoryArea.onpopstate_setter);
Object.defineProperty(curMemoryArea.onpopstate_setter, "name", { value: "set onpopstate", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onpopstate", { get: curMemoryArea.onpopstate_getter, set: curMemoryArea.onpopstate_setter, enumerable: true, configurable: true, });
curMemoryArea.onpopstate_smart_getter = function onpopstate() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpopstate !== undefined ? this._onpopstate : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpopstate_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onpopstate", curMemoryArea.onpopstate_smart_getter);

// onrejectionhandled
curMemoryArea.onrejectionhandled_getter = function onrejectionhandled() { return this._onrejectionhandled; }; mframe.safefunction(curMemoryArea.onrejectionhandled_getter);
Object.defineProperty(curMemoryArea.onrejectionhandled_getter, "name", { value: "get onrejectionhandled", configurable: true, });
// onrejectionhandled
curMemoryArea.onrejectionhandled_setter = function onrejectionhandled(val) { this._onrejectionhandled = val; }; mframe.safefunction(curMemoryArea.onrejectionhandled_setter);
Object.defineProperty(curMemoryArea.onrejectionhandled_setter, "name", { value: "set onrejectionhandled", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onrejectionhandled", { get: curMemoryArea.onrejectionhandled_getter, set: curMemoryArea.onrejectionhandled_setter, enumerable: true, configurable: true, });
curMemoryArea.onrejectionhandled_smart_getter = function onrejectionhandled() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onrejectionhandled !== undefined ? this._onrejectionhandled : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onrejectionhandled_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onrejectionhandled", curMemoryArea.onrejectionhandled_smart_getter);

// onstorage
curMemoryArea.onstorage_getter = function onstorage() { return this._onstorage; }; mframe.safefunction(curMemoryArea.onstorage_getter);
Object.defineProperty(curMemoryArea.onstorage_getter, "name", { value: "get onstorage", configurable: true, });
// onstorage
curMemoryArea.onstorage_setter = function onstorage(val) { this._onstorage = val; }; mframe.safefunction(curMemoryArea.onstorage_setter);
Object.defineProperty(curMemoryArea.onstorage_setter, "name", { value: "set onstorage", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onstorage", { get: curMemoryArea.onstorage_getter, set: curMemoryArea.onstorage_setter, enumerable: true, configurable: true, });
curMemoryArea.onstorage_smart_getter = function onstorage() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onstorage !== undefined ? this._onstorage : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onstorage_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onstorage", curMemoryArea.onstorage_smart_getter);

// onunhandledrejection
curMemoryArea.onunhandledrejection_getter = function onunhandledrejection() { return this._onunhandledrejection; }; mframe.safefunction(curMemoryArea.onunhandledrejection_getter);
Object.defineProperty(curMemoryArea.onunhandledrejection_getter, "name", { value: "get onunhandledrejection", configurable: true, });
// onunhandledrejection
curMemoryArea.onunhandledrejection_setter = function onunhandledrejection(val) { this._onunhandledrejection = val; }; mframe.safefunction(curMemoryArea.onunhandledrejection_setter);
Object.defineProperty(curMemoryArea.onunhandledrejection_setter, "name", { value: "set onunhandledrejection", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onunhandledrejection", { get: curMemoryArea.onunhandledrejection_getter, set: curMemoryArea.onunhandledrejection_setter, enumerable: true, configurable: true, });
curMemoryArea.onunhandledrejection_smart_getter = function onunhandledrejection() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onunhandledrejection !== undefined ? this._onunhandledrejection : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onunhandledrejection_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onunhandledrejection", curMemoryArea.onunhandledrejection_smart_getter);

// onunload
curMemoryArea.onunload_getter = function onunload() { return this._onunload; }; mframe.safefunction(curMemoryArea.onunload_getter);
Object.defineProperty(curMemoryArea.onunload_getter, "name", { value: "get onunload", configurable: true, });
// onunload
curMemoryArea.onunload_setter = function onunload(val) { this._onunload = val; }; mframe.safefunction(curMemoryArea.onunload_setter);
Object.defineProperty(curMemoryArea.onunload_setter, "name", { value: "set onunload", configurable: true, });
Object.defineProperty(HTMLBodyElement.prototype, "onunload", { get: curMemoryArea.onunload_getter, set: curMemoryArea.onunload_setter, enumerable: true, configurable: true, });
curMemoryArea.onunload_smart_getter = function onunload() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onunload !== undefined ? this._onunload : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onunload_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onunload", curMemoryArea.onunload_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================

///////////////////////////////////////////////////
HTMLBodyElement.__proto__ = HTMLElement;
HTMLBodyElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['body'] = function () {
    var body = new (function () { });
    body.__proto__ = HTMLBodyElement.prototype;

    return body;
}
var HTMLHtmlElement = function HTMLHtmlElement() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(HTMLHtmlElement)

Object.defineProperties(HTMLHtmlElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHtmlElement",
        configurable: true,
    }
})


//////////////////////////////////

//////////////////////////////////

HTMLHtmlElement .prototype.__proto__ = HTMLElement.prototype;
/**代理 */

// HTMLHtmlElement  = mframe.proxy(HTMLHtmlElement )

var HTMLDocument = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLDocument);

Object.defineProperties(HTMLDocument.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDocument",
        configurable: true,
    }
});
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////



// 如果调用 mframe.memory.htmlelements['document'], 就返回 HTMLDocument
mframe.memory.htmlelements['document'] = function () {
    var document = new (function () { }); // new一个假的,通过换原型,换为HTMLDocument去实现
    HTMLDocument.prototype.__proto__ = Document.prototype;
    document.__proto__ = HTMLDocument.prototype;

    //////////{HTMLDocument特有的 属性/方法}//////////////
    //////////////////////////////////////////////////////
    return document;
}
var Document = function () { }; mframe.safefunction(Document);

Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true,
    }
});

Document.prototype.__proto__ = Node.prototype
document = mframe.memory.htmlelements['document'](); // 小document
///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Document = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// implementation
curMemoryArea.implementation_getter = function implementation() { debugger; }; mframe.safefunction(curMemoryArea.implementation_getter);
Object.defineProperty(curMemoryArea.implementation_getter, "name", { value: "get implementation", configurable: true, });
Object.defineProperty(Document.prototype, "implementation", { get: curMemoryArea.implementation_getter, enumerable: true, configurable: true, });
curMemoryArea.implementation_smart_getter = function implementation() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的implementation的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.implementation_smart_getter);
Document.prototype.__defineGetter__("implementation", curMemoryArea.implementation_smart_getter);

// URL
curMemoryArea.URL_getter = function URL() { debugger; }; mframe.safefunction(curMemoryArea.URL_getter);
Object.defineProperty(curMemoryArea.URL_getter, "name", { value: "get URL", configurable: true, });
Object.defineProperty(Document.prototype, "URL", { get: curMemoryArea.URL_getter, enumerable: true, configurable: true, });
curMemoryArea.URL_smart_getter = function URL() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的URL的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.URL_smart_getter);
Document.prototype.__defineGetter__("URL", curMemoryArea.URL_smart_getter);

// documentURI
curMemoryArea.documentURI_getter = function documentURI() { debugger; }; mframe.safefunction(curMemoryArea.documentURI_getter);
Object.defineProperty(curMemoryArea.documentURI_getter, "name", { value: "get documentURI", configurable: true, });
Object.defineProperty(Document.prototype, "documentURI", { get: curMemoryArea.documentURI_getter, enumerable: true, configurable: true, });
curMemoryArea.documentURI_smart_getter = function documentURI() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的documentURI的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.documentURI_smart_getter);
Document.prototype.__defineGetter__("documentURI", curMemoryArea.documentURI_smart_getter);

// compatMode
curMemoryArea.compatMode_getter = function compatMode() { debugger; }; mframe.safefunction(curMemoryArea.compatMode_getter);
Object.defineProperty(curMemoryArea.compatMode_getter, "name", { value: "get compatMode", configurable: true, });
Object.defineProperty(Document.prototype, "compatMode", { get: curMemoryArea.compatMode_getter, enumerable: true, configurable: true, });
curMemoryArea.compatMode_smart_getter = function compatMode() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的compatMode的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.compatMode_smart_getter);
Document.prototype.__defineGetter__("compatMode", curMemoryArea.compatMode_smart_getter);

// characterSet
curMemoryArea.characterSet_getter = function characterSet() { debugger; }; mframe.safefunction(curMemoryArea.characterSet_getter);
Object.defineProperty(curMemoryArea.characterSet_getter, "name", { value: "get characterSet", configurable: true, });
Object.defineProperty(Document.prototype, "characterSet", { get: curMemoryArea.characterSet_getter, enumerable: true, configurable: true, });
curMemoryArea.characterSet_smart_getter = function characterSet() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的characterSet的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.characterSet_smart_getter);
Document.prototype.__defineGetter__("characterSet", curMemoryArea.characterSet_smart_getter);

// charset
curMemoryArea.charset_getter = function charset() { debugger; }; mframe.safefunction(curMemoryArea.charset_getter);
Object.defineProperty(curMemoryArea.charset_getter, "name", { value: "get charset", configurable: true, });
Object.defineProperty(Document.prototype, "charset", { get: curMemoryArea.charset_getter, enumerable: true, configurable: true, });
curMemoryArea.charset_smart_getter = function charset() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的charset的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.charset_smart_getter);
Document.prototype.__defineGetter__("charset", curMemoryArea.charset_smart_getter);

// inputEncoding
curMemoryArea.inputEncoding_getter = function inputEncoding() { debugger; }; mframe.safefunction(curMemoryArea.inputEncoding_getter);
Object.defineProperty(curMemoryArea.inputEncoding_getter, "name", { value: "get inputEncoding", configurable: true, });
Object.defineProperty(Document.prototype, "inputEncoding", { get: curMemoryArea.inputEncoding_getter, enumerable: true, configurable: true, });
curMemoryArea.inputEncoding_smart_getter = function inputEncoding() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的inputEncoding的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.inputEncoding_smart_getter);
Document.prototype.__defineGetter__("inputEncoding", curMemoryArea.inputEncoding_smart_getter);

// contentType
curMemoryArea.contentType_getter = function contentType() { debugger; }; mframe.safefunction(curMemoryArea.contentType_getter);
Object.defineProperty(curMemoryArea.contentType_getter, "name", { value: "get contentType", configurable: true, });
Object.defineProperty(Document.prototype, "contentType", { get: curMemoryArea.contentType_getter, enumerable: true, configurable: true, });
curMemoryArea.contentType_smart_getter = function contentType() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的contentType的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.contentType_smart_getter);
Document.prototype.__defineGetter__("contentType", curMemoryArea.contentType_smart_getter);

// doctype
curMemoryArea.doctype_getter = function doctype() { debugger; }; mframe.safefunction(curMemoryArea.doctype_getter);
Object.defineProperty(curMemoryArea.doctype_getter, "name", { value: "get doctype", configurable: true, });
Object.defineProperty(Document.prototype, "doctype", { get: curMemoryArea.doctype_getter, enumerable: true, configurable: true, });
curMemoryArea.doctype_smart_getter = function doctype() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的doctype的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.doctype_smart_getter);
Document.prototype.__defineGetter__("doctype", curMemoryArea.doctype_smart_getter);

// documentElement
curMemoryArea.documentElement_getter = function documentElement() { debugger; }; mframe.safefunction(curMemoryArea.documentElement_getter);
Object.defineProperty(curMemoryArea.documentElement_getter, "name", { value: "get documentElement", configurable: true, });
Object.defineProperty(Document.prototype, "documentElement", { get: curMemoryArea.documentElement_getter, enumerable: true, configurable: true, });
curMemoryArea.documentElement_smart_getter = function documentElement() {
    let defaultValue = new class HTMLHtmlElement { };
    defaultValue = mframe.proxy(defaultValue);
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的documentElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.documentElement_smart_getter);
Document.prototype.__defineGetter__("documentElement", curMemoryArea.documentElement_smart_getter);

// xmlEncoding
curMemoryArea.xmlEncoding_getter = function xmlEncoding() { debugger; }; mframe.safefunction(curMemoryArea.xmlEncoding_getter);
Object.defineProperty(curMemoryArea.xmlEncoding_getter, "name", { value: "get xmlEncoding", configurable: true, });
Object.defineProperty(Document.prototype, "xmlEncoding", { get: curMemoryArea.xmlEncoding_getter, enumerable: true, configurable: true, });
curMemoryArea.xmlEncoding_smart_getter = function xmlEncoding() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的xmlEncoding的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.xmlEncoding_smart_getter);
Document.prototype.__defineGetter__("xmlEncoding", curMemoryArea.xmlEncoding_smart_getter);

// xmlVersion
curMemoryArea.xmlVersion_getter = function xmlVersion() { debugger; }; mframe.safefunction(curMemoryArea.xmlVersion_getter);
Object.defineProperty(curMemoryArea.xmlVersion_getter, "name", { value: "get xmlVersion", configurable: true, });
// xmlVersion
curMemoryArea.xmlVersion_setter = function xmlVersion(val) { debugger; }; mframe.safefunction(curMemoryArea.xmlVersion_setter);
Object.defineProperty(curMemoryArea.xmlVersion_setter, "name", { value: "set xmlVersion", configurable: true, });
Object.defineProperty(Document.prototype, "xmlVersion", { get: curMemoryArea.xmlVersion_getter, set: curMemoryArea.xmlVersion_setter, enumerable: true, configurable: true, });
curMemoryArea.xmlVersion_smart_getter = function xmlVersion() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的xmlVersion的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.xmlVersion_smart_getter);
Document.prototype.__defineGetter__("xmlVersion", curMemoryArea.xmlVersion_smart_getter);

// xmlStandalone
curMemoryArea.xmlStandalone_getter = function xmlStandalone() { debugger; }; mframe.safefunction(curMemoryArea.xmlStandalone_getter);
Object.defineProperty(curMemoryArea.xmlStandalone_getter, "name", { value: "get xmlStandalone", configurable: true, });
// xmlStandalone
curMemoryArea.xmlStandalone_setter = function xmlStandalone(val) { debugger; }; mframe.safefunction(curMemoryArea.xmlStandalone_setter);
Object.defineProperty(curMemoryArea.xmlStandalone_setter, "name", { value: "set xmlStandalone", configurable: true, });
Object.defineProperty(Document.prototype, "xmlStandalone", { get: curMemoryArea.xmlStandalone_getter, set: curMemoryArea.xmlStandalone_setter, enumerable: true, configurable: true, });
curMemoryArea.xmlStandalone_smart_getter = function xmlStandalone() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的xmlStandalone的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.xmlStandalone_smart_getter);
Document.prototype.__defineGetter__("xmlStandalone", curMemoryArea.xmlStandalone_smart_getter);

// domain
curMemoryArea.domain_getter = function domain() { debugger; }; mframe.safefunction(curMemoryArea.domain_getter);
Object.defineProperty(curMemoryArea.domain_getter, "name", { value: "get domain", configurable: true, });
// domain
curMemoryArea.domain_setter = function domain(val) { debugger; }; mframe.safefunction(curMemoryArea.domain_setter);
Object.defineProperty(curMemoryArea.domain_setter, "name", { value: "set domain", configurable: true, });
Object.defineProperty(Document.prototype, "domain", { get: curMemoryArea.domain_getter, set: curMemoryArea.domain_setter, enumerable: true, configurable: true, });
curMemoryArea.domain_smart_getter = function domain() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的domain的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.domain_smart_getter);
Document.prototype.__defineGetter__("domain", curMemoryArea.domain_smart_getter);

// referrer
curMemoryArea.referrer_getter = function referrer() { debugger; }; mframe.safefunction(curMemoryArea.referrer_getter);
Object.defineProperty(curMemoryArea.referrer_getter, "name", { value: "get referrer", configurable: true, });
Object.defineProperty(Document.prototype, "referrer", { get: curMemoryArea.referrer_getter, enumerable: true, configurable: true, });
curMemoryArea.referrer_smart_getter = function referrer() {
    let defaultValue = 'https://stu.tulingpyton.cn/';
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的referrer的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.referrer_smart_getter);
Document.prototype.__defineGetter__("referrer", curMemoryArea.referrer_smart_getter);

// cookie
curMemoryArea.cookie_getter = function cookie() { return this._cookie; }; mframe.safefunction(curMemoryArea.cookie_getter);
Object.defineProperty(curMemoryArea.cookie_getter, "name", { value: "get cookie", configurable: true, });
// cookie
curMemoryArea.cookie_setter = function cookie(val) {
    this._cookie = val;
    console.log(`设置cookie:${val}`);
}; mframe.safefunction(curMemoryArea.cookie_setter);
Object.defineProperty(curMemoryArea.cookie_setter, "name", { value: "set cookie", configurable: true, });
Object.defineProperty(Document.prototype, "cookie", { get: curMemoryArea.cookie_getter, set: curMemoryArea.cookie_setter, enumerable: true, configurable: true, });
curMemoryArea.cookie_smart_getter = function cookie() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    var res = this._cookie !== undefined ? this._cookie : ''; // 返回实例属性或默认值
    console.log(`获取cookie:${res}`);
    console.log("cookid end");
    return res;
}; mframe.safefunction(curMemoryArea.cookie_smart_getter);
Document.prototype.__defineGetter__("cookie", curMemoryArea.cookie_smart_getter);

// lastModified
curMemoryArea.lastModified_getter = function lastModified() { debugger; }; mframe.safefunction(curMemoryArea.lastModified_getter);
Object.defineProperty(curMemoryArea.lastModified_getter, "name", { value: "get lastModified", configurable: true, });
Object.defineProperty(Document.prototype, "lastModified", { get: curMemoryArea.lastModified_getter, enumerable: true, configurable: true, });
curMemoryArea.lastModified_smart_getter = function lastModified() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的lastModified的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.lastModified_smart_getter);
Document.prototype.__defineGetter__("lastModified", curMemoryArea.lastModified_smart_getter);

// readyState
curMemoryArea.readyState_getter = function readyState() { debugger; }; mframe.safefunction(curMemoryArea.readyState_getter);
Object.defineProperty(curMemoryArea.readyState_getter, "name", { value: "get readyState", configurable: true, });
Object.defineProperty(Document.prototype, "readyState", { get: curMemoryArea.readyState_getter, enumerable: true, configurable: true, });
curMemoryArea.readyState_smart_getter = function readyState() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的readyState的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.readyState_smart_getter);
Document.prototype.__defineGetter__("readyState", curMemoryArea.readyState_smart_getter);

// title
curMemoryArea.title_getter = function title() { debugger; }; mframe.safefunction(curMemoryArea.title_getter);
Object.defineProperty(curMemoryArea.title_getter, "name", { value: "get title", configurable: true, });
// title
curMemoryArea.title_setter = function title(val) { debugger; }; mframe.safefunction(curMemoryArea.title_setter);
Object.defineProperty(curMemoryArea.title_setter, "name", { value: "set title", configurable: true, });
Object.defineProperty(Document.prototype, "title", { get: curMemoryArea.title_getter, set: curMemoryArea.title_setter, enumerable: true, configurable: true, });
curMemoryArea.title_smart_getter = function title() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的title的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.title_smart_getter);
Document.prototype.__defineGetter__("title", curMemoryArea.title_smart_getter);

// dir
curMemoryArea.dir_getter = function dir() { debugger; }; mframe.safefunction(curMemoryArea.dir_getter);
Object.defineProperty(curMemoryArea.dir_getter, "name", { value: "get dir", configurable: true, });
// dir
curMemoryArea.dir_setter = function dir(val) { debugger; }; mframe.safefunction(curMemoryArea.dir_setter);
Object.defineProperty(curMemoryArea.dir_setter, "name", { value: "set dir", configurable: true, });
Object.defineProperty(Document.prototype, "dir", { get: curMemoryArea.dir_getter, set: curMemoryArea.dir_setter, enumerable: true, configurable: true, });
curMemoryArea.dir_smart_getter = function dir() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的dir的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.dir_smart_getter);
Document.prototype.__defineGetter__("dir", curMemoryArea.dir_smart_getter);

// body
curMemoryArea.body_getter = function body() { debugger; }; mframe.safefunction(curMemoryArea.body_getter);
Object.defineProperty(curMemoryArea.body_getter, "name", { value: "get body", configurable: true, });
// body
curMemoryArea.body_setter = function body(val) { debugger; }; mframe.safefunction(curMemoryArea.body_setter);
Object.defineProperty(curMemoryArea.body_setter, "name", { value: "set body", configurable: true, });
Object.defineProperty(Document.prototype, "body", { get: curMemoryArea.body_getter, set: curMemoryArea.body_setter, enumerable: true, configurable: true, });
curMemoryArea.body_smart_getter = function body() {
    if (mframe.memory.jsdom.document != undefined) { // 有jsdom
        // 确保单例
        if (mframe.memory.body) {
            return mframe.memory.body
        }
        mframe.memory.body = mframe.memory.htmlelements['body'](); // 不能调用createElement的,会返回代理的
        mframe.memory.body.jsdomMemory = mframe.memory.jsdom.document.body;
        return mframe.memory.body;
    }
    //  否则返回默认值
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的body的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.body_smart_getter);
Document.prototype.__defineGetter__("body", curMemoryArea.body_smart_getter);

// head
curMemoryArea.head_getter = function head() { debugger; }; mframe.safefunction(curMemoryArea.head_getter);
Object.defineProperty(curMemoryArea.head_getter, "name", { value: "get head", configurable: true, });
Object.defineProperty(Document.prototype, "head", { get: curMemoryArea.head_getter, enumerable: true, configurable: true, });
curMemoryArea.head_smart_getter = function head() {
    if (mframe.memory.jsdom.document != undefined) { // 有jsdom
        // 确保单例
        if (mframe.memory.head) {
            return mframe.memory.head
        }
        mframe.memory.head = mframe.memory.htmlelements['head'](); // 不能调用createElement的,会返回代理的
        mframe.memory.head.jsdomMemory = mframe.memory.jsdom.document.head;
        return mframe.memory.head;
    }

    // 否则返回默认值
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的head的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.head_smart_getter);
Document.prototype.__defineGetter__("head", curMemoryArea.head_smart_getter);

// images
curMemoryArea.images_getter = function images() { debugger; }; mframe.safefunction(curMemoryArea.images_getter);
Object.defineProperty(curMemoryArea.images_getter, "name", { value: "get images", configurable: true, });
Object.defineProperty(Document.prototype, "images", { get: curMemoryArea.images_getter, enumerable: true, configurable: true, });
curMemoryArea.images_smart_getter = function images() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的images的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.images_smart_getter);
Document.prototype.__defineGetter__("images", curMemoryArea.images_smart_getter);

// embeds
curMemoryArea.embeds_getter = function embeds() { debugger; }; mframe.safefunction(curMemoryArea.embeds_getter);
Object.defineProperty(curMemoryArea.embeds_getter, "name", { value: "get embeds", configurable: true, });
Object.defineProperty(Document.prototype, "embeds", { get: curMemoryArea.embeds_getter, enumerable: true, configurable: true, });
curMemoryArea.embeds_smart_getter = function embeds() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的embeds的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.embeds_smart_getter);
Document.prototype.__defineGetter__("embeds", curMemoryArea.embeds_smart_getter);

// plugins
curMemoryArea.plugins_getter = function plugins() { debugger; }; mframe.safefunction(curMemoryArea.plugins_getter);
Object.defineProperty(curMemoryArea.plugins_getter, "name", { value: "get plugins", configurable: true, });
Object.defineProperty(Document.prototype, "plugins", { get: curMemoryArea.plugins_getter, enumerable: true, configurable: true, });
curMemoryArea.plugins_smart_getter = function plugins() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的plugins的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.plugins_smart_getter);
Document.prototype.__defineGetter__("plugins", curMemoryArea.plugins_smart_getter);

// links
curMemoryArea.links_getter = function links() { debugger; }; mframe.safefunction(curMemoryArea.links_getter);
Object.defineProperty(curMemoryArea.links_getter, "name", { value: "get links", configurable: true, });
Object.defineProperty(Document.prototype, "links", { get: curMemoryArea.links_getter, enumerable: true, configurable: true, });
curMemoryArea.links_smart_getter = function links() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的links的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.links_smart_getter);
Document.prototype.__defineGetter__("links", curMemoryArea.links_smart_getter);

// forms
curMemoryArea.forms_getter = function forms() { debugger; }; mframe.safefunction(curMemoryArea.forms_getter);
Object.defineProperty(curMemoryArea.forms_getter, "name", { value: "get forms", configurable: true, });
Object.defineProperty(Document.prototype, "forms", { get: curMemoryArea.forms_getter, enumerable: true, configurable: true, });
curMemoryArea.forms_smart_getter = function forms() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的forms的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.forms_smart_getter);
Document.prototype.__defineGetter__("forms", curMemoryArea.forms_smart_getter);

// scripts
curMemoryArea.scripts_getter = function scripts() { debugger; }; mframe.safefunction(curMemoryArea.scripts_getter);
Object.defineProperty(curMemoryArea.scripts_getter, "name", { value: "get scripts", configurable: true, });
Object.defineProperty(Document.prototype, "scripts", { get: curMemoryArea.scripts_getter, enumerable: true, configurable: true, });
curMemoryArea.scripts_smart_getter = function scripts() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的scripts的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scripts_smart_getter);
Document.prototype.__defineGetter__("scripts", curMemoryArea.scripts_smart_getter);

// currentScript
curMemoryArea.currentScript_getter = function currentScript() { debugger; }; mframe.safefunction(curMemoryArea.currentScript_getter);
Object.defineProperty(curMemoryArea.currentScript_getter, "name", { value: "get currentScript", configurable: true, });
Object.defineProperty(Document.prototype, "currentScript", { get: curMemoryArea.currentScript_getter, enumerable: true, configurable: true, });
curMemoryArea.currentScript_smart_getter = function currentScript() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的currentScript的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.currentScript_smart_getter);
Document.prototype.__defineGetter__("currentScript", curMemoryArea.currentScript_smart_getter);

// defaultView
curMemoryArea.defaultView_getter = function defaultView() { debugger; }; mframe.safefunction(curMemoryArea.defaultView_getter);
Object.defineProperty(curMemoryArea.defaultView_getter, "name", { value: "get defaultView", configurable: true, });
Object.defineProperty(Document.prototype, "defaultView", { get: curMemoryArea.defaultView_getter, enumerable: true, configurable: true, });
curMemoryArea.defaultView_smart_getter = function defaultView() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的defaultView的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.defaultView_smart_getter);
Document.prototype.__defineGetter__("defaultView", curMemoryArea.defaultView_smart_getter);

// designMode
curMemoryArea.designMode_getter = function designMode() { debugger; }; mframe.safefunction(curMemoryArea.designMode_getter);
Object.defineProperty(curMemoryArea.designMode_getter, "name", { value: "get designMode", configurable: true, });
// designMode
curMemoryArea.designMode_setter = function designMode(val) { debugger; }; mframe.safefunction(curMemoryArea.designMode_setter);
Object.defineProperty(curMemoryArea.designMode_setter, "name", { value: "set designMode", configurable: true, });
Object.defineProperty(Document.prototype, "designMode", { get: curMemoryArea.designMode_getter, set: curMemoryArea.designMode_setter, enumerable: true, configurable: true, });
curMemoryArea.designMode_smart_getter = function designMode() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的designMode的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.designMode_smart_getter);
Document.prototype.__defineGetter__("designMode", curMemoryArea.designMode_smart_getter);

// onreadystatechange
curMemoryArea.onreadystatechange_getter = function onreadystatechange() { debugger; }; mframe.safefunction(curMemoryArea.onreadystatechange_getter);
Object.defineProperty(curMemoryArea.onreadystatechange_getter, "name", { value: "get onreadystatechange", configurable: true, });
// onreadystatechange
curMemoryArea.onreadystatechange_setter = function onreadystatechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onreadystatechange_setter);
Object.defineProperty(curMemoryArea.onreadystatechange_setter, "name", { value: "set onreadystatechange", configurable: true, });
Object.defineProperty(Document.prototype, "onreadystatechange", { get: curMemoryArea.onreadystatechange_getter, set: curMemoryArea.onreadystatechange_setter, enumerable: true, configurable: true, });
curMemoryArea.onreadystatechange_smart_getter = function onreadystatechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onreadystatechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onreadystatechange_smart_getter);
Document.prototype.__defineGetter__("onreadystatechange", curMemoryArea.onreadystatechange_smart_getter);

// anchors
curMemoryArea.anchors_getter = function anchors() { debugger; }; mframe.safefunction(curMemoryArea.anchors_getter);
Object.defineProperty(curMemoryArea.anchors_getter, "name", { value: "get anchors", configurable: true, });
Object.defineProperty(Document.prototype, "anchors", { get: curMemoryArea.anchors_getter, enumerable: true, configurable: true, });
curMemoryArea.anchors_smart_getter = function anchors() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的anchors的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.anchors_smart_getter);
Document.prototype.__defineGetter__("anchors", curMemoryArea.anchors_smart_getter);

// applets
curMemoryArea.applets_getter = function applets() { debugger; }; mframe.safefunction(curMemoryArea.applets_getter);
Object.defineProperty(curMemoryArea.applets_getter, "name", { value: "get applets", configurable: true, });
Object.defineProperty(Document.prototype, "applets", { get: curMemoryArea.applets_getter, enumerable: true, configurable: true, });
curMemoryArea.applets_smart_getter = function applets() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的applets的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.applets_smart_getter);
Document.prototype.__defineGetter__("applets", curMemoryArea.applets_smart_getter);

// fgColor
curMemoryArea.fgColor_getter = function fgColor() { debugger; }; mframe.safefunction(curMemoryArea.fgColor_getter);
Object.defineProperty(curMemoryArea.fgColor_getter, "name", { value: "get fgColor", configurable: true, });
// fgColor
curMemoryArea.fgColor_setter = function fgColor(val) { debugger; }; mframe.safefunction(curMemoryArea.fgColor_setter);
Object.defineProperty(curMemoryArea.fgColor_setter, "name", { value: "set fgColor", configurable: true, });
Object.defineProperty(Document.prototype, "fgColor", { get: curMemoryArea.fgColor_getter, set: curMemoryArea.fgColor_setter, enumerable: true, configurable: true, });
curMemoryArea.fgColor_smart_getter = function fgColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fgColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fgColor_smart_getter);
Document.prototype.__defineGetter__("fgColor", curMemoryArea.fgColor_smart_getter);

// linkColor
curMemoryArea.linkColor_getter = function linkColor() { debugger; }; mframe.safefunction(curMemoryArea.linkColor_getter);
Object.defineProperty(curMemoryArea.linkColor_getter, "name", { value: "get linkColor", configurable: true, });
// linkColor
curMemoryArea.linkColor_setter = function linkColor(val) { debugger; }; mframe.safefunction(curMemoryArea.linkColor_setter);
Object.defineProperty(curMemoryArea.linkColor_setter, "name", { value: "set linkColor", configurable: true, });
Object.defineProperty(Document.prototype, "linkColor", { get: curMemoryArea.linkColor_getter, set: curMemoryArea.linkColor_setter, enumerable: true, configurable: true, });
curMemoryArea.linkColor_smart_getter = function linkColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的linkColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.linkColor_smart_getter);
Document.prototype.__defineGetter__("linkColor", curMemoryArea.linkColor_smart_getter);

// vlinkColor
curMemoryArea.vlinkColor_getter = function vlinkColor() { debugger; }; mframe.safefunction(curMemoryArea.vlinkColor_getter);
Object.defineProperty(curMemoryArea.vlinkColor_getter, "name", { value: "get vlinkColor", configurable: true, });
// vlinkColor
curMemoryArea.vlinkColor_setter = function vlinkColor(val) { debugger; }; mframe.safefunction(curMemoryArea.vlinkColor_setter);
Object.defineProperty(curMemoryArea.vlinkColor_setter, "name", { value: "set vlinkColor", configurable: true, });
Object.defineProperty(Document.prototype, "vlinkColor", { get: curMemoryArea.vlinkColor_getter, set: curMemoryArea.vlinkColor_setter, enumerable: true, configurable: true, });
curMemoryArea.vlinkColor_smart_getter = function vlinkColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的vlinkColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.vlinkColor_smart_getter);
Document.prototype.__defineGetter__("vlinkColor", curMemoryArea.vlinkColor_smart_getter);

// alinkColor
curMemoryArea.alinkColor_getter = function alinkColor() { debugger; }; mframe.safefunction(curMemoryArea.alinkColor_getter);
Object.defineProperty(curMemoryArea.alinkColor_getter, "name", { value: "get alinkColor", configurable: true, });
// alinkColor
curMemoryArea.alinkColor_setter = function alinkColor(val) { debugger; }; mframe.safefunction(curMemoryArea.alinkColor_setter);
Object.defineProperty(curMemoryArea.alinkColor_setter, "name", { value: "set alinkColor", configurable: true, });
Object.defineProperty(Document.prototype, "alinkColor", { get: curMemoryArea.alinkColor_getter, set: curMemoryArea.alinkColor_setter, enumerable: true, configurable: true, });
curMemoryArea.alinkColor_smart_getter = function alinkColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的alinkColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.alinkColor_smart_getter);
Document.prototype.__defineGetter__("alinkColor", curMemoryArea.alinkColor_smart_getter);

// bgColor
curMemoryArea.bgColor_getter = function bgColor() { debugger; }; mframe.safefunction(curMemoryArea.bgColor_getter);
Object.defineProperty(curMemoryArea.bgColor_getter, "name", { value: "get bgColor", configurable: true, });
// bgColor
curMemoryArea.bgColor_setter = function bgColor(val) { debugger; }; mframe.safefunction(curMemoryArea.bgColor_setter);
Object.defineProperty(curMemoryArea.bgColor_setter, "name", { value: "set bgColor", configurable: true, });
Object.defineProperty(Document.prototype, "bgColor", { get: curMemoryArea.bgColor_getter, set: curMemoryArea.bgColor_setter, enumerable: true, configurable: true, });
curMemoryArea.bgColor_smart_getter = function bgColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的bgColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.bgColor_smart_getter);
Document.prototype.__defineGetter__("bgColor", curMemoryArea.bgColor_smart_getter);

// all
curMemoryArea.all_getter = function all() { debugger; }; mframe.safefunction(curMemoryArea.all_getter);
Object.defineProperty(curMemoryArea.all_getter, "name", { value: "get all", configurable: true, });
Object.defineProperty(Document.prototype, "all", { get: curMemoryArea.all_getter, enumerable: true, configurable: true, });
curMemoryArea.all_smart_getter = function all() {


    // 否则返回默认值
    let defaultValue = null;
    // defaultValue = mframe.proxy(defaultValue);

    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的all的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.all_smart_getter);
Document.prototype.__defineGetter__("all", curMemoryArea.all_smart_getter);

// scrollingElement
curMemoryArea.scrollingElement_getter = function scrollingElement() { debugger; }; mframe.safefunction(curMemoryArea.scrollingElement_getter);
Object.defineProperty(curMemoryArea.scrollingElement_getter, "name", { value: "get scrollingElement", configurable: true, });
Object.defineProperty(Document.prototype, "scrollingElement", { get: curMemoryArea.scrollingElement_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollingElement_smart_getter = function scrollingElement() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的scrollingElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollingElement_smart_getter);
Document.prototype.__defineGetter__("scrollingElement", curMemoryArea.scrollingElement_smart_getter);

// onpointerlockchange
curMemoryArea.onpointerlockchange_getter = function onpointerlockchange() { debugger; }; mframe.safefunction(curMemoryArea.onpointerlockchange_getter);
Object.defineProperty(curMemoryArea.onpointerlockchange_getter, "name", { value: "get onpointerlockchange", configurable: true, });
// onpointerlockchange
curMemoryArea.onpointerlockchange_setter = function onpointerlockchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerlockchange_setter);
Object.defineProperty(curMemoryArea.onpointerlockchange_setter, "name", { value: "set onpointerlockchange", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerlockchange", { get: curMemoryArea.onpointerlockchange_getter, set: curMemoryArea.onpointerlockchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerlockchange_smart_getter = function onpointerlockchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerlockchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerlockchange_smart_getter);
Document.prototype.__defineGetter__("onpointerlockchange", curMemoryArea.onpointerlockchange_smart_getter);

// onpointerlockerror
curMemoryArea.onpointerlockerror_getter = function onpointerlockerror() { debugger; }; mframe.safefunction(curMemoryArea.onpointerlockerror_getter);
Object.defineProperty(curMemoryArea.onpointerlockerror_getter, "name", { value: "get onpointerlockerror", configurable: true, });
// onpointerlockerror
curMemoryArea.onpointerlockerror_setter = function onpointerlockerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerlockerror_setter);
Object.defineProperty(curMemoryArea.onpointerlockerror_setter, "name", { value: "set onpointerlockerror", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerlockerror", { get: curMemoryArea.onpointerlockerror_getter, set: curMemoryArea.onpointerlockerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerlockerror_smart_getter = function onpointerlockerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerlockerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerlockerror_smart_getter);
Document.prototype.__defineGetter__("onpointerlockerror", curMemoryArea.onpointerlockerror_smart_getter);

// hidden
curMemoryArea.hidden_getter = function hidden() { debugger; }; mframe.safefunction(curMemoryArea.hidden_getter);
Object.defineProperty(curMemoryArea.hidden_getter, "name", { value: "get hidden", configurable: true, });
Object.defineProperty(Document.prototype, "hidden", { get: curMemoryArea.hidden_getter, enumerable: true, configurable: true, });
curMemoryArea.hidden_smart_getter = function hidden() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的hidden的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.hidden_smart_getter);
Document.prototype.__defineGetter__("hidden", curMemoryArea.hidden_smart_getter);

// visibilityState
curMemoryArea.visibilityState_getter = function visibilityState() { debugger; }; mframe.safefunction(curMemoryArea.visibilityState_getter);
Object.defineProperty(curMemoryArea.visibilityState_getter, "name", { value: "get visibilityState", configurable: true, });
Object.defineProperty(Document.prototype, "visibilityState", { get: curMemoryArea.visibilityState_getter, enumerable: true, configurable: true, });
curMemoryArea.visibilityState_smart_getter = function visibilityState() {
    // if (mframe.memory.jsdom.document) {
    //     console.log(`${this}调用了"jsdom.document"中的visibilityState的get方法,\x1b[31m返回${mframe.memory.jsdom.document.visibilityState}\x1b[0m`);

    //     return mframe.memory.jsdom.document.visibilityState;
    // }
    let defaultValue = 'hidden'
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的visibilityState的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.visibilityState_smart_getter);
Document.prototype.__defineGetter__("visibilityState", curMemoryArea.visibilityState_smart_getter);

// wasDiscarded
curMemoryArea.wasDiscarded_getter = function wasDiscarded() { debugger; }; mframe.safefunction(curMemoryArea.wasDiscarded_getter);
Object.defineProperty(curMemoryArea.wasDiscarded_getter, "name", { value: "get wasDiscarded", configurable: true, });
Object.defineProperty(Document.prototype, "wasDiscarded", { get: curMemoryArea.wasDiscarded_getter, enumerable: true, configurable: true, });
curMemoryArea.wasDiscarded_smart_getter = function wasDiscarded() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的wasDiscarded的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.wasDiscarded_smart_getter);
Document.prototype.__defineGetter__("wasDiscarded", curMemoryArea.wasDiscarded_smart_getter);

// prerendering
curMemoryArea.prerendering_getter = function prerendering() { debugger; }; mframe.safefunction(curMemoryArea.prerendering_getter);
Object.defineProperty(curMemoryArea.prerendering_getter, "name", { value: "get prerendering", configurable: true, });
Object.defineProperty(Document.prototype, "prerendering", { get: curMemoryArea.prerendering_getter, enumerable: true, configurable: true, });
curMemoryArea.prerendering_smart_getter = function prerendering() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的prerendering的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.prerendering_smart_getter);
Document.prototype.__defineGetter__("prerendering", curMemoryArea.prerendering_smart_getter);

// featurePolicy
curMemoryArea.featurePolicy_getter = function featurePolicy() { debugger; }; mframe.safefunction(curMemoryArea.featurePolicy_getter);
Object.defineProperty(curMemoryArea.featurePolicy_getter, "name", { value: "get featurePolicy", configurable: true, });
Object.defineProperty(Document.prototype, "featurePolicy", { get: curMemoryArea.featurePolicy_getter, enumerable: true, configurable: true, });
curMemoryArea.featurePolicy_smart_getter = function featurePolicy() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的featurePolicy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.featurePolicy_smart_getter);
Document.prototype.__defineGetter__("featurePolicy", curMemoryArea.featurePolicy_smart_getter);

// webkitVisibilityState
curMemoryArea.webkitVisibilityState_getter = function webkitVisibilityState() { debugger; }; mframe.safefunction(curMemoryArea.webkitVisibilityState_getter);
Object.defineProperty(curMemoryArea.webkitVisibilityState_getter, "name", { value: "get webkitVisibilityState", configurable: true, });
Object.defineProperty(Document.prototype, "webkitVisibilityState", { get: curMemoryArea.webkitVisibilityState_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitVisibilityState_smart_getter = function webkitVisibilityState() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitVisibilityState的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitVisibilityState_smart_getter);
Document.prototype.__defineGetter__("webkitVisibilityState", curMemoryArea.webkitVisibilityState_smart_getter);

// webkitHidden
curMemoryArea.webkitHidden_getter = function webkitHidden() { debugger; }; mframe.safefunction(curMemoryArea.webkitHidden_getter);
Object.defineProperty(curMemoryArea.webkitHidden_getter, "name", { value: "get webkitHidden", configurable: true, });
Object.defineProperty(Document.prototype, "webkitHidden", { get: curMemoryArea.webkitHidden_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitHidden_smart_getter = function webkitHidden() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitHidden的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitHidden_smart_getter);
Document.prototype.__defineGetter__("webkitHidden", curMemoryArea.webkitHidden_smart_getter);

// onbeforecopy
curMemoryArea.onbeforecopy_getter = function onbeforecopy() { debugger; }; mframe.safefunction(curMemoryArea.onbeforecopy_getter);
Object.defineProperty(curMemoryArea.onbeforecopy_getter, "name", { value: "get onbeforecopy", configurable: true, });
// onbeforecopy
curMemoryArea.onbeforecopy_setter = function onbeforecopy(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforecopy_setter);
Object.defineProperty(curMemoryArea.onbeforecopy_setter, "name", { value: "set onbeforecopy", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforecopy", { get: curMemoryArea.onbeforecopy_getter, set: curMemoryArea.onbeforecopy_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecopy_smart_getter = function onbeforecopy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforecopy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforecopy_smart_getter);
Document.prototype.__defineGetter__("onbeforecopy", curMemoryArea.onbeforecopy_smart_getter);

// onbeforecut
curMemoryArea.onbeforecut_getter = function onbeforecut() { debugger; }; mframe.safefunction(curMemoryArea.onbeforecut_getter);
Object.defineProperty(curMemoryArea.onbeforecut_getter, "name", { value: "get onbeforecut", configurable: true, });
// onbeforecut
curMemoryArea.onbeforecut_setter = function onbeforecut(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforecut_setter);
Object.defineProperty(curMemoryArea.onbeforecut_setter, "name", { value: "set onbeforecut", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforecut", { get: curMemoryArea.onbeforecut_getter, set: curMemoryArea.onbeforecut_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecut_smart_getter = function onbeforecut() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforecut的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforecut_smart_getter);
Document.prototype.__defineGetter__("onbeforecut", curMemoryArea.onbeforecut_smart_getter);

// onbeforepaste
curMemoryArea.onbeforepaste_getter = function onbeforepaste() { debugger; }; mframe.safefunction(curMemoryArea.onbeforepaste_getter);
Object.defineProperty(curMemoryArea.onbeforepaste_getter, "name", { value: "get onbeforepaste", configurable: true, });
// onbeforepaste
curMemoryArea.onbeforepaste_setter = function onbeforepaste(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforepaste_setter);
Object.defineProperty(curMemoryArea.onbeforepaste_setter, "name", { value: "set onbeforepaste", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforepaste", { get: curMemoryArea.onbeforepaste_getter, set: curMemoryArea.onbeforepaste_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforepaste_smart_getter = function onbeforepaste() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforepaste的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforepaste_smart_getter);
Document.prototype.__defineGetter__("onbeforepaste", curMemoryArea.onbeforepaste_smart_getter);

// onfreeze
curMemoryArea.onfreeze_getter = function onfreeze() { debugger; }; mframe.safefunction(curMemoryArea.onfreeze_getter);
Object.defineProperty(curMemoryArea.onfreeze_getter, "name", { value: "get onfreeze", configurable: true, });
// onfreeze
curMemoryArea.onfreeze_setter = function onfreeze(val) { debugger; }; mframe.safefunction(curMemoryArea.onfreeze_setter);
Object.defineProperty(curMemoryArea.onfreeze_setter, "name", { value: "set onfreeze", configurable: true, });
Object.defineProperty(Document.prototype, "onfreeze", { get: curMemoryArea.onfreeze_getter, set: curMemoryArea.onfreeze_setter, enumerable: true, configurable: true, });
curMemoryArea.onfreeze_smart_getter = function onfreeze() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onfreeze的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfreeze_smart_getter);
Document.prototype.__defineGetter__("onfreeze", curMemoryArea.onfreeze_smart_getter);

// onprerenderingchange
curMemoryArea.onprerenderingchange_getter = function onprerenderingchange() { debugger; }; mframe.safefunction(curMemoryArea.onprerenderingchange_getter);
Object.defineProperty(curMemoryArea.onprerenderingchange_getter, "name", { value: "get onprerenderingchange", configurable: true, });
// onprerenderingchange
curMemoryArea.onprerenderingchange_setter = function onprerenderingchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onprerenderingchange_setter);
Object.defineProperty(curMemoryArea.onprerenderingchange_setter, "name", { value: "set onprerenderingchange", configurable: true, });
Object.defineProperty(Document.prototype, "onprerenderingchange", { get: curMemoryArea.onprerenderingchange_getter, set: curMemoryArea.onprerenderingchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onprerenderingchange_smart_getter = function onprerenderingchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onprerenderingchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onprerenderingchange_smart_getter);
Document.prototype.__defineGetter__("onprerenderingchange", curMemoryArea.onprerenderingchange_smart_getter);

// onresume
curMemoryArea.onresume_getter = function onresume() { debugger; }; mframe.safefunction(curMemoryArea.onresume_getter);
Object.defineProperty(curMemoryArea.onresume_getter, "name", { value: "get onresume", configurable: true, });
// onresume
curMemoryArea.onresume_setter = function onresume(val) { debugger; }; mframe.safefunction(curMemoryArea.onresume_setter);
Object.defineProperty(curMemoryArea.onresume_setter, "name", { value: "set onresume", configurable: true, });
Object.defineProperty(Document.prototype, "onresume", { get: curMemoryArea.onresume_getter, set: curMemoryArea.onresume_setter, enumerable: true, configurable: true, });
curMemoryArea.onresume_smart_getter = function onresume() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onresume的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onresume_smart_getter);
Document.prototype.__defineGetter__("onresume", curMemoryArea.onresume_smart_getter);

// onsearch
curMemoryArea.onsearch_getter = function onsearch() { debugger; }; mframe.safefunction(curMemoryArea.onsearch_getter);
Object.defineProperty(curMemoryArea.onsearch_getter, "name", { value: "get onsearch", configurable: true, });
// onsearch
curMemoryArea.onsearch_setter = function onsearch(val) { debugger; }; mframe.safefunction(curMemoryArea.onsearch_setter);
Object.defineProperty(curMemoryArea.onsearch_setter, "name", { value: "set onsearch", configurable: true, });
Object.defineProperty(Document.prototype, "onsearch", { get: curMemoryArea.onsearch_getter, set: curMemoryArea.onsearch_setter, enumerable: true, configurable: true, });
curMemoryArea.onsearch_smart_getter = function onsearch() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onsearch的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsearch_smart_getter);
Document.prototype.__defineGetter__("onsearch", curMemoryArea.onsearch_smart_getter);

// onvisibilitychange
curMemoryArea.onvisibilitychange_getter = function onvisibilitychange() { debugger; }; mframe.safefunction(curMemoryArea.onvisibilitychange_getter);
Object.defineProperty(curMemoryArea.onvisibilitychange_getter, "name", { value: "get onvisibilitychange", configurable: true, });
// onvisibilitychange
curMemoryArea.onvisibilitychange_setter = function onvisibilitychange(val) { debugger; }; mframe.safefunction(curMemoryArea.onvisibilitychange_setter);
Object.defineProperty(curMemoryArea.onvisibilitychange_setter, "name", { value: "set onvisibilitychange", configurable: true, });
Object.defineProperty(Document.prototype, "onvisibilitychange", { get: curMemoryArea.onvisibilitychange_getter, set: curMemoryArea.onvisibilitychange_setter, enumerable: true, configurable: true, });
curMemoryArea.onvisibilitychange_smart_getter = function onvisibilitychange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onvisibilitychange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onvisibilitychange_smart_getter);
Document.prototype.__defineGetter__("onvisibilitychange", curMemoryArea.onvisibilitychange_smart_getter);

// timeline
curMemoryArea.timeline_getter = function timeline() { debugger; }; mframe.safefunction(curMemoryArea.timeline_getter);
Object.defineProperty(curMemoryArea.timeline_getter, "name", { value: "get timeline", configurable: true, });
Object.defineProperty(Document.prototype, "timeline", { get: curMemoryArea.timeline_getter, enumerable: true, configurable: true, });
curMemoryArea.timeline_smart_getter = function timeline() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的timeline的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.timeline_smart_getter);
Document.prototype.__defineGetter__("timeline", curMemoryArea.timeline_smart_getter);

// fullscreenEnabled
curMemoryArea.fullscreenEnabled_getter = function fullscreenEnabled() { debugger; }; mframe.safefunction(curMemoryArea.fullscreenEnabled_getter);
Object.defineProperty(curMemoryArea.fullscreenEnabled_getter, "name", { value: "get fullscreenEnabled", configurable: true, });
// fullscreenEnabled
curMemoryArea.fullscreenEnabled_setter = function fullscreenEnabled(val) { debugger; }; mframe.safefunction(curMemoryArea.fullscreenEnabled_setter);
Object.defineProperty(curMemoryArea.fullscreenEnabled_setter, "name", { value: "set fullscreenEnabled", configurable: true, });
Object.defineProperty(Document.prototype, "fullscreenEnabled", { get: curMemoryArea.fullscreenEnabled_getter, set: curMemoryArea.fullscreenEnabled_setter, enumerable: true, configurable: true, });
curMemoryArea.fullscreenEnabled_smart_getter = function fullscreenEnabled() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fullscreenEnabled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fullscreenEnabled_smart_getter);
Document.prototype.__defineGetter__("fullscreenEnabled", curMemoryArea.fullscreenEnabled_smart_getter);

// fullscreen
curMemoryArea.fullscreen_getter = function fullscreen() { debugger; }; mframe.safefunction(curMemoryArea.fullscreen_getter);
Object.defineProperty(curMemoryArea.fullscreen_getter, "name", { value: "get fullscreen", configurable: true, });
// fullscreen
curMemoryArea.fullscreen_setter = function fullscreen(val) { debugger; }; mframe.safefunction(curMemoryArea.fullscreen_setter);
Object.defineProperty(curMemoryArea.fullscreen_setter, "name", { value: "set fullscreen", configurable: true, });
Object.defineProperty(Document.prototype, "fullscreen", { get: curMemoryArea.fullscreen_getter, set: curMemoryArea.fullscreen_setter, enumerable: true, configurable: true, });
curMemoryArea.fullscreen_smart_getter = function fullscreen() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fullscreen的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fullscreen_smart_getter);
Document.prototype.__defineGetter__("fullscreen", curMemoryArea.fullscreen_smart_getter);

// onfullscreenchange
curMemoryArea.onfullscreenchange_getter = function onfullscreenchange() { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onfullscreenchange_getter, "name", { value: "get onfullscreenchange", configurable: true, });
// onfullscreenchange
curMemoryArea.onfullscreenchange_setter = function onfullscreenchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onfullscreenchange_setter, "name", { value: "set onfullscreenchange", configurable: true, });
Object.defineProperty(Document.prototype, "onfullscreenchange", { get: curMemoryArea.onfullscreenchange_getter, set: curMemoryArea.onfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenchange_smart_getter = function onfullscreenchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onfullscreenchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfullscreenchange_smart_getter);
Document.prototype.__defineGetter__("onfullscreenchange", curMemoryArea.onfullscreenchange_smart_getter);

// onfullscreenerror
curMemoryArea.onfullscreenerror_getter = function onfullscreenerror() { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onfullscreenerror_getter, "name", { value: "get onfullscreenerror", configurable: true, });
// onfullscreenerror
curMemoryArea.onfullscreenerror_setter = function onfullscreenerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onfullscreenerror_setter, "name", { value: "set onfullscreenerror", configurable: true, });
Object.defineProperty(Document.prototype, "onfullscreenerror", { get: curMemoryArea.onfullscreenerror_getter, set: curMemoryArea.onfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenerror_smart_getter = function onfullscreenerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onfullscreenerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfullscreenerror_smart_getter);
Document.prototype.__defineGetter__("onfullscreenerror", curMemoryArea.onfullscreenerror_smart_getter);

// webkitIsFullScreen
curMemoryArea.webkitIsFullScreen_getter = function webkitIsFullScreen() { debugger; }; mframe.safefunction(curMemoryArea.webkitIsFullScreen_getter);
Object.defineProperty(curMemoryArea.webkitIsFullScreen_getter, "name", { value: "get webkitIsFullScreen", configurable: true, });
Object.defineProperty(Document.prototype, "webkitIsFullScreen", { get: curMemoryArea.webkitIsFullScreen_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitIsFullScreen_smart_getter = function webkitIsFullScreen() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitIsFullScreen的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitIsFullScreen_smart_getter);
Document.prototype.__defineGetter__("webkitIsFullScreen", curMemoryArea.webkitIsFullScreen_smart_getter);

// webkitCurrentFullScreenElement
curMemoryArea.webkitCurrentFullScreenElement_getter = function webkitCurrentFullScreenElement() { debugger; }; mframe.safefunction(curMemoryArea.webkitCurrentFullScreenElement_getter);
Object.defineProperty(curMemoryArea.webkitCurrentFullScreenElement_getter, "name", { value: "get webkitCurrentFullScreenElement", configurable: true, });
Object.defineProperty(Document.prototype, "webkitCurrentFullScreenElement", { get: curMemoryArea.webkitCurrentFullScreenElement_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitCurrentFullScreenElement_smart_getter = function webkitCurrentFullScreenElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitCurrentFullScreenElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitCurrentFullScreenElement_smart_getter);
Document.prototype.__defineGetter__("webkitCurrentFullScreenElement", curMemoryArea.webkitCurrentFullScreenElement_smart_getter);

// webkitFullscreenEnabled
curMemoryArea.webkitFullscreenEnabled_getter = function webkitFullscreenEnabled() { debugger; }; mframe.safefunction(curMemoryArea.webkitFullscreenEnabled_getter);
Object.defineProperty(curMemoryArea.webkitFullscreenEnabled_getter, "name", { value: "get webkitFullscreenEnabled", configurable: true, });
Object.defineProperty(Document.prototype, "webkitFullscreenEnabled", { get: curMemoryArea.webkitFullscreenEnabled_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitFullscreenEnabled_smart_getter = function webkitFullscreenEnabled() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitFullscreenEnabled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitFullscreenEnabled_smart_getter);
Document.prototype.__defineGetter__("webkitFullscreenEnabled", curMemoryArea.webkitFullscreenEnabled_smart_getter);

// webkitFullscreenElement
curMemoryArea.webkitFullscreenElement_getter = function webkitFullscreenElement() { debugger; }; mframe.safefunction(curMemoryArea.webkitFullscreenElement_getter);
Object.defineProperty(curMemoryArea.webkitFullscreenElement_getter, "name", { value: "get webkitFullscreenElement", configurable: true, });
Object.defineProperty(Document.prototype, "webkitFullscreenElement", { get: curMemoryArea.webkitFullscreenElement_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitFullscreenElement_smart_getter = function webkitFullscreenElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitFullscreenElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitFullscreenElement_smart_getter);
Document.prototype.__defineGetter__("webkitFullscreenElement", curMemoryArea.webkitFullscreenElement_smart_getter);

// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_getter = function onwebkitfullscreenchange() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_getter, "name", { value: "get onwebkitfullscreenchange", configurable: true, });
// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_setter = function onwebkitfullscreenchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_setter, "name", { value: "set onwebkitfullscreenchange", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitfullscreenchange", { get: curMemoryArea.onwebkitfullscreenchange_getter, set: curMemoryArea.onwebkitfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenchange_smart_getter = function onwebkitfullscreenchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitfullscreenchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_smart_getter);
Document.prototype.__defineGetter__("onwebkitfullscreenchange", curMemoryArea.onwebkitfullscreenchange_smart_getter);

// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_getter = function onwebkitfullscreenerror() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_getter, "name", { value: "get onwebkitfullscreenerror", configurable: true, });
// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_setter = function onwebkitfullscreenerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_setter, "name", { value: "set onwebkitfullscreenerror", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitfullscreenerror", { get: curMemoryArea.onwebkitfullscreenerror_getter, set: curMemoryArea.onwebkitfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenerror_smart_getter = function onwebkitfullscreenerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitfullscreenerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_smart_getter);
Document.prototype.__defineGetter__("onwebkitfullscreenerror", curMemoryArea.onwebkitfullscreenerror_smart_getter);

// rootElement
curMemoryArea.rootElement_getter = function rootElement() { debugger; }; mframe.safefunction(curMemoryArea.rootElement_getter);
Object.defineProperty(curMemoryArea.rootElement_getter, "name", { value: "get rootElement", configurable: true, });
Object.defineProperty(Document.prototype, "rootElement", { get: curMemoryArea.rootElement_getter, enumerable: true, configurable: true, });
curMemoryArea.rootElement_smart_getter = function rootElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的rootElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.rootElement_smart_getter);
Document.prototype.__defineGetter__("rootElement", curMemoryArea.rootElement_smart_getter);

// pictureInPictureEnabled
curMemoryArea.pictureInPictureEnabled_getter = function pictureInPictureEnabled() { debugger; }; mframe.safefunction(curMemoryArea.pictureInPictureEnabled_getter);
Object.defineProperty(curMemoryArea.pictureInPictureEnabled_getter, "name", { value: "get pictureInPictureEnabled", configurable: true, });
Object.defineProperty(Document.prototype, "pictureInPictureEnabled", { get: curMemoryArea.pictureInPictureEnabled_getter, enumerable: true, configurable: true, });
curMemoryArea.pictureInPictureEnabled_smart_getter = function pictureInPictureEnabled() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的pictureInPictureEnabled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.pictureInPictureEnabled_smart_getter);
Document.prototype.__defineGetter__("pictureInPictureEnabled", curMemoryArea.pictureInPictureEnabled_smart_getter);

// onbeforexrselect
curMemoryArea.onbeforexrselect_getter = function onbeforexrselect() { debugger; }; mframe.safefunction(curMemoryArea.onbeforexrselect_getter);
Object.defineProperty(curMemoryArea.onbeforexrselect_getter, "name", { value: "get onbeforexrselect", configurable: true, });
// onbeforexrselect
curMemoryArea.onbeforexrselect_setter = function onbeforexrselect(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforexrselect_setter);
Object.defineProperty(curMemoryArea.onbeforexrselect_setter, "name", { value: "set onbeforexrselect", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforexrselect", { get: curMemoryArea.onbeforexrselect_getter, set: curMemoryArea.onbeforexrselect_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforexrselect_smart_getter = function onbeforexrselect() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforexrselect的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforexrselect_smart_getter);
Document.prototype.__defineGetter__("onbeforexrselect", curMemoryArea.onbeforexrselect_smart_getter);

// onabort
curMemoryArea.onabort_getter = function onabort() { debugger; }; mframe.safefunction(curMemoryArea.onabort_getter);
Object.defineProperty(curMemoryArea.onabort_getter, "name", { value: "get onabort", configurable: true, });
// onabort
curMemoryArea.onabort_setter = function onabort(val) { debugger; }; mframe.safefunction(curMemoryArea.onabort_setter);
Object.defineProperty(curMemoryArea.onabort_setter, "name", { value: "set onabort", configurable: true, });
Object.defineProperty(Document.prototype, "onabort", { get: curMemoryArea.onabort_getter, set: curMemoryArea.onabort_setter, enumerable: true, configurable: true, });
curMemoryArea.onabort_smart_getter = function onabort() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onabort的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onabort_smart_getter);
Document.prototype.__defineGetter__("onabort", curMemoryArea.onabort_smart_getter);

// onbeforeinput
curMemoryArea.onbeforeinput_getter = function onbeforeinput() { debugger; }; mframe.safefunction(curMemoryArea.onbeforeinput_getter);
Object.defineProperty(curMemoryArea.onbeforeinput_getter, "name", { value: "get onbeforeinput", configurable: true, });
// onbeforeinput
curMemoryArea.onbeforeinput_setter = function onbeforeinput(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforeinput_setter);
Object.defineProperty(curMemoryArea.onbeforeinput_setter, "name", { value: "set onbeforeinput", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforeinput", { get: curMemoryArea.onbeforeinput_getter, set: curMemoryArea.onbeforeinput_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforeinput_smart_getter = function onbeforeinput() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforeinput的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforeinput_smart_getter);
Document.prototype.__defineGetter__("onbeforeinput", curMemoryArea.onbeforeinput_smart_getter);

// onbeforematch
curMemoryArea.onbeforematch_getter = function onbeforematch() { debugger; }; mframe.safefunction(curMemoryArea.onbeforematch_getter);
Object.defineProperty(curMemoryArea.onbeforematch_getter, "name", { value: "get onbeforematch", configurable: true, });
// onbeforematch
curMemoryArea.onbeforematch_setter = function onbeforematch(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforematch_setter);
Object.defineProperty(curMemoryArea.onbeforematch_setter, "name", { value: "set onbeforematch", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforematch", { get: curMemoryArea.onbeforematch_getter, set: curMemoryArea.onbeforematch_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforematch_smart_getter = function onbeforematch() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforematch的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforematch_smart_getter);
Document.prototype.__defineGetter__("onbeforematch", curMemoryArea.onbeforematch_smart_getter);

// onbeforetoggle
curMemoryArea.onbeforetoggle_getter = function onbeforetoggle() { debugger; }; mframe.safefunction(curMemoryArea.onbeforetoggle_getter);
Object.defineProperty(curMemoryArea.onbeforetoggle_getter, "name", { value: "get onbeforetoggle", configurable: true, });
// onbeforetoggle
curMemoryArea.onbeforetoggle_setter = function onbeforetoggle(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforetoggle_setter);
Object.defineProperty(curMemoryArea.onbeforetoggle_setter, "name", { value: "set onbeforetoggle", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforetoggle", { get: curMemoryArea.onbeforetoggle_getter, set: curMemoryArea.onbeforetoggle_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforetoggle_smart_getter = function onbeforetoggle() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforetoggle的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforetoggle_smart_getter);
Document.prototype.__defineGetter__("onbeforetoggle", curMemoryArea.onbeforetoggle_smart_getter);

// onblur
curMemoryArea.onblur_getter = function onblur() { debugger; }; mframe.safefunction(curMemoryArea.onblur_getter);
Object.defineProperty(curMemoryArea.onblur_getter, "name", { value: "get onblur", configurable: true, });
// onblur
curMemoryArea.onblur_setter = function onblur(val) { debugger; }; mframe.safefunction(curMemoryArea.onblur_setter);
Object.defineProperty(curMemoryArea.onblur_setter, "name", { value: "set onblur", configurable: true, });
Object.defineProperty(Document.prototype, "onblur", { get: curMemoryArea.onblur_getter, set: curMemoryArea.onblur_setter, enumerable: true, configurable: true, });
curMemoryArea.onblur_smart_getter = function onblur() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onblur的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onblur_smart_getter);
Document.prototype.__defineGetter__("onblur", curMemoryArea.onblur_smart_getter);

// oncancel
curMemoryArea.oncancel_getter = function oncancel() { debugger; }; mframe.safefunction(curMemoryArea.oncancel_getter);
Object.defineProperty(curMemoryArea.oncancel_getter, "name", { value: "get oncancel", configurable: true, });
// oncancel
curMemoryArea.oncancel_setter = function oncancel(val) { debugger; }; mframe.safefunction(curMemoryArea.oncancel_setter);
Object.defineProperty(curMemoryArea.oncancel_setter, "name", { value: "set oncancel", configurable: true, });
Object.defineProperty(Document.prototype, "oncancel", { get: curMemoryArea.oncancel_getter, set: curMemoryArea.oncancel_setter, enumerable: true, configurable: true, });
curMemoryArea.oncancel_smart_getter = function oncancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncancel_smart_getter);
Document.prototype.__defineGetter__("oncancel", curMemoryArea.oncancel_smart_getter);

// oncanplay
curMemoryArea.oncanplay_getter = function oncanplay() { debugger; }; mframe.safefunction(curMemoryArea.oncanplay_getter);
Object.defineProperty(curMemoryArea.oncanplay_getter, "name", { value: "get oncanplay", configurable: true, });
// oncanplay
curMemoryArea.oncanplay_setter = function oncanplay(val) { debugger; }; mframe.safefunction(curMemoryArea.oncanplay_setter);
Object.defineProperty(curMemoryArea.oncanplay_setter, "name", { value: "set oncanplay", configurable: true, });
Object.defineProperty(Document.prototype, "oncanplay", { get: curMemoryArea.oncanplay_getter, set: curMemoryArea.oncanplay_setter, enumerable: true, configurable: true, });
curMemoryArea.oncanplay_smart_getter = function oncanplay() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncanplay的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncanplay_smart_getter);
Document.prototype.__defineGetter__("oncanplay", curMemoryArea.oncanplay_smart_getter);

// oncanplaythrough
curMemoryArea.oncanplaythrough_getter = function oncanplaythrough() { debugger; }; mframe.safefunction(curMemoryArea.oncanplaythrough_getter);
Object.defineProperty(curMemoryArea.oncanplaythrough_getter, "name", { value: "get oncanplaythrough", configurable: true, });
// oncanplaythrough
curMemoryArea.oncanplaythrough_setter = function oncanplaythrough(val) { debugger; }; mframe.safefunction(curMemoryArea.oncanplaythrough_setter);
Object.defineProperty(curMemoryArea.oncanplaythrough_setter, "name", { value: "set oncanplaythrough", configurable: true, });
Object.defineProperty(Document.prototype, "oncanplaythrough", { get: curMemoryArea.oncanplaythrough_getter, set: curMemoryArea.oncanplaythrough_setter, enumerable: true, configurable: true, });
curMemoryArea.oncanplaythrough_smart_getter = function oncanplaythrough() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncanplaythrough的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncanplaythrough_smart_getter);
Document.prototype.__defineGetter__("oncanplaythrough", curMemoryArea.oncanplaythrough_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { debugger; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", { value: "get onchange", configurable: true, });
// onchange
curMemoryArea.onchange_setter = function onchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", { value: "set onchange", configurable: true, });
Object.defineProperty(Document.prototype, "onchange", { get: curMemoryArea.onchange_getter, set: curMemoryArea.onchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onchange_smart_getter = function onchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
Document.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// onclick
curMemoryArea.onclick_getter = function onclick() { debugger; }; mframe.safefunction(curMemoryArea.onclick_getter);
Object.defineProperty(curMemoryArea.onclick_getter, "name", { value: "get onclick", configurable: true, });
// onclick
curMemoryArea.onclick_setter = function onclick(val) { debugger; }; mframe.safefunction(curMemoryArea.onclick_setter);
Object.defineProperty(curMemoryArea.onclick_setter, "name", { value: "set onclick", configurable: true, });
Object.defineProperty(Document.prototype, "onclick", { get: curMemoryArea.onclick_getter, set: curMemoryArea.onclick_setter, enumerable: true, configurable: true, });
curMemoryArea.onclick_smart_getter = function onclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onclick_smart_getter);
Document.prototype.__defineGetter__("onclick", curMemoryArea.onclick_smart_getter);

// onclose
curMemoryArea.onclose_getter = function onclose() { debugger; }; mframe.safefunction(curMemoryArea.onclose_getter);
Object.defineProperty(curMemoryArea.onclose_getter, "name", { value: "get onclose", configurable: true, });
// onclose
curMemoryArea.onclose_setter = function onclose(val) { debugger; }; mframe.safefunction(curMemoryArea.onclose_setter);
Object.defineProperty(curMemoryArea.onclose_setter, "name", { value: "set onclose", configurable: true, });
Object.defineProperty(Document.prototype, "onclose", { get: curMemoryArea.onclose_getter, set: curMemoryArea.onclose_setter, enumerable: true, configurable: true, });
curMemoryArea.onclose_smart_getter = function onclose() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onclose的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onclose_smart_getter);
Document.prototype.__defineGetter__("onclose", curMemoryArea.onclose_smart_getter);

// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_getter = function oncontentvisibilityautostatechange() { debugger; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_getter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_getter, "name", { value: "get oncontentvisibilityautostatechange", configurable: true, });
// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_setter = function oncontentvisibilityautostatechange(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_setter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_setter, "name", { value: "set oncontentvisibilityautostatechange", configurable: true, });
Object.defineProperty(Document.prototype, "oncontentvisibilityautostatechange", { get: curMemoryArea.oncontentvisibilityautostatechange_getter, set: curMemoryArea.oncontentvisibilityautostatechange_setter, enumerable: true, configurable: true, });
curMemoryArea.oncontentvisibilityautostatechange_smart_getter = function oncontentvisibilityautostatechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncontentvisibilityautostatechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_smart_getter);
Document.prototype.__defineGetter__("oncontentvisibilityautostatechange", curMemoryArea.oncontentvisibilityautostatechange_smart_getter);

// oncontextlost
curMemoryArea.oncontextlost_getter = function oncontextlost() { debugger; }; mframe.safefunction(curMemoryArea.oncontextlost_getter);
Object.defineProperty(curMemoryArea.oncontextlost_getter, "name", { value: "get oncontextlost", configurable: true, });
// oncontextlost
curMemoryArea.oncontextlost_setter = function oncontextlost(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextlost_setter);
Object.defineProperty(curMemoryArea.oncontextlost_setter, "name", { value: "set oncontextlost", configurable: true, });
Object.defineProperty(Document.prototype, "oncontextlost", { get: curMemoryArea.oncontextlost_getter, set: curMemoryArea.oncontextlost_setter, enumerable: true, configurable: true, });
curMemoryArea.oncontextlost_smart_getter = function oncontextlost() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncontextlost的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncontextlost_smart_getter);
Document.prototype.__defineGetter__("oncontextlost", curMemoryArea.oncontextlost_smart_getter);

// oncontextmenu
curMemoryArea.oncontextmenu_getter = function oncontextmenu() { debugger; }; mframe.safefunction(curMemoryArea.oncontextmenu_getter);
Object.defineProperty(curMemoryArea.oncontextmenu_getter, "name", { value: "get oncontextmenu", configurable: true, });
// oncontextmenu
curMemoryArea.oncontextmenu_setter = function oncontextmenu(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextmenu_setter);
Object.defineProperty(curMemoryArea.oncontextmenu_setter, "name", { value: "set oncontextmenu", configurable: true, });
Object.defineProperty(Document.prototype, "oncontextmenu", { get: curMemoryArea.oncontextmenu_getter, set: curMemoryArea.oncontextmenu_setter, enumerable: true, configurable: true, });
curMemoryArea.oncontextmenu_smart_getter = function oncontextmenu() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncontextmenu的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncontextmenu_smart_getter);
Document.prototype.__defineGetter__("oncontextmenu", curMemoryArea.oncontextmenu_smart_getter);

// oncontextrestored
curMemoryArea.oncontextrestored_getter = function oncontextrestored() { debugger; }; mframe.safefunction(curMemoryArea.oncontextrestored_getter);
Object.defineProperty(curMemoryArea.oncontextrestored_getter, "name", { value: "get oncontextrestored", configurable: true, });
// oncontextrestored
curMemoryArea.oncontextrestored_setter = function oncontextrestored(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextrestored_setter);
Object.defineProperty(curMemoryArea.oncontextrestored_setter, "name", { value: "set oncontextrestored", configurable: true, });
Object.defineProperty(Document.prototype, "oncontextrestored", { get: curMemoryArea.oncontextrestored_getter, set: curMemoryArea.oncontextrestored_setter, enumerable: true, configurable: true, });
curMemoryArea.oncontextrestored_smart_getter = function oncontextrestored() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncontextrestored的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncontextrestored_smart_getter);
Document.prototype.__defineGetter__("oncontextrestored", curMemoryArea.oncontextrestored_smart_getter);

// oncuechange
curMemoryArea.oncuechange_getter = function oncuechange() { debugger; }; mframe.safefunction(curMemoryArea.oncuechange_getter);
Object.defineProperty(curMemoryArea.oncuechange_getter, "name", { value: "get oncuechange", configurable: true, });
// oncuechange
curMemoryArea.oncuechange_setter = function oncuechange(val) { debugger; }; mframe.safefunction(curMemoryArea.oncuechange_setter);
Object.defineProperty(curMemoryArea.oncuechange_setter, "name", { value: "set oncuechange", configurable: true, });
Object.defineProperty(Document.prototype, "oncuechange", { get: curMemoryArea.oncuechange_getter, set: curMemoryArea.oncuechange_setter, enumerable: true, configurable: true, });
curMemoryArea.oncuechange_smart_getter = function oncuechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncuechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncuechange_smart_getter);
Document.prototype.__defineGetter__("oncuechange", curMemoryArea.oncuechange_smart_getter);

// ondblclick
curMemoryArea.ondblclick_getter = function ondblclick() { debugger; }; mframe.safefunction(curMemoryArea.ondblclick_getter);
Object.defineProperty(curMemoryArea.ondblclick_getter, "name", { value: "get ondblclick", configurable: true, });
// ondblclick
curMemoryArea.ondblclick_setter = function ondblclick(val) { debugger; }; mframe.safefunction(curMemoryArea.ondblclick_setter);
Object.defineProperty(curMemoryArea.ondblclick_setter, "name", { value: "set ondblclick", configurable: true, });
Object.defineProperty(Document.prototype, "ondblclick", { get: curMemoryArea.ondblclick_getter, set: curMemoryArea.ondblclick_setter, enumerable: true, configurable: true, });
curMemoryArea.ondblclick_smart_getter = function ondblclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondblclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondblclick_smart_getter);
Document.prototype.__defineGetter__("ondblclick", curMemoryArea.ondblclick_smart_getter);

// ondrag
curMemoryArea.ondrag_getter = function ondrag() { debugger; }; mframe.safefunction(curMemoryArea.ondrag_getter);
Object.defineProperty(curMemoryArea.ondrag_getter, "name", { value: "get ondrag", configurable: true, });
// ondrag
curMemoryArea.ondrag_setter = function ondrag(val) { debugger; }; mframe.safefunction(curMemoryArea.ondrag_setter);
Object.defineProperty(curMemoryArea.ondrag_setter, "name", { value: "set ondrag", configurable: true, });
Object.defineProperty(Document.prototype, "ondrag", { get: curMemoryArea.ondrag_getter, set: curMemoryArea.ondrag_setter, enumerable: true, configurable: true, });
curMemoryArea.ondrag_smart_getter = function ondrag() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondrag的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondrag_smart_getter);
Document.prototype.__defineGetter__("ondrag", curMemoryArea.ondrag_smart_getter);

// ondragend
curMemoryArea.ondragend_getter = function ondragend() { debugger; }; mframe.safefunction(curMemoryArea.ondragend_getter);
Object.defineProperty(curMemoryArea.ondragend_getter, "name", { value: "get ondragend", configurable: true, });
// ondragend
curMemoryArea.ondragend_setter = function ondragend(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragend_setter);
Object.defineProperty(curMemoryArea.ondragend_setter, "name", { value: "set ondragend", configurable: true, });
Object.defineProperty(Document.prototype, "ondragend", { get: curMemoryArea.ondragend_getter, set: curMemoryArea.ondragend_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragend_smart_getter = function ondragend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragend_smart_getter);
Document.prototype.__defineGetter__("ondragend", curMemoryArea.ondragend_smart_getter);

// ondragenter
curMemoryArea.ondragenter_getter = function ondragenter() { debugger; }; mframe.safefunction(curMemoryArea.ondragenter_getter);
Object.defineProperty(curMemoryArea.ondragenter_getter, "name", { value: "get ondragenter", configurable: true, });
// ondragenter
curMemoryArea.ondragenter_setter = function ondragenter(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragenter_setter);
Object.defineProperty(curMemoryArea.ondragenter_setter, "name", { value: "set ondragenter", configurable: true, });
Object.defineProperty(Document.prototype, "ondragenter", { get: curMemoryArea.ondragenter_getter, set: curMemoryArea.ondragenter_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragenter_smart_getter = function ondragenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragenter_smart_getter);
Document.prototype.__defineGetter__("ondragenter", curMemoryArea.ondragenter_smart_getter);

// ondragleave
curMemoryArea.ondragleave_getter = function ondragleave() { debugger; }; mframe.safefunction(curMemoryArea.ondragleave_getter);
Object.defineProperty(curMemoryArea.ondragleave_getter, "name", { value: "get ondragleave", configurable: true, });
// ondragleave
curMemoryArea.ondragleave_setter = function ondragleave(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragleave_setter);
Object.defineProperty(curMemoryArea.ondragleave_setter, "name", { value: "set ondragleave", configurable: true, });
Object.defineProperty(Document.prototype, "ondragleave", { get: curMemoryArea.ondragleave_getter, set: curMemoryArea.ondragleave_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragleave_smart_getter = function ondragleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragleave_smart_getter);
Document.prototype.__defineGetter__("ondragleave", curMemoryArea.ondragleave_smart_getter);

// ondragover
curMemoryArea.ondragover_getter = function ondragover() { debugger; }; mframe.safefunction(curMemoryArea.ondragover_getter);
Object.defineProperty(curMemoryArea.ondragover_getter, "name", { value: "get ondragover", configurable: true, });
// ondragover
curMemoryArea.ondragover_setter = function ondragover(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragover_setter);
Object.defineProperty(curMemoryArea.ondragover_setter, "name", { value: "set ondragover", configurable: true, });
Object.defineProperty(Document.prototype, "ondragover", { get: curMemoryArea.ondragover_getter, set: curMemoryArea.ondragover_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragover_smart_getter = function ondragover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragover_smart_getter);
Document.prototype.__defineGetter__("ondragover", curMemoryArea.ondragover_smart_getter);

// ondragstart
curMemoryArea.ondragstart_getter = function ondragstart() { debugger; }; mframe.safefunction(curMemoryArea.ondragstart_getter);
Object.defineProperty(curMemoryArea.ondragstart_getter, "name", { value: "get ondragstart", configurable: true, });
// ondragstart
curMemoryArea.ondragstart_setter = function ondragstart(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragstart_setter);
Object.defineProperty(curMemoryArea.ondragstart_setter, "name", { value: "set ondragstart", configurable: true, });
Object.defineProperty(Document.prototype, "ondragstart", { get: curMemoryArea.ondragstart_getter, set: curMemoryArea.ondragstart_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragstart_smart_getter = function ondragstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragstart_smart_getter);
Document.prototype.__defineGetter__("ondragstart", curMemoryArea.ondragstart_smart_getter);

// ondrop
curMemoryArea.ondrop_getter = function ondrop() { debugger; }; mframe.safefunction(curMemoryArea.ondrop_getter);
Object.defineProperty(curMemoryArea.ondrop_getter, "name", { value: "get ondrop", configurable: true, });
// ondrop
curMemoryArea.ondrop_setter = function ondrop(val) { debugger; }; mframe.safefunction(curMemoryArea.ondrop_setter);
Object.defineProperty(curMemoryArea.ondrop_setter, "name", { value: "set ondrop", configurable: true, });
Object.defineProperty(Document.prototype, "ondrop", { get: curMemoryArea.ondrop_getter, set: curMemoryArea.ondrop_setter, enumerable: true, configurable: true, });
curMemoryArea.ondrop_smart_getter = function ondrop() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondrop的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondrop_smart_getter);
Document.prototype.__defineGetter__("ondrop", curMemoryArea.ondrop_smart_getter);

// ondurationchange
curMemoryArea.ondurationchange_getter = function ondurationchange() { debugger; }; mframe.safefunction(curMemoryArea.ondurationchange_getter);
Object.defineProperty(curMemoryArea.ondurationchange_getter, "name", { value: "get ondurationchange", configurable: true, });
// ondurationchange
curMemoryArea.ondurationchange_setter = function ondurationchange(val) { debugger; }; mframe.safefunction(curMemoryArea.ondurationchange_setter);
Object.defineProperty(curMemoryArea.ondurationchange_setter, "name", { value: "set ondurationchange", configurable: true, });
Object.defineProperty(Document.prototype, "ondurationchange", { get: curMemoryArea.ondurationchange_getter, set: curMemoryArea.ondurationchange_setter, enumerable: true, configurable: true, });
curMemoryArea.ondurationchange_smart_getter = function ondurationchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondurationchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondurationchange_smart_getter);
Document.prototype.__defineGetter__("ondurationchange", curMemoryArea.ondurationchange_smart_getter);

// onemptied
curMemoryArea.onemptied_getter = function onemptied() { debugger; }; mframe.safefunction(curMemoryArea.onemptied_getter);
Object.defineProperty(curMemoryArea.onemptied_getter, "name", { value: "get onemptied", configurable: true, });
// onemptied
curMemoryArea.onemptied_setter = function onemptied(val) { debugger; }; mframe.safefunction(curMemoryArea.onemptied_setter);
Object.defineProperty(curMemoryArea.onemptied_setter, "name", { value: "set onemptied", configurable: true, });
Object.defineProperty(Document.prototype, "onemptied", { get: curMemoryArea.onemptied_getter, set: curMemoryArea.onemptied_setter, enumerable: true, configurable: true, });
curMemoryArea.onemptied_smart_getter = function onemptied() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onemptied的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onemptied_smart_getter);
Document.prototype.__defineGetter__("onemptied", curMemoryArea.onemptied_smart_getter);

// onended
curMemoryArea.onended_getter = function onended() { debugger; }; mframe.safefunction(curMemoryArea.onended_getter);
Object.defineProperty(curMemoryArea.onended_getter, "name", { value: "get onended", configurable: true, });
// onended
curMemoryArea.onended_setter = function onended(val) { debugger; }; mframe.safefunction(curMemoryArea.onended_setter);
Object.defineProperty(curMemoryArea.onended_setter, "name", { value: "set onended", configurable: true, });
Object.defineProperty(Document.prototype, "onended", { get: curMemoryArea.onended_getter, set: curMemoryArea.onended_setter, enumerable: true, configurable: true, });
curMemoryArea.onended_smart_getter = function onended() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onended的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onended_smart_getter);
Document.prototype.__defineGetter__("onended", curMemoryArea.onended_smart_getter);

// onerror
curMemoryArea.onerror_getter = function onerror() { debugger; }; mframe.safefunction(curMemoryArea.onerror_getter);
Object.defineProperty(curMemoryArea.onerror_getter, "name", { value: "get onerror", configurable: true, });
// onerror
curMemoryArea.onerror_setter = function onerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onerror_setter);
Object.defineProperty(curMemoryArea.onerror_setter, "name", { value: "set onerror", configurable: true, });
Object.defineProperty(Document.prototype, "onerror", { get: curMemoryArea.onerror_getter, set: curMemoryArea.onerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onerror_smart_getter = function onerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onerror_smart_getter);
Document.prototype.__defineGetter__("onerror", curMemoryArea.onerror_smart_getter);

// onfocus
curMemoryArea.onfocus_getter = function onfocus() { debugger; }; mframe.safefunction(curMemoryArea.onfocus_getter);
Object.defineProperty(curMemoryArea.onfocus_getter, "name", { value: "get onfocus", configurable: true, });
// onfocus
curMemoryArea.onfocus_setter = function onfocus(val) { debugger; }; mframe.safefunction(curMemoryArea.onfocus_setter);
Object.defineProperty(curMemoryArea.onfocus_setter, "name", { value: "set onfocus", configurable: true, });
Object.defineProperty(Document.prototype, "onfocus", { get: curMemoryArea.onfocus_getter, set: curMemoryArea.onfocus_setter, enumerable: true, configurable: true, });
curMemoryArea.onfocus_smart_getter = function onfocus() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onfocus的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfocus_smart_getter);
Document.prototype.__defineGetter__("onfocus", curMemoryArea.onfocus_smart_getter);

// onformdata
curMemoryArea.onformdata_getter = function onformdata() { debugger; }; mframe.safefunction(curMemoryArea.onformdata_getter);
Object.defineProperty(curMemoryArea.onformdata_getter, "name", { value: "get onformdata", configurable: true, });
// onformdata
curMemoryArea.onformdata_setter = function onformdata(val) { debugger; }; mframe.safefunction(curMemoryArea.onformdata_setter);
Object.defineProperty(curMemoryArea.onformdata_setter, "name", { value: "set onformdata", configurable: true, });
Object.defineProperty(Document.prototype, "onformdata", { get: curMemoryArea.onformdata_getter, set: curMemoryArea.onformdata_setter, enumerable: true, configurable: true, });
curMemoryArea.onformdata_smart_getter = function onformdata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onformdata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onformdata_smart_getter);
Document.prototype.__defineGetter__("onformdata", curMemoryArea.onformdata_smart_getter);

// oninput
curMemoryArea.oninput_getter = function oninput() { debugger; }; mframe.safefunction(curMemoryArea.oninput_getter);
Object.defineProperty(curMemoryArea.oninput_getter, "name", { value: "get oninput", configurable: true, });
// oninput
curMemoryArea.oninput_setter = function oninput(val) { debugger; }; mframe.safefunction(curMemoryArea.oninput_setter);
Object.defineProperty(curMemoryArea.oninput_setter, "name", { value: "set oninput", configurable: true, });
Object.defineProperty(Document.prototype, "oninput", { get: curMemoryArea.oninput_getter, set: curMemoryArea.oninput_setter, enumerable: true, configurable: true, });
curMemoryArea.oninput_smart_getter = function oninput() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oninput的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oninput_smart_getter);
Document.prototype.__defineGetter__("oninput", curMemoryArea.oninput_smart_getter);

// oninvalid
curMemoryArea.oninvalid_getter = function oninvalid() { debugger; }; mframe.safefunction(curMemoryArea.oninvalid_getter);
Object.defineProperty(curMemoryArea.oninvalid_getter, "name", { value: "get oninvalid", configurable: true, });
// oninvalid
curMemoryArea.oninvalid_setter = function oninvalid(val) { debugger; }; mframe.safefunction(curMemoryArea.oninvalid_setter);
Object.defineProperty(curMemoryArea.oninvalid_setter, "name", { value: "set oninvalid", configurable: true, });
Object.defineProperty(Document.prototype, "oninvalid", { get: curMemoryArea.oninvalid_getter, set: curMemoryArea.oninvalid_setter, enumerable: true, configurable: true, });
curMemoryArea.oninvalid_smart_getter = function oninvalid() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oninvalid的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oninvalid_smart_getter);
Document.prototype.__defineGetter__("oninvalid", curMemoryArea.oninvalid_smart_getter);

// onkeydown
curMemoryArea.onkeydown_getter = function onkeydown() { debugger; }; mframe.safefunction(curMemoryArea.onkeydown_getter);
Object.defineProperty(curMemoryArea.onkeydown_getter, "name", { value: "get onkeydown", configurable: true, });
// onkeydown
curMemoryArea.onkeydown_setter = function onkeydown(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeydown_setter);
Object.defineProperty(curMemoryArea.onkeydown_setter, "name", { value: "set onkeydown", configurable: true, });
Object.defineProperty(Document.prototype, "onkeydown", { get: curMemoryArea.onkeydown_getter, set: curMemoryArea.onkeydown_setter, enumerable: true, configurable: true, });
curMemoryArea.onkeydown_smart_getter = function onkeydown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onkeydown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onkeydown_smart_getter);
Document.prototype.__defineGetter__("onkeydown", curMemoryArea.onkeydown_smart_getter);

// onkeypress
curMemoryArea.onkeypress_getter = function onkeypress() { debugger; }; mframe.safefunction(curMemoryArea.onkeypress_getter);
Object.defineProperty(curMemoryArea.onkeypress_getter, "name", { value: "get onkeypress", configurable: true, });
// onkeypress
curMemoryArea.onkeypress_setter = function onkeypress(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeypress_setter);
Object.defineProperty(curMemoryArea.onkeypress_setter, "name", { value: "set onkeypress", configurable: true, });
Object.defineProperty(Document.prototype, "onkeypress", { get: curMemoryArea.onkeypress_getter, set: curMemoryArea.onkeypress_setter, enumerable: true, configurable: true, });
curMemoryArea.onkeypress_smart_getter = function onkeypress() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onkeypress的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onkeypress_smart_getter);
Document.prototype.__defineGetter__("onkeypress", curMemoryArea.onkeypress_smart_getter);

// onkeyup
curMemoryArea.onkeyup_getter = function onkeyup() { debugger; }; mframe.safefunction(curMemoryArea.onkeyup_getter);
Object.defineProperty(curMemoryArea.onkeyup_getter, "name", { value: "get onkeyup", configurable: true, });
// onkeyup
curMemoryArea.onkeyup_setter = function onkeyup(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeyup_setter);
Object.defineProperty(curMemoryArea.onkeyup_setter, "name", { value: "set onkeyup", configurable: true, });
Object.defineProperty(Document.prototype, "onkeyup", { get: curMemoryArea.onkeyup_getter, set: curMemoryArea.onkeyup_setter, enumerable: true, configurable: true, });
curMemoryArea.onkeyup_smart_getter = function onkeyup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onkeyup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onkeyup_smart_getter);
Document.prototype.__defineGetter__("onkeyup", curMemoryArea.onkeyup_smart_getter);

// onload
curMemoryArea.onload_getter = function onload() { debugger; }; mframe.safefunction(curMemoryArea.onload_getter);
Object.defineProperty(curMemoryArea.onload_getter, "name", { value: "get onload", configurable: true, });
// onload
curMemoryArea.onload_setter = function onload(val) { debugger; }; mframe.safefunction(curMemoryArea.onload_setter);
Object.defineProperty(curMemoryArea.onload_setter, "name", { value: "set onload", configurable: true, });
Object.defineProperty(Document.prototype, "onload", { get: curMemoryArea.onload_getter, set: curMemoryArea.onload_setter, enumerable: true, configurable: true, });
curMemoryArea.onload_smart_getter = function onload() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onload的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onload_smart_getter);
Document.prototype.__defineGetter__("onload", curMemoryArea.onload_smart_getter);

// onloadeddata
curMemoryArea.onloadeddata_getter = function onloadeddata() { debugger; }; mframe.safefunction(curMemoryArea.onloadeddata_getter);
Object.defineProperty(curMemoryArea.onloadeddata_getter, "name", { value: "get onloadeddata", configurable: true, });
// onloadeddata
curMemoryArea.onloadeddata_setter = function onloadeddata(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadeddata_setter);
Object.defineProperty(curMemoryArea.onloadeddata_setter, "name", { value: "set onloadeddata", configurable: true, });
Object.defineProperty(Document.prototype, "onloadeddata", { get: curMemoryArea.onloadeddata_getter, set: curMemoryArea.onloadeddata_setter, enumerable: true, configurable: true, });
curMemoryArea.onloadeddata_smart_getter = function onloadeddata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onloadeddata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onloadeddata_smart_getter);
Document.prototype.__defineGetter__("onloadeddata", curMemoryArea.onloadeddata_smart_getter);

// onloadedmetadata
curMemoryArea.onloadedmetadata_getter = function onloadedmetadata() { debugger; }; mframe.safefunction(curMemoryArea.onloadedmetadata_getter);
Object.defineProperty(curMemoryArea.onloadedmetadata_getter, "name", { value: "get onloadedmetadata", configurable: true, });
// onloadedmetadata
curMemoryArea.onloadedmetadata_setter = function onloadedmetadata(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadedmetadata_setter);
Object.defineProperty(curMemoryArea.onloadedmetadata_setter, "name", { value: "set onloadedmetadata", configurable: true, });
Object.defineProperty(Document.prototype, "onloadedmetadata", { get: curMemoryArea.onloadedmetadata_getter, set: curMemoryArea.onloadedmetadata_setter, enumerable: true, configurable: true, });
curMemoryArea.onloadedmetadata_smart_getter = function onloadedmetadata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onloadedmetadata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onloadedmetadata_smart_getter);
Document.prototype.__defineGetter__("onloadedmetadata", curMemoryArea.onloadedmetadata_smart_getter);

// onloadstart
curMemoryArea.onloadstart_getter = function onloadstart() { debugger; }; mframe.safefunction(curMemoryArea.onloadstart_getter);
Object.defineProperty(curMemoryArea.onloadstart_getter, "name", { value: "get onloadstart", configurable: true, });
// onloadstart
curMemoryArea.onloadstart_setter = function onloadstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadstart_setter);
Object.defineProperty(curMemoryArea.onloadstart_setter, "name", { value: "set onloadstart", configurable: true, });
Object.defineProperty(Document.prototype, "onloadstart", { get: curMemoryArea.onloadstart_getter, set: curMemoryArea.onloadstart_setter, enumerable: true, configurable: true, });
curMemoryArea.onloadstart_smart_getter = function onloadstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onloadstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onloadstart_smart_getter);
Document.prototype.__defineGetter__("onloadstart", curMemoryArea.onloadstart_smart_getter);

// onmousedown
curMemoryArea.onmousedown_getter = function onmousedown() { debugger; }; mframe.safefunction(curMemoryArea.onmousedown_getter);
Object.defineProperty(curMemoryArea.onmousedown_getter, "name", { value: "get onmousedown", configurable: true, });
// onmousedown
curMemoryArea.onmousedown_setter = function onmousedown(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousedown_setter);
Object.defineProperty(curMemoryArea.onmousedown_setter, "name", { value: "set onmousedown", configurable: true, });
Object.defineProperty(Document.prototype, "onmousedown", { get: curMemoryArea.onmousedown_getter, set: curMemoryArea.onmousedown_setter, enumerable: true, configurable: true, });
curMemoryArea.onmousedown_smart_getter = function onmousedown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmousedown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmousedown_smart_getter);
Document.prototype.__defineGetter__("onmousedown", curMemoryArea.onmousedown_smart_getter);

// onmouseenter
curMemoryArea.onmouseenter_getter = function onmouseenter() { debugger; }; mframe.safefunction(curMemoryArea.onmouseenter_getter);
Object.defineProperty(curMemoryArea.onmouseenter_getter, "name", { value: "get onmouseenter", configurable: true, });
// onmouseenter
curMemoryArea.onmouseenter_setter = function onmouseenter(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseenter_setter);
Object.defineProperty(curMemoryArea.onmouseenter_setter, "name", { value: "set onmouseenter", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseenter", { get: curMemoryArea.onmouseenter_getter, set: curMemoryArea.onmouseenter_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseenter_smart_getter = function onmouseenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseenter_smart_getter);
Document.prototype.__defineGetter__("onmouseenter", curMemoryArea.onmouseenter_smart_getter);

// onmouseleave
curMemoryArea.onmouseleave_getter = function onmouseleave() { debugger; }; mframe.safefunction(curMemoryArea.onmouseleave_getter);
Object.defineProperty(curMemoryArea.onmouseleave_getter, "name", { value: "get onmouseleave", configurable: true, });
// onmouseleave
curMemoryArea.onmouseleave_setter = function onmouseleave(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseleave_setter);
Object.defineProperty(curMemoryArea.onmouseleave_setter, "name", { value: "set onmouseleave", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseleave", { get: curMemoryArea.onmouseleave_getter, set: curMemoryArea.onmouseleave_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseleave_smart_getter = function onmouseleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseleave_smart_getter);
Document.prototype.__defineGetter__("onmouseleave", curMemoryArea.onmouseleave_smart_getter);

// onmousemove
curMemoryArea.onmousemove_getter = function onmousemove() { debugger; }; mframe.safefunction(curMemoryArea.onmousemove_getter);
Object.defineProperty(curMemoryArea.onmousemove_getter, "name", { value: "get onmousemove", configurable: true, });
// onmousemove
curMemoryArea.onmousemove_setter = function onmousemove(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousemove_setter);
Object.defineProperty(curMemoryArea.onmousemove_setter, "name", { value: "set onmousemove", configurable: true, });
Object.defineProperty(Document.prototype, "onmousemove", { get: curMemoryArea.onmousemove_getter, set: curMemoryArea.onmousemove_setter, enumerable: true, configurable: true, });
curMemoryArea.onmousemove_smart_getter = function onmousemove() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmousemove的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmousemove_smart_getter);
Document.prototype.__defineGetter__("onmousemove", curMemoryArea.onmousemove_smart_getter);

// onmouseout
curMemoryArea.onmouseout_getter = function onmouseout() { debugger; }; mframe.safefunction(curMemoryArea.onmouseout_getter);
Object.defineProperty(curMemoryArea.onmouseout_getter, "name", { value: "get onmouseout", configurable: true, });
// onmouseout
curMemoryArea.onmouseout_setter = function onmouseout(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseout_setter);
Object.defineProperty(curMemoryArea.onmouseout_setter, "name", { value: "set onmouseout", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseout", { get: curMemoryArea.onmouseout_getter, set: curMemoryArea.onmouseout_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseout_smart_getter = function onmouseout() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseout的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseout_smart_getter);
Document.prototype.__defineGetter__("onmouseout", curMemoryArea.onmouseout_smart_getter);

// onmouseover
curMemoryArea.onmouseover_getter = function onmouseover() { debugger; }; mframe.safefunction(curMemoryArea.onmouseover_getter);
Object.defineProperty(curMemoryArea.onmouseover_getter, "name", { value: "get onmouseover", configurable: true, });
// onmouseover
curMemoryArea.onmouseover_setter = function onmouseover(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseover_setter);
Object.defineProperty(curMemoryArea.onmouseover_setter, "name", { value: "set onmouseover", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseover", { get: curMemoryArea.onmouseover_getter, set: curMemoryArea.onmouseover_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseover_smart_getter = function onmouseover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseover_smart_getter);
Document.prototype.__defineGetter__("onmouseover", curMemoryArea.onmouseover_smart_getter);

// onmouseup
curMemoryArea.onmouseup_getter = function onmouseup() { debugger; }; mframe.safefunction(curMemoryArea.onmouseup_getter);
Object.defineProperty(curMemoryArea.onmouseup_getter, "name", { value: "get onmouseup", configurable: true, });
// onmouseup
curMemoryArea.onmouseup_setter = function onmouseup(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseup_setter);
Object.defineProperty(curMemoryArea.onmouseup_setter, "name", { value: "set onmouseup", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseup", { get: curMemoryArea.onmouseup_getter, set: curMemoryArea.onmouseup_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseup_smart_getter = function onmouseup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseup_smart_getter);
Document.prototype.__defineGetter__("onmouseup", curMemoryArea.onmouseup_smart_getter);

// onmousewheel
curMemoryArea.onmousewheel_getter = function onmousewheel() { debugger; }; mframe.safefunction(curMemoryArea.onmousewheel_getter);
Object.defineProperty(curMemoryArea.onmousewheel_getter, "name", { value: "get onmousewheel", configurable: true, });
// onmousewheel
curMemoryArea.onmousewheel_setter = function onmousewheel(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousewheel_setter);
Object.defineProperty(curMemoryArea.onmousewheel_setter, "name", { value: "set onmousewheel", configurable: true, });
Object.defineProperty(Document.prototype, "onmousewheel", { get: curMemoryArea.onmousewheel_getter, set: curMemoryArea.onmousewheel_setter, enumerable: true, configurable: true, });
curMemoryArea.onmousewheel_smart_getter = function onmousewheel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmousewheel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmousewheel_smart_getter);
Document.prototype.__defineGetter__("onmousewheel", curMemoryArea.onmousewheel_smart_getter);

// onpause
curMemoryArea.onpause_getter = function onpause() { debugger; }; mframe.safefunction(curMemoryArea.onpause_getter);
Object.defineProperty(curMemoryArea.onpause_getter, "name", { value: "get onpause", configurable: true, });
// onpause
curMemoryArea.onpause_setter = function onpause(val) { debugger; }; mframe.safefunction(curMemoryArea.onpause_setter);
Object.defineProperty(curMemoryArea.onpause_setter, "name", { value: "set onpause", configurable: true, });
Object.defineProperty(Document.prototype, "onpause", { get: curMemoryArea.onpause_getter, set: curMemoryArea.onpause_setter, enumerable: true, configurable: true, });
curMemoryArea.onpause_smart_getter = function onpause() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpause的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpause_smart_getter);
Document.prototype.__defineGetter__("onpause", curMemoryArea.onpause_smart_getter);

// onplay
curMemoryArea.onplay_getter = function onplay() { debugger; }; mframe.safefunction(curMemoryArea.onplay_getter);
Object.defineProperty(curMemoryArea.onplay_getter, "name", { value: "get onplay", configurable: true, });
// onplay
curMemoryArea.onplay_setter = function onplay(val) { debugger; }; mframe.safefunction(curMemoryArea.onplay_setter);
Object.defineProperty(curMemoryArea.onplay_setter, "name", { value: "set onplay", configurable: true, });
Object.defineProperty(Document.prototype, "onplay", { get: curMemoryArea.onplay_getter, set: curMemoryArea.onplay_setter, enumerable: true, configurable: true, });
curMemoryArea.onplay_smart_getter = function onplay() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onplay的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onplay_smart_getter);
Document.prototype.__defineGetter__("onplay", curMemoryArea.onplay_smart_getter);

// onplaying
curMemoryArea.onplaying_getter = function onplaying() { debugger; }; mframe.safefunction(curMemoryArea.onplaying_getter);
Object.defineProperty(curMemoryArea.onplaying_getter, "name", { value: "get onplaying", configurable: true, });
// onplaying
curMemoryArea.onplaying_setter = function onplaying(val) { debugger; }; mframe.safefunction(curMemoryArea.onplaying_setter);
Object.defineProperty(curMemoryArea.onplaying_setter, "name", { value: "set onplaying", configurable: true, });
Object.defineProperty(Document.prototype, "onplaying", { get: curMemoryArea.onplaying_getter, set: curMemoryArea.onplaying_setter, enumerable: true, configurable: true, });
curMemoryArea.onplaying_smart_getter = function onplaying() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onplaying的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onplaying_smart_getter);
Document.prototype.__defineGetter__("onplaying", curMemoryArea.onplaying_smart_getter);

// onprogress
curMemoryArea.onprogress_getter = function onprogress() { debugger; }; mframe.safefunction(curMemoryArea.onprogress_getter);
Object.defineProperty(curMemoryArea.onprogress_getter, "name", { value: "get onprogress", configurable: true, });
// onprogress
curMemoryArea.onprogress_setter = function onprogress(val) { debugger; }; mframe.safefunction(curMemoryArea.onprogress_setter);
Object.defineProperty(curMemoryArea.onprogress_setter, "name", { value: "set onprogress", configurable: true, });
Object.defineProperty(Document.prototype, "onprogress", { get: curMemoryArea.onprogress_getter, set: curMemoryArea.onprogress_setter, enumerable: true, configurable: true, });
curMemoryArea.onprogress_smart_getter = function onprogress() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onprogress的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onprogress_smart_getter);
Document.prototype.__defineGetter__("onprogress", curMemoryArea.onprogress_smart_getter);

// onratechange
curMemoryArea.onratechange_getter = function onratechange() { debugger; }; mframe.safefunction(curMemoryArea.onratechange_getter);
Object.defineProperty(curMemoryArea.onratechange_getter, "name", { value: "get onratechange", configurable: true, });
// onratechange
curMemoryArea.onratechange_setter = function onratechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onratechange_setter);
Object.defineProperty(curMemoryArea.onratechange_setter, "name", { value: "set onratechange", configurable: true, });
Object.defineProperty(Document.prototype, "onratechange", { get: curMemoryArea.onratechange_getter, set: curMemoryArea.onratechange_setter, enumerable: true, configurable: true, });
curMemoryArea.onratechange_smart_getter = function onratechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onratechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onratechange_smart_getter);
Document.prototype.__defineGetter__("onratechange", curMemoryArea.onratechange_smart_getter);

// onreset
curMemoryArea.onreset_getter = function onreset() { debugger; }; mframe.safefunction(curMemoryArea.onreset_getter);
Object.defineProperty(curMemoryArea.onreset_getter, "name", { value: "get onreset", configurable: true, });
// onreset
curMemoryArea.onreset_setter = function onreset(val) { debugger; }; mframe.safefunction(curMemoryArea.onreset_setter);
Object.defineProperty(curMemoryArea.onreset_setter, "name", { value: "set onreset", configurable: true, });
Object.defineProperty(Document.prototype, "onreset", { get: curMemoryArea.onreset_getter, set: curMemoryArea.onreset_setter, enumerable: true, configurable: true, });
curMemoryArea.onreset_smart_getter = function onreset() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onreset的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onreset_smart_getter);
Document.prototype.__defineGetter__("onreset", curMemoryArea.onreset_smart_getter);

// onresize
curMemoryArea.onresize_getter = function onresize() { debugger; }; mframe.safefunction(curMemoryArea.onresize_getter);
Object.defineProperty(curMemoryArea.onresize_getter, "name", { value: "get onresize", configurable: true, });
// onresize
curMemoryArea.onresize_setter = function onresize(val) { debugger; }; mframe.safefunction(curMemoryArea.onresize_setter);
Object.defineProperty(curMemoryArea.onresize_setter, "name", { value: "set onresize", configurable: true, });
Object.defineProperty(Document.prototype, "onresize", { get: curMemoryArea.onresize_getter, set: curMemoryArea.onresize_setter, enumerable: true, configurable: true, });
curMemoryArea.onresize_smart_getter = function onresize() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onresize的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onresize_smart_getter);
Document.prototype.__defineGetter__("onresize", curMemoryArea.onresize_smart_getter);

// onscroll
curMemoryArea.onscroll_getter = function onscroll() { debugger; }; mframe.safefunction(curMemoryArea.onscroll_getter);
Object.defineProperty(curMemoryArea.onscroll_getter, "name", { value: "get onscroll", configurable: true, });
// onscroll
curMemoryArea.onscroll_setter = function onscroll(val) { debugger; }; mframe.safefunction(curMemoryArea.onscroll_setter);
Object.defineProperty(curMemoryArea.onscroll_setter, "name", { value: "set onscroll", configurable: true, });
Object.defineProperty(Document.prototype, "onscroll", { get: curMemoryArea.onscroll_getter, set: curMemoryArea.onscroll_setter, enumerable: true, configurable: true, });
curMemoryArea.onscroll_smart_getter = function onscroll() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onscroll的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onscroll_smart_getter);
Document.prototype.__defineGetter__("onscroll", curMemoryArea.onscroll_smart_getter);

// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_getter = function onsecuritypolicyviolation() { debugger; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_getter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_getter, "name", { value: "get onsecuritypolicyviolation", configurable: true, });
// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_setter = function onsecuritypolicyviolation(val) { debugger; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_setter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_setter, "name", { value: "set onsecuritypolicyviolation", configurable: true, });
Object.defineProperty(Document.prototype, "onsecuritypolicyviolation", { get: curMemoryArea.onsecuritypolicyviolation_getter, set: curMemoryArea.onsecuritypolicyviolation_setter, enumerable: true, configurable: true, });
curMemoryArea.onsecuritypolicyviolation_smart_getter = function onsecuritypolicyviolation() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onsecuritypolicyviolation的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_smart_getter);
Document.prototype.__defineGetter__("onsecuritypolicyviolation", curMemoryArea.onsecuritypolicyviolation_smart_getter);

// onseeked
curMemoryArea.onseeked_getter = function onseeked() { debugger; }; mframe.safefunction(curMemoryArea.onseeked_getter);
Object.defineProperty(curMemoryArea.onseeked_getter, "name", { value: "get onseeked", configurable: true, });
// onseeked
curMemoryArea.onseeked_setter = function onseeked(val) { debugger; }; mframe.safefunction(curMemoryArea.onseeked_setter);
Object.defineProperty(curMemoryArea.onseeked_setter, "name", { value: "set onseeked", configurable: true, });
Object.defineProperty(Document.prototype, "onseeked", { get: curMemoryArea.onseeked_getter, set: curMemoryArea.onseeked_setter, enumerable: true, configurable: true, });
curMemoryArea.onseeked_smart_getter = function onseeked() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onseeked的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onseeked_smart_getter);
Document.prototype.__defineGetter__("onseeked", curMemoryArea.onseeked_smart_getter);

// onseeking
curMemoryArea.onseeking_getter = function onseeking() { debugger; }; mframe.safefunction(curMemoryArea.onseeking_getter);
Object.defineProperty(curMemoryArea.onseeking_getter, "name", { value: "get onseeking", configurable: true, });
// onseeking
curMemoryArea.onseeking_setter = function onseeking(val) { debugger; }; mframe.safefunction(curMemoryArea.onseeking_setter);
Object.defineProperty(curMemoryArea.onseeking_setter, "name", { value: "set onseeking", configurable: true, });
Object.defineProperty(Document.prototype, "onseeking", { get: curMemoryArea.onseeking_getter, set: curMemoryArea.onseeking_setter, enumerable: true, configurable: true, });
curMemoryArea.onseeking_smart_getter = function onseeking() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onseeking的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onseeking_smart_getter);
Document.prototype.__defineGetter__("onseeking", curMemoryArea.onseeking_smart_getter);

// onselect
curMemoryArea.onselect_getter = function onselect() { debugger; }; mframe.safefunction(curMemoryArea.onselect_getter);
Object.defineProperty(curMemoryArea.onselect_getter, "name", { value: "get onselect", configurable: true, });
// onselect
curMemoryArea.onselect_setter = function onselect(val) { debugger; }; mframe.safefunction(curMemoryArea.onselect_setter);
Object.defineProperty(curMemoryArea.onselect_setter, "name", { value: "set onselect", configurable: true, });
Object.defineProperty(Document.prototype, "onselect", { get: curMemoryArea.onselect_getter, set: curMemoryArea.onselect_setter, enumerable: true, configurable: true, });
curMemoryArea.onselect_smart_getter = function onselect() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onselect的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onselect_smart_getter);
Document.prototype.__defineGetter__("onselect", curMemoryArea.onselect_smart_getter);

// onslotchange
curMemoryArea.onslotchange_getter = function onslotchange() { debugger; }; mframe.safefunction(curMemoryArea.onslotchange_getter);
Object.defineProperty(curMemoryArea.onslotchange_getter, "name", { value: "get onslotchange", configurable: true, });
// onslotchange
curMemoryArea.onslotchange_setter = function onslotchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onslotchange_setter);
Object.defineProperty(curMemoryArea.onslotchange_setter, "name", { value: "set onslotchange", configurable: true, });
Object.defineProperty(Document.prototype, "onslotchange", { get: curMemoryArea.onslotchange_getter, set: curMemoryArea.onslotchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onslotchange_smart_getter = function onslotchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onslotchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onslotchange_smart_getter);
Document.prototype.__defineGetter__("onslotchange", curMemoryArea.onslotchange_smart_getter);

// onstalled
curMemoryArea.onstalled_getter = function onstalled() { debugger; }; mframe.safefunction(curMemoryArea.onstalled_getter);
Object.defineProperty(curMemoryArea.onstalled_getter, "name", { value: "get onstalled", configurable: true, });
// onstalled
curMemoryArea.onstalled_setter = function onstalled(val) { debugger; }; mframe.safefunction(curMemoryArea.onstalled_setter);
Object.defineProperty(curMemoryArea.onstalled_setter, "name", { value: "set onstalled", configurable: true, });
Object.defineProperty(Document.prototype, "onstalled", { get: curMemoryArea.onstalled_getter, set: curMemoryArea.onstalled_setter, enumerable: true, configurable: true, });
curMemoryArea.onstalled_smart_getter = function onstalled() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onstalled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onstalled_smart_getter);
Document.prototype.__defineGetter__("onstalled", curMemoryArea.onstalled_smart_getter);

// onsubmit
curMemoryArea.onsubmit_getter = function onsubmit() { debugger; }; mframe.safefunction(curMemoryArea.onsubmit_getter);
Object.defineProperty(curMemoryArea.onsubmit_getter, "name", { value: "get onsubmit", configurable: true, });
// onsubmit
curMemoryArea.onsubmit_setter = function onsubmit(val) { debugger; }; mframe.safefunction(curMemoryArea.onsubmit_setter);
Object.defineProperty(curMemoryArea.onsubmit_setter, "name", { value: "set onsubmit", configurable: true, });
Object.defineProperty(Document.prototype, "onsubmit", { get: curMemoryArea.onsubmit_getter, set: curMemoryArea.onsubmit_setter, enumerable: true, configurable: true, });
curMemoryArea.onsubmit_smart_getter = function onsubmit() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onsubmit的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsubmit_smart_getter);
Document.prototype.__defineGetter__("onsubmit", curMemoryArea.onsubmit_smart_getter);

// onsuspend
curMemoryArea.onsuspend_getter = function onsuspend() { debugger; }; mframe.safefunction(curMemoryArea.onsuspend_getter);
Object.defineProperty(curMemoryArea.onsuspend_getter, "name", { value: "get onsuspend", configurable: true, });
// onsuspend
curMemoryArea.onsuspend_setter = function onsuspend(val) { debugger; }; mframe.safefunction(curMemoryArea.onsuspend_setter);
Object.defineProperty(curMemoryArea.onsuspend_setter, "name", { value: "set onsuspend", configurable: true, });
Object.defineProperty(Document.prototype, "onsuspend", { get: curMemoryArea.onsuspend_getter, set: curMemoryArea.onsuspend_setter, enumerable: true, configurable: true, });
curMemoryArea.onsuspend_smart_getter = function onsuspend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onsuspend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsuspend_smart_getter);
Document.prototype.__defineGetter__("onsuspend", curMemoryArea.onsuspend_smart_getter);

// ontimeupdate
curMemoryArea.ontimeupdate_getter = function ontimeupdate() { debugger; }; mframe.safefunction(curMemoryArea.ontimeupdate_getter);
Object.defineProperty(curMemoryArea.ontimeupdate_getter, "name", { value: "get ontimeupdate", configurable: true, });
// ontimeupdate
curMemoryArea.ontimeupdate_setter = function ontimeupdate(val) { debugger; }; mframe.safefunction(curMemoryArea.ontimeupdate_setter);
Object.defineProperty(curMemoryArea.ontimeupdate_setter, "name", { value: "set ontimeupdate", configurable: true, });
Object.defineProperty(Document.prototype, "ontimeupdate", { get: curMemoryArea.ontimeupdate_getter, set: curMemoryArea.ontimeupdate_setter, enumerable: true, configurable: true, });
curMemoryArea.ontimeupdate_smart_getter = function ontimeupdate() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontimeupdate的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontimeupdate_smart_getter);
Document.prototype.__defineGetter__("ontimeupdate", curMemoryArea.ontimeupdate_smart_getter);

// ontoggle
curMemoryArea.ontoggle_getter = function ontoggle() { debugger; }; mframe.safefunction(curMemoryArea.ontoggle_getter);
Object.defineProperty(curMemoryArea.ontoggle_getter, "name", { value: "get ontoggle", configurable: true, });
// ontoggle
curMemoryArea.ontoggle_setter = function ontoggle(val) { debugger; }; mframe.safefunction(curMemoryArea.ontoggle_setter);
Object.defineProperty(curMemoryArea.ontoggle_setter, "name", { value: "set ontoggle", configurable: true, });
Object.defineProperty(Document.prototype, "ontoggle", { get: curMemoryArea.ontoggle_getter, set: curMemoryArea.ontoggle_setter, enumerable: true, configurable: true, });
curMemoryArea.ontoggle_smart_getter = function ontoggle() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontoggle的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontoggle_smart_getter);
Document.prototype.__defineGetter__("ontoggle", curMemoryArea.ontoggle_smart_getter);

// onvolumechange
curMemoryArea.onvolumechange_getter = function onvolumechange() { debugger; }; mframe.safefunction(curMemoryArea.onvolumechange_getter);
Object.defineProperty(curMemoryArea.onvolumechange_getter, "name", { value: "get onvolumechange", configurable: true, });
// onvolumechange
curMemoryArea.onvolumechange_setter = function onvolumechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onvolumechange_setter);
Object.defineProperty(curMemoryArea.onvolumechange_setter, "name", { value: "set onvolumechange", configurable: true, });
Object.defineProperty(Document.prototype, "onvolumechange", { get: curMemoryArea.onvolumechange_getter, set: curMemoryArea.onvolumechange_setter, enumerable: true, configurable: true, });
curMemoryArea.onvolumechange_smart_getter = function onvolumechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onvolumechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onvolumechange_smart_getter);
Document.prototype.__defineGetter__("onvolumechange", curMemoryArea.onvolumechange_smart_getter);

// onwaiting
curMemoryArea.onwaiting_getter = function onwaiting() { debugger; }; mframe.safefunction(curMemoryArea.onwaiting_getter);
Object.defineProperty(curMemoryArea.onwaiting_getter, "name", { value: "get onwaiting", configurable: true, });
// onwaiting
curMemoryArea.onwaiting_setter = function onwaiting(val) { debugger; }; mframe.safefunction(curMemoryArea.onwaiting_setter);
Object.defineProperty(curMemoryArea.onwaiting_setter, "name", { value: "set onwaiting", configurable: true, });
Object.defineProperty(Document.prototype, "onwaiting", { get: curMemoryArea.onwaiting_getter, set: curMemoryArea.onwaiting_setter, enumerable: true, configurable: true, });
curMemoryArea.onwaiting_smart_getter = function onwaiting() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwaiting的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwaiting_smart_getter);
Document.prototype.__defineGetter__("onwaiting", curMemoryArea.onwaiting_smart_getter);

// onwebkitanimationend
curMemoryArea.onwebkitanimationend_getter = function onwebkitanimationend() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_getter, "name", { value: "get onwebkitanimationend", configurable: true, });
// onwebkitanimationend
curMemoryArea.onwebkitanimationend_setter = function onwebkitanimationend(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_setter, "name", { value: "set onwebkitanimationend", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitanimationend", { get: curMemoryArea.onwebkitanimationend_getter, set: curMemoryArea.onwebkitanimationend_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitanimationend_smart_getter = function onwebkitanimationend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitanimationend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationend_smart_getter);
Document.prototype.__defineGetter__("onwebkitanimationend", curMemoryArea.onwebkitanimationend_smart_getter);

// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_getter = function onwebkitanimationiteration() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_getter, "name", { value: "get onwebkitanimationiteration", configurable: true, });
// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_setter = function onwebkitanimationiteration(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_setter, "name", { value: "set onwebkitanimationiteration", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitanimationiteration", { get: curMemoryArea.onwebkitanimationiteration_getter, set: curMemoryArea.onwebkitanimationiteration_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitanimationiteration_smart_getter = function onwebkitanimationiteration() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitanimationiteration的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_smart_getter);
Document.prototype.__defineGetter__("onwebkitanimationiteration", curMemoryArea.onwebkitanimationiteration_smart_getter);

// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_getter = function onwebkitanimationstart() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_getter, "name", { value: "get onwebkitanimationstart", configurable: true, });
// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_setter = function onwebkitanimationstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_setter, "name", { value: "set onwebkitanimationstart", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitanimationstart", { get: curMemoryArea.onwebkitanimationstart_getter, set: curMemoryArea.onwebkitanimationstart_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitanimationstart_smart_getter = function onwebkitanimationstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitanimationstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationstart_smart_getter);
Document.prototype.__defineGetter__("onwebkitanimationstart", curMemoryArea.onwebkitanimationstart_smart_getter);

// onwebkittransitionend
curMemoryArea.onwebkittransitionend_getter = function onwebkittransitionend() { debugger; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_getter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_getter, "name", { value: "get onwebkittransitionend", configurable: true, });
// onwebkittransitionend
curMemoryArea.onwebkittransitionend_setter = function onwebkittransitionend(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_setter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_setter, "name", { value: "set onwebkittransitionend", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkittransitionend", { get: curMemoryArea.onwebkittransitionend_getter, set: curMemoryArea.onwebkittransitionend_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkittransitionend_smart_getter = function onwebkittransitionend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkittransitionend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkittransitionend_smart_getter);
Document.prototype.__defineGetter__("onwebkittransitionend", curMemoryArea.onwebkittransitionend_smart_getter);

// onwheel
curMemoryArea.onwheel_getter = function onwheel() { debugger; }; mframe.safefunction(curMemoryArea.onwheel_getter);
Object.defineProperty(curMemoryArea.onwheel_getter, "name", { value: "get onwheel", configurable: true, });
// onwheel
curMemoryArea.onwheel_setter = function onwheel(val) { debugger; }; mframe.safefunction(curMemoryArea.onwheel_setter);
Object.defineProperty(curMemoryArea.onwheel_setter, "name", { value: "set onwheel", configurable: true, });
Object.defineProperty(Document.prototype, "onwheel", { get: curMemoryArea.onwheel_getter, set: curMemoryArea.onwheel_setter, enumerable: true, configurable: true, });
curMemoryArea.onwheel_smart_getter = function onwheel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwheel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwheel_smart_getter);
Document.prototype.__defineGetter__("onwheel", curMemoryArea.onwheel_smart_getter);

// onauxclick
curMemoryArea.onauxclick_getter = function onauxclick() { debugger; }; mframe.safefunction(curMemoryArea.onauxclick_getter);
Object.defineProperty(curMemoryArea.onauxclick_getter, "name", { value: "get onauxclick", configurable: true, });
// onauxclick
curMemoryArea.onauxclick_setter = function onauxclick(val) { debugger; }; mframe.safefunction(curMemoryArea.onauxclick_setter);
Object.defineProperty(curMemoryArea.onauxclick_setter, "name", { value: "set onauxclick", configurable: true, });
Object.defineProperty(Document.prototype, "onauxclick", { get: curMemoryArea.onauxclick_getter, set: curMemoryArea.onauxclick_setter, enumerable: true, configurable: true, });
curMemoryArea.onauxclick_smart_getter = function onauxclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onauxclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onauxclick_smart_getter);
Document.prototype.__defineGetter__("onauxclick", curMemoryArea.onauxclick_smart_getter);

// ongotpointercapture
curMemoryArea.ongotpointercapture_getter = function ongotpointercapture() { debugger; }; mframe.safefunction(curMemoryArea.ongotpointercapture_getter);
Object.defineProperty(curMemoryArea.ongotpointercapture_getter, "name", { value: "get ongotpointercapture", configurable: true, });
// ongotpointercapture
curMemoryArea.ongotpointercapture_setter = function ongotpointercapture(val) { debugger; }; mframe.safefunction(curMemoryArea.ongotpointercapture_setter);
Object.defineProperty(curMemoryArea.ongotpointercapture_setter, "name", { value: "set ongotpointercapture", configurable: true, });
Object.defineProperty(Document.prototype, "ongotpointercapture", { get: curMemoryArea.ongotpointercapture_getter, set: curMemoryArea.ongotpointercapture_setter, enumerable: true, configurable: true, });
curMemoryArea.ongotpointercapture_smart_getter = function ongotpointercapture() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ongotpointercapture的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ongotpointercapture_smart_getter);
Document.prototype.__defineGetter__("ongotpointercapture", curMemoryArea.ongotpointercapture_smart_getter);

// onlostpointercapture
curMemoryArea.onlostpointercapture_getter = function onlostpointercapture() { debugger; }; mframe.safefunction(curMemoryArea.onlostpointercapture_getter);
Object.defineProperty(curMemoryArea.onlostpointercapture_getter, "name", { value: "get onlostpointercapture", configurable: true, });
// onlostpointercapture
curMemoryArea.onlostpointercapture_setter = function onlostpointercapture(val) { debugger; }; mframe.safefunction(curMemoryArea.onlostpointercapture_setter);
Object.defineProperty(curMemoryArea.onlostpointercapture_setter, "name", { value: "set onlostpointercapture", configurable: true, });
Object.defineProperty(Document.prototype, "onlostpointercapture", { get: curMemoryArea.onlostpointercapture_getter, set: curMemoryArea.onlostpointercapture_setter, enumerable: true, configurable: true, });
curMemoryArea.onlostpointercapture_smart_getter = function onlostpointercapture() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onlostpointercapture的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onlostpointercapture_smart_getter);
Document.prototype.__defineGetter__("onlostpointercapture", curMemoryArea.onlostpointercapture_smart_getter);

// onpointerdown
curMemoryArea.onpointerdown_getter = function onpointerdown() { debugger; }; mframe.safefunction(curMemoryArea.onpointerdown_getter);
Object.defineProperty(curMemoryArea.onpointerdown_getter, "name", { value: "get onpointerdown", configurable: true, });
// onpointerdown
curMemoryArea.onpointerdown_setter = function onpointerdown(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerdown_setter);
Object.defineProperty(curMemoryArea.onpointerdown_setter, "name", { value: "set onpointerdown", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerdown", { get: curMemoryArea.onpointerdown_getter, set: curMemoryArea.onpointerdown_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerdown_smart_getter = function onpointerdown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerdown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerdown_smart_getter);
Document.prototype.__defineGetter__("onpointerdown", curMemoryArea.onpointerdown_smart_getter);

// onpointermove
curMemoryArea.onpointermove_getter = function onpointermove() { debugger; }; mframe.safefunction(curMemoryArea.onpointermove_getter);
Object.defineProperty(curMemoryArea.onpointermove_getter, "name", { value: "get onpointermove", configurable: true, });
// onpointermove
curMemoryArea.onpointermove_setter = function onpointermove(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointermove_setter);
Object.defineProperty(curMemoryArea.onpointermove_setter, "name", { value: "set onpointermove", configurable: true, });
Object.defineProperty(Document.prototype, "onpointermove", { get: curMemoryArea.onpointermove_getter, set: curMemoryArea.onpointermove_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointermove_smart_getter = function onpointermove() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointermove的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointermove_smart_getter);
Document.prototype.__defineGetter__("onpointermove", curMemoryArea.onpointermove_smart_getter);

// onpointerrawupdate
curMemoryArea.onpointerrawupdate_getter = function onpointerrawupdate() { debugger; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_getter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_getter, "name", { value: "get onpointerrawupdate", configurable: true, });
// onpointerrawupdate
curMemoryArea.onpointerrawupdate_setter = function onpointerrawupdate(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_setter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_setter, "name", { value: "set onpointerrawupdate", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerrawupdate", { get: curMemoryArea.onpointerrawupdate_getter, set: curMemoryArea.onpointerrawupdate_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerrawupdate_smart_getter = function onpointerrawupdate() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerrawupdate的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerrawupdate_smart_getter);
Document.prototype.__defineGetter__("onpointerrawupdate", curMemoryArea.onpointerrawupdate_smart_getter);

// onpointerup
curMemoryArea.onpointerup_getter = function onpointerup() { debugger; }; mframe.safefunction(curMemoryArea.onpointerup_getter);
Object.defineProperty(curMemoryArea.onpointerup_getter, "name", { value: "get onpointerup", configurable: true, });
// onpointerup
curMemoryArea.onpointerup_setter = function onpointerup(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerup_setter);
Object.defineProperty(curMemoryArea.onpointerup_setter, "name", { value: "set onpointerup", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerup", { get: curMemoryArea.onpointerup_getter, set: curMemoryArea.onpointerup_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerup_smart_getter = function onpointerup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerup_smart_getter);
Document.prototype.__defineGetter__("onpointerup", curMemoryArea.onpointerup_smart_getter);

// onpointercancel
curMemoryArea.onpointercancel_getter = function onpointercancel() { debugger; }; mframe.safefunction(curMemoryArea.onpointercancel_getter);
Object.defineProperty(curMemoryArea.onpointercancel_getter, "name", { value: "get onpointercancel", configurable: true, });
// onpointercancel
curMemoryArea.onpointercancel_setter = function onpointercancel(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointercancel_setter);
Object.defineProperty(curMemoryArea.onpointercancel_setter, "name", { value: "set onpointercancel", configurable: true, });
Object.defineProperty(Document.prototype, "onpointercancel", { get: curMemoryArea.onpointercancel_getter, set: curMemoryArea.onpointercancel_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointercancel_smart_getter = function onpointercancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointercancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointercancel_smart_getter);
Document.prototype.__defineGetter__("onpointercancel", curMemoryArea.onpointercancel_smart_getter);

// onpointerover
curMemoryArea.onpointerover_getter = function onpointerover() { debugger; }; mframe.safefunction(curMemoryArea.onpointerover_getter);
Object.defineProperty(curMemoryArea.onpointerover_getter, "name", { value: "get onpointerover", configurable: true, });
// onpointerover
curMemoryArea.onpointerover_setter = function onpointerover(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerover_setter);
Object.defineProperty(curMemoryArea.onpointerover_setter, "name", { value: "set onpointerover", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerover", { get: curMemoryArea.onpointerover_getter, set: curMemoryArea.onpointerover_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerover_smart_getter = function onpointerover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerover_smart_getter);
Document.prototype.__defineGetter__("onpointerover", curMemoryArea.onpointerover_smart_getter);

// onpointerout
curMemoryArea.onpointerout_getter = function onpointerout() { debugger; }; mframe.safefunction(curMemoryArea.onpointerout_getter);
Object.defineProperty(curMemoryArea.onpointerout_getter, "name", { value: "get onpointerout", configurable: true, });
// onpointerout
curMemoryArea.onpointerout_setter = function onpointerout(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerout_setter);
Object.defineProperty(curMemoryArea.onpointerout_setter, "name", { value: "set onpointerout", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerout", { get: curMemoryArea.onpointerout_getter, set: curMemoryArea.onpointerout_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerout_smart_getter = function onpointerout() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerout的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerout_smart_getter);
Document.prototype.__defineGetter__("onpointerout", curMemoryArea.onpointerout_smart_getter);

// onpointerenter
curMemoryArea.onpointerenter_getter = function onpointerenter() { debugger; }; mframe.safefunction(curMemoryArea.onpointerenter_getter);
Object.defineProperty(curMemoryArea.onpointerenter_getter, "name", { value: "get onpointerenter", configurable: true, });
// onpointerenter
curMemoryArea.onpointerenter_setter = function onpointerenter(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerenter_setter);
Object.defineProperty(curMemoryArea.onpointerenter_setter, "name", { value: "set onpointerenter", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerenter", { get: curMemoryArea.onpointerenter_getter, set: curMemoryArea.onpointerenter_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerenter_smart_getter = function onpointerenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerenter_smart_getter);
Document.prototype.__defineGetter__("onpointerenter", curMemoryArea.onpointerenter_smart_getter);

// onpointerleave
curMemoryArea.onpointerleave_getter = function onpointerleave() { debugger; }; mframe.safefunction(curMemoryArea.onpointerleave_getter);
Object.defineProperty(curMemoryArea.onpointerleave_getter, "name", { value: "get onpointerleave", configurable: true, });
// onpointerleave
curMemoryArea.onpointerleave_setter = function onpointerleave(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerleave_setter);
Object.defineProperty(curMemoryArea.onpointerleave_setter, "name", { value: "set onpointerleave", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerleave", { get: curMemoryArea.onpointerleave_getter, set: curMemoryArea.onpointerleave_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerleave_smart_getter = function onpointerleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerleave_smart_getter);
Document.prototype.__defineGetter__("onpointerleave", curMemoryArea.onpointerleave_smart_getter);

// onselectstart
curMemoryArea.onselectstart_getter = function onselectstart() { debugger; }; mframe.safefunction(curMemoryArea.onselectstart_getter);
Object.defineProperty(curMemoryArea.onselectstart_getter, "name", { value: "get onselectstart", configurable: true, });
// onselectstart
curMemoryArea.onselectstart_setter = function onselectstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onselectstart_setter);
Object.defineProperty(curMemoryArea.onselectstart_setter, "name", { value: "set onselectstart", configurable: true, });
Object.defineProperty(Document.prototype, "onselectstart", { get: curMemoryArea.onselectstart_getter, set: curMemoryArea.onselectstart_setter, enumerable: true, configurable: true, });
curMemoryArea.onselectstart_smart_getter = function onselectstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onselectstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onselectstart_smart_getter);
Document.prototype.__defineGetter__("onselectstart", curMemoryArea.onselectstart_smart_getter);

// onselectionchange
curMemoryArea.onselectionchange_getter = function onselectionchange() { debugger; }; mframe.safefunction(curMemoryArea.onselectionchange_getter);
Object.defineProperty(curMemoryArea.onselectionchange_getter, "name", { value: "get onselectionchange", configurable: true, });
// onselectionchange
curMemoryArea.onselectionchange_setter = function onselectionchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onselectionchange_setter);
Object.defineProperty(curMemoryArea.onselectionchange_setter, "name", { value: "set onselectionchange", configurable: true, });
Object.defineProperty(Document.prototype, "onselectionchange", { get: curMemoryArea.onselectionchange_getter, set: curMemoryArea.onselectionchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onselectionchange_smart_getter = function onselectionchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onselectionchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onselectionchange_smart_getter);
Document.prototype.__defineGetter__("onselectionchange", curMemoryArea.onselectionchange_smart_getter);

// onanimationend
curMemoryArea.onanimationend_getter = function onanimationend() { debugger; }; mframe.safefunction(curMemoryArea.onanimationend_getter);
Object.defineProperty(curMemoryArea.onanimationend_getter, "name", { value: "get onanimationend", configurable: true, });
// onanimationend
curMemoryArea.onanimationend_setter = function onanimationend(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationend_setter);
Object.defineProperty(curMemoryArea.onanimationend_setter, "name", { value: "set onanimationend", configurable: true, });
Object.defineProperty(Document.prototype, "onanimationend", { get: curMemoryArea.onanimationend_getter, set: curMemoryArea.onanimationend_setter, enumerable: true, configurable: true, });
curMemoryArea.onanimationend_smart_getter = function onanimationend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onanimationend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onanimationend_smart_getter);
Document.prototype.__defineGetter__("onanimationend", curMemoryArea.onanimationend_smart_getter);

// onanimationiteration
curMemoryArea.onanimationiteration_getter = function onanimationiteration() { debugger; }; mframe.safefunction(curMemoryArea.onanimationiteration_getter);
Object.defineProperty(curMemoryArea.onanimationiteration_getter, "name", { value: "get onanimationiteration", configurable: true, });
// onanimationiteration
curMemoryArea.onanimationiteration_setter = function onanimationiteration(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationiteration_setter);
Object.defineProperty(curMemoryArea.onanimationiteration_setter, "name", { value: "set onanimationiteration", configurable: true, });
Object.defineProperty(Document.prototype, "onanimationiteration", { get: curMemoryArea.onanimationiteration_getter, set: curMemoryArea.onanimationiteration_setter, enumerable: true, configurable: true, });
curMemoryArea.onanimationiteration_smart_getter = function onanimationiteration() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onanimationiteration的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onanimationiteration_smart_getter);
Document.prototype.__defineGetter__("onanimationiteration", curMemoryArea.onanimationiteration_smart_getter);

// onanimationstart
curMemoryArea.onanimationstart_getter = function onanimationstart() { debugger; }; mframe.safefunction(curMemoryArea.onanimationstart_getter);
Object.defineProperty(curMemoryArea.onanimationstart_getter, "name", { value: "get onanimationstart", configurable: true, });
// onanimationstart
curMemoryArea.onanimationstart_setter = function onanimationstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationstart_setter);
Object.defineProperty(curMemoryArea.onanimationstart_setter, "name", { value: "set onanimationstart", configurable: true, });
Object.defineProperty(Document.prototype, "onanimationstart", { get: curMemoryArea.onanimationstart_getter, set: curMemoryArea.onanimationstart_setter, enumerable: true, configurable: true, });
curMemoryArea.onanimationstart_smart_getter = function onanimationstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onanimationstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onanimationstart_smart_getter);
Document.prototype.__defineGetter__("onanimationstart", curMemoryArea.onanimationstart_smart_getter);

// ontransitionrun
curMemoryArea.ontransitionrun_getter = function ontransitionrun() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionrun_getter);
Object.defineProperty(curMemoryArea.ontransitionrun_getter, "name", { value: "get ontransitionrun", configurable: true, });
// ontransitionrun
curMemoryArea.ontransitionrun_setter = function ontransitionrun(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionrun_setter);
Object.defineProperty(curMemoryArea.ontransitionrun_setter, "name", { value: "set ontransitionrun", configurable: true, });
Object.defineProperty(Document.prototype, "ontransitionrun", { get: curMemoryArea.ontransitionrun_getter, set: curMemoryArea.ontransitionrun_setter, enumerable: true, configurable: true, });
curMemoryArea.ontransitionrun_smart_getter = function ontransitionrun() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontransitionrun的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontransitionrun_smart_getter);
Document.prototype.__defineGetter__("ontransitionrun", curMemoryArea.ontransitionrun_smart_getter);

// ontransitionstart
curMemoryArea.ontransitionstart_getter = function ontransitionstart() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionstart_getter);
Object.defineProperty(curMemoryArea.ontransitionstart_getter, "name", { value: "get ontransitionstart", configurable: true, });
// ontransitionstart
curMemoryArea.ontransitionstart_setter = function ontransitionstart(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionstart_setter);
Object.defineProperty(curMemoryArea.ontransitionstart_setter, "name", { value: "set ontransitionstart", configurable: true, });
Object.defineProperty(Document.prototype, "ontransitionstart", { get: curMemoryArea.ontransitionstart_getter, set: curMemoryArea.ontransitionstart_setter, enumerable: true, configurable: true, });
curMemoryArea.ontransitionstart_smart_getter = function ontransitionstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontransitionstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontransitionstart_smart_getter);
Document.prototype.__defineGetter__("ontransitionstart", curMemoryArea.ontransitionstart_smart_getter);

// ontransitionend
curMemoryArea.ontransitionend_getter = function ontransitionend() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionend_getter);
Object.defineProperty(curMemoryArea.ontransitionend_getter, "name", { value: "get ontransitionend", configurable: true, });
// ontransitionend
curMemoryArea.ontransitionend_setter = function ontransitionend(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionend_setter);
Object.defineProperty(curMemoryArea.ontransitionend_setter, "name", { value: "set ontransitionend", configurable: true, });
Object.defineProperty(Document.prototype, "ontransitionend", { get: curMemoryArea.ontransitionend_getter, set: curMemoryArea.ontransitionend_setter, enumerable: true, configurable: true, });
curMemoryArea.ontransitionend_smart_getter = function ontransitionend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontransitionend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontransitionend_smart_getter);
Document.prototype.__defineGetter__("ontransitionend", curMemoryArea.ontransitionend_smart_getter);

// ontransitioncancel
curMemoryArea.ontransitioncancel_getter = function ontransitioncancel() { debugger; }; mframe.safefunction(curMemoryArea.ontransitioncancel_getter);
Object.defineProperty(curMemoryArea.ontransitioncancel_getter, "name", { value: "get ontransitioncancel", configurable: true, });
// ontransitioncancel
curMemoryArea.ontransitioncancel_setter = function ontransitioncancel(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitioncancel_setter);
Object.defineProperty(curMemoryArea.ontransitioncancel_setter, "name", { value: "set ontransitioncancel", configurable: true, });
Object.defineProperty(Document.prototype, "ontransitioncancel", { get: curMemoryArea.ontransitioncancel_getter, set: curMemoryArea.ontransitioncancel_setter, enumerable: true, configurable: true, });
curMemoryArea.ontransitioncancel_smart_getter = function ontransitioncancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontransitioncancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontransitioncancel_smart_getter);
Document.prototype.__defineGetter__("ontransitioncancel", curMemoryArea.ontransitioncancel_smart_getter);

// oncopy
curMemoryArea.oncopy_getter = function oncopy() { debugger; }; mframe.safefunction(curMemoryArea.oncopy_getter);
Object.defineProperty(curMemoryArea.oncopy_getter, "name", { value: "get oncopy", configurable: true, });
// oncopy
curMemoryArea.oncopy_setter = function oncopy(val) { debugger; }; mframe.safefunction(curMemoryArea.oncopy_setter);
Object.defineProperty(curMemoryArea.oncopy_setter, "name", { value: "set oncopy", configurable: true, });
Object.defineProperty(Document.prototype, "oncopy", { get: curMemoryArea.oncopy_getter, set: curMemoryArea.oncopy_setter, enumerable: true, configurable: true, });
curMemoryArea.oncopy_smart_getter = function oncopy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncopy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncopy_smart_getter);
Document.prototype.__defineGetter__("oncopy", curMemoryArea.oncopy_smart_getter);

// oncut
curMemoryArea.oncut_getter = function oncut() { debugger; }; mframe.safefunction(curMemoryArea.oncut_getter);
Object.defineProperty(curMemoryArea.oncut_getter, "name", { value: "get oncut", configurable: true, });
// oncut
curMemoryArea.oncut_setter = function oncut(val) { debugger; }; mframe.safefunction(curMemoryArea.oncut_setter);
Object.defineProperty(curMemoryArea.oncut_setter, "name", { value: "set oncut", configurable: true, });
Object.defineProperty(Document.prototype, "oncut", { get: curMemoryArea.oncut_getter, set: curMemoryArea.oncut_setter, enumerable: true, configurable: true, });
curMemoryArea.oncut_smart_getter = function oncut() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncut的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncut_smart_getter);
Document.prototype.__defineGetter__("oncut", curMemoryArea.oncut_smart_getter);

// onpaste
curMemoryArea.onpaste_getter = function onpaste() { debugger; }; mframe.safefunction(curMemoryArea.onpaste_getter);
Object.defineProperty(curMemoryArea.onpaste_getter, "name", { value: "get onpaste", configurable: true, });
// onpaste
curMemoryArea.onpaste_setter = function onpaste(val) { debugger; }; mframe.safefunction(curMemoryArea.onpaste_setter);
Object.defineProperty(curMemoryArea.onpaste_setter, "name", { value: "set onpaste", configurable: true, });
Object.defineProperty(Document.prototype, "onpaste", { get: curMemoryArea.onpaste_getter, set: curMemoryArea.onpaste_setter, enumerable: true, configurable: true, });
curMemoryArea.onpaste_smart_getter = function onpaste() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpaste的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpaste_smart_getter);
Document.prototype.__defineGetter__("onpaste", curMemoryArea.onpaste_smart_getter);

// children
curMemoryArea.children_getter = function children() { debugger; }; mframe.safefunction(curMemoryArea.children_getter);
Object.defineProperty(curMemoryArea.children_getter, "name", { value: "get children", configurable: true, });
Object.defineProperty(Document.prototype, "children", { get: curMemoryArea.children_getter, enumerable: true, configurable: true, });
curMemoryArea.children_smart_getter = function children() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的children的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.children_smart_getter);
Document.prototype.__defineGetter__("children", curMemoryArea.children_smart_getter);

// firstElementChild
curMemoryArea.firstElementChild_getter = function firstElementChild() { debugger; }; mframe.safefunction(curMemoryArea.firstElementChild_getter);
Object.defineProperty(curMemoryArea.firstElementChild_getter, "name", { value: "get firstElementChild", configurable: true, });
Object.defineProperty(Document.prototype, "firstElementChild", { get: curMemoryArea.firstElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstElementChild_smart_getter = function firstElementChild() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的firstElementChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.firstElementChild_smart_getter);
Document.prototype.__defineGetter__("firstElementChild", curMemoryArea.firstElementChild_smart_getter);

// lastElementChild
curMemoryArea.lastElementChild_getter = function lastElementChild() { debugger; }; mframe.safefunction(curMemoryArea.lastElementChild_getter);
Object.defineProperty(curMemoryArea.lastElementChild_getter, "name", { value: "get lastElementChild", configurable: true, });
Object.defineProperty(Document.prototype, "lastElementChild", { get: curMemoryArea.lastElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.lastElementChild_smart_getter = function lastElementChild() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的lastElementChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.lastElementChild_smart_getter);
Document.prototype.__defineGetter__("lastElementChild", curMemoryArea.lastElementChild_smart_getter);

// childElementCount
curMemoryArea.childElementCount_getter = function childElementCount() { debugger; }; mframe.safefunction(curMemoryArea.childElementCount_getter);
Object.defineProperty(curMemoryArea.childElementCount_getter, "name", { value: "get childElementCount", configurable: true, });
Object.defineProperty(Document.prototype, "childElementCount", { get: curMemoryArea.childElementCount_getter, enumerable: true, configurable: true, });
curMemoryArea.childElementCount_smart_getter = function childElementCount() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的childElementCount的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.childElementCount_smart_getter);
Document.prototype.__defineGetter__("childElementCount", curMemoryArea.childElementCount_smart_getter);

// activeElement
curMemoryArea.activeElement_getter = function activeElement() { debugger; }; mframe.safefunction(curMemoryArea.activeElement_getter);
Object.defineProperty(curMemoryArea.activeElement_getter, "name", { value: "get activeElement", configurable: true, });
Object.defineProperty(Document.prototype, "activeElement", { get: curMemoryArea.activeElement_getter, enumerable: true, configurable: true, });
curMemoryArea.activeElement_smart_getter = function activeElement() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的activeElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.activeElement_smart_getter);
Document.prototype.__defineGetter__("activeElement", curMemoryArea.activeElement_smart_getter);

// styleSheets
curMemoryArea.styleSheets_getter = function styleSheets() { debugger; }; mframe.safefunction(curMemoryArea.styleSheets_getter);
Object.defineProperty(curMemoryArea.styleSheets_getter, "name", { value: "get styleSheets", configurable: true, });
Object.defineProperty(Document.prototype, "styleSheets", { get: curMemoryArea.styleSheets_getter, enumerable: true, configurable: true, });
curMemoryArea.styleSheets_smart_getter = function styleSheets() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的styleSheets的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.styleSheets_smart_getter);
Document.prototype.__defineGetter__("styleSheets", curMemoryArea.styleSheets_smart_getter);

// pointerLockElement
curMemoryArea.pointerLockElement_getter = function pointerLockElement() { debugger; }; mframe.safefunction(curMemoryArea.pointerLockElement_getter);
Object.defineProperty(curMemoryArea.pointerLockElement_getter, "name", { value: "get pointerLockElement", configurable: true, });
Object.defineProperty(Document.prototype, "pointerLockElement", { get: curMemoryArea.pointerLockElement_getter, enumerable: true, configurable: true, });
curMemoryArea.pointerLockElement_smart_getter = function pointerLockElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的pointerLockElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.pointerLockElement_smart_getter);
Document.prototype.__defineGetter__("pointerLockElement", curMemoryArea.pointerLockElement_smart_getter);

// fullscreenElement
curMemoryArea.fullscreenElement_getter = function fullscreenElement() { debugger; }; mframe.safefunction(curMemoryArea.fullscreenElement_getter);
Object.defineProperty(curMemoryArea.fullscreenElement_getter, "name", { value: "get fullscreenElement", configurable: true, });
// fullscreenElement
curMemoryArea.fullscreenElement_setter = function fullscreenElement(val) { debugger; }; mframe.safefunction(curMemoryArea.fullscreenElement_setter);
Object.defineProperty(curMemoryArea.fullscreenElement_setter, "name", { value: "set fullscreenElement", configurable: true, });
Object.defineProperty(Document.prototype, "fullscreenElement", { get: curMemoryArea.fullscreenElement_getter, set: curMemoryArea.fullscreenElement_setter, enumerable: true, configurable: true, });
curMemoryArea.fullscreenElement_smart_getter = function fullscreenElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fullscreenElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fullscreenElement_smart_getter);
Document.prototype.__defineGetter__("fullscreenElement", curMemoryArea.fullscreenElement_smart_getter);

// adoptedStyleSheets
curMemoryArea.adoptedStyleSheets_getter = function adoptedStyleSheets() { debugger; }; mframe.safefunction(curMemoryArea.adoptedStyleSheets_getter);
Object.defineProperty(curMemoryArea.adoptedStyleSheets_getter, "name", { value: "get adoptedStyleSheets", configurable: true, });
// adoptedStyleSheets
curMemoryArea.adoptedStyleSheets_setter = function adoptedStyleSheets(val) { debugger; }; mframe.safefunction(curMemoryArea.adoptedStyleSheets_setter);
Object.defineProperty(curMemoryArea.adoptedStyleSheets_setter, "name", { value: "set adoptedStyleSheets", configurable: true, });
Object.defineProperty(Document.prototype, "adoptedStyleSheets", { get: curMemoryArea.adoptedStyleSheets_getter, set: curMemoryArea.adoptedStyleSheets_setter, enumerable: true, configurable: true, });
curMemoryArea.adoptedStyleSheets_smart_getter = function adoptedStyleSheets() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的adoptedStyleSheets的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.adoptedStyleSheets_smart_getter);
Document.prototype.__defineGetter__("adoptedStyleSheets", curMemoryArea.adoptedStyleSheets_smart_getter);

// pictureInPictureElement
curMemoryArea.pictureInPictureElement_getter = function pictureInPictureElement() { debugger; }; mframe.safefunction(curMemoryArea.pictureInPictureElement_getter);
Object.defineProperty(curMemoryArea.pictureInPictureElement_getter, "name", { value: "get pictureInPictureElement", configurable: true, });
Object.defineProperty(Document.prototype, "pictureInPictureElement", { get: curMemoryArea.pictureInPictureElement_getter, enumerable: true, configurable: true, });
curMemoryArea.pictureInPictureElement_smart_getter = function pictureInPictureElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的pictureInPictureElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.pictureInPictureElement_smart_getter);
Document.prototype.__defineGetter__("pictureInPictureElement", curMemoryArea.pictureInPictureElement_smart_getter);

// fonts
curMemoryArea.fonts_getter = function fonts() { debugger; }; mframe.safefunction(curMemoryArea.fonts_getter);
Object.defineProperty(curMemoryArea.fonts_getter, "name", { value: "get fonts", configurable: true, });
Object.defineProperty(Document.prototype, "fonts", { get: curMemoryArea.fonts_getter, enumerable: true, configurable: true, });
curMemoryArea.fonts_smart_getter = function fonts() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fonts的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fonts_smart_getter);
Document.prototype.__defineGetter__("fonts", curMemoryArea.fonts_smart_getter);

// fragmentDirective
curMemoryArea.fragmentDirective_getter = function fragmentDirective() { debugger; }; mframe.safefunction(curMemoryArea.fragmentDirective_getter);
Object.defineProperty(curMemoryArea.fragmentDirective_getter, "name", { value: "get fragmentDirective", configurable: true, });
Object.defineProperty(Document.prototype, "fragmentDirective", { get: curMemoryArea.fragmentDirective_getter, enumerable: true, configurable: true, });
curMemoryArea.fragmentDirective_smart_getter = function fragmentDirective() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fragmentDirective的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fragmentDirective_smart_getter);
Document.prototype.__defineGetter__("fragmentDirective", curMemoryArea.fragmentDirective_smart_getter);

// onscrollend
curMemoryArea.onscrollend_getter = function onscrollend() { debugger; }; mframe.safefunction(curMemoryArea.onscrollend_getter);
Object.defineProperty(curMemoryArea.onscrollend_getter, "name", { value: "get onscrollend", configurable: true, });
// onscrollend
curMemoryArea.onscrollend_setter = function onscrollend(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollend_setter);
Object.defineProperty(curMemoryArea.onscrollend_setter, "name", { value: "set onscrollend", configurable: true, });
Object.defineProperty(Document.prototype, "onscrollend", { get: curMemoryArea.onscrollend_getter, set: curMemoryArea.onscrollend_setter, enumerable: true, configurable: true, });
curMemoryArea.onscrollend_smart_getter = function onscrollend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onscrollend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onscrollend_smart_getter);
Document.prototype.__defineGetter__("onscrollend", curMemoryArea.onscrollend_smart_getter);

// onscrollsnapchange
curMemoryArea.onscrollsnapchange_getter = function onscrollsnapchange() { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_getter, "name", { value: "get onscrollsnapchange", configurable: true, });
// onscrollsnapchange
curMemoryArea.onscrollsnapchange_setter = function onscrollsnapchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_setter, "name", { value: "set onscrollsnapchange", configurable: true, });
Object.defineProperty(Document.prototype, "onscrollsnapchange", { get: curMemoryArea.onscrollsnapchange_getter, set: curMemoryArea.onscrollsnapchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onscrollsnapchange_smart_getter = function onscrollsnapchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onscrollsnapchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onscrollsnapchange_smart_getter);
Document.prototype.__defineGetter__("onscrollsnapchange", curMemoryArea.onscrollsnapchange_smart_getter);

// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_getter = function onscrollsnapchanging() { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_getter, "name", { value: "get onscrollsnapchanging", configurable: true, });
// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_setter = function onscrollsnapchanging(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_setter, "name", { value: "set onscrollsnapchanging", configurable: true, });
Object.defineProperty(Document.prototype, "onscrollsnapchanging", { get: curMemoryArea.onscrollsnapchanging_getter, set: curMemoryArea.onscrollsnapchanging_setter, enumerable: true, configurable: true, });
curMemoryArea.onscrollsnapchanging_smart_getter = function onscrollsnapchanging() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onscrollsnapchanging的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onscrollsnapchanging_smart_getter);
Document.prototype.__defineGetter__("onscrollsnapchanging", curMemoryArea.onscrollsnapchanging_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
Document.prototype["adoptNode"] = function adoptNode() { debugger; }; mframe.safefunction(Document.prototype["adoptNode"]);
Document.prototype["append"] = function append() { debugger; }; mframe.safefunction(Document.prototype["append"]);
Document.prototype["captureEvents"] = function captureEvents() { debugger; }; mframe.safefunction(Document.prototype["captureEvents"]);
Document.prototype["caretRangeFromPoint"] = function caretRangeFromPoint() { debugger; }; mframe.safefunction(Document.prototype["caretRangeFromPoint"]);
Document.prototype["clear"] = function clear() { debugger; }; mframe.safefunction(Document.prototype["clear"]);
Document.prototype["close"] = function close() { debugger; }; mframe.safefunction(Document.prototype["close"]);
Document.prototype["createAttribute"] = function createAttribute() { debugger; }; mframe.safefunction(Document.prototype["createAttribute"]);
Document.prototype["createAttributeNS"] = function createAttributeNS() { debugger; }; mframe.safefunction(Document.prototype["createAttributeNS"]);
Document.prototype["createCDATASection"] = function createCDATASection() { debugger; }; mframe.safefunction(Document.prototype["createCDATASection"]);
Document.prototype["createComment"] = function createComment() { debugger; }; mframe.safefunction(Document.prototype["createComment"]);
Document.prototype["createDocumentFragment"] = function createDocumentFragment() { debugger; }; mframe.safefunction(Document.prototype["createDocumentFragment"]);

// 重写createElement方法
Document.prototype["createElement"] = function createElement(tagName, options) {
    console.log(`createElement:${tagName}`);

    // STEP1:清洗标签名称
    var tagName = tagName.toLowerCase() + ""; // +""是因为null需要解析为"null"
    // STEP2:创建我们的自定义元素
    var htmlElement;
    if (mframe.memory.htmlelements[tagName] == undefined) {
        console.log(`\x1b[31mcreateElement缺少==>${tagName}\x1b[0m`);
        debugger;
        htmlElement = {}; // 创建一个基础元素
        htmlElement.__proto__ = HTMLElement.prototype;
    } else {
        htmlElement = mframe.memory.htmlelements[tagName](); // 如果有直接创建
    }
    // STEP3(可选): 如果使用了jsdom
    if (mframe.memory.jsdom.document) {
        // 使用JSDOM创建真实DOM元素
        var jsdomXXXElement = mframe.memory.jsdom.document.createElement(tagName, options);
        Object.defineProperty(htmlElement, 'jsdomMemory', {
            value: jsdomXXXElement,
            writable: true,
            configurable: true, // 一定为true,因为要频繁修改
            enumerable: true
        });
    }
    return mframe.proxy(htmlElement);
}; mframe.safefunction(Document.prototype["createElement"]);

Document.prototype["createElementNS"] = function createElementNS() { debugger; }; mframe.safefunction(Document.prototype["createElementNS"]);
Document.prototype["createEvent"] = function createEvent() { debugger; }; mframe.safefunction(Document.prototype["createEvent"]);
Document.prototype["createExpression"] = function createExpression() { debugger; }; mframe.safefunction(Document.prototype["createExpression"]);
Document.prototype["createNSResolver"] = function createNSResolver() { debugger; }; mframe.safefunction(Document.prototype["createNSResolver"]);
Document.prototype["createNodeIterator"] = function createNodeIterator() { debugger; }; mframe.safefunction(Document.prototype["createNodeIterator"]);
Document.prototype["createProcessingInstruction"] = function createProcessingInstruction() { debugger; }; mframe.safefunction(Document.prototype["createProcessingInstruction"]);
Document.prototype["createRange"] = function createRange() { debugger; }; mframe.safefunction(Document.prototype["createRange"]);
Document.prototype["createTextNode"] = function createTextNode() { debugger; }; mframe.safefunction(Document.prototype["createTextNode"]);
Document.prototype["createTreeWalker"] = function createTreeWalker() { debugger; }; mframe.safefunction(Document.prototype["createTreeWalker"]);
Document.prototype["elementFromPoint"] = function elementFromPoint() { debugger; }; mframe.safefunction(Document.prototype["elementFromPoint"]);
Document.prototype["elementsFromPoint"] = function elementsFromPoint() { debugger; }; mframe.safefunction(Document.prototype["elementsFromPoint"]);
Document.prototype["evaluate"] = function evaluate() { debugger; }; mframe.safefunction(Document.prototype["evaluate"]);
Document.prototype["execCommand"] = function execCommand() { debugger; }; mframe.safefunction(Document.prototype["execCommand"]);
Document.prototype["exitFullscreen"] = function exitFullscreen() { debugger; }; mframe.safefunction(Document.prototype["exitFullscreen"]);
Document.prototype["exitPictureInPicture"] = function exitPictureInPicture() { debugger; }; mframe.safefunction(Document.prototype["exitPictureInPicture"]);
Document.prototype["exitPointerLock"] = function exitPointerLock() { debugger; }; mframe.safefunction(Document.prototype["exitPointerLock"]);
Document.prototype["getAnimations"] = function getAnimations() { debugger; }; mframe.safefunction(Document.prototype["getAnimations"]);

// 如下是依赖"索引表"实现的getElementById
// Document.prototype["getElementById"] = function getElementById(id) {
//     if (mframe.memory.jsdom.document != undefined) { // 有jsdom        
//         return mframe.memory.jsdom.document.getElementById(id);
//     }
//     debugger;
// }; mframe.safefunction(Document.prototype["getElementById"]);


// 方法1: 实现自己的getElementById，使用querySelector代替[不用"索引表"]
Document.prototype["getElementById"] = function getElementById(id) {
    var res = mframe.memory.jsdom.document.getElementById(id);
    console.log(`getElementById查找ID: ${id} 找到${res}`);
    return res;
    if (mframe.memory.jsdom.document) {
        // 使用querySelector(强制DOM遍历)而非原生getElementById(依赖ID索引表)
        const element = mframe.memory.jsdom.document.querySelector(`#${id}`);
        console.log(`通过querySelector找到元素: ${Boolean(element)}`);

        if (element) {
            // 为找到的JSDOM元素创建或查找对应的自定义元素
            // 这里需要根据element.tagName查找对应的自定义元素
            const tagName = element.tagName.toLowerCase();

            // 通过弱引用映射表查找是否已有对应的自定义元素
            if (!mframe.memory.elementsMap) {
                mframe.memory.elementsMap = new WeakMap();
            }

            let customElement = mframe.memory.elementsMap.get(element);
            if (!customElement) {
                // 创建对应标签的自定义元素
                customElement = Document.prototype.createElement(tagName);
                // 重新关联jsdomMemory
                customElement.jsdomMemory = element;
                // 存储映射关系
                mframe.memory.elementsMap.set(element, customElement);
            }

            return customElement;
        }
        return null;
    }

    return null;
}; mframe.safefunction(Document.prototype["getElementById"]);

Document.prototype["getElementsByClassName"] = function getElementsByClassName() { debugger; }; mframe.safefunction(Document.prototype["getElementsByClassName"]);
Document.prototype["getElementsByName"] = function getElementsByName() { debugger; }; mframe.safefunction(Document.prototype["getElementsByName"]);
Document.prototype["getElementsByTagName"] = function getElementsByTagName(name) {
    if (mframe.memory.jsdom.document) { // 有jsdom
        console.log('Document.prototype["getElementsByTagName"]==>', name);
        // 这个方法返回是tageName为name的所有标签, 是返回数组, so我们要代理这个数组中的所有对象
        var elements = mframe.memory.jsdom.document.getElementsByTagName(name);
        return mframe.memory.htmlelements['collection'](elements);
    }
    debugger;
}; mframe.safefunction(Document.prototype["getElementsByTagName"]);
Document.prototype["getElementsByTagNameNS"] = function getElementsByTagNameNS() { debugger; }; mframe.safefunction(Document.prototype["getElementsByTagNameNS"]);
Document.prototype["getSelection"] = function getSelection() { debugger; }; mframe.safefunction(Document.prototype["getSelection"]);
Document.prototype["hasFocus"] = function hasFocus() { debugger; }; mframe.safefunction(Document.prototype["hasFocus"]);
Document.prototype["hasStorageAccess"] = function hasStorageAccess() { debugger; }; mframe.safefunction(Document.prototype["hasStorageAccess"]);
Document.prototype["hasUnpartitionedCookieAccess"] = function hasUnpartitionedCookieAccess() { debugger; }; mframe.safefunction(Document.prototype["hasUnpartitionedCookieAccess"]);
Document.prototype["importNode"] = function importNode() { debugger; }; mframe.safefunction(Document.prototype["importNode"]);
Document.prototype["open"] = function open() { debugger; }; mframe.safefunction(Document.prototype["open"]);
Document.prototype["prepend"] = function prepend() { debugger; }; mframe.safefunction(Document.prototype["prepend"]);
Document.prototype["queryCommandEnabled"] = function queryCommandEnabled() { debugger; }; mframe.safefunction(Document.prototype["queryCommandEnabled"]);
Document.prototype["queryCommandIndeterm"] = function queryCommandIndeterm() { debugger; }; mframe.safefunction(Document.prototype["queryCommandIndeterm"]);
Document.prototype["queryCommandState"] = function queryCommandState() { debugger; }; mframe.safefunction(Document.prototype["queryCommandState"]);
Document.prototype["queryCommandSupported"] = function queryCommandSupported() { debugger; }; mframe.safefunction(Document.prototype["queryCommandSupported"]);
Document.prototype["queryCommandValue"] = function queryCommandValue() { debugger; }; mframe.safefunction(Document.prototype["queryCommandValue"]);
Document.prototype["querySelector"] = function querySelector(selector) { debugger; }; mframe.safefunction(Document.prototype["querySelector"]);
Document.prototype["querySelectorAll"] = function querySelectorAll(selector) { debugger; }; mframe.safefunction(Document.prototype["querySelectorAll"]);
Document.prototype["releaseEvents"] = function releaseEvents() { debugger; }; mframe.safefunction(Document.prototype["releaseEvents"]);
Document.prototype["replaceChildren"] = function replaceChildren() { debugger; }; mframe.safefunction(Document.prototype["replaceChildren"]);
Document.prototype["requestStorageAccess"] = function requestStorageAccess() { debugger; }; mframe.safefunction(Document.prototype["requestStorageAccess"]);
Document.prototype["requestStorageAccessFor"] = function requestStorageAccessFor() { debugger; }; mframe.safefunction(Document.prototype["requestStorageAccessFor"]);
Document.prototype["startViewTransition"] = function startViewTransition() { debugger; }; mframe.safefunction(Document.prototype["startViewTransition"]);
Document.prototype["webkitCancelFullScreen"] = function webkitCancelFullScreen() { debugger; }; mframe.safefunction(Document.prototype["webkitCancelFullScreen"]);
Document.prototype["webkitExitFullscreen"] = function webkitExitFullscreen() { debugger; }; mframe.safefunction(Document.prototype["webkitExitFullscreen"]);
Document.prototype["write"] = function write() { debugger; }; mframe.safefunction(Document.prototype["write"]);
Document.prototype["writeln"] = function writeln() { debugger; }; mframe.safefunction(Document.prototype["writeln"]);
Document.prototype["browsingTopics"] = function browsingTopics() { debugger; }; mframe.safefunction(Document.prototype["browsingTopics"]);
Document.prototype["hasPrivateToken"] = function hasPrivateToken() { debugger; }; mframe.safefunction(Document.prototype["hasPrivateToken"]);
Document.prototype["hasRedemptionRecord"] = function hasRedemptionRecord() { debugger; }; mframe.safefunction(Document.prototype["hasRedemptionRecord"]);
Document.prototype["caretPositionFromPoint"] = function caretPositionFromPoint() { debugger; }; mframe.safefunction(Document.prototype["caretPositionFromPoint"]);
Document.prototype["moveBefore"] = function moveBefore() { debugger; }; mframe.safefunction(Document.prototype["moveBefore"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////


///////////////////////////////////////////////////

document = mframe.proxy(document) // 代理

var curMemoryArea = mframe.memory.HTMLCollection = {};
var HTMLCollection = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLCollection);

// 迭代器
mframe.memory.HTMLCollection.iterator = function values() {
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.HTMLCollection.iterator);

Object.defineProperties(HTMLCollection.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLCollection",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.HTMLCollection.iterator,
        configurable: true
    },
});
////////////////////////////////////////////////////////// 2025年4月11日 更新
var curMemoryArea = mframe.memory.HTMLCollection = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// length
curMemoryArea.length_getter = function length() { return this._length; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(HTMLCollection.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.length; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._length !== undefined ? this._length : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
HTMLCollection.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLCollection.prototype["item"] = function item() { debugger; }; mframe.safefunction(HTMLCollection.prototype["item"]);
HTMLCollection.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(HTMLCollection.prototype["namedItem"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////////////////////////////

/**
 * 创建并返回一个代理后的HTMLCollection数组，其中每个DOM元素都通过mframe.proxy进行了代理。
 * @param {jsdom.HTMLCollection} initCollection 通过jsdom.document.getElementByXXX()获取的HTMLCollection。
 * @returns {Array} 返回代理后的DOM元素数组。
 * @description
 * 注意一：initCollection中的对象都是jsdom的对象，没有原型链。因此需要通过document.createElement(i.tagName)创建后再放入collection中。
 * 注意二：需要同时更新原型存在的属性和原型不存在的属性，例如 `<script type="text/javascript" r='m'>` 中的 `type`（原型有的属性）和 `r`（原型没有的属性）。
 * @example
 * var elements = mframe.memory.jsdom.document.getElementsByTagName(name); // elements是jsdom的HTMLCollection
 * return mframe.memory.htmlelements['collection'](elements);              // 展示如何调用
 * @private
 * 不能在document.createElement时调用，因为这不是页面的任何一个标签，只能算是DOM的中间件。
 */
mframe.memory.htmlelements['collection'] = function (initCollection) {
    console.log("====================mframe.memory.htmlelements['collection']  begin================");
    
    // 暂时关闭代理,避免影响判断(下面要用set进行数据转移)
    var flag = mframe.memory.config.proxy;
    mframe.memory.config.proxy = false;
    // 创建HTMLCollection实例
    var collection = new (function () { });
    // 代理数组中的元素+将数组中原jsdom的数据,变为我们有原型链仿照的数据
    for (let i = 0; i < initCollection.length; i++) {
        // 创建 具有原型链的数据
        collection[i] = document.createElement(initCollection[i].tagName);
        // 1.原型没有的属性也要有
        for (var attr of initCollection[i].attributes) {
            collection[i][attr.name] = attr.value;
            collection[i].setAttribute(attr.name, attr.value); // 都要设置, !!!! 巨坑,找了2天
        }
        // 2.原型有的属性要有
        for (var name of Object.getOwnPropertyNames(collection[i].__proto__)) {
            if (name === "constructor" || typeof initCollection[i][name] === 'function' || name === '__proto__')
                continue;
            collection[i].setAttribute(name, initCollection[i][name]); // TODO 其实如果是DOM元素,都需要这一行,后面踩坑再说吧 2025年4月11日23:46:54
            collection[i][name] = initCollection[i][name];
        }
        // 覆写原来的jsdom域
        collection[i].jsdomMemory = initCollection[i];
    }
    collection['length'] = initCollection.length;
    // HTMLCollection原型链继承
    collection.__proto__ = HTMLCollection.prototype;
    mframe.memory.config.proxy = flag; // 恢复代理

    // 二次代理
    for (let i = 0; i < collection.length; i++) {
        collection[i] = mframe.proxy(collection[i]);
    }
    console.log("====================end================");

    return collection;
}
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
debugger;
window.setTimeout = function(){}
window.setInterval = function(){}
window.ActiveXObject = null;

//ts_begin
$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=25642;$_ts.cd="qxWdrrAlmA7qxGqbqAgKcaqLDqGbragPrc3DEaGlEc3ckPEkcaqbqc3rkp3hqc3oxGAimG7qxGEbqa0KxGqOcAABxGAiEGVbqAgfqG7qxGQbrqgKxGEmr13rk1Eccaqbrn3lkf3bqGVmxGEiEGElr1Wtrclhqc3kxGqJmG7qxG3bragKxGEiEGWbqqVmxGQiEGAFr1WvvGlCWqVmWO88EagDdcrCkb9Rsaeu.hrgksXbfmGQkmXQOijXtDeY.ZkIqqAmraAc7AkoU6g2JOhlY2fUQse0pdrlYTzYMsrKnsRfp1QeUC6.MCaLF6xLM4xzwKfNtCNCZbZ7Fvr.FcdawbSLKc7bWtfr8bZ0HOrR5vJlWCfEsKhHQCSBwcV5KHrCMDGNFUmBZPeXQK2.tD6.MCaLF6xLM4xzwKfNKPGfjPT7FmpwMKkUwmrUF9Yz1BepW02zAc3ySKTTFD9.FvMnMnSjQDzLhdrCMDGNFUmBZPeXQK2.K15ZJvpfFOqeRwep89mk16JbTvlS3VmGp1D9KDySFK7LM8zBMcf.QbfB7bTTFD9.FvMnMnSjQDzLU.EfiK2.ITrEe6Eu1mrGUohyJPgTQvYNphayKCNaFCGBZoR7Fc2NQKdnhCySFK7LM8zBMcf.QbfBanZPpb7Spu.FJCpBIkJqYjNpKDfhIVYsC1l_UCznFD5nMUYLF1zjwBxBhDNaFCGBZoR7Fc2NQKdnUPabp6RH1dxfJVxoFVryNbYLsC22JCUi3PE5Ub2SMdEBMvmNFnfz_Ce7tDznFD5nMUYLF1zjwBxBU1GvpopNT9TAUVS3MKuyY0QTMVYq87pPA13dUDNCZbZ7Fvr.FcdawbSLtK2SMdEBMvmNFnfz_Ce7K192s9oiF6pP1Omxhwzv8DZn3DJayDeOp1QeUC6.MCaLF6xLM4xzwKfNtCNCZbZ7Fvr.FcdawbSLKc7b1Jwu8UJhQOpi4DezRvmCp9seKKGTpcV5KHrCMDGNFUmBZPeXQK2.tD6.MCaLF6xLM4xzwKfNKPGfn0NYFVgn1bDNwvmKAsxb1zr0W9zxwP3ySKTTFD9.FvMnMnSjQDzLhdrCMDGNFUmBZPeXQK2.K15ZMVlCwYwvKFw_wnNnW0r65mr1IUx.p1D9KmzIxT9.38z_RU3LFKW74DRuF6rTRCFSRDYa1CxusBzaQCYP39w7_CT0xP2uwvM4UPSIxT9.MHxjwblLRDSP_PSf3DfXFPu7MDeNtbrfweS_1Kqvt6rS_CRwtmg2KPueQD2OFnVLw5SCRY23tCNCZbZ7Fvr.FcdawbSLtK2SMdEBMvmNFT9BBoJI1lfdA2MoWKNeAUT1QQQaQuTvU0VfNmfXQK2.tD6.MCaLF6xLM4xzwKfNtCNCZbZ7Fvr.Fm_nEUpXwoTZwzNvMuwbpOrjjKz2sYrYw6tZiYzjQDzLhdrCMDGNFUmBZPeXQK2.tD6.MCaLF6xLMZWBEvSfAmJsuKYPQ0fWWuFNs6YiQCeK15Zfi2e.QbfB7bTTFD9.FvMnMnSjQDzLhdrCMDGNFUmBZ2yetDznFDdkcAk8MoebAHSAAsa5skmz0Y2WQKlZR94jYYYrA93dKIS23TACQsagZ0fjVkx8Fu82YurBJDL0wjzcR2RqHoxvCKY9ADQnYmhpJO7Zs2rcFH2cFDrwY60gTDe6RbTU3bczQopbtuluJtePJuq.MUQgSClnJvJw1vBsRuratuluJtePJuq.MUQg5VSTADmcFDoip2xmHbRA3wzy1mmuAbxJZsfaWOrC1Vo4WV2n3uAdi7pFsDwVU2SayCxotOWaWuhdJkAjM6Ad1BxLimYoVDy1d6zbtOWaWuhdJkAjM6AlqygcWqAlJAAAevw0wo3eHkcvJkGZJsVCiFL6WaAkWsW0.CE6rq3SWuF8csl0HsATJtQuJkamququNuVqmWAkiorvru.gFLBvKRIZ7qQmmul_gbKrFjnUryCwqaArqGWlEnUEuGZ9z107aSb4uFZdTnajhobOvs8Lt_ehZ9QtyY47vGLSWOqTJki7iOWlrkQlcFZ0JkqSWsWnNuLqhTJDMUkdJlxuJvgj8eEa8OrvH2mKZDTt3KWTF0sTMs2.UTYzVHZuWYyjFKWkvGWqrqA6rqtNqaqlrAQqUhNfFqArKcr.daWlKnmbQGiFUcAGHqQDWtakqOVTraVu";if($_ts.lcd)$_ts.lcd();
//ts_end




(function(_$bu,_$a$){if(!$_ts.cd) return;var _$_r=0;function _$_l(){var _$jW=[21];Array.prototype.push.apply(_$jW,arguments);return _$kD.apply(this,_$jW);}function _$g$(_$jr){return _$_l;function _$_l(){_$jr=0x3d3f*(_$jr&0xFFFF)+0x269ec3;return _$jr;}}function _$af(_$_l,_$jL){var _$_h,_$_$,_$_H; !_$jL?_$jL=_$bJ:0,_$_h=_$_l.length;while(_$_h>1)_$_h-- ,_$_H=_$jL()%_$_h,_$_$=_$_l[_$_h],_$_l[_$_h]=_$_l[_$_H],_$_l[_$_H]=_$_$;function _$bJ(){return Math.floor(_$$8()*0xFFFFFFFF);}}var _$jL,_$b$,_$$j,_$iC,_$aR,_$_N,_$$8,_$$H,_$_j;var _$c9,_$a1,_$dq=_$_r,_$cN=_$a$[0];while(1){_$a1=_$cN[_$dq++];if(_$a1<12){if(_$a1<4){if(_$a1===0){ !_$c9?_$dq+=2:0;}else if(_$a1===1){_$kD(21);}else if(_$a1===2){_$b$=[4,16,64,256,1024,4096,16384,65536];}else{ !_$c9?_$dq+=0:0;}}else if(_$a1<8){if(_$a1===4){_$_j=_$iC['$_ts'];}else if(_$a1===5){_$_j.lcd=_$_l;}else if(_$a1===6){_$c9= !_$$H;}else{_$dq+=2;}}else{if(_$a1===8){_$iC=window,_$aR=String,_$_N=Array,_$jL=document,_$$8=Math.random,_$$H=Date;}else if(_$a1===9){_$_j=_$iC['$_ts']={};}else if(_$a1===10){return;}else{_$c9=_$_j;}}}else ;}
function _$kD(_$$d,_$eB,_$ca){function _$gu(){return _$ct.charCodeAt(_$cZ++ );}function _$_7(_$_l,_$jL){var _$_h,_$_$;_$_h=_$_l.length,_$_h-=1;for(_$_$=0;_$_$<_$_h;_$_$+=2)_$jL.push(_$_4[_$_l[_$_$]],_$$4[_$_l[_$_$+1]]);_$jL.push(_$_4[_$_l[_$_h]]);}var _$_l,_$jL,_$_h,_$_$,_$_H,_$bJ,_$_r,_$dq,_$c9,_$jW,_$a1,_$cN,_$$t,_$$1,_$a3,_$$4,_$_y,_$ct,_$ef,_$cZ,_$hf,_$dn,_$_4;var _$hH,_$$N,_$_5=_$$d,_$_1=_$a$[1];while(1){_$$N=_$_1[_$_5++];if(_$$N<91){if(_$$N<64){if(_$$N<16){if(_$$N<4){if(_$$N===0){_$_h[0]="sa|xub`ymbot`ab~uzs`bg|q`mpp3dqzb:uabqzq~`x{ombu{z`mna`bqab`|~{b{o{x`~{czp`/obudqF=nvqob`o~qmbq3xqyqzb`omxx`axuoq`bm~sqb`~qa|{zaqBqfb`&`(`{|qz`rx{{~`|cat`czpqruzqp`{zx{mp`+`|~{b{bg|q`3wo>`~qy{dq3dqzb:uabqzq~`~qy{dq1tuxp`uzpqf=r`t~qr`~qa|{zaqBg|q`p{ocyqzb3xqyqzb`sqb3xqyqzb0g7p`v{uz`abgxq`xqzsbt`rczobu{z`~qa|{zaq`N`o{zomb`sqb`a}~b`#`bqfb`tbb|(`caq~/sqzb`F;:6bb|@q}cqab`b{Ab~uzs`a|xuoq`tqmpq~a`m||xg`zcynq~`sqb/bb~uncbq`{zq~~{~`-`n{pg`abmbca`tbb|a(`{z~qmpgabmbqotmzsq`zmyq`Q`~qmpgAbmbq`m||qzp1tuxp`3dqzbBm~sqb`|{~b`o{{wuq`ZR`abmbcaBqfb`S`~qa|{zaqF;:`qdqzb`6B;:4{~y3xqyqzb`{z|~{s~qaa`~qacxb`qfbq~zmx`wqg1{pq`uz|cb`sqb3xqyqzba0gBms<myq`|q~r{~ymzoq`oqux`b{:{eq~1maq`{zx{mpqzp`buyqAbmy|`a~o`aqb/bb~uncbq`F;:6bb|@q}cqab3dqzbBm~sqb`s`VVU`ymbot;qpum`m`~mzp{y`pud`sqbBuyq`acnab~`;mbt`{zx{mpabm~b`|mbtzmyq`ao~u|b`aqzp`omzdma`b{|`mobu{z`ncbb{z`omz>xmgBg|q`x{omxAb{~msq`j`z{pq<myq`z{e`tma=ez>~{|q~bg`uzbq~zmx`uzpqfqp20`{zbuyq{cb`P`|m~aq`tuppqz`;uo~{;qaaqzsq~`{zacooqaa`aqb`ymf`uzzq~6B;:`~q|xmoq`wqgp{ez`btqz`aqm~ot`)`{zmn{~b`|rrR`oxqm~7zbq~dmx`abmow`u`oxuow`QQ`R`$ny4RmFHx@yxDgC68`pmbm`y{caqy{dq`x{mp`r{~y`J`K`m||xuombu{zQfyx`sqb7bqy`aqb7zbq~dmx``|{|`@q}cqab`qzcyq~mbq2qduoqa`@qa|{zaqOBg|q`___BA___`m||qzp`y{caqp{ez`y{caqc|`y{zbt`pqao~u|bu{z`6qmpq~a`T`|m~qzb<{pq`o{y|uxqAtmpq~`$n_omxx6mzpxq~`rqbot`o{zbmuza`duaunuxubg`r{zba`sqb1{zbqfb`3xqyqzb`qdmx`ymbotqa`|rnT_R`ab~uzsurg`t{ab`acnyub`|rpR`b{cotqzp`ua<m<`$_GDBF`) Aqoc~q`ruxxAbgxq`5qbDm~umnxq`;qpumAb~qmyB~mow`va{z`p{ocyqzb`{nvqob`yqpum2qduoqa`omzpupmbq`{cbq~6B;:`eupbt`tqustb`aqb7bqy`ox{aq`t{abzmyq`dmxcq`=dq~~upq;uyqBg|q`sqb=ez>~{|q~bg2qao~u|b{~`nmbbq~g`]`$_GEBC`zcy7bqya`$_ba`~emR`r~mobu{zmxAqo{zp2usuba`~enR`mn{~b`x{omxq`aqaau{zAb{~msq`pmg`b{cotabm~b`/vmf ~qa|{zaq n{pg pqo~g|bu{z rmuxqp O `b{2mbmC@:`aqb@q}cqab6qmpq~`sqb@qa|{zaq6qmpq~`{rraqbEupbt`/@@/G_0C443@`|rqR`otm~1{pq/b`q~~{~`sqb0{czpuzs1xuqzb@qob`ubqyAuhq`aqxr`~`buyqH{zq`yqaamsq`\"`|rmR`{rraqbCzur{~y`bms<myq`b{5;BAb~uzs`|m~aq7zb`nqbm`otuxp:uab`$n_|xmbr{~y`I{nvqob /~~mg]`>`sqbA{c~oqa`zcynq~uzsAgabqy`mx|tm`mppqp<{pqa`$<E3W<h@wGvtyGh;V`o~g|b{`dq~bqf>{a/bb~un`y`omxqzpm~`{dq~~upq;uyqBg|q`gqm~`r~{y1tm~1{pq`o{zbqzb`rmRO`D3@B3F_A6/23@`o`x{omx2qao~u|bu{z`|roR`mbb~uncbqa`{rraqb6qustb`xq`sqbAtmpq~>~qouau{z4{~ymb`) qf|u~qa+`ruxxBqfb`$n_aqbc|`ao~{xx`atmpq~A{c~oq`dp4y`) AmyqAubq+<{zq`XUXSYRYVXUXZXSWTXWXXYTXWYUXZToXUXSYRYVXUXZXSWrYTXWXXYTXWYUXZToXUXZXWXUXnVoXrXYX[XqToXVXWXUYTY[YRYVVUXSXoXoXTXSXUXn`mo{a`xo{aw`;afyxUPF;:6BB>`{x{pz1~ryu`o~qpqzbumxa`{nvqobAb{~q`tmat`;uo~{a{rbPF;:6BB>PSPR`{nvqobAb{~q<myqa`mbb~uncbq<myq`mpp0qtmdu{~`5qb/xx@qa|{zaq6qmpq~a`{`x2bqt|`1|~bgq{g9u>~m`qfqoAo~u|b`bqfb0maqxuzq`m|q|~D{azu`{cot`~qy{dq7bqy`r{~3mot`qaom|q`pqo{pqC@71{y|{zqzb`~qurubzqpu_|t`_$~o`YYXWXTYUYVXrYTXW`mzot{~`oqxxcxm~`b{coty{dq`b~mzamobu{z`2=;>m~aq~`otm~suzsBuyq`\\iJPM-K\\k`xxm`$n_{z<mbudq@qa|{zaq` =`b{C||q~1maq`xuzw>~{s~my`mbbmotAtmpq~`Uvq/:qAamX`mbbmot3dqzb`o~qmbqAtmpq~`qA{;4nxu4x~{By{{Nx{A{s;cqa`euymf`|~q{amznx~m`zcxx`otuxp~qz`3>3_`~cz`4@/5;3<B_A6/23@`~eoR`wqgc|`%`zumsd{m~b`pm|qym5`|rnR`;uo~{a{rbPF;:6BB>`smyym` I i\"c~x\" ( \"abc`bqzbAb{~msq`I`ggw~wb{ia`UW`oxuqzbG`],*u,*Qu,*!Iqzpur]OO,`aturb`~bigq~cb`l`Izmbudq o{pq]`dq~au{z`dupq{`9qgn{m~p`XVZ`1{czb`{zc|s~mpqzqqpqp`;327C;_7<B`*3;032 up+`uoqx`sqb>m~myqbq~`i`sqb/xx@qa|{zaq6qmpq~a`6756_7<B`xEu`qf|q~uyqzbmxOeqnsx`|xcsuza`vmdmao~u|b(`c~xJ#pqrmcxb#caq~pmbmK`sqbAc||{~bqp3fbqzau{za`o~qmbq>~{s~my`WrWrXUYTWYXWXTToWrWrXYVUYTWYXWXT`a~o3xqyqzb`<{pq`pqduoq{~uqzbmbu{z`1{xxqob5m~nmsq`kLa\\]\\qp{o qdubmzI\\La\\i`nq{AwobqcJx~`pqduoq7p`x6qtubs`ym`zmyq)kombotJqKik`yqbt{p`djxizze`WrWrWSWVWRWrWrVZVrVrVnWrVqVrWVV[VXV[VWWT`2qduoq=~uqzbmbu{z3dqzb`ao~qqzG`ao~qqzF`z{pqBg|q`1~ty{\\qJQp\\KM`~y{o`tmzpxq~`) |mbt+Q`pqruzq>~{|q~bg`~qa|{zaq0{pg`XVXrXoYRXZX[XqTo`WTV`xqdqx`am~rum`nqtmdu{~`qbf3~|aquaz{`coafzgo<wzzZafc6mjd`yH__`npq_mat~no_{ufqz~borqm`A8y{bayc1bbyNqym~4qbmq~1bby__`caq>~{s~my`__|~{b{__`gbu~m`t{dq~j{zOpqymzpjz{zqjmzg`P3:9//_::`nnZTwv`o{zab~cob{~`#SYq`{pslrgkc`}~owxy2{3fbtE8u6/|SaDG9CU@4;?eZ75r>=[Tnd:<vOYhF0mAzcRB1Xsg_VHqWpl!.$%^&LJKM+*,P-Q()ikI]j `z{zq`o~qmbq3dqzb`czqaom|q`|e|oat|obVlk~roobk~v`q~g`N pqo~g|bqp A<( `uA6yuqA)yucA)zA<yucA)zm4sz{Asz9)umuB4)zmAsz{5sT0SU)Tm9Bu5uT0SU)Tu;~oa{r{ bmGq6)uu6m~us{zA zm a05A)6Buqub: subtA)6BuqubA)9BumubA)ABz{)sBAm4sz{asz:)Au)c{GGcmc)zBAuFqt)uBAtHz{asz{)sH4tABc)uH4mGb{)uBAm1guzcA)6B|c){BAu:ubA)FBzuwsumA)FBzuqe)u`UXUT`fmewx`,zm|aQ*uuuxxyyyyyyyyyyy,\"f|VSS(qhuaObz{r)uuxxyy(gxuymrObz{r\"+qxgba \"th\"+szmx zm|a*`x:`ur~myq`abpmmzzxq{`omo`nuzp0crrq~`mnnpg{`czur{~yTr`mna{xcbq`dxmcq`ox{zq`uqz~zfBbq`bmx|`AwgP|2qqqob{bzu`/n{~b`|{|abmbq`~{{b`otm~aqb`pnxoxuow`a~ilg`~{{Obmtyy~qqtpmaOmt{pOeuc`'mxq~bN o{zru~yN |~{y|b puamnxqp r{~'N p{ocyqzb\\Px{ombu{z\\Pt~qr`;afyxTPAq~dq~F;:6BB>PVPR`:uqn`XpXWXqYWXTXSYT`acnab~uzs`qbtq~zqb`eqnwub@B1>qq~1{zzqobu{z`omxxnmow`|m~qzb3xqyqzb`:=E_4:=/B`ab`pmbmO|~{y|bOmzaeq~`_xAqqczyu2_37q_o@p{q~_~aNqqzxyuNcxoxmxAqqczyu`a0`otm~suzs`Nu:nq{mc/{bu4xxs_ym/qooc{bzz7{r:Nqumn0{omcw_|m0wo|c:Nqumn0{omcw_|q5Db~quaz{:Nqumn0{omcw_|{:pm:Nqumn0{omcw_|q@{oqdg~:Nqumn0{omcw_|bAbmNqu:nq{mm1xxq@c}aqNbu:nq{mm1xxq@c}aq/bgaoz:Nqumn2{e{xzm{Cpx~:Nqumn5{bq~>rqNau:nq{mq5Cbqa7~rzN{u:nq{mq5Cb7CN2u:nq{mq5Db~quaz{:Nqumn7{azNbu:0q{m{:w{|cz2/appq~aa:Nqumn={q|7zmyqso=N~u:nq{mq@qyny~qqAqxbo{uNzu:0q{mqApzq@c}aqNbu:0q{mqA6ba{/bppq~aa:NqumnC{uzaz>942<Nb{ru:gqumnN{{<ubgru:nq{mf3`nqr{~qczx{mp`zbq|a~mqwN~__az_Nz_/a||zqBpfqNb{qqE0n{~ae~q`XUYTXWXS`XSTYYYXS`x{mpAo~u|b ++ \"r`y|b`STYPRPRPS`>~q{ry~zmqon=qad~~q`o|mcbq~bAomBwm~qo`=>3<`nolalNvlyab`>=AB`gbi~b~cq ~Jzzepu`acrrufqa`sqb@mzp{yDmxcqa`=nvqobP7zvqobqpAo~u|bPqdmxcmbq`aqbBuyq{cb`eqnwub1{zzqobu{z`~qbc~z mIn]J`{yub`dq~bqf>{a/~~mg`ocAbnc`A{twomeqdx4amPttAo{ewdm4qmxta`ruombu{z`__uz`JmzgO|{uzbq~`>xqmaq qzmnxq o{{wuq uz g{c~ n~{eaq~ nqr{~q g{c o{zbuzcqP`qzmnxqDq~bqf/bb~un/~~mg`nmaq`b{4ufqp`{~|`Aqzp`uxgbtozmqs`^\\aMj\\aM$`ZZ`q_`;afyxPF;:6BB>`~z __pu~`x{s`n{l~~dz}o`qnzxm>qxpuczs`f`JmzgOt{dq~`buyq{cb`AB/B71_2@/E`oqAq~dq~a\" (`6yuaqpzp`|a_u{tw{pqyNh{z/yubm{uAzmbb~uBqyyNh{z7qpqf2pN0{y@h}qqcbaz/yubm{u4zm~qy`ncrrq~2mbm`ruxq<myq`eubt1~qpqzbumxa`;afyxTPF;:6BB>`4x{mbUT/~~mg`czur{~y=rraqb`;afyxTPAq~dq~F;:6BB>PXPR`~pdu~q`nxcqb{{bt`o{{wuq puamnxqp`o_pmo?p|{a{zmYrXmo|Hro:ryAxg_{yxnpNoop_{m{?m|ramz|YrX:oyHxo_r~/m~ogpNmop_|{{?zmraXm|YHr:oryxo~_{>ayqu`yqbm`SRYYVUTSVZ`|cb`{o{x2~|qtb`!zqe rczobu{zJKiqdmxJ\"btuaPm+S\"KkJKPm`Q(caq~_r{zba`pqruzq>~{|q~buqa`~{`pu~qdO~dqxmmcqb`;{caq`xMNHG`c{s`b;mc{bzua=qnq~~d`pzmqs{~acgx`pbt`euzp{e\\P{|qz + rczobu{z \\Jc~xN r~myq<myqN rqmbc~qa\\K`qfqo`sqb=ez>~{|q~bg<myqa`bzqd3~qbzu{>A;`Jcrozubz{KJi md ~ m +qz em2qbKJ )qpcnss~q )q~cbz~z eq2 bmJq K O m ,RS)RJkKK`u:+3658[8?`ndpmo}tcp}`J^\\QLKjJ\\QL$K`_|xm`o~qmbq=rrq~`qp{;~qpmq@_f{rq~ur_N__f{rq~ur__`}~owxy2{3fbtE8u6/|SaDG9CU@4;?eZ75r>=[Tnd:<vPYhF0mAzcRB1Xsg_VHqWpikjl !#$%JKLMNO)+-.I]^`ya7zpqfqp20`RPRPRPR`a~snj|Uj~qoTRTRjmzg`>~{yuaq`^J-(\\piSNUkJ-(\\Pj$KKiVk`pua|mbot3dqzb`QBY/gB~f{Ef5p`/obudqF 1{zb~{x JUTOnubK`@B1>qq~1{zzqobu{z`z{ubo/p~{oq@~qp~{oq@btsu~egmx|_Nz{ubo/y~{r~q>~qp~{oq@btsu~egmx|_Nqycaq@btsu~egmx|_N~{boqxqAbqA~qp~{oq@btsu~egmx|_NqbmbA~qp`~qa|{zaqC@:`qrb`Eqn:F{;ass;<_7C3?_C`/vmf ~qa|{zaq n{pg ~q|xmgN qf|qobqp A<( `;afyxTPF;:6BB>PUPR`YVXrXrXoXTXSYT`dq~bqf/bb~un>{uzbq~`m{/p;mbotC~x`;`fB`bau:g~bz3~qd~qan=qozmy~{r~q>`wLI`|m~aq4~{yAb~uzs`mooqxq~mbu{z`yh{u6ppzq`o{p_`tbb|a(QQ`$n_rqbot?cqcq`p{>x`I)&]`pmbm(`@qs3f|`pk0c}K~lbnk`co1|axam`Epx{ eqz`sx{nmxAb{~msq`xPzc6Lq=Xp__`!uy|{~bmzb) duaunuxubg( duaunxq !uy|{~bmzb) eupbt( SRR% !uy|{~bmzb) hOuzpqf( TSVYVZUXVX !uy|{~bmzb)`CuzbZ/~~mg`xsmczqmas`bg~~ibq~c z__urqxmzqyk)moobJtKqki`y{caqqzbq~`.pqncssq~`mooqxq~mbu{z7zoxcpuzs5~mdubg`@qa|{zaq`__#oxmaaBg|q`vnaotqyq(QQ`qzmnxq_`tyj}y*tsyjsy`~qpmq@qxu4`6756_4:=/B`>_`qE1C`p{/x~xbq`mx>gxqm5~T { z1{bx~`r{~ymbu{z`zqppu6buwnqe`n`*{novbqp +un\"ZnvT\"wx mouapao+x\"pa(uWURRSr[ZZOn[SWSOOonrTnOZmRmRnRpRRonqe\"u tp+b|\"fRt\"q tubsR+|\",f*\"nQv{bq,o`RW`4:=/B`tbb|a(\\\\`aqbBuyq`XX`WUWYVUYVXoTqWUWYVUYVXo`~qa{xdqp=|bu{za`pq{JbyK `pc`/ppqA~mto~>d{pu~q`A3<2`~qpu~qobqp`mbb`qyuBwouc?PqyuBwouc?`2mbqBuyq4{~ymb`YYXWXTXnX[YVWRXW`5qb@qa|{zaq6qmpq~`mxqgJ~yb Ko/ubqd F{1bz{~ xUJOTunKb`Jo{x{~Osmycb`zb7z`p~me/~~mga`VWVoVWVUWVWTVrVqWrVTWTVrWYWUVWWTWrWYV[VqVVVrWYWrVUVoVrWUVW`2ua|mbot3dqzb`y{caqxqmdq`YUX[XVXWXWYZYRXoXSY[X[XqXYXXXoXSXY`VYXWYVVYXWXqXWYTXSXoVpV[VVToVYXW`>Q@`cjae{flwd`QtQ`sp3 `r{zb`~snmJTVRNSSRNWUNRPVK`;afyxTPF;:6BB>PWPR`ruxqzmyq`yq`sqb/bb~un:{ombu{z`qszmtogbuxunuaudbuwnqe`N c~x( `m@xqpDqu@{qPDmux`r1Aq~t|m`aq|gBqyuy`t`YX`VP\\RIUOP] M5JjB;AAj61OK`{p{<Bbm~wo`aq`mcpu{`k`o~qmbq=nvqobAb{~q`oxmaa`HZF688GPny4RmFHx@yxDgC68JK`VXXSYXXWV[XUXrXqVmXSYXXSV[XqYVXWYTXXXSXUXWToXmXWYUX[XrXq`tbb|(\\\\`oxuqzb q~~{~`y{h1{zzqobu{z`<{bu`rczobu{z rqbotJK i Izmbudq o{pq] k`x{mpqp`4xmat`da~ve`fP@q`7zbx`r{zb4myuxg`y{h@B1>qq~1{zzqobu{z`qN_q_neupd~_qq~xdcmqmNba_q_zxuq_cqyxdcmqmNbr_f_upd~_qq~xdcmqmNbp_~_qu~dz_ec|~|mNq_pq_neupd~_qc~~zmeq|p|_Na_qqzxyu_cec~z|mq|_p_Npr~fqu~dz_ec|~|mNq_pq_neupd~_qa~uo|~rbc_Nz_oq_neupd~_qa~uo|~rbz_`i \"u`2qduoq;{bu{z3dqzb`{>zuqb3~qdbz`m+omzpupmbq(`mxszmcqs`;afyxTPAq~dq~F;:6BB>PWPR`pqduoqy{bu{z`/pc{u~Bom:wauNbqpmrxcAbmbcbNan=qvboaPbq~>b{b{|g=qNrmbn{{~ae~q3_qdbzeNnquw@b}qqcbau4qxgAbayq{N{zq|m~qpmbtopqudeqtozmqs>NbmTtP2~|b{b{|gPqpm>pbmNt{A~cqoc0rr~q|P{~{bgbq|oPmtszBq|gNqqebmqt0~u~spNqto{~qyoPua|Namea~{_pmymzqs_~zqnmqxNp{pcoqybznPp{PgOfaymOooxq~qbm~{qwNgfqqbz~xm/Pppm4{du~qbANs{c{{:usCzubaxANc{o~0qrcqrN~tae{{;mp2xmu{xNs{pcoqybzaPxqoqubz{bP|g2qbqumNxDA>5bmqbz~x3yqzqPbDA_5<CB7B_>G_30=38B1=0<C725<=0NF{pcoqybz{Pazxqoqubz{tozmqspNo{yczqPb{ngpaPgbqxnPomsw{~zc0pqxpz{;qppNo{yczqPb{pcoqybzx3yqzqPbz{q~uaqh1Nzmmd@azqqpu~sz{1bzfqTbP2~|b{b{|gPqqewnbuq57bmyqsm2mb26CNE1nqf3Nb21B/A/oqubz{|P{~{bgbq|~Pyqd{Nqx0n{{2ze{xpmm1xxmnwo_NFEA8pNo{yczqPbaym1a|{:womEz~zu=srr1NAAt1~mqa@bxcNq{pcoqybzaP~ox{uxszx3yqzqPbbaxgPq{rbzmDu~zm<byc~qou4Nzcbo{uPz~|b{b{|gPqunpzoN~ty{Pq|mP|z7baxmAxmbqbuN<ap{Equtqb|aomNqn=qvboaPmqNx{pcoqybzpPrqcmbxt1~mqaNb__urq~{r_fN_z{qyaasmNq__{a{s_cqacoq~u_|zbc1N{xqad3zqPb~|b{b{|gPqzubux1a{3qqdbzsNbqm;obqt1pAAc@qxNa{<uburmoubz{6N;B4:m~qyqA3bqxqybz|P{~{bgbq|tPam{>zuqb1~|mcbq~pNo{yczqPb{ngp{Pyzc{qazqqbN~r=ar~oqq1zzmmd@azqqpu~sz{1bzfqTbN2to{~qy=NvnoqPb~|b{b{|gPq__qpurqzqAbb~q__pNo{yczqPburqx~1mqqb2pbmNqqewnbuc/up1{z{qbbf|P{~{bgbq|oP{xqa5Nbqq>r~qBbaNaq;up1mz{~bx{qxN~fqqbz~xm7PAamqo~>t{~udqp7~azmbxxpqBNfqBbm~wou:ba|P{~{bgbq|sPbq~Bom0w7gNp{pcoqybzaPxqoqubz{pNo{yczqPb{ngpaPgbqxxPzu0qq~wmpNo{yczqPb{ngpaPgbqxbPfq/buxzsm:baAN~oqq=zu~zqmbubz{pNo{yczqPb{ngpaPgbqxyPzuuEbpNt|AqqtogAbzqtuaCabb~qzmqo{Nqz~~~{ENnqu94bmxas@Nmqqp;~p{/qb~ouqxm>qs_N{_q|m~>N~q{ry~zmqom>zuBbyuzuNsq|r~~{myozNq{pcoqybznPp{PgbaxgPqayqBbfuAqhp/cvbapNo{yczqPb{ngp{P|zsmNqDA55m~t|ou3aqxqybz|P{~{bgbq|yPh{q@c}aq>bu{bz~q{:wo1Nuxwom2mb;Npqmuz3~o|gqb3pqdbz_N$_}_tu{{XU_R_$N_{pcoqybz{Pyzc{qa{yqd0Nrq~{7qazmbxx~>y{b|d3zqPb~|b{b{|gPq39CGN>B6:;~4ymAqbqx3yqzqPb~|b{b{|gPqqewnbuq@c}aq4bxcAx~oqqNzfqqbz~xm`vdylfrqGlfr`{up `ob`otm~mobq~Aqb`o{zzqobu{z`xuzq<cynq~`8mm3dqf|o{bzu`{b{o|yqxqb`vnaotqyq(QQ}cqcq_tma_yqaamsq`>xmgq~P@qmx>`HZF688GP<E3W<h@wGvtyGh;VJK`0bqs`VXZZ`8A=<`oty~q{`RRRR`|~mtArqo`I\\\\\\\"\\cRRRRO\\cRRSr\\cRRYrO\\cRR[r\\cRRmp\\cRXRRO\\cRXRV\\cRYRr\\cSYnV\\cSYnW\\cTRRoO\\cTRRr\\cTRTZO\\cTRTr\\cTRXRO\\cTRXr\\crqrr\\crrrRO\\crrrr]`rczo`;/{|hm|~qomqz`6==9`wqb`mbb~uncbq dqoT mbb~Dq~bqf)dm~guzs dqoT dm~guzBqf1{{~puzmbq)czur{~y dqoT czur{~y=rraqb)d{up ymuzJKidm~guzBqf1{{~puzmbq+mbb~Dq~bqfMczur{~y=rraqb)sx_>{aubu{z+dqoVJmbb~Dq~bqfNRNSK)k`bs4qy~qmo:m{{bzu`}nn~_suqpnNn}w{a{xtrq`sqb3fbqzau{z`~qbc`otm~/b`=|qz`{naq~dq`VTYS`j__htqscxgtc_drcxae_u}`~mzsq;uz`A`eqnsx`;afyxTPAq~dq~F;:6BB>PUPR`|~qouau{z`||`q5<bfq@b}q27`<cynq~`ZU`mwmb{xAzzq;paqmaqs`xuzq<cynq~No{xcyz<cynq~Nruxq<myqNxuzqNo{xcyzNpqao~u|bu{z`b|u~oAzc@z{xmbmw`/vmf ~qa|{zaq n{pg ua z{b qzo~g|bqpN ~qa|{zaq xqzsbt( `~z bg|q{r _s`$_o{zrus__Ppqbmux__ M+ S`exkc`{Uapm0XZB0XZ`XoXrXUXSYVX[XrXqXTXSYT`cma~n`ruzqjo{m~aqjz{zqjmzg`kiKqJtobmok)Ke{pzuE r{qozmbazu e{`3zbbgu`acnb~qq`$nrZ[mRSX$`czpqruzqp\" && bg|q{r euzp{e !+ \"czpqruzqp\" && _sx{nmx=nvqob ++ euzp{e`Aqb@q}cqab6qmpq~`dupq{Q{ss) o{pqoa+\"btq{~m\"jdupq{Qy|V) o{pqoa+\"mdoSPVT3RS3\"jdupq{Qeqny) o{pqoa+\"d|ZN d{~nua\"jdupq{Qy|V) o{pqoa+\"y|VdPTRPZN y|VmPVRPT\"jdupq{Qy|V) o{pqoa+\"y|VdPTRPTVRN y|VmPVRPT\"jdupq{QfOymb~{awm) o{pqoa+\"btq{~mN d{~nua\"`|m~aq3~~{~`;afyxTPAq~dq~F;:6BB>`tbb|`SZ|f '/~umx'`zcuOydqxmmcqb`o{za{xq`m||uxmoubz{fQaO{twomeqdrOmxta`a`gaq~`B{cot3dqzb`q~~{~1{pq`qbmbAgbuxunuaud`(\\pM`;afyxP2=;2{ocyqzb`V`|~qouau{z yqpucy| rx{mb)dm~guzs dqoT dm~guzBqf1{{~puzmbq)d{up ymuzJK isx_4~ms1{x{~+dqoVJdm~guzBqf1{{~puzmbqNRNSK)k`mzp~{up`aunu`|{aubu{z`xqrb`?bE3qznzsqu`z{ubmbzqu~{`bqaba`x{nmx=nvqob !+ \"`|{e`WrWrYYXWXTXVYTX[YXXWYTWrXWYXXSXoYWXSYVXW`+b~cq`{oqaa7p`{|bu{za`#rZT`__mzot{~__`ZYXPSS`mxq~b`z(abczRSPau||t{zqPo{y\"kN i\"c~x\" ( \"abcz(abczPqwusmPzqb\"kN i\"c~x\" ( \"abcz(abczPrepzqbPzqb\"kN i\"c~x\" ( \"abcz(abczPupqmau|Po{y\"kN i\"c~x\" ( \"abcz(abczPu|bqxP{~s\"kN i\"c~x\" ( \"abcz(abczP~ufbqxqo{yPaq\"kN i\"c~x\" ( \"abcz(abczPaotxczpPpq\"kN i\"c~x\" ( \"abcz(abczPxPs{{sxqPo{y(S[URT\"kN i\"c~x\" ( \"abcz(abczSPxPs{{sxqPo{y(S[URT\"kN i\"c~x\" ( \"abcz(abczTPxPs{{sxqPo{y(S[URT\"kN i\"c~x\" ( \"abcz(abczUPxPs{{sxqPo{y(S[URT\"kN i\"c~x\" ( \"abcz(abczVPxPs{{sxqPo{y(S[URT\"k ]             k`VqXrYVWVYTXSXUXn`$`amdq`b|qi|`TZYWYTXoToTRXXYTXSXpXWVqXSXpXWToTRXXXWXSYVYWYTXWYUT[TRUpUqTRYn`B`yadu`o{{wuq3zmnxqp`sqbCzur{~y:{ombu{z`mpp`4czobu{z`OeaOpmbmO|~qduqeOqxqyqzb`oxuqzbF`rczobu{z oxqm~7zbq~dmxJK i Izmbudq o{pq] k`?0?{~ae~q`>Ex;qm~g1PF=`XSYXXSX[`ac~qmzqy`czobu{z\" && bg|q{r __pmbq_ox{ow ++ \"rczobu{z\"`aym;Bfc{to{>zuab`{zuoqomzpupmbq`o{y|xqbq`n{{xqmz`Ab~uzs`dmumBx|{`_`ibgex`~ustb`qdmxcmbq`^JJ-(I\\pmOr]iSNVkJ-((jKKiRNZkKJ((K-JJ-(I\\pmOr]iSNVkJ-((jKKiRNZkK$`VVVXWRXZXWXoYXXWYVX[XUXSUnWVX[XTXWYVXSXqTRVpXSXUXZX[XqXWTRWWXqX[UnVUXrXrXoXmXSYmYmUnWXXWYTXVXSXqXSUnVZXWXoYXXWYVX[XUXSTRVqXWYWXWTRVoWVTRWRYTXrTRUUUWTRWVXZX[XqUnYVXSXZXrXpXSUnVoVYTRWUXpXSYTYVWrVZTRYVXWYUYVTRWTXWXYYWXoXSYTUnVVV[VqWRYTXrTpXoX[XYXZYVUnVZXWXoYXXWYVX[XUXSTRVoWVTRUVUUTRVoX[XYXZYVTRVWYZYVXWXqXVXWXVUnVZXWXoYXXWVpWrV[XqXVX[XSUnWUVWVUWTXrXTXrYVXrVoX[XYXZYVTRVTXrXoXVUnVrWTTRVpXrXZXSXqYVY[TRWWXqX[XUXrXVXWTRWTXWXYYWXoXSYTUnVVYTXrX[XVTRWUXSXqYUTRWVXZXSX[UnVnXSXqXqXSXVXSTRWUXSXqXYXSXpTRVpVqUnVVVVVUTRWWXUXZXWXqUnXUXoXrXUXnUTURUSUXWrYXUSTqUSUnWUXSXpYUYWXqXYVnXSXqXqXSXVXSWTXWXYYWXoXSYTUnVpV[TRVoVSVqWVV[VqVYTRVTXrXoXVUnWUXSXpYUYWXqXYWUXSXqYUVqYWXpUUVoTRVoX[XYXZYVUnYXXWYTXVXSXqXSUnVZXWXoYXXWYVX[XUXSVqXWYWXWWVXZX[XqUnWUVWVUVXXSXoXoXTXSXUXnUnWUXSXpYUYWXqXYVWXpXrXmX[UnWVXWXoYWXYYWTRWUXSXqXYXSXpTRVpVqUnVUXSYTYTXrX[YUTRVYXrYVXZX[XUTRWUVUUnVXXoY[XpXWTRVoX[XYXZYVTRWTXrXTXrYVXrTRVoX[XYXZYVUnWUXrVpVSTpVVX[XYX[YVTRVoX[XYXZYVUnWUXrVpVUTRWUXSXqYUTRWTXWXYYWXoXSYTUnVZW[WZX[W[YWXSXqVmUnYUYUYVUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUVWVUnXYXpWrXpXWXqXYXpXWXqXYUnVoXrXZX[YVTRVnXSXqXqXSXVXSUnYVX[XpXWYUTRXqXWYYTRYTXrXpXSXqUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUVVoUnYUXWYTX[XXTpXpXrXqXrYUYRXSXUXWUnWUXSXpYUYWXqXYWUXSXqYUVqYWXpTpUUWVTRWVXZX[XqUnVUXrXoXrYTVrWUWWV[TpWZWVXZX[XqUnVVYTXrX[XVTRVqXSYUXnXZTRWUXZX[XXYVTRVSXoYVUnWUXSXpYUYWXqXYWVXWXoYWXYYWWTXWXYYWXoXSYTUnVTXWXqXYXSXoX[TRVrWVWUUnVpV[TRVoXSXqWVX[XqXYWrVYVTTRVrYWYVYUX[XVXWTRW[WUUnVXWmVpX[XSXrWYYWWrVYVTUSUZURUUURUnXZXWXoYXXWTpXqXWYWXWTpYTXWXYYWXoXSYTUnWUWUWVTRVpXWXVX[YWXpUnVUXrYWYTX[XWYTTRVqXWYYUnVnXZXpXWYTTRVpXrXqXVYWXoXnX[YTX[TRVTXrXoXVUnVZXWXoYXXWYVX[XUXSTRVoWVTRUTUUTRWWXoYVYTXSTRVoX[XYXZYVTRVWYZYVXWXqXVXWXVUnVZXWXoYXXWYVX[XUXSTRVoWVTRUTUWTRWWXoYVYTXSTRVoX[XYXZYVUnWTXrXTXrYVXrTRVpXWXVX[YWXpUnVVYTXrX[XVTRWUXSXqYUTRVTXrXoXVUnXYXrYWXVY[UnYUXSXqYUTpYUXWYTX[XXTpXUXrXqXVXWXqYUXWXVTpXoX[XYXZYVUnWUVXX[XqXVXWYTUnXqXrYVXrTpYUXSXqYUTpXUXmXnTpXpXWXVX[YWXpUnXpX[YWX[UnVpWTXrXUXnY[TRWRWTVUTRVTXrXoXVUnVSXqXVYTXrX[XVVUXoXrXUXnTRWTXWXYYWXoXSYTUnWUXSXpYUYWXqXYWUXSXqYUVqYWXpTpUVVoTRVoX[XYXZYVUnYUXSXqYUTpYUXWYTX[XXTpYVXZX[XqUnVSXSWRXSXqXYW[XSXWYTUnXUXSYUYWXSXoUnVTVqTRVpXrXZXSXqYVY[VrWVTRVTXrXoXVUnYZTpYUYUYVUnVqXrYVXrWUXSXqYUVpY[XSXqXpXSYTWmXSYYXYY[X[UnVZXWXoYXXWYVX[XUXSTRVoWVTRUUUUTRWVXZX[XqTRVWYZYVXWXqXVXWXVUnVSYUXZXoXWY[WUXUYTX[YRYVVpWVTRVSXoYVUnVqXrYVXrTRWUXSXqYUTRVVXWYXXSXqXSXYXSYTX[TRWWV[UnWTXrXTXrYVXrTRVUXrXqXVXWXqYUXWXVTRVTXrXoXVUnWTXrXTXrYVXrTRVpXWXVX[YWXpTRV[YVXSXoX[XUUnXpX[YWX[XWYZUnVqXrYVXrTRWUXSXqYUTRVYYWYTXpYWXnXZX[TRWWV[UnWUWUWVTRWXX[XWYVXqXSXpXWYUXWTRVoX[XYXZYVUnVoVYWrVrYTX[Y[XSUnXZY[XUXrXXXXXWXWUnYZTpYUYUYVTpYWXoYVYTXSXoX[XYXZYVUnVVVXVZXWX[VSWYUYTpVSUnVXWmWmWYWZVTWVVrWVWrWWXqX[XUXrXVXWUnVVXWYXXSXqXSXYXSYTX[TRWUXSXqXYXSXpTRVpVqTRVTXrXoXVUnYUXSXqYUTpYUXWYTX[XXTpXpXrXqXrYUYRXSXUXWUnWRXSXVXSYWXnTRVTXrXrXnTRVTXrXoXVUnVoVYTpVXWmW[X[XqXYVTX[VnXSX[WUXZYWTpWUUSUWTpWXUTTqUTUnVoVYTpVXWmW[X[XqXYVTX[VnXSX[WUXZYWTpWUUSUWTpWXUTTqUUUnVZXWXoYXXWYVX[XUXSVqXWYWXWVoWVTRWRYTXrTRUUUWTRWVXZUnVpX[XUYTXrYUXrXXYVTRVZX[XpXSXoXSY[XSUnWUXSXpYUYWXqXYWUXSXqYUVXXSXoXoXTXSXUXnUnWUWUWVTRVpXWXVX[YWXpTRV[YVXSXoX[XUUnVSXqXVYTXrX[XVVWXpXrXmX[UnWUXSXpYUYWXqXYWUXSXqYUVqYWXpTpUUWTUnV[WVVUTRWUYVXrXqXWTRWUXWYTX[XXUnYUXSXqYUTpYUXWYTX[XXTpYUXpXSXoXoXUXSYRYUUnYZTpYUYUYVTpXpXWXVX[YWXpUnVoVYWrWUX[XqXZXSXoXWYUXWUnWTXrXTXrYVXrTRWVXZX[XqTRV[YVXSXoX[XUUnXUXWXqYVYWYTY[TpXYXrYVXZX[XUUnVUXoXrXUXnXrYRX[XSUnVoYWXpX[XqXrYWYUWrWUXSXqYUUnVXXoXrYTX[XVX[XSXqTRWUXUYTX[YRYVTRVSXoYVUnVqXrYVXrTRWUXSXqYUTRVYYWYTXpYWXnXZX[TRVTXrXoXVUnVoWVVZW[WUWmVnTRVTXrXoXVUnVYWUWrWVXZXSX[UnWUXSXpYUYWXqXYVqXWXrVqYWXpWrUUWVWrUTUnVSYTXSXTX[XUUnXZXSXqYUTpYUXSXqYUTpXqXrYTXpXSXoUnVoXrXZX[YVTRWVXWXoYWXYYWUnVZW[WSX[VZXWX[TpUWURWUTRVoX[XYXZYVUnVoX[XqXVYUXWY[TRXXXrYTTRWUXSXpYUYWXqXYUnVSWTTRVUYTY[YUYVXSXoXZXWX[TRVVVTUnWUXSXpYUYWXqXYTRWUXSXqYUTRVpXWXVX[YWXpUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUVUWUnXZXSXqYUTpYUXSXqYUTpXTXrXoXVUnVoYWXpX[XqXrYWYUWrWUXUYTX[YRYVUnWUWUWVTRVUXrXqXVXWXqYUXWXVUnWUXSXpYUYWXqXYVVXWYXXSXqXSXYXSYTX[WTXWXYYWXoXSYTUnVSXqXmXSXoTRVpXSXoXSY[XSXoXSXpTRVpVqUnWUXSXpYUYWXqXYWVXZXSX[TZYVXWYUYVT[UnVXWmVoXSXqWVX[XqXYVZXWX[TpVpTpVYVTUSUZURUUURUnVZXWXTYTXWYYTRVrWVWUUnVYWUUVUWWrVSYTXSXTTZVSXqXVYTXrX[XVVrWUT[UnWUXSXpYUYWXqXYTRWUXSXqYUTRVoX[XYXZYVUnVUXZXrXUXrTRXUXrXrXnY[UnXZXWXoYXXWTpXqXWYWXWTpYVXZX[XqUnWRVqTRVpXrXZXSXqYVY[VrWVTRVpXWXVX[YWXpUnVoVYTpVXWmVnXSWVXrXqXYTpVpUSU[TpWXUTTqUVUnVVYTXrX[XVTRWUXWYTX[XXUnWUXSXpYUYWXqXYWUX[XqXZXSXoXSWTXWXYYWXoXSYTUnXZXWXoYXXWYVX[XUXSUnVoVYTpVXWmVnXSWVXrXqXYTpVpUSU[TpWXUTTqUTUnVqXrYVXrTRWUXSXqYUTRVVXWYXXSXqXSXYXSYTX[TRWWV[TRVTXrXoXVUnWUWUWVTRVoX[XYXZYVUnVVVXWRVWXpXrXmX[UnYYXWXSYVXZXWYTXXXrXqYVXqXWYYTRWTXWXYYWXoXSYTUnWTXrXTXrYVXrVqYWXpUUWTUnVVV[VqWRYTXrTpXpXWXVX[YWXpUnWUXSXpYUYWXqXYTRWUXSXqYUTRVqYWXpUWUWUnWUWUWVTRVZXWXSYXY[TRV[YVXSXoX[XUUnVoVYXoXrXUXnUVTRWTXWXYYWXoXSYTWrURUZURUWUnVYXWXrYTXYX[XSUnXqXrYVXrTpYUXSXqYUTpXUXmXnUnWVXWXoYWXYYWTRWUXSXqXYXSXpTRVpVqTRVTXrXoXVUnVpV[WWV[TRVWWZTRVqXrYTXpXSXoUnVZW[WSX[VZXWX[TpUYUWWUTRVTXrXoXVUnVqXrYVXrWUXSXqYUVpY[XSXqXpXSYTWmXSYYXYY[X[TRVTXrXoXVUnY[YWXqXrYUYRYTXrTpXTXoXSXUXnUnXZXWXoYXXWTpXqXWYWXWTpXqXrYTXpXSXoUnVoYWXpX[XqXrYWYUWrWUXWYTX[XXUnWVVpTRVpXrXZXSXqYVY[VrWVTRVqXrYTXpXSXoUnWUXSXpYUYWXqXYWUXSXqYUVqYWXpTpUUVoYXTRVoX[XYXZYVUnWUXSXpYUYWXqXYTRWUXSXqYUTRVqYWXpUVUWUnWUXpXSYTYVVYXrYVXZX[XUTRVpXWXVX[YWXpUnXYXWXrYTXYX[XSUnXUXSYUYWXSXoTpXXXrXqYVTpYVY[YRXWUnWUXSXpYUYWXqXYTRWUXSXqYUTRVTXrXoXVUnYUXpXSXoXoTpXUXSYRX[YVXSXoYUUnVpVXX[XqXSXqXUXWTRWRWTVUTRVTXrXoXVUnVXWmVoXSXqWVX[XqXYVZXWX[WrVYVTUSUZURUUURUnWUXSXpYUYWXqXYVSYTXpXWXqX[XSXqUnWTXrXTXrYVXrTRVTXrXoXVUnXUXWXqYVYWYTY[TpXYXrYVXZX[XUTpXTXrXoXVUnYZTpYUYUYVTpXZXWXSYXY[UnWUWUWVTRVoX[XYXZYVTRV[YVXSXoX[XUUnWVXZXSYTVoXrXqUnYZTpYUYUYVTpXoX[XYXZYVUnVVX[XqXTXrXoTRWTXWXYYWXoXSYTUnWUXSXpYUYWXqXYVTXWXqXYXSXoX[WTXWXYYWXoXSYTUnVnVqTRVpXrXZXSXqYVY[VrWVWUXpXSXoXoTRVpXWXVX[YWXpUnXZY[YRYWYTXWUnWUXSXpYUYWXqXYWVXSXpX[XoWTXWXYYWXoXSYTUnVpXSXoXSY[XSXoXSXpTRWUXSXqXYXSXpTRVpVqUnVqXrYVXrTRWUXSXqYUTRVnXSXqXqXSXVXSTRWWV[UnXZXWXoYXXWTpXqXWYWXWUnVZXWXoYXXWYVX[XUXSTRVoWVTRUWUWTRWTXrXpXSXqUnVqXrYVXrTRWUXSXqYUTRVnXSXqXqXSXVXSTRVTXrXoXVUnWUXSXqYRY[XSUnWUXSXpYUYWXqXYWRYWXqXmXSXTX[WTXWXYYWXoXSYTUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUVVoYXUnVoVYWrVnXSXqXqXSXVXSUnWUXSXpYUYWXqXYTRWUXSXqYUTRWTXWXYYWXoXSYTUnWmXSYYXYY[X[TpVrXqXWUnVVYTXrX[XVTRWUXWYTX[XXTRVTXrXoXVTRV[YVXSXoX[XUUnVXWmVnVSWVVmWYUnXUXrYWYTX[XWYTTRXqXWYYUnWUXSXpYUYWXqXYVWXpXrXmX[WTXWXYYWXoXSYTUnVpV[WWV[TRVWWZTRVTXrXoXVUnVSXqXVYTXrX[XVTRVWXpXrXmX[UnVqXrYVXrTRVqXSYUXnXZTRVSYTXSXTX[XUTRWWV[UnVoVUVVTRVUXrXpUnVXYWYVYWYTXSTRVpXWXVX[YWXpTRVTWVUnWXX[YXXrTpXWYZYVYTXSXUYVUnVTXSXqXYXoXSTRWUXSXqXYXSXpTRVpVqTRVTXrXoXVUnXZXSXqYUTpYUXSXqYUTpYTXWXYYWXoXSYTUnWUVqYWXpTpUUWTUnWUVqYWXpTpUUWVUnXZXSXqYUTpYUXSXqYUUnWUWUWVTRWWXoYVYTXSTRVoX[XYXZYVUnWTXrXTXrYVXrTRWTXWXYYWXoXSYTUnWTXrXTXrYVXrTRVoX[XYXZYVUnVZXSXqYWXpXSXqUnXqXWYYXoXYXYXrYVXZX[XUUnVVVXVZXWX[VSWYUWTpVSUnXZXSXqYUTpYUXSXqYUTpXoX[XYXZYVUnWRXoXSYVXWTRVYXrYVXZX[XUUnWUVqYWXpTpUUVoUnVZXWXoYXXWYVX[XUXSTRVoWVTRUVUWTRVoX[XYXZYVUnVpY[XSXqXpXSYTTRWUXSXqXYXSXpTRWmXSYYXYY[X[TRVTXrXoXVUnXoXYTpYUXSXqYUTpYUXWYTX[XXTpXoX[XYXZYVUnVpV[WWV[TRVWWZTRVoX[XYXZYVUnWTXrXTXrYVXrTRWVXZX[XqUnWUXrVpVSTRVTXrXoXVUnWRXSXVXSYWXnUnWUXSXpYUYWXqXYTRWUXSXqYUUnWUYRXSXUX[XrYWYUWrWUXpXSXoXoVUXSYRUnYUXSXqYUTpYUXWYTX[XXUnVVWXTRVpXrXZXSXqYVY[VrWVTRVpXWXVX[YWXpUnWUYVXSXTXoXWWrWUXoXSYRUnXpXrXqXSXUXrUnVXXoY[XpXWTpVoX[XYXZYVUnXXYmYmY[YUTpXVXrYUYRY[UnWUXUYTXWXWXqWUXSXqYUUnXUXoXrXUXnUTURUSUXUnWTXrXTXrYVXrTRVUXrXqXVXWXqYUXWXVTRVTXrXoXVTRV[YVXSXoX[XUUnVSYTX[XSXoUnVnVqTRVpXrXZXSXqYVY[TRVpXWXVX[YWXpUnVpXrYVXrY[XSVoVpXSYTYWTRWYUUTRXpXrXqXrUnVZXSXqXVYUXWYVTRVUXrXqXVXWXqYUXWXVUnWTXrXTXrYVXrTRV[YVXSXoX[XUUnVZWVVUTRVZXSXqXVUnWUWUWVTRWWXoYVYTXSTRVoX[XYXZYVTRV[YVXSXoX[XUUnWUWUWVTRWXX[XWYVXqXSXpXWYUXWTRWTXrXpXSXqUnVqXrYVXrTRVqXSYUXnXZTRVSYTXSXTX[XUTRWWV[TRVTXrXoXVUnXUXZXqXXYmYZXZTpXpXWXVX[YWXpUnWUVqYWXpVUXrXqXVTpUUWVUnXUXWXqYVYWYTY[TpXYXrYVXZX[XUTpYTXWXYYWXoXSYTUnXVXWXXXSYWXoYVWrYTXrXTXrYVXrTpXoX[XYXZYVUnVqXrYVXrTRWUXSXqYUTRVpY[XSXqXpXSYTUnVpY[XSXqXpXSYTTRWUXSXqXYXSXpTRVpVqUnVSYRYRXoXWTRVUXrXoXrYTTRVWXpXrXmX[UnYYXWXSYVXZXWYTXXXrXqYVWTXWXYUnWUXSXpYUYWXqXYVpXSXoXSY[XSXoXSXpWTXWXYYWXoXSYTUnXSYTX[XSXoUnVVYTXrX[XVTRWUXWYTX[XXTRVTXrXoXVUnVUWRXrUUTRWRWTVUTRVTXrXoXVUnVpV[TRVoVSVqWVV[VqVYUnWUXSXpYUYWXqXYVnXrYTXWXSXqTpWTXWXYYWXoXSYTUnYVXWYUYVUVUWTRWTXWXYYWXoXSYTUnYUYRX[YTX[YVWrYVX[XpXWUnVVXWYXXSXqXSXYXSYTX[TRWUXSXqXYXSXpTRVpVqUnWUXUYTXWXWXqWUXWYTX[XXUnWTXrXTXrYVXrUnXUYWYTYUX[YXXWTpXXXrXqYVTpYVY[YRXWUnWUWVVZXWX[YVX[WrYXX[YXXrUnXUXZXqXXYmYZXZUnWUXSXpYUYWXqXYTRVUXoXrXUXnVXXrXqYVTRUUVSUnWTXrXTXrYVXrTRVUXrXqXVXWXqYUXWXVTRWTXWXYYWXoXSYTUnYUXSXpYUYWXqXYTpXqXWXrTpXqYWXpUUWTUnVYVmTRVpXrXZXSXqYVY[VrWVTRVpXWXVX[YWXpUnVUXZYWXoXZXrTRVqXWYWXWTRVoXrXUXnUnYTXrXTXrYVXrTpXqYWXpUUVoUnXZXWXoYXXWTpXqXWYWXWTpYWXoYVYTXSVoX[XYXZYVXWYZYVXWXqXVXWXVUnWUXSXpYUYWXqXYVrYTX[Y[XSWTXWXYYWXoXSYTUnWUXSXpYUYWXqXYWUXSXqYUVqYWXpTpUVVoYXTRVoX[XYXZYVUnVpW[X[XqXYVZXWX[WrUSUZURUUURWrVUUTTpVTXrXoXVUnVVVXWRWUXZXSXrVqYXWYUWTpVYVTUnWTXrXTXrYVXrTRVTXoXSXUXnUnXZXWXoYXXWTpXqXWYWXWTpYWXoYVYTXSXoX[XYXZYVUnXYXpWrYZX[XZXWX[UnVoVYXoXrXUXnUVTRVoX[XYXZYVWrURUZURUWUnVYYWXmXSYTXSYVX[TRWUXSXqXYXSXpTRVpVqUnVpXSXoXSY[XSXoXSXpTRWUXSXqXYXSXpTRVpVqTRVTXrXoXVUnYTXrXTXrYVXrTpXqYWXpUUWTUnWUWVWZX[XZXWX[WrYXX[YXXrUnVXWmWmXZYWXqW[YWXSXqWrVYVTUSUZURUUURUnXqXrYVXrTpYUXSXqYUTpXUXmXnTpXoX[XYXZYVUnXUXrXoXrYTXrYUUnVqXrYVXrTRWUXSXqYUTRVYYWYTXpYWXnXZX[UnVqXrYVXrTRWUXSXqYUTRWUY[XpXTXrXoYUUnWTXrXTXrYVXrTRVoX[XYXZYVTRV[YVXSXoX[XUUnVoXrXZX[YVTRWVXSXpX[XoUnXUYWYTYUX[YXXWUnXVXWXXXSYWXoYVWrYTXrXTXrYVXrUnVTXZXSYUXZX[YVXSVUXrXpYRXoXWYZWUXSXqYUTRVTXrXoXVUnVoVYWrVqYWXpXTXWYTWrWTXrXTXrYVXrTRWVXZX[XqUnXpXrXqXrYUYRXSXUXWXVTpYYX[YVXZXrYWYVTpYUXWYTX[XXYUUnVZXWXoYXXWYVX[XUXSTRVoWVTRUUUWTRWVXZX[XqUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUUVoWXUnVVV[VqWRYTXrUnVmXrXpXrXoXZXSYTX[UnYUXSXqYUTpYUXWYTX[XXTpXoX[XYXZYVUnXZXWXoYXXWTpXqXWYWXWTpXTXoXSXUXnUnVoXrXZX[YVTRVTXWXqXYXSXoX[UnVpY[XSXqXpXSYTTRWUXSXqXYXSXpTRWmXSYYXYY[X[UnVVYTXrX[XVTRWUXWYTX[XXTRV[YVXSXoX[XUUnWTXrXTXrYVXrTRVTXrXoXVTRV[YVXSXoX[XUUnVqXSXqYWXpVYXrYVXZX[XUUnWUXrXqY[TRVpXrXTX[XoXWTRWWVVTRVYXrYVXZX[XUTRWTXWXYYWXoXSYTUnVYXWXrYTXYX[XSTRVTXrXoXVTRV[YVXSXoX[XUUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUUVoYXUnY[YWXqXrYUTpYVXZX[XqUnYUXSXpYUYWXqXYTpXqXWXrTpXqYWXpUUWVTpXUXrXqXVUnVqXrYVXrTRWUXSXqYUTRVpY[XSXqXpXSYTTRWWV[TRVTXrXoXVUnXoXYYUXWYTX[XXUnVXWmW[XrYWVZXWX[TpWTTpVYVTUSUZURUUURUnVoXrXZX[YVTRWRYWXqXmXSXTX[UnXTXSYUXnXWYTYXX[XoXoXWUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUVWVYXUnYUXSXpYUYWXqXYTpYUXSXqYUTpYVXZX[XqUnVoVYTRVWXpXrXmX[UnVSXqXmXSXoX[VqXWYYVoX[YRX[UnWUXSXpYUYWXqXYWUXSXqYUVqYWXpTpUVWVTRWVXZX[XqUnWUXSXpYUYWXqXYVnXrYTXWXSXqTpVTXrXoXVUnXpX[YWX[XWYZTpXoX[XYXZYVUnVqXrYVXrTRWUXSXqYUTRVnXSXqXqXSXVXSUnWTXrXTXrYVXrTRVqXrYTXpXSXoTRV[YVXSXoX[XUUnVYXWXrYTXYX[XSTRV[YVXSXoX[XUUnYUXSXqYUTpYUXWYTX[XXTpXpXWXVX[YWXpUnWUXpXSYTYVTRWmXSYYXYY[X[UnWTXrXTXrYVXrTRVUXrXqXVXWXqYUXWXVTRV[YVXSXoX[XUUnVqXrYVXrTRWUXSXqYUTRVnXSXqXqXSXVXSTRWWV[TRVTXrXoXVUnVVVXWRTRWUXUTRWUXSXqYUTRVZXWYWXWUUURWrUSURUUUnVoVYWrVqYWXpXTXWYTWrWTXrXTXrYVXrTRVTXrXoXVUnWRXSXVXSYWXnTRVTXrXrXnUnYZTpYUYUYVTpXUXrXqXVXWXqYUXWXVUnWUYWXqYUXZX[XqXWTpWWXUXZXWXqUnWTXrXTXrYVXrTRVTXoXSXUXnTRV[YVXSXoX[XUUnWTX[XqXYXrTRVUXrXoXrYTTRVWXpXrXmX[UnVVXWYXXSXqXSXYXSYTX[TRVrWVWUUnWUXpXSYTYVTRWmXSYYXYY[X[TRWRYTXrUnVXWmVoXSXqWVX[XqXYVZXWX[TpVpTpVYVTVnUnVSXqXVYTXrX[XVVUXoXrXUXnTpVoXSYTXYXWTRWTXWXYYWXoXSYTUnYRYTXrYRXrYTYVX[XrXqXSXoXoY[TpYUYRXSXUXWXVTpYYX[YVXZXrYWYVTpYUXWYTX[XXYUUnVUYWYVX[YXXWTRVpXrXqXrUnYVX[XpXWYUUnVoVYTRWUXpXSYTYVWrVZTRYVXWYUYVTRVTXrXoXVUnVVV[VqWRYTXrTpVoX[XYXZYVUnYUXSXqYUTpYUXWYTX[XXTpXTXoXSXUXnUnVoXrXZX[YVTRVVXWYXXSXqXSXYXSYTX[UnYRYTXrYRXrYTYVX[XrXqXSXoXoY[TpYUYRXSXUXWXVTpYYX[YVXZTpYUXWYTX[XXYUUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUUVoUnVpW[XrYWXqXYTRWRWTVUTRVpXWXVX[YWXpUnVVVXVYXrYVXZX[XUWRWYUWTpVTV[VYUWVZVnTpWUVrVqW[UnXZXSXqYUTpYUXSXqYUTpXpXWXVX[YWXpUnWUWUWVTRVZXWXSYXY[UnVoVYTpVXWmWmXZYWXqW[YWXSXqTpVpURUTTpWXUTTqUTUnVpY[XSXqXpXSYTWWVqXWYYTRWTXWXYYWXoXSYTUnVqXrYVXrTRVqXSYUXnXZTRVSYTXSXTX[XUTRVTXrXoXVUnWUXSXpYUYWXqXYVYYWXmXSYTXSYVXZX[WTXWXYYWXoXSYTUnXXXSXqYVXSYUY[UnXZXWXoYXXWTpXqXWYWXWTpXoX[XYXZYVUnVZXWXoYXXWYVX[XUXSTRVqXWYWXWTRVrWVWUTRVTXrXoXVUnXqXrYVXrTpYUXSXqYUTpXUXmXnTpXTXrXoXVUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUUWTUnVoX[XqXVYUXWY[TRWUXSXpYUYWXqXYUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUUWVUnWUXUYTXWXWXqWUXWYTX[XXVpXrXqXrUnVWWVYTYWXpYRTRVpY[XSXqXpXSYTWrWmWYUnXZXWXoYXXWTpXqXWYWXWTpYVXZX[XqXWYZYVXWXqXVXWXVUnVqXrYVXrTRVqXSYUXnXZTRVSYTXSXTX[XUUnVoVYWrVYYWXmXSYTXSYVX[UnWUXpXSYTYVWrVpXrXqXrYUYRXSXUXWXVUnWVXSXpX[XoTRWUXSXqXYXSXpTRVpVqUnVoVYTRVWXpXrXmX[TRVqXrXqVSVpVWUnWTXrXTXrYVXrTRVUXrXqXVXWXqYUXWXVTRVoX[XYXZYVTRV[YVXSXoX[XUUnXYXpWrXmX[XqXYXnXSX[UnVXWmVoXSXqWVX[XqXYVnXSXqVZXWX[WrVYVTUSUZURUUURUnXoXYYVYTXSYXXWXoUnYRXSXoXSYVX[XqXrUnVYXWXrYTXYX[XSTRVTXrXoXVUnVVYTXrX[XVTRWUXSXqYUUnVoVYWrWRYWXqXmXSXTX[UnWUXpXSYTYVVYXrYVXZX[XUTRVTXrXoXVUnWUXSXpYUYWXqXYTRWUXSXqYUTRWVXZX[XqUnWUWUWVTRVUXrXqXVXWXqYUXWXVTRVTXrXoXVUnVUXrXpX[XUYUWrVqXSYTYTXrYYUnXUXrYWYTX[XWYTUnVrYTX[Y[XSTRWUXSXqXYXSXpTRVpVqUnXZXWXoYXXWTpXqXWYWXWTpXoX[XYXZYVXWYZYVXWXqXVXWXVUnVXWmVoXSXqWVX[XqXYVZXWX[TpWTTpVYVTUSUZURUUURUnVSWTTRVUYTY[YUYVXSXoXZXWX[VZVnWUVUWUTRVVVTUnYUXWYTX[XXUnWTWVWYWUW[YWXWWTXrYWXVVYXrVYURYXUSTpWTXWXYYWXoXSYTUnVpX[XSXrWYYWWrYRYTXWYXUnVXWmW[USVnUnVoVYWrVqYWXpXTXWYTWrWTXrXTXrYVXrTRWTXWXYYWXoXSYTUnVSXqXVYTXrX[XVVUXoXrXUXnUnWUXrVpVSTRWTXWXYYWXoXSYTUnVZW[WSX[VZXWX[TpUVURWUTRVoX[XYXZYVYZUnXoXYTpYUXSXqYUTpYUXWYTX[XXUnVVXSXqXUX[XqXYTRWUXUYTX[YRYVTRVTXrXoXVUnXVXWXXXSYWXoYVUnYUXWXUTpYTXrXTXrYVXrTpXoX[XYXZYVUnVUXrXoXrYTVrWUWWV[TpWTXWXYYWXoXSYTUnYVXWYUYVTRWTXWXYYWXoXSYTUnWVXSXpX[XoTRWUXSXqXYXSXpTRVpVqTRVTXrXoXVUnVXWmW[X[XqXYVTX[WZX[XqXYWUXZYWTpWUUSUXUnWTXrXTXrYVXrVqYWXpUUVoTRVoX[XYXZYVUnXpXrXqXrYUYRXSXUXWXVTpYYX[YVXZTpYUXWYTX[XXYUUnYUXSXpYUYWXqXYTpYUXSXqYUTpXqYWXpUUUWUnVUXrXrXoTRXmXSYmYmUnWUXSXpYUYWXqXYVqXWXrVqYWXpTpUUVoUnWUWVWZX[XqXYXnXSX[UnWUXUYTXWXWXqWUXSXqYUVpXrXqXrUnVVVXWRWYXSWYXSWYUWTpVYVTUnWUXSXpYUYWXqXYWUXSXqYUVqYWXpTpUUVoTRVoX[XYXZYVUnVTXSXqXYXoXSTRWUXSXqXYXSXpTRVpVqUnVYYWYTXpYWXnXZX[TRWUXSXqXYXSXpTRVpVqUnWUVWVUWTXrXTXrYVXrVoX[XYXZYVUnXZY[XXXrXqYZYTXSX[XqUnVpW[X[XqXYVZXWX[VYVTUSUZURUUURVUTpVTXrXoXVUnYUXSXpYUYWXqXYTpYUXSXqYUTpXoX[XYXZYVUnVZXWXoYXXWYVX[XUXSTRVoWVTRUXUWTRVpXWXVX[YWXpUnVVYTXrX[XVTRWUXSXqYUTRVXXSXoXoXTXSXUXnUnWTXrXTXrYVXrTRWVXWYUYVUSTRVTXrXoXVUnVqXrYVXrTRWUXSXqYUTRVpY[XSXqXpXSYTTRVTXrXoXVUnYUXSXqYUTpYUXWYTX[XXTpXUXrXqXVXWXqYUXWXVTpXUYWYUYVXrXpUnWUXSXpYUYWXqXYVqXWXrVqYWXpTpUUWVUnWUXSXpYUYWXqXYTRWUXSXqYUTRVqYWXpUUUWUnXpXrXqXrYUYRXSXUXWUnWVVoTRVpXrXZXSXqYVY[TRVpXWXVX[YWXpUnXZXWXoYXXWTpXqXWYWXWTpXpXWXVX[YWXpUnVoWVVZW[WUWmVnUnWTXrXTXrYVXrTRVUXrXqXVXWXqYUXWXVTRXUYWYUYVXrXpXWTRVTXrXoXVUnVpY[XSXqXpXSYTUUUnVVYTXrX[XVTRWUXSXqYUTRVVXWYXXSXqXSXYXSYTX[UnWUXZXSXrVqYXWrYRYTXWYXUnYUXSXpYUYWXqXYTpXqXWXrTpXqYWXpUUVoUnVXWmVoXSXqWVX[XqXYVZXWX[TpVWVoTpVYVTVnUnY[YWXqXrYUUnYUXSXpYUYWXqXYTpXqXWXrTpXqYWXpUUWVUnWVX[XpXWYUTRVqXWYYTRWTXrXpXSXqUnXZXWXoYXXWTpXqXWYWXWTpXTXrXoXVUnXqXrYVXrTpYUXSXqYUTpXUXmXnTpYTXWXYYWXoXSYTUnVqXrYVXrTRWUXSXqYUTRVYYWYTXpYWXnXZX[TRWWV[TRVTXrXoXVUnVVV[VqWRYTXrTpXTXoXSXUXnUnVXWmVoXSXqWVX[XqXYVZXWX[TpVWVoTpVYVTUSUZURUUURUnWUWUWVTRWXX[XWYVXqXSXpXWYUXWTRVpXWXVX[YWXpUnWTXrXTXrYVXrTRVUXrXqXVXWXqYUXWXVTRVoX[XYXZYVUnWUWUWVTRWXX[XWYVXqXSXpXWYUXWTRVTXrXoXVUnVSWTTRVVVmTpVnVnUnVVYTXrX[XVTRWUXSXqYUTRWUVWVpVUUnVqXrYVXrTRWUXSXqYUTRVpY[XSXqXpXSYTTRWWV[UnVUXrXpX[XqXYTRWUXrXrXqUnVpW[YWYRYRY[TRWRWTVUTRVpXWXVX[YWXpUnWTXrYUXWXpXSYTY[UnVoXrXZX[YVTRVYYWXmXSYTXSYVX[UnWTXrXTXrYVXrTRVUXrXqXVXWXqYUXWXVTRXUYWYUYVXrXpTRVTXrXoXVUnVXWmVoXSXqWVX[XqXYVZXWX[WUTpWTTpVYVTUnVZXWXoYXXWYVX[XUXSTRVqXWYWXWTRVrWVWUUnVnXSX[YVX[WrYRYTXWYXUnWTXrXTXrYVXrTpVTX[XYVUXoXrXUXnUnVXWmW[VTVnWUVmWYUnVZXSXqXVYUXWYVTRVUXrXqXVXWXqYUXWXVTRVTXrXoXVUnWUXSXpYUYWXqXYVYXWXrYTXYX[XSXqUnVVXSXqXUX[XqXYTRWUXUYTX[YRYVUnYUXSXqYUTpYUXWYTX[XXTpXUXrXqXVXWXqYUXWXVUnXZXSXqYUTpYUXSXqYUTpYVXZX[XqUnWUXSXpYUYWXqXYWUXSXqYUVqYWXpTpUVWVYXTRWVXZX[XqUnVoXrXZX[YVTRVrXVX[XSUnVTXZXSYUXZX[YVXSVUXrXpYRXoXWYZWUXSXqYU`~mzsq;mf`bqfbQfyx`YUXZXWXq`>24pPr>~1xb`x~Cxmzusu~=bq5`;327C;_4:=/B`VpWUVTXoXrXTVTYWX[XoXVXWYT`|m~aq~q~~{~`:=E_7<B`|{ab`n{pgCaqp`t|babQ(cQzobqPqy~buPudsP{Qoxzu{zsaP|v`~qrq~~q~`ubp;aN:7u{zsNq:pu{zscNb/~tu{Nh5q0qmbCaaq7qz~Nr@{:qmboctz`qpudqou>qf@xbm{u`tbb|(QQ`/zp~`qbmbA~qp~{oq~_e|__Nz{ubo/p~{oq@~qp~{oq~_e|__Ngmx~qd=taq~rq~_e|__N~{boqxqAbqA~qp~{oq~_e|__Nz{ubo/y~{r~q>~qp~{oq~_e|__`oa{~xxmna~`nZ`m1xx`/s1b{~zP{/x{sz1{bx~`ZRXZZUZ`YXX[XTYTXSYVXW` tqustb+X eupbt+S bg|q+m||xuombu{zQfOat{owemdqOrxmat a~o+`magzo`{o`{z`n{bb{y`x|x/`|c`{Zgpcdmv\\C<\\b?=`<m`qfu|`TVWRYTXWWWVUVTYTXrYYYUXWYTVUXoXSYUYUX[XUToWWVUVTYTXrYYYUXWYTVpXWYUYUXSXYXWVUXWXqYVXWYT`o{zbqzbObg|q`aq}zecn.}ko}mnVcf}/smn}g`b~cq ~bzqg{|_r_ `fO|eOsxmaa`xuqn`7ymsq`XSXoWRXoXSY[XWYTTRVYUTTRVUXrXqYVYTXrXoTqUS`dau`JIRO[]iSNUkJ\\PIRO[]iSNUkKiUkj JJIRO[mOr]iSNVk(KiYNYkIRO[mOr]iSNVkjJIRO[mOr]iSNVk(KiSNYk(jJIRO[mOr]iSNVk(KiSNXk(IRO[mOr]iSNVkjJIRO[mOr]iSNVk(KiSNWkJ(IRO[mOr]iSNVkKiSNTkjJIRO[mOr]iSNVk(KiSNVkJ(IRO[mOr]iSNVkKiSNUkjJIRO[mOr]iSNVk(KiSNUkJ(IRO[mOr]iSNVkKiSNVkjJIRO[mOr]iSNVk(KiSNTkJ(IRO[mOr]iSNVkKiSNWkjIRO[mOr]iSNVk(JJ(IRO[mOr]iSNVkKiSNXkKj(JJ(IRO[mOr]iSNVkKiSNYkj(Kj((JrrrrJ(RiSNVkKiRNSk(KiRNSkJJTWIROW]jJTIROV]jSiRNSkIRO[]KiRNSkIRO[]K\\PKiUNUkJTWIROW]jJTIROV]jSiRNSkIRO[]KiRNSkIRO[]KjJIRO[mOr]iSNVk(KiSNVk(JJTWIROW]jJTIROV]jSiRNSkIRO[]KiRNSkIRO[]K\\PKiUNUkJTWIROW]jJTIROV]jSiRNSkIRO[]KiRNSkIRO[]KK K`aqb:{omx2qao~u|bu{z`stb~yqm`\\z{ua~qD`UTUUUV`{n`;afyxTPF;:6BB>PVPR`o|wymdN>o`zr{Np{x|tuzyqbm`ya1~g|b{`QJ\\pMKIR`W`mx`qbuAxxm1`}tu{{`fiba`AnqE`mcpu{Q{ss) o{pqoa+\"d{~nua\"jmcpu{Qemd) o{pqoa+\"S\"jmcpu{Qy|qs)jmcpu{QfOyVm)mcpu{Qmmo)`ruxx@qob`@q`@qmx` t{ab `qepnu~qdO~dqxmmcqb`J^\\aLKjJ\\aL$K`md`qszmtogbuxunuaudh{y`ap|`HZF6v`xmab7zpqf=r`*!OOIur sb 73 `rQ|~cnQQ`|sfpf}fifqv~e|kdb`cbrOZ`@zqqp>~{~qoaap7`~aua`WRXoXSY[XWYT`;afyxTPF;:6BB>PXPR`7zruzubg`zoqnc`YVXrXpToWrYRXZXSXqYVXrXp`eqnwub7zpqfqp20`m%yt~ytqpq%mbNq%1amb1r{q%~Nqq%abmbr1~qu2~d%qbNq%1amb7rrqy~qmu2d~%qN~q%abmbr1cqb/m{byzu%{`c~x`_op]hOmI$\\^`ge~ustb@qo{~`o~qmbq0crrq~`b~uy`q~>~`>tmz`mc`~qmpe~ubq`qy{~t1aaqxpmq6`$t{${Nwx${$qs~s$Nx$Na$|a$~x$ntN$pNfq$m~1p{g/pxqm~pqfgq3boqczpB7at4uy~qmaNp$Nf$$qc$u`YRXSYTYUXWVXXoXrXSYV`X`O[P]M Amrm~u\\Q\\pM`x{mpF;:`mu`hUza|`,`?B`pua|xmg`ua4uzubq`6B;:/zot{~3xqyqzb`mb`al}h|`XSYRYRWUXUXSXqVUXoX[XUXnToXSYRYRWUXUXSXqVXXrXUYWYUVrYWYVToXSYRYRWUXUXSXqVnXWY[VVXrYYXqToXSYRYRWUXUXSXqVnXWY[WWYRToXSYRYRWUXUXSXqWUXWXqXVWTXWYRXoXSXUXWXpXWXqYVToXSYRYRWUXUXSXqVrXqWTXWXSXVY[WUYVXSYVXWVUXZXSXqXYXWWTXWYRXoXSXUXWXpXWXqYVToXSYRYRWUXUXSXqVoXrXSXVVZXSXqXVXoXWYTToXSYRYRWUXUXSXqWUXWYVWRXSXYXWVoXrXSXVXWXV`ubas{zzmrmux`o~qmbq2mbm1tmzzqx`qdm~`m/xz`umdm`p{x|tuzu`WoWnXqXSYVX[YXXWTRXUXrXVXWWoWp`mbb~Dq~bqf`~S}{js_`tymqyt~mqjp{pcoqybzoOmta~bqtNymqyt~mqjp{pcoqybzcOx~~Oaqx{qdN~mtyy~qqtpmqjqxqybzxOauqbuzszqOqdbzOaba~{smOq~||{tNymqyt~mqjp{xmoubz{eOm~||~q` a~rxf `1a~a{xewm`XTYTXSYXXW`euru`VZU`czx{mp`y{h7zpqfqp20`{zb{cotabm~b`__p~`2y{a`B@7/<5:3_AB@7>`pqbmot3dqzb`>{uzba`udq~_qdmxcmb`o|` O `1AA`\n`on_`Tp`op`73`up` K`( `{w`QPP`mzg`qzcyq~mnxq";}else if(_$$N===1){_$_j.lcd=_$$j;}else if(_$$N===2){_$c9++ ;}else{ !_$hH?_$_5+=-30:0;}}else if(_$$N<8){if(_$$N===4){_$_$=0;}else if(_$$N===5){_$_l="_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');}else if(_$$N===6){ !_$hH?_$_5+=45:0;}else{_$jL=_$_j.nsd;}}else if(_$$N<12){if(_$$N===8){_$_h++ ;}else if(_$$N===9){_$$1=_$kD(19);}else if(_$$N===10){_$af(_$jL,_$ca);}else{_$hf=_$gu();}}else{if(_$$N===12){for(_$c9=0;_$c9<_$cN.length;_$c9+=100){_$$t+=_$cN.charCodeAt(_$c9);}}else if(_$$N===13){_$jL=[];}else if(_$$N===14){_$jL[_$_H]="_$"+_$_l[_$_h]+_$_l[_$_$];}else{return _$_l;}}}else if(_$$N<32){if(_$$N<20){if(_$$N===16){_$_5+=-12;}else if(_$$N===17){_$iZ(47,_$jW);}else if(_$$N===18){_$ef=_$ct.length;}else{_$jL=_$iC.eval;}}else if(_$$N<24){if(_$$N===20){_$_h=0,_$_$=0;}else if(_$$N===21){_$_5+=2;}else if(_$$N===22){ !_$hH?_$_5+=1:0;}else{_$hH= !_$cN;}}else if(_$$N<28){if(_$$N===24){_$dq=_$gu()*55295+_$gu();}else if(_$$N===25){return _$jL;}else if(_$$N===26){_$_l=_$iC.execScript(_$eB);}else{_$jW=[];}}else{if(_$$N===28){_$_4=_$ct.substr(_$cZ,_$dq).split(_$aR.fromCharCode(257));}else if(_$$N===29){ !_$hH?_$_5+=3:0;}else if(_$$N===30){ !_$hH?_$_5+=0:0;}else{_$jW.push(_$a1.substr(0,_$a3()%5));}}}else if(_$$N<48){if(_$$N<36){if(_$$N===32){_$_j.scj=[];}else if(_$$N===33){_$dn=_$gu();}else if(_$$N===34){_$hH= !_$_h;}else{_$hH= !_$cZ;}}else if(_$$N<40){if(_$$N===36){_$a3=_$g$(_$jL);}else if(_$$N===37){ !_$hH?_$_5+=-21:0;}else if(_$$N===38){ !_$hH?_$_5+=-33:0;}else{_$_j.cp=_$_h;}}else if(_$$N<44){if(_$$N===40){_$a1='\n\n\n\n\n';}else if(_$$N===41){_$hH= !_$_4;}else if(_$$N===42){_$jW.push('}}}}}}}}}}'.substr(_$_r-1));}else{ !_$hH?_$_5+=4:0;}}else{if(_$$N===44){_$$t=0;}else if(_$$N===45){_$c9=0;}else if(_$$N===46){_$hH= !_$_l;}else{_$hH=_$_$==64;}}}else{if(_$$N<52){if(_$$N===48){_$hH= !_$jW;}else if(_$$N===49){_$hH=_$_$%10!=0|| !_$_h;}else if(_$$N===50){_$_l=_$jL.call(_$iC,_$eB);}else{return;}}else if(_$$N<56){if(_$$N===52){_$hH=_$eB===undefined||_$eB==="";}else if(_$$N===53){_$_h[5]=_$kD(19)-_$_l;}else if(_$$N===54){_$hH=_$iC.execScript;}else{_$cZ=0;}}else if(_$$N<60){if(_$$N===56){ !_$hH?_$_5+=39:0;}else if(_$$N===57){return new _$$H().getTime();}else if(_$$N===58){_$iZ(59,_$c9,_$jW);}else{ !_$hH?_$_5+=2:0;}}else{if(_$$N===60){ !_$hH?_$_5+=10:0;}else if(_$$N===61){_$_H=0;}else if(_$$N===62){_$_5+=-6;}else{_$_l=_$kD(19);}}}}else{if(_$$N<80){if(_$$N<68){if(_$$N===64){_$_4.push(_$iZ(45,_$gu()*55295+_$gu()));}else if(_$$N===65){_$_h[3]=_$$t;}else if(_$$N===66){_$hH=_$_r>0;}else{_$cZ+=_$dq;}}else if(_$$N<72){if(_$$N===68){_$hH= !_$$1;}else if(_$$N===69){_$_$=_$gu();}else if(_$$N===70){_$_h[2]="b21`00`1/`54425`7`1`5/`145`8/`144`75`16`015`54424`04`0/13`06`20`2/`34`05`023106616`52`13/`37`53`82`24`023106617`3`6`5/37//`22`8`3183856184`71`081`0///`26`017`01`07`0/`1//`/-/0`3183856185`4`1/86040`113`5`0//`3/`13`23`10`2`08`81`7081`54`47`016`02`,0`151033`137`86`31`/-7`17`2//`21657`35`001`0/////`78`88`03`/-/`401`45`05732//7`25`07/`011`1/37`64`0/37465`87`146`44`68`18`,/-/0`1/2`01/`46`160622767`020/61`15`22443321`48`,0//`41`1420/00`12`1543324658`/-4`7/`40`0/1`1/0`28`1////`05272`57`/-0`3/85/`44185`4521/`157324344`61`32`053`172`1///`/-3`4///`0//0`,/-1`,1`04074//138`,8/`0748664282`07//`4/78`,3`753/////`/-8`/-702153432`2284358671`3/12122306`05666104`141`4////`/-1`/-5`2226454873`0621473082`/-15`05732//8`/-24`13//8486/7`,/-15`,07/`04568`,/-8`0/37464`54426`143`217426641/`04//`2////`2877181273`25/`14512720/1`,6`1/36`050`018`055`042`02/`056`031`046`023`045`051`026`028`033";}else{_$_H=_$gu();}}else if(_$$N<76){if(_$$N===72){_$kD(94,_$cN);}else if(_$$N===73){_$bJ=_$gu();}else if(_$$N===74){_$_r=_$gu();}else{_$ct="ĹČɃɄČॅ\x00刡,ā=ā[ā(āā.ā;ā],ā);ā(){return ā?ā),ā<ā+ā){var ā=0,ā;}function ā[12]](ā=0;ā !ā]=ā:ā[ --ā(){ā++ ]=ā&&ā>>ā[ ++ā(),ā&ā= !ā+=ā.push(ā):ā[20]](ā||ā);}function ā=(ā++ )ā=[],ā=new ā){ā!==ā(){var ā[35]];ā===ā!=ā)āfunction ā|| !ā));ā>ā[0],ā-ā?(ā){return ā>>>ā[1],ā;return ā<=ā();āreturn ā*ā&&(ā][ā[9],ā&& !ā;for(ā||(ā[9]),ā<<ā++ ){ā[20]]((ā+1],ā){if(ā==ā[5];ā={},ā:0,ā++ ]=(ā/ā[3]]==ā;function ā[35]],ā[13]](ā[4])&ā[35]]===ā++ ]<<ā^ā[3][ā;}ā[9]]^ā[20])&ā):(ā>=ā[3],ā-=ā,0,ā[2],ā](ā];if(ā]):ā[29],ā[29];ā[4],ā){}ā[52])&ā++ ;ā in ā[6][ā,true);ā)return ā[5],ā):0,ā]===ā({ā||( !ā(){return +ā[4];ā|=ā[24]][ā=1;ā|| !(ā)?ā++ ),ā:1,ā=0;for(ā);return ā);}ā[35]]>ā.y-ā=[];for(ā});ā[6]](ā= !(ā;}}function ā[35]]-ā=( !ā<0?ā+=1,ā; ++ā);if(ā.length;ā&&( !ā))&& !ā[9];ā[20]&ā);function ā.x-ā++ ],ā(187)-ā=((ātry{ā[3];ā[20];ā[5]),ā]],ā=0:ā];ā[19]](ā[27][ā){ typeof ā[51]||ā=[ā[4]&ā+2],ā[4]](ā=true,ā()[ā[4])|ā];}function ā[1];ā=this.ā(0);ā[63];ā[22]](ā.x*ā)):ā[32][ā++ ,ā+=1:0;ā.y*ā(187);āreturn;ā[9]);}function ā){}}function ā[25][ā[13]](0,ā[3]=ā ++ā=0;if(ā[7];ā=1,ā[35]]/ā]|ā[77]](ā[11][ā[55],ā[5]?ā++ ):ā()),ā]):(ā[49],ā=[];ā[40]](ā[22])<<ā[17];ā[4]),ā[44]?ā[5]=ā], !āfor(ā[(ā[52]^ā.x)+(ā;if(ā[25],ā-- ,ā;)ā[57]?ā[34],ā[14])<<ā[6],ā[2];ā+=2:0;ā)+ā[78]][ā[5][ā===0?(ā);}catch(ātry{if(ā%ā[16]+ā; typeof ā))&&ā));}function ā[41]]((ā[48]](ā[9]](ā[20])|(ā-1],ā();}function ā]=105,ā[21]))+ā[20]);ā[54]+ā();if(ā[63],ā[18]);}function ā=0:0,ā.y),ā[48]),ā);for(ā[36]?ā[4]^ā[356](ā[35]);}function ā[19];ā=0;while(ā[52])|(ā]=(ā[52]]^ā[42];ā-=3,ā[35]]-1;ā[91]](ā){return(ā.length,ā[29]^((ā[34]),ā[55])]))&ā+=0:0;ā]^=ā)|0,ā[78],ā[73]],ā[2]?ā[7]);}function ā[35]]%ā[35]]+ā[21]](ā;if( !ā].ā)%ā)&ā[9]]<<ā[47]+ā-=4,ā.slice(ā[28]=ā))||ā,'');}function ā[28]);}function ā.join('');}function ā[11];ā,this.ā[13]](0),ā]);ā[46])&ā+=1;ā-=2,ā[14]);}function ā[0]](ā[0]],ā[5]][ā[5]],ā+1)%ā>0;ā('');ā+=(ā[54],ā[37]+ā[42])[0],ā[10];ā[95]);}function ā[38]=ā()?ā[17]+ā))return ā[50]),ā[94]][ā[13]:0,ā[4])),ā[9]?ā[1]=ā.y)/(ā+=4:0;ā[28]](ā[20]]=ā[50]](null,ā[5]&&ā[32]](ā[9]:0,ā+1])):ā[34]][ā++ ];else if((ā[((ā+2])):ā[24]];ā[30];ā.x+ā)),ā);}}function ā)?(ā};function ā.x,ā[71]);}function ā[32]=ā;try{ā);while(ā])):ā[76],ā[12];ā,{ā[19],ā(187),ā+1]&ā>0||ā[33]);}function ā[29]);ā[50]);ā)||(ā=false:0,ā[94]),ā[14]][ā)==ā[40]);}function ā[11]](ā+=5:0;ā[52]](ā[29]],ā[42]+ā[7]=ā[81],ā[21][ā[46],ā[46];ā[35]]),ā[6]);ā[36]);}function ā[13]?ā]!==ā+=3:0;ā=false,ā)===ā[20]](((ā[55])<<ā))|| !ā[1]);}function ā[66]:0,ā[22]),ā[49])|(ā];}ā);else return ā.x),ā[6];ā;){ā[70],ā[38]);}function ā.split('');for(ā+3],ā]]:ā]:(ā[3]);}function ā[56]);return ā):0;return ā]<ā[63]||ā))ā[43]+ā[23]+ā[20]]({ā[12]);ā():0,ā[15];ā[20]);}function ā];}}function ā):0;for(ā[16],ā[83]);return ā[19]);}function ā&& !(ā[25]),ā[67]);}function ā++ )if(ā[0]);}function ā!=null?(ā[55]?ā[8];ā[8],ā:0;ā[29]?ā[0];ā|| !( !ā[26][ā[0]^ā[0][ā[31]];ā]=\"\",ā[8]];ā[9])|ā[35]];for(ā[5]];ā[45]](ā.charCodeAt(ā[45]][ā())in ā[82]+ā[47]];ā>0?ā);}}catch(ā[68]);}function ā[63]?ā[63])return[ā[39]);return ā<<1^(ā[33]+ā:0;return ā[0]);ā[33],ā[92]]();}function ā[14];ā[39]);}function ā]>=ā[79]);}function ā)&&ā[4]&&ā[29])),ā[32]),ā[9]]]^ā[38],ā(89,ā()*ā[20]),ā];}catch(ā[30]));ā[73],ā[86]][ā[81]),ā[39]&&ā[93]];ā();for(ā();return ā[88]),ā[14]]||ā[4]);ā[67],ā.z;ā)try{if(ā(1,0),ā+(ā]=38,ā)return false;return ā[17]](ā[9]]((ā[4];for(ā[30]=ā<=18?(ā[9],(ā|=1;ā]);}function ā[47]]()));ā[75]](ā[84]);}function ā[1]>ā[5]*ā[42]);ā[1][ā&& !( !ā[1]^ā[87]);}function ā[20]^ā[24],ā[2]);ā[40])|((ā[64]];ā[64]](ā[43]=ā);}else ā[34]](ā||0,ā[5]);return ā[1]<=ā[27]];ā[27]],ā[26]](ā[31]);return ā>0)for(ā;return[ā[55]?arguments[3]:0,ā++ ):0):0;ā[68]+ā[68],ā(101,ā[23]),ā()];ā<=9?(ā)){ā[80]);}function ā:(ā[0]=ā[22]+ā?1:ā[89]),ā[52]);}function ā]=1,ā[32],ā[27]);}function ā.y;ā, ++ā(){return[ā):0;}function ā[39],ā[39]=ā[6]]==ā[4]);}function ā){if( !ā[61]?ā[93]](0,ā=arguments.length,ā[9]);ā?0:ā+1]=ā-((ā[24]);ā[23]);}function ā[29]),ā[25]=ā[11]&&ā[1]+ā[59]),ā)if(ā){this.ā[5]?arguments[2]:1,ā[65]+ā+=9;ā[14][2]));ā};ā[55]]^ā[10]];ā(29,ā>>>0),ā[17]),ā[21]+ā[42]?ā(148,ā[42],ā[46]);}function ā>=0;ā[66],ā[46]?ā[2])return[];ā[89]^ā=null,ā.split(''),ā=null;ā)<<ā[9];return ā++ ):0,ā(1,ā[70]](ā[18];ā[90]];ā){return[ā+=4;ā)!==true?(ā[89]);}function ā[50]):0,ā+=1:0,ā[37]);return ā=2;ā[12]](this,ā];}return ā[69]);return ā.x&&ā[25]||ā[5]?(ā[35]]>=ā[1])&ā[17]);ā+=5;ā});return;function ā[53],ā+=-4;ā)try{ā[95]];ā[44]&&ā>>(ā]!=ā[34]+ā[49];return ā[34];ā[35]]);}}function ā[5],( ++ā[21]);}function ā[6]=ā[2]=ā[2]+ā[2][ā[2]^ā[52]);ā+1},ā[71]][ā]]]=ā[1]&&ā[16]);}function ā[47])&ā[9])):ā[55];while(ā]]=ā[87]),ā,1,ā[25])this.ā]^ā+((ā[3]]==1&&ā[19]];ā]>ā[74]];ā]-ā]+ā]*ā)(ā)*ā)-ā)/ā){return((ā[29])],ā[106];for(ā[76]],ā[3]]==0?ā)[ā){}function ā[93]);}function ā(){this.ā[23],ā[27]=ā+3])):ā[48]](0,ā]()):ā]=69,ā[60],ā[17]||ā)):0;if(ā+=13;ā=0;}function ā[36],ā[26]);}function ā.y))*ā[35],ā)):0;return ā[29]||ā;if( typeof ā.apply(null,ā<=58?(ā[11]=ā<=92?( --ā++ ];}function ā[52]]<<ā]]):ā+=-9;ā-=5,ā[85]](ā[39](ā[16];ā[30])*ā[52],ā-1),ā={};for(ā[10]);}function ā(27);ā<=105?(ā[3]]([ā<=8?(ā[35]])===ā[18]](ā[38])+ā+=7:0;ā]),ā[5]);}function ā.y))),ā[60]),ā<=34?(ā)>1?ā-1+ā[72]);}function ā[51]?ā[51]+ā[92]]();ā[29])|(ā[55]+ā[60]);return ā()][ā[29]+ā]);return ā[22].ā[4]=ā[4]+ā=null, !this.ā[2]));ā+2]=ā[4])return ā(87,ā[31]],ā[39]](ā[73];return ā[8]]+ā[1]](ā(9,ā[7]](ā[5]|ā[49]);}function ā]&ā[5]]&ā]/ā()):ā());ā()?(ā[35]];while(ā():0;}function ā[358](ā[(((ā&& typeof ā[41]);}function ā[31]);}function ā<=24?(ā[82]][ā[82]],ā[59]]=ā[0]),ā[70]]||ā[45],ā[16]);ā+=3;ā=[[],[],[],[],[]],ā){return[(ā]++ ,ā[8]);}function ā.substr(ā[50]*(ā)|(ā);}}}catch(ā(143);ā[35]]:0,ā[5]);else if(ā+3])):(ā]=Number(ā[23]]();ā)for(ā[4]])/ā[63]);}function ā[42]];ā[21]));ā[83]);}function ā[14],ā!==null&&( typeof ā[93]](ā)||[];else return ā[33]=ā[50]?ā[50]);}function ā[50]:ā:'\\\\u'+ā[8]);ā[50],ā[35]]];function ā[43]]+ā-52:0):ā[59]);}function ā[1].concat([arguments]),ā[5]&&(ā[14][1]));ā='protocol';ā(41,ā[76]));for(ā.x!=ā='href';ā[74]),ā[10],ā<=97)debugger;else ā[8];}catch(ā(325,ā):0);else{switch(ā.x?(ā[14][0]))&&ā[2])&&( !ā[45]);}function ā});}catch(ā===252?ā+=107:0;ā[28]));ā[38];ā[34];return ā[55])):ā<=55?ā():ā[55])),ā()%ā[77]+ā[148],ā[67]]!==ā[4];}for(ā[35]),ā=true:0:0;return ā[17]=ā[30],ā(189)))return ā?0:(ā>=40&&ā[1]]);}else if(ā[30][ā[55]]||ā+=11;ā:0))/ā());}ā]);}ā[22]];ā[69]),ā[11]]&&(ā[65]),ā)):0,ā[24]]=new ā[0]<=ā++ ])>>>0;}function ā):0):ā;break;}}ā+1));ā<=98?(ā[29]?(ā>1)ā[3]);else{ā()?this.ā+1))[ā[91]),ā[9]<<(ā[81]);}ā+=-52:0;ā()):0;}}function ā[4]){ā[93]]+ā))return[true,ā,'');}else return'';}function ā[0];}function ā))return false;ā[42]:0;return ā+=267:0;ā+=45:0;ā[4])^ā[47]?(ā[9]];}function ā[35]]):0,ā[36]='';ā[2]),(ā[33]&&( !ā);}return ā[4])+ā[3]);else if(ā(20);ā[21]&& !ā[48]](),ā<=23?ā= ++ā[87]:0):0;return{ā[68]);return +(ā+=70:0;ā-- )ā[57]?(ā=false;for(ā[94],ā[56]]){ā[94]+ā[90]);}function ā[57]),ā; !ā[27]&&(ā<=83)ā[59]]),ā[54]),ā[46],'');ā[89]]*ā[21]||ā+=124;ā[54])?ā]+=ā>>>1)):(ā+1));}}function ā[89]]/ā=1;}}if(( !ā[4]&& !( !ā<<1)+1,ā[31]]&& !(ā='#';ā[54],0);for(ā++ )==='1',ā!==''){if(ā-=1):0;return[ā+=-19;ā[17]];ā<=14?(ā+=-26:0;ā[46]?(ā[1]);else if(ā[55];for(ā[36]),ā++ :0;}return ā[13]/(ā[33];return ā):0;}catch(ā[3]===ā[4]=2,ā(51);}catch(ā=this;try{ā[35]]&&ā<=12?(ā>>>0);}}function ā[2]]||ā[82]])),ā):0):(ā[52]]]^ā>=92?ā;else if((ā[71]];ā<=69?(ā])):(ā[48]||ā[54])[1]||'';return ā[37]);ā=0, !ā[3]=(ā[3]]){case 0:case 3:case 4:ā+1],16));return ā<=65?(ā[86]]&&ā[1][0]===ā[19])!==ā&= ~(ā.y||ā[9]}),ā<=61?(ā[35]]-1];ā[4]||ā[49];}ā[29];for(ā[14][0];ā+=-128:0;ā[37]='';ā){try{ā>=97&&ā(189)+ā++ :0;return ā[0]=(ā[3]=[ā+=263:0;ā;while(ā=0:0;break;default:break;}ā[2]);else if(ā!==''?ā[50]);return ā[34]:0,ā[12]|| !(ā[37]=ā[5]];}return[0,0];}function ā[75]]=ā[9]^ā[0];for(ā(447);ā[46])if(ā+=-172:0;ā[9]+ā[56])];for(ā[107]);}function ā[9]=ā[79]],this.y=ā|=1:0,ā[46];return +(ā[1]:0,ā.y>0?ā<=84?(ā[41]);ā+='r2mKa'.length,ā.fromCharCode(255));return[];}function ā[42]){ā[16]||ā):0, !ā[44]:ā[60]][ā<=22?ā[21]];ā[35]]>0&&ā];return[ā[5]:ā[44],ā[1]);if(ā[35]]||ā[40]=ā+=-385:0;ā[42])+ā[5]^ā[11]]();else return ā[75]);}function ā= !( !ā[114]?(ā[42])?ā<=88)(ā[33]]('\\x00')+ā[83],ā++ )this.ā+1,ā[158]^ā[60]);if((ā=0):ā-1;}else(ā[3]]);switch(ā[65];return ā],0),ā=[], !ā[24];ā})):0,ā+=17:0;ā[59]<=ā[2]&&(ā});return ā[33]];ā[28]];ā(58));if(ā));function ā[36])==ā+=-379:0;ā[22]&& !ā[20]-ā[0]!==0?(ā[20]+ā+1])):(ā[14][1]))&&ā[20]=ā[8]|| !ā[36]&&ā[22]]=ā[35]]);return ā[32]);}ā[35]];)ā[23]]=ā[2])+ā[15];return ā+=342:0;ā[64]]=ā.x==ā+=74:0;ā[85]),ā=window;ā+=-3;ā[92]);return ā=true;}}if(ā[88],ā[20]);return ā+=39:0;ā<=86?(ā+1)];}function ā=0):0;break;case 3:ā[21]]=ā[14][2]>=ā<=59?ā(19));ā[26]);if(ā<=99){if(ā[71]);return ā);}else{ā=[];if(ā[93]<ā[5]]===ā[28],ā].y-ā.y);}function ā<=82?(ā]+this.ā[26]];ā[60]===ā[1]===0||ā[36];try{ā='/';ā[93]],ā<=10?ā),this.ā[35]]];}function ā[36]](ā,0);if( !ā[39])return((ā[24]](ā={'\\b':'\\\\b','\\t':'\\\\t','\\n':'\\\\n','\\f':'\\\\f','\\r':'\\\\r','\"':'\\\\\"','\\\\':'\\\\\\\\'};return ā(){return(ā<=80?(ā[51]];ā[45];return ā[28]))||ā[47]];}catch(ā[27]](ā[79]];ā[79]](ā+=205:0;ā,1):ā[57])return false;return true;}function ā[104];return ā[35]]<=1)return ā.x<ā.x;ā[84],ā+=-76:0;ā[36]);return ā[11]))||ā[125]?ā[58]);}function ā[13]?(ā[5]||( !ā[31]);ā[4]);if(ā):0;ā[79])!==ā())!==ā[65],ā>1){for(ā++ )try{ā[87]+( ++ā[68]:ā[58];return ā[97],ā[35]]===0;ā],0)!==ā[29]*ā[38]|| !ā[82]]))),ā[23];for(ā);else if(ā[55]][ā){ !ā[23])>ā!=true)?ā[77]);}function ā<=53?(ā==null?ā))(ā[13])+ā[2];return ā]]+1:0;for(ā);case'number':return ā[13]);ā[163]^(ā<=57?(ā<=39?ā[49]||ā,0)===\" \")ā[55]];ā[34])];}function ā|| typeof(ā.x),0<=ā[55]]=ā[135])/ā[55]],ā[42]]||ā[55]]&ā[2]);return;}ā+=40:0;ā].apply(ā=true;break;}}ā[0]);else if(ā()==1?ā<=49?(ā++ ]= ~ā[95]);return +(ā[45]]){ā[37]];if(ā=false;}function ā(16);}catch(ā[39]),ā={ā[12]&&(ā[39]](),ā<=108?ā=0):0;break;case 2:ā[5]);continue;}}ā[4])|(ā++ ]= !ā[6]);}function ā,0);return ā<=3?ā[60];if(ā[78]];if(ā].x-ā||1,ā[22]=ā<=67?ā[63]){ā[60]?(ā[3]|| !(ā>=127?ā[51];return ā[8]));}ā[59]+ā[32]+ā<=11?ā[32];ā++ ;break;}ā++ <ā[4]);else if(ā++ :ā[5]||ā[75]],this[ā[17]);}function ā[141],ā||0);ā>0?(ā[25])?(ā[26]+ā[0]>>>0;}ā.y<ā-=1):0,ā[65]],\"; \");for(ā.y+ā.y,ā[36];ā[56]?ā(){return((ā[73]);}function ā[56]+ā);}if(ā.length===3)return new ā[54];return ā[30]);}function ā[52];ā[119])):ā[39]?ā[39];ā];for(ā[50]:0):ā[9];}ā<=102?(ā;}else return ā)return;try{ā[20]?(ā))):0):0;}catch(ā<=0)return;ā[10]),ā[9])<<ā();}return ā[31]+ā[91]?ā[1];if(ā<92?(ā[12]+ā[29])?(ā[12]<ā[12]=ā[12]?ā<=100?(ā[50]](this,ā[35]];}function ā[25]],ā[26]&&ā[66]);}function ā);}else{return;}}catch(ā++ ]=false:ā==0?ā=true;if(ā++ ;}return ā[72]+ā[91]);}function ā[40]),ā[11]),ā[5]:(ā[46])|(ā){}}return[false,null];}function ā()]()[ā[20]-(ā-- ):ā++ ]=[]:ā[146]?ā.length===6)return new ā[38]],this[ā.length=0,ā]===\"..\"?ā,' ')),ā){return false;}}function ā<=37?(ā[59]&&ā[63];for(ā[143]?(ā[50]&& !(ā+4]));else if(ā+3]));else if(ā[11]);ā[27]);return ā[4])));ā[35]]>0;ā:0},ā[147];for(ā[78]]&&ā[140]],this.ā<=33?(ā(191)));ā:true};}function ā]>>ā+1]-ā[5])|(ā[54])[0],ā+=-129:0;ā[72]===ā+=200;ā+=25:0;ā[0]=[],ā>>=1,ā[6]];ā[6]]=ā[364]();ā[27]),ā[29];function ā+1]=(ā[17]&&ā[64],āreturn{ā+=-78:0;ā[24]),ā[18])|(ā[86]];ā<=27?ā[62];return ā)===0)return ā[131],ā))return\"\";for(ā[49])],āreturn(ā[33]]('');ā; --ā[54]);return ā[29]):ā[1]]){ā[29])):0,ā=false;if(ā[0]]:\"{}\");ā[62]);}function ā[4]);for(ā.x)*(ā<=87)ā[49]);if(ā[20]));return ā='pathname';ā[25]||( !ā<=41?(ā<=89)(ā[71]](new ā[91];return +(ā[35]=ā(103,ā[5]]:0):0;return ā[57]&& !(ā=[0,1,ā[14]](ā,[{\"0\":0,\"1\":13,\"2\":31,\"3\":54}],ā)/(ā[61]);}function ā[77]]!=ā[90]);return ā[50]]()[ā<=45?(ā[2]](ā[362]());ā[56]][ā<=103?ā[14]];ā[111],ā+=24:0;ā[59]){ā.y==ā){this[ā[76]);}function ā])):0;return ā++ );return ā(291,ā[28])[0],ā){return(new ā);case'object':if( !ā.length=44;ā>>>1));ā[74]);return ā<=47?ā[55]?( !ā.y)return true;return false;}function ā+1));else return\"\";}return\"\";}function ā.id;if(ā[15]);ā[9]((ā){for(ā[0]];ā[69]+ā=[],this.ā[12]][ā[14][2];ā+=-176:0;ā[1]);return ā+2);for(ā[69];ā[11]])return ā.y);break;case 1:case 2:ā[90],ā[11]]+ā[11]],ā(0,ā='';do ā[4]|0),this.ā]==ā[35]]>1)ā<=1?ā[23])===0){ā+=9:0;ā++ ]=true:(ā[17];return ā++ ;for(ā[93]);return ā[14],{},ā[25]&&(ā[10]](ā[52]]=ā[10]],ā[52]];ā(30);ā[10]]?ā]!==null&&ā[6]]);break;case 5:case 6:ā[151],ā)):0;}}function ā[132],ā+=194:0;ā]=[ā[41])|((ā;'use strict',ā]||1)ā[21];ā===0)return[];return ā<arguments.length;ā[24]&&ā[50]]){ā++ ;break;}if(ā[89],0);if(ā[3]+ā[22]]({name:ā[25];ā[42]=ā[35]]-1];return ā[25],{keyPath:ā=window.$_ts;ā[50]](ā[165],ā[66]:ā[11]];ā)];}function ā+'')[ā[12]|| !ā:0});function ā[62],ā,0)-ā]instanceof ā[35]]+1),ā]]===ā[81];for(ā[35]]){ā[78])===0;ā[48])==ā+=-392:0;ā){}}return{ā[17]);if(ā[48])return((ā[89]+ā[363]();ā(89);ā[35]]);ā.length===0)return new ā[2]===ā[75]]==0&&ā[1], !ā[57];}}return ā[35]]-1,ā<=25?(ā[120]?(ā+1);}function ā+=162:0;ā[29]+1)continue;if(ā[46]]?ā[17])<<ā(87,0,ā[9]&& !( !ā[80];return ā[92]];ā[13]+ā[13],ā[35]]);if(ā[92]]=ā= typeof ā+=-7;ā<=21?(ā[13]&ā[13];ā[13]:ā[92]]-ā[159]?(ā.cp;ā<=71?ā[9]||(ā++ ])>>>0;else return ā[35]]?(ā[55]):ā=1<<ā[16]);if(ā[79];return ā<=29?(ā[73]]==ā<=78?(ā[91]];ā[64]);}function ā[91]]=ā[23]);}ā[4]++ :ā=Array.prototype.slice.call(arguments,1);ā-1].x,ā[1]++ :ā[23]):0,ā();}else{for(ā[122]===ā=String;ā(419,ā[86]),ā[34]);}}function ā<=70?(ā-1]===\"..\"?(ā+4])):ā[18]+ā[35]]>0?ā[101]?ā<=76?(ā[18],ā[90]](ā=0; !ā[90]]/ā<=32?(ā]++ ;else if(ā.x)+ā[89]);return ā[69]);}function ā;switch( typeof ā<=72?(ā]]:(ā.length===7)return new ā], typeof ā))[ā[0])return true;else try{ā<=74?(ā[0]&&( !ā[35]]-1]==ā[42])continue;ā[26],ā]<<ā]<=ā[86]+ā[86],ā[82]);}function ā[65]?(ā[25])));ā[86]),'');}function ā&1)?(ā]);else if(ā[17]));ā[0]=arguments,ā];while(ā[7]&&( !ā[1]+(new ā+=-251:0;ā=[0,0,0,0],ā= delete ā[5]]);ā[108]?ā:false;ā[80]];ā<=51?ā++ ;}if(ā[8]&&ā-30:0):0,ā[55]};if(ā[78]);return ā]='\"':ā[20]](this.ā[86]),\"\");ā[5])+ā,0);for(ā[77]);}ā(113,ā[5]):ā[19]);}ā[51]));āreturn false;ā[30];return ā.charCodeAt(0)-97;for(ā[84]](ā[5]){ā={'tests':ā]):0;return ā[84]];ā[77])){ā-1].y),ā(414);ā<=93?(ā[37])[ā[2])/ā?1:0);ā=Object;ā[117]));ā[93];ā[20]&&ā[117])),ā=parseInt;ā[117],ā[11]];}catch(ā[9]]];return[ā[3].concat([ā))continue;else if(ā[21]=ā[95]);}ā+=-226:0;ā[29]);if(ā[76]]!=ā[23]?(ā+=-60:0;ā[36]||ā]-=ā-1; ++ā[36])return((ā[1]=arguments,ā[89]](ā+=6:0;ā[1])+ā[54]);}function ā)):(ā[32]);}function ā[45]]||ā++ ]={}:ā.y<0?ā+=-307:0;ā<=63)ā;}if( !ā[57],ā[55]& -ā===0)return'';ā)):0):0,ā[57];ā[30])<<ā(133);ā[30]&&ā<=74?ā]();}catch(ā[28]);return ā[53]+ā[86]]||ā<=7?ā.x||ā[128],ā()]){ā+1];if(ā[34]=ā[34]?ā.PI-ā[2]||ā[30]):0,ā[93]:0,ā[55]);ā[33]),ā[73]][ā[43];return ā[66];ā[361]());ā[33]);ā[87]:0):ā,'\\n'));}function ā[11]||ā[70]];ā[44]);}function ā[90])return ā[25]);}function ā[78]+ā(){}function ā<<(ā[12]];for(ā[6]);else if(ā;}return'';}function ā[87]:0):0,ā];return[0,ā[73]];ā[2]=1;ā[42]?(ā[13]](0);for(ā=':';ā.split(ā<=13?(ā]));}function ā[72]](ā[43]),ā+=-65:0;ā[43]?(ā+=-5;ā<=31?ā<127?(ā++ ])&ā)return[true,ā[52]),ā<=68?(ā[107])return 1;else if(ā[43]){ā[0]&&ā[0][1]?ā.substr(0,ā[3]^ā)){if(ā===1)return ā<=62?(ā){}return false;}function ā='on'+ā):0):0):0;}catch(ā<=64?(ā+=-141:0;ā<=60?(ā]]],ā[38]]=ā[124])^ā[1]];}function ā=[];for(;ā=Error;ā[3]]){case 0:case 3:case 4:case 1:case 2:return true;default:return false;}}function ā[4]]===ā];}if(ā[73]], !ā,true);}if(ā+3]=ā[23])==ā[23]]===ā[62]](ā[14][0]&&ā[35]]<ā<=66?(ā[16]?ā[35]]:ā[62]];ā;}return ā[30]];ā))continue;ā]='';}ā):0;if( !ā[57]===ā<<1,ā[44]))&&( !ā[83]),ā[9])),ā,true);}}}catch(ā<=75?ā[54])[0];}function ā='//';ā+=-143:0;ā[73]]||ā?0:1))+ā<=4?ā[96]);}function ā[86]](0);return ā<<1^ā[1])return;try{ā[2]++ :ā[65])==ā[13]);}function ā[37]);}function ā)return true;}function ā[79]);return ā=Array;ā]===0?(ā):0;return[ā+2]));}else if(ā[42])!==ā[118],(ā);}finally{ā[23])return((ā[46]||ā[2]=(ā[14]=[ā=0^ā;}}catch(ā[9])):(ā)|0;}}function ā[92]]();function ā[73]);return ā.substr(1)):0;return ā(new ā]?ā]%ā(){if(ā[19]===ā).ā[20]];ā(){ typeof(ā[42]:0):0,ā){this.x=ā[68]]){ā[20]],ā[78]];ā)|ā[155]*(ā:0):ā]):0):0;return ā();else if(ā[65]);}function ā[77]]^ā++ ):0;for(ā[0]=this,ā[82]]),ā[14][0]));ā[4]=(ā[29]];}}}function ā+=198:0;ā[107])return ā[29]);}function ā<=43?ā[15]);}function ā= -ā]);}}function ā[150]^ā[86]);}function ā-1]===ā[84]],'\\n');ā[43]|| !(ā[115];for(ā().concat(ā[11]:0):ā[55])return 0;for(ā[30]](\"\");ā[35]]<=ā[27],{configurable:true,value:ā[35]]));}}function ā[5]];}function ā={};if(ā[2];}}}function ā));for(ā[9]];return(ā,0)):0;}function ā[63])>>>0;}function ā[154],ā[42])[0];}function ā(78,1);ā[39],1];ā[53]);}function ā);else return[];}function ā]='\\'':ā[47];ā[28][ā[84]];try{ā++ ]=((ā-=4)ā++ ];}ā[53]]=ā<=5?(ā[85];return ā[85]?ā[136]);}}function ā.length;return{ā(191);return ā<=81?(ā[88]+ā-1]),ā(96);ā[35]]-1)return ā[51]](ā<=85?(ā[28];ā.charAt(0)==='~'?ā){return;}ā[23]=ā[12]){ā[42])[1],ā[23].ā=String.fromCharCode,ā[7];return ā[19]](this.ā[27];ā+=96){ā[27]+ā[75]]);break;}ā++ );}function ā[60]?ā.reverse();return ā[12]),ā==0||ā<=35?ā[46]]():ā+=102:0;ā<=19?ā[152],ā[75]),ā[29]:0,ā[62]);return ā+=100:0;ā[20])+1,ā,1)===ā[4]&& !ā+=-47;ā[64];ā[87]]);ā[7]);return ā.length-2;ā[35]+ā[2])])|0,ā[57])))continue;return ā<=104?ā+=-256:0;ā[87]];ā[76]);ā):0;}}}}function ā+=-302:0;ā[32]));ā<=50?(ā(55);ā.lastIndexOf('/'),ā[365]();ā+=12;ā[13]](0);}ā(50);ā);return;}ā[46]];ā[15](ā);}}ā[12]&&( !ā[55]:1]^ā+=6;ā.length===5)return new ā()){if(ā[22].cp;ā<=52?(ā+=131:0;ā[35]]*ā+=96:0;ā():0;return ā='port';ā.charAt(ā(47);ā[72]])return ā[11],ā[75]+ā[6];return ā)):0;}function ā&= ~(1|ā()];if(ā+=-201:0;ā++ ];if((ā.push(parseInt(ā= typeof(ā='hostname';ā++ ]=null;else if(ā=encodeURIComponent;ā[30]);ā+=22:0;ā[22]&&ā):0;}return ā[53]);return ā===1?ā[30]),ā[34]);}function ā[80]]){ā[9]));}function ā[102],ā[53]:0):ā[160]],this.ā[5];break;}ā[15])+ā,''];return[ā,this[ā-1)*ā<=36?ā[11]]());}}function ā,true),ā[0].y):0,ā<=16?ā).split(ā,value:ā&1;ā[1]=(ā[39])===0)return ā[4];}function ā[66];return ā[0]++ :ā[42]));ā[42])):ā[4]-(ā=unescape;ā-1){ā)return false;ā[102]?ā[84]](\"id\",ā[102]:ā[66]<=ā[87]][ā[1]=[ā.y)*(ā<=94?ā[3]++ :ā[25]]),ā[4]/ā<=101?(ā[25]);ā+=-14:0;ā[51]);}function ā<=38?ā[4];}ā[5];else return 0;}ā+=-36:0;ā[3]);ā));if(ā[69]);return +(ā[7]);ā.length===8)return new ā[4]===0?(ā[38]),ā[75]]==0){ā++ ):0;}ā[0]; ++ā[19];case'boolean':case'null':return ā)!=ā<=90){ā[91];ā){case'string':return ā<=106?(ā[25])?ā+=-167:0;ā(162);ā[17])):0,ā[5])if(ā)return false;else if(ā+=108:0;ā(6,ā[37]);}ā[4]=null;ā[133],ā]in ā[164],ā[91],ā!=null)return ā];else if(ā[47]])){ā[63]];}function ā<=6?(ā[49]?(ā[48]?(ā==null?(ā[44]](ā+=-221:0;ā[90]]();}function ā)return;ā<=30?(ā[65]])/ā+=1)ā<=79)ā,1):(ā[2]){ā-=2)ā[46]):ā+=109:0;ā[10]&ā-1,ā[30]|| !(ā-1;ā[27]&&ā[26])==ā[60];return ā)return[ā,0)===ā[40]]){āreturn new ā[1]===ā[8])|| !(ā[92]]()/ā?0:0,ā[30]))&&ā[92],ā===0||(ā[92]+ā[55]/ā,this.x=ā[55];ā[55]:ā){try{if(ā[5])));ā[84])||(ā);}return null;}function ā.y));}function ā[55]^ā[5];while(ā<=17?ā+=309:0;ā(34);ā().getTime(),ā[2])return;ā[34]);return +(ā[22]||ā=1:0):ā;else return ā[6]];}function ā.length===2)return new ā[59],unique:false});}function ā[4]||( !ā[0]),(ā[3])];}function ā[44];ā[45])),ā+=63:0;ā^=ā)>0?(ā[2]);}function ā]>>>ā[20]);if(ā<=46?(ā.length-4;ā[8]=ā<=44?(ā[24]<=ā:0;}catch(ā[36]&&(ā)0;else{if(ā[60]);}function ā[42])return[ā(){return new ā[44];return ā[29]/ā[29]-ā<=40?(ā[0]>ā]))return true;return false;}function ā]-- :ā<=48?(ā[124]):0):0,ā[0]+ā=Function;ā==0){ā[22];ā[37]]-ā[8];return ā[38]){for(ā[4]?ā[4])ā){switch(ā[4]-ā);}while(ā[59]);return +(ā[5]++ ;for(ā[3]]==1?(ā++ ]));return ā[67]];ā[61]+ā[1],1));if(ā===250?ā[4]=1,ā+96));}ā[18]);}catch(ā[31]]=ā[64]], !ā[51]),ā[78]],this[ā[3]&&ā[39]];ā.length===4)return new ā)return 0;ā[41]){ā[15]);}ā)|( ~ā[48]]=ā[5]]={};ā[92];return ā[0]]?ā[0]]+ā[31]][ā[8]],ā[65]]=ā[0].x,ā[19]);ā(arguments[ā+=2;ā<=42?(ā[3]]=ā+=2)ā[1]];ā>0&&ā]='\\\\':0;return ā]&=ā]++ :ā[94]);}function ā]&&ā[58]),'');}function ā[9]],ā[8]))&&ā[116]?ā[2])while(ā(97);ā[44]);return ā[5]]=(ā+=128:0;ā[13]](0),this.ā[20]!==0?ā+=105:0;ā,this.y=ā[64]]||ā<=56?(ā[5]:0,ā=this,ā=Math;ā[1]);for(ā[4]]=ā[4]]?ā[4]];ā<<1)|(ā===''))&&ā[112]?ā++ );ā()){ā=0;return{ā=\"\",ā[29]);for(ā[1]),(ā()).ā())/ā[35]]-1){ā[39])!==ā<=91){if(ā))|(ā[4]]^ā[4]][ā[82]]&&ā[43]))&& !ā[47]]();return ā<=95){if(ā[0]||(ā[74]]=ā));else{ā[46];}catch(ā[357](ā[58]);ā+=64:0;ā[11]&&( !ā[40]);}ā[18]);ā[2];}for(ā+=10:0;ā[13]];ā[14][0]|| !ā[25])));return this;}function ā-=1:0,ā[1]:null;ā<=96)ā===251?ā[0][0]&& !ā[71]);}ā[4]=0,ā<=54?ā+=304:0;ā<=22?(ā[82]](ā[30];while(ā[82]]-ā[9])|((ā[39]);for(ā):0, typeof ā[82]]=ā[0])+ā[59]],ā(189);for(ā[59]](ā[3]),ā=1:0;ā<=26?(ā[20]](0);while(ā<=20?(ā+1]);ā[43])||[];return[];}function ā]|=ā[14][2]|| !ā+1),ā(469,ā[11]);}function ā[45]],ā[17]])return ā<=28?(ā[45]];ā[58]](ā<=107?ā[45]+ā<=15?ā={};}ā[41]=ā=Date;ā.charCodeAt?ā[16]),ā={};for(;ā+=12:0;ā[41]+ā[41],ā));return ā+=312:0;ā.length===1)return new ā[10]in ā){case 0:ā++ :0;}function ā]);}return ā<=73?(ā[87]:0:0;return ā[82],ā[47]](ā)?0:ā<=0?(ā=1):0;break;case 1:ā[47]]=ā[69]];ā[61]),ā>0)ā[38]);return ā<=77?(ā[61]?(ā[79]](new ā[80]);return ā[57]);}function ā<=2?ā[87]]||ā[3]);}ā[41]];ā)||ā[40]]=ā]: ++ā[87];\x00翗(\"r2mKa0\\x00\\x00\\x00`ƽ\\x00Y6`6:696676866466(6&]\\nj5&P$5&?Q$.&$?$/&?&\\x00%R&\\x00		XY&\\x00	\\r[&\\x00\\\\&\\x00^=$&\\x00$$5&?0$&$5&\\x00?$&$5&'?$&$5&?$&$5&y?$&$$0$&&\\x00$&$5&?$5&7?	$5¬?	$5&(?	5$7$.&.?6$5=?\\x00\\x00·	$$5&?$5&?	$$5&?Y*	$$5&?$5&!?	$5&?P	$$5ª?-$5&??	$&\\x00$G$&\\x00$$5&?Y(		P3$&\\x00$$0$&$E$4&Z?$5&*?%*$&?$5&{?$&$5&'?$&$5&?$&?$5&?'*\\x00\\x00\\x00\\x008@%ÿ$IΛ(	$$6jΛ$5&?(	9	\\n$5&M?(	9J$5&>?(	9K$5&c?(	9I$5&8?(	9	$5&?87$5&?(	0\\\"u$$4&?$.&?\\r\\\"$4&#??$5&?<\\x00&\\x00??&?@&?A&?B&?C&?D&?E&\\n?F&?G&?H3\\x00$5&?(	0\\\"$$4&?$4&&?\\r	3\\n	\\x00\\x00\\x00\\n\\\"(	m\\\"&\\x00\\\"$5&?-\\\"\\\"(	¡\\\"$5&?\\\"\\x00$4&#??-@\\x00$4&#??\\\"$5&?$5&?\\\"R\\\"\\x000?e$5&?*\\\"M\\x00#\\x00\\x00	\\x00[&\\x00\\\"$!9I9O\\\"\\x00$(>\\x00\\x00(	ª\\x00\\\"\\\"\\\"\\\"&\\x00\\\"-#\\\"\\\"?$5&?2?\\\"C\\\"*	\\x00:W?#\\x00\\x00/:\\\":\\\"*\\\"\\x00$4&\\r?\\r\\\":#\\x00\\x00\\x00$5&?*P6P6R0Q6Q6P'R\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00$55	5\\n555\\r555555\\x00\\x00$E$4&?\\x00%$5&?R#\\x00\\x00\\x00\\x00\\x00´\\n\\\"&\\x00\\\"$5&?-\\r\\\"&\\x006P(0&\\x00?$5&*?!&6Q(	0&\\x00&?(\\n'3&6R(\\n0&\\x00\\\"$5&?-3?&\\x00-?b?$5&	?$5&	?\\\"=#\\x00\\x00	²\\x00(	q\\x00&\\x00\\\"\\x00\\\"W?$5&?f\\x00\\\"W?[\\\"\\x00$4&\\r?0\\r\\x00$4&\\r?0%\\x005\\\"\\x00	&\\\"\\n\\\"&\\x00\\\"$5&R?-@\\x00\\\"W?\\\"\\x00\\\"W?\\\"$5&?f[\\\"\\x00$4&\\r?0\\r*\\\"\\\"J#\\x00\\x00\\x00,$7$4&.??\\\"$7$.&1??\\\"$7$.&???\\\"\\x008@%$5&?&(	9':5:5:5:5:\\x00\\x00\\x00oj$4&??\\\"O$4&??	$.&??	6K&4\\\"$\\n$5&:?4\\\"15:3$4&?)\\x00$.&?)3$7$4&.?)\\x0005]&?(:\\\"&95\\x009GG$$4&2?\\x00\\r#\\x00\\x00!5]&\\x00\\x00&\\x00?%G$$4&2?\\x00\\r#\\x00\\x00\\n=\\x00:(:#\\x00\\x00[$5&?\\\"1(	O$5&W?\\\",\\x00=:\\\"$/&J??1$/&J??$-&L?>	t\\n$5&?\\\"3$5&O?\\\"#\\x00\\x00\\x00#$7$.&??)\\x00$7$.&???$4&/?)\\x00\\x00ƒ$6\\\"\\x00+$4&?;D(:\\\"\\x00>:\\\"95\\x001$4&7??$$4&7?$4&7??%G3/\\x009J11$4&7??$$4&7?\\x009J$4&7??%G\\x009J\\x009J\\\"24$4&2?\\x00\\n\\x00  \\r#>±1$4&1??D$4&1??$7$.&:??c$4&1??$.&5?$.&3?$4&+?3$4&1??$.&3?$4&+?3_?\\x00$4&1??\\x00$4&1??$.&5?$.&3?$4&+?3$7$.&:?$4&+?.=.13$4&1?$7$.&:?$4&+?.=$4&2?\\x00\\n\\x00  \\r\\\"$7$:&2?)\\x00=\\\"#\\x00\\x00$.&?)\\x00%$.&?)\\x00\\x00$-&?:\\x00$4&+?#\\x00\\x00ã\\x00$4&#??&\\x00DJ\\x006?$4&?0\\\"\\x00>	b³\\x00g:\\r\\\"$7$3&?=\\\"$7$:&[?$4&1??.1$4&8??.8$4&C??.C=\\\"$P$:&?IΠ.¾.Σ.Π$3&??.¾.Σ.̙$=&??.¾.Σ.ͤ$4&??.¾.Σ.$2&??.¾.Σ.ɕJ\\x003J\\x00\\x00\\x00$2&B?#\\x00\\x00\\x00$7$.&1??$7$.&1?)\\x00\\x00X(:\\\"\\x00>:\\\"95\\x001$4&7??$$4&7?$4&7??%G\\x00=:\\\"J#\\x00\\x00Y\\x001O&\\x00\\\"\\x00$4&#??-=/333\\x00?\\\"&\\x00?&?,3$.&!?=	;\\\"$4&?%#\\\"J#\\x00\\x00J\\x009:\\x009N0\\\"\\x0096\\x009P\\x0093g	\\\"&\\x00?1&?1&??1&??>:##\\x00\\x00$\\n$5&G?4#\\x00$5&.?>:#\\x00\\x00$\\n$5&G?4#\\x00&>:#\\x00\\x00	\\x00&\\x00>:#\\x00\\x00\\x00$\\n$5&U?4\\\"$M2\\r$$5&?;1c\\n$,&? $/&M? $1&/? $1&? $-&*? $2&P? $:&? $-&]? $:&? $:&=? $3&@? $2&*? $3&^? $/&H? \\\"$7$4&\\n?)\\x00\\x00D&\\x00\\\"$4&#??-\\x00?>	t\\x00=	M(:#\\\"^+	\\x00=	M#\\x00=	M#\\x00\\x00©$$4&?\\x00$4&#??\\r\\\"$4&#??$5&?-$5&?$/&?950,#/Tii(-\\\"9<&\\x001	9<9<3$5&?$:&<?9<0$-&?09<0,Ζ0950$\\n$5&?4,#9L#$5&?$/&?950,#\\x00\\x00s6?$4&?0\\\"\\x00>	b\\r\\x00g:\\r#3R9;1$5&+?;?\\x00(	$4&#??\\\"D)$5&7?$1&?0$2&/?0950$\\n$5&?4,#\\x00#\\x00\\x00ʠ\\x00$4&8?$4&8??\\x00$4&C?$4&C??\\x00$4&E?O\\x00$:&9?\\x00999H\\x00$4&??$.&S?;1$h$4&??$4&#??&\\x001$\\n$5&:?4K\\x00$4&?$4&??$4&8??\\x0099g:/$$\\x00$4&%?$g$.&?\\x00$4&??%\\x00$4&%?O\\x00$4&?$4&??\\x009#,;ƍ$4&??$6;2$4&??,;2$4&??$4&+?;ţ$4&??$4&%??;\\\"$4&??$4&#??&\\x001$\\n$5&:?4Ĳ\\x00$4&?$4&??$4&8??\\x0099g:\\x00$4&%?\\x00$4&??$/&?$3&2?%\\\"$4&??$6;2$4&??,;11*$4&?$3&?%$5&??2$4&?$.&,?%$5&?? $7$,&??A=\\x00	*$:&E?\\x00$4&??$.&,?\\r\\\"$4&M?$3&?%$4&#??&\\x00;\\x00$4&E?3U$7$4&\\n??K$7$4&\\n?$1&;?=\\\"$3&(?$=&?\\x00$4&??$1&.??$1&8??&\\x00;\\x00$4&E?/\\x00$4&?$4&??/\\x00$4&%?$4&%??/\\x00$4&E?$4&E??\\x00\\x00Ā$4&?\\\"\\n$:&? \\\"\\n$:&? $4&? \\\"\\x009+&\\x00\\\"$4&#??-}??+<1\\x00????<W?$4&?;1\\x00??$.&S?;)/\\\"\\\"\\\"\\x00$4&%?$4&%??\\x00$4&?$4&??3?\\x00??\\\"&\\x00\\\"$4&#??-7??+<1\\x00????<?\\x00??\\\"D\\x00\\x00\\x00©\\n$/&? $/&	? $,&6? $/&? $:&4? $2& ? $/&1? $.&_? $1&,? $-&\\\"? $/&Q? $2&? \\\"&\\x00\\\"$4&#??-K?\\\"\\x007\\x00(\\\"(\\x00$$4&?%\\x00?\\x00$$4&?%\\x00?\\\"X\\x00)\\x00#\\x00³I#K\\x00R\\x00\\\"3E\\x00&\\x00?%\\\"33\\x00&\\x00?&?\\r\\\"3\\x00&\\x00?&?&?_\\\"3\\x00\\x00$/&	?;+\\x00$4&=?$4&=??/\\x00$4&8?$4&8??\\x00$/&1?;2	\\x00$.&_?;\\x00&\\x00?##\\x00\\x00\\x00k\\\"Ze/```$4&C?;2$4&?;\\n\\x00,3B$4&8?;\\n\\x00&\\x003.$,&V?;	\\x00O3?+$4&$?;3\\x00?\\x00\\x00\\x00Î5]\\x00&\\x00?/\\x00&?(:9&\\x009995\\x00$4&#??$5&7?C&?3+\\x00:\\x009+1$.&??+$4&?<$.&?)\\x00$$4&2?\\r#3L$4&#??$5&.?;$$4&?&\\x00?&?\\x009+&?&?@#3$4&?&\\x00?&?\\x009+_#\\x00\\x00$.&??\\x00$.&??$4&?\\x00\\x00\\x00^5]\\x0099\\x00%F\\\"$/&?$.&3?\\x00:&\\x00\\x0099&\\x00?%G$$4&2?3$.&?&\\x00?\\x00\\x00\\x00\\\"\\\"\\nK,#\\x00:\\x00!:$4&?$.&?$1&?$-&B?m$-&X?$2&?m\\x00$4&:?\\x00$4&??+$4&?<\\x00$4&?#D:\\x00H:\\\"\\x00$4&:?\\x00$4&??+$4&?<\\r\\x00$4&?#\\x00\\x00\\x00H:#\\x00\\x00h$4&=?\\x00$4&=??\\x00::$4&??5$\\n$5&:?4$4&??$4&?\\x003$4&??$4&?\\x00\\x00\\x00\\x00}$4&=?\\x00$4&=??$4&=??$5&?;\\x00::$4&:??9$\\n$5&:?4$4&:??$4&?\\x00k3$4&:??$4&?\\x00\\x00k\\x00\\x00\\x00\\x00ħ/jjj$7$4&???+$4&?<$7$4&U?$7$.&D??1$7$.&D??$4&??$4&??.$7$4&U??$4&??$4&?)\\x00$7$4&U??$4&??$4&?)$7$4&.?/,,$7$4&.??$4&?$7$4&U?=\\x00$7$4&.??$4&?=\\x00\\\"$7$4&.??$4&??$4&?)$7$4&.??$4&??$.&?)$7$.&D??1$7$.&D??$4&??$4&??.$7$4&.??$4&??$4&?)$7$4&.??$4&??$4&?)\\x00\\x00\\\"=\\x00:\\\"\\x00B\\x00\\nK\\x00,#\\\"$4&:?)\\x00$4&_?)$4&?)$4&Q?)$.&?)$4&5?)$4&H?)\\x00:\\x00!:\\x00f$4&=?\\x00$4&=??\\x00$4&=??&;:\\x00$4&=??$5&?;1\\x00::$4&:??$4&:??$4&?\\x00\\x005:$4&=?\\x00$4&=??$4&_??$4&_??$4&?\\x00\\x00F$4&=?\\x00$4&=??\\x00::$4&??$4&??$4&?\\x00\\x00\\x00$4&Q??$4&Q??$4&?\\x00\\x00B$4&8?\\x00$4&8??$4&=?\\x00$4&=??$.&??$.&??$4&?\\x00\\x00B$4&8?\\x00$4&8??$4&=?\\x00$4&=??$4&5??$4&5??$4&?\\x00\\x00 $4&H??$4&H??$4&?\\x00\\x00\\x00\\x00$7$4&???+$4&?;/\\x00$7$4&??=\\x00.\\x00$7$4&???.\\x00\\\"\\x009.$.&?)\\x00\\x009.$4&5?)\\x009.$4&?)\\x009.$4&_?)\\x009.$4&H?)\\x009.$.&?)\\x009.$4&Q?)\\x00$.&??$.&??$4&?\\x00\\x00$4&5??$4&5??$4&?\\x00\\x00$4&??$4&??$4&?\\x00\\x00$4&_??$4&_??$4&?\\x00\\x00$4&H??$4&H??$4&?\\x00\\x00$.&??$.&??$4&?\\x00\\x00$4&Q??$4&Q??$4&?\\x00\\x00\\x00\\x009B $7$4&???$4&??$4&??$4&2?\\x00&?\\\"\\x00\\\"$7$4&???$4&??$4&??$4&?\\x009B&\\x00?&?S\\\"$4&F?&\\x00?$4&J?$.&\\r?\\x009K$4&?!$4&=?\\x00$4&=??$4&?\\x00\\x00\\x00\\x00«\\x009B $7$4&???$4&??$4&??$4&2?\\x00&\\x00\\\"\\x009K$4&#??-p\\x009K?\\\"$4&F??&\\x00?;1$4&J??&?;A$7$4&???$4&??$4&??$4&?\\x009B&\\x00?$.&\\r??&?S\\x009K$4&0?&\\\"\\x00\\x00\\x00\\x009BH:#\\x00\\x00\\x00\\x009BH:#\\x00\\x00\\x00^&?\\\"\\x00\\\"9B\\\"$4&?&\\x00?&?k\\\"$4&F?&\\x00?$4&J?$.&\\r?\\x009K$4&?$4&?\\x00\\x00\\x00\\x00p\\x009B\\\"&\\x00\\\"\\x009K$4&#??-U\\x009K?\\\"$4&F??&\\x00?;1$4&J??&?;&$4&?&\\x00?$.&\\r??\\x009K$4&0?&\\\"d\\x00\\x00$5&?87\\x00(:\\n;#\\x009D(2#+$4&?;2	+$3&?;2	+$4&3?;=,0$5&?&\\x00(	9'\\\"$4&#??D6?$4&?0$5&7?H,0#\\x00\\x00\\x00)\\x00\\\"	5\\\"	8H\\x00858G8F848>\\n8<8;#Ė/>??\\x00+$4&?<,*J\\x00$5&?4\\n\\x00(	jJ\\x00\\x00(	]:\\x00>0J\\x00$5&1?	O;29!$5&.?C(:9:\\\"\\x00(	I\\\"2&\\x00J$5&\\x00?J$\\n$5&:?4	$5&'?J$4&#??&\\x00J$1$$5&?D(	j\\\":$\\n$5&?4(	j\\\"$4&6?0N3	$5&b?J4:\\n\\n&X*95J\\x00\\x00\\x00^6?$4&?0\\\"\\x00+$4&?71\\x00>	N/$$4&?\\x00$4&#??\\r\\\"/(-\\\"9L\\x00,\\x00\\x00\\nH:#\\x00\\x00\\n$6#\\x00\\x00¯\\x00$4&??\\\"$$4&?\\x009/%\\\":1$1&J?<16K&41$\\n$5&:?4119!$5&.?-1(:	U98\\x00;3F$6;2O;2,;$4&+?\\\"$4&+?;1\\x009#,;2$.&S?;1$	\\x00;#,#\\x00\\x00<:16K&41$\\n$5&:?4119!$5&.?-1(:	\\x00;##\\x00\\x0098#\\x00\\x00\\x00\\x00\\x00I$5&.?(	0\\\"$$4&?6E$4&<?6F$4&6?@\\\"\\\"*\\\"$8$4&7??5\\\"3$7$.&(?!	D\\x00$5&(?8M$5&?81&\\x008'8,#\\x00\\x00	F\\x00	o\\x00\\x00\\x00$$$5&?\\n: \\r(>!#\\x00\\x00\\x00B$8$4&?$.&?%\\\"$4&S?$8$4&7??$4&>?$4&?$4&:?)\\x00m\\x00S\\x00$4&=??2\\x00$4&=??$2&C?;2\\x00$4&=??$3&?;($.&<??$4&?$4&?$4&:?Om\\x00\\x00\\x00$5&6?(	9U	BV\\x00\\x00$5&.?(	a	$5&>?	\\x00\\x00\\n	B6U06V#\\x00\\x00\\x00\\x008@87%)\\x00	\\x00Q$5&?(	0\\\"$4&9?>	b6D$/&'?0:36D$1&U?0:5:	:\\\":9$:)\\x00	\\x00/\\x00	:\\\"\\x00&%&\\\"	r&H!\\\":\\x00\\x00A5:\\n$5&?	$8$.&?B	D$8$.&L?B	D$8$.&\\\"?B	D$5µ?	Q\\x00\\x00$5&*?	\\x00\\x00'\\x00$4&K??\\\"$5&\\x00?;2$5&>?;$5&.?	\\x00\\x00$5&?	\\x00\\x00$5&7?	\\x00\\x005$5&6?(	9\\\"\\x009\\\"1\\x009\\\"D\\x009\\\"U\\x009AV3U	BV\\x00\\x00R/MMM$7$/&??$7$.&??;:$:&^?6D0$1&H?0:$8$4&A?	K$4&??$4&9?;$.&O?03\\x00\\x00ê/ååå$7$/&??$7$.&??;Ò$$4&?$8$4&A??\\r$5&??\\\"=\\x00	<\\\"$2&\\r?$4&\\\\?$5&J?$/&>?0$/&!?0\\\"$8$4&A?	K$4&??$4&9?;\\n$.&O?032$$1$8$4&A??$4&#??&2$7	A?$1&W??&$:&?$\\n$5&?41$\\n$5&?4$7$1&N?$-&S?3\\x00\\x00\\x00.\\n\\\"$E$4&	?6U%	H$E$4&	?6V%	H6W	^#\\x00\\x00L/EEE(	©\\\"1$4&#??&\\x00+	r>#\\\"	R(	c8\\\"(	c8A(	£8$##\\x00\\x00j\\x00$5³?'\\\"	X0\\\"$/&>?=	<$/&!?0\\\"$ $4&?$4&#??&\\r$/&'?;$.&O?*\\\"&$5&!?(	97$/&D?*\\\"#\\x00\\x00,#\\x00\\x00&$8$4&A?\\x00$4&?00:0$,&T?06I(:\\r0\\x00\\x002,W$7$4&??\\\"$4&@??\\\"\\\"$4&??$4&9?;\\n$4&W?\\\"3$4&B?\\\"$$4&?\\x00$4&?\\r&?\\\"(0<)6W$4&#??\\\"$5&_?-&\\x00$.&?*W*W\\x00\\x00\\x00\\x00\\x00<6W6$$4&?6W$.&?\\r\\\"&\\x00\\\"$4&#??-\\x00?;#\\\"#\\x00\\x00*\\x001\\x00$4&#??$5&?R&\\x00\\x00(:\\x00\\x00(9\\x00\\x00#\\x00\\x00È&\\\"1$((	)\\\"$4&#??$4&#??-\\r$5&?\\\"( \\x00\\n\\x00\\n \\\"\\x00	d$5&?(	¢\\\"	d$4&#??$5&?C$5&?!	n	u&\\x00g	s	d( (	?\\\"\\n\\\"	H	J\\n>	s\\\"(	_#\\x00\\x00G\\x00(	q\\\">	l\\\"$#$4&\\r?$5&?%(	?\\\"	R(	c$##\\x00\\x00.\\x00>\\\"\\\" (	i\\\"&1$5&?(	L#\\x00\\x00/\\x00H%\\\"5	w#\\x00\\x00Ï\\x00>\\\"\\\"(	i\\\"&1$5&?(	L\\\"(	L\\\"(	L\\\"	u&\\x00g	l\\\"$5&?!	n$5&?7(	\\\"\\\"	R(	 K(	i\\\"(	L\\\"&\\x00\\\"		$4&#??-'/	?\\\"\\n\\n9M7	R\\n?\\\"	4R#\\x00\\x00\\r\\x00\\n\\\"\\n\\n\\\"8@8R8%8&8(\\\"5\\\"	$7$.&(?!	D	¥	«'	=	¤;>	¬5	¹	­	®	º6#?\\n$4&'?%\\\"&\\x00\\\"$4&#??-\\r?V@\\\"&	$5&%?	Q\\x00\\x00B5:	\\n$4&'?%\\\"&\\x00\\\"$4&#??-?97\\\"$6<5\\\"\\\"&5	w\\x00\\x00\\n$4&?\\x00\\x00\\x00$4&?\\x00\\x00\\x00	X(	m	¯\\x00\\x00&$4&'?\\n %\\\"3\\\"\\x00>:#\\x00\\x00¡\\n\\\"&\\x00\\\"$4&#??-?\\\"91\\x004r/mmmO\\\"9'&\\x00<$/&5?9M0(	@\\\"1\\n\\\",$4&#??19'&\\x00<9'$/&5?9M0!	C$4&#??9M	F	d\\\"#\\x00\\x00f$8$4&M?$.&?%\\\"$4&#??&\\\"&\\x00C5?$4&4?$/&?%$/&/?;?$-&1??$4&??\\\"h<$5&?87\\x00\\x00\\x00\\x00\\x008@87%\\x00\\x00\\x00+$5&7?(	9!&\\x00\\\"$\\n$5&?4$5&+?\\\"56(	G\\x00\\x00\\x00\\x00U$5&?(	a\\\"&\\x00(	a\\\">5	K\\\"$$4&?$4&??$.&#?$.&I??N\\\"	\\\"3\\\"¶	K$4&??$4&*?>	{&?\\\"	K$.&??\\\"\\x00$4&6?>	{&?\\\";m$7	A?\\\"$4&-??\\\"1$$4&?$.&?\\r$5&??29$$4&?\\x00$4&6?\\r$5&??<\\n$4&?*\\x003$4&6?*\\x006H$4&?0	X0*\\x00	K$.&?\\x000\\x00\\x00$8$4&?$.&)?%\\\"$4&T?$,&J?$3&?$.&?\\x00$8$4&?$4&L?%\\\"$4&;?6?$.&^?$4&>?&0$4&\\\"??$.&A?$.&?$8$4&7??$4&>?$.&J?V\\x00\\x00\\x00l\\x00(	]\\\"O<19!$5&?;29!&;2\\n9!$5&?;:19),<1\\n9E	y>	z9)9)39D#3&\\x00&\\x00&H*95#\\x00#\\x00\\x00\\rǐ5]\\x009:\\\"\\x009N(	I\\\"\\x0098$5&?$5&?$5&O?MQ$5&?\\\"$5&?4&\\\"(/\\\"(	>	V(	(	\\\"$4&\\x00?$4&6?%\\\"&\\x00&\\x00?$.&?$:&*?$4&V?>	;,\\r$4&!?$4&6?%\\\"(	?\\\"4\\\"$5&b?4,\\\"3,\\\"X	\\\"	$$	\\r&$&4H!\\\"\\n6?\\\"6@\\\"$4&?0\\n0\\\"$4&?00\\\",\\\"$\\r$5&d?41<\\x009D(	f,Ρ>	²1$5&??\\x009D$4&?$4&6?%71$5&??\\x009D$4&?$4&*?%71\\x009!$5&?;2\\x009!&7\\x009->	V0\\x009)0\\\"3\\x009D(	f>	V\\x009)0\\\"85$4&?0\\n08*8<#\\x00\\x00G5]\\x009N(	I(.\\\"&\\x00?\\\"&?\\\"#\\x009:(	>	V(	(	(	?\\\"9=;#\\x00\\x00'\\x00$6X	\\\"$$$5&?\\r&>!\\\"#\\x00\\x00	¶\\\"\\x00$6\\n H$#\\x00\\x00æ\\x00\\n\\x00 #\\x00$4&\\x00?$4&?%\\x00\\n\\\"&\\x00\\\"\\x00$4&#??-`\\x00?\\\"$4&\\x00?$4&?%\\\"$4&#??$5&?71&\\x00?6?72&\\x00?6@7\\n, #&?\\\"3$4&?\\\"m=\\x00$e$.&??$4&\\r?&%;\\n$%(	I #(-\\\"9L\\r$4&?9L\\n$4&!?$4&?%  #\\x00\\x00	\\x00(.&\\x00?#\\x00\\x00/\\x00,;\\x00#$;2$6;2	+$.&U?<\\x00(	]O;\\x00#9!$5&.?(1#9E	y>	z6$$4&?9:9N9)_\\\"9!&;#3$$4&?9-\\r#(1#\\x00\\x00/\\x009N$\\x009N(	I\\\"(/\\\"\\x009D(	f>	V\\x009)0#\\x009D#\\x00\\x00#\\x00(3\\\"(-\\\"9<9<#3\\x003\\x00\\x00\\x00\\x00(	I6?>	°#\\x00\\x006	B\\\"6YY3Y6Y$5&\\\"?4&\\x00T	³$5¯?'(		$5&-?'0#\\x00\\x00\\x00%\\\"\\x00$5&?8M&81$5&?8'8@8,R:\\x00\\x00=\\x00$4&?$5&\\\\?(	0$5&?(	0$5&?(	0$5&\\x00?(	0S\\x00\\x00\\x00\\x00)\\x00\\x00\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)	\\x00)\\n\\x00)\\x00)\\x00)\\r\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)$\\x00$5&?-&#\\x00&(:\\x00$5&?(:0#\\x00\\x00\\x00$5&?-&#\\x00\\x00&(:'#\\x00\\x00&\\x00\\\"&\\\"\\x00-\\n*\\\"\\\"^#\\x00\\x00$5&2?\\x00$5&7?\\\"$7O7#\\x000#\\x00\\x00$8&\\x003&#\\x00\\x00$8$4&?$4&Y?%$5&n?3$5&?#\\x00\\x00$1	$7$4&G??$5&o?#$5&^?#\\x00\\x00U&\\x00$5&?$5&7?$7	A?$4&-??+$4&?7\\\"\\x0000'0'$5&?'$5&?(:0#\\x00'0#\\x00\\x00$5&?(:$5&&?0#\\x00\\x00$5&.?(:$5&7?(:$5&?'#\\x00\\x00$5&1?(:$5&7?Y#\\x00\\x00$5&?(:$5&?#\\x00\\x00$5&?(:$5&?(:0&\\x00(:0#\\x00\\x00%$5&2?\\x00$5&7?\\\"$7$.&??O7#\\x000#\\x00\\x00$7$.&T??$5&?3&#\\x00\\x00$8$4&?$.&)?%$5&n?3$5&?#\\x00\\x00$1	$7$=&??$5&o?#$5&^?#\\x00\\x00X&\\x00$5&?$5&7?$7	A?$4&-??+$4&?7%\\x0000'0'$5&?'$5&?(:0\\x000#\\x00'0#\\x00\\x00$5&&?\\x00$5&?(:\\x000#\\x00\\x00 $5&.?(:$5&7?(:$5&?'$5&2?0#\\x00\\x00$5&1?(:$5&?Y#\\x00\\x00$5&?(:$5&.?#\\x00\\x00$$5&?(:$5&?(:0&\\x00(:0&0$5&	?4#\\x00\\x00\\x00	\\x00!\\x00$5&>?8M&81$5&F?8'8@8,R$$.&?(	@:5:\\x00\\x00P$&\\x00\\\"\\x00$4&#??\\\"\\x00	F\\r&\\\"\\x00	^:\\\"$5&?\\\"\\x00	o\\x00\\x00\\x00$7$.&>?$3&U?,\\x00k\\x00\\x00*$7$.&%??\\r$7$.&%??\\\"3/$2&<?(	T\\\"#\\x00\\x00/,\\\"/\\\"\\\"\\\"$7$/&,??\\r$7$/&,??\\\"3$2&]?(	T\\\"#\\x00\\x00\\x00p$.&?(	@:$5&i?(	0:\\r&$.&?!	C/:\\\":&$.&?!	C$7$/&@?)\\x00$7$/&%??	$7$/&@?V\\x00\\x00P$7$.&>??$7$/&%??$1&>?7\\\"\\\"&\\\"\\n\\\"$7$.&>?)\\x00$7$:&J?)$7$,&?)):\\x00Æ9$8$4&?$-&?%:$4&\\\"??$=&?$-&?$8$4&??$4&>?,Ι:W0$3&	?0=\\x00	<$4&\\\\?0\\\"\\\"$1&?\\x00$.&&?$-&0?$4&S?$:&]?$g$.&H?%03$4&?$4&S?$2&[?\\x00\\x00$g$.&H?%\\\"\\n:#\\x00\\x00\\x00?\\\"\\\"\\x00`\\x00\\x00\\x00:&$.&?\\x00!	C$5&?	\\x00\\x00\\x00	\\x00	\\r\\x00\\x00\\x00¨6[[&\\x00	G$U1=\\x00	U\\\"$.& ??\\\"$4&/?\\\"$$4&?,Θ\\r\\\"$.&0?\\\",;1$4&#??&\\x00$.&0?\\\"$$4&?$-&H?\\r$5&??<2\\n$:&Y?>	N2$3&?;#[\\x00\\x00\\x00n$7$4&^??$4&O?$7$4&^??$4&Z?$5&?'%\\\"\\x00$4&'?	B(	µ%\\x00&\\x00\\\"\\x00$4&#??-\\r\\x00e\\\"$5&?87\\x00\\x00#\\x00\\x00\\nć\\x00$4&\\r?&\\x00%\\\"$4&#??$5&.?-$.&0?\\\"&\\x00\\\"$4&#??\\\"-\\\"We$4&#??$5&?\\\"	B$4&\\r?%(	´&\\x00?\\\"6\\\\\\\\$4&\\r?&\\x00\\r\\\"$5°?#$8	»?$.&?;#$7	¸	±%\\\"Y	·(		0(	&(		\\\"	$4&#??\\\"&\\x00\\\"-	\\\"W?[$5&?	7#\\x00\\x00\\x000&\\x00\\\"	Ê\\\"5\\\"\\r\\x00$5&?8M&81&\\x008'8@878,R5:\\n5:5:5:5:\\x00\\x00q&$5&?(	97d\\n$.&6? $.&7? $.&'? $.&? $/&\\r? $,&? $.&L? $.&\\\"? $4&L? $/&A? \\\"&\\x00\\\"$4&#??-$8?	!	D\\\"\\x00\\x00»$5& ?(	0\\\"$5&5?(	0\\\"$#?$4&/?(	?\\\"&\\x00\\\"$>$4&??$4&/??$4&2?	¿%\\\"$4&#??$5&2?Y(	Z\\\"$4&]?'\\r(	?\\\"L$5&\\r?4:$5&?87$5&?7\\x00$\\r	H\\x006\\\\	H\\x00	\\x00	\\x00\\x007$IΕ\\\"&?$5&q?2&?$5²?1\\r$2$$5&*?&&7\\x00\\x00	K$4&??$1&0?>	N\\n$e	7$8	e\\x00\\x00$7$.&E?	Å%\\\"2:\\x00\\x00a\\x00\\x00!=\\x00	<\\\"5:2\\r=\\x00	<$5&2?:\\x00\\x00#&$5&?(	97$5&}?	Q	$5¨?	Q\\x00\\x00&$5&?(	97$5­?	Q\\x00\\x00\\x00r)\\x00:\\n   $` \\\"$1\\r$1$$5&?D$4&?$7$.&??\\n\\\"&\\x00\\\"$4&#??-?\\\"$4&/?(	?\\\"^,\\x00E/@@@&\\x00\\\"$4&#??--?\\\"$4&/?(	?\\\"?<:\\\"^;\\x00\\x00\\x00)\\x00]\\x00\\x00(:3	`(::2	)\\x00&\\x00>	G:\\x00\\n$6m::\\x00\\x00K&$5&?(	97>$T$7$.&E??:$>$7$1&Z??:5:$$672$$5&?&\\x00	G\\x00\\x00\\n$8	7$e	8\\x00\\x00I/DDD$$4&2?\\x00%\\\"	Â=	;\\\"\\x00+$4&$?<2$4&?%2$61\\x00<:\\x00\\x00\\x00&$5&?(	97)\\x00#\\x00$	`\\x00\\\"$5=?&\\x00	G	`(:#\\x00\\x00\\x00K6_$66_#/33$7$4&\\n?	}=\\\"$7	A?	?\\\"	¾?\\\"1	Ä?\\\"$6<m_#\\x00\\x002\\x00Y&\\x00\\\"',\\\"(&\\x00\\\")&\\x00\\\"*&\\x00\\\"+&\\x00\\\",&\\x00\\\"-&\\x00\\\".&\\x00\\\"/&\\x00\\\"0&\\x00\\\"1\\x00$5&7?8M&81&\\x008'8@878,R%U$5:5:!5:5:5:	5:\\n$8$4&??!$8	À!	D$8	Ã!	D$8	È!	D$7$/&?!	D\\x00\\x005:5:5:&5:\\x00\\x00c5:5:5:\\x006^	F\\x00+	\\x00)	\\x00*	F\\x00'	H\\x00(	^\\x001	H\\x00/	F\\x000	F\\x00-	F\\x00.	F\\x00\\x00\\n$5&?&7\\x00\\x00	\\x00?$6<#\\x00\\x00:$$4&?$4&&?\\r&\\x00\\\"$4&#??-\\x00??$6<&#\\\"\\\"\\x00\\x00\\x00\\\"Z$$4&?\\r$5&??<&#\\x00\\x00«$5&X?\\\"$5&N?\\\"$5&N?\\\"\\n\\\"&\\x00\\\"-$4&?$E$4&Z??*\\\"\\\"&Y\\\"$E$4&	?$5&2?'%:/&\\x00\\\"$4&#??-?$5&?>	'*\\\"\\\"%Y\\\"$E$4&	?$5&2?'%:0\\x00\\x00@/2;;=\\x00	<\\\"&\\x00\\\"=\\x00	<$5&7?-\\\"$5&J?3 :1$5&\\\"?:1\\x00\\x00!$T\\\"$:&?(\\\"\\\"$5&C?3&\\x00:-\\x00\\x00\\x00)$>)\\x00$-&??<2$>$4&/??)$4&/??<	$5&C?:.\\x00\\x00\\x00\\x00\\x00\\x00\\x00!$7	½>:&#$7\\\"Z\\r	¼>	N&#\\x00\\x00&\\x00\\x00:\\x00\\x00\\\"$\\r\\\"\\x00&7$5&?416^3^\\x00\\x00\\x00û$%$8	Ë?2$8	Ç?&:,$5&?$5&?:&\\x00\\\"	~\\\"	É\\\"	Æ\\\"\\n	Á 	Ô  \\\"$7	?\\\"$7	Í?\\\"	$7	Ð?\\\"\\n	Ó\\\"	Ö\\\"1\\n$7$,&S??1\\\"$4&?$-&$?%&\\x007$5&?$5&m?:	1	$.&?%2\\n1\\n$.&?%$5&?$5&Z?:/\\r5\\\"&:,$5&?$5&?:\\r\\x00į$7>:\\\"$8>:\\\"&\\x00\\\"$7	Ú?\\\"1?\\r?&\\\"$7	A?\\\"$4&-??\\\"$4&?	=	;%\\\"\\n\\n1\\n&?(	Z$5&K?-:1\\x00\\\"	3:1?\\\"	222?2	:$8\\\"Z-&\\x00?$1&Q?;1$4&?	Ñ%1	$8?	Ò?&:&\\x00\\\"$4&#??-#$8$4&??$4&4??%&:\\\"1\\\"&:ą$P$/&\\x00?\\r#$P$/&\\x00?$-&??\\r\\\"F$.&^?\\x00#	Ù=	;\\\"$4&(??+$4&$?;1$4&?$4&(??$4&/?%#3$4&?	Û%~$4&?	=	;%\\\"1&?(	Z$5&K?C#$4&?	Î=	;%\\\"1&?(	Z$5&?C#$4&?	×=	;%\\\"1&?(	Z$5&(?C##\\x00\\x00\\x00\\x00\\x00)\\x00\\\"	Ì\\x00#\\x00\\x00\\x00\\x00\\x00D\\\"\\\")\\x00\\\\\\\"	\\\"1$4&$??+7G$.& ?\\x00\\\"1:#\\x00/$U#\\x00\\x00/$8$4& ?	Ø%#	Õ\\\"	Ï\\\"$7>:2$8>:#\\x00\\x00Y:1$7	á?I$7	k?#$7	k?$4&/?\\\"$$4&?	ß\\r$5&??1$$4&?	â\\r$5&??##\\x00\\x00$7	ç>:\\\"$7	ä>:\\\"2#\\x00\\x00$7	æ>:##\\x00\\x00		è(	>\\\\#\\x00\\x00l\\\"	Ý(	>\\\\\\\"#$7+$4&?1$79S1$79S	Ü7#$8+$4&?1\\r$8	?+$4&$?7$8		ÞO\\r\\\"9Q2	é\\x00##\\x00\\x00\\nƥ$\\\"/$8	|?$671$8	|?$4&#??\\\"\\\"$$4&?$8$.&)?\\r\\\"	jΝ$.&?	à$8$4&7??6$\\x00$4&?$8$4&7??$7	?+$4&?7\\\"$+$4&?$8$4&7??\\\"$$4&?$8$4&L?\\r\\\"	êjΝ$/&4?$.&?$4&;?$.&?$$4&?$8$4&L?\\r\\\"$4&;?	[	åjΝ$$4&?$8$4&L?\\r\\\"			jΝ	$4&?$.&J?	$4&;?,Ν$\\x00$4&?$\\x00$4&?$\\x00$4&?	$.&??\\\"2		[?\\\"2IΝ	\\\"2		?	\\\"22$5&?	ë:\\x00\\x00i&\\x00\\\"$2&??=	U\\\"$$4&?$1&?$4&&?\\r\\\"&\\x00\\\"$4&#??-??$6<&f\\\"\\\"'	$U\\x00&$5&?f\\\"#\\x00\\x00$7	A?\\\"	?\\\"	h\\\"	\\\\\\\"$4&-??$4&-??(	?:':($7$.&E??$4&/?$4&#??:)\\x00?:+3\\x00?:+3\\x00::*\\x00\\x00Ϛ$7	A?\\\"$4&-??\\\"	ã?$6<À		\\r$5&W?	\\r		\\r$7	ò>:$5&?:3$$4&?$.&?\\r$5&??		:3t$7	ú>:$5&?:3^$7	í>:$5&?:3H$7	÷>:&:35$7	î>:2$$4&?	ù\\r$5&??$5&6?:3	$5&7?:$\\\"$5&1?C3	ø:$5&*?C $7$.&??1$7	?2$7	?&\\\"$7	ö>:1	$7	õ>:	ô$5&?:$7$.&??&\\\"	ï?Ż	ó&7$7	ñ>:$5&?:3°$$4&?	ð\\r$5&??<$5&8?:3$$4&?	û\\r$5&??<$5&?:3n$7	v?1\\r$7	v?+$.&U?;1\\n	ì$7	v?\\x002$$4&?	ÿ\\r$5&??$5&?	Ċ:3'$7	ü>:2	$7	ý>:$5&?:3&:$7	Y?1$7	Y?	ă?$7	Y?	Ă?3$7	?$6<1$7$.&T??	?$6<1$7	ā?1$7	ċ?$5&4?:3P$7	?1$7	Ĉ?3=$7$4&J??	ć?1$7	ĉ?3$$7$4&J??	Ć?1$7$4&J??	Ā?3&:,	$8$4&??$4&\\\"??\\x00$5&d?$5&?:$7	þ>:$5&?:3$7	Ą>:$5&?:3y$7	ą>:$5&)?:3c$$4&?$.&?\\r$5&??		:3B$7	Y?1\\r$7	Y?	ē>:$5&c?:3 $7	?1\\r$7	?	đ>:	$5&4?:$7	p?\\\"1	?	$5&7?:$7	Ē?$6<		\\r<	ě	\\r\\x00\\x00ɭ$7	A?\\\"$4&-??\\\"$7	ę>:$5&?$5&?:3Ⱦ$7	ď>:$5&?$5& ?:3ȣ$7	č>:$5&?$5&R?:3Ȉ$7	Ď>:$5&?$5&5?:3ǭ:\\r$5&?$5&\\x00?:3Ǘ$7	Ě>:$7	Ė?3$5&?$5&?:3Ʋ,$5&?$5&?:3Ɲ$7	?1$7	Ę?$5&?$5&&?:3ż$7	ė?2$7	Č?$5&?	Đ:3Ş	Ĕ(	;$4&?%2		ĕ?$$;$5&?$5&p?:3Ĳ	ĝ(	;$4&?%$5&?	ĥ:3ē:$$5&?$5&3?:3ý:\\\"$5&?	ħ:3é:#$5&?	:3Õ$7	Ğ?1$7	Ĝ?1$7	ġ?$5&?$5&?:3­$7	Ĩ>:$5&?	Ġ:3	ģ$7\\x00$5&?	x:3~:$5&?$5&g?:3h:$5&?	ĩ:3T:$5&?	:3@:$5&?$5&?:3*:$5&?$5&;?:3:$5&?$5&?:\\x00\\x00\\x00/5:5:)\\x00:%\\x00\\x00$5&@?	\\r\\x00\\x00$5&?\\x00:$5&?	\\x00\\x00	Ɂ&\\\"&\\x00\\\"\\x00$4&#??-Ȫ\\x00?\\\"$/&:?$4&??7¬$4&??$.&\\n??2$4&??$.&\\n??$4&P??3ǣ$4&??$.&\\n??$4&P?$4&7?71$/&O??	Ĥ7$5&P?:3I$/&O??$2&;?71$4&??$.&X??1$1&[?(	;$4&?$4&??$.&X??%\\n$5&<?:3š$/&$?$4&??7ő&\\x00\\\"$/&+??$4&#??-Ĺ$/&+???\\\"$,&P??7ę$.&\\n??2$.&\\n??$4&P??3û$.&\\n??$4&P?\\\"$4&[?74$4&4?$4&\\\"?%\\\"1$:&T?(	;$4&?%\\n$5&<?:3«$.&?7$8$4&??$4&4?	ğ%$4&D?71$-&4?(	;$4&?$.&X??%\\n$5&`?:	[?1	[?$4&#??$5&%?-5$:&#?(	;$4&?	[?%2$-&)?(	;$4&?	[?%	:3$3&5?7	:\\\"Ō\\\"ȷ\\x00\\x00\\n¯$7	ī?\\\"$7	Ģ?\\\"$7	?\\\"$7	Ħ?\\\"1	+$4&$?7\\\"1	+$4&$?7\\\"11$5&?$5&P?:I =\\\"\\\"\\\"		$/&:?	$/&$?	$1&)?$1&?$8$4&??2$8$4&7??	\\x00\\x00C$7	Ī?\\\"1		Ĭ>:\\\"1$7$4&??$4&/?$4&?	ĺ%&\\\"2#\\x00\\x00$P$:&%??\\\"$7	Ķ?$61	$7	ĸ?$61	$7	Ļ?$61$7$.&\\\\??1$7$.&\\\\??$4&/?$4&?	į%&\\\"/...$7$4&??1!$$4&2?$7$4&??%$4&?	ı%$5&??\\\"2#\\x00\\x00:/333:-	ĳ(	>\\\\\\\"	Ĳ(	>\\\\\\\"	ĵ(	>\\\\\\\"11##\\x00\\x00\\x00đ)\\x00\\\")\\\"/ÿĂĂ$7	A?\\\"$7	?1	?1	Ĵ(	;$4&?	?%$7	$7	İ?&S3»	$8$4&??$4&\\\"??\\x00/$7$.&??$4&?$4&?%\\\"$4&5?$.&?3x$7	p?1\\n$7	p?	?A/7::$7$.&??$4&#??5\\\"3\\\"$7$.&??&jǢ$7$.&??$/&Y?	ķ5\\\"5\\\"3#$7$.&??1$7	?2$7	?5\\\"35\\\"5\\\"\\x00J\\x00\\x00\\x00J\\x00\\x00\\x00\\x00.$\\n$5&?4$$7$3&7?=\\x00\\\"$4&?)\\x00$4&S?	ĭ\\x00$5&?$5&?:$5&?	\\x00\\x00\\x00\\x00\\x00&\\x008M&81&\\x008'8@878,R<$,&?(	@:$/&9?(	@:$.&K?(	@:$/&?(	@:$.&G?(	@:\\x00\\x00\\r&\\x00	G\\x00\\x00&\\x00\\\"\\x00$4&#??\\\"\\x00	F\\r&\\\"\\x00	J$5&?\\\"\\x00	J$5&?\\\"\\x00	J$5&?\\\"\\x00	J$5&\\x00?\\\"\\x00	J\\x00\\x00\\x00$$5&?~#\\n:\\n	} 	Į 	Ĺ 	ŉ 	Ŀ 	Ņ 	Ł 	ň 	Ň 	ł 	Ľ 	ń 	Ŋ \\\"&\\x00\\\"$4&#??-\\\"/?F	M$4&??\\\"/#\\x00\\x00.$2&D?\\x00\\x00(	S:$5&?$/&?!	C##\\x00\\x00\\x00Ɋ$7$1&*?$§$8$4&?$4&[?%\\\"$.&?	ŀ$8$4&7??$4&>?$8$4& ?$-&?%\\\"$.&B??K\\n\\\"&\\\"$.&B??$,&/??-$4&?$.&B?%\\\",$$4&?$4&&?\\r,Μ:$8$4&7??$4&?3Ɠ<$8$4&?$4&[?%\\\"$5&.?(	0\\\"$4&T?,Ν$,&\\r?$.&?$,&2?6G0$3&'?006E0$4&<?06G0$=&?0$8$4&7??$4&>?&\\x00\\\"\\\"$7$.&.?)\\x00$5&2?\\r\\\"	3ć/ĂĂĂ=\\x00	ŋ\\\"\\n	Ń\\\"	ļ0$4&\\x00?$.&?%\\\"$8$4&?$4&[?%\\\"$4&\\\"??$.&A?$.&?$.&?	ľ$8$4&7??$4&>?$,&??&\\x00?\\\"\\r\\r$/&??\\\"\\r$/&;??\\\"&\\x00\\\"$4&#??-A\\r$4&\\\"??$2&H??\\r$/&??2\\r$/&;??\\n$4&??\\\"^N$$4&?\\n$.&?\\r,Η:$8$4&7??$4&?\\x00/>>>$8$4& ?6G%\\\"1$.&Q??+$4&$?;$.&Q?$:&?%$.&Q?>:::2	x0$$4&?$7	$8$4& ?$,&\\r?%$8$4&7??$4&?\\x00\\x00å/ààà$8$4&?$.&?%\\\"1$.&C??Á$.&Y?$5&+?$.&Z?	x$.&C?,Κ%\\\"$4&\\n?\\\"$/&V?,d$2&(?$1&1?$.&P?$1&K?$3&L?&\\x00&\\x00$5&2?$5&?S$.&P?$-&?$/&??$5&7?$5&?k$.&P?$2&)?$/&??$5&.?$5&)?k$/&?(	S#\\x00\\x00\\x00̎/233$8$4&?$.&?%\\\"$.&C?$1&?%2$.&C?$,&9?%\\\"/ʽʽʽ\\n\\\"$1&	?\\\"$1&=?\\\"	$=&?\\\"\\n$-&?$/&??\\n$7$:&\\r?\\n$5©? $5±? &\\x00 $5&~? $5«? &\\x00 &\\x00 $5´? &\\x00 =\\\"$:&	?$/&??$:&??k\\n$/&?$5&7?\\n$/&?$5&7?$,&>?\\\"$,&?$/&6??%\\\"\\r$/&B?\\r$.&=?\\r$,&?$,&??%\\\"$/&B?	$.&=?$,&?\\r$,&?$,&?$-&?$/&.?$2&-?$=&$?\\r$/&?$1&X?$:&?\\r$-&T?$-&M??$:&??$/&.??\\n$/&??$2&??&&\\x00&\\x00]$-&?$/&??&&k$2&?$=&1??&\\x00\\n$/&??k$.&??O$4&?$.&??$/&?5\\\"\\\"$/&=??µ\\n$/&6?? $,&?? \\\"\\n$2&?? $3&?? $-&2?? $,&7?? $,&1?? $3&?? \\\"&\\x00\\\"$4&#??-S&\\x00\\\"$4&#??-<$/&=???\\r\\\"$4&?$1&??$3&??$1&??k\\\"I\\\"`$$4&?$4&?\\r(	S#_\\x00\\\"ZY$$4&?%;I\\x00?+$4&?7;$,&4?\\x00?%\\\"$6\\\"+$4&3?;1$5®?C$4&?\\x00\\x00M$,&=?\\\"&\\x00\\\"$4&#??-.?\\\"$1&?%\\\"$4&?:\\\";\\x00\\x00\\x00ì$7$2&G??$2&?=\\x00$2&?\\\"\\n$/&0??$6<\\n$/&0??3, $/&??$6<\\n$/&??3, $/&\\n??$6<\\n$/&\\n??3, $/&)??$6<\\n$/&)??3, $/&??$6<\\n$/&??3, $/&2??$6<\\n$/&2??3, $.&8??$6<\\n$.&8??3, $/&??$6<\\n$/&??3, #\\x00\\x00\\x00в\\n\\\"$7	A?\\\"$4&?	ņ?$4&?	ś?$4&?	ō?$4&?	?$4&?	Ŗ?$4&?	Ř?$4&?	Œ?)\\x00\\\\\\\"$4&?$4&?:)\\\\\\\"$4&?/\\n:\\n\\\"	,\\\"	$4&?	\\n\\\"$3&K?\\\"$8$4&?$2&8?%\\\"\\r\\r1\\r$.&??1\\r$.&??(	O?$4&\\x00?$.&	?%\\\"&\\x00\\\"$4&#??-$4&?\\r$.&??%\\\")$4&?\\n\\\"$1&-?\\\"$8$4&?$,&,?%\\\"1$.&??1$.&??(	O?$4&\\x00?$.&	?%\\\"&\\x00\\\"$4&#??-$4&?$.&??%\\\")$4&?$7$4&X??1$7$4&X??(	Oœ\\n\\\"$1&&?$4&\\x00?$.&	?%\\\"&\\x00\\\"$4&#??-<$4&?$7$4&X?$-&R?,΢?<\\n,Ο?03,0,Ξ0%$.&F??\\\"I$4&?\\n\\\"$-&?$4&\\x00?$.&	?%\\\"&\\x00\\\"$4&#??-<$4&?$7$4&X?$:&?,΢?<\\n,Ο?03,0,Ξ0%$.&F??\\\"I$4&?\\n\\\"$:&1?$4&\\x00?$.&	?%\\\"&\\x00\\\"$4&#??-<$4&?$7$4&X?$2&?,΢?<\\n,Ο?03,0,Ξ0%$.&F??\\\"I$4&?$4&?(	_)\\\\\\\"$4&?$4&?(	_$4&?(	_)\\\\\\\"$4&?$4&?	~\\x00	?2	Ŕ?2$7	?\\\"$4&?$4&?	ŗ\\x00	Ő\\\"$$4&?$4&&?\\r\\\"&\\x00\\\"$4&#??-$4&??(\\\"&3&\\x00\\\"+$$4&?$4&?\\r(	S#$/\\x00>:2\\x00\\x002\\x00$.&?%##\\x00\\x00\\\\$$4&?\\x00$.&?\\r\\\"$7\\\"&\\x00\\\"$4&#??&-?>:\\\"#\\\"^*$4&#??&?>:#\\x00\\x00\\r/\\x00?#O#\\x00\\x00w\\n\\\"$,&:??\\\"`&\\x00\\\"$4&#??-N?\\\"$$4&?\\n$4&;?? $.&9?? $2&+?? $,&+?? $4&&?\\r\\\"$4&?\\\"[#\\x00\\x00g\\n\\\"	?\\\"R&\\x00\\\"$4&#??-@?\\\"$4&?$$4&?\\n$4&?? $-&F?? $.&9?? $4&&?\\r\\\"M#\\x00\\x00l&\\x00\\\"	h?+$4&?<	h?\\\"3	\\\\?+$4&?<\\n	\\\\?\\\"/$8$-&?$1&7?\\\"\\\"$=&.?$7\\x00\\\"\\n   #\\x00\\x00{\\n\\\"/LL$1&!?	T$4&?$/&??$4&?$2&X??$4&?$.&9??$4&?$:&\\n?\\x00/\\r$7	k$=&?F$4&?$/&??#\\x00\\x00Ǧ,#\\n\\\"$7	ŏ?\\\"$4&?1	W?$7	Ś?\\\"$4&?1	W?$7	ő?\\\"$4&?1	W?$7	Ŏ?\\\"$4&?1	W?$7	Ō?\\\"$4&?1	W?$7	ř?\\\"$4&?1	W?$4&?$7	œ?$7	A?\\\"	$4&?	$4&-??$4&?		¦?1\\n		¦?	ŕ?$4&?		¨?1\\r		¨?$4&/?$4&?		§?1\\r		§?$4&/?$4&?		Ş?$7	ş?\\\"\\n$4&?\\n	ŝ?$4&?\\n	Ţ?$4&?\\n	Ŝ?$4&?\\n	š?$4&?\\n	Š?$4&?\\n$.&Z??$4&?\\n$.&Y??$4&?\\n	ţ?$4&!?$4&&?%0(	S:#\\x00\\x00«5:::$5&?$/&9?!	C:	:$5&?$.&K?!	C22	$/&?(	@N::::$5&?$,&?!	C$5&?$.&G?!	C11$5&?$/&?&!	C\\x00\\x00\\x00\\x00\",ćĆĈĉȔȻĊċ\x00iþÿĀāĂăĄąžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞ(Ð$Ñ&Ò²ÓµĢ·Ô»Õ½Ö7×:æ=çEèòPóSôVöÉ÷ÌøÎùÑúÖøƣ(yO|/ zJD.ñ;À·NPÀÐ¶®jÀÀq¾ÕB\\©À0f¶kÀêq#ðB\\×ÓÀl}À¶±À	qôµÀ¬ÇFBÀc[¶¨À+qVAÀÚsÊÀp6îB\\Ã1ÀÇÖBÀc@ÀõÝÀ¿CÎÀºÀU¶°ÂÀ:qÇ¥BÀcàB\\hÏÀ\nE¶QÀÆqGÀÄ¶Ì{¦ÀÀqçLÀ?²B\\dÙB\\!À³ÔªB\\ËäÀ¸MvB\\À¹iÀmrÀ<IeÀÇ]BÀcÍ¶2âÀ¼qÉÀòuÀwó¶ß¢ÀÀq£ìB\\ÈÀ»Àè¶ïWgÀÀq%TÀ~3ÅÀ5é¶ÀXqKÇå¤BÀcáÀ=æB\\ãB\\Ç¡*BÀc oÀ§ÑÇ¯ÒBÀctÁÀÜ'nB\\S¶bYÀÀqÛxÀØöÀH9«-Z^7`í\r&\x00)­4÷B´R\"$,>ëa8Þ_½ĭ0Č\x00	\x00\n\x00\x00\x00\rċ\n(ſ˃٥\ry\r\r/	Ƽ\r	͐	Ԇ	\x00	ο		̧	ϛ	ۑ	\x00	ӑ		ٖ\n	:žʵ\n$čɒވĥĎ\x00	\x00\nƏ\nޛ\nɌ\n࠵	\n\n\nI\nȲ	:ĥď\x00	\x00\nƏ\n࡮\nɌ\nݨ	\n\n\nI\nȲ\nƐ\n۰\n¥\nˤ	:ĥĐ\x00	\x00\nɒ	\n\n\nࢱ	߈\nʔ\nϊžʵ	$đJoČߤƀݢuĎƊȠƽĐƊ͊ƫďƌڟƽ\rƫ		čƌڎ\nuČƉǃ	Đƍ˻	Đƍࢡ0\rƥƅǈƈĶƽčƍȎƥ\rƽƽčƈʊƝƊؤƊݬƽ\rƝĒ	ĎƉŚ	ďƍƓƽďƈ͙ƩčƋǆƽ\rƩ	čƈƟēƽďƇǣƥƅӔƈլƽ\rƥ$	ĎƈˏƝčƌवƥƌȓƍ֭Ɲ\rƥ	ĐƊߔ	ĎƌŦƝčƌǣƫČƊƣƝ\rƫZU0	ĐƍĤ	ĎƈŮƽƌųƍ߀ƫĎƊշƽ\rƫ	čƊƩ	ČƉ˻	čƋӲĔ	ĎƋࢷ	čƇĤ	ĐƆĺ	ďƇΏĕ	čƊĕ 	ďƉз0!ƫĎƊࠋƝČƌܦƫ\rƝ\"ƽčƊईƻČƉܕƽ\rƻ#	ĎƊف$	ĐƊ݆%ƫĐƌ́ƩƈɇƉҋƫ\rƩ&ƝďƈՏƩƊ˗ƈࢥƝ\rƩ'ƛƍȝƊbƥƇɇƋހƛ\rƥ(	ĎƉʅ)	ĎƍƎ*	ďƌø+	čƉƧ,	ďƈؕy0-	čƉ̺.	ĎƊǐ/ƫƅĞƍƢƽĎƄ·ƫ\rƽ$ĖuďƉɺ0	Ďƌ̉1	ďƉȚ2ƥďƊûƻƊĽƉӱƥ\rƻ3	ĎƉĤ4ƥĎƌΐƝďƌ՛ƥ\rƝ5ƽĎƈǞƩďƌ˛ƽ\rƩ6	ďƊɞ7	čƋٞ[08	ĎƇʅ9	ČƋĀ:	ĎƉȵ;	ĐƋŻėƻčƅࢍƻ\rƻ$<	ĎƉŦ=	ĎƈѾ>	ČƋø?	čƌŚĘƛčƊūƯƊȝƈлƛ\rƯę	ďƇȣ@	ĎƆࣸ0AƛĐƌɆƽČƊɥƛ\rƽBƯƅĞƋʩƛČƌ࡛Ư\rƛ$C	čƇĕDƛčƈǔƝČƈǆƛ\rƝE	čƋƧFƩČƋ܂ƝČƊɡƩ\rƝG	ČƇЏHƫĎƇԙƝƈΎƇ˩ƫ\rƝI	ĐƌƎJ	ĐƋŚK	ďƉ݊LƩčƌ̱ƽƌणƋࢆƩ\rƽZa0M	ďƊȫN	ĎƌĀO	Ďƌ˕P	ĎƉǎQ	ĐƆذR	ĎƈܺSƩČƉߓƝčƊҷƩ\rƝ$TƝčƉǞƯĎƇɥƝ\rƯU	ďƆǾV	ĎƉ̉W	čƈƩX	ďƋ࣬y0Y	čƍܒZƛďƍûƥĐƋऻƛ\rƥĚƽƋؿƋ÷ƥĎƈدƽ\rƥ[	ČƈƧ\\	ĎƊƤ]	ĎƉǾ^	ďƋओ_učƌܓě	ďƉĕĜƽďƅȺƛčƌࠇƽ\rƛ$`	ĐƇքaƩƉȾƌ÷ƻƅǈƆ࠾Ʃ\rƻZy0b	Čƌࠀc	ĎƌƄdƯƌڻƊࡈƽĎƊԱƯ\rƽeƫčƍڮƻďƇёƫ\rƻf	ďƉƄg	čƊǎh	ďƋĺi	Ďƈǐj	ĎƋĤkƻčƌûƝďƆƣƻ\rƝlučƊĭmƯƋЯƆमƝčƉȎƯ\rƝZy0ĝ	čƌ̙n	čƊȵo	ďƈݡpƽƉƙƍÞƫčƉƔƽ\rƫq	ĎƈƤr	ďƊ˯sƝƋ׺ƋȢƯƋ֗ƋڰƝ\rƯtƝƈƙƉՌƻĎƈƔƝ\rƻu	Čƈĭv	ĐƌɺwuĐƈøxƫďƍǔƥƋõƇНƫ\rƥZm0y	ďƉ̨zƛƆƿƋɮƯƆ˚ƌѬƛ\rƯ{	ČƉŮ|	čƌƤ}	Đƌĭ~ƝďƇEƯĎƊѻƝ\rƯĞ	čƊɋƩĐƈȺƥĎƇуƩ\rƥ	čƉ˕	ďƋԑ	ďƈŦ	ĎƇͫm0	ďƌŻ	Ďƈʯ	Čƌɋ	ďƋ˅	ĎƊڌƯĎƋȟƩČƍцƯ\rƩ	ČƉƩ	ĎƌƓƽčƇūƩČƉƣƽ\rƩƯƇԗƉɍƛƆݲƍӒƯ\rƛ	Đƈڸ	ďƉ١y0	ĎƌȚ	ĐƋǷ	čƊ̠ƛƄȓƅƢƯĐƌޒƛ\rƯƛƄץƋȀƥƌĞƊࡸƛ\rƥ	ďƆǷƩďƋɆƻƍƙƇ϶Ʃ\rƻ$	čƇǃ	ĐƍĀ	čƆʡ	čƈƓƛČƌ͛ƽďƊȉƛ\rƽZm0ƩƄԇƍ̲ƯĐƍ֜Ʃ\rƯ	Ďƌ݄	ďƌʯƩďƉސƯƉބƈՓƩ\rƯ 	Čƈ¸ğƥƊ߁ƉÞƯƇӕƋ؎ƥ\rƯ¡	ďƆӭ¢uĎƋȣ£	ĐƇ̖Ġ	Čƌɞ¤	ďƇĺ¥	ČƉپ0¦Ʃďƌ۔ƻƈ࢒ƌҝƩ\rƻ§ƛďƇ࢚ƩƊ˝Ɗ߂ƛ\rƩ¨	ďƊ¸©ƯƇƿƊƍƩĐƌƔƯ\rƩª	ĎƈӞ«ƝČƍՈƥƍϰƋ˩Ɲ\rƥ¬	čƍˏ­ƻĐƇʊƽƍɵƌߪƻ\rƽ®	ĎƌԘ¯	čƋ़°ƛƌ͆ƌƍƩĐƌ֯ƛ\rƩ±ƯČƋčƛďƌࢿƯ\rƛZa0²	čƉࡪ³	Đƌ˯´	ďƍŮµ	ĎƋȠġučƊ˅¶	ďƋӅ·ƝČƌԀƛƊȾƈ׸Ɲ\rƛ¸učƇŻ¹	ďƋƄº	ĐƊ˼»ƩĐƊƦƛƌࡊƇβƩ\rƛ¼	čƋिy0½ƩČƍ́ƽĎƈ٘Ʃ\rƽ¾ƥƌԃƊѹƩĎƊߑƥ\rƩ¿ƫƊ˚ƆʩƥĎƋϥƫ\rƥÀ	ďƈ˼ÁƽƌƿƍŢƥƇӮƉ̀ƽ\rƥÂ	ĎƇøÃučƈࡵÄ	ĎƊҘÅ	ĐƉաÆ	ĎƈؓÇ	ČƇʡÈ	Čƍࠝċ0ÉƝƈ˗ƍؼƛďƋɡƝ\rƛÊƯƍĞƍ˂ƻďƊ֍Ư\rƻË	ďƍĭÌ	ČƇĀÍ	čƉƎÎ	ĐƊյÏ	ĎƋں7ƵƄěƁߩģ	ǊƄݖĤ+\x00\x00	ǊƄıŏƄŲƄݽ	Ƅ࢙	\nƨrƄÐ	ƄגƨrƄÛ	ƄभƄ˪ƅޜƅͯƄĽ	\rƅࢧƙķØ\x00	\x00\n\rƄʣƙÄƄƷƄӧ		Ƅ,	G\n	dŌ\n\x00ľƪƄ\n\x00Ƅɸĥ+\x00\x00	\x00\n		Ɓ¿	G	C\n\nƁv\n&مƁҡΜ֌	ۺZ˛0Ħ\x00	\x00\n\x00é-ƄĔŊqƙ˟¦Dƙ˟¦ĥÈ	ܡƁ÷\nƄƹ\nÚ	%	8ƁͷÔ	XےƁݚ	XƁݜħ\x00\x00	\x00\n)Ƅ࣍Ƅ¦\x00	\x00\n]۠\x00Ƈղ\x00	ëĨ\x00	\x00\n	Ƅƹ\n\n	\nƨ\nrܔĩ\x00	C	l/		ªÙ\x00	\x00\n\x00ƄS	(ſü\n\n\n&ƿƄ\x00\nƁࡼ#3Ɓԋ	\nǃƙ²Ƅ\x00\n±	\nƙ²Ƅ\x00\nƙYƄ	ģĪ\x00	\x00\n\x00\x00ƙÄƄ\x00ƇяƄѶC	y	Ƅ,	G\n	d\nƄɩƁ٧ƪƄ\naƁǊƆȇ\x00Ɓ࡬Ɓ͞;Ɓݼ	ƧƆݶáƪƄ\n\x00Ɓӂ	Ƈӣ	ɤƙYƄģÚ֥\x00Īŝ.oƙݥƄ$ī\x00	\x00\n\x00\x00\x00\rࣕ	Ŏ\x00ƄΕ	ƄVƁÆ	Ϸ\n	ƴƄĮƄˑ\nƄS\n݋ƅϾ\nآ\nƶܼÚ\nԦä\nƶÇߒ\nƄí࠳\nƄí࠹ƁԠ\nrƅ۷ä\nƶÇ\nƄíѳk\rƙYƄ\n\x00ƄˑƄإ\rƄõǉ\rĬ\x00	\x00\n\x00\x00ƄÁƁf	\nƄS(ſŝ	/\nݧ	WƁă	WƁï	WƁӃ	࢐ĭ\x00	\x00\n\x00\x00\x00\rƄS	\nƄ޹Ɓf\r(ſŝ	/	\r\nO8ƁjƁA\r\nO8Ɓ\\ƁA\r\nO8ƁUƁA\r\nƁɕ\rĮ̇8ƁjƁǲ8Ɓ\\Ɓǲ8ƁUƁAƁ͹į'ĬӤɁ0İ+\x00ƷƊڡƷƈҹ)ƙ Ƅ*ƌڹۀÛ+ǊƄӉƅ֟ǊƄâƅЎȻǑı\x00	ʴ.Ƅɏ		Ƅ,	&Ƅ\"ƿƄ\x00	थĲ\x00	\x00\nŎ\x00ƅֈ	ƙŶƄ\x00ƅ؍	*Ɓӎ\nƙŶƄ\x00ƄЙ\n-ƁƗ\n	Ǒ	Ƅݵƙ ƄƪƄ\x00	ΝĳŜĲĨ\x00ƙࢗ	ԨĴǆĵñĵ+\x00\x00	ƷƄÃƈрĂƄמ	@ƄűƄڀ		ΦƙʄƙȊƁͽō	\x00Ƅ܁ō	\x00Ƅޞľ	\x00Ľ͖ԖĽñÜJ*Ƣ̛-ƄڪƄࠥϤŋϿŹ{ǆĵ޻ľ\x00ǆࡒĶ+şƁեȻǎǎƅकǎƅǭ̝ǂƅų\rƅऎķ\x00\x00	\n\x00\x00\x00\r\x00\x00\x00\x00\x00Ƅۿ\n\nƄҊ\nƅʮĶ4\rԅ)łŝ\n\rƶ\r\rƶ\r	ŕdۓۭ\r̔\rƄ,G\rdƄ۵Ɓ׳࢜δ	ǒת\nɰ(ǉ҂Ƅ˭Ͱǚԝĸ\x00\x00	\n\x00\x00\x00\r\x00\nķ\x00\x00	\nطşƁЈ)ƙÄƄ\x00ƄףƄƁ࠙ύƇࢠ\r(ǉƙºƄ࢓\rƄ˭ľƙ˸	ђĦʟƄ࣢ࡃƙ˸	̍۟ĹʚƁߵ;ƁࡑƁУ;Ɓӓԍ0ĺĊƁࡱ;Ɓ܌Ļ\x00	\x00\nƿƄѥĹՖ		Ƅ,	G\nƿƄ\x00	Ĺ\nुĺ\nũƁՀ\nũƁܬ\nũƁ؜\nټƁќ\noƙ ƄƙºƄa	֑ļ\x00\x00	\n×*Ƅɲ*Ƅհ-ƶͳ\nĻ	\n\n*Ƅɲ\n*ƄѴĽ+\x00\x00	ģƨ	ǇÒ	6-ƄÐ	Ƅƅ-ƄÛ	ƄΆDƄŲEĤ-Ƅ˪Ɵ\rƅē6\x00PƤ3	\x00:ƅįNƅȌ)Ɔʝ8Ժľ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00	M	D\x00	E	-	6	P	3	:	N	)ƙʮ	8ſ	ƙўŌ\x00ƴ{	!Ɓޑ\nģ\nǇÒ#ä\nƨrƄÐƄƅ\nƨrƄÛƄہ-ƙýENƷƄůƄȟƾ\x00ƾƾdƾŽƙдōƾƉ٫	!Ɓɶ	Z\rƨd\r-Ƈց	!Ɓ٤	ڔļ\r\x00ƙ9	Dș	!Ɓɶ	ZŹ͏ō\x006{ƙºƄ\x006Ƅͺƙ²Ƅࡀǁ\nƙ²Ƅޕǁ6§ƾ6\r!ƾ-\rŌ\x00ƄΚƾ-\r:\rŌ\x00ƄВƾ-\r:\rƙķƾ-\rź:á	6ƨ	PƤǇrƙڄǇܗƨrƄÐ	3ƄƅƨrƄÛ	3Ƅڴ	3Ǉƙ²ƄƸҎǁ\n	:ƙãƄǁ\x00Ƹe	:Ƹ	NƅȌ	)Ɔʝ	-ƙãƄ	6\x00Ɵ\x00	P\x00ƶ\x00	3	EƙãƄ	-\x00	:\x00	N\x00	)ƙãƄ\nƅѠƶ\x00ƙãƄ	P\x00ƶ\x00	3-#ĸ	6\x00	P\x00	3ŗ	8*\x00	ī	:ĳ	:{	!Ɓࡎ\n	!ƁІ	!.ƁƯ	!࡝	!Ɓࣧ)	!ƁϕƄЄƄغƄɈ	)Ƅʹ	ĿJǎǎƅ޿ǎƅۋǟ\x00ǡǉƋhƄ؟ǡѨƆ˝ƣƄ\x00\x00	áƆՉ	\x00	ǡ	ƿƄӆ\n̢ƙºƄƋɽ	ƄयƁǙƁݮǠ\x00	\x00\n\x00رࠓǟҟƭ{Ƨ!ƇࠏƧ֊oƇāƜƄא\nѓ-ƆࢇƄ,࠱\nǠ˞ƇɵƙYƄ\n\x00ƄˌƆ࣮	l/ƬƄxƅ֙Ƅ\x00	{\nƄ\"ǟ	áƄĽǠ	օƇڠƙYƄ\n\x00ƄˌƊ׭Ǡ$ÝܯǍŭƄýǍ˷ŀ7ƵƄƱǘ$Ł\x00	(ſ	Ă	/	ŀƁޚÞǟ7RǟƁܶǟƁҜƁѵǟß\x00	\x00\n\x00Α\nN	Ƅ˶	ͥ	Ùͅ	\x00\n		\nR	ƵƄƱǘƁؠà+\x00C;Ɓ&ǗƁԫǘƄ,&ƿƄǘОǒFƁpǓƁfǔĄƁÝƁfǕƁpǖĄƁƂƁÊǗZЭ0ł\x00	\x00\n\x00\x00\x00\r\x00é-ƄĔŊq#ǘ\x00\nƄS	(ſƵƄѱ>ƁࡹƁ̈́ƄƁࡕ\n/\r\n	\rƁı\n	Ő\rƁƂƁ˙Ɓʛ\r\n	ŐƁÝƁԽ\rƁ՗	\rƁ͘\nƄ؊\r\n	\rƁı\n	Ő\rƁƂƁ˙Ɓʛ*Ƣ\n	ÔƁÝƁկƙYƄ	ģŃ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00ęҨࠐƄɏƄS	(ſƵƄ>ƁࡋƁǓ5ƁήÚ\nƿƄ\x00|ƿƄ\x00|ƿƄ\x00|\rƿƄ\x00|	ǒ\nÂǓ	ǔÂǕ	ǖÂǗ\r6\nƿƄ\x00|ƿƄ\x00|	ǒ\nÂǓ6ƿƄ\x00	ǔÂǕܸ	ńŃŇ$Ņ\x00	\x00\n\x00\x00\x00\r	ƄS\n(ſ	˃ƿƄיƁݎ\ry\r	\r/ƿƄ\x00\r^ƁԐƁह\x00^Ɓȭ`Ɓߘ^ƁԪƁΊ\x00^ƁÛ`Ɓݐ^ƁׅƁӏ\x00^Ɓއ`Ɓܰ\n:žƄŉ\n$ņ\x00	\x00\n\x00\x00'ƿƄƄΤ		Ƅи\n	\nƁӵ\n\nƁý\nƁࠩ\nƁÍƁƇ	ŤƁƆ	Ç\nƁڂ\nƁÝƁȂ	ŤƁÍƁƇ	\rƁ˱ƁƆ	Ɓ٠\nƁق\nƁښƁֿ	ŤƁÍƁȂ	\rƁ˱ƁÍƁƇ	\rƁҮƁƆ	Ɓ؋\nƁԬ\x00	Ɓ՜\nƁ؅\x00	Ɓ࠶\x00	³3Ɓѿ`Ɓ_ƄHƁЌƁܛçƁߛƁӴƄ\"Ň7ňņëň\x00\x00	\n\x00\x00Ȉ	-Ƣ\n	Ƅ̏\n(ſƞƄÁƁٶ	5ƁٸĂ/\nžƄŉƄT\x00Ɓٳ	\n\nžƄŉƄT\x00	ʲƙYƄ\nģŉ7ǀǃëŊ\x00	\x00\n	ŉ\nƄS(ſ\n\n`Ɓʈ	\n/	ƿƄ\x00	|	ƿƄ\x00	|	ƿƄ\x00	|	ƿƄ\x00	࣒\nƁʈ	\n/	ƿƄ\x00	ֆŋ7Ǐ\nǏƄ!ƣƄ\x00ǉƈ֡ƄلŌ\x007ƙºƄaƄˊō\x00	ę1߱	ƙºƄaƄжƙ Ƅ	ƀƙ Ƅ۩0á\x00Ȭ1ǬƪƄ\x00ƄƄˊâ\x00Ȭ1Ǭƙ Ƅƀƙ Ƅ$Ŏ\x00		ƙmƄ\x00	-ƁǅЅƪƄa	ƪƄ\x00	щŏ\x00		ƙmƄ\x00	-ƁǅߜƪƄa	ƪƄ\x00	הã+ǟ\x00Ǡ\x00ǡǠǡMǢǠšNԴǡǟǡƙझ	\x00ƙڧ\nR+ǥ\x00\x00	\x00\n\x00ǥyƁ&ǥƄƛ}xǥƄƛƁÊxƁϑǥƄƛƁŢxחCǥƄ,ƨ;ǥĚ)ǥƄíaޭǥƄ\"ࢌǥƄ֨	ǥƄ»Ɓ\n	4	9ǥǥƄTƁs\n\r\x00u\n\x00^ХǥͲǢ\x00\x00	)xࠪǢuš܀ʁ	Ǣ^šțΡʁ	±	xClȻĚ^Ɓ˥ĚɳĚ5Ɓȫǣ\x00	\x00\n\x00\x00\x00\r\x00	'\nƄS~\r\r\n\rG\r%Fܵ\x00ϡ^Ɓࢉ	Ƅ\"ɳ5ƁłϏƁͪ5Ɓł`Ɓࠂǁ	ƄHڽƁࢋࣝǟʲ	Ǥ\x00	\x00\n\x00\x00\x00\r\x00	'\n\x00ƄS\r~G\r،Ɓࣾ\rश\r\n\n\n^\n\nu\x00\rՄ\nxƪ	Ƅ\"\nx\nߐ		7ǣ\x00ǡ$\n7ǤǠ\x00ŖŐ\x00\x00	\n\x00\x00\x00\r\x00\n49\rƁʜƁư&\n%\nʎFƁČƁĪƁóX\r	ÔƁĎƁÜ%\r\rĜƁÜ%ʎ\nFƁČ\nƁĪƁó\nX\r	˹ƁɪƁʆƁĎƁɷƄ\"\n\x00$ő\x00ɛƳ4ǽۨŒ\x00	\x00\n\x00\x00\x00\r\x00\x00Ĭ	ƵƄƄÁƁÏ''\rƁ߮ƄĖƁÏĬŁƁłƄۆ\n\n	\n&Ƅ\"ĬƄT\n>Ɓh\n>ƁˡƁԲƄT	>Ɓբ\n\n\r\n&Ƅ\"\rƄ\"Ĭݙ\n\nƄ,\n&Őő\n\x00ƄTƄƁȉĭ$œ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	(ſƄƁÏ\nĬĬ49Ƅ׮ƁʜƁLƌIƁԵ\r\rƁࠎ\r/%ȳFƁČƁĪƁóX\r˹ƁɪƁʆƁĎƁÜ%5ĜƁÜ%ȳFƁČƁĪƁóX\rÔƁĎƁɷX\x00X\x00	\nOƁjƁA	\nOƁ\\ƁA	\nOƁUƁA	\nOĜƁA	\nOƁjƁA	\nOƁ\\ƁA	\nOƁUƁA	\nOĜƁAݩ	\nð	Ƅí\n5\x00	ä+ǟ\x00Ǡǟ̆Ǡ̆ǙRɛǟ\x00ǠƠŔ\x00\x00	\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\n\x00ƄĖƁࣃ\nƙÿqĬ\nhƄSÀƄĨƁҏ\rƁ֞&ðçࡉ-Ɓǒç-ƁԈ8ƁʺƁÕƁƁĝƁǿƁ¤ƁĝƁþƁࢺçäFƁþ8ƁÕFƁ˂ǇƁˁƁࢀ5ʍC\r\r³Ή\rƁƫ5ƁŲ;Ɓʳ\rƁƯ\r\r	ƴ8Ɓξ	ǻƁƁǕ	ɾƁ¤ƁǕ	YƁٺ\x00ªŕ\x00\x00	\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\nh	h'Ɓ¿&ÔǇƁˁƁۧC\rت\n\r\rࡨӋׁX܎FƁЍFƁࡔFƁfƁþƁϫƁş\n\r\x00\r\x00\rӷƁ¿&\nʉC\r\rƁ¿\rG\n\r\rۥ>Ɓ݉>ƁИ>Ɓɐ\r>ƁŵʕƁɐ>ƁםƁg&@\rFƁÕ8Ɓh	@FƁÕ8Ɓ͉ƁŸ&@ƄĨ		@Ƅޫσ0Ŗ\x00\x00	\x00\n\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	Ƴ4\r	\nƁ޲9ɿb	ȞƁɂ_ƄÁƁࡺƁpƁfٍ\n4\n9\nb\n_\nǯ&8Ɓą\rƁƁ[Ɓ¤Ɓ[Ɓ[\r8ƁąƁƁ[Ɓ¤Ɓ[Ɓ[I8ƁąƁƁ[Ɓ¤Ɓ[\rƁ[\rƁı8ƁąƁƁ[\rƁ¤Ɓ[Ɓ[\rƁҬƁf\x00\r\x00CƁg&	\nƁږ8ƁʺƁÕ\rƁƁĝƁǿƁ¤ƁĝƁþƁ[\x00\r\x00\r\x00\x00:ŗ\x00̇ƳࡣǽࣗɿͼۛࡤŘȦŀƁčŀƁčŀƁčŀƁҧř\x00	\x00ǟ\x00Ǡ\x00ǡ\x00	Ǚǟ	4Ǡ	׬ǟࣷǟۙŕ\x00ǟ\x00ǠqǡŔ\x00ǟ\x00Ǡ\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00	ƵƄƄÁƁޔ'\rƁԟƄĖƁǙ\nŘƝƄĨƄė\rC\nƄ,\nÚ\n\rĬü\n\n	ƌƄT\nFƁɹ\nɔƁ\nŗ\x00!\x00Ŗǡ\x00aǟüƄ,&Ƅ\"फĭ$\x00	\x00\n\x00\x00\x00\r\x00\x00\x00'Ĭ6Ƅ»ƁȶƄTƁ՞	ƄÁƁϖ\n\n	ƌ\rƄT\nFƁɹ\nɔƁŖǡ\x00\rʋǠ\nŗ\x00ơƄ,&Ƅ\"ĩ\rZĭƄ׍Ƅ»ƄM¹\n\x00±:å\x00\x00	\x00\n\x00	\x00\n\x00é-ƄĔŊqȯ	3ƁȽ\n3Ɓȑř\x00\n¹\x00	$Ś\x00\x00	\x00\n\x00	\x00\n\x00ȯ	3ƁȽ\n3Ɓȑř\x00\n±\x00	$ś\x007ŚŃ$Ŝʢ_¬@Ƅࣂt֘ʭŝ+\x00(Ŝǡׄ&zࢭ˞d¨Ƅ»ƁƟŞ։ŜࣘzܭdñşƙƲdoň$Š7ƙƲƈƋ0š7ƳňƙƲۊŢ\x00ҕ\nùX:é7XƄԎţ7XʹŤĊXWƁ©XʹťX߇ƁߨπƁЪƁѦƁÍƁ©XŏƁנƁڇƁ׵ƁïXWƁ©XŏƁ۱ƁפƁÝƁăXWƁïXWƁ©XŏƁܑƁܝXWƁăXWƁïXWƁ©X؉ŦʚXWƁăXWƁïXWƁ©X͟ŧ7ŦʗƁचŦ$Ũ\x00	ť	X\x00X:ƄT	\x00X$ê\x00	ţ	X\x00X:ŇƄT	\x00Xëũ\x00	ť	X\x00X:ŇƄT	\x00XëŪ\x00¡*Ƅ¢3ƁŃƁŌƄ\"ʁ0ū\x00¡*Ƅ¢3ƁŃƁŌƄ\"$Ŭ\x00)3ƁżƁŁŭ\x00$ŭ\x00¡*Ƅ¢3ƁڨƁϦ;ƁȭƄ\"!;ƁБƄƁƁUƁƸƁҼƄ\"Ɓʇ;Ɓ͸ƄƁƁ\\ƁƸƁίƄHƁUƁEƄ\"Ɓʇ;ƁװƄƁƁjƁƸƁûƄHƁ\\ƁEƄHƁUƁEƄ\"ƁܣƄ\"ƁȖƄHƁjƁEƄHƁ\\ƁEƄHƁUƁEƄ\"ƁߖŮ\x00¡*Ƅ¢3ƁżƁŁƄ\"ƁÏƄ\"Ɓ¸ů\x00¡*Ƅ¢3ƁżƁŁƄ\"ƁÏƄ\"Ɓ¸Ű\x00¡*Ƅ˖ùƄHƁjƁEƄHƁ\\ƁEƄHƁUƁEƄ\"Ɓ¸ű\x00	\x00\né*Ƅ¢ù	PƁ̃\nçƁ̃ƄH	ƁjƁEƄH	Ɓ\\ƁEƄH	ƁUƁEƄ\"	ƁEƄH\nƁjƁEƄH\nƁ\\ƁEƄH\nƁUƁEƄ\"\nƁ¸Ų\x00)ŊƄȮƁ܃Ū\x00ƄŹŵ\x00$ų\x00)Ŋŭ\x00ƄŹŵ\x00$Ŵ\x00)ŭ\x00ƄŹŵ\x00$ŵ\x00	\x00\nC		Ƅ,	&\n	ص\n*Ƅ¢\n\n\n3ƁŃ\nƁŌƄ\"	ǴŶ\x00\x00	¡	*Ƅ˖	ùĄ	ƁjƁAՊ	Ɓ\\ƁA\rƁࣀ	ƁUƁA\rƁҪ	Ɓӹɝ0ë)%s@ɭǞǟñǟ+Ǡ\x00ǡǠMǡſǝǜǢ+ȻݰƙÿʟƄ»ƁƟ\x00	ęӼƅƻƆū6Ń	įƄ»ƁǓƄTƁȶĦŭ	6œ\x00ǢÈňǂƅų\rƅی˺KƅݭĩǠ\x00ۡ\n¹ǣ+\x00\x00	\x00\n\x00\x00MM	Ȼआ\nlǠ/Ǡ\n4KƁƫ\n.ƁŊǸ	\n\nƮǤ\x00ǝǤ\x00ǜǡҺǤ\x00	Ŝ6	Ŀ	ƄƁɨ	Ŋ		Œ	\x00ǢÈ	ĮĦ	ضƄ˨	ƅĉƆΌł	Ӿ\nע\x00	Ř\x00\x00	\n\n3Ɓƫ\nȻϜNǠ־\x00\n\x00	Òǡ.Ɓɨǡ§ƹǣݛ	Ǡd?ѝǸȻ͎ݘŷJǞoǞ$Ÿ\x00\x00	JǞ	ࠣǞ\x00\x00	$ì\x00\x00	\nC\n\n	\n&\nĐ\nªŹ\x00	£ƌ͍ƉǜƊטƊھ		Ƅ,	ƨō\x00	ࡽźŎŎ\x00ƄĸƄԾƙŶƄ\x00Ƅ˛ƪƄaױí\x00Jo\rƄõ:î7ŎŎ\x00ƄĸƄ܆ï\x00	\x00\nƄĮƄठƄҒ		Ƅ,	G\n	dŌ\n\x00ľ\nƄ̜ƄɸðJoŎŎ\x00ƄĸƄυŻ7ŏ\x00Ƅݞñ\x007ŻŭŻ⓯0õǟ\x00\x00Ǡ\x00ǡ\x00Ǣ\x00ǣ\x00	\x00\n\x00Ǥ\x00ǥ\x00Ǧ\x00ǧ\x00Ǩ\x00ǩ\x00Ǫ\x00ǫ\x00Ǭ\x00ǭ\x00Ǯ\x00ǯ\x00ǰ\x00Ǳ\x00ǲ\x00ǳ\x00Ǵ\x00ǵ\x00ǶǟÀǠǡÀǢǣÀ	Ɓڤ\nƁտǥƁ÷ǪǷ	ǫǷ\nǬ'ǮȻţǯƉɮǰǲǳǴȻţǶMRsM}1}'N@\x007\x00,\rɭڼǨȁǩ(ȂƁĿǦšĜÈǧģ¨ƅįħƷ\x00ƅȨħƷ\x00ƅĶħƷ\x00ƅÅ	ħƷƄ˧Ɖх\nħƷƄ˧ƊǋħƷ\x00ƅØħƷ\x00ƇØ\rħǊ\x00ƈڕ)ȇ֤$)ȇɗ$	)ȇƁp$\n)ȇƁÅ$)ȇƁf$)ȇƁŷ$\r)ȇƁÊ$)Ǧ6ȉܨȃƁְȅƄґȋͭ\rJǨ-Ƣ࠮ȈǡǤ\nŵ\x00ǤȧǷȍ\x00Ȏ\x00ȏ\x00Ȑ\x00\x00	ȍ\x00ȎȏȐ'M	p\n\x00b\x00³\x00¯\r\x00\x00\x00\x00l\x00w\x00T\x00¢\x00:R\nӬȏĲȍKȎ$	ȏKȎ+ˢb˵ȐȎȎ%ȎĲȍƕ\r+ˢb˵ȏ%ȏ˔ȍěȍ\x00Ȑȏ٩ȼpͧ³ƝȐȏ\x00ȏ%ȏĲȍѩȏ5Ȏ\rȍěȍȎȏʭ	Ȏ	ȏĊĲȍĊ˔ȍěȍ7ȐƠǸ\x00\x00	\nC\n\n\n/\n	ǹ\x00JKƢ#KƢࠚоɦւ֐Ǻ\x007ƵƄìգÖ߸ࡓǻ\x007ƵƄخƵƄјǼ\x00		%°ŔµŅƵƄì°ÖµʰƵƄì°ÖµːƵƄ	˓	Ƴ	ƕƵƆɘ	$ǽ\x00	\x00\n	%°ŔµŅƵƄì°ÖµʰƵƄì°ÖµːƵƄ	˓	Ƴ	q\nƵƆɘ	ڑ\nƁǹƵک\nǉ\nǾ\x00	\x00\n\x00\x00\x00\r'	(Ȅǩ\nϬyƄ,&\r(Ȅ\nř\núƄ\"ǽ\r\x00	ŕ\n:ǿ+\x00ȍ\x00Ȏ\x00ȏ\x00Ȑ\x00ȑ\x00Ȓ\x00ȓMȍ'ȑ'Ȓ'ȓ'µ\x00a	\x00v\n\x00¼\x00q\x00¶\r\x00¸\x00\x00{\x00 \x00:R\x00	ȎȐȏȒ'ȓ'ȍ'ȑ	l<	.w<	T	ۜ	.l࣓ȍȎǻ	Ȏ³ȓƄ\"	ࠆǹ	ۼȑȐǺ	ȑȐƖƁێȏȑȐȐࠍ	ȒƄ\"Ŗ	Ȧȏ\x00Ȑª\n\x00	\x00\n\x00\x00ƁÊ	'\nǸ	\x00ٝȐ/ȑ;ƁÆ	߫;ƁɈ	ؙ;Ĝļ	ܐ;ġļ	ߺ;Ɓِ	ؖ	ࢎ/	ܩ\nϝ\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ƁɊ	\nM\r¾Ȏo	ĂȎ߰''\nडȎچ)ȍIȍdފ3ƁۗׇࢃƁߚ5\x00Ĩ\x00ɝȡ\nÇ̈\x00ٔƁػ˄࠻&ԼĨ\x00ɝȡÇ̈Cl/˲ƄƁԢउ\n3\n\r\r\n\x00	Ƶƅ¯\r\x00	;	\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00§\rſ¾ȒƄƁࢽȓƄࣚ۩ȓƄĈG	ȓ\nȓڦǹ	\x00\nșӘ	̯\n̷%	\nŅ	\nҩƁÐƁЀƁєƁڬƁ߲Ɓߴ3Ɓ̟ƁӸ	\nϸƁ̡ƁߗƄ\"ӯƄƁϽƅ΃Ƈҿ~Ƅ,&PƄS~Ƅ,&ƵƄʓԔPƄ۸%PƄėʙƁp3ƁࢼŪ\rф\r࠿\x00ۂƁࠦ\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00Ɓ̚	§\n§§ԕȒƄ)\rÀ~yȒƄĈ&ȒȒIѷř	.6\r3ƁÆ\n	N	!ӥө.6\r3ƁÆN!3ƁŊ\n.	6\n	\x00\rӦ3ƁŊ.6\x00\rΧ\r\x00ȒƄƁϩ+\x00\x00	\x00\x00\x00\r'	¾ȒƄݓƁࡶ\x00Ƅ̥\n\x00J53Ɓۖ53Ɓ݃ƁࠃǾȒ\n4࣋ƁLƄ,&\r\nݳ*\r6	3ƁɎࣳ	К	\rȐ\x00Ƅѣ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00	Ɓֺ\nȒ\x00Ƴ	>ƄכƢ\x00¾ƁݑƄĈ^Ƅ՚/(Ȅӊؘї٬.Ƣ6Ǽ\x00\x00Ƶƅ¯\x00͜5մߞƁٯƈ܍\x00\x00	\n\n՟.ǟ࢟Ҵ	ƄʏǹlÈ	{\n͋\n+\x00\x00	\x00\n\x00\x00\x00\r\x00\x00Ȓ4(Ȅǩ	Ƣ\x00\n~\ry\rȒƄĈ\r&Ȓ\rǻ\x00ࡩ(Ȅřú\nǽ\x00	*Ƣ\n*	\nɠ	\n\x00ܘ\x00ª\x00	\x00\n\x00\x00\x00\r\x00	\nχǶ\nǶ(ȄȒࢫȒߢǶh\nǶhǶ\x00ȒƄƹ\r\r\r&Ȓ\r	ĵǶƊ\nĵǶúǺ\x00ǶhȐ	\x00\n\x00\x00ƠȀ+\x00ȍ\x00Ȏ\x00ȏMȍ'Ȏȏµ\x00a	\x00Ã\n\x00:R\x00	Ȏȏ~l<.w<TƘ		ƄQƁܞ	ƄQƁࠨȍȎ	\x00Ȏɖ	ƄQƁɎȏप		ȏ\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00Ɓ̤	ƁȔ\nɑ'\r¾Ȏ҇Ȏ/ȍƄQƁά\nƪƄࣿ\nƄ˿ɖ\nơ/Ɩ\n\rΰ\r\x00	\x00\n\x00	΋\n\nȎ\nJ\n)ȍ\ndƄQƁҤƄQƁϮƄ׫Ƅࠌ	Ҳȍ\nɤ	ȁ+\x00ȍ\x00Ȏ\x00ȏ\x00ȐMȍǿȎȀȏȐƇе:R\x00\x00	\n\x00\x00\x00\r\nݗKǠ֕lȍ/ȍƅŗȍcǪ\x00\x00	*Ƣ6\n\x00ȏȒǪ؛lȎ/Ȏƅŗ\rȎcǫ\r*Ƣ6\n\r\x00ȐȒǫԂ\nȂ\x00ȍ\x00Ȏ\x00ȏMȍȎǷȏǷÂ	\x00°\n\x00¾\x00:R	\x00\x00	JӿKǠ6Ȏ	ȍÇȏ	Ѣñ\n\x00JKƢo:7Ƴ>ƁķƁϲ+\x00\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00!\x00\"\x00#\x00$\x00%\x00&\x00'\x00(\x00)\x00*\x00+	\n\rǥ\x00 ǥ\x00!Ȏ\"ȏö!ȏ#Ȏl<#.Ȏw<#ȎT#Ƙ$Ȏ#%$a\x00	%4%9Ƶƅ¯$v\x00Ƶƅ¯$¼\x00$q.Ƣ6&$q\x00&Ю&9&4\nɠƁ̋PƁ̋Pژ'$¸\x00'4'9($ \x00(4(9)$\x00)4)9)b)_\rƵƅ¯$\x00\r${.Ƣ\nKǥ\n${${ƮǁƵƄP>ƁɟǁƵƄP>Ɓɟ3ƁۅPʘƁٰƁȢPʘġࣙė%5ƁҫƁǜƵƄî>ƁĿƵƄî>ƁĿƵƄî>Ɓ߭¾\"ȏ#ȏl<#.ȏw<#ȏT#Ƙ*ȏ#\n*a\x00*Ã\x00*.Ƣ\n -ǥ\n *  *ƮKǥ\nŪ Kǥ\n Ū#Ǥ'+\n+ϵ \n+wƁࣈŪǤ\x00+ůǤ\x00ƵƄî	ŕůǤ\x00ůǤ\x00ȍůǤ\x00ůǤ\x00ůǤ\x00ůǤ\x00ůǤ\x00ůǤ\x00\růǤ\x00\nůǤ\x00ūǤ\x00ŰǤ\x00ɅŰǤ\x00ɅŰǤ\x00κȃ\x00\x00	փƄࢰࡌƇϴƇ࢛Ƅः	ߝƄϪƄӝƅۦƅԤƅՆƅ࡟Ȅ\x00ܱࣅȅ7ȻǴȆࢊƄ۫ȇ\x00		(ȃ\x00\x00ȅƄμǦ\nȉ	۾Ȇ	қǵKǠ\nȈǠqǫ	ǵǡ\x00ǫpļȈǡ̶ǳऩ	ƄʞǪ	!	Ƅ࢏ȈǠ\x00ǟ\x00		ƅȪǢ\nǳƁԛǲǳƁ́	ƄQƁͤǱ	\x00ǳल	ƄQƁ֏ǹǱ\x00	{ȈǠqǳӁ	ƄQƁÆǳ	Ƅʏ	ƅȪǣ6ǳƁÅǲъ	Ƅʞǲӛǲǲ^ƁÆǳϢǵǠȈ\x00\x00	\n\x00\x00£ƉfƇऔKǠ\nǪ̓ǫӡ\nǨƇ¯\x00\x00	ǩÂ\x00\x00\n߃ȉ'Ƅ\"ƄМƄωƄ\"ƊƄ\"֠Ƅ\"ƊƄ\"úƄ\"ƅֹƄ\"ƄޅƄ\"ƄܾǬƄ\"ƙYƄԧǬƄθȻǮ^Ɓѽȋ˷Ȋ+\x00\x00	£\x00\x00\r\x00£şƁϱ		Ƅ,	҈		ڞ\n)	۽ƙYƄ\x00ƄषłŞЩ+×ǊƆҸǊƆƽƈիǊƉʾƁզƙYƄͱ	ƵƄ࠭\rࡷƲ¨Ƅǌ	ǊƄԶǊƄâƅ͚ǊƄâƅߠȋ+Пǭ\nǭȊƝǰ³Ƅ\"ǭƄ\"ǰƄ\"ǧƄ˨ǬǬ'ǮȻţȌƙYƄڵȌɑǊƄ״(ǊƄތǊƄַ(ǊƄֲƇګƪƄˋƈȔǯߡƅպֻż+ǟ\x00Ǡǟ'Ǡࣔ\x00VŘܫǠ׃ǟǠª)ԥǟǠŽǟ\x00ǠǡǡǟݯX\x00·Ǣ\x00\x00r	\x00\nŘǢ	ǟƼǠކ	Ǡ+\x00Ǣöڗǟ̊Ǡ\x00Ǡ:	+¬öoۈƧϼ\n\x00	ǟ\x00ǡċǠ	Ǡǡ	&	ǢǢû\x00ǟ\x00Ǡ\x00ǡ\x00Ǣ\x00ǣ\x00Ǥ\x00ǥ\x00Ǧ(Ʋ࡙	Ǥ̞\x00Ǧǥ\x00\n	\x00	\x00Ǩ\x00ǩ\x00\n	Mϻ	¤޽Υ	¤ࡆǥŽ\x00Ǩǥ·\x00ǩǥ\x00\nǩ\x00	´ǟ\x00	§ǡ\x00	Ǡ\x00	½ǥrݏǥrÈ	¨Ǩ	ÉǨ	IǪǢ	RǪ+\x00\x00	\x00\n\x00M2ǨǨCǩ	Ǩ\n(ſ	֝	&\nˤǪ<	Ǩ(ſ	ü	&Ǫ<O\n\x00:ǧ\x00Jשܹधҳࡠ4έӰ49ϣ࢞49b΀޴49b_Ӛԣ49b_h̐ش49b_hpڿࠉ49b_hpÞĕ\n\x00Ǩ\x00ǩ\x00	\x00\n\x00Ǫ\x00\x00\x00\r\x00ǫ\x00\x00I\x00Ǩ´\x00ǩ\x00	§\x00\n½\x00Ǫżǡ	&Ǭ	ˎ\rި	ǉۚ\r̊\r͢ǫ(ſ2ǫȜǊ\x00ǫ¨Ǌ\x00ǫÉǤ\x00\n'Ճ߷įɼǫ\x00ϟǫOCɢ&ǫǮCǦCǯaCċC&ǬǴǬ)Čݹǭܧǭ\x00	\x00\nƏ			&\nƼ	\n࢔	ٙ\nࣶ	ݣ\n̼	ࢴĥǮǱ\x00ǲ7R+\x00\x00	\x00\n\x00\x00×ǱʖǪǪńǲ9¼ǲͦ'(ſǱ2ńǲ̩¼ǲٻˎ	ǱOC\nɢ\n	\n&\nǮ	\nوɼ\x00ܽڈǱCटǱCǦǱCqǯǱaǱCċhpǱ6ǪVǪVʫ۝ǯ\x00\x00	\x00\nǱ\x00\x00ǲ\x00ǳ\x00\x00Ǵ\x00\r\x00ǵ\x00Ƕ\x00Ƿ\x00Ǹ\x00ǹ\x00Ǻ\x00ǻ\x00ǵC\x00Ƕ\nbǷ\n_Ǹ\n4ǹ\n9ǺǪǻ~ǱǱ	ǱGǵǱdړछӇऱǺǻǺǻࠠ\x00Ǻǻ!֩ǺǻԓऽǺǻ֬ǵǱǫǳǵǱǩǳǵǱ\x00Ǻǻ!ڢ܋ǺǻǶǵǱƑݫǺǻ\rǵǱȱǱ\r!ࠧǺǻǺǻӄ]ǴǵǱǺǻǷǴ@ǵǱʻӖˉǵǱòǳǢǵǱǵǱǳ\x00ǲǺǻeȘǳǵǱǲǤ!ѡǺǻԡǺǻǸǵǱƑι\rǵǱǱ`\r!ۉǻĬǻ\x00ǺǻǲǳcǺǺōΪǺǻǲǳ]ǻĬǻ\x00ǲǲǳǲǺǺōېގߣǺǻڐࡖǲǳࢶǱǳǵǱǲǸ]ǻĬǻ\x00ǲǳcǺǺō΄ऌ\nεǱ	!؀ǴǵǱǺǻǹǴ@ǵǱʻࣼǳǺǻǲǺǻÉǺǻǲǳए!Ւ˽ǳǵǱǲǫ!ׯǻÙǻ\x00ǲǲǳǲǺŞऊǺǻǺǻʓ\x00Ǻǻ]ǺǻǲǳʧखǲǲǳǺǻǲ˳؏ǺǻǺǻʑ\x00Ǻǻ!࠯ǻÙǻ\x00ǲǳcǺσǺǻǺǻɴ\x00Ǻǻ!֎ދجǺǻǲǺǻðǲ ±Ըǻćǻ\x00ǲǲǳǲǺǺIǺő˒ǳǵǱǲǶ]Ǻǻ\n࢕\nÑ\x00Ǳ	!ңߟǺǻǤǵǱƑԩǻÙǻ\x00ǺǻǲǳcǺŞࠁǺǻǵǱƒǺǻǺǻʕ\x00Ǻǻ!݅ࡻǻÙǻ\x00ǲǲǳǺǻǲǺŞթǳǵǱǺǻǮǳ\n±ࢯǺǻǲǳΛ]׾ǺǻǺǻ!ࡰǵǱǫǳǵǱǨǳǵǱ\x00Ǻǻ!չǺǻǺǻƖ\x00Ǻǻ!࡭ǺǻǲǺǻðǲǨǵǱʃ]ǰ\x00ǵǱǵǱ\rǵǱǵǱǱЗǶ\x00\n\n࢈Ǳ	Ǳ\r!ٓࡿǺǻǺǻʔ\x00Ǻǻ!ҵǳǵǱǺǻÒ6Ǳǳȥǻ͠ަǳǵǱǺǻ6Ǳǳȥǻν\rǵǱǱ\r!͂޷ǺǻǺǻ˰\x00Ǻǻ!ҙǲǲǳǲ˳ࣺǺǻǫǵǱسǺǻǺǻ֧\x00Ǻǻ!эࣇǺǻǲǺǻðǲǢǵǱʃ!ҢǵǱʨǳǢǵǱǵǱǳ\x00ǺǻǺǻǳeʶǴǵǱǳǵǱǲǷǴÉǺǻǺǻr\x00Ǻǻ!ۤǺǻǺǻŽ\x00Ǻǻ!ϒ\rǵǱǺĠǻ5\r\x00ǻǻ`\r\x00Ǻǻǧǲǳ±۞ǻĬǻ\x00ǲǲǳǺǻǲǺǺаǺǻǲǺǻǺǻǲن࠲Ӎۢǻʽǻ\x00ǺǻǲǳcǺǺIǺ¥ǺƐǺأϋǳǵǱǺǻǳe۶ǻğǻ\x00ǲǲǳǲǺǺIǺ¥Ǻ̑ǺǻǺǻǏ\x00Ǻǻ!؇ەǺǻǺǻؾ\x00Ǻǻ!ςǳǵǱǺǻǺǻǳeء\rǵǱǺĠǻ5\r\x00ǻǻ`\r\x00ǧǲǳڍǳǵǱǺǻÒ\nǱǳܷ܅زǻğǻ\x00ǲǲǳǺǻǲǺǺIǺ¥ǺʥबǵǱʨǳǨǵǱǵǱǳ\x00ǺǻǺǻǳeظǴǵǱǳǵǱǲǹǴÉǺǻǳǵǱǲǣǳ\rǲ\rKƢ\n\rǵǱृǱ\x00Ǳ\r!اǺǻǺǻʍ\x00Ǻǻ!सǺǻǺǻҶ!ؑǻğǻ\x00ǺǻǲǳcǺǺIǺ¥ǺʥǺǻߋࣣΓѪǺǻǲǳڅ!ݱǺǻǲǳࢵ!љǺǻǺǻܪ\x00Ǻǻ]ǻğǻ\x00ǲǳcǺǺIǺ¥ǺԯդϹǺǻǺǻ࡫\x00Ǻǻ!ݷǳǵǱǳeшǲǳʧǺǻǲǳحࣜГǻʽǻ\x00ǲǲǳǺǻǲǺǺIǺ¥ǺƐǺԮժǺǻǺǻ˲\x00Ǻǻғࠑ\rǵǱǺǻǱ֮Ǵl)ǲǳǴ\x00ǯ\x00Ǳ\x00Ǳ\r\r\x00\n\nͮǱ	͡Ǳ\rЛǺǻǺǻÂ\x00ǺǻȆʸǻ\x00ǲǺ\x00ǳǻ!ٮ\rǵǱǻ`\r\x00ǺĠǻ\x00ǻ\r\rǲǳұǲ\x00±߹΅ǲǳƒǻćǻ\x00ǺǻǲǳcǺǺIǺܙѐࣵَǲǳࠤ̳ͣ݇ǺǻǺǻ]ǺǻǺǻך\x00ǺǻȆսԌǳǵǱǺǻǳe߽ǺǻǲǳĐ!ӺǺǻǺǻؽ\x00Ǻǻ]ǻćǻ\x00ǲǲǳǺǻǲǺǺIǺőङޟǲǳࡾˇǳǵǱǲǺǻeࠔǵǱòǳǨǵǱǵǱǳ\x00ǲǺǻÉǻćǻ\x00ǲǳcǺǺIǺőӀǵǱƒǺǻǲǳ\x00ǺǻǪVǺ+ǵǱЂˉǵǱòǳǢǵǱǵǱǳ\x00ǲǺǻeȘǳǵǱǲǤ!ǱǳǵǱǲǸ]ǳǺǻǲǺǻeڝ˽ǳǵǱǲǫ!˒ǳǵǱǲǶ!ʶǴǵǱǳǵǱǲǷǴÉǴǵǱǳǵǱǲǹǴeʸǻ\x00ǲǺ\x00ǳǻ!ˇǳǵǱǲǺǻÉǵǱòǳǨǵǱǵǱǳ\x00ǲǺǻ݈ǰ\x00\x00	\x00\n\x00\x00\x00\r\x00\x00\n`	\x00	`Ŝǯ\x00\x00\x00å)\r\x00ǯ\x00\x00\r	\x00ܜphࣹ	\x00ǯ\x00\x00\r\n\x00ࠊˠ\x00Ñޣüʢzħdħ@£Ɓ͇ƁӟƁבƁҌƁߙx£ƁՕƁࠟƁޏƁԷZ	R\x00	é-ƄĔŊơƄ,ЖtƄ\"ĩ	¬tħƄ˶	ƄɩƁʌZĬ	ƄʦƁࣲ+\x00\x00	\x00\n\x00\x00\x00\r	¬t\x00\n¬_\x00Ƅʱ	Ƅ\"Ɓँ	ƄėƁǹƁgƁࢄ&	Ƅऋ	ǏƁʌZĬ	ƄʦƁك	Ĭ		Ƅ\"ƵƄށ>Ɓ߼Ɓࡦ	Ƅٚ>Ɓ֦Z	\nƄS(ſ>ƁࣖÚ\r\nO\r8ƁjƁAO\r8Ɓ\\ƁAO\r8ƁUƁA\rƁɕ	\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00ƄĨ¬_\x00ƄŢ\n49b\r_ǯ;Ɓࠒ&^Ɓӽ5Ɓɂ5Ɓࣞ5Ɓܻ5ƁܳĄ࣏8Ɓ࠘%\nFƁԜ\n8ƁԚ;Ɓӫ%ࢢ\r!;Ɓ࣑XX\r;Ɓئ%̌\ř\r!;ƁԄXX\rN	%\r\r\rњxƵcPƁޝ\r\x00\r\x00%FƁՐ8Ɓ\n\x00\n	Ϟࢁ\nđߧȹđܟɽđψ׉\rđ݀ˡܤýǟǠ\x00ǡ\x00Ǣ\x00ǣ\x00Ǥ\x00ǥ\x00Ǧ\x00׀ǠǟƅݦǡǟƄअǢǟƅࢩǣǟƉ˿ǤǟƆ֣ǥǟƅǤǟƍڏǟƍλǟƉѮiǦ٨Ɓٗǟƅ۬ǟϚǯƆǦǡ*Ƣ\nǟƄ̀ࡲ	iħǟ\x00ƍЇǛ\nR\nȼÄ#Ǧħज\nƄxƄू\x00\nƄxƅы\rRǧǲ\x00ǳ\x00Ǵ\x00ǵ\x00Ƕ\x00Ƿ\x00\x00	\x00\n\x00\x00ǷࣉǵǵȈǵäǷ©Ǩǲ\x00ǳǷǩǲ\x00ǳǷÀǪǲ\x00ǳǷÁǫǲ\x00ǳǷ¥Ǭǲ\x00ǳǭƄǷ\x00ǲ\x00ǳʫǳ*Ƣࡴ?ǥ?Ƿ-Ƣ#Ƿ࣐ǵәǷÄƋܲƹ\r\x00ƁүǷ\x00	'\nǷ˄l/ࢸָɴƢ\n	ʉ	לƢȞ	Ҟl	/	ʑ\n6\n	҃*Ƣ?Ƕ-Ƣ#ǶҗǷƅĘǲ\x00ंǴ-ƄýǴ\x00ȧ\rǧƄǷ\x00ǲ\x00ǳ\x00Ǵ\x00ǵ\x00ǶŖǨ\x00ࡏ*Ƣ/ǡǮǡ\x00\x00Ɖǯ\x00ǡå	¹ǩ\x00JǤǨ*Ƣ/Ǥƅĉ\x00ƉǤƅƻå	¹Ǫ\x00	×ǣɰ	ǰö*Ƣ/ǣ	@࡞ǣ	@ǚ\n¹ǫ\x00JǢǨ*Ƣ/Ǣƅĉ\x00ƉǢƅƻå	¹Ǭ\x00	ęƙ܏	ǱƄࠢƄ׈	Ɔߕ	ƄŎƇؔƇӈ*Ƣʖ	Ƅ٦\x00	Ƌࣽࣦ	ƅÌ	Ƅű̍\n¹ǭǲ\x00ǳǴ\x00\x00Ǵηǥ6ÀǥƄˋƄØƄݪ\n\x00Ƈࢣ\x00ǳ*Ƣ\nƅňƅň\rγ	ʠ\nʠ\x00	ƄŬƄē	ƊघƄ׎Ƅࡡ\x00	\x00\n\x00ƄŬƄēƆâƅȄƄӢ	ƇˈƄԏƍމ\n	ƆǶƄƦ\nƉ׊ǲߥǳСƅǌ\r\x00	\x00\n\x00ǵƄŬƄۮƆâƅȄƄࠕǴƢț	ƇˈƄ߻\n	ƆǶƄƦǵ\nƄÌǲǵƅňƅܥ)ǵƄؐƢ\nǴƢǴǵƄگƈ݁Ǯ\x00\x00	\n\x00\x00\x00\r	ǟƆĉ	ƙmƄ\x00Ƅè\rƄҖƁƗƙmƄ\x00\rƄ֪\nƙmƄ\x00Ƅè\rƄȖ\n-ƁǄ\nƙmƄ\x00\rƄؚƙmƄ\x00ƄƢ\nऑ\rƪƄa\n*ƁǄ\r\rƪƄ\x00Ǫ\n܊Ƅè\rƄƚ	\r\rƄè\rƄƚ	:ӻ\rƄè\rƄƚ	ǯ\x00	\x00\n\x00\x00ʴ*Ƅ࡚	\rƄʣƙÄƄ\x00ǉƉ̮\n\nƄ,\nG\nىƙ²ƄҥǄƄʋƄ׼ƙmƄ\x00	ՔǟƈTǄƄ\x00	ƄSƄݕǰ	ƣƄǟƄİƅēǉƋࢹǱ\x00\x00	\n*ƢǠƄŋ{\nǠƄŋ!\nǠƄů\nƄŎƅࢪƅب\nƄŎƋнƈі\n\nƄ߳q	\nǠƄҔƄ۳\nƕ\nǡǮǡ\x00ƆǦǟƄΔǟƄ̀ǡ\x00\x00	\x00\n)ǧƄɣ\x00Ƣ\x00\x00Ƣ\x00	\x00\n$\r\x00)ǧƄɣ\x00\x00Ƣްø	ǘƙÄƄƉΖƙ֋ưǊƆ׹ĈÿBǇĈƜ#ƙƋĈƪ?ƴDƙЬƽ2ĈưDƙȸƝƙ¿ǃƄLĈƙ̪ƙڶƝƻƙġČƅ࣭ǄƄžݿſܖǇ޼ą£ƁƭƁـƁÞƁʐć̅ĈƧBƙ׋à<ǐƳĈ%ǅDƸ#ƙ࣡ƙĦĈƝ#ĂĈ\nćďĈƶ1ơĈƤ#ƙLĈǄ#ǉĈǉtƣ#ƙѭƽĈƠ#ƤĈƧzơDă#ƙ̾Ƶ࣊ƞƵƄѰĈƙǟƟƻƄāĈАƠ?ƙɧĀĢƾĎĴĈƱƣŜƄ͝ü<ƳٷĈƷ1ƙŠĈ%ƱDƙǟƙѼƙv\rǒ'Ǔ'ǔ'Ǖ'ǖ'ǗËƨ̬ƀžݴĈƨƼzǁƨ2ĈƙʪǈĂƙvǚËĄǊƄִǎǊƋįǏƺƍƷƚËčĴă۪þƄßƙʷƺƄ֖ĈǄƪĈ\nćढƙġƟþƵƄՅƙԊƁ®ɳƙ Ƈ\x00ƈ\x00ƅ\x00Ɔ\x00ş\x00Ƌ\x00Ɗ\x00ƌ\x00Ƅ\x00Ɓ\x00Ƣ\x00Ǌ\x00Ʒ\x00š\x00Ɖ\x00ǉ\x00Ʋ\x00ƍ\x00ā\x00Ħ\x00ŷ\x00ę\x00Õ\x00Ÿ\x00ħ\x00Ƶ\x00Ū\x00ƹ\x00Ű\x00ð\x00ŵ\x00ģ\x00Ũ\x00Ą\x00Ō\x00Ò\x00Ƭ\x00Ó\x00Ţ\x00Ş\x00ǂ\x00ă\x00í\x004\x00Ô\x00¹\x00Ƴ\x00¥\x00\x00Ü\x00Ų\x00ł\x00Û\x00è\x00ō\x00Ŧ\x00Ŵ\x00ǈ\x00î\x00ǎ\x00\x00ţ\x00Ù\x00L\x00Ś\x00Þ\x00ì\x00ų\x00\x00Ń\x00×\x00å\x00â\x00Ö\x00q\x00Ý\x00ġ\x00Ĥ\x00ñ\x00ŏ\x00C\x00i\x00\x00\x00\x00ī\x00À\x00ū\x00\x00Ú\x00\x00ǃ\x00÷\x00R\x00\x00Ů\x00O\x00b\x00Ė\x00ė\x00Ä\x00\x00\x00w\x00¶\x00S\x00X\x00U\x00D\x00¸\x00Í\x00·\x00ķ\x00ø\x00ŉ\x00æ\x00é\x00ĭ\x00Š\x00ê\x00ó\x00ë\x00\x00@\x00I\x00Ø\x00ņ\x00ç\x00õ\x00ù\x00ô\x00ß\x00ï\x007\x00á\x00Ʊ\x00Ĭ\x00Į\x00ú\x00\x00\x00ö\x00ò\x00¯\x00y\x00\x00µ\x00Ð\x003\x00Ì\x00\x00\x00f\x00P\x00Ê\x00>\x00¿\x00o\x00Ñ\x00J\x00\x00r\x00\x00)\x00¼\x00¬\x00&\x00®\x00(\x00\x00«\x00\x00\x00\x00§\x00a\x00<\x00s\x00!\x00Ç\x00\x00\x00T\x00,\x00	\x00\x00\x00p\x00¦\x00\x00c\x00\x00F\x00W\x008\x00»\x00~\x00Î\x00³\x00Ã\x00_\x00\x00v\x00£\x00ē\x00m\x00-\x00g\x00¤\x00È\x00\"\x00´\x00|\x00Æ\x00\x00 \x00^\x00­\x00Ï\x00\\\x00x\x00±\x00Ĝ\x00+\x00`\x00=\x00\x00Ë\x00¢\x00\x00E\x00t\x00Y\x00K\x00\x00'\x00\x00\x00V\x00\x00?\x00\x00N\x00[\x00B\x006\x00j\x005\x00\x00l\x00 \x00\n\x00\x00/\x00A\x00\x00Q\x00\x009\x00º\x00{\x00\x00]\x00\x00¾\x00H\x00M\x00²\x00¡\x00*\x00\x00\x00}\x00h\x00\x00\x00¨\x00d\x00$\x00ª\x00\x00©\x00u\x00°\x002\x00n\x00\x00ſ\x00É\x00z\x00\x00;\x00#\x00Â\x00\x00\x00Z\x00\r\x00\x00Ę\x00½\x00Å\x00\x001\x000\x00e\x00.\x00G\x00:\x00Á\x00%\x00kǍǊƇ࢑ƟƄƞƸƄāƣƺƅŒǇƄŠƙϙƙӌǊƆƺƙśƸƙʤƄßĈ\nć´Ĉƿ#ƙƙËĈ%ƲDƙՋƴƶĈƩBƙӶĈƙ׷ƫ?āƼ2ƸէĈƪƤĐĴĈƾtƛƯƙ̘ƙ¼ƄƙɻƺƄЧĈƸ?ƙҐƣƙĦĈƧ؝ĈƾDƛƠĢƙä<ĈƞtƙݍƹƳ2	ƙ¼ſƄxƄЦƹǊƈۃĈƧƱƙޖƫĢƙĈƨǉþƷƟČƅࢬƙͻĈƸBƜćɯƙȷƺƄࣰƙۄȻ̎ƙ࡯ƁĆĈ\nć߿Ƥߊć׿ƺƧƄŒƙÑČƅȰĈǊ#ǂƙȅƙނĈ%ā?ƼǅǉĈƻ#ƠĈƧưĈǁ1ƤƙʷƄÎĀƺƄࢲĈǋ1ƪƴΣƸƄĹćʼĈ%ƪDƝƭƃƞĈƵBƼĈ%ƽƱƝBƫêƛǄƺƈगĈ%ƣƱƵ1ǉêƾÿƄĹƙġČƅࠈȻ­ďĴĈƯ#ƙÎĈ\nćņƬٲƲƄLƲǄƙÑČƅ֓ƭǊƍŒĈơ#ƙӗ	ƙܠƁतƁ4ƁݠĈǀƥƩ?ƷBƙهƙ¼ČƅɫĈ%Ātǅ#ƥƙ̿ĈǅzƙֱƙΘƬ2ƷǊƅ٪Ĉā#ƝĈ\nćàĈă1ǋĈƙ؈ƙΒƟƬ2ƲƄˀĂƺƅȋĈƹƲƙśČƅźĈƱzƙϔĀêơĈƻDƛtƹ#Ʈ2Ĉƺ#ǊĈƤ?Ǌtǉ#ƙޥǉǊƉܴƙȜƷƄ۹ƮƄưƙȩƄvāࢂ\rûॅƂ\x00Ɓ\x00ƃ\x00ǌճƙ	ƙвǎǎƅΩĈƙ΂ÿǃߌƙɻƄĦĈƙيǆ?ă#ǋ2ĈƙʪƶƶۇƙŴǁƙġƺƇɃĈƙɧƤǂǊƅऴƙ¼ČƅƜƤČƅƜĈƙࣤăĀBƙǛÿƄ«Ĉƙߏƫƙ׌ǊƇ࣎Ĉ%ƶtƠ#ƫƼĈǈ1ƴǊсƟ܇ƼǊƅޮǀ߯ĈƧ#ƙׂƙśƺƋվã<ƴƧĈ\nćˍƙࠞƙÑƺƄ࢝ƙٽƺƌՑƧǈ	ÿſƄxƄܮƙĻƽ·ǆɓƙȩƵƋڷćīưČƅƜĈĀ1ƶĈƙ࠼ƙĈƙȸƳƙŴƷƄדƬƠĈ\nćŰǀƄƞƙŴƄǍƱƵƄɚĈƙڜƿǈǊƄƺĈþǋǋƵƄीơǊƋћƙǰČƅ԰Ĉƙ࡜ƤĈƙըƙࡢƿ1Ɯ2ƲञƿƺƆЃĈƬǁƙϳƵƄʐĈǉ1ǄĈƜBĂĈƟ#ƙݸ	ǅǊƅࣟƄƺĈƹBƨƾ̰ĈƤƾƙݻƙީƙʤƺƄْƮǊƆؒƠËĈƩDƟ#ƙࡇǅǁџƙȷǉƙȅƷƄȋƙǰǊƅƵĈƺ?ƳDƮ#ƙǛ	ƜƬƄxƄǀĈƮtƙҀƷ#ƫ2ƙĻƼýǊ2Ĉư?ƙӐơǂ2ȻڛĈă1Ǌ	ƙ͌āƄxƄǀĈƙعƙ࣫ƲBƮ2ƙխƚƪƺƄǠĈƙΠǃ?ƭ#ư2ĈǈtƸBƟĢƠƙĻƵƈɱƙˠƄƋĈƙ«! \"#ȻȾ$%ȶȷȸȹȺȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵD		į\nĳſǃ\rǄº»ßȕaȖeȗhȘēșĚȚĞțļȜĿȝƴȞƷȟƹƻ8ȠƎȡƖ¤ŢţltvÿŬǬ®Þ1hJL?:z%ji53\"O4£¦>Ym{8/c2\x00@}(- #=F¬XqXX¨	¡,VMW¢k©!l)UR\r enyw\\~G`\nNBas97E_|^d'AHoZ¤.g6ª«+TPfvkSK­	0xkk!D]QkpIk!&kt[;$u<rb*¥	C§\x00®\"ǅDƙޱƨ1ǂ2\"ǂƾzƮ#Ƹ2ƍƏĦ՘ƁऀƁԁƁǥƖə\"ƚ \r\"\n!àƚ Ȗƚ ȜƒǍ\"ƾ1ƙßȵɓƚ ·\rȢȣȤȥȦȧƚ 	ǊƅࢨƄळȶRsMƁf1}'N@\x007\x00,ȻˬǊ\"ǊƄρȯȰȱƵƄऍƚ ȡ\"Ʒ1ƮȴȾ­ƚ ƁL\"ƙ۴ƨ=ƊƋ	\"Ƅ,ՍMƁ91ƁˮƁf'N,ɁƄưƠƄ\"Ƽȶ\x00ȷ2ƚ ­ȶRsMƁɊ1}'N@\x00,\r\"\n!Ѻƙݾ@<!ɯǌƦ=ǐǊƅ࢘Ģ؆\x00ƉLƌƬƈvȻࡘƚ ȝǐȻƚ țËȶRsMƁǋ1}'N@\x00,ȣȤȥ\"%ƤƮǉêƙƬƓƞƂđȶƚ ƚ ȘȢǊƄʂƄxƅʒ\"%ƚƾƙ̸ưƚ Ȟ\"\n!чƚ ƚ \r\"Ǌƌ͈Ƣ#ƄनǊƃđźƙńȻࠗƁđȶ\"\n!пƚ ȗƋ¿\"\n!Վ\"ǊƄɃȬȭȮǜƅֳƅӳǜƆډƅʀǜƉ׽ƅ̴)ǜƢZ\"\n!Έ	ȨȩȪȫ	ȶ%s@ǚȶ=ƙࣨƔˀƚ Ȳƚ \"\n!ďƚ ƚ ȟƚ ȕƚ ș\"ƙгƸձƁpƁÅƁfƁŷƁÊƁۻƚ Ƞƚ ȻࢾƙЊȻࠜȁƆßƅ«\"\n!´=ǚȶƗāƚ ƚ =ƁĆŠƁ̄ȶRsMƁÊ1}'N@\x007\x00,ƚ ȚࡂƲ¨Ƅ˘ȶRsMƁh1}'N@\x007\x00,\"ǜƚ ƁÅƷƄůƄͩƄÃƅڳƚ 	ÓƂރ ƂĠ\x00࢖Ƙƚ ƚ ȢҽMƁ9?Ɂƚ \n\r=ǊƄŀƄऺƲ¨ƄࡅƁφ	=ƙ͒ƄǊ\x00ȶÓ³GȶĐȷƈƎĹÓƁGƁ̒Ɓ͗\"3Ɓgƙ޶ȶƄ,\"%ƅйƌ҉áƇǖǊƚ ȧ\"\n!ލƇ\"ƺDƾƥǅ#ǈ2߉ȶƀƄࡳȶוƄŇƇܚƁ®ƕÎ\"\n!ۣƚ \r\"Ǌƅ΢ƙʄƙȊƁǥ!т=Ɓ«\"\n!ͶŠƁôƵƄĩȶRsMƁŷ1}'N@	\x007\n\x00,׏ȳǜǊƅƷǝǊƆٹi	\"Ĩȶ\x00Ơ!ޗÓƁv³GȶĐȷƈ\"ƐŠƦ«ǊƆࢤƑ؂ǊƄʂƄxƅࣥȶƄȶƄĖƁvŇ\"\n!࣯=ȢŠƁϺǑȻ¶Ⱦɀ\rȼȽ\n	)\n1mųǰĺ[8měÔÁÁço æĴGÑ¤~ÁġĮ<lĄĔŦğÁ¢¹ìłŕŇý¬aøŚÖÁÁÁĻÜŋ½BÁ«¡.Í\rœSFæ}ıjäŮŇô¶ŠïÝŌEVÁ(Á&@¦ŝÁ£ŐòÁ£ŖÁ'ÁÛŇ·ÁÀÁūÁĉĎÕ:ďCªÆæµŤđeÎī¼æ9PI5ŞêãŬÓŏťŇĆùČŇĊőŗŇuĽ«Á§ĝ6śºŃėyKæ^ŀŇœĬ-ŇıÊVÁÁĨ\x00ń¥ĞAßŉÃřœÅTŇıÅŰâñřô»ċYëWd;´Á L¯ĦMÏŎĢĸűĹJŇwĥĐŇåşďĪĒÉĭēzËÁ«Āt.úfõ$ļÈĠ3ģØÁĤÌcĲÁ{£¾Á²qŊèÁ?æÁDgUņŢĩOÁİÿ4ÁQæÁî©£®2Á£ŔÁůřŨĕÁ!+ňüĭĈi÷Ň¶ĘŲ`R7ęĖÚH,Ň_ĚĿÁÁöhĵkÐ¿ţÁ#ōħŭ/óæũĶ0ÄøbæšæpÁĳæÁ«¡.Ň=þ\"xÁnZ¨±ŪÁíŒû³ï»VÁæÁāÁ%ďŘ\\Ł	ÇÙřŅÂĜáÁ>ÁįÁčÁķ]ÁąŜÁÁÁ«¡.ŧ×|à¸ŇXyæă9ÁĂvľđ­ř1I*Þ°Næ\nćær)æðÁÒésÁ\x00ų	ħƷ\x00ƅȨȖnɀζi\rƄ˫ǉƉ٢ŵ\x00Ȧư1ƙƬ\nďƤBƶƤzƾƙбƸ	ħƷ\x00ƅÜȝn%ƙьƙ̹ƚ1ư	ȢÇũ.Ƣ	ħƷ\x00Ƈbțn\nڊƁٵ\rɾƄԳyǊƄŀƄǮȤǪȥ\n\r5ȣ͕ƁŨƙזǇƙצ½ȲƙՇƄǤƇȃ\r%\rƌ֢\rƋ࠰ƁLÓGǚŨ\r\rǻƄė\rYƄ,=Ȩƶ1ƙ֚ƶBƮ	ƄQƇ«Ű\x00ƙҁƼDơƮơ2ȢťȴťȲťȳĳ˺Ɔ۲ƄӪ\n߆ŦȦȦƄVƁvƧƆѫǇtƹ1ƙࢻǈ\nײ\r=ƙ֔5ʗƁα52ē<ۏ\n̽ȸƁۘȸƁƙРŪ\x00	Ȣ<ŧ\nࠛ\rƿƄ\x00ȯȻ¶ȪĵȻȨȣŷƇȴʼƄ,\nࠖƚ 	٣	\rƄ˫	ħƷ\x00ƅşȜn\rƄűƆ࠽Ɔݤŵ\x00ȤȾ̵\nࣻ\nߎ'æƙ؁Ė޵ǊƊځƢ)ȢǊƄ¦ƊŵȠۯǊƇնƢ)ȦǊƄ¦Ƈɍȡ܄iƁgȻާ\rŮ\x00Ⱦ˦ƁּƁƭȩ2ů\x00ƵƄîȬ2\rȻɉƁŧų\x00\rkȷ.Ƣ-ƄڙŬ\x00ȣŬ\x00ȧƁgǚ(ſ\r@\r@ԻƁͿ\r@˰ƁȰƙ࠸Ɓ߾Ū\x00Ȫ	ȢƄVƁƙÿ\r\nֽ=\rȹ\r	ȣƄVƁȣ.ڣȤ.ϐȥ.ǧƚ 	\r\rƴƄĮƅ̄=Ƅॄȸwē<	ǊƄİƄȃǉưȤȬ	ħƷ\x00Ɔ׻Țn\r@Ƅ,ů\x00ŃȼšƁʀƸ?ƙФƤ#ƙ̫ȢȻݟ\n͵ƚ \nƉ̂ƉɚȻɉƁڭȾϭ\nրũȢƄԍƄ,ƁŸ?ƄVƁʳƄVƁôȸǳæƆ՝ɀ̭Ɔ͑ĘڥĘԞƅȍ	Ԓ\ri̅ȣȢȬȻ¶Ʒƙϗ\nŰ	ħǊ\x00ƈʱĴ	ħƷ\x00ƅÅȗn\nņ	ħƷ\x00Ƅşȟn=ƋٴŪ\x00ȥٱ	ħȼ\x00ƈǖ\nΙǊę˜ƄƽƄŇĔ҅ƁƗǊę˜ƄƽƄŇƅώƁ®Ŭ\x00ȵҚƁ؃ȵơ1ƾ\r\r@ƄՙȸwƁL\nмŬ\x00ȳȫȢ1ȣȨĳ\nϠǊęȗ	ȭƳȮPȣȣѸ	(ſƄר	ȱƳȰPȦŬ\x00ȫǳ\r%\rƌ̦\rƅ̕ƁLȢ.Ƣ#Ȧ.ƢȾֶȤȤƄVƁßɜŴ\x00Ȣ\nԿǉƌҠ\rƄ,\rǊęȗȢkǆĵ<	ħƷ\x00ƇØȘnŬ\x00ȭȸ߄ƁˮƁŧȤȤ\n࣪\nТ\n࠷	Ƅ,ȦkŬ\x00Ȥ	ȢLũȥǧ%ǉǇƤƃƚ\nЋ	ħƷ\x00Ɔ҆ȞnުŪ\x00Ŵ\x00ȣ-Ɓ\rƊा\rƊࣆ\rƈʒŪ\x00Ⱥŵ\x00ȣ\rǊƅÃ\r@ĩȾקȣk\nޠ	ȣıŅ2·\rӨ\rƅثƁL	ȢƄVƁgƷBƸŵ\x00Ȣ\r-ƁӜ\r@Ƅҍ\nڒǈ1ƙœƺ1ƙœų\x00ƙȴȾ޾ȻȬȪ\nˍŬ\x00Ȧƙऐơ\rƬƇʾƷ\x00ƌݔ\r̻iؗƁLɀ­	=\rƄVƁƯ\rّŰ\x00ƙڲ	ȫƳȪPȩ\rɦ\rȤ\n֛ȢȣǁzǈǼƚƙˣŮ\x00Ⱦ׶Ɓࠡȧ2\nࠄȢ\nϘȵƳǋƙʿƋ؄\x00ƁٜƙʿƇࢅ\x00Ɓࡐ\nѲƙԉƙࡄƷǇů\x00Ȣų\x00ȶ\n´ȾևȾю=\rƆֵƙޯƁߍΨ\n݂ȧ.ƆҭȨ.ƆЉȩ.ƇƵǉƮwƁŨ	ȣƄVƁgȨȻ¶ߦwƁvů\x00	ȼƷƄŋƋޢ	ࢳƁv\nࣄȿȢ-ƢȱǊƄŀƄǮ\r5ȢʙƁŨƴzƸ?ƙٕǂ2ƤzǂƴêǈyƙࣱǇȢŷƆ̣\r(Ʋ¨Ƅ˘/æǊƅ࣠Ǌƅ˾ƆࡁǊƅ˾ƆÌǊę߅ƅόƅǝƅ׆ƅǝƅոƅȍǂ\ri	Ⱦ؞å\rݺ\r=\rًſƁЭͨƄД\rȧƆ̗ȽƁࡍƁޘű\x00ƙջƙҾƾDƺƙɀƁgՁ	ƄQƍĆ½ȴ\n޸\rȶȸwƁgȢȻ¶ȨƆ,ȯ\nϯƄڱ	ǊƄİƅǠ-Ƅࡥ	Ŵ\x00ƙÿȻԹƚ ࢮȸwƁƙ࠺ƮƥƤBǁ2½Ȧ\nٿ	ƷƄÃƉôŬ\x00Ȳ½ȩȬĳŰ\x00ȷŬ\x00ȥ	Ȣ®Ť	ħƷ\x00ƅĶȕnť\r\nޓ\r@ǊƆȇ\r@ƁôŲ\x00ƄȮƁˣ\n޺	\rƄϓ½ȳȤŷƆźwƁgȮ	Ȥ#Ȣ#ȣƙϨƄõ\nٌƁL\nס\n܈ű\x00ȹƚ ȼ(Ǜ<\nࠬī\nΫ	Ŷ\x00\x00ȸĸ\x00\x00\r\rऄ\rڋ\rк\rࠅ\nࣁ\nࡧ	ħƷ\x00ƅØșn\rŔ\rƅΞƁL	\rœ\x00\nà\rƆ̓\n֫	\rƅЁƄѯ\r\nࡗ\rŮ\x00Ⱦ˦ƁݝƁЕȨ2	Ȣ«ţŬ\x00ȴʬȥkɬ\nЫwƁLȧk	ƄQƉÎȤk	ƄQƇÎ\nޤ\nžů\x00ȧӠŰ\x00ȸɀһiŬ\x00ȱk\rİ<ȧ.ƢȨ.Ƣȩ.ƢȾ٭Ţ\r	ȼƄÌƆ_\r\r\r@ƄĮƄɫ	ƄQƈŸȩƇƵŪ\x00ƙŧȰĵȻȯ	Ȣ=Ŧ½ȢȾެ\nद	Ȣ­Ŧů\x00Ȧȯĳȣ	Ů\x00šƁ߬	ǊƄİƄƷɀɁ	ȿ	\r\n\r&^\x00G=%[J6[$[$[:[45QZH[[VB7DL\r1YBO[>91U)	[C[R31@W'101E1?)[\\!TFP[-\"S<1\"+[8#XY, K[[(*I\n[A/&-;M.2N]<A1[\x00^ƚ \n	%ȿěƾƷƙϧǂ?ơ#ƙɀƼǼƷ1ǉƃƚ\rȼƅĘƅĒłȧƄǵȼƍݒ	%ȿĕƾƷ	ƷƄ¦Ğƹ\n\x00Ɓȁ	ȬƳƇُ=ȧ\rƙmƄ\x00ƌ҄Ɓ®#ƄƁĆ\nͬæ)ś\x00ȻШƄVƁ˥ܢiȿ\rƙmƄ\x00ƍࣛƁ®şė˴ǊƉ͓ǊƊ܉Ǌƈǀƚ ƚ 	ƷȿŽƢƇѕǊƌɱƚ 	\nՂ(ǉƌࣩ	ȼƄÌƅĒ\r\n´ƚ ɀȕȦȤƉѤ\nࣴȾऒ	ƄVƁgɀˬɁ­	%ȿĒƾƷ	Ƴ\x00ƁǺī	ǊƅÃȣɀǗƇȀ\x00ȣ\nۍ\nžɀȕ	ƷƄ¦ĝ\nà\nŰȿlƷ	ǎƅǭğ˴ȼ(K~Ƅ,GƇ̂֒ƄƁ࠴Ş#×-/Ο1Ǒ)ȤŸɗƆÞǂi޳ȫƈҦ	ȼƄÌƅĒɜƚ \rȪƳƇΗƁŨ	ƷƄ¦Ě	ƷƄ¦Ġ=ȾٟȼƇࢦȼƇՠ	ƄVƁɬ\rƅѧǉƌŵƄٛƚ ɀˆƳńƁǺȤɁ΁\nņ͔Ȧ=\r#-Ɖτ-ƈ®ȼƌ࣌ȿƅəȢɀǗƆƭ\x00ȢȬ\nҰʬ\nڃ	ŸƁƍ\x00	ȼƉࠫ\x00	·ƴ1ƙœ	ȼƅĘƆ_\rɁɂ\n	(	\x00\n\r\x00ƚ 	ȧɀծ\n´ƶBƨæȼƆ΍\nƙÄƄȼƆռƌ݌\nƆة	ǂiȼƌइ\x00\x00ƅޡȽƁԭȣȢ\nžƚ Ƚkī\nà\nƷȿȤȻȣȣȻ¶ƶ?ƚDƤBƙܿ\nďȥ\nƚ ȧkɀˆ\rȼƅĘƅĒłȧƄǵȥ\nKȥȧǊƅÃȧरȧ·	ɀɄƅ߶ƅޙɂ­	\nɂ\x00\r\x00\x00\x00\x00ɀɄ\nƙmƄ\x00Ɗן·\n\n	´";}}else{if(_$$N===76){_$jW.push("})($_ts.scj,$_ts.aebi);");}else if(_$$N===77){_$_H++ ;}else if(_$$N===78){_$cN=_$jW.join('');}else{_$_h[1]=_$$4;}}}else{if(_$$N<84){if(_$$N===80){_$_y=_$_j.aebi=[];}else if(_$$N===81){_$$4=_$kD(0,807,_$g$(_$jL));}else if(_$$N===82){_$hH= !_$hf;}else{_$_h=[];}}else if(_$$N<88){if(_$$N===84){_$hH=_$c9<_$_r;}else if(_$$N===85){_$_h[6]="";}else if(_$$N===86){_$_j.nsd=_$$j;}else{_$_$++ ;}}else{if(_$$N===88){_$_h[4]=_$kD(19)-_$_l;}else if(_$$N===89){_$_5+=-5;}else{_$hH=_$_H<_$eB;}}}}}else ;}

function _$iZ(_$jW,_$dq,_$c9){function _$fe(_$_l,_$jL){var _$_h,_$_$;_$_h=_$_l[0],_$_$=_$_l[1],_$jL.push("function ",_$$4[_$_h],"(){var ",_$$4[_$dV],"=[",_$_$,"];Array.prototype.push.apply(",_$$4[_$dV],",arguments);return ",_$$4[_$ih],".apply(this,",_$$4[_$dV],");}");}function _$gN(_$_l,_$jL){var _$_h,_$_$,_$_H;_$_h=_$eF[_$_l],_$_$=_$_h.length,_$_$-=_$_$%2;for(_$_H=0;_$_H<_$_$;_$_H+=2)_$jL.push(_$_4[_$_h[_$_H]],_$$4[_$_h[_$_H+1]]);_$_h.length!=_$_$?_$jL.push(_$_4[_$_h[_$_$]]):0;}function _$gd(_$_l,_$jL,_$_h){var _$_$,_$_H,_$bJ,_$_r;_$bJ=_$jL-_$_l;if(_$bJ==0)return;else if(_$bJ==1)_$gN(_$_l,_$_h);else if(_$bJ<=4){_$_r="if(",_$jL-- ;for(;_$_l<_$jL;_$_l++ )_$_h.push(_$_r,_$$4[_$$r],"===",_$_l,"){"),_$gN(_$_l,_$_h),_$_r="}else if(";_$_h.push("}else{"),_$gN(_$_l,_$_h),_$_h.push("}");}else{_$_H=0;for(_$_$=1;_$_$<7;_$_$++ )if(_$bJ<=_$b$[_$_$]){_$_H=_$b$[_$_$-1];break;}_$_r="if(";for(;_$_l+_$_H<_$jL;_$_l+=_$_H)_$_h.push(_$_r,_$$4[_$$r],"<",_$_l+_$_H,"){"),_$gd(_$_l,_$_l+_$_H,_$_h),_$_r="}else if(";_$_h.push("}else{"),_$gd(_$_l,_$jL,_$_h),_$_h.push("}");}}function _$_P(_$_l,_$jL,_$_h){var _$_$,_$_H;_$_$=_$jL-_$_l,_$_$==1?_$gN(_$_l,_$_h):_$_$==2?(_$_h.push(_$$4[_$$r],"==",_$_l,"?"),_$gN(_$_l,_$_h),_$_h.push(":"),_$gN(_$_l+1,_$_h)):(_$_H= ~ ~((_$_l+_$jL)/2),_$_h.push(_$$4[_$$r],"<",_$_H,"?"),_$_P(_$_l,_$_H,_$_h),_$_h.push(":"),_$_P(_$_H,_$jL,_$_h));}var _$_l,_$jL,_$_h,_$_$,_$_H,_$aS,_$$L,_$hr,_$dV,_$$$,_$ih,_$$r,_$$B,_$kt,_$$W,_$$P,_$_v,_$hj,_$eF;var _$cN,_$$1,_$a1=_$jW,_$eB=_$a$[2];while(1){_$$1=_$eB[_$a1++];if(_$$1<60){if(_$$1<16){if(_$$1<4){if(_$$1===0){for(_$_h=0;_$_h<_$_l;_$_h++ ){_$jL[_$_h]=_$gu();}}else if(_$$1===1){_$_4=_$_4.split(_$aR.fromCharCode(257));}else if(_$$1===2){ !_$cN?_$a1+=3:0;}else{_$dq.push(_$_h);}}else if(_$$1<8){if(_$$1===4){_$$L=_$gu();}else if(_$$1===5){_$jL++ ;}else if(_$$1===6){_$_v=_$gu();}else{return _$jL;}}else if(_$$1<12){if(_$$1===8){_$$r=_$gu();}else if(_$$1===9){_$cN= !_$hj;}else if(_$$1===10){_$_l=_$ct.substr(_$cZ,_$dq);_$cZ+=_$dq;return _$_l;}else{_$ef=_$ct.length;}}else{if(_$$1===12){_$_h=_$iZ(0);}else if(_$$1===13){_$_l=_$gu();}else if(_$$1===14){_$$B=_$gu();}else{_$cN= !_$jL;}}}else if(_$$1<32){if(_$$1<20){if(_$$1===16){_$ih=_$gu();}else if(_$$1===17){_$cN=_$jL<_$_H;}else if(_$$1===18){_$a1+=-5;}else{_$_4=_$iZ(45,_$gu());}}else if(_$$1<24){if(_$$1===20){_$_H=_$gu();}else if(_$$1===21){ !_$cN?_$a1+=38:0;}else if(_$$1===22){_$_7(_$jL,_$_h);}else{_$_l.push([_$$P[_$jL],_$$P[_$jL+1]]);}}else if(_$$1<28){if(_$$1===24){_$_l=[];}else if(_$$1===25){_$aS=_$gu();}else if(_$$1===26){ !_$cN?_$a1+=-27:0;}else{_$af(_$hj,_$a3);}}else{if(_$$1===28){_$_$=_$gu();}else if(_$$1===29){_$jL=new _$_N(_$_l);}else if(_$$1===30){_$jL+=2;}else{_$ct="!Ňfunction ā(ā){ā[4]=2;ā[0]=ā[ā(7,8)];if(2){ā[0]=6;}ā[0]=7+5;ā[0]=6;}function ā[4]=ā(3,8)];if(7+5){ā[0]=6;ā[4]=3+1;ā(3,8)];}function ā(0-6,8)]=ā(2,8)];ā(7,8)];if(ā(3,8)]){if(6){ā(5,8)]=3;}}}function ā){var ā=2;var ā=ā(1,8)];var ā=5;var ā=6;var ā(5,8)];var ā(6,8)];}function ā(4-2,8)]=1;var ā=0;}function ā=7;if(ā[4]=2;}}ā(7,8)];}\x00)))))))	\x00))\n))))\r)\n)))))))))*,),+*),)))*,)+*),)))))))) ";}}}else if(_$$1<48){if(_$$1<36){if(_$$1===32){_$_h=_$_h.join('');}else if(_$$1===33){_$cZ=0;}else if(_$$1===34){_$jL=_$iZ(0);}else{return;}}else if(_$$1<40){if(_$$1===36){_$$W=_$iZ(0);}else if(_$$1===37){_$hr=_$gu();}else if(_$$1===38){_$eF=[];}else{_$af(_$$P,_$a3);}}else if(_$$1<44){if(_$$1===40){_$$$=_$gu();}else if(_$$1===41){ !_$cN?_$a1+=54:0;}else if(_$$1===42){_$cN=_$jL<_$_$;}else{_$cN= !_$eF;}}else{if(_$$1===44){_$$P=_$iZ(0);}else if(_$$1===45){_$hj=[];}else if(_$$1===46){ !_$cN?_$a1+=-40:0;}else{_$cN= !_$$P;}}}else{if(_$$1<52){if(_$$1===48){_$eF[_$jL]=_$iZ(0);}else if(_$$1===49){_$hj[_$jL]=_$iZ(0);}else if(_$$1===50){_$dV=_$gu();}else{_$$P=_$_l;}}else if(_$$1<56){if(_$$1===52){_$kt=_$iZ(0);}else if(_$$1===53){_$jL=0;}else if(_$$1===54){ !_$cN?_$a1+=-25:0;}else{_$_h=[];}}else{if(_$$1===56){_$_y[_$dq]=_$_h;}else if(_$$1===57){_$jG(0,_$c9,_$dq);}else if(_$$1===58){_$cN=_$jL<_$$P.length;}else{_$cN= !(_$$B+1);}}}}else ;}

function _$jG(_$_$,_$jL,_$_h){var _$_l;var _$bJ,_$dq,_$_H=_$_$,_$c9=_$a$[3];while(1){_$dq=_$c9[_$_H++];if(_$dq<42){if(_$dq<16){if(_$dq<4){if(_$dq===0){ !_$bJ?_$_H+=0:0;}else if(_$dq===1){_$bJ=_$eF.length;}else if(_$dq===2){ !_$bJ?_$_H+=-19:0;}else{_$bJ=_$kt.length;}}else if(_$dq<8){if(_$dq===4){_$jL.push("while(1){",_$$4[_$$r],"=",_$$4[_$$B],"[",_$$4[_$aS],"++];");}else if(_$dq===5){return;}else if(_$dq===6){_$bJ=_$_v<_$eF.length;}else{_$bJ=_$$W.length;}}else if(_$dq<12){if(_$dq===8){_$jL.push(_$$4[_$$L],",",_$$4[_$$B],"=",_$$4[_$dn],"[",_$_h,"];");}else if(_$dq===9){_$_H+=-5;}else if(_$dq===10){ !_$bJ?_$_H+=-17:0;}else{_$jL.push("){");}}else{if(_$dq===12){_$_l++ ;}else if(_$dq===13){ !_$bJ?_$_H+=17:0;}else if(_$dq===14){_$bJ=_$_l<_$kt.length;}else{_$jL.push("var ",_$$4[_$$W[0]]);}}}else if(_$dq<32){if(_$dq<20){if(_$dq===16){_$jL.push(",",_$$4[_$kt[_$_l]]);}else if(_$dq===17){_$bJ= !_$jL.length;}else if(_$dq===18){for(_$_l=0;_$_l<_$$P.length;_$_l++ ){_$fe(_$$P[_$_l],_$jL);}for(_$_l=0;_$_l<_$hj.length;_$_l++ ){_$_7(_$hj[_$_l],_$jL);}}else{_$bJ= !_$$4;}}else if(_$dq<24){if(_$dq===20){ !_$bJ?_$_H+=30:0;}else if(_$dq===21){ !_$bJ?_$_H+=3:0;}else if(_$dq===22){_$jL.push("(function(",_$$4[_$hf],",",_$$4[_$dn],"){if(!$_ts.cd) return;var ",_$$4[_$$L],"=0;");}else{for(_$_l=1;_$_l<_$$W.length;_$_l++ ){_$jL.push(",",_$$4[_$$W[_$_l]]);}}}else if(_$dq<28){if(_$dq===24){_$_P(_$_v,_$eF.length,_$jL);}else if(_$dq===25){_$jL.push("}");}else if(_$dq===26){_$bJ= !_$$P;}else{_$bJ=_$_h==0;}}else{if(_$dq===28){_$_H+=29;}else if(_$dq===29){_$jL.push(";");}else if(_$dq===30){_$jL.push("var ",_$$4[_$hr],",",_$$4[_$$r],",",_$$4[_$aS],"=");}else{ !_$bJ?_$_H+=4:0;}}}else{if(_$dq<36){if(_$dq===32){ !_$bJ?_$_H+=6:0;}else if(_$dq===33){_$_l=0;}else if(_$dq===34){ !_$bJ?_$_H+=1:0;}else{_$jL.push("if(",_$$4[_$$r],"<",_$_v,"){");}}else if(_$dq<40){if(_$dq===36){_$jL.push("}else ");}else if(_$dq===37){_$gd(0,_$_v,_$jL);}else if(_$dq===38){_$jL.push("function ",_$$4[_$$$],"(",_$$4[_$$L]);}else{ !_$bJ?_$_H+=19:0;}}else{if(_$dq===40){_$bJ=_$aS<0;}else{_$bJ=_$jL.length==0;}}}}else ;}}}}})([],[[2,8,6,3,4,11,0,1,7,9,5,10,],[5,13,20,61,90,60,14,87,47,43,4,8,49,30,77,16,10,25,51,57,51,63,7,1,86,46,6,27,40,74,45,84,43,31,58,2,62,48,56,74,45,84,29,64,2,89,41,37,79,80,32,75,18,55,0,70,85,69,71,11,33,73,82,30,74,24,66,22,28,67,35,38,36,81,83,39,34,3,42,17,76,78,23,30,88,44,12,65,9,68,30,72,53,51,52,22,51,54,59,26,21,19,50,15,51,],[13,29,15,21,27,20,38,53,17,2,48,5,18,43,41,39,6,12,56,28,45,53,42,2,49,5,18,9,54,52,36,44,24,53,58,2,23,30,18,51,47,26,0,7,35,10,35,31,11,33,13,19,1,34,55,22,32,3,35,25,4,37,50,40,16,8,14,59,46,57,35,],[27,31,22,41,0,28,38,41,13,30,19,0,8,1,20,4,40,39,18,7,21,15,23,29,17,10,3,32,33,14,21,16,12,9,11,26,2,35,37,36,6,34,24,29,25,5,],]);

var ans =document.cookie.toString();
console.log("cookie_setter_begin");
console.log(ans);
console.log('cookie_setter_end');
