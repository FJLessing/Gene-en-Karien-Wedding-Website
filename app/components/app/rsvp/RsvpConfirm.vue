<script lang="ts" setup>
// RSVP final step (Story 3): confirmation message + photo upload option.
import PhotoUpload from "~/components/app/PhotoUpload.vue";
import { useRsvpStore } from "~/stores/rsvp-store";

const store = useRsvpStore();

const message = computed(() =>
	store.isAttending ? "We can't wait to see you on our big day!" : "Thank you for letting us know!",
);
</script>

<template>
	<div class="rsvp-confirm">
		<img src="/logo.svg" alt="" class="rsvp-confirm__logo" />
		<h2 class="rsvp-confirm__title u-heading">Thank you</h2>
		<p class="rsvp-confirm__message">{{ message }}</p>
		<PhotoUpload />
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
	width: 4.5rem;
	height: auto;
}

.rsvp-confirm__title {
	font-size: $font-size-xl;
}

.rsvp-confirm__message {
	font-size: $font-size-base;
	color: $color-text-muted;
}
</style>
