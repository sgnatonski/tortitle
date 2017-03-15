import * as express from "express";
import { default as cache } from "../backend/cache";
import { LanguagesService } from "../backend/languagesService";
import { MoviesService } from "../backend/moviesService";
import { IMovie } from "../backend/movie";
import * as magnetCrypt from "../backend/magnetCrypt";

const cidCookie = 'cid';
const visitCookie = 'TortitleLastVisit';
const languageCookie = 'TortitleLanguage';
const pageSize = 100;

const sortMap = (movies: IMovie[]): ISortFuncSelector<IMovie> => ({
    0: () => movies.sortByDesc(x => x.torrentCount),
    1: () => movies.sortByDesc(x => x.addedAt),
    2: () => movies.sortBy(x => x.addedAt),
    3: () => movies.sortByDesc(x => x.rating),
    4: () => movies.sortBy(x => x.rating),
    5: () => movies.sortBy(x => x.name),
    6: () => movies.sortByDesc(x => x.name)
});

const sorts = {
    0: "Release count",
    1: "Date added &darr;",
    2: "Date added &uarr;",
    3: "Rating &darr;",
    4: "Rating &uarr;",
    5: "Title (A-Z)",
    6: "Title (Z-A)"
}

interface IIndexModel {
    app: string;
    nextPage: number;
    sorts: any;
    sort: number;
    currentSort: string;
    lang: string;
    langs: any;
    movies: IMovie[];
}

export async function index(req: express.Request, res: express.Response) {
    const language: string = req.cookies[languageCookie];
    const page = (parseInt(req.params.page) || 0) + 1;
    const count = page * pageSize;
    const sortType = parseInt(req.params.sort) || 0;
    const cacheKey = `index-model-${page}-${count}-${sortType}-${language}`;

    const cached = cache.get<IIndexModel>(cacheKey);
    if (cached) {
        return renderSorted(req, res, cached);
    }

    const langs = await LanguagesService.getCachedLanguages();
    const movies = await MoviesService.getCachedRecentTopMovies(language);
    const sortedMovies = movies.sortWith(sortMap, sortType).slice(0, count);
    const model = {
        app: 'Tortitle',
        nextPage: count < movies.length ? page + 1 : undefined,
        sorts: sorts,
        sort: sortType,
        currentSort: sorts[sortType] || sorts[0],
        lang: langs.filter(x => x.code === language).map(x => x.language).first(),
        langs: langs,
        movies: sortedMovies
    } as IIndexModel;
    cache.set(cacheKey, model, 300);
    renderSorted(req, res, model);
};

function renderSorted(req: express.Request, res: express.Response, model: IIndexModel) {
    const lastVisitTime: string = req.cookies[visitCookie];
    const cid: string = req.cookies[cidCookie];
    const lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    model.movies = model.movies.mapAssign(x => ({
        isNew: x.addedAt > lastVisit,
        torrents: x.torrents.mapAssign(t => ({
            magnetLink64: magnetCrypt.hashMagnet(cid, t.magnetLink)
        }))
    }));
    res.render('index', model);
}