<script lang="ts" setup>
// Pulsing-logo loader shown during page changes / content loads (Story 2).
// Visual is a placeholder monogram until the real logo asset lands.
const props = withDefaults(defineProps<{ visible?: boolean; }>(), {
	visible: true,
});

const { content } = useContent();
</script>

<template>
	<Transition name="loader-fade">
		<div v-if="props.visible" class="app-loader" role="status" aria-live="polite">
			<span class="u-visually-hidden">{{ content?.ui.loader.loading ?? "Loading" }}</span>
			<img src="/logo.svg" alt="" class="app-loader__logo" />
		</div>
	</Transition>
</template>

<style scoped lang="scss">
.app-loader {
	position: fixed;
	inset: 0;
	z-index: $z-loader;
	display: grid;
	place-items: center;
	background-color: $color-bg;
}

.app-loader__logo {
	width: 5rem;
	height: auto;
	animation: loader-pulse 1.4s $ease-standard infinite;
}

@keyframes loader-pulse {
	0%,
	100% {
		transform: scale(1);
		opacity: 0.6;
	}
	50% {
		transform: scale(1.08);
		opacity: 1;
	}
}

.loader-fade-enter-active,
.loader-fade-leave-active {
	transition: opacity $duration-base $ease-standard;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
	opacity: 0;
}
</style>
