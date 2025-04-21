var Location = function () {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Location);
Object.defineProperties(Location.prototype, {
    [Symbol.toStringTag]: {
        value: "Location",
        configurable: true,
    }
});

location = {
    "ancestorOrigins": mframe.memory.config.initLocation["ancestorOrigins"],
    "href": mframe.memory.config.initLocation["href"],
    "origin": mframe.memory.config.initLocation["origin"],
    "protocol": mframe.memory.config.initLocation["protocol"],
    "host": mframe.memory.config.initLocation["host"],
    "hostname": mframe.memory.config.initLocation["hostname"],
    "port": mframe.memory.config.initLocation["port"],
    "pathname": mframe.memory.config.initLocation["pathname"],
    "search": mframe.memory.config.initLocation["search"],
    "hash": mframe.memory.config.initLocation["hash"]
};
///////////////////////////////////////////////////
// function
location["valueOf"] = function valueOf() {  // 实现 `location+""`调用toString()
    return this;
}; mframe.safefunction(location["valueOf"]);
location["assign"] = function assign() { debugger; }; mframe.safefunction(location["assign"]);    // 跳转
location["reload"] = function reload() { debugger; }; mframe.safefunction(location["reload"]);    // 刷新
location["replace"] = function replace() { debugger; }; mframe.safefunction(location["replace"]); // 跳转(不可返回)
location["toString"] = function toString() {
    return this.href;
}; mframe.safefunction(location["toString"]);
///////////////////////////////////////////////////
location.__proto__ = Location.prototype;
location = mframe.proxy(location)