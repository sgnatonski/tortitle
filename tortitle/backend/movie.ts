import {ITorrent, ITorrentEntity, map as torrentMap } from "./torrent";

export interface IMovie {
    name: string;
    imdbId: string;
    pictureLink: string;
    rating: number;
    addedAt: Date;
    isNew: boolean;
    torrents: ITorrent[];
}

export interface IMovieEntity {
    PartitionKey: any;
    RowKey: any;
    MovieName: string;
    PictureLink: string;
    Rating: number;
    AdddedAt: Date;
}

export function map(m: IMovieEntity, t: IGroupMapString<ITorrentEntity>, date: Date) {
    var added = m.AdddedAt || new Date(2017, 0);
    return <IMovie>{
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: (t[m.RowKey] || []).map(x => torrentMap(x, date)),
        addedAt: added,
        isNew: !date || added > date
    };
}