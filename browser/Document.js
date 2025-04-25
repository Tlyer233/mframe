var Document = function () { }; mframe.safefunction(Document);

Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true,
    }
});

Document.prototype.__proto__ = Node.prototype
document = mframe.memory.htmlelements['document'](); // 小document
///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Document = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================


//%%%%%%% Attribute START %%%%%%%%%%
// body
curMemoryArea.body_getter = function body() { debugger; }; mframe.safefunction(curMemoryArea.body_getter);
Object.defineProperty(curMemoryArea.body_getter, "name", { value: "get body", configurable: true, });
// body
curMemoryArea.body_setter = function body(val) {
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'body', method: 'set', val: val });
    return mframe.memory.jsdom.document.body = val;
}; mframe.safefunction(curMemoryArea.body_setter);
Object.defineProperty(curMemoryArea.body_setter, "name", { value: "set body", configurable: true, });
Object.defineProperty(Document.prototype, "body", { get: curMemoryArea.body_getter, set: curMemoryArea.body_setter, enumerable: true, configurable: true, });
curMemoryArea.body_smart_getter = function body() {
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error(); // 如果是实例访问,返回undefined
    // 确保单例
    if (mframe.memory.body) {
        var res = mframe.memory.body
    } else {
        mframe.memory.body = mframe.memory.htmlelements['body'](); // 不能调用createElement的,会返回代理的
        mframe.memory.body.jsdomMemory = mframe.jsdomProxy(mframe.memory.jsdom.document.body);
        var res = mframe.memory.body;
    }
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'body', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.body_smart_getter);
Document.prototype.__defineGetter__("body", curMemoryArea.body_smart_getter);

// head
curMemoryArea.head_getter = function head() { debugger; }; mframe.safefunction(curMemoryArea.head_getter);
Object.defineProperty(curMemoryArea.head_getter, "name", { value: "get head", configurable: true, });
Object.defineProperty(Document.prototype, "head", { get: curMemoryArea.head_getter, enumerable: true, configurable: true, });
curMemoryArea.head_smart_getter = function head() {
    if (this.constructor && this === this.constructor.prototype) return undefined; // 如果是实例访问,返回undefined
    // 确保单例
    if (mframe.memory.head) {
        var res = mframe.memory.head
    }
    else {
        mframe.memory.head = mframe.memory.htmlelements['head'](); // 不能调用createElement的,会返回代理的
        mframe.memory.head.jsdomMemory = mframe.jsdomProxy(mframe.memory.jsdom.document.head);
        var res = mframe.proxy(mframe.memory.head);
    }
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'head', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.head_smart_getter);
Document.prototype.__defineGetter__("head", curMemoryArea.head_smart_getter);

// all
curMemoryArea.all_getter = function all() { debugger; }; mframe.safefunction(curMemoryArea.all_getter);
Object.defineProperty(curMemoryArea.all_getter, "name", { value: "get all", configurable: true, });
Object.defineProperty(Document.prototype, "all", { get: curMemoryArea.all_getter, enumerable: true, configurable: true, });
curMemoryArea.all_smart_getter = function all() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');

    // 这个方法返回是tageName为name的所有标签, 是返回数组, so我们要代理这个数组中的所有对象
    var elements = mframe.memory.jsdom.document.getElementsByTagName("*"); // jsdom没有all,用这个替代;基本等价
    var res = mframe.memory.htmlelements['collection'](elements);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'getElementsByTagName', inputVal: arguments, res: res });
    return mframe.proxy(res); // TODO 不能偷懒这里的AllCollect还是要补, 里面有length


    res = this._all !== undefined ? this._all : ''; // 返回实例属性或默认值
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'all', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.all_smart_getter);
Document.prototype.__defineGetter__("all", curMemoryArea.all_smart_getter);

//cookie
curMemoryArea.cookie_getter = function cookie() { debugger; }; mframe.safefunction(curMemoryArea.cookie_getter);
Object.defineProperty(curMemoryArea.cookie_getter, "name", { value: "get cookie", configurable: true, });
// cookie
curMemoryArea.cookie_setter = function cookie(val) {
    curMemoryArea.cookie = val;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'cookie', method: 'set', val: curMemoryArea.cookie });
    return curMemoryArea.cookie;
}; mframe.safefunction(curMemoryArea.cookie_setter);
Object.defineProperty(curMemoryArea.cookie_setter, "name", { value: "set cookie", configurable: true, });
Object.defineProperty(Document.prototype, "cookie", { get: curMemoryArea.cookie_getter, set: curMemoryArea.cookie_setter, enumerable: true, configurable: true, });
curMemoryArea.cookie_smart_getter = function cookie() {
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    var res = curMemoryArea.cookie || "";
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'cookie', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.cookie_smart_getter);
Document.prototype.__defineGetter__("cookie", curMemoryArea.cookie_smart_getter);

