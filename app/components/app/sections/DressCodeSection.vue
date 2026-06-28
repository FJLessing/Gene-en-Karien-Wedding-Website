<script lang="ts" setup>
// Dress code (Story 2). Includes a swatch strip for the colour palette.
const { content } = useContent();
const swatches = ["#121212", "#F7F5F0", "#3A404E", "#D8C3A5", "#2B4638", "#50151B"];
const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "up" });
</script>

<template>
	<section ref="root" class="dress-code u-content">
		<h2 class="dress-code__heading u-heading">{{ content?.ui.dressCode.heading }}</h2>
		<p v-if="content" class="dress-code__text">{{ content.dressCode }}</p>
		<div class="dress-code__image-wrap">
			<img src="/img/dress_code.webp" alt="Dress Code Image" />
		</div>
		<div class="dress-code__swatches" aria-hidden="true">
			<span v-for="colour in swatches" :key="colour" class="dress-code__swatch" :style="{ backgroundColor: colour }" />
		</div>
	</section>
</template>

<style scoped lang="scss">
.dress-code {
	padding-block: $space-xl;
	text-align: center;

	&__heading {
		margin-bottom: $space-lg;
		font-size: $font-size-xl;
	}

	&__text {
		margin-bottom: $space-md;
		font-size: $font-size-base;
	}

	&__image-wrap {
		margin: $space-xl $space-lg;
	}

	&__swatches {
		display: flex;
		justify-content: center;
		margin-top: $space-3xl;
	}

	&__swatch {
		width: 3.5rem;
		height: 1.125rem;
		transition: transform .3s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: bottom center;

		&:hover {
			transform: scaleY(300%)
		}
	}
}
</style>
