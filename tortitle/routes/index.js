"use strict";
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
function index(req, res, next) {
    var language = req.cookies[languageCookie];
    var lastVisitTime = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    var page = (parseInt(req.params.page) || 0) + 1;
    var count = page * pageSize;
    var sortType = parseInt(req.params.sort) || 0;
    var langs = languagesService_1.LanguagesService.getCachedLanguages();
    var movies = moviesService_1.MoviesService.getCachedRecentTopMovies(language);
    es6_promise_1.Promise.all([langs, movies])
        .then(function (result) { return ({ langs: result[0], movies: result[1] }); })
        .then(function (result) {
        var sortedMovies = result.movies
            .mapAssign(function (x) { return ({ isNew: x.addedAt > lastVisit }); })
            .sortWith(sortMap, sortType)
            .slice(0, count);
        res.render('index', {
            app: 'Tortitle',
            nextPage: count < result.movies.length ? page + 1 : undefined,
            sort: sortType,
            lang: result.langs.filter(function (x) { return x.code === language; }).map(function (x) { return x.language; }).first(),
            langs: result.langs,
            movies: sortedMovies
        });
    })
        .catch(function (error) { return next(error); });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map