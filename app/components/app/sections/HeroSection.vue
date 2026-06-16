<script lang="ts" setup>
import BaseMonogram from '~/components/ui/BaseMonogram.vue';
import DecoratorLine from '~/components/ui/DecoratorLine.vue';

// Hero (Story 2): venue image, couple image, invitation line, names, scroll cue.
// Content-driven — no copy hardcoded.
const { content } = useContent();

const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "fade", duration: 1 });
</script>

<template>
	<section ref="root" class="hero">
		<div class="hero__media hero__monogram" aria-hidden="true">
			<BaseMonogram/>
		</div>
		<div v-if="content" class="hero__copy u-content">
			<p class="hero__invite">
				<span>{{ content.couple.invitationLine1 }}</span>
				<span>{{ content.couple.invitationLine2 }}</span>
			</p>
			<h1 class="hero__names u-heading">
				<span>{{ content.couple.nameOne }}</span>
				<span class="hero__amp">&amp;</span>
				<span>{{ content.couple.nameTwo }}</span>
			</h1>
		</div>
		<div class="hero__media hero__illustration">
			<img src="/img/dunkeld_estate_illustration.webp" alt="Dunkeld Estate illustration" />
		</div>
		<div class="hero__scroll" aria-hidden="true">
			<DecoratorLine />
			<span>{{ content?.ui.nav.scroll }}</span>
		</div>
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
	gap: $space-xl;
	text-align: center;

	&__monogram {
		margin-top: 7vh;
		margin-bottom: 10vh;
	}

	&__invite {
		display: flex;
		flex-direction: column;
		gap: $space-3xs;
		font-size: $font-size-base;
		color: $color-text-muted;
	}

	&__names {
		display: flex;
		flex-direction: column;
		margin-top: $space-lg;
		gap: $space-2xs;
		font-size: $font-size-2xl;
		font-family: $font-display;
	}

	&__amp {
		font-size: $font-size-lg;
	}

	&__illustration {
		max-width: 80vw;
	}

	&__scroll {
		display: flex;
		flex-direction: column;
		gap: $space-xs;
		align-items: center;
		margin-bottom: $space-lg;
		margin-top: auto;
		font-size: $font-size-xs;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: $color-text-muted;
	}
}
</style>
