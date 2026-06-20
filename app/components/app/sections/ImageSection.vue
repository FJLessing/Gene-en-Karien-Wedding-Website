<script lang="ts" setup>
// Generic full-width image section with fade-in reveal.
// When `srcDesktop` is supplied, the browser uses `srcset` to load the
// higher-resolution image for viewports where the image slot is wide enough
// (typically screens wider than ~960 px at 1× pixel density).

interface ImageSectionProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	/** Full-resolution desktop image. Listed in srcset at 2× the mobile width so the browser favours it on larger viewports. */
	srcDesktop?: string;
}

const props = withDefaults(defineProps<ImageSectionProps>(), {
	width: 1440,
	height: 960,
});

const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "fade", duration: 1 });

const imgSrcset = computed(() => {
	if (!props.srcDesktop) return undefined;
	// Mobile image at its intrinsic width; desktop at 2× so the browser
	// favours it once the rendered slot exceeds the mobile image width.
	return `${props.src} ${props.width}w, ${props.srcDesktop} ${props.width * 2}w`;
});
</script>

<template>
	<section ref="root" class="image-section">
		<img
			:src="props.src"
			:srcset="imgSrcset"
			sizes="100vw"
			:alt="props.alt"
			class="image-section__img"
			loading="lazy"
			:width="props.width"
			:height="props.height"
		/>
	</section>
</template>

<style scoped lang="scss">
.image-section {
	overflow: hidden;

	&__img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}
}
</style>
