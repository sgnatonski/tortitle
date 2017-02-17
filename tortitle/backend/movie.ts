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
    torrents: ITorrent[];
    subtitles: ISubtitle[];
    qualities: string[];
    addedAt: Date;
    hasMatch: boolean;
    match: IMatch[];
    isNew: boolean;
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
    const torrents = (t[m.RowKey] || []).map(torrentMap);
    const subtitles = (s[m.RowKey] || []).map(subMap);
    const qualities = torrents.map(x => x.quality).distinct();
    const match = torrents.equijoin(subtitles, t => t.name, s => s.releaseName, (t, s) => ({ torrent: t, subtitle: s }) as IMatch);
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