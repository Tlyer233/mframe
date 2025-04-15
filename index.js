var fs = require("fs")                   // fs读取文件
var mframe = require("./mframe.node.js");// 我的环境框架
const { VM, VMScript } = require("vm2"); // vm2纯净V8框架
// 可选模块
const { webcrypto } = require('crypto');               // 引入 webcrypto
const { XMLHttpRequest } = require('xmlhttprequest');  // 引入 XMLHttpRequest 模拟库

const { JSDOM } = require('jsdom');
const dom = new JSDOM(`
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta content="7eUUCvQXGFpbgGenJQlUn5JhQdmFZO2ICWnkOlJEJAA" r="m">
        
        <script type="text/javascript" r="m">$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=33384;$_ts.cd="qx9drrAltA7qxGAbrAgKcaqbqn3qkf3hqc37xGQimP3mrAVbqqgPr13oxcElxGVOcqAjxGqiEGVhqqaqxGlimG7qxGQbrqgKxGW9EGAbrGgPqa7qxGAbrAgKhGVOcAA3caqLDqLbragPrclqxGVbqGgKxGqbqsqOcGAtcaqbr13ckf3hqc3qxGliHc3lkPEmcaqbqP3kkf3bUPW2bAlCWAEmWOKREef3BQuLhVXGh0YqC4wm9.2njnGNksOm.sBMqhr9P1ALqqAuraArbcaq_m2Zx9UTQlxHVbleMIwTFkSLpbeKu9eIWbW2H2.6wbSNhb2SMIVBMvrXFnfB4De7tKSnFDCTMUYNM2LLEe30JYpnVbYO.ONuY9TEWOvTwlei1v3biZxzwK2XtCN0eKZ7F6w.Fc66wbSNhb2SMIVBMvrXFT9zXTxlMmJtQUkAwTpHQvecWQJ9iUw2plVOLTfXQDy.tDd7MCaNMoxLMMYzwK2XtCN0eKZ7F6w.FmnTEKJbFl2VVF9T1CmfQlRiZDRsIDWNAlc4iYz.wCzLhIwCMD9XFUmze1eXQDy.tDd7MCaNMoxLMQp5hDz6FCfQ9aHF3VaCQkU5YDg5FKYP1dT2WKqy1Tp6.U2TWT3ZJKhsYCwCATqdwWmDpK2uVT3_nOYtWkJEQYsusC2GiVZesHVnKkpDsCY.ZufxpDyYI2B5WVeQVkldAdpUMCepWkmlgYzbtuAaWukgJkA.FoAd8QfLF6pDpDSPClwrtuAaWukgJkA.FoAdszmc1UTgF0S6TuNJHOpOMYBq3DxZWCECw_xAMle9pvpqdCymp6EZJ2k73mwBJ9rSsQ21hOWTWkYG.OQXM6lZI2hjw2NHssex37f4hOWTWkYG.OQXM6lorqD3WaqlWAQAF8T6Qo3gJkqa.Oq0WkAnHkXzJuWmrkluJjfPJaVrWsWTbA9SJsL0WuDjWs9uqGWaWFqTqrYt0esIrN5BOGO7MUc4ylf0qfIVDmnt2Uc8DaK3bGWmraVkrcoy7ozP_cNkAOIs3hAwAag.MZ5tFmmJxhQ.QXbTPtoqWx9xWua0WO0y.sluHAEDJqDsWOQSJOWuWF7TWqVNV1NadlY.M0RYW2bGKCN13TqSQ5GaJmw4sDrg5lw.AmE6RYkE1meZFmevYN9kqqACraVSbAE6rH9aIP6g3bWN3CNChIfaM12OQK0z5Cx.tKrbQc64MvqN3DyjhILB3CpGtCwn_PeOwvA.RC40hCJTQPzG3i0BRD2XtCrX5Pe9Fv3.3D4_8nSG8bELRHR6hDJXRPfveKq73CTNtDICwnSOMK2ahIyv3P22MbEzdv973bNLtDvTQnSzQvQLF8TGhDSfFcfLeCL7MDSftDO6QcS7QKGLF5LBFbpatCySdPejwKwGtDBjMDgNFDRn3hYBFKQXFCzbzKyfw1yjMKKTMvqShbN03hYXJDAXFvAnzKya3PyjM68TMbefhbN.w4YXFKGXFvpSzKyuMcyjwDs5hCevFcz.3XlBMCx2tCzz5neBFKQ.F6Udh6rZhvwe3.Yu3U3XwCJ7zUJaFcy6wotTQ6rShvwGR4YuQom_t6pBdPeaMDl.wD6ah6rCRPzTFHZBQUm_t6RGzUmztUrbF16.MvRvhvYfR.YSRU3XwUrvzUmfwny0Fn6j3KaNQKmZh8N0312SQDEz_vYvtUm5wn6z3vENwbR5h8TjRP2CMbxvzUwBw6rPFvKTw6fShvJaR4YTQClXQUwnzUYuQPySIDKTwDeORczuMBe2WP2TFvEz4byftUYbQP6XQ6WN8bYNh8muM12_F6QzgKeuI1ydwCCT8CTNhv0L8druhDpnMcfSeKNuQ1yXwDcRqaqrU1JMKx9oUnmOFaAmSPwOJAEkKnU41GqoJOglq_0nqqAu";if($_ts.lcd)$_ts.lcd();</script>
        <script type="text/javascript" charset="utf-8" src="/H9Ml1X1DHajj/BmTojS75ExXf.6771a74.js" r="m"></script>
    </head>
</html>
`); //这个不能乱写, 影响getElementsByTagName检测

// 用户配置➕组装环境代码
var userConfig = {
    proxy: true, // 是否开启代理
}

const codeFile = `${__dirname}/target/6.华瑞(瑞数)/code.js`;             // 需要运行的目标文件
const allCode = mframe.GetCode(userConfig) + fs.readFileSync(codeFile);     // 完整代码

const vm = new VM({
    sandbox: {
        console: console,                     // 给沙箱传递"控制台", 否则没有打印
        crypto: webcrypto,                    // 注入 crypto
        XMLHttpRequest: XMLHttpRequest,       // 注入 XMLHttpRequest
        // fetch: fetch,                         // 注入 fetch
        // Request: Request,               // 注入 Request
        jsdomDocument: dom.window.document,   // 传递JSDOM的document到沙箱内部
        jsdomWindow: dom.window,   // 传递JSDOM的window到沙箱内部

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
