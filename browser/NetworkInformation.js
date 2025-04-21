var NetworkInformation = function NetworkInformation() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(NetworkInformation)

Object.defineProperties(NetworkInformation.prototype, {
    [Symbol.toStringTag]: {
        value: "NetworkInformation",
        configurable: true,
    }
})

///////////////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.NetworkInformation = {};

//============== Constant START ==================
Object.defineProperty(NetworkInformation, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(NetworkInformation, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// onchange
curMemoryArea.onchange_getter = function onchange() { return this._onchange; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", {value: "get onchange",configurable: true,});
// onchange
curMemoryArea.onchange_setter = function onchange(val) { this._onchange = val; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", {value: "set onchange",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "onchange", {get: curMemoryArea.onchange_getter,set: curMemoryArea.onchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onchange_smart_getter = function onchange() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onchange !== undefined ? this._onchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
NetworkInformation.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// effectiveType
curMemoryArea.effectiveType_getter = function effectiveType() { return this._effectiveType; }; mframe.safefunction(curMemoryArea.effectiveType_getter);
Object.defineProperty(curMemoryArea.effectiveType_getter, "name", {value: "get effectiveType",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "effectiveType", {get: curMemoryArea.effectiveType_getter,enumerable: true,configurable: true,});
curMemoryArea.effectiveType_smart_getter = function effectiveType() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return "4g"; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.effectiveType_smart_getter);
NetworkInformation.prototype.__defineGetter__("effectiveType", curMemoryArea.effectiveType_smart_getter);

// rtt
curMemoryArea.rtt_getter = function rtt() { return this._rtt; }; mframe.safefunction(curMemoryArea.rtt_getter);
Object.defineProperty(curMemoryArea.rtt_getter, "name", {value: "get rtt",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "rtt", {get: curMemoryArea.rtt_getter,enumerable: true,configurable: true,});
curMemoryArea.rtt_smart_getter = function rtt() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return 200; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.rtt_smart_getter);
NetworkInformation.prototype.__defineGetter__("rtt", curMemoryArea.rtt_smart_getter);

// downlink
curMemoryArea.downlink_getter = function downlink() { return this._downlink; }; mframe.safefunction(curMemoryArea.downlink_getter);
Object.defineProperty(curMemoryArea.downlink_getter, "name", {value: "get downlink",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "downlink", {get: curMemoryArea.downlink_getter,enumerable: true,configurable: true,});
curMemoryArea.downlink_smart_getter = function downlink() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return "10"; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.downlink_smart_getter);
NetworkInformation.prototype.__defineGetter__("downlink", curMemoryArea.downlink_smart_getter);

// saveData
curMemoryArea.saveData_getter = function saveData() { return this._saveData; }; mframe.safefunction(curMemoryArea.saveData_getter);
Object.defineProperty(curMemoryArea.saveData_getter, "name", {value: "get saveData",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "saveData", {get: curMemoryArea.saveData_getter,enumerable: true,configurable: true,});
curMemoryArea.saveData_smart_getter = function saveData() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return false; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.saveData_smart_getter);
NetworkInformation.prototype.__defineGetter__("saveData", curMemoryArea.saveData_smart_getter);

// type
curMemoryArea.type_getter = function type() { return this._type; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", {value: "get type",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "type", {get: curMemoryArea.type_getter,enumerable: true,configurable: true,});
curMemoryArea.type_smart_getter = function type() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return '4g'; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
NetworkInformation.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////////////////
NetworkInformation.prototype.__proto__ = EventTarget.prototype;
mframe.networkInformation = {};
mframe.networkInformation.__proto__ = NetworkInformation.prototype;
mframe.networkInformation = mframe.proxy(mframe.networkInformation);
