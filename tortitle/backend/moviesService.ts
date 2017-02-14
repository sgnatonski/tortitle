import * as azure from "azure-storage";
import { Promise } from "es6-promise";
import * as cache from "./cache";
import { Entities } from "./Entities";
import { IMovie, IMovieEntity, map as movieMap } from "./movie";
import { ITorrentEntity } from "./torrent";
import { ISubtitleEntity } from "./subtitle";

export module MoviesService {
    export function getCachedRecentTopMovies(language: string) {
        const movieCacheKey = `movies-${language}`;
        const ttl = 3600;
        return Promise.resolve(cache.get<IMovie[]>(movieCacheKey))
            .then(cached => cached
                ? cached
                : getRecentTopMovies(language).then(movies => {
                    cache.set(movieCacheKey, movies, ttl);
                    return movies;
                }));
    }

    export function getRecentTopMovies(language: string) {
        const movieTableName = "imdbentries";
        const torrentTableName = "torrents";
        const subtitleTableName = "subtitles";

        return Promise.all([
            Entities.queryEntities<ITorrentEntity>(torrentTableName, new azure.TableQuery()),
            Entities.queryEntities<IMovieEntity>(movieTableName, new azure.TableQuery()),
            Entities.queryEntities<ISubtitleEntity>(subtitleTableName, new azure.TableQuery().where(`PartitionKey eq '${language}'`))
        ])
            .then(result => ({ torrents: result[0], movies: result[1], subtitles: result[2] }))
            .then(result => {
                var torrentsByImdb = result.torrents.groupBy(x => x.ImdbId);
                var subtitlesByImdb = result.subtitles.groupBy(x => x.PartitionKey);
                var movies = result.movies.map(e => movieMap(e, torrentsByImdb, subtitlesByImdb));
                return movies;
            })
            .catch(error => {
                return Promise.reject<IMovie[]>(error);
            });
    }
}