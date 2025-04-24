/**必要模块 */
var fs = require("fs")                    // fs读取文件
var mframe = require("./mframe.node.js"); // 我的环境框架
const { VM, VMScript } = require("vm2");  // vm2纯净V8框架
const { JSDOM } = require('jsdom');       // mframe必须基于jsdom
/**可选模块 */
const { XMLHttpRequest } = require('xmlhttprequest');  // 引入 XMLHttpRequest 模拟库
const dom = new JSDOM(` 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta id="LqoV0dyCu4zp" content="JIZD1fHlq_._WyrwMllmMch1OzOPDIqxxZsvR03sEoDyiWhPlMGnqQeJXMNuW3YDvUUbs2WRsT3" r='m'>
        <!--[if lt IE 9]><script r='m'>document.createElement("section")</script><![endif]-->
        <script type="text/javascript" r='m'></script>
        <script type="text/javascript" charset="utf-8" src="/uXDCTVkcv724/t8MvF5VukNwZ.303c6e9.js" r='m'></script>
    </head>
    <body></body>
</html>
`);




/**初始化不同网站环境 */
var userConfig = {
    nodeEnv: true, // true:window=global, false:window=this
    proxy: true,   // 是否开启代理
    log: {  // 打印日志的长度
        objLength: 20,      // [方法/属性]    对象(名)长度
        propertyLength: 30, // [方法/属性]    属性(名)长度
        typeLength: 10,     // [属性]         方法类型get/set长度
        inputLength: 50,    // [vm_log][方法] 传入
        resLength: 30,      // [vm_log][方法] 返回值
    },
    // 初始化网站Location
    initLocation: { // copy(window.location);
        "ancestorOrigins": {},
        "href": "https://www.fcbox.com/pages/user/login.html",
        "origin": "https://www.fcbox.com",
        "protocol": "https:",
        "host": "www.fcbox.com",
        "hostname": "www.fcbox.com",
        "port": "",
        "pathname": "/pages/user/login.html",
        "search": "",
        "hash": ""
    },
    // 初始化网站navigator
    initNavigator: { // (function(){const props=['userAgent','language','languages','appVersion','platform','hardwareConcurrency','webdriver','appName','appCodeName','deviceMemory','maxTouchPoints','onLine','pdfViewerEnabled','vendor','vendorSub','product','productSub'];const result=props.map(prop=>`${prop}:${JSON.stringify(navigator[prop])},`).join('\n');copy(result)})();
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        language: "zh-CN",
        languages: ["zh-CN", "en", "zh"],
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
    }
}

const codeFile = `${__dirname}/target/13.云南公共服务/code.js`;                        // 需要运行的目标文件
const allCode = mframe.GetCode(userConfig) + fs.readFileSync(codeFile);           // VM2环境  完整代码
syncNodeEnvInject()
const nodeEnvCode = mframe.GetNodeEnvCode(userConfig) + fs.readFileSync(codeFile);// nodeEnv完整代码

const vm = new VM({
    sandbox: {// 左侧为沙箱中的变量名称
        /**沙箱必须注入 */
        console: console,                     // 给沙箱传递"控制台", 否则没有打印
        jsdomDocument: dom.window.document,   // 传递JSDOM的document到沙箱内部
        jsdomWindow: dom.window,              // 传递JSDOM的window到沙箱内部
        /**可选 */
        // 1.请求
        XMLHttpRequest: XMLHttpRequest, // 注入 XMLHttpRequest
        fetch: fetch,                   // 注入 fetch
        Request: Request,               // 注入 Request
        // 2.Crypto
        webcrypto: crypto,              // 注入 crypto
    },
});

const script = new VMScript(allCode, `${__dirname}/临时调试文件.js`); // 会生成虚拟临时文件,用于debugger调试

debugger;
try {
    vm.run(script);
} catch (e) {
    console.log(`\n出现问题:`);
    console.log(e);
} finally {
    console.log(`\n本次执行的完整代码已经写入 ${__dirname}/log.js`);
    fs.writeFileSync(`${codeFile.substring(0, codeFile.lastIndexOf('/'))}/log.js`, allCode);
    fs.writeFileSync(`${codeFile.substring(0, codeFile.lastIndexOf('/'))}/nodeEnvLog.js`, nodeEnvCode);
}
debugger;


/** [Tools]同步dom实例化的文档结构
 * 为了确保VM2和nodeEnvLog用的同一个dom文档结构进行的 实例化, 需要使用该方法替换文件
 */
function syncNodeEnvInject() {
    // 更新nodeEnv的环境
    const nodeEnvInject = fs.readFileSync(`${__dirname}/node_env_inject.js`, 'utf-8');
    const indexContent = fs.readFileSync(`${__dirname}/index.js`, 'utf-8');

    // 使用正则从index.js文件本身提取DOM内容
    const domRegex = /const dom = new JSDOM\(`\s*([\s\S]*?)`\);/;
    const domMatch = indexContent.match(domRegex);
    const domContent = domMatch ? domMatch[1].trim() : '<html><head></head><body></body></html>';

    // 更新node_env_inject.js文件
    const updatedNodeEnvInject = nodeEnvInject.replace(
        /const dom = new JSDOM\(`[\s\S]*?`\);/,
        `const dom = new JSDOM(\`${domContent}\`);`
    );

    // 写入更新后的node_env_inject.js
    fs.writeFileSync(`${__dirname}/node_env_inject.js`, updatedNodeEnvInject);
}