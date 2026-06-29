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
		const requestUrl = useRequestURL();

		const resolveTitle = (): string => {
			const title = toValue(attrs.title);
			return title ? `${title} | ${SEOService.fallbackTitle}` : SEOService.fallbackTitle;
		};

		// OG image URLs must be absolute — resolve relative paths against the request origin.
		const resolveAbsoluteImage = (): string | undefined => {
			const img = toValue(attrs.image);
			if (!img) return undefined;
			return img.startsWith("http") ? img : new URL(img, requestUrl.origin).href;
		};

		useSeoMeta({
			title: resolveTitle,
			ogTitle: resolveTitle,
			ogSiteName: SEOService.fallbackTitle,
			ogType: "website",
			ogUrl: () => requestUrl.href,
			description: () => toValue(attrs.description),
			ogDescription: () => toValue(attrs.description),
			ogImage: resolveAbsoluteImage,
			ogImageWidth: () => toValue(attrs.image) ? "1200" : undefined,
			ogImageHeight: () => toValue(attrs.image) ? "630" : undefined,
			ogImageAlt: resolveTitle,
			twitterCard: "summary_large_image",
			twitterTitle: resolveTitle,
			twitterDescription: () => toValue(attrs.description),
			twitterImage: resolveAbsoluteImage,
		});
	}
}
