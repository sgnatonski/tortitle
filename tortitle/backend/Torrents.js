"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var torrentStream = require("torrent-stream");
var memoryChunkStore = require("memory-chunk-store");
var Cache = require("node-cache");
var magnetCacheKey = 'magnet_';
var magnetTTL = 7200;
var cache = new Cache({ stdTTL: magnetTTL, checkperiod: 120, useClones: false });
cache.on("expired", function (key, value) {
    if (key.startsWith(magnetCacheKey)) {
        value.destroy();
    }
});
var Torrents;
(function (Torrents) {
    ;
    function resolveLargetsFile(engine, resolve) {
        var largest = engine.files.sortByDesc(function (f) { return f.length; }).first();
        engine.files.forEach(function (file) {
            if (file.name != largest.name) {
                file.deselect();
                console.log(file.name + ' deselected');
            }
        });
        if (largest.name.endsWith('.avi')) {
            largest.deselect();
            console.log(largest.name + ' deselected - not possible to stream');
        }
        else {
            console.log(largest.name + ' selected to stream');
        }
        resolve({ engine: engine, file: largest });
    }
    function getFileFromEngine(magnet, engine) {
        return new Promise(function (resolve, reject) {
            if (!engine) {
                engine = torrentStream(magnet, { storage: memoryChunkStore });
                engine.on("ready", function () { return resolveLargetsFile(engine, resolve); });
            }
            if (engine.files && engine.files.length) {
                resolveLargetsFile(engine, resolve);
            }
        });
    }
    function getFileByMagnet(magnet) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, _a, engine, file, _b, engine, file;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cached = cache.get(magnetCacheKey + magnet);
                        if (!cached) return [3 /*break*/, 2];
                        console.log("Torrent fetched from cache " + cached.files.sortByDesc(function (f) { return f.length; }).first().name);
                        cache.ttl(magnetCacheKey + magnet, magnetTTL);
                        return [4 /*yield*/, getFileFromEngine(magnet, cached)];
                    case 1:
                        _a = _c.sent(), engine = _a.engine, file = _a.file;
                        return [2 /*return*/, file];
                    case 2: return [4 /*yield*/, getFileFromEngine(magnet)];
                    case 3:
                        _b = _c.sent(), engine = _b.engine, file = _b.file;
                        cache.set(magnetCacheKey + magnet, engine, magnetTTL);
                        return [2 /*return*/, file];
                }
            });
        });
    }
    Torrents.getFileByMagnet = getFileByMagnet;
})(Torrents = exports.Torrents || (exports.Torrents = {}));
//# sourceMappingURL=Torrents.js.map