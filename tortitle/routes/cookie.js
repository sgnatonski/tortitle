"use strict";
var visitCookie = 'TortitleLastVisit';
function lastVisit(req, res, next) {
    var lastVisitTime = req.cookies[visitCookie];
    var dateLastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (!dateLastVisit || dateLastVisit < oneWeekAgo) {
        var options = { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: false, secure: false };
        res.cookie(visitCookie, new Date().toISOString(), options);
    }
    next();
}
exports.lastVisit = lastVisit;
//# sourceMappingURL=cookie.js.map