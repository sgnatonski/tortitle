"use strict";
var index = require("./index");
var user = require("./user");
function configure(app) {
    app.get('/', index.index);
    app.get('/:sort(\\d+)', index.index);
    app.get('/users', user.list);
    app.use(index.lastVisit);
}
exports.configure = configure;
//# sourceMappingURL=routes.js.map