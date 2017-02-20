﻿import * as azure from "azure-storage";
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
        const languagesTableName = "languages";
        const subs = await Entities.queryEntities<ISubtitleEntity>(languagesTableName, new azure.TableQuery());
        const langs = new Set(subs.map(i => i.RowKey));
        const availableLangs = Iso639.languages.filter(x => langs.has(x.code));
        return availableLangs;
    }
}