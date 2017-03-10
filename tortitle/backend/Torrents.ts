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

    function resolveLargetsFile(engine, resolve) {
        var file = (<any[]>engine.files).sortByDesc(f => f.length).first();
        console.log('filename:', file.name);
        resolve({ engine, file });
    }

    function getFileFromEngine(magnet: string, engine?: any) {
        return new Promise<any>((resolve, reject) => {
            if (!engine) {
                engine = torrentStream(magnet, { storage: memoryChunkStore });
                engine.on("ready", () => resolveLargetsFile(engine, resolve));
                engine.on('download', () => console.log('Downloaded portion of', (<any[]>engine.files).sortByDesc(f => f.length).first().name));
            }
            if (engine.files && engine.files.length) {
                resolveLargetsFile(engine, resolve);
            }
        });
    }

    export async function getFileByMagnet(magnet: string) {        
        const cached = cache.get<any>(magnetCacheKey + magnet);
        if (cached) {
            console.log("Torrent fetched from cache " + (<any[]>cached.files).sortByDesc(f => f.length).first().name);
            cache.ttl(magnetCacheKey + magnet, magnetTTL);
            var { engine, file } = await getFileFromEngine(magnet, cached);
            return file;
        }

        var { engine, file } = await getFileFromEngine(magnet);
        cache.set<any>(magnetCacheKey + magnet, engine, magnetTTL);
        return file;
    }
}