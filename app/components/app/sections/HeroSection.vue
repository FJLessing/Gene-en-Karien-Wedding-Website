<script lang="ts" setup>
// Hero (Story 2): venue image, couple image, invitation line, names, scroll cue.
// Content-driven — no copy hardcoded.
const { content } = useContent();

const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "fade", duration: 1 });
</script>

<template>
	<section ref="root" class="hero">
		<div class="hero__media" aria-hidden="true">
			<!-- Venue + couple imagery slot in here (assets pending). -->
		</div>
		<div v-if="content" class="hero__copy u-content">
			<p class="hero__invite">{{ content.couple.invitationLine }}</p>
			<h1 class="hero__names u-heading">
				<span>{{ content.couple.nameOne }}</span>
				<span class="hero__amp">&amp;</span>
				<span>{{ content.couple.nameTwo }}</span>
			</h1>
		</div>
		<span class="hero__scroll" aria-hidden="true">scroll</span>
	</section>
</template>

<style scoped lang="scss">
.hero {
	position: relative;
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: $space-lg;
	text-align: center;
}

.hero__invite {
	font-size: $font-size-base;
	color: $color-text-muted;
}

.hero__names {
	display: flex;
	flex-direction: column;
	gap: $space-2xs;
	font-size: $font-size-2xl;
}

.hero__amp {
	font-size: $font-size-lg;
}

.hero__scroll {
	position: absolute;
	bottom: $space-lg;
	font-size: $font-size-xs;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: $color-text-muted;
}
</style>
