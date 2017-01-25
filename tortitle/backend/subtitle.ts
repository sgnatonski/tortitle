export interface ISubtitle {
    imdbId: string,
    subId: string;
    linkDownload: string,
    language: string,
    releaseName: string;
}

export interface ISubtitleEntity {
    PartitionKey: string;
    RowKey: string;
    LinkDownload: string;
    Language: string;
    ReleaseName: string;
}

export function map(m: ISubtitleEntity) {
    return {
        imdbId: m.PartitionKey,
        subId: m.RowKey,
        linkDownload: m.LinkDownload,
        language: m.Language,
        releaseName: m.ReleaseName
    } as ISubtitle;
}