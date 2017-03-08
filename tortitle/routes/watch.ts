import * as express from "express";
import * as torrentStream from "torrent-stream";
import * as memoryChunkStore from "memory-chunk-store";
import * as srt2vtt from 'srt-to-vtt';
import * as fs from 'fs';

var engine;

function resolveLargetsFile(resolve) {
    var file = (<any[]>engine.files).sortByDesc(f => f.length).first();
    console.log('filename:', file.name);
    resolve(file);
}

function getFileByMagnet(magnet: string) {
    return new Promise<any>((resolve, reject) => {
        if (!engine) {
            engine = torrentStream(magnet, { storage: memoryChunkStore }, () => resolveLargetsFile(resolve));
        }
    });
}

export async function watch(req: express.Request, res: express.Response) {
    res.render('watch', { magnet: req.params.magnet });
}

export async function watchStream(req: express.Request, res: express.Response) {

    function atob(str) {
        return new Buffer(str, 'base64').toString('binary');
    }

    var magnet = atob(req.params.magnet);
    
    var file = await getFileByMagnet(magnet);
    var range = req.headers.range;
    var split = range.split(/[-=]/);
    var startByte = +split[1];
    var endByte = split[2] ? +split[2] : file.length - 1;
    var chunkSize = endByte - startByte + 1;

    res.status(206);
    res.set('Connection', 'keep-alive');
    res.set("Content-Range", "bytes " + startByte + "-" + endByte + "/" + file.length);
    res.set("Accept-Ranges", "bytes");
    res.set("Content-Length", "" + chunkSize);
    res.set("Content-Type", "video/webm");

    var stream = file.createReadStream({
        start: startByte,
        end: endByte
    });
    stream.pipe(res);

    stream.on('error', (err) => {
        console.log(err);
    });
}

export async function watchSub(req: express.Request, res: express.Response) {
    fs.createReadStream('some-subtitle-file.srt')
        .pipe(srt2vtt())
        .pipe(res);
}