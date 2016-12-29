export class Movie {
    constructor(
        public name: string,
        public torrent: string,
        public imdbId: string,
        public subtitleLink: string,
        public rating: number
    ) { }
}