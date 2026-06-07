<script lang="ts" setup>
// Welcome intro paragraph (Story 2).
const { content } = useContent();
const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "up" });
</script>

<template>
	<section ref="root" class="welcome u-content">
		<p v-if="content" class="welcome__text">{{ content.welcome }}</p>
	</section>
</template>

<style scoped lang="scss">
.welcome {
	padding-block: $space-xl;
	text-align: center;
}

.welcome__text {
	font-size: $font-size-base;
	line-height: $line-height-loose;
	color: $color-text;
}
</style>
