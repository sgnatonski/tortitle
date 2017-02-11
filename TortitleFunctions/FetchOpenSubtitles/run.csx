#r "System.Xml.Linq" 
#r "Microsoft.WindowsAzure.Storage" 
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Net;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;

public static async Task Run(TimerInfo timer, CloudTable torrentsMarksTable, CloudTable subtitlesTable, TraceWriter log)
{
    var query = torrentsMarksTable.CreateQuery<TorrentMark>().AsQueryable().Take(1);
    var list = query.ToList();
    foreach (var entity in list)
    {
        var subs = await GetSubs(entity.RowKey, log);
        subs.ForEach(x =>
        {
            TableOperation operation = TableOperation.InsertOrReplace(x);
            TableResult result = subtitlesTable.Execute(operation);
        });
        torrentsMarksTable.Execute(TableOperation.Delete(entity));
    }
}

public static async Task<List<Subtitle>> GetSubs(string imdbId, TraceWriter log)
{
    log.Info($"Requesting http://www.opensubtitles.org/en/search/imdbid-{imdbId}/xml");
    var rq = (HttpWebRequest)WebRequest.Create($"http://www.opensubtitles.org/en/search/imdbid-{imdbId}/xml");
    rq.Timeout = 60000;
    rq.ReadWriteTimeout = 60000;
    rq.KeepAlive = false;

    var response = await rq.GetResponseAsync() as HttpWebResponse;

    var osXml = GetXml(response);
    response.Dispose();

    var subs = osXml.XPathSelectElements("//opensubtitles/search/results/subtitle").Select(x => new SubtitleTemp
    {
        PartitionKey = imdbId,
        RowKey = x.Element("IDSubtitle")?.Value,
        Link = x.Element("IDSubtitle")?.Attribute("Link")?.Value,
        LinkDownload = x.Element("IDSubtitle")?.Attribute("LinkDownload")?.Value,
        Language = x.Element("ISO639")?.Value,
        ReleaseName = x.Element("MovieReleaseName")?.Value,
        OtherReleases = string.Empty
    }).Where(x => x.RowKey != null).ToList();

    var allSubs = new List<SubtitleTemp>();

    subs.ForEach(sub =>
    {
        log.Info($"Requesting http://www.opensubtitles.org{sub.Link}/xml");
        var subrq = (HttpWebRequest)WebRequest.Create($"http://www.opensubtitles.org{sub.Link}/xml");
        subrq.Timeout = 60000;
        subrq.ReadWriteTimeout = 60000;
        subrq.KeepAlive = false;

        var subresp = subrq.GetResponse() as HttpWebResponse;

        var subXml = GetXml(subresp);
        subresp.Dispose();

        var otherSubs = subXml.XPathSelectElements("//opensubtitles/SubBrowse/Subtitle/OtherSubtitles").Select(x => new SubtitleTemp
        {
            PartitionKey = imdbId,
            RowKey = x.Element("Subtitle")?.Attribute("LinkDownload")?.Value?.Split('/').Last(),
            Link = x.Element("Subtitle")?.Attribute("Link")?.Value,
            LinkDownload = x.Element("Subtitle")?.Attribute("LinkDownload")?.Value,
            Language = sub.Language,
            ReleaseName = x.Element("Subtitle")?.Element("MovieReleaseName")?.Value
        }).Where(x => x.PartitionKey != null && x.RowKey != null).ToList();

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
        Language = x.Language,
        ReleaseName = x.ReleaseName,
        OtherReleases = x.OtherReleases ?? string.Empty
    }).ToList();
}

public static XDocument GetXml(HttpWebResponse response)
{
    using (Stream stream = response.GetResponseStream())
    {
        StreamReader reader = new StreamReader(stream, System.Text.Encoding.UTF8);
        string _byteOrderMarkUtf8 = System.Text.Encoding.UTF8.GetString(System.Text.Encoding.UTF8.GetPreamble());
        var xml = reader.ReadToEnd();
        if (xml.StartsWith(_byteOrderMarkUtf8))
        {
            var lastIndexOfUtf8 = _byteOrderMarkUtf8.Length - 1;
            xml = xml.Remove(0, lastIndexOfUtf8);
        }
        return XDocument.Parse(xml, LoadOptions.None);
    }
}

public class SubtitleTemp
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Link { get; set; }
    public string LinkDownload { get; set; }
    public string Language { get; set; }
    public string ReleaseName { get; set; }
    public string OtherReleases { get; set; }
}
public class Subtitle : TableEntity
{
    public string LinkDownload { get; set; }
    public string Language { get; set; }
    public string ReleaseName { get; set; }
    public string OtherReleases { get; set; }
}

public class TorrentMark : TableEntity
{
}
