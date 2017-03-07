"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function btoa(str) {
    var s = str || "";
    var buffer;
    if (s instanceof Buffer) {
        buffer = s;
    }
    else {
        buffer = new Buffer(s.toString(), 'binary');
    }
    return buffer.toString('base64');
}
function map(m) {
    return {
        name: m.RowKey.trim(),
        imdbId: m.ImdbId,
        quality: m.Quality,
        torrentLink: m.TorrentLink,
        magnetLink: m.MagnetLink,
        magnetLink64: btoa(m.MagnetLink),
        addedAt: m.AdddedAt || new Date(2017, 0)
    };
}
exports.map = map;
//# sourceMappingURL=torrent.js.map