import * as express from "express";
import { Torrents } from "../backend/Torrents";
import { Subtitles } from "../backend/Subtitles";

function parseRange(range: string, totalSize: number) {
    const split = range.split(/[-=]/);
    const startByte = +split[1];
    const endByte = split[2] ? +split[2] : totalSize - 1;
    return { startByte, endByte };
}

function streamResponse(file: TorrentStream.TorrentFile, res: express.Response) {
    function getContentRangeResponseHeaders(startByte: number, endByte: number, totalSize: number) {
        return {
            "Connection": "keep-alive",
            "Content-Range": `bytes ${startByte}-${endByte}/${totalSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": `${endByte - startByte + 1}`,
            "Content-Type": "video/webm"
        };
    }

    return (range: { startByte: number, endByte: number }) => file
        .createReadStream({ start: range.startByte, end: range.endByte })
        .pipe(res
            .status(206)
            .set(getContentRangeResponseHeaders(range.startByte, range.endByte, file.length)
        )
    );
}

export async function watch(req: express.Request, res: express.Response) {
    res.render("watch", { magnet: req.params.magnet, subid: req.params.subid, subenc: req.params.subenc });
}

export async function watchStream(req: express.Request, res: express.Response) {
    const magnet = atob(req.params.magnet);
    const file = await Torrents.getFileByMagnet(magnet);
    streamResponse(file, res)(parseRange(req.headers.range, file.length));
}

export async function watchSub(req: express.Request, res: express.Response) {
    const sub = await Subtitles.getSubtitle(req.params.subid, req.params.encoding);
    res.end(sub);
}