import type { gsap as GsapType } from "gsap";

// Access the registered GSAP instance plus a scoped context that auto-cleans on
// unmount. Usage:
//
//   const { gsap, withCleanup } = useGsap();
//   onMounted(() => withCleanup((ctx) => {
//     gsap.from(".hero", { y: 40, opacity: 0, duration: 0.8 });
//   }, scopeEl.value));
//
// All tweens created inside `withCleanup` are reverted automatically when the
// component unmounts, preventing leaks and orphaned ScrollTriggers.
export function useGsap() {
	const { $gsap, $ScrollTrigger } = useNuxtApp();
	const gsap = $gsap as typeof GsapType;

	function withCleanup(fn: (ctx: gsap.Context) => void, scope?: Element | null): void {
		const ctx = gsap.context(fn, scope ?? undefined);
		onBeforeUnmount(() => ctx.revert());
	}

	return { gsap, ScrollTrigger: $ScrollTrigger, withCleanup };
}
