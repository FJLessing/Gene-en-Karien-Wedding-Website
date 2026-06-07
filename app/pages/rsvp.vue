<script lang="ts" setup>
// RSVP page (Story 3). Dedicated route for deep-linking; drives the multi-step
// flow from the rsvp store.
import RsvpSearch from "~/components/app/rsvp/RsvpSearch.vue";
import RsvpAttendChoice from "~/components/app/rsvp/RsvpAttendChoice.vue";
import RsvpForm from "~/components/app/rsvp/RsvpForm.vue";
import RsvpConfirm from "~/components/app/rsvp/RsvpConfirm.vue";
import { useRsvpStore } from "~/stores/rsvp-store";
import { RsvpStep } from "#shared/types/types";
import { SEOService } from "~/services/seo-service";

definePageMeta({ layout: "minimal" });

const store = useRsvpStore();

function goBack(): void {
	navigateTo("/");
}

SEOService.set({ title: "RSVP" });
</script>

<template>
	<div class="rsvp-page">
		<button class="rsvp-page__back" @click="goBack">&lsaquo; Back</button>

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
	gap: $space-lg;
}

.rsvp-page__back {
	align-self: flex-start;
	font-size: $font-size-sm;
	color: $color-text-muted;
}
</style>
