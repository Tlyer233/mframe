// [Tool]代理方法
/**
 * 对某个"东西"进行代理Proxy后, 以后是使用"代理对象", 而不是原对象
 * eval(`${o} = new Proxy(${o}, ${handler})`); 帮你完成 window = proxy("window")的操作
 * @param {需要代理的对象(str)} o 
一. 输出彩色文本到控制台
console.log('\x1b[33m%s\x1b[0m', '这是黄色的文字'); // 输出黄色文本
console.log('\x1b[31m%s\x1b[0m', '这是红色的文字'); // 输出红色文本
console.log('\x1b[36m%s\x1b[0m', '这是青色的文字'); // 输出青色文本
console.log('\x1b[32m%s\x1b[0m', '这是绿色的文字'); // 输出绿色文本
*/

mframe.proxy = function (o) {
    if (mframe.memory.config.proxy == false) return o;

    return new Proxy(o, {
        set(target, property, value, receiver) {
            // 特殊属性直接通过原对象处理
            if (property === 'prototype' || property === 'constructor') {
                return Reflect.set(target, property, value);
            }

            console.log(`方法:set 对象 ${target.constructor.name} 属性 ${property} 值类型 ${typeof value}`);
            return Reflect.set(target, property, value, receiver);
        },
        get(target, property, receiver) {
            // 特殊属性直接通过原对象处理
            if (property === 'prototype' || property === 'constructor') {
                return Reflect.get(target, property, receiver);
            }

            const value = Reflect.get(target, property, receiver);
            const displayValue = typeof value === 'symbol' ? `[Symbol: ${value.description}]` : value;

            if (value === undefined)
                console.log(`方法:\x1b[32mget\x1b[0m 对象 ${target.constructor.name} 属性 ${String(property)} 值类型 \x1b[31m${typeof value}\x1b[0m`);
            else
                console.log(`方法:\x1b[32mget\x1b[0m 对象 ${target.constructor.name} 属性 ${String(property)} 值类型 ${typeof value}`);

            return value;
        }
    });
}

