import { ITorrent, ITorrentEntity, map as torrentMap } from "./torrent";
import { ISubtitle, ISubtitleEntity, map as subMap } from "./subtitle";

export interface IMatch {
    torrent: ITorrent;
    subtitle: ISubtitle;
}


export interface IMovie {
    name: string;
    imdbId: string;
    pictureLink: string;
    rating: number;
    addedAt: Date;
    isNew: boolean;
    hasMatch: boolean;
    match: IMatch[];
    torrents: ITorrent[];
    subtitles: ISubtitle[];
    qualities: string[];
}

export interface IMovieEntity {
    PartitionKey: string;
    RowKey: string;
    MovieName: string;
    PictureLink: string;
    Rating: number;
    AdddedAt: Date;
}

export function map(m: IMovieEntity, t: IGroupMapString<ITorrentEntity>, s: IGroupMapString<ISubtitleEntity>) {
    var torrents = (t[m.RowKey] || []).map(torrentMap);
    var subtitles = (s[m.RowKey] || []).map(subMap);
    var qualities = torrents.map(x => x.quality).distinct();
    var match = torrents.equijoin(subtitles, t => t.name, s => s.releaseName, (t, s) => ({ torrent: t, subtitle: s }) as IMatch);
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: torrents,
        subtitles: subtitles,
        qualities: qualities,
        addedAt: m.AdddedAt || new Date(2017, 0),
        match: match,
        hasMatch: match.length > 0
    } as IMovie;
}