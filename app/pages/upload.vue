<script lang="ts" setup>
// Standalone photo upload page. Replicates the last step of the RSVP journey
// so guests can share photos of the couple without going through the RSVP flow.
import PhotoUpload from "~/components/app/PhotoUpload.vue";
import EnvelopeGate from "~/components/app/layout/EnvelopeGate.vue";
import BaseMonogram from "~/components/ui/BaseMonogram.vue";
import { SEOService } from "~/services/seo-service";

// Self-manage the layout so the access gate takes the full viewport, like
// rsvp.vue and the landing page.
definePageMeta({ layout: false });

const { content } = useContent();
const { isUnlocked, unlock } = useAccess();

SEOService.set({ title: () => content.value?.ui.photoUpload.metaTitle });
</script>

<template>
	<EnvelopeGate v-if="!isUnlocked" @unlock="unlock" />

	<NuxtLayout v-else name="minimal">
		<div class="upload-page">
			<BaseMonogram class="page-monogram" />
			<button class="upload-page__back" type="button" @click="navigateTo('/')">
				<span class="upload-page__back-caret" aria-hidden="true" />
				{{ content?.ui.nav.backHome }}
			</button>

			<h1 v-if="content?.ui.photoUpload.heading" class="upload-page__heading u-heading">
				{{ content.ui.photoUpload.heading }}
			</h1>

			<PhotoUpload />
		</div>
	</NuxtLayout>
</template>

<style scoped lang="scss">
.upload-page {
	display: flex;
	flex-direction: column;
	gap: $space-md;

	&__logo {
		width: 6.3125rem; // ~101px monogram, same as rsvp.vue
		height: auto;
		margin-inline: auto;
		opacity: 0.5; // softly embossed look
	}

	&__back {
		display: inline-flex;
		align-items: center;
		gap: $space-2xs;
		align-self: flex-start;
		padding: $space-2xs 0;
		font-size: $font-size-base;
		color: $color-text-muted;
	}

	&__back-caret {
		width: 0.625rem;
		height: 0.625rem;
		border-left: 1.5px solid currentcolor;
		border-bottom: 1.5px solid currentcolor;
		transform: rotate(45deg);
	}

	&__heading {
		font-size: $font-size-lg;
	}
}
</style>
