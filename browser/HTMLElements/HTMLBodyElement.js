var HTMLBodyElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLBodyElement);

Object.defineProperties(HTMLBodyElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLBodyElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLBodyElement = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// text
curMemoryArea.text_getter = function text() { debugger; }; mframe.safefunction(curMemoryArea.text_getter);
Object.defineProperty(curMemoryArea.text_getter, "name", {value: "get text",configurable: true,});
// text
curMemoryArea.text_setter = function text(val) { debugger; }; mframe.safefunction(curMemoryArea.text_setter);
Object.defineProperty(curMemoryArea.text_setter, "name", {value: "set text",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "text", {get: curMemoryArea.text_getter,set: curMemoryArea.text_setter,enumerable: true,configurable: true,});
curMemoryArea.text_smart_getter = function text() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的text的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.text_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("text", curMemoryArea.text_smart_getter);

// link
curMemoryArea.link_getter = function link() { debugger; }; mframe.safefunction(curMemoryArea.link_getter);
Object.defineProperty(curMemoryArea.link_getter, "name", {value: "get link",configurable: true,});
// link
curMemoryArea.link_setter = function link(val) { debugger; }; mframe.safefunction(curMemoryArea.link_setter);
Object.defineProperty(curMemoryArea.link_setter, "name", {value: "set link",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "link", {get: curMemoryArea.link_getter,set: curMemoryArea.link_setter,enumerable: true,configurable: true,});
curMemoryArea.link_smart_getter = function link() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的link的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.link_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("link", curMemoryArea.link_smart_getter);

// vLink
curMemoryArea.vLink_getter = function vLink() { debugger; }; mframe.safefunction(curMemoryArea.vLink_getter);
Object.defineProperty(curMemoryArea.vLink_getter, "name", {value: "get vLink",configurable: true,});
// vLink
curMemoryArea.vLink_setter = function vLink(val) { debugger; }; mframe.safefunction(curMemoryArea.vLink_setter);
Object.defineProperty(curMemoryArea.vLink_setter, "name", {value: "set vLink",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "vLink", {get: curMemoryArea.vLink_getter,set: curMemoryArea.vLink_setter,enumerable: true,configurable: true,});
curMemoryArea.vLink_smart_getter = function vLink() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的vLink的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.vLink_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("vLink", curMemoryArea.vLink_smart_getter);

// aLink
curMemoryArea.aLink_getter = function aLink() { debugger; }; mframe.safefunction(curMemoryArea.aLink_getter);
Object.defineProperty(curMemoryArea.aLink_getter, "name", {value: "get aLink",configurable: true,});
// aLink
curMemoryArea.aLink_setter = function aLink(val) { debugger; }; mframe.safefunction(curMemoryArea.aLink_setter);
Object.defineProperty(curMemoryArea.aLink_setter, "name", {value: "set aLink",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "aLink", {get: curMemoryArea.aLink_getter,set: curMemoryArea.aLink_setter,enumerable: true,configurable: true,});
curMemoryArea.aLink_smart_getter = function aLink() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的aLink的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.aLink_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("aLink", curMemoryArea.aLink_smart_getter);

// bgColor
curMemoryArea.bgColor_getter = function bgColor() { debugger; }; mframe.safefunction(curMemoryArea.bgColor_getter);
Object.defineProperty(curMemoryArea.bgColor_getter, "name", {value: "get bgColor",configurable: true,});
// bgColor
curMemoryArea.bgColor_setter = function bgColor(val) { debugger; }; mframe.safefunction(curMemoryArea.bgColor_setter);
Object.defineProperty(curMemoryArea.bgColor_setter, "name", {value: "set bgColor",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "bgColor", {get: curMemoryArea.bgColor_getter,set: curMemoryArea.bgColor_setter,enumerable: true,configurable: true,});
curMemoryArea.bgColor_smart_getter = function bgColor() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的bgColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.bgColor_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("bgColor", curMemoryArea.bgColor_smart_getter);

// background
curMemoryArea.background_getter = function background() { debugger; }; mframe.safefunction(curMemoryArea.background_getter);
Object.defineProperty(curMemoryArea.background_getter, "name", {value: "get background",configurable: true,});
// background
curMemoryArea.background_setter = function background(val) { debugger; }; mframe.safefunction(curMemoryArea.background_setter);
Object.defineProperty(curMemoryArea.background_setter, "name", {value: "set background",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "background", {get: curMemoryArea.background_getter,set: curMemoryArea.background_setter,enumerable: true,configurable: true,});
curMemoryArea.background_smart_getter = function background() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的background的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.background_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("background", curMemoryArea.background_smart_getter);

// onblur
curMemoryArea.onblur_getter = function onblur() { debugger; }; mframe.safefunction(curMemoryArea.onblur_getter);
Object.defineProperty(curMemoryArea.onblur_getter, "name", {value: "get onblur",configurable: true,});
// onblur
curMemoryArea.onblur_setter = function onblur(val) { debugger; }; mframe.safefunction(curMemoryArea.onblur_setter);
Object.defineProperty(curMemoryArea.onblur_setter, "name", {value: "set onblur",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onblur", {get: curMemoryArea.onblur_getter,set: curMemoryArea.onblur_setter,enumerable: true,configurable: true,});
curMemoryArea.onblur_smart_getter = function onblur() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onblur的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onblur_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onblur", curMemoryArea.onblur_smart_getter);

// onerror
curMemoryArea.onerror_getter = function onerror() { debugger; }; mframe.safefunction(curMemoryArea.onerror_getter);
Object.defineProperty(curMemoryArea.onerror_getter, "name", {value: "get onerror",configurable: true,});
// onerror
curMemoryArea.onerror_setter = function onerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onerror_setter);
Object.defineProperty(curMemoryArea.onerror_setter, "name", {value: "set onerror",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onerror", {get: curMemoryArea.onerror_getter,set: curMemoryArea.onerror_setter,enumerable: true,configurable: true,});
curMemoryArea.onerror_smart_getter = function onerror() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onerror_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onerror", curMemoryArea.onerror_smart_getter);

// onfocus
curMemoryArea.onfocus_getter = function onfocus() { debugger; }; mframe.safefunction(curMemoryArea.onfocus_getter);
Object.defineProperty(curMemoryArea.onfocus_getter, "name", {value: "get onfocus",configurable: true,});
// onfocus
curMemoryArea.onfocus_setter = function onfocus(val) { debugger; }; mframe.safefunction(curMemoryArea.onfocus_setter);
Object.defineProperty(curMemoryArea.onfocus_setter, "name", {value: "set onfocus",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onfocus", {get: curMemoryArea.onfocus_getter,set: curMemoryArea.onfocus_setter,enumerable: true,configurable: true,});
curMemoryArea.onfocus_smart_getter = function onfocus() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onfocus的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onfocus_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onfocus", curMemoryArea.onfocus_smart_getter);

// onload
curMemoryArea.onload_getter = function onload() { debugger; }; mframe.safefunction(curMemoryArea.onload_getter);
Object.defineProperty(curMemoryArea.onload_getter, "name", {value: "get onload",configurable: true,});
// onload
curMemoryArea.onload_setter = function onload(val) { debugger; }; mframe.safefunction(curMemoryArea.onload_setter);
Object.defineProperty(curMemoryArea.onload_setter, "name", {value: "set onload",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onload", {get: curMemoryArea.onload_getter,set: curMemoryArea.onload_setter,enumerable: true,configurable: true,});
curMemoryArea.onload_smart_getter = function onload() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onload的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onload_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onload", curMemoryArea.onload_smart_getter);

// onresize
curMemoryArea.onresize_getter = function onresize() { debugger; }; mframe.safefunction(curMemoryArea.onresize_getter);
Object.defineProperty(curMemoryArea.onresize_getter, "name", {value: "get onresize",configurable: true,});
// onresize
curMemoryArea.onresize_setter = function onresize(val) { debugger; }; mframe.safefunction(curMemoryArea.onresize_setter);
Object.defineProperty(curMemoryArea.onresize_setter, "name", {value: "set onresize",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onresize", {get: curMemoryArea.onresize_getter,set: curMemoryArea.onresize_setter,enumerable: true,configurable: true,});
curMemoryArea.onresize_smart_getter = function onresize() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onresize的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onresize_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onresize", curMemoryArea.onresize_smart_getter);

// onscroll
curMemoryArea.onscroll_getter = function onscroll() { debugger; }; mframe.safefunction(curMemoryArea.onscroll_getter);
Object.defineProperty(curMemoryArea.onscroll_getter, "name", {value: "get onscroll",configurable: true,});
// onscroll
curMemoryArea.onscroll_setter = function onscroll(val) { debugger; }; mframe.safefunction(curMemoryArea.onscroll_setter);
Object.defineProperty(curMemoryArea.onscroll_setter, "name", {value: "set onscroll",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onscroll", {get: curMemoryArea.onscroll_getter,set: curMemoryArea.onscroll_setter,enumerable: true,configurable: true,});
curMemoryArea.onscroll_smart_getter = function onscroll() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onscroll的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onscroll_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onscroll", curMemoryArea.onscroll_smart_getter);

// onafterprint
curMemoryArea.onafterprint_getter = function onafterprint() { debugger; }; mframe.safefunction(curMemoryArea.onafterprint_getter);
Object.defineProperty(curMemoryArea.onafterprint_getter, "name", {value: "get onafterprint",configurable: true,});
// onafterprint
curMemoryArea.onafterprint_setter = function onafterprint(val) { debugger; }; mframe.safefunction(curMemoryArea.onafterprint_setter);
Object.defineProperty(curMemoryArea.onafterprint_setter, "name", {value: "set onafterprint",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onafterprint", {get: curMemoryArea.onafterprint_getter,set: curMemoryArea.onafterprint_setter,enumerable: true,configurable: true,});
curMemoryArea.onafterprint_smart_getter = function onafterprint() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onafterprint的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onafterprint_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onafterprint", curMemoryArea.onafterprint_smart_getter);

// onbeforeprint
curMemoryArea.onbeforeprint_getter = function onbeforeprint() { debugger; }; mframe.safefunction(curMemoryArea.onbeforeprint_getter);
Object.defineProperty(curMemoryArea.onbeforeprint_getter, "name", {value: "get onbeforeprint",configurable: true,});
// onbeforeprint
curMemoryArea.onbeforeprint_setter = function onbeforeprint(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforeprint_setter);
Object.defineProperty(curMemoryArea.onbeforeprint_setter, "name", {value: "set onbeforeprint",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onbeforeprint", {get: curMemoryArea.onbeforeprint_getter,set: curMemoryArea.onbeforeprint_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforeprint_smart_getter = function onbeforeprint() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onbeforeprint的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onbeforeprint_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onbeforeprint", curMemoryArea.onbeforeprint_smart_getter);

// onbeforeunload
curMemoryArea.onbeforeunload_getter = function onbeforeunload() { debugger; }; mframe.safefunction(curMemoryArea.onbeforeunload_getter);
Object.defineProperty(curMemoryArea.onbeforeunload_getter, "name", {value: "get onbeforeunload",configurable: true,});
// onbeforeunload
curMemoryArea.onbeforeunload_setter = function onbeforeunload(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforeunload_setter);
Object.defineProperty(curMemoryArea.onbeforeunload_setter, "name", {value: "set onbeforeunload",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onbeforeunload", {get: curMemoryArea.onbeforeunload_getter,set: curMemoryArea.onbeforeunload_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforeunload_smart_getter = function onbeforeunload() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onbeforeunload的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onbeforeunload_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onbeforeunload", curMemoryArea.onbeforeunload_smart_getter);

// onhashchange
curMemoryArea.onhashchange_getter = function onhashchange() { debugger; }; mframe.safefunction(curMemoryArea.onhashchange_getter);
Object.defineProperty(curMemoryArea.onhashchange_getter, "name", {value: "get onhashchange",configurable: true,});
// onhashchange
curMemoryArea.onhashchange_setter = function onhashchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onhashchange_setter);
Object.defineProperty(curMemoryArea.onhashchange_setter, "name", {value: "set onhashchange",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onhashchange", {get: curMemoryArea.onhashchange_getter,set: curMemoryArea.onhashchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onhashchange_smart_getter = function onhashchange() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onhashchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onhashchange_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onhashchange", curMemoryArea.onhashchange_smart_getter);

// onlanguagechange
curMemoryArea.onlanguagechange_getter = function onlanguagechange() { debugger; }; mframe.safefunction(curMemoryArea.onlanguagechange_getter);
Object.defineProperty(curMemoryArea.onlanguagechange_getter, "name", {value: "get onlanguagechange",configurable: true,});
// onlanguagechange
curMemoryArea.onlanguagechange_setter = function onlanguagechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onlanguagechange_setter);
Object.defineProperty(curMemoryArea.onlanguagechange_setter, "name", {value: "set onlanguagechange",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onlanguagechange", {get: curMemoryArea.onlanguagechange_getter,set: curMemoryArea.onlanguagechange_setter,enumerable: true,configurable: true,});
curMemoryArea.onlanguagechange_smart_getter = function onlanguagechange() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onlanguagechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onlanguagechange_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onlanguagechange", curMemoryArea.onlanguagechange_smart_getter);

// onmessage
curMemoryArea.onmessage_getter = function onmessage() { debugger; }; mframe.safefunction(curMemoryArea.onmessage_getter);
Object.defineProperty(curMemoryArea.onmessage_getter, "name", {value: "get onmessage",configurable: true,});
// onmessage
curMemoryArea.onmessage_setter = function onmessage(val) { debugger; }; mframe.safefunction(curMemoryArea.onmessage_setter);
Object.defineProperty(curMemoryArea.onmessage_setter, "name", {value: "set onmessage",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onmessage", {get: curMemoryArea.onmessage_getter,set: curMemoryArea.onmessage_setter,enumerable: true,configurable: true,});
curMemoryArea.onmessage_smart_getter = function onmessage() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onmessage的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmessage_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onmessage", curMemoryArea.onmessage_smart_getter);

// onmessageerror
curMemoryArea.onmessageerror_getter = function onmessageerror() { debugger; }; mframe.safefunction(curMemoryArea.onmessageerror_getter);
Object.defineProperty(curMemoryArea.onmessageerror_getter, "name", {value: "get onmessageerror",configurable: true,});
// onmessageerror
curMemoryArea.onmessageerror_setter = function onmessageerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onmessageerror_setter);
Object.defineProperty(curMemoryArea.onmessageerror_setter, "name", {value: "set onmessageerror",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onmessageerror", {get: curMemoryArea.onmessageerror_getter,set: curMemoryArea.onmessageerror_setter,enumerable: true,configurable: true,});
curMemoryArea.onmessageerror_smart_getter = function onmessageerror() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onmessageerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onmessageerror_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onmessageerror", curMemoryArea.onmessageerror_smart_getter);

// onoffline
curMemoryArea.onoffline_getter = function onoffline() { debugger; }; mframe.safefunction(curMemoryArea.onoffline_getter);
Object.defineProperty(curMemoryArea.onoffline_getter, "name", {value: "get onoffline",configurable: true,});
// onoffline
curMemoryArea.onoffline_setter = function onoffline(val) { debugger; }; mframe.safefunction(curMemoryArea.onoffline_setter);
Object.defineProperty(curMemoryArea.onoffline_setter, "name", {value: "set onoffline",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onoffline", {get: curMemoryArea.onoffline_getter,set: curMemoryArea.onoffline_setter,enumerable: true,configurable: true,});
curMemoryArea.onoffline_smart_getter = function onoffline() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onoffline的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onoffline_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onoffline", curMemoryArea.onoffline_smart_getter);

// ononline
curMemoryArea.ononline_getter = function ononline() { debugger; }; mframe.safefunction(curMemoryArea.ononline_getter);
Object.defineProperty(curMemoryArea.ononline_getter, "name", {value: "get ononline",configurable: true,});
// ononline
curMemoryArea.ononline_setter = function ononline(val) { debugger; }; mframe.safefunction(curMemoryArea.ononline_setter);
Object.defineProperty(curMemoryArea.ononline_setter, "name", {value: "set ononline",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "ononline", {get: curMemoryArea.ononline_getter,set: curMemoryArea.ononline_setter,enumerable: true,configurable: true,});
curMemoryArea.ononline_smart_getter = function ononline() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的ononline的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.ononline_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("ononline", curMemoryArea.ononline_smart_getter);

// onpagehide
curMemoryArea.onpagehide_getter = function onpagehide() { debugger; }; mframe.safefunction(curMemoryArea.onpagehide_getter);
Object.defineProperty(curMemoryArea.onpagehide_getter, "name", {value: "get onpagehide",configurable: true,});
// onpagehide
curMemoryArea.onpagehide_setter = function onpagehide(val) { debugger; }; mframe.safefunction(curMemoryArea.onpagehide_setter);
Object.defineProperty(curMemoryArea.onpagehide_setter, "name", {value: "set onpagehide",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onpagehide", {get: curMemoryArea.onpagehide_getter,set: curMemoryArea.onpagehide_setter,enumerable: true,configurable: true,});
curMemoryArea.onpagehide_smart_getter = function onpagehide() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onpagehide的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpagehide_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onpagehide", curMemoryArea.onpagehide_smart_getter);

// onpageshow
curMemoryArea.onpageshow_getter = function onpageshow() { debugger; }; mframe.safefunction(curMemoryArea.onpageshow_getter);
Object.defineProperty(curMemoryArea.onpageshow_getter, "name", {value: "get onpageshow",configurable: true,});
// onpageshow
curMemoryArea.onpageshow_setter = function onpageshow(val) { debugger; }; mframe.safefunction(curMemoryArea.onpageshow_setter);
Object.defineProperty(curMemoryArea.onpageshow_setter, "name", {value: "set onpageshow",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onpageshow", {get: curMemoryArea.onpageshow_getter,set: curMemoryArea.onpageshow_setter,enumerable: true,configurable: true,});
curMemoryArea.onpageshow_smart_getter = function onpageshow() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onpageshow的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpageshow_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onpageshow", curMemoryArea.onpageshow_smart_getter);

// onpopstate
curMemoryArea.onpopstate_getter = function onpopstate() { debugger; }; mframe.safefunction(curMemoryArea.onpopstate_getter);
Object.defineProperty(curMemoryArea.onpopstate_getter, "name", {value: "get onpopstate",configurable: true,});
// onpopstate
curMemoryArea.onpopstate_setter = function onpopstate(val) { debugger; }; mframe.safefunction(curMemoryArea.onpopstate_setter);
Object.defineProperty(curMemoryArea.onpopstate_setter, "name", {value: "set onpopstate",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onpopstate", {get: curMemoryArea.onpopstate_getter,set: curMemoryArea.onpopstate_setter,enumerable: true,configurable: true,});
curMemoryArea.onpopstate_smart_getter = function onpopstate() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onpopstate的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onpopstate_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onpopstate", curMemoryArea.onpopstate_smart_getter);

// onrejectionhandled
curMemoryArea.onrejectionhandled_getter = function onrejectionhandled() { debugger; }; mframe.safefunction(curMemoryArea.onrejectionhandled_getter);
Object.defineProperty(curMemoryArea.onrejectionhandled_getter, "name", {value: "get onrejectionhandled",configurable: true,});
// onrejectionhandled
curMemoryArea.onrejectionhandled_setter = function onrejectionhandled(val) { debugger; }; mframe.safefunction(curMemoryArea.onrejectionhandled_setter);
Object.defineProperty(curMemoryArea.onrejectionhandled_setter, "name", {value: "set onrejectionhandled",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onrejectionhandled", {get: curMemoryArea.onrejectionhandled_getter,set: curMemoryArea.onrejectionhandled_setter,enumerable: true,configurable: true,});
curMemoryArea.onrejectionhandled_smart_getter = function onrejectionhandled() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onrejectionhandled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onrejectionhandled_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onrejectionhandled", curMemoryArea.onrejectionhandled_smart_getter);

// onstorage
curMemoryArea.onstorage_getter = function onstorage() { debugger; }; mframe.safefunction(curMemoryArea.onstorage_getter);
Object.defineProperty(curMemoryArea.onstorage_getter, "name", {value: "get onstorage",configurable: true,});
// onstorage
curMemoryArea.onstorage_setter = function onstorage(val) { debugger; }; mframe.safefunction(curMemoryArea.onstorage_setter);
Object.defineProperty(curMemoryArea.onstorage_setter, "name", {value: "set onstorage",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onstorage", {get: curMemoryArea.onstorage_getter,set: curMemoryArea.onstorage_setter,enumerable: true,configurable: true,});
curMemoryArea.onstorage_smart_getter = function onstorage() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onstorage的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onstorage_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onstorage", curMemoryArea.onstorage_smart_getter);

// onunhandledrejection
curMemoryArea.onunhandledrejection_getter = function onunhandledrejection() { debugger; }; mframe.safefunction(curMemoryArea.onunhandledrejection_getter);
Object.defineProperty(curMemoryArea.onunhandledrejection_getter, "name", {value: "get onunhandledrejection",configurable: true,});
// onunhandledrejection
curMemoryArea.onunhandledrejection_setter = function onunhandledrejection(val) { debugger; }; mframe.safefunction(curMemoryArea.onunhandledrejection_setter);
Object.defineProperty(curMemoryArea.onunhandledrejection_setter, "name", {value: "set onunhandledrejection",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onunhandledrejection", {get: curMemoryArea.onunhandledrejection_getter,set: curMemoryArea.onunhandledrejection_setter,enumerable: true,configurable: true,});
curMemoryArea.onunhandledrejection_smart_getter = function onunhandledrejection() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onunhandledrejection的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onunhandledrejection_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onunhandledrejection", curMemoryArea.onunhandledrejection_smart_getter);

// onunload
curMemoryArea.onunload_getter = function onunload() { debugger; }; mframe.safefunction(curMemoryArea.onunload_getter);
Object.defineProperty(curMemoryArea.onunload_getter, "name", {value: "get onunload",configurable: true,});
// onunload
curMemoryArea.onunload_setter = function onunload(val) { debugger; }; mframe.safefunction(curMemoryArea.onunload_setter);
Object.defineProperty(curMemoryArea.onunload_setter, "name", {value: "set onunload",configurable: true,});
Object.defineProperty(HTMLBodyElement.prototype, "onunload", {get: curMemoryArea.onunload_getter,set: curMemoryArea.onunload_setter,enumerable: true,configurable: true,});
curMemoryArea.onunload_smart_getter = function onunload() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"HTMLBodyElement"中的onunload的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
};mframe.safefunction(curMemoryArea.onunload_smart_getter);
HTMLBodyElement.prototype.__defineGetter__("onunload", curMemoryArea.onunload_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================

///////////////////////////////////////////////////
HTMLBodyElement.__proto__ = HTMLElement;
HTMLBodyElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['body'] = function () {
    var body = new (function () { });
    body.__proto__ = HTMLBodyElement.prototype;

    return body;
}