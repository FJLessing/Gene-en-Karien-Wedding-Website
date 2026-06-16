<script lang="ts" setup>
// Text input wrapper (fj-vue form-field pattern). Works for text/email/tel.
// The RSVP designs are placeholder-driven (no visible label) and use a soft gold
// field tint; pass `tone="subtle"` for read-only / neutral fields.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		label?: string;
		error?: string;
		required?: boolean;
		type?: "text" | "email" | "tel";
		placeholder?: string;
		tone?: "default" | "subtle";
		readonly?: boolean;
	}>(),
	{
		label: "",
		error: "",
		required: false,
		type: "text",
		placeholder: "",
		tone: "default",
		readonly: false,
	},
);

const model = defineModel<string>();
</script>

<template>
	<div class="form-field">
		<label v-if="props.label" class="form-field__label">
			{{ props.label }}<span v-if="props.required" class="form-field__required"> *</span>
		</label>
		<input
			v-model="model"
			:type="props.type"
			:placeholder="props.placeholder"
			:readonly="props.readonly"
			:class="['form-field__input', `form-field__input--${props.tone}`]"
			v-bind="$attrs"
		/>
		<p v-if="props.error" class="form-field__error">{{ props.error }}</p>
	</div>
</template>

<style scoped lang="scss">
.form-field {
	display: flex;
	flex-direction: column;
	gap: $space-3xs;

	&__label {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
	}

	&__required {
		color: $color-error;
	}

	&__input {
		width: 100%;
		min-height: 2.6875rem;
		padding: $space-3xs $space-md;
		border: 1px solid $color-field-border;
		border-radius: $radius-sm;
		font-size: $font-size-sm;
		color: $color-text;

		&::placeholder {
			color: $color-text-muted;
		}

		&:focus-visible {
			border-color: $color-gold;
		}

		&[readonly] {
			cursor: default;
		}

		&--default {
			background-color: $color-field;
		}

		&--subtle {
			background-color: $color-field-subtle;
		}
	}

	&__error {
		font-size: $font-size-sm;
		color: $color-error;
	}
}
</style>
