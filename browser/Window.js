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