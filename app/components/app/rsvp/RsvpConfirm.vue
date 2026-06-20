<script lang="ts" setup>
// RSVP final step (Story 3): confirmation message + photo upload option.
import PhotoUpload from "~/components/app/PhotoUpload.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import { useRsvpStore } from "~/stores/rsvp-store";

const store = useRsvpStore();
const { content } = useContent();

const message = computed(() => {
	const ui = content.value?.ui.rsvp;
	return store.isAttending ? ui?.attendingMsg : ui?.declinedMsg;
});

function goHome(): void {
	store.reset();
	navigateTo("/");
}
</script>

<template>
	<div class="rsvp-confirm">
		<img src="/logo.svg" alt="" class="rsvp-confirm__logo" />
		<h2 class="rsvp-confirm__title u-heading">{{ content?.ui.rsvp.thankYou }}</h2>
		<p v-if="Array.isArray(message)" v-for="(msg, index) in message" :key="index">{{ msg }}</p>
		<p v-else class="rsvp-confirm__message">{{ message }}</p>

		<PhotoUpload class="rsvp-confirm__upload" />

		<BaseButton variant="ghost" @click="goHome">{{ content?.ui.nav.backHome }}</BaseButton>
	</div>
</template>

<style scoped lang="scss">
.rsvp-confirm {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $space-md;
	text-align: center;

	&__logo {
		width: 6.3125rem;
		height: auto;
		opacity: 0.5;
	}

	&__title {
		font-size: $font-size-lg; // 20px Bagien
	}

	&__message {
		max-width: 12rem;
		font-size: $font-size-sm;
		color: $color-text;
	}

	&__upload {
		width: 100%;
	}

	&__confirm__upload {
		margin-top: $space-xl;
	}
}
</style>
