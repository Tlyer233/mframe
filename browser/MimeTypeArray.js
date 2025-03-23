var MimeTypeArray = function MimeTypeArray() {
    debugger;
    throw new TypeError('MimeTypeArray  不允许被new');
}; mframe.safefunction(MimeTypeArray)
Object.defineProperties(MimeTypeArray.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeTypeArray ",
        configurable: true,
    }
})

mimeTypes= {}
//////////////////////////////////
mimeTypes.length = 2; 
//////////////////////////////////

mimeTypes.__proto__ = MimeTypeArray.prototype;
/**代理 */
mimeTypes = mframe.proxy(mimeTypes)
