var curMemoryArea = mframe.memory.HTMLCollection = {};
var HTMLCollection = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLCollection);

// 迭代器
mframe.memory.HTMLCollection.iterator = function values() {
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
}; mframe.safefunction(mframe.memory.HTMLCollection.iterator);

Object.defineProperties(HTMLCollection.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLCollection",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.HTMLCollection.iterator,
        configurable: true
    },
});
////////////////////////////////////////////////////////// 2025年4月11日 更新
var curMemoryArea = mframe.memory.HTMLCollection = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// length
curMemoryArea.length_getter = function length() { return this._length; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(HTMLCollection.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.length; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._length !== undefined ? this._length : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
HTMLCollection.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLCollection.prototype["item"] = function item() { debugger; }; mframe.safefunction(HTMLCollection.prototype["item"]);
HTMLCollection.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(HTMLCollection.prototype["namedItem"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////////////////////////////

/**
 * 创建并返回一个代理后的HTMLCollection数组，其中每个DOM元素都通过mframe.proxy进行了代理。
 * @param {jsdom.HTMLCollection} initCollection 通过jsdom.document.getElementByXXX()获取的HTMLCollection。
 * @returns {Array} 返回代理后的DOM元素数组。
 * @description
 * 注意一：initCollection中的对象都是jsdom的对象，没有原型链。因此需要通过document.createElement(i.tagName)创建后再放入collection中。
 * 注意二：需要同时更新原型存在的属性和原型不存在的属性，例如 `<script type="text/javascript" r='m'>` 中的 `type`（原型有的属性）和 `r`（原型没有的属性）。
 * @example
 * var elements = mframe.memory.jsdom.document.getElementsByTagName(name); // elements是jsdom的HTMLCollection
 * return mframe.memory.htmlelements['collection'](elements);              // 展示如何调用
 * @private
 * 不能在document.createElement时调用，因为这不是页面的任何一个标签，只能算是DOM的中间件。
 */
mframe.memory.htmlelements['collection'] = function (initCollection) {
    // 暂时关闭输出打印,避免影响判断(下面要用set进行数据转移)
    mframe.console.mute();
    // 创建HTMLCollection实例
    var collection = new (function () { });
    // 代理数组中的元素+将数组中原jsdom的数据,变为我们有原型链仿照的数据
    for (let i = 0; i < initCollection.length; i++) {
        // 创建 具有原型链的数据
        collection[i] = document.createElement(initCollection[i].tagName);
        // 1.原型没有的属性也要有
        for (var attr of initCollection[i].attributes) {
            collection[i][attr.name] = attr.value;
            collection[i].setAttribute(attr.name, attr.value); // 都要设置, !!!! 巨坑,找了2天
        }
        // 2.原型有的属性要有
        for (var name of Object.getOwnPropertyNames(collection[i].__proto__)) {
            if (name === "constructor" || typeof initCollection[i][name] === 'function' || name === '__proto__')
                continue;
            collection[i].setAttribute(name, initCollection[i][name]); // TODO 其实如果是DOM元素,都需要这一行,后面踩坑再说吧 2025年4月11日23:46:54
            collection[i][name] = initCollection[i][name];
        }
        // 覆写原来的jsdom域
        collection[i].jsdomMemory = initCollection[i];
    }
    collection['length'] = initCollection.length;
    // HTMLCollection原型链继承
    collection.__proto__ = HTMLCollection.prototype;
    mframe.console.unmute(); // 恢复原始console对象
    // 二次代理
    for (let i = 0; i < collection.length; i++) {
        collection[i] = mframe.proxy(collection[i]);
    }

    return mframe.proxy(collection);
}