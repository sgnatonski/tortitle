
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

export function map(m: IMovieEntity, date: Date) {
    var plink = (m.PictureLink || "").uberTrim();
    var added = m.AdddedAt || new Date(2017, 0);
    return <IMovie>{
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: plink === "null" ? "" : plink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        addedAt: added,
        isNew: !date || added > date
    };
}