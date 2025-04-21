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


//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
// History.prototype["back"] = function back() { debugger; }; mframe.safefunction(History.prototype["back"]);
// History.prototype["forward"] = function forward() { debugger; }; mframe.safefunction(History.prototype["forward"]);
// History.prototype["go"] = function go() { debugger; }; mframe.safefunction(History.prototype["go"]);
// History.prototype["pushState"] = function pushState() { debugger; }; mframe.safefunction(History.prototype["pushState"]);
History.prototype["replaceState"] = function replaceState() { debugger; }; mframe.safefunction(History.prototype["replaceState"]);
//==============↑↑Function END↑↑====================
History.prototype.back = function back(){debugger;}; mframe.safefunction(History.prototype.back);


///////////////////////////////////////////////////
history= {} 
history.__proto__ = History.prototype;
history=mframe.proxy(history) // 代理