// visibilityState
curMemoryArea.visibilityState_getter = function visibilityState() { return this._visibilityState; }; mframe.safefunction(curMemoryArea.visibilityState_getter);
Object.defineProperty(curMemoryArea.visibilityState_getter, "name", { value: "get visibilityState", configurable: true, });
Object.defineProperty(Document.prototype, "visibilityState", { get: curMemoryArea.visibilityState_getter, enumerable: true, configurable: true, });
curMemoryArea.visibilityState_smart_getter = function visibilityState() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');

    var res = 'hidden';
    // var res = 'prerender';
    // var res = 'visible';
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'visibilityState', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.visibilityState_smart_getter);
Document.prototype.__defineGetter__("visibilityState", curMemoryArea.visibilityState_smart_getter);

// documentElement
curMemoryArea.documentElement_getter = function documentElement() { return this._documentElement; }; mframe.safefunction(curMemoryArea.documentElement_getter);
Object.defineProperty(curMemoryArea.documentElement_getter, "name", { value: "get documentElement", configurable: true, });
Object.defineProperty(Document.prototype, "documentElement", { get: curMemoryArea.documentElement_getter, enumerable: true, configurable: true, });
curMemoryArea.documentElement_smart_getter = function documentElement() {
    var res = document.createElement("html");
    res.jsdomMemory = mframe.memory.jsdom.document.documentElement;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'documentElement', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.documentElement_smart_getter);
Document.prototype.__defineGetter__("documentElement", curMemoryArea.documentElement_smart_getter);

/** currentScript
 * 需要返回当前正在执行的js代码 或 null (肯定不能null,会检测的)
 * @returns 返回<script>标签
 * TODO 这玩意应当写活(用户传递,每个网站不同), 但config无法配置, 只能让用户直接改这里
 */
curMemoryArea.currentScript_getter = function currentScript() { return this._currentScript; }; mframe.safefunction(curMemoryArea.currentScript_getter);
Object.defineProperty(curMemoryArea.currentScript_getter, "name", { value: "get currentScript", configurable: true, });
Object.defineProperty(Document.prototype, "currentScript", { get: curMemoryArea.currentScript_getter, enumerable: true, configurable: true, });
curMemoryArea.currentScript_smart_getter = function currentScript() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    const scriptElement = document.createElement("script")
    scriptElement.setAttribute("data-n-head", "ssr");
    scriptElement.setAttribute("src", "https://g.alicdn.com/frontend-lib/frontend-lib/2.3.68/jquery_240910.min.js");
    var res = scriptElement;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'currentScript', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.currentScript_smart_getter);
Document.prototype.__defineGetter__("currentScript", curMemoryArea.currentScript_smart_getter);

/** readyState
 * 获取文档的加载状态。
 * @name readyState
 * @type {string}
 * @returns {string} 文档的加载状态，可为以下值之一：
 *   - "loading"：文档仍在加载中。
 *   - "interactive"：文档已解析完成，但子资源（如图片、样式表等）仍在加载。
 *   - "complete"：文档及其所有子资源均已加载完成，即将触发 `load` 事件。
 */
curMemoryArea.readyState_getter = function readyState() { return this._readyState; }; mframe.safefunction(curMemoryArea.readyState_getter);
Object.defineProperty(curMemoryArea.readyState_getter, "name", { value: "get readyState", configurable: true, });
Object.defineProperty(Document.prototype, "readyState", { get: curMemoryArea.readyState_getter, enumerable: true, configurable: true, });
curMemoryArea.readyState_smart_getter = function readyState() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = mframe.memory.jsdom.document.readyState; // loading
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'readyState', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.readyState_smart_getter);
Document.prototype.__defineGetter__("readyState", curMemoryArea.readyState_smart_getter);

// hidden
curMemoryArea.hidden_getter = function hidden() { return this._hidden; }; mframe.safefunction(curMemoryArea.hidden_getter);
Object.defineProperty(curMemoryArea.hidden_getter, "name", { value: "get hidden", configurable: true, });
Object.defineProperty(Document.prototype, "hidden", { get: curMemoryArea.hidden_getter, enumerable: true, configurable: true, });
curMemoryArea.hidden_smart_getter = function hidden() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    var res = false;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'hidden', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.hidden_smart_getter);
Document.prototype.__defineGetter__("hidden", curMemoryArea.hidden_smart_getter);

