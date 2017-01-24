"use strict";
var moviesService_1 = require("../backend/moviesService");
var visitCookie = 'TortitleLastVisit';
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
        var sortType = parseInt(req.params.sort);
        var sortedMovies = movies.sortWith(sortMap, sortType);
        res.render('index', {
            app: 'Tortitle',
            sort: sortType,
            movies: sortedMovies
        });
    });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map