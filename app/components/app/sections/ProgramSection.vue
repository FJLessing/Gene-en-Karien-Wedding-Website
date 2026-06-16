<script lang="ts" setup>
const { content } = useContent();
const { gsap, ScrollTrigger, withCleanup } = useGsap();

const activeIndex = ref(1);

const days = computed(() => content.value?.program ?? []);
const activeDay = computed(() => days.value[activeIndex.value] ?? null);

const listRef = ref<HTMLElement | null>(null);

function selectDay(index: number): void {
	activeIndex.value = index;
}

function revealItems(): void {
	const list = listRef.value;
	if (!list) return;

	const items = Array.from(list.querySelectorAll<HTMLElement>(".program__item"));
	if (!items.length) return;

	gsap.killTweensOf(items);
	ScrollTrigger.getAll()
		.filter((t) => items.includes(t.trigger as HTMLElement))
		.forEach((t) => t.kill());

	items.forEach((item, i) => {
		const fromLeft = i % 2 === 0;
		gsap.fromTo(
			item,
			{ opacity: 0, x: fromLeft ? "-2rem" : "2rem" },
			{
				opacity: 1,
				x: "0rem",
				duration: 1.6,
				ease: "power2.out",
				scrollTrigger: {
					trigger: item,
					start: "top 85%",
				},
			},
		);
	});
}

watch(
	activeIndex,
	() => {
		nextTick(() => {
			withCleanup(() => {
				revealItems();
			}, listRef.value);
		});
	},
);

onMounted(() => {
	nextTick(() => {
		withCleanup(() => {
			revealItems();
		}, listRef.value);
	});
});
</script>

<template>
	<section class="program u-content">
		<h2 class="program__heading u-heading">{{ content?.ui.program.heading }}</h2>

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

		<ol v-if="activeDay" ref="listRef" class="program__timeline">
			<li v-for="(item, i) in activeDay.items" :key="i" class="program__item">
				<span class="program__time">{{ item.time }}</span>
				<div class="program__icon" aria-hidden="true">
					<img :src="'/img/icons/' + item.icon + '.svg'" :alt="item.icon" />
				</div>
				<span class="program__desc">{{ item.description }}</span>
			</li>
		</ol>
	</section>
</template>

<style scoped lang="scss">
.program {
	padding-block: $space-xl;

	&__heading {
		font-family: $font-body;
		margin-bottom: $space-lg;
		text-align: center;
		text-transform: uppercase;
	}

	&__tabs {
		display: flex;
		justify-content: stretch;
		gap: $space-3xs;
		margin-bottom: $space-lg;
	}

	&__tab {
		flex: 1 1 33%;
		padding-bottom: $space-3xs;
		font-size: $font-size-lg;
		font-family: $font-display;
		color: $color-text-muted;
		border-bottom: 2px solid transparent;

		transition: color .2s, border .2s ease-out;

		&--active {
			color: $color-text;
			border-bottom-color: $color-gold;
		}

		&:hover {
			color: $color-text;
			border-bottom-color: $color-light-gold-1;
		}
	}

	&__timeline {
		display: flex;
		flex-direction: column;
		gap: $space-2xl;
	}

	&__item {
		position: relative;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 0;
		margin-bottom: $space-xl;

		&:first-child {
			margin-top: $space-sm;
		}

		&:nth-child(odd) {
			flex-direction: row-reverse;

			.program__desc {
				text-align: right;
			}
		}

		&:nth-child(even) {
			.program__time {
				text-align: right;
			}
		}

		&:not(:last-child)::after {
			content: ' ';
			position: absolute;
			height: $space-lg;
			width: 1px;
			background: $color-light-gold-1;
			top: calc(100% + $space-md);
		}
	}

	&__time {
		font-family: $font-display;
		font-size: $font-size-2xl;
		flex: 0 0 38%;
	}

	&__icon {
		flex: 0 0 24%;

		img {
			display: block;
			margin: auto;
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
		}
	}

	&__desc {
		font-size: $font-size-sm;
		color: $color-text-muted;
		flex: 0 0 38%;
	}
}
</style>
