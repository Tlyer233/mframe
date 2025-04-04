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