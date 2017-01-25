import * as azure from "azure-storage";
import * as Promise from "es6-promise";
import * as Cache from "node-cache";
import { Entities } from "./Entities";
import { IMovie, IMovieEntity, map as movieMap } from "./movie";
import { ITorrentEntity } from "./torrent";
import { ISubtitleEntity } from "./subtitle";

const movieCache = new Cache({ stdTTL: 60, checkperiod: 120 });

export module MoviesService {
    export function getCachedRecentTopMovies(language: string, lastVisit: Date) {
        const movieCacheKey = "movies-" + language;
        return Promise.Promise.resolve(movieCache.get<IMovie[]>(movieCacheKey))
            .then(cached => cached
                ? cached
                : getRecentTopMovies(language, lastVisit).then(movies => {
                    movieCache.set(movieCacheKey, movies);
                    return movies;
                }));
    }

    export function getRecentTopMovies(language: string, lastVisit: Date) {
        const movieTableName = "imdbentries";
        const torrentTableName = "torrents";
        const subtitleTableName = "subtitles";

        return Promise.Promise.all([
            Entities.queryEntities<ITorrentEntity>(torrentTableName, new azure.TableQuery()),
            Entities.queryEntities<IMovieEntity>(movieTableName, new azure.TableQuery()),
            Entities.queryEntities<ISubtitleEntity>(subtitleTableName, new azure.TableQuery().where("Language eq '" + language + "'"))
        ]).then(value => {
            var torrentsByImdb = value[0].groupBy(x => x.ImdbId);
            var subtitlesByImdb = value[2].groupBy(x => x.PartitionKey);
            var movies = value[1].map(e => movieMap(e, torrentsByImdb, subtitlesByImdb, lastVisit));
            return movies;
        }).catch(error => {
            return Promise.Promise.reject<IMovie[]>(error);
        });
    }
}