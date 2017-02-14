"use strict";
var azure = require("azure-storage");
var es6_promise_1 = require("es6-promise");
var cache = require("./cache");
var Entities_1 = require("./Entities");
var movie_1 = require("./movie");
var MoviesService;
(function (MoviesService) {
    function getCachedRecentTopMovies(language) {
        var movieCacheKey = "movies-" + language;
        var ttl = 3600;
        return es6_promise_1.Promise.resolve(cache.get(movieCacheKey))
            .then(function (cached) { return cached
            ? cached
            : getRecentTopMovies(language).then(function (movies) {
                cache.set(movieCacheKey, movies, ttl);
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
            Entities_1.Entities.queryEntities(subtitleTableName, new azure.TableQuery().where("PartitionKey eq '" + language + "'"))
        ])
            .then(function (result) { return ({ torrents: result[0], movies: result[1], subtitles: result[2] }); })
            .then(function (result) {
            var torrentsByImdb = result.torrents.groupBy(function (x) { return x.ImdbId; });
            var subtitlesByImdb = result.subtitles.groupBy(function (x) { return x.ImdbId; });
            var movies = result.movies.map(function (e) { return movie_1.map(e, torrentsByImdb, subtitlesByImdb); });
            return movies;
        })
            .catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map