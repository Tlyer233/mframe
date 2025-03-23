var Location = function () {
    debugger;
    throw new TypeError('Location 不允许被new')
}; mframe.safefunction(Location);

Object.defineProperties(Location.prototype, {
    [Symbol.toStringTag]: {
        value: "Location",
        configurable: true,
    }
});
location = {}; //针对有大小写的, Location/location, Window/window
location.__proto__ = Location.prototype;

///////////////////////////////////////////////////
location.href = 'https://union.jd.com/proManager/index?pageNo=1'; // TODO是否会检测, 上传表单的page和这里pageNo呢??? 
location.origin = 'https://union.jd.com';
location.host = 'union.jd.com'



///////////////////////////////////////////////////

location = mframe.proxy(location)