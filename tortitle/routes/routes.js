"use strict";
var index = require("./index");
var user = require("./user");
function configure(app) {
    app.use('/', index.lastVisit);
    app.get('/', index.index);
    app.get('/:sort(\\d+)', index.index);
    app.get('/users', user.list);
}
exports.configure = configure;
//# sourceMappingURL=routes.js.map