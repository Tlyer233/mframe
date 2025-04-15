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
    return Object.keys(this).length;
})
// 通过键获取值
Storage.prototype.getItem = function getItem(keyName) {
    console.log("Storage的getItem, keyName: ", keyName, "存的值是:", this[keyName]);

    debugger
    return this[keyName] || undefined; // 这个this是指向实例的
}; mframe.safefunction(Storage.prototype.getItem);

// 设置键值对
Storage.prototype.setItem = function setItem(keyName, keyValue) {
    this[keyName] = keyValue;
    return undefined;
}; mframe.safefunction(Storage.prototype.setItem);

// 清空所有
Storage.prototype.clear = function clear() {
    let keyArray = Object.keys(this);
    for (let i = 0; i < keyArray.length; i++) {
        delete this[keyArray[i]];
    }
    return undefined;
}; mframe.safefunction(Storage.prototype.clear);

// 返回第index个value
Storage.prototype.key = function key(index) {
    return Object.keys(this)[index];
}; mframe.safefunction(Storage.prototype.key);

// 删除指定的键
Storage.prototype.removeItem = function removeItem(keyName) {
    delete this[keyName];
    return undefined;
}; mframe.safefunction(Storage.prototype.removeItem);
//================ ↑↑↑Storage 的原型属性 END↑↑↑ ================
//////////////////////////////////


/** 小变量定义 && 原型链的定义 */
var localStorage = {};

// h5st这个应该缓存在mframe的内存中
// localStorage['WQ_gather_wgl1'] = { "v": "dee3cb94c529ac524a0996146a0176b8", "t": 1743691606906, "e": 31536000 };
// localStorage['WQ_gather_cv1'] = { "v": "bb6feb71f0a492c0860d44d557d509be", "t": 1743865720216, "e": 31536000 };
// localStorage['WQ_dy1_vk'] = { "5.0": { "b5216": { "e": 31536000, "v": "aw9p3rdscsxrxd29", "t": 1741588342540 } } };
// localStorage['WQ_dy1_tk_algo'] = { "aw9p3rdscsxrxd29": { "b5216": { "v": "eyJ0ayI6InRrMDN3YWYzMjFiZDkxOG5hb1R6MjVjM0FpMnZZeUtXcXhkcEhRNzlxTWxnMzNGeklhaVpLeUdqZ0xVUVJWTWZiOGZoUjRtTkxUMEVBQ2hNRUNkanNfQzBWVWQzIiwiYWxnbyI6ImZ1bmN0aW9uIHRlc3QodGssZnAsdHMsYWksYWxnbyl7dmFyIHJkPSdLcHVPQjVndTBpOGInO3ZhciBzdHI9XCJcIi5jb25jYXQodGspLmNvbmNhdChmcCkuY29uY2F0KHRzKS5jb25jYXQoYWkpLmNvbmNhdChyZCk7cmV0dXJuIGFsZ28uTUQ1KHN0cik7fSJ9", "e": 86400, "t": 1743865720414 } } }
// localStorage['_$rc'] = 'nyzoIC0GMP_YPpkzSNJDPvE.mqKCOq2L7YhYuP1M1bI0GaX0hnROh6w.ZTW'; // [瑞5]
// localStorage['$_YWTU'] = '1XYrRYRYAb1WmiPXvS.Vciic7yKhgyDi.Vy1Sn7wMSL'

localStorage.__proto__ = Storage.prototype;
localStorage = mframe.proxy(localStorage);

var sessionStorage = {};



sessionStorage.__proto__ = Storage.prototype;
sessionStorage = mframe.proxy(sessionStorage);


