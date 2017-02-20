using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Network;
using System.Diagnostics;
using System;
using System.Threading;
using System.Threading.Tasks;

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