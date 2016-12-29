"use strict";
var moviesService_1 = require("../backend/moviesService");
function index(req, res) {
    var movies = moviesService_1.MoviesService.getRecentTopMovies();
    res.render('index', {
        app: 'Tortitle',
        movies: movies
    });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map