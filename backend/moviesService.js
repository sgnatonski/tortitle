"use strict";
var azure = require("azure-storage");
var Promise = require("es6-promise");
var Entities_1 = require("./Entities");
function uberTrim(s) {
    return s && s.length >= 2 && (s[0] === s[s.length - 1])
        ? s.slice(1, -1).trim()
        : s;
}
var MoviesService;
(function (MoviesService) {
    function getRecentTopMovies() {
        var resultPromise = new Promise.Promise(function (resolve, reject) {
            var query = new azure.TableQuery();
            Entities_1.Entities.queryEntities('imdbentries', query, function (entities, error) {
                if (error)
                    return reject();
                var movies = entities.map(function (m) { return ({
                    name: m.MovieName,
                    imdbId: m.RowKey,
                    pictureLink: uberTrim(m.PictureLink),
                    rating: m.Rating,
                    addedAt: m.AdddedAt || new Date(2017, 0)
                }); }).sort(function (a, b) { return a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0; });
                resolve(movies);
            });
        });
        return resultPromise;
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map