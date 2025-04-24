DOMImplementation = mframe.memory.config.nodeEnv ? global : this;
var DOMImplementation = function DOMImplementation() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(DOMImplementation)
Object.defineProperties(DOMImplementation.prototype, {
    [Symbol.toStringTag]: {
        value: "DOMImplementation",
        configurable: true,
    }
})
//////////////////////////////////////////////////
var curMemoryArea = mframe.memory.DOMImplementation = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
// DOMImplementation.prototype["createDocument"] = function createDocument() {
//     var res = undefined;
//     mframe.log({ flag: 'function', className: 'DOMImplementation', methodName: 'createDocument', inputVal: arguments, res: res });
//     return res;
// }; mframe.safefunction(DOMImplementation.prototype["createDocument"]);

// DOMImplementation.prototype["createDocumentType"] = function createDocumentType() {
//     var res = undefined;
//     mframe.log({ flag: 'function', className: 'DOMImplementation', methodName: 'createDocumentType', inputVal: arguments, res: res });
//     return res;
// }; mframe.safefunction(DOMImplementation.prototype["createDocumentType"]);

// DOMImplementation.prototype["createHTMLDocument"] = function createHTMLDocument() {
//     var res = undefined;
//     mframe.log({ flag: 'function', className: 'DOMImplementation', methodName: 'createHTMLDocument', inputVal: arguments, res: res });
//     return res;
// }; mframe.safefunction(DOMImplementation.prototype["createHTMLDocument"]);

DOMImplementation.prototype["hasFeature"] = function hasFeature() {
    var res = this.jsdomMemory.hasFeature;
    mframe.log({ flag: 'function', className: 'DOMImplementation', methodName: 'hasFeature', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(DOMImplementation.prototype["hasFeature"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////////////////////
mframe.memory.domImplementation = {};
mframe.memory.domImplementation.__proto__ = DOMImplementation.prototype;
mframe.memory.domImplementation = mframe.proxy(mframe.memory.domImplementation);

