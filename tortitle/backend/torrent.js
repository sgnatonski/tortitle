"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function map(m) {
    var files = JSON.parse(m.Files || "null");
    return {
        name: (m.RowKey || "").trim(),
        imdbId: m.ImdbId,
        quality: m.Quality,
        torrentLink: m.TorrentLink,
        magnetLink: m.MagnetLink,
        files: files,
        addedAt: m.AdddedAt || new Date(2017, 0),
        isStreamable: (files || []).findIndex(function (x) { return x.File.endsWith('.mkv') || x.File.endsWith('.mp4'); }) >= 0 || files === null
    };
}
exports.map = map;
//# sourceMappingURL=torrent.js.map