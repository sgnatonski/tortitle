﻿/*
 * GET home page.
 */
import * as express from "express";

export function index(req: express.Request, res: express.Response) {
    res.render('index', {
        app: 'Tortitle'
    });
};