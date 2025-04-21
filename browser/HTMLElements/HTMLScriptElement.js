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
curMemoryArea.src_getter = function src() { debugger; }; mframe.safefunction(curMemoryArea.src_getter);
Object.defineProperty(curMemoryArea.src_getter, "name", {value: "get src",configurable: true,});
// src
curMemoryArea.src_setter = function src(val) {
    this._src = val; 
    this.jsdomMemory.src = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'src', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.src_setter);
Object.defineProperty(curMemoryArea.src_setter, "name", {value: "set src",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "src", {get: curMemoryArea.src_getter,set: curMemoryArea.src_setter,enumerable: true,configurable: true,});
curMemoryArea.src_smart_getter = function src() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._src !== undefined ? this._src : this.jsdomMemory.src; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'src', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.src_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("src", curMemoryArea.src_smart_getter);

// type
curMemoryArea.type_getter = function type() { debugger; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", {value: "get type",configurable: true,});
// type
curMemoryArea.type_setter = function type(val) {
    this._type = val; 
    this.jsdomMemory.type = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'type', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.type_setter);
Object.defineProperty(curMemoryArea.type_setter, "name", {value: "set type",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "type", {get: curMemoryArea.type_getter,set: curMemoryArea.type_setter,enumerable: true,configurable: true,});
curMemoryArea.type_smart_getter = function type() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._type !== undefined ? this._type : this.jsdomMemory.type; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'type', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.type_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// noModule
curMemoryArea.noModule_getter = function noModule() { debugger; }; mframe.safefunction(curMemoryArea.noModule_getter);
Object.defineProperty(curMemoryArea.noModule_getter, "name", {value: "get noModule",configurable: true,});
// noModule
curMemoryArea.noModule_setter = function noModule(val) {
    this._noModule = val; 
    this.jsdomMemory.noModule = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'noModule', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.noModule_setter);
Object.defineProperty(curMemoryArea.noModule_setter, "name", {value: "set noModule",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "noModule", {get: curMemoryArea.noModule_getter,set: curMemoryArea.noModule_setter,enumerable: true,configurable: true,});
curMemoryArea.noModule_smart_getter = function noModule() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._noModule !== undefined ? this._noModule : this.jsdomMemory.noModule; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'noModule', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.noModule_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("noModule", curMemoryArea.noModule_smart_getter);

// charset
curMemoryArea.charset_getter = function charset() { debugger; }; mframe.safefunction(curMemoryArea.charset_getter);
Object.defineProperty(curMemoryArea.charset_getter, "name", {value: "get charset",configurable: true,});
// charset
curMemoryArea.charset_setter = function charset(val) {
    this._charset = val; 
    this.jsdomMemory.charset = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'charset', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.charset_setter);
Object.defineProperty(curMemoryArea.charset_setter, "name", {value: "set charset",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "charset", {get: curMemoryArea.charset_getter,set: curMemoryArea.charset_setter,enumerable: true,configurable: true,});
curMemoryArea.charset_smart_getter = function charset() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._charset !== undefined ? this._charset : this.jsdomMemory.charset; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'charset', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.charset_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("charset", curMemoryArea.charset_smart_getter);

// async
curMemoryArea.async_getter = function async() { debugger; }; mframe.safefunction(curMemoryArea.async_getter);
Object.defineProperty(curMemoryArea.async_getter, "name", {value: "get async",configurable: true,});
// async
curMemoryArea.async_setter = function async(val) {
    this._async = val; 
    this.jsdomMemory.async = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'async', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.async_setter);
Object.defineProperty(curMemoryArea.async_setter, "name", {value: "set async",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "async", {get: curMemoryArea.async_getter,set: curMemoryArea.async_setter,enumerable: true,configurable: true,});
curMemoryArea.async_smart_getter = function async() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._async !== undefined ? this._async : this.jsdomMemory.async; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'async', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.async_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("async", curMemoryArea.async_smart_getter);

// defer
curMemoryArea.defer_getter = function defer() { debugger; }; mframe.safefunction(curMemoryArea.defer_getter);
Object.defineProperty(curMemoryArea.defer_getter, "name", {value: "get defer",configurable: true,});
// defer
curMemoryArea.defer_setter = function defer(val) {
    this._defer = val; 
    this.jsdomMemory.defer = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'defer', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.defer_setter);
Object.defineProperty(curMemoryArea.defer_setter, "name", {value: "set defer",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "defer", {get: curMemoryArea.defer_getter,set: curMemoryArea.defer_setter,enumerable: true,configurable: true,});
curMemoryArea.defer_smart_getter = function defer() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._defer !== undefined ? this._defer : this.jsdomMemory.defer; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'defer', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.defer_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("defer", curMemoryArea.defer_smart_getter);

// crossOrigin
curMemoryArea.crossOrigin_getter = function crossOrigin() { debugger; }; mframe.safefunction(curMemoryArea.crossOrigin_getter);
Object.defineProperty(curMemoryArea.crossOrigin_getter, "name", {value: "get crossOrigin",configurable: true,});
// crossOrigin
curMemoryArea.crossOrigin_setter = function crossOrigin(val) {
    this._crossOrigin = val; 
    this.jsdomMemory.crossOrigin = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'crossOrigin', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.crossOrigin_setter);
Object.defineProperty(curMemoryArea.crossOrigin_setter, "name", {value: "set crossOrigin",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "crossOrigin", {get: curMemoryArea.crossOrigin_getter,set: curMemoryArea.crossOrigin_setter,enumerable: true,configurable: true,});
curMemoryArea.crossOrigin_smart_getter = function crossOrigin() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._crossOrigin !== undefined ? this._crossOrigin : this.jsdomMemory.crossOrigin; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'crossOrigin', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.crossOrigin_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("crossOrigin", curMemoryArea.crossOrigin_smart_getter);

// text
curMemoryArea.text_getter = function text() { debugger; }; mframe.safefunction(curMemoryArea.text_getter);
Object.defineProperty(curMemoryArea.text_getter, "name", {value: "get text",configurable: true,});
// text
curMemoryArea.text_setter = function text(val) {
    this._text = val; 
    this.jsdomMemory.text = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'text', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.text_setter);
Object.defineProperty(curMemoryArea.text_setter, "name", {value: "set text",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "text", {get: curMemoryArea.text_getter,set: curMemoryArea.text_setter,enumerable: true,configurable: true,});
curMemoryArea.text_smart_getter = function text() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._text !== undefined ? this._text : this.jsdomMemory.text; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'text', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.text_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("text", curMemoryArea.text_smart_getter);

// referrerPolicy
curMemoryArea.referrerPolicy_getter = function referrerPolicy() { debugger; }; mframe.safefunction(curMemoryArea.referrerPolicy_getter);
Object.defineProperty(curMemoryArea.referrerPolicy_getter, "name", {value: "get referrerPolicy",configurable: true,});
// referrerPolicy
curMemoryArea.referrerPolicy_setter = function referrerPolicy(val) {
    this._referrerPolicy = val; 
    this.jsdomMemory.referrerPolicy = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'referrerPolicy', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.referrerPolicy_setter);
Object.defineProperty(curMemoryArea.referrerPolicy_setter, "name", {value: "set referrerPolicy",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "referrerPolicy", {get: curMemoryArea.referrerPolicy_getter,set: curMemoryArea.referrerPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.referrerPolicy_smart_getter = function referrerPolicy() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._referrerPolicy !== undefined ? this._referrerPolicy : this.jsdomMemory.referrerPolicy; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'referrerPolicy', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.referrerPolicy_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("referrerPolicy", curMemoryArea.referrerPolicy_smart_getter);

// fetchPriority
curMemoryArea.fetchPriority_getter = function fetchPriority() { debugger; }; mframe.safefunction(curMemoryArea.fetchPriority_getter);
Object.defineProperty(curMemoryArea.fetchPriority_getter, "name", {value: "get fetchPriority",configurable: true,});
// fetchPriority
curMemoryArea.fetchPriority_setter = function fetchPriority(val) {
    this._fetchPriority = val; 
    this.jsdomMemory.fetchPriority = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'fetchPriority', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.fetchPriority_setter);
Object.defineProperty(curMemoryArea.fetchPriority_setter, "name", {value: "set fetchPriority",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "fetchPriority", {get: curMemoryArea.fetchPriority_getter,set: curMemoryArea.fetchPriority_setter,enumerable: true,configurable: true,});
curMemoryArea.fetchPriority_smart_getter = function fetchPriority() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._fetchPriority !== undefined ? this._fetchPriority : this.jsdomMemory.fetchPriority; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'fetchPriority', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.fetchPriority_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("fetchPriority", curMemoryArea.fetchPriority_smart_getter);

// event
curMemoryArea.event_getter = function event() { debugger; }; mframe.safefunction(curMemoryArea.event_getter);
Object.defineProperty(curMemoryArea.event_getter, "name", {value: "get event",configurable: true,});
// event
curMemoryArea.event_setter = function event(val) {
    this._event = val; 
    this.jsdomMemory.event = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'event', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.event_setter);
Object.defineProperty(curMemoryArea.event_setter, "name", {value: "set event",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "event", {get: curMemoryArea.event_getter,set: curMemoryArea.event_setter,enumerable: true,configurable: true,});
curMemoryArea.event_smart_getter = function event() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._event !== undefined ? this._event : this.jsdomMemory.event; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'event', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.event_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("event", curMemoryArea.event_smart_getter);

// htmlFor
curMemoryArea.htmlFor_getter = function htmlFor() { debugger; }; mframe.safefunction(curMemoryArea.htmlFor_getter);
Object.defineProperty(curMemoryArea.htmlFor_getter, "name", {value: "get htmlFor",configurable: true,});
// htmlFor
curMemoryArea.htmlFor_setter = function htmlFor(val) {
    this._htmlFor = val; 
    this.jsdomMemory.htmlFor = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'htmlFor', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.htmlFor_setter);
Object.defineProperty(curMemoryArea.htmlFor_setter, "name", {value: "set htmlFor",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "htmlFor", {get: curMemoryArea.htmlFor_getter,set: curMemoryArea.htmlFor_setter,enumerable: true,configurable: true,});
curMemoryArea.htmlFor_smart_getter = function htmlFor() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._htmlFor !== undefined ? this._htmlFor : this.jsdomMemory.htmlFor; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'htmlFor', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.htmlFor_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("htmlFor", curMemoryArea.htmlFor_smart_getter);

// integrity
curMemoryArea.integrity_getter = function integrity() { debugger; }; mframe.safefunction(curMemoryArea.integrity_getter);
Object.defineProperty(curMemoryArea.integrity_getter, "name", {value: "get integrity",configurable: true,});
// integrity
curMemoryArea.integrity_setter = function integrity(val) {
    this._integrity = val; 
    this.jsdomMemory.integrity = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'integrity', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.integrity_setter);
Object.defineProperty(curMemoryArea.integrity_setter, "name", {value: "set integrity",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "integrity", {get: curMemoryArea.integrity_getter,set: curMemoryArea.integrity_setter,enumerable: true,configurable: true,});
curMemoryArea.integrity_smart_getter = function integrity() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._integrity !== undefined ? this._integrity : this.jsdomMemory.integrity; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'integrity', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.integrity_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("integrity", curMemoryArea.integrity_smart_getter);

// blocking
curMemoryArea.blocking_getter = function blocking() { debugger; }; mframe.safefunction(curMemoryArea.blocking_getter);
Object.defineProperty(curMemoryArea.blocking_getter, "name", {value: "get blocking",configurable: true,});
// blocking
curMemoryArea.blocking_setter = function blocking(val) {
    this._blocking = val; 
    this.jsdomMemory.blocking = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'blocking', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.blocking_setter);
Object.defineProperty(curMemoryArea.blocking_setter, "name", {value: "set blocking",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "blocking", {get: curMemoryArea.blocking_getter,set: curMemoryArea.blocking_setter,enumerable: true,configurable: true,});
curMemoryArea.blocking_smart_getter = function blocking() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._blocking !== undefined ? this._blocking : this.jsdomMemory.blocking; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'blocking', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.blocking_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("blocking", curMemoryArea.blocking_smart_getter);

// attributionSrc
curMemoryArea.attributionSrc_getter = function attributionSrc() { debugger; }; mframe.safefunction(curMemoryArea.attributionSrc_getter);
Object.defineProperty(curMemoryArea.attributionSrc_getter, "name", {value: "get attributionSrc",configurable: true,});
// attributionSrc
curMemoryArea.attributionSrc_setter = function attributionSrc(val) {
    this._attributionSrc = val; 
    this.jsdomMemory.attributionSrc = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'attributionSrc', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.attributionSrc_setter);
Object.defineProperty(curMemoryArea.attributionSrc_setter, "name", {value: "set attributionSrc",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "attributionSrc", {get: curMemoryArea.attributionSrc_getter,set: curMemoryArea.attributionSrc_setter,enumerable: true,configurable: true,});
curMemoryArea.attributionSrc_smart_getter = function attributionSrc() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._attributionSrc !== undefined ? this._attributionSrc : this.jsdomMemory.attributionSrc; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'attributionSrc', method: 'get', val: res }); 
    return res; 
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