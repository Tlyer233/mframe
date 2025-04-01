mframe.memory.MimeTypeArray = {}
var MimeTypeArray = function MimeTypeArray() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(MimeTypeArray)

mframe.memory.MimeTypeArray.iterator = function values() {
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
}; mframe.safefunction(mframe.memory.MimeTypeArray.iterator);
Object.defineProperties(MimeTypeArray.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeTypeArray",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.MimeTypeArray.iterator,
        configurable: true,
    },
})


//////////////////////////////////
var curMemoryArea = mframe.memory.MimeTypeArray;

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// length
curMemoryArea.length_getter = function length() { debugger; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(MimeTypeArray.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeTypeArray"中的length的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
MimeTypeArray.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
MimeTypeArray.prototype["item"] = function item() { debugger; }; mframe.safefunction(MimeTypeArray.prototype["item"]);
MimeTypeArray.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(MimeTypeArray.prototype["namedItem"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////

// window里面不能有MimeTypeArray的实例, 只有navigator中可以有
mframe.memory.MimeTypeArray._ = {}
mframe.memory.MimeTypeArray._.__proto__ = MimeTypeArray.prototype;
navigator.plugins = mframe.memory.MimeTypeArray._;


/**代理 */
navigator.plugins = mframe.proxy(navigator.plugins)
