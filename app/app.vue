<script lang="ts" setup>
// Root component. Renders the active layout + page and a pulsing-logo loader
// that shows during route changes (Story 2).
import AppLoader from "~/components/app/layout/AppLoader.vue";
import { SEOService } from "~/services/seo-service";
import { Locale } from "#shared/types/types";

const isPageLoading = ref(false);
const nuxtApp = useNuxtApp();
const localeStore = useLocaleStore();

// Global default OG image — locale-aware. Page-level SEOService.set() calls
// override this for pages that supply their own image.
SEOService.set({
	image: () => localeStore.locale === Locale.Af ? "/img/sharing_af.webp" : "/img/sharing_en.webp",
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
