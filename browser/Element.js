var Element = function Element() {
    debugger;
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Element)

Object.defineProperties(Element.prototype, {
    [Symbol.toStringTag]: {
        value: "Element",
        configurable: true,
    }
})

// 使用JSDOM的Element原型
var jsdomElement = Object.getPrototypeOf(_jsdom_document.documentElement);
// 复制JSDOM Element的关键方法和属性到我们的Element原型
for (let prop of Object.getOwnPropertyNames(jsdomElement)) {
    if (prop !== 'constructor' && prop !== '__proto__') {
        try {
            let descriptor = Object.getOwnPropertyDescriptor(jsdomElement, prop);
            if (descriptor && !Object.getOwnPropertyDescriptor(Element.prototype, prop)) {
                Object.defineProperty(Element.prototype, prop, descriptor);
            }
        } catch (e) {
            console.log(`无法复制属性: ${prop}`, e);
        }
    }
}

//////////////////////////////////
var curMemoryArea = mframe.memory.Element = {};

//============== Constant START ==================
Object.defineProperty(Element, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Element, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// namespaceURI
curMemoryArea.namespaceURI_getter = function namespaceURI() { debugger; }; mframe.safefunction(curMemoryArea.namespaceURI_getter);
Object.defineProperty(curMemoryArea.namespaceURI_getter, "name", { value: "get namespaceURI", configurable: true, });
Object.defineProperty(Element.prototype, "namespaceURI", { get: curMemoryArea.namespaceURI_getter, enumerable: true, configurable: true, });
curMemoryArea.namespaceURI_smart_getter = function namespaceURI() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的namespaceURI的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.namespaceURI_smart_getter);
Element.prototype.__defineGetter__("namespaceURI", curMemoryArea.namespaceURI_smart_getter);

// prefix
curMemoryArea.prefix_getter = function prefix() { debugger; }; mframe.safefunction(curMemoryArea.prefix_getter);
Object.defineProperty(curMemoryArea.prefix_getter, "name", { value: "get prefix", configurable: true, });
Object.defineProperty(Element.prototype, "prefix", { get: curMemoryArea.prefix_getter, enumerable: true, configurable: true, });
curMemoryArea.prefix_smart_getter = function prefix() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的prefix的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.prefix_smart_getter);
Element.prototype.__defineGetter__("prefix", curMemoryArea.prefix_smart_getter);

// localName
curMemoryArea.localName_getter = function localName() { debugger; }; mframe.safefunction(curMemoryArea.localName_getter);
Object.defineProperty(curMemoryArea.localName_getter, "name", { value: "get localName", configurable: true, });
Object.defineProperty(Element.prototype, "localName", { get: curMemoryArea.localName_getter, enumerable: true, configurable: true, });
curMemoryArea.localName_smart_getter = function localName() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的localName的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.localName_smart_getter);
Element.prototype.__defineGetter__("localName", curMemoryArea.localName_smart_getter);

// tagName
curMemoryArea.tagName_getter = function tagName() { debugger; }; mframe.safefunction(curMemoryArea.tagName_getter);
Object.defineProperty(curMemoryArea.tagName_getter, "name", { value: "get tagName", configurable: true, });
Object.defineProperty(Element.prototype, "tagName", { get: curMemoryArea.tagName_getter, enumerable: true, configurable: true, });
curMemoryArea.tagName_smart_getter = function tagName() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的tagName的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.tagName_smart_getter);
Element.prototype.__defineGetter__("tagName", curMemoryArea.tagName_smart_getter);

// id
curMemoryArea.id_getter = function id() { debugger; }; mframe.safefunction(curMemoryArea.id_getter);
Object.defineProperty(curMemoryArea.id_getter, "name", { value: "get id", configurable: true, });
// id
curMemoryArea.id_setter = function id(val) { debugger; }; mframe.safefunction(curMemoryArea.id_setter);
Object.defineProperty(curMemoryArea.id_setter, "name", { value: "set id", configurable: true, });
Object.defineProperty(Element.prototype, "id", { get: curMemoryArea.id_getter, set: curMemoryArea.id_setter, enumerable: true, configurable: true, });
curMemoryArea.id_smart_getter = function id() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的id的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.id_smart_getter);
Element.prototype.__defineGetter__("id", curMemoryArea.id_smart_getter);

// className
curMemoryArea.className_getter = function className() { debugger; }; mframe.safefunction(curMemoryArea.className_getter);
Object.defineProperty(curMemoryArea.className_getter, "name", { value: "get className", configurable: true, });
// className
curMemoryArea.className_setter = function className(val) { debugger; }; mframe.safefunction(curMemoryArea.className_setter);
Object.defineProperty(curMemoryArea.className_setter, "name", { value: "set className", configurable: true, });
Object.defineProperty(Element.prototype, "className", { get: curMemoryArea.className_getter, set: curMemoryArea.className_setter, enumerable: true, configurable: true, });
curMemoryArea.className_smart_getter = function className() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的className的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.className_smart_getter);
Element.prototype.__defineGetter__("className", curMemoryArea.className_smart_getter);

// classList
curMemoryArea.classList_getter = function classList() { debugger; }; mframe.safefunction(curMemoryArea.classList_getter);
Object.defineProperty(curMemoryArea.classList_getter, "name", { value: "get classList", configurable: true, });
// classList
curMemoryArea.classList_setter = function classList(val) { debugger; }; mframe.safefunction(curMemoryArea.classList_setter);
Object.defineProperty(curMemoryArea.classList_setter, "name", { value: "set classList", configurable: true, });
Object.defineProperty(Element.prototype, "classList", { get: curMemoryArea.classList_getter, set: curMemoryArea.classList_setter, enumerable: true, configurable: true, });
curMemoryArea.classList_smart_getter = function classList() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的classList的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.classList_smart_getter);
Element.prototype.__defineGetter__("classList", curMemoryArea.classList_smart_getter);

// slot
curMemoryArea.slot_getter = function slot() { debugger; }; mframe.safefunction(curMemoryArea.slot_getter);
Object.defineProperty(curMemoryArea.slot_getter, "name", { value: "get slot", configurable: true, });
// slot
curMemoryArea.slot_setter = function slot(val) { debugger; }; mframe.safefunction(curMemoryArea.slot_setter);
Object.defineProperty(curMemoryArea.slot_setter, "name", { value: "set slot", configurable: true, });
Object.defineProperty(Element.prototype, "slot", { get: curMemoryArea.slot_getter, set: curMemoryArea.slot_setter, enumerable: true, configurable: true, });
curMemoryArea.slot_smart_getter = function slot() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的slot的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.slot_smart_getter);
Element.prototype.__defineGetter__("slot", curMemoryArea.slot_smart_getter);

// attributes
curMemoryArea.attributes_getter = function attributes() { debugger; }; mframe.safefunction(curMemoryArea.attributes_getter);
Object.defineProperty(curMemoryArea.attributes_getter, "name", { value: "get attributes", configurable: true, });
Object.defineProperty(Element.prototype, "attributes", { get: curMemoryArea.attributes_getter, enumerable: true, configurable: true, });
curMemoryArea.attributes_smart_getter = function attributes() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的attributes的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.attributes_smart_getter);
Element.prototype.__defineGetter__("attributes", curMemoryArea.attributes_smart_getter);

// shadowRoot
curMemoryArea.shadowRoot_getter = function shadowRoot() { debugger; }; mframe.safefunction(curMemoryArea.shadowRoot_getter);
Object.defineProperty(curMemoryArea.shadowRoot_getter, "name", { value: "get shadowRoot", configurable: true, });
Object.defineProperty(Element.prototype, "shadowRoot", { get: curMemoryArea.shadowRoot_getter, enumerable: true, configurable: true, });
curMemoryArea.shadowRoot_smart_getter = function shadowRoot() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的shadowRoot的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.shadowRoot_smart_getter);
Element.prototype.__defineGetter__("shadowRoot", curMemoryArea.shadowRoot_smart_getter);

// part
curMemoryArea.part_getter = function part() { debugger; }; mframe.safefunction(curMemoryArea.part_getter);
Object.defineProperty(curMemoryArea.part_getter, "name", { value: "get part", configurable: true, });
// part
curMemoryArea.part_setter = function part(val) { debugger; }; mframe.safefunction(curMemoryArea.part_setter);
Object.defineProperty(curMemoryArea.part_setter, "name", { value: "set part", configurable: true, });
Object.defineProperty(Element.prototype, "part", { get: curMemoryArea.part_getter, set: curMemoryArea.part_setter, enumerable: true, configurable: true, });
curMemoryArea.part_smart_getter = function part() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的part的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.part_smart_getter);
Element.prototype.__defineGetter__("part", curMemoryArea.part_smart_getter);

// assignedSlot
curMemoryArea.assignedSlot_getter = function assignedSlot() { debugger; }; mframe.safefunction(curMemoryArea.assignedSlot_getter);
Object.defineProperty(curMemoryArea.assignedSlot_getter, "name", { value: "get assignedSlot", configurable: true, });
Object.defineProperty(Element.prototype, "assignedSlot", { get: curMemoryArea.assignedSlot_getter, enumerable: true, configurable: true, });
curMemoryArea.assignedSlot_smart_getter = function assignedSlot() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的assignedSlot的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.assignedSlot_smart_getter);
Element.prototype.__defineGetter__("assignedSlot", curMemoryArea.assignedSlot_smart_getter);

// innerHTML
curMemoryArea.innerHTML_getter = function innerHTML() { 
    // 如果有关联的JSDOM元素，使用它的innerHTML
    if (this._jsdom_element) {
        return this._jsdom_element.innerHTML;
    }
    // 否则返回存储的值或默认值
    return this._innerHTML || "";
}; mframe.safefunction(curMemoryArea.innerHTML_getter);
Object.defineProperty(curMemoryArea.innerHTML_getter, "name", { value: "get innerHTML", configurable: true, });

