var MimeType = function MimeType() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(MimeType)
Object.defineProperties(MimeType.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeType",
        configurable: true,
    }
})


//////////////////////////////////
var curMemoryArea = mframe.memory.MimeType = {};

//%%%%%%% Attribute START %%%%%%%%%%
// type
curMemoryArea.type_getter = function type() { debugger; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", { value: "get type", configurable: true, });
Object.defineProperty(MimeType.prototype, "type", { get: curMemoryArea.type_getter, enumerable: true, configurable: true, });
curMemoryArea.type_smart_getter = function type() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的type的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
MimeType.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// suffixes
curMemoryArea.suffixes_getter = function suffixes() { debugger; }; mframe.safefunction(curMemoryArea.suffixes_getter);
Object.defineProperty(curMemoryArea.suffixes_getter, "name", { value: "get suffixes", configurable: true, });
Object.defineProperty(MimeType.prototype, "suffixes", { get: curMemoryArea.suffixes_getter, enumerable: true, configurable: true, });
curMemoryArea.suffixes_smart_getter = function suffixes() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的suffixes的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.suffixes_smart_getter);
MimeType.prototype.__defineGetter__("suffixes", curMemoryArea.suffixes_smart_getter);

// description
curMemoryArea.description_getter = function description() { debugger; }; mframe.safefunction(curMemoryArea.description_getter);
Object.defineProperty(curMemoryArea.description_getter, "name", { value: "get description", configurable: true, });
Object.defineProperty(MimeType.prototype, "description", { get: curMemoryArea.description_getter, enumerable: true, configurable: true, });
curMemoryArea.description_smart_getter = function description() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的description的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.description_smart_getter);
MimeType.prototype.__defineGetter__("description", curMemoryArea.description_smart_getter);

// enabledPlugin
curMemoryArea.enabledPlugin_getter = function enabledPlugin() { debugger; }; mframe.safefunction(curMemoryArea.enabledPlugin_getter);
Object.defineProperty(curMemoryArea.enabledPlugin_getter, "name", { value: "get enabledPlugin", configurable: true, });
Object.defineProperty(MimeType.prototype, "enabledPlugin", { get: curMemoryArea.enabledPlugin_getter, enumerable: true, configurable: true, });
curMemoryArea.enabledPlugin_smart_getter = function enabledPlugin() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的enabledPlugin的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.enabledPlugin_smart_getter);
MimeType.prototype.__defineGetter__("enabledPlugin", curMemoryArea.enabledPlugin_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////

// 保持原型属性和实例属性相同(如果没有原型,会直接报错)
for (let prototypeName in MimeType.prototype) {
    // 这样不会触发 直接访问实例属性的报错
    const descriptor = Object.getOwnPropertyDescriptor(MimeType.prototype, prototypeName);
    if (descriptor && (descriptor.value && typeof descriptor.value === 'function')) { //是方法

    } else {// 是属性or类
        MimeType.prototype.__defineGetter__(prototypeName, function () {
            return this[prototypeName];
        })
    }
}

/** 支持内部 new MimeType
 * 
 * @param {*} mimeTypeObj 
 * @returns 
 * 传入mimeTypeObj示例:
 * 
var mm = mframe.memory.MimeType.new({
    description: "Portable Document Format1",
    enabledPlugin: "Plugin1",
    suffixes: "pd1f",
    type: "application/pdf1",
});
 */
mframe.memory.MimeType.new = function (mimeTypeObj, initPlugin) {
    var mimeType = {};
    mimeType.description = mimeTypeObj.description;
    mimeType.enabledPlugin = initPlugin; //这个属性是Plugin的实例
    mimeType.suffixes = mimeTypeObj.suffixes;
    mimeType.type = mimeTypeObj.type;
    mimeType.__proto__ = MimeType.prototype;
    return mimeType;
}


/**代理 */
MimeType = mframe.proxy(MimeType)