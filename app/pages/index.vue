<script lang="ts" setup>
// Landing page (Story 1 + 2). Shows the envelope gate until access is granted,
// then the full scrolling content. Self-manages its layout (no shared layout) so
// the gate can take over the full viewport.
import EnvelopeGate from "~/components/app/layout/EnvelopeGate.vue";
import AppFooter from "~/components/app/layout/AppFooter.vue";
import HeroSection from "~/components/app/sections/HeroSection.vue";
import ImageCarousel from "~/components/app/sections/ImageCarousel.vue";
import type { CarouselImage } from "#shared/types/types";
import CountdownTimer from "~/components/app/sections/CountdownTimer.vue";
import WelcomeSection from "~/components/app/sections/WelcomeSection.vue";
import DetailsSection from "~/components/app/sections/DetailsSection.vue";
import ProgramSection from "~/components/app/sections/ProgramSection.vue";
import DressCodeSection from "~/components/app/sections/DressCodeSection.vue";
import VenueSection from "~/components/app/sections/VenueSection.vue";
import AreaActivitiesSection from "~/components/app/sections/AreaActivitiesSection.vue";
import FaqSection from "~/components/app/sections/FaqSection.vue";
import RsvpCta from "~/components/app/sections/RsvpCta.vue";
import { SEOService } from "~/services/seo-service";
import VenueIntroSection from "~/components/app/sections/VenueIntroSection.vue";

definePageMeta({ layout: false });

const { isUnlocked, unlock } = useAccess();

// Hydrate content up front so sections have data on first paint.
const { content } = useContent();

// ── Image carousels ───────────────────────────────────────────────────────────

const galleryImages: CarouselImage[] = Array.from({ length: 36 }, (_, i) => {
	const num = String(i).padStart(2, "0");
	return {
		src: `/img/gallery/Foto${num}.webp`,
		alt: `Gallery photo ${i + 1}`,
	};
});

const venueImages: CarouselImage[] = Array.from({ length: 10 }, (_, i) => {
	const num = String(i + 1).padStart(2, "0");
	return {
		src: `/img/venue-gallery/venue${num}.webp`,
		alt: `Venue photo ${i + 1}`,
	};
});

SEOService.set({
	description: () => content.value?.ui.meta.homeDescription,
	image: "/img/the_happy_couple.webp",
});
</script>

<template>
	<div>
		<EnvelopeGate v-if="!isUnlocked" @unlock="unlock" />

		<div v-else class="home">
			<HeroSection />
			<ImageCarousel :images="galleryImages" />
			<CountdownTimer />
			<WelcomeSection />
			<DetailsSection />
			<RsvpCta />
			<ProgramSection />
			<DressCodeSection />
			<VenueIntroSection />
			<ImageCarousel :images="venueImages" />
			<VenueSection />
			<AreaActivitiesSection />
			<FaqSection />
			<RsvpCta />
			<AppFooter />
		</div>
	</div>
</template>

<style scoped lang="scss">
.home {
	display: flex;
	flex-direction: column;
}
</style>
