/*
 * GET users listing.
 */
import * as express from 'express';

export function list(req: express.Request, res: express.Response) {
    var items = [];
    for (var i = 0; i < 1000; i++) {
        items.push({ nick: 'nick' + i, date: new Date(), args: ['zero', 'one'] });
    }

    res.render('user', {
        app: 'Tortitle',
        channel: 'Express channel',
        buffer: items
    });
};