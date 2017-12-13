import { ISubtitle } from "./subtitle";

export interface ITorrent {
    name: string;
    torrentLink: string;
    magnetLink: string;
    magnetLink64: string;
    imdbId: string;
    quality: string;
    files: ITorrentFile[];
    subtitle: ISubtitle;
    addedAt: Date;
    isNew: boolean;
    isStreamable: boolean;
}

export interface ITorrentFile {
    File: string;
    Size: string;
}

export interface ITorrentEntity {
    PartitionKey: string;
    RowKey: string;
    ImdbId: string;
    Quality: string;
    TorrentLink: string;
    MagnetLink: string;
    Files: string;
    AdddedAt: Date;
}

export function map(m: ITorrentEntity) {
    const files = JSON.parse(m.Files || "null") as ITorrentFile[];
    return {
        name: (m.RowKey || "").trim(),
        imdbId: m.ImdbId,
        quality: m.Quality,
        torrentLink: m.TorrentLink,
        magnetLink: m.MagnetLink,
        files: files,
        addedAt: m.AdddedAt || new Date(2017, 0),
        isStreamable: (files || []).findIndex(x => x.File.endsWith('.mkv') || x.File.endsWith('.mp4')) >= 0 || files === null
    } as ITorrent;
}