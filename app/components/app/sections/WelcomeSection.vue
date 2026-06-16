<script lang="ts" setup>
import DecoratorWildflowerBranch from '~/components/ui/DecoratorWildflowerBranch.vue';

// Welcome intro paragraph (Story 2).
const { content } = useContent();
const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "up" });
</script>

<template>
	<section ref="root" class="welcome u-content">
		<div class="welcome__image-block">
			<DecoratorWildflowerBranch/>
		</div>
		<div class="welcome__content-block">
			<p v-for="(paragraph, i) in (content?.welcome ?? [])" :key="i" class="welcome__text">{{ paragraph }}</p>
		</div>
	</section>
</template>

<style scoped lang="scss">
.welcome {
	padding-block: $space-xl;
	display: flex;
	align-items: center;

	&__image-block {
		flex: 1 1 20%;
		margin-right: $space-lg;

		svg {
			width: 100%;
			height: auto;
		}
	}

	&__content-block {
		flex: 1 1 80%;
	}

	&__text {
			font-size: $font-size-base;
			line-height: $line-height-loose;
			color: $color-text;
			margin-bottom: $font-size-base;

			&:first-child {
				font-family: $font-display;
			}
	}
}
</style>
