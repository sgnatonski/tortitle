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
    app.get('/watch/:magnet/:subid', watch.watch);
    app.get('/stream/:magnet', watch.watchStream);
    app.get('/sub/:subid', watch.watchSub);
    app.get('/about', about.index);
}
exports.configure = configure;
//# sourceMappingURL=routes.js.map