var HTMLHeadElement = function () {
    debugger;
    throw new TypeError('HTMLHeadElement 不允许被new')
}; mframe.safefunction(HTMLHeadElement);

Object.defineProperties(HTMLHeadElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHeadElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
HTMLHeadElement.prototype.childElementCount = 169; // TODO暂时这样写
///////////////////////////////////////////////////
HTMLHeadElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['head'] = function () {
    var head = new (function () { });
    head.__proto__ = HTMLHeadElement.prototype;

    //////////{HTMLHeadElement 特有的 属性/方法}//////////////
    head.profile = ""; // 表示一个或多个元数据配置文件的 URI 的字符串（以空格分隔）
    /////////////////////////////////////////////////////
    return head;
}