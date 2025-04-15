var HTMLDocument = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLDocument);

Object.defineProperties(HTMLDocument.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDocument",
        configurable: true,
    }
});
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////



// 如果调用 mframe.memory.htmlelements['document'], 就返回 HTMLDocument
mframe.memory.htmlelements['document'] = function () {
    var document = new (function () { }); // new一个假的,通过换原型,换为HTMLDocument去实现
    HTMLDocument.prototype.__proto__ = Document.prototype;
    document.__proto__ = HTMLDocument.prototype;

    //////////{HTMLDocument特有的 属性/方法}//////////////
    //////////////////////////////////////////////////////
    return document;
}