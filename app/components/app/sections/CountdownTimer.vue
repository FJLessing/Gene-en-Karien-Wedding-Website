<script lang="ts" setup>
// Custom countdown (Story 2). Replaces vue-countdown with a bespoke vertical-roll
// animation (per the Dribbble/Framer references). This is the boilerplate shell:
// it computes the time remaining from content.event.startsAt and exposes the
// digit values; the GSAP roll transition is layered on later.
const { content } = useContent();

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

onMounted(() => {
	computeRemaining();
	timer = setInterval(computeRemaining, 1000);
});

onBeforeUnmount(() => {
	if (timer) clearInterval(timer);
});
</script>

<template>
	<section class="countdown" aria-label="Countdown to the wedding">
		<div class="countdown__row">
			<div v-for="unit in units" :key="unit.label" class="countdown__unit">
				<span class="countdown__value">{{ String(unit.value).padStart(2, "0") }}</span>
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

.countdown__value {
	font-family: $font-display;
	font-size: $font-size-2xl;
	line-height: 1;
	// Roll animation will mask/translate this digit column.
	overflow: hidden;
}

.countdown__label {
	font-size: $font-size-xs;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: $color-text-muted;
}
</style>
