"use strict";
var Iso639;
(function (Iso639) {
    Iso639.languages = [
        {
            "code": "aa",
            "language": "Afar"
        },
        {
            "code": "ab",
            "language": "Abkhazian"
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
            "code": "als",
            "language": "Alemannic"
        },
        {
            "code": "am",
            "language": "Amharic"
        },
        {
            "code": "an",
            "language": "Aragonese"
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
            "code": "arc",
            "language": "Aramaic"
        },
        {
            "code": "as",
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
            "code": "ba",
            "language": "Bashkir"
        },
        {
            "code": "bar",
            "language": "Bavarian"
        },
        {
            "code": "bat-smg",
            "language": "Samogitian"
        },
        {
            "code": "bcl",
            "language": "Bikol"
        },
        {
            "code": "be",
            "language": "Belarusian"
        },
        {
            "code": "bg",
            "language": "Bulgarian"
        },
        {
            "code": "bh",
            "language": "Bihari"
        },
        {
            "code": "bi",
            "language": "Bislama"
        },
        {
            "code": "bm",
            "language": "Bambara"
        },
        {
            "code": "bn",
            "language": "Bengali"
        },
        {
            "code": "bo",
            "language": "Tibetan"
        },
        {
            "code": "bpy",
            "language": "Bishnupriya Manipuri"
        },
        {
            "code": "br",
            "language": "Breton"
        },
        {
            "code": "bs",
            "language": "Bosnian"
        },
        {
            "code": "bug",
            "language": "Buginese"
        },
        {
            "code": "bxr",
            "language": "Buriat (Russia)"
        },
        {
            "code": "ca",
            "language": "Catalan"
        },
        {
            "code": "cdo",
            "language": "Min Dong Chinese"
        },
        {
            "code": "ce",
            "language": "Chechen"
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
            "code": "cho",
            "language": "Choctaw"
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
            "code": "co",
            "language": "Corsican"
        },
        {
            "code": "cr",
            "language": "Cree"
        },
        {
            "code": "cs",
            "language": "Czech"
        },
        {
            "code": "csb",
            "language": "Kashubian"
        },
        {
            "code": "cu",
            "language": "Old Church Slavonic / Old Bulgarian"
        },
        {
            "code": "cv",
            "language": "Chuvash"
        },
        {
            "code": "cy",
            "language": "Welsh"
        },
        {
            "code": "da",
            "language": "Danish"
        },
        {
            "code": "de",
            "language": "German"
        },
        {
            "code": "diq",
            "language": "Dimli"
        },
        {
            "code": "dsb",
            "language": "Lower Sorbian"
        },
        {
            "code": "dv",
            "language": "Divehi"
        },
        {
            "code": "dz",
            "language": "Dzongkha"
        },
        {
            "code": "ee",
            "language": "Ewe"
        },
        {
            "code": "far",
            "language": "Farsi"
        },
        {
            "code": "el",
            "language": "Greek"
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
            "code": "es",
            "language": "Spanish"
        },
        {
            "code": "et",
            "language": "Estonian"
        },
        {
            "code": "eu",
            "language": "Basque"
        },
        {
            "code": "ext",
            "language": "Extremaduran"
        },
        {
            "code": "ff",
            "language": "Peul"
        },
        {
            "code": "fi",
            "language": "Finnish"
        },
        {
            "code": "fiu-vro",
            "language": "VÃµro"
        },
        {
            "code": "fj",
            "language": "Fijian"
        },
        {
            "code": "fo",
            "language": "Faroese"
        },
        {
            "code": "fr",
            "language": "French"
        },
        {
            "code": "frp",
            "language": "Arpitan / Franco-ProvenÃ§al"
        },
        {
            "code": "fur",
            "language": "Friulian"
        },
        {
            "code": "fy",
            "language": "West Frisian"
        },
        {
            "code": "ga",
            "language": "Irish"
        },
        {
            "code": "gan",
            "language": "Gan Chinese"
        },
        {
            "code": "gbm",
            "language": "Garhwali"
        },
        {
            "code": "gd",
            "language": "Scottish Gaelic"
        },
        {
            "code": "gil",
            "language": "Gilbertese"
        },
        {
            "code": "gl",
            "language": "Galician"
        },
        {
            "code": "gn",
            "language": "Guarani"
        },
        {
            "code": "got",
            "language": "Gothic"
        },
        {
            "code": "gu",
            "language": "Gujarati"
        },
        {
            "code": "gv",
            "language": "Manx"
        },
        {
            "code": "ha",
            "language": "Hausa"
        },
        {
            "code": "hak",
            "language": "Hakka Chinese"
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
            "code": "hi",
            "language": "Hindi"
        },
        {
            "code": "ho",
            "language": "Hiri Motu"
        },
        {
            "code": "hr",
            "language": "Croatian"
        },
        {
            "code": "ht",
            "language": "Haitian"
        },
        {
            "code": "hu",
            "language": "Hungarian"
        },
        {
            "code": "hy",
            "language": "Armenian"
        },
        {
            "code": "hz",
            "language": "Herero"
        },
        {
            "code": "ia",
            "language": "Interlingua"
        },
        {
            "code": "id",
            "language": "Indonesian"
        },
        {
            "code": "ie",
            "language": "Interlingue"
        },
        {
            "code": "ig",
            "language": "Igbo"
        },
        {
            "code": "ii",
            "language": "Sichuan Yi"
        },
        {
            "code": "ik",
            "language": "Inupiak"
        },
        {
            "code": "ilo",
            "language": "Ilokano"
        },
        {
            "code": "io",
            "language": "Ido"
        },
        {
            "code": "is",
            "language": "Icelandic"
        },
        {
            "code": "it",
            "language": "Italian"
        },
        {
            "code": "iu",
            "language": "Inuktitut"
        },
        {
            "code": "ja",
            "language": "Japanese"
        },
        {
            "code": "jbo",
            "language": "Lojban"
        },
        {
            "code": "jv",
            "language": "Javanese"
        },
        {
            "code": "ka",
            "language": "Georgian"
        },
        {
            "code": "kg",
            "language": "Kongo"
        },
        {
            "code": "ki",
            "language": "Kikuyu"
        },
        {
            "code": "kj",
            "language": "Kuanyama"
        },
        {
            "code": "kk",
            "language": "Kazakh"
        },
        {
            "code": "kl",
            "language": "Greenlandic"
        },
        {
            "code": "km",
            "language": "Cambodian"
        },
        {
            "code": "kn",
            "language": "Kannada"
        },
        {
            "code": "khw",
            "language": "Khowar"
        },
        {
            "code": "ko",
            "language": "Korean"
        },
        {
            "code": "kr",
            "language": "Kanuri"
        },
        {
            "code": "ks",
            "language": "Kashmiri"
        },
        {
            "code": "ksh",
            "language": "Ripuarian"
        },
        {
            "code": "ku",
            "language": "Kurdish"
        },
        {
            "code": "kv",
            "language": "Komi"
        },
        {
            "code": "kw",
            "language": "Cornish"
        },
        {
            "code": "ky",
            "language": "Kirghiz"
        },
        {
            "code": "la",
            "language": "Latin"
        },
        {
            "code": "lad",
            "language": "Ladino / Judeo-Spanish"
        },
        {
            "code": "lan",
            "language": "Lango"
        },
        {
            "code": "lb",
            "language": "Luxembourgish"
        },
        {
            "code": "lg",
            "language": "Ganda"
        },
        {
            "code": "li",
            "language": "Limburgian"
        },
        {
            "code": "lij",
            "language": "Ligurian"
        },
        {
            "code": "lmo",
            "language": "Lombard"
        },
        {
            "code": "ln",
            "language": "Lingala"
        },
        {
            "code": "lo",
            "language": "Laotian"
        },
        {
            "code": "lt",
            "language": "Lithuanian"
        },
        {
            "code": "lv",
            "language": "Latvian"
        },
        {
            "code": "map-bms",
            "language": "Banyumasan"
        },
        {
            "code": "mg",
            "language": "Malagasy"
        },
        {
            "code": "man",
            "language": "Mandarin"
        },
        {
            "code": "mh",
            "language": "Marshallese"
        },
        {
            "code": "mi",
            "language": "Maori"
        },
        {
            "code": "min",
            "language": "Minangkabau"
        },
        {
            "code": "mk",
            "language": "Macedonian"
        },
        {
            "code": "ml",
            "language": "Malayalam"
        },
        {
            "code": "mn",
            "language": "Mongolian"
        },
        {
            "code": "mo",
            "language": "Moldovan"
        },
        {
            "code": "mr",
            "language": "Marathi"
        },
        {
            "code": "ms",
            "language": "Malay"
        },
        {
            "code": "mt",
            "language": "Maltese"
        },
        {
            "code": "mus",
            "language": "Creek / Muskogee"
        },
        {
            "code": "my",
            "language": "Burmese"
        },
        {
            "code": "na",
            "language": "Nauruan"
        },
        {
            "code": "nah",
            "language": "Nahuatl"
        },
        {
            "code": "nap",
            "language": "Neapolitan"
        },
        {
            "code": "nd",
            "language": "North Ndebele"
        },
        {
            "code": "nds",
            "language": "Low German / Low Saxon"
        },
        {
            "code": "nds-nl",
            "language": "Dutch Low Saxon"
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
            "code": "ng",
            "language": "Ndonga"
        },
        {
            "code": "nl",
            "language": "Dutch"
        },
        {
            "code": "nn",
            "language": "Norwegian Nynorsk"
        },
        {
            "code": "no",
            "language": "Norwegian"
        },
        {
            "code": "nr",
            "language": "South Ndebele"
        },
        {
            "code": "nso",
            "language": "Northern Sotho"
        },
        {
            "code": "nrm",
            "language": "Norman"
        },
        {
            "code": "nv",
            "language": "Navajo"
        },
        {
            "code": "ny",
            "language": "Chichewa"
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
            "code": "om",
            "language": "Oromo"
        },
        {
            "code": "or",
            "language": "Oriya"
        },
        {
            "code": "os",
            "language": "Ossetian / Ossetic"
        },
        {
            "code": "pa",
            "language": "Panjabi / Punjabi"
        },
        {
            "code": "pag",
            "language": "Pangasinan"
        },
        {
            "code": "pam",
            "language": "Kapampangan"
        },
        {
            "code": "pap",
            "language": "Papiamentu"
        },
        {
            "code": "pdc",
            "language": "Pennsylvania German"
        },
        {
            "code": "pi",
            "language": "Pali"
        },
        {
            "code": "pih",
            "language": "Norfolk"
        },
        {
            "code": "pl",
            "language": "Polish"
        },
        {
            "code": "pms",
            "language": "Piedmontese"
        },
        {
            "code": "ps",
            "language": "Pashto"
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
            "code": "rmy",
            "language": "Romani"
        },
        {
            "code": "rn",
            "language": "Kirundi"
        },
        {
            "code": "ro",
            "language": "Romanian"
        },
        {
            "code": "roa-rup",
            "language": "Aromanian"
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
            "code": "sa",
            "language": "Sanskrit"
        },
        {
            "code": "sc",
            "language": "Sardinian"
        },
        {
            "code": "scn",
            "language": "Sicilian"
        },
        {
            "code": "sco",
            "language": "Scots"
        },
        {
            "code": "sd",
            "language": "Sindhi"
        },
        {
            "code": "se",
            "language": "Northern Sami"
        },
        {
            "code": "sg",
            "language": "Sango"
        },
        {
            "code": "sh",
            "language": "Serbo-Croatian"
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
            "code": "sm",
            "language": "Samoan"
        },
        {
            "code": "sn",
            "language": "Shona"
        },
        {
            "code": "so",
            "language": "Somalia"
        },
        {
            "code": "sq",
            "language": "Albanian"
        },
        {
            "code": "sr",
            "language": "Serbian"
        },
        {
            "code": "ss",
            "language": "Swati"
        },
        {
            "code": "st",
            "language": "Southern Sotho"
        },
        {
            "code": "su",
            "language": "Sundanese"
        },
        {
            "code": "sv",
            "language": "Swedish"
        },
        {
            "code": "sw",
            "language": "Swahili"
        },
        {
            "code": "ta",
            "language": "Tamil"
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
            "code": "tg",
            "language": "Tajik"
        },
        {
            "code": "th",
            "language": "Thai"
        },
        {
            "code": "ti",
            "language": "Tigrinya"
        },
        {
            "code": "tk",
            "language": "Turkmen"
        },
        {
            "code": "tl",
            "language": "Tagalog"
        },
        {
            "code": "tlh",
            "language": "Klingon"
        },
        {
            "code": "tn",
            "language": "Tswana"
        },
        {
            "code": "to",
            "language": "Tonga"
        },
        {
            "code": "tpi",
            "language": "Tok Pisin"
        },
        {
            "code": "tr",
            "language": "Turkish"
        },
        {
            "code": "ts",
            "language": "Tsonga"
        },
        {
            "code": "tt",
            "language": "Tatar"
        },
        {
            "code": "tum",
            "language": "Tumbuka"
        },
        {
            "code": "tw",
            "language": "Twi"
        },
        {
            "code": "ty",
            "language": "Tahitian"
        },
        {
            "code": "udm",
            "language": "Udmurt"
        },
        {
            "code": "ug",
            "language": "Uyghur"
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
            "code": "uz",
            "language": "Uzbek"
        },
        {
            "code": "ve",
            "language": "Venda"
        },
        {
            "code": "vi",
            "language": "Vietnamese"
        },
        {
            "code": "vec",
            "language": "Venetian"
        },
        {
            "code": "vls",
            "language": "West Flemish"
        },
        {
            "code": "vo",
            "language": "VolapÃ¼k"
        },
        {
            "code": "wa",
            "language": "Walloon"
        },
        {
            "code": "war",
            "language": "Waray / Samar-Leyte Visayan"
        },
        {
            "code": "wo",
            "language": "Wolof"
        },
        {
            "code": "xal",
            "language": "Kalmyk"
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
        },
        {
            "code": "zh",
            "language": "Chinese"
        }
    ];
})(Iso639 = exports.Iso639 || (exports.Iso639 = {}));
//# sourceMappingURL=iso639.js.map