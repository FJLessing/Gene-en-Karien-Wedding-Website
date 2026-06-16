import { defineStore, acceptHMRUpdate } from "pinia";
import { ApiService } from "~/services/api-service";
import { Locale } from "#shared/types/types";
import type { SiteContent } from "#shared/types/types";

interface ContentState {
	content: SiteContent | null;
	locale: Locale | null;
	isLoading: boolean;
	error: string | null;
}

// Holds all site content (Story 2). Hydrated from /api/content for the active
// locale and read by every section component via the `use-content` composable.
export const useContentStore = defineStore("content", {
	state: (): ContentState => ({
		content: null,
		locale: null,
		isLoading: false,
		error: null,
	}),
	getters: {
		isLoaded(): boolean {
			return this.content !== null;
		},
	},
	actions: {
		async fetchContent(locale: Locale) {
			// Skip if already hydrated for this locale (e.g. from SSR payload);
			// refetch when the requested locale differs.
			if (this.content && this.locale === locale) return;

			this.isLoading = true;
			this.error = null;
			try {
				const result = await ApiService._request<SiteContent>("/api/content", "GET", { locale });
				if (result.success && result.data) {
					this.content = result.data;
					this.locale = locale;
				} else {
					this.error = result.msg || "Failed to load content";
				}
			} catch (err) {
				this.error = (err as Error).message;
			} finally {
				this.isLoading = false;
			}
		},
	},
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useContentStore, import.meta.hot));
}
