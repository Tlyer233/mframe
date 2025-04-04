var Navigator = function () {
    debugger;
    throw new TypeError('Navigator 不允许被new')
}; mframe.safefunction(Navigator);

Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true,
    }
});

navigator = {};
///////////////////////////////////////////////////
navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36';

navigator.webdriver = false;
navigator.language = 'zh-CN';
navigator.languages = ['zh-CN', 'en', 'zh']

navigator.appVersion = '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
navigator.platform = 'Win32';
navigator.hardwareConcurrency  = 16

///////////////////////////////////////////////////



navigator.__proto__ = Navigator.prototype;

// 解决Navigator.prototype.属性抛异常, 只能通过navigator.属性去调用 (本质上可以理解为代理的简写); Navigator中所有属性都是这样的
for (var prototype_ in Navigator.prototype) {
    navigator[prototype_] = Navigator.prototype[prototype_];
    Navigator.prototype.__defineGetter__(prototype_, function () {
        debugger;// 啥网站啊,这都检测-_-!
        throw new TypeError('不允许Navigator.prototype.属性 这样的操作')
    });
}




navigator = mframe.proxy(navigator)