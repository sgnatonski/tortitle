import * as express from "express";
import { MoviesService } from "../backend/moviesService";
import { IMovie } from "../backend/movie";

const visitCookie = 'TortitleLastVisit';

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
    var lastVisitTime: string = req.cookies[visitCookie];
    var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;

    MoviesService.getCachedRecentTopMovies(lastVisit).then(movies => {
        var sortType = parseInt(req.params.sort);
        var sortedMovies = movies.sortWith(sortMap, sortType);

        res.render('index', {
            app: 'Tortitle',
            sort: sortType,
            movies: sortedMovies
        });
    });
};