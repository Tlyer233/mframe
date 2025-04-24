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
        nodeEnv: false,   // 是否使用node环境
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
        initLocation: {
            "ancestorOrigins": {},
            "href": "https://zbzx.lzjtu.edu.cn/",
            "origin": "https://zbzx.lzjtu.edu.cn",
            "protocol": "https:",
            "host": "zbzx.lzjtu.edu.cn",
            "hostname": "zbzx.lzjtu.edu.cn",
            "port": "",
            "pathname": "/",
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

mframe.memory.config.nodeEnv=true
mframe.memory.config.proxy=true
mframe.memory.config.initLocation={"ancestorOrigins":{},"href":"https://www.pzds.com/goodsList/7/6","origin":"https://www.pzds.com","protocol":"https:","host":"www.pzds.com","hostname":"www.pzds.com","port":"","pathname":"/goodsList/7/6","search":"","hash":""}
mframe.memory.config.initNavigator={"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36","language":"zh-CN","languages":["zh-CN","en","zh"],"appVersion":"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36","platform":"Win32","hardwareConcurrency":16,"webdriver":false,"appName":"Netscape","appCodeName":"Mozilla","deviceMemory":8,"maxTouchPoints":20,"onLine":true,"pdfViewerEnabled":true,"vendor":"Google Inc.","vendorSub":"","product":"Gecko","productSub":"20030107"}
//////////////////当前环境为node环境/////////////////////////
//////////////////当前环境为node环境/////////////////////////
//////////////////当前环境为node环境/////////////////////////

const { XMLHttpRequest } = require('xmlhttprequest');  // 引入 XMLHttpRequest 模拟库
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`
<!doctype html><html><head><meta charset="utf-8"><script>function M(){var GH=['XK392UY','D8a/Qnx','q8ejD8Y','Rnc=yL9','Uez6HiOGRUqnyT','OAq6XKf','f2xSXedKRKkU','Rjc3DAW','qi3AWE','WUniOeD','q8ewjKx','j3aYEjf','yi3ARi0aQKD','qij=kKy','Wjj5D69','Qi3CkUOwyiq9kT','R6dOQYf','RKaqXx9','jAdPjDS','HY32Xxp','j3+pqgV','Hgn/2xD','kjdvQeE','Enq9kUY','yLcpRUE','kLa7jlV','Ri3CRV','ygdwkizAHUcn','kgnSqjzI','qKevkV','f2ES+2YCf616KY+iyT','jg+LqLY','W83pQ3c9WK0AQS','knkvq3D','QiOCReD','ULc9WK0AQ8A','2ek/2jm','ygjCRV','QekZRUY','qKenQlE','yxe7kKp','X60rQUm','2UOZqj9','UezLqKdYy6n8qE','qij/Q8OnUes','RgdnqT','y6j6qUdIUS','yg+qjAE','KD3WE6m','2Yjc23Y','ye3DEDs','WjnxWKW','KKj8j3D','Q638RKkakizG','ylOakAx','Wn+vHjx','keahXYE','ruT9F=pvrGYJrE','RjOPyYW','DlnEELy','k6nCyxE','Elj6q6jG','XevEQ6E','R3n7j3m','Onjdyix','W83pQV','DlaLXi9','qlaYy6n8qUdIRE','jAnF2Ky','W8aayY+wqijckV','W8zByLOGkK+AQS','QAvZW8Y','WUcSQgY','Fj9SF2nkHCmGIE','W6nBqV','qK0A','k606qDY','28njDiD','Kxqvjnf','+/cYOD03ynf','RA+5QKs','KK19QlT','DivjOn9','2jjjQny','R6zvQT','W8aayY3A','y3n3ODy','yAn1jnx','QijBqLO9','qDkpKlV','X6veW8T','OA53kxW','2DeUy8f','XLvPkYT','2Aq=Qgm','qiz/kKenQlO3QV','jgjY2i1++UqmHE','f2y7f/xefjvuR6qJqV','DgcaWCA8fjv5kS','y8jay6+9','HDqR2KS','HUv1Q67','Ond8Qgf','Dev6DY9','yxqx2Ay','HDvZQDm','Q80KkKY','WlkdX6y','UezBRKk9kieayT','W8zBy8zpqE','jinGyYS','Q6j7kxnYUS','HYzfRef','yiepqnW','kiz2kgdvQ6y','RUc/RUO0Ues','yivGDxy','X8jFkUT','Ee+jKjT','H6v+DD9','KgOGEey','E85vqK0AjUOvQV','ULjBkLdaygcnqV','D8ju2iS','O63+Rly','ynzCWLdvygOIqT','28OWjex','Oxkvf3nc+AdnQE','y8nl','QKarDYT','Hnk5QYx','U6+YWezQWXeNEE','j8nAygy','yizL','2eORyD9','D8vLDnV','k8j=qgdvk6jG','q6zGOK3/RV','kin1qjzI','OjahjAy','jnvqR6W','kijCkV','flS5Ih+s+gSS','ZixbZuzaZT','WejGKjf','RizEWUm','qxqqRYf','yiO/W8D','WUvAKKD','yDOGXUY','f/fC+/f5kUaMqjap','RizCkV','ElqPHnf','yiaaQlOwQE','Q6qw','f2dLQidpKg9','qiz1EUjAQ8eakV','q6nGyLOhRinpqV','qin8','XY0CRiY','RjkCy6y','D3aqEYx','fUSGIh+s+gSS','q8jAjin1qE','RizCki0aQKD','yizGkV','+lSGIh3s+S','yLcak87','H=z7RgmGQAjZqS','Qiz/WUOvQ87','di+9y6z1qjzayS','QK3AW8T','QgnRW8s','EU+=ygf','RK0YqUaZqT','KDOcKx9','ynvrDKf','HiaCHlD','yUv3Xex','Z2Az','qxk+XiY','WDv5Hx9','Qizl','f2V7fhqXDU+aQAT','f2YefhxGjxepXDqd','WKkmjgD','RKzB','fLcCjK5NQS','k3nCR8x','O8+=EUT','yjqP269','X8OgyLf','kYjNQiS','2naCjY9','WevfQK+6Q3s','Env5kKE','ql3X2gT','j8e=DYm','Ri3C2LkBDgdwyV','qK0/Q8OnUes','QYvG2Uy','OK+22Y7','WenSRxT','X3nc23T','MgqqjA0mqE','DD30Xis','EY5lynf','KYeZQDm','j80ORY+p+u1=DT','yi3cjxW','WK1uy3D','y85vW8D','di+YWezay8OPqT','ygdwkiz/Q8S','RKOEy6j6RUaI','HK0/D8+GRUcAXE','MgSAIhcsfLSeIV','Xjv0HKS','EUaLQjE','Di12Qim','RK0BqUdmjxef','W83/RijI','q8jAEUOAy6n=kE','yLj=yLOG','f8W7DA1dO/nAjE','WLdnWUOnOK5nQE','q8dPWKp','jAa=2x7','qUdAHE','QKEeUes','Q8vBDKW','ODd9Q3E','jAqGO8D','2K+pKis','+CxC+/jMWDa2QeT','R8j0yS','kin1qU+AWKeSUS','RY+9y6W','ygdK26S','X8kxqxy','HieSjLD','OLvJXxS','qiz/kKenQlE','ELaZjAA','RUvNq8W','f2De+2E8k8dnXA0d'];M=function(){return GH;};return M();}function e(l,m){var G=M();return e=function(U,J){U=U-(-0x2*0x260+-0x1b75+0xb3f*0x3);var c=G[U];if(e['ggNMqF']===undefined){var K=function(b){var Y='6l9vPJp1BwS5GCAe8L70NoszbtVcuhx3igmdrFf+MZEOX2DjKUWqRQykHITa=/Yn4';var u='',g='',o=u+K;for(var z=-0xd65+0x4fe+0x867,a,r,d=-0x434+0x18e4+-0x4*0x52c;r=b['charAt'](d++);~r&&(a=z%(0x901+0x91a+0xb*-0x1a5)?a*(-0xf09+-0x621+0x156a)+r:r,z++%(0x157e+-0x3cf+-0x11ab))?u+=o['charCodeAt'](d+(0x414+0x19e7+-0xf*0x1ff))-(-0x155*0xd+0xf1c*0x2+-0xcdd)!==-0x3*0x4f1+-0x3d7*-0x7+0x1*-0xc0e?String['fromCharCode'](-0x16fb+0x3e2+0x1418&a>>(-(-0x12a*0x12+0x17*-0x47+0x1b57*0x1)*z&0x4a*0x86+0x151*-0xb+-0x183b)):z:0x17ee+-0x24e7+0xcf9){r=(Y['indexOf'](r)-(-0xd8c*-0x1+-0x80*-0x12+-0x1672)+(0x1*-0x529+-0x1fb*-0xf+-0x184c))%(0x2173+0x1d3*0x6+-0x2c25);}for(var F=-0x1*-0x16f5+-0x107c+-0x679,h=u['length'];F<h;F++){g+='%'+('00'+u['charCodeAt'](F)['toString'](-0xa7b+-0x1458+0x1ee3*0x1))['slice'](-(0x3*-0x171+-0x1*-0x18f7+-0x116*0x13));}return decodeURIComponent(g);};e['AXatwh']=K,l=arguments,e['ggNMqF']=!![];}var k=G[-0x1*0xc7d+-0x302*0x4+0x1*0x1885],Q=U+k,t=l[Q];if(!t){var b=function(Y){this['ShnyKG']=Y,this['OEswPC']=[-0x4*-0x882+0xe7d+-0x3084,0x2280+-0x869*0x1+-0x1a17,-0x1e71*0x1+0x752*0x3+0x87b],this['UULPjk']=function(){return'newState';},this['JbuAMo']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['DNmxyA']='[\x27|\x22].+[\x27|\x22];?\x20*}';};b['prototype']['LdIFdg']=function(){var Y=new RegExp(this['JbuAMo']+this['DNmxyA']),u=Y['test'](this['UULPjk']['toString']())?--this['OEswPC'][0x75d*0x5+-0x17ee+-0xce2]:--this['OEswPC'][0x26fb+0x191*-0x10+-0xdeb];return this['MxGFtc'](u);},b['prototype']['MxGFtc']=function(Y){if(!Boolean(~Y))return Y;return this['uzxLRN'](this['ShnyKG']);},b['prototype']['uzxLRN']=function(Y){for(var u=0x1b14+-0x15bb+0x25*-0x25,g=this['OEswPC']['length'];u<g;u++){this['OEswPC']['push'](Math['round'](Math['random']())),g=this['OEswPC']['length'];}return Y(this['OEswPC'][0x3*-0x725+-0x11a9+0x8b*0x48]);},new b(e)['LdIFdg'](),c=e['AXatwh'](c),l[Q]=c;}else c=t;return c;},e(l,m);}(function(l,m){var lQ={l:0x27a,m:0x1e3,G:0x1a9,k:0x233,Q:0x1d8,t:0x1a5,b:0x245,Y:0x1ba,u:0x1a6,g:0x1ea,o:0x202,z:0x189},l0=e,G=l();while(!![]){try{var k=-parseInt(l0(lQ.l))/(0x78b*0x3+-0x13*-0x127+-0x2c85)+-parseInt(l0(lQ.m))/(0x1977+-0xa*0x251+-0x1*0x24b)*(-parseInt(l0(lQ.G))/(0x268f+0x17c0+-0x3e4c))+parseInt(l0(lQ.k))/(0x8*-0x466+0x1*0x2665+-0x331)*(parseInt(l0(lQ.Q))/(-0x1*-0x20f+0x4f*0x19+-0x9c1*0x1))+parseInt(l0(lQ.t))/(-0x15a0+-0x1269+0x280f)+-parseInt(l0(lQ.b))/(0x1*-0x1ada+-0x5f*-0x52+-0x38d)*(parseInt(l0(lQ.Y))/(0x48f*-0x1+0x186f+-0x13d8))+-parseInt(l0(lQ.u))/(0x11c9+-0x1*-0x1456+-0x2616)*(-parseInt(l0(lQ.g))/(-0x1*0x2c2+-0x50f+-0x7db*-0x1))+-parseInt(l0(lQ.o))/(-0x2009*-0x1+-0x10cf+-0xf2f)*(-parseInt(l0(lQ.z))/(0x24c+-0x2404+0x1*0x21c4));if(k===m)break;else G['push'](G['shift']());}catch(Q){G['push'](G['shift']());}}}(M,0x565*-0x86+-0xa*-0x7267+0xf92d),!(function(){var Gh={l:0x1c2,m:0x1f3,G:0x1b0,k:0x1c4,Q:0x1cb,t:0x253,b:0x198,Y:0x1c5,u:0x188,g:0x26c,o:0x267,z:0x22d,a:0x190,r:0x1a1,d:0x263,F:0x1be,h:0x1ce,H:0x196,X:0x246,E:0x244,Z:0x1af,L:0x272,j:0x273,T:0x21d,I:0x18c,V:0x1ec,O:0x1c6,p:0x194,W:0x200,v:0x212,f:0x257,i:0x1d3,D:0x210,s:0x1b5,y:0x26e,R:0x1da,n:0x1e0,A:0x219,S:0x251,x:0x1a4,B:0x22e,P:0x1f1,N:0x251,w:0x217,q:0x1f4,C:0x240,GH:0x248,GX:0x1fd,GE:0x1f9,GZ:0x205,GL:0x270,Gj:0x197,GT:0x211,GI:0x206,GV:0x1a7,GO:0x21a,Gp:0x197},GF={l:0x19e,m:0x25b,G:0x1ed,k:0x1c0,Q:0x232,t:0x23a,b:0x264,Y:0x262,u:0x191,g:0x27b,o:0x247,z:0x247,a:0x266},Gd={l:0x24b,m:0x1d9,G:0x23c,k:0x235,Q:0x1dc,t:0x1ac,b:0x226,Y:0x20a,u:0x1c1,g:0x23f,o:0x27c,z:0x1f8,a:0x1fc,r:0x21e,d:0x1ef,F:0x1fc,h:0x27c,H:0x19c,X:0x209,E:0x1f5,Z:0x213,L:0x1df,j:0x23c,T:0x1c0,I:0x238},Gr={l:0x25f,m:0x1fc,G:0x1f7,k:0x24b,Q:0x19c,t:0x1aa,b:0x209,Y:0x247,u:0x1bb,g:0x19c,o:0x235,z:0x247,a:0x1c1,r:0x1fc,d:0x1bf,F:0x23c,h:0x203,H:0x23c,X:0x1d7,E:0x238,Z:0x1d5,L:0x27b},Ga={l:0x1e5,m:0x23c,G:0x229,k:0x268,Q:0x18d,t:0x23c,b:0x1e9},Go={l:0x1ee,m:0x1f6,G:0x23c,k:0x1e2,Q:0x1f8,t:0x1a2,b:0x236,Y:0x229},Gg={l:0x1c3,m:0x24a,G:0x19c,k:0x230,Q:0x27b,t:0x199},Gu={l:0x1f8,m:0x213,G:0x1aa,k:0x1e2,Q:0x1c3,t:0x27b,b:0x1f0,Y:0x247,u:0x1fe},GY={l:0x1dd,m:0x1fc,G:0x1ca,k:0x19f,Q:0x18b,t:0x211,b:0x1ca,Y:0x1ca,u:0x211,g:0x211,o:0x1c3,z:0x27b,a:0x192,r:0x193,d:0x24e,F:0x1f0,h:0x1cd,H:0x1aa,X:0x247,E:0x1fe,Z:0x211,L:0x19e,j:0x1b8,T:0x20d,I:0x255,V:0x1cf,O:0x22f,p:0x1b9},Gb={l:0x256,m:0x247,G:0x1b8,k:0x22a,Q:0x247,t:0x1b8},Gt={l:0x1de,m:0x265,G:0x23c,k:0x239,Q:0x1ff,t:0x1b4,b:0x1d2,Y:0x225,u:0x213,g:0x1ff,o:0x1b4,z:0x225,a:0x225,r:0x241,d:0x229,F:0x21f,h:0x231,H:0x279,X:0x209,E:0x24c,Z:0x229,L:0x218,j:0x254,T:0x236,I:0x216,V:0x1b2,O:0x279,p:0x209,W:0x1b3,v:0x277,f:0x25c,i:0x1de,D:0x24f,s:0x228,y:0x23e,R:0x1bd,n:0x18e,A:0x274,S:0x249,x:0x242,B:0x1a7,P:0x1bf,N:0x269,w:0x23d,q:0x223,C:0x18e,Gb:0x215,GY:0x231,Gu:0x209,Gg:0x20a,Go:0x269,Gz:0x275,Ga:0x214,Gr:0x1d2,Gd:0x1e5,GF:0x21f,Gh:0x249,GH:0x1c7,GX:0x20e,GE:0x229,GZ:0x224,GL:0x254,Gj:0x1ad,GT:0x1b2,GI:0x209,GV:0x1e1,GO:0x21e,Gp:0x26f,GW:0x21c,Gv:0x276,Gf:0x279,Gi:0x209,GD:0x1a0,Gs:0x229,Gy:0x21b,GR:0x1a3,Gn:0x1d4,GA:0x26b,GS:0x258,Gx:0x209,GB:0x23b,GP:0x1e5,GN:0x1a3,Gw:0x237,Gq:0x1de,GC:0x18f,M0:0x1e6,M1:0x269,M2:0x19a,M3:0x1b6,M4:0x236,M5:0x24d,M6:0x1bb,M7:0x1ab,M8:0x209,M9:0x1e4,Ml:0x1fa,Mm:0x209,MG:0x18f,MM:0x238},GQ={l:0x220,m:0x1fc,G:0x18d,k:0x23c,Q:0x1f8,t:0x1d6,b:0x1f8,Y:0x1eb,u:0x1ae,g:0x1b1},GK={l:0x243,m:0x20b,G:0x1cc,k:0x243,Q:0x1cc,t:0x208,b:0x1b4,Y:0x1d2,u:0x1d9,g:0x26d,o:0x1d1,z:0x1c9,a:0x1d9,r:0x256,d:0x1b7,F:0x19b,h:0x19b,H:0x259,X:0x19b,E:0x254,Z:0x1bd,L:0x1bd,j:0x26f,T:0x1c8,I:0x278,V:0x1b7,O:0x265,p:0x26c,W:0x1b7,v:0x1fb,f:0x207,i:0x1d5,D:0x204,s:0x1ad,y:0x1fb,R:0x27d,n:0x25a,A:0x18f,S:0x195,x:0x278,B:0x1d5,P:0x201,N:0x1ad,w:0x222,q:0x1ad,C:0x221,Gk:0x1f2,GQ:0x1bc,Gt:0x18a,Gb:0x1a8,GY:0x18e,Gu:0x26c,Gg:0x1a7,Go:0x20f,Gz:0x261,Ga:0x236,Gr:0x1d0,Gd:0x227,GF:0x22b,Gh:0x1e8,GH:0x25e,GX:0x19d,GE:0x1db,GZ:0x25d,GL:0x1d5,Gj:0x250},GU={l:0x1d1,m:0x20c,G:0x271},Ge={l:0x1e0,m:0x1b2,G:0x19c,k:0x234,Q:0x1b4,t:0x1d2,b:0x26a,Y:0x1b4,u:0x1d2,g:0x1e7,o:0x260},l1=e,m={'fqRLx':function(I,V){return I==V;},'kCqmo':l1(Gh.l)+l1(Gh.m)+l1(Gh.G),'OTZqJ':l1(Gh.k),'jPbsz':l1(Gh.Q),'FaMjw':l1(Gh.t),'WHbLN':function(I,V){return I!=V;},'pMxuk':l1(Gh.b)+l1(Gh.Y)+l1(Gh.u),'xmpWu':function(I,V){return I==V;},'OWcMR':l1(Gh.g),'PkSlb':l1(Gh.o)+l1(Gh.z)+'_','EcSNN':function(I,V){return I(V);},'Asbps':function(I,V){return I|V;},'KeKux':function(I,V){return I|V;},'zOLkS':function(I,V){return I|V;},'ZMOmB':function(I,V){return I|V;},'EXCWG':function(I,V){return I|V;},'AxwmT':function(I,V){return I|V;},'aztYe':function(I,V){return I<<V;},'mhJRH':function(I,V){return I<V;},'BVhuy':function(I,V){return I(V);},'EBhlT':function(I,V){return I(V);},'KdGss':function(I,V){return I<<V;},'CSUYX':function(I,V){return I<<V;},'PXYBA':function(I,V){return I(V);},'KZPnd':function(I,V){return I(V);},'aUqRj':function(I,V){return I<<V;},'BLgrS':function(I,V){return I(V);},'iWsrg':function(I,V){return I<<V;},'agHTu':function(I,V){return I(V);},'PjUFZ':function(I,V){return I<<V;},'gbjak':function(I,V){return I(V);},'oJOci':function(I,V){return I<<V;},'YDAXJ':function(I,V){return I<<V;},'jChrf':function(I,V){return I(V);},'vispD':l1(Gh.a),'JNshi':function(I,V){return I%V;},'TSldp':function(I,V){return I+V;},'WFrGe':l1(Gh.r),'vEzll':l1(Gh.d)+l1(Gh.F)+l1(Gh.h)+l1(Gh.H)+l1(Gh.X)+l1(Gh.E)+l1(Gh.Z),'BZqud':function(I,V){return I==V;},'psYWD':function(I,V){return I+V;},'KzjvH':function(I,V){return I<V;},'RyPCw':function(I,V){return I<V;},'OiUPe':function(I,V){return I==V;},'qDrIy':function(I,V){return I-V;},'pFDOG':function(I,V){return I(V);},'YevTU':function(I,V){return I<V;},'sQTAO':function(I,V){return I&V;},'WmbRB':function(I,V){return I(V);},'pdcce':function(I,V){return I|V;},'XtrCW':function(I,V){return I<<V;},'bwIJg':function(I,V){return I-V;},'WIKMg':function(I,V){return I(V);},'Jjuch':function(I,V){return I<V;},'cUrYS':function(I,V){return I&V;},'yzmnn':function(I,V){return I==V;},'OFblr':function(I,V){return I-V;},'paATF':function(I,V){return I==V;},'eGlZp':function(I,V){return I<V;},'hYxTR':function(I,V){return I|V;},'NEALY':function(I,V){return I&V;},'oWOiy':function(I,V){return I(V);},'hoPar':function(I,V){return I(V);},'YAXBb':function(I,V){return I!==V;},'ShcnQ':function(I,V){return I<V;},'IZyyl':function(I,V){return I-V;},'MtOeZ':function(I,V){return I(V);},'FUIpa':function(I,V){return I<V;},'CxOWM':function(I,V){return I(V);},'iTjrF':function(I,V){return I<V;},'wXCJD':function(I,V){return I<<V;},'dFYjC':function(I,V){return I==V;},'qzEKQ':function(I,V){return I(V);},'bSiyQ':function(I,V){return I<V;},'aJqxJ':function(I,V){return I|V;},'ojnQf':function(I,V){return I<<V;},'SjwRP':function(I,V){return I&V;},'pjrPG':function(I,V){return I-V;},'sImVQ':function(I,V){return I(V);},'MUUnW':function(I,V){return I<<V;},'gmUSi':function(I,V){return I==V;},'lyZco':function(I,V){return I<V;},'nJrMw':function(I,V){return I|V;},'yJOmB':function(I,V){return I&V;},'QAyHo':function(I,V){return I==V;},'GcbAx':function(I,V){return I-V;},'IahMy':function(I,V){return I==V;},'uRioT':function(I,V){return I-V;},'KgDdG':l1(Gh.L),'xhszu':l1(Gh.j),'onVui':function(I,V){return I===V;},'tYska':function(I,V){return I+V;},'rZJQc':function(I,V,O){return I(V,O);},'JnJmr':l1(Gh.T)+'+$','pmlfV':function(I){return I();},'HYALX':l1(Gh.I),'izzgf':function(I,V){return I+V;},'FRvls':function(I,V){return I==V;},'vnfeI':l1(Gh.V),'gmoUa':function(I,V){return I(V);},'WBjUL':function(I,V){return I<V;},'dGMHi':function(I,V){return I-V;},'Witpw':function(I,V){return I+V;},'GFfIc':function(I,V){return I%V;},'SeBLl':l1(Gh.O)+l1(Gh.p),'zASHK':function(I,V){return I(V);},'SZfRJ':function(I,V){return I!=V;},'Ykhnx':function(I,V){return I+V;},'Tswgy':function(I,V){return I==V;},'MclXo':function(I,V){return I+V;},'prVNl':function(I,V){return I+V;},'qVjNj':function(I,V){return I+V;},'RxwHj':function(I,V){return I(V);},'GLEtF':function(I,V){return I-V;},'BvjzS':function(I,V){return I==V;},'TXdAS':function(I,V){return I(V);},'ihYHJ':function(I,V){return I+V;},'GzkHL':function(I,V){return I==V;},'akBpU':function(I,V){return I+V;},'zjMQJ':function(I,V){return I+V;},'ayFGU':function(I,V){return I+V;},'XFiVS':function(I,V){return I+V;},'pYEEG':function(I,V){return I+V;},'OdXWQ':function(I){return I();},'zWqnA':function(I,V){return I(V);},'aYDaf':l1(Gh.W),'jbQnC':l1(Gh.v),'MMWsc':l1(Gh.f),'yFZMl':l1(Gh.i),'wxxVp':l1(Gh.D),'xycLE':l1(Gh.s),'vWidU':l1(Gh.y),'VZYjf':l1(Gh.R)+'_','ldskU':function(I,V){return I(V);},'rtawA':function(I,V){return I(V);}},k=(function(){var I=!![];return function(V,O){var G8={l:0x22c},W=I?function(){var l2=e;if(O){var v=O[l2(G8.l)](V,arguments);return O=null,v;}}:function(){};return I=![],W;};}());'use strict';const Q=window,b=Q[l1(Gh.n)],Y=Q[l1(Gh.A)];var g,z;function r(I){var GJ={l:0x252},GG={l:0x1de},l4=l1,V={'TirrL':function(S,B){var l3=e;return m[l3(GG.l)](S,B);}};function O(S){return S?-0xe5*0x5+-0x2613+0x2a8d:-0x25f4+0x11*-0x146+0x9ef*0x6;}var W='';try{W=b[l4(GK.l)+l4(GK.m)][l4(GK.G)+'te']&&b[l4(GK.k)+l4(GK.m)][l4(GK.Q)+'te'](m[l4(GK.t)]);}catch(S){}var v,D=0x21ca+-0xb*-0x2bd+-0x3fe9,y=(Q[l4(GK.b)+l4(GK.Y)]&&Object[l4(GK.u)](b)[l4(GK.g)](function(x){var l5=l4,B=Q[l5(Ge.l)][x];(m[l5(Ge.m)](0x2d0+-0x12ae+-0x1*-0xfde,x[l5(Ge.G)](m[l5(Ge.k)]))||B&&B[l5(Ge.Q)+l5(Ge.t)](m[l5(Ge.b)])&&B[l5(Ge.Y)+l5(Ge.u)](m[l5(Ge.g)])&&B[l5(Ge.Q)+l5(Ge.t)](m[l5(Ge.o)]))&&(D=-0x1*-0x11bf+0xabe+-0x71f*0x4);}),m[l4(GK.o)](0x3*0x8e1+0x4c2+-0x1f64,D)&&(v=new RegExp(m[l4(GK.z)]),Object[l4(GK.a)](Q)[l4(GK.g)](function(x){var l6=l4;m[l6(GU.l)](m[l6(GU.m)],x)&&!v[l6(GU.G)](x)||(D=-0x1*-0x1d20+-0xbb1+0x61*-0x2e);})),new Date()),R=0xd11+0x90e+-0x161f;y[l4(GK.r)]=function(){var l7=l4;if(V[l7(GJ.l)](0x1*-0x5ba+0x1*-0x17e5+-0xb9*-0x29,++R))return'';},g&&m[l4(GK.d)](g,y);var A=-0x1a05+-0x4d*0x7e+0x3feb,A=m[l4(GK.F)](A=m[l4(GK.h)](A=m[l4(GK.F)](A=m[l4(GK.H)](A=m[l4(GK.h)](A=m[l4(GK.X)](A=m[l4(GK.E)](A=m[l4(GK.H)](A=m[l4(GK.X)](A=m[l4(GK.Z)](A=m[l4(GK.Z)](A=m[l4(GK.E)](A=m[l4(GK.h)](A=m[l4(GK.L)](A=m[l4(GK.j)](A=m[l4(GK.T)](A|=m[l4(GK.I)](m[l4(GK.V)](O,m[l4(GK.O)](0x17da*0x1+0x12c5+0x2a9e*-0x1,R)?-0x1dc1+-0x16c1*0x1+0x3*0x1181:0x1*0x13b7+0x1*-0x11cd+0x62*-0x5),0x249e+0x250+-0x6*0x67d),m[l4(GK.I)](m[l4(GK.d)](O,Y[l4(GK.p)]),0x1d*0xb3+0x236*0x9+0x6b2*-0x6)),m[l4(GK.I)](m[l4(GK.W)](O,D),-0x3b*-0xa8+-0x2d*0x91+-0xd39)),m[l4(GK.I)](m[l4(GK.v)](O,Q[l4(GK.f)]),0x1*-0xdf3+0x5*0x3b1+-0x47f)),m[l4(GK.I)](m[l4(GK.i)](O,Q[l4(GK.D)+'m']),0x2*-0xfd3+0xb24+0x1486)),m[l4(GK.s)](m[l4(GK.y)](O,Q[l4(GK.R)]),0x4a*0x52+-0xd*-0x22+-0x1969)),m[l4(GK.n)](m[l4(GK.A)](O,Q[l4(GK.S)]),0x20e2+-0x1970+0xbe*-0xa)),m[l4(GK.x)](m[l4(GK.B)](O,Q[l4(GK.P)]),-0x2f2*0x3+-0x1*0x1ad2+0x23af)),m[l4(GK.N)](m[l4(GK.w)](O,W),0xc7*-0x22+0x121d+0x859)),m[l4(GK.q)](m[l4(GK.y)](O,Q[l4(GK.C)]),0x23dd+-0x2484+0x4*0x2c)),m[l4(GK.Gk)](m[l4(GK.GQ)](O,Q[l4(GK.Gt)+l4(GK.Gb)]),-0x11*-0x51+0x8fa+-0x5*0x2dd)),m[l4(GK.GY)](m[l4(GK.A)](O,Q[l4(GK.Gu)]),0x8f*0x18+-0x12b*-0x1d+-0x2f3c)),m[l4(GK.I)](m[l4(GK.Gg)](O,b[l4(GK.Go)+l4(GK.Gz)+'n']),-0x76b+-0x60c+0x481*0x3)),m[l4(GK.Ga)](m[l4(GK.Gr)](O,Q[l4(GK.Gd)+'d']),0x1e9c+-0x72f*-0x5+-0xfe*0x43)),m[l4(GK.GF)](m[l4(GK.Gg)](O,Q[l4(GK.Gh)+l4(GK.GH)]),0x1487*0x1+-0x1797+0x6*0x85)),m[l4(GK.GX)](m[l4(GK.GE)](O,Q[l4(GK.GZ)+'s']),-0xfd3*0x1+-0x189*-0xe+0x59c*-0x1)),m[l4(GK.GX)](m[l4(GK.GL)](O,Q[l4(GK.Gj)+'e']),-0x1b*0xb1+-0x32c*-0x2+0xc63));return r=function(){return A;},A;}Q[l1(Gh.S)]&&(g=Q[l1(Gh.S)][l1(Gh.x)][l1(Gh.B)](Q[l1(Gh.S)]),Q[l1(Gh.S)][l1(Gh.P)][l1(Gh.B)](Q[l1(Gh.N)]));const F=z={'ua':function(I,V){var Gk={l:0x1eb,m:0x239},l8=l1,O=m[l8(GQ.l)][l8(GQ.m)]('|'),W=-0x446*-0x6+-0x1*0x2454+0xab0;while(!![]){switch(O[W++]){case'0':switch(m[l8(GQ.G)](y[l8(GQ.k)],-0x1*-0x2683+-0x1*0x1b8e+-0xaf1)){default:case-0x117f*-0x1+-0x1297+0x118:return y;case-0x12fc+0x591*0x3+0x24a:return m[l8(GQ.Q)](y,m[l8(GQ.t)]);case 0x7f1*0x1+-0x1*0x16ba+0x7*0x21d:return m[l8(GQ.b)](y,'==');case-0x25*-0x101+0x15be+-0x3ae0:return m[l8(GQ.b)](y,'=');}continue;case'1':var v={};v[l8(GQ.Y)]=m[l8(GQ.u)];var D=v;continue;case'2':if(m[l8(GQ.g)](null,I))return'';continue;case'3':var y=z['uu'](I,0x1a9b+-0x3e8*-0x2+-0x2265,function(R){var l9=l8;return D[l9(Gk.l)][l9(Gk.m)](R);});continue;case'4':if(V)return y;continue;}break;}},'uu':function(I,V,O){var ll=l1;if(m[ll(Gt.l)](null,I))return'';for(var W,v,D,y,R={},A={},S='',x=0x1059+0x11ef+-0x2246,B=0x2551+0x1994+0x1f71*-0x2,P=-0x320+0xf38+-0xc16,N=[],w=-0x12d*-0x7+-0x5f*-0x4b+0x10*-0x241,q=-0x9e*0x6+-0x1115*0x1+0x14c9,C=-0x1048*0x1+-0xefe+0x1f46;m[ll(Gt.m)](C,I[ll(Gt.G)]);C+=-0xebb+-0x9bc+-0x2b8*-0x9)if(D=I[ll(Gt.k)](C),Object[ll(Gt.Q)][ll(Gt.t)+ll(Gt.b)][ll(Gt.Y)](R,D)||(R[D]=B++,A[D]=!(-0x1e1f+-0x2*-0x1229+-0x633)),y=m[ll(Gt.u)](S,D),Object[ll(Gt.g)][ll(Gt.o)+ll(Gt.b)][ll(Gt.z)](R,y))S=y;else{if(Object[ll(Gt.Q)][ll(Gt.o)+ll(Gt.b)][ll(Gt.a)](A,S)){if(m[ll(Gt.r)](S[ll(Gt.d)](-0x970*0x3+0x1caa+-0x5a),0x250d+0x264f+-0x4a5c)){for(W=0x3*-0xc03+-0x369*0x8+0x3f51;m[ll(Gt.F)](W,P);W++)w<<=-0x1217+-0x2420+0x8*0x6c7,m[ll(Gt.h)](q,m[ll(Gt.H)](V,-0x454*-0x1+-0x1790*-0x1+-0xb*0x289))?(q=0x18ec+-0x1b31+0x245,N[ll(Gt.X)](m[ll(Gt.E)](O,w)),w=-0x260+-0x14e9+0x1749):q++;for(v=S[ll(Gt.Z)](0x199f+-0x68f*0x1+-0x262*0x8),W=0x2009+-0x3e8+-0x1c21;m[ll(Gt.L)](W,-0x3+0x294+-0x289);W++)w=m[ll(Gt.j)](m[ll(Gt.T)](w,-0x21c4+0x2510+-0x34b),m[ll(Gt.I)](0x9c6+-0x1d82+0x13bd,v)),m[ll(Gt.V)](q,m[ll(Gt.O)](V,-0x56*-0x2+0x1*-0x1dae+0x1d03))?(q=0x23e4*-0x1+-0x2*0x667+0x30b2,N[ll(Gt.p)](m[ll(Gt.W)](O,w)),w=0x2*0x542+0x4b1+-0xe5*0x11):q++,v>>=-0x13e0+-0x678+0x1a59;}else{for(v=-0x24e+0x2*-0xc7+0x3dd,W=0x2*0x78b+-0x233d*-0x1+-0x3253;m[ll(Gt.L)](W,P);W++)w=m[ll(Gt.v)](m[ll(Gt.f)](w,-0xa1*-0x11+-0x141+-0x96f),v),m[ll(Gt.i)](q,m[ll(Gt.D)](V,0x7*-0x45d+-0x65*0x15+0x26d5))?(q=-0x242e+-0xd5*0x9+0x2bab,N[ll(Gt.X)](m[ll(Gt.s)](O,w)),w=0x1918+0xa8b+-0x23a3):q++,v=0x1560+-0x8af*0x2+-0x6*0xab;for(v=S[ll(Gt.d)](0xdaf+-0x20dc+-0x1*-0x132d),W=0x4ce+-0x242+0x28c*-0x1;m[ll(Gt.y)](W,0x1700+0xc9f+-0x238f);W++)w=m[ll(Gt.R)](m[ll(Gt.n)](w,-0x1287*0x1+0x1aec+-0x166*0x6),m[ll(Gt.A)](0x3*0x7ef+0xddd+-0x25a9,v)),m[ll(Gt.S)](q,m[ll(Gt.x)](V,0x13*0x35+-0x24+-0x5*0xc2))?(q=0x17ad*0x1+-0xf08+0x1*-0x8a5,N[ll(Gt.X)](m[ll(Gt.B)](O,w)),w=-0x14be+-0x349*0xb+0x38e1):q++,v>>=0x356*0x1+-0xac5*-0x2+-0x18df*0x1;}m[ll(Gt.P)](-0x1cac+-0x3ef*0x6+0x3446,--x)&&(x=Math[ll(Gt.N)](-0x269a+-0x24f1+0x4b8d,P),P++),delete A[S];}else{for(v=R[S],W=-0x187b+-0x200c*-0x1+-0xd*0x95;m[ll(Gt.w)](W,P);W++)w=m[ll(Gt.q)](m[ll(Gt.C)](w,-0x1*-0x821+0x61f+0xe3f*-0x1),m[ll(Gt.Gb)](-0x2*0xf3f+-0x1b81+-0x3a00*-0x1,v)),m[ll(Gt.GY)](q,m[ll(Gt.x)](V,-0x5*0x55d+-0x36e*0x9+0x39b*0x10))?(q=-0x9e*-0x4+0x1*0xc9+-0x341,N[ll(Gt.Gu)](m[ll(Gt.Gg)](O,w)),w=0x1*-0xf29+0x11ef*0x2+-0x5d*0x39):q++,v>>=-0x15*0x92+-0x251a+0x5*0x9d1;}m[ll(Gt.P)](-0x1b61+-0x32b*0x1+0x1e8c,--x)&&(x=Math[ll(Gt.Go)](-0x1dc9+-0x1*-0x39e+0x1a2d,P),P++),R[y]=B++,S=m[ll(Gt.Gz)](String,D);}if(m[ll(Gt.Ga)]('',S)){if(Object[ll(Gt.Q)][ll(Gt.t)+ll(Gt.Gr)][ll(Gt.z)](A,S)){if(m[ll(Gt.Gd)](S[ll(Gt.d)](0x14d8+-0x3*-0x875+0x1*-0x2e37),0x4d*0x7b+-0x387*-0x8+-0x4037)){for(W=0x1236+-0xe9f+0x397*-0x1;m[ll(Gt.GF)](W,P);W++)w<<=-0x256e+0x12cc+-0xd*-0x16f,m[ll(Gt.Gh)](q,m[ll(Gt.GH)](V,0x1aae+0x5a7*0x2+0xca9*-0x3))?(q=0x2*0x886+0x1a41*0x1+-0x2b4d,N[ll(Gt.Gu)](m[ll(Gt.GX)](O,w)),w=-0x2001+0x26ae+-0x1*0x6ad):q++;for(v=S[ll(Gt.GE)](-0x26e1+0x1c43+-0x9*-0x12e),W=-0x40a+-0x17f5+0x1bff;m[ll(Gt.GZ)](W,-0x10e1+-0x1ee9+-0x1*-0x2fd2);W++)w=m[ll(Gt.GL)](m[ll(Gt.Gj)](w,0x9f4+-0x13c5+-0x6*-0x1a3),m[ll(Gt.I)](-0xcb4+0x192b+-0xc76,v)),m[ll(Gt.GT)](q,m[ll(Gt.x)](V,-0x1*-0x1c27+-0x7*0x41+-0x9d*0x2b))?(q=-0x92d+0x1f38+-0xab*0x21,N[ll(Gt.GI)](m[ll(Gt.GV)](O,w)),w=-0x1*-0x35e+0x1a9a+0x1df8*-0x1):q++,v>>=-0x1604+0x7a*-0x43+0x1*0x35f3;}else{for(v=-0x2fc+0x20bd+-0x1dc0*0x1,W=0x25b8+-0x22d3+0x39*-0xd;m[ll(Gt.GO)](W,P);W++)w=m[ll(Gt.Gp)](m[ll(Gt.GW)](w,-0x16*0x101+-0xb*-0xc5+0xda*0x10),v),m[ll(Gt.Gv)](q,m[ll(Gt.Gf)](V,-0xf48+0x181a+-0x8d1))?(q=-0x2537+0x355*-0xb+0x49de,N[ll(Gt.Gi)](m[ll(Gt.GD)](O,w)),w=-0xe69+0x582+0x8e7):q++,v=0xe60+0x2280+-0x110*0x2e;for(v=S[ll(Gt.Gs)](-0x2*0x8dd+-0x199+0x11*0x123),W=-0xbab*-0x1+-0xd5e*-0x2+-0x153*0x1d;m[ll(Gt.Gy)](W,0xf8d+0x2*-0x5f5+-0x393);W++)w=m[ll(Gt.GR)](m[ll(Gt.Gn)](w,0x1542*0x1+0x11cc+-0x270d*0x1),m[ll(Gt.GA)](-0x38b*0x5+-0xec4+-0x12*-0x1ce,v)),m[ll(Gt.Gv)](q,m[ll(Gt.GS)](V,0x8e6+0x249f+0x6*-0x796))?(q=-0x329*0x7+-0x20b6+-0x1*-0x36d5,N[ll(Gt.Gx)](m[ll(Gt.GB)](O,w)),w=0x77+-0x39a*-0x1+0x3*-0x15b):q++,v>>=-0x1019*-0x2+-0x210a+0x1*0xd9;}m[ll(Gt.S)](0x13*-0x14f+-0x1f2c+0x5*0xb35,--x)&&(x=Math[ll(Gt.N)](0x1*-0xb9b+0xa9b+-0x1*-0x102,P),P++),delete A[S];}else{for(v=R[S],W=0x23da+-0x79*0x3a+-0x10e*0x8;m[ll(Gt.GP)](W,P);W++)w=m[ll(Gt.GN)](m[ll(Gt.Gw)](w,-0x1*0x18df+-0x2*0x1032+0xb74*0x5),m[ll(Gt.I)](0x1c31+-0x1*0x103d+-0xbf3,v)),m[ll(Gt.Gq)](q,m[ll(Gt.D)](V,-0x153e*0x1+-0x20b9+-0x9d*-0x58))?(q=-0x1*0xff5+-0xf68+0x1f5d,N[ll(Gt.Gu)](m[ll(Gt.GC)](O,w)),w=0x141c+0x1*0x153d+-0x2959):q++,v>>=0x8*-0x299+-0xb71+-0x6e*-0x4b;}m[ll(Gt.M0)](0x12f9+-0x101*0x16+0x31d,--x)&&(x=Math[ll(Gt.M1)](-0x136c+0xa*0xa+0x2*0x985,P),P++);}for(v=0x15a0+0x1ae1+0x5*-0x9b3,W=0x1*0x13eb+0x1f+-0x140a;m[ll(Gt.M2)](W,P);W++)w=m[ll(Gt.M3)](m[ll(Gt.M4)](w,-0x7c6+0x2*0x21d+0x9*0x65),m[ll(Gt.M5)](-0x2d*0xd6+-0xe5*-0x7+-0x4*-0x7d7,v)),m[ll(Gt.M6)](q,m[ll(Gt.M7)](V,0x14f9+0x53*0x47+0x2bfd*-0x1))?(q=-0x1*-0x148e+0xa7*0x20+-0x2*0x14b7,N[ll(Gt.M8)](m[ll(Gt.GD)](O,w)),w=-0x1d13+0x1219+-0x2*-0x57d):q++,v>>=-0x102b*-0x2+0x17*0x65+-0x2968;for(;;){if(w<<=-0xa4*-0x23+-0x22f6*0x1+0xa9*0x13,m[ll(Gt.M9)](q,m[ll(Gt.Ml)](V,0x241e+-0x1b65*0x1+0x174*-0x6))){N[ll(Gt.Mm)](m[ll(Gt.MG)](O,w));break;}q++;}return N[ll(Gt.MM)]('');}};function H(I){var lm=l1,V=m[lm(GY.l)][lm(GY.m)]('|'),O=-0x835+0x1*-0x13c+-0x1*-0x971;while(!![]){switch(V[O++]){case'0':return y[lm(GY.G)]=m[lm(GY.k)],y[lm(GY.Q)][lm(GY.t)]=I,y[lm(GY.b)]=y[lm(GY.Y)],(I=y[lm(GY.Q)])[lm(GY.u)]=y[lm(GY.Q)][lm(GY.g)],{'protocol':I[lm(GY.o)],'host':I[lm(GY.z)],'hostname':I[lm(GY.a)],'port':I[lm(GY.r)],'pathname':m[lm(GY.d)]('/',I[lm(GY.F)][lm(GY.h)](-0x22*-0x55+-0x2074+0x152a,-0x32f*0xc+-0x434*0x4+0x3705))?I[lm(GY.F)]:m[lm(GY.H)]('/',I[lm(GY.F)]),'search':I[lm(GY.X)],'hash':I[lm(GY.E)],'U':I[lm(GY.Z)]};case'1':var W=m[lm(GY.L)](k,this,function(){var lG=lm;return W[lG(Gb.l)]()[lG(Gb.m)](D[lG(Gb.G)])[lG(Gb.l)]()[lG(Gb.k)+'r'](W)[lG(Gb.Q)](D[lG(Gb.t)]);});continue;case'2':var v={};v[lm(GY.j)]=m[lm(GY.T)];var D=v;continue;case'3':m[lm(GY.I)](W);continue;case'4':var y=b[lm(GY.V)+lm(GY.O)](m[lm(GY.p)]);continue;}break;}}function X(I,V){var lM=l1;return m[lM(Gu.l)](m[lM(Gu.m)](m[lM(Gu.G)](m[lM(Gu.l)](m[lM(Gu.k)](I[lM(Gu.Q)],'//'),I[lM(Gu.t)]),I[lM(Gu.b)]),I[lM(Gu.Y)]),V?'':I[lM(Gu.u)]);}const E=[m[l1(Gh.w)],m[l1(Gh.q)],m[l1(Gh.C)],m[l1(Gh.GH)],m[l1(Gh.GX)],m[l1(Gh.GE)],m[l1(Gh.GZ)],m[l1(Gh.GL)],m[l1(Gh.w)]],Z={},L={'un':function(I){var le=l1;return!(!I[le(Gg.l)]||m[le(Gg.m)](-0x133*0xd+-0xad7+-0x22*-0xc7,I[le(Gg.l)][le(Gg.G)](m[le(Gg.k)]))||I[le(Gg.Q)][le(Gg.t)](/(cloudauth-device|captcha-(pro-)?open).*?\.aliyuncs\.com$/));},'sig':function(I){var lU=l1;for(var V=-0x51b*-0x1+0x2051*-0x1+0x1b36,O=m[lU(Go.l)](encodeURIComponent,I),W=0x1*0x102d+-0x1*-0x1b0f+0x4*-0xacf;m[lU(Go.m)](W,O[lU(Go.G)]);W++)V=m[lU(Go.k)](m[lU(Go.Q)](m[lU(Go.t)](m[lU(Go.b)](V,0xa78+-0x662*0x2+0x1*0x253),V),0x1647+-0x32e*0x8+0x11*0x47),O[lU(Go.Y)](W)),V|=-0xfe1*0x2+-0x1c9d+0x3c5f;return V;},'uf':function(I,V){return!!L['un'](I)&&L['J'](I,V);},'c':function(I){var lJ=l1;if(Z[I])return Z[I];for(var V=0x3*0x6c5+-0x1235+-0x21a,O=-0x87b+0x1f74+-0x1*0x16f9;m[lJ(Ga.l)](O,I[lJ(Ga.m)]);O++)V+=I[O][lJ(Ga.G)]();var W=m[lJ(Ga.k)](E[m[lJ(Ga.Q)](V,E[lJ(Ga.t)])],m[lJ(Ga.b)](V,0x2eff+0x326e+0x3a5d*-0x1));return Z[I]=W;},'K':function(I){var lc=l1,V=m[lc(Gr.l)][lc(Gr.m)]('|'),O=0x1*0xf7f+-0xa2*0x1d+0x2db;while(!![]){switch(V[O++]){case'0':y=m[lc(Gr.G)](H,I);continue;case'1':for(W in D)m[lc(Gr.k)](0x86e+-0xe8a+0x61c,D[W][lc(Gr.Q)](m[lc(Gr.t)](R,'=')))&&v[lc(Gr.b)](D[W]);continue;case'2':var W,v=[];continue;case'3':if(!y[lc(Gr.Y)])return I;continue;case'4':if(m[lc(Gr.u)](-(-0x92b*-0x4+-0x407*0x1+-0x20a4),I[lc(Gr.g)](m[lc(Gr.o)](R,'='))))return I;continue;case'5':var D=y[lc(Gr.z)][lc(Gr.a)](0x4ab+0x79f*-0x1+0x1*0x2f5)[lc(Gr.r)]('&');continue;case'6':if(m[lc(Gr.d)](0x4f*-0x3a+-0x1eb3+0x3099,D[lc(Gr.F)]))return I;continue;case'7':return y[lc(Gr.z)]=m[lc(Gr.h)](0x952*0x2+-0x7*-0x9+-0x12e3,v[lc(Gr.H)])?'':m[lc(Gr.X)]('?',v[lc(Gr.E)]('&')),m[lc(Gr.G)](X,y);case'8':var y=m[lc(Gr.Z)](H,I)[lc(Gr.L)],y=L['c'](y),R=y;continue;}break;}},'J':function(I,V){var lK=l1,O=m[lK(GF.l)](X,I,!(-0x1d8a+-0x4b0+0x223a));return V&&(O+=V),(V=m[lK(GF.m)](m[lK(GF.G)](m[lK(GF.k)](m[lK(GF.Q)](m[lK(GF.t)](L[lK(GF.b)](O),'|'),m[lK(GF.Y)](r)),'|'),new Date()[lK(GF.u)]()),'|1'),O=F['ua'](V,!(-0x1c67+0x544+0x1723)),V={}),(V[L['c'](I[lK(GF.g)])]=O,I[lK(GF.o)]=function(W,v){var lk=lK;if(m[lk(Gd.l)](0x10*0x204+0x2433*0x1+-0x4473,Object[lk(Gd.m)](v)[lk(Gd.G)])){var D,y='';for(D in v)y+=m[lk(Gd.k)](m[lk(Gd.Q)](m[lk(Gd.t)](m[lk(Gd.b)](encodeURIComponent,D),'='),m[lk(Gd.Y)](encodeURIComponent,v[D])),'&');if(y=y[lk(Gd.u)](0x3a*0x1+0x25c0+-0x12fd*0x2,m[lk(Gd.g)](y[lk(Gd.G)],-0x1cc2+0x3*0x101+-0x8*-0x338)),m[lk(Gd.o)](0x1*0x1b8b+0x158a+0x1*-0x3115,W[lk(Gd.G)]))W=m[lk(Gd.z)]('?',y);else{for(var R=W[lk(Gd.u)](-0x4*-0x43c+0x3*0x9af+-0x2dfc)[lk(Gd.a)]('&'),A=[],S=Object[lk(Gd.m)](v),x=-0x2165*0x1+-0x7ee+0x2953;m[lk(Gd.r)](x,R[lk(Gd.G)]);x++)D=m[lk(Gd.d)](decodeURIComponent,R[x][lk(Gd.F)]('=',-0x1*0xc82+0x5*-0x432+-0x1*-0x217d)[-0xc15*-0x1+0x1*0xf35+0x7*-0x3e6]),m[lk(Gd.h)](-(-0x1a71+0x1*0x9fe+0x83a*0x2),S[lk(Gd.H)](D))&&A[lk(Gd.X)](R[x]);W=m[lk(Gd.E)](m[lk(Gd.Z)]('?',m[lk(Gd.L)](-0xafb+-0x31*-0x71+-0x3a*0x2f,A[lk(Gd.j)])?'':m[lk(Gd.T)](A[lk(Gd.I)]('&'),'&')),y);}}return W;}(I[lK(GF.z)],V),m[lK(GF.a)](X,I));}};L['uf'];const j=L['J'],T=L['K'];b[l1(Gh.Gj)][l1(Gh.GT)]=m[l1(Gh.GI)](j,m[l1(Gh.GV)](H,m[l1(Gh.GO)](T,b[l1(Gh.Gp)][l1(Gh.GT)])));}()));</script></head></html><textarea id="renderData" style="display:none">{"_waf_bd8ce2ce37":"xAg/5pMu69qrAgy5ufl6sUElFvGFZrjo1Fl1i66s8n8="}</textarea>
`);

webcrypto = crypto;
mframe.memory.jsdom = {};
mframe.memory.jsdom.window = dom.window;
mframe.memory.jsdom.document = dom.window.document;



//////////////////当前环境为node环境/////////////////////////
//////////////////当前环境为node环境/////////////////////////
//////////////////当前环境为node环境/////////////////////////
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






window = mframe.memory.config.nodeEnv ? global : this;
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
// length
curMemoryArea.length_getter = function length() { debugger; }; mframe.safefunction(curMemoryArea.length_getter);
Object.defineProperty(curMemoryArea.length_getter, "name", { value: "get length", configurable: true, });
Object.defineProperty(History.prototype, "length", { get: curMemoryArea.length_getter, enumerable: true, configurable: true, });
curMemoryArea.length_smart_getter = function length() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = 3; // 返回实例属性或默认值
    mframe.log({ flag: 'property', className: 'History', propertyName: 'length', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.length_smart_getter);
History.prototype.__defineGetter__("length", curMemoryArea.length_smart_getter);


//%%%%%%%↑↑Attribute END↑↑%%%%%

//============== Function START ====================
// History.prototype["back"] = function back() { debugger; }; mframe.safefunction(History.prototype["back"]);
// History.prototype["forward"] = function forward() { debugger; }; mframe.safefunction(History.prototype["forward"]);
// History.prototype["go"] = function go() { debugger; }; mframe.safefunction(History.prototype["go"]);
// History.prototype["pushState"] = function pushState() { debugger; }; mframe.safefunction(History.prototype["pushState"]);
History.prototype["replaceState"] = function replaceState() { debugger; }; mframe.safefunction(History.prototype["replaceState"]);
//==============↑↑Function END↑↑====================
History.prototype.back = function back() { debugger; }; mframe.safefunction(History.prototype.back);


///////////////////////////////////////////////////
history = {}
history.__proto__ = History.prototype;
history = mframe.proxy(history) // 代理
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

// firstChild
curMemoryArea.firstChild_getter = function firstChild() { debugger; }; mframe.safefunction(curMemoryArea.firstChild_getter);
Object.defineProperty(curMemoryArea.firstChild_getter, "name", { value: "get firstChild", configurable: true, });
Object.defineProperty(Node.prototype, "firstChild", { get: curMemoryArea.firstChild_getter, enumerable: true, configurable: true, });
curMemoryArea.firstChild_smart_getter = function firstChild() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = this.jsdomMemory.firstChild; // 返回实例属性或jsdom值
    mframe.log({ flag: 'property', className: 'Node', propertyName: 'firstChild', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.firstChild_smart_getter);
Node.prototype.__defineGetter__("firstChild", curMemoryArea.firstChild_smart_getter);
//%%%%%%%↑↑Attribute END↑↑%%%%%%%%%%%%%%%%%%%%%%%%%%

//============== Function START ====================
// appendChild
Node.prototype["appendChild"] = function appendChild(aChild) {
    // 一定是一个实例来调用appendChild才有用,this.jsdomMemory是jsdom的; aChild是我们伪造的,aChild.jsdomMemory是jsdom创建的
    var res = this.jsdomMemory.appendChild(aChild.jsdomMemory);
    mframe.log({ flag: 'function', className: 'Node', methodName: 'appendChild', inputVal: arguments, res: res });
    return res;

}; mframe.safefunction(Node.prototype["appendChild"]);

//removeChild
Node.prototype["removeChild"] = function removeChild(child) {

    var res = this.jsdomMemory.removeChild(child)
    mframe.log({ flag: 'function', className: 'Node', methodName: 'removeChild', inputVal: arguments, res: res });
    return res;

}; mframe.safefunction(Node.prototype["removeChild"]);
Node.prototype["replaceChild"] = function replaceChild() { debugger; }; mframe.safefunction(Node.prototype["replaceChild"]);


/**insertBefore
 * newNode:要插入的节点。
 * referenceNode: 在其之前插入 newNode 的节点。如果为 null，newNode 将被插入到节点的子节点列表末尾。
*/
Node.prototype["insertBefore"] = function insertBefore(newNode, referenceNode) {
    var res = this.jsdomMemory["insertBefore"](newNode.jsdomMemory, referenceNode.jsdomMemory);
    mframe.log({ flag: 'function', className: 'Node', methodName: 'insertBefore', inputVal: arguments, res: res });
    return res;
}; mframe.safefunction(Node.prototype["insertBefore"]);
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

/** currentScript
 * 需要返回当前正在执行的js代码 或 null (肯定不能null,会检测的)
 * @returns 返回<script>标签
 * TODO 这玩意应当写活(用户传递,每个网站不同), 但config无法配置, 只能让用户直接改这里
 */
curMemoryArea.currentScript_getter = function currentScript() { return this._currentScript; }; mframe.safefunction(curMemoryArea.currentScript_getter);
Object.defineProperty(curMemoryArea.currentScript_getter, "name", { value: "get currentScript", configurable: true, });
Object.defineProperty(Document.prototype, "currentScript", { get: curMemoryArea.currentScript_getter, enumerable: true, configurable: true, });
curMemoryArea.currentScript_smart_getter = function currentScript() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    const scriptElement = document.createElement("script")
    scriptElement.setAttribute("data-n-head", "ssr");
    scriptElement.setAttribute("src", "https://g.alicdn.com/frontend-lib/frontend-lib/2.3.68/jquery_240910.min.js");
    var res = scriptElement;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'currentScript', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.currentScript_smart_getter);
Document.prototype.__defineGetter__("currentScript", curMemoryArea.currentScript_smart_getter);

/** readyState
 * 获取文档的加载状态。
 * @name readyState
 * @type {string}
 * @returns {string} 文档的加载状态，可为以下值之一：
 *   - "loading"：文档仍在加载中。
 *   - "interactive"：文档已解析完成，但子资源（如图片、样式表等）仍在加载。
 *   - "complete"：文档及其所有子资源均已加载完成，即将触发 `load` 事件。
 */
curMemoryArea.readyState_getter = function readyState() { return this._readyState; }; mframe.safefunction(curMemoryArea.readyState_getter);
Object.defineProperty(curMemoryArea.readyState_getter, "name", { value: "get readyState", configurable: true, });
Object.defineProperty(Document.prototype, "readyState", { get: curMemoryArea.readyState_getter, enumerable: true, configurable: true, });
curMemoryArea.readyState_smart_getter = function readyState() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    res = mframe.memory.jsdom.document.readyState; // loading
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'readyState', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.readyState_smart_getter);
Document.prototype.__defineGetter__("readyState", curMemoryArea.readyState_smart_getter);

// hidden
curMemoryArea.hidden_getter = function hidden() { return this._hidden; }; mframe.safefunction(curMemoryArea.hidden_getter);
Object.defineProperty(curMemoryArea.hidden_getter, "name", { value: "get hidden", configurable: true, });
Object.defineProperty(Document.prototype, "hidden", { get: curMemoryArea.hidden_getter, enumerable: true, configurable: true, });
curMemoryArea.hidden_smart_getter = function hidden() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    var res = false;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'hidden', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.hidden_smart_getter);
Document.prototype.__defineGetter__("hidden", curMemoryArea.hidden_smart_getter);

// wasDiscarded
curMemoryArea.wasDiscarded_getter = function wasDiscarded() { return this._wasDiscarded; }; mframe.safefunction(curMemoryArea.wasDiscarded_getter);
Object.defineProperty(curMemoryArea.wasDiscarded_getter, "name", { value: "get wasDiscarded", configurable: true, });
Object.defineProperty(Document.prototype, "wasDiscarded", { get: curMemoryArea.wasDiscarded_getter, enumerable: true, configurable: true, });
curMemoryArea.wasDiscarded_smart_getter = function wasDiscarded() {
    if (this.constructor && this === this.constructor.prototype) throw new Error('Illegal invocation');
    var res = false;
    mframe.log({ flag: 'property', className: 'Document', propertyName: 'wasDiscarded', method: 'get', val: res });
    return res;
}; mframe.safefunction(curMemoryArea.wasDiscarded_smart_getter);
Document.prototype.__defineGetter__("wasDiscarded", curMemoryArea.wasDiscarded_smart_getter);
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
    var tt = mframe.proxy(res);
    return tt;
}; mframe.safefunction(Document.prototype["createExpression"]);
//==============↑↑Function END↑↑====================
///////////////////////////////////////////////////
document.location = location;

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
window = global
!(function(B,T){var su={B:0x427,T:0x3df,A:0xc0,E:0x7c8,x:0x4f7,c:0x750,M:0x2ac,s:0x601,j:0x1be,H:0x7a9,k:0x70c,y:0x646},E8=B3,A=B();while(!![]){try{var E=parseInt(E8(su.B))/(0xb86+-0x945+-0x240)+parseInt(E8(su.T))/(0x1a55+0x4e*0x59+0x3571*-0x1)*(parseInt(E8(su.A))/(0x1*0x12e9+0x1c4a*0x1+0x14*-0x25c))+-parseInt(E8(su.E))/(0x2*-0x107e+-0x6b4+0x27b4)*(-parseInt(E8(su.x))/(-0x1*-0xe54+-0x809*-0x2+0x7*-0x457))+-parseInt(E8(su.c))/(0x1d27+0x9*-0x207+0x2*-0x571)+-parseInt(E8(su.M))/(-0x3b*-0x56+-0x4*0x88c+0xe65)*(-parseInt(E8(su.s))/(-0x2661+0x714+0x269*0xd))+-parseInt(E8(su.j))/(-0x9d+-0x16e5*0x1+0x178b*0x1)*(parseInt(E8(su.H))/(0xe5*-0x5+-0x7*-0x2e4+-0xfb9*0x1))+parseInt(E8(su.k))/(-0x8b*-0x1d+0x8*0x13+0x1c*-0x95)*(-parseInt(E8(su.y))/(0xa01+-0x94*-0x13+-0x14f1));if(E===T)break;else A['push'](A['shift']());}catch(x){A['push'](A['shift']());}}}(B2,-0x2*0x3408b+0x5c01a+0x55224),!(function(){var hR={B:0x292,T:0x3ae,A:0x73a,E:0x393,x:0x7c3,c:0x662,M:0x19d,s:0x48b,j:0x684,H:0x384,k:0xdc,y:0x55f,X:0x779,U:0x14e,K:0x73f,S:0x200,P:0x477,I:0xbf,h:0x284,C:0x3ca,L:0x33e,v:0x474,a:0x49a,i:0x230,F:0x331,u:0x32d,q:0x4a4,z:0x7d8,f:0x3e1,p:0x2bc,Z:0x6ca,D:0x185,m:0x7c2,e:0x49b,o:0x523,O:0x6d9,Y:0x121,g:0x3cf,b:0x564,n:0x2f2,J:0x360,W:0x139,Q:0x3b7,G:0x3cc,R:0x13e,l:0x5ae,V:0x77a,t:0x667,N:0x389,w:0x573,B0:0x225,B1:0x5ec,T6:0x38e,T7:0x102,T8:0x336,T9:0x624,TB:0x181,TT:0x2e3,TA:0x3aa,TE:0x6a2,Td:0x27c,Tx:0x4ac,Tc:0x3ac,TM:0x6bc,Ts:0x54f,Tj:0x533,TH:0x310,Tk:0x262,Ty:0x245,TX:0x129,TU:0x325,TK:0x67e,TS:0x6e4,TP:0x388,TI:0x76f,Th:0x37c,Tr:0x71a,TC:0x740,TL:0x166,Tv:0x28e,Ta:0x31f,Ti:0x63d,TF:0x250,Tu:0x1ac,Tq:0x28f,Tz:0x241,Tf:0x4a3,Tp:0x111,TZ:0x517,TD:0x31d,Tm:0x40a,Te:0x192,To:0x44d,TO:0x513,TY:0x271,Tg:0x3d9,Tb:0x77d,Tn:0x771,TJ:0x6f8,TW:0x7ae,TQ:0x43e,TG:0x710,TR:0x591,Tl:0x435,TV:0x506,Tt:0x208,TN:0x1a8,Tw:0x282,A0:0x21d,A1:0xd3,A2:0x38c,A3:0x142,A4:0x152,A5:0x344,A6:0x696,A7:0x5ab,A8:0x17c,A9:0x40e,AB:0x199,AT:0x16a,AA:0x335,AE:0x57b,Ad:0x410,Ax:0x56c,Ac:0x653,AM:0x110,As:0x1f0,Aj:0x501,AH:0x114,Ak:0x311,Ay:0x581,AX:0x656,AU:0x37d,AK:0x1f3,AS:0x7a5,AP:0x34d,AI:0x468,Ah:0xe1,Ar:0x40c,AC:0x6e7,AL:0xe4,Av:0x2cb,Aa:0x701,Ai:0x4e5,AF:0x3a6,Au:0x68c,Aq:0x72f,Az:0x488,Af:0x35c,Ap:0x413,AZ:0x109,AD:0x7f6,Am:0x3c0,Ae:0x66a,Ao:0x68f,AO:0x2a5,AY:0x673,Ag:0x3f7,Ab:0x36a,An:0x6c4,AJ:0x1f2,AW:0x73b,AQ:0x5a8,AG:0x75e,AR:0x5eb,Al:0x3ee,AV:0x432,At:0x56d,AN:0x62f,Aw:0x781,E0:0x148,E1:0x24e,E2:0x521,E3:0x549,E4:0x14d,E5:0x6ce,E6:0x3b8,E7:0xfe,hl:0x54d,hV:0x3cd,ht:0x1d9,hN:0x363,hw:0x4e2,r0:0x58b,r1:0x48e,r2:0x167,r3:0x45a,r4:0x4e3,r5:0x6b5,r6:0x2e8,r7:0x67c,r8:0x1aa,r9:0x24f,rB:0x1fd,rT:0x368,rA:0x41b,rE:0x455,rd:0x41e,rx:0x794,rc:0x518,rM:0x726,rs:0x3b4,rj:0x791,rH:0x560,rk:0x220,ry:0x2ce,rX:0x270,rU:0x569,rK:0x1cd,rS:0x14a,rP:0x442,rI:0x35d,rh:0x46f,rr:0x67a,rC:0x50b,rL:0x734,rv:0x416,ra:0x600,ri:0x279,rF:0x2c9,ru:0x379,rq:0x774,rz:0x545,rf:0x2f3,rp:0x120,rZ:0x3d3,rD:0x34a,rm:0x2c1,re:0x35a,ro:0x6d3,rO:0x520,rY:0x593,rg:0x22d,rb:0x583,rn:0x1dd,rJ:0xc2,rW:0x43a,rQ:0x141,rG:0x2b9,rR:0x4d2,rl:0x797,rV:0x7e8,rt:0x355,rN:0x156,rw:0x420,C0:0x756,C1:0x447,C2:0x442,C3:0x246,C4:0x610,C5:0x25e,C6:0x45a,C7:0x16f,C8:0x553,C9:0x254,CB:0x10e,CT:0x203,CA:0x619,CE:0x328,Cd:0xcd,Cx:0x5ed,Cc:0x45a,CM:0x4a8,Cs:0x481,Cj:0x2ed,CH:0x1ea,Ck:0x24b,Cy:0x32f,CX:0x708,CU:0x167,CK:0x60e,CS:0x167,CP:0x5a5,CI:0x25d,Ch:0x7da,Cr:0x708,CC:0x167,CL:0x4a8,Cv:0x100,Ca:0x455,Ci:0x33f,CF:0x628,Cu:0x7d2,Cq:0x673,Cz:0x5e6,Cf:0x22c,Cp:0x36f,CZ:0x1d0,CD:0x1fe,Cm:0x213,Ce:0xd4,Co:0x739,CO:0x6e3,CY:0x512,Cg:0x1c9,Cb:0x651,Cn:0x335,CJ:0x3d5,CW:0x22b,CQ:0x2f8,CG:0x400,CR:0x266,Cl:0x6ee,CV:0x612,Ct:0x421,CN:0x6c2,Cw:0x357,L0:0x44a,L1:0x6e1,L2:0x635,L3:0x6dc,L4:0x171,L5:0x5d7,L6:0x392,L7:0x76d,L8:0x253,L9:0x5aa,LB:0x4b7,LT:0x7c9,LA:0x4da,LE:0x4f9,Ld:0x571,Lx:0x45f,Lc:0x50f,LM:0x369,Ls:0x4a6,Lj:0x4f8,LH:0x409,Lk:0x5c1,Ly:0x4a5,LX:0x66a,LU:0x68f,LK:0x7e9,LS:0x3c0,LP:0x592,LI:0x345,Lh:0x417,Lr:0x24d,LC:0xd5,LL:0x2b6,Lv:0x5a3,La:0x404,Li:0x5f8,LF:0x46c,Lu:0x3be,Lq:0x316,Lz:0x51b,Lf:0x1c7,Lp:0x40b,LZ:0x7cc,LD:0x58c,Lm:0x23c,Le:0x12d,Lo:0x2fe,LO:0x1c2,LY:0x116,Lg:0x308,Lb:0x255,Ln:0x518,LJ:0x6a6,LW:0xe2,LQ:0x760,LG:0x243,LR:0x562,Ll:0x1fa,LV:0x5d6,Lt:0x264,LN:0x5a9,Lw:0x5c7,v0:0x30d,v1:0x396,v2:0x677,v3:0x153,v4:0x1fd,v5:0x368,v6:0x23b,v7:0x1c8,v8:0x1ce,v9:0x4a0,vB:0x6b4,vT:0x642,vA:0x614,vE:0x5f7,vd:0x351,vx:0x52c,vc:0x6db,vM:0x62f,vs:0x2dc,vj:0xe3,vH:0x341,vk:0x436,vy:0x7f4,vX:0x13b,vU:0x2aa,vK:0x17e,vS:0x25f,vP:0x383,vI:0x734,vh:0x3d7,vr:0x6cd,vC:0x4e8,vL:0x51a,vv:0x70e,va:0x2fd,vi:0x7e3,vF:0x299,vu:0x555,vq:0x6db,vz:0x62f,vf:0x305,vp:0x44f,vZ:0x587,vD:0x4b9,vm:0x5a4,ve:0x48e,vo:0x6b6,vO:0x647,vY:0x201,vg:0x33b,vb:0x7a7,vn:0x3f0,vJ:0x6fa,vW:0x73e,vQ:0x335,vG:0x134,vR:0x21f,vl:0x372,vV:0x475,vt:0x673,vN:0x548,vw:0x688,a0:0x47f,a1:0x74e,a2:0x269,a3:0x35b,a4:0x558,a5:0x4a9,a6:0x629,a7:0x538,a8:0x55e,a9:0x33d,aB:0x458,aT:0x768,aA:0x7f4,aE:0x6b7,ad:0x509,ax:0x44b,ac:0x356,aM:0x7ea,as:0x2b9,aj:0x797,aH:0x7e8,ak:0x156,ay:0x420,aX:0x579,aU:0x446,aK:0x3b6,aS:0x4bd,aP:0x503,aI:0x747,ah:0x1b9,ar:0x58b,aC:0x671,aL:0xcf,av:0x335,aa:0x3dc,ai:0x5ea,aF:0xfc,au:0x470,aq:0x64a,az:0x6c0,af:0x7b9,ap:0x7c6,aZ:0x214,aD:0x6c0,am:0x19b,ae:0x510,ao:0x29b,aO:0x7e1,aY:0x3b6,ag:0x5a0,ab:0x356,an:0x2ce,aJ:0x2e1,aW:0x77f,aQ:0x2b4,aG:0xef,aR:0x1cf,al:0x27b,aV:0x6b8,at:0x460,aN:0x69f,aw:0x330,i0:0x47e,i1:0x450,i2:0x20b,i3:0x306,i4:0x621,i5:0x6e6,i6:0xd7,i7:0x6dd,i8:0x21a,i9:0x184,iB:0x524,iT:0xfa,iA:0x24a,iE:0x10b,id:0x2e4,ix:0x4ae,ic:0x7d9,iM:0x40f,is:0x26a,ij:0x228,iH:0xec,ik:0x659,iy:0x66c,iX:0x489,iU:0x236,iK:0x285,iS:0x212,iP:0x390,iI:0x64c,ih:0x7a2,ir:0x7c7,iC:0xc4,iL:0x18d,iv:0x616,ia:0x247,ii:0x1cc,iF:0x405,iu:0x176,iq:0x4cb,iz:0x406,ip:0x603,iZ:0x472,iD:0x2d2,im:0x2b2,ie:0x7b2,io:0x5ba,iO:0x202,iY:0x39b,ig:0x164,ib:0x15c,iJ:0x36d,iW:0x793,iQ:0x6ea,iG:0x657,iR:0x3a9,il:0x1de,iV:0x3a5,it:0x4d8,iN:0x673,iw:0x210,F0:0x1c4,F1:0x762,F2:0x2ff,F3:0x3ce,F4:0x133,F5:0x7f2,F6:0x45e,F7:0x467,F8:0xd9,F9:0x3c9,FB:0xde,FT:0x586,FA:0x4cf,FE:0x6d7,Fd:0x270,Fx:0x71b,Fc:0x1fb,FM:0x196,Fs:0x540,Fj:0xdb,FH:0xfb,Fk:0x2c2,Fy:0x2a3,FX:0x16b,FU:0x577,FK:0x104,FS:0x6b3,FP:0x3d1,FI:0x4ed,Fh:0x1f4,Fr:0x691,FC:0x4f6,FL:0x42f,Fv:0x6ae,Fa:0x30e,Fi:0xd1,FF:0xff,Fu:0x297,Fq:0x4cc,Fz:0x1a2,Ff:0x5f0,Fp:0x62a,FZ:0x790,FD:0x283,Fm:0xdf,Fe:0x568,Fo:0x79e,FO:0x456,FY:0x444,Fg:0x1f6,Fb:0x60d,Fn:0x6d6,FJ:0x703,FW:0x108,FQ:0x613,FG:0x437,FR:0x177,Fl:0x7a4,FV:0x6bb,Ft:0x50c,FN:0x1b0,Fw:0x7dd,u0:0x544,u1:0x2e5,u2:0x57f,u3:0x415,u4:0x5da,u5:0x1d4,u6:0x2df,u7:0x39e,u8:0x6a1,u9:0x7ca,uB:0x6be,uT:0x431,uA:0x60c,uE:0x4ff,ud:0xce,ux:0x6c7,uc:0x1b1,uM:0x3fb,us:0x664,uj:0x492,uH:0x552,uk:0xd2,uy:0x48d,uX:0x124,uU:0x738,uK:0x3f5,uS:0x7f0,uP:0x5a1,uI:0x448,uh:0x5c2,ur:0x582,uC:0x5db,uL:0x4b3,uv:0x532,ua:0x349,ui:0x5f2,uF:0x5b4,uu:0x173,uq:0x2a4,uz:0x289,uf:0x7ec,up:0x712,uZ:0x65d,uD:0x277,um:0x3ed,ue:0x242,uo:0x1df,uO:0x56e,uY:0x1eb,ug:0x4fd,ub:0x11c,un:0x39d,uJ:0x462,uW:0x6f7,uQ:0x727,uG:0x2d9,uR:0x31a,ul:0x3ab,uV:0x522,ut:0x7a1,uN:0x49f,uw:0x783,q0:0x57d,q1:0x605,q2:0x43d,q3:0x7c0,q4:0x6cf,q5:0x2f6,q6:0x362,q7:0x10c,q8:0x2c6,q9:0x161,qB:0x6ec,qT:0x1dc,qA:0x160,qE:0x17b,qd:0x7d0,qx:0x132,qc:0x223,qM:0x38a,qs:0x7f1,qj:0x3ef,qH:0x2eb,qk:0x21b,qy:0x364,qX:0x4be,qU:0x315,qK:0x4fa,qS:0x22a,qP:0x1b8,qI:0x449,qh:0x76a,qr:0x5c8,qC:0x4c0,qL:0x3d8,qv:0x638,qa:0x332,qi:0x30a,qF:0x497,qu:0x6e0},hG={B:0x672,T:0x2a7,A:0x7cd,E:0x3e3,x:0x1b7,c:0x6cb,M:0x719,s:0x378,j:0x115,H:0x5dc,k:0x318,y:0x2be,X:0x1ed,U:0x157,K:0x334,S:0x2c5,P:0x322,I:0x4b5,h:0x537,C:0x5b2,L:0x51d,v:0x2c0,a:0x7b4,i:0x514,F:0x6a0,u:0x515,q:0x22f,z:0x296,f:0x21c,p:0x5fd,Z:0x13f,D:0x54e,m:0x168,e:0xee,o:0x2a6,O:0x1c6,Y:0x567,g:0x37b,b:0x259,n:0x401,J:0x69b,W:0x5bf,Q:0x18c,G:0x536,R:0x337,l:0x1f9,V:0x2f1,t:0x1b4,N:0x28d,w:0x4d9,B0:0x70b,B1:0x25a,T6:0x42d,T7:0x3a4,T8:0x5c5,T9:0x6d8,TB:0x7f7,TT:0xc5,TA:0x6bf,TE:0x218,Td:0x12e,Tx:0x770,Tc:0x7bd,TM:0x118,Ts:0x4d0,Tj:0x4d0,TH:0x5fc,Tk:0x3d6,Ty:0x4d0,TX:0x714,TU:0x3d6,TK:0x4d0,TS:0x3c8,TP:0x2e2,TI:0x190,Th:0x504,Tr:0x7bf,TC:0x5c3,TL:0x347,Tv:0x112,Ta:0x2b7,Ti:0x1d3,TF:0x74b,Tu:0x5d4,Tq:0x5d0,Tz:0xc6,Tf:0x732,Tp:0x5ba,TZ:0x3b2,TD:0x47e,Tm:0x425,Te:0xc6,To:0x732,TO:0x47e,TY:0x6b0,Tg:0x66b,Tb:0x221,Tn:0x321,TJ:0x5d5,TW:0x46b,TQ:0x103,TG:0x227,TR:0x1bc,Tl:0x5e8,TV:0x4a2,Tt:0x65a,TN:0x1a1,Tw:0x61a,A0:0x20d,A1:0x1fc,A2:0x2cf,A3:0x694,A4:0x23a,A5:0x411,A6:0x2bf,A7:0x4af,A8:0x319,A9:0x4f0,AB:0x654,AT:0x61a,AA:0x625,AE:0x478,Ad:0x61a,Ax:0x52b,Ac:0x1bb,AM:0x3b1,As:0x3b1,Aj:0x1a1,AH:0x3b1,Ak:0x3a1,Ay:0xc8,AX:0x67d,AU:0x5fe,AK:0x12a,AS:0x1a1,AP:0x61a,AI:0x61a,Ah:0x441,Ar:0x681,AC:0x2d7,AL:0x391,Av:0x61a,Aa:0x7b7,Ai:0x1d3,AF:0x74b,Au:0x775,Aq:0x14c,Az:0x73d,Af:0x4af,Ap:0x3f1,AZ:0xe0,AD:0x709,Am:0x461,Ae:0x595,Ao:0x2a0,AO:0x3c3,AY:0x7dc,Ag:0x55a,Ab:0x630,An:0x38b,AJ:0x38b,AW:0x53b,AQ:0x519,AG:0x1a1,AR:0x61a,Al:0x4ca,AV:0x280,At:0x541,AN:0xf0,Aw:0x4aa,E0:0x4d7,E1:0x59a,E2:0x4d7,E3:0x4fe,E4:0x491,E5:0x721,E6:0x721,E7:0x1a1,hR:0x61a,hl:0x1a1,hV:0x6af,ht:0x426,hN:0x1a1,hw:0x61a,r0:0x31b,r1:0x280,r2:0x7b5,r3:0x437,r4:0x5d3,r5:0x61a,r6:0x1bd,r7:0x4a1,r8:0x317,r9:0x6f1,rB:0x3b1,rT:0x3b1,rA:0x1a1,rE:0x547,rd:0x23f,rx:0x7b3,rc:0x3f1,rM:0x1f8,rs:0x498,rj:0x527,rH:0x7a8,rk:0x6c3,ry:0x694,rX:0xca,rU:0x3e5,rK:0x649,rS:0x5fe,rP:0xc9,rI:0x3b1,rh:0x3b1,rr:0x61a,rC:0x3b1,rL:0x61a,rv:0x438,ra:0x2a2,ri:0x59c,rF:0x59c,ru:0x391,rq:0x1a1,rz:0x61a,rf:0x32a,rp:0x5fe,rZ:0x728,rD:0x728,rm:0x391,re:0x1a1,ro:0x45c,rO:0x574,rY:0x3b1,rg:0x3b1,rb:0x21e,rn:0x59d,rJ:0x4b2,rW:0x4aa,rQ:0x5f4,rG:0x61a,rR:0x1a7,rl:0x1f7,rV:0x415,rt:0x130,rN:0x130,rw:0x61a,C0:0x298,C1:0x695,C2:0x1a1,C3:0x61a,C4:0x78c,C5:0x1bb,C6:0x78d,C7:0x5bb,C8:0xe9,C9:0x58f,CB:0x38d,CT:0x58f,CA:0x61a,CE:0x15d,Cd:0x76c,Cx:0x5e8,Cc:0x260,CM:0x3c8,Cs:0x2e2,Cj:0x5f9,CH:0x20f,Ck:0x737,Cy:0x3b5,CX:0x68a,CU:0x68a,CK:0x1c0,CS:0x3ea,CP:0x68a,CI:0x3ea,Ch:0x47b,Cr:0x471,CC:0x6e9,CL:0x590,Cv:0x5e8,Ca:0x6e5,Ci:0xe7,CF:0x1a3,Cu:0x485,Cq:0x4a7,Cz:0x150,Cf:0x350,Cp:0x4b8,CZ:0x428,CD:0x1a1,Cm:0x61a,Ce:0x717,Co:0x738,CO:0x704,CY:0x5e8,Cg:0xeb,Cb:0x3a3,Cn:0x294,CJ:0x74b,CW:0x775,CQ:0x5e3,CG:0x5e3,CR:0x1a4,Cl:0x5d8,CV:0x3c5,Ct:0x724,CN:0x39f,Cw:0x500,L0:0xdd,L1:0x24c,L2:0x39f,L3:0x2cd,L4:0x7c5,L5:0x123,L6:0x29f,L7:0x127,L8:0x188,L9:0x2ad,LB:0x2d3,LT:0x29a,LA:0x5a7,LE:0x5e8,Ld:0x434,Lx:0x1a1,Lc:0x3e9,LM:0x61a,Ls:0x6fe,Lj:0x7f5,LH:0x694,Lk:0x5f5,Ly:0x319,LX:0x61a,LU:0x6b9,LK:0x4f2,LS:0x1a1,LP:0x61a,LI:0x597,Lh:0x1a1,Lr:0x7c4,LC:0x11d,LL:0x5e8,Lv:0x752,La:0x1db,Li:0x219,LF:0x609,Lu:0x140,Lq:0x72e,Lz:0x140,Lf:0x729,Lp:0x697,LZ:0x704,LD:0x620,Lm:0x55c,Le:0x2f0,Lo:0x13c,LO:0x704,LY:0x464,Lg:0x5e8,Lb:0x1d3,Ln:0x74b,LJ:0x5e3,LW:0x20f,LQ:0x5f9,LG:0x573,LR:0x588,Ll:0x1d5,LV:0x403,Lt:0x50e,LN:0x2bb,Lw:0x19c,v0:0x3fe,v1:0x2bb,v2:0x1b3,v3:0x60f,v4:0x63e,v5:0x2e0,v6:0x1c1,v7:0x7d4,v8:0x354,v9:0x745,vB:0x3af,vT:0x321,vA:0x5d5,vE:0x7a3,vd:0x6f4,vx:0x10a,vc:0x303,vM:0x6fc,vs:0x785,vj:0x56a,vH:0x105,vk:0x7a1,vy:0x63b,vX:0x530,vU:0x249,vK:0x783,vS:0x1a5,vP:0x483,vI:0x5f1,vh:0x43d,vr:0x23d,vC:0x2cc,vL:0x6d5,vv:0x2f6,va:0x627,vi:0x731,vF:0x4cc,vu:0x1a2,vq:0x4cc,vz:0x1a2,vf:0x551,vp:0x4cc,vZ:0x1a2,vD:0x2b7,vm:0x338,ve:0x4cc,vo:0x1a2,vO:0x1a2,vY:0x4fc,vg:0x2b7,vb:0x7ac,vn:0x4cc,vJ:0x1a2,vW:0x6ba,vQ:0x4cc,vG:0x543,vR:0x2b7,vl:0x2b7,vV:0x3b0,vt:0x414,vN:0x239,vw:0x4cc,a0:0x4d3,a1:0x2b7,a2:0x440,a3:0x1a2,a4:0x1a2,a5:0x5cc,a6:0x54a,a7:0x6fc,a8:0x2b7,a9:0x778,aB:0x1a2,aT:0x115,aA:0x42e,aE:0x2b7,ad:0xcc,ax:0x3a8,ac:0x745,aM:0x789,as:0x511,aj:0x27d,aH:0x566,ak:0x26f,ay:0x5e8,aX:0x5e8,aU:0x5e8,aK:0x451,aS:0x5e8,aP:0x1b6,aI:0x618,ah:0x361,ar:0x63f,aC:0x5e8,aL:0x7a1,av:0x783,aa:0x5e8,ai:0x5e8,aF:0x17a,au:0x131,aq:0x175,az:0x787,af:0x48c,ap:0x3b3,aZ:0x5e8,aD:0x1d7,am:0x2c4,ae:0x598,ao:0x6e8,aO:0x261,aY:0x51f,ag:0x42a,ab:0x42a,an:0x391,aJ:0x391,aW:0x720,aQ:0x4de,aG:0x14c,aR:0x49c,al:0x61e,aV:0x7a6,at:0x5f1,aN:0x5dd,aw:0x561,i0:0x75d,i1:0x317,i2:0x32e,i3:0x182,i4:0x125,i5:0x187,i6:0x519,i7:0x3c6,i8:0x57e,i9:0x7b0,iB:0x5b6,iT:0x359,iA:0x660,iE:0x65c,id:0x147,ix:0x14b,ic:0x1d3,iM:0x74b,is:0x58e,ij:0x3e7,iH:0x249,ik:0x573,iy:0x3a7,iX:0x391,iU:0x3bb,iK:0x78b,iS:0x4cc,iP:0x507,iI:0xea,ih:0x56f,ir:0x2b1,iC:0x5b0,iL:0x798,iv:0x1ec,ia:0x13f,ii:0x1ec,iF:0x21c,iu:0x5b0,iq:0x798,iz:0x1ec,ip:0x5fd,iZ:0x48a,iD:0x170,im:0x186,ie:0x122,io:0x757,iO:0x2fa,iY:0x224,ig:0x4df,ib:0x3f4,iJ:0x3bc,iW:0x764,iQ:0x761,iG:0x4e1,iR:0x702,il:0x13d,iV:0x4c3,it:0x704,iN:0x52e,iw:0x6d0,F0:0x137,F1:0x711,F2:0x704,F3:0x221,F4:0x321,F5:0x645,F6:0x3d2,F7:0x2da,F8:0x61f,F9:0x679,FB:0x32b,FT:0x5fb,FA:0x361,FE:0x535,Fd:0x557,Fx:0x112,Fc:0x112,FM:0x686,Fs:0x158},hQ={B:0x28b,T:0x640,A:0x68a},hW={B:0x1d3,T:0x74b,A:0x5d4,E:0x47e,x:0x546,c:0x29e,M:0x719,s:0x68b,j:0x516,H:0x300,k:0x6c6,y:0x424,X:0x113,U:0x69e,K:0x183,S:0x179,P:0x55b,I:0x6e5,h:0x4f5,C:0x2d5,L:0x623,v:0x59b,a:0x107,i:0xfa,F:0x5f0,u:0x62a,q:0x5ce},hM={B:0x6b1,T:0x412,A:0x18b,E:0x18f,x:0x3a5,c:0x5ac,M:0x3a5,s:0x7b6},Ip={B:0x493,T:0x6b1,A:0x47c,E:0x18b,x:0x216,c:0x6a5,M:0x784,s:0x3fa,j:0x37e,H:0x69d,k:0x56f,y:0x2b1,X:0x78b,U:0x3bb,K:0x3bb,S:0x4cc,P:0x1a2,I:0x507,h:0xea,C:0x101,L:0x342,v:0x505,a:0x674,i:0x782,F:0x3f3,u:0x16c,q:0x493,z:0x4c5,f:0x704,p:0x5e0,Z:0x61a,D:0x2a8,m:0x5e0,e:0x136,o:0x5e0,O:0x61a,Y:0x138,g:0x7b6},I6={B:0x3c2,T:0x7df,A:0x52f,E:0x62b,x:0x3c2,c:0x39a},I5={B:0x50d,T:0x1e5,A:0x5e8,E:0x5c5,x:0x5e8},I4={B:0x42b,T:0x318,A:0x79f,E:0x2be,x:0x45b},I0={B:0x4b4},Pw={B:0x5b9,T:0x704,A:0x2a1,E:0x644,x:0x4e4,c:0x704,M:0x265},PG={B:0x599,T:0x4db},PJ={B:0x6ff,T:0x495},Po={B:0x575,T:0x704},Pz={B:0x313},Pu={B:0x1d3,T:0x74b,A:0x1e3,E:0x620,x:0x722,c:0x5ce,M:0x5bd,s:0x385,j:0x20a,H:0x222},Pa={B:0x301,T:0x5e8},PI={B:0x704,T:0x2e7,A:0x6f6,E:0x759,x:0x3a0,c:0x52d,M:0x683,s:0x2a1},Pj={B:0x596,T:0x692,A:0x704,E:0x18e,x:0x391,c:0x1a1,M:0x61a,s:0x39a,j:0x487,H:0x391,k:0x1a1,y:0x61a,X:0x391,U:0x1a1,K:0x39a,S:0x6f6,P:0x2a1,I:0x49e,h:0x47a,C:0x5e8,L:0x191,v:0x2a1,a:0x6f6,i:0x6f9,F:0x374,u:0x376,q:0x155,z:0x69a,f:0x6ed,p:0x1e0,Z:0x692,D:0x198,m:0x6eb,e:0x5e8,o:0x1e0,O:0x155,Y:0x650,g:0x380,b:0x7ee,n:0x54b,J:0x398,W:0xd8,Q:0x232,G:0x7ed,R:0x232,l:0x744,V:0x1a1,t:0x39a,N:0x155,w:0x5e8,B0:0x2a1,B1:0x713,T6:0x6ed,T7:0x6c9,T8:0x7ed,T9:0xda,TB:0x5e8,TT:0x5d2,TA:0x453,TE:0x683,Td:0x398,Tx:0x735,Tc:0x232,TM:0x2a1,Ts:0x339,Tj:0x373,TH:0x641,Tk:0x3c1,Ty:0x5e8,TX:0x191,TU:0x650,TK:0x3ba,TS:0x2d6,TP:0x6ef,TI:0x7d5,Th:0x1a9,Tr:0x47a,TC:0x5e8,TL:0x585,Tv:0x155,Ta:0x211,Ti:0xf7,TF:0x6c9,Tu:0x78e,Tq:0x52d,Tz:0x5e8,Tf:0x3d0,Tp:0x1a9,TZ:0x735,TD:0x5e8,Tm:0x585,Te:0x754},Ps={B:0x596,T:0x539,A:0x704,E:0x487,x:0xc1},Px={B:0x5e1},Pd={B:0x71e},PT={B:0x7d6},P9={B:0x387},P8={B:0x68e},P7={B:0x2ec},P2={B:0x745},Sl={B:0x4ea},SQ={B:0xfd},SY={B:0x1db},Se={B:0x6df},SD={B:0x5ee},Sp={B:0x5a6},SF={B:0x5be},Sa={B:0x2ea},SP={B:0x459},SK={B:0x3dd},SU={B:0x61c},SX={B:0x6ab},Sy={B:0x6a9},SH={B:0x163},Sc={B:0x5af},Sx={B:0x314},SE={B:0x7b1},SA={B:0x41f},S9={B:0x66d},S4={B:0x2ef},S3={B:0x35e},Kl={B:0x14c},KR={B:0x7b1},KG={B:0x70d},KQ={B:0x2b5},KW={B:0x6f2},Kn={B:0x580},Kb={B:0x4aa},Kg={B:0x44e},KY={B:0x5e9},KO={B:0x4f1},Kf={B:0x267},Kz={B:0x10d},KF={B:0x10d},Kv={B:0x4f2},Kr={B:0x352},Kh={B:0x426},KI={B:0x461},KP={B:0x433},KU={B:0x76b},Ky={B:0xe7},Kj={B:0x33a,T:0x6d4,A:0x43c,E:0x4b1,x:0x5e0,c:0x61a,M:0x197,s:0x61a,j:0x79a},Ks={B:0x391,T:0x1a1,A:0x61a,E:0x39a},KM={B:0x5e0,T:0x61a},Kc={B:0x272,T:0x3bf,A:0x272},Kx={B:0x1da,T:0x666,A:0x419,E:0x6f0,x:0x758},Kd={B:0x643,T:0x103,A:0x399,E:0x748,x:0x704,c:0x685,M:0x754,s:0x5bc,j:0x399,H:0x46d,k:0x103,y:0x576,X:0x29d,U:0x704,K:0x5ee,S:0xd6,P:0x64d,I:0x5e8,h:0x54c,C:0x704,L:0xd6,v:0x685,a:0x399},KA={B:0x615,T:0x534,A:0x178,E:0xd6,x:0x534,c:0x46d,M:0x69c,s:0x287,j:0x207,H:0x353,k:0x682,y:0x786,X:0x4b4,U:0x399,K:0x700},KB={B:0x4d1,T:0x749,A:0x704,E:0x637,x:0x3ad,c:0x72e,M:0x5a6,s:0x1ba,j:0x46d,H:0x580,k:0x704,y:0x748,X:0x704,U:0x6f4,K:0x103,S:0x749,P:0x4c3,I:0x704,h:0x5a6,C:0x54c,L:0xd6,v:0x5e8,a:0x7d1,i:0x300,F:0x707,u:0x704,q:0x754},K8={B:0x556,T:0x4b4,A:0x103,E:0x79b,x:0x103,c:0x704,M:0x112,s:0x353,j:0x769,H:0x2ab,k:0x2ab,y:0x112,X:0x69c,U:0x14f},K0={B:0x365},Ut={B:0x58d},UR={B:0x1e7},UG={B:0x48a},Ug={B:0x580},UY={B:0x7d1},UO={B:0x36c},Ue={B:0x1d2,T:0x391,A:0x119,E:0x1e8,x:0x391,c:0x65f},UD={B:0x5df,T:0x46e,A:0x119},Uf={B:0x5cb},Uz={B:0x5cb},Uv={B:0x52a},UL={B:0x445},UI={B:0x5a6,T:0x5bc},UP={B:0xe5,T:0x3a2,A:0x16e,E:0x565,x:0x7a3,c:0x788,M:0x74d,s:0x736,j:0x565,H:0x6bd,k:0x608,y:0x300,X:0x300,U:0x75b,K:0x6a3},UK={B:0x2fb,T:0x31c,A:0x6a8,E:0x31e,x:0x25b,c:0x2a9,M:0x546,s:0x29e,j:0x5d4,H:0x697,k:0x704,y:0x707,X:0x72b,U:0x541,K:0x365,S:0x408,P:0x541},Us={B:0x65e,T:0x326,A:0x5a6,E:0x272},UM={B:0x4eb,T:0x7ba,A:0x5ff,E:0x676,x:0x704,c:0x288,M:0x704,s:0x6f5,j:0x7bb,H:0x754,k:0x704,y:0x486,X:0x525,U:0x46d,K:0x75a,S:0x525,P:0x19a,I:0x137,h:0x3f6,C:0x704,L:0x2b0},Ux={B:0x707},Ud={B:0x36c},UE={B:0x36c},UT={B:0x3c4},UB={B:0x565},U8={B:0x4c3},U6={B:0x758,T:0x1ba,A:0x7ce},U4={B:0x36c},E9=B3,B={'wccbh':function(c,M,s){return c(M,s);},'trPRA':function(c,M){return c+M;},'MoDGs':function(c,M){return c(M);},'alnwk':function(c,M){return c(M);},'WJPpE':function(c,M){return c(M);},'LWatF':E9(hR.B),'IymRT':E9(hR.T)+E9(hR.A)+E9(hR.E)+E9(hR.x)+E9(hR.c)+E9(hR.M)+E9(hR.s)+E9(hR.j)+E9(hR.H)+E9(hR.k)+E9(hR.y)+E9(hR.X)+E9(hR.U)+E9(hR.K)+E9(hR.S),'wpbEy':E9(hR.P)+E9(hR.I)+E9(hR.h)+E9(hR.C),'nSGQU':function(c,M){return c<M;},'DSwHf':function(c,M){return c==M;},'wICbM':function(c,M){return c+M;},'ZJLgP':function(c,M){return c^M;},'lPpIn':function(c,M,s){return c(M,s);},'JeAnl':function(c,M){return c==M;},'LlwDk':function(c,M){return c+M;},'Dddlb':E9(hR.L),'CJNSP':E9(hR.v),'gWRET':E9(hR.a),'JKtci':function(c,M){return c<M;},'SGAOa':E9(hR.i)+E9(hR.F),'AdAdW':function(c,M){return c==M;},'JowQP':E9(hR.u),'EcMgl':function(c,M){return c==M;},'NsBKy':E9(hR.q),'ZHJJB':function(c,M){return c+M;},'bEvYF':function(c,M){return c+M;},'KOMet':function(c,M){return c+M;},'EsVdG':E9(hR.z),'UVknt':E9(hR.f)+E9(hR.p),'EeHAN':function(c,M){return c(M);},'JocdW':function(c){return c();},'uMURd':function(c,M){return c>M;},'WioRD':E9(hR.Z)+E9(hR.D)+E9(hR.m),'VNpIh':function(c,M){return c||M;},'koZoe':function(c,M,s){return c(M,s);},'oowAX':function(c,M){return c!=M;},'qDGVg':function(c,M){return c+M;},'TYHpq':function(c,M){return c+M;},'KAoDx':function(c,M){return c+M;},'LoTuu':function(c,M){return c-M;},'UsFeb':function(c,M){return c+M;},'qYiKO':function(c,M){return c==M;},'SytdX':function(c,M){return c+M;},'FPvTf':E9(hR.e)+E9(hR.o),'wGNAF':function(c,M){return c+M;},'Lutbv':function(c,M){return c(M);},'xDIIj':function(c,M){return c<M;},'GxvTL':function(c,M){return c!=M;},'kfjzt':function(c,M){return c+M;},'TDfgf':function(c,M){return c<M;},'hkmeW':function(c,M){return c+M;},'uipQT':E9(hR.O),'sLFci':E9(hR.Y),'SMEYC':function(c,M){return c===M;},'kFAdd':E9(hR.g),'apuEr':function(c,M){return c!=M;},'prYVv':E9(hR.b),'XtnDG':function(c,M){return c(M);},'NLXLv':function(c,M){return c==M;},'vuYzP':function(c,M){return c+M;},'AylUH':function(c,M){return c+M;},'AXPic':function(c,M){return c+M;},'bfXWF':function(c,M){return c!==M;},'MVWiq':function(c,M){return c(M);},'XJRlK':E9(hR.n),'arddU':E9(hR.J),'YWGRX':E9(hR.W),'CavUK':function(c,M){return c!=M;},'CqPaw':E9(hR.Q)+E9(hR.G)+E9(hR.R),'veCjR':function(c,M){return c==M;},'uNQQi':E9(hR.l),'eAcQz':function(c,M){return c!=M;},'ITKXL':E9(hR.V)+E9(hR.t)+'_','FmLYw':function(c,M){return c(M);},'cTIaN':function(c,M){return c|M;},'eLDIO':function(c,M){return c|M;},'RJRNj':function(c,M){return c|M;},'EbtEr':function(c,M){return c|M;},'tYTNf':function(c,M){return c|M;},'fLqGm':function(c,M){return c|M;},'KgcKE':function(c,M){return c|M;},'HUoUV':function(c,M){return c|M;},'hSKMn':function(c,M){return c|M;},'KPcJy':function(c,M){return c<<M;},'SYPHV':function(c,M){return c<M;},'ZCxfR':function(c,M){return c<<M;},'DDRNO':function(c,M){return c(M);},'WfZMr':function(c,M){return c<<M;},'mZrwo':function(c,M){return c(M);},'CJrwa':function(c,M){return c(M);},'ntkEr':function(c,M){return c<<M;},'IvURA':function(c,M){return c(M);},'loZCN':function(c,M){return c(M);},'iWCTl':function(c,M){return c(M);},'Zlgno':function(c,M){return c<<M;},'sBgpI':function(c,M){return c<<M;},'wVbeZ':function(c,M){return c(M);},'pnxZy':function(c,M){return c<<M;},'mAPAp':function(c,M){return c(M);},'IQfSQ':function(c,M){return c<<M;},'FzoqV':function(c,M){return c!=M;},'wMuzk':E9(hR.N),'OoqqS':function(c){return c();},'TllyG':E9(hR.w),'ayqXy':E9(hR.B0),'blHaF':function(c){return c();},'btthp':E9(hR.B1)+'a','QJQGa':function(c,M){return c+M;},'vyyDD':function(c,M){return c+M;},'ONwfI':function(c,M){return c+M;},'dPawz':function(c,M){return c+M;},'HnLFd':function(c,M){return c+M;},'MMYHS':function(c,M){return c+M;},'xkabI':function(c,M){return c+M;},'LHQVE':function(c,M){return c+M;},'ChDBQ':E9(hR.B1)+'a2','FERPB':function(c,M){return c+M;},'WxYYm':function(c,M){return c+M;},'qygos':function(c,M){return c+M;},'BSsrr':function(c,M){return c+M;},'INARy':function(c,M){return c+M;},'xjjuR':function(c,M){return c+M;},'zGiMM':function(c,M){return c+M;},'hJwDG':function(c,M){return c+M;},'NnPIB':function(c,M){return c+M;},'xycFw':function(c,M){return c(M);},'tvhyU':function(c,M){return c(M);},'tsOqY':function(c,M){return c(M);},'bnPDu':function(c,M){return c+M;},'eECjt':function(c,M){return c+M;},'zDuaK':function(c,M){return c-M;},'VbcGQ':function(c,M){return c+M;},'QTqac':function(c,M){return c+M;},'dAQnU':function(c,M){return c-M;},'EccRm':function(c,M){return c+M;},'lrKhH':function(c,M){return c+M;},'buXws':function(c,M){return c+M;},'MjCrz':function(c,M){return c==M;},'gFBlk':E9(hR.T6),'tbiDF':function(c){return c();},'iFZmX':function(c,M){return c==M;},'POTSu':E9(hR.T7),'FKgKm':function(c,M){return c<M;},'juoqj':function(c,M){return c<M;},'jryxg':function(c,M){return c(M);},'EFJJt':function(c,M){return c==M;},'nZLLU':E9(hR.T8),'QYnfJ':E9(hR.T9)+E9(hR.TB),'pDgMC':function(c,M){return c(M);},'vnYkm':function(c,M){return c==M;},'vUwsy':function(c,M){return c-M;},'oxFqy':function(c,M){return c+M;},'LwUBl':function(c,M){return c+M;},'wtVLA':function(c){return c();},'yyyTH':E9(hR.TT),'XNZvx':function(c,M){return c instanceof M;},'NIRzV':function(c,M){return c<M;},'PrvFc':function(c,M){return c(M);},'jNuEM':function(c,M){return c+M;},'QoLSf':function(c,M){return c==M;},'RJtrz':E9(hR.TA),'pOqsC':E9(hR.TE),'akcOe':E9(hR.Td),'NzkaD':E9(hR.Tx),'FXTCh':function(c,M){return c==M;},'Xkcxm':E9(hR.Tc),'bviwO':E9(hR.TM),'lAnMr':E9(hR.Ts),'KJSjC':E9(hR.Tj),'orETm':E9(hR.TH)+'le','pqmlj':E9(hR.Tk),'LGnzR':E9(hR.Ty)+E9(hR.TX)+'标识','zyJUW':function(c,M){return c==M;},'ruHAY':E9(hR.TU),'LepaB':E9(hR.TK),'hLaMS':E9(hR.TS),'XhOsg':function(c,M){return c<M;},'zyEEC':E9(hR.TP),'sHMLb':E9(hR.TI),'xgwqg':E9(hR.Th),'gzmUs':E9(hR.Tr),'nXLGN':function(c,M){return c<M;},'PceRm':E9(hR.TC)+'(a','nFncL':E9(hR.TL),'hMxlz':function(c,M){return c<M;},'KSCyj':E9(hR.Tv)+E9(hR.Ta),'ydHMU':E9(hR.Ti)+E9(hR.TF)+E9(hR.Tu),'mFkwp':E9(hR.Tq)+'(l','UCVbD':E9(hR.Tz),'GZlRJ':E9(hR.Tf)+E9(hR.Tp),'QOIak':E9(hR.TZ)+E9(hR.TD)+E9(hR.Tm),'xrurn':E9(hR.Te),'vOhgw':E9(hR.To),'MKVxS':function(c,M){return c<M;},'WeBkW':E9(hR.TO)+'3','orvMG':E9(hR.TY)+E9(hR.Tg)+'f','imyir':E9(hR.Tb)+'0','oHuqO':E9(hR.Tn)+E9(hR.TJ)+'b','EsBzp':function(c,M){return c(M);},'ZQICA':E9(hR.TW),'jeRSw':E9(hR.TQ),'UGcUL':function(c,M){return c===M;},'sQDhB':E9(hR.TG)+E9(hR.TR),'NkHQx':E9(hR.Tl)+E9(hR.TV)+E9(hR.Tt),'EVHpS':function(c,M){return c+M;},'KEMbM':E9(hR.TN)+E9(hR.Tw)+E9(hR.A0),'BDfKL':function(c,M){return c!==M;},'bjyCw':function(c,M){return c+M;},'tQRbG':E9(hR.A1),'AsVmi':E9(hR.A2),'wShTa':function(c,M){return c!==M;},'TOyjy':function(c,M){return c===M;},'SVXLe':E9(hR.A3)+E9(hR.A4)+E9(hR.A5),'wvttt':E9(hR.A3)+E9(hR.A6)+E9(hR.A7),'WhNDZ':E9(hR.A8),'jQIzU':E9(hR.A9)+'d\x22','DUmMl':E9(hR.AB),'jIPxn':function(c,M){return c+M;},'qlCPU':E9(hR.AT)+E9(hR.AA)+E9(hR.AE)+E9(hR.Ad)+E9(hR.Ax)+E9(hR.Ac)+E9(hR.AM)+E9(hR.As)+E9(hR.Aj)+E9(hR.AH)+E9(hR.Ak)+E9(hR.Ay)+E9(hR.AX)+E9(hR.AU)+E9(hR.AK)+E9(hR.AS)+E9(hR.AP)+E9(hR.AI)+E9(hR.Ah)+E9(hR.Ar)+E9(hR.AC)+E9(hR.AL)+E9(hR.Av)+E9(hR.Aa)+E9(hR.Ai)+E9(hR.AF)+E9(hR.Au)+E9(hR.Aq)+E9(hR.Az)+E9(hR.Af)+E9(hR.Ap)+E9(hR.AZ)+E9(hR.AD),'tFdFI':function(c,M){return c*M;},'llgwH':function(c,M){return c+M;},'yIBxy':function(c,M){return c+M;},'IuumN':function(c,M){return c+M;},'sdKpg':function(c,M){return c+M;},'noCYk':function(c,M){return c+M;},'ISiKL':function(c,M){return c+M;},'MATns':function(c,M){return c+M;},'pjjIA':function(c,M){return c+M;},'ksACz':function(c,M){return c+M;},'Chmte':function(c,M){return c+M;},'Yswht':function(c,M){return c+M;},'ADSYd':function(c,M){return c+M;},'NioHN':function(c,M){return c+M;},'pwrey':function(c,M){return c+M;},'oqJpn':function(c,M){return c+M;},'uOPRK':function(c,M){return c+M;},'aXgWo':function(c,M){return c+M;},'nCjhc':function(c,M){return c+M;},'YVMAA':function(c,M){return c+M;},'ELxEK':function(c,M){return c+M;},'wsYMV':E9(hR.Am)+E9(hR.Ae)+E9(hR.Ao)+E9(hR.AO)+E9(hR.AY)+E9(hR.Ag)+E9(hR.Ab)+E9(hR.An)+E9(hR.AJ)+E9(hR.AW)+E9(hR.AQ)+E9(hR.AG)+E9(hR.AR)+E9(hR.Al)+E9(hR.AV)+E9(hR.At)+E9(hR.AN)+E9(hR.AM)+E9(hR.Aw)+E9(hR.E0)+E9(hR.E1)+E9(hR.E2)+E9(hR.E3)+E9(hR.E4)+E9(hR.E5)+E9(hR.E6)+E9(hR.E7)+E9(hR.hl)+E9(hR.hV)+E9(hR.ht)+E9(hR.hN)+E9(hR.hw)+E9(hR.r0)+E9(hR.r1),'ztBKF':function(c,M){return c*M;},'qKuLz':E9(hR.r2)+E9(hR.r3)+E9(hR.r4)+E9(hR.r5)+E9(hR.r6)+E9(hR.r7),'UghUd':function(c,M){return c*M;},'GhhAE':E9(hR.r8)+E9(hR.r9)+E9(hR.rB)+E9(hR.rT)+E9(hR.rA)+E9(hR.rE)+E9(hR.rd)+E9(hR.rx)+E9(hR.rc)+E9(hR.rM)+E9(hR.rs),'IKDOR':E9(hR.rj)+E9(hR.rH)+E9(hR.rk)+E9(hR.ry)+E9(hR.rX)+E9(hR.rU)+E9(hR.rK),'JjtUg':E9(hR.rS)+E9(hR.rP),'YsTco':function(c,M){return c*M;},'tPquB':E9(hR.rI)+E9(hR.rh)+E9(hR.rr)+E9(hR.rC)+E9(hR.rL)+E9(hR.rv)+E9(hR.ra)+E9(hR.ri)+E9(hR.rF)+E9(hR.ru),'teKWF':function(c,M){return c*M;},'zyWzf':function(c,M){return c*M;},'lgNzU':E9(hR.rq)+E9(hR.rz)+E9(hR.rf)+E9(hR.rp)+E9(hR.ry)+E9(hR.rZ)+E9(hR.rD)+E9(hR.rm)+'p:','MIpFJ':E9(hR.rq)+E9(hR.re)+E9(hR.ro)+E9(hR.rO)+E9(hR.rY)+E9(hR.rg)+E9(hR.rb)+E9(hR.rn)+E9(hR.rJ)+E9(hR.rW)+E9(hR.rQ)+E9(hR.rG)+E9(hR.rR)+E9(hR.rl)+E9(hR.rV)+E9(hR.rt)+E9(hR.rN)+E9(hR.rw)+'h:','vtDrJ':function(c,M){return c*M;},'YAiTZ':E9(hR.r2)+E9(hR.C0),'qstLl':function(c,M){return c*M;},'AhhDn':E9(hR.r2)+E9(hR.C1)+E9(hR.C2),'VaTXZ':E9(hR.rI)+E9(hR.C3)+E9(hR.C4)+E9(hR.C5)+':','sJmEU':function(c,M){return c*M;},'MkTVQ':E9(hR.r2)+E9(hR.C6)+E9(hR.C7)+E9(hR.C8)+E9(hR.C9)+E9(hR.CB)+E9(hR.CT)+E9(hR.CA)+E9(hR.CE)+E9(hR.Cd)+E9(hR.Cx),'hjEbD':function(c,M){return c*M;},'FCHGK':E9(hR.r2)+E9(hR.Cc)+E9(hR.CM)+E9(hR.Cs)+E9(hR.Cj)+E9(hR.CH)+E9(hR.Ck)+E9(hR.Cy)+E9(hR.CX),'edZvi':function(c,M){return c*M;},'zbgCx':E9(hR.CU)+E9(hR.Cc)+E9(hR.CM)+E9(hR.CK)+E9(hR.r7),'WojYd':E9(hR.CS)+E9(hR.CP)+E9(hR.CI),'lzsxu':function(c,M){return c*M;},'gkHnE':E9(hR.r2)+E9(hR.Ch)+E9(hR.Cr),'rJpvR':function(c,M){return c*M;},'eyMJx':function(c,M){return c*M;},'dzbJB':E9(hR.CC)+E9(hR.C6)+E9(hR.CL)+E9(hR.Cv)+E9(hR.Ca)+E9(hR.Ci)+E9(hR.CF)+E9(hR.Cu)+E9(hR.Cq)+E9(hR.Cz)+E9(hR.Cf)+E9(hR.Cp)+E9(hR.CZ)+E9(hR.CD)+E9(hR.Cm)+E9(hR.Ce)+E9(hR.Co)+E9(hR.CO)+E9(hR.CY),'YQhkO':E9(hR.Cg)+E9(hR.Cb),'Symef':E9(hR.AT)+E9(hR.Cn)+E9(hR.CJ)+E9(hR.CW)+E9(hR.CQ)+E9(hR.CG)+E9(hR.AI)+E9(hR.CR)+E9(hR.Cl)+E9(hR.CV)+E9(hR.Ct)+E9(hR.CN)+E9(hR.Cw)+E9(hR.L0)+E9(hR.L1)+E9(hR.L2)+E9(hR.L3)+E9(hR.L4)+E9(hR.L5)+E9(hR.L6)+E9(hR.L7)+E9(hR.L8)+E9(hR.L9)+E9(hR.LB)+E9(hR.LT)+E9(hR.LA)+E9(hR.LE)+E9(hR.Ld)+E9(hR.Lx)+E9(hR.Lc)+E9(hR.LM)+E9(hR.Ls)+E9(hR.Lj)+E9(hR.LH)+E9(hR.Lk)+E9(hR.Ly)+'v>','htIFb':E9(hR.Am)+E9(hR.LX)+E9(hR.LU)+E9(hR.LK)+E9(hR.LS)+E9(hR.LP)+E9(hR.LI)+E9(hR.Lh)+E9(hR.Lr)+E9(hR.LC)+E9(hR.LL)+E9(hR.Lv)+E9(hR.La)+E9(hR.Li)+E9(hR.LF)+E9(hR.Lu)+E9(hR.Lq)+E9(hR.Lz)+E9(hR.Lf)+E9(hR.Lp)+E9(hR.LZ)+E9(hR.LD)+E9(hR.Lm)+E9(hR.Cn)+E9(hR.Le)+E9(hR.Lo)+E9(hR.LO)+E9(hR.LY)+E9(hR.Lg)+E9(hR.r4)+E9(hR.Lb)+E9(hR.Ln)+E9(hR.LJ)+E9(hR.LW)+E9(hR.LQ)+E9(hR.LG)+E9(hR.LR)+E9(hR.Ll)+E9(hR.LV)+E9(hR.Lt)+E9(hR.LN)+E9(hR.r6)+E9(hR.Lw)+E9(hR.v0)+E9(hR.v1)+E9(hR.v2)+E9(hR.v3)+E9(hR.v4)+E9(hR.v5)+E9(hR.v6)+E9(hR.v7)+E9(hR.v8)+E9(hR.v9)+E9(hR.vB)+E9(hR.vT)+E9(hR.vA)+E9(hR.vE)+E9(hR.vd)+E9(hR.vx)+E9(hR.vc)+E9(hR.vM)+E9(hR.vs)+E9(hR.vj)+E9(hR.vH)+E9(hR.vk)+E9(hR.vy)+E9(hR.vX)+E9(hR.vU)+E9(hR.vK)+E9(hR.vS)+E9(hR.vP)+E9(hR.vI)+E9(hR.vc)+E9(hR.AN)+E9(hR.vh)+E9(hR.vr)+E9(hR.vC)+E9(hR.vL)+E9(hR.vv)+E9(hR.va)+E9(hR.vi)+E9(hR.vF)+E9(hR.vu)+E9(hR.vq)+E9(hR.vz)+E9(hR.vf)+E9(hR.vp)+E9(hR.vZ)+E9(hR.vD)+E9(hR.vm)+E9(hR.ve)+E9(hR.vo)+E9(hR.vO)+E9(hR.vY)+E9(hR.vg)+E9(hR.vb)+E9(hR.vn)+E9(hR.vJ)+E9(hR.vW)+E9(hR.vQ)+(E9(hR.vG)+E9(hR.vR)+E9(hR.vl)+E9(hR.vV)+E9(hR.vt)+E9(hR.vN)+E9(hR.vw)+E9(hR.a0)+E9(hR.a1)+E9(hR.a2)+E9(hR.a3)+E9(hR.a4)+E9(hR.a5)+E9(hR.a6)+E9(hR.a7)+E9(hR.a8)+E9(hR.a9)+E9(hR.aB)+E9(hR.aT)+E9(hR.aA)+E9(hR.aE)+E9(hR.ad)+E9(hR.ax)+E9(hR.a7)+E9(hR.ac)+E9(hR.ry)+E9(hR.aM)+E9(hR.as)+E9(hR.rR)+E9(hR.aj)+E9(hR.aH)+E9(hR.rt)+E9(hR.ak)+E9(hR.ay)+E9(hR.aX)+E9(hR.aU)+E9(hR.aK)+E9(hR.aS)+E9(hR.aP)+E9(hR.aI)+E9(hR.ah)+E9(hR.ar)+E9(hR.aC)+E9(hR.aL)+E9(hR.Lm)+E9(hR.av)+E9(hR.aa)+E9(hR.ai)+E9(hR.aF)+E9(hR.au)+E9(hR.aq)+E9(hR.C0)+E9(hR.az)+E9(hR.af)+E9(hR.Lt)+E9(hR.ap)+E9(hR.aZ)+E9(hR.aD)+E9(hR.am)+E9(hR.ae)+E9(hR.ao)+E9(hR.aO)+E9(hR.aY)+E9(hR.aS)+E9(hR.va)+E9(hR.ag)+E9(hR.ab)+E9(hR.an)+E9(hR.aJ)+E9(hR.aW)+E9(hR.aQ)+E9(hR.aG)+E9(hR.rv)+E9(hR.aR)+E9(hR.al)+E9(hR.aV)+E9(hR.at)+E9(hR.aN)+E9(hR.aw)),'XrFyO':function(c,M){return c(M);},'zakFW':E9(hR.i0),'LiQbc':function(c,M){return c+M;},'SBDBu':function(c,M){return c+M;},'JyfIj':function(c,M){return c+M;},'pjYiL':function(c,M){return c+M;},'pyCIh':E9(hR.i1)+E9(hR.i2)+E9(hR.i3)+E9(hR.i4)+E9(hR.i5)+E9(hR.i6)+E9(hR.i7),'tlOjW':function(c,M){return c+M;},'XALcU':E9(hR.i8)+E9(hR.i9)+E9(hR.iB)+E9(hR.i7),'oumGQ':function(c,M){return c in M;},'ocEKJ':E9(hR.iT),'UFJkj':E9(hR.iA)+E9(hR.iE)+E9(hR.id)+E9(hR.ix)+E9(hR.ic)+E9(hR.iM)+E9(hR.is),'GJZoG':function(c,M){return c%M;},'hJhcT':function(c,M){return c+M;},'HQWsa':E9(hR.ij),'GaZZd':function(c,M){return c<M;},'BOzTE':function(c,M){return c(M);},'zytbn':function(c,M){return c|M;},'cUaDN':function(c,M){return c<<M;},'JslRx':function(c,M){return c&M;},'ekWnS':function(c,M){return c==M;},'ZXgzp':function(c,M){return c<M;},'AXiBN':function(c,M){return c<<M;},'vSKve':function(c,M){return c(M);},'lzJNf':function(c,M){return c<<M;},'uSOZN':function(c,M){return c<M;},'iOSri':function(c,M){return c==M;},'HGFON':function(c,M){return c(M);},'FgIWM':function(c,M){return c==M;},'wCYAt':function(c,M){return c|M;},'pfQhB':function(c,M){return c&M;},'mHTwa':function(c,M){return c(M);},'HWLAb':function(c,M){return c|M;},'fCNgn':function(c,M){return c==M;},'hdFub':function(c,M){return c<M;},'AlHVl':function(c,M){return c|M;},'neVCc':function(c,M){return c<<M;},'aEpGU':function(c,M){return c&M;},'jlPeH':function(c,M){return c==M;},'WLPVL':function(c,M){return c|M;},'TLqyv':function(c,M){return c==M;},'pGknF':function(c,M){return c-M;},'Ohmjy':function(c,M){return c(M);},'GIFFy':E9(hR.iH)+E9(hR.ik)+E9(hR.iy),'BZUMi':E9(hR.iX),'yZRWD':E9(hR.iU),'emiex':E9(hR.iK),'diWrp':function(c,M){return c>>>M;},'JqPLZ':function(c,M){return c+M;},'xOnTy':function(c){return c();},'WFVBB':function(c){return c();},'GhmVa':E9(hR.iS)+'+$','xFVHL':function(c,M){return c<=M;},'tGiYC':function(c,M){return c-M;},'PXPYe':function(c,M){return c+M;},'ngiPj':function(c,M){return c+M;},'kkiUa':function(c,M){return c+M;},'dQxTO':function(c,M){return c(M);},'XDhiR':function(c,M){return c-M;},'argmZ':function(c,M){return c-M;},'qQEnz':function(c,M){return c-M;},'XIexc':function(c,M){return c+M;},'vlaEY':function(c,M){return c==M;},'QmBnU':E9(hR.iP),'gGEPu':function(c,M){return c+M;},'vTyKj':function(c,M){return c+M;},'gzwFE':E9(hR.iI),'veoPZ':function(c,M){return c+M;},'skqlj':function(c,M){return c+M;},'owMRL':function(c,M){return c%M;},'rEwzv':function(c,M){return c%M;},'nfvOc':function(c,M){return c!=M;},'RskuA':E9(hR.ih),'upTWR':E9(hR.ir)+E9(hR.iC)+E9(hR.iL)+E9(hR.iv)+E9(hR.ia)+E9(hR.ii)+E9(hR.iF)+E9(hR.iu)+E9(hR.iq),'wRwnq':function(c,M,s){return c(M,s);},'pbcXp':function(c,M){return c<M;},'HVTbI':E9(hR.iz)+E9(hR.ip),'oLmPD':E9(hR.iZ),'EXLNF':E9(hR.iD)+'pe','gmAvs':E9(hR.im)+'r','HaRxP':E9(hR.ie),'MbUIM':function(c,M){return c!=M;},'kWkNI':function(c,M){return c<M;},'RZFTN':E9(hR.io),'mRvvR':E9(hR.iO),'RVJda':E9(hR.iY),'CeWJg':E9(hR.ig),'EThit':E9(hR.ib),'NplMY':E9(hR.iJ),'HkEkD':E9(hR.iW),'kNtGi':E9(hR.iQ),'GilQK':E9(hR.iG)+'pe','pHEXW':E9(hR.iR),'kUurC':E9(hR.il)+'xt','isVgn':function(c,M){return c(M);},'FLUIR':E9(hR.iV),'sZSjq':function(c,M){return c(M);},'HtLMT':E9(hR.it)+'n','GIAwH':function(c,M){return c(M);},'orIcu':E9(hR.iN)+'ck','kkUHy':E9(hR.iw),'rnJoB':function(c,M){return c(M);},'UZYxA':E9(hR.F0)+E9(hR.F1)+E9(hR.F2)+E9(hR.F3),'yOUJp':function(c){return c();},'sIDVj':E9(hR.F4),'UxJmf':E9(hR.F5)+E9(hR.F6),'OzCVg':E9(hR.F7)+E9(hR.F8)+E9(hR.F9)+E9(hR.FB)+E9(hR.FT),'Nzfnj':E9(hR.FA)+E9(hR.FE),'ovYeY':E9(hR.Fd)+'le','WHUqD':E9(hR.Ay)+E9(hR.Fx)+'n','OyKYS':E9(hR.Fc)+E9(hR.FM),'xUSmm':function(c,M,s){return c(M,s);},'FfkRM':E9(hR.Fs),'rFYFt':E9(hR.Fj),'BQbez':function(c,M){return c/M;},'ARLgU':E9(hR.FH),'Ykjgb':function(c,M,s,j){return c(M,s,j);},'ZUufX':E9(hR.Fk),'eqyPN':E9(hR.Fy),'zogGp':E9(hR.FX),'bgmQM':E9(hR.FU),'ESVHc':E9(hR.FK)+'5','FkBRa':function(c,M,s,j){return c(M,s,j);},'JBZAE':E9(hR.rZ)+E9(hR.FS),'LCrAo':function(c,M){return c+M;},'zKWEJ':E9(hR.FP),'PKOtc':E9(hR.FI),'PSDwa':function(c,M){return c===M;},'yaKQV':function(c,M){return c===M;},'sQMxJ':function(c,M){return c==M;},'uTcgx':E9(hR.Fh),'rlKCT':function(c,M){return c(M);},'qPiQf':E9(hR.Fr),'ZSFNT':E9(hR.FC),'hFFDM':E9(hR.FL),'OVgTG':E9(hR.Fv)+E9(hR.Fa),'JjikE':function(c,M){return c==M;},'HvRiY':E9(hR.Fv)+E9(hR.Fi),'cvibW':function(c,M){return c/M;},'WGphd':function(c,M){return c(M);},'EwwIq':E9(hR.FF)+E9(hR.Fu),'LyrNm':E9(hR.Fq)+E9(hR.Fz),'MBzpg':E9(hR.Ff)+E9(hR.Fp),'lLmLs':E9(hR.FZ),'sTMNX':E9(hR.FD)+E9(hR.Fm)+E9(hR.Fe)+E9(hR.Fo)+E9(hR.FO)+E9(hR.FY)+E9(hR.Fg),'toDJv':function(c,M,s){return c(M,s);},'JOgwp':E9(hR.Fb)+E9(hR.Fn),'Ftsxm':function(c,M){return c|M;},'ulNvM':function(c,M){return c|M;},'WOSQM':function(c,M){return c|M;},'qawsl':function(c,M){return c|M;},'BvVSU':function(c,M){return c<<M;},'VhYRm':function(c,M){return c<<M;},'qSzPE':E9(hR.FJ),'gMUAK':function(c,M){return c<<M;},'yOryZ':E9(hR.FW),'MaJnQ':E9(hR.FQ),'EjBJT':function(c,M){return c<<M;},'gUtbt':function(c,M){return c<<M;},'BuIED':E9(hR.FG),'DgOgZ':E9(hR.FR),'VjgKx':E9(hR.Fl),'zYQQl':function(c,M){return c|M;},'pXofy':function(c,M){return c|M;},'rJJsv':function(c,M){return c|M;},'dQemm':function(c,M){return c|M;},'jQyAb':function(c,M){return c|M;},'JBXSL':function(c,M){return c|M;},'EvezD':function(c,M){return c<<M;},'sniOO':E9(hR.FV)+E9(hR.Ft),'SrYIE':function(c,M){return c<<M;},'raxnM':E9(hR.FN)+E9(hR.Fw),'hKjyx':function(c,M){return c<<M;},'lZHXO':E9(hR.u0)+'s','VKKJe':E9(hR.u1)+E9(hR.u2),'wobdg':E9(hR.u3)+E9(hR.u4)+E9(hR.u5),'ooIHA':function(c,M){return c<<M;},'qZUai':E9(hR.u6),'jDSbe':function(c,M){return c<<M;},'PfqRU':E9(hR.u7),'kLkdP':function(c,M){return c+M;},'suBQw':function(c,M){return c|M;},'uzrew':function(c,M){return c|M;},'ZGrfY':function(c,M){return c|M;},'kiTAx':function(c,M){return c|M;},'sKFrX':function(c,M){return c|M;},'blmzz':E9(hR.u8),'vcCaw':E9(hR.u9)+'e','hkTTO':function(c,M){return c<<M;},'NskgZ':E9(hR.uB),'YEjOF':E9(hR.uT),'iVJqN':function(c,M){return c<<M;},'PzntG':E9(hR.uA)+'e','MKXgj':function(c,M){return c<<M;},'tEMWY':E9(hR.uE)+E9(hR.ud),'ThJLd':E9(hR.ux),'esIni':function(c,M){return c<<M;},'frlIf':E9(hR.uc)+E9(hR.uM)+'t','XRuZJ':function(c,M){return c<<M;},'sZSHt':E9(hR.us)+E9(hR.uj),'MVwAZ':E9(hR.uH)+'on','QgNRM':function(c,M){return c<<M;},'IrBVe':E9(hR.uk)+E9(hR.uy),'ylfuq':E9(hR.uX),'AFmWO':function(c,M){return c+M;},'GekME':function(c,M){return c+M;},'rcdZH':function(c,M){return c+M;},'QCVlC':function(c,M){return c+M;},'pCzFH':function(c,M){return c+M;},'zLBiH':function(c,M){return c+M;},'ZghOe':E9(hR.uU),'SSzEm':E9(hR.uK),'ggZyu':E9(hR.uS)+E9(hR.uP),'pqmfD':E9(hR.uI)+E9(hR.uh)+E9(hR.ur),'nuhYw':E9(hR.uC),'PwvsA':E9(hR.uL),'XodTU':E9(hR.uv),'kbqBW':function(c,M){return c+M;},'yGtoq':function(c,M){return c<<M;},'UIaLV':E9(hR.ua)+E9(hR.ui),'pGTrp':function(c,M){return c|M;},'UaFiW':function(c,M){return c|M;},'YrVau':E9(hR.uF)+E9(hR.uu),'lDuUK':E9(hR.uq),'tKYxf':E9(hR.uz)+E9(hR.uf),'kWSYO':E9(hR.up)+E9(hR.uZ),'ENGyA':E9(hR.uD),'EkuoT':function(c,M){return c+M;},'AgzQo':function(c,M,s,j){return c(M,s,j);},'ETbqC':E9(hR.um),'rsFXT':E9(hR.ue),'Jyced':E9(hR.uo),'JpvoC':E9(hR.uO),'wouYh':E9(hR.uY)+E9(hR.ug)+'3','sJaBe':E9(hR.ub)+E9(hR.un)+E9(hR.uJ)+E9(hR.uW),'ttAcp':E9(hR.uQ)+E9(hR.uG)+'7)','fRSrs':E9(hR.uR),'DrNvO':E9(hR.ul),'JQwQY':function(c,M){return c in M;},'yQtKd':E9(hR.uV)+'rt','YaFYQ':function(c,M,s){return c(M,s);},'unPld':E9(hR.ut),'duujP':E9(hR.uN)+E9(hR.ip),'aBQwX':function(c,M){return c!==M;},'LMxwH':E9(hR.uw),'xrVhm':E9(hR.q0)+E9(hR.q1),'oVKbt':E9(hR.q2),'ujYaX':E9(hR.q3)+E9(hR.q4),'kDwfm':function(c,M){return c!==M;},'Yvqow':E9(hR.q5)+'en','QmEyb':E9(hR.q6)+E9(hR.q7)+'ge','mEXDj':function(c,M){return c+M;},'QJRsL':function(c,M,s){return c(M,s);},'ThlKw':E9(hR.q8),'ywPBx':E9(hR.q9)+'e','DSkWw':E9(hR.qB),'TVrDJ':E9(hR.qT)+'n','LKtob':E9(hR.qA),'pimrc':function(c,M,s){return c(M,s);},'RycDN':E9(hR.qE),'AMBmi':E9(hR.qd)+'e','LvLpv':E9(hR.qx),'FlvLp':E9(hR.qc),'MPsqv':E9(hR.qM),'KSptt':E9(hR.qs),'HSYHr':E9(hR.qj),'udFhk':function(c,M){return c>>>M;},'QXqSG':function(c){return c();},'MHoeR':function(c,M){return c+M;},'QWSFh':function(c,M){return c+M;},'AmGFZ':function(c,M,s,j){return c(M,s,j);},'znbni':function(c,M){return c<<M;},'KJbgW':function(c,M){return c<M;},'XdQhh':function(c,M){return c+M;},'BXphu':function(c,M){return c<<M;},'gIYKo':function(c,M){return c|M;},'hXhAk':function(c,M){return c|M;},'DTAnU':function(c,M){return c<<M;},'EcmLm':function(c,M){return c<<M;},'tPeFw':function(c,M){return c<<M;},'sUHyr':E9(hR.qH),'PSwtz':E9(hR.qk),'BUEGQ':E9(hR.qy)+E9(hR.qX),'FsHqU':E9(hR.qU)+E9(hR.qK),'SiYcV':E9(hR.qS)+E9(hR.qP),'xxkFX':function(c,M){return c<M;},'RlJte':function(c,M){return c<<M;},'lxlvg':function(c,M){return c(M);},'qlVeB':E9(hR.qI),'mmgWd':E9(hR.qh),'rZnqt':function(c,M){return c(M);},'sKDpR':E9(hR.qr),'ZkcOA':E9(hR.qC),'CASbQ':E9(hR.qL),'ZbjjR':E9(hR.qv),'Ebnhe':E9(hR.qa),'JxfFY':E9(hR.qi),'WtqKx':E9(hR.qF),'UNhfx':E9(hR.qu)+'_','KyeMC':function(c,M){return c(M);},'hkyDc':function(c,M){return c<M;},'pRcjC':function(c,M){return c(M);}},T=(function(){var c=!![];return function(M,s){var Xl={B:0x52f},j=c?function(){var EB=B3;if(s){var H=s[EB(Xl.B)](M,arguments);return s=null,H;}}:function(){};return c=![],j;};}()),A={0x21c:function(M,j,H){'use strict';var U5={B:0x4b4,T:0x5a6},U3={B:0x5ad,T:0x452},ET=E9;var k={};k['B4']=function(){return P;},k['B5']=function(){return I;},k['B6']=function(){return h;},k['B7']=function(){return S;},(H['r'](j),H['d'](j,k));var y=B[ET(U6.B)](H,0x2*-0x38f+0xaef+-0x224),X=B[ET(U6.B)](H,-0xe3e*0x1+0x19ca+-0x2f*0x32),U=B[ET(U6.T)](H,0xe3e+0xc96+-0x18aa),K=B[ET(U6.B)](H,0x123c+-0x1*0x2122+0xa6*0x18),S=B[ET(U6.A)];function P(C,L){var EA=ET;K['B8'][K['B9']]&&(-0x1c8d+0x22e*0x3+0x1603,U['BB'])(C,location[EA(U3.B)])&&B[EA(U3.T)](h,C,L),(0xc31+0xa9d+-0x16ce,y['BT'])(S,L,0x4*0x4ea33+-0x24fb89*0x1+0xbf1*0x60d);}function I(C){var EE=ET;return B[EE(U4.B)](B[EE(U4.B)](C,'_'),S);}function h(C,L){var Ed=ET;C=(0x3ca+-0x1fd6+-0x4*-0x703,U['BA'])(C)[Ed(U5.B)],(-0x1*0xe54+-0x206f+-0x2ec3*-0x1,X['BE'])(B[Ed(U5.T)](I,C),L);}},0x2d1:function(c,M,s){var Uc={B:0x6bd},UA={B:0x7d3},U9={B:0x748},U7={B:0x4c3},Ex=E9,j={'iVvIu':B[Ex(Us.B)],'xZlSi':B[Ex(Us.T)],'xBVVh':function(k,X){var Ec=Ex;return B[Ec(U7.B)](k,X);},'EweDg':function(k,X){var EM=Ex;return B[EM(U8.B)](k,X);},'stiVk':function(k,X){var Es=Ex;return B[Es(U9.B)](k,X);},'eRagR':function(k,X){var Ej=Ex;return B[Ej(UB.B)](k,X);},'mWUCn':function(k,X){var EH=Ex;return B[EH(UT.B)](k,X);},'wVupV':function(k,y,X){var Ek=Ex;return B[Ek(UA.B)](k,y,X);},'qNDxH':function(k,X){var Ey=Ex;return B[Ey(UE.B)](k,X);},'hrZVG':function(k,X){var EX=Ex;return B[EX(Ud.B)](k,X);},'JbCjV':function(k,X){var EU=Ex;return B[EU(Ux.B)](k,X);},'TVZIt':function(k,X){var EK=Ex;return B[EK(Uc.B)](k,X);}},H=B[Ex(Us.A)](s,-0x300+0x7*0x4ae+-0x2*0xdd3)['B4'];c[Ex(Us.E)]={'Bd':function(k,y){var ES=Ex;for(var X=JSON[ES(UM.B)](j[ES(UM.T)]),U=j[ES(UM.A)],K=[],S='',P='',I=0xd*0x1d9+-0x1*-0x221b+0x3a20*-0x1;j[ES(UM.E)](I,k[ES(UM.x)]);I++)for(var C=k[I],L=-0x253d*0x1+0xc45*0x1+0x18f8;j[ES(UM.c)](L,X[ES(UM.M)]);L++)j[ES(UM.s)](X[L],j[ES(UM.j)](I,0x7f*-0x19+0x3bc*-0x5+-0xc*-0x297))&&(K[L]=C);for(S=K[ES(UM.H)](''),I=0x1478*-0x1+0x7ad*-0x5+-0x17*-0x28f;j[ES(UM.c)](I,S[ES(UM.k)])&&j[ES(UM.E)](I,U[ES(UM.M)]);I+=-0x1d2e+0x1460+0x8d0){var v=j[ES(UM.y)](j[ES(UM.X)](parseInt,S[ES(UM.U)](I,j[ES(UM.K)](I,-0x1a37*0x1+0x2b3*-0xe+0x4003)),0x2114+0x3b3*0x1+-0x24b7),j[ES(UM.S)](parseInt,U[ES(UM.U)](I,j[ES(UM.P)](I,0x1491+-0x2*-0x89+-0x7*0x317)),-0xb1*-0x2a+-0xd59+0x1*-0xfa1))[ES(UM.I)](0x1b95+0x21*0x89+0x1697*-0x2);P+=v=j[ES(UM.h)](0x1d3*0x13+0xf07+-0x31af,v[ES(UM.C)])?j[ES(UM.L)]('0',v):v;}j[ES(UM.S)](H,y,P);}};},0xaa:function(M,j,H){'use strict';var EP=E9;var k={};k['B8']=function(){return P;},k['Bx']=function(){return y;},k['Bc']=function(){return X;},k['BM']=function(){return U;},k['B9']=function(){return S;},k['Bs']=function(){return K;},H['d'](j,k);var y=window,X=y[EP(UK.B)],U=y[EP(UK.T)],K=B[EP(UK.A)],S=B[EP(UK.E)],P={},I=(P[S]=!(0x21cc+0xdf8+0x1*-0x2fc4),X[EP(UK.x)+EP(UK.c)]);if(!I){for(var C=X[EP(UK.M)+EP(UK.s)](B[EP(UK.j)]),L=-0x2a*0x62+0x5*-0x4d1+0x3*0xd63;B[EP(UK.H)](L,C[EP(UK.k)]);++L)if(B[EP(UK.y)](B[EP(UK.X)],C[L][EP(UK.U)+'te']('id'))){I=C[L];break;}}I&&B[EP(UK.K)](B[EP(UK.S)],I[EP(UK.P)+'te'](S))&&(P[S]=!(-0xd37+0xf8*-0x1+0xe30));},0x1ad:function(c,M,s){'use strict';var EI=E9;var j={};j['BT']=function(){return y;},s['d'](M,j);var H=B[EI(UI.B)](s,0xdac+-0x1be*0x13+-0x2b3*-0x8),k=B[EI(UI.T)](s,0x5d*-0x6+0x1678+0x10*-0x13a);function y(X,U,K,S){var Eh=EI,S=S||(0x6f*0x35+-0x1b4+-0x1547,H['cd'])(),P=B[Eh(UP.B)](B[Eh(UP.T)],typeof K)?((P=new Date())[Eh(UP.A)](B[Eh(UP.E)](P[Eh(UP.x)](),K)),P[Eh(UP.c)+'g']()):K;k['Bc'][Eh(UP.M)]=B[Eh(UP.s)](B[Eh(UP.j)](B[Eh(UP.H)](B[Eh(UP.k)](B[Eh(UP.y)](B[Eh(UP.X)](X,'='),U),B[Eh(UP.U)]),P),B[Eh(UP.K)]),S);}},0x25e:function(M,j,H){'use strict';var Um={B:0x445,T:0x1e8,A:0x103,E:0x62d,x:0x7a3,c:0x758,M:0x65f,s:0x452},UZ={B:0x2ba,T:0x46a,A:0x6a7,E:0x7a3},Up={B:0x5cb},UF={B:0x5cb},UC={B:0x300},Ur={B:0x565},Uh={B:0x55d},Er=E9,k={'lYVCl':B[Er(Ue.B)],'rgbKQ':function(L,v){var EC=Er;return B[EC(Uh.B)](L,v);},'mXiRv':function(L,v){var EL=Er;return B[EL(Ur.B)](L,v);},'KKfww':function(L,v){var Ev=Er;return B[Ev(UC.B)](L,v);},'BoAgO':function(L){var Ea=Er;return B[Ea(UL.B)](L);},'bZxXT':function(L,v,F){var Ei=Er;return B[Ei(Uv.B)](L,v,F);}};var y={};y['Bj']=function(){return C;},y['BE']=function(){return h;},H['d'](j,y);var X='||',U=void(0x1ada+0x534+-0x200e);function K(){var EF=Er;this[EF(UF.B)]={};}function S(){var Uu={B:0x29c,T:0x119,A:0x65f};return U=U||((function(){var Eu=B3;try{var L=k[Eu(Uu.B)];return localStorage[Eu(Uu.T)](L,L),localStorage[Eu(Uu.A)](L),0x2086+-0x17*-0xdd+-0x20*0x1a3;}catch(v){}}())?localStorage:new K());}K[Er(Ue.T)][Er(Ue.A)]=function(L,v){var Eq=Er;this[Eq(Uz.B)][L]=v;},K[Er(Ue.T)][Er(Ue.E)]=function(L){var Ez=Er;return this[Ez(Uf.B)][L];},K[Er(Ue.x)][Er(Ue.c)]=function(L){var Ef=Er;delete this[Ef(Up.B)][L];};var P={};function I(L,v){var Ep=Er;return v=k[Ep(UZ.B)](v,0x25dd24+-0x2fa4e6+0x253f02),k[Ep(UZ.T)](k[Ep(UZ.A)](L,X),k[Ep(UZ.A)](new Date()[Ep(UZ.E)](),v));}function h(L,v,F){var EZ=Er,u=k[EZ(UD.B)](S);v=k[EZ(UD.T)](I,v,F),P[L]=v,u[EZ(UD.A)](L,v);}function C(L){var ED=Er,v,F,u=B[ED(Um.B)](S),q=P[L]||u[ED(Um.T)](L);return q?(F=(v=q[ED(Um.A)](X))[-0x23c0+-0x5d1*0x1+0x2992])&&B[ED(Um.E)](new Date()[ED(Um.x)](),B[ED(Um.c)](parseInt,F))?(u[ED(Um.M)](L),void delete P[L]):(P[L]=q,v[0x26fe+-0x14af+-0x6d*0x2b]):(P[L]=B[ED(Um.s)](I,'',-0x4b80c+-0x40244+0xd4e30),'');}},0x22a:function(M,j,H){'use strict';var KE={B:0x144,T:0x466,A:0x5f4,E:0x1ee,x:0x1ee,c:0x1ee,M:0x178,s:0x4b4,j:0x4b4,H:0x26c,k:0x682,y:0x682},KT={B:0x682,T:0x274,A:0x37a,E:0x15f,x:0x17f},K9={B:0x1d3,T:0x74b,A:0x6cc,E:0x74a,x:0x128,c:0x425,M:0x5ad,s:0x74a,j:0x5ad,H:0x425,k:0x5ad,y:0x682,X:0x4b4,U:0x307,K:0x194,S:0x4e0,P:0x534,I:0x686,h:0x534,C:0x353,L:0x399,v:0x700,a:0x5ad},Uw={B:0xf9},UN={B:0x3bf},UV={B:0x59e},Ul={B:0x418},UQ={B:0x6d4},UW={B:0x5ee},UJ={B:0x43b},Un={B:0x580},Ub={B:0x482},Uo={B:0x394},Eb=E9,k={'xAxkw':function(q,z){var Em=B3;return B[Em(Uo.B)](q,z);},'pMLhh':function(q,z){var Ee=B3;return B[Ee(UO.B)](q,z);},'vkhrk':function(q,z){var Eo=B3;return B[Eo(UY.B)](q,z);},'LYLqI':function(q,z){var EO=B3;return B[EO(Ug.B)](q,z);},'ftoTF':function(q,z){var EY=B3;return B[EY(Ub.B)](q,z);},'sgQAL':function(q,z){var Eg=B3;return B[Eg(Un.B)](q,z);},'EfucP':B[Eb(Kx.B)],'ktqxp':B[Eb(Kx.T)],'FcLZT':function(q,z){var En=Eb;return B[En(UJ.B)](q,z);},'OWKCU':function(q,z){var EJ=Eb;return B[EJ(UW.B)](q,z);},'GPYGT':B[Eb(Kx.A)],'xQXQq':function(q,z){var EW=Eb;return B[EW(UQ.B)](q,z);},'CSMAW':B[Eb(Kx.E)],'gEfTB':function(q,z){var EQ=Eb;return B[EQ(UG.B)](q,z);},'jaDzX':function(q,z){var EG=Eb;return B[EG(UR.B)](q,z);},'IuCtX':function(q,z){var ER=Eb;return B[ER(Ul.B)](q,z);},'WBEaD':function(q,z){var El=Eb;return B[El(UV.B)](q,z);},'DLbRm':function(q,z){var EV=Eb;return B[EV(Ut.B)](q,z);},'sMchw':function(q,z){var Et=Eb;return B[Et(UN.B)](q,z);},'fDVFh':function(q,z){var EN=Eb;return B[EN(Uw.B)](q,z);},'oLFlm':function(q,z){var Ew=Eb;return B[Ew(K0.B)](q,z);}};var y={};y['BH']=function(){return C;},y['Bk']=function(){return I;},y['BB']=function(){return v;},y['cd']=function(){return S;},y['By']=function(){return L;},y['BA']=function(){return P;},y['BX']=function(){return F;},H['d'](j,y);var X=B[Eb(Kx.x)](H,-0x1*-0xcb5+-0xbe1*0x1+0x3*-0xe),U={},K=/^(ac\.cn|ac\.id|ah\.cn|bj\.cn|club\.tw|co\.id|co\.jp|co\.kr|co\.nz|co\.uk|com\.cn|com\.hk|com\.mo|com\.my|com\.sg|com\.tw|cq\.cn|ebiz\.tw|edu\.cn|edu\.hk|edu\.mo|edu\.tw|fj\.cn|game\.tw|gd\.cn|go\.id|gov\.cn|gov\.hk|gov\.mo|gov\.my|gov\.ph|gov\.tw|gs\.cn|gx\.cn|gz\.cn|ha\.cn|hb\.cn|he\.cn|hi\.cn|hk\.cn|hl\.cn|hn\.cn|idv\.hk|idv\.tw|jl\.cn|js\.cn|jx\.cn|ln\.cn|mil\.cn|mil\.tw|mo\.cn|net\.cn|net\.hk|net\.mo|net\.tw|nm\.cn|nx\.cn|org\.cn|org\.hk|org\.mo|org\.tw|qh\.cn|sc\.cn|sd\.cn|sh\.cn|sn\.cn|sx\.cn|tj\.cn|tw\.cn|us\.org|xj\.cn|xz\.cn|yn\.cn|zj\.cn)$/;function S(){var d0=Eb,q,z,f=X['Bc'][d0(K8.B)][d0(K8.T)][d0(K8.A)](':')[-0x88*0x21+0x30*0x3c+-0x86*-0xc];return U[f]?f=U[f]:k[d0(K8.E)](0x19d3+-0x21fb+0x6e*0x13,z=(q=f[d0(K8.x)]('.'))[d0(K8.c)])&&!/^(\d+\.)*\d+$/[d0(K8.M)](f)&&(f=k[d0(K8.s)](k[d0(K8.j)](q[k[d0(K8.H)](z,0x2*-0x362+0x248b+0x1dc5*-0x1)],'.'),q[k[d0(K8.k)](z,-0x1ce0+0x63*0x27+0xdcc)]),K[d0(K8.y)](f))&&(f=k[d0(K8.s)](k[d0(K8.X)](q[k[d0(K8.U)](z,0x12d*0x1b+-0x13b2*-0x1+-0x336e)],'.'),f)),f;}function P(q){var d1=Eb,z=X['Bc'][d1(K9.B)+d1(K9.T)](k[d1(K9.A)]);return z[d1(K9.E)]=k[d1(K9.x)],z[d1(K9.c)][d1(K9.M)]=q,z[d1(K9.s)]=z[d1(K9.E)],(q=z[d1(K9.c)])[d1(K9.j)]=z[d1(K9.H)][d1(K9.k)],{'protocol':q[d1(K9.y)],'host':q[d1(K9.X)],'hostname':q[d1(K9.U)],'port':q[d1(K9.K)],'pathname':k[d1(K9.S)]('/',q[d1(K9.P)][d1(K9.I)](-0x9ef+0x1*0xed7+-0x4*0x13a,-0x1d4+-0x11f*-0x1d+-0x1eae))?q[d1(K9.h)]:k[d1(K9.C)]('/',q[d1(K9.P)]),'search':q[d1(K9.L)],'hash':q[d1(K9.v)],'BU':q[d1(K9.a)]};}function I(q,z){var d2=Eb;if(B[d2(KB.B)](-0x161f+-0xc45*-0x2+0x1*-0x26b,Object[d2(KB.T)](z)[d2(KB.A)])){var f,Z='';for(f in z)Z+=B[d2(KB.E)](B[d2(KB.x)](B[d2(KB.c)](B[d2(KB.M)](encodeURIComponent,f),'='),B[d2(KB.s)](encodeURIComponent,z[f])),'&');if(Z=Z[d2(KB.j)](-0xf86+-0x2*0x11b6+-0x32f2*-0x1,B[d2(KB.H)](Z[d2(KB.k)],0x5fa*0x3+0x1*-0x19ab+-0x7be*-0x1)),B[d2(KB.y)](0x1*0x228d+0x87c+-0x2b09,q[d2(KB.X)]))q=B[d2(KB.U)]('?',Z);else{for(var D=q[d2(KB.j)](0x112d+0x14dd+0x1*-0x2609)[d2(KB.K)]('&'),m=[],O=Object[d2(KB.S)](z),Y=-0x1f24+0x1cac+-0x4*-0x9e;B[d2(KB.P)](Y,D[d2(KB.I)]);Y++)f=B[d2(KB.h)](decodeURIComponent,D[Y][d2(KB.K)]('=',-0x31f*-0x1+-0x7e6+0x4c8)[-0x3*-0x2b9+-0xff1+-0x3e3*-0x2]),B[d2(KB.C)](-(-0x6b+0x228d+0x2221*-0x1),O[d2(KB.L)](f))&&m[d2(KB.v)](D[Y]);q=B[d2(KB.a)](B[d2(KB.i)]('?',B[d2(KB.F)](0x22+0x1*-0x7e2+0x7c0,m[d2(KB.u)])?'':B[d2(KB.i)](m[d2(KB.q)]('&'),'&')),Z);}}return q;}function C(q){var d3=Eb;return!(!q[d3(KT.B)]||k[d3(KT.T)](k[d3(KT.A)],q[d3(KT.B)])&&k[d3(KT.E)](k[d3(KT.x)],q[d3(KT.B)]));}function L(q,z){var d4=Eb,f=k[d4(KA.B)](C,q),Z=q[d4(KA.T)];return f&&k[d4(KA.A)](0xddb+-0x1*0x11a6+0x3cb,Z[d4(KA.E)]('/'))&&(Z=q[d4(KA.x)][d4(KA.c)](-0x1c8e+0x22db+-0x1a*0x3e)),k[d4(KA.M)](k[d4(KA.s)](k[d4(KA.j)](k[d4(KA.H)](q[d4(KA.k)],f?'':k[d4(KA.y)]('//',q[d4(KA.X)])),Z),q[d4(KA.U)]),z?'':q[d4(KA.K)]);}function v(q,z){var d5=Eb;return k[d5(KE.B)](X['Bx'][d5(KE.T)],X['Bx'][d5(KE.A)])||!(k[d5(KE.E)](C,q=k[d5(KE.x)](P,q))||(z=k[d5(KE.c)](P,z),k[d5(KE.M)](q[d5(KE.s)],z[d5(KE.j)])&&k[d5(KE.H)](q[d5(KE.k)],z[d5(KE.y)])));}function F(q,z){var d6=Eb,f=B[d6(Kd.B)][d6(Kd.T)]('|'),Z=0x11b*-0x7+0x2563+-0x2b2*0xb;while(!![]){switch(f[Z++]){case'0':return m[d6(Kd.A)]=B[d6(Kd.E)](0x147f+-0x1*-0x705+-0x1b84,O[d6(Kd.x)])?'':B[d6(Kd.c)]('?',O[d6(Kd.M)]('&')),B[d6(Kd.s)](L,m);case'1':var D=m[d6(Kd.j)][d6(Kd.H)](-0x1932+-0x16ad+-0x17f*-0x20)[d6(Kd.k)]('&');continue;case'2':var m=B[d6(Kd.y)](P,q);continue;case'3':for(var O=[],Y=-0x1fa1+0x1655+0x94c;B[d6(Kd.X)](Y,D[d6(Kd.U)]);++Y)B[d6(Kd.K)](-0x5*0x581+0x152f+0x656,D[Y][d6(Kd.S)](B[d6(Kd.P)](z,'=')))&&O[d6(Kd.I)](D[Y]);continue;case'4':if(B[d6(Kd.h)](0xd08+0x791+-0x1499,D[d6(Kd.C)]))return q;continue;case'5':if(B[d6(Kd.E)](-(-0x1a2f+-0x20*0x9b+0xf3*0x30),q[d6(Kd.L)](B[d6(Kd.v)](z,'='))))return q;continue;case'6':if(!m[d6(Kd.a)])return q;continue;}break;}}}},E={};function x(c){var d7=E9,M=E[c],s={};return s[d7(Kc.B)]={},(B[d7(Kc.T)](void(-0x4*-0x3b7+0x16a6+-0x2582),M)||(M=E[c]=s,A[c](M,M[d7(Kc.B)],x)),M[d7(Kc.A)]);}x['d']=function(c,M){var d8=E9;for(var s in M)x['BK'](M,s)&&!x['BK'](c,s)&&Object[d8(KM.B)+d8(KM.T)](c,s,{'enumerable':!(0x81*-0x3b+0xa88+-0x5*-0x3d7),'get':M[s]});},x['BK']=function(c,M){var d9=E9;return Object[d9(Ks.B)][d9(Ks.T)+d9(Ks.A)][d9(Ks.E)](c,M);},x['r']=function(c){var dB=E9,M={};M[dB(Kj.B)]=!(-0x2009+0xe3*-0x7+0x263e),(B[dB(Kj.T)](B[dB(Kj.A)],typeof Symbol)&&Symbol[dB(Kj.E)+'g']&&Object[dB(Kj.x)+dB(Kj.c)](c,Symbol[dB(Kj.E)+'g'],{'value':B[dB(Kj.M)]}),Object[dB(Kj.x)+dB(Kj.s)](c,B[dB(Kj.j)],M));},!(function(){'use strict';var hg={B:0x546,T:0x4ec,A:0x687},hY={B:0x645,T:0x3d2,A:0x1c5,E:0x61f,x:0x679,c:0x559,M:0x165,s:0x725,j:0x5a2,H:0x162,k:0x56b,y:0x7bc,X:0x789,U:0x457,K:0x77c,S:0x78a,P:0x64b,I:0x4b8,h:0x6c1,C:0x72e,L:0x24c,v:0x7d7,a:0x324,i:0x15b,F:0x7e6,u:0x219,q:0x6da,z:0x3f8,f:0x429,p:0x195,Z:0x465,D:0x72a,m:0x4c2,e:0x6c8,o:0x3b9,O:0x52e,Y:0x5b1,g:0x639,b:0x511,n:0x418,J:0x2db,W:0x604,Q:0x15b,G:0x4ef,R:0x482,l:0x7d7,V:0x5b1,t:0x742,N:0x706,w:0x2c3,B0:0x7be,B1:0x244,T6:0x622,T7:0x2e9,T8:0x1f1,T9:0x767,TB:0x5e5,TT:0x4c6,TA:0x15a,TE:0x669,Td:0x1f1,Tx:0x2de,Tc:0x64f,TM:0x382,Ts:0x2d4,Tj:0x371,TH:0x244,Tk:0x71d,Ty:0x1ae,TX:0x1af,TU:0x559,TK:0x382,TS:0x149,TP:0x71d,TI:0x767,Th:0x27a,Tr:0x35f,TC:0x563,TL:0x2ee,Tv:0x566,Ta:0x377,Ti:0x51c,TF:0x371,Tu:0x2d1,Tq:0x490,Tz:0x2d4,Tf:0x302,Tp:0x34e,TZ:0x5f3,TD:0x1d3,Tm:0x74b,Te:0x1da,To:0x74a,TO:0x5e1,TY:0x68a,Tg:0x5ce,Tb:0x425,Tn:0x459},hO={B:0x546,T:0x172,A:0x66e,E:0x3c1,x:0x704,c:0x1ca,M:0x12c,s:0xd6,j:0x28a,H:0x431,k:0x4d5,y:0x2e6,X:0x103,U:0x4e9,K:0x103,S:0xf8},ho={B:0x273,T:0xd6,A:0x3f2,E:0xd6,x:0xd6,c:0x494,M:0x55c,s:0x763},he={B:0x546,T:0x4ec,A:0x3eb,E:0x4ec,x:0x687,c:0x573,M:0x588,s:0x6c5,j:0x74a,H:0x502},hm={B:0x6d2,T:0x704,A:0x6ad,E:0x51e,x:0x47c,c:0x620,M:0x62b,s:0x678,j:0x570,H:0xf6,k:0x50d,y:0x399,X:0x399,U:0x4cc,K:0x1a2,S:0x493,P:0x39a,I:0x51e,h:0x412,C:0x620,L:0x309,v:0x386,a:0x4bb,i:0x278,F:0x60a,u:0x50d,q:0x34b,z:0x327,f:0x154},hq={B:0x715},hi={B:0x276,T:0xf2,A:0x3ff,E:0x799,x:0x6a4,c:0x37f,M:0x645,s:0x3d2,j:0x61f,H:0x679,k:0x645,y:0x67f,X:0x679,U:0x3e0,K:0x370,S:0x18a,P:0x340,I:0x743,h:0x602,C:0x4c9,L:0x484,v:0x20e,a:0x589,i:0x645,F:0x675,u:0x44c,q:0x5f9,z:0x61f,f:0x679,p:0x20c,Z:0x402,D:0xf1,m:0x546,e:0x4ec,o:0x11e,O:0x546,Y:0x11e,g:0x74a,b:0xc7,n:0x256,J:0x6f3,W:0x3f9,Q:0x2da},ha={B:0xf1},hr={B:0x4ce,T:0x773,A:0x205,E:0x704,x:0x71c,c:0x773,M:0x27e,s:0x2bd,j:0x5fa,H:0x209},hh={B:0x3e8},hS={B:0x71c,T:0x773,A:0x5fa,E:0x2f7,x:0x550},hH={B:0x49e},hs={B:0x365,T:0x7a0,A:0xd6,E:0x4ab},hc={B:0x670,T:0x19e,A:0x4ba,E:0x554,x:0x4d6,c:0x293,M:0x293,s:0x61d,j:0x61d,H:0x751,k:0x68a,y:0x39a,X:0x327,U:0x154},IQ={B:0x268,T:0x53a,A:0x4ba,E:0x53a,x:0x4ba,c:0x19e,M:0x4ba},Ib={B:0x2dd},Ig={B:0x78e},IO={B:0x7e0},Io={B:0x191},Ie={B:0x5b5},ID={B:0x3fd,T:0x193,A:0x528,E:0xd6,x:0x146,c:0x496,M:0x226,s:0x112,j:0x7a0,H:0x77e,k:0x496,y:0x7e7,X:0x5c5,U:0x707,K:0x193,S:0x7a0,P:0xd6,I:0x217,h:0x6b2,C:0x5c5,L:0x286,v:0x193,a:0x394,i:0xd6,F:0x180,u:0x1cb,q:0x7a0,z:0xd6,f:0x6ac,p:0x1e5,Z:0x273,D:0x193,m:0x75f,e:0x13a,o:0x607,O:0x29d,Y:0xd6,g:0x526,b:0x281,n:0x151,J:0x57a,W:0x699,Q:0x237,G:0x62e,R:0x62c,l:0x575,V:0x4f3,t:0x617,N:0x29d,w:0x65b,B0:0x496,B1:0x463,T6:0x3d4,T7:0x496,T8:0xcb,T9:0x19f,TB:0x6d1,TT:0x381,TA:0x151,TE:0xd6,Td:0x7e4,Tx:0x496,Tc:0x3db,TM:0x240,Ts:0xd6,Tj:0x4dc,TH:0x4b4,Tk:0x343,Ty:0x1ba,TX:0x2c5,TU:0x6d4,TK:0x1ba,TS:0x1e5,TP:0x103,TI:0x690,Th:0x59a,Tr:0x704,TC:0x143,TL:0x3d6,Tv:0x135,Ta:0x58a,Ti:0x476,TF:0x7c1,Tu:0x1d3,Tq:0x74b,Tz:0x5d4,Tf:0x67d,Tp:0x23e,TZ:0x1ad,TD:0x179,Tm:0x66f,Te:0x459,To:0x5ce,TO:0x5c5,TY:0x7bc,Tg:0x2ad,Tb:0x2b8,Tn:0x7a3,TJ:0x135,TW:0x5f1,TQ:0x56b,TG:0xe8,TR:0x773,Tl:0x43b,TV:0x370,Tt:0x286,TN:0x5b7,Tw:0x370,A0:0x18a,A1:0x2da,A2:0x18a,A3:0x2da,A4:0x2da,A5:0x317,A6:0x135,A7:0x423,A8:0x11b,A9:0x189,AB:0x189,AT:0x5e8,AA:0x240,AE:0xd6,Ad:0x5e4,Ax:0xd6,Ac:0x3e6},IZ={B:0x58a,T:0x502,A:0x476,E:0x7c1,x:0x143,c:0x3d6},If={B:0x655,T:0x784,A:0x45d,E:0x2f4,x:0x70a,c:0x39a,M:0x329},Iz={B:0x636,T:0x784,A:0x45d,E:0x2f4,x:0x70a,c:0x39a,M:0x4eb},Iu={B:0x126,T:0x1ab,A:0x45d,E:0x2f4,x:0x70a,c:0x39a,M:0x1ab},Ih={B:0x4bf,T:0x4bf,A:0x795,E:0x5e2,x:0x39a,c:0x4bf,M:0x5e8},IX={B:0x675,T:0x678,A:0x62b,E:0x145,x:0x62b,c:0x3c2,M:0x7df,s:0x52f,j:0x62b,H:0x7df,k:0x4bf,y:0x4bf,X:0x406,U:0x603,K:0x5d1,S:0x4bf,P:0x406,I:0x704,h:0x39a,C:0x5e2,L:0x39a},IM={B:0x1d8},Ix={B:0x26b},Id={B:0x12c},IE={B:0x275},IT={B:0x3cb},I1={B:0x204,T:0x53d,A:0x291,E:0x7a0,x:0x746,c:0x64e,M:0x2d8,s:0x27f,j:0x58d,H:0x736,k:0xf5,y:0x445,X:0x7a3,U:0x4b4,K:0x399},Pt={B:0x380,T:0x704,A:0x487,E:0x633,x:0x755,c:0x611,M:0x2a1},PV={B:0x4b4,T:0x613},Pl={B:0x5bc,T:0x4b4,A:0x5c4},PR={B:0x232,T:0x4b4},PQ={B:0x5ad,T:0x4b4,A:0x78e,E:0x399,x:0x399},PW={B:0x4b4,T:0x5ad,A:0xf3},Pn={B:0x238,T:0x663,A:0x16d,E:0x34c,x:0x112,c:0xda,M:0x7a3,s:0x5e8,j:0x320,H:0x4e7,k:0x1c3,y:0x620,X:0x4ad},Pb={B:0x79f,T:0x5cc,A:0x620,E:0x7dc,x:0x528,c:0x4d4,M:0x787,s:0x48c,j:0x663,H:0x240,k:0x59f,y:0x204,X:0x4fb,U:0x5cc,K:0x1d6,S:0x3bd,P:0x7aa,I:0x6ab,h:0x3e4,C:0x11f,L:0x175,v:0x7a3,a:0x5e8,i:0x482,F:0x608,u:0x162,q:0x3ad,z:0x457,f:0x4c2,p:0x748,Z:0x5cc,D:0x459},Pg={B:0x663,T:0x71f,A:0x103,E:0x103,x:0x718,c:0x487,M:0x718,s:0x320,j:0x3a0,H:0x1e0,k:0x5d2,y:0x3da,X:0xf3,U:0x4bb,K:0x169,S:0x232,P:0x59f,I:0x68d,h:0x336,C:0x7aa,L:0x594,v:0x1ff,a:0x336,i:0x11f,F:0x755,u:0x7a3,q:0x5e8,z:0x3da,f:0x169,p:0x1d8,Z:0x72d,D:0x4cd,m:0x53f,e:0x7aa,o:0x585,O:0x336},PY={B:0x663,T:0x29d,A:0x59f,E:0x7aa,x:0x11f,c:0x43b,M:0x68a,s:0x68a,j:0x41d,H:0x68a,k:0x606,y:0x300,X:0x716,U:0x13c,K:0x1bf,S:0x770,P:0xf9,I:0x4f1,h:0x7a3,C:0x50d,L:0x54c,v:0x5e8,a:0x6f4,i:0x465,F:0x195,u:0x480,q:0x72e,z:0x78a,f:0x508,p:0x273,Z:0x6ba,D:0x620,m:0x174},PO={B:0x663,T:0x4c3,A:0x103,E:0x13c,x:0x78a,c:0x58d,M:0x219,s:0x219,j:0x3b3,H:0x263,k:0x64d,y:0x5a6,X:0x2f9,U:0x15b,K:0x36b,S:0x118,P:0x59f,I:0x7aa,h:0x11f,C:0x43b,L:0x68a,v:0x68a,a:0x41d,i:0x606,F:0x465,u:0x716,q:0x2d8,z:0x1bf,f:0x580,p:0x580,Z:0x4d4,D:0x7a3,m:0x55b,e:0x5e8,o:0x72e,O:0x7d1,Y:0x7d7,g:0x2ad,b:0x698},Pe={B:0x5b9,T:0x704},Pm={B:0x333,T:0x725,A:0x7d1,E:0x482,x:0x23f,c:0x13c,M:0x565,s:0x754,j:0x704,H:0x704,k:0x7de,y:0x15e,X:0x6c1,U:0x639,K:0x15b,S:0x685,P:0x704,I:0x1b2,h:0x58d,C:0x6bd,L:0x511,v:0x72e,a:0x27f,i:0x59e,F:0x511,u:0x23f,q:0x422,z:0x46d,f:0x754,p:0x754,Z:0x637,D:0x300,m:0x23f,e:0x72a,o:0x163,O:0x3e2,Y:0x4c2,g:0x3ad,b:0x46d,n:0x754,J:0x754},PD={B:0x7d3,T:0x698},PZ={B:0x33c,T:0x238,A:0x7ef,E:0x52f},Pp={B:0x137,T:0x399,A:0x252,E:0x6e2,x:0x252},Pq={B:0x47e,T:0x546,A:0x29e,E:0x572},PF={B:0x5d0,T:0xc6,A:0x5d0,E:0xc6,x:0x502,c:0x732},Pi={B:0x59f,T:0x7cf},Pv={B:0x5cf,T:0x445,A:0x5e8,E:0x190,x:0x4c7,c:0x452,M:0x30c},PL={B:0x231},PC={B:0x4dc},Pr={B:0x112,T:0x358,A:0x7cf},Ph={B:0x507,T:0xea,A:0x7cf},PP={B:0x257,T:0x3c8,A:0x2e2,E:0x541,x:0x541,c:0x3ec,M:0x1a1,s:0x61a,j:0x749,H:0x10f,k:0x1e4,y:0x1a6,X:0x749,U:0x137,K:0x693,S:0x694,P:0x63c,I:0x312,h:0x2cf,C:0x17d,L:0x5ef,v:0x649,a:0x595,i:0x694,F:0x730,u:0x595,q:0x7dc,z:0x575,f:0x76e,p:0x118,Z:0x5ae,D:0x41a,m:0x41a,e:0x3b3,o:0x5ca,O:0x76e,Y:0x796,g:0x304,b:0x741,n:0x770,J:0x705,W:0x741,Q:0x3b3,G:0x634,R:0x5bc,l:0x5c6,V:0x741,t:0x1d1,N:0x626,w:0x741,B0:0x454,B1:0x499,T6:0x51f,T7:0x5ae,T8:0x20d,T9:0x693,TB:0x772,TT:0x5d9,TA:0x6f2,TE:0x4dc,Td:0x61b,Tx:0x7dc,Tc:0x6aa,TM:0x584,Ts:0x4aa,Tj:0x5de,TH:0x4e6,Tk:0x1bb,Ty:0x5bc,TX:0x295},PU={B:0x74f,T:0x439,A:0x112},PX={B:0x2fb,T:0x78e,A:0xd6,E:0x5e7,x:0x1a1,c:0x61a,M:0x733,s:0x766,j:0x1a1,H:0x776},PH={B:0x3de},Pc={B:0xe6},PE={B:0x79c},PA={B:0x4e1},PB={B:0x59a},P6={B:0x6d4},P5={B:0x1e7},P4={B:0x367},P3={B:0x578},P1={B:0x40d},P0={B:0x1e7},Sw={B:0x423},SN={B:0x473},St={B:0x12b},SV={B:0x529},SR={B:0x5f6},SG={B:0x291},SW={B:0x75c},SJ={B:0x4c3},Sn={B:0x291},Sb={B:0x290},Sg={B:0x59e},SO={B:0x22e},So={B:0x6df},Sm={B:0x366},SZ={B:0x53c},Sf={B:0x317},Sz={B:0x43b},Sq={B:0x531},Su={B:0x2c7},Si={B:0x426},Sv={B:0x26d},SL={B:0x24c},SC={B:0x39c},Sr={B:0x445},Sh={B:0x12f},SI={B:0x5a6},SS={B:0x3e4},Sk={B:0x2fc},Sj={B:0x454},Ss={B:0xd0},SM={B:0x47d},Sd={B:0x394},ST={B:0x4e1},SB={B:0x445},S8={B:0x5b8},S7={B:0x443},S6={B:0x2ae},S5={B:0x55d},S2={B:0x12b},S1={B:0x498},S0={B:0x19f},Kw={B:0x5e1},KN={B:0x6fd},Kt={B:0x4c8},KV={B:0x280},KJ={B:0x7a0},Ko={B:0x2b5},Ke={B:0x7a8},Km={B:0x317},KD={B:0x792},KZ={B:0x665},Kp={B:0x4d4},Kq={B:0x63c},Ku={B:0x290},Ki={B:0x649},Ka={B:0x1b5},KL={B:0x79c},KC={B:0x248},KS={B:0x175},KK={B:0x29d},KX={B:0x29d},Kk={B:0x2c8},KH={B:0x286},dT=E9,B0={'eQYOI':B[dT(hG.B)],'LqHWZ':function(AW,AQ){var dA=dT;return B[dA(KH.B)](AW,AQ);},'HLjIw':function(AW,AQ){var dE=dT;return B[dE(Kk.B)](AW,AQ);},'NuybU':function(AW,AQ){var dd=dT;return B[dd(Ky.B)](AW,AQ);},'ljgZJ':B[dT(hG.T)],'Kpcju':function(AW,AQ){var dx=dT;return B[dx(KX.B)](AW,AQ);},'YcDab':function(AW,AQ){var dc=dT;return B[dc(KU.B)](AW,AQ);},'jDSPJ':function(AW,AQ){var dM=dT;return B[dM(KK.B)](AW,AQ);},'btwTE':function(AW,AQ){var ds=dT;return B[ds(KS.B)](AW,AQ);},'Husfo':function(AW,AQ){var dj=dT;return B[dj(KP.B)](AW,AQ);},'NWQhN':function(AW,AQ){var dH=dT;return B[dH(KI.B)](AW,AQ);},'uzXaE':function(AW,AQ){var dk=dT;return B[dk(Kh.B)](AW,AQ);},'Bmuco':function(AW,AQ){var dy=dT;return B[dy(Kr.B)](AW,AQ);},'jnXoI':function(AW,AQ){var dX=dT;return B[dX(KC.B)](AW,AQ);},'IYNPy':function(AW,AQ){var dU=dT;return B[dU(KL.B)](AW,AQ);},'pkwwU':function(AW,AQ){var dK=dT;return B[dK(Kv.B)](AW,AQ);},'zuIUP':function(AW,AQ){var dS=dT;return B[dS(Ka.B)](AW,AQ);},'jaIqS':function(AW,AQ){var dP=dT;return B[dP(Ki.B)](AW,AQ);},'XNJlT':function(AW,AQ){var dI=dT;return B[dI(KF.B)](AW,AQ);},'vaIlK':function(AW,AQ){var dh=dT;return B[dh(Ku.B)](AW,AQ);},'choUO':function(AW,AQ){var dr=dT;return B[dr(Kq.B)](AW,AQ);},'LpqVd':function(AW,AQ){var dC=dT;return B[dC(Kz.B)](AW,AQ);},'pqrjD':function(AW,AQ){var dL=dT;return B[dL(Kf.B)](AW,AQ);},'oRXsE':function(AW,AQ){var dv=dT;return B[dv(Kp.B)](AW,AQ);},'EKbgh':function(AW,AQ){var da=dT;return B[da(KZ.B)](AW,AQ);},'jrJiP':function(AW,AQ){var di=dT;return B[di(KD.B)](AW,AQ);},'bHQMI':function(AW,AQ){var dF=dT;return B[dF(Km.B)](AW,AQ);},'LvsyV':function(AW,AQ){var du=dT;return B[du(Ke.B)](AW,AQ);},'jnuJl':function(AW,AQ){var dq=dT;return B[dq(Ko.B)](AW,AQ);},'DhSdu':function(AW,AQ){var dz=dT;return B[dz(KO.B)](AW,AQ);},'UoUux':function(AW,AQ){var df=dT;return B[df(KY.B)](AW,AQ);},'mYkfJ':function(AW,AQ){var dp=dT;return B[dp(Kg.B)](AW,AQ);},'vxoMq':function(AW,AQ){var dZ=dT;return B[dZ(Kb.B)](AW,AQ);},'yDrTq':function(AW,AQ){var dD=dT;return B[dD(Kn.B)](AW,AQ);},'uhYli':function(AW,AQ){var dm=dT;return B[dm(KJ.B)](AW,AQ);},'RQnYy':function(AW,AQ){var de=dT;return B[de(KW.B)](AW,AQ);},'tGLli':function(AW,AQ){var dO=dT;return B[dO(KQ.B)](AW,AQ);},'ttHcp':function(AW,AQ){var dY=dT;return B[dY(KG.B)](AW,AQ);},'fRVtT':function(AW,AQ){var dg=dT;return B[dg(KR.B)](AW,AQ);},'ZYUpA':function(AW,AQ){var db=dT;return B[db(Kl.B)](AW,AQ);},'lijRZ':function(AW,AQ){var dn=dT;return B[dn(KV.B)](AW,AQ);},'fJlrA':function(AW,AQ){var dJ=dT;return B[dJ(Kt.B)](AW,AQ);},'DEdMO':function(AW,AQ){var dW=dT;return B[dW(KN.B)](AW,AQ);},'bxLbF':function(AW,AQ){var dQ=dT;return B[dQ(Kw.B)](AW,AQ);},'pAaMl':function(AW,AQ){var dG=dT;return B[dG(S0.B)](AW,AQ);},'Nvbtb':function(AW,AQ){var dR=dT;return B[dR(S1.B)](AW,AQ);},'BNEJO':function(AW,AQ){var dl=dT;return B[dl(S2.B)](AW,AQ);},'DkOeH':function(AW,AQ){var dV=dT;return B[dV(S3.B)](AW,AQ);},'QAvdX':function(AW,AQ){var dt=dT;return B[dt(S4.B)](AW,AQ);},'jLZLR':B[dT(hG.A)],'wmDyO':B[dT(hG.E)],'yqNdO':B[dT(hG.x)],'hovck':B[dT(hG.c)],'YMYyM':function(AW,AQ){var dN=dT;return B[dN(S5.B)](AW,AQ);},'UJiim':function(AW,AQ){var dw=dT;return B[dw(S6.B)](AW,AQ);},'jaAzq':function(AW,AQ){var x0=dT;return B[x0(S7.B)](AW,AQ);},'ChRIY':function(AW){var x1=dT;return B[x1(S8.B)](AW);},'EJbfW':function(AW){var x2=dT;return B[x2(S9.B)](AW);},'fgJSb':B[dT(hG.M)],'ymgOk':function(AW){var x3=dT;return B[x3(SB.B)](AW);},'GwvgQ':B[dT(hG.s)],'RmGdm':function(AW,AQ){var x4=dT;return B[x4(ST.B)](AW,AQ);},'KmNzl':function(AW,AQ){var x5=dT;return B[x5(SA.B)](AW,AQ);},'OQuqB':function(AW,AQ){var x6=dT;return B[x6(SE.B)](AW,AQ);},'vlvyl':function(AW,AQ){var x7=dT;return B[x7(Sd.B)](AW,AQ);},'aHxoY':function(AW,AQ){var x8=dT;return B[x8(Sx.B)](AW,AQ);},'dAzJT':function(AW,AQ){var x9=dT;return B[x9(Sc.B)](AW,AQ);},'suluv':function(AW,AQ){var xB=dT;return B[xB(SM.B)](AW,AQ);},'OgaXD':function(AW,AQ){var xT=dT;return B[xT(Ss.B)](AW,AQ);},'DxfJw':function(AW,AQ){var xA=dT;return B[xA(Sj.B)](AW,AQ);},'ufhvD':function(AW,AQ){var xE=dT;return B[xE(SH.B)](AW,AQ);},'OSJPN':function(AW,AQ){var xd=dT;return B[xd(Sk.B)](AW,AQ);},'YLxNE':function(AW,AQ){var xx=dT;return B[xx(Sy.B)](AW,AQ);},'dVsXK':function(AW,AQ){var xc=dT;return B[xc(SX.B)](AW,AQ);},'ovnOC':function(AW,AQ){var xM=dT;return B[xM(SU.B)](AW,AQ);},'DoHYl':function(AW,AQ){var xs=dT;return B[xs(SK.B)](AW,AQ);},'NBTOl':function(AW,AQ){var xj=dT;return B[xj(SS.B)](AW,AQ);},'UHYZO':function(AW){var xH=dT;return B[xH(SP.B)](AW);},'rIFZV':function(AW,AQ){var xk=dT;return B[xk(SI.B)](AW,AQ);},'HmYWw':function(AW,AQ){var xy=dT;return B[xy(Sh.B)](AW,AQ);},'cgLxR':B[dT(hG.j)],'ywTcR':function(AW){var xX=dT;return B[xX(Sr.B)](AW);},'taHGF':function(AW,AQ){var xU=dT;return B[xU(SC.B)](AW,AQ);},'YoFSP':function(AW,AQ){var xK=dT;return B[xK(SL.B)](AW,AQ);},'mnFTl':function(AW,AQ){var xS=dT;return B[xS(Sv.B)](AW,AQ);},'zycPw':B[dT(hG.H)],'xTJvQ':function(AW,AQ){var xP=dT;return B[xP(Sa.B)](AW,AQ);},'jGYfk':function(AW,AQ){var xI=dT;return B[xI(Si.B)](AW,AQ);},'XqEZj':function(AW,AQ){var xh=dT;return B[xh(SF.B)](AW,AQ);},'bgPCX':function(AW,AQ){var xr=dT;return B[xr(Su.B)](AW,AQ);},'KiZwk':function(AW,AQ){var xC=dT;return B[xC(Sq.B)](AW,AQ);},'nJhnm':B[dT(hG.k)],'NCCnt':function(AW,AQ){var xL=dT;return B[xL(Sz.B)](AW,AQ);},'ryOMs':function(AW,AQ){var xv=dT;return B[xv(Sf.B)](AW,AQ);},'ZKjWE':B[dT(hG.y)],'hZSqJ':function(AW,AQ){var xa=dT;return B[xa(Sp.B)](AW,AQ);},'hUuTH':function(AW,AQ){var xi=dT;return B[xi(SZ.B)](AW,AQ);},'LCaZx':B[dT(hG.X)],'EjVuc':function(AW,AQ){var xF=dT;return B[xF(SD.B)](AW,AQ);},'XrRki':B[dT(hG.U)],'PyKDt':function(AW,AQ,AG){var xu=dT;return B[xu(Sm.B)](AW,AQ,AG);},'rDOjb':function(AW,AQ){var xq=dT;return B[xq(Se.B)](AW,AQ);},'eUBsh':B[dT(hG.K)],'lWhJo':B[dT(hG.S)],'EATMb':B[dT(hG.P)],'XaFOF':B[dT(hG.I)],'GfmXQ':function(AW,AQ){var xz=dT;return B[xz(So.B)](AW,AQ);},'UvuLD':B[dT(hG.h)],'yJWtt':B[dT(hG.C)],'qETLa':function(AW,AQ){var xf=dT;return B[xf(SO.B)](AW,AQ);},'JboAo':function(AW,AQ){var xp=dT;return B[xp(SY.B)](AW,AQ);},'aajzY':function(AW,AQ){var xZ=dT;return B[xZ(Sg.B)](AW,AQ);},'caoao':B[dT(hG.L)],'ykLQz':B[dT(hG.v)],'cmLaA':B[dT(hG.a)],'FogIh':B[dT(hG.i)],'vqFyU':B[dT(hG.F)],'qMCPN':B[dT(hG.u)],'BFCjy':B[dT(hG.q)],'FuRty':B[dT(hG.z)],'nTdSR':function(AW,AQ){var xD=dT;return B[xD(Sb.B)](AW,AQ);},'UwlfI':B[dT(hG.f)],'ocRYn':B[dT(hG.p)],'WklbX':B[dT(hG.Z)],'dFRbP':function(AW,AQ){var xm=dT;return B[xm(Sn.B)](AW,AQ);},'cKQaK':function(AW,AQ){var xe=dT;return B[xe(SJ.B)](AW,AQ);},'GZOtv':function(AW,AQ){var xo=dT;return B[xo(SW.B)](AW,AQ);},'sFQZy':B[dT(hG.D)],'aIIOU':function(AW,AQ){var xO=dT;return B[xO(SQ.B)](AW,AQ);},'sgkjt':function(AW,AQ){var xY=dT;return B[xY(SG.B)](AW,AQ);},'kCGey':B[dT(hG.m)],'deqxt':function(AW,AQ){var xg=dT;return B[xg(SR.B)](AW,AQ);},'JMzLJ':B[dT(hG.e)],'JgPfP':B[dT(hG.o)],'MKNEH':function(AW,AQ){var xb=dT;return B[xb(Sl.B)](AW,AQ);},'tURqS':B[dT(hG.O)],'wIqjW':function(AW){var xn=dT;return B[xn(SV.B)](AW);},'JhGzf':B[dT(hG.Y)],'RFMvL':B[dT(hG.g)],'QndOl':function(AW,AQ){var xJ=dT;return B[xJ(St.B)](AW,AQ);},'SvOIA':B[dT(hG.b)],'OEtnC':B[dT(hG.n)],'NBiXb':B[dT(hG.J)],'mMjEq':B[dT(hG.W)],'MsiNN':B[dT(hG.Q)],'UHmGB':function(AW,AQ,AG){var xW=dT;return B[xW(SN.B)](AW,AQ,AG);},'IvOPb':function(AW,AQ){var xQ=dT;return B[xQ(Sw.B)](AW,AQ);},'VmPqZ':function(AW,AQ){var xG=dT;return B[xG(P0.B)](AW,AQ);},'HuDuJ':B[dT(hG.G)],'yzasN':B[dT(hG.R)],'AZtze':function(AW,AQ){var xR=dT;return B[xR(P1.B)](AW,AQ);},'nebwQ':B[dT(hG.l)],'QldHM':function(AW,AQ,AG,AR){var xl=dT;return B[xl(P2.B)](AW,AQ,AG,AR);},'RWdmw':B[dT(hG.V)],'TFMas':B[dT(hG.t)],'tXYgB':B[dT(hG.N)],'elkYR':B[dT(hG.w)],'TjDit':B[dT(hG.B0)],'wcWei':function(AW,AQ,AG,AR){var xV=dT;return B[xV(P3.B)](AW,AQ,AG,AR);},'IuNnX':B[dT(hG.B1)],'RWOGw':function(AW,AQ){var xt=dT;return B[xt(P4.B)](AW,AQ);},'lrNlG':function(AW,AQ){var xN=dT;return B[xN(P5.B)](AW,AQ);},'aGUCy':B[dT(hG.T6)],'AOgcl':B[dT(hG.T7)],'mWysP':function(AW,AQ){var xw=dT;return B[xw(P6.B)](AW,AQ);},'itpYh':function(AW,AQ){var c0=dT;return B[c0(P7.B)](AW,AQ);},'sTtNb':function(AW,AQ){var c1=dT;return B[c1(P8.B)](AW,AQ);},'wNdHW':B[dT(hG.T8)],'pPlUQ':function(AW,AQ){var c2=dT;return B[c2(P9.B)](AW,AQ);},'vzOFB':B[dT(hG.T9)],'ckAhf':function(AW,AQ){var c3=dT;return B[c3(PB.B)](AW,AQ);},'UQPOr':function(AW,AQ){var c4=dT;return B[c4(PT.B)](AW,AQ);},'Lgdhd':function(AW,AQ){var c5=dT;return B[c5(PA.B)](AW,AQ);},'bjBDV':function(AW,AQ){var c6=dT;return B[c6(PE.B)](AW,AQ);},'sztqw':B[dT(hG.TB)],'SDAGr':B[dT(hG.TT)],'gthrt':B[dT(hG.TA)],'hmDBm':B[dT(hG.TE)],'IHrpe':function(AW,AQ){var c7=dT;return B[c7(Pd.B)](AW,AQ);},'LMYfk':function(AW,AQ){var c8=dT;return B[c8(Px.B)](AW,AQ);},'PlQeA':B[dT(hG.Td)],'sZHeN':function(AW,AQ){var c9=dT;return B[c9(Pc.B)](AW,AQ);}};var T6,T7,T8=B[dT(hG.Tx)](x,0x15ab+-0x473*-0x5+-0x29c0),T9=B[dT(hG.Tc)](x,-0x1c43+-0x12cb+0x30bb),TB=T6={'BS':function(AW,AQ){var PM={B:0x348,T:0x18e},cB=dT;if(B0[cB(Ps.B)](null,AW))return'';var AG=T6['BP'](AW,0x1b9a+-0x1978+-0x21c,function(AR){var cT=cB;return B0[cT(PM.B)][cT(PM.T)](AR);});if(AQ)return AG;switch(B0[cB(Ps.T)](AG[cB(Ps.A)],0x1085*0x2+-0x305*0x9+-0x5d9*0x1)){default:case-0x24a1*-0x1+-0x3e+-0xcf*0x2d:return AG;case 0xe75*0x1+-0x6d0+-0x1*0x7a4:return B0[cB(Ps.E)](AG,B0[cB(Ps.x)]);case 0x2286+0xe85+0x1*-0x3109:return B0[cB(Ps.E)](AG,'==');case-0x2f*0x22+0xee*0x19+-0x1*0x10fd:return B0[cB(Ps.E)](AG,'=');}},'BP':function(AW,AQ,AG){var cA=dT;if(B0[cA(Pj.B)](null,AW))return'';for(var AR,Al,AV,At,AN={},Aw={},E0='',E1=-0x1*-0x23d+-0x908+0x6cd,E2=0x2554+0x827*0x1+-0x2d78,E3=-0xb28+0x1*0xf43+-0x419*0x1,E4=[],E5=-0x1*-0x24b6+0x1a4c+0xa*-0x64d,E6=0x6f3+0x18e2+0x1*-0x1fd5,E7=0xeb6+-0x9a7+0x25*-0x23;B0[cA(Pj.T)](E7,AW[cA(Pj.A)]);E7+=0x1911*0x1+0x110*-0x14+-0x7a*0x8)if(AV=AW[cA(Pj.E)](E7),Object[cA(Pj.x)][cA(Pj.c)+cA(Pj.M)][cA(Pj.s)](AN,AV)||(AN[AV]=E2++,Aw[AV]=!(-0x15af+-0x248a+-0xba5*-0x5)),At=B0[cA(Pj.j)](E0,AV),Object[cA(Pj.H)][cA(Pj.k)+cA(Pj.y)][cA(Pj.s)](AN,At))E0=At;else{if(Object[cA(Pj.X)][cA(Pj.U)+cA(Pj.y)][cA(Pj.K)](Aw,E0)){if(B0[cA(Pj.S)](E0[cA(Pj.P)](0x25c1+0xb*-0x369+-0x3e),0x748+-0x4a3+-0x1a5)){for(AR=-0x250b+-0xf3b+0x3446;B0[cA(Pj.I)](AR,E3);AR++)E5<<=-0x1b3*0x3+-0x136c+0x1886,B0[cA(Pj.B)](E6,B0[cA(Pj.h)](AQ,0x10c2+-0x1*-0x2317+0xa8*-0x4f))?(E6=-0x981+-0xaa1+-0x3*-0x6b6,E4[cA(Pj.C)](B0[cA(Pj.L)](AG,E5)),E5=-0x1fa3+0x1d*0x137+-0x398):E6++;for(Al=E0[cA(Pj.v)](-0xfc2+0x1beb+-0xc29),AR=0xde7*-0x1+-0xaa3+0x188a;B0[cA(Pj.a)](AR,-0x1230+0x1*0xe3+0x1155);AR++)E5=B0[cA(Pj.i)](B0[cA(Pj.F)](E5,0x110a*0x1+0x26c5*0x1+0x2*-0x1be7),B0[cA(Pj.u)](-0x1d74+0xf*-0x1bb+0x2*0x1bb5,Al)),B0[cA(Pj.q)](E6,B0[cA(Pj.h)](AQ,0x647*-0x4+0xd65*0x1+0xbb8))?(E6=0xd*-0x259+0x1*0x1fab+-0x1*0x126,E4[cA(Pj.C)](B0[cA(Pj.L)](AG,E5)),E5=0xb*-0x2ab+-0x1525+0x327e):E6++,Al>>=0x811+0x6d0*-0x2+0x590;}else{for(Al=-0x11f5+-0x786+0x197c,AR=-0x3*0x91d+-0x7f4+0x234b;B0[cA(Pj.z)](AR,E3);AR++)E5=B0[cA(Pj.i)](B0[cA(Pj.f)](E5,0x1172+-0x10ba+0x1*-0xb7),Al),B0[cA(Pj.B)](E6,B0[cA(Pj.h)](AQ,-0x2134+0xd5b+0x69e*0x3))?(E6=-0x1fb9+0x3b3*0x6+0x987,E4[cA(Pj.C)](B0[cA(Pj.p)](AG,E5)),E5=-0x1bed*-0x1+0x2394+-0x3f81*0x1):E6++,Al=-0x1995+0x19a0+-0xb;for(Al=E0[cA(Pj.P)](0x7d2+0xd0c*-0x2+-0x923*-0x2),AR=-0x5*0x502+0x1910+-0x6;B0[cA(Pj.Z)](AR,-0x1192+0x3*0x33d+-0x1*-0x7eb);AR++)E5=B0[cA(Pj.D)](B0[cA(Pj.m)](E5,-0x1f79+-0x216+0x2190),B0[cA(Pj.u)](-0x880+0x162*-0x1b+0x92b*0x5,Al)),B0[cA(Pj.q)](E6,B0[cA(Pj.h)](AQ,-0x1258+-0xc4*0x23+0x5b*0x7f))?(E6=0x60b*0x1+-0x11db*-0x1+-0x17e6,E4[cA(Pj.e)](B0[cA(Pj.o)](AG,E5)),E5=0x652*-0x3+-0xb*-0x1c+0x11c2):E6++,Al>>=0x902*0x1+-0x7*-0x4e1+-0x1594*0x2;}B0[cA(Pj.O)](0x2146+-0xc*0x56+0x26*-0xc5,--E1)&&(E1=Math[cA(Pj.Y)](0x2375+0x10f5+-0x3468,E3),E3++),delete Aw[E0];}else{for(Al=AN[E0],AR=-0x5fd+-0xf10+-0x11*-0x13d;B0[cA(Pj.g)](AR,E3);AR++)E5=B0[cA(Pj.b)](B0[cA(Pj.n)](E5,0x25e8+0xcbf+0x1953*-0x2),B0[cA(Pj.u)](0x86+0xb*-0x6+0x1*-0x43,Al)),B0[cA(Pj.J)](E6,B0[cA(Pj.W)](AQ,-0x1f*-0x83+0x1d13+0x1*-0x2cef))?(E6=-0x64f+-0x45*0x16+0xc3d,E4[cA(Pj.C)](B0[cA(Pj.Q)](AG,E5)),E5=0x189e+0x12f4+-0x2b92):E6++,Al>>=-0x2*0x368+0x9*0x279+0x34*-0x4c;}B0[cA(Pj.G)](-0x2*0xbcf+0xad5*-0x3+0x381d,--E1)&&(E1=Math[cA(Pj.Y)](0x396+0x9*-0x3cd+0x1*0x1ea1,E3),E3++),AN[At]=E2++,E0=B0[cA(Pj.R)](String,AV);}if(B0[cA(Pj.l)]('',E0)){if(Object[cA(Pj.x)][cA(Pj.V)+cA(Pj.y)][cA(Pj.t)](Aw,E0)){if(B0[cA(Pj.I)](E0[cA(Pj.P)](0x3d5+-0x26ce+0x4ff*0x7),-0x997+0xbc+0x3*0x349)){for(AR=-0x6f*-0x21+0xe*0xf7+-0x1*0x1bd1;B0[cA(Pj.a)](AR,E3);AR++)E5<<=-0x7*0x225+-0x1*0x217b+0x307f,B0[cA(Pj.N)](E6,B0[cA(Pj.h)](AQ,0x1ec8+-0x19f*-0xb+-0x309c))?(E6=-0x5*-0x314+0xa6*-0x1f+0x6*0xc9,E4[cA(Pj.w)](B0[cA(Pj.L)](AG,E5)),E5=-0x3e6+0xb9e+-0x7b8):E6++;for(Al=E0[cA(Pj.B0)](-0x1*0x151f+-0xa84+-0x59*-0x5b),AR=0x2090*0x1+-0x3e*-0x14+-0x2568;B0[cA(Pj.I)](AR,-0x13db+-0x3b*-0x1d+0xd34);AR++)E5=B0[cA(Pj.B1)](B0[cA(Pj.T6)](E5,-0xb1c+-0x4ef*-0x1+0x62e),B0[cA(Pj.T7)](-0x3e*-0x6b+-0xc*-0x19f+-0x2d5d,Al)),B0[cA(Pj.T8)](E6,B0[cA(Pj.T9)](AQ,-0x1d99*-0x1+-0xb44*0x1+-0x1254))?(E6=0x6cf*0x5+-0x2*-0xb66+0x1*-0x38d7,E4[cA(Pj.TB)](B0[cA(Pj.TT)](AG,E5)),E5=-0x1e2b+-0xdd*-0x2c+-0x7d1):E6++,Al>>=-0x7dc+0x1840*-0x1+0x201d;}else{for(Al=0x1532+0x1be4+0x5*-0x9d1,AR=0x22a3*-0x1+-0x1f91+0x4234;B0[cA(Pj.z)](AR,E3);AR++)E5=B0[cA(Pj.TA)](B0[cA(Pj.TE)](E5,0x1b13+0xc00+-0x2712),Al),B0[cA(Pj.Td)](E6,B0[cA(Pj.Tx)](AQ,0x7e*-0x6+-0x5*0x393+-0x7c*-0x2b))?(E6=-0x2120+0x770+0x19b0,E4[cA(Pj.C)](B0[cA(Pj.Tc)](AG,E5)),E5=-0x15a9+-0x6*-0x1b6+-0x1*-0xb65):E6++,Al=-0x149b+0x6ca*0x2+-0x707*-0x1;for(Al=E0[cA(Pj.TM)](-0x17ef+0x1a34+-0x245),AR=-0x11b6+-0x25ba+0x3770;B0[cA(Pj.Ts)](AR,0x3d4+-0x20c5*0x1+0x1d01);AR++)E5=B0[cA(Pj.B1)](B0[cA(Pj.Tj)](E5,-0x2d*-0x6c+0x968+-0x2b*0xa9),B0[cA(Pj.TH)](0x1fbf+0xb3*0x17+0xff1*-0x3,Al)),B0[cA(Pj.Tk)](E6,B0[cA(Pj.Tx)](AQ,0x1a32*-0x1+-0x180a+0x323d))?(E6=0xcf*-0x1b+-0x9c3+0xc*0x2a2,E4[cA(Pj.Ty)](B0[cA(Pj.TX)](AG,E5)),E5=-0x1*-0x176f+-0x1968*-0x1+-0x30d7):E6++,Al>>=0x1*-0x2077+0x97*0x26+0xa0e;}B0[cA(Pj.Tk)](-0x33*-0x69+0x3e*0x1a+-0x1*0x1b37,--E1)&&(E1=Math[cA(Pj.TU)](0xb8d+-0x1f37+0x13ac,E3),E3++),delete Aw[E0];}else{for(Al=AN[E0],AR=0xb52+0x9b2+-0x1504;B0[cA(Pj.TK)](AR,E3);AR++)E5=B0[cA(Pj.TS)](B0[cA(Pj.TP)](E5,-0x21a5+0x1174+-0x3*-0x566),B0[cA(Pj.TI)](0x8d9*0x1+-0x94a+-0x3*-0x26,Al)),B0[cA(Pj.Th)](E6,B0[cA(Pj.Tr)](AQ,0x1d*0x133+-0x240c+0x146))?(E6=0x4*-0x552+-0x24c+-0x3*-0x7dc,E4[cA(Pj.TC)](B0[cA(Pj.TL)](AG,E5)),E5=-0x705+-0x1b5e+0x2263*0x1):E6++,Al>>=0x17f*-0xe+-0x1128+-0x1*-0x261b;}B0[cA(Pj.Tv)](-0x7*0x251+-0x1*-0x8e2+0x1*0x755,--E1)&&(E1=Math[cA(Pj.Y)](0x13b0+-0x7*0x54c+-0x22*-0x83,E3),E3++);}for(Al=0x25d4+0x7fe+-0x5ba*0x8,AR=-0x2105*-0x1+0x1*0x1897+-0x1*0x399c;B0[cA(Pj.Ta)](AR,E3);AR++)E5=B0[cA(Pj.Ti)](B0[cA(Pj.TE)](E5,-0x2571+-0x93c+0x32*0xef),B0[cA(Pj.TF)](-0x13*0x18a+0xa5d*0x2+-0x3*-0x2d7,Al)),B0[cA(Pj.Tu)](E6,B0[cA(Pj.Tq)](AQ,-0x1629+0x8b9+-0x6f*-0x1f))?(E6=0x1450+0x1feb+0x1169*-0x3,E4[cA(Pj.Tz)](B0[cA(Pj.Tf)](AG,E5)),E5=0x13*0x9d+0x7c8+-0x136f):E6++,Al>>=0x11d*0x4+-0x261+-0x212*0x1;for(;;){if(E5<<=0xd89+0x9bc+-0x4*0x5d1,B0[cA(Pj.Tp)](E6,B0[cA(Pj.TZ)](AQ,0x2553+0x1*0x130d+-0x385f))){E4[cA(Pj.TD)](B0[cA(Pj.Tm)](AG,E5));break;}E6++;}return E4[cA(Pj.Te)]('');}},TT=B[dT(hG.TM)](x,0x11ea+0x2ba*-0x2+0xbcc*-0x1);function TA(AW){var PK={B:0x159},Pk={B:0x55b},cx=dT,AQ={'UNduK':function(E0,E1){var cE=B3;return B[cE(PH.B)](E0,E1);},'sbmGR':B[cx(PP.B)],'lZsea':function(E0,E1){var cc=cx;return B[cc(Pk.B)](E0,E1);}};function AG(E0){return E0?0x9*-0x34b+-0x23*-0x41+0x14c1:-0x14c8+0x8*-0x2dd+0x2bb0;}var AR='';try{AR=TT['Bc'][cx(PP.T)+cx(PP.A)][cx(PP.E)+'te']&&TT['Bc'][cx(PP.T)+cx(PP.A)][cx(PP.x)+'te'](B[cx(PP.c)]);}catch(E0){}var Al,AV=-0xd0e+0x1e99*-0x1+0x95*0x4b,At=(TT['Bx'][cx(PP.M)+cx(PP.s)]&&Object[cx(PP.j)](TT['Bc'])[cx(PP.H)](function(E1){var cM=cx,E2=TT['Bx'][cM(PX.B)][E1];(B0[cM(PX.T)](-0x1*0xcd1+-0x177b+0x244c,E1[cM(PX.A)](B0[cM(PX.E)]))||E2&&E2[cM(PX.x)+cM(PX.c)](B0[cM(PX.M)])&&E2[cM(PX.x)+cM(PX.c)](B0[cM(PX.s)])&&E2[cM(PX.j)+cM(PX.c)](B0[cM(PX.H)]))&&(AV=0xac7*0x3+-0x1b1*-0xb+-0x32ef);}),B[cx(PP.k)](-0x1699+-0x1d44+-0x1*-0x33de,AV)&&(Al=new RegExp(B[cx(PP.y)]),Object[cx(PP.X)](TT['Bx'])[cx(PP.H)](function(E1){var cs=cx;AQ[cs(PU.B)](AQ[cs(PU.T)],E1)&&!Al[cs(PU.A)](E1)||(AV=-0x1ffc+0x1843*-0x1+0x3840);})),new Date()),AN=-0x8*0x1cf+-0x92b+0x17a3;At[cx(PP.U)]=function(){var cj=cx;if(AQ[cj(PK.B)](0x1*0x14bf+0x1c8b*-0x1+0x4a*0x1b,++AN))return'';},T7&&B[cx(PP.K)](T7,At);var Aw=0x1*-0x2252+0x1*0x1d59+0x4f9,Aw=B[cx(PP.S)](Aw=B[cx(PP.P)](Aw=B[cx(PP.P)](Aw=B[cx(PP.P)](Aw=B[cx(PP.I)](Aw=B[cx(PP.h)](Aw=B[cx(PP.P)](Aw=B[cx(PP.C)](Aw=B[cx(PP.L)](B[cx(PP.v)](Aw=B[cx(PP.L)](Aw=B[cx(PP.a)](Aw=B[cx(PP.i)](Aw=B[cx(PP.F)](Aw=B[cx(PP.C)](Aw=B[cx(PP.u)](Aw|=B[cx(PP.q)]((B[cx(PP.z)](0x1dd2+-0x53d*0x1+-0x1894,AN)?0x3*0x78e+0x1*0x1c9+-0x1872:0x346*0x2+0x4c3+-0xb4f)?0xb28+-0x1b*-0xa3+-0x2*0xe2c:0x98f*-0x1+0x10*0x239+-0x1a01,0xe05*-0x1+-0x283*0x6+-0xb*-0x2a5),B[cx(PP.f)](B[cx(PP.p)](AG,TT['BM'][cx(PP.Z)]),-0x200f+0x147c+-0xc*-0xf7)),B[cx(PP.D)](AV?-0x7ed*-0x2+-0xbf8+-0x3*0x14b:-0x17*-0x9f+-0xb4e+0x2fb*-0x1,-0x50a+0x2641+-0x2135)),B[cx(PP.m)](B[cx(PP.e)](AG,TT['Bx'][cx(PP.o)]),0x163+0x23ee+-0x254e)),B[cx(PP.O)](B[cx(PP.Y)](AG,TT['Bx'][cx(PP.g)+'m']),-0xf*-0x29+-0x7*0x296+0xfb7)),B[cx(PP.b)](B[cx(PP.n)](AG,TT['Bx'][cx(PP.J)]),-0xd9e+-0x25*0xd+-0x296*-0x6)),B[cx(PP.W)](B[cx(PP.Q)](AG,TT['Bx'][cx(PP.G)]),0x200e+-0x254d*0x1+-0x1*-0x545)),B[cx(PP.q)](B[cx(PP.R)](AG,TT['Bx'][cx(PP.l)]),0x221e+-0x40d+-0x1e0a)),B[cx(PP.O)](AR?0x78e+-0x7*-0x15d+-0x223*0x8:0x1693*0x1+0x8b4+-0x1f47,0x12b5+0x7*0x471+-0x9f4*0x5)),B[cx(PP.V)](B[cx(PP.t)](AG,TT['Bx'][cx(PP.N)]),-0x3f8*0x3+-0x19*-0x30+0x741)),B[cx(PP.w)](B[cx(PP.B0)](AG,TT['Bx'][cx(PP.B1)+cx(PP.T6)]),0x1fb7+-0x1*0x17+-0x1f96)),B[cx(PP.q)](B[cx(PP.B0)](AG,TT['Bx'][cx(PP.T7)]),0x11e*-0x1f+-0x1*0x76f+0x2a1c)),B[cx(PP.T8)](B[cx(PP.T9)](AG,TT['Bc'][cx(PP.TB)+cx(PP.TT)+'n']),-0x20c5+-0x217c+-0x1*-0x424d)),B[cx(PP.TA)](B[cx(PP.TE)](AG,TT['Bx'][cx(PP.Td)+'d']),0x1d09+0x5f*-0x3b+-0x717)),B[cx(PP.Tx)](B[cx(PP.B0)](AG,TT['Bx'][cx(PP.Tc)+cx(PP.TM)]),-0x11*-0x2b+0x12d4*0x1+0x15a1*-0x1)),B[cx(PP.Ts)](B[cx(PP.Tj)](AG,TT['Bx'][cx(PP.TH)+'s']),0x164c+-0x8e*0x42+0xe5f)),B[cx(PP.Tk)](B[cx(PP.Ty)](AG,TT['Bx'][cx(PP.TX)+'e']),-0x92*-0xd+0xe4d+0xf1*-0x17));return TA=function(){return Aw;},Aw;}function TE(AW,AQ,AG){var cH=dT;for(var AR=-0x2379+0x1233+0x1146,Al=AQ,AV=AW[cH(PI.B)],At=B0[cH(PI.T)](AG,0x4*-0x397+-0x1fe+-0x105b*-0x1);B0[cH(PI.A)](Al,AV);)AR=B0[cH(PI.E)](B0[cH(PI.x)](AR=B0[cH(PI.c)](B0[cH(PI.M)](AR,-0x21e2+0x1*0x18cf+0x918),AR),AW[cH(PI.s)](Al)),-0x1*0x51a+0x2*-0x69d+0x1254),Al+=At;return AR;}TT['Bx'][dT(hG.Ts)]&&(T7=TT['Bx'][dT(hG.Tj)][dT(hG.TH)][dT(hG.Tk)](TT['Bx'][dT(hG.Ty)]),TT['Bx'][dT(hG.Ts)][dT(hG.TX)][dT(hG.TU)](TT['Bx'][dT(hG.TK)])),(Tc=[],TM=TT['Bc'][dT(hG.TS)+dT(hG.TP)],TC=TM[dT(hG.TI)],Ts=B[dT(hG.Th)],Ty=B[dT(hG.Tr)],Tj=B[dT(hG.TC)],TH=B[dT(hG.TL)],Tk=(TC?/^loaded|^c/:/^loaded|c/)[dT(hG.Tv)](TT['Bc'][TH]),TT['Bc'][Ty]&&TT['Bc'][Ty](Ts,Tx=function(){var ck=dT;TT['Bc'][ck(Ph.B)+ck(Ph.T)](Ts,Tx,!(-0x1e*0x137+-0xd*-0x19+0x232e)),B0[ck(Ph.A)](TX);},!(0x9de+0x1514+-0x1ef1)),TC&&TT['Bc'][dT(hG.Ta)+'t'](Tj,Tx=function(){var cy=dT;/^c/[cy(Pr.B)](TT['Bc'][TH])&&(TT['Bc'][cy(Pr.T)+'t'](Tj,Tx),B0[cy(Pr.A)](TX));}));var Td,Tx,Tc,TM,Ts,Tj,TH,Tk,Ty=Td=TC?function(AW){var cU=dT,AQ={'skEjX':function(AG,AR){var cX=B3;return B[cX(PC.B)](AG,AR);}};if(B[cU(Pv.B)](self,top))Tk?B[cU(Pv.T)](AW):Tc[cU(Pv.A)](AW);else{try{TM[cU(Pv.E)](B[cU(Pv.x)]);}catch(AG){return void B[cU(Pv.c)](setTimeout,function(){var cK=cU;AQ[cK(PL.B)](Td,AW);},0xe8d*0x1+-0x2*-0x376+0x1547*-0x1);}B[cU(Pv.M)](AW);}}:function(AW){var cS=dT;Tk?B0[cS(Pa.B)](AW):Tc[cS(Pa.T)](AW);};function TX(AW){var cP=dT;for(Tk=-0x1aec+0x1f0d+-0x420;AW=Tc[cP(Pi.B)]();)B0[cP(Pi.T)](AW);}var TU,TK=!(0x91a+-0x24e+-0x6cb);function TS(){var cI=dT;TT['Bx'][cI(PF.B)+cI(PF.T)+'st']&&(TK=!(-0xd87+-0xcd8+0x1a5f),delete TT['Bx'][cI(PF.A)+cI(PF.E)+'st']),TU[cI(PF.x)](),delete TT['Bx'][cI(PF.B)+cI(PF.E)+cI(PF.c)];}function TP(AW){var ch=dT,AQ=TT['Bc'][ch(Pu.B)+ch(Pu.T)](B[ch(Pu.A)]);AQ[ch(Pu.E)]=B[ch(Pu.x)];try{AQ[ch(Pu.c)+'d'](TT['Bc'][ch(Pu.M)+ch(Pu.s)](AW));}catch(AG){AQ[ch(Pu.j)][ch(Pu.H)]=AW;}return AQ;}function TI(){var cr=dT;return TT['Bc'][cr(Pq.B)]||TT['Bc'][cr(Pq.T)+cr(Pq.A)](B0[cr(Pq.E)])[-0x212c+0x24ac+-0x380*0x1];}TU=document[dT(hG.Ti)+dT(hG.TF)](B[dT(hG.Tu)]),TT['Bx'][dT(hG.Tq)+dT(hG.Tz)+dT(hG.Tf)]=TU[dT(hG.Tp)]=B[dT(hG.TZ)],TC=document[dT(hG.TD)][dT(hG.Tm)],TT['Bx'][dT(hG.Tq)+dT(hG.Te)+dT(hG.To)]=TS,document[dT(hG.TO)][dT(hG.TY)+'re'](TU,TC),B[dT(hG.Tg)](setTimeout,function(){var cC=dT;B0[cC(Pz.B)](TS);},-0x1b45+0x2279+-0x66c*0x1);if(!TT['Bx'][dT(hG.Tb)+dT(hG.Tn)+dT(hG.TJ)]){var Th=B[dT(hG.TW)][dT(hG.TQ)]('|'),Tr=-0x24f5*-0x1+0xf9*-0xf+-0x165e;while(!![]){switch(Th[Tr++]){case'0':for(var TC=TT['BM'][dT(hG.TG)]||TT['BM'][dT(hG.TR)+'ge'],TC=(TY[dT(hG.Tl)](TC),new Date()[dT(hG.TV)+dT(hG.Tt)]()),TL=(TY[dT(hG.Tl)](TC),TC=TT['Bx'][dT(hG.TN)+dT(hG.Tw)]?(TC=B[dT(hG.A0)](!![][dT(hG.A1)],-0x1f39*-0x1+0x103*-0x15+-0x9fa),TC=B[dT(hG.A2)](TC=B[dT(hG.A3)](TC=B[dT(hG.A4)](TC=B[dT(hG.A5)](TC=B[dT(hG.A6)](TC=B[dT(hG.A7)](TC|=B[dT(hG.A8)](!![][dT(hG.A9)],0x181c*-0x1+-0x1faa+0x37c7*0x1),B[dT(hG.AB)](TT['Bx'][dT(hG.TN)+dT(hG.AT)](B[dT(hG.AA)]),-0x1f0f+-0x139*-0x1f+-0x32*0x23)),B[dT(hG.AE)](TT['Bx'][dT(hG.TN)+dT(hG.Ad)](B[dT(hG.Ax)]),0x586*-0x3+-0x11*-0x45+-0x30*-0x40)),B[dT(hG.Ac)](TT['Bx'][dT(hG.AM)]&&TT['Bx'][dT(hG.As)][dT(hG.Aj)+dT(hG.AT)]&&TT['Bx'][dT(hG.AH)][dT(hG.TN)+dT(hG.AT)](B[dT(hG.Ak)]),-0x117c+0x1*0xff3+0x18d)),B[dT(hG.Ay)](!!function(){}[dT(hG.AX)],-0x12a2+-0x133*0x4+0x1773)),B[dT(hG.AU)](TT['Bx'][dT(hG.AK)][dT(hG.AS)+dT(hG.AP)]&&TT['Bx'][dT(hG.AK)][dT(hG.Aj)+dT(hG.AI)](B[dT(hG.Ah)]),-0x1*-0x1e03+0x1870+-0x366d)),B[dT(hG.A8)](TT['Bx'][dT(hG.Ar)+dT(hG.AC)]&&TT['Bx'][dT(hG.Ar)+dT(hG.AC)][dT(hG.AL)][dT(hG.TN)+dT(hG.Av)](B[dT(hG.Aa)]),-0x1e*-0x6d+-0x2d*-0x1d+-0x11d8)),Tq=TT['Bc'][dT(hG.Ai)+dT(hG.AF)](B[dT(hG.Au)]),TC=B[dT(hG.Aq)](TC=B[dT(hG.Az)](TC=B[dT(hG.Af)](TC=B[dT(hG.Ap)](TC=B[dT(hG.AZ)](TC=B[dT(hG.AD)](TC=B[dT(hG.Am)](TC=B[dT(hG.Ae)](TC=B[dT(hG.Ao)](TC=B[dT(hG.AO)](TC|=B[dT(hG.AY)](!!''[dT(hG.Ag)],0x1*0x7ef+0x1f59+0x11*-0x24f),B[dT(hG.Ab)](TT['Bx'][dT(hG.An)+'nt']&&TT['Bx'][dT(hG.AJ)+'nt'][dT(hG.AL)][dT(hG.TN)+dT(hG.Ad)](B[dT(hG.AW)]),0x1c2b+-0x19*-0x10b+-0x3634)),B[dT(hG.AQ)](TT['Bx'][dT(hG.AG)+dT(hG.AR)](B[dT(hG.Al)]),0x5*0x194+0x4*-0x1aa+0x10*-0x13)),B[dT(hG.AV)](!(!Tq||!Tq[dT(hG.At)+dT(hG.AN)]),0x1873*0x1+0x4*-0x6b6+0x272)),B[dT(hG.Aw)](!(!TT['Bx'][dT(hG.E0)+'e']||B[dT(hG.E1)](void(-0x1694+-0xd5a+0x23ee),TT['Bx'][dT(hG.E2)+'e'][dT(hG.E3)])),-0x2446+0x1b*-0x15d+0x4923)),B[dT(hG.E4)](TT['Bx'][dT(hG.E5)]&&TT['Bx'][dT(hG.E6)][dT(hG.E7)+dT(hG.hR)]&&TT['Bx'][dT(hG.E5)][dT(hG.hl)+dT(hG.AI)](B[dT(hG.hV)]),-0x1*-0x14b3+-0x1f59+-0x1*-0xab5)),B[dT(hG.ht)](TT['Bx'][dT(hG.hN)+dT(hG.hw)](B[dT(hG.r0)]),-0x4c7*0x1+-0x607*0x1+0xd6*0xd)),B[dT(hG.r1)](TT['Bx'][dT(hG.hN)+dT(hG.AT)](B[dT(hG.r2)]),-0x1a78+-0x119b+-0x2*-0x1612)),B[dT(hG.E4)](!![][dT(hG.r3)],-0x1ad9+0xd*0xe2+0xf71)),B[dT(hG.r4)](TT['Bx'][dT(hG.hN)+dT(hG.r5)](B[dT(hG.r6)]),0x1638+0x1bbc+-0x71*0x71)),B[dT(hG.r7)](B[dT(hG.r8)](void(0x791+0x1*0x2222+-0x29b3),TT['Bc'][dT(hG.r9)+'ed']),0x5*0x1e5+-0xc9a+-0x335*-0x1)),TL=B[dT(hG.Aw)](TT['Bx'][dT(hG.rB)]&&TT['Bx'][dT(hG.rT)][dT(hG.E7)+dT(hG.hw)]&&TT['Bx'][dT(hG.AH)][dT(hG.rA)+dT(hG.AI)](B[dT(hG.rE)]),-0x2509*-0x1+0x10f*0x2+-0x2727),B[dT(hG.rd)](B[dT(hG.rx)](TC,'|'),TL=B[dT(hG.rc)](TL=B[dT(hG.rM)](TL=B[dT(hG.rs)](TL=B[dT(hG.rj)](TL=B[dT(hG.rH)](TL=B[dT(hG.rk)](TL=B[dT(hG.ry)](TL=B[dT(hG.rX)](TL=B[dT(hG.rU)](TL=B[dT(hG.rK)](TL|=B[dT(hG.rS)](TT['Bx'][dT(hG.Aj)+dT(hG.Av)](B[dT(hG.rP)]),-0x183f+0x133*0x5+-0x1241*-0x1),B[dT(hG.Ay)](TT['Bx'][dT(hG.rI)]&&TT['Bx'][dT(hG.rh)][dT(hG.AS)+dT(hG.rr)]&&TT['Bx'][dT(hG.rC)][dT(hG.TN)+dT(hG.rL)](B[dT(hG.rv)]),0x1*-0x16b7+0x31*0xc9+0x10*-0xfc)),B[dT(hG.ra)](TT['Bx'][dT(hG.ri)]&&TT['Bx'][dT(hG.rF)][dT(hG.ru)][dT(hG.rq)+dT(hG.rz)](B[dT(hG.rf)]),-0x1f7e*0x1+0x216f+-0x1ee)),B[dT(hG.rp)](TT['Bx'][dT(hG.rZ)+'st']&&TT['Bx'][dT(hG.rD)+'st'][dT(hG.rm)][dT(hG.re)+dT(hG.rz)](B[dT(hG.ro)]),0x3*-0x13c+0x4a9*-0x1+0x861)),B[dT(hG.rO)](TT['Bx'][dT(hG.rY)]&&TT['Bx'][dT(hG.rg)][dT(hG.AS)+dT(hG.Av)]&&TT['Bx'][dT(hG.rI)][dT(hG.hl)+dT(hG.Av)](B[dT(hG.rb)]),0xb*-0x22c+0x7be+0x102b*0x1)),B[dT(hG.rn)](TT['Bx'][dT(hG.AS)+dT(hG.rr)](B[dT(hG.rJ)]),-0x69*-0x2b+-0x77*-0x20+-0x207d*0x1)),B[dT(hG.rW)](TT['Bx'][dT(hG.rQ)][dT(hG.E7)+dT(hG.rG)](B[dT(hG.rR)]),-0x605+-0x235b+-0xdcd*-0x3)),B[dT(hG.rl)](TT['Bx'][dT(hG.rV)+dT(hG.rt)]&&TT['Bx'][dT(hG.rV)+dT(hG.rN)][dT(hG.AL)][dT(hG.rq)+dT(hG.rw)](B[dT(hG.C0)]),-0x15f9+-0x19e+0x179f*0x1)),B[dT(hG.C1)](TT['Bx'][dT(hG.C2)+dT(hG.C3)](B[dT(hG.C4)]),-0x1573*-0x1+0x1ba6+-0x3110)),B[dT(hG.C5)](TT['Bx'][dT(hG.C6)+'nt']&&TT['Bx'][dT(hG.C6)+'nt'][dT(hG.ru)][dT(hG.re)+dT(hG.AR)](B[dT(hG.C7)]),-0x24d4+0x1340+0x52*0x37)),B[dT(hG.C8)](TT['Bx'][dT(hG.C9)+dT(hG.CB)]&&TT['Bx'][dT(hG.CT)+dT(hG.CB)][dT(hG.ru)][dT(hG.C2)+dT(hG.CA)](B[dT(hG.CE)]),-0x177b+-0x96f+0x3b*0x8f)))):B[dT(hG.Cd)],TY[dT(hG.Cx)](TC),TT['Bx'][dT(hG.Cc)]),TC=TT['Bc'][dT(hG.CM)+dT(hG.Cs)],Tv=TL[dT(hG.Cj)]||-0x101*0x26+-0x2*0x2fa+0x5*0x8d2,Ta=TL[dT(hG.CH)]||0x1*-0x242f+-0x11*0x1d3+0x4332,Ti=TT['Bx'][dT(hG.Ck)]||TC&&TC[dT(hG.Cy)+'h']||TT['Bc'][dT(hG.CX)]&&TT['Bc'][dT(hG.CU)][dT(hG.Cy)+'h']||0x1*0xb65+0x9*-0x36f+-0x1382*-0x1,TC=TT['Bx'][dT(hG.CK)+'t']||TC&&TC[dT(hG.CS)+'ht']||TT['Bc'][dT(hG.CX)]&&TT['Bc'][dT(hG.CP)][dT(hG.CI)+'ht']||-0x56*0x2b+0x1486+-0x614,TF=TT['Bx'][dT(hG.Ch)]||TT['Bx'][dT(hG.Cr)]||-0x1*0x25d9+0x40d+0x21cc,Tu=TT['Bx'][dT(hG.CC)]||TT['Bx'][dT(hG.CL)]||-0x1cb+0x1*-0x1f4d+-0xc*-0x2c2,Tv=(TY[dT(hG.Cv)](B[dT(hG.Ca)](B[dT(hG.Ci)](B[dT(hG.CF)](B[dT(hG.Cu)](B[dT(hG.Cq)](B[dT(hG.Cz)](B[dT(hG.Ca)](B[dT(hG.Cf)](B[dT(hG.Cp)](B[dT(hG.CZ)](Tv,'|'),Ta),'|'),Ti),'|'),TC),'|'),TF),'|'),Tu)),TT['Bx'][dT(hG.hl)+dT(hG.rw)]&&TT['Bx'][dT(hG.CD)+dT(hG.Cm)](B[dT(hG.Ce)])?TT['Bx'][dT(hG.Co)][dT(hG.CO)]:-(-0x2*-0x836+-0xd*0xf3+-0x414)),Ta=(TY[dT(hG.CY)](Tv),TT['BM'][dT(hG.Cg)]),Ti=(TY[dT(hG.Cv)](Ta),TT['BM'][dT(hG.Cb)+dT(hG.Cn)]||0x13db+0xf2e+0x2309*-0x1),TC=(TY[dT(hG.Cv)](Ti),''),Tq=TT['Bc'][dT(hG.Ai)+dT(hG.CJ)](B[dT(hG.CW)]),Ta=(TC=Tq[dT(hG.CQ)]?(TF=Tq[dT(hG.CG)](B[dT(hG.CR)])||Tq[dT(hG.CG)](B[dT(hG.Cl)]))?(Tu=TF[dT(hG.CV)+'on'](B[dT(hG.Ct)]))?(Tv=TF[dT(hG.CN)+'er'](Tu[dT(hG.Cw)+dT(hG.L0)+'L']),B[dT(hG.Cp)](B[dT(hG.L1)](TF[dT(hG.L2)+'er'](Tu[dT(hG.L3)+dT(hG.L4)+dT(hG.L5)]),'|'),Tv)):B[dT(hG.L6)]:B[dT(hG.L7)]:B[dT(hG.L8)],TY[dT(hG.Tl)](TC),B[dT(hG.L9)](B[dT(hG.LB)](TL[dT(hG.LT)],'|'),TL[dT(hG.LA)])),Ti=(TY[dT(hG.LE)](Ta),TT['BM'][dT(hG.Ld)]||-0x94f*-0x4+0x5d5+0x2d*-0xf5),Tz=(TY[dT(hG.Cv)](Ti),Ad=TT['Bx'][dT(hG.Lx)+dT(hG.hR)]?(Ad=B[dT(hG.Lc)](TT['Bx'][dT(hG.AG)+dT(hG.LM)](B[dT(hG.Ls)]),-0x1*-0x11a1+-0x65+-0x113c),B[dT(hG.Lj)](Ad=B[dT(hG.LH)](Ad=B[dT(hG.Lk)](Ad|=B[dT(hG.Ly)](TT['Bx'][dT(hG.hl)+dT(hG.LX)](B[dT(hG.LU)]),0x144c*0x1+0x16b3+0x1*-0x2afe),B[dT(hG.LK)](TT['Bx'][dT(hG.LS)+dT(hG.LP)](B[dT(hG.LI)]),0x502*-0x7+-0x1a3f+0x3d4f)),B[dT(hG.LK)](TT['Bx'][dT(hG.Lh)+dT(hG.AR)](B[dT(hG.Lr)]),0xa9c+0x515*-0x4+0x9bb)),B[dT(hG.LK)](TT['Bx'][dT(hG.E7)+dT(hG.AP)](B[dT(hG.LC)]),0x1e2d*-0x1+0x7*0x527+-0x2f*0x20))):-0x5*-0x449+0x14d3*-0x1+-0x9a*0x1,TY[dT(hG.LL)](Ad),''),Tf=TT['BM'][dT(hG.Lv)],Tp=-0x2229+-0x31*-0x17+-0x1*-0x1dc2;Tf&&B[dT(hG.La)](Tp,Tf[dT(hG.CO)]);Tp++){Tz+=B[dT(hG.Li)](Tf[Tp][dT(hG.AX)],Tf[Tp][dT(hG.LF)]),Tf[Tp][dT(hG.Lu)]&&(Tz+=B[dT(hG.Lq)](Tf[Tp][dT(hG.Lz)],B[dT(hG.Lf)]));for(var TZ=-0x71c*-0x5+0x15*0x23+-0x266b;B[dT(hG.Lp)](TZ,Tf[Tp][dT(hG.LZ)]);TZ++){var TD=Tf[Tp][TZ],Tm=-0xe3b*0x1+0x2068+-0x122d;(Tm=TD?TD[dT(hG.LD)]:Tm)&&(Tz+=Tm[dT(hG.Lm)](0x1b4c+-0x446*0x1+0x15a*-0x11));}}continue;case'1':Tz=B[dT(hG.Le)](B[dT(hG.Lo)](Tf?Tf[dT(hG.LO)]:0x142e*0x1+0x15b*0x15+0x15*-0x251,'|'),B[dT(hG.LY)](TE,Tz,0x41d*-0x3+0xdc*-0x15+0x1e63,-0x3c*0x29+-0x591*0x3+0x34a*0x8));continue;case'2':TY[dT(hG.Lg)](Tz),TY[dT(hG.Tl)]((Tq=TT['Bc'][dT(hG.Lb)+dT(hG.Ln)](B[dT(hG.Au)]),TF='',Tq[dT(hG.LJ)]&&(Tu=Tq[dT(hG.LJ)]('2d'),Tq[dT(hG.LW)]=0xfb2+0x4*-0x179+-0xe*0xaf,Tq[dT(hG.LQ)]=-0x3*-0x332+0x6*0x273+0x4*-0x5ae,Tq[dT(hG.LG)][dT(hG.LR)]=B[dT(hG.Ll)],Tu[dT(hG.LV)+'ne']=B[dT(hG.Lt)],Tu[dT(hG.LN)]=B[dT(hG.Lw)],Tu[dT(hG.v0)](0x40*-0xd+0x26f5*0x1+-0x2338,0x1*-0x1c94+-0x7*0x35f+-0x1a17*-0x2,0x1c15+-0x8*0x3ad+-0x1*-0x191,-0x1d93+0xa1e+-0x1389*-0x1),Tu[dT(hG.v1)]=B[dT(hG.v2)],Tu[dT(hG.v3)]=B[dT(hG.v4)],Tu[dT(hG.v5)](B[dT(hG.v6)],0xb*-0x7c+0x204+-0x19*-0x22,-0x599+0x3b*0x3+0x1*0x4f7),Tu[dT(hG.LN)]=B[dT(hG.v7)],Tu[dT(hG.v3)]=B[dT(hG.v8)],Tu[dT(hG.v5)](B[dT(hG.v6)],-0x33a+-0xe7b+0x11b9*0x1,-0x854+-0x1d*0x7+0x94c),TF=B[dT(hG.v9)](TE,TF=Tq[dT(hG.vB)]()||'',-0x20a4+-0x8db+0x297f,0x1d6f+-0x43*-0x29+0x1bf*-0x17)),TF));continue;case'3':var To,TC=function(AW,AQ){var cL=dT,AG=B[cL(PD.B)](T,this,function(){var cv=cL;return AG[cv(Pp.B)]()[cv(Pp.T)](B0[cv(Pp.A)])[cv(Pp.B)]()[cv(Pp.E)+'r'](AG)[cv(Pp.T)](B0[cv(Pp.x)]);});B[cL(PD.T)](AG);var AR=-0x191*0x2+0x2*0x4d0+0x33f*-0x2;return function(){var ca=cL,Al=arguments,AV=Date[ca(PZ.B)]();B0[ca(PZ.T)](AQ,B0[ca(PZ.A)](AV,AR))&&(AR=AV,AW[ca(PZ.E)](this,Al));};},TO=(TT['Bx'][dT(hG.Tb)+dT(hG.vT)+dT(hG.vA)]=!(-0x244d+-0x1*0x9d0+0x2e1d),new Date()[dT(hG.vE)]()),Ta=B[dT(hG.vd)](B[dT(hG.vx)],TT['Bs']),TY=[],Tg=[],Tb=[],Tn=[],TJ=[],TW=!(0x888+0x2262+-0x2ae9),TQ=((B[dT(hG.vc)](B[dT(hG.vM)],window)||navigator[dT(hG.vs)+dT(hG.vj)])&&(TW=!(-0x5c*-0x57+-0x69a+0x1*-0x18aa)),[0x238c+0x1*-0x1403+-0xf89]),TG=(-0xb91+0x4f*-0x5d+0xd6c*0x3,T8['cd'])(),TR=B[dT(hG.vH)](TC,function(){var ci=dT;(-0x1238+-0x15a6+0x17a*0x1b,T9['BT'])(B[ci(Pm.B)],TW?TB['BS'](B[ci(Pm.T)](B[ci(Pm.A)](B[ci(Pm.E)](B[ci(Pm.x)](B[ci(Pm.c)](B[ci(Pm.M)](TY[ci(Pm.s)]('^'),'M'),Tn[ci(Pm.j)]),'^'),TJ[ci(Pm.j)]),'^'),TQ[ci(Pm.H)])):TB['BS'](B[ci(Pm.k)](B[ci(Pm.y)](B[ci(Pm.X)](B[ci(Pm.U)](B[ci(Pm.K)](B[ci(Pm.S)](TY[ci(Pm.s)]('^'),'P'),Tg[ci(Pm.H)]),'^'),Tb[ci(Pm.P)]),'^'),TQ[ci(Pm.H)])),Ax,TG),(-0x17ad+0xfdd+-0xc8*-0xa,T9['BT'])(B[ci(Pm.I)],TW?TB['BS'](B[ci(Pm.h)](B[ci(Pm.C)](B[ci(Pm.L)](B[ci(Pm.v)](B[ci(Pm.a)](B[ci(Pm.i)](B[ci(Pm.i)](B[ci(Pm.F)](B[ci(Pm.u)](B[ci(Pm.q)](TY[ci(Pm.z)](0x5*0x35+0x1c5f+0x75a*-0x4,0xe03*0x1+-0x1*-0x1867+-0x2666)[ci(Pm.s)]('^'),'tm'),A8),'|'),Tn[ci(Pm.f)]('|')),'tc'),AT),'|'),TJ[ci(Pm.p)]('|')),'kb'),TQ[ci(Pm.s)]('|'))):TB['BS'](B[ci(Pm.Z)](B[ci(Pm.D)](B[ci(Pm.m)](B[ci(Pm.e)](B[ci(Pm.o)](B[ci(Pm.O)](B[ci(Pm.a)](B[ci(Pm.v)](B[ci(Pm.Y)](B[ci(Pm.g)](TY[ci(Pm.b)](-0x222c+0x1c84+-0x5a8*-0x1,0x1a10+-0x1f*0xe9+0x25*0xf)[ci(Pm.f)]('^'),'mm'),Tw),'|'),Tg[ci(Pm.n)]('|')),'mc'),A3),'|'),Tb[ci(Pm.J)]('|')),'kb'),TQ[ci(Pm.J)]('|'))),Ax,TG);},0x7*-0x4e8+-0x1e54+0x40e8),Tl=(B[dT(hG.r8)](void(-0x37*-0x59+-0x15*0x150+0x1*0x871),TT['Bc'][dT(hG.vk)])?(To=B[dT(hG.vy)],Tv=B[dT(hG.vX)]):B[dT(hG.vU)](void(0x42e*-0x6+0x25c8+-0xcb4),TT['Bc'][dT(hG.vK)])?(To=B[dT(hG.vS)],Tv=B[dT(hG.vP)]):B[dT(hG.vI)](void(0xcd7*0x1+0x2330+0x99b*-0x5),TT['Bc'][dT(hG.vh)])?(To=B[dT(hG.vr)],Tv=B[dT(hG.vC)]):B[dT(hG.vL)](void(0x243*0x1+-0x1*0x2d3+-0x18*-0x6),TT['Bc'][dT(hG.vv)+'en'])&&(To=B[dT(hG.va)],Tv=B[dT(hG.vi)]),TT['Bc'][dT(hG.vF)+dT(hG.vu)]&&To?TT['Bc'][dT(hG.vq)+dT(hG.vz)](Tv,function(){var cF=dT;!TT['Bc'][To]&&B0[cF(Pe.B)](-0xa16+-0x1*0x283+0xcad,TY[cF(Pe.T)])&&TY[0xd7*-0x1a+-0x12*-0xda+0x696]++;}):TT['Bc'][dT(hG.Ta)+'t']&&TT['Bc'][dT(hG.Ta)+'t'](B[dT(hG.vf)]('on',Tv),function(){var cu=dT;!TT['Bc'][To]&&B[cu(Po.B)](0x1*0x1ab9+0x17*0x2b+-0x1e82,TY[cu(Po.T)])&&TY[-0xb0a+-0xc7*0x31+0x3135]++;}),0x9bd*-0x1+0x5de*-0x6+-0xf*-0x2ff),TV=-0x7c2*0x5+-0x28a*0x3+0x2e68,Tt=TO,TN=-0x1*-0x545+0x11f9+-0x173e,Tw=0x68a*-0x5+0x1*0x133f+0xd73*0x1,A0=!TT['Bc'][dT(hG.vp)+dT(hG.vZ)]&&TT['Bc'][dT(hG.vD)+'t'],Tv=B[dT(hG.vm)](TC,function(AW){var cq=dT,AQ,AG,AR,Al;TW||(A0&&(AW=TT['Bx'][cq(PO.B)]),B[cq(PO.T)](0x20e1+-0x1*0x1d95+0x5d*-0x8,TN)&&(AQ=Tg[-0x25f*-0x2+0xdf6+-0x12b3*0x1][cq(PO.A)]('+'),AG=Tg[-0x1d77*-0x1+0x3*0xc4f+-0x4264][cq(PO.A)]('+'),Tg[0x1*-0xc55+0x8cf*0x2+-0x548]=B[cq(PO.E)](B[cq(PO.x)](B[cq(PO.c)](B[cq(PO.M)](B[cq(PO.s)](B[cq(PO.j)](parseInt,AQ[0x661*-0x3+-0x207*0xa+-0x3b*-0xab]),B[cq(PO.H)](parseInt,AG[-0x14*0x34+0x559+0x2f*-0x7])),'+'),B[cq(PO.k)](B[cq(PO.y)](parseInt,AQ[0xcf5+-0x158e+0x89a]),B[cq(PO.X)](parseInt,AG[0x33b*0x3+-0xd72+0x3c2]))),'+'),B[cq(PO.U)](B[cq(PO.K)](parseInt,AQ[0x1c4b+-0x8f3*-0x1+-0x94f*0x4]),B[cq(PO.S)](parseInt,AG[-0x11e1*-0x1+-0x1d*-0x8b+-0x219e]))),Tg[cq(PO.P)]()),TN++,AQ=AW[cq(PO.I)],AG=AW[cq(PO.h)],B[cq(PO.C)](void(0x377+0x11b1+0x1*-0x1528),AQ)&&(AR=TT['Bc'][cq(PO.L)]?TT['Bc'][cq(PO.v)][cq(PO.a)]:0x3e*-0x8a+0x1*-0x13eb+-0x1*-0x3557,Al=TT['Bc'][cq(PO.v)]?TT['Bc'][cq(PO.L)][cq(PO.i)]:0x1a1b+0xcdd*-0x3+-0x44*-0x2f,AQ=B[cq(PO.F)](AW[cq(PO.u)],AR),AG=B[cq(PO.q)](AW[cq(PO.z)],Al)),AR=B[cq(PO.f)](AQ,Tl),AW=B[cq(PO.p)](AG,TV),Al=B[cq(PO.Z)](new Date()[cq(PO.D)](),Tt),B[cq(PO.m)](-0x1699+-0x82+-0x74*-0x33,TN)&&(Tw=Al),TY[0x889+0x1bc5+-0x244b]++,Tg[cq(PO.e)](B[cq(PO.o)](B[cq(PO.O)](B[cq(PO.Y)](B[cq(PO.g)](AR,'+'),AW),'+'),Al)),B[cq(PO.b)](TR),Tl=AQ,TV=AG,Tt+=Al);},0x148e*-0x1+0x755*-0x1+-0x1*-0x1c01),A1=(TT['Bc'][dT(hG.ve)+dT(hG.vo)]?TT['Bc'][dT(hG.ve)+dT(hG.vO)](B[dT(hG.vY)],Tv,!(-0x31*-0xae+0xbc*0x21+-0x398a)):TT['Bc'][dT(hG.vg)+'t']&&TT['Bc'][dT(hG.Ta)+'t'](B[dT(hG.vb)],Tv),TO),A2=0x24cd*0x1+0x7e5+-0x2cb2,A3=-0x7da*-0x2+0x15b5+0x3d*-0x9d,Tv=function(AW){var cz=dT,AQ,AG,AR,Al;TW||(A0&&(AW=TT['Bx'][cz(PY.B)]),B[cz(PY.T)](0x1f6*0x2+0x22e3+-0x26c5,A2)&&Tb[cz(PY.A)](),A2++,AR=AW[cz(PY.E)],Al=AW[cz(PY.x)],B[cz(PY.c)](void(-0x2*-0xb4d+-0x2042+0x9a8),AR)&&(AQ=TT['Bc'][cz(PY.M)]?TT['Bc'][cz(PY.s)][cz(PY.j)]:0x4*0x7d6+0x5*0x42+-0x20a2,AG=TT['Bc'][cz(PY.M)]?TT['Bc'][cz(PY.H)][cz(PY.k)]:0x87*0x35+-0x1f02+-0x30f*-0x1,AR=B[cz(PY.y)](AW[cz(PY.X)],AQ),Al=B[cz(PY.U)](AW[cz(PY.K)],AG)),AQ=B[cz(PY.S)](parseInt,AR),AG=B[cz(PY.P)](parseInt,Al),AR=B[cz(PY.I)](new Date()[cz(PY.h)](),A1),Al=AW[cz(PY.C)]||0x199a+0x1527+-0x2eb8,B[cz(PY.L)](-0xc49+-0x83*-0x7+-0x2e7*-0x3,A2)&&(A3=AR),TY[0x4b*0x25+0xf91+-0x1d*0xe9]++,Tb[cz(PY.v)](B[cz(PY.a)](B[cz(PY.i)](B[cz(PY.F)](B[cz(PY.u)](B[cz(PY.q)](B[cz(PY.z)](B[cz(PY.f)](Al,B[cz(PY.p)](B[cz(PY.Z)],AW[cz(PY.D)])?'0':'1'),'+'),AQ),'+'),AG),'+'),AR)),B[cz(PY.m)](TR),A1+=AR);},A4=(TT['Bc'][dT(hG.vn)+dT(hG.vZ)]?(TT['Bc'][dT(hG.vn)+dT(hG.vJ)](B[dT(hG.vW)],Tv,!(0xd55*0x2+-0xd32+-0xd78)),TT['Bc'][dT(hG.vQ)+dT(hG.vO)](B[dT(hG.vG)],Tv,!(-0x15a3+-0x8f7+0x1e9a))):TT['Bc'][dT(hG.vR)+'t']&&(TT['Bc'][dT(hG.vl)+'t'](B[dT(hG.vV)],Tv),TT['Bc'][dT(hG.Ta)+'t'](B[dT(hG.vt)],Tv)),-0xa4d+-0x4a*-0x37+-0x599),A5=-0x19db+0x18*-0xd7+0x2e03*0x1,A6=TO,A7=0x22*-0xba+-0xfe7+0xa5*0x3f,A8=0x1c09+-0x14*0x105+-0x7a5,Tv=B[dT(hG.vN)](TC,function(AW){var cf=dT,AQ,AG,AR;(TW=!(-0x125a+0x7*-0x3f1+0x2df1))&&(A0&&(AW=TT['Bx'][cf(Pg.B)]),B0[cf(Pg.T)](-0x1*-0x1ca3+-0x166f+-0x5d0,A7)&&(AQ=Tn[0x18cb+-0xefb+-0x9cf][cf(Pg.A)]('+'),AG=Tn[0x6d8*0x5+0x1f01+-0x4139][cf(Pg.E)]('+'),Tn[0x7d*0x1c+0x12*0x12f+-0x22f9*0x1]=B0[cf(Pg.x)](B0[cf(Pg.c)](B0[cf(Pg.M)](B0[cf(Pg.s)](B0[cf(Pg.j)](B0[cf(Pg.H)](parseInt,AQ[0x1c03+0x239*-0x11+0x9c6]),B0[cf(Pg.k)](parseInt,AG[0xe5+-0x18eb*0x1+0x1806])),'+'),B0[cf(Pg.y)](B0[cf(Pg.X)](parseInt,AQ[-0x1b6*-0x16+0x3b*-0x25+-0x2e*0xa2]),B0[cf(Pg.U)](parseInt,AG[-0xd*-0x9b+-0x17f*0xb+0x2dd*0x3]))),'+'),B0[cf(Pg.K)](B0[cf(Pg.U)](parseInt,AQ[-0xb3*0xa+0x5c1+0x13f]),B0[cf(Pg.S)](parseInt,AG[-0x20fb+0xab*0x16+0x124b]))),Tn[cf(Pg.P)]()),A7++,AQ=B0[cf(Pg.I)](B0[cf(Pg.H)](parseInt,AW[cf(Pg.h)][0x1*-0x141f+-0x508*0x6+0x9f*0x51][cf(Pg.C)]),A4),AG=B0[cf(Pg.L)](B0[cf(Pg.v)](parseInt,AW[cf(Pg.a)][0xc3a+0x11a0*0x1+-0x1dda][cf(Pg.i)]),A5),AR=B0[cf(Pg.F)](new Date()[cf(Pg.u)](),A6),TY[0x1*-0x1c1+-0x401*-0x7+0xf9*-0x1b]++,Tn[cf(Pg.q)](B0[cf(Pg.z)](B0[cf(Pg.f)](B0[cf(Pg.M)](B0[cf(Pg.p)](AQ,'+'),AG),'+'),AR)),B0[cf(Pg.Z)](0x5*0x6fb+-0xdc*0x2c+0x2ea,A7)&&(A8=AR),B0[cf(Pg.D)](TR),A4=B0[cf(Pg.m)](parseInt,AW[cf(Pg.h)][0x1*-0xd7d+-0xa7d+0x3e*0x63][cf(Pg.e)]),A5=B0[cf(Pg.o)](parseInt,AW[cf(Pg.O)][0x16cf+0xc1e+-0x1*0x22ed][cf(Pg.i)]),A6+=AR);},-0x170c+-0x14d1*-0x1+0x259),A9=(TT['Bc'][dT(hG.vp)+dT(hG.vu)]?TT['Bc'][dT(hG.vw)+dT(hG.vJ)](B[dT(hG.a0)],Tv,!(0x2504*-0x1+0x228b+0x279)):TT['Bc'][dT(hG.a1)+'t']&&TT['Bc'][dT(hG.a1)+'t'](B[dT(hG.a2)],Tv),TO),AB=0x7b4+0x9*0x2dd+-0x2179,AT=0xfa3+0x133f*-0x1+0x2a*0x16,TC=function(AW){var cp=dT,AQ,AG,AR;B[cp(Pb.B)](B[cp(Pb.T)],AW[cp(Pb.A)])&&(AQ=B[cp(Pb.E)](B[cp(Pb.x)](B[cp(Pb.c)](screen[cp(Pb.M)],TT['Bx'][cp(Pb.s)]),0x2f5*-0x8+0x655+-0x27b*-0x7),0x25d+0x4a*0x6b+-0x3*0xb19),TY[0x145c+0xc6a*0x1+-0x20b1]=AQ),(TW=!(0xd8c+-0x1fe*0xf+0x1056))&&(A0&&(AW=TT['Bx'][cp(Pb.j)]),B[cp(Pb.H)](0x3*-0x49e+0x1a3e+0x22*-0x5d,AB)&&TJ[cp(Pb.k)](),AB++,AQ=B[cp(Pb.y)](parseInt,AW[B[cp(Pb.X)](B[cp(Pb.U)],AW[cp(Pb.A)])?B[cp(Pb.K)]:B[cp(Pb.S)]][0x41+0x237c+0x7*-0x51b][cp(Pb.P)]),AG=B[cp(Pb.I)](parseInt,AW[B[cp(Pb.h)](B[cp(Pb.T)],AW[cp(Pb.A)])?B[cp(Pb.K)]:B[cp(Pb.S)]][0x1ee9+0x7*-0x21a+0x1d*-0x8f][cp(Pb.C)]),AR=B[cp(Pb.L)](new Date()[cp(Pb.v)](),A9),TY[0x3b7*0x9+0x1*0x15c1+-0x372d]++,TJ[cp(Pb.a)](B[cp(Pb.i)](B[cp(Pb.F)](B[cp(Pb.u)](B[cp(Pb.q)](B[cp(Pb.z)](B[cp(Pb.f)](B[cp(Pb.p)](B[cp(Pb.Z)],AW[cp(Pb.A)])?'0':-0x2672+0x7a8*-0x1+-0x2e1b*-0x1,'+'),AQ),'+'),AG),'+'),AR)),B[cp(Pb.h)](-0x114f+0x5*0x2c9+-0x121*-0x3,AB)&&(AT=AR),B[cp(Pb.D)](TR),A9+=AR);},AA=(TT['Bc'][dT(hG.vw)+dT(hG.a3)]?(TT['Bc'][dT(hG.vq)+dT(hG.a4)](B[dT(hG.a5)],TC,!(-0x7a1*-0x1+-0x15a2+-0xf*-0xef)),TT['Bc'][dT(hG.vF)+dT(hG.vz)](B[dT(hG.a6)],TC,!(0x1f23+-0x1850+-0x6d3))):TT['Bc'][dT(hG.vR)+'t']&&(TT['Bc'][dT(hG.vD)+'t'](B[dT(hG.a7)],TC),TT['Bc'][dT(hG.a8)+'t'](B[dT(hG.a9)],TC)),TO),AE=-0xb6f*0x3+0x3c8+-0xd*-0x259,Tv=function(AW){var cZ=dT,AQ;B0[cZ(Pn.B)](AE,0x1e58+-0x1052+-0xdf2)&&((AW=A0?TT['Bx'][cZ(Pn.T)]:AW)[cZ(Pn.A)+'g']&&(TQ[0x1111+0x23af+0x34c0*-0x1]=0x1b*-0x16e+-0x1cbe+0x4359),AE++,AQ=AW[cZ(Pn.E)],(/(Key)[a-zA-Z]/[cZ(Pn.x)](AQ)||/(Digit)[0-9]/[cZ(Pn.x)](AQ))&&(AQ=''),AQ=B0[cZ(Pn.c)](new Date()[cZ(Pn.M)](),AA),TY[-0x39*0x33+-0x3e+-0xb9c*-0x1]++,TQ[cZ(Pn.s)](B0[cZ(Pn.j)](B0[cZ(Pn.H)](B0[cZ(Pn.k)],AW[cZ(Pn.y)])?0x10fe+0x5cf*0x6+-0x33d8:0x11a5*-0x1+0xfe5*0x2+0xb5*-0x14,AQ)),B0[cZ(Pn.X)](TR),AA+=AQ);};continue;case'4':TT['Bc'][dT(hG.vw)+dT(hG.a3)]?(TT['Bc'][dT(hG.vp)+dT(hG.aB)](B[dT(hG.aT)],Tv,!(-0x4*-0x8d5+0x242*-0xd+-0x5fa)),TT['Bc'][dT(hG.vw)+dT(hG.a3)](B[dT(hG.aA)],Tv,!(-0x2*-0x259+-0x19b1+0x14ff))):TT['Bc'][dT(hG.aE)+'t']&&(TT['Bc'][dT(hG.a1)+'t'](B[dT(hG.ad)],Tv),TT['Bc'][dT(hG.a8)+'t'](B[dT(hG.ax)],Tv)),TY[dT(hG.Tl)](B[dT(hG.ac)](TE,B[dT(hG.aM)](B[dT(hG.as)](B[dT(hG.aj)](B[dT(hG.aH)](0x895e7bfc+0x12d42f*-0x15f1+0x67c22b9*0x52,Math[dT(hG.ak)]()),0x2*-0x5aa+0x64e+0x1*0x506),'|'),TO),-0x15bb+0x15d*-0x1+-0x2e3*-0x8,-0x1*0x1ad2+0x1c32+0x9*-0x27)),TY[dT(hG.ay)](Ta),TY[dT(hG.aX)](TO),TY[dT(hG.aU)](0x2344+-0x787+-0x1bbc);continue;case'5':B[dT(hG.aK)](TR);continue;case'6':TY[dT(hG.aS)](B[dT(hG.aP)](B[dT(hG.aI)](TC,'|'),Ac));continue;case'7':var TC=(Tv=TT['BM'][dT(hG.ah)])?B[dT(hG.ar)](TE,Tv,-0x1e4+-0x12c6+0x17*0xe6,0x52*-0x65+0x1a0a+0xe7*0x7):0x2031+0x995*-0x1+-0x1*0x169c,Ta=(TY[dT(hG.aC)](TC),TT['Bc'][dT(hG.aL)]||TT['Bc'][dT(hG.av)]?-0x7bd+0x123f*0x1+-0xa82:-0x2459+0x55d+0x1efd),Ti=(TY[dT(hG.aa)](Ta),TY[dT(hG.ai)](0x11ff*0x1+0x181+-0x1380),B[dT(hG.aF)](B[dT(hG.au)](B[dT(hG.aq)](TL[dT(hG.az)],TT['Bx'][dT(hG.af)]),-0xd34+0x12be+0xb0*-0x8),0x1*0x1ef7+-0x1503*0x1+-0x9f4)),Ad=(TY[dT(hG.LE)](Ti),B[dT(hG.ap)](TA,!(0x953+-0x12d3+0x980))),Ax=(TY[dT(hG.aZ)](Ad),new Date(B[dT(hG.aD)](TO,-0x13b3def9d+-0x23d8bc*-0x11d3+0x25b4680a9))[dT(hG.am)+'g']());continue;case'8':for(var TC=B[dT(hG.ae)](!!(TT['Bx'][dT(hG.ao)+dT(hG.aO)+dT(hG.aY)]||TT['Bx'][dT(hG.ag)]&&TT['Bx'][dT(hG.ab)][dT(hG.an)]&&TT['Bx'][dT(hG.ab)][dT(hG.aJ)][dT(hG.aW)+dT(hG.aQ)+'r']),0xf8*0x9+0x473+-0xd2b*0x1),Ac=(TC=B[dT(hG.aG)](TC=B[dT(hG.aR)](TC=B[dT(hG.al)](TC|=B[dT(hG.aV)](B[dT(hG.at)](void(0x17a4+0x3d1+-0x1b75),TT['Bx'][dT(hG.aN)+dT(hG.aw)]),-0x20*-0x130+0x1*0xf8e+-0x358d),B[dT(hG.i0)](B[dT(hG.i1)](void(-0x28*0x83+-0x975+0x1ded),TT['Bx'][dT(hG.i2)+dT(hG.i3)]),-0x1647*-0x1+0x1*-0x1d87+0x742)),B[dT(hG.i4)](!!TT['Bx'][dT(hG.i5)],0x46+-0x14d4+0x1491)),B[dT(hG.i6)](!!TT['Bx'][dT(hG.i7)+dT(hG.i8)+dT(hG.i9)+dT(hG.iB)],0x1405+-0x4da+-0xf27)),-0x508+-0x25ca+0x2ad2),AM=[B[dT(hG.iT)],B[dT(hG.iA)],B[dT(hG.iE)],B[dT(hG.id)],B[dT(hG.ix)]],As=TT['Bc'][dT(hG.ic)+dT(hG.iM)]('cc'),Tp=-0x2075+0xe09*0x1+0x126c;B[dT(hG.is)](Tp,AM[dT(hG.CO)]);Tp++)Ac|=B[dT(hG.ij)](B[dT(hG.iH)](void(0x15ba+0x2588*-0x1+-0xee*-0x11),As[dT(hG.ik)][AM[Tp]])?0x1918+-0xb9*-0xa+0x1*-0x2051:0x11cb+-0x8e*0x32+-0x5*-0x1fd,Tp);continue;}break;}}var Aj=B[dT(hG.iy)](x,0x287*0x7+0x2*0xf10+0xf*-0x300),AH=XMLHttpRequest[dT(hG.iX)],Ak=AH[dT(hG.iU)],Ay=AH[dT(hG.iK)],AX=AH[dT(hG.iS)+dT(hG.a4)],AU=AH[dT(hG.iP)+dT(hG.iI)],AK=AH[dT(hG.ih)+dT(hG.ir)],AS=Object[dT(hG.iC)+dT(hG.iL)+dT(hG.iv)](AH,B[dT(hG.ia)]),AP=Object[dT(hG.iC)+dT(hG.iL)+dT(hG.ii)](AH,B[dT(hG.iF)]),AI=Object[dT(hG.iu)+dT(hG.iq)+dT(hG.iz)](AH,B[dT(hG.ip)]),Ah=B[dT(hG.iZ)](x,-0x1*0x1c9b+0x19*0xe+0x1d9b),Ar=B[dT(hG.iD)],AC=B[dT(hG.im)];function AL(AW){var cD=dT;return B0[cD(PJ.B)](B0[cD(PJ.T)](AW,'_'),AC);}function Av(AW,AQ){var cm=dT,AG;TT['B8'][TT['B9']]&&AQ&&(AG=(0x17d9+0x1fc0+-0x1*0x3799,T8['BA'])(AW))[cm(PW.B)]&&(-0x1*-0x14a4+-0x1ee2+-0x72*-0x17,T8['BB'])(AW,location[cm(PW.T)])&&(-0x1f68+0x1*-0x2692+0x45fa,Ah['BE'])(B0[cm(PW.A)](AL,AG[cm(PW.B)]),AQ);}var Aa=B[dT(hG.ie)](x,0x24dc+-0x154a+-0xd76),Ai={};function AF(AW){var ce=dT;if(!TT['B8'][TT['B9']]||!(0x4*-0x8c5+-0x6*-0x3dc+0xbec,T8['BB'])(AW,location[ce(PQ.B)]))return AW;var AQ,AG=(0x61*0x9+-0x467*0x4+0xe33,T8['BA'])(AW),AR={},Al=-0x25de+-0x1*-0x14be+0x1120;for(AQ in Ai){var AV=(-0x2307+0x9a6+0x1961,Ah['Bj'])(Ai[AQ](AG[ce(PQ.T)]));AV&&(AR[AQ]=AV,++Al);}return B0[ce(PQ.A)](0x6*0x24b+0x27f+0x3*-0x56b,Al)?AW:(AG[ce(PQ.E)]=(0x29*0x7d+-0x5*0x6a9+0xd48,T8['Bk'])(AG[ce(PQ.x)],AR),(-0x2f6+0x1be4+-0x18ee,T8['By'])(AG));}Ai[Aa['B7']]=Aa['B5'],Ai[AC]=AL;var Au=[B[dT(hG.io)],B[dT(hG.iO)],B[dT(hG.iY)],B[dT(hG.ig)],B[dT(hG.ib)],B[dT(hG.iJ)],B[dT(hG.iW)],B[dT(hG.iQ)],B[dT(hG.io)]],Aq={},Az={};for(var Af,Ap=0x1d6+0x166c+-0x1842;B[dT(hG.iG)](Ap,-0x45a+0x199*0xd+0x292*-0x6);Ap++){var AZ=String[dT(hG.iR)+'de'](Ap),AZ=B[dT(hG.il)](encodeURIComponent,AZ);B[dT(hG.iV)](-0x161f+-0x94d+0x1f6f,AZ[dT(hG.it)])?Az[Ap]=Af=B[dT(hG.iN)]('%',Af=B[dT(hG.iw)]((Af=(Af=Ap)[dT(hG.F0)](0x1855+0x1*-0x2555+0xd10)[dT(hG.F1)+'e']())[dT(hG.F2)],0xde7*-0x1+0x3*-0xb4d+0x5fa*0x8)?B[dT(hG.Cf)]('0',Af):Af):Az[Ap]=AZ;}function AD(AW){var co=dT;return B0[co(PG.B)](AW,B0[co(PG.T)]);}var Am,Ao={'BI':function(AW){var cO=dT;return!!(0x809+0xcb*-0x1b+0xd60,Ah['Bj'])(B0[cO(PR.B)](AD,AW[cO(PR.T)]));},'Bh':function(AW){var cY=dT;(0x1de3*-0x1+-0x1955+0x3*0x1268,Ah['BE'])(B[cY(Pl.B)](AD,AW[cY(Pl.T)]),B[cY(Pl.A)],0x295bce8+0x103e08+-0xabe4*0x1c);},'Br':function(AW){var cg=dT;return!((-0x1*0x7c1+0xdc+-0x1*-0x6e5,T8['BH'])(AW)||AW[cg(PV.B)][cg(PV.T)](/(cloudauth-device|captcha-(pro-)?open).*?\.aliyuncs\.com$/)||!Ao['BI'](AW));},'BC':function(AW){var cb=dT;for(var AQ=0xac3+0x1*-0x239+-0x88a,AG=-0x19b3+0x98*-0x38+-0x1*-0x3af3;B0[cb(Pt.B)](AG,AW[cb(Pt.T)]);AG++)AQ=B0[cb(Pt.A)](B0[cb(Pt.E)](B0[cb(Pt.x)](B0[cb(Pt.c)](AQ,0x7*0x387+0x5c8*0x6+0xd6*-0x47),AQ),-0x1b47+-0x16ab+-0x67*-0x80),AW[cb(Pt.M)](AG)),AQ|=0x1d74+-0x1e17*0x1+-0xa3*-0x1;return AQ;},'BL':function(AW,AQ){return!!Ao['Br'](AW)&&Ao['Bv'](AW,AQ);},'Ba':function(AW){var cn=dT;if(Aq[AW])return Aq[AW];for(var AQ=-0xff5*0x1+0x10*-0x62+0x1615*0x1,AG=0x15f4+0x1816+-0x2e0a;B0[cn(Pw.B)](AG,AW[cn(Pw.T)]);AG++)AQ+=AW[AG][cn(Pw.A)]();var AR=B0[cn(Pw.E)](Au[B0[cn(Pw.x)](AQ,Au[cn(Pw.c)])],B0[cn(Pw.M)](AQ,-0x811+-0x1*0xb99+0x3aba));return Aq[AW]=AR;},'Bi':function(AW){var cJ=dT,AQ=(-0x2310+0x25e+-0xa*-0x345,T8['BA'])(AW)[cJ(I0.B)],AQ=Ao['Ba'](AQ);return(-0x890+-0x1*-0x76d+-0x1*-0x123,T8['BX'])(AW,AQ);},'Bv':function(AW,AQ){var cW=dT,AG=(0x784*-0x1+-0xd2c+-0x14b*-0x10,T8['By'])(AW,!(-0x91*0x23+0x30f+-0x4a*-0x3a)),AG=B[cW(I1.B)](encodeURIComponent,AG);if(AQ){if(TT['Bx'][cW(I1.T)]&&B[cW(I1.A)](AQ,Uint8Array)){for(var AR='',Al=0x18d4+0x44*-0x58+0x3*-0x7c;B[cW(I1.E)](Al,AQ[cW(I1.x)]);Al++)AR+=Az[AQ[Al]];AG+=AR;}else AG+=B[cW(I1.c)](encodeURIComponent,AQ);}var AG=B[cW(I1.M)](B[cW(I1.s)](B[cW(I1.j)](B[cW(I1.H)](B[cW(I1.k)](Ao['BC'](AG),'|'),B[cW(I1.y)](TA)),'|'),new Date()[cW(I1.X)]()),'|1'),AG=TB['BS'](AG,!(-0x1fc4+0x24b7+-0x7*0xb5)),AV={};return AV[Ao['Ba'](AW[cW(I1.U)])]=AG,AW[cW(I1.K)]=(-0xc7e+0x1258*-0x1+0x2*0xf6b,T8['Bk'])(AW[cW(I1.K)],AV),(0xf6c+-0x621*-0x1+0x1*-0x158d,T8['By'])(AW);}},AO=Ao['BL'],AY=(Ao['Bv'],Ao['Bi']),Ag=Ao['Bh'],Ab=Ao['Ba'],An=0xe48+0x2004+-0x2e4c;window._mts = Ao;function AJ(AW){var I3={B:0x4e7,T:0x323,A:0x60a,E:0x6e2,x:0x397,c:0x391,M:0x233},cQ=dT;return(AJ=B[cQ(I4.B)](B[cQ(I4.T)],typeof Symbol)&&B[cQ(I4.A)](B[cQ(I4.E)],typeof Symbol[cQ(I4.x)])?function(AQ){return typeof AQ;}:function(AQ){var cG=cQ;return AQ&&B0[cG(I3.B)](B0[cG(I3.T)],typeof Symbol)&&B0[cG(I3.A)](AQ[cG(I3.E)+'r'],Symbol)&&B0[cG(I3.x)](AQ,Symbol[cG(I3.c)])?B0[cG(I3.M)]:typeof AQ;})(AW);}TT['Bx'][dT(hG.F3)+dT(hG.F4)+'ed']||(TT['Bx'][dT(hG.F5)+dT(hG.F6)]=!(-0x13d7+-0x1e17+0x31ef*0x1),TT['Bx'][dT(hG.F7)+'id']='',TT['Bx'][dT(hG.F8)+dT(hG.F9)]=-0x3*0xa99+-0xc81+0x2d78,TT['Bx'][dT(hG.FB)+dT(hG.FT)]=TT['Bs'],Tu=TT['BM'][dT(hG.FA)]||TT['BM'][dT(hG.FE)]||TT['Bx'][dT(hG.Fd)],(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[dT(hG.Fx)](Tu)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i[dT(hG.Fc)](Tu[dT(hG.FM)](0x1028+0x1bcd+-0x21*0x155,0xb3d*0x1+0x166+-0xc9f)))&&(TT['Bx'][dT(hG.F5)+dT(hG.F6)]=!(-0x24c3+-0x1820+0x3ce3)),(Am={'BF':[],'Bu':[],'Bq':void(0xfe*-0x1d+0x8b*-0x3e+-0x4a*-0xd8),'Bz':void(-0x1db0+-0x1*-0x1162+0xc4e),'Bf':void(0x5ea+-0x5*0x4+-0x5d6),'Bp':void(-0xd*0x112+-0x204c+0x2e36),'BZ':void(0xca5+-0x7e*0x4+-0xaad),'BD':function(AW){var cR=dT;if(AW)switch(AW[cR(I5.B)]){case B[cR(I5.T)]:this['Bu'][cR(I5.A)](AW);break;case B[cR(I5.E)]:this['BF'][cR(I5.x)](AW);}},'Bm':!(TT['Bx'][dT(hG.F3)+dT(hG.vT)+'ed']=!(0x142a+-0x2211+0xde7)),'Be':0x0,'Bo':function(AW){var cl=dT,AQ,AG=AW[cl(I6.B)+cl(I6.T)];for(AQ in(Am['Bz'][cl(I6.A)](AW,AW[cl(I6.E)]),AW[cl(I6.x)+cl(I6.T)]=AG))AK[cl(I6.c)](AW,AQ,AG[AQ]);},'BO':function(){var Iq={B:0x45d,T:0x2f4,A:0x479,E:0x39a,x:0x661,c:0x1ab,M:0x765},IF={B:0x5e0,T:0x61a,A:0x5c0},Iv={B:0x5c0},Ir={B:0x4bf,T:0x4bf,A:0x5cd,E:0x704,x:0x1a0,c:0x6ad,M:0x39a},II={B:0xf4,T:0x1f5,A:0x675,E:0x62b,x:0x48f,c:0x790,M:0x5ad,s:0x542,j:0x632,H:0x430,k:0xd6,y:0x145,X:0x4c1,U:0x648,K:0x7eb,S:0x26e,P:0x648,I:0x229,h:0x631,C:0x657,L:0x49d,v:0xd6,a:0x77b,i:0x4bc,F:0x7ad,u:0x3a9,q:0x70a,z:0x39a,f:0x7eb,p:0x62b,Z:0x39a},IU={B:0x675,T:0x39a},Ik={B:0x675,T:0x3c2,A:0x7df,E:0x3e8,x:0x585,c:0x62b,M:0x52f},IH={B:0x3c2,T:0x7df,A:0x3c2,E:0x39a,x:0x3c2},Ij={B:0x655},Is={B:0x2af},Ic={B:0x1a9},IA={B:0x60a},IB={B:0x60a},I9={B:0x4e7},I8={B:0x3cb},I7={B:0x2dd},cN=dT,AW={'okiuk':function(AR,Al,AV){var cV=B3;return B0[cV(I7.B)](AR,Al,AV);},'zFXBk':function(AR,Al){var ct=B3;return B0[ct(I8.B)](AR,Al);},'uwbfw':B0[cN(Ip.B)],'doEgn':function(AR,Al){var cw=cN;return B0[cw(I9.B)](AR,Al);},'MKXEW':B0[cN(Ip.T)],'fzQjy':B0[cN(Ip.A)],'ukQCK':function(AR,Al){var M0=cN;return B0[M0(IB.B)](AR,Al);},'pdDdw':function(AR,Al){var M1=cN;return B0[M1(IT.B)](AR,Al);},'uRFMn':function(AR,Al){var M2=cN;return B0[M2(IA.B)](AR,Al);},'QQuWR':B0[cN(Ip.E)],'DPCdV':function(AR,Al){var M3=cN;return B0[M3(IE.B)](AR,Al);},'IuYJd':B0[cN(Ip.x)],'TxUoq':B0[cN(Ip.c)],'ByXzI':function(AR,Al){var M4=cN;return B0[M4(Id.B)](AR,Al);},'PPYrs':function(AR,Al){var M5=cN;return B0[M5(Ix.B)](AR,Al);},'RpNcE':function(AR,Al){var M6=cN;return B0[M6(Ic.B)](AR,Al);},'zmOUr':function(AR,Al){var M7=cN;return B0[M7(IM.B)](AR,Al);},'mYqhj':function(AR,Al){var M8=cN;return B0[M8(Is.B)](AR,Al);},'TBCet':function(AR,Al){var M9=cN;return B0[M9(Ij.B)](AR,Al);},'lEXUK':B0[cN(Ip.M)],'UXZVj':B0[cN(Ip.s)]};if(TT['Bx'][cN(Ip.j)+cN(Ip.H)]){AH[cN(Ip.k)+cN(Ip.y)]=function(AR,Al){var MB=cN;this[MB(IH.B)+MB(IH.T)]||(this[MB(IH.A)+MB(IH.T)]={}),AK[MB(IH.E)](this,AR,Al),this[MB(IH.x)+MB(IH.T)][AR]=Al;},Am['Bz']=AH[cN(Ip.X)]=function(){var MT=cN;this[MT(Ik.B)]=void(-0x1*0x1123+0x1858+-0x735),this[MT(Ik.T)+MT(Ik.A)]={};var AR=arguments[-0x1*-0x7b9+0x11*0x36+0x1*-0xb4e];AR=B0[MT(Ik.E)](AF,AR=B0[MT(Ik.x)](AY,AR)),arguments[0xb29*-0x1+-0x479+0xfa3]=AR,this[MT(Ik.c)]=arguments,Ay[MT(Ik.M)](this,arguments);},Am['Bq']=AH[cN(Ip.U)]=function(AR){var MA=cN;this[MA(IX.B)]&&delete this[MA(IX.B)],this[MA(IX.T)]=AR;var Al=Am['BY'](this[MA(IX.A)][0x2347+0x1*-0x1ebe+-0x488]),Al=AW[MA(IX.E)](AO,Al,AR);if(Al){this[MA(IX.x)][0x1*0xd4f+-0x79*-0x24+-0x1e52]=Al;var AV,At=this[MA(IX.c)+MA(IX.M)];for(AV in(Ay[MA(IX.s)](this,this[MA(IX.j)]),this[MA(IX.c)+MA(IX.H)]=At))AK[MA(IX.s)](this,[AV,At[AV]]);}this[MA(IX.k)]&&this[MA(IX.y)][MA(IX.X)+MA(IX.U)]&&AW[MA(IX.K)](-0x1ba7*0x1+-0x247*-0x1+0x1960,this[MA(IX.S)][MA(IX.P)+MA(IX.U)][MA(IX.I)])||Am['Bf'][MA(IX.h)](this,AW[MA(IX.C)],function(){}),Ak[MA(IX.L)](this,AR);},Am['Bq']=AH[cN(Ip.K)],Am['Bf']=AH[cN(Ip.S)+cN(Ip.P)]=function(AR,Al){var ME=cN;this[ME(Ih.B)]||(this[ME(Ih.T)]={});var AV,At,AN=Al;Al=AW[ME(Ih.A)](AW[ME(Ih.E)],AR)?(At=Al,function(Aw){var Md=ME;!this[Md(IU.B)]&&At&&At[Md(IU.T)](this,Aw);}):(AV=Al,function(Aw){var IP={B:0x5b3,T:0x41c,A:0x675,E:0x143,x:0x346},IK={B:0x661},Mc=ME,E0={'CEdPI':function(E4,E5){var Mx=B3;return AW[Mx(IK.B)](E4,E5);},'Rfyig':AW[Mc(II.B)],'FbVDn':AW[Mc(II.T)]};if(!this[Mc(II.A)]){var E1=this[Mc(II.E)][0x202+0x25*0xe3+-0x22d0];if(AW[Mc(II.x)](-0x1936+-0x6*-0x66f+-0x2*0x6b0,this[Mc(II.c)])&&this['Bg']&&(-0x2461+-0x1*0x15bf+0x3a20,T8['BB'])(E1,location[Mc(II.M)])&&(E2=this[Mc(II.s)+Mc(II.j)+'s']())&&AW[Mc(II.H)](-(-0x14f*-0x9+-0x1e2e+0x1268),E2[Mc(II.k)](Ar))&&(this['Bg']=!(-0xb9c*0x3+0x217c+0x159),AW[Mc(II.y)](Av,E1,this[Mc(II.X)+Mc(II.U)](Ar))),AW[Mc(II.K)](-0x2663+-0x17d6+0x3e3d,this[Mc(II.c)])&&Am['Bb'](this[Mc(II.S)],this[Mc(II.X)+Mc(II.P)](AW[Mc(II.I)]))){var E2='';try{E2=AW[Mc(II.h)](-(-0xad*-0x13+-0x2ac+-0xa2a),this[Mc(II.C)+'pe'][Mc(II.L)+'e']()[Mc(II.v)](AW[Mc(II.a)]))?new TextDecoder(AW[Mc(II.i)])[Mc(II.F)](this[Mc(II.u)]):AS[Mc(II.q)][Mc(II.z)](this);}catch(E4){}var E3=this;Am['Bn'](E2,function(E5){var IS={B:0x39a,T:0x678},MM=Mc;E0[MM(IP.B)](E0[MM(IP.T)],E3[MM(IP.A)]=E5)?TT['Bx'][MM(IP.E)](function(){var Ms=MM;Am['Bo'](E3),Am['Bq'][Ms(IS.B)](E3,E3[Ms(IS.T)]);}):Am['BD']({'type':E0[MM(IP.x)],'which':E5,'BJ':E3});},this[Mc(II.E)][-0x255e+0x2267+-0xbe*-0x4],AW[Mc(II.f)](!(0x1e70+0x6af*0x1+-0x128f*0x2),this[Mc(II.p)][-0x6d*0x35+0x1f77+-0x472*0x2]));}AV&&!this[Mc(II.A)]&&AV[Mc(II.Z)](this,Aw);}}),AX[ME(Ih.x)](this,AR,Al),this[ME(Ih.T)][AR]||(this[ME(Ih.c)][AR]=[]),this[ME(Ih.T)][AR][ME(Ih.M)]([AN,Al]);},Am['Bp']=AH[cN(Ip.I)+cN(Ip.h)]=function(AR,Al){var Mj=cN;if(this[Mj(Ir.B)]){for(var AV=this[Mj(Ir.T)][AR],At=Al,AN=0xad7*-0x1+0xb*0x350+-0x1999;AW[Mj(Ir.A)](AN,AV[Mj(Ir.E)]);++AN)if(AW[Mj(Ir.x)](AV[AN][0x845*0x4+-0x307+-0x1e0d],Al)){At=AV[AN][-0x21f8+-0x13e1+0x35da],AV[Mj(Ir.c)](AN,0x1*0x26bd+-0xbe9*0x1+-0x3*0x8f1);break;}AU[Mj(Ir.M)](this,AR,At);}};for(var AQ=[B0[cN(Ip.C)],B0[cN(Ip.L)],B0[cN(Ip.v)],B0[cN(Ip.a)],B0[cN(Ip.i)],B0[cN(Ip.F)],B0[cN(Ip.u)],B0[cN(Ip.q)]],AG=0xb*0xf7+0x516+-0xfb3*0x1;B0[cN(Ip.z)](AG,AQ[cN(Ip.f)]);++AG)!function(AR){var Ii={B:0x206,T:0x39a,A:0x73c,E:0x63a,x:0x206},Ia={B:0x63a},IL={B:0x1e2},IC={B:0x5c0},MX=cN,Al={'OOnqb':function(AV,At){var MH=B3;return AW[MH(IC.B)](AV,At);},'cEPSy':function(AV,At){var Mk=B3;return AW[Mk(IL.B)](AV,At);},'FCzhD':function(AV,At){var My=B3;return AW[My(Iv.B)](AV,At);}};Object[MX(IF.B)+MX(IF.T)](AH,AW[MX(IF.A)]('on',AR),{'get':function(){var MU=MX;return this['BW']?this['BW'][Al[MU(Ia.B)]('on',AR)]:void(0x18d3*-0x1+0x1*0x13ff+-0x6*-0xce);},'set':function(AV){var MK=MX;this['BW']||(this['BW']={}),this['BW'][Al[MK(Ii.B)]('on',AR)]&&(Am['Bp'][MK(Ii.T)](this,AR,this['BW'][Al[MK(Ii.A)]('on',AR)]),delete this['BW'][Al[MK(Ii.E)]('on',AR)]),AV&&(Am['Bf'][MK(Ii.T)](this,AR,AV),this['BW'][Al[MK(Ii.x)]('on',AR)]=AV);},'configurable':!(0x3*0x81d+-0x105f+-0x7f8)});}(AQ[AG]);Object[cN(Ip.p)+cN(Ip.Z)](AH,B0[cN(Ip.D)],{'get':function(){var MS=cN;return AW[MS(Iu.B)](AW[MS(Iu.T)],this[MS(Iu.A)+MS(Iu.E)])?AP[MS(Iu.x)][MS(Iu.c)](this):AW[MS(Iu.M)];},'set':function(AR){var MP=cN;this[MP(Iq.B)+MP(Iq.T)]=AR,AP[MP(Iq.A)][MP(Iq.E)](this,AW[MP(Iq.x)](AW[MP(Iq.c)],AR)?AW[MP(Iq.M)]:AR);},'configurable':!(0xf7+0xeef+-0x4a*0x37)}),Object[cN(Ip.m)+cN(Ip.Z)](AH,B0[cN(Ip.e)],{'get':function(){var MI=cN;if(B0[MI(Iz.B)](B0[MI(Iz.T)],this[MI(Iz.A)+MI(Iz.E)]))return AI[MI(Iz.x)][MI(Iz.c)](this);try{return JSON[MI(Iz.M)](AS[MI(Iz.x)][MI(Iz.c)](this));}catch(AR){return null;}},'configurable':!(-0x11*0x1f+0x726*0x2+-0xc3d)}),Object[cN(Ip.o)+cN(Ip.O)](AH,B0[cN(Ip.Y)],{'get':function(){var Mh=cN;if(B0[Mh(If.B)](B0[Mh(If.T)],this[Mh(If.A)+Mh(If.E)]))return AS[Mh(If.x)][Mh(If.c)](this);throw new Error(B0[Mh(If.M)]);},'configurable':!(0x1bf0+0xa87*0x2+-0x1*0x30fe)}),XMLHttpRequest[cN(Ip.g)]=!(-0x983+0xeb7+-0x6f*0xc);}},'Bn':function(AW,AQ,AG,AR){var Mr=dT,Al,AV=(0x260f+0x138f+-0x399e,T8['BA'])(AG),At='',AN='';if(!(-0xb85+-0x1ab5+0x263a,T8['BH'])(AV)){if(AW&&B[Mr(ID.B)](B[Mr(ID.T)],typeof AW)&&B[Mr(ID.A)](-(0x3*-0x845+-0x1*-0x20e1+-0x811),AW[Mr(ID.E)](B[Mr(ID.x)][Mr(ID.c)](B[Mr(ID.M)])))&&/userUserId: ?requestInfo.userUserId/[Mr(ID.s)](AW)&&B[Mr(ID.j)](-(0x233*0xd+0x1*0x242+-0x1ed8),AW[Mr(ID.E)](B[Mr(ID.H)][Mr(ID.k)](B[Mr(ID.y)]))))At=B[Mr(ID.X)],AN='2';else{if(AW&&B[Mr(ID.U)](B[Mr(ID.K)],typeof AW)&&B[Mr(ID.S)](-(0x181c+0x8f1+0x24*-0xeb),AW[Mr(ID.P)](B[Mr(ID.I)][Mr(ID.c)](B[Mr(ID.h)]))))At=B[Mr(ID.C)];else{if(AW&&B[Mr(ID.L)](B[Mr(ID.v)],typeof AW)&&B[Mr(ID.a)](-(-0x270d*0x1+0x1fb5+-0x3*-0x273),AW[Mr(ID.i)](B[Mr(ID.F)][Mr(ID.c)](B[Mr(ID.u)])))&&B[Mr(ID.q)](-(0x249*-0xc+0xd8b*0x2+-0x1*-0x57),AW[Mr(ID.z)](B[Mr(ID.f)])))At=B[Mr(ID.p)];else{if(AW&&B[Mr(ID.Z)](B[Mr(ID.D)],typeof AW)&&(B[Mr(ID.m)](-(0x1*-0xe42+-0xa20+-0x821*-0x3),(Al=AW)[Mr(ID.i)](B[Mr(ID.e)][Mr(ID.k)](B[Mr(ID.o)])))&&B[Mr(ID.O)](-(-0xe6*0x1+0x1863*0x1+-0x177c),Al[Mr(ID.Y)](B[Mr(ID.g)][Mr(ID.c)](B[Mr(ID.b)])))||B[Mr(ID.n)](-(0x1*0x25ba+-0x1bd0+0x2b*-0x3b),Al[Mr(ID.P)](B[Mr(ID.J)][Mr(ID.c)](B[Mr(ID.W)])))&&B[Mr(ID.Q)](-(0x12cf+0xfb4+-0x2282),Al[Mr(ID.P)](B[Mr(ID.G)][Mr(ID.c)](B[Mr(ID.R)])))||B[Mr(ID.l)](-(-0x1d0d+-0x3*-0x488+0xf76),Al[Mr(ID.P)](B[Mr(ID.V)][Mr(ID.k)](B[Mr(ID.t)])))&&B[Mr(ID.N)](-(0x1cc5+0x525*0x1+-0x21e9),Al[Mr(ID.z)](B[Mr(ID.w)][Mr(ID.B0)](B[Mr(ID.B1)])))||B[Mr(ID.n)](-(-0xa7*0x25+-0x6*0x3b2+0x2e50),Al[Mr(ID.E)](B[Mr(ID.T6)][Mr(ID.T7)](B[Mr(ID.T8)])))&&B[Mr(ID.T9)](-(-0x1*0x107+0x1*0x24c1+0x9b*-0x3b),Al[Mr(ID.P)](B[Mr(ID.TB)][Mr(ID.T7)](B[Mr(ID.TT)])))&&B[Mr(ID.TA)](-(0xba3+-0xb9b+-0x7),Al[Mr(ID.TE)](B[Mr(ID.Td)][Mr(ID.Tx)](B[Mr(ID.Tc)])))))return B[Mr(ID.TM)](-(0x1b25+0x1f8c+-0x3ab0),AG[Mr(ID.Ts)](B[Mr(ID.Tj)](Ab,AV[Mr(ID.TH)])))&&An++,!(B[Mr(ID.a)](0x2040+0x83*-0x3e+0x34*-0x2,An)||(B[Mr(ID.Tk)](Ag,AV),B[Mr(ID.Ty)](AQ,B[Mr(ID.TX)]),-0x1*-0x19f6+0x180b+-0x3201));}}}if(B[Mr(ID.TU)]('',At))switch(B[Mr(ID.TK)](AQ,At),At){case B[Mr(ID.TS)]:var Aw=AW[Mr(ID.TP)](B[Mr(ID.TI)])[0xd*-0x1eb+0x449*0x7+-0x50f][Mr(ID.TP)]('\x27;')[-0x41*0x77+-0x1dea+0x3c21];if(B[Mr(ID.Th)](-0xda8+0x1*-0xc05+-0x19d5*-0x1,Aw[Mr(ID.Tr)]))(0x83*0x45+-0x1f22+0x42d*-0x1,Aj['Bd'])(Aw,AG),AR?Am['BQ']():TT['Bx'][Mr(ID.TC)](Am['BQ'][Mr(ID.TL)](Am));else{var E0=/<script\sname="aliyunwaf_6a6f5ea8">(.+)?<\/script>/gm[Mr(ID.Tv)](AW),E1=TT['Bx'][Mr(ID.Ta)],E2=(TT['Bx'][Mr(ID.Ta)]=Aw,TT['Bx'][Mr(ID.Ti)+Mr(ID.TF)]=function(E7){var MC=Mr;TT['Bx'][MC(IZ.B)]=E1,(-0x269b+-0x61*-0x21+0x1a1a,Aa['B4'])(AG,E7),E2[MC(IZ.T)](),delete TT['Bx'][MC(IZ.A)+MC(IZ.E)],AR?Am['BQ']():TT['Bx'][MC(IZ.x)](Am['BQ'][MC(IZ.c)](Am));},TT['Bc'][Mr(ID.Tu)+Mr(ID.Tq)](B[Mr(ID.Tz)]));E2[Mr(ID.Tf)]=B[Mr(ID.Tp)],TK?E2[Mr(ID.TZ)]=E0[-0x35*0x6d+0x2*0x727+0x844]:E2[Mr(ID.TD)]=B[Mr(ID.Tm)];try{B[Mr(ID.Te)](TI)[Mr(ID.To)+'d'](E2);}catch(E7){}}return!(0x2*-0xc73+-0x1652+0x2*0x179c);case B[Mr(ID.TO)]:var Aw='cn',E0=B[Mr(ID.TY)](B[Mr(ID.Tg)](B[Mr(ID.Tb)],new Date()[Mr(ID.Tn)]()),'ba'),E3={},E4=/var requestInfo = ({[\s\S]*?});/g[Mr(ID.TJ)](AW);if(B[Mr(ID.TW)](null,E4)&&(E0=(E3=new Function(B[Mr(ID.TQ)](B[Mr(ID.TG)],E4[0x1285*0x1+0x1a25+-0x2ca9]))())[Mr(ID.TR)]),B[Mr(ID.Tl)]('2',AN))E3[Mr(ID.TV)]&&B[Mr(ID.Tt)](B[Mr(ID.TN)],E3[Mr(ID.Tw)])&&(Aw='en'),E3[Mr(ID.A0)]?TT['Bx'][Mr(ID.A1)+'id']=E3[Mr(ID.A2)]:TT['Bx'][Mr(ID.A3)+'id']=Am['BG'](AW);else{if(TT['Bx'][Mr(ID.A4)+'id']=Am['BG'](AW),!Am['Bm']){var E5,E6=/window.(aliyun_captcha(id|trace)_[0-9a-f]{4}) ='([0-9a-f]+)';/gm;for(E3['BR']=[];B[Mr(ID.A5)](null,E5=E6[Mr(ID.A6)](AW));)B[Mr(ID.A7)](E5[Mr(ID.A8)],E6[Mr(ID.A9)])&&E6[Mr(ID.AB)]++,E3['BR'][Mr(ID.AT)](E5[0xcd*-0x2b+-0x6c5+0x2935*0x1]),E5[-0xfb1+-0x14de+0x2490]&&E5[-0x133*0x5+-0xd67+0x1369]&&(TT['Bx'][E5[-0x167*0x13+0x15*-0xd+0x1bb7]]=E5[-0x15fc+0x1491+0x16e]);}(B[Mr(ID.AA)](-(-0x151a+0x1478+0xa3),AW[Mr(ID.AE)](B[Mr(ID.Ad)]))||B[Mr(ID.a)](-(0x466+0x2b*0xaa+0x1*-0x20f3),AW[Mr(ID.Ax)](B[Mr(ID.Ac)])))&&(Aw='en');}return Am['Bl'](E0,Aw,AN,E3),!(-0x460+0x26e*-0x1+0x6ce);}}return!(0x1b59+0x166c+0x7*-0x71c);},'BV':function(){var hx={B:0x7b8},IW={B:0x74c},IJ={B:0x777},In={B:0x2d0},IY={B:0x3e8},Im={B:0x238},Mq=dT,AW={'nTKxh':function(AR,Al){var ML=B3;return B0[ML(Im.B)](AR,Al);},'iuTSc':function(AR,Al){var Mv=B3;return B0[Mv(Ie.B)](AR,Al);},'yWJbO':function(AR,Al){var Ma=B3;return B0[Ma(Io.B)](AR,Al);},'aXEPm':function(AR,Al){var Mi=B3;return B0[Mi(IO.B)](AR,Al);},'vpCVX':function(AR,Al){var MF=B3;return B0[MF(IY.B)](AR,Al);},'bXtSC':function(AR,Al){var Mu=B3;return B0[Mu(Ig.B)](AR,Al);},'JOlBq':B0[Mq(hM.B)],'nMZXp':function(AR,Al,AV){var Mz=Mq;return B0[Mz(Ib.B)](AR,Al,AV);},'tnLCI':B0[Mq(hM.T)],'fMsQb':B0[Mq(hM.A)],'IryJc':function(AR,Al){var Mf=Mq;return B0[Mf(In.B)](AR,Al);},'PjsDZ':function(AR,Al){var Mp=Mq;return B0[Mp(IJ.B)](AR,Al);},'XoEUD':B0[Mq(hM.E)],'HgaCa':function(AR,Al){var MZ=Mq;return B0[MZ(IW.B)](AR,Al);}},AQ,AG;TT['Bx'][Mq(hM.x)]&&(AQ=Request,TT['Bx'][Mq(hM.c)]=function(AR,Al){var MD=Mq,AV=new AQ(AR,Al);return B0[MD(IQ.B)](AR,AQ)&&(Al=Object[MD(IQ.T)](AR[MD(IQ.A)]?Object[MD(IQ.E)]({},AR[MD(IQ.x)]):{},Al),AR=AR[MD(IQ.c)]),AV[MD(IQ.c)]=AR,AV[MD(IQ.M)]=Al,AV;},AG=fetch,TT['Bx'][Mq(hM.M)]=function(){var hd={B:0x67b,T:0x70f,A:0x72c},hE={B:0x7af,T:0x7f3,A:0x1e6,E:0x25c,x:0x70a,c:0x26e,M:0x70a,s:0x38f,j:0x215,H:0x5ba,k:0x327,y:0x154,X:0x6fb},h0={B:0x251},Iw={B:0x751},IV={B:0x689},Il={B:0x753},Mm=Mq,AR=arguments[0x1*0xbca+-0x6*-0x11b+-0x126c],Al=arguments[0x191*0x13+0x8d2*0x4+-0x410a],AV=(AW[Mm(hc.B)](AR,AQ)&&(AR=arguments[0x146*-0x7+-0xad*-0x29+-0x11*0x11b][Mm(hc.T)],Al=arguments[-0x15e1+-0x62+-0x1643*-0x1][Mm(hc.A)]),AW[Mm(hc.E)](null,Al)?Al={'credentials':AW[Mm(hc.x)]}:Al[Mm(hc.c)+'s']||(Al[Mm(hc.M)+'s']=AW[Mm(hc.x)]),AR=AW[Mm(hc.s)](AF,AR=AW[Mm(hc.j)](AY,AR)),Am['BY'](AR)),AV=AW[Mm(hc.H)](AO,AV,Al[Mm(hc.k)]);return AV&&(AR=AV),AG[Mm(hc.y)](this,AR,Al)[Mm(hc.X)](function(At){var h2={B:0x1e6},h1={B:0x2f5},IN={B:0x554},It={B:0x43f},IR={B:0xed},IG={B:0x36e},Mn=Mm,AN={'pSYXL':function(Aw,E0){var Me=B3;return AW[Me(IG.B)](Aw,E0);},'tyFea':function(Aw,E0){var Mo=B3;return AW[Mo(IR.B)](Aw,E0);},'oNctK':function(Aw,E0){var MO=B3;return AW[MO(Il.B)](Aw,E0);},'CuGFB':function(Aw,E0){var MY=B3;return AW[MY(IV.B)](Aw,E0);},'tMzYs':function(Aw,E0){var Mg=B3;return AW[Mg(It.B)](Aw,E0);},'yvcxl':function(Aw,E0){var Mb=B3;return AW[Mb(IN.B)](Aw,E0);},'SphQn':AW[Mn(hd.B)],'JVIoP':function(Aw,E0,E1){var MJ=Mn;return AW[MJ(Iw.B)](Aw,E0,E1);},'sqVsw':AW[Mn(hd.T)],'ldUGm':AW[Mn(hd.A)],'fIhSF':function(Aw,E0){var MW=Mn;return AW[MW(h0.B)](Aw,E0);}};return new Promise(function(Aw,E0){var hA={B:0x50a},hT={B:0x42c},h6={B:0x4f4},h5={B:0x4f4},h3={B:0x680},MG=Mn,E1={'lJXcH':function(E2,E3){var MQ=B3;return AN[MQ(h1.B)](E2,E3);},'mXTyx':AN[MG(hE.B)],'uxHyZ':function(E2,E3,E4){var MR=MG;return AN[MR(h2.B)](E2,E3,E4);},'GlsPX':AN[MG(hE.T)]};AN[MG(hE.A)](Av,AR,At[MG(hE.E)][MG(hE.x)](Ar)),Am['Bb'](At[MG(hE.c)],At[MG(hE.E)][MG(hE.M)](AN[MG(hE.s)]))?At[MG(hE.j)]()[MG(hE.H)]()[MG(hE.k)](function(E2){var hB={B:0x258,T:0x28c,A:0x7e2,E:0x327,x:0x154,c:0x57c},h9={B:0x3fc},h7={B:0x469,T:0x26e,A:0x780,E:0x117},h4={B:0x7db},s2=MG,E3={'gsdDZ':function(E4,E5){var Ml=B3;return AN[Ml(h3.B)](E4,E5);},'mGqBt':function(E4,E5){var MV=B3;return AN[MV(h4.B)](E4,E5);},'Vdedr':function(E4,E5){var Mt=B3;return AN[Mt(h5.B)](E4,E5);},'UuZOM':function(E4,E5){var MN=B3;return AN[MN(h6.B)](E4,E5);}};Am['Bn'](E2,function(E4){var Mw=B3;E1[Mw(hB.B)](E1[Mw(hB.T)],E4)?E1[Mw(hB.A)](fetch,AR,Al)[Mw(hB.E)](function(E5){var s0=Mw;E3[s0(h7.B)](0x26*-0xfd+0xc4f+-0x3*-0x8ad,E5[s0(h7.T)])&&E3[s0(h7.A)](E5[s0(h7.T)],-0x431*-0x4+0xc7*0x1e+-0x2*0x1311)&&E3[s0(h7.E)](Aw,E5);})[Mw(hB.x)](function(E5){}):Am['BD']({'type':E1[Mw(hB.c)],'which':E4,'Bt':AR,'BN':Al,'Bw':function(E5){var s1=Mw;E3[s1(h9.B)](Aw,E5);}});},AR)||AN[s2(hT.B)](Aw,At);})[MG(hE.y)](function(E2){var s3=MG;AN[s3(hA.B)](Aw,At);}):AN[MG(hE.X)](Aw,At);});})[Mm(hc.U)](function(At){var s4=Mm;return Promise[s4(hx.B)](At);});},TT['Bx'][Mq(hM.x)][Mq(hM.s)]=!(-0x1c8d+-0x4e*0x27+0x286f));},'Bb':function(AW,AQ){var s5=dT;return B[s5(hs.B)](0x1ec2+0x202d*0x1+-0x3e27,AW)&&AQ&&B[s5(hs.T)](-(0x2ab*0xc+0x24*0x1c+0x1*-0x23f3),AQ[s5(hs.A)](B[s5(hs.E)]));},'Bl':function(AW,AQ,AG,AR){var hK={B:0x687,T:0x4c4,A:0x234,E:0x7e5,x:0x7cb,c:0x395,M:0x1e9,s:0x375,j:0x60b,H:0x34f,k:0x34b},hU={B:0x546,T:0x4ec,A:0x668,E:0x4ec,x:0x573,c:0x588,M:0x11a,s:0x652,j:0x4dd,H:0x32c,k:0x5ce,y:0x79d,X:0x723,U:0x2ca,K:0x53e,S:0x5c9,P:0x546,I:0x235,h:0x30b,C:0x1ad,L:0x235,v:0x645,a:0x3d2,i:0xc3,F:0x7ab,u:0x1ad,q:0x32c,z:0x652},hX={B:0x4b6},hj={B:0x1ef},sE=dT,Al={'nhxzg':function(E0,E1){var s6=B3;return B0[s6(hj.B)](E0,E1);},'chEwe':function(E0,E1){var s7=B3;return B0[s7(hH.B)](E0,E1);}},AV,At,AN=this;function Aw(E0,E1,E2){var hy={B:0x3c7},hk={B:0x78f},s8=B3,E3={'OxvHD':B0[s8(hK.B)],'aAdNX':B0[s8(hK.T)],'aatxb':function(E4,E5){var s9=s8;return B0[s9(hk.B)](E4,E5);},'Ztebf':B0[s8(hK.A)],'RBMdR':function(E4){var sB=s8;return B0[sB(hy.B)](E4);},'HZLws':B0[s8(hK.E)],'IWimF':B0[s8(hK.x)],'ODMXt':function(E4,E5){var sT=s8;return B0[sT(hX.B)](E4,E5);},'cTvIU':B0[s8(hK.c)],'uFFHK':B0[s8(hK.M)],'zUFCg':B0[s8(hK.s)],'YbfTi':B0[s8(hK.j)],'DjHvd':B0[s8(hK.H)]};B0[s8(hK.k)](setTimeout,function(){var sA=s8,E4,E5,E6;TT['Bc'][sA(hU.B)+sA(hU.T)](E3[sA(hU.A)])?(TT['Bc'][sA(hU.B)+sA(hU.E)](E3[sA(hU.A)])[sA(hU.x)][sA(hU.c)]=E3[sA(hU.M)],Am['BZ']||(Am['BZ']=E3[sA(hU.s)](TP,E3[sA(hU.j)])),E3[sA(hU.H)](TI)[sA(hU.k)+'d'](Am['BZ']),E4=E3[sA(hU.y)],E5=E3[sA(hU.X)],E3[sA(hU.U)]('en',AQ)&&(E5=E3[sA(hU.K)],E4=E3[sA(hU.S)]),(E6=TT['Bc'][sA(hU.P)+sA(hU.I)+'me'](E3[sA(hU.h)]))&&(E6[0x2072+0x1b1a+0x2*-0x1dc6][sA(hU.C)]=E4),(E6=TT['Bc'][sA(hU.B)+sA(hU.L)+'me'](TT['Bx'][sA(hU.v)+sA(hU.a)]?E3[sA(hU.i)]:E3[sA(hU.F)]))&&(E6[0xf4c+-0x155*0x12+0x1*0x8ae][sA(hU.u)]=E5),E1?E3[sA(hU.q)](E2):Am['T0'](E2,E0)):E3[sA(hU.z)](Aw,E0);},0xd26+0x20e*-0x8+0x3d*0x16);}AN['Bm']||(AN['Bm']=!(0x23c6+-0x160+-0x2266),Am['T1'](AG),B0[sE(hi.B)](0x11d5+0x226b+-0x6*0x8b5,AG)?(AV={'userId':AR[sE(hi.T)],'userUserId':AR[sE(hi.A)],'SceneId':AR[sE(hi.E)],'mode':B0[sE(hi.x)],'element':B0[sE(hi.c)],'slideStyle':{'width':TT['Bx'][sE(hi.M)+sE(hi.s)]?TT['Bx'][sE(hi.j)+sE(hi.H)]:-0xa26+-0x1167+0x1ccd,'height':TT['Bx'][sE(hi.k)+sE(hi.s)]?B0[sE(hi.y)](TT['Bx'][sE(hi.j)+sE(hi.X)],0x215+-0x3*0xcb5+0x2412):0x19*-0x61+0x1a7*0xd+-0xbda},'language':AQ,'immediate':!(-0x206e+0x6e*-0x25+0x3054),'success':function(E0){var sd=sE,E1={};E1[sd(hS.B)]=AR[sd(hS.T)],E1[sd(hS.A)]=E0,E1[sd(hS.E)]=AR[sd(hS.x)],AN['BQ'](E1);},'fail':function(E0){},'getInstance':function(E0){},'verifyType':B0[sE(hi.U)],'region':AR[sE(hi.K)],'UserCertifyId':AR[sE(hi.S)]},B0[sE(hi.P)](Aw,AG,TT['Bx'][sE(hi.I)+sE(hi.h)],function(){var sx=sE;B0[sx(hh.B)](initAliyunCaptcha,AV);})):(At={'renderTo':B0[sE(hi.c)],'appkey':B0[sE(hi.C)],'scene':B0[sE(hi.L)],'trans':{'key1':B0[sE(hi.v)],'user':B0[sE(hi.a)],'aysnc':'1'},'token':AW,'language':AQ,'isEnabled':!(-0x716+0x1*-0x1fea+-0x4e0*-0x8),'times':0x3,'success':function(E0){var sc=sE;if(Al[sc(hr.B)](void(-0x1*-0x1cf3+0x12*-0xaa+-0xe5*0x13),E0[sc(hr.T)])&&(E0[sc(hr.T)]=AW),AR['BR']){for(var E1=0x1*-0x314+0x1e54+-0x1b40;Al[sc(hr.A)](E1,AR['BR'][sc(hr.E)]);++E1)delete TT['Bx'][AR['BR'][E1]];}var E2={};E2[sc(hr.x)]=E0[sc(hr.c)],E2[sc(hr.M)]=E0[sc(hr.s)],E2[sc(hr.j)]=E0[sc(hr.H)],AN['BQ'](E2);},'fail':function(E0){},'error':function(E0){}},TT['Bx'][sE(hi.i)+sE(hi.s)]&&(At[sE(hi.F)]=B0[sE(hi.u)],At[sE(hi.q)]=TT['Bx'][sE(hi.z)+sE(hi.f)]),B0[sE(hi.p)](Aw,AG,TT['Bx'][sE(hi.Z)]&&TT['Bx'][sE(hi.Z)][sE(hi.D)],function(){var hv={B:0x4ba},sM=sE;AWSC[sM(ha.B)]('nc',function(E0,E1){var ss=sM;TT['Bx']['nc']=E1[ss(hv.B)](At);});})),TT['Bc'][sE(hi.m)+sE(hi.e)](B0[sE(hi.o)])&&(TT['Bc'][sE(hi.O)+sE(hi.e)](B0[sE(hi.Y)])[sE(hi.g)]=B0[sE(hi.b)](B0[sE(hi.n)]('cn',AQ)?B0[sE(hi.J)]:B0[sE(hi.W)],TT['Bx'][sE(hi.Q)+'id'])));},'BQ':function(AW){var hZ={B:0x4ee,T:0x26e,A:0x407,E:0x26e,x:0x6de},hf={B:0x191},hz={B:0x1e1},hu={B:0x658},hF={B:0x2b3},sU=dT,AQ={'oemzI':function(AV,At){var sj=B3;return B0[sj(hF.B)](AV,At);},'WrRoN':function(AV,At){var sH=B3;return B0[sH(hu.B)](AV,At);},'EpHAC':function(AV,At){var sk=B3;return B0[sk(hq.B)](AV,At);},'XOXpb':function(AV,At){var sy=B3;return B0[sy(hz.B)](AV,At);},'jKadQ':function(AV,At){var sX=B3;return B0[sX(hf.B)](AV,At);}},AG=this;if(AW){var AR=TT['Bc'][sU(he.B)+sU(he.T)](B0[sU(he.A)]),Al=TT['Bc'][sU(he.B)+sU(he.E)](B0[sU(he.x)]);Al&&(Al[sU(he.c)][sU(he.M)]=B0[sU(he.s)]),AR&&(AR[sU(he.j)]=''),AG['Bm']=!(0x1a5e+-0x22e0+-0x1*-0x883);try{Am['BZ'][sU(he.H)]();}catch(AV){}}else AG['Be']+=0x1*-0xa99+-0x1b72+0x260c;!function At(AN){var hp={B:0x4b0,T:0x790,A:0x106},sK=sU,Aw,E0,E1,E2,E3,E4,E5;B0[sK(hm.B)](0x33*0x83+0x1777+-0x3190,AN[sK(hm.T)])&&(Aw=AN[0x1*-0x21a5+0x20a7+0xfe],AN[sK(hm.A)](-0x18eb+-0x1e6b+-0x313*-0x12,0x1b23*0x1+-0xea8+-0x63d*0x2),B0[sK(hm.E)](B0[sK(hm.x)],Aw[sK(hm.c)])?(E0=Aw['BJ'],E4=(E1=Aw['BJ'])[sK(hm.M)],E2=E1[sK(hm.s)],E3=E4[-0x13a9+-0xd3*0x5+0x17c9],B0[sK(hm.j)](B0[sK(hm.H)],Aw[sK(hm.k)])&&((E5=AG['BY'](E3))[sK(hm.y)]=AG['T2'](E5[sK(hm.X)],AW),E4[0x25*0x10d+0x37f+-0x2a5f]=AG['T3'](E5),E0['Bg']=!(-0x1645+-0x75*0x50+0x3ad5)),Am['Bo'](E1),E0[sK(hm.U)+sK(hm.K)](B0[sK(hm.S)],function(E6){var sS=sK;AQ[sS(hp.B)](-0xa6*-0x3a+-0x95c+0x116*-0x1a,E0[sS(hp.T)])&&AQ[sS(hp.A)](At,AN);}),Am['Bq'][sK(hm.P)](E0,E2)):B0[sK(hm.I)](B0[sK(hm.h)],Aw[sK(hm.C)])&&(E3=Aw['Bt'],E4=Aw['BN'],B0[sK(hm.L)](B0[sK(hm.v)],B0[sK(hm.a)](AJ,E3))&&E3[sK(hm.i)]&&Aw['T4']?E3=Aw['T4']:B0[sK(hm.F)](B0[sK(hm.H)],Aw[sK(hm.u)])&&((E5=AG['BY'](E3))[sK(hm.y)]=AG['T2'](E5[sK(hm.X)],AW),E3=AG['T3'](E5)),B0[sK(hm.q)](fetch,E3,E4)[sK(hm.z)](function(E6){var sP=sK;AQ[sP(hZ.B)](0x129b+0x32c*-0x4+0x107*-0x5,E6[sP(hZ.T)])&&AQ[sP(hZ.A)](E6[sP(hZ.E)],0xffc+0x11db+0x9*-0x38b)&&Aw['Bw'](E6),AQ[sP(hZ.x)](At,AN);})[sK(hm.f)](function(E6){})));}(AW?this['BF']:this['Bu']);},'BY':T8['BA'],'T3':T8['By'],'T2':T8['Bk'],'BG':function(AW){var sI=dT,AQ,AG;return B[sI(ho.B)](-(-0x13e+0x1*-0x3ce+0x50d),AQ=AW[sI(ho.T)](B[sI(ho.A)]))?'':(AQ=AW[sI(ho.E)](':\x20',AQ),AG=AW[sI(ho.x)](B[sI(ho.c)],AQ),AW[sI(ho.M)](B[sI(ho.s)](AQ,0x5*-0x262+0x243a+-0x81a*0x3),AG));},'T5':function(AW){var sh=dT,AQ=TT['Bx'][sh(hY.B)+sh(hY.T)]?(AR=B[sh(hY.A)],AQ=(function(){var sr=sh;try{var Al,AV=TT['Bc'][sr(hO.B)+sr(hO.T)](B0[sr(hO.A)]);return AV&&B0[sr(hO.E)](-0x1*-0x24cb+-0x35*-0x61+0x38df*-0x1,AV[sr(hO.x)])&&AV[-0x1d06+0x33*-0x6c+0x2*0x1945][sr(hO.c)]&&B0[sr(hO.M)](-(0xaa2*-0x1+-0x19cd*-0x1+-0xf2a),AV[0x1f70+0x1*-0xe95+0x10db*-0x1][sr(hO.c)][sr(hO.s)](B0[sr(hO.j)]))?(AV=AV[-0x2685+-0x2258*0x1+0x48dd][sr(hO.c)][sr(hO.H)](/\s+/g,''),B0[sr(hO.k)](-0x4*0x727+-0x15bb*-0x1+0x6e1,Al=B0[sr(hO.y)](parseFloat,AV[sr(hO.X)](B0[sr(hO.U)])[0x1e51+0x1176*0x2+-0x19*0x29c][sr(hO.K)](',')[-0x8e1*-0x3+-0x1989+-0x2*0x8d]))?-0x1ab*0x13+-0x1*-0x6c9+-0x18e9*-0x1:B0[sr(hO.S)](0x40f*0x1+0x5*0x611+-0x2263,Al)):0x2*0xf2c+0x1*0xb3+-0x1d*0x112;}catch(At){return 0x648+-0x11e5*-0x2+0x59*-0x79;}}()),TT['Bx'][sh(hY.E)+sh(hY.x)]=B[sh(hY.c)](0xd4b+-0x1*0x1ef5+0x1*0x12d6,AQ),B[sh(hY.M)](B[sh(hY.s)](B[sh(hY.j)](B[sh(hY.H)](B[sh(hY.k)](B[sh(hY.y)](B[sh(hY.X)](B[sh(hY.U)](B[sh(hY.K)](B[sh(hY.S)](B[sh(hY.P)](B[sh(hY.I)](B[sh(hY.h)](B[sh(hY.C)](B[sh(hY.L)](B[sh(hY.S)](B[sh(hY.j)](B[sh(hY.v)](B[sh(hY.a)](B[sh(hY.i)](B[sh(hY.F)](B[sh(hY.u)](B[sh(hY.q)](B[sh(hY.z)](B[sh(hY.f)](B[sh(hY.p)](B[sh(hY.Z)](B[sh(hY.D)](B[sh(hY.m)](B[sh(hY.e)](B[sh(hY.o)](B[sh(hY.u)](B[sh(hY.O)](B[sh(hY.Y)](B[sh(hY.g)](B[sh(hY.b)](B[sh(hY.n)](B[sh(hY.J)](B[sh(hY.W)](B[sh(hY.Q)](B[sh(hY.G)](B[sh(hY.R)](B[sh(hY.l)](B[sh(hY.H)](B[sh(hY.V)](B[sh(hY.t)](B[sh(hY.N)],B[sh(hY.w)](-0x18c3+-0x141a*0x1+-0x35*-0xd9,AQ)),B[sh(hY.B0)]),B[sh(hY.B1)](-0x1*-0x34+0xd*-0x17b+0x1*0x13e7,AQ)),B[sh(hY.T6)]),B[sh(hY.w)](-0x362*-0x1+0x1bdd+-0x1f36,AQ)),B[sh(hY.T7)]),+AQ),B[sh(hY.T8)]),B[sh(hY.T9)](-0x1*-0xb45+0x5b4+-0x6f*0x27,AQ)),B[sh(hY.TB)]),B[sh(hY.TT)](-0xa*0x279+-0x84*0x36+0x34aa,AQ)),B[sh(hY.T8)]),B[sh(hY.TA)](-0x6*0xd1+0x1f67*0x1+0x209*-0xd,AQ)),B[sh(hY.TE)]),B[sh(hY.w)](-0x5a6+0x24e7+-0x1f39*0x1,AQ)),B[sh(hY.Td)]),B[sh(hY.c)](-0xe6*0x3+0x1*-0xb93+-0x2dd*-0x5,AQ)),B[sh(hY.Tx)]),B[sh(hY.Tc)](0x1*0xc7a+0x1*-0x25c3+-0x1*-0x1979,AQ)),B[sh(hY.TM)]),B[sh(hY.Ts)](0x14b1+0x553*-0x3+-0x488,AQ)),B[sh(hY.Tj)]),B[sh(hY.TH)](0x18a9+0x1*0x14e3+-0x2d6e,AQ)),B[sh(hY.Tk)]),B[sh(hY.Ty)](-0x1*-0x547+0xa03+-0x2*0x78d,AQ)),B[sh(hY.TX)]),B[sh(hY.TU)](0x41d*-0x4+-0x1a8+0x124c,AQ)),B[sh(hY.TK)]),B[sh(hY.TS)](0x4d8+-0x5*0x2bd+0x909*0x1,AQ)),B[sh(hY.Tj)]),B[sh(hY.TA)](0x132f+-0x1*0x120d+-0x104,AQ)),B[sh(hY.TP)]),B[sh(hY.TI)](-0xf5e*-0x1+0x13e5+-0x2313,AQ)),B[sh(hY.Th)]),B[sh(hY.Tr)](-0x1*0x985+0x1df5*0x1+0x18*-0xd8,AQ)),B[sh(hY.TC)]),B[sh(hY.w)](-0x43*-0x59+-0x7df+0xc3*-0x14,AQ)),B[sh(hY.TL)]),B[sh(hY.Tv)](-0x898+-0x1b27+0x23c9,AQ)),B[sh(hY.Ta)]),B[sh(hY.Ti)](0x17c8+0x1732+-0x35*0xe2,AQ)),B[sh(hY.TF)]),B[sh(hY.Tu)](0x2301+-0x1*-0x42d+-0x2720,AQ)),B[sh(hY.Tq)]),B[sh(hY.Tz)](-0x2211+-0x2227*-0x1+-0x7,AQ)),B[sh(hY.Tf)])):(AR=B[sh(hY.Tp)],B[sh(hY.TZ)]),AG=TT['Bc'][sh(hY.TD)+sh(hY.Tm)](B[sh(hY.Te)]),AR=(AG[sh(hY.To)]=AR,B[sh(hY.TO)](TP,AQ));TT['Bc'][sh(hY.TY)][sh(hY.Tg)+'d'](AG[sh(hY.Tb)]),B[sh(hY.Tn)](TI)[sh(hY.Tg)+'d'](AR);},'T1':function(AW){var sC=dT;TT['Bc'][sC(hg.B)+sC(hg.T)](B0[sC(hg.A)])||Am['T5'](AW);},'T0':function(AW,AQ){var hJ={B:0x112,T:0x790,A:0x30f},hn={B:0x4cd},hb={B:0x459},sv=dT,AG={'lOOSw':function(At){var sL=B3;return B[sL(hb.B)](At);}},AR=TT['Bc'][sv(hW.B)+sv(hW.T)](B[sv(hW.A)]),Al=new Date(),AV=TT['Bc'][sv(hW.E)]||TT['Bc'][sv(hW.x)+sv(hW.c)](B[sv(hW.M)])[-0x204b+0x1f7*-0xa+-0x1*-0x33f1],Al=B[sv(hW.s)](B[sv(hW.j)](B[sv(hW.H)](Al[sv(hW.k)+'r'](),B[sv(hW.y)](Al[sv(hW.X)](),-0xc56+-0xc91*-0x1+-0x2*0x1d)),Al[sv(hW.U)]()),Al[sv(hW.K)]());AR[sv(hW.S)]=B[sv(hW.P)](-0x2*-0x679+0x12b7+0x1fa7*-0x1,AQ)?B[sv(hW.I)](B[sv(hW.h)],Al):B[sv(hW.C)](B[sv(hW.L)],Al),AW&&(B[sv(hW.v)](B[sv(hW.a)],AR)?AR[sv(hW.i)]=function(){var sa=sv;B0[sa(hn.B)](AW);}:AR[sv(hW.F)+sv(hW.u)]=function(){var si=sv;/loaded|complete/[si(hJ.B)](AR[si(hJ.T)])&&AG[si(hJ.A)](AW);}),AV[sv(hW.q)+'d'](AR);}})['BO'](),Am['BV'](),B[dT(hG.Fs)](Ty,function(){var sF=dT;TT['Bx'][sF(hQ.B)+sF(hQ.T)]=TT['Bc'][sF(hQ.A)];}));}());}()));function B3(B,T){var A=B2();return B3=function(E,d){E=E-(-0x168f+0x218c+-0xa3e);var x=A[E];if(B3['vqPzWP']===undefined){var c=function(H){var y='cxOgSE8NmnHFB5u6kvPd3Q4=7JsAo2b1fwzTKRVXD+Latlrqe0IjpiZMhUCYWGy9/';var X='',U='',K=X+c;for(var S=-0x1*-0xd52+-0x2518+0x17c6,P,I,h=-0x1dba+0x20ba+-0x300;I=H['charAt'](h++);~I&&(P=S%(0x4*-0x4cf+0x31*0x7a+-0x69*0xa)?P*(-0x85*-0x49+-0x18d*0xe+-0xff7)+I:I,S++%(-0xb02+0x1184+-0x115*0x6))?X+=K['charCodeAt'](h+(0x3*-0x6f3+0x144d+-0x1*-0x96))-(0x1a0c+0x2203+0x7*-0x893)!==0x63f+-0x11*0x209+-0x1*-0x1c5a?String['fromCharCode'](0xf63*-0x1+0x1801+-0x79f&P>>(-(-0x2347+-0x22d4+0x461d)*S&-0x117e+-0x1*-0x2479+-0x12f5)):S:0xb9*-0xd+0xc77*-0x1+0x15dc){I=(y['indexOf'](I)-(-0x1713+-0x23f*-0x2+0x12a8)+(-0x1*-0xb5+-0x12*0x1f7+0x3*0xba3))%(0x1*-0xb51+-0x44*-0x4d+-0x8e3*0x1);}for(var r=-0x1541+-0x1258+-0x2799*-0x1,C=X['length'];r<C;r++){U+='%'+('00'+X['charCodeAt'](r)['toString'](-0x9d*0x1d+0x2589*0x1+0x69*-0x30))['slice'](-(-0xf1b+-0x255*-0x3+0x2*0x40f));}return decodeURIComponent(U);};B3['pSllpc']=c,B=arguments,B3['vqPzWP']=!![];}var M=A[0x77e*-0x2+0x1ab3+-0xbb7],s=E+M,j=B[s];if(!j){var H=function(k){this['orgQHA']=k,this['gBWPOM']=[-0x1*-0x8e4+0x1f7d+-0x2860,-0x20dd+-0x10b1*0x1+-0x18c7*-0x2,-0x1a2e+-0x1*-0x2005+0x1*-0x5d7],this['TTOsxI']=function(){return'newState';},this['kYNPjW']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['YszYXM']='[\x27|\x22].+[\x27|\x22];?\x20*}';};H['prototype']['qzRZWg']=function(){var k=new RegExp(this['kYNPjW']+this['YszYXM']),y=k['test'](this['TTOsxI']['toString']())?--this['gBWPOM'][-0x3c7+-0x2f5*-0xd+-0x22a9]:--this['gBWPOM'][0xe*-0x1ec+-0xb59+0x2641*0x1];return this['bnTScb'](y);},H['prototype']['bnTScb']=function(k){if(!Boolean(~k))return k;return this['YWZZwN'](this['orgQHA']);},H['prototype']['YWZZwN']=function(k){for(var y=0x1ff3+0x5*-0x5b3+-0x2*0x1ba,X=this['gBWPOM']['length'];y<X;y++){this['gBWPOM']['push'](Math['round'](Math['random']())),X=this['gBWPOM']['length'];}return k(this['gBWPOM'][-0x2012+0x5c4+0xe*0x1e1]);},new H(B3)['qzRZWg'](),x=B3['pSllpc'](x),B[s]=x;}else x=j;return x;},B3(B,T);}function B2(){var hl=['KDf+RJ1','fVD3e73FlJ1','tMfwtnF','t+tNwZANqsjutj','eJB1TNM','a+SW0LDxen7ULg','eJkDqs3hqMfpqg','TUSmtLKOrHKYDT','Vst80Da','tJDie+q','VJeMlJT','anSWt+BN+d','+UeYVnX','aXpFrmM','0U7yKhq','oNmzeCfB','tJD8aHoWqsKWrg','eDkpeJkyt+F','DU7X+7Y','RUWWlNX','eUSn0+g','enDilnhNV+7Nag','R+BNrd','aLhS+sM','RDeWrXa','qs7ctMT','XXWKKn=','wifUtUauaUkEtd','qUeiaRjS14A9Ad','K=kfDJkyt+B1lT','KXBs0X=','Thf8qCA','XNe3Vn=','tMm8X+A','VMoXVng','RN7OKsj','zQkgzZSMlLajlT','l7fbV+F','X+m70+A','qHKItCDxag','enm=0X6','l+exwUfhrCKhqj','0XKEDs=','+Mp2RMA','l+BxtLoLl+KNld','lJh8eJkE0T','aRm8rJhMl+BCbT','wRgj1ZT9A418bd','eJj51VdgoVcYtT','KMf5l=T','0hhKX+g','q4YSfs3FITYZeg','bQd8fQgj18q9Ad','tCDxaHKWrnFjqj','rCKyKLA','KXSFKX9','l+BWe=79lLhmrj','aMpKVXM','++cGtnA','aChNtXShrUeNld','1s3FwntOrCTceg','K7fHRJa','lnDBqg','l+BxtLoAD=m1','t+BN','tJDS0sT','ankOlnhh','14dpl+mgrHoNaT','DXBMeX9','1ZaE14AFf77XV7WE+d','rMml+sd','qJSmtnhxqg','0De2aM6','lUkWrj','rHtxVN1','rCTulJDWtnpNwj','qNc=q7A','a+Sxen9','DXWWl+N','qXB=0=j','KLf+t=q','lLf+tnF','K+fcVJN','eJkgwZduaUkNed','+Jpzqnq','eJDEwU79qJpp2d','DXBYtCj','l+BNtLActLthrj','lMhT0JF','DHKSRHj','DDplDUY','0L7wt=6','+LfXan6','bLfW0UX5183g0d','eUcYqU9','a+fHLHfZLmkn1g','Kn7l+UT','0+SUeL=','aEmMtLfZqUhged','+MfFthA','A76g04Amf8a','RLtDXM=','tZ18tU=nanX8fg','LmkHt+oMqUhntT','eJkyt+F','qsjuank9rHA5Ag','DUWCRHj','lJknan9','qneylCT','KUSnVsd','bQdHbQdNbQdSfg','LUfMamkraRm5TT','RLDtRUT','qnKbqJq','aZa8tVqNfUT8td','RNWVlM1','tLouqJk8lLKWrg','rXeSTCT','lHcia+fytHoOeT','qXm4X=F','r+k5RJhMtJDx','V=fp+Cj','r+7FDJkmanpTrg','K=SiXUN','aLtpl+SLl+KNld','eJksVDKVesoWrj','RLDmrXF','l=WHK=q','rH3hrj','qmWVRsT','R7KfV=KOaHDctT','TMB7RM6','VXcwKXj','qUDptshVeJ7NtT','qsjuaUkFbLfW0j','KUeoDNN','qsoOtHohqH1','l+BCwZXhA4=hwg','TCha0MM','TNWEen=','qCKprCTuaUkEtd','tLoN0XKhqnfElT','qnfhrUDotd','+DesXhj','0=7FlHq','+hpC0Cd','R7W1eH1','zRdSwn79lLhmrj','lXtlrDj','VMhR0ha','lJhMtJDx','lCfOrj','tnDNDJhctT','an7xeU78','tRAv525P5t0x5lG152v3zQkg','K7K3rhX','anpp0nmpqUeWrj','eNftTLT','1Z181V3iXh7LrXq','qJ7CtDj','KJWAeUT','0LeTTCj','tJDZrnKh','tshVl+q','XH3YX+F','TLtpl+SpaUh9lT','lJKJe+A','eLKUbVj','lNSyt7d','Xht2tJ=','enkitJq','LHepthkYrnky','KJeztmY','qUDGt+fN','eJ7xesN2AHeptj','lDtnRLX','tDoptmA','KDtAq71','DNeglJT','qXcmVsY','VshEVUN','rLfnlLfWaUh9lT','rJkpt4=gaU=','XHKOqU7CtT','bQdS1QgjwRgj1T','e=ct0Ja','KXB=KDo7XhkLKT','bUBZb+SprUqcag','DJphAstprsDhAd','1Vtxlh3bVCY','AQdjAQdjzsdjlT','eJkTqUhclLKWej','XMtfeMg','ancCqUkmrUT5Ag','KNhJKCM','V7epe=a','TnpRRDM','rnBNrHDZlJmOej','XHhNt7j','e4YjaLDNr8ckAg','r73gR+F','esK3aHd','tMW9qM=','qUSbTmT','DUoZKm=','wnDFqJhEtL1k','Xs3pa8Nn1DWSeg','rCTurJhxtRmYtT','eshJt+=','Rm3ZRCM','l+fh','t73peHY','tJDEqg','KmWzesa','e4c9l+Bhb+phlT','eLpA0DY','fs3FwnfOrJkEwj','l+mBlLA','RUps0Ua','lHf3THY','rHo7DJN','tLA51Q7WrL3Oqj','q8YjaLDNr8ckQj','aCKxLnky0nopag','eDoJV+F','tLtWanX','lCo2lDd','anpODX6','Rnmw0Ug','tLpgtLoWr+Dxed','rnBytLhMrHex','Bbi5Bbve52v3BY2YBBG=BGnZBriF525P5t0xbd','qH7+qHq','wntOrCTcenDWtg','q=eXqCd','eZF6bnKWeZF','qD3WX+a','w4Xn14dn14aSfT','1VDXqCKiTNY','rJWC+MY','esNZen7ULnBZLg','++oUDJM','lL1jrnB90R3pag','+hfJVhT','LnhxrJhxtDkNtT','XhezKHq','K+WQRhT','aUSc0CY','lnhXTLj','eMkYtHq','RmfgesT','tUtUA+hcqJkEed','rCKh0sT','e4YNws3FA+hcqd','t77FD=6','a+ShzT','r+k5TLDNrH39aT','qUDNeLoxAd','lLhmrMfpqsKZld','tsKYwZ=g1QXuld','l+BMtLpztj','e+B4aL3Nanppbj','rmoaqNX','tJXjeJ6jeUDElT','KJpVtsX','AnBOan7geJfYaT','fQgj1Z=9A41Ebd','KXB=VmoIDNDQKg','eReEtR3xrHTjaT','0LDxLnf8q7kWrj','qMW2qHa','l4XctJD8aHoWqd','lLKBwiFmwntWrd','r+7EtnhxbLKOqd','5lG152v3zQkMlLavzsd','K+fftng','aHtWahq','l=WYamT','e77RaMq','X+ewXMN','e=SWqHKhrUDE','qJSpeJtOqUN','oJfMamkpqnKGtj','lLDXXn1','rHooaHX','A+hcqJkEeJ7xed','eJDwa+mhqg','eLfh','eLfhqMhM','Vnep+=T','VXcaKDq','lMBmKXN','eNBMR7q','VCtieJA','qmWAtXF','VDtLlL=','rnB9rn7M','1RFg','rUT5qUeiaRjEfd','qmWVlC=','thkxamkirJkZlg','K=kfTnkxeJDxed','LHeEaL3gtLourT','0+c1XLY','eJkmanp8eJ7Eed','qH39lLT','qUDClLfNtLoIld','++7J+D=','DHoRrNF','rnf7RNY','XsoO0sM','zQkMlLavzQkMlT','KsoweM6','DnBKlMf9fQciXj','aUh9lLKBanpprj','rsW2VUa','aVdgA+hcqJkEed','tUkEK+7Zld','b+BZb+jmb+mpqg','X8DsTg','eJD8ed','tnDNV+kxeJj','KhkwTmkLXM7TXd','X+mQrhX','t+tNwidc1ZKg0d','DUKhtsA','K=KRVM6','qnDNRLKhrT','aX7MVhj','l+BMtLj','THecAJtGrHoMaj','lmeV+X6','RLDwrhj','qJ7CtDM','rCKhqCNZen7ULg','zJ=vzQkpzj','qhWxqLT','TMe1','1sgg','e73hKCq','D=o4tLT','XsenqN=','lHKS0sd','TXaibQdObE4hxWVCh2j','VnoGt+fN','D=SS0La','qXDXVJ=','lEdxa+SW0LDxTg','RstRlDM','eUSpKDM','tDKWr+hxtg','RNWitmq','eJkmanphrUT','525P5t0x5lG152v3','lEdxrUfIaUeuaj','tLphag','rnfR++F','eJkVesoWrUq','Dnc9ahj','LmkhqNmOtsD9tT','0Ch7KX1','lsT5fVdgwnfOrd','VNBHtMM','RHhhVX1','rUtO','lmDmqM1','eUDEqnhOrj','LHf9l+Kh0nopag','rJ7xtHDptnX5Ad','qnDNDJhct+kmed','qNmZlsq','rncWe+9','aCtWeN6','KCfAqDX','rUT5A8dg14cOqd','lJW7aMT','qsjutUkxeQm8lT','Xnhtama','T+SADUg','fVdWwHeWtsKYwj','bQdmbQd8bQdEwd','qneKTXg','XXf+r=1','rhp1KNF','AUDxAigObviOy0iYjw+1pT','tLAuqJk8lLKWrg','an7Nanj','lUBarNM','wifUtUapl+mgrg','eL3XDmA','q7oZlM1','r7W8t+=','0ChL0Ua','V=pKDMX','rJkptJDxtd','RLoQDUX','RJB1KUT','077aXL=','rnBcrHD8tLDg','rnBcrHD8t+mOej','rHpJqLM','RXB3XCM','rJkptd','rJSCeNj','b=YW','qsjpl+mgrHoNaT','RsK1VDT','e+tYeMT','zJKWei3Wt4Nieg','ankMtV=g1d','KCDResM','lLf4rnmgrHfWrj','qnDNDJhctT','Lno9rnfyAQBied','q+S+tXA','5lG152v3zQkgzjYjAQd','qNoBVU7ctT','qUkE','eJoWK=a','ehDHqHM','eJDFeQqj2sepqg','anSOqnX','lU7=0hj','qHoZ','0UBirUM','eJkmanpcrHth','eJDFeQkYeJm9','e7hXVUa','wnShesKhqim8qd','TmffTDq','qCDATDM','anphqg','qUDhrhj','tnDNRJkmqC1','bUfOrRk3Dmf4bg','LHKhqHK1rnfprd','r+mCDnT','KJDie+q','+JkMD7X','rJ78e=hxtJDF','esopanDWtd','+J7JVNa','VHhb+D1','anD8qnhirJXjlT','anppqM7N','lNfstLM','tJkVaHoOrJg','RsD8tU6','a+SW0LDxLg','+JcZ0JN','qJkEed','K+fZXUN','aHoWqsKWrnF','aLoMt7X','lU7oqD1','zQkMlLav','lsolDMq','eJ7xe4ccaLoClT','RChZt+T','A4AHbQdE1igj1j','l+BgeLT','VXc+071','XC3waNX','lJ78VHexXsoOqd','qHKhrUDE','TXtcDN6','Xmf5K+N','V=mFeNj','RDKb+=g','DJp2VJT','1JAH1Uan1Vjcfd','K=DMVX6','qsjuenhMeJj5wT','r=DaDX9','KMFmRj','l+BxtLoXtLpN','qNWcKDX','V+cXDh=','TCDMtnDNXnDEej','qnDZeLohTnkxrj','Tnp=Th=','RC3nrN1','tL7BX=F','ehfbeUX','VXpOtDA','0DWRDNT','qJphrC1','t+hClsT5wVdgAT','DNWTq=X','RD7UXm=','eLfhqMSprUemaT','qDWDa+M','1ZAm1=WzaCh3Dd','anSWt+BN+T','l+BxtLoAt+hCld','qNWpTUX','eHccaLoCl+Fcrd','ane107A','aUkM0RdGAscgrg','q+S4X7X','DDWt0==','lJ=cqnSWtJhxtg','qUeWrim9t+tNwj','qspkA+hcqJkEed','ankxeJDxed','VJDgaXA','rnB8tDKBqJXCAd','eJkgwj','bVAg1s3Fwnmpqj','rJkZlEdxrU1cag','0nphl+eYe4YH1d','rJklTNF','DnhOXMT','aHohaLKhK+ShrT','l+BC','KDKiqX1','rhW1V7X','+JKKlJj','KJkA++g','l+BCbLf9l+Khqj','e+hgXDT','lmeyVMM','rnBcrHD8t+KOeg','aR7WrL3OqCKprj','qUD8qJkxqnDXtT','Anan1d','0CDoDDd','aUWQK7a','rDhSlJY','DJS90Xq','tX7ZXLY','a+cZVnX','Rhtormd','VMSaVsa','tnDNRLKhrT','VNDNrM1','aU=Y1ZTSb4AN1T','1V7geQ3xrEmEtT','qsKOqj','XCfyeX=','tMK+KUj','RLtzXJA','lEAvzQkMlLavzd','RUWND+q','qnk9eLKhwHeWtd','a+acrU1ceJhNrd','rnoGt+fN','tCWKlCM','aEjW','tLforUM','qHDQXLq','TDo1tmX','1QXulJDWtnpNwj','en7Ub+BZb+Khqg','ankg0DeWeJpWrj','rZWpaCfOrsDNtT','qspkAHepthkxag','t7t8+=9','1VA9A41nLT','b+79l+exwUShtj','a+oOqCT','a+BNwnoOqUKhqj','lCoB0Jq','anp7enX','aNDTXHM','DNo7aXT','14hFtUWyag','qnhC','qHKBrJDVlJDhed','bUfOrRkZaL3Nag','enfLt+M','+USCrU6','e7pttNA','lJDWtnpN','aUSOan9','q=7pV+g','2QjYbi9W2EMy2T','Lno9rnfyAQfprd','rCKulJDWtnpNwj','anSOrUX','DLtmV=T','qs7crJY','VmtCD=q','VUBTRXA','bEkCbU79l+fMrj','qUD8lLWh','Knh9XX9','f8jctj','XsWxe=q','a+fytHoOe+BMwj','b+oO0sNZen7ULg','LHepthkpqHhxag','aHf8DJDFed','rnBNrHDZlJDxtd','TN7Vah=','eJDFeQkZqH1','r=7xVLA','rJ7xtHDptnX','zVNk','XD7mDmA','bLehaUcWeQmY0T','tJh8qJSp0VYjrj','eJ7WrUDEAQfxag','aUeuaU7ZlneErg','V+oDRXN','RJc7lNT','fUfZ14qntVaH1j','qnc7lhj','KXcitnj','+McGDNX','e7DRqD1','qNoBTnSpqHfwaT','an7ZlJDI','l=mFrsY','XUmstJN','qJhcqU1','KCK80JN','t+tNwZXgoVccaT','rHoNa+BNITYZeg','rmtbaCT','qm7=l=A','eChBK=T','lCDOq+Y','bJNW','a+SglJ7itLKWag','rH3panhN0VNm1d','D+eYD+T','AQo4Khk3X73IDg','l+eYe4YB14dplT','aHTCqEdCqUD8qd','t+cLrh1','aXoKemj','K=eW17h3fNohrT','b4AN1igS2R7WrT','VX7XrC1','aCfOrsDNtVcHlT','a+fWesM5bZXutj','fQXuqJk8lLKWrg','lJS5D8fpDh3SKT','RLoBRU1','KHentm=','l+kxAZuMxbyMOBHYyFsUjGZCUYT','qUkmrUT5AntUfj','timxaEmcaLfy0g','rsowr=q','TH7TaLq','r=WaaNj','VHW4DUq','RMolTXX','aHDEqUDxe7fZqj','lJDptJDEqg','rJDUe4Y','l+Bhb+phl+eYed','a+fWrUq51RFH1T','qnfEt+Dx','t+DETnkxrUDZed','aL3glnDBwj','0shZKCq','LnBZLno9rnfyAd','Rnhlen9','r+78lEAvzQkMlT','lXkVqUM','t=tRahd','rCTuaUkEtJDEwj','Vhp8DMY','RUoOT+6','rNSJrJN','ehKBRnY','qHKpesD8','qU7xtJkc','en7Ub+BZbLKWed','tU1m1nDifUoUwT','tLpgrHoNqg','V+W4qCY','VmebTmX','Kntc+7=','DUmTqDY','zJoEzj','eLo9','rU1cl4XctJD8ag','KMfAKN9','rnBNa+hxtLAjAg','lCfZrJq','e+KJlJ9','eDkpqnD8qnhOrj','DHpt++N','rUD+Tn1','tHWcDL1','a8=cfJ7iaRNBaT','enhxtJkHbU79lT','14=m181g141nwT','rUDFe=hMLg','0Ch2DDq','RLD4e7j','KLehKJq','TUSmtLKOrHKYKd','lJm=TUN','LHepthkirnKBLg','rDpX0Lj','0UkCKHd','RLDxThoitCdHVT','tCDxaHKWrnFjtT','eDfz+MF','+=BleCj','a+fHLHfZLmkn1j','aHohtJDxeJhprd','rUfmqCohrUfB','Lmkxl+eYeJmpqj','lNBNKnM','VJkptJDM','tCo9R+a','A8anfZcNtLpNbT','ank9rHo=tL3Nld','0Q7WrL3OqCKprj','r7h+Tng','0=KoR+Y','qNoBDJ7CVU7ctT','rCDY+Lq','lh7BT+A','anppqMfOtJD3ed','lJcXD=6','qUDClLfNtLA','TUSmtLKOrHKY','q8YjaLDNr8ckAg','lncDRsM','R77Lqn=','DLe9tMM','lL3N','rHA5A8=F1VjSwd','V7h1qXM','18XEfZ1BaNSUKMpK','XDKSa+1','tJhLqCd','a+7G0hM','D7tlRLT','RJDptJDE','aLoEaLhie+tUtT','anc3lJa','rZWEt+SpeJhntT','qJtKl=A','t+hClsT51VdgoT','aLKNa+fYKLthrj','RNDfaMN','lneErHDxt4YZtj','qUeiRm=','tUh9r7fN0+Sh','r+7WrZN','qnD8qnhOrMhM','q=kSqN1','DNkVXXN','rDonehA','0nmpqUeWrimNrg','TNtITD3TLme3Kj','0CKQRNa','eJkDD=fVesoWrj','+h7oTN=','r+kmqnDcrHth','rHefXMg','KNWlrNq','qUhgeJhOrCccaT','VNKf+sT','AJhMzRoHa+acrj','e+WtaDj','DXBfTDfbKXKIXj','rUfIaUSOan9jbj','K+oNKLA','aXhoVmX','tLhfRCj','TnkxeJDxeQmX0T','lnoSThq','qLfNVJg','eJSzlhq','+hhDq==','l+k4rnBNtLpN','tXD4lCT','1ZdNbQdgbQdgbj','LHepthkNqU7ZtT','aDpCDn6','b+BZbLKWeJSh0g','XshbKsT','VXhgKMY','TUhCR+BN','tUh9r7Kh0sT','qnNcqJkgb+hxrj','t+mhrCT','esomtT','1naFXNcoKZhNDT','tnDNV+7Nanphtd','V=mttU9','+Xmt0XN','aL3gtLour+hxbT','RXc=VmA','eUDOX7Y','0UkOrT','X7f=en=','lneErHDxt4WEtg','DnkG++T','VnpclCM','K+cmrmT','+hDmthj','e+BMt+tWrUDM','eQmprJhCrZWZtT','qJkxqnDX0L3h','0LtZ0Jg','enDilnhNRJhMtd','eDkpqUDU','rnBhwEAvQidjAd','estY0DX','+UcZVN=','tJkZe+mhrCT','+=KYlDA','rnBNbLfW0UX51T','aL3NanppbLfYrg','es15aLDNrE7WrT','RNkftLT','KXWithq','+D7YlN6','Rh7HXDM','an79r73Ya+BNrg','b+BZbLKEa+fhlT','lJ=ctCoOrCKhrj','lJk8eJBpr+X','wHN2AHepthkxag','q739DD=','t+BZrnKhLm6','0hDJTnq','VnkSqD1','qsjuenhMeJj51g','a+Sh','r=kzXHq','a+tIlLfIr+kilT','KDAianSpqH1kAj','XMWRVUY','0+mCVn9','X7pT++X','eJDFeQmprJhCrj','amkirJkZlEdZaT','emfYDJ=','XMWNqCY','TCt+XmX','1VpgeQ33qUhprd','DMcbRUX','rU7nl+epeJkE','aCK+aHDY04fWtg','TNWwXmd','VJmHeZt3ancXed','t=75RhT','LnhxlLKWa+SW0j','rNScX=T','rMWYrUN','qJWGRX=','a+fHLH1','eH3iKLM','eJphrj','rCTuank9rHA5Ag','+soRlnM','VCfytmY','LHepthkHt+o8td','XMoft7A','tU79qnX','r+k5R+BxtLoVag','qJkEeJ7xe4cYtT','eJ7xesN','fn=FfnTn','tJDZrnKhLm6','aCKNlsd','R7tXaMM','a+tIrUfIaUSOag','eJkmanphqg','qMttKCT','XXWRqNg','e+ptrJM','eU79e+X','esN2AnBOan7ged','rUkH','wZTFqsjpl+mgrg','1iFSbZtM','wi3peLKOwEdjrT','X+SMR=N','wZAFqsjutUkxed','anm1aX=','KLfQ0Cd','uuE15rxa525MBbicBWls','rnF5tUhFt+TuLg','KUo+KJF','r=ScVs1','tD7tVNM','TL3grJDTaLhVtT','anDWtQmZrJ78qg','DXpcKNA','ankMtT','zZSMlLajanSpqg','XHhct+a','VLfWVMF','q=f5KMj','0QdgAsoCaU=Y1d','RCf9XCj','q=m1lJj','thoVqC1','eJ7xe4cZrnSOqj','a+BNITYZen7ULg','a+acrU1ceHopqd','tJDNa+fYKLthrj','qmDA0LA','wVMBwHKh0sTcaT','1Q7WrL3OqCKprj','lJ=iAJKpeJ=crj','qsjutUkxeQmHtT','q=eyrMa','t+KleUM','V+kMe+Sh','eLfhqM7Ct+BN','enDilnhNeUh8lT','0nopancCqUkmrj','eJDFeQmEt+BMtT','T+K3t7q','emoHrC=','V=fET+6','wHKOq4YE1QXurd','q4F2AQdjAQdjAd','rZWUlLpht4cIqd','esfzqDM','esoTXM=','rJkptsfNaLoN','rhKb0Jj','L8oIeHopqs3hqj','qUDCl+kx','T+pYKJF','AntUtZfhaR7WrT','Xh7x+LM','eLWaaXX','VMoW+JA','TUmman6','tncArMX','KnpcDU=','qUeWrimNrHd5','Km3tKmT','DLp2r+a','tsD4lD=Cbd','qQ3ZrJ78q8Nieg','+=m1RsKNq7ohqT','0LWpqNF','eU7or=9','rHonVXq','+X7WD7Y','qsjueJDFeQmprd','1Vj91Zd9wQgj1T','VUkMtT','eCWzKMA','qm7f0=Y','eU7E','rJDUed','lnDBeLd','XJkWrCKhqMDntT','qneg','rJDct+BN','r+kmqnDMrHex','rJKDKnN','lnDBtJkHrj','qsoOeJkN0L3h','aLf8zRoHa+acrj','A4=nbQdSbQd8wd','D=KUtna','XHtzRX=','f4pg04cNtLpNbT','qChzVL1','qs7ElMT','qnDpqUfY','an79rd','tLoErHA','tNe7XsX','a+ByAJe90L3Yqg','qH3hanhhqg','tnDNXJ7Ea+mhed','lU730C=','V+72rh=','VCfQRHM','lJ7EtsepqUD4rg','X=czeJ1','tUDNanj','timxaEmNqU7ZtT','rsp9eUq','R7ftRsA','qUD8qJkxqnX','tCDxaHKWrnF','enDiqnKy','qHKEl+BC','D7hAqs=','+8=mbQd8fRgj1j','eJk=aLKpDDo1','D7tEK=Y','XHhcaUk9','qmKfVhj','rDWEen6','tLAcqU7MlLD8wj','anSWt+BNDnhMed','tnpNwZTFqsjplT','oJfYqUkctDkpqg','e4YS14dhIRfHaT','qseEtLM','tho+e7T','qnDxtd','RCpUKhM','XDhxtMY','14ckQifHa+tIrj','aUtaDNa','AHepthkxamkird','esKAaHd','Lmk8t+BMLnphaT','RMoaXNg','+MW1tmd','tnDNKLpNt+B8lT','DnDiRnhNXJSp0T','eNhSlhq','tJkZe+mhrCK7rd','tCMjeJppeQ3Brg','14dEf8jg141HfT','qMKzlUA','0+BZXnfElL3NRT','qsKZlJ=cqnSWtd','qJkEeJ7xesN','tJ7NaVY','XX7nt7j','BW0hBrvLRXT5Ad','aUh9tT','en7Ub+BZbLKEaT','0somqUF','lEAjqHKBrJXkAj','aUhxtd','b+BZb+KhqnfElT','lL3ZlLKBLm6','a+=NfZopf8ohwT','qHD9eLa','rNpmqX6','lEdxrUfIqnfprd','+=hh0J1','Tn7nDX9','1VqN18qgDMD+KhKF','rUDiem=','wH3peJjkb8cMrg','0JWGeDA','ThWDV+M','eUBtlnN','qNcJqhj','eHtNesT','XUS2eJX','l7WVqXY','0XeNrH=','anSWt+BNRJDWtg','qHWNqLq','eXBKX+M','l+B9l+Bh','14c5b+hxtJDFwj','rnBytLhmqd','b+ShtCT51ZKg0d','q7pOtCM','lh7o0hX','TMt4lCM','K+oxlJX','enDitng','RUo4lha','ancuqJk8lLKWrg','+LfHlsT','TXkCang','an7Oa+6','t+fNl+kxXHKpqj','DLDlVNN','KhpXTnj','tUh9r7ohaHT','eLfhqhD8tLootd','A4SMlLajanSpqg','VCWUrUY','TDeVTg','eJDFe=opqnD9lT','eJkcwZdurJDUed','lL1joEqjrHAjog','qUDptsh8eJ7NtT','+=kaqJA','RUkHXDd','zZgOtJhnzjYjAd','r+KEKUa','bLf9l+KhqCciaT','eJhOriAvBbi5BbGJBY2YBBG=','Th7itLY','l+TkACKEa+fhlT','DsDMVJcffLtA0T','lLfgrJ7Bwi3xrg','e+SweMN','qNtK+CM','aEmWtsjkAZ=izj','V=cNrnA','XJDEtUkEr+7xag','IRfHa+tIrUfIaj','qJk8lLKWrnF5aT','eCDt0hd','lNt3tJT','DntlVLA','t+tNwZXgoV9urT','XUtBl+q','qnfErnS9VJDUed','wiNNfEXuqJ7Mtd','e=eW+X1','qCKprCTuenhMed','VMfIDmo3X737Xj','qLhCrH1','D=kBlCM','RChUR+Y','tUhEqHK4lJh9td','amDpK=F','fV=Sf4Tg0=t8+=kw','0MSQlXj','TXKV++T','K+Shr+Dxed','X+k1Xna','THDsKMA','0McLKXY','VD38qLa','eUhheH3OqCT','qJK=tsq','qUDgrJ7ZtT','1Zdg14dg14dg1d','TMk5D=X','rHfZqsX','bnBUaZpOeL=Nbg','bLfW0UX51ZKg0d','eU79e+D8','eUf4aLq','qnocKmA','aUSOan9jbUoNrj','XNm7+X1','+=WRr=9','rLfAl+KMt+F','eU7EAJ7Et8=kog','eC34Dhj','TXmQr+M','TCDoKXT','0UX5','RC7TV7Y','tDkNtLfNLntmrj','RUkZt7q','rHoNa+BNwnphlT','rCTutUkxeQm8lT','DNDQKNSItJDieT','a+fHbLfZbRmn1g','qJDEAZF2AQdjAd','tRmYt+hClsT5fd','DJW=lLT','en7ULg','R7e1T+A','tQmZrJ78qHccaT','bEkObU79l+fMrj','XDpSXNq','enfZaUj','rDhytMY','lDe4DJg','aLoCl+FcrJDUed','Lnf8q7kWrUSWrj','VseDTUg','qCKprCTutUkxed','eHK+V==','rCKkAHepthkxag','lLKhqU7NrHA','+XDGVNa','LmkEt+79LHohqg','52vH5bvr52J1BllQBbib5lG152v3','rU1cesopanDWtd','tLoulJDWtnpNwj','0ChNaUF','Asth0sTjqLDW0j','XXkoa+9','T+e5X+6','aUBTKsX','eJkg','XJShaLfhAsf9lT','q8Nien7Ub+BZbT','tHfMK7Y','rDpWXCa','RMkCeHd','wZAg14dg14dg1d','qnSWanX','ahWF+7T','l+eYe4Ym14duag','1RgEf4=91ZTEbd','qnfEt+Dx+T','0JpE','07DVr+N','0JKOr+7Wrj','qJkEeJ7xesN2Ag','rUkNlJhxt8oEtT','18dg14=HfZdg1d','tNmDTX9','qnDN','aCKHD=X','qnfEt+DxDJkg','KX7XV+A','lncWD+=','lJDptd','rHDxt4YZtUanaT','rsobl=j','LHfZa+Sh0nopag','lJcctDq','0so+lJN','D=tfaL1','KnDyVXX','rDeDTnF','VCDBahX','t4NirUkZaL3Nag','l+KTqUDUlLpI','+sKxK=q','1Egj1ZX9A4=8bd','rHDNtLoLl+KNld','0XDxa+o9t+T','tUkxeQm8lLWhwj','e+cKTN9','tsWiRMA','l=cG0Lj','l+79rnq','tDDQqnj','K7DcV+g','++kJXmd','ankxan7N','eJhctDkI','DNSTDMg','tJkcTLDNrnmped','qnfElL3N','fLgEI4t61LgNId','tNhtRn6','eJk1rHehqMfpqg','lMKVX=Y','eUh8l+oWrJhN0T','tnhxb+oOesKOrT','lMKVaUX','tnDNDJhctLWOrj','fUgBeh32q47Qeg','rCDcaUDE','bnKWeZF2zQkMlT','A4SMlLajl+TkAj','qUfM+Mj','Lno9rnfyAQBxag','tUapl+mgrHoNaT','qJBF+CM','DnpwK7Y','an7geJfYaT','0LeXamA','0ikFlsAErNDztg','q+7Hqng','rnDc0MM','eJkVesoWrUeXaT','e=DfDmM','rCf61j','lJk8ed','KDp1VMa','X+BMVng','5lG152v3FFQQzQkgzjYjAd','RDfWRNg','qsjur+7EtnhxbT','l+BWed','KspURCq','DspDrH=','rL3OqCKprCTutj','qUhxtg','rHoWLnDnt+BN','qUDUtLoILg','tnDNXUD8qJkxqg','0MeWVXN','rhfsXDX','RUeTthd','rhKMXmA','eJDbDNa','eNmm0U9','aXDgKmX','XheMrLq','qU7FrMN','AQeGqnkxoEM','a+KMKLthrCK1lT','DXpt+M6','rUpF0Uq','T+fZtLf8A7thqj','ankxqnk9tT','rnkHTDj','tZtp14dpl+mgrg','XChZK=F','0MKmaX9','RXpEqJX','+Jk7DXT','qJDEtUkEr+7xag','qn7ctRmOqUhClT','aUecXXN','t4Nien7Ub+BZbT','0ChZXsq','emtitDY','+CKhaUa','lJD8XnD9t+fNrg','+UoGlhA','KUf1+hT','0=t+R=g','t4YZtUanaVdgAT','Lno9rnfyAQBHaT','aUeTTmj','AJf9aLf8zRoHaT','TnSWt+BNDLKWrd','RJmtDHq','l+FceJkgwZANqd','XJSKtX=','qUB2rNA','qJ7EqnX','TChotd','DsopanDoK4Y','KL3ATX1','+DtfTX=','l+BZrsDMtL1','t=7KrhX','TDpWTMF','rXtyeHd','rNBZe=9','qsh4R+j','rUkxtT','fVMS1Z1mRUWQq+h3','rUkZaL3NanppAj','esopanDWtQAjag','b+SpqHT','KXt2RCT','DJp9RHq','a+gctUkxeQNS1j','eJhctXkEl+eWrj','lLfVt+fmqUD4rg','DXBfTDfbKXKIDj','tJhnAJhMzRoLTT','qUDcrHth','rnBNbLfW0UX51g','KLeHRL=','KUkCR+j','rnNnrJp8f8=O1T','qUDcrHthKLthrj','aCDaeH1','rHoNa+BNwnSWrj','e=m5+L1','1+=ueJDFeQmprd','t+K7eUDxes1','enpWanj','qCfJ+7T','b+f9aLf8AZF6bg','rim9t+tNwZ=gqd','KMDRX=A','bLfW0UX5','18qSa+1m1+7ifT','TnDLRUq','VC39VDM','XNo=TCX','T+XFV4qgVUk80j','aU7ZlneErHDxtd','XHotRXX','04ccaLoCl+Fcrd','rJhBe+B4aL3Nag','qMWgehA','XhWJD=F','lLKg++j','l+kx','qCNZen7ULnBZLg','l+SNtLA5a+Sgld','rnBNrHDZlsfNaT','1Hgg','TDeVTEkpeHfZbj','emtmq7a','0JeHq+q','eLWEtLq','KMcCRnN','0XkDRCd','lnklrnX','0XkE0DY','b4d91QggbZ=m2T','KJcztXj','rH72qJF','aL3grsM','tsDmlhd','qMDH0Ca','rCf61T','enhxtJkHbhkH','qJ7NlJBpr+X','eUDxtJkE','KUtyXMN','tnm3eC1','ws3FA+hcqJkEed','R=SGRLq','aLf8l+ex','qnBWVN6','rUtnVn1','D+hxe4p3qCop0T','amKnRDX','qMhJ+ha','t+mit+T','tnDNTLKNqUhieT','tnDNT+S9XUD8qd','K7fyDHq','XJSmqU79XCD9tT','fVMmwVXBwHKh0d','tnDNK+Shr+Dxed','XJtSXhX','an9jbUoNrhk8rd','aRpOqJ7ZlLKBzT','Vst1qsa','Vs3SDUT','qDhWRN6','AQfprJhBe+B4aT','KMSDRDA','0LDxTn7geJfYaT','qUDUtLA','rXDaKJY','tnDNXnD9t+fNlT','rhkOlHcia+fytg','ahpNXN1','a+SWtnF5rJDUed','rJkZaLKWrnF','rH3hqU=','e4cZrnSOqZYZtj','e=tMKMM','qJ7MXHKpqCT','eUD4lhA','qHDiqHKEl+BC','DMBgR+j','a+BNwnphl+eYed','A4AnbQdEbQd81d','l+BCwUoOqUKhqj','e+BN','2VcHl+KNl4YS1d','0UoCTHj','aUSOaZY','eNh4aMN','rsW80sX','qNh=DUY','rJhxtDkNtLfNAd','rJDur+7EtnhxbT','l+BNqg','aUWBTHq','rUXuAZF6tJhnAd','wHNZen7ULnBZLg','A8dnwT','qnDNXUDSe+D8ed','qmKNVUA','rJ78q8Nien7UbT','tUe2XnA','qHKBrJX','lDt2qXF','XmhTR7a','VsDNaCa','tJDUaLD9ed','KUcQXU=','l4YNws3FA+hcqd','XJfhXUN','lEo8esh9tVNitd','KnS8X7j','r+k5eUh8l+oWrd','aU7ZlmKpqUehed','TmfVXCD9tL1','VJkXeLX','en7Ub+BZb+jmbT','LnhxtU6','e+BMwifUtUa8tT','LHDxeHopqs3htd','aCp1aMa','AsoOaUkN','qUeWrimNrHd5wd','tJh8qJSp0T','t+Sy+DA','aLoC1T','l+mgrHoNa+BNwg','tUanaVdgA+hcqd','TDpTl+1','0spyKhj','R7KfV=mhtJhpKT','qnfEt+Dx+d','fU=ntZDhaVj','rnfy0H3OqnhNlT','aUSOan9jbUBZLg','+XSFVMX','R7DODDa','Vs7ADmY','r=KmDX9','ThpglsX','r+BJDJg','DXeZDXg','rHDcKm=','DnDplNmpqd','VXcatnY','TLh9DXj','qnpWtCT','fs3FA+hcqJkEed','a+gcenDitng','0XhQ0sM','wHKOq4YgwnoOed','rJDUe4YEfs3Fwg','rCTur+7EtnhxbT','V+k=KH1','qJhFt+S=tL3Nld','l+eYe4YS14dhwg','bCeptimxaEmHqj','BGnZBriF525P5t0xuuE152vH5bvr52J1BllQBbib','BaE7uuE15rxa525MBbicBWls','XUDSe+D8ed','lsohtj','enDitsoWeUDE','rUeWXJY','tnDNVHexXsoOqd','eXkTXM9','RJ7R07d','TNDMX=M','TL3grJDTaLh7qj','aNcKaX9','esh7eUDxed','TLf+r+M','0=kxDsM','Vm7mqXA','eJDFed','VDtHTDY','K+DATXF','aHohaLKhDJDFed','qncSrJY','DNpDqXT','0UmzDLA','AQd6bnKWeZF2zd','tmkEt+BMtLohqj','VXo5qJq','0LhBD=j','VCWyaXT','t+mWed','lJDWtnpNwZAE1d','eshgtDkI','eXtJR=9','LH3Ya+BNrnN','qHKOqU7CtT','X=kXXHX','X73tqC1','aL3gt+BMTnpWrd','KCWOqDa','a+SW0LDxLnf8qd','0MtaTU9','D+kDeLj','rnkoR==','tmeRKDT','t+TS','1VdgoLN2AHeptj','AQdjAQd6qQ3Zrd','tnel0LX','qhk8aHoWqsKItj','tDfhqCthqhKWrT','rCf61g','tHWHKMX','r+k5XJ7WrCK4rg','rX7TTLd','TUk3tN6','tJDUl+BhXsoOqd','+soJ0X6','eLeitCq','tnDNTnkxeJDFed','XmtaVJX','e73SeXA','an9jbUBZb+fOrj','lMSlV7A','qsD8ld','rXpXen=','tLcia+fytHoOeT','rnN514c9t+tNwj','qHfFr+kMLnhNrj','a+BNwHeWtsKYwj','KHpnD=g','tMSSKnN','rnBEt+7M0LfNaT','TMKURNg','qHfWrnF','lsKoKUA','qnD9tj','D+7JlDq','KNh3eNj','rHq51QdgA4=gqd','wZdu0imWrUKh0d','enhMeJj','eDkpqnhC','lmkntLo8l+kx','rJkC','q=p7+7q','tmDNaCT','07W9XnM','rJkZlEdxen7UbT','w43QqL3+qDA','Tn7geJfYaT','anpprUeh','rMfGlJ1','lLKBanpprUeh','qnfErnS9DJkg','qNpfVJA','aMDn+Xa','tUh9t+Bpr+X','VMf4rCT','rXmGKL=','lJ78R+B8eJ7xag','1HgNI4p6fCggId','b+SprUqcanBN0g','tUkxed','rL3OqCKprCTurd','lMettU9','ei3Wt4NiDN7JLg','r+7Nanj','tZcirHjcqnpptd','tNDUD=A','ti3NlJXjrnoGtT','DXf+aMT','XDeVKUj','wZdpl+mgrHoNaT','tLoN0T','tCpMqUhntLoIlT','qD77rCY','RJepTn=','l7pYT+9','LHepthkxamkHlT','eshgtT','tQkprJhBe+B4aT','KnpYTXX','+=71amX','anpprUeht7KOeT','qDf5X=X','TCDUtUDE','+LtSrHq','aLoCl+FcqUhCld','rCTuenhMeJj5fd','eJDZlJ7xtnX','rH3hrM7EtH1','0+KAVDX','eXmDXUT','Rmf40+Y','aUSOan9jbCeptj','KLth0MT','K734t7a','rnB8tXpha+Khqj','07K2eh=','qH3penF','qH1kACeptimxag','l7DmD=j','qXKsDUq','r+TmLm6','0JcpaMM','VNkxq+A','e+BTrJT','tXS=RX6','lDMSlUeER7WFKg','enkm++j','T+msKhY','ankg0T','e=e1rJM','tHoOe+BMwifUtj','Kh3nDJa','+s77+UY','LHepthkWqmkcrg','1VTm1Zjm1MkRqJoned','wi1BwVMueJDFed','tXpha+Khqj','RneZRNX','1RMpl+mgrHoNaT','rUk4++9','LnKBXnhC','lntG0CT','XsonKU1','eCK=qMY','qJkH','a+BN','a+7N0JA','anSpqH1kACeptj','DUptXUN','K+W+e+1','eHopqs3hqiAvzd','qUD8qJkxqnDX0T','DD7TVHA','rJ78eLKOqJtYej','tXkUtCfhed','KmW9XMY','ThD7Km=','DXh=','RLhcXhT','qUDcrHthRLKhrT','X7fHesY','tJk7tnF','wRgj18=9A4Tgbd','tLthrCT','qnpOeNmOtJ79Kd','R=eJVNF','qNSJanM','bDYgbVhe08AEIT','VHpnR=T','rJew0hX','rnfyAQYj0H3OlT','eJk=RCa','amW1r+fUr76','DNt+TMA','tHKYqCT','VUcAXLj','XJW8K7Y','rJhxtRmYt+hCld','DXt2lnY','en7ULnBZLno9rg','eC7J0DX','qnfhrUX','0=o+DUj','a+SWtnF5anDxed','qnDxt=oOtsM','tsKY','rnSOqZYZ1+=SaT','RMk9TC=','lJDWtnpNwj','rU7ctT','amkIeZA','TDWN0UX','q7ft+=g','VntUrJhxtX7mtd','qsoOeJkZrng','eCpOVL=','A4a9A4=Sb41Bbd','eNewTXa','qHDiqHKE','RMm5V=Y','l+Kh0nopancCqj','aDp7XJN','aUkM0T','VJhKaU1','l+TcanSpqH1izj','Vmf2X=F','0+7bXDa','rCKhqimheUDxed','lUDRXHq','rUkZaL3Nanpp','RH3ZlCX','KUm1+Lq','amKoaXF','+7om+MY','AUDxAigjbEPYy5HYGAd','RMcNanM','aUSAaXa','rMtxaNg','RDhwXsM','rHtttDM','tCKOD=a','e+D8ed','tnDNKJ7NtT','f83g0Q7WrL3Oqj','KDKYlLT','XUDUrJDZed','qHhcaUk9','DDtyrCT','RsD=eXY','0XWLesT','wi1g14durH3pag','RNcUeHq','KJKMrJA','aLoCrDY','LmkU0JKElLthqj','q=KCVX1','l=SpVD1','qH39l+fh','l+BWeJhprQm8ag','r7WA+=6','l+B8tLoNTUDUrg','r7eYRU6','V=ex0hA','anDWtd','wZ=nqsjuaU7Zlg','timxaEmYfRmHqj','1Vog04cZrnSOqj','lsT5wVdgA+hcqd','rUfI1hkHqU7gqd','+Lo+aLX','tNtQrJ9','tnDNTnkprJD8ag','l+BWe=79lT','VJSHKJ9','anShaLA','l=tJK=N','f4pg0Q7WrL3Oqj','VXmtR71','Ai3ZrJ78q8Nieg','+MeEthM','rHfWeJhOrZWpaj','XNK3KHA','tnDNKCD9r7hhaT','rHoWtnhx','VUhOR=F','lUBmRUg','a+SW0LDxLHeptj','t+mWtLj','K+tmamd','qsKWrnBur+7Etg','1VdgoVcYt+hCld','eshZlJ7xtnX','lJcBKJ1','DnDQlmq','rDeBqmd','rJhCrZWZt+BNtT','aL3mKLA','lNKHtUN','1LgEI4e6fT','l+tWan7Nl+kx','eDKZtHj','tJhn','TnpceJX','ITYZen7ULnBZLg','bLKWeJShAZuYyyPWh5F','lC1Pe4N','lMcpt7=','qJoZ+sd','eJhctLfNa+mgLg','AQdjA4SgAJf9aT','ankxqHKEe+fNrg','eJDFeQ3utUkxed','eU7EAJ7Et8=','qJWtlXg','qsKZlJ=OT+SW0T','BWwfBbnqBl5oBa+YuuE152vHBl51BYiTBbxhBbib','enDilnhNXhK4Xd','qnfEt+DxVJDUed','eJhct+kmed','+=B2r7T','r+kmqnDmqd','qJcHemX','eZF2AQdjA4SMlT','rJhGXhY','qsotDCa','en78KJh8an7Etd','qNoCq=M','aXeDTHM','DLfJt+A','qHKWDU9','++f=a+A','bQ4gCBi4','14MFfZpiaVDUwd','VheKl=F','wnmpqUeWrimNrg','tMhYXNa','0D7NRnT','lUSTtXj','DXhpV7a','eJ7AKNa','lJ78ld','aEmNqU7Zt+hMAj','tCoOrXfYaLo4rg','DJkmanj','rJDxtHKY','qJpprCKOrT','eHftVDa','RUD3rUg','l+eYe4Y','t77hr+N','tnDN'];B2=function(){return hl;};return B2();}

console.log(window._mts['Bv']);



function get_ans(data) {
    
    //param1
    p1={
        "protocol": "https:",
        "host": "api.pzds.com",
        "hostname": "api.pzds.com",
        "port": "",
        "pathname": "/api/web-client/v2/public/goodsPublic/page",
        "search": "",
        "hash": "",
        "BU": "https://api.pzds.com/api/web-client/v2/public/goodsPublic/page"
    }
    //param1

    //param2
    p2 = data
    // p2=`{"order":"ASC","sort":null,"page":${page},"pageSize":21,"action":{"gameId":"7","goodsCatalogueId":6,"merchantMark":null,"keywords":[],"searchWords":[],"searchPropertyIds":[],"unionGameIds":[],"goodsSearchActions":[]}}`
    //param2
    var ans =window._mts['Bv'](p1, p2)
    return ans;
}
console.log(get_ans(1))
