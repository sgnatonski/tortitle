"use strict";
var moviesService_1 = require("../backend/moviesService");
function index(req, res) {
    moviesService_1.MoviesService.getRecentTopMovies().then(function (movies) {
        res.render('index', {
            app: 'Tortitle',
            movies: movies
        });
    });
}
exports.index = index;
;
//# sourceMappingURL=index.js.map