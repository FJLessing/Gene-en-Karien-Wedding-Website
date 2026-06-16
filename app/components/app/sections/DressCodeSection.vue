<script lang="ts" setup>
// Dress code (Story 2). Includes a swatch strip placeholder for the colour scheme.
const { content } = useContent();
const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "up" });
</script>

<template>
	<section ref="root" class="dress-code u-content">
		<h2 class="dress-code__heading u-heading">{{ content?.ui.dressCode.heading }}</h2>
		<p v-if="content" class="dress-code__text">{{ content.dressCode }}</p>
		<div class="dress-code__swatches" aria-hidden="true">
			<span v-for="n in 5" :key="n" class="dress-code__swatch" />
		</div>
	</section>
</template>

<style scoped lang="scss">
.dress-code {
	padding-block: $space-xl;
	text-align: center;
}

.dress-code__heading {
	margin-bottom: $space-sm;
	font-size: $font-size-xl;
}

.dress-code__text {
	margin-bottom: $space-md;
	font-size: $font-size-base;
}

.dress-code__swatches {
	display: flex;
	justify-content: center;
	gap: $space-2xs;
}

.dress-code__swatch {
	width: 3.5rem;
	height: 1.125rem;
	border-radius: $radius-sm;
	background-color: $color-light-gold-1;
}
</style>
