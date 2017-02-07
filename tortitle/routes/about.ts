import * as express from "express";
const visitCookie = 'TortitleLastVisit';

export function index(req: express.Request, res: express.Response, next) {
    res.render('about', {
        app: 'Tortitle'
    });
};
