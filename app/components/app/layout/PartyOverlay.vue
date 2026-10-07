<script lang="ts" setup>
// Party mode overlay (easter egg). Mounted once in app.vue so it follows guests
// from page to page. It lets every tap through to the page and draws the active
// scene on two canvases: `base` for solid shapes and `light`, screen-blended, for
// beams and glows. The dim layer darkens the page but leaves a soft spotlight over
// any [data-party-spot] element so key controls (the photo upload buttons) stay
// readable. Scenes find the GK monogram through [data-party-monogram].
import { PARTY_QUERY_PARAM } from "~/composables/use-party-mode";
import { MONOGRAM_VIEWBOX } from "~/utils/monogram";
import type { MonogramBox, PartyScene } from "~/utils/party/scene";
import { createPartyScene } from "~/utils/party/scenes";

const STILL_TIME = 8; // seconds into the show used for the reduced-motion still frame
const MAX_PIXEL_RATIO = 2;
const FADE_OUT_MS = 600; // keep in sync with the overlay's opacity transition

const { content } = useContent();
const route = useRoute();
const { isOn, startedAt, start, stop, registerKey } = usePartyMode();

const dimEl = ref<HTMLElement | null>(null);
const baseEl = ref<HTMLCanvasElement | null>(null);
const lightEl = ref<HTMLCanvasElement | null>(null);

let scene: PartyScene | null = null;
let base: CanvasRenderingContext2D | null = null;
let light: CanvasRenderingContext2D | null = null;
let motionQuery: MediaQueryList | null = null;
let raf = 0;
let fadeUntil = 0;
let fadeTimer: ReturnType<typeof setTimeout> | undefined;
let pixelRatio = 1;
let width = 0;
let height = 0;
let lastSpot = "";

const reducedMotion = (): boolean => motionQuery?.matches ?? false;

function sizeCanvases(): void {
	pixelRatio = Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio || 1);
	width = window.innerWidth;
	height = window.innerHeight;
	for (const canvas of [baseEl.value, lightEl.value]) {
		if (!canvas) continue;
		canvas.width = Math.round(width * pixelRatio);
		canvas.height = Math.round(height * pixelRatio);
	}
}

// Free the canvas memory while party mode is off.
function releaseCanvases(): void {
	for (const canvas of [baseEl.value, lightEl.value]) {
		if (canvas) canvas.width = canvas.height = 0;
	}
}

function isVisible(rect: DOMRect): boolean {
	return rect.width > 0 && rect.bottom > 0 && rect.top < height && rect.right > 0 && rect.left < width;
}

function findMonograms(): MonogramBox[] {
	const boxes: MonogramBox[] = [];
	document.querySelectorAll("[data-party-monogram]").forEach((el) => {
		const rect = el.getBoundingClientRect();
		if (isVisible(rect)) boxes.push({ x: rect.left, y: rect.top, scale: rect.width / MONOGRAM_VIEWBOX.width });
	});
	return boxes;
}

// Point the dim layer's spotlight at the first visible [data-party-spot].
function updateSpot(): void {
	const dim = dimEl.value;
	if (!dim) return;
	let spot = "";
	for (const el of document.querySelectorAll("[data-party-spot]")) {
		const rect = el.getBoundingClientRect();
		if (!isVisible(rect)) continue;
		const x = Math.round(rect.left + rect.width / 2);
		const y = Math.round(rect.top + rect.height / 2);
		const rx = Math.round(rect.width * 0.8 + 24);
		const ry = Math.round(rect.height * 0.9 + 32);
		spot = `${x},${y},${rx},${ry}`;
		if (spot !== lastSpot) {
			dim.style.setProperty("--spot-x", `${x}px`);
			dim.style.setProperty("--spot-y", `${y}px`);
			dim.style.setProperty("--spot-rx", `${rx}px`);
			dim.style.setProperty("--spot-ry", `${ry}px`);
		}
		break;
	}
	if (spot !== lastSpot) dim.classList.toggle("party-overlay__dim--spot", spot !== "");
	lastSpot = spot;
}

function render(now: number): void {
	if (!base || !light || !scene) return;
	const still = reducedMotion();
	for (const ctx of [base, light]) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalCompositeOperation = "source-over";
		ctx.globalAlpha = 1;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	}
	if (!isOn.value && now >= fadeUntil) return;
	updateSpot();
	scene.draw({
		base,
		light,
		width,
		height,
		time: still ? STILL_TIME : now / 1000,
		elapsed: still ? STILL_TIME : (now - startedAt.value) / 1000,
		monograms: findMonograms(),
		reducedMotion: still,
	});
}

function isAnimating(now: number): boolean {
	return !reducedMotion() && !document.hidden && (isOn.value || now < fadeUntil);
}

function frame(now: number): void {
	raf = 0;
	render(now);
	if (isAnimating(now)) raf = requestAnimationFrame(frame);
	else if (!isOn.value && now >= fadeUntil) releaseCanvases();
}

function requestFrame(): void {
	if (!raf && (isOn.value || performance.now() < fadeUntil + 100)) raf = requestAnimationFrame(frame);
}

// Fade the dim layer in over the scene's intro duration.
function playDim(): void {
	const dim = dimEl.value;
	if (!dim || !scene) return;
	const { color, opacity, duration } = scene.dim;
	dim.style.background = color;
	dim.style.transition = "none";
	dim.style.opacity = "0";
	void dim.offsetWidth;
	dim.style.transition = reducedMotion() ? "none" : `opacity ${duration}s ease`;
	dim.style.opacity = String(opacity);
}

