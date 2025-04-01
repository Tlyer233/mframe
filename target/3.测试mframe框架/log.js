// [Tool]框架内存 
/** 为什么要这个??
 * 解决重名的问题, window.print可能会重名,但window.mframe.print一定不会
 * mframe的内存
 */
var mframe = {};
mframe.memory = {
    // mframe相关配置的内存空间
    config: {
        proxy: false, // 是否开启代理
        pluginArray: [  // 插件  
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

    },
    // HTMLXXXElement的内存空间
    htmlelements: {

    },
};

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

    return new Proxy(o, {
        set(target, property, value, receiver) {
            // 特殊属性直接通过原对象处理
            if (property === 'prototype' || property === 'constructor') {
                return Reflect.set(target, property, value);
            }

            console.log(`方法:set 对象 ${target.constructor.name} 属性 ${property} 值类型 ${typeof value}`);
            return Reflect.set(target, property, value, receiver);
        },
        get(target, property, receiver) {
            // 特殊属性直接通过原对象处理
            if (property === 'prototype' || property === 'constructor') {
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
    this.mframe.safefunction = (func) => {
        set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`);
    }; //导出函数到globalThis
}).call(this);





mframe.memory.config.proxy=false
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
EventTarget.prototype.addEventListener = function addEventListener() { debugger }; mframe.safefunction(EventTarget.prototype.addEventListener)
EventTarget.prototype.removeEventListener = function removeEventListener() { debugger }; mframe.safefunction(EventTarget.prototype.removeEventListener)
EventTarget.prototype.dispatchEvent = function dispatchEvent() { debugger }; mframe.safefunction(EventTarget.prototype.dispatchEvent)


// 代理
EventTarget=mframe.proxy(EventTarget)
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

// 
window.setTimeout = function setTimeout(x, d) { // 小window才是this
    //x 有可能是方法 也有可能是文本
    typeof (x) == "function" ? x() : undefined;
    typeof (x) == "string" ? eval(x) : undefined;
    //正确应该 生成UUID  并且保存到内存
    return 0;
}; mframe.safefunction(window.setTimeout);

window.crypto = crypto;
window.screen = screen;
window.outerWidth = 2050;
window.outerHeight = 1154;
window.devicePixelRatio = 1.125


window.localStorage = localStorage;
window.sessionStorage = sessionStorage;
window.chrome = mframe.proxy(new (class chrome { }));

// 可删
window.Y = {
    "0": "GET",
    "1": "https://ctbpsp.com/cutominfoapi/recommand/type/5/pagesize/10/currentpage/3?province=&industry=",
    "2": true
}
//////////////////////////////////

/** 小变量定义 && 原型链的定义 */
Window.prototype.__proto__ = WindowProperties.prototype;
window.__proto__ = Window.prototype;

/**代理 */
Window = mframe.proxy(Window)
window = mframe.proxy(window)
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
location.href = 'https://union.jd.com/proManager/index?pageNo=1'; // TODO是否会检测, 上传表单的page和这里pageNo呢??? 
location.origin = 'https://union.jd.com';
location.host = 'union.jd.com'



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
navigator.platform = 'Win32'

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
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeTypeArray"中的length的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
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

let mimeTypeIndex = 0;
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
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
debugger;
console.log("ok");
