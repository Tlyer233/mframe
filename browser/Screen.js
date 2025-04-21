var Screen = function Screen() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Screen)
Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true,
    }
})

// 初始化
screen = {
    availHeight: mframe.memory.config.initScreen.availHeight,
    availLeft: mframe.memory.config.initScreen.availLeft,
    availTop: mframe.memory.config.initScreen.availTop,
    availWidth: mframe.memory.config.initScreen.availWidth,
    colorDepth: mframe.memory.config.initScreen.colorDepth,
    height: mframe.memory.config.initScreen.height,
    isExtended: mframe.memory.config.initScreen.isExtended,
    onchange: mframe.memory.config.initScreen.onchange,
    orientation: mframe.screenOrientation, // 注意哈
    pixelDepth: mframe.memory.config.initScreen.pixelDepth,
    width: mframe.memory.config.initScreen.width
};
//////////////////////////////////
var curMemoryArea = mframe.memory.config.Screen = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// availWidth
curMemoryArea.availWidth_getter = function availWidth() { return this.availWidth; }; mframe.safefunction(curMemoryArea.availWidth_getter);
Object.defineProperty(curMemoryArea.availWidth_getter, "name", { value: "get availWidth", configurable: true, });
Object.defineProperty(Screen.prototype, "availWidth", { get: curMemoryArea.availWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.availWidth_smart_getter = function availWidth() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.availWidth !== undefined ? this.availWidth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.availWidth_smart_getter);
Screen.prototype.__defineGetter__("availWidth", curMemoryArea.availWidth_smart_getter);

// availHeight
curMemoryArea.availHeight_getter = function availHeight() { return this.availHeight; }; mframe.safefunction(curMemoryArea.availHeight_getter);
Object.defineProperty(curMemoryArea.availHeight_getter, "name", { value: "get availHeight", configurable: true, });
Object.defineProperty(Screen.prototype, "availHeight", { get: curMemoryArea.availHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.availHeight_smart_getter = function availHeight() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.availHeight !== undefined ? this.availHeight : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.availHeight_smart_getter);
Screen.prototype.__defineGetter__("availHeight", curMemoryArea.availHeight_smart_getter);

// width
curMemoryArea.width_getter = function width() { return this.width; }; mframe.safefunction(curMemoryArea.width_getter);
Object.defineProperty(curMemoryArea.width_getter, "name", { value: "get width", configurable: true, });
Object.defineProperty(Screen.prototype, "width", { get: curMemoryArea.width_getter, enumerable: true, configurable: true, });
curMemoryArea.width_smart_getter = function width() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.width !== undefined ? this.width : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.width_smart_getter);
Screen.prototype.__defineGetter__("width", curMemoryArea.width_smart_getter);

// height
curMemoryArea.height_getter = function height() { return this.height; }; mframe.safefunction(curMemoryArea.height_getter);
Object.defineProperty(curMemoryArea.height_getter, "name", { value: "get height", configurable: true, });
Object.defineProperty(Screen.prototype, "height", { get: curMemoryArea.height_getter, enumerable: true, configurable: true, });
curMemoryArea.height_smart_getter = function height() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.height !== undefined ? this.height : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.height_smart_getter);
Screen.prototype.__defineGetter__("height", curMemoryArea.height_smart_getter);

// colorDepth
curMemoryArea.colorDepth_getter = function colorDepth() { return this.colorDepth; }; mframe.safefunction(curMemoryArea.colorDepth_getter);
Object.defineProperty(curMemoryArea.colorDepth_getter, "name", { value: "get colorDepth", configurable: true, });
Object.defineProperty(Screen.prototype, "colorDepth", { get: curMemoryArea.colorDepth_getter, enumerable: true, configurable: true, });
curMemoryArea.colorDepth_smart_getter = function colorDepth() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.colorDepth !== undefined ? this.colorDepth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.colorDepth_smart_getter);
Screen.prototype.__defineGetter__("colorDepth", curMemoryArea.colorDepth_smart_getter);

