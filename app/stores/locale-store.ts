import { defineStore, acceptHMRUpdate } from "pinia";
import { Locale } from "#shared/types/types";

const COOKIE_NAME = "locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function isLocale(value: unknown): value is Locale {
	return value === Locale.En || value === Locale.Af;
}

// Current UI language. Afrikaans is the site default for every first-time
// visitor regardless of browser language; a saved cookie (set by the footer
// toggle) overrides it. Read by `use-content` (drives the content fetch).
export const useLocaleStore = defineStore("locale", {
	state: (): { locale: Locale } => ({
		locale: Locale.Af,
	}),
	actions: {
		// SSR-safe resolution. Runs from the locale plugin on both server and client.
		init() {
			const cookie = useCookie<Locale>(COOKIE_NAME, { sameSite: "lax", maxAge: COOKIE_MAX_AGE, path: "/" });

			if (isLocale(cookie.value)) {
				this.locale = cookie.value;
				return;
			}

			// No saved choice → default to Afrikaans (the site's primary language).
			// Browser language is intentionally ignored; visitors switch via the footer.
			this.locale = Locale.Af;
			cookie.value = this.locale;
		},
		setLocale(locale: Locale) {
			this.locale = locale;
			const cookie = useCookie<Locale>(COOKIE_NAME, { sameSite: "lax", maxAge: COOKIE_MAX_AGE, path: "/" });
			cookie.value = locale;
		},
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot));
}
