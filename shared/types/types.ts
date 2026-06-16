// Shared types and enums. Enums are preferred over string literals (fj-vue).

// ── Access / auth gate (Story 1) ─────────────────────────────────────────────
export enum AccessState {
	Locked = "locked",
	Unlocked = "unlocked",
}

// ── RSVP (Story 3) ───────────────────────────────────────────────────────────
export enum RsvpStep {
	Search = "search",
	Attendance = "attendance",
	Details = "details",
	Confirm = "confirm",
}

export enum AttendanceChoice {
	Attending = "attending",
	Declined = "declined",
}

export enum ArrivalDay {
	Friday = "friday",
	Saturday = "saturday",
}

// A guest as returned by the guest-list endpoint (used for fuzzy search).
export interface Guest {
	id: string;
	name: string;
}

// Option for a <SelectField> (meal preference, dietary requirement, etc.).
export interface SelectOption {
	label: string;
	value: string;
}

// One person's RSVP answers (the primary guest or an added partner).
export interface RsvpEntry {
	guestId: string | null;
	name: string;
	email: string;
	phone: string;
	mealPreference: string;
	dietaryRequirement: string;
	arrivalDay: ArrivalDay | null;
	songRequest: string;
	attendance: AttendanceChoice;
}

// Full RSVP payload submitted to the server (primary + any added guests).
export interface RsvpSubmission {
	entries: RsvpEntry[];
}

// ── Site content (Story 2) — shape only; values come from /api/content ───────
export interface ProgramItem {
	time: string;
	icon: string;
	description: string;
}

export interface ProgramDay {
	label: string;
	items: ProgramItem[];
}

export interface ActivityItem {
	title: string;
	image: string;
	description: string;
	link: string;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface SiteContent {
	couple: {
		nameOne: string;
		nameTwo: string;
		invitationLine1: string;
		invitationLine2: string;
	};
	event: {
		dateLabel: string;
		startsAt: string; // ISO — drives the countdown
		venueName: string;
		venueLocation: string;
		rsvpByLabel: string;
	};
	welcome: string[];
	details: { dateLabel: string; locationLabel: string; rsvpByLabel: string };
	program: ProgramDay[];
	dressCode: string;
	venue: {
		about: string;
		mapUrl: string;
		contact: string;
		accommodation: { heading: string; body: string; bookingUrl: string };
		activities: ActivityItem[];
	};
	areaActivities: ActivityItem[];
	faqs: FaqItem[];
	rsvp: {
		mealOptions: SelectOption[];
		dietaryOptions: SelectOption[];
	};
	footer: { tagline: string };
}
