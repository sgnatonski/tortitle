"use strict";
var Movie = (function () {
    function Movie(name, torrent, imdbId, subtitleLink, rating) {
        this.name = name;
        this.torrent = torrent;
        this.imdbId = imdbId;
        this.subtitleLink = subtitleLink;
        this.rating = rating;
    }
    return Movie;
}());
exports.Movie = Movie;
//# sourceMappingURL=movie.js.map