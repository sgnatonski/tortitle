import { IMovie } from "./movie";
import * as azure from "azure-storage";
import * as Promise from "es6-promise";
import { Entities } from "./Entities";

interface IMovieEntity {
    PartitionKey: any;
    RowKey: any;
    MovieName: string;
    PictureLink: string;
    Rating: number;
    AdddedAt: Date;
}

function uberTrim(s: string) {
    return s && s.length >= 2 && (s[0] === s[s.length - 1])
        ? s.slice(1, -1).trim()
        : s;
}

export module MoviesService {
    export function getRecentTopMovies(): Promise.Promise<IMovie[]> {
        var resultPromise = new Promise.Promise<IMovie[]>((resolve, reject) => {
            var query = new azure.TableQuery();
            Entities.queryEntities<IMovieEntity>('imdbentries', query, (entities, error) => {
                if (error) return reject();
                var movies = entities.map(m => <IMovie>{
                    name: m.MovieName,
                    imdbId: m.RowKey,
                    pictureLink: uberTrim(m.PictureLink),
                    rating: m.Rating,
                    addedAt: m.AdddedAt || new Date(2017, 0)
                }).sort((a, b) => a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0);
                resolve(movies);
            });
        });
        
        return resultPromise;
    }
}