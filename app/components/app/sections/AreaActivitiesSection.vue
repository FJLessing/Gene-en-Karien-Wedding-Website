<script lang="ts" setup>
// Dullstroom / area activities (Story 2): collapsible; each activity opens a modal
// with details and a link. Closes via button or backdrop.
import BaseAccordion from "~/components/ui/BaseAccordion.vue";
import BaseModal from "~/components/ui/BaseModal.vue";
import type { ActivityItem } from "#shared/types/types";

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
		<BaseAccordion title="Dullstroom activities">
			<ul class="area__list">
				<li v-for="activity in content.areaActivities" :key="activity.title">
					<button class="area__item" @click="open(activity)">{{ activity.title }}</button>
				</li>
			</ul>
		</BaseAccordion>

		<BaseModal :open="selected !== null" :title="selected?.title" @close="close">
			<p v-if="selected">{{ selected.description }}</p>
			<a v-if="selected?.link" :href="selected.link" class="area__link" target="_blank" rel="noopener">
				Learn more
			</a>
		</BaseModal>
	</section>
</template>

<style scoped lang="scss">
.area {
	padding-block: $space-lg;
}

.area__list {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: $space-2xs;
}

.area__item {
	width: 100%;
	padding: $space-2xs;
	border-radius: $radius-md;
	background-color: $color-light-gold-1;
	font-size: $font-size-sm;
	text-align: center;
}

.area__link {
	display: inline-block;
	margin-top: $space-md;
	text-decoration: underline;
}
</style>
