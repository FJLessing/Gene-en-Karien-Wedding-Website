import { defineStore, acceptHMRUpdate } from "pinia";
import { ApiService } from "~/services/api-service";
import type { SiteContent } from "#shared/types/types";

interface ContentState {
	content: SiteContent | null;
	isLoading: boolean;
	error: string | null;
}

// Holds all site content (Story 2). Hydrated once from /api/content and read by
// every section component via the `use-content` composable.
export const useContentStore = defineStore("content", {
	state: (): ContentState => ({
		content: null,
		isLoading: false,
		error: null,
	}),
	getters: {
		isLoaded(): boolean {
			return this.content !== null;
		},
	},
	actions: {
		async fetchContent() {
			// Avoid refetching if already hydrated (e.g. from SSR payload).
			if (this.content) return;

			this.isLoading = true;
			this.error = null;
			try {
				const result = await ApiService._request<SiteContent>("/api/content", "GET");
				if (result.success && result.data) {
					this.content = result.data;
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
