var fs = require("fs")

// mframe框架工具模块
var vmtools = require("./tools/tools.node.js")
var htmlelements = require("./browser/HTMLElements/htmlelements.node.js")


function getCommon(includeCrypto = true) {
    code = "";
    // 注意加载顺序!!!!

    if (includeCrypto) {
        /**Node环境中不需要的 */
        code += fs.readFileSync(`${__dirname}/browser/SubtleCrypto.js`) + "\r\n";
        code += fs.readFileSync(`${__dirname}/browser/Crypto.js`) + "\r\n";
    }
    code += fs.readFileSync(`${__dirname}/browser/Storage.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/EventTarget.js`) + "\r\n"; // EventTarget在这里
    code += fs.readFileSync(`${__dirname}/browser/ScreenOrientation.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Screen.js`) + "\r\n";

    /**window*/
    code += fs.readFileSync(`${__dirname}/browser/WindowProperties.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Window.js`) + "\r\n";

    /**Location */
    code += fs.readFileSync(`${__dirname}/browser/Location.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/IDBFactory.js`) + "\r\n";

    /**Navigator */
    code += fs.readFileSync(`${__dirname}/browser/NetworkInformation.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Navigator.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/MimeType.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Plugin.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/PluginArray.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/MimeTypeArray.js`) + "\r\n"; //  一定要再PluginArray下面


    /**History */
    code += fs.readFileSync(`${__dirname}/browser/History.js`) + "\r\n";


    /**DOM: 如果注入jsdom的document, 以下DOM相关的必须注释 */

    // EventTarget->Node->Element->HTMLElement->HTMLXXXElement
    code += fs.readFileSync(`${__dirname}/browser/Node.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Element.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/HTMLElement.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Event.js`) + "\r\n";

    /**HTMLElements: DOM元素 */
    code += htmlelements.GetCode() + "\r\n";

    /**中间DOM元素 */
    code += fs.readFileSync(`${__dirname}/browser/HTMLDocument.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Text.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/DOMImplementation.js`) + "\r\n";

    /**Document */
    code += fs.readFileSync(`${__dirname}/browser/Document.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/HTMLCollection.js`) + "\r\n";

    /**其他 */
    // 防止console.log被网址代码hook掉; 对内可以用mframe.console.mute();/unmute()控制是否开启
    code += `// 2.防止console.log被篡改\r\n`;
    code += `const consoleGuard=(()=>{const virginConsole=Object.create(Object.getPrototypeOf(console));Object.assign(virginConsole,console);let isMuted=false;const mute=()=>isMuted=true;const unmute=()=>isMuted=false;const handler={get(target,prop){if(isMuted&&['log','warn','error'].includes(prop)){return()=>{}}return Reflect.get(target,prop)},set(target,prop,value){if(prop==='log'){return true}return Reflect.set(target,prop,value)}};return{proxy:new Proxy(console,handler),controller:{mute,unmute}}})();mframe.console=consoleGuard.controller;Object.defineProperty(global,'console',{value:consoleGuard.proxy,writable:false,configurable:false});\r\n`;

    return code;
}


function GetCode(userConfig) {
    var code = "";
    // STEP1:引入mframe框架工具模块
    code += vmtools.GetToolsCode() + "\r\n";

    // STEP2:用户配置
    for (var item in userConfig) {
        const value = typeof userConfig[item] === 'object' ?
            JSON.stringify(userConfig[item]) :
            userConfig[item];
        code += "mframe.memory.config." + item + "=" + value + "\r\n";
    }

    // STEP3:引入mframe浏览器环境相关
    code += getCommon();


    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "debugger;\r\n";
    return code;
}
function getNodeSpecialCode() {
    var code = "";
    code += "// 1.用于在Node环境下代理crypto\r\n"
    code += "Object.defineProperty(window, 'crypto', { get: function () {return require('crypto');}});\r\n";
    return code;
}

function GetNodeEnvCode(userConfig) {
    var code = "";
    // STEP1:引入mframe框架工具模块
    code += vmtools.GetToolsCode() + "\r\n";

    // STEP2:用户配置
    for (var item in userConfig) {
        const value = typeof userConfig[item] === 'object' ?
            JSON.stringify(userConfig[item]) :
            userConfig[item];
        code += "mframe.memory.config." + item + "=" + value + "\r\n";
    }
    // STEP2.5: 支持node环境
    code += fs.readFileSync(`${__dirname}/node_env_inject.js`) + "\r\n";

    // STEP3:引入mframe浏览器环境相关（不包含加密相关文件）
    code += getCommon(includeCrypto = false);

    // STEP3.5:获取node中特殊需要注入的代码
    code += getNodeSpecialCode();
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";

    code += "debugger;\r\n";
    return code;
}


module.exports = {
    GetCode,
    GetNodeEnvCode
}