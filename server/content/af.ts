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
			heading: "Bespreek nou jou verblyf",
			body: "Neem asseblief kennis dat alle aktiwiteite vooraf by die venue bespreek moet word.",
			bookingUrl: "",
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
	areaActivities: [
		{ title: "Mal oor Whiskey", image: "", description: "Proe Suid-Afrika se grootste keuse whiskies in die hart van Dullstroom.", link: "" },
		{ title: "Vlieghengel", image: "", description: "Dullstroom is die vlieghengel-hoofstad van Suid-Afrika — dagpermitte is by die dorp se damme beskikbaar.", link: "" },
		{ title: "Dullstroom-dorpie", image: "", description: "Snuffel deur die dorp se plattelandse winkels, pannekoekhuise en koffiebranderye.", link: "" },
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
		},
		areaActivities: { heading: "Dullstroom-aktiwiteite", learnMore: "Lees meer" },
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
			},
			addedSuffix: "— bygevoeg",
			saveGuest: "Stoor gas",
			addGuest: "Voeg gas by",
			submit: "RSVP",
			thankYou: "Dankie",
			attendingMsg: "Ons kan nie wag om jou op ons groot dag te sien nie!",
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
