var Document = function () { }; mframe.safefunction(Document);

Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true,
    }
});

document = {}
///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Document = {};

//============== Constant START ==================
Object.defineProperty(Document, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Document, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// implementation
curMemoryArea.implementation_getter = function implementation() { debugger; }; mframe.safefunction(curMemoryArea.implementation_getter);
Object.defineProperty(curMemoryArea.implementation_getter, "name", { value: "get implementation", configurable: true, });
Object.defineProperty(Document.prototype, "implementation", { get: curMemoryArea.implementation_getter, enumerable: true, configurable: true, });
curMemoryArea.implementation_smart_getter = function implementation() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的implementation的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.implementation_smart_getter);
Document.prototype.__defineGetter__("implementation", curMemoryArea.implementation_smart_getter);

// URL
curMemoryArea.URL_getter = function URL() { debugger; }; mframe.safefunction(curMemoryArea.URL_getter);
Object.defineProperty(curMemoryArea.URL_getter, "name", { value: "get URL", configurable: true, });
Object.defineProperty(Document.prototype, "URL", { get: curMemoryArea.URL_getter, enumerable: true, configurable: true, });
curMemoryArea.URL_smart_getter = function URL() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的URL的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.URL_smart_getter);
Document.prototype.__defineGetter__("URL", curMemoryArea.URL_smart_getter);

// documentURI
curMemoryArea.documentURI_getter = function documentURI() { debugger; }; mframe.safefunction(curMemoryArea.documentURI_getter);
Object.defineProperty(curMemoryArea.documentURI_getter, "name", { value: "get documentURI", configurable: true, });
Object.defineProperty(Document.prototype, "documentURI", { get: curMemoryArea.documentURI_getter, enumerable: true, configurable: true, });
curMemoryArea.documentURI_smart_getter = function documentURI() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的documentURI的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.documentURI_smart_getter);
Document.prototype.__defineGetter__("documentURI", curMemoryArea.documentURI_smart_getter);

// compatMode
curMemoryArea.compatMode_getter = function compatMode() { debugger; }; mframe.safefunction(curMemoryArea.compatMode_getter);
Object.defineProperty(curMemoryArea.compatMode_getter, "name", { value: "get compatMode", configurable: true, });
Object.defineProperty(Document.prototype, "compatMode", { get: curMemoryArea.compatMode_getter, enumerable: true, configurable: true, });
curMemoryArea.compatMode_smart_getter = function compatMode() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的compatMode的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.compatMode_smart_getter);
Document.prototype.__defineGetter__("compatMode", curMemoryArea.compatMode_smart_getter);

// characterSet
curMemoryArea.characterSet_getter = function characterSet() { debugger; }; mframe.safefunction(curMemoryArea.characterSet_getter);
Object.defineProperty(curMemoryArea.characterSet_getter, "name", { value: "get characterSet", configurable: true, });
Object.defineProperty(Document.prototype, "characterSet", { get: curMemoryArea.characterSet_getter, enumerable: true, configurable: true, });
curMemoryArea.characterSet_smart_getter = function characterSet() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的characterSet的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.characterSet_smart_getter);
Document.prototype.__defineGetter__("characterSet", curMemoryArea.characterSet_smart_getter);

// charset
curMemoryArea.charset_getter = function charset() { debugger; }; mframe.safefunction(curMemoryArea.charset_getter);
Object.defineProperty(curMemoryArea.charset_getter, "name", { value: "get charset", configurable: true, });
Object.defineProperty(Document.prototype, "charset", { get: curMemoryArea.charset_getter, enumerable: true, configurable: true, });
curMemoryArea.charset_smart_getter = function charset() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的charset的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.charset_smart_getter);
Document.prototype.__defineGetter__("charset", curMemoryArea.charset_smart_getter);

// inputEncoding
curMemoryArea.inputEncoding_getter = function inputEncoding() { debugger; }; mframe.safefunction(curMemoryArea.inputEncoding_getter);
Object.defineProperty(curMemoryArea.inputEncoding_getter, "name", { value: "get inputEncoding", configurable: true, });
Object.defineProperty(Document.prototype, "inputEncoding", { get: curMemoryArea.inputEncoding_getter, enumerable: true, configurable: true, });
curMemoryArea.inputEncoding_smart_getter = function inputEncoding() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的inputEncoding的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.inputEncoding_smart_getter);
Document.prototype.__defineGetter__("inputEncoding", curMemoryArea.inputEncoding_smart_getter);

// contentType
curMemoryArea.contentType_getter = function contentType() { debugger; }; mframe.safefunction(curMemoryArea.contentType_getter);
Object.defineProperty(curMemoryArea.contentType_getter, "name", { value: "get contentType", configurable: true, });
Object.defineProperty(Document.prototype, "contentType", { get: curMemoryArea.contentType_getter, enumerable: true, configurable: true, });
curMemoryArea.contentType_smart_getter = function contentType() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的contentType的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.contentType_smart_getter);
Document.prototype.__defineGetter__("contentType", curMemoryArea.contentType_smart_getter);

// doctype
curMemoryArea.doctype_getter = function doctype() { debugger; }; mframe.safefunction(curMemoryArea.doctype_getter);
Object.defineProperty(curMemoryArea.doctype_getter, "name", { value: "get doctype", configurable: true, });
Object.defineProperty(Document.prototype, "doctype", { get: curMemoryArea.doctype_getter, enumerable: true, configurable: true, });
curMemoryArea.doctype_smart_getter = function doctype() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的doctype的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.doctype_smart_getter);
Document.prototype.__defineGetter__("doctype", curMemoryArea.doctype_smart_getter);

// documentElement
curMemoryArea.documentElement_getter = function documentElement() { debugger; }; mframe.safefunction(curMemoryArea.documentElement_getter);
Object.defineProperty(curMemoryArea.documentElement_getter, "name", { value: "get documentElement", configurable: true, });
Object.defineProperty(Document.prototype, "documentElement", { get: curMemoryArea.documentElement_getter, enumerable: true, configurable: true, });
curMemoryArea.documentElement_smart_getter = function documentElement() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的documentElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.documentElement_smart_getter);
Document.prototype.__defineGetter__("documentElement", curMemoryArea.documentElement_smart_getter);

// xmlEncoding
curMemoryArea.xmlEncoding_getter = function xmlEncoding() { debugger; }; mframe.safefunction(curMemoryArea.xmlEncoding_getter);
Object.defineProperty(curMemoryArea.xmlEncoding_getter, "name", { value: "get xmlEncoding", configurable: true, });
Object.defineProperty(Document.prototype, "xmlEncoding", { get: curMemoryArea.xmlEncoding_getter, enumerable: true, configurable: true, });
curMemoryArea.xmlEncoding_smart_getter = function xmlEncoding() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的xmlEncoding的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.xmlEncoding_smart_getter);
Document.prototype.__defineGetter__("xmlEncoding", curMemoryArea.xmlEncoding_smart_getter);

// xmlVersion
curMemoryArea.xmlVersion_getter = function xmlVersion() { debugger; }; mframe.safefunction(curMemoryArea.xmlVersion_getter);
Object.defineProperty(curMemoryArea.xmlVersion_getter, "name", { value: "get xmlVersion", configurable: true, });
// xmlVersion
curMemoryArea.xmlVersion_setter = function xmlVersion(val) { debugger; }; mframe.safefunction(curMemoryArea.xmlVersion_setter);
Object.defineProperty(curMemoryArea.xmlVersion_setter, "name", { value: "set xmlVersion", configurable: true, });
Object.defineProperty(Document.prototype, "xmlVersion", { get: curMemoryArea.xmlVersion_getter, set: curMemoryArea.xmlVersion_setter, enumerable: true, configurable: true, });
curMemoryArea.xmlVersion_smart_getter = function xmlVersion() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的xmlVersion的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.xmlVersion_smart_getter);
Document.prototype.__defineGetter__("xmlVersion", curMemoryArea.xmlVersion_smart_getter);

// xmlStandalone
curMemoryArea.xmlStandalone_getter = function xmlStandalone() { debugger; }; mframe.safefunction(curMemoryArea.xmlStandalone_getter);
Object.defineProperty(curMemoryArea.xmlStandalone_getter, "name", { value: "get xmlStandalone", configurable: true, });
// xmlStandalone
curMemoryArea.xmlStandalone_setter = function xmlStandalone(val) { debugger; }; mframe.safefunction(curMemoryArea.xmlStandalone_setter);
Object.defineProperty(curMemoryArea.xmlStandalone_setter, "name", { value: "set xmlStandalone", configurable: true, });
Object.defineProperty(Document.prototype, "xmlStandalone", { get: curMemoryArea.xmlStandalone_getter, set: curMemoryArea.xmlStandalone_setter, enumerable: true, configurable: true, });
curMemoryArea.xmlStandalone_smart_getter = function xmlStandalone() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的xmlStandalone的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.xmlStandalone_smart_getter);
Document.prototype.__defineGetter__("xmlStandalone", curMemoryArea.xmlStandalone_smart_getter);

// domain
curMemoryArea.domain_getter = function domain() { debugger; }; mframe.safefunction(curMemoryArea.domain_getter);
Object.defineProperty(curMemoryArea.domain_getter, "name", { value: "get domain", configurable: true, });
// domain
curMemoryArea.domain_setter = function domain(val) { debugger; }; mframe.safefunction(curMemoryArea.domain_setter);
Object.defineProperty(curMemoryArea.domain_setter, "name", { value: "set domain", configurable: true, });
Object.defineProperty(Document.prototype, "domain", { get: curMemoryArea.domain_getter, set: curMemoryArea.domain_setter, enumerable: true, configurable: true, });
curMemoryArea.domain_smart_getter = function domain() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的domain的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.domain_smart_getter);
Document.prototype.__defineGetter__("domain", curMemoryArea.domain_smart_getter);

// referrer
curMemoryArea.referrer_getter = function referrer() { debugger; }; mframe.safefunction(curMemoryArea.referrer_getter);
Object.defineProperty(curMemoryArea.referrer_getter, "name", { value: "get referrer", configurable: true, });
Object.defineProperty(Document.prototype, "referrer", { get: curMemoryArea.referrer_getter, enumerable: true, configurable: true, });
curMemoryArea.referrer_smart_getter = function referrer() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的referrer的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.referrer_smart_getter);
Document.prototype.__defineGetter__("referrer", curMemoryArea.referrer_smart_getter);

// cookie
curMemoryArea.cookie_getter = function cookie() { debugger; }; mframe.safefunction(curMemoryArea.cookie_getter);
Object.defineProperty(curMemoryArea.cookie_getter, "name", { value: "get cookie", configurable: true, });
// cookie
curMemoryArea.cookie_setter = function cookie(val) { debugger; }; mframe.safefunction(curMemoryArea.cookie_setter);
Object.defineProperty(curMemoryArea.cookie_setter, "name", { value: "set cookie", configurable: true, });
Object.defineProperty(Document.prototype, "cookie", { get: curMemoryArea.cookie_getter, set: curMemoryArea.cookie_setter, enumerable: true, configurable: true, });
curMemoryArea.cookie_smart_getter = function cookie() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的cookie的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.cookie_smart_getter);
Document.prototype.__defineGetter__("cookie", curMemoryArea.cookie_smart_getter);

// lastModified
curMemoryArea.lastModified_getter = function lastModified() { debugger; }; mframe.safefunction(curMemoryArea.lastModified_getter);
Object.defineProperty(curMemoryArea.lastModified_getter, "name", { value: "get lastModified", configurable: true, });
Object.defineProperty(Document.prototype, "lastModified", { get: curMemoryArea.lastModified_getter, enumerable: true, configurable: true, });
curMemoryArea.lastModified_smart_getter = function lastModified() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的lastModified的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.lastModified_smart_getter);
Document.prototype.__defineGetter__("lastModified", curMemoryArea.lastModified_smart_getter);

// readyState
curMemoryArea.readyState_getter = function readyState() { debugger; }; mframe.safefunction(curMemoryArea.readyState_getter);
Object.defineProperty(curMemoryArea.readyState_getter, "name", { value: "get readyState", configurable: true, });
Object.defineProperty(Document.prototype, "readyState", { get: curMemoryArea.readyState_getter, enumerable: true, configurable: true, });
curMemoryArea.readyState_smart_getter = function readyState() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的readyState的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.readyState_smart_getter);
Document.prototype.__defineGetter__("readyState", curMemoryArea.readyState_smart_getter);

// title
curMemoryArea.title_getter = function title() { debugger; }; mframe.safefunction(curMemoryArea.title_getter);
Object.defineProperty(curMemoryArea.title_getter, "name", { value: "get title", configurable: true, });
// title
curMemoryArea.title_setter = function title(val) { debugger; }; mframe.safefunction(curMemoryArea.title_setter);
Object.defineProperty(curMemoryArea.title_setter, "name", { value: "set title", configurable: true, });
Object.defineProperty(Document.prototype, "title", { get: curMemoryArea.title_getter, set: curMemoryArea.title_setter, enumerable: true, configurable: true, });
curMemoryArea.title_smart_getter = function title() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的title的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.title_smart_getter);
Document.prototype.__defineGetter__("title", curMemoryArea.title_smart_getter);

// dir
curMemoryArea.dir_getter = function dir() { debugger; }; mframe.safefunction(curMemoryArea.dir_getter);
Object.defineProperty(curMemoryArea.dir_getter, "name", { value: "get dir", configurable: true, });
// dir
curMemoryArea.dir_setter = function dir(val) { debugger; }; mframe.safefunction(curMemoryArea.dir_setter);
Object.defineProperty(curMemoryArea.dir_setter, "name", { value: "set dir", configurable: true, });
Object.defineProperty(Document.prototype, "dir", { get: curMemoryArea.dir_getter, set: curMemoryArea.dir_setter, enumerable: true, configurable: true, });
curMemoryArea.dir_smart_getter = function dir() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的dir的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.dir_smart_getter);
Document.prototype.__defineGetter__("dir", curMemoryArea.dir_smart_getter);

// body
curMemoryArea.body_getter = function body() { debugger; }; mframe.safefunction(curMemoryArea.body_getter);
Object.defineProperty(curMemoryArea.body_getter, "name", { value: "get body", configurable: true, });
// body
curMemoryArea.body_setter = function body(val) { debugger; }; mframe.safefunction(curMemoryArea.body_setter);
Object.defineProperty(curMemoryArea.body_setter, "name", { value: "set body", configurable: true, });
Object.defineProperty(Document.prototype, "body", { get: curMemoryArea.body_getter, set: curMemoryArea.body_setter, enumerable: true, configurable: true, });
curMemoryArea.body_smart_getter = function body() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的body的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.body_smart_getter);
Document.prototype.__defineGetter__("body", curMemoryArea.body_smart_getter);

// head
curMemoryArea.head_getter = function head() { debugger; }; mframe.safefunction(curMemoryArea.head_getter);
Object.defineProperty(curMemoryArea.head_getter, "name", { value: "get head", configurable: true, });
Object.defineProperty(Document.prototype, "head", { get: curMemoryArea.head_getter, enumerable: true, configurable: true, });
curMemoryArea.head_smart_getter = function head() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的head的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.head_smart_getter);
Document.prototype.__defineGetter__("head", curMemoryArea.head_smart_getter);

// images
curMemoryArea.images_getter = function images() { debugger; }; mframe.safefunction(curMemoryArea.images_getter);
Object.defineProperty(curMemoryArea.images_getter, "name", { value: "get images", configurable: true, });
Object.defineProperty(Document.prototype, "images", { get: curMemoryArea.images_getter, enumerable: true, configurable: true, });
curMemoryArea.images_smart_getter = function images() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的images的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.images_smart_getter);
Document.prototype.__defineGetter__("images", curMemoryArea.images_smart_getter);

// embeds
curMemoryArea.embeds_getter = function embeds() { debugger; }; mframe.safefunction(curMemoryArea.embeds_getter);
Object.defineProperty(curMemoryArea.embeds_getter, "name", { value: "get embeds", configurable: true, });
Object.defineProperty(Document.prototype, "embeds", { get: curMemoryArea.embeds_getter, enumerable: true, configurable: true, });
curMemoryArea.embeds_smart_getter = function embeds() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的embeds的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.embeds_smart_getter);
Document.prototype.__defineGetter__("embeds", curMemoryArea.embeds_smart_getter);

// plugins
curMemoryArea.plugins_getter = function plugins() { debugger; }; mframe.safefunction(curMemoryArea.plugins_getter);
Object.defineProperty(curMemoryArea.plugins_getter, "name", { value: "get plugins", configurable: true, });
Object.defineProperty(Document.prototype, "plugins", { get: curMemoryArea.plugins_getter, enumerable: true, configurable: true, });
curMemoryArea.plugins_smart_getter = function plugins() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的plugins的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.plugins_smart_getter);
Document.prototype.__defineGetter__("plugins", curMemoryArea.plugins_smart_getter);

// links
curMemoryArea.links_getter = function links() { debugger; }; mframe.safefunction(curMemoryArea.links_getter);
Object.defineProperty(curMemoryArea.links_getter, "name", { value: "get links", configurable: true, });
Object.defineProperty(Document.prototype, "links", { get: curMemoryArea.links_getter, enumerable: true, configurable: true, });
curMemoryArea.links_smart_getter = function links() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的links的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.links_smart_getter);
Document.prototype.__defineGetter__("links", curMemoryArea.links_smart_getter);

// forms
curMemoryArea.forms_getter = function forms() { debugger; }; mframe.safefunction(curMemoryArea.forms_getter);
Object.defineProperty(curMemoryArea.forms_getter, "name", { value: "get forms", configurable: true, });
Object.defineProperty(Document.prototype, "forms", { get: curMemoryArea.forms_getter, enumerable: true, configurable: true, });
curMemoryArea.forms_smart_getter = function forms() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的forms的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.forms_smart_getter);
Document.prototype.__defineGetter__("forms", curMemoryArea.forms_smart_getter);

// scripts
curMemoryArea.scripts_getter = function scripts() { debugger; }; mframe.safefunction(curMemoryArea.scripts_getter);
Object.defineProperty(curMemoryArea.scripts_getter, "name", { value: "get scripts", configurable: true, });
Object.defineProperty(Document.prototype, "scripts", { get: curMemoryArea.scripts_getter, enumerable: true, configurable: true, });
curMemoryArea.scripts_smart_getter = function scripts() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的scripts的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scripts_smart_getter);
Document.prototype.__defineGetter__("scripts", curMemoryArea.scripts_smart_getter);

// currentScript
curMemoryArea.currentScript_getter = function currentScript() { debugger; }; mframe.safefunction(curMemoryArea.currentScript_getter);
Object.defineProperty(curMemoryArea.currentScript_getter, "name", { value: "get currentScript", configurable: true, });
Object.defineProperty(Document.prototype, "currentScript", { get: curMemoryArea.currentScript_getter, enumerable: true, configurable: true, });
curMemoryArea.currentScript_smart_getter = function currentScript() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的currentScript的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.currentScript_smart_getter);
Document.prototype.__defineGetter__("currentScript", curMemoryArea.currentScript_smart_getter);

// defaultView
curMemoryArea.defaultView_getter = function defaultView() { debugger; }; mframe.safefunction(curMemoryArea.defaultView_getter);
Object.defineProperty(curMemoryArea.defaultView_getter, "name", { value: "get defaultView", configurable: true, });
Object.defineProperty(Document.prototype, "defaultView", { get: curMemoryArea.defaultView_getter, enumerable: true, configurable: true, });
curMemoryArea.defaultView_smart_getter = function defaultView() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的defaultView的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.defaultView_smart_getter);
Document.prototype.__defineGetter__("defaultView", curMemoryArea.defaultView_smart_getter);

