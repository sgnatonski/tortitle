import * as express from "express";
import { Torrents } from "../backend/Torrents";
import { Subtitles } from "../backend/Subtitles";

function atob(str: string) {
    return new Buffer(str, 'base64').toString('binary');
}

function parseRange(range: string, totalSize: number) {
    const split = range.split(/[-=]/);
    const startByte = +split[1];
    const endByte = split[2] ? +split[2] : totalSize - 1;
    return { startByte, endByte };
}

function getContentRangeResponseHeaders(startByte: number, endByte: number, totalSize: number) {
    return {
        "Connection": "keep-alive",
        "Content-Range": `bytes ${startByte}-${endByte}/${totalSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": `${endByte - startByte + 1}`,
        "Content-Type": "video/webm"
    };
}

export async function watch(req: express.Request, res: express.Response) {
    res.render("watch", { magnet: req.params.magnet, subid: req.params.subid, subenc: req.params.subenc });
}

export async function watchStream(req: express.Request, res: express.Response) {
    const magnet = atob(req.params.magnet);
    const file = await Torrents.getFileByMagnet(magnet);
    const { startByte, endByte } = parseRange(req.headers.range, file.length);

    res.status(206);
    res.set(getContentRangeResponseHeaders(startByte, endByte, file.length));

    file.createReadStream({
        start: startByte,
        end: endByte
    }).on('error', (err) => {
        console.log(err);
    }).pipe(res);
}

export async function watchSub(req: express.Request, res: express.Response) {
    var sub = await Subtitles.getSubtitle(req.params.subid, req.params.encoding);
    if (sub) {
        res.write(sub);
    }
    res.end();
}