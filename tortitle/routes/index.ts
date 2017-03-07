import * as express from "express";
import { default as cache } from "../backend/cache";
import { LanguagesService } from "../backend/languagesService";
import { MoviesService } from "../backend/moviesService";
import { IMovie } from "../backend/movie";
import * as torrentStream from "torrent-stream";

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
    const lastVisit = lastVisitTime ? new Date(Date.parse(lastVisitTime)) : new Date(0);
    model.movies = model.movies.mapAssign(x => ({ isNew: x.addedAt > lastVisit }));
    res.render('index', model);
}

export async function watch(req: express.Request, res: express.Response) {
    if (!req.params.magnet) {
        res.status(400).json({ error: 'magnet param missing or malformed' });
    }

    const magnet = 'magnet:?' + req.params.magnet;
    
    var engine = torrentStream(magnet);

    engine.on('ready', (...args: any[]) => {
        console.log.apply(console, args);
        var file = engine.files[0];
        console.log('filename:', file.name);
        var stream = file.createReadStream();
        stream.on('open', () => {
            // This just pipes the read stream to the response object (which goes to the client)
            stream.pipe(res);
        });

        // This catches any errors that happen while creating the readable stream (usually invalid names)
        stream.on('error', (err) => {
            res.end(err);
        });
    });

    engine.on('download', (...args: any[]) => {
        console.log.apply(console, args);
        //res.status(200).json({ msg: 'torrent download started' });
    });

    engine.on('torrent', (...args: any[]) => {
        console.log.apply(console, args);
        //res.status(200).json({ msg: 'torrent metadata ready' });
    });
}
    