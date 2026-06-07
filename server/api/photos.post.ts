import { uploadPhotos } from "../utils/storage";

// Receives photo uploads and pushes them to GCP Cloud Storage (Story 3/4, stubbed).
// Expects multipart/form-data. Parsing is wired up but the storage call is a no-op
// until GCS credentials are configured.
export default defineEventHandler(async (event) => {
	const form = await readMultipartFormData(event);

	if (!form || form.length === 0) {
		throw createError({ statusCode: 400, statusMessage: "No files provided" });
	}

	const files = form
		.filter((part) => part.filename && part.data)
		.map((part) => ({
			name: part.filename as string,
			data: part.data,
			type: part.type ?? "application/octet-stream",
		}));

	const uploaded = await uploadPhotos(files);
	return { uploaded };
});
