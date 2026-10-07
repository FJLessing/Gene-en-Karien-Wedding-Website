// Party mode easter egg: shared on/off state plus the ways in. Guests tap the GK
// monogram five times, type "party" on a keyboard, or open a link with ?party.
// PartyOverlay.vue (mounted once in app.vue) reads this state and draws the show.
const TAPS_TO_START = 5;
const TAP_GAP_MS = 1600; // taps further apart than this start the count again
const AUTO_OFF_MS = 5 * 60 * 1000; // switch off by itself so no phone stays stuck in it
const KEYWORD = "party";

export const PARTY_QUERY_PARAM = "party";

// Client-only bookkeeping, touched from event handlers only, so it doesn't need
// useState / SSR hydration.
let taps = 0;
let tapTimer: ReturnType<typeof setTimeout> | undefined;
let autoOffTimer: ReturnType<typeof setTimeout> | undefined;
let typed = "";

export function usePartyMode() {
	const isOn = useState<boolean>("party-mode-on", () => false);
	// performance.now() at start; restarting while on replays the intro.
	const startedAt = useState<number>("party-mode-started-at", () => 0);

	function start(): void {
		isOn.value = true;
		startedAt.value = performance.now();
		clearTimeout(autoOffTimer);
		autoOffTimer = setTimeout(stop, AUTO_OFF_MS);
	}

	function stop(): void {
		isOn.value = false;
		clearTimeout(autoOffTimer);
	}

	function registerTap(): void {
		taps += 1;
		clearTimeout(tapTimer);
		if (taps >= TAPS_TO_START) {
			taps = 0;
			start();
			return;
		}
		tapTimer = setTimeout(() => {
			taps = 0;
		}, TAP_GAP_MS);
	}

	function registerKey(key: string): void {
		if (key.length !== 1) return;
		typed = (typed + key.toLowerCase()).slice(-KEYWORD.length);
		if (typed === KEYWORD) {
			typed = "";
			start();
		}
	}

	return { isOn, startedAt, start, stop, registerTap, registerKey };
}
