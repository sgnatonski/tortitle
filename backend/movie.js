"use strict";
var utils_1 = require("../utils");
function map(m) {
    var plink = utils_1.uberTrim(m.PictureLink);
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: plink === "null" ? "" : plink,
        rating: m.Rating,
        addedAt: m.AdddedAt || new Date(2017, 0)
    };
}
exports.map = map;
//# sourceMappingURL=movie.js.map