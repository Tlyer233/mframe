var fs = require("fs")

// mframe框架工具模块
var vmtools = require("./tools/tools.node.js")
var htmlelements = require("./browser/HTMLElements/htmlelements.node.js")

function GetCode(userConfig) {
    var code = "";
    // STEP1:引入mframe框架工具模块
    code += vmtools.GetToolsCode() + "\r\n";

    // STEP2:用户配置
    for (var item in userConfig) {
        code += "mframe.memory.config." + item + "=" + userConfig[item] + "\r\n";
    }

    // STEP3:引入mframe浏览器环境相关
    // 注意加载顺序!!!!
    code += fs.readFileSync(`${__dirname}/browser/Crypto.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Storage.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Screen.js`) + "\r\n";

    /**window*/
    code += fs.readFileSync(`${__dirname}/browser/EventTarget.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/WindowProperties.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/browser/Window.js`) + "\r\n";

    /**Location */
    code += fs.readFileSync(`${__dirname}/browser/Location.js`) + "\r\n";

    /**Navigator */
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

    /**HTMLElements: DOM元素 */
    code += htmlelements.GetCode() + "\r\n";
    /**Document */
    code += fs.readFileSync(`${__dirname}/browser/document.js`) + "\r\n";

    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "//=====================================以下为运行代码===============================\r\n";
    code += "debugger;\r\n";
    return code;
}

module.exports = {
    GetCode
}