// Take scroll positioning into our own hands. iOS Safari otherwise restores a
// stale scroll offset on reload/back-forward — and because the landing page
// swaps the gate for the (much taller) content via `v-if` rather than a route
// change, the browser can land mid-page. `manual` means nothing scrolls unless
// we ask it to (router scrollBehavior + the gate-unlock reset in index.vue).
export default defineNuxtPlugin(() => {
	if (import.meta.client && "scrollRestoration" in window.history) {
		window.history.scrollRestoration = "manual";
	}
});
