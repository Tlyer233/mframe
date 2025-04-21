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

mframe.memory.config.proxy=true
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
// delete global;
// delete Buffer;
delete __filename;
delete __dirname;
delete require;
delete process;
require = undefined;

//ts_begin
$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=95512;$_ts.cd="qxxErrAlxqlqxGEbqaLZxGlFr13lcGVmqAqBqP3kcOabrGLmqn3lxGV.taGltn3qcGVmqAqokG9rqcZqxGltHc3oDGGrqc3mxGEkHqlqragtxGVtrAEwr1Exk1qrqc3oxGAtHc3kcGVlqA9bq13DcOarqc3lxGVtHc3hEGLlm13ocGVlqAqbr13ccOacqALmqP3DEP_IqsVSqGAnJyZuBCOi.4V9ufD9ka6_ExMT8W3nDRc0.OZp4_tUTh7eLqqNnQhPxY0rqRnJ9lO9B2mDqaAurGAkvPaU1T2exPC7F2p7VbgZFXRLY6eMJ2mYj62CHlV9H2OlWnZvEcLuiZx8hnQ7Mvpj0UwHUDmoF9._QDyw1UJKUt2lEseRUsABB1lBWYeMtcDBK9eiRTrY3iRa1sY71TY.u0V43V2rxOvlKkWNEcALJFT8UP9GJ0RfelTS1kJ63mBpRo2pVKJuYFz0APQgUYZu7nlftsVuKY_uEsl0F6RVp594VYroQvRpdm24HmrZW0teiYf8WPLbEMWnWYfItP3STURzAVyPVkB.s0eQwTRXQZg6i6mkxky3SkWBxnqjJsHcUPZvJuxLQ50CUDeY3TpHjoRlwOm6WbBzAPldKY00h40fhul_KT9BBsRBJYTGIUUwAoNGV6rehIxuQkS6WlVfNYf3J1g9xP57JYy3hPAnw.mMw2mMsspsTTrxWKRipTM1QozcEkSIKtZBE1QXHT287nl0R0YsAoUNKY70W2wMMJrHVDR4I0TcBs23UOEjxPDuJux3UnLbi_3nW2ACMVQ_.VSPwKla36B5WDrOQnA5KWAuhnQGtO3aa2gBxuNXt9ubWC2E8b7SVXG6W6xbMkWSe9AfHT2wJc5eE1ZnWTzRh40_JvpG1kY_nlTRYbe9M9kNMVRx8uwmEFY3KkVXxc3B.sp8Kcg9psBJW2x6pvRL1zlCplwWY2yj.bfaAPqZUTPBhnlvhOE6U7EBEVpEH99T6beVATmo116WWTxrAUx2MeGfiYyRJPGfB1Z4KmZjx9h0FDTZplebAtfR1orURKYV0DZ_R6W9H2OlWnZvEcLaJZx8hnwq1TzyuDeEYcS.Fn6T3YR.8oRAWQznEseRUsABB1lBW2eMtcowsYNrJmg0wtNuQVwiMsYT6OYsp0ToxOvlKkWNEcALi_z8UP9GpVwh_9SA3uxo1TsAsbTIRKrQpXR13PQgUYZu7nlftsq5KY_uEVrQVKwoQdpasmxWJ9SySKmP12VnAVteiYf8WPLbEMW4WYfItPRojYmsYKNrpCIjRby01OYHYewGh1zmxky3SkWBxnqjWs.cUPZvp9ywWQwoJDmX19J._kpVU0JVFoH_3PldKY00h40fhu3TKT9BBVwE1bJppUXXpKrV3UQeVQriFYefJlVfNYf3J1g9xP5jWmy3hPpqKdpCVlQSAY0T4Cfv1Ow2JsUu3Kx9EkSIKtZBE1QXWOR8aPZfAKTot2Mm1VpwJ9J7WJE6YYe1JbrE6PlyU29CtcDehu7CUT7LEwzTQbTLHvmDjbwjV0VdWuMW1UWepDQbiQp3Wn9GxcG6jmy8t1rkpVkFAby1wlrx3wRAiCNCWCSyTTRcxufwUuiuE1lNWuxRU.Wfp9SJQvpUuOrzWYYQJ9FXsOwIUKJkph0yKmgntP3f7uQ_KmZjx9j7QszL3Kra3z7_16TmwKYnuTp6QDW9H2OlWnZvEcLCWZx8hnwERDwDuuYM1TRKtvo4JVNKYbzrJeplEseRUsABB1lBJOJMK15e1KfGVbGSAwpMivwH3vw7CTwatCNuw1D2KmGThPAbh_LCU2GXxlfNulTsUlYPIl6xi0Rwp2eCp8g0AlEGHme3.nZfxngnJm4chnmEFuenA8Nfp9f.VTmU_CV6FUwCJld5Es28Ks3LEM0BJsxIKnGf0bSo3vNfF16RK9ybi6pm8QynYmq7wn3ySmGut1q9tkFLU2gNElf81IY0VC2KMKf05Vz_KvfupU.Q89AvimTIW4WfE190KT9BBVT7VDJYwmnbpvmLYYSzYHyzMuxGVDVfNYf3J1g9xP5jWYy3hPpVVwzEQlQ0FvScdVrzs9YcQviBJ0RcEkSIKtZBE1QXJux8aPZfYcSNQCut1ORAVOpb38Y.RURzA2x6dPlyU29CtcDehu3eUT7LEQy9F9rVF2xvaoxMVDe8Yvh81YzEwCQbiQp3Wn9GxcGSN2y8t1rY3lvF3mJc1vmn1iRoYOVSQ6p._PTlxufwUuiuE1lNWuyRU.WfY0yu3TV6SvY.JuW53KsgsmJns6JEph0yKmgntP3f7uVTKmZjx2UK3blaY9euKBwL82YSR6wP.2Y.wlV9H2OlWnZvEcLCW7x8hnwM32JK56YrsTrPK0U7QCpbWl9ZpjwcEseRUsABB1lBWkpMK15eKbRAYYypVIECQlerRKa6ynTEVvYvAnD2KmGThPAbh_S8UP9GUCyJjTxDJmzLpVob8TmrYvpt1XfV3PQgUYZu7nlftswMK15e3bfowoSBM5gz3oQ7FYwauTpvRD9dp1D2KmGThPAbh_9uU2GXxDQz_mEz3vx.MbMbpVYdwYeJYwGu8KAGHme3.nZfxngTJm4chnmf30YBA8N1K2wEAvEC6kpoUDWn3Uh8Es28Ks3LEM0BJsTIKnGf5PTEWVmVWDn7puYGi9V6J7zN16e2pn3ySmGut1q9tk1zU2gNEDJVww2AFTZ_A6RMeVlT1swUAYjSwVAvimTIW4WfE19CWT287nmbIDQCUo.F8YNdJmwK1ByBwKG0AcNlBs23UOEjxPDuWkm3UnLbRF0uFDwvM9w_6KZn1VfmYYFBp9zbQnA5KWAuhnQGtOECa2gBxCpHW9bL1CznWYYoJWrlW0zCAbYRd9EfHT2wJc5eE1ZnWYzRh4T93UmKVVGz.DxXMDYPQ0IYRmA6skx2EFY3KkVXxc3B.Op8Kcg9MlMnwvN0YUp.3XwKWvpDFsQC7KwGwcqZUTPBhnlvhOQSU7EBEKTApKNNe6QCHlfZUUIFWsxtKkyaVJGfiYyRJPGfB1ZSWYeMtco6RspXwUxVVQ2EQmpEF9etakNCFCRrxOvlKkWNEcALJFz8UP9GM6T..YS0MswKU9O1sYmqhoeEFBzWpcQgUYZu7nlftsL6KY_uEK96UYJPQ8SLYCfBwuRz_CmWFvwVYbteiYf8WPLbEMWai2fItPRNCYzzIur2IlkxWCEZwup8pWwF8TTOxky3SkWBxnqjWuUcUPZvFmS5YBRMskSSQKVud9wysD30wV5.QPldKY00h40fhuE4KT9BBKGzpkNjM2jbsVlSwlJhFwN28KJAVUVfNYf3J1g9xP5NWmy3hPpL3je9QmY_3vRBZUNvF2JmQkM8s0ycEkSIKtZBE1QXWuY8aPZfFKyNA2MwR2RTKvyuYXzNUoToQKYX6PlyU29CtcDehuluUT7LEIJuUmYoI2R_uvxJ1opWF9OMYomwJVlbiQp3Wn9GxcGS.Yy8t1rjwYkWiTSLpbmpJeL6RkJiJuJnTDyPxufwUuiuE1lNJsRRU.WfMs0nsVzoaoRYsbJEWvBjKKNvsORbA.0yKmgntP3f7uQTKmZjxb6Mw0prVC26YHrjKUmLMYrpCb22FlW9H2OlWnZvEcL6JZx8hnw7RKerZsx4VVeEUYBNpC0nQ0yVWjwPEseRUsABB1lBJkmMK15eMoR1MbyU3Jwy3O0CH6mC5DfoAsJAAnD2KmGThPAbh_L6U2GXxoACeuQuRoQLssBMJo7ThmJtpIJbQ9AGHme3.nZfxngTHm4chnmTibwLYBpyJuQuQkS1CUwxFsm9WuIXEs28Ks3LEM0BJOYIKnGf4OmWWmTN3C.tJ0NDR9rpQH2M1KrqA13ySmGut1q9tkXBU2gNEop7wHYSKsRLMDxtNuxQs0JQADhNR9AvimTIW4WfE19TW2287nm6pmmPQ94_W6m11TJ0YWY91KJv3mrPBs23UOEjxPDuJsN3UnLbwBfPw0zDFmREe6YhM6JzIYoHQD2r3nA5KWAuhnQGtOEna2gBx6prU2M.JkYU1bp7AQfUAvw1AKY14DEfHT2wJc5eE1ZCJTzRh4T4i2J_WKl_.Y2WQTNHMTMCw0wswvykEFY3KkVXxc3Bjkp8Kcg9ID40p93SWTeAJ5SRUDyOwUxCTvwWwcqZUTPBhnlvhOQTU7EBEUa63orCSKSys6lLWT.18sRD3lTwwIgfiYyRJPGfB1ZSWmeMtcobpbeUFCxV3Wyiw2mjwKRzZYmQV0RoxOvlKkWNEcALWtS8UvGXUYZf.PlBxTaLhP62FCx.Q6JjJ4mGMDGGtP36juqftY9CtcDehuJ3UnNIEFgfhnwQtcgzyKzPF6JuFP6ZMDgvhPAaJ_afhTgntP3f7ux8KcywxOtehnmMhcaj8IwPMUp6FkQzdDSXxng9Wk87E1e8WPLbEMWSU2GXU13nB1ZfKna7tvv63bT0wCGChIS7MPQXxkq6.clBUOEjxPDuWON3UT7LKWAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRhZAuhCz6FbGBZURBF1yLQKduhCTaMbNRU7ExqPTLMvATuYmJMk2ORC61Qm2w3kTrK5zvY92WUkeTyKYiYlLSwuOEJCxUMsJOW_pbwKwpwlRTNTxlwVqeQYBMAmwsFKYnJt06ikr63YpWumqSHDm8wOO.i0yupkJ1wBpJwmZ7JsAadkYbHcS7wuOjRUYQs9y1w_eBYb97JsAadkYbHcS7wuOE10rB1CWT3We2KsQ7JsAadkYbHcS7wuOoFmwTRoJLQzRfV997MoQg0uRKwlpUAv.KKKwOiKmAK_zp1TSzUOpNusfvslwpW9IBVDeTY9qd3XyC12mJwKfUTozRtulCJCcNROL.FoVdFz27MkSksYw04DSRtulCJCcNROL.FoVdhFauWD303u0zeUqg1UJNVOH489raJvS0itSmRVNW1oEuj2Ns3GEDrqtBqaE0qfS7w5zuQkeZKcLN7U2.RDS6QKCS3DSLikEaWxZmWkVSRsxbvaqnWuqDkOtBJkQniu3aWt0kcOWuJkQ0.sQ4JAEK4MvaV1lhkTBbYIK.7xmWdGAseCe3kughRy_QvqqDraAcryZOAmn7FKMz4zZv3lm8u89YixscqjUqFTiP04wMRd3frJ7kkuldJsi.WkqeJuZlqjgkcsATWOlSjulCWOEDhCIgWoNF3Dz7pJphs2x2pleV5TYJWow7sb6LsuRTWOms1e70svxJVUybNCEkrAEoWqi8WaWlJAAWJiVB3bpftbYX41ePwbZjRUUChCm9F1Nb3X7B3KfntbRjZ1eGtKmvRPdZQoqN3UYnhdS7MP2fwvAB5Cx6tKRjFcd4MDqNRb2ahdz73o0X36Sb7CR7Q1yGFDtuRKebhbr.MMJ2MolX3Dzz_ne93Kqj3C.yhCpdhbm7MhJ.M6VXMvpu7Cz6RPyBRCnuFbT7hbejRMJjMU3XM6w77C2atKfvwPdTQCANFoRfRhJNQDN7tbyP_KEBFKz9tDdaRceL363LMBRvhCfnWPfX4CEBFkRvtD4BWceLQblLMBpThCfz3PfXZoVBFDz.tD4BQneLQKZLMXebRc2zRDgBZDr4tKTf3ndaMClNMKNfhdr6R12nInfuybqBwKJTtoHgMPeTQb7LQ5eah6YnQPfu5CVBwUxnIcdBMKANQbevh5eBFP2nwKqB4bN2tUJnIcdz3Pe6MnNC3BEBQKf0RcfS5bABwCwTtoo.R1e636ALQHqBQDwXtvw2yneaQbWjw6syh6ruR1N68XaBwCpatvrPy1e6MDAjQD.yR1eSMUpCRBm6h6m_QPf6_CVBQ6mPtoU7QceuQUlLw8wvh6xz3DEB_DS23uqjQC4Nh6pL3nNu3X9BwoYStvSfZPe4wKZjIDd7h6zNQUgL85SBh6TBFPfy762jw1yvwDPuQCe7QUELFXePh6m2IcfudDxutKw.FqiIqawFxbzPqyzQxC3nrGrQXCpmrARREmuWqaETqGATiNZcWGVkJaAkvaWkrAEDrqFNWuWTWG3rijLCWOQcrGAc.G";if($_ts.lcd)$_ts.lcd();
//ts_end

if($_ts.cd){

    (function(_$dG,_$gL){var _$bf=0;function _$dj(){var _$_f=[73];Array.prototype.push.apply(_$_f,arguments);return _$dL.apply(this,_$_f);}function _$_Z(_$cW){return _$dj;function _$dj(){_$cW=0x3d3f*(_$cW&0xFFFF)+0x269ec3;return _$cW;}}function _$cP(_$dj,_$jx){var _$bt,_$cx,_$_h; !_$jx?_$jx=_$fT:0,_$bt=_$dj.length;while(_$bt>1)_$bt-- ,_$_h=_$jx()%_$bt,_$cx=_$dj[_$bt],_$dj[_$bt]=_$dj[_$_h],_$dj[_$_h]=_$cx;function _$fT(){return Math.floor(_$fv()*0xFFFFFFFF);}}var _$jx,_$bt,_$aN,_$$d,_$fb,_$k3,_$$J,_$fv,_$gn,_$_v;var _$kt,_$_H,_$gZ=_$bf,_$ef=_$gL[0];while(1){_$_H=_$ef[_$gZ++];if(_$_H<12){if(_$_H<4){if(_$_H===0){_$aN=[4,16,64,256,1024,4096,16384,65536];}else if(_$_H===1){_$_v.lcd=_$dj;}else if(_$_H===2){_$gZ+=2;}else{_$kt=_$_v;}}else if(_$_H<8){if(_$_H===4){_$_v=_$fb['$_ts']={};}else if(_$_H===5){ !_$kt?_$gZ+=2:0;}else if(_$_H===6){ !_$kt?_$gZ+=0:0;}else{_$fb=window,_$k3=String,_$$J=Array,_$jx=document,_$fv=Math.random,_$bt=Math.round,_$gn=Date;}}else{if(_$_H===8){_$_v=_$fb['$_ts'];}else if(_$_H===9){return;}else if(_$_H===10){_$dL(73);}else{_$kt= !_$gn;}}}else ;}
    
    
    
    function _$dL(_$ip,_$lZ,_$_l){function _$dj(){var _$_P=[73];Array.prototype.push.apply(_$_P,arguments);return _$bj.apply(this,_$_P);}function _$$X(){return _$el.charCodeAt(_$dN++ );}function _$kH(_$dj,_$jx){var _$bt,_$cx;_$bt=_$dj.length,_$bt-=1;for(_$cx=0;_$cx<_$bt;_$cx+=2)_$jx.push(_$hz[_$dj[_$cx]],_$cR[_$dj[_$cx+1]]);_$jx.push(_$hz[_$dj[_$bt]]);}function _$ix(){return'\x74\x6f\x53\x74\x72\x69\x6e\x67';}var _$jx,_$bt,_$cx,_$_h,_$fT,_$bf,_$gZ,_$kt,_$_f,_$_H,_$ef,_$bn,_$az,_$fC,_$_j,_$_R,_$ca,_$cR,_$$9,_$el,_$d9,_$dN,_$gD,_$$n,_$hz;var _$a7,_$fD,_$cz=_$ip,_$a1=_$gL[1];while(1){_$fD=_$a1[_$cz++];if(_$fD<100){if(_$fD<64){if(_$fD<16){if(_$fD<4){if(_$fD===0){_$bt[6]="";}else if(_$fD===1){_$bt[0]="~#`tsd`hfuXuusjcvuf`wbmvf`epdvnfou(mfnfou`obnf`qvti`ubh1bnf`bdujpo`tdsjqu`uftu`;0/+uuq5frvftu`sfbez6ubuf`ifjhiu`nbudi`tusjoh`h`bqqmz`mfohui`up6usjoh`bee(wfou/jtufofs`bqqfoeZijme`pqfo`ovncfs`pompbe`T`isfg`mpdbujpo`>`gpsn`C`cpez`pckfdu`]`tvcnju`tqmju`tfuXuusjcvuf`Q`joefy2g`podmjdl`sfqmbdf`qspupuzqf`tubuvt`potvcnju`gvodujpo`uzqf`kpjo`tqmjdf`xjeui`b`@`V`dbmm`dpodbu`dppljf`?`dsfbuf(mfnfou`tmjdf`&`BT`sftqpotf7fyu`vtfsXhfou`dibsZpefXu`ubshfu`opef1bnf`gmpps`joqvu`fyfd`~`ijeefo`poujnfpvu`fyufsobm`tuzmf`ujnf6ubnq`F`trsu`\"`sfnpwf(wfou/jtufofs`sfnpwfZijme`dibsXu`qpq`hfu(mfnfouYz,e`fwbm`spvoe`dpotusvdups`E`tfbsdi`:fc6pdlfu`mpdbm6upsbhf`pofssps`(wfou7bshfu`|`Xdujwf;2ckfdu`qbstf`qbuiobnf`tfu`hfu2xo3spqfsuz[ftdsjqupst`gspnZibsZpef`ifbefst`cvuupo` gspn `fwfou`ejw`sftqpotf`sftqpotf7zqf`R`dmjdl`btzod`ufyu`gspn`dbo3mbz7zqf`(ld3`qspupdpm`A`bct`joofs+70/`iuuqQ`posfbeztubufdibohf`voefgjofe`opef7zqf`iuuqtQ`jgsbnf`hfu`tvctus`tfoe`upq`qbsfou1pef`epdvnfou`qggG`iptuobnf`#potvcnju`#isfg``hfu(mfnfoutYz7bh1bnf`npvtfnpwf`tfu7jnfpvu`nfuipe`nfttbhf`FF`jnbhf`jnqpsu`qfsgpsnbodf`foduzqf`KKJ`tubuvt7fyu`bttjho`}`s`(mfnfou`G`OG`ujnf`0bui`fYONcZG`joefyfe[Y`pompbefoe`j`pobcpsu` bt `tipx0pebm[jbmph`+70/)psn(mfnfou`lfzepxo`H`$_<97;`5frvftu`ibt2xo3spqfsuz`tdsffo`hfu7jnf`opx`poqsphsftt`nby`#tsd`up/pxfsZbtf`ijtupsz`pompbetubsu`tvctusjoh`sftvmu`tubdl`dmpof1pef`cbtf`nbudi0fejb`lfzZpef`sftqpotf;0/`+70/*fofsjd(mfnfou`%`uifo`y`dpoufou`kbwbtdsjquQ`ebubtDut`sboepn`tfu,oufswbm`bvejp`gvodujpo `tfu,ufn`?\\s\\oV@}?\\sV\\o@`npvtfepxo`cppmfbo`m__`S`eftdsjqujpo`qgcI_G`$_oe`gpout`+fbefst`tzncpm`dbmmfs`pqujpot`tusjohjgz`n`potvddftt`dmptf`dum`kbwbtdsjquQ wpje?G@R`dfjm`sfqmbdf6ubuf`nbudift`qgbG`dboejebuf`joufsobm`gsbnft`0jdsp0fttfohfs`;0/+uuq5frvftu(wfou7bshfu`gfudi`pggtfu:jeui`z`3267`tfmg`R 6fdvsf`wjtjcjmjuz`d`5ftqpotfD7zqf`___76___`U`$c_dbmm+boemfs`npvtfvq`jtXssbz`upvdifoe`pggtfu+fjhiu`nfejb[fwjdft`dmfbs,oufswbm`hfuYpvoejohZmjfou5fdu`pvufs+70/`0jdsptpguE;0/+773`)vodujpo`_`wjefp`psjfoubujpo`D`iptu`qpsu`mpbe`mjol`#bdujpo`qptu`tupq3spqbhbujpo`#wbmvf`lfzt`bwbjm+fjhiu`jt1b1`bqqmjdbujpoFyDxxxDgpsnDvsmfodpefe`qgeG`lfzvq`ibti`sxdG`buubdi(wfou`SejwU,(OSFejwU`up*076usjoh`#tfbsdi`B`$c_tfuvq`$1:(L1{5l<kin<{0K`hfu2xo3spqfsuz[ftdsjqups`bqqmjdbujpoFynm`sjhiu`hfu,ufn`ftdbqf`buusjcvuft`tdsffo<`bcpsu`rvfsz6fmfdups`$_ut`buf0`qsfwfou[fgbvmu`jnvm`cpuupn`pggtfu/fgu`>obujwf dpef]`ufyuFqmbjo`bodips` TTU `hfu5ftqpotf+fbefs`__#dmbtt7zqf`p`sbejp`nfub`mfgu`#podmjdl`hfu6ibefs3sfdjtjpo)psnbu`tibefs6pvsdf`cHXfH)Kb`0fejb6usfbn7sbdl`dbudi`qsfmpbe`pggtfu7pq`*fu9bsjbcmf`bxbju`sf`qgcG`ujnf=pof`mm`pwfssjef0jnf7zqf`dpnqjmf6ibefs`gbGD`upvdinpwf`@C fyqfdufe `ktpo`ovn,ufnt`qbsfou(mfnfou`bdpt`joofs+fjhiu`#joofs+70/`efgbvmu `pggtfu;`dbmfoebs`dsfefoujbmt`tfttjpo6upsbhf`fyfd6dsjqu`bmqib`mpdbm[ftdsjqujpo`cz_qbui`fodpejoh`dpmps[fqui`pggtfu<`jufn6j{f`dbodfmYvccmf`dibshjoh7jnf`pxofs(mfnfou`qbstf,ou`joofs:jeui`JkfX/f6tbM`sfuvso9bmvf`gvodujpo pqfo?@ | >obujwf dpef] ~`bq`pckfdu6upsf1bnft`sxbG`HI`qgfG`buubdi6ibefs`sfuvsoR`$H_[,9`bwbjm:jeui`dsfbuf6ibefs`up8qqfsZbtf`npoui`fovnfsbuf[fwjdft`9(57(;_6+X[(5`3spnjtf`qbstf)spn6usjoh`>pckfdu Xssbz]`TTfoeTT`mpdbmf`dmfbs`J`c`difdlcpy`8ofyqfdufe ufnqmbuf tusjoh foejoh`gj` TTTU `pvufs:jeui`tfu5frvftu+fbefs`we)n`sfnpwfXuusjcvuf`qpx`)5X*0(17_6+X[(5`sfdfjwfs `hfu6pvsdft`_$sd`zfbs`cfub`qjyfm[fqui`tdsffo;`dpoubjot`ovmm`gsbnf`xsjuf`svo`tubuf`3`ebz`upvditubsu`qgdG`bqqfoe`bwbjm7pq`sfnpwf,ufn`$cn)Gb;=m5nm9z8+-`beefe1peft`+70/2ckfdu(mfnfou`wjtvbm9jfxqpsu`pvufs+fjhiu`gsbdujpobm6fdpoe[jhjut`#pvufs+70/`$c_qmbugpsn`efwjdf3jyfm5bujp`mcjjduizhbfo`jdgd`sxcG`8ofyqfdufe uplfo `GGGG`hbnnb`$`iuuqQFF`bwbjm/fgu`#opef9bmvf`dbquvsf`vsm`$_<:78`?^\\tA@}?\\tA$@`R fyqjsftT`pckfdu6upsf`ovncfsjoh6ztufn`[203bstfs`gvodujpo tfoe?@ | >obujwf dpef] ~`>GDPbDgXD)]`?uijtC bshvnfout>G]@R`dijme/jtu`R 6bnf6jufT1pof`a`wfsufy3ptXuusjc`cbuufsz`beeYfibwjps`sfh`pggtfu8ojgpsn`tdspmm`Xkby sftqpotf cpez efdszqujpo gbjmfe D `usbotbdujpo`tsd(mfnfou`tpsu`buusjcvuf1bnf`iuuqtQFF`hfo6`2wfssjef0jnf7zqf`gvod`fssps`sfuvso ofx b?`X55X<_Y8))(5`'`*fuXmm5ftqpotf+fbefst`7._7(03/X7(_12_68Y67,787,21`sfudbsbid`njjEuphEwodmFhpojkEqt`PK`dijmesfo`|uwt`cjoeYvggfs`yuuftYfbomfj`3fssgnpdbfot2fcfssw`0th_`sftqpotfYpez`hbmghojzbmqyf`#efubdi(wfou`0:m3zbsf2E;Z`fhYu`GLE`~|@f?idubd~Rfnbosje__ os`#buubdi(wfou`2ckfduE,okfdufe6dsjquEfwbmvbuf`ufyuFkbwbtdsjqu`MeMPMeMLLKNPNGMLNJ`fsp`9`fiebsf6t`7._(;7(1[6`vojgpsnIg`?S2Y-(Z7@_[,9`suz}pozY}qysd787`#tfu,oufswbm`[IuyfuopZhojsfeof5tbwobZ`tfmfdufe`7._75<`fst`Xcpsu`dibshjoh`7._7(03/X7(_+(X[`sy7uf`NONPMKMHNKMH`fuifsofu`7._:+,/(`7._(;3257`7._)81Z7,21`r5u~cLprw//gp{ft3 ztj0`ecmdmjdl`sppu`7._ZX6(`tmuj`dzh-B`~_sod|zuljkwMhfrughuNwdwh[_sod|zuljkwMhfrughuNhwNhohfwru[_sod|zuljkwMhvxph[_sod|zuljkwMhfrughuKhuirup<fwlrq[_sod|zuljkwMhfrughuMhfrug<fwlrq`bctpmvuf`efgjof3spqfsujft`PM`sftxpsYcf:pfCuyf7eofqqXto__Cto__CLnpetoCKnpetoCJnpetoCInpetoCHnpetoCofq2xpeoj:toCefufmqnpZopjubmvnj6toC,)5sflsbqtufoCsflsbqtufoCebpmzb3fhbspu6opjttf6toCfhbspu6opjttf6toCebpmzb3fhbspu6mbdp/toCfhbspu6mbdp/toCfhbspu6c[efyfeo,toCtuvpfnj7fdsp)toCfdbs7fmptopZtoChvcf[fmptopZto`l\"kd bmttej\"TmdjtQeGJGLOgPHPDcODLHHgdcDOcDIGGbbGGecfdcG \"jxueTiG\"yq \"fihjui\"TqG\"ySUpFkcdfUu`xjnby`DDDDD xjoepx_sfdu_I DDDDD`7._[()X8/7`np{twjjmcjjduizhbfo`JMJNJHJG`ojvn`_j`qpqtubuf`mbtu,oefy`utjm_{d`0pvtf`#sfmpbe`gjmfobnf`6-nputnvZuunCfnbs)fub`upcy|Exx`|fiiInsp`\"|j 6dfffssw tQ\"`~<ggN`6(1[`wfsufyXuusjc3pjoufs`7._7+52:`ejtqbudi(wfou`j{xmx`dvq`vojgpsn2ggtfu`fmjcp0`fobcmf_`NNMLMIMcMPNKLGMLNINJMPNJNKMLMfNKLJNKMgNIMHMNML`>R&]`ebubQ`jotubodfpg`y__gCj_gspf5yf_fbsee0fp`ujpo`fyqpsu `[buf7jnf)psnbu`7._(2)`#bttjho`hpv`bfup0tv0fwpYf(zfmfnuo`ee`>^Db]{J|`x1`)xpbs sue idfmb m uup iefjfog fqeyszpb oifesm`wjefpFphhR dpefdtT\"uifpsb\"}wjefpFnqKR dpefdtT\"bwdHEKI(GH(\"}wjefpFxfcnR dpefdtT\"wqOC wpscjt\"}wjefpFnqKR dpefdtT\"nqKwEIGEOC nqKbEKGEI\"}wjefpFnqKR dpefdtT\"nqKwEIGEIKGC nqKbEKGEI\"}wjefpFyDnbusptlbR dpefdtT\"uifpsbC wpscjt\"`gjstuZijme`MPMKMKMLMf`Z`NIMLMJNKKHMdNGMOMH`0tynmIE;0/+773ELEG`Fjuthpoobgbjm`jt)jojuf`ofyu6jcmjoh`bmfsu`ouj`npvtfmfbwf`pou`$c_po1bujwf5ftqpotf`hfu3spupuzqf2g`sXpd`7._18//,6+`Wefcvhhfs`mhcpmbs3wjdbZzopsump`txjudi?`MHNI`fs3s`ujnfpvu`6pildbxfwm)tbEii6dpxlwb)fbmit`dmjfou buubdl efufdufe`utqmp`7._7(03/X7(_0,[[/(`C vsmQ `shcb?IKGCHHGCLJCGEK@`0tynmE;0/+773`sfuvso b>c]?`ONMEHH`|\\tA`dpoufyunfov`mpbefe`\">(]\"`fs_u`Zs`#6vcnju`tfhbvhobm`\ngvodujpo Xdujwf;2ckfdu?@ |\n    >obujwf dpef]\n~\n`efwjdf,e`#xsjuf`LgMfMLNN`KIL`pdftt,e`-621`jo`tbwf`vtmz`XhZupsoEpXmphoZpums`dppljf(obcmfe`Tusvf`optkF`Snfub\\tBiuuqDfrvjwT>\"']Vsfgsfti>\"']V\\t`y67`LJ`umxTxmgq~ K6 G{zb~{x`gmj6mzufm` ofx `wjcusfb`7._Z200X` iptu `70(23X5<5`iuuqDfrvjw`(ofh`tfu/pdbm[ftdsjqujpo`qbstfsfssps`LG`MKMLMMMHNLMdNKLgLgNKMPMeMLMgNLNK`hfu8ojgpsn/pdbujpo`__bodips__`fxtcpufs`$_dpogjh__Eefubjm__ BT H`yDqxDhmbtt`dmjfou;`,oum`#bqqfoeZijme`ifbe`gps `#dmfbs`UUUT`qsbi6gfZ`S2Y-(Z7`avgzv=qpvgpv`xpmg_{d`bTdboejebufQ`7._Y5(X._Z217,18(`\\s\\oV}>\\vIGIO\\vIGIP]`deuv`uojb3*96Cuofw(xpmgsfw2Cuofnfm(ofhzf./07+Cuofnfm(ufmqqX/07+CsfmmpsuopZbjef0Copjuqfdy(iub3;Copjuqfdy(*96Copjuqfdy(/46`7._[(Y8**(5`Cqb6qbdZojmldbCqqd6obp)vd2tuvbCqqd6obf.[zxpCoqb6qbd.ozfq8bCqqd6obf6eof5mqdbnfofCuqb6qbd2o5obfzeu6ubZfbiho5fqfbmfdfnuobCqqd6obp/ebb+eofmCsqb6qbd3ohb/fbpfeCeqb6qbd6oufb3fhp/ebefbCqqd6obj:eoxppZovZubihoef,CkodfXuqqd6obd6jsuqjCkodffuXeqqd6obd6jsuq`_hj_nndqpumff`#sfnpwf(wfou/jtufofs`tijgu`#sfnpwfXuusjcvuf`f5mbm3zbsf5Ebf3m`7._,)`mbzfs;`su(fowuf`ft0vphp6Cmpp7nsp)mmj)cp0f6`twjj` tsgmy `mfwfm`7._3267),;_23`oj`usjn`jwjt`bqqb1fn`hfu6vqqpsufe(yufotjpot`hfu3bsbnfufs`sfuvso ?xjoe`eW}jj3grc`efdpef85,Zpnqpofou`75,X1*/(_675,3`cz_mbcfm`7._9X5`mbzfs<`ntZszqup`MMMPNIMLKcMLNPKLNMMLMfNKJI`qbhf;2ggtfu`gjobmmz`gvodujpo 5frvftu?@ | >obujwf dpef] ~`S(0Y([ jeT`S!DD`MgNOLg`buus9fsufy`7._,1`mpudjbCpiogsCfojfo7s0+b/dCpuojsCdtfCbtisCddpmoljCdmwvbqfbCoubiCnifupCttiupnofbpCsqiubCCtqiusppmdCpubsuvjucCfptfvsu0+/7oCtpnvjcoupC9ebffmCvgsfffsss5C/8pCdefvon5u,8`M`j+tn`KeLJKIMdMgMIKINLMPMdMKMLNI`tnjwjtjcjmzuidobfh`:fjjoyY-s6hjfe`hfuXmm5ftqpotf+fbefst`sftfu`ou`MfMLNNIGMgMdMKLNMLMILJMgMJMcMLNKIONLNIMd`dbtf `?gvuojd?p@ow b|bs  oTf [xb ?u@feRf hchvRf susvf soo f[xfb?uD@  Ub  GHRG@~@?`bofn`=O;+k`efwjdfpsjfoubujpo`0uej,C/thpojef/ChpojXCuvpijsf{*CufbYftt8sfo,pg5Cufb/ovid`dmjfou:jeui`.fzcpbse`efgjof3spqfsuz`fyqfsjnfoubmDxfchm`kctdifnfQFFrvfvf_ibt_nfttbhf`h(fwoufIo`8ofyqfdufe uplfoQ `uofj`fmtf `sfejsfdufe`uJuxqVqmpq~`[fwjdf2sjfoubujpo(wfou`bqqmjdbujpoFyDkbwbtdsjqu`on`8ofyqfdufe dibsbdufsQ `R qbuiTF`ldbs7up1pe`hfu5boepn9bmvft`bubl`xjoepx`FQvtfs_gpout`re~~`d.ts~shnm0ardqudq`!ofx gvodujpo?@|fwbm?\"uijtEbTH\"@~?@Eb`y7uf`C efdszqufe 61Q `fdu jeT\"ccOI`tqtbsxep`gjmf1bnf`mefm3hvoj`fobcmf9fsufyXuusjcXssbz`NJNKKJMHMMMLKJMgNIMLILIdILNKMLNJNKKJMHMMMLKKNIMPNMMLNIILIdILNKMLNJNKKJMHMMMLKPMMNIMHMeMLKKNIMPNMMLNIILIdILNKMLNJNKKJMHMMMLKHNLNKMgMeMHNKMPMgMfIL`__ewsfjfsw_vbbmCu_ff_cxjews_ffsmwvbfbCut_f_omjf_vfnmwvbfbCug_y_jews_ffsmwvbfbCue_s_fjswo_xvqsqbCf_ef_cxjews_fvssobxfqeq_Ct_ffomnj_vxvsoqbfq_e_Cegsyfjswo_xvqsqbCf_ef_cxjews_ftsjdqsguv_Co_df_cxjews_ftsjdqsguo_`KLNMMLMfNKKJMgMgNIMKMPMfMHNKMLNJ`supDpninbiffsDbteeipbvxjD`7._7(03/X7(_7X,/`tfmfduD`4s4pYfxst`5ftqpotf`offsh`tshc}qJ}sfdIGIG}boz`h(fwoufJo`rvf)tju6mzfftnu`pqfofs`qbhf<2ggtfu`NKNIMPMfMNIGIcJeIGMcMLNP`qM~fyfk`wfsufy3ptXssbz`bddfmfsbujpo,odmvejoh*sbwjuz`beeu_njpfuv`fo`7._/,7(5X/`iboemfs`vufs|zsu`yu`wSasmuVswo0SasmuVswo`difdlfe`#tipx0pebm[jbmph`_tfmg`}kirOmqyp`bqqmjdbujpoFkbwbtdsjqu`)mpbuJIXssbz`nvdpe}ebfisfnnbi`rsdlmn[p(yui:-j+XqHt9<.8J5)04xO,*g32PIcw/1kEN{;Yb6ovG7ZMhz_K=fLe|~}a !#$%?@ABCDRTVW>]^`__qspup__`tj`\\c>^U]AU?>\\t\\6]AV@S\\F`bXmofzste1fp`0tynmIE6fswfs;0/+773EKEG`o5ef`5f`GEGEGEG`Yce`dmpof`nbfvtfsf7uy`HJMKO`dppljf ejtbcmfe`dibstfu`sfuvso `ttp`7._)25`gvodujpo gfudi?@ | >obujwf dpef] ~`7._<,(/[`7._6(0,_Z2/21`7._)520`'*pphmf ,odE'`67X7,Z_[5X:`vZ`fj{sfp3ojtu`#iptuobnf`tvsf`xjoepxEwjtvbm9jfxqpsuE`#pqfo`Zwbbomtf(onuf`sjb3zf.puqzsZ`xijmf?`^?VQ\\e|HCJ~?VQ\\E}$@@|K~`sbohf0jo`sT'n'`#sfnpwfZijme`uqnps3emp`ejtbcmfe` jo `xjuiZsfefoujbmt`DxtDebubDqsfwjfxDfmfnfou`gpFy?\\B\\@e`MgNGMLMfIdMLNMMHMdIdNJMOMgNNKeMg`r~d`usz|`+,*+_)/2X7`fwbsc`7._23(1_3X5(1`b)fwd,opb-bwo,fugsdbCffkjtop`[fwjdf0pujpo(wfou`mdpubpjcosb`7._23(1_Y5XZ.(7`7._X6<1Z`ilyh|ig11YT`>1p tvqqpsu]`hfof(ow_uIK`ufyubsfb`chtpvoe`>op nbq]`6upsbhf`7._X552:`NNMPMfMKMgNNIfMH`JIJHJKJNJKJOJJJMJKJO`e h(`sftpmwfe2qujpot`dbmmcbdl`jikh{nzm.ny`dmjfou/fgu`jt(yufoefe`u|sszvfsu_o_ mgfjnofbdRb~iu?d|f~@`poupvditubsu`qbsfou`7._[27`beho` xijmf?`a?xgpv`XYZ[()*+,-./0123456789:;<=bcdefghijklmnopqrstuvwxyz{GHIJKLMNOPBFT`np{57Z3ffsZpoofdujpo`7._237,21X/_[27`qtbxtspTeIHKJML`hfu(yufotjpo`tqivu1jpdgbjpuoj`7._(/6(`2qfo`7._[2`\\c??tvcnju@}?pqfo@}?mpdbujpo@}?dppljf@}?potvcnju@}?bdujpo@}?isfg@}?tfbsdi@}?tsd@}?tfuXuusjcvuf@}?hfuXuusjcvuf@}?85/@}?epdvnfou85,@@\\c`HOqy 'Xsjbm'`?sphjojmb Cojfuwsmbi7fsitmp@e`#85/`7._X66,*1_;`^??VQ>\\ebDg]|HCK~?VQQ}@@|GCO~@?QQ@V??VQ>\\ebDg]|HCK~?VQQ}@@|GCO~@$`buusjcvuf wfdI buus9fsufyRwbszjoh wfdI wbszjo7fyZppsejobufRvojgpsn wfdI vojgpsn2ggtfuRwpje nbjo?@|wbszjo7fyZppsejobufTbuus9fsufyBvojgpsn2ggtfuRhm_3ptjujpoTwfdK?buus9fsufyCGCH@R~`7._Y,1_23(5X725`sus|Yw{ezodsS}ecsS}fs`Dfwbmvbuf`KJMH`0tynmIE;0/+773EMEG`MLNONGMLNIMPMeMLMfNKMHMd`6zlfq[Eufdfjuop`srbwfsb3sfozeods`dpnqmfuf`ufemxw`lbmupbfoo6fet0htfb`c\\=na`__74_3+_22_.21,7,)5(` ?@ | >o`LgLgNNMLMIMKNIMPNMMLNILgMLNMMHMdNLMHNKML`mjof1vncfsCdpmvno1vncfsCgjmf1bnfCmjofCdpmvnoCeftdsjqujpo`dbmtt`cfxdvCuy(cf:Z8`ufyuFiunm`57Z3ffsZpoofdujpo`nsdpEyf5`ol?vsm`bshvnfout`pdjEopdjwbgFqsvcFF`pt`8oufsnjobufe nvmujmjof dpnnfou`7._1(:`pctfswf`bsfb`$cgOPbGHM$`0tynmIE;0/+773EKEG`*bnbfeq` ifjhiuTM xjeuiTH uzqfTbqqmjdbujpoFyDtipdlxbwfDgmbti tsdT`npvtffoufs`xfclju,oefyfe[Y`7._X:X,7`dmjfou7pq`gmfitlppccrCfhejsc_cr`bs`uhYfdmlp`EB ?*7}60}6Z+@D`dsfefoujbmmftt`t`\\>ob`cxlf5jfu`-wb(bdyqfjuop`o_ghpeptp`?bozDipwfs`0tynmIE6fswfs;0/+773`mph`}wgvsppfevw`]USjUSFjUS!>foejg]DDU`mbtu,oefy2g`?S\\F2Y-(Z7@`7._X[[,7,9(`LgLgMJNILNMLMIIdLgLgMNKJNILNMLMI`vompbe`xjgj`bw sfiebsf6tsuoj6hcv`dtl`bfco`#sfqmbdf`bujwf dpef] ~`efcvhhfs`MKMHNKMHIeMcMHMfNKNL`vugDO`vtf3sphsbn`7._48(67,21_0X5.`nvmujqbsuFgpsnDebub`KJMONIMgMeMLLdIgIOLdMKIcIP`vsm?#efgbvmu#vtfsebub@`pmpeoZsgnj`uf`efs`xfo_pgoj`qmvhjot`S!DD>jg hu ,( `tdsffoE`dqbvufsu6db7lbsfd`sufsv ozufqgp_ m_bp6esdqj uTT\" vgdojuop \"&&u qzpf g__befud_pmldT  Tg\"ovudpj\"o`xpeojx TT udfkc2mbcpmh_ && \"efojgfeov\" T! xpeojx gpfqzu && \"efojgfeov\" T! udfkc2mbcpm`HINEGEGEH`bmm`7._,03/(0(176`NKMO`MNMLNKKPMeMHMNMLKKMHNKMH`opof`!`?@U  Tomhbhvfb}t} ' f>8o6D ''C'f]o` ep `vnoopujsp`ftoibkoj`?dpmpsDhbnvu`tbwobd`^?\\>pckfdu@ /pdbujpo}2ckfdu}[203spupuzqf]`0tynmJE;0/+773`fnpsid`nj9hmbejubpjZoep/fbpIe`epdvnfouDgsbhnfou`r99`wfstjpo`gpsn(oduzqf`#psjhjo`uZ`sfbexsjuf`dsfbuf3sphsbn`ubpu[5b/8`>\\\\\"\\vGGGGD\\vGGHg\\vGGNgD\\vGGPg\\vGGbe\\vGMGGD\\vGMGK\\vGNGg\\vHNcK\\vHNcL\\vIGGdD\\vIGGg\\vIGIOD\\vIGIg\\vIGMGD\\vIGMg\\vgfgg\\vgggGD\\vgggg]`efubdi(wfou`mbosfuyfCoffsd6mmv)utfvrf5ujlcfxEfqzupupsqEuofnfm(uf6fnbs)/07+C38<(.EfqzupupsqEuofw(uqnps3mmbuto,fspgfYCfwpnftvpnopEuofnvdpeC__$_GMJppijr_$__Cuofw(efuqzsdo(bjef0Cbub[ldjmZCldp/sfuojp3utfvrf5{pnEfqzupupsqEuofnfm(tdjiqbs**96CfhbqopEzepcEuofnvdpeCutvkeXf{j6uyf7tnEfmzutEzepcEuofnvdpeCfdobnspgsfqChojnj7uojb3fdobnspgsf3Cbsfqp__Cfhb3fmdjusXfep0sfebf5Cthbm)uj.cf:CspssfopCfdobsfuu8tjtfiuoz6idffq6Ciuej:ojnEfmzutEzepcEuofnvdpeCopjubuofjs2offsd6Cutb/ohjmXuyfuEfmzutEzepcEuofnvdpeClbfsYfojmEfmzutEzepcEuofnvdpeCopjudfmftEuofnvdpeCe,zYldbs7ufhEfqzupupsqEutj/ldbs7uyf7Cefmmbuto,sfejwps3idsbf6t,EmbosfuyfCsfmmpsuopZbjef0Ctutf7gsf3uf*CftpmdEfqzupupsqEuyfuopZpjevXujlcfxCfub[efubfsZfmjgEuofnvdpeC__sfuuf6fojgfe__EfqzupupsqEudfkc2CfnpsidC[IuyfuopZhojsfeof5tbwobZoffsdtgg2CsfuofftvpnopEzepcEuofnvdpeCfsvuqbZsfuojp3tbiEfqzupupsqEuofnfm(uf6fnbs)/07+Copjubdjgjup1Ctfmv566Zefidub0ufhCuofw(ftpmZujojEfqzupupsqEuofw(ftpmZCuvqoj_fsvdft_vphpt__CfhbttfnopC__ypgfsjg__CuftsbiZumvbgfeEuofnvdpeCmbftEudfkc2Cfdbqtfuji:fep1tjCfubu6mmbuto,EqqbEfnpsidCeojcEfqzupupsqEopjudov)Cdjsfnv1uobjsb9uopgEfmzutEuofnfm(hojmmpsdtEuofnvdpeCfmv5uftsbiZ66ZCgg2hojosb:ldp/tqbZtnEuofnvdpeC6-;:_CldbcmmbZebpmoxp[cpmYCfwpnfsEfqzupupsqEopjudf6X7X[ZCuy(cf:Z8C[+bub[fhbn,uf*ujlcfxEfqzupupsqE[IuyfuopZhojsfeof5tbwobZCf{jtfsopEuofnfm(uofnvdpeEuofnvdpeCfep0eofmYeovpshldbcEfmzutEzepcEuofnvdpeCfhobidopjudfmftopEuofnvdpeC;2Y*1,[182Y7Z(-Y2_(3<7_7,18_*96Euofnfm(osfuub3*96Cmjbuf[fqzuEopjudfmftEuofnvdpeChpmbj[mbep0xpitCsfggvYfdsvp6Ctmju8ojhp/vphp6Cfujspwb)eeXEmbosfuyfCzflspubsfmfddbDtnDyEzepcEuofnvdpeCefmcbof_sfhbobn_espxttbqCjtdEfnpsidCfhejsYsfiubfxCfqz7fhobidEfqzupupsqEsfggvYfdsvp6Ciub3eebEfqzupupsqE[Iiub3CfhobidxfjwefidbufebsfqpopCnfutz6fmj)utfvrf5ujlcfxCuofw(_sftxpscpbuCg2fqzupups3uftEudfkc2Ctvubu6umvbgfeCutj/ldbs7pjevX`efwjdfnpujpo`KPMeMHMNML`k[-*gafl{jSn{fl`dsfbuf[bubZiboofm`II`!jnqpsubouR wjtjcjmjuzQ wjtjcmf !jnqpsubouR xjeuiQ HGG% !jnqpsubouR {DjoefyQ IHKNKOJMKM !jnqpsubouR`7._:,7+`__nu`sfjsw`7._23(1_Y5XZ(`EHHQws`^\\tB}\\tB$`dsfbuf2ggfs`OOI`pnju`gpou)bnjmz`NGMLNINJMgMfMHMdMIMHNI`7._X66,*1`{n+p`dsfbuf(wfou`xfclju57Z3ffsZpoofdujpo`tdsffo7pq`IP`tfpueYpzZ1dmlj`0tynmIE6fswfs;0/+773EMEG`sfgfssfs`#tfu7jnfpvu`?^\\FA@}?\\FA$@`_Y52:6(5`vofyqfdufe ovncfs foejohE`fCbttjhoCsfmpbeCup6usjohCqspqCtfuXuusjcvufChfuXuusjcvufCsfnpwfXuusjcvufCtvcnjuC6vcnjuCpotvcnjuCjotfsuYfgpsfCbqqfoeZijmeCsfqmbdfZijmeCbee(wfou/jtufofsCsfnpwf(wfou/jtufofsCbuubdi(wfouCefubdi(wfouCqvti6ubufCsfqmbdf6ubufCtupq3spqbhbujpo`0tynmIE;0/+773`wbs hfuXuusjcvufTgvodujpo?obnf@|sfuvso dvs_fmfEhfuXuusjcvuf?obnf@R~R`uispx `#HNf`jg?`sfgsfti`8ofodmptfe tusjohE`ujwdfp \\e]f`fopmbeobut`fubvmbwfDsfwjsecfx`oCxpeojx`qbhf/fgu`l%}vddzi}zvy%9%kz`N`_:,1[2:_Z/26(`btzod `7._81X5<_35(),;`_ijq`sfqmbdfZijme`oeps }} `g???`wtjcjfm`qvu`wmbvf`#tvcnju`f6sutoshj` fyufoet `hmpcbm6upsbhf`xjoepxE`vl~_ylc`x`_cmbol`rsdlmn[p(yui:-j+XqHt9<.8J5)04xO,*g32PIcw/1kDN{;Yb6ovG7ZMhz_K=fLea!W$%^&A?@BTSUEVFQR|~>]} `#tupq3spqbhbujpo`bmtt`ujwf`~_g`DU>gvod]Q`MIMHMKMIMgNP`qsfdjtjpo`cjmj`ykmnSpizx`:fc;`jzu`MNMLNKKM`#dmpof1pef`jnqpsu `nvjofmf6mmbdCnvjofmft_Csfespdf5_([,_nvjofmf6_`cfibwjps`7._Z/26(_Y5XZ.(7`$B]{Db>_~II|]PDG{Db>_~`tqijp_fpelpC{njXnojbpuuob67sjuCnnf,po{yeffYeC[{n5pvffrXtoubjunoj)pnsfb`MJMHMdMdLGMOMHMfNKMgMeIdLgNGMOMHMfNKMgMe`uz6ubuf`yjt}m`#ibti`tfozeo6\"d*?687(,_1::[_210XX5*_(1:[,_22:13\"(`KJIEH`ibsbesxpfoZsdsvdfzo`np{Zpoofdujpo`bmfz?snu @dXjufw ;pZuops mJ?DIjc@u`#bee(wfou/jtufofs`dpoofdujpo`DUtfuufsQ`xfchm`#iptu`[jtqbudi(wfou`#tfuXuusjcvuf`qptjujpo`gvodujpo \\6BV\\?\\@|\\6B`f**uofsfmb,0C[f*`nt,oefyfe[Y`xjui?`MeNJKKMgKfMgNKLKNIMHMJMc` dpef\\]\\tA~`#sfqmbdf6ubuf`gpou`q9`iuuqtQ\\\\`efcvhhfsR_$ec?`tuuvbbtsc`opjubnspgo,uofjmd`z.(fowuf`gjof}dpbstf}opof}boz`tdspmm:jeui`=O;+--<Ecn)Gb;=m5nm9z8+-?@`NNMLMIMc`nspgubmq`mjof1vncfs`\">8]\"`>bD{GDP]|II~_`\">)]\"`povqhsbefoffefe`6fu5frvftu+fbefs`__gj`#sfqmbdfZijme`Xkby sftqpotf cpez jt opu fodszqufeC sftqpotf mfohuiQ `7._1X0(`81,48(_`fyu`7._Z2/21` ejpseoX`zjfme `Ep`#buusjcvuft`1bnf fyqfdufe`mpo5`exs,bhnfb`#gOI`+70/Xodips(mfnfou`0tynmE[20[pdvnfou`KKKMLGMOMLMdNMMLNKMPMJMHJcLKMPMIMLNKMHMfIGKeMHMJMOMPMfMLIGLLMfMPJcKJMgMgMdMbMHNbNbJcLMMLNIMKMHMfMHJcKOMLMdNMMLNKMPMJMHIGKfMLNLMLIGKdLKIGLGNIMgIGJJJLIGLKMOMPMfJcNKMHMOMgMeMHJcKdKNIGLJMeMHNINKLgKOIGNKMLNJNKIGLIMLMNNLMdMHNIJcKKKPKfLGNIMgIeMdMPMNMONKJcKOMLMdNMMLNKMPMJMHIGKdLKIGJKJJIGKdMPMNMONKIGKLNONKMLMfMKMLMKJcKOMLMdNMMLKeLgKPMfMKMPMHJcLJKLKJLIMgMIMgNKMgKdMPMNMONKIGKIMgMdMKJcKgLIIGKeMgMOMHMfNKNPIGLLMfMPMJMgMKMLIGLIMLMNNLMdMHNIJcKKNIMgMPMKIGLJMHMfNJIGLKMOMHMPJcKcMHMfMfMHMKMHIGLJMHMfMNMHMeIGKeKfJcKKKKKJIGLLMJMOMLMfJcMJMdMgMJMcJIJGJHJMLgNMJHIfJHJcLJMHMeNJNLMfMNKcMHMfMfMHMKMHLIMLMNNLMdMHNIJcKeKPIGKdKHKfLKKPKfKNIGKIMgMdMKJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeJJKdIGKdMPMNMONKJcNMMLNIMKMHMfMHJcKOMLMdNMMLNKMPMJMHKfMLNLMLLKMOMPMfJcLJKLKJKMMHMdMdMIMHMJMcJcLJMHMeNJNLMfMNKLMeMgMbMPJcLKMLMdNLMNNLIGLJMHMfMNMHMeIGKeKfJcKJMHNINIMgMPNJIGKNMgNKMOMPMJIGLJKJJcKMMdNPMeMLIGKdMPMNMONKIGLIMgMIMgNKMgIGKdMPMNMONKJcLJMgKeKHIeKKMPMNMPNKIGKdMPMNMONKJcLJMgKeKJIGLJMHMfNJIGLIMLMNNLMdMHNIJcKOLPLOMPLPNLMHMfKbJcNJNJNKJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJKLKJcMNMeLgMeMLMfMNMeMLMfMNJcKdMgMOMPNKIGKcMHMfMfMHMKMHJcNKMPMeMLNJIGMfMLNNIGNIMgMeMHMfJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJKKdJcNJMLNIMPMMIeMeMgMfMgNJNGMHMJMLJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeIeJJLKIGLKMOMPMfJcKJMgMdMgNIKgLJLLKPIeLOLKMOMPMfJcKKNIMgMPMKIGKfMHNJMcMOIGLJMOMPMMNKIGKHMdNKJcLJMHMeNJNLMfMNLKMLMdNLMNNLLIMLMNNLMdMHNIJcKIMLMfMNMHMdMPIGKgLKLJJcKeKPIGKdMHMfLKMPMfMNLgKNKIIGKgNLNKNJMPMKMLIGLPLJJcKMLbKeMPMHMgLNNLLgKNKIJHJOJGJJJGJcMOMLMdNMMLIeMfMLNLMLIeNIMLMNNLMdMHNIJcLJLJLKIGKeMLMKMPNLMeJcKJMgNLNIMPMLNIIGKfMLNNJcKcMOMeMLNIIGKeMgMfMKNLMdMcMPNIMPIGKIMgMdMKJcKOMLMdNMMLNKMPMJMHIGKdLKIGJIJJIGLLMdNKNIMHIGKdMPMNMONKIGKLNONKMLMfMKMLMKJcKOMLMdNMMLNKMPMJMHIGKdLKIGJIJLIGLLMdNKNIMHIGKdMPMNMONKJcLIMgMIMgNKMgIGKeMLMKMPNLMeJcKKNIMgMPMKIGLJMHMfNJIGKIMgMdMKJcMNMgNLMKNPJcNJMHMfNJIeNJMLNIMPMMIeMJMgMfMKMLMfNJMLMKIeMdMPMNMONKJcLJKMMPMfMKMLNIJcMfMgNKMgIeNJMHMfNJIeMJMbMcIeMeMLMKMPNLMeJcMeMPNLMPJcKeLIMgMJMcNPIGLGLIKJIGKIMgMdMKJcKHMfMKNIMgMPMKKJMdMgMJMcIGLIMLMNNLMdMHNIJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeIeJKKdIGKdMPMNMONKJcNJMHMfNJIeNJMLNIMPMMIeNKMOMPMfJcKHMHLGMHMfMNLPMHMLNIJcMJMHNJNLMHMdJcKIKfIGKeMgMOMHMfNKNPKgLKIGKIMgMdMKJcNOIeNJNJNKJcKfMgNKMgLJMHMfNJKeNPMHMfMeMHNILbMHNNMNNPMPJcKOMLMdNMMLNKMPMJMHIGKdLKIGJJJJIGLKMOMPMfIGKLNONKMLMfMKMLMKJcKHNJMOMdMLNPLJMJNIMPNGNKKeLKIGKHMdNKJcKfMgNKMgIGLJMHMfNJIGKKMLNMMHMfMHMNMHNIMPIGLLKPJcLIMgMIMgNKMgIGKJMgMfMKMLMfNJMLMKIGKIMgMdMKJcLIMgMIMgNKMgIGKeMLMKMPNLMeIGKPNKMHMdMPMJJcMeMPNLMPMLNOJcKfMgNKMgIGLJMHMfNJIGKNNLNIMeNLMcMOMPIGLLKPJcLJLJLKIGLMMPMLNKMfMHMeMLNJMLIGKdMPMNMONKJcKdKNLgKgNIMPNPMHJcMONPMJMgMMMMMLMLJcNOIeNJNJNKIeNLMdNKNIMHMdMPMNMONKJcKKKMKOMLMPKHLNJNIeKHJcKMLbLbLNLOKILKKgLKLgLLMfMPMJMgMKMLJcKKMLNMMHMfMHMNMHNIMPIGLJMHMfMNMHMeIGKeKfIGKIMgMdMKJcNJMHMfNJIeNJMLNIMPMMIeMeMgMfMgNJNGMHMJMLJcLGMHMKMHNLMcIGKIMgMgMcIGKIMgMdMKJcKdKNIeKMLbLPMPMfMNKIMPKcMHMPLJMONLIeLJJHJLIeLMJIIfJIJcKdKNIeKMLbLPMPMfMNKIMPKcMHMPLJMONLIeLJJHJLIeLMJIIfJJJcKOMLMdNMMLNKMPMJMHKfMLNLMLKdLKIGLGNIMgIGJJJLIGLKMOJcKeMPMJNIMgNJMgMMNKIGKOMPMeMHMdMHNPMHJcLJMHMeNJNLMfMNLJMHMfNJKMMHMdMdMIMHMJMcJcLJLJLKIGKeMLMKMPNLMeIGKPNKMHMdMPMJJcKHMfMKNIMgMPMKKLMeMgMbMPJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeIeJJLIJcKPLKKJIGLJNKMgMfMLIGLJMLNIMPMMJcNJMHMfNJIeNJMLNIMPMMIeNJMeMHMdMdMJMHNGNJJcNOIeNJNJNKIeMeMLMKMPNLMeJcKdKNLgLJMPMfMOMHMdMLNJMLJcLIMgMIMgNKMgIGLKMOMPMfIGKPNKMHMdMPMJJcMJMLMfNKNLNINPIeMNMgNKMOMPMJJcKJMdMgMJMcMgNGMPMHJcKdNLMeMPMfMgNLNJLgLJMHMfNJJcKMMdMgNIMPMKMPMHMfIGLJMJNIMPNGNKIGKHMdNKJcKfMgNKMgIGLJMHMfNJIGKNNLNIMeNLMcMOMPIGKIMgMdMKJcKdLKKOLPLJLbKcIGKIMgMdMKJcKNLJLgLKMOMHMPJcLJMHMeNJNLMfMNKfMLMgKfNLMeLgJJLKLgJIJcKHNIMHMIMPMJJcMOMHMfNJIeNJMHMfNJIeMfMgNIMeMHMdJcKdMgMOMPNKIGLKMLMdNLMNNLJcKOLPLHMPKOMLMPIeJLJGLJIGKdMPMNMONKJcKdMPMfMKNJMLNPIGMMMgNIIGLJMHMeNJNLMfMNJcKHLIIGKJNINPNJNKMHMdMOMLMPIGKKKIJcLJMHMeNJNLMfMNIGLJMHMfNJIGKeMLMKMPNLMeJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJKJLJcMOMHMfNJIeNJMHMfNJIeMIMgMdMKJcKdNLMeMPMfMgNLNJLgLJMJNIMPNGNKJcLJLJLKIGKJMgMfMKMLMfNJMLMKJcLJMHMeNJNLMfMNKKMLNMMHMfMHMNMHNIMPLIMLMNNLMdMHNIJcKHMfMbMHMdIGKeMHMdMHNPMHMdMHMeIGKeKfJcLJMHMeNJNLMfMNLKMOMHMPIONKMLNJNKIPJcKMLbKdMHMfLKMPMfMNKOMLMPIeKeIeKNKIJHJOJGJJJGJcKOMLMINIMLNNIGKgLKLJJcKNLJJKJLLgKHNIMHMIIOKHMfMKNIMgMPMKKgLJIPJcLJMHMeNJNLMfMNIGLJMHMfNJIGKdMPMNMONKJcKJMOMgMJMgIGMJMgMgMcNPJcMOMLMdNMMLIeMfMLNLMLIeNKMOMPMfJcLGKfIGKeMgMOMHMfNKNPKgLKIGKeMLMKMPNLMeJcKdKNIeKMLbKcMHLKMgMfMNIeKeJHJPIeLMJIIfJKJcKKNIMgMPMKIGLJMLNIMPMMJcLJMHMeNJNLMfMNLJMPMfMOMHMdMHLIMLMNNLMdMHNIJcMOMLMdNMMLNKMPMJMHJcKdKNIeKMLbKcMHLKMgMfMNIeKeJHJPIeLMJIIfJIJcKfMgNKMgIGLJMHMfNJIGKKMLNMMHMfMHMNMHNIMPIGLLKPIGKIMgMdMKJcLJLJLKIGKdMPMNMONKJcKKKMLGKLMeMgMbMPJcNNMLMHNKMOMLNIMMMgMfNKMfMLNNIGLIMLMNNLMdMHNIJcLIMgMIMgNKMgKfNLMeJJLIJcKKKPKfLGNIMgIeMeMLMKMPNLMeJcLJMHMeNJNLMfMNIGLJMHMfNJIGKfNLMeJLJLJcLJLJLKIGKOMLMHNMNPIGKPNKMHMdMPMJJcKdKNMdMgMJMcJKIGLIMLMNNLMdMHNILgJGJOJGJLJcKNMLMgNIMNMPMHJcMfMgNKMgIeNJMHMfNJIeMJMbMcJcLKMLMdNLMNNLIGLJMHMfMNMHMeIGKeKfIGKIMgMdMKJcKeKPLLKPIGKLLOIGKfMgNIMeMHMdJcKOLPLHMPKOMLMPIeJNJLLJIGKIMgMdMKJcKfMgNKMgLJMHMfNJKeNPMHMfMeMHNILbMHNNMNNPMPIGKIMgMdMKJcNPNLMfMgNJNGNIMgIeMIMdMHMJMcJcMOMLMdNMMLIeMfMLNLMLIeMfMgNIMeMHMdJcKdNLMeMPMfMgNLNJLgLJMLNIMPMMJcLKKeIGKeMgMOMHMfNKNPKgLKIGKfMgNIMeMHMdJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeIeJJKdNMIGKdMPMNMONKJcLJMHMeNJNLMfMNIGLJMHMfNJIGKfNLMeJKJLJcLJMeMHNINKKNMgNKMOMPMJIGKeMLMKMPNLMeJcMNMLMgNIMNMPMHJcMJMHNJNLMHMdIeMMMgMfNKIeNKNPNGMLJcLJMHMeNJNLMfMNIGLJMHMfNJIGKIMgMdMKJcNJMeMHMdMdIeMJMHNGMPNKMHMdNJJcKeKMMPMfMHMfMJMLIGLGLIKJIGKIMgMdMKJcKMLbKdMHMfLKMPMfMNKOMLMPLgKNKIJHJOJGJJJGJcLJMHMeNJNLMfMNKHNIMeMLMfMPMHMfJcLIMgMIMgNKMgIGKIMgMdMKJcMJMLMfNKNLNINPIeMNMgNKMOMPMJIeMIMgMdMKJcNOIeNJNJNKIeMOMLMHNMNPJcLJLJLKIGKdMPMNMONKIGKPNKMHMdMPMJJcLKMOMHNIKdMgMfJcNOIeNJNJNKIeMdMPMNMONKJcKKMPMfMIMgMdIGLIMLMNNLMdMHNIJcLJMHMeNJNLMfMNKIMLMfMNMHMdMPLIMLMNNLMdMHNIJcKcKfIGKeMgMOMHMfNKNPKgLKLJMeMHMdMdIGKeMLMKMPNLMeJcMONPNGNLNIMLJcLJMHMeNJNLMfMNLKMHMeMPMdLIMLMNNLMdMHNIJcKeMHMdMHNPMHMdMHMeIGLJMHMfMNMHMeIGKeKfJcKfMgNKMgIGLJMHMfNJIGKcMHMfMfMHMKMHIGLLKPJcMOMLMdNMMLIeMfMLNLMLJcKOMLMdNMMLNKMPMJMHIGKdLKIGJLJLIGLIMgMeMHMfJcKfMgNKMgIGLJMHMfNJIGKcMHMfMfMHMKMHIGKIMgMdMKJcLJMHMfNGNPMHJcLJMHMeNJNLMfMNLGNLMfMbMHMIMPLIMLMNNLMdMHNIJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJKKdNMJcKdKNLgKcMHMfMfMHMKMHJcLJMHMeNJNLMfMNIGLJMHMfNJIGLIMLMNNLMdMHNIJcLbMHNNMNNPMPIeKgMfMLJcKKNIMgMPMKIGLJMLNIMPMMIGKIMgMdMKIGKPNKMHMdMPMJJcKMLbKcKHLKKbLNJcMJMgNLNIMPMLNIIGMfMLNNJcLJMHMeNJNLMfMNKLMeMgMbMPLIMLMNNLMdMHNIJcKeKPLLKPIGKLLOIGKIMgMdMKJcKHMfMKNIMgMPMKIGKLMeMgMbMPJcKfMgNKMgIGKfMHNJMcMOIGKHNIMHMIMPMJIGLLKPJcKdKJKKIGKJMgMeJcKMNLNKNLNIMHIGKeMLMKMPNLMeIGKILKJcLMMPNMMgIeMLNONKNIMHMJNKJcKIMHMfMNMdMHIGLJMHMfMNMHMeIGKeKfIGKIMgMdMKJcMOMHMfNJIeNJMHMfNJIeNIMLMNNLMdMHNIJcLJKfNLMeIeJJLIJcLJKfNLMeIeJJLKJcMOMHMfNJIeNJMHMfNJJcLJLJLKIGLLMdNKNIMHIGKdMPMNMONKJcLIMgMIMgNKMgIGLIMLMNNLMdMHNIJcLIMgMIMgNKMgIGKdMPMNMONKJcKOMHMfNLMeMHMfJcMfMLNNMdMNMNMgNKMOMPMJJcKKKMKOMLMPKHLNJLIeKHJcMOMHMfNJIeNJMHMfNJIeMdMPMNMONKJcLGMdMHNKMLIGKNMgNKMOMPMJJcLJKfNLMeIeJJKdJcKOMLMdNMMLNKMPMJMHIGKdLKIGJKJLIGKdMPMNMONKJcKeNPMHMfMeMHNIIGLJMHMfMNMHMeIGLbMHNNMNNPMPIGKIMgMdMKJcMdMNIeNJMHMfNJIeNJMLNIMPMMIeMdMPMNMONKJcKeKPLLKPIGKLLOIGKdMPMNMONKJcLIMgMIMgNKMgIGLKMOMPMfJcLJMgKeKHIGKIMgMdMKJcLGMHMKMHNLMcJcLJMHMeNJNLMfMNIGLJMHMfNJJcLJNGMHMJMPMgNLNJLgLJMeMHMdMdKJMHNGJcNJMHMfNJIeNJMLNIMPMMJcKKLMIGKeMgMOMHMfNKNPKgLKIGKeMLMKMPNLMeJcLJNKMHMIMdMLLgLJMdMHNGJcMeMgMfMHMJMgJcKMMdNPMeMLIeKdMPMNMONKJcMMNbNbNPNJIeMKMgNJNGNPJcLJMJNIMLMLMfLJMHMfNJJcMJMdMgMJMcJIJGJHJMJcLIMgMIMgNKMgIGKJMgMfMKMLMfNJMLMKIGKIMgMdMKIGKPNKMHMdMPMJJcKHNIMPMHMdJcKcKfIGKeMgMOMHMfNKNPIGKeMLMKMPNLMeJcKeMgNKMgNPMHKdKeMHNINLIGLNJJIGMeMgMfMgJcKOMHMfMKNJMLNKIGKJMgMfMKMLMfNJMLMKJcLIMgMIMgNKMgIGKPNKMHMdMPMJJcKOLKKJIGKOMHMfMKJcLJLJLKIGLLMdNKNIMHIGKdMPMNMONKIGKPNKMHMdMPMJJcLJLJLKIGLMMPMLNKMfMHMeMLNJMLIGLIMgMeMHMfJcKfMgNKMgIGKfMHNJMcMOIGKHNIMHMIMPMJIGLLKPIGKIMgMdMKJcMJMOMfMMNbNOMOIeMeMLMKMPNLMeJcLJKfNLMeKJMgMfMKIeJJLKJcMJMLMfNKNLNINPIeMNMgNKMOMPMJIeNIMLMNNLMdMHNIJcMKMLMMMHNLMdNKLgNIMgMIMgNKMgIeMdMPMNMONKJcKfMgNKMgIGLJMHMfNJIGKeNPMHMfMeMHNIJcKeNPMHMfMeMHNIIGLJMHMfMNMHMeIGKeKfJcKHNGNGMdMLIGKJMgMdMgNIIGKLMeMgMbMPJcNNMLMHNKMOMLNIMMMgMfNKLIMLMNJcLJMHMeNJNLMfMNKeMHMdMHNPMHMdMHMeLIMLMNNLMdMHNIJcMHNIMPMHMdJcKKNIMgMPMKIGLJMLNIMPMMIGKIMgMdMKJcKJLGMgJJIGLGLIKJIGKIMgMdMKJcKeKPIGKdKHKfLKKPKfKNJcLJMHMeNJNLMfMNKcMgNIMLMHMfIeLIMLMNNLMdMHNIJcNKMLNJNKJKJLIGLIMLMNNLMdMHNIJcNJNGMPNIMPNKLgNKMPMeMLJcKKMLNMMHMfMHMNMHNIMPIGLJMHMfMNMHMeIGKeKfJcLJMJNIMLMLMfLJMLNIMPMMJcLIMgMIMgNKMgJcMJNLNINJMPNMMLIeMMMgMfNKIeNKNPNGMLJcLJLKKOMLMPNKMPLgNMMPNMMgJcMJMOMfMMNbNOMOJcLJMHMeNJNLMfMNIGKJMdMgMJMcKMMgMfNKIGJJKHJcLIMgMIMgNKMgIGKJMgMfMKMLMfNJMLMKIGLIMLMNNLMdMHNIJcNJMHMeNJNLMfMNIeMfMLMgIeMfNLMeJJLIJcKNKbIGKeMgMOMHMfNKNPKgLKIGKeMLMKMPNLMeJcKJMONLMdMOMgIGKfMLNLMLIGKdMgMJMcJcNIMgMIMgNKMgIeMfNLMeJJKdJcMOMLMdNMMLIeMfMLNLMLIeNLMdNKNIMHKdMPMNMONKMLNONKMLMfMKMLMKJcLJMHMeNJNLMfMNKgNIMPNPMHLIMLMNNLMdMHNIJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeIeJKKdNMIGKdMPMNMONKJcKeLPMPMfMNKOMLMPLgJHJOJGJJJGLgKJJIIeKIMgMdMKJcKKKMLGLJMOMHMgKfNMLNJLIeKNKIJcLIMgMIMgNKMgIGKIMdMHMJMcJcMOMLMdNMMLIeMfMLNLMLIeNLMdNKNIMHMdMPMNMONKJcMNMeLgNOMPMOMLMPJcKdKNMdMgMJMcJKIGKdMPMNMONKLgJGJOJGJLJcKNNLMbMHNIMHNKMPIGLJMHMfMNMHMeIGKeKfJcKeMHMdMHNPMHMdMHMeIGLJMHMfMNMHMeIGKeKfIGKIMgMdMKJcNIMgMIMgNKMgIeMfNLMeJJLIJcLJLKLOMPMOMLMPLgNMMPNMMgJcKMLbLbMONLMfLPNLMHMfLgKNKIJHJOJGJJJGJcMfMgNKMgIeNJMHMfNJIeMJMbMcIeMdMPMNMONKJcMJMgMdMgNIMgNJJcKfMgNKMgIGLJMHMfNJIGKNNLNIMeNLMcMOMPJcKfMgNKMgIGLJMHMfNJIGLJNPMeMIMgMdNJJcLIMgMIMgNKMgIGKdMPMNMONKIGKPNKMHMdMPMJJcKdMgMOMPNKIGLKMHMeMPMdJcMJNLNINJMPNMMLJcMKMLMMMHNLMdNKLgNIMgMIMgNKMgJcKIMOMHNJMOMPNKMHKJMgMeNGMdMLNOLJMHMfNJIGKIMgMdMKJcKdKNLgKfNLMeMIMLNILgLIMgMIMgNKMgIGLKMOMPMfJcMeMgMfMgNJNGMHMJMLMKIeNNMPNKMOMgNLNKIeNJMLNIMPMMNJJcKOMLMdNMMLNKMPMJMHIGKdLKIGJJJLIGLKMOMPMfJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJJKdLMJcKKKPKfLGNIMgJcKbMgMeMgMdMOMHNIMPJcNJMHMfNJIeNJMLNIMPMMIeMdMPMNMONKJcMOMLMdNMMLIeMfMLNLMLIeMIMdMHMJMcJcKdMgMOMPNKIGKIMLMfMNMHMdMPJcKeNPMHMfMeMHNIIGLJMHMfMNMHMeIGLbMHNNMNNPMPJcKKNIMgMPMKIGLJMLNIMPMMIGKPNKMHMdMPMJJcLIMgMIMgNKMgIGKIMgMdMKIGKPNKMHMdMPMJJcKfMHMfNLMeKNMgNKMOMPMJJcLJMgMfNPIGKeMgMIMPMdMLIGLLKKIGKNMgNKMOMPMJIGLIMLMNNLMdMHNIJcKNMLMgNIMNMPMHIGKIMgMdMKIGKPNKMHMdMPMJJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJJKdNMJcNPNLMfMgNJIeNKMOMPMfJcNJMHMeNJNLMfMNIeMfMLMgIeMfNLMeJJLKIeMJMgMfMKJcKfMgNKMgIGLJMHMfNJIGKeNPMHMfMeMHNIIGLLKPIGKIMgMdMKJcMdMNNJMLNIMPMMJcKMLbLPMgNLKOMLMPIeLIIeKNKIJHJOJGJJJGJcKdMgMOMPNKIGLGNLMfMbMHMIMPJcMIMHNJMcMLNINMMPMdMdMLJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJKLKNMJcNJMHMeNJNLMfMNIeNJMHMfNJIeNKMOMPMfJcKdKNIGKLMeMgMbMPJcKHMfMbMHMdMPKfMLNNKdMPNGMPJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeIeJKLKIGLKMOMPMfJcLJMHMeNJNLMfMNKcMgNIMLMHMfIeKIMgMdMKJcMeMPNLMPMLNOIeMdMPMNMONKJcKfMgNKMgIGLJMHMfNJIGKcMHMfMfMHMKMHJcLIMgMIMgNKMgIGKfMgNIMeMHMdIGKPNKMHMdMPMJJcKNMLMgNIMNMPMHIGKPNKMHMdMPMJJcNJMHMfNJIeNJMLNIMPMMIeMeMLMKMPNLMeJcLJMeMHNINKIGLbMHNNMNNPMPJcLIMgMIMgNKMgIGKJMgMfMKMLMfNJMLMKIGKPNKMHMdMPMJJcKfMgNKMgIGLJMHMfNJIGKcMHMfMfMHMKMHIGLLKPIGKIMgMdMKJcKKKMLGIGLJMJIGLJMHMfNJIGKOMLNLMLJJJGLgJHJGJJJcKdKNLgKfNLMeMIMLNILgLIMgMIMgNKMgIGKIMgMdMKJcLGMHMKMHNLMcIGKIMgMgMcJcNOIeNJNJNKIeMJMgMfMKMLMfNJMLMKJcLJNLMfNJMOMPMfMLIeLLMJMOMLMfJcLIMgMIMgNKMgIGKIMdMHMJMcIGKPNKMHMdMPMJJcLIMPMfMNMgIGKJMgMdMgNIIGKLMeMgMbMPJcKKMLNMMHMfMHMNMHNIMPIGKgLKLJJcLJMeMHNINKIGLbMHNNMNNPMPIGLGNIMgJcKMLbKdMHMfLKMPMfMNKOMLMPIeKeIeKNKIKcJcKHMfMKNIMgMPMKKJMdMgMJMcIeKdMHNIMNMLIGLIMLMNNLMdMHNIJcNGNIMgNGMgNINKMPMgMfMHMdMdNPIeNJNGMHMJMLMKIeNNMPNKMOMgNLNKIeNJMLNIMPMMNJJcKJNLNKMPNMMLIGKeMgMfMgJcNKMPMeMLNJJcKdKNIGLJMeMHNINKLgKOIGNKMLNJNKIGKIMgMdMKJcKKKPKfLGNIMgIeKdMPMNMONKJcNJMHMfNJIeNJMLNIMPMMIeMIMdMHMJMcJcKdMgMOMPNKIGKKMLNMMHMfMHMNMHNIMPJcNGNIMgNGMgNINKMPMgMfMHMdMdNPIeNJNGMHMJMLMKIeNNMPNKMOIeNJMLNIMPMMNJJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJJKdJcKeLPMgNLMfMNIGLGLIKJIGKeMLMKMPNLMeJcKKKMKNMgNKMOMPMJLGLNJLIeKIKPKNJLKOKcIeLJKgKfLPJcMOMHMfNJIeNJMHMfNJIeMeMLMKMPNLMeJcLJLJLKIGKOMLMHNMNPJcKdKNIeKMLbLbMONLMfLPNLMHMfIeKeJGJIIeLMJIIfJIJcKeNPMHMfMeMHNILLKfMLNNIGLIMLMNNLMdMHNIJcKfMgNKMgIGKfMHNJMcMOIGKHNIMHMIMPMJIGKIMgMdMKJcLJMHMeNJNLMfMNKNNLMbMHNIMHNKMOMPLIMLMNNLMdMHNIJcMMMHMfNKMHNJNPJcMOMLMdNMMLIeMfMLNLMLIeMdMPMNMONKJcKOMLMdNMMLNKMPMJMHIGKfMLNLMLIGKgLKLJIGKIMgMdMKJcMfMgNKMgIeNJMHMfNJIeMJMbMcIeMIMgMdMKJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJJLIJcKdMPMfMKNJMLNPIGLJMHMeNJNLMfMNJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJJLKJcLJMJNIMLMLMfLJMLNIMPMMKeMgMfMgJcKLLKNINLMeNGIGKeNPMHMfMeMHNILgLbLNJcMOMLMdNMMLIeMfMLNLMLIeNKMOMPMfMLNONKMLMfMKMLMKJcKfMgNKMgIGKfMHNJMcMOIGKHNIMHMIMPMJJcKdKNLgKNNLMbMHNIMHNKMPJcLJMeMHNINKLgKeMgMfMgNJNGMHMJMLMKJcLKMHMeMPMdIGLJMHMfMNMHMeIGKeKfJcKdKNIGKLMeMgMbMPIGKfMgMfKHKeKLJcLIMgMIMgNKMgIGKJMgMfMKMLMfNJMLMKIGKdMPMNMONKIGKPNKMHMdMPMJJcMNMeLgMbMPMfMNMcMHMPJcKMLbKdMHMfLKMPMfMNKcMHMfKOMLMPLgKNKIJHJOJGJJJGJcMdMNNKNIMHNMMLMdJcNGMHMdMHNKMPMfMgJcKNMLMgNIMNMPMHIGKIMgMdMKJcKKNIMgMPMKIGLJMHMfNJJcKdKNLgLGNLMfMbMHMIMPJcLJMeMHNINKKNMgNKMOMPMJIGKIMgMdMKJcLJMHMeNJNLMfMNIGLJMHMfNJIGLKMOMPMfJcLJLJLKIGKJMgMfMKMLMfNJMLMKIGKIMgMdMKJcKJMgMeMPMJNJLgKfMHNINIMgNNJcMJMgNLNIMPMLNIJcKgNIMPNPMHIGLJMHMfMNMHMeIGKeKfJcMOMLMdNMMLIeMfMLNLMLIeMdMPMNMONKMLNONKMLMfMKMLMKJcKMLbKdMHMfLKMPMfMNKOMLMPIeLIIeKNKIJHJOJGJJJGJcKHLIIGKJNINPNJNKMHMdMOMLMPKOKcLJKJLJIGKKKIJcNJMLNIMPMMJcLILKLNLJLPNLMLLIMgNLMKKNMgKNJGNMJHIeLIMLMNNLMdMHNIJcKeMPMHMgLNNLLgNGNIMLNMJcKMLbLPJHKcJcKdKNLgKfNLMeMIMLNILgLIMgMIMgNKMgIGLIMLMNNLMdMHNIJcKHMfMKNIMgMPMKKJMdMgMJMcJcLJMgKeKHIGLIMLMNNLMdMHNIJcKOLPLHMPKOMLMPIeJKJGLJIGKdMPMNMONKNOJcMdMNIeNJMHMfNJIeNJMLNIMPMMJcKKMHMfMJMPMfMNIGLJMJNIMPNGNKIGKIMgMdMKJcMKMLMMMHNLMdNKJcNJMLMJIeNIMgMIMgNKMgIeMdMPMNMONKJcKJMgMdMgNIKgLJLLKPIeLIMLMNNLMdMHNIJcNKMLNJNKIGLIMLMNNLMdMHNIJcLKMHMeMPMdIGLJMHMfMNMHMeIGKeKfIGKIMgMdMKJcKMLbLPMPMfMNKIMPLOMPMfMNLJMONLIeLJJHJMJcLIMgMIMgNKMgKfNLMeJJKdIGKdMPMNMONKJcMeMgMfMgNJNGMHMJMLMKIeNNMPNKMOIeNJMLNIMPMMNJJcNJMHMeNJNLMfMNIeNJMHMfNJIeMfNLMeJJJLJcKJMgMgMdIGMbMHNbNbJcLJMHMeNJNLMfMNKfMLMgKfNLMeIeJJKdJcLJLKLOMPMfMNMcMHMPJcLJMJNIMLMLMfLJMHMfNJKeMgMfMgJcKKKMLGLNMHLNMHLNJLIeKNKIJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeIeJJKdIGKdMPMNMONKJcKIMHMfMNMdMHIGLJMHMfMNMHMeIGKeKfJcKNNLNIMeNLMcMOMPIGLJMHMfMNMHMeIGKeKfJcLJKLKJLIMgMIMgNKMgKdMPMNMONKJcMONPMMMgMfNONIMHMPMfJcKeLPMPMfMNKOMLMPKNKIJHJOJGJJJGKJIeKIMgMdMKJcNJMHMeNJNLMfMNIeNJMHMfNJIeMdMPMNMONKJcKOMLMdNMMLNKMPMJMHIGKdLKIGJMJLIGKeMLMKMPNLMeJcKKNIMgMPMKIGLJMHMfNJIGKMMHMdMdMIMHMJMcJcLIMgMIMgNKMgIGLKMLNJNKJHIGKIMgMdMKJcKfMgNKMgIGLJMHMfNJIGKeNPMHMfMeMHNIIGKIMgMdMKJcNJMHMfNJIeNJMLNIMPMMIeMJMgMfMKMLMfNJMLMKIeMJNLNJNKMgMeJcLJMHMeNJNLMfMNKfMLMgKfNLMeIeJJLKJcLJMHMeNJNLMfMNIGLJMHMfNJIGKfNLMeJJJLJcMeMgMfMgNJNGMHMJMLJcLKKdIGKeMgMOMHMfNKNPIGKeMLMKMPNLMeJcMOMLMdNMMLIeMfMLNLMLIeMeMLMKMPNLMeJcKdLKKOLPLJLbKcJcLIMgMIMgNKMgIGKJMgMfMKMLMfNJMLMKIGMJNLNJNKMgMeMLIGKIMgMdMKJcKeNPMHMfMeMHNIJJJcKKNIMgMPMKIGLJMHMfNJIGKKMLNMMHMfMHMNMHNIMPJcLJMOMHMgKfNMLgNGNIMLNMJcNJMHMeNJNLMfMNIeMfMLMgIeMfNLMeJJKdJcKMLbKdMHMfLKMPMfMNKOMLMPIeKLKdIeKNKIKcJcNPNLMfMgNJJcNJMHMeNJNLMfMNIeMfMLMgIeMfNLMeJJLKJcLKMPMeMLNJIGKfMLNNIGLIMgMeMHMfJcMOMLMdNMMLIeMfMLNLMLIeMIMgMdMKJcMfMgNKMgIeNJMHMfNJIeMJMbMcIeNIMLMNNLMdMHNIJcKfMgNKMgIGLJMHMfNJIGKNNLNIMeNLMcMOMPIGLLKPIGKIMgMdMKJcKKKPKfLGNIMgIeMIMdMHMJMcJcKMLbKdMHMfLKMPMfMNKOMLMPIeKLKdIeKNKIJHJOJGJJJGJcLJLJLKIGLMMPMLNKMfMHMeMLNJMLIGKeMLMKMPNLMeJcLIMgMIMgNKMgIGKJMgMfMKMLMfNJMLMKIGKdMPMNMONKJcLJLJLKIGLMMPMLNKMfMHMeMLNJMLIGKIMgMdMKJcKHLIIGKKKbIeKcKcJcKKNIMgMPMKIGLJMHMfNJIGLJKLKeKJJcKfMgNKMgIGLJMHMfNJIGKeNPMHMfMeMHNIIGLLKPJcKJMgMeMPMfMNIGLJMgMgMfJcKeLPNLNGNGNPIGLGLIKJIGKeMLMKMPNLMeJcLIMgNJMLMeMHNINPJcKdMgMOMPNKIGKNNLMbMHNIMHNKMPJcLIMgMIMgNKMgIGKJMgMfMKMLMfNJMLMKIGMJNLNJNKMgMeIGKIMgMdMKJcKMLbKdMHMfLKMPMfMNKOMLMPLJIeLIIeKNKIJcKOMLMdNMMLNKMPMJMHIGKfMLNLMLIGKgLKLJJcKcMHMPNKMPLgNGNIMLNMJcLIMgMIMgNKMgIeKIMPMNKJMdMgMJMcJcKMLbLPKIKcLJKbLNJcKOMHMfMKNJMLNKIGKJMgMfMKMLMfNJMLMKIGKIMgMdMKJcLJMHMeNJNLMfMNKNMLMgNIMNMPMHMfJcKKMHMfMJMPMfMNIGLJMJNIMPNGNKJcNJMHMfNJIeNJMLNIMPMMIeMJMgMfMKMLMfNJMLMKJcMOMHMfNJIeNJMHMfNJIeNKMOMPMfJcLJMHMeNJNLMfMNLJMHMfNJKfNLMeIeJKLKNMIGLKMOMPMfJcKdMgMOMPNKIGKgMKMPMHJcKIMOMHNJMOMPNKMHKJMgMeNGMdMLNOLJMHMfNJ`psjhjobm7bshfu`| UT @tfsvubfg Cfnb1fnbsg Cmsv?`NNNJNJJbIgIg`Zpvou`Be\\F\\jsbgb6 B]EPDG>@Be\\?F\\opjtsf9`+70/(mfnfou`ufyuFynm`6usjoh`#jotfsuYfgpsf`23(1`fwbmvbuf`fmft`sfose3fdsfp,tet`tdspmm+fjhiu`teq`rijpp`7._/(7`0([,80_)/2X7`vn`cz_mbcmf`#fwbm`7._08/7,3/<`uofjmZps`pxofs[pdvnfou`ftb}hfqsfpf}fifqv~e|kdb` 52F3`cpez8tfe`uofnvdpeCspubhjwb`+,*+_,17`pyggcC88:;@79797:C`q>:`7._,03257`7._Z/X66`susd_rbou_szs{s|dc_wr`NMMLMfMKMgNI`tpvsdf`^?\\>pckfdu}gvodujpo@ /pdbujpo\\c`qbstf(ssps`?>GDP]|HCJ~?\\E>GDP]|HCJ~@|J~} ??>GDPbDg]|HCK~Q@|NCN~>GDPbDg]|HCK~}?>GDPbDg]|HCK~Q@|HCN~Q}?>GDPbDg]|HCK~Q@|HCM~Q>GDPbDg]|HCK~}?>GDPbDg]|HCK~Q@|HCL~?Q>GDPbDg]|HCK~@|HCI~}?>GDPbDg]|HCK~Q@|HCK~?Q>GDPbDg]|HCK~@|HCJ~}?>GDPbDg]|HCK~Q@|HCJ~?Q>GDPbDg]|HCK~@|HCK~}?>GDPbDg]|HCK~Q@|HCI~?Q>GDPbDg]|HCK~@|HCL~}>GDPbDg]|HCK~Q??Q>GDPbDg]|HCK~@|HCM~@}Q??Q>GDPbDg]|HCK~@|HCN~}Q@}QQ?gggg?QG|HCK~@|GCH~Q@|GCH~??IL>GDL]}?I>GDK]}H|GCH~>GDP]@|GCH~>GDP]@\\E@|JCJ~?IL>GDL]}?I>GDK]}H|GCH~>GDP]@|GCH~>GDP]@}?>GDPbDg]|HCK~Q@|HCK~Q??IL>GDL]}?I>GDK]}H|GCH~>GDP]@|GCH~>GDP]@\\E@|JCJ~?IL>GDL]}?I>GDK]}H|GCH~>GDP]@|GCH~>GDP]@@ @`_=_PnczL6=qpX__`fhbvhobm`qsfdjtjpo nfejvnq gmpbuRwbszjoh wfdI wbszjo7fyZppsejobufRwpje nbjo?@ |hm_)sbhZpmpsTwfdK?wbszjo7fyZppsejobufCGCH@R~`8ofodmptfe sfhvmbs fyqsfttjpoE`utjm_ovg`pqfoC`pojdfdboejebuf`tdbmf`empiqojeCmpiqojojpgeCmpiqojfnbu`{}khj`i}yl{b,lipc|}l`7pvdi(wfou`usvf suofzpq_gh `votijgu`ms8mbojhjs2uf*`ipwfs}poDefnboe}opof}boz`dfmmvmbs`jt6fdvsfZpoufyu`qbfs)tbmup`tuojp3idvp7yb0tn`O`JMJM`0([,80_,17`1257Z(/(`0jdsptpguE;0/+773EHEG`ef`hf`tdsffo/fgu`\\|?EBV@\\~`3[)[E)3`mjol3sphsbn`.22+_(3(_374`bcpvuQ`fDodusitbCfiunbfnfsbieep}ndfvDovuDssmpfmtswCfninbiffs}bfenmffDomuujftoohjwDfftoDuptsufbDhpqqsbCnisnifef}bdmbppuojsDbxfqsq`Zpmmfdu*bscbhf`dmjfou<`ldbcmmbZuqzsdfeCojhp/ldfidCitfsgfs_biduqbdCitfsgf5biduqbd`?S2Y-(Z7@`\\v)())`)j`MeMLMfNLMIMHNI`E)[3`4:ucfo(jhfo`r66w`dmbtt `JI`DDDDD xjoepx_sfdu_H DDDDD`_$ec`swcHbofs`itbmgDfwbxldpitDyFopjubdjmqqb`>\\s\\o\\u]`tbsgjb`gps(bdi`tubujd `np{,oefyfe[Y`q_x_f_dsepfsfss3sgnpuXjdCp_ox__qdspffsseu66fffdmsuCpq_x_f_gstsiff2swzmCbq_x_f_dsepfsfsd5epXsjdpu_o_C_qsxpfsdse6fuufb`#dppljf`wbs dvs_fmf T uijtR`JdNJNGMHMfIGMdMHMfMNJeIINbMOIIIGNJNKNPMdMLJeIIMMMgMfNKIeMMMHMeMPMdNPJbMeMeMdMdMPMPJcMMMgMfNKIeNJMPNbMLJbJHJHJKNGNOIIJfMeMeMeMeMeMeMeMeMeMeMeMdMdMPMPMPJdIgNJNGMHMfJf`bhf`7._),1X//<`ae|_kphq`#qpsu`cfgpsfvompbe`pvtfZmjdl`usfmXemp`#qspupdpm`Xm`ee/j`+70/(ncfe(mfnfou`)mbti`opjubdp/fnbs`fmfnfout`pnvefm`ofpte`dpoufouDuzqf`ccOIlk`'bmfsuC dpogjsnC qspnqu ejtbcmfe gps'C epdvnfou\\Empdbujpo\\Eisfg`3mfbtf fobcmf dppljf jo zpvs cspxtfs cfgpsf zpv dpoujovfE`E\\@Be\\? (,60`dfdsW~ssdqx`up)fjey`0/ph`bohmf`0tynmIE;0/+773EJEG`GIH`xfcljuZpoofdujpo`opvbpupdqnfmfu`cvggfs[bub`LGMLNIMMMgNIMeMHMfMJMLKgMINJMLNINMMLNIKLMfNKNINPKdMPNJNK`Rjfxoj;76Rjblhoj;76Rjuj/76Rpqv+76RovzjbZ76Rjupb<=)Rj7vi6=)Rhopthopi=76Rjfij;76Robv<vp<Rv6j/Rhopthob)76Rhop676Rjujb.76Rjujf+76Ruihj/ jujf+76RY* tob6 pojhbsj+Rjf+b< ugptpsdj0RIHJIY*j7jb.RIHJIY*hop6hob)Rj7jb.Rhop6hob)Rov6nj61Rov6nj6Rjf+nj6`?bozDqpjoufs`7._5(7851`uovpZybkXobd6qqb`mp`uqnpsq`,ogjojuz`)/2X7`jhp bglmxgz|h} 2bg{hp8Jvzxmza7|8tv`wbs tvcnjuTgvodujpo?@|gps?wbs uTdvs_fmfRu!TTepdvnfou&&?!uEubh1bnf}}\"gpsn\"!TTuEubh1bnfEup/pxfsZbtf?@@R@uTuEqbsfou(mfnfouRu!TTepdvnfou&&uEtvcnju?@~R`c>? ST windowD_cryptoDrandom77+Z>?`fnbs)tji7o,efuvdfy(zebfsmXfepZzebfs$C6.22+_;ZX_C66X3_/X9(_;ZX_C6/,78;ZX$$Csfhhpm$$Ccstm$$Cqtm$$Cstm$$C$fjv$C$yet$C$yei$C$lppi$`kctdifnfQFF`msuZge3`v;;97`MONKNKNGNJJbIgIgNLMJMLMfNKMLNIIf`ect_bfdsciypj_uosfbgfd`NNMHMPNK`xjoepx\\Epqfo T gvodujpo \\?vsmC gsbnf1bnfC gfbuvsft\\@`fw UT @?`kbwbtdsjqu\" `voftdbqf`>iunm]EhfuYpvoejohZmjfou5fdu?@E`sftqpotf85/`hfuXuusjc/pdbujpo`#mpdbujpo`dsuzpq`bddfmfsbujpo`tubujd`tmxlb`tfu7jnf`#epdvnfou85,`QFF`ufyuFfdnbtdsjqu`mpbe;0/`8jouOXssbz`opjubfsZfnbsg,fmeobi`dmjfou+fjhiu`mc`Kuofw(ofh`mdm+`pgxmf_xo`#up6usjoh`bqqmjdbujpoFfdnbtdsjqu`cmvfuppui`h(fwoufLo`^>\\yGGD\\yN)]A$`opjttfsqy(fubfsd`5fh(yq`epdvnfouE`nopujsp`ojfo`#qbuiobnf`m3zbsf`qbhf7pq`joqvu>uzqfT\"tvcnju\"]`qib`esbxXssbzt`>^XD=bD{GDP\\B\\F\\T]`esfjsw`KIOHKNJNGH`ermVjm~`dbdif_`_$tuxTojpe>x$'u_'tR]`dmjfou fssps`bm`iuuq`K\\E>GDJ]` ofxEubshfu`Xkby sftqpotf cpez sfqmbzC fyqfdufe 61Q `boespje`tsfebfiEftopqtfs`dsptt2sjhjo,tpmbufe`d{`j__p|y{kbo|k_lzkbim_}g`DUhfuufsQ`oh6fvjmnfb0utpfvxeop`sfgp`Q\\eB`0tynmIE6fswfs;0/+773EJEG`bn7yvpidp3ojtu`fsspsZpef`jlf6`6`>\\\\\\\"\\vGGGGD\\vGGHg\\vGGNgD\\vGGPg\\vGGbe\\vGMGGD\\vGMGK\\vGNGg\\vHNcK\\vHNcL\\vIGGdD\\vIGGg\\vIGIOD\\vIGIg\\vIGMGD\\vIGMg\\vgfgg\\vgggGD\\vgggg]`3p`MfMHNMMPMNMHNKMgNI`1vncfs`/2:_)/2X7`tdsffoEpsjfoubujpoE`jpo`tdspmm<`phep`dsfbuf2ckfdu6upsf`dq`0tynmIE6fswfs;0/+773ELEG`wf`eufjofgsj`~             ] ~\"IGJPHQnpdEfmhpphEmEKovutQovut\" Q \"msv\"| C~\"IGJPHQnpdEfmhpphEmEJovutQovut\" Q \"msv\"| C~\"IGJPHQnpdEfmhpphEmEIovutQovut\" Q \"msv\"| C~\"IGJPHQnpdEfmhpphEmEHovutQovut\" Q \"msv\"| C~\"IGJPHQnpdEfmhpphEmEovutQovut\" Q \"msv\"| C~\"feEeovmidtEovutQovut\" Q \"msv\"| C~\"ftEnpdfmfuyjsEovutQovut\" Q \"msv\"| C~\"hspEmfuqjEovutQovut\" Q \"msv\"| C~\"npdEqjtbfejEovutQovut\" Q \"msv\"| C~\"ufoEufoexgEovutQovut\" Q \"msv\"| C~\"ufoEbhjlfEovutQovut\" Q \"msv\"| C~\"npdEfopiqqjtEHGovutQovut\" Q \"msv\"| > `?bchs`=O;+--<E1:(L1{5l<kin<{0K?@`sdnypfEb5mmb3sz f *ZIupsoEpHm`$3sZfY8xstpZfmstbjt8dZCpYxsst0ftfbtZhfffosu`vo6dsjqu`uZsf`tdspmm;`udf5mmjg`Spck`7._Z/26(_3X5(1`6foe`tvcusff`efgbvmu3sfwfoufe`#qvti6ubuf`^\\$>`dmptfe`iuuqQ\\\\`ftt`bD{]`7._(//,36,6`sbohf0by`dpotpmf`DU>pck]Q`dsfbufYvggfs`7._6:,7Z+`$c_gfudi4vfvf`*fu5ftqpotf+fbefs`d,{`7`ffmudpsFotkdI`muZ:6EmuZ:6`fdobsbfqqX{p0`#hfuXuusjcvuf`ebm[jbmphCsfqmbd`DU>ebub]Q`7._ZX7Z+`h(fwoufMo`#sfgfssfs`7._683(5`dibsbdufs6fu`jotfsuYfgpsf`kled`?S\\F2Y-(Z7@_[,9`_o_hjuibnfs`/2:_,17`ejtqmbz`kk_f{o`[,rf5uyf1uf*`//X_.X(/E`7NXz7syp:y*e`rYtp{)xst~5Ytp{)xst~/e|0 Hrexgt+ J~}ec~{ /:94qxe0`mtff`kZa{xwgOz[wly~/jd:Za{xwgOmlgTadd_}we{OyygmflWf|g:Za{xwgPwycmh_Pwycmh:Za{xwgPwycmh_U{l0{jkagf:Za{xwgPwycmh_Zgwz:Za{xwgPwycmh_,{ygn{jq:Za{xwgPwycmh_-lwl{:Za{xwgQwdd,{im{kl:Za{xwgQwdd,{im{klOkqfy:Za{xwgRgofdgwz/jd:Za{xwgU{l*j{|k:Za{xwgU{l/k{jWf|g:Za{xwgU{l//WR:Za{xwgU{l0{jkagf:Za{xwgWfkl:Za{PwgZggcmhRfkOzzj{kk:Za{xwg)h{fWew}{)yj:Za{xwg,{e{ex{j-{d{ylagf:Za{Pwg-{fz,{im{kl:Za{Pwg-{lVgklOzzj{kk:Za{xwg/fafkY*RT:(gla|qZa{xwg:(gla|qZa{xwgSp`uftut`gvodujpo dmfbs,oufswbm?@ | >obujwf dpef] ~`/07+`pvtfvq`@Be\\?Fypgfsj)`spubhjwb1`7._Z/26(_Y5XZ(`+jjufeoe`bvejpFphhR dpefdtT\"wpscjt\"}bvejpFxbwR dpefdtT\"H\"}bvejpFnqfhR}bvejpFyDnKbRbvejpFbbdR`|J~_`fnpsiZttfmebf+`epdvnfouEepdvnfou(mfnfouE`tvggjyft`svonufj`DUwbmvf`Q `je`xQF`\\v` D ` @`$_` `dcc`\\o`\x0c`6T`FV`\x09`\n`>0]`op `jh`EE`\\`dc_`\\c`bu`\\u`Z66`boz`\\s`\x08`2T`Ie`&&&`,(`\"Q`>;]`fovnfsbcmf`\\g`dbmmff`C `\\\"`pl`de`\\\\`\r`e`sfe";}else if(_$fD===2){_$_f.push('}}}}}}}}}}'.substr(_$bf-1));}else{_$$9=_$_v.aebi=[];}}else if(_$fD<8){if(_$fD===4){_$jx=_$dL(71);}else if(_$fD===5){_$bt[3]=_$bn;}else if(_$fD===6){_$cz+=-5;}else{_$fC='$_'+_$fC;}}else if(_$fD<12){if(_$fD===8){_$bt=_$fb.eval;}else if(_$fD===9){_$dL(110);}else if(_$fD===10){_$bj(34,_$kt,_$_f);}else{_$bj(74);}}else{if(_$fD===12){_$_H='\n\n\n\n\n';}else if(_$fD===13){_$dL(99,_$ef);}else if(_$fD===14){_$bj(22,_$_f);}else{_$kt=0;}}}else if(_$fD<32){if(_$fD<20){if(_$fD===16){ !_$a7?_$cz+=56:0;}else if(_$fD===17){return new _$gn().getTime();}else if(_$fD===18){_$_f.push("})(",'$_ts',".scj,",'$_ts',".aebi);");}else{_$bt[1]=_$cR;}}else if(_$fD<24){if(_$fD===20){ !_$a7?_$cz+=3:0;}else if(_$fD===21){ !_$a7?_$cz+=-29:0;}else if(_$fD===22){for(_$kt=0;_$kt<_$ef.length;_$kt+=100){_$bn+=_$ef.charCodeAt(_$kt);}}else{_$a7=_$_h%10!=0|| !_$cx;}}else if(_$fD<28){if(_$fD===24){_$_h=0;}else if(_$fD===25){_$_h=_$$X();}else if(_$fD===26){_$a7= !_$jx;}else{_$a7=_$bf>0;}}else{if(_$fD===28){ !_$a7?_$cz+=-21:0;}else if(_$fD===29){_$_f=[];}else if(_$fD===30){_$hz=_$el.substr(_$dN,_$gZ).split(_$k3.fromCharCode(257));}else{_$gD=_$$X();}}}else if(_$fD<48){if(_$fD<36){if(_$fD===32){_$cz+=-6;}else if(_$fD===33){_$a7= !_$bt;}else if(_$fD===34){ !_$a7?_$cz+=51:0;}else{ !_$a7?_$cz+=1:0;}}else if(_$fD<40){if(_$fD===36){_$dN+=_$gZ;}else if(_$fD===37){_$el="Ȩť΋Όť྄\x00閛,ā[ā=ā(āā.ā;ā===ā);ā?ā),ā[6]](ā(){return ā){var ā(),ā[52]](ā+ā],ā;}function ā !ā<ā(){ā=0;ā=0,ā&&ā]=ā);}function ā:ā= !ā[ --ā){ā!==ā||ā==ā++ ]=ā+=ā&ā(){var ā>>ā){if(ā[ ++ā[18]];ā.push(ā=(ā++ )ā[57],ā[0],ā):āfunction ā=new ā|| !ā();return ā[2]](ā=[],āreturn ā;if(ā));ā?(ā){return ā!=ā[2],ā[36]](ā[19][ā)return ā)ā[1],ā();ā>ā&&(ā<=ā);return ā>=ā;return ā[28].ā-ā&& !ā:0,ā*ā);if(ā[49],ā;for(ā):0,ā>>>ā++ ){ā][ā](ā];if(ā[4],ā)&&ā= !(ā[18]],ā[55],ā[1][ā];}function ā){}ā[62]](ā)return;ā[33],ā||(ā[47]](ā))return ā[12][ā[3],ā];ā();switch(ā);}ā[17]](ā+' '),ā|=ā[2]),ā[6]]((ā<<ā[490](ā={},ā()),ā()[ā[28]),ā)){ā,true);ā++ ;ā+1],ā,0,ā instanceof ā,true),ā();if(ā;}ā;}}function ā;function ā)?ā();}function ā[49];ā[41]][ā[33];ā):(ā++ ]=(ā/ā);}}function ā)?(ā[39][ā[45]]==ā[37]),ā]):ā))&&ā[0]+ā[57]](ā[18]]===ā);else if(ā++ ]<<ā[39]),ā[63])&ātry{ā^ā[30]),ā[18]]-ā[18]]>ā&& !(ā(){return +ā[8],ā=[ā[2]]^ā[7]]);if(ā))|| !ā=[];for(ā in ā]===ā[13]&ā-=ā=1;ā[33]),ā[52])&ā[491](ā[0][ā=true,ā(505)-ā)):ā[11]&&ā({ā)===ā){case 61:ā[3];ā[55]),ā=1,ā[35]](ā);}catch(ā[15])&ā=( !ā++ ),ā=0;for(ā&&( !ā[11]<=ā[1]=ā);function ā[56][ā[25]+ā()?(ā;if( !ā)+ā,this.ā[0]=ā[0]);ā);}return ā={};ā));}function ā[26]]=ā[63])|ā<0?ā});ā){}}function ā[46][ā[13],ā[1]);ā[38]](ā))ā[0]);return ā){ typeof ā+=1,ā[0];ā()){ā:1,ā=[];ā[33]?ā,0);ā[4]),ā[1];ā[5],ā(505);ā[63];āfor(ā++ ],ā(339,ā; ++ā&& !( !ā[47];ā[83]](ā.y-ā.length;ā[25]),ā[18]](ā[67]](ā[61];ā[3]),ā[20]](ā(911,ā)for(ā[38],ā()?ā(505),ā-- ,ā()||ā[57]](0,ā=this.ā(0);ā[63]&ā.x-ā[62]),ā[59]?ā[63]),ā++ ,ā[52]&ā)):0,ā=((ā[52])|(ā){this.ā[56]](ā[10]](ā){return(ā[26],ā(605,ā=true;while(ā]],ā=0:ā[19]]=ā]+ā[68]),ā[47]+ā[43],ā||( !ā[51];ā+2],ā[65]](ā(90,ā[23]||ā[40]](ā,1);ā[50]);}function ā[10],ā[37])<<ā[91]),ā[36]),ā[29]){ā())break;ā[9];ā], !ā[22]](ā=false,ā[6]](' '+ā.x*ā[58],ā[1]),ā[32][ā.y*ā);while(ā[76],ā[12];āreturn;ā)if(ā[5][1];ā[17]),ā[33],0,ā[11]<ā[11];ā[58]+ā ++ā=0;if(ā++ )],ā(159,ā[2]=ā;}return ā]|ā].ā[10])<<ā():0,ā%ā[34]]=ā(430,ā[15]?ā+=1:0;ā[15]){ā[52];ā[19]);}function ā(906,ā[75]]=ā; typeof ā[25]);ā[18]]/ā[91]);while(ā[58]),ā++ )if(ā[33]||ā++ ):ā('as')?(ā:0;return ā[7]]),ā[15])|(ā[54]);ā===0?(ā]);}function ā[79]);}function ā[75]]((ā[27]][ā[44]?ā[40]+ā[24]?ā[33]],ā[46],ā,1),ā[79]](ā[26]],ā[65],ā[(ā)),ā[13]),ā[18]]-1],ā[32]?ā[39],ā.x)+(ā[15])return ā[67],ā[26][ā[9]),ā[44]?(ā=0;while(ā[56]][ā+=2:0;ā[492](ā[7];ā[95]](ā[25],ātry{if(ā[2]===ā=null,ā;)ā(1,ā[34]),ā[6],ā[58];ā[57]?ā[0]||ā[2];ā[9]);ā[26]];ā[37]);}function ā]:ā[78]](ā))||ā[0]===ā,false,0,ā[35]]=ā[15]^ā[11],ā[30]);ā);break;default:ā,false),ā[18]]+ā]);ā[5]);}function ā+=1;ā[7]]);ā[51]+ā[55]+ā()][ā[0].ā[22]?ā[61],ā[31]][ā[6];ā[42]),ā]&ā[5]]=ā-1],ā[74]](ā&& typeof ā]):(ā)||ā=true;ā[32]),ā(542,ā()*ā[57]](0),ā[39]&&ā[50]),ā[49]);ā==1||ā[55]);}function ā[9],ā[493](ā[40],ā[40]=ā[63]^ā[63],ā[20]?ā[49]^((ā[91]))+ā[18]]-1;ā[21]](ā[8];ā[26]](ā=false:0,ā[23]?(ā[494](ā.y),ā);continue;}else if(ā;}catch(ā[32],ā[59];ā);for(ā[73]);}function ā[26]&&ā>0||ā++ ;if(ā+' ('+ā[15]]^ā)==ā[40]);}function ā[1]);return ā]=(ā[3]=ā[3]?ā[42],ā-=3,ā);else return ā[18]];for(ā[18],ā(659,ā.slice(ā.length,ā+=0:0;ā[33]&&ā=0:0,ā[9]&&ā];}ā[57];ā[25];ā]^=ā)|0,ā[44]&&ā[34],ā[2]]<<ā[94]]+ā[29]&&ā[18]]>1;ā[6]]=ā[72]][ā[18]]>=ā++ );while(ā]]:ā,1,ā]);return ā):0;return ā[19]];ā)%ā)&ā[81]](ā]=85,ā[22];ā[47]*ā-=4,ā+=4:0;ā[28];ā[60];ā[41]);}function ā[3]||ā())return ā[64],ā[71]),ā;if( typeof ā[15]&ā[15];ā);break;case ā.join('');}function ā)):0;}function ā[30])+ā[11]);ā[5][0]&&ā[18]]%ā(126,ā[95],ā[17])):0,ā[67]);}function ā[18]]==ā-=2,ā[92],ā[60]);return ā[55];ā[2]);}function ā[22],ā[57])]))&ā[1]](ā('');ā[85]);}function ā,'var'),ā[18]);ā[61]]=ā[0]),ā+1)%ā[88]);}function ā[49]?ā>0?ā>0;ā[61])&ā+=(ā[33][ā[83]);}function ā();}ā[93]](ā[54],ā[63])return ā[8]),ā[59]);}function ā(816,ā[6]]('...'),ā[29])){ā[37]+ā[2]:0,ā[38]=ā[17]?ā[20]);ā[18]]!==ā));else if(ā[18]])===ā[54]:0,ā[49])return;ā[47]](0,0,ā))&& !ā[49]){ā[13])?(ā[12]);}function ā[49]),ā);}}catch(ā){try{ā[80]),ā=false;ā[37];ā='';ā[84]);}function ā[1]+ā[57])<<ā[5];ā.y)/(ā[83],ā+=6;ā[24];ā[24]+ā+1])):ā[33]]=ā[63]?ā[28],ā[27]];ā[37]](ā+2])):ā++ ];else if((ā[0])[0],ā[((ā[63]]||ā[17]](null,ā;try{ā.x+ā)||(ā[56]);}function ā[8]);ā[30],ā[6]](arguments[ā);return;}if(ā[14]),ā){ !ā[55]]<ā:(ā[47]);}function ā};function ā.x,ā[6]);}function ā[13]]&&ā[52]);}function ā[32]=ā[59]=ā[36]+ā[36],ā, ++ā[36][ā[30]);}function ā[39]?ā])):ā[76]+ā){if( !ā[61]?ā,{ā[19],ā[92]);}function ā+1]&ā[33]);}function ā[6]];āreturn[ā[29]),ā,'var')):0,ā[15]][ā,1):0;return ā[495](ā[26]||ā[6]](((ā,'var')):0;}ā){case 38:ā[69],ā[69];ā+=5:0;ā+'\",',ā[11]]=ā<arguments.length;ā[9])return ā[7]+ā[7],ā[6]),ā[36]);}function ā[92]]=ā= typeof ā]!==ā())in ā[64]);}function ā[18];ā[11]&&(ā.x),ā+=3:0;ā===1||ā[6]||ā[82]);}function ā()):0,ā[26]),ā[2])|ā[6]]({ā[84]](ā[25]||ā[22]);ā[32]);}function ā+=5;ā[17]:0,ā[8]||ā[25]&&ā[94]];ā[74],ā[44]);}function ā[33]){ā;){ā[70],ā[42]?(ā[52]]&&ā[2]?ā));}else if(ā){while(ā[2]^ā[52]);ā;}}catch(ā[30]][ā[45]]&&ā+3],ā|| !(ā[26])||(ā[87]]&&ā[49]);return ā[13]);}function ā]<ā[78]);}function ā[19]],ā)(ā[57]],ā+=7:0;ā){}function ā[76]]=ā[86]);}function ā,'rel',ā[61]||ā[63]);ā[32]&&ā[30])):0;if(ā[47]=ā[93]);}function ā[53]](ā[28]][ā[28]+ā,'as',ā[27]=ā[27]+ā());}function ā[12]),ā=0;}function ā[29]);ā+=4;ā)):0;return ā[28]);}function ā);return;}ā[15],ā[3]);ā[63]]=ā+=-9;ā];}}function ā[63]&&ā):0;for(ā[16];ā[16],ā[34]);}function ā[23]]===1)return ā[51]);}function ā[18]]=ā[81]);}function ā[87]]?0:(ā[16]]+ā[13])|(ā[72]);}function ā++ )];return ā!=null?(ā);break;case 43:ā){try{if(ā(179,ā));return ā=this[ā[63]];ā,0)===ā()===ā[63]][ā:0;ā){switch(ā[28]||ā[1]=',\"'+ā[0]^ā[51]),ā[39]]=ā.split('');for(ā]=\"\",ā[49])&&ā[75]);}function ā+=2;ā>0&&ā();break;}ā[22]);}function ā[49]],ā++ );if(ā=false:(ā[15]))return ā[49]);}function ā[63])),ā()):ā[7]);}function ā():0;}function ā(796,ā[103];ā,0);function ā[45]])===ā[19]||ā[18]]),ā[45],ā[45]),ā.charCodeAt(ā+=3;ā;else return ā[18]]){ā[45]][ā[5][0];ā[47]][ā[68]);}function ā+3])):(ā[33]|ā[77]][ā[63]);}function ā<<1^(ā[33]*ā[54]+ā[33]:ā[43]]=ā[8]):ā[50],ā[39]);}function ā[38][ā[74]),ā[33])):ā[45]);}function ā[20];ā():ā+=-4;ā())ā().ā[17],ā[18]];while(ā[17];ā[40]);ā[93]])return ā[86]][ā[50])):0;else if(ā):0;}ā[45]];if(ā();for(ā[50]):ā[50])(ā[4]){ā[41]];ā))return false;ā[14];ā[10]&ā[27]?(ā[90]);}function ā[57]);ā[25];for(ā]+=ā)try{if(ā(1,0),ā]=38,ā)return false;return ā<=14?(ā[1]);else if(ā[58]);return ā[71]],ā[4];for(ā[18]]);}}function ā(599,ā[20]||ā[65]);}function ā)):0;if(ā?0:ā[47]);return ā[12]);return ā[83]];ā[80]](),ā!=='';ā[1]>ā):0, !ā[44]=ā[1]);if(ā[40];ā(), !ā[118],ā[1]^ā[61]);return ā[87]);}function ā[48];ā++ )this.ā[96])||(ā[33]);return ā[28]](ā;else ā[20]]=ā[29]]=ā(0)?ā[53])<<ā[24],ā[63]+ā[33]]&ā[54])|((ā[77]);return ā[23]](ā[22]]=ā[23]];ā+=8:0;ā[126];for(ā[31]){ ++ā[51]]=ā[57]);return ā[64]];ā[64]]?ā[64]]=ā[2],(ā[67]^ā[85]),ā[83]]((ā[88],ā[27]](0,ā[7]])return;ā[18]]-1,ā[34]];ā;}}if(ā,1);if(ā[77];ā=[];if(ā||0,ā[42]||ā[27]],ā[6]));ā[37]];ā[40]));ā(){return(ā>0)for(ā[54]||ā[0])||ā;return[ā[65]);}ā[27]](ā[79]];ā[11])&&ā++ ):0):0;ā(){return[ā+=13;ā,true);}catch(ā[37]]=ā[84],ā[2]];}function ā[31]),ā[58]);}function ā[3]]==ā[10];ā)switch(ā+=93:0;ā[23]]&&ā[68],ā[68];ā[14]);ā[26]);else if(ā[23](ā[77]);}function ā[2];return ā);return;}return ā()];ā()));ā[49]||ā[66]);return ā[43]);}function ā[0]);else if(ā<=49?(ā?1:ā(743,ā[89]),ā[79]+ā[24])this.ā+=6:0;ā[7]));ā]=1,ā[49])?(ā[59](ā[57]?arguments[3]:0,ā[49]]===ā[27]);}function ā(257,ā[52]^ā.y;ā[77]),ā[36]?ā[56]=ā):0;}function ā[56],ā[56]+ā);}if(ā[33]?(ā[26];ā[39]=ā[52]+ā[31],ā[31])ā[71]]();ā[4]);}function ā[31]?ā[91]+ā[46]));ā[66]);}function ā,[ā[72],ā[35]);}function ā[15]?arguments[0]=ā[91]);}function ā){}return ā[22]+ā-- ):ā))if(ā[52]](this,ā=arguments.length,ā[19]?ā[19]=ā[19];ā){return false;}}function ā in this.ā[52]?(ā[44]){ā<=5?(ā[72]];ā]>>ā[44]),ā+1]=ā))?(ā[18]]):0,ā[27]),ā-((ā[51])===ā[24]),ā[43]]()===false&&ā[86]];ā[29])(ā[49])],āreturn(ā, delete ā=false;if(ā+=9;ā[90]),ā[0])[1],ā[5]]);if((ā[61]);}function ā|| !( !ā[47]:0):0,ā[75]);return ā[76]);}function ā[15]);return ā[88]](ā[88]]=ā[48]]=ā[108]&&ā[88]];ā[15]);ā[0]instanceof ā){for(ā[30]&& !(ā=[],this.ā!==null&&ā[54]],ā[100])&ā};ā[52]];ā(){return this.ā[18]]!=ā[26];return ā[65]];ā[47]|| !ā+1]<<ā>>>0),ā[21];ā[21]+ā+=442:0;ā[3]+ā[42]+ā[50]](ā[46]);}function ā[14]](ā,'');ā>=0;ā[66],ā[3][ā[46]=ā){function ā[48]=ā,'var'):0,ā[30]));if(ā[3])return[ā.z;ā[29]][ā[10]);return ā.split(''),ā[80];return ā+=-7;ā.apply(null,ā(739,ā)<<ā[91]];ā++ ), !ā++ ):0,ā[18]=ā++ ;return ā[60]);}function ā){return[ā[76]||ā[74]);}function ā[51]]([ā)!==true?(ā[44])){ā,true,0,ā]);else if(ā];while(ā[80]],ā[57],0,ā[49])return ā[5]=ā):'';else if(ā))for(ā+=1:0,ā(64,ā[5]]);ā=2;ā[25])return ā]>=ā];}return ā();return;}ā[26]);ā[37]);ā[26])*ā[15]]<<āreturn false;ā[45]]=ā[48]);}function ā]):0;return ā[54]?(ā.x&&ā[20]&&ā,'();',ā[33],( ++ā[1])+ā[22]?(ā[30]];ā[49])|(ā[58]=ā[1])?ā[1]))ā[89]](ā={};for(ā[54]);}function ā[26]=ā+(ā)):(ā[4]);return ā};}function ā[16]),'\\r\\n');ā[49])),ā[37])):ā});return;function ā<=106?(ā[119])return ā[2]);ā[5][1]&& !(ā[49])){ā[53],ā[53]+ā[58]);}}function ā)try{ā()]){ā[17]]=ā[90]+ā[95]]=ā>>(ā]!=ā[42])ā[34];ā[94]](ā[55])&ā[30]):0,ā[74]+ā[78],ā[25]);}function ā(62);ā|=1;ā[30]]:0;if( !ā[73]](ā[25])return((ā[1]||'',ā[49]&&ā[38]);}function ā[2][ā[39]<=ā= !( !ā[52]),ā,0,0).ā+1},ā(568,ā){}return false;}function ā[124]){ā[15])?(ā));}ā());ā]]]=ā++ ];}ā[52]]([ā[16]);}function ā[47]&&( !ā[90],ā]]=ā(509);ā]:(ā[70]);return ā[59]||ā(145,ā[83]){ā[87]),ā]^ā===null||ā[46]||ā+((ā[34]]();ā[43]]&&ā]>ā(){if(ā]-ā]/ā]*ā)*ā)-ā)/ā[20]];ā){return((ā[57]]^ā+=165:0;ā();else if(ā[47]&&(ā[76]];ā[82]](false),ā[51]))||ā[53]);}function ā[(((ā[28][ā!==1&&ā[3]];}function ā(){this.ā[85]?ā[57];while(ā[88]+ā>0?(ā[25])===0)return ā[7]])===ā<=85?(ā[28]=ā){return;}ā[23]?ā[23];ā[45]]==1&&ā[23],ā[70]);}function ā[23]+ā[27];ā[45]]==0?ā]()):ā[60],ā)this.ā[34]]===ā[11])?(ā[62]);return ā[15]],ā[67]);}ā(505);if( !ā[47]|| !(ā[26]);}function ā.y))*ā,'');}function ā<=50?(ā;}if(ā);if( !ā===1&&(ā[75],ā={},this.ā=null;ā[63])0;else{ā]]):ā-=5,ā[26]]);ā===1?ā[4];ā[46]]('');ā);break;case 42:ā[2]]]^ā[82]];ā[8])?(ā[40])return((ā[52],ā[13];ā[15]),ā-1),ā){case 1:if(ā[18]]>0;ā(109,ā[7]|| !ā[8])return;if( typeof ā(12,ā[62]||ā=\"\";ā[7]);ā[47]||ā[13]][ā[59])return ā[60]){ā[29])?(ā[6]]('; ');ā[0]&& !ā]),ā[91],ā[45]];ā.y))),ā];else if(ā(364,ā==='get'||ā[49]?(ā[12]));ā);}else if(ā[50]&&ā)>1?ā-1+ā[0]);}function ā[45]=ā[38]),ā[92];ā[55]=ā[25]];ā[27]]===ā+=-81:0;ā[64]]===ā[30]*(ā<=46?(ā[8]=ā);break;case 10:ā[29],ā[29]?ā[71]);}function ā[4]?ā[26]?ā[33];return new ā=null, !this.ā[61]][ā[2])):ā+2]=ā[31]];ā[29])&&(ā[31]](ā[31]],ā[51]);ā[6]]('as '),ā[49])ā[39]];ā[34])return((ā){return[(ā,true):0,ā[3]];ā[3]]=ā[9]]=ā]&&ā[19]||(ā[7]];ā[7]],ā[47]](0,ā[4]],ā;else if(ā[6]&& !ā++ );ā[5]],ā[63]));ā[5]];ā+1,ā[19]]()));ā(1)?ā[13];return ā[85],ā[40]]||ā='',ā[31]);}function ā[0]){ā[84]]===ā+=10:0;ā[51]||( !ā]);if(ā[64];ā[3]){ā[61]?(ā[82]](ā[2]];}catch(ā[16]];ā[57])!=ā[18]];)ā[11]);}function ā[18]]);ā[41]=ā[41]?ā]=71,ā[33]?arguments[2]:1,ā]);}return ā=[[],[],[],[],[]],ā[19]),ā[40]];ā[69]](ā]++ ,ā[11]?(ā++ ;else if(ā.substr(ā[23]]!==1|| !ā)|(ā[23]]===ā[2], typeof ā[41]].ā,true]);ā[98]))return false;ā[5]);else if(ā[43]]^ā+=-233;ā]=Number(ā[147],ā));function ā[10])&&ā[61])||ā[497]());ā[68]);}}function ā[30]||(ā+=-460:0;ā[42]];ā;if( !(ā]='b['+ā[33]^ā[54]:ā[54];ā[92]))return ā[54]?ā[66],'??');}return ā[18]]-1]===ā;if(this.ā!==null&&( typeof ā)||[];else return ā[74]](),ā[50]=ā[78]||ā:'\\\\u'+ā[63]]==ā[45]);return ā[61])|(ā[9]();return ā[32]);if(ā-52:0):ā[172],ā[20],ā[1].concat([arguments]),ā+=92:0;ā[8]?(ā='protocol';ā[47]:0:0;return ā[35]?(ā[57],'**');default:return ā.x!=ā[90]]('on'+ā[32]){ā='href';ā<=90){ā[22])continue;ā,0);}function ā==='`')return true;}}ā[74])?ā[73]:0):ā[11])return;try{ā(203);ā+=122:0;ā[22])return[ā){}else return ā]):( --ā:0):0,ā);if(this.ā):0);else{switch(ā)return;if(ā.x?(ā});}catch(ā[77],'let':ā===252?ā[32]);ā<=92?(ā(241);ā[73]])),ā<=94?(ā+=167;ā[38]+ā[89]||ā(89,ā<=55?ā[24])));return this;}function ā()%ā[77]+ā[30]:ā], !(ā[35]),ā[17]+ā[30]?ā[5]]+'.y',ā[20]),ā[42]]=ā[30](ā[30]+ā[15]||ā,'let');ā+=-181:0;ā?0:(ā>=40&&ā<=47?ā+=-247:0;ā[33]:0,ā[22]](new ā[6]](this):0;}function ā[62]&& !(ā];}catch(ā[33]:(ā[33],1);ā[46]]){ā[41]]=new ā[63]])&&ā());}ā[26])<<ā[73]+ā]);}ā[8])return;ā[102])break;}else if(ā[49];for(ā[69]),ā[81]),ā[23]]=ā){case 1:ā[175],ā>0)return;ā[120]:ā[140]?(ā[120]?ā];for(ā[73]);}ā[18]]>1){return(ā[34]);ā[24]]=new ā<=71){if(ā[51]);return{ā[93]];ā){return ! !ā+1))+ā++ ])>>>0;}function ā):0):ā[156],'=>');default:return ā))return;ā+=103:0;ā;break;}}ā):0):0):0;return ā+1));ā(0,'',0,0,0,true));function ā<=98?(ā+=-409:0;ā[16]])return ā[32])&&(ā>1)ā[9]);return;case 7:ā[30]);}ā[53]),ā[14](ā()?this.ā[18]]-1){ā+1))[ā>1;ā+=171:0;ā<arguments.length; ++ā>1?ā==='let'&&ā[5][2]||(ā==''||ā[81]);}ā[86]]);ā(448,ā()):0;}}function ā[51]);return ā(382);ā[3]&& !ā,false);break;case 40:case 41:if(ā,true);else while( !ā[18]]-1)return ā,'');}else return'';}function ā(601);ā[0];}function ā[7]|| !(ā);return;case 43:ā+=45:0;ā++ )];if(āreturn new ā[0])+ā[1]];}ā[33]=ā[29]]!=ā[52],'throw':ā+=-262:0;ā[74]]=ā[49])if(ā=false;do{ā[25]):0,ā[49]](ā[0]=[],ā[38]&&ā[5][2]&&( !ā[33])));ā[42]);}ā<=23?ā));}return ā= ++ā[45]]==1?(ā[93]);if( !ā[33],'null':ā-- )ā[47][ā[57]?(ā=false;for(ā[45]]);}else if(ā[173],ā[57]),ā[26])&&( typeof ā+=-29:0;ā; !ā]()*ā[94]=ā[33]]:0):0;return ā[27]);}ā[57]):ā(937,ā<=83)ā[17]/(ā[54]),ā[52]='';ā(arguments[0]);}}function ā&= ~(1|ā[32])return ā);break;case 15:ā+=380:0;ā[64]](),ā-- :0;return ā>>>1)):(ā);return;case 16:ā(509)));ā+1));}}function ā=1;}}if(( !ā<=10?(ā+=-470:0;ā[35]],ā+=315:0;ā<=69)(ā<<1)+1,ā=false:0;break;case 4:case 36:ā+=-635;ā[52])+1,ā[57],'&&');case 61:ā[50])||(ā,false);}ā()];if(ā!==''){if(ā-=1):0;return[ā,false);break;case 37:if(ā[5]=[ā[41]);return ā();case'*':ā[93]))return;ā[57])return 0;for(ā(424,ā[105],1);ā[59]));ā,0);for(ā+=-637:0;ā){case 15:ā[85]);ā[57]& -ā[63])break;}else if(ā[17]);}}function ā):0):0;return ā++ :0;}return ā[75]):0):0,ā[33];return ā[109]);ā[26]):ā)?0:ā[66]);return +(ā[4]=2,ā<=29?ā.length=60;ā[113]+ā.length===6)return new ā[27]](1));}function ā>>>0);}}function ā[43]];}else return ā[57],0,0,0,0,0,0,0,0,0,0,0,ā):0):(ā+=373:0;ā[22]));ā[22])):ā>=92?ā;else if((āreturn{ā[49]):ā[108]<=ā])):(ā[49])?ā[48]||ā<=18?(ā[47]];}function ā[2]}),ā[82]&&ā=0, !ā[3]=(ā+=-452:0;ā+1],16));return ā<=65?(ā())&&ā(105));ā[18]]===0;ā<=107)ā&= ~(ā[49],0);if(ā[26]];}}}if(ā[33];while(ā.y||ā[43]);ā[5][1]|| !(ā(93,ā<=61?(ā,false);break;default:ā[79])[ā)!==ā+=-474;ā=[];function ā[57],'!==');default:return ā[59]){ā++ );}function ā='/';ā);return true;}}else ā(428);ā[57])return new ā>=97&&ā[38]];}catch(ā[57])return;ā[71]]();}function ā+=21:0;ā):0;}}}function ā[2])|((ā++ :0;return ā[0]=(ā[3]=[ā(370,ā);break;case 55:if(ādo{for(ā;while(ā=0:0;break;default:break;}ā[2]);else if(ā[92][ā[45]]){case 0:case 3:case 4:ā[77]])return ā[49])&& typeof ā+\".y\",ā[33]);break;case 43:ā[30]);return ā(203):0,ā+=11:0;ā[23]]===1&& typeof ā+' '):ā[118])),ā[0];for(ā[25])>ā[7]||( !ā=unescape;ā[72]]&&(ā[1]=[ā[5]]&&ā]='c['+ā[19]];}ā('\\\\r',ā?(new ā[95]));}ā)===0)return ā|=1:0,ā,'let'),ā[82],ā('get')||ā[13]);return ā+=474:0;ā.y>0?ā[38],'switch':ā);}else(ā[25],'ig'),'$1'));return ā+='r2mKa'.length,ā[184],ā<=96?(ā.fromCharCode(255));return[];}function ā++ );while((ā):0:0,ā[21]];ā;return;}return ā];return[ā[21]]=ā[44],ā){return typeof ā[20];return ā[35]]||ā[3]);case 5:return ā[5]+ā[36]===ā[94]&&ā[42])(ā[35]:0):ā[42]);ā[118]+ā[68]);break;case 52:ā]=1:0;}function ā[83]+ā(409,ā[22]);return ā);break;case 38:ā<=82?ā[180],ā[48]|| !ā[37]){ā[17]](new ā[93])):0;}function ā[57]](1));ā=0):ā='//';ā);return;case 17:ā===\"`\"))return ā(515));if(ā],0),ā=[], !ā[55],'const':ā[61],'++');case 61:ā})):0,ā[164]^ā[24]);return ā[2]];return(ā(0))ā[63])ā[63]-ā[63]/ā});return ā[33]];ā[63]=ā[171]){ā[33]]+ā);continue;}else ā+=1;switch(ā=['top',ā[0]!==0?(ā[20]+ā[20])ā);return;default:return ā[158],ā,false);}return ā+1])):(ā[20]=ā[11])){ā[3]]);break;case 5:case 6:ā+=466:0;ā[32]]=ā[36]&&ā[27])===ā>0)return ā+=23:0;ā[1]==\"?.\"?ā<=93?(ā[22]];ā[90]);return +(ā[7]])if(ā[5][1]&& !ā[10]])return ātry{if( !(ā[0]):0;if( !ā+=-85:0;ā[84]])));}catch(ā[71]]()/ā[34]][ā.x==ā)==false)return ā[76];function ā[67]+ā[99])|(ā(){return !ā[64]][ā[10])?(ā===1?(ā[43]=ā=window;ā+=-3;ā[18]]-1];return ā[79]:0,ā[92]);return ā[188];return ā[0])return ā+=494:0;ā[11])if(ā.x)*(ā?( typeof ā[130],ā+=235:0;ā-1].y),ā=true;}}if(ā[17]:ā[1])try{ā[20]);return ā[85]]);break;}ā+1)];}function ā[13]&1)&&( typeof ā[25]));else return ā[21]]-ā[46]);ā=0):0;break;case 3:ā();return;case 26:ā)return true;}return false;}function ā[35]]!==ā[56]||ā[26]);if(ā[113]);ā[20]){ā[63])|(ā())){ā[57],0,0,0,0,ā[39]));ā[93]=ā[58]||(ā+1),ā[15])return false;if(ā[15]]]^ā)):0):0);else if(ā].y-ā.y);}function ā=Date;ā]+this.ā[63]](ā[18]);}function ā[1]===0||ā[57],'<=');default:return ā[81]]=ā[29];return ā[6]=1;ā[69]);}}function ā[31]);return ā),this.ā:0:0,ā[22]){ā,0);if( !ā={'\\b':'\\\\b','\\t':'\\\\t','\\n':'\\\\n','\\f':'\\\\f','\\r':'\\\\r','\"':'\\\\\"','\\\\':'\\\\\\\\'};return ā]++ :(ā[45];return ā[28]))||ā[3].concat([ā[18]]:0,ā,1)+ā+=111:0;ā[30]))return true;else return false;}function ā;}}ā,1):ā[85]]==0){ā<=21?ā(683,ā[37]=ā.x<ā=true:0:0;return ā[16]===ā.x;ā[5][2]&& !( !ā[49]]({name:ā+=300:0;ā[57])),ā());else if( !ā[125]?ā[24]===ā[125]=ā+=355:0;ā[47]](1,1):0,ā[4]&&( !ā+=146:0;ā[14]){ā[121];ā):0;ā<this.ā[26]||(ā())!==ā,'');}ā[73]),ā[43]];ā[161]){do ā>1){for(ā[68]+ā++ )try{ā[4],0,0,0,0,0,0,0,ā[81]);ā){case ā[34])){ā[169],ā],0)!==ā){try{if( !ā+=75:0;ā<=89)(ā[63]);for(ā[73]){ā[74]);if((ā[0]);case 2:return ā[65]);return ā);break;}ā[88]);if(ā[7],'instanceof':ā(),'?.');}if(ā[33]==0?ā[18]]-1)!==ā++ );do{ā==='set')){ā!=true)?ā[94];ā<=53?(ā());else break;}}function ā(509);return ā)))ā))(ā]]+1:0;for(ā);case'number':return ā[51],0);for(ā[57],'!=');}default:return ā);}}return ā);return true;}return;}return ā<=57?(ā+=250:0;ā[18]];switch(ā[132])):ā[15],{keyPath:ā);break;}}else(ā+=-95;ā[45]]?(ā[29];ā[43]);return ā)||\"\")+ā,1);try{ā[47]&& !ā,0)===\" \")ā|| typeof(ā[27]];}function ā.x),0<=ā[55]]=ā:0):ā[39],arguments);}function ā))[ā[78]);}}ā[2])<<ā[2];}function ā=true:0;if(ā(1)){ā[39]){ā[0]?ā[28])break;ā?1:0);ā[8]](ā];else(ā=( typeof ā[7])?(ā||\"\";ā+3])):ā].apply(ā=true;break;}}ā()==1?ā(687,ā[9])[0],ā++ ]= ~ā[187]?(ā[45]]){ā=[0,1,ā[1]=arguments,ā!==''?ā[18]])];}while(ā[57],'>=');case 62:ā();return;case 10:ā=false;}function ā[41]()[ā);break;}break;default:break;}}function ā+=58:0;ā:0))/ā())return 1;else if(ā+4]));}else ā[12]&&(ā[63]?(ā[5][1]));ā=0):0;break;case 2:ā));}break;}}function ā[45]]),ā[0]===' ';ā++ ]= !ā+=172:0;ā[57]](1);ā+=13:0;ā[45]]);ā,0);return ā(565,ā(301,ā[110],'void':ā+=143:0;ā<=3?ā[16]])];ā[79]<ā(388);ā].x-ā||1,ā[63])^ā[66]),ā!=='get'&&āreturn\"\";ā+1?(ā+=-205:0;ā[42];ā[10]]||ā[505]();ā+=-355:0;ā]&1;return ā[30])),ā<=67)ā>=127?ā=false;else{ā[85]],this[ā[48]),ā,true,true));if(ā[50]);default:return ā[8];}}function ā[59],ā[0],0);return ā[19]]();}function ā<=11?ā[32];ā[13]&1);ā++ ;break;}ā++ <ā[4]);else if(ā[42]]||ā[68]);return ā<=26?(ā[24]);}function ā[54]));ā[17]);}function ā<=45?(ā(205);ā||0);ā[58]], !ā(901,ā(478);ā[0]):0;return ā[84]])))||( typeof ā<=20?ā+=604:0;ā=false:0;}while(ā[77]);ā.y<ā-=1):0,ā)|( ~ā.y+ā[148],(ā):0):0;function ā.y,ā(49);}catch(ā,false);}function ā[8],'*=');case 42:ā<=104?(ā)===true){ā[57]];}function ā[87]);return ā(){return((ā[6]](' '),ā[492](1,1);ā.length===3)return new ā[2]]=ā[52]:ā[54]&&ā[15])return;ā[28]){ā[52]-ā[39];ā);return;case 19:ā===null;ā<=102?(ā;}else return ā):0;try{ typeof ā),this[ā[55]);}ā[0]);return +(ā)return;try{ā[504](ā))):0):0;}catch(ā<=0)return;ā[10]),ā[15]]),ā]];for(ā<=9?(ā[3]],ā[91]?ā[91]=ā[1];if(ā<92?(ā[12]+ā[30])):0):0;}function ā[43]&&ā[0])[1];}function ā[12]=ā[32]?(ā++ ]= --ā[61]=ā[93])){ā(540,ā[56],'if':ā[33]);continue;}}ā);try{ typeof ā[31][ā[53])):0,ā[24])))continue;return ā);}else{return;}}catch(ā[7]&&ā){case 2:ā[66])&&(ā[43],'var':ā[57])):ā==0?ā[84]+ā=true;if(ā++ ;}return ā[52]));return ā[49]]();ā?(this.ā++ ){if(ā){if( typeof(ā[40]),ā[31]];try{ā[67]];ā[58]:0,ā[91]];else return ā()]()[ā<=95){if(ā);break;case 1:ā[9]){ā[43]),((ā[19])ā(364,this);ā,false)):0;}function ā='$$_'+ā.length=0,ā[18]]-1)&&(ā[18]]<=1)return ā[52]-(ā[52]!==0?ā]===\"..\"?ā,' ')),ā[18])if(ā[30]:0,ā+=-44:0;ā+=8;ā+=106:0;ā[48]||( !ā+3]));else if(ā[77]);}}function ā[27]);return ā+=-529:0;ā[18]]>0&&ā+1)===ā[35]]!=ā[13]?(ā[46]&&ā+=-188:0;ā:0},ā[45]]);switch(ā[18]]==1)return new ā[6]](0);while(ā<=15?ā<=33?(ā=window['$_ts'];ā[88])==ā:true};}function ā[67]]){ā]=1;return;}if(ā+1]-ā[1]));ā<=66?ā[5][1]&& !( !ā[72]]=ā[2];if(ā[136]||ā+=25:0;ā+=311:0;ā);break;case 53:ā>>=1,ā)):0):0,ā[25]|| !ā[61],1):0):0;}}function ā+1]=(ā):'';return ā[16]),'');}function ā[72]]();else return ā[40]))===\"get\";ā()):0;switch(ā[17])):0,(ā>>>1));ā+2);for(ā,'\\n',ā[36];return ā+=-78:0;ā[35]};ā='hostname';ā[1])&&ā[24]);ā[23]);}function ā<=27?ā[0]))||ā+=118;ā[131],ā))return\"\";for(ā; --ā[30]]){try{ā('of')){ā[191];}else if(ā[124]=ā[47])return ā);return;case 21:ā[14]]=ā[43]));ā[36]);return null;}ā[25],1];ā);return;case 18:ā[16]),\"\");ā[179]*(ā[96]=ā===0||ā[91]);}ā[78]))return true;else if(ā[40])==ā[18]]),1);}catch(ā[86]],ā[21]);return ā<=87)ā,(ā[139],ā='pathname';ā+=493;ā[36]]){ā[15]]=ā[162],ā<=41?(ā[21])?0:0,ā(11,ā[52]);}ā[49]:0,ā[104]);}function ā[64]]&&((ā[15]](ā[85]]==0&&ā+=47:0;ā;continue;}}ā[66]]||ā+=500:0;ā);return;}if( !ā[112]),ā){case 52:ā= delete ā.split(ā[62]&&(( !ā);break;default:if(ā[59])/ā+=-49:0;ā[59]),ā]();case 1:return ā[59]);ā))try{ā,true);else if(ā[33]);if(ā,[{\"0\":0,\"1\":13,\"2\":31,\"3\":54}],ā)/(ā+=-397:0;ā.length===4)return new ā<=103)ā.x||ā+=116:0;ā[2]],ā[78]);}ā[94]),ā[34])==ā[14]];ā[9]);}function ā[3]]);ā[111],ā[1]]||ā[2]];ā();}return ā<=109)debugger;else ā[83]))return true;else if(ā[56]];ā[14];return ā[58]]=ā.y==ā[65]+ā,1);if((ā[13])),ā])):0;return ā++ );return ā){return(new ā[50]);}catch(ā);case'object':if( !ā[92]in ā();return;}return ā[5][2]&&ā[88]],ā), !ā[57]](0);for(ā[55]]&&ā('\\\\n',ā[74]);return ā[127];for(ā(193,ā[11]=ā.y)return true;return false;}function ā+1));else return\"\";}return\"\";}function ā.id;if(ā[36]&& !ā==1&&ā[76]);ā[210],ā,true);return ā[50])||[];return[];}function ā[39]][ā[61])return;ā[69]+ā<=111){if(ā(725,ā[70];return ā[89]]||ā[54]]=ā[1]+(new ā.y);break;case 1:case 2:ā[43]];}function ā+=-178:0;ā)):0);else if(ā()):0;if(ā(122);}catch(ā[59]);return;}ā(0,ā[40])===ā[11]]?ā.lastIndexOf('/'),ā<=1?ā+=9:0;ā[500]());ā(507)))return ā++ ;for(ā[63]?0:(ā[9](),ā[49],'export':ā[52]]=ā[10]],ā[90];ā));}for(;;){switch(ā[0]],ā[49]&&(ā[496](ā[45],'continue':ā[52]],ā[7]]);return(ā[10]]=ā[94]]();}function ā]!==null&&ā[5]);}}function ā[10]))( !ā[56]|| !ā[1]:null;ā[94]];return{ā)):this.ā();break;case 42:ā<=56?(ā+=388:0;ā){try{return ā[61]]);if(ā+=-173:0;ā[112],'function':ā[40]='';ā]=[ā]+'\\\\b','gim'),ā[33])return true;}catch(ā=false:0;break;case 44:ā]==ā[30];return ā[6]))|| !ā[29]];ā;'use strict',ā+=350:0;ā]||1)ā(5);ā===0)return[];return ā[94]);}ā[17])+ā++ ;break;}if(ā[49],'else':ā[21],ā<=110?(ā))):(ā[25]>ā[25]?ā[25]=ā[42]?ā[42]=ā);return;}}ā();break;case 56:if(ā+=336:0;ā[57]);}function ā+=-440:0;ā[7]=ā[67]]()[ā[50]]+ā?this.ā[165],ā[66]:ā[10];return ā, !ā='';do ā[54]],\"; \");for(ā=[0,0,0,0,0,0,0,0,0,ā[85]):0,ā];if((ā+'')[ā[51])[1]||'';return ā[17]){ā[86]],this[ā[81],ā){case 60:ā[28].cp;ā[62];ā+=151:0;ā[12]|| !ā[3]^ā[46]+ā[18]];}function ā:0});function ā[182],ā,0)-ā]instanceof ā=1:0),āreturn'';ā[117],ā+=-477:0;ā]]===ā[30]):0):0;}function ā[2]);else return ā[17]);return ā+=17;ā[94]]=ā[1]);}ā[1]]?ā<=88)ā+=-392:0;ā(829,ā(21,ā){}}return{ā));else{ā[89]?ā[13]);ā[89];ā++ ]=true:ā[94])){ā);return;case 33:ā[9]();ā[89],ā[29],'img',ā()){case'/':ā[23]))return true;else if(ā++ )]+ā:this,ā[5][0]&& !(ā);return;case 11:ā.length===0)return new ā[18];return ā-- ;ā[26]][ā[25]);if(ā):0);else if(ā[1], !ā,1):0;else if(ā]===1){ā[39]||( !ā[91]]():ā[18]]);return ā[1]=(ā[66]);ā+=429:0;ā[6]);ā<=25?(ā,1);return ā[2]));}function ā+1);}function ā[54],'while':ā[33])|(ā[18]||(ā[48])&&(ā[497]()),ā[46]]=ā[6]||( !ā[42]);if(ā[80]]();}ā+1))){ā(403);ā[19]?(ā[46]](ā[63]]():0,ā){this[ā[3]? !ā= typeof(ā+=-174;ā+=22:0;ā[1])&& !ā<=21?(ā[92]](ā[57],'<<');}case 61:ā[92]],ā[18]]>1?(ā.cp;ā++ ])>>>0;else return ā){case 1:case 2:ā=1<<ā[63];}for(ā[53]]===false;}function ā]>0;}function ā[503](ā+=446:0;ā(512);ā+=536:0;ā[52];if(ā<=78?(ā[8],'-=');default:return ā[91]]?ā(323);ā()){ !ā[4]++ :ā<=86?(ā-1].x,ā[1]++ :ā[58]][ā=String;ā[6]]('??'),ā[38]](\"_$\")>0;}function ā[86]),ā[35]);ā[50]);break;case 10:ā[19]&&ā-1]===\"..\"?(ā+4])):ā[18]]>0){for(ā[25]);return ā=0; !ā]=1;for(ā[89]);return ā[26],'typeof':ā[69]);}function ā()==ā;switch( typeof ā+=-158:0;ā[39]|| !ā<=79){if(ā], typeof ā[6]]('\\n');return;}ā[80]]();}function ā[91]])return ā[61];return ā<=74?(ā[18]),ā=Array;ā;continue;}}while(ā)return\"\";ā[506](ā]<=ā[86]+ā[8]);}ā[86],ā+=-411:0;ā[502](ā+1]);ā[151],ā[13])],ā[29]))return ā[73]]),ā[48]; ++ā,0)!==ā]=1;ā[190];}else if(ā&1)?(ā[54]='';ā[0]=arguments,ā[5][2]<=ā);break;case 5:ā[43])))return ā[21])&&ā+=101:0;ā[3]));}}catch(ā;return;}ā[123],ā[83]);}ā<=32?ā[3]?(ā=[0,0,0,0],ā));return;case 20:ā[57],'===');default:return ā[176]?ā:false;ā[14]?(ā[13];}ā<=51?ā[63]);return +(ā]);else return ā+=222:0;ā++ ;}if(ā){throw ā-30:0):0,ā[170]?0:ā[78]);return ā[51])[0];}function ā]='\"':ā[45]]];ā[21]:0;}function ā[88];}catch(ā(16);ā[71],ā[27]||ā[5];return ā[5]),ā(113,ā[5]);ā[44]))(ā[32];}function ā.length===7)return new ā[33],'debugger':ā[95]);return ā+2]));else if(ā+=-190:0;ā+=-651:0;ā[205],ā,'\\n')>=0;return ā.charCodeAt(0)-97;for(ā[2]=',\"'+ā===(ā+=139:0;ā[69]);return ā<=97?(ā+=225:0;ā)):0:0,ā={'tests':ā[5]);default:return ā[51])){ā[84]];ā[84]]=ā<=68)(ā[10],'for':ā[72]]());}}function ā[18]]));}}function ā+=-653:0;ā[2])+ā,'let')):ā[1])return;if(ā[7]&& !(ā=true:0,ā[26]];if(ā[6]+ā=parseInt;ā):0;if( !ā[57],'^');}}function ā[93]+ā[93],ā[79]](0);if(ā[1]){ā){}}if(ā))continue;else if(ā[93],'break':ā[34]);return ā[95]);}ā[5]]+'.x',ā[33];break;}ā<=112?(ā[8],'**=')):ā[25]);}}function ā[30]):0):ā[22])+ā]-=ā[7]]|| !ā-1; ++ā[33]):0;if(ā[58]?ā[41];return ā[195]],this.ā[2]);case 4:return ā[4],'try':ā[174]^(ā[40]],''),ā+=-403:0;ā[14]](new ā(418,ā);break;}}function ā+=-396:0;ā[89]){do ā=true;}if(ā];else{ā[18]]);if(ā(462);}}function ā++ ]={}:ā);return false;}}function ā[70];ā(747,ā+=51:0;ā[49]));ā[5][0]|| !ā.y<0?ā[38];return ā[85]&&ā===1&&ā<=63)ā[74][ā[89]]={};ā)):0;break;}ā[57]^ā[31])!==ā[9]);return ā[65]](this.ā('set'))&&ā[57]+ā[57]/ā[50]);ā={ā===0)return'';ā[57]:ā[57]=ā[19]]();function ā[10],'new':ā[4];if(ā]();}catch(ā[28]);return ā[80]]==ā[153])/ā[53]=ā[63];}ā[15],'default':ā<=7?ā[57]};if(ā[13]))return true;else if(ā[81],'');ā[8],'/=');}return ā[38]));ā[88]&&ā(428),ā+1];if(ā[44],'...')):ā[95]];ā-1;}else ā[34]+ā>>=ā[90]?ā[111];for(ā(544);ā[34]=ā=true;}ā[34]?ā.PI-ā[25]);}ā[14]);return ā+=317:0;ā+=-366:0;ā[94]],ā[50])):0,ā;if((ā[63]);return ā[29]]===ā+=479:0;ā[7]]||ā[47]))&& !ā[49]))||(ā[6]](this.ā[4]);case 6:return ā[18]]-1);ā[18]]){case 0:return ā[24]);}catch(ā[61]]);ā[33])+ā()](0);return ā[70]](ā[43]))){ā[33]):ā.x)+ā,'\\n'));}function ā[3];for(ā<=108)( --ā[11]||ā[57],0,0,0,0,0];ā[12]&& !(ā,false);break;case 54:if(ā==\"\")return true;else if(ā[8],'>>=');case 62:ā[66]?ā):0):0);else if(ā[68]]-ā<<(ā[50])):0;}else ā[21]);}function ā:0;function ā(505,ā[4]<=ā[209];for(ā+=140;ā[7]||(ā[6]);else if(ā[54];try{ā<=11?(ā;}return'';}function ā];return[0,ā[52]);if(ā,true);break;case 6:ā[2]=', \"'+ā[73]]=ā[85]||ā[6];return +(ā[73]]*ā[73]]-ā[73]],ā[57]:1]^ā):0;}catch(ā[33])return new ā[21],{configurable:true,value:ā[199],ā[123]=ā=':';ā+=-31:0;ā[66]];ā=true:0;return ā[3]===ā[72]);ā<=13?(ā]));}function ā(),'case':ā+1];if((ā[11]===ā[2]+ā[26])&&ā];function ā[2]<<(ā[43]),ā[63])===ā[62]=ā[43]?(ā+=-5;ā<=31?ā[50];return ā[81]?(ā<=40?ā,true);break;case 25:ā<127?(ā++ ])&ā+=-489:0;ā[52])+ā[41],'gim'),ā[7]]!=null&&(ā=this;try{ā[33]];}return[0,0];}function ā[19]])){ā(535,ā]?(ā[60]),ā[0][1]?ā<=12?(ā.substr(0,ā[26]);return ā[42]===ā+=68:0;ā)){if(ā===1)return ā);case 15:ā='on'+ā);break;case 44:if(ā):0):0):0;}catch(ā<=64?(ā<=60?(ā]]],ā):0;else if(ā[28].jf=ā[28].jf;ā[18]||ā())!=ā=[];for(;ā||[];}function ā+=627;ā[95]];if(ā[4]]===ā(463);ā)):0):ā[62]+ā[1]&&ā++ ]=[]:(ā,'*/',ā[2]);}ā+3]=ā,'id');ā[85]);if(ā[18]]>0)ā[71];}function ā[27])return((ā<=62?ā[59]||( !ā[48]<=ā[47]),ā[30]],ā[16]?ā[35]];ā[4])&&ā[62]];ā==null?ā[2]]];return[ā))continue;ā]='';}ā[125];else if(ā[23],'gim');if(ā[83]);ā+=-443:0;ā<<1,ā;while(1){ā[83]),ā,true);}}}catch(ā[7]);}}function ā]+'\\\\b','gim');if(ā<=75?ā==='on'+ā)===false&&ā){}return false;}ā[18]]):(ā+=-8:0;ā[32]&& !ā[87]){ā)&& !ā]:0;return ā?0:1))+ā===1;ā]][ā+=-163;ā+=474;ā[55]);else{ā[125])return ā(599,0,ā[63];}function ā[95]](\"\");ā<<1^ā[2]++ :ā[48]);break;}ā[3])&&ā[57],'==');}case 62:ā+=-361:0;ā[114],ā[63]|0),this.ā[57]];for(ā();break;case 43:ā+=-519:0;ā+=-250:0;ā)return true;}function ā[8],'%=');}else return ā[16][ā,false)):0;return ā==null?this.ā)):0);return;}else if(ā[43]));}}function ā[48]][ā]===0?(ā):0;return[ā=false;break;}while(ā+=-629:0;ā[82]](true),ā[25])===0){ā][0])return ā[33],'true':ā[93]),ā);}finally{ā[47]===ā=0^ā[0]&&ā[58]));ā[32]+ā)|0;}}function ā[57]],'\\n');ā+=-547:0;ā[87]]-ā.substr(1)):0;return ā(new ā))return true;return false;}function ā]?ā,false);break;case 56:ā){for(;;){ā[19]](ā)){try{ā++ ;while(ā[50]);}}function ā)>ā(462);return ā).ā);return;}else if(ā(){ typeof(ā[34])===ā[20]]?ā=1:0;ā<=81?ā[77]](ā[47]||(ā[77]]?ā[23]((ā==1?(ā[77]];ā[8]|| typeof ā[22]]||ā[18]]-1], typeof ā[68];}}return ā[57]]+ā[63])+ā[6]]('...')):0,ā[57]]&ā[0])[1];return ā]):0):0;return ā[57]]=ā[2]=(ā[57]];ā+=21;ā++ :ā++ ):0;for(ā[57],'||');default:return ā[27])==ā)[ā[0]=this,ā[35]);}ā[113])[ā[4]=(ā[22]])return ā[86]);}ā[24])));ā[11]];ā[29]);}function ā<=43?ā[81]];ā[48]]===ā]);}}function ā-1]===ā[43])?(ā[59])while(ā[95],arguments);}function ā();while(1){ā().concat(ā[27]])return true;ā[16]),'%0D');ā[2]),(ā[89]][ā[10])return false;return true;}function ā={};if(ā[2];}}}function ā));for(ā[85]][ā[16]]||ā,0)):0;}function ā[89]];ā[46]]('\\x00')+ā[3])>>>0;}function ā[89]]=ā[18]]?(ā,true);}if(ā[68]){ā[18]]];function ā[42])break;ā[38]];ā);else return[];}function ā]='\\'':ā[93]]+ā)):0;}}ā,\"var\");if(ā=[]:0,ā[91])+1,ā[7]);return;}ā++ ]=((ā-=4)ā[43];ā[53]];ā[18]]>0){ā[49],0,0,0,ā[29])&&( typeof ā[46]&&(ā[197];}}function ā[43]+ā[134]^ā[28]];ā(462)+ā[16]?(ā.length;return{ā=Object;ā,this[ā<=80?(ā=encodeURIComponent;ā-1]),ā(96);ā()],this[ā[28])ā<=76?ā[8],'&=');default:return ā[183],ā[28]?ā.charAt(0)==='~'?ā],''),ā[23]=ā[75])^ā[53]]=false;}function ā[42])){ā=1:0;function ā[5]]),ā(507);for(ā=String.fromCharCode,ā[7];return ā[0].y):0,ā[44];ā+=96){ā();break;case 36:case 38:case 3:if(ā())&&(ā[27],ā+=-163:0;ā)|ā[21];}function ā[60]=ā[76]|| !ā[12])+ā[95])!==ā[60]+ā[58]|| !(ā==0||ā<=35?ā[4]]=ā[63])));ā[67]);return ā<=19?ā)try{return ā[75]),ā[34])){if(ā[58]&&ā[39];return ā[13]);if(ā+=-434:0;ā[10]];for(ā[76])[ā+=10;ā[57]+1)continue;if(ā[88]]!==ā,1)===ā,value:ā[39]===ā&1;ā[87])):ā<=99)ā=null;}}catch(ā.length-2;ā[12]||ā[35]=ā[57]](0),this.ā[121]||ā[1]||ā[15]&&ā[0])try{ā);try{ā+=567:0;ā[29]])/ā[74]];ā){case 42:ā):0;}}}}function ā-- >0)ā+=450;ā[38]],ā[18]]-1);}return ā[8]])/ā[16]),'%0A');ā+=80:0;ā[29]||ā<=54?(ā[38],arguments.callee);}function ā[33];else return 0;}ā[56];ā[123]));ā+=463:0;ā+=12;ā[123])),ā[129],ā[46]];ā))return true;}ā[59])return;if(ā++ ]=false:(ā++ ]= ++ā]%ā);}}ā<=58?(ā[30];ā[93])?(ā.length===5)return new ā,\" \");if(ā(811);ā[55]&& typeof ā()){if(ā[0];if(ā<=52?(ā[8]|| !( !ā[20],'class':ā===\"\";ā[20]]&&ā!==\"js\";ā[85]);return ā[157]?(ā(277,ā)return true;ā[97]);}}function ā():0;return ā='port';ā[45])];for(ā.charAt(ā[72]])return ā[89]);}ā,1): ++ā[39])):0,ā[8],'^=');default:return ā,1);}catch(ā[5][0]|| !(ā[49]);for(ā[18]]<=ā[75]+ā[33];}for(ā[52]);return ā<=84?(ā[20]);}function ā[48]]);ā);return;case 6:ā+=438:0;ā+=-53:0;ā]:0,ā=[]:0;if(ā[16]),'\\n'),ā[86]]||ā++ ];}function ā[59])])|0,ā[18])?(ā+=365:0;ā<=60?ā[18]]),1):ā[50]));for(ā[51]):0,ā[64]);ā[1]);case 3:return ā+=30:0;ā[45]))&&ā++ ];if((ā+=0;ā)||( typeof ā.push(parseInt(ā+\".x\",ā[92]];ā[122]?ā++ );}if(ā[15])||(ā[122]:ā[68];return ā[85]]=ā[85]];ā[29]];for(ā[122],ā[3]='\")'):0):0;}function ā[52]?ā[149],ā+=-135:0;ā[92]]?ā):0;}return ā[46]](''),ā[53]);return ā[46]&&( !ā[142]||ā[16]+ā[63],'in':ā||this.ā[47]]=true;}function ā[16]),\"\"),ā(147,ā[31]?(ā[5][2]||( !ā,true,true)):(ā(619);ā[15])return[];ā[25]);for(ā[102],ā= -ā[126]=ā=false:0;break;case 42:ā])&& typeof(ā+=-392;ā[30]=ā,''];return[ā[26]])+ā[18]]; ++ā;continue;}ā-1)*ā<=36?ā+=88:0;ā[15])?ā[66]&&ā[43]===ā+=-404:0;ā[92]){ā[18]]>0?ā[51]);}ā);return;case 47:ā[75]];ā+=619:0;ā[49]))return ā(611,1);ā[61]):(ā);break;case 33:ā])ā[9]);return +(ā[31]&&ā[29])?ā[0]++ :ā[29]?(ā<=105?(ā++ ) !ā=',\"'+ā[76];ā[72]),ā<=59?ā)>=0;}function ā[92]);ā-1){ā)return false;ā<=2?(ā[43])||(ā[58]||ā[83])){ā[46])===ā(),'');}ā[49],'delete':ā+=308:0;ā[95]])return ā[24])return false;return true;}function ā);break;case 9:ā.y)*(ā(38);ā[90],'ig'),'$1'),ā[57],'>>>');}default:return ā[3]++ :ā():0;break;}if(ā();return;case 39:if(ā[215]];ā[7]]&&ā<=101?(ā[88]?(ā[82]])&&( typeof ā[48]];try{if( typeof ā<=8?(ā[91]]||ā[40];else if(ā[72])!==ā<=38?ā[7])(ā[25]?(ā+=-36:0;ā[38]);ā[18]]*ā.length===8)return new ā[18]]:ā[24]&& !(ā[18]]?ā()):0;break;}ā[1]))|| !ā++ ):0;}ā,arguments[0]),ā[25]){ā)!=ā[57]](0);}function ā){case 5:if(ā[0])?(ā);return;case 12:ā[7]]));ā[95]+ā[26]));ā[18]]];}function ā){case'string':return ā[95];ā[39]?(ā();}}function ā[35],'ig'),ā[50])):0):0;}function ā)):0;break;case 46:ā[49]])return false;if(ā[58]];ā[6]]('=>'),ā[18]]==0)return new ā)return false;else if(ā(6,ā[114]?ā<=16?(ā[28]&& !ā[9]];for(ā[18])|((ā){case 43:ā]in ā[107]){do ā+=-314:0;ā[60]);ā[43]];}catch(ā[45]]){case 0:case 3:case 4:case 1:case 2:return true;default:return false;}}function ā[21]),ā<=100?(ā[36]](\"id\",ā[16]](ā[60])(ā[35]](new ā[58])%ā[63]]))return ā[21]);ā[30]:0):ā<=6?(ā[43]];for(ā]]&&ā[41]);}ā[18]]),1);ā==null?(ā=null):ā[1]:0,ā[7]),ā[133]?ā+=1)ā[8]&&(ā,1):(ā[47]&&ā[202],ā[21];return ā-=2)ā<=4?(ā));if(ā<=34?(ā[44]&& !(ā+=-345:0;ā[2])return;else ā[33]]=(ā-1,ā[17])):ā[57];for(ā-1;ā[83]&&ā[8]=null;ā='\\r\\n';ā[51]=ā[27]&&ā(805);ā===0?ā[3];return ā[3][0])return ā===0;ā[51],ā[0]&&(ā)return[ā[41])return true;}function ā[26],true);ā){if((ā+=-200:0;ā(283);ā[6]](new ā(): !ā[100]?(ā[39]])return ā();}else{for(ā?0:0,ā[10],{},ā[4]===0?(ā===0||(ā[13]]/ā[2])):(ā[58]]||ā[213],ā[55](ā,this.x=ā[79]),ā+=-401;ā,false));}ā[501]());ā,'let'):0):0,ā[18]]>1)ā:0):0:0,ā[82]](0);ā);}return null;}function ā[22],'do':ā[0])[0];}function ā<=37?ā.y));}function ā[49],0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ā[4])?(ā().getTime(),ā[13],'extends':ā<<1)|(ā[92]+ā[22]||ā=1:0):ā[80]][ā.length===2)return new ā+=11;ā[26];while(ā[0]),(ā[3])];}function ā++ );}break;}ā[51]&& !(ā[49]];else return ā+=63:0;ā^=ā()*(ā[63]]?ā)>0?(ā[57]?( !ā]>>>ā[203],ā[94]<=ā[135],ā.length-4;ā<=22?ā[63]]^ā[8]?ā[41]?(ā<=44?(ā[40]?(ā='#';ā[60])[ā[63]]===ā:0;}catch(ā[36]&&(ā)0;else{if(ā[104])return ā]=\"$_\"+ā[18]+ā<=42?(ā[95];case'boolean':case'null':return ā(){return new ā[44];return ā[5]?ā,false)):(ā()]=ā<=39?ā]):0;}ā+=723:0;ā[498]();ā]))return true;return false;}function ā]-- :ā[1]!==ā[14]);}function ā(42,ā<=48?(ā[18],'return':ā[5];}function ā=Function;ā==0){ā[56]);}}function ā[39]],this[ā]);}else ā[4]=ā[43],\"\");return;}return ā) !ā[11]]():ā[4]+ā[80]));}catch(ā();function ā<=73?(ā[16]){ā[2])),ā);}while(ā-- ;}this[ā[5]++ ;for(ā++ ]));return ā+=-563:0;ā[50]]):0,ā[61]+ā[88]]){ā]):0;}}function ā[6])||( !ā[26],'catch':ā[18]]>0)for(ā===250?ā(421,ā+=-169:0;ā[499]();ā(132,ā[4]=1,ā+96));}ā=\"\";}ā[56]);ā=Error;ā[26]-1)?0:ā+=-239:0;ā[51])?ā===0)return false;if(ā[65];ā[61],'--');case 61:ā)return 0;ā);return;case 8:ā[58]+( ++ā,1);}ā[38]))||ā+=-408:0;ā[61];}catch(ā[33]];if((ā[48]];ā[160],ā(67);ā[159],ā+'\")'):0;}function ā[32])?(ā[9])||(ā[38]&& !( !ā[146],ā[48]]/ā[93]],this.y=ā);}else{if( !(ā[155],ā[65]]=ā[0].x,ā+=-171;ā[44])||ā[17]](this,arguments);}finally{ā(arguments[ā[35]);return ā=='var'?ā[8]]=ā[55])===0;ā=false;try{ā);break;case 55:case 2:ā+=2)ā[1]];ā();return;case 22:ā();break;case 2:ā;}}}function ā[5][0]||( !ā[0]:0;return ā[6]))&&ā[33]]<<ā]='\\\\':0;return ā[34]);switch(ā(9,ā]&=ā]++ :ā[94]);}function ā[58]),'');}function ā[49]]=ā[5],unique:false});}function ā+=322:0;ā[18]]-1]=ā[48],ā[7]]=ā(507)+ā]=1:0,this.ā[54]];}function ā[42])):0,ā=true:0):0;if(ā[18]]&&ā+=126:0;ā+=-483:0;ā>0)if(ā[20]))&&( !ā());else if(ā,this.y=ā<=113?(ā[59]);return ā,false);break;case 59:ā=this,ā[9]){if(ā[8],'<<=');default:return ā[6]]('try'),ā=Math;ā)):0, !ā[1]);for(ā[71]){for(ā===''))&&ā[112]?ā[8]))||ā=0;return{ā=\"\"+ā[42]);return ā+=-486:0;ā[29]);return ā=\"\",ā[57],'>>');}default:return ā[1]),(ā[28]){if(ā+=580:0;ā[60]]=ā[73], !ā[53]){this.ā()).ā())/ā==='img'||ā[51])[0]+ā[51])[0],ā<=91){if(ā[154])return ā))|(ā+=320:0;ā[95]),ā[22]:0):0,ā[84]),ā[74]);}return ā[57],'with':ā[62]]))return true;return false;}function ā[3]);else{ā[62])):(ā])return true;return false;}switch(ā;}else if(ā[29])!==ā+=-103:0;ā[13]||ā={'false':ā[49])):0,ā[7]):0,ā){case 45:ā++ ]=null;}else ā[1]]:\"{}\");ā[28]))break;ā[85]+ā[44]&&(ā[58]);ā(321);ā[178]){ā[74])return true;return ā[88]||(ā[73]]))),ā;}else{ā[58]&&( !ā[0]>>>0;}function ā('-->')&&ā[22];return ā[41]]){ā[63]])return ā]<<ā.reverse();return ā+=-10:0;ā[103]?ā[41]);}}function ā!=null)return ā<=24?(ā[39]](ā[50]];}}}function ā,''));ā[23],'ig'),ā[47]]&&ā-=1:0,ā){for(;;){while(ā;}if( !ā)return false;}return true;}function ā===251?ā[0][0]&& !ā+=43:0;ā[4]=0,ā[82]]+ā[19]);return ā[33]);break;default:if(ā]);if( typeof ā+=231:0;ā[12]))&&ā):0, typeof ā[82]]=ā[152]?ā[18]]+1),ā).split(ā[59]](ā[59],'finally':ā){this.x=ā),((ā+=418:0;ā,false);if(ā]|=ā[44]]-ā[45]](ā[45]?ā+=529:0;ā[18]]>1&&ā<=28?(ā())){if(ā[47]:0):ā+=612:0;ā));}catch(ā[185],ā+=17:0;ā[45]+ā[59]);default:return ā)];}function ā[84]);return ā]=1;return;}ā={};}ā[3]);else if(ā[83];return ā);return{ā.charCodeAt?ā[16]),ā={};for(;ā[52]&&ā[56]||( !ā(34);ā[16])[ā(327,ā))||((ā.length===1)return new ā[181],ā[37],ā[17]?(ā[8],'|=');case 124:ā){case 0:ā+=-400:0;ā<=72?ā++ :0;}function ā=false;break;}ā++ ):0;while(ā[0]?(ā[58])];}function ā[49]=ā[82]?ā;switch(ā++ )==='1',ā[49]*ā[49]-ā[52]=ā[49]/ā[214]],this.ā+=136:0;ā[80]], !ā[78]];ā[94]]),ā<=0?(ā=1):0;break;case 1:ā[5][0]&&( !ā[87]+ā<=30?(ā[61]),ā('',ā<=70)throw ā[41])>0&&ā[36]=ā[61]):ā>0)ā[95])||(ā[10],'yield':ā[9])&&(ā[55]&& !( !ā(1))if(ā<=77?(ā[78]),ā[46]]('');}function ā[49])){if(ā,0);if(ā[20].ā[80]);return ā[61])if(ā<=17?(ā[16]);}ā();}if( !ā+=57:0;ā);}}}catch(ā())break;}}while(ā[40]]=ā[63]-(ā[18]));ā]: ++ā, typeof ā[3]],'',ā[69]][\x00쓯(\"r2mKa0\\x00\\x00\\x00vɏ\\x00%v%'%2%?%B%>%,%A%@%%&%%5%.%-%4%$%=T1&\\n] D&&\\n^ I&5 >&>&\\x00)<\\n_&\\x00\\n*=z\\ne&\\x00\\n&\\x00\\ng&\\x00\\nh&\\x00\\ni&\\x00\\nj&\\x00\\nn&\\x00\\no0\\np&\\x00\\n\\n&\\x00\\nr\\ns&\\x00\\nt\\x00\\n	F &\\x00  D&?+\\n< & D&0\\n< & D&\\n< & D&!\\n< & D&e\\n< &  +\\n< &&\\x00\\n< & D&?\\n< D&9\\n D\\n D&6\\n = I&_% D&L<\\x00\\x00·$  D&3 D&!\\n  D&?q  D&\\n3 D&\\n D&!V  Dê D&\\n &\\x00<$ f &\\x00  D&?qV<; &\\x00  +\\n< & c I&^ D&)<< & Dâ3 & D&\\n< & D&' & D&!E<\\x00\\x00\\x00\\x00(#R	.1ĥ k֛\\n!  ?\\n1֛ D&\\nY\\n\\r D&+Y\\nV D&Y\\n D&MY\\nT D&Y\\nU D&-Y\\n\\\" D& Y\\n+ D&!=@? D&O\\n \\x00 >&4 I&	:<\\n >& D&;,\\x00&\\x00\\n&\\nI&\\n&\\n&\\n&\\n&\\nN&\\nO&\\r\\nP&\\nQ&\\n&\\nS;\\x00 D&#O\\n \\x00 >&4 >&:<\\n;>\\n\\x00\\x00\\x00>\\n\\n&\\x00\\n D&1=\\n\\n<$6â\\n D&;\\n\\x00 >&@\\x00 >&\\n D&43 D&4\\n^\\n\\x00+`< D&46M\\x00\\\"\\x00\\x00	\\x00[&\\x00\\n #/=\\n\\x00 ,\\n\\x00\\x00é\\n\\x00=\\n=\\n&\\x00\\n#=\\n D&1\\n.,=\\n.M$6*	8\\x002R\\\"\\x00\\x00/=2\\n=2\\n8\\x00 >&9:<\\n\\n2\\\"\\x00\\x00\\x00 D&!]%]%_+\\n^%^%]E\\n_\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00&\\x00\\\"\\x00\\x00$	\\n\\r\\x00\\x00 c I&\\x00)< D&?^\\\"\\x00\\x00´>\\n&\\x00\\n D&?\\r\\n<$6*&\\x00%]+\\n<&\\x00 D&3!&%^	+\\n<&\\x00&\\nE\\n<;&%_\\n+\\n<&\\x00\\n D&?3&\\x00r\\n< D&3 D&\\n<$6=\\\"\\x00\\x00	²\\x00¢\\n\\x00&\\x00\\n\\x00R D&?a\\x00Rn\\n\\x00 >&9+:<*\\x00 >&9+)<\\n\\x00=\\n\\x00à&\\n>\\n&\\x00\\n D&*@\\x00R\\n\\x00R\\n D&?an\\n\\x00 >&9+:<\\n<$6J\\\"\\x00\\x00 \\x00! = I&D\\n = H&\\n\\x00(#R	.1 D&&YE\\n22222\\x00\\x00\\x00   >&)\\nq >&\\n I&\\n &5\\n \\r D&.5\\n2;8 >&\\x00\\n< >& >&\\n< I&\\n< I& >&\\n<; = >&\\n<\\x00^\\rk֗2\\n\\r >&2*2	&2\\n&T\\n<\\x00.\\n..\\x00P\\n.P  >&\\x00:<\\\"\\x00\\x00 F&6\\\"\\x00\\x00M\\rk֗2\\n\\r I&2*2	&\\x00\\x00&\\x00)..\\n<\\x00P  >&\\x00:<\\\"\\x00\\x00 K&&\\\"\\x00\\x00	\\x002\\\"\\x00\\x00[ D&<\\n' D&\\x000\\x002\\n F&% F&% N&\\n¡\\n D&\\x00; D&i\\x00\\\"\\x00\\x00\\x00#' = H&\\x00\\n< = H& >&\\n<\\x00\\x00ǰ\\x00' >&\\x00:<\\\"\\rk֗2\\n = H&2*2 ?\\n\\x0072\\x007\\n >& 7 >&\\x007 >&)..\\n<;R\\x00- >&,0\\x002\\n\\x002\\nT\\n\\x00 >& 7 >& >&)..\\n<' >&\\x00>\\x00??:<\\\"P\\r = F&E\\x00<\\\"/.\\\"' >&\\x00>\\x00??:<\\\"/.8'± I&D I& = H&Y I& K& H&' I&<; I& H&' I&\\n<;_'?\\x00 I&\\x00 I& K& H&' I&<;( = H&( I&!ç<!b\\n; I& = H&( I&!ç<\\n< >&\\x00>\\x00??:<\\n = F&E<\\n\\\"\\x000*\\x00\\x00\\x00 I&Y\\x00)< I&Y)< F&	<\\x00\\x00 A&[/<\\n2\\x00 I&/<\\\"\\x00\\x00ã\\x00 >&&\\x00W*j\\x00  >&+\\n\\x00³\\x00D2\\n = C&2<\\n = A&8( I&!b >&*!* I&0!<\\n M J&((k֚!!֕!֚( C&E!!֕!ѥ( K&!!֕!Ɵ( >&-!!֕!-( A&!!֕!ʻ<*j\\x00;*j\\x00\\x00\\x00\\x00*j\\x00\\x00 <&\\\"\\x00\\x00\\x00> = I&D4 = I&D\\x00\\n< = I&D >&\\n< = I&D >&) >&)\\n<\\x00|\\rk֗2\\n = I&D2*22\\n\\x002\\nT\\n\\x00 >& 7 >& >&)..\\n<\\x002\\n\\n.7\\\"\\x00\\x00 W&\\\\\\\"\\x00\\x00Y\\x00O&\\x00\\n\\x00 >&=\\r333\\x00\\n&\\x00&0; I&<B\\n >&\\n)<\\\"$6J\\\"\\x00\\x000\\x00(\\x00-+\\n\\x00\\n2\\\"\\\"\\x00\\x00r\\x00[\\n\\x00@ D&=O\\\" \\r D&5\\\"\\x00\\nD&\\n&\\x00\\n*\\x00(\\x00-+\\n2\\n&\\x00\\\";'\\\"&\\x003\\\"\\\"\\x00\\x00 \\r D&5\\\"\\x00 D&92\\\"\\x00\\x00 \\r D&5\\\"\\x00 D&!2\\\"\\x00\\x00\\x00 \\r D&A5\\n e\\r  D&7't> H&3? [&\\n? S&? G&;? A&V? G&K? N&? J&^? N&? [&F? S&? J&F? <&R? S&M?\\n = >&\\\\\\x00\\n< = >&\\\\ >&\\n<\\x00D&\\x00\\n >&\\x00¡\\x00e2\\\"c6+	\\x00e\\\"\\x00e\\\"\\x00\\x00 W&	\\\"\\x00\\x00ʠ\\x00 >&* >&*\\n<\\x00 I&0 I&0\\n<\\x00 I&V[\\n<\\x00 G&\\x00GD\\n<\\x00 I& F& -h >&< >&&\\x003 \\r D&.5K\\x00 >&< >&< >&*\\x00GD2\\n<\\r$$\\x00 I& i >&]\\x00 >&<)<\\n<\\x00 I&[\\n<\\x00 I& I&\\n<\\x0040ƍ I& ? I&0 I& I&ţ >&< I&\\n >&< >&&\\x003 \\r D&.5Ĳ\\x00 >&< >&< >&*\\x00GD2\\n<\\x00 I&\\x00 >&<\\n< F& [&=)<\\n I& ? I&0* >&& C&1)< D&7 >&& H&Q)< D&7  = K&%A\\x00) F&F\\x00 >&< H&Q:<\\n I&% W&$)< >&&\\x00\\x00 I&V\\n<;U = >&\\\\K = >&\\\\ C&)<\\n I&\\n< G&\\x00 >&<	< C&P G&=&\\x00\\x00 I&V\\n<\\r\\x00 >&< >&<\\n<\\r\\x00 I& I&\\n<\\r\\x00 I&V I&V\\n<\\x00\\x00Ā I&\\n> <&?\\n> J&W? I&?\\n\\x00>&\\x00\\n >&}-,\\x00,W I&\\x00 F&)\\r\\\"\\\"\\\"\\x00 I& I&\\n<\\x00 >&< >&<\\n<;\\x00\\n<$6&\\x00\\n >&7-,\\x00,\\x00\\n<$6D\\x00\\x00\\x00©> F&R? H&W? A&? F&? J&+? N&]? F&? K&9? C&? J&? K&?? L&	?\\n&\\x00\\n >&K\\n47\\x00\\n<(\\x00 & >&4)<\\x00\\n<\\x00  >&4)<\\x00\\n<$6X\\x00\\x00\\\"\\x00³k_\\x00R88\\x00/<\\n;E88\\x00&\\x00)<\\n;388\\x00&\\x00&:<\\n;88\\x00&\\x00&&P<\\n;\\x008\\x00 H&W+8\\x00 >&8 >&\\n<\\r8\\x00 >&*8 >&*\\n<8\\x00 F&	8\\x00 K&98\\x00&\\x00\\n.4\\\"\\x00\\x00\\x00kZe\\r``` I&0 >&<\\n\\x000\\n<;B >&*\\n\\x00&\\x00\\n<;. K&J	\\x00[\\n<;- >&,;\\x00\\n<\\x00\\x00\\x00ê	\\x00&\\x00\\n.+ e ?, eY\\n\\x00& D&b;&\\x002\\n.G&\\x00GT\\n<\\x00 >& D&9O&;\\n.>\\x002\\x00> >&F- I&, >&F\\x00\\n<  >&:<\\\";L >& D&=$ >&&\\x00&\\x00>&&o<\\\"; >&&\\x00&\\x00>P<\\\"\\x008\\x00 >&F8\\x00 >&F >&48\\x00	<\\x00\\x00g	\\x00G\\x00).$\\n F&R H&'<\\x002&\\x00\\x00G&\\x00)..\\n<\\x00GP  >&<; I&&\\x00	<\\x00\\x00\\x00(\\n\\n>\\n.'0\\n.4\\x002\\x0092 >&\\n< I&\\n< <&E C&4]<\\n< G&Y J&(]<\\n<\\x00 I&\\n<\\x00 >&- I&,\\x00 >&\\n<\\\"D\\n28\\x00C2\\n8\\x00 I&\\n<8\\x00 >&- I&,\\r8\\x00 >&\\n<\\\"\\x00\\x008\\x00C2\\\"\\x00\\x00h >&8\\x00 >&\\n<'8\\x002\\r\\n2 >&5 \\r D&.5 >& >&4\\x00<; >& >&4\\x00\\x00<\\x00\\x00} >&8\\x00 >&\\n< >& D&1'8\\x002\\r\\n2 I&9 \\r D&.5 I& >&4\\x00d<; I& >&4\\x00\\x00d<\\x00\\x00\\x00¬   >&4\\x00 >&:<\\n >& D&4 D&! K&2T+0\\\"\\rWll/\\n C&\\x007	CC73 D&1 G&1C+ A&++C+0շ+T+ \\r D&!5'0\\\")\\\" D&! K&2T+0\\\"\\x00\\x00s  >&+\\n\\x00\\r\\x00D2\\\";R& D&?\\x00ê >&\\nW) D&9 C&+ J&\\\\+T+ \\r D&!5'0\\\"\\x00\\\"\\x00\\x00\\x00š\\rjjj = >&Z- I&, = H&\\n< = I&4 = I&4 >&) >&. = H& >&) >&\\x00\\n< = H& >&) >&M\\n< = >&\\n<\\r,, = >& >&) = H&\\x00<\\n< = >& >&)\\x00\\n< = >& >&) >&\\n< = >& >&) >& >&\\n< = >& >&) I&\\n< = >& >&) I& >&\\n< = I&4 = I&4 >&) >&. = >& >&) >&\\n< = >& >&) >&M\\n<\\x00\\x00\\n\\x00\\n\\x00\\n.Q\\x00>\\n.'\\x000\\n.4\\n I&\\x00\\n< I&N\\n< >&\\n< I&;\\n< I&=\\n< >&Y\\n< I&I\\n<\\x002\\x0092\\x00f >&\\x00 >&\\n<\\x00 >&&\\n2\\x00 >& D&1'\\x002\\r\\n2 I& I& >&4	<\\x00\\x005\\n2 >&\\x00 >&\\n< I&N I&N >&4	<\\x00\\x00F >&\\x00 >&\\n<'\\x002\\r\\n2 >& >& >&4\\x00<\\x00\\x00 I&; I&; >&4	<\\x00\\x00B >&*\\x00 >&*\\n< >&\\x00 >&\\n< I&= I&= >&4	<\\x00\\x00B >&*\\x00 >&*\\n< >&\\x00 >&\\n< >&Y >&Y >&4	<\\x00\\x00  I&I I&I >&4\\x00<\\x00\\x00\\x00 = >&Z- I&\\r\\x00 = >&Z\\x00<\\n.B\\x00 = >&Z\\n.B\\x00\\n\\x00B I&=\\x00\\n<\\x00B >&Y\\n<\\x00B >&\\n<\\x00B I&N\\n<\\x00B I&I\\n<\\x00B >&F\\n<\\x00B I&;\\n<\\x00 I&= I&= >&4	<\\x00\\x00 >&Y >&Y >&4	<\\x00\\x00 >& >& >&4	<\\x00\\x00 I&N I&N >&4	<\\x00\\x00 I&I I&I >&4	<\\x00\\x00 >&F >&F >&4	<\\x00\\x00 I&; I&; >&4	<\\x00\\x00\\x00\\x00Q'  = >&Z >&) >& >&\\x00<&\\n\\x00\\n = >&Z >&) >& >&4\\x00Q&\\x00&f<(\\n I&&\\x00\\n< >&G\\n< H&\\n<\\x00' >&	<! >&\\x00 >&\\n< >&4\\x00<\\x00\\x00\\x00«\\x00Q'  = >&Z >&) >&M >&\\x00<&\\x00\\n\\x00' >&p\\x00'\\n I&&\\x00 >&G&A = >&Z >&) >&M >&4\\x00Q&\\x00 H&&f<\\x00' >&/&<$6\\x00\\x00\\rk֗2*2\\x00\\x00QC2\\\"\\x00\\x00 F&6\\\"\\x00\\x00\\rk֗2*2\\x00\\x00QC2\\\"\\x00\\x00 K&&\\\"\\x00\\x00\\x00^&\\n\\x00\\nQ\\n >&&\\x00&d<(\\n I&&\\x00\\n< >&G\\n< H&\\n<\\x00' >&	< >&4\\x00<\\x00\\x00\\x00p\\x00Q\\n&\\x00\\n\\x00' >&U\\x00'\\n I&&\\x00 >&G&& >&M&\\x00 H&<\\x00' >&/&<$6d\\x00\\x00 D&!=@?=ß\\x002'\\\"'\\\"- >&	- H&	- >&80+\\n D&&\\x00YE\\n >&W  >&+D.+\\n\\\"\\x00\\x00V>\\n D&$O\\n@>Ü\\n&\\x00\\n >&% >& \\x00 >&40֑:<	<$62\\\"\\x00\\x00#\\r\\x00\\x00 H&\\x00 H& >&/<\\\"\\x00\\x00\\x00N=2\\n\\x00C ' >&4\\x00&\\x00 DP<\\n\\x00\\x00 D& D&E D&\\x00h \\r DÜ5\\x00*%>\\n>=æ?=ã?=ä?\\n\\x00>?2&\\x00r\\x00\\x00h&\\x00\\n >&T\\n&\\x00\\n >&&  >&4\\x00:< D&;$63 >&\\\"$6a\\\"\\x00\\x00\\x00H \\\\\\x00\\\\\\n9 I&Q\\n' >&/<\\n  >&4=å:< D&3={\\x00h\\x00\\x00\\x00F\\x00\\n	\\x00>\\n2={g D&nph(	#D\\x00#T#.#$#\\\"#8\\n#C#&#P\\\"ô8\\x00- >&,0j\\x008\\x00k\\n28\\x002\\nj\\x00 D&\\r*2	(\\n8\\x00~\\n8&\\x00\\nj D&0\\x00j \\r D&.5	 D&\\x00j\\n \\r D&5\\n \\r D&	5\\n 9¤\\r\\n D&>\\x00j¤  D&?W	8 D&b5	 D&\\x00j	 D&	\\x00j=5\\n2\\n8\\nD,T\\nj\\x00\\x00\\x00q\\x00P0\\\"\\x00\\x00>\\n.P  >&+\\n\\x00- >&\\x00a/   >&4\\x00 >&:<\\n\\r/\\n)\\n\\x000\\n\\x00\\x008\\nC2\\\"\\x00\\x00\\n ?7\\\"\\x00\\x00¯\\x00 I&\\n  >&4\\x00+)<\\n=2 H&, &5 \\r D&.5@ D&=2\\nUN\\x00\\n.&;F ?[0 I&\\n I&\\x0040 F& -	\\x00\\n.&\\\"0\\\"\\x00\\x00<=2 &5 \\r D&.5@ D&=2\\n\\x00\\n.&\\\"\\\"\\x00\\x00N\\\"\\x00\\x00\\x00\\x00\\x00I D&=O\\n  >&4%N >&J%O >&3o<\\n= @ >&; = H&;9P\\x00( D&6#5 D&\\n#!&\\x00#K#S\\\"\\x008\\x00V\\x008\\x00\\x00\\x00   D&\\n>=2?:.F\\\"\\x00\\x00\\x00B @ >&8 >&	)<\\n >&\\n< @ >& >&	< >& I&\\x00]<\\n<\\x00S\\x00 >&'\\x00 >& W&\\x00 >& <&V( I& >&N	< >& I&[]<\\n<\\x00\\x00\\x00 D&nY\\nb=r\\nc\\x00\\x00 D&=w\\n% D&*\\x00\\x00\\n=r%b+%c\\\"\\x00\\x00\\x00\\x00(#R#0	.1\\x00\\n\\x00Y D&7O\\n I&  K&+\\n2 0֏+\\n2;  L&+\\n2 0վ+\\n22	=2\\n*2\\x00\\n\\x00/\\x00\\n*=2\\n8\\x00&).;\\n=«&C\\n2\\x00\\x0062\\n @ I&ANP @ H&-NP @ I&\\nNP%Ug\\x00\\x00 D&*\\x00\\x00'\\x00 I&U\\n D&0 D& D&=*\\x00\\x00 D&1*\\x00\\x00 D&9*\\x00\\x005 D&nY\\n\\x00I\\x00IW\\x00I\\nb\\x003\\nc;\\nb=r\\nc\\x00\\x00R\\rMMM = H&# = I&: J&0 + W&+\\n2 @ >&6=_ I& I& H&$+;\\n<\\x00\\x00Ď\\rĉĉĉ  >&4 @ >&6:< D&3 D&?\\x00g = H&# = I&Ò  >&4 @ >&6:< D&3\\n\\x00b\\n G&\\n I&G/< D&s	< K&\\\"+ H&K/<+\\n @ >&6=_ I& I&\\n H&$+;\\n<$ ' @ >&6 >&&3 ==T W&& A&^ \\r D&!5' \\r D&<5 = J&J [&@	<;\\x00\\x00\\x00'>\\n c >&S%b)<X c >&S%c)<X\\\"\\x00\\x00E\\r>>>è\\n >&&\\x003$=«!\\n*(#I#3\\\"(\\\"\\x00\\x00j\\x00 DèE\\n=z+\\n K&\\\"b H&K/<+\\n 8 >&4 >&&:< K& H&$& D&Y K&*\\\"\\x00\\x000\\\"\\x00\\x00& @ >&6\\x00 >&++=2+ A&!+%T2\\r+\\n<\\x00\\x00\\x00\\x00\\x00*\\x00\\x00 >& D&4^&\\x007\\x00B\\n\\x00\\x00A\\n\\x00\\x00\\\"\\x00\\x00Î&\\n '(5\\n >& >&\\r D&!\\n\\n\\n\\x00'>\\n\\x00>?\\n\\x00} D&!ç\\n} >& D&4O D&49©=u&\\x00Dª}\\nR\\n>\\nXn\\nª\\n I&5y+\\\"\\x00\\x00U\\x00 >&9&)<\\n\\x00\\x00¢\\n\\n' \\\" >&9 D&1)<R\\n*7 \\\"\\\"\\x00\\x00.\\x00 \\n \\n&7 D&!7l\\\"\\x00\\x00\\r\\x00C#\\n\\\"\\x00\\x00Ï\\x00 \\n'\\n&7 D&!7l\\nl\\nl\\n=u&\\x00D\\n D&49© D&!9\\n**ïK\\nl\\n&\\x00\\n		 >&'\\r	\\n\\n\\n5*\\n	.9	$646R\\\"\\x00\\x00\\x00>\\n>\\n(#R#2#1#;#F\\n\\r = H&;9P\\r*\\r*ú\\r*ö\\r*\\r*\\r*%\\r*<\\r*ð\\r*C\\r*E\\r*÷\\r*ì\\r*ø\\r*ñ\\r*G\\r*î\\r*ô\\r*F\\r*D\\r\\\"	T >&5)<\\n&\\x00\\n >&\\rA.R$62\\n2	&* D&qg \\r D&F59\\x00\\x00^2	 >&5)<\\n&\\x00\\n >&0\\n ?,$6& D&!* \\r D&5\\n%9 D&Pf \\x00\\x00 >&\\x00	<\\x00\\x00 >&\\x00	<\\x00\\x00=zù\\x00\\x00& >&5>?)<\\n;\\n\\x002\\\"\\x00\\x00¡>\\n&\\x00\\n >&\\n!\\x005r\\rmmm[\\nK&\\x00, F&5+Z\\n'1>\\n	.S >&K&\\x00,K F&5+9Q >&5V}$6\\\"\\x00\\x00f @ I&% >&	)<\\n >&&\\n&\\x00O5 >& I&3)< H& F& >&N	<H6< D&!=@?\\x00\\x00  D&\\rttt @ I&% >&	)<\\n=û\\n >&&\\x003L&\\x00=&\\x00=a' D&1\\x00g;&  >&4&\\x00 >&%N:< D& D&1\\x00g\\x00\\x00\\x00\\x00\\x00(#R#0	.12\\x00\\x00+ D&9Y!&\\x00\\n \\r D&5 D&\\n%&f\\x00\\x00g = I&M\\n H&=_ >&V >&&%Q)< D&74=_õ\\n?%Qó\\n.?ò\\n H& K&0d<\\x00\\x00\\x00\\x00ò D&!w\\n'=_\\n&\\x00 >&\\x00,%  >&4 I& I&* H&9i<\\n;& I&B\\n  >&+\\n >&V >&&)< D&7 >&^ (+\\n; >&^ >&V+\\n2 D&?w^\\n D&w^\\n	k\\n\\n\\n	D,T\\n&\\x00w\\n	;*À=_ >& >&\\x00¹&\\n=_ >&V\\n\\x00 >&3¹&\\nw ==T\\n >&=\\n \\r D&>5  >&4 H&:< D&79  >&4\\x00 >&3:< D&,\\n >&:\\x00; >&3\\x00%Q >&+=z+\\x00=_ >&(\\x00+	<\\x00\\x00 @ >&8 >&)<\\n >&$ I&( H&>< >&\\x00\\n< @ >&8 >&B)<\\n >& \\n< >&\\n< >&	<&\\n.* >&H H&% >&E\\n< @ >& >&	< >&\\\"A<\\x00\\x00\\x00~\\x00k\\n[,@ D&!@&\\n@ D&1LE0,\\n<=´ºEE;A\\\"; &\\x00\\n0\\n.H&\\x00D,T\\\"\\x00\\\"\\x00\\x00\\x00=u­\\n I&9 >&++\\\"\\x00\\x00	³\\x00'0\\\" \\x00 >&4\\x00 >&::<\\n>\\n&\\x00\\n >&s&a5V c F&U D&! D&0:<í\\n0+ć\\n F& H&5+R+\\ny\\n >& >&++	<; >&	<c6 >&. >&:)<\\\"\\x00\\x00	\\x00=uĄ\\\"\\x00\\x00ŏ \\r D&b5'\\n>?0?&\\x00?\\\"\\x00\\n&\\n'\\n>?0?&\\x00?\\\"0\\n&\\x00\\n\\x00(\\n F&*\\n¯&\\x00\\n >&\\n		&\\x00a	&\\n;;t	&	&H \\x00 >&4	& >&:<\\n\\n&\\x00\\n\\n >& \\n D&^&\\n&a\\x00c6- >&&\\x003&\\x003\\n>???\\\"c6ª\\x00H0\\n  >&4)<\\n W&U\\n\\r\\r\\rċ\\r>?? D&?\\\">?0?&\\x00?\\\"\\x00\\x00\\rȯ	\\x00N D&?\\x00 D&\\x00 D&igp D&!\\n D&5&\\x00\\x00(\\n\\x001\\n\\n0\\n\\x00+\\n&\\x00& >&&\\x003\\n\\x00((\\n D&	5''&\\x00&&\\x003&)\\n;0\\n;0\\n'=5\\n D&m\\x00\\x008\\n&\\x00\\n&\\nC¶\\n	  	:.; &5C\\n\\n \\n D&05%I\\n0\\n >&&\\x003F\\x00#\\n0տ >&&\\x003 >&:+ >&:+ >&+\\n+\\x00E;§ >&+\\n+\\n >&:++\\n \\n D&5<\\x00A|0օ² D&\\x00A >&& >&3)< D&\\x00A >&& >&\\x00)<\\x00@ D&!\\x00@&\\x00#+\\x00E+\\n;\\x00A|\\x00E+\\n(#T >&+\\n+#6#C\\\"\\x00\\x00		\\x00-~0\\n&\\x00\\n07\\x00\\n.(&\\n&\\n'\\\"\\x00(vs\\nvs\\n: D&56\\n: D&>57\\n+R\\nO\\\"\\x00\\x00- D&V\\x00\\x00 ?C¶\\n   D&1:.;\\n\\\"\\x00\\x00=Ċ\\n\\x00 ?>?C\\\"\\\"\\x00\\x00ń\\x00'>0?\\x00?\\\"\\x00 >&# >&:)<\\n\\x00>\\n0\\n&\\x00\\n\\x00 >&°\\x00\\n >&# >&)<\\n >& D&!&\\x00 &\\x00%I>0?0?\\\"&\\n;X >& D&!\\r&\\x00 F&a;7 >& D&!\\r&\\x00 I&9a\\r&*\\n; >&	<$6½@\\x00  >&V >&9&)<> 4? (~?\\\"/\\n)\\r >&)	<>? >&. >&:)<??\\\"\\x00\\x00!\\x00?0\\n&\\x00\\n\\x00&\\x00\\n.(&\\\"\\x00\\x00\\r\\x000\\x00\\\"  ?	- >& ,\\x00k\\n[\\x00\\\"@ D&=33\\\"<=´º1(?E+\\n@&\\\";  >&4#:<\\\"3\\\"\\x00\\x00f\\x00?[\\x00(\\n\\x001\\n\\x00(7\\n,0\\n\\x00@ D&!\\x00#\\n\\x00(+\\x00E+\\\";\\x00A|\\x00E+\\\"\\x00A\\\"\\x00\\x00\\x00~ ĉ\\\"\\x00\\x006=r\\n%e3\\ne;e$%e D&:5&\\x00b= DÞE D&vE+\\\"\\x00\\x000\\n\\x00 >&\\n&\\x00\\ng\\x00\\n I&X D&!+> K&'B\\n\\x00&+ >&)<\\x00 D&!+ >&)<\\n D&9;$6n\\\"\\x00\\x000\\n\\x00 >&\\n&\\x00\\nx\\x00\\n I&X D&!+@ K&'B\\n\\x00&+ >&)<\\x00 D&!+ >&)<\\n D&9;; >&3$;$6\\\"\\x00\\x00ĉ\\x00(\\n\\x001\\n  D&\\x00A >&& I&*)<7F \\n D&5<\\x00A|0օ². D&\\x00A >&& >&3)<7 D&\\x00A >&& >&\\x00)<7!={\\x00 >&( N& >&B0:<\\nvs\\n D&	5 >&( [&$ >&B0:<\\nvs\\n D&56\\n D&>57\\n+\\n>R??\\\"\\x00\\x00\\x00û K&Z\\n D&R K&&9Q D&rO0\\n >&# >&)<\\n>\\n&\\x00\\n >& >&	<$6'>\\n	\\r\\n=\\n		 >&&\\x003o D&=O0\\n%S+\\nk\\n\\r D&0\\n\\r&\\x00D,T\\n	 >&. ] I& D&)<)< >&9&\\x00 Dä:<\\n=u­\\nĀ\\x00 >&\\n&\\x003\\x00 >&\\x00\\n<\\x00B&\\x00\\n%\\x00 >&&)< D&7$6-8\\x008\\x00 >&\\x00\\n<\\x00\\x00\\x00Ò = >&\\n\\n ==T\\n = I&F\\n M I&\\x00l> I&\\x00? >&5=)< >&5=T)< >&5 @ I&)< >&5 I&F)< >&5=)< >&5=)< >&5> F&H?)<\\n\\r\\r\\\";=>0փ I&\\x00+? >&5\\x00=l)< >&5=)< >&5=)< >&5> F&H?)<\\n\\r\\r\\\"\\x00¿ M I&\\x00 =)<\\n M H&A)<\\n>\\n*2&\\x00\\n >&}\\n =\\n		- H&\\r	 = A&%7;J	+\\n\\n >&\\n	<	- >&, = >&)(*;	- >&  =(*$6 K&5/<\\\" >&\\x00-+ >&!+\\\"\\x00\\x00Ů M I&\\x00\\x00)<\\n M H&A)<\\n&\\x00\\n >&ŀ\\n0z4 I& ?,C0\\n I&- >&, F& I&+\\n >&\\n G&7+++	<0_4 >&_ ?,C0\\n >&_- >&, F& >&_+\\n >&\\n N&Z+++	< >&4x0\\n >&- >&, >&- >& >&- H& F& >&+\\n >&\\n L&2+ >&2+ >&%+++	<$6ō\\x00\\x00\\x00Ɗ M I&\\x00\\x00)<\\n M J&O\\x00)< >&T\\n >& =4 M I&1 M I&\\x00 >&))<:<\\n M H&A)<\\n>\\n*2&\\x00\\n >&Ĉ\\x00\\n- H&\\r;ë >&U++ >&+-+ >&!+\\n- >&, >& N&@++	<;©- >&	- >&[ ? >& L&++	<;m- >& b >& L&++	<J >&U++2\\n	&\\x00\\n\\n\\n	 >& >&	\\n	<\\n$6  >&&	<$6ĕ K&5/<\\\"\\x00\\x00 >&\\x00-+ >&!+\\\"\\x00\\x000\\n&\\x00\\n\\x00\\n0պ$6\\\"\\x00\\x00	ë>\\n*2ZØ\\rÓÓÓ0\\n\\n- >&, F&P0++\\n;$- >&	- H& F&P0++\\n >&22+ >&%+++	<- >&  D&?WM\\x00 = I&4Y'8\\x00 D&1+D2\\n&\\x00\\n >& >&	<$6 \\\"\\x00\\x00 =\\n I&\\n> [& ?\\n >& >& H&1R @ >& H&1/<\\n> H&]? >&\\r? F&? H&R?0}? >&0? I&Z? H&!?\\n G&N2	\\\"\\x00\\x00Ǧ =\\n I&\\n I&F\\n> J&?\\n> F& ? F&3? K&? F&Q? [&\\r? N&? F&]? H&V? G&U? G&G? W&Z? A&>? S&? G&4? G&^? K&? [&?\\n N&7N2	 K&C> >&\\r? H&^? F&? N&&? G&\\\"? C&Y? >&0?\\n K& <&\\rN2	x> >&E?\\n G&N2	 >&U> F&? H&^? H& ? H&.? C&? C&8? S&? <&5? A&? G&?\\n	 >&	 L&/N2	x> H&B? K&? K&	? F&?? F&,? F&\\\\? >&\\r? >&0? <&6?\\n\\n\\n S&;N2	 H&7%> >&-? [&E?\\n H&7 G&EN2	\\\"\\x00\\x009&\\x00\\n >&'\\n >&+ >&%+\\x00+	<$64\\x00\\x00\\x00 =&\\x00D2\\\"8> =??\\n??\\n&\\x00\\n >&\\x00\\\"$6\\\"\\x00\\x00\\x00\\x00\\x00Đ>\\x00?\\n\\x00\\n1\\n1ĥ\\n1֞=\\n S&Y >&B\\n	(0ֈ!֎0֊!ր0ռ!ց0֖!ս0֍!֝0֙!L0֜!ֆ\\n\\n\\r³¹¹\\r\\x00*/1ĥ\\n ?\\n C&\\n;- >&,\\n C&\\n;w- >&	- H&\\n]\\n;W- >&\\n\\n;B- H&\\r0ւ >&/<+\\n;#- >& \\n\\n;0֔0++\\n\\\" W&\\\"\\x00&\\x00\\x00\\n<\\x00&\\x00\\n<\\x00&\\n<\\x00\\x00\\rԢ\\x00&\\x00 D&\\re\\x00&*2/1ĥ\\n\\x00& D&r	1;9\\x00& D&&'	1;!\\x00& D&g	1;	 <&(\\\\F;Ұ\\x00&\\x00 D&!\\x00&\\x00 D&9Ǡ\\x00&*2/1ĥ\\n\\x00&*2/1ĥ\\n\\x00& D&]\\r+	1;Ơ\\x00& D&\\r	1;Ɔ\\x00& D&p\\rE	1;Ŭ\\x00& D&H\\rq	1;Œ\\x00& D&M\\rS	1;ĸ\\x00& D&#\\r5	1;Ğ\\x00& D&y\\r^	1;Ą\\x00& D&c\\r3	1;ê\\x00& D&5\\r	1;Ð\\x00& D&0\\rO	1;¶\\x00& D&\\rW	1;\\x00& D&I\\r	1;\\x00& D&J\\r7	1;h\\x00& D&2\\r	1;N\\x00& D&8\\r,	1;4\\x00& D&\\n	1;\\x00& D&4	1;ʶ\\x00&\\x00 D&9&\\x00\\n\\x00& >&\\x00&*2/1ĥ\\n$6*	1;ɰ\\x00&\\x00 D&?9\\x00&*2/1ĥ\\x00&*2/1ĥ;\\x00&*2/1ĥ	1;Ȫ\\x00&\\x00&\\x000\\x00&)1֞\\n&\\n	1;&\\x00	1;ǰ\\x00&\\x00&\\x00&\\x00 D&q\\x00&*2/1ĥ\\n\\x00&\\x00&'2/1ĥ\\n	\\x00&&\\x00\\n\\n D&!	\\n2	1;\\n'\\n	; ?	1;Ũ\\x00&\\x00 D&1\\r\\x00&	1;Ŏ\\x00&\\x00 D&6!\\x00&)1֞\\x00&)1֞B	1;Ġ\\x00&\\x00 D&	[	1;Ċ\\x00&\\x00 D&=\\x00&)1֞\\n	1;å\\x00&\\x00 D&\\x00&\\x00 D&+¦>\\n&\\x00\\n\\x00& >&# >&\\x00&*2/1ĥ\\n<$63\\x00& D&!2/1ĥ\\n&\\n\\nY/\\n'	\\n&& >&&\\x00:<; ?	1; >&[:<	1;%\\x00&\\x00 D&7\\x00&''	1;	 <&,\\\\F\\x00\\x00\\x00 <&>\\n\\x00\\n\\n\\\"\\x00Ĥ0\\n&\\x00\\n\\n\\x00 >&( G&& >&B0:<\\n\\x00\\n\\x00 >&æ >&&\\x00 >&O\\nR)<)<\\n >&&\\x00 >&O\\nR)<)<\\n >&&\\x00 >&O\\nR)<)<\\n >&&\\x00 >&O\\nR)<)<\\n	 D&!a D&1Mn\\n D&\\n5 D&1a D&!Mn\\n D&95 D&\\ra	n\\n ] I&)< D&7@ ] I&)< D&	7@ ] I&)<6ó2\\n\\\"\\x00\\x00Č0\\n&\\x00\\n&\\x00\\n&\\x00\\n&\\x00\\n&\\x00\\n\\x00 >&Þ\\x00 >&>)<\\n D& ] I&)<$;± Dæ3 D&(>\\x00 >&>&+)<\\n ] I& D&55 D&\\ra D&%5n)< D&!;_\\x00 >&>&+)<\\n\\x00 >&> D&!+)<\\n ] I& D&\\n5 D&6a D&%5 D&\\ran D&%5n)< D&96ë\\\"\\x00\\x00\\x00S>\\n&\\x00\\n\\x00 >&\\x00 >&>)<\\n<$6#&\\x00\\n >&9&)<\\n>\\n2\\\"z&\\x00\\n\\x00 >&h\\x00J>\\n\\x00 >&9 D&!+\\x00&++ D&!+:<2 >&	<\\x00&+ D&!+; >&\\x00	<$6u\\x00\\x00\\x00\\x00E	 J&&\\x00\\n<	 >&\\n\\x00)< >&L\\x00 >&(	\\x00:<+ >&L+; >&L\\x00+ >&L+\\\"\\x00E\\n\\x00\\n- >&;,0ն K&\\x00 >&>&\\x00)< >& D&4)<+ >&9 D&a)<+\\\"\\x00\\x00\\x00\\x00 >&\\x00\\n<\\x00\\x00-\\x00\\x00 >&&\\n\\x00 >&\\x00 >&&;&\\x00V<\\\"\\x00\\x00?>\\n&\\x00\\n\\x00 >&\\x00 DÛS\\n<$6# ] I& >&[:<\\\"\\x00\\x00O%k ?7%k\\\"\\r77 = >&\\\\=³<\\n ==T=¯\\n=ý\\n=Ć\\n ?,]k\\\"\\x00\\x00D\\x00c&\\x00\\n50\\n6&\\x00\\n7&\\x00\\n8&\\x00\\n9&\\x00\\n:&\\x00\\n;&\\x00\\n<&\\x00\\n=&\\x00\\n>&\\x00\\n?&\\x00\\nB&\\x00\\nC\\x00( D&9#5&#!&\\x00#K#R#0#S	.232+ 'N2.2222> H&? I&A? I&\\n?\\n&\\x00\\n >& @9P$6 @ >&! @=þ9P @=ā9P @=Ĉ9P = K&;\\r9P222	\\x00\\x00V2+=2$\\r D& DÚE2 = I&'3&\\x00<2& '\\r ==· ?,\\n2A22 DÝg2\\x00\\x00ë22&2(\\x00 V\\x009°\\x007°\\x008V\\x005X\\x006\\x00?X\\x00=V\\x00>V\\x00;V\\x00<V\\x00 \\nX\\x00BX\\x00 = F& p\\x00 = F&3p\\x00 = K&p\\x00 = F&Qp\\x00C¸\\x00%gX\\x00%hX\\x00%iX\\x00%jX%h D&1 D&Fną D&!\\x00r\\x00%r¸\\x00\\x00+\\r&&&&\\x00\\n\\x00 >&\\x00 =4\\x00h$6!\\x00\\x00\\x00h \\r D&5^\\rYYY @ >&8 >&	)<\\n\\x00'=ÿ\\n\\x00 >&=Ă\\x00+=ü+\\n< >&\\x00\\n< >&Y\\n< @ >& >&)<\\n\\x00 D&>\\x00h I& >&N	<\\x00\\x00 I& >&N	<\\x00\\x00č ==±\\r ==±- >&,@&\\x00h>=ă?0ջ? D&!2>=đ?=ę?=Ĕ? D&12>=ě?=ď?=Č?=Ě? D&?2>=ė?=Ē? D&42>=ē?=Đ?=Ę?=č? D&02>=Ė?=ĕ?=Ď?=ī?=ģ? D&2>=ĩ?=Ĝ?=Ī?=ğ?=Ğ?=Ġ?=ġ? D&2>=ĥ?=Ĩ?=ĝ?=Ģ?=ħ? D&<2>=Ħ?=Ĥ?=į?=Ĳ?=Į?=Ĭ? D&i2\\x00\\x00\\x00S \\r D&5 = >&W = >&W >&). = >&W >&) I&\\n = >&W >&) I&\\x00\\n<\\x00!\\n&\\x00\\x00 K&\\x00Nf >&\\x00:<\\\"\\x00\\x00H = >& >&k\\n(vs\\nR\\ni-1vs\\nR\\nj\\x00\\x00´\\x00=®a . >&4\\x00=® K&7P<\\n; \\x00=µa . >&4\\x00=µ K&P<\\nk\\n\\n@ D&=O&\\x00g	- >&B  >&4=Ļ:< D&3 D&F\\x00h \\x00 >&4=Ĺ:< >& D&1O D&\\x00h\\x00\\x00\\r\\x00&\\x00\\n&\\n	 \\r={5  D&!I ==T\\n\\n\\n >&= >&=ĵB)<\\n&^=ĺO\\n=&\\n=ĳ\\r== D& D&eE;\\x00*Ŋ @ >&8=d)<\\n >&0\\x00 >&0\\n< >&\\r\\x00 >&\\r\\n<&\\x00\\n&\\x00\\n\\x00=¬'2\\x00 >&0 D& D&j+\\n\\x00 >&\\r D& D&j+\\n=h0֐)<\\n=\\x00=\\n<=t=»\\x00=+0֘+\\x00=+0֘+\\x00=+0֘+\\x00=§+ >&2+\\n<=¨\\x00=¦d<=t=»\\x00=+0֘+\\x00=+0֘+\\x00=+0֘+\\x00=+ >&2+\\n<=£&\\x00&\\x00\\x00 >&0\\x00 >&\\rf<>?=&\\x00&\\x00\\x00 >&0\\x00 >&\\ri<=q?\\\"\\x00\\x00ó\\x00=&\\x00 D&j\\n<\\x00=&\\x00 D&j\\n<\\x00=&\\x00 D&j\\n<\\x00=0}\\n<\\x00=¬\\n<\\x00 >&-	5\\x00=§&\\n<\\x00==ı\\n<\\x00=¦=Ĵ\\n<\\x00 >&0\\n<\\x00 >&\\r\\n<;k\\x00=§==Ê&)<\\n<\\x00===Ê&)<\\n<\\x00=¦ ] I& D& D&`j)<\\n<\\x00 >&0&\\x00 D&j+\\n<\\x00 >&\\r&\\x00 D&j+\\n<\\x00\\x00\\x00 >& >&\\n\\x00 >&; >&\\n&\\x00\\n_\\x007\\x00&+&+7\\x00 D&!+ D&!+7\\x00 D&9+ D&9+7&\\\" D&16f&\\x00\\\"\\x00\\x00\\x00g ==¾\\x00<\\n D&!\\n D&!\\n(\\n >&-\\n<&N2=&\\n<2\\n >&&\\x00=/<\\n< >&\\x00\\n<\\x00ª @ >&8=d)<\\n=h0֐)<\\n=¼' >&0 >&0\\n< >&\\r >&\\r\\n<=¼&\\x00&\\x00 >&0 >&\\r\\\\<=&\\x00&\\x00 >&0 >&\\ri<\\n&=q2\\n*j\\x00\\x00\\x00C(\\n >&-\\n< D&7 D&7&\\x00N22&\\n >&9 D&1)<2\\\"\\x00\\x00Q(\\n >&-	\\n< D&\\r D&\\r&N22&\\n >&\\r D&!<2&\\n2\\\"\\x00\\x00\\x00\\r D& D&eE\\x00\\x00\\x00e ==Ķ\\n >&)='&\\x002C ==İ\\n4 >&)=ĸ'	 D&!\\x002C >&)='	 D&1\\x002C6\\r111\\x00 >&/<\\n >&&)<&\\x003 >&& H&_)<&\\x003\\\"\\x00\\x00\\x00\\n D&&?\\x00\\x00	\\x00 ?,\\\"\\x00\\x00: \\x00 >&4 >&:<\\n&\\x00\\n >&\\x00 ?,&\\\"$6\\\"\\x00\\x00,&\\x00\\n\\x00Z >&O >&\\n)<&\\\"\\x00\\x00\\x00Z  >&4:< D&,&\\\"\\x00\\x00« D&k\\n D&G\\n D&G\\n>\\n&\\x00\\n >& c I&^/<	<$6&q\\n c >&S D&E)<\\n2=&\\x00\\n >& D&!;$6%q\\n c >&S D&E)<\\n2>\\x00\\x00@\\r2;;\\x00b\\n&\\x00\\n\\x00b D&9$ D&s3;6 \\n2? D&:\\n2?\\x00\\x00# o\\n A&)\\n\\n2; D&?\\x002C\\x00\\x00\\x002 U\\x00 >&T, U >& >&, D&\\n2< D&4\\x002C\\x00\\x00\\x00\\x00\\x00\\x00\\x00! ==ĭ2&\\\" =Z\\r=ķa&\\\"\\x00\\x00&\\x00\\x00E\\x00\\x00\\x00ý * @=ň @=Ŀ&\\n2: D& D&5E&\\x002B&\\x00\\n=À\\n=Ł\\n=ł\\n>=ŋ?=Ľ??\\n ==Ç\\n ==Ň\\n	 ==ľ\\n\\n=Ņ\\n=ŀ\\n''\\n = A&F''= >&& J&)<&\\x00\\r D& D&E		 I&E)<\\n\\n I&E)<\\r D& D&EE\\r\\r&\\n2: D& D&5E\\r\\x00ƀ =2\\n&\\n2 D&!\\x002B @2\\n&\\n2 D&1\\x002B ==ņ\\n&\\n2 D&?\\x002B ==T\\n&\\n2 D&4\\x002B >&=\\n >&=½B)<\\n			&^ D&j=24\\n;=2\\n&\\n2 D&0\\x002B=ļ0քB\\n\\n @Z7&\\x00 K&\\n >&\\n)< @ G&*&\\n2 D&\\x002B&\\x00\\n >&, @ >& >&)<&\\n2 D&\\x002B$6:=&\\n2ň \\r D&@5'\\\" M H&P:< D&<\\x002B\\\" M H&P A&R:<\\nX >&4 D&i\\x002B\\\"=ŉB\\n I&- >&, >&\\n I& >&/<)<' D&\\x002B\\\";© >&=Ŋ)<' >&=½B)<\\n&^ D&jO D&A\\x002B\\\" >&=ŃB)<\\n&^ D&uO D&Z\\x002B\\\" >&=ńB)<\\n&^ D&6O D&.\\x002B\\\"\\\"\\x00\\x00\\x00\\x00\\x00\\x00\\n=ŏ4\\\"\\x00\\x00\\x00\\x00\\x00D\\n(\\n\\x00=l\\n=Â\\n >&,-@	< I&Q4\\n=2'\\\"\\x00\\r \\\\\\\"\\x00\\x00/ @ >&Q=Ŕ)<\\\"=ŗ\\n=Ř\\n =2 @2\\\"\\x00\\x00]=2 ==ŌM = >&W'\\\" = >&W >&/<\\n  >&4=œ:< D&7  >&4=Ŗ:< D&7\\\"\\\"\\x00\\x00 ==ō2\\n ==Œ2\\n\\\"\\x00\\x004@\\\"=Ő0քB\\n = D&0D2\\n2@@ D&\\x002B\\\"\\x00\\x00M@\\x00A< ==·\\n ` H&, ` H&,)<&\\n2@ D& D&%E D&\\x002B\\x00\\x00	=őU=l\\\"\\x00\\x00\\r\\n=ŕU=l\\n\\\" =- I&7 =L =L=ř\\\" @- I&7\\r @=Ë- >&, @=Ë=Ś[:<\\nJ=Ŏ4\\\" ==Ã=¿B >&\\n ==Ã0+)<''\\\"\\x00\\x00n=ś\\n \\x00 >&4 >&:<\\n&\\x00\\n&\\x00\\n >& =- >&,$$6& ==T\\n >&\\n=È=ũ\\\"\\x00\\x00\\r}}} ==Ţ\\\"  >&4 ==0+ H&_:< D&\\r ==Ä- >&  ==Ä=Ū=ţ\\\" == == >&) == >&) >&T0+=ŧ\\\"\\x00\\x00\\x00î\\rééé\\r @ >&8=d)<\\n=h0֐)<\\n=0}\\n<=Ş0)< >&0&\\x00,\\n=t0֟\\n<=£&\\x00&\\x00&&f<=&\\x00&\\x00&&i<\\n=ū,\\n=Ŝ\\n \\x00 >&4 >&:<\\n	&\\x00\\n\\n&\\x00\\n	 >&6\\x00	\\n\\x00	&\\x00\\n<\\x00	&\\x00\\x00	\\n<\\n$$6C\\n	 >&\\\"_0\\n&\\x00\\n\\x00=q >&A\\x00=q&\\x00\\n I&B\\n;\\x00=q D&=ŝ\\n;=Ť\\n$6R\\\"\\x00\\x00\\x00\\x00Ā\\rûûû U >&) U >&) >&\\n.% U >&) >&\\x00\\n< @ >&8 >&1	<0K U >&) >& U >&)%\\n< U >&).%Q0+\\n  >&4=Ŧ:< D&,  >&4=Š:< D&,\\\" M I&\\x00Z ==ÆR M I&\\x00 ==Æ >&))<\\n6=Å I&0+\\n=š I&0+\\n=ş=Ũ\\\"\\x00\\x00\\x00,\\rk֗\\n H&\\n2\\x00&\\x00&:.%\\\"\\x00\\x00Ƶ \\n\\r @=Á ? @=Á >&'\\n\\n  >&4 @ >&:<\\n=É\\n1մ >&=ť\\n< @ >&6  >&4 @ >&< ==É- I&\\n 3 >&4 @ >&<\\n  >&4 @ >&B:<\\n=Ů\\n1մ I&[ >&\\n< >& >&\\n<  >&4 @ >&B:<\\n >&=m\\n<=ű\\n1մ  >&4 @ >&B:<\\n		=\\n1մ	 >&- >&\\\"\\n<	 >&0մ\\n<\\n\\n\\r'++  >&4<  >&4<  >&4	<\\n\\n >&7\\n	=m7\\nkմ	7\\n	=	7\\n\\n D&=ŬE\\x00\\x00i&\\x00\\n G&,\\\\\\n \\x00 >&4 <&] >&:<\\n&\\x00\\n >& ?,&a\\x00$6'=Â \\\\4& D&a\\x00\\\"\\x00\\x00 ==T\\n=Í\\n=¥\\n=\\n >&= >&=R\\n25\\n26 = >&R >&/< >&\\n274\\n29;4\\n29;\\x00=2'\\n28\\x00\\x00Ї ==T\\n >&=\\n ==\\n=Ï\\r={ D&9E;Ë=Ű ?,À=Ø\\x00\\n D&m\\x00\\n={\\x00\\n ==Ź2 D&\\n*2;  >&4 H&:< D&7	=Î*2;t ==ŷ2 D&!*2;^ ==Ÿ2 D&4*2;H ==ů2&*2;5 ==Ż2 $ >&4=ų:< D&7 D&n*2;	 D&9*2 \\n D&\\rO2=ŵE D&O  = I&:' ==Ñ ==Ù&\\n ==ŭ2	 ==Ų2 D&@ D&1E = I&:'&\\n=Ŷƅ D&F&? ==ź2 D&&*2;±  >&4=Ŵ:< D&, D&-*2;  >&4=Ƈ:< D&, D&1*2;o ==\\r ==- >& \\n=Ƅ ==4 $ >&4=ž:< D&7 D& D&pE;' ==ƈ2	 ==Ƃ2 D&#*2;&*2 == ===Ž' ===Ɗ'; ==Û ?, = I&=Û ?, ==ƃ' ==ƅ' D&*2;W ==Ì ==Ɓ';D = >&G=Ɖ ==ƀ';+ = >&G=ſ = >&G=Ƌ;\\r&\\n2:=ż\\x002B=Ð @ >& >&H4\\r D& D&!E ==Ɔ2 D&\\n*2; ==ƌ2 D&4*2;y ==Ɨ2 D&*2;c  >&4 H&:< D&7	=Î*2;B ==\\r ===ƙ2 D&M*2;  ==×\\r ==×=Ɣ2	 D&*2=\\n==Ô\\r D&b D&yE = H&7 ?,=Ø\\x00\\n=;=Ɩ\\x00\\n\\x00\\x00ʨ ==T\\n >&=\\n ==Ƙ2 D& D&cE;ɺ ==ƍ2 D& D&E;ɠ ==Ə2 D& D&2E;Ɇ ==Ǝ2 D& D&IE;Ȭ=2 D& D&0E;ȗ ==ƒ2 ==ƛ;\\r D& D&JE;ǳ=2% D& D)E;Ǟ: D& D&5E;Ǌ ==Ì ==Ƒ' D& D&8E;ƪ ==Ɠ ==Ɛ\\r D&=ÕE;ƍ=ƕB >&\\n)<	=Å 6 D& D&rE;Ţ=ƚB >&\\n)<\\r D&=ƥE;ń=21 D& D&E;į=2/ D& D&E;Ě=20\\r D&=ÚE;ć ==Ɯ ==ƪ ==Ƥ D& D&'E;à ==ƞ2\\r D&=ơE;È=Ơ =4\\r D&=ÖE;³=2 D& D&,E;=2\\r D&=ƣE;=2\\r D&=ÒE;x=24 D& D&uE;c=2 D& D&%E;N=2  D& D&lE;9=2! D& D&E;$=2\\\"\\r D&=ƦE;=2# D&=ƩE\\x00\\x00\\x00\\r2)2*\\x00*22\\x00\\x00 D&\\\\\\x00\\n\\x00\\x00 D&\\x00E D&\\n*\\x00\\x00	Ȧ&\\n&\\x00\\n\\x00 >&ȏ\\x00\\n H&U >&-ª >&? >&@' >&? >&@ I&L';ǈ >&? >&@ I&L/< >& K&6=Ɵ D&f*2,;G K&6=¿ >&? H&2 <&B >&\\n >&? H&2)<\\n D&*2,;ň K&) >&-ĸ&\\x00\\n K& >&Ġ K&\\n I&Ā >&@' >&@ I&L';â >&@ I&L/<\\n I&4 >& >&H)<\\n N&B >&\\n)<\\n D&*2,; >&	w @ >& >&=Ɲ)< I&B\\n D&*2,=m=m >& D&q5 [&^B >&\\n=m)< [&?B >&\\n=m)<=Ú*2,; W&+=Ò*2,$6ĳ$6Ȝ\\x00\\x00\\n® ==Ƨ\\n ==ƨ\\n ==Ç\\n ==ƫ\\n	- >&,\\n	- >&,\\n''\\r D& D&fE''I-\\n(\\n		 H&U\\n<	 K&)\\n<	 G&Z\\n< S&	 @ >& @ >&	<\\x00\\x00 ==Ƣ\\n	=ƺ2\\n = >&- >&,  >& = >&)<0+\\n  >&4=Ƭ:<&3\\n  >&4=Ƹ:< D&3\\n\\\"\\x00\\x00	Ý ==Ư ?7	 ==ƻ ?7	 ==Ʒ ?7 = H& = H& >&/< >&&=ƹ)<&3\\n\\r??? = >&- >&,  >& = >&)<0+\\n  >&4=Ƶ:< D&3\\n =k։- >&, =k։ ` >&)k։\\n ==Ó0 ==Ó=Ʈ+=Ʊ\\n\\n\\\"\\x00\\x00:\\r333=2-=ƲU=l\\n=ƭU=l\\n=ƶU=l\\n'\\\"\\\"\\x00\\x00\\x00ē\\x00\\n\\n\\rāĄĄ ==T\\n ==á=Þ=ƴB >&\\n=Þ)<' ==á ==Ƴ&f<;½=Ð @ >& >&H4/ = I&: >& I&)<\\n >&Y\\n< H&\\n<;z ==\\n ===ÏC\\r9<< = >&X >&;$ = >&X&\\n1º = >&X K&\\n I&Z	<;# = I&:' ==Ñ ==Ù;\\x00*j\\x00\\x00\\x00*j\\x00\\x00\\x00\\x00, \\r D&5\\\" ==¾\\x00<\\n >&\\x00\\n< >&=ư\\n<\\x00 D& D&uE D&!*\\x00\\x00m =Ze =- >&, = >& D&! = >& = >& >& D&  >&4 =0+=Ƽ:< D&,\\\"\\\"\\x00\\x00\\x00\\x00\\x00( D&+#5&#!&\\x00#K#R#S	.2 \\r D&V5'22\\x00\\x00! \\r D&V5'\\x00%nV\\x00%oX\\x00%p\\x00\\x00­ D&8O\\n i i >&] i >&])<>\\n; >&7+ >&2+o>\\n ` H&,)<' >&&\\x00 >&`\\nl&\\x00\\n >&)%l(&\\x00!մ& I&<B!Ư\\n<$66\\x00\\x00«=ÕO\\n i i >&] i >&])<>\\n; >&7+ >&2+o>\\n ` H&,)<' >&&\\x00 >&`\\nm&\\x00\\n >&)%m(&\\x00!մ& I&<B!Ư\\n<$66\\x00\\x00\\x00\\x00 \\r D&V5'\\\"%l'%m'\\\"\\x00	\\x00- >&`\\r\\x00ǀ\\n\\x00\\x00 >& D&Z3\\x00 I&&\\x00 D&Z:<\\n\\x00\\x00\\x00\\\" D&4* D&\\r J&Y \\r D&!5'\\\"\\\"M&\\x00\\n%l >&9%l K&/ >&C\\x00)<\\n&\\nn%lkմ\\no&\\x00\\np\\\"$6F\\\"\\x00\\x00P&\\x00\\n%m >&<%m K&/ >&C\\x00)<\\n D&!\\nn%mkմ\\no&\\x00\\np\\\"$6I\\\"\\x00\\x00\\x00	\\x00\\x00\\n\\x00\\x00\\x00¨%s\\ns&\\x00f \\\\\\x00\\\\\\n I&Q\\n' >&/<\\n \\x00 >&40ց:<\\n >&P/<\\n0 >&&\\x003 >&P/<\\n  >&4 K&R:< D&,\\n J&Ra C&5\\\"\\ns\\x00\\x00\\x00n = I&8 H& = I&8 I&^/< D&<E)<\\n\\x00 >&5=rǊ)<\\n\\x00&\\x00\\n\\x00 >&\\r\\x00`<$6 D&!=@?\\x00\\n<\\x00\\\"\\x00\\x00\\nć\\x00 >&9&\\x00)<\\n >& D&= >&P/<\\n&\\x00\\n >&\\nR`<6 >& D&1\\n=r >&9)<ƾ&\\x00\\n%t3\\nt >&9&\\x00:<\\n Dá3\\\" @=ǅ >&E\\\" ==ǃ=ǈ)<\\nq=Ǆ+0\\n	 >&\\n&\\x00\\n	Rn\\n<6 D&?	?\\\"\\x00\\x00\\x000&\\x00\\n=ǋ\\n\\x00( D&#5&#!&\\x00#K#R#0#S	.2222\\r2222\\x00\\x002\\x00\\x00°' D&O\\n D&IO\\n 1 >&/<R\\n&\\x00\\n U >&) >& >&=ǉ)<\\n >& D&q^\\n I&E:<R\\nS D&5\\n2 D&!=@?\\x00 \\nX\\x00%tX\\x00p\\x00p\\x00\\x00I D&Y\\n0չ= >& D&4)<+\\n =4 = ?\\n<\\r =<Q;\\n D&4&?\\x00\\x007 kԪ\\n& Då3& Dß3\\r '  D&3&&?\\x00\\x00=_ >& G&.a'\\n \\n= @\\n\\x00\\x00 = >&R=ƿ)<\\n D&!\\x00g\\x00\\x00m\\x00\\x00\\\"\\x00b\\n2	\\x00b D&3 D&!\\x00g\\x00\\x00	\\x008\\x00b\\n\\n\\n&\\x00\\n\\r&\\x00*\\x00b D&q3 D&!\\x00g\\x00`\\x00 >&T [&! C&\\n=z+\\x00+ >&2+:<*l\\x00b\\n2 D&3\\n2\\n2&\\x00\\n\\x00\\x00 D&;\\x00X*2\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00=ǂ =4=ǁ =4 D&!\\x00g\\x00\\x009& D&;Y, D&gg\\n Dîg Dìg Dëg\\x00\\x00~& D&;Yq> H&? H&+? I&&? I&A? K&? F&? H&-? I&\\n? >&B? K&1?\\n&\\x00\\n >& @\\n9P @9P$6,\\x00\\x00\\x00  \\n D&5 >&?&\\x00?&\\x00?\\nH C&\\x00B\\n >&/<\\n >&\\n)<\\n&<B\\n;\\n&\\x00<B\\n2\\\"\\x00\\x00\\x00' 2=2;\\x00\\\"\\x00\\x00i&\\x00\\n >&\\nQ= D&=E\\n7\\n\\n >&	< >&\\n >& D\\\"3*ǆ$6X\\x00\\x00\\x00& D&JY Díg\\x00\\x00\\x00v\\x00\\n2>??? ?\\n /- >&,\\r   D&?W' >& = H&0	<>\\n&\\x00\\n >&\\n2R\\n<c6)\\x00B\\r===&\\x00\\n >&*\\n2R\\n,\\n2c68\\x00\\x00\\x00\\x00\\n	\\x00\\x00(=2;=2\\n2	\\x00&\\x00f''\\n2\\x00\\n ?]2\\n2\\x00\\x00q& D&JYd o = >&R2 U = H&42 U >&) >&T = H&4 >&) >&T22  ?  D&?3&\\x00f\\x00\\x00\\n @\\n= \\n@\\x00\\x00i\\rXX : >&4\\x00	< I&)- >&  >&4 I&) F&W:< D&3 \\x00 >&4 I&) F&W:< >&P/<\\\"  >&\\x00)<\\\"\\x00\\x00D\\r???\\x002\\n=ǇB\\n\\x00- >&,, >&\\n)<' ?7\\x00,\\n2\\x00\\x00\\x00& D&JY\\x00\\\"\\x00$=8\\x00\\n D&L3&\\x00f=2\\\"\\x00\\x00\\x00	\\x00+(\\n0\\n\\x00( D&\\n#5&#!&\\x00#K#R#0#S	.2\\x00\\x00\\x0022\\x00\\x00 >&&\\x003\\x00\\x00\\x00} D&O0\\n >&&\\x00\\r[[[ >&# >&)<\\n&\\x00\\n >&8 >&# >&%)<\\n >& D&!&\\x00&\\n<$6E\\x00\\x00Y>\\nZ#:\\n >& >&L+0֓++	< >&&\\x003 >&[ >&. >&)<+ >&D+\\n2\\x00\\x00\\x00\\x00\\x00(&\\x00#5&#!&\\x00#K#R#0#S	.2< F&Z\\n2 K&Z\\n2 H&EZ\\n2 F&;Z\\n2 H&	Z\\n2\\x00\\x00&\\x00f\\x00\\x00&\\x00\\n\\x00 >&\\n\\x00V\\r&\\x00\\x00n D&!\\x00\\x00n D&1\\x00\\x00n D&?\\x00\\x00n D&0\\x00\\x00n\\x00\\n<\\x00\\x00±'2\\n'=2\\n2 D&3 K&9Q'=2\\n2 D&3 H&E9Q'	 H&Z'=2\\n2 D&3 F&9Q'	 H&Z'=2\\n2 D&3 H&	9Q D&3 H&&9Q\\x00\\x00  D&?3~\\\">\\n2>=³?=ƽ?=ǐ?=ǎ?=ǘ?=Ǚ?=Ǜ?=Ǔ?=ǌ?=Ǐ?=Ǖ?=ǒ?=ǚ?\\n&\\x00\\n >&\\\"\\rhe >&	<$6/\\\"\\x00\\x00.' [&8\\n\\x00\\x00\\n2 D&3 F&;9Q\\\"\\\"\\x00\\x00č\\rĈĈĈ\\x00`\\n=Ǘ\\n=ǔ+ >&# I&	)<\\n @ >&8 I&)<\\n >&H H&% >&E\\n< I&=Ǎ\\n< @ >& >&	< K&D&\\x00\\n H& \\n H&.\\n&\\x00\\n		 >&A >&H N&	\\n< H& 7 H&.7 >&		<	c6N  >&4 I&	:<0֋2\\n\\n @ >& >&N	<\\n\\\"\\x00\\x000=2\\n2 D&3 F&9Q=2\\n2 D&3 H&	9Q\\x00\\x00\\n\\x00Ň = S&\\n< § @ >&8 I&)<\\n I&=ǖ\\n< @ >& >&	< @ >&Q [&>)<\\n H&K>\\n&\\n H& C&. >& H&)<	<$6,  >&4 >&:<0֒2 @ >& >&N	<;=; @ >&8 I&)<\\n D&=O\\n >&$0մ F&4< I& W&]%P+ S&++%N+ >&J+%P+ H&)+\\n< @ >& >&	<&\\x00\\n\\n = I&_\\x00 D&P:<\\n	;2\\x00\\x00¢\\r>>> @ >&Q%P)<\\n F&- >&, F& A&&)< F&2\\n22$	 D&3K / >&4 =	< @ >&Q F&4)< @ >& >&N	<2	; = I&'\\x00 D&P<\\x00\\n=22	\\x00\\x00Ï\\rÊÊÊ @ >&8=d)<\\n=h¯ >&0 D&\\n< >&\\r=Ö\\n<=h0֐)<\\n >&\\\\\\n=0}\\n< C& <&H\\n<=t C&'\\n<=£&\\x00&\\x00 D& D&cf<=t N&\\n<=¨ D&9 D&4d<=t J&]\\n<=¨ D&= D&d<=/<\\\"\\x00\\x00\\x00̂\\r,-- @ >&8=d)<\\n=h N&[)<=h A&)<\\n\\rʷʷʷ>\\n <&M\\n C&T\\n	 L&/<\\n\\n K&F K&=\\n< = A&O> Dç? DÙ?&\\x00? Dã? Dï?&\\x00?&\\x00? Dà?&\\x00?<\\n [&J K&= <&d<\\n F&. D&9\\n<\\n F& D&9\\n< S&W/<\\n F&@ F&D)<\\n\\r F&\\r< F&\\r	< F&@ F&V)<\\n F&	< F&	< F&<\\r< F&<< [&	< S&0	< K&, G& A&\\x00:<\\n< K&0 W&' J&.:<\\n< A&0 A&A	< J&) K&,\\n F&. [&S&'&\\x00&\\x00T< K&Y K&0&&d< G&% W&T&\\x00\\n F&d<=d[7 >&=d=/<	<* F&\\nµ> F&D? F&V?\\n> <&? C&<? G&D? C&G? [&? L&?\\n&\\x00\\n >&S&\\x00\\n >&< F&\\n:<\\n >& <& L& N&Bd<$6I$6`  >&4 >&%:<\\\"_\\x00ZY & >&4)<I\\x00- >&; W&P\\x00)<\\n ?7\\\"- >& DéO' >&	<\\x00\\x00M W&O/<\\n&\\x00\\n >&.\\n <&B)<\\n >&	<*2$6;\\x00\\x00\\x00ì = W&- J&8\\x00< <&2/<\\n> F&$ ?,\\n F&$;0? K& ?,\\n K&;0? F&I ?,\\n F&I;0? K&$ ?,\\n K&$;0? F& ?,\\n F&;0? F&Z ?,\\n F&Z;0? F&B ?,\\n F&B;0? K& ?,\\n K&;0?\\\"\\x00\\x00\\x00в>\\n ==T\\n >&=Ǒ	< >&=ǣ	< >&=Ǡ	< >&=Í	< >&=ǥ	< >&=ǩ	< >&=Ǩ	<\\x00=l\\n >&	< >&=2	<=l\\n >&	<\\r\\n=2\\r\\n	0\\n	 >&		<>\\n L&,\\n @ >&8 H&\\x00)<\\n\\r\\r\\r I&\\r I&? >&# I&2)<\\n&\\x00\\n >& >&\\r I&)<	<$6) >&	<>\\n J&A\\n @ >&8 H&6)<\\n I& I&? >&# I&2)<\\n&\\x00\\n >& >& I&)<	<$6) >&	< = I&T = I&Tœ>\\n C& >&# I&2)<\\n&\\x00\\n >&< >& = I&T [&M0֌,\\n0ճ+;0+0ո+)< H&	<$6I >&	<>\\n [& >&# I&2)<\\n&\\x00\\n >&< >& = I&T S&0֌,\\n0ճ+;0+0ո+)< H&	<$6I >&	<>\\n A&: >&# I&2)<\\n&\\x00\\n >&< >& = I&T S&J0֌,\\n0ճ+;0+0ո+)< H&	<$6I >&	< >&y	<=l\\n >&	< >&y	< >&y	<=l\\n >&	< >&=À4	<==ǡ ==''\\n >&	< >&=Ǣ4	<=Ǧ\\n \\x00 >&4 >&:<\\n&\\x00\\n >& >&&;&\\x00	<$6+  >&4 >&%:<\\\"$\\r\\x002\\x004\\x00 I&E)<\\\"\\\"\\x00\\x00\\\\ \\x00 >&4\\x00 >&U:<\\n =\\n&\\x00\\n >&&2\\n'\\\"c6* >&&2\\\"\\x00\\x00\\r\\r\\x00\\\"[\\\"\\x00\\x00w>\\n S&9\\n`&\\x00\\n >&N\\n  >&4> >&? H&? J&\\\"? S&R? >&:<\\n >&	<$6[\\\"\\x00\\x00g>\\n=¯\\nR&\\x00\\n >&@\\n >&  >&4> >&-? L&0? H&? >&:<	<$6M\\\"\\x00\\x00l&\\x00\\n=¥- I&,=¥\\n;=- I&,\\n=\\n\\r @ N& C&]	<\\n\\n <&8 =4\\n>???\\\"\\x00\\x00>\\n\\rLL W&**o >& I&)	< >& C&	< >& H&	< >& A&.4	<\\r.?? D&=O\\n  >&40յ%N J&Gi<\\n = >&Wh< >& I&)	<\\\"\\x00\\x00Ƕ'0\\\">\\n ==ǝ\\n >&=x	< ==Ǟ\\n >&=x	< ==ǧ\\n >&=x	< ==Ǥ\\n >&=x	< ==ǜ\\n >&=x	< ==ǟ\\n >&=x	< >& = K&	< ==T\\n	 >&	 >&=	< >&	=\\n	==Ô	< >&	=Ý\\r	=Ý >&/<	< >&	=ë\\r	=ë >&/<	< >&	=È	< = I&F\\n\\n >&\\n H&B	< >&\\n K&	< >&\\n K&		< >&\\n F&?	< >&\\n F&,	< >&\\n >&\\r	< >&\\n >&0	< >&\\n F&\\\\	< >&. >&)<+\\n2\\\"\\x00\\x00\\x00	\\x00!\\x00( D&#5&#! D&R#K#R#S	.2 ' I& Z\\n22\\x00\\x00P &\\x00\\n\\x00 >&\\n\\x00V\\r&\\x00\\x00=2\\n D&!\\x00\\x00\\x00\\n<\\x00\\x00 = H&* A&0\\x00d<\\x00\\x00* = K&\\r = K&\\n;\\r C&o\\n\\\"\\x00\\x00/0\\n\\r\\\"\\\"\\\" = H&O\\r = H&O\\n; G&Po\\n\\\"\\x00\\x00\\x00p I& Z\\n2' D&]O\\n2\\r& I& 9Q\\r=2\\n\\n2& I& 9Q = H&N\\x00\\n< = K&	 = H&NA<\\x00\\x00P = H&* = K& G&2\\n(\\n&\\n>\\n = H&*\\x00\\n< = L&\\n< = J&N\\n<*2\\x00Ä'9 @ >&8 I&)<\\n2 >&H L& S&D\\n< @ >& >&	<0և2R+ H&5+\\x00b I&G/<+\\n(\\n K&:\\x00\\n<=q\\n< <&3\\n<\\n< >& [&X i H&)<+\\n<; >&	< >& A&\\n<\\x00\\x00 i H&)<\\n>\\n2\\\"\\x00\\x00\\x00\\n*\\x00<Q\\x00\\x00\\x00\\n2& I& \\x009Q D&?*\\x00\\x00\\x00\\x00%(\\n\\x00( D&!#5&#! D&!#K#R#S	.2*2\\x00\\x00=\\x00 >& D&HO/< D&cO/< D&5O/< D&0O/<f<\\x00\\x00\\x00\\x00\\x00\\n.\\x00\\n.\\x00\\n. \\x00\\n.\\x00\\n.\\x00\\n.\\x00\\n.\\x00\\n.\\n\\x00\\n.\\x00	\\n.\\x00\\n\\n.\\x00\\n.\\x00\\n.\\x00\\r\\n.\\x00\\n.\\x00\\n.\\x00\\n.\\x00\\n.\\x00\\n.\\x00\\n.$\\x00 D&!&\\\"\\x00&2\\x00 D&!2+\\\"\\x00\\x00\\x00 D&!&\\\"\\x00\\x00&2E\\\"\\x00\\x00&\\x00\\n&\\n\\x00\\nc6\\\"\\x00\\x00 D&\\n\\x00 D&9\\n =[\\\"\\x00+\\\"\\x00\\x00 @&\\x00;&\\\"\\x00\\x00 @ >&8 >&1)< D&t; D&7\\\"\\x00\\x00 '	 = I&@' D&S\\\" D&N\\\"\\x00\\x00U&\\n\\x00 D&!\\n D&9\\n ==T >&=- >&\\\"\\x00++E+E D&!E D&12+\\\"\\x00E+\\\"\\x00\\x00 D&72 D&8+\\\"\\x00\\x00 D&=2 D&92 D&!E\\\"\\x00\\x00 D&\\r2 D&9q\\\"\\x00\\x00 D&\\n2 D&1\\\"\\x00\\x00 D&42 D&12+&\\x002+\\\"\\x00\\x00% D&\\n\\x00 D&9\\n = I&[\\\"\\x00+\\\"\\x00\\x00 = I& D&7;&\\\"\\x00\\x00 @ >&8 >&)< D&t; D&7\\\"\\x00\\x00 '	 = C&(' D&S\\\" D&N\\\"\\x00\\x00X&\\n\\x00 D&!\\n D&9\\n ==T >&=- >&%\\x00++E+E D&!E D&12+\\x00+\\\"\\x00E+\\\"\\x00\\x00 D&8\\n\\x00 D&7\\n2\\x00+\\\"\\x00\\x00  D&=2 D&92 D&!E D&+\\\"\\x00\\x00 D&\\r2 D&1q\\\"\\x00\\x00 D&\\n2 D&=\\\"\\x00\\x00$ D&42 D&12+&\\x002+&+ D&5\\\"\\x00\\x00\\x00\\x00\\x00\\x00\",ŠşšŢ͙΁ţŤ\x00ŜŝŞʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟ˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿̀́̂̃̄̅̆̇̈̉̊̋̌̍̎̏̐̑̒̓̔<ĥ$Ħ&ħΩĨάƈήĩǹĪǻīȀĬȃĭȆĻɒļɚĽɝŃɥńɨŅɫŇɶňˆŉˈŊʹŋͿŌ΂ǿȀȪȂºȔhȕĊȖÖȗÍȘʎľǷīXõ\\½ēĦÔGĬ¢iüİ]iöİxę§i;İİ®«ÄĞái&İ8ęriİ%ëęìiLİİ/dĂÄİģAiĝİCÃĩĺÄİģiÿİćiİ£ÝiFİb¾ęÀÆiúİİ¨iªİĪUiİÐgiįİiËİKÄĞ{iĤİĐĚĳÄĞci6İv¤iĕİÍĊHÄĞæiWİuQ¡ÄĞmÄİģ´Ľ_ÄİģkiÖİÎ:Äİģ¼i¿İzpM4ÄİģÅ#ÄĞiİČā¦ÄĞZièİØĜi×İ·ÕiĔİċyðÄİģďiôİîÊęß'iİwěi*İéNę5aiVİİĄihİĻÚi^İÒ+ę¸eiİĨniİòĎÄĞtiķİ²¯iăİÉĆiİÄĞęÓÛi.İİĶàÄİģÙħÄĞ±íÄİģĥę?Riİº7ęþfi\x00İİoÄİģåiđİĉčıÄİģęÈiĮİİ³jïÄİģiİ~ę¶ĈiļİİÇi0İ|BĒ»$YIĀÁĲâ=Ì,ç1ñ	÷ÄS[ĖûóĭÞą<ý9 lEPqėT! @ĸĢDJ­©\n¹êÜĵĴÑ2s¥ãä°\rÏ)µġøĠ¬>(ù`}3-OĹÂ\"ğĘ3Ņ0ť\r\x00	\x00\n\x00\x00\x00\rǛ\n1ʐԌષ\r§\ræ\r@	̟\r\n	ץ	࢚	#\x00	ڤ		֨	ێ	஍	#\x00	ࡋ		ઞ\n\"	Hʏт\nŦ\rп༁ȇŧ\r\x00	\x00\n̆\n಻\nг\nී	\n\n\nx\nϼ	HȇŨ\r\x00	\x00\n̆\nศ\nг\n౮	\n\n\nx\nϼ\nʾ\nஹ\nĖ\nՀ	Hȇũ\r\x00	\x00\nп	¢\n\në\nທ	ഞ\nĐ\nڳʏт	Ū'?ť༞ʑ౥ʼŦʜĠˀʠȲʢ༹ʼˀťʚƇ	Ũʡϡ\nʳʟॿʡδˀʙ״ʠޗʳˀūŦʡԹˀŦʟ੯˂ŧʟࢍˀ˂iy0˂ŦʣԬʼŨʝГ˂ʼ\rˀʘφʘȗ˓Ũʜ້ˀ˓ŧʝǈŧʠʡŧʝ͎ˇʢཡʜ܋˓ŧʚणˇ˓ũʡʰŨʟȨŦʚɩŨʠհŨʜ̕ʬʞ̭ʜϧ˂ʡ҈ʢंʬ˂}0˂Ũʞඹʬũʜج˂ʬũʞȐŨʙˌťʝśˇʢॠʛ˪ˀŨʛ઻ˇˀˇŨʡɄ˂ŧʞځˇ˂ŧʝລˀŨʚɄʳŨʡГˀʳ ˀŧʝूʬʙ໱ʛ਒ˀʬŬťʞ˯!˔ʙϘʗȓˇʗҍʣಬ˔ˇ\"ťʚླྀy0#˓ŧʣ࢒˔ŧʚБ˓˔ŭŦʢǏŮŧʙś$Ŧʢŉ%Ũʞӥ&ʳťʜϓ˂ʗҍʡஉʳ˂'˂ʢ૓ʣA˔ʣ༲ʠි˂˔(ŧʜɽ)ťʢѸ*ʬŦʜȂˀŦʙཱུʬˀ+Ũʢ୙,ŨʢبU0-ŧʞЎ.ŨʝƱ/Ũʟț0ŧʠ͎ůťʚʰ1ŧʢɵ2ŧʛʩ3ŦʢϏŰˇŦʜÞ˂ʚ๠ʜഥˇ˂4ťʣϨ5ťʠǈ6Ŧʠ઎m07ʼŦʡ฀˓ŧʛͮʼ˓8ŧʣӳ9ŨʡƇ:ŦʟɈ;ˇʘφʘɼʬŨʠۻˇʬ<Ŧʙ͞=ũʞƇ>ťʝ̲?Ũʢ̲@˔ŧʙҺ˂ũʜହ˔˂AŧʛϏBťʞুm0CũʜƕDˇŦʠƩ˓ʢĒʞ໽ˇ˓E˂ʗאʖ෩ʬŦʝǐ˂ʬFŦʚբGŧʚȡHťʙϪIŦʙ˓JŦʢśKˀŨʟϻʳŨʢ;ˀʳLŦʡВMũʞ˓Nŧʞٝm0OŦʟʕPŦʞƕQŨʜțRťʡˌSˀŧʠĪ˂ŧʜ৷ˀ˂Tŧʝ˫űŨʢɬUŨʞ˃VˇŦʟ˔ŦʠҶˇ˔WʼŧʚþˇŦʟ;ʼˇXŨʢʡYŨʠࢌy0Z˓ʟЭʢΫ˔Ŧʚຑ˓˔ŲŨʡȐ[ʬŦʡű˂ʟɐʟ૨ʬ˂\\ťʝЎ]Ŧʠɩ^ťʝț_ũʛҠ`ʼŧʘ´ˀũʞοʼˀaʼŨʠ॑ˀŦʞӮʼˀbŦʛȮųŦʚŉcťʜ؃©0d˔ŧʛપ˂ŨʡȔ˔˂eťʜʚfʼťʝʂˇŧʚ֤ʼˇgťʜˠŴ˔ŨʚԬˀŦʢઠ˔ˀhŨʠҠiʬŦʘŐʳŨʘ͘ʬʳjʳŦʡϿˇŦʡ੡ʳˇkʼŧʝ˛ˇŧʜଳʼˇlˀŦʢ̄ʼťʚоˀʼm˂ŦʢםˀŦʜਫ਼˂ˀnŧʝ΢y0oŦʞƱpŨʢɠqŨʞʚrťʟɠsʳťʟĀʬʘܐʗ଀ʳʬtˀŧʜЋ˓ũʛ઱ˀ˓uʼŦʢþʬŦʠߘʼʬvʳʘƙʠʼʚʢংʳʼwŦʝҰxťʝͯyŨʜ˃zŨʝӰy0{Ŧʡࡠ|Ũʙ˳}˓ũʚΌʼŧʟҶ˓ʼ~ʳŧʢ൦˂ťʣ໋ʳ˂ŵŦʟɬ˂ŧʙ཰ʼŧʝо˂ʼŦʟϨŦʛ˭˔ťʝυʳŨʟ૚˔ʳŶŧʙȐťʛ࡞ŷŨʛଲy0ŦʚആʬʡÁʘɼˀŨʝࣗʬˀŦʡƕŨʞӒŨʝ̒ŨʜɮʳŦʛſˇʢɸʜ৘ʳˇŨʜई˔ũʟȂ˓ŦʡΆ˔˓ŦʣаŸˇũʠĳʳŨʣ߷ˇʳŦʞञU0ŧʝʕŦʣɵťʠ˳ŧʜ˓ŨʜȖŦʡͯŦʣբŨʟŉŦʛԪŹŨʚҘʬŧʞm˔ťʛஜʬ˔Ŧʝ૛a0ŨʜȮŦʡ̍ũʙɈŨʢҘťʡɩŦʣ˃ Ŧʞŉ¡ťʡ˫¢Ŧʘ̉£ˀʠÁʢ-ˇŨʚറˀˇ¤ťʞʩ¥ʼťʡʂ˓ťʣܯʼ˓}y0¦ˇʟଌʞͺ˓ŧʢ͢ˇ˓§Ŧʛӥ¨ŧʞǏ©˂Ŧʠ٢ˇʛംʠ੭˂ˇªŦʜ˫«ʼʛɉʞŹˀʟழʠ઩ʼˀ¬ũʚ੣­ťʠВ®Ũʠ̦¯Ŧʟэ°ʼŧʛ࠿˓ŧʟࡺʼ˓±ŧʜӰU0²ŦʢҰ³ťʟ̦´Ŧʞ̉µ˔ũʝ׺ʳŧʘܛ˔ʳ¶ŧʡˠ·Ũʛ౅¸Ũʝȡ¹ŦʣǏºŦʞ˅»ŧʝɈ¼ũʞа½Ũʝෆm0¾Ũʞǈ¿ʳʙķʚȫ˓ʝϣʞ฻ʳ˓ÀŧʞśÁ˔ʠ଩ʜϞ˂ʣʡޡ˔˂ÂŦʞɠÃŦʠޓźŧʜɬÄŨʡǾÅũʟśÆŦʡ˯Ç˂ŧʢέʼŨʚѼ˂ʼÈťʝय0ÉˇũʡఆʳŨʛӮˇʳÊŨʣŉËˀŨʚɥʳũʛ͢ˀʳÌťʚʕÍŨʛŉÎŦʝʩŻũʢϥżʳŨʟɥʬũʚದʳʬÏŨʞȡŽˇŦʜðˀŧʖږˇˀÐˀũʚʣʬťʡݐˀʬžŦʡ΢y0ÑˇŨʜҺʼʚੵʛढ़ˇʼÒŧʣɀÓŧʟѨÔũʡӳÕ˂ʖɱʖɲ˔ũʡޚ˂˔ÖťʛӒ×ŧʞ˳Øũʠ̶ſŨʜƱÙʬʜܙʡƏˇŦʙБʬˇÚ˂ʜӚʢ̝ˇŧʢͳ˂ˇÛŦʢూ0Ü˂ťʚЋʳŨʟഄ˂ʳÝŧʠήƀ˔ŧʛϓʼŨʙݵ˔ʼÞʼũʝtˀʣഴʟХʼˀßťʜǏàʬťʠğ˓ŨʟѼʬ˓ƁťʡϥáŨʙԹâʬŨʛȂʳʟݝʟрʬʳãŨʜĜäũʚ̒åŦʡాa0æŧʡȮçŦʡԪƂŨʜ̶èũʠιéťʛʡêũʝѨë˓ʛ૏ʞƀ˔Ũʢଉ˓˔ìˇũʡğʼŧʙοˇʼíŦʡ˭îŦʛ̍ïŦʝ̍ðũʛ೺0ñŨʚʚƃʬŦʛũ˔Ŧʟ൝ʬ˔òũʟ͞óũʝȨô˂ʡ࢛ʞ՟ʼʚזʠহ˂ʼõˀťʜ˔ʢืʞ܍ˀ˔ö˓ŦʜɄʳŨʡ༕˓ʳ÷Ŧʣๆøťʣɿùʼťʙ׹˂Ũʛ͘ʼ˂úʳʢͻʘà˓Ũʚ຺ʳ˓ûũʞൔ0üũʠϡýŦʠʰþŧʡǈÿʼŦʡໝ˓ʟ৪ʝಒʼ˓ĀũʜհƄˇŧʘ಩ʳʖɱʡ୪ˇʳāũʟɀĂ˂ťʚ˔ťʠݨ˂˔ă˔ŧʖĠˇŧʚ࡜˔ˇĄ˔Ũʣſˀʚ˙ʝр˔ˀƅťʠȐąŦʛ੶[0Ćťʟ˯ćŦʛѸĈũʚƕĉŦʠɀĊŧʛ˅ċŧʛǾČʬťʟˇũʜ˂ʬˇčŨʣ̒Ď˂ťʟ͡˂˂ďŧʢъĐťʢǾđŨʟॐy0ƆŨʛƇĒŦʜ৐ēŧʞъĔˀʙϘʗȓʬŧʚȔˀʬĕŧʢπĖ˓ʢ҈ʚɔˀŨʞଗ˓ˀėʬʖɱʟƴ˓ťʚઙʬ˓ĘʼŨʞʣ˓ŨʜȔʼ˓ęŦʣǾĚŧʙιěŦʠˌĜũʠى0ĝũʡ̉ĞʼŨʞƠʳŧʜ͡ʼʳğŧʚȨĠŧʡɽġũʝɽĢˇʝנʛৣ˓ťʡ༵ˇ˓ģʬʢҖʝƲʼŧʟͮʬʼĤ˓ũʝூʬʡ̭ʞ෦˓ʬƇũʡ̕:ˊʖíǴʒ௨Ɖʻʕ߽Ɗ%\x00ʻʕΙǄʕťʕలʖ˱ʖЮʗమʪϝʪş}ȹ0Ƌ%\x00\x00	ʻʕΙǄʕťʕЌ	ʗࡤ		˙¤ʖƸ	ʖ֖˙¤ʖŠ	ʖ֯ʖ˱ʖЮʖܹʕȲ	ʪϝʪşƌ%\x00ˍʖɖʕűʕŪʖʼʕƉĮ\r\x00	\x00\nʕŹʪ«ʕˍʕ৛		ʕ)	S\n	Vƿ\n\x00dˎʕ\n\x00ʕ͛ƍ%\x00\x00	\x00\n¢		ʒǽ	S	P\n\nʒâ\n,Ąઃʒ૬٫ࣿ	ĽƎ\r\x00	\x00\n\x00ŌʕŅƽQʪIbʪIƍr	ఉʒf\nʕǗ\nŽ	+	Rʒ࠾ŧ	எʒܰ	ʒౝƏ\x00\x00	\x00\nʕడʕñ\x00	\x00\n஢\x00ʗҜ\x00	ÊƐ\x00\x00	ʕదʕత\x00	/ʞֳ\x00	Ƒ\x00\r	\x00\n	ʕǗ\n\n	\nő\n¤௶ƒ\x00\r	P	£@		]Ɠ\x00\r		৞	$ʒӜ	ସ	$ʒఠʒҝ	$ʒĞʒÌ୽	$ʒ঎ʒՉ	$ʒ͹ʒąШʒÌʒ๽	$ʒ݊ʒԈ	$ʒŀʒŗШʒąʒຟʒÌʒࡹƔ\rPʕ)őʕ_ఛʒ෬ƕ\x00\x00	\r\n\x00\n¢	ʕ),\n۱ʕԼʸʕOʘĮʗôʚඝʪeʕ\n\x00ʕȉʕ͇\x00\x00	iʣ0Ɩ\x00\x00	̀	ʕୂृU	ߗU	.	ഘU	.	A	૪U	.	A	<	܏U	.	A	<	f	ୀU	.	A	<	f	f	ીƕ\x00\x00	Ɨ\r\x00	\x00\n\x00\x00ʪ«ʕ\x00ʖߚʕ࣊P	§	ʕ)	S\n	V\nʕǭʒʱˎʕ\nyʒ¨ʻʘЯ\x00ʒ୥ʒுEʒౡ	ʺʖșÄˎʕ\n\x00ʒࢦ	ʖӚ	Ѡʪeʕӵį\r৚\x00Ɨĭ;?ʪ̳ʕƘ\r\x00	\x00\n\x00\x00\x00\r໌	ǃ\x00ʕ̄	ʕʒÜ	්\n	«ʕ¶ʕ̴\nʕZ\nొʕ୩\nਜ਼\n̇హŽ\n࣍ř\n̇œԁ\nʕcා\nʕcෛʒ¨ϭ\n¤ʕӘř\n̇œ\nʕcީw\rʪeʕ\n\x00ʕ̴ʕ൓\r#ʕƘŕ\rƙ:ˠʕ±ʘ஽ƚ\r\x00	\x00\n\x00\x00ʕŎʒO	\nʕZ1ʐĭ	@\n౭	ʒŗ	ʒą	ʒބ	๝ƛ\r\x00	\x00\n\x00\x00\x00\rʕZ	\nʕඍʒO\r1ʐĭ	@	ä\r\nRʒ¸ʒ<\r\nRʒ©ʒ<\r\nRʒʒ<\r\n\"$ʒκ\rƜՊRʒ¸ʒΊRʒ©ʒΊRʒʒ<$ʒάƝ\r5ƚF໻ƞ%\x00ˍʣఫˍʜரʪ>ʕNʞओୣƟ\x00যʕൿʪ>ʕʕӝǄ	ϴİ%ʻʖ̈́ʖ೹ʻʖ̣ʖࣻ΁­˧}ɕ0Ơ\r\x00	\x00\nǃ\x00ʖࠖ	ʪɴʕ\x00ʕ஻	ʒթ\nʪɴʕ\x00ʕߖ\nʒǿ\n	X	ʕرʪ>ʕˎʕ\x00	ٮơ\rɝƠFƑ\x00ʪୃ	ϴƢ˟ƣƣ%\x00\x00	ˍʖɖʖ௒ųʕ̢	Tʕ4ʕށ		ٽʪ¯ʪ½ʒ޼ǀ	\x00ʖຶǀ	\x00ʖࢪƯ	\x00ƮײࢴƮƤ\x00'ʷ֝ʕסʕகࠜƾͧ9˟ƣ˟ǲƯ\x00จƥ%Ǘʒಭıˣˣʕ̀ˣʕȪ֞ʲʕƙʕॼƦ\x00\x00	\r\n7ೂ\n1ˋͩ\nʕĈd	լ׀	άƧ\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00ʖ޸	ʖৗʖ҇	ƥ\n	.	A	࣯\n\rƵǕʴʴxŨ\n\rVʕ੝ʕ)SƦ(\x00Nıఄ͵ӷ?ΓЛʕ)SVʕȷʒಲŻxƋݴ1ˋͩʕĈuƦf(\x00Nı෧͵ʻ૗?ӷʪ൐ʒǿʪ¥ʒો@ʟ@ʒف˟Ʈ|˟##?ʪڞʪইƨ؊ƧƩ\r\x00	֓ʪ¥ʒօƧ\n	କ	D	ʘ࡛	ʠ໢ıΝʪ¥ʒཬʪȄʒ̪ƪӊʒฦEʒͲʒڨEʒ۵ӧ0ƫĉʒҢEʒƕƬ\r\x00	\x00\nʰʕޞƪऍ		ʕ)	S\nʰʕ\x00	Nƪ\nƧƫ\nɟʒƋ\nɟʒ஝\nɟʒܑ\n૘ʒް\n?ʪ>ʕʪīʕy	ॵƭ\x00\x00	\r\n7ʖѬʖඐʴ͊\nƬ	N\n\nʖѬ\nʖ൵Ʈ%\x00\x00	\x00\nƉ˙	ʽĤ	9ʖƸ	ʖȺʖŠ	ʖА\nաʕ́ʕÓʖծʒǓ\nʪࢀ\nʕপAʕť<Ƌ#ʖ˱ʹʗˈ\x00ʶx	\x00(\n\x00-ʪƴEʗ͙NࣧƯ\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x00	q	A\x00	<	#			x	(	-	Eʪȫ	NĦ	Áʪȫ	?ʪୡƿ\x00˞	@ʒर\nƉ\nʽĤ ř\n˙¤ʖƸʖȺ\n˙¤ʖŠʖАʪ֙<L	?Ǹ\nˍʕćʕɁ˝\x00˝˝V˝ʘʪࢁǀ˝ʚુ	@ʒ՞	}\r˙V\rʖ൒	@ʒХ	༎ƭ\r\x00ʪƏ	Au	@ʒ՞	}ǳ\nפƉsʕ́ʕÓʖծʒ਴ƿ\x00ʕֺˉǴʪஐޜǀ\x00ʪīʕ\x00ʕϾʪÀʕ˼ˈ	ʪÀʕ಴ˈ9¬˝/˝#ƿ\x00ʕ๲˝#(ƿ\x00ʕක˝#(-\x00	?Ǹ-®˝#Ǵ(Ä৙	@		@ৰ	˙	ʶʽ¤ʪΟʽ௾˙¤ʖƸ	xʖȺ˙¤ʖŠ	xʖ༭	xʽʪÀʕˉߐˈ		(ʪŰʕˈ\x00ˉ	(ˉ	-ʕढ	Eʗ͙	#ʪŰʕ	\x00ʹ\x00	\x00ʴ\x00	x\n	<ʪŰʕ	#\x00	(\x00	-\x00	E\nʪŰʕ\nʖšʴ\x00\nʪŰʕ	\x00ʴ\x00	x༢ʪ¥ʒआƧƨ		N\x00	ÁƘ	(६Ʃ	Xơ	(	@ʒ଑		@ʒ̮	@ʒȢ	@ด	@ʒ๼	@ʒગʕࣙʕ֛ʕࠉ	Eʕຝ	ư'ˣˣʗؗˣʗ඼¿̕\r\x00̗ˋʢȁʕ༼̗ޟʕɸʪÐʕ\x00\x00	Äʕݜ	\r\x00	̗	ʰʕ࠳	֢ʪīʕʙɐ	ʕగʒҤʒ೴̖\r\x00	\x00\n\x00੥ච̕ߩʮʺ/ʘูʺ१?ʘඡˠʕj\n\nΖʘໃʕ)෍\n̖Ǳʕ˖ʪeʕ\n\x00ʕȉʕഃ	£@ʱʕʖྃʕ\x00	\nʕ̕	ÄʕȲ̖	ॣʕϣʪeʕ\n\x00ʕȉʕభ̖Ĳటˡǎʕǥʪ½ʒɓˡ̖ĳ\x00:ʪθˆภJ؋Ĵ\x00\r		ʪĝʪŶॡ	$ʒઉʪෙʪļĵ\x00˷ˣˣʕ̀ˣʕȪǖʲʕƙʕ०	:~Ķ\x00ĉ$±Ʊ:ˊʕėˆƫiп0Ʋ\r\x00	1ʐ\n	ų	@	\"ƱʒȔķ̕:̕ʒछ̕$ʒূʒݩ̕~Ƴ\x00\r	\x00\n\x00ٙ	L	ʕ̽	ؙ	÷ו	\x00\n		\nˊʕėˆƫʒ҉ƴ:Ʒʖڜĸ%\x00PEʒƄ,˭ʒୌˮʕ),ʰʕˮܩ˨oʒa˩&ʒO˪Ǒ$ʒŀʒO˫&ʒaˬǑ$ʒɊʒÑ˭Ƶ\x00\r	\x00\n\x00\x00\x00\r\x00ŌʕŅƽQ ˮ\x00\nʕZ	1ʐˊʗĥMʒམʒ޵ʕʒڼ\n@\r\nä	\"\r&ʒš\nä	\"ɚ\r$ʒɊʒѲ&ʒІ\r\nä	\"ɚ$ʒŀʒਦ\r&ʒ੼	\"\r$ʒΛ\nʕ౟\r\n	\"\r&ʒš(\n	\"ɚ\r$ʒɊʒѲ&ʒІʷ		\"ŧ$ʒŀʒٜʪeʕ	ӵƶ\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00Ã߼඗ʕാʕZ	1ʐˊʕėMʒ଍ʒѿJʒෝŽ\nʰʕ\x00ºʰʕ\x00ºʰʕ\x00º\rʰʕ\x00º	\"˨\nľ˩	\"˪ľ˫	\"ˬľ˭\rg9\nʰʕ\x00ºʰʕ\x00º	\"˨\nľ˩9ʰʕ\x00\n	\"˪ľ˫ళ	Ʒ\rƶFƺƸ\r\x00	\x00\n\x00\x00\x00\r	ʕZ\n1ʐ	Ԍʰʕ৮ʒॱ\r§\r	æ\r@ʰʕ\x00\r\nGʒଁʒฬ#\x00Gʒճ¦ʒֻGʒЗʒഺ#\x00GʒϢ¦ʒܔGʒƭʒ౺#\x00Gʒ௄¦ʒໞ\n\"Hʏʕɜ\nƹ\r\x00	\x00\n\x00\x005ʰʕʕߪ		ʕկ\n	\nʒ৉\n\nʒର\nʒฮĄ\n$ʒĞʒ˲	ɾʒ	œ\nʒ͍Ą\n$ʒŀʒͽ	ɾʒĞʒ˲	ʒͼʒ	#ʒ୉\nʒඁĄ\n$ʒ׳ʒන	ɾʒĞʒͽ	ʒͼʒĞʒ˲	ʒఱʒ	#ʒٞ\nʒ؀\x00	#ʒڧ\nʒ࠘\x00	#ʒཨ\x00	āCʒཇ¦ʒƏʕn&ʒૢʒࡱłʒಞʒ߱ʕFƺ:ƻƹÊƻ\x00\x00	\r\n\x00\x00Η	ʷ		ʕޤ\n1ʐ˒ʕŎʒ೘	Jʒઍų@\n\"ʏʕɜʕ\x00#ʒೕ		\n\"ʏʕɜʕ\x00	˟ʪeʕ\n߄ί0Ƽ:˘ʵÊƽ\r\x00	\x00\n	Ƽ\n\nʕZ1ʐ\n\n\n¦ʒә	\n@	ʰʕ\x00	º	ʰʕ\x00	º	ʰʕ\x00	º	ʰʕ\x00	՗\n#ʒә	\n@	ʰʕ\x00	।ƾ:ˤ	ˤʕ/ʪÐʕ\x00ˋʟʓʕࣺƿ\x00:ʪīʕyʕȹǀ\x00\r	Ã2൫	ʪīʕyʕਜʪ>ʕ	±ʪ>ʕǁ\x00ɹ2͕ˎʕ\x00ʕʕȹǂ\x00ɹ2͕ʪ>ʕ±ʪ>ʕǃ\x00\r		ʪ\\ʕ\x00N	ʒл܉ˎʕy	\nˎʕ\x00	ݷǄ\x00\r		ʪ\\ʕ\x00N	ʒлേˎʕy	\nˎʕ\x00	༴Ĺ%̕\x00̖\x00̗̖̗q̘̖ɻLi̗ࣟ\n̕̗\nʪଚ	\x00ʪ଒\n%̛\x00\x00	\x00\n\x00̛¢§ʒƄ,̛ʕʥÚlÎ̛ʕʥʒÑlʒڮ̛ʕʥʒǔl৬\rP̛ʕ)őE̛Ŀ̛ʕcyˡ̛ʕ๚̛ʕฅ	̛ʕùʒ¨\n	.	A̛̛ʕʒ¨°\n\x00q\n\x00~̛ܵش̘\x00\x00	l෈̘qɻௐiiҦ	\n̘~ɻɨٵiiҦ	®	l\rP£ıĿiGʒȬĿҏĿiJʒ̪̙\x00\r	\x00\n\x00\x00\x00\r\x00	5\nʕZ»\r\r\n\rS\rč+oiಚ\x00#iۛGʒܲ	ʕҏJʒ̓ڹʒஂJʒ̓¦ʒଛȣ	ʕnୗʒܳ໛̕&˟	̚\x00\r	\x00\n\x00\x00\x00\r\x00	5\n\x00ʕZ\r»S\rੁʒธ\rཀྵ$\r	\n\n~\n\nq\x00\rࣴ\nl˵	ʕ\nl\n\nയ		:̙\x00̗\n:̚̖\x00ǅ\x00\x00	\r\n\x00\x00\x00\r\x00\n.A\rʒ΃ʒͰ,\n+\nҾoʒƹ&ʒȥʒƺ	ŧ$ʒȘʒĩ+\rǵʒĩ+Ҿ\noʒƹ\n&ʒȥʒƺ\n	ӓ&ʒҔʒРʒȘʒƁʕ\n\x00ǆ\x00ы̃.ͭػݱ0Ǉ\x00\r	\x00\n\x00\x00\x00\r\x00\x00ƚ\n	ˊʕėʕŎʒĀ55\rʒཾʕȌʒĀƚƲʒ̓ʕ७\n\n	\n,ʕƚʕ\nMʒƷ\nMʒͻʒಥʕ	Mʒߔ\n\n\r\n,ʕ\rʕƚ౗\n\nʕ)\n,ǅǆ\n\n\x00\nʕʕʒͳƛǈ\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	1ʐʕʒĀ\nƚ\nƚ\n.AʕΑʒ΃ʒʲxʒଢ଼\r\rʒ੿\r@+Ѐoʒƹ&ʒȥʒƺӓ&ʒҔʒРʒȘʒĩ+Jǵʒĩ+Ѐoʒƹ&ʒȥʒƺŧ$ʒȘʒƁ\x00\x00	\n&ʒ¸ʒ<	\n&ʒ©ʒ<	\n&ʒʒ<	\nǵʒ<	\n&ʒ¸ʒ<	\n&ʒ©ʒ<	\n&ʒʒ<	\nǵʒ<äҮ	\nƣ	ʕc\nJ\x00F	ĺ%̕\x00̖̕շ̖շ˯ы̕\x00̖˦ǉ\x00\x00	\r\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\n\x00ʕȌʒ࣌\nʪƳQƚ\n\nWʕZµʕƬ¢ʒཕʒ޿,ƣł෹ʒ˧łʒϋRʒѥʒƎ&ʒĂʒǧʒϑ&ʒüʒǧʒƶ$ʒॏłřoʒƶRʒƎoʒˢ̫&ʒѤʒڑJһP\r\rāِ\r$ʒƂJʒ̎Eʒξ\rʒȢ\r\r	«Rʒތ	\\&ʒĂʒԅ	ҡ&ʒüʒԅ	е$ʒ௉\x00]Ǌ\x00\x00	\r\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\nW	W5¢ʒǽ,ŧ̫&ʒѤʒಋP\r੟\n\rg\rฟ࠽া௪oʒ֕oʒଇoʒO&ʒƶ$ʒʹʒ݁\n\r\x00\r\x00\r؂ʒǽ,\nҳP\r\rʒǽ\rS\n\r\r஧MʒܮMʒ౷Mʒ΋\rMʒॖӅʒ΋Mʒବʒ,T\roʒƎRʒƷ	ToʒƎRʒੂʒï,TʕƬ		Tʕ඘ǋ\x00\x00	\x00\n\r\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	̃.\r		ʒ୮Aʹ<	σʒӋfʕŎʒབʒaʒOઑ\n.\nA\n<\nf\n͚,RʒǍ\r&ʒĂʒ&ʒüʒ$ʒ\rRʒǍ&ʒĂʒ&ʒüʒ$ʒxRʒǍ&ʒĂʒ&ʒüʒ\r$ʒʒšRʒǍ&ʒĂʒ\r&ʒüʒ$ʒʒˈ#ʒO\x00\r\x00Pʒ,		ʒڌRʒѥʒƎ\r&ʒĂʒǧʒϑ&ʒüʒǧʒƶ$ʒä\x00\r\x00\r\x00\x00Hǌ\x00Պ̃นͭ໎ʹ౒৩บǍΧƱʒŐƱʒŐƱʒŐƱʒཐǎ\x00\r	\x00̕\x00̖\x00̗\x00	˯̕	.̖	ਗ̕༑̕ஙǊ\x00̕\x00̖Q̗ǉ\x00̕\x00̖¿\n\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x00	ˊʕėʕŎʒٸ5\rʒ࣋ʕȌʒҤ	ǍŁʕƬʕƓ\rP\nʕ)\nŽ\n\"\rƚǇ\n\n	ʲʕ\noʒѮ\nфʒ¨	ǌ\x00/\x00ǋ̗\x00y̕Ǉʕ),ʕնƛ\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x005ƚ\n9ʕùʒɁʕʒ໫	ʕŎʒ׸\n\n	ʲ\rʕ\noʒѮ\nфʒ¨ǋ̗\x00\rǰ̖\n	ǌ\x00˨ʕ),ʕƔ\r}ƛ\nʕݦʕùʕiq\n\x00¶HǏ\x00\x00	\x00\n\r\x00	\x00\n\x00ŌʕŅƽQϰ	Cʒյ\nCʒύǎ\x00\nF\x00	ǐ\x00\x00	\x00\n\r\x00	\x00\n\x00ϰ	Cʒյ\nCʒύǎ\x00\nF¶\x00	Ǒ\x00:ƵǏ\x00ҫ³0ǒ\x00:ǐƶ\nǓ\x00:ƺǒ\x00ÊǔӗoúRʕಾ^Нi˜Ǖ%\x001ǔͅʐ,jຐǱsʕùʒɮǖ॥ǔ໔jఝǗ\rʪȧV?ƻǘ:ʪȧ]Ǚ:˖ƻʪȧ୻ǚ\x00ɦ	ǞZHľ:Zʕ৫Ǜ:ZഏǜĉZʒÌZҮɿ0ǝ\rZഛ$ʒӜڥ$ʒ॒ʒҝ$ʒĞʒÌZɘ$ʒठʒՉ$ʒ͹ʒąZʒÌZɘ$ʒ఻ʒԈ$ʒŀʒŗZʒąZʒÌZɘ$ʒࣦʒாZʒŗZʒąZʒÌZਿǞӊZʒŗZʒąZʒÌZ،ǟ:ǞӆʒܖǞǠ\r\x00	ǝ\n	Z\x00Z#Hʕ	\x00Zǡ\r\x00	ǝ\n	Z\x00Z#Hƺʕ	\x00ZÊǢ\x00ÖʕęÍĎCʒʶʒȳʕǣ\x00ÖʕęÍĎCʒʶʒȳʕǤ\x00Cʒȵʒʫǥ\x00ǥ\x00ÖʕęÍĎCʒ૧ʒࢽEʒճʕ/Eʒೱʕʈ&ʒʒʤʒìʕ$ʒԿEʒෳʕʈ&ʒ©ʒʤʒſʕn&ʒʒmʕ$ʒԿEʒஊʕʈ&ʒ¸ʒʤʒࢺʕn&ʒ©ʒmʕn&ʒʒmʕ$ʒ෻ʕʒϿʕn&ʒ¸ʒmʕn&ʒ©ʒmʕn&ʒʒmʕ$ʒਣǦ\x00ÖʕęÍĎCʒȵʒʫʕ&ʒĀʕ$ʒȖǧ\x00ÖʕęÍĎCʒȵʒʫʕ&ʒĀʕ$ʒȖǨ\x00ÖʕӡǞʕn&ʒ¸ʒmʕn&ʒ©ʒmʕn&ʒʒmʕ$ʒஸ̋0ǩ\x00\r	\x00\nŌʕęÍǞ	ʒͬ\nłʒͬʕn	&ʒ¸ʒmʕn	&ʒ©ʒmʕn	&ʒʒmʕ	$ʒmʕn\n&ʒ¸ʒmʕn\n&ʒ©ʒmʕn\n&ʒʒmʕ\n$ʒȖǪ\x00ƽʖΏʒ๙Ǣ\x00ʕ̜ǭ\x00ǫ\x00ƽ\nǥ\x00ʕ̜ǭ\x00Ǭ\x00ǥ\x00ʕ̜ǭ\x00ǭ\x00\r	\x00\nP		ʕ)	,\n	੩\nʕę\nÍ\nĎ\nCʒʶ\nʒȳʕ\nǮ\x00\x00	Ö	ʕӡ	ǞǑ	&ʒ¸ʒ<ࣸ	&ʒ©ʒ<ʒේ	&ʒʒ<ʒఴ	$ʒࠅĿ1°Rҁ˴̕̕%̖\x00̗̖q̗Ħ˳\n˲¿̘%΁ߥʪƳ఼ʕùʒɮ\r\x00	Ãࢎʗéʘυ9ƶ\n	ƝʕùʒѿʕʒɁƎǎ	9ǈ\x00̘rƻ\nʲʕƙʕƮƥ!ʕūƒ̖\x00த\nÏ̙%\x00\x00	\x00\n\x00\x00qq	΁ಐ\n£̖@̖\n.!ʒƂ\n;ʒǝͦ		\n˿̚\x00˳\n̚\x00˲\n̗ࠠ̚\x00\r	ɝ9	ư\n	ʕʒϚ	ƽ	\n	Ǉ	\x00̘r	ƜƎ	ࠂʕ˔	\nʗ4ʘਉƵ	࢐\n਀¦\x00r	ɪ\x00\x00	\r\n\nCʒƂ\n΁ອL̖঴\x00\n\x00	Ĥ̗;ʒϚ̗¬ʾ̙ౚ	\r̖VDޔͦ΁ঔౖǯ'˴?˴rǰ\x00\x00	'˴	༅˴¦\x00\x00	ŀ\x00\x00	\r\nP\n\n	\n,\nǣ\n]Ǳ\r\x00	\x00\nǃ\x00ʕȟ	.\nҞǃ	\x00ʕ؈b.?ҞE\nѽǲ\rb\x00?	#ʕƘ?LE	#ʕEŕ}ᄿ0ǳ\r\x00	ʙಘʙ[ʢȎʠධ		ʕ)	őǀ\x00	ใǴ\rǃǃ\x00ʕəʕ໘ʪɴʕ\x00ʕ॰ˎʕyਤǵ\x00'?ʕƘHǶ\x00'?ʕHǷ:ǃǃ\x00ʕəʕડŁ\x00\r	\x00\nʕ¶ʕŐ#ʕ͐		ʕ)	S\n	Vƿ\n\x00d\nʖΣʕ͛ł\x00\r	\x00\n	5ʕ¶ʕŐ#ʕ͐\n\nʕ)\nൣƿ\n	ʕ\nѩ	ʕ਱ʕήǸ'?ǃǃ\x00ʕəʕৠǹ:Ǆ\x00ʕ࢞Ǻ:Ǆ\x00ʕชǻ\x00:ǺǎǺņ\r̕\x00\x00̖\x00̗\x00̘\x00̙\x00	\x00\n\x00̚\x00̛\x00̜\x00̝\x00̞\x00̟\x00̠\x00̡\x00̢\x00̣\x00̤\x00̥\x00̦\x00̧\x00̨\x00̩\x00̪\x00̫\x00̬̕µ̖̗µ̘̙µ	ʒ෽\nʒɍ̛ʒf̠̭	\n̡̭\n\n̢5̤΁ö̦̨̩̪΁ö̬q2°5Ú!ÚKLR\x000\x00S\rҁ%Ǘʒ֍ʕʯ̥ʣમ̞̷̟1̸ʒ̜Ǚʒऺ̝ƉsʕଶƏˍ\x00ʖô\nƏˍ\x00ʗW\nƏˍ\x00ʗē	\nƏˍʕՔʞˢ\n\nƏˍʕՔʚĮ\nƏˍ\x00ʖŦ\nƏˍ\x00ʗʳ\r\nƏʻ\x00ʡO¿̽঍̽ž	̽ʒa\n̽ʒ-̽ʒO̽ʒƝ\r̽ʒÑ̜9̿ఒ̹ʒ෷̻ʕ໸́ث\r'̞ʷ`̾̗\n̚	ǭ\x00̚ϖ̭\r̓\x00̈́\x00ͅ\x00͆\x00\x00	̓\x00̈́ͅ͆5q	\n\x00k\x00\x00¡\r\x00v\x00\\\x00c\x00\x00_\x00y\x00±\x00rH\nࡻͅȠ̓!̈́ͅ!̈́%ԽkÂ͆̈́̈́+̈́Ƞ̓ǲ\r%ԽkÂͅ+ͅԩ̓Ǵ̓\x00͆ͅѩĆ؞Ł͆ͅ\x00ͅ+ͅȠ̓ΝͅJ̈́̓Ǵ̓̈́ͅ˜̈́ͅĉȠ̓ĉԩ̓Ǵ̓:͆˦̮\x00\x00	\r\nP\n\næ\n@\n	̯\x00'!ʷ !ʷණݚѫय़ॴ̰\x00:ˊʕŜýݭýŭê൷êฌ̱\x00:ˊʖíý୊ˊʖíêޏ̲\x00\r		+ĨɞĬɌˊʕŜĨŭĬӴˊʕŜĨŭĬԠˊʖí	Ԩ	˖	ǲˊʘՃ	̳\x00\r	\x00\n	+ĨɞĬɌˊʕŜĨŭĬӴˊʕŜĨŭĬԠˊʖí	Ԩ	˖	Q\nˊʘՃ	\n૿\nʒ̬ˊ଱\nŕ\n̴\r\x00	\x00\n\x00\x00\x00\r5	1̺͓\n۪§ʕ),\r1̺ý\nɫê\nǂʕ̳\r\x00	Ũ\nH̵%\x00̓\x00̈́\x00ͅ\x00͆\x00͇\x00͈\x00͉q̓5͇5͈5͉5È\x00	\x00\n\x00\x00{\x00À\r\x00Ë\x00Ä\x00t\x00®\x00¬H\r\x00	̈́͆ͅ͈5͉5̓5͇¢	B	;_B	y	ட	;Ù̓̈́̱r	\n\n̈́ā͉ʕr	෕̯r	\nொ͇͆̰r	\n\n͇͆˄ʒખͅ#͇͆͆ඔr	\n͈ʕ	Χͅ\x00͆]\n\r\x00	\x00\n\x00\x00ʒÑ	5\n̮	\x00ڈ͆æ@͇EʒÜ	ൠEʒƜ	੒Eʒ໅	௫EƆõ	ൻEʒ޷	੏	๜æ@	ఔ\nە\n\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ʒȗ	\nq\rĹ̈́?	ų̈́൪55\n༽̈́૥̓x̓VಢCʒ޾ৃ์#ʒ૝J\x00Ƒ\x00яϊ\nœջ\x00જʒַѷෞ,࣪Ƒ\x00яϊœջP£@ӄʕʒઔఢ\nC	\r\r\n\x00	ˊʖƤ\r\x00	È	\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00¬\rĦĹ͈ʕʒౌ͉ʕ؟஭͉ʕƻS	͉\n͉ଥ̯	\x00\nuࡘ	ֲ\n׆+	ê\nɌ	ý\n߾ʒ؁ʒ׿ʒ࠺ÍʒݧʒഡʒതCʒכʒෂ	ê\n۽ʒחʒഩʕϙʕʒޝʕͤʛ٩»ʕ),#gʕZ»ʕ),ˊʖíӃ\n#ࢱʕඏ+ʕƓӈʒaCʒ༜ƿ\rݲ\r෫\x00୤ʒӖ\r\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00ʒĝ	¬\n¬¬ࢳ͈ʕ\rµ»§͈ʕƻ,͈͈xޮɫ	;9\r×CʒÜ\n	L	/×࡭ࡳ;9\r×CʒÜL/×Cʒǝ\n;	9\n	\x00\r࡮Cʒǝ;9\x00\rپ\r\x00͈ʕʒஔ%\x00\x00	\x00\x00\x00\r5	Ĺ͈ʕഁʒֿ\x00ʕౢ\n\x00'JCŮࠥJCŮȀʒ೓̴͈\n\n.ໂʒʕ),\r\nಀ\r9×	Cʒɺ༌	ܤ	×\rΡ\x00ʕඟ\x00\r	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00	ʒવ\n͈\x00˖	Mʕ༝ʷ\x00ĹʒڄʕƻGʕऎ@1̺࠼ੑގݱ;ʷ9̲\x00\n#\x00ˊʖƤ\x00ăĄJॉോʒిŲ୆\x00\x00	\r\n\nЉ;̕๶\\ࠔ	ʕӣ̯rr	\nޯ\n%\x00\x00	\x00\n\x00\x00\x00\r\x00\x00͈.1̺͓	ʷ\x00\n»\r§\r͈ʕƻ\r,͈\r̱\x00ย1̺ýɫêǂ\n̳\x00\n	ʷ\n		њ×	\n\x00௿\x00]\r\x00	\x00\n\x00\x00\x00\r\x00	\nڰ̬h	̬h1̺͈ຌ͈ಓ̬	̬̬h\x00͈ʕǗ\r\r\r,͈\r	Ȧý̬hʝ\nȦê̬hǂ̰\x00\n̬Ρ	\x00\n\x00\x00˦̶%\x00̓\x00̈́\x00ͅq̓5̈́ͅÈ\x00	\x00º\n\x00H\r\x00	̈́ͅ»B;_ByÔ	r\n	ʕʒˎ	ʕʒࣜ̓̈́	\x00̈́ч	ʕʒɺͅཌ	ͅ\n\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00ʒɢ	ʒ׽\nż5\rĹ̈́߈̈́æ@̓ʕʒժ\n˵ʕ୬\nʕ୭ч\n˨æ@˄	\rڐ\r\r\x00	\x00\n\x00	ٓ\n\n̈́æ\n'\n̓\nVʕʒ໩ʕʒྲྀʖऴʖު	ࠓ̓\nѠ	~̷%\x00̓\x00̈́\x00ͅ\x00͆q̓̵̈́̶ͅ͆ʙࡿH\x00\x00	\r\n\x00\x00\x00\r\nౕ!̖Л£̓@̓ʖպ̓U̠\x00\x00	\nʷ9\n\x00ͅΦ̠c෵£̈́@̈́ʖպ\r̈́U̡\n\rʷ9\n\r\x00͆Φ̡cख़\n~̸\r\x00̓\x00̈́\x00ͅq̓̈́̭\nͅ̭\n¯	\x00»\n\x00¹\x00ÆH	\x00\x00	'࢑!̖9̈́v	\n̓œͅv	ޛÆ\n\x00'!ʷ?H:˖MʒښŮ˚%\x00\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00!\x00\"\x00#\x00$\x00%\x00&\x00'\x00(\x00)\x00*\x00+	\n\r̛\x00 ̛\x00!̈́\\\"ͅ\\|!Ξ#̈́B#;̈́_B#̈́y#Ô$̈́r#\n%$\x00	#%.#%AˊʖƤ$\x00\nˊʖƤ$\x00\n${;ʷ9&${\x00&ܽ×#&A&.	њʒԳ\nʒԳࣵ'$Ë\x00#'.#'A($®\x00#(.#(A)$¬\x00#).#)A#)<#)f\rˊʖƤ$Ä\x00\r\n$t;ʷ	!̛	$t$t˿ȣˊʕėMʒҕȣˊʕėMʒҕCʒѰĄӇʒीʒ֪ĄӇƆ໕Ŭ+JʒଙʒཅˊʕéMʒˊʕéMʒˊʕéMʒڣĹ\"Ξ#ͅB#;ͅ_B#ͅy#Ô*ͅr#\n\n#*\x00#*º\x00*;ʷ	 ̛	 *  *˿!̛	ƿ !̛	 ƿ#̚5+	+۷ 	+lʒרǢ̚\x00+\nǧ̚\x00ˊʕé	Ũǧ̚\x00\nǧ̚\x00̓\nǧ̚\x00\nǧ̚\x00\nǧ̚\x00\nǧ̚\x00\nǧ̚\x00\nǧ̚\x00\r\nǧ̚\x00\n\nǧ̚\x00\nǣ̚\x00\nǨ̚\x00ЩǨ̚\x00ЩǨ̚\x00ڝ̹\x00\x00	ਲ਼ʕѧ෿ʘຈʗৢʕ୨	౽ʖദʖࡍů฾ůಂʖՍʖӖ̺\x00༡ຸ̻:΁­̪̼̀ʕම̽\x00\r		1̹\x00\x00̻ʕ׍̜	̿	૑̼	ߧ̫!̖	̾̖Q̡v	\n̫̗\x00̡õ̾̗̩ׄཉ	ʕӨ̠v	/	ʕٍ̾̖\x00̕\x00	\n	ʖί̘	̩ʒ׭̨̩ʒࢰ	ʕʒԤ̧	\x00̩ཟ	ʕʒร̯̧\x00	̾̖Q̩ࠪ	ʕʒÜ̩Ď	ʕӣ	ʖί̙9̩ʒ-̨ݼ	ʕӨ̨స̨̨GʒÜ̩̫ۜ̖~̾\x00\x00	\r\n\x00\x00ʚǅʜˆ!̖	̠\\̸̡\\ӛ\n̞ʙ4\x00\x00	\n̟¯\x00\x00\nȈ̿\r5ʕʕ࣠ʕ۟ʕʝʕআʕʝʕǂʕʖ݆ʕʖݶʕʕ੾̢ʕʪeʕ̢࣎ʕາ΁­̤Gʒ༃̖́̀%\x00\x00	\x00\x00\r\x00Ǘʒ೷		ʕ)	ߊ		ଖ\n	ோʪeʕ\x00ʕۤƵǖ֋%7ʻűҋʻűƚʜ඾ʻʢळʒࢵʪeʕزˊʖত\rฺ˕sʖۑʻʖʽʻʖ̣ʖۮʻʖ̣ʖ૆́%ܪ̣	̣̀Ł̦āʕ̣\nʕ̦\nʕ̝\nʕ˔̢\n̢5̤΁ö͂ʪeʕୋ͂\rżʻʕএ1ʻʕ๓ʻʕമ1ʻʕ਺ʗഖ˵ʕĥʗǦ̥{ʖʹ౨ɝ0Ǽ%\x00̕7˶`˶µƏˍ\x00ʛ<ǿ\n˟ƣƤ΁ċʒॢ̕D<˟<\nʪŶʒaʪ਩ǾˍʕՄ¿\r\x00	\x00\nʪ>ʕʕ ʕՇȁ\x00ʕηʕЅȁ\x00ʕȭɓȸ̕ɦ\x00ʕѵ΁̗ʕຽʕ4ʖЁʗৡʘʼʕƉۋʕϢʪ¯ʪĵʒখ	ʕ4ʕЂ	ݮ	ʕŞ	ɡ	Q\nȓ	ţ0ʕ؆ʸ\nளɻ\x00ɥૹǽ\x00\r	\x00\n\x00	ʕ4ʖَ	ɹ`	΁ૻi\n˹	Ĥ\n9\nq˹	\n\x00ʪÀʕ	઀ʕඊ	΁τ	\n\nA΁ċ	\nƤ\nA\n\n@@ڏ\nǾ\x00\x00	\r\n\x00\x00\x00\r\x00\x00\x007Ҽʷ`\n1ʐʒ˛ʖӤ\rʚдʚ໒		Q\rѓǊʸ'ਙVࡸश\n\"\x00\rǠӛ\n๢ȁ\x00'ʕ4ʖڃ΁Ļ\x00\x00ʕ4Êȃ\x00\x00	\x00\n\x00\x00Ć@ÅÅ	Å\nÅUÅYȄĆgமȅĆzȆĆeӻWӻН`Å[	[਎	ʕתȇ\x00\r	\x00\n\x00\x00	΁˸ʒ\n»£๒e஗z	\nä\nG	ʕඑ΁˸	ʕƓʒ৵Ȉ:Ƒ\x00˿ȉ:Ƒ\x00́Ȋ\rȃ!ʕŇʕ૕ʕьʙԓֹБ0ȋ\r\x00	\x00\n\x00g7ʕФʒې	.\n࢙\nʕʭ\nʕ೜	zȅ@	zʕ͍̂\nʎʕȼʪI¸ʕ´ʕʕ͂	@̌		g7	ʕФʒȻ		ʕʒšzȅ ȊXȉȍϽ	ʕc	ʕʒ-ʒٖ̂\nʎʕcʒĴ\x00ʕʕȼʪIʕ´ʕʕ୘	@̍9		g\x00		ʕŪȉʕɸʕĮ	ʕc	ʕʒaʒ¨̂\nʎʕcʒĴ\x00ʕʕȼʪIʕ´ʕʕඥȌ\x00'ʕଣʘ໶Ƒ\x00̀ȍ\r7ʕʒʱʪÀʕཱིʪÀʕ\x00ʕࣉʕьʙԓܧʪʕǰʕೌȎ\r\x00	\x00\n\x00\x00g\x00	೩	zȅ@	zʕѰÆʪI­\x00ʕcʒĴʠಸ	zʕگʕǭʒԤʕcʒĴʪI´ʕ[	\x00ʕʕʕ͂	@̍ˇ\n	g\x00\n<\n.Ȍ\nƛz\x00൤ʕĮʕʒƂ#ʕ࣐ÆʪIª\x00ʕcʒĴ\x00উ	@̌\n	g7\nʕȷʒȻ\n<\n.ȊXȌz\x00ȍϽÆʪIª\x00ʕcʒĴ\x00ʕɢ\x00ʕʕȑʒƂʕcʒࣷȏ\r\x00	g\x00	<	ʕѪļ.ÆʪI\x00¾ʕ[ǒʕ͆Ȉ	¾.ÆʪIʕ[સ	ຂȐ\r\x00	g7ʕȷʒȻ	<Ȋ		ȍ	\n	ʕѪļ.ÆʪI\x00¾ʕ[ǒʕ͆Ȉ	ƛgƛgʕ༪ƛgݍƛgʕ޻¾.ÆʪIʕ[୧	\x00പȑ\r\x00	g\x00ʕǭʒժ	A	zʗ϶ÆʪI\x00¾ʕ[ļ	\x00ʕcʒѕʕ࢜Ȓ̀@ߍ̌ȐȆ̍ȏȆ̎ȎȆ̏ȑȆ̐ȋ૱ȓ\x00\x00	\r\n\x00\x00\x00\r\x00\x00Ãੲ\n΁öʌ\n\n΁ӱ	½P\r\rʕ)\r,\rĿ	Ȓ\rเ\n΁öʪ¥ʒଫȇ©\x00¼Q\n΁öʕര\n΁ӱʻʕիFĽșɃǾ\x00	Ωˊ	\rÃ ʖտʕΐʪ>ʕʕŖɻ\x00\nʕԸɓQɥō\x00\x00	'ȝd΁ȯ\x00	\x00NʕԘ#	H	Ț\rʻʠඃʕ٦Оʕஒz Ɵ\x00ʖݹƥʕːОʖγʕलʖۧʕԲʕണʖցʒ೧ʕԲʞ๕	௙ʕ0ț˷ʖγʖցʒশҨȜ\r\x00	\x00\n\x007ʻʕ౐ܼʜƝʝ௲		ʕ)	ࢸʻ	ළʻ	௢ʕ԰ೳ\nʻ	࢔\n\nʗ˕ʕ)ő\nʗ˕Տ\nʗ˕Tʕ԰ݾȝߑ ʕ૤ʖටʪ¯ʪĵʒȬƉøʖώƉsʖฝȜഝʕդʕǥˋʠۃʕĈ̂ʕjʕࡨʕդʕːˋʞರʕĈˠʕʕݗҨȞ\x00\x00	\x00\n'ȝ	ൄ\n±ʕŮ΁ȯ\x00\n\x00	Śȟ\x00\x00	\x00\n'ȝd΁ȯ\x00\n\x00ȚXƟ\x00ʕ҆ʕÿ\n+΁ȍ߸\nL΁Ļ\x00	\x00\nF\n໦ȚXƟ\x00ʖ൯ʕÿ\n#	ഋ	\n\x00ɾ3\n~Ƞ\x00\x00	\x00\n'ȚXƟ\x00ʕȱʕÿ\nɰ\x00	Ä\nL΁Ļ\x00	\x00\nF\n~ȡ\x00\x00	\x00\n'ˍʕÿ\n΁౹\nL΁ۀ\nF΁૷Ȣ\x00\x00	\x00\n\r7Țuȸ\n\nʕÿ	ĐL	\x00șF\n~ȣ\x00\x00	\x00\n\r\x007Țuȸ\n\nʕÿ	ĐLʖ௃	\x00șF\n~Ȥ̕\x00\x00\x00	'Ț̕XƟ̕\x00ʕۡ	ʕϷ̕	\x00̕\nH	\nɜ̕ඕ̕٤ȥ\x00\x00	\x00\n\r\x007țϮʪ¯ʪĵʒӽʘ̎ʪ>ʕʕЍƟ\x00ʕ̈ʕˀƟ\x00ʕՂʕʬʕୈ!ʕÿ\nɰ\x00Ä\nLɫ\x00\x00\nF\nປȦ\x00\x00	\x00\n\r7ʕʭȚXƟ\x00ʕ౳\nʕѐǽ߹u\n\x00ʕ̯ʷǄϫ\nިȿ0Ŏ\x00\x00	\x00\n\r\x007ʷ ʪԑ	ʕŇ̄ʕ	Vʷ\x00\x00	\x00\nNʷ?Γ!ʕԘ	͑\nH	\nȧ\x00\r	\x00\n7Țu	ʪ>ʕʕ 	!ʕġ\nVȚ\nd\n7\nKƿ\n\x00ʖ֘ʪª\n\n΁ȍN\n;ʷ?΁ג\n߬]Ȩ\x00\x00	\r\n\nʖӐɹ\nN	?ʪª\nચ\n]ȩ\x00\r	\x00\n\x00\x00\x00\r\x007Țu	ʪ>ʕʕ 	!ʕіȨ\x00ॆ	ʗԙ\nɿˍʒðɿ˗ʒðVʕǟ\nʘŮ	΁ńј\nʖǥ\rʖӐɱ\n\rʕ=ʕĊF\rʕڻƉȀƊ|ȝdʪªǱ]Ȫ\x00\r	7Țu	ʪ>ʕʕ 	!ʕіȨ\x00݂]ȫ\x00'Țdɺ\x00F]Ȭ\x00\r	7Țu	ʪ>ʕʕ ɦ\x00dʪªђ	ʕʑ΁ńն]ȭ\x00'ƉȀʪආȚXƟ\x00ʕ൘Ȩ\x00ॻ]Ȯ\x00\r	\x00\n7țϮʪ¯ʪĵʒӽ	ʘ̎\nʪ>ʕʕЍƟ	\x00ʕ̈\nʕˀƟ	\x00ʕՂ\nʕʬ\nʕઈɰ	\x00\nÈ]ȯ\x00:]Ȱ\x00'!ˍ?΁ċʒ˂]ȱ\x00\r	7ȚXƟ\x00ʕȱ	ǽN	?	uĽǠɍ0Ȳ\x00'ˍ?Ɗ|ȝdʪªǱ]ŏ\x00\r	7ʷ ʪԑʕŇ	̅ʕV	ʷ?	\x00È]ȳ܌ʕುʕÓʢʝܾʗསʕ੖ȴ\r\x00	\x00\n\x007ȳ͊ʕOʕƲʕਊʗӪʖŹʙ.ʞಯ		ʕ)	S\n1ˋʗʒ	௕\nʕî೛1ˋʛ்ʕîఓȵ\r\x00	\x00\n\x00\x00\x00\r\x00ʕOʕƲʖŹʕന		ʕ)	S\n1ˋʗʒ	঵1ˋʗʒ	Đʜࢲ	Đʗ஑\rų\nʕîÔ\rఙʕîÔǋ\r̋๳\r̋ີ\r;༏ȶ\x00'ˋʛԉʖะʕĈݛ9ʕĚˋʡ༊ʘþʕĚˋʞඤʘ໤ʕĚˋʙ൹ʕĚˋʣ܀ȷ\rʪռȶ{ʪ½ʒɓʗҖׂˍʕćʖʔʖď\x00ʂ\nʖˆʪռʪ½ʒɓʪīʕ\x00ʗ଄ʕϾȶ௹ȸ'ȴॅȷ·ϫȹ\x00\r	̃#Ãȵ̃؏ʪ¯ʪ½ʒԺ̃ȸ̃/ȴ̃	1ʪࠡʘେ̃\x00ʞȟʂ	\ñ	ʛ̥ʗ৔	ʕƞʗ๟ʙș̃\ñաșȺ\x00\x00	'Dʘறʕ໷ʪ୾ʒ˧΁࠴±ʝചʗݓɒ3Ɩ\x00\x00	Ȼ\x00\x00	'ʻ?ȗʕjʻ\x00	FƖ\x00\x00	ȼ\x00\x00	'ʻ?Șʕjʻ\x00	FƖ\x00\x00	iŹ0Ƚ\x00\x00	'ʻ?ɷʕj\x00	FƖ\x00\x00	Ⱦ\x00\x00	'ʻ?ɸʕj\x00	FƖ\x00\x00	ȿ\x00\x00	'ʻƥ	ƋʕŮȓ	ࡓƖ\x00\x00	ɀ\x00\x00	'Ɖø˃?΁૰\x00	ÕƖ\x00\x00	Ɂ\x00\x00	'Ɖø˃?΁๧\x00	ÕƖ\x00\x00	ɂ\x00\x00	'ƉȀ΁څ\x00	ÕƖ\x00\x00	Ƀ\x00\x00	\r\n\x007Ɖø˃\nǄʕťʕЌǃʕťʕ໗ʪş\nHĽƖ\x00\x00	Ʉ\x00\x00	'ˍʪݸ	Ƌʕ̑ȹ\x00	ÕƖ\x00\x00	Ʌ\x00\x00	'ȚXʖˬɫ\x00	.	ǐƖ\x00\x00	Ɇ\x00\x00	'ȚXʖˬɰ\x00	ÕƖ\x00\x00	ɇ\x00\x00	'ȚXʖˬɲ\x00	ÕƖ\x00\x00	Ɉ\x00\x00	'ʻʖ۠΁ঁ\x00	FƖ\x00\x00	iǵ0ɉ\x00\x00	zʻʡ८	КʻʖΈɞ	ࡧƖ\x00\x00	Ɋ\x00\x00	ʻʙɭzʻʙɭ	КʻʖΈɞ	ݕ˵ȚXǂʕՒʕȱʪ֦΁ԢÈƖ\x00\x00	ɋ\x00\x00	'ȚXƟ\x00ʕ੽ɔ\x00	ÕƖ\x00\x00	Ɍ\x00\x00	'Țdɴ\x00	ÕƖ\x00\x00	ɍ\x00\x00	'Țdɵ\x00	ÕƖ\x00\x00	Ɏ\x00\x00	'Țdɳ\x00	.	ǐƖ\x00\x00	ɏ\x00\x00	'Țdɶ\x00	.	ǐƖ\x00\x00	ɐ\x00\x00	\r̕7Țu̕ʖի	ȟɹ̕\nǾ̕\x00\n\nʂ̕F̕ĽƖ\x00\x00	¿\n'̕`ɹɑ\x00\x00	'΁ٟʗවɚFƖ\x00\x00	Ő\x00\r	\x00\n\x007ʷ ʪ׶	¢\nʒ\nʐ\n,	ʕɣ\n༗ʕŇ̆ʕVʷ?\x00\x00	ÈƖ\x00\x00	ő\r\x00	¢	§	ʐ	,ʕɣ	էʻʕుȗʕjʻ\x00ʻʖ໿Șʕjʻ\x00ʻʖ෴ɷʕjʻ\x00ʻʖ൴ɸʕjʻ\x00Fʕjʻ\x00Œ\x00෮ʻʕංʕ̑ȓਢ}ʑ0œ'ˍ?΁జʕຯɒ%\x00˲ʗচ˲ʘ֟	˲ʗণŕɓ̕\r\x00Ã̕̕5Ə̕\x00ʕǦ	\nǽ̕Nu`̕ʕ4ʕஃɫ̕\x00ʕē	΁৾̕\x00ɔ\x00\r		ǽN		uನ	u	uʕʵ	uʕ\x00·\nÏɕ\x00\r	\x00\n\x00	7		ʕ๥\n\n	ʕ൉\nҊ	\nʕʵʕ\x00·Ïɖ\x00\x00	\r\n\x00\x00\x00\r\x00\x00\n	.	A	ւʕūʙқı΁ƪ\n\x00ʖধ|	|౪|ʕ\nƟ\x00ʕϋ\rĦʕ4ʕ9ʪeʕүʪIXѭʪIa\x00ʙ૭\rʒ୸ʪ\\ʕ\x00ແ \r	ɥ୕΁ƪ\n\x00ʕߎƟ\x00ʕൟɓͧ	ഌʕܿʕʗߕʠŸ߭Ɩ\x00\x00	ɗ\x00\x00	\r\n\x00\x00\x00\r\n	.	A	ւ!ʕūʙқı΁ƪ\n\x00ʖ֌|ó\r\r|ʕ)\r,|\r¤	|ʕc\rਘ΁ƪ\n\x00ʕಪó\r\rʕկ\r¤	ʕc\r೻\r܈Ɩ\x00\x00	ɘʗੌʗਛʘಌə'ʗ੬ʢࢾʘ੃ɚʗมʗਲʘഷɛ:ʘڭɜ̕\x00\r\x00	\x00\n̉̕\x00ǽ̕\n	+AƧ̕ʕ૎ʪǁ	uɘह2@ @Gʒॾʪগ\nʪpAё̕ʕŖ\nʷ \nʪห΁Ŋ̕\x00ʕڔ̕ʕ=ʕĊ\n\nʾ̙ɝ̕ೠ˓0ɝ\r΁ȍ\n̉ʷ\x00;ʷ	ʕËʗતɞ̕\r\x00̊̕\x00̕ʕ4ʕȭKƿ\x00ʗभ΁ȍ̕\n!ʷ	΁Ŋ̕\x00ʕ̰̕ʕ=ʕ\nʾ	̙	ɟ̕ɟ̊ʷ\x00ʕຓʗಛɠĉˋʝધʕཁʕĈÊɡ\r\x00	\x00\n\x00ŌʕŲ̂ʕ\n	ˌʕ\x00ʕ౫\nʕΑʪʕ\x00	\x00\n˟ɢ\r\x00	\x00\n\x00̕\x00\x00̖ǽ\n	ǽΔ	wઌw	\n	wɨ\nʕ4ʕ	w\nࢧ\nʕŞ\nɡ\nQ\nȓ\n೾\n๭̕ʪeʕүʪIXѭʪIa\x00ʙƴ\nಉʪ¯ʪĵʒࠨʡ౶ʟ˖ʡ՟̕ȓޥ̕\x00ʕ̅ʸ̕ѻ̖ʕ̅\r¿\r%\x00\x00	7̖׾˺ʕ4ʕ˺ʕ๎ʕ=ʕŬ̕ೃ̖ā	˺ʕॽʕຏ̖๛ʕ=ʕŬࢋʕ̅H	~ɣ\r7ƙ|љ|ʕ),Ɛ\x00ʖĝ|Śɤ\r7ƙ|љ|ʕ),Ə\x00ʖĝ|Śɥ\r\x00	\x00\n\x00\x007ǂʕՒʕ҆ɢˡʕŬʕහ		ʕ)	S\n	ʕ4\nNɠu\nʕɶɣࢊʕŞɡQʖȓǀ\x00ȓˎʕ\x00ʕഔȓţ\nʸ·\r^\nʕɶɤۓɦ\x00\r	7ʕ૖	ʪ>ʕʕঢ	ʙƃ	ʖʧ	໖	ʗƃ	ʠ֡	ʗΟ	ʝ൭	ʕ൏ǂʕ4ʕ̞ʖ௼ɧ\x00\x00	\r\n\nʪ>ʕʕ \nʕȾ΁Ļ\x00\x00	ఞ\nʖҹʕ=\x00	\nɾ३ʕ=\x00	ɨ\x00\x00	\r\n\nʪ>ʕʕ \nʕȾʕ=\x00	\nɢλʕ=\x00	iʵ0ɩ\x00\x00	\r\n\nʪ>ʕʕ \nʕġ΁Ļ\x00\x00	λʕ=\x00	ɪ\x00\x00	\r\n\x00\x00\nʪ>ʕʕ \nʕġǽţຕV	ཱྀ	ʕŲ¬	ɡ	ă	ȓ	ţʕ=ʕē۴ʸ	®	\nuʕභ\r^ʕ=ʕ๑ʕ=\x00	ɫ\x00\x00	\r\nȃʕŇ\n̇ʕV\nʷ?\n\x00\x00	Èʕ=\x00	ɬ\x00\r	\x00\n\x00\x00\x00\r	ʪ>ʕʕ 	ʕȾ\nǽN\nƥ\nAʕŮ\nA̡ʪªʕ4ʷ	ʗԙɿˍʒðɿ˗ʒð\rʕ4NʕǟʘŮ\r	΁ń\rјʖǥ\r?ɱ\rÈʕ4ɭ\x00\r	\x00\n	ʪ>ʕʕ 	ʕġ\nǽN\nD\nAʪప\nAʕ̑\nA̡ʪªʕ4ًʕ4ɮ\x00\r	\x00\n	ʪ>ʕʕ 	ʕġ\nǽΔ\n\nV?\nVĽʕ4ɯ\x00\r	\x00\n	ʪ>ʕʕŖ\nʕ4Nɦ\x00dʪª\n	ʕʑ\n	΁ń\nࣹʕ4ɰ\x00\r	ȃʕŇ	̈ʕV	ʷ?	\x00Èʕ4ɱ\r\x00	ʪª\n	ʪ\\ʕ\x00ʪϬʕਕ	ʒթ	ؤ	٪ʪʕy	Èɲ\x00\r	\x00\n	ʪ>ʕʕŖ\nǽ\n\n9	ʕҟʕˀ	ʕǩʕԇ\nAʪ\n@ʪ̰	ʕǩʕஆ\nVʷ\x00\nuʷ܆	ʖෟʕԻɾ೵΁Ŋ\x00ɳ\x00\x00	ʻʖˁzʻʖ˰ɽ\nʂ˹ʣͿ\x00	ɴ\x00ʻʖˁzʻʖ˰ɽ\nʂ˹ʕƼí0ɵ\x00\r		ʕƉ\nɾ3	ɶ\x00\x00	ʻʖˁzʻʖ˰ɽ\nʂ˹ʟ༧\x00	ɷÖʕϩȓʅƖʻ\x00ʖࠁɸÖʕϩȓʅƖʻ\x00ʖ్ɹ\rǽ\n9w;ʷ	ʕ=ʕŬwQ@ʒˎ@ʒԻƟ\x00ʕڪʕ=ʕĊA/Ɵ\x00ʕԚʕ=ʕA\n	ʷฆV;ʷ	ʕ=ʕēVQ΁Ŋ\x00ʖܢɺ̕\x00\r̖7ʪ¯ʪ½ʒ˧̕ʕݑʪ>ʕ̕ʕӝʕʑ̕૵̖ˍʕćʖʔ̖ʖď̕ɹ̖\nǾ̖\x00F̖ʖ۲̕̕ʖంɹ̕\nǾ̕\x00	F̕஁'̖`ɹ	'̕`ɹɻ\x00̕\r\x00	\x00\n̕ʕߵʪ>ʕ̕ʕࠬ	+ʕſ\n+ʖࣃʕࢮ	 \nགྷʖ௭	Ə̕\x00ʖĝࡲ˷ʗͶ̕\x00˷ʖ߿΁ö˷ʖƢ~ɼࢹۄʕދ୒ǁ\x00ʙज़ǁ\x00ʢଟǁ\x00ʜटǁ\x00ʢ਌ǁ\x00ʜާɽ\r\x00	\x00\n\x00\x00\r\x00\x00\x00\x00\x00Ã ʖտʕΐʪ>ʕʕŖɻ\x00Nʕ4ʖࢣʕԸɓQɥɤʕՇȁ\x00ʕηʕЅȁ\x00ʕȭɓȸɦ\x00ʕѵʕ4ʕѴ΁̗நʕࣂ	ʕ̈́ɼ	ఘ\nʖˆ\nȓ\nţʖď\nǄ^ʁۿʕ4ʕĪ9΁ń\nʕ=ʕA௻ʘඉ\rʕ4ʛ¨ʕ4ʖğ\r\rʟː9ǃ\x00ʕìʕ਽ʪÐʕAˋʙaʕസʕÁʪpƌ\nʕ=ʖԞލʗලɿˍʒðɿ˗ʒðʕǟʘŅʁ/ʖŞʀਖʖҹɾѡɥɾӂ̋`̋˟\x00ʾ̙˟ƣͫǻ̋<\x00˟<΁ۥ̋ʪࡑɿ\x00\x00	\r\n\nʕ4\n\n9\nƾ\n\n	9	Í\nʪ>ʕ\nQ	ȣ\nʪ̳ʕ\nؒ\nʀ\r\x00	ʕĊ	ʕ4Ӹ	`΁Ǚ\x00\x00	๹ࢗ0ʁ\r\x00	ʕA	ʕ4Ӹ	`΁Ǚ\x00\x00	ָʂɃǾ\x00ɽΩÏŔ\r\x00	\x00\n¢	§	أ	@ʕɣ	է!ʻʗʵʕ౱\nʕబ\nʕŅʕສȓ\nʅʸʕܡʸϙʕඪӍʕ࣡ρʕȑʒ୰.͗ʕȑʒۍ.A৶ʃ\x00ʃ\x00\r	\x00\n	¢\n\nʕ)\n,	\n֔\nʕԼʸʕOʘĮʙಠʪeʕ	\x00ʕȉʕ͇\x00ʄ:̑]ʅ:̒੄ʆ:̓ʕÓ൨ʇĉGʒܒEʒͲGʒЗEʒཪGʒऱʈ:GʒƭEʒ๊ʉ'ʒў̔ơʒڒʇʊ'ʒў̔ࡈʇʋ\r̕\x00̖\x00̗\x00̘\x00̙\x00̟\x00̠\x00\x00̮̕ʪÐʕ\x00ˋʛ-ʕ഍̖̗̘¬̙ʪÀʕ̕˼ʡŠ̖ಎ̚ʪÀʕ̕\x00̖̛ʰʕ̕\x00̖̜%ʰʕ̕\x00̖ºʒƜ̘୷̝ʸ೉̜̞:ˎʕ̕\x00̖\x00ʕȹ}̟5̠»ʒϛ,̟ʕ෱ȃ̡ؔ\x00\r		̟̠̠+̠ʒ๰̠՛	@\x00	\x00	U̗\x00	Y̘\x00̘Ħ̙H	̢\x00ઝ̣\r\x00	\x00\n̖௑	ʰʕ̕\x00̖̏	ʒࠈ	ʰʕ̕\x00̖̏	ūø	ʒ߇	ʰʕ̕\x00̖܅̔	ơʒ஄ʒڍ	ʒࣰ	ʒ૳	ʰʕ̕\x00̖ǮʒҢ		Eʒ׷	Ƈø	ʒප	ʰʕ̕\x00̖Ǯʒಶ	 	Ŷོʈ	Ô	ʰʕ̕\x00̖̏	ʒԜ	ʰʕ̕\x00̖Ǯʈ	Ô	ʰʕ̕\x00̖ഢ	ʒള	ųÙ	ʰʕ̕\x00̖º	ʒΘ	ʒϔ	ʰʕ̕\x00̖ཎʈ	Ô	ʰʕ̕\x00̖ป	!ʒટʉ	̢ʟì̖ϭ̖÷\nʪʕ̕\x00\x00̖\n	\n\nŕ̡ʒa\n̤%\x00\x00	̖\x00ʰʕ̕\x00̖ߟ	ʰʕ̕\x00̖ц	 	ʒƜ̢ʟ૦	ʒ΄̖ੱ	?̡ʒaʪʕ̕\x00\x00̖Ê̥%\x00ʪ\\ʕ̕ँ̖\nʒઐˎʕ̕\x00̖\n̖̕ʕ௚ʪʕ̕\x00̖\x00\n̖F̭̦%\x00ʪ\\ʕ̕ஷ̖\nʒǓ̢ʞ໬ʪʕ̕\x00̖\x00\n̖ʒa̘̘ ʪ\\ʕશ̭̧%\x00\x00	̖\x00ʰʕ̕\x00̖ǮʊÔʰʕ̕\x00̖՗̖÷	ʪʕ̕\x00\x00̖F	̨\r\x00	\x00\n̖\x00\nق	ʰʕ̕\x00̖ц	 	ʒƜ̢ʠঢ়	ʒ෌\nࠆ	ʒ΄̖ൊ	ʒӘ\n࡫	ʒ̛\n@̧3̡ʒaʪʕ̕\x00\x00̖Ê̩%̙7ʒ́ʒˎʟʒŒŶøʒ́!ʒ͝!ʒಿ!ʒ౔̪̖ܻ̚਋̜3̥ڂ̜3̦ཹ̩೨̚˽ʕඖ̜3̡ʒଡ̡ʒ-ʕ໠̨ʕэ̫%̖×̛|ʈḍʕ೰ʒఊ̕ʕ_̖ࣚʒཏ̜̜̡ʒଦ̡ʒ.ʕț̬%\x00̧|̙ʒݪ̡ž̒V݋̡\x00F̡ž	%̮ମ̮Ϝ̤\x00̮ж̫\x00̮˒̪\x00̮ؼ\x00̮ޭ	\x00̮ȴ\n\x00̮ৌ\x00̮ݣ\x00̮ԫ\r\x00̮ಜ\x00̮ࢢ\x00̮அ\x00̮ܷ\x00̮ٛ\x00̮ज\x00̮ऒ\x00̮ൂ\x00̮Ƶ\x00̮ղ\x00̮ͨ\x00̮ѳ\x00̮ɰ\x00̮࢘\x00̮ވ\x00̮୳\x00̮޹PʒǢ,̔ơʒÜ̮̬GʒƭEʒ฼̮̣୚%̜̛h²̜̛h²̜3̡ʒۇ̡ʒ̡߫ʒOʞޙ	%̜̛|!ŽÙ̜3̡ʒ௷̡ʒ-ʖȡ\n%̜̛hʊ̜3̡ʒٹ̜3̡ʒಅ̡ʒ-ʕ҉%̜̛h²̜3̡ʒࡶ̜3̛˽ŽÂ̜̡ʒ૟̡ʒֱ̡Ƅʖڎ%̜̛h඲̜3̡ʒܬ̜3̡ʒʕ༳̡ʒ̱ʗࣖ\r%7̞໼̘̝ʒΆ̥ȩ̜̛h໭̜3̡ʒ๵̜3̡ʒੋ̡ʒ̱ʗํ%7̞ʛਆ̝ʒ˂̥ȩ̜̛h৤̜̛h²̜3̡ʒ຾̡ʒ਻̜3̡ʒޕ̡ʒ-ʗ௔%̜̛h²̜̛h²̜3̡ʒઓ̡ʒ௮̜3̡ʒ؎̡ʒԷʕૠ%̜̛h²̜3̡ʒ̜ࠞ̛h²̜3̡ʒ୓̜̛h²̜3̡ʒʛࡐ̡ʒൺ̡ʒໍ̡ʒ-ʗ༄̖ǋ̛˽ʒԜʈ̕ʕ_̖ਮ̜3̡ŷߜ̛੤ʒܠ̜3̡ʒ̡֚ʒ௰ʕ˭%̜̛h²̜3̡ʒ೽̡ʒ૒%\x00̖\x00̜̕ʕ_̖ĭ̖̕ʕ̢̖ǋʒϟ̖սʒԧ̕ʕ_̖±ʒҩ̖щ̡ʒീ̕ʖŤ\x00̖ʷʒ̡҃ʒʋ̕ʖŤ\x00̖8̕ʕ_̖i̢ʘ˅%̜̛h²̜3̡ʒ཈̜3̡ʒ఺̡ʒ-ʖచ̜3̡ʒOʙπ̜3̡ʒǅʕƱ̜3̡ʒɔʕĜ̜3̡ʒǔʕɵ̜3̡ʒŬʕƇ̜3̡ʒɼʖ॔̜3̡ʒӤʕˠ̜3̡Ŷʕɿ̜3̡ʒɲʕϪ̜3̡Ɔʕ֏̭%\x00ʰʕ̕\x00̖ĭʒګʒଡ଼EʒୟCʒʭʆߦʒƜ્̘ʰʕ̕ɳ̖̗̖\x00̮V?|Cʒี̡ž̧޶?̡û̢ʜఌʏҫ̮5	̭Ê̢\x00̭f\n\x00̭µH̭\n̙˜%\x00̖\x00̕ʕ_̖ĭ̖̕ʕ̢̖ǋʒϟ̖սʒԧ̕ʕ_̖±ʒҩ̖щ̡ʒà̕ʖŤ\x00̖ʷʒ̡҃ʒ˪̕ʖŤ\x00̖8̕ʕ_̖i̢ʘࠃ⠋0ʌ\x00\x00̕\r̖\x00̗\x00̘\x00̙\x00̀\x00́\x00͂\x00̓\x00̈́\x00ͅ\x00͆\x00͇\x00͈\x00͓\x00͔\x00͕\x00͖\x00	̖ʋ\n̗ż̘ż̙ż̗̜๖̚:̗@̛̙b̙̖˚̜̘̗\x00̙9̗̙\x00̙෉̗̖3̗̝\x00\x00	\x00\n̖Ê\x00\x00	\x00\n̞\x00̝\x00U̟ɦ	̗L̞\x00ʜɐ@ǌʕĜ̠'̚d̜B̞̗\x00ʙӦ̗@ǌ̗ʘ˙ǌʄÄʕĜ̡'̢d̜B̞̗\x00ʙӦ̗@ǌ̗ʘ˙̢:̗@ॸ̗!̣ݟ̕D̗Y ̗@झ̗@Ɔ˚̤ʕʖű̗@ʒϱ̜ෲ̣õ̟̖̥\x00ʕ\n̠ʒƩ͎\x00͆{̖f̠ʒtʕʕĜ̦\rན̗@ԍ̢ʖѐ̩ɤ̢ʖ݅ʕ̗k̜ѡ̛̻@ʒɶ̪/̫ض̲ൕ̜ʕʖؚʕ̗\n̜̬๷̜ʕʞ̞̤ङʕʞȂ̜̦\n̠ʒ̞̥\x00ʝ஘̤ࢆ̜̥\x00ʝĳ̦ܦʕʛࡎ̜͏̭\n͐ࠟʕʗĪ̜̗@!ƄÂ̜ʕʖȏ̿Ȝ̯ഈ̰ਐ̜̱औ̜̗@ʒਰʕʘལ̜̣̔õʕʘ൚ʕʝȟ͎\x00͆{̤઒̜̥\x00ʚໟ͏̳\n͐ນ̜ʕʟʂ͎\x00͆{̤ඛ̜3̴஡̗\x00ʕk̜̸\x00\n̤٬̜̥\x00ʠð͏͖¬̦\n͐ݽ̨ਇ̛@!ʒƃ@!ŷÂ̗@µ̫®̧̫݀̧̜ʕʠे̗Yʕ੪̗@ƄÂ̜ʕʖො̗@!ʒ೐̗@!ʒ֭ʕ̗\n̜ʢ͎\x00͆{̤̨\rʕʚ´̜h̗@ʊ̜ʕʖĳ̢Ŕ̜ʕՆ̿ʃ̡ʖũʕʖÞ͎\x00͆\n̤˶̜ʕʕŏ̗@;ƆÙ̗@!ʒʴ̜ʕʕˑ̗@!ƆĢ̿\n̢Ŕ̜ʕʖþ̿ʉ̠Ɔrʕʕđ̢ʖȿ̜ʕʖÞ͎\x00͆ă̤٧̗\x00̜ʕk̸\x00\n̤Զ̜ʕʗĪ̗@ƄÂ̜ʕʖȏ̿Ȝ̯൶̜ʕʘມ̗@ڊ̗\x00̜ʕk̸\x00\n̤Զ̜ʕʗĪ̗@ƄÂ̜ʕʖȏ̿Ȝ̯Ƒ͎\x00͆\n̤̩ࠢ\r̛|!ʒգ̜ʕʖϻ̜ʕʕΌ̡ʘ෋ʕʘ౬ʕʟ߅̜h̗@ࢭʕ̗\n̜̤ܜ̜ʕʖĳ̢Ŕ̜ʕՆ̿ʃ̡ʖũʕʖÞ͎\x00͆\n̤˶̜ʕʕŏ̗@;ƆÙ̗@!ʒʴ̜ʕʕˑ̗@!ƆĢ̿\n̢Ŕ̜ʕʖþ̿ʉ̠Ɔrʕʕđ̢ʖȿ̜ʕʖÞ͎\x00͆ă̤ि̚ࠇ̿౩̚ʒ಍ʕ̗\n̜h̗@ʊʕʖĳ̜̢Ŕ̜ʕʖþ̿ʃ̡ʖũʕʖÞ͎\x00͆\n̤˶̜ʕʕŏ̗@;ƆÙ̗@!ʒʴ̜ʕʕˑ̗@!ƆĢ̿\n̢Ŕ̜ʕʖþ̿ʉ̠Ɔrʕʕđ̢ʖȿ̜ʕʖÞ͎\x00͆ă̤̡߳ʖũʕʖÞ͎\x00͆\n̤̪ࠫ̿Ȝ̠ʒʕʕ̦̫͎\x00͆{̤̬ɦ̣õ̗@ݢʕࡼ̿ા̤̭\r̢ʘ഑ʕ̗k̜ʢ̠ʒ֧̗@ʒࣄʕʕ௥̚ʒݡ̗@\x00̗إӕʒ݉!ʒǀ̗@µʕʕ´͎\x00഼͆̗\x00ʕʕƙk̜̸\x00েʕʕ´͎\x00͆ࡏ̗@ʒހ̢ऐʕħ̗k̜͎\x00͆{̖f̠ʒtʕʕƮ̦্̠ʒոʕʖű̗@ʒϱ͎\x00͆Ջ̠ʒոʕʖű̗@ʒಇ͎\x00͆Ջ̖f̠ʒtʕʕƮ̦̮\r̠ʒƩʕʕ´Č̗@ʒಃ	̠̐ʒƠʕʕࡉ̗@ʒŲ̜ʕȰ̿૊̷ע̠ʒtʕʕĜ̯\x00͑̚՝̿й̮\n͑̲\n͒͒̰\x00ʕʡ̜ͫ	̿й9͏̚՝̿ค̗@ʒְ̜ʕʟ؜͎\x00͆ă͑̠ʒĠʕʕŏ̗@ƆÙ̢ʢԇ̜ʕʡ೼̢ʖӭ̜ʕʟະ̗@ƄÂ̜ʕʖ̢ࣾۺ̢ଋ̛̻@ʒࢠʕ̗k̜̗ࣽ@ੀ̢ʖӭʕ̗k̜ʕ̗®ʕ̗\n̜বʕʕt̜͎\x00͆{̠Ŷrʕʕ༖ʅ̗uʕ̗\ň̜̟̗ߙ̯i̠Ɔrʕʕđ	͐Ł͒̱̥\x00ʟέ̦\n̚ʒೣʕʜʣ̜̦Ȉ̲͏̠ʒĠʕʕŏ̗@Ɔ̺̚͸̟Ł̦ʕʕđ̜͐̳̠ʒĠʕʕŏ̗@Ɔ̺̚͸̟Ł̚ʒҪʕʜ˛̜͎\x00͆{̠ʒʕʕҀ̚ʒฎʕʘſ̜̠ʒʕʕҀ̦ʕʕđ̜̴ʕ຿̲\n̚ʒࠏʕʘɥ̜̚ʒ຃̠ʒƩʕʕ´̿۸̠ʒtʕʕଷ̲ă̚ʒోʕʛğ̜̲Ȉ̵͗\x00͘з%̛@!ʒජ͗ʕ̗ʕ̜̜̷͗\x00͘®@!ʒൡ͗ʕ̗ʕ̿͗\x00͘\n̜͗ʕʕì͎͗\x00͆฽͗ʕ̗ʕ̿͗\x00͘জ̗@ऻ͗ʕ̗\n̜̿͗\x00͘ࣁບ͗ʕ̗\n̜̠ʒ͗ʕʕ̷͗\x00͘Ԅ͗ʕʕt̜͎͗\x00͆{̠Ŷr͗ʕʕ¨̠ʒ͗ʕʕ̷͗\x00͘Ƒʅ̗ർ̗@ʒܓ͗ʕʕ̜ߤ̶\x00།̗@!ʒґʕʕ̜|̗@!ŶĢ̷\x00̷\x00з	\r\x00	ʖƏʘǗ		ʕ)	ő!	໥̗@ԍ	̗uʕ̗\ň̜̿\x00Ԅ̜ʕʕt̶\x00\n̠Ŷrʕʕۣ̜ʕʕğ̵\x00\n̠Ɔrʕʕܗʕ̗\n̜̿\x00Ƒʅ̗ʕ̗\n̜ඒ̚ʒԚ̜ʕʕì͎\x00͆ࣆ̸\x00ఖ̷\x00N̗@ʒౣʕʕ̜ඣ̹\r̜ʕʕ´Č̗@ʒ໏@ࡌ̠ʒਬ̗@ʒࠊʕʕ؛̗@ʒŲ̜ʕర͎\x00͆ٻʕʕƮ̜̺\r\x00	Č̗@ʒࢃ	̠̐ʒƠʕʕк̚ʒભʕ̗\n̜ື̚ʒ໰	ʕZ͎\x00͆ƒ͌\x00	̻\r\x00	\x00\n\x00̠ʒĠʕʕğČ̗@Ɔ੎9	̠ʒƠ		@;ƆõʕʕૡЉ̗@ƆĢ\n̗@\x00̗\x00	̛̢ʖΥ	@నʕk̜ঊ\nӹ	@ʒΘ	@Ɔޅʕʕ̿ǃ\nӹ	@ʒƭ	@ʒؘԣߠ̜ʕk̾\n̯ǃ\nଂ	@ʒġʕʕ̿\n̜ʕʕì͎\x00͆ǃ\nʒϷ̜ʕȰ͎\x00͆ǃ\nƄÙ̜ʕʖĳ̗@ʒǀ̜ʕʕt͎\x00͆{̠Ŷrʕʕ̵̾\n̯ܺ\nʒǀ̜ʕʕt͎\x00͆{̠Ŷrʕʕ̵̾̗@ʒū̯̠ʒʕʕ͎\x00͆ขʕʕđ̜̼\r̜ʕʕtČ̗@ŶÙ	̠̐ʒƠʕʕк̗@ŶĢ̗@ʒŲ̜ʕȰ͎\x00͆®̗@ʒো͎\x00̜͆̓ʕʕɿ̽ʕ̗k̜౎͎\x00͆{̗@Ɔõ̠Ɔʢ̗̖µʕʕ߉̗N̗@ʒ๘̜̠̌ʒদ̾̗@ʒŒ̗@ʟʅ̗ʕ̗/̟̜̿\x00\r	\x00\nÃ̚཮̗@;ʒރ̝ʠग	̗7	!ʞ͈ʕ	\n̜3	}\n͇	ט\nzȅ\n1ȅ	\n͇	\nQ	ຒ͕e	\n͖e	\n͖W	\n\x00ʕ\n\n̜3\n}̀ʒ̝́ʒǘ͂ʒô̓ʒԉ̈́ʒÑͅʒƝ͆͇q͈ۆ͉\x00\r	\x00\n\x00\x00\x00\r	Ħ\n͖`Pʕ),	ʷLzȅ9͕ezЈ\nWzzȄ9\rg.\rzȅ9͕e\rz\rЈ\nW\rz\rʕ́\rʕࢗ	ັ	óʕ),͊Ś͊\r\x00	7zȅ@͔ezՕzȄgP		ʕ)	,͊	౉͋ʸ@d¬`͌\x00\r	ʕࡂ	1ȄʕŨʕc\x00ʕ\nʕ	Ȉ͍\x00\x00	\r\n\n1ȄʕŨʕc\x00ʕ\nʕ\n\n\n¬\n@	\x00͈ʕ\n͎\x00\x00	\x00\n\r\x00\x00\r\x00\x00\x00\x00ʕ̗߰@׼\r̛|̗!ʖݬ\r@!ʒณ\r@ư\r@!ʒŒ\r@!ʒִʕħ̗k̜͎\x00\x00	\x00\nɤ̗!ʘ࣏\r@!ʒ͝\r@ư\r@!ʒʱʕħ̗k̜͎\x00\x00	\x00\nˡ̿ຖʕ̗\n̜௳͈ʕZ̻N̗@!ʒǩ͈ʕó͈ʕ),͈@!̍ @!̌	ൃ͈ʕZ̼N̗@!ʒǩ͈ʕó͈ʕ),͈@!̍ @!̌	ষ̜ʕʕ´ʕZ̺\n̠ʒtʕʕਖ਼̜ʕʗĪ̗@!ƄÂ̜ʕʖȏ̯୦̰஌̜|̗@ʒգ̜̡ʕĀʕʢ௬ʕʛtʕZ͎\x00̀ƒ͌\x00\n̗@ʒū̹Q͍\x00\x00̏ઇʕħ̗k̜͈ʕZ͎\x00͂༤͈ʕó͈ʕ),͈@!̍ @!̌	ٶʕħ̗k̜͎\x00͂క̽൛ʕ̗k̜͎\x00͆ۂʅ̗̗@µ̿ଆČα̗@ೇ̜͌\x00\nʕʕt͎\x00͆{̠Ŷrʕʕ¨͍\x00\x00̌ࣳʕ̗\n̜̗@ưʅ̗ʕ̗\n̜͍\x00\x00̍®̗@!ʒǀ̜͌\x00\nʕʕt͎\x00͆{̠Ŷrʕʕ¨͍\x00\x00̌ඦ̗\x00̜͌\x00\nʕ\n̗@ưʅ̗ʕ̗/̟̜͍\x00\x00̍ணǴ`͌\x00\nʕŪ	ʷLzȅzʕདྷ͋͖Q̹\n͍\x00\x00̎ۙǴ`ʕ̗\n̜ৎǴ`̽ƑཌྷČα̗@඙̗YׅǴ`ʕŪ	ʷLʕ̗\n̜ಖG̓`̗ʚഫʕħ̗ۨʕ̗\n̜͎\x00̓ٿG̓ \n`ʕʝЂ̜͎\x00̓୑G̓`͑͉\x00\nʕඩ̜̗@ʒϔ̲/͎\x00͆ƒ͒ൽG̈́`̜ʕʕ͎̄\x00͆ƒ̠ʒʕʕ͎\x00͆ົʕ੕̜͎\x00͆دCͅ`ʕŪ	ƿʕ̗\n̜ʕZ͎\x00ͅƒ͌\x00\n͍\x00\x00̐Ƒఀ	̗@ʒґʕʕ̜͎\x00͆ࡵ͏͓ʕ͖\n͖1Ȇ͖͐͖͓ʕ੫͑͓ʕ͕\n͓ʕ͖\n͕1Ȇ͕\n͖͕͒͖͓ʕ͕ͤ͓ʕਭ͓5͔1Ȇ͕͔\x00͖͔\x00	Ζ@͎	\x00͆ذܱ̦̚	༺©͔\x00	\x00¼͇\x00½͈ѽʍ%̕\x00̖̕5̖໇p\x00ɪӂ̖ী̕̖]ࣈ̕̖\"~ʎ̕\x00̖\r̗̗̕౻Z\x00·̘\x00\x00m	\x00Â\nɪ̘̟̖̕ۉ̖%\x00̘|ଐ̕վ̖\x00\n̖#H	%ú|?ऽʺ܄\n\r\x00	̕\x00̗Ǜ̖¢	̖̗	,	̘3~ŕ\x00̕\x00̖\x00̗\x00̘\x00̙\x00̚\r\x00̛\x00̜1˕ฏ	\n̚ಽ\x00̜̛Â\x00\n¿	\r\x00	\x00̞\x00̟\x00\n	q܁	°೸པ	°෶̛ʎ\x00\n̞̛·\x00̟̛\x00\n̟\x00	¨̕\x00	¿̗\x00	É̖\x00	²̛m౏̛mr	³̞	¤̞	/̠3	̠%\x00\x00	\x00\n\x00q,̞]̞M̟	̞\n1ʐ	ऀ	,\nՀ̠B	̞1ʐ	Ǉ	,̠B=\n\x00 H~̝\x00'਑Ӎངρถ.͗ࡾ.A۝ो.A<༸೤.A<f࡚ڛ.A<fWֆય.A<fWàୠඎ.A<fWàƀ̕\n\r\x00̞\x00̟\x00	\x00\n\x00̠\x00\x00\x00\r\x00̡\x00\x00/\x00̞¨\x00̟É\x00	¿\x00\n²\x00̠ʍͅ	ë,̢	ԝ\rঐ	ˋ஛\r\nվ\r̡ؓ1ʐ,\n̡Æʻ\x00̡³ʻ\x00̡¤̚\x00\n\n5مۯঝļ̡\x00̡ۗ=Pѝë,̡̤M̜M\n̥yMǛ¿\rPë,̢Ś̢ť\nಈ̣఑̣\r\x00	\x00\n̆		ë	,\n̟	\n\n๦	ઢ\n༐	౦\n׉	ຠȇ̤̧\x00̨:%\x00\x00	\x00\n\x00\x007̧]ˇ̠p̠p¾̨Aǫ̌໣51ʐ̧,\n¾̨֫ǫ̌ޣԝ	̧=P\nѝ\n	ë\n,\n̤	\niઅļ\x00ఽ̧ࠛM༻̧M̜̧MQ̥̧y̧MǛ\nWà̧]9̠\n̠͟஠~̥\x00\x00	\x00\n\ŗ\x00\x00̨\x00̩\x00\x00̪\x00\r\x00̫\x00̬\x00̭\x00̮\x00̯\x00̰\x00̱\x00̫M\x00̬\n<̭\nf̮\n.̯\nA̰̠p̱»̧̧	̧S̫̧Vଃࣣ࠸ཞ̰̱̨̩༥/঑̰̱\"̮̫(̧ǯ൬̩̫(̧̰̱\"̤ ̩\nѻ̰̱̨̩͑/ଝු̰̱̰̱Ӄ\x00̰̱\"/ϸ̩̫(̧̨̬/ස̰̱̰̱স\x00̰̱\"̱÷̱\x00̨̨̩̰̱\"̨̰ɷࡕ඄̫̧մ̩̘̫(̧č̫̧̩\x00̰̱̰̱\"̩࢕̱÷̱\x00̨̩Ṵɷٰ̰̱̨̩̩̫(̧̨̚/ச̰̱̰̱˄\x00̰̱\"/୺̦\x00̫(̧̫(̧\r̫(̧̫(̧̧՛̬\x00\n\n\nԺ̧	̧#\r/͖̩̫(̧̨̡̱Ȓ̱\x00̨̨̩̨̰̰ɑஈಧථ\nڗ̧	/ཷ̫̧͔̩̫(̧̟̩̫̧\x00̰̱\"/ڬ̰̱̰̱¤\x00̰̱\"̨̨̩̨̔يࡩ̰̱ਅਹ̩̫(̧̨̮/ษ̰̱ೝ̱Ȓ̱\x00̨̩Ṵ̰ɑउ༆̪̫(̧̰̱\"̭̪T̫(̧Ӿਡ\r̫(̧̰ǚ̱J\r\x00̱\ṉ¦\r\x00̰̱\"̝̨̩®࡝̰̱\r̫(̧̧͠#\r̰̱̨̰̱̰̱\"̨༫̩̫(̧̰̱9̧#̩ɳ̱؍ژ̰̱\"̬̫(̧ǯར̩̫(̧̰̱Ĥ9̧#̩ɳ̱ڠ̱Ȓ̱\x00̨̨̩̰̱\"̨̰̰ɑצಣએ̰̱\"̚̫(̧ǯࣤ̰̱̨̰̱ƣ̨̞̫(̧ҭ/ූ̰̱\n๫\nї\x00̧	̰̱̨̰̱ƣ̨̘̫(̧ҭ/฿ൌ̨̩຤ซ̰̱\"̡̫(̧ǯඈ̰̱\"̫(̧ҵ̰̱̰̱࠮/ె஋̰̱૸ब̱÷̱\x00̰̱\"̨̩Ṵɷุ̱÷̱\x00̨̨̩̨̰ک̰̱̰̱Đ\x00̰̱\"/อ̰̱̰̱ʘ\x00̰̱\"/ࡡʗ̰̱̰̱\"/Դ̫̧Ƿ̩̘̫(̧č̫̧̩\x00̨̰̱Ʀ̰̱\"̨̩өઘ่̫̧͔̩̫(̧̞̩̫̧\x00̰̱\"/ς̫̧Ƿ̩̞̫(̧č̫̧̩\x00̨̰̱Ӷ̪̫(̧̩̫(̧̨̭̪Ʀ̰̱̰̱Ӂ\x00̰̱\"/ד೪̰̱̰̱ඳ\x00̰̱\"/ߣ̰̱̰̱ơ\x00̰̱\"/೑\r̫(̧̧¦\r̰̱̰̱Ґ\x00̰̱\"/൧ভ̪̫(̧̰̱\"̯̪T̫(̧Ӿ̱߮Ǖ̱\x00̨̨̩̨̰̰x̰ɗೡ̱Ȓ̱\x00̰̱\"̨̩Ṵ̰݃\r̫(̧̧#\r/஦̩̰̱̨̰̱ہ̨̨̩̰̱\"̨̔ி̰̱ஶ̰̱̨̰̱ƣ̨*ȸ੨ࡊ஥̩̫(̧̰̱Ĥ	̧#̩ࠀڴ̨̩ө̰࣬̱ࢡ̨̩ҵ̱Ǻ̱\x00̨̨̩̰̱\"̨̰̰x̰Ḛ̇ࣕ؇ૄ̱Ǖ̱\x00̨̨̩̰̱\"̨̰̰x̰લٴ̰̱̰̱Ӆ\x00̰̱\"ཥ̰̱ࠍ̩̫(̧̰̱̰̱\"̩๏௖ཋ̨̩ไ๗̩̫(̧̩੮̩̫(̧̰̱̩Ʀ̰̱̰̱Đ/಄̫(̧ƈ཯̰̱̰̱Ϻ\x00̰̱\"/੊̱Ǻ̱\x00̨̨̩̨̰̰x̰Ḛ̇̧̰̱̰̱џ\x00̰̱\"Ԧࣀ٠౾̱Ǖ̱\x00̰̱\"̨̩Ṵ̰x̰ɗణ़̨̩ƈܝ̰̱\"̨̩ޠ̰̱̰̱һ\x00̰̱\"तഅ\r̫(̧̱¦\r\x00̰ǚ̱\x00̱\r\n̨̩ࠒ̨\x00®Ӟ̩̫(̧̨̰̱੐̰̱̨̩ૣ̰̱̰̱ੴ\x00̰̱\"໙ৼ̰̱ೞ̨̩ԡߓ̰̱̰̱৯\x00̰̱\"ֶ\r̫(̧̰̱̧ক̪£̨̩̪\x00̥\x00̧\x00̧\r\x00\nN\ņ͈	̧ؑ#\rନ̰̱໮׋̱ӿ̱\x00̨̩Ṵ̰x̰Ḛ̇ʾ̰ੜݎ̰̱̨̩\x00̰̱\"/׎̰̱̰̱೟\x00̰̱\"̰̱̩̫(̧̨̙̩\r̨\r!ʷ	\r̫(ྀ̧̧\x00̧#\rԦঀಹ܃̰̱̨̩ǣ/઼̰̱̰̱ༀ\x00̰̱\"/ؕ̰̱̰̱ฤ\x00̰̱\"/ٌ̨̩ԡौය̱Ǖ̱\x00̨̩Ṵ̰x̰ɗ඀̩̫(̧̰̱\"̩࢈̱Ǻ̱\x00̨̩Ṵ̰x̰Ḛ̇̧̰̱̰̱ࠗڸࡷ\r̫(̧̰ǚ̱J\r\x00̱\ṉ¦\r\x00̝̨̩®ൢ̱Ǻ̱\x00̰̱\"̨̩Ṵ̰x̰Ḛ̇ࠑ҂̪̫(̧̩̫(̧̨̯̪Ʀ̫̧մ̩̞̫(̧č̫̧̩\x00̰̱̰̱\"̩ђ୍̱\x00̨̰\x00̩̱ग़৆̰̱̰̱ľ\x00̰̱\"̱ӿ̱\x00̰̱\"̨̩Ṵ̰x̰Ḛ̇ʾ̰ࠦ૞̰̱̨̩ຣ/ູ̰̱̰̱ӄ\x00̰̱\"ു̰̱̰̱\"i̠̰¿%̫(̧ޫϸ̩̫(̧̨̬/ୢ̩̫(̧̨̚/͖̩̫(̧̨̡̩̫(̧̨̮/ഓԴ̫̧Ƿ̩̘̫(̧č̫̧̩\x00̨̰̱ς̫̧Ƿ̩̞̫(̧č̫̧̩\x00̨̰̱Ӷ̪̫(̧̩̫(̧̨̭̪Ʀ̩̰̱̨̰̱Ӟ̩̫(̧̨̰̱҂̪̫(̧̩̫(̧̨̯ׁ̪̱\x00̨̰\x00̩̱̦\x00\x00	\x00\n\x00\x00\x00\r\x00\r\x00\n¦	\x00	¦ɝ̥\x00\x00#\x00·\r\x00̥\x00\x00	\x00ఇàW༓#	\x00̥\x00\x00\n\x00\n෸๐\x00їೈŖӗjÅÅRʒ֩ʒݯʒ୲ʒກʒ૩lʒॺʒෑʒ৭ʒཙ	\r\x00	ŌʕŅƽ˨ʕ)ͱ^ʕƔ	ú^Åi#ʕ̽	ʕǭʒχƚ	ʕՓʒה%\x00\x00	\x00\n\x00\x00\x00\r	ú^\x00\núo\x00ʕǘ	ʕʒി	ʕƓʒ̬ʒ$ʒɆ,	ʕ࣢	џʒχƚ	ʕՓʒృ	ƚ	\n	ʕˊʕଊiMʒܴʒ۩	ʕିiMʒ௱	\n\nʕZ1ʐMʒഀŽ\r\nä\rRʒ¸ʒ<\rRʒ©ʒ<\rRʒʒ<\"\r$ʒκ	\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00ʕƬúo\x00ʕŦ\n.A<\rf͚Eʒ਄,Gʒ϶JʒӋJʒสJʒևJʒডǑฑRʒࢩ+\noʒ֥\nRʒיEʒ༨+$࡯$\r/Eʒත\rEʒ୔+$ր$\rր$\r/Eʒਂ\rL	+ޑlˊUʒഐ\r\x00\r\x00+oʒݞRʒ¨\n\x00\n	ۖ\nǤਝɉǤవ୿ǤڱЭ\rǤీ๔఍ŗ̕\r̖\x00̗\x00̘\x00̙\x00̚\x00̛\x00̜\x00়̖̕ʖࢻ̗̕ʕ՘̘̕ʕ५̙̕ʟП̚̕ʘೋ̛̕ʖ෼̕ʡՠ̕ʞౙ̕ʠլ^̜િʒଞ̕ʖ଺̕Ƀ̥ʘɍ̗\nʷ	̕ʕƢา	^Ə̕\x00ʞôi˱\n\nĆÇ ̜Ås༷\nʕʖË\x00\nʕʕҎ\r̝̨\x00̩\x00̪\x00̫\x00̬\x00\r̭\x00\x00	\x00\n\x00\x00̭ຼ̫̫Η̫ř̭sÃ̞̨\x00̩\ṋs§̟̨\x00̩\ṋs«̠̨\x00̩\ṋs¢̡̨\x00̩\ṋs̢̨\x00̩\ṇʕ̭\x00̨\x00̩̩͟ʷิD̛Ḓsnʷ ̭snໄ̫࡙̭Çʣऩʾ\r\x00ʒঌ̭s\x00	5\n̭sѷ£@ՏথҐʷ		ҳ	৴ʷσ	ߨ£	@	Ӂ\n9\n	߀ʷD̬ʷ ̬ߡ̭ʕŸ̨\x00༚̪ʕŞ̪\x00ϖ\r̝ʕ̭\x00̨\x00̩\x00̪\x00̫\x00̬̞\x00˷ʷ@̗̤̗\x00\x00ǖ̥\x00̗·	Ï̟\x00'͒̚ʷ@̚ʗ4\x00ǖ̚ʗé·	Ï̠\x00\r	7̙Ҋ	̦|ʷ@̙	T̡̙	T׬\nÏ̡\x00'̘͒ʷ@̘ʗ4\x00ǖ̘ʗé·	Ï̢\x00\r	Ãʪּ	̧ʖƀʕں	ʙׯ	ʕǬʟŋʞ੉ʷˇ	ʕ=\x00\n	ʛjਁ	ʗ༟F	ʕ4ཻ\nỊ̈̨\x00̩\r̪\x00\x00̪ஓ̛9µ̛ʕĥʖˢ\nʕ౞\n\x00ʠ׻\x00̩ʷ	ʗˮʗˮ\r୯	ˊ\nˊ\r\x00	ʕ˾ʖє	ʢҜʖ߲ʕຨ\r\x00	\x00\n\x00ʕ˾ʖєʘŴʘғʖҪ	ʙюʖӯʞ੗\n	ʙ¶ʖԋ\nʟ޳̨ವ̩ܭʗࡔ\r\r\x00	\x00\n\x00̫ʕ˾ʖཛʘŴʘғʖൎ̪snʷɨ	ʙюʖ࢓\n	ʙ¶ʖԋ̫\nʖƾ̨\n̫ʗˮ\nʗଓ̫ʖଘʷ	̪snʷ̪sn̫ʖตʟ༈̤\x00\x00	\r\n\x00\x00\x00\r	̕ʗʦ	Nʪ\\ʕ\x00ʕķʕ۫ʒǿʪ\\ʕ\x00ʕః\nʪ\\ʕ\x00ʕķʕì\nʒǓ\nʪ\\ʕ\x00ʕكʪ\\ʕ\x00ʕĩ\nފ\rˎʕy\n\nʒǓ\rˎʕ\x00Ѻ\n௠ʕķʕÁ	\rʕķʕÁ	HࢉʕķʕÁ	̥\x00\r	\x00\n\x00\x00ȃʕࢂ	ʕŹʪ«ʕ\x00ˋʚക\n\nʕ)\nS\nѓʪÀʕ߻ʪʕǰʕ૶ʪ\\ʕ\x00	۶̕ʢșʪʕ\x00	ʕZʕે̦ʪÐʕ̕ʕŝʗˈˋʢ຦̧\x00\x00	\r\nʷ̖ʕǶ\n̖ʕǶ/\n̖ʕć\n\nʕǬʗΪʕʋ\nʕǬʟҎʚ̼	\nʕරQ		̖ʕƞʕƼ\nǲ\n̗̤̗\x00ʘɍ̕ʕಏ̕ʕƢ̗\x00\x00	\x00\n̝ʕϯ\x00ʷ\x00\x00ʷ\x00	\x00\n\r\x00̝ʕϯ\x00\x00ʷŘУgʕཱřУzŚ\r֜dĆ[eࣩƋʙǉๅʗ໓[e༶úe௺`ࢷ৕[eຮ`}ফeܘś%\x00PϵWӫ}׃dശóϵeӫ[e੠߁ʕ)ͱĿȩľʶťʖζšʺʻš+ʪ౴ˍ ʪໆʪǼʻōš	ŠǜʪཧˏʞΒŗʻ8ʻʪģšʪҷʮĸB˽§šʪનʪӢˉध%̓ʒ๿ʒ੻ʒŢʒٕʒ೙ʒफʒ܂ʒ৖ʒຊʒऌʒ֊ʒܞʒຆʒߏʒวʒಆʒൾš	Š୵ʪϲˏʖӏšʻ ˃ʪȴˏʘЦš	Šʍš+ʱ¼ʯ2ʱ¡˛šʪҽʪØ˝ֵ͟ʪ*ʝ\x00ʻ\x00ʕ\x00ʷ\x00ˍ\x00ʜ\x00ˋ\x00ʠ\x00ʒ\x00Ĵ\x00ʘ\x00ʢ\x00ʗ\x00ʖ\x00ʚ\x00ʙ\x00ʣ\x00ʱ\x00ʟ\x00Ǘ\x00Ə\x00ǰ\x00Ǝ\x00ʞ\x00Ż\x00ʸ\x00Ǣ\x00ʛ\x00Ǩ\x00Ǚ\x00ǯ\x00ʡ\x00Ŝ\x00ʺ\x00˖\x00Ɖ\x00ʐ\x00ƿ\x00˕\x00ˊ\x00´\x00ˢ\x00ʾ\x00Ĩ\x00ô\x00ˣ\x00ĳ\x00Ƥ\x00Ǡ\x00Ö\x00ǭ\x00ʲ\x00Ǧ\x00ů\x00Ī\x00į\x00A\x00ī\x00ʵ\x00Ľ\x00Ó\x00Ƶ\x00ĩ\x00Ð\x00Ƿ\x00Ǭ\x00Ǹ\x00ː\x00Ï\x00\x00ħ\x00¬\x00˥\x00Ç\x00ǵ\x00ǖ\x00á\x00ǚ\x00º\x00ˆ\x00o\x00Æ\x00Ƙ\x00ª\x00ǀ\x00Î\x00Ƨ\x00Ǟ\x00Ǜ\x00ķ\x00ǫ\x00Ć\x00İ\x00ư\x00Ē\x00Ǫ\x00\x00x\x00ǐ\x009\x00Ĳ\x00ǂ\x00ƶ\x00Û\x00Ɣ\x00ď\x00<\x00\x00\r\x00ŀ\x00Ǐ\x00Ĭ\x00E\x00Ǒ\x00Ø\x00\x00ǣ\x00u\x00ǁ\x00G\x00Ƌ\x00¦\x00ň\x00d\x00ǩ\x00Ǆ\x00ǻ\x00J\x00h\x00û\x00M\x00\x00à\x00q\x00ē\x00\\\x00æ\x00ą\x00ę\x00\x006\x00\x00Ų\x003\x00e\x00Ã\x00Ŭ\x00z\x00÷\x00\x005\x00ű\x00¡\x00Ƅ\x00Ɔ\x00Ý\x00ŭ\x00B\x00ŷ\x00þ\x00ĵ\x00·\x00v\x00ı\x00Ļ\x00Ę\x00ƛ\x00l\x00@\x00Á\x00¨\x00ǘ\x00Į\x00ƹ\x00Ƽ\x00\x00Ŋ\x00Ʊ\x00Ň\x00ľ\x00ń\x00ņ\x00ǲ\x00ł\x00ŋ\x00Ǳ\x00ļ\x00ŉ\x00Ń\x00Ƴ\x00Ŀ\x00ĕ\x00î\x00å\x00^\x00\x00ĭ\x00O\x00\x00m\x00Ǔ\x00Ķ\x00Ğ\x00Ǖ\x00Ą\x00Ł\x00Ō\x00Ƒ\x00Â\x00É\x00\x00~\x00­\x00Ü\x00±\x00r\x00H\x00ć\x00#\x00_\x00\x00Ĉ\x00Ë\x00+\x00\x00\x00½\x00$\x00\x00Ê\x00p\x00F\x00ð\x00&\x00;\x00!\x00Ĕ\x00\x00\x00Ė\x00À\x007\x00\x00ě\x00\x00Ů\x00\x00ğ\x00\x00¹\x00I\x00\n\x00Đ\x00Ď\x00ū\x00n\x00'\x00?\x00³\x00)\x00Y\x00¯\x00ã\x00\x00]\x00Ñ\x00ĉ\x00\x00ġ\x00\x00\x00©\x00\x00\"\x00s\x00}\x00W\x00-\x00Ä\x00Ĥ\x00\x00a\x00Ā\x00Č\x00ö\x00 \x00¥\x00b\x00V\x00Õ\x00(\x00%\x00²\x00è\x00\x00Ò\x00¢\x00ì\x00ñ\x00¿\x00ÿ\x00ă\x00`\x00i\x00\x00C\x00k\x00=\x00\x00Ƃ\x00w\x00ú\x00®\x00ƃ\x00ä\x00£\x00Z\x00X\x00T\x00§\x00\x00č\x00ë\x00\x00Ì\x00Q\x00t\x00|\x00ó\x00ĝ\x00\x00\x00Ġ\x00Ă\x00ċ\x00ç\x00 \x00\x00K\x00\x00\x00g\x00đ\x00{\x00S\x00\x00ê\x000\x00Å\x004\x00¶\x00U\x00µ\x00¼\x00ò\x00Ù\x008\x00Ŷ\x00¾\x00Ž\x00N\x00Ƈ\x00ų\x00\x00¸\x00ė\x00é\x00ß\x00\x00.\x00>\x00í\x00P\x00R\x00Ģ\x002\x00D\x00ý\x00*\x00ï\x00\x00[\x00\x00\x00\x00\x00ƚ\x00y\x00˚\x00×\x001\x00	\x00:\x00â\x00Ņ\x00«\x00\x00ĥ\x00Ɯ\x00Ħ\x00Ú\x00\x00c\x00\x00j\x00/\x00Í\x00ø\x00Ĝ\x00Ě\x00\x00L\x00\x00,\x00»\x00°\x00\x00\x00Ô\x00õ\x00f\x00ü\x00Ɓ\x00ģ\x00¤\x00Ċ\x00\x00ā\x00ù\x00Èšːʽš+˜bʰʲʪèʪಊˊʕЦİš¹˒bʬ˓Ɗʪࡖ	ʪ˘ʸʕʕǳ	̂ʸʕʕǳ	ʪ࢟ʐʕʕ೚šʪૌ˄bʶ ʪΚ΁ࡦ΁຀š+ˈʿˋ ʳ¡˛	ʪԫˣˣʕ؉ʪϲťʖЙŜ๯šʺK˙	́˿ʕ˔ʕŘšʫDʪ࣭ˉ2ʶ8ʮʬš+ˋç˟ʪऊ˅΁੍ʻŒʾťʖȊš¹˟bʪʬˆƊˀʲʕɋ\r˨5˩5˪5˫5ˬ5˭ÛšYʶbʯ ˉʪǢʻŐš˟ ˙ʪɯˏʕశ˛ˊʕൖšʪ௜ʽʪԵʪèšʪ४˝ːʻʕɕʭťʖƅʪ঳ʪ৒ʒǸ	̀Þsʕ¶ʕƐʪ˒ʻʗ๾š	Š༒š˛ ˞ʪղʻʙΛʱ౼˸Ʌʻ	œʪӟťʖԕʫÛšː2Ŝʪ֠ʪப˹ÉšˏDˇDʪǉʪއŝťʖબ	ʪѳ˕ʕʕǳš¹ʭĔʪʇʪӑˠšYʫDˋˍ¡ʪ̤ʻɜ˄ʻʗૂšʽbʪਧʪƃ˚8ĹB̅ÉšʪՐˇDʹ ˌ8ʮʕ˩˚ʕŷʑʏಁʪ઄šYʪզʳKʪඓˋĺBš	Šǻʪ෠ʪ¾ʮš˅ ʯʻŎš˝ʪƽˍʻʖՁšʪʇʪೢ˕ސš+ʪ೫ʬKʹ¡˜šˊKʪϛš˔ ʮʪȴ˜š	Šŵ˙֮šʰʪʛš	Š௛š+ʪՐʭʬƊʲšʪզʪ຅ʪҷʪԥšʪਚˎDʪҽʪଢšˏbʪீʭ ʪඞʻŔšʪ߂˘Ĕʯ ˚8š	Šۦšʪ཭ʪࠧʳ2˙8ʲʻʕԆ˚ʕØʶʕįš¹˖ʴ ˎȽˋšˎ˕ʪ˘ʕ͋šʱ ʴˡʻʡӉʻ\rŏʪ¾ʕΰʶअˎʕßʪɯ˚š˛ ˀʯʻʢࢼšʪಫʪØŠ˥Š̠šʪ෪ʪࣔˇ ˞8	ȄʕʕďŘʸ๋̇É˒ˊʗݏš+ʹ˝KʲȽˏũȚʻőʪԵʕØšˑ ʭš¹ʪผˀ2ʸˑšYʳDʪ২ʺ˒ʴ୴š	Š༂ˊເšˇKˠʾː˻ʷš+ʮ¼˛KˈʪǼšʼbʪ༿˚KʪఋšʪĶˌťʖȝ̄ÉšʻĔʪ֐ʪදʴ8{̑ʚ-ʠɔʜʋʝҗʟēʛʯʠӺʛϗʛӪʚͺʚƲʛůʙȎʣǘʡŢʛ੷ʟ<ʝ<ʝʳʚʓʣʓʡҗʚǔʝδʚÑʞʚʙΎʞŦʠʯʣ৅ʝôʞ̼ʝWʠࡒʝƀʞɲʜAʠȁʞOʟÑʝӺʝཆʟàʝaʛɢʝĩʝàʠϞʟĮʣǔʢΎʣ<ʝȁʝŢʙȁʚfʚԞʜ҇ʚేš˄ʴšʪ໺ʮDŜKʮ8š¹ˎbʪ஫˓ʰʵ˒šʬ2˛̈Éš¹˕bʱŝʹʻݤšʪԖʪƽ˼Ûˆˊʖʮš˙ ʪӧ	˿sʕ¶ʕƐ˺É˟Ӽš+ʪމʭʪ๺ʼG̒໪ʒఅʒُʒરʒവʒࢥʒܫʒૅʒ۾ʒ༠ʒࢯʒଔʒলʒฉʒ้ʒ࠶ʒৄʒ૙ʒ๤ʒߛʒ໡ʒؾŬ୼ʒଜʒ૫ʒਥʒঠʒ੢ʒ൲ʒঘʒ׈ʒཫʒ೬ʒฐʒऄ˜Û	ʭʐʕʕʀš˃bʪ୐ʱʯ8š˔Kʪĕš	Š਷ʽ೶˖ťʖԕʪϜˏʖΤʪڙʪϕʕʛ˥ʻʕౄšŝʳDʪ̛˞8ŦȚšˏ2ʪȕˋʻʢ౸	˃ʻʖнʕɕ	ʪڀʒǘʒຫʒघ̆Éš˞2ʪǆš	Šņʪӟʻʗ౛šңˆDʪনʲƊ˓šʪำʪ෎ʪැˌ8šʪܟʪϳʪиʪèšʾ ʪ೔ʪԮˊʕͣ˦˖ʾʻʖՈʮʻʚϹ̔ড়ʒOʒOʒOʒOʒญʒ౲ʒڟʒWʒWʒWʒWʒWʒWʒWʒWʒWʒߋʒ[ʒ[ʒ[ʒ[ʒ[ʒ[ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒކʒѕʒ[ʒ[ʒ[ʒ[ʒ[ʒ[ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ-ʒ୏ˑˊʖ)	Ȇʕփ}Śˎˏʖɕʪെˍʕड़ʪÛš˝ ʸʪѹʕɋʪѹˏʕ౰ʰˏʕேʪ෢ˍʕཛྷš˞2ʸšˎЏʹʪਗ਼˟8ʪ݄ʪࡆš˄ЏˇD˘ ʪϤš	Šطʪжˏʕչʪшˍʕ܇š+ʪಡʵʻȽʪӢʪ৊ʒ³΁೦̌µ̍ʒa̎ʒ-̏ʒO̐ʒïš˛˙šʪ෣ʪĕŞʒȎʒदʒ৲ʒ֒ʴʵˌˏʕЄ\rŕ྄ʓ\x00ʒ\x00ʔ\x00ʿैʪš+˘¼ʪ̛ʾƊˊ˖ૐšˇ ʳʪɰ˙š˖ ˔šʻʪͰ	ˮʪ«ʕʜଠʪ˒ʕĶš	Šեŝˏʕ॓΁ûʺ੔šʲKˏš	Š٘̃ɇʪԮʻšʴ2ʶʳťʖˣʪ٣ˈۊʵ౿ʪனʷʪϕˏʕΤšʪʇʪè	ˠʱʕʕǳšʪ੧ʻ˰Ûšʲ ʾš˄˓¼˞K˟8šʪவŜ˞ฯ˅ʻʖଧʼʕŷˏʺʕ͉šңˎb˖˟ˋš+ʳʿʪ൮ʪޢ˔š+˕¼˘ ʪӑʪǼʪ˘ʕįʳťʖζˢʻʕ਼ˣʻʛӯˤˏʛӏŧȚʪ¾ˏʕ౤ʪɯˀǔʕװŖB΁׌šʲʪĲš	Šˉʪɰˊʘധšʮ2ʯš˕bʪലʪॷʪԥ˒ʬŠ̹΁෤	Ȇʕփśš˚2˅˷ÉŠсʪиˊʞՁšʪࣝˆŨȚšʵKʺˠťʖȝ˘ۭʳʮʏ಑ʐੰʪདʫš˄Ĕʪصʾ˃8ʰʕĶˉťʖਃŠƖʹܥʪޘš¹ʪМʪنʪ༙ʪĕ	ȅʕʕďř΁ਯšʪೀ˛ʪшʯʻǼš	Šഊš˙ ŝʪÆˏʕ௅ˀʕį˚ʻʛͣ0/12΁Ά34ͽ;Ϳ΀ #$%&'()*+,-.ͩͪͫͬͭͮͯͰͱͲͳʹ͵Ͷͷ͸͹ͺͻͼL\nǆ	®\n¯ĐĘ\rę^c͚ɜ͛ɤʈʛʝʟǒǓÛ͜Ƞ͝ƃ͞Ɔ͟ƍ͠ˍ͡ˑ͢˕ͣ˘ͤͥͦ-7~¥ĿĈĊ ˠ˔ϛʠǐɓsɆ6ɆůǱǮƣ«āțƗ­ȕƟƐűÖ¶Ʌ@jĎɆ ɆģɆ˅ŗǸɟʒƁȭƷŷÇƎ£ɭ˒ýȲıʦɲēźȑˇ˓7ɆǑȓɐĦÓøȳÐǽƱȄŜƧ~ˑ¡ʊŭɝɆ§<ʯɆĆÀï|ɶǾŶæRȞɆȸȢ.ȖČʊü÷QƌʐɔƽɣʊʶǢęěɆɂˎʊƔƜɆʫŚVŢôQʫ=ɆʟɆʮȠɪ·;ųÍKɆ=ŁƚĮǟɆʈˎʊɆƀÍˋºŉȬǰÃʽşʊƑǏʊƅɆÍÿȡȝŨɆōSɕ2ƸÜQ:ɆEöʅʊÑɆɬɆɛʊʆ¤Ȑ×Ɇʫ`˃÷ÍɍɈĸɔņĶɒʊʶþQƞwǴ5ŞîǶė¬ɆȋŬʺȨƇãoƼƹþQƞwƭTĭe»Qř=ǹɆǕ4ČQǪĀĊʊĐ˂ƝʘśąɆɧǤÂúŤƬˊˉĝƺʻŊiêǠdHǍĽŌŝưȏǦĚĵȱʀķ¾Ɩɑñ²8ʃɆĂɾƘʩDʗMȈʊɆÛQPƮeƯÍ¸ʑșʴ3ʛòʊěɉʊěɘʊȂĉɆǲʊɆŹlȾƉɆËQ¯=ßƵʊȥěɆØĠʊǖěɆŇʊǋˌʂʰĻʊǄđSſɆ]ȜɞɥɷɆ$ɺ\\#ǼʌěɆíȤɆâƆɆÞŐ±ɆńɆɽŕ1çĪkƿȷŘʊˆuʝɰQčOɆȿʕˁȗȼ=ǵ QďèƙbɆǝʞaʤŠɡǊȁŔǬƲJƍȉɆĤʱɢȣɼɇŧȔóĀ'ɊȎ!Ǩ)ɊǆŃʊɻȅŅŒĨɆťɆȦɆ´ÒɆ\"ÒɆʜÒɆyƩʳƶ°2ũƥQ,ɆəʊɆƨɆŖ¨ɿǜɆǅɆIɆɖʊɆǙ°ÍŪŎŰɆƳʔʣʵʊłħɗɌƂɆɜɆäʊġɸʸÍʉȹÎ*©^žÍ?ƦĞȌĲĴȩÍƋȌĲɆðĈQ\nˍƤxɆɆɆ9°ʊǚěɆĺɆǔɆɆLɆɆĩĈV¹Åɯ}ƤȊʟɆīǯʊɆǈhʍÍȪȯƚȪŻUǒļȧŀį=ZɆš-ʊ[ɆʈȻQºɆŵQĔ=ʈŸȃɁȮŮ=ȟǂ¼ʊľˀ\rŏùÔ˄zǞɴƾû&ƈȶƫǻżćqWǇ/YǗpɆɆɆĒĹ¥ɠȀˑ»QȚɆ¥Ɇ¢ɚƏƠăQƊ=Ƅʧ(ĘQɆ=Ɇʼ¿ƻɆĬɏÙƃ½ǿĕʿQɨȺǁʊÊŵeɫŦáʊʢĞCʢʚʊ>fƴǘċQĴǉQº=ƕɠĖǎQǘċºɆÄɹgˏƒǓĥ%Ɇɱ0ʎǥɆʏ³ªɆţʊȆŲʊƢníȵőɵºɆ\x00ʡõÏʊĴÚǌQȴǳĜ®ɮFɄǡʇʭ+ČQɳĴǀQv=µŴ_	BʊɆŻQʥ=ʋʬɋƪʓǷˈɆɆrÉǛÕGʪơňǩɆɆǧɆɆʨNɆǺʹɆɆĄȘʊɦɆɩÌʾŋʖŽSūSʾȰàȫĢğɎXěʲʊåǫʊœɆɀěɆːɆéctʷȽʊÆǃʊʁȇ¦eëÁÈʄʊǭǎʙĿɤÝ{ìİmˑȒQĳȪƛQA=ȍǣƓƪɃɆŽ0ͽʕËͩ\x00Ɛˍ\x00ʖ೒ͧ%\x00\x00	\x00\n\x00ͪͽʕ_ͩظEʒ௦Օ!ʒ໚ͪͽʕ_ͩ਍ʒௌ!ʒ௝ͪͽʕ_ͩĺ	ͪͽʕ_ͩ˴	MʒĒʒऑ!ʒ໵ͪͽʕ_ͩĺ	ͪͽʕ_ͩĺ\nͪͽʕ_ͩ˴	MʒĒ\nMʒǹʒĒʒં!ʒܸͪͽʕ_ͩĺ	ͪͽʕ_ͩĺ\nͪͽʕ_ͩĺͪͽʕ_ͩ˴	MʒĒ\nMʒǹʒĒMʒǹʒǹʒĒʒ౵ͨ\rͽʖΣͩ\x00\nͩ#H!%\x00\x00	\x00\n\x00\x00\x00\rͧ\r1ʐǇ,łʒߝ̸ͧପʒ-	$ʒĊ\nͧ	෥\rͬ\nƈ	ʒْͨ\n\nͬʕ\n\r/	ԁ\rͫ\nƈ	ʒÜ\rˁ\nƈ	ʒȢ\r˾ʕ˖\nʕ̮	ʒɺ\rͿ\n௟\r\"ɦ\x00ʕѴ΁̗̓˔$ͽʫ*͚ʛ#Ɵʫ*͝1	0࠷ͩͽʖง̄ʖŃȦ6΀1ʪԐʫ#΁áã%%ʒâ%ā#Sͽ#ǣ;%Ǡ1̉ͽ	1Ɣ&b\r1ʪ>ʕ΁òͩ\x00ʖࣼ\rͽ1°R\x000Îڦ5ʒ[!ʒ̨ʒOKLSС̅ʙͷȮ̈ʖƍɬʻʖ̩ͽU#\x00$ͽʕ=;\x00ʪpͿёͽʕගɘ;ʜ#ŷ#̇ʗȞɩ&Ǳ΀̆ʞ̯ɀ1ʗ#ʕȅ1+$ʖďʞ๸#Äʞa%Ç6&ʪI¸ˁȅ	%HͽʕՑ$Άࠕͽ1ͽʕǪ	Άåͩ\x00*.*Ò#ǘʒඌʪIªˁЪʪIˁģ̆ʚɒɂ̆ʛʏɄͩʕ=ʕǷ'AÄ'E1	0ఏ(lʒ๴1˅KʪƟ$Ǳ#ɘͽ1ʻʖ˻	#ͽʕ4Ϳ̆ʝ܊ɍ̇ʘՎɨͽʪªͽ1	0ե1+˃¼ʽˈ¡ʪè1	0໐1	0଻ã##ʒë#Sʒ#։ʒ#׵̅ʢʏȲʫ* #˰ͽg˸ƨ1	0ڡ#ʕËͽ0ƖͿ#ʕ$ßʪࢨʕj#ϦʗǦͽքʧ#ʛ˵ʕjͩ1ʪǁ$Ϳ#ʪϬʕÁǗʒŘ1˄ʪĲ(˟1	0઺͹ʫ*	Їͽ;bͽௗ;8̄ʘՎȤʪŶʒ׮ͽ2°5ʒȗ!ÚKLR\x00S\rÎ%Ƥ$6ͩ	ʻʗ௽ʕď$ʖฒȓˎʕ%A\x00ʖ۞ʕड&Ӡ1	0ŵ1	0ঽ)΁á0࣒1	0ങ1	0ˉ̆ʖŃɋ1	0ࣘ1˅ʪ̤	6ʻʕĥͽ\x00;6ʻʖޒͽ\x00;\x00ͿʪIˁԊ˗ʒǡ#1˥B	΁Ļͽ\x00ʕĊ%1ɦͽ\x00;XͿ(΁Ҵ	ʻʖƞʕ঄ͽ1	0৑ʫ*1	0ψ1	0ૼ1	0ٱ\rͪʪ>ʕ΁òͽ\x00ʖΜʫ*ʨ#ϳ΁ཀʾÝ	1Yʪ¯ʪ½ʒˏ#;̄ʖŋȔͽ2°5ʒW!ÚKLR\x00SÎ̆ʟ΅Ɋ\rͩͪͫͬͭͮʔŪ$ਠ1	0௏ʪॳ΁࠻	$?΀ʕ࠰%lʒ০ã%#$%ā#Sͽ#ǣ;%Ǡ1˥'1+ͩʕ֣ʜಝͩʕױ'Eʪ୎ʪŻʒ̈Ƿ'<ǎǷƋڵ'-ʪͪ	Άåͩ\x00ʪW,#ǃͽ.ʕì$5%΁Ҵͽʕ&1#ʒ³1ʪའ˄Dʴˋ86ͽ0ֈͩʕ=ʕǷƉsʕൈ'E	ͽ1°RÎ1'$ǽ#1	0ߒ$#ਾʤ#ȅ1	0঱Ѧ	$ͽʗౘ;gͽʪpͽʫ*͟1%@௡ࡁ1+ʪઆʪ๣ˍ2˄̅ʖƍȩ#	1ͽG˼ʕ)1ʪຜ˃ʪৈʪΚʘ#³ͿɱͿЇ$$ʒ۔%$ʒࠄʒˏ\rͿʪpͿy%\x00ͽʕƗ1	0ૈͪ˭	1%@ʒʒŪͽ̆ʚफ़Ɂ0ٷʝ#ƽ˦΁1#ء#;Ø1ˉKˈ1	0Ь	6ͽʕ=;\x00Ϳ1&ʕǪ	#ˍʕćʕƯͽʕË;1	0৳̈ʖŋɯʖ#ßʪIXˁӧʞ#ģ΁Ԣͽ	#ʻʘ༇ͽ1#ͽʕĚ#ʫ*̈ʖŃɮ#ǘʒȝ$?΀ʥ#˩1¹ʪӲˏ ˞¡ˏ'Ǳ$%ˆƫʒï	ͽʕ=;\x00Ϳ	1ɼͽʕ࠲1%ß1˃2ʶʫ*ͽƶͽ1	0ഒ-Ʌʫ*	1˃2˅\r#ʕA$ͽʕ4#%ʪ෾%	%ˎʕ%ě1	0༘[źƿ)\x00+Ƨƿ)\x00,u)ʪʕ)\x00+ʕձ)ǃ)\x00ʗ๮*)Ø)Ǔ)A(ຉʪȄʒི'ʕ஼'ʕԛ'ʕ%i-૴˖*±Ǝ)u%&ʕÁ)໹%಺.ʪŶʒچ-ଯ	ͯͰͱͲͿ#ʕĕ1ʻʘՈ1	0๞1	0ʞ0ۅ1ʪĵʒԂ̆ʙޖɖ΁ֽ6ʪট#̆ʙʖȾ	'-ǵཤ&Ͷͷ͸ʣ#͋1	0ഉ#ΆԒʻŻƚʕୄۚ&&ʒï&,##ˮˊ$Uˊ%ٚˮʕࠝ˹#൜+ã$ͽʖѱ$Kɛ;$$ʖए$ʕӀ$ʕЃɘ;·%^ɕ$\x00;#$}1%@ʒǉɠ%A1˶\r,ʪ੹&\x00(\x00)C#ƊB#ʲʕʻ\x00ͽã%%$%S'%ʪeʕ!൱1% %೯;ʪp;̄ʙҌȣ1Ϳ ǀͿ\x00ʡȝ6ʒǸ1˝˙1ʪ҅ˈbʶKˋ8$ʕͽÒ	1Ƒͽ\x00˜ʫ*)&ß	ͩʕǬʗΪʕʌ;ʪp;vʪI´ˁƽ	ͽǃͽ\x00ʖƅ#$ͽʕͽʕȌʒâʫ*#ͽ;g	Άགͩ\x00Ɖsʕة	1ͽͽʕՑɕͽ\x00;˟ƣB	1Ɵͽ\x00ʖō̆ʠˤȿ(lʒįʫ*\n̆ʢ΀Ƀ΀$΀̅ʞૃȪ	1Ɣ&?#˼ʕ)0˞ʗ#Ƅ#ʪ৥1& ;ʕȑʒǡͽʘʦ;Ý&#ʒ1ʪȄʒ̆ʛຬɉ1#$ৱ1ʪÀʕ΀˼ʕĕ	%@#@1;ʕǆʻʗЖƈʩ#̷$ʕʖƅ	΀ˎʕ΀ě1	0༩1ʪЧˈ̅ʗΉȮͿ΁ńͿͿ$Ø%ǽͽʪIaˁį1+ʪŻʒŒʪΥͩʕัʟƁ1	0ຳʫ*ͥ6#1ə;ʫ*0̊('ʕԃ1ʻʗݿʻʖ঻6ͿƳ'6˦̅ʗȞȧ̆ʟ໑ɑ̆ʟ΀Ƚ'ʕ%	6ʪّʕʻ\x00ͽ	#$ͽʕ)1	0ࡇ1ʪȋʫ#ʕǢ	1Ɵͽ\x00ʕƅ	ˍʙș΁ċͽ86ʻʕĥͽ\x00;\x00Ϳ	ˍʕƞʕƼͩ̅ʙҌȫ#ʖʹ;ʪࡽ0ʪʫ*ͦ1	0΂ʫ*0न1	0ӌ6˰ͽg1&E#\rͩʕ=ʘē΁òͽ\x00ʘखʫ*͞(lʒছ1˄¼ʪ഻ː2ʫ81	0݌˺ͽઁ'ʕԛ1'A6ʪךʗΕ1YʫD˙ ˄¡ʽ\r1ʪʜ#ʗƃ#ʗŘ#ʒ-$ˍʕćʖʔ%$ʖɖʖබͼӼ0யʫ*ͫ΁˸$ʫ*͠ͩ#ͽʕZͬ5&5'Û˵$ʕΒ1	0ળ#ʪp#1ˏKʶ1	0ೖ6ʒȕ1ˉ2˙1	0ෘͩͽʕƆ\x00#1˲	΁Ǚͽ\x00Ϳ\x00΀Ý1#ʕ%#ˊʖí#&੺1	0༮ʫ*͡ʪI­ˁǼ1ʪ࢏$,ʚȅͽʪpͽͽͽʖѱ1Ϳʫ*ع˕sʖϠ	%Ơ#(1ː2˝6˼\r%+$$AƧ#ʕƆ$#ʕ͉&!B̄ʖƍȟ#ਓ\rͩʕ=ʕƷ΁òͽ\x00ʕՙʓŪͽ$ʕŃ ʢ#Ԋ1ͽ!ʕǆ1˺ͽg%ǲ$1΀෨	$ʕ#.ʕō	1&#ʕ)	$ǃͿ\x00ʕÇ˻ͽ̅ʠƍȯ	1ʪ¯ʪ½ʒâ̆ʠǫɈʻ˾;ʕ¶ʙھ1ʪ൞ʪ˩΁ت(1#@ʒǉɠ#Aû6ʪeʕ'в	ͽʕ=ʖ૔#'Ƥ%	ͽʕ=#\x00$ͽʖل;̄ʘɒȢ̆ʟ৹Ʌ1	0ݫ\rʻʖ̩ͽU#\x00$\x00&#1ˢʗՅ\rͽͿ΁ҧͽ\x00$\x00΀̄ʗΉȥ$#ˊʖí#&Ɣ%;Ƅʡ#į	$ʪʆ%ҥT̆ʠËɏ1Y˄çˍ˚ʾ6;	ͽʕ=;\x00ʗශʫ*ʚ#ɋʿˁ	ͽʪeʕ$вʪŶʒaʪ֎1˵\r6#Aʷ	#A;1˙2ʯ%lʒģʠ#Ķ&ʪp%vͻ;ƉsʕǨʪş;ʕ#Ø$ͽʕ)1ʪǁ%	ʪ௸ʕj#Ϧ;Ɣ\r#ʪ\\ʕͽ\x00ʪЫʕō\r΁஖#\x00ʪp$Aƌʕ૽1	0ஞ1	0ק̆ʛ຋ɇʫ*ͽͿʪp΀y%\x00ͽʕƗ0௣1ʪ੅%ʫ*͢̆ʙˋɗ̄ʗˋȕͽ΁τͽ%ǽͽě1ʭʐʕʕʀ1	0ེ&ʪƵ'-1	0છʫ*͛6ƓͽÝ1ʫ2ʽ1ʪʜƟͽ\x00ʗΠƟͽ\x00ʗ࡟1	0ࡃ΁෰	1ƿ΀\x00ʕՅ\r1$«ʕŤ$«ʕߞʕĕ(	1ƿ%\x00ʪˣ1ʴ2ˏ	6ͽʕɛͽʙТ+)T̆ʛਪɌ\r'Ƥ$थ$	ʷƮν1ǂ;\x00ʕ஀#@ʒ	1$#ʕ)0ݥ1#હͽʠषˍ௞ɛ;ʫ*͜1%	1$%A΁ຢ$Ç̆ʛວȺ\rͩʕ=ʖƴ΁òͽ\x00ʖΜ̆ʟ࣮ɐͽ2°5ʒƷ!ÚKLR	\x000\n\x00SÎ1ͽƉB$ΆԒʻʖнŻƚʕর$##$ʻ%^1	0֬	%A#A#ʻʖ·#ƺ#ͳʹ͵ʾě\r#ʪ«ʕˍʕПʖƅ1	0෯ƌBʫ*	1Ɵͽ\x00ʕƯ1ʪӎːçˏ2˄8	ˍʕƞʕƉͩʫ*̇ʖŋȖʫ*ͤͽ2°5ʒƝ!ÚKLR\x000\x00SÎ0௤ͽ2°5ʒO!ÚKLR\x000\x00SÎ΀ƉsʕǨʪş΀\r1ʻʛಳʷ ʕ२ʻ1	0ۼ0กã$$ʓë$ಕ#*ʓǚ$\x00$๬1ʪǁ&1	0ൗ#Û1˻!ͽɕʻ\x00;1ˋʲçʯ2˚8$ʕ#ÇʪIˁɏͮ#	ͽʕ=Ϳ\x00΀ʻ\x00ƴ̆ʢʖɈ1Yʶçʶ˞ʪƟ̆ʛˤɗ1	0޺1	0ఁ1#ʕģ1	0β6$ʕՌ1Yʪథ˙ˈ¡ː1¹˄Dʲ ˙¡˙	ͩʕ=ʕ+ͿƉB	&ǃ%\x00ʕō1%̄ʙͷȥ#w̄ʢƢȞ	#ʕĥʗǦͽvͩʕҿ*ǃ)6\x00ʕōʫ*ͣ1˚2ˋ̅ʣͶȰ	1΁­#Cʒ൥̆ʝकȻ1	0ಮʟ#ΰ$ʪª#1	0Ա1ͽ;g$ǲ'	΁Ǚͽ\x00;\x00ͿÝʙ#Ԃ΁ࡥʪȶ3ã%#%Eͽ%S&+ʪθˆƫʒ඿$Ä#Άу%Άу&'˼%g˼%˼&g˼&'}	6ʪpͿƌͽʕƗ΁Ŋͩ஺1	0ম$ͽJ#1	0১̅ʝʏȪͽʕĚ;	ʐʕʕǫʭ\r6ʻʖŴʗש˕sʖݘʒނ1ʪЧʫ̄ʡמȡ1ˢʪ؝ʒѢ'ʕʪeʕ&༉	1#@ʒï$%\rͩʕ=ʖŢ΁òͽ\x00ʖϤΆ୛ͽ\x00$'1ʐ$ʫ*̅ʘɒȫ̆ʟЕɖ\rʻʕӀʻʕЃɘ;ͿʕË;̆ʣपɆ˲ʻʕИ˳ʻʘۏ$^1ȚͽXɦͽ\x00ͿX΀6ǶǺ$\n#ʕܣ0̠1#Ҽ#@Cʒǡ$ʕ΁ତƎ#ѯʗϗǑ#A%༯&$ʕ#৺1%࠭1ʪߺʪĲ	1ͽʷ ͽ೭#ਵͽ±ʕ໲ͽয়ʕÓʗಟʒ³1	0೏#ǽͽɚ;	ͽʕËʪp΀ʦ#̾İ̅ʟ༛ȪͿ΁ҧͽ\x00$\x00Ϳ	#ͽʕ4;	)ʪʆ'\x00(Ý1ʫ¼ˏĔʶ2˝80ߴ$ʪªͽʕ4ʕ࣫1ʯ2ʪǢ	$ʕŦ%ʖߢ̆ʜŋȼʫ*&ǱͿ΁ඬ$҄%1	0แ1Yʪࡗ$w1$1$2$@ $@Gʒï$;ß1ͽͥ#່ͽ$ʪ«ʕ#೥$ʕ؄$\\ʕùʒઋ%^ͽʪʕͽy#΁ܚʪȶ#0Ɏ$̅ʟʖȪ1	0ཚ1	0ؖʪੳʪȶͽʘʦ;Ýʫ*Ϳ#ʕƁ1˝ʽ˚Kʪω	#΁๪΁ࢤͽ8Ϳ#ʪЫʕÁǗʒŘ	ǾˍʕՄ\"1	0ઽ1Yʪ޲˝ʯ¡ʹ&ͽ%g\r1ʗʪఈʕ෗ʪ¯ʪ½ʒˏ̇ʖƍɧ̅ʗˋȭ$?#΀1+ʪ҅˝ ʪພʫ1	0੸1#ʕǪʪུRB#ǹͿ1˝ʫʪIˁŷ+ƉsʕǨ)T̅ʡЖȪ1ͽˁ#ß	Əˍ\x00ʖôʫ*0൅1	0ੈΆû1-1˟<;(<1Ϳ1	0ډ#ƤͿ	$ͽʕ4ʕÒ1	0ņ%Ά࠵ͽ1	0ף-1' ͽ*bͪࡀ΁òͽ\x00ʖ൰ʞٺ'D'@ӕ'@ʒǝ'@ʒାͪʗ׫ʪȄʒՙ̇ʖŃɪ̈ʗȞɭ0୞'?ʪʆ%ҥ6#ͪͫͬ1ˋ2ʪĲ1	0ः˾ࣇ˽w1	0࣓1	0ೄ1	0૮1$ʕǪ1	0ঈ#ǘʒʺ˧΁á'Û0˥#ࣥɔͽ\x00;௘ɘ;ͿʪpͿƌͽʕƗ1	0๻+΁یͩʪןʕ˝̅ʖŋȬ1ʾˏͩଏ5ʒ[9Сʪͨ#³ͺ#ʪ>ʕͽʕƗ&%Ø	#Ȩͽ\x00ʕ෭1əͽ6#ʕƆ&΁ح̅ʢ݈Ȫ1ʻʕഠ1˅2˙0ຍ1'ʕԎ%lʒЪ%#$g\r1;#ǻ;\x00ͿʻȀ̄ʗȞȠʫ*\rͽʪʕͽǰͽʕୁ1	0ࡪ$ͧB1#-ͥ'Hʕ߶1Y˄çʲ˙¡ʽ΀ƉsʕǨʕƘ΀1	0स'?&#ࠚʒaʒ-ʒOʒƝʒÑʒƆ˲ʗཽʗͪ˲ʙĈʗ̿˲ʘತʕથ%˲ʷ}̅ʖŃȱͽ2°5ʒÑ!ÚKLR\x000\x00SÎʫ*ʫ*\r/$ʖԭͿ$ȓˎʕ#A\x00$ʕ෇%ǽͽě%A#A%@#@Ǆ&^1#Cʒ0̹1#̆ʠ΅Ɏ˜ʕ˅ͽ\x00;81	0ǻ̅ʡঙȪ̅ʝـȲΆΈ !΅΂΃΄		\n-/M\rV­Ȝ˧Ƅīǂ+ńƩÞ#ĺǐĺǯƻĺłĺǩĺŮȘǊƜ:ĽđèǒÅǷǗÁÜȅĺǨǣq·ƙƿĺȃłĺäłÕłĺĳłĺKËǠsŒíţ@Ȍǉłƅƌǖƴ_ǷļÃſHǴłºîčŧƂǸLǈűƻĺŜłÉ¥ĺKËơķǕĺƦȗ8uĺ§łĺŗǳŲœƖéŹçĺĺQƮÆ³Ğ 4ĺ$ĺǼĺ`ĺöÍ×>ĆłnĒł\"~łūģłVĊłȐłĩĺǺĻǟ¦cĺĺÑċJ\rĜȕȁÖìıÂ'Ňłëĺ¼£RĈŏǷwĤľĺ«Ǭ\nňƣƬ÷ŢĖǃƟ¡ĺĹiàĝźŷzŅ¾a¢łƘŐŞŀûłǆñŋĦłźȂźĴĿġ9ŽĺǎǷǅƊȂªĺŘĺ[ČÛŴąĺďEĺÐŎĺĺKžĬËǠƏƐŪŠmǌǗƑÙȒƕĺŕƚŵWƧƠůżłƢtôŭùǫbĺȆĺ2Ƿd®Ơĺ1łĺŶĪƆ\x00ƽǉłŞĺşŝe=ǧǏÇǊǀÊÏƁćłǶǪĈǋµłƷĉƎPǚĺȀƤƾŔǷƨĘǓæƀâ»%ņĺǥĺįŋk?ƹSĺNüXǲ¿ǠvƴIǁȋ{łǗĵǷƂ¹¶ȔÚƉő(õĿƯħÈAƼȇƈŉƺ7ȖĎǉŋǽșłŚGłĕĺĂƒǵǰǦǻȑĺĺ;ĺĺMȎyƃĲ^Ō-'ł°Ā)IǢǍśĚƍšǭǑ<ƴ©ƥŰłÎǓĐƶĺx\nǗųŁŅåǷIðƪÒƂðȊŅ¤ǷǈƪĄǞ±ƓǔŦŤÓáǙŊǾĺ\\ƇŰłAǓ	UÔ.ŀïƫưō­ǡȂ|ŸYþĔøßȍŪťãƭŻo3½ƛgǈƑOŋƵÌúƻĺÄĺũ¸ĺȈrŋ&ǜƝĺ¨ŋƲȏǹĺĬƸĥǛēZê0ƋĶ*l]ƗŃŨǄĭȂKǮĺ¯ęǊØƳȚǘűÿ ,6łĨĠĺ}ĺĺKjhǠǇř/ǝòĢĺýBŬĺǿǊǷěłDğėłāpȄ¬ĮǱǭǑTİƱFCƔǤ!ĸĺóȓĺț´ĺĺfȉÀƞ5ĺ²ÝĺŖłăĺ\x00Ȝ	Άå΅\x00.ÒA	ʪpƌʕ˝Ά൸	΅ʕ=ʕѦʻʗଅΆࡢ˙Ĕʪ೿˚ʲ8	Άå΅\x00ʖҲÇ	ݖʪ૾˙Yʪਫʪȋʶ¡ʹʹDʪهʶ˝8	ަǠ΅	ʖɏʒǡ\rʻʗîTƔ	߯	1ʐʕձʕƢೊĸ͹ʗࢶ΅ƨ	ŵÉlʒňͮwãS˰Ǡi	ˉ	࠱͵#	ͩ)ǡ΅ΈûΆۘ΅·΅^ͬwͫϒ̠	΂΅ʕ4ʕɡYʪ¥ʒਸƨΨʫ*\nǢ΅\x00ʪȊxʖ֗˵ʕj΅ʻʖŴʕ΍ͫѺͬ	JͪࠤʒƐ৸	اʕĕʻʖ˻ǫ΅\x00ͽͼ˖˛ʪό΅ʛ༦\x00ʒ୅ʪό΅ʡݺ\x00ʒوͽʕËͩʪŻʒঞʪ͌ʒഗΆå΅\x00ʕלÒ\rʕ4ʖЁʗ̾	ݰ	«ʕ¶ʕڋ	΂ʖƾʙǅ		৏	໨ĸͰʪƵːʕЄ\rΆå΅\x00ʕ՘ʕॕǾ\x00\rv	໊ʾ2ʪ̤Ǭ΅\x00ͩ	ິ΅ʕÓŵ஬ʒ³΁ċʒƯlʒ	βʪ¥ʒģ	Əˍ\x00ʗW͜vͳȤͮ;ʷͯ;ʷͰ;ʷ	ࣞͩ:	΂ͯʜǟʖخʝ΁	Άå΅\x00ʗaÒǡ΅΅ʗИͳ	ඵ	ʕʢɏʴ2ʾˈ2ʲЊxƿ?\x00ʪெ˗!ʒĸͻʗʄʕ)Ά໴˰1ʐ΂ʻʖ˻˅K˙ͶȤ;ʷ΅ʕ)Ǥ΅\x00ͪ1˕sʖϠͱȦ΁­ͯ	ʕʚƟǙʒЙ	ͩOǞ΅ͿlʒΈঋ^ͪ;्ͫ;ڽͬ;мͫͫʕʒǆ	΄  ʗε	ʖʼʕƉͱ\rʰʕ\x00ˏ˝	ؿ	ƿ\x00ʜŘͲ\rʻʖݠʕʕݙʕj΅Άல$ʒΆå΅\x00ʕ૜Çwʫ*ʜೆǽ΅	Əˍ\x00ʖô͝vͰ΅ʙԯ˅ʯ	௯ͪޱ	ʍͩǊͻǊ͹ǊͺȤ	ǱːʕԀΆદ	ͪʕʒň΂1˱B	଴ʫ2˙ʻŻƚʕԾʕÓſ߃ʒǿʻŻƚʕԾʕÓʗ໧ʒ³Ǟ΅	ؐ	൳	آʪڿˈç˚2ˉ8ͩwͭͭʕʒâǬ΅\x00ͪYˉçʪȋˈʪŷͽǭ΅\x00ͪΈĘʖҲÇ6ʖх	޽Ϳlʒը	Əˍ\x00ʙOͥvʗʄTʙʮDʕʒξʕʒʺ	ͪʕʒ+ݔʪ¥ƃಗʪ͌ŭ༬ʻʝࣛʷͩʻʕñʞȓ͚ౠʻʜؽʷͭʻʕñʜ˪͛௓^ǝ΅ͮ;΅ʘՠͯ;΅ʘඅͰ;΅ʙԯΈĘടÇ	ʁ΅ʘٲ΅ʘણ΃	ڲࠎ΅ʕӬʕຎ2ʻʖ·ʻʖˤˋ˃xʖèǤ΅\x00ͬʪਈ	ͩCǟ΅Ͷ΁áTʻʘЯTʒʺǧ΅\x00ͭ˚KʪĲźʙ࠙ΈमʙٔƁҋƁࢿʖѶࢫ^ǧ΅\x00ͩ\rʱʜñˍ\x00ʟୱׇ^	௵	Ά৿΅·ӠƞB	ࣲ	͸˖ͷͭǭ΅\x00ͭ6ɉ³ǲ\r6ʪధJ΅ӆʒ١J΅8Ǣ΅\x00ͬࠋ	ͩ£Ǟ΅	΅ʕбʕ۰ʪ>ʕʕ̚ʕҒΆس§΅ʕ)\rǦ΅\x00Ά͜ʒ༰ʒΫͯ8ͩǯʙʨΈĘ\x00ʒ	ͪƽƸ΅8	΂ˍʕǶʛ̿	ͩʕʒňǤ΅\x00ͺ˵ͩ2ͪ׏ʪұʪ۬ʫ2ʶ8Ϳlʒʻʕŝʖܶ	࠯ͩ΁൙ǧ΅\x00ͮࡣ΁ࣅʫ*Ǩ΅\x00ͿǤ΅\x00ͫǤ΅\x00Ͳ+ˉDʪʧʪଽʯ;;ʷͫ	ͩʕʒ\r+ʗ༔ʘ್ʒΈࡴ^	ٳʪȋˉ§\r6অʐʒࢄؠʕ౜³\\ʕƓеʕ)ʴ2˚˟ƣB΅¥ǭ΅\x00ͩ\rʪ>ʕ±ʕҒʕѧʕʌͳ΁á	ͩʕ=ʖŢ΄΅*ͫǯʘ͏	Əˍ\x00ʙƀ͡v΅ʕ)	٨\rǦ΅\x00Ά͜ʒลʒȎͰ8ƂB΁­ͳ΂ɅͿ٥ʒ̨ʒƯʪĶ(ʻʕŝʕʮ΃෡ΆફΆڶ˼΅ึ΅+ʽʪʠʶ˅	Ə΂\x00ʚƏಷ\rʒŒTʕڷ˥$ƃB΂	݇ʪࣶː΅ʕ૯ˋžνͩͪΈĘʗaÒʪئʪұʴ2˄8$ʒ	ےͿlʒň6ʒȕ	Əˍ\x00ʗ̝ͣvͪʗाʘΠʘÇࡰʕ෺ʒ	ԱʪՖʫ	@Eʒï	്ːKʪƟ˃˅D˃˚8	ॊ	Ǯ΅\x00\x00Ϳ!ʕʽʪ>ʕʕ̚ʖ࢝Άެ\x00΅X΁­˷ʖɧʒ̘΅ʕƼ$ʒԭஇʟঃʟഎʡϹ˷ʗ೮΁­˷ʖɧʒ̘	־ͿlʒૺǛ΅	ǃ\x00ʕ໳ʫ*	ǜʒï	΅ʡ੓gͯȤ	֑ʒňxʻʕŝʗඨ	Yͫ ͩ ͪwͩ;ʷ ͭ;ʷʒ	޴	ʹ˖͵ͪ	ຩİʻʗ౓ʗǫʪӔʗʀ?غѯૉˣ6˷ʗӉಱͩ	ņʒʫ*	঒ͯ΁áʒ༾ҡʕԎ	Əˍ\x00ʗē͞v	Άϐ˷ʖќǤ΅\x00͸	ǻ	ʖ̷\r+ʪ½ʒٗ΅ʕӬʕ׊ʪ๩	ʕ)w	ӌ	੆	ǈ΅\x00ѫϒ΂ɇ˼΅g΁ੇ˻ʷǧ΅\x006	ཊYʪ¥ʒ൩ʕՍс	ˍʕćʕਞǩ΅\x00ʪฃ	Άϐ˷ʖќ	Əˍ\x00ʘĊ͢v	ЬǤ΅\x00͹ǩ΅\x00΀Ǥ΅\x00ͻ	༱ʪʻŻμǨ΅\x00ʪ؅	ͩ¾ǡ΅6΂+ʪਏʶ ʪ঺˚ʺʖຘɇ	YʪŻʒŒʪȊ	Ǭ΅\x00ʪƳ΁٭ʪƳǭ΅\x00ͫʪโ	΅ʕ4ʖݻ	ˎʕěషʶː	व	ΈĘ\x00\x00Ǩ΅\x00;ʾÝʪՖʹʗͿʙྂ\r+ʗ౧ʖ೅ʒ	๨lʒʻʕŝʖխʫ*ʪƵʕƘ	ǃ.ʕō	ಙ	ॎΆഽʁˑ΅ʛୖʗཝˑ΅ʛఐʘ࠹	ʕʡƄʻʖ఩	൑ːD˄¼˞2ˍ8Ǣ΅\x00ʪܕǨ΅\x00ʪওǢ΅\x00ʪབྷ΁ċʒѢǤ΅\x00ͮʪݒʪè6ࠐǚ	ʕʞࢅΈĘ\x00ʗʄTʕ࢖	༣΃ʕƁ	พ	ໜĸͩ	ଵ	Əˍ\x00ʕдͦvജ˄ĔʹD˄ʪࠩ	ʕ4ʞ௎	Əˍ\x00ʖŦ͠vƥʗώʕಔΈĘۢÒǙʒ଎	΅ʗДʢ੘ɞʕງʒʫ*\r˞΅¥B	Əˍ\x00ʗʳ͟vͿҚ	ͩÅǜ΅ʕʽ΁­˷ʖɧʒ̘ɎʘʠʘΕͮ΅ʘչǫ΅\x00	ψǦ΅\x00Ά௧ʒബͮ8ʁ΂\x00gTTϺʒయTơʒ҄ʻŻμ	Ͳ˖ͱͰʕ՚΅ऋß	๱ͪǯʗ୹	੦Ǣ΅\x00ͱʫ*		Əˍ\x00ʖĝͤv	ʕʚǸ΅ʠ߆ƨͩʷ͠ʻʖŴʕ΍JͩӈʒƐlʒâTʕ)	̋ʒâʪɆʷ΅ʘ܎ʷ΅ʘԟˋʝॹ6ʣɆʕՌǧ΅\x00̊Ǥ΅\x00ͭ	Əʻ\x00ʚԷƢ	ʗ΁ҚͿlƃBǤ΅\x00ʹͶͬм	઴	௴ʪԐʾǢ΅\x00΅ʕҿ\rǪ΅\x00ʖΏʒڇͪͩ	ஏͫw	৽	6ʕʒȢકͩ΁á/źʻʘɭʻʘԗʘ๡ʻʘԗʘД\niʻŻټʗ་ʗ̥ʘࣨʗ̥ʘ৓ʖѶɂ^\rTʕ¶ʕѣ΁ଭʾKʪèʕ՚6	ਟʷʕԟ˄2˙΅ƶ΅ʷ΁ċʒ͏ਸ਼	ʞǫ΅\x00ʪѣĸͭʪӔʗǫȂʹ¼ʪӲˈ ˉ8ĸͺ˖ÒǤ΅\x00ͼைʒݳͼ	΅ʕ4ʕɡ΅ʕɛ΅ʙТwƖYʪ¥ʒइ	΅ʕ)΅ǼB\rʪ>ʕʕ̚ʖ౯΅ʢ଼΅ʜ୶ͷȦ΁­Ͷͪǧ΅\x00ˊʕéͳ8೗	Ǧ΅\x00Ǚʒڢ˅¼˚ʿ˃ ʪωͯ΅ʘх$ʒը	૲ʪࢬ˙ͪwYʪ¥ʒړTʕԃ˄2ʪĲ	ˍʕǶʪ˝΅ʕбˋʝཿCʒҟʒȕ+ʪ¥ʒຄͿ$ʒਨͿ$ʒȊͭwΈΉ	·	\n!\r\"~³w|A=\x00)h77]qjuvU7\rup	2\\.W/#:m\r?7,L7;7;7ku78PDi(\"7V7GEMsbRB?M17zuFuJe7\nu7K^0u 5u7\\nX?7`Nt3>Z?y[-7Q'?dg9?&cH?<C?+[7$Tu}7{7r*%6uYfRIuO4OS\\l_a?o@7?x[!7\x00~ʫ*̊ˋK˙Ήû	ʻʗî˞¹ʪӎʪԖʶ˝	΂ʖƾʖů	ΈҸ΅ʪͪΈԏʗϧ\x00ͪΈҙΆೲ΂ʘ৻΂ʘ໯	ͪԣ΄ʗεǗŬҬͭ΂ࢇʻʞॗʻʝɛʻʟխ	࣑Ԕ΂1\rʪÐʕ\x00ˋ۳ʕ౑Άॲ΂ƨͭͮ	ǰʒ۹\x00Ͳʚक़\rʪ\\ʕ\x00ʛඇʒ³\rʕĚˋʙaʕच	΅ʕ=ʕ΂	΂ʟࠌ\x00	ʍͫ	ഭ	ˍʕñŹ·£ˍ΂ʞ௩ʫ*ʯKʹ	ˍʕñźͫ	ͳ˖ʘഇ	΂ʖƾʖů6˅ˋʪÐʕ\x00ˋʗfʕѾ\r ʜבʞâ΂ʕ)İ	ˣʕȪŴҬ	+·żʙˍ	΂ʕŸʙǅΈ็	ˍʕñƅʫ*\n	ु	ŵ	΂#ʕÁʫ*	 ʕʒǸ	+·ŰʙˍYˏb˞ˈʽ	ࣱ1ˋʠߌ	+·ŸʙˍʝࡄԔ	ࠣK»ʕ)Sgʛࡅॶʕʒۈǖ 7@ٯ2Xͫǰžʘ-ɂ^6	උʪÐʕ\x00ˋʗfʕѾ΂ʠЕ\n·ʕʌ	ǻ	ˍ·ʘʷ6ʾ\r\x00ʒॄท\rʪ\\ʕ\x00ʛଈʒ³΂#΃ʘైʻʡԆƖ	ʞͱ˖ʛ୫ʒƐʕî\n	঩ʵʪʜʖ಼ʘʠʘ࡬	ʕʒňЊ	ˍʕñƀ	6΂\x00\x00ʪĶΨʫ*\r	ǜ	ઊʵ\r΂ʕŸʖůƵͮʕ՜ͩΈԏʙȗ\x00ͩ\rʪÐʕ\x00ˋ९ʕ೎ΈҸː2ˋ	˖\x00ʒʨɎ	ʕʒ	ņ˖Ʒ\nʒʨʫ*΁Ŋ΅\x00ʕɡͳʪpvźǒ\x00΁ܨʕʒȬʻ^ʫ*Ήি\rΉΊ\n	(\x00\n\r	\x00Ίûʫ*ͮΈഹ\n!ͬ˝D˞Dʪʧʶ8ź΂ʘ໾\nʪ«ʕ΂ʘʠఎ\nʡÓ	ɂ^˅ˉ΃ʒМͪͩİ΃wͬ\n\r΂ʕŸʖůƵͮʕ՜	ņΈҙ	ΈћʗਔʗԀ	ǜͪ΁áʫ*	΂ʛ¶\x00\x00\nˍ·gͫ#΁­ͪƖͮʻʗîͮڕͮͮwͬʗƆʫ*	ŵ	\nΊ\x00\r\x00\x00\x00\x00Έћ\nʪ\\ʕ\x00ʛດ\n		ņİ";}else if(_$fD===38){_$_j=_$dL(71);}else{_$jx=_$fb.execScript(_$lZ);}}else if(_$fD<44){if(_$fD===40){_$cR=_$dL(0,909,_$_Z(_$_R&0xffff));}else if(_$fD===41){_$_R=[1,0,0];}else if(_$fD===42){_$bt=[];}else{_$a7=_$lZ===undefined||_$lZ==="";}}else{if(_$fD===44){ !_$a7?_$cz+=-57:0;}else if(_$fD===45){_$_R=_$_v.nsd;}else if(_$fD===46){_$a7= !_$_f;}else{_$_h++ ;}}}else{if(_$fD<52){if(_$fD===48){_$a7=_$_h==64;}else if(_$fD===49){_$a7= !_$dN;}else if(_$fD===50){_$d9=_$el.length;}else{_$kt++ ;}}else if(_$fD<56){if(_$fD===52){ !_$a7?_$cz+=4:0;}else if(_$fD===53){_$jx=_$bt.call(_$fb,_$lZ);}else if(_$fD===54){_$fT=0;}else{ !_$a7?_$cz+=0:0;}}else if(_$fD<60){if(_$fD===56){ !_$a7?_$cz+=2:0;}else if(_$fD===57){_$cx=_$$X();}else if(_$fD===58){_$cx=0,_$_h=0;}else{_$fC=_$az().toString(16);}}else{if(_$fD===60){_$bf=_$$X();}else if(_$fD===61){return _$bt;}else if(_$fD===62){_$$n=_$$X();}else{_$dN=0;}}}}else{if(_$fD<80){if(_$fD<68){if(_$fD===64){_$a7=_$fT<_$lZ;}else if(_$fD===65){_$_v.lcd=_$$d;}else if(_$fD===66){_$fb[_$fC]=_$dj;}else{_$az=_$_Z(_$_R);}}else if(_$fD<72){if(_$fD===68){_$bt[4]=_$dL(71)-_$jx;}else if(_$fD===69){_$bt[_$fT]="_$"+_$jx[_$cx]+_$jx[_$_h];}else if(_$fD===70){_$a7= !_$_j;}else{_$hz.push(_$bj(20,_$$X()*55295+_$$X()));}}else if(_$fD<76){if(_$fD===72){_$_v.scj=[];}else if(_$fD===73){ !_$a7?_$cz+=52:0;}else if(_$fD===74){_$cx++ ;}else{return _$jx;}}else{if(_$fD===76){_$ca=_$_Z(_$_R);}else if(_$fD===77){_$fT=_$$X();}else if(_$fD===78){_$bt[2]="|MO`LKPOQ`KNN`FJ`R`NP`LLNNMMLK`JL`MJ`JLJIPK`JN`ONNLO`JIKM`O`KII`KM`NQ`ONNLN`JQ`MP`LL`JLMKJPPKQ`JI`MK`OM`JKQ`P`KMI`NJ`MI`JII`RK`MM`K`JRK`KP`ML`OL`JP`MQ`KKM`JKP`MN`JM`NK`JR`QJRK`QO`LK`M`LO`OIMQII`JO`LJ`JK`JJ`LP`L`MKRMROPKRN`KI`KNO`N`KOQMLNMNO`Q`QLQQOIQ`KIMQ`NR`KNP`JKO`NN`JOPPPKJO`IGI`KR`LM`LN`KQL`NIII`KO`KIL`FIGIJ`NII`KOQMLNMNN`LII`KIJ`JQI`RL`KIRPJNK`QK`KMQ`PR`MIRO`JLMKJPPKP`KOKJMM`KL`RP`RI`JKK`FM`MJRMLIM`LI`KIRPJNJ`PK`NO`KIII`JPI`NJK`QR`RQ`ON`JIMQNPO`KJ`JOQMLIIQ`KN`JIII`LR`JIIIII`JIK`OI`MKRMROPKRO`RO`IGIJ`KQ`FJII`MIROI`JKL`QI`KONMMLNPOR`OQ`JIKMI`QJRM`MIKLKLLMJP`QJRR`NOLKI`RJ`ONNLP`QKLR`JJJ`IGR`PJ`PN`KNK`LJMNPKQ`JIJ`IGKO`QN`NLOQPIRJK`QKIK`QKII`NNKRO`LOI`KIMP`OJNQ`IGJ`NIQR`QJ`QJRQ`NM`JOLQL`RR`KPJPLLQPQ`JOI`QQ`QJRN`FIGR`JOQMLIIR`QJRP`IGM`JQII`JRJ`QKIL`JJI`QM`JPLKNQMJRL`QJRL`LRQQKRKLQM`IGQ`IGO`JOM`QL`JNOPR`QKIJ`JJK`KMIIRNRPIQ`QKQP`QJRO`FJQI`KIIII`KNM`KNLJIJJ`LIIII`PNOI`JON`JIIIIII`JNII`IGQJLKOMNML`LKQNLPPNKI`LNII`OMLOJN`FP`KNOKLQLJIK`FK`IGK`JQNRPPNLRL`FRI`JIMQNPN`IGLN`FIGKO`LIII`QOMIIIII`LLLPNONRQM`JNJQNIIKMR`FIGK`JOPPPKJN`JIIJ`LLRNMORPQK`JKKQQ`KNII`JOL`JLQ`JMM`JMN`JRO`KIM`JQR`JRM`JOP`JPP`JOO`JMJ`JQO`JOQ`KJJ`KIQ`KJK`JRQ`KJO`KIP`JNI`JRL`KIO";}else{_$a7= !_$ef;}}}else if(_$fD<96){if(_$fD<84){if(_$fD===80){ !_$a7?_$cz+=62:0;}else if(_$fD===81){_$_v.cp=_$bt;}else if(_$fD===82){_$a7=_$kt<_$bf;}else{ !_$a7?_$cz+=35:0;}}else if(_$fD<88){if(_$fD===84){_$gZ=_$$X()*55295+_$$X();}else if(_$fD===85){_$fT++ ;}else if(_$fD===86){_$jx="_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');}else{_$bt[5]=_$dL(71)-_$jx;}}else if(_$fD<92){if(_$fD===88){_$bn=0;}else if(_$fD===89){_$a7=_$fb.execScript;}else if(_$fD===90){return;}else{_$a7= !_$hz;}}else{if(_$fD===92){ !_$a7?_$cz+=-82:0;}else if(_$fD===93){_$cz+=-64;}else if(_$fD===94){_$_v.nsd=_$$d;}else{_$ef=_$_f.join('');}}}else{if(_$fD===96){_$cz+=2;}else if(_$fD===97){_$_f.push(_$_H.substr(0,_$ca()%5));}else if(_$fD===98){_$cP(_$bt,_$_l);}else{_$a7= !_$gD;}}}}else ;}
    
    
    function _$bj(_$_f,_$gZ,_$kt){function _$aj(_$dj,_$jx){var _$bt,_$cx;_$bt=_$dj[0],_$cx=_$dj[1],_$jx.push("function ",_$cR[_$bt],"(){var ",_$cR[_$fQ],"=[",_$cx,"];Array.prototype.push.apply(",_$cR[_$fQ],",arguments);return ",_$cR[_$b$],".apply(this,",_$cR[_$fQ],");}");}function _$in(_$dj,_$jx){var _$bt,_$cx,_$_h;_$gv(53,_$jx),_$bt=_$$$[_$dj],_$cx=_$bt.length,_$cx-=_$cx%2;for(_$_h=0;_$_h<_$cx;_$_h+=2)_$jx.push(_$hz[_$bt[_$_h]],_$cR[_$bt[_$_h+1]]);_$bt.length!=_$cx?_$jx.push(_$hz[_$bt[_$cx]]):0;}function _$jh(_$dj,_$jx,_$bt){var _$cx,_$_h,_$fT,_$bf;_$fT=_$jx-_$dj;if(_$fT==0)return;else if(_$fT==1)_$in(_$dj,_$bt);else if(_$fT<=4){_$bf="if(",_$jx-- ;for(;_$dj<_$jx;_$dj++ )_$bt.push(_$bf,_$cR[_$cS],"===",_$dj,"){"),_$in(_$dj,_$bt),_$bf="}else if(";_$bt.push("}else{"),_$in(_$dj,_$bt),_$bt.push("}");}else{_$_h=0;for(_$cx=1;_$cx<7;_$cx++ )if(_$fT<=_$aN[_$cx]){_$_h=_$aN[_$cx-1];break;}_$bf="if(";for(;_$dj+_$_h<_$jx;_$dj+=_$_h)_$bt.push(_$bf,_$cR[_$cS],"<",_$dj+_$_h,"){"),_$jh(_$dj,_$dj+_$_h,_$bt),_$bf="}else if(";_$bt.push("}else{"),_$jh(_$dj,_$jx,_$bt),_$bt.push("}");}}function _$gT(_$dj,_$jx,_$bt){var _$cx,_$_h;_$cx=_$jx-_$dj,_$cx==1?_$in(_$dj,_$bt):_$cx==2?(_$bt.push(_$cR[_$cS],"==",_$dj,"?"),_$in(_$dj,_$bt),_$bt.push(":"),_$in(_$dj+1,_$bt)):(_$_h= ~ ~((_$dj+_$jx)/2),_$bt.push(_$cR[_$cS],"<",_$_h,"?"),_$gT(_$dj,_$_h,_$bt),_$bt.push(":"),_$gT(_$_h,_$jx,_$bt));}var _$dj,_$jx,_$bt,_$cx,_$_h,_$b9,_$lD,_$il,_$fQ,_$bT,_$b$,_$cS,_$bp,_$l5,_$ge,_$$V,_$lm,_$al,_$$$,_$cr,_$hf;var _$ef,_$az,_$_H=_$_f,_$fC=_$gL[2];while(1){_$az=_$fC[_$_H++];if(_$az<76){if(_$az<64){if(_$az<16){if(_$az<4){if(_$az===0){_$ge=_$bj(0);}else if(_$az===1){_$ef= !_$al;}else if(_$az===2){_$jx++ ;}else{ !_$ef?_$_H+=14:0;}}else if(_$az<8){if(_$az===4){_$cP(_$al,_$ca);}else if(_$az===5){_$dj=new RegExp('\x5c\x53\x2b\x5c\x28\x5c\x29\x7b\x5c\x53\x2b\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x7d');}else if(_$az===6){_$bt=_$bt.join('');}else{_$hf=_$gv(0,_$_R);}}else if(_$az<12){if(_$az===8){_$dN=0;}else if(_$az===9){_$d9=_$el.length;}else if(_$az===10){_$jx=_$ix[_$ix()]();}else{_$jx=new _$$J(_$dj);}}else{if(_$az===12){ !_$ef?_$_H+=-40:0;}else if(_$az===13){ !_$ef?_$_H+=13:0;}else if(_$az===14){_$$V=_$dj;}else{_$hz=_$bj(20,_$$X());}}}else if(_$az<32){if(_$az<20){if(_$az===16){_$_h=_$$X();}else if(_$az===17){_$ef= !_$$V;}else if(_$az===18){_$l5=_$bj(0);}else{ !_$ef?_$_H+=7:0;}}else if(_$az<24){if(_$az===20){_$dj=_$el.substr(_$dN,_$gZ);_$dN+=_$gZ;return _$dj;}else if(_$az===21){_$ef= !(_$bp+1);}else if(_$az===22){_$hz=_$hz.split(_$k3.fromCharCode(257));}else{_$cP(_$$V,_$ca);}}else if(_$az<28){if(_$az===24){_$_H+=1;}else if(_$az===25){_$dj.push([_$$V[_$jx],_$$V[_$jx+1]]);}else if(_$az===26){_$$V=_$bj(0);}else{_$el="&Źfunction ā(ā){ā[ā(0,8)],8)]=6;ā[4]=3+1;ā[4]=3+1;}function ā){var ā=7;var ā=2;if(ā(7,8)]){if(2){var ā=5;}}ā(7,8)]=ā(2,8)];ā[0]=7+5;ā[0]=ā(7,8)];}function ā(0-6,8)]=2-0;var ā=2;var ā=1+7;ā(0-6,8)]=ā(2,8)];}function ā(4,8)],8)]=ā(3,8)];var ā=7;if(ā[0]=6;}function ā){if(2){ā[0]=6;}ā[0]=6;ā[4]=2;ā[4]=2;}function ā(7,8)];var ā=6;if(ā(3,8)]){if(6){ā[4]=2;}}ā(3,8)]=1;var ā=ā(7,8)];}\x00))))))*+	)\n*))\r)))))))**))\x00))))*)\n+))))))))))))** )!)\")#+$)\r))%";}}else{if(_$az===28){_$bt=_$dj.test(_$jx);}else if(_$az===29){ !_$ef?_$_H+=-25:0;}else if(_$az===30){return;}else{_$ef=_$jx<_$_h;}}}else if(_$az<48){if(_$az<36){if(_$az===32){_$cr=0;}else if(_$az===33){_$bp=_$$X();}else if(_$az===34){_$$$=[];}else{_$ef= !_$$$;}}else if(_$az<40){if(_$az===36){_$_v.jf= !_$bt;}else if(_$az===37){return _$jx;}else if(_$az===38){_$cx=_$$X();}else{ !_$ef?_$_H+=1:0;}}else if(_$az<44){if(_$az===40){_$bt= --_$_R[1];}else if(_$az===41){_$b9=_$$X();}else if(_$az===42){_$jx+=2;}else{_$bT=_$$X();}}else{if(_$az===44){_$gZ.push(_$bt);}else if(_$az===45){_$fQ=_$$X();}else if(_$az===46){_$al[_$jx]=_$bj(0);}else{_$cx=new RegExp('\x37\x34');}}}else{if(_$az<52){if(_$az===48){_$ef= !_$_h;}else if(_$az===49){_$bt= --_$_R[0];}else if(_$az===50){_$gv(6,_$kt,_$gZ);}else{_$kH(_$jx,_$bt);}}else if(_$az<56){if(_$az===52){ !_$ef?_$_H+=38:0;}else if(_$az===53){_$lD=_$$X();}else if(_$az===54){_$jx=0;}else{_$il=_$$X();}}else if(_$az<60){if(_$az===56){ !_$ef?_$_H+=3:0;}else if(_$az===57){_$dj=[];}else if(_$az===58){_$$$[_$jx]=_$bj(0);}else{_$cS=_$$X();}}else{if(_$az===60){_$ef=_$jx<_$cx;}else if(_$az===61){_$lm=_$$X();}else if(_$az===62){_$bt=[];}else{_$_H+=-5;}}}}else{if(_$az<68){if(_$az===64){_$bt=_$bj(0);}else if(_$az===65){_$al=[];}else if(_$az===66){_$_h=_$cx.test(_$jx);}else{_$ef=_$bt;}}else if(_$az<72){if(_$az===68){_$ef=_$jx<_$$V.length;}else if(_$az===69){_$ef= !_$jx;}else if(_$az===70){_$jx=_$bj(0);}else{_$b$=_$$X();}}else{if(_$az===72){for(_$bt=0;_$bt<_$dj;_$bt++ ){_$jx[_$bt]=_$$X();}}else if(_$az===73){_$$9[_$gZ]=_$bt;}else if(_$az===74){_$dj=_$$X();}else{ ++_$bt;}}}}else ;}
    function _$gv(_$_h,_$c$,_$cx){function _$jx(){var _$gZ=[3];Array.prototype.push.apply(_$gZ,arguments);return _$$Z.apply(this,_$gZ);}function _$dj(){var _$gZ=[0];Array.prototype.push.apply(_$gZ,arguments);return _$$Z.apply(this,_$gZ);}var _$bt;var _$bf,_$kt,_$fT=_$_h,_$_f=_$gL[3];while(1){_$kt=_$_f[_$fT++];if(_$kt<55){if(_$kt<16){if(_$kt<4){if(_$kt===0){_$bf=_$cr<64;}else if(_$kt===1){ !_$bf?_$fT+=8:0;}else if(_$kt===2){_$c$.push("while(1){",_$cR[_$cS],"=",_$cR[_$bp],"[",_$cR[_$b9],"++];");}else{_$jh(0,_$lm,_$c$);}}else if(_$kt<8){if(_$kt===4){_$bf=_$b9<0;}else if(_$kt===5){_$c$.push("}");}else if(_$kt===6){ !_$bf?_$fT+=13:0;}else{ !_$bf?_$fT+=3:0;}}else if(_$kt<12){if(_$kt===8){_$bf=_$cr<=0;}else if(_$kt===9){ !_$bf?_$fT+=14:0;}else if(_$kt===10){_$c$.push(";");}else{_$bf=_$cx==0;}}else{if(_$kt===12){_$fT+=-5;}else if(_$kt===13){_$bf=_$l5.length;}else if(_$kt===14){_$c$.push("debu");}else{_$bt=0;}}}else if(_$kt<32){if(_$kt<20){if(_$kt===16){ !_$bf?_$fT+=18:0;}else if(_$kt===17){_$bf=_$$$.length;}else if(_$kt===18){_$bf=_$bt<_$l5.length;}else{_$bf=_$lm<_$$$.length;}}else if(_$kt<24){if(_$kt===20){_$bf=_$ge.length;}else if(_$kt===21){ !_$bf?_$fT+=4:0;}else if(_$kt===22){_$c$.push("){");}else{_$c$.push(_$cR[_$lD],",",_$cR[_$bp],"=",_$cR[_$$n],"[",_$cx,"];");}}else if(_$kt<28){if(_$kt===24){_$bf= !_$c$.length;}else if(_$kt===25){return _$dj;}else if(_$kt===26){_$bf= !_$$V;}else{ !_$bf?_$fT+=-18:0;}}else{if(_$kt===28){_$c$.push("var ",_$cR[_$ge[0]]);}else if(_$kt===29){ !_$bf?_$fT+=1:0;}else if(_$kt===30){ !_$bf?_$fT+=19:0;}else{_$fT+=1;}}}else if(_$kt<48){if(_$kt<36){if(_$kt===32){ !_$bf?_$fT+=2:0;}else if(_$kt===33){return;}else if(_$kt===34){_$c$.push(",",_$cR[_$l5[_$bt]]);}else{_$c$.push("}else ");}}else if(_$kt<40){if(_$kt===36){_$c$.push("if(",_$cR[_$cS],"<",_$lm,"){");}else if(_$kt===37){ !_$bf?_$fT+=-21:0;}else if(_$kt===38){return _$jx;}else{_$c$.push("(function(",_$cR[_$gD],",",_$cR[_$$n],"){var ",_$cR[_$lD],"=0;");}}else if(_$kt<44){if(_$kt===40){_$bf=_$c$&65536;}else if(_$kt===41){_$bt++ ;}else if(_$kt===42){_$bf= !_$cR;}else{_$bf=_$c$.length==0;}}else{if(_$kt===44){ !_$bf?_$fT+=5:0;}else if(_$kt===45){_$c$.push("gger;");}else if(_$kt===46){_$cr-- ;}else{_$c$.push("var ",_$cR[_$il],",",_$cR[_$cS],",",_$cR[_$b9],"=");}}}else{if(_$kt<52){if(_$kt===48){for(_$bt=0;_$bt<_$$V.length;_$bt++ ){_$aj(_$$V[_$bt],_$c$);}for(_$bt=0;_$bt<_$al.length;_$bt++ ){_$kH(_$al[_$bt],_$c$);}}else if(_$kt===49){ !_$bf?_$fT+=6:0;}else if(_$kt===50){_$fT+=-6;}else{_$cr=_$hf();}}else{if(_$kt===52){for(_$bt=1;_$bt<_$ge.length;_$bt++ ){_$c$.push(",",_$cR[_$ge[_$bt]]);}}else if(_$kt===53){_$gT(_$lm,_$$$.length,_$c$);}else{_$c$.push("function ",_$cR[_$bT],"(",_$cR[_$lD]);}}}}else ;}
    
    
    
    function _$$Z(_$dj){var _$bt,_$_h,_$jx=_$dj,_$fT=_$gL[4];while(1){_$_h=_$fT[_$jx++];if(_$_h<4){if(_$_h===0){_$c$=0x3d3f*(_$c$&0xFFFF)+0x269ec3;}else if(_$_h===1){return(_$c$%10)+10;}else if(_$_h===2){return;}else{return 64;}}else ;}}}}}})([],[[0,7,11,6,8,3,5,10,2,4,1,9,],[86,42,58,54,64,80,69,47,48,16,24,74,23,73,60,84,27,35,30,36,49,83,76,40,42,81,33,34,2,14,18,95,79,55,68,88,22,5,67,59,7,66,38,70,34,29,12,60,15,82,52,97,10,51,32,46,21,60,15,82,20,71,51,6,91,28,85,93,98,61,90,17,90,4,45,65,94,26,44,9,19,3,72,37,50,63,1,78,0,57,25,31,62,77,99,92,13,87,90,43,35,90,89,56,39,96,8,53,75,90,41,11,90,90,],[74,11,69,13,18,0,26,57,54,68,56,25,42,63,14,17,52,72,37,30,20,30,27,9,8,74,15,22,70,62,51,6,44,30,41,53,55,45,43,71,59,33,21,12,4,16,34,54,31,56,58,2,63,35,3,23,61,64,73,38,65,54,60,56,46,2,63,1,29,32,7,50,30,30,5,10,28,67,19,40,47,66,48,39,75,24,49,36,30,],[40,32,25,31,38,33,51,11,16,39,43,9,13,49,15,18,7,34,41,12,22,26,6,47,42,21,50,54,43,27,23,17,30,2,4,1,48,20,7,28,52,10,24,37,36,3,35,19,29,53,10,5,33,46,8,44,51,0,32,14,45,33,],[0,1,2,3,2,],]);}

debugger;
var ans = document.cookie;
var test1=document.cookie.toString().split(';')[0].split('=')
console.log(test1);
console.log("len",test1[1].length);
console.log("cookie_setter_begin");
console.log(ans);
console.log('cookie_setter_end');
debugger;
    