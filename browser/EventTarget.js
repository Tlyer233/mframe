var EventTarget = function EventTarget() { }; mframe.safefunction(EventTarget)
Object.defineProperties(EventTarget.prototype, {
    [Symbol.toStringTag]: {
        value: "EventTarget",
        configurable: true,
    }
})

// 方法
EventTarget.prototype.addEventListener = function addEventListener() { debugger }; mframe.safefunction(EventTarget.prototype.addEventListener)
EventTarget.prototype.removeEventListener = function removeEventListener() { debugger }; mframe.safefunction(EventTarget.prototype.removeEventListener)
EventTarget.prototype.dispatchEvent = function dispatchEvent() { debugger }; mframe.safefunction(EventTarget.prototype.dispatchEvent)


// 代理
EventTarget=mframe.proxy(EventTarget)