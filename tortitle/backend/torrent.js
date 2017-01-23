"use strict";
function map(m, date) {
    var added = m.AdddedAt || new Date(2017, 0);
    return {
        name: m.RowKey,
        imdbId: m.ImdbId,
        quality: m.Quality,
        torrentLink: m.TorrentLink,
        addedAt: added,
        isNew: !date || added > date
    };
}
exports.map = map;
//# sourceMappingURL=torrent.js.map