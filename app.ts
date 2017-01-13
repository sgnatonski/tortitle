import * as express from 'express';
import * as routes from './routes/routes';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import * as serveStatic from 'serve-static';
import * as nconf from "nconf";
import { Entities } from "./backend/Entities";

nconf.argv()
    .env()
    .file({ file: './config.json' });

var app = express();

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

Entities.initialize(nconf.get('TORTITLESTORAGENAME'), nconf.get('TORTITLESTORAGEKEY'));

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});
