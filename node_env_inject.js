//////////////////当前环境为node环境/////////////////////////
//////////////////当前环境为node环境/////////////////////////
//////////////////当前环境为node环境/////////////////////////

const { XMLHttpRequest } = require('xmlhttprequest');  // 引入 XMLHttpRequest 模拟库
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1.0" name="description" content="A comprehensive example of meta attributes." name="keywords" content="HTML, Meta, Attributes" name="author" content="Kimi" http-equiv="refresh" content="30">
        <script></script>
        <link rel="icon" href="//www.jd.com/favicon.ico" type="image/x-icon">
    </head>
    <body>
        <div class="theup-submit-text">感谢您的反馈</div>
    </body>
</html>`);

mframe.memory.jsdom = {};
mframe.memory.jsdom.window = dom.window;
mframe.memory.jsdom.document = dom.window.document;


//////////////////当前环境为node环境/////////////////////////
//////////////////当前环境为node环境/////////////////////////
//////////////////当前环境为node环境/////////////////////////