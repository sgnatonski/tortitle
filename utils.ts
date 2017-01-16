export function uberTrim(s: string) {
    return s && s.length >= 2 && (s[0] === s[s.length - 1])
        ? s.slice(1, -1).trim()
        : s;
}