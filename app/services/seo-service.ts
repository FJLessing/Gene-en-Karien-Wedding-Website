import type { MaybeRefOrGetter } from "vue";

// Thin SEO helper (fj-vue SEOService convention) built on Nuxt's useSeoMeta.
// Accepts plain values or reactive getters so localised titles update live when
// the language changes, e.g. SEOService.set({ title: () => content.value?.ui... }).
export interface SEOAttributes {
	title?: MaybeRefOrGetter<string | undefined>;
	description?: MaybeRefOrGetter<string | undefined>;
	image?: MaybeRefOrGetter<string | undefined>;
}

export class SEOService {
	static fallbackTitle: string = "Gene & Karien";

	static set(attrs: SEOAttributes): void {
		const resolveTitle = (): string => {
			const title = toValue(attrs.title);
			return title ? `${title} | ${SEOService.fallbackTitle}` : SEOService.fallbackTitle;
		};

		useSeoMeta({
			title: resolveTitle,
			ogTitle: resolveTitle,
			description: () => toValue(attrs.description),
			ogDescription: () => toValue(attrs.description),
			ogImage: () => toValue(attrs.image),
		});
	}
}
