var Text = function () { }; mframe.safefunction(Text);

Object.defineProperties(Text.prototype, {
    [Symbol.toStringTag]: {
        value: "Text",
        configurable: true,
    }
});
/////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Text = {};

//============== Constant START ==================
Object.defineProperty(Text, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Text, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// wholeText
curMemoryArea.wholeText_getter = function wholeText() { debugger; }; mframe.safefunction(curMemoryArea.wholeText_getter);
Object.defineProperty(curMemoryArea.wholeText_getter, "name", { value: "get wholeText", configurable: true, });
Object.defineProperty(Text.prototype, "wholeText", { get: curMemoryArea.wholeText_getter, enumerable: true, configurable: true, });
curMemoryArea.wholeText_smart_getter = function wholeText() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._wholeText !== undefined ? this._wholeText : this.jsdomMemory.wholeText; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'Text', propertyName: 'wholeText', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.wholeText_smart_getter);
Text.prototype.__defineGetter__("wholeText", curMemoryArea.wholeText_smart_getter);

// assignedSlot
curMemoryArea.assignedSlot_getter = function assignedSlot() { debugger; }; mframe.safefunction(curMemoryArea.assignedSlot_getter);
Object.defineProperty(curMemoryArea.assignedSlot_getter, "name", { value: "get assignedSlot", configurable: true, });
Object.defineProperty(Text.prototype, "assignedSlot", { get: curMemoryArea.assignedSlot_getter, enumerable: true, configurable: true, });
curMemoryArea.assignedSlot_smart_getter = function assignedSlot() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._assignedSlot !== undefined ? this._assignedSlot : this.jsdomMemory.assignedSlot; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'Text', propertyName: 'assignedSlot', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.assignedSlot_smart_getter);
Text.prototype.__defineGetter__("assignedSlot", curMemoryArea.assignedSlot_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
Text.prototype["splitText"] = function splitText() {
    var res = this.jsdomMemory["splitText"](...arguments);
    mframe.log({ flag: 'function', className: 'Text', methodName: 'splitText', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Text.prototype["splitText"]);
//==============↑↑Function END↑↑====================

/////////////////////////////////////////////////////
Text.prototype.__proto__ = Node.prototype;

/**
 * 改方法通过 Document.prototype["createTextNode"] 进行调用!!!
 * @param {string} text 
 * @returns 
 */
mframe.memory.htmlelements['text'] = function (text) {
    var text = new (function () { }); 
    text._wholeText = text;

    text.__proto__ = Text.prototype;
    return text;
}