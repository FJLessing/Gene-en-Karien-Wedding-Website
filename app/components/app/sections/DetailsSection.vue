<script lang="ts" setup>
import DecoratorLine from '~/components/ui/DecoratorLine.vue';

// "The details" block (Story 2): date, location, RSVP-by.
const { content } = useContent();
const root = ref<HTMLElement | null>(null);
useReveal(root, { direction: "up" });
</script>

<template>
	<section v-if="content" ref="root" class="details u-content">
		<div class="details__frame">
			<h2 class="details__heading u-heading">{{ content.ui.details.heading }}</h2>
			<div class="details__date">
				<h3 class="details__dates">{{ content.details.dates }}</h3>
				<p class="details__year">{{ content.details.year }}</p>
			</div>
			<DecoratorLine class="details__decorator" height="1.78125rem" />
			<dl class="details__list">
				<div class="details__item">
					<dt>{{ content.details.location[0] ?? "" }}</dt>
					<dd>{{ content.details.location[1] ?? ""}}</dd>
				</div>
				<div class="details__item">
					<dt>{{ content.ui.details.rsvpBy }}</dt>
					<dd>{{ content.details.rsvpBy }}</dd>
				</div>
			</dl>
		</div>
	</section>
</template>

<style scoped lang="scss">
.details {
	position: relative;
	padding-block: $space-xl;
	text-align: center;
	/* Blur + Shadow Small */
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.10);
	backdrop-filter: blur(3.125rem);
	border-radius: $radius-sm;

	&__frame {
		padding: $space-xl $space-xl;
	}

	&__heading {
		margin-bottom: $space-md;
		font-family: $font-body;
		font-size: $font-size-sm;
		font-weight: 300;
		text-transform: uppercase;
	}

	&__date {
		margin-top: $space-lg;
	}

	&__dates {
		font-family: $font-display;
		font-size: $font-size-2xl;
	}

	&__year {
		font-size: $font-size-sm;
	}

		&__decorator {
			margin: $space-lg auto $space-sm;
		}

	&__list {
		display: flex;
		flex-direction: column;
		gap: $space-md;
	}

	&__item {
		dt {
			font-family: $font-display;
			font-size: $font-size-base;
		}

		dd {
			font-size: $font-size-sm;
			color: $color-text-muted;
			text-transform: uppercase;
		}
	}

	/* FRAME INDICATORS */
	&, &__frame {
		&::before, &::after {
			content: '';
			display: block;
			position: absolute;
			border-width: 2px;
			border-color: $color-accent;
			width: $font-size-lg;
			height: $font-size-lg;
		}
	}

	&::before, &__frame::before {
		left: $space-md;
		border-left-style: solid;
	}

	&::after, &__frame::after {
		right: $space-md;
		border-right-style: solid;
	}

	&::before, &::after {
		top: $space-md;
		border-top-style: solid;
	}

	&__frame::before, &__frame::after {
		bottom: $space-md;
		border-bottom-style: solid;
	}
}
</style>
