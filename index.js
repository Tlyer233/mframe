var fs = require("fs")                   // fs读取文件
var mframe = require("./mframe.node.js");// 我的环境框架
const { VM, VMScript } = require("vm2"); // vm2纯净V8框架
// 可选模块
const { webcrypto } = require('crypto');               // 引入 webcrypto
const { XMLHttpRequest } = require('xmlhttprequest');  // 引入 XMLHttpRequest 模拟库

// const { JSDOM } = require('jsdom');
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// const window = dom.window;
// global._jsdom_document = window.document; // 保存JSDOM的原始document对象，供后续使用
// global._jsdom_window = window;

// 用户配置➕组装环境代码
var userConfig = {
    proxy: false, // 是否开启代理
}

const codeFile = `${__dirname}/target/3.测试mframe框架/code.js`;             // 需要运行的目标文件
const allCode = mframe.GetCode(userConfig) + fs.readFileSync(codeFile);     // 完整代码

const vm = new VM({
    sandbox: {
        console: console,                     // 给沙箱传递"控制台", 否则没有打印
        crypto: webcrypto,                    // 注入 crypto
        XMLHttpRequest: XMLHttpRequest,       // 注入 XMLHttpRequest
        // _jsdom_document: window.document,  // 传递JSDOM的document到沙箱内部
        // _jsdom_window: window,             // 传递JSDOM的window到沙箱内部
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