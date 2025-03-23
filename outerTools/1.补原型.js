/**
 * 获取 DOM 元素的原型或实例属性/方法
 * @param {Object} obj 目标对象（实例或原型对象）
 * @param {string} targetName 目标名称 (如 "Node", "Element", "Window" 等)
 * @param {string} mode 模式 - "instance" 表示获取实例属性，"prototype" 表示获取原型属性
 * @returns {string} 属性/方法的代码字符串
使用示例一:
console.log(getDOMProperties(window, "Window", "prototype"));                          // 获取window的原型属性/方法
console.log(getDOMProperties(window.__proto__, "WindowProperties", "prototype"));      // 获取 WindowProperties 的原型属性/方法
console.log(getDOMProperties(window.__proto__.__proto__, "EventTarget", "prototype")); // 获取 EventTarget 的原型属性/方法
使用实例二: 
console.log(getDOMProperties(window, "window", "instance"));                           // 获取 window 的实例属性/方法

注意: 原型会差一级(为了兼顾实例的获取)
 */
function getDOMProperties(obj, targetName, mode = "prototype") {
    let code = "";
    const isInstance = mode === "instance";
    
    if (isInstance) {
        code += `//===================${targetName} 的实例属性 START===================\n`;
    } else {
        code += `//===================${targetName} 的原型属性 START===================\n`;
    }
    
    // 确定要检查的对象
    let targetObj = obj;
    let parentObj = null;
    
    if (mode === "prototype") {
        // 如果是获取原型属性，则转换为原型对象
        targetObj = obj.__proto__;
        parentObj = targetObj.__proto__;
    } else {
        // 如果是实例属性，父对象为原型
        parentObj = obj.__proto__;
    }
    
    // 遍历属性
    for (let attr in targetObj) {
        // 检查属性是否属于当前对象（而不是继承的）
        if (targetObj.hasOwnProperty(attr) && 
            (!parentObj || !parentObj.hasOwnProperty(attr))) {
            if (isInstance) {
                code += dispatchInstanceProperty(obj, attr, targetName) + "\n";
            } else {
                code += dispatchPrototypeProperty(attr, targetName) + "\n";
            }
        }
    }
    
    // 添加不可枚举的属性（特别是对于实例模式）
    if (isInstance) {
        const ownProps = Object.getOwnPropertyNames(targetObj);
        for (const prop of ownProps) {
            if (!targetObj.propertyIsEnumerable(prop) && 
                prop !== "__proto__" && 
                !code.includes(`${targetName}.${prop}`)) {
                code += dispatchInstanceProperty(obj, prop, targetName) + "\n";
            }
        }
    }
    
    if (isInstance) {
        code += `//================ ↑↑↑${targetName} 的实例属性 END↑↑↑ ================\n`;
    } else {
        code += `//================ ↑↑↑${targetName} 的原型属性 END↑↑↑ ================\n`;
    }
    
    return code;
}

// 处理原型属性/方法
function dispatchPrototypeProperty(attribute, prototypeName) {
    var temp = prototypeName + ".prototype." + attribute;
    
    // 根据属性名称判断类型
    if (attribute.startsWith("on") || 
        ["appendChild", "removeChild", "addEventListener", "getAttribute", "setTimeout", "alert"].includes(attribute)) {
        // 假设以"on"开头的或已知的是函数
        return temp + "=" + "function " + attribute + "(){debugger;};  mframe.safefunction(" + temp + ");";
    } else {
        // 对于其他属性，使用安全的方式
        return temp + "=" + "mframe.proxy(class " + attribute + "{});";
    }
}

// 处理实例属性/方法
function dispatchInstanceProperty(instance, attribute, className) {
    // 注意：对于实例，不使用prototype
    var temp = className + "." + attribute;
    
    try {
        const propType = typeof instance[attribute];
        
        switch (propType) {
            case "function":
                return temp + "=" + "function " + attribute + "(){debugger;};  mframe.safefunction(" + temp + ");";
            case "object":
                if (instance[attribute] === null) {
                    return temp + "=null;";
                } else {
                    return temp + "=" + "mframe.proxy(class " + attribute + "{});";
                }
            case "string":
                return temp + "=\"" + instance[attribute].replace(/"/g, '\\"') + "\";";
            case "number":
            case "boolean":
                return temp + "=" + instance[attribute] + ";";
            case "undefined":
                return temp + "=undefined;";
            default:
                return temp + "=" + "mframe.proxy({});";
        }
    } catch (e) {
        // 处理访问属性时可能出现的错误
        return "// 无法访问属性 " + temp + ": " + e.message;
    }
}


//////////////////使用区域/////////////////////////////////
var aa= document.createElement("div");

//////////////////////////////////////////////////////////


var instanceObj = aa.__proto__.__proto__; // Element
var targetName = "Element";
var mode = "prototype";  //  "prototype" 或 instance

console.log(getDOMProperties(instanceObj, targetName, mode));
copy(getDOMProperties(instanceObj, targetName, mode));