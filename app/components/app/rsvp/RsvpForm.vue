<script lang="ts" setup>
// RSVP step 3 (Story 3): attendee detail form. The primary guest's name is locked
// from the search; additional guests get an editable name field. Layout follows
// the "RSVP 2" design (placeholder-driven fields, Save guest / Add guest / RSVP).
import TextField from "~/components/ui/TextField.vue";
import SelectField from "~/components/ui/SelectField.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import { useContent } from "~/composables/use-content";
import { useRsvpStore } from "~/stores/rsvp-store";
import { AttendanceChoice } from "#shared/types/types";
import type { RsvpEntry } from "#shared/types/types";

const store = useRsvpStore();
const { content } = useContent();

// A blank entry. `fromSearch` marks the primary guest (name locked from search).
function blankEntry(fromSearch: boolean): RsvpEntry {
	return {
		guestId: fromSearch ? store.selectedGuest?.id ?? null : null,
		name: fromSearch ? store.selectedGuest?.name ?? "" : "",
		email: "",
		phone: "",
		mealPreference: "",
		dietaryRequirement: "",
		arrivalDay: null,
		songRequest: "",
		attendance: AttendanceChoice.Attending,
	};
}

const form = ref<RsvpEntry>(blankEntry(true));

// The primary guest's name is fixed; subsequent guests type their own.
const isPrimaryGuest = computed(() => form.value.guestId !== null);

const arrivalOptions = computed(() => content.value?.ui.rsvp.arrivalOptions ?? []);
const mealOptions = computed(() => content.value?.rsvp.mealOptions ?? []);
const dietaryOptions = computed(() => content.value?.rsvp.dietaryOptions ?? []);
const ui = computed(() => content.value?.ui.rsvp);

// Commit the current form into the saved-guests list and start a fresh, editable
// entry so another guest can be added.
function saveGuest(): void {
	if (!form.value.name.trim()) return;
	store.addEntry({ ...form.value });
	form.value = blankEntry(false);
}

async function submit(): Promise<void> {
	// Fold any in-progress entry in before submitting.
	if (form.value.name.trim()) {
		store.addEntry({ ...form.value });
		form.value = blankEntry(false);
	}
	await store.submit();
}
</script>

<template>
	<form class="rsvp-form" @submit.prevent="submit">
		<h2 class="rsvp-form__title">{{ ui?.rsvpingFor }}</h2>
		<TextField v-if="isPrimaryGuest" :model-value="form.name" tone="subtle" readonly />
		<TextField v-else v-model="form.name" :placeholder="ui?.placeholders.guestName" required />

		<TextField v-model="form.email" type="email" :placeholder="ui?.placeholders.email" required />
		<TextField v-model="form.phone" type="tel" :placeholder="ui?.placeholders.phone" />
		<SelectField v-model="form.mealPreference" :placeholder="ui?.placeholders.meal" :options="mealOptions" />
		<SelectField v-model="form.dietaryRequirement" :placeholder="ui?.placeholders.dietary" :options="dietaryOptions" />
		<SelectField v-model="form.arrivalDay as string" :placeholder="ui?.placeholders.arrival" :options="arrivalOptions" />

		<ul v-if="store.entries.length" class="rsvp-form__added">
			<li v-for="(entry, i) in store.entries" :key="i">{{ entry.name }} {{ ui?.addedSuffix }}</li>
		</ul>

		<BaseButton variant="primary" type="button" @click="saveGuest">{{ ui?.saveGuest }}</BaseButton>

		<button type="button" class="rsvp-form__add" @click="saveGuest">
			<span class="rsvp-form__add-icon" aria-hidden="true">+</span>
			<span class="rsvp-form__add-text">{{ ui?.addGuest }}</span>
		</button>

		<BaseButton variant="secondary" type="submit" :loading="store.isSubmitting">{{ ui?.submit }}</BaseButton>
		<p v-if="store.error" class="rsvp-form__error">{{ store.error }}</p>
	</form>
</template>

<style scoped lang="scss">
.rsvp-form {
	display: flex;
	flex-direction: column;
	gap: $space-sm;

	&__title {
		font-size: $font-size-base;
		font-weight: $font-weight-regular;
		color: $color-text;
	}

	&__added {
		display: flex;
		flex-direction: column;
		gap: $space-3xs;
		font-size: $font-size-sm;
		color: $color-text-muted;
	}

	&__add {
		display: inline-flex;
		align-items: center;
		gap: $space-2xs;
		align-self: flex-start;
		padding: $space-2xs;
		color: $color-text;
	}

	&__add-icon {
		font-size: $font-size-lg;
		line-height: 1;
	}

	&__add-text {
		font-size: $font-size-sm;
		text-decoration: underline;
	}

	&__error {
		font-size: $font-size-sm;
		color: $color-error;
	}
}
</style>
