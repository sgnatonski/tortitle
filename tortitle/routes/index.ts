import * as express from "express";
import { default as cache } from "../backend/cache";
import { LanguagesService } from "../backend/languagesService";
import { MoviesService } from "../backend/moviesService";
import { IMovie } from "../backend/movie";
import * as WebTorrent from "webtorrent-hybrid";

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
    const magnet: string =
        'magnet:?xt=urn:btih:9d45f004b71036a065b86b8e72053adabd2ec4a8&dn=A.Monster.Calls.2016.DVDScr.XVID.AC3.HQ.Hive-CM8&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969';// req.params.magnet;
    if (!magnet || !magnet.startsWith('magnet:?')) {
        res.status(400).json({ error: 'magnet param missing or malformed' });
    }

    var client = new WebTorrent();
    var buf = new Buffer([]);
    //buf.name = 'Some file name';

    client.on('error', err => {
        console.log(err);
    });

    client.add(magnet, { path: '/bin' }, torrent => {
        torrent.on('metadata', () => {
            console.log('torrent metadata ready');
        });
        torrent.on('download', bytes => {
            buf.write(bytes);
        });
        torrent.on('done', () => {
            console.log('torrent download finished');
        });
    });
}
    