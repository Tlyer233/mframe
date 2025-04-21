// [Tool]框架内存 
var mframe = {};
/** mframe.memory.config
 * proxy(boolean):     是否开启代理(default:false)
 * pluginArray[array]: 插件列表
 * jsdomArray[array]:  注入的jsdom元素,命名必须为jsdomXXX
 */
mframe.memory = {
    // mframe相关配置的内存空间
    config: {
        proxy: true,      // 是否开启代理
        proxyValue: true, // 是否打印值
        jsdomProxy: true, // 是否在jsdom内部进行代理[建议开启]
        pluginArray: [
            {// 插件1: PDF查看器
                description: "Portable Document Format",
                filename: "internal-pdf-viewer",
                name: "PDF Viewer",
                mimeTypeArray: [
                    {
                        description: "Portable Document Format",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "application/pdf",
                    },
                    {
                        description: "PDF Embedded Document",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "application/x-google-chrome-pdf",
                    }
                ]
            },
            {// 插件2: Chrome Native Client
                description: "Native Client Module",
                filename: "internal-nacl-plugin",
                name: "Native Client",
                mimeTypeArray: [
                    {
                        description: "Native Client Executable",
                        enabledPlugin: "Plugin",
                        suffixes: "nexe",
                        type: "application/x-nacl",
                    },
                    {
                        description: "Portable Native Client Executable",
                        enabledPlugin: "Plugin",
                        suffixes: "pexe",
                        type: "application/x-pnacl",
                    }
                ]
            },
            {// 插件3: Widevine内容解密模块
                description: "Enables Widevine licenses for playback of HTML audio/video content.",
                filename: "widevinecdmadapter.dll",
                name: "Widevine Content Decryption Module",
                mimeTypeArray: [
                    {
                        description: "Widevine Content Decryption Module",
                        enabledPlugin: "Plugin",
                        suffixes: "",
                        type: "application/x-ppapi-widevine-cdm",
                    }
                ]
            },
            {// 插件4: Chrome媒体路由器
                description: "Handles media routing for Cast-enabled sites",
                filename: "internal-media-router",
                name: "Chrome Media Router",
                mimeTypeArray: [
                    {
                        description: "Google Cast",
                        enabledPlugin: "Plugin",
                        suffixes: "",
                        type: "application/vnd.google.cast.receiver",
                    },
                    {
                        description: "Media Router Implementation",
                        enabledPlugin: "Plugin",
                        suffixes: "",
                        type: "application/x-media-router-plugin",
                    }
                ]
            },
            { // 插件5: Chromium PDF插件
                description: "Chromium PDF Renderer",
                filename: "chrome-pdf.plugin",
                name: "Chromium PDF Plugin",
                mimeTypeArray: [
                    {
                        description: "Chromium PDF Format",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "application/x-shockwave-flash",
                    },
                    {
                        description: "PDF Inline Document",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "text/pdf",
                    },
                    {
                        description: "PDF Embedded Content",
                        enabledPlugin: "Plugin",
                        suffixes: "pdf",
                        type: "application/pdf-embedded",
                    }
                ]
            }
        ],
        jsdomArray: ['jsdomDocument', 'jsdomWindow', 'jsdomNavigator',],
        log: {  // 打印日志的长度
            objLength: 20,
            propertyLength: 30,
            typeLength: 10,
        },


        // 浏览器指纹
        initScreen: {  // [浏览器指纹]screen初始参数
            availHeight: 1152,
            availLeft: 0,
            availTop: 0,
            availWidth: 2048,
            colorDepth: 24,
            height: 1152,
            isExtended: false,
            onchange: null,
            orientation: {
                angle: 0,
                onchange: null,
                type: "landscape-primary",
            },
            pixelDepth: 24,
            width: 2048
        },
        // 华能(瑞5)
        // copy(window.location);
        initLocation:{
            "ancestorOrigins": {},
            "href": "https://sugh.szu.edu.cn/Html/News/Columns/7/2.html",
            "origin": "https://sugh.szu.edu.cn",
            "protocol": "https:",
            "host": "sugh.szu.edu.cn",
            "hostname": "sugh.szu.edu.cn",
            "port": "",
            "pathname": "/Html/News/Columns/7/2.html",
            "search": "",
            "hash": ""
        },

        // !(function(){const props=['userAgent','language','languages','appVersion','platform','hardwareConcurrency','webdriver','appName','appCodeName','deviceMemory','maxTouchPoints','onLine','pdfViewerEnabled','vendor','vendorSub','product','productSub'];const result=props.map(prop=>`${prop}:${JSON.stringify(navigator[prop])},`).join('\n');console.log(result)})();
        initNavigator: {
            userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            language:"zh-CN",
            languages:["zh-CN"],
            appVersion:"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            platform:"Win32",
            hardwareConcurrency:16,
            webdriver:false,
            appName:"Netscape",
            appCodeName:"Mozilla",
            deviceMemory:8,
            maxTouchPoints:20,
            onLine:true,
            pdfViewerEnabled:true,
            vendor:"Google Inc.",
            vendorSub:"",
            product:"Gecko",
            productSub:"20030107",
        },
    },
};

// 一.HTMLXXXElement的内存空间
mframe.memory.htmlelements = {};

// 二.jsdom专属的空间 mframe.memory.jsdom.document
mframe.memory.jsdom = {};
for (let i = 0; i < mframe.memory.config.jsdomArray.length; i++) {
    const elementName = mframe.memory.config.jsdomArray[i];
    if (typeof global[elementName] !== 'undefined') {
        // 根据元素名称确定在 mframe.memory.jsdom 中的属性名
        const propertyName = elementName.replace('jsdom', '').toLowerCase();
        mframe.memory.jsdom[propertyName] = global[elementName];  // 将元素存储到 mframe 内存中
        delete global[elementName];// 在全局中删除该元素(保证只有通过我们的内存才能访问)
    }
}
// [Tool]统一错误类
mframe.memory.get_invocation_error = function get_invocation_error() {
    let e = new Error();
    e.name = "TypeError";
    e.message = "Illegal constructor";
    e.stack = "VM988:1 Uncaught TypeError: Illegal invocation \r\n at <anonymous>:1:21";
    return e;
}
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
    const ignoreProerties = ['prototype', 'constructor'];  // Preperties属性
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
// [Tool] toString 保护
!(() => {
    "use strict";
    const $toString = Function.toString;
    const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random() + '').toString(36)));
    const myToString = function() {
        return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
    };
    function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,
            "configurable": true,
            "writable": true,
            "value": value
        })
    };
    delete Function.prototype['toString']; //删除原型链上的toString
    set_native(Function.prototype, "toString", myToString); //自己定义个getter方法
    set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }"); //套个娃 保护一下我们定义的toString 否则就暴露了
    mframe.safefunction = (func) => {
        set_native(func, myFunction_toString_symbol, `function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`);
    }; //导出函数到globalThis
}).call(this);




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

mframe.memory.config.proxy=false
var SubtleCrypto = function SubtleCrypto() {
    throw new TypeError("Illegal constructor");
}; mframe.safefunction(SubtleCrypto);

Object.defineProperties(SubtleCrypto.prototype, {
    [Symbol.toStringTag]: {
        value: "SubtleCrypto",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.SubtleCrypto = {};

//============== Constant START ==================
Object.defineProperty(SubtleCrypto, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(SubtleCrypto, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
SubtleCrypto.prototype["decrypt"] = function decrypt() {
    var res = _crypto.subtle.decrypt(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'decrypt', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["decrypt"]);
SubtleCrypto.prototype["deriveBits"] = function deriveBits() {
    var res = _crypto.subtle.deriveBits(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'deriveBits', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["deriveBits"]);
SubtleCrypto.prototype["deriveKey"] = function deriveKey() {
    var res = _crypto.subtle.deriveKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'deriveKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["deriveKey"]);
SubtleCrypto.prototype["digest"] = function digest() {
    var res = _crypto.subtle.digest(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'digest', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["digest"]);
SubtleCrypto.prototype["encrypt"] = function encrypt() {
    var res = _crypto.subtle.encrypt(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'encrypt', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["encrypt"]);
SubtleCrypto.prototype["exportKey"] = function exportKey() {
    var res = _crypto.subtle.exportKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'exportKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["exportKey"]);
SubtleCrypto.prototype["generateKey"] = function generateKey() {
    var res = _crypto.subtle.generateKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'generateKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["generateKey"]);
SubtleCrypto.prototype["importKey"] = function importKey() {
    var res = _crypto.subtle.importKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'importKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["importKey"]);
SubtleCrypto.prototype["sign"] = function sign() {
    var res = _crypto.subtle.sign(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'sign', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["sign"]);
SubtleCrypto.prototype["unwrapKey"] = function unwrapKey() {
    var res = _crypto.subtle.unwrapKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'unwrapKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["unwrapKey"]);
SubtleCrypto.prototype["verify"] = function verify() {
    var res = _crypto.subtle.verify(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'verify', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["verify"]);
SubtleCrypto.prototype["wrapKey"] = function wrapKey() {
    var res = _crypto.subtle.wrapKey(...arguments);
    mframe.log({ flag: 'function', className: 'SubtleCrypto', methodName: 'wrapKey', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(SubtleCrypto.prototype["wrapKey"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////



// 浏览器是没有的, 但是我们要用
mframe.subtleCrypto = {}
mframe.subtleCrypto.__proto__ = SubtleCrypto.prototype;
mframe.subtleCrypto = mframe.proxy(mframe.subtleCrypto);
const _crypto = webcrypto; // 保留从vm2加载的crypto
var Crypto = function Crypto() {
    throw new TypeError("Illegal constructor");
}; mframe.safefunction(Crypto);

Object.defineProperties(Crypto.prototype, {
    [Symbol.toStringTag]: {
        value: "Crypto",
        configurable: true,
    }
})

// 使用原生crypto对象的方法
var crypto = {}
///////////////////////////////////////////
var curMemoryArea = mframe.memory.Crypto = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// subtle
curMemoryArea.subtle_getter = function subtle() {
    var res = mframe.subtleCrypto;
    mframe.log({ flag: 'property', className: 'Crypto', propertyName: 'subtle', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.subtle_getter);
Object.defineProperty(curMemoryArea.subtle_getter, "name", { value: "get subtle", configurable: true, });
Object.defineProperty(Crypto.prototype, "subtle", { get: curMemoryArea.subtle_getter, enumerable: true, configurable: true, });
curMemoryArea.subtle_smart_getter = function subtle() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    var res = mframe.subtleCrypto;
    mframe.log({ flag: 'property', className: 'Crypto', propertyName: 'subtle', method: 'get', val: res });
    return res; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.subtle_smart_getter);
Crypto.prototype.__defineGetter__("subtle", curMemoryArea.subtle_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
Crypto.prototype["getRandomValues"] = function getRandomValues(typedArray) {
    var res = _crypto.getRandomValues(typedArray)
    mframe.log({ flag: 'function', className: 'Crypto', methodName: 'getRandomValues', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Crypto.prototype["getRandomValues"]);
Crypto.prototype["randomUUID"] = function randomUUID() {
    var res = _crypto.randomUUID();
    mframe.log({ flag: 'function', className: 'Crypto', methodName: 'randomUUID', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Crypto.prototype["randomUUID"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////
crypto.__proto__ = Crypto.prototype

crypto = mframe.proxy(crypto)
var Storage = function Storage() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Storage)

Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        configurable: true,
    }
})

//////////////////////////////////
//===================Storage 的原型属性 START===================
// 长度(hook但未保护hook方法)
Storage.prototype.length = 0;
Storage.prototype.__defineGetter__("length", function length() {
    var res = Object.keys(this).length;
    mframe.log({ flag: 'property', className: 'Storage', propertyName: 'length', method: 'get', val: res });
    return res;
})
// 通过键获取值
Storage.prototype.getItem = function getItem(keyName) {
    var res = this[keyName] || undefined; // 这个this是指向实例的
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'getItem', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Storage.prototype.getItem);

// 设置键值对
Storage.prototype.setItem = function setItem(keyName, keyValue) {
    this[keyName] = keyValue;
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'setItem', inputVal: arguments, res: undefined });
    return undefined;
}; mframe.safefunction(Storage.prototype.setItem);

// 清空所有
Storage.prototype.clear = function clear() {
    let keyArray = Object.keys(this);
    for (let i = 0; i < keyArray.length; i++) {
        delete this[keyArray[i]];
    }
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'clear', inputVal: arguments, res: undefined });
    return undefined;
}; mframe.safefunction(Storage.prototype.clear);

// 返回第index个value
Storage.prototype.key = function key(index) {
    var res = Object.keys(this)[index];
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'key', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Storage.prototype.key);

// 删除指定的键
Storage.prototype.removeItem = function removeItem(keyName) {
    delete this[keyName];
    mframe.log({ flag: 'function', className: 'Storage', methodName: 'removeItem', inputVal: arguments, res: undefined });
    return undefined;
}; mframe.safefunction(Storage.prototype.removeItem);
//================ ↑↑↑Storage 的原型属性 END↑↑↑ ================
//////////////////////////////////


/** 小变量定义 && 原型链的定义 */
var localStorage = {};
var sessionStorage = {};
localStorage.__proto__ = Storage.prototype;
localStorage = mframe.proxy(localStorage);
sessionStorage.__proto__ = Storage.prototype;
sessionStorage = mframe.proxy(sessionStorage);



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
var ScreenOrientation = function ScreenOrientation() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(ScreenOrientation)
Object.defineProperties(ScreenOrientation.prototype, {
    [Symbol.toStringTag]: {
        value: "ScreenOrientation",
        configurable: true,
    }
})
mframe.screenOrientation = {
    angle: mframe.memory.config.initScreen.orientation.angle,
    onchange: mframe.memory.config.initScreen.orientation.onchange,
    type: mframe.memory.config.initScreen.orientation.type,
};
/////////////////////////////////////////
var curMemoryArea = mframe.memory.ScreenOrientation = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// angle
curMemoryArea.angle_getter = function angle() { return this.angle; }; mframe.safefunction(curMemoryArea.angle_getter);
Object.defineProperty(curMemoryArea.angle_getter, "name", { value: "get angle", configurable: true, });
Object.defineProperty(ScreenOrientation.prototype, "angle", { get: curMemoryArea.angle_getter, enumerable: true, configurable: true, });
curMemoryArea.angle_smart_getter = function angle() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.angle !== undefined ? this.angle : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.angle_smart_getter);
ScreenOrientation.prototype.__defineGetter__("angle", curMemoryArea.angle_smart_getter);

// type
curMemoryArea.type_getter = function type() { return this.type; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", { value: "get type", configurable: true, });
Object.defineProperty(ScreenOrientation.prototype, "type", { get: curMemoryArea.type_getter, enumerable: true, configurable: true, });
curMemoryArea.type_smart_getter = function type() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.type !== undefined ? this.type : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
ScreenOrientation.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { return this.onchange; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", { value: "get onchange", configurable: true, });
// onchange
curMemoryArea.onchange_setter = function onchange(val) { this.onchange = val; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", { value: "set onchange", configurable: true, });
Object.defineProperty(ScreenOrientation.prototype, "onchange", { get: curMemoryArea.onchange_getter, set: curMemoryArea.onchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onchange_smart_getter = function onchange() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.onchange !== undefined ? this.onchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
ScreenOrientation.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
ScreenOrientation.prototype["lock"] = function lock() { debugger; }; mframe.safefunction(ScreenOrientation.prototype["lock"]);
ScreenOrientation.prototype["unlock"] = function unlock() { debugger; }; mframe.safefunction(ScreenOrientation.prototype["unlock"]);
//==============↑↑Function END↑↑====================
/////////////////////////////////////////

console.log(EventTarget);

ScreenOrientation.prototype.__proto__ = EventTarget.prototype;
mframe.screenOrientation.__proto__ = ScreenOrientation.prototype;
mframe.screenOrientation = mframe.proxy(mframe.screenOrientation);
var Screen = function Screen() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Screen)
Object.defineProperties(Screen.prototype, {
    [Symbol.toStringTag]: {
        value: "Screen",
        configurable: true,
    }
})

// 初始化
screen = {
    availHeight: mframe.memory.config.initScreen.availHeight,
    availLeft: mframe.memory.config.initScreen.availLeft,
    availTop: mframe.memory.config.initScreen.availTop,
    availWidth: mframe.memory.config.initScreen.availWidth,
    colorDepth: mframe.memory.config.initScreen.colorDepth,
    height: mframe.memory.config.initScreen.height,
    isExtended: mframe.memory.config.initScreen.isExtended,
    onchange: mframe.memory.config.initScreen.onchange,
    orientation: mframe.screenOrientation, // 注意哈
    pixelDepth: mframe.memory.config.initScreen.pixelDepth,
    width: mframe.memory.config.initScreen.width
};
//////////////////////////////////
var curMemoryArea = mframe.memory.config.Screen = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// availWidth
curMemoryArea.availWidth_getter = function availWidth() { return this.availWidth; }; mframe.safefunction(curMemoryArea.availWidth_getter);
Object.defineProperty(curMemoryArea.availWidth_getter, "name", { value: "get availWidth", configurable: true, });
Object.defineProperty(Screen.prototype, "availWidth", { get: curMemoryArea.availWidth_getter, enumerable: true, configurable: true, });
curMemoryArea.availWidth_smart_getter = function availWidth() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.availWidth !== undefined ? this.availWidth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.availWidth_smart_getter);
Screen.prototype.__defineGetter__("availWidth", curMemoryArea.availWidth_smart_getter);

// availHeight
curMemoryArea.availHeight_getter = function availHeight() { return this.availHeight; }; mframe.safefunction(curMemoryArea.availHeight_getter);
Object.defineProperty(curMemoryArea.availHeight_getter, "name", { value: "get availHeight", configurable: true, });
Object.defineProperty(Screen.prototype, "availHeight", { get: curMemoryArea.availHeight_getter, enumerable: true, configurable: true, });
curMemoryArea.availHeight_smart_getter = function availHeight() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.availHeight !== undefined ? this.availHeight : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.availHeight_smart_getter);
Screen.prototype.__defineGetter__("availHeight", curMemoryArea.availHeight_smart_getter);

// width
curMemoryArea.width_getter = function width() { return this.width; }; mframe.safefunction(curMemoryArea.width_getter);
Object.defineProperty(curMemoryArea.width_getter, "name", { value: "get width", configurable: true, });
Object.defineProperty(Screen.prototype, "width", { get: curMemoryArea.width_getter, enumerable: true, configurable: true, });
curMemoryArea.width_smart_getter = function width() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.width !== undefined ? this.width : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.width_smart_getter);
Screen.prototype.__defineGetter__("width", curMemoryArea.width_smart_getter);

// height
curMemoryArea.height_getter = function height() { return this.height; }; mframe.safefunction(curMemoryArea.height_getter);
Object.defineProperty(curMemoryArea.height_getter, "name", { value: "get height", configurable: true, });
Object.defineProperty(Screen.prototype, "height", { get: curMemoryArea.height_getter, enumerable: true, configurable: true, });
curMemoryArea.height_smart_getter = function height() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.height !== undefined ? this.height : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.height_smart_getter);
Screen.prototype.__defineGetter__("height", curMemoryArea.height_smart_getter);

// colorDepth
curMemoryArea.colorDepth_getter = function colorDepth() { return this.colorDepth; }; mframe.safefunction(curMemoryArea.colorDepth_getter);
Object.defineProperty(curMemoryArea.colorDepth_getter, "name", { value: "get colorDepth", configurable: true, });
Object.defineProperty(Screen.prototype, "colorDepth", { get: curMemoryArea.colorDepth_getter, enumerable: true, configurable: true, });
curMemoryArea.colorDepth_smart_getter = function colorDepth() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.colorDepth !== undefined ? this.colorDepth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.colorDepth_smart_getter);
Screen.prototype.__defineGetter__("colorDepth", curMemoryArea.colorDepth_smart_getter);

// pixelDepth
curMemoryArea.pixelDepth_getter = function pixelDepth() { return this.pixelDepth; }; mframe.safefunction(curMemoryArea.pixelDepth_getter);
Object.defineProperty(curMemoryArea.pixelDepth_getter, "name", { value: "get pixelDepth", configurable: true, });
Object.defineProperty(Screen.prototype, "pixelDepth", { get: curMemoryArea.pixelDepth_getter, enumerable: true, configurable: true, });
curMemoryArea.pixelDepth_smart_getter = function pixelDepth() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.pixelDepth !== undefined ? this.pixelDepth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.pixelDepth_smart_getter);
Screen.prototype.__defineGetter__("pixelDepth", curMemoryArea.pixelDepth_smart_getter);

// availLeft
curMemoryArea.availLeft_getter = function availLeft() { return this.availLeft; }; mframe.safefunction(curMemoryArea.availLeft_getter);
Object.defineProperty(curMemoryArea.availLeft_getter, "name", { value: "get availLeft", configurable: true, });
Object.defineProperty(Screen.prototype, "availLeft", { get: curMemoryArea.availLeft_getter, enumerable: true, configurable: true, });
curMemoryArea.availLeft_smart_getter = function availLeft() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.availLeft !== undefined ? this.availLeft : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.availLeft_smart_getter);
Screen.prototype.__defineGetter__("availLeft", curMemoryArea.availLeft_smart_getter);

// availTop
curMemoryArea.availTop_getter = function availTop() { return this.availTop; }; mframe.safefunction(curMemoryArea.availTop_getter);
Object.defineProperty(curMemoryArea.availTop_getter, "name", { value: "get availTop", configurable: true, });
Object.defineProperty(Screen.prototype, "availTop", { get: curMemoryArea.availTop_getter, enumerable: true, configurable: true, });
curMemoryArea.availTop_smart_getter = function availTop() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.availTop !== undefined ? this.availTop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.availTop_smart_getter);
Screen.prototype.__defineGetter__("availTop", curMemoryArea.availTop_smart_getter);

// orientation
curMemoryArea.orientation_getter = function orientation() { return this.orientation; }; mframe.safefunction(curMemoryArea.orientation_getter);
Object.defineProperty(curMemoryArea.orientation_getter, "name", { value: "get orientation", configurable: true, });
Object.defineProperty(Screen.prototype, "orientation", { get: curMemoryArea.orientation_getter, enumerable: true, configurable: true, });
curMemoryArea.orientation_smart_getter = function orientation() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.orientation !== undefined ? this.orientation : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.orientation_smart_getter);
Screen.prototype.__defineGetter__("orientation", curMemoryArea.orientation_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { return this.onchange; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", { value: "get onchange", configurable: true, });
// onchange
curMemoryArea.onchange_setter = function onchange(val) { this.onchange = val; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", { value: "set onchange", configurable: true, });
Object.defineProperty(Screen.prototype, "onchange", { get: curMemoryArea.onchange_getter, set: curMemoryArea.onchange_setter, enumerable: true, configurable: true, });
curMemoryArea.onchange_smart_getter = function onchange() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.onchange !== undefined ? this.onchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
Screen.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// isExtended
curMemoryArea.isExtended_getter = function isExtended() { return this.isExtended; }; mframe.safefunction(curMemoryArea.isExtended_getter);
Object.defineProperty(curMemoryArea.isExtended_getter, "name", { value: "get isExtended", configurable: true, });
Object.defineProperty(Screen.prototype, "isExtended", { get: curMemoryArea.isExtended_getter, enumerable: true, configurable: true, });
curMemoryArea.isExtended_smart_getter = function isExtended() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this.isExtended !== undefined ? this.isExtended : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.isExtended_smart_getter);
Screen.prototype.__defineGetter__("isExtended", curMemoryArea.isExtended_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////
Screen.prototype.__proto__ = EventTarget.prototype;
screen.__proto__ = Screen.prototype;
Screen = mframe.proxy(Screen)
var WindowProperties = function () {
    debugger;
    throw new TypeError('WindowProperties不允许被new')
}; mframe.safefunction(WindowProperties);

Object.defineProperties(WindowProperties.prototype, {
    [Symbol.toStringTag]: {
        value: "WindowProperties",
        configurable: true,
    }
});


WindowProperties.prototype.__proto__ = EventTarget.prototype




window = this;
var Window = function Window() {
    debugger;
    throw new TypeError('WindowProperties不允许被new');
}; mframe.safefunction(Window)
Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        configurable: true,
    }
})


//////////////////////////////////
// 常量
Window.prototype.PERSISTENT = 1;
Window.prototype.TEMPORARY = 0;

/////////////////////////////////////////////////////////
// 方法
window["btoa"] = function btoa(stringToEncode) {
    var res = undefined;
    if (mframe.memory.jsdom.window) { // 如果有jsdomn
        res = mframe.memory.jsdom.window.btoa(stringToEncode);
    }
    mframe.log({ flag: 'function', className: 'window', methodName: 'btoa', inputVal: arguments, res: res });
}; mframe.safefunction(window["btoa"]);
// setTimeout
window.setTimeout = function setTimeout() {
    var res = undefined;
    mframe.log({ flag: 'function', className: 'window', methodName: 'setTimeout', inputVal: arguments, res: res });
}; mframe.safefunction(window.setTimeout);
// clearInterval
window["clearInterval"] = function clearInterval() {
    var res = undefined;
    mframe.log({ flag: 'function', className: 'window', methodName: 'clearInterval', inputVal: arguments, res: res });
}; mframe.safefunction(window["clearInterval"]);
// setInterval
window["setInterval"] = function setInterval() {
    var res = undefined;
    mframe.log({ flag: 'function', className: 'window', methodName: 'setInterval', inputVal: arguments, res: res });
}; mframe.safefunction(window["setInterval"]);


// CanvasRenderingContext2D
window["CanvasRenderingContext2D"] = function CanvasRenderingContext2D() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'CanvasRenderingContext2D', inputVal: arguments, res: res });
}; mframe.safefunction(window["CanvasRenderingContext2D"]);
// WebSocket
window["WebSocket"] = function WebSocket() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'WebSocket', inputVal: arguments, res: res });
}; mframe.safefunction(window["WebSocket"]);
// open
window["open"] = function open() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'open', inputVal: arguments, res: res });
}; mframe.safefunction(window["open"]);
// prompt
window["prompt"] = function prompt() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'prompt', inputVal: arguments, res: res });
}; mframe.safefunction(window["prompt"]);
///////////////////////////////////////////////////
// 属性
window.top = window;
window.self = window;

///////////////////////////////////////////////////
// mframe原型链
window.screen = screen;
window.localStorage = localStorage;
window.sessionStorage = sessionStorage;
//////////////////////////////////

/** 小变量定义 && 原型链的定义 */
Window.prototype.__proto__ = WindowProperties.prototype;
window.__proto__ = Window.prototype;

/**代理 */
Window = mframe.proxy(Window)
window = mframe.proxy(window)

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
var IDBFactory = function IDBFactory() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(IDBFactory)
Object.defineProperties(IDBFactory.prototype, {
    [Symbol.toStringTag]: {
        value: "IDBFactory",
        configurable: true,
    }
})

///////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.IDBFactory = {};

//============== Constant START ==================
Object.defineProperty(IDBFactory, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(IDBFactory, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
IDBFactory.prototype["cmp"] = function cmp() { debugger; }; mframe.safefunction(IDBFactory.prototype["cmp"]);
IDBFactory.prototype["databases"] = function databases() { debugger; }; mframe.safefunction(IDBFactory.prototype["databases"]);
IDBFactory.prototype["deleteDatabase"] = function deleteDatabase() { debugger; }; mframe.safefunction(IDBFactory.prototype["deleteDatabase"]);
IDBFactory.prototype["open"] = function open() {
    var res = {};
    mframe.log({ flag: 'function', className: 'IDBFactory', methodName: 'open', inputVal: arguments, res: res });
    // return res;
    return mframe.proxy(res);
}; mframe.safefunction(IDBFactory.prototype["open"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////////

indexedDB = {};
indexedDB.__proto__ = IDBFactory.prototype;
indexedDB = mframe.proxy(indexedDB);
var NetworkInformation = function NetworkInformation() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(NetworkInformation)

Object.defineProperties(NetworkInformation.prototype, {
    [Symbol.toStringTag]: {
        value: "NetworkInformation",
        configurable: true,
    }
})

///////////////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.NetworkInformation = {};

//============== Constant START ==================
Object.defineProperty(NetworkInformation, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(NetworkInformation, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// onchange
curMemoryArea.onchange_getter = function onchange() { return this._onchange; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", {value: "get onchange",configurable: true,});
// onchange
curMemoryArea.onchange_setter = function onchange(val) { this._onchange = val; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", {value: "set onchange",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "onchange", {get: curMemoryArea.onchange_getter,set: curMemoryArea.onchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onchange_smart_getter = function onchange() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onchange !== undefined ? this._onchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
NetworkInformation.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// effectiveType
curMemoryArea.effectiveType_getter = function effectiveType() { return this._effectiveType; }; mframe.safefunction(curMemoryArea.effectiveType_getter);
Object.defineProperty(curMemoryArea.effectiveType_getter, "name", {value: "get effectiveType",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "effectiveType", {get: curMemoryArea.effectiveType_getter,enumerable: true,configurable: true,});
curMemoryArea.effectiveType_smart_getter = function effectiveType() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return "4g"; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.effectiveType_smart_getter);
NetworkInformation.prototype.__defineGetter__("effectiveType", curMemoryArea.effectiveType_smart_getter);

// rtt
curMemoryArea.rtt_getter = function rtt() { return this._rtt; }; mframe.safefunction(curMemoryArea.rtt_getter);
Object.defineProperty(curMemoryArea.rtt_getter, "name", {value: "get rtt",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "rtt", {get: curMemoryArea.rtt_getter,enumerable: true,configurable: true,});
curMemoryArea.rtt_smart_getter = function rtt() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return 200; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.rtt_smart_getter);
NetworkInformation.prototype.__defineGetter__("rtt", curMemoryArea.rtt_smart_getter);

// downlink
curMemoryArea.downlink_getter = function downlink() { return this._downlink; }; mframe.safefunction(curMemoryArea.downlink_getter);
Object.defineProperty(curMemoryArea.downlink_getter, "name", {value: "get downlink",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "downlink", {get: curMemoryArea.downlink_getter,enumerable: true,configurable: true,});
curMemoryArea.downlink_smart_getter = function downlink() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return "10"; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.downlink_smart_getter);
NetworkInformation.prototype.__defineGetter__("downlink", curMemoryArea.downlink_smart_getter);

// saveData
curMemoryArea.saveData_getter = function saveData() { return this._saveData; }; mframe.safefunction(curMemoryArea.saveData_getter);
Object.defineProperty(curMemoryArea.saveData_getter, "name", {value: "get saveData",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "saveData", {get: curMemoryArea.saveData_getter,enumerable: true,configurable: true,});
curMemoryArea.saveData_smart_getter = function saveData() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return false; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.saveData_smart_getter);
NetworkInformation.prototype.__defineGetter__("saveData", curMemoryArea.saveData_smart_getter);

// type
curMemoryArea.type_getter = function type() { return this._type; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", {value: "get type",configurable: true,});
Object.defineProperty(NetworkInformation.prototype, "type", {get: curMemoryArea.type_getter,enumerable: true,configurable: true,});
curMemoryArea.type_smart_getter = function type() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return '4g'; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
NetworkInformation.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////////////////
NetworkInformation.prototype.__proto__ = EventTarget.prototype;
mframe.networkInformation = {};
mframe.networkInformation.__proto__ = NetworkInformation.prototype;
mframe.networkInformation = mframe.proxy(mframe.networkInformation);

var Navigator = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(Navigator);

Object.defineProperties(Navigator.prototype, {
    [Symbol.toStringTag]: {
        value: "Navigator",
        configurable: true,
    }
});

navigator = {};
///////////////////////////////////////////////////
navigator.userAgent= mframe.memory.config.initNavigator['userAgent']
navigator.language= mframe.memory.config.initNavigator['language']
navigator.languages= mframe.memory.config.initNavigator['languages']
navigator.appVersion= mframe.memory.config.initNavigator['appVersion']
navigator.platform= mframe.memory.config.initNavigator['platform']
navigator.hardwareConcurrency= mframe.memory.config.initNavigator['hardwareConcurrency']
navigator.webdriver= mframe.memory.config.initNavigator['webdriver']
navigator.appName= mframe.memory.config.initNavigator['appName']
navigator.appCodeName= mframe.memory.config.initNavigator['appCodeName']
navigator.deviceMemory= mframe.memory.config.initNavigator['deviceMemory']
navigator.maxTouchPoints= mframe.memory.config.initNavigator['maxTouchPoints']
navigator.onLine= mframe.memory.config.initNavigator['onLine']
navigator.pdfViewerEnabled= mframe.memory.config.initNavigator['pdfViewerEnabled']
navigator.vendor= mframe.memory.config.initNavigator['vendor']
navigator.vendorSub= mframe.memory.config.initNavigator['vendorSub']
navigator.product= mframe.memory.config.initNavigator['product']
navigator.productSub= mframe.memory.config.initNavigator['productSub']
//////////////===ATTRIBUTES==///////////////////////////////
// connection
curMemoryArea.connection_getter = function connection() { return this._connection; }; mframe.safefunction(curMemoryArea.connection_getter);
Object.defineProperty(curMemoryArea.connection_getter, "name", { value: "get connection", configurable: true, });
Object.defineProperty(Navigator.prototype, "connection", { get: curMemoryArea.connection_getter, enumerable: true, configurable: true, });
curMemoryArea.connection_smart_getter = function connection() {
    var res = mframe.networkInformation;
    mframe.log({ flag: 'property', className: 'Navigator', propertyName: 'connection', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.connection_smart_getter);
Navigator.prototype.__defineGetter__("connection", curMemoryArea.connection_smart_getter);


////////////////==FUNCTION==////////////////////////////////
Navigator.prototype["getBattery"] = function getBattery() {
    var res = new Promise();
    mframe.log({ flag: 'function', className: 'Navigator', methodName: 'getBattery', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Navigator.prototype["getBattery"]);
///////////////////////////////////////////////////



navigator.__proto__ = Navigator.prototype;

// // 解决Navigator.prototype.属性抛异常, 只能通过navigator.属性去调用 (本质上可以理解为代理的简写); Navigator中所有属性都是这样的
// for (var prototype_ in Navigator.prototype) {
//     navigator[prototype_] = Navigator.prototype[prototype_];
//     Navigator.prototype.__defineGetter__(prototype_, function () {
//         debugger;// 啥网站啊,这都检测-_-!
//         throw new TypeError('不允许Navigator.prototype.属性 这样的操作')
//     });
// }




navigator = mframe.proxy(navigator)
var MimeType = function MimeType() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(MimeType)
Object.defineProperties(MimeType.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeType",
        configurable: true,
    }
})


//////////////////////////////////
var curMemoryArea = mframe.memory.MimeType = {};

//%%%%%%% Attribute START %%%%%%%%%%
// type
curMemoryArea.type_getter = function type() { debugger; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", { value: "get type", configurable: true, });
Object.defineProperty(MimeType.prototype, "type", { get: curMemoryArea.type_getter, enumerable: true, configurable: true, });
curMemoryArea.type_smart_getter = function type() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的type的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.type_smart_getter);
MimeType.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// suffixes
curMemoryArea.suffixes_getter = function suffixes() { debugger; }; mframe.safefunction(curMemoryArea.suffixes_getter);
Object.defineProperty(curMemoryArea.suffixes_getter, "name", { value: "get suffixes", configurable: true, });
Object.defineProperty(MimeType.prototype, "suffixes", { get: curMemoryArea.suffixes_getter, enumerable: true, configurable: true, });
curMemoryArea.suffixes_smart_getter = function suffixes() {
    let defaultValue = 0;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的suffixes的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.suffixes_smart_getter);
MimeType.prototype.__defineGetter__("suffixes", curMemoryArea.suffixes_smart_getter);

// description
curMemoryArea.description_getter = function description() { debugger; }; mframe.safefunction(curMemoryArea.description_getter);
Object.defineProperty(curMemoryArea.description_getter, "name", { value: "get description", configurable: true, });
Object.defineProperty(MimeType.prototype, "description", { get: curMemoryArea.description_getter, enumerable: true, configurable: true, });
curMemoryArea.description_smart_getter = function description() {
    let defaultValue = "";
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的description的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.description_smart_getter);
MimeType.prototype.__defineGetter__("description", curMemoryArea.description_smart_getter);

// enabledPlugin
curMemoryArea.enabledPlugin_getter = function enabledPlugin() { debugger; }; mframe.safefunction(curMemoryArea.enabledPlugin_getter);
Object.defineProperty(curMemoryArea.enabledPlugin_getter, "name", { value: "get enabledPlugin", configurable: true, });
Object.defineProperty(MimeType.prototype, "enabledPlugin", { get: curMemoryArea.enabledPlugin_getter, enumerable: true, configurable: true, });
curMemoryArea.enabledPlugin_smart_getter = function enabledPlugin() {
    let defaultValue = null;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    console.log(`${this}调用了"MimeType"中的enabledPlugin的get方法,\x1b[31m返回默认值:${defaultValue}\x1b[0m`);
    return defaultValue; // 如果是实例访问，返回默认值
}; mframe.safefunction(curMemoryArea.enabledPlugin_smart_getter);
MimeType.prototype.__defineGetter__("enabledPlugin", curMemoryArea.enabledPlugin_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////

// 保持原型属性和实例属性相同(如果没有原型,会直接报错)
for (let prototypeName in MimeType.prototype) {
    // 这样不会触发 直接访问实例属性的报错
    const descriptor = Object.getOwnPropertyDescriptor(MimeType.prototype, prototypeName);
    if (descriptor && (descriptor.value && typeof descriptor.value === 'function')) { //是方法

    } else {// 是属性or类
        MimeType.prototype.__defineGetter__(prototypeName, function () {
            return this[prototypeName];
        })
    }
}

/** 支持内部 new MimeType
 * 
 * @param {*} mimeTypeObj 
 * @returns 
 * 传入mimeTypeObj示例:
 * 
var mm = mframe.memory.MimeType.new({
    description: "Portable Document Format1",
    enabledPlugin: "Plugin1",
    suffixes: "pd1f",
    type: "application/pdf1",
});
 */
mframe.memory.MimeType.new = function (mimeTypeObj, initPlugin) {
    var mimeType = {};
    mimeType.description = mimeTypeObj.description;
    mimeType.enabledPlugin = initPlugin; //这个属性是Plugin的实例
    mimeType.suffixes = mimeTypeObj.suffixes;
    mimeType.type = mimeTypeObj.type;
    mimeType.__proto__ = MimeType.prototype;
    return mimeType;
}


/**代理 */
MimeType = mframe.proxy(MimeType)
mframe.memory.Plugin = {}; // 内存给Plugin开一片空间, 存储Plugin的全局变量,避免污染window的全局

var Plugin = function Plugin() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Plugin)


mframe.memory.Plugin.iterator = function values() { // 迭代器
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.Plugin.iterator);

Object.defineProperties(Plugin.prototype, {
    [Symbol.toStringTag]: {
        value: "Plugin",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.Plugin.iterator,
        configurable: true
    },
})


//////////////////////////////////
//===================Plugin 的原型属性 START===================
Plugin.prototype.name = "";
Plugin.prototype.filename = "";
Plugin.prototype.description = "";
Plugin.prototype.length = 0;

Plugin.prototype.item = function item() { debugger; }; mframe.safefunction(Plugin.prototype.item);
Plugin.prototype.namedItem = function namedItem() { debugger; }; mframe.safefunction(Plugin.prototype.namedItem);
//================ ↑↑↑Plugin 的原型属性 END↑↑↑ ================

//////////////////////////////////


// 保持原型属性和实例属性相同(如果没有原型,会直接报错)
for (let prototypeName in Plugin.prototype) {
    if (typeof (Plugin.prototype[prototypeName]) != "function") {
        Plugin.prototype.__defineGetter__(prototypeName, function () {
            return this[prototypeName];
        })
    }
}


/** 支持内部 new Plugin
 * 
 * @param {*} pluginObj 包含Plugin基本信息的对象
 * Plugin不允许被new, 那Plugin从哪来呢???
 * 但Plugin只是我们用, 网站只会检测, 不可能new一个Plugin往里加入
 * 所以new只有我们会用, so, 给一个方法来new即可
传入的pluginObj示例:
var aa = mframe.memory.Plugin.new({
    description: "Portable Document Format",
    filename: "internal-pdf-viewer",
    name: "PDF Viewer",
    mimeTypeArray: [
        {
          description: "Portable Document Format",
          enabledPlugin: "Plugin",
          suffixes: "pdf",
          type: "application/pdf",
        },
        {
          description: "Portable Document Format1",
          enabledPlugin: "Plugin1",
          suffixes: "pd1f",
          type: "application/pdf1",
        },
    ]
});
 */
mframe.memory.Plugin.new = function (pluginObj) {
    var plugin = {};
    plugin.description = pluginObj.description;
    plugin.filename = pluginObj.filename;
    plugin.name = pluginObj.name;

    for (let i = 0; i < pluginObj.mimeTypeArray.length; i++) {
        // part1: MineType索引: MineType实例
        plugin[i] = mframe.memory.MimeType.new(pluginObj.mimeTypeArray[i], plugin);

        // part2: MineType名字表示; 处理名字为灰色的
        Object.defineProperty(
            plugin,                                    // 哪个对象
            pluginObj.mimeTypeArray[i].type,           // 哪个属性
            { value: pluginObj.mimeTypeArray[i] }      // 属性的值,还是属性的是否可写...
        );
    }
    plugin.length = pluginObj.mimeTypeArray.length;
    plugin.__proto__ = Plugin.prototype;
    /** 实例和原型的 属性名相同, 原型的该属性会被实例的该属性覆盖*/
    return plugin;
}


/**代理 */
Plugin = mframe.proxy(Plugin)
mframe.memory.PluginArray = {}
var PluginArray = function PluginArray() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(PluginArray)

mframe.memory.PluginArray.iterator = function values() {
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.PluginArray.iterator);
Object.defineProperties(PluginArray.prototype, {
    [Symbol.toStringTag]: {
        value: "PluginArray",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.PluginArray.iterator,
        configurable: true,
    },
})


//////////////////////////////////
var curMemoryArea = mframe.memory.PluginArray;

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// length
curMemoryArea.length_getter = function length() { debugger; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(PluginArray.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    let defaultValue = this.length;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    return defaultValue; // 已经正确修改返回值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
PluginArray.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
PluginArray.prototype["item"] = function item() { debugger; }; mframe.safefunction(PluginArray.prototype["item"]);
PluginArray.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(PluginArray.prototype["namedItem"]);
PluginArray.prototype["refresh"] = function refresh() { debugger; }; mframe.safefunction(PluginArray.prototype["refresh"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////


// window里面不能有 PluginArray 的实例, 只有navigator中可以有
mframe.memory.PluginArray._ ={};
for (let index = 0; index < mframe.memory.config.pluginArray.length; index++) {
    // part1: 索引
    mframe.memory.PluginArray._[index] = mframe.memory.Plugin.new( mframe.memory.config.pluginArray[index]);
    // part2: 名字变色
    Object.defineProperty(mframe.memory.PluginArray._,
        mframe.memory.config.pluginArray[index].name, {
        value: mframe.memory.config.pluginArray[index]
    });
    mframe.memory.PluginArray._.length = mframe.memory.config.pluginArray.length;
}

mframe.memory.PluginArray._.__proto__ = PluginArray.prototype;
navigator.plugins = mframe.memory.PluginArray._;

/**代理 */
navigator.plugins = mframe.proxy(navigator.plugins)
mframe.memory.MimeTypeArray = {}
var MimeTypeArray = function MimeTypeArray() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(MimeTypeArray)

mframe.memory.MimeTypeArray.iterator = function values() {
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.MimeTypeArray.iterator);
Object.defineProperties(MimeTypeArray.prototype, {
    [Symbol.toStringTag]: {
        value: "MimeTypeArray",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.MimeTypeArray.iterator,
        configurable: true,
    },
})


//////////////////////////////////
var curMemoryArea = mframe.memory.MimeTypeArray;

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%
// length
curMemoryArea.length_getter = function length() { debugger; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(MimeTypeArray.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    let defaultValue = this.length;
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    return defaultValue; // 已经正确修改返回值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
MimeTypeArray.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
MimeTypeArray.prototype["item"] = function item() { debugger; }; mframe.safefunction(MimeTypeArray.prototype["item"]);
MimeTypeArray.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(MimeTypeArray.prototype["namedItem"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////



mframe.memory.MimeTypeArray._ = {}
// 初始化所有MimeType并和PluginArray建立关联

let mimeTypeIndex = 0; // 记录mimeTypeArray的长度
for (let pluginIndex = 0; pluginIndex < mframe.memory.config.pluginArray.length; pluginIndex++) {
    const pluginConfig = mframe.memory.config.pluginArray[pluginIndex];
    const pluginInstance = mframe.memory.PluginArray._[pluginIndex];
    
    for (let mimeIndex = 0; mimeIndex < pluginConfig.mimeTypeArray.length; mimeIndex++) {
        const mimeConfig = pluginConfig.mimeTypeArray[mimeIndex];
        
        // 创建MimeType实例，enabledPlugin参数传入对应的Plugin实例
        const mimeInstance = mframe.memory.MimeType.new(mimeConfig, pluginInstance);
        
        // 添加到MimeTypeArray中，使用数字索引
        mframe.memory.MimeTypeArray._[mimeTypeIndex] = mimeInstance;
        
        // 添加到MimeTypeArray中，使用类型名称作为索引
        Object.defineProperty(mframe.memory.MimeTypeArray._, mimeConfig.type, {
            value: mimeInstance,
            enumerable: false,
            configurable: true
        });
        
        mimeTypeIndex++;
    }
}
mframe.memory.MimeTypeArray._.length = mimeTypeIndex; // mimeTypeArray的长度


mframe.memory.MimeTypeArray._.__proto__ = MimeTypeArray.prototype;
navigator.mimeTypes = mframe.memory.MimeTypeArray._;


/**代理 */
navigator.mimeTypes = mframe.proxy(navigator.mimeTypes)

var History = function () { 
    debugger;
    throw new TypeError('History 不允许被new')
}; mframe.safefunction(History);

Object.defineProperties(History.prototype, {
    [Symbol.toStringTag]: {
        value: "History",
        configurable: true,
    }
});


///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.History = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%


//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
// History.prototype["back"] = function back() { debugger; }; mframe.safefunction(History.prototype["back"]);
// History.prototype["forward"] = function forward() { debugger; }; mframe.safefunction(History.prototype["forward"]);
// History.prototype["go"] = function go() { debugger; }; mframe.safefunction(History.prototype["go"]);
// History.prototype["pushState"] = function pushState() { debugger; }; mframe.safefunction(History.prototype["pushState"]);
History.prototype["replaceState"] = function replaceState() { debugger; }; mframe.safefunction(History.prototype["replaceState"]);
//==============↑↑Function END↑↑====================
History.prototype.back = function back(){debugger;}; mframe.safefunction(History.prototype.back);


///////////////////////////////////////////////////
history= {} 
history.__proto__ = History.prototype;
history=mframe.proxy(history) // 代理
var Node = function Node() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(Node)

Object.defineProperties(Node.prototype, {
    [Symbol.toStringTag]: {
        value: "Node",
        configurable: true,
    }
})


////////////////Prototype Prototype Prototype////////////////
var curMemoryArea = mframe.memory.Node = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%%%%%%%%%%%%%%%

// parentNode
curMemoryArea.parentNode_getter = function parentNode() { debugger; }; mframe.safefunction(curMemoryArea.parentNode_getter);
Object.defineProperty(curMemoryArea.parentNode_getter, "name", { value: "get parentNode", configurable: true, });
Object.defineProperty(Node.prototype, "parentNode", { get: curMemoryArea.parentNode_getter, enumerable: true, configurable: true, });
curMemoryArea.parentNode_smart_getter = function parentNode() {
    var res = this.jsdomMemory.parentNode;
    mframe.log({ flag: 'property', className: 'Node', propertyName: 'parentNode', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.parentNode_smart_getter);
Node.prototype.__defineGetter__("parentNode", curMemoryArea.parentNode_smart_getter);

// parentElement
curMemoryArea.parentElement_getter = function parentElement() { debugger; }; mframe.safefunction(curMemoryArea.parentElement_getter);
Object.defineProperty(curMemoryArea.parentElement_getter, "name", { value: "get parentElement", configurable: true, });
Object.defineProperty(Node.prototype, "parentElement", { get: curMemoryArea.parentElement_getter, enumerable: true, configurable: true, });
curMemoryArea.parentElement_smart_getter = function parentElement() {
    var res = this.jsdomMemory.parentElement;
    mframe.log({ flag: 'property', className: 'Node', propertyName: 'parentElement', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.parentElement_smart_getter);
Node.prototype.__defineGetter__("parentElement", curMemoryArea.parentElement_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%%%%%%%%%%%%%%%%%

//============== Function START ====================
Node.prototype["appendChild"] = function appendChild(aChild) {
    // 一定是一个实例来调用appendChild才有用,this.jsdomMemory是jsdom的; aChild是我们伪造的,aChild.jsdomMemory是jsdom创建的
    var res = this.jsdomMemory.appendChild(aChild.jsdomMemory);
    mframe.log({ flag: 'function', className: 'Node', methodName: 'appendChild', inputVal: arguments, res: res });
    return res;

}; mframe.safefunction(Node.prototype["appendChild"]);

Node.prototype["removeChild"] = function removeChild(child) {

    var res = this.jsdomMemory.removeChild(child)
    mframe.log({ flag: 'function', className: 'Node', methodName: 'removeChild', inputVal: arguments, res: res });
    return res;

}; mframe.safefunction(Node.prototype["removeChild"]);
Node.prototype["replaceChild"] = function replaceChild() { debugger; }; mframe.safefunction(Node.prototype["replaceChild"]);
//==============↑↑Function END↑↑====================


////////////////Instance Instance Instance///////////////////

// === hook jsdom===========================================
// remove
const or_removeChild = mframe.memory.jsdom.window.Node.prototype.removeChild
mframe.memory.jsdom.window.Node.prototype.removeChild = function (child) {
    var res = or_removeChild.call(this, child.jsdomMemory ? child.jsdomMemory : child);
    mframe.log({ flag: 'function', className: 'Node', methodName: '[Hook JSOM内部] removeChild', inputVal: arguments, res: res });
    
    return res;
}
// =======end================================================

/////////////////////////////////////////////////////////////


/**代理 */
Node.prototype.__proto__ = EventTarget.prototype;
Node = mframe.proxy(Node)
var Element = function Element() {
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

//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%%%%%%%%%%%%%%%%%%%%

//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%%%%%%%%%%%%%%%

//============== Function START ====================
Element.prototype["getElementsByTagName"] = function getElementsByTagName() {
    // Element 和Document这个方法的区别是, 一个调用的全局, 一个是实例下的TageName
    var elements = this.jsdomMemory.getElementsByTagName(...arguments);
    var res = mframe.memory.htmlelements['collection'](elements);
    mframe.log({ flag: 'function', className: 'Element', methodName: 'getElementsByTagName', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Element.prototype["getElementsByTagName"]);
Element.prototype["setAttribute"] = function setAttribute() {
    console.log(this.jsdomMemory.tagName);
    var res = this.jsdomMemory.setAttribute(...arguments);
    mframe.log({ flag: 'function', className: 'Element', methodName: 'setAttribute', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Element.prototype["setAttribute"]);

// 2025年4月12日14:28:38; 你知道吗? 这个bug我找了2天(20h), 终于明白日志的重要性, 准备封装完整的日志功能 TODO
Element.prototype["getAttribute"] = function getAttribute() {
    var res = this.jsdomMemory.getAttribute(...arguments);
    mframe.log({ flag: 'function', className: 'Element', methodName: 'getAttribute', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Element.prototype["getAttribute"]);

//==============↑↑Function END↑↑====================


// === hook jsdom====
// append
const or_append = mframe.memory.jsdom.window.Element.prototype.append
mframe.memory.jsdom.window.Element.prototype.append = function (child) {
    console.log("调用jsdom内部的 Element.prototype.append", child);
    mframe.log({ flag: 'function', className: 'Node', methodName: '[Hook JSOM内部] append', inputVal: arguments, res: res });
    return or_append.call(this, child.jsdomMemory ? child.jsdomMemory : child);
}
// =======end========

////////////////////////////////////////////////////////////////////


/**代理 */
Element.prototype.__proto__ = Node.prototype;
Element = mframe.proxy(Element)
var HTMLElement = function HTMLElement() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(HTMLElement)

Object.defineProperties(HTMLElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLElement",
        configurable: true,
    }
})


//////////////////////////////////
var curMemoryArea = mframe.memory.HTMLElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// title
curMemoryArea.title_getter = function title() { return this._title; }; mframe.safefunction(curMemoryArea.title_getter);
Object.defineProperty(curMemoryArea.title_getter, "name", {value: "get title",configurable: true,});
// title
curMemoryArea.title_setter = function title(val) { this._title = val; }; mframe.safefunction(curMemoryArea.title_setter);
Object.defineProperty(curMemoryArea.title_setter, "name", {value: "set title",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "title", {get: curMemoryArea.title_getter,set: curMemoryArea.title_setter,enumerable: true,configurable: true,});
curMemoryArea.title_smart_getter = function title() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.title;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._title !== undefined ? this._title : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.title_smart_getter);
HTMLElement.prototype.__defineGetter__("title", curMemoryArea.title_smart_getter);

// lang
curMemoryArea.lang_getter = function lang() { return this._lang; }; mframe.safefunction(curMemoryArea.lang_getter);
Object.defineProperty(curMemoryArea.lang_getter, "name", {value: "get lang",configurable: true,});
// lang
curMemoryArea.lang_setter = function lang(val) { this._lang = val; }; mframe.safefunction(curMemoryArea.lang_setter);
Object.defineProperty(curMemoryArea.lang_setter, "name", {value: "set lang",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "lang", {get: curMemoryArea.lang_getter,set: curMemoryArea.lang_setter,enumerable: true,configurable: true,});
curMemoryArea.lang_smart_getter = function lang() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.lang;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._lang !== undefined ? this._lang : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.lang_smart_getter);
HTMLElement.prototype.__defineGetter__("lang", curMemoryArea.lang_smart_getter);

// translate
curMemoryArea.translate_getter = function translate() { return this._translate; }; mframe.safefunction(curMemoryArea.translate_getter);
Object.defineProperty(curMemoryArea.translate_getter, "name", {value: "get translate",configurable: true,});
// translate
curMemoryArea.translate_setter = function translate(val) { this._translate = val; }; mframe.safefunction(curMemoryArea.translate_setter);
Object.defineProperty(curMemoryArea.translate_setter, "name", {value: "set translate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "translate", {get: curMemoryArea.translate_getter,set: curMemoryArea.translate_setter,enumerable: true,configurable: true,});
curMemoryArea.translate_smart_getter = function translate() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.translate;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._translate !== undefined ? this._translate : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.translate_smart_getter);
HTMLElement.prototype.__defineGetter__("translate", curMemoryArea.translate_smart_getter);

// dir
curMemoryArea.dir_getter = function dir() { return this._dir; }; mframe.safefunction(curMemoryArea.dir_getter);
Object.defineProperty(curMemoryArea.dir_getter, "name", {value: "get dir",configurable: true,});
// dir
curMemoryArea.dir_setter = function dir(val) { this._dir = val; }; mframe.safefunction(curMemoryArea.dir_setter);
Object.defineProperty(curMemoryArea.dir_setter, "name", {value: "set dir",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "dir", {get: curMemoryArea.dir_getter,set: curMemoryArea.dir_setter,enumerable: true,configurable: true,});
curMemoryArea.dir_smart_getter = function dir() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.dir;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._dir !== undefined ? this._dir : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.dir_smart_getter);
HTMLElement.prototype.__defineGetter__("dir", curMemoryArea.dir_smart_getter);

// hidden
curMemoryArea.hidden_getter = function hidden() { return this._hidden; }; mframe.safefunction(curMemoryArea.hidden_getter);
Object.defineProperty(curMemoryArea.hidden_getter, "name", {value: "get hidden",configurable: true,});
// hidden
curMemoryArea.hidden_setter = function hidden(val) { this._hidden = val; }; mframe.safefunction(curMemoryArea.hidden_setter);
Object.defineProperty(curMemoryArea.hidden_setter, "name", {value: "set hidden",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "hidden", {get: curMemoryArea.hidden_getter,set: curMemoryArea.hidden_setter,enumerable: true,configurable: true,});
curMemoryArea.hidden_smart_getter = function hidden() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.hidden;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._hidden !== undefined ? this._hidden : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.hidden_smart_getter);
HTMLElement.prototype.__defineGetter__("hidden", curMemoryArea.hidden_smart_getter);

// inert
curMemoryArea.inert_getter = function inert() { return this._inert; }; mframe.safefunction(curMemoryArea.inert_getter);
Object.defineProperty(curMemoryArea.inert_getter, "name", {value: "get inert",configurable: true,});
// inert
curMemoryArea.inert_setter = function inert(val) { this._inert = val; }; mframe.safefunction(curMemoryArea.inert_setter);
Object.defineProperty(curMemoryArea.inert_setter, "name", {value: "set inert",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "inert", {get: curMemoryArea.inert_getter,set: curMemoryArea.inert_setter,enumerable: true,configurable: true,});
curMemoryArea.inert_smart_getter = function inert() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.inert;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._inert !== undefined ? this._inert : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.inert_smart_getter);
HTMLElement.prototype.__defineGetter__("inert", curMemoryArea.inert_smart_getter);

// accessKey
curMemoryArea.accessKey_getter = function accessKey() { return this._accessKey; }; mframe.safefunction(curMemoryArea.accessKey_getter);
Object.defineProperty(curMemoryArea.accessKey_getter, "name", {value: "get accessKey",configurable: true,});
// accessKey
curMemoryArea.accessKey_setter = function accessKey(val) { this._accessKey = val; }; mframe.safefunction(curMemoryArea.accessKey_setter);
Object.defineProperty(curMemoryArea.accessKey_setter, "name", {value: "set accessKey",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "accessKey", {get: curMemoryArea.accessKey_getter,set: curMemoryArea.accessKey_setter,enumerable: true,configurable: true,});
curMemoryArea.accessKey_smart_getter = function accessKey() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.accessKey;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._accessKey !== undefined ? this._accessKey : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.accessKey_smart_getter);
HTMLElement.prototype.__defineGetter__("accessKey", curMemoryArea.accessKey_smart_getter);

// draggable
curMemoryArea.draggable_getter = function draggable() { return this._draggable; }; mframe.safefunction(curMemoryArea.draggable_getter);
Object.defineProperty(curMemoryArea.draggable_getter, "name", {value: "get draggable",configurable: true,});
// draggable
curMemoryArea.draggable_setter = function draggable(val) { this._draggable = val; }; mframe.safefunction(curMemoryArea.draggable_setter);
Object.defineProperty(curMemoryArea.draggable_setter, "name", {value: "set draggable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "draggable", {get: curMemoryArea.draggable_getter,set: curMemoryArea.draggable_setter,enumerable: true,configurable: true,});
curMemoryArea.draggable_smart_getter = function draggable() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.draggable;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._draggable !== undefined ? this._draggable : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.draggable_smart_getter);
HTMLElement.prototype.__defineGetter__("draggable", curMemoryArea.draggable_smart_getter);

// spellcheck
curMemoryArea.spellcheck_getter = function spellcheck() { return this._spellcheck; }; mframe.safefunction(curMemoryArea.spellcheck_getter);
Object.defineProperty(curMemoryArea.spellcheck_getter, "name", {value: "get spellcheck",configurable: true,});
// spellcheck
curMemoryArea.spellcheck_setter = function spellcheck(val) { this._spellcheck = val; }; mframe.safefunction(curMemoryArea.spellcheck_setter);
Object.defineProperty(curMemoryArea.spellcheck_setter, "name", {value: "set spellcheck",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "spellcheck", {get: curMemoryArea.spellcheck_getter,set: curMemoryArea.spellcheck_setter,enumerable: true,configurable: true,});
curMemoryArea.spellcheck_smart_getter = function spellcheck() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.spellcheck;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._spellcheck !== undefined ? this._spellcheck : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.spellcheck_smart_getter);
HTMLElement.prototype.__defineGetter__("spellcheck", curMemoryArea.spellcheck_smart_getter);

// autocapitalize
curMemoryArea.autocapitalize_getter = function autocapitalize() { return this._autocapitalize; }; mframe.safefunction(curMemoryArea.autocapitalize_getter);
Object.defineProperty(curMemoryArea.autocapitalize_getter, "name", {value: "get autocapitalize",configurable: true,});
// autocapitalize
curMemoryArea.autocapitalize_setter = function autocapitalize(val) { this._autocapitalize = val; }; mframe.safefunction(curMemoryArea.autocapitalize_setter);
Object.defineProperty(curMemoryArea.autocapitalize_setter, "name", {value: "set autocapitalize",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "autocapitalize", {get: curMemoryArea.autocapitalize_getter,set: curMemoryArea.autocapitalize_setter,enumerable: true,configurable: true,});
curMemoryArea.autocapitalize_smart_getter = function autocapitalize() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.autocapitalize;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._autocapitalize !== undefined ? this._autocapitalize : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.autocapitalize_smart_getter);
HTMLElement.prototype.__defineGetter__("autocapitalize", curMemoryArea.autocapitalize_smart_getter);

// editContext
curMemoryArea.editContext_getter = function editContext() { return this._editContext; }; mframe.safefunction(curMemoryArea.editContext_getter);
Object.defineProperty(curMemoryArea.editContext_getter, "name", {value: "get editContext",configurable: true,});
// editContext
curMemoryArea.editContext_setter = function editContext(val) { this._editContext = val; }; mframe.safefunction(curMemoryArea.editContext_setter);
Object.defineProperty(curMemoryArea.editContext_setter, "name", {value: "set editContext",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "editContext", {get: curMemoryArea.editContext_getter,set: curMemoryArea.editContext_setter,enumerable: true,configurable: true,});
curMemoryArea.editContext_smart_getter = function editContext() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.editContext;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._editContext !== undefined ? this._editContext : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.editContext_smart_getter);
HTMLElement.prototype.__defineGetter__("editContext", curMemoryArea.editContext_smart_getter);

// contentEditable
curMemoryArea.contentEditable_getter = function contentEditable() { return this._contentEditable; }; mframe.safefunction(curMemoryArea.contentEditable_getter);
Object.defineProperty(curMemoryArea.contentEditable_getter, "name", {value: "get contentEditable",configurable: true,});
// contentEditable
curMemoryArea.contentEditable_setter = function contentEditable(val) { this._contentEditable = val; }; mframe.safefunction(curMemoryArea.contentEditable_setter);
Object.defineProperty(curMemoryArea.contentEditable_setter, "name", {value: "set contentEditable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "contentEditable", {get: curMemoryArea.contentEditable_getter,set: curMemoryArea.contentEditable_setter,enumerable: true,configurable: true,});
curMemoryArea.contentEditable_smart_getter = function contentEditable() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.contentEditable;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._contentEditable !== undefined ? this._contentEditable : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.contentEditable_smart_getter);
HTMLElement.prototype.__defineGetter__("contentEditable", curMemoryArea.contentEditable_smart_getter);

// enterKeyHint
curMemoryArea.enterKeyHint_getter = function enterKeyHint() { return this._enterKeyHint; }; mframe.safefunction(curMemoryArea.enterKeyHint_getter);
Object.defineProperty(curMemoryArea.enterKeyHint_getter, "name", {value: "get enterKeyHint",configurable: true,});
// enterKeyHint
curMemoryArea.enterKeyHint_setter = function enterKeyHint(val) { this._enterKeyHint = val; }; mframe.safefunction(curMemoryArea.enterKeyHint_setter);
Object.defineProperty(curMemoryArea.enterKeyHint_setter, "name", {value: "set enterKeyHint",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "enterKeyHint", {get: curMemoryArea.enterKeyHint_getter,set: curMemoryArea.enterKeyHint_setter,enumerable: true,configurable: true,});
curMemoryArea.enterKeyHint_smart_getter = function enterKeyHint() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.enterKeyHint;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._enterKeyHint !== undefined ? this._enterKeyHint : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.enterKeyHint_smart_getter);
HTMLElement.prototype.__defineGetter__("enterKeyHint", curMemoryArea.enterKeyHint_smart_getter);

// isContentEditable
curMemoryArea.isContentEditable_getter = function isContentEditable() { return this._isContentEditable; }; mframe.safefunction(curMemoryArea.isContentEditable_getter);
Object.defineProperty(curMemoryArea.isContentEditable_getter, "name", {value: "get isContentEditable",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "isContentEditable", {get: curMemoryArea.isContentEditable_getter,enumerable: true,configurable: true,});
curMemoryArea.isContentEditable_smart_getter = function isContentEditable() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.isContentEditable;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._isContentEditable !== undefined ? this._isContentEditable : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.isContentEditable_smart_getter);
HTMLElement.prototype.__defineGetter__("isContentEditable", curMemoryArea.isContentEditable_smart_getter);

// inputMode
curMemoryArea.inputMode_getter = function inputMode() { return this._inputMode; }; mframe.safefunction(curMemoryArea.inputMode_getter);
Object.defineProperty(curMemoryArea.inputMode_getter, "name", {value: "get inputMode",configurable: true,});
// inputMode
curMemoryArea.inputMode_setter = function inputMode(val) { this._inputMode = val; }; mframe.safefunction(curMemoryArea.inputMode_setter);
Object.defineProperty(curMemoryArea.inputMode_setter, "name", {value: "set inputMode",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "inputMode", {get: curMemoryArea.inputMode_getter,set: curMemoryArea.inputMode_setter,enumerable: true,configurable: true,});
curMemoryArea.inputMode_smart_getter = function inputMode() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.inputMode;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._inputMode !== undefined ? this._inputMode : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.inputMode_smart_getter);
HTMLElement.prototype.__defineGetter__("inputMode", curMemoryArea.inputMode_smart_getter);

// virtualKeyboardPolicy
curMemoryArea.virtualKeyboardPolicy_getter = function virtualKeyboardPolicy() { return this._virtualKeyboardPolicy; }; mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_getter);
Object.defineProperty(curMemoryArea.virtualKeyboardPolicy_getter, "name", {value: "get virtualKeyboardPolicy",configurable: true,});
// virtualKeyboardPolicy
curMemoryArea.virtualKeyboardPolicy_setter = function virtualKeyboardPolicy(val) { this._virtualKeyboardPolicy = val; }; mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_setter);
Object.defineProperty(curMemoryArea.virtualKeyboardPolicy_setter, "name", {value: "set virtualKeyboardPolicy",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "virtualKeyboardPolicy", {get: curMemoryArea.virtualKeyboardPolicy_getter,set: curMemoryArea.virtualKeyboardPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.virtualKeyboardPolicy_smart_getter = function virtualKeyboardPolicy() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.virtualKeyboardPolicy;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._virtualKeyboardPolicy !== undefined ? this._virtualKeyboardPolicy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.virtualKeyboardPolicy_smart_getter);
HTMLElement.prototype.__defineGetter__("virtualKeyboardPolicy", curMemoryArea.virtualKeyboardPolicy_smart_getter);

// offsetParent
curMemoryArea.offsetParent_getter = function offsetParent() { return this._offsetParent; }; mframe.safefunction(curMemoryArea.offsetParent_getter);
Object.defineProperty(curMemoryArea.offsetParent_getter, "name", {value: "get offsetParent",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetParent", {get: curMemoryArea.offsetParent_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetParent_smart_getter = function offsetParent() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetParent;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetParent !== undefined ? this._offsetParent : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetParent_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetParent", curMemoryArea.offsetParent_smart_getter);

// offsetTop
curMemoryArea.offsetTop_getter = function offsetTop() { return this._offsetTop; }; mframe.safefunction(curMemoryArea.offsetTop_getter);
Object.defineProperty(curMemoryArea.offsetTop_getter, "name", {value: "get offsetTop",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetTop", {get: curMemoryArea.offsetTop_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetTop_smart_getter = function offsetTop() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetTop;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetTop !== undefined ? this._offsetTop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetTop_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetTop", curMemoryArea.offsetTop_smart_getter);

// offsetLeft
curMemoryArea.offsetLeft_getter = function offsetLeft() { return this._offsetLeft; }; mframe.safefunction(curMemoryArea.offsetLeft_getter);
Object.defineProperty(curMemoryArea.offsetLeft_getter, "name", {value: "get offsetLeft",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetLeft", {get: curMemoryArea.offsetLeft_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetLeft_smart_getter = function offsetLeft() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetLeft;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetLeft !== undefined ? this._offsetLeft : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetLeft_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetLeft", curMemoryArea.offsetLeft_smart_getter);

// offsetWidth
curMemoryArea.offsetWidth_getter = function offsetWidth() { return this._offsetWidth; }; mframe.safefunction(curMemoryArea.offsetWidth_getter);
Object.defineProperty(curMemoryArea.offsetWidth_getter, "name", {value: "get offsetWidth",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetWidth", {get: curMemoryArea.offsetWidth_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetWidth_smart_getter = function offsetWidth() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetWidth;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetWidth !== undefined ? this._offsetWidth : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetWidth_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetWidth", curMemoryArea.offsetWidth_smart_getter);

// offsetHeight
curMemoryArea.offsetHeight_getter = function offsetHeight() { return this._offsetHeight; }; mframe.safefunction(curMemoryArea.offsetHeight_getter);
Object.defineProperty(curMemoryArea.offsetHeight_getter, "name", {value: "get offsetHeight",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "offsetHeight", {get: curMemoryArea.offsetHeight_getter,enumerable: true,configurable: true,});
curMemoryArea.offsetHeight_smart_getter = function offsetHeight() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.offsetHeight;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._offsetHeight !== undefined ? this._offsetHeight : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.offsetHeight_smart_getter);
HTMLElement.prototype.__defineGetter__("offsetHeight", curMemoryArea.offsetHeight_smart_getter);

// popover
curMemoryArea.popover_getter = function popover() { return this._popover; }; mframe.safefunction(curMemoryArea.popover_getter);
Object.defineProperty(curMemoryArea.popover_getter, "name", {value: "get popover",configurable: true,});
// popover
curMemoryArea.popover_setter = function popover(val) { this._popover = val; }; mframe.safefunction(curMemoryArea.popover_setter);
Object.defineProperty(curMemoryArea.popover_setter, "name", {value: "set popover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "popover", {get: curMemoryArea.popover_getter,set: curMemoryArea.popover_setter,enumerable: true,configurable: true,});
curMemoryArea.popover_smart_getter = function popover() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.popover;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._popover !== undefined ? this._popover : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.popover_smart_getter);
HTMLElement.prototype.__defineGetter__("popover", curMemoryArea.popover_smart_getter);

// innerText
curMemoryArea.innerText_getter = function innerText() { return this._innerText; }; mframe.safefunction(curMemoryArea.innerText_getter);
Object.defineProperty(curMemoryArea.innerText_getter, "name", {value: "get innerText",configurable: true,});
// innerText
curMemoryArea.innerText_setter = function innerText(val) { this._innerText = val; }; mframe.safefunction(curMemoryArea.innerText_setter);
Object.defineProperty(curMemoryArea.innerText_setter, "name", {value: "set innerText",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "innerText", {get: curMemoryArea.innerText_getter,set: curMemoryArea.innerText_setter,enumerable: true,configurable: true,});
curMemoryArea.innerText_smart_getter = function innerText() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.innerText;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._innerText !== undefined ? this._innerText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.innerText_smart_getter);
HTMLElement.prototype.__defineGetter__("innerText", curMemoryArea.innerText_smart_getter);

// outerText
curMemoryArea.outerText_getter = function outerText() { return this._outerText; }; mframe.safefunction(curMemoryArea.outerText_getter);
Object.defineProperty(curMemoryArea.outerText_getter, "name", {value: "get outerText",configurable: true,});
// outerText
curMemoryArea.outerText_setter = function outerText(val) { this._outerText = val; }; mframe.safefunction(curMemoryArea.outerText_setter);
Object.defineProperty(curMemoryArea.outerText_setter, "name", {value: "set outerText",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "outerText", {get: curMemoryArea.outerText_getter,set: curMemoryArea.outerText_setter,enumerable: true,configurable: true,});
curMemoryArea.outerText_smart_getter = function outerText() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.outerText;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._outerText !== undefined ? this._outerText : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.outerText_smart_getter);
HTMLElement.prototype.__defineGetter__("outerText", curMemoryArea.outerText_smart_getter);

// writingSuggestions
curMemoryArea.writingSuggestions_getter = function writingSuggestions() { return this._writingSuggestions; }; mframe.safefunction(curMemoryArea.writingSuggestions_getter);
Object.defineProperty(curMemoryArea.writingSuggestions_getter, "name", {value: "get writingSuggestions",configurable: true,});
// writingSuggestions
curMemoryArea.writingSuggestions_setter = function writingSuggestions(val) { this._writingSuggestions = val; }; mframe.safefunction(curMemoryArea.writingSuggestions_setter);
Object.defineProperty(curMemoryArea.writingSuggestions_setter, "name", {value: "set writingSuggestions",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "writingSuggestions", {get: curMemoryArea.writingSuggestions_getter,set: curMemoryArea.writingSuggestions_setter,enumerable: true,configurable: true,});
curMemoryArea.writingSuggestions_smart_getter = function writingSuggestions() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.writingSuggestions;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._writingSuggestions !== undefined ? this._writingSuggestions : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.writingSuggestions_smart_getter);
HTMLElement.prototype.__defineGetter__("writingSuggestions", curMemoryArea.writingSuggestions_smart_getter);

// onbeforexrselect
curMemoryArea.onbeforexrselect_getter = function onbeforexrselect() { return this._onbeforexrselect; }; mframe.safefunction(curMemoryArea.onbeforexrselect_getter);
Object.defineProperty(curMemoryArea.onbeforexrselect_getter, "name", {value: "get onbeforexrselect",configurable: true,});
// onbeforexrselect
curMemoryArea.onbeforexrselect_setter = function onbeforexrselect(val) { this._onbeforexrselect = val; }; mframe.safefunction(curMemoryArea.onbeforexrselect_setter);
Object.defineProperty(curMemoryArea.onbeforexrselect_setter, "name", {value: "set onbeforexrselect",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforexrselect", {get: curMemoryArea.onbeforexrselect_getter,set: curMemoryArea.onbeforexrselect_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforexrselect_smart_getter = function onbeforexrselect() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onbeforexrselect;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforexrselect !== undefined ? this._onbeforexrselect : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforexrselect_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforexrselect", curMemoryArea.onbeforexrselect_smart_getter);

// onabort
curMemoryArea.onabort_getter = function onabort() { return this._onabort; }; mframe.safefunction(curMemoryArea.onabort_getter);
Object.defineProperty(curMemoryArea.onabort_getter, "name", {value: "get onabort",configurable: true,});
// onabort
curMemoryArea.onabort_setter = function onabort(val) { this._onabort = val; }; mframe.safefunction(curMemoryArea.onabort_setter);
Object.defineProperty(curMemoryArea.onabort_setter, "name", {value: "set onabort",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onabort", {get: curMemoryArea.onabort_getter,set: curMemoryArea.onabort_setter,enumerable: true,configurable: true,});
curMemoryArea.onabort_smart_getter = function onabort() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onabort;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onabort !== undefined ? this._onabort : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onabort_smart_getter);
HTMLElement.prototype.__defineGetter__("onabort", curMemoryArea.onabort_smart_getter);

// onbeforeinput
curMemoryArea.onbeforeinput_getter = function onbeforeinput() { return this._onbeforeinput; }; mframe.safefunction(curMemoryArea.onbeforeinput_getter);
Object.defineProperty(curMemoryArea.onbeforeinput_getter, "name", {value: "get onbeforeinput",configurable: true,});
// onbeforeinput
curMemoryArea.onbeforeinput_setter = function onbeforeinput(val) { this._onbeforeinput = val; }; mframe.safefunction(curMemoryArea.onbeforeinput_setter);
Object.defineProperty(curMemoryArea.onbeforeinput_setter, "name", {value: "set onbeforeinput",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforeinput", {get: curMemoryArea.onbeforeinput_getter,set: curMemoryArea.onbeforeinput_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforeinput_smart_getter = function onbeforeinput() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onbeforeinput;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforeinput !== undefined ? this._onbeforeinput : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforeinput_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforeinput", curMemoryArea.onbeforeinput_smart_getter);

// onbeforematch
curMemoryArea.onbeforematch_getter = function onbeforematch() { return this._onbeforematch; }; mframe.safefunction(curMemoryArea.onbeforematch_getter);
Object.defineProperty(curMemoryArea.onbeforematch_getter, "name", {value: "get onbeforematch",configurable: true,});
// onbeforematch
curMemoryArea.onbeforematch_setter = function onbeforematch(val) { this._onbeforematch = val; }; mframe.safefunction(curMemoryArea.onbeforematch_setter);
Object.defineProperty(curMemoryArea.onbeforematch_setter, "name", {value: "set onbeforematch",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforematch", {get: curMemoryArea.onbeforematch_getter,set: curMemoryArea.onbeforematch_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforematch_smart_getter = function onbeforematch() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onbeforematch;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforematch !== undefined ? this._onbeforematch : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforematch_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforematch", curMemoryArea.onbeforematch_smart_getter);

// onbeforetoggle
curMemoryArea.onbeforetoggle_getter = function onbeforetoggle() { return this._onbeforetoggle; }; mframe.safefunction(curMemoryArea.onbeforetoggle_getter);
Object.defineProperty(curMemoryArea.onbeforetoggle_getter, "name", {value: "get onbeforetoggle",configurable: true,});
// onbeforetoggle
curMemoryArea.onbeforetoggle_setter = function onbeforetoggle(val) { this._onbeforetoggle = val; }; mframe.safefunction(curMemoryArea.onbeforetoggle_setter);
Object.defineProperty(curMemoryArea.onbeforetoggle_setter, "name", {value: "set onbeforetoggle",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onbeforetoggle", {get: curMemoryArea.onbeforetoggle_getter,set: curMemoryArea.onbeforetoggle_setter,enumerable: true,configurable: true,});
curMemoryArea.onbeforetoggle_smart_getter = function onbeforetoggle() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onbeforetoggle;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onbeforetoggle !== undefined ? this._onbeforetoggle : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onbeforetoggle_smart_getter);
HTMLElement.prototype.__defineGetter__("onbeforetoggle", curMemoryArea.onbeforetoggle_smart_getter);

// onblur
curMemoryArea.onblur_getter = function onblur() { return this._onblur; }; mframe.safefunction(curMemoryArea.onblur_getter);
Object.defineProperty(curMemoryArea.onblur_getter, "name", {value: "get onblur",configurable: true,});
// onblur
curMemoryArea.onblur_setter = function onblur(val) { this._onblur = val; }; mframe.safefunction(curMemoryArea.onblur_setter);
Object.defineProperty(curMemoryArea.onblur_setter, "name", {value: "set onblur",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onblur", {get: curMemoryArea.onblur_getter,set: curMemoryArea.onblur_setter,enumerable: true,configurable: true,});
curMemoryArea.onblur_smart_getter = function onblur() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onblur;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onblur !== undefined ? this._onblur : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onblur_smart_getter);
HTMLElement.prototype.__defineGetter__("onblur", curMemoryArea.onblur_smart_getter);

// oncancel
curMemoryArea.oncancel_getter = function oncancel() { return this._oncancel; }; mframe.safefunction(curMemoryArea.oncancel_getter);
Object.defineProperty(curMemoryArea.oncancel_getter, "name", {value: "get oncancel",configurable: true,});
// oncancel
curMemoryArea.oncancel_setter = function oncancel(val) { this._oncancel = val; }; mframe.safefunction(curMemoryArea.oncancel_setter);
Object.defineProperty(curMemoryArea.oncancel_setter, "name", {value: "set oncancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncancel", {get: curMemoryArea.oncancel_getter,set: curMemoryArea.oncancel_setter,enumerable: true,configurable: true,});
curMemoryArea.oncancel_smart_getter = function oncancel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncancel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncancel !== undefined ? this._oncancel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncancel_smart_getter);
HTMLElement.prototype.__defineGetter__("oncancel", curMemoryArea.oncancel_smart_getter);

// oncanplay
curMemoryArea.oncanplay_getter = function oncanplay() { return this._oncanplay; }; mframe.safefunction(curMemoryArea.oncanplay_getter);
Object.defineProperty(curMemoryArea.oncanplay_getter, "name", {value: "get oncanplay",configurable: true,});
// oncanplay
curMemoryArea.oncanplay_setter = function oncanplay(val) { this._oncanplay = val; }; mframe.safefunction(curMemoryArea.oncanplay_setter);
Object.defineProperty(curMemoryArea.oncanplay_setter, "name", {value: "set oncanplay",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncanplay", {get: curMemoryArea.oncanplay_getter,set: curMemoryArea.oncanplay_setter,enumerable: true,configurable: true,});
curMemoryArea.oncanplay_smart_getter = function oncanplay() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncanplay;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncanplay !== undefined ? this._oncanplay : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncanplay_smart_getter);
HTMLElement.prototype.__defineGetter__("oncanplay", curMemoryArea.oncanplay_smart_getter);

// oncanplaythrough
curMemoryArea.oncanplaythrough_getter = function oncanplaythrough() { return this._oncanplaythrough; }; mframe.safefunction(curMemoryArea.oncanplaythrough_getter);
Object.defineProperty(curMemoryArea.oncanplaythrough_getter, "name", {value: "get oncanplaythrough",configurable: true,});
// oncanplaythrough
curMemoryArea.oncanplaythrough_setter = function oncanplaythrough(val) { this._oncanplaythrough = val; }; mframe.safefunction(curMemoryArea.oncanplaythrough_setter);
Object.defineProperty(curMemoryArea.oncanplaythrough_setter, "name", {value: "set oncanplaythrough",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncanplaythrough", {get: curMemoryArea.oncanplaythrough_getter,set: curMemoryArea.oncanplaythrough_setter,enumerable: true,configurable: true,});
curMemoryArea.oncanplaythrough_smart_getter = function oncanplaythrough() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncanplaythrough;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncanplaythrough !== undefined ? this._oncanplaythrough : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncanplaythrough_smart_getter);
HTMLElement.prototype.__defineGetter__("oncanplaythrough", curMemoryArea.oncanplaythrough_smart_getter);

// onchange
curMemoryArea.onchange_getter = function onchange() { return this._onchange; }; mframe.safefunction(curMemoryArea.onchange_getter);
Object.defineProperty(curMemoryArea.onchange_getter, "name", {value: "get onchange",configurable: true,});
// onchange
curMemoryArea.onchange_setter = function onchange(val) { this._onchange = val; }; mframe.safefunction(curMemoryArea.onchange_setter);
Object.defineProperty(curMemoryArea.onchange_setter, "name", {value: "set onchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onchange", {get: curMemoryArea.onchange_getter,set: curMemoryArea.onchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onchange_smart_getter = function onchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onchange !== undefined ? this._onchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onchange", curMemoryArea.onchange_smart_getter);

// onclick
curMemoryArea.onclick_getter = function onclick() { return this._onclick; }; mframe.safefunction(curMemoryArea.onclick_getter);
Object.defineProperty(curMemoryArea.onclick_getter, "name", {value: "get onclick",configurable: true,});
// onclick
curMemoryArea.onclick_setter = function onclick(val) { this._onclick = val; }; mframe.safefunction(curMemoryArea.onclick_setter);
Object.defineProperty(curMemoryArea.onclick_setter, "name", {value: "set onclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onclick", {get: curMemoryArea.onclick_getter,set: curMemoryArea.onclick_setter,enumerable: true,configurable: true,});
curMemoryArea.onclick_smart_getter = function onclick() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onclick;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onclick !== undefined ? this._onclick : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onclick_smart_getter);
HTMLElement.prototype.__defineGetter__("onclick", curMemoryArea.onclick_smart_getter);

// onclose
curMemoryArea.onclose_getter = function onclose() { return this._onclose; }; mframe.safefunction(curMemoryArea.onclose_getter);
Object.defineProperty(curMemoryArea.onclose_getter, "name", {value: "get onclose",configurable: true,});
// onclose
curMemoryArea.onclose_setter = function onclose(val) { this._onclose = val; }; mframe.safefunction(curMemoryArea.onclose_setter);
Object.defineProperty(curMemoryArea.onclose_setter, "name", {value: "set onclose",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onclose", {get: curMemoryArea.onclose_getter,set: curMemoryArea.onclose_setter,enumerable: true,configurable: true,});
curMemoryArea.onclose_smart_getter = function onclose() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onclose;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onclose !== undefined ? this._onclose : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onclose_smart_getter);
HTMLElement.prototype.__defineGetter__("onclose", curMemoryArea.onclose_smart_getter);

// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_getter = function oncontentvisibilityautostatechange() { return this._oncontentvisibilityautostatechange; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_getter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_getter, "name", {value: "get oncontentvisibilityautostatechange",configurable: true,});
// oncontentvisibilityautostatechange
curMemoryArea.oncontentvisibilityautostatechange_setter = function oncontentvisibilityautostatechange(val) { this._oncontentvisibilityautostatechange = val; }; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_setter);
Object.defineProperty(curMemoryArea.oncontentvisibilityautostatechange_setter, "name", {value: "set oncontentvisibilityautostatechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontentvisibilityautostatechange", {get: curMemoryArea.oncontentvisibilityautostatechange_getter,set: curMemoryArea.oncontentvisibilityautostatechange_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontentvisibilityautostatechange_smart_getter = function oncontentvisibilityautostatechange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncontentvisibilityautostatechange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncontentvisibilityautostatechange !== undefined ? this._oncontentvisibilityautostatechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncontentvisibilityautostatechange_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontentvisibilityautostatechange", curMemoryArea.oncontentvisibilityautostatechange_smart_getter);

// oncontextlost
curMemoryArea.oncontextlost_getter = function oncontextlost() { return this._oncontextlost; }; mframe.safefunction(curMemoryArea.oncontextlost_getter);
Object.defineProperty(curMemoryArea.oncontextlost_getter, "name", {value: "get oncontextlost",configurable: true,});
// oncontextlost
curMemoryArea.oncontextlost_setter = function oncontextlost(val) { this._oncontextlost = val; }; mframe.safefunction(curMemoryArea.oncontextlost_setter);
Object.defineProperty(curMemoryArea.oncontextlost_setter, "name", {value: "set oncontextlost",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextlost", {get: curMemoryArea.oncontextlost_getter,set: curMemoryArea.oncontextlost_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextlost_smart_getter = function oncontextlost() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncontextlost;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncontextlost !== undefined ? this._oncontextlost : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncontextlost_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextlost", curMemoryArea.oncontextlost_smart_getter);

// oncontextmenu
curMemoryArea.oncontextmenu_getter = function oncontextmenu() { return this._oncontextmenu; }; mframe.safefunction(curMemoryArea.oncontextmenu_getter);
Object.defineProperty(curMemoryArea.oncontextmenu_getter, "name", {value: "get oncontextmenu",configurable: true,});
// oncontextmenu
curMemoryArea.oncontextmenu_setter = function oncontextmenu(val) { this._oncontextmenu = val; }; mframe.safefunction(curMemoryArea.oncontextmenu_setter);
Object.defineProperty(curMemoryArea.oncontextmenu_setter, "name", {value: "set oncontextmenu",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextmenu", {get: curMemoryArea.oncontextmenu_getter,set: curMemoryArea.oncontextmenu_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextmenu_smart_getter = function oncontextmenu() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncontextmenu;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncontextmenu !== undefined ? this._oncontextmenu : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncontextmenu_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextmenu", curMemoryArea.oncontextmenu_smart_getter);

// oncontextrestored
curMemoryArea.oncontextrestored_getter = function oncontextrestored() { return this._oncontextrestored; }; mframe.safefunction(curMemoryArea.oncontextrestored_getter);
Object.defineProperty(curMemoryArea.oncontextrestored_getter, "name", {value: "get oncontextrestored",configurable: true,});
// oncontextrestored
curMemoryArea.oncontextrestored_setter = function oncontextrestored(val) { this._oncontextrestored = val; }; mframe.safefunction(curMemoryArea.oncontextrestored_setter);
Object.defineProperty(curMemoryArea.oncontextrestored_setter, "name", {value: "set oncontextrestored",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncontextrestored", {get: curMemoryArea.oncontextrestored_getter,set: curMemoryArea.oncontextrestored_setter,enumerable: true,configurable: true,});
curMemoryArea.oncontextrestored_smart_getter = function oncontextrestored() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncontextrestored;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncontextrestored !== undefined ? this._oncontextrestored : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncontextrestored_smart_getter);
HTMLElement.prototype.__defineGetter__("oncontextrestored", curMemoryArea.oncontextrestored_smart_getter);

// oncuechange
curMemoryArea.oncuechange_getter = function oncuechange() { return this._oncuechange; }; mframe.safefunction(curMemoryArea.oncuechange_getter);
Object.defineProperty(curMemoryArea.oncuechange_getter, "name", {value: "get oncuechange",configurable: true,});
// oncuechange
curMemoryArea.oncuechange_setter = function oncuechange(val) { this._oncuechange = val; }; mframe.safefunction(curMemoryArea.oncuechange_setter);
Object.defineProperty(curMemoryArea.oncuechange_setter, "name", {value: "set oncuechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncuechange", {get: curMemoryArea.oncuechange_getter,set: curMemoryArea.oncuechange_setter,enumerable: true,configurable: true,});
curMemoryArea.oncuechange_smart_getter = function oncuechange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncuechange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncuechange !== undefined ? this._oncuechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncuechange_smart_getter);
HTMLElement.prototype.__defineGetter__("oncuechange", curMemoryArea.oncuechange_smart_getter);

// ondblclick
curMemoryArea.ondblclick_getter = function ondblclick() { return this._ondblclick; }; mframe.safefunction(curMemoryArea.ondblclick_getter);
Object.defineProperty(curMemoryArea.ondblclick_getter, "name", {value: "get ondblclick",configurable: true,});
// ondblclick
curMemoryArea.ondblclick_setter = function ondblclick(val) { this._ondblclick = val; }; mframe.safefunction(curMemoryArea.ondblclick_setter);
Object.defineProperty(curMemoryArea.ondblclick_setter, "name", {value: "set ondblclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondblclick", {get: curMemoryArea.ondblclick_getter,set: curMemoryArea.ondblclick_setter,enumerable: true,configurable: true,});
curMemoryArea.ondblclick_smart_getter = function ondblclick() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondblclick;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondblclick !== undefined ? this._ondblclick : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondblclick_smart_getter);
HTMLElement.prototype.__defineGetter__("ondblclick", curMemoryArea.ondblclick_smart_getter);

// ondrag
curMemoryArea.ondrag_getter = function ondrag() { return this._ondrag; }; mframe.safefunction(curMemoryArea.ondrag_getter);
Object.defineProperty(curMemoryArea.ondrag_getter, "name", {value: "get ondrag",configurable: true,});
// ondrag
curMemoryArea.ondrag_setter = function ondrag(val) { this._ondrag = val; }; mframe.safefunction(curMemoryArea.ondrag_setter);
Object.defineProperty(curMemoryArea.ondrag_setter, "name", {value: "set ondrag",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondrag", {get: curMemoryArea.ondrag_getter,set: curMemoryArea.ondrag_setter,enumerable: true,configurable: true,});
curMemoryArea.ondrag_smart_getter = function ondrag() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondrag;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondrag !== undefined ? this._ondrag : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondrag_smart_getter);
HTMLElement.prototype.__defineGetter__("ondrag", curMemoryArea.ondrag_smart_getter);

// ondragend
curMemoryArea.ondragend_getter = function ondragend() { return this._ondragend; }; mframe.safefunction(curMemoryArea.ondragend_getter);
Object.defineProperty(curMemoryArea.ondragend_getter, "name", {value: "get ondragend",configurable: true,});
// ondragend
curMemoryArea.ondragend_setter = function ondragend(val) { this._ondragend = val; }; mframe.safefunction(curMemoryArea.ondragend_setter);
Object.defineProperty(curMemoryArea.ondragend_setter, "name", {value: "set ondragend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragend", {get: curMemoryArea.ondragend_getter,set: curMemoryArea.ondragend_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragend_smart_getter = function ondragend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragend !== undefined ? this._ondragend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragend_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragend", curMemoryArea.ondragend_smart_getter);

// ondragenter
curMemoryArea.ondragenter_getter = function ondragenter() { return this._ondragenter; }; mframe.safefunction(curMemoryArea.ondragenter_getter);
Object.defineProperty(curMemoryArea.ondragenter_getter, "name", {value: "get ondragenter",configurable: true,});
// ondragenter
curMemoryArea.ondragenter_setter = function ondragenter(val) { this._ondragenter = val; }; mframe.safefunction(curMemoryArea.ondragenter_setter);
Object.defineProperty(curMemoryArea.ondragenter_setter, "name", {value: "set ondragenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragenter", {get: curMemoryArea.ondragenter_getter,set: curMemoryArea.ondragenter_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragenter_smart_getter = function ondragenter() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragenter;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragenter !== undefined ? this._ondragenter : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragenter_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragenter", curMemoryArea.ondragenter_smart_getter);

// ondragleave
curMemoryArea.ondragleave_getter = function ondragleave() { return this._ondragleave; }; mframe.safefunction(curMemoryArea.ondragleave_getter);
Object.defineProperty(curMemoryArea.ondragleave_getter, "name", {value: "get ondragleave",configurable: true,});
// ondragleave
curMemoryArea.ondragleave_setter = function ondragleave(val) { this._ondragleave = val; }; mframe.safefunction(curMemoryArea.ondragleave_setter);
Object.defineProperty(curMemoryArea.ondragleave_setter, "name", {value: "set ondragleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragleave", {get: curMemoryArea.ondragleave_getter,set: curMemoryArea.ondragleave_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragleave_smart_getter = function ondragleave() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragleave;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragleave !== undefined ? this._ondragleave : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragleave_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragleave", curMemoryArea.ondragleave_smart_getter);

// ondragover
curMemoryArea.ondragover_getter = function ondragover() { return this._ondragover; }; mframe.safefunction(curMemoryArea.ondragover_getter);
Object.defineProperty(curMemoryArea.ondragover_getter, "name", {value: "get ondragover",configurable: true,});
// ondragover
curMemoryArea.ondragover_setter = function ondragover(val) { this._ondragover = val; }; mframe.safefunction(curMemoryArea.ondragover_setter);
Object.defineProperty(curMemoryArea.ondragover_setter, "name", {value: "set ondragover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragover", {get: curMemoryArea.ondragover_getter,set: curMemoryArea.ondragover_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragover_smart_getter = function ondragover() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragover;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragover !== undefined ? this._ondragover : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragover_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragover", curMemoryArea.ondragover_smart_getter);

// ondragstart
curMemoryArea.ondragstart_getter = function ondragstart() { return this._ondragstart; }; mframe.safefunction(curMemoryArea.ondragstart_getter);
Object.defineProperty(curMemoryArea.ondragstart_getter, "name", {value: "get ondragstart",configurable: true,});
// ondragstart
curMemoryArea.ondragstart_setter = function ondragstart(val) { this._ondragstart = val; }; mframe.safefunction(curMemoryArea.ondragstart_setter);
Object.defineProperty(curMemoryArea.ondragstart_setter, "name", {value: "set ondragstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondragstart", {get: curMemoryArea.ondragstart_getter,set: curMemoryArea.ondragstart_setter,enumerable: true,configurable: true,});
curMemoryArea.ondragstart_smart_getter = function ondragstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondragstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondragstart !== undefined ? this._ondragstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondragstart_smart_getter);
HTMLElement.prototype.__defineGetter__("ondragstart", curMemoryArea.ondragstart_smart_getter);

// ondrop
curMemoryArea.ondrop_getter = function ondrop() { return this._ondrop; }; mframe.safefunction(curMemoryArea.ondrop_getter);
Object.defineProperty(curMemoryArea.ondrop_getter, "name", {value: "get ondrop",configurable: true,});
// ondrop
curMemoryArea.ondrop_setter = function ondrop(val) { this._ondrop = val; }; mframe.safefunction(curMemoryArea.ondrop_setter);
Object.defineProperty(curMemoryArea.ondrop_setter, "name", {value: "set ondrop",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondrop", {get: curMemoryArea.ondrop_getter,set: curMemoryArea.ondrop_setter,enumerable: true,configurable: true,});
curMemoryArea.ondrop_smart_getter = function ondrop() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondrop;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondrop !== undefined ? this._ondrop : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondrop_smart_getter);
HTMLElement.prototype.__defineGetter__("ondrop", curMemoryArea.ondrop_smart_getter);

// ondurationchange
curMemoryArea.ondurationchange_getter = function ondurationchange() { return this._ondurationchange; }; mframe.safefunction(curMemoryArea.ondurationchange_getter);
Object.defineProperty(curMemoryArea.ondurationchange_getter, "name", {value: "get ondurationchange",configurable: true,});
// ondurationchange
curMemoryArea.ondurationchange_setter = function ondurationchange(val) { this._ondurationchange = val; }; mframe.safefunction(curMemoryArea.ondurationchange_setter);
Object.defineProperty(curMemoryArea.ondurationchange_setter, "name", {value: "set ondurationchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ondurationchange", {get: curMemoryArea.ondurationchange_getter,set: curMemoryArea.ondurationchange_setter,enumerable: true,configurable: true,});
curMemoryArea.ondurationchange_smart_getter = function ondurationchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ondurationchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ondurationchange !== undefined ? this._ondurationchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ondurationchange_smart_getter);
HTMLElement.prototype.__defineGetter__("ondurationchange", curMemoryArea.ondurationchange_smart_getter);

// onemptied
curMemoryArea.onemptied_getter = function onemptied() { return this._onemptied; }; mframe.safefunction(curMemoryArea.onemptied_getter);
Object.defineProperty(curMemoryArea.onemptied_getter, "name", {value: "get onemptied",configurable: true,});
// onemptied
curMemoryArea.onemptied_setter = function onemptied(val) { this._onemptied = val; }; mframe.safefunction(curMemoryArea.onemptied_setter);
Object.defineProperty(curMemoryArea.onemptied_setter, "name", {value: "set onemptied",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onemptied", {get: curMemoryArea.onemptied_getter,set: curMemoryArea.onemptied_setter,enumerable: true,configurable: true,});
curMemoryArea.onemptied_smart_getter = function onemptied() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onemptied;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onemptied !== undefined ? this._onemptied : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onemptied_smart_getter);
HTMLElement.prototype.__defineGetter__("onemptied", curMemoryArea.onemptied_smart_getter);

// onended
curMemoryArea.onended_getter = function onended() { return this._onended; }; mframe.safefunction(curMemoryArea.onended_getter);
Object.defineProperty(curMemoryArea.onended_getter, "name", {value: "get onended",configurable: true,});
// onended
curMemoryArea.onended_setter = function onended(val) { this._onended = val; }; mframe.safefunction(curMemoryArea.onended_setter);
Object.defineProperty(curMemoryArea.onended_setter, "name", {value: "set onended",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onended", {get: curMemoryArea.onended_getter,set: curMemoryArea.onended_setter,enumerable: true,configurable: true,});
curMemoryArea.onended_smart_getter = function onended() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onended;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onended !== undefined ? this._onended : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onended_smart_getter);
HTMLElement.prototype.__defineGetter__("onended", curMemoryArea.onended_smart_getter);

// onerror
curMemoryArea.onerror_getter = function onerror() { return this._onerror; }; mframe.safefunction(curMemoryArea.onerror_getter);
Object.defineProperty(curMemoryArea.onerror_getter, "name", {value: "get onerror",configurable: true,});
// onerror
curMemoryArea.onerror_setter = function onerror(val) { this._onerror = val; }; mframe.safefunction(curMemoryArea.onerror_setter);
Object.defineProperty(curMemoryArea.onerror_setter, "name", {value: "set onerror",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onerror", {get: curMemoryArea.onerror_getter,set: curMemoryArea.onerror_setter,enumerable: true,configurable: true,});
curMemoryArea.onerror_smart_getter = function onerror() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onerror;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onerror !== undefined ? this._onerror : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onerror_smart_getter);
HTMLElement.prototype.__defineGetter__("onerror", curMemoryArea.onerror_smart_getter);

// onfocus
curMemoryArea.onfocus_getter = function onfocus() { return this._onfocus; }; mframe.safefunction(curMemoryArea.onfocus_getter);
Object.defineProperty(curMemoryArea.onfocus_getter, "name", {value: "get onfocus",configurable: true,});
// onfocus
curMemoryArea.onfocus_setter = function onfocus(val) { this._onfocus = val; }; mframe.safefunction(curMemoryArea.onfocus_setter);
Object.defineProperty(curMemoryArea.onfocus_setter, "name", {value: "set onfocus",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onfocus", {get: curMemoryArea.onfocus_getter,set: curMemoryArea.onfocus_setter,enumerable: true,configurable: true,});
curMemoryArea.onfocus_smart_getter = function onfocus() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onfocus;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onfocus !== undefined ? this._onfocus : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onfocus_smart_getter);
HTMLElement.prototype.__defineGetter__("onfocus", curMemoryArea.onfocus_smart_getter);

// onformdata
curMemoryArea.onformdata_getter = function onformdata() { return this._onformdata; }; mframe.safefunction(curMemoryArea.onformdata_getter);
Object.defineProperty(curMemoryArea.onformdata_getter, "name", {value: "get onformdata",configurable: true,});
// onformdata
curMemoryArea.onformdata_setter = function onformdata(val) { this._onformdata = val; }; mframe.safefunction(curMemoryArea.onformdata_setter);
Object.defineProperty(curMemoryArea.onformdata_setter, "name", {value: "set onformdata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onformdata", {get: curMemoryArea.onformdata_getter,set: curMemoryArea.onformdata_setter,enumerable: true,configurable: true,});
curMemoryArea.onformdata_smart_getter = function onformdata() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onformdata;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onformdata !== undefined ? this._onformdata : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onformdata_smart_getter);
HTMLElement.prototype.__defineGetter__("onformdata", curMemoryArea.onformdata_smart_getter);

// oninput
curMemoryArea.oninput_getter = function oninput() { return this._oninput; }; mframe.safefunction(curMemoryArea.oninput_getter);
Object.defineProperty(curMemoryArea.oninput_getter, "name", {value: "get oninput",configurable: true,});
// oninput
curMemoryArea.oninput_setter = function oninput(val) { this._oninput = val; }; mframe.safefunction(curMemoryArea.oninput_setter);
Object.defineProperty(curMemoryArea.oninput_setter, "name", {value: "set oninput",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oninput", {get: curMemoryArea.oninput_getter,set: curMemoryArea.oninput_setter,enumerable: true,configurable: true,});
curMemoryArea.oninput_smart_getter = function oninput() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oninput;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oninput !== undefined ? this._oninput : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oninput_smart_getter);
HTMLElement.prototype.__defineGetter__("oninput", curMemoryArea.oninput_smart_getter);

// oninvalid
curMemoryArea.oninvalid_getter = function oninvalid() { return this._oninvalid; }; mframe.safefunction(curMemoryArea.oninvalid_getter);
Object.defineProperty(curMemoryArea.oninvalid_getter, "name", {value: "get oninvalid",configurable: true,});
// oninvalid
curMemoryArea.oninvalid_setter = function oninvalid(val) { this._oninvalid = val; }; mframe.safefunction(curMemoryArea.oninvalid_setter);
Object.defineProperty(curMemoryArea.oninvalid_setter, "name", {value: "set oninvalid",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oninvalid", {get: curMemoryArea.oninvalid_getter,set: curMemoryArea.oninvalid_setter,enumerable: true,configurable: true,});
curMemoryArea.oninvalid_smart_getter = function oninvalid() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oninvalid;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oninvalid !== undefined ? this._oninvalid : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oninvalid_smart_getter);
HTMLElement.prototype.__defineGetter__("oninvalid", curMemoryArea.oninvalid_smart_getter);

// onkeydown
curMemoryArea.onkeydown_getter = function onkeydown() { return this._onkeydown; }; mframe.safefunction(curMemoryArea.onkeydown_getter);
Object.defineProperty(curMemoryArea.onkeydown_getter, "name", {value: "get onkeydown",configurable: true,});
// onkeydown
curMemoryArea.onkeydown_setter = function onkeydown(val) { this._onkeydown = val; }; mframe.safefunction(curMemoryArea.onkeydown_setter);
Object.defineProperty(curMemoryArea.onkeydown_setter, "name", {value: "set onkeydown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeydown", {get: curMemoryArea.onkeydown_getter,set: curMemoryArea.onkeydown_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeydown_smart_getter = function onkeydown() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onkeydown;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onkeydown !== undefined ? this._onkeydown : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onkeydown_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeydown", curMemoryArea.onkeydown_smart_getter);

// onkeypress
curMemoryArea.onkeypress_getter = function onkeypress() { return this._onkeypress; }; mframe.safefunction(curMemoryArea.onkeypress_getter);
Object.defineProperty(curMemoryArea.onkeypress_getter, "name", {value: "get onkeypress",configurable: true,});
// onkeypress
curMemoryArea.onkeypress_setter = function onkeypress(val) { this._onkeypress = val; }; mframe.safefunction(curMemoryArea.onkeypress_setter);
Object.defineProperty(curMemoryArea.onkeypress_setter, "name", {value: "set onkeypress",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeypress", {get: curMemoryArea.onkeypress_getter,set: curMemoryArea.onkeypress_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeypress_smart_getter = function onkeypress() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onkeypress;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onkeypress !== undefined ? this._onkeypress : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onkeypress_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeypress", curMemoryArea.onkeypress_smart_getter);

// onkeyup
curMemoryArea.onkeyup_getter = function onkeyup() { return this._onkeyup; }; mframe.safefunction(curMemoryArea.onkeyup_getter);
Object.defineProperty(curMemoryArea.onkeyup_getter, "name", {value: "get onkeyup",configurable: true,});
// onkeyup
curMemoryArea.onkeyup_setter = function onkeyup(val) { this._onkeyup = val; }; mframe.safefunction(curMemoryArea.onkeyup_setter);
Object.defineProperty(curMemoryArea.onkeyup_setter, "name", {value: "set onkeyup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onkeyup", {get: curMemoryArea.onkeyup_getter,set: curMemoryArea.onkeyup_setter,enumerable: true,configurable: true,});
curMemoryArea.onkeyup_smart_getter = function onkeyup() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onkeyup;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onkeyup !== undefined ? this._onkeyup : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onkeyup_smart_getter);
HTMLElement.prototype.__defineGetter__("onkeyup", curMemoryArea.onkeyup_smart_getter);

// onload
curMemoryArea.onload_getter = function onload() { return this._onload; }; mframe.safefunction(curMemoryArea.onload_getter);
Object.defineProperty(curMemoryArea.onload_getter, "name", {value: "get onload",configurable: true,});
// onload
curMemoryArea.onload_setter = function onload(val) { this._onload = val; }; mframe.safefunction(curMemoryArea.onload_setter);
Object.defineProperty(curMemoryArea.onload_setter, "name", {value: "set onload",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onload", {get: curMemoryArea.onload_getter,set: curMemoryArea.onload_setter,enumerable: true,configurable: true,});
curMemoryArea.onload_smart_getter = function onload() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onload;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onload !== undefined ? this._onload : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onload_smart_getter);
HTMLElement.prototype.__defineGetter__("onload", curMemoryArea.onload_smart_getter);

// onloadeddata
curMemoryArea.onloadeddata_getter = function onloadeddata() { return this._onloadeddata; }; mframe.safefunction(curMemoryArea.onloadeddata_getter);
Object.defineProperty(curMemoryArea.onloadeddata_getter, "name", {value: "get onloadeddata",configurable: true,});
// onloadeddata
curMemoryArea.onloadeddata_setter = function onloadeddata(val) { this._onloadeddata = val; }; mframe.safefunction(curMemoryArea.onloadeddata_setter);
Object.defineProperty(curMemoryArea.onloadeddata_setter, "name", {value: "set onloadeddata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadeddata", {get: curMemoryArea.onloadeddata_getter,set: curMemoryArea.onloadeddata_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadeddata_smart_getter = function onloadeddata() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onloadeddata;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onloadeddata !== undefined ? this._onloadeddata : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onloadeddata_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadeddata", curMemoryArea.onloadeddata_smart_getter);

// onloadedmetadata
curMemoryArea.onloadedmetadata_getter = function onloadedmetadata() { return this._onloadedmetadata; }; mframe.safefunction(curMemoryArea.onloadedmetadata_getter);
Object.defineProperty(curMemoryArea.onloadedmetadata_getter, "name", {value: "get onloadedmetadata",configurable: true,});
// onloadedmetadata
curMemoryArea.onloadedmetadata_setter = function onloadedmetadata(val) { this._onloadedmetadata = val; }; mframe.safefunction(curMemoryArea.onloadedmetadata_setter);
Object.defineProperty(curMemoryArea.onloadedmetadata_setter, "name", {value: "set onloadedmetadata",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadedmetadata", {get: curMemoryArea.onloadedmetadata_getter,set: curMemoryArea.onloadedmetadata_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadedmetadata_smart_getter = function onloadedmetadata() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onloadedmetadata;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onloadedmetadata !== undefined ? this._onloadedmetadata : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onloadedmetadata_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadedmetadata", curMemoryArea.onloadedmetadata_smart_getter);

// onloadstart
curMemoryArea.onloadstart_getter = function onloadstart() { return this._onloadstart; }; mframe.safefunction(curMemoryArea.onloadstart_getter);
Object.defineProperty(curMemoryArea.onloadstart_getter, "name", {value: "get onloadstart",configurable: true,});
// onloadstart
curMemoryArea.onloadstart_setter = function onloadstart(val) { this._onloadstart = val; }; mframe.safefunction(curMemoryArea.onloadstart_setter);
Object.defineProperty(curMemoryArea.onloadstart_setter, "name", {value: "set onloadstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onloadstart", {get: curMemoryArea.onloadstart_getter,set: curMemoryArea.onloadstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onloadstart_smart_getter = function onloadstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onloadstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onloadstart !== undefined ? this._onloadstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onloadstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onloadstart", curMemoryArea.onloadstart_smart_getter);

// onmousedown
curMemoryArea.onmousedown_getter = function onmousedown() { return this._onmousedown; }; mframe.safefunction(curMemoryArea.onmousedown_getter);
Object.defineProperty(curMemoryArea.onmousedown_getter, "name", {value: "get onmousedown",configurable: true,});
// onmousedown
curMemoryArea.onmousedown_setter = function onmousedown(val) { this._onmousedown = val; }; mframe.safefunction(curMemoryArea.onmousedown_setter);
Object.defineProperty(curMemoryArea.onmousedown_setter, "name", {value: "set onmousedown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousedown", {get: curMemoryArea.onmousedown_getter,set: curMemoryArea.onmousedown_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousedown_smart_getter = function onmousedown() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmousedown;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmousedown !== undefined ? this._onmousedown : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmousedown_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousedown", curMemoryArea.onmousedown_smart_getter);

// onmouseenter
curMemoryArea.onmouseenter_getter = function onmouseenter() { return this._onmouseenter; }; mframe.safefunction(curMemoryArea.onmouseenter_getter);
Object.defineProperty(curMemoryArea.onmouseenter_getter, "name", {value: "get onmouseenter",configurable: true,});
// onmouseenter
curMemoryArea.onmouseenter_setter = function onmouseenter(val) { this._onmouseenter = val; }; mframe.safefunction(curMemoryArea.onmouseenter_setter);
Object.defineProperty(curMemoryArea.onmouseenter_setter, "name", {value: "set onmouseenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseenter", {get: curMemoryArea.onmouseenter_getter,set: curMemoryArea.onmouseenter_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseenter_smart_getter = function onmouseenter() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseenter;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseenter !== undefined ? this._onmouseenter : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseenter_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseenter", curMemoryArea.onmouseenter_smart_getter);

// onmouseleave
curMemoryArea.onmouseleave_getter = function onmouseleave() { return this._onmouseleave; }; mframe.safefunction(curMemoryArea.onmouseleave_getter);
Object.defineProperty(curMemoryArea.onmouseleave_getter, "name", {value: "get onmouseleave",configurable: true,});
// onmouseleave
curMemoryArea.onmouseleave_setter = function onmouseleave(val) { this._onmouseleave = val; }; mframe.safefunction(curMemoryArea.onmouseleave_setter);
Object.defineProperty(curMemoryArea.onmouseleave_setter, "name", {value: "set onmouseleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseleave", {get: curMemoryArea.onmouseleave_getter,set: curMemoryArea.onmouseleave_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseleave_smart_getter = function onmouseleave() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseleave;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseleave !== undefined ? this._onmouseleave : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseleave_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseleave", curMemoryArea.onmouseleave_smart_getter);

// onmousemove
curMemoryArea.onmousemove_getter = function onmousemove() { return this._onmousemove; }; mframe.safefunction(curMemoryArea.onmousemove_getter);
Object.defineProperty(curMemoryArea.onmousemove_getter, "name", {value: "get onmousemove",configurable: true,});
// onmousemove
curMemoryArea.onmousemove_setter = function onmousemove(val) { this._onmousemove = val; }; mframe.safefunction(curMemoryArea.onmousemove_setter);
Object.defineProperty(curMemoryArea.onmousemove_setter, "name", {value: "set onmousemove",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousemove", {get: curMemoryArea.onmousemove_getter,set: curMemoryArea.onmousemove_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousemove_smart_getter = function onmousemove() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmousemove;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmousemove !== undefined ? this._onmousemove : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmousemove_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousemove", curMemoryArea.onmousemove_smart_getter);

// onmouseout
curMemoryArea.onmouseout_getter = function onmouseout() { return this._onmouseout; }; mframe.safefunction(curMemoryArea.onmouseout_getter);
Object.defineProperty(curMemoryArea.onmouseout_getter, "name", {value: "get onmouseout",configurable: true,});
// onmouseout
curMemoryArea.onmouseout_setter = function onmouseout(val) { this._onmouseout = val; }; mframe.safefunction(curMemoryArea.onmouseout_setter);
Object.defineProperty(curMemoryArea.onmouseout_setter, "name", {value: "set onmouseout",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseout", {get: curMemoryArea.onmouseout_getter,set: curMemoryArea.onmouseout_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseout_smart_getter = function onmouseout() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseout;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseout !== undefined ? this._onmouseout : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseout_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseout", curMemoryArea.onmouseout_smart_getter);

// onmouseover
curMemoryArea.onmouseover_getter = function onmouseover() { return this._onmouseover; }; mframe.safefunction(curMemoryArea.onmouseover_getter);
Object.defineProperty(curMemoryArea.onmouseover_getter, "name", {value: "get onmouseover",configurable: true,});
// onmouseover
curMemoryArea.onmouseover_setter = function onmouseover(val) { this._onmouseover = val; }; mframe.safefunction(curMemoryArea.onmouseover_setter);
Object.defineProperty(curMemoryArea.onmouseover_setter, "name", {value: "set onmouseover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseover", {get: curMemoryArea.onmouseover_getter,set: curMemoryArea.onmouseover_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseover_smart_getter = function onmouseover() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseover;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseover !== undefined ? this._onmouseover : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseover_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseover", curMemoryArea.onmouseover_smart_getter);

// onmouseup
curMemoryArea.onmouseup_getter = function onmouseup() { return this._onmouseup; }; mframe.safefunction(curMemoryArea.onmouseup_getter);
Object.defineProperty(curMemoryArea.onmouseup_getter, "name", {value: "get onmouseup",configurable: true,});
// onmouseup
curMemoryArea.onmouseup_setter = function onmouseup(val) { this._onmouseup = val; }; mframe.safefunction(curMemoryArea.onmouseup_setter);
Object.defineProperty(curMemoryArea.onmouseup_setter, "name", {value: "set onmouseup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmouseup", {get: curMemoryArea.onmouseup_getter,set: curMemoryArea.onmouseup_setter,enumerable: true,configurable: true,});
curMemoryArea.onmouseup_smart_getter = function onmouseup() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmouseup;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmouseup !== undefined ? this._onmouseup : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmouseup_smart_getter);
HTMLElement.prototype.__defineGetter__("onmouseup", curMemoryArea.onmouseup_smart_getter);

// onmousewheel
curMemoryArea.onmousewheel_getter = function onmousewheel() { return this._onmousewheel; }; mframe.safefunction(curMemoryArea.onmousewheel_getter);
Object.defineProperty(curMemoryArea.onmousewheel_getter, "name", {value: "get onmousewheel",configurable: true,});
// onmousewheel
curMemoryArea.onmousewheel_setter = function onmousewheel(val) { this._onmousewheel = val; }; mframe.safefunction(curMemoryArea.onmousewheel_setter);
Object.defineProperty(curMemoryArea.onmousewheel_setter, "name", {value: "set onmousewheel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onmousewheel", {get: curMemoryArea.onmousewheel_getter,set: curMemoryArea.onmousewheel_setter,enumerable: true,configurable: true,});
curMemoryArea.onmousewheel_smart_getter = function onmousewheel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onmousewheel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onmousewheel !== undefined ? this._onmousewheel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onmousewheel_smart_getter);
HTMLElement.prototype.__defineGetter__("onmousewheel", curMemoryArea.onmousewheel_smart_getter);

// onpause
curMemoryArea.onpause_getter = function onpause() { return this._onpause; }; mframe.safefunction(curMemoryArea.onpause_getter);
Object.defineProperty(curMemoryArea.onpause_getter, "name", {value: "get onpause",configurable: true,});
// onpause
curMemoryArea.onpause_setter = function onpause(val) { this._onpause = val; }; mframe.safefunction(curMemoryArea.onpause_setter);
Object.defineProperty(curMemoryArea.onpause_setter, "name", {value: "set onpause",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpause", {get: curMemoryArea.onpause_getter,set: curMemoryArea.onpause_setter,enumerable: true,configurable: true,});
curMemoryArea.onpause_smart_getter = function onpause() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpause;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpause !== undefined ? this._onpause : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpause_smart_getter);
HTMLElement.prototype.__defineGetter__("onpause", curMemoryArea.onpause_smart_getter);

// onplay
curMemoryArea.onplay_getter = function onplay() { return this._onplay; }; mframe.safefunction(curMemoryArea.onplay_getter);
Object.defineProperty(curMemoryArea.onplay_getter, "name", {value: "get onplay",configurable: true,});
// onplay
curMemoryArea.onplay_setter = function onplay(val) { this._onplay = val; }; mframe.safefunction(curMemoryArea.onplay_setter);
Object.defineProperty(curMemoryArea.onplay_setter, "name", {value: "set onplay",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onplay", {get: curMemoryArea.onplay_getter,set: curMemoryArea.onplay_setter,enumerable: true,configurable: true,});
curMemoryArea.onplay_smart_getter = function onplay() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onplay;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onplay !== undefined ? this._onplay : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onplay_smart_getter);
HTMLElement.prototype.__defineGetter__("onplay", curMemoryArea.onplay_smart_getter);

// onplaying
curMemoryArea.onplaying_getter = function onplaying() { return this._onplaying; }; mframe.safefunction(curMemoryArea.onplaying_getter);
Object.defineProperty(curMemoryArea.onplaying_getter, "name", {value: "get onplaying",configurable: true,});
// onplaying
curMemoryArea.onplaying_setter = function onplaying(val) { this._onplaying = val; }; mframe.safefunction(curMemoryArea.onplaying_setter);
Object.defineProperty(curMemoryArea.onplaying_setter, "name", {value: "set onplaying",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onplaying", {get: curMemoryArea.onplaying_getter,set: curMemoryArea.onplaying_setter,enumerable: true,configurable: true,});
curMemoryArea.onplaying_smart_getter = function onplaying() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onplaying;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onplaying !== undefined ? this._onplaying : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onplaying_smart_getter);
HTMLElement.prototype.__defineGetter__("onplaying", curMemoryArea.onplaying_smart_getter);

// onprogress
curMemoryArea.onprogress_getter = function onprogress() { return this._onprogress; }; mframe.safefunction(curMemoryArea.onprogress_getter);
Object.defineProperty(curMemoryArea.onprogress_getter, "name", {value: "get onprogress",configurable: true,});
// onprogress
curMemoryArea.onprogress_setter = function onprogress(val) { this._onprogress = val; }; mframe.safefunction(curMemoryArea.onprogress_setter);
Object.defineProperty(curMemoryArea.onprogress_setter, "name", {value: "set onprogress",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onprogress", {get: curMemoryArea.onprogress_getter,set: curMemoryArea.onprogress_setter,enumerable: true,configurable: true,});
curMemoryArea.onprogress_smart_getter = function onprogress() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onprogress;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onprogress !== undefined ? this._onprogress : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onprogress_smart_getter);
HTMLElement.prototype.__defineGetter__("onprogress", curMemoryArea.onprogress_smart_getter);

// onratechange
curMemoryArea.onratechange_getter = function onratechange() { return this._onratechange; }; mframe.safefunction(curMemoryArea.onratechange_getter);
Object.defineProperty(curMemoryArea.onratechange_getter, "name", {value: "get onratechange",configurable: true,});
// onratechange
curMemoryArea.onratechange_setter = function onratechange(val) { this._onratechange = val; }; mframe.safefunction(curMemoryArea.onratechange_setter);
Object.defineProperty(curMemoryArea.onratechange_setter, "name", {value: "set onratechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onratechange", {get: curMemoryArea.onratechange_getter,set: curMemoryArea.onratechange_setter,enumerable: true,configurable: true,});
curMemoryArea.onratechange_smart_getter = function onratechange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onratechange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onratechange !== undefined ? this._onratechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onratechange_smart_getter);
HTMLElement.prototype.__defineGetter__("onratechange", curMemoryArea.onratechange_smart_getter);

// onreset
curMemoryArea.onreset_getter = function onreset() { return this._onreset; }; mframe.safefunction(curMemoryArea.onreset_getter);
Object.defineProperty(curMemoryArea.onreset_getter, "name", {value: "get onreset",configurable: true,});
// onreset
curMemoryArea.onreset_setter = function onreset(val) { this._onreset = val; }; mframe.safefunction(curMemoryArea.onreset_setter);
Object.defineProperty(curMemoryArea.onreset_setter, "name", {value: "set onreset",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onreset", {get: curMemoryArea.onreset_getter,set: curMemoryArea.onreset_setter,enumerable: true,configurable: true,});
curMemoryArea.onreset_smart_getter = function onreset() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onreset;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onreset !== undefined ? this._onreset : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onreset_smart_getter);
HTMLElement.prototype.__defineGetter__("onreset", curMemoryArea.onreset_smart_getter);

// onresize
curMemoryArea.onresize_getter = function onresize() { return this._onresize; }; mframe.safefunction(curMemoryArea.onresize_getter);
Object.defineProperty(curMemoryArea.onresize_getter, "name", {value: "get onresize",configurable: true,});
// onresize
curMemoryArea.onresize_setter = function onresize(val) { this._onresize = val; }; mframe.safefunction(curMemoryArea.onresize_setter);
Object.defineProperty(curMemoryArea.onresize_setter, "name", {value: "set onresize",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onresize", {get: curMemoryArea.onresize_getter,set: curMemoryArea.onresize_setter,enumerable: true,configurable: true,});
curMemoryArea.onresize_smart_getter = function onresize() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onresize;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onresize !== undefined ? this._onresize : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onresize_smart_getter);
HTMLElement.prototype.__defineGetter__("onresize", curMemoryArea.onresize_smart_getter);

// onscroll
curMemoryArea.onscroll_getter = function onscroll() { return this._onscroll; }; mframe.safefunction(curMemoryArea.onscroll_getter);
Object.defineProperty(curMemoryArea.onscroll_getter, "name", {value: "get onscroll",configurable: true,});
// onscroll
curMemoryArea.onscroll_setter = function onscroll(val) { this._onscroll = val; }; mframe.safefunction(curMemoryArea.onscroll_setter);
Object.defineProperty(curMemoryArea.onscroll_setter, "name", {value: "set onscroll",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscroll", {get: curMemoryArea.onscroll_getter,set: curMemoryArea.onscroll_setter,enumerable: true,configurable: true,});
curMemoryArea.onscroll_smart_getter = function onscroll() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onscroll;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscroll !== undefined ? this._onscroll : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscroll_smart_getter);
HTMLElement.prototype.__defineGetter__("onscroll", curMemoryArea.onscroll_smart_getter);

// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_getter = function onsecuritypolicyviolation() { return this._onsecuritypolicyviolation; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_getter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_getter, "name", {value: "get onsecuritypolicyviolation",configurable: true,});
// onsecuritypolicyviolation
curMemoryArea.onsecuritypolicyviolation_setter = function onsecuritypolicyviolation(val) { this._onsecuritypolicyviolation = val; }; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_setter);
Object.defineProperty(curMemoryArea.onsecuritypolicyviolation_setter, "name", {value: "set onsecuritypolicyviolation",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsecuritypolicyviolation", {get: curMemoryArea.onsecuritypolicyviolation_getter,set: curMemoryArea.onsecuritypolicyviolation_setter,enumerable: true,configurable: true,});
curMemoryArea.onsecuritypolicyviolation_smart_getter = function onsecuritypolicyviolation() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onsecuritypolicyviolation;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onsecuritypolicyviolation !== undefined ? this._onsecuritypolicyviolation : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onsecuritypolicyviolation_smart_getter);
HTMLElement.prototype.__defineGetter__("onsecuritypolicyviolation", curMemoryArea.onsecuritypolicyviolation_smart_getter);

// onseeked
curMemoryArea.onseeked_getter = function onseeked() { return this._onseeked; }; mframe.safefunction(curMemoryArea.onseeked_getter);
Object.defineProperty(curMemoryArea.onseeked_getter, "name", {value: "get onseeked",configurable: true,});
// onseeked
curMemoryArea.onseeked_setter = function onseeked(val) { this._onseeked = val; }; mframe.safefunction(curMemoryArea.onseeked_setter);
Object.defineProperty(curMemoryArea.onseeked_setter, "name", {value: "set onseeked",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onseeked", {get: curMemoryArea.onseeked_getter,set: curMemoryArea.onseeked_setter,enumerable: true,configurable: true,});
curMemoryArea.onseeked_smart_getter = function onseeked() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onseeked;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onseeked !== undefined ? this._onseeked : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onseeked_smart_getter);
HTMLElement.prototype.__defineGetter__("onseeked", curMemoryArea.onseeked_smart_getter);

// onseeking
curMemoryArea.onseeking_getter = function onseeking() { return this._onseeking; }; mframe.safefunction(curMemoryArea.onseeking_getter);
Object.defineProperty(curMemoryArea.onseeking_getter, "name", {value: "get onseeking",configurable: true,});
// onseeking
curMemoryArea.onseeking_setter = function onseeking(val) { this._onseeking = val; }; mframe.safefunction(curMemoryArea.onseeking_setter);
Object.defineProperty(curMemoryArea.onseeking_setter, "name", {value: "set onseeking",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onseeking", {get: curMemoryArea.onseeking_getter,set: curMemoryArea.onseeking_setter,enumerable: true,configurable: true,});
curMemoryArea.onseeking_smart_getter = function onseeking() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onseeking;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onseeking !== undefined ? this._onseeking : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onseeking_smart_getter);
HTMLElement.prototype.__defineGetter__("onseeking", curMemoryArea.onseeking_smart_getter);

// onselect
curMemoryArea.onselect_getter = function onselect() { return this._onselect; }; mframe.safefunction(curMemoryArea.onselect_getter);
Object.defineProperty(curMemoryArea.onselect_getter, "name", {value: "get onselect",configurable: true,});
// onselect
curMemoryArea.onselect_setter = function onselect(val) { this._onselect = val; }; mframe.safefunction(curMemoryArea.onselect_setter);
Object.defineProperty(curMemoryArea.onselect_setter, "name", {value: "set onselect",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselect", {get: curMemoryArea.onselect_getter,set: curMemoryArea.onselect_setter,enumerable: true,configurable: true,});
curMemoryArea.onselect_smart_getter = function onselect() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onselect;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onselect !== undefined ? this._onselect : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onselect_smart_getter);
HTMLElement.prototype.__defineGetter__("onselect", curMemoryArea.onselect_smart_getter);

// onslotchange
curMemoryArea.onslotchange_getter = function onslotchange() { return this._onslotchange; }; mframe.safefunction(curMemoryArea.onslotchange_getter);
Object.defineProperty(curMemoryArea.onslotchange_getter, "name", {value: "get onslotchange",configurable: true,});
// onslotchange
curMemoryArea.onslotchange_setter = function onslotchange(val) { this._onslotchange = val; }; mframe.safefunction(curMemoryArea.onslotchange_setter);
Object.defineProperty(curMemoryArea.onslotchange_setter, "name", {value: "set onslotchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onslotchange", {get: curMemoryArea.onslotchange_getter,set: curMemoryArea.onslotchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onslotchange_smart_getter = function onslotchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onslotchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onslotchange !== undefined ? this._onslotchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onslotchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onslotchange", curMemoryArea.onslotchange_smart_getter);

// onstalled
curMemoryArea.onstalled_getter = function onstalled() { return this._onstalled; }; mframe.safefunction(curMemoryArea.onstalled_getter);
Object.defineProperty(curMemoryArea.onstalled_getter, "name", {value: "get onstalled",configurable: true,});
// onstalled
curMemoryArea.onstalled_setter = function onstalled(val) { this._onstalled = val; }; mframe.safefunction(curMemoryArea.onstalled_setter);
Object.defineProperty(curMemoryArea.onstalled_setter, "name", {value: "set onstalled",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onstalled", {get: curMemoryArea.onstalled_getter,set: curMemoryArea.onstalled_setter,enumerable: true,configurable: true,});
curMemoryArea.onstalled_smart_getter = function onstalled() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onstalled;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onstalled !== undefined ? this._onstalled : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onstalled_smart_getter);
HTMLElement.prototype.__defineGetter__("onstalled", curMemoryArea.onstalled_smart_getter);

// onsubmit
curMemoryArea.onsubmit_getter = function onsubmit() { return this._onsubmit; }; mframe.safefunction(curMemoryArea.onsubmit_getter);
Object.defineProperty(curMemoryArea.onsubmit_getter, "name", {value: "get onsubmit",configurable: true,});
// onsubmit
curMemoryArea.onsubmit_setter = function onsubmit(val) { this._onsubmit = val; }; mframe.safefunction(curMemoryArea.onsubmit_setter);
Object.defineProperty(curMemoryArea.onsubmit_setter, "name", {value: "set onsubmit",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsubmit", {get: curMemoryArea.onsubmit_getter,set: curMemoryArea.onsubmit_setter,enumerable: true,configurable: true,});
curMemoryArea.onsubmit_smart_getter = function onsubmit() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onsubmit;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onsubmit !== undefined ? this._onsubmit : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onsubmit_smart_getter);
HTMLElement.prototype.__defineGetter__("onsubmit", curMemoryArea.onsubmit_smart_getter);

// onsuspend
curMemoryArea.onsuspend_getter = function onsuspend() { return this._onsuspend; }; mframe.safefunction(curMemoryArea.onsuspend_getter);
Object.defineProperty(curMemoryArea.onsuspend_getter, "name", {value: "get onsuspend",configurable: true,});
// onsuspend
curMemoryArea.onsuspend_setter = function onsuspend(val) { this._onsuspend = val; }; mframe.safefunction(curMemoryArea.onsuspend_setter);
Object.defineProperty(curMemoryArea.onsuspend_setter, "name", {value: "set onsuspend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onsuspend", {get: curMemoryArea.onsuspend_getter,set: curMemoryArea.onsuspend_setter,enumerable: true,configurable: true,});
curMemoryArea.onsuspend_smart_getter = function onsuspend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onsuspend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onsuspend !== undefined ? this._onsuspend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onsuspend_smart_getter);
HTMLElement.prototype.__defineGetter__("onsuspend", curMemoryArea.onsuspend_smart_getter);

// ontimeupdate
curMemoryArea.ontimeupdate_getter = function ontimeupdate() { return this._ontimeupdate; }; mframe.safefunction(curMemoryArea.ontimeupdate_getter);
Object.defineProperty(curMemoryArea.ontimeupdate_getter, "name", {value: "get ontimeupdate",configurable: true,});
// ontimeupdate
curMemoryArea.ontimeupdate_setter = function ontimeupdate(val) { this._ontimeupdate = val; }; mframe.safefunction(curMemoryArea.ontimeupdate_setter);
Object.defineProperty(curMemoryArea.ontimeupdate_setter, "name", {value: "set ontimeupdate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontimeupdate", {get: curMemoryArea.ontimeupdate_getter,set: curMemoryArea.ontimeupdate_setter,enumerable: true,configurable: true,});
curMemoryArea.ontimeupdate_smart_getter = function ontimeupdate() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontimeupdate;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontimeupdate !== undefined ? this._ontimeupdate : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontimeupdate_smart_getter);
HTMLElement.prototype.__defineGetter__("ontimeupdate", curMemoryArea.ontimeupdate_smart_getter);

// ontoggle
curMemoryArea.ontoggle_getter = function ontoggle() { return this._ontoggle; }; mframe.safefunction(curMemoryArea.ontoggle_getter);
Object.defineProperty(curMemoryArea.ontoggle_getter, "name", {value: "get ontoggle",configurable: true,});
// ontoggle
curMemoryArea.ontoggle_setter = function ontoggle(val) { this._ontoggle = val; }; mframe.safefunction(curMemoryArea.ontoggle_setter);
Object.defineProperty(curMemoryArea.ontoggle_setter, "name", {value: "set ontoggle",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontoggle", {get: curMemoryArea.ontoggle_getter,set: curMemoryArea.ontoggle_setter,enumerable: true,configurable: true,});
curMemoryArea.ontoggle_smart_getter = function ontoggle() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontoggle;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontoggle !== undefined ? this._ontoggle : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontoggle_smart_getter);
HTMLElement.prototype.__defineGetter__("ontoggle", curMemoryArea.ontoggle_smart_getter);

// onvolumechange
curMemoryArea.onvolumechange_getter = function onvolumechange() { return this._onvolumechange; }; mframe.safefunction(curMemoryArea.onvolumechange_getter);
Object.defineProperty(curMemoryArea.onvolumechange_getter, "name", {value: "get onvolumechange",configurable: true,});
// onvolumechange
curMemoryArea.onvolumechange_setter = function onvolumechange(val) { this._onvolumechange = val; }; mframe.safefunction(curMemoryArea.onvolumechange_setter);
Object.defineProperty(curMemoryArea.onvolumechange_setter, "name", {value: "set onvolumechange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onvolumechange", {get: curMemoryArea.onvolumechange_getter,set: curMemoryArea.onvolumechange_setter,enumerable: true,configurable: true,});
curMemoryArea.onvolumechange_smart_getter = function onvolumechange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onvolumechange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onvolumechange !== undefined ? this._onvolumechange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onvolumechange_smart_getter);
HTMLElement.prototype.__defineGetter__("onvolumechange", curMemoryArea.onvolumechange_smart_getter);

// onwaiting
curMemoryArea.onwaiting_getter = function onwaiting() { return this._onwaiting; }; mframe.safefunction(curMemoryArea.onwaiting_getter);
Object.defineProperty(curMemoryArea.onwaiting_getter, "name", {value: "get onwaiting",configurable: true,});
// onwaiting
curMemoryArea.onwaiting_setter = function onwaiting(val) { this._onwaiting = val; }; mframe.safefunction(curMemoryArea.onwaiting_setter);
Object.defineProperty(curMemoryArea.onwaiting_setter, "name", {value: "set onwaiting",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwaiting", {get: curMemoryArea.onwaiting_getter,set: curMemoryArea.onwaiting_setter,enumerable: true,configurable: true,});
curMemoryArea.onwaiting_smart_getter = function onwaiting() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwaiting;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwaiting !== undefined ? this._onwaiting : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwaiting_smart_getter);
HTMLElement.prototype.__defineGetter__("onwaiting", curMemoryArea.onwaiting_smart_getter);

// onwebkitanimationend
curMemoryArea.onwebkitanimationend_getter = function onwebkitanimationend() { return this._onwebkitanimationend; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_getter, "name", {value: "get onwebkitanimationend",configurable: true,});
// onwebkitanimationend
curMemoryArea.onwebkitanimationend_setter = function onwebkitanimationend(val) { this._onwebkitanimationend = val; }; mframe.safefunction(curMemoryArea.onwebkitanimationend_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationend_setter, "name", {value: "set onwebkitanimationend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationend", {get: curMemoryArea.onwebkitanimationend_getter,set: curMemoryArea.onwebkitanimationend_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationend_smart_getter = function onwebkitanimationend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwebkitanimationend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitanimationend !== undefined ? this._onwebkitanimationend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationend_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationend", curMemoryArea.onwebkitanimationend_smart_getter);

// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_getter = function onwebkitanimationiteration() { return this._onwebkitanimationiteration; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_getter, "name", {value: "get onwebkitanimationiteration",configurable: true,});
// onwebkitanimationiteration
curMemoryArea.onwebkitanimationiteration_setter = function onwebkitanimationiteration(val) { this._onwebkitanimationiteration = val; }; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationiteration_setter, "name", {value: "set onwebkitanimationiteration",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationiteration", {get: curMemoryArea.onwebkitanimationiteration_getter,set: curMemoryArea.onwebkitanimationiteration_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationiteration_smart_getter = function onwebkitanimationiteration() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwebkitanimationiteration;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitanimationiteration !== undefined ? this._onwebkitanimationiteration : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationiteration_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationiteration", curMemoryArea.onwebkitanimationiteration_smart_getter);

// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_getter = function onwebkitanimationstart() { return this._onwebkitanimationstart; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_getter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_getter, "name", {value: "get onwebkitanimationstart",configurable: true,});
// onwebkitanimationstart
curMemoryArea.onwebkitanimationstart_setter = function onwebkitanimationstart(val) { this._onwebkitanimationstart = val; }; mframe.safefunction(curMemoryArea.onwebkitanimationstart_setter);
Object.defineProperty(curMemoryArea.onwebkitanimationstart_setter, "name", {value: "set onwebkitanimationstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkitanimationstart", {get: curMemoryArea.onwebkitanimationstart_getter,set: curMemoryArea.onwebkitanimationstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkitanimationstart_smart_getter = function onwebkitanimationstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwebkitanimationstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkitanimationstart !== undefined ? this._onwebkitanimationstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkitanimationstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkitanimationstart", curMemoryArea.onwebkitanimationstart_smart_getter);

// onwebkittransitionend
curMemoryArea.onwebkittransitionend_getter = function onwebkittransitionend() { return this._onwebkittransitionend; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_getter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_getter, "name", {value: "get onwebkittransitionend",configurable: true,});
// onwebkittransitionend
curMemoryArea.onwebkittransitionend_setter = function onwebkittransitionend(val) { this._onwebkittransitionend = val; }; mframe.safefunction(curMemoryArea.onwebkittransitionend_setter);
Object.defineProperty(curMemoryArea.onwebkittransitionend_setter, "name", {value: "set onwebkittransitionend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwebkittransitionend", {get: curMemoryArea.onwebkittransitionend_getter,set: curMemoryArea.onwebkittransitionend_setter,enumerable: true,configurable: true,});
curMemoryArea.onwebkittransitionend_smart_getter = function onwebkittransitionend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwebkittransitionend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwebkittransitionend !== undefined ? this._onwebkittransitionend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwebkittransitionend_smart_getter);
HTMLElement.prototype.__defineGetter__("onwebkittransitionend", curMemoryArea.onwebkittransitionend_smart_getter);

// onwheel
curMemoryArea.onwheel_getter = function onwheel() { return this._onwheel; }; mframe.safefunction(curMemoryArea.onwheel_getter);
Object.defineProperty(curMemoryArea.onwheel_getter, "name", {value: "get onwheel",configurable: true,});
// onwheel
curMemoryArea.onwheel_setter = function onwheel(val) { this._onwheel = val; }; mframe.safefunction(curMemoryArea.onwheel_setter);
Object.defineProperty(curMemoryArea.onwheel_setter, "name", {value: "set onwheel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onwheel", {get: curMemoryArea.onwheel_getter,set: curMemoryArea.onwheel_setter,enumerable: true,configurable: true,});
curMemoryArea.onwheel_smart_getter = function onwheel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onwheel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onwheel !== undefined ? this._onwheel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onwheel_smart_getter);
HTMLElement.prototype.__defineGetter__("onwheel", curMemoryArea.onwheel_smart_getter);

// onauxclick
curMemoryArea.onauxclick_getter = function onauxclick() { return this._onauxclick; }; mframe.safefunction(curMemoryArea.onauxclick_getter);
Object.defineProperty(curMemoryArea.onauxclick_getter, "name", {value: "get onauxclick",configurable: true,});
// onauxclick
curMemoryArea.onauxclick_setter = function onauxclick(val) { this._onauxclick = val; }; mframe.safefunction(curMemoryArea.onauxclick_setter);
Object.defineProperty(curMemoryArea.onauxclick_setter, "name", {value: "set onauxclick",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onauxclick", {get: curMemoryArea.onauxclick_getter,set: curMemoryArea.onauxclick_setter,enumerable: true,configurable: true,});
curMemoryArea.onauxclick_smart_getter = function onauxclick() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onauxclick;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onauxclick !== undefined ? this._onauxclick : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onauxclick_smart_getter);
HTMLElement.prototype.__defineGetter__("onauxclick", curMemoryArea.onauxclick_smart_getter);

// ongotpointercapture
curMemoryArea.ongotpointercapture_getter = function ongotpointercapture() { return this._ongotpointercapture; }; mframe.safefunction(curMemoryArea.ongotpointercapture_getter);
Object.defineProperty(curMemoryArea.ongotpointercapture_getter, "name", {value: "get ongotpointercapture",configurable: true,});
// ongotpointercapture
curMemoryArea.ongotpointercapture_setter = function ongotpointercapture(val) { this._ongotpointercapture = val; }; mframe.safefunction(curMemoryArea.ongotpointercapture_setter);
Object.defineProperty(curMemoryArea.ongotpointercapture_setter, "name", {value: "set ongotpointercapture",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ongotpointercapture", {get: curMemoryArea.ongotpointercapture_getter,set: curMemoryArea.ongotpointercapture_setter,enumerable: true,configurable: true,});
curMemoryArea.ongotpointercapture_smart_getter = function ongotpointercapture() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ongotpointercapture;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ongotpointercapture !== undefined ? this._ongotpointercapture : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ongotpointercapture_smart_getter);
HTMLElement.prototype.__defineGetter__("ongotpointercapture", curMemoryArea.ongotpointercapture_smart_getter);

// onlostpointercapture
curMemoryArea.onlostpointercapture_getter = function onlostpointercapture() { return this._onlostpointercapture; }; mframe.safefunction(curMemoryArea.onlostpointercapture_getter);
Object.defineProperty(curMemoryArea.onlostpointercapture_getter, "name", {value: "get onlostpointercapture",configurable: true,});
// onlostpointercapture
curMemoryArea.onlostpointercapture_setter = function onlostpointercapture(val) { this._onlostpointercapture = val; }; mframe.safefunction(curMemoryArea.onlostpointercapture_setter);
Object.defineProperty(curMemoryArea.onlostpointercapture_setter, "name", {value: "set onlostpointercapture",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onlostpointercapture", {get: curMemoryArea.onlostpointercapture_getter,set: curMemoryArea.onlostpointercapture_setter,enumerable: true,configurable: true,});
curMemoryArea.onlostpointercapture_smart_getter = function onlostpointercapture() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onlostpointercapture;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onlostpointercapture !== undefined ? this._onlostpointercapture : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onlostpointercapture_smart_getter);
HTMLElement.prototype.__defineGetter__("onlostpointercapture", curMemoryArea.onlostpointercapture_smart_getter);

// onpointerdown
curMemoryArea.onpointerdown_getter = function onpointerdown() { return this._onpointerdown; }; mframe.safefunction(curMemoryArea.onpointerdown_getter);
Object.defineProperty(curMemoryArea.onpointerdown_getter, "name", {value: "get onpointerdown",configurable: true,});
// onpointerdown
curMemoryArea.onpointerdown_setter = function onpointerdown(val) { this._onpointerdown = val; }; mframe.safefunction(curMemoryArea.onpointerdown_setter);
Object.defineProperty(curMemoryArea.onpointerdown_setter, "name", {value: "set onpointerdown",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerdown", {get: curMemoryArea.onpointerdown_getter,set: curMemoryArea.onpointerdown_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerdown_smart_getter = function onpointerdown() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerdown;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerdown !== undefined ? this._onpointerdown : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerdown_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerdown", curMemoryArea.onpointerdown_smart_getter);

// onpointermove
curMemoryArea.onpointermove_getter = function onpointermove() { return this._onpointermove; }; mframe.safefunction(curMemoryArea.onpointermove_getter);
Object.defineProperty(curMemoryArea.onpointermove_getter, "name", {value: "get onpointermove",configurable: true,});
// onpointermove
curMemoryArea.onpointermove_setter = function onpointermove(val) { this._onpointermove = val; }; mframe.safefunction(curMemoryArea.onpointermove_setter);
Object.defineProperty(curMemoryArea.onpointermove_setter, "name", {value: "set onpointermove",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointermove", {get: curMemoryArea.onpointermove_getter,set: curMemoryArea.onpointermove_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointermove_smart_getter = function onpointermove() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointermove;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointermove !== undefined ? this._onpointermove : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointermove_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointermove", curMemoryArea.onpointermove_smart_getter);

// onpointerrawupdate
curMemoryArea.onpointerrawupdate_getter = function onpointerrawupdate() { return this._onpointerrawupdate; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_getter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_getter, "name", {value: "get onpointerrawupdate",configurable: true,});
// onpointerrawupdate
curMemoryArea.onpointerrawupdate_setter = function onpointerrawupdate(val) { this._onpointerrawupdate = val; }; mframe.safefunction(curMemoryArea.onpointerrawupdate_setter);
Object.defineProperty(curMemoryArea.onpointerrawupdate_setter, "name", {value: "set onpointerrawupdate",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerrawupdate", {get: curMemoryArea.onpointerrawupdate_getter,set: curMemoryArea.onpointerrawupdate_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerrawupdate_smart_getter = function onpointerrawupdate() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerrawupdate;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerrawupdate !== undefined ? this._onpointerrawupdate : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerrawupdate_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerrawupdate", curMemoryArea.onpointerrawupdate_smart_getter);

// onpointerup
curMemoryArea.onpointerup_getter = function onpointerup() { return this._onpointerup; }; mframe.safefunction(curMemoryArea.onpointerup_getter);
Object.defineProperty(curMemoryArea.onpointerup_getter, "name", {value: "get onpointerup",configurable: true,});
// onpointerup
curMemoryArea.onpointerup_setter = function onpointerup(val) { this._onpointerup = val; }; mframe.safefunction(curMemoryArea.onpointerup_setter);
Object.defineProperty(curMemoryArea.onpointerup_setter, "name", {value: "set onpointerup",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerup", {get: curMemoryArea.onpointerup_getter,set: curMemoryArea.onpointerup_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerup_smart_getter = function onpointerup() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerup;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerup !== undefined ? this._onpointerup : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerup_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerup", curMemoryArea.onpointerup_smart_getter);

// onpointercancel
curMemoryArea.onpointercancel_getter = function onpointercancel() { return this._onpointercancel; }; mframe.safefunction(curMemoryArea.onpointercancel_getter);
Object.defineProperty(curMemoryArea.onpointercancel_getter, "name", {value: "get onpointercancel",configurable: true,});
// onpointercancel
curMemoryArea.onpointercancel_setter = function onpointercancel(val) { this._onpointercancel = val; }; mframe.safefunction(curMemoryArea.onpointercancel_setter);
Object.defineProperty(curMemoryArea.onpointercancel_setter, "name", {value: "set onpointercancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointercancel", {get: curMemoryArea.onpointercancel_getter,set: curMemoryArea.onpointercancel_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointercancel_smart_getter = function onpointercancel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointercancel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointercancel !== undefined ? this._onpointercancel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointercancel_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointercancel", curMemoryArea.onpointercancel_smart_getter);

// onpointerover
curMemoryArea.onpointerover_getter = function onpointerover() { return this._onpointerover; }; mframe.safefunction(curMemoryArea.onpointerover_getter);
Object.defineProperty(curMemoryArea.onpointerover_getter, "name", {value: "get onpointerover",configurable: true,});
// onpointerover
curMemoryArea.onpointerover_setter = function onpointerover(val) { this._onpointerover = val; }; mframe.safefunction(curMemoryArea.onpointerover_setter);
Object.defineProperty(curMemoryArea.onpointerover_setter, "name", {value: "set onpointerover",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerover", {get: curMemoryArea.onpointerover_getter,set: curMemoryArea.onpointerover_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerover_smart_getter = function onpointerover() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerover;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerover !== undefined ? this._onpointerover : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerover_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerover", curMemoryArea.onpointerover_smart_getter);

// onpointerout
curMemoryArea.onpointerout_getter = function onpointerout() { return this._onpointerout; }; mframe.safefunction(curMemoryArea.onpointerout_getter);
Object.defineProperty(curMemoryArea.onpointerout_getter, "name", {value: "get onpointerout",configurable: true,});
// onpointerout
curMemoryArea.onpointerout_setter = function onpointerout(val) { this._onpointerout = val; }; mframe.safefunction(curMemoryArea.onpointerout_setter);
Object.defineProperty(curMemoryArea.onpointerout_setter, "name", {value: "set onpointerout",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerout", {get: curMemoryArea.onpointerout_getter,set: curMemoryArea.onpointerout_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerout_smart_getter = function onpointerout() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerout;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerout !== undefined ? this._onpointerout : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerout_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerout", curMemoryArea.onpointerout_smart_getter);

// onpointerenter
curMemoryArea.onpointerenter_getter = function onpointerenter() { return this._onpointerenter; }; mframe.safefunction(curMemoryArea.onpointerenter_getter);
Object.defineProperty(curMemoryArea.onpointerenter_getter, "name", {value: "get onpointerenter",configurable: true,});
// onpointerenter
curMemoryArea.onpointerenter_setter = function onpointerenter(val) { this._onpointerenter = val; }; mframe.safefunction(curMemoryArea.onpointerenter_setter);
Object.defineProperty(curMemoryArea.onpointerenter_setter, "name", {value: "set onpointerenter",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerenter", {get: curMemoryArea.onpointerenter_getter,set: curMemoryArea.onpointerenter_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerenter_smart_getter = function onpointerenter() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerenter;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerenter !== undefined ? this._onpointerenter : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerenter_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerenter", curMemoryArea.onpointerenter_smart_getter);

// onpointerleave
curMemoryArea.onpointerleave_getter = function onpointerleave() { return this._onpointerleave; }; mframe.safefunction(curMemoryArea.onpointerleave_getter);
Object.defineProperty(curMemoryArea.onpointerleave_getter, "name", {value: "get onpointerleave",configurable: true,});
// onpointerleave
curMemoryArea.onpointerleave_setter = function onpointerleave(val) { this._onpointerleave = val; }; mframe.safefunction(curMemoryArea.onpointerleave_setter);
Object.defineProperty(curMemoryArea.onpointerleave_setter, "name", {value: "set onpointerleave",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpointerleave", {get: curMemoryArea.onpointerleave_getter,set: curMemoryArea.onpointerleave_setter,enumerable: true,configurable: true,});
curMemoryArea.onpointerleave_smart_getter = function onpointerleave() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpointerleave;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpointerleave !== undefined ? this._onpointerleave : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpointerleave_smart_getter);
HTMLElement.prototype.__defineGetter__("onpointerleave", curMemoryArea.onpointerleave_smart_getter);

// onselectstart
curMemoryArea.onselectstart_getter = function onselectstart() { return this._onselectstart; }; mframe.safefunction(curMemoryArea.onselectstart_getter);
Object.defineProperty(curMemoryArea.onselectstart_getter, "name", {value: "get onselectstart",configurable: true,});
// onselectstart
curMemoryArea.onselectstart_setter = function onselectstart(val) { this._onselectstart = val; }; mframe.safefunction(curMemoryArea.onselectstart_setter);
Object.defineProperty(curMemoryArea.onselectstart_setter, "name", {value: "set onselectstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselectstart", {get: curMemoryArea.onselectstart_getter,set: curMemoryArea.onselectstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onselectstart_smart_getter = function onselectstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onselectstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onselectstart !== undefined ? this._onselectstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onselectstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onselectstart", curMemoryArea.onselectstart_smart_getter);

// onselectionchange
curMemoryArea.onselectionchange_getter = function onselectionchange() { return this._onselectionchange; }; mframe.safefunction(curMemoryArea.onselectionchange_getter);
Object.defineProperty(curMemoryArea.onselectionchange_getter, "name", {value: "get onselectionchange",configurable: true,});
// onselectionchange
curMemoryArea.onselectionchange_setter = function onselectionchange(val) { this._onselectionchange = val; }; mframe.safefunction(curMemoryArea.onselectionchange_setter);
Object.defineProperty(curMemoryArea.onselectionchange_setter, "name", {value: "set onselectionchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onselectionchange", {get: curMemoryArea.onselectionchange_getter,set: curMemoryArea.onselectionchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onselectionchange_smart_getter = function onselectionchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onselectionchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onselectionchange !== undefined ? this._onselectionchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onselectionchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onselectionchange", curMemoryArea.onselectionchange_smart_getter);

// onanimationend
curMemoryArea.onanimationend_getter = function onanimationend() { return this._onanimationend; }; mframe.safefunction(curMemoryArea.onanimationend_getter);
Object.defineProperty(curMemoryArea.onanimationend_getter, "name", {value: "get onanimationend",configurable: true,});
// onanimationend
curMemoryArea.onanimationend_setter = function onanimationend(val) { this._onanimationend = val; }; mframe.safefunction(curMemoryArea.onanimationend_setter);
Object.defineProperty(curMemoryArea.onanimationend_setter, "name", {value: "set onanimationend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationend", {get: curMemoryArea.onanimationend_getter,set: curMemoryArea.onanimationend_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationend_smart_getter = function onanimationend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onanimationend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onanimationend !== undefined ? this._onanimationend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onanimationend_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationend", curMemoryArea.onanimationend_smart_getter);

// onanimationiteration
curMemoryArea.onanimationiteration_getter = function onanimationiteration() { return this._onanimationiteration; }; mframe.safefunction(curMemoryArea.onanimationiteration_getter);
Object.defineProperty(curMemoryArea.onanimationiteration_getter, "name", {value: "get onanimationiteration",configurable: true,});
// onanimationiteration
curMemoryArea.onanimationiteration_setter = function onanimationiteration(val) { this._onanimationiteration = val; }; mframe.safefunction(curMemoryArea.onanimationiteration_setter);
Object.defineProperty(curMemoryArea.onanimationiteration_setter, "name", {value: "set onanimationiteration",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationiteration", {get: curMemoryArea.onanimationiteration_getter,set: curMemoryArea.onanimationiteration_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationiteration_smart_getter = function onanimationiteration() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onanimationiteration;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onanimationiteration !== undefined ? this._onanimationiteration : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onanimationiteration_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationiteration", curMemoryArea.onanimationiteration_smart_getter);

// onanimationstart
curMemoryArea.onanimationstart_getter = function onanimationstart() { return this._onanimationstart; }; mframe.safefunction(curMemoryArea.onanimationstart_getter);
Object.defineProperty(curMemoryArea.onanimationstart_getter, "name", {value: "get onanimationstart",configurable: true,});
// onanimationstart
curMemoryArea.onanimationstart_setter = function onanimationstart(val) { this._onanimationstart = val; }; mframe.safefunction(curMemoryArea.onanimationstart_setter);
Object.defineProperty(curMemoryArea.onanimationstart_setter, "name", {value: "set onanimationstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onanimationstart", {get: curMemoryArea.onanimationstart_getter,set: curMemoryArea.onanimationstart_setter,enumerable: true,configurable: true,});
curMemoryArea.onanimationstart_smart_getter = function onanimationstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onanimationstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onanimationstart !== undefined ? this._onanimationstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onanimationstart_smart_getter);
HTMLElement.prototype.__defineGetter__("onanimationstart", curMemoryArea.onanimationstart_smart_getter);

// ontransitionrun
curMemoryArea.ontransitionrun_getter = function ontransitionrun() { return this._ontransitionrun; }; mframe.safefunction(curMemoryArea.ontransitionrun_getter);
Object.defineProperty(curMemoryArea.ontransitionrun_getter, "name", {value: "get ontransitionrun",configurable: true,});
// ontransitionrun
curMemoryArea.ontransitionrun_setter = function ontransitionrun(val) { this._ontransitionrun = val; }; mframe.safefunction(curMemoryArea.ontransitionrun_setter);
Object.defineProperty(curMemoryArea.ontransitionrun_setter, "name", {value: "set ontransitionrun",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionrun", {get: curMemoryArea.ontransitionrun_getter,set: curMemoryArea.ontransitionrun_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionrun_smart_getter = function ontransitionrun() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontransitionrun;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontransitionrun !== undefined ? this._ontransitionrun : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontransitionrun_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionrun", curMemoryArea.ontransitionrun_smart_getter);

// ontransitionstart
curMemoryArea.ontransitionstart_getter = function ontransitionstart() { return this._ontransitionstart; }; mframe.safefunction(curMemoryArea.ontransitionstart_getter);
Object.defineProperty(curMemoryArea.ontransitionstart_getter, "name", {value: "get ontransitionstart",configurable: true,});
// ontransitionstart
curMemoryArea.ontransitionstart_setter = function ontransitionstart(val) { this._ontransitionstart = val; }; mframe.safefunction(curMemoryArea.ontransitionstart_setter);
Object.defineProperty(curMemoryArea.ontransitionstart_setter, "name", {value: "set ontransitionstart",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionstart", {get: curMemoryArea.ontransitionstart_getter,set: curMemoryArea.ontransitionstart_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionstart_smart_getter = function ontransitionstart() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontransitionstart;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontransitionstart !== undefined ? this._ontransitionstart : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontransitionstart_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionstart", curMemoryArea.ontransitionstart_smart_getter);

// ontransitionend
curMemoryArea.ontransitionend_getter = function ontransitionend() { return this._ontransitionend; }; mframe.safefunction(curMemoryArea.ontransitionend_getter);
Object.defineProperty(curMemoryArea.ontransitionend_getter, "name", {value: "get ontransitionend",configurable: true,});
// ontransitionend
curMemoryArea.ontransitionend_setter = function ontransitionend(val) { this._ontransitionend = val; }; mframe.safefunction(curMemoryArea.ontransitionend_setter);
Object.defineProperty(curMemoryArea.ontransitionend_setter, "name", {value: "set ontransitionend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitionend", {get: curMemoryArea.ontransitionend_getter,set: curMemoryArea.ontransitionend_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitionend_smart_getter = function ontransitionend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontransitionend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontransitionend !== undefined ? this._ontransitionend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontransitionend_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitionend", curMemoryArea.ontransitionend_smart_getter);

// ontransitioncancel
curMemoryArea.ontransitioncancel_getter = function ontransitioncancel() { return this._ontransitioncancel; }; mframe.safefunction(curMemoryArea.ontransitioncancel_getter);
Object.defineProperty(curMemoryArea.ontransitioncancel_getter, "name", {value: "get ontransitioncancel",configurable: true,});
// ontransitioncancel
curMemoryArea.ontransitioncancel_setter = function ontransitioncancel(val) { this._ontransitioncancel = val; }; mframe.safefunction(curMemoryArea.ontransitioncancel_setter);
Object.defineProperty(curMemoryArea.ontransitioncancel_setter, "name", {value: "set ontransitioncancel",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "ontransitioncancel", {get: curMemoryArea.ontransitioncancel_getter,set: curMemoryArea.ontransitioncancel_setter,enumerable: true,configurable: true,});
curMemoryArea.ontransitioncancel_smart_getter = function ontransitioncancel() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.ontransitioncancel;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._ontransitioncancel !== undefined ? this._ontransitioncancel : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.ontransitioncancel_smart_getter);
HTMLElement.prototype.__defineGetter__("ontransitioncancel", curMemoryArea.ontransitioncancel_smart_getter);

// oncopy
curMemoryArea.oncopy_getter = function oncopy() { return this._oncopy; }; mframe.safefunction(curMemoryArea.oncopy_getter);
Object.defineProperty(curMemoryArea.oncopy_getter, "name", {value: "get oncopy",configurable: true,});
// oncopy
curMemoryArea.oncopy_setter = function oncopy(val) { this._oncopy = val; }; mframe.safefunction(curMemoryArea.oncopy_setter);
Object.defineProperty(curMemoryArea.oncopy_setter, "name", {value: "set oncopy",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncopy", {get: curMemoryArea.oncopy_getter,set: curMemoryArea.oncopy_setter,enumerable: true,configurable: true,});
curMemoryArea.oncopy_smart_getter = function oncopy() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncopy;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncopy !== undefined ? this._oncopy : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncopy_smart_getter);
HTMLElement.prototype.__defineGetter__("oncopy", curMemoryArea.oncopy_smart_getter);

// oncut
curMemoryArea.oncut_getter = function oncut() { return this._oncut; }; mframe.safefunction(curMemoryArea.oncut_getter);
Object.defineProperty(curMemoryArea.oncut_getter, "name", {value: "get oncut",configurable: true,});
// oncut
curMemoryArea.oncut_setter = function oncut(val) { this._oncut = val; }; mframe.safefunction(curMemoryArea.oncut_setter);
Object.defineProperty(curMemoryArea.oncut_setter, "name", {value: "set oncut",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncut", {get: curMemoryArea.oncut_getter,set: curMemoryArea.oncut_setter,enumerable: true,configurable: true,});
curMemoryArea.oncut_smart_getter = function oncut() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncut;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncut !== undefined ? this._oncut : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncut_smart_getter);
HTMLElement.prototype.__defineGetter__("oncut", curMemoryArea.oncut_smart_getter);

// onpaste
curMemoryArea.onpaste_getter = function onpaste() { return this._onpaste; }; mframe.safefunction(curMemoryArea.onpaste_getter);
Object.defineProperty(curMemoryArea.onpaste_getter, "name", {value: "get onpaste",configurable: true,});
// onpaste
curMemoryArea.onpaste_setter = function onpaste(val) { this._onpaste = val; }; mframe.safefunction(curMemoryArea.onpaste_setter);
Object.defineProperty(curMemoryArea.onpaste_setter, "name", {value: "set onpaste",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onpaste", {get: curMemoryArea.onpaste_getter,set: curMemoryArea.onpaste_setter,enumerable: true,configurable: true,});
curMemoryArea.onpaste_smart_getter = function onpaste() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onpaste;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onpaste !== undefined ? this._onpaste : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onpaste_smart_getter);
HTMLElement.prototype.__defineGetter__("onpaste", curMemoryArea.onpaste_smart_getter);

// dataset
curMemoryArea.dataset_getter = function dataset() { return this._dataset; }; mframe.safefunction(curMemoryArea.dataset_getter);
Object.defineProperty(curMemoryArea.dataset_getter, "name", {value: "get dataset",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "dataset", {get: curMemoryArea.dataset_getter,enumerable: true,configurable: true,});
curMemoryArea.dataset_smart_getter = function dataset() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.dataset;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._dataset !== undefined ? this._dataset : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.dataset_smart_getter);
HTMLElement.prototype.__defineGetter__("dataset", curMemoryArea.dataset_smart_getter);

// nonce
curMemoryArea.nonce_getter = function nonce() { return this._nonce; }; mframe.safefunction(curMemoryArea.nonce_getter);
Object.defineProperty(curMemoryArea.nonce_getter, "name", {value: "get nonce",configurable: true,});
// nonce
curMemoryArea.nonce_setter = function nonce(val) { this._nonce = val; }; mframe.safefunction(curMemoryArea.nonce_setter);
Object.defineProperty(curMemoryArea.nonce_setter, "name", {value: "set nonce",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "nonce", {get: curMemoryArea.nonce_getter,set: curMemoryArea.nonce_setter,enumerable: true,configurable: true,});
curMemoryArea.nonce_smart_getter = function nonce() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.nonce;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._nonce !== undefined ? this._nonce : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.nonce_smart_getter);
HTMLElement.prototype.__defineGetter__("nonce", curMemoryArea.nonce_smart_getter);

// autofocus
curMemoryArea.autofocus_getter = function autofocus() { return this._autofocus; }; mframe.safefunction(curMemoryArea.autofocus_getter);
Object.defineProperty(curMemoryArea.autofocus_getter, "name", {value: "get autofocus",configurable: true,});
// autofocus
curMemoryArea.autofocus_setter = function autofocus(val) { this._autofocus = val; }; mframe.safefunction(curMemoryArea.autofocus_setter);
Object.defineProperty(curMemoryArea.autofocus_setter, "name", {value: "set autofocus",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "autofocus", {get: curMemoryArea.autofocus_getter,set: curMemoryArea.autofocus_setter,enumerable: true,configurable: true,});
curMemoryArea.autofocus_smart_getter = function autofocus() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.autofocus;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._autofocus !== undefined ? this._autofocus : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.autofocus_smart_getter);
HTMLElement.prototype.__defineGetter__("autofocus", curMemoryArea.autofocus_smart_getter);

// tabIndex
curMemoryArea.tabIndex_getter = function tabIndex() { return this._tabIndex; }; mframe.safefunction(curMemoryArea.tabIndex_getter);
Object.defineProperty(curMemoryArea.tabIndex_getter, "name", {value: "get tabIndex",configurable: true,});
// tabIndex
curMemoryArea.tabIndex_setter = function tabIndex(val) { this._tabIndex = val; }; mframe.safefunction(curMemoryArea.tabIndex_setter);
Object.defineProperty(curMemoryArea.tabIndex_setter, "name", {value: "set tabIndex",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "tabIndex", {get: curMemoryArea.tabIndex_getter,set: curMemoryArea.tabIndex_setter,enumerable: true,configurable: true,});
curMemoryArea.tabIndex_smart_getter = function tabIndex() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.tabIndex;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._tabIndex !== undefined ? this._tabIndex : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.tabIndex_smart_getter);
HTMLElement.prototype.__defineGetter__("tabIndex", curMemoryArea.tabIndex_smart_getter);

// style
curMemoryArea.style_getter = function style() { return this._style; }; mframe.safefunction(curMemoryArea.style_getter);
Object.defineProperty(curMemoryArea.style_getter, "name", {value: "get style",configurable: true,});
// style
curMemoryArea.style_setter = function style(val) { this._style = val; }; mframe.safefunction(curMemoryArea.style_setter);
Object.defineProperty(curMemoryArea.style_setter, "name", {value: "set style",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "style", {get: curMemoryArea.style_getter,set: curMemoryArea.style_setter,enumerable: true,configurable: true,});
curMemoryArea.style_smart_getter = function style() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.style;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._style !== undefined ? this._style : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.style_smart_getter);
HTMLElement.prototype.__defineGetter__("style", curMemoryArea.style_smart_getter);

// attributeStyleMap
curMemoryArea.attributeStyleMap_getter = function attributeStyleMap() { return this._attributeStyleMap; }; mframe.safefunction(curMemoryArea.attributeStyleMap_getter);
Object.defineProperty(curMemoryArea.attributeStyleMap_getter, "name", {value: "get attributeStyleMap",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "attributeStyleMap", {get: curMemoryArea.attributeStyleMap_getter,enumerable: true,configurable: true,});
curMemoryArea.attributeStyleMap_smart_getter = function attributeStyleMap() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.attributeStyleMap;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._attributeStyleMap !== undefined ? this._attributeStyleMap : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.attributeStyleMap_smart_getter);
HTMLElement.prototype.__defineGetter__("attributeStyleMap", curMemoryArea.attributeStyleMap_smart_getter);

// oncommand
curMemoryArea.oncommand_getter = function oncommand() { return this._oncommand; }; mframe.safefunction(curMemoryArea.oncommand_getter);
Object.defineProperty(curMemoryArea.oncommand_getter, "name", {value: "get oncommand",configurable: true,});
// oncommand
curMemoryArea.oncommand_setter = function oncommand(val) { this._oncommand = val; }; mframe.safefunction(curMemoryArea.oncommand_setter);
Object.defineProperty(curMemoryArea.oncommand_setter, "name", {value: "set oncommand",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "oncommand", {get: curMemoryArea.oncommand_getter,set: curMemoryArea.oncommand_setter,enumerable: true,configurable: true,});
curMemoryArea.oncommand_smart_getter = function oncommand() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.oncommand;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._oncommand !== undefined ? this._oncommand : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.oncommand_smart_getter);
HTMLElement.prototype.__defineGetter__("oncommand", curMemoryArea.oncommand_smart_getter);

// onscrollend
curMemoryArea.onscrollend_getter = function onscrollend() { return this._onscrollend; }; mframe.safefunction(curMemoryArea.onscrollend_getter);
Object.defineProperty(curMemoryArea.onscrollend_getter, "name", {value: "get onscrollend",configurable: true,});
// onscrollend
curMemoryArea.onscrollend_setter = function onscrollend(val) { this._onscrollend = val; }; mframe.safefunction(curMemoryArea.onscrollend_setter);
Object.defineProperty(curMemoryArea.onscrollend_setter, "name", {value: "set onscrollend",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollend", {get: curMemoryArea.onscrollend_getter,set: curMemoryArea.onscrollend_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollend_smart_getter = function onscrollend() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onscrollend;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscrollend !== undefined ? this._onscrollend : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscrollend_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollend", curMemoryArea.onscrollend_smart_getter);

// onscrollsnapchange
curMemoryArea.onscrollsnapchange_getter = function onscrollsnapchange() { return this._onscrollsnapchange; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_getter, "name", {value: "get onscrollsnapchange",configurable: true,});
// onscrollsnapchange
curMemoryArea.onscrollsnapchange_setter = function onscrollsnapchange(val) { this._onscrollsnapchange = val; }; mframe.safefunction(curMemoryArea.onscrollsnapchange_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchange_setter, "name", {value: "set onscrollsnapchange",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollsnapchange", {get: curMemoryArea.onscrollsnapchange_getter,set: curMemoryArea.onscrollsnapchange_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollsnapchange_smart_getter = function onscrollsnapchange() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onscrollsnapchange;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscrollsnapchange !== undefined ? this._onscrollsnapchange : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscrollsnapchange_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollsnapchange", curMemoryArea.onscrollsnapchange_smart_getter);

// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_getter = function onscrollsnapchanging() { return this._onscrollsnapchanging; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_getter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_getter, "name", {value: "get onscrollsnapchanging",configurable: true,});
// onscrollsnapchanging
curMemoryArea.onscrollsnapchanging_setter = function onscrollsnapchanging(val) { this._onscrollsnapchanging = val; }; mframe.safefunction(curMemoryArea.onscrollsnapchanging_setter);
Object.defineProperty(curMemoryArea.onscrollsnapchanging_setter, "name", {value: "set onscrollsnapchanging",configurable: true,});
Object.defineProperty(HTMLElement.prototype, "onscrollsnapchanging", {get: curMemoryArea.onscrollsnapchanging_getter,set: curMemoryArea.onscrollsnapchanging_setter,enumerable: true,configurable: true,});
curMemoryArea.onscrollsnapchanging_smart_getter = function onscrollsnapchanging() {
    if(mframe.memory.jsdom.document) {return this.jsdomMemory.onscrollsnapchanging;}
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._onscrollsnapchanging !== undefined ? this._onscrollsnapchanging : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.onscrollsnapchanging_smart_getter);
HTMLElement.prototype.__defineGetter__("onscrollsnapchanging", curMemoryArea.onscrollsnapchanging_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLElement.prototype["attachInternals"] = function attachInternals() { debugger; }; mframe.safefunction(HTMLElement.prototype["attachInternals"]);
HTMLElement.prototype["blur"] = function blur() { debugger; }; mframe.safefunction(HTMLElement.prototype["blur"]);
HTMLElement.prototype["click"] = function click() { debugger; }; mframe.safefunction(HTMLElement.prototype["click"]);
HTMLElement.prototype["focus"] = function focus() { debugger; }; mframe.safefunction(HTMLElement.prototype["focus"]);
HTMLElement.prototype["hidePopover"] = function hidePopover() { debugger; }; mframe.safefunction(HTMLElement.prototype["hidePopover"]);
HTMLElement.prototype["showPopover"] = function showPopover() { debugger; }; mframe.safefunction(HTMLElement.prototype["showPopover"]);
HTMLElement.prototype["togglePopover"] = function togglePopover() { debugger; }; mframe.safefunction(HTMLElement.prototype["togglePopover"]);
//==============↑↑Function END↑↑====================

//////////////////////////////////

HTMLElement.prototype.__proto__ = Element.prototype;
/**代理 */
HTMLElement = mframe.proxy(HTMLElement)
var HTMLAnchorElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLAnchorElement);

Object.defineProperties(HTMLAnchorElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLAnchorElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLAnchorElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLAnchorElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLAnchorElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// target
curMemoryArea.target_getter = function target() { debugger; }; mframe.safefunction(curMemoryArea.target_getter);
Object.defineProperty(curMemoryArea.target_getter, "name", {value: "get target",configurable: true,});
// target
curMemoryArea.target_setter = function target(val) {
    this._target = val; 
    this.jsdomMemory.target = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'target', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.target_setter);
Object.defineProperty(curMemoryArea.target_setter, "name", {value: "set target",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "target", {get: curMemoryArea.target_getter,set: curMemoryArea.target_setter,enumerable: true,configurable: true,});
curMemoryArea.target_smart_getter = function target() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._target !== undefined ? this._target : this.jsdomMemory.target; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'target', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.target_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("target", curMemoryArea.target_smart_getter);

// download
curMemoryArea.download_getter = function download() { debugger; }; mframe.safefunction(curMemoryArea.download_getter);
Object.defineProperty(curMemoryArea.download_getter, "name", {value: "get download",configurable: true,});
// download
curMemoryArea.download_setter = function download(val) {
    this._download = val; 
    this.jsdomMemory.download = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'download', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.download_setter);
Object.defineProperty(curMemoryArea.download_setter, "name", {value: "set download",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "download", {get: curMemoryArea.download_getter,set: curMemoryArea.download_setter,enumerable: true,configurable: true,});
curMemoryArea.download_smart_getter = function download() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._download !== undefined ? this._download : this.jsdomMemory.download; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'download', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.download_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("download", curMemoryArea.download_smart_getter);

// ping
curMemoryArea.ping_getter = function ping() { debugger; }; mframe.safefunction(curMemoryArea.ping_getter);
Object.defineProperty(curMemoryArea.ping_getter, "name", {value: "get ping",configurable: true,});
// ping
curMemoryArea.ping_setter = function ping(val) {
    this._ping = val; 
    this.jsdomMemory.ping = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'ping', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.ping_setter);
Object.defineProperty(curMemoryArea.ping_setter, "name", {value: "set ping",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "ping", {get: curMemoryArea.ping_getter,set: curMemoryArea.ping_setter,enumerable: true,configurable: true,});
curMemoryArea.ping_smart_getter = function ping() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._ping !== undefined ? this._ping : this.jsdomMemory.ping; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'ping', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.ping_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("ping", curMemoryArea.ping_smart_getter);

// rel
curMemoryArea.rel_getter = function rel() { debugger; }; mframe.safefunction(curMemoryArea.rel_getter);
Object.defineProperty(curMemoryArea.rel_getter, "name", {value: "get rel",configurable: true,});
// rel
curMemoryArea.rel_setter = function rel(val) {
    this._rel = val; 
    this.jsdomMemory.rel = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'rel', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.rel_setter);
Object.defineProperty(curMemoryArea.rel_setter, "name", {value: "set rel",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "rel", {get: curMemoryArea.rel_getter,set: curMemoryArea.rel_setter,enumerable: true,configurable: true,});
curMemoryArea.rel_smart_getter = function rel() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._rel !== undefined ? this._rel : this.jsdomMemory.rel; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'rel', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.rel_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("rel", curMemoryArea.rel_smart_getter);

// relList
curMemoryArea.relList_getter = function relList() { debugger; }; mframe.safefunction(curMemoryArea.relList_getter);
Object.defineProperty(curMemoryArea.relList_getter, "name", {value: "get relList",configurable: true,});
// relList
curMemoryArea.relList_setter = function relList(val) {
    this._relList = val; 
    this.jsdomMemory.relList = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'relList', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.relList_setter);
Object.defineProperty(curMemoryArea.relList_setter, "name", {value: "set relList",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "relList", {get: curMemoryArea.relList_getter,set: curMemoryArea.relList_setter,enumerable: true,configurable: true,});
curMemoryArea.relList_smart_getter = function relList() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._relList !== undefined ? this._relList : this.jsdomMemory.relList; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'relList', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.relList_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("relList", curMemoryArea.relList_smart_getter);

// hreflang
curMemoryArea.hreflang_getter = function hreflang() { debugger; }; mframe.safefunction(curMemoryArea.hreflang_getter);
Object.defineProperty(curMemoryArea.hreflang_getter, "name", {value: "get hreflang",configurable: true,});
// hreflang
curMemoryArea.hreflang_setter = function hreflang(val) {
    this._hreflang = val; 
    this.jsdomMemory.hreflang = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hreflang', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.hreflang_setter);
Object.defineProperty(curMemoryArea.hreflang_setter, "name", {value: "set hreflang",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hreflang", {get: curMemoryArea.hreflang_getter,set: curMemoryArea.hreflang_setter,enumerable: true,configurable: true,});
curMemoryArea.hreflang_smart_getter = function hreflang() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._hreflang !== undefined ? this._hreflang : this.jsdomMemory.hreflang; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hreflang', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.hreflang_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hreflang", curMemoryArea.hreflang_smart_getter);

// type
curMemoryArea.type_getter = function type() { debugger; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", {value: "get type",configurable: true,});
// type
curMemoryArea.type_setter = function type(val) {
    this._type = val; 
    this.jsdomMemory.type = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'type', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.type_setter);
Object.defineProperty(curMemoryArea.type_setter, "name", {value: "set type",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "type", {get: curMemoryArea.type_getter,set: curMemoryArea.type_setter,enumerable: true,configurable: true,});
curMemoryArea.type_smart_getter = function type() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._type !== undefined ? this._type : this.jsdomMemory.type; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'type', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.type_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// referrerPolicy
curMemoryArea.referrerPolicy_getter = function referrerPolicy() { debugger; }; mframe.safefunction(curMemoryArea.referrerPolicy_getter);
Object.defineProperty(curMemoryArea.referrerPolicy_getter, "name", {value: "get referrerPolicy",configurable: true,});
// referrerPolicy
curMemoryArea.referrerPolicy_setter = function referrerPolicy(val) {
    this._referrerPolicy = val; 
    this.jsdomMemory.referrerPolicy = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'referrerPolicy', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.referrerPolicy_setter);
Object.defineProperty(curMemoryArea.referrerPolicy_setter, "name", {value: "set referrerPolicy",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "referrerPolicy", {get: curMemoryArea.referrerPolicy_getter,set: curMemoryArea.referrerPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.referrerPolicy_smart_getter = function referrerPolicy() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._referrerPolicy !== undefined ? this._referrerPolicy : this.jsdomMemory.referrerPolicy; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'referrerPolicy', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.referrerPolicy_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("referrerPolicy", curMemoryArea.referrerPolicy_smart_getter);

// text
curMemoryArea.text_getter = function text() { debugger; }; mframe.safefunction(curMemoryArea.text_getter);
Object.defineProperty(curMemoryArea.text_getter, "name", {value: "get text",configurable: true,});
// text
curMemoryArea.text_setter = function text(val) {
    this._text = val; 
    this.jsdomMemory.text = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'text', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.text_setter);
Object.defineProperty(curMemoryArea.text_setter, "name", {value: "set text",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "text", {get: curMemoryArea.text_getter,set: curMemoryArea.text_setter,enumerable: true,configurable: true,});
curMemoryArea.text_smart_getter = function text() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._text !== undefined ? this._text : this.jsdomMemory.text; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'text', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.text_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("text", curMemoryArea.text_smart_getter);

// coords
curMemoryArea.coords_getter = function coords() { debugger; }; mframe.safefunction(curMemoryArea.coords_getter);
Object.defineProperty(curMemoryArea.coords_getter, "name", {value: "get coords",configurable: true,});
// coords
curMemoryArea.coords_setter = function coords(val) {
    this._coords = val; 
    this.jsdomMemory.coords = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'coords', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.coords_setter);
Object.defineProperty(curMemoryArea.coords_setter, "name", {value: "set coords",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "coords", {get: curMemoryArea.coords_getter,set: curMemoryArea.coords_setter,enumerable: true,configurable: true,});
curMemoryArea.coords_smart_getter = function coords() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._coords !== undefined ? this._coords : this.jsdomMemory.coords; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'coords', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.coords_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("coords", curMemoryArea.coords_smart_getter);

// charset
curMemoryArea.charset_getter = function charset() { debugger; }; mframe.safefunction(curMemoryArea.charset_getter);
Object.defineProperty(curMemoryArea.charset_getter, "name", {value: "get charset",configurable: true,});
// charset
curMemoryArea.charset_setter = function charset(val) {
    this._charset = val; 
    this.jsdomMemory.charset = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'charset', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.charset_setter);
Object.defineProperty(curMemoryArea.charset_setter, "name", {value: "set charset",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "charset", {get: curMemoryArea.charset_getter,set: curMemoryArea.charset_setter,enumerable: true,configurable: true,});
curMemoryArea.charset_smart_getter = function charset() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._charset !== undefined ? this._charset : this.jsdomMemory.charset; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'charset', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.charset_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("charset", curMemoryArea.charset_smart_getter);

// name
curMemoryArea.name_getter = function name() { debugger; }; mframe.safefunction(curMemoryArea.name_getter);
Object.defineProperty(curMemoryArea.name_getter, "name", {value: "get name",configurable: true,});
// name
curMemoryArea.name_setter = function name(val) {
    this._name = val; 
    this.jsdomMemory.name = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'name', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.name_setter);
Object.defineProperty(curMemoryArea.name_setter, "name", {value: "set name",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "name", {get: curMemoryArea.name_getter,set: curMemoryArea.name_setter,enumerable: true,configurable: true,});
curMemoryArea.name_smart_getter = function name() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._name !== undefined ? this._name : this.jsdomMemory.name; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'name', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.name_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("name", curMemoryArea.name_smart_getter);

// rev
curMemoryArea.rev_getter = function rev() { debugger; }; mframe.safefunction(curMemoryArea.rev_getter);
Object.defineProperty(curMemoryArea.rev_getter, "name", {value: "get rev",configurable: true,});
// rev
curMemoryArea.rev_setter = function rev(val) {
    this._rev = val; 
    this.jsdomMemory.rev = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'rev', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.rev_setter);
Object.defineProperty(curMemoryArea.rev_setter, "name", {value: "set rev",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "rev", {get: curMemoryArea.rev_getter,set: curMemoryArea.rev_setter,enumerable: true,configurable: true,});
curMemoryArea.rev_smart_getter = function rev() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._rev !== undefined ? this._rev : this.jsdomMemory.rev; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'rev', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.rev_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("rev", curMemoryArea.rev_smart_getter);

// shape
curMemoryArea.shape_getter = function shape() { debugger; }; mframe.safefunction(curMemoryArea.shape_getter);
Object.defineProperty(curMemoryArea.shape_getter, "name", {value: "get shape",configurable: true,});
// shape
curMemoryArea.shape_setter = function shape(val) {
    this._shape = val; 
    this.jsdomMemory.shape = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'shape', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.shape_setter);
Object.defineProperty(curMemoryArea.shape_setter, "name", {value: "set shape",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "shape", {get: curMemoryArea.shape_getter,set: curMemoryArea.shape_setter,enumerable: true,configurable: true,});
curMemoryArea.shape_smart_getter = function shape() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._shape !== undefined ? this._shape : this.jsdomMemory.shape; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'shape', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.shape_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("shape", curMemoryArea.shape_smart_getter);

// origin
curMemoryArea.origin_getter = function origin() { debugger; }; mframe.safefunction(curMemoryArea.origin_getter);
Object.defineProperty(curMemoryArea.origin_getter, "name", {value: "get origin",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "origin", {get: curMemoryArea.origin_getter,enumerable: true,configurable: true,});
curMemoryArea.origin_smart_getter = function origin() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._origin !== undefined ? this._origin : this.jsdomMemory.origin; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'origin', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.origin_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("origin", curMemoryArea.origin_smart_getter);

// protocol
curMemoryArea.protocol_getter = function protocol() { debugger; }; mframe.safefunction(curMemoryArea.protocol_getter);
Object.defineProperty(curMemoryArea.protocol_getter, "name", {value: "get protocol",configurable: true,});
// protocol
curMemoryArea.protocol_setter = function protocol(val) {
    this._protocol = val; 
    this.jsdomMemory.protocol = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'protocol', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.protocol_setter);
Object.defineProperty(curMemoryArea.protocol_setter, "name", {value: "set protocol",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "protocol", {get: curMemoryArea.protocol_getter,set: curMemoryArea.protocol_setter,enumerable: true,configurable: true,});
curMemoryArea.protocol_smart_getter = function protocol() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._protocol !== undefined ? this._protocol : this.jsdomMemory.protocol; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'protocol', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.protocol_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("protocol", curMemoryArea.protocol_smart_getter);

// username
curMemoryArea.username_getter = function username() { debugger; }; mframe.safefunction(curMemoryArea.username_getter);
Object.defineProperty(curMemoryArea.username_getter, "name", {value: "get username",configurable: true,});
// username
curMemoryArea.username_setter = function username(val) {
    this._username = val; 
    this.jsdomMemory.username = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'username', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.username_setter);
Object.defineProperty(curMemoryArea.username_setter, "name", {value: "set username",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "username", {get: curMemoryArea.username_getter,set: curMemoryArea.username_setter,enumerable: true,configurable: true,});
curMemoryArea.username_smart_getter = function username() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._username !== undefined ? this._username : this.jsdomMemory.username; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'username', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.username_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("username", curMemoryArea.username_smart_getter);

// password
curMemoryArea.password_getter = function password() { debugger; }; mframe.safefunction(curMemoryArea.password_getter);
Object.defineProperty(curMemoryArea.password_getter, "name", {value: "get password",configurable: true,});
// password
curMemoryArea.password_setter = function password(val) {
    this._password = val; 
    this.jsdomMemory.password = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'password', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.password_setter);
Object.defineProperty(curMemoryArea.password_setter, "name", {value: "set password",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "password", {get: curMemoryArea.password_getter,set: curMemoryArea.password_setter,enumerable: true,configurable: true,});
curMemoryArea.password_smart_getter = function password() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._password !== undefined ? this._password : this.jsdomMemory.password; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'password', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.password_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("password", curMemoryArea.password_smart_getter);

// host
curMemoryArea.host_getter = function host() { debugger; }; mframe.safefunction(curMemoryArea.host_getter);
Object.defineProperty(curMemoryArea.host_getter, "name", {value: "get host",configurable: true,});
// host
curMemoryArea.host_setter = function host(val) {
    this._host = val; 
    this.jsdomMemory.host = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'host', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.host_setter);
Object.defineProperty(curMemoryArea.host_setter, "name", {value: "set host",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "host", {get: curMemoryArea.host_getter,set: curMemoryArea.host_setter,enumerable: true,configurable: true,});
curMemoryArea.host_smart_getter = function host() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._host !== undefined ? this._host : this.jsdomMemory.host; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'host', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.host_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("host", curMemoryArea.host_smart_getter);

// hostname
curMemoryArea.hostname_getter = function hostname() { debugger; }; mframe.safefunction(curMemoryArea.hostname_getter);
Object.defineProperty(curMemoryArea.hostname_getter, "name", {value: "get hostname",configurable: true,});
// hostname
curMemoryArea.hostname_setter = function hostname(val) {
    this._hostname = val; 
    this.jsdomMemory.hostname = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hostname', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.hostname_setter);
Object.defineProperty(curMemoryArea.hostname_setter, "name", {value: "set hostname",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hostname", {get: curMemoryArea.hostname_getter,set: curMemoryArea.hostname_setter,enumerable: true,configurable: true,});
curMemoryArea.hostname_smart_getter = function hostname() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._hostname !== undefined ? this._hostname : this.jsdomMemory.hostname; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hostname', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.hostname_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hostname", curMemoryArea.hostname_smart_getter);

// port
curMemoryArea.port_getter = function port() { debugger; }; mframe.safefunction(curMemoryArea.port_getter);
Object.defineProperty(curMemoryArea.port_getter, "name", {value: "get port",configurable: true,});
// port
curMemoryArea.port_setter = function port(val) {
    this._port = val; 
    this.jsdomMemory.port = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'port', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.port_setter);
Object.defineProperty(curMemoryArea.port_setter, "name", {value: "set port",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "port", {get: curMemoryArea.port_getter,set: curMemoryArea.port_setter,enumerable: true,configurable: true,});
curMemoryArea.port_smart_getter = function port() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._port !== undefined ? this._port : this.jsdomMemory.port; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'port', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.port_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("port", curMemoryArea.port_smart_getter);

// pathname
curMemoryArea.pathname_getter = function pathname() { debugger; }; mframe.safefunction(curMemoryArea.pathname_getter);
Object.defineProperty(curMemoryArea.pathname_getter, "name", {value: "get pathname",configurable: true,});
// pathname
curMemoryArea.pathname_setter = function pathname(val) {
    this._pathname = val; 
    this.jsdomMemory.pathname = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'pathname', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.pathname_setter);
Object.defineProperty(curMemoryArea.pathname_setter, "name", {value: "set pathname",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "pathname", {get: curMemoryArea.pathname_getter,set: curMemoryArea.pathname_setter,enumerable: true,configurable: true,});
curMemoryArea.pathname_smart_getter = function pathname() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._pathname !== undefined ? this._pathname : this.jsdomMemory.pathname; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'pathname', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.pathname_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("pathname", curMemoryArea.pathname_smart_getter);

// search
curMemoryArea.search_getter = function search() { debugger; }; mframe.safefunction(curMemoryArea.search_getter);
Object.defineProperty(curMemoryArea.search_getter, "name", {value: "get search",configurable: true,});
// search
curMemoryArea.search_setter = function search(val) {
    this._search = val; 
    this.jsdomMemory.search = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'search', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.search_setter);
Object.defineProperty(curMemoryArea.search_setter, "name", {value: "set search",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "search", {get: curMemoryArea.search_getter,set: curMemoryArea.search_setter,enumerable: true,configurable: true,});
curMemoryArea.search_smart_getter = function search() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._search !== undefined ? this._search : this.jsdomMemory.search; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'search', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.search_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("search", curMemoryArea.search_smart_getter);

// hash
curMemoryArea.hash_getter = function hash() { debugger; }; mframe.safefunction(curMemoryArea.hash_getter);
Object.defineProperty(curMemoryArea.hash_getter, "name", {value: "get hash",configurable: true,});
// hash
curMemoryArea.hash_setter = function hash(val) {
    this._hash = val; 
    this.jsdomMemory.hash = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hash', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.hash_setter);
Object.defineProperty(curMemoryArea.hash_setter, "name", {value: "set hash",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hash", {get: curMemoryArea.hash_getter,set: curMemoryArea.hash_setter,enumerable: true,configurable: true,});
curMemoryArea.hash_smart_getter = function hash() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._hash !== undefined ? this._hash : this.jsdomMemory.hash; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hash', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.hash_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hash", curMemoryArea.hash_smart_getter);

// href
curMemoryArea.href_getter = function href() { debugger; }; mframe.safefunction(curMemoryArea.href_getter);
Object.defineProperty(curMemoryArea.href_getter, "name", {value: "get href",configurable: true,});
// href
curMemoryArea.href_setter = function href(val) {
    this._href = val; 
    this.jsdomMemory.href = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'href', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.href_setter);
Object.defineProperty(curMemoryArea.href_setter, "name", {value: "set href",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "href", {get: curMemoryArea.href_getter,set: curMemoryArea.href_setter,enumerable: true,configurable: true,});
curMemoryArea.href_smart_getter = function href() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._href !== undefined ? this._href : this.jsdomMemory.href; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'href', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.href_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("href", curMemoryArea.href_smart_getter);

// hrefTranslate
curMemoryArea.hrefTranslate_getter = function hrefTranslate() { debugger; }; mframe.safefunction(curMemoryArea.hrefTranslate_getter);
Object.defineProperty(curMemoryArea.hrefTranslate_getter, "name", {value: "get hrefTranslate",configurable: true,});
// hrefTranslate
curMemoryArea.hrefTranslate_setter = function hrefTranslate(val) {
    this._hrefTranslate = val; 
    this.jsdomMemory.hrefTranslate = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hrefTranslate', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.hrefTranslate_setter);
Object.defineProperty(curMemoryArea.hrefTranslate_setter, "name", {value: "set hrefTranslate",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "hrefTranslate", {get: curMemoryArea.hrefTranslate_getter,set: curMemoryArea.hrefTranslate_setter,enumerable: true,configurable: true,});
curMemoryArea.hrefTranslate_smart_getter = function hrefTranslate() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._hrefTranslate !== undefined ? this._hrefTranslate : this.jsdomMemory.hrefTranslate; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'hrefTranslate', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.hrefTranslate_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("hrefTranslate", curMemoryArea.hrefTranslate_smart_getter);

// attributionSrc
curMemoryArea.attributionSrc_getter = function attributionSrc() { debugger; }; mframe.safefunction(curMemoryArea.attributionSrc_getter);
Object.defineProperty(curMemoryArea.attributionSrc_getter, "name", {value: "get attributionSrc",configurable: true,});
// attributionSrc
curMemoryArea.attributionSrc_setter = function attributionSrc(val) {
    this._attributionSrc = val; 
    this.jsdomMemory.attributionSrc = val; 
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'attributionSrc', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.attributionSrc_setter);
Object.defineProperty(curMemoryArea.attributionSrc_setter, "name", {value: "set attributionSrc",configurable: true,});
Object.defineProperty(HTMLAnchorElement.prototype, "attributionSrc", {get: curMemoryArea.attributionSrc_getter,set: curMemoryArea.attributionSrc_setter,enumerable: true,configurable: true,});
curMemoryArea.attributionSrc_smart_getter = function attributionSrc() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._attributionSrc !== undefined ? this._attributionSrc : this.jsdomMemory.attributionSrc; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLAnchorElement', propertyName: 'attributionSrc', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.attributionSrc_smart_getter);
HTMLAnchorElement.prototype.__defineGetter__("attributionSrc", curMemoryArea.attributionSrc_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLAnchorElement.prototype["toString"] = function toString() {
    var res = this.href;
    mframe.log({ flag: 'function', className: 'HTMLAnchorElement', methodName: 'toString', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLAnchorElement.prototype["toString"]);
//==============↑↑Function END↑↑====================


///////////////////////////////////////////////////////////

HTMLAnchorElement.__proto__ = HTMLElement;
HTMLAnchorElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['a'] = function () {
    var a = new (function () { });
    a.__proto__ = HTMLAnchorElement.prototype;

    return a;
}
var HTMLMetaElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLMetaElement);

Object.defineProperties(HTMLMetaElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLMetaElement",
        configurable: true,
    }
});
//////////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLMetaElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLMetaElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLMetaElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// name
curMemoryArea.name_getter = function name() { debugger; }; mframe.safefunction(curMemoryArea.name_getter);
Object.defineProperty(curMemoryArea.name_getter, "name", {value: "get name",configurable: true,});
// name
curMemoryArea.name_setter = function name(val) {
    this._name = val; 
    this.jsdomMemory.name = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'name', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.name_setter);
Object.defineProperty(curMemoryArea.name_setter, "name", {value: "set name",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "name", {get: curMemoryArea.name_getter,set: curMemoryArea.name_setter,enumerable: true,configurable: true,});
curMemoryArea.name_smart_getter = function name() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._name !== undefined ? this._name : this.jsdomMemory.name; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'name', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.name_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("name", curMemoryArea.name_smart_getter);

// httpEquiv
curMemoryArea.httpEquiv_getter = function httpEquiv() { debugger; }; mframe.safefunction(curMemoryArea.httpEquiv_getter);
Object.defineProperty(curMemoryArea.httpEquiv_getter, "name", {value: "get httpEquiv",configurable: true,});
// httpEquiv
curMemoryArea.httpEquiv_setter = function httpEquiv(val) {
    this._httpEquiv = val; 
    this.jsdomMemory.httpEquiv = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'httpEquiv', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.httpEquiv_setter);
Object.defineProperty(curMemoryArea.httpEquiv_setter, "name", {value: "set httpEquiv",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "httpEquiv", {get: curMemoryArea.httpEquiv_getter,set: curMemoryArea.httpEquiv_setter,enumerable: true,configurable: true,});
curMemoryArea.httpEquiv_smart_getter = function httpEquiv() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._httpEquiv !== undefined ? this._httpEquiv : this.jsdomMemory.httpEquiv; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'httpEquiv', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.httpEquiv_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("httpEquiv", curMemoryArea.httpEquiv_smart_getter);

// content
curMemoryArea.content_getter = function content() { debugger; }; mframe.safefunction(curMemoryArea.content_getter);
Object.defineProperty(curMemoryArea.content_getter, "name", {value: "get content",configurable: true,});
// content
curMemoryArea.content_setter = function content(val) {
    this._content = val; 
    this.jsdomMemory.content = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'content', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.content_setter);
Object.defineProperty(curMemoryArea.content_setter, "name", {value: "set content",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "content", {get: curMemoryArea.content_getter,set: curMemoryArea.content_setter,enumerable: true,configurable: true,});
curMemoryArea.content_smart_getter = function content() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._content !== undefined ? this._content : this.jsdomMemory.content; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'content', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.content_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("content", curMemoryArea.content_smart_getter);

// media
curMemoryArea.media_getter = function media() { debugger; }; mframe.safefunction(curMemoryArea.media_getter);
Object.defineProperty(curMemoryArea.media_getter, "name", {value: "get media",configurable: true,});
// media
curMemoryArea.media_setter = function media(val) {
    this._media = val; 
    this.jsdomMemory.media = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'media', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.media_setter);
Object.defineProperty(curMemoryArea.media_setter, "name", {value: "set media",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "media", {get: curMemoryArea.media_getter,set: curMemoryArea.media_setter,enumerable: true,configurable: true,});
curMemoryArea.media_smart_getter = function media() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._media !== undefined ? this._media : this.jsdomMemory.media; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'media', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.media_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("media", curMemoryArea.media_smart_getter);

// scheme
curMemoryArea.scheme_getter = function scheme() { debugger; }; mframe.safefunction(curMemoryArea.scheme_getter);
Object.defineProperty(curMemoryArea.scheme_getter, "name", {value: "get scheme",configurable: true,});
// scheme
curMemoryArea.scheme_setter = function scheme(val) {
    this._scheme = val; 
    this.jsdomMemory.scheme = val; 
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'scheme', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.scheme_setter);
Object.defineProperty(curMemoryArea.scheme_setter, "name", {value: "set scheme",configurable: true,});
Object.defineProperty(HTMLMetaElement.prototype, "scheme", {get: curMemoryArea.scheme_getter,set: curMemoryArea.scheme_setter,enumerable: true,configurable: true,});
curMemoryArea.scheme_smart_getter = function scheme() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._scheme !== undefined ? this._scheme : this.jsdomMemory.scheme; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLMetaElement', propertyName: 'scheme', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.scheme_smart_getter);
HTMLMetaElement.prototype.__defineGetter__("scheme", curMemoryArea.scheme_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////////////////////////

HTMLMetaElement.__proto__ = HTMLElement;
HTMLMetaElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['meta'] = function () {
    var meta = new (function () { }); // new一个假的,通过换原型,换为HTMLMetaElement去实现
    meta.__proto__ = HTMLMetaElement.prototype;
    //////////{HTMLMetaElement特有的 属性/方法}//////////////

    //////////////////////////////////////////////////////
    return meta;
}
var HTMLDivElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLDivElement);

Object.defineProperties(HTMLDivElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDivElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLDivElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLDivElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLDivElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// align
curMemoryArea.align_getter = function align() { debugger; }; mframe.safefunction(curMemoryArea.align_getter);
Object.defineProperty(curMemoryArea.align_getter, "name", {value: "get align",configurable: true,});
// align
curMemoryArea.align_setter = function align(val) {
    this._align = val; 
    this.jsdomMemory.align = val; 
    mframe.log({ flag: 'property', className: 'HTMLDivElement', propertyName: 'align', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.align_setter);
Object.defineProperty(curMemoryArea.align_setter, "name", {value: "set align",configurable: true,});
Object.defineProperty(HTMLDivElement.prototype, "align", {get: curMemoryArea.align_getter,set: curMemoryArea.align_setter,enumerable: true,configurable: true,});
curMemoryArea.align_smart_getter = function align() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._align !== undefined ? this._align : this.jsdomMemory.align; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLDivElement', propertyName: 'align', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.align_smart_getter);
HTMLDivElement.prototype.__defineGetter__("align", curMemoryArea.align_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////


HTMLDivElement.__proto__ = HTMLElement;
HTMLDivElement.prototype.__proto__ = HTMLElement.prototype;

// 如果调用 mframe.memory.htmlelements['div'], 就返回 HTMLDivElement
mframe.memory.htmlelements['div'] = function () {
    var div = new (function () { }); // new一个假的,通过换原型,换为HTMLDivElement去实现
    div.__proto__ = HTMLDivElement.prototype;
    return div;
}
var HTMLScriptElement = function () {
    debugger;
    throw new TypeError('HTMLScriptElement 不允许被new')
}; mframe.safefunction(HTMLScriptElement);

Object.defineProperties(HTMLScriptElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLScriptElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLScriptElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLScriptElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLScriptElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// src
curMemoryArea.src_getter = function src() { debugger; }; mframe.safefunction(curMemoryArea.src_getter);
Object.defineProperty(curMemoryArea.src_getter, "name", {value: "get src",configurable: true,});
// src
curMemoryArea.src_setter = function src(val) {
    this._src = val; 
    this.jsdomMemory.src = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'src', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.src_setter);
Object.defineProperty(curMemoryArea.src_setter, "name", {value: "set src",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "src", {get: curMemoryArea.src_getter,set: curMemoryArea.src_setter,enumerable: true,configurable: true,});
curMemoryArea.src_smart_getter = function src() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._src !== undefined ? this._src : this.jsdomMemory.src; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'src', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.src_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("src", curMemoryArea.src_smart_getter);

// type
curMemoryArea.type_getter = function type() { debugger; }; mframe.safefunction(curMemoryArea.type_getter);
Object.defineProperty(curMemoryArea.type_getter, "name", {value: "get type",configurable: true,});
// type
curMemoryArea.type_setter = function type(val) {
    this._type = val; 
    this.jsdomMemory.type = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'type', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.type_setter);
Object.defineProperty(curMemoryArea.type_setter, "name", {value: "set type",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "type", {get: curMemoryArea.type_getter,set: curMemoryArea.type_setter,enumerable: true,configurable: true,});
curMemoryArea.type_smart_getter = function type() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._type !== undefined ? this._type : this.jsdomMemory.type; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'type', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.type_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("type", curMemoryArea.type_smart_getter);

// noModule
curMemoryArea.noModule_getter = function noModule() { debugger; }; mframe.safefunction(curMemoryArea.noModule_getter);
Object.defineProperty(curMemoryArea.noModule_getter, "name", {value: "get noModule",configurable: true,});
// noModule
curMemoryArea.noModule_setter = function noModule(val) {
    this._noModule = val; 
    this.jsdomMemory.noModule = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'noModule', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.noModule_setter);
Object.defineProperty(curMemoryArea.noModule_setter, "name", {value: "set noModule",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "noModule", {get: curMemoryArea.noModule_getter,set: curMemoryArea.noModule_setter,enumerable: true,configurable: true,});
curMemoryArea.noModule_smart_getter = function noModule() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._noModule !== undefined ? this._noModule : this.jsdomMemory.noModule; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'noModule', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.noModule_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("noModule", curMemoryArea.noModule_smart_getter);

// charset
curMemoryArea.charset_getter = function charset() { debugger; }; mframe.safefunction(curMemoryArea.charset_getter);
Object.defineProperty(curMemoryArea.charset_getter, "name", {value: "get charset",configurable: true,});
// charset
curMemoryArea.charset_setter = function charset(val) {
    this._charset = val; 
    this.jsdomMemory.charset = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'charset', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.charset_setter);
Object.defineProperty(curMemoryArea.charset_setter, "name", {value: "set charset",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "charset", {get: curMemoryArea.charset_getter,set: curMemoryArea.charset_setter,enumerable: true,configurable: true,});
curMemoryArea.charset_smart_getter = function charset() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._charset !== undefined ? this._charset : this.jsdomMemory.charset; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'charset', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.charset_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("charset", curMemoryArea.charset_smart_getter);

// async
curMemoryArea.async_getter = function async() { debugger; }; mframe.safefunction(curMemoryArea.async_getter);
Object.defineProperty(curMemoryArea.async_getter, "name", {value: "get async",configurable: true,});
// async
curMemoryArea.async_setter = function async(val) {
    this._async = val; 
    this.jsdomMemory.async = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'async', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.async_setter);
Object.defineProperty(curMemoryArea.async_setter, "name", {value: "set async",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "async", {get: curMemoryArea.async_getter,set: curMemoryArea.async_setter,enumerable: true,configurable: true,});
curMemoryArea.async_smart_getter = function async() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._async !== undefined ? this._async : this.jsdomMemory.async; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'async', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.async_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("async", curMemoryArea.async_smart_getter);

// defer
curMemoryArea.defer_getter = function defer() { debugger; }; mframe.safefunction(curMemoryArea.defer_getter);
Object.defineProperty(curMemoryArea.defer_getter, "name", {value: "get defer",configurable: true,});
// defer
curMemoryArea.defer_setter = function defer(val) {
    this._defer = val; 
    this.jsdomMemory.defer = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'defer', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.defer_setter);
Object.defineProperty(curMemoryArea.defer_setter, "name", {value: "set defer",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "defer", {get: curMemoryArea.defer_getter,set: curMemoryArea.defer_setter,enumerable: true,configurable: true,});
curMemoryArea.defer_smart_getter = function defer() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._defer !== undefined ? this._defer : this.jsdomMemory.defer; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'defer', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.defer_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("defer", curMemoryArea.defer_smart_getter);

// crossOrigin
curMemoryArea.crossOrigin_getter = function crossOrigin() { debugger; }; mframe.safefunction(curMemoryArea.crossOrigin_getter);
Object.defineProperty(curMemoryArea.crossOrigin_getter, "name", {value: "get crossOrigin",configurable: true,});
// crossOrigin
curMemoryArea.crossOrigin_setter = function crossOrigin(val) {
    this._crossOrigin = val; 
    this.jsdomMemory.crossOrigin = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'crossOrigin', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.crossOrigin_setter);
Object.defineProperty(curMemoryArea.crossOrigin_setter, "name", {value: "set crossOrigin",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "crossOrigin", {get: curMemoryArea.crossOrigin_getter,set: curMemoryArea.crossOrigin_setter,enumerable: true,configurable: true,});
curMemoryArea.crossOrigin_smart_getter = function crossOrigin() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._crossOrigin !== undefined ? this._crossOrigin : this.jsdomMemory.crossOrigin; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'crossOrigin', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.crossOrigin_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("crossOrigin", curMemoryArea.crossOrigin_smart_getter);

// text
curMemoryArea.text_getter = function text() { debugger; }; mframe.safefunction(curMemoryArea.text_getter);
Object.defineProperty(curMemoryArea.text_getter, "name", {value: "get text",configurable: true,});
// text
curMemoryArea.text_setter = function text(val) {
    this._text = val; 
    this.jsdomMemory.text = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'text', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.text_setter);
Object.defineProperty(curMemoryArea.text_setter, "name", {value: "set text",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "text", {get: curMemoryArea.text_getter,set: curMemoryArea.text_setter,enumerable: true,configurable: true,});
curMemoryArea.text_smart_getter = function text() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._text !== undefined ? this._text : this.jsdomMemory.text; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'text', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.text_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("text", curMemoryArea.text_smart_getter);

// referrerPolicy
curMemoryArea.referrerPolicy_getter = function referrerPolicy() { debugger; }; mframe.safefunction(curMemoryArea.referrerPolicy_getter);
Object.defineProperty(curMemoryArea.referrerPolicy_getter, "name", {value: "get referrerPolicy",configurable: true,});
// referrerPolicy
curMemoryArea.referrerPolicy_setter = function referrerPolicy(val) {
    this._referrerPolicy = val; 
    this.jsdomMemory.referrerPolicy = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'referrerPolicy', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.referrerPolicy_setter);
Object.defineProperty(curMemoryArea.referrerPolicy_setter, "name", {value: "set referrerPolicy",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "referrerPolicy", {get: curMemoryArea.referrerPolicy_getter,set: curMemoryArea.referrerPolicy_setter,enumerable: true,configurable: true,});
curMemoryArea.referrerPolicy_smart_getter = function referrerPolicy() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._referrerPolicy !== undefined ? this._referrerPolicy : this.jsdomMemory.referrerPolicy; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'referrerPolicy', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.referrerPolicy_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("referrerPolicy", curMemoryArea.referrerPolicy_smart_getter);

// fetchPriority
curMemoryArea.fetchPriority_getter = function fetchPriority() { debugger; }; mframe.safefunction(curMemoryArea.fetchPriority_getter);
Object.defineProperty(curMemoryArea.fetchPriority_getter, "name", {value: "get fetchPriority",configurable: true,});
// fetchPriority
curMemoryArea.fetchPriority_setter = function fetchPriority(val) {
    this._fetchPriority = val; 
    this.jsdomMemory.fetchPriority = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'fetchPriority', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.fetchPriority_setter);
Object.defineProperty(curMemoryArea.fetchPriority_setter, "name", {value: "set fetchPriority",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "fetchPriority", {get: curMemoryArea.fetchPriority_getter,set: curMemoryArea.fetchPriority_setter,enumerable: true,configurable: true,});
curMemoryArea.fetchPriority_smart_getter = function fetchPriority() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._fetchPriority !== undefined ? this._fetchPriority : this.jsdomMemory.fetchPriority; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'fetchPriority', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.fetchPriority_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("fetchPriority", curMemoryArea.fetchPriority_smart_getter);

// event
curMemoryArea.event_getter = function event() { debugger; }; mframe.safefunction(curMemoryArea.event_getter);
Object.defineProperty(curMemoryArea.event_getter, "name", {value: "get event",configurable: true,});
// event
curMemoryArea.event_setter = function event(val) {
    this._event = val; 
    this.jsdomMemory.event = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'event', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.event_setter);
Object.defineProperty(curMemoryArea.event_setter, "name", {value: "set event",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "event", {get: curMemoryArea.event_getter,set: curMemoryArea.event_setter,enumerable: true,configurable: true,});
curMemoryArea.event_smart_getter = function event() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._event !== undefined ? this._event : this.jsdomMemory.event; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'event', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.event_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("event", curMemoryArea.event_smart_getter);

// htmlFor
curMemoryArea.htmlFor_getter = function htmlFor() { debugger; }; mframe.safefunction(curMemoryArea.htmlFor_getter);
Object.defineProperty(curMemoryArea.htmlFor_getter, "name", {value: "get htmlFor",configurable: true,});
// htmlFor
curMemoryArea.htmlFor_setter = function htmlFor(val) {
    this._htmlFor = val; 
    this.jsdomMemory.htmlFor = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'htmlFor', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.htmlFor_setter);
Object.defineProperty(curMemoryArea.htmlFor_setter, "name", {value: "set htmlFor",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "htmlFor", {get: curMemoryArea.htmlFor_getter,set: curMemoryArea.htmlFor_setter,enumerable: true,configurable: true,});
curMemoryArea.htmlFor_smart_getter = function htmlFor() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._htmlFor !== undefined ? this._htmlFor : this.jsdomMemory.htmlFor; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'htmlFor', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.htmlFor_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("htmlFor", curMemoryArea.htmlFor_smart_getter);

// integrity
curMemoryArea.integrity_getter = function integrity() { debugger; }; mframe.safefunction(curMemoryArea.integrity_getter);
Object.defineProperty(curMemoryArea.integrity_getter, "name", {value: "get integrity",configurable: true,});
// integrity
curMemoryArea.integrity_setter = function integrity(val) {
    this._integrity = val; 
    this.jsdomMemory.integrity = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'integrity', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.integrity_setter);
Object.defineProperty(curMemoryArea.integrity_setter, "name", {value: "set integrity",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "integrity", {get: curMemoryArea.integrity_getter,set: curMemoryArea.integrity_setter,enumerable: true,configurable: true,});
curMemoryArea.integrity_smart_getter = function integrity() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._integrity !== undefined ? this._integrity : this.jsdomMemory.integrity; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'integrity', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.integrity_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("integrity", curMemoryArea.integrity_smart_getter);

// blocking
curMemoryArea.blocking_getter = function blocking() { debugger; }; mframe.safefunction(curMemoryArea.blocking_getter);
Object.defineProperty(curMemoryArea.blocking_getter, "name", {value: "get blocking",configurable: true,});
// blocking
curMemoryArea.blocking_setter = function blocking(val) {
    this._blocking = val; 
    this.jsdomMemory.blocking = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'blocking', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.blocking_setter);
Object.defineProperty(curMemoryArea.blocking_setter, "name", {value: "set blocking",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "blocking", {get: curMemoryArea.blocking_getter,set: curMemoryArea.blocking_setter,enumerable: true,configurable: true,});
curMemoryArea.blocking_smart_getter = function blocking() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._blocking !== undefined ? this._blocking : this.jsdomMemory.blocking; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'blocking', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.blocking_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("blocking", curMemoryArea.blocking_smart_getter);

// attributionSrc
curMemoryArea.attributionSrc_getter = function attributionSrc() { debugger; }; mframe.safefunction(curMemoryArea.attributionSrc_getter);
Object.defineProperty(curMemoryArea.attributionSrc_getter, "name", {value: "get attributionSrc",configurable: true,});
// attributionSrc
curMemoryArea.attributionSrc_setter = function attributionSrc(val) {
    this._attributionSrc = val; 
    this.jsdomMemory.attributionSrc = val; 
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'attributionSrc', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.attributionSrc_setter);
Object.defineProperty(curMemoryArea.attributionSrc_setter, "name", {value: "set attributionSrc",configurable: true,});
Object.defineProperty(HTMLScriptElement.prototype, "attributionSrc", {get: curMemoryArea.attributionSrc_getter,set: curMemoryArea.attributionSrc_setter,enumerable: true,configurable: true,});
curMemoryArea.attributionSrc_smart_getter = function attributionSrc() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._attributionSrc !== undefined ? this._attributionSrc : this.jsdomMemory.attributionSrc; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLScriptElement', propertyName: 'attributionSrc', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.attributionSrc_smart_getter);
HTMLScriptElement.prototype.__defineGetter__("attributionSrc", curMemoryArea.attributionSrc_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================


///////////////////////////////////////////////////

HTMLScriptElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['script'] = function () {
    var script = new (function () { });
    script.__proto__ = HTMLScriptElement.prototype;

    //////////{HTMLScriptElement 特有的 属性/方法}//////////////
    // 无,都是从父类继承的
    /////////////////////////////////////////////////////
    return script;
}
var HTMLCanvasElement = function () {
    debugger;
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLCanvasElement);

Object.defineProperties(HTMLCanvasElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLCanvasElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.HTMLCanvasElement = {};

//============== Constant START ==================
Object.defineProperty(HTMLCanvasElement, "arguments", { configurable: false, enumerable: false, value: null, writable: false, });
Object.defineProperty(HTMLCanvasElement, "caller", { configurable: false, enumerable: false, value: null, writable: false, });
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// width
curMemoryArea.width_getter = function width() { debugger; }; mframe.safefunction(curMemoryArea.width_getter);
Object.defineProperty(curMemoryArea.width_getter, "name", {value: "get width",configurable: true,});
// width
curMemoryArea.width_setter = function width(val) {
    this._width = val; 
    this.jsdomMemory.width = val; 
    mframe.log({ flag: 'property', className: 'HTMLCanvasElement', propertyName: 'width', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.width_setter);
Object.defineProperty(curMemoryArea.width_setter, "name", {value: "set width",configurable: true,});
Object.defineProperty(HTMLCanvasElement.prototype, "width", {get: curMemoryArea.width_getter,set: curMemoryArea.width_setter,enumerable: true,configurable: true,});
curMemoryArea.width_smart_getter = function width() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._width !== undefined ? this._width : this.jsdomMemory.width; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLCanvasElement', propertyName: 'width', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.width_smart_getter);
HTMLCanvasElement.prototype.__defineGetter__("width", curMemoryArea.width_smart_getter);

// height
curMemoryArea.height_getter = function height() { debugger; }; mframe.safefunction(curMemoryArea.height_getter);
Object.defineProperty(curMemoryArea.height_getter, "name", {value: "get height",configurable: true,});
// height
curMemoryArea.height_setter = function height(val) {
    this._height = val; 
    this.jsdomMemory.height = val; 
    mframe.log({ flag: 'property', className: 'HTMLCanvasElement', propertyName: 'height', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.height_setter);
Object.defineProperty(curMemoryArea.height_setter, "name", {value: "set height",configurable: true,});
Object.defineProperty(HTMLCanvasElement.prototype, "height", {get: curMemoryArea.height_getter,set: curMemoryArea.height_setter,enumerable: true,configurable: true,});
curMemoryArea.height_smart_getter = function height() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this._height !== undefined ? this._height : this.jsdomMemory.height; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'HTMLCanvasElement', propertyName: 'height', method: 'get', val: res }); 
    return res; 
}; mframe.safefunction(curMemoryArea.height_smart_getter);
HTMLCanvasElement.prototype.__defineGetter__("height", curMemoryArea.height_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLCanvasElement.prototype["captureStream"] = function captureStream() {
    var res = this.jsdomMemory["captureStream"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'captureStream', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["captureStream"]);
HTMLCanvasElement.prototype["getContext"] = function getContext() {
    var res = this.jsdomMemory["getContext"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'getContext', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["getContext"]);
HTMLCanvasElement.prototype["toBlob"] = function toBlob() {
    var res = this.jsdomMemory["toBlob"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'toBlob', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["toBlob"]);
HTMLCanvasElement.prototype["toDataURL"] = function toDataURL() {
    var res = this.jsdomMemory["toDataURL"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'toDataURL', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["toDataURL"]);
HTMLCanvasElement.prototype["transferControlToOffscreen"] = function transferControlToOffscreen() {
    var res = this.jsdomMemory["transferControlToOffscreen"](...arguments);
    mframe.log({ flag: 'function', className: 'HTMLCanvasElement', methodName: 'transferControlToOffscreen', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(HTMLCanvasElement.prototype["transferControlToOffscreen"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////
HTMLCanvasElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['canvas'] = function () {
    var canvas = new (function () { });
    canvas.__proto__ = HTMLCanvasElement.prototype;

    //////////{HTMLCanvasElement 特有的 属性/方法}//////////////

    /////////////////////////////////////////////////////
    return canvas;
}
var HTMLHeadElement = function () {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(HTMLHeadElement);

Object.defineProperties(HTMLHeadElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHeadElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////
HTMLHeadElement.__proto__ = HTMLElement;
HTMLHeadElement.prototype.__proto__ = HTMLElement.prototype;


mframe.memory.htmlelements['head'] = function () {
    var head = new (function () { });
    head.__proto__ = HTMLHeadElement.prototype;

    //////////{HTMLHeadElement 特有的 属性/方法}//////////////

    /////////////////////////////////////////////////////
    return head;
}
var HTMLBodyElement = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLBodyElement);

Object.defineProperties(HTMLBodyElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLBodyElement",
        configurable: true,
    }
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////
HTMLBodyElement.__proto__ = HTMLElement;
HTMLBodyElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['body'] = function () {
    var body = new (function () { });
    body.__proto__ = HTMLBodyElement.prototype;

    return body;
}
var HTMLHtmlElement = function HTMLHtmlElement() {
    throw new TypeError('Illegal constructor');
}; mframe.safefunction(HTMLHtmlElement)

Object.defineProperties(HTMLHtmlElement.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLHtmlElement",
        configurable: true,
    }
})


//////////////////////////////////
var curMemoryArea = mframe.memory.HTMLHtmlElement = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// version
curMemoryArea.version_getter = function version() { return this._version; }; mframe.safefunction(curMemoryArea.version_getter);
Object.defineProperty(curMemoryArea.version_getter, "name", { value: "get version", configurable: true, });
// version
curMemoryArea.version_setter = function version(val) { 
    this.jsdomMemory.version = val; 
    mframe.log({ flag: 'property', className: 'HTMLHtmlElement', propertyName: 'version', method: 'set', val: val });
}; mframe.safefunction(curMemoryArea.version_setter);
Object.defineProperty(curMemoryArea.version_setter, "name", { value: "set version", configurable: true, });
Object.defineProperty(HTMLHtmlElement.prototype, "version", { get: curMemoryArea.version_getter, set: curMemoryArea.version_setter, enumerable: true, configurable: true, });
curMemoryArea.version_smart_getter = function version() {
    var res = this.jsdomMemory.version;
    mframe.log({ flag: 'property', className: 'HTMLHtmlElement', propertyName: 'version', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.version_smart_getter);
HTMLHtmlElement.prototype.__defineGetter__("version", curMemoryArea.version_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
//==============↑↑Function END↑↑====================
//////////////////////////////////

HTMLHtmlElement.__proto__ = HTMLElement;
HTMLHtmlElement.prototype.__proto__ = HTMLElement.prototype;

mframe.memory.htmlelements['html'] = function () {
    var html = new (function () { }); // new一个假的,通过换原型,换为HTMLMetaElement去实现
    html.__proto__ = HTMLHtmlElement.prototype;
    return html;
}

var HTMLDocument = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLDocument);

Object.defineProperties(HTMLDocument.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLDocument",
        configurable: true,
    }
});
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////



// 如果调用 mframe.memory.htmlelements['document'], 就返回 HTMLDocument
mframe.memory.htmlelements['document'] = function () {
    var document = new (function () { }); // new一个假的,通过换原型,换为HTMLDocument去实现
    HTMLDocument.prototype.__proto__ = Document.prototype;
    document.__proto__ = HTMLDocument.prototype;

    //////////{HTMLDocument特有的 属性/方法}//////////////
    //////////////////////////////////////////////////////
    return document;
}
var Document = function () { }; mframe.safefunction(Document);

Object.defineProperties(Document.prototype, {
    [Symbol.toStringTag]: {
        value: "Document",
        configurable: true,
    }
});

Document.prototype.__proto__ = Node.prototype
document = mframe.memory.htmlelements['document'](); // 小document
///////////////////////////////////////////////////
var curMemoryArea = mframe.memory.Document = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================


//%%%%%%% Attribute START %%%%%%%%%%
// body
curMemoryArea.body_getter = function body() { debugger; }; mframe.safefunction(curMemoryArea.body_getter);
Object.defineProperty(curMemoryArea.body_getter, "name", { value: "get body", configurable: true, });
// body
curMemoryArea.body_setter = function body(val) {
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'body', method: 'set', val: val });
    return mframe.memory.jsdom.document.body = val;
}; mframe.safefunction(curMemoryArea.body_setter);
Object.defineProperty(curMemoryArea.body_setter, "name", { value: "set body", configurable: true, });
Object.defineProperty(Document.prototype, "body", { get: curMemoryArea.body_getter, set: curMemoryArea.body_setter, enumerable: true, configurable: true, });
curMemoryArea.body_smart_getter = function body() {
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error(); // 如果是实例访问,返回undefined
    // 确保单例
    if (mframe.memory.body) {
        var res = mframe.memory.body
    } else {
        mframe.memory.body = mframe.memory.htmlelements['body'](); // 不能调用createElement的,会返回代理的
        mframe.memory.body.jsdomMemory = mframe.jsdomProxy(mframe.memory.jsdom.document.body);
        var res = mframe.memory.body;
    }
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'body', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.body_smart_getter);
Document.prototype.__defineGetter__("body", curMemoryArea.body_smart_getter);

// head
curMemoryArea.head_getter = function head() { debugger; }; mframe.safefunction(curMemoryArea.head_getter);
Object.defineProperty(curMemoryArea.head_getter, "name", { value: "get head", configurable: true, });
Object.defineProperty(Document.prototype, "head", { get: curMemoryArea.head_getter, enumerable: true, configurable: true, });
curMemoryArea.head_smart_getter = function head() {
    if (this.constructor && this === this.constructor.prototype) return undefined; // 如果是实例访问,返回undefined
    // 确保单例
    if (mframe.memory.head) {
        var res = mframe.memory.head
    }
    else {
        mframe.memory.head = mframe.memory.htmlelements['head'](); // 不能调用createElement的,会返回代理的
        mframe.memory.head.jsdomMemory = mframe.jsdomProxy(mframe.memory.jsdom.document.head);
        var res = mframe.proxy(mframe.memory.head);
    }
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'head', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.head_smart_getter);
Document.prototype.__defineGetter__("head", curMemoryArea.head_smart_getter);



//cookie
curMemoryArea.cookie_getter = function cookie() { debugger; }; mframe.safefunction(curMemoryArea.cookie_getter);
Object.defineProperty(curMemoryArea.cookie_getter, "name", { value: "get cookie", configurable: true, });
// cookie
curMemoryArea.cookie_setter = function cookie(val) {
    curMemoryArea.cookie = val;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'cookie', method: 'set', val: curMemoryArea.cookie });
    return curMemoryArea.cookie;
}; mframe.safefunction(curMemoryArea.cookie_setter);
Object.defineProperty(curMemoryArea.cookie_setter, "name", { value: "set cookie", configurable: true, });
Object.defineProperty(Document.prototype, "cookie", { get: curMemoryArea.cookie_getter, set: curMemoryArea.cookie_setter, enumerable: true, configurable: true, });
curMemoryArea.cookie_smart_getter = function cookie() {
    if (this.constructor && this === this.constructor.prototype) throw mframe.memory.get_invocation_error();
    var res = curMemoryArea.cookie || "";
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'cookie', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.cookie_smart_getter);
Document.prototype.__defineGetter__("cookie", curMemoryArea.cookie_smart_getter);

// visibilityState
curMemoryArea.visibilityState_getter = function visibilityState() { return this._visibilityState; }; mframe.safefunction(curMemoryArea.visibilityState_getter);
Object.defineProperty(curMemoryArea.visibilityState_getter, "name", { value: "get visibilityState", configurable: true, });
Object.defineProperty(Document.prototype, "visibilityState", { get: curMemoryArea.visibilityState_getter, enumerable: true, configurable: true, });
curMemoryArea.visibilityState_smart_getter = function visibilityState() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    
    var res = 'hidden';
    // var res = 'prerender';
    // var res = 'visible';
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'visibilityState', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.visibilityState_smart_getter);
Document.prototype.__defineGetter__("visibilityState", curMemoryArea.visibilityState_smart_getter);

// documentElement
curMemoryArea.documentElement_getter = function documentElement() { return this._documentElement; }; mframe.safefunction(curMemoryArea.documentElement_getter);
Object.defineProperty(curMemoryArea.documentElement_getter, "name", { value: "get documentElement", configurable: true, });
Object.defineProperty(Document.prototype, "documentElement", { get: curMemoryArea.documentElement_getter, enumerable: true, configurable: true, });
curMemoryArea.documentElement_smart_getter = function documentElement() {
    var res = document.createElement("html");
    res.jsdomMemory = mframe.memory.jsdom.document.documentElement;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'documentElement', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.documentElement_smart_getter);
Document.prototype.__defineGetter__("documentElement", curMemoryArea.documentElement_smart_getter);


//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%

//============== Function START ====================
// createElement
Document.prototype["createElement"] = function createElement(tagName) {
    // STEP1:清洗标签名称
    var tagName = tagName.toLowerCase() + ""; // +""是因为null需要解析为"null"
    // STEP2:创建我们的自定义元素
    var htmlElement;
    if (mframe.memory.htmlelements[tagName] == undefined) {
        console.log(`\x1b[31m==>createElement缺少==>${tagName}\x1b[0m`);
        debugger;
        htmlElement = {}; // 创建一个基础元素
        htmlElement.__proto__ = HTMLElement.prototype;
    } else {
        htmlElement = mframe.memory.htmlelements[tagName](); // 如果有直接创建
    }
    // STEP3:jsdomMemory域存储jsdom创建的元素
    if (mframe.memory.jsdom.document) {
        // 使用JSDOM创建真实DOM元素
        var jsdomXXXElement = mframe.memory.jsdom.document.createElement(...arguments);
        htmlElement.jsdomMemory = mframe.jsdomProxy(jsdomXXXElement)
    }
    mframe.log({ flag: 'function', className: 'Document', methodName: 'createElement', inputVal: arguments, res: htmlElement });
    return mframe.proxy(htmlElement);
}; mframe.safefunction(Document.prototype["createElement"]);


Document.prototype["getElementById"] = function getElementById() {
    var res = mframe.memory.jsdom.document.getElementById(...arguments);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'getElementById', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["getElementById"]);

Document.prototype["getElementsByTagName"] = function getElementsByTagName() {
    // 这个方法返回是tageName为name的所有标签, 是返回数组, so我们要代理这个数组中的所有对象
    var elements = mframe.memory.jsdom.document.getElementsByTagName(...arguments);
    var res = mframe.memory.htmlelements['collection'](elements);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'getElementsByTagName', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Document.prototype["getElementsByTagName"]);

Document.prototype["createExpression"] = function createExpression() {
    var res = mframe.memory.jsdom.document.createExpression(...arguments);
    mframe.log({ flag: 'function', className: 'Document', methodName: 'createExpression', inputVal: arguments, res: res });
    Object.defineProperty(res, "ttt", {
        value: "ttttt_name", // 属性值
        writable: true, // 是否可修改
        enumerable: true, // 是否可枚举
        configurable: true // 是否可配置
    });
    var tt= mframe.proxy(res);
    return tt;
}; mframe.safefunction(Document.prototype["createExpression"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////


///////////////////////////////////////////////////

document = mframe.proxy(document) // 代理


var curMemoryArea = mframe.memory.HTMLCollection = {};
var HTMLCollection = function () {
    throw new TypeError('Illegal constructor')
}; mframe.safefunction(HTMLCollection);

// 迭代器
mframe.memory.HTMLCollection.iterator = function values() {
    return {
        next: function () {
            if (this.index_ == undefined) {
                this.index_ = 0;
            }
            var tmp = this.self_[this.index_];
            this.index_ += 1;
            return { value: tmp, done: tmp == undefined };
        },
        self_: this
    }
}; mframe.safefunction(mframe.memory.HTMLCollection.iterator);

Object.defineProperties(HTMLCollection.prototype, {
    [Symbol.toStringTag]: {
        value: "HTMLCollection",
        configurable: true,
    },
    [Symbol.iterator]: {
        value: mframe.memory.HTMLCollection.iterator,
        configurable: true
    },
});
////////////////////////////////////////////////////////// 2025年4月11日 更新
var curMemoryArea = mframe.memory.HTMLCollection = {};

//============== Constant START ==================
//==============↑↑Constant END↑↑==================

//%%%%%%% Attribute START %%%%%
// length
curMemoryArea.length_getter = function length() { return this._length; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(HTMLCollection.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    if (mframe.memory.jsdom.document) { return this.jsdomMemory.length; }
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    return this._length !== undefined ? this._length : ''; // 返回实例属性或默认值
}; mframe.safefunction(curMemoryArea.length_smart_getter);
HTMLCollection.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);

//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
HTMLCollection.prototype["item"] = function item() { debugger; }; mframe.safefunction(HTMLCollection.prototype["item"]);
HTMLCollection.prototype["namedItem"] = function namedItem() { debugger; }; mframe.safefunction(HTMLCollection.prototype["namedItem"]);
//==============↑↑Function END↑↑====================
//////////////////////////////////////////////////////////

/**
 * 创建并返回一个代理后的HTMLCollection数组，其中每个DOM元素都通过mframe.proxy进行了代理。
 * @param {jsdom.HTMLCollection} initCollection 通过jsdom.document.getElementByXXX()获取的HTMLCollection。
 * @returns {Array} 返回代理后的DOM元素数组。
 * @description
 * 注意一：initCollection中的对象都是jsdom的对象，没有原型链。因此需要通过document.createElement(i.tagName)创建后再放入collection中。
 * 注意二：需要同时更新原型存在的属性和原型不存在的属性，例如 `<script type="text/javascript" r='m'>` 中的 `type`（原型有的属性）和 `r`（原型没有的属性）。
 * @example
 * var elements = mframe.memory.jsdom.document.getElementsByTagName(name); // elements是jsdom的HTMLCollection
 * return mframe.memory.htmlelements['collection'](elements);              // 展示如何调用
 * @private
 * 不能在document.createElement时调用，因为这不是页面的任何一个标签，只能算是DOM的中间件。
 */
mframe.memory.htmlelements['collection'] = function (initCollection) {

    // 暂时关闭输出打印,避免影响判断(下面要用set进行数据转移)
    var originalConsole = console; // 保存原始console对象
    console = { log: function () { }, warn: function () { }, error: function () { } }; // 替换为空实现
    // 创建HTMLCollection实例
    var collection = new (function () { });
    // 代理数组中的元素+将数组中原jsdom的数据,变为我们有原型链仿照的数据
    for (let i = 0; i < initCollection.length; i++) {
        // 创建 具有原型链的数据
        collection[i] = document.createElement(initCollection[i].tagName);
        // 1.原型没有的属性也要有
        for (var attr of initCollection[i].attributes) {
            collection[i][attr.name] = attr.value;
            collection[i].setAttribute(attr.name, attr.value); // 都要设置, !!!! 巨坑,找了2天
        }
        // 2.原型有的属性要有
        for (var name of Object.getOwnPropertyNames(collection[i].__proto__)) {
            if (name === "constructor" || typeof initCollection[i][name] === 'function' || name === '__proto__')
                continue;
            collection[i].setAttribute(name, initCollection[i][name]); // TODO 其实如果是DOM元素,都需要这一行,后面踩坑再说吧 2025年4月11日23:46:54
            collection[i][name] = initCollection[i][name];
        }
        // 覆写原来的jsdom域
        collection[i].jsdomMemory = initCollection[i];
    }
    collection['length'] = initCollection.length;
    // HTMLCollection原型链继承
    collection.__proto__ = HTMLCollection.prototype;
    console = originalConsole; // 恢复原始console对象

    // 二次代理
    for (let i = 0; i < collection.length; i++) {
        collection[i] = mframe.proxy(collection[i]);
    }

    return mframe.proxy(collection);
}
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
//=====================================以下为运行代码===============================
debugger;
////////////////ENV//////////////////////////////
console.log("start!!!!");

///////////////////////////////
window.setTimeout = function () { }
window.setInterval = function () { }
window.ActiveXObject = undefined;
window.outerWidth = 2046
window.outerHeight = 1150
window.innerHeight = 150
window.innerWidth = 2048
// window.orientation = 'landscape'
window.name = '$_YWTU=45LgQNyyOJOTsZyzqZAmEjrzERGSF.m0Na3e3epD2Ga&$_YVTX=WG&vdFm='
window.chrome = {
    "app": {
        "isInstalled": false,
        "InstallState": {
            "DISABLED": "disabled",
            "INSTALLED": "installed",
            "NOT_INSTALLED": "not_installed"
        },
        "RunningState": {
            "CANNOT_RUN": "cannot_run",
            "READY_TO_RUN": "ready_to_run",
            "RUNNING": "running"
        }
    }
}
// navigator.battery=undefined;
window.webkitRequestFileSystem = function webkitRequestFileSystem() {
    mframe.log({ flag: 'function', className: 'window', methodName: 'webkitRequestFileSystem', inputVal: arguments, res: res });
}; mframe.safefunction(window["webkitRequestFileSystem"]);

localStorage['$_YVTX']= "WG";
localStorage['$_YWTU']= "45LgQNyyOJOTsZyzqZAmEjrzERGSF.m0Na3e3epD2Ga";
sessionStorage['$_YVTX']= "WG";
sessionStorage['$_YWTU']= "45LgQNyyOJOTsZyzqZAmEjrzERGSF.m0Na3e3epD2Ga";
localStorage['_$rc']= "BkvyNUJT5jLzKCG1EKGSdqC8yOWXxTFN0bHKLlWM_XeXHJgmhLhf7iHM2J2qiOCXB4AdXigAJQjYQf7nAOxzfq_0Xbox.Yk53muGxEiKyJL992JjxUxsDT7COABfBT0xnmTVYeAhraXut0wgo6Nr3e8xdpAJnH3YYg7RIwbTIm1nNcglcCZuaDVorfP7IE7GN.msF7P7jmGmrilRCdxM_WiU.YVjUzxNj3.9u7AUFGqaPiOADHfJ6JxPcQ1zzG90zfdB_YoMEI6cAlN2YhP8Tb_lnq16_lFJBgM6EueLSpntJyUiiC7nP2dLfXVlrPME4pGPTRe7oCzfXAgkia4t5R5CmsOX4oHZ1FJ5XplGa4qUeWL031vyFyGYAUWN0PrEpY1oA4w8zQROVRai8Sh1Cb746Ubu6DYGjWHXRGlYiIBfVAJsJ..zyYRoAJmYbNoX.kA3BAhjqLeW9.aaSHq7MteaEcdsdDL_Mth2MTmTux91XAZK_EkfYUg30OMfSTpz6lRop76HaOQAHv41JS9Axamxo7_GU2fdZXYgk4EJma4XY2Xjdf0iGFyLsKZyBK5ioIEn_ODylVRL3JTMnv77Zt4P6dZmKyj7Xcdg9gu.iAhMOayCSMymJCv.oMLH7igJw6n98VGUKj.f_t3qxVYSZpidkI.pvk6GGgzUyBl5LlJYKTyhtb9e0rL1lnwSGPVsEr44sjzPxxvWNPWKISuyplcjjPcajRdBk6.NEMKqN0Kcucr3kdZfAcJnktKt7wY4qjCbTq";


// delete(require)
delete global;
delete Buffer;
delete require;
delete process;
require = undefined;


// hook JSON
// JSONHook.js - 自执行函数版本
(function() {
    // 保存原始方法引用
    const originalStringify = JSON.stringify;
    const originalParse = JSON.parse;
    
    // 简单的日志格式化
    function truncate(value, maxLength = 100) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        
        let str = typeof value === 'object' ? 
            (function() {
                try { return originalStringify(value); } 
                catch(e) { return `[${value}]`; }
            })() : String(value);
            
        return str.length > maxLength ? 
            str.substring(0, maxLength) + '...' : str;
    }
    
    // 重写JSON.stringify
    JSON.stringify = function() {
        // console.log(`[JSONHook] stringify被调用，参数: ${truncate(arguments[0])}`);
        
        try {
            const result = originalStringify.apply(this, arguments);
            // console.log(`[JSONHook] stringify返回: ${truncate(result)}`);
            return result;
        } catch(e) {
            // console.error(`[JSONHook] stringify错误: ${e.message}`);
            throw e;
        }
    };
    
    // 重写JSON.parse
    JSON.parse = function() {
        console.log(`[JSONHook] parse被调用，输入: ${truncate(arguments[0])}`);
        
        try {
            const result = originalParse.apply(this, arguments);
            console.log(`[JSONHook] parse返回: ${typeof result === 'object' ? 
                (Array.isArray(result) ? `Array[${result.length}]` : `Object{${Object.keys(result).join(', ')}}`) : 
                result}`);
            return result;
        } catch(e) {
            console.error(`[JSONHook] parse错误: ${e.message}`);
            throw e;
        }
    };
    
    console.log('[JSONHook] JSON methods已被hook');
})();


//代理 
// 代理器封装
function get_enviroment(proxy_array) {
    for (var i = 0; i < proxy_array.length; i++) {
        handler = '{\n' +
            '    get: function(target, property, receiver) {\n' +
            '        console.log("方法:", "get  ", "对象:", ' +
            '"' + proxy_array[i] + '" ,' +
            '"  属性:", property, ' +
            '"  属性类型:", ' + 'typeof property, ' +
            // '"  属性值:", ' + 'target[property], ' +
            '"  属性值类型:", typeof target[property]);\n' +
            // 'if (typeof target[property] == "undefined"){debugger}' +
            '        return target[property];\n' +
            '    },\n' +
            '    set: function(target, property, value, receiver) {\n' +
            '        console.log("方法:", "set  ", "对象:", ' +
            '"' + proxy_array[i] + '" ,' +
            '"  属性:", property, ' +
            '"  属性类型:", ' + 'typeof property, ' +
            // '"  属性值:", ' + 'target[property], ' +
            '"  属性值类型:", typeof target[property]);\n' +
            '        return Reflect.set(...arguments);\n' +
            '    }\n' +
            '}'
        eval('try{\n' + proxy_array[i] + ';\n'
            + proxy_array[i] + '=new Proxy(' + proxy_array[i] + ', ' + handler + ')}catch (e) {\n' + proxy_array[i] + '={};\n'
            + proxy_array[i] + '=new Proxy(' + proxy_array[i] + ', ' + handler + ')}')
    }
}

proxy_array = ['window', 'document', 'location', 'navigator', 'history', 'screen'];

get_enviroment(proxy_array);








//////////////////////////////////////////////////

//ts_begin
$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=68002;$_ts.cd="qJpErfAltcqqlSLmEqWsDGA8qcqrEq3sJPqcrGVGqSWFrcqDlSLkEqVsoqE6rpqErcE8qk99c1qDrGg8qcqlEqVsJfgqEqWGqrWaoGqGrO99m1QAcAAwoGqGqnqclu3GqpWFqPqllSLmoG3GqPqklu3Gqrqtrc3GqfWQqSgqi1AhoGqyxqa8qcqqxGlsJPqorGVGqfWFqnqqEqQOlq7lDSgqEq3GrSWCoGqbr1qclu38qcqqEqlsJPqDmGalDrgqEqEGqSWCoGqGq13Dlu3GrpWFqPqclcnFqs3SqGVSJRLu5FqCbIqFBavy9dpxsc50PTurfKjk2XDkIAoiED65E6dFnkfSU.1wg.CMHA1UEcNlqqAuraQrbnabD22Zx15BRorxJ2eeKwyn3OS1wUJmLORbwDW2HY.rWnavEc7CWjf8U19GtYy3e6JsUuwtQ0UtpuffpvgSWjSQpnQgUmaSzPlPtsWnHTuohnE.UYfKUz2MKYTLYmebZONuK9m2pOI4EsN8KsQ.E4GBWOpIKP7OjOxLK2zqU6Um1lex1DpPAXzzp0xSAcV4aYGat1q2tucXJYT3hPV6s_e_8OmMQ2JvSKevwKR3J9CPJox0EkTQKjLBEPQXJOAaSTg7xuJDQTBpFsrjJ6J7wJxSQvwfA2TgSUEPHT2QJnCgE1a0WuwFUh3fWUS7skJBjDmXYomuQK.OK2rAw2pz3hGyKTgntnVOzOpwKcg2J1dcpDJQsoptwwSbVmY7MowmeuwlpcqeUmjjhnEvhOE6UWQBEOQCQsJydDzSRD9nsUo1Mv2HVbrAYw0fi2yRJn7OXcZTWmeFtniLM0pEVDrpiHSEQmetwCyxLOJJFoNbxsBrKkqNEcV.JQw8hcQaQK2KjK21YDr0Wl.yRsQnW9zBReYPEOeRUkQzXcl7HkzFKPCgWkm0slzhV5znMbrSwvrO4C7yY92zpPiGKm7ThPV2hF7uW2fItnVn.2w6FlLu36IVY9mwWoJ1FWN7sDxuxsTFasW7xnq.WuUoUPavWsytYdpTM9RwMCyVgvzpKOA0Amk6QPEdKYa6hMGfhkanK2LzXkriV6Y.Wbkg8KeaAogS1ir7WlT43D3OLmfMJ1g2x1CXiTT3hPV0Mdyuw0e4YKmmgurHWuYAwC_LYvp0EkTQKjLBEPQXJsYQSnZPWKNWAVUc1TfEYsZCQWexQ0zjU9aC5nl_U296tnighulSWTNFhMG6wUYYV9pPe9frA2YV1mBA3U90JlpDE_r3KuVXx1VzjuxwKcg2W6XP1nyX19zL8ZxMFmxm3lyJn0muRcqeUmjjhnEvhO3CW7w8hcQ6RoJ0noNAFDy2W0BaWbRbpVx2VZ2PEOeRUkQzXcl7Jkq6K2nCEsYCK0N6pXNy89xKAOwl6vpoV6xxtVcgiYz8WP72E43nJsRIKP7O.mW0wmpGH0ky3kRY8ow88irBU6JqRPV4aYGat1q2tuiNU20NEkmViFLawuSDA9y406q6HmwdFDHAQClvimSQWM3fEP94J2NQzPlCVmw5FCiPMCx6K9EdAdwbKVTOsn2DXk2MUOE.x1iCJkR3Un72Jdy2FCylMuJaZ09S3olu3UKz3smPAnVeK7luhcQGtuE6STg7xup.JvUgplRDAVyS1X2D39y0WKxu_bEPHT2QJnCgE1anJYNFhMG0wUe4VK2Je9ACIo3TwovO8KTDKvmbE_r3KuVXx1Vzju3aKmZ.xsbBV9LaM9rs3ieBWV9aAlJ9nVSHHlV2HY.rWnavEc7aJQw8hcQ_sTmJTo70RbzIHCP7slZ0Y0mX3dxlEOeRUkQzXcl7JkEaK2nCEsfCibpOJzr4VUpUM9yuuV2c3D2IQ9cgiYz8WP72E43nJkTIKP7OLvNJY2NHF2s8pkpDF9p6VwYoVbmtAcV4aYGat1q2tucXWYT3hPYDK8L4F0TuJ0Nb5lRtQKwYYV4mWDScEkTQKjLBEPQXJOATSTg7x0JdwuvXY6x7QlJ7Q8SuYVStps304lEPHT2QJnCgE1a6J2NFhMfriUR.1lJhuOxzVYR8MUs5VoxHRTpDE_r3KuVXx1Vz.OrwKcg2pK6gYOfBWOwEJeScQlyW1mTn_vNoAPqeUmjjhnEvhOgSUWQBE9RDQkpm4YWaJVVCp2hji2eWWVfTQX7fi2yRJn7OXcZSWkwFKPCgAopFpVeAKHQSACxmAuRh49erHKwWRPiGKm7ThPV2hF76JTfItnYmusNhUVew1Oswi9SEAlf2sXysJ6SkxsTFasW7xnq.JYuohnxrQKpOYIT7pbfzF0YC.vVTWYpVH2UwEsN8KsQ.E4GBJOxIKP7O6C90pTY9IusqYKYZFTTWQ7SLFlNaRPV4aYGat1q2tuPXU20NElx.A_zmMYeuRbZTCTRfWKeEWDXzYUlvimSQWM3fEP9uJumQSnZPAu76ROsZhK2p3lzwiQy7FDQTFUr.5nl_U296tnighuVnUTL.EeSmK9JGWvyEn0etpTxBWDkn86R9YK32iZm3Wc9Gx17ajkxwKcg2AUs4F9NQskAS8e3SwKTwtKeNTOR1wcqeUmjjhnEvhO3TJWw8hcwmwkm8u9Nj3lSNF2IxwDfAFOY188yPEOeRUkQzXcl7J2eFtnH1Vb2AKn2cW_2aVCSzRlrqTYAXMbSDxsBrKkqNEcV.J_N8U19GsTJTdKl63vpGI0OVFDYpF6TrRefsA1QgUmaSzPlPtsWCWmuohnxJYmyzsjy1wmmEAOgy.Yp9AKqCQ6owEsN8KsQ.E4GBWs30K2LzXlzFV2NKFshZV6r0FmeCWHxcQoSUwD3OLmfMJ1g2x1COJ2T3hPYHRB2M1DGawVrbauzTAVpr16has2RlEkTQKjLBEPQXJO3gSTg7x0NBV2h.3OYcp6pwV5SViKSrA99gTlAPHT2QJnCgE1auWTNFhMfhMuRNKkYoeTzNITJGVlKzJTNkADSqE_r3KuVXx1VzLOJwKcg2s6IwMowqsOY3Vzru3CzVQ0m2uUwgRcqeUmjjhnEvhOVnUWQBE9SwUKRAuDrJs9eNKl1XiTWZMCy1VI7fi2yRJn7OXcZSHmeFtnHsMoQnFkeuRIYcWDGaFVN4_bmbWCzDxsBrKkqNEcV.Wjf8U19Gssla6CfAJvx2M0i7hsfhibNpFHfKpnQgUmaSzPlPtsWdK2nCEVNYA0JjY5yXFTZuYVJ90vxCHYRcICcgiYz8WP72E43nUYGXxVTOeOxEMbyBMm4XplNrQVN5JJmRFvAGHYSFjPZPxngdJYuohnxiJ6ecW4pCQkS9FKzPumwmFUYDFuM.EsN8KsQ.E4GBWs3nK2LzXlGywvzeAvoxwbwP82YfMie7RmJq3v3OLmfMJ1g2x1C7iTT3hPYWAZ2fYnzwWTJP60fOJYTcU0dUR0SlEkTQKjLBEPQXJOYQSnZP1sRbI0bXMvNxFoQ6179np0Jt1vet_nl_U296tnighulaWmNFhMfH3CzTsDJpzD3ypm3CFOk5MC0aFVNCE_r3KuVXx1VzLuzwKcg21sUOwUphsOyaVwf9JTRiVDG06Kl6wcqeUmjjhnEvhOlnUWQBE9zAWc9B09xlATwqpVK01C3TWUTr8i7fi2yRJn7OXcZuWTeFtnHY3lmc3CesFixKQPzOJCTvSUrKIVJqxsBrKkqNEcV.WtS8U19G1DNGdULCwCmEVC.IA9JBM9yLhZ24Q1QgUmaSzPlPtsq6K2nCEYrHskYUReYLVumuWOmhTvNgA02Cs9cgiYz8WP72E43nJmfItnYpabGyWDejscdNFo2VFKztwJSVVbSkxsTFasW7xnq.JOiOU20NEmww3HgSpvw0MKm0avRrw2fCV0Pj8VlvimSQWM3fEP9uW2NQzPmAwUYbpYInWVzWRbY2MQJLVTNjWoxGXk2MUOE.x1iCJsR3Un72VJybMvpfMVRq5CR.JbV6JoHnh1yHp1VeK7luhcQGtuwQSnZPYly7Y0IcJ6YnwYYDFFzcVC2XQbET5nl_U296tnighulTi2NFhMfpJvmgUVVuCl2IAmN2YvIyAmYwFOmqE_r3KuVXx1VzLOrwKcg2Ylvz1kWZsbYcw57_3TwiWYpiaoN.pcqeUmjjhnEvhO36WQw8hcwp16xWelS1V9Sz3CvW3smeKCxj8ewPEOeRUkQzXcl7WsYFKPCgVmxNROxGKHR6FYpYJYJRevY7MVyspPiGKm7ThPV2hFEnUYGXxYp1_omJQYfWA9dns0zksKxfwWyNYlAGHYSFjPZPxngdH2uohnxKYDypi8yWUTNnpK2suswBFUwsQYB.EsN8KsQ.E4GBWsQCK2LzXmwr3m3dJ9vj8VR0KCyTQdJrpOaSVVqOLmfMJ1g2x1CXJ2T3hPYs1Q2hAvJAQ200nKRmKvwtpDMdKsm9EkTQKjLBEPQXJkpQSnZPVYT3MbHXADyPJuJOQJSt12x4Flpg_nl_U296tnighulCWYNFhMfKY6SkJCZSelRL1lfPUKsa3meJ1oeCE_r3KuVXx1Vzjuq6KmZ.xYsgKOYoKkJdMjxiiYY4QmlyduRkMVV2HY.rWnavEc7aWQw8hcwU30Lyj0zD1VytAYhVwUYIsTR1YtTcEOeRUkQzXcl7HkrFKPCgYvRaA0NLRzJuYCmqWbVn_bmRM2WNAciGKm7ThPV2hF7uJYfItnYU5TJsVYmfU6MzsoRnVDNmYBztRbykxsTFasW7xnq.HOhoUPavYomLQHx.MYa_W0Yb0bRNFVR9AbIqAPEdKYa6hMGfhkAuWYNQzPmUJTYrpOMzQlla8OwDRWE0WVwiQlJqXk2MUOE.x1iCWOw3Un72Yj2mQoVT1lxngTVnporHUuvAwme7QnVeK7luhcQGtuqnSTg7xTYGUCUeMVprMC7NMHWaKmxUU0RbjKEPHT2QJnCgE1a0WueFUh3fKlxsMUr2uVLTQ9YlQYBBY0JKJkx8QhGyKTgntnVOzOL6KmZ.xYvpM0NNVCTx8wr0WDy6ssyOLupsK9V2HY.rWnavEc70iQw8hcwF30Nnzkm610YGH0vass9a3TZ0YFycEOeRUkQzXcl7Jk35K2nCEY2HJK7CQiJn3VzA3smczmRCU02YpVFgiYz8WP72E43CiYfItnY3Zurj1UN312IBJbyS10eDMZTmAbTmxsTFasW7xnq.JO1zU20NEmy7QJmaioxmtYwzLbeLFYf2VovBM0lvimSQWM3fEP96K2LzXm2JM0Yns0USAvRzpbWCYH2PRCmkUV3OLmfMJ1g2x1C.Wsw3Un72K5e08OwTsuyKzlxKAsYBsmv3puwCQnVeK7luhcQGtu3ujmywt1r33UFO12xc3lxaJHGzFkmYAKf14vRSxufQUkDCE1ENJOmFUh3f31zXFDWnjTpSIUpaQb8BsUxEAsxHQhGyKTgntnVOzOEuKmZ.xKkyYCxbhDScQzxf1CEaU2An.9ztplV2HY.rWnavEc7nWZw8hcwGsKmu09mEMnS0QmInQu3n16waW.pnEOeRUkQzXcl7JupFKPCg3UVaiCJjsHwqYCN2IUYOnU7TICrtAciGKm7ThPV2hFECUYGXxKAy5TrIFvxcIVOPwbmZJleVK_yMVKAGHYSFjPZPxngSJmuohnxbKTwC1jJ9QVTuF0mvgD2NIl2BWVvMEsN8KsQ.E4GBWs34K2LzXDrgp6wA3luhY9zOpCZNJi24AUwsp9qOLmfMJ1g2x1C.JuJ3Un72RFTRM9m9WoY7ZYJ.HDenR2vkYsJCQnVeK7luhcQGtuqaSTg7xCRHFUkAK62DUUrDKQycF0y6JTxTdUEPHT2QJnCgE1aeJYNFhMfv1Vwup9rc5DfCYCGd19OTY9RDsmJDE_r3KuVXx1VzjuWyKmZ.xKUGMUNHQvejM_2rs2TgJKroaCSN30W2HY.rWnavEc70iWw8hcwvp9pz46wYpvxXI0HqAVwkhmGuwBTlEOeRUkQzXcl7JkWTK2nCEKYU1KL5wjNiRD0T3DAy.022QbNKwbcgiYz8WP72E430W2fItnY9u9mI3KY3HC6mF0RbJOx9JZ7zK9JuxsTFasW7xnq.JOcBU20NEDmkYdqCMsxbAlmC_YmtpPSIWuHaRKlvimSQWM3fEP9TW2NQzPmbUUYsYshXUoxkRlRsR8xhRkSLWlJaXk2MUOE.x1iCWOqSUTL.EdSQFuS3pmrA.6pSpbR63OHAWDJiRv32iZm3Wc9Gx17TjTywt1rfw6KORbmrQ0fjpFzWY0TipsrJ5YSrxufQUkDCE1ENJupFUh3fRvRmJYxL.VTiUYJdtVv1W9NkW9JDAhGyKTgntnVOzOEnWTeFtnHnWDNbpKyn3dQnATxlpOrHa9RgF0rDxsBrKkqNEcV.JFJ8U19GM0fuZD2NY6x6YOI8RkfkKCJDQZzhQ1QgUmaSzPlPtsWnWYuohnxzK0VapdmU8srtQlyP0CYAUKJ9VCuMEsN8KsQ.E4GBWslCK2LzXDzytnS7V2MTQufswmTBFeTtsVeTKlqOLmfMJ1g2x1C.WkY3Un72FJJXVUVS32wJ_2zDFKRtQl_Li0RSAnVeK7luhcQGtu3SjYywt1rzY0MQRvpa10YC88x7RbrxUUro4C2rxufQUkDCE1ENiOeFUh3fF2YjHClSjl3yY0fTYoswp9zV8CATQhGyKTgntnVOzOqTKmZ.xKBJpYwrsTJzJZJE3CfmWYpke9fywlW2HY.rWnavEc7TJ7w8hcwNsOJn6kNms0VdIbkuF9NwsVVCF8zcEOeRUkQzXcl7WuzFKPCgFl2dF9p5UXWSp0T2JV9CzlAXFvr2pPiGKm7ThPV2hFaSUYGXxKShukJfF2ptwbXLWTxSVoJhFMAasVEGHYSFjPZPxngTH2uohnxXY20617ZCRvJa302t0DYosDzBwb64EsN8KsQ.E4GBWuxIKP7Oe9YjYlRTAuMaKYxIVVZ6JdSqJUrrRPV4aYGat1q2tucXJ2T3hPYNY5rhR6x9F0SEeDmX1OxLVK.0pDy0EkTQKjLBEPQXJOETSTg7xC0uIVk78TN6sc9u1IR9wlyswmYp_9APHT2QJnCgE1aCJ2NFhMf7ileCw9fSZCR.sbwmHTOY3kw73lNDE_r3KuVXx1VzjuQaKmZ.xK_Os9To1CfIQQYAilzYFoy7euLuMDW2HY.rWnavEc7TiQw8hcwzYswHgkmtIsJTW2hP3VTkMVYJ8dynEOeRUkQzXcl7HmeFtnHTKvpoWopTWewLsmZTIVN0joxmF6YqxsBrKkqNEcV.WtG4UYGXxKfLgmJDp6wmMm4YMufrwkp3MwwbYlEGHYSFjPZPxngdWYuohnxj82ys3z2z8sw0V0miCuziITRaA0I4EsN8KsQ.E4GBJkwIKP7O_9wUUkJYsTH8MTeVYkwnM4pDAux_wPV4aYGat1q2tubXU20NEoReR7ei8K0TAkxKdbxCAVw53mUCUDlvimSQWM3fEP9THTNQzPmnUopCWV6j8bJPwlfshZys1KGusvpDXk2MUOE.x1iCJYT3hPY0J5rDM9TzF6yjZlw2JVgNQ0h7sUY9EkTQKjLBEPQXJkRQSnZPwbeU1C.kQDwXKmQdJ5SpQYN2FlT261l_U296tnighulTWTNFhMfaw6Z6wVy4CYwaAOxJU9BqW2NvQ02DE_r3KuVXx1VzjsJwKcg2QTHgJDxVJCANY8TJsYVaMUR44C22RcqeUmjjhnEvhOEuUWQBEvmKAuezZbwcMkmTYbd6i22FMOx0AJ7fi2yRJn7OXcZTJmeFtnHXF2m0Qo0TFHeyUumbRDeC56AuJ6mbxsBrKkqNEcV.Wt76UYGXxUxxnnTERmJEITvQsTZSJCy8J.paJ0EGHYSFjPZPxngdK2nCEUYhYleDV5Jv1YNbAOATnCpVQsRH3DcgiYz8WP72E43nJspIKP7O46pOHsJtJ0c.smNaJ6w1w7x1MbyuAcV4aYGat1q2tucLWmT3hPYSYeRCwCSlJmx1_CeEMORt3V4nwlzlEkTQKjLBEPQXWkyQSnZPQ2NWM9HEpkxkY0m7szYGsbZStVf2Cnl_U296tnighulTUTL.E5T4A2Y7V0Euj1TKQYTGVvXLMsYd3V32iZm3Wc9Gx176.2ywt1rdQThSJ0G682puMd2fQuA7YmpM6CNrxufQUkDCE1ENJOwFUh3f817nA6RBa9mbM2NtpOOIYuJI8kRrp.GyKTgntnVOzOESJmeFtnHOVb2aQoE5F_fQ12m.sOySnkzaHmRbxsBrKkqNEcV.Jtx8U19GIYY4.klgYsYcWDK7ssV.RuxuRtzAA1QgUmaSzPlPtsW0HTuoIPS.wCz.hQm3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UhR3Wc27QbzzzbTTFKg.FUsCMnS.wCz.UWw8cGAjVVYpnC2zVVQZAsUt8bJcMoZZ35gaYCT0QvQ_uY2hYCG5Q9_fpUf1wYWSV80gpOwAY6x2.lAyAb2KHoO6woYDKTgTpJzRYkyvUYRS5CR61of11OPfWCfVRkYdp_2nF9TLtsQ0juRfWCANMUtfQuwuQDJXpW2vW6eLtsQ0juRfWCANMUtfQvmEW2m6MeS.3YrktsQ0juRfWCANMUtfM2RNQoR7wJ2rKYYYtKTnLsN0IC2CY6Uhw62tiOanJZyuRbT2302Ra9E4QKpdVkh4JOYiJCmsiXa4YvSxMm3g6K2j31a6WOcB3OROhDT0iX7u1vRpW9eLgDS0wna6WOcB3OROhDT0i.AuJsA6ROmvzD2uH9Nn3mok3VeJ80fAs_lnACquJ9fk5KzfR07oraDMWaqlWaQsF8y6Qo3gJsEg.OA0WsE6WOXXJuWmrkQnWtePJGVrJOlubG9SJsVuWkPjJuW6qGqdWjWSJuVCrSwISqez7msxitTWufvv7gNOq3jxOzY41TpTqatFrGEcrAFwqnkzOu9k8P2CcmPp4gz3wsoNGe25V1Mn_Q1J4hjl5z8W6GVEJOVnjkEuHk70WaDMWGqHWuquJt7aisqnJqQjdVmYFl3u1uM3VomAMDSHhZemJVw_A2lnesxVW02kFmXzM9Z6YUpr3BJFYGVcra3TbGEarAWarBjz81S93CA.3HwShDpSFPzG4DL7RCJ7tCH4wnSvM6Q.3dJzhD3XRDROzbruwPy9wo8C3DeLhbp6QMRv3UlX3CzzzbwBRPyOFoKCRCeb8PzP8IZBRKNCtCmz5nebFKl.3K40hCRjwPzfMBp6hDxbR1zbZCV73vG.3DvThCfNQPzBQ8LBFomftCyPe1eNFC7.MbdZhC2.Q1zXQBVBFv3XMKRuzb2a3PyzwCsehCNCMK9.FdzT312XMbVzebSvtKebwn66FbANM6QuhIwu312BWC3ze6WutKe63c66Fo3NMCfOhIw7wP2BMbLze6JatKe0MP66QCYPhbf2F4R7360XFDrbzbS7RnyLFC1CMopOhvw5h8N_3n2nRvAz_bpztUx6FP6jQ6WNQvwuh8NvRP2nw6JyzvJX3Py6MbtCQCS7hvw0RMRnFKWXwvJyzvmftUrjt6H4MPS6M6m2h8fbRn2a3vAz_owbtUrbw16NMcSC3D7.QBS4hoRTRPzn4KV7wvpGt6hOQcSS36V.wIzyhom.31zTZCYbtURLwUHdMUANwveuh8y6RP20wDWz4orutUp0Qc678CANwKffR4R0MCJ9J1zCe6V7Qbebt6M4w1SnQvA.8IfXhoTnFPzyevq7IKy0In6PQDaN8bN.h8qB8bSntCRSZ1eaFKz0Qn6uQClmqGQkU.y2VGVDKcJzeqWlKPRPQAD8Ucp91AQmJtGkqOASra3abGESrAEoraDFqaqmrul6WFLuqqq0HuQSjqWqrAlCJsQ";if($_ts.lcd)$_ts.lcd();
//ts_end
if($_ts.cd){

    (function(_$lC,_$bh){var _$fN=0;function _$dP(){var _$iV=[21];Array.prototype.push.apply(_$iV,arguments);return _$aD.apply(this,_$iV);}function _$g9(_$fL){return _$dP;function _$dP(){_$fL=0x3d3f*(_$fL&0xFFFF)+0x269ec3;return _$fL;}}function _$gb(_$dP,_$_n){var _$d9,_$_j,_$eZ; !_$_n?_$_n=_$ft:0,_$d9=_$dP.length;while(_$d9>1)_$d9-- ,_$eZ=_$_n()%_$d9,_$_j=_$dP[_$d9],_$dP[_$d9]=_$dP[_$eZ],_$dP[_$eZ]=_$_j;function _$ft(){return Math.floor(_$dh()*0xFFFFFFFF);}}var _$_n,_$d9,_$$V,_$$n,_$cJ,_$gL,_$cn,_$dh,_$hl,_$jl;var _$$3,_$$F,_$hq=_$fN,_$$$=_$bh[0];while(1){_$$F=_$$$[_$hq++];if(_$$F<12){if(_$$F<4){if(_$$F===0){_$$V=[4,16,64,256,1024,4096,16384,65536];}else if(_$$F===1){return;}else if(_$$F===2){_$$3=_$jl;}else{_$jl=_$cJ['$_ts'];}}else if(_$$F<8){if(_$$F===4){_$$3= !_$hl;}else if(_$$F===5){_$jl.lcd=_$dP;}else if(_$$F===6){_$cJ=window,_$gL=String,_$cn=Array,_$_n=document,_$dh=Math.random,_$d9=Math.round,_$hl=Date;}else{_$hq+=2;}}else{if(_$$F===8){ !_$$3?_$hq+=0:0;}else if(_$$F===9){_$aD(21);}else if(_$$F===10){_$jl=_$cJ['$_ts']={};}else{ !_$$3?_$hq+=2:0;}}}else ;}
    
    
    function _$aD(_$cP,_$c9,_$hn){function _$dP(){var _$jj=[73];Array.prototype.push.apply(_$jj,arguments);return _$bv.apply(this,_$jj);}function _$ff(){return _$_9.charCodeAt(_$kz++ );}function _$_R(_$dP,_$_n){var _$d9,_$_j;_$d9=_$dP.length,_$d9-=1;for(_$_j=0;_$_j<_$d9;_$_j+=2)_$_n.push(_$dI[_$dP[_$_j]],_$bz[_$dP[_$_j+1]]);_$_n.push(_$dI[_$dP[_$d9]]);}function _$iF(){return'\x74\x6f\x53\x74\x72\x69\x6e\x67';}var _$_n,_$d9,_$_j,_$eZ,_$ft,_$fN,_$hq,_$$3,_$iV,_$$F,_$$$,_$hH,_$ad,_$gF,_$ah,_$ax,_$$r,_$bz,_$hK,_$_9,_$aB,_$kz,_$iQ,_$_z,_$dI;var _$$z,_$$X,_$bP=_$cP,_$ar=_$bh[1];while(1){_$$X=_$ar[_$bP++];if(_$$X<100){if(_$$X<64){if(_$$X<16){if(_$$X<4){if(_$$X===0){_$ft=_$ff();}else if(_$$X===1){_$bP+=2;}else if(_$$X===2){_$$z= !_$dI;}else{ !_$$z?_$bP+=0:0;}}else if(_$$X<8){if(_$$X===4){return;}else if(_$$X===5){_$$z= !_$d9;}else if(_$$X===6){_$iV=[];}else{_$iQ=_$ff();}}else if(_$$X<12){if(_$$X===8){_$d9[1]=_$bz;}else if(_$$X===9){_$ad=_$g9(_$ax);}else if(_$$X===10){_$d9[0]="brqb`u~ktd`~ookx`]`sdrs`<`f`rokhs`enql`trdq@fdms`rokhbd`gdhfgs`WLKGssoQdptdrs`(`rkhbd`~oodmcBghkc`b~kk`sxod`#`cnbtldmsDkdldms`bnmb~s`[`~`nmbkhbj`rtalhs`otrg`+`bnnjhd`gqde`hmcdwNe`vhcsg`&`knb~shnm`s~qfds`rsqhmf`9`bqd~sdDkdldms`rds@ssqhatsd`l~sbg`fds@ssqhatsd`bg~qBncd@s`kdmfsg`snRsqhmf`~bshnm`qdronmrdSdws`nmkn~c`s~fM~ld`ancx`nodm`m~ld`nmrtalhs`etmbshnm`inhm`>`qd~cxRs~sd`Z`qdok~bd`*<`~ccDudmsKhrsdmdq`oqnsnsxod`rbqhos`naidbs`mtladq`rs~str`-`heq~ld`rd~qbg`eqnlBg~qBncd`rsxkd`rds`z`rdmc`bnmrsqtbsnq`bkhbj`~rxmb`|`@bshudWNaidbs`eknnq`DudmsS~qfds`hmots`knb~kRsnq~fd`o~sgm~ld`nmqd~cxrs~sdbg~mfd`oqnsnbnk`nmdqqnq`rtarsq`cnbtldms`:`/`.`DjbO`~ar`)`ghccdm`sno`0`qntmc`\"`tmcdehmdc`mncdSxod`qdronmrd`chu`gd~cdqr`ono`dwdb`o~qrd`atssnm`bg~q@s`qdlnudBghkc`fdsDkdldmsAxHc`qdronmrdSxod`dudms`hmmdqGSLK`nmshldnts` eqnl `gssor9`fds`mncdM~ld`rpqs`o~qdmsMncd`qdlnudDudmsKhrsdmdq`VdaRnbjds`du~k`dwsdqm~k`eqnl`sdws`fdsNvmOqnodqsxCdrbqhosnqr`gsso9``rbqddm`jdxBncd`q`dmbsxod`shld`ldrr~fd`ldsgnc`332`1`gnrsm~ld`#nmrtalhs`$_XUSW`hlonqs`nmkn~cdmc`i~u~rbqhos9`odqenql~mbd`~rrhfm`c~s~r,sr`l~sbgLdch~`bnmsdms`fdsShld`%`shldRs~lo`sgdm`L~sg`nmkn~crs~qs`rs~strSdws`snKnvdqB~rd`rs~bj`fdsDkdldmsrAxS~fM~ld`nmoqnfqdrr`hmcdwdcCA`nm~anqs`GSLKEnqlDkdldms`rtarsqhmf`#gqde`g~rNvmOqnodqsx`7/`Qdptdrs`a~rd`GSLKFdmdqhbDkdldms`rgnvLnc~kCh~knf`dA76aB/`l~w`..`qdronmrdWLK`q~mcnl`oee/`ghrsnqx`rdsHmsdqu~k`h`#rqb`rdsShldnts`bknmdMncd`lntrdlnud`b~mOk~xSxod`jdxcnvm`mnv`{` ~r `Dkdldms`qdrtks`w`[\\q\\m>({[\\q>\\m(`onqs`;`khmj`Gd~cdqr`rsqhmfhex`b~mchc~sd`neerdsVhcsg`etmbshnm `lntrdcnvm`neerdsGdhfgs`$_sr`Lhbqnrnes-WLKGSSO`oe~/`gnrs`qdok~bdRs~sd`ONRS`sntbgdmc`Etmbshnm`WLKGssoQdptdrsDudmsS~qfds`rsnoOqno~f~shnm`___SR___`bkd~qHmsdqu~k`=`kn~c`bsk`edsbg`uhrhahkhsx`ntsdqGSLK`i~u~rbqhos9 unhc[/(:`LhbqnLdrrdmfdq`hr@qq~x`_`rdsHsdl`uhcdn`k__`nqhdms~shnm`nmrtbbdrr`noshnmr`hl~fd`x`ldch~Cduhbdr`qdst`rxlank`rdke`Qdronmrd,Sxod`bknrd`hmsdqm~k`enmsr`fdsAntmchmfBkhdmsQdbs`~tchn`a`,`bdhk`oea1_/`$a_b~kkG~mckdq`: Rdbtqd`annkd~m`cdrbqhoshnm`l~sbgdr`l`$_mc`#~bshnm`onrs`shldYnmd`fdsRg~cdqOqdbhrhnmEnql~s`qhfgs`bnknqCdosg`~mbgnq`sntbglnud`#rd~qbg`hrM~M`eq~ldr`oea/`oec/`~bnr`snFLSRsqhmf`#u~ktd`fd`Ldch~Rsqd~lSq~bj`~ssqhatsdr`cde~tks ` <<<= `#nmbkhbj`*`__#bk~rrSxod`mD`anssnl`qvb/`q~chn`nudqqhcdLhldSxod`rs`a0@d0E3~`irnm`jdxto`e~/,`kdes`Zm~shud bncd]`~ookhb~shnm.w,vvv,enql,tqkdmbncdc`$a_rdsto`b~sbg`vqhsd`mtlHsdlr`drb~od`rg~cdqRntqbd`$MVD4MyQjXiglXyL3`~u~hkGdhfgs`neerdsSno`~v~hs`lntrdto`~ookhb~shnm.wlk`jdxr` <<= `~ss~bgDudms`bnlohkdRg~cdq`fdsHsdl`o~qdmsDkdldms`neerdsKdes`lds~`oqdkn~c`oqdudmsCde~tks`~anqs`ptdqxRdkdbsnq`fdsQdronmrdGd~cdq`FdsU~qh~akd`sdws.ok~hm`b~kkdq`fdsNvmOqnodqsxCdrbqhosnq`rdrrhnmRsnq~fd`bqxosn`#hmmdqGSLK`ntsdqVhcsg`g~rg`b~mbdkAtaakd`bnms~hmr`~ss~bgRg~cdq`b`knb~kCdrbqhoshnm`uhrt~kUhdvonqs`xd~q`dwdbRbqhos`(+ dwodbsdc `qdbdhudq `etmbshnm nodm[( z Zm~shud bncd] |`ohwdkCdosg`neerdsW`rbqddmX`hsdlRhyd`Tmdwodbsdc sdlok~sd rsqhmf dmchmf`rdsQdptdrsGd~cdq`~k`bg~qfhmfShld`o~qrdEqnlRsqhmf`o~qrdHms`neerdsX`bkd~q`rnqs`dmbnchmf`sntbgrs~qs`Oqnlhrd`dmtldq~sdCduhbdr`sqxz`nq`~kog~`$0_CHU`~u~hkVhcsg`Znaidbs @qq~x]`bqd~sdRg~cdq`EQ@FLDMS_RG@CDQ`bgdbjanw`naidbsRsnqdM~ldr`ud`oed/`qdstqmU~ktd`qdstqm:`hmmdqGdhfgs`;chu=HD7;.chu=`bqdcdmsh~kr`<<dmc<<`onv`ucEl`snToodqB~rd`mtkk`hmmdqVhcsg`_$qb`fdsRntqbdr`qv~/`lnmsg`rbqddmW`ads~`knb~kd`b~kdmc~q`: dwohqdr<`neerdsTmhenql`$`'`nvmdqDkdldms`kh`@i~w qdronmrd ancx cdbqxoshnm e~hkdc , `Fds@kkQdronmrdGd~cdqr`qva/`[sghr+ ~qftldmsrZ/](:`////`eq~bshnm~kRdbnmcChfhsr`gsso9..`qdstqm mdv ~[`~ccAdg~uhnq`~ccdcMncdr`@QQ@X_ATEEDQ`rs~sd`$a_ok~senql`cduhbdOhwdkQ~shn`}`naidbsRsnqd`c`bghkcKhrs`mtladqhmfRxrsdl`Tmdwodbsdc snjdm `tqk`qdf`CNLO~qrdq`~u~hkSno`qtm`2id@KdRr~5`udqsdwOnr@ssqha`#ntsdqGSLK`UDQSDW_RG@CDQ`[^\\r)({[\\r)$(`sq~mr~bshnm`$_XVST`GSLKNaidbsDkdldms`gssor9..`~u~hkKdes`~oodmc`rqbDkdldms`dfAss~dsxq`qdlnudHsdl`etmbshnm rdmc[( z Zm~shud bncd] |`oeb/`NudqqhcdLhldSxod`f~ll~`a~ssdqx`hbeb`qdlnud@ssqhatsd`dqqnq`Z/,8~,e@,E]`ax_o~sg`ntsdqGdhfgs`$alE/~WYkQlkUxTGI`c~x`#mncdU~ktd`rbqnkk`~ssqhatsdM~ld`b~ostqd`O`eq~ld`l4uuF`: R~ldRhsd<Mnmd`SJ_DWONQS`mqc n {'{nFfn kHd-m'b`+ cdbqxosdc RM9 `625055`Naidbs-HmidbsdcRbqhos-du~kt~sd`[~mx,gnudq`k{bbw`,,,,, vhmcnv_qdbs_1 ,,,,,`\\^Z$,~]y`~<b~mchc~sd9`(sha,12[ knqsmnB Wduhsb@ (ls[ndchUk~dQ-ndchUk~dQ`tmhenql1e`cdehmdOqnodqshdr`rdkdbsdc`bghkcqdm`525750615052635461`SJ_VGHKD`__`Lrwlk2-WLKGSSO`bxfI*`tluj||`@i~w qdronmrd ancx hr mns dmbqxosdc+ qdronmrd kdmfsg9 `U`__voq_bdqndcOqqd`qdronmrdAncx`vdm_vnke`SJ_B@RD`uhcdn.nff: bncdbr<\"sgdnq~\"{uhcdn.lo3: bncdbr<\"~ub0-31D/0D\"{uhcdn.vdal: bncdbr<\"uo7+ unqahr\"{uhcdn.lo3: bncdbr<\"lo3u-1/-7+ lo3~-3/-1\"{uhcdn.lo3: bncdbr<\"lo3u-1/-13/+ lo3~-3/-1\"{uhcdn.w,l~sqnrj~: bncdbr<\"sgdnq~+ unqahr\"`SJ_SQX`lr`k~rsHmcdw`@anqs`SJ_CDE@TKS`adg~uhnq`#~ss~bgDudms`#nqhfhm`SJ_DWSDMCR`65545d`ahmcAteedq`vhl~w`sdws.i~u~rbqhos`,,,,,,`52505d655062`df~rrdLcmdRmnk~s~j`LVkOx~qdN-WB`#cds~bgDudms`SJ_SDLOK@SD_MN_RTARSHSTSHNM`v.r.9`#rdsHmsdqu~k`mnhrdi+db~eqdsmH~u~I`~arnktsd`85`qnns`onors~sd`bg~qfhmf`wssdrAd~mkdh`@tch`dsgdqmds`kos~nelq`Okd~qx`nmtofq~cdmddcdc`cakbkhbj`ea}h?p}hn/`dkxsRkkhe`Lrwlk1-WLKGSSO-4-/`ehkdm~ld`tmhenqlNeerds`b.3051`sSq`hmrs~mbdne`dm~akd_`~ants9`kqt[jmhKcc~-vncmhv`sdwnsmBmssd`ms2`.hsrfnmm~e~hk`Ek~rg`4e4e5d585657635c506154`qr`cd`fdsOqnsnsxodNe`Z:&]`+ tqk9 `qdstqm ~Za][`qd`OCE`shldnts`mkf~ftd~`bkhdms ~ss~bj cdsdbsdc`dkhanL`udqsdw@ssqhaOnhmsdq`Lrwlk-WLKGSSO`hrEhmhsd`c~ab{qhp__peiakqp`RDMC`C~sdShldEnql~s`mdwsRhakhmf`snq`kqsBecO-ECO`56545d42585c645b5063543c5e6462543c5e6554`SJ_SDLOK@SD_LHCCKD`akq~`cn`dwonqs `~gok@swds`SJ_MTKKHRG`~kdqs`175e615856585d505b1b1/585d63546165505b4357615462575e5b5318`dwok`c~s~9`dqOq`fdsNvmOqnodqsxM~ldr`SJ_SGQNV`lntrdkd~ud`Lntrd`d-PbtjhlSdh`36505c546/5053`cc`SJ_DNE`c_`gsso,dpthu`kKwtLA@cy`?cdatffdq`nSq~bjKhrs+c`enql~shnm`52506/63525750415455615462571b52`bnnjhdDm~akdc`vdasjQhtddpErhsRkxddrls`#Rtalhs`mbdne Vhmcnv(:|b~sbg[d(z|`\netmbshnm @bshudWNaidbs[( z\n    Zm~shud bncd]\n|\n`mhftkOcdka~md`r~ud`__~mbgnq__`bcst`bnmsdwsldmt` gnrs `smdldkDxAdunLdrtnLds~ktlhRmdf`#qdlnudDudmsKhrsdmdq`\"ZD]\"`df_sqcf~d_dkdlsm_rch`555861543a54683465545d63`oo~`SJ_AQD@J_BNMSHMTD`oq~gRedb`enq `;NAIDBS`Bq`tqk[#cde~tks#trdqc~s~(`Gh`Hmsk`SJ_BNLL@`w,ov,fk~rr`B~`-@KJDK_K@`smdltbnc+qns~fhu~m+vncmhv`=sbdian.;=\"wo/\"<sgfhdg \"wo/\"<gschv \"a/dbca//~~//,17aa,eb00,4a78,807e/4/29chrkb\"<chrr~kb \"ij17aa\"<ch sbdian;`rdsKnb~kCdrbqhoshnm`\\Zmh~usbdn \\c]d`cnbtldms,eq~fldms`fdsTmhenqlKnb~shnm` mdv `LfrT_HMTP_D`42`#vqhsd`t@.Bnk0c}K~lbnk`hw`nbdrrHc`vnke_yb`B`vm dcnVkRdnadbsjq[kt`mnri.`$_bnmehf__-cds~hk__ *< 0`#bkd~q`<sqtd`#~rrhfm`Bg`IRNM`6/506162`kn~cdc`SJ_CDATFFDQ`\\q\\m>{Z\\t1/17\\t1/18]`5d58645c1c5465505b64506354`hr`ha`hs`~sdlmhgoknc+nemhmhgoknc+mhgoknc`ehqrsBghkc`s~bjSq~bd`fma`242123`Jdxan~qc`56545d34`ax_k~adk`mh`vdasjOhrdhqdrmsssnRfqd~`LR`mhnem_vd`o~Uoqdhrmn`;!,,`~mdl`acd_~rgqab_nhwdmqsbed~`udm`o~qrdqdqqnq`rghes`Lrwlk1-RdqudqWLKGSSO`q~amnhs`Y7WGi`o`fdsRtoonqsdcDwsdmrhnmr`smdu`cdehmdOqnodqsx`~ssqUdqsdw`~ookhb~shnm.w,i~u~rbqhos`q~{{bOtmyyq~tqmpOatmp{eOcu`SJ_@QQNV`qdrds`===<`dkrd `fdsO~q~ldsdq`SJ_HE`~s~cxw`rv9r..`~kohosbh~.nwmg,nrvb~j,uedrkg~`BoqsxdnxJhOq~`wkvj~`SJ_HM`SJ_U@Q`kdudk`k~xdqW`dwodqhldms~k,vdafk`585c5645505b58535063585e5d325e53543b5e505321`sj~~mkQnRtbmoqsh`HQTsmdltbnc+KQT+qdqqdedq+dtk~Udcnm+shlatrmn+KLSGqdstn+rdstahqss~+knbnsnqo+gr~g+sqno+dl~msrng+srng+dl~mgs~o+dtk~u+jbhkbmn+gbq~dr+bqr+mnhsb~+KLSGqdm`lrBqxosn`xknqq;j}y`sqhl`+o~Ro~bBmhkjb~+oobRm~nEtbNrst~+oobRm~dJCxvn+mo~Ro~bJmxdoT~+oobRm~dRcmdQkob~ldmd+so~Ro~bNmQm~dxcsRs~Bd~gfmQdod~kdbdlsm~+oobRm~nKc~~Gcmdk+qo~Ro~bOmf~Kd~ndc+co~Ro~bRmsd~OdfnKc~cd~+oobRm~hVcmvnnBmtBs~gfmcdH+imbd@soobRm~bRhqsoh+imbdds@coobRm~bRhqso` rqekw `iarbgdld9..ptdtd_g~r_ldrr~fd`SQH@MFKD_RSQHO`s~tk~ud_qduhqc__`ehm~kkx`cduhbdnqhdms~shnm`nk~bhsmng+dq+emh`SJ_ONRSEHW_NO`cdbncdTQHBnlonmdms`fds@kkQdronmrdGd~cdqr`dqcm`hrDwsdmcdc`o~fdWNeerds`;lds~\\r*gsso,dpthu<Z\"']>qdeqdrgZ\"']>\\r`k~xdqX`;DLADC hc<`CduhbdNqhdms~shnmDudms`dm`~dsqEl~+dslBsltsrlnRI`Tmdwodbsdc bg~q~bsdq9 `hJN:kcYJN:kc`l~dtrdqdSsw`[;NAIDBS(_CHU`/-/-/-/`SJ_SDLOK@SD_GD@C`rh`b1ri.mnqsbdkd`dq`bnnjhd chr~akdc`or_hngjncdl+ynm@lhs~nhRm~ssqhSdll+ynmHdcdwCc+AnlQypddtsrm@lhs~nhEm~qdl`526~385d5863`15`b~rd `tmrghes`udqsdwOnr@qq~x`rv`dc`xbmdqqtbmnBdq~vcq~g`rX`<vhm`#rgnvLnc~kCh~knf`te_m`GHFG_HMS`!mdv etmbshnm[(zdu~k[\"sghr-~<0\"(|[(-~`.9trdq_enmsr`rdkdbs,`g~mckdq`mnbHdu~E`mddqf`#knb~shnm`sL~t`Tmdwodbsdc snjdm9 `nqo`mnl`nodmdq`_rdke`kls`~bbdkdq~shnmHmbktchmfFq~uhsx`#qdlnud@ssqhatsd`Ekn~s21@qq~x`ehkdM~ld`bknmd`dm~akdUdqsdw@ssqha@qq~x`fdsQ~mcnlU~ktdr`drdk`qlnb`bkhdmsVhcsg`Qd`sEn`nbrto`Odqe`\\aZ^=])=[Z\\r\\R])>(;\\.`bg~qrds`qmthsdl`7352736301`vhmcnv`SJ_KHSDQ@K`SJ_SDLOK@SD_S@HK`srm~~cnkdm`6654515a58636558625851585b5863685257505d5654`GHFG_EKN@S`[~mx,onhmsdq`nemh_yb`O_`kjnrb`km~tff~rd`lnkcdt`qdrnkudcNoshnmr`~ookhb~shnm.i~u~rbqhos`o~qdms`afrntmc`cmhv[ mqtsdqzxqs`#qdlnudBghkc`Qdronmrd`k~nkaiNda b!s\"<t dmecdhcm&\"& x osed nmvch n!v\"<t dmecdhcm&\"& f k_~nkaiNda b<sv<h nmvc`bgdbjdc`#nodm`01`SJ_@RXMB`TBAqnvrdqBk~`SJ_RDLH_BNKNM`msHm`qdstqm `Zmn l~o]` hm `KNV_HMS`q~mfdLhm`}_5elenium_+Z[_4ecorderB_seleniumBcall5elenium`nmsntbgrs~qs`u2mil`Rsnq~fd`bkhdmsKdes`SJ_EQNL`qdchqdbsdc`vdajhsQSBOddqBnmmdbshnm`dfm~gbxshkhahrhuynl`eBRdqgo~`snlbonskdd`SJ_NODM_AQ@BJDS`^[>9\\cz0+2|[>9\\-{$((z3|`pnzr=nzrO srncdarbL ,- j`ZMn rtoonqs]`sdws~qd~`~xhmfek~f`GSLKDkdldms`q<'l'`o~fdXNeerds`uvlmzqvo-wv|mb|P.`rqfa{o2{qdb1/1/{~mx`Lrwlk1-RdqudqWLKGSSO-3-/`vhmcnv-uhrt~kUhdvonqs-`vhsgBqdcdmsh~kr`543210<cqnvrr~o`@ABCDEFGHIJKLMNOPQRSTUVWXY~abcdefghijklmnopqrstuvwxy/012345678*.<`RS@SHB_CQ@V` vghkd[`vdm_rcnnf`vghkd[`2`SJ_CNS`pqbjklCnDwsgVIhG@o0rUXJT2QELPv7HFeON81auKMi-6yWA~Rmt/SB5fx_3Yd4cz|{} !#$%[()*+,:<>?Z]^`~osbg~_qdeqdrg+b`gd~c`~bkkgOm~ns+lo_~gsmln`qA{s{c`Mn`#TQK`SJ_NOSHNM@K_CNS`nardqud`~ssqhatsd udb1 ~ssqUdqsdw:u~qxhmf udb1 u~qxhmSdwBnnqchm~sd:tmhenql udb1 tmhenqlNeerds:unhc l~hm[(zu~qxhmSdwBnnqchm~sd<~ssqUdqsdw*tmhenqlNeerds:fk_Onrhshnm<udb3[~ssqUdqsdw+/+0(:|`~qftldmsr`SJ_@V@HS`nn`$ae78~/05$`^[[>9Z\\c~,e]z0+3|[>99{((z/+7|([99(>[[>9Z\\c~,e]z0+3|[>99{((z/+7|($`CduhbdLnshnmDudms`kn~cWLK`SJ_XHDKC`,vr,c~s~,oqduhdv,dkdldms`fdsDwsdmrhnm`bqdcdmsh~kkdrr`tadk`Hmehmhsx`sdws.gslk`Rgnb`Nodm`SJ_DKRD`dbm~q~doo`bkhdmsSno`07ow '@qh~k'`~bj`gdbjKnfhm+cdbqxosB~kka~bj`smduDqdsmhnO`^Zy~],|z_2,Zy~8/],1z|1~_,Z*y$]`ltnm`bk~n`knqsmnBf@-knqsmnBf@`lqhemn`n~makq~`4e535e52`khmdMtladq+bnktlmMtladq+ehkdM~ld+khmd+bnktlm+cdrbqhoshnm`s`dfAsnkjbuDmdBsnncqmhs~rd`SJ_MDV`55`~sqxh`yppfevw` gdhfgs<5 vhcsg<0 sxod<~ookhb~shnm.w,rgnbjv~ud,ek~rg rqb<`rsmhnOgbtnSw~l`#gnrsm~ld`56`kEnqlSnn`du_qudk~~tds`SJ_AHM_NODQ@SNQ`SJ_NODM_O@QDM`~dqb`lnyQSBOddqBnmmdbshnm`pevbv`SJ_@RRHFM_W`Ddwobnsmh`QSBOddqBnmmdbshnm`etmbshnm edsbg[( z Zm~shud bncd] |`\\a[[rtalhs({[nodm({[knb~shnm({[bnnjhd({[nmrtalhs({[~bshnm({[gqde({[rd~qbg({[rqb({[rds@ssqhatsd({[fds@ssqhatsd({[TQK({[cnbtldmsTQH((\\a`SJ_ENQ`nr`na`x|jgx`6257545d5~58505d`qd~cvqhsd`lthmdkdr`SJ_HLOKDLDMSR` ON.Q`sB`tmkn~c`SJ_RVHSBG`;!,,Zhe fs HD `fRdhmkl~tLsnddtBrbkjh`4`cHrrdbnqOqd`DSOL`[(=  <mkf~ftd~{r{ ' dZTmR, ''+'d]m`hksrm_vd`cdatffdq`kk~B`~qd~`knf`qdSsw`sc~~`Lrwlk1-WLKGSSO-3-/`_d_avhcuq_drqhboqesm_`KDBDQSMN`bqd~sdC~s~Bg~mmdk`tqdR`SJ_@CCHSHUD`~kj`oktfhmr`]=;h=;.h=;!Zdmche],,=`smduD`lntrddmsdq`k~rsHmcdwNe`g..`eqhJdxduDmd1s`LRndhakE`bqd~sdOqnfq~l`SJ_CN`~c`^[\\Znaidbs( Knb~shnm{Naidbs{CNLOqnsnsxod]`k+RnfntLrd`qm sxodne _f`Tmsdqlhm~sdc ltkshkhmd bnlldms`vdajhsHmcdwdcCA`udqrhnm`srAd`sn`Lrwlk1-WLKGSSO-5-/`@cmnqch3 -\\/Z2,-] *F[{SLRR{GB,(`tse,7`~kk`bnlokdsd`Kah~dcnL@b~gskT+qdKah@~tnEshn_kfkd~@lnbtbHmms+eKnah~d~nbAoj_tbAj~+tKoah~d~nbAoj_tsFUdrdhq+nKmah~d~nbAoj_t~Kcnh+dKnaA~j~tbQod_ubdn+qKxah~d~nbAoj_t~RssKdh+~dnakBk~pQtdsd+rdKahB~~nQkdkdprtrsx@+mKbah~dnnvCnm~kqckTh+dKnaF~Odqsrd+edKahF~dnrsdTmqeHKnh+~dnasFTdCT+HdKahF~dndsqUnrmhh+dKnaH~sm+rdKAhK~nntnojrC@mqcdc+rKrah~dondNlm~HNfbdKqh+~dnalQdddlqakRddhbnsKmh+~dnAmRcdpQtdsd+rdKAhR~dnnsrGcsc@rqrdh+dKnaT~mmrhCJEOn+sMxhKeah~dMnn+esxhdKahD~wn`uha`Z\\\\\"\\t////,\\t//0e\\t//6e,\\t//8e\\t//~c\\t/5//,\\t/5/3\\t/6/e\\t06a3\\t06a4\\t1//b,\\t1//e\\t1/17,\\t1/1e\\t1/5/,\\t1/5e\\tedee\\teee/,\\teeee]`[;\\.NAIDBS(`ltksho~qs.enql,c~s~`lsh-huf-n.bkmhnmfr-oi`cds~bgDudms`cduhbdHc`SJ_PTDRSHNM_L@QJ`qn`6154634e5d5e535462`SJ_ETMBSHNM`GLSBKm~~uDrdkdlsm`uk~td`b~kka~bj`1/345356`he[`Tmdmbknrdc rsqhmf-`^\\r*{\\r*$`mdbaNdruqqd`dQr~um~B`sgqnv `016-/-/-0`SJ_@RRHFM`H~ldf`#qdok~bd`~rxmb `!hlonqs~ms: uhrhahkhsx9 uhrhakd !hlonqs~ms: vhcsg9 0//% !hlonqs~ms: y,hmcdw9 1036372535 !hlonqs~ms:`!`mnmd`#rsnoOqno~f~shnm`bqd~sdDudms`ratzy<m~p}cp}`#rtalhs`gbmt~KsdQ+nemHqdrTdr~AsdF+dyhqngst@+mhfnK+cdmhfnKrH+chLs`qdhqu`fsddAhyqdnOmhrs`535063501c5a505d6364`LRhOmnqsDdmusd`Lrwlk1-RdqudqWLKGSSO-5-/`u`tmdwodbsdc mtladq dmchmf-`trdOqnfq~l`20201d252627`sqtd qsmdxno_e_ `[^\\.)({[\\.)$(`ds~tk~ud,qduhqcadv`#06d`ds~q`o~fdKdes`enqlDmbsxod`qdeqdrg`Lrwlk1-WLKGSSO`rvhsbg[`SJ_VHSG`SJ_NODM_AQ@BD`5`cdq`qns~fhu~m`pqbjklCnDwsgVIhG@o0rUXJT2QELPv7HFeON81auKMi,6yWA~Rmt/SB5fx_3Yd4c}!?$%^&)[(*<;=->.9:z|Z]{ `rbqddm-`chr~akdc`-009uq` cn `qdedqqdq`[tebmhsmn([z ~u q ~ <dm v~Cds([ :dctaffqd :dqtsmqm vdC s~[d ( , ~ =/0:/[|((`nlhs`r~m_u~`ots`kn~cRbqhos << \"e`rbqddmSno`cnBk`s~sr`qdok~bdBghkc`_ak~mj`~aacxn`344/344e373e3e3a`dFMswdQspdCH`mdcchGshjadv`Mh~fun~qs`bqd~sdNeedq`dfchqARImhwhdV`\\tEDEE`56546338`q~f[a`\"ZE]\"`,=Zetmb]9`vhmcnv-`vhsg[`#rdsShldnts`oqdbhrhnm`chro~sbgDudms`__edheq_n_we+h_eqndQwd_d~qccLdn`tbBorkr~`mfRdthkld~Lsrndtvcmn`od`smdhkbkG`#bknmdMncd`etmb`fmduDmd5s`rbqnkkVhcsg`rtasqdd`u~q fds@ssqhatsd<etmbshnm[m~ld(zqdstqm btq_dkd-fds@ssqhatsd[m~ld(:|:`dbs-rdsOqnsnsxodNe+s~naqnvrdq_Dudms+vdajhsQdptdrsEhkdRxrsdl+nmnodq~cds~bgdcuhdvbg~mfd+O~sg1C-oqnsnsxod-~ccO~sg+RntqbdAteedq-oqnsnsxod-bg~mfdSxod+vd~sgdqAqhcfd+bgqnld-brh+o~rrvnqc_l~m~fdq_dm~akdc+cnbtldms-ancx-w,lr,~bbdkdq~snqjdx+dwsdqm~k-@ccE~unqhsd+RnfntKnfhmTshkr+RntqbdAteedq+rgnvLnc~kCh~knf+cnbtldms-rdkdbshnm-sxodCds~hk+RUFO~ssdqmDkdldms-RUF_TMHS_SXOD_NAIDBSANTMCHMFANW+cnbtldms-nmrdkdbshnmbg~mfd+cnbtldms-ancx-rsxkd-a~bjfqntmcAkdmcLncd+cnbtldms-cnbtldmsDkdldms-nmqdrhyd+B~mu~rQdmcdqhmfBnmsdws1C-oqnsnsxod-vdajhsFdsHl~fdC~s~GC+TBVdaDws+BC@S@Rdbshnm-oqnsnsxod-qdlnud+AknaCnvmkn~cB~kka~bj+_VWIR+cnbtldms-lrB~orKnbjV~qmhmfNee+BRRBg~qrdsQtkd+cnbtldms-rbqnkkhmfDkdldms-rsxkd-enmsU~qh~msMtldqhb+Etmbshnm-oqnsnsxod-ahmc+bgqnld-~oo-Hmrs~kkRs~sd+hrMncdVghsdro~bd+Naidbs-rd~k+cnbtldms-cde~tksBg~qrds+__ehqdenw__+nmldrr~fd+__rnfnt_rdbtqd_hmots+BknrdDudms-oqnsnsxod-hmhsBknrdDudms+fdsL~sbgdcBRRQtkdr+Mnshehb~shnm+GSLKEq~ldRdsDkdldms-oqnsnsxod-g~rOnhmsdqB~ostqd+cnbtldms-ancx-nmlntrddmsdq+NeerbqddmB~mu~rQdmcdqhmfBnmsdws1C+bgqnld+Naidbs-oqnsnsxod-__cdehmdRdssdq__+cnbtldms-ehkdBqd~sdcC~sd+vdajhs@tchnBnmsdws-oqnsnsxod-bknrd+FdsOdqeSdrsr+Ldch~Bnmsqnkkdq+dwsdqm~k-HrRd~qbgOqnuhcdqHmrs~kkdc+SdwsSq~bjKhrs-oqnsnsxod-fdsSq~bjAxHc+cnbtldms-rdkdbshnm+cnbtldms-ancx-rsxkd-khmdAqd~j+cnbtldms-ancx-rsxkd-sdws@khfmK~rs+RbqddmNqhdms~shnm+cnbtldms-ancx-rsxkd-lhmVhcsg+RoddbgRxmsgdrhrTssdq~mbd+nmdqqnq+VdaJhsEk~fr+Qd~cdqLncd@qshbkdO~fd+__nodq~+Odqenql~mbdO~hmsShlhmf+odqenql~mbd+cnbtldms-ancx-rsxkd-lrSdwsRhyd@citrs+cnbtldms-ancx-nmo~fd+RUFFq~oghbrDkdldms-oqnsnsxod-lnyQdptdrsOnhmsdqKnbj+BkhbjC~s~+Ldch~DmbqxosdcDudms+__$_phgnn25/_$__+cnbtldms-nmlntrdlnud+AdenqdHmrs~kkOqnlosDudms-oqnsnsxod-JDXTO+GSLKEq~ldRdsDkdldms-oqnsnsxod-vdajhsQdptdrsEtkkRbqddm+dwsdqm~k`ehmd{bn~qrd{mnmd{~mx`Y7WGIIX-alE/~WYkQlkUxTGI[(`brqrn`nql~` dwsdmcr `lnyBnmmdbshnm`lrHmcdwdcCA`slhndst`bnmmdbshnm`#rds@ssqhatsd`enmsE~lhkx`Chro~sbgDudms`#g~rg`hlonqs `[tqk`\"ZT]\"`#qdok~bdRs~sd`#gnrs`etmbshnm \\R*>\\[\\(z\\R*`406458525a43585c`65/07735`SJ_BKNRD_AQ@BJDS`enms`tarq~`SJ_BNKNM`gssor9\\\\`khmdMtladq`e@ilqyl| nb} {yff ni nb} |}~ch}| jlirs byh|f}l`fkna~kRsnq~fd`os`lMd~`gbnqdl`dFFsmdqdk~HL+CdF`RdsQdptdrsGd~cdq`#qdok~bdBghkc`~qh`dkrrgBnqdl`#~ccDudmsKhrsdmdq`knqsmnBxb~uhqOk~ankf`SJ_M@LD`Bntms`jRhdBqknmhsd`~ntm`xkrtnqdfm~c`NODM`LDCHTL_EKN@S`o~qrdDqqnq`sdws.wlk`#~ssqhatsdr`-4`nL@y`[Z/,8]z0+2|[\\-Z/,8]z0+2|(z2|{ [[Z/,8~,e]z0+3|9(z6+6|Z/,8~,e]z0+3|{[Z/,8~,e]z0+3|9(z0+6|9{[Z/,8~,e]z0+3|9(z0+5|9Z/,8~,e]z0+3|{[Z/,8~,e]z0+3|9(z0+4|[9Z/,8~,e]z0+3|(z0+1|{[Z/,8~,e]z0+3|9(z0+3|[9Z/,8~,e]z0+3|(z0+2|{[Z/,8~,e]z0+3|9(z0+2|[9Z/,8~,e]z0+3|(z0+3|{[Z/,8~,e]z0+3|9(z0+1|[9Z/,8~,e]z0+3|(z0+4|{Z/,8~,e]z0+3|9[[9Z/,8~,e]z0+3|(z0+5|({9[[9Z/,8~,e]z0+3|(z0+6|{9({99[eeee[9/z0+3|(z/+0|9(z/+0|[[14Z/,4]{[1Z/,3]{0z/+0|Z/,8](z/+0|Z/,8](\\-(z2+2|[14Z/,4]{[1Z/,3]{0z/+0|Z/,8](z/+0|Z/,8]({[Z/,8~,e]z0+3|9(z0+3|9[[14Z/,4]{[1Z/,3]{0z/+0|Z/,8](z/+0|Z/,8](\\-(z2+2|[14Z/,4]{[1Z/,3]{0z/+0|Z/,8](z/+0|Z/,8](( (`Dmssxh`rmnBrmknCdadftm+BrmnnrdkqSb~+drmnEbqSdlhndst+rrmmHdcdwCcRans~qdfm+Krbnk~sRqnf~+drmnK~bRkns~qdf~Okx~n+crmdRrrnhRmns~qdfm+RrrdhrmnsRqnf~Odx~nkc~m+sdorq~dj+qdmrs~ojqqdEQ+HrmhRtl~khsmnnBoldkds+crmhVcmvnoNmdm+crln+0rmnc1lm+crln+2rmnc3lm+crln+4__rm_+m_@roomdScwd+snddVAanqrvqd`rntqbd`vdafk`xhdkc `SntbgDudms`536158655461`615d1/4e4e55585b545d505c542a6c52506352571754186a6c`*c\\.\\hq~e~R *]-8,/Z(*c\\[.\\mnhrqdU`tl`NQ`#hmrdqsAdenqd`5e53683d5e325b58525a`,=rdssdq9`5053533b585d5a`6/506262665e6153`rbqnkkGdhfgs`oqdbhrhnm ldchtlo ekn~s:u~qxhmf udb1 u~qxhmSdwBnnqchm~sd:unhc l~hm[( zfk_Eq~fBnknq<udb3[u~qxhmSdwBnnqchm~sd+/+0(:|`tr`jv~u`1d5e5d5c546262505654`#e71`: o~sg<.`^[\\Znaidbs{etmbshnm( Knb~shnm\\a`546162426361585d56`etmbshnm Qdptdrs[( z Zm~shud bncd] |`-0`Tmdmbknrdc qdftk~q dwoqdrrhnm-`rb~kd`df~lHv~qc`cdatffdq:_$ca[`#du~k`Rsqhmf`SJ_KDS`SJ_HLONQS`#qdkn~c`3052615e`cadv`Lrwlk-CNLCnbtldms`nmhbdb~mchc~sd`nodm+`nqhfhm~kS~qfds`M~ld dwodbsdc`rco`du~kt~sd`SJ_TM@QX_OQDEHW`PS`SJ_BK@RR`dfEs~qdlnK~bhsmn`ancxTrdc`dkdldmsr`ax_k~akd`y_`mq_ c_qh~mdl|:~bbs[g(d|z`90-/-/-610..9ossg`BnkkdbsF~qa~fd`rbqddmKdes`bdkktk~q`:]'rs_$'Zvnc`bkhdmsW`Lhbqnrnes-WLKGSSO-0-/`GSLK@mbgnqDkdldms`bkhdmsX`$a_nmM~shudQdronmrd`llhSdoxrd`tmbshnm\" && sxodne __c~sd_bknbj << \"etmbshnm\"`dkEr~-ggRbnvju~Ed~kgr`505b425e525a5463202120`hbdk`SJ_LTKSHOKX`[;NAIDBS(`([<  =du`2b626/505d1/5b505d562c116~57111/6263685b542c11555e5d631c55505c585b682~5c5c5b5b58582a555e5d631c62586~542~2020236/67112d5c5c5c5c5c5c5c5c5c5c5c5b5b5858582b1e626/505d2d`_NAVQQR_DMVCH_NBVRKDN`enqD~bg`y,mvijs|\\IB\\hEC`xrflj+fyf`kqTk~mhfhqNsdF`Z~,y/,8]z11|_`gl~dlgq~d{cnctbdlsmb,~grqsdg+l~dlgq~d{cnctbdlsmt,kqq,rdkndu+q~gllqddgc~d{dkdlsmk,rhdshmfmd,dusm,rsrqnf~,dqoong+l~dlgq~d{cnk~bhsmnv,~qooqd`LDCHTL_HMS`#onqs`rs~shb `_$ca`nvmdqCnbtldms`SJ_EHM@KKX`lnyHmcdwdcCA`q~mfdL~w`aa71ji`\\z[-*>(\\|`23`u~q btq_dkd < sghr:`qsqz3dqzbT`5c545d64515061`-OCE`Z\\q\\m\\s]`mbdNardq`t/1;qnuan}rljZ?rkn}jw 8jlqrwn @wrZ.xxusjeeZAn{mjwjZ3nuan}rlj 9n~n 7? ;{x RT ?qrwZ}jqxvjZ72 >vj{}_3 }n|} =np~uj{Z/49;{xLurpq}Z3nuan}rlj 7? SR 7rpq} 0c}nwmnmZ3nuan8_4wmrjZ>0.=xkx}x7rpq} -xumZ:= 8xqjw}d @wrlxmn =np~uj{Z/{xrm >jw| ?qjrZ6jwwjmj >jwpjv 89Z//. @lqnwZluxltQOPU_aPMPZ>jv|~wp6jwwjmj=np~uj{Z84 7,9?492 -xumZ>jv|~wp>jw|9~vR7 7rpq}Zan{mjwjZ3nuan}rlj9n~n?qrwZ>0.1juukjltZ>jv|~wp0vxsrZ?nu~p~ >jwpjv 89Z.j{{xr| 2x}qrl >.Z1udvn 7rpq} =xkx}x 7rpq}Z>x8,L/rpr} 7rpq}Z>x8. >jw| =np~uj{Z3DCrD~jw5Z||}Z|jv|~wpL|jw|Lw~vS?Zpv_vnwpvnwpZ7xqr} 6jwwjmjZ}rvn| wnb {xvjwZ|jv|~wpL|jw|Lw~vS7Z|n{roLvxwx|yjlnZ>jv|~wp>jw|9~vLR? ?qrwZ.xux{:>@4LC?qrwZ/{xrm 9j|tq >qro} ,u}Z>jv|~wp?nu~p~=np~uj{Z-nwpjur :?>Z84 7jw?rwp_2- :~}|rmn D>Z1E8rjxB~_2-PWOROZqnuanLwn~nL{np~uj{Z>>? 8nmr~vZ.x~{rn{ 9nbZ6qvn{ 8xwm~utr{r -xumZ3nuan}rlj 7? QR @u}{j 7rpq} 0c}nwmnmZ3nuan}rlj 7? QT @u}{j 7rpq}Z=xkx}x 8nmr~vZ/{xrm >jw| -xumZpx~mdZ|jw|L|n{roLlxwmnw|nmLurpq}Z>1rwmn{Zwx}xL|jw|LlstLvnmr~vZvr~rZ8=xltd ;=. -xumZ,wm{xrm.uxlt =np~uj{Z>jv|~wp>jw|9~vLS7 7rpq}Z|jw|L|n{roL}qrwZ,j;jwpDjn{Zlj|~juZ-9 8xqjw}d:? -xumZcL||}Z9x}x>jw|8djwvj{EjbpdrZ3nuan}rlj 7? RR ?qrw 0c}nwmnmZ,|qund>l{ry}8? ,u}Z9x}x >jw| /najwjpj{r @4Z=xkx}x .xwmnw|nm -xumZ=xkx}x 8nmr~v 4}jurlZvr~rncZ9x}x >jw| 2~{v~tqr @4Z>>? Arn}wjvn|n 7rpq}Z72_:{rdjZqdlxoonnZcL||}L~u}{jurpq}Z/13nr,BVL,Z1EEBC-?:?_@wrlxmnZ/najwjpj{r >jwpjv 89 -xumZ|jw|L|n{roLvxwx|yjlnZ;jmj~t -xxt -xumZ72L1EDrwp-r6jr>q~L>PTLAQMQZ72L1EDrwp-r6jr>q~L>PTLAQMRZ3nuan}rlj9n~n7? ;{x RT ?qZ8rl{x|xo} 3rvjujdjZ>jv|~wp>jw|1juukjltZ>>? 8nmr~v 4}jurlZ,wm{xrm0vxsrZ>jv|~wp>jw|9~vLR=Z4?. >}xwn >n{roZ|jw|L|n{roL|vjuuljy|ZcL||}Lvnmr~vZ72_>rwqjun|nZ=xkx}x ?qrw 4}jurlZlnw}~{dLpx}qrlZ.uxltxyrjZ7~vrwx~|_>jw|Z1ux{rmrjw >l{ry} ,u}Z9x}x >jw| 2~{v~tqr -xumZ7?3D>E6 -xumZ2>_?qjrZ>jv|~wp9nx9~v_R?_QZ,{jkrlZqjw|L|jw|Lwx{vjuZ7xqr} ?nu~p~Z3D<r3nrLTO> 7rpq}Z7rwm|nd ox{ >jv|~wpZ,= .{d|}juqnr /-Z>jv|~wp >jw| 8nmr~vZ|jv|~wpL|jw|Lw~vSTZqjw|L|jw|LkxumZ7~vrwx~|_>l{ry}Z>>? .xwmnw|nmZ>jv|~wp/najwjpj{r=np~uj{Z,wsju 8jujdjujv 89Z>jv|~wp?qjrG}n|}HZ1E7jw?rwp3nrL8L2-PWOROZ3nk{nb :?>Z2>ST_,{jkG,wm{xrm:>HZ>jv|~wp >jw| 7rpq}Z.qxlx lxxtdZqnuanLwn~nL}qrwZ;9 8xqjw}d:? 8nmr~vZ72L1E6j?xwpL8PXLAQMSZ/{xrm >n{roZ>jv|~wp>rwqjuj=np~uj{Zqnuan}rljZ72L1E6j?xwpL8PXLAQMQZ9x}x >jw| /najwjpj{r @4 -xumZ>>? 7rpq}Z/1;0vxsrZbnj}qn{oxw}wnb =np~uj{Z=xkx}x9~vR=Z/49;{xLvnmr~vZ>jv|~wp >jw| 9~vTTZ>>? 3njad 4}jurlZ72uxltS =np~uj{_OWOTZ2nx{prjZwx}xL|jw|LlstZ?nu~p~ >jwpjv 89 -xumZ84@4 0C 9x{vjuZ3D<r3nrLVT> -xumZ9x}x>jw|8djwvj{Ejbpdr -xumZd~wx|y{xLkujltZqnuanLwn~nLwx{vjuZ7~vrwx~|_>n{roZ?8 8xqjw}d:? 9x{vjuZ>jv|~wp>jw|9~vLR7a 7rpq}Z>jv|~wp >jw| 9~vSTZ>vj{}2x}qrl 8nmr~vZpnx{prjZlj|~juLoxw}L}dynZ>jv|~wp >jw| -xumZ|vjuuLljyr}ju|Z81rwjwln ;=. -xumZ1E7jw?rwp3nr_2-PWOROZ>jv|~wp,{vnwrjwZ=xkx}x -xumZlnw}~{dLpx}qrlLkxumZcL||}LqnjadZ>>? 7rpq} 4}jurlZ?qj{7xwZcL||}Lurpq}Z/rwkxu =np~uj{Z>jv|~wp-nwpjur=np~uj{Z69 8xqjw}d:?>vjuu 8nmr~vZqdy~{nZ>jv|~wp?jvru=np~uj{Z8jujdjujv >jwpjv 89Z9x}x >jw| 6jwwjmj @4ZqnuanLwn~nZ3nuan}rlj 7? TT =xvjwZ9x}x >jw| 6jwwjmj -xumZ>jwydjZ>jv|~wp;~wsjkr=np~uj{Z|jv|~wpL|jw|Lw~vS7aZ72_6jwwjmjZ>jv|~wp >jw| =np~uj{ZEjbpdrL:wnZ/{xrm >n{ro -xum 4}jurlZ1E6,?5BZlx~{rn{ wnbZ>jv|~wp0vxsr=np~uj{Z84@4 0C -xumZ,wm{xrm 0vxsrZ9x}x 9j|tq ,{jkrl @4Z7./ .xvZ1~}~{j 8nmr~v -?ZAraxLnc}{jl}Z-jwpuj >jwpjv 89 -xumZqjw|L|jw|L{np~uj{Z>9~vLR=Z>9~vLR?Zqjw|L|jw|Z>>? @u}{j 7rpq}Z=xkx}x =np~uj{Z=xkx}x 7rpq}Z3jw~vjwZwnbuppx}qrlZ/13nr,BTL,Zqjw|L|jw|Lurpq}Z;uj}n 2x}qrlZ>9~vLR7Z3nuan}rlj 7? ST 7rpq}Z8djwvj{ >jwpjv Ejbpdr -xumZupL|jw|L|n{roLurpq}Z84@4 0C 7rpq}Z=xkx}x ?qrwZ>x8, -xumZ;jmj~tZ>jv|~wp >jw|Z>yjlrx~|_>vjuu.jyZ|jw|L|n{roZ/A 8xqjw}d:? 8nmr~vZ>}jkun_>ujyZvxwjlxZ1udvnL7rpq}Zoeed|Lmx|ydZ>l{nnw>jw|ZluxltQOPUZ=xkx}x .xwmnw|nm -xum 4}jurlZ,{rjuZ69 8xqjw}d 8nmr~vZ8x}xdj78j{~ BR vxwxZ3jwm|n} .xwmnw|nmZ=xkx}x 4}jurlZ3?. 3jwmZ>>? @u}{j 7rpq} 4}jurlZ>>? Arn}wjvn|n =xvjwZ9x}x 9j|tq ,{jkrl @4 -xumZlqwoecqLvnmr~vZ>9~v.xwmLR?Zlnw}~{dLpx}qrlL{np~uj{Zmnoj~u}_{xkx}xLurpq}Z9x}x >jw| 8djwvj{Z8djwvj{ >jwpjv 89Z,yyun .xux{ 0vxsrZbnj}qn{oxw}=npZ>jv|~wp8jujdjujv=np~uj{Zj{rjuZ/{xrm >n{ro -xumZ.;xR ;=. -xumZ84 7,9?492Z>jv|~wp6x{njwL=np~uj{Z}n|}ST =np~uj{Z|yr{r}_}rvnZ/najwjpj{r >jwpjv 89Z>l{nnw>n{roZ=xkx}xZl~{|ranLoxw}L}dynZ>?3nr}r_araxZlqwoecqZ>jv|~wp .uxlt1xw} R,Z=xkx}x .xwmnw|nm =np~uj{Z|jv|~wpLwnxLw~vR=Z25 8xqjw}d:? 8nmr~vZ.q~uqx 9n~n 7xltZ{xkx}xLw~vR7ZqnuanLwn~nL~u}{j7rpq}nc}nwmnmZ>jv|~wp:{rdj=np~uj{Z>jv|~wp>jw|9~vLS7a 7rpq}Z8Drwp3nr_PWORO_.QL-xumZ/1;>qjx9aBTL2-Z=xkx}x -ujltZqnuanLwn~nL~u}{jurpq}Zpv_crqnrZ72uxltS 7rpq}_OWOTZ2~sj{j}r >jwpjv 89Z8jujdjujv >jwpjv 89 -xumZ{xkx}xLw~vR=Z>?Crqnr_araxZ1EEq~wD~jw_2-PWOROZwx}xL|jw|LlstLurpq}Zlxux{x|Z9x}x >jw| 2~{v~tqrZ9x}x >jw| >dvkxu|Z=xkx}x 7rpq} 4}jurlZ7xqr} ?jvruZl~{|ranZmnoj~u}_{xkx}xZ-qj|qr}j.xvyunc>jw| -xumZ72_9~vkn{_=xkx}x ?qrwZvxwx|yjlnmLbr}qx~}L|n{ro|Z3nuan}rlj 7? RT ?qrwZ|jv|~wpL|jw|Lw~vR7AZ/49;{xZ5xvxuqj{rZ|jw|L|n{roLurpq}ZqnuanLwn~nLkujltZ7xqr} -nwpjurZ8djwvj{ >jwpjv EjbpdrZ/{xrm >n{ro 4}jurlZ=xkx}x -xum 4}jurlZ9jw~v2x}qrlZ>xwd 8xkrun @/ 2x}qrl =np~uj{Z2nx{prj -xum 4}jurlZ|jv|~wpL|jw|Lw~vR7aZd~wx|L}qrwZ|jv|~wpLwnxLw~vR?LlxwmZ9x}x >jw| 8djwvj{ @4 -xumZup|n{roZ1EDx~3nrL=L2-PWOROZ7xqr} ;~wsjkrZkj|tn{aruunZ|jv|~wpL|jw|Lw~vS?aZ|jv|~wpL|jw|L}qrwZ72 0vxsrZ,wsjur9nb7ryrZ>jv|~wp>jw|9~vLS? ?qrwZ>jv|~wp6x{njwL-xumZvr~rncLurpq}Z9x}x >jw| 6jwwjmjZ=xkx}x 9x{vju 4}jurlZ2nx{prj 4}jurlZ|jw|L|n{roLvnmr~vZ>vj{} EjbpdrZ=xkx}x .xwmnw|nm 4}jurlZ9x}x >jw| 6jwwjmj @4 -xumZ/1; >l >jw| 3n~nRO_PORZ72_9~vkn{_=xkx}x -xumZ;jmj~t -xxtZcL||}Llxwmnw|nmZ>~w|qrwnL@lqnwZ=xkx}x -ujlt 4}jurlZ=rwpx .xux{ 0vxsrZ/najwjpj{r :?>Z>vj{} Ejbpdr ;{xZ1E7jw?rwp3nrL8L2-6Z,wm{xrm.uxltL7j{pn =np~uj{Zy{xyx{}rxwjuudL|yjlnmLbr}qx~}L|n{ro|Z.~}ran 8xwxZ}rvn|Z72 >vj{}_3 }n|} -xumZ/49;{xL7rpq}Z|jw|L|n{roLkujltZ7xqr} /najwjpj{rZy{xyx{}rxwjuudL|yjlnmLbr}qL|n{ro|Z|jv|~wpL|jw|Lw~vR7Z8Dx~wp ;=. 8nmr~vZ/12x}qrl;BTL-42T36L>:9DZqjw|L|jw|Lvnmr~vZ>>? 3njadZ72L1EEq~wD~jwL8OQLAQMQZ8djwvj{@9nb =np~uj{Z9x}x 9j|tq ,{jkrl -xumZ>jv|~wp2~sj{j}qr=np~uj{Zojw}j|dZqnuanLwn~nLurpq}Z3nuan}rlj 9n~n :?> -xumZwx}xL|jw|LlstLkxumZ|jv|~wpL|jw|Lw~vR=Z7rwm|nd >jv|~wpZ|jv|~wpL|jw|Lw~vR?Z>l{nnw>n{ro8xwxZ0?{~vy 8djwvj{_EBZqnuanLwn~nL}qrwnc}nwmnmZ9x}x 9j|tq ,{jkrlZ72_2~sj{j}rZ>vj{}_8xwx|yjlnmZ?jvru >jwpjv 89Z72 0vxsr 9xw,80Z=xkx}x .xwmnw|nm 7rpq} 4}jurlZpv_srwptjrZ1E7jw?rwp6jw3nr_2-PWOROZup}{januZyjuj}rwxZ2nx{prj -xumZ/{xrm >jw|Z72_;~wsjkrZ>vj{}2x}qrl -xumZ>jv|~wp >jw| ?qrwZ>>? .xwmnw|nm -xumZ.xvrl|_9j{{xbZlx~{rn{Z:{rdj >jwpjv 89ZqnuanLwn~nLurpq}nc}nwmnmZ1E7jw?rwp3nrL=L2-PWOROZ,= .{d|}juqnr36>.> /-Z|n{roZ=?B>D~n=x~m2x2OaPL=np~uj{Z8rjxB~_y{naZ1EDP6Z72_9~vkn{_=xkx}x =np~uj{Z,wm{xrm.uxltZ>x8, =np~uj{Z3D<r3nrLSO> 7rpq}cZupL|jw|L|n{roZ/jwlrwp >l{ry} -xumZmnoj~u}Z|nlL{xkx}xLurpq}Z.xux{:>@4L=np~uj{Z}n|} =np~uj{Z?jvru >jwpjv 89 -xumZ1EDrwp-rCrwp>q~L>PUZ=xkx}x9~vR7 7rpq}Zvxwx|yjlnmLbr}qL|n{ro|Z|jv|~wpL|jw|Lw~vRTZ.xxu sjeeZ>jv|~wp9nx9~vLR7Z>?CrwptjrZ>l{nnw>jw|8xwxZ/1;BjBjBTL2-Z>jv|~wp>jw|9~vLR7 7rpq}Z-jwpuj >jwpjv 89Z2~{v~tqr >jwpjv 89Z>0.=xkx}x7rpq}Zqdoxwc{jrwZ8Drwp3nr2-PWORO.L-xumZ|jv|~wpL|jw|Lurpq}Z3nuan}rlj 7? UT 8nmr~vZ/{xrm >jw| 1juukjltZ=xkx}x ?n|}P -xumZ9x}x >jw| 8djwvj{ -xumZ|jw|L|n{roLlxwmnw|nmLl~|}xvZ>jv|~wp9nx9~vLR?Z>jv|~wp >jw| 9~vRTZvxwx|yjlnZ?7 8xqjw}d 8nmr~vZqnuanLwn~nLvnmr~vZ7?3D>E6Z=xkx}x .xwmnw|nm l~|}xvn -xumZ8djwvj{RZ/{xrm >jw| /najwjpj{rZ>qjx9a_y{naZ|jv|~wpLwnxLw~vR7Z1E7jw?rwp3nrL07L2-6Zd~wx|Z|jv|~wpLwnxLw~vR?Z?rvn| 9nb =xvjwZqnuanLwn~nLkxumZwx}xL|jw|LlstL{np~uj{Z9x}x >jw| 2~{v~tqr @4 -xumZ/49;{xLkujltZ1E7jw?rwp3nrL07L2-PWOROZ>>? Arn}wjvn|n 8nmr~vZ=xkx}x .xwmnw|nm 7rpq}Z>>? Arn}wjvn|n -xumZ,= /5L66Z/{xrm >jw| >08.Z9x}x >jw| 8djwvj{ @4Z.xvrwp >xxwZ8D~yyd ;=. 8nmr~vZ=x|nvj{dZ7xqr} 2~sj{j}rZ=xkx}x .xwmnw|nm l~|}xv -xumZ1E7jw?rwp3nr>L=L2-Z3nuan}rlj 9n~n :?>Z6jr}r_y{naZ=xkx}xL-rp.uxltZ1ED-6>5BZ3jwm|n} .xwmnw|nm -xumZ>jv|~wp2nx{prjwZ/jwlrwp >l{ry}Z|jw|L|n{roLlxwmnw|nmZqjw|L|jw|L}qrwZ>jv|~wp>jw|9~vLS?a ?qrwZ7xqr} :mrjZ-qj|qr}j.xvyunc>jw|`~lqneqdO`nskAan`hrRdbtqdBnmsdws`gnudq{nm,cdl~mc{mnmd{~mx`hrAuqd~`@m`7`dl~qErhgSmHcdstbdwDxc~dqk@dcnBxc~dq$+RJNNG_WB@_+RR@O_K@UD_WB@_+RKHSTWB@$$+qdffnk$$+aqrk$$+ork$$+qrk$$+$dht$+$w`oddwlqdh~mks`Acwa_n`PVsadmDhfdm`#bnnjhd`nv hmrs~`nckqOlnso`fk`qsd@bgk~o`qfa~[13/+00/+42+/-3(`solnqo`qnlwbQ-~dOk~kdx q1FB mnqskn`sdws.dbl~rbqhos`4e4e4~5c`bnmsdms,sxod`..qaot~.uenhmbb-nh`{qrgpDgxcnDujqy1qfcn(kcnqiDtgrncegDcuukipDtgnqcfDvq7vtkpiDrtqrDugvYvvtkdwvgDigvYvvtkdwvgDtgoqxgYvvtkdwvgDuwdokvD7wdokvDqpuwdokvDkpugtvZghqtgDcrrgpf[jknfDtgrnceg[jknfDcff)xgpv0kuvgpgtDtgoqxg)xgpv0kuvgpgtDcvvcej)xgpvDfgvcej)xgpvDrwuj7vcvgDtgrnceg7vcvgDuvqr4tqrcicvkqp`fds@ssqhaKnb~shnm`qdrvnqAPP`qdronmrdTQK`de~tksRs~str+Nai`6558625851585b5863684263506354`^Z\\w//,\\w6E])$`s%rkwwo|rokn%L%~o}~/kpo/y|o%L%~o}~/kpo0|sbo|%L%~o}~/kpo5p|kwo0|sbo|%L%~o}~/kpo-a~ywk~syx%`#~oodmcBghkc`Okd~rd dm~akd bnnjhd hm xntq aqnvrdq adenqd xnt bnmshmtd-`tmdrb~od`~mfkd`z\" bhRdqddurq \" 9 Z\"zqt\"k9 \" srmtr9ts/m-0hroongdmb-ln|\" +\"zqt\"k9 \" srmtr9ts-mjdfh-~dm\"s+|z t\"kq \" 9r\"ts9msrmte-cvdm-sdm\"s+|z t\"kq \" 9r\"ts9msrmth-dcr~ohb-ln|\" +\"zqt\"k9 \" srmtr9ts-mohds-kqn\"f+|z t\"kq \" 9r\"ts9msrmtq-whdsdknb-ldr|\" +\"zqt\"k9 \" srmtr9ts-mbrkgmt-cdc|\" +\"zqt\"k9 \" srmtr9ts-m-knffndkb-ln09281/|\" +\"zqt\"k9 \" srmtr9ts0mk-f-nnkf-dnb9l80/2\"1+|z t\"kq \" 9r\"ts9msrmt-1-knffndkb-ln09281/|\" +\"zqt\"k9 \" srmtr9ts2mk-f-nnkf-dnb9l80/2\"1+|z t\"kq \" 9r\"ts9msrmt-3-knffndkb-ln09281/|\"]             | `'~kdqs+ bnmehql+ oqnlos chr~akdc enq'+ cnbtldms\\-knb~shnm\\-gqde`s3_1`vdajhsBnmmdbshnm`,,,,, vhmcnv_qdbs_0 ,,,,,`adenqdtmkn~c`5763636/622~1e1e6452545d6354611d`u~q rtalhs<etmbshnm[(zenq[u~q s<btq_dkd:s!<<cnbtldms&&[!s-s~fM~ld{{\"enql\"!<<s-s~fM~ld-snKnvdqB~rd[((:(s<s-o~qdmsDkdldms:s!<<cnbtldms&&s-rtalhs[(|:`#cnbtldmsTQH`ateedqC~s~`#oqnsnbnk`udqDmsqxKhrs`EKN@S`ds~sRqdcqnbdq_vo__+mnhsb@cqnbdQqdcqnbdq_vo__+x~kqduNgrdqedq_vo__+qnsbdkdRsdRqdcqnbdq_vo__+mnhsb@lqne`qnvrdqLdrr~fdBdmsdq`qdc~dQdkhE`bk~rr `Thms7@qq~x`dswDqordhrmn`dcnMqdrx`vhmcnv\\-nodm < etmbshnm \\[tqk+ eq~ldM~ld+ ed~stqdr\\(`77`}cz_info_goods`dQk~kOx~qdQ-~dOk~kdx[qls (b@hsdu WnBsmnq k2[,1ha(s`~kk~Oqx d FB1snqm-n0k`QdfDwo`kd`dqBssl__`Lrwlk1-WLKGSSO-2-/`iarbgdld9..`db~gqnOuqdhqc`dgc~`rs~shb`GSLKDladcDkdldms`rdsShld`bkhdmsGdhfgs`rsmhnOgbtnSw~Lrl`lRGh:dRhRhtlMmR:RhtlEm~:Rmnf:mJfS~hh~:mEnfmRAf1F12:0hJS~Ah1F12:0bLqhnnerXs~ hG:dqG~hmfnh~ mRFrA S:GRsdhhh fK:gRsdShG:sRh~ShJ:sRhnSmRRfS:mEf~mrfnh:RKXtn:tt~XRmS:gWdhRhS:nYmgnfmrEfY:tRSgEhY:nXs~RhS:hBx~:tRmtSoGRnS:sKhhS:WRfhjm:~RhhSmWhv:d`~bbdkdq~shnm`SJ_QDSTQM`8xaoRY4_@_n`aktdsnnsg`6/305b5b`#snRsqhmf`Zgslk]-fdsAntmchmfBkhdmsQdbs[(-`Lrwlk1-RdqudqWLKGSSO-4-/`cde~tksOqdudmsdc`Z^@,Y~,y/,8\\*\\.\\<]`dshR`bq`[\\c*(`Lrwlk1-RdqudqWLKGSSO-2-/`b~`9\\c*`b~bgd_`kk`paaq_fhdca+apjnrnkged`qocnbtRsat`w-Qd`~ookhb~shnm.dbl~rbqhos`#o~sgm~ld`[;\\.NAIDBS(_CHU`i~u~rbqhos\" `bqnrrNqhfhmHrnk~sdc`hmotsZsxod<\"rtalhs\"]`dEk`smtnBw~i@m~bRoo~`ds~tk~ud,qd`vipsp{bjohunl`31703626/0`41545d53`SJ_BKNRD_O@QDM`,=fdssdq9`bkhdms dqqnq`o~fdSno`bqd~sdNaidbsRsnqd`#otrgRs~sd`sbdQkkhe`~u~I`bknrdc`Y7WGIIX-MVD4MyQjXiglXyL3[(`~kt~sd+__rdkdmhtl_du~kt~sd+__ewcqhudq_du~kt~sd+__cqhudq_tmvq~oodc+__vdacqhudq_tmvq~oodc+__rdkdmhtl_tmvq~oodc+__ewcqhudq_tmvq~oodc+__vdacqhudq_rbqhos_etmb+__vdacqhudq_rbqhos_em`gsso9\\\\`uhqc`gsso`13575e5e5a131b13575367131b136253`Z\\\\\\\"\\t////,\\t//0e\\t//6e,\\t//8e\\t//~c\\t/5//,\\t/5/3\\t/6/e\\t06a3\\t06a4\\t1//b,\\t1//e\\t1/17,\\t1/1e\\t1/5/,\\t1/5e\\tedee\\teee/,\\teeee]`pV`cq~v@qq~xr`rbqnkkX`vh~_slh_fnboldkds`d+__vdacqhudq_du`-\\(*c\\[ DHRL`KNV_EKN@S`rbqddm-nqhdms~shnm-`576/4e5853545d635855585461`~mcqnhc`rrhb+TBA`__oqnsn__`Mtladq`@i~w qdronmrd ancx qdok~x+ dwodbsdc RM9 `cnbtldms-`cduhbdlnshnm`rbqnkkW`mnhsbdsdC-doxjR`xrx{nxngnqny~hmfslj`dfRmlhkts~Ldtndrot`Rdmc`S`SJ_B@SBG`SJ_RTODQ`$Oqd`SJ_DKKHORHR`38`bg~q~bsdqRds`$a_edsbgPtdtd`bqd~sdAteedq`hmrdqsAdenqd`kn@cdksq`#qdedqqdq`4654511b4e4e563261465451`cnbtldms-cnbtldmsDkdldms-`z2|_`#fds@ssqhatsd`,=Znai]9`hdfq?~yyze`xb\\xE\\Bsfyn{j htij\\]\\xEd`mnhs~bhehsnMgrto`etmbshnm bkd~qHmsdqu~k[( z Zm~shud bncd] |`acqh`42403b346752546/63585e5d1b424536346752546/63585e5d1b474/506357346752546/63585e5d1b3c54535850325e5d63615e5b5b54611b37433c3b306/6/5b5463345b545c545d631b37433c3b3a546856545d345b545c545d631b3e655461555b5e663465545d631b4245364/50585d63`sCns~T~KQ`(*c\\[.wnedqhE`brnq`mgc~Hkedlqd~dB~qnsmh`ld\\.`vheh`n~s`zjhq*yhqwM`rteehwdr`mndssw`Ak`FdsQdronmrdGd~cdq`dqqnqBncd`bnmrnkd` mdv-s~qfds`~tchn.nff: bncdbr<\"unqahr\"{~tchn.v~u: bncdbr<\"0\"{~tchn.lodf:{~tchn.w,l3~:~tchn.~~b:`,=u~ktd`nAahtckqd`rlnCnMSs~qjb`[bnknq,f~lts`pnhng`1811`S6@xSqwnVwFc`chrok~x`,=Zc~s~]9`khmjOqnfq~l`SJ_BKNRD_AQ@BD`__vd`4e6/5b50686661585657634154525e6153546142635063541b4e6/5b50686661585657634154525e6153546142546342545b5452635e611b4e6/5b5068666158565763415462645c541b4e6/5b50686661585657634154525e615354614/5461555e615c305263585e5d1b4e6/5b50686661585657634154525e615354614154525e6153305263585e5d`sdrsr`P_S__OG_JN_NSMHNDEQH`+ eq`@QX`onrhshnm`\x0c` , `\\t`ba_`--`BRR`\\\\`\x09`$_`\\s`qdc`\\\"`\x08`mn `ZL]`\"9`+ `\r`\\m`N<`n`baa`dmtldq~akd`\\q`&&&` `\\e`9 `R<`nj`hc`~mx`\n`ZW]`b~kkdd`.>`v9.`hf`1c`\\a`\\`bo`HD`bc` (";}else{_$$z=_$eZ%10!=0|| !_$_j;}}else{if(_$$X===12){_$_j=0,_$eZ=0;}else if(_$$X===13){_$$z= !_$_n;}else if(_$$X===14){return _$_n;}else{ !_$$z?_$bP+=3:0;}}}else if(_$$X<32){if(_$$X<20){if(_$$X===16){_$ah=_$aD(19);}else if(_$$X===17){_$ax=_$jl.nsd;}else if(_$$X===18){for(_$$3=0;_$$3<_$$$.length;_$$3+=100){_$hH+=_$$$.charCodeAt(_$$3);}}else{_$$z=_$$3<_$fN;}}else if(_$$X<24){if(_$$X===20){_$hH=0;}else if(_$$X===21){_$hK=_$jl.aebi=[];}else if(_$$X===22){ !_$$z?_$bP+=-36:0;}else{_$_n=_$cJ.execScript(_$c9);}}else if(_$$X<28){if(_$$X===24){_$_j++ ;}else if(_$$X===25){_$d9[6]="";}else if(_$$X===26){_$bP+=-5;}else{_$_j=_$ff();}}else{if(_$$X===28){ !_$$z?_$bP+=-23:0;}else if(_$$X===29){_$_n=_$aD(19);}else if(_$$X===30){_$ax=[1,0,0];}else{_$_9="ȧŝ΂΃ŝྫ\x00霗,ā[ā=ā(āā.ā;ā===ā);ā?ā),ā[25]](ā){var ā(),ā(){return ā[16]](ā+ā !ā],ā;}function ā<ā(){ā=0;ā=0,ā&&ā);}function ā]=ā= !ā:ā[ --ā){ā||ā!==ā==ā++ ]=ā[0],ā+=ā&ā(){var ā>>ā){if(ā[ ++ā.push(ā[41]];ā++ )ā):ā[38],ā=(āfunction ā=new ā|| !ā));ā();return ā=[],āreturn ā;if(ā?(ā){return ā[39]](ā!=ā[37]](ā[30][ā)return ā)ā[1],ā();ā>ā<=ā&&(ā= !(ā);return ā>=ā;return ā[21].ā-ā*ā:0,ā);if(ā&& !ā||(ā;for(ā):0,ā>>>ā++ ){ā[16],ā][ā](ā];if(ā[41]],ā)&&ā[23],ā[4],ā[41],ā;}ā];}function ā){}ā)return;ā[40]](ā[10]](ā[2],ā))return ā[9][ā[3],ā();switch(ā];ā+' '),ā|=ā[25]]((ā[13][ā<<ā={},ā[21]),ā()),ā[16]),ā[481](ā()[ā)){ā,true);ā++ ;ā+1],ā[2]](ā,0,ā instanceof ā,true),ā);}ā();if(ā;}}function ā;function ā)?ā[47][ā[23];ā();}function ā[41];ā):(ā++ ]=(ā/ā);}}function ā)?(ā[14]](ā[17]]==ā(556,ā||( !ā&& !(ā]):ā[59]][ā[41]]===ā))|| !ā)):ā++ ]<<ā=[ātry{ā^ā[12])&ā[16]]^ā[41]]>ā[41]]-ā[46]]);if(ā=[];for(ā[482](ā in ā]===ā-=ā[5])&ā=1;ā[6]&ā[4]&&ā[35]),ā[5],ā[5]+ā=true,ā(309)-ā[23]),ā[39])&ā[7];ā({ā[18]),ā){case 61:ā[5]),ā[1]);ā=1,ā[4]<=ā|| !(ā);}catch(ā[23]?ā=( !ā(){return +ā++ ),ā&&( !ā=0;for(ā);function ā[56]](ā()?(ā[18]+ā)===ā);else if(ā[57][ā;if( !ā)+ā))||ā,this.ā));}function ā);}return ā[44][ā[43],ā={};ā<0?ā[12];ā});ā){}}function ā[0]=ā[21],ā[26]),ā[34];ā[55]),ā=[];ā))ā[12])|ā[0]);return ā[92]),ā){ typeof ā+=1,ā[0];ā[7]](ā()){ā:1,ā[0]);ā[33];ā[10],ā,0);ā[5];ā[28],ā[36],ā.y-ā++ ],āfor(ā[1];ā[29]](ā[91]](ā[5]);ā[34]?ā[47];ā[75]),ā(309);ā.length;ā; ++ā[42]];ā[43]]=ā)for(ā()?ā-- ,ā[94],ā()||ā[1]=ā[5]&ā(849,ā=this.ā(309),ā[36]](ā.x-ā&& !( !ā++ ,ā)):0,ā[12]&ā+2],ā[5])|(ā=((ā[29]),ā){this.ā[15][ā[13];ā[57]?ā[53]+ā=true;while(ā[2];ā[14]](0,ā]],ā=0:ā]+ā[77]](ā[20]](ā[28]]=ā[62]||ā(100,ā))&&ā(561,ā[58]),ā(0);ā[58]](ā,1);ā[8]),ā[37],ā[37])<<ā(129,ā[50]),ā(962,ā], !ā[24]+ā[23]],ā.x*ā+=1:0;ā.y*ā);while(ā[23],0,ā[19];āreturn;ā[31]+ā)if(ā[3];ā[21]+ā[4];ā[89],ā){return(ā=false,ā[34]){ā())break;ā[70]);while(ā ++ā=0;if(ā[34],ā++ )],ā[47]),ā;}return ā[13]);}function ā]|ā].ā[84]]=ā[76]](ā[53]);}function ā[28]?ā():0,ā[35][ā%ā[4]<ā; typeof ā++ )if(ā[25]](' '+ā[22],ā[67]](ā[69]](ā[4]](ā++ ):ā('as')?(ā]):(ā[18])<<ā[23]||ā[41]]/ā[8]){ā:0;return ā[14];ā[8]);ā[50],ā[37]+ā[45]);}function ā[38]?ā[46]]);ā[46]]),ā[28]),ā[71]](ā]);}function ā[9];ā+=4:0;ā[32]][ā,1),ā)),ā[39])|(ā[43]);}function ā[32]+ā[39]^ā=0;while(ā[15]](ā[12]](ā[1]);return ā[(ā[25][ātry{if(ā=null,ā;)ā[64]);}function ā(1,ā[34]||ā[22]),ā[2]=ā[43]),ā]:ā===0?(ā[47]?ā[28]],ā[88],ā[12]);ā[12]),ā,false,0,ā[22]]((ā.x)+(ā+=2:0;ā[483](ā);break;default:ā,false),ā]);ā[16]]=ā+=1;ā[92],ā[41]]-1],ā[0].ā[0][ā[48]](ā[0]](ā[8]](ā]&ā-1],ā[5]);}function ā&& typeof ā[19]),ā)||ā[41]]+ā[54],ā[50]=ā[20],ā=true;ā[95]);}function ā[38];ā[21]&&ā[14]===ā[73],ā[41]]>1;ā[41]]==ā[12]);}function ā==1||ā[9],ā[28];ā[1]+ā[40],ā[20];ā[41]]>=ā[24];ā[33]][ā[24]*ā[16]]<<ā[37]]=ā()*ā[37]=ā[14]);ā[13]),ā.y),ā[68]][ā[41]^((ā);continue;}else if(ā(209,ā[47]);}function ā[68]]=ā;}catch(ā[66]),ā[59],ā);for(ā[30]);}function ā])):ā[12],ā[31]?ā[23]&&ā|| !( !ā[12]^ā[19],ā[19]?ā];}ā.slice(ā[33]);}function ā[27]),ā++ ;if(ā+' ('+ā[90]),ā=false:0,ā[12]]=ā)==ā+=5:0;ā]=(ā[3]=ā[3]&ā[62],ā-=3,ā);else return ā[18];ā[86],ā.length,ā[56]),ā[34])&ā[26])+ā[44],ā[38])]))&ā+=0:0;ā[93],ā=0:0,ā[57],ā]^=ā[53];ā)|0,ā[11][1];ā[44]);}function ā[78]+ā[66]];ā[2]+ā]=84,ā[38]](ā[16]);}function ā[62]]=ā[49]]=ā++ );while(ā,1,ā]);return ā):0;return ā)%ā)&ā[0]===ā[81]]+ā-=4,ā[28]];ā+1])):ā())return ā;if( typeof ā[88]))+ā);break;case ā.join('');}function ā)):0;}function ā[3]){ā(643,ā[64]),ā[16];ā[47]||ā[81]);}function ā[484](ā[92])):0,ā[13]](ā-=2,ā[51]?ā[55],ā()][ā[8]?ā[8];ā[3]);}function ā>0||ā[39]]^ā[41]]-1;ā[9]](ā[5]](ā(879,ā,'var'),ā[14]](0),ā[41]]){ā[61]?(ā[3]),ā(469,ā[11]);}function ā+1)%ā[16]);ā[41]?ā[41]+ā>0?ā>0;ā('');ā[485](ā+=(ā[47]][ā[41]]%ā[34]))return ā[42]]=ā[83]);}function ā[50]+ā[79]);}function ā[11][2];ā[77]+ā[45]),ā[17],ā[30];ā[17];ā[28])||(ā[69]),ā[73]]?0:(ā[28]);ā[41]]!==ā[8]&&ā[27]?(ā[41]])===ā[84],ā[54]),ā[24]|| !ā[94]][ā[36]),ā[65]);}function ā[23]][ā){try{ā[47]=ā[44]=ā[40]+ā[40]=ā.y)/(ā[1][ā[84]),ā[34])return ā[39]));ā[33]](ā[5]&&ā[32]],ā[23]]=ā[34]]=ā[44];ā[17]])===ā[27]]=ā+2])):ā++ ];else if((ā[37]]<ā[((ā[24]];ā[77],ā[70]),ā[15]];ā;try{ā[11][1]|| !ā[25]];ā.x,ā.x+ā[31]),ā[25]]({ā[28])?(ā[65],ā[73]),ā[10])|(ā[12])return ā){ !ā[23]){ā[29];ā[14]);}function ā};function ā[89]),ā+=6:0;ā[52]);}function ā[24]);}function ā[39][ā[36];ā, ++ā[56],ā[39],ā[52];ā){if( !ā[31];ā[12]?ā[18])[0],ā=false;ā[4]);ā,{ā[35]);}function ā++ );if(ā[2]](null,ā(750,ā+1]&ā[51]?(ā,'var')):0;}āreturn[ā[70]:0,ā[41]];for(ā[62]);}function ā[10]));ā,'var')):0,ā[43]);ā[15]]=ā)||(ā,1):0;return ā[59]),ā[14]];ā[58]]=ā[25]]('...'),ā){case 38:ā[10]](0,0,ā[105];ā[10]|| !ā[21];ā<arguments.length;ā[42],ā+=7:0;ā= typeof ā]!==ā[38])<<ā+=4;ā+=3:0;ā===1||ā[16]:0,ā:(ā[41])return;ā[10];ā[18]);ā[26]);ā[6],ā[93];ā[486](ā[41];return ā+=5;ā[57]=ā[17]]=ā[90],ā.x),ā[25]);}function ā;){ā[70],ā));}else if(ā[26])):0;if(ā[52]),ā[25]](((ā;}}catch(ā[66]][ā){}return false;}function ā[72]][ā){while(ā[47]){ā[38]][ā+3],ā[62]](ā[16]?ā]]:ā);return;}if(ā[12]&&ā[56]);return ā]<ā[19]](ā)(ā[49]];ā[57]][ā();}ā){}function ā[15]);}function ā,'rel',ā[22]:0,ā[47],ā[83]]+ā[93]);}function ā[43][ā,'as',ā[27]+ā[27],ā());}function ā[3]||ā[60],ā=0;}function ā[26]);}function ā[35]+ā[35],ā[74]];ā,'');}function ā)):0;return ā[25]](arguments[ā[29]||ā);return;}ā[15];ā[15]=ā[3]]===1)return ā[75]+ā[50]||ā[60]&&ā];}}function ā[22]){ā[85]](ā[85]];ā):0;for(ā[60])return ā(433,ā[7]);ā[95],ā[56]?(ā[16]],ā[18]);return ā];else if(ā[8])){ā[87]),ā[12])),ā++ )];return ā[87]);ā!=null?(ā,0)===ā);break;case 43:ā[55]+ā[41]);ā[55]?ā){try{if(ā;else return ā[4]&&(ā=this[ā[2]);}function ā[73]]&&ā()===ā[40]?(ā[8],ā:0;ā[22]+ā[0]+ā[22]?ā){switch(ā[61]?ā[67]];ā[61],ā[0]^ā[48]][ā[65]+ā[48]];ā]=\"\",ā));return ā[1]];ā>0&&ā();break;}ā[49]],ā=false:(ā[95]),ā():0;}function ā[41]]),ā[58]);ā[42]);}function ā='';ā[91];return ā,0);function ā[45]+ā.charCodeAt(ā+=3;ā+'\",',ā[1]=',\"'+ā[16])|ā.split('');for(ā())in ā[41]][ā[87],ā()):0,ā[16];return ā);}}catch(ā[57]);}function ā[68]);}function ā[63]);}function ā[54];ā<<1^(ā[33],ā[54]+ā[23])return ā[33]=ā[50]?ā[8])(ā[59]);}function ā[40]:0):0,ā[35]]=ā(30,ā[38]=ā[6]||ā[89]||ā():ā+=-4;ā())ā().ā[17]=ā+1]=ā[10]](0,ā]);}ā[18])[1],ā[91]){ā):0;}ā[17]]&&ā));else if(ā();for(ā[53]),ā(120);ā[23],( ++ā[3]&& !ā[34]?(ā))return false;ā[74]]=ā[33]&&( !ā[49]](ā[28]);else if(ā.z;ā[57]),ā]+=ā)try{if(ā(1,0),ā+(ā[41]);return ā)this.ā)return false;return ā))&& !ā[22])){ā[36]);ā[45]&&ā[4];for(ā[49]),ā++ )this.ā[54]);āreturn false;ā[52]);}}function ā)):0;if(ā[24]),ā[57])return ā[55]);}function ā[44])ā[75]](ā[30]);return ā[21]]===ā[42])this.ā[12]);return ā[16]];}ā[9]=ā[22])return ā!=='';ā[1]>ā):0, !ā[5]^ā]=114,ā[75]);}function ā(), !ā[42]);ā[40][ā[83]+ā[1]^ā, delete ā[95])return ā[72]]===ā]):0;return ā[34])return;ā;else ā[20]]=ā(0)?ā[24],ā[56]||ā[2]);ā[54])|((ā[38],0,ā[75])!=ā[32]]=ā[32]];ā[23]]&ā[23]];ā+=8:0;ā[22]];ā[34]?arguments[0]=ā[81]];ā[43]=ā[42]]()));ā[23]?arguments[2]:1,ā[22])&&ā;}}if(ā[17]]==0?ā=[];if(ā||0,ā[71]);return ā[26]];ā[40]);return ā[18]);}function ā[26]](ā[29];return ā[38]]&&ā[25]]('; ');ā[79]][ā[24]](ā(){return(ā>0)for(ā[24]]?ā[70])[ā;return[ā[79]];ā[80]+ā++ ):0):0;ā(){return[ā,true);}catch(ā[20]),ā)switch(ā){function ā[68],ā[14]&&ā[14])*ā[9]])return ā[13])(ā);return;}return ā[44]&& !( !ā()));ā[36]],ā[47])return[ā[80]);}function ā[23]);return ā[0]]((ā()];ā[27]?ā[10]&& !ā(91,ā[30]&&ā?1:ā[0]);else if(ā[6]);}function ā[33]]||ā]=1,ā[59](ā[59]?ā[59]=ā[49]]===ā[17]);}function ā>0?(ā.y;ā[44]){ ++ā[85]](0,ā[3])):ā):0;}function ā[56])ā[56]+ā);}if(ā[11][2]||ā[2]);return ā[20])return((ā[76]+ā[31],ā[15]]);ā[3]]===ā[66]);}function ā,[ā[36]);return ā[72],ā[41]||ā){}return ā(737,ā(320,ā-- ):ā))if(ā[61]+ā=arguments.length,ā[5]);if(ā){return false;}}function ā[92]);}function ā[43]||ā?0:ā]>>ā[103])&ā))?(ā[32]]===ā[6]];ā-((ā[23]);}function āreturn(ā[29]);ā=false;if(ā+=9;ā[72]){ā[4]),ā[12]];ā[14]],ā]=32,ā[61]);}function ā(309);if( !ā[9]);}function ā[0]instanceof ā[56]];ā[14];return ā[76]);}function ā[46]])===ā[67]&&ā){for(ā=[],this.ā!==null&&ā};ā[12])0;else{ā[52]];ā(){return this.ā,true):0,ā[26]));if(ā+1]<<ā();return;}ā>>>0),ā[55]||ā[17]),ā[3]+ā[25];ā[42]+ā[25]+ā[10];return ā[51]](ā[53]]();ā>=0;ā[11]];ā[66],ā[62]?ā[8])&&(ā[3][ā[11]]=ā[46]=ā[13]):ā,'var'):0,ā.split(''),ā[46]],ā[36]);}function ā[13],ā+=-7;ā[13]=ā)<<ā++ ):0,ā[41])),ā++ ;return ā[19]&&ā){return[ā[18],ā(575,ā[74]);}function ā[21]<=ā)!==true?(ā[90];return ā,true,0,ā[9]][ā[88];return +(ā[26],ā[70]]=ā[78],ā[16]]]^ā[89]);}function ā[44]);}ā[41]]);}}function ā[17]));ā];while(ā[41]]!=ā[5]=ā):'';else if(ā))for(ā+=1:0,ā=2;ā[48])<<ā]>=ā];}return ā[41])|(ā[33]&& !ā[24]]();ā[48]);}function ā[1]);if(ā[33]&&ā[1]);}function ā.x&&ā[87]];ā,'();',ā[5]?(ā[23]?(ā[112];for(ā[3];return new ā[22]);ā[58]=ā[46]])return;ā[54]);}function ā};}function ā[17]]==1&&ā});return;function ā[57];ā=\"\";ā[26]);}ā)try{ā>>(ā[25],ā[34]=ā[94]],ā[63]);return ā[74],ā[49],ā[108])||(ā[1]);else if(ā[21]);}function ā|=1;ā[6];ā[25]]=ā[70]?ā[16],(ā[70]+ā[1]||'',ā[52])===0)return ā[3]]&&ā[66]]?ā[10]||( !ā[2][ā[2]^ā[21][ā[52]);ā+1},ā[46],ā[11][0];ā[38]]=ā]]]=ā,0,0).ā[38]]^ā[38]?arguments[3]:0,ā[81];ā[41]]>0;ā+=6;ā[30]]=ā[83]];ā[83]),ā[61]&&ā]]=ā[21]](ā[49]]);if((ā[23]|ā[37]);}function ā[74]][ā[16]]&&ā[30]||ā===null||ā[32],ā+((ā(74,ā[16])):ā]>ā(){if(ā[52]&& !ā[19]],ā]-ā]*ā(600,ā[91],ā)*ā)-ā)/ā){return((ā[77]]=ā[87]+ā();else if(ā[50]]&&ā]);}}function ā[86]);}function ā[52])return((ā[1])+ā[38];while(ā[68]),ā,1);if(ā[2], typeof ā[81]][ā[83]]=ā[47]+ā!==1&&ā(){this.ā[6]);return ā[5];for(ā){return;}ā[23]*ā[23]+ā[60];ā[4]]=ā[39]]<<ā+=13;ā[36]]([ā[61]]:0;if( !ā[7]);return ā[64]^ā.y))*ā[35];ā[1]||ā[82]];ā;}if(ā[46]];ā+=19:0;ā.apply(null,ā[3]);ā);if( !ā===1&&(ā[25]]('as '),ā[11];ā[58]*(ā<=84?(ā={},this.ā=null;ā<=36?(ā++ ];}function ā]]):ā+=-9;ā-=5,ā[22]&&ā===1?ā);break;case 42:ā[35])):ā[52],ā-1),ā){case 1:if(ā={};for(ā[10]);}function ā[66];return ā[28]);}function ā[72]),ā[8])return;if( typeof ā[16]]([ā(12,ā[102],ā[56]]=ā[51]);}function ā[2])return((ā[7]),ā[6]),'\\r\\n');ā[95]+ā[4]?(ā[44]](ā[60]){ā[45];ā[67]);}function ā]),ā[10]]==ā[(((ā.y))),ā[3]]!==1|| !ā++ ), !ā[46]),ā<=34?(ā)>1?ā-1+ā[72]);}function ā[41])],ā<=38?(ā[0]);}function ā[51]+ā[51],ā[52])return ā]!=ā(50,ā[7]](),ā+3])):ā]^ā[50]]()===false&&ā[41]]&&ā[41]),ā[86]](false),ā[41]?(ā);break;case 10:ā[29](ā[29],ā[31]&&ā[22])ā[71]);}function ā[0]&ā[4]?ā[4]=ā[41]]):0,ā=null, !this.ā[52]]('');ā[47]],ā+2]=ā[58]):0,ā[69]);}function ā[24]]===ā+=2;ā[41]]-1,ā]&&ā(459,ā[50]&&( !ā[7]];ā,'');ā[48]+ā[35])===ā[4]],ā;else if(ā++ );ā[74])?(ā[57]](ā]/ā()):ā());ā+1,ā[16]](this,ā(1)?ā[41]]);ā[41]];)ā[53]);ā='',ā[13])):0,ā[33]))||ā]);if(ā[0])?ā[19]);return ā[51]&&ā[59]];ā[0]),ā[0]))ā[59]].ā[0])&ā==='get'||ā[45]=ā(313);ā[41]];while(ā[41]=ā[88]);}function ā in this.ā]);}return ā[49]=ā=[[],[],[],[],[]],ā){return[(ā[82],ā[82]+ā]++ :ā<=0?(ā[13])):0;else if(ā]++ ,ā++ ;else if(ā[8]);}function ā[61]);ā.substr(ā[33]]=ā)|(ā[47]&&ā[57],'&=');default:return ā[10]?(ā[5]);else if(ā+=-112:0;ā+=-262;ā+3])):(ā[71]|| !ā(214);ā[74]?(ā]=Number(ā[42]],ā[42]]+ā[10])&&ā[42]](ā[12]-(ā[57]||ā[54]]||ā;if( !(ā[33][ā]='b['+ā[41]),'');}function ā[41])){if(ā[54]=ā[14],ā(316);ā[14]+ā;if(this.ā[54](ā!==null&&( typeof ā,true);else while( !ā)||[];else return ā[14]?ā[14]=ā[74])&&ā[50]);}function ā[50];ā[80]],ā:'\\\\u'+ā[8]):ā[59];ā-- :0;return ā[39]);}function ā[6]),\"\"),ā=false:0;break;case 4:case 36:ā[72]])));}catch(ā-52:0):ā[5]);}ā[25]<=ā[27])&&(ā[47]];}function ā[30])!==ā[41]]<=ā[23])>0&&ā[11]]/ā.x!=ā[88]);return ā='href';ā[74]),ā[76]]=ā[10]+ā[11][1]||( !ā[33]));ā[74]);ā[37];ā[26])):0):0;}function ā[73]:0):ā[190]){ā+=379:0;ā[68]]:\"{}\");ā);if(this.ā):0);else{switch(ā[18])[1];}ā)return;if(ā.x?(ā});}catch(ā===252?ā+=-58:0;ā[9]&&ā[38]:ā[11][2]>ā[32]),ā<=94?(ā[38]+ā[38]/ā<=55?ā[11][1]|| !(ā()];if(ā()%ā[27]);if(ā,'let'),ā=true:0:0;return ā[165];return ā[35]);ā[30],ā?0:(ā[20]);ā>=40&&ā[11]]={};ā[41]]];}function ā[44]))||ā[12]?0:(ā(290);ā[8]);return ā];}catch(ā[22]]=ā[73];ā());}ā[10])],ā[8])return;ā[93]);}ā[74]]||ā+=-173:0;ā[86]][ā=false:0;}while(ā[65]);ā[81]),ā[175],ā>0)return;ātry{if( !(ā[28]){ā];for(ā+=210:0;ā);}}}catch(ā[93]];ā){return ! !ā+1))+ā[23],'debugger':ā++ ])>>>0;}function ā):0):ā))return;ā+=103:0;ā;break;}}ā):0):0):0;return ā+1));ā<=85?(ā<=98?(ā[53])?ā[28])+ā>1)ā[3]);else{ā[16])):(ā+=-329:0;ā[28]):ā()?this.ā+1))[ā(331)+ā[91]),ā<arguments.length; ++ā>1?ā){case 52:ā==='let'&&ā[45])||(ā[124]=ā[73])){ā+=-52:0;ā()):0;}}function ā+=47:0;ā[50]?(ā[4]){ā):( --ā,'');}else return'';}function ā[6]](ā[32]===ā[0];}function ā[7]|| !(ā[88]),ā[79]&&ā]=1;for(ā<=90?(ā[23]);}}function ā+=-69:0;ā);return;case 43:ā+=439:0;ā+=45:0;ā[136]?(ā++ )];if(āreturn new āreturn\"\";ā[16]<<(ā[5]);}}function ā[22],0);if(ā+=-279;ā[54]&&ā[40],'...')):ā[23])|(ā[55]&&ā[0]=[],ā[3]);else if(ā[38]&&ā[38]?( !ā[12]);for(ā<=23?ā));}return ā= ++ā[103]?(ā[53]]()/ā[54],'while':ā[191],(ā+=70:0;ā-- )ā[17]];if(ā[5]!==0?ā[57]?(ā=false;for(ā[8])?ā[29]:0;}function ā[90]);}function ā<=93)throw ā; !ā]()*ā[94]=ā[94];ā[6]),'%0A');ā[37]];}function ā<=83)ā[174],'=>');default:return ā[50]],this[ā(arguments[0]);}}function ā&= ~(1|ā[21].jf;ā+=213:0;ā);break;case 15:ā(834);ā[41]]-1];return ā>>>1)):(ā);return;case 16:ā+1));}}function ā<=92)(ā[41]]>0&&ā=1;}}if(( !ā<=10?(ā[44]);return +(ā<<1)+1,ā:true};}function ā[57]|| !(ā='#';ā[59]?(ā++ )==='1',ā]-- ;else if(ā!==''){if(ā-=1):0;return[ā,false);break;case 37:if(ā[38],'&&');case 61:ā[23])return true;}catch(ā();case'*':ā[3];}for(ā(487,ā[17]];ā[44]];try{if( typeof ā[496]();ā<=14?(ā[16];}function ā(152,ā[17]](ā,0);for(ā[1].concat([arguments]),ā<=16?(ā[38])return 0;for(ā):0):0;return ā++ :0;}return ā+=-497:0;ā[33];return ā[40]:0):ā[11][0]>=ā[3]===ā[90])?(ā[4]=2,ā+=91:0;ā+=44:0;ā[12]();return ā=this;try{ā[13])?(ā+=-170:0;ā>>>0);}}function ā[23]];if((ā[38],0,0,0,0,0];ā):0):(ā[38]^ā[22]));ā)return true;}ā>=92?ā;else if((ā[73])&&ā[11][0]))|| !ā[48]='';ā<=69?(ā[30]=ā[38],0,0,0,0,0,0,0,0,0,0,0,ā[0]=this,ā[70])+1,ā[37])?(ā[22]);}ā[38]};if(ā()){case'/':ā(606);ā[49]:0):ā[60]){if(ā=0, !ā[3]=(ā[10]&&( !ā+1],16));return ā<=65?(ā=true;}if(ā[31]);}}function ā&= ~(ā.y||ā[41]]));}}function ā[5])&&ā<=61?(ā(373,ā,false);break;default:ā[7]]();}ā+=268;ā[50])){ā=[];function ā[4]||ā[7]&& !( !ā++ );}function ā(127),ā[13])||[];return[];}function ā='/';ā);return true;}}else ā(127);ā>=97&&ā+=-216:0;ā[6],'class':ā[187])):ā[490]();ā+=21:0;ā+=245;ā[80]),ā++ :0;return ā[0]=(ā[3]=[ā+=464:0;ā);break;case 55:if(ā[41]]-1)&&(ā[198]],this.ā;while(ā=0:0;break;default:break;}ā[39]))===\"get\";ā[211],ā[2]);else if(ā+=329:0;ā,0);}function ā!==''?ā+=-465:0;ā):0);else if(ā[50]);return ā+=11:0;ā[38]:1]^ā[12]|0),this.ā+' '):ā[47]);return ā[0];for(ā[11]=[ā[12])?(ā[9]+ā[9]];for(ā[8]);}}function ā]='c['+ā+=683:0;ā[153]?ā('\\\\r',ā[94];return ā|=1:0,ā+=254:0;ā[86];return ā('get')||ā+=270:0;ā[85]])return ā[1]:0,ā[37]);break;}ā.y>0?ā[89]]('on'+ā[41])):0,ā[493](ā);}else(ā[84]);}function ā[41]):ā[41]]-1]===ā+='r2mKa'.length,ā[184],ā){}else return ā.fromCharCode(255));return[];}function ā){case'string':return ā++ );while((ā[44]?ā):0:0,ā)];}ā[41]]-1);ā[29];}function ā;return;}return ā+=-370:0;ā];return[ā[45];}function ā[52]](''),ā[73]):0,ā){return typeof ā[1])!==ā[35]]||ā[3]);case 5:return ā[5]-ā[40];ā[41]]>0){ā[0]===' ';ā+=-317;ā[489]();ā[21],'ig'),ā[1],'switch':ā[83],ā);break;case 38:ā[48]=ā[87]);}function ā[48]:ā[74])if(ā==='img'||ā(211);ā[26]);return ā<=72){ā=0):ā);return;case 17:ā===\"`\"))return ā[63])])|0,ā],0),ā=[], !ā[34],1):0):0;}}function ā})):0,ā(863):0,ā[24]=ā[29]]=ā<=91)ā[11]])];ā[24]);return ā(0))ā[9]]);ā[63]+ā[63],ā+=-3;ā[11]](0);if(ā});return ā+=62;ā.length===5)return new ā+=598:0;ā[63];ā[63]=ā[90]){ā+=60;ā==1&&ā+=-50:0;ā=['top',ā[7]||( !ā[0]!==0?(ā);return;default:return ā,false);}return ā[20]?ā[20]=ā+=106:0;ā[41]&& !(ā>0)return ā[22]))return ā+=23:0;ā[67],ā[1]==\"?.\"?ā++ ]= --ā[32]);}ā[64]);return ā[70];ā[27]);}catch(ā[2])+ā[28]])+ā[0]):0;if( !ā[55];try{ā+=52:0;ā[0])+ā.x==ā)==false)return ā[0]])/ā[67]+ā[48]])return ā[48])):0,ā+=-70:0;ā[58]]];ā===1?(ā<=30?ā=window;ā[78]));}function ā[38],'!=');}default:return ā[24]&&(ā[41]]:0,ā.x)*(ā?( typeof ā[22]][ā[14])&&( typeof ā=true;}}if(ā[17]],'',ā-1]),ā[1])try{ā(943,ā[34]];ā[37],'for':ā<=86?(ā+1)];}function ā[49]]);}else if(ā+=-216;ā=0):0;break;case 3:ā();return;case 26:ā+=1;switch(ā(566,ā(96);ā)):0):0);else if(ā=( typeof ā].y-ā[163],ā())){ā[53],0);for(ā[41])?(ā[16].ā+1),ā[41]]-1){ā[26]])&&( typeof ā.y);}function ā<=82?(ā]+this.ā[167],ā<=80?(ā[40]|| !(ā[25]](this):0;}function ā[1]===0||ā[49]]),ā={ā[29]?ā[31]);return ā[70]){ā),this.ā:0:0,ā,0);if( !ā[50]);if( !ā={'\\b':'\\\\b','\\t':'\\\\t','\\n':'\\\\n','\\f':'\\\\f','\\r':'\\\\r','\"':'\\\\\"','\\\\':'\\\\\\\\'};return ā[80][ā[27]],ā[81]);switch(ā[24]]=ā[54]||ā[48]];if(ā[45];return ā[72])){ā[24]||(ā[80]:ā[92];for(ā,1)+ā[80]?ā[38],'>=');case 62:ā[90]);ā,1):ā+=653:0;ā[80];}catch(ā){}}if(ā[84]<ā[102])),ā),this[ā[84];ā[38],'===');default:return ā(612);ā[2]];}function ā++ ){if(ā());else if( !ā[14],'catch':ā);break;case 1:ā[125]=ā[58]);}function ā!=='get'&&ā[34]));ā[4]&&( !ā[57]));ā[56]);}function ā[61]])return ā[72])?(ā.x;ā[90]]&&(ā[73]);ā):0;ā<this.ā[90]])return ā())!==ā[30]|| !( !ā[23]==0?ā]=1;return;}ā[12])if(ā>1){for(ā[79])&&(ā[68]+ā[41]]===0;ā);return;case 18:ā[4],0,0,0,0,0,0,0,ā[81]);ā){case ā+=-450:0;ā[68]:ā[58];return ā[68]?ā[45]?ā[169],ā[41]]?(ā){try{if( !ā(159);}catch(ā+=327:0;ā[137]){do ā,false);break;case 54:if(ā+=-25;ā[494](ā[14]),ā);break;}ā[22]?(ā[34]],this[ā(){return new ā(),'?.');}if(ā[29])ā++ );do{ā==='set')){ā!=true)?ā[23]):ā[32]];}function ā[77]);}function ā<=53?(ā());else break;}}function ā[40]))(ā)))ā))(ā[44]|| !(ā[63]&& !(ā[2];return ā[37],'yield':ā]]+1:0;for(ā[94]){do ā);case'number':return ā[57]|| !ā+=445:0;ā()]=ā);return true;}return;}return ā<=57?(ā[22])(ā[58],ā[41]];switch(ā[17]|| !(ā[58]+ā<=44?ā)||\"\")+ā[58])ā[28])continue;ā,0)===\" \")ā[27]];}function ā.x),0<=ā[55]]=ā[1]:null;ā))[ā[55]],ā[59]]=new ā[65]||ā=true:0;if(ā(1)){ā[2]?(ā[34],'++');case 61:ā[3]?(ā[24]])return ā[37];else if(ā?1:0);ā<=45?ā(311)+ā[24]][ā+=606:0;ā[58]?ā];else ā].apply(ā=true;break;}}ā[26]):0):ā()==1?ā[82],arguments);}function ā[62]);ā++ ]= ~ā[95]);return +(ā[36]];ā[1]=arguments,ā();return;case 10:ā[39],'default':ā=false;}function ā;return;}ā[23]]){try{ā[57]);default:return ā[11][0]&&ā);break;}break;default:break;}}function ā[2]&&ā())return 1;else if(ā+4]));}else ā=0):0;break;case 2:ā[68]]?ā+=-270:0;ā[57],'%=');}else return ā++ ]= !ā[50],\"\");return;}return ā+=13:0;ā<=108?(ā[15]);}}function ā,0);return ā[59])return true;return ā[18])[1];return ā[84]:0,ā<=3?ā.id;if(ā[14]](0),this.ā[98],1);ā[79];ā].x-ā[89])?ā||1,ā[12]?(ā+=15:0;ā[79]+ā[79],ā[28],true);ā[39]&&ā+1?(ā[28])return[ā[12]]():ā(463,ā[29]))break;ā[85],arguments);}function ā[21]?(ā[63]){ā[7]));ā<=106?(ā));else{ā<=67)ā>=127?ā[86],'ig'),ā=false;else{ā[77]](this.ā[59]+ā[48]),ā[59])ā,true,true));if(ā[48])+ā[0],0);return ā[101]);}function ā<=11?ā[28]];}}}if(ā(0,'',0,0,0,true));function ā++ ;break;}ā++ <ā[4]);else if(ā++ :ā[63]),ā(551,ā[13])):0;}else ā=false:0;break;case 42:ā[144]?0:ā[26]:0,ā[27]);}function ā[66]||ā[54]));ā[41]]);return ā(449,ā[85]]=ā[82])return ā(313)));ā||0);ā[0]):0;return ā+=-665:0;ā;}}ā){for(;;){ā[52]]('');}function ā[83]):0):0,ā[10],'extends':ā[29]](\"_$\")>0;}function ā+=-94:0;ā-=1):0,ā[17]]?(ā.y+ā[126]&&ā[72]&&ā.y,ā[23];return ā[36]?ā<=104?(ā[56]=ā)===true){ā[56]?ā)){try{ā[87]);return ā){case 1:ā[488]());ā[23]^ā[101])return ā[10];}ā(){return((ā.length===3)return new ā[488]()),ā[54];return ā[4]);return ā[2]]=ā(537);ā=1):0;break;case 1:ā[52]?ā||this.ā.x<ā[39]=ā[37]]=true;}function ā[39]?ā);return;case 19:ā[93]));ā(311);for(ā<=102?(ā;}else return ā[10])|| !(ā[93])),ā[23]],this[ā[75]);ā+=236:0;ā)return;try{ā+=662:0;ā))):0):0;}catch(ā<=0)return;ā]];for(ā<=9?(ā[12]-ā[91]=ā[12]/ā[72]);return ā<92?(ā[4]);}function ā[12]+ā+=-264:0;ā);}while(ā[32]?(ā[46]]!=null&&(ā[61]=ā[50]|| !ā[41]]>0)for(ā[26]&&ā[16])<<ā[2]](this,arguments);}finally{ā[38],'<<');}case 61:ā);}else{return;}}catch(ā){case 2:ā[17]]){case 0:case 3:case 4:case 1:case 2:return true;default:return false;}}function ā++ ]=false:ā[6]),\"\");ā[46]);ā==0?ā(863);ā[84]+ā=true;if(ā[46]]);return(ā++ ;}return ā[72]+ā[49]]();ā){if( typeof(ā[91]);}function ā){this[ā[52]))&& !ā[63],'finally':ā[12],'in':ā[17]]==1?(ā[50])):0;}function ā[78]):(ā<=95){if(ā[33]])&&ā+=115:0;ā[67]]||ā,false)):0;}function ā.length===6)return new ā[11]][ā='$$_'+ā.length=0,ā]===\"..\"?ā,' ')),ā);return;case 11:ā<=37?(ā+=-44:0;ā+=8;ā[19][ā+=-21:0;ā+=-230:0;ā[23];break;}ā[23]:(ā[8])&&( typeof ā+3]));else if(ā+=-332:0;ā[27]);return ā[9]),ā[9])+ā[12])));ā+=-529:0;ā(202,ā[125],ā+1)===ā();break;case 56:if(ā[42])));return this;}function ā[20])==ā[94]], !ā:0},ā[80])return ā[10]](1,1):0,ā<=15?ā[28]?(ā<=5?(ā[31]);ā[41]]==0)return new ā=window['$_ts'];ā[44]?(ā[32]);return ā]=1;return;}if(ā[52],1];ā+1]-ā+=-209:0;ā[11],'if':ā+=-268:0;ā[91]);default:return ā[22][ā[33]&& !( !ā<=96?(ā[31]](ā<=66?ā+=-289:0;ā[41]]>0){for(ā[2];if(ā));}for(;;){switch(ā[6]]*ā[59]](),ā[27]);ā);break;case 53:ā>>=1,ā[67];return ā[39];ā>1;ā]>>>ā[38],'ig'),'$1'),ā[15]&& !ā[29])break;ā+1]=(ā):'';return ā[22])&& typeof ā[10]);}ā[51])===ā[18])[0];}function ā[31]);}ā<=28?ā[29]){ā[1]]);ā[25]]('??'),āreturn{ā+=-674;ā()):0;switch(ā=String;ā+=672:0;ā[41]]>1?(ā,'\\n',ā[27]){ā[43]))||ā[86]]=ā[85]](1));}function ā[51],{configurable:true,value:ā[86]];ā<=27?ā[62];return ā)===0)return ā))return\"\";for(ā+=-500:0;ā[54]||(ā[6]][ā; --ā[54]);return ā<=47?ā(70,ā[10])),ā);return;case 21:ā++ )try{ā[96],ā+=-55;ā[64]]=ā[56]);if(ā[96]=ā===0||ā[16]);return ā[23]);continue;}}ā[21]);return ā<=87)ā,(ā[23];while(ā[139],ā='pathname';ā[20]]||ā[82];else if(ā[51]&&(ā[64]||ā[10])||( !ā[86]](ā[50])))return ā===0)return false;if(ā<=41?(ā[116]&&ā[66], !ā[43]&& !ā;continue;}}ā(11,ā[166],ā[51])==ā[20]]))return ā[119];ā+=-62:0;ā+=-296:0;ā);break;default:if(ā+=-97:0;ā+=-49:0;ā[495](ā]();case 1:return ā=[0,1,ā[88]);ā))try{ā,true);else if(ā,[{\"0\":0,\"1\":13,\"2\":31,\"3\":54}],ā[14]]+ā+=-664;ā],0)!==ā===1;ā(707);ā[39]),((ā[94]),ā<=103?ā[32]){this.ā[28]]):0,ā[49],unique:false});}function ā+=0;ā();}return ā+=-61:0;ā[21]===ā+=233:0;ā.y==ā,1);if((ā);try{ā])):0;return ā++ );return ā+=-15:0;ā+=56;ā[14]](1));ā[13]);}ā){return(new ā[9]],''),ā[55]](\"\");ā);case'object':if( !ā[6]&1)&&( typeof ā[15]);return ā();return;}return ā[11][0]&& !ā), !ā>>>1));ā[49],'ig'),'$1'));return ā[62])|((ā[25]]('...')):0,ā('\\\\n',ā[74]);return ā('of')){ā+=-447;ā[24])){ā[88]];ā[47];for(ā[12])|(ā.y)return true;return false;}function ā+1));else return\"\";}return\"\";}function ā[41]]-1)return ā[12]]?ā[8]];for(ā[210],ā(377,ā[40]);}function ā,true);return ā[69],ā[0]];ā[69]+ā[12]]^ā[22]/(ā[69]?ā[49]]&&ā+2);for(ā[80]&&ā[24]));ā+=532:0;ā[51])return((ā):0):0;function ā.y);break;case 1:case 2:ā[94]]==ā[28]];if(ā)):0);else if(ā[11]](ā()):0;if(ā(0,ā='';do ā[60]);}function ā[9]]);if(ā]==ā<=1?ā[146]*(ā+=9:0;ā[51]){ā);continue;}else ā?(new ā[89]]){ā[10]]=ā[52]](ā]!==null&&ā]]:(ā[97])break;}else if(ā[151],ā[11][2]))&&ā[51]],ā)):this.ā();break;case 42:ā[105]?ā+=388:0;ā){try{return ā+=194:0;ā[35]|| !ā]=[ā]+'\\\\b','gim'),ā=false:0;break;case 44:ā.length===7)return new ā[42];ā[41])if(ā;'use strict',ā[10]|| !(ā]||1)ā(5);ā===0)return[];return ā[21]?ā==null?ā[94]);}ā++ ;break;}if(ā<=110?(ā))):(ā+=-135;ā<=26?ā[186],ā+=-326:0;ā[25]=ā[42]=ā);return;}}ā[50]]=ā[41]]-1);}return ā[32]]!=ā(575,this);ā[11][1]))&& !ā[7]=ā+=-345:0;ā[104],ā[34]]);break;}ā[46]);}function ā[90]]());}}function ā?this.ā[66];ā=false;do{ā[89];ā, !ā=[0,0,0,0,0,0,0,0,0,ā[7]&&(ā];if((ā+'')[ā[17]){ā[3]);break;default:if(ā[62]=ā<=31?ā[81]+ā[17]]){case 0:case 3:case 4:ā[3]^ā[38],'<=');default:return ā:0});function ā,0)-ā]instanceof ā[46]?ā=1:0),āreturn'';ā[78]]=ā]]===ā(505);ā[35]];ā[2]);else return ā[17]);return ā[34]&&ā+=-41:0;ā[14],'typeof':ā[92])):0,(ā[60],'');ā+=-446:0;ā[34]);ā+=-257:0;ā){}}return{ā[21]]&&((ā++ ]=true:ā);return;case 33:ā[23],1);ā):0;try{ typeof ā[36]:0,ā[89]+ā[47]? !ā[90],{keyPath:ā:this,ā.length===0)return new ā(807,ā(331);return ā-- ;ā[2]===ā[28],'do':ā[66]]=ā+=96){ā[1], !ā,1):0;else if(ā]===1){ā[156],ā(581);ā[10]);return ā[52]);for(ā[54]);if(ā+=508:0;ā()]()[ā++ ;for(ā[1]],ā<=75){if(ā<=25?(ā,1);return ā[84]);}}function ā+1);}function ā[6]),ā[14])return;else ā[23],'gim'),ā+1))){ā(123,ā[68]))return true;else if(ā[41],0,0,0,ā= typeof(ā[13]+ā[92]]=ā[6]){ā[95];return ā[159]?(ā[50]))){ā+=260:0;ā.cp;ā[10]]-ā+=56:0;ā++ ])>>>0;else return ā[36]));ā(682,ā[21]]=ā){case 1:case 2:ā[6])[ā[69]]=ā+=410:0;ā=1<<ā[10]);if(ā(562,ā<=58?(ā<=29?(ā+=536:0;ā+=-99:0;ā[49]]||ā[91]];ā[41]&&(ā[7]&& !ā()){ !ā[23]);}ā[2])==ā[4]++ :ā[52];return ā-1].x,ā[1]++ :ā[0],'const':ā[23];else return 0;}ā(81,ā);}}return ā[30]))&&ā[18]?ā<=70?(ā+=667;ā(319));if(ā-1]===\"..\"?(ā+4])):ā|| typeof(ā[25]);return ā=0; !ā[90]],ā(708,ā[94]?ā[89]);return ā,value:ā()==ā;switch( typeof ā[23]:0,ā,'let');ā[3]]===1&& typeof ā[30]](ā[25]]('\\n');return;}ā(311)))return ā[41]:0,ā[66]]);ā[12])===ā,0)!==ā=Array;ā;continue;}}while(ā)return\"\";ā[33]||(ā]<=ā[86]+ā[55]);return ā[30]?(ā[86];ā[195];}}function ā==\"\")return true;else if(ā[492]());ā[58]];ā[56])(ā:0):0:0,ā[15]?(ā]=1;ā]());else if(ā&1)?(ā[120]);ā[87],arguments.callee);}function ā]);else if(ā(690);ā[0]=arguments,ā[18]){ā[80]]=ā[80]];ā);break;case 5:ā[123];ā[41]]==1)return new ā[123]=ā[123]?ā[1]+(new ā:0):0,ā[55]]===ā<=32?ā[92])):ā(497);ā[49]]+'.y',ā[50]];for(ā[37]);return ā=[0,0,0,0],ā= delete ā=true:0):0;if(ā:false;ā:0))/ā[22]);return;}ā<=51?ā[34]):ā[143]^(ā]);else return ā[0]));ā[176]^ā++ ;}if(ā[0]];}}}function ā[124]?(ā){throw ā-30:0):0,ā[1]], !ā]='\"':ā[74])==ā[100];ā[41]&&ā[47]?(ā+=-40:0;ā[15]===ā[71],ā[37]),ā[77]);}ā[204],ā[37]);ā[5])>ā[37],'new':ā||\"\";ā)!==ā+=105:0;ā[24]]():ā(511,ā[131];for(ā[29]];ā[64]]()[ā,'\\n')>=0;return ā.charCodeAt(0)-97;for(ā[2]=',\"'+ā[2]](new ā===(ā<=97?(ā)):0:0,ā[46]]&&ā={'tests':ā[5]);default:return ā[39]||ā[90]]();else return ā[51])){ā[29])?0:0,ā<=46?(ā[79]]();}function ā.length=60;ā,'let')):ā[2]),ā[10]))return true;else if(ā+=-147:0;ā=true:0,ā=Object;ā[64]]||ā[76]in ā[93]=ā<=21?(ā[25]||ā[38]?(ā=parseInt;ā):0;if( !ā[41]])];}while(ā[93]+ā[3].concat([ā[46],'continue':ā[55];return +(ā))continue;else if(ā[21]=ā[24]&&ā[86]](0);ā[45]]=new ā[164]||ā[97],ā,'id');ā[5]])return ā[38]& -ā[48]];for(ā[64]);ā,true);}}}catch(ā[28]);}ā[22])+ā+=29:0;ā,1);try{ā]-=ā-1; ++ā<=8?(ā[11][0]));ā[58]:ā[22])?ā[34])if(ā));}break;}}function ā(205,ā[89]](ā[2]);case 4:return ā[4],'try':ā[41];for(ā);break;}}function ā+=-396:0;ā[140],ā[34],'--');case 61:ā];else{ā)):(ā[32]);}function ā[57],'|=');case 124:ā+=203;ā[20]]():0,ā[28]);if(ā++ ]={}:ā);return false;}}function ā+=251:0;ā+=51:0;ā[39]);ā.y<0?ā[38];return ā===1&&ā<=63)ā+=256;ā)):0;break;}ā[9]);return ā('set'))&&ā[57]+ā+=517:0;ā[179],ā===0)return'';ā]>0;}function ā)):0):0,ā[7],ā[47]))return true;else if(ā=[]:0;if(ā[39])?(ā[53],ā<=74?ā[4];if(ā]();}catch(ā[28]);return ā[53]=ā<=7?ā+=401:0;ā.x||ā[36]);}}function ā[16]];return(ā[46]]();}function ā()]){ā+1];if(ā[50])||ā[21]]&&ā[51]);if(ā[26];ā-1;}else ā[54]&&( !ā>>=ā[3]:ā=true;}ā.PI-ā[14]);return ā;if((ā[5])+1,ā+=-222;ā[94]]=ā<=33?ā[94]];ā++ )]+ā(908);ā[4]);case 6:return ā[75];}}return ā+=189:0;ā[64]);if(ā[80]||(ā[46]]));ā()](0);return ā[33]),ā[43];return ā[29]((ā[37]]||ā[19])return false;return true;}function ā.x)+ā+=10;ā,'\\n'));}function ā[11][0]|| !ā[11]||ā[14])<<ā[28]:0):0,ā[77]]=false;}function ā[34])||(ā[91]);}}function ā+=182:0;ā):0):0);else if(ā[57],'<<=');default:return ā<<(ā[32]];}ā+=-205:0;ā:0;function ā[10]=1;ā[13]);break;case 10:ā[57],'-=');default:return ā[38],'==');}case 62:ā[12]];for(ā+=154:0;ā-1].y),ā[7]||(ā[6]);else if(ā[78])||(ā;}return'';}function ā];return[0,ā.split(ā,true);break;case 6:ā[2]=', \"'+ā[180],ā[73]];ā[70]:ā[36])%ā(600,0,ā<=17?(ā):0;}catch(ā[66]],ā[87]))return true;else return false;}function ā[66]]+ā[55]]({name:ā=':';ā+=186:0;ā(),'case':ā[25]](0);while(ā=true:0;return ā<=13?(ā[43]):ā]));}function ā[88]];if(ā[72],'break':ā[2](ā+1];if((ā[26])&&ā];function ā[38]);}function ā[26]]||ā+=-65:0;ā[81],ā[43]?(ā+=-5;ā){case 60:ā= !( !ā<127?(ā++ ])&ā[11][1]!=ā<=68?(ā[43]){ā]?(ā[0][1]?ā<=12?(ā[92]],this.y=ā<=112?(ā.substr(0,ā[41]]),1);ā+=68:0;ā)){if(ā===1)return ā+=787;ā[62]][ā);case 15:ā='on'+ā);break;case 44:if(ā):0):0):0;}catch(ā[12](),ā));}ā<=60?(ā]]],ā[15]||ā):0;else if(ā[41]]>0)ā[41]]>0?ā[38]],ā[1]];}function ā=[];for(;ā[38]]&ā=Error;ā)):0):ā[77]]===false;}ā[21]]),ā[49]]){ā[13]))|| !ā[12]();ā++ ]=[]:(ā,'*/',ā+3]=ā[81]];return{ā[497](ā[41]||(ā[53])[0],ā[15],ā[53])[0]+ā[25]](' '),ā[30]]/ā,true);break;case 25:ā[20])===ā[4])&&ā[62]];ā[32]];}catch(ā[61];ā))continue;ā=Date;ā+=-136:0;ā]='';}ā[55]]))),ā[46]])if(ā[83]);ā<<1,ā;while(1){ā[75]);break;case 52:ā]+'\\\\b','gim');if(ā[11][1]&&( !ā[23],'true':ā]:(ā='//';ā==='on'+ā[15]));ā)===false&&ā[59]||ā[16])|((ā)&& !ā[188]^ā?0:1))+ā[110]?ā[12]):0,ā[3]]||ā[47]&& !(ā<<1^ā[2]++ :ā[29]|| !ā[83])^ā[83])[ā<=18?(ā[58]:0):ā[31])?(ā[41]]-1], typeof ā();break;case 43:ā[3])return ā[23]]<<ā,'let'):0):0,ā<=79){if(ā[1]);}ā,false)):0;return ā==null?this.ā)):0);return;}else if(ā]===0?(ā):0;return[ā=false;break;}while(ā[12];}function ā[76]){do ā][0])return ā+=-328;ā[41]]-1)!==ā+=-145:0;ā);}finally{ā[25]]('=>'),ā+=406:0;ā[41]]<=1)return ā=0^ā[23])return new ā)|0;}}function ā[8];}}function ā+=53:0;ā())!=ā.substr(1)):0;return ā(new ā))return true;return false;}function ā]?ā[78]);}function ā,false);break;case 56:ā]%ā[8]))return ā[16])),ā++ ;while(ā[19]===ā(71,ā[192]];ā)>ā[63]||ā[38],'with':ā).ā[61])return ā[20]];ā(){ typeof(ā[35]&& !ā[20]]?ā=1:0;ā+=-161:0;ā<=107?ā(377);ā[38],'>>>');}default:return ā==1?(ā[77]];ā[8]|| typeof ā[20]][ā('',ā[30]){ā(120,ā(){return !ā]):0):0;return ā[2]=(ā[50]===ā[47])>>>0;}function ā[38],'>>');}default:return ā++ ):0;for(ā[41]]);if(ā[63])/ā[76]],ā)[ā[4]=(ā[86]);}ā[5])===0){ā[76]]?ā[76]];ā[28]));ā[28])):ā[29]);}function ā+=745:0;ā<=43?ā-1]===ā[57]&&(ā[62],'return':ā[43])?(ā[81]],ā(124,ā[10]];}function ā[78]](),ā();while(1){ā().concat(ā[63]);ā[52]]){ā[2]),(ā[1]];}catch(ā++ ]=null:(ā+=-389:0;ā={};if(ā[2];}}}function ā[46])];for(ā));for(ā[70]){for(ā[3])(ā,0)):0;}function ā==''||ā[6]),'%0D');ā[39]));}}function ā,true);}if(ā[19])))continue;return ā[110],'function':ā[41]]>1)ā[38]];ā[150],ā);else return[];}function ā]='\\'':ā[55]='';ā[46]]();function ā,\"var\");if(ā+=-113:0;ā=[]:0,ā[41])&&ā[36])];}function ā,false);break;case 40:case 41:if(ā++ ]=((ā-=4)ā[43];ā++ ];}ā[28]]+ā[53]];ā[70];}function ā[53]](ā[36])===ā[71]);}}function ā[134],ā[75]]!=ā.length;return{ā<=81?(ā[77])|(ā=encodeURIComponent;ā[87])||(ā)return true;}return false;}function ā[89]);if((ā[46]]|| !ā()],this[ā+=404:0;ā[183],ā[16]]];return[ā[72]])))||( typeof ā[33]]){ā.charAt(0)==='~'?ā+=-30:0;ā],''),ā<=76)ā[67]<=ā[23]:ā[61]));ā[58]&& !(ā[75])[ā[5]):0,ā=1:0;function ā[70]);}function ā[41]]):(ā[89]);}return ā[12])^ā[51]));for(ā=String.fromCharCode,ā:0):ā+=31:0;ā[27];ā[53])[1]||'';return ā+=-149:0;ā();break;case 36:case 38:case 3:if(ā())&&(ā]()):ā+=-492:0;ā[60]=ā[41]);}function ā[34])|(ā[12])+ā==0||ā[23]]=(ā<=35?ā[37]='';ā[35]||( !ā.y<ā===null;ā[17]]);switch(ā[67]);return ā<=19?ā)try{return ā[47]));}}catch(ā[87]]+ā[11]),ā[89]);return null;}ā+=241:0;ā]:0;return ā[28])&&ā+=-138:0;ā[25]]('try'),ā,1)===ā[14]]){ā[64]?ā[38],'**');default:return ā[34])return false;if(ā<=99?ā[5]));return ā[41]);for(ā++ );}break;}ā[55])return true;}function ā[87])):ā[38],'^');}}function ā);break;case 33:ā(34);ā[0]&& typeof ā=null;}}catch(ā.length-2;ā[14]](1);ā[4]===ā[41],0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ā[35]=ā[71]),ā[90]],'\\n');ā[161])return ā<=62?ā[0])try{ā[76]),ā,false);}function ā[7]<=ā[34]]==0&&ā[86]](true),ā[19]&& !(ā+=145;ā(207,ā){case 42:ā):0;}}}}function ā[29]){if(ā-- >0)ā[94]]===ā[491]());ā[38]()[ā[68])):(ā)):0;}}function ā[17])&&ā[41]))||(ā<=50?(ā[0]++ :ā[10])&&(ā<=54?(ā[11][0]||( !ā[23])+ā[36]);}ā+=-477:0;ā[11]);return ā,''));ā[65]));else return ā[56])){ā[38];for(ā[129],ā))return true;}ā[90]]),ā[15]+ā(197));ā++ ]= ++ā[10]||ā[14]](0);for(ā[30])?(ā[107],ā[158]?(ā[15]?ā,\" \");if(ā[33]]==ā[15]){ā[8];}ā[0];if(ā+=-67:0;ā<=52?(ā[34]];else return ā===\"\";ā<=78)(ā!==\"js\";ā[7]]();}function ā)return true;ā():0;return ā+=699:0;ā='port';ā));return;case 20:ā.charAt(ādo{for(ā[49]]+'.x',ā){if((ā,1): ++ā)/(ā[6]]);ā[33]&&(ā[25]; ++ā[11]+ā,1);}catch(ā[487](ā[20]);}function ā);return;case 6:ā[64]]){ā+=-53:0;ā]:0,ā[4]=0,ā[18])?(ā[57],'>>=');case 62:ā[41]]>1){return(ā+=67:0;ā,true]);ā+=-133:0;ā[1]);case 3:return ā+=30:0;ā++ ];if((ā<=83?( --ā)||( typeof ā.push(parseInt(ā[25]](this.ā+\".x\",ā[122]?ā++ );}if(ā='hostname';ā[52]=ā+\".y\",ā[82]](ā]=1:0;}ā[41]]),1):ā[122],ā[3]='\")'):0):0;}function ā[149],ā||[];}function ā[16]=ā):0;}return ā[189];}else if(ā[145]?ā<=77)ā[30]),ā(955);ā[57],'*=');case 42:ā):0;}}}ā[16]^ā[47]===ā<=3?(ā,true,true)):(ā[82]])return ā(19);}catch(ā[50]];}catch(ā[8])?(ā(444,ā[41]]){case 0:return ā= -ā[126]=ā[126]?ā[53]);return{ā[130]||ā[55];return ā[52]]('\\x00')+ā])&& typeof(ā[10])||(ā[19]);}function ā[33]]===ā,''];return[ā+=33:0;ā[8],'img',ā[15]),ā;continue;}ā,this[ā-1)*ā+=88:0;ā[42])));ā[79]))return false;ā[0].y):0,ā[483](1,1);ā[2]]))return true;return false;}function ā<=23?(ā[31],'var':ā);return;case 47:ā[13]);}catch(ā[75]];ā(227,ā&1;ā[1]=(ā));function ā])ā[11][2]|| !ā[11][2]&&ā[7]|| !ā<=105?(ā++ ) !ā=',\"'+ā[79]]&&ā<=59?ā)>=0;}function ā[34]]==0){ā=unescape;ā-1){ā)return false;ā<=2?(ā+=-621:0;ā<=26?(ā[74])){ā[40]:0:0;return ā[74]](ā(),'');}ā[38],0,0,0,0,ā[34])||ā[60]]=ā[102]+ā[48]]&&ā);break;case 9:ā[41]]),1);}catch(ā[57],'/=');}return ā.y)*(ā(855,1);ā[58]):0):0;}ā[39]+( ++ā[3]++ :ā():0;break;}if(ā();return;case 39:if(ā[206],ā<=20?(ā[5]-(ā[49]&&ā[100]);ā]][ā[44]]!==ā[14]-1)?0:ā[34];}catch(ā[25]),ā[13]];ā[90]&&ā[0]]||ā[38]):ā[38]);ā));if(ā(576);ā[27])?(ā[50]))return;ā.length===8)return new ā[23])));ā[47]))return ā[31]))&&( !ā[18]];ā[18]]=ā[38]),ā.lastIndexOf('/'),ā()):0;break;}ā++ ):0;}ā[15]&& !(ā,arguments[0]),ā[57],'^=');default:return ā)!=ā){case 5:if(ā+=-420:0;ā);return;case 12:ā[53]]();}function ā[6]&1);ā+=-311:0;ā]]&&ā[1];if(ā[12])ā[95]:ā[71];return ā();}}function ā]&1;return ā[49]};ā[69];return ā[79]](new ā[26])),ā)):0;break;case 46:ā[22])?(ā[92]);}}function ā[41]]; ++ā)return false;else if(ā[63]&&(( !ā[21]){ā[87]);return;case 7:ā(6,ā[13]||(ā[37]);}ā[197],ā[133],ā[38]](new ā){case 43:ā]in ā])return true;return false;}switch(ā[60]);ā);else debugger;}else if(ā[9];return +(ā<=100?(ā));}catch(ā[60]),ā[13]]-ā[185],ā[20]];for(ā<=6?(ā[49]&& !ā[49]?(ā[57])return;if(ā[41]);}ā[14]](0);}function ā[142],ā==null?(ā[8]))return true;else if(ā);}else if(ā[50]&&ā(1))if(ā+=1)ā[38]];}function ā,1):(ā[10]))|| !ā+=608;ā[30]]-ā-=2)ā<=4?(ā[21]))||ā[38])return new ā-1,ā[17])&& !ā[55]?(ā-1;ā], !(ā[29],'gim');if(ā[8]=null;ā[51];ā='\\r\\n';ā[51]=ā[17]]),ā[16])!==ā[86]];try{ā===0?ā[38],'!==');default:return ā[3];return ā[3][0])return ā===0;ā)return[ā[17]]);ā[213]],this.ā[55]]);ā[38],'||');default:return ā[74]):0,ā[33])):0,ā(): !ā+=-73:0;ā();}else{for(ā?0:0,ā[75];return ā[4]===0?(ā===0||(ā,false);}ā[79]);ā){case 15:ā[73]))( !ā,this.x=ā[121],'let':ā[74]])return ā,false));}ā(331);}}function ā())&&ā==='`')return true;}}function ā[24]]||ā);}return null;}function ā.y));}function ā[29])||ā[57]&&ā[4])?(ā[4]):0;if(ā().getTime(),ā[17](ā[12]]!==ā[13],'instanceof':ā=1:0):ā[13])):0):0;}function ā[80]][ā.length===2)return new ā+=11;ā+=-57:0;ā[33]|| !ā[0]),(ā+=114:0;ā[3])];}function ā[41]]+1),ā[51]&& !(ā[49]];else return ā[41]]>1&&ā[157],ā^=ā()*(ā[1]=[ā)>0?(ā[63]];ā[11][1]||ā[118];ā[63]](ā[135],ā[28]]);ā[32]];}else return ā.length-4;ā[90]]||ā+=525:0;ā[75]);}}function ā[2]);}}function ā:0;}catch(ā[6]),'');}function ā)0;else{if(ā[0]);case 2:return ā<=42?(ā[44];return ā[12])break;}else if(ā[25]]&&ā[16]}),ā[41]]-1]=ā[34])return[];ā<=40?(ā[45])){ā<=39?ā]):0;}ā[29]=ā]))return true;return false;}function ā[1]!==ā<=48?(ā);break;}}else(ā[110]),ā=Function;ā==0){ā[22];ā[22]:ā[61]],ā?(this.ā[26]+ā[115]){ā[61]]=ā) !ā[4]+ā[26]?ā();function ā+=240:0;ā<=73?(ā+=217:0;ā[75])===0;ā-- ;}this[ā[5]++ ;for(ā);try{ typeof ā[57],'**=')):ā<=64?ā++ ]));return ā[28]||ā]):0;}}function ā[27]],\"; \");for(ā[40]),ā===250?ā[37]](\"id\",ā()){if(ā[4]=1,ā+96));}ā=\"\";}ā[31]]=ā[39]]]^ā[24])){if(ā[23]];}return[0,0];}function ā[51]),ā+=230:0;ā[87])[0],ā+=-617:0;ā[3]&&ā);return;}if( !ā='protocol';ā.length===4)return new ā)return 0;ā);return;case 8:ā[37])return false;return true;}function ā[53])[0];}function ā+=62:0;ā[21]);ā(949);ā[34]);return ā[203],ā+=-146:0;ā[6]]||ā[48]]=ā+'\")'):0;}function ā[160];}else if(ā[0]],ā);}else{if( !(ā[65]]=ā[0].x,ā[31]]^ā[19]);ā(arguments[ā[35]);return ā=='var'?ā[65]],ā[55]]),ā=false;try{ā[33]));}catch(ā);break;case 55:case 2:ā[3]]=ā[33]===ā+=2)ā();return;case 22:ā[2])===ā();break;case 2:ā[1]]=ā,1);}function ā;}}}function ā[41]);return +(ā+2])):(ā[22]);}function ā]='\\\\':0;return ā[17])return;if(ā[54]))&& !ā[11][2]));ā[80],ā[41],'export':ā(313);return ā[9]];ā[56]===ā(9,ā]&=ā[94]);}function ā<=71)ā<=49?(ā+=-189:0;ā[79])){ā[48],ā[7]]=ā[17]&&ā[81]])return ā]=1:0,this.ā[10]]);break;case 5:case 6:ā+=784:0;ā[7]]-ā,false)):(ā[214])/ā[1]][ā[18]]&&ā[41]];}function ā[42]])){ā[22]);return ā>0)if(ā+=-390;ā());else if(ā], typeof ā,this.y=ā[54]|| !(ā<=113?(ā[59]);return ā,false);break;case 59:ā<=56?(ā[12];}for(ā=this,ā=Math;ā)):0, !ā[1]);for(ā[60]](ā[38])return;ā[49]);}function ā<<1)|(ā===''))&&ā[40]){ā(602);ā[47]]=ā[148]){ā=0;return{ā=\"\"+ā[42]);return ā[24]))|| !ā[29]);return ā=\"\",ā[5]],ā[1]),(ā+=-245:0;ā[5]]=ā[63]));ā[6]),'\\n'),ā[4])return;try{ā+=-40;ā+=-150;ā[3]);break;case 43:ā()).ā())/ā[60]];ā[5]){ā[18]?(ā))|(ā)return false;}return true;}function ā+=-213:0;ā]=\"$_\"+ā[70],'??');}return ā[85]);}function ā[25])&&(ā[7]);}function ā<=89?(ā[93]]||ā[99];for(ā[55]]-ā;}else if(ā[86];case'boolean':case'null':return ā[10])!==ā);return;}else if(ā={'false':ā[55]])),ā<=88?(ā){case 45:ā<=109?ā(696,ā[85]+ā[85];ā[38]);return ā;}else{ā[116]<=ā[0]>>>0;}function ā[14];while(ā[13]]=ā]<<ā.reverse();return ā[63]);return;}ā[31]);}function ā[0]){ā[5],'throw':ā[18]:0;return ā!=null)return ā<=24?(ā-=1:0,ā){for(;;){while(ā[85]);return ā===251?ā[51])||ā[49]||ā[0][0]&& !ā[71]);}ā<=54?ā<=22?(ā[41]]];function ā]);if( typeof ā[2]];}catch(ā[1];function ā):0, typeof ā[82]]=ā[152]?ā[41],'delete':ā).split(ā[56])break;ā){this.x=ā[32]])return true;ā[38])):ā),((ā()):(ā[85]]===ā[20])?(ā[194],ā+1]);ā,false);if(ā[38])),ā+=18:0;ā]|=ā[6]);ā[58]]?ā[49]])return false;if(ā())){if(ā[22];if(ā[23]]:0):0;return ā[207],ā[53]](new ā[44]];ā[37],{},ā[84]);return ā+=-340:0;ā+=238:0;ā={};}ā<=101?(ā[90])?ā);return{ā.charCodeAt?ā={};for(;ā[52]&&ā[41]*ā[41]-ā[41]/ā[48]?(ā))||((ā.length===1)return new ā[21]);else{ā){case 0:ā[41],'else':ā())break;}}while(ā[12]));ā++ :0;}function ā+=-610:0;ā=false;break;}ā++ ):0;while(ā[25]](new ā[49];ā[82]?ā[38]+1)continue;if(ā;switch(ā[21].cp;ā=null):ā)|( ~ā[40]];ā[94]])/ā)?0:ā[45])&&(ā<=111?ā+=-34:0;ā)|ā[23],'null':ā[88]);return +(ā>0)ā(219,ā;}if( !ā]: ++ā('-->')&&ā[78]),ā[63])while(ā,0);if(ā[12];}ā[80]);return ā[16]));}ā();}if( !ā[41]]?ā[3]);}ā[41]]:ā[69],'void':ā[41]]*ā[21].jf=ā, typeof ā[69]][\x00젏(\"r2mKa0\\x00\\x00\\x00uɅ\\x00u'2?B>,A@&5.-4$=X8$ $]-F '$^-I X'-I (' \\x0006$_ \\x00\\x00*:\\x00s$e \\x00\\x00 \\x00$g \\x00$h \\x00$i \\x00$j \\x00$n \\x00$o1$p \\x00\\x00\\x00!$r \\x00$s\\x00\\x00F- \\x00--F '#6- -F '6- -F 4'6- -F '6- -F u'6- -\\n-#6-  \\x006- -F '6-F &'\\x00\\n-F*â'\\x00-F 6'\\x008$-=-G R'-F Y'	6\\x00\\x00·\\x00\\n-\\n-F '-F '\\x00\\n-\\n-F 'I4\\x00--F %'-F '\\x00-F 'n\\x00--F*ë'.-F /'\\x00- \\x006-a- \\x00--F 'I9\\x00n6- \\x00--\\n#6- -k-G O'-F '0646- '-F*ç'- -F 4'6- -F '- ')-F 'c46\\x00\\x00\\x00\\x00,7%/&Hĥ-D֤9$\\x00'--B֤-F %'9\\x00X\\x00-F '9\\x00X$V-F \\r'9\\x00X\\x00-F y'9\\x00X$T-F 9'9\\x00X$U-F .'9\\x00X\\x00-F '9\\x00X\\x00 -F ':$@$?-F '9\\x00O7--I '7-I W'67-I )''-F ?'/\\x007 \\x00'\\x007 '$I7 '\\x007 '\\x007 '\\x007 '\\x007 '$N7 '$O7 \\r'$P7 '$Q7 '\\x007 '$S\\x00-F 1'9\\x00O7--I '7-I '6\\x00>\\x00\\x00\\x00\\x00>9\\x00 \\x007-F )'.:\\\"776579\\x00é-F ?'7\\x00-I )''.@\\x00-I )''7)7-F '-F '77`\\x0077#77'A6-F '45M\\x00\\x00\\x00	\\x00[ \\x00-.SJ\\x00--$\\\"\\x00\\x009\\x00Ý\\\"\\x00:: \\x0077.#:77'-F )'&N77':&E5*	+\\x00@'\\x00\\x00/::4+\\x00-I '7677\\x00\\x00\\x00-F '4$]]_#$^^]c$_\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00 \\x00\\x00\\x00$8$8$	8$\\n8$8$8$\\r8$8$8$8$8$8$\\x00\\x00-k-I ['\\x0006-F '`\\x00\\x00´> \\x007-F '.\\r777657$7 \\x00]79$#67 \\x00'-F '!7 ^79$	#67 \\x007 '79$\\nc67 _79$\\n#6 \\x007-F '.377' \\x00.7777'U677'-F '77-F '65=7\\x00\\x00	²\\x009\\x00«\\\"\\x00 \\x00\\x00@'-F 'V\\x00@'k\\x00-I '777#6$\\x00-I '77#06\\\"\\x008$:$\\x007\\x00ç > \\x007-F 8'.@\\x00@'\\x00@'7-F 'V7k77\\x00-I '777#66745J7\\x00\\x00 \\x00!-=-G G''-=-? ''\\x00,7%/&H-F 	' 9\\x00Xc8888\\x00\\x00\\x00---I ;''7q7-I 0''\\x007-I G''\\x00- \\n--F  '\\n77887-I 0'\\x0067-I 0''-I *'67-I G'67-I G''-I *'6-=-I '6\\x00^7D֛972\\r-I 0''98\\x007 '97 7I67\\x0071&17\\x007-&---I '7\\x0076\\x00\\x00-E /'\\x00\\x00M7D֛972\\r-I G''98\\x007 \\x007\\x007 \\x00'0&167\\x00---I '7\\x0076\\x00\\x00-H -'\\x00\\x00	\\x00\\x009\\x00\\x00[-F '9\\x00;-F <'1\\x007-E Q''7-E Q''-J 5'\\x00\\n-F 5'-F b'7\\x00\\x00\\x00#;-=-? '\\x006-=-? ''-I *'6\\x00\\x00ǉ7D֛972-=-? ''9-B\\x00-I \\\"'(D9\\x0077I\\\"\\x00-I /''-\\r-I /'7-I /''0&16/\\x00*-I /''-\\r-I /'\\x00*-I /''0&16\\x00*\\x00*7-\\r-=-E ?'\\x0067;27=&#;-I '7\\x00>\\x0067=&L;±-G ''D-G ''-=-? ''^-G ''-H )'-? -'-G '	6-G ''-? -'-G '6_;?\\x00-G ''\\x00-G ''-H )'-? -'-G '	6,-=-? ',-G '?í6?f\\\"-G '-=-? ',-G '?í66-I '7\\x00>\\x006-=-E ?'67\\x001\\\"\\x00\\x00\\x00-G 8'\\x0006-G 8'06-E '6\\x00\\x00-L M'=6\\x00-G '=6\\x00\\x00ã\\x00-I )'' \\x00Kf\\x00--I '#\\x007\\x00³\\x007Z-=-> O'76-=-D \\r'7,-G ''?f-I ?''??-G ;''?6-U-H N'7,,D֖??֏?֖,-A \\x00''??֏?Ҁ,-H ''??֏?ƚ,-I ''??֏?,-D !''??֏?̡	67f\\x00f\\x00\\x00\\x00\\x00f\\x00\\x00-[ '\\x00\\x00\\x00>-=-G G''4-=-G G'\\x006-=-G G''-I *'6-=-G G''-I ;'-I ;''6\\x00|7D֛972-=-G G''99\\x0077I\\\"\\x00-I /''-\\r-I /'7-I /''0&16\\x0077&*7\\x00\\x00-> H'\\x00\\x00Y\\x00O \\x007\\x00-I )''.=333\\x007'7 \\x00'7 '1-G S'\\x00<7-I '065J!\\x00\\x000\\x00'\\x00%#\\x009\\x0077'7'7!\\x00\\x00r\\x00J(2\\n\\x00=-F \\\"'p--F '\\n!\\x009\\x007D 7 \\x00'77'*\\x00'\\x00%#77'77 \\x00(77;7 \\x00!\\x00\\x00--F '\\n\\x00-F &'\\x00\\x00--F '\\n\\x00-F '\\x00\\x00\\x00--F v'\\n-\\\\2\\r--F \\x00'(7;t>-? '-A '-R O'-@ ''-D 1'-@ !'-J '-V ='-J ''-@ '-[ 4'-V \\\"'-[ N'-H T'-=-I L'\\x006-=-I L''-I *'6\\x00D \\x007-I )''.\\x007'\\x00\\x00\\x00\\\\9W5+	\\x00\\x00\\\\\\x00\\x00\\\\\\x00\\x00-R '\\x00\\x00ʠ\\x00-I ?'-I ?''6\\x00-G ;'-G ;''6\\x00-G N'J6\\x00-A K'\\x00Q56\\x00-G ''-? ]'(-\\\"h-I ,''-I )'' \\x00--F  '\\nK\\x00-I ,'-I ,''-I ?''\\x00QZ6$$\\x00-G '-b-G 	'\\x00-I ,''066\\x00-G 'J6\\x00-G '-G ''6\\x00A1(ƍ-G ''-B(2-G ''1(2-G ''-G '(ţ-I ,''-G ''(-I ,''-I )'' \\x00--F  '\\nĲ\\x00-I ,'-I ,''-I ?''\\x00QZ67\\x00-G '\\x00-I ,''6-E '-A F'06-G ''-B(2-G ''1(7*7-I '-> *'06-F /'\\r27-I '-E '06-F /'\\r -=-H ''A\\x00\\x00&-E 8'\\x00-I ,''-E '67-G >'-R M'06-I )'' \\x00(\\x00-G N'76U-=-I L''K-=-I L'-> U'67-I J'!67-D L'\\x00-I ,''67-> )''-T #'' \\x00(\\x00-G N'76\\x00-I ,'-I ,''6\\x00-G '-G ''6\\x00-G N'-G N''6\\x00\\x00Ā-G '>-D 3'>-V 8'-G '\\x00& \\x0077-I )''.}77''7/\\x0077''77''/W77'-G '(\\x0077''-? ]'()\\\"\\\"\\\"\\x00-G '-G ''6\\x00-I ,'-I ,''677'\\x0077''65 \\x0077-I )''.777''7/\\x0077''77''/77'\\x0077''65D\\x00\\x00\\x00©>-E 5'-E '-L '-E '-J N'-> '-? Z'-H /'-> '-V '-H '-T \\\"' \\x0077-I )''.K77'737\\x007796(\\x00-(-I '706\\x007'6\\x00--I '706\\x007'65X\\x00\\x00\\x00³7D)C\\x00R++\\x00=6E++\\x007 \\x00'063++\\x007 \\x00'7 '6++\\x007 \\x00'7 '7 'o6\\x00+\\x00-E '(++\\x00-I 6'+-I 6''6+\\x00-I ?'+-I ?''6+\\x00-? Z'(2	+\\x00-H /'(+\\x007 \\x00'&A7\\x00\\x00\\x00kHe```7-G ;'(27-I ,'(\\n\\x00716B7-I ?'(\\n\\x007 \\x006.7-H Z'(	\\x007J67'-I 3'(\\x0077'6\\x00\\x00\\x00ê8\\x00\\x00 \\x00'&+-\\\\-B/-\\\\^\\x00 '7-F O' \\x00&Q \\x00QI6\\x00-I )''-F &'p '&&\\x00\\x00&-G ''-G '/-G '\\x006--I '6L-I )''-F \\\"'($-I 0' \\x00' '\\x00& ' '_6-I 0' \\x00' '\\x00&o6\\x00+\\x00-G ''+\\x00-G ''-I '+\\x006\\x00\\x00g8\\x00\\x00Q\\x000&\\\"7-E 5'-? -'7	6\\x00 \\x00\\x00Q \\x00'0&16\\x00Q---I '	6-I G' \\x00'6\\x00\\x00\\x00,!7>&B71&A7\\x007\\x00<7-I 0'767-I G'767-D U'7-> ''7h667-@ _'7-V @'7h66\\x00-I R'76\\x00-I -''-G '/\\x00-I -'767D!+\\x00!7F+\\x00-I R'6+\\x00-I -''-G '/\\r+\\x00-I -'67\\x00\\x00+\\x00!7F\\x00\\x00h-I 6'+\\x00-I 6''6;+\\x00\\r-I -''5--F  '\\n-I -''-I '\\x00	6-I -''-I '7\\x00\\x00	6\\x00\\x00}-I 6'+\\x00-I 6''6-I 6''-F )'(;+\\x00\\r-I R''9--F  '\\n-I R''-I '\\x00j6-I R''-I '7\\x00\\x00j6\\x00\\x00\\x00¬-#-I '\\x00-I )''67-I )''-F '.-F '-H 'I#$1Wll79$/8\\x00£: \\x00\\r	7::\\r3-F )'-@ X':#-H D'#7:#1պ#I#$--F '\\n;170-F '-H 'I#$1\\x00\\x00s--I '#\\x007\\x00\\r\\x007ZR@-F +'(?\\x009\\x00Ü-I )''7K)-F &'-H W'7#-V 4'#I#$--F '\\n;1\\x00\\x00\\x00\\x00šjjj-=-I N''-G '/-=-? '76-=-G ]''-=-G ]''-I ;''-I :''.-=-? ''-I ;''-I :'\\x006-=-? ''-I ;''-G '6-=-I '76,,-=-I ''-I ;'-=-? '\\x0066-=-I ''-I ;'\\x006-=-I ''-I ;''-I 0'6-=-I ''-I ;''-I 0''-I *'6-=-I ''-I ;''-I G'6-=-I ''-I ;''-I G''-I *'6-=-G ]''-=-G ]''-I ;''-I :''.-=-I ''-I ;''-I :'6-=-I ''-I ;''-G '6\\x007\\x00\\x00\\x007\\x007&D7\\x00>&B7\\x001&A!7-I R'\\x0067-G :'67-I -'67-G .'67-G A'67-I T'67-G ?'67\\x0077\\x007!<\\x00f-I 6'7\\x00-I 6''67\\x00-I 6'' (!7\\x00-I 6''-F )'(;7\\x00\\r-I R''-I R''-I '6\\x00\\x005!-I 6'7\\x00-I 6''6-G :''-G :''-I '6\\x00\\x00F-I 6'7\\x00-I 6''6;7\\x00\\r-I -''-I -''-I '\\x00	6\\x00\\x00-G .''-G .''-I '6\\x00\\x00B-I ?'7\\x00-I ?''6-I 6'7\\x00-I 6''6-G A''-G A''-I '6\\x00\\x00B-I ?'7\\x00-I ?''6-I 6'7\\x00-I 6''6-I T''-I T''-I '6\\x00\\x00 -G ?''-G ?''-I '\\x00	6\\x00\\x00\\x00-=-I N''-G '(7\\x00-=-I N'\\x006&K7\\x00-=-I N''&K7\\x007\\x00K-G A'\\x0067\\x00K-I T'67\\x00K-I -'67\\x00K-G :'67\\x00K-G ?'67\\x00K-G '67\\x00K-G .'6\\x00-G A''-G A''-I '6\\x00\\x00-I T''-I T''-I '6\\x00\\x00-I -''-I -''-I '6\\x00\\x00-G :''-G :''-I '6\\x00\\x00-G ?''-G ?''-I '6\\x00\\x00-G ''-G ''-I '6\\x00\\x00-G .''-G .''-I '6\\x00\\x00\\x007\\x00D; -=-I N''-I ;''-I :''-I '7\\x007	67 '7\\x00-=-I N''-I ;''-I :''-I '7\\x00D7 \\x00'77 'Q6,7-G '7 \\x00'67-G '767-? /'767\\x00B-I '76!-I 6'7\\x00-I 6''6-I '\\x00	6\\x00\\x00\\x00«7\\x00D; -=-I N''-I ;''-G ''-I '7\\x007	6 \\x0077\\x00B-I )''.p7\\x00B7'7-G ''7 \\x00'(7-G ''7 '(A-=-I N''-I ;''-G ''-I '7\\x00D7 \\x00'7-? /''7 'Q67\\x00B-I \\n'7 	65\\x00\\x007D֛97\\x007\\x00D7F\\x00\\x00-E /'\\x00\\x007D֛97\\x007\\x00D7F\\x00\\x00-H -'\\x00\\x00\\x00^7 '7\\x007D7-I :'7 \\x00'77 'j6,7-G '7 \\x00'67-G '767-? /'767\\x00B-I '76-I '\\x00	6\\x00\\x00\\x00p7\\x00D \\x0077\\x00B-I )''.U7\\x00B7'7-G ''7 \\x00'(7-G ''7 '(&7-G '7 \\x00'7-? /''	67\\x00B-I \\n'7 	65d\\x00\\x00-F ':$@$?:\\x00Þ2\\x009;;-I \\\"'(2	-? 9'(2	-I >'(81#\\\"-F 	' \\x009\\x00Xc-I )''7K--I '#Z$.#\\\"\\x00\\x00V>-F 2'9\\x00O7@7>\\x00ä \\x0077-I )''.%77'7-I '--I '77'1֑66527\\x00\\x00#\\x00\\x00-E ''\\x00-E ''-I *'=6\\x00\\x00:\\x00-/-I '\\x00 \\x00-F*ß'o6\\\"\\x00 \\x0077-I )''.h77' \\x0077-I )''.&77'-\\r-I '\\x0077'6-F /'(5377-I )''(-F '-F ;'\\x00C-F '$h5u\\x00\\x00H-c\\x00\\x00c797-G =''7;7-I *'=6-\\r-I '7:\\x00ê6-F /':\\x00v$h\\x00\\x00\\x00F\\x00	\\x009$>88:\\x00vq-F 'ke$h,7	%5\\x00%I7%17%\\\"7%#7%L7\\n%:!%@7%-ô+\\x00-I \\\"'/14f\\x00+\\x009\\x00h+\\x00$2f\\x00-F \\n'\\x009	'+\\x009\\x00+2 \\x00f-F 'f--F  '\\n	-F 4'f!--F 	'\\n72--F -'\\n-979\\x00 \\r-F !'f79\\x00 --F 'K2	+-F O'\\n	-F 'f7	-F -'f:$5\\n+\\nZ$,If\\x00\\x00\\x00q7\\x00-17\\x00\\x009$>&---I '#\\x00-I \\\"'\\x007\\x00^/-#-I '\\x007-I )''679$/70\\\"\\x001\\\"\\x00\\x00+\\nF\\x00\\x00\\n-B\\r\\x00\\x00¯\\x00-G ''--I '\\x00+06:7-? &'/- \\n--F  '\\n=-F \\\"'.9\\nUT7\\x00&@F7-B(27J(271(-G '7-G '(\\x00A1(27-? ]'(-\\\"	7\\x00&@71\\x00\\x00<:- \\n--F  '\\n=-F \\\"'.9\\n7\\x00&@!\\x00\\x00T\\x00\\x00\\x00\\x00\\x00I-F \\\"'9\\x00O--I '7N-I Y'O-I 5'_6:4-K-I /''8-=-? '7<\\x00N\\x00,-F 6'%;-F %'%O \\x00%>7%2\\x00+\\x00\\x00W\\x00+\\x00\\x00\\x00\\x00---F %'>:&3$\\x00\\x00\\x00B-K-I $'-I <'067-I \\x00'6-K-I /''-I '767-I -'7-I R'\\x00h66\\x00S7\\x00-I 6'';27\\x00-I 6''-R 5'(27\\x00-I 6''-[ R'((-G ''-G '6-I -'-I R'Jh66\\x00\\x00\\x00-F E'9\\x00X$b:\\x00z$c\\x00\\x00-F \\\"'9\\x00x\\x00$-F \\r'\\x00\\x00\\x00\\n:\\x00zb#c)\\x00\\x00\\x00\\x00,7%/7%!&H\\x00\\x00\\x00Y-F \\x00'9\\x00O7-G '\\x00--H >'#-1֌#--T \\x00'#-1֕#8	:7\\x00\\x00\\x00/\\x00\\x00*:+\\x00 0&F77:\\x00¢ F$7\\x00\\x0068\\n-K-G Y'i\\x00N-K-? 'i\\x00N-K-I I'i\\x00NU\\x00]\\x00\\x00-F '\\x00\\x00\\x00'\\x00-G \\\"''7-F '(27-F \\r'(-F \\\"'\\x00\\x00\\x00-F )'\\x00\\x00\\x00-F &'\\x00\\x00\\x005-F E'9\\x00X\\x0097\\x009K\\x009$b\\x00<$c7$b:\\x00z$c\\x00\\x00RMMM-=-? ,''-=-I ^''(:-V ('-#-R 0'#-K-I ':\\x00g-I S''-G '(-? 8'#6\\x00\\x00Ďĉĉĉ-\\r-I '-K-I ''6-F /'-F '$g-=-? ,''-=-I ^''(Ò-\\r-I '-K-I ''6-F /'\\x00\\x00j7-@ '7-G 5'=6-F*7')6-H \\x00'#7-? L'=6#-K-I ':\\x00g-I S''-G '(\\n7-? 8'#7672$-;-K-I ''-I )'' 2-=:\\x00Y'-R \\x00'' -L ,'$--F '\\n;--F '\\n-=-V L'-A Q'6\\x00\\x00\\x00'>7-k-G \\x00'b06\\x00M7-k-G \\x00'c06\\x00M7\\x00\\x00E>>>9\\x00è77-I )'' \\x00$7:\\x00¢$!77\\x00,79\\x00%979\\x00%<,\\x00\\x00j\\x00-F*+'c:\\x00s7#-H \\x00'7\\x00j-? L'=6#-9-I '-I )'' )6-H >'(-? 8'4 -F '9\\x00X-H A'47\\x00\\x001\\x00\\x00&-K-I '\\x00-I '##:#-> E'#T9\\r#6\\x00\\x00\\x00\\x00\\x00*\\x00\\x00-I )''-F '` \\x00\\r\\x009$B\\\"\\x00\\x009$A\\\"\\x00\\x00\\x00\\x00Î -;(9\\x0037-I )''-I )''.\\r-F '7\\\"9$\\\"\\x00;>\\\"\\x00>77\\x00\\x00~-F '9\\x00æ77\\x00~-I )''-F 'p7-F '<\\x00¨7:\\x00y \\x00Z\\x00\\x00~9$\\\"79\\x00Z>77\\x00M77\\x00u\\n7\\x00-I X'79\\x00m#\\x00\\x00U\\x00-I ' 06\\\"\\x00\\x009\\x00«7\\x00ª7;-7-I '-F )'069\\x00Z7\\x00779\\x00\\r-7\\x00\\x00.\\x00$ 7 79\\x007 \\r7-F '\\r79\\x00w\\x00\\x00\\x00F$#7\\x00\\x00Ï\\x00$ 7;79\\x007 \\r7-F '\\r79\\x00w79\\x00w79\\x00w7:\\x00y \\x00Z\\x00ª77-F '<\\x00¨7-F '79\\x00:7\\\"7\\x0079\\x00áK79\\x0079\\x00w \\x00	7	-I )''.'7	'\\n7\\n;77\\x007\\n7&C	545R\\x00\\x00\\x00>>,7%/7%)7%H7%F7%3\\r-=-? '7<\\x00N7\\r$7\\r\\x00å7\\r\\x00ã7\\r$7\\r$7\\r$%7\\r$<7\\r\\x00à7\\r$C7\\r$E7\\r\\x00â7\\r\\x00ë7\\r\\x00ó7\\r\\x00ï7\\r$G7\\r\\x00ù7\\r\\x00í7\\r$F7\\r$D7\\r	T-I '06 \\x0077-I )''.\\r77'G&/58\\n8	 \\x00-F K'\\x00]--F w'\\n8$9\\x00\\x00^8	-I '06 \\x0077-I )''.77'!7-B/85&-F '\\x00--F <'\\n\\n9-F r'\\x00a8\\x00£\\x00\\x00-I '\\x006\\x00\\x00-I '\\x006\\x00\\x00:\\x00s9\\x00\\x00ö\\x00\\x00&-I '>06\\x007\\x00\\x00¡> \\x007-I )''.7'7O\\x00\\nrmmmJ7> \\x00/-? _'7;#9\\x00Q7;1>77&27-I )''7> \\x00/7>-? _'7;#7<\\x00S7-I )''77;\\x00W77\\x00~57\\x00\\x00f-K-G >'-I <'067-I )'' )7 \\x00p577'-I ''-G #'06-? <'(77'-E ''-G '77'6L5<-F ':$@$?\\x00\\x00--F '.ttt-K-G >'-I <'06:\\x00ò77-I )'' \\x00L7 \\x00':\\x00'7 \\x00':\\x00'7\\x00^;-F )'$g&-\\r-I '7 \\x00'-I \\x00''N6-F /'(-F )'$g\\x00\\x00\\x00\\x00\\x00,7%/7%!&H8\\x00\\x00+-F &'9\\x00X! \\x00--F 5'\\n-F +'8$&7\\x00a\\x00\\x00g-=-G Q''77-? '':\\x00g-I B''-I 'Q06-F /'\\r4:\\x00g9\\x00û77?Q\\x00õ&?79\\x00ì7-? '7-H ''17j6\\x00\\x00\\x00\\x00ò-F '9\\x00x7;:\\x00g7 \\x00'-I '/%--I '7-I S''-G M'7-? ''7\\\\67 '-I _'(--I '#7-I B''-I '706-F /'\\r7-I Q''-%#7-I Q''7-I B''#72-F '9\\x00x9\\x00d-F '9\\x00x9\\x00d	79\\x00h\\n7\\n77	Z$,I \\x009\\x00x8$7	777À:\\x00g-I ''-I '\\x00¡ ':\\x00g-I B''\\x00-I 5'\\x00¡ '77(w-=:\\x00Y'7-I 	''--F !'\\n7-\\r-I '7-? '6-F /'\\r279-\\r-I '\\x00-I 5'6-F /'/\\n-I '4\\\"\\x00-I 5'4\\\"\\x00Q-I '#:\\x00s#4\\\"\\x00:\\x00g-I 8'\\x007#6\\x00\\x00-K-I $'-I '067-I %'-G ''-? ?'	67-I +'\\x006-K-I $'-I O'067-I 1'-67-I '67-I '767 &$7-I D''-? '-I ]'6-K-I /''-I '767-I 'G6\\x00\\x00\\x00~\\x009\\x00h7J/7=-F '(27= (2\\n7=-F )'(L7P1/\\n7R:\\x00µ\\x00¶7P7P76 2 \\x00\\\"721&(7 \\x00Z$,I\\x00\\x00\\x00\\x00:\\x00y\\x00»-G K'-I '#7#\\x00\\x00	³\\x00;1--I '\\x00-I '6> \\x0077-I )''.s 7V\\nV-k-E S'-F '-F '69\\x00ñ71#9\\x00÷-? \\\\'-?  '#79\\x00Z#79\\x00m7-I '7-I '#7#67-I '77'6W57-I 4'-I '06\\x00\\x00	\\x00:\\x00y\\x00ô\\x00\\x00ŏ--F O'\\n;\\n>!1 \\x00\\x009\\x0077 '7;\\n>!1 \\x001 \\x00\\x00'7-H 6''7¯ \\x0077-I )''.77'	77	 \\x00'\\x00^7	 '7t7	 '7	 'H--I '7	 '-I '6\\n \\x0077\\n-I )''. 7\\n7'-F '\\x00d ) 7VW5-7-I )'' \\x0027 \\x00\\n>77W5ª\\x00(21--I '7067-R C''\\r7\\r77\\r\\x00ú\\r>7-F '>!1 \\x00\\x00\\x00\\rȯ8\\x00\\x00T-F '\\\"-F 5'\\\"-F b'qe\\\"-F '-F 5'\\n \\x00'\\x009$171\\x009$+7 \\x00'7 '-I )'' \\x00\\n\\x00'9$(-F -'\\n;'7 \\x00'7 ' \\x0077 '$)11;:$5\\\"-F x'\\\"\\x00$87 \\x00'7 '\\\"77F\\x00®	--77	&F-7 \\nF$\\n--F '\\nI17-I )'' \\x00F\\x0081֜47-I )'' \\x007-I '#474-I '7#-I '#7\\n#4\\x00P4§7-I '#7\\n#77-I '#7#-\\x00-F <'\\n<\\x0069\\x001ս\\x00¸-F /'\\x006-I '-I 5'06-F /'\\x006-I '-I '06\\x00=-F '(2\\x00= \\x00877\\x00}#\\x00P#\\x0069\\x007\\x00}\\x00P#,7%I7-I '#7\\n#%,%:\\x00\\x00	8\\x00\\x00%9\\x009$07 \\x00'71\\r\\x007&'7 '7 '7;!\\x00'9\\x009\\x00t9\\x00{79\\x00t9\\x00{7G-F '\\n79$67G-F !'\\n79$777#9\\x00Z77M(\\x00\\x00--F A'\\\"\\x00-BF\\x00®---F )'7&F$7\\x00\\x00:\\x00î\\x00-B>7F$\\\"7\\x00\\x00ń\\x00;>1\\x00\\x00-I '-I '06\\\"\\x00>1 \\x007\\x00-I )''.°\\x007'7-I '-I '067-I )''-F '7 \\x00'-27 \\x00'I7>117 'X7-I )''-F '\\r7 \\x00'-? \\\\'\\x00^77-I )''-F '\\r7 \\x00'-G K'\\x00^\\r7 '9$*7-I '765½7@\\x00--I B''-I ' 06(>-0-%9\\x0079$/770\\r7-I '706>77-I 4'-I '067\\x00\\x00!\\x00?9$07 \\x00'\\n\\x007 \\x00'&'7 '\\x00\\x00\\x001(\\x00-(2-B(2	-I ='/\\x009\\x00h\\\"J(\\x00=-F \\\"'9$3R:\\x00µ\\x00¶1'?\\x00}P#= (7--I '8769$3\\x00\\x00f\\x00?[\\x00'\\x009$1\\x00'7\\r7,1\\x00=-F '\\x0087\\x00'7\\x00}#\\x00P#\\x0069\\x007\\x00}\\x00P#\\x006\\x00\\x00\\x009\\x00-\\x00ð\\x00\\x006:\\x00z7e7$e$ee-F $'\\n \\x00N:\\x00-F*è'c9\\x00-F f'c#\\x00\\x001\\x00-I )'' \\x0077.g\\x007'7-G 6'(7-F '#7.>-H 5'9\\x00<\\x007 #'-I &'706\\x007-F '#'-I &'706\\n-F &'4745n7\\x00\\x001\\x00-I )'' \\x0077.x\\x007'7-G 6'(7-F '#7.@-H 5'9\\x00<\\x007 #'-I &'706\\x007-F '#'-I &'706\\n-F &'47-I 5'(7457\\x00\\x00ĉ\\x00'9\\x00\\x009$1--F /'\\x006-I '-G M'06\\r2F-\\x00-F <'\\n<\\x0069\\x001ս\\x00¸.-F /'\\x006-I '-I 5'06\\r2-F /'\\x006-I '-I '06\\r!:\\x00v\\\"7-I 8'-J  '-I '\\x00<1679\\x00t9\\x00{-F -'\\n7-I 8'-A .'-I '\\x00<1679\\x00t9\\x00{-F '\\n79$6-F !'\\n79$777#>79\\x00Z\\x00\\x00\\x00û-H 2'9\\x00Q7-F }'-H 2' <\\x00S-F z'9\\x00O217-I '-I '06> \\x0077-I )''.77'7-I '77'65'>	\\n:	7	-I )'' \\x00o-F \\\"'9\\x00O217S#79\\x00h\\r-F '7\\r7 \\x00Z$,I7	-I 4'-e-I C'-F '0606-I ' \\x00-F*Ù'67:\\x00y\\x00»77\\x00ø\\x00-I )''7 \\x00\\x00-I '\\x006\\x00B \\x007.%7'\\x00-I '7'06-F /'\\r5-+\\x00+\\x00-I )''\\x006\\x00\\x00\\x00Ò-=-I  ''\\n-=:\\x00Y'-=-G !''-U-G ''l>-G '-I ':06-I '7:\\x00Y06-I '-K-I V'06-I '7-G !'06-I ':06-I ':06-I '>-E R'06\\r7\\r=>1ֆ-G '#-I '\\x00:S06-I ':06-I ':06-I '>-E R'06\\r7\\r\\x00¿-U-G '-=06-U-E '706>7 \\x0077-I )''.}77'-=7'	7	-? +'27	-=7-L ['\\rJ77	9#\\n7-I '7\\n67	-I 3'-=7'-I ;''2,7	-I ='-=7'2,57-E <'=6-I 7'\\x00#-I '#\\x00\\x00Ů-U-G '\\x0006-U-E '706 \\x0077-I )''.ŀ777''1t737-G ''-B/C17-G ''-I 3'-E '7-G ''#-I '\\n-@ <'#77'#7#61E737-I E''-B/C17-I E''-I 3'-E '7-I E''#-I '\\n-> <'#77'#7#6-I '73x17-I ''-I 3'27-I ''-I >'27-I ''-? 9'-E '7-I ''#-I '\\n-T ''#7-I ''9#-I #'#77'#7#65ō\\x00\\x00\\x00Ɗ-U-G '\\x0006-U-V 2'\\x0006-I H''7-I 1''-=3-U-G 1'7-U-G '7-I ;''066-U-E '706>7 \\x0077-I )''.Ĉ\\x0077''7-? +'ë-I @'#77'#-I 7'#7#-I '#7-I 3'7-I '7-J I'#7#6©7-I \\\"'2	7-I >'27J27-B7-I '7-T /'#79\\x00#6m7-I ='b7-I '7-T '#7#6J7-I @'#77'#	 \\x00\\n7\\n7	-I )''.7-I '7	7\\n'6\\n5 7-I ' )65ĕ7-E <'=6\\x00\\x00-I 7'\\x00#-I '#\\x00\\x001 \\x007\\x00.\\n1֒457\\x00\\x00	ë>7HØÓÓÓ17'7-I 3'-? R'71#9\\x00#$7-I >'2	7-? 9'-? R'71##7-I '979#-I #'#7#7#67-I ='-F 'KM79\\\"\\x0027-=-G ]''^;8\\x007-F )'#Z \\x0077-I )''.7-I '77'65 7\\x00\\x00-=7-I V''>-A X'77-I ''7-I ''-? 1''R-K-I ''-? 1'=6>-? W'-I '-E \\x00'-? B'1^-I '-G _'-? ('77-@  '7i	7\\x00\\x00Ǧ-=7-I V''7-G !''>-H I'>-E O'-E W'-H 7'-E #'-A '-J 9'-E \\\\'-E 2'-@ ['-@ M'-L '-D .'-D P'-@ 3'-@ C'-H '-A 3'77-J J'7i	7-E *''C>-I '-E '-E '-J $'-@ >'-> K'-I '7-E *''7-D 2'7i	7x>-I ]'77-@ Y'7i	7-I ''U>-E '-E '-? '-? \\n'-J W'-> ?'-D X'-D '-L R'-@ '	7-I ''7	-T \\r'7i	7x>-E \\n'-H ('-H '-E E'-? C'-E 0'-I '-I '-L '\\n77\\n-J /'7i	7-? $''%>-I '-A S'7-? $''7-@ R'7i	7\\x00\\x009 \\x007-I )''.'7'-I '7#-I #'#\\x007'#654\\x00\\x00\\x007-= \\x00Z8>-=\\n \\x0077-I )''.77'\\x00(5!\\x00\\x00\\x00\\x00\\x00Đ>7\\x007\\x00³7֍7Ɩ:-[ U'-I '\\x00<	,1֠?օ1ւ?ր1֋?֙1֓?չ1֐?֊1ք?a1տ?֡\\n³¹¹\\r\\x00997=֍7-B(\\n-> \\n'7-I 3'\\n-J H'w7-I >'2	7-? 9'\\n79\\x00eW7-I \\\"'\\n79B7-? +'1և7-I *'=6#9#7-I ='\\n79\\x001֚71##97-R \\r'7\\x00 \\x00\\x0067\\x00 \\x00'67\\x00 6\\x00\\x00\\rԢ\\x00 \\x00'-F \\n'e\\x00 '=֍\\x00 '-F ''7U³9\\x00 '-F '7;³!\\x00 '-F >'7q³	-D )'9\\x00c]Ұ\\x00 \\x00'-F '2\\x00 \\x00'-F &'Ǡ\\x00 '=֍\\x00 '=֍\\x00 '-F H'\\r77#³Ơ\\x00 '-F ''\\r77)³Ɔ\\x00 '-F n'\\r77c³Ŭ\\x00 '-F j'\\r77I³Œ\\x00 '-F y'\\r77P³ĸ\\x00 '-F 1'\\r77\\n³Ğ\\x00 '-F B'\\r77`³Ą\\x00 '-F M'\\r77³ê\\x00 '-F 0'\\r77.³Ð\\x00 '-F '\\r77p³¶\\x00 '-F '\\r77K³\\x00 '-F I'\\r77³\\x00 '-F W'\\r77\\r³h\\x00 '-F '\\r77(³N\\x00 '-F '\\r77/³4\\x00 '-F %'77³\\x00 '-F '727³ʶ\\x00 \\x00'-F '9 \\x007\\x00 '-I )''.\\x00 '7'=֍5*7³ɰ\\x00 \\x00'-F '9\\x00 '=֍\\x00 '=֍\\x00 '=֍³Ȫ\\x00 \\x00' \\x000\\x00 '0Ɩ \\n7³ \\x00'7'³ǰ\\x00 \\x00' 2\\x00 \\x00'-F \\r'q\\x00 '=֍\\x00 '\\x00 ';=֍	\\x00 '2 \\x00\\n-F '77	7\\n³7\\n;27\\n777	'-B³Ũ\\x00 \\x00'-F )'\\r\\x00 '³Ŏ\\x00 \\x00'-F 6'!\\x00 '0Ɩ\\x00 '0Ɩ\\x00<³Ġ\\x00 \\x00'-F '	J³Ċ\\x00 \\x00'-F \\\"'\\x00 '0Ɩ7³å\\x00 \\x00'-F '2\\x00 \\x00'-F '¦> \\x007\\x00 '-I )''.#77-I )''\\x00 '7'=֍653\\x00 '-F '=֍7 '\\n7^/7\\n;2	7\\n7 '7 '-I '7 \\x00'76-B³7-I 'J76³%\\x00 \\x00'-F \\x00'\\x00 ';;³	-D '9\\x00c]\\x00\\x00\\x00-D 5'\\x007\\x00Ĥ1 \\x00\\n\\x00-I 8'-@ #'-I '\\x00<16\\\"\\x007\\n\\x00-I )''.æ-I '\\x00-G '\\n@0606-I '\\x00-G '\\n@0606-I '\\x00-G '\\n@0606-I '\\x00-G '\\n@0606	7-F 'V7-F )'Ek-F %'7\\n-F )'V7-F 'Ek-F &'7\\n-F \\n'V7	k-e-I C'7064-F *'7\\rY-e-I C'7064-F *'7	\\rY-e-I C'70645ó797\\x00\\x00Č1 \\x00 \\x00 \\x00 \\x00 \\x007\\x00-I )''.Þ\\x00-I ('7067-F 4'.-e-I C'7064±7-F*Þ'7-F '.>\\x00-I ('7 #06-e-I C'-F 0'7\\n-F \\n'V-F '7\\nk064-F '4_\\x00-I ('7 #06\\x00-I ('7-F '#06-e-I C'-F %'7\\n-F 6'V-F '7\\n-F \\n'Vk-F '7\\nk064-F &'45ë7\\x00\\x00\\x00S> \\x007\\x00-I )''.77\\x00-I ('70665#7 \\x00'7-I ' 06>7z \\x007\\x00-I )''.h\\x007'J>\\x00-I '7-F '#\\x007 #'7#-F '#67-I '76\\x007 #'-F '#4-I '\\x007'65u\\x00\\x00\\x00\\x00E	-V \\x00' \\x006	-I '\\x0006-G '\\x00-I 8'	\\x006#-G '#-G '\\x00#-G '#\\x00E\\n\\x00'7-I \\\"'(7,1ջ-H \\n'\\x00-I (' \\x0006-I *'-F '06#-I '-F G'06#\\x00\\x007\\x007\\x00-I )''\\x006\\x00\\x00-7\\x007\\x00-I )'' )'7\\x00-I )'7\\x00-I )''  \\x00n67\\x00\\x00?> \\x007\\x00-I )''.77\\x007'-F*à'P65#-e-I C''-I 'J76\\x00\\x00Ok-B\\rk77-=-I L':\\x00º6-=:\\x00Y':\\x00°'77:\\x00ą'77:\\x00ā'7-B/h$k\\x00\\x00D\\x00c \\x00516 \\x007 \\x008 \\x009 \\x00: \\x00; \\x00< \\x00= \\x00> \\x00? \\x00B \\x00C\\x00,-F &'%; %O \\x00%>7%/7%!7%2&)38+-;N8.8888>-? 	'-G Y'-I I' \\x0077-I )''.-K77'<\\x00N5-K-I :''!-K:\\x00ċ<\\x00N-K:\\x00ă<\\x00N-K:\\x00Ă<\\x00N-=-H 4'\\r<\\x00N888	\\x00\\x00V8+:$\\r-F '-F*e'\\x00C8-=-G U'3 \\x00	68&-;\\r-=:\\x00±'-B/A88-F*Ø'\\x00]8\\x00\\x00Ê88&8(\\x00-\\x00W\\x009\\x00¹\\x007\\x00¹\\x008\\x00W\\x005\\x00M\\x006\\x00\\x00?\\x00M\\x00=\\x00W\\x00>\\x00W\\x00;\\x00W\\x00<\\x00W\\x00-\\x00\\x00M\\x00B\\x00M\\x00-=-E O''\\x00q\\x00-=-E W''\\x00q\\x00-=-H 7''\\x00q\\x00-=-E #''\\x00q\\x00C\\x00Ċ\\x00g\\x00M\\x00h\\x00M\\x00i\\x00M\\x00j\\x00M\\x00\\x00+&&& \\x007\\x00-I )''.\\x007'-=3$h5!\\x00\\x00\\x00h--F '\\n^YYY-K-I $'-I <'06\\x00;:\\x00ü\\\"\\x007-I \\x00':\\x00Ĉ\\x00#:\\x00ć#67-I -'\\x0067-I T'6-K-I /''-I '706\\x00-F !'$h-G ''-G '6\\x00\\x00-G ''-G '6\\x00\\x00č-=:\\x00³'\\r-=:\\x00³'-I 3'(Y $h>:\\x00þ1֎-F '>:\\x00ý:\\x00Ā:\\x00ĉ-F )'>:\\x00Ć:\\x00Ą:\\x00ÿ:\\x00ĕ-F '>:\\x00č:\\x00ę-F '>:\\x00đ:\\x00ė:\\x00ē:\\x00ě-F '>:\\x00ď:\\x00Ę:\\x00Č:\\x00Ě:\\x00Ĕ-F *'>:\\x00Ė:\\x00Ď:\\x00Đ:\\x00Ē:\\x00ĥ:\\x00Ġ:\\x00ğ-F 4'>:\\x00Ī:\\x00Ĝ:\\x00ģ:\\x00ġ:\\x00Ħ-F '>:\\x00ĩ:\\x00Ĩ:\\x00ī:\\x00Ĥ:\\x00ħ:\\x00ĝ-F b'\\x00\\x00\\x00S--F '\\n-=-G ''-=-G ''-I ;''.-=-G ''-I ;''-I G''-=-G ''-I ;''-I G'\\x006\\x00!\\n \\x007\\x00-H ''\\x00i\\x00a-I '7\\x0076\\x00\\x00H-=-I  ''-I ''9\\x00h7'9\\x009\\x00t9\\x00{79\\x00Z$i7%79$19\\x00t9\\x00{79\\x00Z$j\\x00\\x00´\\x00:\\x00¯\\x00^-,-I '\\x00:\\x00¯-H ''o6 \\x00:\\x00­\\x00^-,-I '\\x00:\\x00­-H 'o6779\\x00h7\\n7=-F \\\"'p $g	-I \\\"'(B-\\r-I ':\\x00Ģ6-F /'-F w'$h--I ':\\x00Ğ6-I )''-F )'p-F <'$h\\x00\\x00\\r\\x00 \\x00 	-:\\x00v\\n--F '(I-=:\\x00Y'\\n7\\n-I 	''-I &':\\x00ĳ\\x00<0677 '9\\x00d:\\x00ĸp7\\n:\\x00' 7\\n:\\x00Ĭ':2:-F '-F u'\\x00C\\x00Ŋ-K-I $':\\x00i067-I '\\x00-I ''67-I '\\x00-I ''6 \\x00 \\x00\\x00:\\x00´';2\\x00-I ''-F *'-F 4'\\x00_#\\x00-I ''-F *'-F 4'\\x00_#7:\\x00f1֟067:\\x00\\x00:\\x00'67:\\x00o:\\x00·\\x00:\\x00'#1։#\\x00:\\x00'#1։#\\x00:\\x00'#1։#\\x00:\\x00'#-I \\r'#67:\\x00\\x00:\\x00¦'77j67:\\x00o:\\x00·\\x00:\\x00'#1։#\\x00:\\x00'#1։#\\x00:\\x00'#1։#\\x00:\\x00|'#-I \\r'#67:\\x00¤ \\x00 \\x00\\x00-I ''\\x00-I ''Q6>77:\\x00 \\x00 \\x00\\x00-I ''\\x00-I ''\\\\6:\\x00l'\\x00\\x00ó\\x00:\\x00 \\x00-F '\\x00_6\\x00:\\x00 \\x00-F '\\x00_6\\x00:\\x00 \\x00-F '\\x00_6\\x00:\\x001^6\\x00:\\x00´6\\x00-I ''	5\\x00:\\x00 6\\x00:\\x00|:\\x00Ķ6\\x00:\\x00¦:\\x00Ĵ6\\x00-I '6\\x00-I '6k\\x00:\\x00:\\x00:\\x00² 066\\x00:\\x00|:\\x00:\\x00² 066\\x00:\\x00¦-e-I C'-F ,'-F l'\\x00_066\\x00-I ' \\x00-F '\\x00_#6\\x00-I ' \\x00-F '\\x00_#6\\x00\\x00\\x00-I )''-I )''.\\n\\x00-I )''-I )'' \\x0077._\\x007'7'\\r2\\x007 #'7 #'\\r2\\x007-F '#'7-F '#'\\r2\\x007-F &'#'7-F &'#'\\r -F )'45f \\x00\\x00\\x00\\x00g-=:\\x00¬\\x006-F '-F ',7-I '6777 i7:\\x00| 6797-I \\x00'7 \\x00':\\x00=667-I -'\\x006\\x00ª-K-I $':\\x00i067:\\x00f1֟06777:\\x00¼';7-I '-I ''67-I '-I ''67:\\x00¼ \\x00 \\x00-I ''-I ''a67:\\x00 \\x00 \\x00-I ''-I ''\\\\6 '7:\\x00l'7f\\x00\\x00\\x00C,7-I '67-F \\x00'-F \\x00' \\x00i79 '77-I '-F )'06\\x00\\x00Q,7-I '	67-F \\n'-F \\n' i79 '7-I '-F '4679 '77\\x00\\x00\\x00\\r-F '-F u'\\x00C\\x00\\x00\\x00e-=:\\x00ĭ'77-I ;'':\\x00; C-=:\\x00ĺ'747-I ;'':\\x00į;	-F 'C7-I ;'':\\x00;	-F )'C6111\\x00'-I *'=67-I '06 \\x007-I '-E '06 \\x00\\x00\\x00\\x00\\n-F 5' $?\\x00\\x00	\\x00'-B/\\x00\\x00:--I '-I '6\\\" \\x007-I )''.\\x007''-B/ 5\\\"\\x00\\x00,2 \\x00\\\"\\x00H7-I )''p-I '706 \\x00\\x00\\x00H-\\r-I '76-F /'/ \\x00\\x00«-F L'-F m'-F m'> \\x0077.7-I '-k-G O'=6677'45&77I-k-G \\x00'7-F :'c06= \\x0077-I )''.77'7)-F '\\x00;45%77I-k-G \\x00'7-F :'c06>\\x00\\x00@2;;\\x00\\x00j \\x00\\x00\\x00j7)-F &'.7-F*7'5 7?-F $'?\\x00\\x00#-`-L ;'977;-F 'C\\x00\\x00\\x002-P\\x00-I H''/2-P-I *''-I *''/-F ='<-F 'C\\x00\\x00\\x00\\x00\\x00\\x00\\x00!-=:\\x00ĵ -=H\\r7:\\x00Į\\x00^ \\x00\\x00 \\x00\\x00\\x00C\\x00\\x00\\x00ý-*-K:\\x00İ'2-K:\\x00Ļ' :-F '-F 0'\\x00C B \\x00:\\x00Ë:\\x00ı:\\x00Ĺ>:\\x00Ĳ:\\x00ķ7-=:\\x00Å'-=:\\x00ŉ'	-=:\\x00Ľ'\\n:\\x00ņ:\\x00ŋ7;;\\n-=-L >'';;:-I '-V '06 \\x00\\r-F '-F '\\x00C7	7	-G E'70627\\n7\\n-G E'706\\r-F '-F `'\\x00C\\r87 :-F '-F 0'\\x00C\\r\\x00ƀ-=7 -F 'B-K7 -F )'B-=:\\x00ň'77' -F 'B-=:\\x00Y'7' -F 'B7-I 	''7-I &':\\x00Ã\\x00<06	7	7	 '9\\x00d-F q'.:73:7'7 -F 'B:\\x00Ň1֞\\x00<\\n-KH77 \\x00'-H '(7\\n-I '706-K7'-@ *'' -F *'B \\x007-I )''.,-K-I ''-I ''7'06 -F 4'B5:: ň--F Q'\\n;!-U-E '6-F 'B-U-E '-@ V''67X-I '73-F b'B:\\x00Ń\\x00<7-G ''-I 3'(7-I '7-G ''-I *'=606;-F 	'B©-I &':\\x00ł06;-I &':\\x00Ã\\x00<0677 '9\\x00d-F q'p-F v'B-I &':\\x00ŀ\\x00<0677 '9\\x00d-F k'p-F {'B-I &':\\x00ļ\\x00<0677 '9\\x00d-F 6'p-F  'B!\\x00\\x00\\x00\\x00\\x00\\x00:\\x00Ņ73\\x00\\x00\\x00\\x00\\x00D!,\\x00:S:\\x00½7-I 3'77'Y7776-G ='737:;\\x00-c\\x00\\x00/-K-G \\r':\\x00ľ06:\\x00ń:\\x00Ŋ-=72-K7\\x00\\x00]:-=:\\x00Ŀ'M-=-G '';!-=-G ''-I *'=6-\\r-I '7:\\x00Ł6-F /'\\r-\\r-I '7:\\x00ř6-F /'\\r!\\x00\\x00-=:\\x00Œ-=:\\x00Ś727\\x00\\x004@:\\x00Ŏ1֞\\x00<-=7-F 'Z@@-F 'B\\x00\\x00M@\\x00A!(<-=:\\x00±'-n-? ''-n-? '706 @-F '-F '\\x00C-F 5'B\\x00\\x00	:\\x00ŗ9\\x00P:S\\x00\\x00!:\\x00ŏ9\\x00P:S7-=-G '\\r-=4-=4:\\x00ő-K-G '\\r\\r-K:\\x00Á'-I 3'-K:\\x00Á:\\x00ōJ6772:\\x00Ő73-=:\\x00Â':\\x00Ê9\\x00<-I '-=:\\x00Â'1#06;;\\x00\\x00n:\\x00Ř--I '7-I '6 \\x00 \\x0077-I )''.-=77''-I 3'(5&-=:\\x00Y'77-I )''(7\\n7:\\x00Ç':\\x00ś(\\x00\\x00QLLL-=:\\x00Ō'!-\\r-I '-=:\\x00ŕ'1#-E '6-F /'/!-=:\\x00¿'-I ='(-=:\\x00¿':\\x00Ŗ':\\x00œ(\\x00\\x00\\x00îééé\\r-K-I $':\\x00i067:\\x00f1֟067:\\x001^67:\\x00Ŕ106-I '' \\x00/7:\\x00o1փ67:\\x00¤ \\x00 \\x00  Q67:\\x00 \\x00 \\x00  \\\\6:\\x00š79/:\\x00ū--I '7-I '6	 \\x00\\n \\x0077	-I )''.67\\x007	7''7\\x007	7' \\x0067\\x007	7'' \\x00(7\\x007	7'76\\n5C777\\n7	-I )''(_1 \\x007\\x00:\\x00l'-I )''.A\\x00:\\x00l'7' \\x00(\\n-I _'\\x00:\\x00l'7'-F '(:\\x00ŝ:\\x00Ş745R7\\x00\\x00\\x00\\x00Āûûû-P-I ;''-P-I ;''-I ''&.-P-I ;''-I '\\x006-K-I $'-I '671R-P-I ;''-I '-P-I ;''.6-P-I ;''&.B71#-\\r-I '7:\\x00ũ6-F /'/2-\\r-I '7:\\x00Ŧ6-F /'/-U-G ''Z-=:\\x00À'R-U-G '-=:\\x00À'-I ;''06767:\\x00È'-G ''1#7:\\x00ţ'-G ''1#7:\\x00ť(27:\\x00Ũ(\\x00\\x00\\x00,7D֛77-E ''7\\x007 \\x00'7 '&.\\x00\\x00Ƶ--K:\\x00¾'-B-K:\\x00¾'-I )'';!--I '-K-I '67:\\x00É֗7-I +':\\x00ŧ6-K-I /''6--I '-K-I /''7	6-=:\\x00É'-G '-2-I '-K-I /''7	6!--I '-K-I O'67:\\x00Š֗7-G 4'-I +'67-I 1'-I +'6--I '-K-I O'67-I 1':\\x00r67:\\x00Ŝ֗--I '-K-I O'6	7	:\\x00֗7	-I '-I '67	-I 1'1֗6!\\n'++--I '77	6--I '77	6--I '77		6\\n7-I +''7\\r72	7:\\x00r'7\\r727D֗7	\\r72	7:\\x00'7	\\r7272727\\n-F ':\\x00Ū\\x00C\\x00\\x00i \\x00-@ ='\\x00c--I '-[ '-I '6 \\x0077-I )''.777''-B/ 7V5':\\x00½-c3 -F 'V7\\x00\\x00-=:\\x00Y'7:\\x00Æ':\\x00¥:\\x00©7-I 	''7-I 	''9\\x00Z5776-=-G ''-I *'=6-I )''777377'977377'9\\x00:'8\\x00\\x00Ї-=:\\x00Y'7-I 	''-=:\\x00§'77:\\x00Ä'\\r:\\x00v-F &'\\x00CË7:\\x00Ţ'-B/À:\\x00Í\\x00\\x00-F x'\\x00\\x00:\\x00v\\x00\\x00-=:\\x00Ť-F %'-\\r-I '7-? '6-F /'\\r	:\\x00Øt-=:\\x00ş-F '^-=:\\x00Ŵ-F 'H-=:\\x00Ų 5-=:\\x00Ź2-+-I '7:\\x00ŭ6-F /'\\r-F E'	-F &'-7-F \\n'p2:\\x00ů7\\x00C7-F 'p -=-G @'';-=:\\x00Ù'2-=:\\x00Ï' -=:\\x00ŵ	-=:\\x00ŷ-F Q'-F )'\\x00C-=-G @''; 7:\\x00Ű'ƅ-F w' $?-=:\\x00ű-F '±-\\r-I '7:\\x00ų6-F /'/-F .'-\\r-I '7:\\x00Ÿ6-F /'/-F )'o-=:\\x00'\\r-=:\\x00'-I ='(\\n:\\x00Ů-=:\\x00'32-+-I '7:\\x00ź6-F /'\\r-F '-F n'\\x00C'-=:\\x00Ŭ2	-=:\\x00Ŷ-F 1' -=:\\x00'-=:\\x00':\\x00Ż';-=:\\x00':\\x00ž';-=:\\x00Ú'-B/-=-I V'':\\x00Ú'-B/-=:\\x00ſ';-=:\\x00ƀ';-F ''W-=:\\x00Õ'-=:\\x00Ɗ';D-=-G '':\\x00ƈ'-=:\\x00Ž';+-=-G '':\\x00Ƈ'-=-G '':\\x00ƅ'\\r ::\\x00ƂB:\\x00Ó-K-I ''-I D''3\\r-F <'-F '\\x00C-=:\\x00Ƅ-F %'-=:\\x00Ɓ-F 'y-=:\\x00Ɖ-F >'c-\\r-I '7-? '6-F /'\\r	:\\x00ØB-=:\\x00'\\r-=:\\x00':\\x00ƃ-F y' -=:\\x00Î'\\r-=:\\x00Î':\\x00Ɔ	-F ''7:\\x00'\\n7:\\x00':\\x00Ö'\\r-F O'-F B'\\x00C-=-? $''-B/:\\x00Í\\x00\\x00:$;:\\x00Ƌ\\x00\\x00\\x00\\x00ʨ-=:\\x00Y'7-I 	''-=:\\x00ż-F '-F M'\\x00Cɺ-=:\\x00ƕ-F '-F '\\x00Cɠ-=:\\x00Ƒ-F '-F '\\x00CɆ-=:\\x00Ɣ-F '-F I'\\x00CȬ:-F '-F '\\x00Cȗ-=:\\x00ƒ-=:\\x00Ɨ'\\r-F '-F W'\\x00Cǳ:%-F '-F c'\\x00CǞ:-F '-F 0'\\x00CǊ-=:\\x00Õ'-=:\\x00Ɩ';-F '-F '\\x00Cƪ-=:\\x00ƛ'2-=:\\x00Ǝ'\\r-F ':\\x00Ì\\x00Cƍ:\\x00ƌ9\\x00<-I '7062	7:\\x00È'-7(-F '-F z'\\x00CŢ:\\x00ƚ9\\x00<-I '706\\r-F ':\\x00Ɛ\\x00Cń:1-F '-F '\\x00Cį:/-F '-F 9'\\x00CĚ:0\\r-F ':\\x00Ð\\x00Cć-=:\\x00Ɠ'-=:\\x00ƍ'-=:\\x00Ə'-F '-F '\\x00Cà-=:\\x00ƙ\\r-F ':\\x00Ƙ\\x00CÈ:\\x00Ƨ-=3\\r-F ':\\x00Ò\\x00C³:-F '-F ('\\x00C:\\r-F ':\\x00Ʃ\\x00C:\\r-F ':\\x00Ñ\\x00Cx:4-F '-F k'\\x00Cc:-F '-F '\\x00CN: -F '-F C'\\x00C9:!-F '-F *'\\x00C$:\\\"\\r-F ':\\x00Ƥ\\x00C:#-F ':\\x00ƪ\\x00C\\x00\\x00\\x008)8*\\x002\\x00\\x00-F d'\\x00\\x00\\x00\\x00-F '\\x00\\x00C-F %'\\x00\\x00\\x00	Ȧ  \\x007\\x00-I )''.ȏ\\x007'-? P'7-I ''ª7-I !''-G '';27-I !''-G ''-G <'';ǈ7-I !''-G ''-G <'=6-I /'7-H <'':\\x00ƨ-F a',G7-H <'':\\x00Ê7-I !''-? ''-D N'9\\x00<-I '7-I !''-? ''06\\n-F ',ň-H '7-I ''ĸ \\x0077-H ''-I )''.Ġ7-H ''7'77-G ''Ā7-G '';27-G ''-G <'';â7-G ''-G <'=67-G '47-I ''-I D'067-J '9\\x00<-I '706\\n-F ',7-I <'w-K-I ''-I '':\\x00Ƣ06-I _'\\n-F ',7:\\x00r'7:\\x00r'-I )''-F K'.5-@ '9\\x00<-I '7:\\x00r'062-A U'9\\x00<-I '7:\\x00r'06:\\x00Ð,7-R ':\\x00Ñ,5ĳ5Ȝ\\x00\\x00\\n®-=:\\x00Ɲ'-=:\\x00ơ'-=:\\x00Å'-=:\\x00ƞ'7	7-I 3'7	7-I 3'777;;\\r-F '-F a'\\x00C7;;I-,	7	-? P'67	-H '67	-J X'67-D D'-K-I ''2-K-I /''7		6\\x00\\x00C-=:\\x00Ɯ'7	7:\\x00Ơ7-=-I 0''-I *'=6-I ':\\x00ƣ06 727\\x00\\x00-U-V Q''-=:\\x00ƫ'-B\\r	-=:\\x00Ɵ'-B\\r	-=:\\x00Ʀ'-B\\r-=-? .''-=-? .''-I *'=6-I ':\\x00ƥ06 ...-=-I 0''!-)-I '-=-I 0''06-I ':\\x00Ƭ06-F /'727\\x00\\x00:333:-:\\x00ư9\\x00P:S:\\x00Ƹ9\\x00P:S:\\x00ƹ9\\x00P:S7;77!\\x00\\x00\\x00ē\\x00āĄĄ-=:\\x00Y'-=:\\x00Ô'7:\\x00×':\\x00Ʋ9\\x00<-I '7:\\x00×'06;-=:\\x00Ô-=:\\x00ƻ' 77Q6½:\\x00Ó-K-I ''-I D''3/-=-G @''-I 0'-I Z'067-I T'767-? %'76z-=:\\x00§'\\n-=:\\x00§':\\x00Ä'C9<<-=-I P''-I )''8$-=-I P'' ¿-=-I P''-H ,'-G _'688#-=-G @'';-=:\\x00Ù'2-=:\\x00Ï'888\\x00f\\x00\\x00\\x00!f\\x00\\x00\\x00\\x00,--F 5'\\n\\\"-=:\\x00¬\\x0067-I -'\\x0067-I \\x00':\\x00Ư6\\x00-F '-F k'\\x00C-F '\\x00\\x00\\x00m-=He-=7'-I 3'-=7'-I )''-F '(-=7'-I 1''-=7'-I 1''-I )''-F '(-\\r-I '-=7'1#:\\x00ƭ6-F /'/!\\x00\\x00\\x00\\x00\\x00,-F '%; %O \\x00%>7%/7%2&)--F A'\\n;88\\x00\\x00!--F A'\\n;\\x00n\\x00W\\x00o\\x00M\\x00p\\x00\\x00\\x00­-F '9\\x00O7-b-b-G 	''-b-G 	'7062>-I '7#-I \\r'#9\\x00`2>-n-? '706;27-I )'' \\x007-I )''\\x00n$l \\x0077-I )''.)l7,77' \\x00'?֗77' '-G S'\\x00<?ƛ656\\x00\\x00«:\\x00Ì9\\x00O7-b-b-G 	''-b-G 	'7062>-I '7#-I \\r'#9\\x00`2>-n-? '706;27-I )'' \\x007-I )''\\x00n$m \\x0077-I )''.)m7,77' \\x00'?֗77' '-G S'\\x00<?ƛ656\\x00\\x00\\x00\\x00--F A'\\n;!l;2m;!\\x00	\\x00-I \\\"'(`\\x009\\x00Ƶ\\\"\\x00\\x00-I )''-F {'\\x00-I U' \\x00-F {'6\\\"\\x00\\x0092\\x009\\\"-F '\\x00-F \\n'-V :'$--F '\\n;!M \\x007l-I )''.9l7'-H ''-G '\\x00067 $nl7'D֗$o7 \\x00'$p5F!\\x00\\x00P \\x007m-I )''.<m7'-H ''-G '\\x00067-F '$nm7'D֗$o7 \\x00'$p5I!\\x00\\x00\\x00	\\x00\\x00\\x00\\x00\\x00\\x00¨r$r7 \\x00\\x00a-c\\x00\\x00c77-G =''7;7-I *'=6--I '71֙67-G '=671(7-I )'' \\x007-G '=6-\\r-I '7-H F'6-F /'/2\\n7-V \\\\'\\x00^27-> ['(!$r\\x00\\x00\\x00n-=-G 9''-? 5'-=-G 9''-G O'=6-F 'c06\\x00-I ':\\x00z9\\x00Ʒ06\\\"\\x00 \\x007\\x00-I )''.\\r\\x0077A65-F ':$@$?\\x00776\\x00\\x00\\x00\\nć\\x00-I ' \\x00067-I )''-F \\\"'.7-G '=6 \\x007-I )''77.7@7A657-I )''-F )'):\\x00z7-I '7069\\x00ƴ \\x00')7s7$s7-I ' \\x00767-F*Û'7-K:\\x00Ʈ'-I ]'(7-=:\\x00ƶ:\\x00Ʊ0677I:\\x00ƺ9\\x00#9\\x0049\\x00	7-I )'' \\x0077.777	7@'k65-F '7	$?7\\x00\\x00\\x000 \\x00:\\x00Ƴ8\\x00,-F '%; %O \\x00%>7%/7%!7%2&)888\\r8888\\x00\\x008\\x00\\x00°;-F '9\\x00O-F I'9\\x00O-87'-I *'=69\\x00Z \\x00-P-I ;''-I *''-I ':\\x00ǂ067-I )''-F :'I9\\x00d7-I U'77c769\\x00Z77P-F '\\n-F ':$@$?\\x00-\\x00\\x00M\\x00s\\x00M\\x00\\x00q\\x00\\x00q\\x00\\x00I-F ='9\\x00X9\\x001ց:-I *'-F '06#7-=3-=7-B6-=76B\\n-F ' $?\\x00\\x007-D֢7 '-F*Ü'27 '-F*æ'\\r-;2--F '  $?\\x00\\x00:\\x00g-I ''-@ H'\\x00^;\\n-\\x00=-K\\x00\\x00\\x00-=-G ':\\x00ǆ067-F '$g\\x00\\x00O\\x00\\x00\\\"\\x00\\x00j8	\\x00\\x00j7)-F :'-F '$g\\x00\\x00	\\x008\\x00\\x00j77 \\x00 \\x00\\x00\\x00j7)-F K'-F '$g\\x00`\\x00-I H'-A \\\"'-> M':\\x00s#\\x00#-I \\r'#6S\\x00\\x00j)-F :' \\x00\\\"\\x00\\x00-F ?'.\\\"\\x00m\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00:\\x00ǋ-=32:\\x00ǁ-=3-F '$g\\x00\\x009 -F ?'9\\x00X,-F i'\\x00]\\n-F*Ú'\\x00]-F*ã'\\x00]-F*å'\\x00]\\x00\\x00~ -F ?'9\\x00Xq>-? 	'-E \\r'-G W'-G Y'-E >'-? E'-? '-I I'-I O'-H ;' \\x0077-I )''.-K77'\\n<\\x00N-K77'<\\x00N5,\\x00\\x00\\x00 -\\x00-F '\\n->  \\x00 \\x008H-> \\r'\\x00<-I *'=67-I '7067 6M\\n \\x006M79\\x00\\x00\\x00;2-5:\\x00\\x00\\x00i \\x00-I )''77.Q:\\x00-F \\\"'c79\\x0067'-I '76-I )''-I )''-F*é'\\x00ƾ5X\\x00\\x00\\x00 -F W'9\\x00X-F*Ý'\\x00]\\x00\\x00\\x00v\\x00>--!-I 3'(\\r---F 'K;7-I '-=-? ''6> \\x0077-I )''.77'77799\\x00Z6W5)\\x00B=== \\x007-I )''.*7'799\\x00Z7'7/W58\\x00\\x00\\x00\\x00\\x00\\x00\\x00(::\\x0092	\\x00 \\x00\\x00a;;\\x00\\n-Bh\\x00\\x00q -F W'9\\x00Xd-`-=-G ''-P-=-? ''-P-I ;''-I H''-=-? ''-I ;''-I H''8--B2--F ' \\x00\\x00a\\x00\\x00\\n-K\\x00=-\\x00K\\x00\\x00iXX-1-I '\\x0067-G &''-I \\\"'-\\r-I '7-G &''-E .'6-F /'--I '7-G &''-E .'6-G '=6-)-I '\\x0006\\x00\\x00D???\\x009:\\x00ǈ\\x00<\\x00-I 3'/27-I '706;2-B\\r\\x00/\\x00\\x00\\x00 -F W'9\\x00X\\x00\\x00$:\\x00+\\x00)7-F Y' \\x00\\x00a:\\x009\\x00\\x00\\x00	\\x00+,1\\x00,-F %'%; %O \\x00%>7%/7%!7%2&)\\x00\\x00\\x0088\\x00\\x00-I )'' \\x00\\x00\\x00\\x00\\x00}-F '9\\x00O217-I )'' \\x00[[[7-I '-I '06 \\x0077-I )''.877'-I '-I #'067-I )''-F '(7 \\x00'7 '65E\\x00\\x00Y>H#7'9$:7-I '-G '7#1ֈ#7#67-I )'' \\x00-I F'7-I 4'-I '06#-I K'#\\x00\\x00\\x00\\x00\\x00, \\x00%; %O \\x00%>7%/7%!7%2&)<-? I'9\\x00Q-H .'9\\x00Q-? J'9\\x00Q-E L'9\\x00Q-? 6'9\\x00Q\\x00\\x00 \\x00\\x00a\\x00\\x00 \\x00\\x00-I )''\\x007\\x00W\\r \\x00\\x00u-F '\\x00\\x00u-F )'\\x00\\x00u-F '\\x00\\x00u-F '\\x00\\x00u\\x00776\\x00\\x00±;8\\n;:-F #'-H .'<\\x00S;:-F #'-? J'<\\x00S;2	-? \\r'9\\x00Q;:-F #'-? I'<\\x00S;2	-? \\r'9\\x00Q;:-F #'-? 6'<\\x00S-F #'-? \\r' <\\x00S\\x00\\x00--F '~>>:\\x00º:\\x00ǀ:\\x00ǅ:\\x00ƽ:\\x00ǉ:\\x00Ǌ:\\x00Ǉ:\\x00Ǆ:\\x00Ƽ:\\x00ǃ:\\x00ƿ:\\x00ǔ:\\x00Ǘ \\x0077-I )''.\\\"77'd\\x00\\\\-I '77'65/\\x00\\x00.;-V .'\\\"\\x00\\x009\\x00-F #'-E L'<\\x00S!\\x00\\x00čĈĈĈ\\x00\\x00n:\\x00ǖ7:\\x00Ǒ#-I '-I W'06-K-I $'-G '067-I D''-? '-I ]'67-G ':\\x00Ǖ6-K-I /''-I '767-H P'' \\x00'7-? ''7-? \\n'' \\x00	7	7-I )''.A7-I D''-> '77	'677-? ''\\r277-? \\n''\\r7-I '77	'6	W5N-	-I '7-I W'61վ\\n-K-I /''-G '767\\n\\x00\\x000:-F #'-? I'<\\x00S:-F #'-? 6'<\\x00S\\x00\\x00\\n\\x00Ň-=-D I'6-§-K-I $'-G '067-G ':\\x00Ǚ6-K-I /''-I '76-K-G \\r'-A ''067-? 0''K> 77-? 0''-> #''.7-I '7-? 0'70665,-	-I '7-I '61֣-K-I /''-G '76:$;-K-I $'-G '06-F \\\"'9\\x00O7-I %'1֗-H '	67-G '-L 'P#-[ '#7#N#-I Y'#P#-? '#6-K-I /''-I '76 \\x00!-=-G R'\\x00-F r'6	8\\x00\\x00¢>>>-K-G \\r'P0677-E ''-I 3'(7-E '-L <'06-E '2	-F 'K-!-I '-=		6-K-G \\r'-H '06-K-I /''-G '68	-=-G U'\\x00-F r'	6\\x00\\n:8	\\x00\\x00ÏÊÊÊ-K-I $':\\x00i0677:\\x00f'¯7-I '-F +'67-I ':\\x00Ò67:\\x00f1֟06-I L'7:\\x001^67-> '-D Y'67:\\x00o-> D'67:\\x00¤ \\x00 \\x00-F :'-F M'Q67:\\x00o-J \\\"'67:\\x007-F &'-F 'j67:\\x00o-A A'67:\\x007-F \\\"'-F >'j67:\\x00=69\\x00\\x00\\x00\\x00̂,---K-I $':\\x00i067:\\x00f-> 2'0627:\\x00f-L '06ʷʷʷ>-D E'-> @'	7-T '=6\\n7-V '7-H ''7\\n	6-=-L K'>-F*V'-F*ì' \\x00-F*ê'-F*4' \\x00 \\x00-F*á' \\x0067-A ]'7-H ''77-D 6''j67\\n-E 3'-F &'67\\n-E '-F &'67-[ C'=67-E G'7-H \\\"''06\\r7-E '7\\r7	67-E '7\\r67-E G'7-E H''067-E '77		67-E '767-E ''77\\r	67-E ''77	67-T 0'767-J '767-H  '7-A I'7-R V'667-H '7-R \\\"'7-V $'667-L N'7-L 2''67-V <'7-H  ''7\\n-E 3''7-@ \\x00'' ; \\x00 \\x00X67-H M'7-H ''  j67-@ L'7-L '' \\x007\\n-E ''j67:\\x00i'J\\r7-I '7:\\x00i':\\x00=66877-? A''µ>7-H \\\"''7-E H''>7-D \\x00''7-> (''7-@ Q''7-L :''7-A ''7-D '' \\x0077-I )''.S \\x0077-I )''.<7-? A'77'77'67-I '7-D ''7-A &''7-J M''j65I5`-	-I '7-I #'69\\x00_\\x00HY-(-I '7067(I\\x007'-I \\\"';-R ]'\\x007'067-B\\r\\\"7-I >'(7-F*ä'p;-I '76\\x00\\x00M-R S'=6 \\x0077-I )''..77'-D O'706-I '7675;\\x00\\x00\\x00ì-=-R ''-V A'\\x006-D '=6>7-E _''-B/\\n7-E _''17-H ''-B/\\n7-H ''17-E ^''-B/\\n7-E ^''17-H ''-B/\\n7-H ''17-? @''-B/\\n7-? @''17-E +''-B/\\n7-E +''17-E [''-B/\\n7-E [''17-H 9''-B/\\n7-H 9''1\\x00\\x00\\x00в>-=:\\x00Y'7-I '7:\\x00ǐ'67-I '7:\\x00ǒ'67-I '7:\\x00ǌ'67-I '7:\\x00Æ'67-I '7:\\x00ǎ'67-I '7:\\x00ǘ'67-I '7:\\x00Ǜ'6\\x00:S7-I '767-I ':6:S7-I '76\\n:\\r	1	7-I '7	6>-T &'-K-I $'-? 2'06\\r7\\r7\\r-G X''7\\r-G X''9\\x00?7-I '-G ['06 \\x0077-I )''.7-I '7\\r-G X'77'0665)7-I '76>-H ]'-K-I $'-? \\\"'0677-G X''7-G X''9\\x00?7-I '-G ['06 \\x0077-I )''.7-I '7-G X'77'0665)7-I '76-=-G 3''-=-G 3''9\\x00œ>-J ['-I '-G ['06 \\x0077-I )''.<7-I '-=-G 3'-D '1֘77'/\\n1֔77'#1#1֥#06-? ;''65I7-I '76>-A 4'-I '-G ['06 \\x0077-I )''.<7-I '-=-G 3'-H G'1֘77'/\\n1֔77'#1#1֥#06-? ;''65I7-I '76>-D 0'-I '-G ['06 \\x0077-I )''.<7-I '-=-G 3'-T *'1֘77'/\\n1֔77'#1#1֥#06-? ;''65I7-I '767-I '9\\x00m6:S7-I '767-I '9\\x00m67-I '9\\x00m6:S7-I '767-I ':\\x00Ë7367:\\x00'27:\\x00Ǐ'2-=:\\x00';;7-I '767-I ':\\x00Ǔ736:\\x00ǚ--I '7-I '6 \\x0077-I )''.7-I '77'9  \\x0065+-	-I '7-I #'69\\x00$\\x002\\x0032\\x00-G E'06!\\x00\\x00\\\\--I '\\x00-I @'6-= \\x0077-I )'' ).777'7;!W5*777-I )'' )'\\x00\\x00\\r\\x00'J\\x00\\x00w>-[ ;''7` \\x0077-I )''.N77'-	-I '>7-I 1''7-? :''7-V #''7-[ K''-I '67-I '765[7\\x00\\x00g>:\\x00°'7R \\x0077-I )''.@77'7-I '-	-I '>7-I ''7-T ''7-? :''-I '665M7\\x00\\x00l \\x00:\\x00¥'-G '/:\\x00¥':\\x00©'-G '/\\n:\\x00©'-K-J '-> 4'6!-D '-=3>777\\x00\\x00>LL-R .'\\x00`7-I '7-G &''67-I '7-> ''67-I '7-? :''67-I '-L L'736.??-F \\\"'9\\x00O--I '1֝7N-V -'\\\\6-=-G '7d67-I '7-G &''67\\x00\\x00Ƕ;1>-=:\\x00Ǎ'7-I '77:\\x00p'6-=:\\x00ǝ'7-I '77:\\x00p'6-=:\\x00ǟ'7-I '77:\\x00p'6-=:\\x00Ǡ'7-I '77:\\x00p'6-=:\\x00ǜ'7-I '77:\\x00p'6-=:\\x00Ǟ'7-I '77:\\x00p'67-I '-=-H ''6-=:\\x00Y'	7-I '7	-I 	''67-I '7	:\\x00'\\n7	:\\x00':\\x00Ö'67-I '7	:\\x00Û'\\r7	:\\x00Û'-I *'=667-I '7	:\\x00ß'\\r7	:\\x00ß'-I *'=667-I '7	:\\x00Ç'6-=-G !''\\n7-I '7\\n-E \\n''67-I '7\\n-H (''67-I '7\\n-H ''67-I '7\\n-E E''67-I '7\\n-? C''67-I '7\\n-I ''67-I '7\\n-I ''67-I '7\\n-E 0''67-I 4'-I '06#9\\x00\\x00\\x00\\x00	\\x00!\\x00,-F \\r'%; %O-F }'%>7%/7%2&)-;-G P'9\\x00Q8\\x00\\x00P- \\x00\\x00-I )''\\x007\\x00W\\r \\x00\\x00:7-F '\\x007\\x00\\x00776\\x00\\x00-=-? 7'-R Q'1\\x00j6\\x00\\x00*-=-H 8''\\r-=-H 8''-J \\\\'9\\x00`7\\x00\\x00/1\\\"\\\"\\\"-=-E 	''\\r-=-E 	''-@ D'9\\x00`7\\x00\\x00\\x00p-G P'9\\x00Q;-F H'9\\x00O\\r -G P'<\\x00S:77 -G P'7<\\x00S-=-E '\\x006-=-H ''	-=-E 'G6\\x00\\x00P-=-? 7''-=-H ''-@ T', >-=-? 7'\\x006-=-T '6-=-A '6\\x00Ä;9-K-I $'-I A'06-I D''-T .'-J '6-K-I ''-I '61ռ@#-?  '#\\x00\\x00j-G 5'=6#,7-J U'\\x0067:\\x00l67-J '7676-I \\x00'-@ '-b-? '706#6-I '76-I \\x00'-L '6\\x00\\x00-b-? '06>7\\x00\\x00\\x00'7\\x006B\\x00\\x00\\x00 -G P'\\x00<\\x00S-F '\\x00\\x00\\x00\\x00\\x00%,\\x00,-F '%; %O-F '%>7%/7%2&)\\x00\\x00=\\x00-I '-F j'9\\x00O=6-F M'9\\x00O=6-F 0'9\\x00O=6-F '9\\x00O=6Q6\\x00\\x00\\x00\\x00\\x00&\\x00&\\x00&\\x00&\\x00&\\x00&\\x00&\\x00&\\x00&\\x00	&\\x00\\n&\\x00&\\x00&\\x00\\r&\\x00&	\\x00&\\x00&\\x00&\\n\\x00&\\x00& $\\x00-F '. \\x00 )9\\x00-F ')9#\\x00\\x00\\x00-F '. \\x00\\x00 )9c\\x00\\x00 \\x00 7\\x00.\\n74W57\\x00\\x00-F :'\\\"\\x00-F &'-=J7\\x007#\\x00\\x00-K \\x00 \\x00\\x00-K-I $'-I '06-F U'-F \\x00'\\x00\\x00-;	-=-G B'';-F V'-F o'\\x00\\x00U \\\"\\x00-F '\\\"-F &'\\\"-=:\\x00Y'-I 	''-I \\\"'\\\"\\x00##c#c-F 'c-F )'9#\\x00c#\\x00\\x00-F \\x00'9-F '#\\x00\\x00-F \\\"'9-F &'9-F 'c)\\x00\\x00-F \\n'9-F &'I\\x00\\x00-F %'9-F )')\\x00\\x00-F '9-F )'9# \\x009#\\x00\\x00%-F :'\\\"\\x00-F &'-=-I ^''J7\\x007#\\x00\\x00-=-I V''-F \\x00' \\x00\\x00-K-I $'-I '06-F U'-F \\x00'\\x00\\x00-;	-=-A '';-F V'-F o'\\x00\\x00X \\\"\\x00-F '\\\"-F &'\\\"-=:\\x00Y'-I 	''-I \\\"'%\\x00##c#c-F 'c-F )'9#\\x00#\\x00c#\\x00\\x00-F '\\\"\\x00-F \\x00'\\\"9\\x00#\\x00\\x00 -F \\\"'9-F &'9-F 'c)-F :'#\\x00\\x00-F \\n'9-F )'I\\x00\\x00-F %'9-F \\\"')\\x00\\x00$-F '9-F )'9# \\x009# #-F '\\n\\x00\\x00\\x00\\x00\\x00\\x00\",ŘŗřŚ͐͸śŜ\x00ŔŕŖʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟ˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿̀́̂̃̄̅̆̇̈̉̊̋<Ğ$ğ&ĠǧġǪſıĢĵģķĤļĥĿĦłĳĬĴ͎ĵ͑ĻƊļƍĽƐĿ̘ŀƘŁƚłơŃȡńȤǶ]Ƿ¥ǹʊȋťȌ˻ȍ˒Ȏ͡ȏͪļǭ+ÉĂĠY½ĩn¸ĭDß:ıû|^\"LLă^1Lý^iLĲ!^OL\x00^òLİĮıØú^¾LLăh^LĦ^µLa^;LČÆ^óLAĊ¯¬ÈDLćğ^LFz^ģL.,ıÝĪ^)L±ămēDßĜ^¥Lëªı\\õ^LLă<ı­^)LÁăy^×LôZ^ÍLďà^ L^ÊL4¯KĐDLćü^íLX^=LrÒ^ĄLè^{Lÿ(^éLæıč^	LLăRısø^ÜLLăB¯âlDLćġ^îLoį¯ĉĚDLćHDßW^ÑLė^ãL¦Ĥ^¼LTÎ^LĆ`^@LwDßĝ^cL ¶^LÛ-^LÖ^»LĦÂ^'LGdıË^ñLLăĈ^L^ĢLÅķ^LījıĶ^kLLăÄ?Dßĥ^qL]^þL«ıĸ^LLă0ÌDß6¯uĕDLćù¯M¡DLćg^ÀLIç^ĹLt÷^Lċ¯ÞDLćÓ^L®Āı³Ĩ^)LĬăĎ¯fĖDLć´¯e¤DLćvbÚ7x>\r\n}£öïC&ì~¹²§º#°āÙęP2Q¢Ï/áě¨ąðĘħÃĔ*êđĞVåĵĒ¿_Dĺ[ÃÔĻ·J3S5ĳ©N$8EÐ%ĴäU9ÇpÕ3Ĺ0ŝ\x00	\x00\n\x00\x00\x00\rǡ\n1ʇӴ૜\r£\rô\r?	̯\r\n	ב	ࢭ	$\x00	ډ		֞	ڴ	஭	$\x00	ࡎ		ૃ\n\"	HʆӠ\nŞк༺ȇş\x00	\x00\n̴\nೣ\nа\nฌ	\n\n\nw\n͒	HȇŠ\x00	\x00\n̴\n๠\nа\nಈ	\n\n\nw\n͒\nˇ\nௗ\nć\nԲ	Hȇš\x00	\x00\nк	\n\nó\n໅	േ\nĕ\nڝʆӠ	Ţ(>ŝཔʈ౽ʪŠʓǂ˔ŝʖՒʪ˔ŝʘˣ	Şʘƙ\n˔šʒǂʩʒϭʘ۠˔ʩŠʔȎţ¹Šʚ֟m0¹Šʕɴ\r˗şʕɅ˔Šʘܢ˗˔Šʔࢮšʓ৴ŞʕԗšʑԴŤŞʔʇşʙŠ˗ʓΎʏƞʧŠʑ༊˗ʧŝʚαʱʎǰʎǠ˔ʏ˯ʑ๪ʱ˔ŞʙྤU0ŝʘѤšʖɹŠʘ̻ŞʕƿŞʕƩšʗԉşʐ՞šʒ˕ʪŞʖʘʧşʗ˽ʪʧ šʗВ!šʕȘ\"ŝʓആ0#şʖЈť¹Şʕի$ʩʒȴʕƐ˗ʚ˝ʙମʩ˗%Šʕǯ&˔ŞʕȋʧŞʓࢬ˔ʧŦŞʖ໿'ʭʗ̝ʓËʧşʒকʭʧ(Şʑȥ)şʘԉ*˔ŝʐȋʬŠʙ˽˔ʬ+Šʑʹ,ʩʐ̔ʗɽ˗šʙ;ʩ˗]y0-Şʗͻ.˗ʎǰʎǠʪŞʒ཭˗ʪ/şʘʑ0˗şʐ֪ʩʚ֊ʘγ˗ʩ1ʪʎԘʍ˥ʱʌ̔ʏอʪʱ2ŠʒԴ3şʕȎŧ¹Şʑ҃4Şʚɹ5˔ʚЩʔǌʪʙ༱ʙߨ˔ʪ6şʖӀ7šʕढy08ʬšʑԂ˔ʐ̔ʏӸʬ˔9Šʕণ:Şʗǐ;ŠʓȘ<Šʒӹ=ʱşʓͦ˗ʐ¨ʎ̬ʱ˗>Şʔ̎?˔ŝʔĊ˗şʗޅ˔˗@Šʔ˚ŨʩŠʔĝʪʍŮʘ૾ʩʪAŞʓŇBşʚ෾U0CŠʖϏDʭŞʗɮʩʍȩʘʳʭʩEŞʔɸFŠʒѧGšʚԀHŠʖϱIŠʔϙJŠʑϠKŠʕДLŞʒαũŞʖɉMşʓ෪0NŞʙϿOŞʗИPʭşʓÓʬŞʕ༈ʭʬŪʬşʍ໌ʬʬQşʔƙRʭŞʘͳ˔şʖӌʭ˔SŠʕŇT˔ʏ̝ʎʢʭşʘ࢏˔ʭUʩšʖɣʱŝʘࣩʩʱVʬʗۖʚƞ˔ŝʔΰʬ˔Wşʓ༠Xšʘ૎m0YŞʘϱZŝʑ̽[şʖѲ\\ʩʖ˝ʒǪʭʒ߶ʙЗʩʭ]ʬšʙɮʭŞʘˍʬʭ^şʚӷ_şʗˣ`šʑߠaŞʓŹbşʓ໚ūʭʍŮʌƃʪŠʗ٘ʭʪcŠʖמa0dŞʒ̪eşʓѓŬŞʖŠfʬşʗȸ˗Şʔࢅʬ˗g¹Şʓƿhşʔ̽işʖȥjʩŠʕ೭ʪšʗ໵ʩʪkşʖŹlŠʚŭmŞʑ̪nšʘ੥m0oʭšʐȽʧŠʗ;ʭʧpšʕ˚q˔Šʔ̦ʪŞʒྠ˔ʪrşʕȵsşʒԪtʱŞʓƛ˗ʙ࠾ʙෝʱ˗uŝʘȵŭşʘ۫vŞʙɉŮ¹Şʙ̻wşʒŭxşʙৠy0yŝʙӷzşʙȥ{Şʑ͆|ʱŞʖԂʬŝʔےʱʬ}ŠʘԪ~ʧʓȩʑҀ˔ʑǰʔ୨ʧ˔ŠʘޫŞʗ஥ʬʎǰʕçʱşʚࣿʬʱŞʒƙʱšʘǔʧŠʕ֨ʱʧŠʖཉ0ůşʐŭŞʕВŞʖǐşʗѤʬŝʓɅʩʍŮʌюʬʩŝʚǅŰʩʐԄʒZʭʑҼʓٶʩʭŞʒǅʩŝʐӺʭşʕۍʩʭʩŞʒqʪŠʗ੷ʩʪŠʑ̻ʱŠʕɒʪŞʖຼʱʪ]y0ŝʔŹšʙȳ˗ʒ˝ʙËʱŞʙϳ˗ʱʭʖեʑໟʧşʕϫʭʧŞʒౚűʬŝʕoʩŝʙˍʬʩŞʖǯšʖ̎ŞʔϿŲŠʕԀ˔šʑ̦ʭʔϻʔ̬˔ʭŠʚѸm0šʑƿşʘ֓ųšʗʑŠʚŇ¹ŞʓؿŝʔࡦŠʒଣʧŠʗ્˔Šʔલʧ˔Ŵŝʙ˚ ʪŠʔॴ˗ʒ߀ʑकʪ˗¡şʒɴ¢ʭşʘżʬŠʐೇʭʬ]m0£şʕϙ¤šʑӀ¥ŞʒƢ¦ʭşʙƛ˗šʗήʭ˗§şʖʑ¨Şʔް©ʧŞʕƛʭşʙӌʧʭªŠʑŭ«Šʒǯ¬¹şʗ˕­ʬŠʘƛʩʔĴʑ۝ʬʩ®Šʓट0¯šʓД°Şʑш±ʧŞʔೌʱʘϻʒฟʧʱ²šʗŇ³ʩŝʕ൛ʬʕȷʑࢎʩʬ´˗ʚȴʚÒʱşʕै˗ʱµşʗƢ¶şʕɉ·ʩŝʑ؃ʧşʒϳʩʧ¸˔ʙɎʗΘʩʕϨʒव˔ʩ¹ʱşʓڻʬšʒˍʱʬº¹Šʚє0»ʱʏɎʘfʪʐ¨ʎ̬ʱʪ¼˗ŞʓࡠʱŞʑՒ˗ʱ½ʱŞʙ൷˗şʓຮʱ˗¾Šʔм¿ʱŞʗɒ˗Šʖ໭ʱ˗ÀŞʘӹÁ˗ŞʓӄʬŠʒח˗ʬÂ¹ŝʑҦÃŝʓłÄʬʒ҉ʚ̀ʩşʚΰʬʩÅşʘ͆Æŝʗڔm0ÇʬʐΎʙĢ˔šʚ΁ʬ˔ŵŞʙϏÈşʒԔÉʧŞʙǂ˗Šʕϐʧ˗ŶŝʚϠÊşʚЈŷ¹ŠʒҦËşʘ˕ÌŠʍ಼ÍŠʖȵÎʩŞʓȽʬʒࡒʏӸʩʬÏŞʑআ©0Ðʧšʗߔ˔Šʑངʧ˔Ñ˔ʒեʌŐʭŝʒѾ˔ʭÒʪʎളʓȔʧŞʘଳʪʧÓşʕƢÔŞʒ঺ŸʬšʒȋʪʍȩʙෳʬʪÕʩŠʖɪ˔ʖϨʘ̹ʩ˔ÖŝʘԔ×ʩʘ́ʏƞ˔Şʙӗʩ˔ØŠʙʹÙʬʑ຀ʑǨ˗ʘϭʖыʬ˗Ú˗ʎЫʕϴʩŠʔୗ˗ʩ]y0Ûŝʒ՞ÜʱšʒʾʬʙďʚγʱʬÝʱšʘȽʪŠʙୃʱʪÞ˔ʓਃʙҔʱŠʙ΁˔ʱßŠʕȳàŞʕǐáşʓŠâšʑƩã˗šʙĝʪʑξʒʳ˗ʪäşʑɴåŠʒΊæšʘє0çšʐȎèʧşʚභʭŝʕਲ਼ʧʭéŠʗƿêʪʏ̝ʎʢʭšʗ़ʪʭëŠʘŹìŝʒ֚íʱʘܥʕԧʧšʘ˽ʱʧîʭşʐɶʬŞʙųʭʬïŞʙɹðʭŠʖĝ˗Şʕųʭ˗ñʩšʗҠʭʑ̇ʘޒʩʭòŝʑ݂y0óşʙపôŞʑǐõʧŞʙ೨ʩŞʙઐʧʩöŠʓ̎÷ŞʒŠøʬşʓżʩŞʓഈʬʩùŠʖʹúʭŠʕǂ˗ʕഐʕෙʭ˗ûʩşʗǑ˗Şʖॊʩ˗üŠʘŇýşʕʇþşʑଌ0ÿŞʚ൲ĀʬşʔШʭʌԄʍʳʬʭāŠʙǯĂʬʗૻʔfʧšʖѾʬʧăšʚ໎ŹʩʍŮʕ\\ʪŞʌྖʩʪźʭʍŮʌ˺ʩʍȩʌюʭʩĄʧʑࣇʔɭʱʑ׃ʔыʧʱąŝʘŭĆŞʐИćŠʖȎĈʬʕ¨ʔϴ˔şʑήʬ˔]m0ĉŞʖ̼ĊʪʓએʖúʭʘӉʘ੊ʪʭċŞʓ̪ČşʘǅčşʕŠĎʬʔࣃʗвʱşʘ਒ʬʱďšʖǅŻŞʘшĐŞʑ̼żšʓƢđʭʕধʑĶ˗şʗϫʭ˗Ēŝʐ౔0ēŞʖȳĔʪşʕžʬʗଵʚ൮ʪʬĕŝʙΊŽʪşʖžʧŠʌ࠙ʪʧĖŞʐ࣊ėʱʒĴʕæʩʓԘʕ߈ʱʩĘŠʓѧęŞʒȥĚşʓԗěşʖɸĜ˗ŞʙɅ˔şʓঌ˗˔žʪşʓɒʬʒɎʓ੨ʪʬ]Ƶ0ĝŠʗм9ˏʌíǼʉఖƀ˓ʌߟƁ&\x00˓ʌɗƻʌƂʌ࠲ʌ˙ʍȷʎ८ʡԽʡşƂ&\x00\x00	˓ʌɗƻʌƂʌ͕	ʎૄ		ʰ ʍǈ	ʍஎʰ ʍǍ	ʍගʌ˙ʍȷʍռʌˤ	ʡԽʡşƃ&\x00ʵʍˈʌ෶ʌƑʍɊʍŲħ\x00	\x00\nʌ§ʡČʌʵʌຓ		ʌ+	S\n	Wƶ\n\x00dʷʌ\n\x00ʌѕƄ&\x00\x00	\x00\n		ʉ­	S	P\n\nʉÎ\n,ĉજʉ઻ّঐ	Łƅ\x00	\x00\n\x00ōʌïƴQʡIOʡIƄp	ఠʉ˘\nʌʐ\nŸ	/	RʉಯŴ	மʉ୉	ʉౌƆ\x00\x00	\x00\nʌཤʌğ\x00	\x00\nி\x00ʏٮ\x00	ÈƇ\x00\x00	ʍκʍη\x00	-ʕۧ\x00	ƈ\x00	\x00\n	ʌʐ\n\n	\nŎ\n ڈ̅0Ɖ\x00	P	?		^Ɗ\x00		৽	%ʉҋ	୘	%ʉ௡ʉӁ	%ʉŗʉØ஢	%ʉ໇ʉϬ	%ʉўʉĈФʉØʉڃ	%ʉठʉԁ	%ʉģʉŬФʉĈʉఌʉØʉงƋPʌ+Ŏʌaళʉ೜ƌ\x00\x00	\n\x00\n	ʌ+,\nۙʌѮ˕ʌŐʎԙʏƮʑďʡeʌ\n\x00ʌǤʌω\x00\x00	ƍ\x00\x00	̗	ʌ൨२V	๨V	#	ൂV	#	@	ଚV	#	@	c	܂V	#	@	c	f	ୠV	#	@	c	f	f	૤ƌ\x00\x00	Ǝ\x00	\x00\n\x00\x00ʡČʌ\x00ʍਵʌటP	£	ʌ+	S\n	W\nʌưʉɲʷʌ\nyʉ«˓ʏՃ\x00ʉϽʉ֠Cʉܯ	ˌʌőÅʷʌ\n\x00ʉॉ	ʍ́	Ѡʡeʌ˧Ĩহ\x00Ǝĭ;>ʡ΍ʌƏ\x00	\x00\n\x00\x00\x00\r་	ƺ\x00ʌ͛	ʌʉ·	ۤ\n	ƓʌÞʌɶ\nʌX\nౝʌ॓\nੴ\n̟౎Ÿ\nࣛƀ\n̟ŔӰ\nʌbจ\nʌbฐʉ«Ϲ\n ʌೕƀ\n̟Ŕ\nʌbޛv\rʡeʌ\n\x00ʌɶʌ௉\r$ʌďś\rƐ9ʾʌÁʏ಍Ƒ\x00	\x00\n\x00\x00ʌřʉ\\	\nʌX1ʇĭ	?\nಇ	ʉŬ	ʉĈ	ʉছ	ຐƒ\x00	\x00\n\x00\x00\x00\rʌX	\nʌྦྷʉ\\\r1ʇĭ	?	é\r\nRʉ¬ʉT\r\nRʉ¢ʉT\r\nRʉʉT\r\n\"%ʉ̹\rƓգRʉ¬ʉ҈Rʉ¢ʉ҈RʉʉT%ʉ΂ɭ0Ɣ5ƑF༶ƕ&\x00ʵʚັʵʓடʡ=ʌM ʕࣶஇƖ\x00৐ʌૢʡ=ʌʌЙǁ	Ͼĩ&˓ʍޑʍ޸˓ʍ̜ʍ૦͸ª˞Ɨ\x00	\x00\nƺ\x00ʌມ	ʡ˛ʌ\x00ʌୣ	 ʉ˅\nʡ˛ʌ\x00ʌಙ\nʉȍ\n	Y	ʌঞʡ=ʌʷʌ\x00	ٓƘɥƗFƈ\x00ʡ݅	Ͼƙ˄ƚƚ&\x00\x00	ʵʍˈʍӺŰʌȡ	Uʌ:ʌଧ		٠ʡ¥ʡ´ʉޮƷ	\x00ʍහƷ	\x00ʍ౸Ʀ	\x00ƥכࣆƥƛ\x00( ˂֍ʌŻʌ໬ۊƵ·8˄ƚ\r˄ǻƦ\x00฼Ɯ&ǎʉਗ਼Ĳ˚˚ʍψ˚ʍȜ֏ʶʌĴʌڰƝ\x00\x00	\n7೬\n1˒ѥ\nʌœd	ཎ۰	ޥƞ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00ʍర~	ʌෘʌƃ	Ɯ\r\n	#	@	ऎ\n\rƬǌʯhʯ[ū\n\rWʌऍʌ+SƝ'\x00MĲఘΕӝ>ΪЛʌ+SWʌɀʉྉਪ[Ǿݢ1˒ѥʌœhtƝf'\x00MĲภΕˀޞ>ӝʡؓʉȍʡ¤ʉ໐=ʩ=ʉ৘˄ƥ}˄88>ʡ๟ʡ୺ӟ0Ɵ׭ƞƠ\x00	ւʡ¤ʉൽƞ\n	ୁ	D	ʐց	ʘ඀Īθʡ¤ʉྑʡǛʉƩơҺʉ༵CʉҁʉಥCʉݗƢķʉщCʉիƣ\x00	\x00\nʳʌމơष		ʌ+	S\nʳʌ\x00	Mơ\nƜƢ\nʖʉٹ\nʖʉ໗\nʖʉో\n૿ʉો\n>ʡ=ʌʡŊʌy	ঝƤ\x00\x00	\n7 ʍԨ ʍೲʯ͠\nƣ	M\n\n ʍԨ\n ʍ୫ƥ&\x00\x00	\x00\nƀ\rʰ	ʤħ	8ʍǈ	ʍʏʍǍ	ʍ͇\nՍʌˁʌìʍΝʉƁ\nʡ܏\nʌ௘6ʌƂRƂ\r8ʌ˙ːʎА~\x00hʨ[	\x00'\n\x00%ʡĢPʏύTٚƦ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00	n	6\x00	R	8	~	h	[	'	%	PʡȔ	Tĸ	ÃʡȔ	?ʡ݉ƶ\x00ˊ	=ʉઆ\nƀ\r\nʤħƀ\nʰ ʍǈʍʏ\nʰ ʍǍʍ͇ʡ̉RL	?ǯ\nʵʌāʌżˍ\x00ˍˍWˍʥʡتƷˍʑໞ	=ʉЭ	]\rʰW\rʍ˅	=ʉЗ	ྙƤ\r\x00ʡ[	6t	=ʉЭ	]Ǫ\n׏ƀsʌˁʌìʍΝʉਣƶ\x00ʌ࠺ʮǫʡࡖވƷ\x00~ʡŊʌ\x00~ʌԮʡÃʌ̅ʦ	ʡÃʌ೓ʦ8©ˍ~-ˍ8ƶ\x00ʌ׹ˍ8'ƶ\x00ʌ഼ˍ8'%\x00	?ǯ%ˍ8ǫ'Å৺	=		=਋	~ʰ	hʨʤ ʡЧʤఓʰ ʍǈ	[ʍʏʰ ʍǍ	[ʍٷ	[ʤʡÃʌʮ॰ʦ		'ʡŵʌʦ\x00ʮ	'ʮ	%ʌஓ	Pʏύ	8ʡŵʌ	~\x00ː\x00	h\x00ʯ\x00	[\n	Rʡŵʌ	8\x00	'\x00	%\x00	P\nʡŵʌ\nʍջʯ\x00\nʡŵʌ	h\x00ʯ\x00	[ཙʡ¤ʉ೾ƜƟ		T \x00	ÃƏ	'এƠ	YƘ	'	=ʉֿ		=ʉದ	= ʉȨ	=ๆ	=ʉබ	=ʉࢊʌٕʌۭʌੰ	Pʌ༿	Ƨ(˚˚ʎଇ˚ʎȝ½̌\x00̎˒ʙѿʌਿ̎ދʍƭʡÊʌ\x00\x00	Åʍཏ	\x00	̎	ʳʌ࠰	֖ʡŊʌʐ֬	ʌվʉ±ʉಐ̍\x00	\x00\n\x00੿۲̌߬ˋˌ-ʏ༨ˌঊ>ʏ઒ʾʌx\n\nάʏ౱ʌ+ฆ\n̍Ǻʌ̇ʡeʌ\n\x00ʌǤʌ٦	?ʺʌʍྪʌ\x00	\nʌ̌	Åʌˤ̍	ঁʌ҉ʡeʌ\n\x00ʌǤʌୡ̍īహ˘ǗʌՓʡ´ʉʂ˘̧Ĭ\x009ʡԦʼ๖J׮]͇0ĭ\x00		ʡ#ʡƊॿ	%ʉணʡੀʡ֑Į\x00̊˚˚ʍψ˚ʍȜǞʶʌĴʌ඄	9~ƨ9ˏʌĖʼƶƩ\x00	1ʇ\n	Ű	?	\"ƨʉӗį̌9̌ʉা̌%ʉ଍ʉ׌̌~ƪ\x00	\x00\n\x00ف	L	ʌ՜	׻	ù׈	\x00\n		\nˏʌĖʼƶʉୈƫ9Ʈʌऱİ&\x00PCʉȌ,ˤʉচ˥ʌ+,ʳʌ˥ܙ˟mʉZˠ'ʉ\\ˡǙ%ʉģʉ\\ˢ'ʉZˣǙ%ʉʦʉãˤƬ\x00	\x00\n\x00\x00\x00\r\x00ōʌïƴQ˥\x00\nʌX	1ʇˏʎಎKʉཹʉའʌʉ्\n?\r\né	\"\r'ʉĩ\né	\"ɠ\r%ʉʦʉѡ'ʉԕ\r\né	\"ɠ%ʉģʉة\r'ʉל	\"\r%ʉළ\nʌߌ\r\n	\"\r'ʉĩ)\n	\"ɠ\r%ʉʦʉѡ'ʉԕ ˂		\"Ŵ%ʉģʉཨʡeʌ	˧ƭ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00Ä੶෎ʌ๯ʌX	1ʇˏʌĖKʉׄʉтJʉഌŸ\nʳʌ\x00ºʳʌ\x00ºʳʌ\x00º\rʳʌ\x00º	\"˟\nŃˠ	\"ˡŃˢ	\"ˣŃˤ\rh8\nʳʌ\x00ºʳʌ\x00º	\"˟\nŃˠ8ʳʌ\x00\n	\"ˡŃˢ౉	ƮƭFƱƯ\x00	\x00\n\x00\x00\x00\r	ʌX\n1ʇ	Ӵʳʌਈʉ༥\r£\r	ô\r?ʳʌ\x00\r\nGʉࡻʉฒ$\x00Gʉ̉¡ʉֲGʉКʉࣾ$\x00Gʉ۴¡ʉژGʉƤʉઙ$\x00Gʉഘ¡ʉ୲\n\"Hʆʌʉ\n|ʁ0ư\x00	\x00\n\x00\x005ʳʌʌݴ		ʌՋ\n	\nʉ࢓\n\nʉܸ\nʉࠆĉ\n%ʉŗʉɯ	ʋʉ¯	Ŕ\nʉʌĉ\n%ʉģʉΛ	ʋʉŗʉɯ	ʉΠʉ¯	$ʉߞ\nʉչĉ\n%ʉୱʉ঒	ʋʉŗʉΛ	ʉΠʉŗʉɯ	ʉ்ʉ¯	$ʉර\nʉ؟\x00	$ʉ۬\nʉੋ\x00	$ʉ઺\x00	ĄBʉߖ¡ʉିʌk'ʉ׺ʉضŋʉ࣫ʉڷʌFƱ9ƲưÈƲ\x00\x00	\n\x00\x00έ	˂		ʌݚ\n1ʇʹʌřʉ࢟	JʉǨŰ?\n\"ʆʌʉʌ\x00$ʉ࢚		\n\"ʆʌʉʌ\x00	˨ʡeʌ\n˧Ƴ9ˈ˖Èƴ\x00	\x00\n	Ƴ\n\nʌX1ʇ\n\n\n¡ʉӃ	\n?	ʳʌ\x00	º	ʳʌ\x00	º	ʳʌ\x00	º	ʳʌ\x00	Ձ\n$ʉӃ	\n?	ʳʌ\x00	ংƵ9˛	˛ʌ-ʡÊʌ\x00˒ʖ§ʌ๦ƶ\x009ʡŊʌyʌɃƷ\x00	Ä2඗	ʡŊʌyʌࡩʡ=ʌ	Áʡ=ʌƸ\x00ʀ2ͭʷʌ\x00ʌʌɃƹ\x00ʀ2ͭʡ=ʌÁʡ=ʌƺ\x00		ʡlʌ\x00M	ʉώۻʷʌy	\nʷʌ\x00	ݧƻ\x00		ʡlʌ\x00M	ʉώ൴ʷʌy	\nʷʌ\x00	۶ॣ0ı&̌\x00̍\x00̎̍\r̎n̏̍ʆLqࣵ̎\ň̎\nʡน	\x00ʡѰ\n&̒\x00\x00	\x00\n\x00̒£ʉȌ,̒ʌɫzàÏ̒ʌɫzʉãʉ๭̒ʌɫzʉɽਇP̒ʌ+ŎzC̒ńz̒ʌby˫̒ʌࢱ̒ʌ౺	̒ʌĒʉ«\n	#	@̒̒ʌʉ«®z\nzz\x00\n\x00ܩ̒ؔ̏\x00\x00	ก̏ʆ௭qqғ	\n̏ʆʫٙqqғ		PĲńqGʉɰńѺńqJʉƩ̐\x00	\x00\n\x00\x00\x00\r\x00	5\nʌX¼\r\r\n\rS\rē/mqྔ\x00$qۃGʉ෗	ʌѺJʉ́ڡʉأJʉ́¡ʉྟȪ	ʌk୹ʉࢩ༛̌'˨	̑\x00	\x00\n\x00\x00\x00\r\x00	5\n\x00ʌX\r¼S\rਖ਼ʉ༷\rྗ%\r	\n\n\n\n\x00\rऔ\n̄	ʌ\n\n\nൗ		9̐\x00̎\n9̑̍\x00Ƽ\x00\x00	\n\x00\x00\x00\r\x00\n#@\rʉѭʉЪ,\n/\nҬmʉƼ'ʉǣʉȅ	Ŵ%ʉǦʉç/\rǽʉç/Ҭ\nmʉƼ\n'ʉǣʉȅ\n	Ԍ'ʉ՘ʉЃʉǦʉɻʌ\n\x00ƽ\x00х̛#Ώோƾ\x00	\x00\n\x00\x00\x00\r\x00\x00Ƒ\n	ˏʌĖʌřʉƅ55\rʉտʌȰʉƅƑƩʉ́ʌഔ\n\n	\n,ʌƑʌ\nKʉǇ\nKʉࢯʉ࣬ʌ	Kʉد\n\n\r\n,ʌ\rʌƑ౰\n\nʌ+\n,Ƽƽ\n\n\x00\nʌʌʉϐƒƿ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	1ʇʌʉƅ\nƑ\nƑ\n#@ʌԷʉѭʉʺwʉ૘\r\rʉല\r?/ЇmʉƼ'ʉǣʉȅԌ'ʉ՘ʉЃʉǦʉç/Jǽʉç/ЇmʉƼ'ʉǣʉȅŴ%ʉǦʉɻ\x00\x00	\n'ʉ¬ʉT	\n'ʉ¢ʉT	\n'ʉʉT	\nǽʉT	\n'ʉ¬ʉT	\n'ʉ¢ʉT	\n'ʉʉT	\nǽʉTéಊ	\nƘ	ʌb\nJ\x00F	Ĳ&̌\x00̍̌բ̍բ˦х̌\x00̍˲ǀ\x00\x00	\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\n\x00ʌȰʉغ\nʡȏQƑ\n\n[ʌX³ʌȠʉཷʉ৷,ƘŋฯʉˌŋʉݵRʉӓʉů'ʉýʉƴʉΈ'ʉĆʉƴʉǋ%ʉ˼ŋƀmʉǋRʉůmʉɾ̿'ʉχʉࡴJԟP\r\rĄظ\r%ʉšJʉXCʉϵ\rʉȨ\r\r	ƓRʉຜ	ɑ'ʉýʉђ	ҏ'ʉĆʉђ	е%ʉಞ\x00^ǁ\x00\x00	\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\n[	[5ʉ­,Ŵ̿'ʉχʉఄP\r੸\n\rh\r๕࠻৛ఁmʉ࢈mʉچmʉ\\'ʉǋ%ʉൟʉݽ\n\r\x00\r\x00\rשʉ­,\nҢP\r\rʉ­\rS\n\r\r௅Kʉ௻KʉાKʉӘ\rKʉƐҴʉӘKʉޖʉ,U\rmʉůRʉǇ	UmʉůRʉ໸ʉÔ,UʌȠ		Uʌ෿ǂ\x00\x00	\x00\n\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	̛#\r		ʉۏ@Ґc	ϗʉҙfʌřʉླྀʉZʉ\\ળ\n#\n@\nc\nf\nͲ,RʉȚ\r'ʉýʉ'ʉĆʉ%ʉ\rRʉȚ'ʉýʉ'ʉĆʉ%ʉwRʉȚ'ʉýʉ'ʉĆʉ\r%ʉʉĩRʉȚ'ʉýʉ\r'ʉĆʉ%ʉʉொ$ʉ\\\x00\r\x00Pʉ,		ʉଈRʉӓʉů\r'ʉýʉƴʉΈ'ʉĆʉƴʉǋ%ʉé\x00\r\x00\r\x00\x00Hǃ\x00գ̛ํΏ།Ґ౩ਅ๏ǄπƨʉɈƨʉɈƨʉɈƨʉಅǅ\x00	\x00̌\x00̍\x00̎\x00	˦\ř	#̍	ਮ̌཈̌ளǁ\x00̌\x00̍Q̎ǀ\x00̌\x00̍½\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00	ˏʌĖʌřʉ୙5\rʉධʌȰʉ±	ǄŉʌȠʌƝ\rP\nʌ+\nŸ\n\"\rƑǄ\n\n	ʺʌ\nmʉ͝\nрʉ«	ǃ\x00-\x00ǂ̎\x00y̌Ǆʌ+,ʌՠƒ\x00	\x00\n\x00\x00\x00\r\x00\x00\x005Ƒ\n8ʌĒʉԢʌʉۨ	ʌřʉଜ\n\n	ʺ\rʌ\nmʉ͝\nрʉ«ǂ̎\x00\rǹ̍\n	ǃ\x00˶ʌ+,ʌƍ\r]ƒ\nʌِʌĒʌ|n½\n\x00»H]ă0ǆ\x00\x00	\x00\n\x00	\x00\n\x00ōʌïƴQϼ	BʉΨ\nBʉҚǅ\x00\nF½\x00	Ǉ\x00\x00	\x00\n\x00	\x00\n\x00ϼ	BʉΨ\nBʉҚǅ\x00\nF»\x00	ǈ\x009Ƭǆ\x00Èǉ\x009Ǉƭ\nǊ\x009Ʊǉ\x00ÈǋӋÿ/ʌ࠶tМqˢǌ&\x001ǋ͚ʡ,vົǺxsʌĒʉƙǍইǋ༖vశxǎʡɺW>ƲǏ9ʡɺ^ǐ9ʻƲʡɺஞǑ\x00ɱ	ǩaH]ȩ0Ķ9aʌ໫ǒ9aӫǓķaʉØaӫǔaൄ%ʉҋڊ%ʉࣳʉӁ%ʉŗʉØaɞ%ʉ੦ʉϬ%ʉўʉĈaʉØaɞ%ʉय़ʉԁ%ʉģʉŬaʉĈaʉØaɞ%ʉ૆ʉরaʉŬaʉĈaʉØaੑǕҺaʉŬaʉĈaʉØaװǖ9ǕҷʉජǕǗ\x00	ǔ\n	a\x00a$Hʌ	\x00aǘ\x00	ǔ\n	a\x00a$HƱʌ	\x00aÈǙ\x00Û ʌęÍĔBʉˉʉʪʌǚ\x00Û ʌęÍĔBʉˉʉʪʌǛ\x00Bʉ̖ʉ˗ǜ\x00ǜ\x00Û ʌęÍĔBʉࡿʉਡCʉ̉ʌ-Cʉഗʌʿ'ʉʉ̳ʉʾʌ%ʉҮCʉسʌʿ'ʉ¢ʉ̳ʉςʌk'ʉʉqʌ%ʉҮCʉુʌʿ'ʉ¬ʉ̳ʉ૭ʌk'ʉ¢ʉqʌk'ʉʉqʌ%ʉ׽ʌʉຟʌk'ʉ¬ʉqʌk'ʉ¢ʉqʌk'ʉʉqʌ%ʉྡ̛0ǝ\x00Û ʌęÍĔBʉ̖ʉ˗ʌ'ʉƅʌ%ʉǵǞ\x00Û ʌęÍĔBʉ̖ʉ˗ʌ'ʉƅʌ%ʉǵǟ\x00Û ʌгǩʌk'ʉ¬ʉqʌk'ʉ¢ʉqʌk'ʉʉqʌ%ʉǵǠ\x00	\x00\nō ʌęÍǩ	ʉӾ\nŋʉӾʌk	'ʉ¬ʉqʌk	'ʉ¢ʉqʌk	'ʉʉqʌ	%ʉqʌk\n'ʉ¬ʉqʌk\n'ʉ¢ʉqʌk\n'ʉʉqʌ\n%ʉǵǡ\x00ƴʌϤʉమǙ\x00ʌ̨Ǥ\x00Ǣ\x00ƴ\nǜ\x00ʌ̨Ǥ\x00ǣ\x00ǜ\x00ʌ̨Ǥ\x00Ǥ\x00	\x00\nP		ʌ+	,\n	໱\n ʌę\nÍ\nĔ\nBʉˉ\nʉʪʌ\nǥ\x00\x00	Û	 ʌг	ǩǙ	'ʉ¬ʉTज	'ʉ¢ʉTʉೀ	'ʉʉTʉҖ	%ʉ٬ķH®/ѵ˫̌̌&̍\x00̎̍n̎ĸ˪\n˩½̏&͸໕ʡȏ౒ʌĒʉƙ\x00	Äࢣʏˏʏؖ8ƭ\n	ƔʌĒʉтʌʉԢƅǗ	8ƿ\x00̏pƲ\nʶʌĴʌƹƚ!ʌ̘Ɖ̍\x00ு\nÐ̐&\x00\x00	\x00\n\x00\x00nn	͸࢛\n̍?̍\n#!ʉš\n;ʉǉΆ		\n̓̑\x00˪\n̑\x00˩\n̎ࠞ̑\x00	ɥ8	Ƨ\n	ʌʉѬ	ƴ	\n	ƾ	\x00̏p	Ɠƅ	ࠀʌė	\nʎɕʏƃƬ	ࢥ\nਛ·\x00k	ɵ\x00\x00	\n\nBʉš\n͸ࠍL̍৓\x00\n\x00	ħ̎;ʉѬ̎©ʸ̐౳	̍WDށΆ͸અ౮Ǧ(˫>˫kǧ\x00\x00	(˫	ཀ˫·\x00\x00	|ŭ0ĸ\x00\x00	\nP\n\n	\n,\nǫ\n^Ǩ\x00	\x00\nƺ\x00ʌ¯	#\nҊƺ	\x00ʌ൬#?ҊP\nѳǩ\x00?	$ʌď?LP	$ʌÀPśǪ\x00	ʐǇʐɾʙʻʗ෹		ʌ+	ŎƷ\x00	๵ǫƺƺ\x00ʌʃʌ௛ʡ˛ʌ\x00ʌ੼ʷʌyਾǬ\x00(>ʌďHǭ\x00(>ʌÀHǮ9ƺƺ\x00ʌʃʌສĹ\x00	\x00\nʌÞʌɪ$ʌӍ		ʌ+	S\n	Wƶ\n\x00d\nʌ˴ʌѕĺ\x00	\x00\n	5ʌÞʌɪ$ʌӍ\n\nʌ+\nඏƶ\n	ʌ\nΓ	ʌ৅ʌ༼ǯ(>ƺƺ\x00ʌʃʌವǰ9ƻ\x00ʌָቯ0Ǳ9ƻ\x00ʌडǲ\x009ǱǗǱľ̌\x00\x00̍\x00̎\x00̏\x00̐\x00	\x00\n\x00̑\x00̒\x00̓\x00̔\x00̕\x00̖\x00̗\x00̘\x00̙\x00̚\x00̛\x00̜\x00̝\x00̞\x00̟\x00̠\x00̡\x00̢\x00̣̌³̍̎³̏̐³	ʉ෫\nʉǠ̒ʉ˘̗̤	\n̘̤\n\n̙5̛͸Ā̝̟̠̡͸Ạ̄n)®;àOà>L/\x00!\x002\rѵ&ǎʉචʌĶ̜ʚۼ̕̮\r̖1̯ʉĝ̓ǐʉ๹̔ƀsʌౡƆʵ\x00ʍ̷\nƆʵ\x00ʎƫ\nƆʵ\x00ʏн	\nƆʵʌҲʕǜ\n\nƆʵʌҲʑ܋\nƆʵ\x00ʍĶ\nƆʵ\x00ʎú\r\nƆ˓\x00ʘĶ½̴স̴ź	̴ʉZ\n̴ʉ.̴ʉ\\̴ʉľ\r̴ʉã̓8̶ధ̰ʉཬ̲ʍ௪̸،\r(̕˂`̵̎\n̑	Ǥ\x00̑Ϧ̤̺\x00̻\x00̼\x00̽\x00\x00	̺\x00̻̼̽5n	}\n\x00X\x00¸\x00\r\x00`\x00\x00\\\x00w\x00V\x00^\x00À\x00kH\nࢋ̼Ȧ̺!̻̼!̻&ԯX¿̽̻̻/̻Ȧ̺ǻ\r&ԯX¿̼/̼ԓ̺Ǽ̺\x00̽̼Γċ}؀¸ŉ̽̼\x00̼/̼Ȧ̺θ̼J̻̺Ǽ̺̻̼ˢ̻̼ķȦ̺ķԓ̺Ǽ̺9̽˲̥\x00\x00	\nP\n\nô\n?\n	̦\x00(!˂!˂෤݌Ѩॾজ̧\x009ˏʍƇĂݛĂƈèටè฽̨\x009ˏʌíĂ୬ˏʌíèݺ̩\x00		/ĪɩĬɐˏʍƇĪƈĬәˏʍƇĪƈĬԍˏʌí	Ԓ	ʻ	ǻˏʎͽ	̪\x00	\x00\n	/ĪɩĬɐˏʍƇĪƈĬәˏʍƇĪƈĬԍˏʌí	Ԓ	ʻ	Q\nˏʎͽ	\nଭ\nʉӏˏୖ\nś\n̫\x00	\x00\n\x00\x00\x00\r5	1̱ͩ\nۓ£ʌ+,\r1̱Ă\nɨè\nƺʌ̪\r\x00	ū\nH̬&\x00̺\x00̻\x00̼\x00̽\x00̾\x00̿\x00̀n̺5̾5̿5̀5É\x00	\x00¡\n\x00\x00W\x00º\r\x00È\x00¦\x00u\x00µ\x00®H\x00	̻̽̼̿5̀5̺5̾	wA	;VA	^	஺	;wß̺̻̨k	\n\n̻Ą̀ʌk	ල̦k	\n௦̾̽̧k	\n\n̾̽ˎʉன̼$̾̽්̽k	\n̿ʌ	π̼\x00̽^\n\x00	\x00\n\x00\x00ʉã	5\n̥	\x00ٯ̽ô?̾Cʉ·	ഁCʉň	੪Cʉ௽	ంCŹø	ණCʉྈ	੧	ຌô?	఩\nڼ\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ʉæ	\nn\rĽ̻>	Ű̻ඖ55\nཱུ̻଑̺w̺WಿBʉறৡ๻$ʉࣤJ\x00ƈ\x00ъϛ\nŔթ\x00િʉߺӶณ,ंƈ\x00ъϛŔթP?Մʌʉདྷ఼\nB	\r\r\n\x00	ˏʍņ\r\x00	É	\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00©\rĸĽ̿ʌʉྜྷ̀ʌݸௌ̀ʌțS	̀\n̀ୌ̦	\x00\nt࡜	֧\nֺ/	è\nɐ	Ă\n߽ʉޘʉޕʉޟÍʉ࠳ʉ߉ʉ߇Bʉࠐʉఇ	è\nۦʉଔʉυʌϩʌʉרʍԝʒ౤¼ʌ+,$hʌX¼ʌ+,ˏʌíҳ\n$ࣁʌྥ/ʌƝҹʉZBʉۛǕ\rݟ\rย\x00ஈʉ֢\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00ʉĢ	©\n©©ࣄ̿ʌ\r³¼£̿ʌț,̿̿w࢕ɨ	;8\rÜBʉ·\n	L	-Üೄࡽ;8\rÜBʉ·L-ÜBʉǉ\n;	8\n	\x00\rࡸBʉǉ;8\x00\r١\r\x00̿ʌʉພ&\x00\x00	\x00\x00\x00\r5	Ľ̿ʌ֤ʉࡃ\x00ʌཌ\n\x00(JBūࠥJBūȃʉ੬̫̿\n\n#໼ʉʌ+,\r\nݡ \r8Ü	Bʉïག	ܕ	Ü\rμ\x00ʌד\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00	ʉۆ\n̿\x00ʻ	Kʌ๐˂\x00ĽʉٲʌțGʌऻ?1̱࠹੩ݱஃ;˂8̩\x00\n$\x00ˏʍņ\x00ąĉJയൺʉ಩ž୦\x00\x00	\n\nЋ;̌ວࠕ	ʌѴ̦kwp	\n׋\n&\x00\x00	\x00\n\x00\x00\x00\r\x00\x00̿#1̱ͩ	˂\x00\n¼\r£\r̿ʌț\r,̿\r̨\x00๘1̱Ăɨèƺ\n̪\x00\n	 ˂\n 		ќÜ	\n\x00ఔ\x00^\x00	\x00\n\x00\x00\x00\r\x00	\nښ̣	̣1̱ຸ̿̿ൾ̣m	̣m̣\x00̿ʌʐ\r\r\r,̿\r	ȮẶʸ\nȮẹ̀ƺ̧\x00\n̣mμ	\x00\n\x00\x00˲̭&\x00̺\x00̻\x00̼n̺5̻̼É\x00	\x00\n\x00bH\x00	̻̼¼wA;VA^×	k\n	ʌʉŻ	ʌʉղ̺̻	\x00̻с	ʌʉï̼ྂ	̼\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00ʉ߳	ʉ෬\nŷ5\rĽ̻޾̻ô?̺ʌʉ͟\n̄ʍ༦\nʍࠁс\n˶ô?ˎ	\rٴ\r\x00	\x00\n\x00	ؼ\n\n̻ô\n(\n̺\nWʌʉഓʌʉଖʍ೰ʍඔ	ࠓ̺\nѠ	~̮&\x00̺\x00̻\x00̼\x00̽n̺̬\r̻̭\r̼̽ʐҞH\x00\x00	\n\x00\x00\x00\r\n౭!̍Л̺?̺ʍŒ̺V̗\x00\x00	\n ˂8\n\x00̼ο̗\\ห̻?̻ʍŒ\r̻V̘\n\r ˂8\n\r\x00̽ο̘\\ॺ\n~̯\x00̺\x00̻\x00̼n̺̻̤\n̼̤\n±	\x00\n\x00\x00ËH	\x00\x00	(ࢦ!̍8̻`	\n̺Ŕ̼`	އË\n\x00(!˂>H9ʻKʉ˯ū˟&\x00\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00!\x00\"\x00#\x00$\x00%\x00&\x00'\x00(\x00)\x00*\x00+	\n\r̒\x00 ̒\x00!̻\r\"̼}!ι#̻wA#;̻VA#̻^#×$̻k#\n%$\x00	$%#$%@ˏʍņ$¡\x00\nˏʍņ$\x00\n$W;˂8&$W\x00&ܵÜ$&@&#	ќʉӦ\nʉӦ଺'$È\x00$'#$'@($µ\x00$(#$(@)$®\x00$)#$)@$)c$)f\rˏʍņ$¦\x00\r\n$u;˂	!̒	$u$u̓ȪˏʌĖKʉԳȪˏʌĖKʉԳBʉࣹĉҸʉ౐ʉʰĉҸŹ༗Ū\r/Jʉ໨ʉ഍ˏʍƕKʉĝˏʍƕKʉĝˏʍƕKʉౙĽ\"ι#̼wA#;̼VA#̼^#×*̼k#\n\n$*\x00$*\x00*b;˂	 ̒	 *b  *b̓!̒	Ǖ !̒	 Ǖ#̑5+	+۞ 	+jʉ઀Ǚ̑\x00+\nǞ̑\x00ˏʍƕ	ūǞ̑\x00\nǞ̑\x00̺\nǞ̑\x00\nǞ̑\x00\nǞ̑\x00\nǞ̑\x00\nǞ̑\x00\nǞ̑\x00\r\nǞ̑\x00\n\nǞ̑\x00\nǚ̑\x00\nǟ̑\x00Цǟ̑\x00Цǟ̑\x00ڂ̰\x00\x00	࣋ʌʶิʏவʏىʍ߾	൹ʍəʍߗŲ߯Ųಛʍৄʍౣ̱\x00བ໲̲9͸ª̡̳̗ʌࢽ̴\x00		1̰\x00\x00̲ʍ༬̓	̶	ૹ̳	ߥ̢!̍	̵̍Q̘`	\n̢̎\x00̘}ø̵ַ̠̎ཾ	ʌΫ̗`	-	ʌ̵࣏̍\x00̌\x00	\n	ʍԋ̏	̠ʉ̟ࣥ̠ʉམ	ʌʉԤ̞	\x00̠࢒	ʌʉخ̦̞\x00	̵̍Q̠ࠧ	ʌʉ·̠Ĕ	ʌѴ	ʍԋ̐8̠ʉ.̟ݪ	ʌΫ̟࡟̟̟Gʉ·̠ۄ̢̍~̵\x00\x00	\n\x00\x00ʑɄʒ຾!̍	̗͍̘\rϡ\n̕ʐઃ\x00\x00	\n̖±\x00\x00\nȈ̶5ʌʌೆʌ਄ʌʸʌলʌʸʌƺʌʍ໤ʌʍ৳ʌʍ຿̙ʌʡeʌ̙ࣜʌԡ͸ª̛Gʉৎ̸̷̧&\x00\x00	\x00\x00\r\x00ǎʉ౯		ʌ+	ु		ୂ\n	௩ʡeʌ\x00ʌܓƬǍඉ&7˓ʏಠ˓ʏƲʓෞ˓ʙȝʉ೙ʡeʌؑˏʍ૪\rߘˆsʍි˓ʍඣ˓ʍ̜ʍ޴˓ʍ̜ʍ৵̸&ܚ̚	̚̷ŉ̝Ąʌ̚\nʌ̝\nʌ̔\nʌė̙\n̙5̛͸Ā̹ʡeʌ୮̹ŷ˓ʌট1˓ʌࡄ˓ʌౖ1˓ʌņʎ௾̄ʌƔʎT̜{ʌť೽ǳ&\x00̌7˭`˭³Ɔʵ\x00ʒƫǶ\n˄ƚ\rƛ͸þʉि̌DR ˄R\nʡƊʉZʡࢍǵʵʌԱ½\x00	\x00\nʡ=ʌʌʌԩǸ\x00ʌͤʌͅǸ\x00ʌžɊ͙̌ɝ\x00ʌՖ͸ʊÂʌڙʌ:ʍԾʎԇʏౄʍŲڲʌƁʡ¥ʡŌʉו	ʌ:ʌȸ	ݜ	ʌȓ	ɘ	Q\nȊ	Ū!ʌଃ˕\n௏ɲ\x00ɜ଩Ǵ\x00	\x00\n\x00	ʌ:ʍފ	ʀ`	͸ࡅ|\n˰	ħ\n8\nn˰	\n\x00ʡÃʌ	ઉʌѫ	͸Թ	\n\n6͸þ	\nƛ\n6\n\n==ٳ\nǵ\x00\x00	\n\x00\x00\x00\r\x00\x00\x007Ҫ˂`\n1ʇʉ࣪ʍf\rʒ̚ʑग़		Q\rїș˄(ਰWࢂड़\n\"\x00\rǎϡ\nຒǸ\x00(ʌ:ʍව͸Ħ\x00\x00ʌ:ÈǺ\x00\x00	\x00\n\x00\x00ċ=ÇÇ¼	Ç¥\nÇÇ]ǻċYൕǼċǽċUӨpӨМoÇn	nਥ	ʌހǾ\x00	\x00\n\x00\x00\r	͸Ȋʉĝ\n¼຃Uல	\né\nG	ʌྣ͸Ȋ	ʌƝʉඩΟ0ǿ9ƈ\x00˶Ȁ9ƈ\x00˸ȁȄ!ʌĹʍܨʍӛʐˠฺȂ\x00	\x00\n\x00Y7ʌјʉ໾	#\nූ\n ʌɖ\n ʌ෽	zǼ?	ʌࢲ̲\ṉʌʝʡI¬ʌoʌʌը	=̃		Y7	ʌјʉʬ		ʌʉĩzǼȁYȀȄЄ	ʌb	ʌʉ.ʉ෇̲\ṉʌbʉĮ\x00ʌÓʌʝʡIʌoʌʌࡢ	=̄8		Y\x00		ʌƑȀʍƭʍ@	ʌb	ʌʉZʉ«̲\ṉʌbʉĮ\x00ʌÓʌʝʡIʌoʌʌ็ȃ\x00(ʌভʏ࠱ƈ\x00˷Ȅ7ʌʉɲʡÃʌྞʡÃʌ\x00ʌہʍӛʐˠܗʡʌǹʌ৬ȅ\x00	\x00\n\x00\x00Y\x00	ഝ	zǼ?	ʌེÑʡI­\x00ʌbʉĮʗೝ	ʍࢷʌưʉԤʌbʉĮʡI«ʌÒ	\x00ʌÓʌʌը	=̄ː\n	Y\x00\nc\n#ȃ\nƒ\x00ඐʍ@ʌʉš$ʌࡥÑʡI¤\x00ʌbʉĮ\x00঵	=̃\n	Y7\nʌɀʉʬ\nc\n#ȁYȃ\x00ȄЄÑʡI¤\x00ʌbʉĮ\x00ʌя\x00ʌÓʌƨʉšʌbʉܛȆ\x00	Y\x00	c	ʌɂŽ#ÑʡIl\x00üʌÒǚʌиǿ	ü#ÑʡIcʌÒ૝	ຳȇ\x00	Y7ʌɀʉʬ	cȁ		Ȅ	\n	ʌɂŽ#ÑʡIl\x00üʌÒǚʌиǿ	ƒYƒYʌ๓ƒY݀ƒYʌࣷü#ÑʡIcʌÒ஋	\x00൓Ȉ\x00	Y\x00ʌưʉ͟	@	ʎ༚ÑʡI\x00üʌÒŽ	\x00ʌbʉΜʌֱȉ̗=߅̃ȇȆ̄ȆȆ̅ȅȆ̆ȈȆ̇ȂଝȊ\x00\x00	\n\x00\x00\x00\r\x00\x00Äઌ\n͸Āʃ\n\n͸Г	ÇP\r\rʌ+\r,\rń	ȉ\r๳\n͸Āʡ¤ʉ઩Ǿ\x00ÁQ\n͸Āªʌ۽\n͸Г˓ʍβFŁ]ɹ0Ȑɋǵ\x00	ρ˔	ÄʍԎʌѱʡ=ʌʌţɲ\x00\nʌȖɊQɜŅ\x00\x00	(Ȕd͸˸\x00	\x00Mʌͺ$	H	ȑ˓ʔ٩ʌషНʌࢳzƖ\x00ʌഊƚʌҡНʍҌʍਜʍંʍͿʌ୴ʍϰʉೡʍͿʒແ	˂Ȓ̊ʍҌʍϰʉ٤˂ȓ\x00	\x00\n\x007˓ʌབྷܳʓʻʔۗ		ʌ+	ަ˓	෕˓	ඳʌЅഥ\n˓	ࢧ\n\nʎ˃ʌ+Ŏ\nʎ˃Ը\nʎ˃UʌЅಘȔߍʌಚʍཥʡ¥ʡŌʉɰƀûʍϟƀsʍ๒ȓെʌΒʌՓ˒ʗλʌœ˹ʌxʌಟʌΒʌҡ˒ʕλʌœʾʌʌ֝˂ȕ\x00\x00	\x00\n(Ȕ	൰\nÁʌɓ͸˸\x00\n\x00	ŦȖ\x00\x00	\x00\n(Ȕd͸˸\x00\n\x00ÂȑYƖ\x00ʌͯʌĎ\n/͸Ȥ߸\nL͸Ħ\x00	\x00\nF\n༧ȑYƖ\x00ʍޓʌĎ\n$	ഺ	\n\x00ɵ4\n~ȗ\x00\x00	\x00\n(ȑYƖ\x00ʌ˿ʌĎ\nɧ\x00	Å\nL͸Ħ\x00	\x00\nF\n~Ș\x00\x00	\x00\n(ʵʌĎ\n͸؂\nL͸ঢ\nF͸ุș\x00\x00	\x00\n7ȑtȯ\n\nʌĎ	ĕL	\x00ȐF\n~Ț\x00\x00	\x00\n\x007ȑtȯ\n\nʌĎ	ĕLʍĩ	\x00ȐF\nࡱʽ0ț̌\x00\x00\x00	(ȑ̌YƖ̌\x00ʌञ	ʌী̌f	\x00̌\nH	\nɓ̌෌̌fيȜ\x00\x00	\x00\n\x007ȒϺʡ¥ʡŌʉПʐԿʡ=ʌʌҤƖ\x00ʌΩʌȼƖ\x00ʌдʌЀʌੌ!ʌĎ\nɧ\x00Å\nLɢ\x00\x00\nF\n໋ȝ\x00\x00	\x00\n7ʌɖȑYƖ\x00ʌࣦ\nʌ૧Ǵଏd\n\x00ʌ৫˂ǁ϶\n~ņ\x00\x00	\x00\n\x007˂ʡӻ	ʌĹ˻ʌÀ	W ˂\x00\x00	\x00\nM ˂>Ϊ!ʌͺ	ͧ\nH	\nȞ\x00	\x00\n7ȑt	ʡ=ʌʌ	!ʌŚ\nWȑ\nd\n7\nNƶ\n\x00ʍසʡ\n\n͸ȤM\n;˂>͸ڦ\n੮^ȟ\x00\x00	\n\nʍԣɰ\nM	>ʡ\n઼\n^Ƞ\x00	\x00\n\x00\x00\x00\r\x007ȑt	ʡ=ʌʌ	!ʌ΄ȟ\x00६	ʎȉ\nɶ˖ʉŀɶ˜ʉŀWʌ˱\nʏ͂	͸Ĥњ\nʍͱ\rʍԣɨ\n\rʌ<ʌæF\rʌ࡚ƀȃƁ}ȔdʡǺ^ȡ\x00	7ȑt	ʡ=ʌʌ	!ʌ΄ȟ\x00ܷ^Ȣ\x00(ȑdɱ\x00F^ȣ\x00	7ȑt	ʡ=ʌʌɝ\x00dʡટ	ʌ˷͸Ĥՠ^Ȥ\x00(ƀȃʡࠊȑYƖ\x00ʌܽȟ\x00ত^ȥ\x00	\x00\n7ȒϺʡ¥ʡŌʉП	ʐԿ\nʡ=ʌʌҤƖ	\x00ʌΩ\nʌȼƖ	\x00ʌд\nʌЀ\nʌॖɧ	\x00\nÉǎȫ0Ȧ\x009^ȧ\x00(!ʵ>͸þʉͫ^Ȩ\x00	7ȑYƖ\x00ʌ˿	ǴM	>	dŁ^ȩ\x00(ʵ>Ɓ}ȔdʡǺ^Ň\x00	7˂ʡӻʌĹ	˼ʌÀW	 ˂>	\x00É^Ȫۿʌਓʌìʙȴʔ̮ʎ֥ʌࡶȫ\x00	\x00\n\x007Ȫ͠ʌŐʌˡʌ൶ʎfʌɭʐܦʕଉ		ʌ+	S\n1˒ʎǲ	௰\nʍƖഎ1˒ʓตʍƖనȬ\x00	\x00\n\x00\x00\x00\r\x00ʌŐʌˡʌɭʌঠ		ʌ+	S\n1˒ʎǲ	৔1˒ʎǲ	ĕʓҼ	ĕʎੁ\rŰ\nʍƖ×\rయʍƖ×ǒ\r̢ॗ\r̢໮\r;༜ȭ\x00(˒ʒƠʍఅʌœݍ8ʌ¾˒ʘ܉ʏӄʌ¾˒ʕࡏʏ೼ʌ¾˒ʓङʌ¾˒ʙ঑Ȯʡԅȭ{ʡ´ʉʂʏξફʵʌāʍ±ʍƎ\x00ɹ\nʍ˼ʡԅʡ´ʉʂʡŊʌ\x00ʏތʌԮȭఐȯ(ȫ५Ȯ¶϶Ȱ\x00	˺$ÄȬ˺ײʡ¥ʡ´ʉԬ˺ȯ˺-ȫ˺	1ʡ೻ʏ¾˺\x00ʔҠɹ	\n˺	ʔ஽ʎಋ	ʌȯʎॷʏȝ˺\n˺ՍȐ|Ɓ0ȱ\x00\x00	(Dʎཛʌ୤ʡ೥ʉˌ͸ఱÁʔ੯ʎޱɉ4ƍ\x00\x00	Ȳ\x00\x00	(˓>Ȏʌx˓\x00	Fƍ\x00\x00	ȳ\x00\x00	(˓>ȏʌx˓\x00	Fƍ\x00\x00	ȴ\x00\x00	(˓>ɮʌx\x00	Fƍ\x00\x00	ȵ\x00\x00	(˓>ɯʌx\x00	Fƍ\x00\x00	ȶ\x00\x00	(˓ƚ	ǾʌɓȊ	ࡗƍ\x00\x00	ȷ\x00\x00	(ƀûˎ>͸൧\x00	Ùƍ\x00\x00	ȸ\x00\x00	(ƀûˎ>͸ే\x00	Ùƍ\x00\x00	ȹ\x00\x00	(ƀȃ͸੃\x00	Ùƍ\x00\x00	Ⱥ\x00\x00	\n\x007ƀûˎ\nƻʌƂʌ͕ƺʌƂʌ௝ʡş\nHŁƍ\x00\x00	Ȼ\x00\x00	(ʵʡঋ	ǾʌȱȰ\x00	Ùƍ\x00\x00	ȼ\x00\x00	(ȑYʍˮɢ\x00	#	ųƍ\x00\x00	|Ɲ0Ƚ\x00\x00	(ȑYʍˮɧ\x00	Ùƍ\x00\x00	Ⱦ\x00\x00	(ȑYʍˮɩ\x00	Ùƍ\x00\x00	ȿ\x00\x00	(˓ʍ໢͸ݣ\x00	Fƍ\x00\x00	ɀ\x00\x00	z˓ʙ୎	Е˓ʍҍɕ	࡯ƍ\x00\x00	Ɂ\x00\x00	˓ʐδz˓ʐδ	Е˓ʍҍɕ	݈ˬȑYƹʌлʌ˿ʡپ͸чÉƍ\x00\x00	ɂ\x00\x00	(ȑYƖ\x00ʌభɋ\x00	Ùƍ\x00\x00	Ƀ\x00\x00	(ȑdɫ\x00	Ùƍ\x00\x00	Ʉ\x00\x00	(ȑdɬ\x00	Ùƍ\x00\x00	Ʌ\x00\x00	(ȑdɪ\x00	#	ųƍ\x00\x00	Ɇ\x00\x00	(ȑdɭ\x00	#	ųƍ\x00\x00	ɇ\x00\x00	̌7ȑťʍॕ	Օɰ̌\nǵ̌\x00\n\nɹ̌F̌Łƍ\x00\x00	½\n(̌`ɰɈ\x00\x00	(͸٧ʎॠɑFƍ\x00\x00	|˅0ň\x00	\x00\n\x007˂ʡם	\nʉ\nʡ\n,	ʌ˩\nཌྷʌĹ˽ʌÀW ˂>\x00\x00	Éƍ\x00\x00	ŉ\x00		£	ʡ	,ʌ˩	Ր˓ʌݐȎʌx˓\x00Â˓ʍึȏʌx˓\x00Â˓ʍۣɮʌx˓\x00Â˓ʍൣɯʌx˓\x00Fʌx˓\x00Ŋ\x00ഭ˓ʍݹʌȱȊ਼ŋ(ʵ>͸ਨʌ߼ɉ&\x00˩ʎ๾˩ʏऑ	˩ʎຂśɊ̌\x00Ä̌e̌e5Ɔ̌\x00ʌΘ	\nǴ̌Md`̌ʌ:ʌĥɢ̌\x00ʌŞ	͸ආ̌\x00ɋ\x00		ǴM		d೉	d	dʌҨ	dʌ\x00¶\nÐɌ\x00	\x00\n\x00	e7		ʌࢶ\n\n	ʌ෣\nѹ	\nʌҨʌ\x00¶Ðɍ\x00\x00	\n\x00\x00\x00\r\x00\x00\n	#	@	ӆʌ̘ʐӖĲ͸ƾ\n\x00ʌำZ	ZಃZʌ\nƖ\x00ʌ෡\rĸʌ:ʌ«8ʡeʌӼʡIsѪʡIy\x00ʐঈ\rʉൠʡlʌ\x00໻\r	ɜ୷͸ƾ\n\x00ʌঘƖ\x00ʌؽɊ·e	eଽʌ߹eʌÂʏ৿eʓͣ߰ƍ\x00\x00	Ɏ\x00\x00	\n\x00\x00\x00\r\n	#	@	ӆ!ʌ̘ʐӖĲ͸ƾ\n\x00ʌڋZ÷\r\rZʌ+\r,Z\r 	Zʌb\rਯ͸ƾ\n\x00ʌຝe÷\r\reʌՋe\r 	eʌb\rമ\r۹ƍ\x00\x00	ɏʏκʏ૖ʏ୳ɐ(ʏࠉʙഠʏௐʯ0ɑʎ఻ʎଦʏࢗɒ9ʏنɓ̌\x00\x00	\x00\n̀̌\x00Ǵ̌\n	/6Ɯ̌ʌ঴ʡȭ	tɏ຤2==GʉΔʡூ\nʡr6ь̌ʌţ\n˂\nʡȖ͸̌\x00ʌ׿̌ʌ<ʌæ\n\nʸ̭ɔ̌ɔ͸Ȥ\ǹ˂\x00;˂	ʌĘʎؾɕ̌\x00́̌\x00̌ʌ:ʌžNƶ\x00ʎ૨͸Ȥ̌\n!˂	͸̌\x00ʌ஝̌ʌ<ʌË\nʸ	̭	ɖ̌ɖ́˂\x00ʌöʎ۸ɗķ˒ʕяʌ੖ʌœÈɘ\x00	\x00\n\x00ōʌʌ˹ʌ\n	ˉʌ\x00ʌڒ\nʌԷʡʌ\x00	\x00\n˨ə\x00	\x00\n\x00̌\x00\x00̍Ǵ\n	ǴӅf	jfࠟj	\n	jʫ\nʌ:ʌ«	j\nຍ\nʌȓ\nɘ\nQ\nȊ\nഴ\nບ̌ʡeʌӼʡIsѪʡIy\x00ʐƫ\nಣʡ¥ʡŌʉ࠼ʘЫʖਢʘҶ̌Ȋޗ̌\x00ʌɘ˕̌ଢ̍ʌɘ\r½\r&\x00\x00	7̍צ̍ʌ:ʌ«̍ʌࢠʌ<ʌŽঀ̍Ą	̍ʌɊʌࢹ̍຋ʌ<ʌZޡʌɘH	~ɚ7ƐZћZʌ+,Ƈ\x00ʌƦZŦɛ7ƐZћZʌ+,Ɔ\x00ʌƦZŦɜ\x00	\x00\n\x00\x007ƹʌлʌͯə˫ʌZʌ઱		ʌ+	S\n	ʌ:\nMɗt\nʌ·ɚਠʌȓɘQʍ˘Ʒ\x00Ȋʷʌ\x00ʌ൑ȊŪ\n˕¶\r_\nʌ·ɛ൞ʹ0ɝ\x00	7ʌ༽	ʡ=ʌʌࣅ	ʐఴ	ʌࠃ	ܑ	ʎ˰	ʗཇ	ʎŻ	ʔ൱	ʌؗƹʌ:ʌШʎ౶ɞ\x00\x00	\n\nʡ=ʌʌ\nʌ˳͸Ħ\x00\x00	༪\nʍЍʌ<\x00	\nɵ঍ʌ<\x00	ɟ\x00\x00	\n\nʡ=ʌʌ\nʌ˳ʌ<\x00	\nəϊʌ<\x00	ɠ\x00\x00	\n\nʡ=ʌʌ\nʌŚ͸Ħ\x00\x00	ϊʌ<\x00	ɡ\x00\x00	\n\x00\x00\nʡ=ʌʌ\nʌŚǴŪເ_	ྩ	ʌʌ©	ɘ	ą	Ȋ	Ūʌ<ʌŞূ˕		\ndʌ൥\r_ʌ<ʌࠬʌ<\x00	ɢ\x00\x00	\nȄʌĹ\n˾ʌÀW\n ˂>\n\x00\x00	Éʌ<\x00	ɣ\x00	\x00\n\x00\x00\x00\r	ʡ=ʌʌ	ʌ˳\nǴM\nƚ\n6ʌɓ\n6̋ʡʌ:ʼ	ʎȉɶ˖ʉŀɶ˜ʉŀ\rʌ:Mʌ˱ʏ͂\r	͸Ĥ\rњʍͱ\r>ɨ\rÉʌ:ɤ\x00	\x00\n	ʡ=ʌʌ	ʌŚ\nǴM\nD\n6ʡృ\n6ʌȱ\n6̋ʡʌ:رʌ:ɥ\x00	\x00\n	ʡ=ʌʌ	ʌŚ\nǴӅ\n\n_>\n_Łʌ:ɦ\x00	\x00\n	ʡ=ʌʌţ\nʌ:Mɝ\x00dʡ\nÂ	ʌ˷\n	͸Ĥ\nझʌ:ɧ\x00	ȄʌĹ	˿ʌÀW	 ˂>	\x00Éʌ:ɨ\x00	ʡ\n	ʡlʌ\x00ʡÀʌϽ	 ʉ˅	؅	֙ʡʌy	É]ͫ0ɩ\x00	\x00\n	ʡ=ʌʌţ\nǴ\n\n8	ʌӯʌȼ	ʌɁʌౠ\n6ʡ̒\n=ʡ֗	ʌɁʌ؎\n_˂\x00\nd˂۵	ʍࡼʌňɵദ͸\x00ɪ\x00\x00	˓ʍ̏z˓ʍȾɴ\nɹ̠ʚȜ\x00	ɫ\x00˓ʍ̏z˓ʍȾɴ\nɹ̠ʌűɬ\x00		ʍŲ\nɵ4	ɭ\x00\x00	˓ʍ̏z˓ʍȾɴ\nɹ̠ʖ໽\x00	ɮÛʌΤȊʗƍ˓\x00ʍࡇɯÛʌΤȊʗƍ˓\x00ʍࠖɰǴ\n8j;˂	ʌ<ʌZjQ=ʉŻ=ʉ֐Ɩ\x00ʌକʌ<ʌæ6-Ɩ\x00ʌ൦ʌ<ʌË6\ne	e˂ઘ_;˂	ʌ<ʌŞ_Q͸\x00ʍ࣐ɱ̌\x00̍7ʡ¥ʡ´ʉˌ̌ʌ௫ʡ=ʌ̌ʌЙʌ˷̌ଡ̍ʵʌāʍ±̍ʍƎ̌ɰ̍\nǵ̍\x00F̍ʍ΂̌̌ʍೱɰ̌\nǵ̌\x00	F̌த(̍`ɰ	(̌`ɰɲ\x00̌\x00	\x00\n̌ʌࡹʡ=ʌ̌ʌบ	/ʌ͹\n/ʎॳʌ޿	\nཻʍս	Ɔ̌\x00ʌƦ঱ˮʎ҆̌\x00ˮʍƵ͸Āˮʍʕ~ɳࣉ૔ʌ೗ઔƸ\x00ʑ૮Ƹ\x00ʘ੄Ƹ\x00ʔขƸ\x00ʙ଼Ƹ\x00ʒஔɴ\x00	\x00\n\x00\x00\r\x00\x00\x00\x00\x00ÄʍԎʌѱʡ=ʌʌţɲ\x00Mʌ:ʍڪʌȖɊQɜˋʌԩǸ\x00ʌͤʌͅǸ\x00ʌžɊ͙ɝ\x00ʌՖʌ:ʌՑ͸ʊேʌԇ	ʌعɳ	ࢄ\nʍ˼\nȊ\nŪʍƎ\nǁ_ɸ۪ʌ:ʌՕ8͸Ĥ\nʌ<ʌ#ఒʏ߲\rʌ:ʑǔʌ:ʍʾ\r\rʖح8ƺ\x00ʌ±ʌबʡÊʌ@˒ʐ˥ʌ֛̕ʌ¨ʡrƆ\nʌ<ʍӳݯʎ౲ɶ˖ʉŀɶ˜ʉŀʌ˱ʏ·ɸ-ʍߊɷیʍЍɵХɜ|Ž0ɵҰ̂`̂˄\x00ʸ̭˄ƚ΋ǲ̂R\x00˄R͸ܝ̂ʡణɶ\x00\x00	\n\nʌ:\n\n8\nƵ\n\n	8	Í\nʡ=ʌ\nQ	Ȫ\nʡ΍ʌ\n׵\nɷ\x00	ʌæ	ʌ:Ӣ	`͸Ȟ\x00\x00	໊ɸ\x00	ʌ#	ʌ:Ӣ	`͸Ȟ\x00\x00	ۉɹɋǵ\x00ɴρÐŌ\x00	\x00\n	£	؄	?ʌ˩	Ր!˓ʎ໪ʌ܅\nʌఉ\nʌïʌ๮Ȋ\nʗ˕ʌ૞˕\rϩʌࣼҽʌધϘʌƨʉడ#҂ʌƨʉฏ#@਑ɺ\x00ɺ\x00	\x00\n	\n\nʌ+\n,	\nք\nʌѮ˕ʌŐʎԙʐੇʡeʌ	\x00ʌǤʌω\x00ɻ9̈^ɼ9̉ହɽ9̊ʌìඓɾķGʉख़CʉҁGʉКCʉஆGʉࡘɿ9GʉƤCʉജ⽫0ʀ(ʉԚ̋Ɨʉࡾɾʁ(ʉԚ̋ෛɾʂ̌\x00̍\x00̎\x00̏\x00̐\x00̖\x00̗\x00\x00̥̌ʡÊʌ\x00˒ʒȔʌ༑̍̎̏©̐ʡÃʌ̌̅ʖপ̍ಫ̑ʡÃʌ̌\x00̍̒ʳʌ̌\x00̍̓&ʳʌ̌\x00̍ºʉň̏஛̔˄೸̓̕9ʷʌ̌\x00̍\x00ʌɃ]̖5̗¼ʉŜ,̖ʌ྆Ǻ࡛̘\x00		̖̗̗/̗ʉඵ̗Շ	=\x00	\x00	̎\x00	]̏\x00̏ĸ̐H	̙\x00ૂ̚\x00	\x00\n̍௮	ʳʌ̌\x00̍ʈ	ʉ෦	ʳʌ̌\x00̍ʈ	źû	ʉߐ	ʳʌ̌\x00̍۳̋	Ɨʉઈʉ๫	ʉ଄	ʉ߫	ʳʌ̌\x00̍Ǹʉщ		Cʉৈ	ťû	ʉగ	ʳʌ̌\x00̍Ǹʉॼ		ţྀɿ	×	ʳʌ̌\x00̍ʈ	ʉ͞	ʳʌ̌\x00̍Ǹɿ	×	ʳʌ̌\x00̍ോ	ʉ൭	ŧß	ʳʌ̌\x00̍º	ʉΙ	ʉ̈́	ʳʌ̌\x00̍྅ɿ	×	ʳʌ̌\x00̍೛	!ʉࡤʀ	̙ʖŤ̍Ϲ̍ù\nʡʌ̌\x00\x00̍\n	\n\nś̘ʉZ\n̛&\x00\x00	̍\x00ʳʌ̌\x00̍ߛ	ʳʌ̌\x00̍ԏ		ʉň̙ʖแ	ʉϣ̍ઋ	 >̘ʉZʡʌ̌\x00\x00̍È̜&\x00ʡlʌ̌भ̍\nʉૉʷʌ̌\x00̍\n̍̌ʌಭʡʌ̌\x00̍\x00\n̍F̤̝&\x00ʡlʌ̌௖̍\nʉƁ̙ʕ۾ʡʌ̌\x00̍\x00\n̍ʉZ̏̏ʡlʌ૛̤̞&\x00\x00	̍\x00ʳʌ̌\x00̍Ǹʁ×ʳʌ̌\x00̍Ձ̍ù	ʡʌ̌\x00\x00̍F	̟\x00	\x00\n̍\x00\n৸	ʳʌ̌\x00̍ԏ		ʉň̙ʗว	ʉ൙\nࠄ	ʉϣ̍൸	ʉ൫\nע	 ʉ௸\n?̞4̘ʉZʡʌ̌\x00\x00̍È̠&̐7ʉ˪ʉŻʩʉŘţûʉ˪!ʉ͋!ʉࡧ!ʉຩ̡̍ݬ̑ږ̓4̜٥̓4̝ྡྷ̠ທ̑̐ʌ༙̓4̘ʉඦ̘ʉ.ʌಮ̟ʌѓ̢&̍Ü̒}ɿd̚ʌ݃ʉຣ̌ʌaࣰ̍ʉࠈ̓\r̓\r̘ʉب̘ʉfʌẒ́&\x00̞}̐ʉఋ̘ź̉Wܼ̘\x00F̘ź	&̥Ѽ̥࢖̛\x00̥з̢\x00̥Ɍ̡\x00̥̓\x00̥Ʒ	\x00̥͊\n\x00̥৩\x00̥Φ\x00̥՚\r\x00̥಻\x00̥ࢴ\x00̥ਁ\x00̥ܮ\x00̥ك\x00̥ॆ\x00̥؉\x00̥൪\x00̥ɏ\x00̥՝\x00̥ɍ\x00̥Ѱ\x00̥Ϟ\x00̥ࢪ\x00̥૴\x00̥ન\x00̥ުPʉɿ,̋Ɨʉ·̥̣GʉƤCʉȖ̥̚୼&̓\r̒g°̓\r̒g°̓4̘ʉพ̘ʉݘ̘ʉ\\ʖ࠯	&̓\r̒}!Žß̓4̘ʉ̘ࠪʉ.ʍѲ\n&̓\r̒gʜ̓4̘ʉ٣̓4̘ʉձ̘ʉ.ʌڠ&̓\r̒g°̓4̘ʉ൝̓4̒̐Ž¿̓\r̘ʉຎ̘ʉೖ̘Ũ\rʌ෢&̓\r̒g෮̓4̘ʉࠇ̓4̘ʉǪʌ̘ࠡʉǌʎ਽\r&7̕ྛ̏̔ʉ༳̜˓̓\r̒g༮̓4̘ʉଠ̓4̘ʉ୿̘ʉǌʎͷ&7̕ʒ؊̔ʉ̜ͫ˓̓\r̒g஫̓\r̒g°̓4̘ʉ୸̘ʉࢺ̓4̘ʉਆ̘ʉ.ʎ๤&̓\r̒g°̓\r̒g°̓4̘ʉޣ̘ʉ஀̓4̘ʉو̘ʉ׎ʌؤ&̓\r̒g°̓4̘ʉޙ̓\r̒g°̓4̘ʉഽ̓\r̒g°̓4̘ʉǪʒआ̘ʉీ̘ʉ్̘ʉ.ʎؚ̍ǒ̒̐ʉ͞ɿ̌ʌa̍ੂ̓4̘ŷߙ̒੾ʉઢ̓4̘ʉ༟̘ʉ൒ʌŇ&̓\r̒g°̓4̘ʉ෍̘ʉೞ&\x00̍\x00̓\r̌ʌa̍ĭ̍̌ʌȡ̍ǒʉͼ̍ժʉф̌ʌa̍Áʉ͖̍у̘ʉଅ̌ʍő\x00̍ʼʉΑ̘ʉू̌ʍő\x00̍3̌ʌa̍|̙ʏɸ&̓\r̒g°̓4̘ʉତ̓4̘ʉฦ̘ʉ.ʍ୵̓4̘ʉ\\ʐശ̓4̘ʉ˞ʌ҃̓4̘ʉԧʌł̓4̘ʉɽʌˣ̓4̘ʉÒʌʇ̓4̘ʉǃʌ܎̓4̘ʉ̚ʌͻ̓4̘ţ\rʌȘ̓4̘ʉŞʌಬ̓4̘Ź\rʌ๣̤&\x00ʳʌ̌\x00̍ĭʉ૶ʉ´Cʉ෩Bʉྲྀɽߤʉň̏૰ʳʌ̌ɼ̍̎̍\x00̥W>}Bʉࢉ̘ź̞ާ>̘Ğ̙ʓˤʆ௃̥5	\r̤Å̙\x00̤\n\x00̤¿H̤\n̐ˢ&\x00̍\x00̌ʌa̍ĭ̍̌ʌȡ̍ǒʉͼ̍ժʉф̌ʌa̍Áʉ͖̍у̘ʉ̒̌ʍő\x00̍ʼʉΑ̘ʉ௜̌ʍő\x00̍3̌ʌa̍|̙ʏͷʃ\x00\x00̌̍\x00̎\x00̏\x00̐\x00̷\x00̸\x00̹\x00̺\x00̻\x00̼\x00̽\x00̾\x00̿\x00͊\x00͋\x00͌\x00͍\x00	̍ʂ\n̎ŷ̏ŷ̐ŷ̎̓ຆ̑9̎=̒̐O̐̍˟̓̏̎\x00̐8̎̐\x00̐ྌ̎̍4̎̔\x00\x00	\x00\n̍Å\x00\x00	\x00\n̕\x00̔\x00̖ɱ	̎L̕\x00ʓݏ=Ǔʌł̗(̑d̓A̕̎\x00ʐЬ̎=Ǔ̎ʏ̮ǓɻÅʌł̘(̙d̓A̕̎\x00ʐЬ̎=Ǔ̎ʏ̮̙9̎=ܱ̎!̚ై̌D̎]̎=े̎=Ź˟̛ʌʌ̀̎=ʉϝ̓ษ̚ø̧̖̜\x00ʌ\n̗ʉǑͅ\x00̽{̍\r̗ʉĊʌʌł̝ྊ̎=ӵ̙ʍ๱̠ˋ̙ʌඛʌ̎i̓Х̒͐=ʉ৞̡-̢؜̩ඃ̓\rʌʌ෧ʌ̎\n̓\ṛຨ̓\rʌʕԐ̛߂ʌʖĥ̓\r̝\n̗ʉԐ̜\x00ʔỠ࢙̓\r̜\x00ʔ̝ͦܖʌʒƛ̓\r͆\r̤\n͇ࠜʌʎġ̓\r̎=!Ũ¿̓\rʌʌȐ̶ȟ̦ഷ̧ࣝ̓\r̨ी̓\r̎=ʉٝʌʏྜ̓Յ̚øʌʏ࣑ʌʔżͅ\x00̽{̛ഩ̓\r̜\x00ʖດ͆\r̪\n͇ໆ̓\rʌʖġͅ\x00̽{̛ෑ̓4̫ா̎\x00ʌi̓\r̯\x00\n̛ْ̓\r̜\x00ʖñ͆\r͍{©̝\n͇ݫ̟ਞ̒\r=!ʉˠ=!ŷ¿̎=³̢̞̢ܶ̞̓\rʌʗ୏̎]ʌ઄̎=Ũ¿̓\rʌʌમ̎=!ʉҩ̎=!ʉػʌ̎\n̸̓ͅ\x00̽{̛̟ʌʑɮ̓g̎=ʜ̓\rʌʌÚ̙ŕ̓\rʌӤ̶ʓ̘ʍŤʌʍ¯ͅ\x00̽\n̛̆̓\rʌʌĻ̎=;Źß̎=!ʉ˻̓\rʌʌʽ̎=!Źĺ̶\n̙ŕ̓\rʌʍÚ̶ʍ̗Źpʌʌñ̙ʍɬ̓\rʌʍ¯ͅ\x00̽ą̛َ̎\x00̓\rʌi̯\x00\n̛ԥ̓\rʌʎġ̎=Ũ¿̓\rʌʌȐ̶ȟ̦ඤ̓\rʌʎގ̎=า̎\x00̓\rʌi̯\x00\n̛ԥ̓\rʌʎġ̎=Ũ¿̓\rʌʌȐ̶ȟ̦Ƌͅ\x00̽\n̛̠ࠣ̒}!ʉȉ̓\rʌʍȸ̓\rʌʌȋ̘ʏżʌʏસʌʗġ̓g̎=ࢼʌ̎\n̓\r̛܌̓\rʌʌÚ̙ŕ̓\rʌӤ̶ʓ̘ʍŤʌʍ¯ͅ\x00̽\n̛̆̓\rʌʌĻ̎=;Źß̎=!ʉ˻̓\rʌʌʽ̎=!Źĺ̶\n̙ŕ̓\rʌʍÚ̶ʍ̗Źpʌʌñ̙ʍɬ̓\rʌʍ¯ͅ\x00̽ą̛।̑ࠅ̶ಁ̑ʉഋʌ̎\n̓g̎=ʜʌʌÚ̓\r̙ŕ̓\rʌʍÚ̶ʓ̘ʍŤʌʍ¯ͅ\x00̽\n̛̆̓\rʌʌĻ̎=;Źß̎=!ʉ˻̓\rʌʌʽ̎=!Źĺ̶\n̙ŕ̓\rʌʍÚ̶ʍ̗Źpʌʌñ̙ʍɬ̓\rʌʍ¯ͅ\x00̽ą̛๸̘ʍŤʌʍ¯ͅ\x00̽\n̛ଗ̡̶ȟ̗ʉoʌʌ¦̝̢ͅ\x00̽{̛̣ɱ̚ø̎=ݔʌ௞̶ૡ̛̤̙ʏەʌ̎i̸̗̓ʉ׉̎=ʉࡔʌʌཽ̑ʉړ̎=\x00̎؇ӊ ʉค!ʉȢ̎=³ʌʌoͅ\x00̽ൢ̎\x00ʌʌĴi̓\r̯\x00ৣʌʌoͅ\x00̽ࡕ̎=ʉ୰̙খʌŏ̎i̓\rͅ\x00̽{̍\r̗ʉĊʌʌƹ̝৪̗ʉʘʌʌ̀̎= ʉϝͅ\x00̽Т̗ʉʘʌʌ̀̎= ʉބͅ\x00̽Т̍\r̗ʉĊʌʌƹ̝̥̗ʉǑʌʌoĐ̎= ʉߚ	̥̗ʉǢʌʌෟ̎=ʉ̑̓\rʌʛ̶૬̮ઁ̗ʉĊʌʌł̦\x00͈\r̑Չ̶й̥\n͈\r̩\n͉\r͉̧\x00ʌʙЎ̓΋	̶й8͆\ȓՉ̶఍̎=ʉ෼̓\rʌʖ̦ͅ\x00̽ą͈\r̗ʉĥʌʌĻ̎= Źß̙ʙཛྷ̓\rʌʘศ̙ʌՂ̓\rʌʖՎ̎=Ũ¿̓\rʌʌਖ̙̙ۡ଴̒͐= ʉɂʌ̎i̓ऩ̎=੕̙ʌՂʌ̎i̓\rʌ̎ʌ̎\n্̓ʌʌÕ̓\rͅ\x00̽{̗ţpʌʌ਀ɼ̎tʌ̎\ṇ̖̓̎ߕ̦|̗Źpʌʌñ	͇ŉ͉̨̜\x00ʖȣ̝\n̑ʉ޲ʌʒÚ̓\r̝Ȉ̩͆\r̗ʉĥʌʌĻ̎= Ź͏̑Η̖ŉ̝ʌʌñ̓\r͇̪̗ʉĥʌʌĻ̎= Ź͏̑Η̖ŉ̑ʉାʌʓࡓ̓\rͅ\x00̽{̗ʉoʌʌӲ̑ʉเʌʎפ̓\r̗ʉoʌʌӲ̝ʌʌñ̓̫ʌ೒̩\n̑ʉڀʌʏЎ̓\ȓʉ඿̗ʉǑʌʌo̶׊̗ʉĊʌʌՎ̩ą̑ʉఈʌʓς̓\r̩Ȉ̬͎\x00͏τ&̒\r=!ʉࡈ͎ʌ̎ʌ¦̓\r̓\r̮͎\x00͏=!ʉઑ͎ʌ̎ʌ¦̶͎\x00͏\n̓\r͎ʌʌ±ͅ͎\x00̽໧͎ʌ̎ʌ¦̶͎\x00͏ए̎=؆͎ʌ̎\n̓\r̶͎\x00͏ީ່͎ʌ̎\n̓\r̗ʉo͎ʌʌ¦̮͎\x00͏ӱ͎ʌʌÕ̓\rͅ͎\x00̽{̗ţp͎ʌʌȣ̗ʉo͎ʌʌ¦̮͎\x00͏Ƌɼ̎ඬ̎=ʉગ͎ʌʌÓ̓ߢ̭\x00གྷ̎=!ʉϧʌʌÓ̓}̎=!ţĺ̮\x00̮\x00τ	\x00	ʌѿʏ஁		ʌ+	Ŏ!	෰̎=ӵ	̎tʌ̎\ṇ̶̓\x00ӱ̓\rʌʌÕ̭\x00\n̗ţpʌʌ༕̓\rʌʌɣ̬\x00\n̗Źpʌʌ௯ʌ̎\n̓\r̶\x00Ƌɼ̎ʌ̎\n̓෉̑ʉക̓\rʌʌ±ͅ\x00̯̽ࣖ\x00ࡲ̮\x00M̎= ʉཕʌʌÓ̓ේ̰̓\rʌʌoĐ̎= ʉ೷?ࡐ̗ʉॅ̎=ʉछʌʌѸ̎=ʉ̑̓\rʌওͅ\x00̽ะʌʌƹ̓̱\x00	Đ̎= ʉत	̥̗ʉǢʌʌУ̑ʉߣʌ̎\n̓໰̑ʉࡆ	ʌXͅ\x00̽ƌ̓\x00	̲\x00	\x00\n\x00̗ʉĥʌʌɣĐ̎= Ź੤8	̗ʉǢ		=;ŹøʌʌࠔЋ̎=Źĺ\n̎=\x00̎\x00	̒\r̙ʌ֒	=ుʌi̓ষ\nӣ	=ʉΙ	=Źݳʌʌ¦̶ƽ\nӣ	= ʉƤ	= ʉ֡ՙߜ̓\rʌi̵\n̦ƽ\nଯ	=ʉెʌʌ¦̶\n̓\rʌʌ±ͅ\x00̽ƽ\nʉ༂̓\rʌʛͅ\x00̽ƽ\nŨß̓\rʌʌÚ̎=ʉȢ̓\rʌʌÕͅ\x00̽{̗ţpʌʌϥ̵\n̦ু\nʉȢ̓\rʌʌÕͅ\x00̽{̗ţpʌʌϥ̵̎=ʉϓ̦̗ʉoʌʌ¦ͅ\x00̽ืʌʌñ̓̳̓\rʌʌÕĐ̎= ţß	̥̗ʉǢʌʌУ̎=ţĺ̎=ʉ̑̓\rʌʛͅ\x00̽̎= ʉࢃͅ\x00̽͗̓\rʌʌȘ̴ʌ̎i̓౥ͅ\x00̽{̎= Źø̗Ź̸̎̍¿\rʌʌ˯̎M̎=ʉഛ̣̗̓ʉ̵ۘ̎=ʉŘ̎=ʩɼ̎ʌ̎-̖\r̓̶\x00	\x00\nÄ̑ฅ̎=;ʉ੉̔ʗ್	̎7	!ʔކʌ	\n̓4	]\n̾	ด\nzǼ\n1Ǽ	\n̾	\nQ	ຽ͌U	\n͍U	\n͍p	\n\x00ʌ\n\n̓4\n]̷ʉҔ̸ʉǜ̹ʉ@̺ʉ§̻ʉã̼ʉľ̽̾n̿ګ̀\x00	\x00\n\x00\x00\x00\r	ĸ\n͍oPʌ+,	˂LzǼ8͌Uΐ\npzǻ8\rY#\rzǼ8͌U\r\rΐ\np\r\rʌЧ\rʌ҇	વ	÷ʌ+,́Ŧ́\x00	7zǼ?͋UՀzǻYP		ʌ+	,́	ҿ͂˄?©o̓\x00	ʌࡂ	1ǻʌūʌb\x00ʌ\nʌ	Ȉ̈́\x00\x00	\n\n1ǻʌūʌb\x00ʌ\nʌ\n\n\n©\n=	\x00̿ʌ\nͅ\x00\x00	\x00\n\x00\x00\r\x00\x00\x00\x00ʌߴ̎=ࢆ\r̒}̎!ʌܐ\r=!ʉຑ\r=ƪ\r=!ʉŘ\r=!ʉमʌŏ̎i̓\rͅ\x00\x00	\x00\nˋ̎!ʏ޽\r=!ʉ͋\r=ƪ\r=!ʉɲʌŏ̎i̓\rͅ\x00\x00	\x00\n˫̶ໂʌ̎\n̓ఊ̿ʌX̲M̎=!ʉϖ̿ʌ÷̿ʌ+,̿=!̄=!̃	ࡣ̿ʌX̳M̎=!ʉϖ̿ʌ÷̿ʌ+,̿=!̄=!̃	৕̓\rʌʌoʌX̱\n̗ʉĊʌʌ୾̓\rʌʎġ̎=!Ũ¿̓\rʌʌȐ̦ஊ̧௠̓}̎=ʉȉ̓\r̘ʌ୧ʌʚۥʌʒ¦ʌXͅ\x00̷ƌ̓\x00\n̎=ʉϓ̰Q̈́\x00\x00̆થʌŏ̎i̓\r̿ʌXͅ\x00̹ཟ̿ʌ÷̿ʌ+,̿=!̄=!̃	֜ʌŏ̎i̓\rͅ\x00̹ఫ̴೟ʌ̎i̓\rͅ\x00̽ڧɼ̎̎=³̶ଲĐσ̎=೵̓\r̓\x00\nʌʌÕͅ\x00̽{̗ţpʌʌȣ̈́\x00\x00̃ओʌ̎\n̓\r̎=ƪɼ̎ʌ̎\n̓\r̈́\x00\x00̄̎=!ʉȢ̓\r̓\x00\nʌʌÕͅ\x00̽{̗ţpʌʌȣ̈́\x00\x00̃෠̎\x00̓\r̓\x00\nʌ\n̎=ƪɼ̎ʌ̎-̖\r̓\r̈́\x00\x00̄ீG̸`̓\x00\nʌƑ	˂LzǼʍ຅͂͍Q̰\n̈́\x00\x00̅ۀG̸`ʌ̎\nࣱ̓G̸`̴Ƌ྄Đσ̎=ා̎]ֹG̸`ʌƑ	˂Lʌ̎\n̓ಷG̺`̎ʑ࢘ʌŏ̎ۑʌ̎\n̓\rͅ\x00̺٢G̺\n`ʌʔ͹̓\rͅ\x00̺ߑG̺`͈\r̀\x00\nʌఝ̓\r̎=ʉ̩̈́-ͅ\x00̽ƌ͉තG̻`̓\rʌʌ͛ͅ\x00̽ƌ̗ʉoʌʌ¦ͅ\x00̽໶ʌद̓\rͅ\x00̽ಆB̼`ʌƑ	Ǖʌ̎\n̓\rʌXͅ\x00̼ƌ̓\x00\n̈́\x00\x00̇Ƌక	̎=ʉϧʌʌÓ̓\rͅ\x00̽೮͆͊ʌ͍\n͍1ǽ͍͇͍͊ʍത͈͊ʌ͌\n͊ʌ͍\n͌1ǽ͌\n͍͌͉͍͊ʍԝ͌͊ʍڨ͊5͋1ǽ\r͌͋\x00͍͋\x00	ά?ͅ	\x00̽֎̑ܣ̝	ཱི͋\x00ª	\x00Á̾\x00Ç̿ѳʄ&̌\x00̍̌5̍༆i\x00gɵҰ̍ঢ়̌̍^ࣚ̌̍\"~ʅ̌\x00̍̎̎̌ಓa\x00Ä̏\x00r\x00	\x00¢\nɵ̏̯̌̍ڮ̍&\x00̏}ସ̌խ̍\x00\n̍$H	&ÿr}>உˌ۱\n\x00	̌\x00̎ǡ̍	̍̎	,	̏4~ō\x00̌\x00̍\x00̎\x00̏\x00̐\x00̑\x00̒\x00̓1ˆโ	\n̑з\x00̓̒¢\x00\n½	\x00	\x00̕\x00̖\x00\n	nۮ	©പٞ	©ฬ̒ʅ\x00\n̕̒Ä\x00̖̒r\x00\n̖\x00	³̌\x00	¨̎\x00	Â̍\x00	 ̒౦̒p	Æ̕\r	£̕\r	S̗4	̗&\x00\x00	\x00\n\x00nN̕\r̕\rE̖\r	̕\r\n1ʇ	ব	,\nԲ̗A	̕\r1ʇ	Ǆ	,̗AJ\n\x00ÊH~̔\x00(ਦҽོϘ้#҂ࢌ#@ۇ຦#@cجܫ#@cf࡞ࣗ#@cf[ճ৖#@cf[§அශ#@cf[§ʰ༢\n\x00̕\x00̖\x00	\x00\n\x00̗\x00\x00\x00\r\x00̘\x00\x00S\x00̕³\x00̖Â\x00	¨\x00\n \x00̗ʄ͚	ó,̙	Ԋ\r෈	˒ஷ\r\nխ\r׶̘1ʇN\n̘Ñ˓\x00̘Æ˓\x00̘£̑\x00\n\n5ث๗ີŽ̘\x00ھ̘JPѝó,̘̛E̓E\n̜yEǡ½Pó,̙Ŧ̙ŝ\nಡ̚ద̚\x00	\x00\n̴		ó	,\n̯	\n\nຕ	ૅ\nཅ	౾\nּ	໏ȇ̛̞\x00̟9&\x00\x00	\x00\n\x00\x007̞ː̗i\r̗i\rü̟@ǚ̟׼51ʇ̞N\nüٰ̟ǚ̟ૼԊ	̞JP\nѝ\n	ó\n,\n̛	\n|ડŽ\x00ڑ̞ࠛEུ̞E̓̞EQ̜̞y̞Eǡ\n[§̞8̗g\n̗g͸஻~̜\x00\x00	\x00\n̞\x00\x00̟\x00̠\x00\x00̡\x00\r\x00̢\x00̣\x00̤\x00̥\x00̦\x00̧\x00̨\x00̢E\x00̣\nc̤\nf̥\n#̦\n@̧̗i\r̨¼̞̞	̞S̢̞Wରࣸ࠴է̠̢)̞̟̑-ঽ̧̨\"̘̢)̞ˊ඘̧̨̧̨ү\x00̧̨\"̢̞ǳ̠̕̢)̞ē̢̞̠\x00̟̧̨୅ญ̧̨̧়̨\x00̧̨\"-ࣺ\r̢)̞̞$\r-෺̧̨\r̢)̞Ё̞$\r̠̢)̞̧̨\"̛Ê̠\n࡙଒̨Ȓ̨\x00\r̟̟̠̟̧̧Ȃࢨ̨Ȓ̨\x00\r̟̠V̧̧Ȃٗ̧̨̧̨Ɨ\x00̧̨\"̨Ȓ̨\x00\r̟̟̠̧̨\"̟̧̧Ȃழ̨ù̨\x00\r̟̟̠̟̧ǆஜ̧̨̧̨ԛ\x00̧̨\"-٫\r̢)̞̧Į̌J\r\x00̨\n̨¡\r\x00\ŗ̨\"̔̟̠̧̨ਝਂೈٱ̧̨\nຘ\nљ\x00̞	-஑̠̢)̞̧̨ħ8̞$̠ɼ̨ױఆ\nٻ̞	̧̨\r̟̠-ذද̧̨̟̧̨Ƙ̟*૵̢̞Ή̠̏̢)̞ē̢̞̠\x00̧̨̧̨\"̠ཋ̧̨\r̟̠ར̡̢)̞̠̢)̞̟̤̡ऴཁʤ̧̨̧̨\"-਻̨Ȓ̨\x00\ŗ̨\"̟̠V̧̧Ȃක̠̢)̞̟̣̨ù̨\x00\r̟̠V̧ǆण̟̠զ੝̡̢)̞̧̨\"̤̡U̢)̞Ӭݕ̧̨\"̥̢)̞ে̝\x00̢)̞̢)̞\r̢)̞̢)̞̞Շ̣\x00\n\n\nԬ̞	̞$\r-ऽುભ̧̨\"̢)̞ſଡ଼̧̨ࢾԑ̠̢)̞̟̥̧̨̧̨ĕ\x00̧̨\"-๲Ӫ̠̢)̞̟̘-ࣞ̧̨̟̧̨Ƙ̟̏̢)̞җ-Ԗ̢̞ǳ̠̏̢)̞ē̢̞̠\x00̟̧̨Ŗ̧̨̟̧̨̧̨\"̟౜๰̧̨̧̨ \x00̧̨\"-क़̧̨̧̨ҳ\x00̧̨\"-๩̢̞Б̠̢)̞̖̠̢̞\x00̧̨\"̡̢)̞̧̨\"̦̡U̢)̞Ӭ߷̧̨ନࠌ̧̨\"̑̢)̞ˊ૩̧̨̧̨ˎ\x00̧̨\"̧̨̧̨ʥ\x00̧̨\"-હ๷̨ù̨\x00\ŗ̨\"̟̠V̧ǆໜ̢̞Б̠̢)̞̕̠̢̞\x00̧̨\"-ഀ̠̢)̞̧̨8̞$̠ɼ̨څ̧̨̧̨෯\x00̧̨\"-ׅട̧̨\r̟̠ͧ-ߡ\r̢)̞̞¡\r-ഃ̠̧̨̟̧̨̧̨\"̣̢)̞ˊඒ໷\r̟̟̠̟Յ̨߱ù̨\x00\r̟̟̠̧̨\"̟̧ǆੜ\r̟̟̠̧̨\"̟ཚ̧̨̧̨ࠫ-௄̨ǝ̨\x00\r̟̟̠̟̧̧w̧ɝڥ\ŗ̨\"̟̠ಹ೫̧̨௕̧̨̟̧̨Ƙ̟̕̢)̞җÂఎࡍຏ̧̨\"̟̠զڞ̧̨\r̟̠ǫ-ऋ઴̟̠௳̧̨̠̢)̞̟̐̠\r̟\r!˂	\r̢)̞ྚ̞\x00̞$\rÂ໛ர̢̞Ή̠̕̢)̞ē̢̞̠\x00̧̨̧̨\"̠ڎ̧̨̧̨Ђ\x00̧̨\"-ੱ̨Ȁ̨\x00\r̟̟̠̧̨\"̟̧̧w̧ḉն\r̟̠છ਺ܔ\r̢)̞̧̨̞ਸ̡̟̠̡\x00̜\x00̞\x00̞\r\x00\nM\n؏̞	״̞$\r୑ຈ̧̨̧̨Մ\x00̧̨\"-ୀ̧̨౫̧̨̧̨઎\x00̧̨\"ฃತ̟̠ٟ൚̧̨̟݁̠˾ഢ̧̨̧̨घ\x00̧̨\"ෲ࣒هݾ̧̨̧̨ԟ\x00̧̨\"-ಔ̨Ȁ̨\x00\r̟̠V̧̧w̧ḉԞݻ̧̨̧̨ĕ̨ؐ\x00̟̧\x00̠̨Âोӧ̠̢)̞̟̧̨׷൩̧̨̧̨\"-ݦ̧̨̧̨༹\x00̧̨\"-ز̟̠˾ܠ༭\r̢)̞̨¡\r\x00̧Į̌\x00̨\r\n\r̟̠ࠒ̟\x00༣̠̢)̞̧̨ħ	̞$̠ಲؙ̨ǝ̨\x00\r̟̟̠̧̨\"̟̧̧w̧ɝ̢)̞˾̨ٔȀ̨\x00\ŗ̨\"̟̠V̧̧w̧ḉࣧـ̧̨ࠑׂ̧̨̧̨ਉ\x00̧̨\"̨Ӯ̨\x00\ŗ̨\"̟̠V̧̧w̧ḉˇ̧ࠦྒ೘उ̧̨̧̨బ\x00̧̨\"-ૠ̨Ӯ̨\x00\r̟̠V̧̧w̧ḉˇ̧ੵ׸̠̢)̞̧̨\"̠Ŗ̧̨̧̨Ҵ\x00̧̨\"-ॵ෴\r̢)̞̧Į̌J\r\x00̨\n̨¡\r\x00\r̔̟̠ཱ̧̨\r̟̠໙-̡࢜̢)̞̠̢)̞̟̦̡Ŗ̠̢)̞̠ాࢀ̧̨\r̟̠\x00̧̨\"-ඎ̨Ȁ̨\x00\r̟̟̠̟̧̧w̧ḉԞࡋ̨ǝ̨\x00\r̟̠V̧̧w̧ໍ̧̨̧̨Ń\x00̧̨\"-࠮̠̢)̞̧̨̠༯̧̨ഒ̟̠ſৢ̧̨\r̟̠ଐ̨ǝ̨\x00\ŗ̨\"̟̠V̧̧w̧ɝஶ̧̨̧̨џ\x00̧̨\"-໴̧̨̧̨࠘̠̢)̞̧̨̧̨\"̠͔̗g̧½&̢)̞৥է̠̢)̞̟̑-ൡ̢̞ǳ̠̕̢)̞ē̢̞̠\x00̟̧̨ඁ̡̢)̞̠̢)̞̟̤̡Ŗ̠̢)̞̟̣-ཊԑ̠̢)̞̟̥-Ӫ̠̢)̞̟̘-Ԗ̢̞ǳ̠̏̢)̞ē̢̞̠\x00̟̧̨Ŗ̠̧̨̟̧̨൅̨\x00̟̧\x00̠̨-ӧ̠̢)̞̟̧̨Ŗ̡̢)̞̠̢)̞̟̦̡ҿ̝\x00\x00	\x00\n\x00\x00\x00\r\x00\x00\n¡	\x00	¡ɥ̜\x00\x00$\x00¶\r\x00̜\x00\x00	\x00జ§[഻$	\x00̜\x00\x00\n\x00\nฮԭ\x00љ೶ŎӋvÇxÇ/ʉץʉ๝ʉථʉݲʉۂʉ૏ʉຯʉۯʉฤ	\x00	ōʌïƴ˶ʌ+ʹtʌƍ	ÿtÇq$ʌ՜	ʌưʉ΀Ƒ	ʌ͓ʉࣲ&\x00\x00	\x00\n\x00\x00\x00\r	ÿt\x00\nÿ\x00ʌ\\	ʌʉ਴	ʌƝʉӏʉ%ʉǟ,	ʌச	џʉ΀Ƒ	ʌ͓ʉർ	Ƒ	\n	ʌˏʌࡑqKʉࢫʉޠ	ʌൈqKʉې	\n\nʌX1ʇKʉ೚Ÿ\r\né\rRʉ¬ʉT\rRʉ¢ʉT\rRʉʉT\"\r%ʉ̹	\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00ʌȠÿ\x00ʌɢ\n#@c\rfͲCʉل,GʉѫJʉҙJʉনJʉູJʉ༌ǙༀRʉݑ/\nmʉಽ\nRʉͳCʉਊ/%ྍ%\r-Cʉൊ\rCʉ҇/%կ%\rկ%\r-Cʉ੻\rL	/ݼˏVʉܘ\r\x00\r\x00/mʉಕRʉ«\n\x00\n	ڽ̕\nǭඈƭǭొǲǭڛЩ\rǭ౓ຄఢŏ̌̍\x00̎\x00̏\x00̐\x00̑\x00̒\x00̓\x00৙̍̌ʌผ̎̌ʌ̤̏̌ʌ֕̐̌ʗĩ̑̌ʏɗ̒̌ʍ૲̌ʘ୪̌ʕן̌ʗ౪_̓ૣʉڕ̌ʌ೹̌ɋ̜ʏɄ̎\n ˂	̌ʌǷ๥	_Ɔ̌\x00ʕĢ|˨\n\nċ²̓Ç཰\nʌʍΖ\x00\nʌʌ੗\r̔̟\x00̠\x00̡\x00̢\x00̣\x00̤\x00\x00	\x00\n\x00\x00̤໹̢̢έ̢ƀ̤¯̕̟\x00̠\n̤¹̖̟\x00̠\n̤¾̗̟\x00̠\n̤§̘̟\x00̠\n̤°̙̟\x00̠\n̚ʌ̤\x00̟\x00̠͸̠ ˂๧D̒D̤˂̤༁̢࡝̤²ʚ౨ʸ\r\x00ʉ༻̤\x00	5\n̤Ӷ?Ը৆ԛ˂		Ң	਎˂ϗ	ߪ	?	ү\n8\n	޶ ˂Ḍ˂̣ߝ̤ʌŒ̟\x00ཐ̡ʌȓ̡\x00Ϧ\r̔ʌ̤\x00̟\x00̠\x00̡\x00̢\x00̣̕\x00̊ ˂?̎̛̎\x00\x00Ǟ̜\x00̎¶	Ð̖\x00(̑ͨ ˂?̑ʎɕ\x00Ǟ̑ʏˏ¶	Ð̗\x00	7̐ѹ	̝} ˂?̐	U̋̐	Uט\nÐ̘\x00(̏ͨ ˂?̏ʎɕ\x00Ǟ̏ʏˏ¶	Ð̙\x00	Äʡ༒	̞ʍ§ʌإ	ʐ೔	ʌƻʑໃʒཧ ˂ː	ʌ<\x00\n	ʒؒࡌ	ʎηF	ʌ:׫\nÐ̚̟\x00̠̡\x00\x00̡ٿ̒8³̒ʌƔʌʷ\nʌŅ\n\x00ʑҞ\x00̠ ˂	ʎƵʎƵ\rஒ	˔\n˔\x00	ʌƲʍѽ	ʙ๜ʌਤʌॸ\x00	\x00\n\x00ʌƲʍѽʏҧʏǴʌٺ	ʐӕʌ੹ʕׁ\n	ʐңʌǔ\nʖ஖̟੽̠ܜʎ୊\r\x00	\x00\n\x00̢ʌƲʍࣴʏҧʏǴʌི̡˂ʫ	ʐӕʌഏ\n	ʐңʌǔ̢\nʍė̟\n̢ʎƵ\nʎಀ̢ʍ঳˂	̡˂̡̢ʍɇʖી̛\x00\x00	\n\x00\x00\x00\r	̌ʏÞ	Mʡlʌ\x00ʌıʌ૑ʉȍʡlʌ\x00ʌౕ\nʡlʌ\x00ʌıʌ±\nʉƁ\nʡlʌ\x00ʌಪʡlʌ\x00ʌϮ\nݷ\rʷʌy\n\n ʉƁ\rʷʌ\x00ͪ\n௼ʌıʌ¨	\rʌıʌ¨	H࢝ʌıʌ¨	̜\x00	\x00\n\x00\x00Ȅ ʌΔ	ʌ§ʡČʌ\x00˒ʑರ\n\nʌ+\nS\nїʡÃʌ߻ʡʌǹʌ౏ʡlʌ\x00	श̌ʘ൏ʡʌ\x00	ʌXʌڣ̝ʡÊʌ̌ʌũʎА˒ʙօ̞\x00\x00	\n ˂̍ʍȑ\n̍ʍȑ-\n̍ʌā\n\nʌƻʎɜʌǨ\nʌƻʚӿʑƠ	\nʌຖQ		̍ʌȯʌű\nǻ\n̎̛̎\x00ʏɄ̌ʌނ̌ʌǷ̎\x00\x00	\x00\n̔ʌՈ\x00˂\x00\x00˂\x00	\x00\n\r\x00̔ʌՈ\x00\x00˂ŐСYʌࡳőСŒ֋ċnUऀǾʐࠤ๶ʎॶnU޼ÿU఑o๿{৶nU໣o|ৌU൐-0œ&\x00P՟pͬ|ֶ࢔{÷՟UͬnUؘ޷ʌ+ʹń˓ļʭʌ҅řˍ2ʡ­ř˒DˇDʣʶ3ř˗NʳʢÖˆ௧řʡ˰ʡ̾ř/ʽOˁ2ʣͮʿřʢ2ʦʡ͑ʌ­ʡܞʉð̋৻ʉ\\ʉ\\ʉ\\ʉ\\ʉ೦ʉ੅ʉڐʉ[ʉ[ʉ[ʉ[ʉ[ʉ[ʉ[ʉ[ʉ[ʉ߃ʉ#ʉ#ʉ#ʉ#ʉ#ʉ#ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉඟʉΜʉ#ʉ#ʉ#ʉ#ʉ#ʉ#ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉ.ʉڄ	˥ʡČʌʔਗʡ୽	ǻʌʌȲŐʡ˭ŝʍŝʹː˙˓ʌ౑˚˓ʒো˛ˇʓʙ˾Ìʡ౿ř¸ʼOʣʡՏʡɚřˁ2ʡЪʡɏˇʏ˵řˁNːřʾ˄ř஬ː˒2ʡ௓ʡȻʯʌčřEʾ»ˁŔÆʡɚ˄ʌįʡ˭ˇʌԻ̃³̄ʉZ̅ʉ.̆ʉ\\̇ʉÔŔʮˀʮřʮˊʡʵŝʍƄř	Řຫ˼Ì͍ʡ*˒\x00˓\x00ʗ\x00ʎ\x00ʙ\x00ʘ\x00˂\x00ĭ\x00ʔ\x00ʏ\x00ʉ\x00ʍ\x00ʐ\x00ʌ\x00ʖ\x00ʵ\x00ʓ\x00ǟ\x00Ɔ\x00ǎ\x00˕\x00Ǧ\x00ʒ\x00ǧ\x00ʚ\x00ʺ\x00ʑ\x00Ǚ\x00ǐ\x00Ŭ\x00ƅ\x00ʕ\x00˙\x00ġ\x00ƶ\x00Ĭ\x00ʶ\x00ʸ\x00˚\x00ŕ\x00ʻ\x00ˌ\x00\x00ƀ\x00ƛ\x00â\x00ˆ\x00ˏ\x00Ų\x00Ƭ\x00ʇ\x00ô\x00\\\x00ǝ\x00ª\x00Ģ\x00˖\x00Ǥ\x00¬\x00Ǘ\x00ĵ\x00Ĥ\x00ģ\x00Ĩ\x00ë\x00Ǭ\x00ǣ\x00˜\x00Ġ\x00Ǒ\x00\x00Ê\x00ǯ\x00U\x00Ǯ\x00ˑ\x00_\x00+\x00Ǎ\x00ʼ\x00°\x00ĩ\x00Ƨ\x00Ʒ\x00Ą\x00Ǣ\x00ǒ\x00Ǖ\x00\x00ǡ\x00\x00ƞ\x00a\x00į\x001\x00Ə\x00;\x00ƹ\x00Ã\x00ǆ\x00Ƌ\x00ƻ\x00ĥ\x00ī\x00v\x00\x00ç\x00o\x00ĸ\x00ï\x00Ǉ\x00ƭ\x00i\x00J\x00ŀ\x00Ě\x00Ë\x00p\x00ž\x00ĝ\x00c\x00Ƃ\x00ǲ\x00\x00Ƹ\x00ǚ\x00Ď\x00ǈ\x00O\x00¸\x003\x00I\x00H\x00©\x00\x00$\x00ÿ\x00µ\x00þ\x00\x00Q\x00Ý\x00Ē\x00¿\x00Ũ\x00Ů\x00l\x00ù\x00ŷ\x00g\x00Ź\x00f\x00F\x00é\x00ü\x00È\x00Ū\x00\x00\x00\x00Ƴ\x00ư\x00Ī\x00\x00ļ\x00Ķ\x00Ł\x00Ĵ\x00Į\x00ķ\x00Ǐ\x00ĳ\x00ħ\x00ƒ\x00\x00ł\x00ǩ\x00Ń\x00ń\x00ľ\x00Ĺ\x00ƨ\x00Ò\x00Ļ\x00Ǌ\x00ĺ\x00ƪ\x00ǌ\x00Ħ\x00Ŀ\x00ƈ\x00Ǩ\x00º\x00¦\x00ē\x00s\x00¥\x00\x00¹\x00\x00¨\x00Ę\x00Ė\x00÷\x00	\x00í\x00Ǡ\x00õ\x00>\x00Z\x00ą\x00\x00\x00[\x00\x00j\x00»\x00č\x00.\x00¡\x00d\x00đ\x00y\x00ó\x00ę\x00¯\x00(\x006\x00ò\x00ć\x00E\x00\x00#\x00\n\x00x\x00£\x00¶\x00\x009\x00=\x00:\x00|\x00·\x00\x00´\x00\x00à\x004\x00\x00Ĝ\x00ū\x00²\x00ź\x00t\x00Ó\x00S\x00-\x00L\x00Û\x00 \x00\x00m\x00{\x00\x00u\x00K\x00ã\x000\x00­\x00¾\x00Č\x00P\x00ĉ\x00&\x00@\x00Ú\x00!\x00\x00G\x00ċ\x00M\x00Y\x00Ñ\x00Õ\x00ă\x00«\x00î\x00w\x00ų\x00Ì\x00ĕ\x00Í\x00'\x00Ā\x00b\x008\x005\x00%\x00\x00\x00¢\x00Æ\x00\x00\x00å\x00\x00\x00Ÿ\x002\x00¼\x00Ç\x00ý\x00½\x00Ä\x00\x00ö\x00\x00ú\x00ė\x00e\x00h\x00,\x00³\x00R\x00Ċ\x00ā\x00Â\x00ß\x00ì\x00À\x00û\x00k\x00*\x00Ô\x00×\x00\x00?\x00\x00\x00É\x00ť\x00\x00á\x00\x00\x00]\x00\x00¤\x00ţ\x00§\x00Å\x00Ă\x007\x00®\x00\x00ð\x00\x00Ï\x00\x00<\x00ŧ\x00\r\x00/\x00\x00~\x00Ž\x00\x00^\x00V\x00`\x00X\x00}\x00±\x00ď\x00r\x00ğ\x00Ƒ\x00˅\x00Ü\x00Ɠ\x00ê\x00T\x00D\x00Ĕ\x00\x00Ð\x00Ľ\x00ä\x00ñ\x00 \x00Ğ\x00\"\x00Ć\x00Đ\x00ě\x00z\x00\x00)\x00Þ\x00Î\x00W\x00q\x00\x00B\x00A\x00\x00C\x00ů\x00\x00n\x00Ø\x00N\x00\x00\x00Ù\x00Á\x00\x00æ\x00Ĉ\x00\x00èřEʦDʿʡ༉ʡȶʹʌ­řʭǊ˒ˉ˄3Ř̰˲˂ʆಱʇઊř˕ʡ୒ʩNˍ3ř/ʣ»ʾ˔Æʡŧ	ˎ˓ʌɇʌΟʡൖʡ٪ˀÖ˓ݖ	˹˕ʌʌõ˓ŋʡɏʰ˓Ōř˃OʡϋŔ2ʹ3ʡୄʡٌřʡඋ˒{̈ʑƃʗľʓƐʕȹʗƐʓZʗúʒȹʒƞʑcʕúʒúʐúʚ@ʘçʓ§ʖ\\ʕ˞ʕυʐդʕ.ʙ˞ʑդʔǠʐƐʕ଻ʐвʑʰʕľʗநʚcʔцʔૌʔɢʗ໓ʔҫʕǪʓ[ʘƠʕҶʖãʕŐʔ.ʖʢʕцʒѻʔǃʔƠʗǌʗTʚҀʙǃʚ[ʔܿʒĶʑTʓƮʑʻʓǨʑඅřʱˁˈඕř/ʨǊʡސʡयˌʫ˓ʏԻ	ʡ۔ʉǜʉѻʉँřʡրʤʡ˭ʡȺʡ΃ʌȌřˌʣ\r˟5ˠ5ˡ5ˢ5ˣ5ˤÖř	Řīř	ŘഞʡƟʯʡɌˇʍ̙ʡʵˇʍбʯ஗˓ŉʿ˓ʍӜŘƏʦڱ͸ॲŕ௎ř	Ř࠽˺̫řʶ˕˓\rɓʷˁř	ŘഹǋʌࠂŎAřˆǊʡԺŔʡࡨʶ˓ʍίŠȬřʹʸĲAʡևˏʍদʡ͑ʵʌࠚř	ŘƉİAřʡߵ˃ʡѢ˗3ʺ૱ʡ͊˓ʐȁ˔ʡâř/ʡϋ˖2ʶÆ˅ʮॏʤനřʡٛʣOʸNʡ௶řʫNʡȻ˄өřʡೃʦ˗2˒3ʡʵʌčřEʻDʡұʽÆʡčʽˏʌ੡ʡࢁʢʡпʌĵ%̊ʉଷʉଟʉҫʉൔʉ๔ʉ฀ʉߋʉफ़ʉཝʉཀྵʉ౼ʉ஌ʉ਱ʉ෸ʉॎʉಝʉలʡƟŝʍʮ˅ˇ˒˓ʙමŔˆʡ̓˓ʎΣ˘˓ʘІŔˇʌ౻ʡྨ˂řˊ»ˇăʼʡіřˁʽ˔ʌđřŕʮʡৰʉƬ͸ୟ˃ˏʍΣřʾʮř¸ʿOʦʬěʼʡɌːŏ˓3ː௴˱Ìřʡĵ˓ňř	Řྒྷʡ೧ˇʌʙʫŝʍΚ˽Ì˕ŝʍʮřʡհ˅ř	ŘŨřʼ˃řʡெʡʳˇʌྎ˓Ŋřʡҩˎʡڏˇʍ༘řʦ2ʡʠʰລʡɍˇʌЖřʡ์ʣʵ˓ʌळ	ʡѼ˚˚ʍ໖ŞȬˋ˓ʑ௣ʰˌ	ǽʌ՗|ŒʈʆݮˉˇʌǱřˉʡˬřʣʵµʸˑ3˝ʻř¸ʡݿʳʹÆʡ֘ʹˏʎಌʵŝʍӡ˿Ì	ǽʌ՗œ˻Ìřˏ˅ř/ʸOʵʡ໑ː˕๺ʡ๴ˏʌూʡɍŝʍář	Řǘ˓ǳʨ˄͸ອʨൌř˕ʳʷŝʍ˹ř˅ʦ˓Ňʡถ͸ُ͸൜ʷˇʌ˵ʡпˇʌ૙šȬˊŝʍ²řʿ2˒ʮŝʍƸʮʌđřˀʡಉř	Řঃ	ʡ΃ʇʌʌРˍʌǟřˀµˎ»ʽN˒3G̉༫ʉ௲ʉྕʉׯʉ࣎ʉऄʉ੫ʉݥʉ܊ʉ࣍ʉංʉ૒ʉ౹ʉਫʉ౟ʉྦʉཿʉ஠ʉިʉๅʉవʉ༾Ūஙʉࠝʉଛʉصʉ૽ʉਕʉནʉ໔ʉีʉߩʉڶʉࡵʉොřʡ৒ʡƯ͸Ğʸ˓ʍ˵ř/ʬµʤ˃ěʺřː˕ˋʩ3ʡϞˏʏҟřˌʡâř	Ř൵ʡ૫ʡաʌǟřʻʽřˏʡ̾˓ņİř/ʸʺʡՏʡɿˀ˃ʻ૸˯ʄ˜˓ʌЏŔ˓˃ʌĳʼˏʍνˍ֩Ř͎řʡ฿ʶ͸ઠ	ʡաˆʌʌõʡ২ˇʌసřʡറˑăˊ2ʰ3˧Öř¸ʺOʸʤÆʼř/ʡܻʻʵÆʡӚřŔʡ֔˄ʌŜ˳Öʽŝʍʅř	Řٽˆʌčʡ଀˓ʎбŖʉёʉ಑ʉഖʉЖ	˷ÖsʌÞʌʯˀʤˏ໺˖ಖʡ്ˏʕˑř/ʮµŔ2ʤěʡɳ͸࢑řʡࢵˁřˍDʡ޺˄ʡޯřʡ෋ʡఀʡاˉ3ř˒ʡȗˌपřʿµʡ௚ʡ߭ʣ3ʶʌįʡܹʵʌɤ˅˓ʓɡřʡනˉˮÌřŘӭʣ˓ʙѩ	˶øsʌÞʌʯʡΦˇʕ๙Řоř¸ʡ໳˗ʺÆˉˇˌʌՔřEʦ»ʡज़ʡ࣌ʡʠřʡहˁăʡః˖3˖ʌʭˑ˓ʌΟřʡɁʡɚʱʌŜřʡ఺˒˴£ʡڍř/˔DʺNʡה˃˰Ìřˉˆřʮʡɿř/ʼʳNʡฎʡƯ	˸˶ʌėʌऒřʿDʢOʸʦ3řʺNʡӚ	ǼʌʌȲőřʪN˒řʡ౞˄Ǌːʡіř	ŘൃřʡचʧşȬřʡ־ˎ	ˁʇʌʌɧʡƟʌįřˉʶřEʾDʡұʯʣ˕ŝʍŝřʣ2ʡâřʪʡȺʡÖřE˒»ʰʳÆʡ྇	ʾʺʌʌõˇʌĳřʡߦʸµʡ໡ʤ3řEʡԺʡ෻ʤÆʩř˃Ŕ˄ʡčř	ŘʣʰŝʍƸ˓ʡÎ\rōྫʊ\x00ʉ\x00ʋ\x00ʴ७ʡʡೂ	ʡ՝˕ʌʌõřʬDˆ»ʸ˄3ʡƟʵʍЏˊٜıA˓\x00Ņ0/12͸ͽ34ʹ͵Ͷͷ #$%&'()*+,-.ͣͤͥͦͧͨͩͪͫͬͭͮͯ͢͠͡ͰͱͲͳL\nǩ	Ȣ\nȣƼT\rUʐʕ͑ɝ͒ěēőœŕɈɉˉ͓ɩ͔ɭ͕ɰ͖ɷ͗£͘§͙«͚@͛͜͝çŽƗǷ˚˜ ˞˖ϟščpsŜʁě>ʁïµɇʕǔ]·ɱĐÈɓʼŉ7ƨĽǖĭʂã	\x00ĴÙʁ#ʁ)ʁĀ¨îöˌ˕ǌôŊƼɵêĻȜɯȡʗȵhǟĮʺ1ƿĮǻ»˃ǧʁ¤ƱʁƉĮȎÎʁʆlÀÁƣƮʆʠʁǱǡʁǯ+ţħũɀűyȕĮɃƵȉ*ˁ1ȈƮdɈÿȯǢʁǆĤʁȠ(IʁŋʁÇʋ\\śɣUĮőđƔɼ½ģâĮĶɧƮƂȒŰɳ˅-ˉ¾ħɊǇùʈʁȳŞɊȘʁŖɹƃɤɈȻƛʃ%ʚʠǩŅňĮvąʍÊȥŏˏuƮďʁƒĮʁȔʁĩɥɑ.ʁɴʁȿʁƄĮʁĕçǸĮʪŹŨʪŐĮƧÖʁɞɡÉʦǭûōǲ÷e5ɸāȢqˍ&ɊȬăæ±ȩĿƎǮ±ťȞ$ÖʁƝƮɢʠŁȼĊȽȧƮʣȌ\nĮMƝŕʐȴ{Ŭ§ɊʩŹBȋǾȶɊÏBȋʁʫȪ0Ɠʁ_ĮʬʁƑʁ}ʁċʁǄʁȲʁĨʒľTóęʁʭƖƲȓĪǣʞXɉłĮQˇĮHơŻƏíɊnʠªʁǕǳːWʲĮǫ[ƮǛǍźǴʘǡʁʖʰʁƞȄŇåɊǠʠɾȀˊÓǐ,ʁ2ʁʁĺʁʁʜɰŠƯʁʁ¬ʁǿȅ˒Ĉŧʁʁ­ȨȫÐǬüĹ˔Ę|ʮɖİʁRĮɋ\"ĮŢŒŗ˄ʁŒ8ʄǀƮƳʠƇ¯ÕƮʁʠ¹ʁmʁ˓Cƶ˄ʁĞzĮǈŚǨǃ@Į×˄ɺĮǜKĮɍʁɚ˄ʁúÛɦÔəýʁſȆȹĢŪɭǦɮ<ǞZʨðȚ¶ȇ°į¡ɆǋćƪƴÅƆ/ūƟŶÆĳ£oƻɜƅʁ˂ğȏ¸Ⱥʁʁ:ʁʁǥØʁ^ŲʥʁʁĜfĮòʁȱʙĮ˄ɘʙĮ˄ʶŴĮƷĬʁųǗƈƔʓʑøĮʁÝŎÜɊɈǊ¹ʿʟõĮʁġƮɒʠʽĮɗ˄ʁäʴĮ˄ʁFɟĮŤʸÒéʁȊǏƮˋD´ȡÞɊȰS9ǾǼɊưĮɪǽĮǰʁOɊʯż ǺʁȟÂǂƸxʱȑiƹƮşʠŦˈ`ņwɿƮʏʁ¿ʢƠƥÂÂƸ~ȗŝ³ʵÂŭʁàʊĎEĒʁʡǤƋǹȁƗLĸǎjʁáȖ¢ǾrƮĉʠìʎËɳʁʆŷ[Ɋȝɝı¦!ǉƮʳǾȾƮÖʠ¥ʺÍƮļ!ÖʁbȃŸĵœɫʝƮʠʤɳʁÃƾʲƮŽæǅĮș\rɄɳètĔŘ²ʲʌƫJůŮȦĦgƦʁƢɲȣÚʛǁĮȸˆĂƮǷɽʁɩGʁɐˑĝǒČĮʁƮʠñ3ʀʇ®Ñƕ¼ʉƘY'ʁŌɅʻʜƮƽƩĦAʁƀʁʁʔħĮ;˄ʁŔńƍ©ɬĮĆʁȤʁʹĮɎțƮƜʠßʁɌĮƺʁȼʷžķˎɛëÄŃPĖ6=c4ƙɨīŵʧ?ɂŀǵǙēÌɻʁƭǪʅkVǚƚ«NʾĄĚɼƤ½ âĮĶɧƮƂȒȂʺĲ1ʝƮȷʁȂʁȐɷɁƁřʁȭǓaǶĠʁɕɔɤǘƌʁȼzĮʁǑɊƐÖȮˀǴºļȍʀɏĮǾƬɶƮǝɠėƮĥƊþʁŽ0ʹʌĘ͠\x00Ƈʵ\x00ʍઞ͞&\x00\x00	\x00\n\x00͡ʹʌa͠ؠCʉ࡬Հ!ʉ೪͡ʹʌa͠୞ʉ॑!ʉກ͡ʹʌa͠Ŀ	͡ʹʌâ͠	KʉĨʉ൘!ʉֳ͡ʹʌa͠Ŀ	͡ʹʌa͠Ŀ\n͡ʹʌâ͠	KʉĨ\nKʉƳʉĨʉິ!ʉ༅͡ʹʌa͠Ŀ	͡ʹʌa͠Ŀ\n͡ʹʌa͠Ŀ͡ʹʌâ͠	KʉĨ\nKʉƳʉĨKʉƳʉƳʉĨʉઓ͟ʹʌ˴͠\x00\n͠$H!&\x00\x00	\x00\n\x00\x00\x00\r͞\r\r1ʇǄ,ŋʉ޻͍͞୓ʉ.	%ʉֈ\n͞\r	ฝ\rͣ\nſ	ʉ૷͟\n\nͣʌ\n\r-	Ӱ\r͢\nſ	ʉ·\rʲ\nſ	ʉȨ\r˵ʌ̇\nʌ୔	ʉï\rͶ\n೏\r\"ɝ\x00ʌՑ͸ʊ͗˖ʞ#ǟ˻ʓືȕ6ʡവ#\r,ʡ۩&\x00(\x00):%ʡ֌%6#ʌȁ6˧ʹh\r6#6 ˂	#6͵6ǭǱ$\n#ʌঅʝ#Ȼ\r1$Ɠʍশ$ƓʌచʌǬ˽ʘણɃ͠ʌ<ʌËǮ'6Å'Pͷƀsʌǿʌďͷ1	0ࠏ͠ʡใʌŝ˽ʔƎȲ	ʵʌȯʌű͠	͸Ȟʹ\x00Ͷ\x00ͷä	ʡ࣡ʌx#ϲ͵ƍ1	0஘0ܧ'1/͠ʌചʓշ͠ʌ࣓'Pʡڬʡƥʉ಄Ǯ'RǗǮƂู'%ʡְ1	0ִ\rʹʡʌʹǹʹʌ۷Ğ#͵Ýʢ*ʹʡrʹʹƭʹ˽ʗʚɅ1ˁ ʇʌʌɧ3ê%#%Cʹ%S&/ʡԦʼƶʉஏ$Å#ͽϷ%ͽϷ&'˳%h˳%˳&h˳&']	%=#=1ʹ!ʌѶ˝͸1	0ఽ\r͠ʌ<ʍç͸Ĝʹ\x00ʍ੒'?&˼ʘੈȩ#ʡr#6˝	͠ʌƻʎɜʌʱ1	0ܺ1	0஧1EʿʯNˇěʡ­ʸĠʢ*͜1	0ਫ਼1	0Ũʹ)®;ʉǇOà>L/	\x00!\n\x002Ï1ʡ੣ʿ˽ʙປȺ˽ʒ࢐ɀ˽ʑʕɎʖ#ʭ1¸ˑʡɦ˒ʡ­$ǩ'ʹ)®;ʉľOà>L/\x00!\x002Ï#Ʊ#ʢ*˽ʖǖȷê##ʉó#Sʉ#պʉ#͔˻ʏəș1&C#ê%#$%Ą#Sʹ#ǫ͵%ǎ	#ʌƔʎTʹuഫ&&ʉÔ&,#$˥ˏ$Vˏ%ق˥ʌૺ˰#ඊ0Ӕʡ௙ʡȧ#ʉ.$ʵʌāʍ±%$ʍˈʍ௬1	0ڵ0ئʹʌ¾#1	0ส\r1˓ʓไ˂ʌ૳˓ʡI«ʲëͶ$ʌǬ˼ʏəȢ	1ʹG˳ʌ+˽ʑӒɍ	%ʷʌ%Ġ1Ͷ'?ʡʲ%Ҙ,1ʵ2ʨ1#ग˼ʕ༸ȡ$ʡ#1	0ࠩ˼ʔਬȩʢ*͒	1Ɩʹ\x00ʌף\r#ʡlʌʹ\x00ʡӐʌîʎ#đ˓ƫ	1ƈʹ\x00ˀ1'˾ʎǶɠ\r#ʌ#$ʹʌ:#˽ʒǷȸʡൿ˽ʗжȿ1ʹ͵h#v[Ŷƶ)\x00+Ɯƶ)\x00,t)ʡʌ)\x00+ʌՊ)ƺ)\x00ʎҒ*)Ý)Ǌ)@(ຶʡǛʉֆ'ʌை'ʌε'ʌ%|-ڟʻ*Áƅ)t%&̕ʌ¨)༴%ೢ.ʡƊʉ࠷-୕%͵đʡIsʲŜ˼ʗǖȡ1# ʌ๼6Ɗʹä	$ʹʌ:ʌáʢ*͸໘$á1ˑ2ʢ	1ƶͷ\x00ʌՌ͸෨$Κ	1Ɩʹ\x00ʌѯ1ʡȭ%(jʉદʡƷ'%1ʸ2ʣ1	0ټ1#1¸ʯDʡѦˑěʿ1	0ࣔ\r6˓ʍ˒ʎཪˆsʍشʉࢡ'1ʇ$˼ʘ୛ȡ1ʡ̌Ɩʹ\x00ʎ୍Ɩʹ\x00ʎޭ1ʦʡڭʣʡ໒$ͽӽ˓ʌɇŬȕʌ঻$##$ˀ%_	$ʌ##ʌî	ʹƺʹ\x00ʌ̃0ช͢͸Ȋ$1˒Dʯ»ʨ2ʡʒ˩ʎ੔ʎʠ˩ʐԆʎຬ˩ʎ࡫ʌޝ%˩˂]1Eˎăʡଁˎʵ$ʌʹ²˽ʔǖɄ&!A1	0תʢ*1&͵ʌƨʉƣ͵ƀsʌǿʡş͵1	0ധ˿ʎǶɤ#ʌå	1ʡ¥ʡ´ʉÎ\rͶʡrͶy%\x00ʹʌŢ1	0ۢ0ଥʲ#ë	#$ʹʌ+1	0ਔ˽ʓӿȳ1	0ॣ'ʌε1%ʹʡʹ&ǨͶʢ*͔$?$ͷʢ*#༇ʹ$ʡČʌ#ങ$ʌാ$ɑʌĒʉೊ%_	ʹʌ<͵\x00ʎЊ1	0ୢ1ʡӯʡį\x00#˄ƚA	6ʡrͶƆʹʌŢ˼ʑ༏ȡध;ʉ#Oʉҥʉ\\>L2О\r͠͡͢ͣͤͥ˼ʎѐȤ	ʵʌȯʍŲ͠ʢ*	)ʡʲ'\x00(ä$Ǩ#ƪ'1%=ॱ#Öʢ*ʏ#ĳ1ʰʣͶ%ǴʹĠ$v˼ʗöȦ1	0΢#˓ʍǱ1ʣʡâ1	0ʣʹʹʍΡ)͸ò1ʹƀA˽ʗ਍ȶʢ*͚ʢ*1ʹʒ#҅Ɍʹ\x00͵1	0ஹ	͸Ħʹ\x00ʌæ%˻ʐʚȜ%Ǵʹ1Eʤʿ2ˑʨ#1˙ʎƄͭͮͯ˼ʎһȥ1Eʡٸʡംˍʡ˹$ʌʌ̃&$ʉ1/ʡƥʉŘʡ௢͠ʌ൳ʖ௥	ʹʌ<͵\x00Ͷ6&6͠ʠ#Ư͸ય1	0ໝ-1'ʹ$O͡ެ͸Ĝʹ\x00ʍಏʕಗ'D'=ӊ'= ʉǉ'= ʉ೿͡ʎߧʡǛʉཱྀ\r'ƛ$ौ$	˂ƥό1ʡߓ%	6˓ʌƔʹ\x00͵ʥʉƣ˻ʍǀȖ	1Ƌ&ʜ#Ȍ#ͽӽ˓Ŭȕʌܤ1#ʌƧ0ʧ1	0ֽ0ृ1	0ఛ$$ˏʌí#&ƍ˽ʑෆȵ$?ͷ\r1͵#ǲ͵\x00Ͷ#ʊŢʹʢ*͠ʹʍଂʹʐЮ͵ä	ʹʡeʌ$Լ$%	1ʹ˂ʹഡ#˽ʙॄȿ1ʡȭ&ˬ$ʌɡ1ʡ௱ʰµʡϪʢ3˽ʗӒȼͱЉ$%ʉ௹%%ʉࢸʉƄɑ͵1¸˒DʡϪʵʿ#३ʉZʉ.ʉ\\ʉľʉãʉʙ˽ʍöɂ\r1ʤʡໄʌ๑ʡ¥ʡ´ʉƄ	ͽ૗͠\x00ƀsʌઇ1/ːOˍʡ৯ʡȶ'(ʌȗ͸ࣂʢ*͗ͥ	$?ͷʌ೤	$ƺͶ\x00ʌʮ#Ǐʉࠗ1ʡȭ$$#੎͸༰ʡȧɏʹʑ#å1ʡѢʶʡݶ/A˻ʎһȜ1	0๋1˒2ˊ˽ʒǖɎ1ɐ͵ʹ)®;ʉ\\Oà>L/\x00!\x002Ï	˓ʌסʌɜʹ1	0॥ʉŢʹʹʐЮ͵ä#͸ò#Ǵʹʴʲ˾ʍŅȍ1˓ʏཫʢ*\n&Ǩͷʹʍͣ͵͸чʹ$ʹʌ+1#1˜͠ʹʌȁ,ʐ༲1	0ࡰ਌ʚ#Ŝ1	0īʢ*͓˿ʍŅɦ1Eʡயʡ॔ʣ2ˇ1#ʌӑʢ*ʟ#į1	0ു%jʉ୐1/ʰʿʵˎʡIʲđͲʹ)®;ʉæOà>L/\x002\rÏ1˅Oʡ͢ʤ2ʡଓ	%6#6ʘ#Î#1˜A	ͽ͠\x00*#*²˻ʍŅȋͶɨͶ1%܆˽ʗΞɍ1	0ۋ(1	0৑#ƺʹ#ʌ±$5%͸՛1%ëʕ#ŧ&6ʡıʎޢ˽ʒ༄ȱ˽ʚʕȽ\r͡ʡ=ʌ͸Ĝʹ\x00ʍɔ1Eʤʡ঎ʫěʡ­1$ʌƧ#਩͵ʡr͵u1ˊʡǮ1ʢʿOʯʡʒ1	0ॢ0஼ͶʌĘ͵	#ȟʹ\x00ʌࡀ˽ʗདȹ1EːăʡɆʶˍ1# ʉðʋŢ$ལ'ʌʡeʌ&ഉ1˱ʹh\r˓ʍӇʹV#\x00$\x00&1ː2ʡâ#ࣽ#͵	#͸੭͸೴ʹ31#Bʉ+)I˓ʍӇʹV#\x00$ʹ)®;ʉãOà>L/\x00!\x002ÏͶ$ʡÀʌ¨ǎʉ͵1	0׳ʢ*ʢ*͝1	0ݒ͸ਧ(&ʹ%h%ʼƶʉÔʹͶʡrͷy%\x00ʹʌŢ\r%/$$6Ɯ#ʌȁ˓Ƿ1˲!ʹ1$˻ʎǶȗʢ*1ɝʹ\x00͵YͶ1%0Զ1/ʦOʡϔʰͮ˅1ʮʡǮ$ʹJ#ͷƀsʌǿʡşͷ1	0ຢʢ*	ʹH®/Ï˽ʖʶɈ%jʉԈ1	0໥1EʡීͽĞʢ*͛͠ʌѣ1ˇNʡâ1ͶƷͶ\x00ʑ̈ɏ͵ʡI¬ʲÝƃA(˄0༔#ǰͶ/$ʍðͶ$Ȋʷʌ#6\x00$ʌஸ%ǴʹĠ%6#6%=#=ǁ&_ءˆsʍЯ1$2$=$=GʉÔˀʌʿʹ\x00͵31	0ຠ˼ʐʚȥ'ÖʡI­ʲ˼ʍöȨ˽ʒҖȻ˼ʗ໠ȡ\r͠ʌ<ʍɾ͸Ĝʹ\x00ʍɔ6˓ʌƔʹ\x00͵\x00Ͷ1ͷม1ʡǛʉʢ*˵ࣙ˴v	&ƺ%\x00ʌî1ʡʟ˅	1ʹʹʌӞ\r1ʡ̌#ʎ˰#ʎਙ˓˵͵ʌÞʐא0໯Ͷ$ʌÀ$ëʗ#ӥ0͎ʢ*͘1ˎNˇ+ê$ʹʍΡ$Nɒ͵$$ʍࠠ$ʌҾ$ʌԠɏ͵¶%_Ɍ$\x00͵#$]˼ʎǶȞ1	0Ɖʹ)®;ʉ[Oà>L/\x002Ï1ʡ१$آ(͸՛ˬʌx͠ʢ*͙	͠ʌ<ʌË+	ʹʌ<ʍŞ#6$ʌ̡$͞A&ʡr%u6˓ʍඝʹ\x00͵\x00Ͷʢ*	1&#ʌ+ê%%ʉÎ%Ą#Sʹ#ǫ͵%ǎ1	0ێ1'ʌҜ1ˬ1˩͡ˤ&͸ڗ#Ǐʉ²1ʡÃʌͷ̅ʌǬ͵ʡr͵$#ʌՔ6͵1̀ʹͽȊʹ\x00$ʢ*͖#0ݩʡIyʲč1%=ʉφɗ%61ʿµʡഄˎˑ31#=ʉφɗ#6$ͽݭʹ˾ʎӈɟʍ#ë1ȑʹYɝʹ\x00ͶYͷʙ#č1	0ॽ	ʵʏȝ͸þʹ3˻ʎӈț˼ʘΞȡ\rʹͶ͸ҭʹ\x00$\x00ͷ6ʉƬ\r˓ʌҾ˓ʌԠɏ͵ʢ*͑1-$ʌ͸گƅ#ӂʎӳǈ#@%෵&$ʌ#ఏ6ʹʹʌ¾͵$ʡIʲɳ͠ރ;ʉ#CОʢ*\r6ʡeʌ'Լ1	0ଞ͸͠ଆ˼ʍǀȠͷ$ͷͰ1	0౛(jʉ๛1ɐʹ	ʹʌ<#\x00$0ӭ˽ʓ͡Ⱦ1	0୻1	0ࣣ˻ʎѐȌ˾ʍöɡ˓ʎיſ1%%ണʡIcʲˬ6˳'ʌ%	1%=ʉ	1$ %60ʴ1ˇʶµˎʡࡊ1ʹʌƧʡI¤ʲȺ	6ʹʌ<͵\x00Ͷ%ƛ$1	0ܲ1	0ǧʢ*ʢ*	1͸ª#Bʉ৹	ͽ͠\x00ʡ§,	%(ʹʌӞ#ʌť͵0̰1ʵʶăʡ୯ː36Ͷʡ՚#ĳ1˅ʢ$͵ë%jʉâ+͸ڳ\r͸࣮#\x00ʡr$6Ɔʌڇ1'61ʡɦʤê%%$%S'%ʡeʌ!ඞʡƊʉਟ	ͷʷʌͷĠʢ*1Ͷ1	0؝$ʡʹʌ:ʌઽ1ʨ2˅͠#ʹʌXͣ5&5'Ö#ƁA1	0ɷ˽ʗܟɆ͸ೠ	ǵʵʌԱ\"(jʉŧʹʌ&1#%΅	ͦͧͨͩ*ƺ),\x00ʌî1EʦDʢʡ৊ʿͪͫͬ͠ʌ<ʌËǮƀsʌ݇'P˾ʍǀɞ0୚1	0ۈ'Ǩ$#ʹ͵h#Ǐʉîʹ͸Թʹ	%Ɨ#'-ʄ1˙	͸Ȟʹ\x00͵\x00Ͷäʡԭ͸ޤʢ*	1	0ପ1	0ǘ#ƛͶͶ$Ý1ƹ͵\x00ʌ೐#=ʉ	Љʹ͵Oʹ௵͵3$Ǵ#˽ʖŅɇ˻ʐծȚ+ƀsʌǿ)I	ʹʌĘʡrͷ1ːDʿʨʿ3ʢ*͕ê$$ʊó$ਭ#*ʊǏ$\x00$ນʡ஡ʉƸ%#$h1	0ʨͶƀA1˓ʍ˦6ʉÝʹʡrʹ1ʡŌʉĵ˲ʹ	Ɔʵ\x00ʍ̷	#˓ʏԆʹʓ#­˱ʹચ1	0࣭˿ʍöɥ	ʇʌʌ҆ˁ	#ʹʌ:͵0গ#੆ʹÁʌ॒ʹ৾ʌìʏ܀ʉð˽ʖ֫ȴʢ* Ͷ͸ҭʹ\x00$\x00Ͷ$ʹ1/$ʍƎʕඪ#Åʕˡ%áɌ˓\x00͵ɋʹ\x00͵௷ɏ͵Ͷ͸ĤͶ1	0ࢢʡƊʉZʡࢇʹʌĘ͵%$ˏʌí#&ཞ	1Ƌ&?1ːˎ1ːˍ	$ʡʲ%ҘI1	0௨1˄R;(Rʢ*ʢ*1&ʌƧ1	0৏ʐ#ĵ1	0౬6ͷ	6ʹʌϚʹʐõ1	0߮1#૟ʹʘ܁ʵ௺ɒ͵1	0ऌ˽ʖΖɁ1ʡৼʡईʣ2ʰ31˓ʌ౗˻ʍöȝ%	˓ʎݝʌȲ$ʌ#á1˭1	0༎İʛ#ˬ\r͠ʌ<ʏ̚͸Ĝʹ\x00ʏಧ1	0׾˼ʙາȡ#ʡ=ʌʹʌŢ˼ʍŅȣ$ʌޏ ˼ʚжȧ͸ࡡʡȧ1	0ງ1	0؛\r1ʡ=ʌ͸Ĝ͠\x00ʍۅ%ǩ$˯ơͶ$ʡӐʌ¨ǎʉ͵&%Ý1	0ಢ%ͽ੓ʹ#˧ʹhʌ#Ý	#ʵʌāʌѯ)&ëʹʡʌʹy#1ʤ#ʌÔ\r͠ʌ<ʌ̀͸Ĝʹ\x00ʌ֮˩˓ʌત˪˓ʏ௤$_1#$	1ɳʹʌร	1$#ʌ+1	0ැ0ƏʡIlʲӥ1	0୶Ͷ$ʌʁ	ʹʌ<Ͷ\x00ͷ\rʹH®/\x00!Ï1ʡɆʰ˻ʘඡȘʢ*ʡइʌx#ϲʎTʹീͶʡrͶƆʹʌŢ#$ʹʌʹʌȰʉÎ	6ʡփʌ˓\x00ʹ\r#ʡČʌʵʌލʌ̃˿ʍǀɣ#˳ʌ+#ʌĘʹ1	0ӟ1͵ʌѶʹʌ<͵\x00ʡrͶьʹʌ୥1˓ʎප˓ʌଢ଼('ʌ԰	$ʹʎ่͵h1#Ҫ#=Bʉƣ1	0೑1ʹ΅0ҝ1	0؞ʔ#ȗ#ʶʌ˓\x00ʹ˼ʐծȢ1ˍµʵʨNˎ3	1#=ʉÔ	1Eʡ¥ʡ´ʉƄ#ʡྋ0ک6#	1Ɩʹ\x00ʌ෱˞͸ò	1ƶ%\x00ʡ²'ƛ%1	0ܬ1	0ॻ$ʍӉȊʷʌ%6\x00ʍʌඥ&ӎ#	'%Ǭ౅&1	0඙1	0త	#ʹʌ:Ͷʸä͡͢ͣ	$ʌɢ%ʍ࠸ͳө#ͽͿ !ͼ͹ͺͻ		\nC\r`±ȣ˥ĒĂľGłÌĲô¼ôƫŧƥÓ°œǛȎŌƧŋĿţÕƚƷ^ÄŊ¡ƋŜƟ~ǠzēÊǃř~s$mýńt®ƨħÕsÔ ĴUĕ·ôƥƩóĳô­ÀbƏȒƥQŲÅƴǧ1ôôȏÝņȍƲĚKǘȔìĈ@âĠÕÜêÜl.ēǬ«ƙȂȁȅƣƒYHJǨ!0ǋǞ~ȇōųÕƂáD~ƹ±Ǆû\\ŇôąȑôĪôøôŒǸÑôƵǤbĹâÖñĨĶôĢĕƿôĕƢôǽhƒĐƥǻžċŞ/~\x00Yǩ#ĆTďǅcŚǌôīŨ;~ơôňÕôƮć#Ɗƌô:ÕôƾôŐȠ<ǑôîÕȗÇÕșôȃÕôȏÝņǡd-ŏŃÕıǐŕÕǆƞĽǯ¬ƬiðƘ~3Ū~[ş~+êȏǢôŸǫȜg7ǼôâƼǝn½ôƱė]Ȋ~³XǜȌ'(ķŰ~ǲƃ~ŀǹŠǦ~űêȡĺÂô¥>ǟ£ǁ~ǕµĔ~p`ǭÕźǵôôLôȏǈ&ņ²ÛġÁfŵºȕ®ÍăƥěŗvƪčƎļO÷^¦ƥǔƻMRôCƶôôƽïƈĥǍƥȟĖPȖÕǾȉÕƐǷÕĄƤÕ¾ǰÕƝôVƉǂƗȂǀüaâAÕÜŤǊqİƀğÕÞ¢ĤãÕȝÏ¤íƥFģôË~ØôƆŢāť~ƒèqƥƹƦƇ2~ǻƦȢƄrƥ\x00Ɗĵ§ę©?¿âȀȆÕĝÕĉôǿƁǪƑ~Ǘ¿ƸçƔƠôàôĘƥeĻ-ôÕôǮ¸BȚįæĚöŅ~ǒ%đ~Ưƺw~åț¯Ǚ´ĸNôôŴhßÿ¿Õưô\"Ò8	ô_ƅĩôëŖIŉƥƒŘWƓôĦȈǏôôEÚôôĞŁÈ9¹ƛĭȐÎúƖÙƌô\rôǴ¨ôòǱ\nĜŽÐŮȞùôĕŬŶôĕjô âŻȘƳôĊǚƭƜħÕŝõǣǉôªǺő~ǻǶČ~\x00µƌôĎÕyoôȏÝņǥƹZÃš»4}ŹūƥÕu=ôþǳxǓ×Ŕ,ÆÕŦSƻ¶ƍ*ŷ5Ȅ~ǎō)ÕȋŦôĀſǇȓô{ŭśéĮǖÉŎ|ƕäêôżôĬôůũô6Õkô\x00ȣjʉÎʢ*ͭȫ	ͼʌ+ԶǛͼ\x00ͱ	ଶ	Ɔʵ\x00ʏǜ͘u	಺ͼʌű	১৤	ʍɊʍŲ\r6ʡ୩Jͼҷʉ঩Jͼ3͢ϢǞͼ\x00͠ǣͼ\x00͡	࣢	੟ͼƭͼоͽͼ\x00ʌર²ʢ*	ͼʏβʙҒʨʡҎʡʟˍ3ʡɻ͸։	ƿͼ\x00ɩʌ௟ʉ	अ	཮	ͽͼ\x00ʍ˺á[˓ʌũʎ̡	ʵʌāʌัjʉå଱ǟͼ\x00͵ͼʌ+ʡ͢ːDːʮ3	ࣟʉɖҏʌҜvʉÔ	߆ॹೳ;˂[ʡڸ	͠ʌʉåʉƣEʤOʡ೯ʡฉːɑʌƝеʌ+˳ͼhͣͥʌ້	Ɔʵ\x00ʍĶ͗u˓ŬȕʌэʌìŻ޹ʉȍ˓Ŭȕʌэʌìʎ֣ʉð\rʌ:ʍԾʎӑ¸ʿˇ˒ʣ6૓	ఞͼʌ෭˒ŵό\rʡ=ʌÁʌƱʔɤEʸOʨʡڌʢͺEʡ¤ʉฑƟ͹1˨Aʡ܈ʢ*ÌǙͼ\x00ͣࠋh˓ʌũʍõǐʉବͽ඾பêS˧Ǘ|	΢	͠MǕͼࡺʌ֦ʉ6UUЂʉಾUƗʉȧ\rǝͼ\x00ͽҵʉ০ʉ৲ͦ3	೎ʡґʎ͈ǹǞͼ\x00ͥ࡮ߒǙͼ\x00Ǚͼ\x00ͨʉ\r/ʎೋʌྏʉ͹ʄǙͼ\x00ʡʅʎ͌ʏך	ി\rʺʒ˴ʵ\x00ʖलֻ_	ٍ͹˓ʍ˦EʶD˅ʮʡȶ	཯	մ	ஂ͢v˳ͼ༞ͼv\rʡ=ʌʌɛʎखͧͼʐ̞+קʡ¤ŸಸʡԫŮས˓ʔಒ˂͠˓ʌğʙʷ͑౷˓ʓ৭˂ͤ˓ʌğʓÒ͒ଋ_Ͷjʉқ	ি	͡ʌʉ\rͽͼ\x00ʌ̤ʌथʌˑ6͸þʉ̈ƕA	ͼʌ:ʍͰͽ༃	ͼʌ<ʌË͠șͲșͰșͱȫ	ಂ	स	Ɖ͸ܒͥ;ͼʏࣕͦ;ͼʏ༤ͧ;ͼʐ̞	ƺ#ʌîʴǛͼ\x00ͯͼʌìŦథʉð	ʌ:ʖૐͥ;˂ͦ;˂ͧ;˂͠G	ʎɤͽਲʨ2ʯ୭ʡȏʌˑ	ط?	ʌʑ಴	ǘͤvļͧ	ʌʚƬ	͠ʌʉʌʶʌʱǛͼ\x00ͥ	ʎͼʏ̤ͼʏݓ͠͠͸ඨ	=CʉÔEˑăʡɆˊʶ¸ˑOʨNˎʯǠͼ\x00ʡક	౴ʌǬͦȫU˓ʏՃUʉîv	୆	͹ʵʍȑʒ˹˂ͼʏ੠˂ͼʏખ	ʌ+	͡ʌʉåŶʐ௒Ϳढ़ʐݨůୋů਷ʍ¾ࢻ_ʡ৚ʯOʡѦʡম	͹ͼʌ:ʌʔ	যʌ٨ͼʌϚͼʐõ	ɷ	༝݋ӂ݆ӡ\rǡͼ\x00hʌϤʉ༐͠˂Ё˓ʍ˒ʍϑJ͠ҹʉ̩£ǔ	ǣͼ\x00ʡȏ͸࡭९ͥv	ƺ\x00ʌࣻ	Ɔʵ\x00ʎú͖uʡƷʌď	ٵ6ʚƯļͤǗͼƚʎϟʌทǞͼ\x00ʸäǞͼ\x00ˏʍƕͪ3Uʌ+\r/ʎகʏݎʉ\r˓ʎťUƍ͠2͡	Ɔʵ\x00ʍ̷͔uǛͼ\x00Ͱʌ͘͸ªˮʍɟʉʞ͠͡ʢ*	Ǩˑʌ๞	Ɔʵ\x00ʌ࠿͝uʮDʡݙʦʤ3	ࣨ͡Ǧʎ४ʌǷ	ƓʌÞʌଊں	ī͸ªͪ	ਘǣͼ\x00͠\rǝͼ\x00ͽҵʉডʉёͧ3	͹ʍėʐĢ	Ǟͼ\x00	ͿĚ\x00\x00ͼʌ+ͿĚ\x00ʎˆUʌਹ	ͽͼ\x00#²ǳA'˓ʌũʌΥ	ŨųAʎʽͼʓ໦ʏ௑ʽͼʓซʏܡͶjʉ	ǝͼ\x00ǐʉౘː2ʰǤͼ\x00͢Ǜͼ\x00ͣƏʯNʡҕʡ֭ʵOʤNʡʒ͹͢	͠Ǔͼʉͪͼʙ஦ͼʓ஍	ͯʻͮͤİͿĚʍ˺áǠͼ\x00ͷ	1ʇʌՊļͲǛͼ\x00ͳয়ʉ๽ͳʰNʡƱ	ਸ਼	ු	۟͹̫ë	ͽ྘ͼ¶ӎ	ۺʢ*	ƶ?\x00ʡڤʥ!ʉǘͼļͰǝͼ\x00ͽஐʉ৉ͥ3	ߏ	ӟ6ʉÝʦ2ʡҕEʡ¤ʉઝʡ¤ʉԈ	ځEʡ¤ʉ඲ʨ2ʡƱ͠;˂ͤ;˂ʹʢ*ˮʎɧʡĵ͠v	ǧʗ௿ʗයʘѩ˓ʍ˦	ࢰǟͼ\x00ʡʯǩ͡޳6	Ɔʵ\x00ʎƫ͓uʎˆUʐνˮʎ๬͸ªˮʍɟʉʞ˓ʍ˒ʍϑͪͣ͢	J͡ષʉ̩ͪ͸ò	Ɔ͹\x00ʑϮఙ	͠:ǖͼ͠͸ò	EʡƥʉŘʡʅͬ$6͹ļͱǐʉ຺ʹʌĘ͠	Ɔʵ\x00ʎȹ͚uǛͼ\x00ͤǟͼ\x00Ͷ	ͻʏđͿĞͭʡؕʯDʡ๚ʨ3յ	ͫʻͬ͡	ͽͼ\x00ʎƮ²˧1ʇͪȫͼ¶ơ˓ʍ͡Dʌʉϵʌʉî	૯ʢ*\n	फͼ´A	Ɔʵ\x00ʏн͕uʢ*\r	ͽϸˮʍϯ͵;˂Ǚͼ\x00ͳʻ˃ʡϜͼʘ੏\x00ʉഅʡϜͼʘ෷\x00ʉෂͼͤͤʌʉÎ	ࢤʉ	ۚ̰ʡ׆ˑDˍʵ3̫ˌʌ̙	ྃ͢Ǧʏޚ	6ʌʉȨશˇOːʡඌː3͡ʎ෥ʏ฾ʏЊ	૕ʎűʐݠǤͼ\x00ͤʌফʡ=ʌʌɛʌƱ˄ƚAǛͼ\x00͢	ޜͿĚ\x00ͽז	ʌʑŧ\r/ʡ´ʉݞͼʌԵʌլͩʶ2ʡǮ\rʉŘUʌ߁܇͢͢ʌʉܭͶ	ڿ	ʵʍȑʡȿ͸৮ЌǴͼͣvǛͼ\x00͡Ǜͼ\x00ͩʡ௔ˬͼʌѣܰ	~ʍįʶ2˅	ຉͦ͸òनͶًʉҥʉ̈	ͼʌ:ʌʔͶjʉॡͨȮ͸ªͦ˲˂Eʡ׀ʡ࢞ʿʢǞͼ\x00ͤʡઍʡڜʰʦ3ʎˆʌ+ʡ܍͸þʉƸ[ʍ܄ͼ´	ਚǵ\x00\ru	͡ƴƯͼ3ʧ	͠Ǖͼ˓ʎגǤͼ\x00͡ʶ2ʡʭͼUʌ԰	נʎࣈ	͠ǘͼ˂҄ͼ	ಶͼʗঙ	๎	ൻӔ	ͽϸˮʍϯੲ	Ɔʵ\x00ʎথ͙uͿĚൎ²ǒͼͼ$ͽਏ6ʍРͭ͸òʡޔʶ»ˍ2ʦ3%ŸA	ʨǤͼ\x00͠£ͽͼ\x00ʌബáͮȮ͸ªͭ ˂ʡࠢʫ¸˒ʢʦˇͿĚ൉áʫʮͶjʉ༓˓Ŭϒǟͼ\x00ʡ೺ͦʡɦˍEʡ¤ʉΌͿߎ_\rUʌÞʌ׍	ະjʉǢͼ\x00ʹvͥͼʏ̙Ǖͼ/Ŷ˓ʎඑ˓ʎζʏৃ˓ʎζʏଙ\n|˓Ŭׇʎԡʎ̶ʏസʎ̶ʏ૚ʍ¾̺_͡v ʒඹ ʍϔʖ̞/ʡ¤ʉ؈Ͷ%ʉ༡Ͷ%ʉՌ˓ʎࣘʎ͈ʡґʎਐ	੍ʤ2ʨ	ಜͺธ	ৱ1ˆsʍЯʎ͹\x00h	ƶ\x00ʓլ	ʣ	Ɔ˓\x00ʑZƙඇ6ƭĳͿ൤_	͠ʌ<ʍçͻ	ःͶ҄ͼʏί\rʳʌ\x00ͶjŸAǛͼ\x00ͲʡƷˑʌǱ	̢ʉÎǑ	ഇ˒ʔ֯	ʌʘȗͦͼʏ׬	~ʍʁʵNʡǮ	ʡrƆʌŝ˒ʸ6ͿĚʎƮ²EʫOʨʰʵͨݰͼʌԵʌཆ2˓ʍǱ	੐~˓ʌũʌҟ	੘͸þʉ඼Ͷjʉå!ʌ͘ʡ=ʌʌɛʎࡁͽਜ਼\x00ͼY͸ªˮʍɟʉʞʡƥʉ੢ʡԫʉ߄	ʷʌĠ	ͼʘ໩h%ʉқ͡;େ͢;ڢͣ;ͥˬʌxͼͺʌʁ˓Ŭϒ	ǥͼ\x00\x00ͶǢͼ\x00ʡͰ%ʉે͠Ǧʐŝҝˍ2ʤjʉļ͠˒2ʮ	͠0ǘͼͽଘͽ഑ʻ²ʌ̡	E͢͠͡ʉå	๢BʉૈʉÝ[ʍ݄͡͠%ʉ	ʌʙɳ\r6પʇʉ܃؁ʌ൯ĳ	૊Ǚͼ\x00ʡΌ	ͼʌǴ	Ɔʵ\x00ʌƦ͛uͽाͼ¶ͼ_ѨϢ	Ɔʵ\x00ʐǃ͜u	ܾ˓ʍΥ%ʉͽո	ͩʻͨͧͽి	ಳǢͼ\x00ͼʌ+ơǛͼ\x00ͫ˅Oː»ʨ2ʵ3ͼʌǴ˒ʔɔ\r˓ʍˁʌʌࠎʌxͼ͡Ϳ΀	;	\n!\r\"·kLv86mmazwPDCxm\nP[Jul3\x00mF\"G`)(HmK){\r$PpmO|)g\\%Xsbg9H\\TmW~\".+fihyP#']PCm	\"_mqB4mt\"5m\"MN\":*><mrS@!meRm?\"/mZ\"EdA);oUYj\rZP;0m7}mImImQn,-=)1\r2P&^cm PCVm\x00ʸ\r\x00ʉ౧ʡÊʌ\x00˒ʎ#ʌԃŶǉ\x00͸ੳʌʉɰˀ_ʢ*๊6ͽࡪ͹ʎࠨ͹ʎֵ͢;ʵ˖	˓ʎťʧͥ	ʵʌğŴ\r	؋͹ʕউ͹ʌ+͸ͼ\x00ʌʔ	˚ʍȜŭՆ΀Ğʢ*\rʡĵʨNːͿϕͤ	࠭ͽ੺	ʵ;ʥ˂͹೅Ϳ͜	ī	ʵʌğż\r\rʡlʌ\x00ʒ༩ʉð࣠\rʡÊʌ\x00˒ۜʌ౵ʴEʡҎʡʟːěʵ	ʨʡÊʌ\x00˒ʎ#ʌԃ	ڹ	०ʦ2ʡâѷʻƮ\nʉȿ	͹ʍėʍǥ	˖ʡ̌ʍ˪ʎ͌ʏ޵	؍	6͹\x00\x00͹ơʢ*͢ʢ*ʡඍˊ঄ͤ	݊	͡ՙͻʏđʮ2ʤ	ʻ\x00ʉȿ	͹ʖő\x00ѷƏͪǎŪՆʍƖ\n	߿\rʌ¾˒ʐ˥ʌࢿ	ǧͿ٭ܪ\rʡlʌ\x00ʓปʉðʢ*	͹$ͺʔৗ	Ɖ˓ʕ฻˓ʕॐ˓ʔݤ	ࡷ͹ʗर\n6	ǘ	ͼʌ<ʌË͹ʡru	ʌʉå	͹ʌŒʐĢ	ʵʌğű\r6	/;Ű̵ʵ\rʡÊʌ\x00˒ঔʌم΀ড়\rʓ૥ʖŧͨʻʓऐʉ̩ʌʉƬ	͹$ʌ¨Ϳϕˇ2ʢ	ཡ	ǧʉ࣯\x00Ќ	ʵʌğŤ\r\r͹ʌŒʍǥƬͥʌΧʢ*ʮNʿİ	͹ʍėʍǥ͡ͿԜʎƃ\x00͡	଎͹1	ɷͼ	ଫʢ*\nʏબ˓ʔӜ	ͪʻʏล	/;ũ̵ʵͩʑɡ͠ͿԜʐ̒\x00͠	ʌʉK¼ʌ+Shʕ๡࠵ʌʉࡉǍ7?ٖ2Y͢ǧźʏʷ̺_	/;Ŷ̵ʵ	Ũʿ»ʡ஄ʰNʢ31˒ʗࣀ;ʌʱ\r΀΁\n	(		\n	\x00\r						\x00ˇʯDʰʣ3ʢ*΁Ğʢ*Ŷ͹ʏȡ\nʡČʌ͹ʏ̶ʗ೩\nʘ	̺_ͥͿౢ͡͸ò	Ũ\r͹ʌŒʍǥƬͥʌΧİͣͥv\nʵ;hͥ˓ʎťͥྐͥͺvʡܴˎµ˒ʢ3ͺʉನ͡͠ʎІ\n!ͣ	ƉƏ	Ϳ͉ʎऺʎര͢$͸ª͡͹ʒऊ\x00\x00Ϳ͜ͣ\nʢ*		ī	ǧ	\n΁\x00\r\x00\x00\x00\x00\x00\x00\x00İ\nʡlʌ\x00ʐຊͿ͉\n		ī";}}}else if(_$$X<48){if(_$$X<36){if(_$$X===32){_$_n="_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');}else if(_$$X===33){_$$z= !_$iV;}else if(_$$X===34){return _$d9;}else{_$bP+=-12;}}else if(_$$X<40){if(_$$X===36){_$cJ[_$gF]=_$dP;}else if(_$$X===37){_$d9[4]=_$aD(19)-_$_n;}else if(_$$X===38){_$kz+=_$hq;}else{_$jl.cp=_$d9;}}else if(_$$X<44){if(_$$X===40){_$jl.scj=[];}else if(_$$X===41){_$bv(47,_$iV);}else if(_$$X===42){_$$z=_$c9===undefined||_$c9==="";}else{_$gF='$_'+_$gF;}}else{if(_$$X===44){_$$z= !_$iQ;}else if(_$$X===45){_$d9=[];}else if(_$$X===46){_$eZ=_$ff();}else{_$dI.push(_$bv(45,_$ff()*55295+_$ff()));}}}else{if(_$$X<52){if(_$$X===48){ !_$$z?_$bP+=-18:0;}else if(_$$X===49){ !_$$z?_$bP+=29:0;}else if(_$$X===50){_$jl.nsd=_$$n;}else{_$ft=0;}}else if(_$$X<56){if(_$$X===52){ !_$$z?_$bP+=2:0;}else if(_$$X===53){ !_$$z?_$bP+=-17:0;}else if(_$$X===54){_$fN=_$ff();}else{_$iV.push("})(",'$_ts',".scj,",'$_ts',".aebi);");}}else if(_$$X<60){if(_$$X===56){_$d9[2]="nXX`X*`YY[`[)`,`X)`ZZ`Y()`(*`XWY[`)`Z*`+`XZ`*`(+`Y((`ZY*)+`)Z`Z)`X,Y`[+`)((Z(`Y`+)`ZY`XZ[YX**Y+`[[`XW`(X`[W`X[`+X,Y`Y)+[Z([()`(`)W[+WW`[Y,[,)*Y,(`X(`Z`Y[`(Y`[`)[`YWW`,Y`XZXW*Y`X,`TX`ZX`Y*`[Z`Y[W`XY+`)((Z)`XY`XY*`[(`[X`XWW`[*`ZZ(([[ZY`[Y`X+`YW`Y(*`YW,*X(Y`Y+`)(`TXWW`YX`(,`T[`YZ`Z[`Y[+`XWWW`,+`ZW`,W`[X,[ZW[`WUWX`+Z++)W+`+W`Y+Z`TWUWX`XWY`YWX`Z(`XZ[YX**Y*`(WWW`XY)`XYZ`X)+[ZWW+`[W,)W`*,`,)`((`()`(XY`)+`Y)YX[[`X*W`[Y,[,)*Y,)`YW,*X(X`X+W`YWWW`Y,`)W`XYY`WUW`Y(`YWZ`Y)([[Z(*),`+,`(WW`+Y`,*`*Y`YW[+`X)***YX)`XW[+(*)`Y)`Z,`[W,)`Y)+[Z([((`ZWW`,Z`XWWWWW`TWUY)`XXY`XWX`ZZZ*()(,+[`XWY[W`WU+`*(`[WYZYZZ[X*`Y(Y`++`WUY)`+YZ,`)X(+`YWWWW`+X,(`Z,++Y,YZ+[`XXW`,X`X()*,`YW[*`+[`+X,Z`+YWW`Z)W`WU)`WUX`WU,`ZWWWW`+YWY`+X,[`X)Z+Z`Y([`*()W`+X`X+WW`Y*X*ZZ+*+`XXX`Y(ZXWXX`+X,*`,,`WU[`+X,)`*X`WU+XZY)[([Z`TWU,`ZX[(*Y+`([`X*ZY(+[X,Z`)((Z*`+(`XWWWWWW`X)W`+YWX`X,X`X)[`+Y+*`Y[WW,(,*W+`+YWZ`TX+W`()ZYW`X)+[ZWW,`X)(`+Z`((Y,)`XYY++`Y(WW`+X,+`)[Z)X(`Z(WW`XWWX`ZY+(Z**(YW`XW[+(*(`+)[WWWWW`TWUY`WUY`X+(,**(Z,Z`X(X+(WWY[,`X)***YX(`Y()YZ+ZXWY`+X,,`ZWWW`X(WW`T,W`WUZ(`TY`ZZ,([),*+Y`(W+,`T*`X,)`X*Z`YW,`X)Y`X[X`X[*`X+X`XZY`X**`X*X`YXY`YW+`YW(`X,Z`X((`X+Y`X,,`X*+`X)+`YX(`X*Y";}else if(_$$X===57){_$d9[3]=_$hH;}else if(_$$X===58){_$d9=_$cJ.eval;}else{ !_$$z?_$bP+=63:0;}}else{if(_$$X===60){_$dI=_$_9.substr(_$kz,_$hq).split(_$gL.fromCharCode(257));}else if(_$$X===61){_$$$=_$iV.join('');}else if(_$$X===62){_$jl.lcd=_$$n;}else{_$d9[5]=_$aD(19)-_$_n;}}}}else{if(_$$X<80){if(_$$X<68){if(_$$X===64){_$bv(59,_$$3,_$iV);}else if(_$$X===65){ !_$$z?_$bP+=23:0;}else if(_$$X===66){_$eZ=0;}else{_$$z= !_$ah;}}else if(_$$X<72){if(_$$X===68){_$$z=_$ft<_$c9;}else if(_$$X===69){_$bP+=-6;}else if(_$$X===70){_$$F='\n\n\n\n\n';}else{return new _$hl().getTime();}}else if(_$$X<76){if(_$$X===72){_$$z= !_$$$;}else if(_$$X===73){_$iV.push(_$$F.substr(0,_$$r()%5));}else if(_$$X===74){_$aD(99,_$$$);}else{_$$3++ ;}}else{if(_$$X===76){ !_$$z?_$bP+=1:0;}else if(_$$X===77){_$$3=0;}else if(_$$X===78){_$ft++ ;}else{_$$z=_$eZ==64;}}}else if(_$$X<96){if(_$$X<84){if(_$$X===80){ !_$$z?_$bP+=4:0;}else if(_$$X===81){_$aD(110);}else if(_$$X===82){ !_$$z?_$bP+=-21:0;}else{_$bv(74);}}else if(_$$X<88){if(_$$X===84){_$d9[_$ft]="_$"+_$_n[_$_j]+_$_n[_$eZ];}else if(_$$X===85){_$$z=_$cJ.execScript;}else if(_$$X===86){_$$z= !_$kz;}else{_$_z=_$ff();}}else if(_$$X<92){if(_$$X===88){_$$z=_$fN>0;}else if(_$$X===89){ !_$$z?_$bP+=10:0;}else if(_$$X===90){_$gF=_$ad().toString(16);}else{_$kz=0;}}else{if(_$$X===92){_$_n=_$d9.call(_$cJ,_$c9);}else if(_$$X===93){_$aB=_$_9.length;}else if(_$$X===94){_$iV.push('}}}}}}}}}}'.substr(_$fN-1));}else{_$hq=_$ff()*55295+_$ff();}}}else{if(_$$X===96){_$bz=_$aD(0,900,_$g9(_$ax&0xffff));}else if(_$$X===97){_$$r=_$g9(_$ax);}else if(_$$X===98){_$gb(_$d9,_$hn);}else{_$eZ++ ;}}}}else ;}
    
    
    function _$bv(_$iV,_$hq,_$$3){function _$cL(_$dP,_$_n){var _$d9,_$_j;_$d9=_$dP[0],_$_j=_$dP[1],_$_n.push("function ",_$bz[_$d9],"(){var ",_$bz[_$hx],"=[",_$_j,"];Array.prototype.push.apply(",_$bz[_$hx],",arguments);return ",_$bz[_$bt],".apply(this,",_$bz[_$hx],");}");}function _$bn(_$dP,_$_n){var _$d9,_$_j,_$eZ;_$lh(53,_$_n),_$d9=_$eP[_$dP],_$_j=_$d9.length,_$_j-=_$_j%2;for(_$eZ=0;_$eZ<_$_j;_$eZ+=2)_$_n.push(_$dI[_$d9[_$eZ]],_$bz[_$d9[_$eZ+1]]);_$d9.length!=_$_j?_$_n.push(_$dI[_$d9[_$_j]]):0;}function _$al(_$dP,_$_n,_$d9){var _$_j,_$eZ,_$ft,_$fN;_$ft=_$_n-_$dP;if(_$ft==0)return;else if(_$ft==1)_$bn(_$dP,_$d9);else if(_$ft<=4){_$fN="if(",_$_n-- ;for(;_$dP<_$_n;_$dP++ )_$d9.push(_$fN,_$bz[_$$f],"===",_$dP,"){"),_$bn(_$dP,_$d9),_$fN="}else if(";_$d9.push("}else{"),_$bn(_$dP,_$d9),_$d9.push("}");}else{_$eZ=0;for(_$_j=1;_$_j<7;_$_j++ )if(_$ft<=_$$V[_$_j]){_$eZ=_$$V[_$_j-1];break;}_$fN="if(";for(;_$dP+_$eZ<_$_n;_$dP+=_$eZ)_$d9.push(_$fN,_$bz[_$$f],"<",_$dP+_$eZ,"){"),_$al(_$dP,_$dP+_$eZ,_$d9),_$fN="}else if(";_$d9.push("}else{"),_$al(_$dP,_$_n,_$d9),_$d9.push("}");}}function _$$M(_$dP,_$_n,_$d9){var _$_j,_$eZ;_$_j=_$_n-_$dP,_$_j==1?_$bn(_$dP,_$d9):_$_j==2?(_$d9.push(_$bz[_$$f],"==",_$dP,"?"),_$bn(_$dP,_$d9),_$d9.push(":"),_$bn(_$dP+1,_$d9)):(_$eZ= ~ ~((_$dP+_$_n)/2),_$d9.push(_$bz[_$$f],"<",_$eZ,"?"),_$$M(_$dP,_$eZ,_$d9),_$d9.push(":"),_$$M(_$eZ,_$_n,_$d9));}var _$dP,_$_n,_$d9,_$_j,_$eZ,_$dJ,_$eV,_$eQ,_$hx,_$cB,_$bt,_$$f,_$an,_$b5,_$g7,_$fe,_$hp,_$a3,_$eP,_$gj,_$ir;var _$$$,_$ad,_$$F=_$iV,_$gF=_$bh[2];while(1){_$ad=_$gF[_$$F++];if(_$ad<76){if(_$ad<64){if(_$ad<16){if(_$ad<4){if(_$ad===0){_$dP=_$ff();}else if(_$ad===1){_$$$= !_$eP;}else if(_$ad===2){_$an=_$ff();}else{_$a3=[];}}else if(_$ad<8){if(_$ad===4){_$jl.jf= !_$d9;}else if(_$ad===5){return _$_n;}else if(_$ad===6){ !_$$$?_$$F+=1:0;}else{_$d9=_$bv(0);}}else if(_$ad<12){if(_$ad===8){_$gj=0;}else if(_$ad===9){_$$f=_$ff();}else if(_$ad===10){_$_j=_$ff();}else{ !_$$$?_$$F+=7:0;}}else{if(_$ad===12){_$$$= !_$eZ;}else if(_$ad===13){_$$$=_$d9;}else if(_$ad===14){_$$$= !_$a3;}else{_$hq.push(_$d9);}}}else if(_$ad<32){if(_$ad<20){if(_$ad===16){_$b5=_$bv(0);}else if(_$ad===17){ !_$$$?_$$F+=-51:0;}else if(_$ad===18){_$dP.push([_$fe[_$_n],_$fe[_$_n+1]]);}else{_$gb(_$a3,_$$r);}}else if(_$ad<24){if(_$ad===20){ !_$$$?_$$F+=38:0;}else if(_$ad===21){ !_$$$?_$$F+=3:0;}else if(_$ad===22){_$$$=_$_n<_$_j;}else{_$ir=_$lh(0,_$ax);}}else if(_$ad<28){if(_$ad===24){_$dI=_$bv(45,_$ff());}else if(_$ad===25){_$lh(6,_$$3,_$hq);}else if(_$ad===26){_$_n=0;}else{_$d9=[];}}else{if(_$ad===28){_$hp=_$ff();}else if(_$ad===29){ !_$$$?_$$F+=13:0;}else if(_$ad===30){_$d9=_$dP.test(_$_n);}else{_$dJ=_$ff();}}}else if(_$ad<48){if(_$ad<36){if(_$ad===32){_$$$= !_$_n;}else if(_$ad===33){_$bt=_$ff();}else if(_$ad===34){_$eP[_$_n]=_$bv(0);}else{_$dP=new RegExp('\x5c\x53\x2b\x5c\x28\x5c\x29\x7b\x5c\x53\x2b\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x7d');}}else if(_$ad<40){if(_$ad===36){_$$$=_$_n<_$fe.length;}else if(_$ad===37){return;}else if(_$ad===38){_$_n++ ;}else{_$$$= !(_$an+1);}}else if(_$ad<44){if(_$ad===40){_$$F+=-5;}else if(_$ad===41){ ++_$d9;}else if(_$ad===42){_$_R(_$_n,_$d9);}else{_$_j=new RegExp('\x37\x34');}}else{if(_$ad===44){ !_$$$?_$$F+=-27:0;}else if(_$ad===45){_$$$=_$_n<_$eZ;}else if(_$ad===46){_$hK[_$hq]=_$d9;}else{ !_$$$?_$$F+=27:0;}}}else{if(_$ad<52){if(_$ad===48){_$g7=_$bv(0);}else if(_$ad===49){_$_n+=2;}else if(_$ad===50){_$kz=0;}else{_$_n=_$bv(0);}}else if(_$ad<56){if(_$ad===52){_$a3[_$_n]=_$bv(0);}else if(_$ad===53){_$$$= !_$fe;}else if(_$ad===54){_$_n=_$iF[_$iF()]();}else{_$fe=_$dP;}}else if(_$ad<60){if(_$ad===56){_$$F+=1;}else if(_$ad===57){_$dP=[];}else if(_$ad===58){_$cB=_$ff();}else{_$d9=_$d9.join('');}}else{if(_$ad===60){_$_9="!Ĵfunction ā(ā){var ā=2;var ā=ā[ā(1,8)];var ā(2,8)];ā[0]=7+5;}function ā){if(6){ā[4]=2;}ā[4]=2;ā[0]=7+5;ā[0]=6;ā){if(ā(7,8)]){if(2){ā[0]=6;}}ā[4]=ā(3,8)];if(7+5){ā[0]=6;}ā){ā(3,8)];var ā=7;if(ā(7,8)]){if(2){var ā=5;}}ā(3,8)];}function ā){if(7+5){ā[0]=ā(7,8)];}function ā(7,8)]=5;var ā=6;var ā(5,8)];var ā=5+3;}\x00)+,)+*)*)))	)\n)))\r)))))))\r))))\x00)))*)*))\r)))))\r))))))),+),, ";}else if(_$ad===61){_$eP=[];}else if(_$ad===62){_$hx=_$ff();}else{_$fe=_$bv(0);}}}}else{if(_$ad<68){if(_$ad===64){_$_n=new _$cn(_$dP);}else if(_$ad===65){_$eV=_$ff();}else if(_$ad===66){_$eQ=_$ff();}else{_$d9= --_$ax[0];}}else if(_$ad<72){if(_$ad===68){_$eZ=_$ff();}else if(_$ad===69){_$gb(_$fe,_$$r);}else if(_$ad===70){_$aB=_$_9.length;}else{_$d9= --_$ax[1];}}else{if(_$ad===72){_$dP=_$_9.substr(_$kz,_$hq);_$kz+=_$hq;return _$dP;}else if(_$ad===73){for(_$d9=0;_$d9<_$dP;_$d9++ ){_$_n[_$d9]=_$ff();}}else if(_$ad===74){_$eZ=_$_j.test(_$_n);}else{_$dI=_$dI.split(_$gL.fromCharCode(257));}}}}else ;}function _$lh(_$eZ,_$aJ,_$_j){function _$_n(){var _$hq=[3];Array.prototype.push.apply(_$hq,arguments);return _$iB.apply(this,_$hq);}function _$dP(){var _$hq=[0];Array.prototype.push.apply(_$hq,arguments);return _$iB.apply(this,_$hq);}var _$d9;var _$fN,_$$3,_$ft=_$eZ,_$iV=_$bh[3];while(1){_$$3=_$iV[_$ft++];if(_$$3<54){if(_$$3<16){if(_$$3<4){if(_$$3===0){_$aJ.push("var ",_$bz[_$g7[0]]);}else if(_$$3===1){_$aJ.push(";");}else if(_$$3===2){ !_$fN?_$ft+=14:0;}else{ !_$fN?_$ft+=4:0;}}else if(_$$3<8){if(_$$3===4){ !_$fN?_$ft+=18:0;}else if(_$$3===5){ !_$fN?_$ft+=26:0;}else if(_$$3===6){_$fN=_$g7.length;}else{_$fN=_$hp<_$eP.length;}}else if(_$$3<12){if(_$$3===8){_$aJ.push("){");}else if(_$$3===9){_$$M(_$hp,_$eP.length,_$aJ);}else if(_$$3===10){_$aJ.push("debu");}else{ !_$fN?_$ft+=-21:0;}}else{if(_$$3===12){_$aJ.push("}");}else if(_$$3===13){for(_$d9=0;_$d9<_$fe.length;_$d9++ ){_$cL(_$fe[_$d9],_$aJ);}for(_$d9=0;_$d9<_$a3.length;_$d9++ ){_$_R(_$a3[_$d9],_$aJ);}}else if(_$$3===14){ !_$fN?_$ft+=2:0;}else{_$aJ.push(_$bz[_$eV],",",_$bz[_$an],"=",_$bz[_$_z],"[",_$_j,"];");}}}else if(_$$3<32){if(_$$3<20){if(_$$3===16){_$fN= !_$bz;}else if(_$$3===17){_$aJ.push(",",_$bz[_$b5[_$d9]]);}else if(_$$3===18){ !_$fN?_$ft+=-26:0;}else{_$aJ.push("var ",_$bz[_$eQ],",",_$bz[_$$f],",",_$bz[_$dJ],"=");}}else if(_$$3<24){if(_$$3===20){_$fN=_$eP.length;}else if(_$$3===21){return _$_n;}else if(_$$3===22){_$aJ.push("while(1){",_$bz[_$$f],"=",_$bz[_$an],"[",_$bz[_$dJ],"++];");}else{_$fN=_$aJ.length==0;}}else if(_$$3<28){if(_$$3===24){_$aJ.push("function ",_$bz[_$cB],"(",_$bz[_$eV]);}else if(_$$3===25){ !_$fN?_$ft+=37:0;}else if(_$$3===26){_$fN=_$dJ<0;}else{ !_$fN?_$ft+=5:0;}}else{if(_$$3===28){_$fN=_$gj<=0;}else if(_$$3===29){_$aJ.push("if(",_$bz[_$$f],"<",_$hp,"){");}else if(_$$3===30){return _$dP;}else{_$fN=_$b5.length;}}}else if(_$$3<48){if(_$$3<36){if(_$$3===32){_$ft+=1;}else if(_$$3===33){_$aJ.push("(function(",_$bz[_$iQ],",",_$bz[_$_z],"){var ",_$bz[_$eV],"=0;");}else if(_$$3===34){return;}else{_$fN= !_$aJ.length;}}else if(_$$3<40){if(_$$3===36){_$gj=_$ir();}else if(_$$3===37){ !_$fN?_$ft+=6:0;}else if(_$$3===38){_$ft+=15;}else{_$fN=_$_j==0;}}else if(_$$3<44){if(_$$3===40){_$d9=0;}else if(_$$3===41){_$gj-- ;}else if(_$$3===42){ !_$fN?_$ft+=1:0;}else{_$aJ.push("}else ");}}else{if(_$$3===44){_$fN= !_$fe;}else if(_$$3===45){_$fN=_$gj<64;}else if(_$$3===46){_$aJ.push("gger;");}else{_$ft+=-5;}}}else{if(_$$3<52){if(_$$3===48){ !_$fN?_$ft+=3:0;}else if(_$$3===49){_$fN=_$aJ&65536;}else if(_$$3===50){_$d9++ ;}else{for(_$d9=1;_$d9<_$g7.length;_$d9++ ){_$aJ.push(",",_$bz[_$g7[_$d9]]);}}}else{if(_$$3===52){_$al(0,_$hp,_$aJ);}else{_$fN=_$d9<_$b5.length;}}}}else ;}
    
    
    
    function _$iB(_$dP){var _$d9,_$eZ,_$_n=_$dP,_$ft=_$bh[4];while(1){_$eZ=_$ft[_$_n++];if(_$eZ<4){if(_$eZ===0){return(_$aJ%10)+10;}else if(_$eZ===1){return 64;}else if(_$eZ===2){return;}else{_$aJ=0x3d3f*(_$aJ&0xFFFF)+0x269ec3;}}else ;}}}}}})([],[[0,6,4,8,3,2,11,9,7,10,5,1,],[32,45,12,51,68,89,84,99,79,80,66,24,11,3,78,35,98,34,4,71,4,29,17,62,50,13,59,94,41,55,61,72,49,6,70,54,77,19,80,73,64,75,69,33,48,54,77,19,15,47,75,26,2,82,54,95,88,76,60,38,86,53,37,20,18,57,9,90,43,36,16,67,65,81,8,21,40,31,93,91,10,56,25,27,46,7,87,0,44,22,97,96,45,39,5,28,74,63,4,42,76,4,85,52,23,1,58,92,14,4,30,83,4,4,],[0,64,32,20,69,28,7,46,10,3,26,22,21,52,38,40,14,29,16,48,63,57,26,36,21,18,49,40,55,53,44,19,68,61,26,45,21,34,38,40,1,47,73,5,37,72,37,60,70,50,0,24,75,51,27,42,59,15,37,31,65,66,62,58,33,9,2,39,17,8,23,25,37,37,35,54,30,13,11,71,43,74,12,6,41,56,67,4,37,],[49,14,30,32,21,34,36,39,4,33,23,2,15,20,25,22,26,5,13,6,48,0,51,1,35,3,38,24,23,48,19,16,11,31,37,40,53,48,17,50,47,8,44,18,29,52,43,7,42,9,1,12,34,41,28,27,36,45,14,10,46,34,],[3,0,2,1,2,],]);}



    debugger;
    var ans = document.cookie;
    var test1=document.cookie.toString().split(';')[0].split('=')
    console.log(test1);
    console.log("len",test1[1].length); //428
    console.log("cookie_setter_begin");
    console.log(ans);
    console.log('cookie_setter_end');
    debugger;
    