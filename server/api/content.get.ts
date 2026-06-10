import type { SiteContent } from "#shared/types/types";

// Copy is sourced from the Figma design (Wireframe Mockup 2, node 32:658);
// FAQ copy supplied by the couple. Fields neither specifies (Friday/Sunday
// program, extra Dullstroom activities) carry placeholder copy consistent
// with the design facts and should be confirmed with the couple.
export default defineEventHandler((): SiteContent => {
	return {
		couple: {
			nameOne: "Gene Stoltz",
			nameTwo: "Karien de Kock",
			invitationLine: "You are hereby formally invited to the nuptials of",
		},
		event: {
			dateLabel: "9 - 11 October 2026",
			startsAt: "2026-10-10T15:00:00+02:00", // ceremony at the chapel, Saturday 15:00
			venueName: "Dunkeld Equestrian Estate",
			venueLocation: "Dullstroom, Mpumalanga",
			rsvpByLabel: "20 July 2026",
		},
		welcome: "Welcome to our wedding website! We are thrilled to celebrate our special day with the people who mean the most to us. Here, you will find all the details you need for the evening. We cannot wait to raise a glass and celebrate with you.",
		details: {
			dateLabel: "9 - 11 October 2026",
			locationLabel: "Dunkeld Equestrian Estate, Dullstroom, Mpumalanga",
			rsvpByLabel: "RSVP by 20 July 2026",
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
					{ time: "23:00", icon: "last-rounds", description: "last rounds" },
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
				heading: "Book your accommodation now",
				body: "Kindly note all activities have to be booked with the venue in advance.",
				bookingUrl: "",
			},
			activities: [
				{ title: "Horse Riding", image: "", description: "Take a guided ride through the estate's rolling hills.", link: "" },
				{ title: "Fly Fishing", image: "", description: "Cast a line in the estate's crystal-clear trout dams.", link: "" },
				{ title: "Archery", image: "", description: "Test your aim at the estate's archery range.", link: "" },
				{ title: "Paintball", image: "", description: "Gather a team for a friendly paintball skirmish.", link: "" },
				{ title: "Spa", image: "", description: "Unwind with a treatment at the estate spa.", link: "" },
				{ title: "Four Wheeling", image: "", description: "Explore the countryside on a four-wheeler.", link: "" },
				{ title: "Hiking & Running", image: "", description: "Follow the trails through pine forests and hills.", link: "" },
				{ title: "Mini Golf", image: "", description: "A relaxed round of putt-putt on the estate.", link: "" },
				{ title: "Mountain Biking", image: "", description: "Ride the estate's scenic mountain-bike trails.", link: "" },
				{ title: "Padel", image: "", description: "Book a court for a social game of padel.", link: "" },
			],
		},
		areaActivities: [
			{ title: "Wild about Whiskey", image: "", description: "Sample South Africa's largest selection of whiskies in the heart of Dullstroom.", link: "" },
			{ title: "Fly Fishing", image: "", description: "Dullstroom is the fly-fishing capital of South Africa — day permits are available at the village dams.", link: "" },
			{ title: "Dullstroom Village", image: "", description: "Browse the village's country shops, pancake houses, and coffee roasteries.", link: "" },
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
	};
});
