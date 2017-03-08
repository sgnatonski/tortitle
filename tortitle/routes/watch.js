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
var http = require("http");
var srt2vtt = require("srt-to-vtt");
var stream_1 = require("stream");
var HTMLParser = require("fast-html-parser");
var AdmZip = require("adm-zip");
var Torrents_1 = require("../backend/Torrents");
function atob(str) {
    return new Buffer(str, 'base64').toString('binary');
}
function parseRange(range, totalSize) {
    var split = range.split(/[-=]/);
    var startByte = +split[1];
    var endByte = split[2] ? +split[2] : totalSize - 1;
    return { startByte: startByte, endByte: endByte };
}
function watch(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.render("watch", { magnet: req.params.magnet, subid: req.params.subid });
            return [2 /*return*/];
        });
    });
}
exports.watch = watch;
function watchStream(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var magnet, file, _a, startByte, endByte;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    magnet = atob(req.params.magnet);
                    return [4 /*yield*/, Torrents_1.Torrents.getFileByMagnet(magnet)];
                case 1:
                    file = _b.sent();
                    _a = parseRange(req.headers.range, file.length), startByte = _a.startByte, endByte = _a.endByte;
                    res.status(206);
                    res.set({
                        "Connection": "keep-alive",
                        "Content-Range": "bytes " + startByte + "-" + endByte + "/" + file.length,
                        "Accept-Ranges": "bytes",
                        "Content-Length": "" + (endByte - startByte + 1),
                        "Content-Type": "video/webm"
                    });
                    file.createReadStream({
                        start: startByte,
                        end: endByte
                    }).on('error', function (err) {
                        console.log(err);
                    }).pipe(res);
                    return [2 /*return*/];
            }
        });
    });
}
exports.watchStream = watchStream;
function watchSub(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var subid, entryUrl;
        return __generator(this, function (_a) {
            subid = req.params.subid;
            entryUrl = 'http://osdownloader.org/en/osdownloader.subtitles-download/subtitles/' + subid;
            http.get(entryUrl, function (resp) {
                resp.setEncoding('utf8');
                var rawData = '';
                resp.on('data', function (chunk) { return rawData += chunk; });
                resp.on('end', function () {
                    try {
                        var root = HTMLParser.parse(rawData);
                        var dlurl = root.querySelector('#downloadSubtitles').childNodes[0].childNodes[1].attributes.href;
                        http.get(dlurl, function (subres) {
                            var data = [], dataLen = 0;
                            subres.on('data', function (chunk) {
                                data.push(chunk);
                                dataLen += chunk.length;
                            }).on('end', function () {
                                var buf = new Buffer(dataLen);
                                for (var i = 0, len = data.length, pos = 0; i < len; i++) {
                                    data[i].copy(buf, pos);
                                    pos += data[i].length;
                                }
                                var zip = new AdmZip(buf);
                                var zipEntries = zip.getEntries();
                                var strEntry = zipEntries.find(function (x) { return x.entryName.toLowerCase().endsWith('.srt'); });
                                console.log(zip.readAsText(strEntry));
                                var srtStream = new stream_1.Readable();
                                srtStream.push(zip.readAsText(strEntry));
                                srtStream.push(null);
                                srtStream.pipe(srt2vtt()).pipe(res);
                            });
                        });
                    }
                    catch (e) {
                        console.log(e.message);
                    }
                });
            });
            return [2 /*return*/];
        });
    });
}
exports.watchSub = watchSub;
//# sourceMappingURL=watch.js.map