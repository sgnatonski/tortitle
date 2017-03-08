import * as express from "express";
import * as index from "./index";
import * as watch from "./watch";
import * as about from "./about";
import * as cookie from "./cookie";

export function configure(app: express.Express) {
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