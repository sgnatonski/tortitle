import * as azure from "azure-storage";
import { default as cache } from "./cache";
import { Entities } from "./Entities";
import { ISubtitleEntity } from "./subtitle";
import { Iso639, ILanguage } from "../iso639";

export module LanguagesService {
    export async function getCachedLanguages() {
        const cacheKey = "languages";
        const ttl = 7200;
        const cached = cache.get<ILanguage[]>(cacheKey);
        if (cached) return cached;
        const langs = await getLanguages();
        cache.set(cacheKey, langs, ttl);
        return langs;
    }

    export async function getLanguages() {
        const subtitleTableName = "subtitles";
        const subs = await Entities.queryEntities<ISubtitleEntity>(subtitleTableName, new azure.TableQuery().select('PartitionKey'));
        var langs = subs.reduce((map, obj) => {
            map[obj.PartitionKey] = 1;
            return map;
        }, {});
        const availableLangs = Iso639.languages.filter(x => langs[x.code]);
        return availableLangs;
    }
}