"use strict";
var express = require("express");
var routes = require("./routes/routes");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var morgan = require("morgan");
var serveStatic = require("serve-static");
var nconf = require("nconf");
var Entities_1 = require("./backend/Entities");
require("./utils");
nconf.argv()
    .env()
    .file({ file: './config.json' });
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(serveStatic(__dirname + '/public'));
app.use(morgan('dev'));
app.set('port', (process.env.PORT || 3000));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');
app.engine("html", require('vash').__express);
routes.configure(app);
Entities_1.Entities.initialize(nconf.get('TORTITLESTORAGENAME'), nconf.get('TORTITLESTORAGEKEY'));
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//# sourceMappingURL=app.js.map