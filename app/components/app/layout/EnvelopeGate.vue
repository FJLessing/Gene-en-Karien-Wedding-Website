<script lang="ts" setup>
// Access gate (Story 1). A neumorphic envelope that opens on load (GSAP): the
// flap lifts to reveal the password field. Matches the Figma "Envelope
// Closed / Open" frames — soft white paper, embossed GK seal on the closed flap.
const emit = defineEmits<{ unlock: []; }>();

const { isUnlocked, verifyPassword } = useAccess();
const { content } = useContent();
const { gsap, withCleanup } = useGsap();

const root = ref<HTMLElement | null>(null);
const flap = ref<HTMLElement | null>(null);
const formEl = ref<HTMLElement | null>(null);

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
		error.value = content.value?.ui.gate.wrongPassword ?? "That password didn't match. Please try again.";
	}
}

onMounted(() => {
	// Already unlocked (URL param resolved server-side) — hand off without the gate.
	if (isUnlocked.value) {
		emit("unlock");
		return;
	}

	const reduce = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	withCleanup(() => {
		// Hinge the flap on its top edge (GSAP otherwise defaults to centre).
		gsap.set(flap.value, { transformOrigin: "50% 0%" });

		if (reduce) {
			// Skip the opening sequence; present the open envelope immediately.
			gsap.set(flap.value, { autoAlpha: 0 });
			gsap.set(formEl.value, { autoAlpha: 1, y: 0 });
			return;
		}

		gsap.set(flap.value, { rotationX: 0, autoAlpha: 1 });
		gsap.set(formEl.value, { autoAlpha: 0, y: 12 });
		gsap.set(root.value, { opacity: 0 });

		gsap
			.timeline({ defaults: { ease: "power2.inOut" } })
			.to(root.value, { opacity: 1, duration: 0.5 })
			// Lift the flap and let it fade as it swings back, revealing the throat.
			.to(flap.value, { rotationX: 135, duration: 0.95 }, "+=0.35")
			.to(flap.value, { autoAlpha: 0, duration: 0.4 }, "-=0.45")
			.to(formEl.value, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.3");
	}, root.value);
});
</script>

<template>
	<div ref="root" class="gate">
		<div class="gate__envelope">
			<!-- Inside / back of the envelope (revealed once the flap lifts). -->
			<div class="gate__base" />

			<!-- Inside throat, revealed at the top once the flap lifts away. -->
			<div class="gate__throat" />

			<!-- Front pocket: the three fixed paper faces that hold the letter in. -->
			<div class="gate__face gate__face--left" />
			<div class="gate__face gate__face--right" />
			<div class="gate__face gate__face--bottom" />

			<!-- Password entry, revealed on the front when the envelope opens. -->
			<form ref="formEl" class="gate__form" @submit.prevent="onSubmit">
				<label class="u-visually-hidden" for="site-password">{{ content?.ui.gate.passwordLabel }}</label>
				<input
					id="site-password"
					v-model="password"
					type="password"
					:placeholder="content?.ui.gate.passwordPlaceholder"
					class="gate__input"
					:disabled="isChecking"
					autocomplete="off"
				/>
				<button class="u-visually-hidden" type="submit">{{ content?.ui.gate.open }}</button>
				<p v-if="error" class="gate__error">{{ error }}</p>
			</form>

			<!-- The hinged top flap. Two faces so the underside shows when open. -->
			<div ref="flap" class="gate__flap">
				<div class="gate__flap-face gate__flap-face--front">
					<span class="gate__mono" aria-hidden="true">GK</span>
				</div>
				<div class="gate__flap-face gate__flap-face--back" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
// Envelope paper shades (illustration-specific; soft near-white greys).
$paper-light: #ffffff;
$paper: #f3f1ee;
$paper-dim: #e7e4df;
$paper-inside: #efece8;
$apex: 46%; // where the four flaps meet (down from the top edge)

.gate {
	min-height: 100dvh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: $space-lg;
	background-color: $color-white;
}

.gate__envelope {
	position: relative;
	width: min(86vw, 23rem);
	aspect-ratio: 357 / 221;
	perspective: 110rem;
	filter: drop-shadow(0 1.25rem 1.5rem rgba(#000000, 0.12));
}

// Inside face, sits behind everything; seen through the open flap.
.gate__base {
	position: absolute;
	inset: 0;
	border-radius: $radius-sm;
	background: linear-gradient(180deg, $paper-inside, $paper-dim);
	z-index: 1;
}

// Inside throat — the shaded triangle seen through the opened flap.
.gate__throat {
	position: absolute;
	inset: 0;
	clip-path: polygon(0 0, 100% 0, 50% #{$apex});
	background: linear-gradient(180deg, $paper-dim, #d8d4ce);
	box-shadow: inset 0 0.0625rem 0.1875rem rgba(#000000, 0.06);
	z-index: 2;
}

// The three front pocket faces (clipped triangles meeting at the centre apex).
.gate__face {
	position: absolute;
	inset: 0;
	z-index: 2;
}

.gate__face--left {
	clip-path: polygon(0 0, 0 100%, 50% #{$apex});
	background: linear-gradient(95deg, $paper-dim, $paper);
}

.gate__face--right {
	clip-path: polygon(100% 0, 100% 100%, 50% #{$apex});
	background: linear-gradient(265deg, $paper-dim, $paper);
}

.gate__face--bottom {
	clip-path: polygon(0 100%, 100% 100%, 50% #{$apex});
	background: linear-gradient(0deg, $paper-light, $paper);
	z-index: 3;
}

// ── Password form ──────────────────────────────────────────────────────────────
.gate__form {
	position: absolute;
	top: 24%;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $space-2xs;
	width: 62%;
	z-index: 4;
	opacity: 0; // revealed by the opening timeline; avoids a first-paint flash
}

.gate__input {
	width: 100%;
	min-height: 2.5rem;
	padding: $space-2xs $space-sm;
	border: 1px solid $color-field-border;
	border-radius: $radius-sm;
	background-color: $color-white;
	font-size: $font-size-sm;
	color: $color-text;
	text-align: center;
	box-shadow: $shadow-soft;

	&::placeholder {
		color: $color-text-muted;
	}

	&:focus-visible {
		border-color: $color-gold;
	}
}

.gate__error {
	font-size: $font-size-xs;
	color: $color-error;
	text-align: center;
}

// ── Hinged flap ──────────────────────────────────────────────────────────────
.gate__flap {
	position: absolute;
	inset: 0;
	transform-origin: top center;
	transform-style: preserve-3d;
	z-index: 5;
	will-change: transform;
}

.gate__flap-face {
	position: absolute;
	inset: 0;
	clip-path: polygon(0 0, 100% 0, 50% #{$apex});
	backface-visibility: hidden;
}

.gate__flap-face--front {
	background: linear-gradient(180deg, $paper-light, $paper);
	// Soft crease along the flap's lower edges.
	box-shadow: inset 0 -0.0625rem 0.125rem rgba(#000000, 0.04);
}

.gate__flap-face--back {
	background: linear-gradient(180deg, $paper-inside, $paper-dim);
	transform: rotateX(180deg);
}

// Embossed GK seal on the closed flap.
.gate__mono {
	position: absolute;
	top: 16%;
	left: 50%;
	transform: translateX(-50%);
	font-family: $font-display;
	font-size: 2.75rem;
	line-height: 1;
	color: $paper;
	text-shadow: 0.0625rem 0.0625rem 0.0625rem rgba(#ffffff, 0.9),
		-0.0625rem -0.0625rem 0.0625rem rgba(#000000, 0.12);
}

@include reduced-motion {
	.gate__flap {
		transition: none;
	}
}
</style>
