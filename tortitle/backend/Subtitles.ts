import * as http from "http";
import * as HTMLParser from 'fast-html-parser';
import * as AdmZip from 'adm-zip';
import * as iconv from 'iconv-lite';
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

    function convertToVtt(srtData: Buffer, encoding: string) {
        const data = iconv.decode(srtData, encoding);
        var lines = data.split('\r\n').map(line => {
            return line
                .replace(/\{\\([ibu])\}/g, '</$1>')
                .replace(/\{\\([ibu])1\}/g, '<$1>')
                .replace(/\{([ibu])\}/g, '<$1>')
                .replace(/\{\/([ibu])\}/g, '</$1>')
                .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
        });
        
        return 'WEBVTT\r\n' + lines.join('\r\n');
    }

    export async function getSubtitle(subid: string, encoding: string) {
        const cacheKey = `subtitle_${subid}`;

        const cachedData = cache.get<Buffer>(cacheKey);
        if (cachedData) {
            return convertToVtt(cachedData, encoding);
        }

        try {
            const dlurl = await getDownloadUrl(subid);
            const zipBuffer = await getSubtitleZip(dlurl);
            console.log(zipBuffer.byteLength);
            const zip = new AdmZip(zipBuffer);
            const zipEntries = zip.getEntries();
            const srtEntry = zipEntries.find(x => x.entryName.toLowerCase().endsWith('.srt'));
            const srtData = zip.readFile(srtEntry, "binary");
            cache.set(cacheKey, srtData, 7200);
            const vtt = convertToVtt(srtData, encoding);
            return vtt;           
        } catch (e) {
            console.log(e);
        }
    }
}