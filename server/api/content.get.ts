import type { SiteContent } from "#shared/types/types";

export default defineEventHandler((): SiteContent => {
	return {
		couple: {
			nameOne: "Gene",
			nameTwo: "Karien",
			invitationLine: "Together with their families, they joyfully invite you to celebrate their wedding",
		},
		event: {
			dateLabel: "10 October 2026",
			startsAt: "2026-10-10T14:00:00+02:00",
			venueName: "Dunkeld Equestrian Estate",
			venueLocation: "Dunkeld, Johannesburg",
			rsvpByLabel: "1 August 2026",
		},
		welcome: "We are so grateful you can join us for this special day. Your presence means the world to us as we begin this new chapter together surrounded by the people we love most.",
		details: {
			dateLabel: "10 October 2026",
			locationLabel: "Dunkeld Equestrian Estate, Johannesburg",
			rsvpByLabel: "RSVP by 1 August 2026",
		},
		program: [
			{
				label: "Friday 9 Oct",
				items: [
					{ time: "15:00", icon: "arrival", description: "Arrival and check-in at the estate" },
					{ time: "17:00", icon: "drinks", description: "Welcome drinks in the garden" },
					{ time: "19:00", icon: "dinner", description: "Dinner together under the stars" },
				],
			},
			{
				label: "Saturday 10 Oct",
				items: [
					{ time: "14:00", icon: "ceremony", description: "Wedding ceremony" },
					{ time: "16:00", icon: "cocktails", description: "Cocktails and canapés" },
					{ time: "19:00", icon: "dinner", description: "Reception dinner" },
					{ time: "21:00", icon: "dancing", description: "Dancing and celebrating" },
				],
			},
			{
				label: "Sunday 11 Oct",
				items: [
					{ time: "10:00", icon: "brunch", description: "Farewell brunch" },
				],
			},
		],
		dressCode: "Black tie optional. Think elegant and romantic — the ladies are encouraged to wear soft florals or metallics.",
		venue: {
			about: "Dunkeld Equestrian Estate is a stunning venue set against the backdrop of lush grounds and beautiful equestrian facilities in Johannesburg. It is the perfect setting for an intimate and elegant celebration of love.",
			mapUrl: "",
			contact: "",
			accommodation: {
				heading: "Accommodation near the estate",
				body: "A selection of hotels and guesthouses are available nearby. We will share recommended options and shuttle information closer to the date.",
				bookingUrl: "",
			},
			activities: [
				{ title: "Estate Grounds", image: "", description: "Explore the beautiful gardens and equestrian grounds of the estate.", link: "" },
				{ title: "Horse Riding", image: "", description: "Enjoy a morning ride through the estate's equestrian facilities.", link: "" },
			],
		},
		areaActivities: [
			{ title: "Sandton City", image: "", description: "World-class shopping and dining in the heart of Johannesburg's financial district.", link: "" },
			{ title: "Apartheid Museum", image: "", description: "A powerful and moving tribute to the history and struggle for freedom in South Africa.", link: "" },
			{ title: "Maboneng Precinct", image: "", description: "Vibrant arts and culture district with galleries, markets, and great food.", link: "" },
		],
		faqs: [
			{
				question: "Is there parking available at the venue?",
				answer: "Yes, ample complimentary parking is available at Dunkeld Equestrian Estate. We also encourage carpooling and will share shuttle information closer to the date.",
			},
			{
				question: "Are children welcome?",
				answer: "We love your little ones, but we have chosen to make our wedding an adult-only celebration so everyone can relax and enjoy the evening. We hope you understand and can arrange childcare for the day.",
			},
			{
				question: "What is the dress code exactly?",
				answer: "Black tie optional — suits and cocktail dresses are equally welcome. Ladies, soft florals, pastels, and metallics are encouraged. Please avoid white, ivory, and cream out of respect for the bride.",
			},
			{
				question: "What should I do about gifts?",
				answer: "Your presence is our greatest gift. If you would like to contribute something, we have a small wishing well for cards, or details of our honeymoon fund will be shared at the reception.",
			},
			{
				question: "What time should I arrive for the ceremony?",
				answer: "Please be seated by 13:45 on Saturday 10 October. The ceremony will begin promptly at 14:00.",
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
		footer: { tagline: "Gene & Karien · 10 October 2026" },
	};
});
