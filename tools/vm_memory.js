var mframe = {};

/** 为什么要这个??
 * 解决重名的问题, window.print可能会重名,但window.mframe.print一定不会
 * mframe的内存
 */
// 框架内存 
mframe.memory = {
    // 相关配置
    config: {
        print: false, // 是否打印日志
        proxy: true, // 是否开启代理
    }

    
};


mframe.memory.htmlelements = {}
