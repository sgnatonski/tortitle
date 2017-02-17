"use strict";
var Cache = require("node-cache");
var es6_promise_1 = require("es6-promise");
Cache.prototype["getAsync"] = function (key) {
    var _this = this;
    return new es6_promise_1.Promise(function (resolve, reject) {
        _this.get(key, function (error, value) {
            if (error)
                reject(error);
            else
                resolve(value);
        });
    });
};
Cache.prototype["setAsync"] = function (key, value, ttl) {
    var _this = this;
    return new es6_promise_1.Promise(function (resolve, reject) {
        _this.set(key, value, ttl, function (error, success) {
            if (error)
                reject(error);
            else
                resolve(success ? value : null);
        });
    });
};
var cache = new Cache({ stdTTL: 60, checkperiod: 120 });
module.exports = cache;
//# sourceMappingURL=cache.js.map