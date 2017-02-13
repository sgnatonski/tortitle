import * as express from "express";
import * as cache from "../backend/cache";
import { Promise } from "es6-promise";
import { LanguagesService } from "../backend/languagesService";
import { MoviesService } from "../backend/moviesService";
import { IMovie } from "../backend/movie";

const visitCookie = 'TortitleLastVisit';
const languageCookie = 'TortitleLanguage';
const pageSize = 100;

const sortMap = (movies: IMovie[]): ISortFuncSelector<IMovie> => ({
    0: () => movies.sortByDesc(x => x.hasMatch),
    1: () => movies.sortByDesc(x => x.addedAt),
    2: () => movies.sortBy(x => x.addedAt),
    3: () => movies.sortByDesc(x => x.rating),
    4: () => movies.sortBy(x => x.rating),
    5: () => movies.sortBy(x => x.name),
    6: () => movies.sortByDesc(x => x.name)
});

const sorts = {
    0: "Matching first",
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

export function index(req: express.Request, res: express.Response, next) {
    var language: string = req.cookies[languageCookie];
    var lastVisitTime: string = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    var page = (parseInt(req.params.page) || 0) + 1;
    var count = page * pageSize;
    var sortType = parseInt(req.params.sort) || 0;

    const cacheKey = `index-model-${page}-${count}-${sortType}-${language}`;
    Promise.resolve(cache.get<IIndexModel>(cacheKey)).then(cached => {
        if (cached) return cached;

        var langs = LanguagesService.getCachedLanguages();
        var movies = MoviesService.getCachedRecentTopMovies(language);

        return Promise.all([langs, movies])
            .then(result => ({ langs: result[0], movies: result[1] }))
            .then(result => {
                var sortedMovies = result.movies.sortWith(sortMap, sortType).slice(0, count);
                var model = {
                    app: 'Tortitle',
                    nextPage: count < result.movies.length ? page + 1 : undefined,
                    sorts: sorts,
                    sort: sortType,
                    currentSort: sorts[sortType] || sorts[0],
                    lang: result.langs.filter(x => x.code === language).map(x => x.language).first(),
                    langs: result.langs,
                    movies: sortedMovies
                } as IIndexModel;
                cache.set(cacheKey, model, 300);
                return model;
            })
            .catch(error => next(error));
    }).then(result => {
        result.movies = result.movies.mapAssign(x => ({ isNew: x.addedAt > lastVisit }));
        res.render('index', result);
    });
};
    