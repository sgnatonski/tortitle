"use strict";
var index = require("./index");
var user = require("./user");
var cookie = require("./cookie");
function configure(app) {
    app.get('/', index.index);
    app.get('/:sort(\\d+)', index.index);
    app.get('/users', user.list);
    app.use(cookie.lastVisit);
}
exports.configure = configure;
//# sourceMappingURL=routes.js.map