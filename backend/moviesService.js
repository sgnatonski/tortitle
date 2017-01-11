"use strict";
var azure = require("azure-storage");
var Promise = require("es6-promise");
var Entities_1 = require("./Entities");
Entities_1.Entities.initialize(process.env.TORTITLESTORAGENAME, process.env.TORTITLESTORAGEKEY);
var MoviesService;
(function (MoviesService) {
    function getRecentTopMovies() {
        var resultPromise = new Promise.Promise(function (resolve, reject) {
            var query = new azure.TableQuery();
            Entities_1.Entities.queryEntities('imdbentries', query, function (entities, error) {
                if (error)
                    reject();
                var movies = entities.map(function (m) { return ({
                    name: m.MovieName,
                    imdbId: m.RowKey,
                    pictureLink: m.PictureLink,
                    rating: m.Rating,
                    addedAt: m.AdddedAt
                }); });
                resolve(movies);
            });
        });
        return resultPromise;
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map