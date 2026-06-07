<script lang="ts" setup>
// RSVP step 3 (Story 3): attendee detail form. Supports adding additional guests.
// Validation is intentionally minimal at the boilerplate stage.
import TextField from "~/components/ui/TextField.vue";
import SelectField from "~/components/ui/SelectField.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import { useContent } from "~/composables/use-content";
import { useRsvpStore } from "~/stores/rsvp-store";
import { ArrivalDay, AttendanceChoice } from "#shared/types/types";
import type { RsvpEntry } from "#shared/types/types";

const store = useRsvpStore();
const { content } = useContent();

function blankEntry(): RsvpEntry {
	return {
		guestId: store.selectedGuest?.id ?? null,
		name: store.selectedGuest?.name ?? "",
		email: "",
		phone: "",
		mealPreference: "",
		dietaryRequirement: "",
		arrivalDay: null,
		songRequest: "",
		attendance: AttendanceChoice.Attending,
	};
}

const form = ref<RsvpEntry>(blankEntry());

const arrivalOptions = [
	{ label: "Friday", value: ArrivalDay.Friday },
	{ label: "Saturday", value: ArrivalDay.Saturday },
];

const mealOptions = computed(() => content.value?.rsvp.mealOptions ?? []);
const dietaryOptions = computed(() => content.value?.rsvp.dietaryOptions ?? []);

function addGuest(): void {
	store.addEntry(form.value);
	form.value = blankEntry();
	store.reset();
}

async function submit(): Promise<void> {
	store.addEntry(form.value);
	await store.submit();
}
</script>

<template>
	<form class="rsvp-form" @submit.prevent="submit">
		<TextField v-model="form.name" label="Name" required />
		<TextField v-model="form.email" label="Email address" type="email" required />
		<TextField v-model="form.phone" label="Phone number" type="tel" />
		<SelectField v-model="form.mealPreference" label="Meal preference" :options="mealOptions" />
		<SelectField v-model="form.dietaryRequirement" label="Dietary requirements" :options="dietaryOptions" />
		<SelectField v-model="form.arrivalDay as string" label="I'm coming on" :options="arrivalOptions" />
		<TextField v-model="form.songRequest" label="Song request for the DJ" />

		<div v-if="store.entries.length" class="rsvp-form__added">
			<p>Added guests:</p>
			<ul>
				<li v-for="(entry, i) in store.entries" :key="i">{{ entry.name }}</li>
			</ul>
		</div>

		<BaseButton variant="ghost" type="button" @click="addGuest">Add guest</BaseButton>
		<BaseButton type="submit" :loading="store.isSubmitting">RSVP</BaseButton>
		<p v-if="store.error" class="rsvp-form__error">{{ store.error }}</p>
	</form>
</template>

<style scoped lang="scss">
.rsvp-form {
	display: flex;
	flex-direction: column;
	gap: $space-sm;
}

.rsvp-form__added {
	font-size: $font-size-sm;
	color: $color-text-muted;
}

.rsvp-form__error {
	font-size: $font-size-sm;
	color: $color-error;
}
</style>
