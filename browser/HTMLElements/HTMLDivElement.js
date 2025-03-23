var HTMLDivElement = function () {
    debugger;
    throw new TypeError('HTMLDivElement 不允许被new')
}; mframe.safefunction(HTMLDivElement);

Object.defineProperties(HTMLDivElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDivElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////

HTMLDivElement.prototype.__proto__ = HTMLElement.prototype;

// 如果调用 mframe.memory.htmlelements['div'], 就返回 HTMLDivElement
mframe.memory.htmlelements['div'] = function () {
    var div = new (function () { }); // new一个假的,通过换原型,换为HTMLDivElement去实现
    div.__proto__ = HTMLDivElement.prototype;

    //////////{HTMLDivElement特有的 属性/方法}//////////////
    div.align = "";
    /////////////////////////////////////////////////////
    return div;
}