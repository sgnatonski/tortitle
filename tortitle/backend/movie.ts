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
    torrentCount: number;
    subtitles: ISubtitle[];
    qualities: string[];
    addedAt: Date;
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
    const torrents: ITorrent[] = (t[m.RowKey] || []).map(torrentMap);
    const subtitles: ISubtitle[] = (s[m.RowKey] || []).map(subMap);
    const qualities = torrents.map(x => x.quality).distinct();
    torrents.forEach(t => t.subtitle = subtitles.find(s => s.releaseName == t.name));
    return {
        name: m.MovieName,
        imdbId: m.RowKey,
        pictureLink: m.PictureLink,
        rating: isNaN(m.Rating) ? 0 : m.Rating,
        torrents: torrents,
        torrentCount: torrents.length,
        subtitles: subtitles,
        qualities: qualities,
        addedAt: m.AdddedAt || new Date(2017, 0)
    } as IMovie;
}