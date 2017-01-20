
export interface IMovie {
    name: string;
    imdbId: string;
    pictureLink: string;
    rating: number;
    addedAt: Date;
    isNew: boolean;
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
    var plink = (m.PictureLink || "").uberTrim();
    return <IMovie>{
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: plink === "null" ? "" : plink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        addedAt: m.AdddedAt || new Date(2017, 0),
        isNew: false
    };
}