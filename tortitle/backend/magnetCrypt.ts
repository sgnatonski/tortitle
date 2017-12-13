import * as crypto from "crypto";

const crypt = {};

export function hashMagnet(cid: string, magnet: string) {
    const value = `${cid}:${magnet}`;
    var hash = crypto.createHash('md5').update(value).digest('hex');
    crypt[hash] = { cid: cid, magnet: magnet };
    return hash;
}

export function dehashMagnet(hash): { cid: string, magnet: string } {
    return crypt[hash];
}