// innerHTML
curMemoryArea.innerHTML_setter = function innerHTML(val) {
    console.log("Element innerHTML_setter: ", val);
    // 使用JSDOM的innerHTML实现
    if (this._jsdom_element) {
        this._jsdom_element.innerHTML = val;
    }
    // 同时存储在我们的对象中
    this._innerHTML = val;
}; mframe.safefunction(curMemoryArea.innerHTML_setter);
Object.defineProperty(curMemoryArea.innerHTML_setter, "name", { value: "set innerHTML", configurable: true, });
Object.defineProperty(Element.prototype, "innerHTML", { 
    get: curMemoryArea.innerHTML_getter, 
    set: curMemoryArea.innerHTML_setter, 
    enumerable: true, 
    configurable: true 
});

// 覆盖smart_getter，使用我们的实现
Element.prototype.__defineGetter__("innerHTML", curMemoryArea.innerHTML_getter);

// outerHTML
curMemoryArea.outerHTML_getter = function outerHTML() { debugger; }; mframe.safefunction(curMemoryArea.outerHTML_getter);
Object.defineProperty(curMemoryArea.outerHTML_getter, "name", { value: "get outerHTML", configurable: true, });
// outerHTML
curMemoryArea.outerHTML_setter = function outerHTML(val) { debugger; }; mframe.safefunction(curMemoryArea.outerHTML_setter);
Object.defineProperty(curMemoryArea.outerHTML_setter, "name", { value: "set outerHTML", configurable: true, });
Object.defineProperty(Element.prototype, "outerHTML", { get: curMemoryArea.outerHTML_getter, set: curMemoryArea.outerHTML_setter, enumerable: true, configurable: true, });
curMemoryArea.outerHTML_smart_getter = function outerHTML() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的outerHTML的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.outerHTML_smart_getter);
Element.prototype.__defineGetter__("outerHTML", curMemoryArea.outerHTML_smart_getter);

// scrollTop
curMemoryArea.scrollTop_getter = function scrollTop() { debugger; }; mframe.safefunction(curMemoryArea.scrollTop_getter);
Object.defineProperty(curMemoryArea.scrollTop_getter, "name", { value: "get scrollTop", configurable: true, });
// scrollTop
curMemoryArea.scrollTop_setter = function scrollTop(val) { debugger; }; mframe.safefunction(curMemoryArea.scrollTop_setter);
Object.defineProperty(curMemoryArea.scrollTop_setter, "name", { value: "set scrollTop", configurable: true, });
Object.defineProperty(Element.prototype, "scrollTop", { get: curMemoryArea.scrollTop_getter, set: curMemoryArea.scrollTop_setter, enumerable: true, configurable: true, });
curMemoryArea.scrollTop_smart_getter = function scrollTop() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的scrollTop的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollTop_smart_getter);
Element.prototype.__defineGetter__("scrollTop", curMemoryArea.scrollTop_smart_getter);

// scrollLeft
curMemoryArea.scrollLeft_getter = function scrollLeft() { debugger; }; mframe.safefunction(curMemoryArea.scrollLeft_getter);
Object.defineProperty(curMemoryArea.scrollLeft_getter, "name", { value: "get scrollLeft", configurable: true, });
// scrollLeft
curMemoryArea.scrollLeft_setter = function scrollLeft(val) { debugger; }; mframe.safefunction(curMemoryArea.scrollLeft_setter);
Object.defineProperty(curMemoryArea.scrollLeft_setter, "name", { value: "set scrollLeft", configurable: true, });
Object.defineProperty(Element.prototype, "scrollLeft", { get: curMemoryArea.scrollLeft_getter, set: curMemoryArea.scrollLeft_setter, enumerable: true, configurable: true, });
curMemoryArea.scrollLeft_smart_getter = function scrollLeft() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的scrollLeft的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollLeft_smart_getter);
Element.prototype.__defineGetter__("scrollLeft", curMemoryArea.scrollLeft_smart_getter);

// scrollWidth
curMemoryArea.scrollWidth_getter = function scrollWidth() { debugger; }; mframe.safefunction(curMemoryArea.scrollWidth_getter);
Object.defineProperty(curMemoryArea.scrollWidth_getter, "name", { value: "get scrollWidth", configurable: true, });
Object.defineProperty(Element.prototype, "scrollWidth", { get: curMemoryArea.scrollWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollWidth_smart_getter = function scrollWidth() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的scrollWidth的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollWidth_smart_getter);
Element.prototype.__defineGetter__("scrollWidth", curMemoryArea.scrollWidth_smart_getter);

// scrollHeight
curMemoryArea.scrollHeight_getter = function scrollHeight() { debugger; }; mframe.safefunction(curMemoryArea.scrollHeight_getter);
Object.defineProperty(curMemoryArea.scrollHeight_getter, "name", { value: "get scrollHeight", configurable: true, });
Object.defineProperty(Element.prototype, "scrollHeight", { get: curMemoryArea.scrollHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollHeight_smart_getter = function scrollHeight() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的scrollHeight的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.scrollHeight_smart_getter);
Element.prototype.__defineGetter__("scrollHeight", curMemoryArea.scrollHeight_smart_getter);

// clientTop
curMemoryArea.clientTop_getter = function clientTop() { debugger; }; mframe.safefunction(curMemoryArea.clientTop_getter);
Object.defineProperty(curMemoryArea.clientTop_getter, "name", { value: "get clientTop", configurable: true, });
Object.defineProperty(Element.prototype, "clientTop", { get: curMemoryArea.clientTop_getter, enumerable: true, configurable: true, });
curMemoryArea.clientTop_smart_getter = function clientTop() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的clientTop的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.clientTop_smart_getter);
Element.prototype.__defineGetter__("clientTop", curMemoryArea.clientTop_smart_getter);

// clientLeft
curMemoryArea.clientLeft_getter = function clientLeft() { debugger; }; mframe.safefunction(curMemoryArea.clientLeft_getter);
Object.defineProperty(curMemoryArea.clientLeft_getter, "name", { value: "get clientLeft", configurable: true, });
Object.defineProperty(Element.prototype, "clientLeft", { get: curMemoryArea.clientLeft_getter, enumerable: true, configurable: true, });
curMemoryArea.clientLeft_smart_getter = function clientLeft() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的clientLeft的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.clientLeft_smart_getter);
Element.prototype.__defineGetter__("clientLeft", curMemoryArea.clientLeft_smart_getter);

