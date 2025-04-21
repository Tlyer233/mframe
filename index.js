var fs = require("fs")                   // fs读取文件
var mframe = require("./mframe.node.js");// 我的环境框架
const { VM, VMScript } = require("vm2"); // vm2纯净V8框架
// 可选模块
// const { webcrypto } = require('crypto');               // 引入 webcrypto
const { XMLHttpRequest } = require('xmlhttprequest');  // 引入 XMLHttpRequest 模拟库

const { JSDOM } = require('jsdom');


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
`); //这个不能乱写, 影响getElementsByTagName检测




// 用户配置➕组装环境代码
var userConfig = {
    proxy: true, // 是否开启代理
}

const codeFile = `${__dirname}/target/10.兰州交通大学招标(瑞6)/code.js`;             // 需要运行的目标文件

const allCode = mframe.GetCode(userConfig) + fs.readFileSync(codeFile);     // 完整代码

const vm = new VM({
    sandbox: {
        console: console,                     // 给沙箱传递"控制台", 否则没有打印
        XMLHttpRequest: XMLHttpRequest,       // 注入 XMLHttpRequest
        fetch: fetch,                         // 注入 fetch
        Request: Request,               // 注入 Request
        jsdomDocument: dom.window.document,   // 传递JSDOM的document到沙箱内部
        jsdomWindow: dom.window,   // 传递JSDOM的window到沙箱内部

        /** Crypto*/
        webcrypto: crypto,                    // 注入 crypto
        Uint8Array: Uint8Array,               // 注入原生的 Uint8Array 构造函数
        Uint16Array: Uint16Array,             // 
        Uint32Array: Uint32Array,             // 
    },
});

const script = new VMScript(allCode, `${__dirname}/临时调试文件.js`); // 会生成虚拟临时文件,用于debugger调试

debugger;
try {
    vm.run(script);
} catch (e) {
    console.log(`\n出现问题:`);
    console.error(e);
} finally {
    console.log(`\n本次执行的完整代码已经写入 ${__dirname}/log.js`);
    fs.writeFileSync(`${codeFile.substring(0, codeFile.lastIndexOf('/'))}/log.js`, allCode);
}
debugger; 
