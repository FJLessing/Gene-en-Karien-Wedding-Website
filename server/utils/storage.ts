export interface UploadedPhoto {
	name: string;
	url: string;
}

export async function uploadPhotos(files: { name: string; data: Buffer; type: string }[]): Promise<UploadedPhoto[]> {
	const config = useRuntimeConfig();

	if (!config.gcsBucket || !config.gcsProjectId) {
		console.warn("[storage] GCS not configured; skipping upload.");
		return [];
	}

	const { Storage } = await import("@google-cloud/storage");

	// Build explicit credentials from env so the client doesn't fall back to ADC
	// (which won't work outside GCP). The private key in .env uses literal \n
	// escapes; convert them to real newlines.
	const credentials =
		config.googleServiceAccountEmail && config.googlePrivateKey
			? {
					client_email: config.googleServiceAccountEmail,
					private_key: config.googlePrivateKey.replace(/\\n/g, "\n"),
			  }
			: undefined;

	const storage = new Storage({ projectId: config.gcsProjectId, credentials });
	const bucket = storage.bucket(config.gcsBucket);
	const results: UploadedPhoto[] = [];
	for (const file of files) {
		const blob = bucket.file(`uploads/${Date.now()}-${file.name}`);
		await blob.save(file.data, { contentType: file.type });
		results.push({ name: file.name, url: blob.publicUrl() });
	}
	return results;
}
