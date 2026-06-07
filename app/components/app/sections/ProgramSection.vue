<script lang="ts" setup>
// Program timeline (Story 2): Friday / Saturday / Sunday tabs. Each timeline item
// has a time, icon, and description, connected by a line. Tab content animates in
// from alternating directions (wired via use-reveal per item later).
const { content } = useContent();

const activeIndex = ref(0);

const days = computed(() => content.value?.program ?? []);
const activeDay = computed(() => days.value[activeIndex.value] ?? null);

function selectDay(index: number): void {
	activeIndex.value = index;
}
</script>

<template>
	<section class="program u-content">
		<h2 class="program__heading u-heading">The program</h2>

		<div class="program__tabs" role="tablist">
			<button
				v-for="(day, index) in days"
				:key="day.label"
				class="program__tab"
				:class="{ 'program__tab--active': index === activeIndex }"
				role="tab"
				:aria-selected="index === activeIndex"
				@click="selectDay(index)"
			>
				{{ day.label }}
			</button>
		</div>

		<ol v-if="activeDay" class="program__timeline">
			<li v-for="(item, i) in activeDay.items" :key="i" class="program__item">
				<span class="program__time">{{ item.time }}</span>
				<span class="program__icon" aria-hidden="true" />
				<p class="program__desc">{{ item.description }}</p>
			</li>
		</ol>
	</section>
</template>

<style scoped lang="scss">
.program {
	padding-block: $space-xl;
}

.program__heading {
	margin-bottom: $space-md;
	font-size: $font-size-xl;
	text-align: center;
}

.program__tabs {
	display: flex;
	justify-content: center;
	gap: $space-md;
	margin-bottom: $space-lg;
}

.program__tab {
	padding-bottom: $space-3xs;
	font-size: $font-size-base;
	color: $color-text-muted;
	border-bottom: 2px solid transparent;

	&--active {
		color: $color-text;
		border-bottom-color: $color-gold;
	}
}

.program__timeline {
	display: flex;
	flex-direction: column;
	gap: $space-lg;
}

.program__item {
	display: grid;
	grid-template-columns: auto 1.5rem 1fr;
	align-items: center;
	gap: $space-sm;
}

.program__time {
	font-family: $font-display;
	font-size: $font-size-lg;
}

.program__icon {
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	background-color: $color-gold;
}

.program__desc {
	font-size: $font-size-sm;
	color: $color-text-muted;
}
</style>
