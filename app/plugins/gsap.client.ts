import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registers GSAP + ScrollTrigger once on the client and exposes them app-wide.
// Access via `const { $gsap, $ScrollTrigger } = useNuxtApp()` or the
// `use-gsap` composable. Client-only — GSAP touches the DOM.
export default defineNuxtPlugin(() => {
	gsap.registerPlugin(ScrollTrigger);

	return {
		provide: {
			gsap,
			ScrollTrigger,
		},
	};
});
