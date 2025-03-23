/**
 * 注意: 只获取实例属性
 * @param {Object} targetObj 实例
 * @param {string} varName 一般情况和 实例名字相同
不建议用!!!!!!
不建议用!!!!!!
不建议用!!!!!! 为什么? 见注意

输入:
    console.log(generateObjectCode(window, 'window'));
示例输出: [部分]
    window["window"]=mframe.proxy(new (class Window {}));
    window["self"]=mframe.proxy(new (class Window {}));
    window["scrollbars"]=mframe.proxy(new (class BarProp {}));
    window["statusbar"]=mframe.proxy(new (class BarProp {}));
    window["toolbar"]=mframe.proxy(new (class BarProp {}))
    window["closed"]=false;
    window["devicePixelRatio"]=1.125;
    window["onkeypress"]=null;
    window["alert"]=function alert() { debugger; };mframe.safefunction(window["alert"]);
原理:
    Object.entries(实例) 可以获取该实例下的所有 key value
其他:
    可以将 console.log ==> copy 直接写入剪切板
注意: 
    因为: 类可能要自己去补, 而不是简单的代理, 当然,你也可以说,先代理着,如果真的有用到这个类(日志有打印这个类) 再去补可ok
    但一定一定一定一定要注意, 有些你已经补好的类要, 一定要记得手动改, 切记要发生`window["window"]=mframe.proxy(new (class Window {}));`这样的情况
    ```不理解的去试下这个代码段
    var Window1 = function Window1() {
    };
    Window1['k1']='v1'
    var Window1 =class Window1 {} // 会被异化掉的~

    Window1['k1']
    ```
    为此,我把所有的类都加了个_balbal, 避免让Window的付出被异化掉了,Q~Q
    `window["window"]=mframe.proxy(new (class Window {}));`==>`window["window"]=mframe.proxy(new (class Window_balbal {}));`
 */
function generateObjectCode(targetObj, varName) {
    let code = "";

    code += `//===================${varName} 的实例属性 START===================\n`;

    for (const [key, value] of Object.entries(targetObj)) {
        let line = "";
        // 处理 null 值
        if (value === null) {
            line = `${varName}["${key}"]=null;`;
        }
        // 处理不同类型
        else {
            const type = typeof value;
            if (type === 'string') {
                line = `${varName}["${key}"]=${JSON.stringify(value)};`;
            }
            else if (type === 'function') {
                const funcName = value.name || 'anonymous';
                line = `${varName}["${key}"]=function ${funcName}() { debugger; };mframe.safefunction(${varName}["${key}"]);`;
            }
            else if (value instanceof Object) {
                const className = value.constructor?.name || 'Object';
                line = `${varName}["${key}"]=mframe.proxy(new (class ${className}_balbal {}));`;
            }
            else {
                line = `${varName}["${key}"]=${value};`;
            }
        }
        code += line + '\n';
    }
    code += `//================ ↑↑↑${varName} 的实例属性 END↑↑↑ ================\n`;
    return code;
}


console.log(generateObjectCode(window, 'window'));