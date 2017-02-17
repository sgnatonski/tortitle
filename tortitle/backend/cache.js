"use strict";
var Cache = require("node-cache");
var cache = new Cache({ stdTTL: 60, checkperiod: 120 });
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cache;
//# sourceMappingURL=cache.js.map