var ScreenOrientation = function ScreenOrientation() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(ScreenOrientation)
Object.defineProperties(ScreenOrientation.prototype, {
    [Symbol.toStringTag]: {
        value: "ScreenOrientation",
        configurable: true,
    }
})
mframe.screenOrientation = {
    angle: mframe.memory.config.initScreen.orientation.angle,
    onchange: mframe.memory.config.initScreen.orientation.onchange,
    type: mframe.memory.config.initScreen.orientation.type,
};
/////////////////////////////////////////
var curMemoryArea = mframe.memory.ScreenOrientation = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// angle
curMemoryArea.angle_getter = function angle() { return this.angle; }; mframe.safefunction(curMemoryArea.angle_getter);
Object.defineProperty(curMemoryArea.angle_getter, "name", { value: "get angle", configurable: true, });
Object.defineProperty(ScreenOrientation.prototype, "angle", { get: curMemoryArea.angle_getter, enumerable: true, configurable: true, });
curMemoryArea.angle_smart_getter = function angle() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.angle !== undefined ? this.angle : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.angle_smart_getter);
ScreenOrientation.prototype.__defineGetter__("angle", curMemoryArea.angle_smart_getter);

// type
curMemoryArea.type_getter = function type() { return this.type; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", { value: "get type", configurable: true, });
Object.defineProperty(ScreenOrientation.prototype, "type", { get: curMemoryArea.type_getter, enumerable: true, configurable: true, });
curMemoryArea.type_smart_getter = function type() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.type !== undefined ? this.type : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
ScreenOrientation.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { return this.onchange; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", { value: "get onchange", configurable: true, });
// onchange
curMemoryArea.onchange_setter = function onchange(val) { this.onchange = val; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", { value: "set onchange", configurable: true, });
Object.defineProperty(ScreenOrientation.prototype, "onchange", { get: curMemoryArea.onchange_getter, set: curMemoryArea.onchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onchange_smart_getter = function onchange() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.onchange !== undefined ? this.onchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
ScreenOrientation.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
ScreenOrientation.prototype["lock"] = function lock() { debugger; }; mframe.safefunction(ScreenOrientation.prototype["lock"]);
ScreenOrientation.prototype["unlock"] = function unlock() { debugger; }; mframe.safefunction(ScreenOrientation.prototype["unlock"]);
//==============↑↑Function END↑↑====================
/////////////////////////////////////////

console.log(EventTarget);

ScreenOrientation.prototype.__proto__ = EventTarget.prototype;
mframe.screenOrientation.__proto__ = ScreenOrientation.prototype;
mframe.screenOrientation = mframe.proxy(mframe.screenOrientation);