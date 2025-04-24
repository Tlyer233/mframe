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
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%%%%%%%%%%%%%%%

// parentNode
curMemoryArea.parentNode_getter = function parentNode() { debugger; }; mframe.safefunction(curMemoryArea.parentNode_getter);
Object.defineProperty(curMemoryArea.parentNode_getter, "name", { value: "get parentNode", configurable: true, });
Object.defineProperty(Node.prototype, "parentNode", { get: curMemoryArea.parentNode_getter, enumerable: true, configurable: true, });
curMemoryArea.parentNode_smart_getter = function parentNode() {
    var res = this.jsdomMemory.parentNode;
    mframe.log({ flag: 'property', className: 'Node', propertyName: 'parentNode', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.parentNode_smart_getter);
Node.prototype.__defineGetter__("parentNode", curMemoryArea.parentNode_smart_getter);

// parentElement
curMemoryArea.parentElement_getter = function parentElement() { debugger; }; mframe.safefunction(curMemoryArea.parentElement_getter);
Object.defineProperty(curMemoryArea.parentElement_getter, "name", { value: "get parentElement", configurable: true, });
Object.defineProperty(Node.prototype, "parentElement", { get: curMemoryArea.parentElement_getter, enumerable: true, configurable: true, });
curMemoryArea.parentElement_smart_getter = function parentElement() {
    var res = this.jsdomMemory.parentElement;
    mframe.log({ flag: 'property', className: 'Node', propertyName: 'parentElement', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.parentElement_smart_getter);
Node.prototype.__defineGetter__("parentElement", curMemoryArea.parentElement_smart_getter);

// firstChild
curMemoryArea.firstChild_getter = function firstChild() { debugger; }; mframe.safefunction(curMemoryArea.firstChild_getter);
Object.defineProperty(curMemoryArea.firstChild_getter, "name", { value: "get firstChild", configurable: true, });
Object.defineProperty(Node.prototype, "firstChild", { get: curMemoryArea.firstChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstChild_smart_getter = function firstChild() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this.jsdomMemory.firstChild; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'Node', propertyName: 'firstChild', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.firstChild_smart_getter);
Node.prototype.__defineGetter__("firstChild", curMemoryArea.firstChild_smart_getter);
//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%%%%%%%%%%%%%%%%%

//============== Function START ====================
// appendChild
Node.prototype["appendChild"] = function appendChild(aChild) {
    // 一定是一个实例来调用appendChild才有用,this.jsdomMemory是jsdom的; aChild是我们伪造的,aChild.jsdomMemory是jsdom创建的
    var res = this.jsdomMemory.appendChild(aChild.jsdomMemory);
    mframe.log({ flag: 'function', className: 'Node', methodName: 'appendChild', inputVal: arguments, res: res });
    return res;

}; mframe.safefunction(Node.prototype["appendChild"]);

//removeChild
Node.prototype["removeChild"] = function removeChild(child) {

    var res = this.jsdomMemory.removeChild(child)
    mframe.log({ flag: 'function', className: 'Node', methodName: 'removeChild', inputVal: arguments, res: res });
    return res;

}; mframe.safefunction(Node.prototype["removeChild"]);
Node.prototype["replaceChild"] = function replaceChild() { debugger; }; mframe.safefunction(Node.prototype["replaceChild"]);


/**insertBefore
 * newNode:要插入的节点。
 * referenceNode: 在其之前插入 newNode 的节点。如果为 null，newNode 将被插入到节点的子节点列表末尾。
*/
Node.prototype["insertBefore"] = function insertBefore(newNode, referenceNode) {
    var res = this.jsdomMemory["insertBefore"](newNode.jsdomMemory, referenceNode.jsdomMemory);
    mframe.log({ flag: 'function', className: 'Node', methodName: 'insertBefore', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Node.prototype["insertBefore"]);
//==============↑↑Function END↑↑====================


////////////////Instance Instance Instance///////////////////

// === hook jsdom===========================================
// remove
const or_removeChild = mframe.memory.jsdom.window.Node.prototype.removeChild
mframe.memory.jsdom.window.Node.prototype.removeChild = function (child) {
    var res = or_removeChild.call(this, child.jsdomMemory ? child.jsdomMemory : child);
    mframe.log({ flag: 'function', className: 'Node', methodName: '[Hook JSOM内部] removeChild', inputVal: arguments, res: res });

    return res;
}
// =======end================================================

/////////////////////////////////////////////////////////////


/**代理 */
Node.prototype.__proto__ = EventTarget.prototype;
Node = mframe.proxy(Node)