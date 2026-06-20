import type { SiteContent } from "#shared/types/types";

// Afrikaans site content. Mirrors the structure of en.ts. Stable keys that must
// not be translated — option `value`s (they key the Google Sheet), program
// `icon`s, image paths, links, the ISO `startsAt`, and proper nouns (names,
// venue) — are kept identical to the English file on purpose.
const af: SiteContent = {
	couple: {
		nameOne: "Gene Stoltz",
		nameTwo: "Karien de Kock",
		invitationLine1: "Jy word hiermee",
		invitationLine2: "formeel uitgenooi na die huwelik van",
	},
	event: {
		dates: "9 - 11 Oktober",
		year: "2026",
		startsAt: "2026-10-10T15:00:00+02:00",
		venueName: "Dunkeld Equestrian Estate",
		venueLocation: "Dullstroom, Mpumalanga",
		rsvpBy: "20 Julie 2026",
	},
	welcome: [
		"Welkom by ons trouwebwerf!",
		"Ons is dolgelukkig om ons spesiale dag te vier saam met die mense wat die meeste vir ons beteken. Hier sal jy al die besonderhede vind wat jy vir die aand nodig het.",
		"Ons kan nie wag om ’n glas te lig en saam met jou te vier nie.",
	],
	details: {
		dates: "9 - 11 Oktober",
		year: "2026",
		location: ["Dunkeld Equestrian Estate,", "Dullstroom, Mpumalanga"],
		rsvpBy: "20 Julie 2026",
	},
	program: [
		{
			label: "Vrydag",
			items: [
				{ time: "15:00", icon: "arrival", description: "aankoms en inklok by die landgoed" },
				{ time: "18:00", icon: "drinks", description: "verwelkomingsdrankies" },
			],
		},
		{
			label: "Saterdag",
			items: [
				{ time: "15:00", icon: "ceremony", description: "seremonie by die kapel" },
				{ time: "17:00", icon: "drinks", description: "drankies en happies op die grasperk" },
				{ time: "18:00", icon: "reception", description: "die onthaal begin!" },
			],
		},
		{
			label: "Sondag",
			items: [
				{ time: "10:00", icon: "farewell", description: "afskeidsontbyt en uitklok" },
			],
		},
	],
	dressCode: "Die kleredrag vir die feestelikhede is streng swartdas (black tie).",
	venue: {
		about: "Ons viering vind plaas by die pragtige Dunkeld Country & Equestrian Estate in Dullstroom. Omring deur fluisterende dennebosse, glooiende heuwels en kristalhelder mere, balanseer die landgoed landelike rus perfek met moderne elegansie. Ons sien daarna uit om jou in hierdie stil, onvergeetlike platteland-omgewing te ontvang.",
		mapUrl: "",
		contact: "Kontak die geleenthede-span by Dunkeld Equestrian Estate om jou aktiwiteit voor die dag te bespreek: 0112346448 of by dunkeld@gmail.co.za",
		accommodation: {
			heading: "Bespreek jou verblyf",
			body: [
				"Verblyf word deur Jennifer Sanderson by Touchdown Africa bespreek. Stuur asseblief vir haar ’n e-pos en meld ons besprekingsverwysing",
				"242178.59",
				"Gebruik die knoppie hieronder om ’n vooraf-ingevulde e-pos oop te maak — Gene word ge-cc sodat ons kan help om besprekings by te hou."
			],
			booking: {
				email: "jennifers@touchdown-africa.com",
				cc: "ggsgene@gmail.com",
				reference: "242178.59",
				subject: "Verblyfbespreking — Gene & Karien se troue (verw 242178.59)",
				draft:
					"Hallo Jennifer,\n\nEk wil graag verblyf bespreek vir Gene & Karien se troue by Dunkeld Equestrian Estate (9–11 Oktober 2026).\n\nBesprekingsverwysing: 242178.59\n\nMy besonderhede:\nNaam:\nAantal gaste:\nNagte / datums:\nKontaknommer:\n\nBaie dankie!",
				cta: "Stuur e-pos om te bespreek",
			},
		},
		activities: [
			{ title: "Perdry", image: "/img/activities/horse_riding.webp", description: "Geniet ’n begeleide rit deur die landgoed se glooiende heuwels.", link: "https://www.dunkeldestate.co.za/horse-riding/" },
			{ title: "Vlieghengel", image: "/img/activities/fly_fishing.webp", description: "Gooi ’n lyn in die landgoed se kristalhelder forelle-damme.", link: "https://www.dunkeldestate.co.za/fly-fishing/" },
			{ title: "Boogskiet", image: "/img/activities/archery.webp", description: "Toets jou mikpunt by die landgoed se boogskietbaan.", link: "https://www.dunkeldestate.co.za/archery-2/" },
			{ title: "Paintball", image: "/img/activities/paintball.webp", description: "Bring ’n span bymekaar vir ’n vriendskaplike paintball-geveg.", link: "https://www.dunkeldestate.co.za/paintball-2/" },
			{ title: "Spa", image: "/img/activities/spa.webp", description: "Ontspan met ’n behandeling by die landgoed se spa.", link: "" },
			{ title: "Vierwielry", image: "/img/activities/quad_biking.webp", description: "Verken die platteland op ’n vierwiel-motorfiets.", link: "https://www.dunkeldestate.co.za/quad-biking/" },
			{ title: "Stap & Draf", image: "/img/activities/hiking_running.webp", description: "Volg die roetes deur dennebosse en heuwels.", link: "https://www.dunkeldestate.co.za/hiking-running/" },
			{ title: "Mini-gholf", image: "/img/activities/mini_golf.webp", description: "’n Ontspanne rondte pof-pof op die landgoed.", link: "https://www.dunkeldestate.co.za/adventure-centre/" },
			{ title: "Bergfietsry", image: "/img/activities/mountain_biking.webp", description: "Ry die landgoed se skilderagtige bergfietsroetes.", link: "https://www.dunkeldestate.co.za/mountain-biking/" },
			{ title: "Padel", image: "/img/activities/padel.webp", description: "Bespreek ’n baan vir ’n sosiale potjie padel.", link: "https://www.dunkeldestate.co.za/activities/" },
		],
	},
	// Area-aktiwiteite deur die paartjie verskaf, in drie akkordeons gegroepeer. Titels,
	// beelde en skakels bly identies aan en.ts; opskrifte en beskrywings is vertaal.
	areaActivities: [
		{
			heading: "Dullstroom-aktiwiteite",
			items: [
				{ title: "Wild About Whisky", image: "/img/area-activities/wild-about-whiskey.webp", description: "Proe Suid-Afrika se grootste keuse whiskies in die hart van Dullstroom.", link: "https://wildaboutwhisky.com/" },
				{ title: "Dullstroom Birds of Prey & Rehabilitation Centre", image: "/img/area-activities/birds-of-prey.webp", description: "Ontmoet geredde arende, uile en valke by daaglikse vlugdemonstrasies.", link: "https://www.birdsofprey.co.za/" },
				{ title: "Highland Gate Golf Estate", image: "/img/area-activities/highland-golf-estate.webp", description: "Speel ’n rondte op die hooglandbane of kuier vir ’n ete met ’n uitsig.", link: "https://highlandgate.co.za/" },
			],
		},
		{
			heading: "Restaurante & Kroeë",
			items: [
				{ title: "Mayfly Restaurant & Cocktail Lounge", image: "/img/area-activities/mayfly-restaurant.webp", description: "Moderne plattelandse eetplek en mengeldrankies in die dorpsentrum.", link: "https://www.mayfly.co.za/index.html" },
				{ title: "CPirit Market Place", image: "/img/area-activities/cpirit-market-place.webp", description: "’n Deli en proelokaal — vleisware, kase, olyfolie en sjokolade — plus ambagsbier, burgers en jenewerproe.", link: "https://cpirit.co.za/market-place/" },
				{ title: "Baker Boys Eatery", image: "/img/area-activities/baker-boys-eatery.webp", description: "’n Plaaslike gunsteling vir ontbyt.", link: "" },
				{ title: "Vine Restaurant & Wine Bar", image: "/img/area-activities/vine-restaurant-and-wine-bar.webp", description: "Ontspanne geregte saam met ’n deurdagte wynlys.", link: "https://www.sohodullstroom.com/vine" },
				{ title: "Hennie's Dullstroom", image: "/img/area-activities/hennies.webp", description: "’n Dullstroom-instelling vir stewige kroegkos.", link: "https://www.therealhennies.co.za/branches/hennies-dullstroom" },
				{ title: "Harrie's Pancakes", image: "/img/area-activities/harries.webp", description: "Soet en hartige pannekoek — ’n Dullstroom-tradisie.", link: "https://harriespancakes.co.za/dullstroom/" },
				{ title: "The Dullstroom Inn Restaurant", image: "/img/area-activities/dullstroom-inn.webp", description: "Klassieke kroegkos by die historiese Dullstroom Inn.", link: "https://www.dullstroominn.co.za/" },
				{ title: "Windpomp Bistro", image: "/img/area-activities/windpomp-bistro.webp", description: "Koffie, ligte etes en ambagsbier, met proegeleenthede.", link: "https://www.dullstroombrewery.com/" },
			],
		},
		{
			heading: "Ander",
			items: [
				{ title: "Dullstroom on Horseback", image: "/img/area-activities/dullstrooom-on-horseback.webp", description: "Begeleide perdroetes deur die Dullstroom-platteland.", link: "https://dullstroomonhorseback.co.za/" },
				{ title: "Milly's Trout Stall", image: "/img/area-activities/millys.webp", description: "Vars en gerookte forel by ’n bekende padstal in Dullstroom.", link: "" },
				{ title: "Dimitrov Art Gallery", image: "/img/area-activities/dimitrov-art-gallery.webp", description: "Oorspronklike kunswerke op uitstalling in die dorp.", link: "" },
				{ title: "Dullstroom Gin", image: "/img/area-activities/dullstroom-gin.webp", description: "Kleinmaat-hooglandjenewer, met proegeleenthede beskikbaar.", link: "https://dullstroomgin.com/" },
				{ title: "Atelier Asteria", image: "/img/area-activities/attelier-asteria-art-gallery.webp", description: "’n Eietydse kunsgalery en ateljee-ruimte.", link: "https://asteriagallery.co.za/" },
				{ title: "The Gables Centre", image: "/img/area-activities/the-gables-centre.webp", description: "’n Dorpswinkelsentrum met winkels en eetplekke.", link: "" },
			],
		},
	],
	faqs: [
		{
			question: "Kan ek ’n metgesel saambring?",
			answer: "Neem asseblief kennis dat, tensy jy ’n persoonlike uitnodiging ontvang het wat ’n gas insluit, ons vra dat jy nie ’n metgesel saambring nie.",
		},
		{
			question: "Kan ek my kinders saambring?",
			answer: "Ons het besluit om ons troue ’n viering vir slegs volwassenes te maak. Daar sal ’n babahoekie met oppassers beskikbaar wees vir dié onder 2, en ons vra dat jy sorg vir ouer kinders reël — die kamers is groot genoeg om beide te akkommodeer.",
		},
		{
			question: "Wat gebeur Vrydagaand?",
			answer: "Ons nooi almal om Vrydagaand by die venue by ons aan te sluit. Ons sal kos by die Tea Garden-venue voorsien, en drankies sal by die Jazz Club beskikbaar wees. Parkering sal langs die hotel beskikbaar wees. Ons wil graag hê almal moet vir die hele naweek aansluit, en verblyf is teen verlaagde tariewe by die Dunkeld Equestrian Estate beskikbaar.",
		},
		{
			question: "Die kleredrag sê swartdas (black tie) — wat beteken dit?",
			answer: "Vir die mans: ’n tuxedo of donker pak (swart, houtskool of vlootblou) met ’n strikdas of das. Vir die dames: ’n vloerlengte rok of elegante aanddrag. As jy steeds nie seker is nie, kontak gerus vir Karien vir advies of om jou uitrusting te bevestig.",
		},
		{
			question: "Geskenke",
			answer: "Ons weet dat baie van julle moeite doen — oor grense, provinsies en tydsones reis — net om saam met ons te vier. Om omring te wees deur al ons gunstelingmense is meer as genoeg. Maar as jy besonder vrygewig voel en vir ons iets wil gee, vra ons dat jy tot ons huis se kunsversameling bydra.",
		},
		{
			question: "Sal daar ’n kontantkroeg wees?",
			answer: "Ons sal drankies tydens die happies voorsien, en vonkelwyn en wyn tydens die onthaal. Alle ander drankies sal die hele aand by die twee kroeë beskikbaar wees — want een is mos nooit genoeg nie!",
		},
		{
			question: "Teen wanneer moet ek RSVP?",
			answer: "Laat ons asseblief teen 20 Julie weet of jy ons naweekviering sal kan bywoon.",
		},
		{
			question: "Sal my dieetvereistes geakkommodeer word?",
			answer: "Beslis! Ná jou RSVP sal daar ’n opsie wees om jou geregte vir die aand te kies. Dui asseblief ook aan of jy enige ander vereistes of voorkeure het, en veral enige allergieë waarvan ons bewus moet wees.",
		},
		{
			question: "Waar kan ek foto’s van die dag oplaai?",
			answer: "Daar sal op die dag ’n skanbare QR-kode wees wat jou na ons album sal lei, asook ’n skakel op ons webwerf om al jou foto’s op te laai.",
		},
		{
			question: "Dullstroom lyk ongelooflik — kan ons vroeër deurkom?",
			answer: "Beslis! Ons sal van die Donderdag af op die venue wees; jy is meer as welkom om by ons aan te sluit. Sien asseblief ook die aktiwiteitskakels vir ’n hele lys aktiwiteite om te geniet.",
		},
	],
	rsvp: {
		mealOptions: [
			{ label: "Beesvleis", value: "beef" },
			{ label: "Hoender", value: "chicken" },
			{ label: "Vegetaries", value: "vegetarian" },
			{ label: "Vis", value: "fish" },
		],
		dietaryOptions: [
			{ label: "Geen", value: "none" },
			{ label: "Vegetaries", value: "vegetarian" },
			{ label: "Veganies", value: "vegan" },
			{ label: "Glutenvry", value: "gluten-free" },
			{ label: "Halaal", value: "halal" },
			{ label: "Kosher", value: "kosher" },
		],
	},
	footer: { tagline: "Ons kan nie wag om jou daar te sien nie!" },
	ui: {
		nav: { rsvpHere: "RSVP hier", back: "Terug", backHome: "Terug na tuisblad", scroll: "rol af" },
		countdown: { ariaLabel: "Aftelling tot die troue", days: "dae", hours: "ure", minutes: "minute", seconds: "sekondes" },
		details: { heading: "Die besonderhede", when: "Wanneer", where: "Waar", rsvpBy: "RSVP voor" },
		program: { heading: "Die program" },
		dressCode: { heading: "Kleredrag" },
		venue: {
			heading: "Oor die venue",
			bookAccommodation: "Bespreek jou verblyf",
			activitiesTitle: "Venue-aktiwiteite",
			downloadMap: "Laai die venue-kaart af",
			bookNow: "Bespreek nou",
			copyReference: "Kopieer verwysingsnommer",
			copied: "Gekopieer!",
		},
		areaActivities: { learnMore: "Lees meer" },
		faqs: { heading: "Algemene vrae" },
		gate: {
			passwordLabel: "Wagwoord",
			passwordPlaceholder: "voer wagwoord in",
			open: "Maak oop",
			wrongPassword: "Daardie wagwoord stem nie ooreen nie. Probeer asseblief weer.",
		},
		loader: { loading: "Laai tans" },
		gallery: {
			metaTitle: "Galery",
			heading: "Fotogalery",
			lockedMessage: "Die galery maak oop op die troue-naweek. Kom kyk binnekort weer!",
		},
		photoUpload: {
			choose: "Kies foto(’s)",
			selectedSuffix: "gekies",
			upload: "Laai foto’s op",
			success: "Dankie dat jy jou foto’s deel!",
			failed: "Oplaai het misluk.",
		},
		rsvp: {
			metaTitle: "RSVP",
			rsvpingFor: "Ek RSVP vir:",
			searchPlaceholder: "Tik jou naam om te soek",
			notFound: "Ons kon nie daardie naam vind nie. Probeer asseblief weer.",
			attendingHeading: "Ek woon by",
			yes: "Ja, ek kan nie wag nie!",
			no: "Ongelukkig sal ek nie kan nie.",
			arrivalOptions: [
				{ label: "Slegs Saterdag", value: "saturday" },
				{ label: "Vrydag en Saterdag", value: "friday" },
			],
			placeholders: {
				guestName: "Voer gas se naam in",
				email: "Voer jou e-posadres in",
				phone: "Voer jou telefoonnommer in",
				meal: "Kies spyskaart-opsie",
				dietary: "Dieetvereistes",
				arrival: "Ek kom op",
				song: "Versoek 'n liedjie",
			},
			addedSuffix: "— bygevoeg",
			saveGuest: "Stoor gas",
			addGuest: "Voeg gas by",
			addPlusOne: "Voeg plus een by",
			partnerPlaceholder: "Soek vir jou gas",
			removeGuest: "Verwyder",
			submit: "RSVP",
			thankYou: "Dankie",
			attendingMsg:[
				"Ons kan nie wag om jou op ons groot dag te sien nie!",
				"Deel assblief 'n mooi foto van ons twee as jy een het."
			],
			declinedMsg: "Dankie dat jy ons laat weet het!",
		},
		meta: { homeDescription: "Jy is uitgenooi om saam met ons te vier." },
		errors: {
			content: "Inhoud kon nie laai nie",
			guests: "Gastelys kon nie laai nie",
			rsvpSubmit: "RSVP kon nie ingedien word nie",
			request: "Versoek het misluk",
		},
	},
};

export default af;
