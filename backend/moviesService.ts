import { IMovie } from "./movie";
import * as azure from "azure-storage";
import * as Promise from "es6-promise";
import { Entities } from "./Entities";
Entities.initialize(process.env.TORTITLESTORAGENAME, process.env.TORTITLESTORAGEKEY);

interface IMovieEntity {
    PartitionKey: any;
    RowKey: any;
    MovieName: string;
    PictureLink: string;
    Rating: number;
    AdddedAt: Date;
}

export module MoviesService {
    export function getRecentTopMovies(): Promise.Promise<IMovie[]> {
        var resultPromise = new Promise.Promise<IMovie[]>((resolve, reject) => {
            var query = new azure.TableQuery();
            Entities.queryEntities<IMovieEntity>('imdbentries', query, (entities, error) => {
                if (error) reject();
                var movies = entities.map(m => <IMovie>{
                    name: m.MovieName,
                    imdbId: m.RowKey,
                    pictureLink: m.PictureLink,
                    rating: m.Rating,
                    addedAt: m.AdddedAt
                });
                resolve(movies);
            });
        });
        
        return resultPromise;
    }
}