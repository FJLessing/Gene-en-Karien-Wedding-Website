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
	autoplay?: boolean;
}

const props = withDefaults(defineProps<ImageCarouselProps>(), {
	autoplay: true,
});

const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "fade", duration: 1 });

const modules = [Autoplay, Pagination];

const paginationId = useId();

const FEW_IMAGES_THRESHOLD = 5;
const WIDE_DESKTOP_BP = "(min-width: 60rem)"; // 960px

const isWideDesktop = ref(false);
const fewImages = computed(() => props.images.length < FEW_IMAGES_THRESHOLD);
const showAllSlides = computed(() => fewImages.value && isWideDesktop.value);
const slidesPerView = computed(() =>
	showAllSlides.value ? props.images.length : "auto"
);

function imgSrcset(image: CarouselImage): string | undefined {
	if (!image.srcDesktop) return undefined;
	const w = image.width ?? 1440;
	return `${image.src} ${w}w, ${image.srcDesktop} ${w * 2}w`;
}

onMounted(() => {
	const mq = window.matchMedia(WIDE_DESKTOP_BP);
	isWideDesktop.value = mq.matches;
	const onMqChange = (e: MediaQueryListEvent) => {
		isWideDesktop.value = e.matches;
	};
	mq.addEventListener("change", onMqChange);
	onBeforeUnmount(() => mq.removeEventListener("change", onMqChange));

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
	<section
		ref="root"
		class="image-carousel"
		:class="{ 'image-carousel--show-all': showAllSlides }"
	>
		<Swiper
			v-if="images.length > 0"
			:modules="modules"
			:slides-per-view="slidesPerView"
			:space-between="0"
			:loop="images.length > 1 && !showAllSlides"
			:grab-cursor="true"
			:autoplay="props.autoplay ? { delay: 5000, disableOnInteraction: true } : false"
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

	:deep(.swiper) {
		@include up($bp-md) {
			height: 30rem;
		}
	}

	// Few-images mode: drop the fixed height and let images size naturally.
	&--show-all {
		:deep(.swiper) {
			@include up(60rem) {
				height: auto;
			}
		}

		.image-carousel__img {
			@include up(60rem) {
				width: 100%;
				height: auto;
			}
		}
	}

	:deep(.swiper-slide) {
		position: relative;
		width: 100%;
		height: auto;

		@include up($bp-md) {
			width: auto;
			height: 100%;
		}
	}

	&__img {
		position: relative;
		z-index: 1;
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
		object-position: center;
		opacity: 0;
		transition: opacity $duration-base $ease-standard;

		&--loaded {
			opacity: 1;

			~ .image-carousel__skeleton {
				animation: none;
				opacity: 0;
			}
		}

		@include up($bp-md) {
			width: auto;
			height: 100%;
			max-width: none;
		}
	}

	&__skeleton {
		position: absolute;
		inset: 0;
		z-index: 0;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
		transition: opacity $duration-base $ease-standard;
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
