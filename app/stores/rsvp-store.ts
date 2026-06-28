import { defineStore, acceptHMRUpdate } from "pinia";
import Fuse from "fuse.js";
import { ApiService } from "~/services/api-service";
import { useContentStore } from "~/stores/content-store";
import { AttendanceChoice, RsvpStep } from "#shared/types/types";
import type { Guest, RsvpEntry, RsvpSubmission } from "#shared/types/types";

interface RsvpState {
	step: RsvpStep;
	guests: Guest[];
	query: string;
	searchResults: Guest[];
	partnerResults: Guest[];
	selectedGuest: Guest | null;
	attendance: AttendanceChoice | null;
	entries: RsvpEntry[];
	isLoading: boolean; // guest-list load
	isSearching: boolean;
	isSubmitting: boolean;
	error: string | null;
}

// Minimum characters before the fuzzy search runs (Story 3). 2 so initials like
// "FJ" match; 1 would match nearly every guest. Exported so the search component
// gates its "not found" message on the same value.
export const SEARCH_MIN_CHARS = 2;

export const useRsvpStore = defineStore("rsvp", {
	state: (): RsvpState => ({
		step: RsvpStep.Search,
		guests: [],
		query: "",
		searchResults: [],
		partnerResults: [],
		selectedGuest: null,
		attendance: null,
		entries: [],
		isLoading: false,
		isSearching: false,
		isSubmitting: false,
		error: null,
	}),
	getters: {
		hasResults(): boolean {
			return this.searchResults.length > 0;
		},
		hasPartnerResults(): boolean {
			return this.partnerResults.length > 0;
		},
		isAttending(): boolean {
			return this.attendance === AttendanceChoice.Attending;
		},
	},
	actions: {
		// Lazily load the invited-guest list used for fuzzy search.
		async loadGuests() {
			if (this.guests.length > 0) return;

			this.isLoading = true;
			this.error = null;
			try {
				const result = await ApiService._request<{ guests: Guest[] }>("/api/guests", "GET");
				if (result.success && result.data?.guests) {
					this.guests = result.data.guests;
				} else {
					this.error = result.msg || useContentStore().content?.ui.errors.guests || "Failed to load guest list";
				}
			} catch (err) {
				this.error = (err as Error).message;
			} finally {
				this.isLoading = false;
			}
		},

		// Client-side fuzzy search via fuse.js (Story 3).
		search(query: string) {
			this.query = query;
			if (query.trim().length < SEARCH_MIN_CHARS) {
				this.searchResults = [];
				return;
			}

			this.isSearching = true;
			const fuse = new Fuse(this.guests, { keys: ["name"], threshold: 0.4, ignoreLocation: true });
			this.searchResults = fuse.search(query).map((r) => r.item);
			this.isSearching = false;
		},

		// Search for an additional invited guest (a partner) when the primary guest
		// is not allowed a custom plus-one. Excludes the primary guest and anyone
		// already added to the submission.
		searchPartners(query: string) {
			if (query.trim().length < SEARCH_MIN_CHARS) {
				this.partnerResults = [];
				return;
			}

			const excluded = new Set<string>([
				...(this.selectedGuest ? [this.selectedGuest.id] : []),
				...this.entries.map((e) => e.guestId).filter((id): id is string => Boolean(id)),
			]);
			const pool = this.guests.filter((g) => !excluded.has(g.id));
			const fuse = new Fuse(pool, { keys: ["name"], threshold: 0.4, ignoreLocation: true });
			this.partnerResults = fuse.search(query).map((r) => r.item);
		},

		selectGuest(guest: Guest) {
			this.selectedGuest = guest;
			this.step = RsvpStep.Attendance;
		},

		setAttendance(choice: AttendanceChoice) {
			this.attendance = choice;

			if (choice === AttendanceChoice.Attending) {
				this.step = RsvpStep.Details;
				return;
			}

			// Declined: there are no further details to collect, so record a single
			// declined entry for the primary guest (so they're logged and removed from
			// the search) and show the confirmation. The write-back is best-effort.
			this.step = RsvpStep.Confirm;
			if (this.selectedGuest) {
				this.entries = [
					{
						guestId: this.selectedGuest.id,
						name: this.selectedGuest.name,
						email: "",
						phone: "",
						starterPreference: "",
						mealPreference: "",
						dietaryRequirement: "",
						dietaryOther: "",
						arrivalDay: "",
						songRequest: "",
						attendance: AttendanceChoice.Declined,
					},
				];
				void this.submit();
			}
		},

		addEntry(entry: RsvpEntry) {
			this.entries.push(entry);
		},

		removeEntry(index: number) {
			this.entries.splice(index, 1);
		},

		reset() {
			this.step = RsvpStep.Search;
			this.query = "";
			this.searchResults = [];
			this.partnerResults = [];
			// Drop the cached guest list so a fresh visit re-fetches it (excluding
			// anyone who just RSVP'd). loadGuests() short-circuits while it's populated.
			this.guests = [];
			this.selectedGuest = null;
			this.attendance = null;
			this.entries = [];
			this.error = null;
		},

		// Submit the full RSVP → /api/rsvp → Google Sheets (Story 3).
		async submit() {
			this.isSubmitting = true;
			this.error = null;
			try {
				const payload: RsvpSubmission = { entries: this.entries };
				const result = await ApiService._request<{ appended: number }>("/api/rsvp", "POST", undefined, payload);
				if (result.success) {
					this.step = RsvpStep.Confirm;
					return true;
				}
				this.error = result.msg || useContentStore().content?.ui.errors.rsvpSubmit || "Failed to submit RSVP";
				return false;
			} catch (err) {
				this.error = (err as Error).message;
				return false;
			} finally {
				this.isSubmitting = false;
			}
		},
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRsvpStore, import.meta.hot));
}
