/** [Tool]代理方法 
 * 对某个"东西"进行代理Proxy后, 以后是使用"代理对象", 而不是原对象
 * eval(`${o} = new Proxy(${o}, ${handler})`); 帮你完成 window = proxy("window")的操作
 * @param {需要代理的对象(str)} o 
一. 输出彩色文本到控制台
console.log('\x1b[33m%s\x1b[0m', '这是黄色的文字'); // 输出黄色文本
console.log('\x1b[31m%s\x1b[0m', '这是红色的文字'); // 输出红色文本
console.log('\x1b[36m%s\x1b[0m', '这是青色的文字'); // 输出青色文本
console.log('\x1b[32m%s\x1b[0m', '这是绿色的文字'); // 输出绿色文本
参考: https://juejin.cn/post/7355382754693464105
恢复: \x1b[0m
前景色（文字颜色）
    黑色：\x1b[30m
    红色：\x1b[31m
    绿色：\x1b[32m
    黄色：\x1b[33m
    蓝色：\x1b[34m
    品红：\x1b[35m
    青色：\x1b[36m
    白色：\x1b[37m
背景色：
    黑色：\x1b[40m
    红色：\x1b[41m
    绿色：\x1b[42m
    黄色：\x1b[43m
    蓝色：\x1b[44m
    品红：\x1b[45m
    青色：\x1b[46m
    白色：\x1b[47m
*/



mframe.proxy = function (o) {
    if (mframe.memory.config.proxy == false) return o;
    // 定义无需打印的属性
    const ignoreProerties = ['prototype', 'constructor', 'jsdomMemory', '0', 'toJSON'];  // Preperties属性
    const ignoreSymbols = ['Symbol(nodejs.util.inspect.custom)', 'Symbol(Symbol.toStringTag)'];                // Symbol属性
    const objLength = mframe.memory.config.log['objLength'];    //  日志长度
    const propertyLength = mframe.memory.config.log['propertyLength'];
    const typeLength = mframe.memory.config.log['typeLength'];
    return new Proxy(o, {
        set(target, property, value, receiver) {
            // 一.清洗日志
            const isSpecial = ignoreProerties.includes(property);
            const isImplSymbol = typeof property === 'symbol' && ignoreSymbols.includes(property.toString());
            if (isSpecial || isImplSymbol) {
                return Reflect.set(target, property, value, receiver);
            }
            // mframe.memory.config.proxy = false;
            // 二.日志打印
            var logContent = `方法:set 对象 ${padString(target.constructor.name, objLength)} 属性 ${padString(String(property), propertyLength)} 值类型 ${padString(typeof value, typeLength)}`; // 基础日志
            if (mframe.memory.config.proxyValue) logContent += " 值" + formatValueForDisplay(value);          // 全量日志
            console.log(logContent);
            // mframe.memory.config.proxy = true;
            // 三.正常设置
            return Reflect.set(target, property, value, receiver);
        },
        get(target, property, receiver) {

            if(property==="_bx") {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                
            }
            // console.log(property,mframe.proxy['jsdomFlag'] );
            // 一.清洗日志
            const isSpecial = ignoreProerties.includes(property);
            const isImplSymbol = typeof property === 'symbol' && ignoreSymbols.includes(property.toString());
            if (isSpecial || isImplSymbol) {
                return Reflect.get(target, property, receiver);
            }
            if(property==="_bx") {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", target.constructor.name);
                
            }
            // mframe.memory.config.proxy = false;
            // 二.日志打印
            // 获取属性值
            const value = Reflect.get(target, property, receiver);

            // 打印获取操作的日志   
            var logContent = `方法:\x1b[32mget\x1b[0m 对象 ${padString(target.constructor.name, objLength)} 属性 ${padString(String(property), propertyLength)} 值类型 ${value === undefined ? "\x1b[31m" + padString("undefined", typeLength) + "\x1b[0m" : padString(typeof value, typeLength)}`;
            if (mframe.memory.config.proxyValue) logContent += " 值" + formatValueForDisplay(value);                                 // 全量日志
            if (value === undefined)
                logContent = `\x1b[1m${logContent}\x1b[0m`
            logContent = parseColorString(logContent);
            console.log(logContent);
            // mframe.memory.config.proxy = true;
            // 三.正常返回
            return value;
        }
    });
}
mframe.jsdomProxy = function (o) {
    if (mframe.memory.config.proxy == false || mframe.memory.config.jsdomProxy == false) return o;
    // 定义无需打印的属性
    const ignoreProerties = ['prototype', 'constructor','toJSON'];  // Preperties属性
    const ignoreSymbols = ['Symbol(impl)', 'Symbol(SameObject caches)']; // Symbol属性
    const objLength = mframe.memory.config.log['objLength'];    //  日志长度
    const propertyLength = mframe.memory.config.log['propertyLength'];
    const typeLength = mframe.memory.config.log['typeLength'];

    return new Proxy(o, {
        set(target, property, value, receiver) {
            // 一.清洗日志
            const isSpecial = ignoreProerties.includes(property);
            const isImplSymbol = typeof property === 'symbol' && ignoreSymbols.includes(property.toString());
            if (isSpecial || isImplSymbol) return Reflect.set(target, property, value, receiver);
            // mframe.memory.config.proxy = false;
            // 二.日志打印
            var logContent = `方法:\x1b[37mset\x1b[0m 对象 ${padString(target.constructor.name, objLength)} 属性 ${padString(String(property), propertyLength)} 值类型 ${padString(typeof value, typeLength)}`; // 基础日志
            if (mframe.memory.config.proxyValue) logContent += " 值" + formatValueForDisplay(value);          // 全量日志
            logContent = `\x1b[36m${logContent}\x1b[0m`;
            logContent = parseColorString(logContent);
            console.log(logContent);
            // mframe.memory.config.proxy = true;
            // 三.正常设置
            return Reflect.set(target, property, value, receiver);
        },
        get(target, property, receiver) {
            // 一.清洗日志
            const isSpecial = ignoreProerties.includes(property);
            const isImplSymbol = typeof property === 'symbol' && ignoreSymbols.includes(property.toString());
            if (isSpecial || isImplSymbol) {
                return Reflect.get(target, property, receiver);
            }
            // mframe.memory.config.proxy = false;
            // 二.日志打印
            // 获取属性值
            const value = Reflect.get(target, property, receiver);

            // 打印获取操作的日志   
            var logContent = `方法:\x1b[32mget\x1b[0m 对象 ${padString(target.constructor.name, objLength)} 属性 ${padString(String(property), propertyLength)} 值类型 ${value === undefined ? "\x1b[31" + padString("mundefined", 10) + "\x1b[0m" : padString(typeof value, 10)}`;
            // var logContent = `方法:\x1b[32mget\x1b[0m 对象 ${target.constructor.name} 属性 ${String(property)} 值类型 ${value === undefined ? "\x1b[31mundefined\x1b[0m" : typeof value}`;
            if (mframe.memory.config.proxyValue) logContent += " 值" + formatValueForDisplay(value);                                 // 全量日志
            logContent = `\x1b[36m${logContent}\x1b[0m`;
            logContent = parseColorString(logContent);
            console.log(logContent);
            // mframe.memory.config.proxy = true;
            // 三.正常返回
            return value;
        }
    });
}


