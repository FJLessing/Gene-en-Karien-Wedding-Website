<script lang="ts" setup>
// Access gate (Story 1). Shows the GSAP envelope-opening animation; when the
// site is locked it reveals a password field. On success it emits `unlock`.
// Animation here is a minimal placeholder — the full envelope sequence is built
// later against the Figma "Envelope Closed/Open" frames.
import BaseButton from "~/components/ui/BaseButton.vue";

const emit = defineEmits<{ unlock: []; }>();

const { isUnlocked, verifyPassword } = useAccess();
const { gsap } = useGsap();

const root = ref<HTMLElement | null>(null);
const password = ref("");
const error = ref("");
const isChecking = ref(false);

async function onSubmit(): Promise<void> {
	error.value = "";
	isChecking.value = true;
	const ok = await verifyPassword(password.value);
	isChecking.value = false;
	if (ok) {
		emit("unlock");
	} else {
		error.value = "That password didn't match. Please try again.";
	}
}

onMounted(() => {
	const el = root.value;
	if (!el) return;
	// Placeholder entrance — swap for the real envelope timeline.
	gsap.from(el, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" });
	// If already unlocked via URL param, hand off immediately.
	if (isUnlocked.value) emit("unlock");
});
</script>

<template>
	<div ref="root" class="envelope-gate">
		<img src="/logo.svg" alt="" class="envelope-gate__logo" />

		<form v-if="!isUnlocked" class="envelope-gate__form" @submit.prevent="onSubmit">
			<label class="u-visually-hidden" for="site-password">Password</label>
			<input
				id="site-password"
				v-model="password"
				type="password"
				placeholder="Password"
				class="envelope-gate__input"
				autocomplete="off"
			/>
			<p v-if="error" class="envelope-gate__error">{{ error }}</p>
			<BaseButton type="submit" :loading="isChecking">Open</BaseButton>
		</form>
	</div>
</template>

<style scoped lang="scss">
.envelope-gate {
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: $space-lg;
	padding: $space-lg;
	background-color: $color-bg;
}

.envelope-gate__logo {
	width: 6rem;
	height: auto;
}

.envelope-gate__form {
	display: flex;
	flex-direction: column;
	gap: $space-sm;
	width: 100%;
	max-width: 18rem;
}

.envelope-gate__input {
	width: 100%;
	min-height: 2.6875rem;
	padding: $space-2xs $space-xs;
	border: 1px solid $color-border;
	border-radius: $radius-md;
	text-align: center;
	background-color: $color-white;
}

.envelope-gate__error {
	font-size: $font-size-sm;
	color: $color-error;
	text-align: center;
}
</style>