// designMode
curMemoryArea.designMode_getter = function designMode() { debugger; }; mframe.safefunction(curMemoryArea.designMode_getter);
Object.defineProperty(curMemoryArea.designMode_getter, "name", { value: "get designMode", configurable: true, });
// designMode
curMemoryArea.designMode_setter = function designMode(val) { debugger; }; mframe.safefunction(curMemoryArea.designMode_setter);
Object.defineProperty(curMemoryArea.designMode_setter, "name", { value: "set designMode", configurable: true, });
Object.defineProperty(Document.prototype, "designMode", { get: curMemoryArea.designMode_getter, set: curMemoryArea.designMode_setter, enumerable: true, configurable: true, });
curMemoryArea.designMode_smart_getter = function designMode() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的designMode的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.designMode_smart_getter);
Document.prototype.__defineGetter__("designMode", curMemoryArea.designMode_smart_getter);

// onreadystatechange
curMemoryArea.onreadystatechange_getter = function onreadystatechange() { debugger; }; mframe.safefunction(curMemoryArea.onreadystatechange_getter);
Object.defineProperty(curMemoryArea.onreadystatechange_getter, "name", { value: "get onreadystatechange", configurable: true, });
// onreadystatechange
curMemoryArea.onreadystatechange_setter = function onreadystatechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onreadystatechange_setter);
Object.defineProperty(curMemoryArea.onreadystatechange_setter, "name", { value: "set onreadystatechange", configurable: true, });
Object.defineProperty(Document.prototype, "onreadystatechange", { get: curMemoryArea.onreadystatechange_getter, set: curMemoryArea.onreadystatechange_setter, enumerable: true, configurable: true, });
curMemoryArea.onreadystatechange_smart_getter = function onreadystatechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onreadystatechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onreadystatechange_smart_getter);
Document.prototype.__defineGetter__("onreadystatechange", curMemoryArea.onreadystatechange_smart_getter);

// anchors
curMemoryArea.anchors_getter = function anchors() { debugger; }; mframe.safefunction(curMemoryArea.anchors_getter);
Object.defineProperty(curMemoryArea.anchors_getter, "name", { value: "get anchors", configurable: true, });
Object.defineProperty(Document.prototype, "anchors", { get: curMemoryArea.anchors_getter, enumerable: true, configurable: true, });
curMemoryArea.anchors_smart_getter = function anchors() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的anchors的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.anchors_smart_getter);
Document.prototype.__defineGetter__("anchors", curMemoryArea.anchors_smart_getter);

// applets
curMemoryArea.applets_getter = function applets() { debugger; }; mframe.safefunction(curMemoryArea.applets_getter);
Object.defineProperty(curMemoryArea.applets_getter, "name", { value: "get applets", configurable: true, });
Object.defineProperty(Document.prototype, "applets", { get: curMemoryArea.applets_getter, enumerable: true, configurable: true, });
curMemoryArea.applets_smart_getter = function applets() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的applets的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.applets_smart_getter);
Document.prototype.__defineGetter__("applets", curMemoryArea.applets_smart_getter);

// fgColor
curMemoryArea.fgColor_getter = function fgColor() { debugger; }; mframe.safefunction(curMemoryArea.fgColor_getter);
Object.defineProperty(curMemoryArea.fgColor_getter, "name", { value: "get fgColor", configurable: true, });
// fgColor
curMemoryArea.fgColor_setter = function fgColor(val) { debugger; }; mframe.safefunction(curMemoryArea.fgColor_setter);
Object.defineProperty(curMemoryArea.fgColor_setter, "name", { value: "set fgColor", configurable: true, });
Object.defineProperty(Document.prototype, "fgColor", { get: curMemoryArea.fgColor_getter, set: curMemoryArea.fgColor_setter, enumerable: true, configurable: true, });
curMemoryArea.fgColor_smart_getter = function fgColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fgColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fgColor_smart_getter);
Document.prototype.__defineGetter__("fgColor", curMemoryArea.fgColor_smart_getter);

// linkColor
curMemoryArea.linkColor_getter = function linkColor() { debugger; }; mframe.safefunction(curMemoryArea.linkColor_getter);
Object.defineProperty(curMemoryArea.linkColor_getter, "name", { value: "get linkColor", configurable: true, });
// linkColor
curMemoryArea.linkColor_setter = function linkColor(val) { debugger; }; mframe.safefunction(curMemoryArea.linkColor_setter);
Object.defineProperty(curMemoryArea.linkColor_setter, "name", { value: "set linkColor", configurable: true, });
Object.defineProperty(Document.prototype, "linkColor", { get: curMemoryArea.linkColor_getter, set: curMemoryArea.linkColor_setter, enumerable: true, configurable: true, });
curMemoryArea.linkColor_smart_getter = function linkColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的linkColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.linkColor_smart_getter);
Document.prototype.__defineGetter__("linkColor", curMemoryArea.linkColor_smart_getter);

// vlinkColor
curMemoryArea.vlinkColor_getter = function vlinkColor() { debugger; }; mframe.safefunction(curMemoryArea.vlinkColor_getter);
Object.defineProperty(curMemoryArea.vlinkColor_getter, "name", { value: "get vlinkColor", configurable: true, });
// vlinkColor
curMemoryArea.vlinkColor_setter = function vlinkColor(val) { debugger; }; mframe.safefunction(curMemoryArea.vlinkColor_setter);
Object.defineProperty(curMemoryArea.vlinkColor_setter, "name", { value: "set vlinkColor", configurable: true, });
Object.defineProperty(Document.prototype, "vlinkColor", { get: curMemoryArea.vlinkColor_getter, set: curMemoryArea.vlinkColor_setter, enumerable: true, configurable: true, });
curMemoryArea.vlinkColor_smart_getter = function vlinkColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的vlinkColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.vlinkColor_smart_getter);
Document.prototype.__defineGetter__("vlinkColor", curMemoryArea.vlinkColor_smart_getter);

// alinkColor
curMemoryArea.alinkColor_getter = function alinkColor() { debugger; }; mframe.safefunction(curMemoryArea.alinkColor_getter);
Object.defineProperty(curMemoryArea.alinkColor_getter, "name", { value: "get alinkColor", configurable: true, });
// alinkColor
curMemoryArea.alinkColor_setter = function alinkColor(val) { debugger; }; mframe.safefunction(curMemoryArea.alinkColor_setter);
Object.defineProperty(curMemoryArea.alinkColor_setter, "name", { value: "set alinkColor", configurable: true, });
Object.defineProperty(Document.prototype, "alinkColor", { get: curMemoryArea.alinkColor_getter, set: curMemoryArea.alinkColor_setter, enumerable: true, configurable: true, });
curMemoryArea.alinkColor_smart_getter = function alinkColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的alinkColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.alinkColor_smart_getter);
Document.prototype.__defineGetter__("alinkColor", curMemoryArea.alinkColor_smart_getter);

// bgColor
curMemoryArea.bgColor_getter = function bgColor() { debugger; }; mframe.safefunction(curMemoryArea.bgColor_getter);
Object.defineProperty(curMemoryArea.bgColor_getter, "name", { value: "get bgColor", configurable: true, });
// bgColor
curMemoryArea.bgColor_setter = function bgColor(val) { debugger; }; mframe.safefunction(curMemoryArea.bgColor_setter);
Object.defineProperty(curMemoryArea.bgColor_setter, "name", { value: "set bgColor", configurable: true, });
Object.defineProperty(Document.prototype, "bgColor", { get: curMemoryArea.bgColor_getter, set: curMemoryArea.bgColor_setter, enumerable: true, configurable: true, });
curMemoryArea.bgColor_smart_getter = function bgColor() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的bgColor的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.bgColor_smart_getter);
Document.prototype.__defineGetter__("bgColor", curMemoryArea.bgColor_smart_getter);

// all
curMemoryArea.all_getter = function all() { debugger; }; mframe.safefunction(curMemoryArea.all_getter);
Object.defineProperty(curMemoryArea.all_getter, "name", { value: "get all", configurable: true, });
Object.defineProperty(Document.prototype, "all", { get: curMemoryArea.all_getter, enumerable: true, configurable: true, });
curMemoryArea.all_smart_getter = function all() {
    let defaultValue = undefined;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的all的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.all_smart_getter);
Document.prototype.__defineGetter__("all", curMemoryArea.all_smart_getter);

// scrollingElement
curMemoryArea.scrollingElement_getter = function scrollingElement() { debugger; }; mframe.safefunction(curMemoryArea.scrollingElement_getter);
Object.defineProperty(curMemoryArea.scrollingElement_getter, "name", { value: "get scrollingElement", configurable: true, });
Object.defineProperty(Document.prototype, "scrollingElement", { get: curMemoryArea.scrollingElement_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollingElement_smart_getter = function scrollingElement() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的scrollingElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollingElement_smart_getter);
Document.prototype.__defineGetter__("scrollingElement", curMemoryArea.scrollingElement_smart_getter);

// onpointerlockchange
curMemoryArea.onpointerlockchange_getter = function onpointerlockchange() { debugger; }; mframe.safefunction(curMemoryArea.onpointerlockchange_getter);
Object.defineProperty(curMemoryArea.onpointerlockchange_getter, "name", { value: "get onpointerlockchange", configurable: true, });
// onpointerlockchange
curMemoryArea.onpointerlockchange_setter = function onpointerlockchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerlockchange_setter);
Object.defineProperty(curMemoryArea.onpointerlockchange_setter, "name", { value: "set onpointerlockchange", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerlockchange", { get: curMemoryArea.onpointerlockchange_getter, set: curMemoryArea.onpointerlockchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerlockchange_smart_getter = function onpointerlockchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerlockchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerlockchange_smart_getter);
Document.prototype.__defineGetter__("onpointerlockchange", curMemoryArea.onpointerlockchange_smart_getter);

// onpointerlockerror
curMemoryArea.onpointerlockerror_getter = function onpointerlockerror() { debugger; }; mframe.safefunction(curMemoryArea.onpointerlockerror_getter);
Object.defineProperty(curMemoryArea.onpointerlockerror_getter, "name", { value: "get onpointerlockerror", configurable: true, });
// onpointerlockerror
curMemoryArea.onpointerlockerror_setter = function onpointerlockerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerlockerror_setter);
Object.defineProperty(curMemoryArea.onpointerlockerror_setter, "name", { value: "set onpointerlockerror", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerlockerror", { get: curMemoryArea.onpointerlockerror_getter, set: curMemoryArea.onpointerlockerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerlockerror_smart_getter = function onpointerlockerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerlockerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerlockerror_smart_getter);
Document.prototype.__defineGetter__("onpointerlockerror", curMemoryArea.onpointerlockerror_smart_getter);

// hidden
curMemoryArea.hidden_getter = function hidden() { debugger; }; mframe.safefunction(curMemoryArea.hidden_getter);
Object.defineProperty(curMemoryArea.hidden_getter, "name", { value: "get hidden", configurable: true, });
Object.defineProperty(Document.prototype, "hidden", { get: curMemoryArea.hidden_getter, enumerable: true, configurable: true, });
curMemoryArea.hidden_smart_getter = function hidden() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的hidden的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.hidden_smart_getter);
Document.prototype.__defineGetter__("hidden", curMemoryArea.hidden_smart_getter);

// visibilityState
curMemoryArea.visibilityState_getter = function visibilityState() { debugger; }; mframe.safefunction(curMemoryArea.visibilityState_getter);
Object.defineProperty(curMemoryArea.visibilityState_getter, "name", { value: "get visibilityState", configurable: true, });
Object.defineProperty(Document.prototype, "visibilityState", { get: curMemoryArea.visibilityState_getter, enumerable: true, configurable: true, });
curMemoryArea.visibilityState_smart_getter = function visibilityState() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的visibilityState的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.visibilityState_smart_getter);
Document.prototype.__defineGetter__("visibilityState", curMemoryArea.visibilityState_smart_getter);

// wasDiscarded
curMemoryArea.wasDiscarded_getter = function wasDiscarded() { debugger; }; mframe.safefunction(curMemoryArea.wasDiscarded_getter);
Object.defineProperty(curMemoryArea.wasDiscarded_getter, "name", { value: "get wasDiscarded", configurable: true, });
Object.defineProperty(Document.prototype, "wasDiscarded", { get: curMemoryArea.wasDiscarded_getter, enumerable: true, configurable: true, });
curMemoryArea.wasDiscarded_smart_getter = function wasDiscarded() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的wasDiscarded的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.wasDiscarded_smart_getter);
Document.prototype.__defineGetter__("wasDiscarded", curMemoryArea.wasDiscarded_smart_getter);

// prerendering
curMemoryArea.prerendering_getter = function prerendering() { debugger; }; mframe.safefunction(curMemoryArea.prerendering_getter);
Object.defineProperty(curMemoryArea.prerendering_getter, "name", { value: "get prerendering", configurable: true, });
Object.defineProperty(Document.prototype, "prerendering", { get: curMemoryArea.prerendering_getter, enumerable: true, configurable: true, });
curMemoryArea.prerendering_smart_getter = function prerendering() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的prerendering的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.prerendering_smart_getter);
Document.prototype.__defineGetter__("prerendering", curMemoryArea.prerendering_smart_getter);

// featurePolicy
curMemoryArea.featurePolicy_getter = function featurePolicy() { debugger; }; mframe.safefunction(curMemoryArea.featurePolicy_getter);
Object.defineProperty(curMemoryArea.featurePolicy_getter, "name", { value: "get featurePolicy", configurable: true, });
Object.defineProperty(Document.prototype, "featurePolicy", { get: curMemoryArea.featurePolicy_getter, enumerable: true, configurable: true, });
curMemoryArea.featurePolicy_smart_getter = function featurePolicy() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的featurePolicy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.featurePolicy_smart_getter);
Document.prototype.__defineGetter__("featurePolicy", curMemoryArea.featurePolicy_smart_getter);

