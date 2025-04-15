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
location.href = 'https://ec.chng.com.cn/channel/home/#/';
location.origin = 'https://ec.chng.com.cn';
location.host = 'ec.chng.com.cn';
location.protocol = 'https:';
location.hostname = 'ec.chng.com.cn';
location.port = '';
location.pathname = '/channel/home/';
location.search = '';
location.hash = '#/';

location.ancestorOrigins= {},
///////////////////////////////////////////////////

location = mframe.proxy(location)