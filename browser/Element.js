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

////////////////////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Element = {};

//============== Constant START ==================
Object.defineProperty(Element, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(Element, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// namespaceURI
curMemoryArea.namespaceURI_getter = function namespaceURI() { return this._namespaceURI; }; mframe.safefunction(curMemoryArea.namespaceURI_getter);
Object.defineProperty(curMemoryArea.namespaceURI_getter, "name", { value: "get namespaceURI", configurable: true, });
Object.defineProperty(Element.prototype, "namespaceURI", { get: curMemoryArea.namespaceURI_getter, enumerable: true, configurable: true, });
curMemoryArea.namespaceURI_smart_getter = function namespaceURI() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.namespaceURI; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._namespaceURI !== undefined ? this._namespaceURI : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.namespaceURI_smart_getter);
Element.prototype.__defineGetter__("namespaceURI", curMemoryArea.namespaceURI_smart_getter);

// prefix
curMemoryArea.prefix_getter = function prefix() { return this._prefix; }; mframe.safefunction(curMemoryArea.prefix_getter);
Object.defineProperty(curMemoryArea.prefix_getter, "name", { value: "get prefix", configurable: true, });
Object.defineProperty(Element.prototype, "prefix", { get: curMemoryArea.prefix_getter, enumerable: true, configurable: true, });
curMemoryArea.prefix_smart_getter = function prefix() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.prefix; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._prefix !== undefined ? this._prefix : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.prefix_smart_getter);
Element.prototype.__defineGetter__("prefix", curMemoryArea.prefix_smart_getter);

// localName
curMemoryArea.localName_getter = function localName() { return this._localName; }; mframe.safefunction(curMemoryArea.localName_getter);
Object.defineProperty(curMemoryArea.localName_getter, "name", { value: "get localName", configurable: true, });
Object.defineProperty(Element.prototype, "localName", { get: curMemoryArea.localName_getter, enumerable: true, configurable: true, });
curMemoryArea.localName_smart_getter = function localName() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.localName; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._localName !== undefined ? this._localName : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.localName_smart_getter);
Element.prototype.__defineGetter__("localName", curMemoryArea.localName_smart_getter);

// tagName
curMemoryArea.tagName_getter = function tagName() { return this._tagName; }; mframe.safefunction(curMemoryArea.tagName_getter);
Object.defineProperty(curMemoryArea.tagName_getter, "name", { value: "get tagName", configurable: true, });
Object.defineProperty(Element.prototype, "tagName", { get: curMemoryArea.tagName_getter, enumerable: true, configurable: true, });
curMemoryArea.tagName_smart_getter = function tagName() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.tagName; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._tagName !== undefined ? this._tagName : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.tagName_smart_getter);
Element.prototype.__defineGetter__("tagName", curMemoryArea.tagName_smart_getter);

// id
curMemoryArea.id_getter = function id() { return this._id; }; mframe.safefunction(curMemoryArea.id_getter);
Object.defineProperty(curMemoryArea.id_getter, "name", { value: "get id", configurable: true, });
// id
curMemoryArea.id_setter = function id(val) { this._id = val; }; mframe.safefunction(curMemoryArea.id_setter);
Object.defineProperty(curMemoryArea.id_setter, "name", { value: "set id", configurable: true, });
Object.defineProperty(Element.prototype, "id", { get: curMemoryArea.id_getter, set: curMemoryArea.id_setter, enumerable: true, configurable: true, });
curMemoryArea.id_smart_getter = function id() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.id; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._id !== undefined ? this._id : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.id_smart_getter);
Element.prototype.__defineGetter__("id", curMemoryArea.id_smart_getter);

// className
curMemoryArea.className_getter = function className() { return this._className; }; mframe.safefunction(curMemoryArea.className_getter);
Object.defineProperty(curMemoryArea.className_getter, "name", { value: "get className", configurable: true, });
// className
curMemoryArea.className_setter = function className(val) { this._className = val; }; mframe.safefunction(curMemoryArea.className_setter);
Object.defineProperty(curMemoryArea.className_setter, "name", { value: "set className", configurable: true, });
Object.defineProperty(Element.prototype, "className", { get: curMemoryArea.className_getter, set: curMemoryArea.className_setter, enumerable: true, configurable: true, });
curMemoryArea.className_smart_getter = function className() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.className; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._className !== undefined ? this._className : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.className_smart_getter);
Element.prototype.__defineGetter__("className", curMemoryArea.className_smart_getter);

// classList
curMemoryArea.classList_getter = function classList() { return this._classList; }; mframe.safefunction(curMemoryArea.classList_getter);
Object.defineProperty(curMemoryArea.classList_getter, "name", { value: "get classList", configurable: true, });
// classList
curMemoryArea.classList_setter = function classList(val) { this._classList = val; }; mframe.safefunction(curMemoryArea.classList_setter);
Object.defineProperty(curMemoryArea.classList_setter, "name", { value: "set classList", configurable: true, });
Object.defineProperty(Element.prototype, "classList", { get: curMemoryArea.classList_getter, set: curMemoryArea.classList_setter, enumerable: true, configurable: true, });
curMemoryArea.classList_smart_getter = function classList() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.classList; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._classList !== undefined ? this._classList : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.classList_smart_getter);
Element.prototype.__defineGetter__("classList", curMemoryArea.classList_smart_getter);

// slot
curMemoryArea.slot_getter = function slot() { return this._slot; }; mframe.safefunction(curMemoryArea.slot_getter);
Object.defineProperty(curMemoryArea.slot_getter, "name", { value: "get slot", configurable: true, });
// slot
curMemoryArea.slot_setter = function slot(val) { this._slot = val; }; mframe.safefunction(curMemoryArea.slot_setter);
Object.defineProperty(curMemoryArea.slot_setter, "name", { value: "set slot", configurable: true, });
Object.defineProperty(Element.prototype, "slot", { get: curMemoryArea.slot_getter, set: curMemoryArea.slot_setter, enumerable: true, configurable: true, });
curMemoryArea.slot_smart_getter = function slot() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.slot; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._slot !== undefined ? this._slot : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.slot_smart_getter);
Element.prototype.__defineGetter__("slot", curMemoryArea.slot_smart_getter);

// attributes
curMemoryArea.attributes_getter = function attributes() { return this._attributes; }; mframe.safefunction(curMemoryArea.attributes_getter);
Object.defineProperty(curMemoryArea.attributes_getter, "name", { value: "get attributes", configurable: true, });
Object.defineProperty(Element.prototype, "attributes", { get: curMemoryArea.attributes_getter, enumerable: true, configurable: true, });
curMemoryArea.attributes_smart_getter = function attributes() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.attributes; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._attributes !== undefined ? this._attributes : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.attributes_smart_getter);
Element.prototype.__defineGetter__("attributes", curMemoryArea.attributes_smart_getter);

// shadowRoot
curMemoryArea.shadowRoot_getter = function shadowRoot() { return this._shadowRoot; }; mframe.safefunction(curMemoryArea.shadowRoot_getter);
Object.defineProperty(curMemoryArea.shadowRoot_getter, "name", { value: "get shadowRoot", configurable: true, });
Object.defineProperty(Element.prototype, "shadowRoot", { get: curMemoryArea.shadowRoot_getter, enumerable: true, configurable: true, });
curMemoryArea.shadowRoot_smart_getter = function shadowRoot() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.shadowRoot; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._shadowRoot !== undefined ? this._shadowRoot : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.shadowRoot_smart_getter);
Element.prototype.__defineGetter__("shadowRoot", curMemoryArea.shadowRoot_smart_getter);

// part
curMemoryArea.part_getter = function part() { return this._part; }; mframe.safefunction(curMemoryArea.part_getter);
Object.defineProperty(curMemoryArea.part_getter, "name", { value: "get part", configurable: true, });
// part
curMemoryArea.part_setter = function part(val) { this._part = val; }; mframe.safefunction(curMemoryArea.part_setter);
Object.defineProperty(curMemoryArea.part_setter, "name", { value: "set part", configurable: true, });
Object.defineProperty(Element.prototype, "part", { get: curMemoryArea.part_getter, set: curMemoryArea.part_setter, enumerable: true, configurable: true, });
curMemoryArea.part_smart_getter = function part() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.part; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._part !== undefined ? this._part : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.part_smart_getter);
Element.prototype.__defineGetter__("part", curMemoryArea.part_smart_getter);

// assignedSlot
curMemoryArea.assignedSlot_getter = function assignedSlot() { return this._assignedSlot; }; mframe.safefunction(curMemoryArea.assignedSlot_getter);
Object.defineProperty(curMemoryArea.assignedSlot_getter, "name", { value: "get assignedSlot", configurable: true, });
Object.defineProperty(Element.prototype, "assignedSlot", { get: curMemoryArea.assignedSlot_getter, enumerable: true, configurable: true, });
curMemoryArea.assignedSlot_smart_getter = function assignedSlot() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.assignedSlot; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._assignedSlot !== undefined ? this._assignedSlot : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.assignedSlot_smart_getter);
Element.prototype.__defineGetter__("assignedSlot", curMemoryArea.assignedSlot_smart_getter);

// innerHTML
curMemoryArea.innerHTML_getter = function innerHTML() { return this._innerHTML; }; mframe.safefunction(curMemoryArea.innerHTML_getter);
Object.defineProperty(curMemoryArea.innerHTML_getter, "name", { value: "get innerHTML", configurable: true, });
// innerHTML
curMemoryArea.innerHTML_setter = function innerHTML(val) {
    console.log("innerHTML: ", val);
    debugger;
    if (mframe.memory.jsdom.document) { this.jsdomMemory.innerHTML = val; }
    this._innerHTML = val;
}; mframe.safefunction(curMemoryArea.innerHTML_setter);
Object.defineProperty(curMemoryArea.innerHTML_setter, "name", { value: "set innerHTML", configurable: true, });
Object.defineProperty(Element.prototype, "innerHTML", { get: curMemoryArea.innerHTML_getter, set: curMemoryArea.innerHTML_setter, enumerable: true, configurable: true, });
curMemoryArea.innerHTML_smart_getter = function innerHTML() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.innerHTML; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._innerHTML !== undefined ? this._innerHTML : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.innerHTML_smart_getter);
Element.prototype.__defineGetter__("innerHTML", curMemoryArea.innerHTML_smart_getter);

// outerHTML
curMemoryArea.outerHTML_getter = function outerHTML() { return this._outerHTML; }; mframe.safefunction(curMemoryArea.outerHTML_getter);
Object.defineProperty(curMemoryArea.outerHTML_getter, "name", { value: "get outerHTML", configurable: true, });
// outerHTML
curMemoryArea.outerHTML_setter = function outerHTML(val) { this._outerHTML = val; }; mframe.safefunction(curMemoryArea.outerHTML_setter);
Object.defineProperty(curMemoryArea.outerHTML_setter, "name", { value: "set outerHTML", configurable: true, });
Object.defineProperty(Element.prototype, "outerHTML", { get: curMemoryArea.outerHTML_getter, set: curMemoryArea.outerHTML_setter, enumerable: true, configurable: true, });
curMemoryArea.outerHTML_smart_getter = function outerHTML() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.outerHTML; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._outerHTML !== undefined ? this._outerHTML : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.outerHTML_smart_getter);
Element.prototype.__defineGetter__("outerHTML", curMemoryArea.outerHTML_smart_getter);