// webkitVisibilityState
curMemoryArea.webkitVisibilityState_getter = function webkitVisibilityState() { debugger; }; mframe.safefunction(curMemoryArea.webkitVisibilityState_getter);
Object.defineProperty(curMemoryArea.webkitVisibilityState_getter, "name", { value: "get webkitVisibilityState", configurable: true, });
Object.defineProperty(Document.prototype, "webkitVisibilityState", { get: curMemoryArea.webkitVisibilityState_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitVisibilityState_smart_getter = function webkitVisibilityState() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitVisibilityState的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitVisibilityState_smart_getter);
Document.prototype.__defineGetter__("webkitVisibilityState", curMemoryArea.webkitVisibilityState_smart_getter);

// webkitHidden
curMemoryArea.webkitHidden_getter = function webkitHidden() { debugger; }; mframe.safefunction(curMemoryArea.webkitHidden_getter);
Object.defineProperty(curMemoryArea.webkitHidden_getter, "name", { value: "get webkitHidden", configurable: true, });
Object.defineProperty(Document.prototype, "webkitHidden", { get: curMemoryArea.webkitHidden_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitHidden_smart_getter = function webkitHidden() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitHidden的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitHidden_smart_getter);
Document.prototype.__defineGetter__("webkitHidden", curMemoryArea.webkitHidden_smart_getter);

// onbeforecopy
curMemoryArea.onbeforecopy_getter = function onbeforecopy() { debugger; }; mframe.safefunction(curMemoryArea.onbeforecopy_getter);
Object.defineProperty(curMemoryArea.onbeforecopy_getter, "name", { value: "get onbeforecopy", configurable: true, });
// onbeforecopy
curMemoryArea.onbeforecopy_setter = function onbeforecopy(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforecopy_setter);
Object.defineProperty(curMemoryArea.onbeforecopy_setter, "name", { value: "set onbeforecopy", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforecopy", { get: curMemoryArea.onbeforecopy_getter, set: curMemoryArea.onbeforecopy_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecopy_smart_getter = function onbeforecopy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforecopy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforecopy_smart_getter);
Document.prototype.__defineGetter__("onbeforecopy", curMemoryArea.onbeforecopy_smart_getter);

// onbeforecut
curMemoryArea.onbeforecut_getter = function onbeforecut() { debugger; }; mframe.safefunction(curMemoryArea.onbeforecut_getter);
Object.defineProperty(curMemoryArea.onbeforecut_getter, "name", { value: "get onbeforecut", configurable: true, });
// onbeforecut
curMemoryArea.onbeforecut_setter = function onbeforecut(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforecut_setter);
Object.defineProperty(curMemoryArea.onbeforecut_setter, "name", { value: "set onbeforecut", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforecut", { get: curMemoryArea.onbeforecut_getter, set: curMemoryArea.onbeforecut_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecut_smart_getter = function onbeforecut() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforecut的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforecut_smart_getter);
Document.prototype.__defineGetter__("onbeforecut", curMemoryArea.onbeforecut_smart_getter);

// onbeforepaste
curMemoryArea.onbeforepaste_getter = function onbeforepaste() { debugger; }; mframe.safefunction(curMemoryArea.onbeforepaste_getter);
Object.defineProperty(curMemoryArea.onbeforepaste_getter, "name", { value: "get onbeforepaste", configurable: true, });
// onbeforepaste
curMemoryArea.onbeforepaste_setter = function onbeforepaste(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforepaste_setter);
Object.defineProperty(curMemoryArea.onbeforepaste_setter, "name", { value: "set onbeforepaste", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforepaste", { get: curMemoryArea.onbeforepaste_getter, set: curMemoryArea.onbeforepaste_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforepaste_smart_getter = function onbeforepaste() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforepaste的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforepaste_smart_getter);
Document.prototype.__defineGetter__("onbeforepaste", curMemoryArea.onbeforepaste_smart_getter);

// onfreeze
curMemoryArea.onfreeze_getter = function onfreeze() { debugger; }; mframe.safefunction(curMemoryArea.onfreeze_getter);
Object.defineProperty(curMemoryArea.onfreeze_getter, "name", { value: "get onfreeze", configurable: true, });
// onfreeze
curMemoryArea.onfreeze_setter = function onfreeze(val) { debugger; }; mframe.safefunction(curMemoryArea.onfreeze_setter);
Object.defineProperty(curMemoryArea.onfreeze_setter, "name", { value: "set onfreeze", configurable: true, });
Object.defineProperty(Document.prototype, "onfreeze", { get: curMemoryArea.onfreeze_getter, set: curMemoryArea.onfreeze_setter, enumerable: true, configurable: true, });
curMemoryArea.onfreeze_smart_getter = function onfreeze() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onfreeze的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfreeze_smart_getter);
Document.prototype.__defineGetter__("onfreeze", curMemoryArea.onfreeze_smart_getter);

// onprerenderingchange
curMemoryArea.onprerenderingchange_getter = function onprerenderingchange() { debugger; }; mframe.safefunction(curMemoryArea.onprerenderingchange_getter);
Object.defineProperty(curMemoryArea.onprerenderingchange_getter, "name", { value: "get onprerenderingchange", configurable: true, });
// onprerenderingchange
curMemoryArea.onprerenderingchange_setter = function onprerenderingchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onprerenderingchange_setter);
Object.defineProperty(curMemoryArea.onprerenderingchange_setter, "name", { value: "set onprerenderingchange", configurable: true, });
Object.defineProperty(Document.prototype, "onprerenderingchange", { get: curMemoryArea.onprerenderingchange_getter, set: curMemoryArea.onprerenderingchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onprerenderingchange_smart_getter = function onprerenderingchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onprerenderingchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onprerenderingchange_smart_getter);
Document.prototype.__defineGetter__("onprerenderingchange", curMemoryArea.onprerenderingchange_smart_getter);

// onresume
curMemoryArea.onresume_getter = function onresume() { debugger; }; mframe.safefunction(curMemoryArea.onresume_getter);
Object.defineProperty(curMemoryArea.onresume_getter, "name", { value: "get onresume", configurable: true, });
// onresume
curMemoryArea.onresume_setter = function onresume(val) { debugger; }; mframe.safefunction(curMemoryArea.onresume_setter);
Object.defineProperty(curMemoryArea.onresume_setter, "name", { value: "set onresume", configurable: true, });
Object.defineProperty(Document.prototype, "onresume", { get: curMemoryArea.onresume_getter, set: curMemoryArea.onresume_setter, enumerable: true, configurable: true, });
curMemoryArea.onresume_smart_getter = function onresume() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onresume的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onresume_smart_getter);
Document.prototype.__defineGetter__("onresume", curMemoryArea.onresume_smart_getter);

// onsearch
curMemoryArea.onsearch_getter = function onsearch() { debugger; }; mframe.safefunction(curMemoryArea.onsearch_getter);
Object.defineProperty(curMemoryArea.onsearch_getter, "name", { value: "get onsearch", configurable: true, });
// onsearch
curMemoryArea.onsearch_setter = function onsearch(val) { debugger; }; mframe.safefunction(curMemoryArea.onsearch_setter);
Object.defineProperty(curMemoryArea.onsearch_setter, "name", { value: "set onsearch", configurable: true, });
Object.defineProperty(Document.prototype, "onsearch", { get: curMemoryArea.onsearch_getter, set: curMemoryArea.onsearch_setter, enumerable: true, configurable: true, });
curMemoryArea.onsearch_smart_getter = function onsearch() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onsearch的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsearch_smart_getter);
Document.prototype.__defineGetter__("onsearch", curMemoryArea.onsearch_smart_getter);

// onvisibilitychange
curMemoryArea.onvisibilitychange_getter = function onvisibilitychange() { debugger; }; mframe.safefunction(curMemoryArea.onvisibilitychange_getter);
Object.defineProperty(curMemoryArea.onvisibilitychange_getter, "name", { value: "get onvisibilitychange", configurable: true, });
// onvisibilitychange
curMemoryArea.onvisibilitychange_setter = function onvisibilitychange(val) { debugger; }; mframe.safefunction(curMemoryArea.onvisibilitychange_setter);
Object.defineProperty(curMemoryArea.onvisibilitychange_setter, "name", { value: "set onvisibilitychange", configurable: true, });
Object.defineProperty(Document.prototype, "onvisibilitychange", { get: curMemoryArea.onvisibilitychange_getter, set: curMemoryArea.onvisibilitychange_setter, enumerable: true, configurable: true, });
curMemoryArea.onvisibilitychange_smart_getter = function onvisibilitychange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onvisibilitychange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onvisibilitychange_smart_getter);
Document.prototype.__defineGetter__("onvisibilitychange", curMemoryArea.onvisibilitychange_smart_getter);

// timeline
curMemoryArea.timeline_getter = function timeline() { debugger; }; mframe.safefunction(curMemoryArea.timeline_getter);
Object.defineProperty(curMemoryArea.timeline_getter, "name", { value: "get timeline", configurable: true, });
Object.defineProperty(Document.prototype, "timeline", { get: curMemoryArea.timeline_getter, enumerable: true, configurable: true, });
curMemoryArea.timeline_smart_getter = function timeline() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的timeline的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.timeline_smart_getter);
Document.prototype.__defineGetter__("timeline", curMemoryArea.timeline_smart_getter);

// fullscreenEnabled
curMemoryArea.fullscreenEnabled_getter = function fullscreenEnabled() { debugger; }; mframe.safefunction(curMemoryArea.fullscreenEnabled_getter);
Object.defineProperty(curMemoryArea.fullscreenEnabled_getter, "name", { value: "get fullscreenEnabled", configurable: true, });
// fullscreenEnabled
curMemoryArea.fullscreenEnabled_setter = function fullscreenEnabled(val) { debugger; }; mframe.safefunction(curMemoryArea.fullscreenEnabled_setter);
Object.defineProperty(curMemoryArea.fullscreenEnabled_setter, "name", { value: "set fullscreenEnabled", configurable: true, });
Object.defineProperty(Document.prototype, "fullscreenEnabled", { get: curMemoryArea.fullscreenEnabled_getter, set: curMemoryArea.fullscreenEnabled_setter, enumerable: true, configurable: true, });
curMemoryArea.fullscreenEnabled_smart_getter = function fullscreenEnabled() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fullscreenEnabled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fullscreenEnabled_smart_getter);
Document.prototype.__defineGetter__("fullscreenEnabled", curMemoryArea.fullscreenEnabled_smart_getter);

// fullscreen
curMemoryArea.fullscreen_getter = function fullscreen() { debugger; }; mframe.safefunction(curMemoryArea.fullscreen_getter);
Object.defineProperty(curMemoryArea.fullscreen_getter, "name", { value: "get fullscreen", configurable: true, });
// fullscreen
curMemoryArea.fullscreen_setter = function fullscreen(val) { debugger; }; mframe.safefunction(curMemoryArea.fullscreen_setter);
Object.defineProperty(curMemoryArea.fullscreen_setter, "name", { value: "set fullscreen", configurable: true, });
Object.defineProperty(Document.prototype, "fullscreen", { get: curMemoryArea.fullscreen_getter, set: curMemoryArea.fullscreen_setter, enumerable: true, configurable: true, });
curMemoryArea.fullscreen_smart_getter = function fullscreen() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fullscreen的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fullscreen_smart_getter);
Document.prototype.__defineGetter__("fullscreen", curMemoryArea.fullscreen_smart_getter);

// onfullscreenchange
curMemoryArea.onfullscreenchange_getter = function onfullscreenchange() { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onfullscreenchange_getter, "name", { value: "get onfullscreenchange", configurable: true, });
// onfullscreenchange
curMemoryArea.onfullscreenchange_setter = function onfullscreenchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onfullscreenchange_setter, "name", { value: "set onfullscreenchange", configurable: true, });
Object.defineProperty(Document.prototype, "onfullscreenchange", { get: curMemoryArea.onfullscreenchange_getter, set: curMemoryArea.onfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenchange_smart_getter = function onfullscreenchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onfullscreenchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfullscreenchange_smart_getter);
Document.prototype.__defineGetter__("onfullscreenchange", curMemoryArea.onfullscreenchange_smart_getter);

// onfullscreenerror
curMemoryArea.onfullscreenerror_getter = function onfullscreenerror() { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onfullscreenerror_getter, "name", { value: "get onfullscreenerror", configurable: true, });
// onfullscreenerror
curMemoryArea.onfullscreenerror_setter = function onfullscreenerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onfullscreenerror_setter, "name", { value: "set onfullscreenerror", configurable: true, });
Object.defineProperty(Document.prototype, "onfullscreenerror", { get: curMemoryArea.onfullscreenerror_getter, set: curMemoryArea.onfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenerror_smart_getter = function onfullscreenerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onfullscreenerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfullscreenerror_smart_getter);
Document.prototype.__defineGetter__("onfullscreenerror", curMemoryArea.onfullscreenerror_smart_getter);

// webkitIsFullScreen
curMemoryArea.webkitIsFullScreen_getter = function webkitIsFullScreen() { debugger; }; mframe.safefunction(curMemoryArea.webkitIsFullScreen_getter);
Object.defineProperty(curMemoryArea.webkitIsFullScreen_getter, "name", { value: "get webkitIsFullScreen", configurable: true, });
Object.defineProperty(Document.prototype, "webkitIsFullScreen", { get: curMemoryArea.webkitIsFullScreen_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitIsFullScreen_smart_getter = function webkitIsFullScreen() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitIsFullScreen的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitIsFullScreen_smart_getter);
Document.prototype.__defineGetter__("webkitIsFullScreen", curMemoryArea.webkitIsFullScreen_smart_getter);

// webkitCurrentFullScreenElement
curMemoryArea.webkitCurrentFullScreenElement_getter = function webkitCurrentFullScreenElement() { debugger; }; mframe.safefunction(curMemoryArea.webkitCurrentFullScreenElement_getter);
Object.defineProperty(curMemoryArea.webkitCurrentFullScreenElement_getter, "name", { value: "get webkitCurrentFullScreenElement", configurable: true, });
Object.defineProperty(Document.prototype, "webkitCurrentFullScreenElement", { get: curMemoryArea.webkitCurrentFullScreenElement_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitCurrentFullScreenElement_smart_getter = function webkitCurrentFullScreenElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitCurrentFullScreenElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitCurrentFullScreenElement_smart_getter);
Document.prototype.__defineGetter__("webkitCurrentFullScreenElement", curMemoryArea.webkitCurrentFullScreenElement_smart_getter);

// webkitFullscreenEnabled
curMemoryArea.webkitFullscreenEnabled_getter = function webkitFullscreenEnabled() { debugger; }; mframe.safefunction(curMemoryArea.webkitFullscreenEnabled_getter);
Object.defineProperty(curMemoryArea.webkitFullscreenEnabled_getter, "name", { value: "get webkitFullscreenEnabled", configurable: true, });
Object.defineProperty(Document.prototype, "webkitFullscreenEnabled", { get: curMemoryArea.webkitFullscreenEnabled_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitFullscreenEnabled_smart_getter = function webkitFullscreenEnabled() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitFullscreenEnabled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitFullscreenEnabled_smart_getter);
Document.prototype.__defineGetter__("webkitFullscreenEnabled", curMemoryArea.webkitFullscreenEnabled_smart_getter);

// webkitFullscreenElement
curMemoryArea.webkitFullscreenElement_getter = function webkitFullscreenElement() { debugger; }; mframe.safefunction(curMemoryArea.webkitFullscreenElement_getter);
Object.defineProperty(curMemoryArea.webkitFullscreenElement_getter, "name", { value: "get webkitFullscreenElement", configurable: true, });
Object.defineProperty(Document.prototype, "webkitFullscreenElement", { get: curMemoryArea.webkitFullscreenElement_getter, enumerable: true, configurable: true, });
curMemoryArea.webkitFullscreenElement_smart_getter = function webkitFullscreenElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的webkitFullscreenElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.webkitFullscreenElement_smart_getter);
Document.prototype.__defineGetter__("webkitFullscreenElement", curMemoryArea.webkitFullscreenElement_smart_getter);

// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_getter = function onwebkitfullscreenchange() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_getter, "name", { value: "get onwebkitfullscreenchange", configurable: true, });
// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_setter = function onwebkitfullscreenchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_setter, "name", { value: "set onwebkitfullscreenchange", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitfullscreenchange", { get: curMemoryArea.onwebkitfullscreenchange_getter, set: curMemoryArea.onwebkitfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenchange_smart_getter = function onwebkitfullscreenchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitfullscreenchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_smart_getter);
Document.prototype.__defineGetter__("onwebkitfullscreenchange", curMemoryArea.onwebkitfullscreenchange_smart_getter);

// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_getter = function onwebkitfullscreenerror() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_getter, "name", { value: "get onwebkitfullscreenerror", configurable: true, });
// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_setter = function onwebkitfullscreenerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_setter, "name", { value: "set onwebkitfullscreenerror", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitfullscreenerror", { get: curMemoryArea.onwebkitfullscreenerror_getter, set: curMemoryArea.onwebkitfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenerror_smart_getter = function onwebkitfullscreenerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitfullscreenerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_smart_getter);
Document.prototype.__defineGetter__("onwebkitfullscreenerror", curMemoryArea.onwebkitfullscreenerror_smart_getter);

// rootElement
curMemoryArea.rootElement_getter = function rootElement() { debugger; }; mframe.safefunction(curMemoryArea.rootElement_getter);
Object.defineProperty(curMemoryArea.rootElement_getter, "name", { value: "get rootElement", configurable: true, });
Object.defineProperty(Document.prototype, "rootElement", { get: curMemoryArea.rootElement_getter, enumerable: true, configurable: true, });
curMemoryArea.rootElement_smart_getter = function rootElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的rootElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.rootElement_smart_getter);
Document.prototype.__defineGetter__("rootElement", curMemoryArea.rootElement_smart_getter);

// pictureInPictureEnabled
curMemoryArea.pictureInPictureEnabled_getter = function pictureInPictureEnabled() { debugger; }; mframe.safefunction(curMemoryArea.pictureInPictureEnabled_getter);
Object.defineProperty(curMemoryArea.pictureInPictureEnabled_getter, "name", { value: "get pictureInPictureEnabled", configurable: true, });
Object.defineProperty(Document.prototype, "pictureInPictureEnabled", { get: curMemoryArea.pictureInPictureEnabled_getter, enumerable: true, configurable: true, });
curMemoryArea.pictureInPictureEnabled_smart_getter = function pictureInPictureEnabled() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的pictureInPictureEnabled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.pictureInPictureEnabled_smart_getter);
Document.prototype.__defineGetter__("pictureInPictureEnabled", curMemoryArea.pictureInPictureEnabled_smart_getter);

// onbeforexrselect
curMemoryArea.onbeforexrselect_getter = function onbeforexrselect() { debugger; }; mframe.safefunction(curMemoryArea.onbeforexrselect_getter);
Object.defineProperty(curMemoryArea.onbeforexrselect_getter, "name", { value: "get onbeforexrselect", configurable: true, });
// onbeforexrselect
curMemoryArea.onbeforexrselect_setter = function onbeforexrselect(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforexrselect_setter);
Object.defineProperty(curMemoryArea.onbeforexrselect_setter, "name", { value: "set onbeforexrselect", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforexrselect", { get: curMemoryArea.onbeforexrselect_getter, set: curMemoryArea.onbeforexrselect_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforexrselect_smart_getter = function onbeforexrselect() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforexrselect的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforexrselect_smart_getter);
Document.prototype.__defineGetter__("onbeforexrselect", curMemoryArea.onbeforexrselect_smart_getter);

// onabort
curMemoryArea.onabort_getter = function onabort() { debugger; }; mframe.safefunction(curMemoryArea.onabort_getter);
Object.defineProperty(curMemoryArea.onabort_getter, "name", { value: "get onabort", configurable: true, });
// onabort
curMemoryArea.onabort_setter = function onabort(val) { debugger; }; mframe.safefunction(curMemoryArea.onabort_setter);
Object.defineProperty(curMemoryArea.onabort_setter, "name", { value: "set onabort", configurable: true, });
Object.defineProperty(Document.prototype, "onabort", { get: curMemoryArea.onabort_getter, set: curMemoryArea.onabort_setter, enumerable: true, configurable: true, });
curMemoryArea.onabort_smart_getter = function onabort() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onabort的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onabort_smart_getter);
Document.prototype.__defineGetter__("onabort", curMemoryArea.onabort_smart_getter);

// onbeforeinput
curMemoryArea.onbeforeinput_getter = function onbeforeinput() { debugger; }; mframe.safefunction(curMemoryArea.onbeforeinput_getter);
Object.defineProperty(curMemoryArea.onbeforeinput_getter, "name", { value: "get onbeforeinput", configurable: true, });
// onbeforeinput
curMemoryArea.onbeforeinput_setter = function onbeforeinput(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforeinput_setter);
Object.defineProperty(curMemoryArea.onbeforeinput_setter, "name", { value: "set onbeforeinput", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforeinput", { get: curMemoryArea.onbeforeinput_getter, set: curMemoryArea.onbeforeinput_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforeinput_smart_getter = function onbeforeinput() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforeinput的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforeinput_smart_getter);
Document.prototype.__defineGetter__("onbeforeinput", curMemoryArea.onbeforeinput_smart_getter);

// onbeforematch
curMemoryArea.onbeforematch_getter = function onbeforematch() { debugger; }; mframe.safefunction(curMemoryArea.onbeforematch_getter);
Object.defineProperty(curMemoryArea.onbeforematch_getter, "name", { value: "get onbeforematch", configurable: true, });
// onbeforematch
curMemoryArea.onbeforematch_setter = function onbeforematch(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforematch_setter);
Object.defineProperty(curMemoryArea.onbeforematch_setter, "name", { value: "set onbeforematch", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforematch", { get: curMemoryArea.onbeforematch_getter, set: curMemoryArea.onbeforematch_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforematch_smart_getter = function onbeforematch() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforematch的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforematch_smart_getter);
Document.prototype.__defineGetter__("onbeforematch", curMemoryArea.onbeforematch_smart_getter);

// onbeforetoggle
curMemoryArea.onbeforetoggle_getter = function onbeforetoggle() { debugger; }; mframe.safefunction(curMemoryArea.onbeforetoggle_getter);
Object.defineProperty(curMemoryArea.onbeforetoggle_getter, "name", { value: "get onbeforetoggle", configurable: true, });
// onbeforetoggle
curMemoryArea.onbeforetoggle_setter = function onbeforetoggle(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforetoggle_setter);
Object.defineProperty(curMemoryArea.onbeforetoggle_setter, "name", { value: "set onbeforetoggle", configurable: true, });
Object.defineProperty(Document.prototype, "onbeforetoggle", { get: curMemoryArea.onbeforetoggle_getter, set: curMemoryArea.onbeforetoggle_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforetoggle_smart_getter = function onbeforetoggle() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onbeforetoggle的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforetoggle_smart_getter);
Document.prototype.__defineGetter__("onbeforetoggle", curMemoryArea.onbeforetoggle_smart_getter);

// onblur
curMemoryArea.onblur_getter = function onblur() { debugger; }; mframe.safefunction(curMemoryArea.onblur_getter);
Object.defineProperty(curMemoryArea.onblur_getter, "name", { value: "get onblur", configurable: true, });
// onblur
curMemoryArea.onblur_setter = function onblur(val) { debugger; }; mframe.safefunction(curMemoryArea.onblur_setter);
Object.defineProperty(curMemoryArea.onblur_setter, "name", { value: "set onblur", configurable: true, });
Object.defineProperty(Document.prototype, "onblur", { get: curMemoryArea.onblur_getter, set: curMemoryArea.onblur_setter, enumerable: true, configurable: true, });
curMemoryArea.onblur_smart_getter = function onblur() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onblur的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onblur_smart_getter);
Document.prototype.__defineGetter__("onblur", curMemoryArea.onblur_smart_getter);

// oncancel
curMemoryArea.oncancel_getter = function oncancel() { debugger; }; mframe.safefunction(curMemoryArea.oncancel_getter);
Object.defineProperty(curMemoryArea.oncancel_getter, "name", { value: "get oncancel", configurable: true, });
// oncancel
curMemoryArea.oncancel_setter = function oncancel(val) { debugger; }; mframe.safefunction(curMemoryArea.oncancel_setter);
Object.defineProperty(curMemoryArea.oncancel_setter, "name", { value: "set oncancel", configurable: true, });
Object.defineProperty(Document.prototype, "oncancel", { get: curMemoryArea.oncancel_getter, set: curMemoryArea.oncancel_setter, enumerable: true, configurable: true, });
curMemoryArea.oncancel_smart_getter = function oncancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncancel_smart_getter);
Document.prototype.__defineGetter__("oncancel", curMemoryArea.oncancel_smart_getter);

// oncanplay
curMemoryArea.oncanplay_getter = function oncanplay() { debugger; }; mframe.safefunction(curMemoryArea.oncanplay_getter);
Object.defineProperty(curMemoryArea.oncanplay_getter, "name", { value: "get oncanplay", configurable: true, });
// oncanplay
curMemoryArea.oncanplay_setter = function oncanplay(val) { debugger; }; mframe.safefunction(curMemoryArea.oncanplay_setter);
Object.defineProperty(curMemoryArea.oncanplay_setter, "name", { value: "set oncanplay", configurable: true, });
Object.defineProperty(Document.prototype, "oncanplay", { get: curMemoryArea.oncanplay_getter, set: curMemoryArea.oncanplay_setter, enumerable: true, configurable: true, });
curMemoryArea.oncanplay_smart_getter = function oncanplay() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncanplay的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncanplay_smart_getter);
Document.prototype.__defineGetter__("oncanplay", curMemoryArea.oncanplay_smart_getter);

// oncanplaythrough
curMemoryArea.oncanplaythrough_getter = function oncanplaythrough() { debugger; }; mframe.safefunction(curMemoryArea.oncanplaythrough_getter);
Object.defineProperty(curMemoryArea.oncanplaythrough_getter, "name", { value: "get oncanplaythrough", configurable: true, });
// oncanplaythrough
curMemoryArea.oncanplaythrough_setter = function oncanplaythrough(val) { debugger; }; mframe.safefunction(curMemoryArea.oncanplaythrough_setter);
Object.defineProperty(curMemoryArea.oncanplaythrough_setter, "name", { value: "set oncanplaythrough", configurable: true, });
Object.defineProperty(Document.prototype, "oncanplaythrough", { get: curMemoryArea.oncanplaythrough_getter, set: curMemoryArea.oncanplaythrough_setter, enumerable: true, configurable: true, });
curMemoryArea.oncanplaythrough_smart_getter = function oncanplaythrough() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncanplaythrough的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncanplaythrough_smart_getter);
Document.prototype.__defineGetter__("oncanplaythrough", curMemoryArea.oncanplaythrough_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { debugger; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", { value: "get onchange", configurable: true, });
// onchange
curMemoryArea.onchange_setter = function onchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", { value: "set onchange", configurable: true, });
Object.defineProperty(Document.prototype, "onchange", { get: curMemoryArea.onchange_getter, set: curMemoryArea.onchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onchange_smart_getter = function onchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
Document.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// onclick
curMemoryArea.onclick_getter = function onclick() { debugger; }; mframe.safefunction(curMemoryArea.onclick_getter);
Object.defineProperty(curMemoryArea.onclick_getter, "name", { value: "get onclick", configurable: true, });
// onclick
curMemoryArea.onclick_setter = function onclick(val) { debugger; }; mframe.safefunction(curMemoryArea.onclick_setter);
Object.defineProperty(curMemoryArea.onclick_setter, "name", { value: "set onclick", configurable: true, });
Object.defineProperty(Document.prototype, "onclick", { get: curMemoryArea.onclick_getter, set: curMemoryArea.onclick_setter, enumerable: true, configurable: true, });
curMemoryArea.onclick_smart_getter = function onclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onclick_smart_getter);
Document.prototype.__defineGetter__("onclick", curMemoryArea.onclick_smart_getter);

// onclose
curMemoryArea.onclose_getter = function onclose() { debugger; }; mframe.safefunction(curMemoryArea.onclose_getter);
Object.defineProperty(curMemoryArea.onclose_getter, "name", { value: "get onclose", configurable: true, });
// onclose
curMemoryArea.onclose_setter = function onclose(val) { debugger; }; mframe.safefunction(curMemoryArea.onclose_setter);
Object.defineProperty(curMemoryArea.onclose_setter, "name", { value: "set onclose", configurable: true, });
Object.defineProperty(Document.prototype, "onclose", { get: curMemoryArea.onclose_getter, set: curMemoryArea.onclose_setter, enumerable: true, configurable: true, });
curMemoryArea.onclose_smart_getter = function onclose() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onclose的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onclose_smart_getter);
Document.prototype.__defineGetter__("onclose", curMemoryArea.onclose_smart_getter);

// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_getter = function oncontentvisibilityautostatechange() { debugger; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_getter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_getter, "name", { value: "get oncontentvisibilityautostatechange", configurable: true, });
// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_setter = function oncontentvisibilityautostatechange(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_setter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_setter, "name", { value: "set oncontentvisibilityautostatechange", configurable: true, });
Object.defineProperty(Document.prototype, "oncontentvisibilityautostatechange", { get: curMemoryArea.oncontentvisibilityautostatechange_getter, set: curMemoryArea.oncontentvisibilityautostatechange_setter, enumerable: true, configurable: true, });
curMemoryArea.oncontentvisibilityautostatechange_smart_getter = function oncontentvisibilityautostatechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncontentvisibilityautostatechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_smart_getter);
Document.prototype.__defineGetter__("oncontentvisibilityautostatechange", curMemoryArea.oncontentvisibilityautostatechange_smart_getter);

// oncontextlost
curMemoryArea.oncontextlost_getter = function oncontextlost() { debugger; }; mframe.safefunction(curMemoryArea.oncontextlost_getter);
Object.defineProperty(curMemoryArea.oncontextlost_getter, "name", { value: "get oncontextlost", configurable: true, });
// oncontextlost
curMemoryArea.oncontextlost_setter = function oncontextlost(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextlost_setter);
Object.defineProperty(curMemoryArea.oncontextlost_setter, "name", { value: "set oncontextlost", configurable: true, });
Object.defineProperty(Document.prototype, "oncontextlost", { get: curMemoryArea.oncontextlost_getter, set: curMemoryArea.oncontextlost_setter, enumerable: true, configurable: true, });
curMemoryArea.oncontextlost_smart_getter = function oncontextlost() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncontextlost的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncontextlost_smart_getter);
Document.prototype.__defineGetter__("oncontextlost", curMemoryArea.oncontextlost_smart_getter);

// oncontextmenu
curMemoryArea.oncontextmenu_getter = function oncontextmenu() { debugger; }; mframe.safefunction(curMemoryArea.oncontextmenu_getter);
Object.defineProperty(curMemoryArea.oncontextmenu_getter, "name", { value: "get oncontextmenu", configurable: true, });
// oncontextmenu
curMemoryArea.oncontextmenu_setter = function oncontextmenu(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextmenu_setter);
Object.defineProperty(curMemoryArea.oncontextmenu_setter, "name", { value: "set oncontextmenu", configurable: true, });
Object.defineProperty(Document.prototype, "oncontextmenu", { get: curMemoryArea.oncontextmenu_getter, set: curMemoryArea.oncontextmenu_setter, enumerable: true, configurable: true, });
curMemoryArea.oncontextmenu_smart_getter = function oncontextmenu() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncontextmenu的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncontextmenu_smart_getter);
Document.prototype.__defineGetter__("oncontextmenu", curMemoryArea.oncontextmenu_smart_getter);

// oncontextrestored
curMemoryArea.oncontextrestored_getter = function oncontextrestored() { debugger; }; mframe.safefunction(curMemoryArea.oncontextrestored_getter);
Object.defineProperty(curMemoryArea.oncontextrestored_getter, "name", { value: "get oncontextrestored", configurable: true, });
// oncontextrestored
curMemoryArea.oncontextrestored_setter = function oncontextrestored(val) { debugger; }; mframe.safefunction(curMemoryArea.oncontextrestored_setter);
Object.defineProperty(curMemoryArea.oncontextrestored_setter, "name", { value: "set oncontextrestored", configurable: true, });
Object.defineProperty(Document.prototype, "oncontextrestored", { get: curMemoryArea.oncontextrestored_getter, set: curMemoryArea.oncontextrestored_setter, enumerable: true, configurable: true, });
curMemoryArea.oncontextrestored_smart_getter = function oncontextrestored() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncontextrestored的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncontextrestored_smart_getter);
Document.prototype.__defineGetter__("oncontextrestored", curMemoryArea.oncontextrestored_smart_getter);

// oncuechange
curMemoryArea.oncuechange_getter = function oncuechange() { debugger; }; mframe.safefunction(curMemoryArea.oncuechange_getter);
Object.defineProperty(curMemoryArea.oncuechange_getter, "name", { value: "get oncuechange", configurable: true, });
// oncuechange
curMemoryArea.oncuechange_setter = function oncuechange(val) { debugger; }; mframe.safefunction(curMemoryArea.oncuechange_setter);
Object.defineProperty(curMemoryArea.oncuechange_setter, "name", { value: "set oncuechange", configurable: true, });
Object.defineProperty(Document.prototype, "oncuechange", { get: curMemoryArea.oncuechange_getter, set: curMemoryArea.oncuechange_setter, enumerable: true, configurable: true, });
curMemoryArea.oncuechange_smart_getter = function oncuechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncuechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncuechange_smart_getter);
Document.prototype.__defineGetter__("oncuechange", curMemoryArea.oncuechange_smart_getter);

