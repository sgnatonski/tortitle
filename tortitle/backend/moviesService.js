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
        var promise = new Promise.Promise(function (resolve, reject) { return movieCache.get(movieCacheKey, function (error, cached) { return error ? reject(error) : resolve(cached); }); });
        return promise
            .then(function (cached) { return cached ? Promise.Promise.resolve(cached) : getRecentTopMovies(lastVisit); })
            .then(function (movies) {
            movieCache.set(movieCacheKey, movies);
            return movies;
        });
    }
    MoviesService.getCachedRecentTopMovies = getCachedRecentTopMovies;
    function getRecentTopMovies(lastVisit) {
        var movieTableName = "imdbentries";
        var promise = new Promise.Promise(function (resolve, reject) {
            var query = new azure.TableQuery();
            Entities_1.Entities.queryEntities(movieTableName, query, function (entities, error) { return error ? reject(error) : resolve(entities); });
        }).then(function (movies) {
            return new Promise.Promise(function (resolve, reject) {
                getTorrents()
                    .then(function (torrents) { return resolve({ movies: movies, torrents: torrents }); })
                    .catch(function (error) { return reject(error); });
            });
        }).then(function (value) {
            var torrentsByImdb = value.torrents.groupBy(function (x) { return x.ImdbId; });
            var movies = value.movies.map(function (e) { return movie_1.map(e, torrentsByImdb, lastVisit); });
            return movies;
        });
        return promise;
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
    function getTorrents() {
        var torrentTableName = "torrents";
        return new Promise.Promise(function (resolve, reject) {
            var query = new azure.TableQuery();
            Entities_1.Entities.queryEntities(torrentTableName, query, function (entities, error) { return error ? reject(error) : resolve(entities); });
        });
    }
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map