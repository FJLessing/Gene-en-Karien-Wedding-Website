<script lang="ts" setup>
// "The details" block (Story 2): date, location, RSVP-by.
const { content } = useContent();
const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "up" });
</script>

<template>
	<section ref="root" class="details u-content">
		<h2 class="details__heading u-heading">The details</h2>
		<dl v-if="content" class="details__list">
			<div class="details__item">
				<dt>When</dt>
				<dd>{{ content.details.dateLabel }}</dd>
			</div>
			<div class="details__item">
				<dt>Where</dt>
				<dd>{{ content.details.locationLabel }}</dd>
			</div>
			<div class="details__item">
				<dt>RSVP by</dt>
				<dd>{{ content.details.rsvpByLabel }}</dd>
			</div>
		</dl>
	</section>
</template>

<style scoped lang="scss">
.details {
	padding-block: $space-xl;
	text-align: center;
}

.details__heading {
	margin-bottom: $space-md;
	font-size: $font-size-xl;
}

.details__list {
	display: flex;
	flex-direction: column;
	gap: $space-md;
}

.details__item {
	dt {
		font-size: $font-size-xs;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: $color-text-muted;
	}

	dd {
		font-size: $font-size-base;
	}
}
</style>
