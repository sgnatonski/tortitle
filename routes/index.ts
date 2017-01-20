import * as express from "express";
import { MoviesService } from "../backend/moviesService";
import { IMovie } from "../backend/movie";

const visitCookie = 'TortitleLastVisit';

function sortMap(movies: IMovie[], sortType: number): () => IMovie[] {
    const defaultSortType = 0;
    const sorts = {
        0: () => movies.sortByDesc(x => x.isNew),
        1: () => movies.sortByDesc(x => x.addedAt),
        2: () => movies.sortBy(x => x.addedAt),
        3: () => movies.sortByDesc(x => x.rating),
        4: () => movies.sortBy(x => x.rating),
        5: () => movies.sortBy(x => x.name),
        6: () => movies.sortByDesc(x => x.name)
    };

    return sorts[sortType] || sorts[defaultSortType];
}

function setIsNew(movie: IMovie, date: Date) {
    if (!date || movie.addedAt > date) {
        movie.isNew = true;
    }
    return movie;
}

export function index(req: express.Request, res: express.Response) {
    MoviesService.getCachedRecentTopMovies().then(movies => {
        var sortType = parseInt(req.params.sort);
        var lastVisitTime: string = req.cookies[visitCookie];
        var lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;

        var sortedMovies = movies.map(x => setIsNew(x, lastVisit)).sortWith(sortMap, sortType);

        res.render('index', {
            app: 'Tortitle',
            sort: sortType,
            movies: sortedMovies,
            cache: true
        });
    });
};

export function lastVisit(req: express.Request, res: express.Response) {
    var lastVisitTime: string = req.cookies[visitCookie];
    var dateLastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (!dateLastVisit || dateLastVisit < oneWeekAgo) {
        let options = { maxAge: 1000 * 60 * 60 * 24 * 30 };
        res.cookie(visitCookie, new Date().toISOString(), options);
    }
}