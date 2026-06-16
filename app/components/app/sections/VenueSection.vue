<script lang="ts" setup>
// Venue info (Story 2): collapsible "about the venue" with accommodation modal,
// activity blocks, map download, and contact details.
import BaseAccordion from "~/components/ui/BaseAccordion.vue";
import BaseModal from "~/components/ui/BaseModal.vue";
import BaseButton from "~/components/ui/BaseButton.vue";

const { content } = useContent();
const accommodationOpen = ref(false);
</script>

<template>
	<section v-if="content" class="venue u-content">
		<h2 class="venue__heading u-heading">{{ content.ui.venue.heading }}</h2>
		<p class="venue__about">{{ content.venue.about }}</p>

		<BaseButton variant="secondary" @click="accommodationOpen = true">{{ content.ui.venue.bookAccommodation }}</BaseButton>

		<BaseAccordion :title="content.ui.venue.activitiesTitle" :open="true">
			<ul class="venue__activities">
				<li v-for="activity in content.venue.activities" :key="activity.title">
					<component
						:is="activity.link ? 'a' : 'div'"
						:href="activity.link || undefined"
						:target="activity.link ? '_blank' : undefined"
						:rel="activity.link ? 'noopener' : undefined"
						class="venue__activity"
					>
						<img
							v-if="activity.image"
							:src="activity.image"
							:alt="activity.title"
							class="venue__activity-image"
							loading="lazy"
							width="270"
							height="217"
						/>
						<span class="venue__activity-title">{{ activity.title }}</span>
					</component>
				</li>
			</ul>
		</BaseAccordion>

		<a v-if="content.venue.mapUrl" :href="content.venue.mapUrl" class="venue__map" download>
			{{ content.ui.venue.downloadMap }}
		</a>

		<p v-if="content.venue.contact" class="venue__contact">{{ content.venue.contact }}</p>

		<BaseModal
			:open="accommodationOpen"
			:title="content.venue.accommodation.heading"
			@close="accommodationOpen = false"
		>
			<p>{{ content.venue.accommodation.body }}</p>
			<BaseButton
				v-if="content.venue.accommodation.bookingUrl"
				class="venue__modal-cta"
				@click="() => null"
			>
				{{ content.ui.venue.bookNow }}
			</BaseButton>
		</BaseModal>
	</section>
</template>

<style scoped lang="scss">
.venue {
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

	&__activities {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $space-2xs;
	}

	&__activity {
		display: flex;
		flex-direction: column;
		border-radius: $radius-md;
		overflow: hidden;
		background-color: $color-light-gold-1;
		font-size: $font-size-sm;
		text-align: center;
		transition: transform $duration-fast $ease-standard, box-shadow $duration-fast $ease-standard;

		&:hover {
			transform: translateY(-2px);
			box-shadow: $shadow-soft;
		}

		@include reduced-motion {
			&:hover {
				transform: none;
			}
		}
	}

	&__activity-image {
		width: 100%;
		aspect-ratio: 270 / 217;
		object-fit: cover;
	}

	&__activity-title {
		padding: $space-2xs;
	}

	&__map {
		font-size: $font-size-sm;
		text-decoration: underline;
		text-align: center;
	}

	&__contact {
		font-size: $font-size-sm;
		color: $color-text-muted;
		text-align: center;
	}

	&__modal-cta {
		margin-top: $space-md;
	}
}
</style>
