#r "Microsoft.WindowsAzure.Storage" 
#load "models.csx"
#load "xml.csx"
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Net;
using System.Xml.Linq;
using System.Xml.XPath;

public static void Run(TimerInfo timer, CloudTable torrentsMarksTable, CloudTable subtitlesTable, TraceWriter log)
{
    var query = torrentsMarksTable.CreateQuery<TorrentMark>().AsQueryable().Take(1);
    var list = query.ToList();
    foreach (var entity in list)
    {
        var subs = GetSubs(entity.RowKey, log);
        subs.ForEach(x =>
        {
            TableOperation operation = TableOperation.InsertOrReplace(x);
            TableResult result = subtitlesTable.Execute(operation);
        });
        torrentsMarksTable.Execute(TableOperation.Delete(entity));
    }
}

public static List<Subtitle> GetSubs(string imdbId, TraceWriter log)
{
    log.Info($"Requesting http://www.opensubtitles.org/en/search/imdbid-{imdbId}/xml");
    var osXml = GetXDocumentResponse($"http://www.opensubtitles.org/en/search/imdbid-{imdbId}/xml", log);

    if (osXml == null)
    {
        return new List<Subtitle>();
    }

    var subs = osXml.XPathSelectElements("//opensubtitles/search/results/subtitle").Select(x => new SubtitleTemp
    {
        PartitionKey = x.Element("ISO639")?.Value,
        ImdbId = imdbId,
        RowKey = x.Element("IDSubtitle")?.Value,
        Link = x.Element("IDSubtitle")?.Attribute("Link")?.Value,
        LinkDownload = x.Element("IDSubtitle")?.Attribute("LinkDownload")?.Value,
        ReleaseName = x.Element("MovieReleaseName")?.Value,
        OtherReleases = string.Empty
    }).ToList();

    var allSubs = new List<SubtitleTemp>();

    subs.ForEach(sub =>
    {
        log.Info($"Requesting http://www.opensubtitles.org{sub.Link}/xml");
        var subXml = GetXDocumentResponse($"http://www.opensubtitles.org{sub.Link}/xml", log);

        if (subXml == null)
        {
            return;
        }

        var otherSubs = subXml.XPathSelectElements("//opensubtitles/SubBrowse/Subtitle/OtherSubtitles").Select(x => new SubtitleTemp
        {
            PartitionKey = sub.PartitionKey,
            RowKey = x.Element("Subtitle")?.Attribute("LinkDownload")?.Value?.Split('/').Last(),
            Link = x.Element("Subtitle")?.Attribute("Link")?.Value,
            LinkDownload = x.Element("Subtitle")?.Attribute("LinkDownload")?.Value,
            ImdbId = imdbId,
            ReleaseName = x.Element("Subtitle")?.Element("MovieReleaseName")?.Value
        }).ToList();

        var subfiles = subXml.XPathSelectElements("//opensubtitles/SubBrowse/Subtitle/SubtitleFile/Item/CommonMovieFileName")
            .Select(x => x?.Value)
            .Where(x => x != null)
            .DefaultIfEmpty();
        sub.OtherReleases = string.Join("|", subfiles);

        allSubs.Add(sub);
        allSubs.AddRange(otherSubs);
    });

    return allSubs.Select(x => new Subtitle
    {
        PartitionKey = x.PartitionKey,
        RowKey = x.RowKey,
        LinkDownload = x.LinkDownload,
        ImdbId = x.ImdbId,
        ReleaseName = x.ReleaseName,
        OtherReleases = x.OtherReleases ?? string.Empty
    }).ToList();
}