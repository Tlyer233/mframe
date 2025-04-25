var HTMLHeadElement = function () {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(HTMLHeadElement);

Object.defineProperties(HTMLHeadElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHeadElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////
HTMLHeadElement.__proto__ = HTMLElement;
HTMLHeadElement.prototype.__proto__ = HTMLElement.prototype;


mframe.memory.htmlelements['head'] = function () {
    var head = {};
    head.__proto__ = HTMLHeadElement.prototype;

    //////////{HTMLHeadElement 特有的 属性/方法}//////////////

    /////////////////////////////////////////////////////
    return head;
}