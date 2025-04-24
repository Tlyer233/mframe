var TextHTMLTemplateElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(TextHTMLTemplateElement);

Object.defineProperties(TextHTMLTemplateElement.prototype, {
    [Symbol.toStringTag]: {
        value: "TextHTMLTemplateElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////


TextHTMLTemplateElement.__proto__ = HTMLElement;
TextHTMLTemplateElement.prototype.__proto__ = HTMLElement.prototype;


mframe.memory.htmlelements['template'] = function () {
    var template = new (function () { });
    template.__proto__ = TextHTMLTemplateElement.prototype;
    return template;
}