"use strict";
var moviesService_1 = require("../backend/moviesService");
var visitCookie = 'TortitleLastVisit';
function sortMap(movies) {
    var sorts = {
        0: function () { return movies.sortByDesc(function (x) { return x.isNew; }); },
        1: function () { return movies.sortByDesc(function (x) { return x.addedAt; }); },
        2: function () { return movies.sortBy(function (x) { return x.addedAt; }); },
        3: function () { return movies.sortByDesc(function (x) { return x.rating; }); },
        4: function () { return movies.sortBy(function (x) { return x.rating; }); },
        5: function () { return movies.sortBy(function (x) { return x.name; }); },
        6: function () { return movies.sortByDesc(function (x) { return x.name; }); }
    };
    return function (s) { return (sorts[s] || sorts[0])(); };
}
function index(req, res) {
    var lastVisitTime = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;
    moviesService_1.MoviesService.getCachedRecentTopMovies(lastVisit).then(function (movies) {
        var sortType = parseInt(req.params.sort);
        var sortedMovies = movies.sortWith(sortMap, sortType);
        res.render('index', {
            app: 'Tortitle',
            sort: sortType,
            movies: sortedMovies,
            cache: true
        });
    });
}
exports.index = index;
;
function lastVisit(req, res) {
    var lastVisitTime = req.cookies[visitCookie];
    var dateLastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (!dateLastVisit || dateLastVisit < oneWeekAgo) {
        var options = { maxAge: 1000 * 60 * 60 * 24 * 30 };
        res.cookie(visitCookie, new Date().toISOString(), options);
    }
}
exports.lastVisit = lastVisit;
//# sourceMappingURL=index.js.map