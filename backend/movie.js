"use strict";
function map(m) {
    var plink = (m.PictureLink || "").uberTrim();
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: plink === "null" ? "" : plink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        addedAt: m.AdddedAt || new Date(2017, 0),
        isNew: false
    };
}
exports.map = map;
//# sourceMappingURL=movie.js.map