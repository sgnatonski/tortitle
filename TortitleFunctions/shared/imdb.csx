public static class ImdbQueryProvider
{
    public static string OriginalTitleQuery => "#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > div.originalTitle";
    public static string TitleQuery => "#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1";
    public static string RatingQuery => "#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span";
    public static string PictureQuery => "#title-overview-widget > div.vital > div.slate_wrapper > div.poster > a > img";
    public static string PosterQuery => "#title-overview-widget > div > div.poster > a > img";
    public static string YearQuery => "#titleYear > a";
}