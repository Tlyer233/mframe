var HTMLCanvasElement = function () {
    debugger;
    throw new TypeError('HTMLCanvasElement 不允许被new')
}; mframe.safefunction(HTMLCanvasElement);

Object.defineProperties(HTMLCanvasElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLCanvasElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////
HTMLCanvasElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['canvas'] = function () {
    var canvas = new (function () { }); 
    canvas.__proto__ = HTMLCanvasElement.prototype;

    //////////{HTMLCanvasElement 特有的 属性/方法}//////////////
    
    /////////////////////////////////////////////////////
    return canvas;
}