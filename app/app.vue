<script lang="ts" setup>
// Root component. Renders the active layout + page and a pulsing-logo loader
// that shows during route changes (Story 2).
import AppLoader from "~/components/app/layout/AppLoader.vue";
import { SEOService } from "~/services/seo-service";
import { Locale } from "#shared/types/types";

const isPageLoading = ref(false);
const nuxtApp = useNuxtApp();
const localeStore = useLocaleStore();
const { content } = useContent();

// Global share defaults — every route gets a description and a locale-aware OG
// image (JPEG: WhatsApp previews don't reliably render WebP). Page-level
// SEOService.set() calls override these where they supply their own.
SEOService.set({
	description: () => content.value?.ui.meta.homeDescription,
	image: () => localeStore.locale === Locale.Af ? "/img/sharing_af.jpg" : "/img/sharing_en.jpg",
});

nuxtApp.hook("page:loading:start", () => {
	isPageLoading.value = true;
});
nuxtApp.hook("page:loading:end", () => {
	isPageLoading.value = false;
});
</script>

<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
		<AppLoader :visible="isPageLoading" />
	</div>
</template>
