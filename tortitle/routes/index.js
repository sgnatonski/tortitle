"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("../backend/cache");
var languagesService_1 = require("../backend/languagesService");
var moviesService_1 = require("../backend/moviesService");
var torrentStream = require("torrent-stream");
var visitCookie = 'TortitleLastVisit';
var languageCookie = 'TortitleLanguage';
var pageSize = 100;
var sortMap = function (movies) { return ({
    0: function () { return movies.sortByDesc(function (x) { return x.hasMatch; }); },
    1: function () { return movies.sortByDesc(function (x) { return x.addedAt; }); },
    2: function () { return movies.sortBy(function (x) { return x.addedAt; }); },
    3: function () { return movies.sortByDesc(function (x) { return x.rating; }); },
    4: function () { return movies.sortBy(function (x) { return x.rating; }); },
    5: function () { return movies.sortBy(function (x) { return x.name; }); },
    6: function () { return movies.sortByDesc(function (x) { return x.name; }); }
}); };
var sorts = {
    0: "Matching first",
    1: "Date added &darr;",
    2: "Date added &uarr;",
    3: "Rating &darr;",
    4: "Rating &uarr;",
    5: "Title (A-Z)",
    6: "Title (Z-A)"
};
function index(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var language, page, count, sortType, cacheKey, cached, langs, movies, sortedMovies, model;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    language = req.cookies[languageCookie];
                    page = (parseInt(req.params.page) || 0) + 1;
                    count = page * pageSize;
                    sortType = parseInt(req.params.sort) || 0;
                    cacheKey = "index-model-" + page + "-" + count + "-" + sortType + "-" + language;
                    cached = cache_1.default.get(cacheKey);
                    if (cached) {
                        return [2 /*return*/, renderSorted(req, res, cached)];
                    }
                    return [4 /*yield*/, languagesService_1.LanguagesService.getCachedLanguages()];
                case 1:
                    langs = _a.sent();
                    return [4 /*yield*/, moviesService_1.MoviesService.getCachedRecentTopMovies(language)];
                case 2:
                    movies = _a.sent();
                    sortedMovies = movies.sortWith(sortMap, sortType).slice(0, count);
                    model = {
                        app: 'Tortitle',
                        nextPage: count < movies.length ? page + 1 : undefined,
                        sorts: sorts,
                        sort: sortType,
                        currentSort: sorts[sortType] || sorts[0],
                        lang: langs.filter(function (x) { return x.code === language; }).map(function (x) { return x.language; }).first(),
                        langs: langs,
                        movies: sortedMovies
                    };
                    cache_1.default.set(cacheKey, model, 300);
                    renderSorted(req, res, model);
                    return [2 /*return*/];
            }
        });
    });
}
exports.index = index;
;
function renderSorted(req, res, model) {
    var lastVisitTime = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    model.movies = model.movies.mapAssign(function (x) { return ({ isNew: x.addedAt > lastVisit }); });
    res.render('index', model);
}
function watch(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var magnet, engine;
        return __generator(this, function (_a) {
            if (!req.params.magnet) {
                res.status(400).json({ error: 'magnet param missing or malformed' });
            }
            magnet = 'magnet:?' + req.params.magnet;
            engine = torrentStream(magnet);
            engine.on('ready', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log.apply(console, args);
                var file = engine.files[0];
                console.log('filename:', file.name);
                var stream = file.createReadStream();
                stream.on('open', function () {
                    // This just pipes the read stream to the response object (which goes to the client)
                    stream.pipe(res);
                });
                // This catches any errors that happen while creating the readable stream (usually invalid names)
                stream.on('error', function (err) {
                    res.end(err);
                });
            });
            engine.on('download', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log.apply(console, args);
                //res.status(200).json({ msg: 'torrent download started' });
            });
            engine.on('torrent', function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log.apply(console, args);
                //res.status(200).json({ msg: 'torrent metadata ready' });
            });
            return [2 /*return*/];
        });
    });
}
exports.watch = watch;
//# sourceMappingURL=index.js.map