// scrollTop
curMemoryArea.scrollTop_getter = function scrollTop() { return this._scrollTop; }; mframe.safefunction(curMemoryArea.scrollTop_getter);
Object.defineProperty(curMemoryArea.scrollTop_getter, "name", { value: "get scrollTop", configurable: true, });
// scrollTop
curMemoryArea.scrollTop_setter = function scrollTop(val) { this._scrollTop = val; }; mframe.safefunction(curMemoryArea.scrollTop_setter);
Object.defineProperty(curMemoryArea.scrollTop_setter, "name", { value: "set scrollTop", configurable: true, });
Object.defineProperty(Element.prototype, "scrollTop", { get: curMemoryArea.scrollTop_getter, set: curMemoryArea.scrollTop_setter, enumerable: true, configurable: true, });
curMemoryArea.scrollTop_smart_getter = function scrollTop() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.scrollTop; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scrollTop !== undefined ? this._scrollTop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scrollTop_smart_getter);
Element.prototype.__defineGetter__("scrollTop", curMemoryArea.scrollTop_smart_getter);

// scrollLeft
curMemoryArea.scrollLeft_getter = function scrollLeft() { return this._scrollLeft; }; mframe.safefunction(curMemoryArea.scrollLeft_getter);
Object.defineProperty(curMemoryArea.scrollLeft_getter, "name", { value: "get scrollLeft", configurable: true, });
// scrollLeft
curMemoryArea.scrollLeft_setter = function scrollLeft(val) { this._scrollLeft = val; }; mframe.safefunction(curMemoryArea.scrollLeft_setter);
Object.defineProperty(curMemoryArea.scrollLeft_setter, "name", { value: "set scrollLeft", configurable: true, });
Object.defineProperty(Element.prototype, "scrollLeft", { get: curMemoryArea.scrollLeft_getter, set: curMemoryArea.scrollLeft_setter, enumerable: true, configurable: true, });
curMemoryArea.scrollLeft_smart_getter = function scrollLeft() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.scrollLeft; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scrollLeft !== undefined ? this._scrollLeft : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scrollLeft_smart_getter);
Element.prototype.__defineGetter__("scrollLeft", curMemoryArea.scrollLeft_smart_getter);

// scrollWidth
curMemoryArea.scrollWidth_getter = function scrollWidth() { return this._scrollWidth; }; mframe.safefunction(curMemoryArea.scrollWidth_getter);
Object.defineProperty(curMemoryArea.scrollWidth_getter, "name", { value: "get scrollWidth", configurable: true, });
Object.defineProperty(Element.prototype, "scrollWidth", { get: curMemoryArea.scrollWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollWidth_smart_getter = function scrollWidth() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.scrollWidth; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scrollWidth !== undefined ? this._scrollWidth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scrollWidth_smart_getter);
Element.prototype.__defineGetter__("scrollWidth", curMemoryArea.scrollWidth_smart_getter);

// scrollHeight
curMemoryArea.scrollHeight_getter = function scrollHeight() { return this._scrollHeight; }; mframe.safefunction(curMemoryArea.scrollHeight_getter);
Object.defineProperty(curMemoryArea.scrollHeight_getter, "name", { value: "get scrollHeight", configurable: true, });
Object.defineProperty(Element.prototype, "scrollHeight", { get: curMemoryArea.scrollHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.scrollHeight_smart_getter = function scrollHeight() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.scrollHeight; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._scrollHeight !== undefined ? this._scrollHeight : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.scrollHeight_smart_getter);
Element.prototype.__defineGetter__("scrollHeight", curMemoryArea.scrollHeight_smart_getter);

// clientTop
curMemoryArea.clientTop_getter = function clientTop() { return this._clientTop; }; mframe.safefunction(curMemoryArea.clientTop_getter);
Object.defineProperty(curMemoryArea.clientTop_getter, "name", { value: "get clientTop", configurable: true, });
Object.defineProperty(Element.prototype, "clientTop", { get: curMemoryArea.clientTop_getter, enumerable: true, configurable: true, });
curMemoryArea.clientTop_smart_getter = function clientTop() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.clientTop; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._clientTop !== undefined ? this._clientTop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.clientTop_smart_getter);
Element.prototype.__defineGetter__("clientTop", curMemoryArea.clientTop_smart_getter);

// clientLeft
curMemoryArea.clientLeft_getter = function clientLeft() { return this._clientLeft; }; mframe.safefunction(curMemoryArea.clientLeft_getter);
Object.defineProperty(curMemoryArea.clientLeft_getter, "name", { value: "get clientLeft", configurable: true, });
Object.defineProperty(Element.prototype, "clientLeft", { get: curMemoryArea.clientLeft_getter, enumerable: true, configurable: true, });
curMemoryArea.clientLeft_smart_getter = function clientLeft() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.clientLeft; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._clientLeft !== undefined ? this._clientLeft : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.clientLeft_smart_getter);
Element.prototype.__defineGetter__("clientLeft", curMemoryArea.clientLeft_smart_getter);

