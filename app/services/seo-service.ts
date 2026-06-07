// Thin SEO helper (fj-vue SEOService convention) built on Nuxt's useHead.
// Call from page setup: SEOService.set({ title: "RSVP", description: "..." }).
export interface SEOAttributes {
	title?: string;
	description?: string;
	image?: string;
}

export class SEOService {
	static fallbackTitle: string = "Gene & Karien";

	static set(attrs: SEOAttributes): void {
		const title = attrs.title ? `${attrs.title} | ${SEOService.fallbackTitle}` : SEOService.fallbackTitle;

		useSeoMeta({
			title,
			ogTitle: title,
			description: attrs.description,
			ogDescription: attrs.description,
			ogImage: attrs.image,
		});
	}
}
