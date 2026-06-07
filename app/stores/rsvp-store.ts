import { defineStore, acceptHMRUpdate } from "pinia";
import Fuse from "fuse.js";
import { ApiService } from "~/services/api-service";
import { AttendanceChoice, RsvpStep } from "#shared/types/types";
import type { Guest, RsvpEntry, RsvpSubmission } from "#shared/types/types";

interface RsvpState {
	step: RsvpStep;
	guests: Guest[];
	query: string;
	searchResults: Guest[];
	selectedGuest: Guest | null;
	attendance: AttendanceChoice | null;
	entries: RsvpEntry[];
	isLoading: boolean; // guest-list load
	isSearching: boolean;
	isSubmitting: boolean;
	error: string | null;
}

// Minimum characters before the fuzzy search runs (Story 3).
const SEARCH_MIN_CHARS = 3;

export const useRsvpStore = defineStore("rsvp", {
	state: (): RsvpState => ({
		step: RsvpStep.Search,
		guests: [],
		query: "",
		searchResults: [],
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
					this.error = result.msg || "Failed to load guest list";
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
			const fuse = new Fuse(this.guests, { keys: ["name"], threshold: 0.4 });
			this.searchResults = fuse.search(query).map((r) => r.item);
			this.isSearching = false;
		},

		selectGuest(guest: Guest) {
			this.selectedGuest = guest;
			this.step = RsvpStep.Attendance;
		},

		setAttendance(choice: AttendanceChoice) {
			this.attendance = choice;
			this.step = choice === AttendanceChoice.Attending ? RsvpStep.Details : RsvpStep.Confirm;
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
				this.error = result.msg || "Failed to submit RSVP";
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
