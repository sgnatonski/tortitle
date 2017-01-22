#r "Microsoft.WindowsAzure.Storage" 
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Threading;
using System.Threading.Tasks;
using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Network;
using System.Diagnostics;

public static async Task Run(TimerInfo timer, CloudTable imdbTable, CloudTable torrentsTable, TraceWriter log)
{
    var token = new CancellationToken();
    var pb = new
    {
        ListUrl = "https://thepiratebay.org/top/201",
        PageBaseUrl = "https://thepiratebay.org/",
        ListItemSelector = "#searchResult > tbody > tr > td > div > a"
    };
    var document = await TortitleRequest.OpenAsync(new Uri(pb.ListUrl), token);

    var entries = document.QuerySelectorAll(pb.ListItemSelector)
        .Select(c => new
        {
            Text = c.TextContent,
            Href = c.GetAttribute("href")?.Trim().Trim('/') + '/'
        })
        .Select(m => new
        {
            Title = m.Text,
            Quality = ExtractQuality(m.Text),
            TorrentPage = pb.PageBaseUrl + m.Href
        }).ToList();

    var imdbs = entries.AsParallel().Select(entry =>
    {
        var entryDoc = TortitleRequest.Open(new Uri(entry.TorrentPage), token);
        log.Info($"Fetched: {entry.TorrentPage}");
        var links = entryDoc.QuerySelectorAll("a");
        var tmp = links.Select(x => x.GetAttribute("href")?.Trim('\r', '\n')).ToList();
        var imdbLink = tmp.FirstOrDefault(x => x != null && x.StartsWith("http://www.imdb.com/title/"));

        if (!string.IsNullOrEmpty(imdbLink))
        {
            var imdbUri = new Uri(imdbLink.Replace("reference", "")?.Trim().TrimEnd('/') + '/');
            var imdbId = ExtractImdbId(imdbUri).ToString();

            var entity = new Torrent { PartitionKey = "0", RowKey = entry.Title, TorrentLink = entry.TorrentPage, Quality = entry.Quality, ImdbId = imdbId, AdddedAt = DateTimeOffset.UtcNow };
            TableOperation toperation = TableOperation.InsertOrMerge(entity);
            TableResult tresult = torrentsTable.Execute(toperation);

            TableOperation operation = TableOperation.Retrieve<ImdbMovie>("0", imdbId);
            TableResult result = imdbTable.Execute(operation);
            ImdbMovie imdbMovie = (ImdbMovie)result.Result;
            if (imdbMovie?.AdddedAt > DateTimeOffset.UtcNow.AddDays(-7))
            {
                return new TempEntry
                {
                    TorrentLink = entry.TorrentPage,
                    Quality = entry.Quality,
                    ImdbLink = $"http://www.imdb.com/title/tt{imdbId}/",
                    ImdbId = imdbId,
                    MovieName = imdbMovie.MovieName,
                    Rating = imdbMovie.Rating,
                    PictureLink = imdbMovie.PictureLink
                };
            }

            var imdbPage = TortitleRequest.Open(new Uri($"http://www.imdb.com/title/tt{imdbId}/"), token);

            var originalTitle = imdbPage.QuerySelector(ImdbQueryProvider.OriginalTitleQuery)?.TextContent.Replace("(original title)", "");
            var movieName = originalTitle != null
                ? $"{originalTitle} ({imdbPage.QuerySelector(ImdbQueryProvider.YearQuery)?.TextContent})"
                : imdbPage.QuerySelector(ImdbQueryProvider.TitleQuery)?.TextContent;
            var ratingText = imdbPage.QuerySelector(ImdbQueryProvider.RatingQuery)?.TextContent;
            var pictureUrl = imdbPage.QuerySelector(ImdbQueryProvider.PictureQuery)?.GetAttribute("src")
                ?? imdbPage.QuerySelector(ImdbQueryProvider.PosterQuery)?.GetAttribute("src")
                ?? string.Empty;
            var rating = !string.IsNullOrEmpty(ratingText) ? double.Parse(ratingText.Replace(',', '.'), System.Globalization.CultureInfo.InvariantCulture) : 0;

            return new TempEntry
            {
                TorrentLink = entry.TorrentPage,
                Quality = entry.Quality,
                ImdbLink = imdbLink,
                ImdbId = imdbId,
                MovieName = movieName.Trim(),
                Rating = rating,
                PictureLink = pictureUrl
            };
        }
        return null;
    }).Where(x => x != null).ToList();

    var distImdbs = imdbs.GroupBy(x => x.ImdbId).Select(x => x.First()).ToList();

    distImdbs.ForEach(x =>
    {
        var entity = new ImdbMovie { PartitionKey = "0", RowKey = x.ImdbId, MovieName = x.MovieName, Rating = x.Rating, PictureLink = x.PictureLink, AdddedAt = DateTimeOffset.UtcNow };
        TableOperation operation = TableOperation.InsertOrReplace(entity);
        TableResult result = imdbTable.Execute(operation);
    });

    log.Info($"C# Timer trigger function executed at: {DateTime.Now}");
}

