"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index = require("./index");
var about = require("./about");
var cookie = require("./cookie");
function configure(app) {
    app.use(cookie.language);
    app.use(cookie.lastVisit);
    app.get('/', index.index);
    app.get('/:sort(\\d+)', index.index);
    app.get('/:sort(\\d+)/:page(\\d+)', index.index);
    app.get('/watch/:magnet', index.watch);
    app.get('/watch/stream/:magnet', index.watchStream);
    app.get('/watch/sub', index.watchSub);
    app.get('/about', about.index);
}
exports.configure = configure;
//# sourceMappingURL=routes.js.map