// clientWidth
curMemoryArea.clientWidth_getter = function clientWidth() { debugger; }; mframe.safefunction(curMemoryArea.clientWidth_getter);
Object.defineProperty(curMemoryArea.clientWidth_getter, "name", { value: "get clientWidth", configurable: true, });
Object.defineProperty(Element.prototype, "clientWidth", { get: curMemoryArea.clientWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.clientWidth_smart_getter = function clientWidth() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的clientWidth的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.clientWidth_smart_getter);
Element.prototype.__defineGetter__("clientWidth", curMemoryArea.clientWidth_smart_getter);

// clientHeight
curMemoryArea.clientHeight_getter = function clientHeight() { debugger; }; mframe.safefunction(curMemoryArea.clientHeight_getter);
Object.defineProperty(curMemoryArea.clientHeight_getter, "name", { value: "get clientHeight", configurable: true, });
Object.defineProperty(Element.prototype, "clientHeight", { get: curMemoryArea.clientHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.clientHeight_smart_getter = function clientHeight() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的clientHeight的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.clientHeight_smart_getter);
Element.prototype.__defineGetter__("clientHeight", curMemoryArea.clientHeight_smart_getter);

// onbeforecopy
curMemoryArea.onbeforecopy_getter = function onbeforecopy() { debugger; }; mframe.safefunction(curMemoryArea.onbeforecopy_getter);
Object.defineProperty(curMemoryArea.onbeforecopy_getter, "name", { value: "get onbeforecopy", configurable: true, });
// onbeforecopy
curMemoryArea.onbeforecopy_setter = function onbeforecopy(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforecopy_setter);
Object.defineProperty(curMemoryArea.onbeforecopy_setter, "name", { value: "set onbeforecopy", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforecopy", { get: curMemoryArea.onbeforecopy_getter, set: curMemoryArea.onbeforecopy_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecopy_smart_getter = function onbeforecopy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onbeforecopy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforecopy_smart_getter);
Element.prototype.__defineGetter__("onbeforecopy", curMemoryArea.onbeforecopy_smart_getter);

// onbeforecut
curMemoryArea.onbeforecut_getter = function onbeforecut() { debugger; }; mframe.safefunction(curMemoryArea.onbeforecut_getter);
Object.defineProperty(curMemoryArea.onbeforecut_getter, "name", { value: "get onbeforecut", configurable: true, });
// onbeforecut
curMemoryArea.onbeforecut_setter = function onbeforecut(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforecut_setter);
Object.defineProperty(curMemoryArea.onbeforecut_setter, "name", { value: "set onbeforecut", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforecut", { get: curMemoryArea.onbeforecut_getter, set: curMemoryArea.onbeforecut_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecut_smart_getter = function onbeforecut() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onbeforecut的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforecut_smart_getter);
Element.prototype.__defineGetter__("onbeforecut", curMemoryArea.onbeforecut_smart_getter);

// onbeforepaste
curMemoryArea.onbeforepaste_getter = function onbeforepaste() { debugger; }; mframe.safefunction(curMemoryArea.onbeforepaste_getter);
Object.defineProperty(curMemoryArea.onbeforepaste_getter, "name", { value: "get onbeforepaste", configurable: true, });
// onbeforepaste
curMemoryArea.onbeforepaste_setter = function onbeforepaste(val) { debugger; }; mframe.safefunction(curMemoryArea.onbeforepaste_setter);
Object.defineProperty(curMemoryArea.onbeforepaste_setter, "name", { value: "set onbeforepaste", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforepaste", { get: curMemoryArea.onbeforepaste_getter, set: curMemoryArea.onbeforepaste_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforepaste_smart_getter = function onbeforepaste() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onbeforepaste的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onbeforepaste_smart_getter);
Element.prototype.__defineGetter__("onbeforepaste", curMemoryArea.onbeforepaste_smart_getter);

// onsearch
curMemoryArea.onsearch_getter = function onsearch() { debugger; }; mframe.safefunction(curMemoryArea.onsearch_getter);
Object.defineProperty(curMemoryArea.onsearch_getter, "name", { value: "get onsearch", configurable: true, });
// onsearch
curMemoryArea.onsearch_setter = function onsearch(val) { debugger; }; mframe.safefunction(curMemoryArea.onsearch_setter);
Object.defineProperty(curMemoryArea.onsearch_setter, "name", { value: "set onsearch", configurable: true, });
Object.defineProperty(Element.prototype, "onsearch", { get: curMemoryArea.onsearch_getter, set: curMemoryArea.onsearch_setter, enumerable: true, configurable: true, });
curMemoryArea.onsearch_smart_getter = function onsearch() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onsearch的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onsearch_smart_getter);
Element.prototype.__defineGetter__("onsearch", curMemoryArea.onsearch_smart_getter);

// elementTiming
curMemoryArea.elementTiming_getter = function elementTiming() { debugger; }; mframe.safefunction(curMemoryArea.elementTiming_getter);
Object.defineProperty(curMemoryArea.elementTiming_getter, "name", { value: "get elementTiming", configurable: true, });
// elementTiming
curMemoryArea.elementTiming_setter = function elementTiming(val) { debugger; }; mframe.safefunction(curMemoryArea.elementTiming_setter);
Object.defineProperty(curMemoryArea.elementTiming_setter, "name", { value: "set elementTiming", configurable: true, });
Object.defineProperty(Element.prototype, "elementTiming", { get: curMemoryArea.elementTiming_getter, set: curMemoryArea.elementTiming_setter, enumerable: true, configurable: true, });
curMemoryArea.elementTiming_smart_getter = function elementTiming() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的elementTiming的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.elementTiming_smart_getter);
Element.prototype.__defineGetter__("elementTiming", curMemoryArea.elementTiming_smart_getter);

// onfullscreenchange
curMemoryArea.onfullscreenchange_getter = function onfullscreenchange() { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onfullscreenchange_getter, "name", { value: "get onfullscreenchange", configurable: true, });
// onfullscreenchange
curMemoryArea.onfullscreenchange_setter = function onfullscreenchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onfullscreenchange_setter, "name", { value: "set onfullscreenchange", configurable: true, });
Object.defineProperty(Element.prototype, "onfullscreenchange", { get: curMemoryArea.onfullscreenchange_getter, set: curMemoryArea.onfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenchange_smart_getter = function onfullscreenchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onfullscreenchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfullscreenchange_smart_getter);
Element.prototype.__defineGetter__("onfullscreenchange", curMemoryArea.onfullscreenchange_smart_getter);

// onfullscreenerror
curMemoryArea.onfullscreenerror_getter = function onfullscreenerror() { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onfullscreenerror_getter, "name", { value: "get onfullscreenerror", configurable: true, });
// onfullscreenerror
curMemoryArea.onfullscreenerror_setter = function onfullscreenerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onfullscreenerror_setter, "name", { value: "set onfullscreenerror", configurable: true, });
Object.defineProperty(Element.prototype, "onfullscreenerror", { get: curMemoryArea.onfullscreenerror_getter, set: curMemoryArea.onfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenerror_smart_getter = function onfullscreenerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onfullscreenerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onfullscreenerror_smart_getter);
Element.prototype.__defineGetter__("onfullscreenerror", curMemoryArea.onfullscreenerror_smart_getter);

// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_getter = function onwebkitfullscreenchange() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_getter, "name", { value: "get onwebkitfullscreenchange", configurable: true, });
// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_setter = function onwebkitfullscreenchange(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_setter, "name", { value: "set onwebkitfullscreenchange", configurable: true, });
Object.defineProperty(Element.prototype, "onwebkitfullscreenchange", { get: curMemoryArea.onwebkitfullscreenchange_getter, set: curMemoryArea.onwebkitfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenchange_smart_getter = function onwebkitfullscreenchange() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onwebkitfullscreenchange的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_smart_getter);
Element.prototype.__defineGetter__("onwebkitfullscreenchange", curMemoryArea.onwebkitfullscreenchange_smart_getter);

// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_getter = function onwebkitfullscreenerror() { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_getter, "name", { value: "get onwebkitfullscreenerror", configurable: true, });
// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_setter = function onwebkitfullscreenerror(val) { debugger; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_setter, "name", { value: "set onwebkitfullscreenerror", configurable: true, });
Object.defineProperty(Element.prototype, "onwebkitfullscreenerror", { get: curMemoryArea.onwebkitfullscreenerror_getter, set: curMemoryArea.onwebkitfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenerror_smart_getter = function onwebkitfullscreenerror() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的onwebkitfullscreenerror的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_smart_getter);
Element.prototype.__defineGetter__("onwebkitfullscreenerror", curMemoryArea.onwebkitfullscreenerror_smart_getter);

// role
curMemoryArea.role_getter = function role() { debugger; }; mframe.safefunction(curMemoryArea.role_getter);
Object.defineProperty(curMemoryArea.role_getter, "name", { value: "get role", configurable: true, });
// role
curMemoryArea.role_setter = function role(val) { debugger; }; mframe.safefunction(curMemoryArea.role_setter);
Object.defineProperty(curMemoryArea.role_setter, "name", { value: "set role", configurable: true, });
Object.defineProperty(Element.prototype, "role", { get: curMemoryArea.role_getter, set: curMemoryArea.role_setter, enumerable: true, configurable: true, });
curMemoryArea.role_smart_getter = function role() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的role的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.role_smart_getter);
Element.prototype.__defineGetter__("role", curMemoryArea.role_smart_getter);

// ariaAtomic
curMemoryArea.ariaAtomic_getter = function ariaAtomic() { debugger; }; mframe.safefunction(curMemoryArea.ariaAtomic_getter);
Object.defineProperty(curMemoryArea.ariaAtomic_getter, "name", { value: "get ariaAtomic", configurable: true, });
// ariaAtomic
curMemoryArea.ariaAtomic_setter = function ariaAtomic(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaAtomic_setter);
Object.defineProperty(curMemoryArea.ariaAtomic_setter, "name", { value: "set ariaAtomic", configurable: true, });
Object.defineProperty(Element.prototype, "ariaAtomic", { get: curMemoryArea.ariaAtomic_getter, set: curMemoryArea.ariaAtomic_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaAtomic_smart_getter = function ariaAtomic() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaAtomic的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaAtomic_smart_getter);
Element.prototype.__defineGetter__("ariaAtomic", curMemoryArea.ariaAtomic_smart_getter);

// ariaAutoComplete
curMemoryArea.ariaAutoComplete_getter = function ariaAutoComplete() { debugger; }; mframe.safefunction(curMemoryArea.ariaAutoComplete_getter);
Object.defineProperty(curMemoryArea.ariaAutoComplete_getter, "name", { value: "get ariaAutoComplete", configurable: true, });
// ariaAutoComplete
curMemoryArea.ariaAutoComplete_setter = function ariaAutoComplete(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaAutoComplete_setter);
Object.defineProperty(curMemoryArea.ariaAutoComplete_setter, "name", { value: "set ariaAutoComplete", configurable: true, });
Object.defineProperty(Element.prototype, "ariaAutoComplete", { get: curMemoryArea.ariaAutoComplete_getter, set: curMemoryArea.ariaAutoComplete_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaAutoComplete_smart_getter = function ariaAutoComplete() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaAutoComplete的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaAutoComplete_smart_getter);
Element.prototype.__defineGetter__("ariaAutoComplete", curMemoryArea.ariaAutoComplete_smart_getter);

// ariaBusy
curMemoryArea.ariaBusy_getter = function ariaBusy() { debugger; }; mframe.safefunction(curMemoryArea.ariaBusy_getter);
Object.defineProperty(curMemoryArea.ariaBusy_getter, "name", { value: "get ariaBusy", configurable: true, });
// ariaBusy
curMemoryArea.ariaBusy_setter = function ariaBusy(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaBusy_setter);
Object.defineProperty(curMemoryArea.ariaBusy_setter, "name", { value: "set ariaBusy", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBusy", { get: curMemoryArea.ariaBusy_getter, set: curMemoryArea.ariaBusy_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBusy_smart_getter = function ariaBusy() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaBusy的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaBusy_smart_getter);
Element.prototype.__defineGetter__("ariaBusy", curMemoryArea.ariaBusy_smart_getter);

// ariaBrailleLabel
curMemoryArea.ariaBrailleLabel_getter = function ariaBrailleLabel() { debugger; }; mframe.safefunction(curMemoryArea.ariaBrailleLabel_getter);
Object.defineProperty(curMemoryArea.ariaBrailleLabel_getter, "name", { value: "get ariaBrailleLabel", configurable: true, });
// ariaBrailleLabel
curMemoryArea.ariaBrailleLabel_setter = function ariaBrailleLabel(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaBrailleLabel_setter);
Object.defineProperty(curMemoryArea.ariaBrailleLabel_setter, "name", { value: "set ariaBrailleLabel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBrailleLabel", { get: curMemoryArea.ariaBrailleLabel_getter, set: curMemoryArea.ariaBrailleLabel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBrailleLabel_smart_getter = function ariaBrailleLabel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaBrailleLabel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaBrailleLabel_smart_getter);
Element.prototype.__defineGetter__("ariaBrailleLabel", curMemoryArea.ariaBrailleLabel_smart_getter);

// ariaBrailleRoleDescription
curMemoryArea.ariaBrailleRoleDescription_getter = function ariaBrailleRoleDescription() { debugger; }; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_getter);
Object.defineProperty(curMemoryArea.ariaBrailleRoleDescription_getter, "name", { value: "get ariaBrailleRoleDescription", configurable: true, });
// ariaBrailleRoleDescription
curMemoryArea.ariaBrailleRoleDescription_setter = function ariaBrailleRoleDescription(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_setter);
Object.defineProperty(curMemoryArea.ariaBrailleRoleDescription_setter, "name", { value: "set ariaBrailleRoleDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBrailleRoleDescription", { get: curMemoryArea.ariaBrailleRoleDescription_getter, set: curMemoryArea.ariaBrailleRoleDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBrailleRoleDescription_smart_getter = function ariaBrailleRoleDescription() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaBrailleRoleDescription的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_smart_getter);
Element.prototype.__defineGetter__("ariaBrailleRoleDescription", curMemoryArea.ariaBrailleRoleDescription_smart_getter);

// ariaChecked
curMemoryArea.ariaChecked_getter = function ariaChecked() { debugger; }; mframe.safefunction(curMemoryArea.ariaChecked_getter);
Object.defineProperty(curMemoryArea.ariaChecked_getter, "name", { value: "get ariaChecked", configurable: true, });
// ariaChecked
curMemoryArea.ariaChecked_setter = function ariaChecked(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaChecked_setter);
Object.defineProperty(curMemoryArea.ariaChecked_setter, "name", { value: "set ariaChecked", configurable: true, });
Object.defineProperty(Element.prototype, "ariaChecked", { get: curMemoryArea.ariaChecked_getter, set: curMemoryArea.ariaChecked_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaChecked_smart_getter = function ariaChecked() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaChecked的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaChecked_smart_getter);
Element.prototype.__defineGetter__("ariaChecked", curMemoryArea.ariaChecked_smart_getter);

// ariaColCount
curMemoryArea.ariaColCount_getter = function ariaColCount() { debugger; }; mframe.safefunction(curMemoryArea.ariaColCount_getter);
Object.defineProperty(curMemoryArea.ariaColCount_getter, "name", { value: "get ariaColCount", configurable: true, });
// ariaColCount
curMemoryArea.ariaColCount_setter = function ariaColCount(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaColCount_setter);
Object.defineProperty(curMemoryArea.ariaColCount_setter, "name", { value: "set ariaColCount", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColCount", { get: curMemoryArea.ariaColCount_getter, set: curMemoryArea.ariaColCount_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColCount_smart_getter = function ariaColCount() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaColCount的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaColCount_smart_getter);
Element.prototype.__defineGetter__("ariaColCount", curMemoryArea.ariaColCount_smart_getter);

// ariaColIndex
curMemoryArea.ariaColIndex_getter = function ariaColIndex() { debugger; }; mframe.safefunction(curMemoryArea.ariaColIndex_getter);
Object.defineProperty(curMemoryArea.ariaColIndex_getter, "name", { value: "get ariaColIndex", configurable: true, });
// ariaColIndex
curMemoryArea.ariaColIndex_setter = function ariaColIndex(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaColIndex_setter);
Object.defineProperty(curMemoryArea.ariaColIndex_setter, "name", { value: "set ariaColIndex", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColIndex", { get: curMemoryArea.ariaColIndex_getter, set: curMemoryArea.ariaColIndex_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColIndex_smart_getter = function ariaColIndex() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaColIndex的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaColIndex_smart_getter);
Element.prototype.__defineGetter__("ariaColIndex", curMemoryArea.ariaColIndex_smart_getter);

// ariaColSpan
curMemoryArea.ariaColSpan_getter = function ariaColSpan() { debugger; }; mframe.safefunction(curMemoryArea.ariaColSpan_getter);
Object.defineProperty(curMemoryArea.ariaColSpan_getter, "name", { value: "get ariaColSpan", configurable: true, });
// ariaColSpan
curMemoryArea.ariaColSpan_setter = function ariaColSpan(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaColSpan_setter);
Object.defineProperty(curMemoryArea.ariaColSpan_setter, "name", { value: "set ariaColSpan", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColSpan", { get: curMemoryArea.ariaColSpan_getter, set: curMemoryArea.ariaColSpan_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColSpan_smart_getter = function ariaColSpan() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaColSpan的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaColSpan_smart_getter);
Element.prototype.__defineGetter__("ariaColSpan", curMemoryArea.ariaColSpan_smart_getter);

// ariaCurrent
curMemoryArea.ariaCurrent_getter = function ariaCurrent() { debugger; }; mframe.safefunction(curMemoryArea.ariaCurrent_getter);
Object.defineProperty(curMemoryArea.ariaCurrent_getter, "name", { value: "get ariaCurrent", configurable: true, });
// ariaCurrent
curMemoryArea.ariaCurrent_setter = function ariaCurrent(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaCurrent_setter);
Object.defineProperty(curMemoryArea.ariaCurrent_setter, "name", { value: "set ariaCurrent", configurable: true, });
Object.defineProperty(Element.prototype, "ariaCurrent", { get: curMemoryArea.ariaCurrent_getter, set: curMemoryArea.ariaCurrent_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaCurrent_smart_getter = function ariaCurrent() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaCurrent的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaCurrent_smart_getter);
Element.prototype.__defineGetter__("ariaCurrent", curMemoryArea.ariaCurrent_smart_getter);

// ariaDescription
curMemoryArea.ariaDescription_getter = function ariaDescription() { debugger; }; mframe.safefunction(curMemoryArea.ariaDescription_getter);
Object.defineProperty(curMemoryArea.ariaDescription_getter, "name", { value: "get ariaDescription", configurable: true, });
// ariaDescription
curMemoryArea.ariaDescription_setter = function ariaDescription(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaDescription_setter);
Object.defineProperty(curMemoryArea.ariaDescription_setter, "name", { value: "set ariaDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDescription", { get: curMemoryArea.ariaDescription_getter, set: curMemoryArea.ariaDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDescription_smart_getter = function ariaDescription() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaDescription的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaDescription_smart_getter);
Element.prototype.__defineGetter__("ariaDescription", curMemoryArea.ariaDescription_smart_getter);

// ariaDisabled
curMemoryArea.ariaDisabled_getter = function ariaDisabled() { debugger; }; mframe.safefunction(curMemoryArea.ariaDisabled_getter);
Object.defineProperty(curMemoryArea.ariaDisabled_getter, "name", { value: "get ariaDisabled", configurable: true, });
// ariaDisabled
curMemoryArea.ariaDisabled_setter = function ariaDisabled(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaDisabled_setter);
Object.defineProperty(curMemoryArea.ariaDisabled_setter, "name", { value: "set ariaDisabled", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDisabled", { get: curMemoryArea.ariaDisabled_getter, set: curMemoryArea.ariaDisabled_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDisabled_smart_getter = function ariaDisabled() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaDisabled的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaDisabled_smart_getter);
Element.prototype.__defineGetter__("ariaDisabled", curMemoryArea.ariaDisabled_smart_getter);

// ariaExpanded
curMemoryArea.ariaExpanded_getter = function ariaExpanded() { debugger; }; mframe.safefunction(curMemoryArea.ariaExpanded_getter);
Object.defineProperty(curMemoryArea.ariaExpanded_getter, "name", { value: "get ariaExpanded", configurable: true, });
// ariaExpanded
curMemoryArea.ariaExpanded_setter = function ariaExpanded(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaExpanded_setter);
Object.defineProperty(curMemoryArea.ariaExpanded_setter, "name", { value: "set ariaExpanded", configurable: true, });
Object.defineProperty(Element.prototype, "ariaExpanded", { get: curMemoryArea.ariaExpanded_getter, set: curMemoryArea.ariaExpanded_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaExpanded_smart_getter = function ariaExpanded() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaExpanded的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaExpanded_smart_getter);
Element.prototype.__defineGetter__("ariaExpanded", curMemoryArea.ariaExpanded_smart_getter);

// ariaHasPopup
curMemoryArea.ariaHasPopup_getter = function ariaHasPopup() { debugger; }; mframe.safefunction(curMemoryArea.ariaHasPopup_getter);
Object.defineProperty(curMemoryArea.ariaHasPopup_getter, "name", { value: "get ariaHasPopup", configurable: true, });
// ariaHasPopup
curMemoryArea.ariaHasPopup_setter = function ariaHasPopup(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaHasPopup_setter);
Object.defineProperty(curMemoryArea.ariaHasPopup_setter, "name", { value: "set ariaHasPopup", configurable: true, });
Object.defineProperty(Element.prototype, "ariaHasPopup", { get: curMemoryArea.ariaHasPopup_getter, set: curMemoryArea.ariaHasPopup_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaHasPopup_smart_getter = function ariaHasPopup() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaHasPopup的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaHasPopup_smart_getter);
Element.prototype.__defineGetter__("ariaHasPopup", curMemoryArea.ariaHasPopup_smart_getter);

// ariaHidden
curMemoryArea.ariaHidden_getter = function ariaHidden() { debugger; }; mframe.safefunction(curMemoryArea.ariaHidden_getter);
Object.defineProperty(curMemoryArea.ariaHidden_getter, "name", { value: "get ariaHidden", configurable: true, });
// ariaHidden
curMemoryArea.ariaHidden_setter = function ariaHidden(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaHidden_setter);
Object.defineProperty(curMemoryArea.ariaHidden_setter, "name", { value: "set ariaHidden", configurable: true, });
Object.defineProperty(Element.prototype, "ariaHidden", { get: curMemoryArea.ariaHidden_getter, set: curMemoryArea.ariaHidden_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaHidden_smart_getter = function ariaHidden() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaHidden的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaHidden_smart_getter);
Element.prototype.__defineGetter__("ariaHidden", curMemoryArea.ariaHidden_smart_getter);

// ariaInvalid
curMemoryArea.ariaInvalid_getter = function ariaInvalid() { debugger; }; mframe.safefunction(curMemoryArea.ariaInvalid_getter);
Object.defineProperty(curMemoryArea.ariaInvalid_getter, "name", { value: "get ariaInvalid", configurable: true, });
// ariaInvalid
curMemoryArea.ariaInvalid_setter = function ariaInvalid(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaInvalid_setter);
Object.defineProperty(curMemoryArea.ariaInvalid_setter, "name", { value: "set ariaInvalid", configurable: true, });
Object.defineProperty(Element.prototype, "ariaInvalid", { get: curMemoryArea.ariaInvalid_getter, set: curMemoryArea.ariaInvalid_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaInvalid_smart_getter = function ariaInvalid() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaInvalid的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaInvalid_smart_getter);
Element.prototype.__defineGetter__("ariaInvalid", curMemoryArea.ariaInvalid_smart_getter);

// ariaKeyShortcuts
curMemoryArea.ariaKeyShortcuts_getter = function ariaKeyShortcuts() { debugger; }; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_getter);
Object.defineProperty(curMemoryArea.ariaKeyShortcuts_getter, "name", { value: "get ariaKeyShortcuts", configurable: true, });
// ariaKeyShortcuts
curMemoryArea.ariaKeyShortcuts_setter = function ariaKeyShortcuts(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_setter);
Object.defineProperty(curMemoryArea.ariaKeyShortcuts_setter, "name", { value: "set ariaKeyShortcuts", configurable: true, });
Object.defineProperty(Element.prototype, "ariaKeyShortcuts", { get: curMemoryArea.ariaKeyShortcuts_getter, set: curMemoryArea.ariaKeyShortcuts_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaKeyShortcuts_smart_getter = function ariaKeyShortcuts() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaKeyShortcuts的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_smart_getter);
Element.prototype.__defineGetter__("ariaKeyShortcuts", curMemoryArea.ariaKeyShortcuts_smart_getter);

// ariaLabel
curMemoryArea.ariaLabel_getter = function ariaLabel() { debugger; }; mframe.safefunction(curMemoryArea.ariaLabel_getter);
Object.defineProperty(curMemoryArea.ariaLabel_getter, "name", { value: "get ariaLabel", configurable: true, });
// ariaLabel
curMemoryArea.ariaLabel_setter = function ariaLabel(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaLabel_setter);
Object.defineProperty(curMemoryArea.ariaLabel_setter, "name", { value: "set ariaLabel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLabel", { get: curMemoryArea.ariaLabel_getter, set: curMemoryArea.ariaLabel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLabel_smart_getter = function ariaLabel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaLabel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaLabel_smart_getter);
Element.prototype.__defineGetter__("ariaLabel", curMemoryArea.ariaLabel_smart_getter);

// ariaLevel
curMemoryArea.ariaLevel_getter = function ariaLevel() { debugger; }; mframe.safefunction(curMemoryArea.ariaLevel_getter);
Object.defineProperty(curMemoryArea.ariaLevel_getter, "name", { value: "get ariaLevel", configurable: true, });
// ariaLevel
curMemoryArea.ariaLevel_setter = function ariaLevel(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaLevel_setter);
Object.defineProperty(curMemoryArea.ariaLevel_setter, "name", { value: "set ariaLevel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLevel", { get: curMemoryArea.ariaLevel_getter, set: curMemoryArea.ariaLevel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLevel_smart_getter = function ariaLevel() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaLevel的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaLevel_smart_getter);
Element.prototype.__defineGetter__("ariaLevel", curMemoryArea.ariaLevel_smart_getter);

// ariaLive
curMemoryArea.ariaLive_getter = function ariaLive() { debugger; }; mframe.safefunction(curMemoryArea.ariaLive_getter);
Object.defineProperty(curMemoryArea.ariaLive_getter, "name", { value: "get ariaLive", configurable: true, });
// ariaLive
curMemoryArea.ariaLive_setter = function ariaLive(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaLive_setter);
Object.defineProperty(curMemoryArea.ariaLive_setter, "name", { value: "set ariaLive", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLive", { get: curMemoryArea.ariaLive_getter, set: curMemoryArea.ariaLive_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLive_smart_getter = function ariaLive() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaLive的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaLive_smart_getter);
Element.prototype.__defineGetter__("ariaLive", curMemoryArea.ariaLive_smart_getter);

// ariaModal
curMemoryArea.ariaModal_getter = function ariaModal() { debugger; }; mframe.safefunction(curMemoryArea.ariaModal_getter);
Object.defineProperty(curMemoryArea.ariaModal_getter, "name", { value: "get ariaModal", configurable: true, });
// ariaModal
curMemoryArea.ariaModal_setter = function ariaModal(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaModal_setter);
Object.defineProperty(curMemoryArea.ariaModal_setter, "name", { value: "set ariaModal", configurable: true, });
Object.defineProperty(Element.prototype, "ariaModal", { get: curMemoryArea.ariaModal_getter, set: curMemoryArea.ariaModal_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaModal_smart_getter = function ariaModal() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaModal的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaModal_smart_getter);
Element.prototype.__defineGetter__("ariaModal", curMemoryArea.ariaModal_smart_getter);

// ariaMultiLine
curMemoryArea.ariaMultiLine_getter = function ariaMultiLine() { debugger; }; mframe.safefunction(curMemoryArea.ariaMultiLine_getter);
Object.defineProperty(curMemoryArea.ariaMultiLine_getter, "name", { value: "get ariaMultiLine", configurable: true, });
// ariaMultiLine
curMemoryArea.ariaMultiLine_setter = function ariaMultiLine(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaMultiLine_setter);
Object.defineProperty(curMemoryArea.ariaMultiLine_setter, "name", { value: "set ariaMultiLine", configurable: true, });
Object.defineProperty(Element.prototype, "ariaMultiLine", { get: curMemoryArea.ariaMultiLine_getter, set: curMemoryArea.ariaMultiLine_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaMultiLine_smart_getter = function ariaMultiLine() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaMultiLine的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaMultiLine_smart_getter);
Element.prototype.__defineGetter__("ariaMultiLine", curMemoryArea.ariaMultiLine_smart_getter);

// ariaMultiSelectable
curMemoryArea.ariaMultiSelectable_getter = function ariaMultiSelectable() { debugger; }; mframe.safefunction(curMemoryArea.ariaMultiSelectable_getter);
Object.defineProperty(curMemoryArea.ariaMultiSelectable_getter, "name", { value: "get ariaMultiSelectable", configurable: true, });
// ariaMultiSelectable
curMemoryArea.ariaMultiSelectable_setter = function ariaMultiSelectable(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaMultiSelectable_setter);
Object.defineProperty(curMemoryArea.ariaMultiSelectable_setter, "name", { value: "set ariaMultiSelectable", configurable: true, });
Object.defineProperty(Element.prototype, "ariaMultiSelectable", { get: curMemoryArea.ariaMultiSelectable_getter, set: curMemoryArea.ariaMultiSelectable_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaMultiSelectable_smart_getter = function ariaMultiSelectable() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaMultiSelectable的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaMultiSelectable_smart_getter);
Element.prototype.__defineGetter__("ariaMultiSelectable", curMemoryArea.ariaMultiSelectable_smart_getter);

// ariaOrientation
curMemoryArea.ariaOrientation_getter = function ariaOrientation() { debugger; }; mframe.safefunction(curMemoryArea.ariaOrientation_getter);
Object.defineProperty(curMemoryArea.ariaOrientation_getter, "name", { value: "get ariaOrientation", configurable: true, });
// ariaOrientation
curMemoryArea.ariaOrientation_setter = function ariaOrientation(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaOrientation_setter);
Object.defineProperty(curMemoryArea.ariaOrientation_setter, "name", { value: "set ariaOrientation", configurable: true, });
Object.defineProperty(Element.prototype, "ariaOrientation", { get: curMemoryArea.ariaOrientation_getter, set: curMemoryArea.ariaOrientation_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaOrientation_smart_getter = function ariaOrientation() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaOrientation的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaOrientation_smart_getter);
Element.prototype.__defineGetter__("ariaOrientation", curMemoryArea.ariaOrientation_smart_getter);

// ariaPlaceholder
curMemoryArea.ariaPlaceholder_getter = function ariaPlaceholder() { debugger; }; mframe.safefunction(curMemoryArea.ariaPlaceholder_getter);
Object.defineProperty(curMemoryArea.ariaPlaceholder_getter, "name", { value: "get ariaPlaceholder", configurable: true, });
// ariaPlaceholder
curMemoryArea.ariaPlaceholder_setter = function ariaPlaceholder(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaPlaceholder_setter);
Object.defineProperty(curMemoryArea.ariaPlaceholder_setter, "name", { value: "set ariaPlaceholder", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPlaceholder", { get: curMemoryArea.ariaPlaceholder_getter, set: curMemoryArea.ariaPlaceholder_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPlaceholder_smart_getter = function ariaPlaceholder() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaPlaceholder的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaPlaceholder_smart_getter);
Element.prototype.__defineGetter__("ariaPlaceholder", curMemoryArea.ariaPlaceholder_smart_getter);

// ariaPosInSet
curMemoryArea.ariaPosInSet_getter = function ariaPosInSet() { debugger; }; mframe.safefunction(curMemoryArea.ariaPosInSet_getter);
Object.defineProperty(curMemoryArea.ariaPosInSet_getter, "name", { value: "get ariaPosInSet", configurable: true, });
// ariaPosInSet
curMemoryArea.ariaPosInSet_setter = function ariaPosInSet(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaPosInSet_setter);
Object.defineProperty(curMemoryArea.ariaPosInSet_setter, "name", { value: "set ariaPosInSet", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPosInSet", { get: curMemoryArea.ariaPosInSet_getter, set: curMemoryArea.ariaPosInSet_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPosInSet_smart_getter = function ariaPosInSet() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaPosInSet的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaPosInSet_smart_getter);
Element.prototype.__defineGetter__("ariaPosInSet", curMemoryArea.ariaPosInSet_smart_getter);

// ariaPressed
curMemoryArea.ariaPressed_getter = function ariaPressed() { debugger; }; mframe.safefunction(curMemoryArea.ariaPressed_getter);
Object.defineProperty(curMemoryArea.ariaPressed_getter, "name", { value: "get ariaPressed", configurable: true, });
// ariaPressed
curMemoryArea.ariaPressed_setter = function ariaPressed(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaPressed_setter);
Object.defineProperty(curMemoryArea.ariaPressed_setter, "name", { value: "set ariaPressed", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPressed", { get: curMemoryArea.ariaPressed_getter, set: curMemoryArea.ariaPressed_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPressed_smart_getter = function ariaPressed() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaPressed的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaPressed_smart_getter);
Element.prototype.__defineGetter__("ariaPressed", curMemoryArea.ariaPressed_smart_getter);

// ariaReadOnly
curMemoryArea.ariaReadOnly_getter = function ariaReadOnly() { debugger; }; mframe.safefunction(curMemoryArea.ariaReadOnly_getter);
Object.defineProperty(curMemoryArea.ariaReadOnly_getter, "name", { value: "get ariaReadOnly", configurable: true, });
// ariaReadOnly
curMemoryArea.ariaReadOnly_setter = function ariaReadOnly(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaReadOnly_setter);
Object.defineProperty(curMemoryArea.ariaReadOnly_setter, "name", { value: "set ariaReadOnly", configurable: true, });
Object.defineProperty(Element.prototype, "ariaReadOnly", { get: curMemoryArea.ariaReadOnly_getter, set: curMemoryArea.ariaReadOnly_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaReadOnly_smart_getter = function ariaReadOnly() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaReadOnly的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaReadOnly_smart_getter);
Element.prototype.__defineGetter__("ariaReadOnly", curMemoryArea.ariaReadOnly_smart_getter);

// ariaRelevant
curMemoryArea.ariaRelevant_getter = function ariaRelevant() { debugger; }; mframe.safefunction(curMemoryArea.ariaRelevant_getter);
Object.defineProperty(curMemoryArea.ariaRelevant_getter, "name", { value: "get ariaRelevant", configurable: true, });
// ariaRelevant
curMemoryArea.ariaRelevant_setter = function ariaRelevant(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRelevant_setter);
Object.defineProperty(curMemoryArea.ariaRelevant_setter, "name", { value: "set ariaRelevant", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRelevant", { get: curMemoryArea.ariaRelevant_getter, set: curMemoryArea.ariaRelevant_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRelevant_smart_getter = function ariaRelevant() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRelevant的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRelevant_smart_getter);
Element.prototype.__defineGetter__("ariaRelevant", curMemoryArea.ariaRelevant_smart_getter);

// ariaRequired
curMemoryArea.ariaRequired_getter = function ariaRequired() { debugger; }; mframe.safefunction(curMemoryArea.ariaRequired_getter);
Object.defineProperty(curMemoryArea.ariaRequired_getter, "name", { value: "get ariaRequired", configurable: true, });
// ariaRequired
curMemoryArea.ariaRequired_setter = function ariaRequired(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRequired_setter);
Object.defineProperty(curMemoryArea.ariaRequired_setter, "name", { value: "set ariaRequired", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRequired", { get: curMemoryArea.ariaRequired_getter, set: curMemoryArea.ariaRequired_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRequired_smart_getter = function ariaRequired() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRequired的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRequired_smart_getter);
Element.prototype.__defineGetter__("ariaRequired", curMemoryArea.ariaRequired_smart_getter);

// ariaRoleDescription
curMemoryArea.ariaRoleDescription_getter = function ariaRoleDescription() { debugger; }; mframe.safefunction(curMemoryArea.ariaRoleDescription_getter);
Object.defineProperty(curMemoryArea.ariaRoleDescription_getter, "name", { value: "get ariaRoleDescription", configurable: true, });
// ariaRoleDescription
curMemoryArea.ariaRoleDescription_setter = function ariaRoleDescription(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRoleDescription_setter);
Object.defineProperty(curMemoryArea.ariaRoleDescription_setter, "name", { value: "set ariaRoleDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRoleDescription", { get: curMemoryArea.ariaRoleDescription_getter, set: curMemoryArea.ariaRoleDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRoleDescription_smart_getter = function ariaRoleDescription() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRoleDescription的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRoleDescription_smart_getter);
Element.prototype.__defineGetter__("ariaRoleDescription", curMemoryArea.ariaRoleDescription_smart_getter);

// ariaRowCount
curMemoryArea.ariaRowCount_getter = function ariaRowCount() { debugger; }; mframe.safefunction(curMemoryArea.ariaRowCount_getter);
Object.defineProperty(curMemoryArea.ariaRowCount_getter, "name", { value: "get ariaRowCount", configurable: true, });
// ariaRowCount
curMemoryArea.ariaRowCount_setter = function ariaRowCount(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRowCount_setter);
Object.defineProperty(curMemoryArea.ariaRowCount_setter, "name", { value: "set ariaRowCount", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowCount", { get: curMemoryArea.ariaRowCount_getter, set: curMemoryArea.ariaRowCount_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowCount_smart_getter = function ariaRowCount() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRowCount的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRowCount_smart_getter);
Element.prototype.__defineGetter__("ariaRowCount", curMemoryArea.ariaRowCount_smart_getter);

// ariaRowIndex
curMemoryArea.ariaRowIndex_getter = function ariaRowIndex() { debugger; }; mframe.safefunction(curMemoryArea.ariaRowIndex_getter);
Object.defineProperty(curMemoryArea.ariaRowIndex_getter, "name", { value: "get ariaRowIndex", configurable: true, });
// ariaRowIndex
curMemoryArea.ariaRowIndex_setter = function ariaRowIndex(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRowIndex_setter);
Object.defineProperty(curMemoryArea.ariaRowIndex_setter, "name", { value: "set ariaRowIndex", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowIndex", { get: curMemoryArea.ariaRowIndex_getter, set: curMemoryArea.ariaRowIndex_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowIndex_smart_getter = function ariaRowIndex() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRowIndex的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRowIndex_smart_getter);
Element.prototype.__defineGetter__("ariaRowIndex", curMemoryArea.ariaRowIndex_smart_getter);

// ariaRowSpan
curMemoryArea.ariaRowSpan_getter = function ariaRowSpan() { debugger; }; mframe.safefunction(curMemoryArea.ariaRowSpan_getter);
Object.defineProperty(curMemoryArea.ariaRowSpan_getter, "name", { value: "get ariaRowSpan", configurable: true, });
// ariaRowSpan
curMemoryArea.ariaRowSpan_setter = function ariaRowSpan(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRowSpan_setter);
Object.defineProperty(curMemoryArea.ariaRowSpan_setter, "name", { value: "set ariaRowSpan", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowSpan", { get: curMemoryArea.ariaRowSpan_getter, set: curMemoryArea.ariaRowSpan_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowSpan_smart_getter = function ariaRowSpan() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRowSpan的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRowSpan_smart_getter);
Element.prototype.__defineGetter__("ariaRowSpan", curMemoryArea.ariaRowSpan_smart_getter);

// ariaSelected
curMemoryArea.ariaSelected_getter = function ariaSelected() { debugger; }; mframe.safefunction(curMemoryArea.ariaSelected_getter);
Object.defineProperty(curMemoryArea.ariaSelected_getter, "name", { value: "get ariaSelected", configurable: true, });
// ariaSelected
curMemoryArea.ariaSelected_setter = function ariaSelected(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaSelected_setter);
Object.defineProperty(curMemoryArea.ariaSelected_setter, "name", { value: "set ariaSelected", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSelected", { get: curMemoryArea.ariaSelected_getter, set: curMemoryArea.ariaSelected_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSelected_smart_getter = function ariaSelected() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaSelected的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaSelected_smart_getter);
Element.prototype.__defineGetter__("ariaSelected", curMemoryArea.ariaSelected_smart_getter);

// ariaSetSize
curMemoryArea.ariaSetSize_getter = function ariaSetSize() { debugger; }; mframe.safefunction(curMemoryArea.ariaSetSize_getter);
Object.defineProperty(curMemoryArea.ariaSetSize_getter, "name", { value: "get ariaSetSize", configurable: true, });
// ariaSetSize
curMemoryArea.ariaSetSize_setter = function ariaSetSize(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaSetSize_setter);
Object.defineProperty(curMemoryArea.ariaSetSize_setter, "name", { value: "set ariaSetSize", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSetSize", { get: curMemoryArea.ariaSetSize_getter, set: curMemoryArea.ariaSetSize_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSetSize_smart_getter = function ariaSetSize() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaSetSize的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaSetSize_smart_getter);
Element.prototype.__defineGetter__("ariaSetSize", curMemoryArea.ariaSetSize_smart_getter);

// ariaSort
curMemoryArea.ariaSort_getter = function ariaSort() { debugger; }; mframe.safefunction(curMemoryArea.ariaSort_getter);
Object.defineProperty(curMemoryArea.ariaSort_getter, "name", { value: "get ariaSort", configurable: true, });
// ariaSort
curMemoryArea.ariaSort_setter = function ariaSort(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaSort_setter);
Object.defineProperty(curMemoryArea.ariaSort_setter, "name", { value: "set ariaSort", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSort", { get: curMemoryArea.ariaSort_getter, set: curMemoryArea.ariaSort_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSort_smart_getter = function ariaSort() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaSort的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaSort_smart_getter);
Element.prototype.__defineGetter__("ariaSort", curMemoryArea.ariaSort_smart_getter);

// ariaValueMax
curMemoryArea.ariaValueMax_getter = function ariaValueMax() { debugger; }; mframe.safefunction(curMemoryArea.ariaValueMax_getter);
Object.defineProperty(curMemoryArea.ariaValueMax_getter, "name", { value: "get ariaValueMax", configurable: true, });
// ariaValueMax
curMemoryArea.ariaValueMax_setter = function ariaValueMax(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaValueMax_setter);
Object.defineProperty(curMemoryArea.ariaValueMax_setter, "name", { value: "set ariaValueMax", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueMax", { get: curMemoryArea.ariaValueMax_getter, set: curMemoryArea.ariaValueMax_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueMax_smart_getter = function ariaValueMax() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaValueMax的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaValueMax_smart_getter);
Element.prototype.__defineGetter__("ariaValueMax", curMemoryArea.ariaValueMax_smart_getter);

// ariaValueMin
curMemoryArea.ariaValueMin_getter = function ariaValueMin() { debugger; }; mframe.safefunction(curMemoryArea.ariaValueMin_getter);
Object.defineProperty(curMemoryArea.ariaValueMin_getter, "name", { value: "get ariaValueMin", configurable: true, });
// ariaValueMin
curMemoryArea.ariaValueMin_setter = function ariaValueMin(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaValueMin_setter);
Object.defineProperty(curMemoryArea.ariaValueMin_setter, "name", { value: "set ariaValueMin", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueMin", { get: curMemoryArea.ariaValueMin_getter, set: curMemoryArea.ariaValueMin_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueMin_smart_getter = function ariaValueMin() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaValueMin的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaValueMin_smart_getter);
Element.prototype.__defineGetter__("ariaValueMin", curMemoryArea.ariaValueMin_smart_getter);

// ariaValueNow
curMemoryArea.ariaValueNow_getter = function ariaValueNow() { debugger; }; mframe.safefunction(curMemoryArea.ariaValueNow_getter);
Object.defineProperty(curMemoryArea.ariaValueNow_getter, "name", { value: "get ariaValueNow", configurable: true, });
// ariaValueNow
curMemoryArea.ariaValueNow_setter = function ariaValueNow(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaValueNow_setter);
Object.defineProperty(curMemoryArea.ariaValueNow_setter, "name", { value: "set ariaValueNow", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueNow", { get: curMemoryArea.ariaValueNow_getter, set: curMemoryArea.ariaValueNow_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueNow_smart_getter = function ariaValueNow() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaValueNow的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaValueNow_smart_getter);
Element.prototype.__defineGetter__("ariaValueNow", curMemoryArea.ariaValueNow_smart_getter);

// ariaValueText
curMemoryArea.ariaValueText_getter = function ariaValueText() { debugger; }; mframe.safefunction(curMemoryArea.ariaValueText_getter);
Object.defineProperty(curMemoryArea.ariaValueText_getter, "name", { value: "get ariaValueText", configurable: true, });
// ariaValueText
curMemoryArea.ariaValueText_setter = function ariaValueText(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaValueText_setter);
Object.defineProperty(curMemoryArea.ariaValueText_setter, "name", { value: "set ariaValueText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueText", { get: curMemoryArea.ariaValueText_getter, set: curMemoryArea.ariaValueText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueText_smart_getter = function ariaValueText() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaValueText的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaValueText_smart_getter);
Element.prototype.__defineGetter__("ariaValueText", curMemoryArea.ariaValueText_smart_getter);

// children
curMemoryArea.children_getter = function children() { debugger; }; mframe.safefunction(curMemoryArea.children_getter);
Object.defineProperty(curMemoryArea.children_getter, "name", { value: "get children", configurable: true, });
Object.defineProperty(Element.prototype, "children", { get: curMemoryArea.children_getter, enumerable: true, configurable: true, });
curMemoryArea.children_smart_getter = function children() {
    let defaultValue = mframe.proxy({});
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的children的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.children_smart_getter);
Element.prototype.__defineGetter__("children", curMemoryArea.children_smart_getter);

// firstElementChild
curMemoryArea.firstElementChild_getter = function firstElementChild() { debugger; }; mframe.safefunction(curMemoryArea.firstElementChild_getter);
Object.defineProperty(curMemoryArea.firstElementChild_getter, "name", { value: "get firstElementChild", configurable: true, });
Object.defineProperty(Element.prototype, "firstElementChild", { get: curMemoryArea.firstElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstElementChild_smart_getter = function firstElementChild() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的firstElementChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.firstElementChild_smart_getter);
Element.prototype.__defineGetter__("firstElementChild", curMemoryArea.firstElementChild_smart_getter);

// lastElementChild
curMemoryArea.lastElementChild_getter = function lastElementChild() { debugger; }; mframe.safefunction(curMemoryArea.lastElementChild_getter);
Object.defineProperty(curMemoryArea.lastElementChild_getter, "name", { value: "get lastElementChild", configurable: true, });
Object.defineProperty(Element.prototype, "lastElementChild", { get: curMemoryArea.lastElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.lastElementChild_smart_getter = function lastElementChild() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的lastElementChild的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.lastElementChild_smart_getter);
Element.prototype.__defineGetter__("lastElementChild", curMemoryArea.lastElementChild_smart_getter);

// childElementCount
curMemoryArea.childElementCount_getter = function childElementCount() { debugger; }; mframe.safefunction(curMemoryArea.childElementCount_getter);
Object.defineProperty(curMemoryArea.childElementCount_getter, "name", { value: "get childElementCount", configurable: true, });
Object.defineProperty(Element.prototype, "childElementCount", { get: curMemoryArea.childElementCount_getter, enumerable: true, configurable: true, });
curMemoryArea.childElementCount_smart_getter = function childElementCount() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的childElementCount的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.childElementCount_smart_getter);
Element.prototype.__defineGetter__("childElementCount", curMemoryArea.childElementCount_smart_getter);

// previousElementSibling
curMemoryArea.previousElementSibling_getter = function previousElementSibling() { debugger; }; mframe.safefunction(curMemoryArea.previousElementSibling_getter);
Object.defineProperty(curMemoryArea.previousElementSibling_getter, "name", { value: "get previousElementSibling", configurable: true, });
Object.defineProperty(Element.prototype, "previousElementSibling", { get: curMemoryArea.previousElementSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.previousElementSibling_smart_getter = function previousElementSibling() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的previousElementSibling的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.previousElementSibling_smart_getter);
Element.prototype.__defineGetter__("previousElementSibling", curMemoryArea.previousElementSibling_smart_getter);

// nextElementSibling
curMemoryArea.nextElementSibling_getter = function nextElementSibling() { debugger; }; mframe.safefunction(curMemoryArea.nextElementSibling_getter);
Object.defineProperty(curMemoryArea.nextElementSibling_getter, "name", { value: "get nextElementSibling", configurable: true, });
Object.defineProperty(Element.prototype, "nextElementSibling", { get: curMemoryArea.nextElementSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.nextElementSibling_smart_getter = function nextElementSibling() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的nextElementSibling的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.nextElementSibling_smart_getter);
Element.prototype.__defineGetter__("nextElementSibling", curMemoryArea.nextElementSibling_smart_getter);

// currentCSSZoom
curMemoryArea.currentCSSZoom_getter = function currentCSSZoom() { debugger; }; mframe.safefunction(curMemoryArea.currentCSSZoom_getter);
Object.defineProperty(curMemoryArea.currentCSSZoom_getter, "name", { value: "get currentCSSZoom", configurable: true, });
Object.defineProperty(Element.prototype, "currentCSSZoom", { get: curMemoryArea.currentCSSZoom_getter, enumerable: true, configurable: true, });
curMemoryArea.currentCSSZoom_smart_getter = function currentCSSZoom() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的currentCSSZoom的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.currentCSSZoom_smart_getter);
Element.prototype.__defineGetter__("currentCSSZoom", curMemoryArea.currentCSSZoom_smart_getter);

// ariaColIndexText
curMemoryArea.ariaColIndexText_getter = function ariaColIndexText() { debugger; }; mframe.safefunction(curMemoryArea.ariaColIndexText_getter);
Object.defineProperty(curMemoryArea.ariaColIndexText_getter, "name", { value: "get ariaColIndexText", configurable: true, });
// ariaColIndexText
curMemoryArea.ariaColIndexText_setter = function ariaColIndexText(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaColIndexText_setter);
Object.defineProperty(curMemoryArea.ariaColIndexText_setter, "name", { value: "set ariaColIndexText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColIndexText", { get: curMemoryArea.ariaColIndexText_getter, set: curMemoryArea.ariaColIndexText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColIndexText_smart_getter = function ariaColIndexText() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaColIndexText的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaColIndexText_smart_getter);
Element.prototype.__defineGetter__("ariaColIndexText", curMemoryArea.ariaColIndexText_smart_getter);

// ariaRowIndexText
curMemoryArea.ariaRowIndexText_getter = function ariaRowIndexText() { debugger; }; mframe.safefunction(curMemoryArea.ariaRowIndexText_getter);
Object.defineProperty(curMemoryArea.ariaRowIndexText_getter, "name", { value: "get ariaRowIndexText", configurable: true, });
// ariaRowIndexText
curMemoryArea.ariaRowIndexText_setter = function ariaRowIndexText(val) { debugger; }; mframe.safefunction(curMemoryArea.ariaRowIndexText_setter);
Object.defineProperty(curMemoryArea.ariaRowIndexText_setter, "name", { value: "set ariaRowIndexText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowIndexText", { get: curMemoryArea.ariaRowIndexText_getter, set: curMemoryArea.ariaRowIndexText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowIndexText_smart_getter = function ariaRowIndexText() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"Element"中的ariaRowIndexText的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.ariaRowIndexText_smart_getter);
Element.prototype.__defineGetter__("ariaRowIndexText", curMemoryArea.ariaRowIndexText_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
Element.prototype["after"] = function after() { debugger; }; mframe.safefunction(Element.prototype["after"]);
Element.prototype["animate"] = function animate() { debugger; }; mframe.safefunction(Element.prototype["animate"]);
Element.prototype["append"] = function append() { debugger; }; mframe.safefunction(Element.prototype["append"]);
Element.prototype["attachShadow"] = function attachShadow() { debugger; }; mframe.safefunction(Element.prototype["attachShadow"]);
Element.prototype["before"] = function before() { debugger; }; mframe.safefunction(Element.prototype["before"]);
Element.prototype["checkVisibility"] = function checkVisibility() { debugger; }; mframe.safefunction(Element.prototype["checkVisibility"]);
Element.prototype["closest"] = function closest() { debugger; }; mframe.safefunction(Element.prototype["closest"]);
Element.prototype["computedStyleMap"] = function computedStyleMap() { debugger; }; mframe.safefunction(Element.prototype["computedStyleMap"]);
Element.prototype["getAnimations"] = function getAnimations() { debugger; }; mframe.safefunction(Element.prototype["getAnimations"]);
Element.prototype["getAttribute"] = function getAttribute() { debugger; }; mframe.safefunction(Element.prototype["getAttribute"]);
Element.prototype["getAttributeNS"] = function getAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNS"]);
Element.prototype["getAttributeNames"] = function getAttributeNames() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNames"]);
Element.prototype["getAttributeNode"] = function getAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNode"]);
Element.prototype["getAttributeNodeNS"] = function getAttributeNodeNS() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNodeNS"]);
Element.prototype["getBoundingClientRect"] = function getBoundingClientRect() { debugger; }; mframe.safefunction(Element.prototype["getBoundingClientRect"]);
Element.prototype["getClientRects"] = function getClientRects() { debugger; }; mframe.safefunction(Element.prototype["getClientRects"]);
Element.prototype["getElementsByClassName"] = function getElementsByClassName() { debugger; }; mframe.safefunction(Element.prototype["getElementsByClassName"]);
Element.prototype["getElementsByTagName"] = function getElementsByTagName() { debugger; }; mframe.safefunction(Element.prototype["getElementsByTagName"]);
Element.prototype["getElementsByTagNameNS"] = function getElementsByTagNameNS() { debugger; }; mframe.safefunction(Element.prototype["getElementsByTagNameNS"]);
Element.prototype["getHTML"] = function getHTML() { debugger; }; mframe.safefunction(Element.prototype["getHTML"]);
Element.prototype["hasAttribute"] = function hasAttribute() { debugger; }; mframe.safefunction(Element.prototype["hasAttribute"]);
Element.prototype["hasAttributeNS"] = function hasAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["hasAttributeNS"]);
Element.prototype["hasAttributes"] = function hasAttributes() { debugger; }; mframe.safefunction(Element.prototype["hasAttributes"]);
Element.prototype["hasPointerCapture"] = function hasPointerCapture() { debugger; }; mframe.safefunction(Element.prototype["hasPointerCapture"]);
Element.prototype["insertAdjacentElement"] = function insertAdjacentElement() { debugger; }; mframe.safefunction(Element.prototype["insertAdjacentElement"]);
Element.prototype["insertAdjacentHTML"] = function insertAdjacentHTML() { debugger; }; mframe.safefunction(Element.prototype["insertAdjacentHTML"]);
Element.prototype["insertAdjacentText"] = function insertAdjacentText() { debugger; }; mframe.safefunction(Element.prototype["insertAdjacentText"]);
Element.prototype["matches"] = function matches() { debugger; }; mframe.safefunction(Element.prototype["matches"]);
Element.prototype["prepend"] = function prepend() { debugger; }; mframe.safefunction(Element.prototype["prepend"]);
Element.prototype["querySelector"] = function querySelector() { debugger; }; mframe.safefunction(Element.prototype["querySelector"]);
Element.prototype["querySelectorAll"] = function querySelectorAll() { debugger; }; mframe.safefunction(Element.prototype["querySelectorAll"]);
Element.prototype["releasePointerCapture"] = function releasePointerCapture() { debugger; }; mframe.safefunction(Element.prototype["releasePointerCapture"]);
Element.prototype["remove"] = function remove() { debugger; }; mframe.safefunction(Element.prototype["remove"]);
Element.prototype["removeAttribute"] = function removeAttribute() { debugger; }; mframe.safefunction(Element.prototype["removeAttribute"]);
Element.prototype["removeAttributeNS"] = function removeAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["removeAttributeNS"]);
Element.prototype["removeAttributeNode"] = function removeAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["removeAttributeNode"]);
Element.prototype["replaceChildren"] = function replaceChildren() { debugger; }; mframe.safefunction(Element.prototype["replaceChildren"]);
Element.prototype["replaceWith"] = function replaceWith() { debugger; }; mframe.safefunction(Element.prototype["replaceWith"]);
Element.prototype["requestFullscreen"] = function requestFullscreen() { debugger; }; mframe.safefunction(Element.prototype["requestFullscreen"]);
Element.prototype["requestPointerLock"] = function requestPointerLock() { debugger; }; mframe.safefunction(Element.prototype["requestPointerLock"]);
Element.prototype["scroll"] = function scroll() { debugger; }; mframe.safefunction(Element.prototype["scroll"]);
Element.prototype["scrollBy"] = function scrollBy() { debugger; }; mframe.safefunction(Element.prototype["scrollBy"]);
Element.prototype["scrollIntoView"] = function scrollIntoView() { debugger; }; mframe.safefunction(Element.prototype["scrollIntoView"]);
Element.prototype["scrollIntoViewIfNeeded"] = function scrollIntoViewIfNeeded() { debugger; }; mframe.safefunction(Element.prototype["scrollIntoViewIfNeeded"]);
Element.prototype["scrollTo"] = function scrollTo() { debugger; }; mframe.safefunction(Element.prototype["scrollTo"]);
Element.prototype["setAttribute"] = function setAttribute() { debugger; }; mframe.safefunction(Element.prototype["setAttribute"]);
Element.prototype["setAttributeNS"] = function setAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNS"]);
Element.prototype["setAttributeNode"] = function setAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNode"]);
Element.prototype["setAttributeNodeNS"] = function setAttributeNodeNS() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNodeNS"]);
Element.prototype["setHTMLUnsafe"] = function setHTMLUnsafe() { debugger; }; mframe.safefunction(Element.prototype["setHTMLUnsafe"]);
Element.prototype["setPointerCapture"] = function setPointerCapture() { debugger; }; mframe.safefunction(Element.prototype["setPointerCapture"]);
Element.prototype["toggleAttribute"] = function toggleAttribute() { debugger; }; mframe.safefunction(Element.prototype["toggleAttribute"]);
Element.prototype["webkitMatchesSelector"] = function webkitMatchesSelector() { debugger; }; mframe.safefunction(Element.prototype["webkitMatchesSelector"]);
Element.prototype["webkitRequestFullScreen"] = function webkitRequestFullScreen() { debugger; }; mframe.safefunction(Element.prototype["webkitRequestFullScreen"]);
Element.prototype["webkitRequestFullscreen"] = function webkitRequestFullscreen() { debugger; }; mframe.safefunction(Element.prototype["webkitRequestFullscreen"]);
Element.prototype["moveBefore"] = function moveBefore() { debugger; }; mframe.safefunction(Element.prototype["moveBefore"]);
//==============↑↑Function END↑↑====================

//////////////////////////////////


/**代理 */
Element.prototype.__proto__ = Node.prototype;
Element = mframe.proxy(Element)

// 添加querySelector和querySelectorAll方法
Element.prototype["querySelector"] = function querySelector(selector) {
    console.log("Element.querySelector=>", selector);
    if (this._jsdom_element) {
        var jsdomElement = this._jsdom_element.querySelector(selector);
        if (jsdomElement) {
            var element = {};
            element.__proto__ = Element.prototype;
            element._jsdom_element = jsdomElement;
            return mframe.proxy(element);
        }
    }
    return null;
}; mframe.safefunction(Element.prototype["querySelector"]);

Element.prototype["querySelectorAll"] = function querySelectorAll(selector) {
    console.log("Element.querySelectorAll=>", selector);
    if (this._jsdom_element) {
        var jsdomElements = this._jsdom_element.querySelectorAll(selector);
        var result = [];
        for (var i = 0; i < jsdomElements.length; i++) {
            var element = {};
            element.__proto__ = Element.prototype;
            element._jsdom_element = jsdomElements[i];
            result.push(mframe.proxy(element));
        }
        return mframe.proxy(result);
    }
    return mframe.proxy([]);
}; mframe.safefunction(Element.prototype["querySelectorAll"]);

// 修改getAttribute和setAttribute方法
Element.prototype["getAttribute"] = function getAttribute(name) {
    console.log("Element.getAttribute=>", name);
    if (this._jsdom_element) {
        return this._jsdom_element.getAttribute(name);
    }
    return null;
}; mframe.safefunction(Element.prototype["getAttribute"]);

Element.prototype["setAttribute"] = function setAttribute(name, value) {
    console.log("Element.setAttribute=>", name, value);
    if (this._jsdom_element) {
        this._jsdom_element.setAttribute(name, value);
    }
}; mframe.safefunction(Element.prototype["setAttribute"]);
