import * as azure from "azure-storage";
import { Promise } from "es6-promise";
import * as cache from "./cache";
import { Entities } from "./Entities";
import { ISubtitleEntity } from "./subtitle";
import { Iso639, ILanguage } from "../iso639";

export module LanguagesService {
    export function getCachedLanguages() {
        const cacheKey = "languages";
        const ttl = 7200;
        return Promise.resolve(cache.get<ILanguage[]>(cacheKey))
            .then(cached => cached
                ? cached
                : getLanguages().then(langs => {
                    cache.set(cacheKey, langs, ttl);
                    return langs;
                }));
    }

    export function getLanguages() {
        const subtitleTableName = "subtitles";
        return Entities.queryEntities<ISubtitleEntity>(subtitleTableName, new azure.TableQuery())
            .then(subs => {
                var langs = subs.reduce(function (map, obj) {
                    map[obj.Language] = 1;
                    return map;
                }, {});
                var availableLangs = Iso639.languages.filter(x => langs[x.code]);
                return availableLangs;
            })
            .catch(error => {
                return Promise.reject<ILanguage[]>(error);
            });
    }
}