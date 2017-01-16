"use strict";
var azure = require("azure-storage");
var Promise = require("es6-promise");
var Cache = require("node-cache");
var Entities_1 = require("./Entities");
var movie_1 = require("./movie");
var movieCache = new Cache({ stdTTL: 60, checkperiod: 120 });
var MoviesService;
(function (MoviesService) {
    function getCachedRecentTopMovies() {
        var movieCacheKey = "movies";
        return new Promise.Promise(function (resolve, reject) {
            movieCache.get(movieCacheKey, function (error, cached) {
                if (error)
                    return reject();
                return cached ? resolve(cached) : getRecentTopMovies().then(function (movies) {
                    movieCache.set(movieCacheKey, movies);
                    return resolve(movies);
                });
            });
        });
    }
    MoviesService.getCachedRecentTopMovies = getCachedRecentTopMovies;
    function getRecentTopMovies() {
        var movieTableName = "imdbentries";
        return new Promise.Promise(function (resolve, reject) {
            var query = new azure.TableQuery();
            Entities_1.Entities.queryEntities(movieTableName, query, function (entities, error) {
                if (error)
                    return reject();
                var movies = entities.map(movie_1.map);
                return resolve(movies);
            });
        });
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map