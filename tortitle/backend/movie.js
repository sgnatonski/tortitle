"use strict";
function map(m, date) {
    var added = m.AdddedAt || new Date(2017, 0);
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        addedAt: added,
        isNew: !date || added > date
    };
}
exports.map = map;
//# sourceMappingURL=movie.js.map