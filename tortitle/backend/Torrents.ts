import * as torrentStream from "torrent-stream";
import * as memoryChunkStore from "memory-chunk-store";

var engine;

export module Torrents {

    function resolveLargetsFile(resolve) {
        var file = (<any[]>engine.files).sortByDesc(f => f.length).first();
        console.log('filename:', file.name);
        resolve(file);
    }

    export function getFileByMagnet(magnet: string) {
        return new Promise<any>((resolve, reject) => {
            if (!engine) {
                engine = torrentStream(magnet, { storage: memoryChunkStore }, () => resolveLargetsFile(resolve));
            }
            if (engine.files) {
                resolveLargetsFile(resolve);
            }
        });
    }
}