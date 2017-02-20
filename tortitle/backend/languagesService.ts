import * as azure from "azure-storage";
import { default as cache } from "./cache";
import { Entities } from "./Entities";
import { ILanguageEntity, ILanguage } from "./language";
import { Iso639 } from "../iso639";

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
        const languagesTableName = "languages";
        const entities = await Entities.queryEntities<ILanguageEntity>(languagesTableName, new azure.TableQuery());
        const langs = new Set(entities.map(i => i.RowKey));
        const availableLangs = Iso639.languages.filter(x => langs.has(x.code));
        return availableLangs as ILanguage[];
    }
}