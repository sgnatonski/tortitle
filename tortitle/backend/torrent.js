"use strict";
function map(m) {
    return {
        name: m.RowKey,
        imdbId: m.ImdbId,
        quality: m.Quality,
        torrentLink: m.TorrentLink,
        addedAt: m.AdddedAt || new Date(2017, 0)
    };
}
exports.map = map;
//# sourceMappingURL=torrent.js.map