import type { SiteContent } from "#shared/types/types";

export default defineEventHandler((): SiteContent => {
	return {
		couple: {
			nameOne: "Gene",
			nameTwo: "Karien",
			invitationLine: "Together with their families, they joyfully invite you to celebrate their wedding",
		},
		event: {
			dateLabel: "14 February 2026",
			startsAt: "2026-02-14T14:00:00+02:00",
			venueName: "Babylonstoren",
			venueLocation: "Simondium, Franschhoek Valley",
			rsvpByLabel: "15 January 2026",
		},
		welcome: "We are so grateful you can join us for this special day. Your presence means the world to us as we begin this new chapter together surrounded by the people we love most.",
		details: {
			dateLabel: "14 February 2026",
			locationLabel: "Babylonstoren, Simondium",
			rsvpByLabel: "RSVP by 15 January 2026",
		},
		program: [
			{
				label: "Friday 13 Feb",
				items: [
					{ time: "15:00", icon: "arrival", description: "Arrival and check-in at Babylonstoren" },
					{ time: "17:00", icon: "drinks", description: "Welcome drinks in the garden" },
					{ time: "19:00", icon: "dinner", description: "Dinner together under the stars" },
				],
			},
			{
				label: "Saturday 14 Feb",
				items: [
					{ time: "14:00", icon: "ceremony", description: "Wedding ceremony" },
					{ time: "16:00", icon: "cocktails", description: "Cocktails and canapés" },
					{ time: "19:00", icon: "dinner", description: "Reception dinner" },
					{ time: "21:00", icon: "dancing", description: "Dancing and celebrating" },
				],
			},
			{
				label: "Sunday 15 Feb",
				items: [
					{ time: "10:00", icon: "brunch", description: "Farewell brunch" },
				],
			},
		],
		dressCode: "Black tie optional. Think elegant and romantic — the ladies are encouraged to wear soft florals or metallics.",
		venue: {
			about: "Babylonstoren is one of the oldest Cape Dutch farms in the Franschhoek Valley, surrounded by dramatic mountain scenery, lush gardens, and world-class vineyards. It is the perfect setting for a celebration of love.",
			mapUrl: "",
			contact: "+27 21 863 3852",
			accommodation: {
				heading: "Staying at Babylonstoren",
				body: "A limited number of rooms are available on-site at Babylonstoren. We recommend booking early as rooms fill quickly. Additional accommodation is available in the surrounding Franschhoek Valley.",
				bookingUrl: "",
			},
			activities: [
				{ title: "Garden Tour", image: "", description: "Explore the iconic biodynamic garden with a guided tour.", link: "" },
				{ title: "Wine Tasting", image: "", description: "Sample award-winning wines from the Babylonstoren cellar.", link: "" },
				{ title: "Spa at Babel", image: "", description: "Relax and rejuvenate at the on-site spa.", link: "" },
			],
		},
		areaActivities: [
			{ title: "Franschhoek Wine Tram", image: "", description: "Hop-on hop-off wine tram through the beautiful Franschhoek Valley.", link: "" },
			{ title: "Huguenot Memorial Museum", image: "", description: "Discover the rich Huguenot heritage of the Franschhoek region.", link: "" },
			{ title: "Hiking in the Valley", image: "", description: "Scenic trails through vineyards and mountain fynbos.", link: "" },
		],
		faqs: [
			{
				question: "Is there parking available at the venue?",
				answer: "Yes, ample complimentary parking is available at Babylonstoren. We also encourage carpooling and will share shuttle information closer to the date.",
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
				answer: "Please be seated by 13:45 on Saturday 14 February. The ceremony will begin promptly at 14:00.",
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
		footer: { tagline: "Gene & Karien · 14 February 2026" },
	};
});
