<script lang="ts" setup>
const { content } = useContent();
</script>

<template>
		<section v-if="content" class="venue-intro u-content">
			<h2 class="venue-intro__heading u-heading">{{ content.ui.venue.heading }}</h2>
			<p class="venue-intro__about">{{ content.venue.about }}</p>
		</section>
</template>

<style scoped lang="scss">
.venue-intro {
	display: flex;
	flex-direction: column;
	gap: $space-md;
	padding-block: $space-xl;

	&__heading {
		font-size: $font-size-xl;
		text-align: center;
	}

	&__about {
		font-size: $font-size-sm;
		line-height: $line-height-loose;
		color: $color-text-muted;
	}
}
</style>
