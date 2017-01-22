"use strict";
function list(req, res) {
    var items = [];
    for (var i = 0; i < 1000; i++) {
        items.push({ nick: 'nick' + i, date: new Date(), args: ['zero', 'one'] });
    }
    res.render('user', {
        app: 'Tortitle',
        channel: 'Express channel',
        buffer: items
    });
}
exports.list = list;
;
//# sourceMappingURL=user.js.map