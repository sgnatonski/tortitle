#r "System.Xml.Linq" 
#r "Microsoft.WindowsAzure.Storage" 
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Net;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;

public static async Task Run(TimerInfo timer, CloudTable imdbTable, CloudTable subtitlesTable, TraceWriter log)
{
    var query = imdbTable.CreateQuery<ImdbMovie>().Where(d => d.AdddedAt >= DateTime.Now.AddHours(-2).AddMinutes(-30));
    foreach (var entity in query.ToList())
    {
        log.Info($"Requesting http://www.opensubtitles.org/en/search/imdbid-{entity.RowKey}/xml");
        var subs = await GetSubs(entity.RowKey);
        subs.ForEach(x =>
        {
            TableOperation operation = TableOperation.InsertOrReplace(x);
            TableResult result = subtitlesTable.Execute(operation);
        });
    }
}

public static async Task<List<Subtitle>> GetSubs(string imdbId)
{
    var rq = (HttpWebRequest)WebRequest.Create($"http://www.opensubtitles.org/en/search/imdbid-{imdbId}/xml");
    rq.Timeout = 1000;
    rq.ReadWriteTimeout = 10000;

    var response = await rq.GetResponseAsync() as HttpWebResponse;

    using (var responseStream = response.GetResponseStream())
    {
        XmlTextReader reader = new XmlTextReader(responseStream);
        var osXml = XDocument.Load(reader, LoadOptions.None);
        var subs = osXml.XPathSelectElements("//opensubtitles/search/results/subtitle").Select(x => new Subtitle
        {
            PartitionKey = imdbId,
            RowKey = x.Element("IDSubtitle")?.Value,
            LinkDownload = x.Element("IDSubtitle")?.Attribute("LinkDownload")?.Value,
            Language = x.Element("ISO639")?.Value,
            ReleaseName = x.Element("MovieReleaseName")?.Value
        }).Where(x => x.PartitionKey != null && x.RowKey != null).ToList();
        return subs;
    }
}

public class Subtitle : TableEntity
{
    public string LinkDownload { get; set; }
    public string Language { get; set; }
    public string ReleaseName { get; set; }
}

public class ImdbMovie : TableEntity
{
    public string MovieName { get; set; }
    public double Rating { get; set; }
    public string PictureLink { get; set; }
    public DateTimeOffset AdddedAt { get; set; }
}
