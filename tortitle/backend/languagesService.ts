import * as azure from "azure-storage";
import { Promise } from "es6-promise";
import * as cache from "./cache";
import { Entities } from "./Entities";
import { ISubtitleEntity } from "./subtitle";
import { Iso639 } from "../iso639";

export module LanguagesService {
    export function getCachedLanguages() {
        const cacheKey = "languages";
        const ttl = 7200;
        return Promise.resolve(cache.get<string[]>(cacheKey))
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
                var langs = subs.map(x => x.Language).distinct();
                var availableLangs = Iso639.languages.filter(x => langs.indexOf(x.code) >= 0);
                return availableLangs;
            })
            .catch(error => {
                return Promise.reject<string[]>(error);
            });
    }
}