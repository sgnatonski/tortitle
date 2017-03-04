"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cache = require("node-cache");
var cache = new Cache({ stdTTL: 60, checkperiod: 120 });
exports.default = cache;
//# sourceMappingURL=cache.js.map