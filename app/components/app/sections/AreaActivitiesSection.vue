<script lang="ts" setup>
// Dullstroom / area activities (Story 2): collapsible; each activity opens a modal
// with details and a link. Closes via button or backdrop.
import BaseAccordion from "~/components/ui/BaseAccordion.vue";
import BaseModal from "~/components/ui/BaseModal.vue";
import ActivityCard from "~/components/ui/ActivityCard.vue";
import { ActivityCardVariant, type ActivityItem } from "#shared/types/types";

const { content } = useContent();
const selected = ref<ActivityItem | null>(null);

function open(activity: ActivityItem): void {
	selected.value = activity;
}

function close(): void {
	selected.value = null;
}
</script>

<template>
	<section v-if="content" class="area u-content">
		<BaseAccordion
			v-for="category, c in content.areaActivities"
			:key="category.heading"
			:title="category.heading"
			gold-style
			:open="c === 0"
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
</style>
