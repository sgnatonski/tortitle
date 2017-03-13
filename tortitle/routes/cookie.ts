import * as express from "express";
import * as crypto from "crypto";

const clientIdCookie = 'cid';
const visitCookie = 'TortitleLastVisit';
const languageCookie = 'TortitleLanguage';
const clientIdCookieMaxAge = 1000 * 60 * 60;
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
    req.cookies[languageCookie] = language;
    next();
}

export function clientId(req: express.Request, res: express.Response, next) {
    let cid: string = req.cookies[clientIdCookie];
    if (!cid) {
        cid = crypto.randomBytes(16).toString("hex");
    }
    const options = { maxAge: clientIdCookieMaxAge, httpOnly: true, secure: true };
    res.cookie(clientIdCookie, cid, options);
    req.cookies[clientIdCookie] = cid;
    next();
}