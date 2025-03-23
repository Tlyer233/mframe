var HTMLScriptElement = function () {
    debugger;
    throw new TypeError('HTMLScriptElement 不允许被new')
}; mframe.safefunction(HTMLScriptElement);

Object.defineProperties(HTMLScriptElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLScriptElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////

HTMLScriptElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['script'] = function () {
    var script = new (function () { });
    script.__proto__ = HTMLScriptElement.prototype;

    //////////{HTMLScriptElement 特有的 属性/方法}//////////////
    // 无,都是从父类继承的
    /////////////////////////////////////////////////////
    return script;
}