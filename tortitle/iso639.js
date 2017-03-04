"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Iso639;
(function (Iso639) {
    Iso639.languages = [
        {
            "code": "ab",
            "language": "Abkhazian"
        },
        {
            "code": "aa",
            "language": "Afar"
        },
        {
            "code": "af",
            "language": "Afrikaans"
        },
        {
            "code": "ak",
            "language": "Akan"
        },
        {
            "code": "sq",
            "language": "Albanian"
        },
        {
            "code": "als",
            "language": "Alemannic"
        },
        {
            "code": "am",
            "language": "Amharic"
        },
        {
            "code": "ang",
            "language": "Anglo-Saxon / Old English"
        },
        {
            "code": "ar",
            "language": "Arabic"
        },
        {
            "code": "an",
            "language": "Aragonese"
        },
        {
            "code": "arc",
            "language": "Aramaic"
        },
        {
            "code": "hy",
            "language": "Armenian"
        },
        {
            "code": "roa-rup",
            "language": "Aromanian"
        },
        {
            "code": "frp",
            "language": "Arpitan / Franco - ProvenÃ§al"
        },
        {
            "code": "as ",
            "language": "Assamese"
        },
        {
            "code": "ast",
            "language": "Asturian"
        },
        {
            "code": "av",
            "language": "Avar"
        },
        {
            "code": "ay",
            "language": "Aymara"
        },
        {
            "code": "az",
            "language": "Azerbaijani"
        },
        {
            "code": "bm",
            "language": "Bambara"
        },
        {
            "code": "map- bms",
            "language": "Banyumasan"
        },
        {
            "code": "ba",
            "language": "Bashkir"
        },
        {
            "code": "eu",
            "language": "Basque"
        },
        {
            "code": "bar",
            "language": "Bavarian"
        },
        {
            "code": "be",
            "language": "Belarusian"
        },
        {
            "code": "bn",
            "language": "Bengali"
        },
        {
            "code": "bh",
            "language": "Bihari"
        },
        {
            "code": "bcl",
            "language": "Bikol"
        },
        {
            "code": "bpy",
            "language": "Bishnupriya Manipuri"
        },
        {
            "code": "bi",
            "language": "Bislama"
        },
        {
            "code": "bs",
            "language": "Bosnian"
        },
        {
            "code": "br",
            "language": "Breton"
        },
        {
            "code": "bug",
            "language": "Buginese"
        },
        {
            "code": "bg",
            "language": "Bulgarian"
        },
        {
            "code": "bxr",
            "language": "Buriat (Russia)"
        },
        {
            "code": "my",
            "language": "Burmese"
        },
        {
            "code": "km",
            "language": "Cambodian"
        },
        {
            "code": "ca",
            "language": "Catalan"
        },
        {
            "code": "ceb",
            "language": "Cebuano"
        },
        {
            "code": "ch",
            "language": "Chamorro"
        },
        {
            "code": "ce",
            "language": "Chechen"
        },
        {
            "code": "chr",
            "language": "Cherokee"
        },
        {
            "code": "chy",
            "language": "Cheyenne"
        },
        {
            "code": "ny",
            "language": "Chichewa"
        },
        {
            "code": "zh",
            "language": "Chinese"
        },
        {
            "code": "cho",
            "language": "Choctaw"
        },
        {
            "code": "cv",
            "language": "Chuvash"
        },
        {
            "code": "kw",
            "language": "Cornish"
        },
        {
            "code": "co",
            "language": "Corsican"
        },
        {
            "code": "cr",
            "language": "Cree"
        },
        {
            "code": "mus",
            "language": "Creek / Muskogee"
        },
        {
            "code": "hr",
            "language": "Croatian"
        },
        {
            "code": "cs",
            "language": "Czech"
        },
        {
            "code": "da",
            "language": "Danish"
        },
        {
            "code": "diq",
            "language": "Dimli"
        },
        {
            "code": "dv",
            "language": "Divehi"
        },
        {
            "code": "nl",
            "language": "Dutch"
        },
        {
            "code": "nds- nl",
            "language": "Dutch Low Saxon"
        },
        {
            "code": "dz",
            "language": "Dzongkha"
        },
        {
            "code": "en",
            "language": "English"
        },
        {
            "code": "eo",
            "language": "Esperanto"
        },
        {
            "code": "et",
            "language": "Estonian"
        },
        {
            "code": "ee",
            "language": "Ewe"
        },
        {
            "code": "ext",
            "language": "Extremaduran"
        },
        {
            "code": "fo",
            "language": "Faroese"
        },
        {
            "code": "far",
            "language": "Farsi"
        },
        {
            "code": "fj",
            "language": "Fijian"
        },
        {
            "code": "fi",
            "language": "Finnish"
        },
        {
            "code": "fr",
            "language": "French"
        },
        {
            "code": "fur",
            "language": "Friulian"
        },
        {
            "code": "gl",
            "language": "Galician"
        },
        {
            "code": "gan",
            "language": "Gan Chinese"
        },
        {
            "code": "lg",
            "language": "Ganda"
        },
        {
            "code": "gbm",
            "language": "Garhwali"
        },
        {
            "code": "ka",
            "language": "Georgian"
        },
        {
            "code": "de",
            "language": "German"
        },
        {
            "code": "gil",
            "language": "Gilbertese"
        },
        {
            "code": "got",
            "language": "Gothic"
        },
        {
            "code": "el",
            "language": "Greek"
        },
        {
            "code": "kl",
            "language": "Greenlandic"
        },
        {
            "code": "gn",
            "language": "Guarani"
        },
        {
            "code": "gu",
            "language": "Gujarati"
        },
        {
            "code": "ht",
            "language": "Haitian"
        },
        {
            "code": "hak",
            "language": "Hakka Chinese"
        },
        {
            "code": "ha",
            "language": "Hausa"
        },
        {
            "code": "haw",
            "language": "Hawaiian"
        },
        {
            "code": "he",
            "language": "Hebrew"
        },
        {
            "code": "hz",
            "language": "Herero"
        },
        {
            "code": "hi",
            "language": "Hindi"
        },
        {
            "code": "ho",
            "language": "Hiri Motu"
        },
        {
            "code": "hu",
            "language": "Hungarian"
        },
        {
            "code": "is",
            "language": "Icelandic"
        },
        {
            "code": "io",
            "language": "Ido"
        },
        {
            "code": "ig",
            "language": "Igbo"
        },
        {
            "code": "ilo",
            "language": "Ilokano"
        },
        {
            "code": "id",
            "language": "Indonesian"
        },
        {
            "code": "ia",
            "language": "Interlingua"
        },
        {
            "code": "ie",
            "language": "Interlingue"
        },
        {
            "code": "iu",
            "language": "Inuktitut"
        },
        {
            "code": "ik",
            "language": "Inupiak"
        },
        {
            "code": "ga",
            "language": "Irish"
        },
        {
            "code": "it",
            "language": "Italian"
        },
        {
            "code": "ja",
            "language": "Japanese"
        },
        {
            "code": "jv",
            "language": "Javanese"
        },
        {
            "code": "xal",
            "language": "Kalmyk"
        },
        {
            "code": "kn",
            "language": "Kannada"
        },
        {
            "code": "kr",
            "language": "Kanuri"
        },
        {
            "code": "pam",
            "language": "Kapampangan"
        },
        {
            "code": "ks",
            "language": "Kashmiri"
        },
        {
            "code": "csb",
            "language": "Kashubian"
        },
        {
            "code": "kk",
            "language": "Kazakh"
        },
        {
            "code": "khw",
            "language": "Khowar"
        },
        {
            "code": "ki",
            "language": "Kikuyu"
        },
        {
            "code": "ky",
            "language": "Kirghiz"
        },
        {
            "code": "rn",
            "language": "Kirundi"
        },
        {
            "code": "tlh",
            "language": "Klingon"
        },
        {
            "code": "kv",
            "language": "Komi"
        },
        {
            "code": "kg",
            "language": "Kongo"
        },
        {
            "code": "ko",
            "language": "Korean"
        },
        {
            "code": "kj",
            "language": "Kuanyama"
        },
        {
            "code": "ku",
            "language": "Kurdish"
        },
        {
            "code": "lad",
            "language": "Ladino / Judeo - Spanish"
        },
        {
            "code": "lan",
            "language": "Lango"
        },
        {
            "code": "lo",
            "language": "Laotian"
        },
        {
            "code": "la",
            "language": "Latin"
        },
        {
            "code": "lv",
            "language": "Latvian"
        },
        {
            "code": "lij",
            "language": "Ligurian"
        },
        {
            "code": "li",
            "language": "Limburgian"
        },
        {
            "code": "ln",
            "language": "Lingala"
        },
        {
            "code": "lt",
            "language": "Lithuanian"
        },
        {
            "code": "jbo",
            "language": "Lojban"
        },
        {
            "code": "lmo",
            "language": "Lombard"
        },
        {
            "code": "nds",
            "language": "Low German / Low Saxon"
        },
        {
            "code": "dsb",
            "language": "Lower Sorbian"
        },
        {
            "code": "lb",
            "language": "Luxembourgish"
        },
        {
            "code": "mk",
            "language": "Macedonian"
        },
        {
            "code": "mg",
            "language": "Malagasy"
        },
        {
            "code": "ms",
            "language": "Malay"
        },
        {
            "code": "ml",
            "language": "Malayalam"
        },
        {
            "code": "mt",
            "language": "Maltese"
        },
        {
            "code": "man",
            "language": "Mandarin"
        },
        {
            "code": "gv",
            "language": "Manx"
        },
        {
            "code": "mi",
            "language": "Maori"
        },
        {
            "code": "mr",
            "language": "Marathi"
        },
        {
            "code": "mh",
            "language": "Marshallese"
        },
        {
            "code": "cdo",
            "language": "Min Dong Chinese"
        },
        {
            "code": "min",
            "language": "Minangkabau"
        },
        {
            "code": "mo",
            "language": "Moldovan"
        },
        {
            "code": "mn",
            "language": "Mongolian"
        },
        {
            "code": "nah",
            "language": "Nahuatl"
        },
        {
            "code": "na",
            "language": "Nauruan"
        },
        {
            "code": "nv",
            "language": "Navajo"
        },
        {
            "code": "ng",
            "language": "Ndonga"
        },
        {
            "code": "nap",
            "language": "Neapolitan"
        },
        {
            "code": "ne",
            "language": "Nepali"
        },
        {
            "code": "new",
            "language": "Newar"
        },
        {
            "code": "pih",
            "language": "Norfolk"
        },
        {
            "code": "nrm",
            "language": "Norman"
        },
        {
            "code": "nd",
            "language": "North Ndebele"
        },
        {
            "code": "se",
            "language": "Northern Sami"
        },
        {
            "code": "nso",
            "language": "Northern Sotho"
        },
        {
            "code": "no",
            "language": "Norwegian"
        },
        {
            "code": "nn",
            "language": "Norwegian Nynorsk"
        },
        {
            "code": "oc",
            "language": "Occitan"
        },
        {
            "code": "oj",
            "language": "Ojibwa"
        },
        {
            "code": "cu",
            "language": "Old Church Slavonic / Old Bulgarian"
        },
        {
            "code": "or",
            "language": "Oriya"
        },
        {
            "code": "om",
            "language": "Oromo"
        },
        {
            "code": "os",
            "language": "Ossetian / Ossetic"
        },
        {
            "code": "pi",
            "language": "Pali"
        },
        {
            "code": "pag",
            "language": "Pangasinan"
        },
        {
            "code": "pa",
            "language": "Panjabi / Punjabi"
        },
        {
            "code": "pap",
            "language": "Papiamentu"
        },
        {
            "code": "ps",
            "language": "Pashto"
        },
        {
            "code": "pdc",
            "language": "Pennsylvania German"
        },
        {
            "code": "ff",
            "language": "Peul"
        },
        {
            "code": "pms",
            "language": "Piedmontese"
        },
        {
            "code": "pl",
            "language": "Polish"
        },
        {
            "code": "pt",
            "language": "Portuguese"
        },
        {
            "code": "qu",
            "language": "Quechua"
        },
        {
            "code": "rm",
            "language": "Raeto Romance"
        },
        {
            "code": "ksh",
            "language": "Ripuarian"
        },
        {
            "code": "rmy",
            "language": "Romani"
        },
        {
            "code": "ro",
            "language": "Romanian"
        },
        {
            "code": "ru",
            "language": "Russian"
        },
        {
            "code": "rw",
            "language": "Rwandi"
        },
        {
            "code": "sm",
            "language": "Samoan"
        },
        {
            "code": "bat- smg",
            "language": "Samogitian"
        },
        {
            "code": "sg",
            "language": "Sango"
        },
        {
            "code": "sa",
            "language": "Sanskrit"
        },
        {
            "code": "sc",
            "language": "Sardinian"
        },
        {
            "code": "sco",
            "language": "Scots"
        },
        {
            "code": "gd",
            "language": "Scottish Gaelic"
        },
        {
            "code": "sr",
            "language": "Serbian"
        },
        {
            "code": "sh",
            "language": "Serbo- Croatian"
        },
        {
            "code": "sn",
            "language": "Shona"
        },
        {
            "code": "ii",
            "language": "Sichuan Yi"
        },
        {
            "code": "scn",
            "language": "Sicilian"
        },
        {
            "code": "sd",
            "language": "Sindhi"
        },
        {
            "code": "si",
            "language": "Sinhalese"
        },
        {
            "code": "sk",
            "language": "Slovak"
        },
        {
            "code": "sl",
            "language": "Slovenian"
        },
        {
            "code": "so",
            "language": "Somalia"
        },
        {
            "code": "nr",
            "language": "South Ndebele"
        },
        {
            "code": "st",
            "language": "Southern Sotho"
        },
        {
            "code": "es",
            "language": "Spanish"
        },
        {
            "code": "su",
            "language": "Sundanese"
        },
        {
            "code": "sw",
            "language": "Swahili"
        },
        {
            "code": "ss",
            "language": "Swati"
        },
        {
            "code": "sv",
            "language": "Swedish"
        },
        {
            "code": "tl",
            "language": "Tagalog"
        },
        {
            "code": "ty",
            "language": "Tahitian"
        },
        {
            "code": "tg",
            "language": "Tajik"
        },
        {
            "code": "ta",
            "language": "Tamil"
        },
        {
            "code": "tt",
            "language": "Tatar"
        },
        {
            "code": "te",
            "language": "Telugu"
        },
        {
            "code": "tet",
            "language": "Tetum"
        },
        {
            "code": "th",
            "language": "Thai"
        },
        {
            "code": "bo",
            "language": "Tibetan"
        },
        {
            "code": "ti",
            "language": "Tigrinya"
        },
        {
            "code": "tpi",
            "language": "Tok Pisin"
        },
        {
            "code": "to",
            "language": "Tonga"
        },
        {
            "code": "ts",
            "language": "Tsonga"
        },
        {
            "code": "tn",
            "language": "Tswana"
        },
        {
            "code": "tum",
            "language": "Tumbuka"
        },
        {
            "code": "tr",
            "language": "Turkish"
        },
        {
            "code": "tk",
            "language": "Turkmen"
        },
        {
            "code": "tw",
            "language": "Twi"
        },
        {
            "code": "udm",
            "language": "Udmurt"
        },
        {
            "code": "uk",
            "language": "Ukrainian"
        },
        {
            "code": "ur",
            "language": "Urdu"
        },
        {
            "code": "ug",
            "language": "Uyghur"
        },
        {
            "code": "uz",
            "language": "Uzbek"
        },
        {
            "code": "ve",
            "language": "Venda"
        },
        {
            "code": "vec",
            "language": "Venetian"
        },
        {
            "code": "vi",
            "language": "Vietnamese"
        },
        {
            "code": "vo",
            "language": "VolapÃ¼k"
        },
        {
            "code": "fiu- vro",
            "language": "VÃµro"
        },
        {
            "code": "wa",
            "language": "Walloon"
        },
        {
            "code": "war",
            "language": "Waray / Samar - Leyte Visayan"
        },
        {
            "code": "cy",
            "language": "Welsh"
        },
        {
            "code": "vls",
            "language": "West Flemish"
        },
        {
            "code": "fy",
            "language": "West Frisian"
        },
        {
            "code": "wo",
            "language": "Wolof"
        },
        {
            "code": "xh",
            "language": "Xhosa"
        },
        {
            "code": "yi",
            "language": "Yiddish"
        },
        {
            "code": "yo",
            "language": "Yoruba"
        },
        {
            "code": "za",
            "language": "Zhuang"
        }
    ];
})(Iso639 = exports.Iso639 || (exports.Iso639 = {}));
//# sourceMappingURL=iso639.js.map