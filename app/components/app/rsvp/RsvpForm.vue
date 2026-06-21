<script lang="ts" setup>
// RSVP step 3 (Story 3): attendee detail form. The primary guest's name is locked
// from the search. A single optional additional guest can be added — how depends on
// the primary's "Plus One" flag: TRUE → a custom (free-text) plus-one; FALSE → an
// invited partner chosen via search. Layout follows the "RSVP 2" design.
import TextField from "~/components/ui/TextField.vue";
import SelectField from "~/components/ui/SelectField.vue";
import PhoneInput from "~/components/ui/PhoneInput.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import { useContent } from "~/composables/use-content";
import { useRsvpStore } from "~/stores/rsvp-store";
import { AttendanceChoice } from "#shared/types/types";
import type { Guest, RsvpEntry } from "#shared/types/types";
import TrashButton from "~/components/ui/TrashButton.vue";

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
		dietaryOther: "",
		arrivalDay: "",
		songRequest: "",
		attendance: store.attendance ?? AttendanceChoice.Attending,
	};
}

const form = ref<RsvpEntry>(blankEntry(true));

// The single optional additional guest (plus-one or searched partner). Null until added.
const extra = ref<RsvpEntry | null>(null);

// Whether the primary guest may add a custom (free-text) plus-one. Otherwise they
// must search the invited list for their partner.
const canBringPlusOne = computed(() => store.selectedGuest?.canBringPlusOne ?? false);

// True once the searched partner's identity is locked (guestId set).
const extraIsPartner = computed(() => extra.value?.guestId != null);

const arrivalOptions = computed(() => content.value?.ui.rsvp.arrivalOptions ?? []);
const mealOptions = computed(() => content.value?.rsvp.mealOptions ?? []);
const dietaryOptions = computed(() => content.value?.rsvp.dietaryOptions ?? []);
const countryCodes = computed(() => content.value?.ui.rsvp.countryCodes ?? []);
const ui = computed(() => content.value?.ui.rsvp);

// ── Adding the second guest ──────────────────────────────────────────────────
const showPartnerSearch = ref(false);
const partnerQuery = ref("");

watch(partnerQuery, (value) => store.searchPartners(value));

const showPartnerEmpty = computed(
	() => partnerQuery.value.trim().length >= 2 && !store.hasPartnerResults,
);

// Plus-one path: reveal a blank, editable additional entry.
function addPlusOne(): void {
	extra.value = blankEntry(false);
}

// Partner path: open the search.
function openPartnerSearch(): void {
	showPartnerSearch.value = true;
}

// Partner path: lock the chosen invited guest as the additional entry.
function choosePartner(guest: Guest): void {
	extra.value = { ...blankEntry(false), guestId: guest.id, name: guest.name };
	showPartnerSearch.value = false;
	partnerQuery.value = "";
	store.partnerResults = [];
}

function removeExtra(): void {
	extra.value = null;
}

function resolveDietary(entry: RsvpEntry): string {
	return entry.dietaryRequirement === "other" ? entry.dietaryOther : entry.dietaryRequirement;
}

async function submit(): Promise<void> {
	const primary: RsvpEntry = { ...form.value, dietaryRequirement: resolveDietary(form.value) };
	const secondary = extra.value ? { ...extra.value, dietaryRequirement: resolveDietary(extra.value) } : null;
	store.entries = [primary, ...(secondary ? [secondary] : [])];
	await store.submit();
}
</script>

