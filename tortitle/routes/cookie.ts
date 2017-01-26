﻿import * as express from "express";

const visitCookie = 'TortitleLastVisit';
const languageCookie = 'TortitleLanguage';

export function lastVisit(req: express.Request, res: express.Response, next) {
    var lastVisitTime: string = req.cookies[visitCookie];
    var dateLastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (dateLastVisit < oneWeekAgo) {
        let options = { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: false, secure: false };
        res.cookie(visitCookie, new Date().toISOString(), options);
    }
    next();
}

export function language(req: express.Request, res: express.Response, next) {
    var language: string = req.params.lang || req.cookies[languageCookie] || "en";
    let options = { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: false, secure: false };
    res.cookie(languageCookie, language, options);
    next();
}