import type { SiteContent } from "#shared/types/types";
import { Locale } from "#shared/types/types";
import en from "../content/en";
import af from "../content/af";

// Locale-keyed site content. Each locale file is the single source of truth for
// that language's copy and UI strings (AGENTS.md: never hardcode in components).
const byLocale: Record<Locale, SiteContent> = {
	[Locale.En]: en,
	[Locale.Af]: af,
};

// Returns the full SiteContent for `?locale=` (defaults to English on anything
// unrecognised).
export default defineEventHandler((event): SiteContent => {
	const { locale } = getQuery(event);
	const key = locale === Locale.Af ? Locale.Af : Locale.En;
	return byLocale[key];
});
