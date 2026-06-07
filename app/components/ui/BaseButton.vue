<script lang="ts" setup>
// Primary CTA / action button. Embossed pill styling from the Figma tokens.
type ButtonVariant = "primary" | "ghost";

const props = withDefaults(
	defineProps<{
		variant?: ButtonVariant;
		type?: "button" | "submit";
		disabled?: boolean;
		loading?: boolean;
	}>(),
	{
		variant: "primary",
		type: "button",
		disabled: false,
		loading: false,
	},
);

const emit = defineEmits<{ click: [event: MouseEvent]; }>();
</script>

<template>
	<button
		:type="props.type"
		:disabled="props.disabled || props.loading"
		:class="['base-button', `base-button--${props.variant}`]"
		@click="emit('click', $event)"
	>
		<span v-if="props.loading" class="base-button__spinner" aria-hidden="true" />
		<slot />
	</button>
</template>

<style scoped lang="scss">
.base-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: $space-2xs;
	width: 100%;
	min-height: 3rem;
	padding: $space-xs $space-md;
	border-radius: $radius-pill;
	font-family: $font-body;
	font-weight: $font-weight-medium;
	font-size: $font-size-base;
	transition: transform $duration-fast $ease-standard, opacity $duration-fast $ease-standard;

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&:not(:disabled):active {
		transform: scale(0.98);
	}
}

.base-button--primary {
	background-color: $color-gold;
	color: $color-white;
	box-shadow: $shadow-soft;
}

.base-button--ghost {
	background-color: transparent;
	color: $color-text;
	box-shadow: $shadow-embossed;
}

.base-button__spinner {
	width: 1rem;
	height: 1rem;
	border: 2px solid currentcolor;
	border-top-color: transparent;
	border-radius: 50%;
	animation: spin 0.6s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
