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
		<h2 class="venue__heading u-heading">About the venue</h2>
		<p class="venue__about">{{ content.venue.about }}</p>

		<BaseButton variant="ghost" @click="accommodationOpen = true">Book your accommodation</BaseButton>

		<BaseAccordion title="Venue activities">
			<ul class="venue__activities">
				<li v-for="activity in content.venue.activities" :key="activity.title" class="venue__activity">
					{{ activity.title }}
				</li>
			</ul>
		</BaseAccordion>

		<a v-if="content.venue.mapUrl" :href="content.venue.mapUrl" class="venue__map" download>
			Download the venue map
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
				Book now
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
}

.venue__heading {
	font-size: $font-size-xl;
	text-align: center;
}

.venue__about {
	font-size: $font-size-sm;
	line-height: $line-height-loose;
	color: $color-text-muted;
}

.venue__activities {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: $space-2xs;
}

.venue__activity {
	padding: $space-2xs;
	border-radius: $radius-md;
	background-color: $color-light-gold-1;
	font-size: $font-size-sm;
	text-align: center;
}

.venue__map {
	font-size: $font-size-sm;
	text-decoration: underline;
	text-align: center;
}

.venue__contact {
	font-size: $font-size-sm;
	color: $color-text-muted;
	text-align: center;
}

.venue__modal-cta {
	margin-top: $space-md;
}
</style>
