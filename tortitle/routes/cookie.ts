import * as express from "express";

const visitCookie = 'TortitleLastVisit';
const languageCookie = 'TortitleLanguage';
const visitCookieMaxAge = 1000 * 60 * 60 * 24 * 30;
const languageCookieMaxAge = 1000 * 60 * 60 * 24 * 30;

export function lastVisit(req: express.Request, res: express.Response, next) {
    const lastVisitTime: string = req.cookies[visitCookie];
    const dateLastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (dateLastVisit < oneWeekAgo) {
        const options = { maxAge: visitCookieMaxAge, httpOnly: false, secure: false };
        res.cookie(visitCookie, new Date().toISOString(), options);
    }
    next();
}

export function language(req: express.Request, res: express.Response, next) {
    const language: string = req.params.lang || req.cookies[languageCookie] || "en";
    const options = { maxAge: languageCookieMaxAge, httpOnly: false, secure: false };
    res.cookie(languageCookie, language, options);
    next();
}