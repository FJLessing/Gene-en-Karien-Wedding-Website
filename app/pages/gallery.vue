<script lang="ts" setup>
// Photo gallery page (Story 4). Unlocks on the wedding weekend; until then it
// shows a "coming soon" state. The gallery source and unlock date come from
// runtime config so nothing is hardcoded.
import PhotoUpload from "~/components/app/PhotoUpload.vue";
import { SEOService } from "~/services/seo-service";

definePageMeta({ layout: "minimal" });

const { content } = useContent();
const config = useRuntimeConfig();
const unlockDate = config.public.galleryUnlockDate;

const isUnlocked = computed(() => {
	if (!unlockDate) return false;
	return Date.now() >= new Date(unlockDate).getTime();
});

SEOService.set({ title: () => content.value?.ui.gallery.metaTitle });
</script>

<template>
	<div class="gallery-page">
		<h1 class="gallery-page__title u-heading">{{ content?.ui.gallery.heading }}</h1>

		<template v-if="isUnlocked">
			<PhotoUpload />
			<!-- Moderated gallery grid renders here once the Drive/GCS source is wired. -->
			<div class="gallery-page__grid" />
		</template>

		<p v-else class="gallery-page__locked">
			{{ content?.ui.gallery.lockedMessage }}
		</p>
	</div>
</template>

<style scoped lang="scss">
.gallery-page {
	display: flex;
	flex-direction: column;
	gap: $space-lg;
	text-align: center;

	&__title {
		font-size: $font-size-xl;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $space-2xs;
	}

	&__locked {
		font-size: $font-size-base;
		color: $color-text-muted;
	}
}
</style>
