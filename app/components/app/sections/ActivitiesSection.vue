<script lang="ts" setup>
// Dullstroom / area activities (Story 2): collapsible; each activity opens a modal
// with details and a link. Closes via button or backdrop.
import BaseAccordion from "~/components/ui/BaseAccordion.vue";
import BaseModal from "~/components/ui/BaseModal.vue";
import MapButton from "~/components/ui/MapButton.vue";
import ActivityCard from "~/components/ui/ActivityCard.vue";
import { ActivityCardVariant, type ActivityItem } from "#shared/types/types";

const { content } = useContent();
const selected = ref<ActivityItem | null>(null);

// Phone + email inside the contact copy become tel:/mailto: links. Both tokens
// are identical across locales, so the literal split serves EN + AF. The phone
// is displayed in local form but dialled with the +27 country code.
const CONTACT_PHONE = "0112346448";
const CONTACT_PHONE_TEL = "+27112346448";
const CONTACT_EMAIL = "dunkeld@gmail.co.za";

// Split the contact copy into ordered text/link segments around the phone and
// email tokens. Plain copy returns as a single segment if neither is present.
const contactParts = computed(() => {
	const text = content.value?.venue.contact ?? "";
	const tokens = [
		{ match: CONTACT_PHONE, href: `tel:${CONTACT_PHONE_TEL}` },
		{ match: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
	];
	const found = tokens
		.map((t) => ({ ...t, idx: text.indexOf(t.match) }))
		.filter((t) => t.idx !== -1)
		.sort((a, b) => a.idx - b.idx);

	const parts: { text: string; href?: string }[] = [];
	let cursor = 0;
	for (const t of found) {
		if (t.idx > cursor) parts.push({ text: text.slice(cursor, t.idx) });
		parts.push({ text: t.match, href: t.href });
		cursor = t.idx + t.match.length;
	}
	if (cursor < text.length) parts.push({ text: text.slice(cursor) });
	return parts;
});

function open(activity: ActivityItem): void {
	selected.value = activity;
}

function close(): void {
	selected.value = null;
}
</script>

<template>
	<section v-if="content" class="area u-content">

		<BaseAccordion :title="content.ui.venue.activitiesTitle" :sub-title="content.ui.venue.activitiesTitle" gold-style>
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
			<p class="venue__contact"><template v-for="(part, i) in contactParts" :key="i"><a
				v-if="part.href"
				:href="part.href"
				class="venue__contact-link"
			>{{ part.text }}</a><template v-else>{{ part.text }}</template></template></p>
			<MapButton class="venue__map-button" href="/dunkeld_estate_maps.pdf" :label="content.ui.venue.downloadMap" />
		</BaseAccordion>


		<BaseAccordion
			v-for="category, c in content.areaActivities"
			:key="category.heading"
			:title="category.heading"
			gold-style
			:open="false"
		>
			<ul class="area__list">
				<li v-for="activity in category.items" :key="activity.title">
					<ActivityCard
						:title="activity.title"
						:image="activity.image"
						:variant="ActivityCardVariant.Banner"
						@click="open(activity)"
					/>
				</li>
			</ul>
		</BaseAccordion>

		<BaseModal :open="selected !== null" :title="selected?.title" @close="close">
			<p v-if="selected">{{ selected.description }}</p>
			<a v-if="selected?.link" :href="selected.link" class="area__link" target="_blank" rel="noopener">
				{{ content.ui.areaActivities.learnMore }}
			</a>
		</BaseModal>
	</section>
</template>

<style scoped lang="scss">
.area {
	padding-block: $space-lg;

	&__list {
		display: flex;
		flex-direction: column;
		gap: $space-2xs;
	}

	&__link {
		display: inline-block;
		margin-top: $space-md;
		text-decoration: underline;
	}
}

.venue {
	&__contact {
		font-size: $font-size-sm;
		color: $color-text-muted;
		text-align: center;
		margin: $space-md 0;
	}

	&__contact-link {
		text-decoration: underline;
	}

	&__map-button {
		margin-bottom: $space-xl;
	}

	&__activities {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $space-2xs;
	}
}
</style>
