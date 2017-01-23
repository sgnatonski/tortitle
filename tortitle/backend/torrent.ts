export interface ITorrent {
    name: string;
    torrentLink: string,
    imdbId: string,
    quality: string,
    addedAt: Date;
    isNew: boolean;
}

export interface ITorrentEntity {
    PartitionKey: any;
    RowKey: any;
    ImdbId: string;
    Quality: string;
    TorrentLink: string;
    AdddedAt: Date;
}

export function map(m: ITorrentEntity, date: Date) {
    var added = m.AdddedAt || new Date(2017, 0);
    return <ITorrent>{
        name: m.RowKey,
        imdbId: m.ImdbId,
        quality: m.Quality,
        torrentLink: m.TorrentLink,
        addedAt: added,
        isNew: !date || added > date
    };
}