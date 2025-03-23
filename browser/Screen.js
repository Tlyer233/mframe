var Screen = function Screen() {
    debugger;
    throw new TypeError('Screen 不允许被new');
}; mframe.safefunction(Screen)
Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true,
    }
})

screen = {}
//////////////////////////////////

//////////////////////////////////
screen.__proto__ = Screen.prototype;

/**代理 */
Screen = mframe.proxy(Screen)