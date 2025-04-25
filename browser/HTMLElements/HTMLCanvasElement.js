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

//%%%%%%% Attribute START %%%%%
// width
curMemoryArea.width_getter = function width() { debugger; }; mframe.safefunction(curMemoryArea.width_getter);
Object.defineProperty(curMemoryArea.width_getter, "name", {value: "get width",configurable: true,});
// width
curMemoryArea.width_setter = function width(val) {
    this._width = val; 
    this.jsdomMemory.width = val; 
    mframe.log({ flag: 'property', className: 'HTMLCanvasElement', propertyName: 'width', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.width_setter);
Object.defineProperty(curMemoryArea.width_setter, "name", {value: "set width",configurable: true,});
Object.defineProperty(HTMLCanvasElement.prototype, "width", {get: curMemoryArea.width_getter,set: curMemoryArea.width_setter,enumerable: true,configurable: true,});
curMemoryArea.width_smart_getter = function width() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._width !== undefined ? this._width : this.jsdomMemory.width; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLCanvasElement', propertyName: 'width', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.width_smart_getter);
HTMLCanvasElement.prototype.__defineGetter__("width", curMemoryArea.width_smart_getter);

// height
curMemoryArea.height_getter = function height() { debugger; }; mframe.safefunction(curMemoryArea.height_getter);
Object.defineProperty(curMemoryArea.height_getter, "name", {value: "get height",configurable: true,});
// height
curMemoryArea.height_setter = function height(val) {
    this._height = val; 
    this.jsdomMemory.height = val; 
    mframe.log({ flag: 'property', className: 'HTMLCanvasElement', propertyName: 'height', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.height_setter);
Object.defineProperty(curMemoryArea.height_setter, "name", {value: "set height",configurable: true,});
Object.defineProperty(HTMLCanvasElement.prototype, "height", {get: curMemoryArea.height_getter,set: curMemoryArea.height_setter,enumerable: true,configurable: true,});
curMemoryArea.height_smart_getter = function height() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._height !== undefined ? this._height : this.jsdomMemory.height; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLCanvasElement', propertyName: 'height', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.height_smart_getter);
HTMLCanvasElement.prototype.__defineGetter__("height", curMemoryArea.height_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLCanvasElement.prototype["captureStream"] = function captureStream() {
    var res = this.jsdomMemory["captureStream"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'captureStream', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["captureStream"]);
HTMLCanvasElement.prototype["getContext"] = function getContext() {
    var res = this.jsdomMemory["getContext"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'getContext', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["getContext"]);
HTMLCanvasElement.prototype["toBlob"] = function toBlob() {
    var res = this.jsdomMemory["toBlob"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'toBlob', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["toBlob"]);
HTMLCanvasElement.prototype["toDataURL"] = function toDataURL() {
    var res = this.jsdomMemory["toDataURL"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'toDataURL', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["toDataURL"]);
HTMLCanvasElement.prototype["transferControlToOffscreen"] = function transferControlToOffscreen() {
    var res = this.jsdomMemory["transferControlToOffscreen"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'transferControlToOffscreen', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["transferControlToOffscreen"]);
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