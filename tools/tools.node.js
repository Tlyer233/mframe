var fs = require('fs')

// 把tools全部拼接起来
function GetToolsCode() {
    var code = "";
    // 注意顺序
    code += fs.readFileSync(`${__dirname}/vm_memory.js`) + "\r\n"
    code += fs.readFileSync(`${__dirname}/vm_error.js`) + "\r\n"
    code += fs.readFileSync(`${__dirname}/vm_proxy.js`) + "\r\n"
    code += fs.readFileSync(`${__dirname}/vm_safefunction.js`) + "\r\n"
    return code;
}

module.exports = {
    GetToolsCode
}