var Navigator = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(Navigator);

Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true,
    }
});

navigator = {};
///////////////////////////////////////////////////
navigator.userAgent= mframe.memory.config.initNavigator['userAgent']
navigator.language= mframe.memory.config.initNavigator['language']
navigator.languages= mframe.memory.config.initNavigator['languages']
navigator.appVersion= mframe.memory.config.initNavigator['appVersion']
navigator.platform= mframe.memory.config.initNavigator['platform']
navigator.hardwareConcurrency= mframe.memory.config.initNavigator['hardwareConcurrency']
navigator.webdriver= mframe.memory.config.initNavigator['webdriver']
navigator.appName= mframe.memory.config.initNavigator['appName']
navigator.appCodeName= mframe.memory.config.initNavigator['appCodeName']
navigator.deviceMemory= mframe.memory.config.initNavigator['deviceMemory']
navigator.maxTouchPoints= mframe.memory.config.initNavigator['maxTouchPoints']
navigator.onLine= mframe.memory.config.initNavigator['onLine']
navigator.pdfViewerEnabled= mframe.memory.config.initNavigator['pdfViewerEnabled']
navigator.vendor= mframe.memory.config.initNavigator['vendor']
navigator.vendorSub= mframe.memory.config.initNavigator['vendorSub']
navigator.product= mframe.memory.config.initNavigator['product']
navigator.productSub= mframe.memory.config.initNavigator['productSub']
//////////////===ATTRIBUTES==///////////////////////////////
// connection
curMemoryArea.connection_getter = function connection() { return this._connection; }; mframe.safefunction(curMemoryArea.connection_getter);
Object.defineProperty(curMemoryArea.connection_getter, "name", { value: "get connection", configurable: true, });
Object.defineProperty(Navigator.prototype, "connection", { get: curMemoryArea.connection_getter, enumerable: true, configurable: true, });
curMemoryArea.connection_smart_getter = function connection() {
    var res = mframe.networkInformation;
    mframe.log({ flag: 'property', className: 'Navigator', propertyName: 'connection', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.connection_smart_getter);
Navigator.prototype.__defineGetter__("connection", curMemoryArea.connection_smart_getter);


////////////////==FUNCTION==////////////////////////////////
Navigator.prototype["getBattery"] = function getBattery() {
    var res = new Promise();
    mframe.log({ flag: 'function', className: 'Navigator', methodName: 'getBattery', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Navigator.prototype["getBattery"]);
///////////////////////////////////////////////////



navigator.__proto__ = Navigator.prototype;

// // 解决Navigator.prototype.属性抛异常, 只能通过navigator.属性去调用 (本质上可以理解为代理的简写); Navigator中所有属性都是这样的
// for (var prototype_ in Navigator.prototype) {
//     navigator[prototype_] = Navigator.prototype[prototype_];
//     Navigator.prototype.__defineGetter__(prototype_, function () {
//         debugger;// 啥网站啊,这都检测-_-!
//         throw new TypeError('不允许Navigator.prototype.属性 这样的操作')
//     });
// }




navigator = mframe.proxy(navigator)