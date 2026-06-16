// Shared types and enums. Enums are preferred over string literals (fj-vue).

// ── Access / auth gate (Story 1) ─────────────────────────────────────────────
export enum AccessState {
	Locked = "locked",
	Unlocked = "unlocked",
}

// ── Localisation ─────────────────────────────────────────────────────────────
// Supported site languages. Drives the content API (`/api/content?locale=`) and
// the footer language toggle. English is the default / fallback.
export enum Locale {
	En = "en",
	Af = "af",
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

// UI chrome strings (headings, buttons, labels, placeholders, messages). Kept in
// the locale-aware content object so they translate alongside the copy — no
// hardcoded strings in components (AGENTS.md rule).
export interface SiteUi {
	nav: { rsvpHere: string; back: string; backHome: string; scroll: string };
	countdown: { ariaLabel: string; days: string; hours: string; minutes: string; seconds: string };
	details: { heading: string; when: string; where: string; rsvpBy: string };
	program: { heading: string };
	dressCode: { heading: string };
	venue: {
		heading: string;
		bookAccommodation: string;
		activitiesTitle: string;
		downloadMap: string;
		bookNow: string;
	};
	areaActivities: { heading: string; learnMore: string };
	faqs: { heading: string };
	gate: { passwordLabel: string; passwordPlaceholder: string; open: string; wrongPassword: string };
	loader: { loading: string };
	gallery: { metaTitle: string; heading: string; lockedMessage: string };
	photoUpload: { choose: string; selectedSuffix: string; upload: string; success: string; failed: string };
	rsvp: {
		metaTitle: string;
		rsvpingFor: string;
		searchPlaceholder: string;
		notFound: string;
		attendingHeading: string;
		yes: string;
		no: string;
		arrivalOptions: SelectOption[];
		placeholders: { guestName: string; email: string; phone: string; meal: string; dietary: string; arrival: string };
		addedSuffix: string;
		saveGuest: string;
		addGuest: string;
		submit: string;
		thankYou: string;
		attendingMsg: string;
		declinedMsg: string;
	};
	meta: { homeDescription: string };
	errors: { content: string; guests: string; rsvpSubmit: string; request: string };
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
	ui: SiteUi;
}
