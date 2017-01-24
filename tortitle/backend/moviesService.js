"use strict";
var azure = require("azure-storage");
var Promise = require("es6-promise");
var Cache = require("node-cache");
var Entities_1 = require("./Entities");
var movie_1 = require("./movie");
var movieCache = new Cache({ stdTTL: 60, checkperiod: 120 });
var MoviesService;
(function (MoviesService) {
    function getCachedRecentTopMovies(lastVisit) {
        var movieCacheKey = "movies";
        return Promise.Promise.resolve(movieCache.get(movieCacheKey))
            .then(function (cached) { return cached
            ? cached
            : getRecentTopMovies(lastVisit).then(function (movies) {
                movieCache.set(movieCacheKey, movies);
                return movies;
            }); });
    }
    MoviesService.getCachedRecentTopMovies = getCachedRecentTopMovies;
    function getRecentTopMovies(lastVisit) {
        var movieTableName = "imdbentries";
        var torrentTableName = "torrents";
        return Promise.Promise.all([
            Entities_1.Entities.queryEntities(torrentTableName, new azure.TableQuery()),
            Entities_1.Entities.queryEntities(movieTableName, new azure.TableQuery())
        ]).then(function (value) {
            var torrentsByImdb = value[0].groupBy(function (x) { return x.ImdbId; });
            var movies = value[1].map(function (e) { return movie_1.map(e, torrentsByImdb, lastVisit); });
            return movies;
        });
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map