<template>
	<form class="rsvp-form" @submit.prevent="submit">
		<h2 class="rsvp-form__title">{{ ui?.rsvpingFor }}</h2>
		<TextField :model-value="form.name" tone="subtle" readonly />

		<TextField v-model="form.email" type="email" :placeholder="ui?.placeholders.email" required />
		<PhoneInput v-model="form.phone" :country-codes="countryCodes" :placeholder="ui?.placeholders.phone" required />
		<SelectField v-model="form.mealPreference" :placeholder="ui?.placeholders.meal" :options="mealOptions" required />
		<SelectField v-model="form.dietaryRequirement" :placeholder="ui?.placeholders.dietary" :options="dietaryOptions" />
		<TextField
			v-if="form.dietaryRequirement === 'other'"
			v-model="form.dietaryOther"
			type="text"
			:placeholder="ui?.placeholders.dietaryOther"
			required
		/>
		<SelectField v-model="form.arrivalDay as string" :placeholder="ui?.placeholders.arrival" :options="arrivalOptions" required />
		<TextField v-model="form.songRequest" type="text" :placeholder="ui?.placeholders.song" />

		<!-- The additional guest's details, once added. -->
		<fieldset v-if="extra" class="rsvp-form__extra">
			<hr class="rsvp-form__divider" />
			<div class="rsvp-form__extra-name">
				<TextField
					v-if="extraIsPartner"
					:model-value="extra.name"
					tone="subtle"
					readonly
				/>
				<TextField v-else v-model="extra.name" :placeholder="ui?.placeholders.guestName" required />
				<button type="button" class="rsvp-form__remove" @click="removeExtra" :title="ui?.removeGuest">
					<TrashButton />
				</button>
			</div>

			<TextField v-model="extra.email" type="email" :placeholder="ui?.placeholders.email" required />
			<PhoneInput v-model="extra.phone" :country-codes="countryCodes" :placeholder="ui?.placeholders.phone" required />
			<SelectField v-model="extra.mealPreference" :placeholder="ui?.placeholders.meal" :options="mealOptions" required />
			<SelectField v-model="extra.dietaryRequirement" :placeholder="ui?.placeholders.dietary" :options="dietaryOptions" />
			<TextField
				v-if="extra.dietaryRequirement === 'other'"
				v-model="extra.dietaryOther"
				type="text"
				:placeholder="ui?.placeholders.dietaryOther"
				required
			/>
			<SelectField v-model="extra.arrivalDay as string" :placeholder="ui?.placeholders.arrival" :options="arrivalOptions" required />
			<TextField v-model="extra.songRequest" type="text" :placeholder="ui?.placeholders.song" />
		</fieldset>

		<!-- Add affordance — only while no additional guest has been added. -->
		<template v-else>
			<!-- Plus-one path: free-text custom guest. -->
			<button v-if="canBringPlusOne" type="button" class="rsvp-form__add" @click="addPlusOne">
				<span class="rsvp-form__add-icon" aria-hidden="true">+</span>
				<span class="rsvp-form__add-text">{{ ui?.addPlusOne }}</span>
			</button>

			<!-- Partner path: search the invited list. -->
			<template v-else>
				<button v-if="!showPartnerSearch" type="button" class="rsvp-form__add" @click="openPartnerSearch">
					<span class="rsvp-form__add-icon" aria-hidden="true">+</span>
					<span class="rsvp-form__add-text">{{ ui?.addGuest }}</span>
				</button>

				<div v-else class="rsvp-form__partner">
					<TextField v-model="partnerQuery" :placeholder="ui?.partnerPlaceholder" type="text" tone="subtle" />
					<ul v-if="store.hasPartnerResults" class="rsvp-form__results">
						<li v-for="guest in store.partnerResults" :key="guest.id">
							<button type="button" class="rsvp-form__result" @click="choosePartner(guest)">{{ guest.name }}</button>
						</li>
					</ul>
					<p v-else-if="showPartnerEmpty" class="rsvp-form__empty">{{ ui?.notFound }}</p>
				</div>
			</template>
		</template>

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

	&__extra {
		display: flex;
		flex-direction: column;
		gap: $space-sm;
		padding: 0;
		border: none;
		min-width: 0;
	}

	&__divider {
		width: 100%;
		margin: 0;
		border: none;
		border-top: 1px solid $color-field-border;
	}

	&__extra-name {
		display: flex;
		position: relative;

		> :first-child {
			flex: 1;
		}
	}

	&__remove {
		position: absolute;
		top: 55%;
		right: $space-xs;
		transform: translateY(-50%);
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		z-index: 2;
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

	&__partner {
		display: flex;
		flex-direction: column;
		gap: $space-sm;
	}

	&__results {
		display: flex;
		flex-direction: column;
		gap: $space-3xs;
	}

	&__result {
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
			background-color: $color-field;
			border-color: $color-gold;
		}
	}

	&__empty {
		font-size: $font-size-sm;
		color: $color-error;
	}

	&__error {
		font-size: $font-size-sm;
		color: $color-error;
	}
}
</style>