// ondblclick
curMemoryArea.ondblclick_getter = function ondblclick() { debugger; }; mframe.safefunction(curMemoryArea.ondblclick_getter);
Object.defineProperty(curMemoryArea.ondblclick_getter, "name", { value: "get ondblclick", configurable: true, });
// ondblclick
curMemoryArea.ondblclick_setter = function ondblclick(val) { debugger; }; mframe.safefunction(curMemoryArea.ondblclick_setter);
Object.defineProperty(curMemoryArea.ondblclick_setter, "name", { value: "set ondblclick", configurable: true, });
Object.defineProperty(Document.prototype, "ondblclick", { get: curMemoryArea.ondblclick_getter, set: curMemoryArea.ondblclick_setter, enumerable: true, configurable: true, });
curMemoryArea.ondblclick_smart_getter = function ondblclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondblclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondblclick_smart_getter);
Document.prototype.__defineGetter__("ondblclick", curMemoryArea.ondblclick_smart_getter);

// ondrag
curMemoryArea.ondrag_getter = function ondrag() { debugger; }; mframe.safefunction(curMemoryArea.ondrag_getter);
Object.defineProperty(curMemoryArea.ondrag_getter, "name", { value: "get ondrag", configurable: true, });
// ondrag
curMemoryArea.ondrag_setter = function ondrag(val) { debugger; }; mframe.safefunction(curMemoryArea.ondrag_setter);
Object.defineProperty(curMemoryArea.ondrag_setter, "name", { value: "set ondrag", configurable: true, });
Object.defineProperty(Document.prototype, "ondrag", { get: curMemoryArea.ondrag_getter, set: curMemoryArea.ondrag_setter, enumerable: true, configurable: true, });
curMemoryArea.ondrag_smart_getter = function ondrag() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondrag的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondrag_smart_getter);
Document.prototype.__defineGetter__("ondrag", curMemoryArea.ondrag_smart_getter);

// ondragend
curMemoryArea.ondragend_getter = function ondragend() { debugger; }; mframe.safefunction(curMemoryArea.ondragend_getter);
Object.defineProperty(curMemoryArea.ondragend_getter, "name", { value: "get ondragend", configurable: true, });
// ondragend
curMemoryArea.ondragend_setter = function ondragend(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragend_setter);
Object.defineProperty(curMemoryArea.ondragend_setter, "name", { value: "set ondragend", configurable: true, });
Object.defineProperty(Document.prototype, "ondragend", { get: curMemoryArea.ondragend_getter, set: curMemoryArea.ondragend_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragend_smart_getter = function ondragend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragend_smart_getter);
Document.prototype.__defineGetter__("ondragend", curMemoryArea.ondragend_smart_getter);

// ondragenter
curMemoryArea.ondragenter_getter = function ondragenter() { debugger; }; mframe.safefunction(curMemoryArea.ondragenter_getter);
Object.defineProperty(curMemoryArea.ondragenter_getter, "name", { value: "get ondragenter", configurable: true, });
// ondragenter
curMemoryArea.ondragenter_setter = function ondragenter(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragenter_setter);
Object.defineProperty(curMemoryArea.ondragenter_setter, "name", { value: "set ondragenter", configurable: true, });
Object.defineProperty(Document.prototype, "ondragenter", { get: curMemoryArea.ondragenter_getter, set: curMemoryArea.ondragenter_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragenter_smart_getter = function ondragenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragenter_smart_getter);
Document.prototype.__defineGetter__("ondragenter", curMemoryArea.ondragenter_smart_getter);

// ondragleave
curMemoryArea.ondragleave_getter = function ondragleave() { debugger; }; mframe.safefunction(curMemoryArea.ondragleave_getter);
Object.defineProperty(curMemoryArea.ondragleave_getter, "name", { value: "get ondragleave", configurable: true, });
// ondragleave
curMemoryArea.ondragleave_setter = function ondragleave(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragleave_setter);
Object.defineProperty(curMemoryArea.ondragleave_setter, "name", { value: "set ondragleave", configurable: true, });
Object.defineProperty(Document.prototype, "ondragleave", { get: curMemoryArea.ondragleave_getter, set: curMemoryArea.ondragleave_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragleave_smart_getter = function ondragleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragleave_smart_getter);
Document.prototype.__defineGetter__("ondragleave", curMemoryArea.ondragleave_smart_getter);

// ondragover
curMemoryArea.ondragover_getter = function ondragover() { debugger; }; mframe.safefunction(curMemoryArea.ondragover_getter);
Object.defineProperty(curMemoryArea.ondragover_getter, "name", { value: "get ondragover", configurable: true, });
// ondragover
curMemoryArea.ondragover_setter = function ondragover(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragover_setter);
Object.defineProperty(curMemoryArea.ondragover_setter, "name", { value: "set ondragover", configurable: true, });
Object.defineProperty(Document.prototype, "ondragover", { get: curMemoryArea.ondragover_getter, set: curMemoryArea.ondragover_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragover_smart_getter = function ondragover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragover_smart_getter);
Document.prototype.__defineGetter__("ondragover", curMemoryArea.ondragover_smart_getter);

// ondragstart
curMemoryArea.ondragstart_getter = function ondragstart() { debugger; }; mframe.safefunction(curMemoryArea.ondragstart_getter);
Object.defineProperty(curMemoryArea.ondragstart_getter, "name", { value: "get ondragstart", configurable: true, });
// ondragstart
curMemoryArea.ondragstart_setter = function ondragstart(val) { debugger; }; mframe.safefunction(curMemoryArea.ondragstart_setter);
Object.defineProperty(curMemoryArea.ondragstart_setter, "name", { value: "set ondragstart", configurable: true, });
Object.defineProperty(Document.prototype, "ondragstart", { get: curMemoryArea.ondragstart_getter, set: curMemoryArea.ondragstart_setter, enumerable: true, configurable: true, });
curMemoryArea.ondragstart_smart_getter = function ondragstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondragstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondragstart_smart_getter);
Document.prototype.__defineGetter__("ondragstart", curMemoryArea.ondragstart_smart_getter);

// ondrop
curMemoryArea.ondrop_getter = function ondrop() { debugger; }; mframe.safefunction(curMemoryArea.ondrop_getter);
Object.defineProperty(curMemoryArea.ondrop_getter, "name", { value: "get ondrop", configurable: true, });
// ondrop
curMemoryArea.ondrop_setter = function ondrop(val) { debugger; }; mframe.safefunction(curMemoryArea.ondrop_setter);
Object.defineProperty(curMemoryArea.ondrop_setter, "name", { value: "set ondrop", configurable: true, });
Object.defineProperty(Document.prototype, "ondrop", { get: curMemoryArea.ondrop_getter, set: curMemoryArea.ondrop_setter, enumerable: true, configurable: true, });
curMemoryArea.ondrop_smart_getter = function ondrop() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondrop的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondrop_smart_getter);
Document.prototype.__defineGetter__("ondrop", curMemoryArea.ondrop_smart_getter);

// ondurationchange
curMemoryArea.ondurationchange_getter = function ondurationchange() { debugger; }; mframe.safefunction(curMemoryArea.ondurationchange_getter);
Object.defineProperty(curMemoryArea.ondurationchange_getter, "name", { value: "get ondurationchange", configurable: true, });
// ondurationchange
curMemoryArea.ondurationchange_setter = function ondurationchange(val) { debugger; }; mframe.safefunction(curMemoryArea.ondurationchange_setter);
Object.defineProperty(curMemoryArea.ondurationchange_setter, "name", { value: "set ondurationchange", configurable: true, });
Object.defineProperty(Document.prototype, "ondurationchange", { get: curMemoryArea.ondurationchange_getter, set: curMemoryArea.ondurationchange_setter, enumerable: true, configurable: true, });
curMemoryArea.ondurationchange_smart_getter = function ondurationchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ondurationchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ondurationchange_smart_getter);
Document.prototype.__defineGetter__("ondurationchange", curMemoryArea.ondurationchange_smart_getter);

// onemptied
curMemoryArea.onemptied_getter = function onemptied() { debugger; }; mframe.safefunction(curMemoryArea.onemptied_getter);
Object.defineProperty(curMemoryArea.onemptied_getter, "name", { value: "get onemptied", configurable: true, });
// onemptied
curMemoryArea.onemptied_setter = function onemptied(val) { debugger; }; mframe.safefunction(curMemoryArea.onemptied_setter);
Object.defineProperty(curMemoryArea.onemptied_setter, "name", { value: "set onemptied", configurable: true, });
Object.defineProperty(Document.prototype, "onemptied", { get: curMemoryArea.onemptied_getter, set: curMemoryArea.onemptied_setter, enumerable: true, configurable: true, });
curMemoryArea.onemptied_smart_getter = function onemptied() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onemptied的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onemptied_smart_getter);
Document.prototype.__defineGetter__("onemptied", curMemoryArea.onemptied_smart_getter);

// onended
curMemoryArea.onended_getter = function onended() { debugger; }; mframe.safefunction(curMemoryArea.onended_getter);
Object.defineProperty(curMemoryArea.onended_getter, "name", { value: "get onended", configurable: true, });
// onended
curMemoryArea.onended_setter = function onended(val) { debugger; }; mframe.safefunction(curMemoryArea.onended_setter);
Object.defineProperty(curMemoryArea.onended_setter, "name", { value: "set onended", configurable: true, });
Object.defineProperty(Document.prototype, "onended", { get: curMemoryArea.onended_getter, set: curMemoryArea.onended_setter, enumerable: true, configurable: true, });
curMemoryArea.onended_smart_getter = function onended() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onended的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onended_smart_getter);
Document.prototype.__defineGetter__("onended", curMemoryArea.onended_smart_getter);

// onerror
curMemoryArea.onerror_getter = function onerror() { debugger; }; mframe.safefunction(curMemoryArea.onerror_getter);
Object.defineProperty(curMemoryArea.onerror_getter, "name", { value: "get onerror", configurable: true, });
// onerror
curMemoryArea.onerror_setter = function onerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onerror_setter);
Object.defineProperty(curMemoryArea.onerror_setter, "name", { value: "set onerror", configurable: true, });
Object.defineProperty(Document.prototype, "onerror", { get: curMemoryArea.onerror_getter, set: curMemoryArea.onerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onerror_smart_getter = function onerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onerror_smart_getter);
Document.prototype.__defineGetter__("onerror", curMemoryArea.onerror_smart_getter);

// onfocus
curMemoryArea.onfocus_getter = function onfocus() { debugger; }; mframe.safefunction(curMemoryArea.onfocus_getter);
Object.defineProperty(curMemoryArea.onfocus_getter, "name", { value: "get onfocus", configurable: true, });
// onfocus
curMemoryArea.onfocus_setter = function onfocus(val) { debugger; }; mframe.safefunction(curMemoryArea.onfocus_setter);
Object.defineProperty(curMemoryArea.onfocus_setter, "name", { value: "set onfocus", configurable: true, });
Object.defineProperty(Document.prototype, "onfocus", { get: curMemoryArea.onfocus_getter, set: curMemoryArea.onfocus_setter, enumerable: true, configurable: true, });
curMemoryArea.onfocus_smart_getter = function onfocus() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onfocus的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfocus_smart_getter);
Document.prototype.__defineGetter__("onfocus", curMemoryArea.onfocus_smart_getter);

// onformdata
curMemoryArea.onformdata_getter = function onformdata() { debugger; }; mframe.safefunction(curMemoryArea.onformdata_getter);
Object.defineProperty(curMemoryArea.onformdata_getter, "name", { value: "get onformdata", configurable: true, });
// onformdata
curMemoryArea.onformdata_setter = function onformdata(val) { debugger; }; mframe.safefunction(curMemoryArea.onformdata_setter);
Object.defineProperty(curMemoryArea.onformdata_setter, "name", { value: "set onformdata", configurable: true, });
Object.defineProperty(Document.prototype, "onformdata", { get: curMemoryArea.onformdata_getter, set: curMemoryArea.onformdata_setter, enumerable: true, configurable: true, });
curMemoryArea.onformdata_smart_getter = function onformdata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onformdata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onformdata_smart_getter);
Document.prototype.__defineGetter__("onformdata", curMemoryArea.onformdata_smart_getter);

// oninput
curMemoryArea.oninput_getter = function oninput() { debugger; }; mframe.safefunction(curMemoryArea.oninput_getter);
Object.defineProperty(curMemoryArea.oninput_getter, "name", { value: "get oninput", configurable: true, });
// oninput
curMemoryArea.oninput_setter = function oninput(val) { debugger; }; mframe.safefunction(curMemoryArea.oninput_setter);
Object.defineProperty(curMemoryArea.oninput_setter, "name", { value: "set oninput", configurable: true, });
Object.defineProperty(Document.prototype, "oninput", { get: curMemoryArea.oninput_getter, set: curMemoryArea.oninput_setter, enumerable: true, configurable: true, });
curMemoryArea.oninput_smart_getter = function oninput() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oninput的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oninput_smart_getter);
Document.prototype.__defineGetter__("oninput", curMemoryArea.oninput_smart_getter);

