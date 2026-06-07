<script lang="ts" setup>
// Root component. Renders the active layout + page and a pulsing-logo loader
// that shows during route changes (Story 2).
import AppLoader from "~/components/app/layout/AppLoader.vue";

const isPageLoading = ref(false);
const nuxtApp = useNuxtApp();

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
