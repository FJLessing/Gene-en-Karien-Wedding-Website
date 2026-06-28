// Shared types and enums. Enums are preferred over string literals (fj-vue).

// ── Image carousel ────────────────────────────────────────────────────────────
export interface CarouselImage {
	src: string;
	/** Full-resolution desktop image. Listed in srcset at 2× the mobile width so the browser favours it on larger viewports. */
	srcDesktop?: string;
	alt: string;
	width?: number;
	height?: number;
}

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

// ── Activity cards (Story 2) ─────────────────────────────────────────────────
// Layout variants for the shared ActivityCard tile.
//   Grid   → portrait tile in a 2-up grid (venue activities)
//   Banner → full-width landscape banner (area activities)
export enum ActivityCardVariant {
	Grid = "grid",
	Banner = "banner",
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
// `canBringPlusOne` mirrors the Guests-sheet "Plus One" column: true → may add a
// custom (free-text) plus-one; false → must search the invited list for a partner.
export interface Guest {
	id: string;
	name: string;
	canBringPlusOne: boolean;
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
	dietaryOther: string;
	arrivalDay: ArrivalDay | string;
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

// A titled group of area activities (e.g. "Restaurants & Bars"). Each group renders
// as its own collapsible accordion in AreaActivitiesSection.
export interface ActivityCategory {
	heading: string;
	items: ActivityItem[];
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
		subHeading: string;
		bookAccommodation: string;
		activitiesTitle: string;
		activitiesSubTitle: string;
		downloadMap: string;
		bookNow: string;
		copyReference: string;
		copied: string;
	};
	areaActivities: { learnMore: string };
	faqs: { heading: string };
	gate: { passwordLabel: string; passwordPlaceholder: string; open: string; wrongPassword: string; hint: string };
	loader: { loading: string };
	gallery: { metaTitle: string; heading: string; lockedMessage: string };
	photoUpload: { heading: string; metaTitle: string; choose: string; selectedSuffix: string; upload: string; success: string; failed: string };
	rsvp: {
		metaTitle: string;
		rsvpingFor: string;
		searchPlaceholder: string;
		notFound: string;
		attendingHeading: string;
		yes: string;
		no: string;
		arrivalOptions: SelectOption[];
		placeholders: { guestName: string; email: string; phone: string; meal: string; dietary: string; dietaryOther: string; arrival: string; song: string };
		countryCodes: SelectOption[];
		addedSuffix: string;
		saveGuest: string;
		addGuest: string;
		addPlusOne: string;
		partnerPlaceholder: string;
		removeGuest: string;
		submit: string;
		thankYou: string;
		attendingMsg: string[];
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
		dates: string;
		year: string;
		startsAt: string; // ISO — drives the countdown
		venueName: string;
		venueLocation: string;
		rsvpBy: string;
	};
	welcome: string[];
	details: { dates: string; year: string; location: string[]; rsvpBy: string };
	program: ProgramDay[];
	dressCode: string;
	venue: {
		about: string;
		note: string;

		contact: string;
		accommodation: {
			heading: string;
			body: string[];
			booking: {
				email: string; // stable — not translated
				cc: string; // stable — not translated
				reference: string; // stable — "242178.59"
				subject: string; // translatable
				draft: string; // translatable email body (use \n for line breaks)
				cta: string; // translatable button label
			};
		};
		activities: ActivityItem[];
	};
	areaActivities: ActivityCategory[];
	faqs: FaqItem[];
	rsvp: {
		mealOptions: SelectOption[];
		dietaryOptions: SelectOption[];
	};
	footer: { tagline: string };
	ui: SiteUi;
}
