// Scroll-reveal helper (Story 2). Attaches a ScrollTrigger-driven entrance tween
// to an element ref. Directions vary so the program timeline can fade content in
// from different sides. Respects prefers-reduced-motion via the global reset and
// an explicit guard here.
export type RevealDirection = "up" | "down" | "left" | "right" | "fade";

interface RevealOptions {
	direction?: RevealDirection;
	distance?: number; // in rem
	duration?: number;
	delay?: number;
	start?: string; // ScrollTrigger start, e.g. "top 80%"
}

export function useReveal(target: Ref<HTMLElement | null>, options: RevealOptions = {}) {
	const { gsap } = useGsap();

	const { direction = "up", distance = 1.5, duration = 0.8, delay = 0, start = "top 85%" } = options;

	function offsetFor(dir: RevealDirection): { x?: number; y?: number } {
		const px = distance * 16; // rem → px for GSAP transforms
		switch (dir) {
			case "up":
				return { y: px };
			case "down":
				return { y: -px };
			case "left":
				return { x: px };
			case "right":
				return { x: -px };
			case "fade":
			default:
				return {};
		}
	}

	onMounted(() => {
		const el = target.value;
		if (!el) return;

		const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (prefersReduced) {
			gsap.set(el, { opacity: 1, clearProps: "transform" });
			return;
		}

		const ctx = gsap.context(() => {
			gsap.from(el, {
				opacity: 0,
				...offsetFor(direction),
				duration,
				delay,
				ease: "power2.out",
				scrollTrigger: { trigger: el, start },
			});
		}, el);

		onBeforeUnmount(() => ctx.revert());
	});
}
