<script lang="ts" setup>
// Accessible modal. Closes on backdrop click, close button, or Escape (Story 2).
const props = withDefaults(defineProps<{ open: boolean; title?: string; }>(), {
	open: false,
	title: "",
});

const emit = defineEmits<{ close: []; }>();

function onKeydown(e: KeyboardEvent): void {
	if (e.key === "Escape" && props.open) emit("close");
}

watch(
	() => props.open,
	(isOpen) => {
		if (import.meta.client) {
			document.body.style.overflow = isOpen ? "hidden" : "";
		}
	},
);

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => {
	window.removeEventListener("keydown", onKeydown);
	if (import.meta.client) document.body.style.overflow = "";
});
</script>

<template>
	<Teleport to="body">
		<Transition name="modal-fade">
			<div v-if="props.open" class="base-modal" @click.self="emit('close')">
				<div class="base-modal__panel" role="dialog" aria-modal="true" :aria-label="props.title">
					<button class="base-modal__close" aria-label="Close" @click="emit('close')">&times;</button>
					<h2 v-if="props.title" class="base-modal__title u-heading">{{ props.title }}</h2>
					<div class="base-modal__body">
						<slot />
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.base-modal {
	position: fixed;
	inset: 0;
	z-index: $z-modal;
	display: grid;
	place-items: center;
	padding: $space-md;
	background-color: rgba(#000000, 0.4);

	&__panel {
		position: relative;
		width: 100%;
		max-width: $content-max-width;
		max-height: 85dvh;
		overflow-y: auto;
		padding: $space-lg;
		border-radius: $radius-lg;
		background-color: $color-bg;
		box-shadow: $shadow-soft;
	}

	&__close {
		position: absolute;
		top: $space-sm;
		right: $space-sm;
		font-size: $font-size-lg;
		line-height: 1;
		color: $color-text-muted;
	}

	&__title {
		margin-bottom: $space-sm;
		font-size: $font-size-xl;
	}
}

.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity $duration-base $ease-standard;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}
</style>
