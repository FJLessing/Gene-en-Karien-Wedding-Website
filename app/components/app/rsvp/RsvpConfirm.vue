<script lang="ts" setup>
// RSVP final step (Story 3): confirmation message + photo upload option.
import PhotoUpload from "~/components/app/PhotoUpload.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import { useRsvpStore } from "~/stores/rsvp-store";

const store = useRsvpStore();

const message = computed(() =>
	store.isAttending ? "We can't wait to see you on our big day!" : "Thank you for letting us know!",
);

function goHome(): void {
	store.reset();
	navigateTo("/");
}
</script>

<template>
	<div class="rsvp-confirm">
		<img src="/logo.svg" alt="" class="rsvp-confirm__logo" />
		<h2 class="rsvp-confirm__title u-heading">Thank you</h2>
		<p class="rsvp-confirm__message">{{ message }}</p>

		<PhotoUpload class="rsvp-confirm__upload" />

		<BaseButton variant="ghost" @click="goHome">Back to home page</BaseButton>
	</div>
</template>

<style scoped lang="scss">
.rsvp-confirm {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $space-md;
	text-align: center;
}

.rsvp-confirm__logo {
	width: 6.3125rem;
	height: auto;
	opacity: 0.5;
}

.rsvp-confirm__title {
	font-size: $font-size-lg; // 20px Bagien
}

.rsvp-confirm__message {
	max-width: 12rem;
	font-size: $font-size-sm;
	color: $color-text;
}

.rsvp-confirm__upload {
	width: 100%;
}
</style>
