<script lang="ts" setup>
// Footer language toggle (EN / AF). Persists the choice via the locale store,
// which refetches content for the new language and updates <html lang>.
import { useLocaleStore } from "~/stores/locale-store";
import { Locale } from "#shared/types/types";

const localeStore = useLocaleStore();

const options: { value: Locale; label: string }[] = [
	{ value: Locale.En, label: "EN" },
	{ value: Locale.Af, label: "AF" },
];

function select(locale: Locale): void {
	localeStore.setLocale(locale);
}
</script>

<template>
	<div class="locale-toggle" role="group" aria-label="Language">
		<template v-for="(option, i) in options" :key="option.value">
			<span v-if="i > 0" class="locale-toggle__divider" aria-hidden="true">/</span>
			<button
				type="button"
				class="locale-toggle__option"
				:class="{ 'locale-toggle__option--active': localeStore.locale === option.value }"
				:aria-pressed="localeStore.locale === option.value"
				@click="select(option.value)"
			>
				{{ option.label }}
			</button>
		</template>
	</div>
</template>

<style scoped lang="scss">
.locale-toggle {
	display: inline-flex;
	align-items: center;
	gap: $space-2xs;
	font-size: $font-size-xs;
	letter-spacing: 0.08em;
}

.locale-toggle__option {
	padding: $space-3xs;
	color: $color-text-muted;
	text-transform: uppercase;
	transition: color $duration-fast $ease-standard;

	&:hover {
		color: $color-text;
	}

	&--active {
		color: $color-text;
		border-bottom: 1px solid $color-gold;
	}
}

.locale-toggle__divider {
	color: $color-text-muted;
}
</style>
