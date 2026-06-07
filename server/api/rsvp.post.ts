import { appendRsvpRows } from "../utils/sheets";
import type { RsvpSubmission } from "#shared/types/types";

// Receives an RSVP submission and appends it to Google Sheets (Story 3, stubbed).
export default defineEventHandler(async (event) => {
	const body = await readBody<RsvpSubmission>(event);

	if (!body?.entries || body.entries.length === 0) {
		throw createError({ statusCode: 400, statusMessage: "No RSVP entries provided" });
	}

	const appended = await appendRsvpRows(body);
	return { appended };
});
