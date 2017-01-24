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
        return Promise.Promise.resolve(movieCache.get<IMovie[]>(movieCacheKey))
            .then(cached => cached
                ? cached
                : getRecentTopMovies(lastVisit).then(movies => {
                    movieCache.set(movieCacheKey, movies);
                    return movies;
                }));
    }

    export function getRecentTopMovies(lastVisit: Date) {
        const movieTableName = "imdbentries";
        const torrentTableName = "torrents";

        return Promise.Promise.all([
            Entities.queryEntities<ITorrentEntity>(torrentTableName, new azure.TableQuery()),
            Entities.queryEntities<IMovieEntity>(movieTableName, new azure.TableQuery())
        ]).then(value => {
            var torrentsByImdb = value[0].groupBy(x => x.ImdbId);
            var movies = value[1].map(e => movieMap(e, torrentsByImdb, lastVisit));
            return movies;
        });
    }
}