// 创建 Crypto 类

_crypto = crypto; // 保留从vm2加载的crypto
var Crypto = function Crypto() {
    throw new TypeError("Illegal constructor");
}; mframe.safefunction(Crypto);

Object.defineProperties(Crypto.prototype, {
    [Symbol.toStringTag]: {
        value: "Crypto",
        configurable: true,
    }
})

// 使用原生crypto对象的方法
var crypto = {}
///////////////////////////////////////////
Crypto.prototype.getRandomValues = function getRandomValues(array) {
    return _crypto.getRandomValues(array);
}; mframe.safefunction(Crypto.prototype.getRandomValues)

Crypto.prototype.randomUUID = function randomUUID(array) {
    return _crypto.randomUUID(array);
}; mframe.safefunction(Crypto.prototype.randomUUID)

// 使用SubtleCrypto
crypto.subtle = _crypto.subtle ? mframe.proxy(_crypto.subtle) : mframe.proxy(new (class SubtleCrypto { }));
///////////////////////////////////////////
crypto.__proto__ = Crypto.prototype

crypto = mframe.proxy(crypto)
Crypto = mframe.proxy(Crypto)