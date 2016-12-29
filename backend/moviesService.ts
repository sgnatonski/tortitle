import {Movie} from "./movie";

export module MoviesService {
    export function getRecentTopMovies(): Movie[] {
        return [
            new Movie("1", "1", "1", "", 7.8),
            new Movie("1", "1", "1", "", 7.8),
            new Movie("1", "1", "1", "", 7.8),
            new Movie("1", "1", "1", "", 7.8),
            new Movie("1", "1", "1", "", 7.8)
        ];
    }
}