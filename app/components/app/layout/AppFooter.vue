<script lang="ts" setup>
// Footer (Story 2). Logo, couple names, date/venue line, tagline, language toggle.
import LocaleToggle from "~/components/app/layout/LocaleToggle.vue";
const { content } = useContent();
</script>

<template>
	<footer class="app-footer u-content">
		<img src="/logo.svg" alt="" class="app-footer__logo" />
		<p v-if="content" class="app-footer__names u-heading">
			{{ content.couple.nameOne }} &amp; {{ content.couple.nameTwo }}
		</p>
		<p v-if="content" class="app-footer__meta">
			{{ content.event.dateLabel }} · {{ content.event.venueLocation }}
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
}

.app-footer__logo {
	width: 4rem;
	height: auto;
}

.app-footer__names {
	font-size: $font-size-lg;
}

.app-footer__meta {
	font-size: $font-size-xs;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: $color-text-muted;
}

.app-footer__tagline {
	font-family: $font-display;
	font-size: $font-size-base;
}

.app-footer__locale {
	margin-top: $space-sm;
}
</style>
