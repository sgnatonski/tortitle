"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var crypt = {};
function hashMagnet(cid, magnet) {
    var value = cid + ":" + magnet;
    var hash = crypto.createHash('md5').update(value).digest('hex');
    crypt[hash] = { cid: cid, magnet: magnet };
    return hash;
}
exports.hashMagnet = hashMagnet;
function dehashMagnet(hash) {
    return crypt[hash];
}
exports.dehashMagnet = dehashMagnet;
//# sourceMappingURL=magnetCrypt.js.map