private static int ExtractImdbId(Uri uri)
{
    var id = 0;
    if (uri == null)
    {
        return id;
    }

    int.TryParse(uri.Segments[2].Substring(2).TrimEnd('/'), out id);

    return id;
}

private static string ExtractQuality(string moviename)
{
    var m = moviename.ToLower().Split(' ', '.', '_', '(', ')', '[', ']');
    var tags = new[]
    {
                "dvdscr", "camrip", "hdcam", "tc", "hdtc", "hdts", "hd-ts",
                "hdrip", "hd-rip", "dvdrip", "brrip", "bdrip", "webrip", "web-dl"
            };

    return string.Join(" ", m.Intersect(tags)) ?? string.Empty;
}

public static class TortitleRequest
{
    private static IBrowsingContext context;

    static TortitleRequest()
    {
        var config = Configuration.Default.WithDefaultLoader();
        context = BrowsingContext.New(config);
    }

    public static DocumentRequest Build(string uri)
    {
        var documentRequest = new DocumentRequest(new Url(uri));
        documentRequest.Headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
        documentRequest.Headers["Accept-Charset"] = "utf-8";
        documentRequest.Headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";
        return documentRequest;
    }

    public static IDocument Open(Uri uri, CancellationToken cancellationToken)
    {
        var sw = Stopwatch.StartNew();
        var doc = Task.Run(async () => await context.OpenAsync(Build(uri.AbsoluteUri), cancellationToken)).Result;
        Debug.WriteLine($"{uri} took {sw.ElapsedMilliseconds} ms");
        return doc;
    }

    public static async Task<IDocument> OpenAsync(Uri uri, CancellationToken cancellationToken)
    {
        var sw = Stopwatch.StartNew();
        var doc = await context.OpenAsync(Build(uri.AbsoluteUri), cancellationToken);
        Debug.WriteLine($"{uri} took {sw.ElapsedMilliseconds} ms");
        return doc;
    }
}

public static class ImdbQueryProvider
{
    public static string OriginalTitleQuery => "#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > div.originalTitle";
    public static string TitleQuery => "#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1";
    public static string RatingQuery => "#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span";
    public static string PictureQuery => "#title-overview-widget > div.vital > div.slate_wrapper > div.poster > a > img";
    public static string PosterQuery => "#title-overview-widget > div > div.poster > a > img";
    public static string YearQuery => "#titleYear > a";
}

public class ImdbMovie : TableEntity
{
    public string MovieName { get; set; }
    public double Rating { get; set; }
    public string PictureLink { get; set; }
    public DateTimeOffset AdddedAt { get; set; }
}

public class Torrent : TableEntity
{
    public string ImdbId { get; set; }
    public string Quality { get; set; }
    public string TorrentLink { get; set; }
    public DateTimeOffset AdddedAt { get; set; }
}

public class TempEntry
{
    public string TorrentLink { get; set; }
    public string Quality { get; set; }
    public string ImdbLink { get; set; }
    public string ImdbId { get; set; }
    public string MovieName { get; set; }
    public double Rating { get; set; }
    public string PictureLink { get; set; }
}
