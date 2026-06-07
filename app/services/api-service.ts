import { Result } from "#shared/utils/result";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Client-side HTTP wrapper (fj-vue ApiService convention) adapted for Nuxt.
// Wraps Nuxt's global `$fetch` and always returns a `Result`, so call sites can
// branch on `result.success` without touching try/catch. Internal calls target
// Nuxt server routes under `/api/*`, so no base URL or auth header is needed yet.
export class ApiService {
	// Placeholder for a future bearer token (kept for fj-vue parity).
	static authToken: string = "";

	static setAuthToken(token: string): void {
		ApiService.authToken = token;
	}

	static async _request<T = unknown>(
		endpoint: string,
		method: HttpMethod = "GET",
		params?: Record<string, unknown>,
		body?: unknown,
		isFileUpload: boolean = false,
	): Promise<Result<T>> {
		try {
			const headers: Record<string, string> = {};
			if (!isFileUpload) headers["Content-Type"] = "application/json";
			if (ApiService.authToken) headers.Authorization = `Bearer ${ApiService.authToken}`;

			// $fetch parses JSON automatically and throws on non-2xx responses.
			const data = (await $fetch(endpoint, {
				method,
				params,
				body: body as Record<string, unknown> | FormData | undefined,
				headers,
			})) as T;

			return Result.ok<T>(data);
		} catch (err: unknown) {
			const e = err as { statusCode?: number; data?: { message?: string }; message?: string };
			const statusCode = e?.statusCode ?? 0;
			const msg = e?.data?.message ?? e?.message ?? "Request failed";
			return Result.fail<T>(msg, statusCode);
		}
	}
}
