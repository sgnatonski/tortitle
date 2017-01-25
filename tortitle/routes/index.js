"use strict";
var _ = require("lodash");
var moviesService_1 = require("../backend/moviesService");
var visitCookie = 'TortitleLastVisit';
var languageCookie = 'TortitleLanguage';
var pageSize = 100;
var sortMap = function (movies) { return ({
    0: function () { return movies.sortByDesc(function (x) { return x.isNew; }); },
    1: function () { return movies.sortByDesc(function (x) { return x.addedAt; }); },
    2: function () { return movies.sortBy(function (x) { return x.addedAt; }); },
    3: function () { return movies.sortByDesc(function (x) { return x.rating; }); },
    4: function () { return movies.sortBy(function (x) { return x.rating; }); },
    5: function () { return movies.sortBy(function (x) { return x.name; }); },
    6: function () { return movies.sortByDesc(function (x) { return x.name; }); }
}); };
function index(req, res) {
    var language = req.cookies[languageCookie];
    var lastVisitTime = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    var page = (parseInt(req.params.page) || 0) + 1;
    var count = page * pageSize;
    var sortType = parseInt(req.params.sort) || 0;
    moviesService_1.MoviesService.getCachedRecentTopMovies(language).then(function (movies) {
        var sortedMovies = movies
            .slice(0, count)
            .map(function (x) { return _.assign(x, { isNew: x.addedAt > lastVisit }); })
            .sortWith(sortMap, sortType);
        res.render('index', {
            app: 'Tortitle',
            nextPage: count < sortedMovies.length ? page + 1 : undefined,
            sort: sortType,
            lang: language,
            movies: sortedMovies
        });
    });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map