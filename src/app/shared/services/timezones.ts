
export interface Timezone {
	id: string;
	abbreviation: string;
	name: string;
	utc: string;
	offset: number;
}

// NOTE: In order to persist the timezone data to the incident, I had to give the 
// individual options a unique ID that would be consistent over time. In order to do 
// this, I used the UUID generator on `https://www.uuidgenerator.net/`. A UUID felt like
// the right way to go because none of the other properties were sufficiently stable or
// unique. At least the UUID is guaranteed unique and is not semantically meaningful. 
export var timezones: Timezone[] = [
	{
		id: "f562306c-3388-4bb7-a1f6-4e7766e2f42e",
		abbreviation: "ACDT",
		name: "Australian Central Daylight Savings Time",
		utc: "UTC+10:30",
		offset: -630
	},
	{
		id: "b5cf0a4e-90e3-4990-8ec1-abbbed33686c",
		abbreviation: "ACST",
		name: "Australian Central Standard Time",
		utc: "UTC+09:30",
		offset: -570
	},
	{
		id: "c1aa6de0-b305-4622-9f2e-f0f68fa5d012",
		abbreviation: "ACT",
		name: "Acre Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		id: "e6b4822f-878a-418d-98ac-e7dd7fe6eec0",
		abbreviation: "ADT",
		name: "Atlantic Daylight Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "54fc3643-c100-4851-b6e9-298907ff0735",
		abbreviation: "AEDT",
		name: "Australian Eastern Daylight Savings Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "438fd216-eaa8-4b6c-81f4-d9b3b1a7a2fc",
		abbreviation: "AEST",
		name: "Australian Eastern Standard Time",
		utc: "UTC+10",
		offset: -60600
	},
	{
		id: "104ff13f-72c9-4ebb-b1f6-90f8d8c64d20",
		abbreviation: "AFT",
		name: "Afghanistan Time",
		utc: "UTC+04:30",
		offset: -270
	},
	{
		id: "4440fb17-5068-4698-a844-c36ee0415efc",
		abbreviation: "AKDT",
		name: "Alaska Daylight Time",
		utc: "UTC-08",
		offset: 480
	},
	{
		id: "b1bb6477-1a7a-4156-ae3b-79cbc0b4efb7",
		abbreviation: "AKST",
		name: "Alaska Standard Time",
		utc: "UTC-09",
		offset: 540
	},
	{
		id: "a9614787-0f74-40e7-a345-928b69278c9a",
		abbreviation: "AMST",
		name: "Amazon Summer Time (Brazil)",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "6fd76b22-5289-48d4-810c-b2591c3c408c",
		abbreviation: "AMT",
		name: "Amazon Time (Brazil)",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "c8f3968f-d92b-40e0-822c-e73dd1fa5669",
		abbreviation: "AMT",
		name: "Armenia Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "cb8e0b4d-e84c-47fc-a759-7cde06bacb02",
		abbreviation: "ART",
		name: "Argentina Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "2b70e800-2ee1-477e-9b9d-d1c20e469e63",
		abbreviation: "AST",
		name: "Arabia Standard Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "9f05a19d-6b91-4778-8461-edd0830ecf5f",
		abbreviation: "AST",
		name: "Atlantic Standard Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "dcd15f42-29f4-428d-82d7-b58741c5cd6f",
		abbreviation: "AWST",
		name: "Australian Western Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "e90ecff6-19e1-4492-9465-b1d5fb93b587",
		abbreviation: "AZOST",
		name: "Azores Summer Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		id: "28b83c10-af0c-4a4b-887a-8f82be1e97aa",
		abbreviation: "AZOT",
		name: "Azores Standard Time",
		utc: "UTC-01",
		offset: 60
	},
	{
		id: "f9cbe43c-608f-4e56-a8c5-692d2ae03b55",
		abbreviation: "AZT",
		name: "Azerbaijan Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "8c7e6734-6caa-40bb-bd83-5074cf9d5345",
		abbreviation: "BDT",
		name: "Brunei Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "1cc4f82c-c7be-44d7-9c1b-4ba62c31bb10",
		abbreviation: "BIOT",
		name: "British Indian Ocean Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		id: "f8b13a11-99de-4e36-a00d-8666104cbc3d",
		abbreviation: "BIT",
		name: "Baker Island Time",
		utc: "UTC-12",
		offset: 720
	},
	{
		id: "22423ef8-f405-42b9-8d73-0fd41c57a5c5",
		abbreviation: "BOT",
		name: "Bolivia Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "0bd7288c-1e08-4069-a72f-1c1453dea53c",
		abbreviation: "BRST",
		name: "Brasilia Summer Time",
		utc: "UTC-02",
		offset: 120
	},
	{
		id: "0f0e5167-ddc7-487a-8882-6524a5cbb14e",
		abbreviation: "BRT",
		name: "Brasilia Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "31480b59-0d81-4e27-90bd-0cf4d7aa7d9e",
		abbreviation: "BST",
		name: "Bangladesh Standard Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		id: "bd1fe38c-89f7-4dcd-8a89-46a4653a1f20",
		abbreviation: "BST",
		name: "Bougainville Standard Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "f986c8f5-c0ea-4725-a71f-130e1f81e55f",
		abbreviation: "BTT",
		name: "Bhutan Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		id: "4f545880-0cb2-44f2-a098-80af816b76a9",
		abbreviation: "CAT",
		name: "Central Africa Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "90ba86ef-5c73-4da3-9c13-79d4faf4f475",
		abbreviation: "CCT",
		name: "Cocos Islands Time",
		utc: "UTC+06:30",
		offset: -390
	},
	{
		id: "95f40310-b41f-4d9e-94eb-8d547df0ddbf",
		abbreviation: "CDT",
		name: "Central Daylight Time (North America)",
		utc: "UTC-05",
		offset: 300
	},
	{
		id: "461c9c22-d6b6-43df-ace6-9c6c2694607f",
		abbreviation: "CDT",
		name: "Cuba Daylight Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "a87f2302-5b2d-4a32-945e-14b01ecc2248",
		abbreviation: "CEST",
		name: "Central European Summer Time (Cf. HAEC)",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "b53cbb7c-ee4e-4af3-bae9-bf61dac2dd0d",
		abbreviation: "CET",
		name: "Central European Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		id: "8936f9ad-3f94-42ce-ae25-ece94b00eb55",
		abbreviation: "CHADT",
		name: "Chatham Daylight Time",
		utc: "UTC+13:45",
		offset: -825
	},
	{
		id: "ceeac5ea-6b0d-406c-9198-cdfb206bf601",
		abbreviation: "CHAST",
		name: "Chatham Standard Time",
		utc: "UTC+12:45",
		offset: -765
	},
	{
		id: "3a7e5074-9bed-4497-ac0f-1a41530b457a",
		abbreviation: "CHOT",
		name: "Choibalsan Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "d6eb188f-bc53-4b5c-bbd5-7d20259478b1",
		abbreviation: "CHOST",
		name: "Choibalsan Summer Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		id: "81580455-0a2d-4875-b809-cbceabdc0b47",
		abbreviation: "CHST",
		name: "Chamorro Standard Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		id: "82fa7130-3d8b-4e66-8044-4fd28c8f7ab9",
		abbreviation: "CHUT",
		name: "Chuuk Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		id: "33006b7a-ccef-467e-8e58-80918229901f",
		abbreviation: "CIST",
		name: "Clipperton Island Standard Time",
		utc: "UTC-08",
		offset: 480
	},
	{
		id: "7179e35b-37f3-4cda-a2d4-d0a764b27e7d",
		abbreviation: "CIT",
		name: "Central Indonesia Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "dbc2cc93-cf53-4ad4-8108-26e4e03ba038",
		abbreviation: "CKT",
		name: "Cook Island Time",
		utc: "UTC-10",
		offset: 600
	},
	{
		id: "53bd81dd-2aad-43ec-9eaa-5536decd858f",
		abbreviation: "CLST",
		name: "Chile Summer Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "5f65c70f-1486-468b-8147-a5f0ec2bd4fa",
		abbreviation: "CLT",
		name: "Chile Standard Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "136360db-03d1-4bfe-921b-a35a76745755",
		abbreviation: "COST",
		name: "Colombia Summer Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "44720afb-a7b0-4ef3-b583-21e224fb9f85",
		abbreviation: "COT",
		name: "Colombia Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		id: "7b82f65b-70cc-4fd0-b791-481ba571ebf8",
		abbreviation: "CST",
		name: "Central Standard Time (North America)",
		utc: "UTC-06",
		offset: 360
	},
	{
		id: "22546e22-60e3-4c67-bb50-51c3004a61a0",
		abbreviation: "CST",
		name: "China Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "b53cd11c-fd7e-4b2a-94e2-b0839f53d93d",
		abbreviation: "ACST",
		name: "Central Standard Time (Australia)",
		utc: "UTC+09:30",
		offset: -570
	},
	{
		id: "8c5dd108-1e1d-4abd-bb0e-38b05c99df33",
		abbreviation: "ACDT",
		name: "Central Summer Time (Australia)",
		utc: "UTC+10:30",
		offset: -630
	},
	{
		id: "55da884c-1a88-4a9c-91fa-2ef4674713a7",
		abbreviation: "CST",
		name: "Cuba Standard Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		id: "e82ca5ab-eea0-4c82-938b-f7334d531ac9",
		abbreviation: "CT",
		name: "China time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "8b7fe36f-a8ec-4f5f-a5c5-0b37730fd0d6",
		abbreviation: "CVT",
		name: "Cape Verde Time",
		utc: "UTC-01",
		offset: 60
	},
	{
		id: "34d03938-d6a8-4ec6-9080-5d060a9efeba",
		abbreviation: "CWST",
		name: "Central Western Standard Time (Australia) unofficial",
		utc: "UTC+08:45",
		offset: -525
	},
	{
		id: "ed860b3d-5189-48b2-b015-d019efb61b35",
		abbreviation: "CXT",
		name: "Christmas Island Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		id: "f8ae94ac-9b9b-4650-9607-617b798bfb9f",
		abbreviation: "DAVT",
		name: "Davis Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		id: "89af4123-8b13-49b2-aab4-a60051194581",
		abbreviation: "DDUT",
		name: "Dumont d'Urville Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		id: "ed978016-b9b2-429d-9ba0-9cbfe6aa8b13",
		abbreviation: "DFT",
		name: "AIX specific equivalent of Central European Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		id: "e84d9d90-ae8f-4cf1-85e2-98e2e9891577",
		abbreviation: "EASST",
		name: "Easter Island Summer Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		id: "d3e5ec56-2abc-41f1-b02f-8b839744cb53",
		abbreviation: "EAST",
		name: "Easter Island Standard Time",
		utc: "UTC-06",
		offset: 360
	},
	{
		id: "cbc33b59-e3c9-4e0f-943a-8d5a3643f6cd",
		abbreviation: "EAT",
		name: "East Africa Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "2abe0144-c455-4fd6-97aa-cbe9ddf233b9",
		abbreviation: "ECT",
		name: "Eastern Caribbean Time (does not recognize DST)",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "c3392914-18bb-4046-aed5-1519814f0a9a",
		abbreviation: "ECT",
		name: "Ecuador Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		id: "3ca59164-cc12-444d-aa11-0ca961e17e08",
		abbreviation: "EDT",
		name: "Eastern Daylight Time (North America)",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "f2c975ff-2f1e-4ba8-8b1c-b62e2c427596",
		abbreviation: "AEDT",
		name: "Eastern Summer Time (Australia)",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "429c68a6-e396-4995-9d03-e2ff3a911053",
		abbreviation: "EEST",
		name: "Eastern European Summer Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "253486de-bddd-4448-bb5c-9312f46c0d56",
		abbreviation: "EET",
		name: "Eastern European Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "0c709130-05c0-4aa8-8b37-a509447fc01b",
		abbreviation: "EGST",
		name: "Eastern Greenland Summer Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		id: "8e65933d-e45f-4233-a11e-c85685582cc4",
		abbreviation: "EGT",
		name: "Eastern Greenland Time",
		utc: "UTC-01",
		offset: 60
	},
	{
		id: "4d5dbdd7-52a6-46ad-b523-b3e599c1f6a0",
		abbreviation: "EIT",
		name: "Eastern Indonesian Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		id: "1de70413-cdc4-4eee-baea-6acb6bf41f4f",
		abbreviation: "EST",
		name: "Eastern Standard Time (North America)",
		utc: "UTC-05",
		offset: 300
	},
	{
		id: "d3aefe57-cdf8-4c2b-85ef-8bc6d7298ebc",
		abbreviation: "AEST",
		name: "Eastern Standard Time (Australia)",
		utc: "UTC+10",
		offset: -600
	},
	{
		id: "3d3bab2b-b7ff-45d2-b678-e9ab4d22e401",
		abbreviation: "FET",
		name: "Further-eastern European Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "a487bc51-9b24-4e11-8043-8de393fc0ee9",
		abbreviation: "FJT",
		name: "Fiji Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		id: "8181fbe5-6f63-4486-9abe-daf41c2d6bc9",
		abbreviation: "FKST",
		name: "Falkland Islands Summer Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "4b305b8f-78fa-47f0-a6a3-cd270bc66bea",
		abbreviation: "FKT",
		name: "Falkland Islands Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "b695c0aa-ff2a-44f7-aa7d-3bba13ec7b18",
		abbreviation: "FNT",
		name: "Fernando de Noronha Time",
		utc: "UTC-02",
		offset: 120
	},
	{
		id: "c01e7282-2d9e-4399-82ea-1674c8cc2ea3",
		abbreviation: "GALT",
		name: "Galapagos Time",
		utc: "UTC-06",
		offset: 360
	},
	{
		id: "21ebab35-cd30-4d76-8738-e883b009b35c",
		abbreviation: "GAMT",
		name: "Gambier Islands",
		utc: "UTC-09",
		offset: 540
	},
	{
		id: "71a19661-ede1-496e-9755-cc9fe28ffbbc",
		abbreviation: "GET",
		name: "Georgia Standard Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "da84aeac-2681-4062-a307-a6161fc71d27",
		abbreviation: "GFT",
		name: "French Guiana Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "fb9bec94-29db-455c-8d25-42fd5556770c",
		abbreviation: "GILT",
		name: "Gilbert Island Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		id: "77460af3-2794-4619-bbbb-bb7ccce82317",
		abbreviation: "GIT",
		name: "Gambier Island Time",
		utc: "UTC-09",
		offset: 540
	},
	{
		id: "d2e6d2cb-54ee-4164-8bd6-0fe80f6ec99a",
		abbreviation: "GMT",
		name: "Greenwich Mean Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		id: "5fc2e9dd-276b-4c36-9f07-d3a72c22658f",
		abbreviation: "GST",
		name: "South Georgia and the South Sandwich Islands",
		utc: "UTC-02",
		offset: 120
	},
	{
		id: "466c9d48-945d-48d3-a353-11e41a8c0533",
		abbreviation: "GST",
		name: "Gulf Standard Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "5d73f59d-9536-4c41-bcbc-a7353596e4ca",
		abbreviation: "GYT",
		name: "Guyana Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "37cb8d65-84e7-49e2-8252-14db73b0a5cb",
		abbreviation: "HADT",
		name: "Hawaii-Aleutian Daylight Time",
		utc: "UTC-09",
		offset: 540
	},
	{
		id: "781d7a5b-4a5b-4b95-b35c-6445aad51083",
		abbreviation: "HAEC",
		name: "Heure Avancee d'Europe Centrale francised name for CEST",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "e886fc37-90bc-4277-ba50-16ac2f7f07ab",
		abbreviation: "HAST",
		name: "Hawaii-Aleutian Standard Time",
		utc: "UTC-10",
		offset: 600
	},
	{
		id: "29824ddf-e2a0-4543-a1fc-4dd05bb40883",
		abbreviation: "HKT",
		name: "Hong Kong Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "d5dfb140-5bfd-4e4c-8aa1-b34d5ab5e7e9",
		abbreviation: "HMT",
		name: "Heard and McDonald Islands Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "bea01d4d-c7d5-49ad-8772-815a48cf69b4",
		abbreviation: "HOVST",
		name: "Khovd Summer Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "24fb9b89-f65f-46f6-a3a7-2f3a0592d877",
		abbreviation: "HOVT",
		name: "Khovd Standard Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		id: "574efff7-2427-46a0-bad5-cbbd74657c1c",
		abbreviation: "ICT",
		name: "Indochina Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		id: "bfc71290-d8b7-4068-a174-6349b6aa7541",
		abbreviation: "IDT",
		name: "Israel Daylight Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "f634b1b5-8769-4864-9085-314f4cc217bd",
		abbreviation: "IOT",
		name: "Indian Ocean Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "818ccb94-0b01-4006-90cc-ba7b7c21170f",
		abbreviation: "IRDT",
		name: "Iran Daylight Time",
		utc: "UTC+04:30",
		offset: -270
	},
	{
		id: "112af090-3480-449f-abf2-a259805106a8",
		abbreviation: "IRKT",
		name: "Irkutsk Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "d809bba6-b1a7-4ad6-bd26-db0e79d3a9c9",
		abbreviation: "IRST",
		name: "Iran Standard Time",
		utc: "UTC+03:30",
		offset: -210
	},
	{
		id: "cb48a62b-ab30-474d-aaec-0422dfba232c",
		abbreviation: "IST",
		name: "Indian Standard Time",
		utc: "UTC+05:30",
		offset: -330
	},
	{
		id: "a2b72587-c9f2-458b-914e-74fb11186dd1",
		abbreviation: "IST",
		name: "Irish Standard Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		id: "1af7a5cb-a0d0-43d4-9452-f82896c4184e",
		abbreviation: "IST",
		name: "Israel Standard Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "2761dec7-1064-4353-a3f1-4be23dab8277",
		abbreviation: "JST",
		name: "Japan Standard Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		id: "adaba9ef-5d0f-4ed0-9fae-805361a24b9e",
		abbreviation: "KGT",
		name: "Kyrgyzstan time",
		utc: "UTC+06",
		offset: -360
	},
	{
		id: "0c802529-203e-4396-ac9c-807878a89ea8",
		abbreviation: "KOST",
		name: "Kosrae Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "837bec06-2c7d-436b-b328-e4315584c743",
		abbreviation: "KRAT",
		name: "Krasnoyarsk Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		id: "1a0881af-be2f-48dd-b88a-8dd48a9a41c8",
		abbreviation: "KST",
		name: "Korea Standard Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		id: "89ef496b-942c-41fa-bb86-b388d2bf992e",
		abbreviation: "LHST",
		name: "Lord Howe Standard Time",
		utc: "UTC+10:30",
		offset: -630
	},
	{
		id: "b5fafa0f-8100-4331-9c3b-bc11ab045682",
		abbreviation: "LHST",
		name: "Lord Howe Summer Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "c9bfa8aa-d8d7-4be2-805c-9e917e0e72c0",
		abbreviation: "LINT",
		name: "Line Islands Time",
		utc: "UTC+14",
		offset: -840
	},
	{
		id: "265c373e-e6bf-4075-b748-71df3f24fca5",
		abbreviation: "MAGT",
		name: "Magadan Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		id: "f815f452-b1a4-4040-aa54-8314d5e34b51",
		abbreviation: "MART",
		name: "Marquesas Islands Time",
		utc: "UTC-09:30",
		offset: 570
	},
	{
		id: "fb0f99c0-ca87-4d60-a772-ee081f2753ca",
		abbreviation: "MAWT",
		name: "Mawson Station Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "1512cd35-645f-40c4-963e-7666023d3817",
		abbreviation: "MDT",
		name: "Mountain Daylight Time (North America)",
		utc: "UTC-06",
		offset: 360
	},
	{
		id: "671c1d8e-c4a9-4ddd-8517-37a41d234c6c",
		abbreviation: "MET",
		name: "Middle European Time Same zone as CET",
		utc: "UTC+01",
		offset: -60
	},
	{
		id: "6e94384d-de54-49d1-a58a-562fb9cdf0ae",
		abbreviation: "MEST",
		name: "Middle European Summer Time Same zone as CEST",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "bf3531f1-c997-4de4-884d-81d1a9bedc0c",
		abbreviation: "MHT",
		name: "Marshall Islands",
		utc: "UTC+12",
		offset: -720
	},
	{
		id: "0f001bbe-4de3-4de4-871e-a1748b8dd69b",
		abbreviation: "MIST",
		name: "Macquarie Island Station Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "8e2c6099-f959-47e2-94e9-6ead84192643",
		abbreviation: "MIT",
		name: "Marquesas Islands Time",
		utc: "UTC-09:30",
		offset: 570
	},
	{
		id: "30ced839-ff5e-418b-9acf-d4451fafd369",
		abbreviation: "MMT",
		name: "Myanmar Standard Time",
		utc: "UTC+06:30",
		offset: -390
	},
	{
		id: "63ef6786-1e98-4f61-8c58-fb130190d6c7",
		abbreviation: "MSK",
		name: "Moscow Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "7cf60ac6-4a75-4f6a-9910-88663800a4eb",
		abbreviation: "MST",
		name: "Malaysia Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "3fca0de8-88b5-45d4-ba86-4e74568f3847",
		abbreviation: "MST",
		name: "Mountain Standard Time (North America)",
		utc: "UTC-07",
		offset: 420
	},
	{
		id: "1a10e2da-57d1-4daa-ba0b-89ede99b1ee8",
		abbreviation: "MUT",
		name: "Mauritius Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "7ab8a1ee-c083-4da7-9346-3267d591102d",
		abbreviation: "MVT",
		name: "Maldives Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "03e20669-3d28-4160-bb2c-b966c8193716",
		abbreviation: "MYT",
		name: "Malaysia Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "3703d21f-bccf-40f6-a76f-2e20776b4233",
		abbreviation: "NCT",
		name: "New Caledonia Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "6660ddb0-d9b9-4003-8bce-0d5c5528e5aa",
		abbreviation: "NDT",
		name: "Newfoundland Daylight Time",
		utc: "UTC-02:30",
		offset: 150
	},
	{
		id: "9cc98ec2-7b10-4856-9a8d-4fe0ad5a598d",
		abbreviation: "NFT",
		name: "Norfolk Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "c44dffb7-ab29-4ee1-ad81-b5bf7a3cc6e5",
		abbreviation: "NPT",
		name: "Nepal Time",
		utc: "UTC+05:45",
		offset: -345
	},
	{
		id: "3e132a3d-cc8f-4dfa-8726-927ebd7f6f83",
		abbreviation: "NST",
		name: "Newfoundland Standard Time",
		utc: "UTC-03:30",
		offset: 210
	},
	{
		id: "e243d6d9-6321-4551-ac63-7d756c425bed",
		abbreviation: "NT",
		name: "Newfoundland Time",
		utc: "UTC-03:30",
		offset: 210
	},
	{
		id: "21fad765-a28c-4c8a-8a6d-96966844d9f9",
		abbreviation: "NUT",
		name: "Niue Time",
		utc: "UTC-11",
		offset: 660
	},
	{
		id: "12129ea5-30c8-4c79-ac1b-470cd668591d",
		abbreviation: "NZDT",
		name: "New Zealand Daylight Time",
		utc: "UTC+13",
		offset: -780
	},
	{
		id: "a2722aac-2ffd-43a6-9818-5a7292844792",
		abbreviation: "NZST",
		name: "New Zealand Standard Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		id: "7d62e154-5ea3-4db1-b98f-482a2fcf8ee7",
		abbreviation: "OMST",
		name: "Omsk Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		id: "a7541966-57ed-40bb-8550-cd3684cc4864",
		abbreviation: "ORAT",
		name: "Oral Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "b64b4fb1-c340-4382-8769-0c5941059dbc",
		abbreviation: "PDT",
		name: "Pacific Daylight Time (North America)",
		utc: "UTC-07",
		offset: 420
	},
	{
		id: "b4a04c3a-11ca-4d42-a9b9-41f2f3b83c4d",
		abbreviation: "PET",
		name: "Peru Time",
		utc: "UTC-05",
		offset: 300
	},
	{
		id: "e807be1b-8c8d-4e32-8f2c-9c1367d08f1d",
		abbreviation: "PETT",
		name: "Kamchatka Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		id: "5cc9ed88-f4ca-4315-be44-afbece83e953",
		abbreviation: "PGT",
		name: "Papua New Guinea Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		id: "a679604e-ebd5-48cc-9a96-0821c49b9f7d",
		abbreviation: "PHOT",
		name: "Phoenix Island Time",
		utc: "UTC+13",
		offset: -780
	},
	{
		id: "5025fbf8-0b79-4d84-9380-5a3f6f5b7252",
		abbreviation: "PHT",
		name: "Philippine Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "738bb979-a9a6-49f3-b661-3d0e9f785b68",
		abbreviation: "PKT",
		name: "Pakistan Standard Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "0a94cb43-c40f-4459-bc0c-49e4e1d7116b",
		abbreviation: "PMDT",
		name: "Saint Pierre and Miquelon Daylight time",
		utc: "UTC-02",
		offset: 120
	},
	{
		id: "6bccf114-c57f-44fa-ab62-5689b201b64c",
		abbreviation: "PMST",
		name: "Saint Pierre and Miquelon Standard Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "a051d4b9-1490-4517-af8a-df2a09404c62",
		abbreviation: "PONT",
		name: "Pohnpei Standard Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "7a54b535-40aa-4b70-bd7e-c2c99b9014fa",
		abbreviation: "PST",
		name: "Pacific Standard Time (North America)",
		utc: "UTC-08",
		offset: 480
	},
	{
		id: "1947c3ef-ef3f-4cd4-895d-b5d7ca4ef707",
		abbreviation: "PST",
		name: "Philippine Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "a68545d7-c6d9-41e8-98a5-4d7b9a833b21",
		abbreviation: "PYST",
		name: "Paraguay Summer Time (South America)",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "7997cf1f-ff5d-4cd1-9d53-b29822ec2a52",
		abbreviation: "PYT",
		name: "Paraguay Time (South America)",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "52a69135-0c36-4f43-8efe-25266e30a63e",
		abbreviation: "RET",
		name: "Reunion Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "7d387549-4348-478f-923f-fb5e5e563883",
		abbreviation: "ROTT",
		name: "Rothera Research Station Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "74d83746-f7ac-42a0-83b5-a575d449ff51",
		abbreviation: "SAKT",
		name: "Sakhalin Island time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "3bd4431a-6270-4db3-8b91-8b5f9fd4814d",
		abbreviation: "SAMT",
		name: "Samara Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "6fe93888-d4df-4d83-92b6-da27061f8730",
		abbreviation: "SAST",
		name: "South African Standard Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "5a15f016-2c5c-4ba1-b6e4-5709cee3b0ff",
		abbreviation: "SBT",
		name: "Solomon Islands Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "6d7c7434-06cc-4121-aab6-f5983fc626a9",
		abbreviation: "SCT",
		name: "Seychelles Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "9827b40f-2b0b-4ba3-a01e-aa1a50576162",
		abbreviation: "SDT",
		name: "Samoa Daylight Time",
		utc: "UTC-10",
		offset: 600
	},
	{
		id: "5ee1164f-d472-4411-8ce3-8d524c30509a",
		abbreviation: "SGT",
		name: "Singapore Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "feee2a2d-72d1-455c-8e14-8d23d9f313d6",
		abbreviation: "SLST",
		name: "Sri Lanka Standard Time",
		utc: "UTC+05:30",
		offset: -330
	},
	{
		id: "63cfe6e9-05b4-443a-ab2f-b5d95ba069ea",
		abbreviation: "SRET",
		name: "Srednekolymsk Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "a92209ff-7986-44bb-8b82-59c8e58d266e",
		abbreviation: "SRT",
		name: "Suriname Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "8825fbe5-0ea5-4718-8287-9ca421984d70",
		abbreviation: "SST",
		name: "Samoa Standard Time",
		utc: "UTC-11",
		offset: 660
	},
	{
		id: "69adec50-f54c-4104-b619-87bb081654f7",
		abbreviation: "SST",
		name: "Singapore Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "8e0398d4-1e9f-495e-a21f-a35c82b2cf1a",
		abbreviation: "SYOT",
		name: "Showa Station Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "24d9d064-b3f1-4e47-a642-18182c145dbf",
		abbreviation: "TAHT",
		name: "Tahiti Time",
		utc: "UTC-10",
		offset: 600
	},
	{
		id: "9f484664-17db-46c8-ad93-770a76f3271e",
		abbreviation: "THA",
		name: "Thailand Standard Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		id: "a522c9fc-2ac3-4556-a600-22d6a2ab71ec",
		abbreviation: "TFT",
		name: "Indian/Kerguelen",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "ed7c984b-fab5-4243-b5bc-9d2137bb76be",
		abbreviation: "TJT",
		name: "Tajikistan Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "2f8352a8-4d14-4dcb-a21d-c14bfefb2f08",
		abbreviation: "TKT",
		name: "Tokelau Time",
		utc: "UTC+13",
		offset: -780
	},
	{
		id: "9f2986bb-2e08-413a-b08d-a152e7b3f464",
		abbreviation: "TLT",
		name: "Timor Leste Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		id: "f89b6ae0-5bfa-4cec-be6e-dd1477149980",
		abbreviation: "TMT",
		name: "Turkmenistan Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "376f429a-5784-40e3-94c8-2563a50967c1",
		abbreviation: "TRT",
		name: "Turkey Time",
		utc: "UTC+03",
		offset: -180
	},
	{
		id: "793d5e44-6817-400b-b718-2c9ca3ec9e2c",
		abbreviation: "TOT",
		name: "Tonga Time",
		utc: "UTC+13",
		offset: -780
	},
	{
		id: "da01aaac-2e9d-4657-ab07-f6340f2b5ba3",
		abbreviation: "TVT",
		name: "Tuvalu Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		id: "9d54bd87-3dfb-427c-8a56-e85132fd6a03",
		abbreviation: "ULAST",
		name: "Ulaanbaatar Summer Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		id: "929b9135-3a1c-47d5-ab96-2648e10ce033",
		abbreviation: "ULAT",
		name: "Ulaanbaatar Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "6ca0a1c0-003d-46b2-8c37-ff3a3b62314d",
		abbreviation: "USZ1",
		name: "Kaliningrad Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "c0be0e90-f911-46c4-9808-8bae38099862",
		abbreviation: "UTC",
		name: "Coordinated Universal Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		id: "9aef2856-097d-465f-8310-87f99ff36873",
		abbreviation: "UYST",
		name: "Uruguay Summer Time",
		utc: "UTC-02",
		offset: 120
	},
	{
		id: "36987bc8-687d-45f3-bb36-675405adb1ab",
		abbreviation: "UYT",
		name: "Uruguay Standard Time",
		utc: "UTC-03",
		offset: 180
	},
	{
		id: "0325128a-87ea-43aa-967c-8762b491e1fb",
		abbreviation: "UZT",
		name: "Uzbekistan Time",
		utc: "UTC+05",
		offset: -300
	},
	{
		id: "6277a802-37f2-4cc4-9bd3-fd8e665a9c9c",
		abbreviation: "VET",
		name: "Venezuelan Standard Time",
		utc: "UTC-04",
		offset: 240
	},
	{
		id: "e89dd258-baec-4d1f-b07c-189e8100ed1a",
		abbreviation: "VLAT",
		name: "Vladivostok Time",
		utc: "UTC+10",
		offset: -600
	},
	{
		id: "86f254cf-2370-4fea-9df1-88d43d7f43c9",
		abbreviation: "VOLT",
		name: "Volgograd Time",
		utc: "UTC+04",
		offset: -240
	},
	{
		id: "1063bfbf-6f65-4803-9169-0a7bb61ffffe",
		abbreviation: "VOST",
		name: "Vostok Station Time",
		utc: "UTC+06",
		offset: -360
	},
	{
		id: "96c19fec-2b78-477b-9ddb-982585d925de",
		abbreviation: "VUT",
		name: "Vanuatu Time",
		utc: "UTC+11",
		offset: -660
	},
	{
		id: "bf55a455-15d8-47dd-8786-7fdf4922cf78",
		abbreviation: "WAKT",
		name: "Wake Island Time",
		utc: "UTC+12",
		offset: -720
	},
	{
		id: "c98bf038-298f-4bc1-884d-9eabe1d6acbb",
		abbreviation: "WAST",
		name: "West Africa Summer Time",
		utc: "UTC+02",
		offset: -120
	},
	{
		id: "526e7115-32a4-41da-9bca-6036b529f110",
		abbreviation: "WAT",
		name: "West Africa Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		id: "baa27862-7da6-4ae8-9f42-5ab310ba39d3",
		abbreviation: "WEST",
		name: "Western European Summer Time",
		utc: "UTC+01",
		offset: -60
	},
	{
		id: "2c90b186-eee4-4706-b2ed-a360e702f9a7",
		abbreviation: "WET",
		name: "Western European Time",
		utc: "UTC+00",
		offset: 0
	},
	{
		id: "0317d18d-bb2f-48ba-975d-ef0ca590ddbb",
		abbreviation: "WIT",
		name: "Western Indonesian Time",
		utc: "UTC+07",
		offset: -420
	},
	{
		id: "5c9b3e89-54ae-4615-9cf7-8d0b42c629aa",
		abbreviation: "WST",
		name: "Western Standard Time",
		utc: "UTC+08",
		offset: -480
	},
	{
		id: "ea93710b-6901-48cb-aee3-08fb24ec2d1d",
		abbreviation: "YAKT",
		name: "Yakutsk Time",
		utc: "UTC+09",
		offset: -540
	},
	{
		id: "b9760823-d8ee-4c51-bb23-6d86686ad032",
		abbreviation: "YEKT",
		name: "Yekaterinburg Time",
		utc: "UTC+05",
		offset: -300
	}
];
