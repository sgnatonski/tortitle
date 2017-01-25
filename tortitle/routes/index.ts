import * as express from "express";
import { MoviesService } from "../backend/moviesService";
import { IMovie } from "../backend/movie";

const visitCookie = 'TortitleLastVisit';
const languageCookie = 'TortitleLanguage';
const pageSize = 100;

const sortMap = (movies: IMovie[]): ISortFuncSelector<IMovie> => ({
    0: () => movies.sortByDesc(x => x.isNew),
    1: () => movies.sortByDesc(x => x.addedAt),
    2: () => movies.sortBy(x => x.addedAt),
    3: () => movies.sortByDesc(x => x.rating),
    4: () => movies.sortBy(x => x.rating),
    5: () => movies.sortBy(x => x.name),
    6: () => movies.sortByDesc(x => x.name)
});

export function index(req: express.Request, res: express.Response) {
    var language: string = req.cookies[languageCookie];
    var lastVisitTime: string = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;

    MoviesService.getCachedRecentTopMovies(language, lastVisit).then(movies => {
        var page = (parseInt(req.params.page) || 0) + 1;
        var sortType = parseInt(req.params.sort) || 0;
        var sortedMovies = movies.sortWith(sortMap, sortType);
        var pagedMovies = sortedMovies.slice(0, (page * pageSize));

        res.render('index', {
            app: 'Tortitle',
            nextPage: (page * pageSize) < sortedMovies.length ? page + 1 : undefined,
            sort: sortType,
            movies: pagedMovies
        });
    });
};