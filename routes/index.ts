import * as express from "express";
import { MoviesService } from "../backend/moviesService";

export function index(req: express.Request, res: express.Response) {
    MoviesService.getCachedRecentTopMovies().then(movies => {
        res.render('index', {
            app: 'Tortitle',
            movies: movies.sort((a, b) => a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0),
            cache: true
        });
    });
};