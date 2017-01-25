"use strict";
var torrent_1 = require("./torrent");
var subtitle_1 = require("./subtitle");
function map(m, t, s, date) {
    var added = m.AdddedAt || new Date(2017, 0);
    var torrents = (t[m.RowKey] || []).map(function (x) { return torrent_1.map(x, date); });
    var subtitles = (s[m.RowKey] || []).map(function (x) { return subtitle_1.map(x); });
    var qualities = torrents.map(function (x) { return x.quality; }).distinct();
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: torrents,
        subtitles: subtitles,
        qualities: qualities,
        addedAt: added,
        isNew: !date || added > date
    };
}
exports.map = map;
//# sourceMappingURL=movie.js.map