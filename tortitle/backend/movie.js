"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var torrent_1 = require("./torrent");
var subtitle_1 = require("./subtitle");
function map(m, t, s) {
    var torrents = (t[m.RowKey] || []).map(torrent_1.map);
    var subtitles = (s[m.RowKey] || []).map(subtitle_1.map);
    var qualities = torrents.map(function (x) { return x.quality; }).distinct();
    torrents.forEach(function (t) { return t.subtitle = subtitles.find(function (s) { return s.releaseName == t.name; }); });
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: torrents,
        torrentCount: torrents.length,
        subtitles: subtitles,
        qualities: qualities,
        addedAt: m.AdddedAt || new Date(2017, 0)
    };
}
exports.map = map;
//# sourceMappingURL=movie.js.map