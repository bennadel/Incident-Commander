
export interface Timezone {
	abbreviation: string;
	name: string;
	utc: string;
	offset: number;
}

export var timezones: Timezone[] = [
	{
		abbreviation: "ACDT",
		name: "Australian Central Daylight Savings Time",
		utc: "UTC+10:30",
		offset: -630
	},
	{
		abbreviation: "ACST",
		name: "Australian Central Standard Time",
		utc: "UTC+09:30",
		offset: -570
	},
	{
		abbreviation: "ACT",
		name: "Acre Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		abbreviation: "ADT",
		name: "Atlantic Daylight Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "AEDT",
		name: "Australian Eastern Daylight Savings Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "AEST",
		name: "Australian Eastern Standard Time",
		utc: "UTC+10",
		offset: -60600
	},
	{
		abbreviation: "AFT",
		name: "Afghanistan Time",
		utc: "UTC+04:30",
		offset: -270
	},
	{
		abbreviation: "AKDT",
		name: "Alaska Daylight Time",
		utc: "UTC-08",
		offset: 480
	},
	{
		abbreviation: "AKST",
		name: "Alaska Standard Time",
		utc: "UTC-09",
		offset: 540
	},
	{
		abbreviation: "AMST",
		name: "Amazon Summer Time (Brazil)",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "AMT",
		name: "Amazon Time (Brazil)",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "AMT",
		name: "Armenia Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "ART",
		name: "Argentina Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "AST",
		name: "Arabia Standard Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "AST",
		name: "Atlantic Standard Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "AWST",
		name: "Australian Western Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "AZOST",
		name: "Azores Summer Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		abbreviation: "AZOT",
		name: "Azores Standard Time",
		utc: "UTC-01",
		offset: 60
	},
	{
		abbreviation: "AZT",
		name: "Azerbaijan Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "BDT",
		name: "Brunei Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "BIOT",
		name: "British Indian Ocean Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		abbreviation: "BIT",
		name: "Baker Island Time",
		utc: "UTC-12",
		offset: 720
	},
	{
		abbreviation: "BOT",
		name: "Bolivia Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "BRST",
		name: "Brasilia Summer Time",
		utc: "UTC-02",
		offset: 120
	},
	{
		abbreviation: "BRT",
		name: "Brasilia Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "BST",
		name: "Bangladesh Standard Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		abbreviation: "BST",
		name: "Bougainville Standard Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "BTT",
		name: "Bhutan Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		abbreviation: "CAT",
		name: "Central Africa Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "CCT",
		name: "Cocos Islands Time",
		utc: "UTC+06:30",
		offset: -390
	},
	{
		abbreviation: "CDT",
		name: "Central Daylight Time (North America)",
		utc: "UTC-05",
		offset: 300
	},
	{
		abbreviation: "CDT",
		name: "Cuba Daylight Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "CEST",
		name: "Central European Summer Time (Cf. HAEC)",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "CET",
		name: "Central European Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		abbreviation: "CHADT",
		name: "Chatham Daylight Time",
		utc: "UTC+13:45",
		offset: -825
	},
	{
		abbreviation: "CHAST",
		name: "Chatham Standard Time",
		utc: "UTC+12:45",
		offset: -765
	},
	{
		abbreviation: "CHOT",
		name: "Choibalsan Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "CHOST",
		name: "Choibalsan Summer Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		abbreviation: "CHST",
		name: "Chamorro Standard Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		abbreviation: "CHUT",
		name: "Chuuk Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		abbreviation: "CIST",
		name: "Clipperton Island Standard Time",
		utc: "UTC-08",
		offset: 480
	},
	{
		abbreviation: "CIT",
		name: "Central Indonesia Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "CKT",
		name: "Cook Island Time",
		utc: "UTC-10",
		offset: 600
	},
	{
		abbreviation: "CLST",
		name: "Chile Summer Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "CLT",
		name: "Chile Standard Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "COST",
		name: "Colombia Summer Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "COT",
		name: "Colombia Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		abbreviation: "CST",
		name: "Central Standard Time (North America)",
		utc: "UTC-06",
		offset: 360
	},
	{
		abbreviation: "CST",
		name: "China Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "ACST",
		name: "Central Standard Time (Australia)",
		utc: "UTC+09:30",
		offset: -570
	},
	{
		abbreviation: "ACDT",
		name: "Central Summer Time (Australia)",
		utc: "UTC+10:30",
		offset: -630
	},
	{
		abbreviation: "CST",
		name: "Cuba Standard Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		abbreviation: "CT",
		name: "China time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "CVT",
		name: "Cape Verde Time",
		utc: "UTC-01",
		offset: 60
	},
	{
		abbreviation: "CWST",
		name: "Central Western Standard Time (Australia) unofficial",
		utc: "UTC+08:45",
		offset: -525
	},
	{
		abbreviation: "CXT",
		name: "Christmas Island Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		abbreviation: "DAVT",
		name: "Davis Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		abbreviation: "DDUT",
		name: "Dumont d'Urville Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		abbreviation: "DFT",
		name: "AIX specific equivalent of Central European Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		abbreviation: "EASST",
		name: "Easter Island Summer Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		abbreviation: "EAST",
		name: "Easter Island Standard Time",
		utc: "UTC-06",
		offset: 360
	},
	{
		abbreviation: "EAT",
		name: "East Africa Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "ECT",
		name: "Eastern Caribbean Time (does not recognize DST)",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "ECT",
		name: "Ecuador Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		abbreviation: "EDT",
		name: "Eastern Daylight Time (North America)",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "AEDT",
		name: "Eastern Summer Time (Australia)",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "EEST",
		name: "Eastern European Summer Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "EET",
		name: "Eastern European Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "EGST",
		name: "Eastern Greenland Summer Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		abbreviation: "EGT",
		name: "Eastern Greenland Time",
		utc: "UTC-01",
		offset: 60
	},
	{
		abbreviation: "EIT",
		name: "Eastern Indonesian Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		abbreviation: "EST",
		name: "Eastern Standard Time (North America)",
		utc: "UTC-05",
		offset: 300
	},
	{
		abbreviation: "AEST",
		name: "Eastern Standard Time (Australia)",
		utc: "UTC+10",
		offset: -600
	},
	{
		abbreviation: "FET",
		name: "Further-eastern European Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "FJT",
		name: "Fiji Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		abbreviation: "FKST",
		name: "Falkland Islands Summer Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "FKT",
		name: "Falkland Islands Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "FNT",
		name: "Fernando de Noronha Time",
		utc: "UTC-02",
		offset: 120
	},
	{
		abbreviation: "GALT",
		name: "Galapagos Time",
		utc: "UTC-06",
		offset: 360
	},
	{
		abbreviation: "GAMT",
		name: "Gambier Islands",
		utc: "UTC-09",
		offset: 540
	},
	{
		abbreviation: "GET",
		name: "Georgia Standard Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "GFT",
		name: "French Guiana Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "GILT",
		name: "Gilbert Island Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		abbreviation: "GIT",
		name: "Gambier Island Time",
		utc: "UTC-09",
		offset: 540
	},
	{
		abbreviation: "GMT",
		name: "Greenwich Mean Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		abbreviation: "GST",
		name: "South Georgia and the South Sandwich Islands",
		utc: "UTC-02",
		offset: 120
	},
	{
		abbreviation: "GST",
		name: "Gulf Standard Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "GYT",
		name: "Guyana Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "HADT",
		name: "Hawaii-Aleutian Daylight Time",
		utc: "UTC-09",
		offset: 540
	},
	{
		abbreviation: "HAEC",
		name: "Heure Avancee d'Europe Centrale francised name for CEST",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "HAST",
		name: "Hawaii-Aleutian Standard Time",
		utc: "UTC-10",
		offset: 600
	},
	{
		abbreviation: "HKT",
		name: "Hong Kong Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "HMT",
		name: "Heard and McDonald Islands Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "HOVST",
		name: "Khovd Summer Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "HOVT",
		name: "Khovd Standard Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		abbreviation: "ICT",
		name: "Indochina Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		abbreviation: "IDT",
		name: "Israel Daylight Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "IOT",
		name: "Indian Ocean Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "IRDT",
		name: "Iran Daylight Time",
		utc: "UTC+04:30",
		offset: -270
	},
	{
		abbreviation: "IRKT",
		name: "Irkutsk Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "IRST",
		name: "Iran Standard Time",
		utc: "UTC+03:30",
		offset: -210
	},
	{
		abbreviation: "IST",
		name: "Indian Standard Time",
		utc: "UTC+05:30",
		offset: -330
	},
	{
		abbreviation: "IST",
		name: "Irish Standard Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		abbreviation: "IST",
		name: "Israel Standard Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "JST",
		name: "Japan Standard Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		abbreviation: "KGT",
		name: "Kyrgyzstan time",
		utc: "UTC+06",
		offset: -360
	},
	{
		abbreviation: "KOST",
		name: "Kosrae Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "KRAT",
		name: "Krasnoyarsk Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		abbreviation: "KST",
		name: "Korea Standard Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		abbreviation: "LHST",
		name: "Lord Howe Standard Time",
		utc: "UTC+10:30",
		offset: -630
	},
	{
		abbreviation: "LHST",
		name: "Lord Howe Summer Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "LINT",
		name: "Line Islands Time",
		utc: "UTC+14",
		offset: -840
	},
	{
		abbreviation: "MAGT",
		name: "Magadan Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		abbreviation: "MART",
		name: "Marquesas Islands Time",
		utc: "UTC-09:30",
		offset: 570
	},
	{
		abbreviation: "MAWT",
		name: "Mawson Station Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "MDT",
		name: "Mountain Daylight Time (North America)",
		utc: "UTC-06",
		offset: 360
	},
	{
		abbreviation: "MET",
		name: "Middle European Time Same zone as CET",
		utc: "UTC+01",
		offset: -60
	},
	{
		abbreviation: "MEST",
		name: "Middle European Summer Time Same zone as CEST",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "MHT",
		name: "Marshall Islands",
		utc: "UTC+12",
		offset: -720
	},
	{
		abbreviation: "MIST",
		name: "Macquarie Island Station Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "MIT",
		name: "Marquesas Islands Time",
		utc: "UTC-09:30",
		offset: 570
	},
	{
		abbreviation: "MMT",
		name: "Myanmar Standard Time",
		utc: "UTC+06:30",
		offset: -390
	},
	{
		abbreviation: "MSK",
		name: "Moscow Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "MST",
		name: "Malaysia Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "MST",
		name: "Mountain Standard Time (North America)",
		utc: "UTC-07",
		offset: 420
	},
	{
		abbreviation: "MUT",
		name: "Mauritius Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "MVT",
		name: "Maldives Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "MYT",
		name: "Malaysia Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "NCT",
		name: "New Caledonia Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "NDT",
		name: "Newfoundland Daylight Time",
		utc: "UTC-02:30",
		offset: 150
	},
	{
		abbreviation: "NFT",
		name: "Norfolk Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "NPT",
		name: "Nepal Time",
		utc: "UTC+05:45",
		offset: -345
	},
	{
		abbreviation: "NST",
		name: "Newfoundland Standard Time",
		utc: "UTC-03:30",
		offset: 210
	},
	{
		abbreviation: "NT",
		name: "Newfoundland Time",
		utc: "UTC-03:30",
		offset: 210
	},
	{
		abbreviation: "NUT",
		name: "Niue Time",
		utc: "UTC-11",
		offset: 660
	},
	{
		abbreviation: "NZDT",
		name: "New Zealand Daylight Time",
		utc: "UTC+13",
		offset: -780
	},
	{
		abbreviation: "NZST",
		name: "New Zealand Standard Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		abbreviation: "OMST",
		name: "Omsk Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		abbreviation: "ORAT",
		name: "Oral Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "PDT",
		name: "Pacific Daylight Time (North America)",
		utc: "UTC-07",
		offset: 420
	},
	{
		abbreviation: "PET",
		name: "Peru Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		abbreviation: "PETT",
		name: "Kamchatka Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		abbreviation: "PGT",
		name: "Papua New Guinea Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		abbreviation: "PHOT",
		name: "Phoenix Island Time",
		utc: "UTC+13",
		offset: -780
	},
	{
		abbreviation: "PHT",
		name: "Philippine Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "PKT",
		name: "Pakistan Standard Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "PMDT",
		name: "Saint Pierre and Miquelon Daylight time",
		utc: "UTC-02",
		offset: 120
	},
	{
		abbreviation: "PMST",
		name: "Saint Pierre and Miquelon Standard Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "PONT",
		name: "Pohnpei Standard Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "PST",
		name: "Pacific Standard Time (North America)",
		utc: "UTC-08",
		offset: 480
	},
	{
		abbreviation: "PST",
		name: "Philippine Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "PYST",
		name: "Paraguay Summer Time (South America)",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "PYT",
		name: "Paraguay Time (South America)",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "RET",
		name: "Reunion Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "ROTT",
		name: "Rothera Research Station Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "SAKT",
		name: "Sakhalin Island time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "SAMT",
		name: "Samara Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "SAST",
		name: "South African Standard Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "SBT",
		name: "Solomon Islands Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "SCT",
		name: "Seychelles Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "SDT",
		name: "Samoa Daylight Time",
		utc: "UTC-10",
		offset: 600
	},
	{
		abbreviation: "SGT",
		name: "Singapore Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "SLST",
		name: "Sri Lanka Standard Time",
		utc: "UTC+05:30",
		offset: -330
	},
	{
		abbreviation: "SRET",
		name: "Srednekolymsk Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "SRT",
		name: "Suriname Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "SST",
		name: "Samoa Standard Time",
		utc: "UTC-11",
		offset: 660
	},
	{
		abbreviation: "SST",
		name: "Singapore Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "SYOT",
		name: "Showa Station Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "TAHT",
		name: "Tahiti Time",
		utc: "UTC-10",
		offset: 600
	},
	{
		abbreviation: "THA",
		name: "Thailand Standard Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		abbreviation: "TFT",
		name: "Indian/Kerguelen",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "TJT",
		name: "Tajikistan Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "TKT",
		name: "Tokelau Time",
		utc: "UTC+13",
		offset: -780
	},
	{
		abbreviation: "TLT",
		name: "Timor Leste Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		abbreviation: "TMT",
		name: "Turkmenistan Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "TRT",
		name: "Turkey Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		abbreviation: "TOT",
		name: "Tonga Time",
		utc: "UTC+13",
		offset: -780
	},
	{
		abbreviation: "TVT",
		name: "Tuvalu Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		abbreviation: "ULAST",
		name: "Ulaanbaatar Summer Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		abbreviation: "ULAT",
		name: "Ulaanbaatar Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "USZ1",
		name: "Kaliningrad Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "UTC",
		name: "Coordinated Universal Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		abbreviation: "UYST",
		name: "Uruguay Summer Time",
		utc: "UTC-02",
		offset: 120
	},
	{
		abbreviation: "UYT",
		name: "Uruguay Standard Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		abbreviation: "UZT",
		name: "Uzbekistan Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		abbreviation: "VET",
		name: "Venezuelan Standard Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		abbreviation: "VLAT",
		name: "Vladivostok Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		abbreviation: "VOLT",
		name: "Volgograd Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		abbreviation: "VOST",
		name: "Vostok Station Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		abbreviation: "VUT",
		name: "Vanuatu Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		abbreviation: "WAKT",
		name: "Wake Island Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		abbreviation: "WAST",
		name: "West Africa Summer Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		abbreviation: "WAT",
		name: "West Africa Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		abbreviation: "WEST",
		name: "Western European Summer Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		abbreviation: "WET",
		name: "Western European Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		abbreviation: "WIT",
		name: "Western Indonesian Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		abbreviation: "WST",
		name: "Western Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		abbreviation: "YAKT",
		name: "Yakutsk Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		abbreviation: "YEKT",
		name: "Yekaterinburg Time",
		utc: "UTC+05",
		offset: -300
	}
];
