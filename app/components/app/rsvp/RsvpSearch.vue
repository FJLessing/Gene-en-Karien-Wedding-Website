<script lang="ts" setup>
// RSVP step 1 (Story 3): search for your name. Fuzzy search runs after 3 chars.
import TextField from "~/components/ui/TextField.vue";
import { useRsvpStore } from "~/stores/rsvp-store";
import type { Guest } from "#shared/types/types";

const store = useRsvpStore();
const query = ref("");

watch(query, (value) => store.search(value));

onMounted(() => store.loadGuests());

function choose(guest: Guest): void {
	store.selectGuest(guest);
}

const showNoResults = computed(() => query.value.trim().length >= 3 && !store.hasResults && !store.isSearching);
</script>

<template>
	<div class="rsvp-search">
		<h2 class="rsvp-search__title">I am RSVPing for:</h2>
		<TextField v-model="query" placeholder="Type your name to search" type="text" tone="subtle" />

		<ul v-if="store.hasResults" class="rsvp-search__results">
			<li v-for="guest in store.searchResults" :key="guest.id">
				<button type="button" class="rsvp-search__result" @click="choose(guest)">{{ guest.name }}</button>
			</li>
		</ul>

		<p v-else-if="showNoResults" class="rsvp-search__empty">
			We couldn't find that name. Please try again.
		</p>
	</div>
</template>

<style scoped lang="scss">
.rsvp-search {
	display: flex;
	flex-direction: column;
	gap: $space-sm;
}

.rsvp-search__title {
	font-size: $font-size-base;
	font-weight: $font-weight-regular;
	color: $color-text;
}

.rsvp-search__results {
	display: flex;
	flex-direction: column;
	gap: $space-3xs;
}

.rsvp-search__result {
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

.rsvp-search__empty {
	font-size: $font-size-sm;
	color: $color-error;
}
</style>
