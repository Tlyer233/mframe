var Node = function Node() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Node)

Object.defineProperties(Node.prototype, {
    [Symbol.toStringTag]: {
        value: "Node",
        configurable: true,
    }
})


////////////////Prototype Prototype Prototype////////////////
var curMemoryArea = mframe.memory.Node = {};

//============== Constant START ==================
Object.defineProperty(Node, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Node, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Node, "ELEMENT_NODE", { configurable: false, enumerable: true, value: 1, writable: false, });
Object.defineProperty(Node, "ATTRIBUTE_NODE", { configurable: false, enumerable: true, value: 2, writable: false, });
Object.defineProperty(Node, "TEXT_NODE", { configurable: false, enumerable: true, value: 3, writable: false, });
Object.defineProperty(Node, "CDATA_SECTION_NODE", { configurable: false, enumerable: true, value: 4, writable: false, });
Object.defineProperty(Node, "ENTITY_REFERENCE_NODE", { configurable: false, enumerable: true, value: 5, writable: false, });
Object.defineProperty(Node, "ENTITY_NODE", { configurable: false, enumerable: true, value: 6, writable: false, });
Object.defineProperty(Node, "PROCESSING_INSTRUCTION_NODE", { configurable: false, enumerable: true, value: 7, writable: false, });
Object.defineProperty(Node, "COMMENT_NODE", { configurable: false, enumerable: true, value: 8, writable: false, });
Object.defineProperty(Node, "DOCUMENT_NODE", { configurable: false, enumerable: true, value: 9, writable: false, });
Object.defineProperty(Node, "DOCUMENT_TYPE_NODE", { configurable: false, enumerable: true, value: 10, writable: false, });
Object.defineProperty(Node, "DOCUMENT_FRAGMENT_NODE", { configurable: false, enumerable: true, value: 11, writable: false, });
Object.defineProperty(Node, "NOTATION_NODE", { configurable: false, enumerable: true, value: 12, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_DISCONNECTED", { configurable: false, enumerable: true, value: 1, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_PRECEDING", { configurable: false, enumerable: true, value: 2, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_FOLLOWING", { configurable: false, enumerable: true, value: 4, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_CONTAINS", { configurable: false, enumerable: true, value: 8, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_CONTAINED_BY", { configurable: false, enumerable: true, value: 16, writable: false, });
Object.defineProperty(Node, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", { configurable: false, enumerable: true, value: 32, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// nodeType
curMemoryArea.nodeType_getter = function nodeType() { debugger; }; mframe.safefunction(curMemoryArea.nodeType_getter);
Object.defineProperty(curMemoryArea.nodeType_getter, "name", { value: "get nodeType", configurable: true, });
Object.defineProperty(Node.prototype, "nodeType", { get: curMemoryArea.nodeType_getter, enumerable: true, configurable: true, });
curMemoryArea.nodeType_smart_getter = function nodeType() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的nodeType的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nodeType_smart_getter);
Node.prototype.__defineGetter__("nodeType", curMemoryArea.nodeType_smart_getter);

// nodeName
curMemoryArea.nodeName_getter = function nodeName() { debugger; }; mframe.safefunction(curMemoryArea.nodeName_getter);
Object.defineProperty(curMemoryArea.nodeName_getter, "name", { value: "get nodeName", configurable: true, });
Object.defineProperty(Node.prototype, "nodeName", { get: curMemoryArea.nodeName_getter, enumerable: true, configurable: true, });
curMemoryArea.nodeName_smart_getter = function nodeName() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的nodeName的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nodeName_smart_getter);
Node.prototype.__defineGetter__("nodeName", curMemoryArea.nodeName_smart_getter);

// baseURI
curMemoryArea.baseURI_getter = function baseURI() { debugger; }; mframe.safefunction(curMemoryArea.baseURI_getter);
Object.defineProperty(curMemoryArea.baseURI_getter, "name", { value: "get baseURI", configurable: true, });
Object.defineProperty(Node.prototype, "baseURI", { get: curMemoryArea.baseURI_getter, enumerable: true, configurable: true, });
curMemoryArea.baseURI_smart_getter = function baseURI() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的baseURI的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.baseURI_smart_getter);
Node.prototype.__defineGetter__("baseURI", curMemoryArea.baseURI_smart_getter);

// isConnected
curMemoryArea.isConnected_getter = function isConnected() { debugger; }; mframe.safefunction(curMemoryArea.isConnected_getter);
Object.defineProperty(curMemoryArea.isConnected_getter, "name", { value: "get isConnected", configurable: true, });
Object.defineProperty(Node.prototype, "isConnected", { get: curMemoryArea.isConnected_getter, enumerable: true, configurable: true, });
curMemoryArea.isConnected_smart_getter = function isConnected() {
    let defaultValue = true;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的isConnected的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.isConnected_smart_getter);
Node.prototype.__defineGetter__("isConnected", curMemoryArea.isConnected_smart_getter);

// ownerDocument
curMemoryArea.ownerDocument_getter = function ownerDocument() { debugger; }; mframe.safefunction(curMemoryArea.ownerDocument_getter);
Object.defineProperty(curMemoryArea.ownerDocument_getter, "name", { value: "get ownerDocument", configurable: true, });
Object.defineProperty(Node.prototype, "ownerDocument", { get: curMemoryArea.ownerDocument_getter, enumerable: true, configurable: true, });
curMemoryArea.ownerDocument_smart_getter = function ownerDocument() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的ownerDocument的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ownerDocument_smart_getter);
Node.prototype.__defineGetter__("ownerDocument", curMemoryArea.ownerDocument_smart_getter);

// parentNode
curMemoryArea.parentNode_getter = function parentNode() { debugger; }; mframe.safefunction(curMemoryArea.parentNode_getter);
Object.defineProperty(curMemoryArea.parentNode_getter, "name", { value: "get parentNode", configurable: true, });
Object.defineProperty(Node.prototype, "parentNode", { get: curMemoryArea.parentNode_getter, enumerable: true, configurable: true, });
curMemoryArea.parentNode_smart_getter = function parentNode() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的parentNode的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.parentNode_smart_getter);
Node.prototype.__defineGetter__("parentNode", curMemoryArea.parentNode_smart_getter);

