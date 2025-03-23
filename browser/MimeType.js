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
//===================MimeType 的原型属性 START===================
MimeType.prototype.type = "";
MimeType.prototype.suffixes = "";
MimeType.prototype.description = "";
MimeType.prototype.enabledPlugin = mframe.proxy(class enabledPlugin { });
//================ ↑↑↑MimeType 的原型属性 END↑↑↑ ================
//////////////////////////////////


/**代理 */
MimeType = mframe.proxy(MimeType)