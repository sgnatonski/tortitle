import * as express from "express";
import * as srt2vtt from 'srt-to-vtt';
import * as fs from 'fs';
import { Torrents } from "../backend/Torrents";

function atob(str: string) {
    return new Buffer(str, 'base64').toString('binary');
}

function parseRange(range: string, totalSize: number) {
    const split = range.split(/[-=]/);
    const startByte = +split[1];
    const endByte = split[2] ? +split[2] : totalSize - 1;
    const chunkSize = endByte - startByte + 1;
    return { startByte, endByte, chunkSize };
}

export async function watch(req: express.Request, res: express.Response) {
    res.render("watch", { magnet: req.params.magnet });
}

export async function watchStream(req: express.Request, res: express.Response) {
    const magnet = atob(req.params.magnet);
    const file = await Torrents.getFileByMagnet(magnet);
    const { startByte, endByte, chunkSize } = parseRange(req.headers.range, file.length);

    res.status(206);
    res.set({
        "Connection": "keep-alive",
        "Content-Range": `bytes ${startByte}-${endByte}/${file.length}`,
        "Accept-Ranges": "bytes",
        "Content-Length": `${chunkSize}`,
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
    fs.createReadStream("some-subtitle-file.srt")
        .pipe(srt2vtt())
        .pipe(res);
}