// parentElement
curMemoryArea.parentElement_getter = function parentElement() { debugger; }; mframe.safefunction(curMemoryArea.parentElement_getter);
Object.defineProperty(curMemoryArea.parentElement_getter, "name", { value: "get parentElement", configurable: true, });
Object.defineProperty(Node.prototype, "parentElement", { get: curMemoryArea.parentElement_getter, enumerable: true, configurable: true, });
curMemoryArea.parentElement_smart_getter = function parentElement() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的parentElement的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.parentElement_smart_getter);
Node.prototype.__defineGetter__("parentElement", curMemoryArea.parentElement_smart_getter);

// childNodes
curMemoryArea.childNodes_getter = function childNodes() { debugger; }; mframe.safefunction(curMemoryArea.childNodes_getter);
Object.defineProperty(curMemoryArea.childNodes_getter, "name", { value: "get childNodes", configurable: true, });
Object.defineProperty(Node.prototype, "childNodes", { get: curMemoryArea.childNodes_getter, enumerable: true, configurable: true, });
curMemoryArea.childNodes_smart_getter = function childNodes() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的childNodes的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.childNodes_smart_getter);
Node.prototype.__defineGetter__("childNodes", curMemoryArea.childNodes_smart_getter);

// firstChild
curMemoryArea.firstChild_getter = function firstChild() { debugger; }; mframe.safefunction(curMemoryArea.firstChild_getter);
Object.defineProperty(curMemoryArea.firstChild_getter, "name", { value: "get firstChild", configurable: true, });
Object.defineProperty(Node.prototype, "firstChild", { get: curMemoryArea.firstChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstChild_smart_getter = function firstChild() {
    debugger
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的firstChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.firstChild_smart_getter);
Node.prototype.__defineGetter__("firstChild", curMemoryArea.firstChild_smart_getter);

// lastChild
curMemoryArea.lastChild_getter = function lastChild() { debugger; }; mframe.safefunction(curMemoryArea.lastChild_getter);
Object.defineProperty(curMemoryArea.lastChild_getter, "name", { value: "get lastChild", configurable: true, });
Object.defineProperty(Node.prototype, "lastChild", { get: curMemoryArea.lastChild_getter, enumerable: true, configurable: true, });
curMemoryArea.lastChild_smart_getter = function lastChild() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的lastChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.lastChild_smart_getter);
Node.prototype.__defineGetter__("lastChild", curMemoryArea.lastChild_smart_getter);

// previousSibling
curMemoryArea.previousSibling_getter = function previousSibling() { debugger; }; mframe.safefunction(curMemoryArea.previousSibling_getter);
Object.defineProperty(curMemoryArea.previousSibling_getter, "name", { value: "get previousSibling", configurable: true, });
Object.defineProperty(Node.prototype, "previousSibling", { get: curMemoryArea.previousSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.previousSibling_smart_getter = function previousSibling() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的previousSibling的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.previousSibling_smart_getter);
Node.prototype.__defineGetter__("previousSibling", curMemoryArea.previousSibling_smart_getter);

// nextSibling
curMemoryArea.nextSibling_getter = function nextSibling() { debugger; }; mframe.safefunction(curMemoryArea.nextSibling_getter);
Object.defineProperty(curMemoryArea.nextSibling_getter, "name", { value: "get nextSibling", configurable: true, });
Object.defineProperty(Node.prototype, "nextSibling", { get: curMemoryArea.nextSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.nextSibling_smart_getter = function nextSibling() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的nextSibling的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nextSibling_smart_getter);
Node.prototype.__defineGetter__("nextSibling", curMemoryArea.nextSibling_smart_getter);

// nodeValue
curMemoryArea.nodeValue_getter = function nodeValue() { debugger; }; mframe.safefunction(curMemoryArea.nodeValue_getter);
Object.defineProperty(curMemoryArea.nodeValue_getter, "name", { value: "get nodeValue", configurable: true, });
// nodeValue
curMemoryArea.nodeValue_setter = function nodeValue(val) { debugger; }; mframe.safefunction(curMemoryArea.nodeValue_setter);
Object.defineProperty(curMemoryArea.nodeValue_setter, "name", { value: "set nodeValue", configurable: true, });
Object.defineProperty(Node.prototype, "nodeValue", { get: curMemoryArea.nodeValue_getter, set: curMemoryArea.nodeValue_setter, enumerable: true, configurable: true, });
curMemoryArea.nodeValue_smart_getter = function nodeValue() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的nodeValue的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nodeValue_smart_getter);
Node.prototype.__defineGetter__("nodeValue", curMemoryArea.nodeValue_smart_getter);

// textContent
curMemoryArea.textContent_getter = function textContent() { debugger; }; mframe.safefunction(curMemoryArea.textContent_getter);
Object.defineProperty(curMemoryArea.textContent_getter, "name", { value: "get textContent", configurable: true, });
// textContent
curMemoryArea.textContent_setter = function textContent(val) { debugger; }; mframe.safefunction(curMemoryArea.textContent_setter);
Object.defineProperty(curMemoryArea.textContent_setter, "name", { value: "set textContent", configurable: true, });
Object.defineProperty(Node.prototype, "textContent", { get: curMemoryArea.textContent_getter, set: curMemoryArea.textContent_setter, enumerable: true, configurable: true, });
curMemoryArea.textContent_smart_getter = function textContent() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Node"中的textContent的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.textContent_smart_getter);
Node.prototype.__defineGetter__("textContent", curMemoryArea.textContent_smart_getter);

Node.prototype.ELEMENT_NODE = 1;
Node.prototype.ATTRIBUTE_NODE = 2;
Node.prototype.TEXT_NODE = 3;
Node.prototype.CDATA_SECTION_NODE = 4;
Node.prototype.ENTITY_REFERENCE_NODE = 5;
Node.prototype.ENTITY_NODE = 6;
Node.prototype.PROCESSING_INSTRUCTION_NODE = 7;
Node.prototype.COMMENT_NODE = 8;
Node.prototype.DOCUMENT_NODE = 9;
Node.prototype.DOCUMENT_TYPE_NODE = 10;
Node.prototype.DOCUMENT_FRAGMENT_NODE = 11;
Node.prototype.NOTATION_NODE = 12;
Node.prototype.DOCUMENT_POSITION_DISCONNECTED = 1;
Node.prototype.DOCUMENT_POSITION_PRECEDING = 2;
Node.prototype.DOCUMENT_POSITION_FOLLOWING = 4;
Node.prototype.DOCUMENT_POSITION_CONTAINS = 8;
Node.prototype.DOCUMENT_POSITION_CONTAINED_BY = 16;
Node.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
Node.prototype["appendChild"] = function appendChild(aChild) {
    if (mframe.memory.jsdom.document != undefined) { // 有jsdom
        // 一定是一个实例来调用appendChild才有用,this.jsdomMemory是jsdom的; aChild是我们伪造的,aChild.jsdomMemory是jsdom创建的
        return this.jsdomMemory.appendChild(aChild.jsdomMemory);
    }
    // 没有jsdom, 就只能返回一个空对象了.
    else {
        debugger;
        return {};
    }
}; mframe.safefunction(Node.prototype["appendChild"]);



// for test
// Node.prototype["appendChild"] = function appendChild(aChild) {   
//     if (mframe.memory.jsdom.document != undefined) { // 有jsdom
//         // 获取真实的JSDOM节点
//         const realParent = mframe.memory.domProxy.elementMap.get(this) || this.jsdomMemory;
//         const realChild = mframe.memory.domProxy.elementMap.get(aChild) || aChild.jsdomMemory;
        
//         console.log("真实操作节点:");
//         console.log("- Parent:", realParent.outerHTML);
//         console.log("- Child:", realChild.outerHTML);
        
//         // 执行真实DOM操作
//         const result = realParent.appendChild(realChild);
        
//         // 返回代理对象
//         return mframe.memory.domProxy.getProxy(result);
//     }
//     // 没有jsdom, 就只能返回一个空对象了.
//     else {
//         debugger;
//         return {};
//     }
// }; mframe.safefunction(Node.prototype["appendChild"]);












Node.prototype["cloneNode"] = function cloneNode() { debugger; }; mframe.safefunction(Node.prototype["cloneNode"]);
Node.prototype["compareDocumentPosition"] = function compareDocumentPosition() { debugger; }; mframe.safefunction(Node.prototype["compareDocumentPosition"]);
Node.prototype["contains"] = function contains() { debugger; }; mframe.safefunction(Node.prototype["contains"]);
Node.prototype["getRootNode"] = function getRootNode() { debugger; }; mframe.safefunction(Node.prototype["getRootNode"]);
Node.prototype["hasChildNodes"] = function hasChildNodes() { debugger; }; mframe.safefunction(Node.prototype["hasChildNodes"]);
Node.prototype["insertBefore"] = function insertBefore() { debugger; }; mframe.safefunction(Node.prototype["insertBefore"]);
Node.prototype["isDefaultNamespace"] = function isDefaultNamespace() { debugger; }; mframe.safefunction(Node.prototype["isDefaultNamespace"]);
Node.prototype["isEqualNode"] = function isEqualNode() { debugger; }; mframe.safefunction(Node.prototype["isEqualNode"]);
Node.prototype["isSameNode"] = function isSameNode() { debugger; }; mframe.safefunction(Node.prototype["isSameNode"]);
Node.prototype["lookupNamespaceURI"] = function lookupNamespaceURI() { debugger; }; mframe.safefunction(Node.prototype["lookupNamespaceURI"]);
Node.prototype["lookupPrefix"] = function lookupPrefix() { debugger; }; mframe.safefunction(Node.prototype["lookupPrefix"]);
Node.prototype["normalize"] = function normalize() { debugger; }; mframe.safefunction(Node.prototype["normalize"]);
Node.prototype["removeChild"] = function removeChild() { debugger; }; mframe.safefunction(Node.prototype["removeChild"]);
Node.prototype["replaceChild"] = function replaceChild() { debugger; }; mframe.safefunction(Node.prototype["replaceChild"]);
//==============↑↑Function END↑↑====================


////////////////Instance Instance Instance///////////////////

/////////////////////////////////////////////////////////////


/**代理 */
Node.prototype.__proto__ = EventTarget.prototype;
Node = mframe.proxy(Node)