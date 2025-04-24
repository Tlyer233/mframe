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
            objLength: 20,      // [方法/属性]    对象(名)长度
            propertyLength: 30, // [方法/属性]    属性(名)长度
            typeLength: 10,     // [属性]         方法类型get/set长度
            inputLength: 50,    // [vm_log][方法] 传入
            resLength: 30,      // [vm_log][方法] 返回值
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

        // (function(){const props=['userAgent','language','languages','appVersion','platform','hardwareConcurrency','webdriver','appName','appCodeName','deviceMemory','maxTouchPoints','onLine','pdfViewerEnabled','vendor','vendorSub','product','productSub'];const result=props.map(prop=>`${prop}:${JSON.stringify(navigator[prop])},`).join('\n');copy(result)})();
        initNavigator: {
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            language: "zh-CN",
            languages: ["zh-CN"],
            appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            platform: "Win32",
            hardwareConcurrency: 16,
            webdriver: false,
            appName: "Netscape",
            appCodeName: "Mozilla",
            deviceMemory: 8,
            maxTouchPoints: 20,
            onLine: true,
            pdfViewerEnabled: true,
            vendor: "Google Inc.",
            vendorSub: "",
            product: "Gecko",
            productSub: "20030107",
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