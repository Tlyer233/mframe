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
var curMemoryArea = mframe.memory.HTMLHtmlElement = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// version
curMemoryArea.version_getter = function version() { return this._version; }; mframe.safefunction(curMemoryArea.version_getter);
Object.defineProperty(curMemoryArea.version_getter, "name", { value: "get version", configurable: true, });
// version
curMemoryArea.version_setter = function version(val) { 
    this.jsdomMemory.version = val; 
    mframe.log({ flag: 'property', className: 'HTMLHtmlElement', propertyName: 'version', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.version_setter);
Object.defineProperty(curMemoryArea.version_setter, "name", { value: "set version", configurable: true, });
Object.defineProperty(HTMLHtmlElement.prototype, "version", { get: curMemoryArea.version_getter, set: curMemoryArea.version_setter, enumerable: true, configurable: true, });
curMemoryArea.version_smart_getter = function version() {
    var res = this.jsdomMemory.version;
    mframe.log({ flag: 'property', className: 'HTMLHtmlElement', propertyName: 'version', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.version_smart_getter);
HTMLHtmlElement.prototype.__defineGetter__("version", curMemoryArea.version_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////

HTMLHtmlElement.__proto__ = HTMLElement;
HTMLHtmlElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['html'] = function () {
    var html = new (function () { }); // new一个假的,通过换原型,换为HTMLMetaElement去实现
    html.__proto__ = HTMLHtmlElement.prototype;
    return html;
}