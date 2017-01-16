import {uberTrim} from "../utils";

export interface IMovie {
    name: string;
    imdbId: string;
    pictureLink: string;
    rating: number;
    addedAt: Date;
}

export interface IMovieEntity {
    PartitionKey: any;
    RowKey: any;
    MovieName: string;
    PictureLink: string;
    Rating: number;
    AdddedAt: Date;
}

export function map(m: IMovieEntity) {
    var plink = uberTrim(m.PictureLink);
    return <IMovie>{
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: plink === "null" ? "" : plink,
        rating: m.Rating,
        addedAt: m.AdddedAt || new Date(2017, 0)
    };
}