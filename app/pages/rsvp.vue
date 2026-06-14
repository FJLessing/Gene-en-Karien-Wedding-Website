<script lang="ts" setup>
// RSVP page (Story 3). Dedicated route for deep-linking; drives the multi-step
// flow from the rsvp store. The monogram + Back affordance frame every step.
import RsvpSearch from "~/components/app/rsvp/RsvpSearch.vue";
import RsvpAttendChoice from "~/components/app/rsvp/RsvpAttendChoice.vue";
import RsvpForm from "~/components/app/rsvp/RsvpForm.vue";
import RsvpConfirm from "~/components/app/rsvp/RsvpConfirm.vue";
import { useRsvpStore } from "~/stores/rsvp-store";
import { RsvpStep } from "#shared/types/types";
import { SEOService } from "~/services/seo-service";

definePageMeta({ layout: "minimal" });

const store = useRsvpStore();

// The confirmation screen is self-contained (no monogram/back chrome).
const showChrome = computed(() => store.step !== RsvpStep.Confirm);

// Step back through the flow, or home from the first step.
function goBack(): void {
	if (store.step === RsvpStep.Attendance) {
		store.step = RsvpStep.Search;
	} else if (store.step === RsvpStep.Details) {
		store.step = RsvpStep.Attendance;
	} else {
		navigateTo("/");
	}
}

SEOService.set({ title: "RSVP" });
</script>

<template>
	<div class="rsvp-page">
		<template v-if="showChrome">
			<img src="/logo.svg" alt="" class="rsvp-page__logo" />
			<button class="rsvp-page__back" type="button" @click="goBack">
				<span class="rsvp-page__back-caret" aria-hidden="true" />
				Back
			</button>
		</template>

		<RsvpSearch v-if="store.step === RsvpStep.Search" />
		<RsvpAttendChoice v-else-if="store.step === RsvpStep.Attendance" />
		<RsvpForm v-else-if="store.step === RsvpStep.Details" />
		<RsvpConfirm v-else-if="store.step === RsvpStep.Confirm" />
	</div>
</template>

<style scoped lang="scss">
.rsvp-page {
	display: flex;
	flex-direction: column;
	gap: $space-md;
}

.rsvp-page__logo {
	width: 6.3125rem; // ~101px monogram from the design
	height: auto;
	margin-inline: auto;
	opacity: 0.5; // softly embossed look
}

.rsvp-page__back {
	display: inline-flex;
	align-items: center;
	gap: $space-2xs;
	align-self: flex-start;
	padding: $space-2xs 0;
	font-size: $font-size-base;
	color: $color-text-muted;
}

.rsvp-page__back-caret {
	width: 0.625rem;
	height: 0.625rem;
	border-left: 1.5px solid currentcolor;
	border-bottom: 1.5px solid currentcolor;
	transform: rotate(45deg);
}
</style>
