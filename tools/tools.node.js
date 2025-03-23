var fs = require('fs')

// 把tools全部拼接起来
function GetCode() {
    var code = "";
    // 注意顺序
    code += fs.readFileSync(`${__dirname}/vm_memory.js`) + "\r\n"
    code += fs.readFileSync(`${__dirname}/vm_print.js`) + "\r\n"
    code += fs.readFileSync(`${__dirname}/vm_error.js`) + "\r\n"
    code += fs.readFileSync(`${__dirname}/vm_proxy.js`) + "\r\n"
    code += fs.readFileSync(`${__dirname}/vm_safefunction.js`) + "\r\n"
    return code;
}

module.exports = {
    GetCode
}