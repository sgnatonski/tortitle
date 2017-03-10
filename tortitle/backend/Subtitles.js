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
var srt2vtt = require("srt2vtt");
var HTMLParser = require("fast-html-parser");
var AdmZip = require("adm-zip");
var Subtitles;
(function (Subtitles) {
    function getDownloadUrl(subid) {
        var entryUrl = 'http://osdownloader.org/en/osdownloader.subtitles-download/subtitles/' + subid;
        return new Promise(function (resolve, reject) {
            http.get(entryUrl, function (resp) {
                resp.setEncoding('utf8');
                var rawData = '';
                resp.on('data', function (chunk) { return rawData += chunk; })
                    .on('error', function (e) { return reject(e); })
                    .on('end', function () {
                    try {
                        var root = HTMLParser.parse(rawData);
                        var dlurl = root.querySelector('#downloadSubtitles').childNodes[0].childNodes[1].attributes.href;
                        resolve(dlurl);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
        });
    }
    function getSubtitleZip(dlurl) {
        return new Promise(function (resolve, reject) {
            http.get(dlurl, function (resp) {
                var data = [];
                resp.on('data', function (chunk) { return data.push(chunk); })
                    .on('error', function (e) { return reject(e); })
                    .on('end', function () { return resolve(Buffer.concat(data)); });
            });
        });
    }
    function convertToVtt(srtData) {
        var annoyingCreditText = 'NOTE Converted from .srt via srt2vtt: https://github.com/deestan/srt2vtt\n\n';
        return new Promise(function (resolve, reject) {
            srt2vtt(srtData, function (err, vttData) {
                if (err)
                    return reject(err);
                //var decodedVtt = iconv.decode(vttData, 'utf-8').replace(annoyingCreditText, '');
                //console.log(decodedVtt);
                var vtt = vttData.toString().replace(annoyingCreditText, '');
                resolve(vtt);
            });
        });
    }
    function getSubtitle(subid) {
        return __awaiter(this, void 0, void 0, function () {
            var dlurl, zipBuffer, zip, zipEntries, srtEntry, srtData, vtt, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, getDownloadUrl(subid)];
                    case 1:
                        dlurl = _a.sent();
                        return [4 /*yield*/, getSubtitleZip(dlurl)];
                    case 2:
                        zipBuffer = _a.sent();
                        zip = new AdmZip(zipBuffer);
                        zipEntries = zip.getEntries();
                        srtEntry = zipEntries.find(function (x) { return x.entryName.toLowerCase().endsWith('.srt'); });
                        srtData = zip.readFile(srtEntry, "binary");
                        return [4 /*yield*/, convertToVtt(srtData)];
                    case 3:
                        vtt = _a.sent();
                        return [2 /*return*/, vtt];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1.message);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    Subtitles.getSubtitle = getSubtitle;
})(Subtitles = exports.Subtitles || (exports.Subtitles = {}));
//# sourceMappingURL=Subtitles.js.map