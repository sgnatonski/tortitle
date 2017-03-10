import * as http from "http";
import * as srt2vtt from 'srt2vtt';
import { Readable } from 'stream';
import * as HTMLParser from 'fast-html-parser';
import * as AdmZip from 'adm-zip';
import * as iconv from 'iconv-lite';

export module Subtitles {
    function getDownloadUrl(subid) {
        var entryUrl = 'http://osdownloader.org/en/osdownloader.subtitles-download/subtitles/' + subid;
        return new Promise<string>((resolve, reject) => {
            http.get(entryUrl, resp => {
                resp.setEncoding('utf8');
                let rawData = '';
                resp.on('data', (chunk) => rawData += chunk)
                    .on('error', e => reject(e))
                    .on('end', () => {
                        try {
                            const root = HTMLParser.parse(rawData);
                            const dlurl = root.querySelector('#downloadSubtitles').childNodes[0].childNodes[1].attributes.href;
                            resolve(dlurl);
                        } catch (e) {
                            reject(e);
                        }
                    });
            });
        });
    }

    function getSubtitleZip(dlurl) {
        return new Promise<Buffer>((resolve, reject) => {
            http.get(dlurl, resp => {
                const data = [];
                resp.on('data', chunk => data.push(chunk))
                    .on('error', e => reject(e))
                    .on('end', () => resolve(Buffer.concat(data)));
            });
        });
    }

    function convertToVtt(srtData) {
        const annoyingCreditText = 'NOTE Converted from .srt via srt2vtt: https://github.com/deestan/srt2vtt\n\n';
        return new Promise<string>((resolve, reject) => {
            srt2vtt(srtData, (err, vttData) => {
                if (err) return reject(err);
                //var decodedVtt = iconv.decode(vttData, 'utf-8').replace(annoyingCreditText, '');
                //console.log(decodedVtt);
                const vtt = vttData.toString().replace(annoyingCreditText, '');
                resolve(vtt);
            });
        });
    }

    export async function getSubtitle(subid){
        try {
            const dlurl = await getDownloadUrl(subid);
            const zipBuffer = await getSubtitleZip(dlurl);
            const zip = new AdmZip(zipBuffer);
            const zipEntries = zip.getEntries();
            const srtEntry = zipEntries.find(x => x.entryName.toLowerCase().endsWith('.srt'));
            const srtData = zip.readFile(srtEntry, "binary");
            const vtt = await convertToVtt(srtData); 
            return vtt;           
        } catch (e) {
            console.log(e.message);
        }
    }
}