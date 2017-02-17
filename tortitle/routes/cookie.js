"use strict";
var visitCookie = 'TortitleLastVisit';
var languageCookie = 'TortitleLanguage';
var visitCookieMaxAge = 1000 * 60 * 60 * 24 * 30;
var languageCookieMaxAge = 1000 * 60 * 60 * 24 * 30;
function lastVisit(req, res, next) {
    var lastVisitTime = req.cookies[visitCookie];
    var dateLastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (dateLastVisit < oneWeekAgo) {
        var options = { maxAge: visitCookieMaxAge, httpOnly: false, secure: false };
        res.cookie(visitCookie, new Date().toISOString(), options);
    }
    next();
}
exports.lastVisit = lastVisit;
function language(req, res, next) {
    var language = req.params.lang || req.cookies[languageCookie] || "en";
    var options = { maxAge: languageCookieMaxAge, httpOnly: false, secure: false };
    res.cookie(languageCookie, language, options);
    next();
}
exports.language = language;
//# sourceMappingURL=cookie.js.map