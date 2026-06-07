// Password gate verification (Story 1). Compares the submitted password against
// the server-only env value. Never exposes the password to the client.
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body = await readBody<{ password?: string }>(event);

	const submitted = (body?.password ?? "").trim();
	const expected = config.sitePassword ?? "";

	// If no password is configured yet (boilerplate stage), treat as not-yet-set
	// and reject so the gate is never accidentally open.
	const valid = expected.length > 0 && submitted === expected;

	return { valid };
});
