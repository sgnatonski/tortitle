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
var azure = require("azure-storage");
var cache_1 = require("./cache");
var Entities_1 = require("./Entities");
var movie_1 = require("./movie");
var MoviesService;
(function (MoviesService) {
    function getCachedRecentTopMovies(language) {
        return __awaiter(this, void 0, void 0, function () {
            var movieCacheKey, ttl, cached, movies;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        movieCacheKey = "movies-" + language;
                        ttl = 3600;
                        return [4 /*yield*/, cache_1.default.get(movieCacheKey)];
                    case 1:
                        cached = _a.sent();
                        if (cached)
                            return [2 /*return*/, cached];
                        return [4 /*yield*/, getRecentTopMovies(language)];
                    case 2:
                        movies = _a.sent();
                        cache_1.default.set(movieCacheKey, movies, ttl);
                        return [2 /*return*/, movies];
                }
            });
        });
    }
    MoviesService.getCachedRecentTopMovies = getCachedRecentTopMovies;
    function getRecentTopMovies(language) {
        return __awaiter(this, void 0, void 0, function () {
            var movieTableName, torrentTableName, subtitleTableName, torrents, movies, subtitles, torrentsByImdb, subtitlesByImdb, mappedMovies;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        movieTableName = "imdbentries";
                        torrentTableName = "torrents";
                        subtitleTableName = "subtitles";
                        return [4 /*yield*/, Entities_1.Entities.queryEntities(torrentTableName, new azure.TableQuery())];
                    case 1:
                        torrents = _a.sent();
                        return [4 /*yield*/, Entities_1.Entities.queryEntities(movieTableName, new azure.TableQuery())];
                    case 2:
                        movies = _a.sent();
                        return [4 /*yield*/, Entities_1.Entities.queryEntities(subtitleTableName, new azure.TableQuery().where("PartitionKey eq '" + language + "'"))];
                    case 3:
                        subtitles = _a.sent();
                        torrentsByImdb = torrents.groupBy(function (x) { return x.ImdbId; });
                        subtitlesByImdb = subtitles.groupBy(function (x) { return x.ImdbId; });
                        mappedMovies = movies.map(function (e) { return movie_1.map(e, torrentsByImdb, subtitlesByImdb); });
                        return [2 /*return*/, mappedMovies];
                }
            });
        });
    }
    MoviesService.getRecentTopMovies = getRecentTopMovies;
})(MoviesService = exports.MoviesService || (exports.MoviesService = {}));
//# sourceMappingURL=moviesService.js.map