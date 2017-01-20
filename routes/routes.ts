import * as express from "express";
import * as index from "./index";
import * as user from "./user";

export function configure(app: express.Express) {
    app.get('/', index.index, index.lastVisit);
    app.get('/:sort', index.index);
    app.get('/users', user.list);
}