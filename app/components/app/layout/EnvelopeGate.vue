<script lang="ts" setup>
// Access gate (Story 1). A neumorphic envelope that opens on click (GSAP): the
// flap lifts to reveal the password field. Matches the Figma "Envelope
// Closed / Open" frames — soft white paper, embossed GK seal on the closed flap.
const emit = defineEmits<{ unlock: []; }>();

// How long the gate sits idle before nudging the visitor to tap the envelope.
const HINT_DELAY_MS = 30_000;

const { isUnlocked, verifyPassword } = useAccess();
const { content } = useContent();
const { gsap, withCleanup } = useGsap();

const EnvelopeMonogram = defineAsyncComponent(() => import("@/components/ui/EnvelopeMonogram.vue"));

const root = ref<HTMLElement | null>(null);
const flap = ref<HTMLElement | null>(null);
const formEl = ref<HTMLElement | null>(null);
const monoEl = ref<HTMLElement | null>(null);
const lidEl = ref<HTMLElement | null>(null);

const password = ref("");
const error = ref("");
const isChecking = ref(false);
const isOpen = ref(false);

// Idle hint: appears after HINT_DELAY_MS, removed the moment the envelope is tapped.
const showHint = ref(false);
let hintTimer: ReturnType<typeof setTimeout> | undefined;

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

