// 日志打印(如方法传递等)
/**
 *  传入: * 'property', 'function'必须传入, 且只能传入,最好是用户调用的时候, 让其选择
 *  方法日志: 
 *     * console.log(`类:${class} 方法:${methodName} 传入:${inputVal} 返回:${res}`);
 *  property: 
 *     * method为 get: console.log(`类:${class}, 属性:${propertyName} 方法:${method} 返回:${val}`);
 *     * method为 set: console.log(`类:${class}, 属性:${propertyName} 方法:${method} 设置:${val}`);
 */

// 日志打印方法
/**
 * 记录属性访问或方法调用的日志
 * @param {object} options - 日志选项
 * @param {'property' | 'function'} options.flag - 日志类型: 'property' 或 'function'
 * @param {string} options.className - 类名
 * @param {string} [options.methodName] - 方法名 (当 flag 为 'function')
 * @param {*} [options.inputVal] - 方法输入值 (当 flag 为 'function')
 * @param {*} [options.res] - 方法返回值 (当 flag 为 'function')
 * @param {string} [options.propertyName] - 属性名 (当 flag 为 'property')
 * @param {'get' | 'set'} [options.method] - 属性访问方法 (当 flag 为 'property')
 * @param {*} [options.val] - 属性值 (当 flag 为 'property')
 * 实例:
 *   * 方法: mframe.log({ flag: 'function', className: 'window', methodName: 'btoa', inputVal: stringToEncode, res: res });
 */
mframe.log = function (options) {
    mframe.memory.config.proxy = false;
    const { flag, className } = options;

    // 定义固定宽度
    const classNameWidth = mframe.memory.config.log['objLength'];    //  日志长度
    const propertyNameWidth = mframe.memory.config.log['propertyLength'];
    const typeLength = mframe.memory.config.log['typeLength'];
    const methodNameWidth = mframe.memory.config.log['propertyLength'];
    const methodTypeWidth = 5; // for 'get'/'set'

    if (!flag || !className) {
        console.error("mframe.log: 'flag' and 'className' are required options.");
        mframe.memory.config.proxy = true;
        return;
    }

    const paddedClassName = padString(className, classNameWidth);

    // 增强的formatValue函数，确保对象调用toString
    function formatValueWithObjectName(value, maxLength = 30) {
        if (value === null) return "null";
        if (value === undefined) return "undefined";
        
        const type = typeof value;
        let result = "";
        
        if (type === "object" && value !== null) {
            // 处理Arguments对象
            if (Object.prototype.toString.call(value) === '[object Arguments]') {
                try {
                    // 将Arguments转换为数组并格式化
                    const argsArray = Array.from(value);
                    const argsStr = argsArray.length > 5 ? 
                        `[${argsArray.slice(0, 3).map(arg => formatValueWithObjectName(arg, maxLength/2)).join(", ")}, ... ${argsArray.length} args]` : 
                        `[${argsArray.map(arg => formatValueWithObjectName(arg, maxLength/2)).join(", ")}]`;
                    return `${argsStr}`;
                } catch (e) {
                    return "Arguments:[无法序列化]";
                }
            }
            
            // 尝试获取对象的类型名称
            let objName = value.constructor ? value.constructor.name : "Object";
            
            // 尝试获取对象的字符串表示
            let strValue = "";
            try {
                // 首先尝试使用toString方法
                if (typeof value.toString === 'function' && 
                    value.toString !== Object.prototype.toString) {
                    // 使用自定义的toString方法
                    strValue = value.toString();
                } else if (value instanceof Error) {
                    // 特殊处理Error对象
                    strValue = `${value.name}: ${value.message}`;
                } else if (Array.isArray(value)) {
                    // 特殊处理数组
                    strValue = value.length > 5 ? 
                        `[${value.slice(0, 3).map(item => formatValueWithObjectName(item, maxLength/3)).join(", ")}, ... ${value.length} items]` : 
                        `[${value.map(item => formatValueWithObjectName(item, maxLength/3)).join(", ")}]`;
                } else if (value instanceof Date || value instanceof RegExp) {
                    // Date和RegExp已经有好的toString实现
                    strValue = value.toString();
                } else {
                    // 最后尝试使用JSON序列化
                    strValue = JSON.stringify(value);
                    if (strValue && strValue.length > maxLength - objName.length - 3) {
                        strValue = strValue.substring(0, maxLength - objName.length - 6) + "...";
                    }
                }
            } catch (e) {
                // 如果序列化失败
                strValue = "[无法序列化]";
            }
            
            result = `${objName}:${strValue}`;
        } else if (type === "function") {
            // 处理函数
            const funcStr = value.toString().replace(/\r?\n/g, " ").replace(/\s+/g, " ");
            result = funcStr.length > maxLength ? funcStr.substring(0, maxLength - 3) + '...' : funcStr;
        } else if (type === "string") {
            // 处理字符串
            result = value.replace(/\r?\n/g, " ").replace(/\s+/g, " ");
            result = `"${result}"`;
            if (result.length > maxLength) {
                result = result.substring(0, maxLength - 3) + '..."';
            }
        } else {
            // 处理其他基本类型
            result = String(value);
        }
        
        // 确保移除所有换行并压缩多余空格
        return result.replace(/\r?\n/g, " ").replace(/\s+/g, " ");
    }

    if (flag === "function") {
        const { methodName, inputVal, res } = options;
        if (methodName === undefined) { // 检查 undefined 而非 !methodName 以允许空字符串方法名
            console.error("mframe.log: 'methodName' is required when flag is 'function'.");
            mframe.memory.config.proxy = true;
            return;
        }
        const paddedMethodName = padString(methodName, methodNameWidth);
        const formattedInput = formatValueWithObjectName(inputVal);
        const formattedRes = formatValueWithObjectName(res);

        // 使用固定宽度打印
        console.log(`======>>>\x1b[35m对象:${paddedClassName} 方法:${paddedMethodName} 传入:${formattedInput} 返回:${formattedRes}\x1b[0m`);

    } else if (flag === "property") {
        const { propertyName, method, val } = options;
        if (propertyName === undefined || !method) { // 检查 undefined 而非 !propertyName
            console.error("mframe.log: 'propertyName' and 'method' are required when flag is 'property'.");
            mframe.memory.config.proxy = true;
            return;
        }

        const paddedPropertyName = padString(propertyName, propertyNameWidth);
        const paddedMethod = padString(method, methodTypeWidth); // 填充 'get' 或 'set'
        const formattedVal = formatValueWithObjectName(val);

        if (method === 'get') {
            // 使用固定宽度打印
            console.log(`======>>>\x1b[35m对象:${paddedClassName} 属性:${paddedPropertyName} 方法:${paddedMethod} 返回:${formattedVal}\x1b[0m`);
        } else if (method === 'set') {
            // 使用固定宽度打印
            console.log(`======>>>\x1b[35m对象:${paddedClassName} 属性:${paddedPropertyName} 方法:${paddedMethod} 设置:${formattedVal}\x1b[0m`);
        } else {
            console.error(`mframe.log: Invalid method '${method}' for property log. Use 'get' or 'set'.`);
        }
        mframe.memory.config.proxy = true;
    } else {
        console.error(`mframe.log: Invalid flag '${flag}'. Use 'property' or 'function'.`);
        mframe.memory.config.proxy = true;
    }
};