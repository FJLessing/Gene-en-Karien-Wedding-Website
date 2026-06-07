<script lang="ts" setup>
// Select/dropdown wrapper (fj-vue form-field pattern). Options come from content.
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
		<select v-model="model" class="form-field__input" v-bind="$attrs">
			<option value="" disabled>{{ props.placeholder }}</option>
			<option v-for="option in props.options" :key="option.value" :value="option.value">
				{{ option.label }}
			</option>
		</select>
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

.form-field__input {
	width: 100%;
	min-height: 2.6875rem;
	padding: $space-2xs $space-xs;
	border: 1px solid $color-border;
	border-radius: $radius-md;
	background-color: $color-white;
	font-size: $font-size-base;

	&:focus-visible {
		border-color: $color-gold;
	}
}

.form-field__error {
	font-size: $font-size-sm;
	color: $color-error;
}
</style>
