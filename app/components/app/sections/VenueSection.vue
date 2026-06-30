<script lang="ts" setup>
// Venue info (Story 2): collapsible "about the venue" with accommodation modal,
// activity blocks, map download, and contact details.
import BaseModal from "~/components/ui/BaseModal.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import MapButton from "~/components/ui/MapButton.vue";
import ImageCarousel from "~/components/app/sections/ImageCarousel.vue";

const props = defineProps<{ mapImages: CarouselImage[] }>();
const { content } = useContent();
const accommodationOpen = ref(false);

// The estate name inside the about copy links out to the venue site. The phrase
// is identical in EN + AF, so a single literal split serves both locales.
const VENUE_NAME = "Dunkeld Country & Equestrian Estate";
const VENUE_URL = "https://www.dunkeldestate.co.za/";

const aboutParts = computed(() => {
	const about = content.value?.venue.about ?? "";
	const idx = about.indexOf(VENUE_NAME);
	if (idx === -1) return { before: about, name: "", after: "" };
	return { before: about.slice(0, idx), name: VENUE_NAME, after: about.slice(idx + VENUE_NAME.length) };
});

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

			<div class="venue__wrap">
				<h2 class="venue__heading u-heading">{{ content.ui.venue.heading }}</h2>
				<h3 class="venue__sub-heading u-heading">{{ content.ui.venue.subHeading }}</h3>
			</div>
			<p class="venue__about">{{ aboutParts.before }}<a
				v-if="aboutParts.name"
				:href="VENUE_URL"
				class="venue__about-link"
				target="_blank"
				rel="noopener"
			>{{ aboutParts.name }}</a>{{ aboutParts.after }}</p>
			<p class="venue__note">{{ content.venue.note }}</p>

		</section>

		<ImageCarousel :images="mapImages" :autoplay="false" />
		<section v-if="content" class="venue u-content">

			<MapButton href="/dunkeld_estate_maps.pdf" :label="content.ui.venue.downloadMap" />
			<BaseButton variant="secondary" @click="accommodationOpen = true">{{ content.ui.venue.bookAccommodation }}</BaseButton>

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

	&__heading {
		font-size: $font-size-xl;
		text-align: center;
		margin-bottom: $space-3xs;
	}

	&__sub-heading {
		font-size: $font-size-lg;
		font-family: $font-body;
		font-weight: $font-weight-light;
		text-align: center;
	}

	&__about, &__note {
		margin: $space-xs $space-md;
	}

	&__about {
		line-height: $line-height-loose;
		color: $color-text;
	}

	&__about-link {
		text-decoration: underline;
	}

	&__note {
		margin-bottom: $space-lg;
		font-weight: $font-weight-medium;
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
