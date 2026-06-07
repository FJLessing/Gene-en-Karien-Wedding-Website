import type { SiteContent } from "#shared/types/types";

// Serves all site copy/content (Story 2). Returns a fully-shaped but EMPTY
// content object during the boilerplate stage — components render from this data
// so nothing is hardcoded in the UI. Replace the empty values with a real source
// (config file, SQLite, or CMS) once the design/content is approved.
export default defineEventHandler((): SiteContent => {
	return {
		couple: {
			nameOne: "",
			nameTwo: "",
			invitationLine: "",
		},
		event: {
			dateLabel: "",
			startsAt: "", // ISO datetime drives the countdown
			venueName: "",
			venueLocation: "",
			rsvpByLabel: "",
		},
		welcome: "",
		details: {
			dateLabel: "",
			locationLabel: "",
			rsvpByLabel: "",
		},
		program: [],
		dressCode: "",
		venue: {
			about: "",
			mapUrl: "",
			contact: "",
			accommodation: { heading: "", body: "", bookingUrl: "" },
			activities: [],
		},
		areaActivities: [],
		faqs: [],
		rsvp: {
			mealOptions: [],
			dietaryOptions: [],
		},
		footer: { tagline: "" },
	};
});