// 格式化值以便打印
function formatValueForDisplay(value, orderLength = 30) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    const type = typeof value;
    
    // 处理不同类型的值，并确保移除所有换行符
    let result = "";
    
    if (type === "symbol") {
        result = value.toString();
    } else if (type === "function") {
        const funcStr = value.toString().replace(/\r?\n/g, " ").replace(/\s+/g, " ");
        result = funcStr.length > orderLength ? funcStr.substring(0, orderLength - 3) + '...' : funcStr;
    } else if (type === "object") {
        if (Array.isArray(value)) {
            result = value.length > 10 ? `[${value.slice(0, 5).join(", ")}, ... ${value.length} items]` : JSON.stringify(value);
        } else if (value instanceof Date || value instanceof RegExp) {
            result = value.toString();
        } else {
            try {
                const str = JSON.stringify(value).replace(/\r?\n/g, " ");
                result = str.length > orderLength ? str.substring(0, orderLength - 3) + "..." : str;
            } catch (e) {
                result = `[object ${value.constructor.name || 'Object'}]`;
            }
        }
    } else if (type === "string") {
        result = value.replace(/\r?\n/g, " ").replace(/\s+/g, " ");
        result = result.length > orderLength ? result.substring(0, orderLength - 3) + "..." : result;
    } else {
        result = String(value).replace(/\r?\n/g, " ").replace(/\s+/g, " ");
    }
    
    // 最终确保移除所有换行并压缩多余空格
    return result.replace(/\r?\n/g, " ").replace(/\s+/g, " ");
}

/** 解析带有ANSI转义颜色代码的字符串，正确处理嵌套颜色
 * 
 * @param {string} input 带有ANSI转义颜色代码的字符串
 * @return {string} 处理后的字符串，正确处理嵌套颜色
 */
function parseColorString(input) {
    // 用于匹配ANSI颜色代码的正则表达式
    const colorRegex = /\x1b\[([\d;]+)m/g;

    // 用于存储颜色代码栈
    const colorStack = [];

    // 结果字符串
    let result = '';

    // 上一个匹配位置
    let lastIndex = 0;

    // 查找所有的颜色代码
    let match;
    while ((match = colorRegex.exec(input)) !== null) {
        // 获取匹配的颜色代码
        const fullColorCode = match[0];
        const colorValue = match[1];

        // 添加颜色代码前的文本
        result += input.substring(lastIndex, match.index);

        // 处理颜色代码
        if (colorValue === '0') {
            // 这是重置代码
            result += fullColorCode;

            // 弹出当前颜色
            colorStack.pop();

            // 如果栈不为空，则添加栈顶的颜色代码
            if (colorStack.length > 0) {
                result += colorStack[colorStack.length - 1];
            }
        } else {
            // 这是设置颜色的代码
            result += fullColorCode;

            // 将颜色代码压入栈
            colorStack.push(fullColorCode);
        }

        // 更新上一个匹配位置
        lastIndex = match.index + fullColorCode.length;
    }

    // 添加剩余的文本
    result += input.substring(lastIndex);

    return result;
}

/**
 * 将字符串填充到固定长度，过长则截断并添加省略号
 * @param {string} str 原始字符串
 * @param {number} length 目标长度
 * @return {string} 处理后的固定长度字符串
 */
function padString(str, length = 10) {
    if (!str) return ' '.repeat(length);

    // 如果字符串长度超过指定长度，截断并添加省略号
    if (str.length > length) {
        return str.substring(0, length - 3) + '...';
    }

    // 如果字符串长度不足，填充空格
    return str.padEnd(length, ' ');
}