// oninvalid
curMemoryArea.oninvalid_getter = function oninvalid() { debugger; }; mframe.safefunction(curMemoryArea.oninvalid_getter);
Object.defineProperty(curMemoryArea.oninvalid_getter, "name", { value: "get oninvalid", configurable: true, });
// oninvalid
curMemoryArea.oninvalid_setter = function oninvalid(val) { debugger; }; mframe.safefunction(curMemoryArea.oninvalid_setter);
Object.defineProperty(curMemoryArea.oninvalid_setter, "name", { value: "set oninvalid", configurable: true, });
Object.defineProperty(Document.prototype, "oninvalid", { get: curMemoryArea.oninvalid_getter, set: curMemoryArea.oninvalid_setter, enumerable: true, configurable: true, });
curMemoryArea.oninvalid_smart_getter = function oninvalid() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oninvalid的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oninvalid_smart_getter);
Document.prototype.__defineGetter__("oninvalid", curMemoryArea.oninvalid_smart_getter);

// onkeydown
curMemoryArea.onkeydown_getter = function onkeydown() { debugger; }; mframe.safefunction(curMemoryArea.onkeydown_getter);
Object.defineProperty(curMemoryArea.onkeydown_getter, "name", { value: "get onkeydown", configurable: true, });
// onkeydown
curMemoryArea.onkeydown_setter = function onkeydown(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeydown_setter);
Object.defineProperty(curMemoryArea.onkeydown_setter, "name", { value: "set onkeydown", configurable: true, });
Object.defineProperty(Document.prototype, "onkeydown", { get: curMemoryArea.onkeydown_getter, set: curMemoryArea.onkeydown_setter, enumerable: true, configurable: true, });
curMemoryArea.onkeydown_smart_getter = function onkeydown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onkeydown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onkeydown_smart_getter);
Document.prototype.__defineGetter__("onkeydown", curMemoryArea.onkeydown_smart_getter);

// onkeypress
curMemoryArea.onkeypress_getter = function onkeypress() { debugger; }; mframe.safefunction(curMemoryArea.onkeypress_getter);
Object.defineProperty(curMemoryArea.onkeypress_getter, "name", { value: "get onkeypress", configurable: true, });
// onkeypress
curMemoryArea.onkeypress_setter = function onkeypress(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeypress_setter);
Object.defineProperty(curMemoryArea.onkeypress_setter, "name", { value: "set onkeypress", configurable: true, });
Object.defineProperty(Document.prototype, "onkeypress", { get: curMemoryArea.onkeypress_getter, set: curMemoryArea.onkeypress_setter, enumerable: true, configurable: true, });
curMemoryArea.onkeypress_smart_getter = function onkeypress() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onkeypress的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onkeypress_smart_getter);
Document.prototype.__defineGetter__("onkeypress", curMemoryArea.onkeypress_smart_getter);

// onkeyup
curMemoryArea.onkeyup_getter = function onkeyup() { debugger; }; mframe.safefunction(curMemoryArea.onkeyup_getter);
Object.defineProperty(curMemoryArea.onkeyup_getter, "name", { value: "get onkeyup", configurable: true, });
// onkeyup
curMemoryArea.onkeyup_setter = function onkeyup(val) { debugger; }; mframe.safefunction(curMemoryArea.onkeyup_setter);
Object.defineProperty(curMemoryArea.onkeyup_setter, "name", { value: "set onkeyup", configurable: true, });
Object.defineProperty(Document.prototype, "onkeyup", { get: curMemoryArea.onkeyup_getter, set: curMemoryArea.onkeyup_setter, enumerable: true, configurable: true, });
curMemoryArea.onkeyup_smart_getter = function onkeyup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onkeyup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onkeyup_smart_getter);
Document.prototype.__defineGetter__("onkeyup", curMemoryArea.onkeyup_smart_getter);

// onload
curMemoryArea.onload_getter = function onload() { debugger; }; mframe.safefunction(curMemoryArea.onload_getter);
Object.defineProperty(curMemoryArea.onload_getter, "name", { value: "get onload", configurable: true, });
// onload
curMemoryArea.onload_setter = function onload(val) { debugger; }; mframe.safefunction(curMemoryArea.onload_setter);
Object.defineProperty(curMemoryArea.onload_setter, "name", { value: "set onload", configurable: true, });
Object.defineProperty(Document.prototype, "onload", { get: curMemoryArea.onload_getter, set: curMemoryArea.onload_setter, enumerable: true, configurable: true, });
curMemoryArea.onload_smart_getter = function onload() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onload的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onload_smart_getter);
Document.prototype.__defineGetter__("onload", curMemoryArea.onload_smart_getter);

// onloadeddata
curMemoryArea.onloadeddata_getter = function onloadeddata() { debugger; }; mframe.safefunction(curMemoryArea.onloadeddata_getter);
Object.defineProperty(curMemoryArea.onloadeddata_getter, "name", { value: "get onloadeddata", configurable: true, });
// onloadeddata
curMemoryArea.onloadeddata_setter = function onloadeddata(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadeddata_setter);
Object.defineProperty(curMemoryArea.onloadeddata_setter, "name", { value: "set onloadeddata", configurable: true, });
Object.defineProperty(Document.prototype, "onloadeddata", { get: curMemoryArea.onloadeddata_getter, set: curMemoryArea.onloadeddata_setter, enumerable: true, configurable: true, });
curMemoryArea.onloadeddata_smart_getter = function onloadeddata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onloadeddata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onloadeddata_smart_getter);
Document.prototype.__defineGetter__("onloadeddata", curMemoryArea.onloadeddata_smart_getter);

// onloadedmetadata
curMemoryArea.onloadedmetadata_getter = function onloadedmetadata() { debugger; }; mframe.safefunction(curMemoryArea.onloadedmetadata_getter);
Object.defineProperty(curMemoryArea.onloadedmetadata_getter, "name", { value: "get onloadedmetadata", configurable: true, });
// onloadedmetadata
curMemoryArea.onloadedmetadata_setter = function onloadedmetadata(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadedmetadata_setter);
Object.defineProperty(curMemoryArea.onloadedmetadata_setter, "name", { value: "set onloadedmetadata", configurable: true, });
Object.defineProperty(Document.prototype, "onloadedmetadata", { get: curMemoryArea.onloadedmetadata_getter, set: curMemoryArea.onloadedmetadata_setter, enumerable: true, configurable: true, });
curMemoryArea.onloadedmetadata_smart_getter = function onloadedmetadata() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onloadedmetadata的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onloadedmetadata_smart_getter);
Document.prototype.__defineGetter__("onloadedmetadata", curMemoryArea.onloadedmetadata_smart_getter);

// onloadstart
curMemoryArea.onloadstart_getter = function onloadstart() { debugger; }; mframe.safefunction(curMemoryArea.onloadstart_getter);
Object.defineProperty(curMemoryArea.onloadstart_getter, "name", { value: "get onloadstart", configurable: true, });
// onloadstart
curMemoryArea.onloadstart_setter = function onloadstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onloadstart_setter);
Object.defineProperty(curMemoryArea.onloadstart_setter, "name", { value: "set onloadstart", configurable: true, });
Object.defineProperty(Document.prototype, "onloadstart", { get: curMemoryArea.onloadstart_getter, set: curMemoryArea.onloadstart_setter, enumerable: true, configurable: true, });
curMemoryArea.onloadstart_smart_getter = function onloadstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onloadstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onloadstart_smart_getter);
Document.prototype.__defineGetter__("onloadstart", curMemoryArea.onloadstart_smart_getter);

// onmousedown
curMemoryArea.onmousedown_getter = function onmousedown() { debugger; }; mframe.safefunction(curMemoryArea.onmousedown_getter);
Object.defineProperty(curMemoryArea.onmousedown_getter, "name", { value: "get onmousedown", configurable: true, });
// onmousedown
curMemoryArea.onmousedown_setter = function onmousedown(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousedown_setter);
Object.defineProperty(curMemoryArea.onmousedown_setter, "name", { value: "set onmousedown", configurable: true, });
Object.defineProperty(Document.prototype, "onmousedown", { get: curMemoryArea.onmousedown_getter, set: curMemoryArea.onmousedown_setter, enumerable: true, configurable: true, });
curMemoryArea.onmousedown_smart_getter = function onmousedown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmousedown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmousedown_smart_getter);
Document.prototype.__defineGetter__("onmousedown", curMemoryArea.onmousedown_smart_getter);

// onmouseenter
curMemoryArea.onmouseenter_getter = function onmouseenter() { debugger; }; mframe.safefunction(curMemoryArea.onmouseenter_getter);
Object.defineProperty(curMemoryArea.onmouseenter_getter, "name", { value: "get onmouseenter", configurable: true, });
// onmouseenter
curMemoryArea.onmouseenter_setter = function onmouseenter(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseenter_setter);
Object.defineProperty(curMemoryArea.onmouseenter_setter, "name", { value: "set onmouseenter", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseenter", { get: curMemoryArea.onmouseenter_getter, set: curMemoryArea.onmouseenter_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseenter_smart_getter = function onmouseenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseenter_smart_getter);
Document.prototype.__defineGetter__("onmouseenter", curMemoryArea.onmouseenter_smart_getter);

// onmouseleave
curMemoryArea.onmouseleave_getter = function onmouseleave() { debugger; }; mframe.safefunction(curMemoryArea.onmouseleave_getter);
Object.defineProperty(curMemoryArea.onmouseleave_getter, "name", { value: "get onmouseleave", configurable: true, });
// onmouseleave
curMemoryArea.onmouseleave_setter = function onmouseleave(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseleave_setter);
Object.defineProperty(curMemoryArea.onmouseleave_setter, "name", { value: "set onmouseleave", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseleave", { get: curMemoryArea.onmouseleave_getter, set: curMemoryArea.onmouseleave_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseleave_smart_getter = function onmouseleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseleave_smart_getter);
Document.prototype.__defineGetter__("onmouseleave", curMemoryArea.onmouseleave_smart_getter);

// onmousemove
curMemoryArea.onmousemove_getter = function onmousemove() { debugger; }; mframe.safefunction(curMemoryArea.onmousemove_getter);
Object.defineProperty(curMemoryArea.onmousemove_getter, "name", { value: "get onmousemove", configurable: true, });
// onmousemove
curMemoryArea.onmousemove_setter = function onmousemove(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousemove_setter);
Object.defineProperty(curMemoryArea.onmousemove_setter, "name", { value: "set onmousemove", configurable: true, });
Object.defineProperty(Document.prototype, "onmousemove", { get: curMemoryArea.onmousemove_getter, set: curMemoryArea.onmousemove_setter, enumerable: true, configurable: true, });
curMemoryArea.onmousemove_smart_getter = function onmousemove() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmousemove的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmousemove_smart_getter);
Document.prototype.__defineGetter__("onmousemove", curMemoryArea.onmousemove_smart_getter);

// onmouseout
curMemoryArea.onmouseout_getter = function onmouseout() { debugger; }; mframe.safefunction(curMemoryArea.onmouseout_getter);
Object.defineProperty(curMemoryArea.onmouseout_getter, "name", { value: "get onmouseout", configurable: true, });
// onmouseout
curMemoryArea.onmouseout_setter = function onmouseout(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseout_setter);
Object.defineProperty(curMemoryArea.onmouseout_setter, "name", { value: "set onmouseout", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseout", { get: curMemoryArea.onmouseout_getter, set: curMemoryArea.onmouseout_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseout_smart_getter = function onmouseout() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseout的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseout_smart_getter);
Document.prototype.__defineGetter__("onmouseout", curMemoryArea.onmouseout_smart_getter);

// onmouseover
curMemoryArea.onmouseover_getter = function onmouseover() { debugger; }; mframe.safefunction(curMemoryArea.onmouseover_getter);
Object.defineProperty(curMemoryArea.onmouseover_getter, "name", { value: "get onmouseover", configurable: true, });
// onmouseover
curMemoryArea.onmouseover_setter = function onmouseover(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseover_setter);
Object.defineProperty(curMemoryArea.onmouseover_setter, "name", { value: "set onmouseover", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseover", { get: curMemoryArea.onmouseover_getter, set: curMemoryArea.onmouseover_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseover_smart_getter = function onmouseover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseover_smart_getter);
Document.prototype.__defineGetter__("onmouseover", curMemoryArea.onmouseover_smart_getter);

// onmouseup
curMemoryArea.onmouseup_getter = function onmouseup() { debugger; }; mframe.safefunction(curMemoryArea.onmouseup_getter);
Object.defineProperty(curMemoryArea.onmouseup_getter, "name", { value: "get onmouseup", configurable: true, });
// onmouseup
curMemoryArea.onmouseup_setter = function onmouseup(val) { debugger; }; mframe.safefunction(curMemoryArea.onmouseup_setter);
Object.defineProperty(curMemoryArea.onmouseup_setter, "name", { value: "set onmouseup", configurable: true, });
Object.defineProperty(Document.prototype, "onmouseup", { get: curMemoryArea.onmouseup_getter, set: curMemoryArea.onmouseup_setter, enumerable: true, configurable: true, });
curMemoryArea.onmouseup_smart_getter = function onmouseup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmouseup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmouseup_smart_getter);
Document.prototype.__defineGetter__("onmouseup", curMemoryArea.onmouseup_smart_getter);

// onmousewheel
curMemoryArea.onmousewheel_getter = function onmousewheel() { debugger; }; mframe.safefunction(curMemoryArea.onmousewheel_getter);
Object.defineProperty(curMemoryArea.onmousewheel_getter, "name", { value: "get onmousewheel", configurable: true, });
// onmousewheel
curMemoryArea.onmousewheel_setter = function onmousewheel(val) { debugger; }; mframe.safefunction(curMemoryArea.onmousewheel_setter);
Object.defineProperty(curMemoryArea.onmousewheel_setter, "name", { value: "set onmousewheel", configurable: true, });
Object.defineProperty(Document.prototype, "onmousewheel", { get: curMemoryArea.onmousewheel_getter, set: curMemoryArea.onmousewheel_setter, enumerable: true, configurable: true, });
curMemoryArea.onmousewheel_smart_getter = function onmousewheel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onmousewheel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onmousewheel_smart_getter);
Document.prototype.__defineGetter__("onmousewheel", curMemoryArea.onmousewheel_smart_getter);

// onpause
curMemoryArea.onpause_getter = function onpause() { debugger; }; mframe.safefunction(curMemoryArea.onpause_getter);
Object.defineProperty(curMemoryArea.onpause_getter, "name", { value: "get onpause", configurable: true, });
// onpause
curMemoryArea.onpause_setter = function onpause(val) { debugger; }; mframe.safefunction(curMemoryArea.onpause_setter);
Object.defineProperty(curMemoryArea.onpause_setter, "name", { value: "set onpause", configurable: true, });
Object.defineProperty(Document.prototype, "onpause", { get: curMemoryArea.onpause_getter, set: curMemoryArea.onpause_setter, enumerable: true, configurable: true, });
curMemoryArea.onpause_smart_getter = function onpause() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpause的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpause_smart_getter);
Document.prototype.__defineGetter__("onpause", curMemoryArea.onpause_smart_getter);

// onplay
curMemoryArea.onplay_getter = function onplay() { debugger; }; mframe.safefunction(curMemoryArea.onplay_getter);
Object.defineProperty(curMemoryArea.onplay_getter, "name", { value: "get onplay", configurable: true, });
// onplay
curMemoryArea.onplay_setter = function onplay(val) { debugger; }; mframe.safefunction(curMemoryArea.onplay_setter);
Object.defineProperty(curMemoryArea.onplay_setter, "name", { value: "set onplay", configurable: true, });
Object.defineProperty(Document.prototype, "onplay", { get: curMemoryArea.onplay_getter, set: curMemoryArea.onplay_setter, enumerable: true, configurable: true, });
curMemoryArea.onplay_smart_getter = function onplay() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onplay的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onplay_smart_getter);
Document.prototype.__defineGetter__("onplay", curMemoryArea.onplay_smart_getter);

// onplaying
curMemoryArea.onplaying_getter = function onplaying() { debugger; }; mframe.safefunction(curMemoryArea.onplaying_getter);
Object.defineProperty(curMemoryArea.onplaying_getter, "name", { value: "get onplaying", configurable: true, });
// onplaying
curMemoryArea.onplaying_setter = function onplaying(val) { debugger; }; mframe.safefunction(curMemoryArea.onplaying_setter);
Object.defineProperty(curMemoryArea.onplaying_setter, "name", { value: "set onplaying", configurable: true, });
Object.defineProperty(Document.prototype, "onplaying", { get: curMemoryArea.onplaying_getter, set: curMemoryArea.onplaying_setter, enumerable: true, configurable: true, });
curMemoryArea.onplaying_smart_getter = function onplaying() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onplaying的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onplaying_smart_getter);
Document.prototype.__defineGetter__("onplaying", curMemoryArea.onplaying_smart_getter);

// onprogress
curMemoryArea.onprogress_getter = function onprogress() { debugger; }; mframe.safefunction(curMemoryArea.onprogress_getter);
Object.defineProperty(curMemoryArea.onprogress_getter, "name", { value: "get onprogress", configurable: true, });
// onprogress
curMemoryArea.onprogress_setter = function onprogress(val) { debugger; }; mframe.safefunction(curMemoryArea.onprogress_setter);
Object.defineProperty(curMemoryArea.onprogress_setter, "name", { value: "set onprogress", configurable: true, });
Object.defineProperty(Document.prototype, "onprogress", { get: curMemoryArea.onprogress_getter, set: curMemoryArea.onprogress_setter, enumerable: true, configurable: true, });
curMemoryArea.onprogress_smart_getter = function onprogress() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onprogress的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onprogress_smart_getter);
Document.prototype.__defineGetter__("onprogress", curMemoryArea.onprogress_smart_getter);

// onratechange
curMemoryArea.onratechange_getter = function onratechange() { debugger; }; mframe.safefunction(curMemoryArea.onratechange_getter);
Object.defineProperty(curMemoryArea.onratechange_getter, "name", { value: "get onratechange", configurable: true, });
// onratechange
curMemoryArea.onratechange_setter = function onratechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onratechange_setter);
Object.defineProperty(curMemoryArea.onratechange_setter, "name", { value: "set onratechange", configurable: true, });
Object.defineProperty(Document.prototype, "onratechange", { get: curMemoryArea.onratechange_getter, set: curMemoryArea.onratechange_setter, enumerable: true, configurable: true, });
curMemoryArea.onratechange_smart_getter = function onratechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onratechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onratechange_smart_getter);
Document.prototype.__defineGetter__("onratechange", curMemoryArea.onratechange_smart_getter);

// onreset
curMemoryArea.onreset_getter = function onreset() { debugger; }; mframe.safefunction(curMemoryArea.onreset_getter);
Object.defineProperty(curMemoryArea.onreset_getter, "name", { value: "get onreset", configurable: true, });
// onreset
curMemoryArea.onreset_setter = function onreset(val) { debugger; }; mframe.safefunction(curMemoryArea.onreset_setter);
Object.defineProperty(curMemoryArea.onreset_setter, "name", { value: "set onreset", configurable: true, });
Object.defineProperty(Document.prototype, "onreset", { get: curMemoryArea.onreset_getter, set: curMemoryArea.onreset_setter, enumerable: true, configurable: true, });
curMemoryArea.onreset_smart_getter = function onreset() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onreset的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onreset_smart_getter);
Document.prototype.__defineGetter__("onreset", curMemoryArea.onreset_smart_getter);

