import { defineStore, acceptHMRUpdate } from "pinia";
import { Locale } from "#shared/types/types";

const COOKIE_NAME = "locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function isLocale(value: unknown): value is Locale {
	return value === Locale.En || value === Locale.Af;
}

// Current UI language. Resolved once on app start (cookie → Accept-Language /
// navigator.language → English) and persisted in a cookie so the choice survives
// reloads. Read by `use-content` (drives the content fetch) and the footer toggle.
export const useLocaleStore = defineStore("locale", {
	state: (): { locale: Locale } => ({
		locale: Locale.En,
	}),
	actions: {
		// SSR-safe resolution. Runs from the locale plugin on both server and client.
		init() {
			const cookie = useCookie<Locale>(COOKIE_NAME, { sameSite: "lax", maxAge: COOKIE_MAX_AGE, path: "/" });

			if (isLocale(cookie.value)) {
				this.locale = cookie.value;
				return;
			}

			this.locale = detectLocale();
			cookie.value = this.locale;
		},
		setLocale(locale: Locale) {
			this.locale = locale;
			const cookie = useCookie<Locale>(COOKIE_NAME, { sameSite: "lax", maxAge: COOKIE_MAX_AGE, path: "/" });
			cookie.value = locale;
		},
	},
});

// First-visit language detection. Server reads the Accept-Language header; the
// client falls back to navigator languages. Afrikaans is chosen only when it is
// the visitor's MOST-preferred language (top of the navigator list, or highest
// q-value in the header). English is the default for everything else — no/empty
// preferences, other languages, or Afrikaans listed only as a low-priority fallback.
function detectLocale(): Locale {
	let tags: { lang: string; q: number }[] = [];

	if (import.meta.server) {
		const header = useRequestHeaders(["accept-language"])["accept-language"] ?? "";
		tags = header
			.split(",")
			.map((part) => {
				const [tag, ...params] = part.split(";");
				const qParam = params.find((p) => p.trim().startsWith("q="));
				const q = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "") : 1;
				return { lang: (tag ?? "").trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 };
			})
			.filter((t) => t.lang);
	} else if (import.meta.client) {
		// navigator.languages is already in descending preference order.
		tags = [...(navigator.languages ?? [navigator.language])].map((l) => ({ lang: l.trim().toLowerCase(), q: 1 }));
	}

	// Stable sort keeps the original order for equal q-values, so the first
	// listed language wins ties.
	const top = [...tags].sort((a, b) => b.q - a.q)[0]?.lang ?? "";
	return top === "af" || top.startsWith("af-") ? Locale.Af : Locale.En;
}

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot));
}
