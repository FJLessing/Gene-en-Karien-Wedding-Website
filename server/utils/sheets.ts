import type { RsvpSubmission, RsvpEntry } from "#shared/types/types";

function mapEntryToRow(e: RsvpEntry, timestamp: string): string[] {
	return [
		e.guestId ?? "",
		e.name,
		e.email,
		e.phone,
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

export async function fetchGuestList(): Promise<{ id: string; name: string }[]> {
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
		range: "Guests!A:B",
	});
	const rows = response.data.values ?? [];
	return rows
		.filter((row) => row[0] && row[1])
		.map((row) => ({ id: String(row[0]), name: String(row[1]) }));
}
