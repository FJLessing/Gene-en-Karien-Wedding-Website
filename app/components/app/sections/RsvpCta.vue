<script lang="ts" setup>
// RSVP call-to-action (Story 2 → Story 3). Routes to the dedicated RSVP page.
import BaseButton from "~/components/ui/BaseButton.vue";
</script>

<template>
	<section class="rsvp-cta u-content">
		<BaseButton @click="navigateTo('/rsvp')">RSVP here</BaseButton>
	</section>
</template>

<style scoped lang="scss">
.rsvp-cta {
	padding-block: $space-lg;
}
</style>
