<script lang="ts" setup>
// Activity tile (Figma 58-515 / 58-535 / 59-103): a rounded image with a dark
// bottom-up gradient and the title overlaid in white at the bottom-left.
// Renders as an anchor when `link` is set (Venue → external site) or a button
// otherwise (Area Activities → opens a modal via the `click` emit). Falls back
// to the estate illustration when no image has been supplied yet.
import { ActivityCardVariant } from "#shared/types/types";

const FALLBACK_IMAGE = "/img/dunkeld_estate_illustration.webp";

const props = withDefaults(
	defineProps<{
		title: string;
		image?: string;
		link?: string;
		variant?: ActivityCardVariant;
	}>(),
	{
		image: "",
		link: "",
		variant: ActivityCardVariant.Grid,
	},
);

const emit = defineEmits<{ click: [event: MouseEvent]; }>();

const imageSrc = computed(() => props.image || FALLBACK_IMAGE);
const tag = computed(() => (props.link ? "a" : "button"));
const isImageLoaded = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

onMounted(() => {
	if (imgRef.value?.complete) {
		isImageLoaded.value = true;
	}
});
</script>

<template>
	<component
		:is="tag"
		:href="props.link || undefined"
		:target="props.link ? '_blank' : undefined"
		:rel="props.link ? 'noopener' : undefined"
		:type="props.link ? undefined : 'button'"
		:class="['activity-card', `activity-card--${props.variant}`]"
		@click="emit('click', $event)"
	>
		<div v-if="!isImageLoaded" class="activity-card__skeleton" aria-hidden="true" />
		<img
			ref="imgRef"
			class="activity-card__image"
			:class="{ 'activity-card__image--loaded': isImageLoaded }"
			:src="imageSrc"
			:alt="props.title"
			loading="lazy"
			@load="isImageLoaded = true"
		/>
		<span class="activity-card__title">{{ props.title }}</span>
	</component>
</template>

<style scoped lang="scss">
@keyframes skeleton-pulse {
	0%, 100% { background-color: $color-light-gold-1; }
	50% { background-color: $color-light-gold-2; }
}

.activity-card {
	position: relative;
	display: block;
	width: 100%;
	aspect-ratio: 157 / 181;
	padding: 0;
	border: none;
	border-radius: $radius-sm;
	overflow: hidden;
	background-color: $color-light-gold-1;
	color: $color-white;
	text-align: left;
	text-decoration: none;
	cursor: pointer;
	transition: transform $duration-fast $ease-standard, box-shadow $duration-fast $ease-standard;

	// Dark bottom-up gradient so the white title stays legible over any photo.
	&::after {
		content: "";
		position: absolute;
		inset: 0;
		background-image: linear-gradient(to bottom, rgba(#343434, 0) 48%, rgba(#343434, 0.95) 100%);
		pointer-events: none;
	}

	&:hover {
		transform: translateY(-2px);
		box-shadow: $shadow-soft;
	}

	@include reduced-motion {
		transition: none;

		&:hover {
			transform: none;
		}
	}

	&--banner {
		aspect-ratio: 328 / 125;
	}

	&__skeleton {
		position: absolute;
		inset: 0;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	&__image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity $duration-base $ease-standard;

		&--loaded {
			opacity: 1;
		}
	}

	&__title {
		position: absolute;
		left: $space-xs;
		bottom: $space-2xs;
		z-index: 1;
		font-size: $font-size-sm;
		font-weight: 300;
		letter-spacing: 1.178px;
		line-height: $line-height-base;

		.activity-card--banner & {
			left: $space-sm;
			bottom: $space-sm;
			font-size: $font-size-base;
		}
	}
}
</style>