function begin(): void {
	clearTimeout(fadeTimer);
	fadeUntil = 0;
	lastSpot = "";
	sizeCanvases();
	playDim();
	requestFrame();
}

function end(): void {
	fadeUntil = performance.now() + FADE_OUT_MS;
	requestFrame();
	// Reduced motion draws no loop, so clear the still frame once the fade is done.
	fadeTimer = setTimeout(requestFrame, FADE_OUT_MS + 50);
}

function onResize(): void {
	if (!isOn.value) return;
	sizeCanvases();
	requestFrame();
}

// Keep the still frame lined up with the monogram while scrolling.
function onScroll(): void {
	if (reducedMotion()) requestFrame();
}

function onKeydown(event: KeyboardEvent): void {
	if (event.ctrlKey || event.metaKey || event.altKey) return;
	const target = event.target as HTMLElement | null;
	if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
	registerKey(event.key);
}

function onPointerDown(event: PointerEvent): void {
	if (isOn.value) scene?.onPointer?.(event.clientX, event.clientY, performance.now() / 1000);
}

watch(isOn, (on) => (on ? begin() : end()));
watch(startedAt, () => {
	if (isOn.value) playDim();
});

onMounted(() => {
	scene = createPartyScene();
	base = baseEl.value?.getContext("2d") ?? null;
	light = lightEl.value?.getContext("2d") ?? null;
	motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	motionQuery.addEventListener("change", requestFrame);
	window.addEventListener("resize", onResize);
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("keydown", onKeydown);
	window.addEventListener("pointerdown", onPointerDown, { passive: true });
	document.addEventListener("visibilitychange", requestFrame);

	if (PARTY_QUERY_PARAM in route.query) start();
	else if (isOn.value) begin();
});

onBeforeUnmount(() => {
	cancelAnimationFrame(raf);
	clearTimeout(fadeTimer);
	motionQuery?.removeEventListener("change", requestFrame);
	window.removeEventListener("resize", onResize);
	window.removeEventListener("scroll", onScroll);
	window.removeEventListener("keydown", onKeydown);
	window.removeEventListener("pointerdown", onPointerDown);
	document.removeEventListener("visibilitychange", requestFrame);
});
</script>

<template>
	<div class="party-overlay" :class="{ 'party-overlay--on': isOn }">
		<div ref="dimEl" class="party-overlay__dim" />
		<canvas ref="baseEl" class="party-overlay__canvas" aria-hidden="true" />
		<canvas ref="lightEl" class="party-overlay__canvas party-overlay__canvas--light" aria-hidden="true" />
		<button
			v-if="isOn"
			class="party-overlay__stop"
			type="button"
			:aria-label="content?.ui.partyMode.stopLabel"
			@click="stop"
		>
			<span class="party-overlay__beat" />
			<span>{{ content?.ui.partyMode.label }}</span>
			<span class="party-overlay__stop-chip">{{ content?.ui.partyMode.stop }}</span>
		</button>
	</div>
</template>

<style scoped lang="scss">
// Soft hole in the dim layer over the [data-party-spot] element; 20% of the dim
// stays so it still reads as part of the room. Position set from script.
$party-spot-mask: radial-gradient(
	var(--spot-rx) var(--spot-ry) at var(--spot-x) var(--spot-y),
	rgba(#000000, 0.2) 62%,
	#000000 100%
);

.party-overlay {
	position: fixed;
	inset: 0;
	z-index: $z-party;
	pointer-events: none;
	opacity: 0;
	visibility: hidden;
	transition:
		opacity 0.6s $ease-standard,
		visibility 0s linear 0.6s;

	&--on {
		opacity: 1;
		visibility: visible;
		transition: opacity $duration-fast $ease-standard;
	}

	&__dim {
		position: absolute;
		inset: 0;
		opacity: 0;

		&--spot {
			-webkit-mask-image: $party-spot-mask;
			mask-image: $party-spot-mask;
		}
	}

	&__canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;

		&--light {
			mix-blend-mode: screen;
		}
	}

	&__stop {
		position: absolute;
		left: 50%;
		bottom: calc(#{$space-md} + env(safe-area-inset-bottom, 0rem));
		display: flex;
		align-items: center;
		gap: $space-xs;
		padding: $space-2xs $space-2xs $space-2xs $space-sm;
		border: 1px solid rgba($color-light-gold-1, 0.25);
		border-radius: $radius-pill;
		background: rgba(#000000, 0.6);
		-webkit-backdrop-filter: blur(0.5rem);
		backdrop-filter: blur(0.5rem);
		color: $color-light-gold-2;
		font-size: $font-size-sm;
		font-weight: $font-weight-regular;
		white-space: nowrap;
		pointer-events: auto;
		transform: translateX(-50%);
	}

	&__beat {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: $color-gold;
		box-shadow: 0 0 0.6rem $color-gold;
		animation: party-beat 0.58s ease-out infinite;
	}

	&__stop-chip {
		padding: $space-3xs $space-xs;
		border-radius: $radius-pill;
		background: $color-light-gold-2;
		color: $color-black;
		font-weight: $font-weight-medium;
	}
}

@keyframes party-beat {
	from {
		opacity: 1;
	}

	to {
		opacity: 0.35;
	}
}
</style>