// onresize
curMemoryArea.onresize_getter = function onresize() { debugger; }; mframe.safefunction(curMemoryArea.onresize_getter);
Object.defineProperty(curMemoryArea.onresize_getter, "name", { value: "get onresize", configurable: true, });
// onresize
curMemoryArea.onresize_setter = function onresize(val) { debugger; }; mframe.safefunction(curMemoryArea.onresize_setter);
Object.defineProperty(curMemoryArea.onresize_setter, "name", { value: "set onresize", configurable: true, });
Object.defineProperty(Document.prototype, "onresize", { get: curMemoryArea.onresize_getter, set: curMemoryArea.onresize_setter, enumerable: true, configurable: true, });
curMemoryArea.onresize_smart_getter = function onresize() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onresize的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onresize_smart_getter);
Document.prototype.__defineGetter__("onresize", curMemoryArea.onresize_smart_getter);

// onscroll
curMemoryArea.onscroll_getter = function onscroll() { debugger; }; mframe.safefunction(curMemoryArea.onscroll_getter);
Object.defineProperty(curMemoryArea.onscroll_getter, "name", { value: "get onscroll", configurable: true, });
// onscroll
curMemoryArea.onscroll_setter = function onscroll(val) { debugger; }; mframe.safefunction(curMemoryArea.onscroll_setter);
Object.defineProperty(curMemoryArea.onscroll_setter, "name", { value: "set onscroll", configurable: true, });
Object.defineProperty(Document.prototype, "onscroll", { get: curMemoryArea.onscroll_getter, set: curMemoryArea.onscroll_setter, enumerable: true, configurable: true, });
curMemoryArea.onscroll_smart_getter = function onscroll() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onscroll的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onscroll_smart_getter);
Document.prototype.__defineGetter__("onscroll", curMemoryArea.onscroll_smart_getter);

// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_getter = function onsecuritypolicyviolation() { debugger; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_getter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_getter, "name", { value: "get onsecuritypolicyviolation", configurable: true, });
// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_setter = function onsecuritypolicyviolation(val) { debugger; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_setter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_setter, "name", { value: "set onsecuritypolicyviolation", configurable: true, });
Object.defineProperty(Document.prototype, "onsecuritypolicyviolation", { get: curMemoryArea.onsecuritypolicyviolation_getter, set: curMemoryArea.onsecuritypolicyviolation_setter, enumerable: true, configurable: true, });
curMemoryArea.onsecuritypolicyviolation_smart_getter = function onsecuritypolicyviolation() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onsecuritypolicyviolation的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_smart_getter);
Document.prototype.__defineGetter__("onsecuritypolicyviolation", curMemoryArea.onsecuritypolicyviolation_smart_getter);

// onseeked
curMemoryArea.onseeked_getter = function onseeked() { debugger; }; mframe.safefunction(curMemoryArea.onseeked_getter);
Object.defineProperty(curMemoryArea.onseeked_getter, "name", { value: "get onseeked", configurable: true, });
// onseeked
curMemoryArea.onseeked_setter = function onseeked(val) { debugger; }; mframe.safefunction(curMemoryArea.onseeked_setter);
Object.defineProperty(curMemoryArea.onseeked_setter, "name", { value: "set onseeked", configurable: true, });
Object.defineProperty(Document.prototype, "onseeked", { get: curMemoryArea.onseeked_getter, set: curMemoryArea.onseeked_setter, enumerable: true, configurable: true, });
curMemoryArea.onseeked_smart_getter = function onseeked() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onseeked的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onseeked_smart_getter);
Document.prototype.__defineGetter__("onseeked", curMemoryArea.onseeked_smart_getter);

// onseeking
curMemoryArea.onseeking_getter = function onseeking() { debugger; }; mframe.safefunction(curMemoryArea.onseeking_getter);
Object.defineProperty(curMemoryArea.onseeking_getter, "name", { value: "get onseeking", configurable: true, });
// onseeking
curMemoryArea.onseeking_setter = function onseeking(val) { debugger; }; mframe.safefunction(curMemoryArea.onseeking_setter);
Object.defineProperty(curMemoryArea.onseeking_setter, "name", { value: "set onseeking", configurable: true, });
Object.defineProperty(Document.prototype, "onseeking", { get: curMemoryArea.onseeking_getter, set: curMemoryArea.onseeking_setter, enumerable: true, configurable: true, });
curMemoryArea.onseeking_smart_getter = function onseeking() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onseeking的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onseeking_smart_getter);
Document.prototype.__defineGetter__("onseeking", curMemoryArea.onseeking_smart_getter);

// onselect
curMemoryArea.onselect_getter = function onselect() { debugger; }; mframe.safefunction(curMemoryArea.onselect_getter);
Object.defineProperty(curMemoryArea.onselect_getter, "name", { value: "get onselect", configurable: true, });
// onselect
curMemoryArea.onselect_setter = function onselect(val) { debugger; }; mframe.safefunction(curMemoryArea.onselect_setter);
Object.defineProperty(curMemoryArea.onselect_setter, "name", { value: "set onselect", configurable: true, });
Object.defineProperty(Document.prototype, "onselect", { get: curMemoryArea.onselect_getter, set: curMemoryArea.onselect_setter, enumerable: true, configurable: true, });
curMemoryArea.onselect_smart_getter = function onselect() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onselect的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onselect_smart_getter);
Document.prototype.__defineGetter__("onselect", curMemoryArea.onselect_smart_getter);

// onslotchange
curMemoryArea.onslotchange_getter = function onslotchange() { debugger; }; mframe.safefunction(curMemoryArea.onslotchange_getter);
Object.defineProperty(curMemoryArea.onslotchange_getter, "name", { value: "get onslotchange", configurable: true, });
// onslotchange
curMemoryArea.onslotchange_setter = function onslotchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onslotchange_setter);
Object.defineProperty(curMemoryArea.onslotchange_setter, "name", { value: "set onslotchange", configurable: true, });
Object.defineProperty(Document.prototype, "onslotchange", { get: curMemoryArea.onslotchange_getter, set: curMemoryArea.onslotchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onslotchange_smart_getter = function onslotchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onslotchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onslotchange_smart_getter);
Document.prototype.__defineGetter__("onslotchange", curMemoryArea.onslotchange_smart_getter);

// onstalled
curMemoryArea.onstalled_getter = function onstalled() { debugger; }; mframe.safefunction(curMemoryArea.onstalled_getter);
Object.defineProperty(curMemoryArea.onstalled_getter, "name", { value: "get onstalled", configurable: true, });
// onstalled
curMemoryArea.onstalled_setter = function onstalled(val) { debugger; }; mframe.safefunction(curMemoryArea.onstalled_setter);
Object.defineProperty(curMemoryArea.onstalled_setter, "name", { value: "set onstalled", configurable: true, });
Object.defineProperty(Document.prototype, "onstalled", { get: curMemoryArea.onstalled_getter, set: curMemoryArea.onstalled_setter, enumerable: true, configurable: true, });
curMemoryArea.onstalled_smart_getter = function onstalled() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onstalled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onstalled_smart_getter);
Document.prototype.__defineGetter__("onstalled", curMemoryArea.onstalled_smart_getter);

// onsubmit
curMemoryArea.onsubmit_getter = function onsubmit() { debugger; }; mframe.safefunction(curMemoryArea.onsubmit_getter);
Object.defineProperty(curMemoryArea.onsubmit_getter, "name", { value: "get onsubmit", configurable: true, });
// onsubmit
curMemoryArea.onsubmit_setter = function onsubmit(val) { debugger; }; mframe.safefunction(curMemoryArea.onsubmit_setter);
Object.defineProperty(curMemoryArea.onsubmit_setter, "name", { value: "set onsubmit", configurable: true, });
Object.defineProperty(Document.prototype, "onsubmit", { get: curMemoryArea.onsubmit_getter, set: curMemoryArea.onsubmit_setter, enumerable: true, configurable: true, });
curMemoryArea.onsubmit_smart_getter = function onsubmit() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onsubmit的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsubmit_smart_getter);
Document.prototype.__defineGetter__("onsubmit", curMemoryArea.onsubmit_smart_getter);

// onsuspend
curMemoryArea.onsuspend_getter = function onsuspend() { debugger; }; mframe.safefunction(curMemoryArea.onsuspend_getter);
Object.defineProperty(curMemoryArea.onsuspend_getter, "name", { value: "get onsuspend", configurable: true, });
// onsuspend
curMemoryArea.onsuspend_setter = function onsuspend(val) { debugger; }; mframe.safefunction(curMemoryArea.onsuspend_setter);
Object.defineProperty(curMemoryArea.onsuspend_setter, "name", { value: "set onsuspend", configurable: true, });
Object.defineProperty(Document.prototype, "onsuspend", { get: curMemoryArea.onsuspend_getter, set: curMemoryArea.onsuspend_setter, enumerable: true, configurable: true, });
curMemoryArea.onsuspend_smart_getter = function onsuspend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onsuspend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsuspend_smart_getter);
Document.prototype.__defineGetter__("onsuspend", curMemoryArea.onsuspend_smart_getter);

// ontimeupdate
curMemoryArea.ontimeupdate_getter = function ontimeupdate() { debugger; }; mframe.safefunction(curMemoryArea.ontimeupdate_getter);
Object.defineProperty(curMemoryArea.ontimeupdate_getter, "name", { value: "get ontimeupdate", configurable: true, });
// ontimeupdate
curMemoryArea.ontimeupdate_setter = function ontimeupdate(val) { debugger; }; mframe.safefunction(curMemoryArea.ontimeupdate_setter);
Object.defineProperty(curMemoryArea.ontimeupdate_setter, "name", { value: "set ontimeupdate", configurable: true, });
Object.defineProperty(Document.prototype, "ontimeupdate", { get: curMemoryArea.ontimeupdate_getter, set: curMemoryArea.ontimeupdate_setter, enumerable: true, configurable: true, });
curMemoryArea.ontimeupdate_smart_getter = function ontimeupdate() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontimeupdate的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontimeupdate_smart_getter);
Document.prototype.__defineGetter__("ontimeupdate", curMemoryArea.ontimeupdate_smart_getter);

// ontoggle
curMemoryArea.ontoggle_getter = function ontoggle() { debugger; }; mframe.safefunction(curMemoryArea.ontoggle_getter);
Object.defineProperty(curMemoryArea.ontoggle_getter, "name", { value: "get ontoggle", configurable: true, });
// ontoggle
curMemoryArea.ontoggle_setter = function ontoggle(val) { debugger; }; mframe.safefunction(curMemoryArea.ontoggle_setter);
Object.defineProperty(curMemoryArea.ontoggle_setter, "name", { value: "set ontoggle", configurable: true, });
Object.defineProperty(Document.prototype, "ontoggle", { get: curMemoryArea.ontoggle_getter, set: curMemoryArea.ontoggle_setter, enumerable: true, configurable: true, });
curMemoryArea.ontoggle_smart_getter = function ontoggle() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontoggle的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontoggle_smart_getter);
Document.prototype.__defineGetter__("ontoggle", curMemoryArea.ontoggle_smart_getter);

// onvolumechange
curMemoryArea.onvolumechange_getter = function onvolumechange() { debugger; }; mframe.safefunction(curMemoryArea.onvolumechange_getter);
Object.defineProperty(curMemoryArea.onvolumechange_getter, "name", { value: "get onvolumechange", configurable: true, });
// onvolumechange
curMemoryArea.onvolumechange_setter = function onvolumechange(val) { debugger; }; mframe.safefunction(curMemoryArea.onvolumechange_setter);
Object.defineProperty(curMemoryArea.onvolumechange_setter, "name", { value: "set onvolumechange", configurable: true, });
Object.defineProperty(Document.prototype, "onvolumechange", { get: curMemoryArea.onvolumechange_getter, set: curMemoryArea.onvolumechange_setter, enumerable: true, configurable: true, });
curMemoryArea.onvolumechange_smart_getter = function onvolumechange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onvolumechange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onvolumechange_smart_getter);
Document.prototype.__defineGetter__("onvolumechange", curMemoryArea.onvolumechange_smart_getter);

// onwaiting
curMemoryArea.onwaiting_getter = function onwaiting() { debugger; }; mframe.safefunction(curMemoryArea.onwaiting_getter);
Object.defineProperty(curMemoryArea.onwaiting_getter, "name", { value: "get onwaiting", configurable: true, });
// onwaiting
curMemoryArea.onwaiting_setter = function onwaiting(val) { debugger; }; mframe.safefunction(curMemoryArea.onwaiting_setter);
Object.defineProperty(curMemoryArea.onwaiting_setter, "name", { value: "set onwaiting", configurable: true, });
Object.defineProperty(Document.prototype, "onwaiting", { get: curMemoryArea.onwaiting_getter, set: curMemoryArea.onwaiting_setter, enumerable: true, configurable: true, });
curMemoryArea.onwaiting_smart_getter = function onwaiting() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwaiting的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwaiting_smart_getter);
Document.prototype.__defineGetter__("onwaiting", curMemoryArea.onwaiting_smart_getter);

// onwebkitanimationend
curMemoryArea.onwebkitanimationend_getter = function onwebkitanimationend() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_getter, "name", { value: "get onwebkitanimationend", configurable: true, });
// onwebkitanimationend
curMemoryArea.onwebkitanimationend_setter = function onwebkitanimationend(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_setter, "name", { value: "set onwebkitanimationend", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitanimationend", { get: curMemoryArea.onwebkitanimationend_getter, set: curMemoryArea.onwebkitanimationend_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitanimationend_smart_getter = function onwebkitanimationend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitanimationend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationend_smart_getter);
Document.prototype.__defineGetter__("onwebkitanimationend", curMemoryArea.onwebkitanimationend_smart_getter);

// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_getter = function onwebkitanimationiteration() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_getter, "name", { value: "get onwebkitanimationiteration", configurable: true, });
// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_setter = function onwebkitanimationiteration(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_setter, "name", { value: "set onwebkitanimationiteration", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitanimationiteration", { get: curMemoryArea.onwebkitanimationiteration_getter, set: curMemoryArea.onwebkitanimationiteration_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitanimationiteration_smart_getter = function onwebkitanimationiteration() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitanimationiteration的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_smart_getter);
Document.prototype.__defineGetter__("onwebkitanimationiteration", curMemoryArea.onwebkitanimationiteration_smart_getter);

// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_getter = function onwebkitanimationstart() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_getter, "name", { value: "get onwebkitanimationstart", configurable: true, });
// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_setter = function onwebkitanimationstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_setter, "name", { value: "set onwebkitanimationstart", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkitanimationstart", { get: curMemoryArea.onwebkitanimationstart_getter, set: curMemoryArea.onwebkitanimationstart_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitanimationstart_smart_getter = function onwebkitanimationstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkitanimationstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationstart_smart_getter);
Document.prototype.__defineGetter__("onwebkitanimationstart", curMemoryArea.onwebkitanimationstart_smart_getter);

// onwebkittransitionend
curMemoryArea.onwebkittransitionend_getter = function onwebkittransitionend() { debugger; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_getter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_getter, "name", { value: "get onwebkittransitionend", configurable: true, });
// onwebkittransitionend
curMemoryArea.onwebkittransitionend_setter = function onwebkittransitionend(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_setter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_setter, "name", { value: "set onwebkittransitionend", configurable: true, });
Object.defineProperty(Document.prototype, "onwebkittransitionend", { get: curMemoryArea.onwebkittransitionend_getter, set: curMemoryArea.onwebkittransitionend_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkittransitionend_smart_getter = function onwebkittransitionend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwebkittransitionend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkittransitionend_smart_getter);
Document.prototype.__defineGetter__("onwebkittransitionend", curMemoryArea.onwebkittransitionend_smart_getter);

// onwheel
curMemoryArea.onwheel_getter = function onwheel() { debugger; }; mframe.safefunction(curMemoryArea.onwheel_getter);
Object.defineProperty(curMemoryArea.onwheel_getter, "name", { value: "get onwheel", configurable: true, });
// onwheel
curMemoryArea.onwheel_setter = function onwheel(val) { debugger; }; mframe.safefunction(curMemoryArea.onwheel_setter);
Object.defineProperty(curMemoryArea.onwheel_setter, "name", { value: "set onwheel", configurable: true, });
Object.defineProperty(Document.prototype, "onwheel", { get: curMemoryArea.onwheel_getter, set: curMemoryArea.onwheel_setter, enumerable: true, configurable: true, });
curMemoryArea.onwheel_smart_getter = function onwheel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onwheel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwheel_smart_getter);
Document.prototype.__defineGetter__("onwheel", curMemoryArea.onwheel_smart_getter);

// onauxclick
curMemoryArea.onauxclick_getter = function onauxclick() { debugger; }; mframe.safefunction(curMemoryArea.onauxclick_getter);
Object.defineProperty(curMemoryArea.onauxclick_getter, "name", { value: "get onauxclick", configurable: true, });
// onauxclick
curMemoryArea.onauxclick_setter = function onauxclick(val) { debugger; }; mframe.safefunction(curMemoryArea.onauxclick_setter);
Object.defineProperty(curMemoryArea.onauxclick_setter, "name", { value: "set onauxclick", configurable: true, });
Object.defineProperty(Document.prototype, "onauxclick", { get: curMemoryArea.onauxclick_getter, set: curMemoryArea.onauxclick_setter, enumerable: true, configurable: true, });
curMemoryArea.onauxclick_smart_getter = function onauxclick() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onauxclick的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onauxclick_smart_getter);
Document.prototype.__defineGetter__("onauxclick", curMemoryArea.onauxclick_smart_getter);

// ongotpointercapture
curMemoryArea.ongotpointercapture_getter = function ongotpointercapture() { debugger; }; mframe.safefunction(curMemoryArea.ongotpointercapture_getter);
Object.defineProperty(curMemoryArea.ongotpointercapture_getter, "name", { value: "get ongotpointercapture", configurable: true, });
// ongotpointercapture
curMemoryArea.ongotpointercapture_setter = function ongotpointercapture(val) { debugger; }; mframe.safefunction(curMemoryArea.ongotpointercapture_setter);
Object.defineProperty(curMemoryArea.ongotpointercapture_setter, "name", { value: "set ongotpointercapture", configurable: true, });
Object.defineProperty(Document.prototype, "ongotpointercapture", { get: curMemoryArea.ongotpointercapture_getter, set: curMemoryArea.ongotpointercapture_setter, enumerable: true, configurable: true, });
curMemoryArea.ongotpointercapture_smart_getter = function ongotpointercapture() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ongotpointercapture的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ongotpointercapture_smart_getter);
Document.prototype.__defineGetter__("ongotpointercapture", curMemoryArea.ongotpointercapture_smart_getter);

// onlostpointercapture
curMemoryArea.onlostpointercapture_getter = function onlostpointercapture() { debugger; }; mframe.safefunction(curMemoryArea.onlostpointercapture_getter);
Object.defineProperty(curMemoryArea.onlostpointercapture_getter, "name", { value: "get onlostpointercapture", configurable: true, });
// onlostpointercapture
curMemoryArea.onlostpointercapture_setter = function onlostpointercapture(val) { debugger; }; mframe.safefunction(curMemoryArea.onlostpointercapture_setter);
Object.defineProperty(curMemoryArea.onlostpointercapture_setter, "name", { value: "set onlostpointercapture", configurable: true, });
Object.defineProperty(Document.prototype, "onlostpointercapture", { get: curMemoryArea.onlostpointercapture_getter, set: curMemoryArea.onlostpointercapture_setter, enumerable: true, configurable: true, });
curMemoryArea.onlostpointercapture_smart_getter = function onlostpointercapture() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onlostpointercapture的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onlostpointercapture_smart_getter);
Document.prototype.__defineGetter__("onlostpointercapture", curMemoryArea.onlostpointercapture_smart_getter);

