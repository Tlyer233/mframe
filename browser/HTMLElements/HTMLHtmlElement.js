var HTMLHtmlElement = function HTMLHtmlElement() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(HTMLHtmlElement)

Object.defineProperties(HTMLHtmlElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHtmlElement",
        configurable: true,
    }
})


//////////////////////////////////

//////////////////////////////////

HTMLHtmlElement .prototype.__proto__ = HTMLElement.prototype;
/**代理 */

// HTMLHtmlElement  = mframe.proxy(HTMLHtmlElement )