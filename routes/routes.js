"use strict";
var index = require("./index");
var user = require("./user");
function configure(app) {
    app.get('/', index.index, index.lastVisit);
    app.get('/:sort', index.index);
    app.get('/users', user.list);
}
exports.configure = configure;
//# sourceMappingURL=routes.js.map