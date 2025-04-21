var SubtleCrypto = function SubtleCrypto() {
    throw new TypeError("Illegal constructor");
}; mframe.safefunction(SubtleCrypto);

Object.defineProperties(SubtleCrypto.prototype, {
    [Symbol.toStringTag]: {
        value: "SubtleCrypto",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.SubtleCrypto = {};

//============== Constant START ==================
Object.defineProperty(SubtleCrypto, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(SubtleCrypto, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
SubtleCrypto.prototype["decrypt"] = function decrypt() {
    var res = _crypto.subtle.decrypt(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'decrypt', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["decrypt"]);
SubtleCrypto.prototype["deriveBits"] = function deriveBits() {
    var res = _crypto.subtle.deriveBits(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'deriveBits', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["deriveBits"]);
SubtleCrypto.prototype["deriveKey"] = function deriveKey() {
    var res = _crypto.subtle.deriveKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'deriveKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["deriveKey"]);
SubtleCrypto.prototype["digest"] = function digest() {
    var res = _crypto.subtle.digest(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'digest', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["digest"]);
SubtleCrypto.prototype["encrypt"] = function encrypt() {
    var res = _crypto.subtle.encrypt(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'encrypt', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["encrypt"]);
SubtleCrypto.prototype["exportKey"] = function exportKey() {
    var res = _crypto.subtle.exportKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'exportKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["exportKey"]);
SubtleCrypto.prototype["generateKey"] = function generateKey() {
    var res = _crypto.subtle.generateKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'generateKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["generateKey"]);
SubtleCrypto.prototype["importKey"] = function importKey() {
    var res = _crypto.subtle.importKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'importKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["importKey"]);
SubtleCrypto.prototype["sign"] = function sign() {
    var res = _crypto.subtle.sign(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'sign', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["sign"]);
SubtleCrypto.prototype["unwrapKey"] = function unwrapKey() {
    var res = _crypto.subtle.unwrapKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'unwrapKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["unwrapKey"]);
SubtleCrypto.prototype["verify"] = function verify() {
    var res = _crypto.subtle.verify(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'verify', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["verify"]);
SubtleCrypto.prototype["wrapKey"] = function wrapKey() {
    var res = _crypto.subtle.wrapKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'wrapKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["wrapKey"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////



// 浏览器是没有的, 但是我们要用
mframe.subtleCrypto = {}
mframe.subtleCrypto.__proto__ = SubtleCrypto.prototype;
mframe.subtleCrypto = mframe.proxy(mframe.subtleCrypto);