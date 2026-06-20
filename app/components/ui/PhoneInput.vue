<script lang="ts" setup>
// Integrated phone input with inline country selector (REUI-style).
// A prefix trigger (flag + code + caret) is attached to the left of the number
// field; clicking it opens a dropdown popup. v-model emits a single E.164 string
// (e.g. "+27832336448"). Country codes + labels come from locale-aware content.
import type { SelectOption } from "#shared/types/types";
import { flagFor } from "#shared/utils/flag-map";

const props = withDefaults(
	defineProps<{
		countryCodes: SelectOption[];
		placeholder?: string;
		required?: boolean;
		tone?: "default" | "subtle";
	}>(),
	{
		placeholder: "",
		required: false,
		tone: "default",
	},
);

const model = defineModel<string>();

// ── Internal state ───────────────────────────────────────────────────────
const defaultCode = props.countryCodes[0]?.value ?? "+27";
const selectedCode = ref(defaultCode);
const localNumber = ref("");
const dropdownOpen = ref(false);
const highlightedIndex = ref(0);

// Guard to prevent the model→internal watcher from reacting to changes the
// internal→model watcher just made — breaks the bidirectional feedback loop.
let emitting = false;

// Parse a combined E.164 phone string back into code + number by finding the
// longest matching country code in the list.
function parsePhone(value: string): { code: string; number: string } {
	if (!value) return { code: defaultCode, number: "" };
	let best = { code: defaultCode, number: value };
	for (const cc of props.countryCodes) {
		if (value.startsWith(cc.value) && cc.value.length > best.code.length) {
			best = { code: cc.value, number: value.slice(cc.value.length) };
		}
	}
	return best;
}

// Sync model → internal refs (initialise on mount, re-sync on external change).
watch(
	() => model.value,
	(val) => {
		if (emitting) return;
		const parsed = parsePhone(val ?? "");
		selectedCode.value = parsed.code;
		localNumber.value = parsed.number;
	},
	{ immediate: true },
);

// Sync internal refs → model (strip non-digits from the local number).
watch([selectedCode, localNumber], ([code, num]) => {
	emitting = true;
	model.value = `${code}${num.replace(/\D/g, "")}`;
	nextTick(() => {
		emitting = false;
	});
});

// Reset highlight to the selected country when the dropdown opens.
watch(dropdownOpen, (open) => {
	if (open) {
		const idx = props.countryCodes.findIndex((c) => c.value === selectedCode.value);
		highlightedIndex.value = idx >= 0 ? idx : 0;
	}
});

// ── Dropdown ─────────────────────────────────────────────────────────────
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);

function openDropdown() {
	dropdownOpen.value = true;
}

function closeDropdown() {
	dropdownOpen.value = false;
}

function toggleDropdown() {
	if (dropdownOpen.value) closeDropdown();
	else openDropdown();
}

function selectCountry(code: string) {
	selectedCode.value = code;
	closeDropdown();
	// Move focus back to the number input.
	nextTick(() => {
		const field = triggerRef.value?.closest(".phone-input__field");
		const input = field?.querySelector(".phone-input__number") as HTMLInputElement | null;
		input?.focus();
	});
}

// Click-outside handler (capture phase so it fires before the trigger toggle).
function onDocumentClick(e: MouseEvent) {
	if (!dropdownOpen.value) return;
	const target = e.target as Node;
	if (triggerRef.value?.contains(target)) return;
	if (dropdownRef.value?.contains(target)) return;
	closeDropdown();
}

onMounted(() => document.addEventListener("click", onDocumentClick, true));
onUnmounted(() => document.removeEventListener("click", onDocumentClick, true));

// ── Keyboard navigation ──────────────────────────────────────────────────
function onTriggerKeydown(e: KeyboardEvent) {
	if (e.key === "ArrowDown" || e.key === "ArrowUp") {
		e.preventDefault();
		openDropdown();
	}
}

function onDropdownKeydown(e: KeyboardEvent) {
	const list = props.countryCodes;
	if (list.length === 0) return;

	switch (e.key) {
		case "ArrowDown":
			e.preventDefault();
			highlightedIndex.value = (highlightedIndex.value + 1) % list.length;
			scrollHighlightedIntoView();
			break;
		case "ArrowUp":
			e.preventDefault();
			highlightedIndex.value =
				(highlightedIndex.value - 1 + list.length) % list.length;
			scrollHighlightedIntoView();
			break;
		case "Enter": {
			e.preventDefault();
			const entry = list[highlightedIndex.value];
			if (entry) selectCountry(entry.value);
			break;
		}
		case "Escape":
			e.preventDefault();
			closeDropdown();
			triggerRef.value?.focus();
			break;
		case "Tab":
			closeDropdown();
			break;
	}
}

function scrollHighlightedIntoView() {
	nextTick(() => {
		const el = listRef.value?.querySelector(".phone-input__option--highlighted");
		el?.scrollIntoView({ block: "nearest" });
	});
}
</script>

