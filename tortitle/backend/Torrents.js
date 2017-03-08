"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var torrentStream = require("torrent-stream");
var memoryChunkStore = require("memory-chunk-store");
var engine;
var Torrents;
(function (Torrents) {
    function resolveLargetsFile(resolve) {
        var file = engine.files.sortByDesc(function (f) { return f.length; }).first();
        console.log('filename:', file.name);
        resolve(file);
    }
    function getFileByMagnet(magnet) {
        return new Promise(function (resolve, reject) {
            if (!engine) {
                engine = torrentStream(magnet, { storage: memoryChunkStore }, function () { return resolveLargetsFile(resolve); });
            }
            if (engine.files) {
                resolveLargetsFile(resolve);
            }
        });
    }
    Torrents.getFileByMagnet = getFileByMagnet;
})(Torrents = exports.Torrents || (exports.Torrents = {}));
//# sourceMappingURL=Torrents.js.map