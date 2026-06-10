import { storeToRefs } from "pinia";
import { useContentStore } from "~/stores/content-store";

// Convenience accessor for site content. Ensures content is hydrated (SSR-safe)
// and returns reactive refs for use in section components.
export function useContent() {
	const store = useContentStore();
	const { content, isLoading, error, isLoaded } = storeToRefs(store);

	// Kick off a fetch during setup; awaited on the server so SSR has data.
	// useAsyncData requires a non-undefined return value, so resolve to the
	// hydrated content (or null on failure).
	const ready = useAsyncData("site-content", async () => {
		await store.fetchContent();
		return store.content;
	});

	return {
		content,
		isLoading,
		error,
		isLoaded,
		ready,
	};
}
