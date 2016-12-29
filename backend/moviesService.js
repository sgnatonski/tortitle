"use strict";
var movie_1 = require("./movie");
var MoviesService;
(function (MoviesService) {
    function getRecentTopMovies() {
        return [
            new movie_1.Movie("1", "1", "1", "", 7.8),
            new movie_1.Movie("1", "1", "1", "", 7.8),
            new movie_1.Movie("1", "1", "1", "", 7.8),
            new movie_1.Movie("1", "1", "1", "", 7.8),
            new movie_1.Movie("1", "1", "1", "", 7.8)
        ];
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map