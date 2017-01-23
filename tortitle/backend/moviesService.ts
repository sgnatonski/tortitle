import * as azure from "azure-storage";
import * as Promise from "es6-promise";
import * as Cache from "node-cache";
import { Entities } from "./Entities";
import { IMovie, IMovieEntity, map as movieMap } from "./movie";
import { ITorrentEntity } from "./torrent";

const movieCache = new Cache({ stdTTL: 60, checkperiod: 120 });

export module MoviesService {
    export function getCachedRecentTopMovies(lastVisit: Date) {
        const movieCacheKey = "movies";
        var promise = new Promise.Promise<IMovie[]>((resolve, reject) => movieCache.get<IMovie[]>(movieCacheKey, (error, cached) => error ? reject(error) : resolve(cached)))
            .then(cached => cached ? Promise.Promise.resolve(cached) : getRecentTopMovies(lastVisit))
            .then(movies => {
                movieCache.set(movieCacheKey, movies);
                return movies;
            });
        return promise;
    }

    export function getRecentTopMovies(lastVisit: Date) {
        const movieTableName = "imdbentries";
        const torrentTableName = "torrents";
        var query = new azure.TableQuery();
        var promise = Entities.queryEntities<IMovieEntity>(movieTableName, query)
            .then(movies => {
                return new Promise.Promise<{ movies: IMovieEntity[], torrents: ITorrentEntity[] }>((resolve, reject) => {
                    Entities.queryEntities<ITorrentEntity>(torrentTableName, new azure.TableQuery())
                        .then(torrents => resolve({ movies: movies, torrents: torrents }))
                        .catch(error => reject(error));
                });
            })
            .then(value => {
                var torrentsByImdb = value.torrents.groupBy(x => x.ImdbId);
                var movies = value.movies.map(e => movieMap(e, torrentsByImdb, lastVisit));
                return movies;
            });
        return promise;
    }
}