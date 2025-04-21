var Storage = function Storage() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Storage)

Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        configurable: true,
    }
})

//////////////////////////////////
//===================Storage 的原型属性 START===================
// 长度(hook但未保护hook方法)
Storage.prototype.length = 0;
Storage.prototype.__defineGetter__("length", function length() {
    var res = Object.keys(this).length;
    mframe.log({ flag: 'property', className: 'Storage', propertyName: 'length', method: 'get', val: res });
    return res;
})
// 通过键获取值
Storage.prototype.getItem = function getItem(keyName) {
    var res = this[keyName] || undefined; // 这个this是指向实例的
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'getItem', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Storage.prototype.getItem);

// 设置键值对
Storage.prototype.setItem = function setItem(keyName, keyValue) {
    this[keyName] = keyValue;
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'setItem', inputVal: arguments, res: undefined });
    return undefined;
}; mframe.safefunction(Storage.prototype.setItem);

// 清空所有
Storage.prototype.clear = function clear() {
    let keyArray = Object.keys(this);
    for (let i = 0; i < keyArray.length; i++) {
        delete this[keyArray[i]];
    }
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'clear', inputVal: arguments, res: undefined });
    return undefined;
}; mframe.safefunction(Storage.prototype.clear);

// 返回第index个value
Storage.prototype.key = function key(index) {
    var res = Object.keys(this)[index];
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'key', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Storage.prototype.key);

// 删除指定的键
Storage.prototype.removeItem = function removeItem(keyName) {
    delete this[keyName];
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'removeItem', inputVal: arguments, res: undefined });
    return undefined;
}; mframe.safefunction(Storage.prototype.removeItem);
//================ ↑↑↑Storage 的原型属性 END↑↑↑ ================
//////////////////////////////////


/** 小变量定义 && 原型链的定义 */
var localStorage = {};
var sessionStorage = {};
localStorage.__proto__ = Storage.prototype;
localStorage = mframe.proxy(localStorage);
sessionStorage.__proto__ = Storage.prototype;
sessionStorage = mframe.proxy(sessionStorage);


