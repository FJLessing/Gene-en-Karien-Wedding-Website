import type { RsvpSubmission, RsvpEntry, Guest } from "#shared/types/types";

function normalizePhone(phone: string): string {
	if (!phone.trim()) return "";
	const hasPlus = phone.trimStart().startsWith("+");
	const digits = phone.replace(/\D/g, "");
	return hasPlus ? `+${digits}` : digits;
}

function mapEntryToRow(e: RsvpEntry, timestamp: string): string[] {
	return [
		e.guestId ?? "",
		e.name,
		e.email,
		normalizePhone(e.phone),
		e.mealPreference,
		e.dietaryRequirement,
		e.arrivalDay ?? "",
		e.songRequest,
		e.attendance,
		timestamp,
	];
}

export async function appendRsvpRows(submission: RsvpSubmission): Promise<number> {
	const config = useRuntimeConfig();

	if (!config.googleSheetId || !config.googleServiceAccountEmail || !config.googlePrivateKey) {
		console.warn("[sheets] Google Sheets not configured; skipping append.");
		return 0;
	}

	const { google } = await import("googleapis");
	const auth = new google.auth.JWT({
		email: config.googleServiceAccountEmail,
		key: config.googlePrivateKey.replace(/\\n/g, "\n"),
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
	const sheets = google.sheets({ version: "v4", auth });
	const timestamp = new Date().toISOString();
	const values = submission.entries.map((e) => mapEntryToRow(e, timestamp));
	await sheets.spreadsheets.values.append({
		spreadsheetId: config.googleSheetId,
		range: "RSVPs!A1",
		valueInputOption: "USER_ENTERED",
		requestBody: { values },
	});

	return submission.entries.length;
}

function isTrue(cell: unknown): boolean {
	return String(cell ?? "").trim().toUpperCase() === "TRUE";
}

// Guests sheet: A=id, B=name, C=Plus One, D=RSVP. Row 1 is a header, so we read
// from row 2. Guests who have already RSVP'd (column D set) are excluded so they
// drop out of the search.
export async function fetchGuestList(): Promise<Guest[]> {
	const config = useRuntimeConfig();

	if (!config.googleSheetId || !config.googleServiceAccountEmail || !config.googlePrivateKey) {
		console.warn("[sheets] Google Sheets not configured; returning empty guest list.");
		return [];
	}

	const { google } = await import("googleapis");
	const auth = new google.auth.JWT({
		email: config.googleServiceAccountEmail,
		key: config.googlePrivateKey.replace(/\\n/g, "\n"),
		scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
	});
	const sheets = google.sheets({ version: "v4", auth });
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: config.googleSheetId,
		range: "Guests!A2:D",
	});
	const rows = response.data.values ?? [];
	return rows
		.filter((row) => row[0] && row[1] && !isTrue(row[3]))
		.map((row) => ({ id: String(row[0]), name: String(row[1]), canBringPlusOne: isTrue(row[2]) }));
}

// Mark guests as having RSVP'd by writing "TRUE" into the Guests-sheet RSVP column
// (D), so they're removed from the search. Resilient: returns 0 when not configured
// or when no requested id matches a sheet row. Custom plus-ones (no guestId) never
// reach here, so they're naturally skipped.
export async function markGuestsRsvped(guestIds: string[]): Promise<number> {
	const config = useRuntimeConfig();

	if (!config.googleSheetId || !config.googleServiceAccountEmail || !config.googlePrivateKey) {
		console.warn("[sheets] Google Sheets not configured; skipping RSVP write-back.");
		return 0;
	}
	if (guestIds.length === 0) return 0;

	const { google } = await import("googleapis");
	const auth = new google.auth.JWT({
		email: config.googleServiceAccountEmail,
		key: config.googlePrivateKey.replace(/\\n/g, "\n"),
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
	const sheets = google.sheets({ version: "v4", auth });

	// Read the id column (from row 2) to resolve each id to its sheet row number.
	const idColumn = await sheets.spreadsheets.values.get({
		spreadsheetId: config.googleSheetId,
		range: "Guests!A2:A",
	});
	const ids = (idColumn.data.values ?? []).map((row) => String(row[0] ?? ""));
	const wanted = new Set(guestIds.map(String));

	const data = ids
		.map((id, index) => ({ id, row: index + 2 })) // +2: header row + 0-based index
		.filter(({ id }) => wanted.has(id))
		.map(({ row }) => ({ range: `Guests!D${row}`, values: [["TRUE"]] }));

	if (data.length === 0) return 0;

	await sheets.spreadsheets.values.batchUpdate({
		spreadsheetId: config.googleSheetId,
		requestBody: { valueInputOption: "USER_ENTERED", data },
	});

	return data.length;
}
