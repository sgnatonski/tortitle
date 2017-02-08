import * as express from "express";
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

export function index(req: express.Request, res: express.Response, next) {
    var language: string = req.cookies[languageCookie];
    var lastVisitTime: string = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    var page = (parseInt(req.params.page) || 0) + 1;
    var count = page * pageSize;
    var sortType = parseInt(req.params.sort) || 0;

    var langs = LanguagesService.getCachedLanguages();
    var movies = MoviesService.getCachedRecentTopMovies(language);

    Promise.all([langs, movies])
        .then(result => ({ langs: result[0], movies: result[1] }))
        .then(result => {
            var sortedMovies = result.movies
                .mapAssign(x => ({ isNew: x.addedAt > lastVisit }))
                .sortWith(sortMap, sortType)
                .slice(0, count);

            res.render('index', {
                app: 'Tortitle',
                nextPage: count < result.movies.length ? page + 1 : undefined,
                sort: sortType,
                lang: result.langs.filter(x => x.code === language).map(x => x.language).first(),
                langs: result.langs.sortBy(x => x.language),
                movies: sortedMovies
            });
        })
        .catch(error => next(error));
};
    