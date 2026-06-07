import type { RsvpSubmission } from "#shared/types/types";

// Google Sheets integration (STUB).
// The `googleapis` dependency is imported lazily inside the function so the
// server boots without credentials during the boilerplate stage. Wire the real
// service-account auth + spreadsheets.values.append call here later.
//
// Flow: Guest submits form → Nuxt API route → Google Sheets API → new row appended.
export async function appendRsvpRows(submission: RsvpSubmission): Promise<number> {
	const config = useRuntimeConfig();

	if (!config.googleSheetId || !config.googleServiceAccountEmail || !config.googlePrivateKey) {
		// Not configured yet — no-op so the boilerplate flow still resolves.
		console.warn("[sheets] Google Sheets not configured; skipping append.");
		return 0;
	}

	// TODO: implement with googleapis
	// const { google } = await import("googleapis");
	// const auth = new google.auth.JWT({
	// 	email: config.googleServiceAccountEmail,
	// 	key: config.googlePrivateKey.replace(/\\n/g, "\n"),
	// 	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	// });
	// const sheets = google.sheets({ version: "v4", auth });
	// const values = submission.entries.map((e) => [ ...mapEntryToRow(e) ]);
	// await sheets.spreadsheets.values.append({ spreadsheetId: config.googleSheetId, range: "RSVPs!A1", valueInputOption: "USER_ENTERED", requestBody: { values } });

	return submission.entries.length;
}

// Guest list source for the RSVP fuzzy search (STUB).
// Eventually this reads the invited-guest tab from the same spreadsheet (or a
// SQLite table). Returns an empty list until configured.
export async function fetchGuestList(): Promise<{ id: string; name: string }[]> {
	const config = useRuntimeConfig();

	if (!config.googleSheetId) {
		console.warn("[sheets] Google Sheets not configured; returning empty guest list.");
		return [];
	}

	// TODO: read the "Guests" tab and map rows → { id, name }.
	return [];
}
