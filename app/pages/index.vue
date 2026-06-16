<script lang="ts" setup>
// Landing page (Story 1 + 2). Shows the envelope gate until access is granted,
// then the full scrolling content. Self-manages its layout (no shared layout) so
// the gate can take over the full viewport.
import EnvelopeGate from "~/components/app/layout/EnvelopeGate.vue";
import AppFooter from "~/components/app/layout/AppFooter.vue";
import HeroSection from "~/components/app/sections/HeroSection.vue";
import CoupleImageSection from "~/components/app/sections/CoupleImageSection.vue";
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

definePageMeta({ layout: false });

const { isUnlocked, unlock } = useAccess();

// Hydrate content up front so sections have data on first paint.
useContent();

SEOService.set({ title: "", description: "You are invited to celebrate with us." });
</script>

<template>
	<div>
		<EnvelopeGate v-if="!isUnlocked" @unlock="unlock" />

		<div v-else class="home">
			<HeroSection />
			<CoupleImageSection />
			<CountdownTimer />
			<WelcomeSection />
			<DetailsSection />
			<RsvpCta />
			<ProgramSection />
			<DressCodeSection />
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
