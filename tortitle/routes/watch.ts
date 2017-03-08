import * as http from "http";
import * as express from "express";
import * as srt2vtt from 'srt-to-vtt';
import { Readable } from 'stream';
import * as HTMLParser from 'fast-html-parser';
import * as AdmZip from 'adm-zip';
import { Torrents } from "../backend/Torrents";

function atob(str: string) {
    return new Buffer(str, 'base64').toString('binary');
}

function parseRange(range: string, totalSize: number) {
    const split = range.split(/[-=]/);
    const startByte = +split[1];
    const endByte = split[2] ? +split[2] : totalSize - 1;
    return { startByte, endByte };
}

export async function watch(req: express.Request, res: express.Response) {
    res.render("watch", { magnet: req.params.magnet, subid: req.params.subid });
}

export async function watchStream(req: express.Request, res: express.Response) {
    const magnet = atob(req.params.magnet);
    const file = await Torrents.getFileByMagnet(magnet);
    const { startByte, endByte } = parseRange(req.headers.range, file.length);

    res.status(206);
    res.set({
        "Connection": "keep-alive",
        "Content-Range": `bytes ${startByte}-${endByte}/${file.length}`,
        "Accept-Ranges": "bytes",
        "Content-Length": `${endByte - startByte + 1}`,
        "Content-Type": "video/webm"
    });

    file.createReadStream({
        start: startByte,
        end: endByte
    }).on('error', (err) => {
        console.log(err);
    }).pipe(res);
}

export async function watchSub(req: express.Request, res: express.Response) {
    var subid = req.params.subid;
    var entryUrl = 'http://osdownloader.org/en/osdownloader.subtitles-download/subtitles/' + subid;
    http.get(entryUrl, resp => {
        resp.setEncoding('utf8');
        let rawData = '';
        resp.on('data', (chunk) => rawData += chunk);
        resp.on('end', () => {
            try {
                var root = HTMLParser.parse(rawData);
                var dlurl = root.querySelector('#downloadSubtitles').childNodes[0].childNodes[1].attributes.href;
                http.get(dlurl, subres => {
                    var data = [], dataLen = 0;
                    subres.on('data', function (chunk) {
                        data.push(chunk);
                        dataLen += chunk.length;
                    }).on('end', function () {
                        var buf = new Buffer(dataLen);

                        for (var i = 0, len = data.length, pos = 0; i < len; i++) {
                            data[i].copy(buf, pos);
                            pos += data[i].length;
                        }

                        var zip = new AdmZip(buf);
                        var zipEntries = zip.getEntries() as any[];

                        var strEntry = zipEntries.find(x => (<string>x.entryName).toLowerCase().endsWith('.srt'));
                        console.log(zip.readAsText(strEntry));
                        var srtStream = new Readable();
                        srtStream.push(zip.readAsText(strEntry));
                        srtStream.push(null);
                        srtStream.pipe(srt2vtt()).pipe(res);
                    });
                });
            } catch (e) {
                console.log(e.message);
            }
        });
    });
}