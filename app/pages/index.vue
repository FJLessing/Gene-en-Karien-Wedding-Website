<script lang="ts" setup>
// Landing page (Story 1 + 2). Shows the envelope gate until access is granted,
// then the full scrolling content. Self-manages its layout (no shared layout) so
// the gate can take over the full viewport.
import EnvelopeGate from "~/components/app/layout/EnvelopeGate.vue";
import AppFooter from "~/components/app/layout/AppFooter.vue";
import HeroSection from "~/components/app/sections/HeroSection.vue";
import ImageCarousel from "~/components/app/sections/ImageCarousel.vue";
import type { CarouselImage } from "#shared/types/types";
import { Locale } from "#shared/types/types";
import CountdownTimer from "~/components/app/sections/CountdownTimer.vue";
import WelcomeSection from "~/components/app/sections/WelcomeSection.vue";
import DetailsSection from "~/components/app/sections/DetailsSection.vue";
import ProgramSection from "~/components/app/sections/ProgramSection.vue";
import DressCodeSection from "~/components/app/sections/DressCodeSection.vue";
import VenueSection from "~/components/app/sections/VenueSection.vue";
import ActivitiesSection from "~/components/app/sections/ActivitiesSection.vue";
import FaqSection from "~/components/app/sections/FaqSection.vue";
import RsvpCta from "~/components/app/sections/RsvpCta.vue";
import { SEOService } from "~/services/seo-service";

definePageMeta({ layout: false });

const { isUnlocked, unlock } = useAccess();
const { ScrollTrigger } = useGsap();

// Hydrate content up front so sections have data on first paint.
const { content } = useContent();
const localeStore = useLocaleStore();

// Gate → content is a `v-if` swap, not a route change, so nothing resets scroll
// when the (tall) content mounts. Force the top and recompute reveal triggers
// against the final layout once it's in the DOM.
watch(isUnlocked, async (unlocked) => {
	if (!unlocked) return;
	await nextTick();
	window.scrollTo(0, 0);
	ScrollTrigger.refresh();
});

// ── Image carousels ───────────────────────────────────────────────────────────

// Build a numbered carousel image set, e.g. /img/gallery/Foto00.webp … Foto35.webp.
function buildCarouselImages(
	count: number,
	dir: string,
	prefix: string,
	altLabel: string,
	offset: number = 0
): CarouselImage[] {
	return Array.from({ length: count }, (_, i) => {
		const num = String(i + offset).padStart(2, "0");
		return {
			src: `/img/${dir}/${prefix}${num}.webp`,
			alt: `${altLabel} ${i + 1}`,
		};
	});
}

const galleryImages = buildCarouselImages(36, "gallery", "Foto", "Gallery photo", 1);
const venueImages = buildCarouselImages(10, "venue-gallery", "venue", "Venue photo");
const mapImages = buildCarouselImages(3, "maps", "map", "Map photo");

SEOService.set({
	description: () => content.value?.ui.meta.homeDescription,
	image: () => localeStore.locale === Locale.Af ? "/img/sharing_af.webp" : "/img/sharing_en.webp",
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
			<ImageCarousel :images="venueImages" />
			<VenueSection :mapImages="mapImages" />
			<ActivitiesSection />
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
