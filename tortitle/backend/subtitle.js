"use strict";
function map(m) {
    return {
        imdbId: m.PartitionKey,
        subId: m.RowKey,
        linkDownload: m.LinkDownload,
        language: m.Language,
        releaseName: m.ReleaseName,
        otherReleases: m.OtherReleases ? m.OtherReleases.split("|") : ""
    };
}
exports.map = map;
//# sourceMappingURL=subtitle.js.map