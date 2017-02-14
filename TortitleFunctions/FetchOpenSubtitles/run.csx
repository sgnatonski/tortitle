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

public static XDocument GetXDocumentResponse(string url, TraceWriter log)
{
    var rq = (HttpWebRequest)WebRequest.Create(url);
    rq.Timeout = 60000;
    rq.ReadWriteTimeout = 60000;
    rq.KeepAlive = false;

    HttpWebResponse response = null;

    try
    {
        response = (HttpWebResponse)rq.GetResponse();
        return GetXml(response);
    }
    catch (WebException e)
    {
        if (e.Status == WebExceptionStatus.ProtocolError)
        {
            response = (HttpWebResponse)e.Response;
            log.Error($"Errorcode: {(int)response.StatusCode}");
        }
        else
        {
            log.Error($"Error: {e.Status}");
        }
    }
    finally
    {
        if (response != null)
        {
            response.Close();
        }
    }
    return null;
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
    public string ImdbId { get; set; }
    public string ReleaseName { get; set; }
    public string OtherReleases { get; set; }
}

public class Subtitle : TableEntity
{
    public string LinkDownload { get; set; }
    public string ImdbId { get; set; }
    public string ReleaseName { get; set; }
    public string OtherReleases { get; set; }
}

public class TorrentMark : TableEntity
{
}
