var History = function () {
    debugger;
    throw new TypeError('History 不允许被new')
}; mframe.safefunction(History);

Object.defineProperties(History.prototype, {
    [Symbol.toStringTag]: {
        value: "History",
        configurable: true,
    }
});


///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.History = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// length
curMemoryArea.length_getter = function length() { debugger; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(History.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = 3; // 返回实例属性或默认值
    mframe.log({ flag: 'property', className: 'History', propertyName: 'length', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.length_smart_getter);
History.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);


//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
// History.prototype["back"] = function back() { debugger; }; mframe.safefunction(History.prototype["back"]);
// History.prototype["forward"] = function forward() { debugger; }; mframe.safefunction(History.prototype["forward"]);
// History.prototype["go"] = function go() { debugger; }; mframe.safefunction(History.prototype["go"]);
// History.prototype["pushState"] = function pushState() { debugger; }; mframe.safefunction(History.prototype["pushState"]);
History.prototype["replaceState"] = function replaceState() { debugger; }; mframe.safefunction(History.prototype["replaceState"]);
//==============↑↑Function END↑↑====================
History.prototype.back = function back() { debugger; }; mframe.safefunction(History.prototype.back);


///////////////////////////////////////////////////
history = {}
history.__proto__ = History.prototype;
history = mframe.proxy(history) // 代理