<template>
	<div class="phone-input">
		<!-- Integrated field: trigger + number input share a single border + focus ring -->
		<div class="phone-input__field" :class="`phone-input__field--${props.tone}`">
			<button
				ref="triggerRef"
				type="button"
				class="phone-input__trigger"
				:aria-expanded="dropdownOpen"
				aria-haspopup="listbox"
				@click="toggleDropdown"
				@keydown="onTriggerKeydown"
			>
				<span class="phone-input__flag" aria-hidden="true">{{ flagFor(selectedCode) }}</span>
				<span class="phone-input__code">{{ selectedCode }}</span>
				<span class="phone-input__caret" :class="{ 'phone-input__caret--open': dropdownOpen }" aria-hidden="true">▾</span>
			</button>
			<input
				v-model="localNumber"
				type="tel"
				class="phone-input__number"
				:placeholder="props.placeholder"
				:required="props.required"
				:aria-label="props.placeholder"
			/>
		</div>

		<Transition name="phone-input-dropdown">
			<div
				v-if="dropdownOpen"
				ref="dropdownRef"
				class="phone-input__dropdown"
				@keydown="onDropdownKeydown"
			>
				<ul ref="listRef" class="phone-input__list" role="listbox">
					<li
						v-for="(option, index) in props.countryCodes"
						:key="option.value"
						role="option"
						:aria-selected="option.value === selectedCode"
					>
						<button
							type="button"
							class="phone-input__option"
							:class="{
								'phone-input__option--selected': option.value === selectedCode,
								'phone-input__option--highlighted': index === highlightedIndex,
							}"
							@click="selectCountry(option.value)"
							@mouseenter="highlightedIndex = index"
						>
							<span class="phone-input__flag" aria-hidden="true">{{ flagFor(option.value) }}</span>
							<span class="phone-input__option-label">{{ option.label }}</span>
						</button>
					</li>
				</ul>
			</div>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
.phone-input {
	position: relative;

	// The integrated field wrapper — shared border, radius, and focus ring for the
	// trigger button and number input together.
	&__field {
		display: flex;
		align-items: stretch;
		border: 1px solid $color-field-border;
		border-radius: $radius-sm;
		background-color: $color-field;
		overflow: hidden;
		transition: border-color $duration-fast $ease-standard;

		&:focus-within {
			border-color: $color-gold;
		}

		&--subtle {
			background-color: $color-field-subtle;
		}
	}

	// Country trigger button attached to the left edge. Shows flag + code + caret.
	// A thin right border separates it from the number input.
	&__trigger {
		display: inline-flex;
		align-items: center;
		gap: $space-3xs;
		padding: $space-3xs $space-sm;
		margin: 0;
		border: none;
		border-right: 1px solid $color-field-border;
		background: none;
		font-family: $font-body;
		font-size: $font-size-sm;
		line-height: $line-height-base;
		color: $color-text;
		cursor: pointer;
		white-space: nowrap;

		&:focus-visible {
			outline-color: $color-gold;
		}
	}

	&__flag {
		font-size: $font-size-base;
		line-height: 1;
	}

	&__code {
		font-weight: $font-weight-medium;
	}

	&__caret {
		font-size: $font-size-xs;
		color: $color-text-muted;
		transition: transform $duration-fast $ease-standard;

		&--open {
			transform: rotate(180deg);
		}
	}

	// The number input — no border of its own, fills the remaining space.
	&__number {
		flex: 1;
		min-width: 0;
		padding: $space-3xs $space-md;
		border: none;
		background: none;
		font-family: $font-body;
		font-size: $font-size-sm;
		color: $color-text;
		outline: none;

		&::placeholder {
			color: $color-text-muted;
		}
	}

	// ── Dropdown popup ──────────────────────────────────────────────────────
	&__dropdown {
		position: absolute;
		inset-inline: 0;
		top: calc(100% + $space-2xs);
		z-index: 10;
		border: 1px solid $color-field-border;
		border-radius: $radius-sm;
		background-color: $color-white;
		box-shadow: $shadow-soft;
		overflow: hidden;
	}

	&__list {
		max-height: 14rem;
		overflow-y: auto;
		padding-block: $space-3xs;
	}

	&__option {
		display: flex;
		align-items: center;
		gap: $space-2xs;
		width: 100%;
		padding: $space-2xs $space-sm;
		margin: 0;
		border: none;
		background: none;
		font-family: $font-body;
		font-size: $font-size-sm;
		line-height: $line-height-base;
		color: $color-text;
		cursor: pointer;
		text-align: start;
		transition: background-color $duration-fast $ease-standard;

		&:hover {
			background-color: $color-light-gold-2;
		}

		&--selected {
			background-color: $color-light-gold-1;
			font-weight: $font-weight-medium;
		}

		&--highlighted {
			background-color: $color-light-gold-2;
		}
	}

	&__option-label {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

// ── Transition (top-level per SCSS structure conventions) ────────────────
.phone-input-dropdown-enter-active,
.phone-input-dropdown-leave-active {
	transition:
		opacity $duration-fast $ease-standard,
		transform $duration-fast $ease-standard;
}

.phone-input-dropdown-enter-from,
.phone-input-dropdown-leave-to {
	opacity: 0;
	transform: translateY(-$space-2xs);
}
</style>
