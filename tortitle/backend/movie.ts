import {ITorrent, ITorrentEntity, map as torrentMap } from "./torrent";
import { ISubtitle, ISubtitleEntity, map as subMap } from "./subtitle";

export interface IMovie {
    name: string;
    imdbId: string;
    pictureLink: string;
    rating: number;
    addedAt: Date;
    isNew: boolean;
    hasMatch: boolean;
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

export function map(m: IMovieEntity, t: GroupMap<ITorrentEntity>, s: GroupMap<ISubtitleEntity>) {
    var torrents = (t[m.RowKey] || []).map(torrentMap);
    var subtitles = (s[m.RowKey] || []).map(subMap);
    var qualities = torrents.map(x => x.quality).distinct();
    var match = torrents.filter(x => subtitles.filter(s => x.name == s.releaseName).length > 0).length > 0;
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: torrents,
        subtitles: subtitles,
        qualities: qualities,
        addedAt: m.AdddedAt || new Date(2017, 0),
        hasMatch: match
    } as IMovie;
}