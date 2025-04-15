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
        proxy: true,      // 是否开启代理
        proxyValue: true, // 是否打印值
        jsdomProxy: true, // 是否在jsdom内部进行代理[建议开启]
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
        jsdomArray: ['jsdomDocument', 'jsdomWindow', 'jsdomNavigator',],
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
/** [Tool]代理方法 
 * 对某个"东西"进行代理Proxy后, 以后是使用"代理对象", 而不是原对象
 * eval(`${o} = new Proxy(${o}, ${handler})`); 帮你完成 window = proxy("window")的操作
 * @param {需要代理的对象(str)} o 
一. 输出彩色文本到控制台
console.log('\x1b[33m%s\x1b[0m', '这是黄色的文字'); // 输出黄色文本
console.log('\x1b[31m%s\x1b[0m', '这是红色的文字'); // 输出红色文本
console.log('\x1b[36m%s\x1b[0m', '这是青色的文字'); // 输出青色文本
console.log('\x1b[32m%s\x1b[0m', '这是绿色的文字'); // 输出绿色文本
参考: https://juejin.cn/post/7355382754693464105
恢复: \x1b[0m
前景色（文字颜色）
    黑色：\x1b[30m
    红色：\x1b[31m
    绿色：\x1b[32m
    黄色：\x1b[33m
    蓝色：\x1b[34m
    品红：\x1b[35m
    青色：\x1b[36m
    白色：\x1b[37m
背景色：
    黑色：\x1b[40m
    红色：\x1b[41m
    绿色：\x1b[42m
    黄色：\x1b[43m
    蓝色：\x1b[44m
    品红：\x1b[45m
    青色：\x1b[46m
    白色：\x1b[47m
*/


// 格式化值以便打印
function formatValueForDisplay(value) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    const type = typeof value;

    // 处理不同类型的值
    if (type === "symbol") {
        return value.toString();
    } else if (type === "function") {
        // 函数显示简短描述
        const funcStr = value.toString();
        if (funcStr.length > 50) {
            return funcStr.substring(0, 45) + '...}';
        }
        return funcStr;
    } else if (type === "object") {
        if (Array.isArray(value)) {
            // 数组处理
            if (value.length > 10) {
                return `[${value.slice(0, 5).join(", ")}, ... ${value.length} items]`;
            }
            return JSON.stringify(value);
        } else if (value instanceof Date) {
            return value.toString();
        } else if (value instanceof RegExp) {
            return value.toString();
        } else {
            // 一般对象
            try {
                const str = JSON.stringify(value);
                if (str.length > 255) {
                    return str.substring(0, 250) + "...}";
                }
                return str;
            } catch (e) {
                // 如果对象不能被序列化(如循环引用)
                return `[object ${value.constructor.name || 'Object'}]`;
            }
        }
    } else if (type === "string") {
        if (value.length > 255) {
            return value.substring(0, 250) + "...";
        }
        return value;
    } else {
        // 数字、布尔等基本类型
        return String(value);
    }
}

/** 解析带有ANSI转义颜色代码的字符串，正确处理嵌套颜色
 * 
 * @param {string} input 带有ANSI转义颜色代码的字符串
 * @return {string} 处理后的字符串，正确处理嵌套颜色
 */
function parseColorString(input) {
    // 用于匹配ANSI颜色代码的正则表达式
    const colorRegex = /\x1b\[([\d;]+)m/g;

    // 用于存储颜色代码栈
    const colorStack = [];

    // 结果字符串
    let result = '';

    // 上一个匹配位置
    let lastIndex = 0;

    // 查找所有的颜色代码
    let match;
    while ((match = colorRegex.exec(input)) !== null) {
        // 获取匹配的颜色代码
        const fullColorCode = match[0];
        const colorValue = match[1];

        // 添加颜色代码前的文本
        result += input.substring(lastIndex, match.index);

        // 处理颜色代码
        if (colorValue === '0') {
            // 这是重置代码
            result += fullColorCode;

            // 弹出当前颜色
            colorStack.pop();

            // 如果栈不为空，则添加栈顶的颜色代码
            if (colorStack.length > 0) {
                result += colorStack[colorStack.length - 1];
            }
        } else {
            // 这是设置颜色的代码
            result += fullColorCode;

            // 将颜色代码压入栈
            colorStack.push(fullColorCode);
        }

        // 更新上一个匹配位置
        lastIndex = match.index + fullColorCode.length;
    }

    // 添加剩余的文本
    result += input.substring(lastIndex);

    return result;
}

/**
 * 将字符串填充到固定长度，过长则截断并添加省略号
 * @param {string} str 原始字符串
 * @param {number} length 目标长度
 * @return {string} 处理后的固定长度字符串
 */
function padString(str, length = 10) {
    if (!str) return ' '.repeat(length);

    // 如果字符串长度超过指定长度，截断并添加省略号
    if (str.length > length) {
        return str.substring(0, length - 3) + '...';
    }

    // 如果字符串长度不足，填充空格
    return str.padEnd(length, ' ');
}
mframe.proxy = function (o) {
    if (mframe.memory.config.proxy == false) return o;
    // 定义无需打印的属性
    const ignoreProerties = ['prototype', 'constructor', 'jsdomMemory'];  // Preperties属性
    const ignoreSymbols = [''];                // Symbol属性
    return new Proxy(o, {
        set(target, property, value, receiver) {
            // 一.清洗日志
            const isSpecial = ignoreProerties.includes(property);
            const isImplSymbol = typeof property === 'symbol' && ignoreSymbols.includes(property.toString());
            if (isSpecial || isImplSymbol) {
                return Reflect.set(target, property, value, receiver);
            }

            // 二.日志打印
            var logContent = `方法:set 对象 ${padString(target.constructor.name, 15)} 属性 ${padString(String(property), 15)} 值类型 ${padString(typeof value, 10)}`; // 基础日志
            if (mframe.memory.config.proxyValue) logContent += " 值" + formatValueForDisplay(value);          // 全量日志
            console.log(logContent);

            // 三.正常设置
            return Reflect.set(target, property, value, receiver);
        },
        get(target, property, receiver) {
            // console.log(property,mframe.proxy['jsdomFlag'] );
            // 一.清洗日志
            const isSpecial = ignoreProerties.includes(property);
            const isImplSymbol = typeof property === 'symbol' && ignoreSymbols.includes(property.toString());
            if (isSpecial || isImplSymbol) {
                return Reflect.get(target, property, receiver);
            }

            // 二.日志打印
            // 获取属性值
            const value = Reflect.get(target, property, receiver);

            // 打印获取操作的日志   
            var logContent = `方法:\x1b[32mget\x1b[0m 对象 ${padString(target.constructor.name, 15)} 属性 ${padString(String(property), 15)} 值类型 ${value === undefined ? "\x1b[31m"+padString("undefined", 10)+"\x1b[0m" : padString(typeof value, 10)}`;
            if (mframe.memory.config.proxyValue) logContent += " 值" + formatValueForDisplay(value);                                 // 全量日志
            if(value === undefined) 
                logContent = `\x1b[1m${logContent}\x1b[0m`
            logContent = parseColorString(logContent);
            console.log(logContent);

            // 三.正常返回
            return value;
        }
    });
}
mframe.jsdomProxy = function (o) {
    if (mframe.memory.config.proxy == false || mframe.memory.config.jsdomProxy == false) return o;
    // 定义无需打印的属性
    const ignoreProerties = ['prototype', 'constructor'];  // Preperties属性
    const ignoreSymbols = ['Symbol(impl)', 'Symbol(SameObject caches)']; // Symbol属性
    return new Proxy(o, {
        set(target, property, value, receiver) {
            // 一.清洗日志
            const isSpecial = ignoreProerties.includes(property);
            const isImplSymbol = typeof property === 'symbol' && ignoreSymbols.includes(property.toString());
            if (isSpecial || isImplSymbol) return Reflect.set(target, property, value, receiver);

            // 二.日志打印
            var logContent = `方法:\x1b[37mset\x1b[0m 对象 ${padString(target.constructor.name, 15)} 属性 ${padString(String(property), 15)} 值类型 ${padString(typeof value, 10)}`; // 基础日志
            if (mframe.memory.config.proxyValue) logContent += " 值" + formatValueForDisplay(value);          // 全量日志
            logContent = `\x1b[36m${logContent}\x1b[0m`;
            logContent = parseColorString(logContent);
            console.log(logContent);

            // 三.正常设置
            return Reflect.set(target, property, value, receiver);
        },
        get(target, property, receiver) {
            // 一.清洗日志
            const isSpecial = ignoreProerties.includes(property);
            const isImplSymbol = typeof property === 'symbol' && ignoreSymbols.includes(property.toString());
            if (isSpecial || isImplSymbol) {
                return Reflect.get(target, property, receiver);
            }

            // 二.日志打印
            // 获取属性值
            const value = Reflect.get(target, property, receiver);

            // 打印获取操作的日志   
            var logContent = `方法:\x1b[32mget\x1b[0m 对象 ${padString(target.constructor.name, 15)} 属性 ${padString(String(property), 15)} 值类型 ${value === undefined ? padString("\x1b[31mundefined\x1b[0m", 10) : padString(typeof value, 10)}`;
            // var logContent = `方法:\x1b[32mget\x1b[0m 对象 ${target.constructor.name} 属性 ${String(property)} 值类型 ${value === undefined ? "\x1b[31mundefined\x1b[0m" : typeof value}`;
            if (mframe.memory.config.proxyValue) logContent += " 值" + formatValueForDisplay(value);                                 // 全量日志
            logContent = `\x1b[36m${logContent}\x1b[0m`;
            logContent = parseColorString(logContent);
            console.log(logContent);

            // 三.正常返回
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
    this.mframe.safefunction = (func) => {
        set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`);
    }; //导出函数到globalThis
}).call(this);





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
crypto.subtle = _crypto.subtle ? mframe.proxy(_crypto.subtle) : mframe.proxy(new (class SubtleCrypto { }));
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
    return this[keyName] || undefined; // 这个this是指向实例的
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
// localStorage['WQ_gather_wgl1'] = { "v": "dee3cb94c529ac524a0996146a0176b8", "t": 1743691606906, "e": 31536000 };
// localStorage['WQ_gather_cv1'] = { "v": "bb6feb71f0a492c0860d44d557d509be", "t": 1743865720216, "e": 31536000 };
// localStorage['WQ_dy1_vk'] = { "5.0": { "b5216": { "e": 31536000, "v": "aw9p3rdscsxrxd29", "t": 1741588342540 } } };
// localStorage['WQ_dy1_tk_algo'] = { "aw9p3rdscsxrxd29": { "b5216": { "v": "eyJ0ayI6InRrMDN3YWYzMjFiZDkxOG5hb1R6MjVjM0FpMnZZeUtXcXhkcEhRNzlxTWxnMzNGeklhaVpLeUdqZ0xVUVJWTWZiOGZoUjRtTkxUMEVBQ2hNRUNkanNfQzBWVWQzIiwiYWxnbyI6ImZ1bmN0aW9uIHRlc3QodGssZnAsdHMsYWksYWxnbyl7dmFyIHJkPSdLcHVPQjVndTBpOGInO3ZhciBzdHI9XCJcIi5jb25jYXQodGspLmNvbmNhdChmcCkuY29uY2F0KHRzKS5jb25jYXQoYWkpLmNvbmNhdChyZCk7cmV0dXJuIGFsZ28uTUQ1KHN0cik7fSJ9", "e": 86400, "t": 1743865720414 } } }
// localStorage['_$rc'] = 'nyzoIC0GMP_YPpkzSNJDPvE.mqKCOq2L7YhYuP1M1bI0GaX0hnROh6w.ZTW'; // [瑞5]
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

// window["Request"] = function Request() { debugger; }; mframe.safefunction(window["Request"]); // 瑞5
// window["fetch"] = function fetch() { debugger; }; mframe.safefunction(window["fetch"]);       // 瑞5
//////////////////////////////////////////////////
//属性
window.outerWidth = 2050;
window.outerHeight = 1154;
window.devicePixelRatio = 1.125



// window.crypto = crypto;
window.screen = screen;
window.localStorage = localStorage;
window.sessionStorage = sessionStorage;
// window.chrome = mframe.proxy(new (class chrome { }));

window.name = '$_YWTU=eLA3sHo650XI_8OMZKKzPfWQjS6QTjiAQuGP1KlJh.q&$_YVTX=WO3&vdFm=' // TODO



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
    debugger;
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
    let defaultValue = 'visible'
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
        htmlElement.jsdomMemory = mframe.jsdomProxy(jsdomXXXElement)
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

    return mframe.proxy( collection);
}
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
debugger;
window.setTimeout = function () { }
window.setInterval = function () { }
window.ActiveXObject = undefined;

window.top = window; //[瑞5] 这玩意居然等于window
// window.self = window; //[瑞5]
// window.msCrypto = undefined;
// window.CollectGarbage = undefined;
// window.execScript = undefined;
window.sessionStorage = undefined;
window.localStorage = undefined;
// document.attachEvent = undefined;

// document.addEventListener =undefined
// navigator.getBattery =undefined;
// localStorage=undefined;
// sessionStorage =undefined;
console.log("require:", require);






//ts_begin
$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=25627;$_ts.cd="qoqdrrAloc3crAGhqc3qxGlimG7qxGQbrqgAxGWiEGAbq1WErr9hqcG3ka7qtrGtxGAmcq7qxGEbqaGKxGlOcAAYxGWiEGAbrGg9qa7qxGAbrAgKxGEOcGA3kAqbrP3okf3hqc3mxGEimPqrkPEcxG3OExZrJslcrsEavnie6Y_JLYXDHwlzmnqbdgmvGqbtBPTCkTtUySde2Np03AWlWaQlrxg7q5fRIcRqZ6rrsTxfHKOSwK7ZFlRBVZfHUkxOxsyIZURBF1yNQKOuhCTaMb7LFXNBMn27QbfL7CTCFKyFtcMAJkRVQ2x2RjG_QmRJ1kEZZ6pWs9NCxO4lMURNMPzjQIJBhCz6FCGLZURBF1yNQKOuhCTaMbzRthT1pCSs1vmTTvwUs6xdAOsmRkN6RVpmxjY3MUrXFnfj_beBtKSnFDPuMURNMPzjQIJBhCz6FCfR7nmGRbfxYm1BJVff3UrD1dRbVoSOtVrmBs23F6w.FcOSwbeNhb2SFHWBMUrXFnfj_beBtKSnFDOcIPe.wCzLKRVkCKmWJvqa5mpzHb223944RsxGiVzVQjzywOJKHkYvTYw9w9JAH6oop9RNQTJKHZaT1squ1ompeVej3k2HHVvuW270p9e2MBVg19pXYUy85kmWUmqSH0MnYCSBVsqSA8wMR170WkWTdOA6tCf0H6uiFDf0p9p7ReyoAP70WkWTdOA6tCf0H0BUA9Ne8DzWQzl_sOg03CT8SbrfIkJPJvt9VDeHRlR0pI2Xp9wnHkRY_brVMuRqQVOHVP0uJsqTRFG6hKeSHoyU4oRRs00d1KIi8n0uJsqTRFG6hKeSraAlvOWkrkqolDu.w6JCikAaJFGaJuq0WOa5juQarAASWuiX3OAmqsluWxZxWOV_JkW0.kqSHAEkWk1bJAWY1zHVCGcI.EgE4DTTB8phwqEUTLqOR3oy5b7qbyaqrGQmqaA9XAwQLAGgU0CaanVki3kXWXAOcoXOqzSmcdTk2iGp3pFIcsqZJkWaWj9TiOAcrOAl2sE0Ws3nJutBWOEmtK7CWXyJhVSEYlle5DTFQUNPRCODsKwbwKNLp8yRRopCHCxCnV7_pTp5WCKIqaWlJGQmJxZcJqsyWogLdbxGtKJjwPO5QDgN36mztHTPFc2GRvqLdKyutKrXFPOZhCr93czvw5aB3oR0tCw.ZPeGwUE.3DU.hCwNMPzGFdaBRCNCtCr.do7B3oNPtDoawneOMb3L3BJGhCJzF1fPZoQB3CTNQcOgRClNRKyPtHfyhCxjFcf7Z6WBMUx6tDu.3ce73KGLMImjhCS731fzZUqBMomLtD47hC29QczXwHGBFUYv3cfX4DSztKfbQbKuMCNvhbz.34JX3vVXFbTG7CyuW1yjwDKuMOw9hbN0J4JXQCEXFben7Cy731yjF6tuMbNLhbN0whJXQDaXFvpf5ce7RCG.FCIvhCSPR1z.FH0BMD2vtCza51euIcy6IK8uQCxChvwOFMJuQCGXw6p676JuQ1y63DtuQ6JS8Pz0FBGBQCSft6pLePeuwb3.wK6yh6xS8PzCRMJSMP2aRb9L4KyTRnyT3KiuQKRChvYa3.JS3vQXwD7L4DmBtUmfIcO7wDENQUrPtiSTRc2SIvQL_CxStURbIPO.FbVNwbyP3.J6Mowa3bNa76w4Q1yuQDtuwUrfhvm6w4JTQoEXQUSG76p73CA.QCByRslNwKNntifX3P2TRvEL_oJatUN2F1OvQCgN8bz6tiwBQo0XI6wL76zXF1yeto4CQne9QbaLwHJjQolXMvp2vaWkqY0O36cIrTaf3C9lqWqvxTQcqT7Gdl7kruqurqKvqaE0";if($_ts.lcd)$_ts.lcd();
//ts_end

(function(_$j1,_$_T){if(!$_ts.cd) return;var _$jZ=0;function _$bF(){var _$_z=[44];Array.prototype.push.apply(_$_z,arguments);return _$bp.apply(this,_$_z);}function _$bl(_$en){return _$bF;function _$bF(){_$en=0x3d3f*(_$en&0xFFFF)+0x269ec3;return _$en;}}function _$$j(_$bF,_$$4){var _$aX,_$e3,_$jN; !_$$4?_$$4=_$_F:0,_$aX=_$bF.length;while(_$aX>1)_$aX-- ,_$jN=_$$4()%_$aX,_$e3=_$bF[_$aX],_$bF[_$aX]=_$bF[_$jN],_$bF[_$jN]=_$e3;function _$_F(){return Math.floor(_$$n()*0xFFFFFFFF);}}var _$$4,_$$$,_$_V,_$$T,_$_X,_$c3,_$$n,_$aO,_$j6;var _$$D,_$$7,_$$P=_$jZ,_$b7=_$_T[0];while(1){_$$7=_$b7[_$$P++];if(_$$7<12){if(_$$7<4){if(_$$7===0){_$$D=_$j6;}else if(_$$7===1){_$$$=[4,16,64,256,1024,4096,16384,65536];}else if(_$$7===2){_$$T=window,_$_X=String,_$c3=Array,_$$4=document,_$$n=Math.random,_$aO=Date;}else{ !_$$D?_$$P+=0:0;}}else if(_$$7<8){if(_$$7===4){ !_$$D?_$$P+=2:0;}else if(_$$7===5){return;}else if(_$$7===6){_$$P+=2;}else{_$j6.lcd=_$bF;}}else{if(_$$7===8){_$j6=_$$T['$_ts']={};}else if(_$$7===9){_$bp(44);}else if(_$$7===10){_$$D= !_$aO;}else{_$j6=_$$T['$_ts'];}}}else ;}


function _$bp(_$ct,_$bZ,_$g9){function _$aw(){return _$kF.charCodeAt(_$$F++ );}function _$_Y(_$bF,_$$4){var _$aX,_$e3;_$aX=_$bF.length,_$aX-=1;for(_$e3=0;_$e3<_$aX;_$e3+=2)_$$4.push(_$$9[_$bF[_$e3]],_$gv[_$bF[_$e3+1]]);_$$4.push(_$$9[_$bF[_$aX]]);}var _$bF,_$$4,_$aX,_$e3,_$jN,_$_F,_$jZ,_$$P,_$$D,_$_z,_$$7,_$b7,_$as,_$g3,_$$o,_$gv,_$_P,_$kF,_$_3,_$$F,_$kI,_$c7,_$$9;var _$gJ,_$a9,_$aT=_$ct,_$cT=_$_T[1];while(1){_$a9=_$cT[_$aT++];if(_$a9<94){if(_$a9<64){if(_$a9<16){if(_$a9<4){if(_$a9===0){_$jN=0;}else if(_$a9===1){ !_$gJ?_$aT+=0:0;}else if(_$a9===2){_$as=0;}else{_$e3=_$aw();}}else if(_$a9<8){if(_$a9===4){ !_$gJ?_$aT+=27:0;}else if(_$a9===5){_$bQ(59,_$$D,_$_z);}else if(_$a9===6){_$gJ= !_$bF;}else{_$gJ= !_$aX;}}else if(_$a9<12){if(_$a9===8){ !_$gJ?_$aT+=54:0;}else if(_$a9===9){_$aX[6]="";}else if(_$a9===10){_$$9=_$kF.substr(_$$F,_$$P).split(_$_X.fromCharCode(257));}else{_$_3=_$kF.length;}}else{if(_$a9===12){_$gJ=_$$D<_$jZ;}else if(_$a9===13){_$$9.push(_$bQ(45,_$aw()*55295+_$aw()));}else if(_$a9===14){_$_z=[];}else{_$aX[0]="fngd|~`v`m~kgz|~`z}}@q~ioGdno~i~m`V`{j}t`6`z{n`#`ozmb~o`nkgdo`jinp{hdo`ojNomdib`|czm>j}~<o`ij}~Otk~`W`ozbIzh~`nomdib`&`b~o<oomd{po~`izh~`cookn5`kpnc`zkk~i}>cdg}`ajmh`|zgg`di}~sJa`]`kmjojotk~`cm~a`mjpi}`g~iboc`nozopn`n|mdko`X`8`jigjz}`b`iph{~m`Z8`Y`notg~`nkgd|~`:`m~z}tNozo~`ji|gd|f`z|odji`5`nm|`o~no`|jjfd~`z`[`otk~`n~o<oomd{po~`m~nkjin~O~so`zkkgt`jk~i`|m~zo~@g~h~io`api|odji`ejdi`SHGCookM~lp~no`np{hdo`gj|zodji` amjh `damzh~`b~oOdh~`x`ezqzn|mdko5`jigjz}nozmo`jigjz}~i}`ojk`~qzg`ji~mmjm`f~t>j}~`*`kmjoj|jg`|gd|f`}dq`n~i}`odh~Nozhk`jikmjbm~nn`jim~z}tnozo~|czib~`3+`pn~m<b~io`b~o@g~h~ion=tOzbIzh~`//.`@f|K`c~z}~mn`kjk`o~so`dikpo`mzi}jh`amjh`gj|zgNojmzb~`m~nkjin~Otk~`m~nkjin~`agjjm`jiodh~jpo`)`kzm~ioIj}~`b~o`m~hjq~>cdg}`nlmo`|ziKgztOtk~`~q~io`znti|`qzgp~`}j|ph~io@g~h~io`kzocizh~`<|odq~SJ{e~|o`\"`cd}}~i`np{nom`j{e~|o`m~hjq~@q~ioGdno~i~m`~so~mizg`ij}~Izh~`dii~mCOHG`@q~ioOzmb~o`hzo|c`b~o@g~h~io=tD}`cook5`n~zm|c`|ji|zo`{pooji`pi}~adi~}`COHGB~i~md|@g~h~io`hzo|cH~}dz`COHGAjmh@g~h~io`7`dhzb~`d`ncjrHj}zg?dzgjb`#cm~a`ezqzn|mdko5 qjd}W+X6`|jinomp|ojm`znndbi`cjno`kjmo`Hd|mjH~nn~ib~m`h~ocj}`|gji~Ij}~`k~majmhzi|~`n~o`~i|otk~`cjnoizh~`noz|f`#nm|`|~dg`dhkjmo`nomdibdat` zn `|jio~io`jiz{jmo`jkodjin`m~nkjin~SHG`9`kaa+`|og`qdnd{dgdot`h~oz`M~nkjin~(Otk~`~s~|`di}~s~}?=`#jinp{hdo`{zn~`cznJriKmjk~mot`dio~mizg`$_TQOS`hzs`oc~i`**`w`b~o>jio~so`np{nomdib`}j|ph~io`ojGjr~m>zn~`|g~zmDio~mqzg`nozopnO~so`f~t}jri`n~oDio~mqzg`kzmn~`m~npgo`#z|odji`Hzoc`|gjn~`jpo~mCOHG`ijr`jinp||~nn`hjpn~hjq~`}zozn(on`odh~`gjz}`}~n|mdkodji`cdnojmt`zooz|c@q~io`km~q~io?~azpgo`zrzdo`y`C~z}~mn`a~o|c`ojp|c~i}`#n~zm|c`h~}dz?~qd|~n`___ON___`$_on`Z`g__`h`adggNotg~`m`$_i}`enji`SHGCookM~lp~no@q~ioOzmb~o`B~oQzmdz{g~`api|odji `H~}dzNom~zhOmz|f`ka{-_+`rd}oc`qd}~j`c~dbco`hjpn~}jri`amzh~n`}zoz`|jhkdg~Ncz}~m`|czm<o`Api|odji`ajion`dnIzI`~iph~mzo~?~qd|~n`n~oDo~h`%`kjno`_`+`{`hjioc`zoomd{po~n`b~oDo~h`@g~h~io`Jq~mmd}~Hdh~Otk~`hzo|c~n`gdif`${_|zggCzi}g~m`nojkKmjkzbzodji`zkk~i}`hjpn~pk`|ziqzn`n~oOdh~jpo`km~gjz}`|zi}d}zo~`W\\m\\i:XwW\\m:\\iX`M~lp~no`(`6 N~|pm~`h~nnzb~`ka}+`}zt`kzm~io@g~h~io`nn`mrz+`__#|gznnOtk~`z{jmo`{~oz`kaz+`b~oNjpm|~n`|zg~i}zm`?JHKzmn~m`iph{~mdibNtno~h`}~azpgo `~i|j}dib`zgkcz`X[ ~sk~|o~} `m~opmi6`|cdg}Gdno`odh~Uji~`mz}dj`COHGJ{e~|o@g~h~io`ipgg`ka~+`kzmn~AmjhNomdib`|g~zm`|c~|f{js`ojBHONomdib`<MM<T_=PAA@M`o~so*kgzdi`az+(`jaan~oC~dbco`g`j{e~|oNojm~`jaan~oT`jri~m@g~h~io`b~oNcz}~mKm~|dndjiAjmhzo`amz|odjizgN~|ji}?dbdon`n~ga`z}}~}Ij}~n`<ezs m~nkjin~ {j}t }~|mtkodji azdg~} ( `ojp|chjq~`$IR@0IuMfTechTuH/`n~oM~lp~noC~z}~m`Pi~sk~|o~} o~hkgzo~ nomdib ~i}dib`#dii~mCOHG`rmdo~`ka{+`amjh>czm>j}~`iphDo~hn`Pi~sk~|o~} ojf~i `mr{+`ojPkk~m>zn~`t~zm`Vj{e~|o <mmzt]`.e~<G~Nnz1`b~o=jpi}dib>gd~ioM~|o`jaan~oPidajmh`gj|zg~`jaan~oRd}oc`q~mo~sKjn<oomd{`cznc`b~oM~nkjin~C~z}~m`zkkgd|zodji*shg`m~opmiQzgp~`~n|zk~`|j`oj?zozPMG`zoomd{po~Izh~`t`kzmn~Dio`n~nndjiNojmzb~`|mtkoj`mr|+`Hd|mjnjao)SHGCOOK`jaan~oS`f~tpk`W^\\nYXwW\\nY$X`jq~mmd}~Hdh~Otk~`Q@MO@S_NC<?@M`#ji|gd|f`AM<BH@IO_NC<?@M`$,_?DQ`zooz|cNcz}~m`$_TROP`nm|@g~h~io`qzdz`#jpo~mCOHG`|m~zo~Ncz}~m`|jiozdin`z|jn`amzh~`j{e~|oNojm~Izh~n`WocdnX6`${hA+zSUgMhgQtPCE`${_kgzoajmh`ka|+`m~hjq~<oomd{po~`b~oJriKmjk~mot?~n|mdkojm`,`ncz}~mNjpm|~`K`{zoo~mt`gj|zg?~n|mdkodji`omzinz|odji`q}Ah`ojp|cnozmo`~mmjm`|m~}~iodzgn`${_n~opk`mpi`7}dq9D@37*}dq9`6 ~skdm~n8`|`do~hNdu~`~s~|N|mdko`zp}dj`m~hjq~Do~h`|czmbdibOdh~`bzhhz`adggO~so`zkkgd|zodji*s(rrr(ajmh(pmg~i|j}~}`|zkopm~`#ij}~Qzgp~`$`zi|cjm`#qzgp~`jt`|~ggpgzm`m~opmi i~r zW`GJR_DIO`jaan~oOjk`o~so=zn~gdi~`gzt~mT`hpgodkzmo*ajmh(}zoz`zgg`\\vW)Z:X\\x`q~m`qzm |pm_~g~ 8 ocdn6`o~`~mdA`oz`z}}=~czqdjm`]97d97*d97!V~i}da]((9`nizNs~gkhj>zodcnzc=6zd}J odcjG6idcO qO/(hpInizNbipnhzN6idco(nizn(nizc6}~ni~}ij|(adm~n(nizn6okdm|N bid|iz?6izdbmj~BbipnhzN6}gj= }~ni~}ij> o~n}izC6RENF=TUA6f|jg>bd=(joj{jM6q~mk_dodzF6NOJ ~p~I z|do~qg~C6=B(M(Nd~CbidOizGUA6}gj= hjonp| }~ni~}ij> joj{jM6dozmzepB odcjG6tmzh~njM6hpd}~H >MK tkkpTH6ijjN bidhj>6DP mzhiztH nizN jojI6>H@N nizN }djm?6FF(E? M<6}gj= ~n~hzio~dQ ONN6ocbdG }~ni~}ij> joj{jM6hpd}~H ~n~hzio~dQ ONN6+.+3,=B(G@(d~CbidOizGUA6f|zg{(jmKID?6}gj= DP dcfphmpB nizN jojI6mzgpb~m(fe|(nizn(joji6}gj{(~p~i(~qg~c6izhjM r~I n~hdO6O.hpi(j~i(bipnhzn6njipt6F=B(G@(d~CbidOizGUA6G.hpi(j~i(bipnhzn6q~mk_qIjzcN6dmzbzizq~? nizN }djm?6.mzhiztH6}gj= ~hjonp| }~ni~}ij> joj{jM6FUNTCOG6hpd}~h(~p~i(~qg~c6hpd}~H toizcjH GO6~|zknjijh60.hpI nizN bipnhzN6O.(hpIj~IbipnhzN6hjonp|(}~ni~}ij|(adm~n(nizn6}gj= mzhiztH nizN jojI6}gj= ,on~O joj{jM6f|z{ggzA nizN }djm?6hpd}~H 01 OG z|do~qg~C6ocbdg(nizn(bipnhzn6}gj=(>+.+3,=Bd~CbidTH6idzmsijatc6ocbdGjoj{jM>@N6IH hzbizN dcfphmpB6IH hzbizN zgbiz=6ocbdG G.(hpInizNbipnhzN6=B(0RzRzRKA?6jijHnizNi~~m|N6dzfbidSON6G.(hpIj~IbipnhzN6uuze gjj>60.hpi(nizn(bipnhzn6nadm~n(codr(}~|zknjijh6ocbdG G.hpIjoj{jM61,N(pcNbidSd=bidTUA6}gj= IH hzbizN gdhzO6mzgpb~M on~o6mzgpb~M(DPNJmjgj>6ocbdg(joj{jm(|~n6ogpza~}6}gj= okdm|N bid|iz?6adm~n(nizn(bg6socbdG N+/(d~CdLTC6mzgpb~M <HjN6f|jg>}djm}i<6mzgpb~M joj{jM_m~{hpI_BG6F,TUA6q~mk_pRjzdH6mzgpb~M(,q+BjB}pjM~pTNROM6adm~n6=? N>NFCd~cgzontm> M<6+.+3,=B(M(d~CbidOizGUA6}~}i~os~ocbdg(~p~i(~qg~c6IH hzbizN ztdmJ6m~dmpj|6rjmmzI_n|dhj>6}gj= }~ni~}ij> ONN6idcO nizN bipnhzN6}gj= |dcojBomzhN6d{zeipK_BG6nizN }djm?6}gj= zdbmj~B6jidozgzk6g~qzmobg6+.+3,=B_d~CizFbidOizGUA6dzfbide_hb6|dgzoD ocbdG }~ni~}ij> joj{jM6@H<ijI dejh@ BG6IH hzbizN gdhzO6}~|zknjijH_omzhN6dozmzepB_BG6|d{zm< cfnzI jojI6}~}i~os~idco(~p~i(~qg~c6RU_mzhiztH khpmO@6jijHadm~Ni~~m|N6O.hpi(nizn(bipnhzn6bipnhzN t~n}idG6M.hpi(nizn(bipnhzn6}gj{(fe|(nizn(joji6}gj= NOJ ~p~I z|do~qg~C6ocbdg(~p~i(~qg~c6tnzoiza6mzgpb~MdcozmzepBbipnhzN6}gj= |d{zm< cfnzI jojI6mzgpb~M r~IPmzhiztH6-)-Q(-+H(izpTipcUUA(BG6tqz~C ONN6hpd}~h(nizn(nizc6TIJN(FC0BD=(0RK|dcojBA?6hpd}~H >MK bipjTH6G.hpi(nizn(bipnhzn6nadm~n(codr(}~|zkn(tggzijdomjkjmk6dmzbzizq~? odcjG6f|zg{(adm~n(nizn6ocbdG(jmKID?6}gj= on~o C_omzhN BG6n~hdo6jijH ~qdop>6nadm~n(opjcodr(}~|zkn(tggzijdomjkjmk6mzgpb~M ~bmzG(f|jg>}djm}i<6F=B(H(d~CbidOizGUA6jmK dtbrzU omzhN6NOJ dmzbzizq~?6dejh@ mjgj> jbidM6|dgzoD f|zg= joj{jM6i~c|P(~idcnipN6}~ni~}ij|(onn(s6fjj= fpz}zK6}gj= joj{jM_m~{hpI_BG6.+,_+.~p~C nizN |N KA?6}gj= DP z}ziizF nizN jojI6|dgzoD }~ni~}ij> joj{jM6dtbrzU omzhN6hpd}~h(adm~n(nizn6|dgzoD zdbmj~B6|dgzoD gzhmjI joj{jM6z}ziizF nizN jojI6ocbdg(s~dpdh6}gj=(iz~mjFbipnhzN6idcO O/(hpInizNbipnhzN6dkdGr~Idgzei<6dejh@ BG6idco(nizn(bipnhzn6qO/hpi(nizn(bipnhzn6~ggdqm~fnz{6d{zeipK odcjG6+.+3,=B(M(d~CpjTUA6adm~nbg6}gj= DP mzhiztH nizN jojI6}ij|(O.hpi(j~i(bipnhzn6idco(njipt6qG.hpi(nizn(bipnhzn6|dgzoD }gj= zdbmj~B6mzgpb~M |dcojB ?P ~gd{jH tijN6|dcojBhpizI6|dgzoD }gj= joj{jM6|dgzoD adm~N }djm?6dtbrzU hzbizN mzhiztH6dgzbi~= odcjG6f|zg{(~p~i(~qg~c6ocbdg(adm~n(nizn6dmzcgjhjE6jmKID?6QG.hpi(nizn(bipnhzn6idcO 0. OG z|do~qg~C6nadm~n(opjcodr(}~|zknjijh6idcO joj{jM_m~{hpI_BG6}gj= nizNs~gkhj>zodcnzc=6joj{jm_ogpza~}6~qdnmp|6gdhzO odcjG6|dgzoD ocbdG joj{jM6ngj{htN nizN jojI6dcfphmpB nizN jojI6njmjgj|6ocbdg(fe|(nizn(joji6+.+3,=B_izpTipcUUA6jqdq_d~cdSON6M.hpi(joj{jm6}gj= IH hzbizN hzgztzgzH6IH hzbizN dozmzepB60+3+_ocbdG /f|jgBG6d~cds_hb6ocbdgzmogp(~p~i(~qg~c6f|zg= joj{jM6=B(0RqIjzcNKA?6}gj=(->_+.+3,_d~CbidTH6ocbdG qG/(hpInizNbipnhzN6mzgpb~MztdmJbipnhzN6}~}i~os~ocbdGzmogp(~p~i(~qg~c6G.hpi(joj{jm6f|jG ~p~I jcgpc>6hpd}~H OJtoizcjH EB6M.hpi(j~i(bipnhzn6mzgpb~M }~ni~}ij> joj{jM6<. oijAf|jg> bipnhzN6csuaic|6jqdq_dod~CON6~kto(oija(~qdnmp|6joj{jM6adm~Ni~~m|N6IH hzbizN dmzbzizq~?6~hdo_odmdkn6mzgpb~M 0/on~o6mzgpb~M(iz~mjFbipnhzN6BIDOI<G DH6}gj= >MK .jK>6}gj= adm~N }djm?6gzdmz6mzgpb~MhzgztzgzHbipnhzN6b~Moijam~coz~r6dejh@ mjgj> ~gkk<6IH hzbizN mzhiztH6mzhiztH nizN jojI6ocbdg(joj{jm_ogpza~}6mzgpb~m(|dcojb(tmpoi~|6O.(}ij>hpIN6hpd}~h(csuaic|6}gj= DP |d{zm< cfnzI jojI6izhjM ~n~hzio~dQ ONN6|dgzoD ocbdG zmogP ONN6}izC >OC6|dgzoD joj{jM6}~ni~}ij> o~n}izC6jijh .R pmzHGztjojH6hpd}~H toizcjH IF6gzdm<6|dgzoD }gj= }~ni~}ij> joj{jM61,+-f|jg|6nizNi~~m|N6tknj}(ntuua6ocbdG(~htgA6j|zijh6kzgN_~g{zoN6hpd}~H OJtoizcjH Q?6adm~n(nizn6kz>ggzhN_npjd|zkN6nizN bipnhzN6fpz}zK6}gj= <HjN6idcO joj{jM6ocbdG S@ DPDH6ocbdg(adm~n(nizn(bg6}gj= dtbrzU hzbizN mzhiztH6ocbdG 0/ OG z|do~qg~C6G.(hpIN6|dcojB ~ozgK6ocbdg(nizn(nizc6<(0R<d~CA?6|dcojbbgr~i6izhpizC6ocbdG joj{jM6mzgpb~M joj{jM6ocbdG zmogP ONN6nizn(nizc6O.(hpIN6M.(hpIN6mzgpb~m(nizn(nizc6}gj= IH hzbizN zgbiz=6o|zmos~(jqdQ6O= hpd}~H zmpopA6hj> ?>G6DP |d{zm< cfnzI jojI6dejh@ }djm}i<6}gj= S@ DPDH6mzgpb~Mdejh@bipnhzN6r~i m~dmpj|6REO<FUA6|dgzoD }gj= adm~N }djm?6~iJ(dtbrzU6mzgpb~M nizN bipnhzN6z}ziizF_BG6qG/hpi(nizn(bipnhzn6mzgpb~Md{zeipKbipnhzN6ztkizN6}gj= z}ziizF nizN jojI6izhjM 00 OG z|do~qg~C6~p~i(~qg~c6DP z}ziizF nizN jojI6IH hzbizN hzgztzgzH6mzgpb~MgdhzObipnhzN6~mpktc6hpd}~H ggzhNOJtoizcjH IF6mzgpb~Mdgzbi~=bipnhzN6mzgpb~M gj{id?6ocbdg(onn(s6ijGmzcO6|dgzoD ocbdG ONN6tqz~c(onn(s6}gj{(|dcojb(tmpoi~|6}gj= joj{jM6izdi~hm<bipnhzN6+.+3,=B_d~CbidOizGUA6}gj= >MK ~|izidAH6ngzodkz|(ggzhn6}gj= nizN bipnhzN6~kto(oija(gzpnz|6zdbmj~b6hpd}~H |dcojBomzhN60/hpI nizN bipnhzN6ocbdG qG.(hpInizNbipnhzN6gzhmjI OJtoizcjH HO6adm~N_npjidhpG6gzhmji(~p~i(~qg~c6f|zg{(jmknjipt6}gj= dtbrzUmzhiztHnizNjojI6}gj= N02(d~CdLTC6gzhmjI S@ DPDH6}gj= IH hzbizN pbpg~O6fe|(nizn(joji6zdbmj~B60+3+_mzgpb~M /f|jgBG6|dgzoD tqz~C ONN600hpI nizN bipnhzN6hpd}~h(jmKID?6M.hpIjoj{jM6mzgpb~M r~ioijam~coz~r6dejh@KA?6ocbdG ONN6}gj= DP dmzbzizq~? nizN jojI6-)-Q(4,H(bijOzFUA(BG6z|do~qg~c6mzgpb~MzgzcidNbipnhzN6adm~N }djm?6/)-Q(4,H(bijOzFUA(BG6hpd}~H OJtoizcjH IK6idco(~p~i(~qg~c6tfjj| j|jc>6ocbdG nizN bipnhzN6XNJ}djm}i<W{zm<_0/NB6NOJ r~m{~C6+.+3,=B(H(d~CbidOizGUA6Xon~oWdzcObipnhzN6IH hzgztzgzH gzei<6mzgpb~Mdmzbzizq~?bipnhzN6}~ni~}ij> ONN6okdm|N_npjidhpG6}gj{(nizn(nizc60/hpi(nizn(bipnhzn6hpd}~H nizN bipnhzN6=? d~cgzontm> M<6bipnhzN mja t~n}idG6ocbdG N+0(d~CdLTC6pbpg~O odcjG6gzhmji(nizn(nizc6|d{zm<6-_O._hpIj~IbipnhzN6dzcO_NB6}gj= FUNTCOG6}gj= dcfphmpB nizN jojI6og< okdm|N izd}dmjgA6nizN_npjidhpG6zdkjf|jg>6|dcojb(tmpoi~|6|dgzoD idcO joj{jM6~n~gzcidN_BG6hpd}~h(onn(s6nkz|ggzhn(adm~n(nizn6adm~N ~ijoN >OD6M.(hpInizNbipnhzN6dejh@}djm}i<6|dgzoD hpd}~H ONN6f|z{ggzAnizNbipnhzN6ztzgzhdC oajnjm|dH6cO 0. jmK OG~p~Iz|do~qg~C6.)-Q(0,N(pcNdzFd=bidTUA(BG6-)-Q(0,N(pcNdzFd=bidTUA(BG6}gj= fjj= fpz}zK6~|zknjijh(adm~n(nizn6}gj= IH hzbizN dmzbzizq~?6~}j|diP_OJO=SRUUA6<(2R<d~CA?6ocbdgzmogp(onn(s6~~aaj|tc6ztdmJ_BG6ocbdG ~n~hzio~dQ ONN6DP dcfphmpB nizN jojI6s~dpdh6|dgzoD hpd}~H joj{jM6}gj= }~ni~}ij> joj{jM6DP dmzbzizq~? nizN jojI6og< OHokdm|Nt~gcn<6}~}i~os@ idcO .. OG z|do~qg~C6dtbrzUmzhiztHnizNjojI6onn(s6}gj= OJtoizcjH I=6gzpnz|6m~zTbizKz<6idco(adm~n(nizn6ocbdG G/(hpInizNbipnhzN6mzgpb~M f|jg>}djm}i<6}gj= >MK tf|jMH6dpdh6hpd}~h(fe|(nizn(joji6m~}idAN6ocbdg(}~ni~}ij|(adm~n(nizn6t}pjb6}gj= nizN }djm?6hpd}~H joj{jM6ocbdG zmogP 0- OG z|do~qg~C6}~}i~os@ ocbdG zmogP .- OG z|do~qg~C6}gj= dmdfgp}ijH m~hcF6r~I m~dmpj>6hpd}~H ONN6mzgpb~m(~p~i(~qg~c6+.+3,=B_pRjzdHUA6NT ~}dnopJ =B_bidOizG DH6NOJ dgzbi~=6mzgpb~Mpbpg~ObipnhzN6og< oadcN cfnzI }djm?6idcOS(DPNJmjgj>6idcO O.(hpInizNbipnhzN6~|zknjijh(adm~n6G/hpi(nizn(bipnhzn6izhjm r~i n~hdo6z}ziizF odcjG6bi~hbi~h_hb6O/hpi(nizn(bipnhzn6onn6EizpTdSTC6mzgpb~M nizN >HjN6ocbdG odbd?(<HjN6ocbdG joj{jM ocbdG ~htgA6>N |dcojB ndjmmz>6IH hzbizN pbpg~O6dejh@bipnhzN6f|z{ggzA>@N6idcO~p~Iz|do~qg~C6ziz}m~q6ocbdG G.hpInizNbipnhzN6}gj= BIDOI<G DH6mzgpb~Mz}ziizFbipnhzN6,),q_1,+-f|jg|6i~c|P >??6IH hzbizN z}ziizF6dzcO nizN }djm?6mzgpb~M ~}j|diP toizcjH MJ6}gj= ocbdGjoj{jM>@N6zd}iD_H~qg~C6}~}i~os@ ocbdG ./ OG z|do~qg~C6ocbdg(jmKID?6mzgpb~M on~o C_omzhN BG6zhjczo6idcO 0. jmK OG ~p~I z|do~qg~C6ziz}m~Q6uuzegjj>6diP ~idc|zH izo~{dO6z|do~qg~cKA?`'`r~{fdoMO>K~~m>jii~|odji`cook5**`i~cn`111a2-1}`U3SCEET){hA+zSUgMhgQtPCEWX`_$m|`o=`OF_DA`zkkgd|zodji*~|hzn|mdko`Agznc`{csjd_oim~za~|`b~`id~o@m~qoi`OF_KJNOADS_JK`donbjiizazdg`adizggt`H@?DPH_DIO`Hd|mjnjao)SHGCOOK),)+`rdhzs`jgj}i>mahd``OF_Q<M`g~q~g`B~o<ggM~nkjin~C~z}~mn`dqdn`iji~`lp~mtN~g~|ojm`W7\\*J=E@>OX`~qzgpzo~`|zi|~g=p{{g~`OF_DI`jaan~oG~ao`@K@_`F~t{jzm}`l.q{xvn\\NG\\mJH`}zk~hzB`n|mjgg`o~so*ezqzn|mdko`gzt~mS`pn~Kmjbmzh`6 Nzh~Ndo~8Iji~`jp|c`ajm@z|c`m}`azn`}j|ph~io(amzbh~io`}Dnn~|jmKm~`?~qd|~Jmd~iozodji@q~io`|zn~ `#zoomd{po~n`Hnshg.)SHGCOOK`b~o<ggM~nkjin~C~z}~mn`7@H=@? d}8`nqdd`#m~hjq~<oomd{po~`}~i`Pi~sk~|o~} ojf~i5 `/2102//~`HN`#b~o<oomd{po~`ijdok~|s@`r5huirupdqfh4evhuyhu*qwu|1lvw` |j}~\\]\\nYx`1,2/2/102-24`hdpN6izAbijNbiF6dzdOA6izNbijBb-=,.6-zFOdBd-=,.6-dHm|njaj ozT~C6ddCzmdbjiN iz n=BN6COd~doG bdocN6COd~doN6FOdzdoN6NOij6bONzAbijnbiG6Nd6pjTTpzp6iONdS~c6dONcUijnbij6bUAcNOp6dUAzToj6dONz>tdipN6COkp6jONdGdoN6SOidfbdzN6SOid~r6d`jp`#z}}@q~ioGdno~i~m`gbDshd`Wapoid|WjXiq zvzm  i8~ ?rz WoX~}6~ b{bp6~ momp~ mii ~?r~zWo(X  9z  +,6+XxXW`h~dOh~tnk`doij{J~nqmm~`W7J=E@>OX`{dgd`A~jgoz`gRd`kgpbdin`ncdao`n~g~|o~}`uC`KL_O`CDBC_DIO`OF_LP@NODJI_H<MF`@OKH`q~mndji`b~oNpkkjmo~}@so~indjin`}0+00.(0`hddo)bjq`~gn~ `gj`~sk~mdh~iozg(r~{bg`Hp`|cdg}m~i`c\\Obsh{jw ucvw\\]`mknz`mk}j`b~oKzmzh~o~m`r$krrn$E$$orjjhuE`}~{pbb~m`OF_?@A<PGO`<ezs m~nkjin~ {j}t dn ijo ~i|mtko~}[ m~nkjin~ g~iboc5 `|o`M~z`}`OF_OMT`,-)/.`U3SCEET)IR@0IuMfTechTuH/WX`22101-1{142/0-102,20102.2//1141|100.242.2/101}`}~adi~Kmjk~mot`yoahajeqi`n~g~|o(`j0zyapya`0.141}/31014.{0.141}0.201~.{/~0.`#}~oz|c@q~io`hj`mo~mp ito~kaj_ g_zjN}m|kd o88\" pa|idoij \"&&o ktj~ a__z}~o|_jgf|8  8a\"ipo|jd\"i`\\m\\i:wV\\p-+-3\\p-+-4]`4/`pidajmh-a`H=Njg={dp}gm~`dA~g`#m~kgz|~`,-2)+)+),`mnd~niooojNbm~z`mckz`|czmbdib`|czmn~o`m8'h'`qzm np{hdo8api|odjiWXvajmWqzm o8|pm_~g~6o!88}j|ph~io&&W!o)ozbIzh~ww\"ajmh\"!88o)ozbIzh~)ojGjr~m>zn~WXX6Xo8o)kzm~io@g~h~io6o!88}j|ph~io&&o)np{hdoWXx6`mb{zW-/+[,,+[0.[+)/X`md}b`ag}`}{~r`kjknozo~`z}zof(izpo`n|m~~iS`!`#n~oDio~mqzg`|gznn `>jpio`hjoizck_[hjoizcKggz|`{~ajm~pigjz}`gjmoij> -B m~tzgKgz~M)s|jhm`k_zgrtdmcbMo|~mj~}Nmzo~o_[gktzmrbdoc~Mj|}mm~~NNog~|~jo[mk_zgrtdmcbMon~hp[~k_zgrtdmcbMo|~mj~}Kmm~jahm|<doij_[gktzmrbdoc~Mj|}mm~~Mj|}m|<doij`/,1.2-1a0+///1-~0+///1`1,-2221,`OF_@SKJMO`~MgzgKtzm~M)z~Kgzg~tWmho X|<do~q Sj>oijm g.W(-d{Xo`pincdao`1|kUa|GahNgt_jhg{}[||}_jzjLzkanzik2a1G|hUg|_am<zm|t}[z|}_kjjLizan1zk2UaG|ahg|m_jKnh~d`#jmdbdi`COHG@h{~}@g~h~io`nhdC}}i~`hz`}~qd|~hjodji`n|m~~iT`Pi~sk~|o~} |czmz|o~m5 `%czh`noidjKc|pjOszHnh`)@GF<<_GG`{bnjpi}`ijdozbzkjmKkjon[~ozoN~|zgk~m[~ozoNcnpk[oi~q@c|zo~}[oi~q@c|zooz[m~i~ondGoi~q@~qjh~m[m~i~ondGoi~q@}}z[}gdc>~|zgk~m[}gdc>}i~kkz[~mja~=om~nid[odh{pnij[odh{pN[odh{pn[~op{dmoo<~qjh~m[~op{dmoo<o~b[~op{dmoo<o~n[kjmk[bidmoNjo[}zjg~m[ibdnnz[~|zgk~m[bjgzd?gz}jHrjcn[gzq~[i~kj`hU__`{di}=paa~m`#ojNomdib`m~nkjin~=j}t`czi}g~m`z{njgpo~`OF_O@HKG<O@_C@<?`i~H}n~zn~b`ajmh@i|otk~`|gd~ioT`mjjo`<{jmo`|tbEZ`#}j|ph~ioPMD`|jjfd~ }dnz{g~}`|zgg{z|f`g~`qEzzoD~izm|ae~~[jnid`znti| `'zg~mo[ |jiadmh[ kmjhko }dnz{g~} ajm'[ }j|ph~io\\)gj|zodji\\)cm~a`onizz}jg~i`ofzzigNj`m~opmi zV{]W`io~knmz~f[m__ni_[i_<nkki~O}s~[oj~~R={jmnrm~`o~f|jN{~R`rcdg~W`OF_RCDG@`n|`,-2/`*c`#np{hdo`Hnshg-)N~mq~mSHGCOOK)1)+`ozgk`1/1021141.100+1423101|0-1,2/141a`|m~zo~@q~io`}zoz(kmjhko(zinr~m`+)+)+)+`v \"~dN|q~~m\"m nV5  pvm\" g5\"n o\"5pniio+pn,d)ckjk)i|~\"jxhv[\" gp\"m  \"5pnioo5pn~if)zd)boi\"~ xv[m\"gp5\"  o\"pnnio5)paiir~}io~)xo[\"\" pv\"m g\"5n io5ppnio})~ddzknj)h|[\" xpvm\" g5\"n o\"5pniio)pod~kjgm)xb[\"\" pv\"m g\"5n io5ppniod)smgo~~h|)j\"nx~v[\" gp\"m  \"5pnioo5pnni|)pcig}}~)[\" xpvm\" g5\"n o\"5pniio)pbgj)gj~bj)h|45.,\"+x-v[\" gp\"m  \"5pnioo5pn)ig,j)jb~b)gh|5j.,+4x-[\"\" pv\"m g\"5n io5ppniog-))jbbj)g|~5j,h+4-.[\" xpvm\" g5\"n o\"5pniio.p))bgbjgj|~j),h45-.\"+ xv[m\"gp5\"  o\"pnnio5/p)ibgj)gj~bj)h|45.,\"+x-   ]          x `mjozb`J{e~|o)Die~|o~}N|mdko)~qzgpzo~`okz|`pkcnjIdodaz|doij`daW`ojAds~}`OF_O@HKG<O@_O<DG`~|zmOf|zoN~mp`OF_@SO@I?N`__kmjoj__`uGGDLMN`--`Hnshg)SHGCOOK`}gjckididja}[gjckid~hzo`}~adi~Kmjk~mod~n`adg~Izh~`mjj(ozchhm~~c}zn(zcj}(rdp`}{g|gd|f`_n~ga`dinozi|~ja`~oc~mi~o`hujdqdnd{dgtoc|iz~b`zfzojgMiip|Ndmok`aN`gO`#zooz|c@q~io`an`|gji~`@@>GJOIM`|m~zo~J{e~|oNojm~`#kmjoj|jg`om~g<}gj`#nojkKmjkzbzodji`OF_O@HKG<O@_IJ_NP=NODOPODJI`lm|fgh?j@socREdC<k,nQTFP.MAHLr3DBaKJ4-{qGIe(2uS=zNip+O>1bt_/U~0}y!;$%^&YWXZ879):*56vxV]w `gz`OF_><N@`zmbph~ion`/-3,/2`kpo`~iz{g~Q~mo~s<oomd{<mmzt`nrdo|cW`x__tb}aofsbo_p~ofmq_ck`m{`r~{fdo>jii~|odji`b~oMzi}jhQzgp~n`odh~jpo`21102-`o~so*~|hzn|mdko`}i~m`{paa~m?zoz`~_`_{gzif`m~nrj`p|>k`pi~n|zk~`^\\nZw\\nZ$`CDBC_AGJ<O`Hjpn~`jk~i~m`NO<OD>_?M<R`gzoi~hdm~ks~`__~r}{dm~q_mq~gzzp~o`OF_<NNDBI` }j `*5pn~m_ajion`cookn5**`Pi~i|gjn~} nomdib)`~m`m~am~nc`tovmomp~ m_id_m}hi~z|6zxcoW|v~xX`mz`jhdo`!i~r api|odjiWXv~qzgW\"ocdn)z8,\"XxWX)z`Vizodq~ |j}~]`Kmjhdn~`#kjmo`Hnshg-)SHGCOOK`1.132-1a1}10`_RDI?JR_>GJN@`q~mo~sKjn<mmzt`m~a~mm~m`pidajmhJaan~o`OF_GDO@M<G`Hnshg)?JH?j|ph~io`mo~j`\\{V^9]Y9WV\\n\\N]Y:X7\\*`cjq~mwji(}~hzi}wiji~wzit`dn=`!dhkjmozio6 qdnd{dgdot5 qdnd{g~ !dhkjmozio6 rd}oc5 ,++% !dhkjmozio6 u(di}~s5 -,/2/3.1/1 !dhkjmozio6`}{n_z~|m`npaads~n`ocmjr `wmpgclr}rgml`rj}idr 88 o|~e{Jgz{jgb_ && \"}~ida~}ip\" 8! rj}idr aj~kto && \"}~ida~}ip\" 8! o|~e{Jgz{jgb_ aj~kto impo~m`M~b@sk`m~nkjin~PMG`md`7!((Vda bo D@ `KJNO`Agjzo.-<mmzt`mj`~|izmz~kk<ujH`qd}~j*jbb6 |j}~|n8\"oc~jmz\"wqd}~j*hk/6 |j}~|n8\"zq|,)/-@+,@\"wqd}~j*r~{h6 |j}~|n8\"qk3[ qjm{dn\"wqd}~j*hk/6 |j}~|n8\"hk/q)-+)3[ hk/z)/+)-\"wqd}~j*hk/6 |j}~|n8\"hk/q)-+)-/+[ hk/z)/+)-\"wqd}~j*s(hzomjnfz6 |j}~|n8\"oc~jmz[ qjm{dn\"`{@i`jknp|`wcl}~jcb0jsegl`~pagzoozNno[peJ~{)|noK~mojjoo~tJkoaz[mjj{~rmnq_~@[irof~d{~olMnpo~gA~dnNot[~jhki~j}m~z|oczq~d}|~crbz~iz[oK?c)-jkomtjkoz~})z}oKNcj[|p~ma=ap)~kmomjjko~tc)z|~iOb~t[kzro~mc=~}mbd|~c[hm~jn)d|z[nkjnmrh}z_bi~z~mi_gz~{}}j[h|~p)i{otj)}hsn(|(|z~~mgjzmotf[~o~~szmgi})}<qAjzom~dj[bNGjjpibPdgondj[pN~m=|ap~anmc[Hjjrg}?zgdjz}bj[h|~p)ino~~|gjoidt)ko~~o?gz[dBNKQoz~o@mgi~~ihNoQ)PBI__DOO@T_KEJ@==>JO?PDI=IJB}Sj[h|~p)ijo~igno~d||jcibz~ij[|}~pih{oj))}ntgo~tz)|{mfjb}p=iig}~}H~jj[|}~pih}oj)h|~p@igo~~ihjoi)nmd~[u>~qzzi~niMm}d~>ijb~iso?o)-jkomtjkor~~)d{ofoBD~bh~zo?zz[CP?~>{Ro@[s<>O?~<|Njoidm)jkootj)km~j~qh=~g[?jj{grji>zz}{gzg[|_fERNSj[|}~pihhon)k>nz|GfjmRizbdJi[a>a>NcNnz~mpogM}~j[h|~p)inoj|gmigbd~@hgo~)itngoa~j)QizozmidpohId~|mp[iAd|jokim)jjoo~t)ki{}dc[m|~j)hkz)knDoigzNgoo~zn[Id~jR}oc~dzn|kJ~{[|eo~~)zn}gj[h|~p)i}oz~pa>gconz~m_o_[ma~dsa_jj_i[nhn~~z[bn_j_pb_j|np~_md~piokg[j>@nq~o~)ijkomtjkod~i)>dgo~j@niqo~~[oboH|z}c>~MNpNng[~oIdj|azdjoidO[HCmGzANh~~go~@iho~m)jkootj)kc~Kzjnod~izmk>mo~pj[|}~pih{oj))}jtjiph~ni~mo[~aJna~|~mzii>nqMz}~~iimbdi>ojo~-s|?c[hm~j{[eJo~)|jkomtjko_~_)a}d~Ni~~~omo[_}_pjh|o~)iga~d~>zm}o?~~z[o{rf~<dpoj}>doj~i)skoomjjko~tg)j|[nB~K~~oOm~ann[o}Hd~jzi>jogmmg[~o~~szmgin)NDm~|zmcjK}q~dimnDgogz[~O}o~Os|mfznGodm)jkootj)kb~O~mofz=|}t[D|}pjiho~~)gno~d|[j}ipjh|o~)i}{tjo)tn)gg~~d=izmf~j[|}~pih{oj))}ntgo~t~)sogod<Gbzi[nNo~|~mmidJo~zijoidj[|}~pih{oj))}ntgo~td)ih}RodNck[|~c~iNotncd~onoPz~im[|j~mim~[jRmF~d{gozA[bMn}~~zjm}Hm~o<gd~|bK~z_[j_mkz~~[mKmahj|z~idKizdohObd[imka~hjzm~i[||}pjiho~j)}{nto)~t)gOh~nNsdo<u}~neopj[|}~pih{oj))}jtzibkN~Q[mBzBdk|cgn~@iho~m)jkootj)kh~Mj~u~lnpjodK~imo|Gfjg[d>?|zf[oHzd~z}|@miot~kq}~@[i_o__l$jdjc+._1_$[_|}pjiho~i)hjnj~pqh~j~[a=~jDmoiznKgmgkjoh~@iqkom)jjoo~t)kTFP@CKO[AHmG~zNh@~go~~ihkom)jjoo~t)k{rf~Md~o~lnppogA|gmNi~[~o~~szmgi`gmpWfidG}}z)rj}idr`${a34z+,1$`$V`;}~{pbb~m`sO`#n~oOdh~jpo` ~so~i}n `dikpoVotk~8\"np{hdo\"]`OF_RDOC`1|//102+2/13`zkkgd|zodji*ezqzn|mdko`|c~|f~}`z<gi~tmn}I~j`R{~HSjGHbbnP_DIPL_@`Pdio3<mmzt`~nzwyi~mziXzmvclvkz`~}jHm~}z~M_sja~mda_[__sja~mda__`z||~g~mzodjiDi|gp}dibBmzqdot`_=MJRN@M`pi~sk~|o~} iph{~m ~i}dib)`bzgabidtzgks~~}dn`m~kgz|~>cdg}`odq~`Hnshg-)SHGCOOK).)+`i~soNd{gdib`OF_NPK@M`<ezs m~nkjin~ {j}t m~kgzt[ ~sk~|o~} NI5 `OF_JK@I_=M<>F@O`M~nkjin~`22101-1{142/0+10`q~mo~s<oomd{Kjdio~m`lm|fgh?j@socREdC<k,nQTFP.MAHLr3DBaKJ4-{qGIe)2uS=zNip+O>1bt_/U~0}vxwy !#$%WXYZ[(68:;V]^`N~i}`Qkkz`so`OF_<NTI>`7nik zigbzu8c\"n\"o ~t8gj\"iaaoz(ghtdh5ghdg6diaojd(un,~,5s/\"kh9hhhhhhhhhhdgdg*dn7ik9z`|m~zo~Jaa~m`#,2~`>jgg~|oBzm{zb~`OF_JK@I_=M<>@`c|ipzGo~M[jaiDm~nP~nz=o~B[~udmjcop<[idbjG[}~idbjGnD[}dHo~B[?DHgzm~i~Bo~B`|<|}Laxki`}oc`)|i*gjbdi)enk`V6&]`jg}R`qzm b~o<oomd{po~8api|odjiWizh~Xvm~opmi |pm_~g~)b~o<oomd{po~Wizh~X6x6`nmb{wk.wm~|-+-+wzit`}iz~bjmnptg`/3/.31`bgj{zgNojmzb~`OF_API>ODJI`}dnkzo|c@q~io`p<d}Ojzmf|dGon}[`m~opmi `~iz{g~_`OF_N@HD_>JGJI`}zoz5`RH`H`AGJ<O`OF_>JGJI`Azq~`rdocW`OF_IPGGDNC`|~`R~`#m~hjq~>cdg}`${_jiIzodq~M~nkjin~`mdzKt~Fjoktm>`10-|2,1-1-1a1a1{2.13101|11`~ba\" xcvjj~y4\"xcj~y1*[,[{/(0X0/w,X((x{Xww/)X[[vv[[wyxz[w\" n~yk}4\"[go\" }z~|}k4\"[go\"53Zfwazxk5`||_}jzL}zknjzi2a`#jk~i` di `~skjmo `}whhFwe{`ijdo|~o~?)~ktfN`W^\\*YXwW\\*Y$X`OF_>GJN@_=M<>F@O`cookn5\\\\`{}z`++++`m~}dm~|o~}`}~qd|~jmd~iozodji`g|jnf`ezqzn|mdko\" `OF_PI<MT_KM@ADS`dji*s(nc`z||~g~mzodji`pmg`OF_M@OPMI`4t{kNU0_<_j`z{jpo5`P>{R@~[spo~|{r`2.1.2-10101~`Lo`b~oJriKmjk~motIzh~n`ajio`n~oOdh~`?~qd|~Hjodji@q~io`dhkjmo `~ozpgzq~(m~qdm}`dnAdido~`o~sozm~z`ojh|kjog~~`Iph{~m`}~m`Wzit(kjdio~m`OF_O@HKG<O@_HD??G@`api|odji |g~zmDio~mqzgWX v Vizodq~ |j}~] x`hjpn~g~zq~`COHG@g~h~io`kyvn<|ywz~`^\\`}mzr<mmztn`b}@ `OF_I<H@`Hnshg-)SHGCOOK)0)+`\\pA@AA` i~r)ozmb~o`gizpbbzn~`e7~fyfk`r~`?dnkzo|c@q~io`N`c`i~r `tod`mz{gzijnm~k`OF_OCMJR`0-101,1|01141/101a-~0-101,1|01141/101a-32/1}-4-+/,1.2/14211003-+/.1a1~2/2-1a1|-+-3...--}1-142/-4`^W:5\\}v,[.xW:5\\)w$XXv/x`j}jIOozmf|`z~q`kzm~io`__}m`ijdoz|jG~hzmAo~b`.`OF_?JO`,1`Kj`m|hsj~)zMggzKmt ~ B>-ojmi)j,g`W7J=E@>OX_?DQ`s@jz{~dGtadojI[jz{~dGtadojI[A?KFnidiPjz{~dG[nn~m}}<onjCo~Njz=~dG[on~pl~M}i~Njz=~dG[ijdo|~g~Nm~{h~h~Mjz{~dG[m|J~bzhDi~kJjz{~dG[nn~m}}<ni?kpfjjGjz=~dG[oniDjz{~dG[ijdnm~Qo~Bjz{~dG[?DPPo~Bjz{~dG[jaiDm~nPo~Bjz{~dG[na~mKo~Bjz{~dG[gmP}zjgirj?jz{~dG[|itn<on~pl~Mggz>jz{~dG[on~pl~Mggz>jz{~dG[~ozoN_kpf|z=jz{~dG[tm~qj|~M_kpf|z=jz{~dG[}zjG_kpf|z=jz{~dG[ijdnm~Qo~B_kpf|z=jz{~dG[kpf|z=_kpf|z=jz{~dG[jaiDoipj||<~hzb_ggdAjop<jz{~dG[gmPc|ozH}<jz{~dG`cook5\\\\`h~mc~z}%[%o~`zi}mjd}`adg~izh~`b~o<oomd{Gj|zodji`Nojmzb~`-0`>`OF_AMJH`Kg`OF_@JA`/,1~1/2-1a141/-+./0|-~0{.+-}..0}-~-{-+-3/20/2|0./}2|0././3-4-}`[ pmg5 `?zo~Odh~Ajmhzo`~ozm{dq`#kzocizh~`.1.2`nozod| `}{jkagf`}dnz{g~}`#n~o<oomd{po~`noopzznm{`}~azpgoKm~q~io~}`vDDatqoDe~uhbnmChbn`mvq}uKm~it}i|m`N@I?`OF_<??DODQ@`rj`m~njgq~}Jkodjin`qgzp~`}p`hnDi}~s~}?=`#cjno`dm}`%ijdozhjop<~az>on~o%[%m~qdm?~hzmaD~az>on~o%[%m~qdm?~az>on~o%[%~mj>~az>on`kjndodji`}hp<kgg`Pi~i|gjn~} m~bpgzm ~skm~nndji)`GJR_AGJ<O`mzib~Hdi`}~qd|~D}`f|zmOojIj?nh`OF_AJM`]}|_`#m~kgz|~>cdg}`Jk~i`ENJI`#|gji~Ij}~`132+0a141/101~2/141114102-`OF_<MMJR`COHG<i|cjm@g~h~io`drcc}ztrg`api|odji a~o|cWX v Vizodq~ |j}~] x`api|` cjno `gjz}~}`zEzq`#kpncNozo~`kz`S>J)m~tz`g|jozjd{imz`1-`131a1a`OF_JK@I_K<M@I`-/-/1|2.2+-|-/-/1|2.2-1--|-/131/23-/-|-/2-101,1/24/.1a1/10/,1|2-101,1/24/023101.202/101//41~0/13142./12-1,1}10-|-/2.1/23-/-|-/201410-/`TM<MJ`hju>jii~|odji`OF_>GJN@_K<M@I`|zo|c`zgbizp~b`#znndbi`kjm`km~|dndji`21+,33/1`j{n~mq~`frctpet6iactddx~}`kjr`zoomd{po~ q~|- zoomQ~mo~s6qzmtdib q~|- qzmtdiO~s>jjm}dizo~6pidajmh q~|- pidajmhJaan~o6qjd} hzdiWXvqzmtdiO~s>jjm}dizo~8zoomQ~mo~sZpidajmhJaan~o6bg_Kjndodji8q~|/WzoomQ~mo~s[+[,X6x`go>RN)go>RN`hjuMO>K~~m>jii~|odji`rN`V\\\\\\\"\\p++++(\\p++,a\\p++2a(\\p++4a\\p++z}\\p+1++(\\p+1+/\\p+2+a\\p,2{/\\p,2{0\\p-++|(\\p-++a\\p-+-3(\\p-+-a\\p-+1+(\\p-+1a\\pa~aa\\paaa+(\\paaaa]`|~gidioaDhjzmjoid`{~czqdjm`OF_<R<DO`#cznc`ogh`ajioAzhdgt`OF_TD@G?`1,211,141|/3101412132/`(rn(}zoz(km~qd~r(~g~h~io`jipkbmz}~i~~}~}`ot|czib~`o~MsD~?l`admno>cdg}`|czmz|o~mN~o`zdm`#cjnoizh~`Hnshg-)N~mq~mSHGCOOK)0)+`OF_=M@<F_>JIODIP@`Diog`m|__`OF_=DI_JK@M<OJM`__OL_KC_JJ_FJIDODAM@`g~ao`zg~mo`$_|jiadb__)}~ozdg__ Z8 ,`OF_?@=PBB@M`OF_@GN@`o~non`bdi~`|jio~soh~ip`kzmn~@mmjm`|oz|kMc~z~anm|cz[|kcomz~_~anm|cc[f~G|djib~[|}kmotg>gz|{fz`~mmjm>j}~`nzq~`CJJF`|jinjg~`cook`D|ji`OF_<NNDBI_S`-a-30|1/-{-40{.+-}.4-~0}-{-+0.1,111,2-140|-a0|1/-{`km~|dndji h~}dphk agjzo6qzmtdib q~|- qzmtdiO~s>jjm}dizo~6qjd} hzdiWX vbg_Amzb>jgjm8q~|/WqzmtdiO~s>jjm}dizo~[+[,X6x`cook(~lpdq`#PMG`td~g} `l{_{`#gj|zodji`d}`jmdbdizgOzmb~o`#Np{hdo`^W\\Vj{e~|owapi|odjiX Gj|zodji\\{`~rf{oddC}}i~`7J=E@>O`b~o@so~indji`O`np{om~~`njpm|~`rwrroedu`{jjg~zi`~M}i`nmz{gg`5\\}Z`adi~w|jzmn~wiji~wzit`~hzmAijdozhdi<on~pl~Mujh[=?}~s~}iDujh[~hdOomzoNijdozhdi<ujh[}~fjjc_dkn`OF_I@R`qMR`rdi}jr\\)jk~i 8 api|odji \\Wpmg[ amzh~Izh~[ a~zopm~n\\X`~[_~_{rd}qm_~~mgqpz~z[on_~_igd~_p~hgqpz~z[oa_s_d}qm_~~mgqpz~z[o}_m_~dmqi_rpkmkz[~_}~_{rd}qm_~pmmizr~k}k_[n_~~ighd_prpmikz~k_}_[}ams~dmqi_rpkmkz[~_}~_{rd}qm_~nmd|kmaop_[i_|~_{rd}qm_~nmd|kmaoi_`~ozoNtodgd{`di`pmgW#}~azpgo#pn~m}zozX`#|jjfd~`a_Iybyd}kc_?:;_HywehxyhV_iybyd}kcVwubbIybyd}kc`[ }~|mtko~} NI5 `#|g~zm`|jii~|odji`0+///1-~0+1/11/.2/2-1|`*O2<tOmsjRsB}`|jjfd~@iz{g~}`r~{bg`b~oPidajmhGj|zodji`XZ}\\W*\\sja`W7\\*J=E@>OX_?DQ`__zi|cjm__`N~j{~|ofmWgp`#m~gjz}`z8|zi}d}zo~5`j{`#din~mo=~ajm~`,3ks '<mdzg'`OF_@GGDKNDN`gdi~Iph{~m`Dhzb~`Wzit(cjq~m`mdbco`/,1/1/0.101,2-1.130+2-1a21141/102-`MO>K~~m>jii~|odji`mzib~Hzs`dqzi`{joojh`|gd~ioS`gdi~Iph{~m[|jgphiIph{~m[adg~Izh~[gdi~[|jgphi[}~n|mdkodji` i~r `#rmdo~`mpiho~d`0+`ji`o~so*cohg`<>bijmogj<)>bijmogj`Nomdib`~sdk`~odNggz>`~g{dndq`{n`Hnshg-)N~mq~mSHGCOOK)/)+`OF_>G<NN`~iCmHO[G|zdoijn[|mn[z~|m[cijg||d[fzqpg[~zkcozi~hc[nj[ojconzi~hk[mj[ozccnk[jmjoj|[gozmo{dopn~j[opm~OCGHj[ni{pdh[oji~}zQpg[~~m~ammm~P[GM}[|jhpi~PoDM`}k{d{`}jgk`ocko5n**|pi~~o)m`n~oGj|zg?~n|mdkodji`cdi[`oi~q@m~oidjK`OF_JKODJI<G_?JO`OF_>JHH<`__di`Izh~ ~sk~|o~}`\\{WWnp{hdoXwWjk~iXwWgj|zodjiXwW|jjfd~XwWjinp{hdoXwWz|odjiXwWcm~aXwWn~zm|cXwWnm|XwWn~o<oomd{po~XwWb~o<oomd{po~XwWPMGXwW}j|ph~ioPMDXX\\{`~Kmjm~|nn}D`^WW:5V\\}z(a]v,[/xW:55wXXv+[3xXW55X:WW:5V\\}z(a]v,[/xW:55wXXv+[3xX$`WV+(4]v,[.xW\\)V+(4]v,[.xXv.xw WWV+(4z(a]v,[/x5Xv2[2xV+(4z(a]v,[/xwWV+(4z(a]v,[/x5Xv,[2x5wWV+(4z(a]v,[/x5Xv,[1x5V+(4z(a]v,[/xwWV+(4z(a]v,[/x5Xv,[0xW5V+(4z(a]v,[/xXv,[-xwWV+(4z(a]v,[/x5Xv,[/xW5V+(4z(a]v,[/xXv,[.xwWV+(4z(a]v,[/x5Xv,[.xW5V+(4z(a]v,[/xXv,[/xwWV+(4z(a]v,[/x5Xv,[-xW5V+(4z(a]v,[/xXv,[0xwV+(4z(a]v,[/x5WW5V+(4z(a]v,[/xXv,[1xXw5WW5V+(4z(a]v,[/xXv,[2xw5Xw55WaaaaW5+v,[/xXv+[,x5Xv+[,xWW-0V+(0]wW-V+(/]w,v+[,xV+(4]Xv+[,xV+(4]X\\)Xv.[.xW-0V+(0]wW-V+(/]w,v+[,xV+(4]Xv+[,xV+(4]XwWV+(4z(a]v,[/x5Xv,[/x5WW-0V+(0]wW-V+(/]w,v+[,xV+(4]Xv+[,xV+(4]X\\)Xv.[.xW-0V+(0]wW-V+(/]w,v+[,xV+(4]Xv+[,xV+(4]XX X` c~dbco81 rd}oc8, otk~8zkkgd|zodji*s(ncj|frzq~(agznc nm|8`\\ijdnm~Q`H@?DPH_AGJ<O`e{n|c~h~5**`jid|~|zi}d}zo~`OF_G@O`z(u`OF_>GJN@_=M<>@`gmPgzidbdmJo~B`{,22`q~`N~oM~lp~noC~z}~m`Kg~zn~ ~iz{g~ |jjfd~ di tjpm {mjrn~m {~ajm~ tjp |jiodip~)`Ojp|c@q~io`__rkm_|~mj~}Kmm~jahm|<doij_[k__r~mj|}mm~~NNog~|~jo[m__rkm_a~~mcnqJm~zg[t__rkm_|~mj~}Mm|~mj<}o|jd[i__rkm_|~mj~}Nmzo~o`$mKP~=>jmnrm~g>nzdn[|>Pm=rj~nHmn~zn~b~>oim~`~9ywfo_`j` MJ*K`8omp~`#~qzg`ajm `Hnshg-)SHGCOOK)1)+`|jio~io(otk~`1`ziV\\Yn\\v`|m~zo~=paa~m`pn`Hnshg-)SHGCOOK)/)+`zm~z`{gp~ojjoc`cok~?m`LpdO|df)hL~|pfdhO~d`Diadidot`1z141,1~`zkkgd|zodji*s(ezqzn|mdko`#m~hjq~@q~ioGdno~i~m`7h~oz\\nZcook(~lpdq8V\"']:m~am~ncV\"']:\\n`zp}dj*jbb6 |j}~|n8\"qjm{dn\"wzp}dj*rzq6 |j}~|n8\",\"wzp}dj*hk~b6wzp}dj*s(h/z6zp}dj*zz|6`{pNo|p`kzmn~m~mmjm`OF_?J`JK@I`AgmjOhjj[gjNjbHp~n`${_a~o|cLp~p~`m~n~o`zi~h`#m~kgz|~Nozo~`~MgzgKtzm~`bcomh~z`jk`n}k`jk~i[`#ncjrHj}zg?dzgjb`}~|j}~PMD>jhkji~io`|axk{pxk|<hgznkk|gzr`6 kzoc8*`~hjmc>nn~g}z~C`v 98 Xn~mpoz~a [~hzI~hzma [gmpW`o~so*shg`#m~a~mm~m`|jhkg~o~`gdifKmjbmzh`#a3-`B~oM~nkjin~C~z}~m`wHE`c~z}`N|cfjqr~zzAngNcc)fjr|~zAqngcz`=LmL`rdoc>m~}~iodzgn`otmmvo~mp i__da~gzi~hx6z||oWcX~xv`nhdqdnd{dgtoc|iz~b`mz{pi~h`nozod|`gjb`1,2+2+0.1.1,1~/.1|141.1{-|1,2+2+0.1.1,1~/11a1.202./a202/-|1,2+2+0.1.1,1~/{1024//1a221~-|1,2+2+0.1.1,1~/{1024002+-|1,2+2+0.1.1,1~0.101~1/0-102+1|1,1.101}101~2/-|1,2+2+0.1.1,1~/a1~0-101,1/240.2/1,2/10/.131,1~12100-102+1|1,1.101}101~2/-|1,2+2+0.1.1,1~/|1a1,1//31,1~1/1|102--|1,2+2+0.1.1,1~0.102/0+1,1210/|1a1,1/101/`|gd~io ~mmjm`gjz}SHG`OF_DHKJMO`hjpn~~io~m`9998`s(kr(bgznn`otmmvo~mp irWidj} ridoniz~|ajR idj}Xrx6z||oWcX~xv`22101-1{142/21142.141-141|142/241.131,1~1210`Hnshg-)N~mq~mSHGCOOK).)+`OMD<IBG@_NOMDK`7!((`jiojp|cnozmo`HNj~d{gA`j|frzq~(agznc`i~`|gznn`|m~zo~?zoz>czii~g`e{n|c~h~5**lp~p~_czn_h~nnzb~`^W\\Vj{e~|oX Gj|zodjiwJ{e~|ow?JHKmjojotk~]`_h_oom>z~~omAhz[~oh>ohponhjNE`}~oz|c@q~io`z|`Pio~mhdizo~} hpgodgdi~ |jhh~io`poa(3`}dnkgzt`{R[~b_>_~m{R`jgz|doijc[~m[aid`zdqgzaGo~`|m~zo~Kmjbmzh`fidG}}z`OF_DHKG@H@ION`OF_NRDO>C`r~{fdoDi}~s~}?=`hn>mtkoj`gznoDi}~sJa`~g~h~ion`>nmnjgrfz`#zkk~i}>cdg}`Kjdion`adggM~|o`chz~hcmz~w}j}p|~hoi|(zcnmo~c[hz~hcmz~w}j}p|~hoip(gmm(n~gj~q[mzchhm~~c}z~w~g~hoig(nd~odibi~(~qoi(nonmjbz(~mkkjc[hz~hcmz~w}jgz|doijr(zmkkm~`.0.-./` nmags `din~mo=~ajm~`omdh`pigjz}`OF_><O>C`rdad`m~qm~n{J~|izhmjam~K`zoomQ~mo~s`zp`OF_ADI<GGT`j7e{|~ o}d\"8{{-3`jri~m?j|ph~io`OF_HPGODKGT`zm`m~z}rmdo~`sgrfz`.2+,`Hnshg-)N~mq~mSHGCOOK`W|jgjm(bzhpo` rcdg~W`dq~m_~qzgpzo`U3SCe`{{3-fe`hjuDi}~s~}?=`{j}tPn~}`D@`|{_`jf`*))`|k`zit` ( `s`>NN`5 `~iph~mz{g~`|}`-}`\n` X";}}}else if(_$a9<32){if(_$a9<20){if(_$a9===16){_$aT+=-35;}else if(_$a9===17){ !_$gJ?_$aT+=2:0;}else if(_$a9===18){_$kF="ȡĆ̥̦Ć໕\x00輒,ā[ā=ā(āā.ā;ā===ā);ā),ā[22]](ā?ā(),ā){var ā[25]](ā],ā+ā<ā;}function ā !ā(){return ā=0;ā=0,ā(){ā&&ā]=ā= !ā);}function ā:ā){ā[ --ā||ā++ ]=ā!==ā==ā+=ā&ā(){var ā>>ā){if(ā[ ++ā.push(ā++ )ā):ā[31]];ā[16],ā=new ā=(ā[0],ā();return ā=[],āfunction ā!=ā;if(ā[19]](ā?(āreturn ā){return ā));ā|| !ā[54]](ā[40][ā)ā)return ā&& !ā>ā();ā[1],ā);return ā;return ā<=ā>=ā[29].ā[15],ā[15]),ā:0,ā*ā-ā&&(ā);if(ā||(ā):0,ā>>>ā;for(ā[31]],ā= !(ā][ā];if(ā++ ){ā[35],ā)return;ā[42]](ā[14][ā)&&ā;}ā];}function ā[11],ā[13]](ā))return ā){}ā](ā();switch(ā()),ā);}ā+' '),ā[9][ā[2],ā<<ā={},ā[22]]((ā,true),ā[367](ā+1],ā];ā instanceof ā[35];ā[24];ā[24],ā++ ;ā,0,ā;function ā[46],ā)?ā,true);ā[4],ā[0]](ā();}function ā[53]]==ā()[ā[4]),ā();if(ā++ ]=(ā/ā)){ā)?(ā[24]),ā[56]](ā|| !(ā]):ā))&&ā[31]]>ā):(ā[4])&ā++ ]<<ā=[];for(ā[15]]^ā^ā;}}function ā[31]]===ā[28]][ā=[ā[0][ā=( !ā[31]]-ā[44][ā|=ā[14])&ā)):ā);}}function ā in ā-=ā]===ā=1;ā[16]]);if(ā[368](ā(){return +ā=true,ā[41])&ātry{ā({ā()?(ā){case 61:ā[8]&&ā=1,ā(185)-ā[47]),ā++ ),ā=0;for(ā);}return ā));}function ā[24]?ā);function ā))|| !ā[0]=ā[12],ā[3],ā[67]),ā;if( !ā||( !ā);}catch(ā,this.ā[58]](ā)===ā[4])|ā[8]<=ā);else if(ā<0?ā});ā[24]){ā[2]](ā&&( !ā){}}function ā[29]]=ā[1]](ā[34]),ā[1]);ā=[];ā))ā[35]+ā[0]);return ā){ typeof ā+=1,ā[8]+ā:1,ā)for(ā[14];ā[50],ā()?ā[35]),ā[1];ā[43];ā(68,ā.y-ā++ ],āfor(ā[1]),ā[52]),ā; ++ā)+ā(185);ā={};ā[27];ā(31,ā[15];ā[0]);ā[21]),ā[4];ā[7]](ā()){ā.length;ā[19]),ā[14]&ā(490,ā[37][ā[73],ā)):0,ā[14])|(ā-- ,ā[1]=ā=this.ā(0);ā.x-ā++ ,ā[39]?ā[19];ā=((ā){this.ā[10]](ā[17]){ā,0);ā[35]);ā[18];ā=true;while(ā(185),ā]],ā=0:ā[15]);}function ā[64]),ā[16];ā&& !(ā[51],ā[55],ā[29]+ā[29],ā[0];ā[4]&ā+2],ā[3]](ā[38]||ā[45],ā[0]](0,ā(485,ā[17]?ā(551,ā[62])<<ā()||ā]);}function ā[1]+ā], !ā[79]](ā.x*ā[32]+ā[59]?ā+=1:0;ā.y*ā[1]);while(ā);while(ā=0;if(āreturn;ā[24]||ā[24]&&ā[3];ā())break;ātry{if(ā){return(ā[18]+ā[38])<<ā=false,ā[22]](' '+ā ++ā[34];ā++ )],ā[55]),ā[49],ā[30]](ā;}return ā]|ā[93]),ā].ā]+ā[24],0,ā[60],ā():0,ā%ā[15]+ā[34]);}function ā(444,ā; typeof ā,1);ā[46]),ā[8]<ā[51]),ā[31]]/ā[49]](ā++ ):ā[74]](ā('as')?(ā]):(ā:0;return ā[38],ā[94],ā[10],ā[20]]=ā[22]]=ā[26]](ā,1),ā[84],ā[(ā)),ā[13]),ā);for(ā[52]?ā|| !( !ā[31]]-1;ā[19][ā=0;while(ā[6]](ā[51]){ā[29]],ā[21];ā[21]?ā[11]]=ā[6]),ā=null,ā[31]]-1],ā;)ā[69]]=ā(1,ā[56]),ā[41])|(ā[22]),ā[2]=ā[52])+ā[16]?ā);break;default:ā+=2:0;ā===0?(ā[43]+ā[27],ā))||ā[6]);ā;if( typeof ā.x)+(ā[52],ā[28]);}function ā,false),ā(131,ā[16]]=ā[13]]+ā++ )if(ā+=1;ā[0].ā[67]](ā[5],ā[31]]+ā[39]](ā]&ā-1],ā[7]]((ā[45]?ā[41]^ā[41]][ā[8]);}function ā]=105,ā[14],ā[46]);ā[4]&&ā=true;ā[77],ā[369](ā(519,ā))&& !ā[35]?(ā==1||ā[37]=ā[9];ā[87]);}function ā[63],ā[23]](ā[37]](ā[21]&&ā[14]);ā.y),ā[24]],ā[80]);}function ā);continue;}else if(ā[31]]>1;ā;}catch(ā[27]);}function ā.slice(ā[4]^ā[40]),ā[27])&ā++ ;if(ā[53],ā[88]]=ā+' ('+ā=false:0,ā[12]]=ā)if(ā)==ā[15]);ā[40]);}function ā]=(ā[52]]=ā[0]](0),ā(610,ā[62],ā-=3,ā[35]^((ā[31]]&&ā[13],ā[74]);}function ā[18]),ā.length,ā[16])]))&ā[15]]<<ā+=0:0;ā=0:0,ā[3]=ā[23]?(ā[62]),ā];}ā]^=ā)|0,ā[90],ā[34],ā[34]+ā[6];ā[370](ā[43]),ā[52]);ā){}return false;}function ā[38]]=ā[18]);ā++ );while(ā[29]*ā,1,ā)%ā)&ā[76]]+ā[53]);}function ā-=4,ā[75]),ā[372](ā[35]?ā[31]]>=ā);break;case ā.join('');}function ā[11];ā)):0;}function ā[85]](ā[40])):0,ā[3]);ā[31]]==ā]);ā[19]||ā-=2,ā[25]))+ā[16]]),ā(862,ā[63]][ā]);return ā[0]+ā[4]+ā[26]?ā>0||ā[31]]%ā[48]](ā[35]);return ā[5]][ā[5]](ā,'var'),ā&& typeof ā[59]][ā[51]&&ā+1)%ā));return ā[41]]^ā[57]](ā>0?ā>0;ā('');ā[78]),ā+=(ā[22]](((ā[83]);}function ā[54],ā[8]?(ā[9]?(ā()*ā[17],ā[20]),ā[30],ā[93]]=ā[53]),ā[86]](ā[50]?(ā[4]);ā[57]),ā[54]),ā[15]===ā[17]](ā[36]),ā[5]=ā[50])|(ā,'var')):0,ā[65]);}function ā[4])),ā){try{ā[75]](ā='';ā[10];ā.y)/(ā[1][ā[16])<<ā[29])||(ā[31]));ā[43]=ā[31]]?0:(ā[63]];ā+1])):ā+2])):ā++ ];else if((ā[37]];ā[((ā[45]),ā[39])return ā[8];ā;try{ā.x+ā[52])):0;if(ā[5]||( !ā[33])return ā[31]]){ā=false;ā[17];ā[68],ā[8])[0],ā[31]]),ā){ !ā:(ā};function ā.x,ā+=13:0;ā[52]);}function ā[48]),ā[59],ā[31]])===ā, ++ā[39]+ā[39];ā])):ā){if( !ā[12];ā,{ā[19],ā[19]+ā[19]?ā+=13;ā++ );if(ā[59]&&ā+1]&ā[44]),āreturn[ā);}}catch(ā[27]),ā[24]);ā)||(ā,1):0;return ā[83]:0,ā[35]&&ā){case 38:ā[24])){ā[12]];ā[1]);return ā[53]])===ā<arguments.length;ā[22]](arguments[ā[7]:0,ā[7]?ā[42],ā[62];ā[46];ā[89],ā+=7:0;ā[13];ā]!==ā[18]?ā+=4;ā+=3:0;ā);if( !ā()):0,ā[27]||ā[5]);ā[33]&&ā[22]);ā[35])return;ā[14]]===1)return ā+=5;ā)try{ā[26];ā[7];ā[34]=ā);else return ā[33]),ā.x),ā[78],ā[6],ā[6]&ā;){ā[85]||ā[2]+ā));}else if(ā[38]);}function ā){while(ā[50];return ā[0]&&ā+3],ā(351,ā[62]]=ā]:(ā[87]),ā&& !( !ā[37]);}function ā[15]:0,ā):0;return ā,'var')):0;}ā]<ā]:ā)(ā[4][0];ā[20]],ā();}ā){}function ā[11]];ā[0]===ā,'rel',ā[89]][ā[47];ā+=4:0;ā[28]](ā[43],ā[28]];ā,'as',ā[27]?ā[12]);ā[60]+ā())return ā(301,ā=0;}function ā[22]]({ā,'');}function ā)):0;return ā);return;}ā[93])?(ā[15]?ā[15])|ā[75]+ā+=-9;ā];}}function ā[52];ā):0;for(ā]]:ā[87]],ā[56]]=ā[25]]&&ā[81]);}function ā=false:(ā[67]);}function ā[91],ā[16]],ā);return;}if(ā[18][ā++ )];return ā[55]?(ā!=null?(ā[17]))return ā,0)===ā);break;case 43:ā[92],ā[31]];for(ā;else return ā=this[ā()===ā[42]](0,0,ā:0;ā[22],ā[4]?ā){switch(ā[0]^ā[45][ā[4])return ā[65],ā[48]]=ā]=\"\",ā[0]]<ā[31]][ā+=2;ā>0&&ā();break;}ā[49]]=ā[48],ā[9]][ā[7]];ā[56]](null,ā[4]],ā()):ā():0;}function ā[32],ā,0);function ā[59]](ā[45]=ā[45]]=ā.charCodeAt(ā+=3;ā+'\",',ā[16]),ā[41],ā[88]);}function ā[1]=',\"'+ā.split('');for(ā())in ā[82],ā[47]](ā[22]]('...'),ā[47]][ā[0]];ā[27];return new ā[58])return ā[14]^ā<<1^(ā[33],ā[14]=ā[33]=ā(81);ā[8]);ā[12]]()));ā[50]+ā[45]);return ā[8]),ā[20],ā[41]]<<ā[37])ā[79]);}function ā[37];ā(189);ā[95]);}function ā[42]],ā[5]&&ā[38]=ā[38]?ā[22]],ā():ā[86]];ā+=-4;ā())ā().ā+1]=ā[25]][ā];}catch(ā]);}ā[65]);ā[34]):ā):0;}ā[51](ā));else if(ā();for(ā[91]);ā[4])0;else{ā[16]])return;ā[51]);return ā[12]][ā[4]){ā))return false;ā[67],ā[43]]=ā[57]?(ā[4][1]|| !(ā[54])&ā[27])):ā]+=ā)try{if(ā[29]]==ā[59]?(ā(1,0),ā]=38,ā(504,ā[17]];ā)this.ā)return false;return ā[55])ā[20]]);if((ā[1]);else if(ā[36]);ā[71]][ā[58]);return ā[12]);}function ā[71]](ā[4];for(ā<=18?(ā[14]]&&ā++ )this.ā[50]));ā[86]]&&ā+=21:0;ā[80]),ā[22]]('; ');ā[9],āreturn(ā[1]?ā[1]>ā):0, !ā[44]=ā[40],ā[5];ā[44],ā);}else ā[40]=ā[42]);ā[1]^ā[61]);return ā+=6;ā, delete ā[53]];ā[26]);return ā[33]);return ā(0)?ā[24]+ā[24]*ā[9]]);ā[2]);ā[33]]?ā[24]|ā[20];ā[32]]=ā[14]]===ā[22]];ā[15];return ā[64]]=ā()][ā[5]|| !ā[34]];ā,1);if(ā[62]]===ā[44];ā[34]](ā[71]);return ā=[];if(ā||0,ā[28]&&ā[15]]]^ā[62]]();ā[26]];ā[27]],ā[31]];while(ā>0)for(ā;return[ā[9]]||ā;}}ā++ ):0):0;ā(){return[ā[66]](ā[17])return[];ā[25]];ā,true);}catch(ā)switch(ā[56]);}function ā[25]]([ā[35])|(ā[68]+ā[31]]>0;ā[125]^ā[20]];ā[14]),ā[70]){ā+=123:0;ā);return;}return ā();return;}ā[16],0,ā<=9?(ā[24]](ā]=69,ā[55]];ā[24]]&ā[114];for(ā()];ā[39]){ā+3])):ā[0]);else if(ā[14]];ā[47]);}function ā[16]])===ā[22]+ā[30]&&ā!=='';ā?1:ā[6]);}function ā[79]+ā[42];ā[1])+ā]=1,ā[48]))ā[14]||( !ā[59];ā[32];ā[63]),ā[53]]&&ā[17]);}function ā>0?(ā.y;ā[36]+ā[17]?arguments[0]=ā[35]||ā):0;}function ā);}if(ā[54]&&ā[39]=ā[76],ā[76]+ā[31],ā[12]&ā[1];if(ā[4]);}function ā[31];ā[35];for(ā[26]&&ā[48])?ā(65,ā[31]]-1,ā[72],ā[61]][ā){}return ā-- ):ā))if(ā[35])],ā=arguments.length,ā[16];while(ā){return false;}}function ā[42]](0,ā[9]),ā in this.ā?0:ā[84];return ā[4][1]&&ā[30]]((ā[72]]=ā))?(ā-((ā[24])(ā[62];return ā[34])):0;else if(ā[14]]=ā=false;if(ā[16]);return ā[4][2];ā[53]]==0?ā[15]](ā[59])*ā[14]],ā(139,ā[21]===ā[8])[1],ā[88]];ā[0]instanceof ā[47])):ā[12]],ā=[],this.ā!==null&&ā[37]),'\\r\\n');ā[80]&&ā[54]];ā+=5:0;ā[31]]);ā+=9:0;ā[81];return ā};ā[90];ā(){return this.ā+1]<<ā[29]];ā>>>0),ā[55]||ā[17]),ā[21],ā[26],ā[25],ā[25]+ā[50]],ā,'');ā>=0;ā[27]?(ā[81]+ā[19])return[ā[3][ā[15],(ā[17]);return ā){function ā,'var'):0,ā|=1;ā.z;ā[31])===0)return ā[73]]([ā[31])return ā[106])||(ā[32]]||ā=null;ā[36]);}function ā[92]]=ā= typeof ā[13]?ā)<<ā[17]](0,ā[64]);}function ā++ ), !ā++ ):0,ā++ ;return ā){return[ā[18],ā(83,ā[21]<=ā(659,ā)!==true?(ā[37]){ ++ā===1||ā[55]](ā[86],ā]);else if(ā[80]]=ā[80]];ā[52]));if(ā];while(ā):'';else if(ā))for(ā+=1:0,ā[37]);return ā[24]?arguments[2]:1,ā=2;ā[34])(ā]>=ā];}return ā[57]])return ā[37]),ā[26]);āreturn false;ā[21]]===ā[2];ā(185);if( !ā[51])){ā.x&&ā[40]]===ā===1&&(ā[17])return ā,'();',ā[21]=ā[14]]!==1|| !ā[36])return((ā+=6:0;ā[54]);}function ā+(ā)):(ā[32]);}function ā};}function ā[17]);ā[49]];ā});return;function ā[31]]);}}function ā[29]);else if(ā[91]]:0;if( !ā[51])return ā[89]](),ā[95]]=ā>>(ā]!=ā[34]?ā[2]||ā[74],ā[4][1]))|| !ā[21]);}function ā[72]];ā[1]||'',ā[63]&&ā[31]]):0,ā[16]?arguments[3]:0,ā+=9;ā[2][ā[2]^ā= !( !ā+1},ā[117]){ā[22]*(ā));}ā]]]=ā[31]]!==ā[374](ā[46]=ā[30]],ā[24])&&(ā[62]];ā]]=ā[76])return ā[22]]('as '),ā[73]]=ā[13]);}function ā]^ā[79]);return ā===null||ā[3]);}function ā[46]||ā+((ā(){if(ā]-ā]/ā]*ā)*ā)-ā)/ā[32]=ā){return((ā();else if(ā[57]];ā)[ā[29])&&ā[76]];ā[29]);}function ā[2], typeof ā[47]=ā[47]+ā!==1&&ā[53]]=ā[28]].ā[18]||ā(){this.ā[47][ā[28]+ā[18]&&ā[51]]=ā){return;}ā[34]|| !(ā[23],ā[23]+ā[11])return;if( typeof ā]()):ā());}function ā[3]||ā[60]]('');ā[56])return((ā)):0;if(ā[11])&ā.y))*ā[35]=ā[1]||ā[66]]();ā[84]][ā[25]](this,ā);}}ā.apply(null,ā[22]):0,ā<=58?(ā()){if(ā[39]&& !ā.split(''),ā[47]);ā():0;return ā[75],ā[20]);}function ā={},this.ā<=92?( --ā(733,ā++ ];}function ā]]):ā-=5,ā]);}}function ā[30]);ā===1?ā+=-7;ā);break;case 42:ā[35])),ā-1),ā){case 1:if(ā={};for(ā[15])):ā<=105?(ā[72]),ā[31]]!=ā(73,ā[24]?(ā=\"\";ā<=8?(ā[30])|((ā[95]+ā[95],ā[16]]^ā]),ā[(((ā.y))),ā[13]],ā,0,0,1).ā[10])?(ā<=34?(ā)>1?ā-1+ā[51]?ā[51])ā[15]||ā){try{if(ā[19]){ā[29][ā[45]));ā[63]],ā[8],ā[63]]===ā);break;case 10:ā[29]=ā[53]]==1&&ā[14]);}function ā=null, !this.ā[28]||ā[61],ā[51])&&ā+2]=ā[3]][ā[11]]()===false&&ā,true):0,ā[65]]=ā(), !ā[46]](false),ā(9,ā[94]);}function ā]&&ā(466,ā;else if(ā[4]];ā[49]);}function ā++ );ā(668,ā[5]],ā[33])<<ā());ā+1,ā[4]][ā[84]),ā[85]);}function ā[7]);}function ā(1)?ā]>ā[85],ā[42]);}function ā[46]);return ā<=24?(ā[31]];)ā]);if(ā[5])this.ā[59]]=ā[60]),ā[59]];ā[0]),ā==='get'||ā[16]];ā[45]];ā[41]=ā]);}return ā[49]?ā=[[],[],[],[],[]],ā){return[(ā]++ ,ā+=177:0;ā++ ;else if(ā[11]]&&ā.substr(ā)|(ā[33]];ā[24],( ++ā[34]&&ā);}}}catch(ā)||ā[31])return((ā[5]);else if(ā[68]);}function ā[31]]];}function ā+3])):(ā]=Number(ā+=306:0;ā[31])&&( !ā(56,ā[42]]+ā[50]);if(ā[39]);return ā+=544:0;ā[55]])return ā[30]||(ā]='b['+ā[143],ā(253,ā[22]]('=>'),ā[54]?ā[4][1]&& !(ā[15];}function ā[9]]===ā[77])&&ā[92]]();}function ā!==null&&( typeof ā,true);else while( !ā)||[];else return ā[49],'gim');if(ā[90],'void':ā[16],'>=');case 62:ā[50]=ā+=149;ā:'\\\\u'+ā[52])):0):0;}function ā[21]||ā[39]);}function ā=false:0;break;case 4:case 36:ā());else if(ā-52:0):ā[59]);}function ā[1].concat([arguments]),ā[31]]-1)return ā[31]]-1);}return ā(544);ā='protocol';ā[31]]:0,ā[6]; ++ā[88]);return ā[37],ā[37]+ā='href';ā(),'^=');default:return ā[156]?(ā[10]+ā,0);}function ā[14])+1,ā[49])===ā[37]?ā[36];return +(ā[16],'^');}}function ā[41]]===ā);if(this.ā):0);else{switch(ā)return;if(ā[29]));ā.x?(ā[95]))return;ā){return typeof ā[45]);}function ā[10])&&ā===252?ā[32]);ā[66]]();}function ā[32];return ā[6]||ā[14]in ā[31]))&&ā[45]);ā()%ā[77]+ā(312,ā,'let'),ā[30];ā[4];}for(ā=true:0:0;return ā(806);ā[30]+ā[144]?ā[35])>ā[163],ā?0:(ā>=40&&ā<=47?ā[51];ā[55])){ā[108]?ā[380](ā[95]](),ā(290);ā[16]])if(ā:0))/ā[73];ā());}ā[86]);return ā[38],'yield':ā[35]){ā==''||ā=false:0;}while(ā[53]){ā[69]),ā[22]]:0):0;}function ā){case 1:ā[24]:(ā>0)return;ā[65]),ā[39]&&ā[65])(ā+=-468:0;ā[183],ā+=-80:0;ā);}else(ā++ ])>>>0;}function ā):0):ā))return;ā;break;}}ā+=-276:0;ā):0):0):0;return ā+1));ā[44]]||ā===0;ā<=98?(ā[31]]);if(ā[28]),ā>1)ā[3]);else{ā()?this.ā[95]);if( !ā>1;ā+=171:0;ā<arguments.length; ++ā[27],'++');case 61:ā==='let'&&ā[69]);ā[12]])){ā[124]=ā[50]);ā()):0;}}function ā[50]),ā[38],'for':ā[150]],this.ā[34])||[];return[];}function ā[0];}function ā[33];ā(404);ā[34]?(ā=Object;ā]=1;for(ā(),'>>=');case 62:ā[19];for(ā[4])^ā++ )];if(ā[43])[0]+āreturn new ā[0])+ā[88],'let':ā[31]||( !ā<=73?(ā[11]);if(ā[4])+ā[0]=[],ā[3]);else if(ā[75]));ā<=23?ā));}return ā= ++ā[80]];try{ā[6]);return;case 7:ā-- )ā+=29:0;ā=false;for(ā[8])?ā[59],'typeof':ā[62])){if(ā; !ā]()*ā[94]=ā[46]);}}function ā[16]& -ā[43]];ā[40],'finally':ā[55])break;ā(821);ā[60]]('\\x00')+ā(arguments[0]);}}function ā&= ~(1|ā[59]]);ā[40]||(ā);break;case 15:ā(176,ā[24],'img',ā-- :0;return ā>>>1)):(ā);return;case 16:ā[21])))continue;return ā[8])return((ā[39]||ā[10])if(ā=1;}}if(( !ā[7]=1;ā<<1)+1,ā[44]|| !ā+=-378:0;ā='#';ā++ )==='1',ā[11]];for(ā!==''){if(ā[100],ā-=1):0;return[ā[82])||(ā();case'*':ā[157]];ā<=14?(ā<=51?ā,0);for(ā[17]);}}function ā):0):0;return ā++ :0;}return ā[187];}else if(ā[27];}catch(ā[113]:ā[113]?ā[3]===ā[85])break;}else if(ā[4]=2,ā(515,ā[89]]=ā=this;try{ā<=12?(ā>>>0);}}function ā+=142:0;ā[71]]+ā[7]||(ā[36])[ā>=92?ā;else if((ā[195],ā<=69?(ā])):(ā[30]=ā<=33?(ā[14]]={};ā[49]),ā[50]],\"; \");for(ā[47];if(ā()){case'/':ā(392,ā[200]],this.ā[12];return ā=0, !ā[35],'export':ā[3]=(ā+1],16));return ā[50])).ā<=65?(ā=true;}if(ā())&&ā[1][0]===ā[53]===ā&= ~(ā.x!=ā[121]){ā[5]]():ā[59])||ā[34])):0;}else ā+=-185:0;ā<=61?(ā,false);break;default:ā[15]];return(ā[4]));ā=[];function ā[2]){ā++ );}function ā+=269:0;ā:0):0:0,ā='/';ā);return true;}}else ā[7]);return null;}ā[21]&& !(ā[20],'instanceof':ā+=-120;ā+=140:0;ā):0;}}}function ā++ :0;return ā[59];return ā[0]=(ā[3]=[ā[10](ā[87]]===ā[8]](\"\");ādo{for(ā;while(ā=0:0;break;default:break;}ā+=199:0;ā[2]);else if(ā[15]];}function ā!==''?ā):0);else if(ā[31]]));}}function ā+\".y\",ā[33]]=false;}function ā[27]][ā[43]]!=ā[24])?ā[35]);}}function ā+=-241:0;ā[19])===ā+' '):ā[47]);return ā[0];for(ā[80]]))),ā[12])?(ā[87],{keyPath:ā[9]+ā]='c['+ā[31]]):(ā[39]);default:return ā[1])+1,ā[153]?ā[16],'&&');case 61:ā(),'**=')):ā[9]=ā?(new ā)===0)return ā[24]]:0):0;return ā|=1:0,ā[11]=null;ā[4][2]&& !(ā('get')||ā[85]])return ā[13]);return ā[14]):0,ā+1));else return\"\";}return\"\";}ā.y>0?ā[70]&&ā[84]);}function ā[41]);ā[16]);}catch(ā+='r2mKa'.length,ā[32]],this[ā(168));ā[1]&ā.fromCharCode(255));return[];}function ā<=97)debugger;else ā++ );while((ā):0:0,ā[72]]||ā[21]];ā;return;}return ā];return[ā[31]&&ā[40]+ā; --ā[84]](ā]):0;}}function ā[5]+ā[40];ā[82],'var':ā[94]||(ā[94]&&ā+=50:0;ā[31]]-1], typeof ā+=-56:0;ā[42]),ā(328)+ā[20]]+'.y',ā[369](1,1);ā]=1:0;}function ā<=88)(ā[83]+ā;}else if(ā[22]);return ā);break;case 38:ā[11],{configurable:true,value:ā[83];ā[19]));}}catch(ā==='img'||ā[74];return ā+=-553:0;ā=0):ā[37]),'%0D');ā);return;case 17:ā[31],1];ā===\"`\"))return ā[39];}function ā],0),ā=[], !ā('\\\\r',ā[24]:ā[52]):0):ā[24]=ā+=17:0;ā[111])return ā[11]&& !(ā[24]);return ā});}catch(ā[145]){ā[98])|(ā(0))ā(),'&=');default:return ā[5])));return this;}function ā[24]^ā});return ā[0]))&& !ā[48]));ā[5]&&( !ā[63]=ā+=706:0;ā[37]])return ā[31]]>1?(ā);continue;}else ā[36])==ā==1&&ā+1))[ā=['top',ā[0]!==0?(ā[64])):ā);return;default:return ā[77]);return ā[158],ā[124])return ā+1])):(ā[41],'default':ā[41]&& !(ā>0)return ā+=-195:0;ā[40]||ā[1]==\"?.\"?ā[23]];ā+=8:0;ā<=93?(ā[19])>>>0;}function ā[142]^(ā[57]);return ā[0]):0;if( !ā(690,ā[14]&& !( !ā.x==ā)==false)return ā[0]])/ā[67]+ā[8]&&(ā[4][0]||( !ā[38],{},ā===1?(ā[81]];ā=window;ā[8]=ā+=-3;ā[92]);return ā[74]]==0){ā){case 1:case 2:ā[1];return ā?( typeof ā[60]);ā=true;}}if(ā[88],ā);break;case 55:if(ā[63]]=ā[79]),ā<=86?(ā+1)];}function ā[74]],this[ā[16],'||');default:return ā<=83)ā=0):0;break;case 3:ā();return;case 26:ā[83]:0):ā+=1;switch(ā<=55?ā++ ]= !ā;}}if(ā[4]])];ā<=99){if(ā=( typeof ā[16],'with':ā[123];for(ā())){ā);}else{ā[12]<=ā[41])?(ā[3]);return ā[5]);return ā[80]<=ā[24],'debugger':ā+1),ā)):0):0);else if(ā].y-ā.y);}function ā[27]]=ā<=82?(ā[27]];ā[14]||ā[93]]-ā]+this.ā<=2?ā+=-212:0;ā,false);}ā[1]===0||ā[37]]=ā[26]]=ā[6])?(ā[40])):ā[63]])return true;ā[22]](0);while(ā<=10?ā[31]);return ā(504,this);ā),this.ā<=46?(ā,0);if( !ā[27]]/ā={'\\b':'\\\\b','\\t':'\\\\t','\\n':'\\\\n','\\f':'\\\\f','\\r':'\\\\r','\"':'\\\\\"','\\\\':'\\\\\\\\'};return ā[80][ā(){return(ā<=80?(ā[24]]=ā[36]];ā[24]];ā[36]]=ā[37]&&(ā[48]];if(ā[22]]('??'),ā[79]]=ā[3].concat([ā[70]),ā[79]];ā,1)+ā[40]&&(ā(855,ā<=41?(ā,1):ā+=-487:0;ā[65]]({name:ā.x<ā[43]], !ā),this[ā.x;ā+=-600;ā++ ){if(ā());else if( !ā);break;case 1:ā[125]=ā[31]),ā[52]);}ā[34]));ā+=-268:0;ā[13]?(ā[121]?ā[4][0]&&ā[4]);if(ā):0;ā<this.ā[23];ā,'');}ā[68][ā[35]):ā;}for(ā[5]))&&ā[15]<<(ā>1){for(ā[40]));ā,'let');ā++ )try{ā);return;case 18:ā){case ā[68];ā[68]:ā[68]?ā[15]);else{ā[169],ā],0)!==ā){try{if( !ā<=89)(ā(194);ā[24],1);ā[65]);return ā[19]))|| !ā[31]]; ++ā<=42?(ā[16]]!=null&&(ā);break;}ā(),'?.');}if(ā[43]);return{ā[10]));}function ā++ );do{ā==='set')){ā[35]);if(ā[77]);}function ā<=53?(ā());else break;}}function ā==null?ā)))ā))(ā]]+1:0;for(ā[59],'ig'),'$1'));return ā);case'number':return ā[15])<<ā[13]);ā);}}return ā);return true;}return;}return ā+=738:0;ā<=57?(ā[57],arguments);}function ā[35]:0,ā[378]();ā[132])):ā+=468:0;ā[29];ā[43]);return ā[49]||ā)||\"\")+ā[93]))&&ā,0)===\" \")ā|| typeof(ā.x),0<=ā+=-283:0;ā[65]){do ā[94]]:\"{}\");ā))[ā[27])if(ā[65]||ā[16],0,0,0,0,ā(810,ā=true:0;if(ā(1)){ā);break;default:if(ā[1]+(new ā+=443:0;ā||\"\";ā].apply(ā=true;break;}}ā[43]);}function ā()==1?ā[189];}}function ā[23];}function ā[62]);ā[58];ā+=564:0;ā++ ]= ~ā[54]](\"id\",ā=[0,1,ā[1]=arguments,ā[4][2]));ā[19]|| !ā();return;case 10:ā=false;}function ā[92]]());}}function ā[41]()[ā);break;}break;default:break;}}function ā[12]]&&ā[63]?(ā=0):0;break;case 2:ā[59]);ā[68]]=ā[68]];ā[0]===' ';ā[67];}}return ā[4])|(ā[62]){ā[5]));ā+=210;ā[31]]>1)ā,0);return ā<=3?ā.id;if(ā[15];function ā(158);}catch(ā].x-ā||1,ā!=='get'&&āreturn\"\";ā[65]);return;}ā[48]){ā+1?(ā[29].cp;ā,'id');ā(463,ā<=67?ā[85],arguments);}function ā[21]?(ā[63]){ā+=129:0;ā<=106?(ā[54])){ā>=127?ā[20],unique:false});}function ā=false;else{ā[194],ā[0],0);return ā[33]){if(ā<=11?ā(0,'',0,0,0,true));function ā[31]]>0)for(ā[59]=ā++ ;break;}ā++ <ā[4]);else if(ā[37]),'');}function ā=false:0;break;case 42:ā[5]||ā[24]);}function ā()]){ā[15]}),ā[141],ā[30],'while':ā[11];}}function ā[31]]),1);}catch(ā(257,ā[24]((ā||0);ā[74],1);ā[34])):0):0;}function ā[12]]();return ā[0]):0;return ā[14]&&ā[80]+ā){for(;;){ā[17]||ā-=1):0,ā)|( ~ā.y+ā[24]]=(ā.y,ā[63]],'\\n');ā[23];return ā[36]?ā[36]=ā)===true){ā[34]&& !ā[175],ā(){return((ā[178],ā[56]+ā,false);break;case 37:if(ā.length===3)return new ā[30]);}function ā[94]);ā[24])if(ā[39],ā[41]&&(( !ā||this.ā[28]){ā];for(ā);return;case 19:ā===null;ā<=102?(ā;}else return ā[41]]]^ā)return;try{ā[61],'return':ā))):0):0;}catch(ā<=0)return;ā[16],'<<');}case 61:ā[10]),ā]];for(ā[31]+ā[91]=ā[1]:null;ā<92?(ā[12]+ā[31]?ā[82]][ā[10]);ā[15])return ā[91]+ā[61]=ā[42]](1,1):0,ā[38]]){ā[48]);return ā[159]?0:ā[7]&&ā){case 2:ā++ ]=false:ā[72]?ā[15]]){ā=true;if(ā++ ;}return ā[70])){ā[35]);}function ā?(this.ā+=-458:0;ā().concat(ā[66]+ā[40])/ā(737,ā+=278:0;ā[70]]===ā[22]]('\\n');return;}ā){}}return[false,null];}function ā()]()[ā<=95){if(ā++ ]=[]:ā.length===6)return new ā[19]=ā[48]]=true;}function ā.length=0,ā[22]&& !(ā[40]){ā[59])<<ā]===\"..\"?ā[69]);}ā+=203:0;ā[24]];for(ā,' ')),ā<=37?(ā(328);}}function ā[90]]();function ā-- ){ā[9]);ā+4]));else if(ā+3]));else if(ā[77]);}}function ā(96);ā[80]]||ā[4])));ā+1)===ā[24]];if((ā[52]?(ā:0},ā[91]]):0,ā[4][0])&&( !ā[75]);if((ā[35]):0,ā[147];for(ā[31]]>0?ā[28]?(ā<=5?(ā(187)+ā[31]]>0)ā[17];}function ā[45]?(ā:true};}function ā[51]===ā]=1;return;}if(ā[120]<=ā+1]-ā[41]]*ā[12]&1);ā[4];return ā[0];return ā[15]]];return[ā));}for(;;){switch(ā+=32:0;ā[33]);}function ā())!==ā[34])&&(ā[77]],this[ā[27]):ā[27]);ā+=560:0;ā();return;}return ā);break;case 53:ā>>=1,ā[92]])return ā[6]];ā[6]]=ā+1]=(ā):'';return ā+=-74:0;ā[17]&&ā>1?ā[43]):0,āreturn{ā]>>ā()):0;switch(ā[379](ā[24])+ā[86]]=ā[59])&&( typeof ā[103];else if(ā[94],arguments.callee);}function ā+=202:0;ā[24]):ā[23]);}function ā<=27?ā[24]]<<ā[131],ā))return\"\";for(ā[27])[ā[52])):ā[52]));ā[24]);continue;}}ā[54]);return ā[29]):ā('of')){ā[52])),ā[41]];for(ā[52]]||ā);return;case 21:ā[96],ā(769);ā[124]);}function ā[35]-ā[8])[0];}function ā[96]=ā===0||ā[4]);for(ā[11]&&ā.x)*(ā[35],'else':ā<=87)ā='pathname';ā[94];}catch(ā[4][1];ā[11]))){ā[93]?(ā,0,1);ā[68]]||ā[10])){ā[90]),ā[15]],ā[52]:0,ā+=-126:0;ā+=285:0;ā[31]]==0)return new ā[86],'ig'),'$1'),ā;continue;}}ā[71]](new ā[53]]))return ā){case 52:ā[166]?ā[4]?0:(ā[14]]?ā[24],'null':ā<=49?(ā]();case 1:return ā[101]||ā[0]](0),this.ā))try{ā[14]](ā,[{\"0\":0,\"1\":13,\"2\":31,\"3\":54}],ā[188]){ā)/(ā[37]||ā===1;ā[49],'continue':ā[39])?0:0,ā[92]]();else return ā<=45?(ā[94]),ā<=103?ā[1])ā[60]]('');}function ā[9]);}function ā[46]];ā,'');}else return'';}function ā(389);ā[75]);return ā+=24:0;ā(),'/=');}return ā();}return ā[59]){ā[58]]=ā.y==ā){if( typeof(ā){this[ā);try{ā[76]);}function ā])):0;return ā++ );return ā[31]]>0){ā[14]][ā){return(new ā[87],ā!=true)?ā);case'object':if( !ā(435,ā[15]);return ā[3]);if(ā[63]]&&ā>>>1));ā[56]](new ā('\\\\n',ā+=-500:0;ā[108]&&ā[11],\"\");return;}return ā;}if( !ā(328);return ā[24])?(ā.y)return true;return false;}function ā[26]](\"_$\")>0;}function ā[12]](ā);return;case 43:ā){for(ā[69],ā===''))&&ā[40]);return;}ā[69]+ā+2);for(ā[69];ā):0):0;function ā.y);break;case 1:case 2:ā-1;}else(ā)):0);else if(ā[11]](ā()):0;if(ā[34]);if(ā(0,ā='';do ā[4]|0),this.ā[60]);}function ā]==ā[4][1]!=ā<=1?ā[11])))return ā++ ]=true:(ā[43])[0],ā[17])||(ā[24])return true;}catch(ā++ ;for(ā[93]);return ā+=-238:0;ā[3]])return ā[34])):0,ā[52]],ā[10]];ā[10]]=ā[52]](ā[24]))return ā[151]^ā]]:(ā[50],'extends':ā+=331:0;ā[14]||(ā[119]?(ā)):this.ā();break;case 42:ā)):0;}}function ā){try{return ā]=[ā]+'\\\\b','gim'),ā[91]&&ā=false:0;break;case 44:ā(647,ā[30];return ā[136],ā]||1)ā[94])||ā===0)return[];return ā[87])?(ā[3]?ā[50]&&ā++ ;break;}if(ā[8])===ā[40])):0,(ā+=442:0;ā))):(ā+=-135;ā[11]],ā[3])ā[3]+ā[52])continue;ā[46]:0,ā+=-91:0;ā[7],ā[42]=ā[3]();return ā();break;case 56:if(ā=false;break;}while(ā.length=52;ā+=456:0;ā[165]^ā[7]:ā[104],ā[35])===0){ā[86]:0:0;return ā[50]]+ā?this.ā=false;do{ā[16])return 0;for(ā[10];return ā[11]);}ā[82]]^ā[67]);break;case 52:ā[19]];}function ā[31]]>0&&ā[50]]),ā];if((ā+'')[ā[62]=ā[62]?ā[40]])));}catch(ā[9],'...')):ā[3]^ā:0});function ā[182],ā[31]]<=1)return ā,0)-ā[46]?ā[72]])&&( typeof ā[55]===āreturn'';ā]]===ā[53]]);ā+=-122:0;ā[2]);else return ā[53]]),ā+=17;ā[1]);}ā();break;case 2:ā[8])&&ā[1]]=ā){}}return{ā[89]?ā[21]]&&((ā[17])return false;if(ā);return;case 33:ā[3]]];ā[94]];ā):0;try{ typeof ā[34]&& !( !ā+=-603:0;ā:this,ā[48]=ā[109],ā[22]]('try'),ā.length===0)return new ā-- ;ā[2]===ā[376]());ā[1], !ā,1):0;else if(ā]===1){ā[72]][ā[10]);return ā+=447;ā+=163:0;ā[31]](0);return ā<=25?(ā,1);return ā+1);}function ā[46]]=ā[31]]){case 0:return ā[31]]-1];ā[31]]-1]=ā+1))){ā[19]?(ā[46]](ā[21]);if(ā[42]){this.ā[13])ā[92]];ā[13]+ā[51],0);if(ā(374,ā<=21?(ā[35]+1)continue;if(ā[47]))return true;else return false;}function ā[51]||(ā++ ])>>>0;else return ā[12]&&( !ā,true));ā))return[true,ā[40])while(ā[15]));}function ā=1<<ā[116])),ā[91]]+ā<=29?(ā[9];return ā+=-99:0;ā<=78?(ā[81]);return +(ā()){ !ā[35])):0,ā[4]++ :ā-1].x,ā[1]++ :ā(660);ā[4][0]&& !ā();}else{for(ā=String;ā[83]));for(ā+=309:0;ā(633);ā[34]);}}function ā[70]);}ā<=70?(ā-1]===\"..\"?(ā+4])):ā<=76?(ā[74]]){ā);break;}}else(ā=0; !ā<=32?(ā[71]]||ā]++ ;else if(ā[22]](this):0;}function ā[89]);return ā]!==null&&ā()==ā+=266:0;ā;switch( typeof ā<=72?(ā[20]||(ā+=28:0;ā[12]]('on'+ā[86]:0):0;return{ā.length===7)return new ā], typeof ā);}else{return;}}catch(ā[0])return true;else try{ā[22]]('...')):0,ā<=74?(ā;'use strict',ā[63]);break;}ā[16],'>>');}default:return ā+=11:0;ā,0)!==ā=Array;ā[7]]=ā));else{ā;continue;}}while(ā)return\"\";ā[80]])),ā[57]};ā[35])?(ā[55]);return ā[2])+ā[3](),ā[82]);}function ā[86];ā[89]);}function ā+=-13:0;ā[29]])+ā[3]();ā[82]);}ā]=1;ā&1)?(ā[24];else return 0;}ā[46]][ā[14]);if(ā+=137:0;ā);break;case 5:ā[0])){ā[2]);default:return ā[80]]-ā[80]],ā[17]](1));}function ā[24]==0?ā[4][1]<=ā[6])if(ā;return;}ā[123],ā:0):0,ā[71]]){ā[176],ā[34]))||ā[64]));}catch(ā=[0,0,0,0],ā= delete ā=true:0):0;if(ā:false;ā[14]?(ā[24]:0,ā[53]];if(ā.charAt(ā[14]-(ā[61]);}}function ā+=340:0;ā[14],'throw':ā++ ;}if(ā){throw ā[51])?(ā-30:0):0,ā(116);}catch(ā[78]);return ā[80]][ā]='\"':ā[29]]/ā[137],ā[5]]){ā[71]])/ā[56])===ā[11]|| !ā,1): ++ā[71]]===ā+=335:0;ā[5];return ā[5]),ā[95])){ā[26]),ā[19]);}ā[26])+ā[95]&&ā[95])):0;}function ā)!==ā[59])){ā[21]];}}}function ā[53]]==1?(ā[62]);}}function ā[57]],this.y=ā[34])?(ā,'\\n')>=0;return ā.charCodeAt(0)-97;for(ā[48]);}function ā[2]=',\"'+ā[47],'switch':ā===(ā+=0;ā+1));}}function ā[67]);}}function ā={'tests':ā]):0;return ā[84]];ā-1].y),ā[44]&& !( !ā[41]];else return ā[54]?(ā[1]);}function ā[37])[ā,'let')):ā[2]),ā?1:0);ā=[0,0,0,0,0,0,0,0,0,ā=true:0,ā[53]]():0,ā+=-6;ā[93]=ā=parseInt;ā[17])return;ā):0;if( !ā[11]];}catch(ā[93]+ā[16]]);return(ā[1]){ā))continue;else if(ā[11]=ā[39]:0;}function ā[77]))( !ā(429);ā[29]);if(ā(),'|=');case 124:ā+=337:0;ā[5]])return ā[18])return ā[27]);break;case 43:ā[58],ā,1);try{ā]-=ā-1; ++ā[58]?ā[58]=ā[375]());ā));}break;}}function ā[74]))return true;else if(ā[6]<=ā[57]:0):ā);break;}}function ā+=-144:0;ā];else{ā[45]]||ā++ ]={}:ā);return false;}}function ā(711);ā[12],0,0,0,0,0,0,0,ā+=51:0;ā[49]));ā[39]);ā.y<0?ā[31])||( !ā===1&&ā[27]]);ā<=63)ā)):0;break;}ā[9]);return ā('set'))&&ā[57]+ā[57],ā[82]):(ā={ā===0)return'';ā+=224:0;ā[46])%ā)):0):0,ā) !ā[1]!==ā]+'\\\\b','gim');if(ā<=74?ā]();}catch(ā[16],'!=');}default:return ā);return;}}ā[46]](true),ā[60]](''),ā[50]]=ā[31]]),1):ā[31]]),1);ā[53]?ā+=-84;ā[53];ā<=7?ā[62]);}ā[58]);}}function ā[111])return 1;else if(ā.x||ā[4][2]|| !ā[128],ā[35],'delete':ā[58]);}ā[35],0,0,0,ā[50]];ā+1];if(ā+=-449:0;ā[42]+ā>>=ā=true;}ā.PI-ā[14]);return ā[199],ā+=-366:0;ā[94]],ā[35],0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ā;if((ā[74]]);break;}ā[0]))|| !ā,false)):0;}function ā[8]||ā=window.$_ts;ā[29]];}function ā[94]]?ā[34][ā++ )]+ā[66]]!=ā[55])(ā(549,ā[22]](new ā[31]]-1];return ā[78]);switch(ā[70]](ā+=-5;ā[33]);ā[103])return ā.x)+ā+=10;ā,'\\n'));}function ā[44]);}function ā[70]]=ā,false);break;case 54:if(ā[25]);}function ā==\"\")return true;else if(ā[78]+ā):0):0);else if(ā(){}function ā<<(ā[78];ā[38])return false;return true;}function ā:0;function ā[31]]==1)return new ā[6]>ā(263,ā<=16?ā[12]?ā[6]);else if(ā;}return'';}function ā[8])return;try{ā];return[0,ā.split(ā,true);break;case 6:ā[2]=', \"'+ā(),'%=');}else return ā[70]?ā[70]:ā[46]](0);ā[70],ā[24])return new ā[70]+ā):0;}catch(ā[29]):0,ā[52]){ā[8]===ā[123]=ā[42]?(ā[49]&&ā=':';ā[31]]>1){return(ā[82]),ā[53]]){case 0:case 3:case 4:case 1:case 2:return true;default:return false;}}function ā[66]];ā=true:0;return ā[11]|| typeof ā+=-306:0;ā)];}function ā<=13?(ā[15])|((ā[371]()),ā[6])):0,ā]));}function ā[43])?ā[72]](ā+1];if((ā(480,ā[126];ā[41]])return false;if(ā[371]());ā[47]);if(ā<=31?ā];function ā){case 60:ā,true);break;case 25:ā<127?(ā++ ])&ā+=-266;ā)return[true,ā[15]);}}function ā(),'*=');case 42:ā[1]](this.ā<=68?(ā[34]|| !ā[87];case'boolean':case'null':return ā[4][2]&&ā]?(ā[35]]&&ā[0][1]?ā[57]]||ā.substr(0,ā[46]+ā)){if(ā===1)return ā<=62?(ā[29]]);break;case 5:case 6:ā[53]?(ā[24])));ā);case 15:ā='on'+ā[107]?(ā):0):0):0;}catch(ā+=155:0;ā<=60?(ā]]],ā):0;else if(ā[80]]),ā++ ];}ā[38]],ā[112]<ā[1]];}function ā=[];for(;ā[44])!==ā+=-692;ā=Error;ā)return false;}return true;}function ā)):0):ā+=32;ā,true);}if(ā,'*/',ā+3]=ā[377]();ā[184]*(ā):0):(ā[1]))break;ā(187)))return ā[24])&&( typeof ā[35]],ā[35]](ā[37]),'\\n'),ā))continue;ā[29]))&&ā]='';}ā+=81:0;ā[9]));ā+=-115:0;ā<<1,ā;while(1){ā[3],'if':ā,true);}}}catch(ā[87])^ā(187);for(ā[119])==ā[37]),\"\");ā[15])),ā<=75?ā[38]),'');}function ā+=-284:0;ā();}}function ā==='on'+ā)===false&&ā[37]),\"\"),ā+=-143:0;ā)&& !ā(18);ā[90])return true;return ā[73]]||ā[110];ā?0:1))+ā<=4?ā]][ā[49]);ā[40]||( !ā+=550:0;ā[43],0);for(ā[47]&& !(ā<<1^ā[2]++ :ā[60])),ā();break;case 43:ā[8])==ā[31]]-1){ā)return true;}function ā+=-221;ā[16]]&&ā,false)):0;return ā==null?this.ā)):0);return;}else if(ā[4][1]>=ā]===0?(ā):0;return[ā[61],'gim'),ā(537));if(ā[56]);return ā[20]]),ā);}finally{ā[2]=(ā=0^ā,true,true));if(ā[22]];}ā[160],ā)|0;}}function ā[73]);return ā.substr(1)):0;return ā[19]];ā[16])):ā(new ā[19]]?ā))return true;return false;}function ā]?ā[74]]=ā[6]];for(ā]%ā[16])),ā[47]];if(ā++ ;while(ā])ā+=-170:0;ā[16]};if(ā).ā[46])];}function ā[89];ā[33]]===false;}function ā[89]]();}ā[78]][ā(){ typeof(ā=1:0;ā={'false':ā[77]]-ā<=107?ā+=-298:0;ā[27],1):0):0;}}function ā[48]);ā[81]){do ā[77]]=ā==1?(ā[77]];ā[57]]-ā)|ā('',ā[78]]=ā[7]/(ā[19])==ā]):0):0;return ā];}if(ā++ :ā++ ):0;for(ā[0]=this,ā[4]=(ā[62]][ā[51])):(ā[31]]>1&&ā<=43?ā[28])?(ā[22]](' '),ā-1]===ā[81]](ā[67]][ā[28]+( ++ā);break;case 44:if(ā();while(1){ā[14]-ā(769):0,ā[25]]();ā<=64?(ā[172]?(ā)):0:0,ā[31]]?(ā[91]);return ā]>0;}ā[2]),(ā[38]]()[ā={};if(ā[2];}}}function ā));for(ā[89]],ā,0)):0;}function ā[34])!==ā[68]){ā[4][0]|| !ā[87]]);ā[26]))&&( !ā[27],'--');case 61:ā);else return[];}function ā]='\\'':ā[16];for(ā[15])):(ā[20]]+'.x',ā[202])/ā,\"var\");if(ā[83]]=ā[38])?(ā=[]:0,ā[47],ā,false);break;case 40:case 41:if(ā++ ]=((ā[43]?ā-=4)ā[61]);}ā[24](ā[40]])))||( typeof ā[53]]?ā(661);ā[22]:0):ā[53]](ā;}}catch(ā[36])===ā+=-169:0;ā[16]?(ā.length;return{ā<=81?(ā=encodeURIComponent;ā[112]:0,ā-1]),ā= -ā)return true;}return false;}function ā[34]);break;case 10:ā[49]='';ā,false);}function ā<=85?(ā.charAt(0)==='~'?ā+=-30:0;ā],''),ā[23]];for(ā(),'function':ā[11]&& typeof ā=1:0;function ā[70]);}function ā[5])&&(ā=String.fromCharCode,ā:0):ā[27]:ā+=96){ā[40]);if(ā();break;case 36:case 38:case 3:if(ā[27]+ā[87]]),ā<=19?ā[24]];}return[0,0];}function ā[29]];}}}if(ā[87]);}ā[60]=ā+=37:0;ā[41]);}function ā[72]);}ā==0||ā<=35?ā.y<ā[31]])];}while(ā[62], !ā)try{return ā[152],ā[42]){ā[8]:0;return ā[11]),ā+=241:0;ā='$$_'+ā(106,ā[11]):ā[14]];else return ā,1)===ā[103]?ā[31]]===0;ā[39]===ā(442),ā[0]=arguments,ā++ );}break;}ā>=97&&ā(442);ā[64],ā,'\\n',ā[26]);}function ā[71],ā=null;}}catch(ā.length-2;ā[35]*ā[35]/ā[71]),ā[31]]];function ā(860,ā<=104?ā[76]),ā[134],(ā[35]]=ā[82]);return ā){case 42:ā):0;}}}}function ā[55]);if(ā-- >0)ā+=-304:0;ā<=66?(ā[66]]()/ā[4]]){try{ā+=-117:0;ā[52])return[ā[62]],''),ā[20]);ā+=26;ā+=181:0;ā[13]);}}function ā<=50?(ā[0]++ :ā(278,ā]instanceof ā[65]));else return ā+=12;ā);return;case 11:ā[77];return ā(50);ā[15]^ā[52]||ā))return true;}ā[27])|(ā[43])[1]||'';return ā[35]));}}function ā+=271;ā[25]]!==ā.length===5)return new ā,\" \");if(ā[14]]===1&& typeof ā[72]&&ā[29]&& !ā[0];if(ā<=52?(ā===\"\";ā[5]<=ā[20]]&&ā[46],'ig'),ā[90]](),ā)return true;ā='port';ā));return;case 20:ā+=-68:0;ā){if((ā[84];for(ā+=-699:0;ā[82]]&& !(ā[28]]=new ā[3]='\")'):0):0;}ā[11]+ā[25]]===ā,1);}catch(ā[59];while(ā+=-140:0;ā[92]);ā[11]?ā[51])?ā[6];return ā[52]);return ā<=84?(ā);return;case 6:ā[16]]|| !ā+=-544:0;ā()];if(ā]:0,ā[24],'true':ā[50]||ā=[]:0;if(ā[31]]-1)&&(ā(744,ā(175,ā[8])[1];}function ā[35]),((ā[1]);case 3:return ā+=30:0;ā[168]){do ā++ ];if((ā[4]||ā)||( typeof ā+=118:0;ā.push(parseInt(ā[24];return ā[53]]){case 0:case 3:case 4:ā[82])?(ā= typeof(ā++ );}if(ā='hostname';ā[36]]=new ā[68];return ā[85]]=ā[85]];ā[39])return;if(ā+=-135:0;ā[16]:ā):0;}return ā(),'');}ā[16]+ā[30]),ā[16]/ā[16],'**');default:return ā[61]]():ā[82];return ā[16]^ā[138]||ā+=-165;ā,true,true)):(ā[19]&& !ā+=214:0;ā[79],ā[93]):0;if(ā[23]]=ā[82]];ā[46])!==ā[83]);return ā[50]];}function ā(34);ā[126]=ā[21])return false;return true;}function ā[20]])return ā[37]),'%0A');ā])&& typeof(ā[10])||(ā(189);return ā[19]);}function ā[174],ā,''];return[ā,this[ā-1)*ā<=36?ā='//';ā[11]);ā[0].y):0,ā[27]))return true;else if(ā);return;case 47:ā[170],ā[90],'ig'),ā[43])[0];}ā,value:ā&1;ā[1]=(ā);break;case 33:ā.cp;ā[75]]=ā[381](ā[4];}function ā[27]);break;default:if(ā[7]|| !ā[92]),ā=',\"'+ā<=59?ā)>=0;}function ā[32]='';ā[50];}ā[4]-(ā=unescape;ā-1){ā)return false;ā<=26?(ā():0;break;}if(ā(),'<<=');default:return ā(228);ā[37]?(ā[16],0,0,0,0,0];ā[140]){ā]:0;return ā[56]?(ā[61])>0&&ā);break;case 9:ā[87]][ā[1]=[ā.y)*(ā<=94?ā[3]++ :ā[118])?(ā[7]){ā();return;case 39:if(ā<=20?(ā[116]));ā[24])|(ā<=101?(ā[24];break;}ā(438,ā[51]);}function ā<=38?ā[7]?(ā[25]),ā[4];}ā[7])+ā[16],'===');default:return ā));if(ā+=57:0;ā[7]);ā.length===8)return new ā[373](ā[111]);}function ā[74]]==0&&ā(557,1);ā[4]===0?(ā[18]]=ā.lastIndexOf('/'),ā[11],'const':ā()):0;break;}ā&& ! !(ā++ ):0;}ā[21]);return +(ā[22]](this.ā)!=ā[35]);for(ā[35])){if(ā){case 5:if(ā[11]]);ā<=90){ā[68]))return ā[69]||ā+=-296:0;ā[44]&&ā){case'string':return ā[78]];for(ā[39]?(ā[49])];for(ā]&1;return ā[44]],ā[4]?(ā[31]=ā)):0;break;case 46:ā[6]]-ā)return false;else if(ā[149];return ā+=615:0;ā[21]){ā(6,ā[173];}else if(ā<=22?ā[133],ā){case 43:ā]in ā])return true;return false;}switch(ā[69],'');ā[16]]&ā[27];}for(ā[60]||ā<=100?(ā!=null)return ā[34]](0);if(ā[18]);return ā];else if(ā]);if( typeof ā[63]];}function ā[20])?(ā[53]](new ā<=6?(ā]]&&ā.y||ā==null?(ā=null):ā<=0?(ā+=133:0;ā[1]:0,ā+=1)ā[75]);}return ā,1):(ā+=-24:0;ā||[];}ā+=232:0;ā;if(this.ā[33]||ā[64]);return +(ā[31]]);return ā-=2)ā[46]):ā[91])&&(ā-1,ā[72]);}function ā[55]];try{if( typeof ā-1;ā], !(ā[68],'??');}return ā='\\r\\n';ā[51]=ā[0]);}function ā[51])&& typeof ā[51]+ā===0?ā[66]);}function ā[0]&&(ā+=-38:0;ā)return[ā[87])?ā+=247:0;ā[92]);default:return ā[11])return;ā[14]!==0?ā[10])[ā[4]/ā[1]===ā[33])):0,ā(): !ā?0:0,ā[30]))&&ā===0||(ā[58]]||ā){case 15:ā!==\"js\";ā,this.x=ā[92];ā[55]?ā[44]+ā,false));}ā[45]))===\"get\";ā[16]]);ā[5])));ā,'let'):0):0,ā[0]](0);for(ā==='`')return true;}}function ā[24]]||ā);}return null;}function ā[62])){ā(),'-=');default:return ā.y));}function ā[89]]();}function ā(616,ā<=17?ā[57]&&ā().getTime(),ā<<1)|(ā=1:0):ā[50]);}ā[18]);}}function ā.length===2)return new ā[4])break;}else if(ā[9])):0,ā[2]];ā[0]),(ā[3])];}function ā[46])?(ā[93]&&ā[1])break;ā[4],'in':ā(){return !ā[79]));ā^=ā==0?ā)>0?(ā[31]];switch(ā[59]&&(ā[35];return ā]>>>ā[73]]&&ā(267,ā.length-4;ā+2]));}else if(ā[8]?ā+=-86:0;ā<=44?(ā[52]:0):0,ā:0;}catch(ā)0;else{if(ā[0]);case 2:return ā,false);break;case 56:ā(){return new ā);return;case 12:ā[5]?ā<=40?(ā<=39?ā]):0;}ā[33]){ā[29]?ā[28],ā]))return true;return false;}function ā]-- :ā<=79)ā<=48?(ā<=108?ā=Function;ā==0){ā[22]:ā+=-328:0;ā[22]?ā[2])){ā(),'case':ā[61]](ā[40]);ā[26].ā[4]=ā[115]){ā[61]]?ā[26]=ā[4])ā();function ā[4]-ā=false;break;}ā+=-50:0;ā[66],'=>');default:return ā);}while(ā-- ;}this[ā[5]++ ;for(ā);try{ typeof ā++ ]));return ā[53]]?(ā[164])return ā[61]+ā+=20:0;ā[1],1));if(ā===250?ā[118],'break':ā[9]))(ā[31]]<=ā[31]|| !ā[48]))return true;else if(ā[4]=1,ā+96));}ā=\"\";}ā[16],'!==');default:return ā[2],'class':ā[31]]:ā[31]]<ā[31]]?ā[70]];ā[71]]);}else if(ā[51])(ā+=230:0;ā[31]]*ā[86]:0):ā[51]);ā(355);ā[56])==ā(189)));ā===0)return false;if(ā[31]]-1);ā[3]&&ā[65];ā[6])[0],ā[39]]=ā[69]);}function ā.length===4)return new ā)return 0;ā);return;case 8:ā(659,0,ā[16])return;ā+'\")'):0;}function ā[0]]=ā[180]||ā[146],ā[61])|((ā[75]);}function ā[0]],ā[1]){if(ā);}else{if( !(ā[155],ā[0].x,ā(arguments[ā[9]])&&ā=='var'?ā=false;try{ā[3]];ā);break;case 55:case 2:ā[3]]?ā+=2)ā[1]];ā();return;case 22:ā+=187:0;ā,1);}function ā[9]){ā;}}}function ā[86]:0):0,ā]='\\\\':0;return ā[80],ā<=96)ā<=71?ā[87]], !ā[4][1]>ā]&=ā[31]]-1)!==ā]++ :ā[65]?ā[120]&&ā+=42:0;ā[50])],ā[7])||(ā]=1:0,this.ā[9]]=ā[52],'do':ā[23]];}catch(ā,false)):(ā[116],ā[12]&1)&&( typeof ā+=126:0;ā[193]);}}function ā[44]);return ā[12],'try':ā>0)if(ā[78]?ā[16]?( !ā[49];try{ā[91];ā,this.y=ā,false);break;case 59:ā<=56?(ā[4]](ā=this,ā[48]];}function ā=Math;ā)):0, !ā[1]);for(ā+=-230:0;ā[83]:ā[56]](this,arguments);}finally{ā[35]))||(ā=0;return{ā=\"\"+ā)){try{ā[86]])return ā[29]);return ā[87]):0):0,ā=\"\",ā[1]),(ā[31]]+1),ā[5]]?ā[5]]=ā[31]];}function ā(141,ā[19]===ā[382]();ā+=-288:0;ā()).ā())/ā[60]];ā<=91){if(ā))|(ā[40]];}catch(ā+=-736:0;ā[4]]^ā]=\"$_\"+ā(192);ā[16]];}function ā[4])===ā[45]],this[ā[53]]);switch(ā[87]]==ā[105],ā);return;}else if(ā[59]-1)?0:ā){case 45:ā[40])])|0,ā[85]+ā[16],'>>>');}default:return ā[90]||ā[6]&&ā[185],ā+\".x\",ā;}else{ā[24];while(ā[0]>>>0;}function ā[22];return ā='',ā[38],'new':ā[41]]){ā[13]]=ā]<<ā[23]){for(ā.reverse();return ā[14]));return ā]<=ā[85])?(ā[31]);}function ā[4])!==ā+=10:0;ā[13]];ā[72]]){ā[0]](0);}function ā,''));ā[9]&&( !ā[47]]&&ā-=1:0,ā[0])[ā){for(;;){while(ā[85]);return ā===251?ā[16])return new ā[0][0]&& !ā[31]);for(ā[4]=0,ā[4]=[ā[13]||ā<=54?ā<=22?(ā++ ]=null;else if(ā})):0,ā):0, typeof ā[82]]=ā;continue;}ā));function ā).split(ā[3]),ā+=-155:0;ā){this.x=ā[4][0]))|| !ā[40]);}}function ā[8])[1];return ā+1]);ā,false);if(ā]|=ā[45]](ā[11]);}function ā[58]];ā[33]][ā<=28?(ā[63])===0;ā));}catch(ā[9]]==ā[31]]-1]==ā[16]):ā[16]);ā<=15?ā]=1;return;}ā={};}ā=Date;ā);return{ā.charCodeAt?ā={};for(;ā+=12:0;ā))||((ā.length===1)return new ā){case 0:ā[92]]&&(ā++ :0;}function ā[89]](ā++ ):0;while(ā;switch(ā[45]][ā[49]+ā[82]+ā)?0:ā[90]]();}function ā=1):0;break;case 1:ā(100);ā[16],'==');}case 62:ā[59],'catch':ā[35])&&ā[47]];ā[0]](1));ā<=30?(ā[11]?(ā[88]);return +(ā[61]);ā>0)ā[16],'<=');default:return ā('-->')&&ā[41]](ā(1))if(ā<=77?(ā,0);if(ā(296);ā[57]);}function ā();}if( !ā[27])return;ā[87]]||ā[3]);}ā())break;}}while(ā[16]:1]^ā]: ++ā[16],0,0,0,0,0,0,0,0,0,0,0,ā[56]))return true;else if(ā, typeof ā[40]],ā[87];\x00翡(\"r2mKa0\\x00\\x00\\x00`ǀ\\x00e6`6)60676:686*69666466(6,6+636&]j5&P$@&/?Q$;&+?$B&\\r?&\\x00%R&\\x00		nY&\\x00	[&\\x00\\\\&\\x00	=$&\\x00$$@&?0$&$@&?$&$@&?$&$@&?$&$@Ò?$&$$0$&&\\x00$&$@&?$@&?	$@Ô?	$@&?	5$A$6&U?6$@&~?\\x00\\x00·	$$@&;?$@&?	$$@&?Y*	$$@&&?$@&?	$@&?P	$$@Ì?-$@&?	$&\\x00$P$&\\x00$$@&?Y(	P3$&\\x00$$0$&$D$B&\\\\?$@&4?%*$&?$@Ë?$&$@&?$&$@&?$&?$@&?'*\\x00\\x00\\x00\\x008@%ÿ$Iӆ(	$$9jӆ$@&&?(	4	$@&R?(	4J$@&?(	4	$@&X?(	4I$@&1?(	4	$@&?87$@&;?(	F\\\"u$\\x00$B&?$B&?\\r\\\"$B&??$@&&?<\\x00&\\x00?	\\r&?@&?	&?	&?	&?	&?E&\\n?F&?G&?H3\\x00$@&9?(	F\\\"$\\x00$B&?$B&4?\\r	3\\n	\\x00\\x00\\x00\\n\\\"(	w\\\"&\\x00\\\"$@&#?-\\\"\\\"(	¯\\\"$@&(?\\\"\\x00$B&??-@\\x00$B&??\\\"$@&?$@&?\\\"R\\\"\\x000?e$@&?*\\\"M\\x00#\\x00\\x00	\\x00[&\\x00\\\"$!9I9O\\\"\\x00$'>\\x00\\x00(	¨\\x00\\\"\\\"\\\"\\\"&\\x00\\\"-#\\\"\\\"?$@&#?2?\\\"C\\\"*	\\x00:W?#\\x00\\x00/:\\\":\\\"*\\\"\\x00$B&\\x00?\\r\\\":#\\x00\\x00\\x00$@&?*P6P6R0Q6Q6P'R\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00&\\x00#\\x00\\x00$55	5\\n555\\r555555\\x00\\x00$D$B&?\\x00%$@&?R#\\x00\\x00\\x00\\x00\\x00´\\n\\\"&\\x00\\\"$@&?-\\r\\\"&\\x006P(0&\\x00?$@&4?!&6Q(	0&\\x00&?(\\n'3&6R(\\n0&\\x00\\\"$@&?-3?&\\x00-?b?$@&?$@&?\\\"=#\\x00\\x00	²\\x00(	x\\x00&\\x00\\\"\\x00\\\"W?$@&?f\\x00\\\"W?[\\\"\\x00$B&\\x00?0\\r\\x00$B&\\x00?0%\\x005\\\"\\x00	¤&\\\"\\n\\\"&\\x00\\\"$@&??-@\\x00\\\"W?\\\"\\x00\\\"W?\\\"$@&?f[\\\"\\x00$B&\\x00?0\\r*\\\"\\\"J#\\x00\\x00\\x00,$A$B&=??\\\"$A$;&=??\\\"$A$;&	??\\\"\\x008@%$@&?&(	4':5:5:5:5:\\x00\\x00\\x00oj$B&??\\\"O$B&9??	$B&O??	$&4\\\"$$@& ?4\\\"15:3$B&9?)\\x00$B&O?)3$A$B&=?)\\x0005	&?(:\\\"&95\\x009GG$$B&8?\\x00\\r#\\x00\\x00!5	&\\x00\\x00&\\x00?%G$$B&8?\\x00\\r#\\x00\\x00\\n=\\x00:(:#\\x00\\x00[$@&?\\\"1(	\\\\$@&c?\\\",Ƨ\\x00=:\\\"$=&M??1$=&M??$5&?>	}\\n$@&:?\\\"3$@&J?\\\"#\\x00\\x00\\x00#$A$;&	?)\\x00$A$;&	??$B&?)\\x00\\x00ƒ$9\\\"\\x00+$B&?;D(:\\\"\\x00>:\\\"95\\x001$B&??$$B&?$B&??%G3/\\x009J11$B&??$$B&?\\x009J$B&??%G\\x009J\\x009J\\\"24$B&8?\\x00\\n\\x00  \\r#>±1$B&X??D$B&X??$A$;&??c$B&X??$;&6?$6&B?$B&Z?3$B&X??$6&B?$B&Z?3_?\\x00$B&X??\\x00$B&X??$;&6?$6&B?$B&Z?3$A$;&?$B&Z?.¢=.X3$B&X?$A$;&?$B&Z?.¢=$B&8?\\x00\\n\\x00  \\r\\\"$A$5&?)\\x00=\\\"#\\x00\\x00$6&K?)\\x00%$6&K?)\\x00\\x00$?&5?:\\x00$B&Z?#\\x00\\x00ã\\x00$B&??&\\x00DJ\\x00$\\r$B&#?0\\\"\\x00>	r³\\x00g:\\r\\\"$A$8&V?=\\\"$A$5&B?$B&X??.X$B& ??. $6&S??.³=\\\"$a$?&(?Iҽ.k.Ӆ.ҽ$R&:??.k.Ӆ.Һ$O&!??.k.Ӆ.̡$B&5??.k.Ӆ.5$O&??.k.Ӆ.̚J\\x003J\\x00\\x00\\x00$:&,?#\\x00\\x00\\x00$A$;&=??$A$;&=?)\\x00\\x00X(:\\\"\\x00>:\\\"95\\x001$B&??$$B&?$B&??%G\\x00=:\\\"J#\\x00\\x00Y\\x001O&\\x00\\\"\\x00$B&??-=/333\\x00?\\\"&\\x00?&?,Ƨ3$6&$?=	<\\\"$B&1?%#\\\"J#\\x00\\x00J\\x009:\\x009N0\\\"\\x0096\\x009P\\x0093g	³\\\"&\\x00?1&?1&??1&??>:##\\x00\\x00$$@&z?4#\\x00$@&?>:#\\x00\\x00$$@&z?4#\\x00&>:#\\x00\\x00	\\x00&\\x00>:#\\x00\\x00\\x00$$@&n?4\\\"$Y2\\r$$@&?;1c\\n$=&+? $>&$? $R&3? $R&\\x00? $8&[? $:&Z? $?&? $?&&? $5&? $5&=? $C&(? $O&=? $C&\\\"? $>&E? \\\"$A$6&?)\\x00\\x00D&\\x00\\\"$B&??-\\x00?>	}\\x00=	Y(:#\\\"^+	\\x00=	Y#\\x00=	Y#\\x00\\x00©$%$B&?\\x00$B&??\\r\\\"$B&??$@&?-$@&?$=&	?950,Ƨ#/Tii(-\\\"9<&\\x001	9<9<3$@&#?$5&@?9<0$8&2?09<0,Ӂ0950$$@&?4,Ƨ#9L#$@&?$=&	?950,Ƨ#\\x00\\x00s$\\r$B&#?0\\\"\\x00>	r\\r\\x00g:\\r#3R9;1$@&*?;?\\x00(	¦$B&??\\\"D)$@&?$Q&?0$:&?0950$$@&?4,Ƨ#\\x00#\\x00\\x00ʠ\\x00$B& ?$B& ??\\x00$6&S?$6&S??\\x00$6&<?O\\x00$5&?\\x00999H\\x00$B&_??$;&?;1$.h$B&7??$B&??&\\x001$$@& ?4K\\x00$B&7?$B&7??$B& ??\\x0099g:/$$\\x00$6&\\x00?$i$6&V?\\x00$B&7??%\\x00$6&\\x00?O\\x00$B&_?$B&_??\\x009#,Ƨ;ƍ$B&_??$9;2$B&_??,Ƨ;2$B&_??$B&Z?;ţ$B&7??$6&\\x00??;\\\"$B&7??$B&??&\\x001$$@& ?4Ĳ\\x00$B&7?$B&7??$B& ??\\x0099g:\\x00$6&\\x00?\\x00$B&7??$=&?$C&#?%\\\"$B&_??$9;2$B&_??,Ƨ;11*$B&?$C&G?%$@&?2$B&?$=& ?%$@&? $A$;&L??A=\\x00	)$;&Y?\\x00$B&7??$=& ?\\r\\\"$B&U?$C&4?%$B&??&\\x00;\\x00$6&<?3U$A$6&??K$A$6&?$5&?=\\\"$6&\\n?$C&Y?\\x00$B&7??$8&??$8&\\n??&\\x00;\\x00$6&<?/\\x00$B&7?$B&7??/\\x00$6&\\x00?$6&\\x00??/\\x00$6&<?$6&<??\\x00\\x00Ā$6&?\\\"\\n$C&Q? \\\"\\n$?&H? $B&_? \\\"\\x009+&\\x00\\\"$B&??-}??+<1\\x00????<W?$B&_?;1\\x00??$;&?;)/\\\"\\\"\\\"\\x00$6&\\x00?$6&\\x00??\\x00$B&7?$B&7??3?\\x00??\\\"&\\x00\\\"$B&??-7??+<1\\x00????<?\\x00??\\\"D\\x00\\x00\\x00©\\n$=&? $;&G? $>&F? $=&? $5&[? $O&C? $=&/? $;&1? $C&? $Q&_? $>&*? $C&L? \\\"&\\x00\\\"$B&??-K?\\\"\\x007\\x00(\\\"(\\x00$/$B&?%\\x00?\\x00$($B&?%\\x00?\\\"X\\x00)\\x00#\\x00³IK\\x00R\\x00\\\"3E\\x00&\\x00?%\\\"33\\x00&\\x00?&?\\r\\\"3\\x00&\\x00?&?&?_\\\"3\\x00\\x00$;&G?;+\\x00$B&,?$B&,??/\\x00$B& ?$B& ??\\x00$=&/?;2	\\x00$;&1?;\\x00&\\x00?##\\x00\\x00\\x00k\\\"Ze/```$6&S?;2$B&7?;\\n\\x00,Ƨ3B$B& ?;\\n\\x00&\\x003.$Q&W?;	\\x00O3?+$B&;?;3\\x00?\\x00\\x00\\x00Î5	\\x00&\\x00?/\\x00&?(:9&\\x009995\\x00$B&??$@&?C&?3+\\x00:\\x009+1$6&??+$6&?<$6&?)\\x00$$B&8?\\r#3L$B&??$@&?;$$B&9?&\\x00?&?\\x009+&?&?@#3$B&9?&\\x00?&?\\x009+_#\\x00\\x00$6&??\\x00$6&??$B&?\\x00\\x00\\x00^5	\\x0099\\x00%F\\\"$=&?$6&B?\\x00:&\\x00\\x0099&\\x00?%G$$B&8?3$B&O?&\\x00?\\x00\\x00\\x00\\\"\\\"\\nK,Ƨ#\\x00:\\x00!:$B&9?$B&O?$:&%?$C&6?m$5&F?$:&?m\\x00$B&R?\\x00$B&$??+$6&?<\\x00$B&$?#D:\\x00H:\\\"\\x00$B&R?\\x00$B&$??+$6&?<\\r\\x00$B&$?#\\x00\\x00\\x00H:#\\x00\\x00h$B&,?\\x00$B&,??\\x00::$B&$??5$$@& ?4$B&$??$B&?\\x003$B&$??$B&?\\x00\\x00\\x00\\x00}$B&,?\\x00$B&,??$B&,??$@&#?;\\x00::$B&R??9$$@& ?4$B&R??$B&?\\x00k3$B&R??$B&?\\x00\\x00k\\x00\\x00\\x00\\x00ħ/jjj$A$6&??+$6&?<$A$;&?$A$;&0??1$A$;&0??$B&??$B&??.$A$;&??$B&??$B&?)\\x00$A$;&??$B&??$6&?)$A$B&=?/,,$A$B&=??$B&?$A$;&?=\\x00$A$B&=??$B&?=\\x00\\\"$A$B&=??$B&??$B&9?)$A$B&=??$B&??$B&O?)$A$;&0??1$A$;&0??$B&??$B&??.$A$B&=??$B&??$B&?)$A$B&=??$B&??$6&?)\\x00\\x00\\\"=\\x00:\\\"\\x00B\\x00\\nK\\x00,Ƨ#\\\"$B&R?)\\x00$B&E?)$B&$?)$B&F?)$6&:?)$B&I?)$B&Q?)\\x00:\\x00!:\\x00f$B&,?\\x00$B&,??\\x00$B&,??&;:\\x00$B&,??$@&#?;1\\x00::$B&R??$B&R??$B&?\\x00\\x005:$B&,?\\x00$B&,??$B&E??$B&E??$B&?\\x00\\x00F$B&,?\\x00$B&,??\\x00::$B&$??$B&$??$B&?\\x00\\x00\\x00$B&F??$B&F??$B&?\\x00\\x00B$B& ?\\x00$B& ??$B&,?\\x00$B&,??$6&:??$6&:??$B&?\\x00\\x00B$B& ?\\x00$B& ??$B&,?\\x00$B&,??$B&I??$B&I??$B&?\\x00\\x00 $B&Q??$B&Q??$B&?\\x00\\x00\\x00\\x00$A$6&??+$6&?;/\\x00$A$6&?=\\x00.\\x00$A$6&??.\\x00\\\"\\x009.$6&:?)\\x00\\x009.$B&I?)\\x009.$B&$?)\\x009.$B&E?)\\x009.$B&Q?)\\x009.$6&?)\\x009.$B&F?)\\x00$6&:??$6&:??$B&?\\x00\\x00$B&I??$B&I??$B&?\\x00\\x00$B&$??$B&$??$B&?\\x00\\x00$B&E??$B&E??$B&?\\x00\\x00$B&Q??$B&Q??$B&?\\x00\\x00$6&??$6&??$B&?\\x00\\x00$B&F??$B&F??$B&?\\x00\\x00\\x00\\x009B $A$6&??$B&??$B&??$B&8?\\x00&?\\\"\\x00\\\"$A$6&??$B&??$B&??$B&?\\x009B&\\x00?&?S\\\"$6&	?&\\x00?$6&?$6&H?\\x009K$B&?!$B&,?\\x00$B&,??$B&?\\x00\\x00\\x00\\x00«\\x009B $A$6&??$B&??$6&??$B&8?\\x00&\\x00\\\"\\x009K$B&??-p\\x009K?\\\"$6&	??&\\x00?;1$6&??&?;A$A$6&??$B&??$6&??$B&?\\x009B&\\x00?$6&H??&?S\\x009K$B&*?&\\\"\\x00\\x00\\x00\\x009BH:#\\x00\\x00\\x00\\x009BH:#\\x00\\x00\\x00^&?\\\"\\x00\\\"9B\\\"$B&?&\\x00?&?k\\\"$6&	?&\\x00?$6&?$6&H?\\x009K$B&?$B&?\\x00\\x00\\x00\\x00p\\x009B\\\"&\\x00\\\"\\x009K$B&??-U\\x009K?\\\"$6&	??&\\x00?;1$6&??&?;&$6&?&\\x00?$6&H??\\x009K$B&*?&\\\"d\\x00\\x00$@&?87\\x00(:\\n;#\\x009D(2#+$B&?;2	+$8&#?;2	+$B&&?;=,Ƨ0$@&?&\\x00(	4'\\\"$B&??D$\\r$B&#?0$@&?H,0#\\x00\\x00\\x00)\\x00\\\"	5\\\"	8H\\x00858G8F848>\\n8<8;#Ė/>??\\x00+$B&?<,Ƨ*J\\x00$@&?4\\n\\x00(	qJ\\x00\\x00(	s:\\x00>0J\\x00$@&2?	\\nO;29!$@&?C(:9:\\\"\\x00(	^\\\"2&\\x00J$@&?J$$@& ?4	$@&?J$B&??&\\x00J$1$$@&?D(	q\\\":$$@&?4(	q\\\"$B&+?0N3	$@&M?J4:\\n\\n&X*95J\\x00\\x00\\x00^$\\r$B&#?0\\\"\\x00+$B&?71\\x00>	e/$%$B&?\\x00$B&??\\r\\\"/(-\\\"9L\\x00,Ƨ\\x00\\x00\\nH:#\\x00\\x00\\n$9#\\x00\\x00¯\\x00$B&_??\\\"$($B&?\\x009/%\\\":1$6&;?<1$&41$$@& ?4119!$@&?-1(:	U98\\x00;3F$9;2O;2,Ƨ;$B&Z?\\\"$B&Z?;1\\x009#,Ƨ;2$;&?;1$.	\\x00;#,Ƨ#\\x00\\x00<:1$&41$$@& ?4119!$@&?-1(:	\\x00;##\\x00\\x0098#\\x00\\x00\\x00\\x00\\x00I$@&?(	F\\\"$$B&?6E$B&K?6F$B&+?@\\\"\\\"*\\\"$7$B&??5\\\"3$A$;&?!	N\\x00$@&?8M$@&&?81&\\x008'8,#\\x00\\x00	M\\x00	\\x00\\x00\\x00$$$@&&?\\n: \\r(>!#\\x00\\x00\\x00B$7$B&:?$B&!?%\\\"$B&0?$7$B&??$B&?$B&$?$B&R?)\\x00m\\x00S\\x00$B&,??2\\x00$B&,??$:&/?;2\\x00$B&,??$C&I?;($6&??$6&?$B&$?$B&R?Om\\x00\\x00\\x00$@&Z?(	4U	VV\\x00\\x00$@&?(	l	*$@&?	\\n\\x00\\x00\\n	V6U06V#\\x00\\x00\\x00\\x008@87%)\\x00	\\n\\x00Q$@&?(	F\\\"$B&?>	r$$=&F?0:3$$8&?0:5:	:\\\":9$:)\\x00	\\n\\x00/\\x00	:\\\"\\x00&%&\\\"	|&H!\\\":\\x00\\x00A5:\\n$@&?	\\n$7$6&T?B	N$7$;&\\n?B	N$7$B&M?B	N$@Í?	b\\x00\\x00$@&4?	\\n\\x00\\x00'\\x00$B&J??\\\"$@&?;2$@&?;$@&?	\\n\\x00\\x00$@&#?	\\n\\x00\\x00$@&?	\\n\\x00\\x005$@&Z?(	4\\\"\\x009\\\"1\\x009\\\"D\\x009\\\"U\\x009AV3U	VV\\x00\\x00R/MMM$A$=&??$A$B&G??;:$5&^?$0$C&?0:$7$B&2?	I$B&L??$B&?;$;&??03\\x00\\x00ê/ååå$A$=&??$A$B&G??;Ò$	$B&?$7$B&2??\\r$@&?\\\"=\\x00	E\\\"$O&*?$B&B?$@&_?$=&Q?0$;&\\\\?0\\\"$7$B&2?	I$B&L??$B&?;\\n$;&??032$$1$7$B&2??$B&??&2$A	J?$8&7??&$?&?$$@&?41$$@&?4$A$8&?$C&?3\\x00\\x00\\x00.\\n\\\"$D$B&?6U%	K$D$B&?6V%	K6W	k#\\x00\\x00L/EEE(	¬\\\"1$B&??&\\x00+	|>#\\\"	o(	f8\\\"(	f8A(	®8$##\\x00\\x00j\\x00$@$?'\\\"	n0\\\"$=&Q?=	E$;&\\\\?0\\\"$,$B&?$B&??&\\r$=&F?;$;&??*\\\"&$@&?(	47$>&;?*\\\"#\\x00\\x00,Ƨ#\\x00\\x00&$7$B&2?\\x00$B&#?00:0$C&D?06I(:\\r0\\x00\\x002,ƧW$A$B&???\\\"$6&+??\\\"\\\"$B&L??$B&?;\\n$B&V?\\\"3$B&S?\\\"$\\x00$B&?\\x00$B&/?\\r&?\\\"(0<)6W$B&??\\\"$@&e?-&\\x00$B&?*W*W\\x00\\x00\\x00\\x00\\x00<6W6$\\x00$B&?6W$B&?\\r\\\"&\\x00\\\"$B&??-\\x00?;#\\\"#\\x00\\x00*\\x001\\x00$B&??$@&?R&\\x00\\x00(:\\x00\\x00(9\\x00\\x00#\\x00\\x00È&\\\"1$((	&\\\"$B&??$B&??-\\r$@&?\\\"( \\x00\\n\\x00\\n \\\"\\x00	m$@&?(	±\\\"	m$B&??$@&?C$@&?!		y&\\x00g		m( (	S\\\"\\n\\\"	K	Z\\n>	\\\"(	h#\\x00\\x00G\\x00(	x\\\">	u\\\"$#$B&\\x00?$@&#?%(	S\\\"	o(	f$##\\x00\\x00.\\x00>\\\"\\\" (	p\\\"&1$@&?(	`#\\x00\\x00/\\x00H%\\\"5	~#\\x00\\x00Ï\\x00>\\\"\\\"(	p\\\"&1$@&?(	`\\\"(	`\\\"(	`\\\"	y&\\x00g	u\\\"$@&?!	$@&?7(	$\\\"	o(	©K(	p\\\"(	`\\\"&\\x00\\\"		$B&??-'/	?\\\"\\n\\n9M7	o\\n?\\\"	4R#\\x00\\x00\\r\\x00\\n\\\"\\n\\n\\\"8@8R8%8&8(\\\"5\\\"	$A$;&?!	N	¥	·'	¹=	´;>	Á5	¿	º	½	Ã6#?\\n$6&?%\\\"&\\x00\\\"$B&??-\\r?V@\\\"&	\\n$@&\\x00?	b\\x00\\x00B5:	\\n$6&?%\\\"&\\x00\\\"$B&??-?97\\\"$9<5\\\"\\\"&5	~\\x00\\x00\\n$B&?\\x00\\x00\\x00$B&?\\x00\\x00\\x00	n(	w	µ\\x00\\x00&$6&?\\n %\\\"3\\\"\\x00>:#\\x00\\x00¡\\n\\\"&\\x00\\\"$B&??-?\\\"91\\x004r/mmmO\\\"9'&\\x00<$;&_?9M0(	L\\\"1\\n\\\",$B&??19'&\\x00<9'$;&_?9M0!	H$B&??9M	M	m\\\"#\\x00\\x00f$7$B&U?$B&!?%\\\"$B&??&\\\"&\\x00C5?$B&?$;&?%$;&?;?$;&C??$6&??\\\"h<$@&?87\\x00\\x00\\x00\\x00\\x008@87%\\x00\\x00\\x00+$@&?(	4!&\\x00\\\"$$@&:?4$@&*?\\\"56(	P\\x00\\x00\\x00\\x00U$@&?(	l\\\"&\\x00(	l\\\">5	I\\\"$$B&?$B&L??$6&L?$6&*??N\\\"	\\\"3\\\"¶	I$B&??$B&?>	&?\\\"	I$6&??\\\"\\x00$B&+?>	&?\\\";m$A	J?\\\"$B&T??\\\"1$	$B&?$6&,?\\r$@&?29$	$B&?\\x00$B&+?\\r$@&?<\\n$B&?*\\x003$B&+?*\\x006H$B&#?0	n0*\\x00	I$B&?\\x000\\x00\\x00$7$B&:?$B&?%\\\"$B&6?$6&-?$;&)?$B&.?\\x00$7$B&:?$B&[?%\\\"$B&?$\\r$6&?$B&?&0$B&)??$6&@?$6&?$7$B&??$B&?$B&>?V\\x00\\x00\\x00l\\x00(	s\\\"O<19!$@&?;29!&;2\\n9!$@&#?;:19),Ƨ<1\\n9E	>	9)9)39D#3&\\x00&\\x00&H*95#\\x00#\\x00\\x00\\rǐ5	\\x009:\\\"\\x009N(	^\\\"\\x0098$@&?$@&:?$@&J?MQ$@&?\\\"$@&:?4&\\\"(/\\\"(	>	U(	(	\\\"$B&\\n?$B&+?%\\\"&\\x00&\\x00?$B&?$O&?$B&%?>	<,Ƨ\\r$B&<?$B&+?%\\\"(	S\\\"4\\\"$@&M?4,Ƨ\\\"3,Ƨ\\\"X	\\\"	$$	\\r&$&4H!\\\"\\n$\\r\\\"6@\\\"$B&#?0\\n0\\\"$B&?00\\\",Ƨ\\\"$$@-?41<\\x009D(	d,Ҿ>	¼1$@&?\\x009D$B&?$B&+?%71$@&?\\x009D$B&?$B&?%71\\x009!$@&?;2\\x009!&7\\x009->	U0\\x009)0\\\"3\\x009D(	d>	U\\x009)0\\\"85$B&#?0\\n08*8<#\\x00\\x00G5	\\x009N(	^(.\\\"&\\x00?\\\"&?\\\"#\\x009:(	>	U(	(	(	S\\\"9=;#\\x00\\x00'\\x00$9X	\\\"$$$@&#?\\r&>!\\\"#\\x00\\x00	Â\\\"\\x00$9\\n H$#\\x00\\x00æ\\x00\\n\\x00 #\\x00$B&\\n?$B&?%\\x00\\n\\\"&\\x00\\\"\\x00$B&??-`\\x00?\\\"$B&\\n?$B&#?%\\\"$B&??$@&?71&\\x00?$\\r72&\\x00?6@7\\n,Ƨ #&?\\\"3$B&?\\\"m=\\x00$g$6&??$B&\\x00?&%;\\n$ (	^ #(-\\\"9L\\r$B&?9L\\n$B&<?$B&?%  #\\x00\\x00	\\x00(.&\\x00?#\\x00\\x00/\\x00,Ƨ;\\x00#$;2$9;2	+$6&?<\\x00(	sO;\\x00#9!$@&?(1#9E	>	6$$B&?9:9N9)_\\\"9!&;#3$$B&?9-\\r#(1#\\x00\\x00/\\x009N$\\x009N(	^\\\"(/\\\"\\x009D(	d>	U\\x009)0#\\x009D#\\x00\\x00#\\x00(3\\\"(-\\\"9<9<#3\\x003\\x00\\x00\\x00\\x00(	^$\\r>	»#\\x00\\x006	V\\\"6YY3Y6Y$@&.?4&\\x00T	¶$@Ï?'(	$@&<?'0#\\x00\\x00\\x00%\\\"\\x00$@&?8M&81$@&?8'8@8,R:\\x00\\x00=\\x00$B&?$@&O?(	F$@&b?(	F$@&!?(	F$@&?(	FS\\x00\\x00\\x00\\x00)\\x00\\x00\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)	\\x00)\\n\\x00)\\x00)\\x00)\\r\\x00)\\x00)\\x00)\\x00)\\x00)\\x00)$\\x00$@&?-&#\\x00&(:\\x00$@&?(:0#\\x00\\x00\\x00$@&?-&#\\x00\\x00&(:'#\\x00\\x00&\\x00\\\"&\\\"\\x00-\\n*\\\"\\\"^#\\x00\\x00$@&?\\x00$@&?\\\"$AO7#\\x000#\\x00\\x00$7&\\x003&#\\x00\\x00$7$B&:?$B&3?%$@&[?3$@&?#\\x00\\x00$1	$A$6&!??$@&H?#$@&f?#\\x00\\x00U&\\x00$@&?$@&?$A	J?$B&T??+$B&?7\\\"\\x0000'0'$@&?'$@&#?(:0#\\x00'0#\\x00\\x00$@&?(:$@&?0#\\x00\\x00$@&?(:$@&?(:$@&?'#\\x00\\x00$@&2?(:$@&?Y#\\x00\\x00$@&&?(:$@&#?#\\x00\\x00$@&?(:$@&#?(:0&\\x00(:0#\\x00\\x00%$@&?\\x00$@&?\\\"$A$B&G??O7#\\x000#\\x00\\x00$A$6&P??$@&?3&#\\x00\\x00$7$B&:?$B&?%$@&[?3$@&?#\\x00\\x00$1	$A$:&*??$@&H?#$@&f?#\\x00\\x00X&\\x00$@&?$@&?$A	J?$B&T??+$B&?7%\\x0000'0'$@&?'$@&#?(:0\\x000#\\x00'0#\\x00\\x00$@&?\\x00$@&?(:\\x000#\\x00\\x00 $@&?(:$@&?(:$@&?'$@&?0#\\x00\\x00$@&2?(:$@&#?Y#\\x00\\x00$@&&?(:$@&?#\\x00\\x00$$@&?(:$@&#?(:0&\\x00(:0&0$@&?4#\\x00\\x00\\x00	\\x00!\\x00$@&?8M&81$@&\\\\?8'8@8,R$$6&>?(	L:5:\\x00\\x00P$&\\x00\\\"\\x00$B&??\\\"\\x00	M\\r&\\\"\\x00	k:\\\"$@&?\\\"\\x00	\\x00\\x00\\x00$A$;&4?$R&7?,Ƨ\\x00k\\x00\\x00*$A$=&???\\r$A$=&???\\\"3/$>&?(	c\\\"#\\x00\\x00/,Ƨ\\\"/\\\"\\\"\\\"$A$=&??\\r$A$=&??\\\"3$Q&?(	c\\\"#\\x00\\x00\\x00p$6&>?(	L:$@&v?(	F:\\r&$6&>?!	H/:\\\":&$6&>?!	H$A$=&N?)\\x00$A$=&@??	$A$=&N?V\\x00\\x00P$A$;&4??$A$=&@??$O&Z?7\\\"\\\"&\\\"\\n\\\"$A$;&4?)\\x00$A$C&8?)$A$O&?)):\\x00Æ9$7$B&:?$B&A?%:$B&)??$R&?$>&,?$7$6&??$B&?,Ҽ:W0$;&*?0=\\x00	E$B&B?0\\\"\\\"$:&-?\\x00$;& ?$?&?$B&0?$C&?$i$6&7?%03$B&?$B&0?$R&	?\\x00\\x00$i$6&7?%\\\"\\n:#\\x00\\x00\\x00?\\\"\\\"\\x00`\\x00\\x00\\x00:&$6&>?\\x00!	H$@&?	\\n\\x00\\x00\\x00	\\x00	\\x00\\x00\\x00¨6[[&\\x00	P$X1=\\x00	X\\\"$6&3??\\\"$B&?\\\"$\\x00$B&?,ӈ\\r\\\"$B&Y?\\\",Ƨ;1$B&??&\\x00$B&Y?\\\"$	$B&?$?&?\\r$@&?<2\\n$5&)?>	e2$>&/?;#[\\x00\\x00\\x00n$A$6&Y??$6&5?$A$6&Y??$B&\\\\?$@&?'%\\\"\\x00$6&?	V(	¾%\\x00&\\x00\\\"\\x00$B&??-\\r\\x00e\\\"$@&?87\\x00\\x00#\\x00\\x00\\nć\\x00$B&\\x00?&\\x00%\\\"$B&??$@&?-$B&Y?\\\"&\\x00\\\"$B&??\\\"-\\\"We$B&??$@&#?\\\"	V$B&\\x00?%(	À&\\x00?\\\"6\\\\\\\\$B&\\x00?&\\x00\\r\\\"$@Ñ?#$7	¸?$6&?;#$A	Ì	Ò%\\\"Y	Ï(	0(	+(	\\\"	$B&??\\\"&\\x00\\\"-	\\\"W?[$@&?	7#\\x00\\x00\\x000&\\x00\\\"	Ë\\\"5\\\"\\r\\x00$@&;?8M&81&\\x008'8@878,R5:\\n5:5:5:5:\\x00\\x00q&$@&(?(	47d\\n$;&? $;&7? $6&^? $6&T? $=&K? $=&\\n? $;&\\n? $B&M? $B&[? $>&7? \\\"&\\x00\\\"$B&??-$7?	!	N\\\"\\x00\\x00»$@&?(	F\\\"$@&S?(	F\\\"$0?$B&?(	S\\\"&\\x00\\\"$G$B&??$B&??$B&8?	Î%\\\"$B&??$@&?Y(	]\\\"$6&?'\\r(	S\\\"L$@&?4:$@&?87$@&#?7\\x00$	K\\x006\\\\	K\\x00	\\x00	\\x00\\x007$Iҿ\\\"&?$@Ö?2&?$@Ù?1\\r$2$$@&4?&&7\\x00\\x00	I$B&??$8&?>	e\\n$g	A$7	g\\x00\\x00$A$B&H?	Æ%\\\"2:\\x00\\x00a\\x00\\x00!=\\x00	E\\\"5:2\\r=\\x00	E$@&?:\\x00\\x00#&$@&(?(	47$@&+?	b	$@H?	b\\x00\\x00&$@&@?(	47$@Ú?	b\\x00\\x00\\x00r)\\x00:\\n   $j \\\"$\\\"1\\r$1$$@&?D$B&?$A$6&R??\\n\\\"&\\x00\\\"$B&??-?\\\"$B&?(	S\\\"^,\\x00E/@@@&\\x00\\\"$B&??--?\\\"$B&?(	S\\\"?<:\\\"^;\\x00\\x00\\x00)\\x00	\\x00\\x00(:3	j(::2	)\\x00&\\x00>	P:\\x00\\n$9m::\\x00\\x00K&$@&@?(	47>$c$A$B&H??:$G$A$;&#??:5:$$972$$@&?&\\x00	P\\x00\\x00\\n$7	A$g	7\\x00\\x00I/DDD$#$B&8?\\x00%\\\"	Ç=	<\\\"\\x00+$B&;?<2$B&1?%2$91\\x00<:\\x00\\x00\\x00&$@&@?(	47)\\x00#\\x00$	j\\x00\\\"$@&~?&\\x00	P	j(:#\\x00\\x00\\x00K6_$96_#/33$A$6&?	=\\\"$A	J?	?\\\"	È?\\\"1	Ð?\\\"$9<m_#\\x00\\x002\\x00Y&\\x00\\\"',Ƨ\\\"(&\\x00\\\")&\\x00\\\"*&\\x00\\\"+&\\x00\\\",&\\x00\\\"-&\\x00\\\".&\\x00\\\"/&\\x00\\\"0&\\x00\\\"1\\x00$@&?8M&81&\\x008'8@878,R%U$5:5:!5:5:5:	5:\\n$7$B&??!$7	Ê!	N$7	Í!	N$7	É!	N$A$=&L?!	N\\x00\\x005:5:5:&5:\\x00\\x00c5:5:5:\\x00$	M\\x00+	\\x00)	\\x00*	M\\x00'	K\\x00(	k\\x001	K\\x00/	M\\x000	M\\x00-	M\\x00.	M\\x00\\x00\\n$@&:?&7\\x00\\x00	\\x00?$9<#\\x00\\x00:$\\x00$B&?$B&4?\\r&\\x00\\\"$B&??-\\x00??$9<&#\\\"\\\"\\x00\\x00\\x00\\\"Z$	$B&?\\r$@&?<&#\\x00\\x00«$@&Q?\\\"$@&^?\\\"$@&^?\\\"\\n\\\"&\\x00\\\"-$B&?$D$B&\\\\??*\\\"\\\"&Y\\\"$D$B&?$@&?'%:/&\\x00\\\"$B&??-?$@&?>	3*\\\"\\\"%Y\\\"$D$B&?$@&?'%:0\\x00\\x00@/2;;=\\x00	E\\\"&\\x00\\\"=\\x00	E$@&?-\\\"$@&_?3 :1$@&.?:1\\x00\\x00!$c\\\"$5&?(\\\"\\\"$@&?3&\\x00:-\\x00\\x00\\x00)$G)\\x00$6&(??<2$G$B&??)$B&??<	$@&?:.\\x00\\x00\\x00\\x00\\x00\\x00\\x00!$A	Ó>:&#$A\\\"Z\\r	Ä>	e&#\\x00\\x00&\\x00\\x00:\\x00\\x00\\\"$\\\"\\x00&7$@&0?41$3	\\x00\\x00\\x00û$%$7	Ñ?2$7	Å?&:,$@&0?$@&!?:&\\x00\\\"	\\\"	Û\\\"	Ø\\\"\\n	ß 	×  \\\"$A	?\\\"$A	â?\\\"	$A	Õ?\\\"\\n	à\\\"	Þ\\\"1\\n$A$Q&X??1\\\"$B&?$Q&^?%&\\x007$@&0?$@&?:	1	$6&G?%2\\n1\\n$6&G?%$@&0?$@&G?:/\\r5\\\"&:,$@&0?$@&!?:\\r\\x00į$A>:\\\"$7>:\\\"&\\x00\\\"$A	Ö?\\\"1?\\r?&\\\"$A	J?\\\"$B&T??\\\"$6&?	=	<%\\\"\\n\\n1\\n&?(	]$@&a?-:1\\x00\\\"	3:1?\\\"	222?2	:$7\\\"Z-&\\x00?$=&]?;1$6&?	Ô%1	$7?	á?&:&\\x00\\\"$B&??-#$7$6&??$B&??%&:\\\"1\\\"&:ą$a$=&C?\\r#$a$=&C?$?&#??\\r\\\"F$6&?\\x00#	Ü=	<\\\"$6&??+$B&;?;1$B&1?$6&??$B&?%#3$6&?	Ú%~$6&?	=	<%\\\"1&?(	]$@&a?C#$6&?	Ù=	<%\\\"1&?(	]$@&V?C#$6&?	ã=	<%\\\"1&?(	]$@&?C##\\x00\\x00\\x00\\x00\\x00)\\x00\\\"	Ý\\x00#\\x00\\x00\\x00\\x00\\x00D\\\"\\\")\\x00\\\\\\\"	\\\"1$B&;??+7G$6&3?\\x00\\\"1:#\\x00/$X#\\x00\\x00/$7$6&?	î%#	æ\\\"	ñ\\\"$A>:2$7>:#\\x00\\x00Y:1$A	ë?I$A	{?#$A	{?$B&?\\\"$	$B&?	ó\\r$@&?1$	$B&?	ï\\r$@&?##\\x00\\x00$A	è>:\\\"$A	ò>:\\\"2#\\x00\\x00$A	ä>:##\\x00\\x00		é(	G\\\\#\\x00\\x00l\\\"	ì(	G\\\\\\\"#$A+$6&?1$A9S1$A9S	ê7#$7+$6&?1\\r$7	?+$B&;?7$7		íO\\r\\\"9Q2	ð\\x00##\\x00\\x00\\nƥ$\\\"/$7	¡?$971$7	¡?$B&??\\\"\\\"$$B&?$7$B&?\\r\\\"	¢jϘ$B&.?	å$7$B&??6$$B&?$7$B&??$A	¢?+$6&?7\\\"$2$B&?$7$B&??\\\"$$B&?$7$B&[?\\r\\\"	çjϘ$6&9?$B&.?$B&?$B&.?$$B&?$7$B&[?\\r\\\"$B&?	T	ĀjϘ$$B&?$7$B&[?\\r\\\"			jϘ	$B&5?$B&>?	$B&?,Ϙ$$B&?$$B&?$$B&?	$B&.??\\\"2		T?\\\"2IϘ	\\\"2		?	\\\"22$@&0?	÷:\\x00\\x00i&\\x00\\\"$C&X?=	X\\\"$\\x00$B&?$8&N?$B&4?\\r\\\"&\\x00\\\"$B&??-??$9<&f\\\"\\\"'	$X\\x00&$@&;?f\\\"#\\x00\\x00$A	J?\\\"	 ?\\\"	\\\"	v\\\"$B&T??$B&T??(	S:':($A$B&H??$B&?$B&??:)\\x00?:+3\\x00?:+3\\x00::*\\x00\\x00Ϛ$A	J?\\\"$B&T??\\\"	Ă?$9<À		$@&c?			$A	þ>:$@&&?:3$	$B&?$6&,?\\r$@&?		:3t$A	ý>:$@&?:3^$A	ô>:$@&?:3H$A	ÿ>:&:35$A	ö>:2$-$B&?	õ\\r$@&?$@&Z?:3	$@&?:$\\\"$@&2?C3	ú:$@&4?C $A$6&D??1$A	?2$A	?&\\\"$A	ø>:1	$A	û>:	ā$@&#?:$A$6&D??&\\\"	ă?Ż	ü&7$A	ù>:$@&/?:3°$	$B&?	ć\\r$@&?<$@&1?:3$	$B&?	Ċ\\r$@&?<$@&#?:3n$A	t?1\\r$A	t?+$6&?;1\\n	Č$A	t?\\x002$-$B&?	Ą\\r$@&?$@&0?	Ć:3'$A	Ď>:2	$A	đ>:$@&9?:3&:$A	W?1$A	W?	ē?$A	W?	ċ?3$A	?$9<1$A$6&P??	?$9<1$A	Ĉ?1$A	ď?$@&)?:3P$A	?1$A	Ē?3=$A$6&??	ą?1$A	ĉ?3$$A$6&??	č?1$A$6&??	Đ?3&:,	$7$6&??$B&)??\\x00$@-?$@&?:$A	Ģ>:$@&&?:3$A	Ğ>:$@&?:3y$A	ģ>:$@&=?:3c$	$B&?$6&,?\\r$@&?		:3B$A	W?1\\r$A	W?	Ĝ>:$@&X?:3 $A	?1\\r$A	?	ğ>:	$@&)?:$A	z?\\\"1	?	$@&?:$A	ĕ?$9<		<	Ĕ	\\x00\\x00ɭ$A	J?\\\"$B&T??\\\"$A	Ġ>:$@&0?$@&b?:3Ⱦ$A	ě>:$@&0?$@&?:3ȣ$A	Ę>:$@&0?$@&??:3Ȉ$A	ę>:$@&0?$@&S?:3ǭ:\\r$@&0?$@&?:3Ǘ$A	Ě>:$A	Ė?3$@&0?$@&@?:3Ʋ,$@&0?$@&!?:3Ɲ$A	?1$A	ė?$@&0?$@&?:3ż$A	ĝ?2$A	ġ?$@&0?	ī:3Ş	ħ(	<$B&1?%2		Ĩ?$1;$@&0?$@&N?:3Ĳ	Ĥ(	<$B&1?%$@&0?	į:3ē:$$@&0?$@&?:3ý:\\\"$@&0?	Ĭ:3é:#$@&0?	£:3Õ$A	Ĳ?1$A	Ħ?1$A	Ī?$@&0?$@&?:3­$A	İ>:$@&0?	ĳ:3	ı$A\\x00$@&0?	:3~:$@&0?$@&	?:3h:$@&0?	Į:3T:$@&0?	:3@:$@&0?$@&>?:3*:$@&0?$@&P?:3:$@&0?$@&?:\\x00\\x00\\x00/5:5:)\\x00:%\\x00\\x00$@&I?	\\x00\\x00$@&0?\\x00:$@&&?	\\n\\x00\\x00	Ɂ&\\\"&\\x00\\\"\\x00$B&??-Ȫ\\x00?\\\"$;&.?$B&5??7¬$B&	??$6&??2$B&	??$6&??$6&Q??3ǣ$B&	??$6&??$6&Q?$B&?71$=&%??	ĭ7$@&U?:3I$=&%??$R&?71$B&	??$6&[??1$:&R?(	<$B&1?$B&	??$6&[??%\\n$@&5?:3š$;&S?$B&5??7ő&\\x00\\\"$=&??$B&??-Ĺ$=&???\\\"$B&??7ę$6&??2$6&??$6&Q??3û$6&??$6&Q?\\\"$B&N?74$B&?$B&)?%\\\"1$5&?(	<$B&1?%\\n$@&5?:3«$B&!?7$7$6&??$B&?	ĩ%$=&D?71$?&?(	<$B&1?$6&[??%\\n$@&?:	T?1	T?$B&??$@&\\x00?-5$8&+?(	<$B&1?	T?%2$?&?(	<$B&1?	T?%	£:3$C&]?7	:\\\"Ō\\\"ȷ\\x00\\x00\\n¯$A	ĥ?\\\"$A	Ľ?\\\"$A	?\\\"$A	ķ?\\\"1	+$B&;?7\\\"1	+$B&;?7\\\"11$@&0?$@&U?:I =\\\"\\\"\\\"		$;&.?	$;&S?	$8& ?$:&B?$7$6&??2$7$B&??	\\x00\\x00C$A	Ł?\\\"1		Ļ>:\\\"1$A$B&9??$B&?$B&?	ļ%&\\\"2#\\x00\\x00$a$O&(??\\\"$A	Ĺ?$91	$A	ŀ?$91	$A	ĸ?$91$A$6&Z??1$A$6&Z??$B&?$B&?	Ĵ%&\\\"/...$A$B&9??1!$#$B&8?$A$B&9??%$B&?	ĵ%$@&?\\\"2#\\x00\\x00:/333:-	Ń(	G\\\\\\\"	Ŀ(	G\\\\\\\"	ĺ(	G\\\\\\\"11##\\x00\\x00\\x00đ)\\x00\\\")\\\"/ÿĂĂ$A	J?\\\"$A	­?1	§?1	ł(	<$B&1?	§?%$A	­$A	ľ?&S3»	$7$6&??$B&)??\\x00/$A$6&D??$B&9?$B&W?%\\\"$B&I?$6&]?3x$A	z?1\\n$A	z?	?A/7::$A$B&^??$B&??5\\\"3\\\"$A$B&^??&jӂ$A$B&^??$=&V?	Ķ5\\\"5\\\"3#$A$6&D??1$A	?2$A	?5\\\"35\\\"5\\\"\\x00J\\x00\\x00\\x00J\\x00\\x00\\x00\\x00.$$@&:?4$$A$8&E?=\\x00\\\"$B&$?)\\x00$B&0?	Ŏ\\x00$@&0?$@&V?:$@&?	\\n\\x00\\x00\\x00\\x00\\x00&\\x008M&81&\\x008'8@878,R<$=&?(	L:$=&A?(	L:$;&A?(	L:$;&X?(	L:$;&?(	L:\\x00\\x00\\r&\\x00	P\\x00\\x00&\\x00\\\"\\x00$B&??\\\"\\x00	M\\r&\\\"\\x00	Z$@&?\\\"\\x00	Z$@&#?\\\"\\x00	Z$@&?\\\"\\x00	Z$@&?\\\"\\x00	Z\\x00\\x00\\x00$$@&?~#\\n:\\n	 	Ō 	Ő 	ŋ 	ņ 	ŏ 	ŉ 	ő 	ń 	Œ 	Ŋ 	ň 	œ \\\"&\\x00\\\"$B&??-\\\"/?F	Y$B&??\\\"/#\\x00\\x00.$>&?\\x00\\x00(	[:$@&,?$;&X?!	H##\\x00\\x00\\x00Ɋ$A$5&'?$§$7$B&:?$B&N?%\\\"$6&?	ō$7$B&??$B&?$7$6&?$R&8?%\\\"$;&$??K\\n\\\"&\\\"$;&$??$Q&=??-$B&?$;&$?%\\\",$$B&?$B&4?\\r,һ:$7$B&??$6&?3Ɠ<$7$B&:?$B&N?%\\\"$@&?(	F\\\"$B&6?,Ϙ$=&?$6&?$>&G?6G0$C&?006E0$B&K?06G0$6&=?0$7$B&??$B&?&\\x00\\\"\\\"$A$6&U?)\\x00$@&?\\r\\\"	3ć/ĂĂĂ=\\x00	Ņ\\\"\\n	Ň\\\"	ş0$B&\\n?$B&?%\\\"$7$B&:?$B&N?%\\\"$B&)??$6&@?$6&?$6&?	Ş$7$B&??$B&?$Q&??&\\x00?\\\"\\r\\r$=&??\\\"\\r$=&\\x00??\\\"&\\x00\\\"$B&??-A\\r$B&)??$:&O??\\r$=&??2\\r$=&\\x00??\\n$B&??\\\"^N$$B&?\\n$B&?\\r,Ӄ:$7$B&??$6&?\\x00/>>>$7$6&?6G%\\\"1$;&??+$B&;?;$;&?$?&[?%$;&?>:::2	0$\\\"$B&?$A	$7$6&?$=&?%$7$B&??$6&?\\x00\\x00å/ààà$7$B&:?$;&8?%\\\"1$6&N??Á$;&?$@&*?$;&?	$6&N?,Ӈ%\\\"$6&?\\\"$>&?,G$O&)?$8&B?$;&?$C&K?$R&?&\\x00&\\x00$@&?$@&b?S$;&?$5&L?$=&Y?$@&?$@&?k$;&?$Q&3?$=&Y?$@&?$@&=?k$=&$?(	[#\\x00\\x00\\x00̎/233$7$B&:?$;&8?%\\\"$6&N?$8&8?%2$6&N?$Q&?%\\\"/ʽʽʽ\\n\\\"$:&E?\\\"$8&?\\\"	$C&&?\\\"\\n$Q&U?$;&]??\\n$A$5&?\\n$@Ð? $@Ó? &\\x00 $@Ø? $@×? &\\x00 &\\x00 $@Õ? &\\x00 =\\\"$?&L?$;&]??$?&V??k\\n$=&S?$@&?\\n$=&?$@&?$R&?\\\"$=&9?$=&0??%\\\"\\r$=&E?\\r$;&!?\\r$=&9?$=&2??%\\\"$=&E?	$;&!?$=&4?\\r$=&4?$C&J?$>&:?$=&?$O&\\\\?$R&)?\\r$=&?$8&9?$5&?\\r$?&B?$5&\\n??$5&D?$=&??\\n$=&S??$O&??&&\\x00&\\x00]$Q&(?$=&??&&k$O&:?$R&??&\\x00\\n$=&??k$;&8??O$B&?$;&8??$=&$?5\\\"\\\"$=&??µ\\n$=&0?? $=&2?? \\\"\\n$?&S?? $C&?? $:&?? $Q&?? $>&#?? $>&?? \\\"&\\x00\\\"$B&??-S&\\x00\\\"$B&??-<$=&???\\r\\\"$B&?$:&??$8&J??$:&@??k\\\"I\\\"`$$B&?$B&/?\\r(	[#_\\x00\\\"ZY$/$B&?%;I\\x00?+$B&?7;$Q&?\\x00?%\\\"$9\\\"+$B&&?;1$@Î?C$B&?\\x00\\x00M$Q&?\\\"&\\x00\\\"$B&??-.?\\\"$8&?%\\\"$B&?:\\\";\\x00\\x00\\x00ì$A$:&\\\\??$:&?=\\x00$:&?\\\"\\n$;&K??$9<\\n$;&K??3,Ƨ $=&??$9<\\n$=&??3,Ƨ $=&??$9<\\n$=&??3,Ƨ $;&M??$9<\\n$;&M??3,Ƨ $;&T??$9<\\n$;&T??3,Ƨ $=&??$9<\\n$=&??3,Ƨ $;&-??$9<\\n$;&-??3,Ƨ $;&B??$9<\\n$;&B??3,Ƨ #\\x00\\x00\\x00в\\n\\\"$A	J?\\\"$B&?	Š?$B&?	Ţ?$B&?	ř?$B&?	 ?$B&?	š?$B&?	ś?$B&?	Ŕ?)\\x00\\\\\\\"$B&?$B&?:)\\\\\\\"$B&?/\\n:\\n\\\"	,Ƨ\\\"	$B&?	\\n\\\"$C&2?\\\"$7$B&:?$=&U?%\\\"\\r\\r1\\r$6&??1\\r$6&??(	\\\\?$B&\\n?$6&M?%\\\"&\\x00\\\"$B&??-$B&?\\r$6&??%\\\")$B&?\\n\\\"$5&!?\\\"$7$B&:?$;&?%\\\"1$6&??1$6&??(	\\\\?$B&\\n?$6&M?%\\\"&\\x00\\\"$B&??-$B&?$6&??%\\\")$B&?$A$6& ??1$A$6& ??(	\\\\œ\\n\\\"$8&'?$B&\\n?$6&M?%\\\"&\\x00\\\"$B&??-<$B&?$A$6& ?$O&3?,Ӏ?<\\n,ӄ?03,Ƨ0,Ӊ0%$;&2??\\\"I$B&?\\n\\\"$5&?$B&\\n?$6&M?%\\\"&\\x00\\\"$B&??-<$B&?$A$6& ?$8&F?,Ӏ?<\\n,ӄ?03,Ƨ0,Ӊ0%$;&2??\\\"I$B&?\\n\\\"$5&V?$B&\\n?$6&M?%\\\"&\\x00\\\"$B&??-<$B&?$A$6& ?$R&4?,Ӏ?<\\n,ӄ?03,Ƨ0,Ӊ0%$;&2??\\\"I$B&?$B&?(	h)\\\\\\\"$B&?$B&?(	h$B&?(	h)\\\\\\\"$B&?$B&?	\\x00	ª?2	ŕ?2$A	ª?\\\"$B&?$B&?	ŗ\\x00	ţ\\\"$\\x00$B&?$B&4?\\r\\\"&\\x00\\\"$B&??-$B&??(\\\"&3&\\x00\\\"+$$B&?$B&/?\\r(	[#$/\\x00>:2\\x00\\x002\\x00$6&G?%##\\x00\\x00\\\\$\\x00$B&?\\x00$6&?\\r\\\"$A\\\"&\\x00\\\"$B&??&-?>:\\\"#\\\"^*$B&??&?>:#\\x00\\x00\\r/\\x00?#O#\\x00\\x00w\\n\\\"$>&^??\\\"`&\\x00\\\"$B&??-N?\\\"$$B&?\\n$B&?? $;&?? $O&[?? $Q&?? $B&4?\\r\\\"$B&?\\\"[#\\x00\\x00g\\n\\\"	?\\\"R&\\x00\\\"$B&??-@?\\\"$B&?$$B&?\\n$B&5?? $5&?? $;&?? $B&4?\\r\\\"M#\\x00\\x00l&\\x00\\\"	?+$6&?<	?\\\"3	v?+$6&?<\\n	v?\\\"/$7$?&?$C&?\\\"\\\"$R&?$A\\x00\\\"\\n   #\\x00\\x00{\\n\\\"/LL$8&?	c$B&?$;&@??$B&?$8&D??$B&?$;&??$B&?$?&)?\\x00/\\r$A	{$>&!?F$B&?$;&@??#\\x00\\x00Ǧ,Ƨ#\\n\\\"$A	Ŝ?\\\"$B&?1	_?$A	Ś?\\\"$B&?1	_?$A	Ř?\\\"$B&?1	_?$A	ŝ?\\\"$B&?1	_?$A	Ŗ?\\\"$B&?1	_?$A	ũ?\\\"$B&?1	_?$B&?$A	Ů?$A	J?\\\"	$B&?	$B&T??$B&?		«?1\\n		«?	Ū?$B&?		°?1\\r		°?$B&?$B&?		²?1\\r		²?$B&?$B&?		Ŧ?$A	Ũ?\\\"\\n$B&?\\n	ū?$B&?\\n	ŭ?$B&?\\n	ť?$B&?\\n	Ŭ?$B&?\\n	ŧ?$B&?\\n$;&??$B&?\\n$;&??$B&?\\n	Ť?$B&<?$B&4?%0(	[:#\\x00\\x00«5:::$@&,?$=&A?!	H:	:$@&,?$;&A?!	H22	$;&I?(	LN::::$@&,?$=&?!	H$@&,?$;&?!	H11$@&,?$;&I?&!	H\\x00\\x00\\x00\\x00\",āĀĂă˲̛Ąą\x00üýþÿȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭ:Ê$Ë&Ì°Í³ĤµÎ¹Ï»ÐÀÑșÛȜÜȤÝȧäǿåēæĖèÙéëêíëðìǝƘɴƙˑƛIƜOƮŪƯoư|Ʊ̃Ʋ̌Ĭǔ¯ü¹Òr2¸î¨VaLzæ^çþLLc:Ls^ĦÀL²cĄLĞēhL®5LĖäL.k}LģĊLĤ1\"ÆL»eÑLÃQPLp·LÇī3L´CÊÆL»|)Æ¾^<LLc«ÆÅ-Lč°úL4Ú£LNy^à'ULLcÏéÆL»^ĈØÀL÷cÆL»ą¥ÍÆL»G^ĪÓLLc­L=ĉÖÆćôLýÆ§^¬±ÀLcg@LÂ¿ďLËf7L	ĀLöÄ\\LjĔ$ÆÌ¤ÆħLĨÛLuė³ÆL»ã6L&LólLíªLJ^[¦LLcěWLi ĝLB/åÆĠLëqLøb^9`ELLc\nLYÉ^ĢĜÀLĥcAÈLġûHLOÔ^ÝµÀLvc+LwMĎL!IÆRdÆá\x00LĆ8ì\rõă¶Ăòn]o¡Æċ0ðêÎßï×©DtÜTxğSĩÙ_;¢èK*ĕº½āÜXâđm%?#Á>ùF~(Ð Ě,ZĒĘÿÕęÞĐ{Čñð¼+Ņ3Ć\r\x00	\x00\n\x00\x00\x00\rǆ\n.Ȫӂ਽\r¢\rã\r>	˲\r		ր	ࠥ	#\x00	ؘ		Ջ	త	ଊ	#\x00	ߛ		ਟ\n 	EȩҬ\nć\rұ๫ǨĈ\r\x00	\x00\n˹\nఫ\nІ\nേ	\n\n\np\n̞	EǨĉ\r\x00	\x00\n˹\n඘\nІ\n௞	\n\n\np\n̞\nʒ\nଷ\nĔ\nӬ	EǨĊ\r\x00	\x00\nұ	\n\nï\nค	ಋ\nĿ\nتȩҬ	ċ'?Ć຋ȫௐɈćȵ֩ɉćȵ͢ɈɉĈȴ˃	ɈĈȻǅɉĈȹडɈɉ\nĊȸѻĈȸƀɏĉȳӇɡćȹ̋ɏɡ^3\rćȸΩĉȺࠎćȷՌĆȳǡɉĉȻɠĈȺৰɉɠɡȷğȸCɋćȸ̫ɡɋɈĉȷJɏĉȴͷɈɏɋȷ࠽ȹǑɈĉȶࣶɋɈĈȸɉćȹ৵ĈȹԂɋĆȴðɡĊȸ୶ɋɡ^y3ČɠĈȳǖɈȳࠫȸϗɠɈčĈȴǄɉćȳëɋĊȺԈɉɋĎ¥ĆȹԇĈȺगɪȷɎȷ͐ɉȶǓȹ౴ɪɉɪĈȸβɏȸΥȴࠃɪɏĆȹŅĊȹǡĆȺƀ ĆȵԦ!ĈȺ৹m3\"ĈȺƬ#¥ćȴ˅$ćȸ௼%ĈȶƠ&Ċȶƒ'Ĉȴ΋ď¥ĈȷȎ(ɪĉȻ¯ɉćȷͷɪɉ)ɡĊȳలɞĉȸ๻ɡɞ*ɞćȸ೴ɏĊȵ୿ɞɏ+ĉȳƒ,Ĉȵफ़3-ɠĈȲĸɏȳਗ਼ȶϷɠɏ.ĆȴĊ/Ċȷʎ0ɏćȵȔɉĊȳڡɏɉĐ¥ćȴՈđ¥ĉȷӴ1ɉĊȶºɏĉȴ̋ɉɏ2Ćȴ๯3Ĉȶೱ4ćȴƨĒɈȴηȴCɡȹͤȳڧɈɡ5ɏȷӎȯĎɉȲğȲ۲ɏɉ^36Ĉȵƒ7ɈĈȷɡȱ൭ȳࡶɈɡēĈȺȎ8Ċȸƺ9ɪĉȵȜɋȶࠋȶশɪɋĔɈȳջȳЂɪĊȳవɈɪ:ɈȴʺȶɭɡȳʯȻहɈɡ;Ċȴൖ<ɞȷ૨ȶŚɡĉȹ͝ɞɡ=ćȶэ>ĉȳ˷?ĉȳఉ3@ĆȹӹAɡĈȴਮɏćȸ۟ɡɏBɈćȹʖɡĊȶ٢ɈɡCćȹ˷DćȳδEĈȵҌFɪĈȻɛɉĆȷમɪɉGɈĈȵ˵ɪĉȶ຾ɈɪHćȻўIɉȲາȻǃɠȷऊȵౌɉɠJɪĉȵ͎ɋȵ෋ȱಓɪɋKćȺে3LćȷോMĆȷȣNɡȹଚȻʈɈĆȳ֌ɡɈOĊȵўPɠȷΪȻȏɪĉȹรɠɪQćȴȎRɠćȳβɡĈȸՔɠɡSɠĉȴ˵ɉĈȳۯɠɉTɈĈȹȟɞćȳݮɈɞUćȷƨVĆȸ˅WɋȺɎȵŔɉĈȺ̈́ɋɉ^m3XɈĆȸǖɋȷࠢȻਭɈɋĕ¥ĉȹ৳YĈȵਾZɈćȵǣɉĈȺ઄Ɉɉ[Ćȶ࢘\\ĈȻຖ]ĉȶǄĖĈȵΣ^ĈȴƬ_ɈĈȴڙɡȴͤȷʐɈɡ`ĉȹ˃aĊȹ఍3bĉȶ൒cćȺҵdɡȷઆȶ͖ɈȺıȸඔɡɈeɉćȸĽɋĉȻЌɉɋfɋćȳŝɡćȹ̈́ɋɡgćȶʎhĈȺనiĈȸ̓jĊȷǄkĆȶЗėɈćȹǣɡćȵ͡ɈɡĘɡĆȸӇɉćȷহɡɉgy3lɠĈȲĸɋȵ̊ȺϞɠɋmɪȹڟȻɭɋĉȷ࠯ɪɋnĆȵЗoĉȺ̐p¥ĈȸȣqĉȷԂrɏȴΪȷɰɪćȸ͡ɏɪsĆȷಶtɡȳࠦȶϊɋĆȴ͢ɡɋućȶъvćȵͅwĉȻ਱m3x¥ĆȴƒyćȻƺz¥Ċȸƒ{ɞȷÔȵĹɉĉȴԈɞɉ|Ĉȴȣ}ĈȺӴ~ĉȸǄęĆȵɉɞĉȶǅɠȶğȺ๤ɞɠɠćȶమɪĆȸওɠɪćȷթćȶથa3ĆȸĊɏĆȹࣚɈĆȸϢɏɈĆȶǡćȵ່Ćȷ΋Ĉȴ෬ɠćȵ֒ɋĈȷېɠɋĚĈȹƀćȺٽĉȸѷĈȴఌćȺࡏ3ɞĈȸɊɡćȳѹɞɡɈȷΎȺđɋȯՖȳϗɈɋěĊȺ̓ɋȵńȶπɏćȹгɋɏĊȸ˃Ĉȷ࣬ɉȹΥȴſɞĊȷٸɉɞɏȷʌȹదɈȰηȵࡵɏɈĜɈĊȻʅɪĆȺഇɈɪćȶ̐ĝĉȵ્Ĉȸ௟3ćȷҵĊȺƠɡȱપȴЂɪĈȲǽɡɪćȷƠɈĈȶ೎ɡĉȶгɈɡɋȯʺȵȓɪĈȸਡɋɪĞɠćȻָɉćȵ൅ɠɉğɠĉȺ͎ɏćȵѹɠɏćȴНćȷͅĈȷƀ ćȺ໌3¡ĉȶ࠹¢Ćȳƨ£ĈȻэ¤ɈćȺŝɋĊȹЌɈɋ¥ɏćȺкɋȶʯȳϷɏɋ¦ćȵƠ§¥ĉȸǡ¨ɈĆȴȗɋĊȸࢡɈɋ©ɠĈȶȔɉĈȳ฻ɠɉªĆȶƨ«ɉȲÐȴ`ɡćȺޏɉɡ¬ćȴઞ3­ɏĈȴϿɪćȺ̫ɏɪ®ĉȳʎ¯ĊȴҌ°ćȳъ±ɠȹӎȺjɈĈȵԯɠɈ²ĈȵԇĠɞȳɎȺ՟ɞɞ³ĉȺ૊ġ¥ĆȺݺ´ɡĊȴÌɈĈȳಬɡɈµĉȷʘ¶ɪȴথȳƔɞĈȳ৓ɪɞ^3·ĉȹࣞ¸Ĉȴʘ¹ɡĈȺŪɏĉȺ͝ɡɏºĈȷН»ɞćȴԁɈĉȷǽɞɈ¼ɏćȴȜɪȶఄȳढ़ɏɪ½ɉĉȵϔɡĈȴுɉɡ¾ĉȻƀ¿ćȹƺÀɋĈȺԐɪȴ٧ȶಠɋɪÁĈȵ˷Âĉȶඁ¡3ÃɞȳմȷŚɋĈȳܨɞɋÄćȸࡺÅɠĉȴ੏ɪȳൔȹئɠɪÆćȶ߫Ģ¥Ĉȵʘģɋȸ̊ȱɁɞȸɕȳϞɋɞÇĆȺ˅ÈĉȻӹÉɪȷڑȹIɠĉȵܐɪɠ9ɸȯíǞȬೋĥɵȯലĦ%\x00ɵȯӡŞȯŦȯຑȯǠȰοȰԭȰƄɄģ^ɵ3ħ%\x00\x00	ɵȯӡŞȯŦȯϪ	Ȱ݅	ɲ¡Ȱǹ	ȯิɲ¡ȯŨ	ȯक़ȯǠȰοȰख़ȯҏ	ȰƄɄģĨ%\x00ɣȯǫȯʅȯŬȰԀȰŤÒ\r\x00	\x00\nȯYɄȯɣȯء		ȯ,	X\n	Wř\n\x00bɹȯ\n\x00ȯђĩ%\x00\x00	\x00\n		Ȭą	X	S\n\nȬì\n*ÿ৻Ȭ۞׮ࣹ	ĻĪ\r\x00	\x00\n\x00ŇȯĚŗQɄH¦PɄH¦ĩf	୺Ȭɔ\nȯˑ\nŭ	/	RȬׄś	ଋȬغ	Ȭ۝ī\x00\x00	\x00\nȯฃȯĕ\x00	\x00\nଢ\x00ȱอ\x00	³Ĭ\x00\x00	Ȱ஄Ȱ6\x00	+Ȼ৛\x00	ĭ\x00\r	\x00\n	ȯˑ\n\n	\nƅ\n¡୫Į\x00\r	S	>		_į\x00\r		।	$ȬБ	ળ	$Ȭ௧ȬԤ	$ȬĜȬÁ଀	$ȬਨȬш	$ȬӽȬöϻȬÁȬ࡟	$ȬूȬҢ	$ȬĲȬűϻȬöȬ࢚ȬÁȬ๑Ó\r\x00	\x00\n\x00ȯT	.ȪŞ\n\n\n*ɯȯ\x00\n	Ȭ૗AȬݒ	\nɆɄȯ\x00\n	\nɄȯ\x00\nDɄ\\ȯ	ʴİ\x00\x00	\r\n\x00\n	ȯ,*\n٨ȯ̀ɤȯĎȱ͘Ȳ˻ȵ՚Ʉ\\ȯ\n\x00ȯŴȯж\x00\x00	gɹ3ı\x00\x00	˙	ȯছ࣌d	චd	0	಄d	0	C	ਂİ\x00\x00	Ĳ\r\x00	\x00\n\x00\x00Ʉȯ\x00ȱంȯ७S	¢	ȯ,	X\n	W\nȯǦȬÆɹȯ\nwȬɵȲƋ\x00Ȭ৾ȬੱFȬس	ɟȲȞäɹȯ\n\x00Ȭࢠ	ȱڍ	иɄ\\ȯʴÔ\rक\x00ĲĨ4?Ʉҕȯĳ\r\x00	\x00\n\x00\x00\x00\r฽	ŝ\x00ȯǖ	ȯȬ´	഼\n	ȯāȯǣ\nȯT\nழȰҠ\n৉\n˟஫ŭ\nࡎŸ\n˟ŎҾ\nȯ[ി\nȯ[ൊȬύ\n¡ȰिŸ\n˟Ŏ\nȯ[݁v\rɄ\\ȯ\n\x00ȯǣȯࡧ\r#ȯŹŒ\rĴ9ɚȯÀȲީĵ\r\x00	\x00\n\x00\x00ȯŌȬY	\nȯT.ȪĨ	>\n௜	Ȭű	Ȭö	Ȭ߀	෈Ķ\r\x00	\x00\n\x00\x00\x00\rȯT	\nȯ෠ȬY\r.ȪĨ	>	ß\r\nRȬ§ȬI\r\nRȬȬI\r\nRȬȬI\r\n $Ȭͮ\rķԘRȬ§ȬЋRȬȬЋRȬȬI$Ȭٕĸ\r2ĵD๣Ĺ%\x00ɣȸ໋ɣȴܷɄ=ȯO!Ȼࠪ૜ĺ\x00ळȯ୭Ʉ=ȯȯΤƫ	ϒÕ%ɵȰ஋ȰࢄɵȰ˾Ơ̇̄ࣘ®ʀ^ɡ3Ļ\r\x00	Ž4ȯ·		ȯ,	*ȯ\nɯȯ\x00	ȅļ\r\x00	\x00\nŝ\x00ȯ෪	Ʉ˛ȯ\x00Ȱࣷ	!ȬӞ\nɄ˛ȯ\x00ȯࡤ\nȬǰ\n	]	ȯՎɄ=ȯɹȯ\x00	੃Ľ\rȹļDĭ\x00Ʉٿ	ϒľɎĿ~Ŀ%\x00\x00	ɣȯǫȰܻţȯȾ	Vȯ6ȯ੢		׼Ʉ¬ɄÂȬভŚ	\x00Ȱ௎Ś	\x00ȯװŉ	\x00ň֋࠷ň~ŀ'!ɘԽȯ߼ȯִٖŘ͔ƍzɎĿҳŉ\x00Ɏ൶Ł%űȬԮƷɽɽȰฺɽȰȘԿɭȯńȯֻł\x00\x00	\r\n\x00\x00\x00\r\x00\x00\x00\x00\x00ȯϩ\nȲݥ\nȱʪŁ0\rςŏů\nɗɗ	ŜW଍ன\rÖ\rȯ,X\rWȯේȬ঩෨،	Ɩ঍\nʀ.ɬݔȯōয̠ࡃŃ\x00\x00	\r\n\x00\x00\x00\r\x00\nł\x00\x00	O\nৠűȬ׌Ʉȯ\x00ȯଅȯȬࠐدȱ೩\r.ɬɄóȯ෍\rȯōbɄѮ	܌Ī҉ȯ߷ൡɄѮ	Ԣǘń҆ȬࡱFȬДȬܑFȬݶŅİȬФFȬδņ\r\x00	\x00\nɯȯܬń࢜		ȯ,	X\nɯȯ\x00	Oń\nԣŅ\nɠȬఠ\nɠȬॱ\nɠȬ࡯\n੝Ȭذ\n?Ʉ=ȯɄóȯw	ٺ֋3Ň\x00\x00	\r\n5!Ȱφ!ȯلɗ̮\nņ	O\n\n!Ȱφ\n!ȯರň%\x00\x00	ĥɲ	ɜĠ	7Ȱǹ	ȯɢȯŨ	ȯড়DȯŦEħ-ȯǠɺȰ̔6\x00PɌ3	\x00:ȰӔNȰ;)ȲѰ8࡮ŉ\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x00	l	D\x00	E	-	6	P	3	:	N	)ɄĹ	8ĳ	Ʉศř\x00ɍz	!Ȭފ\nĥ\nɜĠŸ\nɲ¡Ȱǹȯɢ\nɲ¡ȯŨȯซɄԖEKɣȯ¿ȯŋɖ\x00ɖɖWɖɳɄ૯Śɖȷਁ	!Ȭʐ	^\rɲW\rȯோ	!Ȭي	ࣿŇ\r\x00ɄӢ	D	!Ȭʐ	^ƍ	տŚ\x006zɄóȯ\x006ȯѢɄȯˎɕɄȯఝɕ7¦ɖ6+ɖ-ř\x00ȯ૾ɖ-:ř\x00ȯיɖ-:Ʉģɖ-Ǝ:ä		6ɲ	PɌɜ¡Ʉސɜ୲ɲ¡Ȱǹ	3ȯɢɲ¡ȯŨ	3ȯ෡	3ɜɄȯɳݩɕ	:ɄŢȯɕ\x00ɳ	:ɳ	NȰ;	)ȲѰ	-ɄŢȯ	6\x00ɺ\x00	P\x00ɗ\x00	3		EɄŢȯ	-\x00	:\x00	N\x00	)	ɄŢȯ\nȰЄɗ\x00	ɄŢȯ	P\x00ɗ\x00	3	Ń	6\x00	P\x00	3	8!\x00	ĳ	:	Ľ	:z	!Ȭಘ	!Ȭڲ	!4Ȭǥ	!඀	!Ȭ؉	!Ȭ೓ȯॢȯຝȯක	)ȯఖ	Ŋ'ɽɽȰԱɽȰЩµʮ\r\x00ʰɬȸôȯкʰܮȰńɢȯ\x00\x00	äȰ߈	\r\x00	ʰ	ɯȯ߅ՅɄóȯȷЃ	ȯऄȬΒȬยʯ\r\x00	\x00\n\x00ৗഓʮނɊzɟ+ȱଓɟࣴ?ȱ໔ɚȯ	\n͸Ȳ๪ȯ,ഽ\nʯǶȯǸɄ\\ȯ\n\x00ȯŴȯപ	>ɷȯȰ̓ȯ\x00	z\nȯ\nʮ	äȯҏʯ	࣭ȯğɄ\\ȯ\n\x00ȯŴȯ޿ʯÖ஖ɼƸȯĤɼˬŋ9ɸȰËɓȒŌ\r\x00	.Ȫ		ţ	>	 ŋȬയ×ʮ9xʮȬହʮ$Ȭ೶Ȭഞʮō\x00\r	\x00\n\x00לK	ȯͿ	֪	÷ճ	\x00\n		\nxɸȰËɓȒȬןŎ9őȰਅØ%\x00SFȬé*ʆȬ׃ʇȯ,*ɯȯʇگʁkȬuʂ&ȬYʃƻ$ȬĲȬYʄ&Ȭuʅƻ$ȬȫȬØʆŏ\x00\r	\x00\n\x00\x00\x00\r\x00ŇȯĚŗQʇ\x00\nȯT	.ȪɸȰ௥LȬభȬஊȯȬ๢\n>\r\nß	 \r&ȬƧ\nß	 ȵ\r$ȬȫȬ΍&ȬϏ\r\nß	 ȵ$ȬĲȬ೭\r&Ȭธ	 \r$ȬѲ\nȯீ\r\n	 \r&ȬƧ(\n	 ȵ\r$ȬȫȬ΍&ȬϏ!ɘ	 ś$ȬĲȬٲɄ\\ȯ	ݘ͹3Ő\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00»ޔഉȯ·ȯT	.ȪɸȰËLȬಝȬӁMȬ௒ŭ\nɯȯ\x00°ɯȯ\x00°ɯȯ\x00°\rɯȯ\x00°	 ʁ\nļʂ	 ʃļʄ	 ʅļʆ\rq7\nɯȯ\x00°ɯȯ\x00°	 ʁ\nļʂ7ɯȯ\x00		 ʃļʄந	ő\rŐDŔŒ\r\x00	\x00\n\x00\x00\x00\r	ȯT\n.Ȫ	ӂɯȯ८Ȭ౧\r¢\r	ã\r>ɯȯ\x00\r	GȬࣽȬ࡭#\x00GȬƏ Ȭ܁GȬϲȬ೜#\x00GȬ՞ ȬੲGȬƤȬଟ#\x00GȬચ Ȭඝ\n Eȩȯ˩\nœ\r\x00	\x00\n\x00\x002ɯȯȯୣ		ȯԊ\n	\nȬࠧ\n\nȬࠄ\nȬೠÿ\n$ȬĜȬȡ	ɚȬǍ	Ŏ\nȬȐÿ\n$ȬĲȬӍ	ɚȬĜȬȡ	ȬΜȬǍ	#Ȭࢗ\nȬयÿ\n$ȬࡍȬ෶	ɚȬĜȬӍ	ȬΜȬĜȬȡ	ȬഩȬǍ	#Ȭພ\nȬா\x00	#Ȭݚ\nȬՙ\x00	#Ȭࡾ\x00	üAȬೳ Ȭ੨ȯm&ȬŴȬళŃȬਲȬތȯ\nDŔ9ŕœ³ŕ\x00\x00	\r\n\x00\x00͹	ɘ	ȯՒ\n.ȪɶȯŌȬ঳	MȬฟţ>\n ȩȯ˩ȯ}\x00#Ȭ೬	\n ȩȯ˩ȯ}\x00	ʵɄ\\ȯ\nʴŖ9ɮɆ³ŗ\r\x00	\x00\n	Ŗ	\nȯT.Ȫ\n	\n Ȭϑ	\n>	ɯȯ\x00	°	ɯȯ\x00	°	ɯȯ\x00	°	ɯȯ\x00	Ӻ\n#Ȭϑ	\n>	ɯȯ\x00	࣮Ř9ɾɾȯ+ɢȯ\x00ɬȵ˻ȯߨř\x009ɄóȯwȯɌŚ\x00\r	»;೗	ɄóȯwȯെɄ=ȯ	ÀɄ=ȯś\x00ɑ;̾ɹȯ\x00ȯȯɌ^࠷3Ŝ\x00ɑ;̾Ʉ=ȯÀɄ=ȯŝ\x00\r		Ʉiȯ\x00O	ȬЉڋɹȯw		ɹȯ\x00	ۻŞ\x00\r		Ʉiȯ\x00O	ȬЉಸɹȯw		ɹȯ\x00	૸Ù%ʮ\x00ʯ\x00ʰʯʰlʱʯɓKࡡʰ	ʮʰ	Ʉ̖	\x00Ʉࠅ\nx%ʴ\x00\x00	\x00\n\x00ʴ¢Ȭé*ʴȯʳÕxÅʴȯʳȬØxȬ߭ʴȯʳȬďx५\rSʴȯ,ƅFʴľʴȯ[wʶʴȯ\nහʴȯ߄	ʴȯĘȬ\n	0	Cʴʴȯ}Ȭ©\n\x00u\n\x00^ۀʴּʱ\x00\x00	xസʱuɓେѨ		ʱ^ɓɅ׶Ѩ		x\rSƷľGȬ˜ľјľMȬσʲ\x00\r	\x00\n\x00\x00\x00\r\x00	2\nȯT±\r\r\n\rX\rĈ/kண\x00#ّGȬ඾	ȯ\nјMȬȤرȬݝMȬȤ Ȭ೵Ȉ	ȯm૒Ȭව๋ʮ&ʵ	ʳ\x00\r	\x00\n\x00\x00\x00\r\x00	2\n\x00ȯT\r±X\rলȬ౯\rເ$\r\n\n^\n\nu\x00\rࢃ\nxˌ	ȯ\n\nx	\nಙ		9ʲ\x00ʰ\n9ʳʯ\x00ş\x00\x00	\r\n\x00\x00\x00\r\x00\n0C\rȬΝȬǔ*\n/\nѽkȬǁ&ȬưȬǲ	ś$ȬǇȬy/\rǟȬy/ѽ\nkȬǁ\n&ȬưȬǲ\n	Ӓ&ȬҤȬ̳ȬǇȬɯȯ\n\n\x00Š\x00С˚0͜ଭš\x00\r	\x00\n\x00\x00\x00\r\x00\x00ĵ		ɸȰËȯŌȬ22\rȬ೔ȯǻȬĵŌȬȤȯ൳\n\n	\n*ȯ\nĵȯ}\nLȬ|\nLȬǸȬ࡝ȯ}	LȬࢯ\n\n\r\n*ȯ\n\rȯ\nĵே\n\nȯ,\n*şŠ\n	\x00	ȯ}ȯȬڸĶŢ\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	.ȪȯȬ\nĵ	ĵ	0CȯωȬΝȬtʊpȬࡦ\r\rȬՓ\r>/ϜkȬǁ&ȬưȬǲӒ&ȬҤȬ̳ȬǇȬy/MǟȬy/ϜkȬǁ&ȬưȬǲś$ȬǇȬɯ\x00\x00	\n&Ȭ§ȬI	\n&ȬȬI	\n&ȬȬI	\nǟȬI	\n&Ȭ§ȬI	\n&ȬȬI	\n&ȬȬI	\nǟȬIßପ	\nƍ	ȯ[\nM\x00D	Ú%ʮ\x00ʯʮԗʯԗʈxСʮ\x00ʯʼţ\x00\x00	\r\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\n\x00ȯǻȬ൞\nɄǕQĵ\n	|ȯT­ȯƽȬబȬऌ*ƍŃ൦ȬƖŃȬ৯RȬ̎ȬƐ&ȬñȬǈȬ̂&ȬēȬǈȬƮ$ȬࢽŃŸkȬƮRȬƐkȬ˶̃&ȬϦȬ฼MѸS\r\rüז\r$ȬŵMȬାFȬι\rȬǥ\r\r	RȬࠚ	Ȫ&ȬñȬͻ	ѥ&ȬēȬͻ	Њ$Ȭࡷ\x00_Ť\x00\x00	\r\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\n|	|2Ȭą*ś̃&ȬϦȬୋS\rৎ\n\rq\rඏߋऻ୥kȬڿkȬಡkȬY&ȬƮ$Ȭ౎Ȭ࢛\n\r\x00\r\x00\rࠕȬą*\nѳS\r\rȬą\rX\n\r\rଧLȬपLȬ॔LȬΐ\rLȬਊҁȬΐLȬ܊Ȭs*V\rkȬƐRȬ|	VkȬƐRȬոȬç*Vȯƽ		Vȯ๴ť\x00\x00	\x00\n\r\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	˚0\r	Ȭ໎CѦj	ΨȬӐ¹ȯŌȬࢫȬuȬYਐ\n0\nC\nj\n¹\n͇*RȬȆ\r&ȬñȬ&ȬēȬ$Ȭ\rRȬȆ&ȬñȬ&ȬēȬ$ȬpRȬȆ&ȬñȬ&ȬēȬ\r$ȬȬƧRȬȆ&ȬñȬ\r&ȬēȬ$ȬȬˇ#ȬY\x00\r\x00SȬs*	ȬנRȬ̎ȬƐ\r&ȬñȬǈȬ̂&ȬēȬǈȬƮ$Ȭß\x00\r\x00\r\x00\x00E^ɯ3Ŧ\x00Ԙ˚ඇ͜฾Ѧ௃४ඈŧ΅ŋȬŉŋȬŉŋȬŉŋȬ஑Ũ\x00\r	\x00ʮ\x00ʯ\x00ʰ\x00	ʈʮ	0ʯ	এʮ๾ʮଗŤ\x00ʮ\x00ʯQʰţ\x00ʮ\x00ʯµ\n\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x00	ɸȰËȯŌȬ՜2\rȬਘȯǻȬΒŧłȯƽȯƊ\rS\nȯ,\nŭ\n \rĵŞ\n\n	ʊȯ}\nkȬԠ\nЛȬŦ\x00+\x00ťʰ\x00wʮŞȯ,*ȯ\nԕĶ\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x002ĵ	7ȯĘȬÚȯ}Ȭ঻	ȯŌȬυ\n\n	ʊ\rȯ}\nkȬԠ\nЛȬťʰ\x00\rǝʯ	Ŧ\x00ʾȯ,*ȯ\nǯ\r^Ķ	ȯુȯĘȯgl¹\n\x00±Eũ\x00\x00	\x00\n\r\x00	\x00\n\x00ŇȯĚŗQϐ	AȬд\nAȬѣŨ\x00\nD¹\x00	Ū\x00\x00	\x00\n\r\x00	\x00\n\x00ϐ	AȬд\nAȬѣŨ\x00\nD±\x00	ū\x009ŏũ\x00³Ŭ\x009ŪŐ	ŭ\x009ŔŬ\x00³ŮҔ_ù@ȯ࣎tϯʲů%\x00.Ů̧ɩ*z෽ǶdȯĘȬӧŰࣱŮ็zஐd~ű\rɄˉW?ŕgŷ3Ų9Ʉˉ_ų9ɇŕɄˉ૽Ŵ\x00ɄǊXEÞ9Xȯโŵ9XҹŶİXȬÁXҹŷ\rXಇ$ȬБؙ$ȬۉȬԤ$ȬĜȬÁXȳ$Ȭ෤Ȭш$ȬӽȬöXȬÁXȳ$Ȭ୩ȬҢ$ȬĲȬűXȬöXȬÁXȳ$Ȭ୍ȬױXȬűXȬöXȬÁXবŸ҆XȬűXȬöXȬÁX֞Ź9Ÿ҂ȬʯŸź\r\x00	ŷ		X\x00X#Eȯ}	\x00Xß\r\x00	ŵ		X\x00X#EŔȯ}	\x00X³Ż\r\x00	ŷ		X\x00X#EŔȯ}	\x00Xѫɥ3ż\x00Ò!ȯĖÄĉAȬʸȬʙȯ\nŽ\x00Ò!ȯĖÄĉAȬʸȬʙȯ\nž\x00AȬɬȬɫſ\x00ſ\x00Ò!ȯĖÄĉAȬ९ȬोFȬƏȯ\n+FȬࢸȯȍ&ȬȬʹȬݍȯ\n$ȬӅFȬੋȯȍ&ȬȬʹȬȟȯm&ȬȬJȯ\n$ȬӅFȬଣȯȍ&Ȭ§ȬʹȬŰȯm&ȬȬJȯm&ȬȬJȯ\n$Ȭ௓ȯ\nȬ̌ȯm&Ȭ§ȬJȯm&ȬȬJȯm&ȬȬJȯ\n$Ȭ঱ƀ\x00Ò!ȯĖÄĉAȬɬȬɫȯ\n&Ȭȯ\n$ȬĊƁ\x00Ò!ȯĖÄĉAȬɬȬɫȯ\n&Ȭȯ\n$ȬĊƂ\x00Ò!ȯ̗Ǌȯm&Ȭ§ȬJȯm&ȬȬJȯm&ȬȬJȯ\n$ȬĊƃ\x00\r	\x00\nŇ!ȯĖÄǊ	ȬŁ\nŃȬŁȯm	&Ȭ§ȬJȯm	&ȬȬJȯm	&ȬȬJȯ\n	$ȬJȯm\n&Ȭ§ȬJȯm\n&ȬȬJȯm\n&ȬȬJȯ\n\n$ȬĊƄ\x00ŗȰМȬ୏ż\x00ȯɃƇ\x00ƅ\x00ŗ	ſ\x00ȯɃƇ\x00Ɔ\x00ſ\x00ȯɃƇ\x00Ƈ\x00\r	\x00\nS		ȯ,	*\n	৞\n!ȯĖ\nÄ\nĉ\nAȬʸ\nȬʙȯ\n	̡ʛ3ƈ\x00\x00	Ò	!ȯ̗	Ǌƻ	&Ȭ§ȬIࢇ	&ȬȬIȬࠀ	&ȬȬIȬƃ	$ȬԹà%©@ёʍʮ~ʮ%ʯ\x00ʰʯlʰĳʌ	ʋµʱ%̛ವɄǕ҉ȯĘȬӧ\r\x00	»ࠛȱ˼ȳ7Ő		ĸȯĘȬӁȯ}ȬÚĪƸ	7Ţ\x00ʱfŕ	ɭȯńȯÌȁ\"ȰɴĮʯ\x00ତ\nÉʲ%\x00\x00	\x00\n\x00\x00ll	̛ୌ\nʯ>ʯ\n0\"Ȭŵ\n4ȬĬ͓	\n˖ʳ\x00ʌ	ʳ\x00ʋ	ʰ޴ʳ\x00\r	ȹ7	Ŋ		ȯȬӊ	ŗ			š	\x00ʱf	ķĪ	ޙȰʩ		ȱƋȳuŏ	ࠝ\nॽ\x00	Ɇ\x00\x00	\r\n\nAȬŵ\n̛ࡪKʯऴ\x00\n\x00	Ġʰ4Ȭӊʰ¦ɦʲ௉	\rʯWNܠ଼̛͓ெƉ'ʍ?ʍƊ\x00\x00	'ʍ	ഭʍ\x00\x00	á\x00\x00	\r\nS\n\n	\n*\nǏ\n_Ƌ\r\x00	\x00\nŝ\x00ȯ̌	0\nѠŝ	\x00ȯݵ£0mѠ)\nюƌ\r£\x00m#ȯŹmK)#ȯÔ)Œƍ\r\x00	ȳ̍ȵːȷ۶ȷ௸		ȯ,	ƅŚ\x00	ණƎ\rŝŝ\x00ȯɂȯझɄ˛ȯ\x00ȯ࣢ɹȯwঙƏ\x00'?ȯŹEƐ\x00'?ȯÔEƑ9ŝŝ\x00ȯɂȯೃቅ3â\x00\r	\x00\nȯāȯǅ#ȯυ		ȯ,	X\n	Wř\n\x00b\nȰȞȯђã'?ŝŝ\x00ȯɂȯ౒ƒ9Ş\x00ȯಂƓ9Ş\x00ȯࢬƔ\x009ƓƸƓç\rʮ\x00\x00ʯ\x00ʰ\x00ʱ\x00ʲ\x00	\x00\n\x00ʳ\x00ʴ\x00ʵ\x00ʶ\x00ʷ\x00ʸ\x00ʹ\x00ʺ\x00ʻ\x00ʼ\x00ʽ\x00ʾ\x00ʿ\x00ˀ\x00ˁ\x00˂\x00˃\x00˄\x00˅ʮ­ʯʰ­ʱʲ­	Ȭߞ\nȬϊʴȬɔʹˆ		ʺˆ\n	ʻ2ʽ̛ćʾȹȏʿˁ˂˃̛ć˅lR©MÕ1Õ'K@\x007\x00,\rё૑ʷːʸ.ˑȬŲʵųđfʶĥȰӔīɣ\x00ȰŔ	īɣ\x00ȱȕ	īɣ\x00ȱď		īɣȰϮȺˆ\n	īɣȰϮȷȏ	īɣ\x00ȰŚ	īɣ\x00Ȳė\r	īɵ\x00ȴơµ˖औ˖ů	˖Ȭu\n˖Ȭ-˖ȬY˖Ȭź\r˖ȬØʵ7˘ஃ˒Ȭ۩˔ȯ٤˚ַ\r'ʷɘZ˗ʰ	ʳƇ\x00ʳκˆ\r˜\x00˝\x00˞\x00˟\x00\x00	˜\x00˝˞˟2l	p\n\x00b\x00³\x00¯\r\x00\x00\x00\x00l\x00w\x00T\x00¢\x00Ex\nࠉ˞Ȅ˜\"˝˞\"˝%Өbª˟˝˝/˝Ȅ˜ʚ\r%Өbª˞/˞ә˜Ǟ˜\x00˟˞੆Āp֬³ł˟˞\x00˞/˞Ȅ˜ܰ˞M˝˜Ǟ˜˝˞ʲ˝˞İȄ˜İә˜Ǟ˜9˟ʼˇ\x00\x00	\r\nS\n\nã\n>\n	ˈ\x00'\"ɘ\"ɘഝۣсࣨंˉ\x009ɸȰƎûࢱûžÞ೥Þ൹ˊ\x009ɸȯíûેɸȯíÞܖˋ\x00\r		/ĢȺĦȩɸȰƎĢžĦҥɸȰƎĢžĦӓɸȯí	Ә	ɇ	ʚɸȲ˯	ˌ\x00\r	\x00\n	/ĢȺĦȩɸȰƎĢžĦҥɸȰƎĢžĦӓɸȯí	Ә	ɇ	Q\nɸȲ˯		੾\nȬͥɸભ\nŒ\nˍ\r\x00	\x00\n\x00\x00\x00\r2	.˓̹\n٣¢ȯ,*\r.˓û\nɇÞ\nƦȯ\nˌ\r\x00	Ŝ\nEˎ%\x00˜\x00˝\x00˞\x00˟\x00ˠ\x00ˡ\x00ˢl˜2ˠ2ˡ2ˢ2µ\x00a	\x00v\n\x00¼\x00q\x00¶\r\x00¸\x00\x00{\x00 \x00Ex\r\x00	˝˟˞ˡ2ˢ2˜2ˠ	lB	4wB	T	ଛ	4lî˜˝ˊ			˝üˢȯ\n	೸ˈ		ୁˠ˟ˉ			ˠ˟ʜȬ૮˞#ˠ˟˟ആ		ˡȯ\n	΅˞\x00˟_\n\r\x00	\x00\n\x00\x00ȬØ	2\nˇ	\x00؄˟ã>ˠFȬ´	ెFȬş	াFđÙ	୦FĕÙ	೧FȬఞ	়	ෆã>	ஆ\nى\n\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00Ȭſ	\nl\rĩ˝?	ţ˝ೖ22\n຦˝੫˜p˜WఎAȬకुන#Ȭ೯M\x00ĭ\x00Цέ\nŎԙ\x00ਜȬॊӄ്*ࡲĭ\x00ЦέŎԙS>ҀȯȬࣇ஗\nA\r\r\n\x00	ɸȰŏ\r\x00	²	\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00¦\rĳĩˡȯȬরˢȯ୪ମˢȯšX	ˢ\nˢનˈ	\x00\nߥ	ز\nզ/	Þ\nȩ	û\nޕȬ؋Ȭ؊ȬବÄȬ௭ȬૣȬ૤AȬපȬ௤	Þ\nٻȬ඲Ȭ૦ȯ\nλȯȬ૫ȯіȳֆ±ȯ,*#qȯT±ȯ,*ɸȯíѿ	#ඐȯෙ/ȯƊ҄ȬuAȬ٬Ƶ\r۵\r൙\x00૞Ȭॡ\r\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00Ȭœ	¦\n¦¦࠶ˡȯ\r­±¢ˡȯš*ˡˡp݄ɇ	47\rÓAȬ´\n	K	+Óఐࠁ47\rÓAȬ´K+ÓAȬĬ\n4	7\n	\x00\r߽AȬĬ47\x00\r׾\r\x00ˡȯȬఇ%\x00\x00	\x00\x00\x00\r2	ĩˡȯෑȬి\x00ȯయ\n\x00'MAȬઠMAȬڶȬৼˍˡ	\n0าȬtȯ,*\r\n௮!\r7Ó	AȬʭ๸	ک	Ó\r΁\x00ȯԧ\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00	ȬԴ\nˡ\x00ɇ	Lȯ฿ɘ\x00ĩȬड़ȯšGȯڎ>.˓ߊঽܕੈ4ɘ7ˋ\x00	#\x00ɸȰŏ\x00õÿM࣓಺Ȭ๹ȵখ\x00\x00	\r\n\nϡ4ʮ෮ާ	ȯӦˈlf	z\nչ\n%\x00\x00	\x00\n\x00\x00\x00\r\x00\x00ˡ0.˓̹	ɘ\x00\n±\r¢\rˡȯš\r*ˡ\rˊ\x00එ.˓ûɇÞƦ\nˌ\x00		!ɘ\n!	вÓ	\n\x00୳\x00_\r\x00	\x00\n\x00\x00\x00\r\x00	\nا˅˅.˓ˡ෼ˡಾ˅h˅h˅\x00ˡȯˑ\r\r\r*ˡ\r	Ȍû˅ʆ\nȌÞ˅Ʀˉ\x00	˅h΁	\x00\n\x00\x00ʼˏ%\x00˜\x00˝\x00˞l˜2˝˞µ\x00a	\x00Ã\n\x00Ex\r\x00	˝˞±lB4wBTÏ			ȯȬɹ	ȯȬș˜˝	\x00˝П	ȯȬʭ˞ຬ	˞\n\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00Ȭ˗	Ȭ਍\nū2\rĩ˝ݞ˝ã>˜ȯȬЇ\nˌȯਃ\nȯ਄П\nʾã>ʜ\r؇\r\r\x00	\x00\n\x00	ט\n\n˝ã\n'\n˜\nWȯȬ౽ȯȬޚȯ೾ȯ۰	ޥ˜\nи	ː%\x00˜\x00˝\x00˞\x00˟l˜ˎ˝ˏ˞˟ȲܹEx\x00\x00	\r\n\x00\x00\x00\r\n௅\"ʯआ˜>˜Ȱ͆˜dʹ\x00\x00		!ɘ7\n\x00˞΄ʹু˝>˝Ȱ͆\r˝dʺ	\r!ɘ7\n\r\x00˟΄ʺࣥ\nˑ\r\x00˜\x00˝\x00˞l˜˝ˆ	˞ˆ	Â	\x00°\n\x00¾\x00Ex	\x00\x00	'ࠞ\"ʯ7˝		˜Ŏ˞	ܪ~\n\x00'\"ɘ?E9ɇLȬǷȬ೽%\x00\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00!\x00\"\x00#\x00$\x00%\x00&\x00'\x00(\x00)\x00*\x00+	\n\rʴ\x00 ʴ\x00!˝\"˞!΀#˝lB#4˝wB#˝T#Ï$˝#	%$a\x00	#%0#%CɸȰŏ$v\x00	ɸȰŏ$¼\x00	$q4ɘ7&$q\x00&ۍÓ#&C&0вȬѪ	ȬѪઍ'$¸\x00#'0#'C($ \x00#(0#(C)$\x00#)0#)C#)j#)¹\rɸȰŏ$\x00\r	${4ɘ\"ʴ${${˖ȈɸȰËLȬҭȈɸȰËLȬҭAȬࡠÿ҃Ȭ࠾Ȭjÿ҃ĕ่Ģ/MȬ௕ȬതɸȯĺLȬŲɸȯĺLȬŲɸȯĺLȬ࢞ĩ\"΀#˞lB#4˞wB#˞T#Ï*˞#	\n#*a\x00#*Ã\x00*4ɘ ʴ *  *˖\"ʴƵ \"ʴ Ƶ#ʳ2++ٳ +Ȭਕżʳ\x00+	Ɓʳ\x00ɸȯĺ	ŜƁʳ\x00	Ɓʳ\x00˜	Ɓʳ\x00	Ɓʳ\x00	Ɓʳ\x00	Ɓʳ\x00	Ɓʳ\x00	Ɓʳ\x00\r	Ɓʳ\x00\n	Ɓʳ\x00	Žʳ\x00	Ƃʳ\x00ϽƂʳ\x00ϽƂʳ\x00ؓ˒\x00\x00	࣪ȯґ൪ȴ਺ȴࡽȯЬ	ಹȯஇȯۼȱͫȱځȰÊȰહ˓\x00ຎส˔9̛®˃˕˙ȯ૳˖\x00\r		.˒\x00\x00˔ȯ৭ʵ˘	੘˕	ݿ˄\"ʯ˗ʯQʺ		˄ʰ\x00ʺpÙ˗ʰգ˂ສ	ȯϤʹ	+	ȯਸ˗ʯ\x00ʮ\x00			Ȱ̷ʱ˂Ȭ֕ˁ˂Ȭஂ	ȯȬƜˀ	\x00˂ີ	ȯȬวˈˀ\x00	z˗ʯQ˂޺	ȯȬ´˂ĉ	ȯӦ	Ȱ̷ʲ7˂Ȭ-ˁۿ	ȯϤˁபˁˁGȬ´˂ْ˄ʯ˗\x00\x00	\r\n\x00\x00ȵŚȳथ\"ʯʹ̙ʺε\nʷȲġ\x00\x00		ʸÂ\x00\x00\nǪ˘\r2ȯ\nȯ๔ȯ಍ȯ\nʆȯ\nऎȯ\nʆȯ\nƦȯ\nȰଞȯ\nȯ઴ȯ\nȯ଩ʻȯ\nɄ\\ȯࡒʻȯǂ̛®ʽGȬ௝˚ˬ˙%\x00\x00	\x00\x00\r\x00űȬഖ		ȯ,	ݡ		઒\n	ୃɄ\\ȯ\x00ȯ౵ŏŰຊ%5ɵȲ๧ɵȲƑȵࣄɵȶनȬ๬Ʉ\\ȯ࣠ɸȯԼ\rජɰȯխɵȰ๷ɵȰ˾ȰຫɵȰ˾Ȱ޵˚%ڰʼʼ˙łʿüȯ\nʼ	ȯ\nʿ	ȯ\nʶ	Ȱʩʻ	ʻ2ʽ̛ć˛Ʉ\\ȯૉ˛\rūɵȯ඼.ɵȯಟɵȰࣉ.ɵȰ࣐Ȳࢌˌȯȇȶđʾnȯġलƕ%ʮ5ʏZʏ­īɣ\x00ȹ्Ƙ	ɎĿʮŀ̛ěȬثE!ɎE\x00ɄƙȬuɄૻƗɣȯӼµ\r\x00	\x00\nɄ=ȯȯ£ȯӛƚ\x00ȯѓȯϝƚ\x00ȯŉǭ̦ʮȀ\x00ȯή̛ʓÃȯߠȯ6ȱ٠ȱĂȱஶȰŤقȯඤɄ¬ɄŊȬࣈ	ȯ6ȯȟ	۳	ȯĤ	ǻ	Q\nƭ	ř7ȯಒɤ\nଳȕ\x00ǿ੸Ɩ\x00\r	\x00\n\x00	ȯ6Ȱ֭	ɑZ	̛࠿g\nʒ	Ġ\n7\nlʒ	\n\x00Ʉȯ	১ȯƜ	̛Ҹ		\nD̛ě		ŀ\nD	\n!!؆\nƗ\x00\x00	\r\n\x00\x00\x00\r\x00\x00\x005ѺɘZ\n.ȪȬਰȯƔ\rȸЪȶఒ	Q\rЯǺʏ'঑Wࠆࣃ\n \x00\rǎε\nڐƚ\x00'ȯ6Ȱէ̛Ƃ\x00\x00ȯ6³Ɲ\x00\x00	\x00\n\x00\x00Ā!¾¾È	¾²\n¾~¾|ƞĀു̹3ƟĀƠĀ]ҶyҶjϯ¾ggইjȯ৒ơ\x00\r	\x00\n\x00\x00U	̛ӉȬŲ\n±઎]କ	\nß\nG	ȯෛƛ	ȯƊȬ֓Ƣ9ĭ\x00ʘƣ9ĭ\x00ʚƤ\rŽ\"ȯĂȱമȰӜȳғ൴ƥ\r\x00	\x00\n\x005ȯӈȬ෱	0\nς\n!ȯɣ\n!ȯಖ	rƟ>	ȯ޹˸\n˴ȯ˕ɄH»ȯJȯ\nȯϟ	!ʥ		5	ȯӈȬɽ		ȯȬƧrƟƤ]ƣƧϛ	ȯ[	ȯȬ-Ȭ˵˸\n˴ȯ[Ȭŀ\x00ȯâȯ˕ɄHoȯJȯ\nȯض	!ʦ7		\x00		ȯŬƣȰńȰI	ȯ[	ȯȬuȬ˸\n˴ȯ[Ȭŀ\x00ȯâȯ˕ɄHoȯJȯ\nȯ߶Ʀ\x00'ȯڕȱ୚ĭ\x00ʙƧ\r5ȯȬÆɄȯໆɄȯ\x00ȯ౿ȰӜȳғڭɩȯǝȯՏƨ\r\x00	\x00\n\x00\x00\x00	౛	rƟ>	ȯ̱·ɄHe\x00ȯ[ȬŀȺێ	ȯౙȯǦȬƜȯ[ȬŀɄHÆȯI	\x00ȯâȯ\nȯϟ	!ʦʞ\n	\x00\nj\n0Ʀ\nƇ\x00೏ȰIȯȬŵ#ȯࢾ·ɄHn\x00ȯ[Ȭŀ\x00ऐ	!ʥ\n	5\nȯѭȬɽ\nj\n0Ƥ]Ʀ\x00Ƨϛ·ɄHn\x00ȯ[Ȭŀ\x00ȯſ\x00ȯâȯǮȬŵȯ[ȬஜƩ\r\x00	\x00	j	ȯșų0·ɄH\\\x00øȯIǋọ̇Ƣ	ø0·ɄHsȯIਿ	ෲƪ\r\x00	5ȯѭȬɽ	jƤ		Ƨ			ȯșų0·ɄH\\\x00øȯIǋọ̇Ƣ	ƇƇȯரƇۙƇȯ࠭ø0·ɄHsȯIૡ	\x00౫˃3ƫ\r\x00	\x00ȯǦȬЇ	C	ȱƜ·ɄH¬\x00øȯIų	\x00ȯ[ȬΗȯՆƬ˙!ݣʥƪǧʦƩǧʧƨǧʨƫǧʩƥੳƭ\x00\x00	\r\n\x00\x00\x00\r\x00\x00»৬\n̛ćȦ	\n̛п	¿S\r\rȯ,\r*\rľfƬ\rට\n̛ćɄρȬॾơ\x00ÅQ\n̛ćªȯખ\n̛пɵȯ૿DĻƳȥƗ\x00	Ήʢ	\r»ȯчȯ̪Ʉ=ȯȯǳȕ\x00	ȯ´ǭQǿí\x00\x00	'Ʒb̛ʱ\x00	\x00Oȯȷ#	E	ƴ\rɵȷൌȰ੦ϰȯݲrĺ\x00ȯ౉ȁȰҗϰȯ͉ȰॿȯౘȰнȯञȯͬȬ௺Ȱнȳਏ	ǘƵӝȯ͉ȯͬȬटǘƶ\r\x00	\x00\n\x005ɵȯܥیȵԆȷഔ		ȯ,	݉ɵ	ശɵ	ୟȯӣౢ\nɵ	ࠡ\n\nȱˡȯ,ƅ\nȱˡӵ\nȱˡVȯӣ௰Ʒݪȯ౸ȰଃɄ¬ɄŊȬ˜ĥĝȰաĥȰ੊ƶಉȰтȯəɬȹ࢝ȯōʛȯȰ௡ȰтȰҗɬȻൟȯōɚȯȰ२ǘƸ\x00\x00	\x00\n'Ʒ	ಳ\nÀȯф̛ʱ\x00\n\x00	Ğƹ\x00\x00	\x00\n'Ʒb̛ʱ\x00\n\x00Ãƴ]ĺ\x00ȯрȯý\n/̛ƾޑ\nK̛Ƃ\x00	\x00\nD\nڠƴ]ĺ\x00Ȱ࠸ȯý\n#	౻	\n\x00Ș1\nƺ\x00\x00	\x00\n'ƴ]ĺ\x00ȯɥȯý\nȊ\x00	ä\nK̛Ƃ\x00	\x00\nD\n΃ʡ3ƻ\x00\x00	\x00\n'ɣȯý\n̛ښ\nK̛඗\nD̛ࡔƼ\x00\x00	\x00\n\r5ƴǒ\n	ȯý	ĿK	\x00ƳD\nƽ\x00\x00	\x00\n\r\x005ƴǒ\n	ȯý	ĿKȰ˪	\x00ƳD\nƾʮ\x00\x00\x00	'ƴʮ]ĺʮ\x00ȯ൓	ȯࣦʮ`	\x00ʮ\nE	\nǶʮ	ʮ`צƿ\x00\x00	\x00\n\r\x005ƵώɄ¬ɄŊȬ̩Ȳ˪Ʉ=ȯȯ̀ĺ\x00ȯӫȯȬĺ\x00ȯѱȯѼȯࢷ\"ȯý\nȊ\x00ä\nKȅ\x00\x00\nD\nชǀ\x00\x00	\x00\n\r5ȯɣƴ]ĺ\x00ȯଽ\nȯਸ਼Ɩ੩W\n\x00ȯũɘƫό\nî\x00\x00	\x00\n\r\x005ɘɄҝ	ȯĂʝȯÔ	W!ɘ\x00\x00	\x00\nO!ɘ?܅\"ȯȷ	̵\nE	\nǁ\x00\r	\x00\n5ƴ	Ʉ=ȯȯ£	\"ȯÆ\nWƴ\nb\n5\n@ř\n\x00ȯഏɄ¤\n\n̛ƾO\n4ɘ?̛૘\nޅ_ǂ\x00\r		ȰӲȓ	DɄ¤	Ğǃ\x00\r	\x00\n\x00\x00\x00\r\x005ƴ	Ʉ=ȯȯ£	\"ȯѕǂ\x00Ã	ȱť\nșʥȬðșʬȬðWȯɻ\nȱ́̛ņа\nȰμ\rȰӲȋ	\rȯ<ȯđD\rȯఈĥʰĦƷbɄ¤Ƕ_Ǆ\x00\r	5ƴ	Ʉ=ȯȯ£	\"ȯѕǂ\x00²_ǅ\x00'ƴbȔ\x00Dǎȍ3ǆ\x00\r	5ƴ	Ʉ=ȯȯ£Ȁ\x00bɄ¤Ы	ȯȽ̛ņԕ_Ǉ\x00'ĥʰɄծ_ǈ\x00\r	\x00\n5ƵώɄ¬ɄŊȬ̩	Ȳ˪\nɄ=ȯȯ̀ĺ	\x00ȯӫ\nȯȬĺ	\x00ȯѱ\nȯѼ\nȯछȊ	\x00\n²_ǉ\x009_Ǌ\x00'\"ɣ?̛ěȬǽ_ǋ\x00\r	5ƴ]ĺ\x00ȯɥ	ƖO	?	WĻ_ǌ\x00'ɣ?ĦƷbɄ¤Ƕ_ï\x00\r	5ɘɄҝȯĂ	ʞȯÔW	!ɘ?	\x00²_ǍըȯࢊȯŘȷĐȴັȰೡȯःǎ\r\x00	\x00\n\x005Ǎ̮ȯĎȱȯ׬ȱĎȯ˝ȲŁȺࢥ		ȯ,	X\n.ɬȰǓ	ઐ\nȰƈ౐.ɬȺՀȰƈஅǏ\r\x00	\x00\n\x00\x00\x00\r\x00ȯĎȱȯ˝ȯࡑ		ȯ,	X\n.ɬȰǓ	व.ɬȰǓ	Ŀȶಛ	ĿȰ୴\rţ\nȰƈÏ\r஌ȰƈÏƱ\rˣ෦\rˣล\r4ଲǐ\x00'ɬȹđȰؗȯōۤ7ȯÇɬȳೂȲŋȯÇɬȳౠȲயȯÇɬȷࣂȯÇɬȹށ^Ư3Ǒ\rɄȐǐnɄÂȬ˘Ȳߺ਋ɣȯ¿ȯȋȰŗ\x00Ȝ	Ȱ̘ɄȐɄÂȬ˘Ʉóȯ\x00ȲܯȯѢǐ୮ǒ'ǎ࣏Ǒ½όǓ\x00\r	ʜ#»Ǐʜ֠Ʉ¬ɄÂȬ૚ʜǒʜ+ǎʜ	.Ʉ޶ȱອʜ\x00ȹԁȜ		ʜ	ȺகȰ঴	ȯǾȰࡢȲϥʜ	ʜ๥Ƴǔ\x00\x00	'NȱࡁȯڔɄ૬ȬƖ̛ߓÀȷޒȱಱǬ1ı\x00\x00	Ǖ\x00\x00	'ɵ?Ʊȯɵ\x00	Dı\x00\x00	ǖ\x00\x00	'ɵ?Ʋȯɵ\x00	Dı\x00\x00	Ǘ\x00\x00	'ɵ?ȑȯ\x00	Dı\x00\x00	ǘ\x00\x00	'ɵ?Ȓȯ\x00	Dı\x00\x00	Ǚ\x00\x00	'ɵȁ	ʤȯфƭ	ߟı\x00\x00	ǚ\x00\x00	'ĥĝɝ?̛յ\x00	Ñı\x00\x00	Ǜ\x00\x00	'ĥĝɝ?̛ࣵ\x00	Ñı\x00\x00	ǜ\x00\x00	'ĥʰ̛೰\x00	Ñı\x00\x00	gƟ3ǝ\x00\x00	\r\n\x005ĥĝɝ\nŞȯŦȯϪŝȯŦȯ׆Ʉģ\nEĻı\x00\x00	Ǟ\x00\x00	'ɣčɄภ	ʤȯˍǓ\x00	Ñı\x00\x00	ǟ\x00\x00	'ƴ]ȯɾȅ\x00	0	ɧı\x00\x00	Ǡ\x00\x00	'ƴ]ȯɾȊ\x00	Ñı\x00\x00	ǡ\x00\x00	'ƴ]ȯɾȌ\x00	Ñı\x00\x00	Ǣ\x00\x00	'ɵȱण̛ಀ\x00	Dı\x00\x00	ǣ\x00\x00	rɵȴඖ	ϬɵȰͨǸ	߸ı\x00\x00	Ǥ\x00\x00	ɵȱ͌rɵȱ͌	ϬɵȰͨǸ	۠ʎƴ]ŜȯˇȯɥɄॏ̛̻²ı\x00\x00	ǥ\x00\x00	'ƴ]ĺ\x00ȯऩǮ\x00	Ñı\x00\x00	Ǧ\x00\x00	'ƴbȎ\x00	Ñı\x00\x00	ǧ\x00\x00	'ƴbȏ\x00	Ñı\x00\x00	Ǩ\x00\x00	'ƴbȍ\x00	0	ɧı\x00\x00	gʝ3ǩ\x00\x00	'ƴbȐ\x00	0	ɧı\x00\x00	Ǫ\x00\x00	\rʮ5ƴʮȰঠ	Ԑȓʮ	Ɨʮ\x00\n	ȜʮDʮĻı\x00\x00	µ\n'ʮZȓǫ\x00\x00	'̛׫ȱࣅǴDı\x00\x00	ð\x00\r	\x00\n\x005ɘɄ൝	\nȬt\nɩ\n*	ȯɪ\nറȯĂʟȯÔW!ɘ?\x00\x00	²ı\x00\x00	ñ\r\x00		¢	ɩ	*ȯɪ	ԋɵȯйƱȯɵ\x00ÃɵȰۆƲȯɵ\x00Ãɵȱйȑȯɵ\x00ÃɵȰٷȒȯɵ\x00Dȯɵ\x00ò\x00౦ɵȯ॰ȯˍƭঘó'ɣ?̛ऀȯಭǬ%\x00ʋȱʠʋȱౡʋȱŖŒǭʮ\r\x00»ʮʮ2īʮ\x00ȯƿ		ƖʮOWZʮȯ6ȯగȅʮ\x00ȯ`	̛ۡʮ\x00Ǯ\x00\r		ƖO		Wఓ	W	Wȯ˂	Wȯ\x00½\nÉǯ\x00\r	\x00\n\x00	5		ȯߣ\n\n	ȯݰ\nʀ	\nȯ˂ȯ\x00½Éǰ\x00\x00	\r\n\x00\x00\x00\r\x00\x00\n	0	C	ҍȰɴȲєƷ̛Ǵ\n\x00ȯ੠௙ȯ\n	ĺ\x00ȯਞ\rĳȯ6ȯȶ7Ʉ\\ȯΌɄHYхɄH[\x00Ȳీ\rȬไɄiȯ\x00ั\rǿૐ̛Ǵ\n\x00ȯ൷ĺ\x00ȯٝǭ͔౾ȯैȯ\nÃȱ̭ȴૃކı\x00\x00	gɧ3Ǳ\x00\x00	\r\n\x00\x00\x00\r\n	0	C	ҍ\"ȰɴȲєƷ̛Ǵ\n\x00ȯԻÖ\r\rȯ,\r*\r¡ȯ[\rঐ̛Ǵ\n\x00ȯכÖ\r\rȯԊ\r¡ȯ[\rਪ\rڊı\x00\x00	ǲȱเȱشȲٚǳ'ȱ੥ȸజȲஓǴȱ௢ȱ੓ȳࡉǵ9ȳฯǶʮ\r\x00ʢʮ\x00Ɩʮɷ;!!GȬ໊Ʉ৲ɄoDnɘɄ౲̛ęʮ\x00ȯࢢʮȯ<ȯđ	ɦ	ˮ	ǷʮǷ\r̛ƾ	ʢɘ\x004ɘȯÊȰ੟Ǹʮ\r\x00ʣʮ\x00ʮȯ6ȯŉ@ř\x00Ȱࣗ̛ƾʮ	\"ɘ̛ęʮ\x00ȯൈʮȯ<ȯy	ɦ	ˮ	ǹʮǹʣɘ\x00ȯচȰڮǺİɬȺӢȯ੍ȯō³ǻ\r\x00	\x00\n\x00Ňȯ̸ʛȯ		ɱȯ\x00ȯ٫\nȯωɩȯ\x00	\x00\nʵǼ\r\x00	\x00\n\x00ʮ\x00\x00ʯƖ		Ɩͳ`	k`ਉk\n	kɅ\nȯ6ȯȶ	k\n෇\nȯĤ\nǻ\nQ\nƭ\n౮\nූʮɄ\\ȯΌɄHYхɄH[\x00Ȳƿ\n௷Ʉ¬ɄŊȬങȳ౬ȶ๛ȴØʮƭܽʮ\x00ȯ˱ɤʮьʯȯ˱\rµ\r%\x00\x00	5ʯ֖˓ȯ6ȯȶ˓ȯ๓ȯ<ȯėʮ࣫ʯü	˓ȯະȯีʯළȯ<ȯė݆ȯ˱E	΃˹3ǽ\r5Ĵбȯ,*Ĭ\x00ȯƘĞǾ\r5Ĵбȯ,*ī\x00ȯƘĞǿ\r\x00	\x00\n\x00\x005ŜȯˇȯрǼʶȯėȯ׻		ȯ,	X\n	ȯ6\nOǺ\nȯƏǽ঄ȯĤǻQȯɁŚ\x00zƭɹȯ\x00ȯઘƭř\nɤ½\rc\nȯƏǾوȀ\x00\r	5ȯߏ	Ʉ=ȯȯਜ਼	Ȳഫ	ȯޛ	ڦ	Ȳʋ	ȹൄ	ȱө	ȴ׿	ȯशŜȯ6ȯȗȰ౓ȁ\x00\x00	\r\n\nɄ=ȯȯ£\nȯť̛Ƃ\x00\x00	๗\nȰΓȯ<\x00		Șࢁȯ<\x00	Ȃ\x00\x00	\r\n\nɄ=ȯȯ£\nȯťȯ<\x00		ǼΕȯ<\x00	ȃ\x00\x00	\r\n\nɄ=ȯȯ£\nȯÆ̛Ƃ\x00\x00	Εȯ<\x00	Ȅ\x00\x00	\r\n\x00\x00\nɄ=ȯȯ£\nȯÆƖř฀	໒	ȯ̸¦	ǻ	õ	ƭ	řȯ<ȯ`ٰɤ			Wȯਖ਼\rcȯ<ȯࣾȯ<\x00	ȅ\x00\x00	\r\nŽȯĂ\nʠȯÔW\n!ɘ?\n\x00\x00	²ȯ<\x00	Ȇ\x00\r	\x00\n\x00\x00\x00\r	Ʉ=ȯȯ£	ȯť\nƖO\n\nD?\nD˒Ʉ¤ȯ6ʍ	ȱťșʥȬðșʬȬð\rȯ6Oȯɻȱ́\r̛ņ\rаȰμ\r?ȋ\r²ȯ6ȇ\x00\r	\x00\n	Ʉ=ȯȯ£	ȯÆ\nƖO\nN\nDɄ૶\nDȯˍ\nD˒Ʉ¤ȯ6גȯ6Ȉ\x00\r	\x00\n	Ʉ=ȯȯ£	ȯÆ\nƖͳ\n\n?\nĻȯ6gɑ3ȉ\x00\r	\x00\n	Ʉ=ȯȯǳ\nȯ6OȀ\x00bɄ¤\nÃ	ȯȽ\n̛ņ\n࢈ȯ6Ȋ\x00\r	ŽȯĂ	ʡȯÔW	!ɘ?	\x00²ȯ6ȋ\r\x00	Ʉ¤		Ʉiȯ\x00ɄҖȯݹ	!ȬӞ	ࢋ	׭ɩȯw	²Ȍ\x00\r	\x00\n	Ʉ=ȯȯǳ\nƖ	\n7	ȯȃȯȬ	ȯĬȯඉ\nDɄ`\n!Ʉఛ	ȯĬȯຽ\nɘ\x00\nWɘڇ	ȰټȯඩȘҳ̛ę\x00ȍ\x00\x00	ɵȰǂrɵȰȯȗ	ȜȅȻି\x00	Ȏ\x00ɵȰǂrɵȰȯȗ	ȜȅȯƢȏ\x00\r		ȰŤ	Ș1	Ȑ\x00\x00	ɵȰǂrɵȰȯȗ	Ȝȅȶ˯\x00	ȑÒȯθƭɡıɵ\x00ȱމȒÒȯθƭɡıɵ\x00Ȱߕȓ\rƖ	7k4ɘȯ<ȯėkQ!Ȭɹ!ȬĤĺ\x00ȯ౳ȯ<ȯđD+ĺ\x00ȯँȯ<ȯyD	ɘـ4ɘȯ<ȯ`Q̛ę\x00Ȱ਴Ȕʮ\x00\rʯ5Ʉ¬ɄÂȬƖʮȯֈɄ=ȯʮȯΤȯȽʮੵʯɣȯ¿ȯȋʯȰŗʮȓʯ	Ɨʯ\x00DʯȰ୼ʮʮȰકȓʮ	Ɨʮ\x00	Dʮଇ'ʯZȓ	'ʮZȓҫ˭3ȕ\x00ʮ\r\x00	\x00\nʮȯ෉Ʉ=ȯʮȯॷ	/ȯǍ\n/Ȱಃȯ൉	\nຨȰҊ	zīʮ\x00ȯƘऍʐȰ۸ʮ\x00ʐȱෳ̛ćʐȰปȖࣩਵȯঀ૎ś\x00ȳ໑ś\x00ȵੰś\x00ȶීś\x00ȳಿś\x00Ⱥপȗ\r\x00	\x00\n\x00\x00\r\x00\x00\x00\x00\x00»ȯчȯ̪Ʉ=ȯȯǳȕ\x00Oȯ6Ȱਯȯ´ǭQǿˈȯӛƚ\x00ȯѓȯϝƚ\x00ȯŉǭ̦Ȁ\x00ȯήȯ6ȯχ̛ʓନȯඨ	ȯਖȖ	ู\nȰ̘\nƭ\nřȰŗ\nƫcț֝ȯ6ȯɊ7̛ņ	ȯ<ȯ˦୰Ȱ֙\rȯ6ȹðȯ6Ȱț\r\rȵਲ਼7ŝ\x00ȯÚȯۇɢȯCɬȲyȯୖǷȯÐɄo	ȯ<ȰઇܔȱෞșʥȬðșʬȬðȯɻȱ੬ț+ȰԷȚٗȰΓȘΖǿȘѾʤZʤɎ\x00ɦˮɎĿӱƔʤE\x00ɎEz̛஻ʤɄ߰ș\x00\x00	\r\n\nȯ6	\n7\nŘ\n		7	Ä\nɄ=ȯ\nQ	Ȉ\nɄҕȯ\n֣\nȚ\r\x00	ȯđ	ȯ6ɷ	Z̛ƚ\x00\x00	จț\r\x00	ȯ˦	ȯ6ɷ	Z̛ƚ\x00\x00	՛ȜȥƗ\x00ȗΉÉô\r\x00	\x00\n	¢	ְ	>ȯɪ	ԋ\"ɵȱଖȯ࣯\nȯڗ\nȯĚȯঝƭ\nɡɤȯࣺɤλȯࣁ҇ȯ૖ΡȯǮȬ૧0́ȯǮȬ๽0Cॶȝ\x00ȝ\x00\r	\x00\n	\n\nȯ,\n*	\nԳ\nȯ̀ɤȯĎȱ͘ȳʌɄ\\ȯ	\x00ȯŴȯж\x00Ȟ9ʪ_ȟ9ʫூ⼗3Ƞ9ʬȯŘ೑ȡİGȬถFȬДGȬϲFȬ಴GȬࢪȢ9GȬƤFȬ࡬ȣ'ȬГʭƌȬಌȡȤ'ȬГʭഗȡȥ\rʮ\x00ʯ\x00ʰ\x00ʱ\x00ʲ\x00ʸ\x00ʹ\x00\x00ˇʮɢȯ\x00ɬȴœȯୀʯʰʱ¦ʲɄȯʮˎȷ१ʯ௻ʳɄȯʮ\x00ʯʴɯȯʮ\x00ʯʵ%ɯȯʮ\x00ʯ°Ȭşʱ૵ʶʏహʵ~ʷ9ɹȯʮ\x00ʯ\x00ȯɌ^ʸ2ʹ±Ȭΰ*ʸȯીƝߢʺ\x00\r		ʸʹʹ/ʹȬ๘ʹӿ	!\x00	\x00	~ʰ\x00	|ʱ\x00ʱĳʲE	ʻ\x00ਝʼ\r\x00	\x00\nʯୈ	ɯȯʮ\x00ʯɘ	Ȭഠ	ɯȯʮ\x00ʯɘ	Ȭ࣍	Ȭಆ	ɯȯʮ\x00ʯچʭ	ƌȬ๒Ȭ඄	Ȭಢ	Ȭޗ	ɯȯʮ\x00ʯǛȬФ		FȬ؍	Ġĝ	Ȭஞ	ɯȯʮ\x00ʯǛȬϩ		ĐໍȢ	Ï	ɯȯʮ\x00ʯɘ	ȬҰ	ɯȯʮ\x00ʯǛȢ	Ï	ɯȯʮ\x00ʯಐ	Ȭ෴	Ȭೞ	ɯȯʮ\x00ʯ°	ȬϾ	ȬӚ	ɯȯʮ\x00ʯຮȢ	Ï	ɯȯʮ\x00ʯణ	\"Ȭ࠰ȣ	ʻȶțʯύʯ÷\nɩȯʮ\x00\x00ʯ	\n\nŒʺȬu\nʽ%\x00\x00	ʯ\x00ɯȯʮ\x00ʯݷ	ɯȯʮ\x00ʯО		Ȭşʻȵನ	ȬЧʯ৫	!?ʺȬuɩȯʮ\x00\x00ʯ³ʾ%\x00Ʉiȯʮధʯ	Ȭটɹȯʮ\x00ʯ	ʯʮȯ٩ɩȯʮ\x00ʯ\x00	ʯDˆ~ʿ%\x00Ʉiȯʮଶʯ	ȬɖʻȻٹɩȯʮ\x00ʯ\x00	ʯȬuʱʱɄiȯ਼ˆ~ˀ%\x00\x00	ʯ\x00ɯȯʮ\x00ʯǛȤÏɯȯʮ\x00ʯӺʯ÷	ɩȯʮ\x00\x00ʯD	ˁ\r\x00	\x00\nʯ\x00\nज़	ɯȯʮ\x00ʯО		Ȭşʻȸ૪	Ȭռ\nޞ	ȬЧʯຉ	Ȭք\n֐	!Ȭຂ\n>ˀ1ʺȬuɩȯʮ\x00\x00ʯ³˂%ʲ5ȬҧȬɹШȬīĐĝȬҧ\"Ȭћ\"Ȭഐ\"Ȭ૔˃ʯ܂ʳأʵ1ʾ؀ʵ1ʿ້˂үʳ˔ȯ֎ʵ1ʺġࣤʺȬ-ȯാˁȯ෷˄%ʯÓʴȢbʼȰ܏Ȭ֘ʮȯaʯ࡞ȬകʵʵʺȬ३ʺȬࠑȰѻ˅%\x00ˀʲȬȷʺůʫWۖʺ\x00Dʺů	%ˇʃˇνʽ\x00ˇѯ˄\x00ˇҎ˃\x00ˇ̆\x00ˇƞ	\x00ˇ̖\n\x00ˇॎ\x00ˇȮ\x00ˇ˰\r\x00ˇఊ\x00ˇࠬ\x00ˇ०\x00ˇۄ\x00ˇמ\x00ˇࢭ\x00ˇֵ\x00ˇಯ\x00ˇ͚\x00ˇԔ\x00ˇ͕\x00ˇ੭\x00ˇߤ\x00ˇࠣ\x00ˇ੕\x00ˇ૭\x00ˇ݌SȬτ*ʭƌȬ´ˇ˅GȬƤFȬĚˇʼ૕%ʵʴe«ʵʴe«ʵ1ʺȬ෗ʺȬઓʺȬYȴટ	%ʵʴ\"ďîʵ1ʺġૢʺȬ-ȱƺ\n%ʵʴeɤʵ1ʺȬ٭ʵ1ʺġڽʺȬ-ȯං%ʵʴe«ʵ1ʺġଏʵ1ʴ˔ďªʵʺġٮʺȬಞʺĎȯຐ%ʵʴeഥʵ1ʺȬֱʵ1ʺġȯ٪ʺȬơȱ଎\r%5ʷໂʱʶȬϢʾʡʵʴe๙ʵ1ʺȬ௏ʵ1ʺġ൸ʺȬơȱਹ%5ʷȻඵʶȬǽʾʡʵʴeଈʵʴe«ʵ1ʺġ೚ʺȬࠟʵ1ʺȬແʺȬ-Ȱ৆%ʵʴe«ʵʴe«ʵ1ʺȬ೷ʺȬືʵ1ʺȬසʺȬඪȯٞ%ʵʴe«ʵ1ʺȬՂʵʴe«ʵ1ʺġׂʵʴe«ʵ1ʺġȺ൜ʺȬ๜ʺȬ৥ʺȬ-ȰਙʯƱʴ˔ȬҰȢʮȯaʯঞʵ1ʺĘݴʴ৕Ȭ߁ʵ1ʺȬ൏ʺȬʇȯަ%ʵʴe«ʵ1ʺġ՘ʺȬՠ%\x00ʯ\x00ʵʮȯaʯĨʯʮȯȾʯƱȬ̏ʯԛȬѡʮȯaʯÀȬѩʯРʺȬԆʮȰġ\x00ʯʍȬѴʺȬ఩ʮȰġ\x00ʯ:ʮȯaʯgʻȲѷ%ʵʴe«ʵ1ʺġ੣ʵ1ʺȬ۽ʺȬ-Ȱ࡚ʵ1ʺȬYȱԃʵ1ʺȬǒȯĊʵ1ʺȬCȯŅʵ1ʺȬďȯɉʵ1ʺȬЀȯΣʵ1ʺȬǃȯΩʵ1ʺȬқȯσʵ1ʺĐȯƬʵ1ʺȬĎȯੌʵ1ʺĕȯ੄ˆ%\x00ɯȯʮ\x00ʯĨȬկȬ܍FȬ৙AȬڌȠݾȬşʱ੒ɯȯʮɍʯʰʯ\x00ˇW?AȬےʺůˀ݊?ʺúʻȴ૏ȩѫˇ2	ˆºʻ\x00ˆ\n\x00ˆEˆx\nʲʲ%\x00ʯ\x00ʮȯaʯĨʯʮȯȾʯƱȬ̏ʯԛȬѡʮȯaʯÀȬѩʯРʺȬȓʮȰġ\x00ʯʍȬѴʺȬƲʮȰġ\x00ʯ:ʮȯaʯgʻȲౄȦ\x00\x00ʮ\rʯ\x00ʰ\x00ʱ\x00ʲ\x00˙\x00˚\x00˛\x00˜\x00˝\x00˞\x00˟\x00ˠ\x00ˡ\x00ˬ\x00˭\x00ˮ\x00˯\x00	ʯȥ	ʰūʱūʲūʰʵ඿ʳ9ʰ!ʴʲPʲʯҟʵʱʰ\x00ʲ7ʰʲ\x00ʲഹʰʯ1ʰʶ\x00\x00	\x00\nʯº\x00\x00	\x00\nʷ\x00ʶ\x00~ʸɄʰKʷ\x00ȳʺ!ƴȯŅʹ'ʳbʵBʷʰ\x00Ȳɕʰ!ƴʰȱЈƴȞäȯŅʺ'ʻbʵBʷʰ\x00Ȳɕʰ!ƴʰȱЈʻ9ʰ!ۊʰ\"ʼඍʮNʰ|ʰ!ࢮʰ!ĕҟʽȯ\nȯŪʰ!ȬКʵൣʼÙʸˬʾ\x00ȯ\n	ʹȬÌ˧\x00˟nʯʹȬáȯ\nȯŅʿ\rຯʰ!ӃʻȰߚ˂ˈʻȰࢻȯ\nʰhʵΖʴ̝!ȬŨ˃+˄अˋೀʵȯ\nȯוȯ\nʰ	ʵ˅෯ʵȯ\nȴȔʽݢȯ\nȵࢼʵʿ	ʹȬؠʾ\x00Ȼȗʽࠖʵʾ\x00ȵŝʿګȯ\nȺʅʵ˨ˆ	˩޳ȯ\nȱʵʰ!\"Ďªʵȯ\nȯǬ˘Ȁˈ౷ˉోʵˊࢧʵʰ!Ȭݑȯ\nȱ૲ʵ˫ʼÙȯ\nȱઈȯ\nȶĽ˧\x00˟nʽ౤ʵʾ\x00ȵº˨ˌ	˩ฆʵȯ\nȶŲ˧\x00˟nʽඣʵ1ˍଡʰ\x00ȯ\nhʵˑ\x00	ʽׯʵʾ\x00ȷŪ˨˯i¦ʿ	˩܀ˁঁʴ!\"Ȭײ!\"Ęªʰ!­˄ˀۏ˄ˀʵȯ\nȹডʰ|ȯࡂʰ!Ďªʵȯ\nȯܤʰ!\"Ȭөʰ!\"ġªȯ\nʰ	ʵɸ˧\x00˟nʽˁ\rȯ\nȷǅʵeʰ!ɤʵȯ\nȯƯʻŐʵȯѵ˘ȢʺȯĽȯ\nȯċ˧\x00˟	ʽˏʵȯ\nȯħʰ!4ĕîʰ!\"Ȭˋʵȯ\nȯȻʰ!\"ĕĮ˘	ʻŐʵȯ\nȰŰ˘ʛʹĕfȯ\nȯºʻȯʷʵȯ\nȯċ˧\x00˟õʽתʰ\x00ʵȯ\nhˑ\x00	ʽӤʵȯ\nȱʰ!Ďªʵȯ\nȯǬ˘Ȁˈೢʵȯ\nȱૂʰ!൨ʰ\x00ʵȯ\nhˑ\x00	ʽӤʵȯ\nȱʰ!Ďªʵȯ\nȯǬ˘ȀˈŶ˧\x00˟	ʽ޷˂\rʴ\"ȬΟʵȯ\nȰȜʵȯ\nȰຌʺȰ֗ȯ\nȰߎȯ\nȷɛʵeʰ!࠲ȯ\nʰ	ʵʽڢʵȯ\nȯƯʻŐʵȯѵ˘ȢʺȯĽȯ\nȯċ˧\x00˟	ʽˏʵȯ\nȯħʰ!4ĕîʰ!\"Ȭˋʵȯ\nȯȻʰ!\"ĕĮ˘	ʻŐʵȯ\nȰŰ˘ʛʹĕfȯ\nȯºʻȯʷʵȯ\nȯċ˧\x00˟õʽޠʳޟ˘௖ʳȬփȯ\nʰ	ʵeʰ!ɤȯ\nȯƯʵʻŐʵȯ\nȰŰ˘ȢʺȯĽȯ\nȯċ˧\x00˟	ʽˏʵȯ\nȯħʰ!4ĕîʰ!\"Ȭˋʵȯ\nȯȻʰ!\"ĕĮ˘	ʻŐʵȯ\nȰŰ˘ʛʹĕfȯ\nȯºʻȯʷʵȯ\nȯċ˧\x00˟õʽ্ʺȯĽȯ\nȯċ˧\x00˟	ʽ੯˃˘ȀʹȬëȯ\nȯ¯ʿ˄˧\x00˟nʽ˅ɄʼÙʰ!۪ȯள˘ிʽˆ\rʻȱܣȯ\nʰhʵɸʹȬओʰ!Ȭণȯ\nȯݧʳȬ௘ʰ!\x00ʰֲҐ!Ȭȃ\"Ȭǌʰ!­ȯ\nȯJ˧\x00˟ತʰ\x00ȯ\nȯńhʵˑ\x00ॅȯ\nȯJ˧\x00˟୻ʰ!ȬҠʻࢣȯĴʰhʵ˧\x00˟nʯʹȬáȯ\nȯÌʿઔʹȬŝȯ\nȯŪʰ!!ȬК˧\x00˟ӯʹȬŝȯ\nȯŪʰ!!Ȭ͒˧\x00˟ӯʯʹȬáȯ\nȯÌʿˇ\rʹȬÌȯ\nȯJĆʰ!!Ȭࣜ˄ʹȬĸȯ\nȯࢤʰ!Ȭȑʵȯ˽˘੎ːݠʹȬáȯ\nȯŅˈ\x00˪ʳԄ˘Ўˇ	˪ˋ	˫˫~ˉ\x00ȯ\nȴԎʵӱ˘Ў7˨ʳԄ˘൲ʰ!Ȭ̱ʵȯ\nȶɛ˧\x00˟õ˪ʹȬŋȯ\nȯħʰ!!ĕîʻȺ๮ʵȯ\nȸඅʻȰӖʵȯ\nȵૼʰ!Ďªʵȯ\nȯृʻٶʻઅʴ̝!!Ȭֿȯ\nʰhʵ࢏ʰ!۱ʻȰӖȯ\nʰhʵȯ\nʰȯ\nʰ	ʵऱȯ\nȯʵ˧\x00˟nʹĐfȯ\nȯೌȟʰȯ\nʰ	ʵˤʸʰݳˈgʹĕfȯ\nȯº˩ł˫~ˊʾ\x00ȵಜʿ	ʳȬ೨ȯ\nȴࠠʵʿǪˋ˨ʹȬŋȯ\nȯħʰ!!ĕ̜ʳͣʸłʿȯ\nȯºʵ˩~ˌʹȬŋȯ\nȯħʰ!!ĕ̜ʳͣʸłʳȬ܎ȯ\nȳºʵ˧\x00˟nʹȬëȯ\nȯϭʳȬ٥ȯ\nȱȋʵʹȬëȯ\nȯϭʿȯ\nȯºʵ~ˍȯঊˋ	ʳȬളȯ\nȸԎʵʳȬ਻ʹȬÌȯ\nȯJ˘նʹȬáȯ\nȯतˋõʳȬಎȯ\nȳÌʵˋǪˎ˰\x00˱Ѝ%ʴ!\"Ȭߖ˰ȯ\nʰȯ¯ʵʵː˰\x00˱!\"Ȭࡨ˰ȯ\nʰȯ¯˘˰\x00˱	ʵ˰ȯ\nȯÚ˧˰\x00˟พ˰ȯ\nʰȯ¯˘˰\x00˱ࡸʰ!ࣆ˰ȯ\nʰ	ʵ˘˰\x00˱݋ॺ˰ȯ\nʰ	ʵʹȬë˰ȯ\nȯ¯ː˰\x00˱Ӏ˰ȯ\nȯʵ˧˰\x00˟nʹĐf˰ȯ\nȯɞʹȬë˰ȯ\nȯ¯ː˰\x00˱Ŷȟʰz೙ʰ!Ȭા˰ȯ\nȯâʵݼˏ\x00๺ʰ!\"Ȭ̿ȯ\nȯâʵʰ!\"ĐĮː\x00ː\x00Ѝ	\r\x00	Ȱŕȱஈ		ȯ,	ƅ\"	ധʰ!Ӄ	ʰȯ\nʰ	ʵˤ˘\x00Ӏʵȯ\nȯˏ\x00	ʹĐfȯ\nȯ੧ʵȯ\nȯáˎ\x00	ʹĕfȯ\nȯॠȯ\nʰ	ʵ˘\x00Ŷȟʰȯ\nʰ	ʵഄʳȬலʵȯ\nȯÚ˧\x00˟શˑ\x00߻ː\x00Oʰ!!Ȭףȯ\nȯâʵ୓˒\rʵȯ\nȯJĆʰ!!Ȭ෹>ߝʹȬసʰ!Ȭඋȯ\nȯݎʰ!Ȭȑʵȯৡ˧\x00˟ܟȯ\nȯÌʵ~˓\r\x00	Ćʰ!!Ȭੜ˄ʹȬĸȯ\nȯЮʳȬැȯ\nʰ	ʵՊʳȬ଻	ȯT˧\x00˟Ɓ˥\x00	˔\r\x00	\x00\n\x00ʹȬŋȯ\nȯáĆʰ!!ĕ঺7	ʹȬĸ		!4ĕÙȯ\nȯڳϡʰ!ĕĮ\nʰ!\x00ʰ\x00	ʴʻȰժ	!஠ȯ\nhʵऒ\nу	!ȬϾ	!ĕ܋ȯ\nȯ¯˘Ʃ\nу	!!ȬƤ	!!Ȭࡼԑݸʵȯ\nh˗	ˈƩ\n઀	!Ȭࠔȯ\nȯ¯˘	ʵȯ\nȯÚ˧\x00˟Ʃ\nȬฉʵȯ˽˧\x00˟Ʃ\nĎîʵȯ\nȯƯʰ!Ȭǌʵȯ\nȯ˧\x00˟nʹĐfȯ\nȯ̴˗	ˈۈ\nȬǌʵȯ\nȯ˧\x00˟nʹĐfȯ\nȯ̴˗ʰ!ȬњˈʹȬëȯ\nȯ¯˧\x00˟൮ȯ\nȯºʵ~˕\rʵȯ\nȯĆʰ!!Đî˄ʹȬĸȯ\nȯЮʰ!ĐĮʰ!Ȭȑʵȯ˽˧\x00˟ʰ!!Ȭ൬˧\x00˟̤ʵȯ\nȯƬ˖ȯ\nʰhʵஹ˧\x00˟nʰ!!ĕÙʹĕɸʰʯȯ\nȯۦʰOʰ!Ȭ֑ʵˤʹȬ؅˗ʰ!Ȭīʰ!Шȟʰzȯ\nʰ+ʸʵ~˘\x00\r	\x00\n»ʳໄʰ!4ȬؽʶȺك	ʰ5	\"ȵߗȯ\n		ʵ1	^\nˠ	ൎ\nrƟ\n.Ɵ		ˠ	\nQ෿ˮ]	\n˯]	\n˯y	\n\x00ȯ\n\n	ʵ1\n^˙ȬĹ˚ȬӪ˛Ȭ௚˜ȬƔ˝ȬØ˞Ȭź˟ˠlˡؼˢ\x00\r	\x00\n\x00\x00\x00\r	ĳ\n˯Sȯ,*ffɘKrƟ7ˮ]͟\nyrƞ7\r0\rrƟ7ˮ]\r\r͟\ny\r\rȯಈ\rȯ͒	਒	Öȯ,*ˣĞˣ\r\x00	5rƟ>˭]ӷrƞS		ȯ,	*ˣ	Ҽˤʏ>c¦˥\x00\r	ȯߐ	.ƞȯ}Ŝȯ[\x00ȯ	ȯ\n	Ǫ˦\x00\x00	\r\n\n.ƞȯ}Ŝȯ[\x00ȯ	ȯ\n\n	\nf¦\n!	\x00ˡȯ\n\n˧\x00\x00	\x00\n\r\x00\x00\r\x00\x00\x00\x00ȯඒʰ!֔\rʴʰ\"Ȱ׳\r!\"Ȭ౏\r!Ɲ\r!\"ȬÆȯĴʰhʵ˧\x00\x00	\x00\nˈʰ\"ȱਈ\r!\"Ȭћ\r!Ɲ\r!\"ȬÆȯĴʰhʵ˧\x00\x00	\x00\nʶ˘ขȯ\nʰ	ʵ୨ˡȯT˔Oʰ!\"ȬͺˡȯÖˡȯ,*ˡ!\"ʦ!\"ʥfߩˡȯT˕Oʰ!\"ȬͺˡȯÖˡȯ,*ˡ!\"ʦ!\"ʥfषʵȯ\nȯJȯT˓	ʹȬáȯ\nȯ௱ʵȯ\nȱʰ!\"Ďªʵȯ\nȯǬˈૠˉଉʵʰ!ȬΟʵʺȯϔȯ\nȷ৤ȯ\nȹ۹ȯT˧\x00˙Ɓ˥\x00	ʰ!Ȭњ˒Q˦\x00\x00ʨ਀ȯĴʰhʵˡȯT˧\x00˛ຓˡȯÖˡȯ,*ˡ!\"ʦ!\"ʥfՉȯĴʰhʵ˧\x00˛ඡ˖ೇȯ\nʰhʵ˧\x00˟عȟʰʰ!­˘ઃĆΊʰ!శʵ˥\x00	ȯ\nȯ˧\x00˟nʹĐfȯ\nȯɞ˦\x00\x00ʥࢂȯ\nʰ	ʵʰ!Ɲȟʰȯ\nʰ	ʵ˦\x00\x00ʦʰ!\"Ȭǌʵ˥\x00	ȯ\nȯ˧\x00˟nʹĐfȯ\nȯɞ˦\x00\x00ʥഛʰ\x00ʵ˥\x00	ȯ\n	ʰ!Ɲȟʰzȯ\nʰ+ʸʵ˦\x00\x00ʦஸG˚Z˥\x00	ȯŬffɘKrƟȯ࠴ˤ˯Q˒	˦\x00\x00ʧ۷G˚Zȯ\nʰ	ʵॐG˚Z˖ŶශĆΊʰ!ഌʰ|դG˚ZȯŬffɘKȯ\nʰ	ʵఃG˜ZʰȵƏȯĴʰ١ȯ\nʰ	ʵ˧\x00˜ࠌG˜\nZȯ\nȷϿʵ˧\x00˜ૌG˜Z˪ˢ\x00	ȯԶʵʰ!ȬӚˋ+˧\x00˟Ɓ˫೪G˝Zʵȯ\nȯǖ˧\x00˟ƁʹȬëȯ\nȯ¯˧\x00˟หȯܸʵ˧\x00˟௛A˞ZȯŬffƵȯ\nʰ	ʵȯT˧\x00˞Ɓ˥\x00	˦\x00\x00ʩŶ॑	ʰ!Ȭ̿ȯ\nȯâʵ˧\x00˟௳˨ˬȯ\n˯	˯.Ơ˯˩˯ˬȯൺ˪ˬȯ\nˮ	ˬȯ\n˯	ˮ.Ơˮ	˯ˮ˫˯ˬȯіˮˬȯஔˬ2˭.Ơˮ˭\x00˯˭\x00	͸>˧	\x00˟Ծʳڼʿ	຤˭\x00ª	\x00Åˠ\x00¿ˡюȧ%ʮ\x00ʯʮ2ʯื\x00VɆѾʯऽʮʯ_ࡊʮʯ Ȩʮ\x00ʯ\rʰʰʮ௪X\x00·ʱ\x00\x00r	\x00\nɆʱʮ˲ʯؾʯ%\x00ʱઊʮԝʯ\x00	ʯ#E	%ù?૟ɟڄ\n\r\x00	ʮ\x00ʰǆʯ	ʯʰ	*	ʱ1õ\x00ʮ\x00ʯ\x00ʰ\x00ʱ\x00ʲ\x00ʳ\r\x00ʴ\x00ʵ.ɰൾ		ʳ̆\x00ʵʴ\x00\nµ	\r\x00	\x00ʷ\x00ʸ\x00\n	lڀ	¤ਗ׺	¤൤ʴȨ\x00	ʷʴ·\x00ʸʴ\x00\nʸ\x00	´ʮ\x00	§ʰ\x00	ʯ\x00	½ʴr࠼ʴrf	¨ʷ	Éʷ	Iʹ1	xʹ%\x00\x00	\x00\n\x00l2ʷʷCʸ	ʷ\n.Ȫ	ऋ	*\nӬʹB	ʷ.Ȫ	Ş	*ʹBO\n\x00Eʶ\x00'ঋ҇ຩΡඃ0́ࠍ0Cٔ෭0Cj׏ౖ0Cj¹ߧࡇ0Cj¹|ԥঢ়0Cj¹|Ɖ૛೻0Cj¹|Ɖʈԃ\n\r\x00ʷ\x00ʸ\x00	\x00\n\x00ʹ\x00\x00\x00\r\x00ʺ\x00\x00I\x00ʷ´\x00ʸ\x00	§\x00\n½\x00ʹȧ̧	ï*ʻ	ӑ\rം	ɬଙ\r	ԝ\r֤ʺ.Ȫ2	ʺ·ɵ\x00ʺ¨ɵ\x00ʺÉʳ\x00\n	2׎೤෸ųʺ\x00ٌʺOSеï*ʺʽCʵC	ʾwCǆµ\rSï*ʻĞʻĆ	௵ʼ஀ʼ\r\x00	\x00\n˹		ï	*\n˲		\n෎	ਣ\n๼	௑\nի	ฌǨʽˀ\x00ˁ9x%\x00\x00	\x00\n\x00\x005ˀʞʹʹøˁCǋˁ֫2.Ȫˀ2	øˁՍǋˁܺӑ	ˀOS\nе\n	ï\n*\nʽ	\ngఢų\x00஬ްˀCລˀCʵˀCQʾˀwˀCǆ	|Ɖˀ7ʹV	ʹVңଜʾ\x00\x00	\x00\n\rˀ\x00\x00ˁ\x00˂\x00\x00˃\x00\r\x00˄\x00˅\x00ˆ\x00ˇ\x00ˈ\x00ˉ\x00ˊ\x00˄C\x00˅\njˆ\n¹ˇ\n0ˈ\nCˉʹˊ±ˀˀ	ˀX˄ˀWંຠ߆ഺˉˊˉˊദ\x00ˉˊ +चˉˊ࠳ܝˉˊज˄ˀ̺˂˄(ˀʸ˂˄ˀ\x00ˉˊ +ઝ୞ˉˊ ˅˄(ˀʿࡩˉˊ\r˄(ˀϖˀ#\r+വˉˊˉˊ܄˃˄(ˀˉˊ ˆ˃V˄(ˀҺߡӌ˄ˀƓ˂ʱ˄(ˀĈ˄ˀ˂\x00ˁˉˊΘ˂˄(ˀˁʳ+ܧˉˊࡆˉˊ ˇ˄(ˀʿؒ\r˄(ˀˀ \r+ૹˊǱˊ\x00ˉˊ ˁ˂dˉˉȱ؂ˉˊˁ˂ˊǱˊ\x00ˁˁ˂ˁˉˉȱଆఆ૙ˉˊ੷ർˁ˂ด͈˂˄(ˀˁˇˊǱˊ\x00ˁ˂dˉˉȱב೫\n؎ˀ	+ন˃˄(ˀˉˊ ˈ˃V˄(ˀҺຄ˂ˉˊˁˉˊőˉˊˁ˂ດ+࢙ԉ˂˄(ˀˁʺ+গˊ÷ˊ\x00ˁˁ˂ˁˉɐ೘ˉˊˉˊѿ\x00ˉˊ ˉˊ ˁ˂Ҟນˁˁ˂ˉˊ ˁ˫঵ˉˊˉˊԅ\x00ˉˊ +ຼˊ÷ˊ\x00ˁ˂dˉ؜ˉˊˉˊљ\x00ˉˊ +ցఏ৏ˉˊˁˉˊƍˁ)؞ˊǀˊ\x00ˁˁ˂ˁˉˉpˉȲӗ˂˄(ˀˁ˅ˉˊ\nු\nȠ\x00ˀ	+ඦ಻ˉˊ ʳ˄(ˀʿࡓˊ÷ˊ\x00ˉˊ ˁ˂dˉɐೲˉˊ ˄(ˀʕˉˊˉˊҁ\x00ˉˊ +றඥˊ÷ˊ\x00ˁˁ˂ˉˊ ˁˉɐ݀˂˄(ˀˉˊ ʽ˂\nݱˉˊˁ˂̵Йˉˊˉˊ +ග˄ˀ̺˂˄(ˀʷ˂˄ˀ\x00ˉˊ +ࣙˉˊˉˊʜ\x00ˉˊ +ܫˉˊˁˉˊƍˁʷ˄(ˀѬʿ\x00˄(ˀ˄(ˀ\r˄(ˀ˄(ˀˀӿ˅\x00\n	\n˘ˀ	ˀ#\r+؃ථˉˊˉˊĿ\x00ˉˊ +࣋˂˄(ˀˉˊĠ7ˀ#˂ɍˊ֟౅˂˄(ˀˉˊ7ˀ#˂ɍˊ଺\r˄(ˀˀ#\r+܃౜ˉˊˉˊƌ\x00ˉˊ +ݻˁˁ˂ˁ˫຃ˉˊ ʺ˄(ˀफˉˊˉˊघ\x00ˉˊ +೐ฬˉˊˁˉˊƍˁʱ˄(ˀѬ+ވ˄ˀΚ˂ʱ˄(ˀĈ˄ˀ˂\x00ˉˊˉˊ ˂Ү˃˄(ˀ˂˄(ˀˁˆ˃őˉˊˉˊ¡\x00ˉˊ +ଦˉˊˉˊɳ\x00ˉˊ +ظ\r˄(ˀˉƭˊM\r\x00ˊ	ˊ \r\x00ˉˊ ʶˁ˂ଝˊǱˊ\x00ˁˁ˂ˉˊ ˁˉˉۓˉˊˁˉˊˉˊ ˁЫතߔ஽ˊһˊ\x00ˉˊ ˁ˂dˉˉpˉĔˉʒˉ৊ج˂˄(ˀˉˊ˂఻ˊǢˊ\x00ˁˁ˂ˁˉˉpˉĔˉԨˉˊˉˊз\x00ˉˊ +ฏ଑ˉˊˉˊ๭\x00ˉˊ +؛˂˄(ˀˉˊˉˊ ˂ৈ\r˄(ˀˉƭˊM\r\x00ˊ	ˊ \r\x00ʶˁ˂ь˂˄(ˀˉˊĠˀ#˂௿୐৘ˊǢˊ\x00ˁˁ˂ˉˊ ˁˉˉpˉĔˉΠ׋˄ˀΚ˂ʷ˄(ˀĈ˄ˀ˂\x00ˉˊˉˊ ˂ৢ˃˄(ˀ˂˄(ˀˁˈ˃őˉˊ˂˄(ˀˁʲ˂\rˁ\r\"ɘ\r˄(ˀ໏ˀ\x00ˀ#\r+োˉˊˉˊѸ\x00ˉˊ +໅ˉˊˉˊޭ+সˊǢˊ\x00ˉˊ ˁ˂dˉˉpˉĔˉΠˉˊ຅ࡅ۾ܱˉˊˁ˂੪+௫ˉˊˁ˂ฒ+ܘˉˊˉˊஉ\x00ˉˊ ˊǢˊ\x00ˁ˂dˉˉpˉĔˉ࡙ࢳ౶ˉˊˉˊඕ\x00ˉˊ +௴˂˄(ˀ˂ۺˁ˂Ҟˉˊ ˁ˂৑๊ڞˊһˊ\x00ˁˁ˂ˉˊ ˁˉˉpˉĔˉʒˉࡘݫˉˊˉˊҀ\x00ˉˊ Ãഎ\r˄(ˀˉˊˀठ˃ˁ˂˃\x00ʾ\x00ˀ\x00ˀ\r\x00\nO\ṋˀ	֡ˀ#\rएˉˊˉˊļ\x00ˉˊ ͙ҷˊ\x00ˁˉ\x00˂ˊ+ۜ\r˄(ˀˊ \r\x00ˉƭˊ\x00ˊ\r	ˁ˂ޤˁ\x00೦דˁ˂ʕˊǀˊ\x00ˉˊ ˁ˂dˉˉpˉ඙܇ฎ਑ˁ˂രڅ֧௯ˉˊˉˊ ˉˊˉˊై\x00ˉˊ ͙ࣛബ˂˄(ˀˉˊ ˂೮ˉˊˁ˂Ǐ+࠘ˉˊˉˊ๩\x00ˉˊ ˊǀˊ\x00ˁˁ˂ˉˊ ˁˉˉpˉȲசఱˁ˂ඬӆ˂˄(ˀˁˉˊߙ˄ˀƓ˂ʷ˄(ˀĈ˄ˀ˂\x00ˁˉˊőˊǀˊ\x00ˁ˂dˉˉpˉȲද˄(ˀʕˉˊˁ˂\x00ˉˊ gʹVˉµ%˄(ˀണӌ˄ˀƓ˂ʱ˄(ˀĈ˄ˀ˂\x00ˁˉˊΘ˂˄(ˀˁʳ+͈˂˄(ˀˁˇ˂ˉˊˁˉˊઑԉ˂˄(ˀˁʺ+ӗ˂˄(ˀˁ˅+Ү˃˄(ˀ˂˄(ˀˁˆ˃ő˃˄(ˀ˂˄(ˀˁˈ˃ҷˊ\x00ˁˉ\x00˂ˊ+ӆ˂˄(ˀˁˉˊő˄ˀƓ˂ʷ˄(ˀĈ˄ˀ˂\x00ˁˉˊҼʿ\x00\x00	\x00\n\x00\x00\x00\r\x00\r\x00\n 	\x00	 ȹʾ\x00\x00#\x00½\r\x00ʾ\x00\x00	\x00୸Ɖ|຀#	\x00ʾ\x00\x00\n\x00	ഀය\x00ȠషöҔz¾d¾@Ȭ๟ȬۑȬયȬಷȬإxȬऺȬࠈȬ६ȬֺZ	x\r\x00	ŇȯĚŗʾȯ,͊tȯ\nǯ	ùt¾#ȯͿ	ȯǦȬԌZĵ	ȯϓȬھ%\x00\x00	\x00\n\x00\x00\x00\r	ùt\x00\nù_\x00ȯπ	ȯ\nȬ๿	ȯƊȬͥȬs$Ȭɮ*	ȯܦ	зȬԌZĵ	ȯϓȬ൱	ĵ			ȯ\nɸȰଐLȬൠȬ୧	ȯഈLȬखZ		\nȯT.ȪLȬഊŭ\r\nß\rRȬ§ȬI\rRȬȬI\rRȬȬI \r$Ȭͮ	\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00ȯƽù_\x00ȰC\n0Cj\r¹͇FȬ෩*GȬਔMȬӐMȬ๎MȬय़MȬϧƻൿRȬൢ/\nkȬ౑\nRȬțFȬԖ/$߾$\r+FȬฦ\rFȬݦ/$Ԟ$\rԞ$\r+FȬต\rK	/ܜxɸdȬ๚\r\x00\r\x00/kȬڻRȬ\n\x00\n	ًǷ\nǐೆğǐ୹ʌǐةॉ\rǐ஭Ǹ୾÷ʮ\rʯ\x00ʰ\x00ʱ\x00ʲ\x00ʳ\x00ʴ\x00ʵ\x00ৣʯʮȰהʰʮȯʠʱʮȯ઱ʲʮȶைʳʮȲ໓ʴʮȰࢺʮȻଘʮȻ൵ʮȸฝcʵ੅ȬஏʮȯਫʮȥʾȲќʰ	!ɘʮȯŖඞ	cīʮ\x00ȻՕgʊ\nx\nĀÄʵ¾ຢ\nȯȰแ\x00\nȯȰ˞\rxʶˁ\x00˂\x00˃\x00˄\x00˅\x00\rˆ\x00\x00	\x00\n\x00\x00ˆฮ˄˄͹˄Ÿˆ©ʷˁ\x00˂	ˆʸˁ\x00˂	ˆÀʹˁ\x00˂	ˆÁʺˁ\x00˂	ˆ¥ʻˁ\x00˂	ʼȯˆ\x00ˁ\x00˂ң˂!ɘඟNʴNˆɘˆई˄ߦˆÄȹਦɦ\r\x00Ȭउˆ\x00	2\nˆӄ>ӵ৔љɘ	ѳ	ॳɘΨ	ހ	>	ԅ\n7\n	ݕ!ɘN˅ɘ˅ࣳˆȰǼˁ\x00ງ˃ȯĤ˃\x00κ\rʶȯˆ\x00ˁ\x00˂\x00˃\x00˄\x00˅ʷ\x00ӝ!ɘ>ʰʽʰ\x00\x00ʄʾ\x00ʰ½	Éʸ\x00'ʳ̶!ɘ>ʳȱƋ\x00ʄʳȱ˼½	Éʹ\x00\r	5ʲʀ	ʿ!ɘ>ʲ	V˒ʲ	V̠\nÉʺ\x00'ʱ̶!ɘ>ʱȱƋ\x00ʄʱȱ˼½	Éʻ\x00\r	»Ʉ૝	ˀȯʇȯদ	ȳ࠵	ȯƑȸ೉ȹآ!ɘʞ	ȯ<\x00		ȹऑ৪	ȱËD	ȯ6Ԣ\nÉʼˁ\x00˂\r˃\x00\x00˃ؑʴ7­ʴȯȇȯࣲ	ȯѶ\n\x00ȸௗ\x00˂!ɘȰȖȰȖ\r૩	ʢ\nʢ\r\x00	ȯ˧Ȱˀ	ȵЩȯ٦ȯߜ\r\x00	\x00\n\x00ȯ˧ȰˀȲϋȲ¿ȯा	ȲВȯˀȻɊ\n	ȲÇȯʖ\nȵ݃ˁೄ˂ຆȰິ\r\r\x00	\x00\n\x00˄ȯ˧ȰฐȲϋȲ¿ȯ൚˃ɘɅ	ȲВȯఅ\n	ȲÇȯʖ˄\nȰǿˁ	˄ȰȖ	Ȱࡕ˄Ȱ๕ɘ˃ɘ˃˄Ȱೣȸ਷ʽ\x00\x00	\r\n\x00\x00\x00\r	ʮȲͶ	OɄiȯ\x00ȯıȯսȬǰɄiȯ\x00ȯॗ\nɄiȯ\x00ȯıȯÚ\nȬɖ\nɄiȯ\x00ȯࡥɄiȯ\x00ȯТ\nܓ\rɹȯw\n	!Ȭɖ\rɹȯ\x00ы\nଢ଼ȯıȯÐ	\rȯıȯÐ	E࠙ȯıȯÐ	ʾ\x00\r	\x00\n\x00\x00Ž!ȯ੗	ȯYɄȯ\x00ɬȶৃ\n\nȯ,\nX\nЯɄȯޓɩȯǝȯ֨Ʉiȯ\x00	ٱʮȵவɩȯ\x00	ȯTȯ٘ʿɢȯʮȯǵȰ̔ɬȹ୑ˀ\x00\x00	\r\n!ɘʯȰz\nʯȰ+\nʯȯ¿	\nȯƑȰͯȰ-\nȯƑȸܗȴɰ\nȯޮQ	ʯȯǾȯƢ\nʚ\nʰʽʰ\x00Ȳќʮȯ୷ʮȯŖʰ\x00\x00	\x00\nʶȯҪ\x00ɘ\x00\x00ɘ\x00	\x00\n\r\x00ʶȯҪ\x00\x00ɘҫo3øϺȯࣝùϺú\rൃcĀg]ࡰʤȲඊએȱঢg]ມù]୯࠺iग़g]บ}र]ڝû%\x00Sϕy̽}բcࠓiÖϕ]̽g]ׁݖjȯ,͊jľUʡĬɞĆȰǭĂɄȸĂɈɊɄڴɸȰฅɬɡĂɤÈɶ¼Ɋ;ɮ:ĂUɕPɄǰɣ¶ɷ	ɄກȬӪȬʈȬڬĂɠɚɄٯɫȯͽĂɮNɄۢɄȃɻ:ā̛̛պɄ௲ʓæɮೕɄԔɵȱҋɩɶĂɄͱɥɄʃɵȰಪɄ೒̛ຶĂɋɰĉȊĂѧɄ୤ɄഒɩŻɄގɄȮɸȺ̚ĂɫɄŧɄÎɵ۬ĂɇɈĈȊĂāŷʡæɌ಑ĂɤNɄ਩ɓŻɮɵ\nôĂɍɈɵ ñɉĆȰƹĂɥŠɄ੉ɇɉ:ʠæĂɄȃɰɄ॒ĂɌɹ	ƞȯȯƶøɶɎɰຣɄцɣȯທĂɄઢɝɆ௬ćȊɓɸȯতɄȮȯǩĂɫ;ɆɻɻɵĆȰɺɼɵȶ஡ɨÎɑɷ÷ɵ:ĂɻɄĶɧɵȯȰʝæɵ\róɯɫȯ๲Ă/ɄԲɄՇɛɖɢɦĂɻɄŧʜȧɭȯǔʞæĂɋɇɄ̅ɹĂɍ@ɯĂɊɛʖ¢āƆĂɄܚɆɦɵȱ҈ɍ׹ɣɵȰЭĂɄಥɡɜౣʒæɵƕɴĆȰǭĂɑɨýɩ:	ɄҦɤȯȯɦɵîɖɄŧ	ƠȯҒ}ú	ɚɷȯȯɦɄʃĆȰƹ\rʁ2ʂ2ʃ2ʄ2ʅ2ʆÎĂāɱʉÎĂɭ;ɢɉĆȰʮĂUɩNɆ@ɰɻāʻĂɧɄίɋý:ĂUɑŠɹ@ɕƛɄƟĂɥ;ɤĂɬ@ɖɋĆȰʮɫɖýɫȰܴĂɌ@ɱɄҎɫȲډɵðÿȬŕȬݨȬЪȬΛ	ʇɄȯȶനɜɹɄՃɣȰࢅĂāʨĂɷ@üĂɺɬNɅɄȭĂɄڷɠɐɫɈȯǔýĆȰɺʐæĂɄमɄܶɤɑ:ɄٴGʫ஘Ȭ౼Ȭ࣊ȬܒȬඌȬ୉ȬഃȬֹȬੀȬעȬړȬ๦đ௹ȬผȬࠜȬՁȬࢲȬාȬຸȬمȬ܉ȬਛĢබȬ۔ȬฤȬ߯ȬࣖȬךȬતȬبȬ׉Ȭ֍ȬෘȬबȬ৮ɶɸȰ͠ɷ׀̛೛ɩɫȰܼĂɺNɄשɓɮ:Ăɢ@ɐɇ੖ĂāϴĂā৶ĂUɗPɗɌ¶ɅĂɫɮĂāژþɵȰϧɽɵȸଫɾɫȻܳɄƞɫȯ˿ɄƞɑɵǶĂUɫŠə@Ʉ਎ɷɵòĂɠNɦɻŻü	ƟȯȯƶùĂəɍɕɣĂ/ɎPɄࢰɄୂɞɭɵȯџɌȯéɝȯʂɥĆȰࡗĂ/ɭNɄीɷɶɑɵȷѐɄӥĆȰżɳȯéɍȯéĂɷɯɖ՗ʟæĂɄফɢÈɗɞ:ĂɩPɄୡɴ;ɱ:ØBĂɬɣɡɄŧĂɄ޲ɄtɥɵȺ૴Ʉਫ਼ɓĂɟɄÜɄঈɅ	ʛɤȯȯɦ	ɐȪȯȯͭĂ/ɠPɥɦɄʧɄ͕ɫȱͲĂɝɄ×ɸะȩ௾Ȫ২Ăɜ@ɍĂ/ɷPý;ɋƛɈɄҦĆȰǚĂɠNɇÈɡɸ:ɶĆȰÍĂɯ¼ɧ¼ɆɄեɄȠȬʽĂɓɐĊȊ̛ú\rõ໕ȭ\x00Ȭ\x00Ȯ\x00ɒ࣑ɄāҿĪɄලɄๅĂɄʑɷĂɄΦɝā˳ɵɄĭɕĆȰƥɫĆȰƹĂ/ɤčɭɌƛɛĂ/Ʉ๶ɍ@ɺŻɡĂāĥ	ɝɵȯ̓ȯȰɄƞɳĂɚÈɍ@ɳŻɛəɸȯ˨ɄࡈɫȰʫɱɫȰܙĂɩüŮȯ౪öBĂɱ@Ʉ͵̛ևɤධĂɱȯƟĂɄۘɇĂɄҚɭNɺɲ:ĂɎɄʧ	ʚʘȰʩȯֶĂUɑÈɥ@ɈɣĂUɭPɄߪɌ¶ɑĂɄΦɄ̑Ʉ·ɫȯदĂā͍ɺ಼ʥ­ʦȬuʧȬ-ʨȬYʩȬçĂɴ;ɄϣɛɵȰಕĂɄίɭPɡɄ͋ɵíĂUɕPɇɛɆɲȯĒĂɑ¼ɄʑɄݯɓĂɤ@ɩɟূʕÎĂUɺŠɈɇɇÚBɄ؝ɣȯۚ	ɄѯɽɽȰ̚ɇĆȰǚɅÎĂāɈĂāǉʭੑȬYȬYȬYȬYȬલȬદȬ໐Ȭ¸Ȭ¸Ȭ¸Ȭ¸Ȭ¸Ȭ¸Ȭ¸Ȭ¸Ȭ¸Ȭ੺Ȭ`Ȭ`Ȭ`Ȭ`Ȭ`Ȭ`Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-ȬޜȬΗȬ`Ȭ`Ȭ`Ȭ`Ȭ`Ȭ`Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭ-Ȭೝ̛੡Ʉ͚ɫȰ۫Ʉӥɵȱ΢Ʉ׵ɞɻəɛɄ˰ɏ̛פɻɸȰ˨ĂɑɄǩȫȩ࡛ɫɟȯʫɥȯȨ	ʙQȯāȯǗɄ˰ɫȻͽĂɌɛPɦɌ:ɿɇɄചȬþü଱Ăɚ@ɕɳࢴĂѧɝPɇɄ൥ɟɴɵȲͲɬɵȶΈĂɱ;ɹÙB%ʬȬఔȬ෵Ȭ˭ȬվȬણȬ๖ȬॖȬ֛ȬࢨȬؚȬউȬ߮Ȭ׽Ȭ̯ȬਥȬ୽Ȭ؁Ʉ൑ɸȸ޽ɲՑɖĆȰʮ{ʪȸjȷŁȶǃȸŔȷȕȳ˭ȹːȸˆȹ¹ȴЀȶǑȳЁȴЁȻœȻʪȳ͖ȶyȸǒȺƲȵƔȻқȷǒȷôȹ|ȵƿȹ˶ȴɁȵǒȻ˗ȺǑȶơȶôȸξȸญȺȓȸ0ȸТȳĹȻyȴ|ȵɰȹ-ȶ˝ȶʇȸďȺƉȷ˻ȶӏȷ|ȷ˗Ⱥɔȸɋȹ̯Ⱥ|ȸ˶ȵɋȴǑȷſȵ˭ȷ˨ɵ	ï	ƠȯҒUûĂɲNɤŠɥ@ɹ:ɢɫȯආɹɄ)ų\x00ȶ\x00Ȱ\x00ɣ\x00ȹ\x00ɘ\x00ȸ\x00ȱ\x00ɬ\x00Ȳ\x00ȳ\x00ȵ\x00Ȭ\x00ɵ\x00ȯ\x00Ⱥ\x00ɸ\x00ɰ\x00ű\x00ɤ\x00Ɗ\x00ĥ\x00ė\x00Ƃ\x00Ɖ\x00ż\x00ī\x00ȷ\x00ɦ\x00ȴ\x00Ȼ\x00Ī\x00t\x00Ə\x00Ï\x00&\x00ü\x00þ\x00Ƈ\x00Ű\x00Ì\x00ɇ\x00ã\x00\x00ź\x00ɷ\x00Í\x00ɭ\x00Ƒ\x00ř\x00Ÿ\x00ɧ\x00ŏ\x00ɽ\x00Õ\x00Ƅ\x00Ý\x00Ɔ\x00Î\x00Ŵ\x00ŵ\x00Ó\x00Ś\x00ŀ\x00È\x00Ū\x004\x00×\x00Ő\x00Ð\x00R\x00v\x00Ñ\x00Ŝ\x00Ö\x00ƅ\x00á\x00ĕ\x00ũ\x00:\x00Ô\x00o\x00Ş\x00Ɇ\x00ħ\x00ĳ\x00Ɣ\x00\x00¼\x00Ž\x00ƀ\x00U\x00\x00é\x00>\x00V\x00m\x00E\x00=\x00Ģ\x00¨\x00p\x00M\x00Ã\x00§\x00N\x00Ğ\x00 \x000\x00+\x00»\x00Ę\x00Û\x00à\x00Ŗ\x00\x00œ\x00Þ\x00\x00\x00Ò\x00¯\x00ß\x00Ķ\x00\r\x00Ų\x00\x00ł\x00å\x00ō\x00ɓ\x00Ü\x00\x00ê\x00ë\x00â\x00ś\x00æ\x00ķ\x00è\x00ĵ\x00ç\x00ì\x00ä\x003\x00 \x00?\x00¥\x00X\x00\x00\x00Ë\x00S\x00\x00Ê\x00^\x00k\x00Á\x00n\x00\x00d\x00{\x00~\x00*\x00P\x00f\x00\x00@\x00.\x00(\x00Z\x002\x00T\x00I\x00ª\x00¤\x00\x00À\x00r\x00W\x00|\x00¸\x00%\x00H\x00Æ\x00\x00²\x00<\x00\x00£\x00h\x00g\x00\\\x00\x00\x00z\x00\x00É\x00Ĝ\x00\x00#\x00u\x00\"\x00e\x00ģ\x00x\x006\x001\x00¾\x00a\x00đ\x00\x00y\x00\x00\x00\x00¦\x00)\x00©\x00¢\x00c\x00\x00Â\x00`\x00G\x00[\x00°\x00_\x00,\x008\x00¿\x00\x00\x00Å\x00\x00\x00¬\x00i\x00µ\x00±\x00\x00Y\x00C\x00\x00º\x00'\x00\x00Ď\x00ġ\x00\x00ď\x00Ġ\x007\x00¹\x005\x00Đ\x009\x00K\x00ę\x00¶\x00\x00\x00b\x00·\x00\x00½\x00A\x00!\x00®\x00\x00\n\x00}\x00\x00Ȫ\x00\x00´\x00\x00\x00\x00³\x00;\x00F\x00\x00q\x00\x00j\x00$\x00\x00\x00Ä\x00\x00Ĕ\x00L\x00¡\x00\x00­\x00\x00\x00]\x00D\x00Ç\x00s\x00J\x00\x00B\x00l\x00\x00«\x00/\x00\x00\x00\x00-\x00w\x00OɬĆȰяɹɫȰ̼	ʘ	ȯāȯǗ̛໇Ăā϶Ă/ɄൗɯɄہɜĂɲPɄܾɄʑɄ͋	Ʉ̅Ȫȯȯ้ɄцɉʑȿĂɄࣔɕɗ૰ɕفɺȯéĂɳ;ɗɡĆȰÍɎЖɺȯɒĂɶ@ɄĶʔɘɊɵȷࣟĂ/ɍÈɵɄવɳ0/12̛̠34̖̗̘̙̚ #$%&'()*+,-.̂̃̄̅̆̇̈̉̊̋̌̍̎̏̐̑̒̓̔̕L\nī	ǯ\nǳǽƘ\rƙƭƮ˳ɝ˴ɡ˵ɤ˶ɫ˷Ŕ˸Ř˹Ŝ˺ş˻,˼ɑ˽ɓɕľ˾ʘ˿»ǐűŹŻſŦɈ0ʣʥ ʧʋ͹ɲĘēɹ°ĽȚ°ĭǄ÷Âŕư ŻıƴǛŞĀȗɉȼĥŎǬ6ū,°J°ǭ°ȊţªEųM9Ɣ¹ïą°ɳǠêƃÎƱ®ƹÃRǕĎ®oąĂĤąƗ°ȴǠ3Đ°ɚɩ1ɬ{ėɩƜüĄŲuě±Ūs\x00ƨȄ°ŧĖŰƝȽǠdéèǏ°ʃɅǖǠ4çȭąŁȺɒǏ°ƥÛȇÕNǪ°Pzą°ɏ®Ǻ~³žľȎbɻǃɆƫțŉȯɜǠŃȔĒǠpé¥ŌƤǵǦȾȞąśɡąF°ɾƾ°ƛ°ƣąð°Ȱ°ȅ°ǌʆ°ŴŋÕȔőƱ¾Ɉĸč*ǋßǻɥùȟåɞfĲþ°°ĠGǊ«ĪÆğɟż¨°lƺƠƈ°°%°°°ĴŒŊȬħìÿmɌ}Ú]Ȍȯŵąk	ɼ°&´°ŐõɱUaØ°°|°°əĳOÌY¯¤Aú¸° ƒ2Ěǂ°ƯǟǉÑ°ſą§ƊąÅŹƾ°Cƶƪ®ł¡é½ƻǠÀƕɍñ°ŅŽƷ!TǠɨǕȡǠéȏÙǥȆǠľ°ôǝƸŮĨ®ƦĢée°ċàɣǒǖąȹƽǠȩéǏŭŜȦɠSƇʇȯhóãũÍ°ġɓǼ_Ǚɘ?ăƮŬ>ɖǍɗĩǧ8ŏǓjɂǣĞɭǡǸȜşʀǁræýȍ)ɋƁö°Ǟ=ǆÐ°Č\n°ǨBȫ°Ȥ°ɺň[ȋäǚƂąÙȆȯąÝǗɰ~ʄ°ƿź°ɑąĝȁǘĜʉņɽ°°ȿĺ°ȑ¿°°ȲąŨ°ƬȱąƾŔȱąƾ²Ƙąî°ǲą°»ȝ°ŚÓ@ȓ¢ąƀ°P¼Ǡ°ǜǠøéǮPĈ\rȖń¶ʆ°ŗʆ°âǠĊĶZ°ǅ°°ƌëąɝƾ°gtȷǩ#ȐǝƞŢ®ȔÁǐƢɸįƲ×ɪɴŦǿòĹǠćąřǜƱōɮȣąÜ*ƖÜnąǈɎǤ+ƾ°Ȁzą.Ô°ȘɤůƉKǠȘé°Éɼ°£\\Ɵ`µɇɧǎƙąĕɫɔŀǠȒǱ°Öą°­ǠǷéƐąƚƾ°Ȯ\"ąiƩąƾǫȸȻȕºĔơąvȨąę-ǀāķǑȈHc°ÊÞƍǾąǕǳŠǠ¦Ĭ'ƳȳȃÇǯƅǢí°ģą°ë®û°ŤĮ®ʊ°ȶɁɊ°é°ŷȢ°Ƶș:ÒǇ°ƼyĉȪɶǠqéĻĵ¬àÈȯ5ɵQ°ƄVą(°Ŷ°œą7ɃǠĿéƑ°ŸȦÏɐȠáŇƧËLɩɬƏȥļȂɩť°ɦǰȧ°ĦšƓǔƆİʁŝD°xǽǴȉWɄąɕ·àƭɀɛ®ɢIçŘ/ʂw;ʅɿ©ëɯ0Äą°<°īƎƋX°^°ĆűȘǹɷɃƱƽ®ǶéÜ°ÙđȯȽǠŖ°ď$ʈȵ°Ž3̖ȯÊ̂\x00Ĭɣ\x00Ȱ࢕̀%\x00\x00	\x00\n\x00̃̖ȯâׅFȬ૆ӷ\"Ȭ්̃̖ȯâ઼Ȭ࢔\"Ȭර̃̖ȯâķ	̃̖ȯâˊ	LȬĐȬഢ\"Ȭں̃̖ȯâķ	̃̖ȯâķ\n̃̖ȯâˊ	LȬĐ\nLȬǜȬĐȬ؈\"Ȭ࣒̃̖ȯâķ	̃̖ȯâķ\n̃̖ȯâķ̃̖ȯâˊ	LȬĐ\nLȬǜȬĐLȬǜȬǜȬĐȬި́\r̖ȰȞ̂\x00	̂#E!%\x00\x00	\x00\n\x00\x00\x00\r̀\r.ȪŞ*ŃȬਆ̙̀ફȬ-	$Ȭɋ\n̀	ൕ\r̅\nʝ	Ȭ௩́\n	̅ȯ\n	\r+	Ҿ\r̄\nʝ	Ȭ´\rɔ\nʝ	Ȭǥ\rʗȯǸ\nȯఀ	Ȭʭ\r̘\n೟\r\"Ȁ\x00ȯχ̛ʓ̤ʋʝȲїƿ\r̖ɩȯ̖ǝ̖ȯ෧ʟȴԍǘɄ҅'NʟȵҘǰ\r̃ȯ<Ȱė̛ò̖\x00ȰӠ	̠Ý̃\x00*0*Í1#NΧ̄̛Ӊ$̖ɩȯ̖w#̖Ȱໃ̗ॲɄH\\ɔɲ̘$Ē1Ʉͱɛʟȸ˥Ǣ̗Ʉo̗{̠ే̖\x00$Ʌ)10ਬʟȹҘǔ#ɵȰԟʟȴఴǱ̘#ȯąʟȵࣧǫ0˳̛ഡ$ͧ$ȯʔ ɵƙʞȸؐǄȴ#͗8#ȯϼʠȰǙȁ+̛థ1/$Ȱŗȶஷ#äȳ-%ê#̛å10ੴࢍMȬ`1ȬͩȬY'K,ϸ	#ɣȯ¿ȯ෢	&Ȋ̖\x00ȯƕ̛ࢩɅ)0ˢ	̖ȯ<Ȱӏ#Ƀ#ͪ	&ŝ%\x00ȯĄ8̗)ɄǤ%\x00&wȬɟ$Ɩ#̃ʆʠȰƳȃ#ʕȯ,̙ĥȰƄɄģ̙1Ʉ̲ɲɄݜɬɁ#ą̖Ʉo̖Ʌ)˹ú1ɫ@ɜ&Ȭଡ଼̛ܿ#\x00Ʉo$D:ɔ#ÛɅ)˳Ʌ)\r10ٟʟȸܵǩ#Ʉo#1Ʉ଒ɝɄHYɔշ#8Ȭǩ10Ɉ1UɗʗɄϘɝɴ	̠Ԭ̃\x00ĥȰઁɿ̛	1̖̖ȯԒ10ڨ#	ɣȲϥ̛ě̖:̌̍̎#ŀ̘ʑƗ$ƌ'10֢1ɺ;Ʉࢶ#ŝ̖0ȯÚ$2%̛̒1ɎE4(E('Ēɦň1UɌPɲɖ¶ɣà%#$%ü#X̖#Ǐ̗%ǎ̖Ʉ¤̖10ઋ10ח	8̖ȯ΂̖ȲϳɅ)\nɒɔ1UɳPɗɺɍ	)ɄǤ%\x00&ࢹ10ढ	̛ƚ̖\x00̘\x00̙ă8Ʉo̘̔1Ʉ್ɝ$#ɸȯí#&ǯ0ۮɅ)˼#ঌʟȷƃǕʟȵഁǤ1$ȯƪ1Ʉೊ$ʎȯ̃\rɵȱӭ̖d#\x00$\x00&Ʌ)ʝȲ˥ƾ10ෂʝȲϠƼ	%ɹȯ%ň0ରʝȹ಩Ƹ$̗Û1#ʗఙʖv̖R©MȬſ1Õ'K@\x00,\rÅʟȷधǧ0߃10׸10ٓ	̖ȯ<̗\x00̘10ෟ1#$10ದ1̖̗q	̖̘Ʉo̙1%1ʢ̖ʟȶ̰Ǘ1Ʉօ%0̛ȳ#ìʎ$ȯѲ'ȯ\nɄ\\ȯ&๵ʟȰŮǥ&!BɎĿB	$ȰC%ȯ൫̖R©MȬ|1Õ'K@\x007\x00,Å	%!#!10ง1ɥ@ɄĶ1ɐ!Ȫȯȯͭ$Ʉ¤̖ȯ6ȯۂ1'ȯΏ%Ɩ̖ň8ʕм#ʟȴ࢒ǝ#̗Ȳ#ĭ¨$ȯ\n̛డĪ#άȱƿū#C%ປ&$ȯ\n#ॹ1ɵȰȴ1ǳ̖ʟȹӰǨ̃ȯͼ\rɵȯԜɵȯӮǲ̗̘ĥBʞȵॼǌ	#̛ൻ̛ర̖:#ʞȲїǈ1'1ɵȲੇ10ɶ10ࢉĪʝȰƼƮ	$̖ȱ৽̗q	1#!Ȭç#ȯÊ̖Ʉν#ĭ#ŲȬҲ\r1Ʉ=ȯ̛ò̃\x00Ȱ൯ʟȹʔǜ1ɑNɄԸɝ@Ʉޱ10ܞ10ږ1#Ѻ#!AȬČ$ȯ\n#ê	̃ɣȯ¿ȯɟ\r̖%©@\x007Å$ȯ\nȯż1ɜ¼ɬɺɌȯ#Ē'mɄǤ%ӕ*1$;$!$!GȬç̗ĥȰƄɄģ̗ʞȳ޼ǉ10ృ1ʏ0ʻ$̖1/ɑഅɄ౞Ʉձɖ̏̐̑͑$$Ȭૺ%$ȬރȬȚ1%!ࣕʟȺӰǖ̖ȯÇ̗ʡȰƼȉ10ಗ1ɕɲ\r8#D!ɘ#D̗ɄƙȬuɄ଄	1̖ɘ̖ౝʞȵˁǄ10ท0͞1ɅɬɑɄʟ10އ̘Ʉo̘'ȯ͏Ǯ̖\x00̗୕ǲ̗̛ę̃ߒ10ວʟȺ˞Ǳ#$̖ȯ̖ȯǻȬì&#Ȭt1ɬɄϘɌ¶Ʌ̒Ʌ)0ɵ	̖ȯ<̘\x00̙0Ɔ¨$ȯΎƭɹȯ%D\x00ȯݙȯ߱&ҙ1#ʟȺԍǢ	̖͑̗P̖୔̗:8$Ȱʣ10भ	8Ʉ઻ȯɵ\x00̖	ɵȰਢȯગ̖1ɝ@ɫ%#ɸȯí#&ຒ\r#ȯ˦$̖ȯ6#10೹̠úà$$ȭï$ఁ#)ȭƭ$\x00$෕̘̛ņ̘1Ʉݓɛʟȸ෫Ǫ$#ȯʫ10ۅɅ)̖R©MȬY1Õ'K@\x007\x00,ÅʟȹܢǣȺ#ǩ10ำ	$ɄǤ%ӕ5Ʌ)ʝȰƳƺ10ĥ1/ɕʗɕɌƛɄĶ\r1$ȱͶ$ȯณȯÜ	$ŝ̘\x00ȯ̈%̗оà%%Ȭì%ü#X̖#Ǐ̗%ǎ1ƴ̖]Ȁ̖\x00̘]̙̗Ʉo̗\r̃ȯ<ơ̇͐ò̖\x00ȯ୅	1%!Ȭt1ɳ;ɭ;à$#$F̖$Xʕ$๏$ݛ$ʕȯš$A#$ࡖ%Ʉ௠ɓȒȬઌ$&ʕ$qʕ$ʕ%qʕ%&^1#ȯֽ1ʎ̛ӳ$ê%#$q¨ʋȱ๨ȱɲʋȲȘȱބʋȱોȯࢵ%ʋɘ^ʞȰǙǃɵʗ̗ȯāȱ೺$#ೈ0୬ʠȰŮȄʝȲˁƽ10ా8̘Ʌ)ʞȺϚǊ1Ɍ;ɄʂɅ)8ƐƓ$	#ȯົ1UɄࡴ	1$!%DȾ#éɄHoɔݗʟȳѶǡ\r1̗#Ɣ̗\x00̘Ʌ)˷ʞȲИǈ̂̖ȯϼǯɵ\x00̗ȭċ̖1ʓ̖qʞȶࢆǄɄHÆɔĭȶ#ʂ̕Ж	̈̉̊̋1ɕ;Ʉ͗'ŀ%$̖ȯ,)&Û\r̃ȯ<ȰĹ̛ò̖\x00Ȱ੼10ર8̂ɵȱӭ̖d#\x00$ō'Ȭċ̖	%D#D8ɵȯȇ̖\x00̗\x00̘\r1ɵȰ౩Ʉ¬ɄÂȬȚ	̙ɹȯ̙ň	$ȯ\n#0ȯĄɄڜ10੻\r#ɄȯɣȯЄȯż̇ʟȴ̰ǚ10ط	1UɄ¬ɄÂȬȚʟȸƶǟ10ਚ	ɣȯǾȰŤ̃̘#ɄҜȯÐűȬҽȿ#ČɅ)˺1ɄʉȬs	1Ʉ¬ɄÂȬìʟȹЬǞ1̖Χ	#̖ȯ6̗Ȱ#Û	̛ƚ̖\x00̗\x00̘ă#ŲȬƥ\r̃ȯ<ȯyƑ%D:̘#ȯÜ̖R©MȬź1Õ'K@	\x007\n\x00,Å8Ȭʽ	1ĺ̖\x00ȯૅɄH[ɔtȹ#ȨɅ)1#ੁ̖Ȼ੶ɣ୘ǵ̗ɄH»ɔͪ-1%̖0P̂ߌ̛ò̖\x00Ȱ՝ȳน%N%!Ґ%!!ȬĬ%!!Ȭึ̂ȱەɄʉȬػ\x00#̖̛Ҹ̖̛स(ʞȲˁǅʞȰƳǁ̖ȲΆ̗ă0੔ʝȱũƯɂ#þɅ)0ଌ10૷10ɱ1ɧPɕ@ɑ¶ɬ10ຍʝȹ˞ƻ#1ɌɲɄѝɲ1#֮	ƗɣȯӼ\"̖Ő̖1ɴPɥčɭɧ:̘ȯÊ̗ߍȵ#ǔʞȹŖǌ'Î10࢖1̘8ɵȰƣ̖\x00̗\x00̘Ʌ) 1-0ɗ(Ɏ1ɄԡɛɄHeɔα&̖R©MȬ¸1Õ'K@\x00,Å̖̖ȰӸ1̖\"ȯɏ	īɣ\x00ȰŔ#ʉ̖qǯ̖\x00̗̖ȯÊ̗'.Ȫ$#ɭȯɵ\x00̖	8ɵȯȇ̖\x00̗ʠȲ˥ȂɄHsɔƟ$%$ȯ\n̖Í̘#ɄҖȯÐűȬҽ	̖ȯ<#\x00$1$1ʋ	Ȫȯȯŗɐɨȯ\nɛ̖\x00̗:1Ʉȼɛ¼ɥɫ:10ލ\r̂Ʉ=ȯ̛ò̖\x00ȰӠ1ɳɄؖɭɜ:10ୢ1%޾ʞȱũǄ	1ĭ̖\x00ɨ1/ɄȝȬīɄॻ̃ȯԺȵ૓1ɗ;ɍ	$̖ȯ6ȯ஝ʟȸʔǛʝȲИƿ1#AȬs1#ȯƪ	̃ȯƑȰͯȰČ#̖̗q&ȬʁɅ)ʡȰǙȆȱ#о10щʞȸடǄ'ŀ&ȷ#ȸ#ȯs10ಊ(̛̒1/ɄฑɄࡣɴ;ɍ'Ƌ$1ɴ;ɥ1̖ȯƪ#̗Ē	1ĺ̖\x00ȯ̢8#¨#ุ̖$Ʉȯ#౗$ȯ૱$ȪȯĘȬڥ%c1&ȯƪɅ)ʠȰƼư+Ʉ࢐(\x00&\x00)<\x00Ȭɟ#Î	̖%©@Å1ɴɫ	8̖ȯ<̗\x00̘̘#ȯÔ$ÛʡȰŮȈʞȱũǇ̃̖Ȱ૥#ŲȬ຿Ʌ)˵¨ʋɵȯঃʌɵȲ์$c8̙ʞȸ৩Ǆ-ȿ$Ʉ¤#Ʌ)˻ɄHnɔʁ0ɿ1̗ȯɏ'ȯ\n%1ɣ;ɦɅ)10ۗȸ#Ɵ1̙֦%ŀ$#ɄߑʡȰƳȇ10ŷɅ)˿10ԚɅ)10ୄ%Ɩ̖1ɌɅɅ)˸#ĦBɦăĨB10ࣼɀ#ɀ8ɿ̘ȋ̘̛̻̖̛ޝɄл	ɵȰࠨȯƶ1ʔ\"̖+à$̖ȰӸ$@ǵ̗$$Ȱఽ$ȯԜ$ȯӮǲ̗½%cǯ$\x00̗#$^1UɑčɄࠇɦɲ10ެ̘̛Ӷ̖\x00$\x00̘	#ɵȲڏ̖Ʌ)	1Ȁ̖\x00̗/¨$ȯݤ̘$ƭɹȯ#D\x00$ȯઙ%Ɩ̖ň%D#D%!#!ƫ&c&Ʌ)	ʝȰǙƹ1ɄŊȬɒʞȰƼǆ#Ɩ̖#ƒ̘('ȯҡ	1ǳ̗](ʝȰŮǀ\r8ɵȰʦȰഴɰȯ఼Ȭê1%ʓ̖৺[įř)\x00+ԣř)\x00,)ɩȯ)\x00+ȯϵ)ŝ)\x00ȱު*)Ē)ŭ)C(෺ɄʉȬഋ'ȯ࡫'ȯ͏'ȯ\n%g-حɇ*ÀĪ)%&ǷȯÐ)๡%ప.ɄƙȬߵ-બ10ํ#ޯȬuȬ-ȬYȬźȬØȬԏ\r#Ʉiȯ̖\x00ɄҜȯĄ1#!ȬþɅ)1ɜ;ɥ	̖ȯ<̗\x00Ȱ੽$̠߲̖ɵŎɵȰຈĤ̖Ʉo̖ɄٍȬ޻	1$#ȯ,1/ɜčɝɌ¶ɭȻ#ɒ#Ʉ=ȯ̖ȯ൰ِ&&Ȭç&*##ʇɸ$dɸ%םʇȯ఑ʒ#஍à##Ȭï#XȬ#ԩȬ#̡	ɣȯǾȯƢ̃Ʌ)8ʉ̖q1ɵȰ΢10ടʟȳಔǰ1Ŝ̗\x00ȯҊ#!Ȭs8į̖ă1%%൩8ɄЃȱéà%%$%X'%Ʉ\\ȯ!ಚ10ݐɄඹ@B	1ř%\x00Ʉͧ\r̖̘̛Ӷ̖\x00$\x00̙&Ʉo%{̖ȯÇ#ʟȳ஥Ǡ1Ʉȯ̙ˎȯÜ#Ȭ-$ɣȯ¿ȯȋ%$ȯǫȰ͂10ʨׇɰȯҨ1Й#ȯɀ̖ȲΆ̗ă(''!Ȭç	1̖Gʕȯ,Ǵ̗0݈ʔ̖,ȵĒ̙$̙̙ĥȰƄȯŹ̙$Ƚ#×	1Ȗ̖ȯॴ10ࢀ̂ઉMȬ`?ϸ	%NƏத(1Ʉ̕ɲɅ)˽1̘1'Û10๱	̠Ý̃\x00Ʉǃ+̛ಮ\r̃ȯ<ȱಧ̛ò̖\x00ȱඎȼ#ɲ10আɅ)ʟȻÊǦ	̖Ʉ\\ȯ$Ѕ1Ʉীɍ1#!ȬəǺ#DʟȺͫǙ1̘Ś̘\x00ȷ͂	̖ȯÊɄo̙Ʌ)ʀ̛å&ȬஒɅ)˴Ʌ)˶Ʌ)\r̂̃̄̅̆̇̂#̖ȯT̅2&2'Î'1/̃ȯຜȵ׷̃ȯ෾%)čɄષɄȝȬູƑ%EƸƑħخ%NɄα	1̛®#AȬଂ#Ŕ#̓ʞȰŮǋ1/ɄਇɄ੿ɖ;ɕ\r1ɵȻౕɘȰհɵ̃ȯ<ȯyƑĥȯ৷%)	#̖ȯ6̘1#!ȯւ'̠؏̖̛ଁɄл̛࣡̖ȯ<̗\x00Ʉo̘ম)̛åʞȴϚǄɄ̛ۭি$̀BɅ)˾	%ļ#:10ϴ$v	̖ŝ̖\x00ȯż#સ1%!ȬəǺ%DʞȲϠǅ10ǉ1&̗ȯǮȬČ10০ʞȸܲǄȮċ$ż1̖̃ȯ<ȯy)58̖̖R©MȬØ1Õ'K@\x007\x00,Å#ಏ̖Àȯඓ̖॥ȯŘȶ๰Ȭþ10౨Ʌ)ɄH¬ɔȨ*ŝ)*\x00ȯĄ1̖ĥB8Ʉ\\ȯ'Ѕ1/ɄङɄԫɗɍ8Ʉ೼#	1&#ȯ,ǲ̗̃̄̅ɄƙȬݭ̢̠ !̟̜̝̞	j\nr.\rµǲʪoŔǅmYí`£þ'taŌƙxǁļ££ƅĘƻƮǰƋ£ËNĶƻRWǊƘŘ£ŒĨƥ£¹£ƻŅ«ö£¯Ƽ£čwňőǈßƼĆ£@ǄÿúƧƼĦăÉºĐgXēşÍ	Ƽ½ƤǕĻƦůėĪƼ-Ïq©ǇǘųƼƑĔeǦèƫĉĒŸĿÀ?źŰ÷¥ǐ~MǇôǢƀĬƼF=Ŵ9|­D£Ʃ(ŬŹvĲƏŠƶåǩ:ßƼđĖÒ!Ǫ£ƛƞ\"ť£7éĂǧ>ŚÍċîƇ£¿ÍGƸŨ£ƣÊǛ±æ·\x00ƼÔhƗõãǌŝŇƪį}ĳćǎ3;Ƽ¦ǨĵõěƼĩÇÍ1Ƽ½}½,ƯØĎgXƳǍÎ¤£ŻǖK£¼ŋtƻ¸ƼĈŃÚÈŁµū\x00ƼǋfŤ£zƽ.Ư+ŮƬĝŊÖƜǞž^£&¬ƠŎAÙHiójƱĞſc£ƷƴƃƕŁǓĠďŐƼŰ4JâǕĺÍŶƊu£§ǭƍ£ǭüǆ£ǭƉ£#s££Ib£Cżǥƻ6ű£Ǘ£Ċ£ŏ£ġǮĹ£ƷŽ<ƃĢǚƑ£ŵñ\rǫqLƻŢe_£lÁ£££Ʒƴƃœ]ŎħƁZ*ǓdknśÆ££ªÐǔǃ°ņŕ¶Ʋơ×ïƾš$ŪǙīĥQ5ŧðû}Ʒë£ǂǠ¨Änı0ƺì÷ţúǟÜľ¡ç£ķŭ2ưPǬ´Ā£ƖĮ£Ƽ£ƼƐƼĴ£ǒėŲƒ£TƝyŜĜöǉƼƿǤ8řÛrNŷƻìàǀŞǟàÆ£İƼ£Ƣ£łĄtƻÂń®ÓtV øƭ[ĭÃƆEÌƼùBƼ¢ĸƼǝČƼUąƼę£)Ǳ Ƃ²ƈ£p£Ǐ£ǡêÅÕŗō%£ǭğ/£ǭƔ£ƚÍǯŦOS£ǜÑ{ĚāäƨƻŰũò³£ÝǣĽ£ƷƴƃŰŖŀýƻǓÛƎ\nƹnƟǑĤÆ£Ƅ£Þƌ£ŉ\\£¾ƻƵ}Ɠ£ĕ£á£»ģ£\x00ǲ	UɄȝȬīɄ̈͍ୗȧ݂Ɔ̟\x00̂8ȷજ̟ȯ΂̟Ȳϳȶѐ	̂ȯȬ×௨	ˣȬìۛ̉̟Ȳϫൂ̟ȯ,ˢ̢è\x00ɄҚɬčɕ@Ʉȭž̟\x00̄̄̄ȯȬڒʻ഻Ÿ̟UɄρȬɺ	̠ӻʐȰͦ̄ζŷଥ	̃ĻŒ̟:сζ¢ɎĿB	ȰԀȰŤɴ@ɅȬtž̟\x00̕ݽȬॕ̕ɄȼɗNɍɄȭࣀž̟\x00̃ɵȱ؟Ń\x00\x00ȯγ̛®ʐȱˠȬÜಣొ	̟ȯ<ȯy̈̛åƁ̟\x00̆ʐƠ̇̄ࣸ®ʐȱˠȬÜɄǕޢ̂4ɘ̆4ɘȬs̂̛೿̟	̃ȯ<ȰĹ̞	īɣ\x00ȱŕ˺{̛ěȬຟȰȂVȴ˿̟ȯ,ɅɣNɗɄ߂̟ȷЕ̟ȶΛɜɄঅɖɺ:	ɣȯ¿ǫ̇ƃ̟\x00̙$Ȭt	̂«ŵ̟	īɣ\x00ȳď˼{	̂<Ź̟ȯ৴̇̟ȱЭ̘Џ̜.ʊBؔ8̜	ȯ,϶	̋ɇ̊̉Ŵ	ȯȻɏȺȱܭȬt̈̜ȧŻ̟எ߿ȱਤȬtȰʣɅ)ɴ@ɫɜ;ɳɦăƂ̟\x00Ʉ੮ষૄɅ)̘Ȭs	̜ȰǿȲƲ'įɄڃĞүɵȷٜɘ̂ɵȯĕȴξ˾ଵɵȳઽɘ̆ɵȯĕȷź˿୊cƄ̟\x00ȰМȬݟv̢èȲœÍȯΑ	̠Ý̟\x00ȲœÍ̖ƅ̟\x00̖ɄΫ̝Ʌ)ȬsɅ)ĵ̓̃ඳ	̍ɇ̎̃ž̟\x00̆	ŝ\x00ȯǚ̘ĜB	̟ȯ6Ȱୠ	̜̟ȯ6ȯƕƁ̟\x00	īɣ\x00ȯƘ˻{Ɔ	ɵȯǵȰס̌ɵȰȴv̠Ր॓	̜ɣȰȹ۴Ƃ̟\x00̗ɧɌɄຏɦɄԡɫࡹ̏ȉ̃ƉȲ͛ȯ6ȱ஧ȱɀ̠ݬɄӟȱƃƜƆ̟\x00̃8̢úʎȯ̟	ř\x00ȴլ\r̠Ý̟\x00ȯʠȰ഍഑̄	̟ȰΙɅ)\n౔	ī̜\x00ȵʪ\nȰũɅɳ̂ɘϖɵȰʦȯϙM̂҄Ȭɼɜə̟ȳ஢ȳॣə̟ȳജȳ܆୆̟0̛੹ɍ;ɬ	̂LŻ̟Ī̟ȯƢ	ɵȯǵȰધ̢è\x00ȰȂVȰे̌̛åƂ̟\x00̘Vȯ,	īɣ\x00ȱȕ˳{ɵȰܡż̟\x00̚	īɣ\x00ȯˆ˽{	8ȯȬǥਓ	֏ȯÜ	īɣ\x00Ȳė˶{ఘĵ̒̟ʉ.Ȫ̢è๠êɬ;ɄĶ̠Ý̟\x00ȯڛÍ	!FȬçƕB	̟ȻٛqɄ৸	̟ȯ6ȯƕ	̢è\x00\x00ɘ̟Ȳ֥ɘ̟Ȳก̇4̟ȱ࡜̈4̟ȱڈ̉4̟Ȳϫؿ¨̢߉c	ȯāȰǭ	̂®Ŷ̟ɝÈɄ̲Ʌɜ:୒̟\rɄ=ȯÀȯɮকȹࢦȸ൧ȵොȁȲ౭ȯΰ೅ʨȯґȰČ\rVȯāȯҲ	īɣ\x00ȱď˵{ๆ\r¨ɷȴĺɣ\x00ȶڣڹcɬȺࠩ	̠Ý̟\x00ęêž̟\x00̋ඛ	ȯȺΫ!ȯγɄ=ȯȯɨȰɣ̠Ե\x00̟]̛®ʐȱˠȬÜ̗4ɘ൛Ƈ̟\x00̂ƀ̟\x00̠෰Ȭࠊ̇:¨̢ਠcɵėΞƇ̟\x00̃̖ȯÊ̂ɣɦ̟ż̟\x00̅੐ॄ̠Ý̟\x00ȯ௔ê֯vৄɫPɄٵɭɛ:8ȬìɅ)\r̅А¢	ȯȳ̑NȯȬιȯȬƥƁ̟\x00̇ߴ̘ȬtȰʁૈੂż̟\x00Ȭs	̂=Ÿ̟ԚȬç̆v	̂ȯȬsɕɄϣɅ;ɄĶàXʉźgƁ̟\x00ɴÈɬɦɅ:	̟ȯ,̟ȰΙɬȷא$ĜBҿ̟¡ƗDȪȯƊЊȯ,Ʉދ̃݇$Ȭ֊	ɹȯň	̠ӻʐȰͦƁ̟\x00ɸȯĺ̌:ȯ͠Ʉ҅ȯŹȬ×!Ⱥൽ!ȰౚȸʣVVࢎȬ׍VƌȬƹʔɘ̛ěȬĄม੤ź̟ɵȰʦȯϙ̄ы̅M̃։ȬɼģB	̟ȳຕȶղછɌ@Ʌ̅vż̟\x00̊̂̛åUɌʗɭ;ɣ¶ɝ̛ܩ\rƀ̟\x00̠ХȬ෻Ȭŕ̉:Ѥ̝൐ƃ̟\x00Ʉ঎԰Ɨ\rȬīVȯటȬČȯŧ֚̂ƉȲు̟ȯͼɵėͰȯҩȯŘğࡻȬǰɵėͰȯҩȯŘȰଯȬþƁ̟\x00̂ž̟\x00̔\rɵȰຘȯȯமȯ̟̠־ॆȲ஼̛๐$Ȭs̠৅̌ȉ	ƈ̟\x00\x00̘ޖ\rƀ̟\x00̠ХȬುȬҴ̈:Ȭ߹ѥȯΏ̂щɟȲ̼ɣ;Ʉʟ׈άৱǭ̜ɵȰȴ	īɣ\x00ȲҴ˸{\r/ɄÂȬ࢓̟ȯʹȰǚ	ŝ0ȯĄɺNɄۨɄ̕ɲ:\rɄ=ȯȯɨȰsƖ̟ƅ̟\x00ž̟\x00̑Ƃ̟\x00Ʉя̠෣̋	̠Ý̟\x000Íɲ@Ʉτż̟\x00ɄࡿɅ)	īɣ\x00Ȳŕ˹{Ƈ̟\x00̄ž̟\x00̍̕ɇɻɄ̥̟ȹங\x00Ȭ࢑Ʉ̥̟ȴܛ\x00Ȭଠ࠻̃4ડ̄4ഷ̅4Аƅ̟\x00Ʉ͛̟ȳԓ͞	̃ȯȬ×ȱʋȱษž̟\x00̓	ȯȳÛ\rɯȯ\x00̇4ɘ̈4ɘ̉4ɘɜ̜\x00q8Ȱ҈ĵ̉ɿĵ̆Ƈ̟\x00̆ɗ̢èٙÍž̟\x00̅̟Ő̟֜ɄௌɳЏɄସΔ\rɵȱƣVǯࡀ	¨̠િ̟½ҙ̛®̌	̃ȯȬs8ğĭž̟\x00̇৖̜ȿࡐ.ɰȯҨUɄୱɄ௽ɲɝ఺˳ųȬپ౹ż̟\x00\r8Ʉ߳M̟҂Ȭ஦M̟:ɴ;ɭ	̂­Ÿ̟ĵ̂̠è̟̇v̎#̏įȲ਌̢చȲෝĔ߬ĔࡄȰȦ	য়c̃vنž̟\x00̒̂;̃м8ޣ	ɜ̟Ȳഘ̟Ȳং̄v̊̄Ɖȱֳʎ\r/ȹǠȯਧȬt̘$Ȭ๞̘$Ȭޫ̈ȉ	ɣȯǫȰ̢ȯΑ̝ȯą	ȯজɫPɖ@ɳ¶Ʉʟ	ƀ̟\x00ųȬ࢟/įɵȱ˂ɵȱ̟ȱৌɵȱ̟ȱŏgɵė౺ȱ޸ȱ̬ȱ࠮ȱ̬ȱ௄ȰȦɝcɵėΞՄ్̠ȰȂȯ,̂ȱࠒȱ़ȱࠏ̆̆ȯȬì̂Ǻ̔Ǻ̒Ǻ̓ȉ܈̟ȯʹȯص;ɵȰԟঔȯ౟Ʉ=ȯȯɨȯɮ઩̐Ơ̏®̏ʐȰȰ	Ţ̟\x00ĹB஛ɬɛ̟ȯ,̟ȹΈɣ;ɬ̈̟ȱџॵ4ɘɶĥɄoॸ	ȯ6ȴ౱ɵ	Ɔ̟\x00ɄƯ̈̄෥̘קȬͩȬĄ	īɣ\x00ȰŚ˷{ȯŖɅ)	̏̛åɱÛ\r/ȹؕȹۥȬt̢èęê̟Bڵɧɛĵ̔	ɵȯǵȯҋࢿ	Ū̂̃Ȭt	īɣ\x00ȰŔ˴{৿Ɨ\x00\r{̂̃VɵȲƋVȬƥ	ȯȵɯ\r8ޡȪȬ஺ۋȯץĭɅ@ɧɄଔɺ	̂ÇŻ̟ौȬ×̘Ȭ×̠௣ȯڤɑ;ɺ	̞ȲϹ̜VȯҡԪv̠ಁ̠ڂ	īɵ\x00ȴďľ	.Ȫȯϵŷ̂v̃̂̊Ơ̏®̈	̑ɇ̐̆ɵȱࣰȱƃɄӟȱԒ̢̣	̡		\n\r$»k1v:[6_dsa%r3`8^\r]x_gq&_q	>#\\{~Y3_Eq7q$h+rF{DYFH_GS.rnIcW!4n (_U_/L\x00q|pq_y5q_XQKBTI_OfYw}_b_)YRNYl*Y\n2tY}_0qo_V_;q@P_~qA\"_m_m_-9Jiq<zuMr={Y?ZjC_,Y'}e_\x00\rɢȯ\x00ɬڱȯڪ̣ú̄̜Ⱥƃ̡ɣɄ࠱ɜűĢӾɄȼɲ¼ɛɖ:Ʉȸ	ɣȯĕě෌	̜ȰǼȲƲ̇	̜ȰǿȰô\r̄ɗɄۧȯ๝ȱʋǫ̇̄̂̢ψȲ̍\x00̂ɜɅ8Ʉo{/ɅÈɲ;ɦɧ	̌ɇȲ்ɢȯ\x00ɬȱŁȯϱȯȬʽɆUɝPɅɄѝɳ౰̋ȴ຺̜ȯ,ࣣಅK¨±ȯ,XqȸЕ߇ȯȬࡌŰ5>״;]̄ƊůȱइɝcΔɄ׊ɺ¼ɺɛ:̜Ɨ̛ę̟\x00ȯƕ̢̇̡ȰČѤ\rɄiȯ\x00ȻொȬþ̜ࠗɵȹ୛ɵȸ৐ɵȳ஁	ȯȬs.ɬȺಽ	ɣ̡ɳɘɅ)	ɿ̆৚Ʌ)\rӋూɄۃɭ¼ɳ;ɄݏɅ)	ɵȱƣˢɆߘ\rɢȯ\x00ɬࣻȯಲɇő	ȬǗ̢Ϩ	̜ȶȦ\x00		̜#ȯÐ\rɄiȯ\x00ȸಫȬþ̠ؤ̃̢ψȲɭ\x00̃8౥̜ȻُȰƈ	ࠤ	/̡Ē˺ɣ̊ɇȳࡳȬɼ8̜.	ɣȯĕČఋീɦ\n\x00ȬමįŬ\x00̛୵ȯȬ˜௦c	ȯȬ×	ɽȰȘĝӾŷUɥ¼Ʉිɳ¶ɜɅ)\r̜ȰǼȰôŏ̇ȯ̉ɈĪ	̜ȰǿȰô̢Ϩ̠ধ̜Ȳ઺̜Ȳޘ଴ɬɛNɥɜ:	̟ȯ<ȯy̜ȲَɵȺԓ̟௶ȷʧǉɅ)	ɣȯĕĖ̢ӳ	ƊȬː\x00̣୙\rȵīȴ͵ĥɶه	/̡č˺ɣ	̂ԑ̞ȲϹɅ)\n̌	8̜\x00\x00൘ɢȯ\x00ɬȱŁȯϱɵ\rȯÇɬȲyȯ୎ƆɅ)̜#̝	/̡Ě˺ɣɅɣ̆	ɣȯĕē	ɇ\x00ȬǗӋ\r̣̤\n	&\n	\x00\r\x00\nɣ̡q̢̇̇vŷɅ)̇ɵȱƣ̇ຳ̇Ʌ@ɣ̄#̛®̃̤ú̜ȺË\x00\x00Ʌ)	ĥ\r̜ȰǼȰôŏ̇ȯ̉̅Ī̃̛åį̜Ȳ๳\nɄȯ̜Ȳ঒Ⱥࠂ\nȳභ	ɝcɅ)̝Ȭࡋ̃̂ǉȱԏ̅\n̇̢ใ	̢УȱȂȱר\n\"̅̝vƆ	\n̤\x00\r\x00\x00\x00\x00̢У\nɄiȯ\x00ȹບĪ\n	ĥ";}else{_$bF="_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');}}else if(_$a9<24){if(_$a9===20){return;}else if(_$a9===21){_$$4=_$$T.eval;}else if(_$a9===22){_$aT+=-5;}else{_$gv=_$bp(0,807,_$bl(_$$4));}}else if(_$a9<28){if(_$a9===24){_$gJ= !_$g3;}else if(_$a9===25){_$kI=_$aw();}else if(_$a9===26){_$gJ=_$jZ>0;}else{_$aX[2]="pVUUU`ZV`XX`X(`)`[Y`XW`[ZZXZ`WYU`ZW`*U`VV`*`Y(`V[`WZZ`X`Z(`WZ[`RV`VX`Y)`VUU`YW`W`VXYWV((W(`VUWY`Z`YU`)[`VW`VW)`)V*W`XV`YY`Y`V*W`*W`VZ`Y[`WU`WY`WUU`WUUU`[UY)UU`VW(`YW*Y*[(W*Z`V(`VXYWV((W)`V*`[`YX`VU`Z)`WU*(VZV`YZ`WWY`W(`[ZZX[`(`YW*Y*[(W*[`V)`[X`X[`XZ`(*`ZY`)WUX`Z*`W)`RVUU`ZZ`WUV`W[WVYY`ZVW`V)U`*[`VXVU(W`X*`W*`[Z`*)`VY`XY`[)`Z[`[U`W)X`W[`YU*[`WV`VUW`XUU`V[X)X`USU`VUUUUU`)V*)`)*`XU`VUY)Z([`)WUW`VWU`WUX`)U`)V*[`)V*Z`VWW`W[)YXZYZZ`*X`)WUU`WUY)`USZ`RUSUV`USUV`W[ZYYXZ([*`)W`YU*[U`VWX`WX`WY)`*(`VW[`XW([)`V[)YXUU)`V(U`WZ(`ZUUU`XXZZYYXW`)V*Y`VUY)Z(Z`RUS*`**`Z[XWU`VVW`ZZW*[`ZUUUU`VZV)ZUUWY*`)WX*`VVV`USY`[*`)WUV`X*))W*WX)Y`USXZ`*V`)X`[VZ)`XXX(Z[Z*)Y`(W`WZXVUVV`XX*ZY[*()W`V[)YXUU*`V[U`USV`RUSW`R*U`WZY`VWW))`YUWXWXXYV(`VVU`)W)(`V)UU`V[Y`)V*X`)V`[ZZX(`US[`US)VXW[YZYX`))`(Z`RV)U`RUSW[`WZW`V[Z`W(V(XX)()`V)Z*((ZX*X`US)`WUY(`X[U`USW[`VUV`WUUUU`WYUU*Z*(U)`)V*(`VZ[(*`V(XWZ)YV*X`V[(((WVZ`(Z[U`)Y`[YX[VZ`US*`XUUUU`)[YUUUUU`RY`VUUV`)V**`RW`USW`R(`WZ[WX)XVUW`XW)ZX((ZWU`VZUU`ZU)*`V[W`V*)`VXZ`V)[`VW*`VZY`V[V`VY)`VXU`V*[`V[(`V)V`V(V`VX*`V*V`V((";}}else{if(_$a9===28){_$bp(94,_$b7);}else if(_$a9===29){_$$j(_$$4,_$g9);}else if(_$a9===30){_$b7=_$_z.join('');}else{ !_$gJ?_$aT+=3:0;}}}else if(_$a9<48){if(_$a9<36){if(_$a9===32){for(_$$D=0;_$$D<_$b7.length;_$$D+=100){_$as+=_$b7.charCodeAt(_$$D);}}else if(_$a9===33){_$aX++ ;}else if(_$a9===34){_$$7='\n\n\n\n\n';}else{_$$F+=_$$P;}}else if(_$a9<40){if(_$a9===36){_$_z.push('}}}}}}}}}}'.substr(_$jZ-1));}else if(_$a9===37){_$j6.nsd=_$_V;}else if(_$a9===38){_$bF=_$$4.call(_$$T,_$bZ);}else{_$gJ=_$$T.execScript;}}else if(_$a9<44){if(_$a9===40){_$bQ(47,_$_z);}else if(_$a9===41){_$j6.cp=_$aX;}else if(_$a9===42){_$aX=0,_$e3=0;}else{_$_z.push("})($_ts.scj,$_ts.aebi);");}}else{if(_$a9===44){_$aT+=2;}else if(_$a9===45){ !_$gJ?_$aT+=-69:0;}else if(_$a9===46){_$_z.push(_$$7.substr(0,_$$o()%5));}else{_$j6.lcd=_$_V;}}}else{if(_$a9<52){if(_$a9===48){_$$D++ ;}else if(_$a9===49){_$j6.scj=[];}else if(_$a9===50){_$$4=[];}else{_$c7=_$aw();}}else if(_$a9<56){if(_$a9===52){_$bF=_$bp(42);}else if(_$a9===53){ !_$gJ?_$aT+=53:0;}else if(_$a9===54){ !_$gJ?_$aT+=4:0;}else{_$aX[1]=_$gv;}}else if(_$a9<60){if(_$a9===56){_$gJ=_$jN<_$bZ;}else if(_$a9===57){return _$bF;}else if(_$a9===58){_$$P=_$aw()*55295+_$aw();}else{_$aT+=-6;}}else{if(_$a9===60){_$bF=_$$T.execScript(_$bZ);}else if(_$a9===61){_$aX=[];}else if(_$a9===62){_$e3=0;}else{_$jN++ ;}}}}else{if(_$a9<80){if(_$a9<68){if(_$a9===64){ !_$gJ?_$aT+=-27:0;}else if(_$a9===65){_$gJ= !_$kI;}else if(_$a9===66){_$_F=_$aw();}else{_$jZ=_$aw();}}else if(_$a9<72){if(_$a9===68){return _$$4;}else if(_$a9===69){_$e3++ ;}else if(_$a9===70){ !_$gJ?_$aT+=23:0;}else{_$$F=0;}}else if(_$a9<76){if(_$a9===72){_$gJ=_$e3%10!=0|| !_$aX;}else if(_$a9===73){_$gJ=_$bZ===undefined||_$bZ==="";}else if(_$a9===74){_$gJ= !_$_z;}else{_$gJ= !_$$F;}}else{if(_$a9===76){ !_$gJ?_$aT+=-35:0;}else if(_$a9===77){_$$4=_$j6.nsd;}else if(_$a9===78){_$aX[4]=_$bp(42)-_$bF;}else{_$gJ= !_$$9;}}}else{if(_$a9<84){if(_$a9===80){_$g3=_$bp(42);}else if(_$a9===81){_$jN=_$aw();}else if(_$a9===82){ !_$gJ?_$aT+=33:0;}else{_$$D=0;}}else if(_$a9<88){if(_$a9===84){_$$4[_$jN]="_$"+_$bF[_$aX]+_$bF[_$e3];}else if(_$a9===85){_$gJ=_$e3==64;}else if(_$a9===86){return new _$aO().getTime();}else{_$aX[3]=_$as;}}else if(_$a9<92){if(_$a9===88){_$_P=_$j6.aebi=[];}else if(_$a9===89){_$aX[5]=_$bp(42)-_$bF;}else if(_$a9===90){ !_$gJ?_$aT+=1:0;}else{_$gJ= !_$b7;}}else{if(_$a9===92){_$$o=_$bl(_$$4);}else{ !_$gJ?_$aT+=-26:0;}}}}}else ;}


function _$bQ(_$_z,_$$P,_$$D){function _$ad(_$bF,_$$4){var _$aX,_$e3;_$aX=_$bF[0],_$e3=_$bF[1],_$$4.push("function ",_$gv[_$aX],"(){var ",_$gv[_$_Q],"=[",_$e3,"];Array.prototype.push.apply(",_$gv[_$_Q],",arguments);return ",_$gv[_$$d],".apply(this,",_$gv[_$_Q],");}");}function _$gZ(_$bF,_$$4){var _$aX,_$e3,_$jN;_$aX=_$av[_$bF],_$e3=_$aX.length,_$e3-=_$e3%2;for(_$jN=0;_$jN<_$e3;_$jN+=2)_$$4.push(_$$9[_$aX[_$jN]],_$gv[_$aX[_$jN+1]]);_$aX.length!=_$e3?_$$4.push(_$$9[_$aX[_$e3]]):0;}function _$aL(_$bF,_$$4,_$aX){var _$e3,_$jN,_$_F,_$jZ;_$_F=_$$4-_$bF;if(_$_F==0)return;else if(_$_F==1)_$gZ(_$bF,_$aX);else if(_$_F<=4){_$jZ="if(",_$$4-- ;for(;_$bF<_$$4;_$bF++ )_$aX.push(_$jZ,_$gv[_$hj],"===",_$bF,"){"),_$gZ(_$bF,_$aX),_$jZ="}else if(";_$aX.push("}else{"),_$gZ(_$bF,_$aX),_$aX.push("}");}else{_$jN=0;for(_$e3=1;_$e3<7;_$e3++ )if(_$_F<=_$$$[_$e3]){_$jN=_$$$[_$e3-1];break;}_$jZ="if(";for(;_$bF+_$jN<_$$4;_$bF+=_$jN)_$aX.push(_$jZ,_$gv[_$hj],"<",_$bF+_$jN,"){"),_$aL(_$bF,_$bF+_$jN,_$aX),_$jZ="}else if(";_$aX.push("}else{"),_$aL(_$bF,_$$4,_$aX),_$aX.push("}");}}function _$fL(_$bF,_$$4,_$aX){var _$e3,_$jN;_$e3=_$$4-_$bF,_$e3==1?_$gZ(_$bF,_$aX):_$e3==2?(_$aX.push(_$gv[_$hj],"==",_$bF,"?"),_$gZ(_$bF,_$aX),_$aX.push(":"),_$gZ(_$bF+1,_$aX)):(_$jN= ~ ~((_$bF+_$$4)/2),_$aX.push(_$gv[_$hj],"<",_$jN,"?"),_$fL(_$bF,_$jN,_$aX),_$aX.push(":"),_$fL(_$jN,_$$4,_$aX));}var _$bF,_$$4,_$aX,_$e3,_$jN,_$eP,_$$p,_$$H,_$_Q,_$il,_$$d,_$hj,_$ak,_$$l,_$$X,_$iZ,_$_j,_$_E,_$av;var _$b7,_$g3,_$$7=_$_z,_$bZ=_$_T[2];while(1){_$g3=_$bZ[_$$7++];if(_$g3<60){if(_$g3<16){if(_$g3<4){if(_$g3===0){_$av=[];}else if(_$g3===1){_$$9=_$bQ(45,_$aw());}else if(_$g3===2){ !_$b7?_$$7+=-27:0;}else{_$il=_$aw();}}else if(_$g3<8){if(_$g3===4){ !_$b7?_$$7+=-51:0;}else if(_$g3===5){_$kF="%ƃfunction ā(ā){ā[ā(0-6,8)]=2-0;var ā=2;var ā=ā(1,8)];var ā=1+7;}function ā){var ā=7;if(ā(7,8)]){if(2){var ā=5;}}var ā=6;var ā=5+3;ā(4,8)],8)]=3+1;ā[4]=2;ā[0]=6;ā[4]=3+1;}function ā){if(3+1){ā[4]=2;}ā[4]=ā(3,8)];if(7+5){ā[0]=6;}ā[0]=ā(7,8)];if(2){ā(7,8)];}function ā(4-2,8)]=ā(6,8)];ā[0]=6;}}function ā(4,8)],8)]=2;ā[0]=7+5;ā[0]=6;}function ā){if(2){ā(7,8)];if(3+1){ā(3,8)];if(6){ā(3,8)];}\x00))++),*)	+\n),,\r+)))))))))))))))))))))\x00)	*\r+)))) )!)))\")))#)))$";}else if(_$g3===6){_$bF.push([_$iZ[_$$4],_$iZ[_$$4+1]]);}else{_$iZ=_$bQ(0);}}else if(_$g3<12){if(_$g3===8){for(_$aX=0;_$aX<_$bF;_$aX++ ){_$$4[_$aX]=_$aw();}}else if(_$g3===9){_$$H=_$aw();}else if(_$g3===10){_$$4++ ;}else{_$iZ=_$bF;}}else{if(_$g3===12){_$_E[_$$4]=_$bQ(0);}else if(_$g3===13){_$bF=[];}else if(_$g3===14){_$$4=_$bQ(0);}else{_$aX=_$aX.join('');}}}else if(_$g3<32){if(_$g3<20){if(_$g3===16){_$$j(_$_E,_$$o);}else if(_$g3===17){_$b7=_$$4<_$iZ.length;}else if(_$g3===18){_$aB(0,_$$D,_$$P);}else{_$eP=_$aw();}}else if(_$g3<24){if(_$g3===20){_$_3=_$kF.length;}else if(_$g3===21){_$jN=_$aw();}else if(_$g3===22){_$$j(_$iZ,_$$o);}else{_$bF=_$aw();}}else if(_$g3<28){if(_$g3===24){return;}else if(_$g3===25){_$ak=_$aw();}else if(_$g3===26){_$b7= !_$_E;}else{ !_$b7?_$$7+=13:0;}}else{if(_$g3===28){_$$l=_$bQ(0);}else if(_$g3===29){ !_$b7?_$$7+=3:0;}else if(_$g3===30){ !_$b7?_$$7+=38:0;}else{_$$d=_$aw();}}}else if(_$g3<48){if(_$g3<36){if(_$g3===32){_$aX=_$bQ(0);}else if(_$g3===33){_$$7+=-5;}else if(_$g3===34){_$bF=_$kF.substr(_$$F,_$$P);_$$F+=_$$P;return _$bF;}else{_$hj=_$aw();}}else if(_$g3<40){if(_$g3===36){_$$X=_$bQ(0);}else if(_$g3===37){_$_P[_$$P]=_$aX;}else if(_$g3===38){_$$4=new _$c3(_$bF);}else{_$_Y(_$$4,_$aX);}}else if(_$g3<44){if(_$g3===40){_$e3=_$aw();}else if(_$g3===41){_$$4+=2;}else if(_$g3===42){_$$P.push(_$aX);}else{_$b7= !_$iZ;}}else{if(_$g3===44){_$b7= !_$av;}else if(_$g3===45){_$_Q=_$aw();}else if(_$g3===46){_$b7= !(_$ak+1);}else{_$$4=0;}}}else{if(_$g3<52){if(_$g3===48){_$$F=0;}else if(_$g3===49){_$_j=_$aw();}else if(_$g3===50){return _$$4;}else{_$av[_$$4]=_$bQ(0);}}else if(_$g3<56){if(_$g3===52){_$b7= !_$$4;}else if(_$g3===53){_$b7=_$$4<_$e3;}else if(_$g3===54){_$aX=[];}else{_$_E=[];}}else{if(_$g3===56){ !_$b7?_$$7+=27:0;}else if(_$g3===57){_$$9=_$$9.split(_$_X.fromCharCode(257));}else if(_$g3===58){_$b7=_$$4<_$jN;}else{_$$p=_$aw();}}}}else ;}



function _$aB(_$e3,_$$4,_$aX){var _$bF;var _$_F,_$$P,_$jN=_$e3,_$$D=_$_T[3];while(1){_$$P=_$$D[_$jN++];if(_$$P<43){if(_$$P<16){if(_$$P<4){if(_$$P===0){_$_F=_$bF<_$$l.length;}else if(_$$P===1){_$_F=_$$X.length;}else if(_$$P===2){_$_F= !_$iZ;}else{_$$4.push("while(1){",_$gv[_$hj],"=",_$gv[_$ak],"[",_$gv[_$eP],"++];");}}else if(_$$P<8){if(_$$P===4){_$_F= !_$gv;}else if(_$$P===5){_$$4.push("function ",_$gv[_$il],"(",_$gv[_$$p]);}else if(_$$P===6){ !_$_F?_$jN+=3:0;}else{_$$4.push("var ",_$gv[_$$H],",",_$gv[_$hj],",",_$gv[_$eP],"=");}}else if(_$$P<12){if(_$$P===8){_$$4.push("var ",_$gv[_$$X[0]]);}else if(_$$P===9){_$$4.push("if(",_$gv[_$hj],"<",_$_j,"){");}else if(_$$P===10){_$jN+=-5;}else{ !_$_F?_$jN+=13:0;}}else{if(_$$P===12){_$_F=_$eP<0;}else if(_$$P===13){for(_$bF=0;_$bF<_$iZ.length;_$bF++ ){_$ad(_$iZ[_$bF],_$$4);}for(_$bF=0;_$bF<_$_E.length;_$bF++ ){_$_Y(_$_E[_$bF],_$$4);}}else if(_$$P===14){_$$4.push(_$gv[_$$p],",",_$gv[_$ak],"=",_$gv[_$c7],"[",_$aX,"];");}else{_$$4.push("}");}}}else if(_$$P<32){if(_$$P<20){if(_$$P===16){_$aL(0,_$_j,_$$4);}else if(_$$P===17){_$_F= !_$$4.length;}else if(_$$P===18){_$$4.push("}else ");}else{for(_$bF=1;_$bF<_$$X.length;_$bF++ ){_$$4.push(",",_$gv[_$$X[_$bF]]);}}}else if(_$$P<24){if(_$$P===20){ !_$_F?_$jN+=8:0;}else if(_$$P===21){_$bF++ ;}else if(_$$P===22){_$$4.push("(function(",_$gv[_$kI],",",_$gv[_$c7],"){if(!$_ts.cd) return;var ",_$gv[_$$p],"=0;");}else{ !_$_F?_$jN+=19:0;}}else if(_$$P<28){if(_$$P===24){ !_$_F?_$jN+=1:0;}else if(_$$P===25){return;}else if(_$$P===26){ !_$_F?_$jN+=6:0;}else{_$_F=_$$4.length==0;}}else{if(_$$P===28){_$_F=_$aX==0;}else if(_$$P===29){_$_F=_$av.length;}else if(_$$P===30){ !_$_F?_$jN+=14:0;}else{_$$4.push("){");}}}else{if(_$$P<36){if(_$$P===32){ !_$_F?_$jN+=-21:0;}else if(_$$P===33){ !_$_F?_$jN+=18:0;}else if(_$$P===34){_$$4.push(";");}else{_$jN+=-6;}}else if(_$$P<40){if(_$$P===36){_$$4.push(",",_$gv[_$$l[_$bF]]);}else if(_$$P===37){_$fL(_$_j,_$av.length,_$$4);}else if(_$$P===38){_$bF=0;}else{_$_F=_$_j<_$av.length;}}else{if(_$$P===40){_$_F=_$$l.length;}else if(_$$P===41){ !_$_F?_$jN+=4:0;}else{ !_$_F?_$jN+=-18:0;}}}}else ;}}}}})([],[[1,2,10,3,11,0,4,9,6,8,7,5,],[19,50,42,0,56,82,84,69,85,4,62,33,72,70,55,88,49,18,11,71,15,27,9,3,81,25,51,66,65,53,78,2,32,87,80,24,8,63,16,29,68,20,86,20,52,77,47,37,6,4,36,40,43,30,91,93,67,83,12,31,13,48,22,79,1,14,34,67,83,12,54,46,5,48,59,74,64,92,23,61,41,7,45,67,58,26,90,10,35,75,76,28,89,20,73,90,20,39,17,60,44,21,38,57,20,],[23,38,52,30,22,49,32,37,40,55,47,53,29,12,10,33,26,27,28,36,7,13,47,17,29,6,41,33,11,43,2,16,21,0,47,58,29,51,10,33,44,56,8,50,24,34,24,5,20,48,23,1,57,14,54,39,15,42,24,19,59,9,45,3,31,35,25,46,4,18,24,],[28,33,22,27,30,40,26,38,0,6,36,21,10,31,2,11,7,4,41,35,5,27,42,14,29,23,3,12,20,13,1,6,8,19,34,17,32,9,16,18,39,24,37,34,15,25,],]);

var ans = document.cookie.toString();
console.log("cookie_setter_begin");
console.log(ans);
console.log('cookie_setter_end');
debugger;