// onpointerdown
curMemoryArea.onpointerdown_getter = function onpointerdown() { debugger; }; mframe.safefunction(curMemoryArea.onpointerdown_getter);
Object.defineProperty(curMemoryArea.onpointerdown_getter, "name", { value: "get onpointerdown", configurable: true, });
// onpointerdown
curMemoryArea.onpointerdown_setter = function onpointerdown(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerdown_setter);
Object.defineProperty(curMemoryArea.onpointerdown_setter, "name", { value: "set onpointerdown", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerdown", { get: curMemoryArea.onpointerdown_getter, set: curMemoryArea.onpointerdown_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerdown_smart_getter = function onpointerdown() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerdown的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerdown_smart_getter);
Document.prototype.__defineGetter__("onpointerdown", curMemoryArea.onpointerdown_smart_getter);

// onpointermove
curMemoryArea.onpointermove_getter = function onpointermove() { debugger; }; mframe.safefunction(curMemoryArea.onpointermove_getter);
Object.defineProperty(curMemoryArea.onpointermove_getter, "name", { value: "get onpointermove", configurable: true, });
// onpointermove
curMemoryArea.onpointermove_setter = function onpointermove(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointermove_setter);
Object.defineProperty(curMemoryArea.onpointermove_setter, "name", { value: "set onpointermove", configurable: true, });
Object.defineProperty(Document.prototype, "onpointermove", { get: curMemoryArea.onpointermove_getter, set: curMemoryArea.onpointermove_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointermove_smart_getter = function onpointermove() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointermove的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointermove_smart_getter);
Document.prototype.__defineGetter__("onpointermove", curMemoryArea.onpointermove_smart_getter);

// onpointerrawupdate
curMemoryArea.onpointerrawupdate_getter = function onpointerrawupdate() { debugger; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_getter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_getter, "name", { value: "get onpointerrawupdate", configurable: true, });
// onpointerrawupdate
curMemoryArea.onpointerrawupdate_setter = function onpointerrawupdate(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_setter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_setter, "name", { value: "set onpointerrawupdate", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerrawupdate", { get: curMemoryArea.onpointerrawupdate_getter, set: curMemoryArea.onpointerrawupdate_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerrawupdate_smart_getter = function onpointerrawupdate() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerrawupdate的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerrawupdate_smart_getter);
Document.prototype.__defineGetter__("onpointerrawupdate", curMemoryArea.onpointerrawupdate_smart_getter);

// onpointerup
curMemoryArea.onpointerup_getter = function onpointerup() { debugger; }; mframe.safefunction(curMemoryArea.onpointerup_getter);
Object.defineProperty(curMemoryArea.onpointerup_getter, "name", { value: "get onpointerup", configurable: true, });
// onpointerup
curMemoryArea.onpointerup_setter = function onpointerup(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerup_setter);
Object.defineProperty(curMemoryArea.onpointerup_setter, "name", { value: "set onpointerup", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerup", { get: curMemoryArea.onpointerup_getter, set: curMemoryArea.onpointerup_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerup_smart_getter = function onpointerup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerup_smart_getter);
Document.prototype.__defineGetter__("onpointerup", curMemoryArea.onpointerup_smart_getter);

// onpointercancel
curMemoryArea.onpointercancel_getter = function onpointercancel() { debugger; }; mframe.safefunction(curMemoryArea.onpointercancel_getter);
Object.defineProperty(curMemoryArea.onpointercancel_getter, "name", { value: "get onpointercancel", configurable: true, });
// onpointercancel
curMemoryArea.onpointercancel_setter = function onpointercancel(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointercancel_setter);
Object.defineProperty(curMemoryArea.onpointercancel_setter, "name", { value: "set onpointercancel", configurable: true, });
Object.defineProperty(Document.prototype, "onpointercancel", { get: curMemoryArea.onpointercancel_getter, set: curMemoryArea.onpointercancel_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointercancel_smart_getter = function onpointercancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointercancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointercancel_smart_getter);
Document.prototype.__defineGetter__("onpointercancel", curMemoryArea.onpointercancel_smart_getter);

// onpointerover
curMemoryArea.onpointerover_getter = function onpointerover() { debugger; }; mframe.safefunction(curMemoryArea.onpointerover_getter);
Object.defineProperty(curMemoryArea.onpointerover_getter, "name", { value: "get onpointerover", configurable: true, });
// onpointerover
curMemoryArea.onpointerover_setter = function onpointerover(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerover_setter);
Object.defineProperty(curMemoryArea.onpointerover_setter, "name", { value: "set onpointerover", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerover", { get: curMemoryArea.onpointerover_getter, set: curMemoryArea.onpointerover_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerover_smart_getter = function onpointerover() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerover的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerover_smart_getter);
Document.prototype.__defineGetter__("onpointerover", curMemoryArea.onpointerover_smart_getter);

// onpointerout
curMemoryArea.onpointerout_getter = function onpointerout() { debugger; }; mframe.safefunction(curMemoryArea.onpointerout_getter);
Object.defineProperty(curMemoryArea.onpointerout_getter, "name", { value: "get onpointerout", configurable: true, });
// onpointerout
curMemoryArea.onpointerout_setter = function onpointerout(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerout_setter);
Object.defineProperty(curMemoryArea.onpointerout_setter, "name", { value: "set onpointerout", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerout", { get: curMemoryArea.onpointerout_getter, set: curMemoryArea.onpointerout_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerout_smart_getter = function onpointerout() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerout的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerout_smart_getter);
Document.prototype.__defineGetter__("onpointerout", curMemoryArea.onpointerout_smart_getter);

// onpointerenter
curMemoryArea.onpointerenter_getter = function onpointerenter() { debugger; }; mframe.safefunction(curMemoryArea.onpointerenter_getter);
Object.defineProperty(curMemoryArea.onpointerenter_getter, "name", { value: "get onpointerenter", configurable: true, });
// onpointerenter
curMemoryArea.onpointerenter_setter = function onpointerenter(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerenter_setter);
Object.defineProperty(curMemoryArea.onpointerenter_setter, "name", { value: "set onpointerenter", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerenter", { get: curMemoryArea.onpointerenter_getter, set: curMemoryArea.onpointerenter_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerenter_smart_getter = function onpointerenter() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerenter的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerenter_smart_getter);
Document.prototype.__defineGetter__("onpointerenter", curMemoryArea.onpointerenter_smart_getter);

// onpointerleave
curMemoryArea.onpointerleave_getter = function onpointerleave() { debugger; }; mframe.safefunction(curMemoryArea.onpointerleave_getter);
Object.defineProperty(curMemoryArea.onpointerleave_getter, "name", { value: "get onpointerleave", configurable: true, });
// onpointerleave
curMemoryArea.onpointerleave_setter = function onpointerleave(val) { debugger; }; mframe.safefunction(curMemoryArea.onpointerleave_setter);
Object.defineProperty(curMemoryArea.onpointerleave_setter, "name", { value: "set onpointerleave", configurable: true, });
Object.defineProperty(Document.prototype, "onpointerleave", { get: curMemoryArea.onpointerleave_getter, set: curMemoryArea.onpointerleave_setter, enumerable: true, configurable: true, });
curMemoryArea.onpointerleave_smart_getter = function onpointerleave() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpointerleave的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpointerleave_smart_getter);
Document.prototype.__defineGetter__("onpointerleave", curMemoryArea.onpointerleave_smart_getter);

// onselectstart
curMemoryArea.onselectstart_getter = function onselectstart() { debugger; }; mframe.safefunction(curMemoryArea.onselectstart_getter);
Object.defineProperty(curMemoryArea.onselectstart_getter, "name", { value: "get onselectstart", configurable: true, });
// onselectstart
curMemoryArea.onselectstart_setter = function onselectstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onselectstart_setter);
Object.defineProperty(curMemoryArea.onselectstart_setter, "name", { value: "set onselectstart", configurable: true, });
Object.defineProperty(Document.prototype, "onselectstart", { get: curMemoryArea.onselectstart_getter, set: curMemoryArea.onselectstart_setter, enumerable: true, configurable: true, });
curMemoryArea.onselectstart_smart_getter = function onselectstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onselectstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onselectstart_smart_getter);
Document.prototype.__defineGetter__("onselectstart", curMemoryArea.onselectstart_smart_getter);

// onselectionchange
curMemoryArea.onselectionchange_getter = function onselectionchange() { debugger; }; mframe.safefunction(curMemoryArea.onselectionchange_getter);
Object.defineProperty(curMemoryArea.onselectionchange_getter, "name", { value: "get onselectionchange", configurable: true, });
// onselectionchange
curMemoryArea.onselectionchange_setter = function onselectionchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onselectionchange_setter);
Object.defineProperty(curMemoryArea.onselectionchange_setter, "name", { value: "set onselectionchange", configurable: true, });
Object.defineProperty(Document.prototype, "onselectionchange", { get: curMemoryArea.onselectionchange_getter, set: curMemoryArea.onselectionchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onselectionchange_smart_getter = function onselectionchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onselectionchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onselectionchange_smart_getter);
Document.prototype.__defineGetter__("onselectionchange", curMemoryArea.onselectionchange_smart_getter);

// onanimationend
curMemoryArea.onanimationend_getter = function onanimationend() { debugger; }; mframe.safefunction(curMemoryArea.onanimationend_getter);
Object.defineProperty(curMemoryArea.onanimationend_getter, "name", { value: "get onanimationend", configurable: true, });
// onanimationend
curMemoryArea.onanimationend_setter = function onanimationend(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationend_setter);
Object.defineProperty(curMemoryArea.onanimationend_setter, "name", { value: "set onanimationend", configurable: true, });
Object.defineProperty(Document.prototype, "onanimationend", { get: curMemoryArea.onanimationend_getter, set: curMemoryArea.onanimationend_setter, enumerable: true, configurable: true, });
curMemoryArea.onanimationend_smart_getter = function onanimationend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onanimationend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onanimationend_smart_getter);
Document.prototype.__defineGetter__("onanimationend", curMemoryArea.onanimationend_smart_getter);

// onanimationiteration
curMemoryArea.onanimationiteration_getter = function onanimationiteration() { debugger; }; mframe.safefunction(curMemoryArea.onanimationiteration_getter);
Object.defineProperty(curMemoryArea.onanimationiteration_getter, "name", { value: "get onanimationiteration", configurable: true, });
// onanimationiteration
curMemoryArea.onanimationiteration_setter = function onanimationiteration(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationiteration_setter);
Object.defineProperty(curMemoryArea.onanimationiteration_setter, "name", { value: "set onanimationiteration", configurable: true, });
Object.defineProperty(Document.prototype, "onanimationiteration", { get: curMemoryArea.onanimationiteration_getter, set: curMemoryArea.onanimationiteration_setter, enumerable: true, configurable: true, });
curMemoryArea.onanimationiteration_smart_getter = function onanimationiteration() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onanimationiteration的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onanimationiteration_smart_getter);
Document.prototype.__defineGetter__("onanimationiteration", curMemoryArea.onanimationiteration_smart_getter);

// onanimationstart
curMemoryArea.onanimationstart_getter = function onanimationstart() { debugger; }; mframe.safefunction(curMemoryArea.onanimationstart_getter);
Object.defineProperty(curMemoryArea.onanimationstart_getter, "name", { value: "get onanimationstart", configurable: true, });
// onanimationstart
curMemoryArea.onanimationstart_setter = function onanimationstart(val) { debugger; }; mframe.safefunction(curMemoryArea.onanimationstart_setter);
Object.defineProperty(curMemoryArea.onanimationstart_setter, "name", { value: "set onanimationstart", configurable: true, });
Object.defineProperty(Document.prototype, "onanimationstart", { get: curMemoryArea.onanimationstart_getter, set: curMemoryArea.onanimationstart_setter, enumerable: true, configurable: true, });
curMemoryArea.onanimationstart_smart_getter = function onanimationstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onanimationstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onanimationstart_smart_getter);
Document.prototype.__defineGetter__("onanimationstart", curMemoryArea.onanimationstart_smart_getter);

// ontransitionrun
curMemoryArea.ontransitionrun_getter = function ontransitionrun() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionrun_getter);
Object.defineProperty(curMemoryArea.ontransitionrun_getter, "name", { value: "get ontransitionrun", configurable: true, });
// ontransitionrun
curMemoryArea.ontransitionrun_setter = function ontransitionrun(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionrun_setter);
Object.defineProperty(curMemoryArea.ontransitionrun_setter, "name", { value: "set ontransitionrun", configurable: true, });
Object.defineProperty(Document.prototype, "ontransitionrun", { get: curMemoryArea.ontransitionrun_getter, set: curMemoryArea.ontransitionrun_setter, enumerable: true, configurable: true, });
curMemoryArea.ontransitionrun_smart_getter = function ontransitionrun() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontransitionrun的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontransitionrun_smart_getter);
Document.prototype.__defineGetter__("ontransitionrun", curMemoryArea.ontransitionrun_smart_getter);

// ontransitionstart
curMemoryArea.ontransitionstart_getter = function ontransitionstart() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionstart_getter);
Object.defineProperty(curMemoryArea.ontransitionstart_getter, "name", { value: "get ontransitionstart", configurable: true, });
// ontransitionstart
curMemoryArea.ontransitionstart_setter = function ontransitionstart(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionstart_setter);
Object.defineProperty(curMemoryArea.ontransitionstart_setter, "name", { value: "set ontransitionstart", configurable: true, });
Object.defineProperty(Document.prototype, "ontransitionstart", { get: curMemoryArea.ontransitionstart_getter, set: curMemoryArea.ontransitionstart_setter, enumerable: true, configurable: true, });
curMemoryArea.ontransitionstart_smart_getter = function ontransitionstart() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontransitionstart的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontransitionstart_smart_getter);
Document.prototype.__defineGetter__("ontransitionstart", curMemoryArea.ontransitionstart_smart_getter);

// ontransitionend
curMemoryArea.ontransitionend_getter = function ontransitionend() { debugger; }; mframe.safefunction(curMemoryArea.ontransitionend_getter);
Object.defineProperty(curMemoryArea.ontransitionend_getter, "name", { value: "get ontransitionend", configurable: true, });
// ontransitionend
curMemoryArea.ontransitionend_setter = function ontransitionend(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitionend_setter);
Object.defineProperty(curMemoryArea.ontransitionend_setter, "name", { value: "set ontransitionend", configurable: true, });
Object.defineProperty(Document.prototype, "ontransitionend", { get: curMemoryArea.ontransitionend_getter, set: curMemoryArea.ontransitionend_setter, enumerable: true, configurable: true, });
curMemoryArea.ontransitionend_smart_getter = function ontransitionend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontransitionend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontransitionend_smart_getter);
Document.prototype.__defineGetter__("ontransitionend", curMemoryArea.ontransitionend_smart_getter);

// ontransitioncancel
curMemoryArea.ontransitioncancel_getter = function ontransitioncancel() { debugger; }; mframe.safefunction(curMemoryArea.ontransitioncancel_getter);
Object.defineProperty(curMemoryArea.ontransitioncancel_getter, "name", { value: "get ontransitioncancel", configurable: true, });
// ontransitioncancel
curMemoryArea.ontransitioncancel_setter = function ontransitioncancel(val) { debugger; }; mframe.safefunction(curMemoryArea.ontransitioncancel_setter);
Object.defineProperty(curMemoryArea.ontransitioncancel_setter, "name", { value: "set ontransitioncancel", configurable: true, });
Object.defineProperty(Document.prototype, "ontransitioncancel", { get: curMemoryArea.ontransitioncancel_getter, set: curMemoryArea.ontransitioncancel_setter, enumerable: true, configurable: true, });
curMemoryArea.ontransitioncancel_smart_getter = function ontransitioncancel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的ontransitioncancel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ontransitioncancel_smart_getter);
Document.prototype.__defineGetter__("ontransitioncancel", curMemoryArea.ontransitioncancel_smart_getter);

// oncopy
curMemoryArea.oncopy_getter = function oncopy() { debugger; }; mframe.safefunction(curMemoryArea.oncopy_getter);
Object.defineProperty(curMemoryArea.oncopy_getter, "name", { value: "get oncopy", configurable: true, });
// oncopy
curMemoryArea.oncopy_setter = function oncopy(val) { debugger; }; mframe.safefunction(curMemoryArea.oncopy_setter);
Object.defineProperty(curMemoryArea.oncopy_setter, "name", { value: "set oncopy", configurable: true, });
Object.defineProperty(Document.prototype, "oncopy", { get: curMemoryArea.oncopy_getter, set: curMemoryArea.oncopy_setter, enumerable: true, configurable: true, });
curMemoryArea.oncopy_smart_getter = function oncopy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncopy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncopy_smart_getter);
Document.prototype.__defineGetter__("oncopy", curMemoryArea.oncopy_smart_getter);

// oncut
curMemoryArea.oncut_getter = function oncut() { debugger; }; mframe.safefunction(curMemoryArea.oncut_getter);
Object.defineProperty(curMemoryArea.oncut_getter, "name", { value: "get oncut", configurable: true, });
// oncut
curMemoryArea.oncut_setter = function oncut(val) { debugger; }; mframe.safefunction(curMemoryArea.oncut_setter);
Object.defineProperty(curMemoryArea.oncut_setter, "name", { value: "set oncut", configurable: true, });
Object.defineProperty(Document.prototype, "oncut", { get: curMemoryArea.oncut_getter, set: curMemoryArea.oncut_setter, enumerable: true, configurable: true, });
curMemoryArea.oncut_smart_getter = function oncut() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的oncut的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.oncut_smart_getter);
Document.prototype.__defineGetter__("oncut", curMemoryArea.oncut_smart_getter);

// onpaste
curMemoryArea.onpaste_getter = function onpaste() { debugger; }; mframe.safefunction(curMemoryArea.onpaste_getter);
Object.defineProperty(curMemoryArea.onpaste_getter, "name", { value: "get onpaste", configurable: true, });
// onpaste
curMemoryArea.onpaste_setter = function onpaste(val) { debugger; }; mframe.safefunction(curMemoryArea.onpaste_setter);
Object.defineProperty(curMemoryArea.onpaste_setter, "name", { value: "set onpaste", configurable: true, });
Object.defineProperty(Document.prototype, "onpaste", { get: curMemoryArea.onpaste_getter, set: curMemoryArea.onpaste_setter, enumerable: true, configurable: true, });
curMemoryArea.onpaste_smart_getter = function onpaste() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onpaste的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onpaste_smart_getter);
Document.prototype.__defineGetter__("onpaste", curMemoryArea.onpaste_smart_getter);

// children
curMemoryArea.children_getter = function children() { debugger; }; mframe.safefunction(curMemoryArea.children_getter);
Object.defineProperty(curMemoryArea.children_getter, "name", { value: "get children", configurable: true, });
Object.defineProperty(Document.prototype, "children", { get: curMemoryArea.children_getter, enumerable: true, configurable: true, });
curMemoryArea.children_smart_getter = function children() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的children的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.children_smart_getter);
Document.prototype.__defineGetter__("children", curMemoryArea.children_smart_getter);

// firstElementChild
curMemoryArea.firstElementChild_getter = function firstElementChild() { debugger; }; mframe.safefunction(curMemoryArea.firstElementChild_getter);
Object.defineProperty(curMemoryArea.firstElementChild_getter, "name", { value: "get firstElementChild", configurable: true, });
Object.defineProperty(Document.prototype, "firstElementChild", { get: curMemoryArea.firstElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstElementChild_smart_getter = function firstElementChild() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的firstElementChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.firstElementChild_smart_getter);
Document.prototype.__defineGetter__("firstElementChild", curMemoryArea.firstElementChild_smart_getter);

// lastElementChild
curMemoryArea.lastElementChild_getter = function lastElementChild() { debugger; }; mframe.safefunction(curMemoryArea.lastElementChild_getter);
Object.defineProperty(curMemoryArea.lastElementChild_getter, "name", { value: "get lastElementChild", configurable: true, });
Object.defineProperty(Document.prototype, "lastElementChild", { get: curMemoryArea.lastElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.lastElementChild_smart_getter = function lastElementChild() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的lastElementChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.lastElementChild_smart_getter);
Document.prototype.__defineGetter__("lastElementChild", curMemoryArea.lastElementChild_smart_getter);

// childElementCount
curMemoryArea.childElementCount_getter = function childElementCount() { debugger; }; mframe.safefunction(curMemoryArea.childElementCount_getter);
Object.defineProperty(curMemoryArea.childElementCount_getter, "name", { value: "get childElementCount", configurable: true, });
Object.defineProperty(Document.prototype, "childElementCount", { get: curMemoryArea.childElementCount_getter, enumerable: true, configurable: true, });
curMemoryArea.childElementCount_smart_getter = function childElementCount() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的childElementCount的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.childElementCount_smart_getter);
Document.prototype.__defineGetter__("childElementCount", curMemoryArea.childElementCount_smart_getter);

// activeElement
curMemoryArea.activeElement_getter = function activeElement() { debugger; }; mframe.safefunction(curMemoryArea.activeElement_getter);
Object.defineProperty(curMemoryArea.activeElement_getter, "name", { value: "get activeElement", configurable: true, });
Object.defineProperty(Document.prototype, "activeElement", { get: curMemoryArea.activeElement_getter, enumerable: true, configurable: true, });
curMemoryArea.activeElement_smart_getter = function activeElement() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的activeElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.activeElement_smart_getter);
Document.prototype.__defineGetter__("activeElement", curMemoryArea.activeElement_smart_getter);

