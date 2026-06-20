<script lang="ts" setup>
// FAQ accordion (Story 2). Contact details for the bride sit at the bottom.
import BaseAccordion from "~/components/ui/BaseAccordion.vue";

const { content } = useContent();
</script>

<template>
	<section v-if="content" class="faq u-content">
		<h2 class="faq__heading u-heading">{{ content.ui.faqs.heading }}</h2>
		<BaseAccordion v-for="faq, q in content.faqs" :key="faq.question" :title="faq.question">
			<p>{{ faq.answer }}</p>
		</BaseAccordion>
	</section>
</template>

<style scoped lang="scss">
.faq {
	padding-block: $space-xl;

	&__heading {
		margin-bottom: $space-md;
		font-size: $font-size-xl;
	}
}
</style>
