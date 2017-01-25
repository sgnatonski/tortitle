"use strict";
var torrent_1 = require("./torrent");
var subtitle_1 = require("./subtitle");
function map(m, t, s) {
    var torrents = (t[m.RowKey] || []).map(torrent_1.map);
    var subtitles = (s[m.RowKey] || []).map(subtitle_1.map);
    var qualities = torrents.map(function (x) { return x.quality; }).distinct();
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: torrents,
        subtitles: subtitles,
        qualities: qualities,
        addedAt: m.AdddedAt || new Date(2017, 0)
    };
}
exports.map = map;
//# sourceMappingURL=movie.js.map