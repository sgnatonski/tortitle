import * as http from "http";
import * as HTMLParser from 'fast-html-parser';
import * as AdmZip from 'adm-zip';
import * as srtToVtt from "../backend/srtToVtt";
import { default as cache } from "../backend/cache";

export module Subtitles {
    function getDownloadUrl(subid) {
        var entryUrl = 'http://osdownloader.org/en/osdownloader.subtitles-download/subtitles/' + subid;
        return new Promise<string>((resolve, reject) => {
            http.get(entryUrl, resp => {
                resp.setEncoding('utf8');
                let rawData = '';
                resp.on('data', (chunk) => rawData += chunk);
                resp.on('error', e => reject(e));
                resp.on('end', () => {
                        try {
                            const root = HTMLParser.parse(rawData);
                            const dlurl = root.querySelector('#downloadSubtitles').childNodes[0].childNodes[1].attributes.href;
                            resolve(dlurl);
                        } catch (e) {
                            reject(e);
                        }
                    });
            }).end();
        });
    }

    function getSubtitleZip(dlurl) {
        return new Promise<Buffer>((resolve, reject) => {
            http.get(dlurl, resp => {
                const data = [];
                resp.on('data', chunk => data.push(chunk));
                resp.on('error', e => reject(e));
                resp.on('end', () => resolve(Buffer.concat(data)) );
            }).end();
        });
    }

    function unzipSrt(zipBuffer: Buffer) {
        const zip = new AdmZip(zipBuffer);
        const zipEntries = zip.getEntries();
        const srtEntry = zipEntries.find(x => x.entryName.toLowerCase().endsWith('.srt'));
        return zip.readFile(srtEntry, "binary");
    }

    export async function getSubtitle(subid: string, encoding: string) {
        const cacheKey = `subtitle_${subid}`;

        const cachedData = cache.get<Buffer>(cacheKey);
        if (cachedData) {
            return srtToVtt.convertToVtt(cachedData, encoding);
        }

        try {
            const dlurl = await getDownloadUrl(subid);
            const zipBuffer = await getSubtitleZip(dlurl);
            const srtData = await unzipSrt(zipBuffer);
            cache.set(cacheKey, srtData, 7200);
            const vtt = srtToVtt.convertToVtt(srtData, encoding);
            return vtt;           
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }
}