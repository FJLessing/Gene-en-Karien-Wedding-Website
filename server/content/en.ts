import type { SiteContent } from "#shared/types/types";

// English site content. Copy is sourced from the Figma design (Wireframe Mockup
// 2, node 32:658); FAQ copy supplied by the couple. Fields neither specifies
// (Friday/Sunday program, extra Dullstroom activities) carry placeholder copy
// consistent with the design facts and should be confirmed with the couple.
const en: SiteContent = {
	couple: {
		nameOne: "Gene Stoltz",
		nameTwo: "Karien de Kock",
		invitationLine1: "You are hereby",
		invitationLine2: "formally invited to the nuptials of",
	},
	event: {
		dates: "9 - 11 October 2026",
		year: "2026",
		startsAt: "2026-10-10T15:00:00+02:00", // ceremony at the chapel, Saturday 15:00
		venueName: "Dunkeld Equestrian Estate",
		venueLocation: "Dullstroom, Mpumalanga",
		rsvpBy: "20 July 2026",
	},
	welcome: [
		"Welcome to our wedding website!",
		"We are thrilled to celebrate our special day with the people who mean the most to us. Here, you will find all the details you need for the evening.",
		"We cannot wait to raise a glass and celebrate with you.",
	],
	details: {
		dates: "9 - 11 October 2026",
		year: "2026",
		location: ["Dunkeld Equestrian Estate,", " Dullstroom, Mpumalanga"],
		rsvpBy: "20 July 2026",
	},
	program: [
		{
			label: "Friday",
			items: [
				{ time: "15:00", icon: "arrival", description: "arrival and check-in at the estate" },
				{ time: "18:00", icon: "drinks", description: "welcome drinks" },
			],
		},
		{
			label: "Saturday",
			items: [
				{ time: "15:00", icon: "ceremony", description: "ceremony at the chapel" },
				{ time: "17:00", icon: "drinks", description: "drinks and canapés on the lawn" },
				{ time: "18:00", icon: "reception", description: "the reception begins!" },
			],
		},
		{
			label: "Sunday",
			items: [
				{ time: "10:00", icon: "farewell", description: "farewell breakfast and check-out" },
			],
		},
	],
	dressCode: "The dress code for the festivities is strictly black tie.",
	venue: {
		about: "Our celebration will take place at the beautiful Dunkeld Country & Equestrian Estate in Dullstroom. Surrounded by whispering pine forests, rolling hills, and crystal-clear lakes, the estate perfectly balances rustic tranquility with modern elegance. We are thrilled to host you in this serene, unforgettable countryside setting.",
		mapUrl: "",
		contact: "Contact the events team at Dunkeld Equestrian Estate to book your activity before the day: 0112346448 or at dunkeld@gmail.co.za",
		accommodation: {
			heading: "Book your accommodation",
			body: [
				"Accommodation is reserved through Jennifer Sanderson at Touchdown Africa. Please email her and quote our booking reference ",
				"242178.59",
				"Use the button below to open a pre-filled email — Gene is cc'd so we can help keep track of bookings.",
			],
			booking: {
				email: "jennifers@touchdown-africa.com",
				cc: "ggsgene@gmail.com",
				reference: "242178.59",
				subject: "Accommodation booking — Gene & Karien's wedding (ref 242178.59)",
				draft:
					"Hi Jennifer,\n\nI would like to book accommodation for Gene & Karien's wedding at Dunkeld Equestrian Estate (9–11 October 2026).\n\nBooking reference: 242178.59\n\nMy details:\nName:\nNumber of guests:\nNights / dates:\nContact number:\n\nThank you!",
				cta: "Email to book your stay",
			},
		},
		// Images downloaded from dunkeldestate.co.za/activities (public/img/activities).
		// Activities without a matching estate photo carry an empty image.
		activities: [
			{ title: "Horse Riding", image: "/img/activities/horse_riding.webp", description: "Take a guided ride through the estate's rolling hills.", link: "https://www.dunkeldestate.co.za/horse-riding/" },
			{ title: "Fly Fishing", image: "/img/activities/fly_fishing.webp", description: "Cast a line in the estate's crystal-clear trout dams.", link: "https://www.dunkeldestate.co.za/fly-fishing/" },
			{ title: "Archery", image: "/img/activities/archery.webp", description: "Test your aim at the estate's archery range.", link: "https://www.dunkeldestate.co.za/archery-2/" },
			{ title: "Paintball", image: "/img/activities/paintball.webp", description: "Gather a team for a friendly paintball skirmish.", link: "https://www.dunkeldestate.co.za/paintball-2/" },
			{ title: "Spa", image: "/img/activities/spa.webp", description: "Unwind with a treatment at the estate spa.", link: "" },
			{ title: "Four Wheeling", image: "/img/activities/quad_biking.webp", description: "Explore the countryside on a four-wheeler.", link: "https://www.dunkeldestate.co.za/quad-biking/" },
			{ title: "Hiking & Running", image: "/img/activities/hiking_running.webp", description: "Follow the trails through pine forests and hills.", link: "https://www.dunkeldestate.co.za/hiking-running/" },
			{ title: "Mini Golf", image: "/img/activities/mini_golf.webp", description: "A relaxed round of putt-putt on the estate.", link: "https://www.dunkeldestate.co.za/adventure-centre/" },
			{ title: "Mountain Biking", image: "/img/activities/mountain_biking.webp", description: "Ride the estate's scenic mountain-bike trails.", link: "https://www.dunkeldestate.co.za/mountain-biking/" },
			{ title: "Padel", image: "/img/activities/padel.webp", description: "Book a court for a social game of padel.", link: "https://www.dunkeldestate.co.za/activities/" },
		],
	},
	// Area activities supplied by the couple, grouped into three accordions. Images live in
	// public/img/area-activities (filenames kept verbatim, incl. their original typos).
	areaActivities: [
		{
			heading: "Dullstroom activities",
			items: [
				{ title: "Wild About Whisky", image: "/img/area-activities/wild-about-whiskey.webp", description: "Sample South Africa's largest selection of whiskies in the heart of Dullstroom.", link: "https://wildaboutwhisky.com/" },
				{ title: "Dullstroom Birds of Prey & Rehabilitation Centre", image: "/img/area-activities/birds-of-prey.webp", description: "Meet rescued eagles, owls and falcons at daily flight demonstrations.", link: "https://www.birdsofprey.co.za/" },
				{ title: "Highland Gate Golf Estate", image: "/img/area-activities/highland-golf-estate.webp", description: "Play a round on the highland fairways or stop in for a meal with a view.", link: "https://highlandgate.co.za/" },
			],
		},
		{
			heading: "Restaurants & Bars",
			items: [
				{ title: "Mayfly Restaurant & Cocktail Lounge", image: "/img/area-activities/mayfly-restaurant.webp", description: "Modern country dining and cocktails in the village centre.", link: "https://www.mayfly.co.za/index.html" },
				{ title: "CPirit Market Place", image: "/img/area-activities/cpirit-market-place.webp", description: "A deli and tasting room — charcuterie, cheeses, olive oil and chocolates — plus craft beer, burgers and gin tastings.", link: "https://cpirit.co.za/market-place/" },
				{ title: "Baker Boys Eatery", image: "/img/area-activities/baker-boys-eatery.webp", description: "A local favourite for breakfast.", link: "" },
				{ title: "Vine Restaurant & Wine Bar", image: "/img/area-activities/vine-restaurant-and-wine-bar.webp", description: "Relaxed plates paired with a thoughtful wine list.", link: "https://www.sohodullstroom.com/vine" },
				{ title: "Hennie's Dullstroom", image: "/img/area-activities/hennies.webp", description: "A Dullstroom institution for hearty pub fare.", link: "https://www.therealhennies.co.za/branches/hennies-dullstroom" },
				{ title: "Harrie's Pancakes", image: "/img/area-activities/harries.webp", description: "Sweet and savoury pancakes — a Dullstroom tradition.", link: "https://harriespancakes.co.za/dullstroom/" },
				{ title: "The Dullstroom Inn Restaurant", image: "/img/area-activities/dullstroom-inn.webp", description: "Classic country-pub meals at the historic Dullstroom Inn.", link: "https://www.dullstroominn.co.za/" },
				{ title: "Windpomp Bistro", image: "/img/area-activities/windpomp-bistro.webp", description: "Coffee, light meals and craft beer, with tastings on offer.", link: "https://www.dullstroombrewery.com/" },
			],
		},
		{
			heading: "Other",
			items: [
				{ title: "Dullstroom on Horseback", image: "/img/area-activities/dullstrooom-on-horseback.webp", description: "Guided horseback trails through the Dullstroom countryside.", link: "https://dullstroomonhorseback.co.za/" },
				{ title: "Milly's Trout Stall", image: "/img/area-activities/millys.webp", description: "Fresh and smoked trout from a roadside Dullstroom institution.", link: "" },
				{ title: "Dimitrov Art Gallery", image: "/img/area-activities/dimitrov-art-gallery.webp", description: "Original artworks on show in the village.", link: "" },
				{ title: "Dullstroom Gin", image: "/img/area-activities/dullstroom-gin.webp", description: "Small-batch highland gin, with tastings available.", link: "https://dullstroomgin.com/" },
				{ title: "Atelier Asteria", image: "/img/area-activities/attelier-asteria-art-gallery.webp", description: "A contemporary art gallery and studio space.", link: "https://asteriagallery.co.za/" },
				{ title: "The Gables Centre", image: "/img/area-activities/the-gables-centre.webp", description: "A village shopping centre with shops and eateries.", link: "" },
			],
		},
	],
	faqs: [
		{
			question: "Can I bring a plus one?",
			answer: "Please note that unless you’ve received a personal invitation including a guest, we ask that you do not bring a plus one.",
		},
		{
			question: "Can I bring my children?",
			answer: "We have decided to make our wedding an adult-only celebration. There will be a baby area with babysitters available for those under 2, and we ask that you arrange care for older children — rooms are large enough to accommodate both.",
		},
		{
			question: "What is happening on Friday night?",
			answer: "We invite everyone to come and join us on Friday night at the venue. We will provide food at the Tea Garden venue, and drinks will be available at the Jazz Club. Parking will be available next to the hotel. We would like everyone to join for the whole weekend, and accommodation is available at reduced rates at the Dunkeld Equestrian Estate.",
		},
		{
			question: "The dress code says black tie, what does that mean?",
			answer: "For the men: a tuxedo or dark suit (black, charcoal or navy) with a bow tie or tie. For the ladies: a floor-length gown or elegant evening dress. If you’re still not sure, please reach out to Karien for advice or to double-check your outfit.",
		},
		{
			question: "Gifts",
			answer: "We know that many of you are going out of your way — crossing borders, provinces, and time zones — just to celebrate with us. Being surrounded by all our favourite people is more than enough. But if you’re feeling especially generous and want to give us something, we ask that you contribute to our home’s art collection.",
		},
		{
			question: "Will there be a cash bar?",
			answer: "We will be providing drinks during canapés, and bubbles and wine during the reception. All other drinks will be available at the two available bars throughout the night — since one is just never enough!",
		},
		{
			question: "By when should I RSVP?",
			answer: "Please let us know whether you’ll be able to attend our weekend celebration by 20 July.",
		},
		{
			question: "Will my dietary restrictions be catered for?",
			answer: "Absolutely! After your RSVP there will be an option to select your dishes for the night. Please also indicate whether you have any other restrictions or preferences, and especially any allergies we need to be aware of.",
		},
		{
			question: "Where can I upload pictures of the day?",
			answer: "There will be a scannable QR code on the day that will direct you to our album, as well as a link on our website to upload all your photos.",
		},
		{
			question: "Dullstroom looks incredible — could we come through earlier?",
			answer: "Absolutely! We will be on the venue from the Thursday onwards; you are more than welcome to join us. Please also see the activity links for a whole list of activities to enjoy.",
		},
	],
	rsvp: {
		mealOptions: [
			{ label: "Beef", value: "beef" },
			{ label: "Chicken", value: "chicken" },
			{ label: "Vegetarian", value: "vegetarian" },
			{ label: "Fish", value: "fish" },
		],
		dietaryOptions: [
			{ label: "None", value: "none" },
			{ label: "Vegetarian", value: "vegetarian" },
			{ label: "Vegan", value: "vegan" },
			{ label: "Gluten-free", value: "gluten-free" },
			{ label: "Halal", value: "halal" },
			{ label: "Kosher", value: "kosher" },
		],
	},
	footer: { tagline: "We can’t wait to see you there!" },
	ui: {
		nav: { rsvpHere: "RSVP here", back: "Back", backHome: "Back to home page", scroll: "scroll" },
		countdown: { ariaLabel: "Countdown to the wedding", days: "days", hours: "hours", minutes: "minutes", seconds: "seconds" },
		details: { heading: "The details", when: "When", where: "Where", rsvpBy: "RSVP by" },
		program: { heading: "The program" },
		dressCode: { heading: "Dress code" },
		venue: {
			heading: "About the venue",
			bookAccommodation: "Book your accommodation",
			activitiesTitle: "Venue activities",
			downloadMap: "Download the venue map",
			bookNow: "Book now",
			copyReference: "Copy reference number",
			copied: "Copied!",
		},
		areaActivities: { learnMore: "Learn more" },
		faqs: { heading: "FAQs" },
		gate: {
			passwordLabel: "Password",
			passwordPlaceholder: "enter password",
			open: "Open",
			wrongPassword: "That password didn't match. Please try again.",
		},
		loader: { loading: "Loading" },
		gallery: {
			metaTitle: "Gallery",
			heading: "Photo gallery",
			lockedMessage: "The gallery opens on the wedding weekend. Check back soon!",
		},
		photoUpload: {
			heading: "Share your photos",
			metaTitle: "Share Photos",
			choose: "Choose photo(s)",
			selectedSuffix: "selected",
			upload: "Upload photos",
			success: "Thanks for sharing your photos!",
			failed: "Upload failed.",
		},
		rsvp: {
			metaTitle: "RSVP",
			rsvpingFor: "I am RSVPing for:",
			searchPlaceholder: "Type your name to search",
			notFound: "We couldn't find that name. Maybe your partner has already RSVP\'d? Otherwise try again, or send us a message.",
			attendingHeading: "I am attending",
			yes: "Yes, can't wait!",
			no: "Unfortunately I won't be able to.",
			arrivalOptions: [
				{ label: "Saturday only", value: "saturday" },
				{ label: "Friday and Saturday", value: "friday" },
			],
			placeholders: {
				guestName: "Enter guest name",
				email: "Enter your email address",
				phone: "Enter your phone number",
				meal: "Select menu option",
				dietary: "Dietary restrictions",
				arrival: "I'm coming on",
				song: "Request a song",
			},
			addedSuffix: "— added",
			countryCodes: [
				{ label: "South Africa (+27)", value: "+27" },
				{ label: "United Kingdom (+44)", value: "+44" },
				{ label: "United States (+1)", value: "+1" },
				{ label: "Australia (+61)", value: "+61" },
				{ label: "New Zealand (+64)", value: "+64" },
				{ label: "Germany (+49)", value: "+49" },
				{ label: "Netherlands (+31)", value: "+31" },
				{ label: "UAE (+971)", value: "+971" },
				{ label: "France (+33)", value: "+33" },
				{ label: "Belgium (+32)", value: "+32" },
			],
			saveGuest: "Save guest",
			addGuest: "Add guest",
			addPlusOne: "Add plus one",
			partnerPlaceholder: "Search for your guest",
			removeGuest: "Remove",
			submit: "RSVP",
			thankYou: "Thank you",
			attendingMsg: [
				"We can't wait to see you on our big day!",
				"Please share a nice photo of us if you have one."
			],
			declinedMsg: "Thank you for letting us know!",
		},
		meta: { homeDescription: "You are invited to celebrate with us." },
		errors: {
			content: "Failed to load content",
			guests: "Failed to load guest list",
			rsvpSubmit: "Failed to submit RSVP",
			request: "Request failed",
		},
	},
};

export default en;
