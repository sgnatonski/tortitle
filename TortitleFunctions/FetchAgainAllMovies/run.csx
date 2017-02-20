#load "../shared/models.csx"
#load "../shared/request.csx"
using System;

public static void Run(string input, CloudTable imdbTable, CloudTable torrentMarksTable, TraceWriter log)
{
    var query = imdbTable.CreateQuery<ImdbMovie>().AsQueryable().ToList();

    var imdbs = query.Select(m =>
    {
        var imdbId = m.RowKey;
        var mark = new TorrentMark { PartitionKey = "0", RowKey = imdbId };
        torrentMarksTable.Execute(TableOperation.InsertOrReplace(mark));

        var imdbPage = TortitleRequest.Open(new Uri($"http://www.imdb.com/title/tt{imdbId}/"), null);

        var originalTitle = imdbPage.QuerySelector(ImdbQueryProvider.OriginalTitleQuery)?.TextContent.Replace("(original title)", "");
        var movieName = originalTitle != null
            ? $"{originalTitle} ({imdbPage.QuerySelector(ImdbQueryProvider.YearQuery)?.TextContent})"
            : imdbPage.QuerySelector(ImdbQueryProvider.TitleQuery)?.TextContent;
        var ratingText = imdbPage.QuerySelector(ImdbQueryProvider.RatingQuery)?.TextContent;
        var pictureUrl = imdbPage.QuerySelector(ImdbQueryProvider.PictureQuery)?.GetAttribute("src")
            ?? imdbPage.QuerySelector(ImdbQueryProvider.PosterQuery)?.GetAttribute("src")
            ?? string.Empty;
        var rating = !string.IsNullOrEmpty(ratingText) ? double.Parse(ratingText.Replace(',', '.'), System.Globalization.CultureInfo.InvariantCulture) : 0;

        return new ImdbMovie
        {
            PartitionKey = "0",
            RowKey = imdbId,
            MovieName = movieName.Trim(),
            Rating = rating,
            PictureLink = pictureUrl,
            AdddedAt = DateTimeOffset.UtcNow
        };
    });

    var distImdbs = imdbs.GroupBy(x => x.ImdbId).Select(x => x.First()).ToList();

    distImdbs.ForEach(x =>
    {
        imdbTable.Execute(TableOperation.InsertOrReplace(x));
    });
}