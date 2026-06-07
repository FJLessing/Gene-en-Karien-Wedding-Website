<script lang="ts" setup>
// Minimal layout for focused flows (RSVP, gallery). Centred content column,
// no footer.
</script>

<template>
	<main class="layout-minimal">
		<div class="layout-minimal__inner u-content">
			<slot />
		</div>
	</main>
</template>

<style scoped lang="scss">
.layout-minimal {
	min-height: 100dvh;
	padding-block: $space-lg;
}
</style>