// styleSheets
curMemoryArea.styleSheets_getter = function styleSheets() { debugger; }; mframe.safefunction(curMemoryArea.styleSheets_getter);
Object.defineProperty(curMemoryArea.styleSheets_getter, "name", { value: "get styleSheets", configurable: true, });
Object.defineProperty(Document.prototype, "styleSheets", { get: curMemoryArea.styleSheets_getter, enumerable: true, configurable: true, });
curMemoryArea.styleSheets_smart_getter = function styleSheets() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的styleSheets的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.styleSheets_smart_getter);
Document.prototype.__defineGetter__("styleSheets", curMemoryArea.styleSheets_smart_getter);

// pointerLockElement
curMemoryArea.pointerLockElement_getter = function pointerLockElement() { debugger; }; mframe.safefunction(curMemoryArea.pointerLockElement_getter);
Object.defineProperty(curMemoryArea.pointerLockElement_getter, "name", { value: "get pointerLockElement", configurable: true, });
Object.defineProperty(Document.prototype, "pointerLockElement", { get: curMemoryArea.pointerLockElement_getter, enumerable: true, configurable: true, });
curMemoryArea.pointerLockElement_smart_getter = function pointerLockElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的pointerLockElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.pointerLockElement_smart_getter);
Document.prototype.__defineGetter__("pointerLockElement", curMemoryArea.pointerLockElement_smart_getter);

// fullscreenElement
curMemoryArea.fullscreenElement_getter = function fullscreenElement() { debugger; }; mframe.safefunction(curMemoryArea.fullscreenElement_getter);
Object.defineProperty(curMemoryArea.fullscreenElement_getter, "name", { value: "get fullscreenElement", configurable: true, });
// fullscreenElement
curMemoryArea.fullscreenElement_setter = function fullscreenElement(val) { debugger; }; mframe.safefunction(curMemoryArea.fullscreenElement_setter);
Object.defineProperty(curMemoryArea.fullscreenElement_setter, "name", { value: "set fullscreenElement", configurable: true, });
Object.defineProperty(Document.prototype, "fullscreenElement", { get: curMemoryArea.fullscreenElement_getter, set: curMemoryArea.fullscreenElement_setter, enumerable: true, configurable: true, });
curMemoryArea.fullscreenElement_smart_getter = function fullscreenElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fullscreenElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fullscreenElement_smart_getter);
Document.prototype.__defineGetter__("fullscreenElement", curMemoryArea.fullscreenElement_smart_getter);

// adoptedStyleSheets
curMemoryArea.adoptedStyleSheets_getter = function adoptedStyleSheets() { debugger; }; mframe.safefunction(curMemoryArea.adoptedStyleSheets_getter);
Object.defineProperty(curMemoryArea.adoptedStyleSheets_getter, "name", { value: "get adoptedStyleSheets", configurable: true, });
// adoptedStyleSheets
curMemoryArea.adoptedStyleSheets_setter = function adoptedStyleSheets(val) { debugger; }; mframe.safefunction(curMemoryArea.adoptedStyleSheets_setter);
Object.defineProperty(curMemoryArea.adoptedStyleSheets_setter, "name", { value: "set adoptedStyleSheets", configurable: true, });
Object.defineProperty(Document.prototype, "adoptedStyleSheets", { get: curMemoryArea.adoptedStyleSheets_getter, set: curMemoryArea.adoptedStyleSheets_setter, enumerable: true, configurable: true, });
curMemoryArea.adoptedStyleSheets_smart_getter = function adoptedStyleSheets() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的adoptedStyleSheets的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.adoptedStyleSheets_smart_getter);
Document.prototype.__defineGetter__("adoptedStyleSheets", curMemoryArea.adoptedStyleSheets_smart_getter);

// pictureInPictureElement
curMemoryArea.pictureInPictureElement_getter = function pictureInPictureElement() { debugger; }; mframe.safefunction(curMemoryArea.pictureInPictureElement_getter);
Object.defineProperty(curMemoryArea.pictureInPictureElement_getter, "name", { value: "get pictureInPictureElement", configurable: true, });
Object.defineProperty(Document.prototype, "pictureInPictureElement", { get: curMemoryArea.pictureInPictureElement_getter, enumerable: true, configurable: true, });
curMemoryArea.pictureInPictureElement_smart_getter = function pictureInPictureElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的pictureInPictureElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.pictureInPictureElement_smart_getter);
Document.prototype.__defineGetter__("pictureInPictureElement", curMemoryArea.pictureInPictureElement_smart_getter);

// fonts
curMemoryArea.fonts_getter = function fonts() { debugger; }; mframe.safefunction(curMemoryArea.fonts_getter);
Object.defineProperty(curMemoryArea.fonts_getter, "name", { value: "get fonts", configurable: true, });
Object.defineProperty(Document.prototype, "fonts", { get: curMemoryArea.fonts_getter, enumerable: true, configurable: true, });
curMemoryArea.fonts_smart_getter = function fonts() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fonts的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fonts_smart_getter);
Document.prototype.__defineGetter__("fonts", curMemoryArea.fonts_smart_getter);

// fragmentDirective
curMemoryArea.fragmentDirective_getter = function fragmentDirective() { debugger; }; mframe.safefunction(curMemoryArea.fragmentDirective_getter);
Object.defineProperty(curMemoryArea.fragmentDirective_getter, "name", { value: "get fragmentDirective", configurable: true, });
Object.defineProperty(Document.prototype, "fragmentDirective", { get: curMemoryArea.fragmentDirective_getter, enumerable: true, configurable: true, });
curMemoryArea.fragmentDirective_smart_getter = function fragmentDirective() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的fragmentDirective的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.fragmentDirective_smart_getter);
Document.prototype.__defineGetter__("fragmentDirective", curMemoryArea.fragmentDirective_smart_getter);

// onscrollend
curMemoryArea.onscrollend_getter = function onscrollend() { debugger; }; mframe.safefunction(curMemoryArea.onscrollend_getter);
Object.defineProperty(curMemoryArea.onscrollend_getter, "name", { value: "get onscrollend", configurable: true, });
// onscrollend
curMemoryArea.onscrollend_setter = function onscrollend(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollend_setter);
Object.defineProperty(curMemoryArea.onscrollend_setter, "name", { value: "set onscrollend", configurable: true, });
Object.defineProperty(Document.prototype, "onscrollend", { get: curMemoryArea.onscrollend_getter, set: curMemoryArea.onscrollend_setter, enumerable: true, configurable: true, });
curMemoryArea.onscrollend_smart_getter = function onscrollend() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onscrollend的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onscrollend_smart_getter);
Document.prototype.__defineGetter__("onscrollend", curMemoryArea.onscrollend_smart_getter);

// onscrollsnapchange
curMemoryArea.onscrollsnapchange_getter = function onscrollsnapchange() { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_getter, "name", { value: "get onscrollsnapchange", configurable: true, });
// onscrollsnapchange
curMemoryArea.onscrollsnapchange_setter = function onscrollsnapchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_setter, "name", { value: "set onscrollsnapchange", configurable: true, });
Object.defineProperty(Document.prototype, "onscrollsnapchange", { get: curMemoryArea.onscrollsnapchange_getter, set: curMemoryArea.onscrollsnapchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onscrollsnapchange_smart_getter = function onscrollsnapchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onscrollsnapchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onscrollsnapchange_smart_getter);
Document.prototype.__defineGetter__("onscrollsnapchange", curMemoryArea.onscrollsnapchange_smart_getter);

// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_getter = function onscrollsnapchanging() { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_getter, "name", { value: "get onscrollsnapchanging", configurable: true, });
// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_setter = function onscrollsnapchanging(val) { debugger; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_setter, "name", { value: "set onscrollsnapchanging", configurable: true, });
Object.defineProperty(Document.prototype, "onscrollsnapchanging", { get: curMemoryArea.onscrollsnapchanging_getter, set: curMemoryArea.onscrollsnapchanging_setter, enumerable: true, configurable: true, });
curMemoryArea.onscrollsnapchanging_smart_getter = function onscrollsnapchanging() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Document"中的onscrollsnapchanging的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onscrollsnapchanging_smart_getter);
Document.prototype.__defineGetter__("onscrollsnapchanging", curMemoryArea.onscrollsnapchanging_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
Document.prototype["adoptNode"] = function adoptNode() { debugger; }; mframe.safefunction(Document.prototype["adoptNode"]);
Document.prototype["append"] = function append() { debugger; }; mframe.safefunction(Document.prototype["append"]);
Document.prototype["captureEvents"] = function captureEvents() { debugger; }; mframe.safefunction(Document.prototype["captureEvents"]);
Document.prototype["caretRangeFromPoint"] = function caretRangeFromPoint() { debugger; }; mframe.safefunction(Document.prototype["caretRangeFromPoint"]);
Document.prototype["clear"] = function clear() { debugger; }; mframe.safefunction(Document.prototype["clear"]);
Document.prototype["close"] = function close() { debugger; }; mframe.safefunction(Document.prototype["close"]);
Document.prototype["createAttribute"] = function createAttribute() { debugger; }; mframe.safefunction(Document.prototype["createAttribute"]);
Document.prototype["createAttributeNS"] = function createAttributeNS() { debugger; }; mframe.safefunction(Document.prototype["createAttributeNS"]);
Document.prototype["createCDATASection"] = function createCDATASection() { debugger; }; mframe.safefunction(Document.prototype["createCDATASection"]);
Document.prototype["createComment"] = function createComment() { debugger; }; mframe.safefunction(Document.prototype["createComment"]);
Document.prototype["createDocumentFragment"] = function createDocumentFragment() { debugger; }; mframe.safefunction(Document.prototype["createDocumentFragment"]);

// 创建一个函数来包装JSDOM元素
function wrapJsdomElement(jsdomElement, customElement) {
    // 存储原始JSDOM元素
    customElement._jsdom_element = jsdomElement;
    return customElement;
}

// 重写createElement方法
Document.prototype["createElement"] = function createElement(tagName, options) {
    console.log("createElement=>", tagName);
    var tagName = tagName.toLowerCase() + ""; // +""是因为null需要解析为"null"
    
    // 使用JSDOM创建真实DOM元素
    var jsdomElement = _jsdom_document.createElement(tagName, options);
    
    // 创建我们的自定义元素
    var htmlElement;
    if (mframe.memory.htmlelements[tagName] == undefined) {
        console.error("createElement缺少==>", tagName);
        debugger; // 没有, 说明这个HTMLXXXElement还没有补!
        // 创建一个基础元素
        htmlElement = {};
        htmlElement.__proto__ = HTMLElement.prototype;  
    } else {
        // 如果有直接创建
        htmlElement = mframe.memory.htmlelements[tagName]();
    }
    
    // 关联JSDOM元素
    wrapJsdomElement(jsdomElement, element);
    
    return mframe.proxy(element);
}; mframe.safefunction(Document.prototype["createElement"]);

Document.prototype["createElementNS"] = function createElementNS() { debugger; }; mframe.safefunction(Document.prototype["createElementNS"]);
Document.prototype["createEvent"] = function createEvent() { debugger; }; mframe.safefunction(Document.prototype["createEvent"]);
Document.prototype["createExpression"] = function createExpression() { debugger; }; mframe.safefunction(Document.prototype["createExpression"]);
Document.prototype["createNSResolver"] = function createNSResolver() { debugger; }; mframe.safefunction(Document.prototype["createNSResolver"]);
Document.prototype["createNodeIterator"] = function createNodeIterator() { debugger; }; mframe.safefunction(Document.prototype["createNodeIterator"]);
Document.prototype["createProcessingInstruction"] = function createProcessingInstruction() { debugger; }; mframe.safefunction(Document.prototype["createProcessingInstruction"]);
Document.prototype["createRange"] = function createRange() { debugger; }; mframe.safefunction(Document.prototype["createRange"]);
Document.prototype["createTextNode"] = function createTextNode() { debugger; }; mframe.safefunction(Document.prototype["createTextNode"]);
Document.prototype["createTreeWalker"] = function createTreeWalker() { debugger; }; mframe.safefunction(Document.prototype["createTreeWalker"]);
Document.prototype["elementFromPoint"] = function elementFromPoint() { debugger; }; mframe.safefunction(Document.prototype["elementFromPoint"]);
Document.prototype["elementsFromPoint"] = function elementsFromPoint() { debugger; }; mframe.safefunction(Document.prototype["elementsFromPoint"]);
Document.prototype["evaluate"] = function evaluate() { debugger; }; mframe.safefunction(Document.prototype["evaluate"]);
Document.prototype["execCommand"] = function execCommand() { debugger; }; mframe.safefunction(Document.prototype["execCommand"]);
Document.prototype["exitFullscreen"] = function exitFullscreen() { debugger; }; mframe.safefunction(Document.prototype["exitFullscreen"]);
Document.prototype["exitPictureInPicture"] = function exitPictureInPicture() { debugger; }; mframe.safefunction(Document.prototype["exitPictureInPicture"]);
Document.prototype["exitPointerLock"] = function exitPointerLock() { debugger; }; mframe.safefunction(Document.prototype["exitPointerLock"]);
Document.prototype["getAnimations"] = function getAnimations() { debugger; }; mframe.safefunction(Document.prototype["getAnimations"]);
Document.prototype["getElementById"] = function getElementById(id) {
    console.log("getElementById=>", id);
    // 使用JSDOM的document.getElementById
    var jsdomElement = _jsdom_document.getElementById(id);
    if (jsdomElement) {
        // 创建一个基础元素并包装JSDOM元素
        var element = {};
        element.__proto__ = Element.prototype;
        return mframe.proxy(wrapJsdomElement(jsdomElement, element));
    }
    return null;
}; mframe.safefunction(Document.prototype["getElementById"]);

Document.prototype["getElementsByClassName"] = function getElementsByClassName() { debugger; }; mframe.safefunction(Document.prototype["getElementsByClassName"]);
Document.prototype["getElementsByName"] = function getElementsByName() { debugger; }; mframe.safefunction(Document.prototype["getElementsByName"]);
Document.prototype["getElementsByTagName"] = function getElementsByTagName() { debugger; }; mframe.safefunction(Document.prototype["getElementsByTagName"]);
Document.prototype["getElementsByTagNameNS"] = function getElementsByTagNameNS() { debugger; }; mframe.safefunction(Document.prototype["getElementsByTagNameNS"]);
Document.prototype["getSelection"] = function getSelection() { debugger; }; mframe.safefunction(Document.prototype["getSelection"]);
Document.prototype["hasFocus"] = function hasFocus() { debugger; }; mframe.safefunction(Document.prototype["hasFocus"]);
Document.prototype["hasStorageAccess"] = function hasStorageAccess() { debugger; }; mframe.safefunction(Document.prototype["hasStorageAccess"]);
Document.prototype["hasUnpartitionedCookieAccess"] = function hasUnpartitionedCookieAccess() { debugger; }; mframe.safefunction(Document.prototype["hasUnpartitionedCookieAccess"]);
Document.prototype["importNode"] = function importNode() { debugger; }; mframe.safefunction(Document.prototype["importNode"]);
Document.prototype["open"] = function open() { debugger; }; mframe.safefunction(Document.prototype["open"]);
Document.prototype["prepend"] = function prepend() { debugger; }; mframe.safefunction(Document.prototype["prepend"]);
Document.prototype["queryCommandEnabled"] = function queryCommandEnabled() { debugger; }; mframe.safefunction(Document.prototype["queryCommandEnabled"]);
Document.prototype["queryCommandIndeterm"] = function queryCommandIndeterm() { debugger; }; mframe.safefunction(Document.prototype["queryCommandIndeterm"]);
Document.prototype["queryCommandState"] = function queryCommandState() { debugger; }; mframe.safefunction(Document.prototype["queryCommandState"]);
Document.prototype["queryCommandSupported"] = function queryCommandSupported() { debugger; }; mframe.safefunction(Document.prototype["queryCommandSupported"]);
Document.prototype["queryCommandValue"] = function queryCommandValue() { debugger; }; mframe.safefunction(Document.prototype["queryCommandValue"]);
Document.prototype["querySelector"] = function querySelector(selector) {
    console.log("querySelector=>", selector);
    var jsdomElement = _jsdom_document.querySelector(selector);
    if (jsdomElement) {
        var element = {};
        element.__proto__ = Element.prototype;
        return mframe.proxy(wrapJsdomElement(jsdomElement, element));
    }
    return null;
}; mframe.safefunction(Document.prototype["querySelector"]);

Document.prototype["querySelectorAll"] = function querySelectorAll(selector) {
    console.log("querySelectorAll=>", selector);
    var jsdomElements = _jsdom_document.querySelectorAll(selector);
    var result = [];
    for (var i = 0; i < jsdomElements.length; i++) {
        var element = {};
        element.__proto__ = Element.prototype;
        result.push(mframe.proxy(wrapJsdomElement(jsdomElements[i], element)));
    }
    return mframe.proxy(result);
}; mframe.safefunction(Document.prototype["querySelectorAll"]);

Document.prototype["releaseEvents"] = function releaseEvents() { debugger; }; mframe.safefunction(Document.prototype["releaseEvents"]);
Document.prototype["replaceChildren"] = function replaceChildren() { debugger; }; mframe.safefunction(Document.prototype["replaceChildren"]);
Document.prototype["requestStorageAccess"] = function requestStorageAccess() { debugger; }; mframe.safefunction(Document.prototype["requestStorageAccess"]);
Document.prototype["requestStorageAccessFor"] = function requestStorageAccessFor() { debugger; }; mframe.safefunction(Document.prototype["requestStorageAccessFor"]);
Document.prototype["startViewTransition"] = function startViewTransition() { debugger; }; mframe.safefunction(Document.prototype["startViewTransition"]);
Document.prototype["webkitCancelFullScreen"] = function webkitCancelFullScreen() { debugger; }; mframe.safefunction(Document.prototype["webkitCancelFullScreen"]);
Document.prototype["webkitExitFullscreen"] = function webkitExitFullscreen() { debugger; }; mframe.safefunction(Document.prototype["webkitExitFullscreen"]);
Document.prototype["write"] = function write() { debugger; }; mframe.safefunction(Document.prototype["write"]);
Document.prototype["writeln"] = function writeln() { debugger; }; mframe.safefunction(Document.prototype["writeln"]);
Document.prototype["browsingTopics"] = function browsingTopics() { debugger; }; mframe.safefunction(Document.prototype["browsingTopics"]);
Document.prototype["hasPrivateToken"] = function hasPrivateToken() { debugger; }; mframe.safefunction(Document.prototype["hasPrivateToken"]);
Document.prototype["hasRedemptionRecord"] = function hasRedemptionRecord() { debugger; }; mframe.safefunction(Document.prototype["hasRedemptionRecord"]);
Document.prototype["caretPositionFromPoint"] = function caretPositionFromPoint() { debugger; }; mframe.safefunction(Document.prototype["caretPositionFromPoint"]);
Document.prototype["moveBefore"] = function moveBefore() { debugger; }; mframe.safefunction(Document.prototype["moveBefore"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////














///////////////////////////////////////////////////

document.__proto__ = Document.prototype;
document = mframe.proxy(document) // 代理