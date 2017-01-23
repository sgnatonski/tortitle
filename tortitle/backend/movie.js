"use strict";
var torrent_1 = require("./torrent");
function map(m, t, date) {
    var added = m.AdddedAt || new Date(2017, 0);
    var torrents = (t[m.RowKey] || []).map(function (x) { return torrent_1.map(x, date); });
    var qualities = torrents.map(function (x) { return x.quality; }).distinct();
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: torrents,
        qualities: qualities,
        addedAt: added,
        isNew: !date || added > date
    };
}
exports.map = map;
//# sourceMappingURL=movie.js.map