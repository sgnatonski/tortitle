"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index = require("./index");
var watch = require("./watch");
var about = require("./about");
var cookie = require("./cookie");
function configure(app) {
    app.use(cookie.language);
    app.use(cookie.lastVisit);
    app.get('/', index.index);
    app.get('/:sort(\\d+)', index.index);
    app.get('/:sort(\\d+)/:page(\\d+)', index.index);
    app.get('/watch/:magnet', watch.watch);
    app.get('/watch/stream/:magnet', watch.watchStream);
    app.get('/watch/sub', watch.watchSub);
    app.get('/about', about.index);
}
exports.configure = configure;
//# sourceMappingURL=routes.js.map