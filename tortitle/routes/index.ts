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
    res.render('watch');
}

export async function watchStream(req: express.Request, res: express.Response) {
    
    var engine = torrentStream('magnet:?xt=urn:btih:9d45f004b71036a065b86b8e72053adabd2ec4a8&dn=A.Monster.Calls.2016.DVDScr.XVID.AC3.HQ.Hive-CM8&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969');

    engine.on('ready', () => {
        var file = engine.files[0];
        console.log('filename:', file.name);

        var range = req.headers.range;
        var split = range.split(/[-=]/);
        var startByte = +split[1];
        var endByte = split[2] ? +split[2] : file.length - 1;
        var chunkSize = endByte - startByte + 1;

        res.status(206);
        res.set('Connection', 'keep-alive');
        res.set("Content-Range", "bytes " + startByte + "-" + endByte + "/" + file.length);
        res.set("Accept-Ranges", "bytes");
        res.set("Content-Length", "" + chunkSize);
        res.set("Content-Type", "video/avi");

        var stream = file.createReadStream({
            start: startByte,
            end: endByte
        });
        stream.on('open', () => {
            // This just pipes the read stream to the response object (which goes to the client)
            stream.pipe(res);
        });

        // This catches any errors that happen while creating the readable stream (usually invalid names)
        stream.on('error', (err) => {
            res.end(err);
        });
    });

    engine.on('download', () => {
        console.log('torrent download started');
        //res.status(200).json({ msg: 'torrent download started' });
    });

    engine.on('torrent', () => {
        console.log('torrent metadata ready');
        //res.status(200).json({ msg: 'torrent metadata ready' });
    });
}
    