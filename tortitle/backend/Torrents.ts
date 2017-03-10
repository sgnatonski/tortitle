import * as torrentStream from "torrent-stream";
import * as memoryChunkStore from "memory-chunk-store";
import * as Cache from "node-cache";

const magnetCacheKey = 'magnet_';
const magnetTTL = 7200;
const cache = new Cache({ stdTTL: magnetTTL, checkperiod: 120, useClones: false });

cache.on("expired", function (key: string, value) {
    if (key.startsWith(magnetCacheKey)) {
        value.destroy();
    }
});

export module Torrents {
    interface TorrentResolveData {
        engine: TorrentStream.TorrentEngine;
        file: TorrentStream.TorrentFile
    };

    function resolveLargetsFile(engine: TorrentStream.TorrentEngine, resolve) {
        var largest = engine.files.sortByDesc(f => f.length).first();
        engine.files.forEach(file => {
            if (file.name != largest.name) {
                file.deselect();
                console.log(file.name + ' deselected');
            }
        });
        if (largest.name.endsWith('.avi')) {
            largest.deselect();
            console.log(largest.name + ' deselected - not possible to stream');
        }
        else {
            console.log(largest.name + ' selected to stream');
        }
        resolve({ engine: engine, file: largest });
    }

    function getFileFromEngine(magnet: string, engine?: TorrentStream.TorrentEngine) {
        return new Promise<TorrentResolveData>((resolve, reject) => {
            if (!engine) {
                engine = torrentStream(magnet, { storage: memoryChunkStore });
                engine.on("ready", () => resolveLargetsFile(engine, resolve));
            }
            if (engine.files && engine.files.length) {
                resolveLargetsFile(engine, resolve);
            }
        });
    }

    export async function getFileByMagnet(magnet: string) {        
        const cached = cache.get<TorrentStream.TorrentEngine>(magnetCacheKey + magnet);
        if (cached) {
            console.log("Torrent fetched from cache " + cached.files.sortByDesc(f => f.length).first().name);
            cache.ttl(magnetCacheKey + magnet, magnetTTL);
            var { engine, file } = await getFileFromEngine(magnet, cached);
            return file;
        }

        var { engine, file } = await getFileFromEngine(magnet);
        cache.set(magnetCacheKey + magnet, engine, magnetTTL);
        return file;
    }
}