"use strict";
var moviesService_1 = require("../backend/moviesService");
function sortMap(movies, sortType) {
    var sorts = {
        0: function () { return movies.sortByDesc(function (x) { return x.addedAt; }); },
        1: function () { return movies.sortBy(function (x) { return x.addedAt; }); },
        2: function () { return movies.sortByDesc(function (x) { return x.rating; }); },
        3: function () { return movies.sortBy(function (x) { return x.rating; }); },
        4: function () { return movies.sortBy(function (x) { return x.name; }); },
        5: function () { return movies.sortByDesc(function (x) { return x.name; }); },
        6: function () { return movies.sortByDesc(function (x) { return x.isNew; }); }
    };
    return sorts[sortType || 6];
}
function refreshLastVisitCookie(req, res) {
    var lastVisitTime = req.cookies['TortitleLastVisit'];
    var dateLastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (!dateLastVisit || dateLastVisit < oneWeekAgo) {
        var options = { maxAge: 1000 * 60 * 60 * 24 * 30 };
        var d = new Date();
        d.setDate(d.getDate() - 1);
        res.cookie('TortitleLastVisit', d.toISOString(), options);
    }
    return dateLastVisit;
}
function setIsNew(movie, date) {
    if (!date || movie.addedAt > date) {
        movie.isNew = true;
    }
    return movie;
}
function index(req, res) {
    moviesService_1.MoviesService.getCachedRecentTopMovies().then(function (movies) {
        var lastVisit = refreshLastVisitCookie(req, res);
        var mapped = movies.map(function (x) { return setIsNew(x, lastVisit); });
        var sortType = parseInt(req.params.sort);
        res.render('index', {
            app: 'Tortitle',
            movies: mapped.sortWith(sortMap, sortType),
            cache: true
        });
    });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map