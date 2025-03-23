/**
 * HTMLElements文件夹下的所有东西, 都不能被new,
 * 只能通过document.createElement("DIV") 这样来创建
 * 会返回HTMLDivElement对象
 * 
 * 所以:
 * STEP1: 我们把这个东西放到 `mframe.memory.htmlelements = {} // HTMLElements的内存` 内存中
 * STEP2: 在document.createElement(tagName)中, 通过传入的 tagName
 * STEP3: mframe.memory.htmlelements[tagName]的方式获取到对应的 位于HTMLElements文件夹下的 对应的tagName对象
 * ...进一步讲解: 见HTMLDivElement
 */

var fs = require('fs')

// 把tools全部拼接起来
function GetCode() {
    var code = "";

    // EventTarget->Node->Element->HTMLElement->HTMLXXXElement
    // 该目录下, 只补充 HTMLXXXElement
    code += fs.readFileSync(`${__dirname}/HTMLDivElement.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/HTMLScriptElement.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/HTMLCanvasElement.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/HTMLHeadElement.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/HTMLBodyElement.js`) + "\r\n";
    code += fs.readFileSync(`${__dirname}/HTMLHtmlElement.js`) + "\r\n";

    return code;
}

module.exports = {
    GetCode
}