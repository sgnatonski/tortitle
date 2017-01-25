import {ITorrent, ITorrentEntity, map as torrentMap } from "./torrent";
import { ISubtitle, ISubtitleEntity, map as subMap } from "./subtitle";

export interface IMovie {
    name: string;
    imdbId: string;
    pictureLink: string;
    rating: number;
    addedAt: Date;
    isNew: boolean;
    torrents: ITorrent[];
    subtitles: ISubtitle[];
    qualities: string[];
}

export interface IMovieEntity {
    PartitionKey: any;
    RowKey: any;
    MovieName: string;
    PictureLink: string;
    Rating: number;
    AdddedAt: Date;
}

export function map(m: IMovieEntity, t: IGroupMapString<ITorrentEntity>, s: IGroupMapString<ISubtitleEntity>, date: Date) {
    var added = m.AdddedAt || new Date(2017, 0);
    var torrents = (t[m.RowKey] || []).map(x => torrentMap(x, date));
    var subtitles = (s[m.RowKey] || []).map(x => subMap(x));
    var qualities = torrents.map(x => x.quality).distinct();
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: torrents,
        subtitles: subtitles,
        qualities: qualities,
        addedAt: added,
        isNew: !date || added > date
    } as IMovie;
}