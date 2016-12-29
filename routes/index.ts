/*
 * GET home page.
 */
import * as express from "express";
import { MoviesService } from "../backend/moviesService";

export function index(req: express.Request, res: express.Response) {
    var movies = MoviesService.getRecentTopMovies();
    res.render('index', {
        app: 'Tortitle',
        movies: movies
    });
};