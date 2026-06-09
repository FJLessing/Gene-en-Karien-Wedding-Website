<script lang="ts" setup>
const { content } = useContent();
const { gsap, withCleanup } = useGsap();

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

const units = computed(() => [
	{ label: "days", value: remaining.value.days },
	{ label: "hours", value: remaining.value.hours },
	{ label: "minutes", value: remaining.value.minutes },
]);

const digitRefs = ref<(HTMLElement | null)[]>([]);

function setDigitRef(el: HTMLElement | null, index: number): void {
	digitRefs.value[index] = el;
}

const prevValues = ref<number[]>([]);

function rollDigit(index: number, incoming: string): void {
	const container = digitRefs.value[index];
	if (!container) return;

	const current = container.querySelector<HTMLElement>(".countdown__digit--current");
	const next = container.querySelector<HTMLElement>(".countdown__digit--next");
	if (!current || !next) return;

	next.textContent = incoming;

	gsap.killTweensOf([current, next]);
	gsap.set(next, { y: "100%", opacity: 1 });

	withCleanup(() => {
		const tl = gsap.timeline();
		tl.to(current, { y: "-100%", duration: 0.35, ease: "power2.in" }, 0)
			.to(next, { y: "0%", duration: 0.35, ease: "power2.out" }, 0)
			.add(() => {
				current.textContent = incoming;
				gsap.set(current, { y: "0%", opacity: 1 });
				gsap.set(next, { y: "100%", opacity: 0 });
			});
	});
}

watch(
	units,
	(newUnits, oldUnits) => {
		if (!oldUnits) return;
		newUnits.forEach((unit, i) => {
			const formatted = String(unit.value).padStart(2, "0");
			const oldVal = oldUnits[i]?.value;
			if (oldVal !== undefined && oldVal !== unit.value) {
				rollDigit(i, formatted);
			}
		});
	},
	{ deep: true },
);

onMounted(() => {
	computeRemaining();
	timer = setInterval(computeRemaining, 1000);

	units.value.forEach((unit, i) => {
		const formatted = String(unit.value).padStart(2, "0");
		prevValues.value[i] = unit.value;
		const container = digitRefs.value[i];
		if (!container) return;
		const current = container.querySelector<HTMLElement>(".countdown__digit--current");
		if (current) current.textContent = formatted;
	});
});

onBeforeUnmount(() => {
	if (timer) clearInterval(timer);
});
</script>

<template>
	<section class="countdown" aria-label="Countdown to the wedding">
		<div class="countdown__row">
			<div v-for="(unit, index) in units" :key="unit.label" class="countdown__unit">
				<div
					:ref="(el) => setDigitRef(el as HTMLElement | null, index)"
					class="countdown__digit-track"
					aria-live="polite"
					:aria-label="`${String(unit.value).padStart(2, '0')} ${unit.label}`"
				>
					<span class="countdown__digit countdown__digit--current">{{ String(unit.value).padStart(2, "0") }}</span>
					<span class="countdown__digit countdown__digit--next" aria-hidden="true" />
				</div>
				<span class="countdown__label">{{ unit.label }}</span>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.countdown {
	padding-block: $space-xl;
}

.countdown__row {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	gap: $space-md;
}

.countdown__unit {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $space-3xs;
}

.countdown__digit-track {
	position: relative;
	overflow: hidden;
	height: 1.2em;
	line-height: 1;
}

.countdown__digit {
	display: block;
	font-family: $font-display;
	font-size: $font-size-2xl;
	line-height: 1;

	&--next {
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		transform: translateY(100%);
		opacity: 0;
	}
}

.countdown__label {
	font-size: $font-size-xs;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: $color-text-muted;
}
</style>
