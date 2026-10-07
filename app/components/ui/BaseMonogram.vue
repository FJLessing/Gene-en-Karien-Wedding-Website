<script lang="ts" setup>
// Decorative "GK" monogram glyph (Figma node 32:659). Uses the designer's exact
// neumorphic "Embossed" filter — two outer drop-shadows (white top-left highlight,
// dark bottom-right) PLUS two inner shadows that carve the bevel into the glyph.
// That inner-shadow pair is what makes it read as embossed rather than a flat shape
// with a drop shadow, so the SVG <filter> is kept intact rather than reproduced in
// CSS (CSS drop-shadow cannot do inner shadows on a glyph).
//
// The filter lives in the viewBox's coordinate space, so the whole emboss scales
// proportionally with `size` — a larger mark gets a proportionally larger bevel,
// which is the intended "scale with size" behaviour.
//
// The hardcoded export id `filter0_ddii_32_659` is replaced with a per-instance
// `useId()` value, bound to both the <filter> and its url(#…) reference, so several
// monograms on one page don't collide (duplicate ids would break later instances).
//
// Built-in animation is a scroll-reveal entrance (reuses useReveal, which already
// respects prefers-reduced-motion). For custom motion, a parent can grab the
// exposed `root` element and drive its own GSAP tweens, e.g.:
//
//   const mono = ref<InstanceType<typeof BaseMonogram> | null>(null);
//   const { gsap, withCleanup } = useGsap();
//   onMounted(() => withCleanup(() => {
//     gsap.to(mono.value!.root, { y: -6, repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut" });
//   }));
import type { RevealDirection } from "~/composables/use-reveal";
import { MONOGRAM_PATH } from "~/utils/monogram";

const props = withDefaults(
	defineProps<{
		size?: number; // rendered width in px; height scales via the 107×70 viewBox
		animate?: boolean; // run the built-in scroll-reveal entrance
		revealDirection?: RevealDirection;
		delay?: number; // reveal delay in seconds
	}>(),
	{
		size: 107,
		animate: true,
		revealDirection: "up",
		delay: 0,
	},
);

// SSR-stable, unique per instance — keeps the emboss filter from colliding when
// the monogram is rendered more than once on a page.
const uid = useId();
const filterId = `monogram-emboss-${uid}`;

const root = ref<HTMLElement | null>(null);

if (props.animate) {
	useReveal(root, { direction: props.revealDirection, delay: props.delay });
}

// Party mode easter egg: five quick taps on any monogram start it. Each tap gives
// a small bounce so guests feel something is counting. `data-party-monogram` on
// the <svg> lets the overlay find the glyph to redraw it.
const svg = ref<SVGSVGElement | null>(null);
const { registerTap } = usePartyMode();
const { gsap, withCleanup } = useGsap();
let bump: gsap.core.Tween | null = null;

onMounted(() =>
	withCleanup(() => {
		bump = gsap.fromTo(
			svg.value,
			{ scale: 0.92 },
			{ scale: 1, duration: 0.35, ease: "back.out(3)", paused: true, immediateRender: false, transformOrigin: "50% 50%" },
		);
	}),
);

function onTap(): void {
	registerTap();
	bump?.restart();
}

defineExpose({ root });
</script>

<template>
	<span ref="root" class="base-monogram" @click="onTap">
		<svg
			ref="svg"
			:width="props.size"
			viewBox="0 0 107 70"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			data-party-monogram
		>
			<g :filter="`url(#${filterId})`">
				<path
					:d="MONOGRAM_PATH"
					fill="#EFEFEF"
				/>
			</g>
			<defs>
				<filter
					:id="filterId"
					x="0"
					y="0"
					width="107"
					height="69.0312"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="1" dy="1" />
					<feGaussianBlur stdDeviation="1" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_32_659" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="-1" dy="-1" />
					<feGaussianBlur stdDeviation="1" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0" />
					<feBlend mode="normal" in2="effect1_dropShadow_32_659" result="effect2_dropShadow_32_659" />
					<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_32_659" result="shape" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="-1" dy="-1" />
					<feGaussianBlur stdDeviation="1" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
					<feBlend mode="normal" in2="shape" result="effect3_innerShadow_32_659" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="1" dy="1" />
					<feGaussianBlur stdDeviation="1" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.742695 0 0 0 0 0.742695 0 0 0 0 0.742695 0 0 0 0.5 0"
					/>
					<feBlend mode="normal" in2="effect3_innerShadow_32_659" result="effect4_innerShadow_32_659" />
				</filter>
			</defs>
		</svg>
	</span>
</template>

<style scoped lang="scss">
.base-monogram {
	display: inline-flex;
	line-height: 0; // strip inline-element descender gap
	touch-action: manipulation; // no double-tap zoom while tapping for party mode
	-webkit-tap-highlight-color: transparent;

	svg {
		width: 100%;
		height: auto;
		display: block;
	}
}
</style>
