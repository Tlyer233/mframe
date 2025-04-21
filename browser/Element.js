var Element = function Element() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Element)

Object.defineProperties(Element.prototype, {
    [Symbol.toStringTag]: {
        value: "Element",
        configurable: true,
    }
})

////////////////////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Element = {};

//============== Constant START ==================

//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%%%%%%%%%%%%%%%

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%%%%%%%%%%%%%%%

//============== Function START ====================
Element.prototype["getElementsByTagName"] = function getElementsByTagName() {
    // Element 和Document这个方法的区别是, 一个调用的全局, 一个是实例下的TageName
    var elements = this.jsdomMemory.getElementsByTagName(...arguments);
    var res = mframe.memory.htmlelements['collection'](elements);
    mframe.log({ flag: 'function', className: 'Element', methodName: 'getElementsByTagName', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Element.prototype["getElementsByTagName"]);
Element.prototype["setAttribute"] = function setAttribute() {
    console.log(this.jsdomMemory.tagName);
    var res = this.jsdomMemory.setAttribute(...arguments);
    mframe.log({ flag: 'function', className: 'Element', methodName: 'setAttribute', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Element.prototype["setAttribute"]);

// 2025年4月12日14:28:38; 你知道吗? 这个bug我找了2天(20h), 终于明白日志的重要性, 准备封装完整的日志功能 TODO
Element.prototype["getAttribute"] = function getAttribute() {
    var res = this.jsdomMemory.getAttribute(...arguments);
    mframe.log({ flag: 'function', className: 'Element', methodName: 'getAttribute', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Element.prototype["getAttribute"]);

//==============↑↑Function END↑↑====================


// === hook jsdom====
// append
const or_append = mframe.memory.jsdom.window.Element.prototype.append
mframe.memory.jsdom.window.Element.prototype.append = function (child) {
    console.log("调用jsdom内部的 Element.prototype.append", child);
    mframe.log({ flag: 'function', className: 'Node', methodName: '[Hook JSOM内部] append', inputVal: arguments, res: res });
    return or_append.call(this, child.jsdomMemory ? child.jsdomMemory : child);
}
// =======end========

////////////////////////////////////////////////////////////////////


/**代理 */
Element.prototype.__proto__ = Node.prototype;
Element = mframe.proxy(Element)