// clientWidth
curMemoryArea.clientWidth_getter = function clientWidth() { return this._clientWidth; }; mframe.safefunction(curMemoryArea.clientWidth_getter);
Object.defineProperty(curMemoryArea.clientWidth_getter, "name", { value: "get clientWidth", configurable: true, });
Object.defineProperty(Element.prototype, "clientWidth", { get: curMemoryArea.clientWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.clientWidth_smart_getter = function clientWidth() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.clientWidth; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._clientWidth !== undefined ? this._clientWidth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.clientWidth_smart_getter);
Element.prototype.__defineGetter__("clientWidth", curMemoryArea.clientWidth_smart_getter);

// clientHeight
curMemoryArea.clientHeight_getter = function clientHeight() { return this._clientHeight; }; mframe.safefunction(curMemoryArea.clientHeight_getter);
Object.defineProperty(curMemoryArea.clientHeight_getter, "name", { value: "get clientHeight", configurable: true, });
Object.defineProperty(Element.prototype, "clientHeight", { get: curMemoryArea.clientHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.clientHeight_smart_getter = function clientHeight() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.clientHeight; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._clientHeight !== undefined ? this._clientHeight : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.clientHeight_smart_getter);
Element.prototype.__defineGetter__("clientHeight", curMemoryArea.clientHeight_smart_getter);

// onbeforecopy
curMemoryArea.onbeforecopy_getter = function onbeforecopy() { return this._onbeforecopy; }; mframe.safefunction(curMemoryArea.onbeforecopy_getter);
Object.defineProperty(curMemoryArea.onbeforecopy_getter, "name", { value: "get onbeforecopy", configurable: true, });
// onbeforecopy
curMemoryArea.onbeforecopy_setter = function onbeforecopy(val) { this._onbeforecopy = val; }; mframe.safefunction(curMemoryArea.onbeforecopy_setter);
Object.defineProperty(curMemoryArea.onbeforecopy_setter, "name", { value: "set onbeforecopy", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforecopy", { get: curMemoryArea.onbeforecopy_getter, set: curMemoryArea.onbeforecopy_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecopy_smart_getter = function onbeforecopy() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onbeforecopy; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforecopy !== undefined ? this._onbeforecopy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforecopy_smart_getter);
Element.prototype.__defineGetter__("onbeforecopy", curMemoryArea.onbeforecopy_smart_getter);

// onbeforecut
curMemoryArea.onbeforecut_getter = function onbeforecut() { return this._onbeforecut; }; mframe.safefunction(curMemoryArea.onbeforecut_getter);
Object.defineProperty(curMemoryArea.onbeforecut_getter, "name", { value: "get onbeforecut", configurable: true, });
// onbeforecut
curMemoryArea.onbeforecut_setter = function onbeforecut(val) { this._onbeforecut = val; }; mframe.safefunction(curMemoryArea.onbeforecut_setter);
Object.defineProperty(curMemoryArea.onbeforecut_setter, "name", { value: "set onbeforecut", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforecut", { get: curMemoryArea.onbeforecut_getter, set: curMemoryArea.onbeforecut_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforecut_smart_getter = function onbeforecut() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onbeforecut; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforecut !== undefined ? this._onbeforecut : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforecut_smart_getter);
Element.prototype.__defineGetter__("onbeforecut", curMemoryArea.onbeforecut_smart_getter);

// onbeforepaste
curMemoryArea.onbeforepaste_getter = function onbeforepaste() { return this._onbeforepaste; }; mframe.safefunction(curMemoryArea.onbeforepaste_getter);
Object.defineProperty(curMemoryArea.onbeforepaste_getter, "name", { value: "get onbeforepaste", configurable: true, });
// onbeforepaste
curMemoryArea.onbeforepaste_setter = function onbeforepaste(val) { this._onbeforepaste = val; }; mframe.safefunction(curMemoryArea.onbeforepaste_setter);
Object.defineProperty(curMemoryArea.onbeforepaste_setter, "name", { value: "set onbeforepaste", configurable: true, });
Object.defineProperty(Element.prototype, "onbeforepaste", { get: curMemoryArea.onbeforepaste_getter, set: curMemoryArea.onbeforepaste_setter, enumerable: true, configurable: true, });
curMemoryArea.onbeforepaste_smart_getter = function onbeforepaste() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onbeforepaste; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforepaste !== undefined ? this._onbeforepaste : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforepaste_smart_getter);
Element.prototype.__defineGetter__("onbeforepaste", curMemoryArea.onbeforepaste_smart_getter);

// onsearch
curMemoryArea.onsearch_getter = function onsearch() { return this._onsearch; }; mframe.safefunction(curMemoryArea.onsearch_getter);
Object.defineProperty(curMemoryArea.onsearch_getter, "name", { value: "get onsearch", configurable: true, });
// onsearch
curMemoryArea.onsearch_setter = function onsearch(val) { this._onsearch = val; }; mframe.safefunction(curMemoryArea.onsearch_setter);
Object.defineProperty(curMemoryArea.onsearch_setter, "name", { value: "set onsearch", configurable: true, });
Object.defineProperty(Element.prototype, "onsearch", { get: curMemoryArea.onsearch_getter, set: curMemoryArea.onsearch_setter, enumerable: true, configurable: true, });
curMemoryArea.onsearch_smart_getter = function onsearch() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onsearch; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onsearch !== undefined ? this._onsearch : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onsearch_smart_getter);
Element.prototype.__defineGetter__("onsearch", curMemoryArea.onsearch_smart_getter);

// elementTiming
curMemoryArea.elementTiming_getter = function elementTiming() { return this._elementTiming; }; mframe.safefunction(curMemoryArea.elementTiming_getter);
Object.defineProperty(curMemoryArea.elementTiming_getter, "name", { value: "get elementTiming", configurable: true, });
// elementTiming
curMemoryArea.elementTiming_setter = function elementTiming(val) { this._elementTiming = val; }; mframe.safefunction(curMemoryArea.elementTiming_setter);
Object.defineProperty(curMemoryArea.elementTiming_setter, "name", { value: "set elementTiming", configurable: true, });
Object.defineProperty(Element.prototype, "elementTiming", { get: curMemoryArea.elementTiming_getter, set: curMemoryArea.elementTiming_setter, enumerable: true, configurable: true, });
curMemoryArea.elementTiming_smart_getter = function elementTiming() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.elementTiming; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._elementTiming !== undefined ? this._elementTiming : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.elementTiming_smart_getter);
Element.prototype.__defineGetter__("elementTiming", curMemoryArea.elementTiming_smart_getter);

// onfullscreenchange
curMemoryArea.onfullscreenchange_getter = function onfullscreenchange() { return this._onfullscreenchange; }; mframe.safefunction(curMemoryArea.onfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onfullscreenchange_getter, "name", { value: "get onfullscreenchange", configurable: true, });
// onfullscreenchange
curMemoryArea.onfullscreenchange_setter = function onfullscreenchange(val) { this._onfullscreenchange = val; }; mframe.safefunction(curMemoryArea.onfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onfullscreenchange_setter, "name", { value: "set onfullscreenchange", configurable: true, });
Object.defineProperty(Element.prototype, "onfullscreenchange", { get: curMemoryArea.onfullscreenchange_getter, set: curMemoryArea.onfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenchange_smart_getter = function onfullscreenchange() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onfullscreenchange; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onfullscreenchange !== undefined ? this._onfullscreenchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onfullscreenchange_smart_getter);
Element.prototype.__defineGetter__("onfullscreenchange", curMemoryArea.onfullscreenchange_smart_getter);

// onfullscreenerror
curMemoryArea.onfullscreenerror_getter = function onfullscreenerror() { return this._onfullscreenerror; }; mframe.safefunction(curMemoryArea.onfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onfullscreenerror_getter, "name", { value: "get onfullscreenerror", configurable: true, });
// onfullscreenerror
curMemoryArea.onfullscreenerror_setter = function onfullscreenerror(val) { this._onfullscreenerror = val; }; mframe.safefunction(curMemoryArea.onfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onfullscreenerror_setter, "name", { value: "set onfullscreenerror", configurable: true, });
Object.defineProperty(Element.prototype, "onfullscreenerror", { get: curMemoryArea.onfullscreenerror_getter, set: curMemoryArea.onfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onfullscreenerror_smart_getter = function onfullscreenerror() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onfullscreenerror; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onfullscreenerror !== undefined ? this._onfullscreenerror : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onfullscreenerror_smart_getter);
Element.prototype.__defineGetter__("onfullscreenerror", curMemoryArea.onfullscreenerror_smart_getter);

// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_getter = function onwebkitfullscreenchange() { return this._onwebkitfullscreenchange; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_getter, "name", { value: "get onwebkitfullscreenchange", configurable: true, });
// onwebkitfullscreenchange
curMemoryArea.onwebkitfullscreenchange_setter = function onwebkitfullscreenchange(val) { this._onwebkitfullscreenchange = val; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenchange_setter, "name", { value: "set onwebkitfullscreenchange", configurable: true, });
Object.defineProperty(Element.prototype, "onwebkitfullscreenchange", { get: curMemoryArea.onwebkitfullscreenchange_getter, set: curMemoryArea.onwebkitfullscreenchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenchange_smart_getter = function onwebkitfullscreenchange() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onwebkitfullscreenchange; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitfullscreenchange !== undefined ? this._onwebkitfullscreenchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenchange_smart_getter);
Element.prototype.__defineGetter__("onwebkitfullscreenchange", curMemoryArea.onwebkitfullscreenchange_smart_getter);

// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_getter = function onwebkitfullscreenerror() { return this._onwebkitfullscreenerror; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_getter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_getter, "name", { value: "get onwebkitfullscreenerror", configurable: true, });
// onwebkitfullscreenerror
curMemoryArea.onwebkitfullscreenerror_setter = function onwebkitfullscreenerror(val) { this._onwebkitfullscreenerror = val; }; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_setter);
Object.defineProperty(curMemoryArea.onwebkitfullscreenerror_setter, "name", { value: "set onwebkitfullscreenerror", configurable: true, });
Object.defineProperty(Element.prototype, "onwebkitfullscreenerror", { get: curMemoryArea.onwebkitfullscreenerror_getter, set: curMemoryArea.onwebkitfullscreenerror_setter, enumerable: true, configurable: true, });
curMemoryArea.onwebkitfullscreenerror_smart_getter = function onwebkitfullscreenerror() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.onwebkitfullscreenerror; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitfullscreenerror !== undefined ? this._onwebkitfullscreenerror : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitfullscreenerror_smart_getter);
Element.prototype.__defineGetter__("onwebkitfullscreenerror", curMemoryArea.onwebkitfullscreenerror_smart_getter);

// role
curMemoryArea.role_getter = function role() { return this._role; }; mframe.safefunction(curMemoryArea.role_getter);
Object.defineProperty(curMemoryArea.role_getter, "name", { value: "get role", configurable: true, });
// role
curMemoryArea.role_setter = function role(val) { this._role = val; }; mframe.safefunction(curMemoryArea.role_setter);
Object.defineProperty(curMemoryArea.role_setter, "name", { value: "set role", configurable: true, });
Object.defineProperty(Element.prototype, "role", { get: curMemoryArea.role_getter, set: curMemoryArea.role_setter, enumerable: true, configurable: true, });
curMemoryArea.role_smart_getter = function role() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.role; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._role !== undefined ? this._role : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.role_smart_getter);
Element.prototype.__defineGetter__("role", curMemoryArea.role_smart_getter);

// ariaAtomic
curMemoryArea.ariaAtomic_getter = function ariaAtomic() { return this._ariaAtomic; }; mframe.safefunction(curMemoryArea.ariaAtomic_getter);
Object.defineProperty(curMemoryArea.ariaAtomic_getter, "name", { value: "get ariaAtomic", configurable: true, });
// ariaAtomic
curMemoryArea.ariaAtomic_setter = function ariaAtomic(val) { this._ariaAtomic = val; }; mframe.safefunction(curMemoryArea.ariaAtomic_setter);
Object.defineProperty(curMemoryArea.ariaAtomic_setter, "name", { value: "set ariaAtomic", configurable: true, });
Object.defineProperty(Element.prototype, "ariaAtomic", { get: curMemoryArea.ariaAtomic_getter, set: curMemoryArea.ariaAtomic_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaAtomic_smart_getter = function ariaAtomic() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaAtomic; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaAtomic !== undefined ? this._ariaAtomic : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaAtomic_smart_getter);
Element.prototype.__defineGetter__("ariaAtomic", curMemoryArea.ariaAtomic_smart_getter);

// ariaAutoComplete
curMemoryArea.ariaAutoComplete_getter = function ariaAutoComplete() { return this._ariaAutoComplete; }; mframe.safefunction(curMemoryArea.ariaAutoComplete_getter);
Object.defineProperty(curMemoryArea.ariaAutoComplete_getter, "name", { value: "get ariaAutoComplete", configurable: true, });
// ariaAutoComplete
curMemoryArea.ariaAutoComplete_setter = function ariaAutoComplete(val) { this._ariaAutoComplete = val; }; mframe.safefunction(curMemoryArea.ariaAutoComplete_setter);
Object.defineProperty(curMemoryArea.ariaAutoComplete_setter, "name", { value: "set ariaAutoComplete", configurable: true, });
Object.defineProperty(Element.prototype, "ariaAutoComplete", { get: curMemoryArea.ariaAutoComplete_getter, set: curMemoryArea.ariaAutoComplete_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaAutoComplete_smart_getter = function ariaAutoComplete() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaAutoComplete; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaAutoComplete !== undefined ? this._ariaAutoComplete : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaAutoComplete_smart_getter);
Element.prototype.__defineGetter__("ariaAutoComplete", curMemoryArea.ariaAutoComplete_smart_getter);

// ariaBusy
curMemoryArea.ariaBusy_getter = function ariaBusy() { return this._ariaBusy; }; mframe.safefunction(curMemoryArea.ariaBusy_getter);
Object.defineProperty(curMemoryArea.ariaBusy_getter, "name", { value: "get ariaBusy", configurable: true, });
// ariaBusy
curMemoryArea.ariaBusy_setter = function ariaBusy(val) { this._ariaBusy = val; }; mframe.safefunction(curMemoryArea.ariaBusy_setter);
Object.defineProperty(curMemoryArea.ariaBusy_setter, "name", { value: "set ariaBusy", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBusy", { get: curMemoryArea.ariaBusy_getter, set: curMemoryArea.ariaBusy_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBusy_smart_getter = function ariaBusy() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaBusy; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaBusy !== undefined ? this._ariaBusy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaBusy_smart_getter);
Element.prototype.__defineGetter__("ariaBusy", curMemoryArea.ariaBusy_smart_getter);

// ariaBrailleLabel
curMemoryArea.ariaBrailleLabel_getter = function ariaBrailleLabel() { return this._ariaBrailleLabel; }; mframe.safefunction(curMemoryArea.ariaBrailleLabel_getter);
Object.defineProperty(curMemoryArea.ariaBrailleLabel_getter, "name", { value: "get ariaBrailleLabel", configurable: true, });
// ariaBrailleLabel
curMemoryArea.ariaBrailleLabel_setter = function ariaBrailleLabel(val) { this._ariaBrailleLabel = val; }; mframe.safefunction(curMemoryArea.ariaBrailleLabel_setter);
Object.defineProperty(curMemoryArea.ariaBrailleLabel_setter, "name", { value: "set ariaBrailleLabel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBrailleLabel", { get: curMemoryArea.ariaBrailleLabel_getter, set: curMemoryArea.ariaBrailleLabel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBrailleLabel_smart_getter = function ariaBrailleLabel() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaBrailleLabel; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaBrailleLabel !== undefined ? this._ariaBrailleLabel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaBrailleLabel_smart_getter);
Element.prototype.__defineGetter__("ariaBrailleLabel", curMemoryArea.ariaBrailleLabel_smart_getter);

// ariaBrailleRoleDescription
curMemoryArea.ariaBrailleRoleDescription_getter = function ariaBrailleRoleDescription() { return this._ariaBrailleRoleDescription; }; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_getter);
Object.defineProperty(curMemoryArea.ariaBrailleRoleDescription_getter, "name", { value: "get ariaBrailleRoleDescription", configurable: true, });
// ariaBrailleRoleDescription
curMemoryArea.ariaBrailleRoleDescription_setter = function ariaBrailleRoleDescription(val) { this._ariaBrailleRoleDescription = val; }; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_setter);
Object.defineProperty(curMemoryArea.ariaBrailleRoleDescription_setter, "name", { value: "set ariaBrailleRoleDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaBrailleRoleDescription", { get: curMemoryArea.ariaBrailleRoleDescription_getter, set: curMemoryArea.ariaBrailleRoleDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaBrailleRoleDescription_smart_getter = function ariaBrailleRoleDescription() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaBrailleRoleDescription; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaBrailleRoleDescription !== undefined ? this._ariaBrailleRoleDescription : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaBrailleRoleDescription_smart_getter);
Element.prototype.__defineGetter__("ariaBrailleRoleDescription", curMemoryArea.ariaBrailleRoleDescription_smart_getter);

// ariaChecked
curMemoryArea.ariaChecked_getter = function ariaChecked() { return this._ariaChecked; }; mframe.safefunction(curMemoryArea.ariaChecked_getter);
Object.defineProperty(curMemoryArea.ariaChecked_getter, "name", { value: "get ariaChecked", configurable: true, });
// ariaChecked
curMemoryArea.ariaChecked_setter = function ariaChecked(val) { this._ariaChecked = val; }; mframe.safefunction(curMemoryArea.ariaChecked_setter);
Object.defineProperty(curMemoryArea.ariaChecked_setter, "name", { value: "set ariaChecked", configurable: true, });
Object.defineProperty(Element.prototype, "ariaChecked", { get: curMemoryArea.ariaChecked_getter, set: curMemoryArea.ariaChecked_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaChecked_smart_getter = function ariaChecked() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaChecked; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaChecked !== undefined ? this._ariaChecked : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaChecked_smart_getter);
Element.prototype.__defineGetter__("ariaChecked", curMemoryArea.ariaChecked_smart_getter);

// ariaColCount
curMemoryArea.ariaColCount_getter = function ariaColCount() { return this._ariaColCount; }; mframe.safefunction(curMemoryArea.ariaColCount_getter);
Object.defineProperty(curMemoryArea.ariaColCount_getter, "name", { value: "get ariaColCount", configurable: true, });
// ariaColCount
curMemoryArea.ariaColCount_setter = function ariaColCount(val) { this._ariaColCount = val; }; mframe.safefunction(curMemoryArea.ariaColCount_setter);
Object.defineProperty(curMemoryArea.ariaColCount_setter, "name", { value: "set ariaColCount", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColCount", { get: curMemoryArea.ariaColCount_getter, set: curMemoryArea.ariaColCount_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColCount_smart_getter = function ariaColCount() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaColCount; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaColCount !== undefined ? this._ariaColCount : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaColCount_smart_getter);
Element.prototype.__defineGetter__("ariaColCount", curMemoryArea.ariaColCount_smart_getter);

// ariaColIndex
curMemoryArea.ariaColIndex_getter = function ariaColIndex() { return this._ariaColIndex; }; mframe.safefunction(curMemoryArea.ariaColIndex_getter);
Object.defineProperty(curMemoryArea.ariaColIndex_getter, "name", { value: "get ariaColIndex", configurable: true, });
// ariaColIndex
curMemoryArea.ariaColIndex_setter = function ariaColIndex(val) { this._ariaColIndex = val; }; mframe.safefunction(curMemoryArea.ariaColIndex_setter);
Object.defineProperty(curMemoryArea.ariaColIndex_setter, "name", { value: "set ariaColIndex", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColIndex", { get: curMemoryArea.ariaColIndex_getter, set: curMemoryArea.ariaColIndex_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColIndex_smart_getter = function ariaColIndex() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaColIndex; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaColIndex !== undefined ? this._ariaColIndex : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaColIndex_smart_getter);
Element.prototype.__defineGetter__("ariaColIndex", curMemoryArea.ariaColIndex_smart_getter);

// ariaColSpan
curMemoryArea.ariaColSpan_getter = function ariaColSpan() { return this._ariaColSpan; }; mframe.safefunction(curMemoryArea.ariaColSpan_getter);
Object.defineProperty(curMemoryArea.ariaColSpan_getter, "name", { value: "get ariaColSpan", configurable: true, });
// ariaColSpan
curMemoryArea.ariaColSpan_setter = function ariaColSpan(val) { this._ariaColSpan = val; }; mframe.safefunction(curMemoryArea.ariaColSpan_setter);
Object.defineProperty(curMemoryArea.ariaColSpan_setter, "name", { value: "set ariaColSpan", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColSpan", { get: curMemoryArea.ariaColSpan_getter, set: curMemoryArea.ariaColSpan_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColSpan_smart_getter = function ariaColSpan() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaColSpan; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaColSpan !== undefined ? this._ariaColSpan : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaColSpan_smart_getter);
Element.prototype.__defineGetter__("ariaColSpan", curMemoryArea.ariaColSpan_smart_getter);

// ariaCurrent
curMemoryArea.ariaCurrent_getter = function ariaCurrent() { return this._ariaCurrent; }; mframe.safefunction(curMemoryArea.ariaCurrent_getter);
Object.defineProperty(curMemoryArea.ariaCurrent_getter, "name", { value: "get ariaCurrent", configurable: true, });
// ariaCurrent
curMemoryArea.ariaCurrent_setter = function ariaCurrent(val) { this._ariaCurrent = val; }; mframe.safefunction(curMemoryArea.ariaCurrent_setter);
Object.defineProperty(curMemoryArea.ariaCurrent_setter, "name", { value: "set ariaCurrent", configurable: true, });
Object.defineProperty(Element.prototype, "ariaCurrent", { get: curMemoryArea.ariaCurrent_getter, set: curMemoryArea.ariaCurrent_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaCurrent_smart_getter = function ariaCurrent() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaCurrent; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaCurrent !== undefined ? this._ariaCurrent : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaCurrent_smart_getter);
Element.prototype.__defineGetter__("ariaCurrent", curMemoryArea.ariaCurrent_smart_getter);

// ariaDescription
curMemoryArea.ariaDescription_getter = function ariaDescription() { return this._ariaDescription; }; mframe.safefunction(curMemoryArea.ariaDescription_getter);
Object.defineProperty(curMemoryArea.ariaDescription_getter, "name", { value: "get ariaDescription", configurable: true, });
// ariaDescription
curMemoryArea.ariaDescription_setter = function ariaDescription(val) { this._ariaDescription = val; }; mframe.safefunction(curMemoryArea.ariaDescription_setter);
Object.defineProperty(curMemoryArea.ariaDescription_setter, "name", { value: "set ariaDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDescription", { get: curMemoryArea.ariaDescription_getter, set: curMemoryArea.ariaDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDescription_smart_getter = function ariaDescription() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaDescription; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaDescription !== undefined ? this._ariaDescription : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaDescription_smart_getter);
Element.prototype.__defineGetter__("ariaDescription", curMemoryArea.ariaDescription_smart_getter);

// ariaDisabled
curMemoryArea.ariaDisabled_getter = function ariaDisabled() { return this._ariaDisabled; }; mframe.safefunction(curMemoryArea.ariaDisabled_getter);
Object.defineProperty(curMemoryArea.ariaDisabled_getter, "name", { value: "get ariaDisabled", configurable: true, });
// ariaDisabled
curMemoryArea.ariaDisabled_setter = function ariaDisabled(val) { this._ariaDisabled = val; }; mframe.safefunction(curMemoryArea.ariaDisabled_setter);
Object.defineProperty(curMemoryArea.ariaDisabled_setter, "name", { value: "set ariaDisabled", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDisabled", { get: curMemoryArea.ariaDisabled_getter, set: curMemoryArea.ariaDisabled_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDisabled_smart_getter = function ariaDisabled() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaDisabled; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaDisabled !== undefined ? this._ariaDisabled : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaDisabled_smart_getter);
Element.prototype.__defineGetter__("ariaDisabled", curMemoryArea.ariaDisabled_smart_getter);

// ariaExpanded
curMemoryArea.ariaExpanded_getter = function ariaExpanded() { return this._ariaExpanded; }; mframe.safefunction(curMemoryArea.ariaExpanded_getter);
Object.defineProperty(curMemoryArea.ariaExpanded_getter, "name", { value: "get ariaExpanded", configurable: true, });
// ariaExpanded
curMemoryArea.ariaExpanded_setter = function ariaExpanded(val) { this._ariaExpanded = val; }; mframe.safefunction(curMemoryArea.ariaExpanded_setter);
Object.defineProperty(curMemoryArea.ariaExpanded_setter, "name", { value: "set ariaExpanded", configurable: true, });
Object.defineProperty(Element.prototype, "ariaExpanded", { get: curMemoryArea.ariaExpanded_getter, set: curMemoryArea.ariaExpanded_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaExpanded_smart_getter = function ariaExpanded() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaExpanded; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaExpanded !== undefined ? this._ariaExpanded : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaExpanded_smart_getter);
Element.prototype.__defineGetter__("ariaExpanded", curMemoryArea.ariaExpanded_smart_getter);

// ariaHasPopup
curMemoryArea.ariaHasPopup_getter = function ariaHasPopup() { return this._ariaHasPopup; }; mframe.safefunction(curMemoryArea.ariaHasPopup_getter);
Object.defineProperty(curMemoryArea.ariaHasPopup_getter, "name", { value: "get ariaHasPopup", configurable: true, });
// ariaHasPopup
curMemoryArea.ariaHasPopup_setter = function ariaHasPopup(val) { this._ariaHasPopup = val; }; mframe.safefunction(curMemoryArea.ariaHasPopup_setter);
Object.defineProperty(curMemoryArea.ariaHasPopup_setter, "name", { value: "set ariaHasPopup", configurable: true, });
Object.defineProperty(Element.prototype, "ariaHasPopup", { get: curMemoryArea.ariaHasPopup_getter, set: curMemoryArea.ariaHasPopup_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaHasPopup_smart_getter = function ariaHasPopup() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaHasPopup; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaHasPopup !== undefined ? this._ariaHasPopup : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaHasPopup_smart_getter);
Element.prototype.__defineGetter__("ariaHasPopup", curMemoryArea.ariaHasPopup_smart_getter);

// ariaHidden
curMemoryArea.ariaHidden_getter = function ariaHidden() { return this._ariaHidden; }; mframe.safefunction(curMemoryArea.ariaHidden_getter);
Object.defineProperty(curMemoryArea.ariaHidden_getter, "name", { value: "get ariaHidden", configurable: true, });
// ariaHidden
curMemoryArea.ariaHidden_setter = function ariaHidden(val) { this._ariaHidden = val; }; mframe.safefunction(curMemoryArea.ariaHidden_setter);
Object.defineProperty(curMemoryArea.ariaHidden_setter, "name", { value: "set ariaHidden", configurable: true, });
Object.defineProperty(Element.prototype, "ariaHidden", { get: curMemoryArea.ariaHidden_getter, set: curMemoryArea.ariaHidden_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaHidden_smart_getter = function ariaHidden() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaHidden; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaHidden !== undefined ? this._ariaHidden : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaHidden_smart_getter);
Element.prototype.__defineGetter__("ariaHidden", curMemoryArea.ariaHidden_smart_getter);

// ariaInvalid
curMemoryArea.ariaInvalid_getter = function ariaInvalid() { return this._ariaInvalid; }; mframe.safefunction(curMemoryArea.ariaInvalid_getter);
Object.defineProperty(curMemoryArea.ariaInvalid_getter, "name", { value: "get ariaInvalid", configurable: true, });
// ariaInvalid
curMemoryArea.ariaInvalid_setter = function ariaInvalid(val) { this._ariaInvalid = val; }; mframe.safefunction(curMemoryArea.ariaInvalid_setter);
Object.defineProperty(curMemoryArea.ariaInvalid_setter, "name", { value: "set ariaInvalid", configurable: true, });
Object.defineProperty(Element.prototype, "ariaInvalid", { get: curMemoryArea.ariaInvalid_getter, set: curMemoryArea.ariaInvalid_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaInvalid_smart_getter = function ariaInvalid() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaInvalid; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaInvalid !== undefined ? this._ariaInvalid : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaInvalid_smart_getter);
Element.prototype.__defineGetter__("ariaInvalid", curMemoryArea.ariaInvalid_smart_getter);

// ariaKeyShortcuts
curMemoryArea.ariaKeyShortcuts_getter = function ariaKeyShortcuts() { return this._ariaKeyShortcuts; }; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_getter);
Object.defineProperty(curMemoryArea.ariaKeyShortcuts_getter, "name", { value: "get ariaKeyShortcuts", configurable: true, });
// ariaKeyShortcuts
curMemoryArea.ariaKeyShortcuts_setter = function ariaKeyShortcuts(val) { this._ariaKeyShortcuts = val; }; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_setter);
Object.defineProperty(curMemoryArea.ariaKeyShortcuts_setter, "name", { value: "set ariaKeyShortcuts", configurable: true, });
Object.defineProperty(Element.prototype, "ariaKeyShortcuts", { get: curMemoryArea.ariaKeyShortcuts_getter, set: curMemoryArea.ariaKeyShortcuts_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaKeyShortcuts_smart_getter = function ariaKeyShortcuts() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaKeyShortcuts; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaKeyShortcuts !== undefined ? this._ariaKeyShortcuts : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaKeyShortcuts_smart_getter);
Element.prototype.__defineGetter__("ariaKeyShortcuts", curMemoryArea.ariaKeyShortcuts_smart_getter);

// ariaLabel
curMemoryArea.ariaLabel_getter = function ariaLabel() { return this._ariaLabel; }; mframe.safefunction(curMemoryArea.ariaLabel_getter);
Object.defineProperty(curMemoryArea.ariaLabel_getter, "name", { value: "get ariaLabel", configurable: true, });
// ariaLabel
curMemoryArea.ariaLabel_setter = function ariaLabel(val) { this._ariaLabel = val; }; mframe.safefunction(curMemoryArea.ariaLabel_setter);
Object.defineProperty(curMemoryArea.ariaLabel_setter, "name", { value: "set ariaLabel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLabel", { get: curMemoryArea.ariaLabel_getter, set: curMemoryArea.ariaLabel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLabel_smart_getter = function ariaLabel() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaLabel; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaLabel !== undefined ? this._ariaLabel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaLabel_smart_getter);
Element.prototype.__defineGetter__("ariaLabel", curMemoryArea.ariaLabel_smart_getter);

// ariaLevel
curMemoryArea.ariaLevel_getter = function ariaLevel() { return this._ariaLevel; }; mframe.safefunction(curMemoryArea.ariaLevel_getter);
Object.defineProperty(curMemoryArea.ariaLevel_getter, "name", { value: "get ariaLevel", configurable: true, });
// ariaLevel
curMemoryArea.ariaLevel_setter = function ariaLevel(val) { this._ariaLevel = val; }; mframe.safefunction(curMemoryArea.ariaLevel_setter);
Object.defineProperty(curMemoryArea.ariaLevel_setter, "name", { value: "set ariaLevel", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLevel", { get: curMemoryArea.ariaLevel_getter, set: curMemoryArea.ariaLevel_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLevel_smart_getter = function ariaLevel() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaLevel; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaLevel !== undefined ? this._ariaLevel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaLevel_smart_getter);
Element.prototype.__defineGetter__("ariaLevel", curMemoryArea.ariaLevel_smart_getter);

// ariaLive
curMemoryArea.ariaLive_getter = function ariaLive() { return this._ariaLive; }; mframe.safefunction(curMemoryArea.ariaLive_getter);
Object.defineProperty(curMemoryArea.ariaLive_getter, "name", { value: "get ariaLive", configurable: true, });
// ariaLive
curMemoryArea.ariaLive_setter = function ariaLive(val) { this._ariaLive = val; }; mframe.safefunction(curMemoryArea.ariaLive_setter);
Object.defineProperty(curMemoryArea.ariaLive_setter, "name", { value: "set ariaLive", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLive", { get: curMemoryArea.ariaLive_getter, set: curMemoryArea.ariaLive_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLive_smart_getter = function ariaLive() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaLive; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaLive !== undefined ? this._ariaLive : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaLive_smart_getter);
Element.prototype.__defineGetter__("ariaLive", curMemoryArea.ariaLive_smart_getter);

// ariaModal
curMemoryArea.ariaModal_getter = function ariaModal() { return this._ariaModal; }; mframe.safefunction(curMemoryArea.ariaModal_getter);
Object.defineProperty(curMemoryArea.ariaModal_getter, "name", { value: "get ariaModal", configurable: true, });
// ariaModal
curMemoryArea.ariaModal_setter = function ariaModal(val) { this._ariaModal = val; }; mframe.safefunction(curMemoryArea.ariaModal_setter);
Object.defineProperty(curMemoryArea.ariaModal_setter, "name", { value: "set ariaModal", configurable: true, });
Object.defineProperty(Element.prototype, "ariaModal", { get: curMemoryArea.ariaModal_getter, set: curMemoryArea.ariaModal_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaModal_smart_getter = function ariaModal() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaModal; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaModal !== undefined ? this._ariaModal : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaModal_smart_getter);
Element.prototype.__defineGetter__("ariaModal", curMemoryArea.ariaModal_smart_getter);

// ariaMultiLine
curMemoryArea.ariaMultiLine_getter = function ariaMultiLine() { return this._ariaMultiLine; }; mframe.safefunction(curMemoryArea.ariaMultiLine_getter);
Object.defineProperty(curMemoryArea.ariaMultiLine_getter, "name", { value: "get ariaMultiLine", configurable: true, });
// ariaMultiLine
curMemoryArea.ariaMultiLine_setter = function ariaMultiLine(val) { this._ariaMultiLine = val; }; mframe.safefunction(curMemoryArea.ariaMultiLine_setter);
Object.defineProperty(curMemoryArea.ariaMultiLine_setter, "name", { value: "set ariaMultiLine", configurable: true, });
Object.defineProperty(Element.prototype, "ariaMultiLine", { get: curMemoryArea.ariaMultiLine_getter, set: curMemoryArea.ariaMultiLine_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaMultiLine_smart_getter = function ariaMultiLine() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaMultiLine; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaMultiLine !== undefined ? this._ariaMultiLine : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaMultiLine_smart_getter);
Element.prototype.__defineGetter__("ariaMultiLine", curMemoryArea.ariaMultiLine_smart_getter);

// ariaMultiSelectable
curMemoryArea.ariaMultiSelectable_getter = function ariaMultiSelectable() { return this._ariaMultiSelectable; }; mframe.safefunction(curMemoryArea.ariaMultiSelectable_getter);
Object.defineProperty(curMemoryArea.ariaMultiSelectable_getter, "name", { value: "get ariaMultiSelectable", configurable: true, });
// ariaMultiSelectable
curMemoryArea.ariaMultiSelectable_setter = function ariaMultiSelectable(val) { this._ariaMultiSelectable = val; }; mframe.safefunction(curMemoryArea.ariaMultiSelectable_setter);
Object.defineProperty(curMemoryArea.ariaMultiSelectable_setter, "name", { value: "set ariaMultiSelectable", configurable: true, });
Object.defineProperty(Element.prototype, "ariaMultiSelectable", { get: curMemoryArea.ariaMultiSelectable_getter, set: curMemoryArea.ariaMultiSelectable_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaMultiSelectable_smart_getter = function ariaMultiSelectable() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaMultiSelectable; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaMultiSelectable !== undefined ? this._ariaMultiSelectable : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaMultiSelectable_smart_getter);
Element.prototype.__defineGetter__("ariaMultiSelectable", curMemoryArea.ariaMultiSelectable_smart_getter);

// ariaOrientation
curMemoryArea.ariaOrientation_getter = function ariaOrientation() { return this._ariaOrientation; }; mframe.safefunction(curMemoryArea.ariaOrientation_getter);
Object.defineProperty(curMemoryArea.ariaOrientation_getter, "name", { value: "get ariaOrientation", configurable: true, });
// ariaOrientation
curMemoryArea.ariaOrientation_setter = function ariaOrientation(val) { this._ariaOrientation = val; }; mframe.safefunction(curMemoryArea.ariaOrientation_setter);
Object.defineProperty(curMemoryArea.ariaOrientation_setter, "name", { value: "set ariaOrientation", configurable: true, });
Object.defineProperty(Element.prototype, "ariaOrientation", { get: curMemoryArea.ariaOrientation_getter, set: curMemoryArea.ariaOrientation_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaOrientation_smart_getter = function ariaOrientation() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaOrientation; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaOrientation !== undefined ? this._ariaOrientation : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaOrientation_smart_getter);
Element.prototype.__defineGetter__("ariaOrientation", curMemoryArea.ariaOrientation_smart_getter);

// ariaPlaceholder
curMemoryArea.ariaPlaceholder_getter = function ariaPlaceholder() { return this._ariaPlaceholder; }; mframe.safefunction(curMemoryArea.ariaPlaceholder_getter);
Object.defineProperty(curMemoryArea.ariaPlaceholder_getter, "name", { value: "get ariaPlaceholder", configurable: true, });
// ariaPlaceholder
curMemoryArea.ariaPlaceholder_setter = function ariaPlaceholder(val) { this._ariaPlaceholder = val; }; mframe.safefunction(curMemoryArea.ariaPlaceholder_setter);
Object.defineProperty(curMemoryArea.ariaPlaceholder_setter, "name", { value: "set ariaPlaceholder", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPlaceholder", { get: curMemoryArea.ariaPlaceholder_getter, set: curMemoryArea.ariaPlaceholder_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPlaceholder_smart_getter = function ariaPlaceholder() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaPlaceholder; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaPlaceholder !== undefined ? this._ariaPlaceholder : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaPlaceholder_smart_getter);
Element.prototype.__defineGetter__("ariaPlaceholder", curMemoryArea.ariaPlaceholder_smart_getter);

// ariaPosInSet
curMemoryArea.ariaPosInSet_getter = function ariaPosInSet() { return this._ariaPosInSet; }; mframe.safefunction(curMemoryArea.ariaPosInSet_getter);
Object.defineProperty(curMemoryArea.ariaPosInSet_getter, "name", { value: "get ariaPosInSet", configurable: true, });
// ariaPosInSet
curMemoryArea.ariaPosInSet_setter = function ariaPosInSet(val) { this._ariaPosInSet = val; }; mframe.safefunction(curMemoryArea.ariaPosInSet_setter);
Object.defineProperty(curMemoryArea.ariaPosInSet_setter, "name", { value: "set ariaPosInSet", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPosInSet", { get: curMemoryArea.ariaPosInSet_getter, set: curMemoryArea.ariaPosInSet_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPosInSet_smart_getter = function ariaPosInSet() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaPosInSet; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaPosInSet !== undefined ? this._ariaPosInSet : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaPosInSet_smart_getter);
Element.prototype.__defineGetter__("ariaPosInSet", curMemoryArea.ariaPosInSet_smart_getter);

// ariaPressed
curMemoryArea.ariaPressed_getter = function ariaPressed() { return this._ariaPressed; }; mframe.safefunction(curMemoryArea.ariaPressed_getter);
Object.defineProperty(curMemoryArea.ariaPressed_getter, "name", { value: "get ariaPressed", configurable: true, });
// ariaPressed
curMemoryArea.ariaPressed_setter = function ariaPressed(val) { this._ariaPressed = val; }; mframe.safefunction(curMemoryArea.ariaPressed_setter);
Object.defineProperty(curMemoryArea.ariaPressed_setter, "name", { value: "set ariaPressed", configurable: true, });
Object.defineProperty(Element.prototype, "ariaPressed", { get: curMemoryArea.ariaPressed_getter, set: curMemoryArea.ariaPressed_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaPressed_smart_getter = function ariaPressed() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaPressed; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaPressed !== undefined ? this._ariaPressed : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaPressed_smart_getter);
Element.prototype.__defineGetter__("ariaPressed", curMemoryArea.ariaPressed_smart_getter);

// ariaReadOnly
curMemoryArea.ariaReadOnly_getter = function ariaReadOnly() { return this._ariaReadOnly; }; mframe.safefunction(curMemoryArea.ariaReadOnly_getter);
Object.defineProperty(curMemoryArea.ariaReadOnly_getter, "name", { value: "get ariaReadOnly", configurable: true, });
// ariaReadOnly
curMemoryArea.ariaReadOnly_setter = function ariaReadOnly(val) { this._ariaReadOnly = val; }; mframe.safefunction(curMemoryArea.ariaReadOnly_setter);
Object.defineProperty(curMemoryArea.ariaReadOnly_setter, "name", { value: "set ariaReadOnly", configurable: true, });
Object.defineProperty(Element.prototype, "ariaReadOnly", { get: curMemoryArea.ariaReadOnly_getter, set: curMemoryArea.ariaReadOnly_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaReadOnly_smart_getter = function ariaReadOnly() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaReadOnly; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaReadOnly !== undefined ? this._ariaReadOnly : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaReadOnly_smart_getter);
Element.prototype.__defineGetter__("ariaReadOnly", curMemoryArea.ariaReadOnly_smart_getter);

// ariaRelevant
curMemoryArea.ariaRelevant_getter = function ariaRelevant() { return this._ariaRelevant; }; mframe.safefunction(curMemoryArea.ariaRelevant_getter);
Object.defineProperty(curMemoryArea.ariaRelevant_getter, "name", { value: "get ariaRelevant", configurable: true, });
// ariaRelevant
curMemoryArea.ariaRelevant_setter = function ariaRelevant(val) { this._ariaRelevant = val; }; mframe.safefunction(curMemoryArea.ariaRelevant_setter);
Object.defineProperty(curMemoryArea.ariaRelevant_setter, "name", { value: "set ariaRelevant", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRelevant", { get: curMemoryArea.ariaRelevant_getter, set: curMemoryArea.ariaRelevant_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRelevant_smart_getter = function ariaRelevant() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRelevant; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRelevant !== undefined ? this._ariaRelevant : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRelevant_smart_getter);
Element.prototype.__defineGetter__("ariaRelevant", curMemoryArea.ariaRelevant_smart_getter);

// ariaRequired
curMemoryArea.ariaRequired_getter = function ariaRequired() { return this._ariaRequired; }; mframe.safefunction(curMemoryArea.ariaRequired_getter);
Object.defineProperty(curMemoryArea.ariaRequired_getter, "name", { value: "get ariaRequired", configurable: true, });
// ariaRequired
curMemoryArea.ariaRequired_setter = function ariaRequired(val) { this._ariaRequired = val; }; mframe.safefunction(curMemoryArea.ariaRequired_setter);
Object.defineProperty(curMemoryArea.ariaRequired_setter, "name", { value: "set ariaRequired", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRequired", { get: curMemoryArea.ariaRequired_getter, set: curMemoryArea.ariaRequired_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRequired_smart_getter = function ariaRequired() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRequired; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRequired !== undefined ? this._ariaRequired : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRequired_smart_getter);
Element.prototype.__defineGetter__("ariaRequired", curMemoryArea.ariaRequired_smart_getter);

// ariaRoleDescription
curMemoryArea.ariaRoleDescription_getter = function ariaRoleDescription() { return this._ariaRoleDescription; }; mframe.safefunction(curMemoryArea.ariaRoleDescription_getter);
Object.defineProperty(curMemoryArea.ariaRoleDescription_getter, "name", { value: "get ariaRoleDescription", configurable: true, });
// ariaRoleDescription
curMemoryArea.ariaRoleDescription_setter = function ariaRoleDescription(val) { this._ariaRoleDescription = val; }; mframe.safefunction(curMemoryArea.ariaRoleDescription_setter);
Object.defineProperty(curMemoryArea.ariaRoleDescription_setter, "name", { value: "set ariaRoleDescription", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRoleDescription", { get: curMemoryArea.ariaRoleDescription_getter, set: curMemoryArea.ariaRoleDescription_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRoleDescription_smart_getter = function ariaRoleDescription() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRoleDescription; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRoleDescription !== undefined ? this._ariaRoleDescription : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRoleDescription_smart_getter);
Element.prototype.__defineGetter__("ariaRoleDescription", curMemoryArea.ariaRoleDescription_smart_getter);

// ariaRowCount
curMemoryArea.ariaRowCount_getter = function ariaRowCount() { return this._ariaRowCount; }; mframe.safefunction(curMemoryArea.ariaRowCount_getter);
Object.defineProperty(curMemoryArea.ariaRowCount_getter, "name", { value: "get ariaRowCount", configurable: true, });
// ariaRowCount
curMemoryArea.ariaRowCount_setter = function ariaRowCount(val) { this._ariaRowCount = val; }; mframe.safefunction(curMemoryArea.ariaRowCount_setter);
Object.defineProperty(curMemoryArea.ariaRowCount_setter, "name", { value: "set ariaRowCount", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowCount", { get: curMemoryArea.ariaRowCount_getter, set: curMemoryArea.ariaRowCount_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowCount_smart_getter = function ariaRowCount() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRowCount; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRowCount !== undefined ? this._ariaRowCount : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRowCount_smart_getter);
Element.prototype.__defineGetter__("ariaRowCount", curMemoryArea.ariaRowCount_smart_getter);

// ariaRowIndex
curMemoryArea.ariaRowIndex_getter = function ariaRowIndex() { return this._ariaRowIndex; }; mframe.safefunction(curMemoryArea.ariaRowIndex_getter);
Object.defineProperty(curMemoryArea.ariaRowIndex_getter, "name", { value: "get ariaRowIndex", configurable: true, });
// ariaRowIndex
curMemoryArea.ariaRowIndex_setter = function ariaRowIndex(val) { this._ariaRowIndex = val; }; mframe.safefunction(curMemoryArea.ariaRowIndex_setter);
Object.defineProperty(curMemoryArea.ariaRowIndex_setter, "name", { value: "set ariaRowIndex", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowIndex", { get: curMemoryArea.ariaRowIndex_getter, set: curMemoryArea.ariaRowIndex_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowIndex_smart_getter = function ariaRowIndex() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRowIndex; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRowIndex !== undefined ? this._ariaRowIndex : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRowIndex_smart_getter);
Element.prototype.__defineGetter__("ariaRowIndex", curMemoryArea.ariaRowIndex_smart_getter);

// ariaRowSpan
curMemoryArea.ariaRowSpan_getter = function ariaRowSpan() { return this._ariaRowSpan; }; mframe.safefunction(curMemoryArea.ariaRowSpan_getter);
Object.defineProperty(curMemoryArea.ariaRowSpan_getter, "name", { value: "get ariaRowSpan", configurable: true, });
// ariaRowSpan
curMemoryArea.ariaRowSpan_setter = function ariaRowSpan(val) { this._ariaRowSpan = val; }; mframe.safefunction(curMemoryArea.ariaRowSpan_setter);
Object.defineProperty(curMemoryArea.ariaRowSpan_setter, "name", { value: "set ariaRowSpan", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowSpan", { get: curMemoryArea.ariaRowSpan_getter, set: curMemoryArea.ariaRowSpan_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowSpan_smart_getter = function ariaRowSpan() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRowSpan; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRowSpan !== undefined ? this._ariaRowSpan : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRowSpan_smart_getter);
Element.prototype.__defineGetter__("ariaRowSpan", curMemoryArea.ariaRowSpan_smart_getter);

// ariaSelected
curMemoryArea.ariaSelected_getter = function ariaSelected() { return this._ariaSelected; }; mframe.safefunction(curMemoryArea.ariaSelected_getter);
Object.defineProperty(curMemoryArea.ariaSelected_getter, "name", { value: "get ariaSelected", configurable: true, });
// ariaSelected
curMemoryArea.ariaSelected_setter = function ariaSelected(val) { this._ariaSelected = val; }; mframe.safefunction(curMemoryArea.ariaSelected_setter);
Object.defineProperty(curMemoryArea.ariaSelected_setter, "name", { value: "set ariaSelected", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSelected", { get: curMemoryArea.ariaSelected_getter, set: curMemoryArea.ariaSelected_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSelected_smart_getter = function ariaSelected() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaSelected; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaSelected !== undefined ? this._ariaSelected : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaSelected_smart_getter);
Element.prototype.__defineGetter__("ariaSelected", curMemoryArea.ariaSelected_smart_getter);

// ariaSetSize
curMemoryArea.ariaSetSize_getter = function ariaSetSize() { return this._ariaSetSize; }; mframe.safefunction(curMemoryArea.ariaSetSize_getter);
Object.defineProperty(curMemoryArea.ariaSetSize_getter, "name", { value: "get ariaSetSize", configurable: true, });
// ariaSetSize
curMemoryArea.ariaSetSize_setter = function ariaSetSize(val) { this._ariaSetSize = val; }; mframe.safefunction(curMemoryArea.ariaSetSize_setter);
Object.defineProperty(curMemoryArea.ariaSetSize_setter, "name", { value: "set ariaSetSize", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSetSize", { get: curMemoryArea.ariaSetSize_getter, set: curMemoryArea.ariaSetSize_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSetSize_smart_getter = function ariaSetSize() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaSetSize; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaSetSize !== undefined ? this._ariaSetSize : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaSetSize_smart_getter);
Element.prototype.__defineGetter__("ariaSetSize", curMemoryArea.ariaSetSize_smart_getter);

// ariaSort
curMemoryArea.ariaSort_getter = function ariaSort() { return this._ariaSort; }; mframe.safefunction(curMemoryArea.ariaSort_getter);
Object.defineProperty(curMemoryArea.ariaSort_getter, "name", { value: "get ariaSort", configurable: true, });
// ariaSort
curMemoryArea.ariaSort_setter = function ariaSort(val) { this._ariaSort = val; }; mframe.safefunction(curMemoryArea.ariaSort_setter);
Object.defineProperty(curMemoryArea.ariaSort_setter, "name", { value: "set ariaSort", configurable: true, });
Object.defineProperty(Element.prototype, "ariaSort", { get: curMemoryArea.ariaSort_getter, set: curMemoryArea.ariaSort_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaSort_smart_getter = function ariaSort() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaSort; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaSort !== undefined ? this._ariaSort : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaSort_smart_getter);
Element.prototype.__defineGetter__("ariaSort", curMemoryArea.ariaSort_smart_getter);

// ariaValueMax
curMemoryArea.ariaValueMax_getter = function ariaValueMax() { return this._ariaValueMax; }; mframe.safefunction(curMemoryArea.ariaValueMax_getter);
Object.defineProperty(curMemoryArea.ariaValueMax_getter, "name", { value: "get ariaValueMax", configurable: true, });
// ariaValueMax
curMemoryArea.ariaValueMax_setter = function ariaValueMax(val) { this._ariaValueMax = val; }; mframe.safefunction(curMemoryArea.ariaValueMax_setter);
Object.defineProperty(curMemoryArea.ariaValueMax_setter, "name", { value: "set ariaValueMax", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueMax", { get: curMemoryArea.ariaValueMax_getter, set: curMemoryArea.ariaValueMax_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueMax_smart_getter = function ariaValueMax() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaValueMax; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaValueMax !== undefined ? this._ariaValueMax : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaValueMax_smart_getter);
Element.prototype.__defineGetter__("ariaValueMax", curMemoryArea.ariaValueMax_smart_getter);

// ariaValueMin
curMemoryArea.ariaValueMin_getter = function ariaValueMin() { return this._ariaValueMin; }; mframe.safefunction(curMemoryArea.ariaValueMin_getter);
Object.defineProperty(curMemoryArea.ariaValueMin_getter, "name", { value: "get ariaValueMin", configurable: true, });
// ariaValueMin
curMemoryArea.ariaValueMin_setter = function ariaValueMin(val) { this._ariaValueMin = val; }; mframe.safefunction(curMemoryArea.ariaValueMin_setter);
Object.defineProperty(curMemoryArea.ariaValueMin_setter, "name", { value: "set ariaValueMin", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueMin", { get: curMemoryArea.ariaValueMin_getter, set: curMemoryArea.ariaValueMin_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueMin_smart_getter = function ariaValueMin() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaValueMin; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaValueMin !== undefined ? this._ariaValueMin : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaValueMin_smart_getter);
Element.prototype.__defineGetter__("ariaValueMin", curMemoryArea.ariaValueMin_smart_getter);

// ariaValueNow
curMemoryArea.ariaValueNow_getter = function ariaValueNow() { return this._ariaValueNow; }; mframe.safefunction(curMemoryArea.ariaValueNow_getter);
Object.defineProperty(curMemoryArea.ariaValueNow_getter, "name", { value: "get ariaValueNow", configurable: true, });
// ariaValueNow
curMemoryArea.ariaValueNow_setter = function ariaValueNow(val) { this._ariaValueNow = val; }; mframe.safefunction(curMemoryArea.ariaValueNow_setter);
Object.defineProperty(curMemoryArea.ariaValueNow_setter, "name", { value: "set ariaValueNow", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueNow", { get: curMemoryArea.ariaValueNow_getter, set: curMemoryArea.ariaValueNow_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueNow_smart_getter = function ariaValueNow() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaValueNow; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaValueNow !== undefined ? this._ariaValueNow : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaValueNow_smart_getter);
Element.prototype.__defineGetter__("ariaValueNow", curMemoryArea.ariaValueNow_smart_getter);

// ariaValueText
curMemoryArea.ariaValueText_getter = function ariaValueText() { return this._ariaValueText; }; mframe.safefunction(curMemoryArea.ariaValueText_getter);
Object.defineProperty(curMemoryArea.ariaValueText_getter, "name", { value: "get ariaValueText", configurable: true, });
// ariaValueText
curMemoryArea.ariaValueText_setter = function ariaValueText(val) { this._ariaValueText = val; }; mframe.safefunction(curMemoryArea.ariaValueText_setter);
Object.defineProperty(curMemoryArea.ariaValueText_setter, "name", { value: "set ariaValueText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaValueText", { get: curMemoryArea.ariaValueText_getter, set: curMemoryArea.ariaValueText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaValueText_smart_getter = function ariaValueText() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaValueText; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaValueText !== undefined ? this._ariaValueText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaValueText_smart_getter);
Element.prototype.__defineGetter__("ariaValueText", curMemoryArea.ariaValueText_smart_getter);

// children
curMemoryArea.children_getter = function children() { return this._children; }; mframe.safefunction(curMemoryArea.children_getter);
Object.defineProperty(curMemoryArea.children_getter, "name", { value: "get children", configurable: true, });
Object.defineProperty(Element.prototype, "children", { get: curMemoryArea.children_getter, enumerable: true, configurable: true, });
curMemoryArea.children_smart_getter = function children() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.children; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._children !== undefined ? this._children : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.children_smart_getter);
Element.prototype.__defineGetter__("children", curMemoryArea.children_smart_getter);

// firstElementChild
curMemoryArea.firstElementChild_getter = function firstElementChild() { return this._firstElementChild; }; mframe.safefunction(curMemoryArea.firstElementChild_getter);
Object.defineProperty(curMemoryArea.firstElementChild_getter, "name", { value: "get firstElementChild", configurable: true, });
Object.defineProperty(Element.prototype, "firstElementChild", { get: curMemoryArea.firstElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstElementChild_smart_getter = function firstElementChild() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.firstElementChild; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._firstElementChild !== undefined ? this._firstElementChild : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.firstElementChild_smart_getter);
Element.prototype.__defineGetter__("firstElementChild", curMemoryArea.firstElementChild_smart_getter);

// lastElementChild
curMemoryArea.lastElementChild_getter = function lastElementChild() { return this._lastElementChild; }; mframe.safefunction(curMemoryArea.lastElementChild_getter);
Object.defineProperty(curMemoryArea.lastElementChild_getter, "name", { value: "get lastElementChild", configurable: true, });
Object.defineProperty(Element.prototype, "lastElementChild", { get: curMemoryArea.lastElementChild_getter, enumerable: true, configurable: true, });
curMemoryArea.lastElementChild_smart_getter = function lastElementChild() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.lastElementChild; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._lastElementChild !== undefined ? this._lastElementChild : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.lastElementChild_smart_getter);
Element.prototype.__defineGetter__("lastElementChild", curMemoryArea.lastElementChild_smart_getter);

// childElementCount
curMemoryArea.childElementCount_getter = function childElementCount() { return this._childElementCount; }; mframe.safefunction(curMemoryArea.childElementCount_getter);
Object.defineProperty(curMemoryArea.childElementCount_getter, "name", { value: "get childElementCount", configurable: true, });
Object.defineProperty(Element.prototype, "childElementCount", { get: curMemoryArea.childElementCount_getter, enumerable: true, configurable: true, });
curMemoryArea.childElementCount_smart_getter = function childElementCount() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.childElementCount; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._childElementCount !== undefined ? this._childElementCount : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.childElementCount_smart_getter);
Element.prototype.__defineGetter__("childElementCount", curMemoryArea.childElementCount_smart_getter);

// previousElementSibling
curMemoryArea.previousElementSibling_getter = function previousElementSibling() { return this._previousElementSibling; }; mframe.safefunction(curMemoryArea.previousElementSibling_getter);
Object.defineProperty(curMemoryArea.previousElementSibling_getter, "name", { value: "get previousElementSibling", configurable: true, });
Object.defineProperty(Element.prototype, "previousElementSibling", { get: curMemoryArea.previousElementSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.previousElementSibling_smart_getter = function previousElementSibling() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.previousElementSibling; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._previousElementSibling !== undefined ? this._previousElementSibling : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.previousElementSibling_smart_getter);
Element.prototype.__defineGetter__("previousElementSibling", curMemoryArea.previousElementSibling_smart_getter);

// nextElementSibling
curMemoryArea.nextElementSibling_getter = function nextElementSibling() { return this._nextElementSibling; }; mframe.safefunction(curMemoryArea.nextElementSibling_getter);
Object.defineProperty(curMemoryArea.nextElementSibling_getter, "name", { value: "get nextElementSibling", configurable: true, });
Object.defineProperty(Element.prototype, "nextElementSibling", { get: curMemoryArea.nextElementSibling_getter, enumerable: true, configurable: true, });
curMemoryArea.nextElementSibling_smart_getter = function nextElementSibling() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.nextElementSibling; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._nextElementSibling !== undefined ? this._nextElementSibling : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.nextElementSibling_smart_getter);
Element.prototype.__defineGetter__("nextElementSibling", curMemoryArea.nextElementSibling_smart_getter);

// currentCSSZoom
curMemoryArea.currentCSSZoom_getter = function currentCSSZoom() { return this._currentCSSZoom; }; mframe.safefunction(curMemoryArea.currentCSSZoom_getter);
Object.defineProperty(curMemoryArea.currentCSSZoom_getter, "name", { value: "get currentCSSZoom", configurable: true, });
Object.defineProperty(Element.prototype, "currentCSSZoom", { get: curMemoryArea.currentCSSZoom_getter, enumerable: true, configurable: true, });
curMemoryArea.currentCSSZoom_smart_getter = function currentCSSZoom() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.currentCSSZoom; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._currentCSSZoom !== undefined ? this._currentCSSZoom : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.currentCSSZoom_smart_getter);
Element.prototype.__defineGetter__("currentCSSZoom", curMemoryArea.currentCSSZoom_smart_getter);

// ariaColIndexText
curMemoryArea.ariaColIndexText_getter = function ariaColIndexText() { return this._ariaColIndexText; }; mframe.safefunction(curMemoryArea.ariaColIndexText_getter);
Object.defineProperty(curMemoryArea.ariaColIndexText_getter, "name", { value: "get ariaColIndexText", configurable: true, });
// ariaColIndexText
curMemoryArea.ariaColIndexText_setter = function ariaColIndexText(val) { this._ariaColIndexText = val; }; mframe.safefunction(curMemoryArea.ariaColIndexText_setter);
Object.defineProperty(curMemoryArea.ariaColIndexText_setter, "name", { value: "set ariaColIndexText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaColIndexText", { get: curMemoryArea.ariaColIndexText_getter, set: curMemoryArea.ariaColIndexText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaColIndexText_smart_getter = function ariaColIndexText() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaColIndexText; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaColIndexText !== undefined ? this._ariaColIndexText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaColIndexText_smart_getter);
Element.prototype.__defineGetter__("ariaColIndexText", curMemoryArea.ariaColIndexText_smart_getter);

// ariaRowIndexText
curMemoryArea.ariaRowIndexText_getter = function ariaRowIndexText() { return this._ariaRowIndexText; }; mframe.safefunction(curMemoryArea.ariaRowIndexText_getter);
Object.defineProperty(curMemoryArea.ariaRowIndexText_getter, "name", { value: "get ariaRowIndexText", configurable: true, });
// ariaRowIndexText
curMemoryArea.ariaRowIndexText_setter = function ariaRowIndexText(val) { this._ariaRowIndexText = val; }; mframe.safefunction(curMemoryArea.ariaRowIndexText_setter);
Object.defineProperty(curMemoryArea.ariaRowIndexText_setter, "name", { value: "set ariaRowIndexText", configurable: true, });
Object.defineProperty(Element.prototype, "ariaRowIndexText", { get: curMemoryArea.ariaRowIndexText_getter, set: curMemoryArea.ariaRowIndexText_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaRowIndexText_smart_getter = function ariaRowIndexText() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaRowIndexText; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaRowIndexText !== undefined ? this._ariaRowIndexText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaRowIndexText_smart_getter);
Element.prototype.__defineGetter__("ariaRowIndexText", curMemoryArea.ariaRowIndexText_smart_getter);

// ariaActiveDescendantElement
curMemoryArea.ariaActiveDescendantElement_getter = function ariaActiveDescendantElement() { return this._ariaActiveDescendantElement; }; mframe.safefunction(curMemoryArea.ariaActiveDescendantElement_getter);
Object.defineProperty(curMemoryArea.ariaActiveDescendantElement_getter, "name", { value: "get ariaActiveDescendantElement", configurable: true, });
// ariaActiveDescendantElement
curMemoryArea.ariaActiveDescendantElement_setter = function ariaActiveDescendantElement(val) { this._ariaActiveDescendantElement = val; }; mframe.safefunction(curMemoryArea.ariaActiveDescendantElement_setter);
Object.defineProperty(curMemoryArea.ariaActiveDescendantElement_setter, "name", { value: "set ariaActiveDescendantElement", configurable: true, });
Object.defineProperty(Element.prototype, "ariaActiveDescendantElement", { get: curMemoryArea.ariaActiveDescendantElement_getter, set: curMemoryArea.ariaActiveDescendantElement_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaActiveDescendantElement_smart_getter = function ariaActiveDescendantElement() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaActiveDescendantElement; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaActiveDescendantElement !== undefined ? this._ariaActiveDescendantElement : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaActiveDescendantElement_smart_getter);
Element.prototype.__defineGetter__("ariaActiveDescendantElement", curMemoryArea.ariaActiveDescendantElement_smart_getter);

// ariaControlsElements
curMemoryArea.ariaControlsElements_getter = function ariaControlsElements() { return this._ariaControlsElements; }; mframe.safefunction(curMemoryArea.ariaControlsElements_getter);
Object.defineProperty(curMemoryArea.ariaControlsElements_getter, "name", { value: "get ariaControlsElements", configurable: true, });
// ariaControlsElements
curMemoryArea.ariaControlsElements_setter = function ariaControlsElements(val) { this._ariaControlsElements = val; }; mframe.safefunction(curMemoryArea.ariaControlsElements_setter);
Object.defineProperty(curMemoryArea.ariaControlsElements_setter, "name", { value: "set ariaControlsElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaControlsElements", { get: curMemoryArea.ariaControlsElements_getter, set: curMemoryArea.ariaControlsElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaControlsElements_smart_getter = function ariaControlsElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaControlsElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaControlsElements !== undefined ? this._ariaControlsElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaControlsElements_smart_getter);
Element.prototype.__defineGetter__("ariaControlsElements", curMemoryArea.ariaControlsElements_smart_getter);

// ariaDescribedByElements
curMemoryArea.ariaDescribedByElements_getter = function ariaDescribedByElements() { return this._ariaDescribedByElements; }; mframe.safefunction(curMemoryArea.ariaDescribedByElements_getter);
Object.defineProperty(curMemoryArea.ariaDescribedByElements_getter, "name", { value: "get ariaDescribedByElements", configurable: true, });
// ariaDescribedByElements
curMemoryArea.ariaDescribedByElements_setter = function ariaDescribedByElements(val) { this._ariaDescribedByElements = val; }; mframe.safefunction(curMemoryArea.ariaDescribedByElements_setter);
Object.defineProperty(curMemoryArea.ariaDescribedByElements_setter, "name", { value: "set ariaDescribedByElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDescribedByElements", { get: curMemoryArea.ariaDescribedByElements_getter, set: curMemoryArea.ariaDescribedByElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDescribedByElements_smart_getter = function ariaDescribedByElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaDescribedByElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaDescribedByElements !== undefined ? this._ariaDescribedByElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaDescribedByElements_smart_getter);
Element.prototype.__defineGetter__("ariaDescribedByElements", curMemoryArea.ariaDescribedByElements_smart_getter);

// ariaDetailsElements
curMemoryArea.ariaDetailsElements_getter = function ariaDetailsElements() { return this._ariaDetailsElements; }; mframe.safefunction(curMemoryArea.ariaDetailsElements_getter);
Object.defineProperty(curMemoryArea.ariaDetailsElements_getter, "name", { value: "get ariaDetailsElements", configurable: true, });
// ariaDetailsElements
curMemoryArea.ariaDetailsElements_setter = function ariaDetailsElements(val) { this._ariaDetailsElements = val; }; mframe.safefunction(curMemoryArea.ariaDetailsElements_setter);
Object.defineProperty(curMemoryArea.ariaDetailsElements_setter, "name", { value: "set ariaDetailsElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaDetailsElements", { get: curMemoryArea.ariaDetailsElements_getter, set: curMemoryArea.ariaDetailsElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaDetailsElements_smart_getter = function ariaDetailsElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaDetailsElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaDetailsElements !== undefined ? this._ariaDetailsElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaDetailsElements_smart_getter);
Element.prototype.__defineGetter__("ariaDetailsElements", curMemoryArea.ariaDetailsElements_smart_getter);

// ariaErrorMessageElements
curMemoryArea.ariaErrorMessageElements_getter = function ariaErrorMessageElements() { return this._ariaErrorMessageElements; }; mframe.safefunction(curMemoryArea.ariaErrorMessageElements_getter);
Object.defineProperty(curMemoryArea.ariaErrorMessageElements_getter, "name", { value: "get ariaErrorMessageElements", configurable: true, });
// ariaErrorMessageElements
curMemoryArea.ariaErrorMessageElements_setter = function ariaErrorMessageElements(val) { this._ariaErrorMessageElements = val; }; mframe.safefunction(curMemoryArea.ariaErrorMessageElements_setter);
Object.defineProperty(curMemoryArea.ariaErrorMessageElements_setter, "name", { value: "set ariaErrorMessageElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaErrorMessageElements", { get: curMemoryArea.ariaErrorMessageElements_getter, set: curMemoryArea.ariaErrorMessageElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaErrorMessageElements_smart_getter = function ariaErrorMessageElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaErrorMessageElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaErrorMessageElements !== undefined ? this._ariaErrorMessageElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaErrorMessageElements_smart_getter);
Element.prototype.__defineGetter__("ariaErrorMessageElements", curMemoryArea.ariaErrorMessageElements_smart_getter);

// ariaFlowToElements
curMemoryArea.ariaFlowToElements_getter = function ariaFlowToElements() { return this._ariaFlowToElements; }; mframe.safefunction(curMemoryArea.ariaFlowToElements_getter);
Object.defineProperty(curMemoryArea.ariaFlowToElements_getter, "name", { value: "get ariaFlowToElements", configurable: true, });
// ariaFlowToElements
curMemoryArea.ariaFlowToElements_setter = function ariaFlowToElements(val) { this._ariaFlowToElements = val; }; mframe.safefunction(curMemoryArea.ariaFlowToElements_setter);
Object.defineProperty(curMemoryArea.ariaFlowToElements_setter, "name", { value: "set ariaFlowToElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaFlowToElements", { get: curMemoryArea.ariaFlowToElements_getter, set: curMemoryArea.ariaFlowToElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaFlowToElements_smart_getter = function ariaFlowToElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaFlowToElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaFlowToElements !== undefined ? this._ariaFlowToElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaFlowToElements_smart_getter);
Element.prototype.__defineGetter__("ariaFlowToElements", curMemoryArea.ariaFlowToElements_smart_getter);

// ariaLabelledByElements
curMemoryArea.ariaLabelledByElements_getter = function ariaLabelledByElements() { return this._ariaLabelledByElements; }; mframe.safefunction(curMemoryArea.ariaLabelledByElements_getter);
Object.defineProperty(curMemoryArea.ariaLabelledByElements_getter, "name", { value: "get ariaLabelledByElements", configurable: true, });
// ariaLabelledByElements
curMemoryArea.ariaLabelledByElements_setter = function ariaLabelledByElements(val) { this._ariaLabelledByElements = val; }; mframe.safefunction(curMemoryArea.ariaLabelledByElements_setter);
Object.defineProperty(curMemoryArea.ariaLabelledByElements_setter, "name", { value: "set ariaLabelledByElements", configurable: true, });
Object.defineProperty(Element.prototype, "ariaLabelledByElements", { get: curMemoryArea.ariaLabelledByElements_getter, set: curMemoryArea.ariaLabelledByElements_setter, enumerable: true, configurable: true, });
curMemoryArea.ariaLabelledByElements_smart_getter = function ariaLabelledByElements() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.ariaLabelledByElements; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ariaLabelledByElements !== undefined ? this._ariaLabelledByElements : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ariaLabelledByElements_smart_getter);
Element.prototype.__defineGetter__("ariaLabelledByElements", curMemoryArea.ariaLabelledByElements_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

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
Element.prototype["getAttributeNS"] = function getAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNS"]);
Element.prototype["getAttributeNames"] = function getAttributeNames() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNames"]);
Element.prototype["getAttributeNode"] = function getAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNode"]);
Element.prototype["getAttributeNodeNS"] = function getAttributeNodeNS() { debugger; }; mframe.safefunction(Element.prototype["getAttributeNodeNS"]);
Element.prototype["getBoundingClientRect"] = function getBoundingClientRect() { debugger; }; mframe.safefunction(Element.prototype["getBoundingClientRect"]);
Element.prototype["getClientRects"] = function getClientRects() { debugger; }; mframe.safefunction(Element.prototype["getClientRects"]);
Element.prototype["getElementsByClassName"] = function getElementsByClassName() { debugger; }; mframe.safefunction(Element.prototype["getElementsByClassName"]);
Element.prototype["getElementsByTagName"] = function getElementsByTagName(tagName) {
    debugger;
    if (mframe.memory.jsdom.document) { // 有jsdom
        console.log('Element.prototype["getElementsByTagName"]==>', tagName);
        // 这个方法返回是tageName为name的所有标签, 是返回数组, so我们要代理这个数组中的所有对象
        var elements = mframe.memory.jsdom.document.getElementsByTagName(tagName);
        return mframe.memory.htmlelements['collection'](elements);
    }
    debugger;

}; mframe.safefunction(Element.prototype["getElementsByTagName"]);
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
Element.prototype["moveBefore"] = function moveBefore() { debugger; }; mframe.safefunction(Element.prototype["moveBefore"]);
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
Element.prototype["setAttributeNS"] = function setAttributeNS() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNS"]);
Element.prototype["setAttributeNode"] = function setAttributeNode() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNode"]);
Element.prototype["setAttributeNodeNS"] = function setAttributeNodeNS() { debugger; }; mframe.safefunction(Element.prototype["setAttributeNodeNS"]);
Element.prototype["setHTMLUnsafe"] = function setHTMLUnsafe() { debugger; }; mframe.safefunction(Element.prototype["setHTMLUnsafe"]);
Element.prototype["setPointerCapture"] = function setPointerCapture() { debugger; }; mframe.safefunction(Element.prototype["setPointerCapture"]);
Element.prototype["toggleAttribute"] = function toggleAttribute() { debugger; }; mframe.safefunction(Element.prototype["toggleAttribute"]);
Element.prototype["webkitMatchesSelector"] = function webkitMatchesSelector() { debugger; }; mframe.safefunction(Element.prototype["webkitMatchesSelector"]);
Element.prototype["webkitRequestFullScreen"] = function webkitRequestFullScreen() { debugger; }; mframe.safefunction(Element.prototype["webkitRequestFullScreen"]);
Element.prototype["webkitRequestFullscreen"] = function webkitRequestFullscreen() { debugger; }; mframe.safefunction(Element.prototype["webkitRequestFullscreen"]);
Element.prototype["setAttribute"] = function setAttribute(name, value) {
    if (mframe.memory.jsdom.document) {
        return this.jsdomMemory.setAttribute(name, value);
    }
}; mframe.safefunction(Element.prototype["setAttribute"]);

// 2025年4月12日14:28:38; 你知道吗? 这个bug我找了2天(20h)
// 终于明白日志的重要性, 准备封装完整的日志功能 TODO
Element.prototype["getAttribute"] = function getAttribute(name) {
    console.log(`Element.prototype["getAttribute"] name:${name}; value:${this.jsdomMemory.getAttribute(name)}`);
    if (mframe.memory.jsdom.document) {
        return this.jsdomMemory.getAttribute(name);
    }
}; mframe.safefunction(Element.prototype["getAttribute"]);

//==============↑↑Function END↑↑====================


// === hook jsdom====
// append
const or_append = mframe.memory.jsdom.window.Element.prototype.append
mframe.memory.jsdom.window.Element.prototype.append = function (child) {
    console.log("调用jsdom内部的 Element.prototype.append", child);
    return or_append.call(this, child.jsdomMemory ? child.jsdomMemory : child);
}
// =======end========

////////////////////////////////////////////////////////////////////


/**代理 */
Element.prototype.__proto__ = Node.prototype;
Element = mframe.proxy(Element)