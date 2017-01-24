import * as express from "express";
import * as index from "./index";
import * as user from "./user";

export function configure(app: express.Express) {
    app.get('/', index.index);
    app.get('/:sort(\\d+)', index.index);
    app.get('/users', user.list);
    app.use(index.lastVisit);
}