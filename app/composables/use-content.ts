import { storeToRefs } from "pinia";
import { useContentStore } from "~/stores/content-store";
import { useLocaleStore } from "~/stores/locale-store";

// Convenience accessor for site content. Ensures content is hydrated (SSR-safe)
// for the active locale and returns reactive refs for use in section components.
export function useContent() {
	const store = useContentStore();
	const localeStore = useLocaleStore();
	const { content, isLoading, error, isLoaded } = storeToRefs(store);

	// Kick off a fetch during setup; awaited on the server so SSR has data.
	// useAsyncData requires a non-undefined return value, so resolve to the
	// hydrated content (or null on failure). Refetches when the locale changes.
	const ready = useAsyncData(
		`site-content-${localeStore.locale}`,
		async () => {
			await store.fetchContent(localeStore.locale);
			return store.content;
		},
		{ watch: [() => localeStore.locale] },
	);

	return {
		content,
		isLoading,
		error,
		isLoaded,
		ready,
	};
}
