"use strict";
var index = require("./index");
var about = require("./about");
var cookie = require("./cookie");
function configure(app) {
    app.use(cookie.language);
    app.use(cookie.lastVisit);
    app.get('/', index.index);
    app.get('/:sort(\\d+)', index.index);
    app.get('/:sort(\\d+)/:page(\\d+)', index.index);
    app.get('/about', about.index);
}
exports.configure = configure;
//# sourceMappingURL=routes.js.map