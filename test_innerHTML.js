// 测试innerHTML功能
console.log("开始测试innerHTML功能");

// 创建一个div元素
var div = document.createElement("div");
console.log("创建的div元素:", div);

// 设置innerHTML
div.innerHTML = "<a href='#'>测试链接</a>";
console.log("设置innerHTML后:", div.innerHTML);

// 再次修改innerHTML
div.innerHTML = "<span>新内容</span>";
console.log("再次修改innerHTML后:", div.innerHTML);

// 测试嵌套元素
var container = document.createElement("div");
container.innerHTML = "<div id='inner'>内部div</div>";
console.log("容器innerHTML:", container.innerHTML);

// 测试querySelector
var inner = container.querySelector("#inner");
console.log("通过querySelector找到内部元素:", inner ? "是" : "否");
if (inner) {
    console.log("内部元素的innerHTML:", inner.innerHTML);
}

// 测试getAttribute和setAttribute
var link = document.createElement("a");
link.setAttribute("href", "https://example.com");
link.innerHTML = "示例链接";
console.log("链接href属性:", link.getAttribute("href"));
console.log("链接innerHTML:", link.innerHTML);

console.log("测试完成"); 