// pixelDepth
curMemoryArea.pixelDepth_getter = function pixelDepth() { return this.pixelDepth; }; mframe.safefunction(curMemoryArea.pixelDepth_getter);
Object.defineProperty(curMemoryArea.pixelDepth_getter, "name", { value: "get pixelDepth", configurable: true, });
Object.defineProperty(Screen.prototype, "pixelDepth", { get: curMemoryArea.pixelDepth_getter, enumerable: true, configurable: true, });
curMemoryArea.pixelDepth_smart_getter = function pixelDepth() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.pixelDepth !== undefined ? this.pixelDepth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.pixelDepth_smart_getter);
Screen.prototype.__defineGetter__("pixelDepth", curMemoryArea.pixelDepth_smart_getter);

// availLeft
curMemoryArea.availLeft_getter = function availLeft() { return this.availLeft; }; mframe.safefunction(curMemoryArea.availLeft_getter);
Object.defineProperty(curMemoryArea.availLeft_getter, "name", { value: "get availLeft", configurable: true, });
Object.defineProperty(Screen.prototype, "availLeft", { get: curMemoryArea.availLeft_getter, enumerable: true, configurable: true, });
curMemoryArea.availLeft_smart_getter = function availLeft() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.availLeft !== undefined ? this.availLeft : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.availLeft_smart_getter);
Screen.prototype.__defineGetter__("availLeft", curMemoryArea.availLeft_smart_getter);

// availTop
curMemoryArea.availTop_getter = function availTop() { return this.availTop; }; mframe.safefunction(curMemoryArea.availTop_getter);
Object.defineProperty(curMemoryArea.availTop_getter, "name", { value: "get availTop", configurable: true, });
Object.defineProperty(Screen.prototype, "availTop", { get: curMemoryArea.availTop_getter, enumerable: true, configurable: true, });
curMemoryArea.availTop_smart_getter = function availTop() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.availTop !== undefined ? this.availTop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.availTop_smart_getter);
Screen.prototype.__defineGetter__("availTop", curMemoryArea.availTop_smart_getter);

// orientation
curMemoryArea.orientation_getter = function orientation() { return this.orientation; }; mframe.safefunction(curMemoryArea.orientation_getter);
Object.defineProperty(curMemoryArea.orientation_getter, "name", { value: "get orientation", configurable: true, });
Object.defineProperty(Screen.prototype, "orientation", { get: curMemoryArea.orientation_getter, enumerable: true, configurable: true, });
curMemoryArea.orientation_smart_getter = function orientation() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.orientation !== undefined ? this.orientation : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.orientation_smart_getter);
Screen.prototype.__defineGetter__("orientation", curMemoryArea.orientation_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { return this.onchange; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", { value: "get onchange", configurable: true, });
// onchange
curMemoryArea.onchange_setter = function onchange(val) { this.onchange = val; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", { value: "set onchange", configurable: true, });
Object.defineProperty(Screen.prototype, "onchange", { get: curMemoryArea.onchange_getter, set: curMemoryArea.onchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onchange_smart_getter = function onchange() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.onchange !== undefined ? this.onchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
Screen.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// isExtended
curMemoryArea.isExtended_getter = function isExtended() { return this.isExtended; }; mframe.safefunction(curMemoryArea.isExtended_getter);
Object.defineProperty(curMemoryArea.isExtended_getter, "name", { value: "get isExtended", configurable: true, });
Object.defineProperty(Screen.prototype, "isExtended", { get: curMemoryArea.isExtended_getter, enumerable: true, configurable: true, });
curMemoryArea.isExtended_smart_getter = function isExtended() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.isExtended !== undefined ? this.isExtended : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.isExtended_smart_getter);
Screen.prototype.__defineGetter__("isExtended", curMemoryArea.isExtended_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////
Screen.prototype.__proto__ = EventTarget.prototype;
screen.__proto__ = Screen.prototype;
Screen = mframe.proxy(Screen)