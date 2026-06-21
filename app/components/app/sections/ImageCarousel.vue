<script lang="ts" setup>
// Full-width horizontal image carousel with autoplay and dot pagination below.
// Each instance gets a unique pagination ID so multiple carousels never collide.
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import type { CarouselImage } from "#shared/types/types";
import "swiper/css";
import "swiper/css/pagination";

interface ImageCarouselProps {
	images: CarouselImage[];
}

const props = defineProps<ImageCarouselProps>();

const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "fade", duration: 1 });

const modules = [Autoplay, Pagination];

const paginationId = useId();

function imgSrcset(image: CarouselImage): string | undefined {
	if (!image.srcDesktop) return undefined;
	const w = image.width ?? 1440;
	return `${image.src} ${w}w, ${image.srcDesktop} ${w * 2}w`;
}

onMounted(() => {
	const container = root.value;
	if (!container) return;

	const markLoaded = (img: HTMLImageElement) => {
		img.classList.add("image-carousel__img--loaded");
	};

	container.querySelectorAll(".image-carousel__img").forEach((img) => {
		if ((img as HTMLImageElement).complete) {
			markLoaded(img as HTMLImageElement);
		}
	});

	container.addEventListener(
		"load",
		(e) => {
			if (
				e.target instanceof HTMLImageElement &&
				e.target.classList.contains("image-carousel__img")
			) {
				markLoaded(e.target);
			}
		},
		true
	);
});
</script>

<template>
	<section ref="root" class="image-carousel">
		<Swiper
			v-if="images.length > 0"
			:modules="modules"
			:slides-per-view="1"
			:space-between="0"
			:loop="images.length > 1"
			:grab-cursor="true"
			:autoplay="{ delay: 5000, disableOnInteraction: true }"
			:pagination="{ el: `#${paginationId}`, clickable: true }"
		>
			<SwiperSlide v-for="image in images" :key="image.src">
				<img
					:src="image.src"
					:srcset="imgSrcset(image)"
					sizes="100%"
					:alt="image.alt"
					class="image-carousel__img"
					loading="lazy"
					:width="image.width ?? 1440"
					:height="image.height ?? 960"
				/>
				<div class="image-carousel__skeleton" aria-hidden="true" />
			</SwiperSlide>
		</Swiper>
		<div :id="paginationId" class="image-carousel__pagination" />
	</section>
</template>

<style scoped lang="scss">
@keyframes skeleton-pulse {
	0%, 100% { background-color: $color-grey; }
	50% { background-color: $color-light-grey; }
}

.image-carousel {
	// `clip` (not `hidden`) so iOS Safari can't pan/rubber-band the off-screen
	// Swiper loop clones — `hidden` leaves a pannable scroll surface on iOS.
	// `width: 100%` + `max-width` pins the carousel to the content box so the
	// off-axis loop clones can never widen the layout viewport (iOS initial-zoom).
	overflow: clip;
	width: 100%;
	max-width: 100%;

	&__skeleton {
		position: absolute;
		inset: 0;
		z-index: 0;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
		transition: opacity $duration-base $ease-standard;
	}

	&__img {
		position: relative;
		z-index: 1;
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
		opacity: 0;
		transition: opacity $duration-base $ease-standard;

		&--loaded {
			opacity: 1;
		}
	}

	&__img--loaded ~ .image-carousel__skeleton {
		animation: none;
		opacity: 0;
	}

	// Pagination dots sit below the image area, centred.
	&__pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.375rem;
		padding-block: $space-sm;
	}

	// Pagination dots
	// Active: wide gold pill. Inactive: small circle with gold outline / white fill.
	// Transition is animated for width, background, and border.
	:deep(.swiper-pagination-bullet) {
		width: 0.3125rem;
		height: 0.3125rem;
		background: $color-white;
		border: 0.0625rem solid $color-gold;
		opacity: 1;
		border-radius: $radius-pill;
		margin: 0;
		transition:
			width $duration-base $ease-standard,
			background-color $duration-base $ease-standard,
			border-color $duration-base $ease-standard;
	}

	:deep(.swiper-pagination-bullet-active) {
		width: 1.4375rem;
		background: $color-gold;
		border-color: $color-gold;
	}
}
</style>
