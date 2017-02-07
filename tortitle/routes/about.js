"use strict";
var visitCookie = 'TortitleLastVisit';
function index(req, res, next) {
    res.render('about', {
        app: 'Tortitle'
    });
}
exports.index = index;
;
//# sourceMappingURL=about.js.map