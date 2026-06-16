<script lang="ts" setup>
// Decorative scroll-down indicator — a vertical line. Height is
// configurable; defaults to 5vh like the original hero scroll cue.
const props = withDefaults(defineProps<{ height?: string }>(), { height: "5vh" });
const root = ref<HTMLElement | null>(null);

defineExpose({ root });
</script>

<template>
	<span ref="root" class="decorator-line" aria-hidden="true">
		<svg xmlns="http://www.w3.org/2000/svg" width="1" height="29" viewBox="0 0 1 29" fill="none" :style="{ height: props.height }">
			<path d="M0.6875 28.5C0.5625 28.5 0.4375 28.5 0.3125 28.5C0.270833 28.025 0.233333 27.55 0.2 27.075C0.0666667 25.175 0 23.275 0 21.375C0 14.725 0.0907407 8.075 0.272222 1.425C0.285185 0.950003 0.298611 0.475002 0.3125 0C0.4375 0 0.5625 0 0.6875 0C0.701389 0.475002 0.714815 0.950003 0.727778 1.425C0.909259 8.075 1 14.725 1 21.375C1 23.275 0.933333 25.175 0.8 27.075C0.766667 27.55 0.729167 28.025 0.6875 28.5Z" fill="#CBCBCB"/>
		</svg>
	</span>
</template>

<style scoped lang="scss">
.decorator-line {
	display: inline-flex;
	line-height: 0;

	svg {
		display: block;
		width: auto;
	}
}
</style>