// wasDiscarded
curMemoryArea.wasDiscarded_getter = function wasDiscarded() { return this._wasDiscarded; }; mframe.safefunction(curMemoryArea.wasDiscarded_getter);
Object.defineProperty(curMemoryArea.wasDiscarded_getter, "name", { value: "get wasDiscarded", configurable: true, });
Object.defineProperty(Document.prototype, "wasDiscarded", { get: curMemoryArea.wasDiscarded_getter, enumerable: true, configurable: true, });
curMemoryArea.wasDiscarded_smart_getter = function wasDiscarded() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    var res = false;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'wasDiscarded', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.wasDiscarded_smart_getter);
Document.prototype.__defineGetter__("wasDiscarded", curMemoryArea.wasDiscarded_smart_getter);


// implementation
curMemoryArea.implementation_getter = function implementation() { debugger; }; mframe.safefunction(curMemoryArea.implementation_getter);
Object.defineProperty(curMemoryArea.implementation_getter, "name", { value: "get implementation", configurable: true, });
Object.defineProperty(Document.prototype, "implementation", { get: curMemoryArea.implementation_getter, enumerable: true, configurable: true, });
curMemoryArea.implementation_smart_getter = function implementation() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');

    res = mframe.memory.domImplementation; // 环境中唯一的DOMImplementation的实例
    res.jsdomMemory = mframe.memory.jsdom.document.implementation;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'implementation', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.implementation_smart_getter);
Document.prototype.__defineGetter__("implementation", curMemoryArea.implementation_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
// createElement
Document.prototype["createElement"] = function createElement(tagName) {
    // STEP1:清洗标签名称
    var tagName = tagName.toLowerCase() + ""; // +""是因为null需要解析为"null"
    // STEP2:创建我们的自定义元素
    var htmlElement;
    if (mframe.memory.htmlelements[tagName] == undefined) {
        console.log(`\x1b[31m==>createElement缺少==>${tagName}\x1b[0m`);
        debugger;
        htmlElement = {}; // 创建一个基础元素
        htmlElement.__proto__ = HTMLElement.prototype;
    } else {
        htmlElement = mframe.memory.htmlelements[tagName](); // 如果有直接创建
    }
    // STEP3:jsdomMemory域存储jsdom创建的元素
    if (mframe.memory.jsdom.document) {
        // 使用JSDOM创建真实DOM元素
        var jsdomXXXElement = mframe.memory.jsdom.document.createElement(...arguments);
        htmlElement.jsdomMemory = mframe.jsdomProxy(jsdomXXXElement)
    }
    mframe.log({ flag: 'function', className: 'Document', methodName: 'createElement', inputVal: arguments, res: htmlElement });
    return mframe.proxy(htmlElement);
}; mframe.safefunction(Document.prototype["createElement"]);


Document.prototype["getElementById"] = function getElementById() {
    var res = mframe.memory.jsdom.document.getElementById(...arguments);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'getElementById', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["getElementById"]);

Document.prototype["getElementsByTagName"] = function getElementsByTagName() {
    // 这个方法返回是tageName为name的所有标签, 是返回数组, so我们要代理这个数组中的所有对象
    var elements = mframe.memory.jsdom.document.getElementsByTagName(...arguments);
    var res = mframe.memory.htmlelements['collection'](elements);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'getElementsByTagName', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["getElementsByTagName"]);

Document.prototype["createExpression"] = function createExpression() {
    var res = mframe.memory.jsdom.document.createExpression(...arguments);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'createExpression', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["createExpression"]);

Document.prototype["querySelectorAll"] = function querySelectorAll() {
    var res = mframe.memory.jsdom.document["querySelectorAll"](...arguments);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'querySelectorAll', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["querySelectorAll"]);

Document.prototype["createTextNode"] = function createTextNode() {
    var res = mframe.memory.htmlelements['text'](...arguments);
    res.jsdomMemory = mframe.memory.jsdom.document.createTextNode(...arguments)
    mframe.log({ flag: 'function', className: 'Document', methodName: 'createTextNode', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["createTextNode"]);

Document.prototype["querySelector"] = function querySelector() {
    var res = mframe.memory.jsdom.document.querySelector(...arguments);
    

    mframe.log({ flag: 'function', className: 'Document', methodName: 'querySelector', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["querySelector"]);

Document.prototype["createEvent"] = function createEvent() {
    var res = mframe.memory.event();
    res.jsdomMemory =mframe.proxy( mframe.memory.jsdom.document['createEvent'](...arguments));
    res = mframe.proxy(res);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'createEvent', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["createEvent"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////
document.location = location;

///////////////////////////////////////////////////

document = mframe.proxy(document) // 代理

