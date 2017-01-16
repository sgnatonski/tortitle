import * as azure from "azure-storage";
import * as Promise from "es6-promise";
import * as Cache from "node-cache";
import { Entities } from "./Entities";
import { IMovie, IMovieEntity, map } from "./movie";

const movieCache = new Cache({ stdTTL: 60, checkperiod: 120 });

export module MoviesService {
    export function getCachedRecentTopMovies() {
        const movieCacheKey = "movies";
        return new Promise.Promise<IMovie[]>((resolve, reject) => {
            movieCache.get<IMovie[]>(movieCacheKey, (error, cached) => {
                if (error) return reject();
                return cached ? resolve(cached) : getRecentTopMovies().then(movies => {
                    movieCache.set(movieCacheKey, movies);
                    return resolve(movies);
                });
            });
        });
    }

    export function getRecentTopMovies() {
        const movieTableName = "imdbentries";
        return new Promise.Promise<IMovie[]>((resolve, reject) => {
            var query = new azure.TableQuery();
            Entities.queryEntities<IMovieEntity>(movieTableName, query, (entities, error) => {
                if (error) return reject();
                var movies = entities.map(map);
                return resolve(movies);
            });
        });
    }
}