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