import * as express from "express";
import * as index from "./index";
import * as user from "./user";
import * as cookie from "./cookie";

export function configure(app: express.Express) {
    app.get('/', index.index);
    app.get('/:sort(\\d+)', index.index);
    app.get('/:sort(\\d+)/:page(\\d+)', index.index);
    app.get('/users', user.list);
    app.use(cookie.lastVisit);
}