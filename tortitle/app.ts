﻿import * as express from 'express';
import * as routes from './routes/routes';
import * as path from 'path';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import * as serveStatic from 'serve-static';
import * as serveFavicon from 'serve-favicon';
import * as nconf from "nconf";
import { Entities } from "./backend/Entities";
import "./utils";

nconf.argv()
    .env()
    .file({ file: './config.json' });

var app = express();
var gaikan = require('gaikan');
gaikan.options.layout = 'layout';
gaikan.options.directories = ['views'];
gaikan.options.extensions = ['html'];
gaikan.options.rootDir = __dirname;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(serveFavicon(__dirname + '/public/favicon.ico'));
app.use(serveStatic(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', gaikan);

if (process.env.NODE_ENV === 'production') {
    app.set('port', process.env.PORT);
    app.use(morgan('short'));
}
else {
    app.set('port', 1337);
    app.use(morgan('dev'));
}

routes.configure(app);

Entities.initialize(nconf.get('TORTITLESTORAGENAME'), nconf.get('TORTITLESTORAGEKEY'));

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});
