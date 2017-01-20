import * as express from "express";
import { MoviesService } from "../backend/moviesService";
import { IMovie } from "../backend/movie";

function sortMap(movies: IMovie[], sortType: number): () => IMovie[] {
    const sorts = {
        0: () => movies.sortByDesc(x => x.addedAt),
        1: () => movies.sortBy(x => x.addedAt),
        2: () => movies.sortByDesc(x => x.rating),
        3: () => movies.sortBy(x => x.rating),
        4: () => movies.sortBy(x => x.name),
        5: () => movies.sortByDesc(x => x.name),
        6: () => movies.sortByDesc(x => x.isNew)
    };

    return sorts[sortType || 6];
}

function refreshLastVisitCookie(req: express.Request, res: express.Response) : Date {
    var lastVisitTime: string = req.cookies['TortitleLastVisit'];
    var dateLastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : undefined;
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (!dateLastVisit || dateLastVisit < oneWeekAgo) {
        let options = { maxAge: 1000 * 60 * 60 * 24 * 30 };
        res.cookie('TortitleLastVisit', new Date().toISOString(), options);
    }
    return dateLastVisit;
}

function setIsNew(movie: IMovie, date: Date) {
    if (!date || movie.addedAt > date) {
        movie.isNew = true;
    }
    return movie;
}

export function index(req: express.Request, res: express.Response) {
    MoviesService.getCachedRecentTopMovies().then(movies => {
        var lastVisit = refreshLastVisitCookie(req, res);
        var mapped = movies.map(x => setIsNew(x, lastVisit));

        let sortType = parseInt(req.params.sort);
        res.render('index', {
            app: 'Tortitle',
            movies: mapped.sortWith(sortMap, sortType),
            cache: true
        });
    });
};