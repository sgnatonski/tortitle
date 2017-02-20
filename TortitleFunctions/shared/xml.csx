#r "System.Xml.Linq"
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Net;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;

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

static XDocument GetXml(HttpWebResponse response)
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