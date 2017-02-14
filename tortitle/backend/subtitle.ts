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
    ImdbId: string;
    ReleaseName: string;
    OtherReleases: string;
}

export function map(m: ISubtitleEntity) {
    return {
        language: m.PartitionKey,
        imdbId: m.ImdbId,
        subId: m.RowKey,
        linkDownload: m.LinkDownload,
        releaseName: m.ReleaseName,
        otherReleases: m.OtherReleases ? m.OtherReleases.split("|") : ""
    } as ISubtitle;
}