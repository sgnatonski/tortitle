"use strict";
var azure = require("azure-storage");
var es6_promise_1 = require("es6-promise");
var cache = require("./cache");
var Entities_1 = require("./Entities");
var iso639_1 = require("../iso639");
var LanguagesService;
(function (LanguagesService) {
    function getCachedLanguages() {
        var cacheKey = "languages";
        var ttl = 7200;
        return es6_promise_1.Promise.resolve(cache.get(cacheKey))
            .then(function (cached) { return cached
            ? cached
            : getLanguages().then(function (langs) {
                cache.set(cacheKey, langs, ttl);
                return langs;
            }); });
    }
    LanguagesService.getCachedLanguages = getCachedLanguages;
    function getLanguages() {
        var subtitleTableName = "subtitles";
        return Entities_1.Entities.queryEntities(subtitleTableName, new azure.TableQuery())
            .then(function (subs) {
            var langs = subs.map(function (x) { return x.Language; }).distinct();
            var availableLangs = iso639_1.Iso639.languages.filter(function (x) { return langs.indexOf(x.code) >= 0; });
            return availableLangs;
        })
            .catch(function (error) {
            return es6_promise_1.Promise.reject(error);
        });
    }
    LanguagesService.getLanguages = getLanguages;
})(LanguagesService = exports.LanguagesService || (exports.LanguagesService = {}));
//# sourceMappingURL=languagesService.js.map