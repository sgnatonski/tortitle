"use strict";
var cache = require("../backend/cache");
var es6_promise_1 = require("es6-promise");
var languagesService_1 = require("../backend/languagesService");
var moviesService_1 = require("../backend/moviesService");
var visitCookie = 'TortitleLastVisit';
var languageCookie = 'TortitleLanguage';
var pageSize = 100;
var sortMap = function (movies) { return ({
    0: function () { return movies.sortByDesc(function (x) { return x.hasMatch; }); },
    1: function () { return movies.sortByDesc(function (x) { return x.addedAt; }); },
    2: function () { return movies.sortBy(function (x) { return x.addedAt; }); },
    3: function () { return movies.sortByDesc(function (x) { return x.rating; }); },
    4: function () { return movies.sortBy(function (x) { return x.rating; }); },
    5: function () { return movies.sortBy(function (x) { return x.name; }); },
    6: function () { return movies.sortByDesc(function (x) { return x.name; }); }
}); };
var sorts = {
    0: "Matching first",
    1: "Date added &darr;",
    2: "Date added &uarr;",
    3: "Rating &darr;",
    4: "Rating &uarr;",
    5: "Title (A-Z)",
    6: "Title (Z-A)"
};
function index(req, res, next) {
    var language = req.cookies[languageCookie];
    var lastVisitTime = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    var page = (parseInt(req.params.page) || 0) + 1;
    var count = page * pageSize;
    var sortType = parseInt(req.params.sort) || 0;
    var cacheKey = "index-model-" + page + "-" + count + "-" + sortType + "-" + language;
    es6_promise_1.Promise.resolve(cache.get(cacheKey)).then(function (cached) {
        if (cached)
            return cached;
        var langs = languagesService_1.LanguagesService.getCachedLanguages();
        var movies = moviesService_1.MoviesService.getCachedRecentTopMovies(language);
        return es6_promise_1.Promise.all([langs, movies])
            .then(function (result) { return ({ langs: result[0], movies: result[1] }); })
            .then(function (result) {
            var sortedMovies = result.movies.sortWith(sortMap, sortType).slice(0, count);
            var model = {
                app: 'Tortitle',
                nextPage: count < result.movies.length ? page + 1 : undefined,
                sorts: sorts,
                sort: sortType,
                currentSort: sorts[sortType] || sorts[0],
                lang: result.langs.filter(function (x) { return x.code === language; }).map(function (x) { return x.language; }).first(),
                langs: result.langs,
                movies: sortedMovies
            };
            cache.set(cacheKey, model, 300);
            return model;
        })
            .catch(function (error) { return next(error); });
    }).then(function (result) {
        result.movies = result.movies.mapAssign(function (x) { return ({ isNew: x.addedAt > lastVisit }); });
        res.render('index', result);
    });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map