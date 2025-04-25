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
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// name
curMemoryArea.name_getter = function name() { debugger; }; mframe.safefunction(curMemoryArea.name_getter);
Object.defineProperty(curMemoryArea.name_getter, "name", {value: "get name",configurable: true,});
// name
curMemoryArea.name_setter = function name(val) {
    this._name = val; 
    this.jsdomMemory.name = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'name', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.name_setter);
Object.defineProperty(curMemoryArea.name_setter, "name", {value: "set name",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "name", {get: curMemoryArea.name_getter,set: curMemoryArea.name_setter,enumerable: true,configurable: true,});
curMemoryArea.name_smart_getter = function name() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._name || this.jsdomMemory.name || ""||"";
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'name', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.name_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("name", curMemoryArea.name_smart_getter);

// httpEquiv
curMemoryArea.httpEquiv_getter = function httpEquiv() { debugger; }; mframe.safefunction(curMemoryArea.httpEquiv_getter);
Object.defineProperty(curMemoryArea.httpEquiv_getter, "name", {value: "get httpEquiv",configurable: true,});
// httpEquiv
curMemoryArea.httpEquiv_setter = function httpEquiv(val) {
    this._httpEquiv = val; 
    this.jsdomMemory.httpEquiv = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'httpEquiv', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.httpEquiv_setter);
Object.defineProperty(curMemoryArea.httpEquiv_setter, "name", {value: "set httpEquiv",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "httpEquiv", {get: curMemoryArea.httpEquiv_getter,set: curMemoryArea.httpEquiv_setter,enumerable: true,configurable: true,});
curMemoryArea.httpEquiv_smart_getter = function httpEquiv() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._httpEquiv || this.jsdomMemory.httpEquiv||"";
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'httpEquiv', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.httpEquiv_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("httpEquiv", curMemoryArea.httpEquiv_smart_getter);

// content
curMemoryArea.content_getter = function content() { debugger; }; mframe.safefunction(curMemoryArea.content_getter);
Object.defineProperty(curMemoryArea.content_getter, "name", {value: "get content",configurable: true,});
// content
curMemoryArea.content_setter = function content(val) {
    this._content = val; 
    this.jsdomMemory.content = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'content', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.content_setter);
Object.defineProperty(curMemoryArea.content_setter, "name", {value: "set content",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "content", {get: curMemoryArea.content_getter,set: curMemoryArea.content_setter,enumerable: true,configurable: true,});
curMemoryArea.content_smart_getter = function content() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._content || this._content|| this.jsdomMemory.content||"";
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'content', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.content_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("content", curMemoryArea.content_smart_getter);

// media
curMemoryArea.media_getter = function media() { debugger; }; mframe.safefunction(curMemoryArea.media_getter);
Object.defineProperty(curMemoryArea.media_getter, "name", {value: "get media",configurable: true,});
// media
curMemoryArea.media_setter = function media(val) {
    this._media = val; 
    this.jsdomMemory.media = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'media', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.media_setter);
Object.defineProperty(curMemoryArea.media_setter, "name", {value: "set media",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "media", {get: curMemoryArea.media_getter,set: curMemoryArea.media_setter,enumerable: true,configurable: true,});
curMemoryArea.media_smart_getter = function media() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._media || this.jsdomMemory.media|| "";
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'media', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.media_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("media", curMemoryArea.media_smart_getter);

// scheme
curMemoryArea.scheme_getter = function scheme() { debugger; }; mframe.safefunction(curMemoryArea.scheme_getter);
Object.defineProperty(curMemoryArea.scheme_getter, "name", {value: "get scheme",configurable: true,});
// scheme
curMemoryArea.scheme_setter = function scheme(val) {
    this._scheme = val; 
    this.jsdomMemory.scheme = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'scheme', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.scheme_setter);
Object.defineProperty(curMemoryArea.scheme_setter, "name", {value: "set scheme",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "scheme", {get: curMemoryArea.scheme_getter,set: curMemoryArea.scheme_setter,enumerable: true,configurable: true,});
curMemoryArea.scheme_smart_getter = function scheme() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._scheme || this._scheme|| this.jsdomMemory.scheme||"";
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'scheme', method: 'get', val: res }); 
    return res; 
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