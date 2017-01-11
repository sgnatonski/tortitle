import * as express from "express";
import { MoviesService } from "../backend/moviesService";

export function index(req: express.Request, res: express.Response) {
    MoviesService.getRecentTopMovies().then(movies => {
        res.render('index', {
            app: 'Tortitle',
            movies: movies
        });
    });
};