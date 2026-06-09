<script lang="ts" setup>
import BaseButton from "~/components/ui/BaseButton.vue";

const emit = defineEmits<{ unlock: []; }>();

const { isUnlocked, verifyPassword } = useAccess();
const { gsap, withCleanup } = useGsap();

const root = ref<HTMLElement | null>(null);
const envelope = ref<HTMLElement | null>(null);
const flap = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
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
	if (isUnlocked.value) {
		emit("unlock");
		return;
	}

	const envelopeEl = envelope.value;
	const flapEl = flap.value;
	const contentEl = content.value;
	if (!envelopeEl || !flapEl || !contentEl) return;

	withCleanup(() => {
		const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

		tl.from(envelopeEl, { opacity: 0, y: "2rem", duration: 0.7 })
			.set(flapEl, { transformOrigin: "top center", rotateX: -180, transformPerspective: 600 })
			.to(flapEl, { rotateX: 0, duration: 0.9, ease: "power2.inOut" }, "-=0.1")
			.from(contentEl, { opacity: 0, y: "1.5rem", duration: 0.5 }, "-=0.2");
	}, root.value);
});
</script>

<template>
	<div ref="root" class="envelope-gate">
		<div ref="envelope" class="envelope-gate__envelope">
			<div ref="flap" class="envelope-gate__flap" aria-hidden="true" />

			<div class="envelope-gate__body">
				<img src="/logo.svg" alt="" class="envelope-gate__logo" />

				<div ref="content" class="envelope-gate__content">
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
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.envelope-gate {
	min-height: 100dvh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: $space-lg;
	background-color: $color-bg;
}

.envelope-gate__envelope {
	position: relative;
	width: 100%;
	max-width: 22rem;
	border-radius: $radius-lg;
	background-color: $color-white;
	box-shadow: $shadow-embossed;
	overflow: hidden;
}

.envelope-gate__flap {
	width: 100%;
	height: 6rem;
	background-color: $color-gold;
	clip-path: polygon(0 0, 100% 0, 50% 100%);
	transform-origin: top center;
	perspective: 600px;
}

.envelope-gate__body {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $space-lg;
	padding: $space-xl $space-lg $space-xl;
}

.envelope-gate__logo {
	width: 5rem;
	height: auto;
}

.envelope-gate__content {
	width: 100%;
}

.envelope-gate__form {
	display: flex;
	flex-direction: column;
	gap: $space-sm;
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
