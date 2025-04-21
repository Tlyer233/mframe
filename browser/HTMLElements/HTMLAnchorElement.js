var HTMLAnchorElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLAnchorElement);

Object.defineProperties(HTMLAnchorElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLAnchorElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLAnchorElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLAnchorElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLAnchorElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// target
curMemoryArea.target_getter = function target() { debugger; }; mframe.safefunction(curMemoryArea.target_getter);
Object.defineProperty(curMemoryArea.target_getter, "name", {value: "get target",configurable: true,});
// target
curMemoryArea.target_setter = function target(val) {
    this._target = val; 
    this.jsdomMemory.target = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'target', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.target_setter);
Object.defineProperty(curMemoryArea.target_setter, "name", {value: "set target",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "target", {get: curMemoryArea.target_getter,set: curMemoryArea.target_setter,enumerable: true,configurable: true,});
curMemoryArea.target_smart_getter = function target() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._target !== undefined ? this._target : this.jsdomMemory.target; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'target', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.target_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("target", curMemoryArea.target_smart_getter);

// download
curMemoryArea.download_getter = function download() { debugger; }; mframe.safefunction(curMemoryArea.download_getter);
Object.defineProperty(curMemoryArea.download_getter, "name", {value: "get download",configurable: true,});
// download
curMemoryArea.download_setter = function download(val) {
    this._download = val; 
    this.jsdomMemory.download = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'download', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.download_setter);
Object.defineProperty(curMemoryArea.download_setter, "name", {value: "set download",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "download", {get: curMemoryArea.download_getter,set: curMemoryArea.download_setter,enumerable: true,configurable: true,});
curMemoryArea.download_smart_getter = function download() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._download !== undefined ? this._download : this.jsdomMemory.download; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'download', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.download_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("download", curMemoryArea.download_smart_getter);

// ping
curMemoryArea.ping_getter = function ping() { debugger; }; mframe.safefunction(curMemoryArea.ping_getter);
Object.defineProperty(curMemoryArea.ping_getter, "name", {value: "get ping",configurable: true,});
// ping
curMemoryArea.ping_setter = function ping(val) {
    this._ping = val; 
    this.jsdomMemory.ping = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'ping', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.ping_setter);
Object.defineProperty(curMemoryArea.ping_setter, "name", {value: "set ping",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "ping", {get: curMemoryArea.ping_getter,set: curMemoryArea.ping_setter,enumerable: true,configurable: true,});
curMemoryArea.ping_smart_getter = function ping() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._ping !== undefined ? this._ping : this.jsdomMemory.ping; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'ping', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.ping_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("ping", curMemoryArea.ping_smart_getter);

// rel
curMemoryArea.rel_getter = function rel() { debugger; }; mframe.safefunction(curMemoryArea.rel_getter);
Object.defineProperty(curMemoryArea.rel_getter, "name", {value: "get rel",configurable: true,});
// rel
curMemoryArea.rel_setter = function rel(val) {
    this._rel = val; 
    this.jsdomMemory.rel = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'rel', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.rel_setter);
Object.defineProperty(curMemoryArea.rel_setter, "name", {value: "set rel",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "rel", {get: curMemoryArea.rel_getter,set: curMemoryArea.rel_setter,enumerable: true,configurable: true,});
curMemoryArea.rel_smart_getter = function rel() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._rel !== undefined ? this._rel : this.jsdomMemory.rel; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'rel', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.rel_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("rel", curMemoryArea.rel_smart_getter);

// relList
curMemoryArea.relList_getter = function relList() { debugger; }; mframe.safefunction(curMemoryArea.relList_getter);
Object.defineProperty(curMemoryArea.relList_getter, "name", {value: "get relList",configurable: true,});
// relList
curMemoryArea.relList_setter = function relList(val) {
    this._relList = val; 
    this.jsdomMemory.relList = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'relList', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.relList_setter);
Object.defineProperty(curMemoryArea.relList_setter, "name", {value: "set relList",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "relList", {get: curMemoryArea.relList_getter,set: curMemoryArea.relList_setter,enumerable: true,configurable: true,});
curMemoryArea.relList_smart_getter = function relList() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._relList !== undefined ? this._relList : this.jsdomMemory.relList; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'relList', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.relList_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("relList", curMemoryArea.relList_smart_getter);

// hreflang
curMemoryArea.hreflang_getter = function hreflang() { debugger; }; mframe.safefunction(curMemoryArea.hreflang_getter);
Object.defineProperty(curMemoryArea.hreflang_getter, "name", {value: "get hreflang",configurable: true,});
// hreflang
curMemoryArea.hreflang_setter = function hreflang(val) {
    this._hreflang = val; 
    this.jsdomMemory.hreflang = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hreflang', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.hreflang_setter);
Object.defineProperty(curMemoryArea.hreflang_setter, "name", {value: "set hreflang",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hreflang", {get: curMemoryArea.hreflang_getter,set: curMemoryArea.hreflang_setter,enumerable: true,configurable: true,});
curMemoryArea.hreflang_smart_getter = function hreflang() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._hreflang !== undefined ? this._hreflang : this.jsdomMemory.hreflang; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hreflang', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.hreflang_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hreflang", curMemoryArea.hreflang_smart_getter);

// type
curMemoryArea.type_getter = function type() { debugger; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", {value: "get type",configurable: true,});
// type
curMemoryArea.type_setter = function type(val) {
    this._type = val; 
    this.jsdomMemory.type = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'type', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.type_setter);
Object.defineProperty(curMemoryArea.type_setter, "name", {value: "set type",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "type", {get: curMemoryArea.type_getter,set: curMemoryArea.type_setter,enumerable: true,configurable: true,});
curMemoryArea.type_smart_getter = function type() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._type !== undefined ? this._type : this.jsdomMemory.type; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'type', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.type_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// referrerPolicy
curMemoryArea.referrerPolicy_getter = function referrerPolicy() { debugger; }; mframe.safefunction(curMemoryArea.referrerPolicy_getter);
Object.defineProperty(curMemoryArea.referrerPolicy_getter, "name", {value: "get referrerPolicy",configurable: true,});
// referrerPolicy
curMemoryArea.referrerPolicy_setter = function referrerPolicy(val) {
    this._referrerPolicy = val; 
    this.jsdomMemory.referrerPolicy = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'referrerPolicy', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.referrerPolicy_setter);
Object.defineProperty(curMemoryArea.referrerPolicy_setter, "name", {value: "set referrerPolicy",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "referrerPolicy", {get: curMemoryArea.referrerPolicy_getter,set: curMemoryArea.referrerPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.referrerPolicy_smart_getter = function referrerPolicy() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._referrerPolicy !== undefined ? this._referrerPolicy : this.jsdomMemory.referrerPolicy; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'referrerPolicy', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.referrerPolicy_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("referrerPolicy", curMemoryArea.referrerPolicy_smart_getter);

// text
curMemoryArea.text_getter = function text() { debugger; }; mframe.safefunction(curMemoryArea.text_getter);
Object.defineProperty(curMemoryArea.text_getter, "name", {value: "get text",configurable: true,});
// text
curMemoryArea.text_setter = function text(val) {
    this._text = val; 
    this.jsdomMemory.text = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'text', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.text_setter);
Object.defineProperty(curMemoryArea.text_setter, "name", {value: "set text",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "text", {get: curMemoryArea.text_getter,set: curMemoryArea.text_setter,enumerable: true,configurable: true,});
curMemoryArea.text_smart_getter = function text() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._text !== undefined ? this._text : this.jsdomMemory.text; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'text', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.text_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("text", curMemoryArea.text_smart_getter);

// coords
curMemoryArea.coords_getter = function coords() { debugger; }; mframe.safefunction(curMemoryArea.coords_getter);
Object.defineProperty(curMemoryArea.coords_getter, "name", {value: "get coords",configurable: true,});
// coords
curMemoryArea.coords_setter = function coords(val) {
    this._coords = val; 
    this.jsdomMemory.coords = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'coords', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.coords_setter);
Object.defineProperty(curMemoryArea.coords_setter, "name", {value: "set coords",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "coords", {get: curMemoryArea.coords_getter,set: curMemoryArea.coords_setter,enumerable: true,configurable: true,});
curMemoryArea.coords_smart_getter = function coords() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._coords !== undefined ? this._coords : this.jsdomMemory.coords; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'coords', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.coords_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("coords", curMemoryArea.coords_smart_getter);

// charset
curMemoryArea.charset_getter = function charset() { debugger; }; mframe.safefunction(curMemoryArea.charset_getter);
Object.defineProperty(curMemoryArea.charset_getter, "name", {value: "get charset",configurable: true,});
// charset
curMemoryArea.charset_setter = function charset(val) {
    this._charset = val; 
    this.jsdomMemory.charset = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'charset', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.charset_setter);
Object.defineProperty(curMemoryArea.charset_setter, "name", {value: "set charset",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "charset", {get: curMemoryArea.charset_getter,set: curMemoryArea.charset_setter,enumerable: true,configurable: true,});
curMemoryArea.charset_smart_getter = function charset() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._charset !== undefined ? this._charset : this.jsdomMemory.charset; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'charset', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.charset_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("charset", curMemoryArea.charset_smart_getter);

// name
curMemoryArea.name_getter = function name() { debugger; }; mframe.safefunction(curMemoryArea.name_getter);
Object.defineProperty(curMemoryArea.name_getter, "name", {value: "get name",configurable: true,});
// name
curMemoryArea.name_setter = function name(val) {
    this._name = val; 
    this.jsdomMemory.name = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'name', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.name_setter);
Object.defineProperty(curMemoryArea.name_setter, "name", {value: "set name",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "name", {get: curMemoryArea.name_getter,set: curMemoryArea.name_setter,enumerable: true,configurable: true,});
curMemoryArea.name_smart_getter = function name() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._name !== undefined ? this._name : this.jsdomMemory.name; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'name', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.name_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("name", curMemoryArea.name_smart_getter);

// rev
curMemoryArea.rev_getter = function rev() { debugger; }; mframe.safefunction(curMemoryArea.rev_getter);
Object.defineProperty(curMemoryArea.rev_getter, "name", {value: "get rev",configurable: true,});
// rev
curMemoryArea.rev_setter = function rev(val) {
    this._rev = val; 
    this.jsdomMemory.rev = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'rev', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.rev_setter);
Object.defineProperty(curMemoryArea.rev_setter, "name", {value: "set rev",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "rev", {get: curMemoryArea.rev_getter,set: curMemoryArea.rev_setter,enumerable: true,configurable: true,});
curMemoryArea.rev_smart_getter = function rev() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._rev !== undefined ? this._rev : this.jsdomMemory.rev; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'rev', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.rev_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("rev", curMemoryArea.rev_smart_getter);

// shape
curMemoryArea.shape_getter = function shape() { debugger; }; mframe.safefunction(curMemoryArea.shape_getter);
Object.defineProperty(curMemoryArea.shape_getter, "name", {value: "get shape",configurable: true,});
// shape
curMemoryArea.shape_setter = function shape(val) {
    this._shape = val; 
    this.jsdomMemory.shape = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'shape', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.shape_setter);
Object.defineProperty(curMemoryArea.shape_setter, "name", {value: "set shape",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "shape", {get: curMemoryArea.shape_getter,set: curMemoryArea.shape_setter,enumerable: true,configurable: true,});
curMemoryArea.shape_smart_getter = function shape() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._shape !== undefined ? this._shape : this.jsdomMemory.shape; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'shape', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.shape_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("shape", curMemoryArea.shape_smart_getter);

// origin
curMemoryArea.origin_getter = function origin() { debugger; }; mframe.safefunction(curMemoryArea.origin_getter);
Object.defineProperty(curMemoryArea.origin_getter, "name", {value: "get origin",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "origin", {get: curMemoryArea.origin_getter,enumerable: true,configurable: true,});
curMemoryArea.origin_smart_getter = function origin() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._origin !== undefined ? this._origin : this.jsdomMemory.origin; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'origin', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.origin_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("origin", curMemoryArea.origin_smart_getter);

// protocol
curMemoryArea.protocol_getter = function protocol() { debugger; }; mframe.safefunction(curMemoryArea.protocol_getter);
Object.defineProperty(curMemoryArea.protocol_getter, "name", {value: "get protocol",configurable: true,});
// protocol
curMemoryArea.protocol_setter = function protocol(val) {
    this._protocol = val; 
    this.jsdomMemory.protocol = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'protocol', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.protocol_setter);
Object.defineProperty(curMemoryArea.protocol_setter, "name", {value: "set protocol",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "protocol", {get: curMemoryArea.protocol_getter,set: curMemoryArea.protocol_setter,enumerable: true,configurable: true,});
curMemoryArea.protocol_smart_getter = function protocol() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._protocol !== undefined ? this._protocol : this.jsdomMemory.protocol; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'protocol', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.protocol_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("protocol", curMemoryArea.protocol_smart_getter);

// username
curMemoryArea.username_getter = function username() { debugger; }; mframe.safefunction(curMemoryArea.username_getter);
Object.defineProperty(curMemoryArea.username_getter, "name", {value: "get username",configurable: true,});
// username
curMemoryArea.username_setter = function username(val) {
    this._username = val; 
    this.jsdomMemory.username = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'username', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.username_setter);
Object.defineProperty(curMemoryArea.username_setter, "name", {value: "set username",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "username", {get: curMemoryArea.username_getter,set: curMemoryArea.username_setter,enumerable: true,configurable: true,});
curMemoryArea.username_smart_getter = function username() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._username !== undefined ? this._username : this.jsdomMemory.username; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'username', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.username_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("username", curMemoryArea.username_smart_getter);

// password
curMemoryArea.password_getter = function password() { debugger; }; mframe.safefunction(curMemoryArea.password_getter);
Object.defineProperty(curMemoryArea.password_getter, "name", {value: "get password",configurable: true,});
// password
curMemoryArea.password_setter = function password(val) {
    this._password = val; 
    this.jsdomMemory.password = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'password', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.password_setter);
Object.defineProperty(curMemoryArea.password_setter, "name", {value: "set password",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "password", {get: curMemoryArea.password_getter,set: curMemoryArea.password_setter,enumerable: true,configurable: true,});
curMemoryArea.password_smart_getter = function password() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._password !== undefined ? this._password : this.jsdomMemory.password; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'password', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.password_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("password", curMemoryArea.password_smart_getter);

// host
curMemoryArea.host_getter = function host() { debugger; }; mframe.safefunction(curMemoryArea.host_getter);
Object.defineProperty(curMemoryArea.host_getter, "name", {value: "get host",configurable: true,});
// host
curMemoryArea.host_setter = function host(val) {
    this._host = val; 
    this.jsdomMemory.host = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'host', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.host_setter);
Object.defineProperty(curMemoryArea.host_setter, "name", {value: "set host",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "host", {get: curMemoryArea.host_getter,set: curMemoryArea.host_setter,enumerable: true,configurable: true,});
curMemoryArea.host_smart_getter = function host() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._host !== undefined ? this._host : this.jsdomMemory.host; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'host', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.host_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("host", curMemoryArea.host_smart_getter);

// hostname
curMemoryArea.hostname_getter = function hostname() { debugger; }; mframe.safefunction(curMemoryArea.hostname_getter);
Object.defineProperty(curMemoryArea.hostname_getter, "name", {value: "get hostname",configurable: true,});
// hostname
curMemoryArea.hostname_setter = function hostname(val) {
    this._hostname = val; 
    this.jsdomMemory.hostname = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hostname', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.hostname_setter);
Object.defineProperty(curMemoryArea.hostname_setter, "name", {value: "set hostname",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hostname", {get: curMemoryArea.hostname_getter,set: curMemoryArea.hostname_setter,enumerable: true,configurable: true,});
curMemoryArea.hostname_smart_getter = function hostname() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._hostname !== undefined ? this._hostname : this.jsdomMemory.hostname; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hostname', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.hostname_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hostname", curMemoryArea.hostname_smart_getter);

// port
curMemoryArea.port_getter = function port() { debugger; }; mframe.safefunction(curMemoryArea.port_getter);
Object.defineProperty(curMemoryArea.port_getter, "name", {value: "get port",configurable: true,});
// port
curMemoryArea.port_setter = function port(val) {
    this._port = val; 
    this.jsdomMemory.port = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'port', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.port_setter);
Object.defineProperty(curMemoryArea.port_setter, "name", {value: "set port",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "port", {get: curMemoryArea.port_getter,set: curMemoryArea.port_setter,enumerable: true,configurable: true,});
curMemoryArea.port_smart_getter = function port() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._port !== undefined ? this._port : this.jsdomMemory.port; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'port', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.port_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("port", curMemoryArea.port_smart_getter);

// pathname
curMemoryArea.pathname_getter = function pathname() { debugger; }; mframe.safefunction(curMemoryArea.pathname_getter);
Object.defineProperty(curMemoryArea.pathname_getter, "name", {value: "get pathname",configurable: true,});
// pathname
curMemoryArea.pathname_setter = function pathname(val) {
    this._pathname = val; 
    this.jsdomMemory.pathname = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'pathname', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.pathname_setter);
Object.defineProperty(curMemoryArea.pathname_setter, "name", {value: "set pathname",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "pathname", {get: curMemoryArea.pathname_getter,set: curMemoryArea.pathname_setter,enumerable: true,configurable: true,});
curMemoryArea.pathname_smart_getter = function pathname() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._pathname !== undefined ? this._pathname : this.jsdomMemory.pathname; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'pathname', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.pathname_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("pathname", curMemoryArea.pathname_smart_getter);

// search
curMemoryArea.search_getter = function search() { debugger; }; mframe.safefunction(curMemoryArea.search_getter);
Object.defineProperty(curMemoryArea.search_getter, "name", {value: "get search",configurable: true,});
// search
curMemoryArea.search_setter = function search(val) {
    this._search = val; 
    this.jsdomMemory.search = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'search', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.search_setter);
Object.defineProperty(curMemoryArea.search_setter, "name", {value: "set search",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "search", {get: curMemoryArea.search_getter,set: curMemoryArea.search_setter,enumerable: true,configurable: true,});
curMemoryArea.search_smart_getter = function search() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._search !== undefined ? this._search : this.jsdomMemory.search; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'search', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.search_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("search", curMemoryArea.search_smart_getter);

// hash
curMemoryArea.hash_getter = function hash() { debugger; }; mframe.safefunction(curMemoryArea.hash_getter);
Object.defineProperty(curMemoryArea.hash_getter, "name", {value: "get hash",configurable: true,});
// hash
curMemoryArea.hash_setter = function hash(val) {
    this._hash = val; 
    this.jsdomMemory.hash = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hash', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.hash_setter);
Object.defineProperty(curMemoryArea.hash_setter, "name", {value: "set hash",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hash", {get: curMemoryArea.hash_getter,set: curMemoryArea.hash_setter,enumerable: true,configurable: true,});
curMemoryArea.hash_smart_getter = function hash() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._hash !== undefined ? this._hash : this.jsdomMemory.hash; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hash', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.hash_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hash", curMemoryArea.hash_smart_getter);

// href
curMemoryArea.href_getter = function href() { debugger; }; mframe.safefunction(curMemoryArea.href_getter);
Object.defineProperty(curMemoryArea.href_getter, "name", {value: "get href",configurable: true,});
// href
curMemoryArea.href_setter = function href(val) {
    this._href = val; 
    this.jsdomMemory.href = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'href', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.href_setter);
Object.defineProperty(curMemoryArea.href_setter, "name", {value: "set href",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "href", {get: curMemoryArea.href_getter,set: curMemoryArea.href_setter,enumerable: true,configurable: true,});
curMemoryArea.href_smart_getter = function href() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._href !== undefined ? this._href : this.jsdomMemory.href; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'href', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.href_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("href", curMemoryArea.href_smart_getter);

// hrefTranslate
curMemoryArea.hrefTranslate_getter = function hrefTranslate() { debugger; }; mframe.safefunction(curMemoryArea.hrefTranslate_getter);
Object.defineProperty(curMemoryArea.hrefTranslate_getter, "name", {value: "get hrefTranslate",configurable: true,});
// hrefTranslate
curMemoryArea.hrefTranslate_setter = function hrefTranslate(val) {
    this._hrefTranslate = val; 
    this.jsdomMemory.hrefTranslate = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hrefTranslate', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.hrefTranslate_setter);
Object.defineProperty(curMemoryArea.hrefTranslate_setter, "name", {value: "set hrefTranslate",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hrefTranslate", {get: curMemoryArea.hrefTranslate_getter,set: curMemoryArea.hrefTranslate_setter,enumerable: true,configurable: true,});
curMemoryArea.hrefTranslate_smart_getter = function hrefTranslate() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._hrefTranslate !== undefined ? this._hrefTranslate : this.jsdomMemory.hrefTranslate; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hrefTranslate', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.hrefTranslate_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hrefTranslate", curMemoryArea.hrefTranslate_smart_getter);

// attributionSrc
curMemoryArea.attributionSrc_getter = function attributionSrc() { debugger; }; mframe.safefunction(curMemoryArea.attributionSrc_getter);
Object.defineProperty(curMemoryArea.attributionSrc_getter, "name", {value: "get attributionSrc",configurable: true,});
// attributionSrc
curMemoryArea.attributionSrc_setter = function attributionSrc(val) {
    this._attributionSrc = val; 
    this.jsdomMemory.attributionSrc = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'attributionSrc', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.attributionSrc_setter);
Object.defineProperty(curMemoryArea.attributionSrc_setter, "name", {value: "set attributionSrc",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "attributionSrc", {get: curMemoryArea.attributionSrc_getter,set: curMemoryArea.attributionSrc_setter,enumerable: true,configurable: true,});
curMemoryArea.attributionSrc_smart_getter = function attributionSrc() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._attributionSrc !== undefined ? this._attributionSrc : this.jsdomMemory.attributionSrc; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'attributionSrc', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.attributionSrc_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("attributionSrc", curMemoryArea.attributionSrc_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLAnchorElement.prototype["toString"] = function toString() {
    var res = this.href;
    mframe.log({ flag: 'function', className: 'HTMLAnchorElement', methodName: 'toString', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLAnchorElement.prototype["toString"]);
//==============↑↑Function END↑↑====================


///////////////////////////////////////////////////////////

HTMLAnchorElement.__proto__ = HTMLElement;
HTMLAnchorElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['a'] = function () {
    var a = new (function () { });
    a.__proto__ = HTMLAnchorElement.prototype;

    return a;
}