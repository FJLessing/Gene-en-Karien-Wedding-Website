<script lang="ts" setup>
// RSVP step 2 (Story 3): attendance choice.
import BaseButton from "~/components/ui/BaseButton.vue";
import { useRsvpStore } from "~/stores/rsvp-store";
import { AttendanceChoice } from "#shared/types/types";

const store = useRsvpStore();
</script>

<template>
	<div class="attend-choice">
		<p v-if="store.selectedGuest" class="attend-choice__name">
			I am RSVPing for: <strong>{{ store.selectedGuest.name }}</strong>
		</p>
		<BaseButton @click="store.setAttendance(AttendanceChoice.Attending)">Yes, can't wait!</BaseButton>
		<BaseButton variant="ghost" @click="store.setAttendance(AttendanceChoice.Declined)">
			Unfortunately I won't be able to.
		</BaseButton>
	</div>
</template>

<style scoped lang="scss">
.attend-choice {
	display: flex;
	flex-direction: column;
	gap: $space-sm;
}

.attend-choice__name {
	font-size: $font-size-sm;
	color: $color-text-muted;
}
</style>
