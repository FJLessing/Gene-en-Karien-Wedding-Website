<script lang="ts" setup>
// Venue info (Story 2): collapsible "about the venue" with accommodation modal,
// activity blocks, map download, and contact details.
import BaseAccordion from "~/components/ui/BaseAccordion.vue";
import BaseModal from "~/components/ui/BaseModal.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import ActivityCard from "~/components/ui/ActivityCard.vue";
import { ActivityCardVariant } from "#shared/types/types";
import ImageSection from "~/components/app/sections/ImageSection.vue";


const { content } = useContent();
const accommodationOpen = ref(false);

// Pre-filled draft email to Touchdown Africa's reservations consultant, cc'ing
// the couple. Params are encoded with encodeURIComponent (spaces → %20) rather
// than URLSearchParams (spaces → +), since mailto clients render a literal "+".
const mailtoHref = computed(() => {
	const b = content.value?.venue.accommodation.booking;
	if (!b) return "";
	const query = `cc=${encodeURIComponent(b.cc)}&subject=${encodeURIComponent(b.subject)}&body=${encodeURIComponent(b.draft)}`;
	return `mailto:${b.email}?${query}`;
});

function openBookingEmail(): void {
	if (mailtoHref.value) window.location.href = mailtoHref.value;
}

// Copy the booking reference and briefly flash a confirmation above the CTA.
const copied = ref(false);
let copyResetTimer: ReturnType<typeof setTimeout> | undefined;

async function copyToClipboard(line: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(line);
	} catch {
		// Clipboard unavailable (denied permission / insecure context) — fail quietly.
		return;
	}
	copied.value = true;
	if (copyResetTimer) clearTimeout(copyResetTimer);
	copyResetTimer = setTimeout(() => { copied.value = false; }, 2000);
}

onBeforeUnmount(() => { if (copyResetTimer) clearTimeout(copyResetTimer); });
</script>

<template>
	<div>
		<section v-if="content" class="venue u-content">
			<BaseButton variant="secondary" @click="accommodationOpen = true">{{ content.ui.venue.bookAccommodation }}</BaseButton>

			<BaseAccordion :title="content.ui.venue.activitiesTitle" sub-title="Kindly note all activities have to be booked with the venue in advance." :open="true" gold-style>
				<ul class="venue__activities">
					<li v-for="activity in content.venue.activities" :key="activity.title">
						<ActivityCard
							:title="activity.title"
							:image="activity.image"
							:link="activity.link"
							:variant="ActivityCardVariant.Grid"
						/>
					</li>
				</ul>
			</BaseAccordion>

			<a v-if="content.venue.mapUrl" :href="content.venue.mapUrl" class="venue__map" download>
				{{ content.ui.venue.downloadMap }}
			</a>

			<p class="venue__contact">{{ content.venue.contact }}</p>

			<BaseModal
				class="venue__modal"
				:open="accommodationOpen"
				:title="content.venue.accommodation.heading"
				@close="accommodationOpen = false"
			>
				<p
					class="venue__modal-body-line" v-for="line in content.venue.accommodation.body"
				>{{ line }}</p>
				<BaseButton
					variant="grey"
					class="venue__modal-copy"
					@click="copyToClipboard(content.venue.accommodation.booking.reference)"
				>
					<Transition name="copied-fade" mode="out-in">
						<span v-if="copied" key="copied" class="venue__copied" role="status" aria-live="polite">
							{{ content.ui.venue.copied }}
						</span>
						<span v-else key="label">{{ content.ui.venue.copyReference }}</span>
					</Transition>
				</BaseButton>
				<BaseButton class="venue__modal-cta" @click="openBookingEmail">
					{{ content.venue.accommodation.booking.cta }}
				</BaseButton>
			</BaseModal>
		</section>
	</div>
</template>

<style scoped lang="scss">
.venue {
	display: flex;
	flex-direction: column;
	gap: $space-md;
	padding-block: $space-xl;

	&__activities {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $space-2xs;
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

	&__modal-copy {
		margin-top: $space-md;
	}

	&__modal-cta {
		margin-top: $space-sm;
	}

	&__copied {
		font-size: $font-size-sm;
		font-weight: $font-weight-medium;
		text-align: center;
	}

	&__modal-body-line {
		margin-bottom: $space-sm;

		&:nth-child(2) {
			font-weight: bold;
		}
	}
}

// Small confirmation that fades / slides in above the CTA when the reference is copied.
.copied-fade-enter-active,
.copied-fade-leave-active {
	transition: opacity $duration-fast $ease-standard, transform $duration-fast $ease-standard;
}

.copied-fade-enter-from,
.copied-fade-leave-to {
	opacity: 0;
	transform: translateY($space-2xs);
}

@include reduced-motion {
	.copied-fade-enter-active,
	.copied-fade-leave-active {
		transition: opacity $duration-fast $ease-standard;
	}

	.copied-fade-enter-from,
	.copied-fade-leave-to {
		transform: none;
	}
}
</style>
