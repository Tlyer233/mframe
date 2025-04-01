mframe.memory.PluginArray = {}
var PluginArray = function PluginArray() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(PluginArray)

mframe.memory.PluginArray.iterator = function values() {
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.PluginArray.iterator);
Object.defineProperties(PluginArray.prototype, {
    [Symbol.toStringTag]: {
        value: "PluginArray",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.PluginArray.iterator,
        configurable: true,
    },
})


//////////////////////////////////
var curMemoryArea = mframe.memory.PluginArray;

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// length
curMemoryArea.length_getter = function length() { debugger; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(PluginArray.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    let defaultValue = this.length;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    return defaultValue; // 已经正确修改返回值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
PluginArray.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
PluginArray.prototype["item"] = function item() { debugger; }; mframe.safefunction(PluginArray.prototype["item"]);
PluginArray.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(PluginArray.prototype["namedItem"]);
PluginArray.prototype["refresh"] = function refresh() { debugger; }; mframe.safefunction(PluginArray.prototype["refresh"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////


// window里面不能有 PluginArray 的实例, 只有navigator中可以有
mframe.memory.PluginArray._ ={};
for (let index = 0; index < mframe.memory.config.pluginArray.length; index++) {
    // part1: 索引
    mframe.memory.PluginArray._[index] = mframe.memory.Plugin.new( mframe.memory.config.pluginArray[index]);
    // part2: 名字变色
    Object.defineProperty(mframe.memory.PluginArray._,
        mframe.memory.config.pluginArray[index].name, {
        value: mframe.memory.config.pluginArray[index]
    });
    mframe.memory.PluginArray._.length = mframe.memory.config.pluginArray.length;
}

mframe.memory.PluginArray._.__proto__ = PluginArray.prototype;
navigator.plugins = mframe.memory.PluginArray._;

/**代理 */
navigator.plugins = mframe.proxy(navigator.plugins)