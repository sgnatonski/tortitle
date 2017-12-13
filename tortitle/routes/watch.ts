import * as express from "express";
import { Torrents } from "../backend/Torrents";
import { Subtitles } from "../backend/Subtitles";
import * as magnetCrypt from "../backend/magnetCrypt";

const cidCookie = 'cid';

function parseRange(range: string, totalSize: number) {
    const split = range.split(/[-=]/);
    const startByte = +split[1];
    const endByte = split[2] ? +split[2] : totalSize - 1;
    return { startByte, endByte };
}

function streamResponse(file: TorrentStream.TorrentFile, res: express.Response) {
    return (range: { startByte: number, endByte: number }) => file
        .createReadStream({ start: range.startByte, end: range.endByte })
        .pipe(res
            .status(206)
            .set({
                "Connection": "keep-alive",
                "Content-Range": `bytes ${range.startByte}-${range.endByte}/${file.length}`,
                "Accept-Ranges": "bytes",
                "Content-Length": `${range.endByte - range.startByte + 1}`,
                "Content-Type": "video/webm"
            }
        )
    );
}

export async function watch(req: express.Request, res: express.Response) {
    res.render("watch", { magnet: req.params.magnet, subid: req.params.subid, subenc: req.params.subenc });
}

export async function watchStream(req: express.Request, res: express.Response) {
    const magnetHash = req.params.magnet;
    const cookieCid: string = req.cookies[cidCookie];
    const { cid, magnet } = magnetCrypt.dehashMagnet(magnetHash);
    if (cookieCid !== cid) {
        res.status(400).end();
        return;
    }
    const file = await Torrents.getFileByMagnet(magnet);
    if (file) {
        streamResponse(file, res)(parseRange(req.headers.range, file.length));
    } else {
        res.status(404).end();
    }
}

export async function watchSub(req: express.Request, res: express.Response) {
    const sub = await Subtitles.getSubtitle(req.params.subid, req.params.encoding);
    res.end(sub);
}