window = mframe.memory.config.nodeEnv ? global : this;
var Window = function Window() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Window)
Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        configurable: true,
    }
})


//////////////////////////////////
// 常量
Window.prototype.PERSISTENT = 1;
Window.prototype.TEMPORARY = 0;

/////////////////////////////////////////////////////////
// 方法
window["btoa"] = function btoa(stringToEncode) {
    var res = undefined;
    if (mframe.memory.jsdom.window) { // 如果有jsdomn
        res = mframe.memory.jsdom.window.btoa(stringToEncode);
    }
    mframe.log({ flag: 'function', className: 'window', methodName: 'btoa', inputVal: arguments, res: res });
}; mframe.safefunction(window["btoa"]);
// setTimeout
window.setTimeout = function setTimeout() {
    var res = undefined;
    mframe.log({ flag: 'function', className: 'window', methodName: 'setTimeout', inputVal: arguments, res: res });
}; mframe.safefunction(window.setTimeout);
// clearInterval
window["clearInterval"] = function clearInterval() {
    var res = undefined;
    mframe.log({ flag: 'function', className: 'window', methodName: 'clearInterval', inputVal: arguments, res: res });
}; mframe.safefunction(window["clearInterval"]);
// setInterval
window["setInterval"] = function setInterval() {
    var res = undefined;
    mframe.log({ flag: 'function', className: 'window', methodName: 'setInterval', inputVal: arguments, res: res });
}; mframe.safefunction(window["setInterval"]);


// CanvasRenderingContext2D
window["CanvasRenderingContext2D"] = function CanvasRenderingContext2D() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'CanvasRenderingContext2D', inputVal: arguments, res: res });
}; mframe.safefunction(window["CanvasRenderingContext2D"]);
// WebSocket
window["WebSocket"] = function WebSocket() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'WebSocket', inputVal: arguments, res: res });
}; mframe.safefunction(window["WebSocket"]);
// open
window["open"] = function open() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'open', inputVal: arguments, res: res });
}; mframe.safefunction(window["open"]);
// prompt
window["prompt"] = function prompt() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'prompt', inputVal: arguments, res: res });
}; mframe.safefunction(window["prompt"]);


///////////////////////////////////////////////////
// 属性
window.top = window;
window.self = window;
ActiveXObject = undefined; // 这个东西很多网站都查,且理论上也应该手动赋值undefined

///////////////////////////////////////////////////
// mframe原型链
window.screen = screen;
window.localStorage = localStorage;
window.sessionStorage = sessionStorage;
//////////////////////////////////

/** 小变量定义 && 原型链的定义 */
Window.prototype.__proto__ = WindowProperties.prototype;
window.__proto__ = Window.prototype;

/**代理 */
Window = mframe.proxy(Window)
window = mframe.proxy(window)
