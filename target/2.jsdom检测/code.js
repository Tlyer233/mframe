

console.log("ok");
console.log(require);
console.log(process);


// 检测是否使用了jsdom的简洁代码
function detectJSDOM() {
    const results = {
      conclusion: "未检测到JSDOM",
      tests: {}
    };
  
    try {
      // 测试1: 检查navigator.userAgent
      results.tests["测试1: navigator.userAgent"] = "未通过";
      if (typeof navigator !== 'undefined') {
        const ua = navigator.userAgent || "";
        if (ua.includes('Node.js') || ua.includes('jsdom')) {
          results.tests["测试1: navigator.userAgent"] = "通过";
          results.conclusion = "检测到JSDOM";
        }
      }
  
      // 测试2: 检查window特殊属性
      results.tests["测试2: window特殊属性"] = "未通过";
      if (typeof window !== 'undefined') {
        if (window.name === 'nodejs' || 
            Object.prototype.toString.call(window).includes('jsdom')) {
          results.tests["测试2: window特殊属性"] = "通过";
          results.conclusion = "检测到JSDOM";
        }
      }
  
      // 测试3: 检查document特殊属性
      results.tests["测试3: document特殊属性"] = "未通过";
      if (typeof document !== 'undefined') {
        if (document._documentElement || 
            document._defaultView || 
            document._global ||
            document.defaultView && document.defaultView._resourceLoader) {
          results.tests["测试3: document特殊属性"] = "通过";
          results.conclusion = "检测到JSDOM";
        }
      }
  
      // 测试4: 检查全局对象
      results.tests["测试4: 全局对象特征"] = "未通过";
      if (typeof window !== 'undefined' && typeof process !== 'undefined' && process.versions && process.versions.node) {
        // 同时存在浏览器和Node环境的特征
        results.tests["测试4: 全局对象特征"] = "通过";
        results.conclusion = "检测到JSDOM";
      }
  
      // 测试5: 检查DOM实现限制
      results.tests["测试5: DOM实现限制"] = "未通过";
      if (typeof document !== 'undefined') {
        try {
          // JSDOM中某些DOM API不完整或有限制
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context || typeof context.fillText !== 'function') {
            results.tests["测试5: DOM实现限制"] = "通过";
            results.conclusion = "检测到JSDOM";
          }
        } catch (e) {
          // 某些DOM API在JSDOM中可能会抛出错误
          results.tests["测试5: DOM实现限制"] = "通过 (抛出错误)";
          results.conclusion = "检测到JSDOM";
        }
      }
  
      // 测试6: 检查jsdom特有的全局变量
      results.tests["测试6: jsdom特有全局变量"] = "未通过";
      if (typeof jsdom !== 'undefined' || 
          typeof JSDOM !== 'undefined' || 
          (typeof window !== 'undefined' && window.JSDOM)) {
        results.tests["测试6: jsdom特有全局变量"] = "通过";
        results.conclusion = "检测到JSDOM";
      }
    } catch (e) {
      results.error = "检测过程中发生错误: " + e.message;
    }
  
    return results;
  }
  
  // 执行检测并输出结果
  const jsdomDetectionResults = detectJSDOM();
  console.log("JSDOM检测结果:");
  console.log("总结:", jsdomDetectionResults.conclusion);
  console.log("详细测试:");
  for (const [test, result] of Object.entries(jsdomDetectionResults.tests)) {
    console.log(`- ${test}: ${result}`);
  }
  if (jsdomDetectionResults.error) {
    console.log(jsdomDetectionResults.error);
  }