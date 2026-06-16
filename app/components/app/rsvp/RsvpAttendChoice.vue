<script lang="ts" setup>
// RSVP step 2 (Story 3): attendance choice, presented as two selectable rows.
import TextField from "~/components/ui/TextField.vue";
import { useRsvpStore } from "~/stores/rsvp-store";
import { AttendanceChoice } from "#shared/types/types";

const store = useRsvpStore();
const { content } = useContent();

const selectedName = computed(() => store.selectedGuest?.name ?? "");

function choose(choice: AttendanceChoice): void {
	store.setAttendance(choice);
}
</script>

<template>
	<div class="attend-choice">
		<h2 class="attend-choice__title">{{ content?.ui.rsvp.rsvpingFor }}</h2>
		<TextField :model-value="selectedName" tone="subtle" readonly />

		<h2 class="attend-choice__title">{{ content?.ui.rsvp.attendingHeading }}</h2>
		<div class="attend-choice__options">
			<button
				type="button"
				:class="['attend-choice__option', { 'attend-choice__option--selected': store.attendance === AttendanceChoice.Attending }]"
				@click="choose(AttendanceChoice.Attending)"
			>
				{{ content?.ui.rsvp.yes }}
			</button>
			<button
				type="button"
				:class="['attend-choice__option', { 'attend-choice__option--selected': store.attendance === AttendanceChoice.Declined }]"
				@click="choose(AttendanceChoice.Declined)"
			>
				{{ content?.ui.rsvp.no }}
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
.attend-choice {
	display: flex;
	flex-direction: column;
	gap: $space-sm;
}

.attend-choice__title {
	font-size: $font-size-base;
	font-weight: $font-weight-regular;
	color: $color-text;
}

.attend-choice__options {
	display: flex;
	flex-direction: column;
	gap: $space-2xs;
}

.attend-choice__option {
	width: 100%;
	min-height: 2.6875rem;
	padding: $space-3xs $space-md;
	border: 1px solid $color-field-border;
	border-radius: $radius-sm;
	background-color: $color-field-subtle;
	font-size: $font-size-sm;
	color: $color-text;
	text-align: left;
	transition: background-color $duration-fast $ease-standard, border-color $duration-fast $ease-standard;

	&:hover {
		border-color: $color-gold;
	}
}

.attend-choice__option--selected {
	background-color: $color-field;
	border-color: $color-gold;
}
</style>
