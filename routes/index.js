"use strict";
var moviesService_1 = require("../backend/moviesService");
function index(req, res) {
    moviesService_1.MoviesService.getCachedRecentTopMovies().then(function (movies) {
        res.render('index', {
            app: 'Tortitle',
            movies: movies.sort(function (a, b) { return a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0; }),
            cache: true
        });
    });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map