"use strict";
var moviesService_1 = require("../backend/moviesService");
var visitCookie = 'TortitleLastVisit';
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
    var lastVisitTime = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;
    moviesService_1.MoviesService.getCachedRecentTopMovies(lastVisit).then(function (movies) {
        var page = (parseInt(req.params.page) || 0) + 1;
        var sortType = parseInt(req.params.sort) || 0;
        var sortedMovies = movies.sortWith(sortMap, sortType);
        var pagedMovies = sortedMovies.slice(0, (page * pageSize));
        res.render('index', {
            app: 'Tortitle',
            nextPage: (page * pageSize) < sortedMovies.length ? page + 1 : undefined,
            sort: sortType,
            movies: pagedMovies
        });
    });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map