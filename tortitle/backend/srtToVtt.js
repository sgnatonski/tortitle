"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iconv = require("iconv-lite");
function convertToVtt(srtData, encoding) {
    var vttHeader = 'WEBVTT';
    var newLine = '\r\n';
    var data = iconv.decode(srtData, encoding);
    var lines = data.split(newLine)
        .map(function (line) { return line
        .replace(/\{\\([ibu])\}/g, '</$1>')
        .replace(/\{\\([ibu])1\}/g, '<$1>')
        .replace(/\{([ibu])\}/g, '<$1>')
        .replace(/\{\/([ibu])\}/g, '</$1>')
        .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2'); });
    return "" + vttHeader + newLine + lines.join(newLine);
}
exports.convertToVtt = convertToVtt;
//# sourceMappingURL=srtToVtt.js.map