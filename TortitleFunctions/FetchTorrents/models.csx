#r "Microsoft.WindowsAzure.Storage" 
using Microsoft.WindowsAzure.Storage.Table;

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

public class TorrentMark : TableEntity
{
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
