var IDBFactory = function IDBFactory() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(IDBFactory)
Object.defineProperties(IDBFactory.prototype, {
    [Symbol.toStringTag]: {
        value: "IDBFactory",
        configurable: true,
    }
})

///////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.IDBFactory = {};

//============== Constant START ==================
Object.defineProperty(IDBFactory, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(IDBFactory, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
IDBFactory.prototype["cmp"] = function cmp() { debugger; }; mframe.safefunction(IDBFactory.prototype["cmp"]);
IDBFactory.prototype["databases"] = function databases() { debugger; }; mframe.safefunction(IDBFactory.prototype["databases"]);
IDBFactory.prototype["deleteDatabase"] = function deleteDatabase() { debugger; }; mframe.safefunction(IDBFactory.prototype["deleteDatabase"]);
IDBFactory.prototype["open"] = function open() {
    var res = {};
    mframe.log({ flag: 'function', className: 'IDBFactory', methodName: 'open', inputVal: arguments, res: res });
    // return res;
    return mframe.proxy(res);
}; mframe.safefunction(IDBFactory.prototype["open"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////////

indexedDB = {};
indexedDB.__proto__ = IDBFactory.prototype;
indexedDB = mframe.proxy(indexedDB);