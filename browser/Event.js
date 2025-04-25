var Event = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(Event);

Object.defineProperties(Event.prototype, {
    [Symbol.toStringTag]: {
        value: "Event",
        configurable: true,
    }
});
/////////////////////////////////////////////
// 如果调用, 通过this.jsdomMemory去调用

/////////////////////////////////////////////

mframe.memory.event = function() {
    event = {}
    event.__proto__=Event.prototype
    return event;
}
Event = mframe.proxy(Event)