<script lang="ts" setup>
// Action button. Three variants mapped to the Figma "Button States" frame:
//   primary   → gold fill, dark text          (main CTAs, "Save guest")
//   secondary → dark fill, white text          (submit, "Book accommodation")
//   ghost     → outlined, transparent fill     (tertiary actions)
// Each variant has default / hover / on-click states. Hover adds a subtle lift.
type ButtonVariant = "primary" | "secondary" | "ghost";

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
	height: 3rem; // 48px
	padding: 0 $space-md;
	border: 1px solid transparent;
	border-radius: $radius-sm; // 4px — the design uses rounded rectangles, not pills
	font-family: $font-body;
	font-weight: $font-weight-medium;
	font-size: $font-size-xs; // 12px
	line-height: $line-height-loose; // 1.6
	transition: transform $duration-fast $ease-standard, background-color $duration-fast $ease-standard,
		box-shadow $duration-fast $ease-standard;

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	// Lift on hover (per the "add lift animation effect on hover" note).
	&:not(:disabled):hover {
		transform: translateY(-2px);
		box-shadow: $shadow-soft;
	}

	&:not(:disabled):active {
		transform: translateY(0);
		box-shadow: none;
	}

	@include reduced-motion {
		transition: background-color $duration-fast $ease-standard;

		&:not(:disabled):hover,
		&:not(:disabled):active {
			transform: none;
		}
	}

	// ── Primary: gold fill, dark text ──────────────────────────────────────────────
	&--primary {
		background-color: $color-gold;
		color: $color-text;

		&:not(:disabled):active {
			background-color: $color-light-gold-1;
		}
	}

	// ── Secondary: dark fill, white text ───────────────────────────────────────────
	&--secondary {
		background-color: $color-black;
		color: $color-white;

		&:not(:disabled):active {
			background-color: $color-grey;
		}
	}

	// ── Ghost / tertiary: outlined ─────────────────────────────────────────────────
	&--ghost {
		background-color: transparent;
		border-color: $color-black;
		color: $color-text;

		&:not(:disabled):hover {
			background-color: $color-light-gold-1;
		}

		&:not(:disabled):active {
			background-color: $color-gold;
		}
	}

	&__spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid currentcolor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
