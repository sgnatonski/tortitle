"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function map(m) {
    return {
        language: m.PartitionKey,
        imdbId: m.ImdbId,
        subId: m.RowKey,
        linkDownload: m.LinkDownload,
        releaseName: (m.ReleaseName || "").trim(),
        otherReleases: m.OtherReleases ? m.OtherReleases.split("|") : ""
    };
}
exports.map = map;
//# sourceMappingURL=subtitle.js.map