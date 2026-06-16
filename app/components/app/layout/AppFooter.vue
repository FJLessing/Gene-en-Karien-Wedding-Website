<script lang="ts" setup>
// Footer (Story 2). Logo, couple names, date/venue line, tagline, language toggle.
import LocaleToggle from "~/components/app/layout/LocaleToggle.vue";
import BaseMonogram from "~/components/ui/BaseMonogram.vue";
const { content } = useContent();
</script>

<template>
	<footer class="app-footer u-content">
		<BaseMonogram/>
		<p v-if="content" class="app-footer__names u-heading">
			{{ content.couple.nameOne.split(/\s+/)[0] }} &amp; {{ content.couple.nameTwo.split(/\s+/)[0] }}
		</p>
		<p v-if="content" class="app-footer__meta">
			{{ content.event.dates }} {{ content.event.year }} | {{ content.event.venueLocation.split(/\s+/)[0]?.replace(/[.,!?]+$/g, "") }}
		</p>
		<p v-if="content" class="app-footer__tagline">{{ content.footer.tagline }}</p>
		<LocaleToggle class="app-footer__locale" />
	</footer>
</template>

<style scoped lang="scss">
.app-footer {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: $space-sm;
	padding-block: $space-2xl;
	text-align: center;

	&__logo {
		width: 4rem;
		height: auto;
	}

	&__names {
		font-size: $font-size-lg;
	}

	&__meta {
		font-size: $font-size-xs;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: $color-text-muted;
	}

	&__tagline {
		font-family: $font-display;
		font-size: $font-size-base;
	}

	&__locale {
		margin-top: $space-sm;
	}
}
</style>
