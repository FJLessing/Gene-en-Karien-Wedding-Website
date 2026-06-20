import { appendRsvpRows, markGuestsRsvped } from "../utils/sheets";
import type { RsvpSubmission } from "#shared/types/types";

// Receives an RSVP submission and appends it to Google Sheets (Story 3, stubbed).
export default defineEventHandler(async (event) => {
	const body = await readBody<RsvpSubmission>(event);

	if (!body?.entries || body.entries.length === 0) {
		throw createError({ statusCode: 400, statusMessage: "No RSVP entries provided" });
	}

	const appended = await appendRsvpRows(body);

	// Mark invited guests (those with a guestId — not custom plus-ones) as RSVP'd so
	// they drop out of the search. The append already succeeded, so a write-back
	// failure must not fail the request.
	const ids = body.entries.map((e) => e.guestId).filter((id): id is string => Boolean(id));
	if (ids.length > 0) {
		try {
			await markGuestsRsvped(ids);
		} catch (err) {
			console.warn("[rsvp] Failed to mark guests as RSVP'd:", err);
		}
	}

	return { appended };
});
