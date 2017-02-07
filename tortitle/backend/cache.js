"use strict";
var Cache = require("node-cache");
var cache = new Cache({ stdTTL: 60, checkperiod: 120 });
module.exports = cache;
//# sourceMappingURL=cache.js.map