#r "Microsoft.WindowsAzure.Storage" 
using Microsoft.WindowsAzure.Storage.Table;

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