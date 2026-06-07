import { fetchGuestList } from "../utils/sheets";
import type { Guest } from "#shared/types/types";

// Returns the invited-guest list for the RSVP fuzzy search (Story 3).
// Sourced from Google Sheets (stubbed) — empty until configured.
export default defineEventHandler(async (): Promise<{ guests: Guest[] }> => {
	const guests = await fetchGuestList();
	return { guests };
});