function openEnvelope(): void {
	// Dismiss the idle hint and cancel a not-yet-fired timer so it can't pop up later.
	showHint.value = false;
	clearTimeout(hintTimer);

	if (isOpen.value) return;
	isOpen.value = true;

	const reduce = import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if (reduce) {
		gsap.set([flap.value, monoEl.value], { autoAlpha: 0 });
		gsap.set(lidEl.value, { autoAlpha: 1, rotationX: -135, y: '-100%' });
		gsap.set(formEl.value, { autoAlpha: 1, y: 0 });
		return;
	}

	gsap
		.timeline({ defaults: { ease: "power2.out" } })
		// Lift the flap to the open position, revealing the throat.
		.to(flap.value, { rotationX: 135, autoAlpha: 0, duration: 0.95 })
		.to(lidEl.value, { rotationX: -135, autoAlpha: 1, scaleY: 1.35, scaleX: 0.95, duration: 0.95 }, "<")
		// Dissolve the embossed seal as the flap lifts so it doesn't linger.
		.to(monoEl.value, { autoAlpha: 0, duration: 0.6 }, 0.35)
		// Cross-fade: the lifted flap fades out as inner lid fades in and rotates with it,
		// so the open top reads as the flap laid back.
		.to(formEl.value, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.3");
}

onMounted(() => {
	// Already unlocked (URL param resolved server-side) — hand off without the gate.
	if (isUnlocked.value) {
		emit("unlock");
		return;
	}

	withCleanup(() => {
		// Hinge the flap on its top edge (GSAP otherwise defaults to centre).
		gsap.set(flap.value, { transformOrigin: "50% 0%" });
		gsap.set(lidEl.value, { transformOrigin: "50% 0%" });

		// Set closed initial state — the timeline runs only once the user clicks.
		gsap.set(flap.value, { rotationX: 0, autoAlpha: 1 });
		gsap.set(monoEl.value, { autoAlpha: 1 });
		gsap.set(lidEl.value, { autoAlpha: 0 });
		gsap.set(formEl.value, { autoAlpha: 0, y: 12 });
	}, root.value);

	// Arm the idle nudge — only reached when the gate is genuinely locked.
	hintTimer = setTimeout(() => {
		showHint.value = true;
	}, HINT_DELAY_MS);
});

onBeforeUnmount(() => clearTimeout(hintTimer));
</script>

<template>
	<div ref="root" class="gate">
		<div class="gate__envelope" :class="{ 'gate__envelope--open': isOpen }" @click="openEnvelope">
			<!-- Static envelope body. One SVG so the gradients, the fold-crease shadow
			     and the rounded outer corners all render — SVG filter regions extend
			     past the path, unlike clip-path divs which slice drop-shadows off. -->
			<svg class="gate__body" viewBox="0 0 360 232" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
				<defs>
					<!-- Back panel: lighter top, darker base. -->
					<linearGradient id="env-back" gradientUnits="userSpaceOnUse" x1="180" y1="0" x2="180" y2="232">
						<stop offset="0" stop-color="#F2F2F2" />
						<stop offset="1" stop-color="#CCCCCC" />
					</linearGradient>
					<!-- Inner throat: recessed, darkest at the apex. -->
					<linearGradient id="env-throat" gradientUnits="userSpaceOnUse" x1="180" y1="0" x2="180" y2="121">
						<stop offset="0" stop-color="#EEEEEE" />
						<stop offset="1" stop-color="#CCCCCC" />
					</linearGradient>
					<!-- Body front V: symmetric horizontal ramp, dark edges → white centre.
					     Shared across both side faces (userSpaceOnUse, full width). -->
					<linearGradient id="env-side" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="360" y2="0">
						<stop offset="0" stop-color="#CCCCCC" />
						<stop offset="0.03" stop-color="#D9D9D9" />
						<stop offset="0.08" stop-color="#EAEAEA" />
						<stop offset="0.15" stop-color="#F6F6F6" />
						<stop offset="0.24" stop-color="#FDFDFD" />
						<stop offset="0.5" stop-color="#FFFFFF" />
						<stop offset="0.76" stop-color="#FDFDFD" />
						<stop offset="0.85" stop-color="#F6F6F6" />
						<stop offset="0.92" stop-color="#EAEAEA" />
						<stop offset="0.97" stop-color="#D9D9D9" />
						<stop offset="1" stop-color="#CCCCCC" />
					</linearGradient>
					<!-- Bottom face: dark bottom edge → bright apex. -->
					<linearGradient id="env-bottom" gradientUnits="userSpaceOnUse" x1="180" y1="232" x2="180" y2="121">
						<stop offset="0" stop-color="#CCCCCC" />
						<stop offset="0.1756" stop-color="#DDDDDD" />
						<stop offset="0.4353" stop-color="#F0F0F0" />
						<stop offset="0.7049" stop-color="#FBFBFB" />
						<stop offset="1" stop-color="#FFFFFF" />
					</linearGradient>
					<!-- Round the outer corners only; interior creases sit well inside it. -->
					<clipPath id="env-round">
						<rect x="0" y="0" width="360" height="232" rx="8" ry="8" />
					</clipPath>
					<!-- Soft fold crease cast upward from the bottom face's top edges. -->
					<filter id="env-bottom-crease" x="-20%" y="-40%" width="140%" height="180%">
						<feDropShadow dx="0" dy="-2.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.1" />
					</filter>
				</defs>
				<g clip-path="url(#env-round)">
					<rect x="0" y="0" width="360" height="232" fill="url(#env-back)" />
					<path d="M0 0 L360 0 L180 121 Z" fill="url(#env-throat)" />
					<path d="M0 0 L0 232 L180 121 Z" fill="url(#env-side)" />
					<path d="M360 0 L360 232 L180 121 Z" fill="url(#env-side)" />
					<path d="M0 232 L360 232 L180 121 Z" fill="url(#env-bottom)" filter="url(#env-bottom-crease)" />
				</g>
			</svg>

			<!-- Open lid — the laid-back flap's inner face. Cross-fades in over the
			     throat as the flap lifts away. -->
			<svg ref="lidEl" class="gate__lid" viewBox="0 0 360 232" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
				<defs>
					<!-- Brightest at the fold (apex), easing to soft grey at the top edge. -->
					<linearGradient id="env-lid" gradientUnits="userSpaceOnUse" x1="180" y1="0" x2="180" y2="132">
						<stop offset="0" stop-color="#E6E6E6" />
						<stop offset="0.4" stop-color="#F9F9F9" />
						<stop offset="1" stop-color="#FFFFFF" />
					</linearGradient>
				</defs>
				<path d="M0 0 L360 0 L180 132 Z" fill="url(#env-lid)" />
			</svg>

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

			<!-- The hinged top flap. Two SVG faces so the underside shows mid-lift; the
			     embossed GK seal sits on top and fades out as the flap rises. -->
			<div ref="flap" class="gate__flap">
				<svg class="gate__flap-face gate__flap-face--front" viewBox="0 0 360 232" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
					<defs>
						<!-- Closed-flap front: darker top edge → lighter fold. -->
						<linearGradient id="env-flap" gradientUnits="userSpaceOnUse" x1="180" y1="0" x2="180" y2="132">
							<stop offset="0" stop-color="#CCCCCC" />
							<stop offset="0.0696" stop-color="#D4D4D4" />
							<stop offset="0.2286" stop-color="#E5E5E5" />
							<stop offset="0.4174" stop-color="#EEEEEE" />
							<stop offset="0.6559" stop-color="#F2F2F2" />
							<stop offset="1" stop-color="#F2F2F2" />
						</linearGradient>
						<!-- Soft shadow the flap casts onto the body below its fold edges. -->
						<filter id="env-flap-crease" x="-20%" y="-20%" width="140%" height="180%">
							<feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.1" />
						</filter>
					</defs>
					<path d="M0 0 L360 0 L180 132 Z" fill="url(#env-flap)" filter="url(#env-flap-crease)" />
				</svg>
				<svg class="gate__flap-face gate__flap-face--back" viewBox="0 0 360 232" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
					<defs>
						<linearGradient id="env-flap-back" gradientUnits="userSpaceOnUse" x1="180" y1="0" x2="180" y2="132">
							<stop offset="0" stop-color="#F2F2F2" />
							<stop offset="1" stop-color="#CCCCCC" />
						</linearGradient>
					</defs>
					<path d="M0 0 L360 0 L180 132 Z" fill="url(#env-flap-back)" />
				</svg>
				<div ref="monoEl" class="gate__mono" aria-hidden="true">
					<EnvelopeMonogram />
				</div>
			</div>
		</div>

		<Transition name="gate-hint-fade">
			<p v-if="showHint" class="gate__hint">{{ content?.ui.gate.hint }}</p>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
.gate {
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding: max(15vh, 5rem) $space-lg $space-lg;
	background-color: $color-white;
	// The 3D flap (perspective + preserve-3d + rotateX) can project beyond the
	// gate's box on iOS Safari and feed its initial-zoom calc. Clip horizontally
	// so the gate can never widen the layout viewport, but allow vertical overflow
	// so the opened flap isn't clipped at the top.
	width: 100%;
	max-width: 100%;
	overflow-x: clip;

	&__envelope {
		position: relative;
		width: min(86vw, 30rem);
		// Matches the SVG layers' viewBox (360 × 232 ≈ Figma body ratio) so each
		// inline SVG fills the box exactly with no letterboxing.
		aspect-ratio: 360 / 232;
		perspective: 110rem;
		cursor: pointer;
		// Soft, wide ground shadow (Figma uses a low-opacity near-black ellipse).
		filter: drop-shadow(0 0.75rem 1.25rem rgba(#000100, 0.2));
		transition: transform 0.95s $ease-standard;

		&--open {
			cursor: default;
			transform: translateY(15%);
		}

		@include reduced-motion {
			transition: none;
		}
	}

	// Idle nudge shown below the envelope after a delay; fades in/out via the
	// gate-hint-fade transition. Display font echoes the invitation lettering.
	&__hint {
		margin-top: $space-md;
		font-family: $font-display;
		font-size: $font-size-lg;
		color: $color-text-muted;
		text-align: center;
	}

	// Each layer is an inline SVG filling the envelope box. `overflow: visible` lets
	// the SVG filter regions (fold-crease drop-shadows) render past the viewBox edge
	// instead of being clipped — the whole reason for moving off clip-path divs.
	&__body,
	&__lid,
	&__flap-face {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		overflow: visible;
	}

	// Static body sits behind the lid / form / flap.
	&__body {
		z-index: 1;
	}

	// Open lid — revealed + rotated into place by the opening timeline.
	&__lid {
		z-index: 3;
	}

	// ── Password form ──────────────────────────────────────────────────────────────
	&__form {
		position: absolute;
		top: 8%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-2xs;
		width: 43%;
		z-index: 4;
		opacity: 0; // revealed by the opening timeline; avoids a first-paint flash
	}

	&__input {
		width: 100%;
		min-height: 2.5rem;
		padding: $space-2xs $space-sm;
		border: none;
		border-radius: 0.125rem; // 2px, per Figma field
		background-color: $color-white;
		font-size: $font-size-sm;
		color: $color-text;
		text-align: center;
		// Neumorphic embossed field — shared Figma "Embossed" token.
		box-shadow: $shadow-embossed;

		&::placeholder {
			color: $color-text-muted;
		}

		&:focus-visible {
			outline: none;
			box-shadow: $shadow-embossed, 0 0 0 0.0625rem $color-gold;
		}
	}

	&__error {
		font-size: $font-size-xs;
		color: $color-error;
		text-align: center;
	}

	// ── Hinged flap ──────────────────────────────────────────────────────────────
	&__flap {
		position: absolute;
		inset: 0;
		transform-origin: top center;
		transform-style: preserve-3d;
		z-index: 5;
		will-change: transform;

		@include reduced-motion {
			transition: none;
		}
	}

	&__flap-face {
		backface-visibility: hidden;

		&--back {
			transform: rotateX(180deg);
		}
	}

	// Embossed GK seal on the closed flap — the SVG carries its own neumorphic
	// filter; this just positions it on the flap front.
	&__mono {
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		width: 22%;
		z-index: 1;
	}
}

// Idle hint fade — kept at top level per the SCSS convention (framework
// transition classes live outside the BEM block).
.gate-hint-fade-enter-active,
.gate-hint-fade-leave-active {
	transition: opacity $duration-base $ease-standard;

	@include reduced-motion {
		transition: none;
	}
}

.gate-hint-fade-enter-from,
.gate-hint-fade-leave-to {
	opacity: 0;
}
</style>
