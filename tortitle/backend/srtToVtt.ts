import * as iconv from 'iconv-lite';

export function convertToVtt(srtData: Buffer, encoding: string) {
    const vttHeader = 'WEBVTT';
    const newLine = '\r\n';
    const data = iconv.decode(srtData, encoding);
    const lines = data.split(newLine)
        .map(line => line
            .replace(/\{\\([ibu])\}/g, '</$1>')
            .replace(/\{\\([ibu])1\}/g, '<$1>')
            .replace(/\{([ibu])\}/g, '<$1>')
            .replace(/\{\/([ibu])\}/g, '</$1>')
            .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
        );

    return `${vttHeader}${newLine}${lines.join(newLine)}`;
}