export interface ISubtitle {
    imdbId: string,
    subId: string;
    linkDownload: string,
    language: string,
    releaseName: string;
    otherReleases: string[];
}

export interface ISubtitleEntity {
    PartitionKey: string;
    RowKey: string;
    LinkDownload: string;
    Language: string;
    ReleaseName: string;
    OtherReleases: string;
}

export function map(m: ISubtitleEntity) {
    return {
        imdbId: m.PartitionKey,
        subId: m.RowKey,
        linkDownload: m.LinkDownload,
        language: m.Language,
        releaseName: m.ReleaseName,
        otherReleases: m.OtherReleases ? m.OtherReleases.split("|") : ""
    } as ISubtitle;
}