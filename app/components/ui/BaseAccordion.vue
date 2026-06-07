<script lang="ts" setup>
// Single collapsible item. Used for the venue/area sections and FAQ list (Story 2).
const props = withDefaults(defineProps<{ title: string; open?: boolean; }>(), {
	open: false,
});

const isOpen = ref(props.open);

function toggle(): void {
	isOpen.value = !isOpen.value;
}
</script>

<template>
	<div class="base-accordion" :class="{ 'base-accordion--open': isOpen }">
		<button class="base-accordion__header" :aria-expanded="isOpen" @click="toggle">
			<span class="base-accordion__title">{{ props.title }}</span>
			<span class="base-accordion__caret" aria-hidden="true">⌄</span>
		</button>
		<Transition name="accordion">
			<div v-show="isOpen" class="base-accordion__body">
				<slot />
			</div>
		</Transition>
	</div>
</template>

<style scoped lang="scss">
.base-accordion {
	border-bottom: 1px solid $color-border;
}

.base-accordion__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: $space-sm 0;
	text-align: left;
	font-size: $font-size-base;
	color: $color-text;
}

.base-accordion__caret {
	transition: transform $duration-fast $ease-standard;

	.base-accordion--open & {
		transform: rotate(180deg);
	}
}

.base-accordion__body {
	padding-bottom: $space-sm;
	color: $color-text-muted;
	font-size: $font-size-sm;
}
</style>
