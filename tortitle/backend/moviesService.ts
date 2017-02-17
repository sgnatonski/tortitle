import * as azure from "azure-storage";
import { default as cache } from "./cache";
import { Entities } from "./Entities";
import { IMovie, IMovieEntity, map as movieMap } from "./movie";
import { ITorrentEntity } from "./torrent";
import { ISubtitleEntity } from "./subtitle";

export module MoviesService {
    export async function getCachedRecentTopMovies(language: string) {
        const movieCacheKey = `movies-${language}`;
        const ttl = 3600;
        const cached = await cache.get<IMovie[]>(movieCacheKey);
        if (cached) return cached;
        const movies = await getRecentTopMovies(language);
        cache.set(movieCacheKey, movies, ttl);
        return movies;
    }

    export async function getRecentTopMovies(language: string) {
        const movieTableName = "imdbentries";
        const torrentTableName = "torrents";
        const subtitleTableName = "subtitles";

        const torrents = await Entities.queryEntities<ITorrentEntity>(torrentTableName, new azure.TableQuery());
        const movies = await Entities.queryEntities<IMovieEntity>(movieTableName, new azure.TableQuery());
        const subtitles = await Entities.queryEntities<ISubtitleEntity>(subtitleTableName, new azure.TableQuery().where(`PartitionKey eq '${language}'`));
        const torrentsByImdb = torrents.groupBy(x => x.ImdbId);
        const subtitlesByImdb = subtitles.groupBy(x => x.ImdbId);
        const mappedMovies = movies.map(e => movieMap(e, torrentsByImdb, subtitlesByImdb));
        return mappedMovies;
    }
}