var HTMLBodyElement = function () {
    debugger;
    throw new TypeError('HTMLBodyElement 不允许被new')
}; mframe.safefunction(HTMLBodyElement);

Object.defineProperties(HTMLBodyElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLBodyElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
HTMLBodyElement.prototype.childElementCount = 12; // TODO暂时这样写
///////////////////////////////////////////////////
HTMLBodyElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['head'] = function () {
    var head = new (function () { });
    head.__proto__ = HTMLBodyElement.prototype;

    //////////{HTMLBodyElement 特有的 属性/方法}//////////////
    // TODO 有点多,懒得补
    /////////////////////////////////////////////////////
    return head;
}