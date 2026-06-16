<script lang="ts" setup>
// Countdown to the ceremony (per the Dribbble roll reference; digits flip in
// from below per the designer's note). Each digit is its own masked column:
// Vue owns the text content, GSAP owns the transforms — they never touch the
// same thing, so ticks can't desync the DOM.
const { content } = useContent();
const { gsap } = useGsap();

interface TimeParts {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

const remaining = ref<TimeParts>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timer: ReturnType<typeof setInterval> | null = null;

function computeRemaining(): void {
	const iso = content.value?.event.startsAt;
	if (!iso) return;

	const target = new Date(iso).getTime();
	const now = Date.now();
	const diff = Math.max(0, target - now);

	const totalSeconds = Math.floor(diff / 1000);
	remaining.value = {
		days: Math.floor(totalSeconds / 86400),
		hours: Math.floor((totalSeconds % 86400) / 3600),
		minutes: Math.floor((totalSeconds % 3600) / 60),
		seconds: totalSeconds % 60,
	};
}

// Stable keys for refs/iteration; display labels come from content (localised).
const unitKeys = ["days", "hours", "minutes", "seconds"];
const labels = computed(() => {
	const cd = content.value?.ui.countdown;
	return [cd?.days ?? "", cd?.hours ?? "", cd?.minutes ?? "", cd?.seconds ?? ""];
});

const unitStrings = computed(() => [
	String(remaining.value.days).padStart(2, "0"),
	String(remaining.value.hours).padStart(2, "0"),
	String(remaining.value.minutes).padStart(2, "0"),
	String(remaining.value.seconds).padStart(2, "0"),
]);

// One cell per digit column. `shown` is the resting digit; `incoming` is the
// digit rolling in from below while a tween is in flight.
interface DigitCell {
	shown: string;
	incoming: string;
}

const digitCells = ref<DigitCell[][]>([]);

const root = ref<HTMLElement | null>(null);
const trackRefs = new Map<string, HTMLElement>();

function setTrackRef(el: Element | null, unitIndex: number, digitIndex: number): void {
	const key = `${unitIndex}:${digitIndex}`;
	if (el instanceof HTMLElement) trackRefs.set(key, el);
	else trackRefs.delete(key);
}

function rollDigit(unitIndex: number, digitIndex: number, cell: DigitCell): void {
	const track = trackRefs.get(`${unitIndex}:${digitIndex}`);
	const current = track?.querySelector<HTMLElement>(".countdown__digit--current");
	const next = track?.querySelector<HTMLElement>(".countdown__digit--next");
	if (!current || !next) {
		cell.shown = cell.incoming;
		return;
	}

	gsap.killTweensOf([current, next]);
	gsap.set(next, { y: "100%" });

	gsap.timeline({
		onComplete: () => {
			// Let Vue patch the current span's text to the new digit before the
			// transforms swap back, so the change is never visible.
			cell.shown = cell.incoming;
			nextTick(() => {
				gsap.set(current, { y: "0%", opacity: 1 });
				gsap.set(next, { y: "100%", opacity: 1 });
			});
		},
	})
	.to(current, { y: "-100%", opacity: 0, duration: 1, ease: "power2.out" }, 0)
	.to(next, { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }, 0);
}

watch(
	unitStrings,
	(strings) => {
		strings.forEach((str, unitIndex) => {
			const cells = digitCells.value[unitIndex];
			// First render or digit-count change (e.g. 100 → 99 days): rebuild
			// the columns without animating.
			if (!cells || cells.length !== str.length) {
				digitCells.value[unitIndex] = str.split("").map((char) => ({ shown: char, incoming: char }));
				return;
			}
			str.split("").forEach((char, digitIndex) => {
				const cell = cells[digitIndex];
				if (!cell || cell.incoming === char) return;
				cell.incoming = char;
				rollDigit(unitIndex, digitIndex, cell);
			});
		});
	},
	{ immediate: true },
);

onMounted(() => {
	computeRemaining();
	timer = setInterval(computeRemaining, 1000);
});

onBeforeUnmount(() => {
	if (timer) clearInterval(timer);
	if (root.value) gsap.killTweensOf(root.value.querySelectorAll(".countdown__digit"));
});
</script>

<template>
	<section ref="root" class="countdown" :aria-label="content?.ui.countdown.ariaLabel">
		<div class="countdown__row">
			<div v-for="(cells, unitIndex) in digitCells" :key="unitKeys[unitIndex]" class="countdown__unit">
				<div
					class="countdown__digits"
					aria-live="polite"
					:aria-label="`${unitStrings[unitIndex]} ${labels[unitIndex]}`"
				>
					<div
						v-for="(cell, digitIndex) in cells"
						:key="digitIndex"
						:ref="(el) => setTrackRef(el as Element | null, unitIndex, digitIndex)"
						class="countdown__digit-track"
						aria-hidden="true"
					>
						<span class="countdown__digit countdown__digit--current">{{ cell.shown }}</span>
						<span class="countdown__digit countdown__digit--next">{{ cell.incoming }}</span>
					</div>
				</div>
				<span class="countdown__label">{{ labels[unitIndex] }}</span>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.countdown {
	padding-block: $space-4xl;
}

.countdown__row {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	gap: $space-md;
}

.countdown__unit {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $space-3xs;

	&:not(:last-child) {
		&::after {
			content: " ";
			background: $color-black;
			position: absolute;
			right: - $space-md * 0.5;
			top: $font-size-2xl * 0.5;
			transform: translateY(-50%);
			height: 40%;
			border: .75px solid $color-border;
			width: .5px;
		}
	}
}

.countdown__digits {
	display: flex;
	font-family: $font-display;
	font-size: $font-size-2xl;
	font-variant-numeric: tabular-nums;
	line-height: 1;
}

// The mask: sized in the digits' own font-size so nothing gets clipped.
.countdown__digit-track {
	position: relative;
	overflow: hidden;
	width: 1ch;
	height: 1em;
	text-align: center;
}

.countdown__digit {
	display: block;
	height: 100%;

	&--next {
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		width: 100%;
		transform: translateY(100%);
	}
}

.countdown__label {
	font-size: $font-size-xs;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: $color-text-muted;
}
</style>
