"use strict";
var azure = require("azure-storage");
var es6_promise_1 = require("es6-promise");
var Cache = require("node-cache");
var Entities_1 = require("./Entities");
var movie_1 = require("./movie");
var movieCache = new Cache({ stdTTL: 60, checkperiod: 120 });
var MoviesService;
(function (MoviesService) {
    function getCachedRecentTopMovies(language) {
        var movieCacheKey = "movies-" + language;
        return es6_promise_1.Promise.resolve(movieCache.get(movieCacheKey))
            .then(function (cached) { return cached
            ? cached
            : getRecentTopMovies(language).then(function (movies) {
                movieCache.set(movieCacheKey, movies);
                return movies;
            }); });
    }
    MoviesService.getCachedRecentTopMovies = getCachedRecentTopMovies;
    function getRecentTopMovies(language) {
        var movieTableName = "imdbentries";
        var torrentTableName = "torrents";
        var subtitleTableName = "subtitles";
        return es6_promise_1.Promise.all([
            Entities_1.Entities.queryEntities(torrentTableName, new azure.TableQuery()),
            Entities_1.Entities.queryEntities(movieTableName, new azure.TableQuery()),
            Entities_1.Entities.queryEntities(subtitleTableName, new azure.TableQuery().where("Language eq '" + language + "'"))
        ]).then(function (value) {
            var torrentsByImdb = value[0].groupBy(function (x) { return x.ImdbId; });
            var subtitlesByImdb = value[2].groupBy(function (x) { return x.PartitionKey; });
            var movies = value[1].map(function (e) { return movie_1.map(e, torrentsByImdb, subtitlesByImdb); });
            return movies;
        }).catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map