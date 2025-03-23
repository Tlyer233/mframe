var mframe = {};

/** 为什么要这个??
 * 解决重名的问题, window.print可能会重名,但window.mframe.print一定不会
 * mframe的内存
 */
// 框架内存 
mframe.memory = {
    // 相关配置
    config: {
        print: false, // 是否打印日志
        proxy: true, // 是否开启代理
    }

    
};


mframe.memory.htmlelements = {}

mframe.print = {}
mframe.memory.print = [];
mframe.print.log = function () {
    if (mframe.config.print) {

    }
}

mframe.print.getall = function () {

}
mframe.memory.get_invocation_error = function get_invocation_error() {
    let e = new Error();
    e.name = "TypeError";
    e.message = "Illegal constructor";
    e.stack = "VM988:1 Uncaught TypeError: Illegal invocation \r\n at <anonymous>:1:21";
    return e;
}
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

// toString 保护
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
mframe.memory.Plugin = {}; // 内存给Plugin开一片空间, 存储Plugin的全局变量,避免污染window的全局

var Plugin = function Plugin() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Plugin)

Object.defineProperties(Plugin.prototype, {
    [Symbol.toStringTag]: {
        value: "Plugin",
        configurable: true,
    }
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

/**实现 不能通过原型Plugin去调用属性;  因为我们的属性都是绑定在实例上的,没有实例, 属性没有意义* 所以通过 原型访问的属性,需要抛出异常
*/
// for (let prototypeName in Plugin.prototype) {
//     // 方法不能抛异常
//     if (typeof (Plugin.prototype[prototypeName]) != "function") {
//         Plugin.prototype.__defineGetter__(prototypeName, function () {
//             throw new TypeError(`Cannot access '${prototypeName}' on Plugin prototype. Properties should only be accessed through Plugin instances.`);
//         })
//     }
// }


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
        // MineType索引表示
        plugin[i] = pluginObj.mimeTypeArray[i];

        // MineType名字表示; 处理名字为灰色的
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
var MimeTypeArray = function MimeTypeArray() {
    debugger;
    throw new TypeError('MimeTypeArray  不允许被new');
}; mframe.safefunction(MimeTypeArray)
Object.defineProperties(MimeTypeArray.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeTypeArray ",
        configurable: true,
    }
})

mimeTypes= {}
//////////////////////////////////
mimeTypes.length = 2; 
//////////////////////////////////

mimeTypes.__proto__ = MimeTypeArray.prototype;
/**代理 */
mimeTypes = mframe.proxy(mimeTypes)

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
Navigator.prototype.plugins = []; // TODO "浏览器插件"先简单补
navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36';

navigator.webdriver = false;
navigator.language = 'zh-CN';
navigator.languages = ['zh-CN', 'en', 'zh']


navigator.mimeTypes = mimeTypes;
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
Node.prototype["appendChild"] = function appendChild() { debugger; }; mframe.safefunction(Node.prototype["appendChild"]);
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
Node.prototype["removeChild"] = function removeChild() { debugger; }; mframe.safefunction(Node.prototype["removeChild"]);
Node.prototype["replaceChild"] = function replaceChild() { debugger; }; mframe.safefunction(Node.prototype["replaceChild"]);
//==============↑↑Function END↑↑====================


////////////////Instance Instance Instance///////////////////

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

// 使用JSDOM的Element原型
var jsdomElement = Object.getPrototypeOf(_jsdom_document.documentElement);
// 复制JSDOM Element的关键方法和属性到我们的Element原型
for (let prop of Object.getOwnPropertyNames(jsdomElement)) {
    if (prop !== 'constructor' && prop !== '__proto__') {
        try {
            let descriptor = Object.getOwnPropertyDescriptor(jsdomElement, prop);
            if (descriptor && !Object.getOwnPropertyDescriptor(Element.prototype, prop)) {
                Object.defineProperty(Element.prototype, prop, descriptor);
            }
        } catch (e) {
            console.log(`无法复制属性: ${prop}`, e);
        }
    }
}

//////////////////////////////////
var curMemoryArea = mframe.memory.Element = {};

//============== Constant START ==================
Object.defineProperty(Element, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Element, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// namespaceURI
curMemoryArea.namespaceURI_getter = function namespaceURI() { debugger; }; mframe.safefunction(curMemoryArea.namespaceURI_getter);
Object.defineProperty(curMemoryArea.namespaceURI_getter, "name", { value: "get namespaceURI", configurable: true, });
Object.defineProperty(Element.prototype, "namespaceURI", { get: curMemoryArea.namespaceURI_getter, enumerable: true, configurable: true, });
curMemoryArea.namespaceURI_smart_getter = function namespaceURI() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的namespaceURI的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.namespaceURI_smart_getter);
Element.prototype.__defineGetter__("namespaceURI", curMemoryArea.namespaceURI_smart_getter);

// prefix
curMemoryArea.prefix_getter = function prefix() { debugger; }; mframe.safefunction(curMemoryArea.prefix_getter);
Object.defineProperty(curMemoryArea.prefix_getter, "name", { value: "get prefix", configurable: true, });
Object.defineProperty(Element.prototype, "prefix", { get: curMemoryArea.prefix_getter, enumerable: true, configurable: true, });
curMemoryArea.prefix_smart_getter = function prefix() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的prefix的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.prefix_smart_getter);
Element.prototype.__defineGetter__("prefix", curMemoryArea.prefix_smart_getter);

// localName
curMemoryArea.localName_getter = function localName() { debugger; }; mframe.safefunction(curMemoryArea.localName_getter);
Object.defineProperty(curMemoryArea.localName_getter, "name", { value: "get localName", configurable: true, });
Object.defineProperty(Element.prototype, "localName", { get: curMemoryArea.localName_getter, enumerable: true, configurable: true, });
curMemoryArea.localName_smart_getter = function localName() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的localName的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.localName_smart_getter);
Element.prototype.__defineGetter__("localName", curMemoryArea.localName_smart_getter);

// tagName
curMemoryArea.tagName_getter = function tagName() { debugger; }; mframe.safefunction(curMemoryArea.tagName_getter);
Object.defineProperty(curMemoryArea.tagName_getter, "name", { value: "get tagName", configurable: true, });
Object.defineProperty(Element.prototype, "tagName", { get: curMemoryArea.tagName_getter, enumerable: true, configurable: true, });
curMemoryArea.tagName_smart_getter = function tagName() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的tagName的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.tagName_smart_getter);
Element.prototype.__defineGetter__("tagName", curMemoryArea.tagName_smart_getter);

// id
curMemoryArea.id_getter = function id() { debugger; }; mframe.safefunction(curMemoryArea.id_getter);
Object.defineProperty(curMemoryArea.id_getter, "name", { value: "get id", configurable: true, });
// id
curMemoryArea.id_setter = function id(val) { debugger; }; mframe.safefunction(curMemoryArea.id_setter);
Object.defineProperty(curMemoryArea.id_setter, "name", { value: "set id", configurable: true, });
Object.defineProperty(Element.prototype, "id", { get: curMemoryArea.id_getter, set: curMemoryArea.id_setter, enumerable: true, configurable: true, });
curMemoryArea.id_smart_getter = function id() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的id的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.id_smart_getter);
Element.prototype.__defineGetter__("id", curMemoryArea.id_smart_getter);

// className
curMemoryArea.className_getter = function className() { debugger; }; mframe.safefunction(curMemoryArea.className_getter);
Object.defineProperty(curMemoryArea.className_getter, "name", { value: "get className", configurable: true, });
// className
curMemoryArea.className_setter = function className(val) { debugger; }; mframe.safefunction(curMemoryArea.className_setter);
Object.defineProperty(curMemoryArea.className_setter, "name", { value: "set className", configurable: true, });
Object.defineProperty(Element.prototype, "className", { get: curMemoryArea.className_getter, set: curMemoryArea.className_setter, enumerable: true, configurable: true, });
curMemoryArea.className_smart_getter = function className() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的className的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.className_smart_getter);
Element.prototype.__defineGetter__("className", curMemoryArea.className_smart_getter);

// classList
curMemoryArea.classList_getter = function classList() { debugger; }; mframe.safefunction(curMemoryArea.classList_getter);
Object.defineProperty(curMemoryArea.classList_getter, "name", { value: "get classList", configurable: true, });
// classList
curMemoryArea.classList_setter = function classList(val) { debugger; }; mframe.safefunction(curMemoryArea.classList_setter);
Object.defineProperty(curMemoryArea.classList_setter, "name", { value: "set classList", configurable: true, });
Object.defineProperty(Element.prototype, "classList", { get: curMemoryArea.classList_getter, set: curMemoryArea.classList_setter, enumerable: true, configurable: true, });
curMemoryArea.classList_smart_getter = function classList() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的classList的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.classList_smart_getter);
Element.prototype.__defineGetter__("classList", curMemoryArea.classList_smart_getter);

// slot
curMemoryArea.slot_getter = function slot() { debugger; }; mframe.safefunction(curMemoryArea.slot_getter);
Object.defineProperty(curMemoryArea.slot_getter, "name", { value: "get slot", configurable: true, });
// slot
curMemoryArea.slot_setter = function slot(val) { debugger; }; mframe.safefunction(curMemoryArea.slot_setter);
Object.defineProperty(curMemoryArea.slot_setter, "name", { value: "set slot", configurable: true, });
Object.defineProperty(Element.prototype, "slot", { get: curMemoryArea.slot_getter, set: curMemoryArea.slot_setter, enumerable: true, configurable: true, });
curMemoryArea.slot_smart_getter = function slot() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的slot的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.slot_smart_getter);
Element.prototype.__defineGetter__("slot", curMemoryArea.slot_smart_getter);

// attributes
curMemoryArea.attributes_getter = function attributes() { debugger; }; mframe.safefunction(curMemoryArea.attributes_getter);
Object.defineProperty(curMemoryArea.attributes_getter, "name", { value: "get attributes", configurable: true, });
Object.defineProperty(Element.prototype, "attributes", { get: curMemoryArea.attributes_getter, enumerable: true, configurable: true, });
curMemoryArea.attributes_smart_getter = function attributes() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的attributes的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.attributes_smart_getter);
Element.prototype.__defineGetter__("attributes", curMemoryArea.attributes_smart_getter);

// shadowRoot
curMemoryArea.shadowRoot_getter = function shadowRoot() { debugger; }; mframe.safefunction(curMemoryArea.shadowRoot_getter);
Object.defineProperty(curMemoryArea.shadowRoot_getter, "name", { value: "get shadowRoot", configurable: true, });
Object.defineProperty(Element.prototype, "shadowRoot", { get: curMemoryArea.shadowRoot_getter, enumerable: true, configurable: true, });
curMemoryArea.shadowRoot_smart_getter = function shadowRoot() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的shadowRoot的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.shadowRoot_smart_getter);
Element.prototype.__defineGetter__("shadowRoot", curMemoryArea.shadowRoot_smart_getter);

// part
curMemoryArea.part_getter = function part() { debugger; }; mframe.safefunction(curMemoryArea.part_getter);
Object.defineProperty(curMemoryArea.part_getter, "name", { value: "get part", configurable: true, });
// part
curMemoryArea.part_setter = function part(val) { debugger; }; mframe.safefunction(curMemoryArea.part_setter);
Object.defineProperty(curMemoryArea.part_setter, "name", { value: "set part", configurable: true, });
Object.defineProperty(Element.prototype, "part", { get: curMemoryArea.part_getter, set: curMemoryArea.part_setter, enumerable: true, configurable: true, });
curMemoryArea.part_smart_getter = function part() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的part的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.part_smart_getter);
Element.prototype.__defineGetter__("part", curMemoryArea.part_smart_getter);

// assignedSlot
curMemoryArea.assignedSlot_getter = function assignedSlot() { debugger; }; mframe.safefunction(curMemoryArea.assignedSlot_getter);
Object.defineProperty(curMemoryArea.assignedSlot_getter, "name", { value: "get assignedSlot", configurable: true, });
Object.defineProperty(Element.prototype, "assignedSlot", { get: curMemoryArea.assignedSlot_getter, enumerable: true, configurable: true, });
curMemoryArea.assignedSlot_smart_getter = function assignedSlot() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的assignedSlot的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.assignedSlot_smart_getter);
Element.prototype.__defineGetter__("assignedSlot", curMemoryArea.assignedSlot_smart_getter);

// innerHTML
curMemoryArea.innerHTML_getter = function innerHTML() { 
    // 如果有关联的JSDOM元素，使用它的innerHTML
    // if (this._jsdom_element) {
        // return this._jsdom_element.innerHTML;
    // }
    // 否则返回存储的值或默认值
    return this._innerHTML || "";
}; mframe.safefunction(curMemoryArea.innerHTML_getter);
Object.defineProperty(curMemoryArea.innerHTML_getter, "name", { value: "get innerHTML", configurable: true, });

// innerHTML
curMemoryArea.innerHTML_setter = function innerHTML(val) {
    console.log("Element innerHTML_setter: ", val);
    // 使用JSDOM的innerHTML实现
    // if (this._jsdom_element) {
        // this._jsdom_element.innerHTML = val;
    // }
    // 同时存储在我们的对象中
    this._innerHTML = val;
}; mframe.safefunction(curMemoryArea.innerHTML_setter);
Object.defineProperty(curMemoryArea.innerHTML_setter, "name", { value: "set innerHTML", configurable: true, });
Object.defineProperty(Element.prototype, "innerHTML", { 
    get: curMemoryArea.innerHTML_getter, 
    set: curMemoryArea.innerHTML_setter, 
    enumerable: true, 
    configurable: true 
});

// 覆盖smart_getter，使用我们的实现
Element.prototype.__defineGetter__("innerHTML", curMemoryArea.innerHTML_getter);

// outerHTML
curMemoryArea.outerHTML_getter = function outerHTML() { debugger; }; mframe.safefunction(curMemoryArea.outerHTML_getter);
Object.defineProperty(curMemoryArea.outerHTML_getter, "name", { value: "get outerHTML", configurable: true, });
// outerHTML
curMemoryArea.outerHTML_setter = function outerHTML(val) { debugger; }; mframe.safefunction(curMemoryArea.outerHTML_setter);
Object.defineProperty(curMemoryArea.outerHTML_setter, "name", { value: "set outerHTML", configurable: true, });
Object.defineProperty(Element.prototype, "outerHTML", { get: curMemoryArea.outerHTML_getter, set: curMemoryArea.outerHTML_setter, enumerable: true, configurable: true, });
curMemoryArea.outerHTML_smart_getter = function outerHTML() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的outerHTML的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.outerHTML_smart_getter);
Element.prototype.__defineGetter__("outerHTML", curMemoryArea.outerHTML_smart_getter);

// scrollTop
curMemoryArea.scrollTop_getter = function scrollTop() { debugger; }; mframe.safefunction(curMemoryArea.scrollTop_getter);
Object.defineProperty(curMemoryArea.scrollTop_getter, "name", { value: "get scrollTop", configurable: true, });
// scrollTop
curMemoryArea.scrollTop_setter = function scrollTop(val) { debugger; }; mframe.safefunction(curMemoryArea.scrollTop_setter);
Object.defineProperty(curMemoryArea.scrollTop_setter, "name", { value: "set scrollTop", configurable: true, });
Object.defineProperty(Element.prototype, "scrollTop", { get: curMemoryArea.scrollTop_getter, set: curMemoryArea.scrollTop_setter, enumerable: true, configurable: true, });
curMemoryArea.scrollTop_smart_getter = function scrollTop() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的scrollTop的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollTop_smart_getter);
Element.prototype.__defineGetter__("scrollTop", curMemoryArea.scrollTop_smart_getter);

// scrollLeft
curMemoryArea.scrollLeft_getter = function scrollLeft() { debugger; }; mframe.safefunction(curMemoryArea.scrollLeft_getter);
Object.defineProperty(curMemoryArea.scrollLeft_getter, "name", { value: "get scrollLeft", configurable: true, });
// scrollLeft
curMemoryArea.scrollLeft_setter = function scrollLeft(val) { debugger; }; mframe.safefunction(curMemoryArea.scrollLeft_setter);
Object.defineProperty(curMemoryArea.scrollLeft_setter, "name", { value: "set scrollLeft", configurable: true, });
Object.defineProperty(Element.prototype, "scrollLeft", { get: curMemoryArea.scrollLeft_getter, set: curMemoryArea.scrollLeft_setter, enumerable: true, configurable: true, });
curMemoryArea.scrollLeft_smart_getter = function scrollLeft() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的scrollLeft的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollLeft_smart_getter);
Element.prototype.__defineGetter__("scrollLeft", curMemoryArea.scrollLeft_smart_getter);

// scrollWidth
curMemoryArea.scrollWidth_getter = function scrollWidth() { debugger; }; mframe.safefunction(curMemoryArea.scrollWidth_getter);
Object.defineProperty(curMemoryArea.scrollWidth_getter, "name", { value: "get scrollWidth", configurable: true, });
Object.defineProperty(Element.prototype, "scrollWidth", { get: curMemoryArea.scrollWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollWidth_smart_getter = function scrollWidth() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的scrollWidth的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollWidth_smart_getter);
Element.prototype.__defineGetter__("scrollWidth", curMemoryArea.scrollWidth_smart_getter);

// scrollHeight
curMemoryArea.scrollHeight_getter = function scrollHeight() { debugger; }; mframe.safefunction(curMemoryArea.scrollHeight_getter);
Object.defineProperty(curMemoryArea.scrollHeight_getter, "name", { value: "get scrollHeight", configurable: true, });
Object.defineProperty(Element.prototype, "scrollHeight", { get: curMemoryArea.scrollHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollHeight_smart_getter = function scrollHeight() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的scrollHeight的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollHeight_smart_getter);
Element.prototype.__defineGetter__("scrollHeight", curMemoryArea.scrollHeight_smart_getter);

// clientTop
curMemoryArea.clientTop_getter = function clientTop() { debugger; }; mframe.safefunction(curMemoryArea.clientTop_getter);
Object.defineProperty(curMemoryArea.clientTop_getter, "name", { value: "get clientTop", configurable: true, });
Object.defineProperty(Element.prototype, "clientTop", { get: curMemoryArea.clientTop_getter, enumerable: true, configurable: true, });
curMemoryArea.clientTop_smart_getter = function clientTop() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的clientTop的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.clientTop_smart_getter);
Element.prototype.__defineGetter__("clientTop", curMemoryArea.clientTop_smart_getter);

// clientLeft
curMemoryArea.clientLeft_getter = function clientLeft() { debugger; }; mframe.safefunction(curMemoryArea.clientLeft_getter);
Object.defineProperty(curMemoryArea.clientLeft_getter, "name", { value: "get clientLeft", configurable: true, });
Object.defineProperty(Element.prototype, "clientLeft", { get: curMemoryArea.clientLeft_getter, enumerable: true, configurable: true, });
curMemoryArea.clientLeft_smart_getter = function clientLeft() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的clientLeft的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.clientLeft_smart_getter);
Element.prototype.__defineGetter__("clientLeft", curMemoryArea.clientLeft_smart_getter);

// clientWidth
curMemoryArea.clientWidth_getter = function clientWidth() { debugger; }; mframe.safefunction(curMemoryArea.clientWidth_getter);
Object.defineProperty(curMemoryArea.clientWidth_getter, "name", { value: "get clientWidth", configurable: true, });
Object.defineProperty(Element.prototype, "clientWidth", { get: curMemoryArea.clientWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.clientWidth_smart_getter = function clientWidth() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的clientWidth的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.clientWidth_smart_getter);
Element.prototype.__defineGetter__("clientWidth", curMemoryArea.clientWidth_smart_getter);

// clientHeight
curMemoryArea.clientHeight_getter = function clientHeight() { debugger; }; mframe.safefunction(curMemoryArea.clientHeight_getter);
Object.defineProperty(curMemoryArea.clientHeight_getter, "name", { value: "get clientHeight", configurable: true, });
Object.defineProperty(Element.prototype, "clientHeight", { get: curMemoryArea.clientHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.clientHeight_smart_getter = function clientHeight() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的clientHeight的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.clientHeight_smart_getter);
Element.prototype.__defineGetter__("clientHeight", curMemoryArea.clientHeight_smart_getter);

// onbeforecopy
curMemoryArea.onbeforecopy_getter = function onbeforecopy() { debugger; }; mframe.safefunction(curMemoryArea.onbeforecopy_getter);
Object.defineProperty(curMemoryArea.onbeforecopy_getter, "name", { value: "get onbeforecopy", configurable: true, });
// onbeforecopy
curMemoryArea.onbeforecopy_setter = function onbeforecopy(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforecopy_setter);
Object.defineProperty(curMemoryArea.onbeforecopy_setter, "name", { value: "set onbeforecopy", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforecopy", { get: curMemoryArea.onbeforecopy_getter, set: curMemoryArea.onbeforecopy_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecopy_smart_getter = function onbeforecopy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onbeforecopy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforecopy_smart_getter);
Element.prototype.__defineGetter__("onbeforecopy", curMemoryArea.onbeforecopy_smart_getter);

// onbeforecut
curMemoryArea.onbeforecut_getter = function onbeforecut() { debugger; }; mframe.safefunction(curMemoryArea.onbeforecut_getter);
Object.defineProperty(curMemoryArea.onbeforecut_getter, "name", { value: "get onbeforecut", configurable: true, });
// onbeforecut
curMemoryArea.onbeforecut_setter = function onbeforecut(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforecut_setter);
Object.defineProperty(curMemoryArea.onbeforecut_setter, "name", { value: "set onbeforecut", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforecut", { get: curMemoryArea.onbeforecut_getter, set: curMemoryArea.onbeforecut_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecut_smart_getter = function onbeforecut() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onbeforecut的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforecut_smart_getter);
Element.prototype.__defineGetter__("onbeforecut", curMemoryArea.onbeforecut_smart_getter);

// onbeforepaste
curMemoryArea.onbeforepaste_getter = function onbeforepaste() { debugger; }; mframe.safefunction(curMemoryArea.onbeforepaste_getter);
Object.defineProperty(curMemoryArea.onbeforepaste_getter, "name", { value: "get onbeforepaste", configurable: true, });
// onbeforepaste
curMemoryArea.onbeforepaste_setter = function onbeforepaste(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforepaste_setter);
Object.defineProperty(curMemoryArea.onbeforepaste_setter, "name", { value: "set onbeforepaste", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforepaste", { get: curMemoryArea.onbeforepaste_getter, set: curMemoryArea.onbeforepaste_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforepaste_smart_getter = function onbeforepaste() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onbeforepaste的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforepaste_smart_getter);
Element.prototype.__defineGetter__("onbeforepaste", curMemoryArea.onbeforepaste_smart_getter);

// onsearch
curMemoryArea.onsearch_getter = function onsearch() { debugger; }; mframe.safefunction(curMemoryArea.onsearch_getter);
Object.defineProperty(curMemoryArea.onsearch_getter, "name", { value: "get onsearch", configurable: true, });
// onsearch
curMemoryArea.onsearch_setter = function onsearch(val) { debugger; }; mframe.safefunction(curMemoryArea.onsearch_setter);
Object.defineProperty(curMemoryArea.onsearch_setter, "name", { value: "set onsearch", configurable: true, });
Object.defineProperty(Element.prototype, "onsearch", { get: curMemoryArea.onsearch_getter, set: curMemoryArea.onsearch_setter, enumerable: true, configurable: true, });
curMemoryArea.onsearch_smart_getter = function onsearch() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onsearch的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsearch_smart_getter);
Element.prototype.__defineGetter__("onsearch", curMemoryArea.onsearch_smart_getter);

// elementTiming
curMemoryArea.elementTiming_getter = function elementTiming() { debugger; }; mframe.safefunction(curMemoryArea.elementTiming_getter);
Object.defineProperty(curMemoryArea.elementTiming_getter, "name", { value: "get elementTiming", configurable: true, });
// elementTiming
curMemoryArea.elementTiming_setter = function elementTiming(val) { debugger; }; mframe.safefunction(curMemoryArea.elementTiming_setter);
Object.defineProperty(curMemoryArea.elementTiming_setter, "name", { value: "set elementTiming", configurable: true, });
Object.defineProperty(Element.prototype, "elementTiming", { get: curMemoryArea.elementTiming_getter, set: curMemoryArea.elementTiming_setter, enumerable: true, configurable: true, });
curMemoryArea.elementTiming_smart_getter = function elementTiming() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的elementTiming的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.elementTiming_smart_getter);
Element.prototype.__defineGetter__("elementTiming", curMemoryArea.elementTiming_smart_getter);

// onfullscreenchange
curMemoryArea.onfullscreenchange_getter = function onfullscreenchange() { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onfullscreenchange_getter, "name", { value: "get onfullscreenchange", configurable: true, });
// onfullscreenchange
curMemoryArea.onfullscreenchange_setter = function onfullscreenchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onfullscreenchange_setter, "name", { value: "set onfullscreenchange", configurable: true, });
Object.defineProperty(Element.prototype, "onfullscreenchange", { get: curMemoryArea.onfullscreenchange_getter, set: curMemoryArea.onfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenchange_smart_getter = function onfullscreenchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onfullscreenchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfullscreenchange_smart_getter);
Element.prototype.__defineGetter__("onfullscreenchange", curMemoryArea.onfullscreenchange_smart_getter);

// onfullscreenerror
curMemoryArea.onfullscreenerror_getter = function onfullscreenerror() { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onfullscreenerror_getter, "name", { value: "get onfullscreenerror", configurable: true, });
// onfullscreenerror
curMemoryArea.onfullscreenerror_setter = function onfullscreenerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onfullscreenerror_setter, "name", { value: "set onfullscreenerror", configurable: true, });
Object.defineProperty(Element.prototype, "onfullscreenerror", { get: curMemoryArea.onfullscreenerror_getter, set: curMemoryArea.onfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenerror_smart_getter = function onfullscreenerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onfullscreenerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfullscreenerror_smart_getter);
Element.prototype.__defineGetter__("onfullscreenerror", curMemoryArea.onfullscreenerror_smart_getter);

// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_getter = function onwebkitfullscreenchange() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_getter, "name", { value: "get onwebkitfullscreenchange", configurable: true, });
// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_setter = function onwebkitfullscreenchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_setter, "name", { value: "set onwebkitfullscreenchange", configurable: true, });
Object.defineProperty(Element.prototype, "onwebkitfullscreenchange", { get: curMemoryArea.onwebkitfullscreenchange_getter, set: curMemoryArea.onwebkitfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenchange_smart_getter = function onwebkitfullscreenchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onwebkitfullscreenchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_smart_getter);
Element.prototype.__defineGetter__("onwebkitfullscreenchange", curMemoryArea.onwebkitfullscreenchange_smart_getter);

// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_getter = function onwebkitfullscreenerror() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_getter, "name", { value: "get onwebkitfullscreenerror", configurable: true, });
// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_setter = function onwebkitfullscreenerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_setter, "name", { value: "set onwebkitfullscreenerror", configurable: true, });
Object.defineProperty(Element.prototype, "onwebkitfullscreenerror", { get: curMemoryArea.onwebkitfullscreenerror_getter, set: curMemoryArea.onwebkitfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenerror_smart_getter = function onwebkitfullscreenerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onwebkitfullscreenerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_smart_getter);
Element.prototype.__defineGetter__("onwebkitfullscreenerror", curMemoryArea.onwebkitfullscreenerror_smart_getter);

// role
curMemoryArea.role_getter = function role() { debugger; }; mframe.safefunction(curMemoryArea.role_getter);
Object.defineProperty(curMemoryArea.role_getter, "name", { value: "get role", configurable: true, });
// role
curMemoryArea.role_setter = function role(val) { debugger; }; mframe.safefunction(curMemoryArea.role_setter);
Object.defineProperty(curMemoryArea.role_setter, "name", { value: "set role", configurable: true, });
Object.defineProperty(Element.prototype, "role", { get: curMemoryArea.role_getter, set: curMemoryArea.role_setter, enumerable: true, configurable: true, });
curMemoryArea.role_smart_getter = function role() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的role的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.role_smart_getter);
Element.prototype.__defineGetter__("role", curMemoryArea.role_smart_getter);

// ariaAtomic
curMemoryArea.ariaAtomic_getter = function ariaAtomic() { debugger; }; mframe.safefunction(curMemoryArea.ariaAtomic_getter);
Object.defineProperty(curMemoryArea.ariaAtomic_getter, "name", { value: "get ariaAtomic", configurable: true, });
// ariaAtomic
curMemoryArea.ariaAtomic_setter = function ariaAtomic(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaAtomic_setter);
Object.defineProperty(curMemoryArea.ariaAtomic_setter, "name", { value: "set ariaAtomic", configurable: true, });
Object.defineProperty(Element.prototype, "ariaAtomic", { get: curMemoryArea.ariaAtomic_getter, set: curMemoryArea.ariaAtomic_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaAtomic_smart_getter = function ariaAtomic() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaAtomic的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaAtomic_smart_getter);
Element.prototype.__defineGetter__("ariaAtomic", curMemoryArea.ariaAtomic_smart_getter);

// ariaAutoComplete
curMemoryArea.ariaAutoComplete_getter = function ariaAutoComplete() { debugger; }; mframe.safefunction(curMemoryArea.ariaAutoComplete_getter);
Object.defineProperty(curMemoryArea.ariaAutoComplete_getter, "name", { value: "get ariaAutoComplete", configurable: true, });
// ariaAutoComplete
curMemoryArea.ariaAutoComplete_setter = function ariaAutoComplete(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaAutoComplete_setter);
Object.defineProperty(curMemoryArea.ariaAutoComplete_setter, "name", { value: "set ariaAutoComplete", configurable: true, });
Object.defineProperty(Element.prototype, "ariaAutoComplete", { get: curMemoryArea.ariaAutoComplete_getter, set: curMemoryArea.ariaAutoComplete_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaAutoComplete_smart_getter = function ariaAutoComplete() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaAutoComplete的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaAutoComplete_smart_getter);
Element.prototype.__defineGetter__("ariaAutoComplete", curMemoryArea.ariaAutoComplete_smart_getter);

// ariaBusy
curMemoryArea.ariaBusy_getter = function ariaBusy() { debugger; }; mframe.safefunction(curMemoryArea.ariaBusy_getter);
Object.defineProperty(curMemoryArea.ariaBusy_getter, "name", { value: "get ariaBusy", configurable: true, });
// ariaBusy
curMemoryArea.ariaBusy_setter = function ariaBusy(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaBusy_setter);
Object.defineProperty(curMemoryArea.ariaBusy_setter, "name", { value: "set ariaBusy", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBusy", { get: curMemoryArea.ariaBusy_getter, set: curMemoryArea.ariaBusy_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBusy_smart_getter = function ariaBusy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaBusy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaBusy_smart_getter);
Element.prototype.__defineGetter__("ariaBusy", curMemoryArea.ariaBusy_smart_getter);

// ariaBrailleLabel
curMemoryArea.ariaBrailleLabel_getter = function ariaBrailleLabel() { debugger; }; mframe.safefunction(curMemoryArea.ariaBrailleLabel_getter);
Object.defineProperty(curMemoryArea.ariaBrailleLabel_getter, "name", { value: "get ariaBrailleLabel", configurable: true, });
// ariaBrailleLabel
curMemoryArea.ariaBrailleLabel_setter = function ariaBrailleLabel(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaBrailleLabel_setter);
Object.defineProperty(curMemoryArea.ariaBrailleLabel_setter, "name", { value: "set ariaBrailleLabel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBrailleLabel", { get: curMemoryArea.ariaBrailleLabel_getter, set: curMemoryArea.ariaBrailleLabel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBrailleLabel_smart_getter = function ariaBrailleLabel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaBrailleLabel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaBrailleLabel_smart_getter);
Element.prototype.__defineGetter__("ariaBrailleLabel", curMemoryArea.ariaBrailleLabel_smart_getter);

// ariaBrailleRoleDescription
curMemoryArea.ariaBrailleRoleDescription_getter = function ariaBrailleRoleDescription() { debugger; }; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_getter);
Object.defineProperty(curMemoryArea.ariaBrailleRoleDescription_getter, "name", { value: "get ariaBrailleRoleDescription", configurable: true, });
// ariaBrailleRoleDescription
curMemoryArea.ariaBrailleRoleDescription_setter = function ariaBrailleRoleDescription(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_setter);
Object.defineProperty(curMemoryArea.ariaBrailleRoleDescription_setter, "name", { value: "set ariaBrailleRoleDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBrailleRoleDescription", { get: curMemoryArea.ariaBrailleRoleDescription_getter, set: curMemoryArea.ariaBrailleRoleDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBrailleRoleDescription_smart_getter = function ariaBrailleRoleDescription() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaBrailleRoleDescription的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_smart_getter);
Element.prototype.__defineGetter__("ariaBrailleRoleDescription", curMemoryArea.ariaBrailleRoleDescription_smart_getter);

// ariaChecked
curMemoryArea.ariaChecked_getter = function ariaChecked() { debugger; }; mframe.safefunction(curMemoryArea.ariaChecked_getter);
Object.defineProperty(curMemoryArea.ariaChecked_getter, "name", { value: "get ariaChecked", configurable: true, });
// ariaChecked
curMemoryArea.ariaChecked_setter = function ariaChecked(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaChecked_setter);
Object.defineProperty(curMemoryArea.ariaChecked_setter, "name", { value: "set ariaChecked", configurable: true, });
Object.defineProperty(Element.prototype, "ariaChecked", { get: curMemoryArea.ariaChecked_getter, set: curMemoryArea.ariaChecked_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaChecked_smart_getter = function ariaChecked() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaChecked的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaChecked_smart_getter);
Element.prototype.__defineGetter__("ariaChecked", curMemoryArea.ariaChecked_smart_getter);

// ariaColCount
curMemoryArea.ariaColCount_getter = function ariaColCount() { debugger; }; mframe.safefunction(curMemoryArea.ariaColCount_getter);
Object.defineProperty(curMemoryArea.ariaColCount_getter, "name", { value: "get ariaColCount", configurable: true, });
// ariaColCount
curMemoryArea.ariaColCount_setter = function ariaColCount(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaColCount_setter);
Object.defineProperty(curMemoryArea.ariaColCount_setter, "name", { value: "set ariaColCount", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColCount", { get: curMemoryArea.ariaColCount_getter, set: curMemoryArea.ariaColCount_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColCount_smart_getter = function ariaColCount() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaColCount的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaColCount_smart_getter);
Element.prototype.__defineGetter__("ariaColCount", curMemoryArea.ariaColCount_smart_getter);

// ariaColIndex
curMemoryArea.ariaColIndex_getter = function ariaColIndex() { debugger; }; mframe.safefunction(curMemoryArea.ariaColIndex_getter);
Object.defineProperty(curMemoryArea.ariaColIndex_getter, "name", { value: "get ariaColIndex", configurable: true, });
// ariaColIndex
curMemoryArea.ariaColIndex_setter = function ariaColIndex(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaColIndex_setter);
Object.defineProperty(curMemoryArea.ariaColIndex_setter, "name", { value: "set ariaColIndex", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColIndex", { get: curMemoryArea.ariaColIndex_getter, set: curMemoryArea.ariaColIndex_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColIndex_smart_getter = function ariaColIndex() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaColIndex的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaColIndex_smart_getter);
Element.prototype.__defineGetter__("ariaColIndex", curMemoryArea.ariaColIndex_smart_getter);

// ariaColSpan
curMemoryArea.ariaColSpan_getter = function ariaColSpan() { debugger; }; mframe.safefunction(curMemoryArea.ariaColSpan_getter);
Object.defineProperty(curMemoryArea.ariaColSpan_getter, "name", { value: "get ariaColSpan", configurable: true, });
// ariaColSpan
curMemoryArea.ariaColSpan_setter = function ariaColSpan(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaColSpan_setter);
Object.defineProperty(curMemoryArea.ariaColSpan_setter, "name", { value: "set ariaColSpan", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColSpan", { get: curMemoryArea.ariaColSpan_getter, set: curMemoryArea.ariaColSpan_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColSpan_smart_getter = function ariaColSpan() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaColSpan的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaColSpan_smart_getter);
Element.prototype.__defineGetter__("ariaColSpan", curMemoryArea.ariaColSpan_smart_getter);

// ariaCurrent
curMemoryArea.ariaCurrent_getter = function ariaCurrent() { debugger; }; mframe.safefunction(curMemoryArea.ariaCurrent_getter);
Object.defineProperty(curMemoryArea.ariaCurrent_getter, "name", { value: "get ariaCurrent", configurable: true, });
// ariaCurrent
curMemoryArea.ariaCurrent_setter = function ariaCurrent(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaCurrent_setter);
Object.defineProperty(curMemoryArea.ariaCurrent_setter, "name", { value: "set ariaCurrent", configurable: true, });
Object.defineProperty(Element.prototype, "ariaCurrent", { get: curMemoryArea.ariaCurrent_getter, set: curMemoryArea.ariaCurrent_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaCurrent_smart_getter = function ariaCurrent() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaCurrent的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaCurrent_smart_getter);
Element.prototype.__defineGetter__("ariaCurrent", curMemoryArea.ariaCurrent_smart_getter);

// ariaDescription
curMemoryArea.ariaDescription_getter = function ariaDescription() { debugger; }; mframe.safefunction(curMemoryArea.ariaDescription_getter);
Object.defineProperty(curMemoryArea.ariaDescription_getter, "name", { value: "get ariaDescription", configurable: true, });
// ariaDescription
curMemoryArea.ariaDescription_setter = function ariaDescription(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaDescription_setter);
Object.defineProperty(curMemoryArea.ariaDescription_setter, "name", { value: "set ariaDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDescription", { get: curMemoryArea.ariaDescription_getter, set: curMemoryArea.ariaDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDescription_smart_getter = function ariaDescription() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaDescription的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaDescription_smart_getter);
Element.prototype.__defineGetter__("ariaDescription", curMemoryArea.ariaDescription_smart_getter);

// ariaDisabled
curMemoryArea.ariaDisabled_getter = function ariaDisabled() { debugger; }; mframe.safefunction(curMemoryArea.ariaDisabled_getter);
Object.defineProperty(curMemoryArea.ariaDisabled_getter, "name", { value: "get ariaDisabled", configurable: true, });
// ariaDisabled
curMemoryArea.ariaDisabled_setter = function ariaDisabled(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaDisabled_setter);
Object.defineProperty(curMemoryArea.ariaDisabled_setter, "name", { value: "set ariaDisabled", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDisabled", { get: curMemoryArea.ariaDisabled_getter, set: curMemoryArea.ariaDisabled_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDisabled_smart_getter = function ariaDisabled() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaDisabled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaDisabled_smart_getter);
Element.prototype.__defineGetter__("ariaDisabled", curMemoryArea.ariaDisabled_smart_getter);

// ariaExpanded
curMemoryArea.ariaExpanded_getter = function ariaExpanded() { debugger; }; mframe.safefunction(curMemoryArea.ariaExpanded_getter);
Object.defineProperty(curMemoryArea.ariaExpanded_getter, "name", { value: "get ariaExpanded", configurable: true, });
// ariaExpanded
curMemoryArea.ariaExpanded_setter = function ariaExpanded(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaExpanded_setter);
Object.defineProperty(curMemoryArea.ariaExpanded_setter, "name", { value: "set ariaExpanded", configurable: true, });
Object.defineProperty(Element.prototype, "ariaExpanded", { get: curMemoryArea.ariaExpanded_getter, set: curMemoryArea.ariaExpanded_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaExpanded_smart_getter = function ariaExpanded() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaExpanded的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaExpanded_smart_getter);
Element.prototype.__defineGetter__("ariaExpanded", curMemoryArea.ariaExpanded_smart_getter);

// ariaHasPopup
curMemoryArea.ariaHasPopup_getter = function ariaHasPopup() { debugger; }; mframe.safefunction(curMemoryArea.ariaHasPopup_getter);
Object.defineProperty(curMemoryArea.ariaHasPopup_getter, "name", { value: "get ariaHasPopup", configurable: true, });
// ariaHasPopup
curMemoryArea.ariaHasPopup_setter = function ariaHasPopup(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaHasPopup_setter);
Object.defineProperty(curMemoryArea.ariaHasPopup_setter, "name", { value: "set ariaHasPopup", configurable: true, });
Object.defineProperty(Element.prototype, "ariaHasPopup", { get: curMemoryArea.ariaHasPopup_getter, set: curMemoryArea.ariaHasPopup_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaHasPopup_smart_getter = function ariaHasPopup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaHasPopup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaHasPopup_smart_getter);
Element.prototype.__defineGetter__("ariaHasPopup", curMemoryArea.ariaHasPopup_smart_getter);

// ariaHidden
curMemoryArea.ariaHidden_getter = function ariaHidden() { debugger; }; mframe.safefunction(curMemoryArea.ariaHidden_getter);
Object.defineProperty(curMemoryArea.ariaHidden_getter, "name", { value: "get ariaHidden", configurable: true, });
// ariaHidden
curMemoryArea.ariaHidden_setter = function ariaHidden(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaHidden_setter);
Object.defineProperty(curMemoryArea.ariaHidden_setter, "name", { value: "set ariaHidden", configurable: true, });
Object.defineProperty(Element.prototype, "ariaHidden", { get: curMemoryArea.ariaHidden_getter, set: curMemoryArea.ariaHidden_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaHidden_smart_getter = function ariaHidden() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaHidden的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaHidden_smart_getter);
Element.prototype.__defineGetter__("ariaHidden", curMemoryArea.ariaHidden_smart_getter);

// ariaInvalid
curMemoryArea.ariaInvalid_getter = function ariaInvalid() { debugger; }; mframe.safefunction(curMemoryArea.ariaInvalid_getter);
Object.defineProperty(curMemoryArea.ariaInvalid_getter, "name", { value: "get ariaInvalid", configurable: true, });
// ariaInvalid
curMemoryArea.ariaInvalid_setter = function ariaInvalid(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaInvalid_setter);
Object.defineProperty(curMemoryArea.ariaInvalid_setter, "name", { value: "set ariaInvalid", configurable: true, });
Object.defineProperty(Element.prototype, "ariaInvalid", { get: curMemoryArea.ariaInvalid_getter, set: curMemoryArea.ariaInvalid_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaInvalid_smart_getter = function ariaInvalid() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaInvalid的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaInvalid_smart_getter);
Element.prototype.__defineGetter__("ariaInvalid", curMemoryArea.ariaInvalid_smart_getter);

// ariaKeyShortcuts
curMemoryArea.ariaKeyShortcuts_getter = function ariaKeyShortcuts() { debugger; }; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_getter);
Object.defineProperty(curMemoryArea.ariaKeyShortcuts_getter, "name", { value: "get ariaKeyShortcuts", configurable: true, });
// ariaKeyShortcuts
curMemoryArea.ariaKeyShortcuts_setter = function ariaKeyShortcuts(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_setter);
Object.defineProperty(curMemoryArea.ariaKeyShortcuts_setter, "name", { value: "set ariaKeyShortcuts", configurable: true, });
Object.defineProperty(Element.prototype, "ariaKeyShortcuts", { get: curMemoryArea.ariaKeyShortcuts_getter, set: curMemoryArea.ariaKeyShortcuts_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaKeyShortcuts_smart_getter = function ariaKeyShortcuts() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaKeyShortcuts的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_smart_getter);
Element.prototype.__defineGetter__("ariaKeyShortcuts", curMemoryArea.ariaKeyShortcuts_smart_getter);

// ariaLabel
curMemoryArea.ariaLabel_getter = function ariaLabel() { debugger; }; mframe.safefunction(curMemoryArea.ariaLabel_getter);
Object.defineProperty(curMemoryArea.ariaLabel_getter, "name", { value: "get ariaLabel", configurable: true, });
// ariaLabel
curMemoryArea.ariaLabel_setter = function ariaLabel(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaLabel_setter);
Object.defineProperty(curMemoryArea.ariaLabel_setter, "name", { value: "set ariaLabel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLabel", { get: curMemoryArea.ariaLabel_getter, set: curMemoryArea.ariaLabel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLabel_smart_getter = function ariaLabel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaLabel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaLabel_smart_getter);
Element.prototype.__defineGetter__("ariaLabel", curMemoryArea.ariaLabel_smart_getter);

// ariaLevel
curMemoryArea.ariaLevel_getter = function ariaLevel() { debugger; }; mframe.safefunction(curMemoryArea.ariaLevel_getter);
Object.defineProperty(curMemoryArea.ariaLevel_getter, "name", { value: "get ariaLevel", configurable: true, });
// ariaLevel
curMemoryArea.ariaLevel_setter = function ariaLevel(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaLevel_setter);
Object.defineProperty(curMemoryArea.ariaLevel_setter, "name", { value: "set ariaLevel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLevel", { get: curMemoryArea.ariaLevel_getter, set: curMemoryArea.ariaLevel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLevel_smart_getter = function ariaLevel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaLevel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaLevel_smart_getter);
Element.prototype.__defineGetter__("ariaLevel", curMemoryArea.ariaLevel_smart_getter);

// ariaLive
curMemoryArea.ariaLive_getter = function ariaLive() { debugger; }; mframe.safefunction(curMemoryArea.ariaLive_getter);
Object.defineProperty(curMemoryArea.ariaLive_getter, "name", { value: "get ariaLive", configurable: true, });
// ariaLive
curMemoryArea.ariaLive_setter = function ariaLive(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaLive_setter);
Object.defineProperty(curMemoryArea.ariaLive_setter, "name", { value: "set ariaLive", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLive", { get: curMemoryArea.ariaLive_getter, set: curMemoryArea.ariaLive_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLive_smart_getter = function ariaLive() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaLive的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaLive_smart_getter);
Element.prototype.__defineGetter__("ariaLive", curMemoryArea.ariaLive_smart_getter);

// ariaModal
curMemoryArea.ariaModal_getter = function ariaModal() { debugger; }; mframe.safefunction(curMemoryArea.ariaModal_getter);
Object.defineProperty(curMemoryArea.ariaModal_getter, "name", { value: "get ariaModal", configurable: true, });
// ariaModal
curMemoryArea.ariaModal_setter = function ariaModal(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaModal_setter);
Object.defineProperty(curMemoryArea.ariaModal_setter, "name", { value: "set ariaModal", configurable: true, });
Object.defineProperty(Element.prototype, "ariaModal", { get: curMemoryArea.ariaModal_getter, set: curMemoryArea.ariaModal_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaModal_smart_getter = function ariaModal() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaModal的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaModal_smart_getter);
Element.prototype.__defineGetter__("ariaModal", curMemoryArea.ariaModal_smart_getter);

// ariaMultiLine
curMemoryArea.ariaMultiLine_getter = function ariaMultiLine() { debugger; }; mframe.safefunction(curMemoryArea.ariaMultiLine_getter);
Object.defineProperty(curMemoryArea.ariaMultiLine_getter, "name", { value: "get ariaMultiLine", configurable: true, });
// ariaMultiLine
curMemoryArea.ariaMultiLine_setter = function ariaMultiLine(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaMultiLine_setter);
Object.defineProperty(curMemoryArea.ariaMultiLine_setter, "name", { value: "set ariaMultiLine", configurable: true, });
Object.defineProperty(Element.prototype, "ariaMultiLine", { get: curMemoryArea.ariaMultiLine_getter, set: curMemoryArea.ariaMultiLine_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaMultiLine_smart_getter = function ariaMultiLine() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaMultiLine的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaMultiLine_smart_getter);
Element.prototype.__defineGetter__("ariaMultiLine", curMemoryArea.ariaMultiLine_smart_getter);

// ariaMultiSelectable
curMemoryArea.ariaMultiSelectable_getter = function ariaMultiSelectable() { debugger; }; mframe.safefunction(curMemoryArea.ariaMultiSelectable_getter);
Object.defineProperty(curMemoryArea.ariaMultiSelectable_getter, "name", { value: "get ariaMultiSelectable", configurable: true, });
// ariaMultiSelectable
curMemoryArea.ariaMultiSelectable_setter = function ariaMultiSelectable(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaMultiSelectable_setter);
Object.defineProperty(curMemoryArea.ariaMultiSelectable_setter, "name", { value: "set ariaMultiSelectable", configurable: true, });
Object.defineProperty(Element.prototype, "ariaMultiSelectable", { get: curMemoryArea.ariaMultiSelectable_getter, set: curMemoryArea.ariaMultiSelectable_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaMultiSelectable_smart_getter = function ariaMultiSelectable() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaMultiSelectable的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaMultiSelectable_smart_getter);
Element.prototype.__defineGetter__("ariaMultiSelectable", curMemoryArea.ariaMultiSelectable_smart_getter);

// ariaOrientation
curMemoryArea.ariaOrientation_getter = function ariaOrientation() { debugger; }; mframe.safefunction(curMemoryArea.ariaOrientation_getter);
Object.defineProperty(curMemoryArea.ariaOrientation_getter, "name", { value: "get ariaOrientation", configurable: true, });
// ariaOrientation
curMemoryArea.ariaOrientation_setter = function ariaOrientation(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaOrientation_setter);
Object.defineProperty(curMemoryArea.ariaOrientation_setter, "name", { value: "set ariaOrientation", configurable: true, });
Object.defineProperty(Element.prototype, "ariaOrientation", { get: curMemoryArea.ariaOrientation_getter, set: curMemoryArea.ariaOrientation_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaOrientation_smart_getter = function ariaOrientation() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaOrientation的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaOrientation_smart_getter);
Element.prototype.__defineGetter__("ariaOrientation", curMemoryArea.ariaOrientation_smart_getter);

// ariaPlaceholder
curMemoryArea.ariaPlaceholder_getter = function ariaPlaceholder() { debugger; }; mframe.safefunction(curMemoryArea.ariaPlaceholder_getter);
Object.defineProperty(curMemoryArea.ariaPlaceholder_getter, "name", { value: "get ariaPlaceholder", configurable: true, });
// ariaPlaceholder
curMemoryArea.ariaPlaceholder_setter = function ariaPlaceholder(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaPlaceholder_setter);
Object.defineProperty(curMemoryArea.ariaPlaceholder_setter, "name", { value: "set ariaPlaceholder", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPlaceholder", { get: curMemoryArea.ariaPlaceholder_getter, set: curMemoryArea.ariaPlaceholder_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPlaceholder_smart_getter = function ariaPlaceholder() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaPlaceholder的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaPlaceholder_smart_getter);
Element.prototype.__defineGetter__("ariaPlaceholder", curMemoryArea.ariaPlaceholder_smart_getter);

// ariaPosInSet
curMemoryArea.ariaPosInSet_getter = function ariaPosInSet() { debugger; }; mframe.safefunction(curMemoryArea.ariaPosInSet_getter);
Object.defineProperty(curMemoryArea.ariaPosInSet_getter, "name", { value: "get ariaPosInSet", configurable: true, });
// ariaPosInSet
curMemoryArea.ariaPosInSet_setter = function ariaPosInSet(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaPosInSet_setter);
Object.defineProperty(curMemoryArea.ariaPosInSet_setter, "name", { value: "set ariaPosInSet", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPosInSet", { get: curMemoryArea.ariaPosInSet_getter, set: curMemoryArea.ariaPosInSet_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPosInSet_smart_getter = function ariaPosInSet() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaPosInSet的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaPosInSet_smart_getter);
Element.prototype.__defineGetter__("ariaPosInSet", curMemoryArea.ariaPosInSet_smart_getter);

// ariaPressed
curMemoryArea.ariaPressed_getter = function ariaPressed() { debugger; }; mframe.safefunction(curMemoryArea.ariaPressed_getter);
Object.defineProperty(curMemoryArea.ariaPressed_getter, "name", { value: "get ariaPressed", configurable: true, });
// ariaPressed
curMemoryArea.ariaPressed_setter = function ariaPressed(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaPressed_setter);
Object.defineProperty(curMemoryArea.ariaPressed_setter, "name", { value: "set ariaPressed", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPressed", { get: curMemoryArea.ariaPressed_getter, set: curMemoryArea.ariaPressed_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPressed_smart_getter = function ariaPressed() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaPressed的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaPressed_smart_getter);
Element.prototype.__defineGetter__("ariaPressed", curMemoryArea.ariaPressed_smart_getter);

// ariaReadOnly
curMemoryArea.ariaReadOnly_getter = function ariaReadOnly() { debugger; }; mframe.safefunction(curMemoryArea.ariaReadOnly_getter);
Object.defineProperty(curMemoryArea.ariaReadOnly_getter, "name", { value: "get ariaReadOnly", configurable: true, });
// ariaReadOnly
curMemoryArea.ariaReadOnly_setter = function ariaReadOnly(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaReadOnly_setter);
Object.defineProperty(curMemoryArea.ariaReadOnly_setter, "name", { value: "set ariaReadOnly", configurable: true, });
Object.defineProperty(Element.prototype, "ariaReadOnly", { get: curMemoryArea.ariaReadOnly_getter, set: curMemoryArea.ariaReadOnly_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaReadOnly_smart_getter = function ariaReadOnly() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaReadOnly的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaReadOnly_smart_getter);
Element.prototype.__defineGetter__("ariaReadOnly", curMemoryArea.ariaReadOnly_smart_getter);

// ariaRelevant
curMemoryArea.ariaRelevant_getter = function ariaRelevant() { debugger; }; mframe.safefunction(curMemoryArea.ariaRelevant_getter);
Object.defineProperty(curMemoryArea.ariaRelevant_getter, "name", { value: "get ariaRelevant", configurable: true, });
// ariaRelevant
curMemoryArea.ariaRelevant_setter = function ariaRelevant(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRelevant_setter);
Object.defineProperty(curMemoryArea.ariaRelevant_setter, "name", { value: "set ariaRelevant", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRelevant", { get: curMemoryArea.ariaRelevant_getter, set: curMemoryArea.ariaRelevant_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRelevant_smart_getter = function ariaRelevant() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRelevant的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRelevant_smart_getter);
Element.prototype.__defineGetter__("ariaRelevant", curMemoryArea.ariaRelevant_smart_getter);

// ariaRequired
curMemoryArea.ariaRequired_getter = function ariaRequired() { debugger; }; mframe.safefunction(curMemoryArea.ariaRequired_getter);
Object.defineProperty(curMemoryArea.ariaRequired_getter, "name", { value: "get ariaRequired", configurable: true, });
// ariaRequired
curMemoryArea.ariaRequired_setter = function ariaRequired(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRequired_setter);
Object.defineProperty(curMemoryArea.ariaRequired_setter, "name", { value: "set ariaRequired", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRequired", { get: curMemoryArea.ariaRequired_getter, set: curMemoryArea.ariaRequired_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRequired_smart_getter = function ariaRequired() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRequired的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRequired_smart_getter);
Element.prototype.__defineGetter__("ariaRequired", curMemoryArea.ariaRequired_smart_getter);

// ariaRoleDescription
curMemoryArea.ariaRoleDescription_getter = function ariaRoleDescription() { debugger; }; mframe.safefunction(curMemoryArea.ariaRoleDescription_getter);
Object.defineProperty(curMemoryArea.ariaRoleDescription_getter, "name", { value: "get ariaRoleDescription", configurable: true, });
// ariaRoleDescription
curMemoryArea.ariaRoleDescription_setter = function ariaRoleDescription(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRoleDescription_setter);
Object.defineProperty(curMemoryArea.ariaRoleDescription_setter, "name", { value: "set ariaRoleDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRoleDescription", { get: curMemoryArea.ariaRoleDescription_getter, set: curMemoryArea.ariaRoleDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRoleDescription_smart_getter = function ariaRoleDescription() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRoleDescription的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRoleDescription_smart_getter);
Element.prototype.__defineGetter__("ariaRoleDescription", curMemoryArea.ariaRoleDescription_smart_getter);

// ariaRowCount
curMemoryArea.ariaRowCount_getter = function ariaRowCount() { debugger; }; mframe.safefunction(curMemoryArea.ariaRowCount_getter);
Object.defineProperty(curMemoryArea.ariaRowCount_getter, "name", { value: "get ariaRowCount", configurable: true, });
// ariaRowCount
curMemoryArea.ariaRowCount_setter = function ariaRowCount(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRowCount_setter);
Object.defineProperty(curMemoryArea.ariaRowCount_setter, "name", { value: "set ariaRowCount", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowCount", { get: curMemoryArea.ariaRowCount_getter, set: curMemoryArea.ariaRowCount_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowCount_smart_getter = function ariaRowCount() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRowCount的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRowCount_smart_getter);
Element.prototype.__defineGetter__("ariaRowCount", curMemoryArea.ariaRowCount_smart_getter);

// ariaRowIndex
curMemoryArea.ariaRowIndex_getter = function ariaRowIndex() { debugger; }; mframe.safefunction(curMemoryArea.ariaRowIndex_getter);
Object.defineProperty(curMemoryArea.ariaRowIndex_getter, "name", { value: "get ariaRowIndex", configurable: true, });
// ariaRowIndex
curMemoryArea.ariaRowIndex_setter = function ariaRowIndex(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRowIndex_setter);
Object.defineProperty(curMemoryArea.ariaRowIndex_setter, "name", { value: "set ariaRowIndex", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowIndex", { get: curMemoryArea.ariaRowIndex_getter, set: curMemoryArea.ariaRowIndex_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowIndex_smart_getter = function ariaRowIndex() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRowIndex的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRowIndex_smart_getter);
Element.prototype.__defineGetter__("ariaRowIndex", curMemoryArea.ariaRowIndex_smart_getter);

// ariaRowSpan
curMemoryArea.ariaRowSpan_getter = function ariaRowSpan() { debugger; }; mframe.safefunction(curMemoryArea.ariaRowSpan_getter);
Object.defineProperty(curMemoryArea.ariaRowSpan_getter, "name", { value: "get ariaRowSpan", configurable: true, });
// ariaRowSpan
curMemoryArea.ariaRowSpan_setter = function ariaRowSpan(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRowSpan_setter);
Object.defineProperty(curMemoryArea.ariaRowSpan_setter, "name", { value: "set ariaRowSpan", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowSpan", { get: curMemoryArea.ariaRowSpan_getter, set: curMemoryArea.ariaRowSpan_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowSpan_smart_getter = function ariaRowSpan() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRowSpan的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRowSpan_smart_getter);
Element.prototype.__defineGetter__("ariaRowSpan", curMemoryArea.ariaRowSpan_smart_getter);

// ariaSelected
curMemoryArea.ariaSelected_getter = function ariaSelected() { debugger; }; mframe.safefunction(curMemoryArea.ariaSelected_getter);
Object.defineProperty(curMemoryArea.ariaSelected_getter, "name", { value: "get ariaSelected", configurable: true, });
// ariaSelected
curMemoryArea.ariaSelected_setter = function ariaSelected(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaSelected_setter);
Object.defineProperty(curMemoryArea.ariaSelected_setter, "name", { value: "set ariaSelected", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSelected", { get: curMemoryArea.ariaSelected_getter, set: curMemoryArea.ariaSelected_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSelected_smart_getter = function ariaSelected() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaSelected的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaSelected_smart_getter);
Element.prototype.__defineGetter__("ariaSelected", curMemoryArea.ariaSelected_smart_getter);

// ariaSetSize
curMemoryArea.ariaSetSize_getter = function ariaSetSize() { debugger; }; mframe.safefunction(curMemoryArea.ariaSetSize_getter);
Object.defineProperty(curMemoryArea.ariaSetSize_getter, "name", { value: "get ariaSetSize", configurable: true, });
// ariaSetSize
curMemoryArea.ariaSetSize_setter = function ariaSetSize(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaSetSize_setter);
Object.defineProperty(curMemoryArea.ariaSetSize_setter, "name", { value: "set ariaSetSize", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSetSize", { get: curMemoryArea.ariaSetSize_getter, set: curMemoryArea.ariaSetSize_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSetSize_smart_getter = function ariaSetSize() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaSetSize的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaSetSize_smart_getter);
Element.prototype.__defineGetter__("ariaSetSize", curMemoryArea.ariaSetSize_smart_getter);

// ariaSort
curMemoryArea.ariaSort_getter = function ariaSort() { debugger; }; mframe.safefunction(curMemoryArea.ariaSort_getter);
Object.defineProperty(curMemoryArea.ariaSort_getter, "name", { value: "get ariaSort", configurable: true, });
// ariaSort
curMemoryArea.ariaSort_setter = function ariaSort(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaSort_setter);
Object.defineProperty(curMemoryArea.ariaSort_setter, "name", { value: "set ariaSort", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSort", { get: curMemoryArea.ariaSort_getter, set: curMemoryArea.ariaSort_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSort_smart_getter = function ariaSort() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaSort的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaSort_smart_getter);
Element.prototype.__defineGetter__("ariaSort", curMemoryArea.ariaSort_smart_getter);

// ariaValueMax
curMemoryArea.ariaValueMax_getter = function ariaValueMax() { debugger; }; mframe.safefunction(curMemoryArea.ariaValueMax_getter);
Object.defineProperty(curMemoryArea.ariaValueMax_getter, "name", { value: "get ariaValueMax", configurable: true, });
// ariaValueMax
curMemoryArea.ariaValueMax_setter = function ariaValueMax(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaValueMax_setter);
Object.defineProperty(curMemoryArea.ariaValueMax_setter, "name", { value: "set ariaValueMax", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueMax", { get: curMemoryArea.ariaValueMax_getter, set: curMemoryArea.ariaValueMax_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueMax_smart_getter = function ariaValueMax() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaValueMax的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaValueMax_smart_getter);
Element.prototype.__defineGetter__("ariaValueMax", curMemoryArea.ariaValueMax_smart_getter);

// ariaValueMin
curMemoryArea.ariaValueMin_getter = function ariaValueMin() { debugger; }; mframe.safefunction(curMemoryArea.ariaValueMin_getter);
Object.defineProperty(curMemoryArea.ariaValueMin_getter, "name", { value: "get ariaValueMin", configurable: true, });
// ariaValueMin
curMemoryArea.ariaValueMin_setter = function ariaValueMin(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaValueMin_setter);
Object.defineProperty(curMemoryArea.ariaValueMin_setter, "name", { value: "set ariaValueMin", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueMin", { get: curMemoryArea.ariaValueMin_getter, set: curMemoryArea.ariaValueMin_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueMin_smart_getter = function ariaValueMin() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaValueMin的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaValueMin_smart_getter);
Element.prototype.__defineGetter__("ariaValueMin", curMemoryArea.ariaValueMin_smart_getter);

// ariaValueNow
curMemoryArea.ariaValueNow_getter = function ariaValueNow() { debugger; }; mframe.safefunction(curMemoryArea.ariaValueNow_getter);
Object.defineProperty(curMemoryArea.ariaValueNow_getter, "name", { value: "get ariaValueNow", configurable: true, });
// ariaValueNow
curMemoryArea.ariaValueNow_setter = function ariaValueNow(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaValueNow_setter);
Object.defineProperty(curMemoryArea.ariaValueNow_setter, "name", { value: "set ariaValueNow", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueNow", { get: curMemoryArea.ariaValueNow_getter, set: curMemoryArea.ariaValueNow_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueNow_smart_getter = function ariaValueNow() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaValueNow的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaValueNow_smart_getter);
Element.prototype.__defineGetter__("ariaValueNow", curMemoryArea.ariaValueNow_smart_getter);

// ariaValueText
curMemoryArea.ariaValueText_getter = function ariaValueText() { debugger; }; mframe.safefunction(curMemoryArea.ariaValueText_getter);
Object.defineProperty(curMemoryArea.ariaValueText_getter, "name", { value: "get ariaValueText", configurable: true, });
// ariaValueText
curMemoryArea.ariaValueText_setter = function ariaValueText(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaValueText_setter);
Object.defineProperty(curMemoryArea.ariaValueText_setter, "name", { value: "set ariaValueText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueText", { get: curMemoryArea.ariaValueText_getter, set: curMemoryArea.ariaValueText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueText_smart_getter = function ariaValueText() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaValueText的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaValueText_smart_getter);
Element.prototype.__defineGetter__("ariaValueText", curMemoryArea.ariaValueText_smart_getter);

// children
curMemoryArea.children_getter = function children() { debugger; }; mframe.safefunction(curMemoryArea.children_getter);
Object.defineProperty(curMemoryArea.children_getter, "name", { value: "get children", configurable: true, });
Object.defineProperty(Element.prototype, "children", { get: curMemoryArea.children_getter, enumerable: true, configurable: true, });
curMemoryArea.children_smart_getter = function children() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的children的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.children_smart_getter);
Element.prototype.__defineGetter__("children", curMemoryArea.children_smart_getter);

// firstElementChild
curMemoryArea.firstElementChild_getter = function firstElementChild() { debugger; }; mframe.safefunction(curMemoryArea.firstElementChild_getter);
Object.defineProperty(curMemoryArea.firstElementChild_getter, "name", { value: "get firstElementChild", configurable: true, });
Object.defineProperty(Element.prototype, "firstElementChild", { get: curMemoryArea.firstElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstElementChild_smart_getter = function firstElementChild() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的firstElementChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.firstElementChild_smart_getter);
Element.prototype.__defineGetter__("firstElementChild", curMemoryArea.firstElementChild_smart_getter);

// lastElementChild
curMemoryArea.lastElementChild_getter = function lastElementChild() { debugger; }; mframe.safefunction(curMemoryArea.lastElementChild_getter);
Object.defineProperty(curMemoryArea.lastElementChild_getter, "name", { value: "get lastElementChild", configurable: true, });
Object.defineProperty(Element.prototype, "lastElementChild", { get: curMemoryArea.lastElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.lastElementChild_smart_getter = function lastElementChild() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的lastElementChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.lastElementChild_smart_getter);
Element.prototype.__defineGetter__("lastElementChild", curMemoryArea.lastElementChild_smart_getter);

// childElementCount
curMemoryArea.childElementCount_getter = function childElementCount() { debugger; }; mframe.safefunction(curMemoryArea.childElementCount_getter);
Object.defineProperty(curMemoryArea.childElementCount_getter, "name", { value: "get childElementCount", configurable: true, });
Object.defineProperty(Element.prototype, "childElementCount", { get: curMemoryArea.childElementCount_getter, enumerable: true, configurable: true, });
curMemoryArea.childElementCount_smart_getter = function childElementCount() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的childElementCount的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.childElementCount_smart_getter);
Element.prototype.__defineGetter__("childElementCount", curMemoryArea.childElementCount_smart_getter);

// previousElementSibling
curMemoryArea.previousElementSibling_getter = function previousElementSibling() { debugger; }; mframe.safefunction(curMemoryArea.previousElementSibling_getter);
Object.defineProperty(curMemoryArea.previousElementSibling_getter, "name", { value: "get previousElementSibling", configurable: true, });
Object.defineProperty(Element.prototype, "previousElementSibling", { get: curMemoryArea.previousElementSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.previousElementSibling_smart_getter = function previousElementSibling() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的previousElementSibling的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.previousElementSibling_smart_getter);
Element.prototype.__defineGetter__("previousElementSibling", curMemoryArea.previousElementSibling_smart_getter);

// nextElementSibling
curMemoryArea.nextElementSibling_getter = function nextElementSibling() { debugger; }; mframe.safefunction(curMemoryArea.nextElementSibling_getter);
Object.defineProperty(curMemoryArea.nextElementSibling_getter, "name", { value: "get nextElementSibling", configurable: true, });
Object.defineProperty(Element.prototype, "nextElementSibling", { get: curMemoryArea.nextElementSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.nextElementSibling_smart_getter = function nextElementSibling() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的nextElementSibling的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nextElementSibling_smart_getter);
Element.prototype.__defineGetter__("nextElementSibling", curMemoryArea.nextElementSibling_smart_getter);

// currentCSSZoom
curMemoryArea.currentCSSZoom_getter = function currentCSSZoom() { debugger; }; mframe.safefunction(curMemoryArea.currentCSSZoom_getter);
Object.defineProperty(curMemoryArea.currentCSSZoom_getter, "name", { value: "get currentCSSZoom", configurable: true, });
Object.defineProperty(Element.prototype, "currentCSSZoom", { get: curMemoryArea.currentCSSZoom_getter, enumerable: true, configurable: true, });
curMemoryArea.currentCSSZoom_smart_getter = function currentCSSZoom() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的currentCSSZoom的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.currentCSSZoom_smart_getter);
Element.prototype.__defineGetter__("currentCSSZoom", curMemoryArea.currentCSSZoom_smart_getter);

// ariaColIndexText
curMemoryArea.ariaColIndexText_getter = function ariaColIndexText() { debugger; }; mframe.safefunction(curMemoryArea.ariaColIndexText_getter);
Object.defineProperty(curMemoryArea.ariaColIndexText_getter, "name", { value: "get ariaColIndexText", configurable: true, });
// ariaColIndexText
curMemoryArea.ariaColIndexText_setter = function ariaColIndexText(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaColIndexText_setter);
Object.defineProperty(curMemoryArea.ariaColIndexText_setter, "name", { value: "set ariaColIndexText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColIndexText", { get: curMemoryArea.ariaColIndexText_getter, set: curMemoryArea.ariaColIndexText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColIndexText_smart_getter = function ariaColIndexText() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaColIndexText的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaColIndexText_smart_getter);
Element.prototype.__defineGetter__("ariaColIndexText", curMemoryArea.ariaColIndexText_smart_getter);

// ariaRowIndexText
curMemoryArea.ariaRowIndexText_getter = function ariaRowIndexText() { debugger; }; mframe.safefunction(curMemoryArea.ariaRowIndexText_getter);
Object.defineProperty(curMemoryArea.ariaRowIndexText_getter, "name", { value: "get ariaRowIndexText", configurable: true, });
// ariaRowIndexText
curMemoryArea.ariaRowIndexText_setter = function ariaRowIndexText(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRowIndexText_setter);
Object.defineProperty(curMemoryArea.ariaRowIndexText_setter, "name", { value: "set ariaRowIndexText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowIndexText", { get: curMemoryArea.ariaRowIndexText_getter, set: curMemoryArea.ariaRowIndexText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowIndexText_smart_getter = function ariaRowIndexText() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRowIndexText的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRowIndexText_smart_getter);
Element.prototype.__defineGetter__("ariaRowIndexText", curMemoryArea.ariaRowIndexText_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

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
Element.prototype["getAttribute"] = function getAttribute() { debugger; }; mframe.safefunction(Element.prototype["getAttribute"]);
Element.prototype["getAttributeNS"] = function getAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNS"]);
Element.prototype["getAttributeNames"] = function getAttributeNames() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNames"]);
Element.prototype["getAttributeNode"] = function getAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNode"]);
Element.prototype["getAttributeNodeNS"] = function getAttributeNodeNS() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNodeNS"]);
Element.prototype["getBoundingClientRect"] = function getBoundingClientRect() { debugger; }; mframe.safefunction(Element.prototype["getBoundingClientRect"]);
Element.prototype["getClientRects"] = function getClientRects() { debugger; }; mframe.safefunction(Element.prototype["getClientRects"]);
Element.prototype["getElementsByClassName"] = function getElementsByClassName() { debugger; }; mframe.safefunction(Element.prototype["getElementsByClassName"]);
Element.prototype["getElementsByTagName"] = function getElementsByTagName() { debugger; }; mframe.safefunction(Element.prototype["getElementsByTagName"]);
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
Element.prototype["setAttribute"] = function setAttribute() { debugger; }; mframe.safefunction(Element.prototype["setAttribute"]);
Element.prototype["setAttributeNS"] = function setAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNS"]);
Element.prototype["setAttributeNode"] = function setAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNode"]);
Element.prototype["setAttributeNodeNS"] = function setAttributeNodeNS() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNodeNS"]);
Element.prototype["setHTMLUnsafe"] = function setHTMLUnsafe() { debugger; }; mframe.safefunction(Element.prototype["setHTMLUnsafe"]);
Element.prototype["setPointerCapture"] = function setPointerCapture() { debugger; }; mframe.safefunction(Element.prototype["setPointerCapture"]);
Element.prototype["toggleAttribute"] = function toggleAttribute() { debugger; }; mframe.safefunction(Element.prototype["toggleAttribute"]);
Element.prototype["webkitMatchesSelector"] = function webkitMatchesSelector() { debugger; }; mframe.safefunction(Element.prototype["webkitMatchesSelector"]);
Element.prototype["webkitRequestFullScreen"] = function webkitRequestFullScreen() { debugger; }; mframe.safefunction(Element.prototype["webkitRequestFullScreen"]);
Element.prototype["webkitRequestFullscreen"] = function webkitRequestFullscreen() { debugger; }; mframe.safefunction(Element.prototype["webkitRequestFullscreen"]);
Element.prototype["moveBefore"] = function moveBefore() { debugger; }; mframe.safefunction(Element.prototype["moveBefore"]);
//==============↑↑Function END↑↑====================

//////////////////////////////////


/**代理 */
Element.prototype.__proto__ = Node.prototype;
Element = mframe.proxy(Element)

// 添加querySelector和querySelectorAll方法
Element.prototype["querySelector"] = function querySelector(selector) {
    console.log("Element.querySelector=>", selector);
    if (this._jsdom_element) {
        var jsdomElement = this._jsdom_element.querySelector(selector);
        if (jsdomElement) {
            var element = {};
            element.__proto__ = Element.prototype;
            element._jsdom_element = jsdomElement;
            return mframe.proxy(element);
        }
    }
    return null;
}; mframe.safefunction(Element.prototype["querySelector"]);

Element.prototype["querySelectorAll"] = function querySelectorAll(selector) {
    console.log("Element.querySelectorAll=>", selector);
    if (this._jsdom_element) {
        var jsdomElements = this._jsdom_element.querySelectorAll(selector);
        var result = [];
        for (var i = 0; i < jsdomElements.length; i++) {
            var element = {};
            element.__proto__ = Element.prototype;
            element._jsdom_element = jsdomElements[i];
            result.push(mframe.proxy(element));
        }
        return mframe.proxy(result);
    }
    return mframe.proxy([]);
}; mframe.safefunction(Element.prototype["querySelectorAll"]);

// 修改getAttribute和setAttribute方法
Element.prototype["getAttribute"] = function getAttribute(name) {
    console.log("Element.getAttribute=>", name);
    if (this._jsdom_element) {
        return this._jsdom_element.getAttribute(name);
    }
    return null;
}; mframe.safefunction(Element.prototype["getAttribute"]);

Element.prototype["setAttribute"] = function setAttribute(name, value) {
    console.log("Element.setAttribute=>", name, value);
    if (this._jsdom_element) {
        this._jsdom_element.setAttribute(name, value);
    }
}; mframe.safefunction(Element.prototype["setAttribute"]);

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

//%%%%%%% Attribute START %%%%%%%%%%
// title
curMemoryArea.title_getter = function title() { debugger; }; mframe.safefunction(curMemoryArea.title_getter);
Object.defineProperty(curMemoryArea.title_getter, "name", {value: "get title",configurable: true,});
// title
curMemoryArea.title_setter = function title(val) { debugger; }; mframe.safefunction(curMemoryArea.title_setter);
Object.defineProperty(curMemoryArea.title_setter, "name", {value: "set title",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "title", {get: curMemoryArea.title_getter,set: curMemoryArea.title_setter,enumerable: true,configurable: true,});
curMemoryArea.title_smart_getter = function title() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的title的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.title_smart_getter);
HTMLElement.prototype.__defineGetter__("title", curMemoryArea.title_smart_getter);

// lang
curMemoryArea.lang_getter = function lang() { debugger; }; mframe.safefunction(curMemoryArea.lang_getter);
Object.defineProperty(curMemoryArea.lang_getter, "name", {value: "get lang",configurable: true,});
// lang
curMemoryArea.lang_setter = function lang(val) { debugger; }; mframe.safefunction(curMemoryArea.lang_setter);
Object.defineProperty(curMemoryArea.lang_setter, "name", {value: "set lang",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "lang", {get: curMemoryArea.lang_getter,set: curMemoryArea.lang_setter,enumerable: true,configurable: true,});
curMemoryArea.lang_smart_getter = function lang() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的lang的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.lang_smart_getter);
HTMLElement.prototype.__defineGetter__("lang", curMemoryArea.lang_smart_getter);

// translate
curMemoryArea.translate_getter = function translate() { debugger; }; mframe.safefunction(curMemoryArea.translate_getter);
Object.defineProperty(curMemoryArea.translate_getter, "name", {value: "get translate",configurable: true,});
// translate
curMemoryArea.translate_setter = function translate(val) { debugger; }; mframe.safefunction(curMemoryArea.translate_setter);
Object.defineProperty(curMemoryArea.translate_setter, "name", {value: "set translate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "translate", {get: curMemoryArea.translate_getter,set: curMemoryArea.translate_setter,enumerable: true,configurable: true,});
curMemoryArea.translate_smart_getter = function translate() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的translate的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.translate_smart_getter);
HTMLElement.prototype.__defineGetter__("translate", curMemoryArea.translate_smart_getter);

// dir
curMemoryArea.dir_getter = function dir() { debugger; }; mframe.safefunction(curMemoryArea.dir_getter);
Object.defineProperty(curMemoryArea.dir_getter, "name", {value: "get dir",configurable: true,});
// dir
curMemoryArea.dir_setter = function dir(val) { debugger; }; mframe.safefunction(curMemoryArea.dir_setter);
Object.defineProperty(curMemoryArea.dir_setter, "name", {value: "set dir",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "dir", {get: curMemoryArea.dir_getter,set: curMemoryArea.dir_setter,enumerable: true,configurable: true,});
curMemoryArea.dir_smart_getter = function dir() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的dir的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.dir_smart_getter);
HTMLElement.prototype.__defineGetter__("dir", curMemoryArea.dir_smart_getter);

// hidden
curMemoryArea.hidden_getter = function hidden() { debugger; }; mframe.safefunction(curMemoryArea.hidden_getter);
Object.defineProperty(curMemoryArea.hidden_getter, "name", {value: "get hidden",configurable: true,});
// hidden
curMemoryArea.hidden_setter = function hidden(val) { debugger; }; mframe.safefunction(curMemoryArea.hidden_setter);
Object.defineProperty(curMemoryArea.hidden_setter, "name", {value: "set hidden",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "hidden", {get: curMemoryArea.hidden_getter,set: curMemoryArea.hidden_setter,enumerable: true,configurable: true,});
curMemoryArea.hidden_smart_getter = function hidden() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的hidden的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.hidden_smart_getter);
HTMLElement.prototype.__defineGetter__("hidden", curMemoryArea.hidden_smart_getter);

// inert
curMemoryArea.inert_getter = function inert() { debugger; }; mframe.safefunction(curMemoryArea.inert_getter);
Object.defineProperty(curMemoryArea.inert_getter, "name", {value: "get inert",configurable: true,});
// inert
curMemoryArea.inert_setter = function inert(val) { debugger; }; mframe.safefunction(curMemoryArea.inert_setter);
Object.defineProperty(curMemoryArea.inert_setter, "name", {value: "set inert",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "inert", {get: curMemoryArea.inert_getter,set: curMemoryArea.inert_setter,enumerable: true,configurable: true,});
curMemoryArea.inert_smart_getter = function inert() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的inert的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.inert_smart_getter);
HTMLElement.prototype.__defineGetter__("inert", curMemoryArea.inert_smart_getter);

// accessKey
curMemoryArea.accessKey_getter = function accessKey() { debugger; }; mframe.safefunction(curMemoryArea.accessKey_getter);
Object.defineProperty(curMemoryArea.accessKey_getter, "name", {value: "get accessKey",configurable: true,});
// accessKey
curMemoryArea.accessKey_setter = function accessKey(val) { debugger; }; mframe.safefunction(curMemoryArea.accessKey_setter);
Object.defineProperty(curMemoryArea.accessKey_setter, "name", {value: "set accessKey",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "accessKey", {get: curMemoryArea.accessKey_getter,set: curMemoryArea.accessKey_setter,enumerable: true,configurable: true,});
curMemoryArea.accessKey_smart_getter = function accessKey() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的accessKey的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.accessKey_smart_getter);
HTMLElement.prototype.__defineGetter__("accessKey", curMemoryArea.accessKey_smart_getter);

// draggable
curMemoryArea.draggable_getter = function draggable() { debugger; }; mframe.safefunction(curMemoryArea.draggable_getter);
Object.defineProperty(curMemoryArea.draggable_getter, "name", {value: "get draggable",configurable: true,});
// draggable
curMemoryArea.draggable_setter = function draggable(val) { debugger; }; mframe.safefunction(curMemoryArea.draggable_setter);
Object.defineProperty(curMemoryArea.draggable_setter, "name", {value: "set draggable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "draggable", {get: curMemoryArea.draggable_getter,set: curMemoryArea.draggable_setter,enumerable: true,configurable: true,});
curMemoryArea.draggable_smart_getter = function draggable() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的draggable的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.draggable_smart_getter);
HTMLElement.prototype.__defineGetter__("draggable", curMemoryArea.draggable_smart_getter);

// spellcheck
curMemoryArea.spellcheck_getter = function spellcheck() { debugger; }; mframe.safefunction(curMemoryArea.spellcheck_getter);
Object.defineProperty(curMemoryArea.spellcheck_getter, "name", {value: "get spellcheck",configurable: true,});
// spellcheck
curMemoryArea.spellcheck_setter = function spellcheck(val) { debugger; }; mframe.safefunction(curMemoryArea.spellcheck_setter);
Object.defineProperty(curMemoryArea.spellcheck_setter, "name", {value: "set spellcheck",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "spellcheck", {get: curMemoryArea.spellcheck_getter,set: curMemoryArea.spellcheck_setter,enumerable: true,configurable: true,});
curMemoryArea.spellcheck_smart_getter = function spellcheck() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的spellcheck的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.spellcheck_smart_getter);
HTMLElement.prototype.__defineGetter__("spellcheck", curMemoryArea.spellcheck_smart_getter);

// autocapitalize
curMemoryArea.autocapitalize_getter = function autocapitalize() { debugger; }; mframe.safefunction(curMemoryArea.autocapitalize_getter);
Object.defineProperty(curMemoryArea.autocapitalize_getter, "name", {value: "get autocapitalize",configurable: true,});
// autocapitalize
curMemoryArea.autocapitalize_setter = function autocapitalize(val) { debugger; }; mframe.safefunction(curMemoryArea.autocapitalize_setter);
Object.defineProperty(curMemoryArea.autocapitalize_setter, "name", {value: "set autocapitalize",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "autocapitalize", {get: curMemoryArea.autocapitalize_getter,set: curMemoryArea.autocapitalize_setter,enumerable: true,configurable: true,});
curMemoryArea.autocapitalize_smart_getter = function autocapitalize() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的autocapitalize的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.autocapitalize_smart_getter);
HTMLElement.prototype.__defineGetter__("autocapitalize", curMemoryArea.autocapitalize_smart_getter);

// editContext
curMemoryArea.editContext_getter = function editContext() { debugger; }; mframe.safefunction(curMemoryArea.editContext_getter);
Object.defineProperty(curMemoryArea.editContext_getter, "name", {value: "get editContext",configurable: true,});
// editContext
curMemoryArea.editContext_setter = function editContext(val) { debugger; }; mframe.safefunction(curMemoryArea.editContext_setter);
Object.defineProperty(curMemoryArea.editContext_setter, "name", {value: "set editContext",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "editContext", {get: curMemoryArea.editContext_getter,set: curMemoryArea.editContext_setter,enumerable: true,configurable: true,});
curMemoryArea.editContext_smart_getter = function editContext() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的editContext的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.editContext_smart_getter);
HTMLElement.prototype.__defineGetter__("editContext", curMemoryArea.editContext_smart_getter);

// contentEditable
curMemoryArea.contentEditable_getter = function contentEditable() { debugger; }; mframe.safefunction(curMemoryArea.contentEditable_getter);
Object.defineProperty(curMemoryArea.contentEditable_getter, "name", {value: "get contentEditable",configurable: true,});
// contentEditable
curMemoryArea.contentEditable_setter = function contentEditable(val) { debugger; }; mframe.safefunction(curMemoryArea.contentEditable_setter);
Object.defineProperty(curMemoryArea.contentEditable_setter, "name", {value: "set contentEditable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "contentEditable", {get: curMemoryArea.contentEditable_getter,set: curMemoryArea.contentEditable_setter,enumerable: true,configurable: true,});
curMemoryArea.contentEditable_smart_getter = function contentEditable() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的contentEditable的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.contentEditable_smart_getter);
HTMLElement.prototype.__defineGetter__("contentEditable", curMemoryArea.contentEditable_smart_getter);

// enterKeyHint
curMemoryArea.enterKeyHint_getter = function enterKeyHint() { debugger; }; mframe.safefunction(curMemoryArea.enterKeyHint_getter);
Object.defineProperty(curMemoryArea.enterKeyHint_getter, "name", {value: "get enterKeyHint",configurable: true,});
// enterKeyHint
curMemoryArea.enterKeyHint_setter = function enterKeyHint(val) { debugger; }; mframe.safefunction(curMemoryArea.enterKeyHint_setter);
Object.defineProperty(curMemoryArea.enterKeyHint_setter, "name", {value: "set enterKeyHint",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "enterKeyHint", {get: curMemoryArea.enterKeyHint_getter,set: curMemoryArea.enterKeyHint_setter,enumerable: true,configurable: true,});
curMemoryArea.enterKeyHint_smart_getter = function enterKeyHint() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的enterKeyHint的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.enterKeyHint_smart_getter);
HTMLElement.prototype.__defineGetter__("enterKeyHint", curMemoryArea.enterKeyHint_smart_getter);

// isContentEditable
curMemoryArea.isContentEditable_getter = function isContentEditable() { debugger; }; mframe.safefunction(curMemoryArea.isContentEditable_getter);
Object.defineProperty(curMemoryArea.isContentEditable_getter, "name", {value: "get isContentEditable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "isContentEditable", {get: curMemoryArea.isContentEditable_getter,enumerable: true,configurable: true,});
curMemoryArea.isContentEditable_smart_getter = function isContentEditable() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的isContentEditable的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.isContentEditable_smart_getter);
HTMLElement.prototype.__defineGetter__("isContentEditable", curMemoryArea.isContentEditable_smart_getter);

// inputMode
curMemoryArea.inputMode_getter = function inputMode() { debugger; }; mframe.safefunction(curMemoryArea.inputMode_getter);
Object.defineProperty(curMemoryArea.inputMode_getter, "name", {value: "get inputMode",configurable: true,});
// inputMode
curMemoryArea.inputMode_setter = function inputMode(val) { debugger; }; mframe.safefunction(curMemoryArea.inputMode_setter);
Object.defineProperty(curMemoryArea.inputMode_setter, "name", {value: "set inputMode",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "inputMode", {get: curMemoryArea.inputMode_getter,set: curMemoryArea.inputMode_setter,enumerable: true,configurable: true,});
curMemoryArea.inputMode_smart_getter = function inputMode() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的inputMode的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.inputMode_smart_getter);
HTMLElement.prototype.__defineGetter__("inputMode", curMemoryArea.inputMode_smart_getter);

// virtualKeyboardPolicy
curMemoryArea.virtualKeyboardPolicy_getter = function virtualKeyboardPolicy() { debugger; }; mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_getter);
Object.defineProperty(curMemoryArea.virtualKeyboardPolicy_getter, "name", {value: "get virtualKeyboardPolicy",configurable: true,});
// virtualKeyboardPolicy
curMemoryArea.virtualKeyboardPolicy_setter = function virtualKeyboardPolicy(val) { debugger; }; mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_setter);
Object.defineProperty(curMemoryArea.virtualKeyboardPolicy_setter, "name", {value: "set virtualKeyboardPolicy",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "virtualKeyboardPolicy", {get: curMemoryArea.virtualKeyboardPolicy_getter,set: curMemoryArea.virtualKeyboardPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.virtualKeyboardPolicy_smart_getter = function virtualKeyboardPolicy() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的virtualKeyboardPolicy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_smart_getter);
HTMLElement.prototype.__defineGetter__("virtualKeyboardPolicy", curMemoryArea.virtualKeyboardPolicy_smart_getter);

// offsetParent
curMemoryArea.offsetParent_getter = function offsetParent() { debugger; }; mframe.safefunction(curMemoryArea.offsetParent_getter);
Object.defineProperty(curMemoryArea.offsetParent_getter, "name", {value: "get offsetParent",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetParent", {get: curMemoryArea.offsetParent_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetParent_smart_getter = function offsetParent() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的offsetParent的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.offsetParent_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetParent", curMemoryArea.offsetParent_smart_getter);

// offsetTop
curMemoryArea.offsetTop_getter = function offsetTop() { debugger; }; mframe.safefunction(curMemoryArea.offsetTop_getter);
Object.defineProperty(curMemoryArea.offsetTop_getter, "name", {value: "get offsetTop",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetTop", {get: curMemoryArea.offsetTop_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetTop_smart_getter = function offsetTop() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的offsetTop的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.offsetTop_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetTop", curMemoryArea.offsetTop_smart_getter);

// offsetLeft
curMemoryArea.offsetLeft_getter = function offsetLeft() { debugger; }; mframe.safefunction(curMemoryArea.offsetLeft_getter);
Object.defineProperty(curMemoryArea.offsetLeft_getter, "name", {value: "get offsetLeft",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetLeft", {get: curMemoryArea.offsetLeft_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetLeft_smart_getter = function offsetLeft() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的offsetLeft的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.offsetLeft_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetLeft", curMemoryArea.offsetLeft_smart_getter);

// offsetWidth
curMemoryArea.offsetWidth_getter = function offsetWidth() { debugger; }; mframe.safefunction(curMemoryArea.offsetWidth_getter);
Object.defineProperty(curMemoryArea.offsetWidth_getter, "name", {value: "get offsetWidth",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetWidth", {get: curMemoryArea.offsetWidth_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetWidth_smart_getter = function offsetWidth() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的offsetWidth的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.offsetWidth_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetWidth", curMemoryArea.offsetWidth_smart_getter);

// offsetHeight
curMemoryArea.offsetHeight_getter = function offsetHeight() { debugger; }; mframe.safefunction(curMemoryArea.offsetHeight_getter);
Object.defineProperty(curMemoryArea.offsetHeight_getter, "name", {value: "get offsetHeight",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {get: curMemoryArea.offsetHeight_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetHeight_smart_getter = function offsetHeight() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的offsetHeight的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.offsetHeight_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetHeight", curMemoryArea.offsetHeight_smart_getter);

// popover
curMemoryArea.popover_getter = function popover() { debugger; }; mframe.safefunction(curMemoryArea.popover_getter);
Object.defineProperty(curMemoryArea.popover_getter, "name", {value: "get popover",configurable: true,});
// popover
curMemoryArea.popover_setter = function popover(val) { debugger; }; mframe.safefunction(curMemoryArea.popover_setter);
Object.defineProperty(curMemoryArea.popover_setter, "name", {value: "set popover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "popover", {get: curMemoryArea.popover_getter,set: curMemoryArea.popover_setter,enumerable: true,configurable: true,});
curMemoryArea.popover_smart_getter = function popover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的popover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.popover_smart_getter);
HTMLElement.prototype.__defineGetter__("popover", curMemoryArea.popover_smart_getter);

// innerText
curMemoryArea.innerText_getter = function innerText() { debugger; }; mframe.safefunction(curMemoryArea.innerText_getter);
Object.defineProperty(curMemoryArea.innerText_getter, "name", {value: "get innerText",configurable: true,});
// innerText
curMemoryArea.innerText_setter = function innerText(val) { debugger; }; mframe.safefunction(curMemoryArea.innerText_setter);
Object.defineProperty(curMemoryArea.innerText_setter, "name", {value: "set innerText",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "innerText", {get: curMemoryArea.innerText_getter,set: curMemoryArea.innerText_setter,enumerable: true,configurable: true,});
curMemoryArea.innerText_smart_getter = function innerText() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的innerText的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.innerText_smart_getter);
HTMLElement.prototype.__defineGetter__("innerText", curMemoryArea.innerText_smart_getter);

// outerText
curMemoryArea.outerText_getter = function outerText() { debugger; }; mframe.safefunction(curMemoryArea.outerText_getter);
Object.defineProperty(curMemoryArea.outerText_getter, "name", {value: "get outerText",configurable: true,});
// outerText
curMemoryArea.outerText_setter = function outerText(val) { debugger; }; mframe.safefunction(curMemoryArea.outerText_setter);
Object.defineProperty(curMemoryArea.outerText_setter, "name", {value: "set outerText",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "outerText", {get: curMemoryArea.outerText_getter,set: curMemoryArea.outerText_setter,enumerable: true,configurable: true,});
curMemoryArea.outerText_smart_getter = function outerText() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的outerText的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.outerText_smart_getter);
HTMLElement.prototype.__defineGetter__("outerText", curMemoryArea.outerText_smart_getter);

// writingSuggestions
curMemoryArea.writingSuggestions_getter = function writingSuggestions() { debugger; }; mframe.safefunction(curMemoryArea.writingSuggestions_getter);
Object.defineProperty(curMemoryArea.writingSuggestions_getter, "name", {value: "get writingSuggestions",configurable: true,});
// writingSuggestions
curMemoryArea.writingSuggestions_setter = function writingSuggestions(val) { debugger; }; mframe.safefunction(curMemoryArea.writingSuggestions_setter);
Object.defineProperty(curMemoryArea.writingSuggestions_setter, "name", {value: "set writingSuggestions",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "writingSuggestions", {get: curMemoryArea.writingSuggestions_getter,set: curMemoryArea.writingSuggestions_setter,enumerable: true,configurable: true,});
curMemoryArea.writingSuggestions_smart_getter = function writingSuggestions() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的writingSuggestions的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.writingSuggestions_smart_getter);
HTMLElement.prototype.__defineGetter__("writingSuggestions", curMemoryArea.writingSuggestions_smart_getter);

// onbeforexrselect
curMemoryArea.onbeforexrselect_getter = function onbeforexrselect() { debugger; }; mframe.safefunction(curMemoryArea.onbeforexrselect_getter);
Object.defineProperty(curMemoryArea.onbeforexrselect_getter, "name", {value: "get onbeforexrselect",configurable: true,});
// onbeforexrselect
curMemoryArea.onbeforexrselect_setter = function onbeforexrselect(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforexrselect_setter);
Object.defineProperty(curMemoryArea.onbeforexrselect_setter, "name", {value: "set onbeforexrselect",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforexrselect", {get: curMemoryArea.onbeforexrselect_getter,set: curMemoryArea.onbeforexrselect_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforexrselect_smart_getter = function onbeforexrselect() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onbeforexrselect的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onbeforexrselect_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforexrselect", curMemoryArea.onbeforexrselect_smart_getter);

// onabort
curMemoryArea.onabort_getter = function onabort() { debugger; }; mframe.safefunction(curMemoryArea.onabort_getter);
Object.defineProperty(curMemoryArea.onabort_getter, "name", {value: "get onabort",configurable: true,});
// onabort
curMemoryArea.onabort_setter = function onabort(val) { debugger; }; mframe.safefunction(curMemoryArea.onabort_setter);
Object.defineProperty(curMemoryArea.onabort_setter, "name", {value: "set onabort",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onabort", {get: curMemoryArea.onabort_getter,set: curMemoryArea.onabort_setter,enumerable: true,configurable: true,});
curMemoryArea.onabort_smart_getter = function onabort() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onabort的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onabort_smart_getter);
HTMLElement.prototype.__defineGetter__("onabort", curMemoryArea.onabort_smart_getter);

// onbeforeinput
curMemoryArea.onbeforeinput_getter = function onbeforeinput() { debugger; }; mframe.safefunction(curMemoryArea.onbeforeinput_getter);
Object.defineProperty(curMemoryArea.onbeforeinput_getter, "name", {value: "get onbeforeinput",configurable: true,});
// onbeforeinput
curMemoryArea.onbeforeinput_setter = function onbeforeinput(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforeinput_setter);
Object.defineProperty(curMemoryArea.onbeforeinput_setter, "name", {value: "set onbeforeinput",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforeinput", {get: curMemoryArea.onbeforeinput_getter,set: curMemoryArea.onbeforeinput_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforeinput_smart_getter = function onbeforeinput() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onbeforeinput的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onbeforeinput_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforeinput", curMemoryArea.onbeforeinput_smart_getter);

// onbeforematch
curMemoryArea.onbeforematch_getter = function onbeforematch() { debugger; }; mframe.safefunction(curMemoryArea.onbeforematch_getter);
Object.defineProperty(curMemoryArea.onbeforematch_getter, "name", {value: "get onbeforematch",configurable: true,});
// onbeforematch
curMemoryArea.onbeforematch_setter = function onbeforematch(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforematch_setter);
Object.defineProperty(curMemoryArea.onbeforematch_setter, "name", {value: "set onbeforematch",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforematch", {get: curMemoryArea.onbeforematch_getter,set: curMemoryArea.onbeforematch_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforematch_smart_getter = function onbeforematch() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onbeforematch的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onbeforematch_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforematch", curMemoryArea.onbeforematch_smart_getter);

// onbeforetoggle
curMemoryArea.onbeforetoggle_getter = function onbeforetoggle() { debugger; }; mframe.safefunction(curMemoryArea.onbeforetoggle_getter);
Object.defineProperty(curMemoryArea.onbeforetoggle_getter, "name", {value: "get onbeforetoggle",configurable: true,});
// onbeforetoggle
curMemoryArea.onbeforetoggle_setter = function onbeforetoggle(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforetoggle_setter);
Object.defineProperty(curMemoryArea.onbeforetoggle_setter, "name", {value: "set onbeforetoggle",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforetoggle", {get: curMemoryArea.onbeforetoggle_getter,set: curMemoryArea.onbeforetoggle_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforetoggle_smart_getter = function onbeforetoggle() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onbeforetoggle的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onbeforetoggle_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforetoggle", curMemoryArea.onbeforetoggle_smart_getter);

// onblur
curMemoryArea.onblur_getter = function onblur() { debugger; }; mframe.safefunction(curMemoryArea.onblur_getter);
Object.defineProperty(curMemoryArea.onblur_getter, "name", {value: "get onblur",configurable: true,});
// onblur
curMemoryArea.onblur_setter = function onblur(val) { debugger; }; mframe.safefunction(curMemoryArea.onblur_setter);
Object.defineProperty(curMemoryArea.onblur_setter, "name", {value: "set onblur",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onblur", {get: curMemoryArea.onblur_getter,set: curMemoryArea.onblur_setter,enumerable: true,configurable: true,});
curMemoryArea.onblur_smart_getter = function onblur() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onblur的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onblur_smart_getter);
HTMLElement.prototype.__defineGetter__("onblur", curMemoryArea.onblur_smart_getter);

// oncancel
curMemoryArea.oncancel_getter = function oncancel() { debugger; }; mframe.safefunction(curMemoryArea.oncancel_getter);
Object.defineProperty(curMemoryArea.oncancel_getter, "name", {value: "get oncancel",configurable: true,});
// oncancel
curMemoryArea.oncancel_setter = function oncancel(val) { debugger; }; mframe.safefunction(curMemoryArea.oncancel_setter);
Object.defineProperty(curMemoryArea.oncancel_setter, "name", {value: "set oncancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncancel", {get: curMemoryArea.oncancel_getter,set: curMemoryArea.oncancel_setter,enumerable: true,configurable: true,});
curMemoryArea.oncancel_smart_getter = function oncancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncancel_smart_getter);
HTMLElement.prototype.__defineGetter__("oncancel", curMemoryArea.oncancel_smart_getter);

// oncanplay
curMemoryArea.oncanplay_getter = function oncanplay() { debugger; }; mframe.safefunction(curMemoryArea.oncanplay_getter);
Object.defineProperty(curMemoryArea.oncanplay_getter, "name", {value: "get oncanplay",configurable: true,});
// oncanplay
curMemoryArea.oncanplay_setter = function oncanplay(val) { debugger; }; mframe.safefunction(curMemoryArea.oncanplay_setter);
Object.defineProperty(curMemoryArea.oncanplay_setter, "name", {value: "set oncanplay",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncanplay", {get: curMemoryArea.oncanplay_getter,set: curMemoryArea.oncanplay_setter,enumerable: true,configurable: true,});
curMemoryArea.oncanplay_smart_getter = function oncanplay() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncanplay的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncanplay_smart_getter);
HTMLElement.prototype.__defineGetter__("oncanplay", curMemoryArea.oncanplay_smart_getter);

// oncanplaythrough
curMemoryArea.oncanplaythrough_getter = function oncanplaythrough() { debugger; }; mframe.safefunction(curMemoryArea.oncanplaythrough_getter);
Object.defineProperty(curMemoryArea.oncanplaythrough_getter, "name", {value: "get oncanplaythrough",configurable: true,});
// oncanplaythrough
curMemoryArea.oncanplaythrough_setter = function oncanplaythrough(val) { debugger; }; mframe.safefunction(curMemoryArea.oncanplaythrough_setter);
Object.defineProperty(curMemoryArea.oncanplaythrough_setter, "name", {value: "set oncanplaythrough",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncanplaythrough", {get: curMemoryArea.oncanplaythrough_getter,set: curMemoryArea.oncanplaythrough_setter,enumerable: true,configurable: true,});
curMemoryArea.oncanplaythrough_smart_getter = function oncanplaythrough() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncanplaythrough的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncanplaythrough_smart_getter);
HTMLElement.prototype.__defineGetter__("oncanplaythrough", curMemoryArea.oncanplaythrough_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { debugger; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", {value: "get onchange",configurable: true,});
// onchange
curMemoryArea.onchange_setter = function onchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", {value: "set onchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onchange", {get: curMemoryArea.onchange_getter,set: curMemoryArea.onchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onchange_smart_getter = function onchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// onclick
curMemoryArea.onclick_getter = function onclick() { debugger; }; mframe.safefunction(curMemoryArea.onclick_getter);
Object.defineProperty(curMemoryArea.onclick_getter, "name", {value: "get onclick",configurable: true,});
// onclick
curMemoryArea.onclick_setter = function onclick(val) { debugger; }; mframe.safefunction(curMemoryArea.onclick_setter);
Object.defineProperty(curMemoryArea.onclick_setter, "name", {value: "set onclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onclick", {get: curMemoryArea.onclick_getter,set: curMemoryArea.onclick_setter,enumerable: true,configurable: true,});
curMemoryArea.onclick_smart_getter = function onclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onclick_smart_getter);
HTMLElement.prototype.__defineGetter__("onclick", curMemoryArea.onclick_smart_getter);

// onclose
curMemoryArea.onclose_getter = function onclose() { debugger; }; mframe.safefunction(curMemoryArea.onclose_getter);
Object.defineProperty(curMemoryArea.onclose_getter, "name", {value: "get onclose",configurable: true,});
// onclose
curMemoryArea.onclose_setter = function onclose(val) { debugger; }; mframe.safefunction(curMemoryArea.onclose_setter);
Object.defineProperty(curMemoryArea.onclose_setter, "name", {value: "set onclose",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onclose", {get: curMemoryArea.onclose_getter,set: curMemoryArea.onclose_setter,enumerable: true,configurable: true,});
curMemoryArea.onclose_smart_getter = function onclose() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onclose的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onclose_smart_getter);
HTMLElement.prototype.__defineGetter__("onclose", curMemoryArea.onclose_smart_getter);

// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_getter = function oncontentvisibilityautostatechange() { debugger; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_getter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_getter, "name", {value: "get oncontentvisibilityautostatechange",configurable: true,});
// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_setter = function oncontentvisibilityautostatechange(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_setter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_setter, "name", {value: "set oncontentvisibilityautostatechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontentvisibilityautostatechange", {get: curMemoryArea.oncontentvisibilityautostatechange_getter,set: curMemoryArea.oncontentvisibilityautostatechange_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontentvisibilityautostatechange_smart_getter = function oncontentvisibilityautostatechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncontentvisibilityautostatechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontentvisibilityautostatechange", curMemoryArea.oncontentvisibilityautostatechange_smart_getter);

// oncontextlost
curMemoryArea.oncontextlost_getter = function oncontextlost() { debugger; }; mframe.safefunction(curMemoryArea.oncontextlost_getter);
Object.defineProperty(curMemoryArea.oncontextlost_getter, "name", {value: "get oncontextlost",configurable: true,});
// oncontextlost
curMemoryArea.oncontextlost_setter = function oncontextlost(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextlost_setter);
Object.defineProperty(curMemoryArea.oncontextlost_setter, "name", {value: "set oncontextlost",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextlost", {get: curMemoryArea.oncontextlost_getter,set: curMemoryArea.oncontextlost_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextlost_smart_getter = function oncontextlost() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncontextlost的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncontextlost_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextlost", curMemoryArea.oncontextlost_smart_getter);

// oncontextmenu
curMemoryArea.oncontextmenu_getter = function oncontextmenu() { debugger; }; mframe.safefunction(curMemoryArea.oncontextmenu_getter);
Object.defineProperty(curMemoryArea.oncontextmenu_getter, "name", {value: "get oncontextmenu",configurable: true,});
// oncontextmenu
curMemoryArea.oncontextmenu_setter = function oncontextmenu(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextmenu_setter);
Object.defineProperty(curMemoryArea.oncontextmenu_setter, "name", {value: "set oncontextmenu",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextmenu", {get: curMemoryArea.oncontextmenu_getter,set: curMemoryArea.oncontextmenu_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextmenu_smart_getter = function oncontextmenu() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncontextmenu的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncontextmenu_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextmenu", curMemoryArea.oncontextmenu_smart_getter);

// oncontextrestored
curMemoryArea.oncontextrestored_getter = function oncontextrestored() { debugger; }; mframe.safefunction(curMemoryArea.oncontextrestored_getter);
Object.defineProperty(curMemoryArea.oncontextrestored_getter, "name", {value: "get oncontextrestored",configurable: true,});
// oncontextrestored
curMemoryArea.oncontextrestored_setter = function oncontextrestored(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextrestored_setter);
Object.defineProperty(curMemoryArea.oncontextrestored_setter, "name", {value: "set oncontextrestored",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextrestored", {get: curMemoryArea.oncontextrestored_getter,set: curMemoryArea.oncontextrestored_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextrestored_smart_getter = function oncontextrestored() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncontextrestored的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncontextrestored_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextrestored", curMemoryArea.oncontextrestored_smart_getter);

// oncuechange
curMemoryArea.oncuechange_getter = function oncuechange() { debugger; }; mframe.safefunction(curMemoryArea.oncuechange_getter);
Object.defineProperty(curMemoryArea.oncuechange_getter, "name", {value: "get oncuechange",configurable: true,});
// oncuechange
curMemoryArea.oncuechange_setter = function oncuechange(val) { debugger; }; mframe.safefunction(curMemoryArea.oncuechange_setter);
Object.defineProperty(curMemoryArea.oncuechange_setter, "name", {value: "set oncuechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncuechange", {get: curMemoryArea.oncuechange_getter,set: curMemoryArea.oncuechange_setter,enumerable: true,configurable: true,});
curMemoryArea.oncuechange_smart_getter = function oncuechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncuechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncuechange_smart_getter);
HTMLElement.prototype.__defineGetter__("oncuechange", curMemoryArea.oncuechange_smart_getter);

// ondblclick
curMemoryArea.ondblclick_getter = function ondblclick() { debugger; }; mframe.safefunction(curMemoryArea.ondblclick_getter);
Object.defineProperty(curMemoryArea.ondblclick_getter, "name", {value: "get ondblclick",configurable: true,});
// ondblclick
curMemoryArea.ondblclick_setter = function ondblclick(val) { debugger; }; mframe.safefunction(curMemoryArea.ondblclick_setter);
Object.defineProperty(curMemoryArea.ondblclick_setter, "name", {value: "set ondblclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondblclick", {get: curMemoryArea.ondblclick_getter,set: curMemoryArea.ondblclick_setter,enumerable: true,configurable: true,});
curMemoryArea.ondblclick_smart_getter = function ondblclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondblclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondblclick_smart_getter);
HTMLElement.prototype.__defineGetter__("ondblclick", curMemoryArea.ondblclick_smart_getter);

// ondrag
curMemoryArea.ondrag_getter = function ondrag() { debugger; }; mframe.safefunction(curMemoryArea.ondrag_getter);
Object.defineProperty(curMemoryArea.ondrag_getter, "name", {value: "get ondrag",configurable: true,});
// ondrag
curMemoryArea.ondrag_setter = function ondrag(val) { debugger; }; mframe.safefunction(curMemoryArea.ondrag_setter);
Object.defineProperty(curMemoryArea.ondrag_setter, "name", {value: "set ondrag",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondrag", {get: curMemoryArea.ondrag_getter,set: curMemoryArea.ondrag_setter,enumerable: true,configurable: true,});
curMemoryArea.ondrag_smart_getter = function ondrag() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondrag的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondrag_smart_getter);
HTMLElement.prototype.__defineGetter__("ondrag", curMemoryArea.ondrag_smart_getter);

// ondragend
curMemoryArea.ondragend_getter = function ondragend() { debugger; }; mframe.safefunction(curMemoryArea.ondragend_getter);
Object.defineProperty(curMemoryArea.ondragend_getter, "name", {value: "get ondragend",configurable: true,});
// ondragend
curMemoryArea.ondragend_setter = function ondragend(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragend_setter);
Object.defineProperty(curMemoryArea.ondragend_setter, "name", {value: "set ondragend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragend", {get: curMemoryArea.ondragend_getter,set: curMemoryArea.ondragend_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragend_smart_getter = function ondragend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondragend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondragend_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragend", curMemoryArea.ondragend_smart_getter);

// ondragenter
curMemoryArea.ondragenter_getter = function ondragenter() { debugger; }; mframe.safefunction(curMemoryArea.ondragenter_getter);
Object.defineProperty(curMemoryArea.ondragenter_getter, "name", {value: "get ondragenter",configurable: true,});
// ondragenter
curMemoryArea.ondragenter_setter = function ondragenter(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragenter_setter);
Object.defineProperty(curMemoryArea.ondragenter_setter, "name", {value: "set ondragenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragenter", {get: curMemoryArea.ondragenter_getter,set: curMemoryArea.ondragenter_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragenter_smart_getter = function ondragenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondragenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondragenter_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragenter", curMemoryArea.ondragenter_smart_getter);

// ondragleave
curMemoryArea.ondragleave_getter = function ondragleave() { debugger; }; mframe.safefunction(curMemoryArea.ondragleave_getter);
Object.defineProperty(curMemoryArea.ondragleave_getter, "name", {value: "get ondragleave",configurable: true,});
// ondragleave
curMemoryArea.ondragleave_setter = function ondragleave(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragleave_setter);
Object.defineProperty(curMemoryArea.ondragleave_setter, "name", {value: "set ondragleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragleave", {get: curMemoryArea.ondragleave_getter,set: curMemoryArea.ondragleave_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragleave_smart_getter = function ondragleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondragleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondragleave_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragleave", curMemoryArea.ondragleave_smart_getter);

// ondragover
curMemoryArea.ondragover_getter = function ondragover() { debugger; }; mframe.safefunction(curMemoryArea.ondragover_getter);
Object.defineProperty(curMemoryArea.ondragover_getter, "name", {value: "get ondragover",configurable: true,});
// ondragover
curMemoryArea.ondragover_setter = function ondragover(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragover_setter);
Object.defineProperty(curMemoryArea.ondragover_setter, "name", {value: "set ondragover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragover", {get: curMemoryArea.ondragover_getter,set: curMemoryArea.ondragover_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragover_smart_getter = function ondragover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondragover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondragover_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragover", curMemoryArea.ondragover_smart_getter);

// ondragstart
curMemoryArea.ondragstart_getter = function ondragstart() { debugger; }; mframe.safefunction(curMemoryArea.ondragstart_getter);
Object.defineProperty(curMemoryArea.ondragstart_getter, "name", {value: "get ondragstart",configurable: true,});
// ondragstart
curMemoryArea.ondragstart_setter = function ondragstart(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragstart_setter);
Object.defineProperty(curMemoryArea.ondragstart_setter, "name", {value: "set ondragstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragstart", {get: curMemoryArea.ondragstart_getter,set: curMemoryArea.ondragstart_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragstart_smart_getter = function ondragstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondragstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondragstart_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragstart", curMemoryArea.ondragstart_smart_getter);

// ondrop
curMemoryArea.ondrop_getter = function ondrop() { debugger; }; mframe.safefunction(curMemoryArea.ondrop_getter);
Object.defineProperty(curMemoryArea.ondrop_getter, "name", {value: "get ondrop",configurable: true,});
// ondrop
curMemoryArea.ondrop_setter = function ondrop(val) { debugger; }; mframe.safefunction(curMemoryArea.ondrop_setter);
Object.defineProperty(curMemoryArea.ondrop_setter, "name", {value: "set ondrop",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondrop", {get: curMemoryArea.ondrop_getter,set: curMemoryArea.ondrop_setter,enumerable: true,configurable: true,});
curMemoryArea.ondrop_smart_getter = function ondrop() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondrop的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondrop_smart_getter);
HTMLElement.prototype.__defineGetter__("ondrop", curMemoryArea.ondrop_smart_getter);

// ondurationchange
curMemoryArea.ondurationchange_getter = function ondurationchange() { debugger; }; mframe.safefunction(curMemoryArea.ondurationchange_getter);
Object.defineProperty(curMemoryArea.ondurationchange_getter, "name", {value: "get ondurationchange",configurable: true,});
// ondurationchange
curMemoryArea.ondurationchange_setter = function ondurationchange(val) { debugger; }; mframe.safefunction(curMemoryArea.ondurationchange_setter);
Object.defineProperty(curMemoryArea.ondurationchange_setter, "name", {value: "set ondurationchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondurationchange", {get: curMemoryArea.ondurationchange_getter,set: curMemoryArea.ondurationchange_setter,enumerable: true,configurable: true,});
curMemoryArea.ondurationchange_smart_getter = function ondurationchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ondurationchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ondurationchange_smart_getter);
HTMLElement.prototype.__defineGetter__("ondurationchange", curMemoryArea.ondurationchange_smart_getter);

// onemptied
curMemoryArea.onemptied_getter = function onemptied() { debugger; }; mframe.safefunction(curMemoryArea.onemptied_getter);
Object.defineProperty(curMemoryArea.onemptied_getter, "name", {value: "get onemptied",configurable: true,});
// onemptied
curMemoryArea.onemptied_setter = function onemptied(val) { debugger; }; mframe.safefunction(curMemoryArea.onemptied_setter);
Object.defineProperty(curMemoryArea.onemptied_setter, "name", {value: "set onemptied",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onemptied", {get: curMemoryArea.onemptied_getter,set: curMemoryArea.onemptied_setter,enumerable: true,configurable: true,});
curMemoryArea.onemptied_smart_getter = function onemptied() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onemptied的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onemptied_smart_getter);
HTMLElement.prototype.__defineGetter__("onemptied", curMemoryArea.onemptied_smart_getter);

// onended
curMemoryArea.onended_getter = function onended() { debugger; }; mframe.safefunction(curMemoryArea.onended_getter);
Object.defineProperty(curMemoryArea.onended_getter, "name", {value: "get onended",configurable: true,});
// onended
curMemoryArea.onended_setter = function onended(val) { debugger; }; mframe.safefunction(curMemoryArea.onended_setter);
Object.defineProperty(curMemoryArea.onended_setter, "name", {value: "set onended",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onended", {get: curMemoryArea.onended_getter,set: curMemoryArea.onended_setter,enumerable: true,configurable: true,});
curMemoryArea.onended_smart_getter = function onended() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onended的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onended_smart_getter);
HTMLElement.prototype.__defineGetter__("onended", curMemoryArea.onended_smart_getter);

// onerror
curMemoryArea.onerror_getter = function onerror() { debugger; }; mframe.safefunction(curMemoryArea.onerror_getter);
Object.defineProperty(curMemoryArea.onerror_getter, "name", {value: "get onerror",configurable: true,});
// onerror
curMemoryArea.onerror_setter = function onerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onerror_setter);
Object.defineProperty(curMemoryArea.onerror_setter, "name", {value: "set onerror",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onerror", {get: curMemoryArea.onerror_getter,set: curMemoryArea.onerror_setter,enumerable: true,configurable: true,});
curMemoryArea.onerror_smart_getter = function onerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onerror_smart_getter);
HTMLElement.prototype.__defineGetter__("onerror", curMemoryArea.onerror_smart_getter);

// onfocus
curMemoryArea.onfocus_getter = function onfocus() { debugger; }; mframe.safefunction(curMemoryArea.onfocus_getter);
Object.defineProperty(curMemoryArea.onfocus_getter, "name", {value: "get onfocus",configurable: true,});
// onfocus
curMemoryArea.onfocus_setter = function onfocus(val) { debugger; }; mframe.safefunction(curMemoryArea.onfocus_setter);
Object.defineProperty(curMemoryArea.onfocus_setter, "name", {value: "set onfocus",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onfocus", {get: curMemoryArea.onfocus_getter,set: curMemoryArea.onfocus_setter,enumerable: true,configurable: true,});
curMemoryArea.onfocus_smart_getter = function onfocus() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onfocus的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onfocus_smart_getter);
HTMLElement.prototype.__defineGetter__("onfocus", curMemoryArea.onfocus_smart_getter);

// onformdata
curMemoryArea.onformdata_getter = function onformdata() { debugger; }; mframe.safefunction(curMemoryArea.onformdata_getter);
Object.defineProperty(curMemoryArea.onformdata_getter, "name", {value: "get onformdata",configurable: true,});
// onformdata
curMemoryArea.onformdata_setter = function onformdata(val) { debugger; }; mframe.safefunction(curMemoryArea.onformdata_setter);
Object.defineProperty(curMemoryArea.onformdata_setter, "name", {value: "set onformdata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onformdata", {get: curMemoryArea.onformdata_getter,set: curMemoryArea.onformdata_setter,enumerable: true,configurable: true,});
curMemoryArea.onformdata_smart_getter = function onformdata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onformdata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onformdata_smart_getter);
HTMLElement.prototype.__defineGetter__("onformdata", curMemoryArea.onformdata_smart_getter);

// oninput
curMemoryArea.oninput_getter = function oninput() { debugger; }; mframe.safefunction(curMemoryArea.oninput_getter);
Object.defineProperty(curMemoryArea.oninput_getter, "name", {value: "get oninput",configurable: true,});
// oninput
curMemoryArea.oninput_setter = function oninput(val) { debugger; }; mframe.safefunction(curMemoryArea.oninput_setter);
Object.defineProperty(curMemoryArea.oninput_setter, "name", {value: "set oninput",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oninput", {get: curMemoryArea.oninput_getter,set: curMemoryArea.oninput_setter,enumerable: true,configurable: true,});
curMemoryArea.oninput_smart_getter = function oninput() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oninput的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oninput_smart_getter);
HTMLElement.prototype.__defineGetter__("oninput", curMemoryArea.oninput_smart_getter);

// oninvalid
curMemoryArea.oninvalid_getter = function oninvalid() { debugger; }; mframe.safefunction(curMemoryArea.oninvalid_getter);
Object.defineProperty(curMemoryArea.oninvalid_getter, "name", {value: "get oninvalid",configurable: true,});
// oninvalid
curMemoryArea.oninvalid_setter = function oninvalid(val) { debugger; }; mframe.safefunction(curMemoryArea.oninvalid_setter);
Object.defineProperty(curMemoryArea.oninvalid_setter, "name", {value: "set oninvalid",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oninvalid", {get: curMemoryArea.oninvalid_getter,set: curMemoryArea.oninvalid_setter,enumerable: true,configurable: true,});
curMemoryArea.oninvalid_smart_getter = function oninvalid() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oninvalid的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oninvalid_smart_getter);
HTMLElement.prototype.__defineGetter__("oninvalid", curMemoryArea.oninvalid_smart_getter);

// onkeydown
curMemoryArea.onkeydown_getter = function onkeydown() { debugger; }; mframe.safefunction(curMemoryArea.onkeydown_getter);
Object.defineProperty(curMemoryArea.onkeydown_getter, "name", {value: "get onkeydown",configurable: true,});
// onkeydown
curMemoryArea.onkeydown_setter = function onkeydown(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeydown_setter);
Object.defineProperty(curMemoryArea.onkeydown_setter, "name", {value: "set onkeydown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeydown", {get: curMemoryArea.onkeydown_getter,set: curMemoryArea.onkeydown_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeydown_smart_getter = function onkeydown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onkeydown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onkeydown_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeydown", curMemoryArea.onkeydown_smart_getter);

// onkeypress
curMemoryArea.onkeypress_getter = function onkeypress() { debugger; }; mframe.safefunction(curMemoryArea.onkeypress_getter);
Object.defineProperty(curMemoryArea.onkeypress_getter, "name", {value: "get onkeypress",configurable: true,});
// onkeypress
curMemoryArea.onkeypress_setter = function onkeypress(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeypress_setter);
Object.defineProperty(curMemoryArea.onkeypress_setter, "name", {value: "set onkeypress",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeypress", {get: curMemoryArea.onkeypress_getter,set: curMemoryArea.onkeypress_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeypress_smart_getter = function onkeypress() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onkeypress的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onkeypress_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeypress", curMemoryArea.onkeypress_smart_getter);

// onkeyup
curMemoryArea.onkeyup_getter = function onkeyup() { debugger; }; mframe.safefunction(curMemoryArea.onkeyup_getter);
Object.defineProperty(curMemoryArea.onkeyup_getter, "name", {value: "get onkeyup",configurable: true,});
// onkeyup
curMemoryArea.onkeyup_setter = function onkeyup(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeyup_setter);
Object.defineProperty(curMemoryArea.onkeyup_setter, "name", {value: "set onkeyup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeyup", {get: curMemoryArea.onkeyup_getter,set: curMemoryArea.onkeyup_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeyup_smart_getter = function onkeyup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onkeyup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onkeyup_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeyup", curMemoryArea.onkeyup_smart_getter);

// onload
curMemoryArea.onload_getter = function onload() { debugger; }; mframe.safefunction(curMemoryArea.onload_getter);
Object.defineProperty(curMemoryArea.onload_getter, "name", {value: "get onload",configurable: true,});
// onload
curMemoryArea.onload_setter = function onload(val) { debugger; }; mframe.safefunction(curMemoryArea.onload_setter);
Object.defineProperty(curMemoryArea.onload_setter, "name", {value: "set onload",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onload", {get: curMemoryArea.onload_getter,set: curMemoryArea.onload_setter,enumerable: true,configurable: true,});
curMemoryArea.onload_smart_getter = function onload() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onload的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onload_smart_getter);
HTMLElement.prototype.__defineGetter__("onload", curMemoryArea.onload_smart_getter);

// onloadeddata
curMemoryArea.onloadeddata_getter = function onloadeddata() { debugger; }; mframe.safefunction(curMemoryArea.onloadeddata_getter);
Object.defineProperty(curMemoryArea.onloadeddata_getter, "name", {value: "get onloadeddata",configurable: true,});
// onloadeddata
curMemoryArea.onloadeddata_setter = function onloadeddata(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadeddata_setter);
Object.defineProperty(curMemoryArea.onloadeddata_setter, "name", {value: "set onloadeddata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadeddata", {get: curMemoryArea.onloadeddata_getter,set: curMemoryArea.onloadeddata_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadeddata_smart_getter = function onloadeddata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onloadeddata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onloadeddata_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadeddata", curMemoryArea.onloadeddata_smart_getter);

// onloadedmetadata
curMemoryArea.onloadedmetadata_getter = function onloadedmetadata() { debugger; }; mframe.safefunction(curMemoryArea.onloadedmetadata_getter);
Object.defineProperty(curMemoryArea.onloadedmetadata_getter, "name", {value: "get onloadedmetadata",configurable: true,});
// onloadedmetadata
curMemoryArea.onloadedmetadata_setter = function onloadedmetadata(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadedmetadata_setter);
Object.defineProperty(curMemoryArea.onloadedmetadata_setter, "name", {value: "set onloadedmetadata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadedmetadata", {get: curMemoryArea.onloadedmetadata_getter,set: curMemoryArea.onloadedmetadata_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadedmetadata_smart_getter = function onloadedmetadata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onloadedmetadata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onloadedmetadata_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadedmetadata", curMemoryArea.onloadedmetadata_smart_getter);

// onloadstart
curMemoryArea.onloadstart_getter = function onloadstart() { debugger; }; mframe.safefunction(curMemoryArea.onloadstart_getter);
Object.defineProperty(curMemoryArea.onloadstart_getter, "name", {value: "get onloadstart",configurable: true,});
// onloadstart
curMemoryArea.onloadstart_setter = function onloadstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadstart_setter);
Object.defineProperty(curMemoryArea.onloadstart_setter, "name", {value: "set onloadstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadstart", {get: curMemoryArea.onloadstart_getter,set: curMemoryArea.onloadstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadstart_smart_getter = function onloadstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onloadstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onloadstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadstart", curMemoryArea.onloadstart_smart_getter);

// onmousedown
curMemoryArea.onmousedown_getter = function onmousedown() { debugger; }; mframe.safefunction(curMemoryArea.onmousedown_getter);
Object.defineProperty(curMemoryArea.onmousedown_getter, "name", {value: "get onmousedown",configurable: true,});
// onmousedown
curMemoryArea.onmousedown_setter = function onmousedown(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousedown_setter);
Object.defineProperty(curMemoryArea.onmousedown_setter, "name", {value: "set onmousedown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousedown", {get: curMemoryArea.onmousedown_getter,set: curMemoryArea.onmousedown_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousedown_smart_getter = function onmousedown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onmousedown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmousedown_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousedown", curMemoryArea.onmousedown_smart_getter);

// onmouseenter
curMemoryArea.onmouseenter_getter = function onmouseenter() { debugger; }; mframe.safefunction(curMemoryArea.onmouseenter_getter);
Object.defineProperty(curMemoryArea.onmouseenter_getter, "name", {value: "get onmouseenter",configurable: true,});
// onmouseenter
curMemoryArea.onmouseenter_setter = function onmouseenter(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseenter_setter);
Object.defineProperty(curMemoryArea.onmouseenter_setter, "name", {value: "set onmouseenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseenter", {get: curMemoryArea.onmouseenter_getter,set: curMemoryArea.onmouseenter_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseenter_smart_getter = function onmouseenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onmouseenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmouseenter_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseenter", curMemoryArea.onmouseenter_smart_getter);

// onmouseleave
curMemoryArea.onmouseleave_getter = function onmouseleave() { debugger; }; mframe.safefunction(curMemoryArea.onmouseleave_getter);
Object.defineProperty(curMemoryArea.onmouseleave_getter, "name", {value: "get onmouseleave",configurable: true,});
// onmouseleave
curMemoryArea.onmouseleave_setter = function onmouseleave(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseleave_setter);
Object.defineProperty(curMemoryArea.onmouseleave_setter, "name", {value: "set onmouseleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseleave", {get: curMemoryArea.onmouseleave_getter,set: curMemoryArea.onmouseleave_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseleave_smart_getter = function onmouseleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onmouseleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmouseleave_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseleave", curMemoryArea.onmouseleave_smart_getter);

// onmousemove
curMemoryArea.onmousemove_getter = function onmousemove() { debugger; }; mframe.safefunction(curMemoryArea.onmousemove_getter);
Object.defineProperty(curMemoryArea.onmousemove_getter, "name", {value: "get onmousemove",configurable: true,});
// onmousemove
curMemoryArea.onmousemove_setter = function onmousemove(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousemove_setter);
Object.defineProperty(curMemoryArea.onmousemove_setter, "name", {value: "set onmousemove",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousemove", {get: curMemoryArea.onmousemove_getter,set: curMemoryArea.onmousemove_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousemove_smart_getter = function onmousemove() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onmousemove的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmousemove_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousemove", curMemoryArea.onmousemove_smart_getter);

// onmouseout
curMemoryArea.onmouseout_getter = function onmouseout() { debugger; }; mframe.safefunction(curMemoryArea.onmouseout_getter);
Object.defineProperty(curMemoryArea.onmouseout_getter, "name", {value: "get onmouseout",configurable: true,});
// onmouseout
curMemoryArea.onmouseout_setter = function onmouseout(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseout_setter);
Object.defineProperty(curMemoryArea.onmouseout_setter, "name", {value: "set onmouseout",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseout", {get: curMemoryArea.onmouseout_getter,set: curMemoryArea.onmouseout_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseout_smart_getter = function onmouseout() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onmouseout的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmouseout_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseout", curMemoryArea.onmouseout_smart_getter);

// onmouseover
curMemoryArea.onmouseover_getter = function onmouseover() { debugger; }; mframe.safefunction(curMemoryArea.onmouseover_getter);
Object.defineProperty(curMemoryArea.onmouseover_getter, "name", {value: "get onmouseover",configurable: true,});
// onmouseover
curMemoryArea.onmouseover_setter = function onmouseover(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseover_setter);
Object.defineProperty(curMemoryArea.onmouseover_setter, "name", {value: "set onmouseover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseover", {get: curMemoryArea.onmouseover_getter,set: curMemoryArea.onmouseover_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseover_smart_getter = function onmouseover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onmouseover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmouseover_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseover", curMemoryArea.onmouseover_smart_getter);

// onmouseup
curMemoryArea.onmouseup_getter = function onmouseup() { debugger; }; mframe.safefunction(curMemoryArea.onmouseup_getter);
Object.defineProperty(curMemoryArea.onmouseup_getter, "name", {value: "get onmouseup",configurable: true,});
// onmouseup
curMemoryArea.onmouseup_setter = function onmouseup(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseup_setter);
Object.defineProperty(curMemoryArea.onmouseup_setter, "name", {value: "set onmouseup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseup", {get: curMemoryArea.onmouseup_getter,set: curMemoryArea.onmouseup_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseup_smart_getter = function onmouseup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onmouseup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmouseup_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseup", curMemoryArea.onmouseup_smart_getter);

// onmousewheel
curMemoryArea.onmousewheel_getter = function onmousewheel() { debugger; }; mframe.safefunction(curMemoryArea.onmousewheel_getter);
Object.defineProperty(curMemoryArea.onmousewheel_getter, "name", {value: "get onmousewheel",configurable: true,});
// onmousewheel
curMemoryArea.onmousewheel_setter = function onmousewheel(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousewheel_setter);
Object.defineProperty(curMemoryArea.onmousewheel_setter, "name", {value: "set onmousewheel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousewheel", {get: curMemoryArea.onmousewheel_getter,set: curMemoryArea.onmousewheel_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousewheel_smart_getter = function onmousewheel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onmousewheel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmousewheel_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousewheel", curMemoryArea.onmousewheel_smart_getter);

// onpause
curMemoryArea.onpause_getter = function onpause() { debugger; }; mframe.safefunction(curMemoryArea.onpause_getter);
Object.defineProperty(curMemoryArea.onpause_getter, "name", {value: "get onpause",configurable: true,});
// onpause
curMemoryArea.onpause_setter = function onpause(val) { debugger; }; mframe.safefunction(curMemoryArea.onpause_setter);
Object.defineProperty(curMemoryArea.onpause_setter, "name", {value: "set onpause",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpause", {get: curMemoryArea.onpause_getter,set: curMemoryArea.onpause_setter,enumerable: true,configurable: true,});
curMemoryArea.onpause_smart_getter = function onpause() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpause的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpause_smart_getter);
HTMLElement.prototype.__defineGetter__("onpause", curMemoryArea.onpause_smart_getter);

// onplay
curMemoryArea.onplay_getter = function onplay() { debugger; }; mframe.safefunction(curMemoryArea.onplay_getter);
Object.defineProperty(curMemoryArea.onplay_getter, "name", {value: "get onplay",configurable: true,});
// onplay
curMemoryArea.onplay_setter = function onplay(val) { debugger; }; mframe.safefunction(curMemoryArea.onplay_setter);
Object.defineProperty(curMemoryArea.onplay_setter, "name", {value: "set onplay",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onplay", {get: curMemoryArea.onplay_getter,set: curMemoryArea.onplay_setter,enumerable: true,configurable: true,});
curMemoryArea.onplay_smart_getter = function onplay() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onplay的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onplay_smart_getter);
HTMLElement.prototype.__defineGetter__("onplay", curMemoryArea.onplay_smart_getter);

// onplaying
curMemoryArea.onplaying_getter = function onplaying() { debugger; }; mframe.safefunction(curMemoryArea.onplaying_getter);
Object.defineProperty(curMemoryArea.onplaying_getter, "name", {value: "get onplaying",configurable: true,});
// onplaying
curMemoryArea.onplaying_setter = function onplaying(val) { debugger; }; mframe.safefunction(curMemoryArea.onplaying_setter);
Object.defineProperty(curMemoryArea.onplaying_setter, "name", {value: "set onplaying",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onplaying", {get: curMemoryArea.onplaying_getter,set: curMemoryArea.onplaying_setter,enumerable: true,configurable: true,});
curMemoryArea.onplaying_smart_getter = function onplaying() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onplaying的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onplaying_smart_getter);
HTMLElement.prototype.__defineGetter__("onplaying", curMemoryArea.onplaying_smart_getter);

// onprogress
curMemoryArea.onprogress_getter = function onprogress() { debugger; }; mframe.safefunction(curMemoryArea.onprogress_getter);
Object.defineProperty(curMemoryArea.onprogress_getter, "name", {value: "get onprogress",configurable: true,});
// onprogress
curMemoryArea.onprogress_setter = function onprogress(val) { debugger; }; mframe.safefunction(curMemoryArea.onprogress_setter);
Object.defineProperty(curMemoryArea.onprogress_setter, "name", {value: "set onprogress",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onprogress", {get: curMemoryArea.onprogress_getter,set: curMemoryArea.onprogress_setter,enumerable: true,configurable: true,});
curMemoryArea.onprogress_smart_getter = function onprogress() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onprogress的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onprogress_smart_getter);
HTMLElement.prototype.__defineGetter__("onprogress", curMemoryArea.onprogress_smart_getter);

// onratechange
curMemoryArea.onratechange_getter = function onratechange() { debugger; }; mframe.safefunction(curMemoryArea.onratechange_getter);
Object.defineProperty(curMemoryArea.onratechange_getter, "name", {value: "get onratechange",configurable: true,});
// onratechange
curMemoryArea.onratechange_setter = function onratechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onratechange_setter);
Object.defineProperty(curMemoryArea.onratechange_setter, "name", {value: "set onratechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onratechange", {get: curMemoryArea.onratechange_getter,set: curMemoryArea.onratechange_setter,enumerable: true,configurable: true,});
curMemoryArea.onratechange_smart_getter = function onratechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onratechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onratechange_smart_getter);
HTMLElement.prototype.__defineGetter__("onratechange", curMemoryArea.onratechange_smart_getter);

// onreset
curMemoryArea.onreset_getter = function onreset() { debugger; }; mframe.safefunction(curMemoryArea.onreset_getter);
Object.defineProperty(curMemoryArea.onreset_getter, "name", {value: "get onreset",configurable: true,});
// onreset
curMemoryArea.onreset_setter = function onreset(val) { debugger; }; mframe.safefunction(curMemoryArea.onreset_setter);
Object.defineProperty(curMemoryArea.onreset_setter, "name", {value: "set onreset",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onreset", {get: curMemoryArea.onreset_getter,set: curMemoryArea.onreset_setter,enumerable: true,configurable: true,});
curMemoryArea.onreset_smart_getter = function onreset() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onreset的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onreset_smart_getter);
HTMLElement.prototype.__defineGetter__("onreset", curMemoryArea.onreset_smart_getter);

// onresize
curMemoryArea.onresize_getter = function onresize() { debugger; }; mframe.safefunction(curMemoryArea.onresize_getter);
Object.defineProperty(curMemoryArea.onresize_getter, "name", {value: "get onresize",configurable: true,});
// onresize
curMemoryArea.onresize_setter = function onresize(val) { debugger; }; mframe.safefunction(curMemoryArea.onresize_setter);
Object.defineProperty(curMemoryArea.onresize_setter, "name", {value: "set onresize",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onresize", {get: curMemoryArea.onresize_getter,set: curMemoryArea.onresize_setter,enumerable: true,configurable: true,});
curMemoryArea.onresize_smart_getter = function onresize() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onresize的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onresize_smart_getter);
HTMLElement.prototype.__defineGetter__("onresize", curMemoryArea.onresize_smart_getter);

// onscroll
curMemoryArea.onscroll_getter = function onscroll() { debugger; }; mframe.safefunction(curMemoryArea.onscroll_getter);
Object.defineProperty(curMemoryArea.onscroll_getter, "name", {value: "get onscroll",configurable: true,});
// onscroll
curMemoryArea.onscroll_setter = function onscroll(val) { debugger; }; mframe.safefunction(curMemoryArea.onscroll_setter);
Object.defineProperty(curMemoryArea.onscroll_setter, "name", {value: "set onscroll",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscroll", {get: curMemoryArea.onscroll_getter,set: curMemoryArea.onscroll_setter,enumerable: true,configurable: true,});
curMemoryArea.onscroll_smart_getter = function onscroll() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onscroll的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onscroll_smart_getter);
HTMLElement.prototype.__defineGetter__("onscroll", curMemoryArea.onscroll_smart_getter);

// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_getter = function onsecuritypolicyviolation() { debugger; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_getter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_getter, "name", {value: "get onsecuritypolicyviolation",configurable: true,});
// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_setter = function onsecuritypolicyviolation(val) { debugger; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_setter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_setter, "name", {value: "set onsecuritypolicyviolation",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsecuritypolicyviolation", {get: curMemoryArea.onsecuritypolicyviolation_getter,set: curMemoryArea.onsecuritypolicyviolation_setter,enumerable: true,configurable: true,});
curMemoryArea.onsecuritypolicyviolation_smart_getter = function onsecuritypolicyviolation() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onsecuritypolicyviolation的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_smart_getter);
HTMLElement.prototype.__defineGetter__("onsecuritypolicyviolation", curMemoryArea.onsecuritypolicyviolation_smart_getter);

// onseeked
curMemoryArea.onseeked_getter = function onseeked() { debugger; }; mframe.safefunction(curMemoryArea.onseeked_getter);
Object.defineProperty(curMemoryArea.onseeked_getter, "name", {value: "get onseeked",configurable: true,});
// onseeked
curMemoryArea.onseeked_setter = function onseeked(val) { debugger; }; mframe.safefunction(curMemoryArea.onseeked_setter);
Object.defineProperty(curMemoryArea.onseeked_setter, "name", {value: "set onseeked",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onseeked", {get: curMemoryArea.onseeked_getter,set: curMemoryArea.onseeked_setter,enumerable: true,configurable: true,});
curMemoryArea.onseeked_smart_getter = function onseeked() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onseeked的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onseeked_smart_getter);
HTMLElement.prototype.__defineGetter__("onseeked", curMemoryArea.onseeked_smart_getter);

// onseeking
curMemoryArea.onseeking_getter = function onseeking() { debugger; }; mframe.safefunction(curMemoryArea.onseeking_getter);
Object.defineProperty(curMemoryArea.onseeking_getter, "name", {value: "get onseeking",configurable: true,});
// onseeking
curMemoryArea.onseeking_setter = function onseeking(val) { debugger; }; mframe.safefunction(curMemoryArea.onseeking_setter);
Object.defineProperty(curMemoryArea.onseeking_setter, "name", {value: "set onseeking",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onseeking", {get: curMemoryArea.onseeking_getter,set: curMemoryArea.onseeking_setter,enumerable: true,configurable: true,});
curMemoryArea.onseeking_smart_getter = function onseeking() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onseeking的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onseeking_smart_getter);
HTMLElement.prototype.__defineGetter__("onseeking", curMemoryArea.onseeking_smart_getter);

// onselect
curMemoryArea.onselect_getter = function onselect() { debugger; }; mframe.safefunction(curMemoryArea.onselect_getter);
Object.defineProperty(curMemoryArea.onselect_getter, "name", {value: "get onselect",configurable: true,});
// onselect
curMemoryArea.onselect_setter = function onselect(val) { debugger; }; mframe.safefunction(curMemoryArea.onselect_setter);
Object.defineProperty(curMemoryArea.onselect_setter, "name", {value: "set onselect",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselect", {get: curMemoryArea.onselect_getter,set: curMemoryArea.onselect_setter,enumerable: true,configurable: true,});
curMemoryArea.onselect_smart_getter = function onselect() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onselect的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onselect_smart_getter);
HTMLElement.prototype.__defineGetter__("onselect", curMemoryArea.onselect_smart_getter);

// onslotchange
curMemoryArea.onslotchange_getter = function onslotchange() { debugger; }; mframe.safefunction(curMemoryArea.onslotchange_getter);
Object.defineProperty(curMemoryArea.onslotchange_getter, "name", {value: "get onslotchange",configurable: true,});
// onslotchange
curMemoryArea.onslotchange_setter = function onslotchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onslotchange_setter);
Object.defineProperty(curMemoryArea.onslotchange_setter, "name", {value: "set onslotchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onslotchange", {get: curMemoryArea.onslotchange_getter,set: curMemoryArea.onslotchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onslotchange_smart_getter = function onslotchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onslotchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onslotchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onslotchange", curMemoryArea.onslotchange_smart_getter);

// onstalled
curMemoryArea.onstalled_getter = function onstalled() { debugger; }; mframe.safefunction(curMemoryArea.onstalled_getter);
Object.defineProperty(curMemoryArea.onstalled_getter, "name", {value: "get onstalled",configurable: true,});
// onstalled
curMemoryArea.onstalled_setter = function onstalled(val) { debugger; }; mframe.safefunction(curMemoryArea.onstalled_setter);
Object.defineProperty(curMemoryArea.onstalled_setter, "name", {value: "set onstalled",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onstalled", {get: curMemoryArea.onstalled_getter,set: curMemoryArea.onstalled_setter,enumerable: true,configurable: true,});
curMemoryArea.onstalled_smart_getter = function onstalled() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onstalled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onstalled_smart_getter);
HTMLElement.prototype.__defineGetter__("onstalled", curMemoryArea.onstalled_smart_getter);

// onsubmit
curMemoryArea.onsubmit_getter = function onsubmit() { debugger; }; mframe.safefunction(curMemoryArea.onsubmit_getter);
Object.defineProperty(curMemoryArea.onsubmit_getter, "name", {value: "get onsubmit",configurable: true,});
// onsubmit
curMemoryArea.onsubmit_setter = function onsubmit(val) { debugger; }; mframe.safefunction(curMemoryArea.onsubmit_setter);
Object.defineProperty(curMemoryArea.onsubmit_setter, "name", {value: "set onsubmit",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsubmit", {get: curMemoryArea.onsubmit_getter,set: curMemoryArea.onsubmit_setter,enumerable: true,configurable: true,});
curMemoryArea.onsubmit_smart_getter = function onsubmit() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onsubmit的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onsubmit_smart_getter);
HTMLElement.prototype.__defineGetter__("onsubmit", curMemoryArea.onsubmit_smart_getter);

// onsuspend
curMemoryArea.onsuspend_getter = function onsuspend() { debugger; }; mframe.safefunction(curMemoryArea.onsuspend_getter);
Object.defineProperty(curMemoryArea.onsuspend_getter, "name", {value: "get onsuspend",configurable: true,});
// onsuspend
curMemoryArea.onsuspend_setter = function onsuspend(val) { debugger; }; mframe.safefunction(curMemoryArea.onsuspend_setter);
Object.defineProperty(curMemoryArea.onsuspend_setter, "name", {value: "set onsuspend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsuspend", {get: curMemoryArea.onsuspend_getter,set: curMemoryArea.onsuspend_setter,enumerable: true,configurable: true,});
curMemoryArea.onsuspend_smart_getter = function onsuspend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onsuspend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onsuspend_smart_getter);
HTMLElement.prototype.__defineGetter__("onsuspend", curMemoryArea.onsuspend_smart_getter);

// ontimeupdate
curMemoryArea.ontimeupdate_getter = function ontimeupdate() { debugger; }; mframe.safefunction(curMemoryArea.ontimeupdate_getter);
Object.defineProperty(curMemoryArea.ontimeupdate_getter, "name", {value: "get ontimeupdate",configurable: true,});
// ontimeupdate
curMemoryArea.ontimeupdate_setter = function ontimeupdate(val) { debugger; }; mframe.safefunction(curMemoryArea.ontimeupdate_setter);
Object.defineProperty(curMemoryArea.ontimeupdate_setter, "name", {value: "set ontimeupdate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontimeupdate", {get: curMemoryArea.ontimeupdate_getter,set: curMemoryArea.ontimeupdate_setter,enumerable: true,configurable: true,});
curMemoryArea.ontimeupdate_smart_getter = function ontimeupdate() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ontimeupdate的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ontimeupdate_smart_getter);
HTMLElement.prototype.__defineGetter__("ontimeupdate", curMemoryArea.ontimeupdate_smart_getter);

// ontoggle
curMemoryArea.ontoggle_getter = function ontoggle() { debugger; }; mframe.safefunction(curMemoryArea.ontoggle_getter);
Object.defineProperty(curMemoryArea.ontoggle_getter, "name", {value: "get ontoggle",configurable: true,});
// ontoggle
curMemoryArea.ontoggle_setter = function ontoggle(val) { debugger; }; mframe.safefunction(curMemoryArea.ontoggle_setter);
Object.defineProperty(curMemoryArea.ontoggle_setter, "name", {value: "set ontoggle",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontoggle", {get: curMemoryArea.ontoggle_getter,set: curMemoryArea.ontoggle_setter,enumerable: true,configurable: true,});
curMemoryArea.ontoggle_smart_getter = function ontoggle() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ontoggle的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ontoggle_smart_getter);
HTMLElement.prototype.__defineGetter__("ontoggle", curMemoryArea.ontoggle_smart_getter);

// onvolumechange
curMemoryArea.onvolumechange_getter = function onvolumechange() { debugger; }; mframe.safefunction(curMemoryArea.onvolumechange_getter);
Object.defineProperty(curMemoryArea.onvolumechange_getter, "name", {value: "get onvolumechange",configurable: true,});
// onvolumechange
curMemoryArea.onvolumechange_setter = function onvolumechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onvolumechange_setter);
Object.defineProperty(curMemoryArea.onvolumechange_setter, "name", {value: "set onvolumechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onvolumechange", {get: curMemoryArea.onvolumechange_getter,set: curMemoryArea.onvolumechange_setter,enumerable: true,configurable: true,});
curMemoryArea.onvolumechange_smart_getter = function onvolumechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onvolumechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onvolumechange_smart_getter);
HTMLElement.prototype.__defineGetter__("onvolumechange", curMemoryArea.onvolumechange_smart_getter);

// onwaiting
curMemoryArea.onwaiting_getter = function onwaiting() { debugger; }; mframe.safefunction(curMemoryArea.onwaiting_getter);
Object.defineProperty(curMemoryArea.onwaiting_getter, "name", {value: "get onwaiting",configurable: true,});
// onwaiting
curMemoryArea.onwaiting_setter = function onwaiting(val) { debugger; }; mframe.safefunction(curMemoryArea.onwaiting_setter);
Object.defineProperty(curMemoryArea.onwaiting_setter, "name", {value: "set onwaiting",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwaiting", {get: curMemoryArea.onwaiting_getter,set: curMemoryArea.onwaiting_setter,enumerable: true,configurable: true,});
curMemoryArea.onwaiting_smart_getter = function onwaiting() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onwaiting的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onwaiting_smart_getter);
HTMLElement.prototype.__defineGetter__("onwaiting", curMemoryArea.onwaiting_smart_getter);

// onwebkitanimationend
curMemoryArea.onwebkitanimationend_getter = function onwebkitanimationend() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_getter, "name", {value: "get onwebkitanimationend",configurable: true,});
// onwebkitanimationend
curMemoryArea.onwebkitanimationend_setter = function onwebkitanimationend(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_setter, "name", {value: "set onwebkitanimationend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationend", {get: curMemoryArea.onwebkitanimationend_getter,set: curMemoryArea.onwebkitanimationend_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationend_smart_getter = function onwebkitanimationend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onwebkitanimationend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onwebkitanimationend_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationend", curMemoryArea.onwebkitanimationend_smart_getter);

// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_getter = function onwebkitanimationiteration() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_getter, "name", {value: "get onwebkitanimationiteration",configurable: true,});
// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_setter = function onwebkitanimationiteration(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_setter, "name", {value: "set onwebkitanimationiteration",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationiteration", {get: curMemoryArea.onwebkitanimationiteration_getter,set: curMemoryArea.onwebkitanimationiteration_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationiteration_smart_getter = function onwebkitanimationiteration() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onwebkitanimationiteration的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onwebkitanimationiteration_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationiteration", curMemoryArea.onwebkitanimationiteration_smart_getter);

// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_getter = function onwebkitanimationstart() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_getter, "name", {value: "get onwebkitanimationstart",configurable: true,});
// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_setter = function onwebkitanimationstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_setter, "name", {value: "set onwebkitanimationstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationstart", {get: curMemoryArea.onwebkitanimationstart_getter,set: curMemoryArea.onwebkitanimationstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationstart_smart_getter = function onwebkitanimationstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onwebkitanimationstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onwebkitanimationstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationstart", curMemoryArea.onwebkitanimationstart_smart_getter);

// onwebkittransitionend
curMemoryArea.onwebkittransitionend_getter = function onwebkittransitionend() { debugger; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_getter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_getter, "name", {value: "get onwebkittransitionend",configurable: true,});
// onwebkittransitionend
curMemoryArea.onwebkittransitionend_setter = function onwebkittransitionend(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_setter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_setter, "name", {value: "set onwebkittransitionend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkittransitionend", {get: curMemoryArea.onwebkittransitionend_getter,set: curMemoryArea.onwebkittransitionend_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkittransitionend_smart_getter = function onwebkittransitionend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onwebkittransitionend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onwebkittransitionend_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkittransitionend", curMemoryArea.onwebkittransitionend_smart_getter);

// onwheel
curMemoryArea.onwheel_getter = function onwheel() { debugger; }; mframe.safefunction(curMemoryArea.onwheel_getter);
Object.defineProperty(curMemoryArea.onwheel_getter, "name", {value: "get onwheel",configurable: true,});
// onwheel
curMemoryArea.onwheel_setter = function onwheel(val) { debugger; }; mframe.safefunction(curMemoryArea.onwheel_setter);
Object.defineProperty(curMemoryArea.onwheel_setter, "name", {value: "set onwheel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwheel", {get: curMemoryArea.onwheel_getter,set: curMemoryArea.onwheel_setter,enumerable: true,configurable: true,});
curMemoryArea.onwheel_smart_getter = function onwheel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onwheel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onwheel_smart_getter);
HTMLElement.prototype.__defineGetter__("onwheel", curMemoryArea.onwheel_smart_getter);

// onauxclick
curMemoryArea.onauxclick_getter = function onauxclick() { debugger; }; mframe.safefunction(curMemoryArea.onauxclick_getter);
Object.defineProperty(curMemoryArea.onauxclick_getter, "name", {value: "get onauxclick",configurable: true,});
// onauxclick
curMemoryArea.onauxclick_setter = function onauxclick(val) { debugger; }; mframe.safefunction(curMemoryArea.onauxclick_setter);
Object.defineProperty(curMemoryArea.onauxclick_setter, "name", {value: "set onauxclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onauxclick", {get: curMemoryArea.onauxclick_getter,set: curMemoryArea.onauxclick_setter,enumerable: true,configurable: true,});
curMemoryArea.onauxclick_smart_getter = function onauxclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onauxclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onauxclick_smart_getter);
HTMLElement.prototype.__defineGetter__("onauxclick", curMemoryArea.onauxclick_smart_getter);

// ongotpointercapture
curMemoryArea.ongotpointercapture_getter = function ongotpointercapture() { debugger; }; mframe.safefunction(curMemoryArea.ongotpointercapture_getter);
Object.defineProperty(curMemoryArea.ongotpointercapture_getter, "name", {value: "get ongotpointercapture",configurable: true,});
// ongotpointercapture
curMemoryArea.ongotpointercapture_setter = function ongotpointercapture(val) { debugger; }; mframe.safefunction(curMemoryArea.ongotpointercapture_setter);
Object.defineProperty(curMemoryArea.ongotpointercapture_setter, "name", {value: "set ongotpointercapture",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ongotpointercapture", {get: curMemoryArea.ongotpointercapture_getter,set: curMemoryArea.ongotpointercapture_setter,enumerable: true,configurable: true,});
curMemoryArea.ongotpointercapture_smart_getter = function ongotpointercapture() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ongotpointercapture的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ongotpointercapture_smart_getter);
HTMLElement.prototype.__defineGetter__("ongotpointercapture", curMemoryArea.ongotpointercapture_smart_getter);

// onlostpointercapture
curMemoryArea.onlostpointercapture_getter = function onlostpointercapture() { debugger; }; mframe.safefunction(curMemoryArea.onlostpointercapture_getter);
Object.defineProperty(curMemoryArea.onlostpointercapture_getter, "name", {value: "get onlostpointercapture",configurable: true,});
// onlostpointercapture
curMemoryArea.onlostpointercapture_setter = function onlostpointercapture(val) { debugger; }; mframe.safefunction(curMemoryArea.onlostpointercapture_setter);
Object.defineProperty(curMemoryArea.onlostpointercapture_setter, "name", {value: "set onlostpointercapture",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onlostpointercapture", {get: curMemoryArea.onlostpointercapture_getter,set: curMemoryArea.onlostpointercapture_setter,enumerable: true,configurable: true,});
curMemoryArea.onlostpointercapture_smart_getter = function onlostpointercapture() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onlostpointercapture的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onlostpointercapture_smart_getter);
HTMLElement.prototype.__defineGetter__("onlostpointercapture", curMemoryArea.onlostpointercapture_smart_getter);

// onpointerdown
curMemoryArea.onpointerdown_getter = function onpointerdown() { debugger; }; mframe.safefunction(curMemoryArea.onpointerdown_getter);
Object.defineProperty(curMemoryArea.onpointerdown_getter, "name", {value: "get onpointerdown",configurable: true,});
// onpointerdown
curMemoryArea.onpointerdown_setter = function onpointerdown(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerdown_setter);
Object.defineProperty(curMemoryArea.onpointerdown_setter, "name", {value: "set onpointerdown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerdown", {get: curMemoryArea.onpointerdown_getter,set: curMemoryArea.onpointerdown_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerdown_smart_getter = function onpointerdown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointerdown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointerdown_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerdown", curMemoryArea.onpointerdown_smart_getter);

// onpointermove
curMemoryArea.onpointermove_getter = function onpointermove() { debugger; }; mframe.safefunction(curMemoryArea.onpointermove_getter);
Object.defineProperty(curMemoryArea.onpointermove_getter, "name", {value: "get onpointermove",configurable: true,});
// onpointermove
curMemoryArea.onpointermove_setter = function onpointermove(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointermove_setter);
Object.defineProperty(curMemoryArea.onpointermove_setter, "name", {value: "set onpointermove",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointermove", {get: curMemoryArea.onpointermove_getter,set: curMemoryArea.onpointermove_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointermove_smart_getter = function onpointermove() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointermove的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointermove_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointermove", curMemoryArea.onpointermove_smart_getter);

// onpointerrawupdate
curMemoryArea.onpointerrawupdate_getter = function onpointerrawupdate() { debugger; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_getter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_getter, "name", {value: "get onpointerrawupdate",configurable: true,});
// onpointerrawupdate
curMemoryArea.onpointerrawupdate_setter = function onpointerrawupdate(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_setter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_setter, "name", {value: "set onpointerrawupdate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerrawupdate", {get: curMemoryArea.onpointerrawupdate_getter,set: curMemoryArea.onpointerrawupdate_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerrawupdate_smart_getter = function onpointerrawupdate() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointerrawupdate的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointerrawupdate_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerrawupdate", curMemoryArea.onpointerrawupdate_smart_getter);

// onpointerup
curMemoryArea.onpointerup_getter = function onpointerup() { debugger; }; mframe.safefunction(curMemoryArea.onpointerup_getter);
Object.defineProperty(curMemoryArea.onpointerup_getter, "name", {value: "get onpointerup",configurable: true,});
// onpointerup
curMemoryArea.onpointerup_setter = function onpointerup(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerup_setter);
Object.defineProperty(curMemoryArea.onpointerup_setter, "name", {value: "set onpointerup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerup", {get: curMemoryArea.onpointerup_getter,set: curMemoryArea.onpointerup_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerup_smart_getter = function onpointerup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointerup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointerup_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerup", curMemoryArea.onpointerup_smart_getter);

// onpointercancel
curMemoryArea.onpointercancel_getter = function onpointercancel() { debugger; }; mframe.safefunction(curMemoryArea.onpointercancel_getter);
Object.defineProperty(curMemoryArea.onpointercancel_getter, "name", {value: "get onpointercancel",configurable: true,});
// onpointercancel
curMemoryArea.onpointercancel_setter = function onpointercancel(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointercancel_setter);
Object.defineProperty(curMemoryArea.onpointercancel_setter, "name", {value: "set onpointercancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointercancel", {get: curMemoryArea.onpointercancel_getter,set: curMemoryArea.onpointercancel_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointercancel_smart_getter = function onpointercancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointercancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointercancel_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointercancel", curMemoryArea.onpointercancel_smart_getter);

// onpointerover
curMemoryArea.onpointerover_getter = function onpointerover() { debugger; }; mframe.safefunction(curMemoryArea.onpointerover_getter);
Object.defineProperty(curMemoryArea.onpointerover_getter, "name", {value: "get onpointerover",configurable: true,});
// onpointerover
curMemoryArea.onpointerover_setter = function onpointerover(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerover_setter);
Object.defineProperty(curMemoryArea.onpointerover_setter, "name", {value: "set onpointerover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerover", {get: curMemoryArea.onpointerover_getter,set: curMemoryArea.onpointerover_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerover_smart_getter = function onpointerover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointerover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointerover_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerover", curMemoryArea.onpointerover_smart_getter);

// onpointerout
curMemoryArea.onpointerout_getter = function onpointerout() { debugger; }; mframe.safefunction(curMemoryArea.onpointerout_getter);
Object.defineProperty(curMemoryArea.onpointerout_getter, "name", {value: "get onpointerout",configurable: true,});
// onpointerout
curMemoryArea.onpointerout_setter = function onpointerout(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerout_setter);
Object.defineProperty(curMemoryArea.onpointerout_setter, "name", {value: "set onpointerout",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerout", {get: curMemoryArea.onpointerout_getter,set: curMemoryArea.onpointerout_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerout_smart_getter = function onpointerout() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointerout的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointerout_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerout", curMemoryArea.onpointerout_smart_getter);

// onpointerenter
curMemoryArea.onpointerenter_getter = function onpointerenter() { debugger; }; mframe.safefunction(curMemoryArea.onpointerenter_getter);
Object.defineProperty(curMemoryArea.onpointerenter_getter, "name", {value: "get onpointerenter",configurable: true,});
// onpointerenter
curMemoryArea.onpointerenter_setter = function onpointerenter(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerenter_setter);
Object.defineProperty(curMemoryArea.onpointerenter_setter, "name", {value: "set onpointerenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerenter", {get: curMemoryArea.onpointerenter_getter,set: curMemoryArea.onpointerenter_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerenter_smart_getter = function onpointerenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointerenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointerenter_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerenter", curMemoryArea.onpointerenter_smart_getter);

// onpointerleave
curMemoryArea.onpointerleave_getter = function onpointerleave() { debugger; }; mframe.safefunction(curMemoryArea.onpointerleave_getter);
Object.defineProperty(curMemoryArea.onpointerleave_getter, "name", {value: "get onpointerleave",configurable: true,});
// onpointerleave
curMemoryArea.onpointerleave_setter = function onpointerleave(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerleave_setter);
Object.defineProperty(curMemoryArea.onpointerleave_setter, "name", {value: "set onpointerleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerleave", {get: curMemoryArea.onpointerleave_getter,set: curMemoryArea.onpointerleave_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerleave_smart_getter = function onpointerleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpointerleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpointerleave_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerleave", curMemoryArea.onpointerleave_smart_getter);

// onselectstart
curMemoryArea.onselectstart_getter = function onselectstart() { debugger; }; mframe.safefunction(curMemoryArea.onselectstart_getter);
Object.defineProperty(curMemoryArea.onselectstart_getter, "name", {value: "get onselectstart",configurable: true,});
// onselectstart
curMemoryArea.onselectstart_setter = function onselectstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onselectstart_setter);
Object.defineProperty(curMemoryArea.onselectstart_setter, "name", {value: "set onselectstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselectstart", {get: curMemoryArea.onselectstart_getter,set: curMemoryArea.onselectstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onselectstart_smart_getter = function onselectstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onselectstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onselectstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onselectstart", curMemoryArea.onselectstart_smart_getter);

// onselectionchange
curMemoryArea.onselectionchange_getter = function onselectionchange() { debugger; }; mframe.safefunction(curMemoryArea.onselectionchange_getter);
Object.defineProperty(curMemoryArea.onselectionchange_getter, "name", {value: "get onselectionchange",configurable: true,});
// onselectionchange
curMemoryArea.onselectionchange_setter = function onselectionchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onselectionchange_setter);
Object.defineProperty(curMemoryArea.onselectionchange_setter, "name", {value: "set onselectionchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselectionchange", {get: curMemoryArea.onselectionchange_getter,set: curMemoryArea.onselectionchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onselectionchange_smart_getter = function onselectionchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onselectionchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onselectionchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onselectionchange", curMemoryArea.onselectionchange_smart_getter);

// onanimationend
curMemoryArea.onanimationend_getter = function onanimationend() { debugger; }; mframe.safefunction(curMemoryArea.onanimationend_getter);
Object.defineProperty(curMemoryArea.onanimationend_getter, "name", {value: "get onanimationend",configurable: true,});
// onanimationend
curMemoryArea.onanimationend_setter = function onanimationend(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationend_setter);
Object.defineProperty(curMemoryArea.onanimationend_setter, "name", {value: "set onanimationend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationend", {get: curMemoryArea.onanimationend_getter,set: curMemoryArea.onanimationend_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationend_smart_getter = function onanimationend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onanimationend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onanimationend_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationend", curMemoryArea.onanimationend_smart_getter);

// onanimationiteration
curMemoryArea.onanimationiteration_getter = function onanimationiteration() { debugger; }; mframe.safefunction(curMemoryArea.onanimationiteration_getter);
Object.defineProperty(curMemoryArea.onanimationiteration_getter, "name", {value: "get onanimationiteration",configurable: true,});
// onanimationiteration
curMemoryArea.onanimationiteration_setter = function onanimationiteration(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationiteration_setter);
Object.defineProperty(curMemoryArea.onanimationiteration_setter, "name", {value: "set onanimationiteration",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationiteration", {get: curMemoryArea.onanimationiteration_getter,set: curMemoryArea.onanimationiteration_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationiteration_smart_getter = function onanimationiteration() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onanimationiteration的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onanimationiteration_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationiteration", curMemoryArea.onanimationiteration_smart_getter);

// onanimationstart
curMemoryArea.onanimationstart_getter = function onanimationstart() { debugger; }; mframe.safefunction(curMemoryArea.onanimationstart_getter);
Object.defineProperty(curMemoryArea.onanimationstart_getter, "name", {value: "get onanimationstart",configurable: true,});
// onanimationstart
curMemoryArea.onanimationstart_setter = function onanimationstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationstart_setter);
Object.defineProperty(curMemoryArea.onanimationstart_setter, "name", {value: "set onanimationstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationstart", {get: curMemoryArea.onanimationstart_getter,set: curMemoryArea.onanimationstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationstart_smart_getter = function onanimationstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onanimationstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onanimationstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationstart", curMemoryArea.onanimationstart_smart_getter);

// ontransitionrun
curMemoryArea.ontransitionrun_getter = function ontransitionrun() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionrun_getter);
Object.defineProperty(curMemoryArea.ontransitionrun_getter, "name", {value: "get ontransitionrun",configurable: true,});
// ontransitionrun
curMemoryArea.ontransitionrun_setter = function ontransitionrun(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionrun_setter);
Object.defineProperty(curMemoryArea.ontransitionrun_setter, "name", {value: "set ontransitionrun",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionrun", {get: curMemoryArea.ontransitionrun_getter,set: curMemoryArea.ontransitionrun_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionrun_smart_getter = function ontransitionrun() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ontransitionrun的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ontransitionrun_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionrun", curMemoryArea.ontransitionrun_smart_getter);

// ontransitionstart
curMemoryArea.ontransitionstart_getter = function ontransitionstart() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionstart_getter);
Object.defineProperty(curMemoryArea.ontransitionstart_getter, "name", {value: "get ontransitionstart",configurable: true,});
// ontransitionstart
curMemoryArea.ontransitionstart_setter = function ontransitionstart(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionstart_setter);
Object.defineProperty(curMemoryArea.ontransitionstart_setter, "name", {value: "set ontransitionstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionstart", {get: curMemoryArea.ontransitionstart_getter,set: curMemoryArea.ontransitionstart_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionstart_smart_getter = function ontransitionstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ontransitionstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ontransitionstart_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionstart", curMemoryArea.ontransitionstart_smart_getter);

// ontransitionend
curMemoryArea.ontransitionend_getter = function ontransitionend() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionend_getter);
Object.defineProperty(curMemoryArea.ontransitionend_getter, "name", {value: "get ontransitionend",configurable: true,});
// ontransitionend
curMemoryArea.ontransitionend_setter = function ontransitionend(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionend_setter);
Object.defineProperty(curMemoryArea.ontransitionend_setter, "name", {value: "set ontransitionend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionend", {get: curMemoryArea.ontransitionend_getter,set: curMemoryArea.ontransitionend_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionend_smart_getter = function ontransitionend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ontransitionend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ontransitionend_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionend", curMemoryArea.ontransitionend_smart_getter);

// ontransitioncancel
curMemoryArea.ontransitioncancel_getter = function ontransitioncancel() { debugger; }; mframe.safefunction(curMemoryArea.ontransitioncancel_getter);
Object.defineProperty(curMemoryArea.ontransitioncancel_getter, "name", {value: "get ontransitioncancel",configurable: true,});
// ontransitioncancel
curMemoryArea.ontransitioncancel_setter = function ontransitioncancel(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitioncancel_setter);
Object.defineProperty(curMemoryArea.ontransitioncancel_setter, "name", {value: "set ontransitioncancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitioncancel", {get: curMemoryArea.ontransitioncancel_getter,set: curMemoryArea.ontransitioncancel_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitioncancel_smart_getter = function ontransitioncancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的ontransitioncancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ontransitioncancel_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitioncancel", curMemoryArea.ontransitioncancel_smart_getter);

// oncopy
curMemoryArea.oncopy_getter = function oncopy() { debugger; }; mframe.safefunction(curMemoryArea.oncopy_getter);
Object.defineProperty(curMemoryArea.oncopy_getter, "name", {value: "get oncopy",configurable: true,});
// oncopy
curMemoryArea.oncopy_setter = function oncopy(val) { debugger; }; mframe.safefunction(curMemoryArea.oncopy_setter);
Object.defineProperty(curMemoryArea.oncopy_setter, "name", {value: "set oncopy",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncopy", {get: curMemoryArea.oncopy_getter,set: curMemoryArea.oncopy_setter,enumerable: true,configurable: true,});
curMemoryArea.oncopy_smart_getter = function oncopy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncopy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncopy_smart_getter);
HTMLElement.prototype.__defineGetter__("oncopy", curMemoryArea.oncopy_smart_getter);

// oncut
curMemoryArea.oncut_getter = function oncut() { debugger; }; mframe.safefunction(curMemoryArea.oncut_getter);
Object.defineProperty(curMemoryArea.oncut_getter, "name", {value: "get oncut",configurable: true,});
// oncut
curMemoryArea.oncut_setter = function oncut(val) { debugger; }; mframe.safefunction(curMemoryArea.oncut_setter);
Object.defineProperty(curMemoryArea.oncut_setter, "name", {value: "set oncut",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncut", {get: curMemoryArea.oncut_getter,set: curMemoryArea.oncut_setter,enumerable: true,configurable: true,});
curMemoryArea.oncut_smart_getter = function oncut() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的oncut的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.oncut_smart_getter);
HTMLElement.prototype.__defineGetter__("oncut", curMemoryArea.oncut_smart_getter);

// onpaste
curMemoryArea.onpaste_getter = function onpaste() { debugger; }; mframe.safefunction(curMemoryArea.onpaste_getter);
Object.defineProperty(curMemoryArea.onpaste_getter, "name", {value: "get onpaste",configurable: true,});
// onpaste
curMemoryArea.onpaste_setter = function onpaste(val) { debugger; }; mframe.safefunction(curMemoryArea.onpaste_setter);
Object.defineProperty(curMemoryArea.onpaste_setter, "name", {value: "set onpaste",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpaste", {get: curMemoryArea.onpaste_getter,set: curMemoryArea.onpaste_setter,enumerable: true,configurable: true,});
curMemoryArea.onpaste_smart_getter = function onpaste() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onpaste的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpaste_smart_getter);
HTMLElement.prototype.__defineGetter__("onpaste", curMemoryArea.onpaste_smart_getter);

// dataset
curMemoryArea.dataset_getter = function dataset() { debugger; }; mframe.safefunction(curMemoryArea.dataset_getter);
Object.defineProperty(curMemoryArea.dataset_getter, "name", {value: "get dataset",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "dataset", {get: curMemoryArea.dataset_getter,enumerable: true,configurable: true,});
curMemoryArea.dataset_smart_getter = function dataset() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的dataset的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.dataset_smart_getter);
HTMLElement.prototype.__defineGetter__("dataset", curMemoryArea.dataset_smart_getter);

// nonce
curMemoryArea.nonce_getter = function nonce() { debugger; }; mframe.safefunction(curMemoryArea.nonce_getter);
Object.defineProperty(curMemoryArea.nonce_getter, "name", {value: "get nonce",configurable: true,});
// nonce
curMemoryArea.nonce_setter = function nonce(val) { debugger; }; mframe.safefunction(curMemoryArea.nonce_setter);
Object.defineProperty(curMemoryArea.nonce_setter, "name", {value: "set nonce",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "nonce", {get: curMemoryArea.nonce_getter,set: curMemoryArea.nonce_setter,enumerable: true,configurable: true,});
curMemoryArea.nonce_smart_getter = function nonce() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的nonce的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.nonce_smart_getter);
HTMLElement.prototype.__defineGetter__("nonce", curMemoryArea.nonce_smart_getter);

// autofocus
curMemoryArea.autofocus_getter = function autofocus() { debugger; }; mframe.safefunction(curMemoryArea.autofocus_getter);
Object.defineProperty(curMemoryArea.autofocus_getter, "name", {value: "get autofocus",configurable: true,});
// autofocus
curMemoryArea.autofocus_setter = function autofocus(val) { debugger; }; mframe.safefunction(curMemoryArea.autofocus_setter);
Object.defineProperty(curMemoryArea.autofocus_setter, "name", {value: "set autofocus",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "autofocus", {get: curMemoryArea.autofocus_getter,set: curMemoryArea.autofocus_setter,enumerable: true,configurable: true,});
curMemoryArea.autofocus_smart_getter = function autofocus() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的autofocus的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.autofocus_smart_getter);
HTMLElement.prototype.__defineGetter__("autofocus", curMemoryArea.autofocus_smart_getter);

// tabIndex
curMemoryArea.tabIndex_getter = function tabIndex() { debugger; }; mframe.safefunction(curMemoryArea.tabIndex_getter);
Object.defineProperty(curMemoryArea.tabIndex_getter, "name", {value: "get tabIndex",configurable: true,});
// tabIndex
curMemoryArea.tabIndex_setter = function tabIndex(val) { debugger; }; mframe.safefunction(curMemoryArea.tabIndex_setter);
Object.defineProperty(curMemoryArea.tabIndex_setter, "name", {value: "set tabIndex",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "tabIndex", {get: curMemoryArea.tabIndex_getter,set: curMemoryArea.tabIndex_setter,enumerable: true,configurable: true,});
curMemoryArea.tabIndex_smart_getter = function tabIndex() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的tabIndex的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.tabIndex_smart_getter);
HTMLElement.prototype.__defineGetter__("tabIndex", curMemoryArea.tabIndex_smart_getter);

// style
curMemoryArea.style_getter = function style() { debugger; }; mframe.safefunction(curMemoryArea.style_getter);
Object.defineProperty(curMemoryArea.style_getter, "name", {value: "get style",configurable: true,});
// style
curMemoryArea.style_setter = function style(val) { debugger; }; mframe.safefunction(curMemoryArea.style_setter);
Object.defineProperty(curMemoryArea.style_setter, "name", {value: "set style",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "style", {get: curMemoryArea.style_getter,set: curMemoryArea.style_setter,enumerable: true,configurable: true,});
curMemoryArea.style_smart_getter = function style() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的style的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.style_smart_getter);
HTMLElement.prototype.__defineGetter__("style", curMemoryArea.style_smart_getter);

// attributeStyleMap
curMemoryArea.attributeStyleMap_getter = function attributeStyleMap() { debugger; }; mframe.safefunction(curMemoryArea.attributeStyleMap_getter);
Object.defineProperty(curMemoryArea.attributeStyleMap_getter, "name", {value: "get attributeStyleMap",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "attributeStyleMap", {get: curMemoryArea.attributeStyleMap_getter,enumerable: true,configurable: true,});
curMemoryArea.attributeStyleMap_smart_getter = function attributeStyleMap() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的attributeStyleMap的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.attributeStyleMap_smart_getter);
HTMLElement.prototype.__defineGetter__("attributeStyleMap", curMemoryArea.attributeStyleMap_smart_getter);

// onscrollend
curMemoryArea.onscrollend_getter = function onscrollend() { debugger; }; mframe.safefunction(curMemoryArea.onscrollend_getter);
Object.defineProperty(curMemoryArea.onscrollend_getter, "name", {value: "get onscrollend",configurable: true,});
// onscrollend
curMemoryArea.onscrollend_setter = function onscrollend(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollend_setter);
Object.defineProperty(curMemoryArea.onscrollend_setter, "name", {value: "set onscrollend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollend", {get: curMemoryArea.onscrollend_getter,set: curMemoryArea.onscrollend_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollend_smart_getter = function onscrollend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onscrollend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onscrollend_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollend", curMemoryArea.onscrollend_smart_getter);

// onscrollsnapchange
curMemoryArea.onscrollsnapchange_getter = function onscrollsnapchange() { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_getter, "name", {value: "get onscrollsnapchange",configurable: true,});
// onscrollsnapchange
curMemoryArea.onscrollsnapchange_setter = function onscrollsnapchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_setter, "name", {value: "set onscrollsnapchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollsnapchange", {get: curMemoryArea.onscrollsnapchange_getter,set: curMemoryArea.onscrollsnapchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollsnapchange_smart_getter = function onscrollsnapchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onscrollsnapchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onscrollsnapchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollsnapchange", curMemoryArea.onscrollsnapchange_smart_getter);

// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_getter = function onscrollsnapchanging() { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_getter, "name", {value: "get onscrollsnapchanging",configurable: true,});
// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_setter = function onscrollsnapchanging(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_setter, "name", {value: "set onscrollsnapchanging",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollsnapchanging", {get: curMemoryArea.onscrollsnapchanging_getter,set: curMemoryArea.onscrollsnapchanging_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollsnapchanging_smart_getter = function onscrollsnapchanging() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLElement"中的onscrollsnapchanging的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onscrollsnapchanging_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollsnapchanging", curMemoryArea.onscrollsnapchanging_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

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
var HTMLDivElement = function () {
    debugger;
    throw new TypeError('HTMLDivElement 不允许被new')
}; mframe.safefunction(HTMLDivElement);

Object.defineProperties(HTMLDivElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDivElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////

HTMLDivElement.prototype.__proto__ = HTMLElement.prototype;

// 如果调用 mframe.memory.htmlelements['div'], 就返回 HTMLDivElement
mframe.memory.htmlelements['div'] = function () {
    var div = new (function () { }); // new一个假的,通过换原型,换为HTMLDivElement去实现
    div.__proto__ = HTMLDivElement.prototype;

    //////////{HTMLDivElement特有的 属性/方法}//////////////
    div.align = "";
    /////////////////////////////////////////////////////
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
    throw new TypeError('HTMLCanvasElement 不允许被new')
}; mframe.safefunction(HTMLCanvasElement);

Object.defineProperties(HTMLCanvasElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLCanvasElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

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
    debugger;
    throw new TypeError('HTMLHeadElement 不允许被new')
}; mframe.safefunction(HTMLHeadElement);

Object.defineProperties(HTMLHeadElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHeadElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
HTMLHeadElement.prototype.childElementCount = 169; // TODO暂时这样写
///////////////////////////////////////////////////
HTMLHeadElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['head'] = function () {
    var head = new (function () { });
    head.__proto__ = HTMLHeadElement.prototype;

    //////////{HTMLHeadElement 特有的 属性/方法}//////////////
    head.profile = ""; // 表示一个或多个元数据配置文件的 URI 的字符串（以空格分隔）
    /////////////////////////////////////////////////////
    return head;
}
var HTMLBodyElement = function () {
    debugger;
    throw new TypeError('HTMLBodyElement 不允许被new')
}; mframe.safefunction(HTMLBodyElement);

Object.defineProperties(HTMLBodyElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLBodyElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
HTMLBodyElement.prototype.childElementCount = 12; // TODO暂时这样写
///////////////////////////////////////////////////
HTMLBodyElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['head'] = function () {
    var head = new (function () { });
    head.__proto__ = HTMLBodyElement.prototype;

    //////////{HTMLBodyElement 特有的 属性/方法}//////////////
    // TODO 有点多,懒得补
    /////////////////////////////////////////////////////
    return head;
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

var Document = function () { }; mframe.safefunction(Document);

Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true,
    }
});

document = {}
///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Document = {};

//============== Constant START ==================
Object.defineProperty(Document, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Document, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
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
    let defaultValue = mframe.proxy({});
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
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的referrer的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.referrer_smart_getter);
Document.prototype.__defineGetter__("referrer", curMemoryArea.referrer_smart_getter);

// cookie
curMemoryArea.cookie_getter = function cookie() { debugger; }; mframe.safefunction(curMemoryArea.cookie_getter);
Object.defineProperty(curMemoryArea.cookie_getter, "name", { value: "get cookie", configurable: true, });
// cookie
curMemoryArea.cookie_setter = function cookie(val) { debugger; }; mframe.safefunction(curMemoryArea.cookie_setter);
Object.defineProperty(curMemoryArea.cookie_setter, "name", { value: "set cookie", configurable: true, });
Object.defineProperty(Document.prototype, "cookie", { get: curMemoryArea.cookie_getter, set: curMemoryArea.cookie_setter, enumerable: true, configurable: true, });
curMemoryArea.cookie_smart_getter = function cookie() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的cookie的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
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
    let defaultValue = undefined;
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
    let defaultValue = "";
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

// 创建一个函数来包装JSDOM元素
function wrapJsdomElement(jsdomElement, customElement) {
    // 存储原始JSDOM元素
    customElement._jsdom_element = jsdomElement;
    return customElement;
}

// 重写createElement方法
Document.prototype["createElement"] = function createElement(tagName, options) {
    console.log("createElement=>", tagName);
    var tagName = tagName.toLowerCase() + ""; // +""是因为null需要解析为"null"
    
    // 使用JSDOM创建真实DOM元素
    // var jsdomElement = _jsdom_document.createElement(tagName, options); // TODO without jsdom
    
    // 创建我们的自定义元素
    var htmlElement;
    if (mframe.memory.htmlelements[tagName] == undefined) {
        console.error("createElement缺少==>", tagName);
        debugger; // 没有, 说明这个HTMLXXXElement还没有补!
        // 创建一个基础元素
        htmlElement = {};
        htmlElement.__proto__ = HTMLElement.prototype;  
    } else {
        // 如果有直接创建
        htmlElement = mframe.memory.htmlelements[tagName]();
    }
    
    // 关联JSDOM元素
    // wrapJsdomElement(jsdomElement, element);                              // TODO without jsdom
    
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
Document.prototype["getElementById"] = function getElementById(id) {
    console.log("getElementById=>", id);
    // 使用JSDOM的document.getElementById
    var jsdomElement = _jsdom_document.getElementById(id);
    if (jsdomElement) {
        // 创建一个基础元素并包装JSDOM元素
        var element = {};
        element.__proto__ = Element.prototype;
        return mframe.proxy(wrapJsdomElement(jsdomElement, element));
    }
    return null;
}; mframe.safefunction(Document.prototype["getElementById"]);

Document.prototype["getElementsByClassName"] = function getElementsByClassName() { debugger; }; mframe.safefunction(Document.prototype["getElementsByClassName"]);
Document.prototype["getElementsByName"] = function getElementsByName() { debugger; }; mframe.safefunction(Document.prototype["getElementsByName"]);
Document.prototype["getElementsByTagName"] = function getElementsByTagName() { debugger; }; mframe.safefunction(Document.prototype["getElementsByTagName"]);
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
Document.prototype["querySelector"] = function querySelector(selector) {
    console.log("querySelector=>", selector);
    var jsdomElement = _jsdom_document.querySelector(selector);
    if (jsdomElement) {
        var element = {};
        element.__proto__ = Element.prototype;
        return mframe.proxy(wrapJsdomElement(jsdomElement, element));
    }
    return null;
}; mframe.safefunction(Document.prototype["querySelector"]);

Document.prototype["querySelectorAll"] = function querySelectorAll(selector) {
    console.log("querySelectorAll=>", selector);
    var jsdomElements = _jsdom_document.querySelectorAll(selector);
    var result = [];
    for (var i = 0; i < jsdomElements.length; i++) {
        var element = {};
        element.__proto__ = Element.prototype;
        result.push(mframe.proxy(wrapJsdomElement(jsdomElements[i], element)));
    }
    return mframe.proxy(result);
}; mframe.safefunction(Document.prototype["querySelectorAll"]);

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

document.__proto__ = Document.prototype;
document = mframe.proxy(document) // 代理
debugger;

///////////////////////////////////////////////////////////////////
///////////////////自定义环境 自定义环境 自定义环境///////////////////
///////////////////////////////////////////////////////////////////
// document = mframe.proxy(document);
// window.Buffer = undefined;





///////////////////////////////////////////////////////////////////
///////////////////主代码区域 主代码区域 主代码区域///////////////////
///////////////////////////////////////////////////////////////////
function t(){var ur=['YXHOAb','0/ZkuIp','HwSklfI','0LBnqLv','0f+BAogZA=88la','qjTczZN','lOxUqjGnr4HMab','lXBVjXt','NXTkq4TeDC+fqa','0XBZuv','AXBBRX2bqjTn0x','YjSZu=a','Nm05AL2M+Ot','jtZgl4I','ufgBqLZdrQVMTa','QX8hjzz','ldK8QfV','0XZ8YH27','Ao+h0X2dr4gZ','adYUYzq','7CTfqjY7uwT7qv','0=+9qZV','Y6d9uw2Uq4gdqb','J4Tnrwzc','iUtKiQtK7CTfqa','Aov3qL2kufNcNb','Aw2SuwacNLYwTv','At/ICXN','AwH5YjTd','Aw0nu9Sdufxc','CSYwq4a','QZHY0jI','0XvcT6Bbrm/nua','N9gUuX/eAed90b','Q/gfYjt','0d08A4A','q4TFrL+BqL8=Av','AtBhuL8ZYx','Yd2JAfa','0o1huQVGT=gyib','qw03qw/UlL0Oub','q=nRCXV','uf1MAoV','ALHdHXZ8Ya','1z1n1/z','0fnClSI','H4ZoaHI','zXKV1fa','i9TwYwq3qw2yJa','pexbp6IfTUxbpx','YXHeqf+nAo1nub','CHBRA=V','0tTcHLa','q4gbY4+3lXHnYb','YtYLuoq','lS+zawp','zX1cYLk','0L/wJjKUJ41Oqa','4S2OYj/k4f+ZAb','4L+kuLTFNmTBux','uX/e041hAXYV0v','0ZBYQjI','ALTZuwz','rwzcpegbr68wub','ALTBuXH3qw/Ulb','4S2wrX1Ol4YZAv','rwSC1=I','Ht8brzt','pUaLpUqbpo1b1/TVlx','qL/IHXV','ljKtY4BDYv','0X/M0odU0L/w4b','qOSfAw/bAXHOrb','QZBeHtV','qzGeCtA','TQtSiQzKif1Zrx','uX2BYx','l/BIrIy','1t2Fajv','qL2MAf1O0jTdub','Ht8kqHa','rongQwp','0LZMYX2fJZ2fqa','J=0BY9SMqOSdla','A=dU0L/w4LKU4b','qS270UN','1jHB1zI','qjGZ','Yf/TAfv','JjTkq4TeNUyWJb','l4YZNjZ8AX2O0x','aznp1ja','l4TbuX/Ki9gMub','i9gOY4/SY4TdCa','qwGhqLkvJwKU4b','r/0FASN','YHYNH=a','Qz+Fzwk','AwHd04+MNx','l/nO0LW','Yd8GAza','RmvVJ9knROtFRa','QjSiQdd','rjGFazv','Yo01rwW','qjKdiLGnuwz8lx','AwH=lj2M','DQd2','4f0BYZ2nAS28ub','0X/M068UuLGhAv','qHnKq4t','pLqyzd8+1UZdHa','YSHOHXN','zd1mrjy','Af1ZuwHO','0w/ONI/64b','QITSAHa','QtT7HS+gz/g/zv','0X/M068kljKZJa','0X2biv','YLHda41dAwZ90a','uX2Uq41nuLy','0jHe0x','ajBUYjk','Afgkl4a','0XZhu9NEKJ9cKJ5XKVRVKK5I','cl5pcREgDm2tl4qEDox','q=1BHjt','HLK1ltTkTm89zv','Hw281zI','adSHHwv','jo+Cqjz','uo/qlIa','Af88q4+=ljy80x','lL8JYdW','Qf0/aZA','4f0BYZ29uL1K4b','1z0SCzz','aH0QaO2B0fTUJv','YzBZqj1ZAv','NmxvN6GbNXTkqa','ltSGr/I','uXHw0x','q=ThuoHdYQ8fla','u=a3Yw2M0mSela','AwHBYoZe0X/dYa','YwZOAf16lXZkYx','lfZ8Cfz','uwp8l6z8YXHeqb','q4+=ljy8AwZ=lx','A/nVHjV','qjGnr4HM0L/w4b','qHBTHXq','AtHe0Ib','uLKeYH1KAXz=Nx','At2ZrzA','1o/luSN','aj/iQjV','0XHy0mg3Yw2M0x','N6NLJmxOJmxepx','ztHBQtN','lj1aAwHwl4B7','0z/lz/V','QZYX1Za','YXHwljKZzo+hAx','uw+gAzv','HoBRYIp','u=H8qwHO','Qw89C4A','uw0+lta','cl5pcREgyymmDm2bDvVvNx','uw2dlXZMYe+OYa','H/Tkadp','0HTiASV','0mSBuXZ=uUnUYa','u40BqHV','0dHfztv','4f0BYZ2MqS2fla','pQxezzGgaLSd','l6VGp6xZiLBZla','iLSBAw0nu9S9ub','zHYkzSI','0jKti9TwYwqeYa','uX2BYXHMYx','u=0lazW','Y4+drz1ZALTOla','qLkvJwKUJjThuv','1I0czHI','lLSVYXA','Aj/OjjN','1wYKjHv','lzK6qHx','qQxbNjZ8AX2O0x','0odRNf0BYZ2Mqb','4S2eY41NYj/tYa','rI8Vrzv','uLZOq=v','Ao/Czzz','pObvpUzkN6IeJx','lwnnj4v','qjKdif0nYo1Viv','uw/Llj0B0X2O','rLBZlj0V06Vfpx','33OpcuMqcRctKJ98Knlo','peAbpUAKpZTIzLHYjx','+XTVAw28YH2BAb','rXBO','lfnNltb','CS1zQoV','aL2M0XHM0mSzra','1t1S0wA','0XHe0x','lX2e0XKBujz','zoTouZz','0XHy0m2UAfp','0XHy0mAvRo0BAb','uXHw06V','Dm2tl4qE','YjSn0x','ujZMJjBZlj0V0x','lZYqufV','Y9gdlXzvuL+5Ya','Afp2N=0BY9SMqb','AwHBYoZQ0X/dYa','jZTLjIk','lj2UYty','cREfcJEucRXpKllmKJ9Jcl5pcREg','Y4++Yx','JUISR4dRNf0BYv','04+k','ufgZuv','0IGnAf1ZuwHO','Af1B0oHe','4f0Oq4gbY4+3ua','YjZ=loacpQxb+a','q=/9uSz','Af1OljK=','Qj8tQLW','YX8Hz=N','uL0MzXN','uw2MYa','HSB5CLN','ljKn0I/kl4ZSuv','0tH9r4p','p6x3ufgBqLZdra','ztZTAHq','YXzv0XWv0wHOla','iLBZlj0V06Vdix','Af0mASI','j//i0=V','zj0jHdy','q4gbYjKtaLBnux','Yd2UqzA','lzY6HLI','az8muHa','TCS8q4TFrL+Bqb','uX/MYfHBYLzcNx','qw/UlL0OufHMYx','Dm2bDUGtl4qvla','pQxOpQtypfHwCz+Hzv','AwHeAX2MALHzra','uUnBq=ThuoHdYa','04TZAZHeY4++Yx','Ho/fYZq','NmxvNmxvDoxvla','Aov3qw2yJ4Tnrv','YXHOiUxBljSbub','AX+kYXq','lONvAf1KuXz2Nv','0odU0L/w4LKU4b','ALHBAwTV','YjZ=loacT6Bbrx','AUVUYwYwNjZ8Ax','Qo/iY4x','1oTprXV','qLBBuw0Z','uLY90tN','uLycYwZyYja34b','iCbvpUakN6peJx','J4Tklj1nuwA8Ab','CtG1H=a','HX/1qZN','rwzcpQ1br68Uub','YXHwq4Hk0x','ALGnqLz','AX2f','1LKjCSq','qL/b0XTVqa','Y4BdJj/klj0Miv','0X2FYjy','pUtyTwnOAw2/Qv','140tuHa','YXSDqjp','CzKMAwW','YX28a4HduLSB0x','Dm2tl4qEDm2tla','r/0KQjb','lf+Sz/x','uwYh','zogBqedLpHnG0b','jHBHQdz','qjY7uwT7qwGhqb','iQxbNjZ8AX2O0x','qjq8uwp80f+BAx','qw29rtq','QoB6YHp','Aj/Kuzy','uXZ=uUnUYjKdYa','l/gh0zt','Af1KuXz','YHBMQ4v','qdBj1XA','YS/YY=t','TwIbpm/nu4ghAv','q4+=ljy8uXHw0x','NXZtDC+fqjq8uv','AwHeAX2MALHzYa','uIntjwW','KniTKJLAKlc+KqjV33OpcREfKlcpKV9aKJMZKJ9J','ljKMY4+NHISp','ljKMY4+3AX2ela','if1hA6VOpmz3ux','rwGN1zv','u=YSQtb','YfTcqSx','1j85udp','Qj2t0jGZ','Hj8+YXb','CtT=qdq','AX2O0X/M0odRNb','CoBS0LI','Nf0BYZ2MqS29ux','0XGFYwy','AfH9Af1O','YXYmaLN','JwThuC2gHST6Jb','ljKMY4+zY4Bd','p6xOTevbp6pfTa','YXHdqjTV14YZuv','qwZMYx','YL+ilwq','qfa=AOx=AwHeAx','YtZIAzd','N6NfJmxOp9bvpv','ALHd','ALBnY=a','j/ZNH4x','CoB90=p','u9SdufxcpQ1brx','0w/ONX/OYeI2+b','qOSdAw/UYjZtNv','0XHy0m2V0XSk','4L+kuLTFNmKMqb','HoHUuoA','uz+tY4I','QoH6ljb','uwz3NUyWYXZLNx','i9ySiLYnuo1ZAv','lja2N=1OqjTZla','At+414a','HZ1czzW','jIYJCLN','zHTtQSa','iCbvpeIkN6abJx','ufgZAwI','pU1br682m9Tfqa','uXYJz/z','068wuLKdJ4Tnrv','pU1br68wuLKdJa','1wKajtz','4fgVqjKduLd','1f+51II','zSTBqda','0In1Qop','0w0TzHt','uLTFNmKfqjq8uv','0X2oQH1Q0o+nuv','Yd0fu/A','uf/IaZN','Aw/=YLV','JjGBuwA8qLKdrb','HXBZNoYBuoHZNx','qt1B0Zt','QHBo0oV','QH/Xazt','uXSkj4A','NLKhqL/b0XTVqa','uZYLa4N','ALHdzwHG0jHe0x','0jZjrHq','AXBBu=1hua','ud1GHSv','az2ZrzA','qL/kux','qL/b0XTVq488qa','YLHd','lL0OufHMY6VUYv','JO2hJw/kljTtuv','rQdSpmt30LZt0x','uX/eAed90L/wJa','Hf+ozLt','CZnHqSI','aLZRHox','Y9SMqOSdAw/UYa','0X2tQtk','lj1gjjI','qf+nAo1nuLy','qOSnYov2NUI9Dv','Jj+hrodU0L/w4b','zwHG0jHe0x','lXHBYXHOAb','qwGhqLkvJw/kla','zXGZq4TZNoTkla','ljKZJjBZlj0V0x','QXKn0dd','Y=HMqf1nuLy','1wSF1Sz','jHT90dd','HH09l4v','NwHMN9bvJOPVFcfV5Nx','1zGzAjd','ltBz0tW','ltT9aLz','0t8zYXd','0H2B0X2FYjy','ut0DCIy','1I0np/ZgTd+Zua','HoHtQX8TT4YNra','uXHw0odRNf0BYv','YQVGTogyNjZ8Ax','uX2BY6IbqwI','Ho+BqLH+16V','jISpCo1dA/+ZAa','0w/ONX/OYeI','0z+lqjp','HjSoAta','Aw0nu9SkYjYdiv','QH0UH=I','04TZ','iQtKif1Zroa8qa','YwqLqQxbNjZ8Ax','Ad+KQw/8Ya','qf+ZYXHM0XZBux','A/HJzZI','a=Z9QzN','Conmj/p','Af0qjId','0zTUYLA','YZ2MqS29uX2Ulb','0H2BAwHw','H=gFaZz','Qd8Hqdp','Af+U','uwacNLYwTwIbpx','1S/MHXk','rjKUzLTOl4gdCa','zHZBj4p','pQzOpeNSAdnfCfTL','zLTgAtb','0fHZ1=x','Y/TVr4N','jZ1ZHjq','HtYtaSV','Qf/C1oA','qL8=Aw2SuwacNb','uX2BYoTdq4+d','1/nlAHx','4wTtqS2uqCScaa','Hw2SlII','Yo1V','l/HhAzk','YUYBp6xBljSbub','Yw2O1j/Ulx','qwIVpUaGJ6Ndpa','zzTQjXA','CX1qYtz','r/HMQLp','4f0BYZ2dAw/UYa','qSYBafI','0=Zy1op','zwSXj/t','Ht84Awq','qL2MqL/d','HL8orZA','qLGBAfp2N=0BYv','0tGQjIv','lX/elx','lI0VjZv','z//SqLz','afH51ot','lX2e0x','utHXudd','ljy8uXHw06VOTx','Y=0Izja','qCvOT6IkpUaGJx','uj/OYLZMJ41hAx','YXZMYOSeuXZtYa','CISm1dd','loacT6Bbrm/nua','zSgdHHt','CX0/Hwz','0XZ8Yj2S0x','1jneQtt','q4gblLHKiv','A4TYAXa','0IBKzXp','qj+hA=a','uwYhJ=HeY4+HAb','0wHMYX2O','uZYH1oV','Aed90L/wJjKUJa','0LZt0Xv','ltYYzzI','u=a3uj/OYLZMJa','ud0cHIk','qjTZlja8qLGBAb','J=0BY9SMqOStYa','lO+e0oZkYQd9Yx','0w/k0jz','awYGlzd','qf+Zq41ZHXHy0x','Q/gDYXk','AoB2Nf0BYZ2Mqb','qwGhqLkvJw+duv','QX2BYXHt','HfnmCdt','CzGVQ/V','AZ0kjIV','jwnaljb','jeISJmxeTCbvpv','QXHVz4N','qjq8uwp80XZdux','0X/nuwHONmTMqb','l=TUuXA','YXZL','Ao+h0X2UuLb','lIBFuwN','qC/nu4ghA=1Buv','qfTeHXHy0x','Y4Ncpm/nu4ghAv','q=gtQoV','Qt+fQXb','if1hA6VbiL+h0x','ALYhqft','1HZ11Sv','AwH=l4TdY4N','Qw/B1XW','HHZ9uZA','l41ZAw/dufN','cRcPcYrMcl5pcREg','uX2=','JmxeTmbvpeAkNx','u9SVYjZ=loac','qLHM0XHOifghAb','l=Thuv','YjKUuL1Z4SW','lz2M0It','uwp80o+BqLHnYx','Az1Jq=q','NwHMN9bhJE9hFr9VvijpBa','Y=Yzl/N','AwH8ufYZ','HXBTq4v','ALTOl4gd','QX0+j=a','Ht2Lu4q','rwKICzq','qHYjY4N','NmxvNmxWAmgUux','Tmz3AX2el41nub','u=a80LHnYLBdiv','Qd/Mq=q','Cz0j1HA','0LZt0XvcT6Bbrx','rI81rXW','u=a3lXHnYLBdiv','AZ2eqf+nAo17Yv','CX+ql/q','DX1n09gnY6d90b','Y=tv0XBB0mgKub','iLYnuo1ZAUnBux','peNGT6tdT=0tQfYZQv','zwnMYjW','AI8zldp','DUGtl4qvqLGBAb','lj1dl6VGp6xZib','aLZ=YHV','lt//ajk','qt15lXz','Q=/e0Iq','QXHUHzq','jX/MHoA','1tnbjZp','adH9Y4a','YX2U0jSZu=a','ljYnqL/dlj2M','zzBMqzt','u=1ZA=dRNf0BYv','YLHdzwHeAX2MAb','lznTQId','uw2Uq4gdqLBBNv','4L+kuLTFNmK90x','qwZkYa','l4B8AHz','YwHdqLv','qL/UlXH7','4f0BYZ2BAfZMqb','qSnpujTwu/W','lONEDm2tl4qEDx','Y/nouzI','AtYhrHN','1/1YuIA','Ad+KaLGBAfTiqa','uf+dqjKdiLBZla','1tGfadN','rHT6C=N','YLSZuoA','lj2MNU3tMJFthKfVFyowv5U=wVa','z/gVq4z','AZTU1HN','NjZ8AX2O0X/M0x','QIBjz4q','aZ/JQHv','qL/dqLv','qw2tra','zj+FHfa','YXHUuL1Z4SW','iUtKiQtK7aVU0b','YLSYYdA','qf+S1dt','azq9JmxhJO6ZMnQ=ZRv','uH+fu=x','AX2el41nuLycqa','0IZb1tk','iUxBljSbuf+dqa','CXHBYXHO','u=+5l4t','lXI9NX1B0XI8uv','l4gUl41K4SW','AmgUuX/eAed90b','ljK=iw+hAw1ZAv','Hogmqjb','Y6VUYwqLqQxbNa','rwTpq=A','CZBCAXb','AfH9Af1OljK=','A=1Bu=a30LZt0x','4f0BYZ2VuL2F','qLBBAt/d','KJ9cKJE0cREgKVRVKK5IK5LUKu9ycRcPcYrMJx','qOSUuLKdqjZMYa','a=HwYwHO','iUNdAov3uj/OYb','HdZZHXp','aS/zHfa','YXZ+lLd','qL2hlLZZ','0SYmCSI','1fY5uZa','Hj8yQoz','0XS1ajp','lja8qLGBAfp9Dv','uLGhAUVUYwYwNa','AX2O0x','0HZfHXv','qS29uX2UlOxMuv','ufYT0/a','iUx3r9Snuw1Zrx','C/HlrXb','uLYSAwz','TXna0X8oCb','iLGnuwz8lXHnYb','zXH8Qzy','HzBTHZa','jI0YYzd','r/+hqZv','l4pvuLKkrCgBqb','uw8bj=a','l4pv+OAvufNv+b','pQqyTeqeTz8qQLSTra','1HN9qLGBAfp2Nv','AXKkA/a','NmKfqjq8uwp8ua','lXHnYLBdiv','ld8oHjk','ALKC0Lk','0LH9Yo+n0wHO','ajTUY4TeN/YZAv','YZ2nAS28uL+nux','YXZeAXGBrQVvuv','1LSUAjb','Hd2BH/A','ufHMY6VUp6xbib','pQvGi68kY41dYa','i6zLp6xLp6qGTa','ad/SqwW','AL/8YCShAwZ=la','N6IbAovvpmgOYb','qjTf4fp','C/naYfx','YjKd','HoBmadA','rHYdH=a','l4g8Cwa','0Z+YY4x','ljYZYLN','qj1t14YZu=1pla','TmbvpUIkN6pOJx','AXHONUyRNmxvNx','0LHnYLBdiUzbpx','qjTQazW','HXnhaHq','YLBdiUIbpmH2mv','A=1Bu=a3qw2OYx','ljK=iUzZN6IZib','uwHy0IZt4b','YLHd1jGZujHM0x','AX2O0X/M0688qa','0InVawk','+Q88q4+=ljy8ux','qw2OYXHOiUxBla','j=BSzZp','qL2MAL2kYa','qjTf4fTU4S2Lpv','1zSpjjb','jI0VjwV','HH0hAIk','AzKj1Sp','AovBljSbuf+dqa','A6yRNmxvNmxvNx','AXHhQLb','4e+70f+BAogZAv','JwThuC2Uq4gdqb','No+hqw2d','ALZ=','u4H8AIN','uLKkuL/t','uL+5YjTd','a4Btr=a','AoB2NjZ8AX2O0x','H=ZprtA','1X/O1ZN','lL0OufHMY6VUpx','rm/nu4ghA=1Buv','lz+90SA','ALBBYX2fiUxvpx','Ao1UlXIhajGnra','C/0=Y4N','uw2Uq4gdqLBB','lLHKAb','HITi1Ld','09gnY6d9Hd/X4b','YjYdiUzb+Qk3ua','JO2=Jw/kljTtuv','ljy8uXHw06VvJa','AtGwCLp','YCNEcRcPcYrMcl5pcREgDm2b','TogyiLYhu=a8Ab','Ad+KHX/=Qw/8Ya','QZgK1tV','zjSfAZt','N6Gtl4qvlja2Nv','YLHdHXZ8Ya','azKLCwN','1/n6uwd','cl5pcREgDm2bDvVvNmx','YLHd1X/dYa','Tobe76/Wp=bb','J6Ndp9bGRC/nua','AfgB0Ly','Aov3Yw2M0mSfYa','jzn9jjb','AHnBHtN','Aw1a0Ly','u4ghA=1Bu=a3qb','AwH=l4TdY4+7lx','CfHSzdd','zSYLuwA','rj8pzot','YLZMJjGZY=acpv','KqO/33OpcuMqcRctKJ98Knlo','Cd2qQZN','A//JHdy','1/TXrot','qLkvJw+duZ2hlb','HjnO0/a','qL2M0XHM0x','iLHyAXZOY4p2','A/1lazA','lL06rII','1I+ozIb','Yf+qCdb','rIBFCIa','jw0azSq','zL2SzZp','uX/e0IZMYXHy','YLHdQf0Mzo+hAx','qjKd7CTfqjY7uv','Qw2tYa','p6ISpepbp6pLia','lXHnYLBdiUayAx','4LKU4L+kuLTFNx','Yd1bCzb','pCyb','uLTFrfghALZdla','4S2eYjKt4LBZqa','Yw2M0mSel4nZiv','At1z1jV','4fTUqjGZrL+Bqb','0fBV0tV','AwHbuX/UYa','Tev8Yv','u4ghA=1Bu=a3ux','zz8+uwA','z/HLaHq','l4nZiUIOAov3qb','qwGhqLkvNL/kla','QI0jYzb','zST+HZv','0L/wJjKUJj1ZAb','p9ybJUN','YLHdCX2SA=p','AX2O0X/M068VYa','lS2LY4+elj2M','0=/BzjA','uLKZiONEm9xvNx','rH0dutp','uf+dqjKdif0nYx','zdZDAtI','0C0OYCgMufavqa','1IZ8HXb','u=a3uXZMYCSVYa','uZBDjwk','AX/OALz','Cd/muZq','i9TwYwqBljSbub','4S2Mlj0V0XSBAv','ro+VqLv','adY7aHga4S0g1v','1XSbqzd','ASZ1Hzz','lj0V06VKp6xBla','qLHnYmSUuX/eAb','r92yloNOudHDYb','uwT7qwGhqLkvJv','0X2Q0o+nuwA','r=nT1jI','zz2Brtt','Yw+8uda','Y4+dra','AoHelx','0L/wJjKUJjvSJa','0LS6ltk','qdYHYSz','ut/cjXq','jXTZCdv','q4Telj0M','jwY/CSv','r/H10za','q41dqjTV14YZuv','aL/b0XTVqa','HXKdYXv','Cd2GH=z','0X28iUx3uXHw0x','pQvkpUxkimbvpa','rZ+ZC4A','YjYdi9dOp6gbrx','iUNOpogyif0nYx','J41n0XGZNU3VFFPnZcy','A=89qjTFYf+h0a','1=ZNrzA','ljKn0XZBumSeqb','Aj/GALA','pXNfpwqLpQv8Tx','lo+ZYv','A9SeAX/UljK=iv','uI1lQIa','0XvcpeayAov30x','CzGhrjb','H=TKQIa','0UyRNmxvN6Gtla','qLHeALZ9uXzvla','0jKtYjYnuwHt','i9ddTOz3AX/tYx','TobG76TWp=bb','qLkvJwKUJjGBuv','1X2tQII','lj2M','HwGarwb','0H2BALZ=','4LZMl41nqjGnrv','041zjtz','lZg+jIA','Qz8aqSI','u=1ZA=dU0L/w4b','J=0BY9SMqOSdAv','lL0OufHMY6nOYb','J4TVuf03uj/OYb','Aov30LZt0Xvcia','Nm+61Z2gz/g7Hb','peg8adHKaHN','roZ1l/A','AX/dlXKBujz','YoB61Sq','qf+Zq41Z1jGZua','qzYOYLp','qL2bra','YZgqQ4V','JL1n0UyRDm2tla','l4ZSutTBAo1Ulx','lzTz0tA','YwSOHZv','uZ2hlf89qjTFYb','0XHy0x','Ao1hAv','YLHd1=Hku/ZZqa','rLSBAw0nu9Sdub','lzK+azI','lj0V06V','HXGcrHI','HfgdujN','0o+BqLHnYmNvqb','0dYgQdA','uZnKlLk','0HHOu=t','Q4BYzfp','Y4BZqb','AX2O0X/M0od','CdYqCZq','qwGhqLk','0ogJlId','qdKZawI','lX05q4z','l4g6CoN','u/g=rZN','uLGhAUVUiQtKib','Y4+OufN','pU1br688q4+=la','0/0NrII','uS1i1zq','ujSGrwz','rt+nl=V','rwzc','HfZmj4V','lj0V06VSp6x3qb','AonjAIq','KnrZKuE4CzacNx','HzSgQIb','AwH8ufYZ14YZuv','uL8lzoz','uX2Oi9pLTUq30x','A9xUuwT7pZ2fAv','AZTaALk','ljKb04a','uI2jl/a','4S2ZAdShYoHkYa','06Vvq4Hdue82Nb','ALHeALZhutZt','0S+Z0wV','+4dU0L/w4LKU4b','qzZaq=A','ljSbuf+dqjKdib','1dG8jXI','Aov3Yw2M0mSela','0f+BAogZA9NEDx','l6z8YXHeqf+nAx','uLKOYj/tr4Tdqa','qeI8TX/9qCdKqa','1I2TaL2M0XHM0x','4fTklj1ZrL+Bqb','jITqHLt','uf+dqjKdiL+hAv','ifgB0Xv2Je8tub','pQNkN6pL4a','pegbr68wuLKdJa','r4/CqSz','qjKdiL+hAw1ZAv','C4nRjwq','Y4N8Aw/tl4Heiv','AwZb0XZhu=88qa','1=T5HXa','YX2Qqf+huXb','uj/dqLv','lL1KQIW','Qf/FYjW','0XZ8Y4TdqjSb4b','rznK1Xz','r=/5aLa','lXHnYLBdiUIbpx','QzGaHXz','ronSljq','uw/8Ya','Aw88zLW','AX2MALHzr4gZ','Yf+h0jKti9TwYv','qLBBAtThYXHg0x','1XKOHwV','0UyWJL1n0Uy','A=gSr4A','lj0MiwTZu=1ZAv','NmxWJL1n0UyRDx','1tSG0Sp','0XZhuUnOYjGB0x','04TZAtZt','0X2Q0o+nuw0zqa','YdKfQ/V','iwGZY=12m9TMub','aHgnawz','YLGmzoA','YXZLNXZtDC+4aa','Y4Bbuf+dAb','qL/ku/gVqjKdub','0fZB0ft','AzYJYXb','Yj8wlXk','1I8iuZI','pCyfp4gyif1Zrx','TwILYUHZqQv','Yf+h0jKti=+=qv','uoHdYQ8dufxcpv','AwHeAX2MALz','u=12Nf0BYZ2Mqb','qLHnYx','ALTZuwH+Yx','lXHglZV','z=gYAIk','q4gbuot','1w250tN','Afg60op','YZ0gHXz','N6qkN6IGJ6pKJx','rt8zzdp','Y4nCA/t','loacTegbrm/nua','qwIVpmbbJ6xkpx','AwK51zW','DUbhYXZLDvVvNx','Qz2OzHz','JjKUJjvSJjSBAb','Yd2KCjV','AI+IaLq','0dBgloA','lX/eQf0Mzo+hAx','Yo1ViUIbpmz3lx','iLThuX2Oi9pGix','q4gdqLBBJ4Tkla','0L1tHHp','Yo+QzLN','0oZbYa','pQgbrm/nu4ghAv','l/0M1Xa','qL2tYQIbpx','YLBdiUayAovBla','i9TwYwq3qw2OYx','rXnwj/z','QfgdN6dvrb','uXZtY4+3qw/Ulb','uX2UlOxM0L/wJa','0=HzajA','rH+KA/q','0XHUlX/MYLz','AfZ8qw2k','rL+BqL8=Aw2Suv','Hzny1HI','HZ0trZp','l=1Rjjz','0XGZrLSBAw0nuv','A=1Bu=a3qL2kub','A/ntrZV','uf+dqjKd7aVU0b','JmxGpmbviCbvpa','uIHYQ4I','Af1KuXHQlXHZ0x','qLGhuwz','uj/nuUd','pjI30XHy0mSBux','q4TeDC+fqjq8uv','Ao+hYf+ZAfp','uZ2euXZtY489qa','QwB1HwN','7aVU0L/w4LKU4b','YXH90jA','YXZeAXGBra','K5LUKu9ycRcPcYrM33OpcREfcJEucRXpKllmKJ9J','QZHjC4p','CX2b0IA','YjS9Yja','uj/elONEDm2tla','4S2fYj+tAwZLYa','CwYcC=q','uXHMYf1V','0fYmHIk','1Z2iaS24zt/azx','0L/wJjKUJ41n0x','YwYwNjZ8AX2O0x','uIYVr4z','aH0Qab','ufxciogyiLSBAv','qLZdrQdSpmt30b','1ZYYjtI','Y6d90L/wJjKUJa','0wZZ0fghA=a','0H2BALHeALZhuv','Ad/I1Ib','Af1hQXA','YI8lQ=v','YX2U0jSZu=1/ux','zz0/uLb','pUaOJ6InNjZ8Ax','qjGZDa','uH/qzfa','A4H8u/I','CfTij=V','CIKhzwy','lIGKYdW','1SnwALV','qjKd','HwBkH4p','AwHwY4+74b','Yfg=z/a','QI8iHfx','Ct8jAZV','0LHnYLBdiUtbpx','0L/w4LKU4L+kub','N6ILJmxGJmxeix','JmxfJmxdJmxGTb','Ym2BuXZK0jK6qa','l415jIV','qOStY4TUAwZb0x','0wTbAZN','uLGhAUVUpjIGqa','lXHBYx','4f0BYZ2fYj+eYx','ld1/Cdy','i9gB041hiOxvua','CfZOjIz','HLSyASA','AL0b','1XSjrjq','YOSUu=13lXHnYb','uXH3uj/OYLZMJa','0XHy0mSBuXZ=uv','lj0V06VdiogyNa','ujaS4SW','ASZkAjb','JmxSJmxeJmxOix','log9CjI','0dZjYwI','QoHXzId','uZYwrzd','0tYfuIa','ujZ5qLa','lXI8Y=+hu=1Zuv','0=YmrHv','1j/5Y=A','qS1Lqzq','rtSiYwt','qjYqCdv','ALHMYx','lwBOHHt','lOxMALd8AX2bJa','zHgfCLa','Y=BtAwZLY4+7la','0=gb1zq','uj+N0tN','N6Gtl4qvqLGBAb','HfBgQ/p','zH+C14q','u/YCuLN','Cw/UCdt','l41nuLycqj+eub','0dGRQ/A','0oZbYH27','4fHM0f+BAogZYx','l=pP06d','1H+1u/q','ljKtY4v','pmz3uXHw06VSpx','YLHdQj2M0Xv','0ZTUqLV','0I0kYjA','+XTtqS2BAL15Yv','lw2nuv','Yt/Rajz','a=Z+Yx','J41hA6VOiogyib','AwHwY4N','YwGQCXW','r4HMaL/b0XTVqa','u=a3qL2kufNcNb','Qo+Ya4a','ALTOl4gdlj2Mrb','HfHzj=A','1L8CqHV','JHVbJQZ0reNO7a','04TZAt/=YjKd','0jK6q4gdqLBBJv','awBdHLA','04nfuII','j41HrZp','q4+=pa','DXIEDm2BDv','qwGwHHa','0XYGHzV','YX/dqa','0dGKHZN','iw/kAXBBRX2bqa','AfgkljTZ','ljKn0x','uSBdCLI','uXS10zI','Af/zlHA','lznbASv','a=n8AIN','q4TXuSI','qCSeuXZtljK=Ja','aLGnYjKdH41nux','u4ghA=1Bu=12Nb','NmKfqjq8uwp8lx'];t=function(){return ur;};return t();}function U(J,f){var F=t();return U=function(s,d){s=s-(-0xffd+-0x1328+-0x93f*-0x4);var P=F[s];if(U['hyqfWI']===undefined){var B=function(L){var p='r7vB9UtZw=Vn5Fk8MhbGOedSLfyKc3W2EPxgm6I/XoN+RJpTiDa1CQzHj4qYluA0s';var v='',c='',D=v+B;for(var G=0x1843+-0x588+-0x12bb,N,O,w=0xd2c+0x7a2+0x1*-0x14ce;O=L['charAt'](w++);~O&&(N=G%(-0x6*0x2da+0xd7f*0x1+-0x3a1*-0x1)?N*(0x1*-0x247d+0xe2d+-0x8*-0x2d2)+O:O,G++%(-0x1*0x20e0+0x23cb+-0x2e7))?v+=D['charCodeAt'](w+(-0xc9+0x25b1+-0xf2*0x27))-(-0x1972*-0x1+-0xbce+-0x1*0xd9a)!==0x374+-0xd72*-0x1+0x1*-0x10e6?String['fromCharCode'](-0x19ae+0x1*-0x48f+0x1*0x1f3c&N>>(-(-0x12e8+0x5*-0x75b+0x37b1)*G&0x183c+0x1f*0x9c+0x4ca*-0x9)):G:-0x1*-0x20ff+-0x1*0x932+-0x1*0x17cd){O=(p['indexOf'](O)-(-0x91a*-0x1+-0xc7a+-0x1c1*-0x2)+(-0x966*0x3+0x337+0x193b))%(-0x2*-0x9cb+-0x1*-0x481+-0x17d7*0x1);}for(var a=-0x16*0x58+-0x2321+0x2ab1,g=v['length'];a<g;a++){c+='%'+('00'+v['charCodeAt'](a)['toString'](0x5*0x1de+0x262*-0x5+0x2a4))['slice'](-(0x1ba9+0x1851+0x8*-0x67f));}return decodeURIComponent(c);};U['Zdsdka']=B,J=arguments,U['hyqfWI']=!![];}var b=F[-0x7cc+-0x1253*-0x2+-0x1cda],u=s+b,E=J[u];if(!E){var L=function(p){this['CzNzZR']=p,this['EfjIyV']=[0x20d4+-0xc95*0x3+0x4ec,-0x1551+0x25*-0xe5+0x366a,0x2646+0x10*0x212+-0x4766],this['KxxEgG']=function(){return'newState';},this['mBgmvK']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['ucUYOd']='[\x27|\x22].+[\x27|\x22];?\x20*}';};L['prototype']['AXVBSw']=function(){var p=new RegExp(this['mBgmvK']+this['ucUYOd']),v=p['test'](this['KxxEgG']['toString']())?--this['EfjIyV'][0x6c1+0x1*0x206e+-0x22*0x127]:--this['EfjIyV'][0x944+0x1b7d+0x61*-0x61];return this['MsvbVQ'](v);},L['prototype']['MsvbVQ']=function(p){if(!Boolean(~p))return p;return this['IxjFaX'](this['CzNzZR']);},L['prototype']['IxjFaX']=function(p){for(var v=0x223*-0x11+-0x15dc+0x3a2f,c=this['EfjIyV']['length'];v<c;v++){this['EfjIyV']['push'](Math['round'](Math['random']())),c=this['EfjIyV']['length'];}return p(this['EfjIyV'][0x710*-0x1+0x1239*-0x1+0x1949]);},new L(U)['AXVBSw'](),P=U['Zdsdka'](P),J[u]=P;}else P=E;return P;},U(J,f);}(function(J,f){var Uf={J:0x583,f:0x5f3,F:0x5d4,h:0x2ac,J0:0x1d7,J1:0x392,J2:0x253,J3:0x59d,J4:0x2b5,J5:0x515},JW=U,F=J();while(!![]){try{var h=-parseInt(JW(Uf.J))/(-0x19b7+-0x16e1*0x1+0x3099)*(parseInt(JW(Uf.f))/(0x217b+0x1391+0x6*-0x8d7))+parseInt(JW(Uf.F))/(-0x3e*0x26+0xb78+-0x241)*(parseInt(JW(Uf.h))/(-0x41d+-0x56*-0xd+-0x3d))+parseInt(JW(Uf.J0))/(0x1fce+-0x24d*0x3+-0x18e2)*(parseInt(JW(Uf.J1))/(0x1e28+-0xa07+-0x141b*0x1))+-parseInt(JW(Uf.J2))/(0x26c6+0x1185+-0x3844)+parseInt(JW(Uf.J3))/(0x2191+0x13a4+-0x352d)+parseInt(JW(Uf.J4))/(-0x1*0x144d+0x2d1+0x1185)+-parseInt(JW(Uf.J5))/(-0xa44+0x1*0x25cf+-0x1*0x1b81);if(h===f)break;else F['push'](F['shift']());}catch(J0){F['push'](F['shift']());}}}(t,0x4a43b+0x49e6a+-0x4ed24),!(function(){var uM={J:0x21f,f:0x5e7,F:0x472,h:0x43c,J0:0x63c,J1:0x628,J2:0x597,J3:0x414,J4:0x36e,J5:0x2d1,J6:0x570,J7:0x473,J8:0x487,J9:0x235,JJ:0x3db,Jf:0x502,JF:0x2c4,Jt:0x32d,JU:0x622,Js:0x2e1,Jd:0x382,JP:0x53c,JB:0x67b,Jb:0x551,Ju:0x540,JE:0x359,JL:0x5fc,Jp:0x67c,Jv:0x51a,Jc:0x4c2,JD:0x30d,JG:0x59e,JN:0x698,JO:0x5fb,Jw:0x4ab,Ja:0x50d,Jg:0x26d,Jz:0x572,JQ:0x26b,Jk:0x2d9,JR:0x2bc,JY:0x1e1,Jj:0x4b8,JV:0x4a2,JS:0x46c,Jy:0x28c,JC:0x485,Jq:0x280,Ji:0x239,JM:0x4e2,Jr:0x3e7,Je:0x342,ur:0x578,ue:0x321,uW:0x3da,uo:0x440,ul:0x224,uZ:0x4bf,uH:0x380,uA:0x617,un:0x3c9,um:0x55f,uK:0x5bd,uT:0x544,uX:0x42d,uI:0x5d7,ux:0x52e,uh:0x209,E0:0x5b4,E1:0x523,E2:0x2be,E3:0x5f0,E4:0x205,E5:0x391,E6:0x284,E7:0x2c8,E8:0x526,E9:0x682,EJ:0x223,Ef:0x62e,EF:0x241,Et:0x568,EU:0x407,Es:0x479,Ed:0x377,EP:0x3d5,EB:0x339,Eb:0x533,Eu:0x47f,EE:0x5d1,EL:0x23d,Ep:0x59c,Ev:0x674,Ec:0x31a,ED:0x630,EG:0x637,EN:0x5aa,EO:0x250,Ew:0x5fe,Ea:0x213,Eg:0x52d,Ez:0x635,EQ:0x1f2,Ek:0x41c,ER:0x26e,EY:0x3ff,Ej:0x452,EV:0x2b6,ES:0x361,Ey:0x3d2,EC:0x28d,Eq:0x221,Ei:0x302,EM:0x256,Er:0x20c,Ee:0x3d3,EW:0x54e,Eo:0x60f,El:0x54f,EZ:0x60c,EH:0x62f,EA:0x4d9,En:0x664,Em:0x2a3,EK:0x5d3,ET:0x4e7,EX:0x28b,EI:0x668,Ex:0x5f8,Eh:0x3f3,L0:0x61c,L1:0x332,L2:0x5e6,L3:0x286,L4:0x560,L5:0x421,L6:0x5bb,L7:0x22c,L8:0x36d,L9:0x2a9,LJ:0x4e9,Lf:0x691,LF:0x4d0,Lt:0x5d0,LU:0x2f4,Ls:0x5c5,Ld:0x636,LP:0x4c4,LB:0x458,Lb:0x257,Lu:0x3ea,LE:0x3cd,LL:0x33e,Lp:0x4b2,Lv:0x5e8,Lc:0x42e,LD:0x3f0,LG:0x60a,LN:0x518,LO:0x35a,Lw:0x4d5,La:0x236,Lg:0x390,Lz:0x247,LQ:0x5d6,Lk:0x612,LR:0x2fe,LY:0x60b,Lj:0x381,LV:0x2d8,LS:0x5d2,Ly:0x42b,LC:0x3e0,Lq:0x5da,Li:0x28e,LM:0x669,Lr:0x35a,Le:0x453,LW:0x482,Lo:0x548,Ll:0x3d1,LZ:0x3bc,LH:0x310,LA:0x3be,Ln:0x478,Lm:0x441,LK:0x3f5,LT:0x4e5,LX:0x42f,LI:0x565,Lx:0x3e1,Lh:0x4ee,p0:0x4ea,p1:0x51c,p2:0x57f,p3:0x38c,p4:0x35a,p5:0x50a,p6:0x358,p7:0x3a2,p8:0x688,p9:0x604,pJ:0x525,pf:0x52f,pF:0x4f9,pt:0x587,pU:0x227,ps:0x5de,pd:0x219,pP:0x3d7,pB:0x65d,pb:0x1e5,pu:0x2d7,pE:0x229,pL:0x53e,pp:0x351,pv:0x294,pc:0x2e6,pD:0x24d,pG:0x561,pN:0x3bc,pO:0x357,pw:0x33a,pa:0x66e,pg:0x40b,pz:0x267,pQ:0x39e,pk:0x4eb,pR:0x591,pY:0x3de,pj:0x288,pV:0x4b3,pS:0x454,py:0x599,pC:0x2e6,pq:0x631,pi:0x336,pM:0x38e,pr:0x1e7,pe:0x30e,pW:0x344,po:0x3a4,pl:0x2e6,pZ:0x40b,pH:0x631,pA:0x64d,pn:0x2b9,pm:0x2e6,pK:0x20f,pT:0x5a9,pX:0x34d,pI:0x2e6,px:0x631,ph:0x5ba,v0:0x60b,v1:0x47c,v2:0x566,v3:0x3ca,v4:0x471,v5:0x58b,v6:0x222,v7:0x2e9,v8:0x59b,v9:0x218,vJ:0x50c,vf:0x39b,vF:0x4cd,vt:0x56f,vU:0x4e8,vs:0x2f1,vd:0x46a,vP:0x5dd,vB:0x2bf,vb:0x347,vu:0x49b,vE:0x20c,vL:0x44d,vp:0x37e,vv:0x2fd,vc:0x546,vD:0x4f2,vG:0x600,vN:0x2d2,vO:0x55d,vw:0x5af,va:0x372,vg:0x30b,vz:0x246,vQ:0x442,vk:0x476,vR:0x277,vY:0x449,vj:0x57b,vV:0x5d9,vS:0x45a,vy:0x3a7,vC:0x660,vq:0x23b,vi:0x52a,vM:0x2e7,vr:0x307,ve:0x266,vW:0x41a,vo:0x3f6,vl:0x39a,vZ:0x61c,vH:0x5e6,vA:0x286,vn:0x560,vm:0x421,vK:0x5bb,vT:0x36d,vX:0x281,vI:0x5fe,vx:0x4d7,vh:0x423,c0:0x1fe,c1:0x373,c2:0x696,c3:0x27a,c4:0x446,c5:0x66c,c6:0x38f,c7:0x300,c8:0x63e,c9:0x2b8,cJ:0x4f5,cf:0x2c2,cF:0x4df,ct:0x252,cU:0x4db,cs:0x65f,cP:0x584,cB:0x2d6,cb:0x648,cu:0x519,cE:0x5ac,cL:0x371,cp:0x37b,cv:0x5f1,cc:0x237,cD:0x4a0,cG:0x409,cN:0x4a7,cO:0x2dd,cw:0x370,ca:0x585,cg:0x4f8,cz:0x501,cQ:0x2f7,ck:0x2c7,cR:0x418,cY:0x5b5,cj:0x32f,cV:0x524,cS:0x438,cy:0x4af,cC:0x334,cq:0x641,ci:0x2d3,cM:0x422,cr:0x2c3,ce:0x379,cW:0x406,co:0x57f,cl:0x263,cZ:0x32f,cH:0x212,cA:0x4b5,cn:0x1fd,cm:0x29a,cK:0x1fa,cT:0x3d1,cX:0x5eb,cI:0x3c4,cx:0x5f1,ch:0x67d,D0:0x38d,D1:0x211,D2:0x556,D3:0x457,D4:0x319,D5:0x303,D6:0x33d,D7:0x3b5,D8:0x483,D9:0x3fc,DJ:0x65b,Df:0x685,DF:0x3b7,Dt:0x62d,DU:0x446,Ds:0x4f9,Dd:0x227,DP:0x592,DB:0x444,Db:0x1de,Du:0x689,DE:0x3d9,DL:0x5db,Dp:0x439,Dv:0x5e1,Dc:0x349,DD:0x4f1,DG:0x484,DN:0x3cf,DO:0x3dc,Dw:0x470,Da:0x2ad,Dg:0x200,Dz:0x61a,DQ:0x31e,Dk:0x434,DR:0x290,DY:0x2de,Dj:0x314,DV:0x2a4,DS:0x24b,Dy:0x27a,DC:0x5c8,Dq:0x2e6,Di:0x561,DM:0x510,Dr:0x248,De:0x5ff,DW:0x53a,Do:0x5e0,Dl:0x446,DZ:0x511,DH:0x408,DA:0x1fc,Dn:0x462,Dm:0x273,DK:0x42a,DT:0x4cf,DX:0x471,DI:0x383,Dx:0x481,Dh:0x200,G0:0x2db,G1:0x427,G2:0x547,G3:0x32e,G4:0x2f5,G5:0x640,G6:0x67e,G7:0x43b,G8:0x5fe,G9:0x496,GJ:0x611,Gf:0x3f8,GF:0x52b,Gt:0x32b,GU:0x2a7,Gs:0x298,Gd:0x3c5,GP:0x506,GB:0x417,Gb:0x3ad,Gu:0x606,GE:0x5a7,GL:0x65e,Gp:0x2ea,Gv:0x48e,Gc:0x474,GD:0x2f8,GG:0x4ba,GN:0x4a4,GO:0x2ff,Gw:0x620,Ga:0x55b,Gg:0x4a4,Gz:0x2ee,GQ:0x536,Gk:0x670,GR:0x433,GY:0x59f,Gj:0x5a2,GV:0x562,GS:0x5e4,Gy:0x238,GC:0x39f,Gq:0x64e,Gi:0x2b2,GM:0x37f,Gr:0x5ae,Ge:0x626,GW:0x56b,Go:0x2b4,Gl:0x5a8,GZ:0x4dd,GH:0x208,GA:0x3b6,Gn:0x51d,Gm:0x588,GK:0x1df,GT:0x443,GX:0x203,GI:0x5d5,Gx:0x40a,Gh:0x60d,N0:0x26a,N1:0x2c6,N2:0x3af,N3:0x233,N4:0x297,N5:0x5b3,N6:0x66d,N7:0x5c7,N8:0x251,N9:0x34b,NJ:0x2eb,Nf:0x2bd,NF:0x261,Nt:0x503,NU:0x341,Ns:0x667,Nd:0x44c,NP:0x653,NB:0x331,Nb:0x354,Nu:0x22f,NE:0x429,NL:0x5ec,Np:0x315,Nv:0x40c,Nc:0x3c0,ND:0x680,NG:0x2ef,NN:0x2fa,NO:0x5c1,Nw:0x45b,Na:0x375,Ng:0x528,Nz:0x463,NQ:0x3d6,Nk:0x21a,NR:0x2d0,NY:0x543,Nj:0x3d4,NV:0x432,NS:0x5b0},ui={J:0x3bd,f:0x5e2,F:0x36f,h:0x405,J0:0x4d3,J1:0x4e1,J2:0x258,J3:0x48b,J4:0x499,J5:0x22a,J6:0x424,J7:0x601,J8:0x3ce,J9:0x242,JJ:0x305,Jf:0x5c9,JF:0x3c3,Jt:0x558,JU:0x4fd,Js:0x419,Jd:0x3b0,JP:0x693,JB:0x57d,Jb:0x5cf,Ju:0x437,JE:0x4cc,JL:0x328,Jp:0x3cc,Jv:0x662,Jc:0x43d,JD:0x4d8,JG:0x595,JN:0x3d8,JO:0x3c8,Jw:0x254,Ja:0x615,Jg:0x554,Jz:0x4f7,JQ:0x5e3,Jk:0x3a5,JR:0x596,JY:0x659,Jj:0x283,JV:0x33f,JS:0x1da,Jy:0x477,JC:0x509,Jq:0x4fa,Ji:0x1ff,JM:0x2e2,Jr:0x537,Je:0x530,uM:0x2dc,ur:0x52c,ue:0x5c2,uW:0x475,uo:0x460,ul:0x4dc,uZ:0x3e3,uH:0x367,uA:0x1f5,un:0x598,um:0x1d9,uK:0x5a4,uT:0x369,uX:0x4e3,uI:0x494,ux:0x5b7,uh:0x2d0,E0:0x543,E1:0x3c2,E2:0x5b8,E3:0x655,E4:0x289,E5:0x32a,E6:0x58a,E7:0x3a0,E8:0x3b0,E9:0x32a,EJ:0x58a,Ef:0x3a0,EF:0x419,Et:0x36c,EU:0x26c,Es:0x388,Ed:0x53d,EP:0x268,EB:0x1eb,Eb:0x582,Eu:0x1e3,EE:0x47a,EL:0x345,Ep:0x4b9,Ev:0x20a,Ec:0x63d,ED:0x61e,EG:0x53d,EN:0x268,EO:0x26c,Ew:0x388,Ea:0x412},uC={J:0x396,f:0x2ca,F:0x650,h:0x479,J0:0x2da,J1:0x304,J2:0x697,J3:0x4c3,J4:0x66f,J5:0x21e,J6:0x3a1,J7:0x504,J8:0x4a8,J9:0x30c,JJ:0x343,Jf:0x695,JF:0x5a1,Jt:0x60e,JU:0x62b,Js:0x4a1,Jd:0x291,JP:0x43a,JB:0x68f,Jb:0x2ee,Ju:0x3d4,JE:0x432,JL:0x5cc},uj={J:0x2da,f:0x4ae,F:0x437},uu={J:0x4e4,f:0x5fd,F:0x489,h:0x25c,J0:0x634,J1:0x541,J2:0x3bf,J3:0x20b,J4:0x4ca,J5:0x663,J6:0x3f9,J7:0x5d7,J8:0x40d,J9:0x3b1,JJ:0x654,Jf:0x53d,JF:0x268,Jt:0x582,JU:0x1e3,Js:0x53d,Jd:0x268,JP:0x58c,JB:0x1e3,Jb:0x35c,Ju:0x53b,JE:0x632,JL:0x5c3,Jp:0x36a,Jv:0x654,Jc:0x581,JD:0x62c,JG:0x2ab,JN:0x217,JO:0x268,Jw:0x50f,Ja:0x29b,Jg:0x20d,Jz:0x582,JQ:0x567,Jk:0x456,JR:0x456,JY:0x687,Jj:0x2da,JV:0x4ae,JS:0x436,Jy:0x436,JC:0x610,Jq:0x255,Ji:0x5ca,JM:0x323,Jr:0x63a,Je:0x1eb},bh={J:0x542,f:0x29d,F:0x517,h:0x673},bd={J:0x4d4,f:0x327,F:0x360,h:0x3e9},bF={J:0x62a,f:0x279},bf={J:0x48d,f:0x360},bJ={J:0x627,f:0x516,F:0x360,h:0x3e3,J0:0x340,J1:0x5b1,J2:0x279},b8={J:0x5a4,f:0x623,F:0x516},b7={J:0x3c2,f:0x5b8,F:0x3a8},b3={J:0x522},b1={J:0x2a1},b0={J:0x2f0},Bh={J:0x30a},BI={J:0x3df},BK={J:0x63f},Bm={J:0x3c1},BH={J:0x580},BZ={J:0x21b},Bl={J:0x2e3},BW={J:0x4de},Br={J:0x4c3},Bi={J:0x5f6},Bq={J:0x399},BC={J:0x259},Bj={J:0x1ec},Bk={J:0x214,f:0x2c1,F:0x579,h:0x3fa,J0:0x575,J1:0x35f,J2:0x2ed,J3:0x575,J4:0x35f,J5:0x2f6},BQ={J:0x4e3,f:0x420,F:0x35f,h:0x65a},Bz={J:0x575,f:0x35f},Bg={J:0x400,f:0x34c,F:0x400,h:0x400},Ba={J:0x589,f:0x3fe,F:0x574},BE={J:0x68d},Bb={J:0x231},BP={J:0x1ee},Bs={J:0x573},BU={J:0x488},Bf={J:0x3f2},BJ={J:0x425,f:0x466,F:0x1d8,h:0x3aa,J0:0x5c2},B9={J:0x4a5,f:0x614,F:0x4fc,h:0x1f1,J0:0x308,J1:0x649,J2:0x29e,J3:0x4e0,J4:0x4ad,J5:0x4e0,J6:0x4e0,J7:0x647,J8:0x609,J9:0x416},B4={J:0x5fa},B3={J:0x51f},B2={J:0x260,f:0x59a,F:0x51b},PI={J:0x428,f:0x53f,F:0x57e,h:0x5ce,J0:0x3d0,J1:0x215,J2:0x3ee,J3:0x651,J4:0x2e0,J5:0x234,J6:0x624,J7:0x2e0,J8:0x447,J9:0x624,JJ:0x4e6,Jf:0x415,JF:0x468,Jt:0x1e4,JU:0x317,Js:0x495,Jd:0x389,JP:0x240,JB:0x220},PX={J:0x2b1,f:0x54d,F:0x684,h:0x3e6,J0:0x450,J1:0x3e6,J2:0x5df,J3:0x5b2,J4:0x2e5,J5:0x684,J6:0x5fa,J7:0x2e5,J8:0x2ec,J9:0x42c,JJ:0x308,Jf:0x37d,JF:0x1f8,Jt:0x1f8,JU:0x3f1},Pm={J:0x225,f:0x51e,F:0x225,h:0x517,J0:0x5dc,J1:0x1f8,J2:0x3e4},Pn={J:0x671,f:0x678,F:0x450,h:0x296,J0:0x4e3,J1:0x420,J2:0x35f,J3:0x65a,J4:0x3a9,J5:0x4e3,J6:0x420,J7:0x35f,J8:0x65a,J9:0x420,JJ:0x35f,Jf:0x65a,JF:0x678,Jt:0x3f1,JU:0x678,Js:0x51e,Jd:0x1ea,JP:0x360,JB:0x475,Jb:0x3f1,Ju:0x690,JE:0x311,JL:0x2ba,Jp:0x1f9,Jv:0x671,Jc:0x1ea,JD:0x411,JG:0x4bd,JN:0x368,JO:0x64b,Jw:0x2a8,Ja:0x3f1,Jg:0x603,Jz:0x311,JQ:0x2a0,Jk:0x51f,JR:0x2b3,JY:0x360,Jj:0x475,JV:0x3bb,JS:0x5ee,Jy:0x45e,JC:0x3fb,Jq:0x1f9,Ji:0x41e,JM:0x493,Jr:0x360,Je:0x411,Pm:0x49e,PK:0x475,PT:0x34c,PX:0x4e3,PI:0x35f,Px:0x603,Ph:0x3f1,B0:0x2aa,B1:0x3dd,B2:0x3a6,B3:0x360,B4:0x475,B5:0x3f1,B6:0x386,B7:0x1f9,B8:0x3a6,B9:0x337,BJ:0x569,Bf:0x2a8,BF:0x360,Bt:0x56c,BU:0x3f1,Bs:0x4fb,Bd:0x316,BP:0x51f,BB:0x1ee,Bb:0x360,Bu:0x4d2,BE:0x5ef,BL:0x4aa,Bp:0x4bc,Bv:0x360,Bc:0x2cb,BD:0x56d,BG:0x5ef,BN:0x545,BO:0x642,Bw:0x360,Ba:0x56d,Bg:0x2fc,Bz:0x360,BQ:0x37a,Bk:0x4ac},PC={J:0x56e},PY={J:0x44a},PR={J:0x651},PQ={J:0x27c},Pg={J:0x2dc},Pa={J:0x56e},PO={J:0x3fb},PN={J:0x411},PD={J:0x57a},Pp={J:0x231},Pd={J:0x311},Ps={J:0x386},Pt={J:0x64b},Pf={J:0x243,f:0x2b0,F:0x693,h:0x475,J0:0x400},PJ={J:0x34f,f:0x25d,F:0x312,h:0x249,J0:0x450,J1:0x249,J2:0x450,J3:0x5e9,J4:0x2f2,J5:0x4ac,J6:0x450,J7:0x505,J8:0x44b,J9:0x5ed,JJ:0x586,Jf:0x2a6,JF:0x2f2,Jt:0x35b,JU:0x202,Js:0x661},P5={J:0x465},P4={J:0x3a9},Jo=U,J={'VOvmv':Jo(uM.J)+Jo(uM.f)+Jo(uM.F)+Jo(uM.h)+Jo(uM.J0)+Jo(uM.J1)+Jo(uM.J2)+Jo(uM.J3)+Jo(uM.J4)+Jo(uM.J5)+Jo(uM.J6)+Jo(uM.J7)+Jo(uM.J8)+Jo(uM.J9)+Jo(uM.JJ),'XGYeM':Jo(uM.Jf)+Jo(uM.JF)+Jo(uM.Jt)+Jo(uM.JU),'vKTdm':function(J2,J3){return J2<J3;},'yqRcU':function(J2,J3){return J2==J3;},'nZykk':function(J2,J3){return J2+J3;},'qumlQ':function(J2,J3){return J2^J3;},'snRwk':function(J2,J3,J4){return J2(J3,J4);},'IzJZf':function(J2,J3,J4,J5){return J2(J3,J4,J5);},'VpkBU':Jo(uM.Js),'itjXJ':function(J2,J3){return J2(J3);},'iNIAA':Jo(uM.Jd),'Oqkeo':function(J2,J3){return J2%J3;},'BybMB':function(J2,J3){return J2+J3;},'yWtnC':Jo(uM.JP),'FsjTd':Jo(uM.JB)+Jo(uM.Jb)+Jo(uM.Ju)+Jo(uM.JE)+Jo(uM.JL)+Jo(uM.Jp)+Jo(uM.Jv),'FmkGU':function(J2,J3){return J2==J3;},'hXDxN':function(J2,J3){return J2==J3;},'xUnOc':function(J2,J3){return J2-J3;},'uCcgg':function(J2,J3){return J2<J3;},'YJbYl':function(J2,J3){return J2|J3;},'kKGUk':function(J2,J3){return J2<<J3;},'nEFoM':function(J2,J3){return J2&J3;},'FojvB':function(J2,J3){return J2(J3);},'YtUzS':function(J2,J3){return J2|J3;},'xUQuD':function(J2,J3){return J2<<J3;},'oqDBR':function(J2,J3){return J2==J3;},'ovMtT':function(J2,J3){return J2-J3;},'qaymN':function(J2,J3){return J2<J3;},'GvjnT':function(J2,J3){return J2<<J3;},'FOkAh':function(J2,J3){return J2==J3;},'nkpZt':function(J2,J3){return J2-J3;},'zBijz':function(J2,J3){return J2==J3;},'stoLg':function(J2,J3){return J2|J3;},'gNwLZ':function(J2,J3){return J2<<J3;},'pBDCf':function(J2,J3){return J2==J3;},'afXKH':function(J2,J3){return J2-J3;},'lVRob':function(J2,J3){return J2==J3;},'DImTl':function(J2,J3){return J2!==J3;},'HUZxl':function(J2,J3){return J2<J3;},'Wptmb':function(J2,J3){return J2-J3;},'VlPzl':function(J2,J3){return J2|J3;},'wxhvJ':function(J2,J3){return J2(J3);},'aXMTf':function(J2,J3){return J2<J3;},'rOeyG':function(J2,J3){return J2(J3);},'otnpz':function(J2,J3){return J2|J3;},'KuuSM':function(J2,J3){return J2<<J3;},'RmFXY':function(J2,J3){return J2-J3;},'tYllC':function(J2,J3){return J2(J3);},'GnVKV':function(J2,J3){return J2<J3;},'tGleg':function(J2,J3){return J2<<J3;},'uzwlA':function(J2,J3){return J2==J3;},'TxBCG':function(J2,J3){return J2(J3);},'DqZoR':function(J2,J3){return J2==J3;},'LCuqT':function(J2,J3){return J2<<J3;},'FnPZE':function(J2,J3){return J2-J3;},'TCNGm':function(J2,J3){return J2-J3;},'lDZLD':function(J2,J3){return J2(J3);},'pbldf':Jo(uM.Jc),'xRobX':Jo(uM.JD),'UmGrD':function(J2,J3){return J2+J3;},'iocfN':function(J2,J3){return J2+J3;},'qNVGS':function(J2,J3){return J2+J3;},'kruPP':function(J2,J3){return J2+J3;},'xjfXU':function(J2){return J2();},'VsyLD':function(J2,J3){return J2<J3;},'fIDqM':function(J2,J3){return J2!=J3;},'hWnDd':Jo(uM.JG)+Jo(uM.JN)+Jo(uM.JO),'aZyay':Jo(uM.Jw)+Jo(uM.Ja)+Jo(uM.Jg),'uSNsZ':Jo(uM.Jz),'iFCWa':Jo(uM.JQ),'GLmXa':Jo(uM.Jk),'BfqiM':Jo(uM.JR),'rkmSo':Jo(uM.JY)+Jo(uM.Jj)+'_','gOcaG':function(J2,J3){return J2|J3;},'CAubo':function(J2,J3){return J2|J3;},'ELTqm':function(J2,J3){return J2|J3;},'AaNMj':function(J2,J3){return J2<<J3;},'UYbnW':function(J2,J3){return J2<J3;},'FVYZA':function(J2,J3){return J2<<J3;},'ngIjD':function(J2,J3){return J2<<J3;},'tJhBk':function(J2,J3){return J2(J3);},'DarFR':function(J2,J3){return J2<<J3;},'BQKMX':function(J2,J3){return J2(J3);},'MQFAI':function(J2,J3){return J2(J3);},'NUVIs':function(J2,J3){return J2<<J3;},'tfqUJ':function(J2,J3){return J2<<J3;},'uAZPZ':function(J2,J3){return J2(J3);},'vrbbZ':function(J2,J3){return J2(J3);},'zKTSC':Jo(uM.JV),'hLygO':Jo(uM.JS),'hUoqK':Jo(uM.Jy),'SVvng':Jo(uM.JC),'jhrUY':Jo(uM.Jq),'utTZE':Jo(uM.Ji),'ThMax':Jo(uM.JM),'LehQr':Jo(uM.Jr)+'_','aLsJG':Jo(uM.Je),'drSSb':Jo(uM.ur),'ILhLZ':function(J2,J3){return J2+J3;},'wzRkQ':function(J2,J3){return J2+J3;},'KsNZz':Jo(uM.ue),'ScArL':Jo(uM.uW)+Jo(uM.uo),'uUrny':function(J2,J3){return J2(J3);},'WXjKb':function(J2,J3){return J2(J3);},'fwDQd':function(J2,J3){return J2+J3;},'MBkRk':function(J2,J3){return J2+J3;},'UJxEQ':function(J2,J3){return J2-J3;},'flSHo':function(J2,J3){return J2-J3;},'RIMqV':function(J2,J3){return J2+J3;},'Tntdh':function(J2,J3){return J2+J3;},'DZZqP':function(J2,J3){return J2-J3;},'nwZAO':Jo(uM.ul),'glBPw':Jo(uM.uZ),'DnrVj':function(J2,J3){return J2===J3;},'kmhdg':function(J2,J3){return J2+J3;},'WOaTW':function(J2,J3){return J2!=J3;},'hpbIa':function(J2,J3){return J2+J3;},'sYQUE':function(J2,J3){return J2==J3;},'NVFFT':function(J2,J3){return J2(J3);},'NkbIw':Jo(uM.uH),'mumpB':Jo(uM.uA),'iBbwW':Jo(uM.un),'caDTj':function(J2){return J2();},'SSIVX':Jo(uM.um),'ZSvXK':function(J2,J3,J4){return J2(J3,J4);},'rScER':function(J2){return J2();},'PUvAV':function(J2,J3){return J2==J3;},'CMUVh':Jo(uM.uK),'HWger':function(J2,J3){return J2<J3;},'ipmJd':Jo(uM.uT),'KFXJV':Jo(uM.uX),'gqMsx':Jo(uM.uI)+Jo(uM.ux)+Jo(uM.uh)+Jo(uM.E0),'UMALL':function(J2,J3){return J2<J3;},'QmwrY':Jo(uM.E1)+Jo(uM.E2)+'e','Vmlkq':Jo(uM.E3),'jCbCe':function(J2,J3){return J2<J3;},'kymKu':Jo(uM.E4),'dxCGV':Jo(uM.E5)+Jo(uM.E6)+'标识','WuTZw':function(J2,J3){return J2==J3;},'QRREv':Jo(uM.E7),'vvByX':Jo(uM.E8),'VFdCZ':function(J2,J3){return J2<J3;},'gGwlW':Jo(uM.E9),'DKNnQ':Jo(uM.EJ),'xKhyH':Jo(uM.Ef),'iNCaP':function(J2,J3){return J2===J3;},'MXGtz':Jo(uM.EF),'mmqze':Jo(uM.Et)+Jo(uM.EU),'GQnTk':Jo(uM.Es),'FfyYX':function(J2,J3){return J2+J3;},'EeaEA':function(J2,J3){return J2+J3;},'iJMLM':Jo(uM.Ed)+Jo(uM.EP)+Jo(uM.EB),'DmpaM':Jo(uM.Eb),'jAEAk':function(J2,J3){return J2===J3;},'SDByn':function(J2,J3){return J2==J3;},'KyrXE':Jo(uM.Eu),'ILoyl':function(J2,J3){return J2!==J3;},'pnlpT':function(J2,J3){return J2===J3;},'bDjhe':function(J2,J3){return J2<J3;},'lmQuA':Jo(uM.EE)+Jo(uM.EL)+Jo(uM.Ep),'grXKL':Jo(uM.EE)+Jo(uM.Ev)+Jo(uM.Ec),'diIkm':function(J2,J3){return J2<J3;},'UWbix':Jo(uM.ED),'cHVDg':function(J2,J3){return J2==J3;},'LuFPM':Jo(uM.EG)+'d\x22','yJyDe':Jo(uM.EN),'TaQbR':Jo(uM.EO)+Jo(uM.Ew)+Jo(uM.Ea)+Jo(uM.Eg)+Jo(uM.Ez)+Jo(uM.EQ)+Jo(uM.Ek)+Jo(uM.ER)+Jo(uM.EY)+Jo(uM.Ej)+Jo(uM.EV)+Jo(uM.ES)+Jo(uM.Ey)+Jo(uM.EC)+Jo(uM.Eq)+Jo(uM.Ei)+Jo(uM.EM)+Jo(uM.Er)+Jo(uM.Ee)+Jo(uM.EW)+Jo(uM.Eo)+Jo(uM.El)+Jo(uM.EZ)+Jo(uM.EH)+Jo(uM.EA)+Jo(uM.En)+Jo(uM.Em)+Jo(uM.EK)+Jo(uM.ET)+Jo(uM.EX)+Jo(uM.EI)+Jo(uM.Ex)+Jo(uM.Eh),'fFvlv':function(J2,J3){return J2*J3;},'FLwCB':function(J2,J3){return J2+J3;},'mBdeq':function(J2,J3){return J2+J3;},'PPhau':function(J2,J3){return J2+J3;},'ySCJr':function(J2,J3){return J2+J3;},'peoOl':function(J2,J3){return J2+J3;},'wLyVR':function(J2,J3){return J2+J3;},'lJdZo':function(J2,J3){return J2+J3;},'todNK':function(J2,J3){return J2+J3;},'rDTEj':function(J2,J3){return J2+J3;},'sYlql':function(J2,J3){return J2+J3;},'ZjPil':function(J2,J3){return J2+J3;},'vEbys':function(J2,J3){return J2+J3;},'IXJrz':function(J2,J3){return J2+J3;},'QOazI':function(J2,J3){return J2+J3;},'nAzXf':function(J2,J3){return J2+J3;},'QPwKd':function(J2,J3){return J2+J3;},'pQKWN':function(J2,J3){return J2+J3;},'ykLPy':function(J2,J3){return J2+J3;},'yVtVt':function(J2,J3){return J2+J3;},'INnro':function(J2,J3){return J2+J3;},'wyawy':function(J2,J3){return J2+J3;},'DTYlG':function(J2,J3){return J2+J3;},'pUKRQ':function(J2,J3){return J2+J3;},'QCSXg':function(J2,J3){return J2+J3;},'jHTvO':Jo(uM.L0)+Jo(uM.L1)+Jo(uM.L2)+Jo(uM.L3)+Jo(uM.L4)+Jo(uM.L5)+Jo(uM.L6)+Jo(uM.L7)+Jo(uM.L8)+Jo(uM.L9)+Jo(uM.LJ)+Jo(uM.Lf)+Jo(uM.LF)+Jo(uM.Lt)+Jo(uM.LU)+Jo(uM.Ls)+Jo(uM.Ld)+Jo(uM.LP)+Jo(uM.LB)+Jo(uM.Lb)+Jo(uM.Lu)+Jo(uM.LE)+Jo(uM.LL)+Jo(uM.Lp)+Jo(uM.Lv)+Jo(uM.Lc)+Jo(uM.LD)+Jo(uM.LG)+Jo(uM.LN)+Jo(uM.LO)+Jo(uM.ES)+Jo(uM.Lw)+Jo(uM.La),'UyGAQ':function(J2,J3){return J2*J3;},'EjsNI':Jo(uM.Lg)+Jo(uM.Lz)+Jo(uM.LQ)+Jo(uM.Lk)+Jo(uM.LR)+Jo(uM.LY)+Jo(uM.Lj)+Jo(uM.LV)+Jo(uM.LS)+Jo(uM.Ly)+Jo(uM.LC),'PemMN':function(J2,J3){return J2*J3;},'fmrVX':Jo(uM.Lq)+Jo(uM.Li)+Jo(uM.LM)+Jo(uM.Lr)+Jo(uM.Le)+Jo(uM.LW)+Jo(uM.Lo),'dZGmA':Jo(uM.Ll)+Jo(uM.LZ),'UWopK':function(J2,J3){return J2*J3;},'PQuce':Jo(uM.LH)+Jo(uM.LA)+Jo(uM.Ln)+Jo(uM.Lm)+Jo(uM.LK)+Jo(uM.LT)+Jo(uM.LX)+Jo(uM.LI)+Jo(uM.Lx)+Jo(uM.Lh),'VKpyI':Jo(uM.p0)+Jo(uM.p1)+Jo(uM.p2)+Jo(uM.p3)+Jo(uM.p4)+Jo(uM.p5)+Jo(uM.p6)+Jo(uM.p7)+'p:','rpuyw':Jo(uM.p0)+Jo(uM.p8)+Jo(uM.p9)+Jo(uM.pJ)+Jo(uM.pf)+Jo(uM.pF)+Jo(uM.pt)+Jo(uM.pU)+Jo(uM.ps)+Jo(uM.pd)+Jo(uM.pP)+Jo(uM.pB)+Jo(uM.pb)+Jo(uM.pu)+Jo(uM.pE)+Jo(uM.pL)+Jo(uM.pp)+Jo(uM.pv)+'h:','wVBKQ':function(J2,J3){return J2*J3;},'JacKI':Jo(uM.pc)+Jo(uM.pD),'TxJdC':Jo(uM.pc)+Jo(uM.pG)+Jo(uM.pN),'SSacD':Jo(uM.LH)+Jo(uM.pO)+Jo(uM.pw)+Jo(uM.pa)+':','JXRpl':Jo(uM.pc)+Jo(uM.pg)+Jo(uM.pz)+Jo(uM.pQ)+Jo(uM.pk)+Jo(uM.pR)+Jo(uM.pY)+Jo(uM.pj)+Jo(uM.pV)+Jo(uM.pS)+Jo(uM.py),'GkRaZ':function(J2,J3){return J2*J3;},'tIpFK':function(J2,J3){return J2*J3;},'wmCjK':Jo(uM.pC)+Jo(uM.pg)+Jo(uM.pq)+Jo(uM.pi)+Jo(uM.pM)+Jo(uM.pr)+Jo(uM.pe)+Jo(uM.pW)+Jo(uM.po),'QHnaI':function(J2,J3){return J2*J3;},'fbmoD':Jo(uM.pl)+Jo(uM.pZ)+Jo(uM.pH)+Jo(uM.pA)+Jo(uM.pn),'KVfat':function(J2,J3){return J2*J3;},'gpgPT':Jo(uM.pm)+Jo(uM.pK)+Jo(uM.pT),'tmQAc':Jo(uM.pl)+Jo(uM.pX)+Jo(uM.po),'xrhch':function(J2,J3){return J2*J3;},'CujDy':Jo(uM.pI)+Jo(uM.pg)+Jo(uM.px)+Jo(uM.ph)+Jo(uM.v0)+Jo(uM.v1)+Jo(uM.v2)+Jo(uM.v3)+Jo(uM.v4)+Jo(uM.v5)+Jo(uM.v6)+Jo(uM.v7)+Jo(uM.v8)+Jo(uM.v9)+Jo(uM.vJ)+Jo(uM.vf)+Jo(uM.vF)+Jo(uM.vt)+Jo(uM.vU),'KABnV':Jo(uM.vs)+Jo(uM.vd),'PsGnU':Jo(uM.EO)+Jo(uM.Ew)+Jo(uM.vP)+Jo(uM.vB)+Jo(uM.vb)+Jo(uM.vu)+Jo(uM.vE)+Jo(uM.vL)+Jo(uM.vp)+Jo(uM.vv)+Jo(uM.vc)+Jo(uM.vD)+Jo(uM.vG)+Jo(uM.vN)+Jo(uM.vO)+Jo(uM.vw)+Jo(uM.va)+Jo(uM.vg)+Jo(uM.vz)+Jo(uM.vQ)+Jo(uM.vk)+Jo(uM.vR)+Jo(uM.vY)+Jo(uM.vj)+Jo(uM.vV)+Jo(uM.vS)+Jo(uM.vy)+Jo(uM.vC)+Jo(uM.vq)+Jo(uM.vi)+Jo(uM.vM)+Jo(uM.vr)+Jo(uM.ve)+Jo(uM.vW)+Jo(uM.vo)+Jo(uM.vl)+'v>','NaaDo':Jo(uM.vZ)+Jo(uM.L1)+Jo(uM.vH)+Jo(uM.vA)+Jo(uM.vn)+Jo(uM.vm)+Jo(uM.vK)+Jo(uM.L7)+Jo(uM.vT)+Jo(uM.L9)+Jo(uM.vX)+Jo(uM.vI)+Jo(uM.vx)+Jo(uM.vh)+Jo(uM.c0)+Jo(uM.c1)+Jo(uM.c2)+Jo(uM.c3)+Jo(uM.c4)+Jo(uM.c5)+Jo(uM.Lp)+Jo(uM.c6)+Jo(uM.c7)+Jo(uM.c8)+Jo(uM.Lf)+Jo(uM.c9)+Jo(uM.cJ)+Jo(uM.cf)+Jo(uM.cF)+Jo(uM.ct)+Jo(uM.cU)+Jo(uM.cs)+Jo(uM.cP)+Jo(uM.cB)+Jo(uM.L0)+Jo(uM.cb)+Jo(uM.cu)+Jo(uM.cE)+Jo(uM.cL)+Jo(uM.cp)+Jo(uM.cv)+Jo(uM.cc)+Jo(uM.cD)+Jo(uM.cG)+Jo(uM.cN)+Jo(uM.cO)+Jo(uM.cw)+Jo(uM.ca)+Jo(uM.cg)+Jo(uM.LS)+Jo(uM.cz)+Jo(uM.cQ)+Jo(uM.ck)+Jo(uM.cR)+Jo(uM.cY)+Jo(uM.cj)+Jo(uM.cV)+Jo(uM.cS)+Jo(uM.cy)+Jo(uM.cC)+Jo(uM.cq)+Jo(uM.ci)+Jo(uM.cM)+Jo(uM.cr)+Jo(uM.ce)+Jo(uM.cW)+Jo(uM.co)+Jo(uM.cl)+Jo(uM.cZ)+Jo(uM.cH)+Jo(uM.cA)+Jo(uM.cn)+Jo(uM.cm)+Jo(uM.cK)+Jo(uM.cT)+Jo(uM.cX)+Jo(uM.cI)+Jo(uM.cx)+Jo(uM.ch)+Jo(uM.cZ)+Jo(uM.D0)+Jo(uM.D1)+Jo(uM.D2)+Jo(uM.D3)+Jo(uM.D4)+Jo(uM.D5)+Jo(uM.D6)+Jo(uM.D7)+Jo(uM.D8)+Jo(uM.D9)+Jo(uM.DJ)+Jo(uM.Df)+Jo(uM.DF)+Jo(uM.Dt)+Jo(uM.DU)+Jo(uM.pf)+Jo(uM.Ds)+Jo(uM.pt)+Jo(uM.Dd)+Jo(uM.DP)+(Jo(uM.pz)+Jo(uM.DB)+Jo(uM.Db)+Jo(uM.Du)+Jo(uM.DE)+Jo(uM.DL)+Jo(uM.Dp)+Jo(uM.Dv)+Jo(uM.Dc)+Jo(uM.DD)+Jo(uM.pW)+Jo(uM.DG)+Jo(uM.DN)+Jo(uM.cC)+Jo(uM.DO)+Jo(uM.Dw)+Jo(uM.c3)+Jo(uM.Da)+Jo(uM.Dg)+Jo(uM.Dz)+Jo(uM.v4)+Jo(uM.DQ)+Jo(uM.Dk)+Jo(uM.DR)+Jo(uM.DN)+Jo(uM.DY)+Jo(uM.Dj)+Jo(uM.DV)+Jo(uM.DN)+Jo(uM.DS)+Jo(uM.Dy)+Jo(uM.DC)+Jo(uM.Dq)+Jo(uM.Di)+Jo(uM.DM)+Jo(uM.Dr)+Jo(uM.De)+Jo(uM.DW)+Jo(uM.Do)+Jo(uM.Dy)+Jo(uM.Dl)+Jo(uM.pf)+Jo(uM.DZ)+Jo(uM.DH)+Jo(uM.DA)+Jo(uM.Dn)+Jo(uM.Dm)+Jo(uM.DK)+Jo(uM.DT)+Jo(uM.DX)+Jo(uM.DI)+Jo(uM.Dx)+Jo(uM.Dh)+Jo(uM.G0)+Jo(uM.Df)+Jo(uM.G1)+Jo(uM.G2)+Jo(uM.G3)+Jo(uM.G4)+Jo(uM.G5)+Jo(uM.G6)+Jo(uM.G7)+Jo(uM.G8)+Jo(uM.G9)+Jo(uM.GJ)+Jo(uM.Gf)+Jo(uM.GF)+Jo(uM.Gt)+Jo(uM.GU)+Jo(uM.Gs)+Jo(uM.Gd)+Jo(uM.GP)+Jo(uM.GB)+Jo(uM.Gb)),'dfBCb':Jo(uM.Gu),'OqRDw':Jo(uM.GE),'jtJYe':Jo(uM.DX)+'ck','LniwM':function(J2,J3){return J2+J3;},'KTTLz':function(J2,J3){return J2==J3;},'XYHUp':Jo(uM.GL)+Jo(uM.Gp)+Jo(uM.Gv)+Jo(uM.Gc)+Jo(uM.GD)+Jo(uM.GG)+Jo(uM.GN),'wLJLW':function(J2,J3){return J2+J3;},'zcLbw':Jo(uM.GO)+Jo(uM.Gw)+Jo(uM.Ga)+Jo(uM.Gg),'pZdzZ':function(J2,J3){return J2 in J3;},'swXXM':Jo(uM.Gz),'WyBYz':Jo(uM.GQ)+'+$','nXOZk':function(J2){return J2();},'hHknb':function(J2,J3){return J2(J3);},'cVaCq':function(J2){return J2();},'LqNep':Jo(uM.Gk),'zReIw':Jo(uM.GR),'kNmOz':Jo(uM.GY),'CigeZ':Jo(uM.Gj)+'pe','fPXMz':function(J2,J3){return J2!=J3;},'nVfyM':Jo(uM.GV)+Jo(uM.GS),'vppEF':Jo(uM.Gy),'ZIAiq':function(J2,J3){return J2<J3;},'bpdLz':Jo(uM.GC),'wddUS':Jo(uM.Gq)+Jo(uM.Gi)+Jo(uM.GM)+Jo(uM.Gr)+Jo(uM.Ge)+Jo(uM.GW)+Jo(uM.Go)+Jo(uM.Gl)+Jo(uM.GZ),'bobzF':Jo(uM.GH),'aIPbw':Jo(uM.GA),'LgIZt':Jo(uM.Gn),'NPyFJ':Jo(uM.Gm),'swBsQ':Jo(uM.GK),'okZPu':Jo(uM.GT),'OwEBW':Jo(uM.GX),'EDiDU':Jo(uM.GI)+'pe','rnjEO':Jo(uM.Gx),'tpKhM':Jo(uM.Gh)+'xt','iOntI':function(J2,J3){return J2(J3);},'TSlCC':Jo(uM.N0),'XGhZj':function(J2,J3){return J2(J3);},'WzBKI':function(J2,J3){return J2 instanceof J3;},'AKBmT':Jo(uM.N1)+'n','asFoQ':Jo(uM.N2),'SouRS':Jo(uM.N3),'wRevj':Jo(uM.N4)+Jo(uM.N5),'JZUcQ':Jo(uM.N6)+Jo(uM.N7)+Jo(uM.N8)+Jo(uM.N9)+Jo(uM.NJ),'lEYMq':Jo(uM.Nf)+Jo(uM.NF),'hhhXi':Jo(uM.Le)+'le','oirbx':Jo(uM.ES)+Jo(uM.Nt)+'n','XCXWi':Jo(uM.NU)+Jo(uM.Ns),'mwaaZ':function(J2,J3){return J2(J3);},'rADHb':function(J2,J3,J4){return J2(J3,J4);},'lfKPU':function(J2,J3){return J2==J3;},'lOVhT':Jo(uM.Nd),'Rjneo':Jo(uM.NP),'ofbvB':function(J2,J3){return J2/J3;},'gszcP':Jo(uM.NB),'XrRae':Jo(uM.Nb),'gOKst':Jo(uM.Nu),'DsLxj':Jo(uM.NE),'TlzyQ':Jo(uM.NL),'pqRQE':Jo(uM.Np)+'5','AOeyG':Jo(uM.p5)+Jo(uM.Nv),'WxALS':function(J2,J3){return J2+J3;},'DZCnm':function(J2,J3){return J2==J3;},'cruGI':Jo(uM.Nc),'LGVeL':Jo(uM.ND),'Axdzt':function(J2,J3){return J2(J3);},'UkxLu':function(J2,J3){return J2<=J3;},'mRwnp':function(J2,J3){return J2<J3;},'xzANc':function(J2,J3){return J2!=J3;},'dShyr':Jo(uM.NG),'vcprR':Jo(uM.NN),'Pdzgk':Jo(uM.NO),'bzJHj':Jo(uM.Nw),'HMBGM':Jo(uM.Na)+Jo(uM.Ng),'yRypV':function(J2,J3){return J2==J3;},'EMLYl':Jo(uM.Na)+Jo(uM.Nz),'MmNOM':function(J2,J3,J4){return J2(J3,J4);},'xWksR':function(J2){return J2();},'AJLEd':function(J2,J3){return J2(J3);},'ZfEKX':Jo(uM.NQ)+Jo(uM.Nk),'hGhZX':Jo(uM.NR)+Jo(uM.NY),'jjiYx':Jo(uM.Nj)+Jo(uM.NV),'wueFp':Jo(uM.NS),'KOqVu':function(J2,J3){return J2(J3);},'spCts':function(J2,J3){return J2(J3);}},f=(function(){var dx={J:0x410},J2=!![];return function(J3,J4){var J5=J2?function(){var Jl=U;if(J4){var J6=J4[Jl(dx.J)](J3,arguments);return J4=null,J6;}}:function(){};return J2=![],J5;};}()),h={0x2d1:function(J2,J3,J4){var P9={J:0x3df},P8={J:0x2bb},P7={J:0x3a9},P6={J:0x2bb},P3={J:0x3dd},P2={J:0x678},JZ=Jo,J5={'XanTw':J[JZ(Pf.J)],'qZaVB':J[JZ(Pf.f)],'OAnbv':function(J7,J8){var JH=JZ;return J[JH(P2.J)](J7,J8);},'JLQVt':function(J7,J8){var JA=JZ;return J[JA(P3.J)](J7,J8);},'VyLzG':function(J7,J8){var Jn=JZ;return J[Jn(P4.J)](J7,J8);},'vCzWd':function(J7,J8){var Jm=JZ;return J[Jm(P5.J)](J7,J8);},'HoptG':function(J7,J8,J9){var JK=JZ;return J[JK(P6.J)](J7,J8,J9);},'QVlSQ':function(J7,J8){var JT=JZ;return J[JT(P7.J)](J7,J8);},'uYwTh':function(J7,J8,J9){var JX=JZ;return J[JX(P8.J)](J7,J8,J9);},'HgEVe':function(J7,J8,J9,JJ){var JI=JZ;return J[JI(P9.J)](J7,J8,J9,JJ);},'WrGSi':J[JZ(Pf.F)]},J6=J[JZ(Pf.h)](J4,-0x1*-0xe09+0x48b+-0x1*0x10e7)['s'];J2[JZ(Pf.J0)]={'d':function(J7){var Jx=JZ;for(var J8=JSON[Jx(PJ.J)](J5[Jx(PJ.f)]),J9=J5[Jx(PJ.F)],JJ=[],Jf='',JF='',Jt=-0x1731*-0x1+-0xa3d*-0x2+0x7*-0x63d;J5[Jx(PJ.h)](Jt,J7[Jx(PJ.J0)]);Jt++)for(var JU=J7[Jt],Js=-0x87c+-0xa*0x1f7+0x115*0x1a;J5[Jx(PJ.J1)](Js,J8[Jx(PJ.J2)]);Js++)J5[Jx(PJ.J3)](J8[Js],J5[Jx(PJ.J4)](Jt,0x3b0+-0x188a+0x14db))&&(JJ[Js]=JU);for(Jf=JJ[Jx(PJ.J5)](''),Jt=-0x5*0x7b5+0x15e3+0x10a6;J5[Jx(PJ.J1)](Jt,Jf[Jx(PJ.J2)])&&J5[Jx(PJ.J1)](Jt,J9[Jx(PJ.J6)]);Jt+=-0x1f83+0x1c1f+0x5*0xae){var Jd=J5[Jx(PJ.J7)](J5[Jx(PJ.J8)](parseInt,Jf[Jx(PJ.J9)](Jt,J5[Jx(PJ.JJ)](Jt,0x1*0x1fdc+0x1d48+-0x61d*0xa)),0x1eb*0xd+-0x16d7+-0x208),J5[Jx(PJ.Jf)](parseInt,J9[Jx(PJ.J9)](Jt,J5[Jx(PJ.JF)](Jt,-0x25*0xbe+-0x445+0x1fbd)),-0x572+0x14ac+0x50e*-0x3))[Jx(PJ.Jt)](0x9e5+0x1d2a+-0x26ff);JF+=Jd=J5[Jx(PJ.J3)](0x2*-0x854+0xd1d+0x38c,Jd[Jx(PJ.J2)])?J5[Jx(PJ.JJ)]('0',Jd):Jd;}J5[Jx(PJ.JU)](J6,J5[Jx(PJ.Js)],JF,0x144bd9+0x1ead06+-0x3f5a1*-0x1);}};},0x3a:function(J2,J3,J4){'use strict';var PK={J:0x413,f:0x480,F:0x450,h:0x29c,J0:0x29c,J1:0x644,J2:0x39c,J3:0x3f1},PA={J:0x3a3,f:0x54d,F:0x3e6,h:0x450,J0:0x68d,J1:0x348,J2:0x3a9,J3:0x3dd,J4:0x1e9,J5:0x3e2},PZ={J:0x491,f:0x309,F:0x455,h:0x3b8,J0:0x460,J1:0x4dc,J2:0x549,J3:0x4dc,J4:0x549,J5:0x552,J6:0x420,J7:0x35f,J8:0x2fb,J9:0x1e6,JJ:0x50e,Jf:0x4f4,JF:0x35b,Jt:0x61d,JU:0x282,Js:0x469,Jd:0x469,JP:0x40e,JB:0x282,Jb:0x40e,Ju:0x31f,JE:0x4cb,JL:0x282,Jp:0x2d5,Jv:0x31f,Jc:0x4f3,JD:0x4cb,JG:0x3ec,JN:0x480,JO:0x413,Jw:0x2bc,Ja:0x301,Jg:0x25b,Jz:0x61d,JQ:0x643,Jk:0x4b4,JR:0x413,JY:0x401,Jj:0x376,JV:0x657,JS:0x376,Jy:0x30f,JC:0x363,Jq:0x5ab,Ji:0x4d6,JM:0x55a,Jr:0x413,Je:0x299,PH:0x4b4,PA:0x58e,Pn:0x5f7,Pm:0x385,PK:0x5f4,PT:0x25e,PX:0x2bc,PI:0x619,Px:0x44e,Ph:0x24e,B0:0x4b4,B1:0x1db,B2:0x498,B3:0x5bc,B4:0x512,B5:0x4a3,B6:0x4ce,B7:0x694,B8:0x5a3,B9:0x352},PW={J:0x50e,f:0x658,F:0x5a4},PM={J:0x602},Py={J:0x2a8},PS={J:0x2e5},PV={J:0x573},Pj={J:0x4c1},Pk={J:0x2f3},Pz={J:0x2f3},Pw={J:0x2a0},PG={J:0x3fb},Pc={J:0x459},Pv={J:0x2cb},PL={J:0x56e},PE={J:0x675},Pu={J:0x675},Pb={J:0x2c5},PB={J:0x386},PP={J:0x5cd},PU={J:0x411},PF={J:0x627},f0=Jo,J5={'vXYMa':function(Jd,JP){var Jh=U;return J[Jh(PF.J)](Jd,JP);},'oDqWX':J[f0(PI.J)],'LxCeS':function(Jd,JP){var f1=f0;return J[f1(Pt.J)](Jd,JP);},'cTvaF':J[f0(PI.f)],'ANvJb':J[f0(PI.F)],'lFhyu':J[f0(PI.h)],'tWHxA':J[f0(PI.J0)],'VomEA':J[f0(PI.J1)],'wGmqw':J[f0(PI.J2)],'tlkfn':function(Jd,JP){var f2=f0;return J[f2(PU.J)](Jd,JP);},'gmYgG':function(Jd,JP){var f3=f0;return J[f3(Ps.J)](Jd,JP);},'GZfsj':function(Jd,JP){var f4=f0;return J[f4(Pd.J)](Jd,JP);},'heAjZ':function(Jd,JP){var f5=f0;return J[f5(PP.J)](Jd,JP);},'UjrtT':function(Jd,JP){var f6=f0;return J[f6(PB.J)](Jd,JP);},'BzmpB':function(Jd,JP){var f7=f0;return J[f7(Pb.J)](Jd,JP);},'TjoAV':function(Jd,JP){var f8=f0;return J[f8(Pu.J)](Jd,JP);},'LPwei':function(Jd,JP){var f9=f0;return J[f9(PE.J)](Jd,JP);},'xzuif':function(Jd,JP){var fJ=f0;return J[fJ(PL.J)](Jd,JP);},'DmVyf':function(Jd,JP){var ff=f0;return J[ff(Pp.J)](Jd,JP);},'fWATe':function(Jd,JP){var fF=f0;return J[fF(Pv.J)](Jd,JP);},'rLfKc':function(Jd,JP){var ft=f0;return J[ft(Pc.J)](Jd,JP);},'NqstF':function(Jd,JP){var fU=f0;return J[fU(PD.J)](Jd,JP);},'LrYAt':function(Jd,JP){var fs=f0;return J[fs(PG.J)](Jd,JP);},'qaqsg':function(Jd,JP){var fd=f0;return J[fd(PN.J)](Jd,JP);},'cFUgU':function(Jd,JP){var fP=f0;return J[fP(PO.J)](Jd,JP);},'aczRR':function(Jd,JP){var fB=f0;return J[fB(Pw.J)](Jd,JP);},'EGuIE':function(Jd,JP){var fb=f0;return J[fb(Pa.J)](Jd,JP);},'qarYb':function(Jd,JP){var fu=f0;return J[fu(Pg.J)](Jd,JP);},'EwdmT':function(Jd,JP){var fE=f0;return J[fE(Pz.J)](Jd,JP);},'FJpZS':function(Jd,JP){var fL=f0;return J[fL(PQ.J)](Jd,JP);},'JCgcF':function(Jd,JP){var fp=f0;return J[fp(Pk.J)](Jd,JP);},'ZTeUf':function(Jd,JP){var fv=f0;return J[fv(PR.J)](Jd,JP);},'bqboU':function(Jd,JP){var fc=f0;return J[fc(PY.J)](Jd,JP);},'OKUcC':function(Jd,JP){var fD=f0;return J[fD(Pj.J)](Jd,JP);},'FDuvg':function(Jd,JP){var fG=f0;return J[fG(PV.J)](Jd,JP);},'CQTWt':function(Jd,JP){var fN=f0;return J[fN(PS.J)](Jd,JP);},'GrjDA':function(Jd,JP){var fO=f0;return J[fO(Py.J)](Jd,JP);},'iCTvG':function(Jd,JP){var fw=f0;return J[fw(PC.J)](Jd,JP);}};var J6={};J6['P']=function(){return Js;},J4['d'](J3,J6);var J7,J8=J[f0(PI.J3)](J4,0x118f*-0x1+-0x1f8d*-0x1+-0xd54);function J9(Jd){var Po={J:0x1ef},Pe={J:0x260,f:0x1e2,F:0x517,h:0x616,J0:0x420,J1:0x35f,J2:0x3f7,J3:0x420,J4:0x201,J5:0x22b},Pi={J:0x602},fg=f0,JP={'VouhA':function(Jc,JD){var fa=U;return J5[fa(Pi.J)](Jc,JD);},'EkjoC':J5[fg(PZ.J)],'FMqwS':J5[fg(PZ.f)],'SPtUY':J5[fg(PZ.F)],'NBwLl':J5[fg(PZ.h)],'VKWrf':function(Jc,JD){var fz=fg;return J5[fz(PM.J)](Jc,JD);}};function JB(Jc){return Jc?-0xbd2*-0x2+0x1*0x737+-0x1eda:-0xef1+0x2e*-0x2b+0x16ab;}var Jb='';try{Jb=J8['B'][fg(PZ.J0)+fg(PZ.J1)][fg(PZ.J2)+'te']&&J8['B'][fg(PZ.J0)+fg(PZ.J3)][fg(PZ.J4)+'te'](J5[fg(PZ.J5)]);}catch(Jc){}var Ju,JE=-0x21db+0x1b5*0xf+-0x420*-0x2,JL=(J8['b'][fg(PZ.J6)+fg(PZ.J7)]&&Object[fg(PZ.J8)](J8['B'])[fg(PZ.J9)](function(JD){var fQ=fg,JG=J8['b'][fQ(Pe.J)][JD];(JP[fQ(Pe.f)](0x77*-0x1f+0x14b3+0xe6*-0x7,JD[fQ(Pe.F)](JP[fQ(Pe.h)]))||JG&&JG[fQ(Pe.J0)+fQ(Pe.J1)](JP[fQ(Pe.J2)])&&JG[fQ(Pe.J3)+fQ(Pe.J1)](JP[fQ(Pe.J4)])&&JG[fQ(Pe.J3)+fQ(Pe.J1)](JP[fQ(Pe.J5)]))&&(JE=-0x1c27+-0x22c4+0x3eec);}),J5[fg(PZ.JJ)](-0x151f*-0x1+-0x16bb+0x19d*0x1,JE)&&(Ju=new RegExp(J5[fg(PZ.Jf)]),Object[fg(PZ.J8)](J8['b'])[fg(PZ.J9)](function(JD){var fk=fg;J5[fk(PW.J)](J5[fk(PW.f)],JD)&&!Ju[fk(PW.F)](JD)||(JE=-0x1*-0xae7+-0x287+-0x85f);})),new Date()),Jp=-0x1023+-0x1*0x26b+0x1*0x128e;JL[fg(PZ.JF)]=function(){var fR=fg;if(JP[fR(Po.J)](0x26ed+-0x21c6+-0x525,++Jp))return'';},J7&&J5[fg(PZ.Jt)](J7,JL);var Jv=0x2184+0xc7f*0x1+-0x2e03*0x1,Jv=J5[fg(PZ.JU)](Jv=J5[fg(PZ.Js)](Jv=J5[fg(PZ.Jd)](Jv=J5[fg(PZ.JP)](Jv=J5[fg(PZ.JB)](Jv=J5[fg(PZ.Jb)](Jv=J5[fg(PZ.Jb)](Jv=J5[fg(PZ.Ju)](Jv=J5[fg(PZ.JE)](J5[fg(PZ.Js)](Jv=J5[fg(PZ.JL)](Jv=J5[fg(PZ.Jp)](Jv=J5[fg(PZ.Jv)](Jv=J5[fg(PZ.JB)](Jv=J5[fg(PZ.Jc)](Jv=J5[fg(PZ.JD)](Jv|=J5[fg(PZ.JG)]((J5[fg(PZ.JN)](0x1641*0x1+0x12b5+-0x28f5,Jp)?-0x1*0x1d92+-0x2045+0x3dd8*0x1:-0x1509+-0x4*-0x2ce+0x9d1)?0xd*-0x29b+-0x1*0x3dc+-0xc*-0x325:-0x19b4+0xb*-0x77+-0x17*-0x157,-0x636+-0xb2d*0x1+-0x1163*-0x1),J5[fg(PZ.JG)](J5[fg(PZ.JO)](JB,J8['u'][fg(PZ.Jw)]),0x745+-0x888+-0xc*-0x1b)),J5[fg(PZ.Ja)](JE?0x9*-0x59+-0x6f1+0xa13:-0x24e2+-0x1f52*-0x1+0x590,0x1*0x4d6+-0xae6+0x612)),J5[fg(PZ.Jg)](J5[fg(PZ.Jz)](JB,J8['b'][fg(PZ.JQ)]),-0x221+0x1b57+-0x1*0x1933)),J5[fg(PZ.Jk)](J5[fg(PZ.JR)](JB,J8['b'][fg(PZ.JY)+'m']),0x2*0xd7f+-0x7e4+-0x1316)),J5[fg(PZ.Jk)](J5[fg(PZ.Jj)](JB,J8['b'][fg(PZ.JV)]),-0x1b6c+0xe28+0xd49)),J5[fg(PZ.Jg)](J5[fg(PZ.JS)](JB,J8['b'][fg(PZ.Jy)]),0x689+-0x148d*-0x1+-0x1*0x1b10)),J5[fg(PZ.JC)](J5[fg(PZ.Jz)](JB,J8['b'][fg(PZ.Jq)]),-0xd*0x220+0x19a*0x5+0x13a5)),J5[fg(PZ.Ji)](Jb?-0x13*-0x97+-0x338*0xb+-0x4*-0x60d:-0x1315+-0xe*-0x245+-0xcb1,0xe13+0x1fb*-0x9+0x3c8)),J5[fg(PZ.JM)](J5[fg(PZ.Jr)](JB,J8['b'][fg(PZ.Je)]),0xc80+-0x121f*-0x1+-0x10e*0x1d)),J5[fg(PZ.PH)](J5[fg(PZ.PA)](JB,J8['b'][fg(PZ.Pn)+fg(PZ.Pm)]),0xf71*-0x1+-0xfd9+0x191*0x14)),J5[fg(PZ.PK)](J5[fg(PZ.PT)](JB,J8['b'][fg(PZ.PX)]),0x991*-0x1+0x2046+-0x16aa)),J5[fg(PZ.PI)](J5[fg(PZ.JS)](JB,J8['B'][fg(PZ.Px)+fg(PZ.Ph)+'n']),0x2672+-0x1*0xf5b+-0x170b)),J5[fg(PZ.B0)](J5[fg(PZ.B1)](JB,J8['b'][fg(PZ.B2)+'d']),0x2*0xac5+-0x5e*0x62+-0x4d5*-0x3)),J5[fg(PZ.B3)](J5[fg(PZ.PT)](JB,J8['b'][fg(PZ.B4)+fg(PZ.B5)]),-0x2271+0xa9a+0x17e5)),J5[fg(PZ.PI)](J5[fg(PZ.JO)](JB,J8['b'][fg(PZ.B6)+'s']),0x10a9+0x210f+-0x31a9)),J5[fg(PZ.B7)](J5[fg(PZ.B8)](JB,J8['b'][fg(PZ.B9)+'e']),-0x1*0x1b8e+0x1e8d+-0x2ef));return J9=function(){return Jv;},Jv;}J8['b'][f0(PI.J4)]&&(J7=J8['b'][f0(PI.J4)][f0(PI.J5)][f0(PI.J6)](J8['b'][f0(PI.J4)]),J8['b'][f0(PI.J7)][f0(PI.J8)][f0(PI.J9)](J8['b'][f0(PI.J7)]));var JJ,Jf=JJ={'ua':function(Jd,JP){var PH={J:0x1e9,f:0x296},fY=f0,JB=J[fY(PA.J)][fY(PA.f)]('|'),Jb=0x3*-0xbc5+-0x3e5*-0x4+-0x13bb*-0x1;while(!![]){switch(JB[Jb++]){case'0':switch(J[fY(PA.F)](Ju[fY(PA.h)],0x962*0x1+0x20*0x90+-0x1b5e)){default:case-0x4ff+-0x732+0xc31:return Ju;case 0x2277+0x1*-0x1566+-0xd10:return J[fY(PA.J0)](Ju,J[fY(PA.J1)]);case-0x902+-0x1b86+0x1245*0x2:return J[fY(PA.J2)](Ju,'==');case-0x1*-0x2475+-0x1c9e+-0x3ea*0x2:return J[fY(PA.J2)](Ju,'=');}continue;case'1':if(J[fY(PA.J3)](null,Jd))return'';continue;case'2':if(JP)return Ju;continue;case'3':var Ju=JJ['uu'](Jd,0x1d*-0x94+-0x1f44+-0x1*-0x300e,function(Jp){var fj=fY;return JL[fj(PH.J)][fj(PH.f)](Jp);});continue;case'4':var JE={};JE[fY(PA.J4)]=J[fY(PA.J5)];var JL=JE;continue;}break;}},'uu':function(Jd,JP,JB){var fV=f0;if(J[fV(Pn.J)](null,Jd))return'';for(var Jb,Ju,JE,JL,Jp={},Jv={},Jc='',JD=-0x1712+0x26*-0x19+-0x12*-0x17d,JG=-0x58+-0x187*0x2+-0x123*-0x3,JN=-0x27f+0x1*-0x526+-0x1*-0x7a7,JO=[],Jw=-0x205*0x2+-0xcf9+0x41*0x43,Ja=-0x1b61+-0x718+-0x2279*-0x1,Jg=-0x1578+0x53d+-0x3*-0x569;J[fV(Pn.f)](Jg,Jd[fV(Pn.F)]);Jg+=0x1c97+0x6a1+-0x2337)if(JE=Jd[fV(Pn.h)](Jg),Object[fV(Pn.J0)][fV(Pn.J1)+fV(Pn.J2)][fV(Pn.J3)](Jp,JE)||(Jp[JE]=JG++,Jv[JE]=!(0x11a9+-0x21b4+0x100b)),JL=J[fV(Pn.J4)](Jc,JE),Object[fV(Pn.J5)][fV(Pn.J6)+fV(Pn.J7)][fV(Pn.J8)](Jp,JL))Jc=JL;else{if(Object[fV(Pn.J0)][fV(Pn.J9)+fV(Pn.JJ)][fV(Pn.Jf)](Jv,Jc)){if(J[fV(Pn.JF)](Jc[fV(Pn.Jt)](-0x1c45*-0x1+-0x4f*0x3b+-0xa10),0xf29*0x1+0x1*0xff4+-0x251*0xd)){for(Jb=0x1*0x94d+-0x1f1b+-0x2*-0xae7;J[fV(Pn.JU)](Jb,JN);Jb++)Jw<<=-0x2*-0x655+-0x4*-0x1a9+0x9*-0x225,J[fV(Pn.Js)](Ja,J[fV(Pn.Jd)](JP,0x3f6+0x1a89*0x1+-0x1e7e))?(Ja=0x475+-0xffd+0xb88*0x1,JO[fV(Pn.JP)](J[fV(Pn.JB)](JB,Jw)),Jw=0xd*-0x25c+-0xc29+0x2ad5):Ja++;for(Ju=Jc[fV(Pn.Jb)](-0x1e97+-0x10ba+0x1*0x2f51),Jb=0x199+0x1d26+-0x1ebf;J[fV(Pn.Ju)](Jb,-0x64+0x1872+-0x19*0xf6);Jb++)Jw=J[fV(Pn.JE)](J[fV(Pn.JL)](Jw,-0xe34+-0x92*-0x38+-0x11bb),J[fV(Pn.Jp)](0x2232*0x1+-0x1*0x1abd+-0x774,Ju)),J[fV(Pn.Jv)](Ja,J[fV(Pn.Jc)](JP,-0x26d2*0x1+0x1f02+-0x1d*-0x45))?(Ja=-0x1fa1+0x59a+0x1a07,JO[fV(Pn.JP)](J[fV(Pn.JD)](JB,Jw)),Jw=0x1dc8+0x46*-0x85+0x34b*0x2):Ja++,Ju>>=-0xa99+-0x3d3+0xe6d;}else{for(Ju=0x324+-0x2138+-0x33*-0x97,Jb=-0x179e+-0x14a*0xb+0x25cc;J[fV(Pn.Ju)](Jb,JN);Jb++)Jw=J[fV(Pn.JG)](J[fV(Pn.JN)](Jw,0x2c8+0x247c+0x1*-0x2743),Ju),J[fV(Pn.JO)](Ja,J[fV(Pn.Jw)](JP,0x1901+-0x842+-0x85f*0x2))?(Ja=0xb21+0x381+0xea2*-0x1,JO[fV(Pn.JP)](J[fV(Pn.JD)](JB,Jw)),Jw=-0x95*-0xc+0x1a82+0x217e*-0x1):Ja++,Ju=0x1*-0x185b+0xa8*-0x1e+0x2c0b;for(Ju=Jc[fV(Pn.Ja)](0x1e60+-0x4*0x821+-0x112*-0x2),Jb=-0x11bc+-0x33*-0x89+-0x98f*0x1;J[fV(Pn.Jg)](Jb,0x7ce+-0x1*-0x12ee+-0x1aac);Jb++)Jw=J[fV(Pn.Jz)](J[fV(Pn.JQ)](Jw,-0x5*-0x2c5+0x23f4+-0x31cc),J[fV(Pn.Jp)](-0x2121+0x17f6+0x496*0x2,Ju)),J[fV(Pn.Jk)](Ja,J[fV(Pn.JR)](JP,0x17d+0x2420+-0x12ce*0x2))?(Ja=-0x47*0xf+0x2d*-0xcf+0x3c*0xad,JO[fV(Pn.JY)](J[fV(Pn.Jj)](JB,Jw)),Jw=-0x268*0x3+-0x41c*0x2+0x8*0x1ee):Ja++,Ju>>=0x51*-0x27+-0xfff+0x1c57;}J[fV(Pn.JV)](-0x4*0x25+-0x997+0xa2b,--JD)&&(JD=Math[fV(Pn.JS)](0x1a77+-0x2*-0x10de+0x3c31*-0x1,JN),JN++),delete Jv[Jc];}else{for(Ju=Jp[Jc],Jb=0x2359+-0x7ac+0x1*-0x1bad;J[fV(Pn.Jg)](Jb,JN);Jb++)Jw=J[fV(Pn.Jy)](J[fV(Pn.JC)](Jw,0x818+-0x1*0x104f+0x838),J[fV(Pn.Jq)](0x23e+-0x2022+0x1de5,Ju)),J[fV(Pn.Ji)](Ja,J[fV(Pn.JM)](JP,-0x71e*0x1+-0x10*0x18d+0x663*0x5))?(Ja=0x14b*0x8+0x1f7c+-0x29d4,JO[fV(Pn.Jr)](J[fV(Pn.Je)](JB,Jw)),Jw=0x28*-0x95+-0x5*0x371+0x287d):Ja++,Ju>>=-0x1e12+0x21c+0x1bf7;}J[fV(Pn.Pm)](-0x1991+0x2*0x5f5+0x48d*0x3,--JD)&&(JD=Math[fV(Pn.JS)](0x71b+-0x5*0x4ef+-0x1192*-0x1,JN),JN++),Jp[JL]=JG++,Jc=J[fV(Pn.PK)](String,JE);}if(J[fV(Pn.PT)]('',Jc)){if(Object[fV(Pn.PX)][fV(Pn.J9)+fV(Pn.PI)][fV(Pn.J8)](Jv,Jc)){if(J[fV(Pn.Px)](Jc[fV(Pn.Ph)](0x781*0x3+-0x875*-0x1+-0x1ef8),-0x4a2+-0x3*-0x871+0x13b1*-0x1)){for(Jb=-0x102e*0x1+0x2479+0x144b*-0x1;J[fV(Pn.B0)](Jb,JN);Jb++)Jw<<=-0x26e1+0x7ad*0x1+0x1f35,J[fV(Pn.B1)](Ja,J[fV(Pn.B2)](JP,0x224f+-0xdb3+0x5*-0x41f))?(Ja=0x26d1+-0x1340+-0x1391,JO[fV(Pn.B3)](J[fV(Pn.B4)](JB,Jw)),Jw=0xf55+-0x2*0xe6d+-0xd85*-0x1):Ja++;for(Ju=Jc[fV(Pn.B5)](0x131c+-0x8ae+-0xf*0xb2),Jb=0xdf*-0x5+-0x241b+-0x1*-0x2876;J[fV(Pn.Ju)](Jb,-0x236*0x11+0x2580+0x1e);Jb++)Jw=J[fV(Pn.B6)](J[fV(Pn.JL)](Jw,-0x1*0x1e9a+-0x532+-0x729*-0x5),J[fV(Pn.B7)](0xac4+-0x2*-0xeed+0x1*-0x289d,Ju)),J[fV(Pn.Jk)](Ja,J[fV(Pn.B8)](JP,0x2199+0x132+-0x22ca*0x1))?(Ja=-0x5*0x22+0x1894+-0x17ea,JO[fV(Pn.JP)](J[fV(Pn.B9)](JB,Jw)),Jw=-0x63c+0x1665+0x1029*-0x1):Ja++,Ju>>=0x3c*0x49+0x2*-0x377+0xa2d*-0x1;}else{for(Ju=0xc19+-0xde6+0x7*0x42,Jb=-0x4a1*0x5+-0x1ce9+0x340e;J[fV(Pn.BJ)](Jb,JN);Jb++)Jw=J[fV(Pn.B6)](J[fV(Pn.JQ)](Jw,0x17f3+-0x695+-0x1*0x115d),Ju),J[fV(Pn.JV)](Ja,J[fV(Pn.Bf)](JP,0x1e8e*-0x1+0x62f*-0x2+0x9*0x4c5))?(Ja=-0x2464+0x1*0x1caa+0x7ba,JO[fV(Pn.BF)](J[fV(Pn.Bt)](JB,Jw)),Jw=-0x506+-0x1f1c+0x2422):Ja++,Ju=0x1882+0x2b4*0x1+-0x1*0x1b36;for(Ju=Jc[fV(Pn.BU)](-0x6c9*-0x1+-0x6ee*-0x1+-0x1*0xdb7),Jb=-0x4cf*0x5+-0x190c+0x3117;J[fV(Pn.Px)](Jb,0xdd+0xbe9+0x65b*-0x2);Jb++)Jw=J[fV(Pn.Bs)](J[fV(Pn.Bd)](Jw,0x3f0+0x1896+-0x1c85),J[fV(Pn.B7)](-0x1*0x2357+0xd*0x1ae+0x85*0x1a,Ju)),J[fV(Pn.BP)](Ja,J[fV(Pn.BB)](JP,0x1*0x7d9+0x1b57+-0x232f))?(Ja=-0xc7*-0x25+0x301*0xa+-0x3acd,JO[fV(Pn.Bb)](J[fV(Pn.Bu)](JB,Jw)),Jw=0x18d3+-0x2590+0xcbd):Ja++,Ju>>=-0x102a*0x2+-0xbe4+0x2c39;}J[fV(Pn.BP)](-0xa1f*0x1+0x1b0a+-0x10eb,--JD)&&(JD=Math[fV(Pn.JS)](0x20ba+-0x11fc+0x2*-0x75e,JN),JN++),delete Jv[Jc];}else{for(Ju=Jp[Jc],Jb=0x5e2+-0x25b5+0x1fd3;J[fV(Pn.BE)](Jb,JN);Jb++)Jw=J[fV(Pn.Jy)](J[fV(Pn.BL)](Jw,-0x18d+0x84c*0x1+-0x6be),J[fV(Pn.B7)](0x4*0xe1+0x15bb*-0x1+0x1238,Ju)),J[fV(Pn.Bp)](Ja,J[fV(Pn.Jw)](JP,-0x30c*-0x6+0x10*-0x1+0x1237*-0x1))?(Ja=0x7bf*0x2+-0xd9*0x2+-0x2*0x6e6,JO[fV(Pn.Bv)](J[fV(Pn.Bc)](JB,Jw)),Jw=-0x1c8e+0x648+0x1646):Ja++,Ju>>=-0xe38+0x5*-0x622+0x2ce3;}J[fV(Pn.BD)](0x2*0xf63+0x4*-0x939+0x61e,--JD)&&(JD=Math[fV(Pn.JS)](0xd90+-0x1*-0x182b+0x1*-0x25b9,JN),JN++);}for(Ju=-0x3*-0x6+0x2304+-0x1c1*0x14,Jb=0xd94+-0x4dd+-0x8b7*0x1;J[fV(Pn.BG)](Jb,JN);Jb++)Jw=J[fV(Pn.JG)](J[fV(Pn.BN)](Jw,0x914+0x26*-0xae+0x10c1*0x1),J[fV(Pn.B7)](0x1*0x10ac+-0x97*0xd+-0x900,Ju)),J[fV(Pn.Ji)](Ja,J[fV(Pn.BO)](JP,0x139d*0x1+0x2*0x1066+-0x3468))?(Ja=0x1037+-0x1*-0x24b+-0x1282,JO[fV(Pn.Bw)](J[fV(Pn.Bt)](JB,Jw)),Jw=0x55a+-0x1d32+0x17d8):Ja++,Ju>>=-0xb55*0x3+-0x237d+0x457d;for(;;){if(Jw<<=-0x13*0x1b1+-0x9*-0x112+0x1682,J[fV(Pn.Ba)](Ja,J[fV(Pn.Bg)](JP,0xc73*0x1+0x278+0x1*-0xeea))){JO[fV(Pn.Bz)](J[fV(Pn.BQ)](JB,Jw));break;}Ja++;}return JO[fV(Pn.Bk)]('');}},JF=J[f0(PI.JJ)](J4,-0x2*-0x254+-0x149*0x3+0x15d*0x1),Jt=[J[f0(PI.Jf)],J[f0(PI.JF)],J[f0(PI.Jt)],J[f0(PI.JU)],J[f0(PI.Js)],J[f0(PI.Jd)],J[f0(PI.JP)],J[f0(PI.JB)],J[f0(PI.Jf)]],JU={'un':function(Jd){var fS=f0;return!(!Jd[fS(Pm.J)]||J[fS(Pm.f)](-0x1d7*-0xd+0x2b8*-0xc+0x8b5,Jd[fS(Pm.F)][fS(Pm.h)](J[fS(Pm.J0)]))||Jd[fS(Pm.J1)][fS(Pm.J2)](/(cloudauth-device|captcha-(pro-)?open).*?\.aliyuncs\.com$/));},'sig':function(Jd){var fy=f0;for(var JP=-0x2*0x1+-0x1f*-0xe+0x10*-0x1b,JB=J5[fy(PK.J)](encodeURIComponent,Jd),Jb=0x26b*0x5+-0xcb4+0x9d;J5[fy(PK.f)](Jb,JB[fy(PK.F)]);Jb++)JP=J5[fy(PK.h)](J5[fy(PK.J0)](J5[fy(PK.J1)](J5[fy(PK.J2)](JP,-0x1231+0x10cd*-0x1+0x37*0xa3),JP),0xd0e+0x1535+-0x1*0x20b5),JB[fy(PK.J3)](Jb)),JP|=-0x13bd+0x1f7b+0xbbe*-0x1;return JP;},'uf':function(Jd,JP){return!!JU['un'](Jd)&&JU['E'](Jd,JP);},'E':function(Jd,JP){var fC=f0,JB=J[fC(PX.J)][fC(PX.f)]('|'),Jb=-0xd3e+0x1db0+0x2*-0x839;while(!![]){switch(JB[Jb++]){case'0':return JP[J[fC(PX.F)](Jt[J[fC(PX.h)](JE,Jt[fC(PX.J0)])],J[fC(PX.J1)](JE,0x3*-0x17a4+0xd*-0x579+0x209*0x59))]=Ju,Jd[fC(PX.J2)]=(0x8d9+0xf75+-0x6*0x40d,JF['L'])(Jd[fC(PX.J2)],JP),(-0x1*-0xa11+0xfb*-0x18+0x17f*0x9,JF['p'])(Jd);case'1':for(var JP=J[fC(PX.J3)](J[fC(PX.J4)](J[fC(PX.J5)](J[fC(PX.J6)](J[fC(PX.J7)](JU[fC(PX.J8)](Ju),'|'),J[fC(PX.J9)](J9)),'|'),new Date()[fC(PX.JJ)]()),'|1'),Ju=Jf['ua'](JP,!(0x3af*-0x1+0x21d1+-0x1e22)),JE=-0xc*0x2df+-0x22ac+0x4520,JL=-0x114d+0x77b*0x2+0x257;J[fC(PX.Jf)](JL,Jd[fC(PX.JF)][fC(PX.J0)]);JL++)JE+=Jd[fC(PX.Jt)][JL][fC(PX.JU)]();continue;case'2':JP={};continue;case'3':JP&&(Ju+=JP);continue;case'4':var Ju=(0x1*0x3a1+-0x66c*-0x5+0x23bd*-0x1,JF['p'])(Jd,!(0x5*0x7b5+-0x233*0x9+-0x12be));continue;}break;}}},Js=JU['uf'];JU['E'];},0xaa:function(J2,J3,J4){'use strict';var fq=Jo;var J5={};J5['b']=function(){return J6;},J5['B']=function(){return J7;},J5['u']=function(){return J8;},J5['v']=function(){return J9;},J4['d'](J3,J5);var J6=window,J7=J6[fq(B2.J)],J8=J6[fq(B2.f)],J9=J[fq(B2.F)];},0x1ad:function(J2,J3,J4){'use strict';var B7={J:0x4fe},B6={J:0x5b2},B5={J:0x21c},fM=Jo,J5={'ERQlV':function(JJ,Jf){var fi=U;return J[fi(B3.J)](JJ,Jf);},'nvuNL':J[fM(BJ.J)],'WkGzW':function(JJ,Jf){var fr=fM;return J[fr(B4.J)](JJ,Jf);},'LkoYE':function(JJ,Jf){var fe=fM;return J[fe(B5.J)](JJ,Jf);},'fAJAe':function(JJ,Jf){var fW=fM;return J[fW(B6.J)](JJ,Jf);},'vgMQY':function(JJ,Jf){var fo=fM;return J[fo(B7.J)](JJ,Jf);},'gQYfy':J[fM(BJ.f)],'ezRpY':J[fM(BJ.F)]};var J6={};J6['s']=function(){return J9;},(J4['r'](J3),J4['d'](J3,J6));var J7=J[fM(BJ.h)](J4,-0x241a+0x1*-0x6b5+-0x18d*-0x1d),J8=J[fM(BJ.J0)](J4,-0x1c7c+0x1*0xf90+0xd96);function J9(JJ,Jf,JF,Jt){var fl=fM,Jt=Jt||(-0x1cf+0x1726*-0x1+0x18f5*0x1,J7['cd'])(),JU=J5[fl(B9.J)](J5[fl(B9.f)],typeof JF)?((JU=new Date())[fl(B9.F)](J5[fl(B9.h)](JU[fl(B9.J0)](),JF)),JU[fl(B9.J1)+'g']()):JF;J8['B'][fl(B9.J2)]=J5[fl(B9.J3)](J5[fl(B9.J4)](J5[fl(B9.J5)](J5[fl(B9.J6)](J5[fl(B9.J7)](J5[fl(B9.J4)](JJ,'='),Jf),J5[fl(B9.J8)]),JU),J5[fl(B9.J9)]),Jt);}},0x22a:function(J2,J3,J4){'use strict';var Bw={J:0x638,f:0x27f,F:0x27f,h:0x2c9,J0:0x638,J1:0x225,J2:0x1f8,J3:0x394,J4:0x5df,J5:0x1f4},BO={J:0x24c,f:0x2fb,F:0x450,h:0x2df,J0:0x638,J1:0x513,J2:0x44f,J3:0x5ed,J4:0x41d,J5:0x450,J6:0x2c0,J7:0x2df,J8:0x54d,J9:0x322,JJ:0x54d,Jf:0x517,JF:0x360,Jt:0x28a,JU:0x450,Js:0x2c9,Jd:0x4ac},BN={J:0x396,f:0x2ca,F:0x41b,h:0x610,J0:0x397,J1:0x563,J2:0x378,J3:0x610,J4:0x378,J5:0x225,J6:0x1f8,J7:0x5a5,J8:0x2a5,J9:0x4a9,JJ:0x394,Jf:0x61e,JF:0x394,Jt:0x2df,JU:0x5df,Js:0x1f4,Jd:0x378},BG={J:0x54a,f:0x1f8,F:0x54d,h:0x2aa,J0:0x450,J1:0x5a4,J2:0x1fb,J3:0x532,J4:0x435,J5:0x4b1,J6:0x5a4,J7:0x5c6,J8:0x36b,J9:0x1e0},BL={J:0x684},Bu={J:0x3dd},BB={J:0x356},Bd={J:0x573},Bt={J:0x2c1},BF={J:0x58d},fZ=Jo,J5={'MOrQU':J[fZ(Ba.J)],'aFrgc':J[fZ(Ba.f)],'vSccj':function(JU,Js){var fH=fZ;return J[fH(Bf.J)](JU,Js);},'ZxuRS':function(JU,Js){var fA=fZ;return J[fA(BF.J)](JU,Js);},'xKQxo':function(JU,Js){var fn=fZ;return J[fn(Bt.J)](JU,Js);},'rBWEt':function(JU,Js){var fm=fZ;return J[fm(BU.J)](JU,Js);},'zmRFq':function(JU,Js){var fK=fZ;return J[fK(Bs.J)](JU,Js);},'JfzJv':function(JU,Js){var fT=fZ;return J[fT(Bd.J)](JU,Js);},'gOyIj':function(JU,Js){var fX=fZ;return J[fX(BP.J)](JU,Js);},'Gmcql':function(JU,Js){var fI=fZ;return J[fI(BB.J)](JU,Js);},'pTZAG':function(JU,Js){var fx=fZ;return J[fx(Bb.J)](JU,Js);},'nrjiy':function(JU,Js){var fh=fZ;return J[fh(Bu.J)](JU,Js);},'HZPgp':function(JU,Js){var F0=fZ;return J[F0(BE.J)](JU,Js);},'QbkWt':function(JU,Js){var F1=fZ;return J[F1(BL.J)](JU,Js);}};var J6={};J6['L']=function(){return JF;},J6['cd']=function(){return JJ;},J6['p']=function(){return Jt;},J6['c']=function(){return Jf;},J4['d'](J3,J6);var J7=J[fZ(Ba.F)](J4,-0x18e3+0x4c*-0x7+0xb*0x283),J8={},J9=/^(ac\.cn|ac\.id|ah\.cn|bj\.cn|club\.tw|co\.id|co\.jp|co\.kr|co\.nz|co\.uk|com\.cn|com\.hk|com\.mo|com\.my|com\.tw|cq\.cn|ebiz\.tw|edu\.cn|edu\.hk|edu\.mo|edu\.tw|fj\.cn|game\.tw|gd\.cn|go\.id|gov\.cn|gov\.hk|gov\.mo|gov\.my|gov\.ph|gov\.tw|gs\.cn|gx\.cn|gz\.cn|ha\.cn|hb\.cn|he\.cn|hi\.cn|hk\.cn|hl\.cn|hn\.cn|idv\.hk|idv\.tw|jl\.cn|js\.cn|jx\.cn|ln\.cn|mil\.cn|mil\.tw|mo\.cn|net\.cn|net\.hk|net\.mo|net\.tw|nm\.cn|nx\.cn|org\.cn|org\.hk|org\.mo|org\.tw|qh\.cn|sc\.cn|sd\.cn|sh\.cn|sn\.cn|sx\.cn|tj\.cn|tw\.cn|us\.org|xj\.cn|xz\.cn|yn\.cn|zj\.cn)$/;function JJ(){var F2=fZ,JU,Js,Jd=J7['B'][F2(BG.J)][F2(BG.f)][F2(BG.F)](':')[-0x1f*0xf4+0x26*-0x83+-0x30fe*-0x1];return J8[Jd]?Jd=J8[Jd]:J[F2(BG.h)](-0xb8c+0x26d2*0x1+0x574*-0x5,Js=(JU=Jd[F2(BG.F)]('.'))[F2(BG.J0)])&&!/^(\d+\.)*\d+$/[F2(BG.J1)](Jd)&&(Jd=J[F2(BG.J2)](J[F2(BG.J3)](JU[J[F2(BG.J4)](Js,0x923*-0x1+0x57*-0x13+-0x7cd*-0x2)],'.'),JU[J[F2(BG.J5)](Js,0xce*0x3+-0xcee+0x1*0xa85)]),J9[F2(BG.J6)](Jd))&&(Jd=J[F2(BG.J7)](J[F2(BG.J8)](JU[J[F2(BG.J9)](Js,0x2669+-0x96f+0x1cf7*-0x1)],'.'),Jd)),Jd;}function Jf(JU){var F3=fZ,Js=J7['B'][F3(BN.J)+F3(BN.f)](J5[F3(BN.F)]);return Js[F3(BN.h)]=J5[F3(BN.J0)],Js[F3(BN.J1)][F3(BN.J2)]=JU,Js[F3(BN.h)]=Js[F3(BN.J3)],(JU=Js[F3(BN.J1)])[F3(BN.J4)]=Js[F3(BN.J1)][F3(BN.J4)],{'protocol':JU[F3(BN.J5)],'host':JU[F3(BN.J6)],'hostname':JU[F3(BN.J7)],'port':JU[F3(BN.J8)],'pathname':J5[F3(BN.J9)]('/',JU[F3(BN.JJ)][F3(BN.Jf)](0x18ff+0x1f5e+0x1*-0x385d,0x114f+0x23b7+-0x3505))?JU[F3(BN.JF)]:J5[F3(BN.Jt)]('/',JU[F3(BN.JF)]),'search':JU[F3(BN.JU)],'hash':JU[F3(BN.Js)],'D':JU[F3(BN.Jd)]};}function JF(JU,Js){var F4=fZ;if(J5[F4(BO.J)](-0x59*0x4f+-0x3c9+0x320*0xa,Object[F4(BO.f)](Js)[F4(BO.F)])){var Jd,JP='';for(Jd in Js)JP+=J5[F4(BO.h)](J5[F4(BO.J0)](J5[F4(BO.h)](J5[F4(BO.J1)](encodeURIComponent,Jd),'='),J5[F4(BO.J2)](encodeURIComponent,Js[Jd])),'&');if(JP=JP[F4(BO.J3)](0x1ef1+-0x3*-0x119+0x4*-0x88f,J5[F4(BO.J4)](JP[F4(BO.J5)],-0xafd+-0x1f24+0x1511*0x2)),J5[F4(BO.J6)](0x8*-0x1bb+0x18af+-0xad7,JU[F4(BO.F)]))JU=J5[F4(BO.J7)]('?',JP);else{for(var JB=JU[F4(BO.J3)](0x1d3f+0x18a6+-0x1af2*0x2)[F4(BO.J8)]('&'),Jb=[],Ju=Object[F4(BO.f)](Js),JE=-0x10*0x227+0xad*0x18+0x58*0x35;J5[F4(BO.J9)](JE,JB[F4(BO.J5)]);JE++)Jd=J5[F4(BO.J1)](decodeURIComponent,JB[JE][F4(BO.JJ)]('=',0x1fb6+-0x2c8*-0x8+0x2d7*-0x13)[0x7*0x434+0x211*0x1+-0x3*0xa7f]),J5[F4(BO.J6)](-(-0xd24+-0x2607+0x332c),Ju[F4(BO.Jf)](Jd))&&Jb[F4(BO.JF)](JB[JE]);JU=J5[F4(BO.J0)](J5[F4(BO.J0)]('?',J5[F4(BO.Jt)](0x2189+0x15da+-0xb*0x509,Jb[F4(BO.JU)])?'':J5[F4(BO.Js)](Jb[F4(BO.Jd)]('&'),'&')),JP);}}return JU;}function Jt(JU,Js){var F5=fZ;return J5[F5(Bw.J)](J5[F5(Bw.f)](J5[F5(Bw.F)](J5[F5(Bw.h)](J5[F5(Bw.J0)](JU[F5(Bw.J1)],'//'),JU[F5(Bw.J2)]),JU[F5(Bw.J3)]),JU[F5(Bw.J4)]),Js?'':JU[F5(Bw.J5)]);}}},J0={};function J1(J2){var F6=Jo,J3=J0[J2],J4={};return J4[F6(Bg.J)]={},(J[F6(Bg.f)](void(0x2de*-0x8+-0xb*0x209+0x2d53),J3)||(J3=J0[J2]=J4,h[J2](J3,J3[F6(Bg.F)],J1)),J3[F6(Bg.h)]);}J1['d']=function(J2,J3){var F7=Jo;for(var J4 in J3)J1['G'](J3,J4)&&!J1['G'](J2,J4)&&Object[F7(Bz.J)+F7(Bz.f)](J2,J4,{'enumerable':!(0x9ec*-0x2+-0xff8+0x23d0),'get':J3[J4]});},J1['G']=function(J2,J3){var F8=Jo;return Object[F8(BQ.J)][F8(BQ.f)+F8(BQ.F)][F8(BQ.h)](J2,J3);},J1['r']=function(J2){var F9=Jo,J3={};J3[F9(Bk.J)]=!(0x1926+-0xa59+-0x3*0x4ef),(J[F9(Bk.f)](J[F9(Bk.F)],typeof Symbol)&&Symbol[F9(Bk.h)+'g']&&Object[F9(Bk.J0)+F9(Bk.J1)](J2,Symbol[F9(Bk.h)+'g'],{'value':J[F9(Bk.J2)]}),Object[F9(Bk.J3)+F9(Bk.J4)](J2,J[F9(Bk.J5)],J3));},!(function(){var uq={J:0x559,f:0x398,F:0x27e},uS={J:0x5cb},uV={J:0x279},uY={J:0x53d,f:0x268,F:0x5ea,h:0x582,J0:0x1e3,J1:0x507,J2:0x274,J3:0x633,J4:0x278,J5:0x275,J6:0x2e8,J7:0x4c3,J8:0x60e,J9:0x527,JJ:0x665,Jf:0x4fe,JF:0x21c,Jt:0x532,JU:0x5b2,Js:0x335,Jd:0x486,JP:0x5fa,JB:0x36b,Jb:0x21e,Ju:0x5c4,JE:0x504,JL:0x35d,Jp:0x488,Jv:0x364,Jc:0x497,JD:0x335,JG:0x31c,JN:0x1fb,JO:0x318,Jw:0x2cc,Ja:0x5f6,Jg:0x402,Jz:0x271,JQ:0x68c,Jk:0x1e8,JR:0x5c6,JY:0x3a9,Jj:0x676,JV:0x4ff,JS:0x204,Jy:0x2ae,JC:0x39d,Jq:0x26f,Ji:0x2e4,JM:0x1f6,Jr:0x2e4,Je:0x507,uj:0x514,uV:0x3f4,uS:0x29f,uy:0x49f,uC:0x29f,uq:0x577,ui:0x29f,uM:0x645,ur:0x292,ue:0x49f,uW:0x4b7,uo:0x287,ul:0x645,uZ:0x4b7,uH:0x362,uA:0x262,un:0x35e,um:0x4ef,uK:0x46d,uT:0x2a2,uX:0x353,uI:0x577,ux:0x1f7,uh:0x350,E0:0x5a6,E1:0x230,E2:0x396,E3:0x2ca,E4:0x589,E5:0x396,E6:0x61f,E7:0x426,E8:0x1dd,E9:0x610,EJ:0x5cc,Ef:0x216,EF:0x32c,Et:0x43e,EU:0x228,Es:0x27e,Ed:0x5cc,EP:0x563,EB:0x479,Eb:0x2da,Eu:0x304,EE:0x697,EL:0x5cc},uk={J:0x608,f:0x517,F:0x48a,h:0x517,J0:0x3e8,J1:0x293,J2:0x4fe},uQ={J:0x3b4,f:0x3e9,F:0x244,h:0x48c,J0:0x699,J1:0x2da,J2:0x4ae,J3:0x5c0,J4:0x2da,J5:0x4e4,J6:0x606,J7:0x448,J8:0x652,J9:0x610},uz={J:0x2d4,f:0x450,F:0x4c5,h:0x45f,J0:0x686,J1:0x426,J2:0x3b9,J3:0x4d4,J4:0x5df,J5:0x333,J6:0x4d1,J7:0x410,J8:0x333,J9:0x65a,JJ:0x2d0,Jf:0x543,JF:0x666,Jt:0x40f,JU:0x269,Js:0x426,Jd:0x4c9,JP:0x64f,JB:0x3ab,Jb:0x5b6,Ju:0x346,JE:0x3b9,JL:0x4d4,Jp:0x5df,Jv:0x5df,Jc:0x23e,JD:0x4da,JG:0x27d},uG={J:0x27b},uc={J:0x445},uv={J:0x365},uE={J:0x49a},ub={J:0x687},uU={J:0x500},uf={J:0x679,f:0x5f2,F:0x387,h:0x692,J0:0x4b0},uJ={J:0x4f0,f:0x68e,F:0x46b,h:0x2ce,J0:0x63b,J1:0x61b,J2:0x403,J3:0x555,J4:0x270,J5:0x34a},u5={J:0x20e},u4={J:0x25f},u2={J:0x605},u1={J:0x3a8},bx={J:0x26a,f:0x66a,F:0x26a,h:0x26a,J0:0x295},bi={J:0x24f},bq={J:0x33c,f:0x553,F:0x2f9,h:0x517,J0:0x2cd,J1:0x1f0,J2:0x3ae,J3:0x231,J4:0x517,J5:0x529,J6:0x3c1,J7:0x517,J8:0x306,J9:0x4d3,JJ:0x3dd,Jf:0x553,JF:0x677,Jt:0x564,JU:0x395,Js:0x4b6,Jd:0x553,JP:0x517,JB:0x49d,Jb:0x48f,Ju:0x1dc,JE:0x64a,JL:0x405,Jp:0x2c1,Jv:0x475,Jc:0x54d,JD:0x594,JG:0x54d,JN:0x590,JO:0x450,Jw:0x3ac,Ja:0x4be,Jg:0x4be,Jz:0x57c,JQ:0x67f,Jk:0x396,JR:0x2ca,JY:0x650,Jj:0x3ed,JV:0x3ba,JS:0x621,Jy:0x479,JC:0x2da,Jq:0x304,Ji:0x697,JM:0x5cc,Jr:0x4d3,Je:0x58f,bi:0x527,bM:0x265,br:0x308,be:0x34c,bW:0x488,bo:0x355,bl:0x5f2,bZ:0x259,bH:0x53b,bA:0x542,bn:0x47d,bm:0x53b,bK:0x1eb,bT:0x1eb,bX:0x37c,bI:0x3ac,bx:0x2b7,bh:0x4a6,u0:0x329,u1:0x360,u2:0x25a,u3:0x517,u4:0x4c8,u5:0x569,u6:0x325},by={J:0x244,f:0x646,F:0x683,h:0x4c7,J0:0x681,J1:0x54b,J2:0x5b7,J3:0x494,J4:0x494,J5:0x2d0,J6:0x543,J7:0x3c2,J8:0x5b8,J9:0x46f,JJ:0x245,Jf:0x3e5,JF:0x639,Jt:0x23c,JU:0x22e,Js:0x45d,Jd:0x575,JP:0x35f,JB:0x31b,Jb:0x35f,Ju:0x672,JE:0x35f,JL:0x5f9,Jp:0x295},bV={J:0x557,f:0x4bb,F:0x50b,h:0x3ef,J0:0x65c,J1:0x65a,J2:0x34f,J3:0x65c,J4:0x65a},bj={J:0x50b,f:0x3ef,F:0x629,h:0x65a,J0:0x67a,J1:0x4bb,J2:0x41f},bY={J:0x330,f:0x646,F:0x50b,h:0x3ef,J0:0x65c,J1:0x65a},bR={J:0x575,f:0x35f,F:0x313},ba={J:0x27b,f:0x4c5,F:0x65a},bu={J:0x330},bb={J:0x27b},bB={J:0x534},bs={J:0x27b,f:0x550,F:0x27b,h:0x1ed,J0:0x232},bU={J:0x27b,f:0x550,F:0x206,h:0x520,J0:0x326,J1:0x4e3,J2:0x1ed},b9={J:0x656},b6={J:0x35b,f:0x5df,F:0x38a,h:0x35b,J0:0x520,J1:0x5df,J2:0x38a},b5={J:0x580},b4={J:0x431},b2={J:0x285},Bx={J:0x49c},BX={J:0x3df},BT={J:0x5e5},Bn={J:0x259},BA={J:0x4ec},Bo={J:0x23a},Be={J:0x5b1},BM={J:0x58d},By={J:0x34c},BS={J:0x259},BV={J:0x51f},BY={J:0x226},BR={J:0x34e},FJ=Jo,J2={'jPIXG':J[FJ(ui.J)],'wFAOG':function(Ja){var Ff=FJ;return J[Ff(BR.J)](Ja);},'uiVyV':function(Ja,Jg){var FF=FJ;return J[FF(BY.J)](Ja,Jg);},'mijcd':function(Ja){var Ft=FJ;return J[Ft(Bj.J)](Ja);},'LHVQv':function(Ja,Jg){var FU=FJ;return J[FU(BV.J)](Ja,Jg);},'btaUi':J[FJ(ui.f)],'qsYpd':function(Ja,Jg){var Fs=FJ;return J[Fs(BS.J)](Ja,Jg);},'xHkHD':function(Ja,Jg){var Fd=FJ;return J[Fd(By.J)](Ja,Jg);},'vyxDs':J[FJ(ui.F)],'ZgPSV':J[FJ(ui.h)],'zqjCd':J[FJ(ui.J0)],'lPgzR':J[FJ(ui.J1)],'mbHvB':function(Ja,Jg){var FP=FJ;return J[FP(BC.J)](Ja,Jg);},'LKNWp':J[FJ(ui.J2)],'gDpIL':function(Ja,Jg){var FB=FJ;return J[FB(Bq.J)](Ja,Jg);},'znDIF':J[FJ(ui.J3)],'gmelw':function(Ja,Jg){var Fb=FJ;return J[Fb(Bi.J)](Ja,Jg);},'APiBe':function(Ja,Jg){var Fu=FJ;return J[Fu(BM.J)](Ja,Jg);},'rdPwn':function(Ja,Jg){var FE=FJ;return J[FE(Br.J)](Ja,Jg);},'tJQLs':J[FJ(ui.J4)],'rEstL':function(Ja,Jg,Jz){var FL=FJ;return J[FL(Be.J)](Ja,Jg,Jz);},'hZrwo':function(Ja,Jg){var Fp=FJ;return J[Fp(BW.J)](Ja,Jg);},'uBZac':J[FJ(ui.J5)],'oXtKa':J[FJ(ui.J6)],'JKVrZ':J[FJ(ui.J7)],'aVVer':J[FJ(ui.J8)],'kdyLO':J[FJ(ui.J9)],'VTzQO':J[FJ(ui.JJ)],'qDKbv':J[FJ(ui.Jf)],'EYQGX':J[FJ(ui.JF)],'sADDL':J[FJ(ui.Jt)],'KOXNR':J[FJ(ui.JU)],'YSbwM':J[FJ(ui.Js)],'xWyMl':J[FJ(ui.Jd)],'eVHVt':J[FJ(ui.JP)],'dkURr':function(Ja,Jg){var Fv=FJ;return J[Fv(Bo.J)](Ja,Jg);},'vFwlD':J[FJ(ui.JB)],'ifegb':function(Ja,Jg){var Fc=FJ;return J[Fc(Bl.J)](Ja,Jg);},'HbXhV':function(Ja,Jg){var FD=FJ;return J[FD(BZ.J)](Ja,Jg);},'vLSXH':J[FJ(ui.Jb)],'CFceF':J[FJ(ui.Ju)],'YXUOE':J[FJ(ui.JE)],'wIVfa':J[FJ(ui.JL)],'LecUF':J[FJ(ui.Jp)],'LuCil':J[FJ(ui.Jv)],'gUrTb':J[FJ(ui.Jc)],'pzVpF':J[FJ(ui.JD)],'nVUDz':J[FJ(ui.JG)],'iJpsX':J[FJ(ui.JN)],'hPouI':function(Ja,Jg){var FG=FJ;return J[FG(BH.J)](Ja,Jg);},'vuTAg':function(Ja,Jg,Jz){var FN=FJ;return J[FN(BA.J)](Ja,Jg,Jz);},'CEbet':function(Ja,Jg){var FO=FJ;return J[FO(Bn.J)](Ja,Jg);},'jFYQA':function(Ja,Jg){var Fw=FJ;return J[Fw(Bm.J)](Ja,Jg);},'CiJTp':function(Ja,Jg){var Fa=FJ;return J[Fa(BK.J)](Ja,Jg);},'cNeBa':J[FJ(ui.JO)],'nVvAr':J[FJ(ui.Jw)],'DGzQQ':function(Ja,Jg){var Fg=FJ;return J[Fg(BT.J)](Ja,Jg);},'zzMEa':J[FJ(ui.Ja)],'Tuclw':function(Ja,Jg,Jz,JQ){var Fz=FJ;return J[Fz(BX.J)](Ja,Jg,Jz,JQ);},'wEwRH':J[FJ(ui.Jg)],'Hxbvs':J[FJ(ui.Jz)],'ofure':J[FJ(ui.JQ)],'LPOdk':J[FJ(ui.Jk)],'WIeTc':J[FJ(ui.JR)],'pZhUj':function(Ja,Jg,Jz,JQ){var FQ=FJ;return J[FQ(BI.J)](Ja,Jg,Jz,JQ);},'VWdzS':J[FJ(ui.JY)],'pKTkC':function(Ja,Jg){var Fk=FJ;return J[Fk(Bx.J)](Ja,Jg);},'XQNvz':function(Ja,Jg){var FR=FJ;return J[FR(Bh.J)](Ja,Jg);},'kgCxA':J[FJ(ui.Jj)],'XFKKb':J[FJ(ui.JV)],'kDEKN':function(Ja,Jg){var FY=FJ;return J[FY(b0.J)](Ja,Jg);},'ylkAH':function(Ja,Jg){var Fj=FJ;return J[Fj(b1.J)](Ja,Jg);},'XceKH':function(Ja,Jg){var FV=FJ;return J[FV(b2.J)](Ja,Jg);},'NhQVb':function(Ja,Jg){var FS=FJ;return J[FS(b3.J)](Ja,Jg);},'QYaYs':J[FJ(ui.JS)],'ognPb':J[FJ(ui.Jy)],'lmlYw':J[FJ(ui.JC)],'QGEol':J[FJ(ui.Jq)],'kRTBc':J[FJ(ui.Ji)],'oGzTK':function(Ja,Jg){var Fy=FJ;return J[Fy(b4.J)](Ja,Jg);},'gKqqD':function(Ja,Jg){var FC=FJ;return J[FC(b5.J)](Ja,Jg);},'rWlXJ':J[FJ(ui.JM)]},J3=J[FJ(ui.Jr)](f,this,function(){var Fq=FJ;return J3[Fq(b6.J)]()[Fq(b6.f)](J2[Fq(b6.F)])[Fq(b6.h)]()[Fq(b6.J0)+'r'](J3)[Fq(b6.J1)](J2[Fq(b6.J2)]);});J[FJ(ui.Je)](J3);'use strict';var J4,J5,J6,J7,J8,J9,JJ,Jf,JF=J[FJ(ui.uM)](J1,-0x1a64+0x4*-0x6ef+0x3*0x12fb),Jt=J[FJ(ui.ur)](J1,0x22e8+-0x1a71+-0x64d),JU=J[FJ(ui.ue)](J1,-0x1*-0x1101+-0x936+-0x61e),Js=J[FJ(ui.uW)](J1,0x11aa+0x2619+-0x193*0x23),Jd=(J6=[],J7=Js['B'][FJ(ui.uo)+FJ(ui.ul)],JO=J7[FJ(ui.uZ)],J8=J[FJ(ui.uH)],Jd=J[FJ(ui.uA)],J9=J[FJ(ui.un)],JJ=J[FJ(ui.um)],Jf=(JO?/^loaded|^c/:/^loaded|c/)[FJ(ui.uK)](Js['B'][JJ]),Js['B'][Jd]&&Js['B'][Jd](J8,J5=function(){var Fi=FJ;Js['B'][Fi(b7.J)+Fi(b7.f)](J8,J5,!(0x1c*0x7a+0x1*0x17dd+-0x2534)),J2[Fi(b7.F)](JP);},!(-0x4ec+0x28b+-0x262*-0x1)),JO&&Js['B'][FJ(ui.uT)+'t'](J9,J5=function(){var FM=FJ;/^c/[FM(b8.J)](Js['B'][JJ])&&(Js['B'][FM(b8.f)+'t'](J9,J5),J[FM(b8.F)](JP));}),J4=JO?function(Ja){var Fr=FJ;if(J[Fr(bJ.J)](self,top))Jf?J[Fr(bJ.f)](Ja):J6[Fr(bJ.F)](Ja);else{try{J7[Fr(bJ.h)](J[Fr(bJ.J0)]);}catch(Jg){return void J[Fr(bJ.J1)](setTimeout,function(){var Fe=Fr;J2[Fe(b9.J)](J4,Ja);},0xa9*-0x3+-0x10e5+-0x1*-0x1312);}J[Fr(bJ.J2)](Ja);}}:function(Ja){var FW=FJ;Jf?J2[FW(bf.J)](Ja):J6[FW(bf.f)](Ja);});function JP(Ja){var Fo=FJ;for(Jf=-0x26dd*0x1+-0x2420+0x3a*0x14b;Ja=J6[Fo(bF.J)]();)J[Fo(bF.f)](Ja);}var JB=XMLHttpRequest[FJ(ui.uX)],Jb=JB[FJ(ui.uI)],Ju=JB[FJ(ui.ux)],JE=JB[FJ(ui.uh)+FJ(ui.E0)],JL=JB[FJ(ui.E1)+FJ(ui.E2)],Jp=JB[FJ(ui.E3)+FJ(ui.E4)],Jv=Object[FJ(ui.E5)+FJ(ui.E6)+FJ(ui.E7)](JB,J[FJ(ui.E8)]),Jc=Object[FJ(ui.E9)+FJ(ui.E6)+FJ(ui.E7)](JB,J[FJ(ui.JU)]),JD=Object[FJ(ui.E9)+FJ(ui.EJ)+FJ(ui.Ef)](JB,J[FJ(ui.EF)]);function JG(Ja){var Fl=FJ;return(JG=J2[Fl(bs.J)](J2[Fl(bs.f)],typeof Symbol)&&J2[Fl(bs.F)](J2[Fl(bs.h)],typeof Symbol[Fl(bs.J0)])?function(Jg){return typeof Jg;}:function(Jg){var FZ=Fl;return Jg&&J2[FZ(bU.J)](J2[FZ(bU.f)],typeof Symbol)&&J2[FZ(bU.F)](Jg[FZ(bU.h)+'r'],Symbol)&&J2[FZ(bU.J0)](Jg,Symbol[FZ(bU.J1)])?J2[FZ(bU.J2)]:typeof Jg;})(Ja);}var JN,JO,Jw=J[FJ(ui.Et)](J1,0x1*0x1303+0x1*-0x1487+0x1be)['P'];Js['b'][FJ(ui.EU)+FJ(ui.Es)+'ed']||(Js['b'][FJ(ui.Ed)+FJ(ui.EP)]=!(0xe07+-0x1a7b+0x1*0xc75),Js['b'][FJ(ui.EB)+'id']='',Js['b'][FJ(ui.Eb)+FJ(ui.Eu)]=0x6*-0x27a+-0x13*0x4+0x1054,Js['b'][FJ(ui.EE)+FJ(ui.EL)]=Js['v'],JO=Js['u'][FJ(ui.Ep)]||Js['u'][FJ(ui.Ev)]||Js['b'][FJ(ui.Ec)],(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[FJ(ui.uK)](JO)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i[FJ(ui.uK)](JO[FJ(ui.ED)](-0x19a9+-0xcad*0x2+0x3303,0x1ae*0x11+-0x714*0x2+-0xe62)))&&(Js['b'][FJ(ui.EG)+FJ(ui.EN)]=!(-0xb1*-0x22+0x1c19*0x1+-0x339b)),(JN={'N':[],'O':[],'w':void(0x87*-0x40+-0x112e+0x7b*0x6a),'a':void(-0xe*-0x241+0xeca+0x8*-0x5cb),'g':void(0x166d*-0x1+0x2539+-0xecc),'z':function(Ja){var FH=FJ;if(Ja)switch(Ja[FH(bd.J)]){case J2[FH(bd.f)]:this['O'][FH(bd.F)](Ja);break;case J2[FH(bd.h)]:this['N'][FH(bd.F)](Ja);}},'Q':!(Js['b'][FJ(ui.EO)+FJ(ui.Ew)+'ed']=!(0x33*-0x3d+0x102c+-0x3*0x157)),'k':0x0,'R':function(){var bS={J:0x207,f:0x4bb,F:0x50b,h:0x3ef,J0:0x65c,J1:0x65a,J2:0x521},bk={J:0x576,f:0x65a,F:0x5be,h:0x5be,J0:0x5be},bz={J:0x3fd},bw={J:0x3b4,f:0x46e,F:0x330,h:0x244,J0:0x65a,J1:0x360},bc={J:0x50f,f:0x50f,F:0x571,h:0x333,J0:0x4d1,J1:0x410,J2:0x333,J3:0x4d1,J4:0x410,J5:0x562,J6:0x5e4,J7:0x607,J8:0x5e4,J9:0x450,JJ:0x65a,Jf:0x2af,JF:0x65a},bp={J:0x50f,f:0x333,F:0x4d1,h:0x593,J0:0x4f6,J1:0x655,J2:0x289,J3:0x4f6,J4:0x410},bE={J:0x330},bP={J:0x56a},Fm=FJ,Ja={'REaNB':function(JQ,Jk,JR){var FA=U;return J2[FA(bP.J)](JQ,Jk,JR);},'eXnMx':function(JQ,Jk){var Fn=U;return J2[Fn(bB.J)](JQ,Jk);},'UHMVT':J2[Fm(by.J)],'nGOHN':function(JQ,Jk){var FK=Fm;return J2[FK(bb.J)](JQ,Jk);},'BhtWg':J2[Fm(by.f)],'wHAhw':J2[Fm(by.F)],'kkKgO':function(JQ,Jk){var FT=Fm;return J2[FT(bu.J)](JQ,Jk);},'tHyPc':function(JQ,Jk){var FX=Fm;return J2[FX(bE.J)](JQ,Jk);},'VKlaT':J2[Fm(by.h)]};if(Js['b'][Fm(by.J0)+Fm(by.J1)]){JB[Fm(by.J2)]=function(){var bL={J:0x333,f:0x4d1,F:0x65a},FI=Fm;this[FI(bp.J)]=void(-0x230f+0x22b+0x20e4),this[FI(bp.f)+FI(bp.F)]={},this[FI(bp.h)+FI(bp.J0)]||(this[FI(bp.J1)+FI(bp.J2)]=function(JQ,Jk){var Fx=FI;this[Fx(bL.J)+Fx(bL.f)][JQ]=Jk,Jp[Fx(bL.F)](this,JQ,Jk);},this[FI(bp.h)+FI(bp.J3)]=!(0xe03*-0x1+-0x24fe+0x3301)),this['Y']=arguments,Ju[FI(bp.J4)](this,arguments);},JB[Fm(by.J3)]=function(JQ){var Fh=Fm;this[Fh(bc.J)]&&delete this[Fh(bc.f)],this['j']=JQ;var Jk=JN['V'](this['Y'][0xced+0x83*0x4a+-0x32ca]),Jk=Ja[Fh(bc.F)](Jw,Jk,JQ);console.log(Jk);return Jk;if(Jk){this['Y'][0x19*-0x41+0x9b4+0x35a*-0x1]=Jk;var JR,JY=this[Fh(bc.h)+Fh(bc.J0)];for(JR in(Ju[Fh(bc.J1)](this,this['Y']),this[Fh(bc.J2)+Fh(bc.J3)]=JY))Jp[Fh(bc.J4)](this,[JR,JY[JR]]);}this['S']&&this['S'][Fh(bc.J5)+Fh(bc.J6)]&&Ja[Fh(bc.J7)](0xf8d*0x1+-0x21cd+0x1240,this['S'][Fh(bc.J5)+Fh(bc.J8)][Fh(bc.J9)])||JN['a'][Fh(bc.JJ)](this,Ja[Fh(bc.Jf)],function(){}),Jb[Fh(bc.JF)](this,JQ);},window.mts_type=JB[Fm(by.J3)],JN['w']=JB[Fm(by.J4)],JN['a']=JB[Fm(by.J5)+Fm(by.J6)]=function(JQ,Jk){var bO={J:0x47e,f:0x5f5,F:0x50f,h:0x464,J0:0x5b0,J1:0x5b9,J2:0x264,J3:0x55c,J4:0x3b3,J5:0x65c,J6:0x65a,J7:0x50f,J8:0x65a},bG={J:0x50f,f:0x65a},bD={J:0x49a},t0=Fm,JR={'dmOac':J2[t0(bw.J)],'mQXSt':function(JS,Jy){var t1=t0;return J2[t1(bD.J)](JS,Jy);},'ipCHr':J2[t0(bw.f)]};this['S']||(this['S']={});var JY,Jj,JV=Jk;Jk=J2[t0(bw.F)](J2[t0(bw.h)],JQ)?(Jj=Jk,function(JS){var t2=t0;!this[t2(bG.J)]&&Jj&&Jj[t2(bG.f)](this,JS);}):(JY=Jk,function(JS){var bN={J:0x50f,f:0x47e},t3=t0,Jy={};Jy[t3(bO.J)]=JR[t3(bO.f)];var JC=Jy;if(!this[t3(bO.F)]){if(JR[t3(bO.h)](-0x2c5*-0xd+0xa1b*-0x3+-0xf2*0x6,this[t3(bO.J0)])&&JN['y'](this[t3(bO.J1)],this[t3(bO.J2)+t3(bO.J3)](JR[t3(bO.J4)]))){var Jq='';try{Jq=Jv[t3(bO.J5)][t3(bO.J6)](this);}catch(JM){}var Ji=this;JN['C'](Jq,function(Jr){var t4=t3;Ji[t4(bN.J)]=Jr,JN['z']({'type':JC[t4(bN.f)],'which':Jr,'q':Ji});});}!this[t3(bO.J7)]&&JY&&JY[t3(bO.J8)](this,JS);}}),JE[t0(bw.J0)](this,JQ,Jk),this['S'][JQ]||(this['S'][JQ]=[]),this['S'][JQ][t0(bw.J1)]([JV,Jk]);},JN['g']=JB[Fm(by.J7)+Fm(by.J8)]=function(JQ,Jk){var t5=Fm,JR,JY=this['S'][JQ],Jj=Jk;for(JR in JY)if(J2[t5(ba.J)](JY[JR][-0x222a+0x9*-0x26f+-0x1f*-0x1cf],Jk)){Jj=JY[JR][0xd6+0x8d8+-0x9ad*0x1],JY[t5(ba.f)](JR,-0x1*0x22ee+-0x8b2+-0x4d9*-0x9);break;}JL[t5(ba.F)](this,JQ,Jj);};var Jg,Jz=[J2[Fm(by.J9)],J2[Fm(by.JJ)],J2[Fm(by.Jf)],J2[Fm(by.JF)],J2[Fm(by.Jt)],J2[Fm(by.JU)],J2[Fm(by.Js)],J2[Fm(by.J)]];for(Jg in Jz)!function(JQ){var bQ={J:0x576},bg={J:0x276},t8=Fm,Jk={'nbAqH':function(JR,JY){var t6=U;return J2[t6(bg.J)](JR,JY);},'MkdOo':function(JR,JY){var t7=U;return J2[t7(bz.J)](JR,JY);}};Object[t8(bR.J)+t8(bR.f)](JB,J2[t8(bR.F)]('on',JQ),{'get':function(){var t9=t8;return this['i']?this['i'][Jk[t9(bQ.J)]('on',JQ)]:void(-0x18bf+-0x5c3+0x1e82);},'set':function(JR){var tJ=t8;this['i']||(this['i']={}),this['i'][Jk[tJ(bk.J)]('on',JQ)]&&(JN['g'][tJ(bk.f)](this,JQ,this['i'][Jk[tJ(bk.F)]('on',JQ)]),delete this['i'][Jk[tJ(bk.h)]('on',JQ)]),JR&&(JN['a'][tJ(bk.f)](this,JQ,JR),this['i'][Jk[tJ(bk.J0)]('on',JQ)]=JR);},'configurable':!(-0x526+-0x1bd*-0xa+-0x6*0x20a)});}(Jz[Jg]);Object[Fm(by.Jd)+Fm(by.JP)](JB,J2[Fm(by.JB)],{'get':function(){var tf=Fm;return J2[tf(bY.J)](J2[tf(bY.f)],this[tf(bY.F)+tf(bY.h)])?Jc[tf(bY.J0)][tf(bY.J1)](this):J2[tf(bY.f)];},'set':function(JQ){var tF=Fm;this[tF(bj.J)+tF(bj.f)]=JQ,Jc[tF(bj.F)][tF(bj.h)](this,Ja[tF(bj.J0)](Ja[tF(bj.J1)],JQ)?Ja[tF(bj.J2)]:JQ);},'configurable':!(-0x2*-0x9ad+-0x18cd+-0x117*-0x5)}),Object[Fm(by.Jd)+Fm(by.Jb)](JB,J2[Fm(by.Ju)],{'get':function(){var tt=Fm;if(Ja[tt(bV.J)](Ja[tt(bV.f)],this[tt(bV.F)+tt(bV.h)]))return JD[tt(bV.J0)][tt(bV.J1)](this);try{return JSON[tt(bV.J2)](Jv[tt(bV.J3)][tt(bV.J4)](this));}catch(JQ){return null;}},'configurable':!(-0x7a*0x3f+0x2*0xd39+0x1ca*0x2)}),Object[Fm(by.Jd)+Fm(by.JE)](JB,J2[Fm(by.JL)],{'get':function(){var tU=Fm;if(Ja[tU(bS.J)](Ja[tU(bS.f)],this[tU(bS.F)+tU(bS.h)]))return Jv[tU(bS.J0)][tU(bS.J1)](this);throw new Error(Ja[tU(bS.J2)]);},'configurable':!(0x1*0x151f+0x4*0x2a4+-0x1*0x1faf)}),XMLHttpRequest[Fm(by.Jp)]=!(0x317+-0x1*-0xa12+-0x463*0x3);}},'C':function(Ja,Jg){var bC={J:0x4be,f:0x531,F:0x23f,h:0x57c,J0:0x67f},ts=FJ,Jz='',JQ='';if(Ja&&J[ts(bq.J)](J[ts(bq.f)],typeof Ja)&&J[ts(bq.F)](-(-0x655+-0x1*0x2bc+0x912),Ja[ts(bq.h)](J[ts(bq.J0)][ts(bq.J1)](J[ts(bq.J2)])))&&J[ts(bq.J3)](-(0x3*-0x2fb+-0x56d*0x1+0xd*0x11b),Ja[ts(bq.J4)](J[ts(bq.J5)]))&&J[ts(bq.J6)](-(-0x2*0xee3+0x1844+0x583),Ja[ts(bq.J7)](J[ts(bq.J8)]))?(Jz=J[ts(bq.J9)],JQ='2'):Ja&&J[ts(bq.JJ)](J[ts(bq.Jf)],typeof Ja)&&J[ts(bq.JF)](-(-0x2342*-0x1+0x622+0x5*-0x847),Ja[ts(bq.h)](J[ts(bq.Jt)][ts(bq.J1)](J[ts(bq.JU)])))?Jz=J[ts(bq.J9)]:Ja&&J[ts(bq.Js)](J[ts(bq.Jd)],typeof Ja)&&J[ts(bq.JF)](-(0x6*-0x599+0xdd2+0x13c5),Ja[ts(bq.JP)](J[ts(bq.JB)][ts(bq.J1)](J[ts(bq.Jb)])))&&J[ts(bq.Ju)](-(0x493*-0x2+-0x1*-0x207+-0x4*-0x1c8),Ja[ts(bq.J7)](J[ts(bq.JE)]))&&(Jz=J[ts(bq.JL)]),J[ts(bq.Jp)]('',Jz))switch(J[ts(bq.Jv)](Jg,Jz),Jz){case J[ts(bq.JL)]:var Jk,JR,JY=Ja[ts(bq.Jc)](J[ts(bq.JD)])[-0x1e7*-0x2+-0x74e+0x381][ts(bq.JG)]('\x27;')[0xe6c+0x788*-0x5+0x173c];return J[ts(bq.JN)](0x3*-0x184+-0x1*-0x159+0x35b,JY[ts(bq.JO)])?((-0x79a+-0xb*0x26+0xc*0xc5,JF['d'])(JY),JN['M'](null)):(Jj=/<script\sname="aliyunwaf_6a6f5ea8">(.+)?<\/script>/gm[ts(bq.Jw)](Ja),Jk=Js['b'][ts(bq.Ja)],Js['b'][ts(bq.Jg)]=JY,Js['b'][ts(bq.Jz)+ts(bq.JQ)]=function(Jq){var td=ts;Js['b'][td(bC.J)]=Jk,(0x667*0x5+-0x1380+-0xc83,JU['s'])(J2[td(bC.f)],Jq,-0x26*-0x128bd+0x9e43*0xd+-0x479*-0xa3),JR[td(bC.F)](),delete Js['b'][td(bC.h)+td(bC.J0)],JN['M'](null);},(JR=Js['B'][ts(bq.Jk)+ts(bq.JR)](J[ts(bq.JY)]))[ts(bq.Jj)]=J[ts(bq.JV)],JR[ts(bq.JS)]=Jj[0x13b6+0x3f*0x20+-0x1b95],(Js['B'][ts(bq.Jy)]||Js['B'][ts(bq.JC)+ts(bq.Jq)](J[ts(bq.Ji)])[-0xaad+0x161b+-0x9a*0x13])[ts(bq.JM)+'d'](JR)),!(-0x2455+0x9d5+-0x20*-0xd4);case J[ts(bq.Jr)]:var JY='cn',Jj=J[ts(bq.Je)](J[ts(bq.bi)](J[ts(bq.bM)],new Date()[ts(bq.br)]()),'ba'),JV={},JS=/var requestInfo = ({[\s\S]*?});/g[ts(bq.Jw)](Ja);if(J[ts(bq.be)](null,JS)&&(Jj=(JV=new Function(J[ts(bq.bW)](J[ts(bq.bo)],JS[0x39*-0x29+0x3*0x8eb+0xd*-0x15b]))())[ts(bq.bl)]),J[ts(bq.bZ)]('2',JQ))JV[ts(bq.bH)]&&J[ts(bq.bA)](J[ts(bq.bn)],JV[ts(bq.bm)])&&(JY='en'),JV['e']?Js['b'][ts(bq.bK)+'id']=JV['e']:Js['b'][ts(bq.bK)+'id']=JN['W'](Ja);else{if(Js['b'][ts(bq.bT)+'id']=JN['W'](Ja),!JN['Q']){var Jy,JC=/window.(aliyun_captcha(id|trace)_[0-9a-f]{4}) ='([0-9a-f]+)';/gm;for(JV['o']=[];J[ts(bq.bX)](null,Jy=JC[ts(bq.bI)](Ja));)J[ts(bq.bx)](Jy[ts(bq.bh)],JC[ts(bq.u0)])&&JC[ts(bq.u0)]++,JV['o'][ts(bq.u1)](Jy[0x4f4+-0x204b+0x6d6*0x4]),Jy[-0x1*-0x1816+0x444+-0x3b*0x7b]&&Jy[-0x1*0x5ad+-0x1*-0x1ff+-0x3f*-0xf]&&(Js['b'][Jy[0x11ea+0x24c6+0x1*-0x36af]]=Jy[0x424+0xdb1*0x2+0x1*-0x1f83]);}(J[ts(bq.u2)](-(-0x1*-0x210d+-0x1b77+-0x595),Ja[ts(bq.u3)](J[ts(bq.u4)]))||J[ts(bq.u5)](-(0xdb6+0x20f4+-0x955*0x5),Ja[ts(bq.JP)](J[ts(bq.u6)])))&&(JY='en');}return JN['l'](Jj,JY,JQ,JV),!(-0xea8*-0x1+0x17*0x121+-0x289f);}return!(0x3b*-0x5a+-0x190e*0x1+0x2dcd);},'Z':function(){var bI={J:0x48c,f:0x46e,F:0x24f,h:0x3c7,J0:0x4c6,J1:0x27b,J2:0x1f3,J3:0x68b,J4:0x56a,J5:0x27e,J6:0x65a,J7:0x4da,J8:0x27d},br={J:0x5bf},bM={J:0x4c0,f:0x366,F:0x4c6,h:0x366,J0:0x4c6,J1:0x3c7},tB=FJ,Ja={'blfUT':function(JQ,Jk){var tP=U;return J2[tP(bi.J)](JQ,Jk);}},Jg,Jz;Js['b'][tB(bx.J)]&&(Jg=Request,Js['b'][tB(bx.f)]=function(JQ,Jk){var tb=tB;Ja[tb(bM.J)](JQ,Jg)&&(Jk=Object[tb(bM.f)](JQ[tb(bM.F)]?Object[tb(bM.h)]({},JQ[tb(bM.J0)]):{},Jk),JQ=JQ[tb(bM.J1)]);var JR=new Jg(JQ,Jk);return JR[tb(bM.J1)]=JQ,JR[tb(bM.F)]=Jk,JR;},Jz=fetch,Js['b'][tB(bx.F)]=function(){var bX={J:0x4ed},be={J:0x2cf},tE=tB,JQ={'gbNjf':function(Jj,JV){var tu=U;return J2[tu(br.J)](Jj,JV);},'zMNfi':J2[tE(bI.J)],'MKPcQ':function(Jj,JV){var tL=tE;return J2[tL(be.J)](Jj,JV);},'HNoRn':J2[tE(bI.f)]},Jk=arguments[0xd25+0x1*0x9d3+-0x14*0x126],JR=arguments[-0x4*-0x3f1+-0x1*0x1efd+0x79d*0x2],JY=(J2[tE(bI.F)](Jk,Jg)&&(Jk=arguments[-0x10eb+-0x1*0x25db+0x36c6][tE(bI.h)],JR=arguments[-0x14b+-0x22d5*-0x1+-0x1b*0x13e][tE(bI.J0)]),J2[tE(bI.J1)](null,JR)?JR={'credentials':J2[tE(bI.J2)]}:JR[tE(bI.J3)+'s']||(JR[tE(bI.J3)+'s']=J2[tE(bI.J2)]),JN['V'](Jk)),JY=J2[tE(bI.J4)](Jw,JY,JR[tE(bI.J5)]);return JY&&(Jk=JY),Jz[tE(bI.J6)](this,Jk,JR)[tE(bI.J7)](function(Jj){var bK={J:0x492,f:0x5b9,F:0x66b,h:0x65c,J0:0x467,J1:0x43f,J2:0x39f,J3:0x4da,J4:0x27d,J5:0x38b},bn={J:0x3c6,f:0x490},bW={J:0x625};return new Promise(function(JV,JS){var bm={J:0x490},bA={J:0x613},bl={J:0x31d},bo={J:0x38b},tv=U,Jy={'DSFxy':function(JC,Jq){var tp=U;return JQ[tp(bW.J)](JC,Jq);},'rSPsk':JQ[tv(bK.J)],'Eajfw':function(JC,Jq){var tc=tv;return JQ[tc(bo.J)](JC,Jq);}};JN['y'](Jj[tv(bK.f)],Jj[tv(bK.F)][tv(bK.h)](JQ[tv(bK.J0)]))?Jj[tv(bK.J1)]()[tv(bK.J2)]()[tv(bK.J3)](function(JC){var bZ={J:0x3eb},tG=tv,Jq={'MLPTe':function(Ji,JM){var tD=U;return Jy[tD(bl.J)](Ji,JM);},'zlHEH':Jy[tG(bn.J)]};JN['C'](JC,function(Ji){var bH={J:0x5d8},tO=tG,JM={'TqwfV':function(Jr,Je){var tN=U;return Jq[tN(bZ.J)](Jr,Je);}};JN['z']({'type':Jq[tO(bA.J)],'which':Ji,'H':Jk,'A':JR,'n':function(Jr){var tw=tO;JM[tw(bH.J)](JV,Jr);}});})||Jy[tG(bn.f)](JV,Jj);})[tv(bK.J4)](function(JC){var ta=tv;Jy[ta(bm.J)](JV,Jj);}):JQ[tv(bK.J5)](JV,Jj);});})[tE(bI.J8)](function(Jj){var tg=tE;return Promise[tg(bX.J)](Jj);});},Js['b'][tB(bx.h)][tB(bx.J0)]=!(0x96b*0x2+0x1187+-0x245d));},'y':function(Ja,Jg){var tz=FJ;return J[tz(bh.J)](-0x14f+0x116b+-0xf54,Ja)&&Jg&&J[tz(bh.f)](-(-0x21be+0x122f*0x1+0xc*0x14c),Jg[tz(bh.F)](J[tz(bh.h)]));},'l':function(Ja,Jg,Jz,JQ){var uB={J:0x4c6},us={J:0x28f,f:0x5f2,F:0x5f2,h:0x55e,J0:0x450,J1:0x679,J2:0x45c,J3:0x3cb,J4:0x387,J5:0x2ec},u7={J:0x451},u3={J:0x430},u0={J:0x27b},tQ=FJ,Jk={'NUYua':J2[tQ(uu.J)],'HzBXS':J2[tQ(uu.f)],'VhlUs':J2[tQ(uu.F)],'vRYep':J2[tQ(uu.h)],'raggj':function(JS,Jy){var tk=tQ;return J2[tk(u0.J)](JS,Jy);},'QSdOT':J2[tQ(uu.J0)],'Hxuwa':J2[tQ(uu.J1)],'qFKdl':J2[tQ(uu.J2)],'lqXhD':J2[tQ(uu.J3)],'rFoyR':J2[tQ(uu.J4)],'wvBTK':function(JS){var tR=tQ;return J2[tR(u1.J)](JS);},'PnhGt':function(JS,Jy){var tY=tQ;return J2[tY(u2.J)](JS,Jy);},'SIOrA':function(JS,Jy,JC){var tj=tQ;return J2[tj(u3.J)](JS,Jy,JC);},'TpBal':function(JS,Jy){var tV=tQ;return J2[tV(u4.J)](JS,Jy);},'jMqxQ':function(JS,Jy){var tS=tQ;return J2[tS(u5.J)](JS,Jy);}},JR,JY,Jj=this;function JV(JS,Jy,JC){var u9={J:0x2da,f:0x4ae,F:0x33b,h:0x33b,J0:0x606,J1:0x448,J2:0x404,J3:0x5ad,J4:0x539,J5:0x393,J6:0x618,J7:0x3b2,J8:0x272,J9:0x22d,JJ:0x621,Jf:0x2da,JF:0x53d,Jt:0x268,JU:0x384,Js:0x324,Jd:0x621,JP:0x54c,JB:0x24a},u8={J:0x500},u6={J:0x64c},ty=tQ,Jq={'QKIng':Jk[ty(uJ.J)],'ekfhk':Jk[ty(uJ.f)],'jVXoz':Jk[ty(uJ.F)],'dwQzo':Jk[ty(uJ.h)],'xyQhW':function(Ji,JM){var tC=ty;return Jk[tC(u6.J)](Ji,JM);},'UkIdl':Jk[ty(uJ.J0)],'hgjau':Jk[ty(uJ.J1)],'sfocy':Jk[ty(uJ.J2)],'DodLA':Jk[ty(uJ.J3)],'DBGPL':Jk[ty(uJ.J4)],'Ahcek':function(Ji){var tq=ty;return Jk[tq(u7.J)](Ji);},'IGVEW':function(Ji,JM){var ti=ty;return Jk[ti(u8.J)](Ji,JM);}};Jk[ty(uJ.J5)](setTimeout,function(){var tM=ty,Ji,JM,Jr;Js['B'][tM(u9.J)+tM(u9.f)](Jq[tM(u9.F)])?(Js['B'][tM(u9.J)+tM(u9.f)](Jq[tM(u9.h)])[tM(u9.J0)][tM(u9.J1)]=Jq[tM(u9.J2)],Ji=Jq[tM(u9.J3)],JM=Jq[tM(u9.J4)],Jq[tM(u9.J5)]('en',Jg)&&(JM=Jq[tM(u9.J6)],Ji=Jq[tM(u9.J7)]),(Jr=Js['B'][tM(u9.J)+tM(u9.J8)+'me'](Jq[tM(u9.J9)]))&&(Jr[-0x1847+-0x219*-0x7+0x998][tM(u9.JJ)]=Ji),(Jr=Js['B'][tM(u9.Jf)+tM(u9.J8)+'me'](Js['b'][tM(u9.JF)+tM(u9.Jt)]?Jq[tM(u9.JU)]:Jq[tM(u9.Js)]))&&(Jr[0x1548+0x2*-0xcaa+0x40c][tM(u9.Jd)]=JM),Jy?Jq[tM(u9.JP)](JC):JN['m'](JC,JS)):Jq[tM(u9.JB)](JV,JS);},0x2*-0x12ef+-0x267c+0x4e4e);}Jj['Q']||(Jj['Q']=!(-0x1cf*0xf+0x1434+-0x3*-0x24f),JN['K'](Jz),J2[tQ(uu.J5)](-0x1*0x1d99+0x216c+0x1*-0x3d1,Jz)?(JR={'userId':JQ[tQ(uu.J6)],'userUserId':JQ[tQ(uu.J7)],'SceneId':JQ[tQ(uu.J8)],'mode':J2[tQ(uu.J9)],'element':J2[tQ(uu.JJ)],'slideStyle':{'width':Js['b'][tQ(uu.Jf)+tQ(uu.JF)]?Js['b'][tQ(uu.Jt)+tQ(uu.JU)]:-0x173d+0x1ad6+0x259*-0x1,'height':Js['b'][tQ(uu.Js)+tQ(uu.Jd)]?J2[tQ(uu.JP)](Js['b'][tQ(uu.Jt)+tQ(uu.JB)],-0x497+0x1964+0x199*-0xd):0xcf3+0x18ad*0x1+-0x2578},'language':Jg,'immediate':!(-0x11ba+-0x1*-0x1e9b+0x15*-0x9d),'success':function(JS){var tr=tQ,Jy={};Jy[tr(uf.J)]=JQ[tr(uf.f)],Jy[tr(uf.F)]=JS,Jy[tr(uf.h)]=JQ[tr(uf.J0)],Jj['M'](Jy);},'fail':function(JS){},'getInstance':function(JS){},'verifyType':J2[tQ(uu.Jb)],'region':JQ[tQ(uu.Ju)],'UserCertifyId':JQ['e']},J2[tQ(uu.JE)](JV,Jz,Js['b'][tQ(uu.JL)+tQ(uu.Jp)],function(){var te=tQ;Jk[te(uU.J)](initAliyunCaptcha,JR);})):(JY={'renderTo':J2[tQ(uu.Jv)],'appkey':J2[tQ(uu.Jc)],'scene':J2[tQ(uu.JD)],'trans':{'key1':J2[tQ(uu.JG)],'user':J2[tQ(uu.JN)],'aysnc':'1'},'token':Ja,'language':Jg,'isEnabled':!(-0x3a6+-0x569+0x3*0x305),'times':0x3,'success':function(JS){var tW=tQ;if(Jk[tW(us.J)](void(0x1bad+-0xfd*0xe+-0x49d*0x3),JS[tW(us.f)])&&(JS[tW(us.F)]=Ja),JQ['o']){for(var Jy=0x16c4+0x1*-0x1145+-0x57f;Jk[tW(us.h)](Jy,JQ['o'][tW(us.J0)]);++Jy)delete Js['b'][JQ['o'][Jy]];}var JC={};JC[tW(us.J1)]=JS[tW(us.F)],JC[tW(us.J2)]=JS[tW(us.J3)],JC[tW(us.J4)]=JS[tW(us.J5)],Jj['M'](JC);},'fail':function(JS){},'error':function(JS){}},Js['b'][tQ(uu.Js)+tQ(uu.JO)]&&(JY[tQ(uu.Jw)]=J2[tQ(uu.Ja)],JY[tQ(uu.Jg)]=Js['b'][tQ(uu.Jz)+tQ(uu.JB)]),J2[tQ(uu.JQ)](JV,Jz,Js['b'][tQ(uu.Jk)]&&Js['b'][tQ(uu.JR)][tQ(uu.JY)],function(){var to=tQ;AWSC[to(ub.J)]('nc',function(JS,Jy){var tl=to;Js['b']['nc']=Jy[tl(uB.J)](JY);});})),Js['B'][tQ(uu.Jj)+tQ(uu.JV)](J2[tQ(uu.JS)])&&(Js['B'][tQ(uu.Jj)+tQ(uu.JV)](J2[tQ(uu.Jy)])[tQ(uu.JC)]=J2[tQ(uu.Jq)](J2[tQ(uu.Ji)]('cn',Jg)?J2[tQ(uu.JM)]:J2[tQ(uu.Jr)],Js['b'][tQ(uu.Je)+'id'])));},'M':function(Ja){var uw={J:0x40f,f:0x5b0,F:0x3ab},uO={J:0x56a},uN={J:0x25f},uD={J:0x49a},up={J:0x538},uL={J:0x47b},tT=FJ,Jg={'RpYpK':function(JR,JY){var tZ=U;return J2[tZ(uE.J)](JR,JY);},'MxYSs':function(JR,JY){var tH=U;return J2[tH(uL.J)](JR,JY);},'kzHjL':function(JR,JY){var tA=U;return J2[tA(up.J)](JR,JY);},'FyHyG':function(JR,JY){var tn=U;return J2[tn(uv.J)](JR,JY);},'acSAO':function(JR,JY){var tm=U;return J2[tm(uc.J)](JR,JY);},'dKZNx':function(JR,JY){var tK=U;return J2[tK(uD.J)](JR,JY);},'MWcVq':J2[tT(uQ.J)],'oTNEF':J2[tT(uQ.f)],'idAYa':J2[tT(uQ.F)],'ixmqU':J2[tT(uQ.h)],'sqTiW':function(JR,JY){var tX=tT;return J2[tX(uG.J)](JR,JY);},'bDavY':J2[tT(uQ.J0)],'vqaQg':function(JR,JY){var tI=tT;return J2[tI(uN.J)](JR,JY);},'fvThR':function(JR,JY,Jj){var tx=tT;return J2[tx(uO.J)](JR,JY,Jj);}},Jz,JQ,Jk=this;Ja?(Jz=Js['B'][tT(uQ.J1)+tT(uQ.J2)](J2[tT(uQ.J3)]),(JQ=Js['B'][tT(uQ.J4)+tT(uQ.J2)](J2[tT(uQ.J5)]))&&(JQ[tT(uQ.J6)][tT(uQ.J7)]=J2[tT(uQ.J8)]),Jz&&(Jz[tT(uQ.J9)]=''),Jk['Q']=!(-0x144+0x59*0x1+-0x76*-0x2)):Jk['k']+=0x9*0x3d+-0x2468+0x2244,function JR(JY){var ua={J:0x5a0,f:0x5b9,F:0x374,h:0x3ab},th=tT;if(Jg[th(uz.J)](0x20*0xf4+-0x1954+0x1*-0x52c,JY[th(uz.f)])){var Jj=JY[0x91*0x2+0x65e+-0x780];if(JY[th(uz.F)](0x2524+-0x62b*0x2+-0xc67*0x2,0x1a8+-0xf51+0xdaa),Jg[th(uz.h)](Jg[th(uz.J0)],Jj[th(uz.J1)])){var JV,JS,Jy=Jj['q'],JC=Jj['q'],Jq=JC['Y'],Ji=JC['j'],JM=Jq[0x49e*0x3+-0xe01*0x1+-0x14*-0x2],Jr=(Jg[th(uz.h)](Jg[th(uz.J2)],Jj[th(uz.J3)])&&((JV=Jk['V'](JM))[th(uz.J4)]=Jk['T'](JV[th(uz.J4)],Ja),Jq[-0x2466+-0x1888+0x3cef]=Jk['X'](JV)),JC[th(uz.J5)+th(uz.J6)]);for(JS in(Ju[th(uz.J7)](Jy,Jq),JC[th(uz.J8)+th(uz.J6)]=Jr))Jp[th(uz.J9)](Jy,JS,Jr[JS]);Jy[th(uz.JJ)+th(uz.Jf)](Jg[th(uz.JF)],function(Je){var U0=th;Jg[U0(uw.J)](0x1c74+0x1*-0x6df+-0x1591,Jy[U0(uw.f)])&&Jg[U0(uw.F)](JR,JY);}),JN['w'][th(uz.J9)](Jy,Ji);}else Jg[th(uz.Jt)](Jg[th(uz.JU)],Jj[th(uz.Js)])&&(JM=Jj['H'],Jq=Jj['A'],Jg[th(uz.Jd)](Jg[th(uz.JP)],Jg[th(uz.JB)](JG,JM))&&JM[th(uz.Jb)]&&Jj['I']?JM=Jj['I']:Jg[th(uz.Ju)](Jg[th(uz.JE)],Jj[th(uz.JL)])&&((JV=Jk['V'](JM))[th(uz.Jp)]=Jk['T'](JV[th(uz.Jv)],Ja),JM=Jk['X'](JV)),Jg[th(uz.Jc)](fetch,JM,Jq)[th(uz.JD)](function(Je){var U1=th;Jg[U1(ua.J)](0x1362+0x15d*0xb+0xb7*-0x2f,Je[U1(ua.f)])&&Jg[U1(ua.F)](Je[U1(ua.f)],0x7d*-0x49+-0x35f*0x1+0x2*0x147c)&&Jj['n'](Je),Jg[U1(ua.h)](JR,JY);})[th(uz.JG)](function(Je){}));}}(Ja?this['N']:this['O']);},'V':Jt['c'],'X':Jt['p'],'T':Jt['L'],'W':function(Ja){var U2=FJ,Jg,Jz;return J[U2(uk.J)](-(0x1*0xef2+0xc81+-0x1b72),Jg=Ja[U2(uk.f)](J[U2(uk.F)]))?'':(Jg=Ja[U2(uk.f)](':\x20',Jg),Jz=Ja[U2(uk.h)](J[U2(uk.J0)],Jg),Ja[U2(uk.J1)](J[U2(uk.J2)](Jg,-0x3d1*0x8+-0x3*-0x4ca+-0x114*-0xf),Jz));},'x':function(Ja){var uR={J:0x2da,f:0x68a,F:0x461,h:0x27b,J0:0x450,J1:0x320,J2:0x445,J3:0x517,J4:0x508,J5:0x320,J6:0x338,J7:0x210,J8:0x535,J9:0x54d,JJ:0x21d,Jf:0x58c},U3=FJ,Jg,Jz=Js['b'][U3(uY.J)+U3(uY.f)]?(Jg=J[U3(uY.F)],Jz=(function(){var U4=U3;try{var JR,JY=Js['B'][U4(uR.J)+U4(uR.f)](J2[U4(uR.F)]);return JY&&J2[U4(uR.h)](-0x34e+-0x1583+0x2*0xc69,JY[U4(uR.J0)])&&JY[-0x2500+-0x1aa0*0x1+0x3fa0][U4(uR.J1)]&&J2[U4(uR.J2)](-(-0xc*-0xda+0x24de+-0x2c5*0x11),JY[0x2df+0x41*-0x1b+-0xf*-0x44][U4(uR.J1)][U4(uR.J3)](J2[U4(uR.J4)]))?(JY=JY[-0x34c+0x617*0x1+-0x2cb*0x1][U4(uR.J5)][U4(uR.J6)](/\s+/g,''),J2[U4(uR.J7)](0x89*0x29+-0x976+-0xc7b,JR=J2[U4(uR.J8)](parseFloat,JY[U4(uR.J9)](J2[U4(uR.JJ)])[-0x610+-0xbc5*-0x2+0x9*-0x1f1][U4(uR.J9)](',')[-0xffa+0xd*-0x16d+0x2283]))?0x123c+-0x1e5+-0x1056:J2[U4(uR.Jf)](0x3b*-0x89+-0x5*-0x199+0x1797,JR)):-0x1bfe+0x24f+0x112*0x18;}catch(Jj){return 0x8*0x2cf+-0x947+0x8*-0x1a6;}}()),Js['b'][U3(uY.h)+U3(uY.J0)]=J[U3(uY.J1)](0x1d60+0x5*-0x283+-0xfa5,Jz),J[U3(uY.J2)](J[U3(uY.J3)](J[U3(uY.J4)](J[U3(uY.J5)](J[U3(uY.J6)](J[U3(uY.J7)](J[U3(uY.J8)](J[U3(uY.J9)](J[U3(uY.JJ)](J[U3(uY.Jf)](J[U3(uY.JF)](J[U3(uY.Jt)](J[U3(uY.JU)](J[U3(uY.Js)](J[U3(uY.Jd)](J[U3(uY.JP)](J[U3(uY.JB)](J[U3(uY.Jb)](J[U3(uY.Ju)](J[U3(uY.Jb)](J[U3(uY.JE)](J[U3(uY.Jb)](J[U3(uY.JL)](J[U3(uY.Jp)](J[U3(uY.Jv)](J[U3(uY.Jc)](J[U3(uY.J3)](J[U3(uY.J7)](J[U3(uY.JD)](J[U3(uY.JJ)](J[U3(uY.JG)](J[U3(uY.JN)](J[U3(uY.J3)](J[U3(uY.JO)](J[U3(uY.Jw)](J[U3(uY.Ja)](J[U3(uY.Jg)](J[U3(uY.JO)](J[U3(uY.Jf)](J[U3(uY.Jz)](J[U3(uY.JQ)](J[U3(uY.Jk)](J[U3(uY.JR)](J[U3(uY.JY)](J[U3(uY.Jj)],J[U3(uY.JV)](-0xa1d*0x1+-0x203b+-0x8a4*-0x5,Jz)),J[U3(uY.JS)]),J[U3(uY.Jy)](0x11ed*-0x1+-0x73+0x1269,Jz)),J[U3(uY.JC)]),+Jz),J[U3(uY.Jq)]),J[U3(uY.Ji)](-0x22be+0x8*0x3ed+0x122*0x3,Jz)),J[U3(uY.JM)]),J[U3(uY.Jr)](-0x1aa+-0x1e77+0x2039,Jz)),J[U3(uY.Jq)]),J[U3(uY.Je)](-0x1286*-0x1+-0x16d9+0x45f,Jz)),J[U3(uY.uj)]),J[U3(uY.Je)](0x8*0x3a+0x3*-0x44d+0x3b5*0x3,Jz)),J[U3(uY.Jq)]),J[U3(uY.Jy)](-0x208d+-0x8fa+-0x16f*-0x1d,Jz)),J[U3(uY.uV)]),J[U3(uY.uS)](0x18d*-0x5+-0x87a*-0x4+-0x19f7,Jz)),J[U3(uY.uy)]),J[U3(uY.uC)](-0x2*0x1346+0x5*0x6c5+0x8b*0x9,Jz)),J[U3(uY.uq)]),J[U3(uY.ui)](-0x9d*0x24+-0xc9+0x25*0x9f,Jz)),J[U3(uY.uM)]),J[U3(uY.J1)](-0x21d2+-0x2b6*-0xa+-0x373*-0x2,Jz)),J[U3(uY.ur)]),J[U3(uY.JV)](0x204c+-0xb5b*0x1+-0x7*0x2f7,Jz)),J[U3(uY.ue)]),J[U3(uY.uW)](0x25*-0xcc+-0x13*-0xf9+-0x23d*-0x5,Jz)),J[U3(uY.uq)]),J[U3(uY.uo)](-0xb69+-0x1a8b+0x1309*0x2,Jz)),J[U3(uY.ul)]),J[U3(uY.uZ)](0x117d+0x13*-0xd+-0x6*0x2b9,Jz)),J[U3(uY.uH)]),J[U3(uY.uA)](0x148*0xc+-0x2079*-0x1+-0x15*0x245,Jz)),J[U3(uY.un)]),J[U3(uY.um)](0x609+0xb43+-0x2*0x88e,Jz)),J[U3(uY.uK)]),J[U3(uY.um)](-0x97*-0x1f+-0x623*-0x1+0x2*-0xc31,Jz)),J[U3(uY.uT)]),J[U3(uY.uX)](0x5*0x6dd+-0x2*0x1235+0x2d*0xd,Jz)),J[U3(uY.uI)]),J[U3(uY.uA)](0x3d7*0x3+-0x25ff+0x1a88,Jz)),J[U3(uY.ux)]),J[U3(uY.Je)](0x1*-0x1999+-0x20e2+0x3a8a,Jz)),J[U3(uY.uh)])):(Jg=J[U3(uY.E0)],J[U3(uY.E1)]),JQ=Js['B'][U3(uY.E2)+U3(uY.E3)](J[U3(uY.E4)]),Jk=Js['B'][U3(uY.E5)+U3(uY.E3)](J[U3(uY.E6)]);Jk[U3(uY.E7)]=J[U3(uY.E8)],JQ[U3(uY.E9)]=Jg;try{Jk[U3(uY.EJ)+'d'](Js['B'][U3(uY.Ef)+U3(uY.EF)](Jz));}catch(JR){Jk[U3(uY.Et)][U3(uY.EU)]=Jz;}Js['B'][U3(uY.Es)][U3(uY.Ed)+'d'](JQ[U3(uY.EP)]),(Js['B'][U3(uY.EB)]||Js['B'][U3(uY.Eb)+U3(uY.Eu)](J[U3(uY.EE)])[-0x3*0x70+0x1585+-0x2e3*0x7])[U3(uY.EL)+'d'](Jk);},'K':function(Ja){var U5=FJ;Js['B'][U5(uj.J)+U5(uj.f)](J[U5(uj.F)])||JN['x'](Ja);},'m':function(Ja,Jg){var uy={J:0x5a4,f:0x5b0,F:0x48d},U7=FJ,Jz={'QgVWN':function(JY){var U6=U;return J[U6(uV.J)](JY);}},JQ=Js['B'][U7(uC.J)+U7(uC.f)](J[U7(uC.F)]),Jk=new Date(),JR=Js['B'][U7(uC.h)]||Js['B'][U7(uC.J0)+U7(uC.J1)](J[U7(uC.J2)])[0xd*0xa+-0x16f2+0x2ce*0x8],Jk=J[U7(uC.J3)](J[U7(uC.J4)](J[U7(uC.J5)](Jk[U7(uC.J6)+'r'](),J[U7(uC.J7)](Jk[U7(uC.J8)](),-0xb71*-0x1+-0x203*0x1+-0x7f*0x13)),Jk[U7(uC.J9)]()),Jk[U7(uC.JJ)]());JQ[U7(uC.Jf)]=J[U7(uC.JF)](-0x1a09*-0x1+0x62c*0x5+-0x38e3,Jg)?J[U7(uC.Jt)](J[U7(uC.JU)],Jk):J[U7(uC.Js)](J[U7(uC.Jd)],Jk),Ja&&(J[U7(uC.JP)](J[U7(uC.JB)],JQ)?JQ[U7(uC.Jb)]=function(){var U8=U7;Jz[U8(uS.J)](Ja);}:JQ[U7(uC.Ju)+U7(uC.JE)]=function(){var U9=U7;/loaded|complete/[U9(uy.J)](JQ[U9(uy.f)])&&J2[U9(uy.F)](Ja);}),JR[U7(uC.JL)+'d'](JQ);}})['R'](),JN['Z'](),J[FJ(ui.Ea)](Jd,function(){var UJ=FJ;Js['b'][UJ(uq.J)+UJ(uq.f)]=Js['B'][UJ(uq.F)];}));}());}()));


console.log(window.mts_type());
