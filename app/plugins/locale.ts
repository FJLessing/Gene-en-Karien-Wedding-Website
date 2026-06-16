import { useLocaleStore } from "~/stores/locale-store";

// Resolves the active language on app start (server + client) and keeps the
// <html lang> attribute in sync with it.
export default defineNuxtPlugin(() => {
	const localeStore = useLocaleStore();
	localeStore.init();

	useHead({
		htmlAttrs: { lang: computed(() => localeStore.locale) },
	});
});
