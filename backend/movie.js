"use strict";
function map(m, date) {
    var plink = (m.PictureLink || "").uberTrim();
    var added = m.AdddedAt || new Date(2017, 0);
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: plink === "null" ? "" : plink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        addedAt: added,
        isNew: !date || added > date
    };
}
exports.map = map;
//# sourceMappingURL=movie.js.map