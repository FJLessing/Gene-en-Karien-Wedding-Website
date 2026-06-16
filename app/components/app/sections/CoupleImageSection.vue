<script lang="ts" setup>
// Full-width hero image of the couple (Story 2).
const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "fade", duration: 1 });
</script>

<template>
	<section ref="root" class="couple-image">
		<img
			src="/img/the_happy_couple.webp"
			alt="The happy couple"
			class="couple-image__img"
			loading="lazy"
			width="1440"
			height="960"
		/>
	</section>
</template>

<style scoped lang="scss">
.couple-image {
	overflow: hidden;

	&__img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}
}
</style>
