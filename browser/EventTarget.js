var EventTarget = function EventTarget() { }; mframe.safefunction(EventTarget)
Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true,
    }
})

// 方法
EventTarget.prototype.addEventListener = function addEventListener() {
    mframe.log({ flag: 'function', className: 'EventTarget', methodName: 'addEventListener', inputVal: arguments, res: undefined });
}; mframe.safefunction(EventTarget.prototype.addEventListener)
EventTarget.prototype.removeEventListener = function removeEventListener() {
    mframe.log({ flag: 'function', className: 'EventTarget', methodName: 'removeEventListener', inputVal: arguments, res: undefined });
}; mframe.safefunction(EventTarget.prototype.removeEventListener)
EventTarget.prototype.dispatchEvent = function dispatchEvent() {
    mframe.log({ flag: 'function', className: 'EventTarget', methodName: 'dispatchEvent', inputVal: arguments, res: undefined });
}; mframe.safefunction(EventTarget.prototype.dispatchEvent)


// 代理
EventTarget = mframe.proxy(EventTarget)