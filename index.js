var fs = require("fs")
const { VM, VMScript } = require("vm2");
const { webcrypto } = require('crypto');  // 引入 webcrypto
const { XMLHttpRequest } = require('xmlhttprequest');  // 引入 XMLHttpRequest 模拟库

// const { JSDOM } = require('jsdom');
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// const window = dom.window;
// global._jsdom_document = window.document; // 保存JSDOM的原始document对象，供后续使用
// global._jsdom_window = window;

var mframe = require("./mframe.node.js");                         // mframe框架完整代码
const codeFile = `${__dirname}/target/2.jsdom检测/code.js`;         // 运行的文件
const userEnvFile = `${__dirname}/target/2.jsdom检测/userEnv.js`;   // 用户自定义环境
const allCode = mframe.GetCode() + "\n" + fs.readFileSync(userEnvFile) + "\n" + fs.readFileSync(codeFile);     // 完整代码

const vm = new VM({
    sandbox: {
        console: console,                // 给沙箱传递"控制台", 否则没有打印
        crypto: webcrypto,               // 注入 crypto
        XMLHttpRequest: XMLHttpRequest,  // 注入 XMLHttpRequest
        // _jsdom_document: window.document, // 传递JSDOM的document到沙箱内部
        // _jsdom_window: window,           // 传递JSDOM的window到沙箱内部
    },
});

const script = new VMScript(allCode, `${__dirname}/临时调试文件.js`); // 会生成一个虚拟文件, 用于debugger调试

debugger;
try {
    vm.run(script);
} catch (e) {
    console.log(`\n出现问题, 本次执行的完整代码已经写入 ${__dirname}/log.js`);
    console.error(e);
} finally {
    fs.writeFileSync(`${__dirname}/log.js`, allCode); // 写入本次执行的完整代码
}
debugger; 