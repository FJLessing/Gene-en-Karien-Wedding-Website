<script lang="ts" setup>
// Select/dropdown wrapper (fj-vue form-field pattern). Options come from content.
// Placeholder-driven to match the RSVP designs; soft gold field tint + caret.
import type { SelectOption } from "#shared/types/types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		label?: string;
		error?: string;
		required?: boolean;
		placeholder?: string;
		options: SelectOption[];
	}>(),
	{
		label: "",
		error: "",
		required: false,
		placeholder: "Select an option",
	},
);

const model = defineModel<string>();
</script>

<template>
	<div class="form-field">
		<label v-if="props.label" class="form-field__label">
			{{ props.label }}<span v-if="props.required" class="form-field__required"> *</span>
		</label>
		<div class="form-field__select-wrap">
			<select
				v-model="model"
				:class="['form-field__input', 'form-field__select', { 'form-field__select--empty': !model }]"
				v-bind="$attrs"
			>
				<option value="" disabled>{{ props.placeholder }}</option>
				<option v-for="option in props.options" :key="option.value" :value="option.value">
					{{ option.label }}
				</option>
			</select>
		</div>
		<p v-if="props.error" class="form-field__error">{{ props.error }}</p>
	</div>
</template>

<style scoped lang="scss">
.form-field {
	display: flex;
	flex-direction: column;
	gap: $space-3xs;
}

.form-field__label {
	font-size: $font-size-sm;
	font-weight: $font-weight-medium;
}

.form-field__required {
	color: $color-error;
}

.form-field__select-wrap {
	position: relative;
}

.form-field__input {
	width: 100%;
	min-height: 2.6875rem; // 43px
	padding: $space-3xs $space-md;
	border: 1px solid $color-field-border;
	border-radius: $radius-sm;
	background-color: $color-field;
	font-size: $font-size-sm;
	color: $color-text;

	&:focus-visible {
		border-color: $color-gold;
	}
}

.form-field__select {
	appearance: none;
	// Caret chevron (matches the design's CaretDown), tinted with the body colour.
	padding-right: $space-xl;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234a4a4a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right $space-md center;
	cursor: pointer;
}

// Grey out the placeholder text while no real option is selected.
.form-field__select--empty {
	color: $color-text-muted;
}

.form-field__error {
	font-size: $font-size-sm;
	color: $color-error;
}
</style>
