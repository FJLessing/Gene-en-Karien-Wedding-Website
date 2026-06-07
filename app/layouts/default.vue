<script lang="ts" setup>
// Main site layout: page content followed by the footer.
import AppFooter from "~/components/app/layout/AppFooter.vue";
</script>

<template>
	<div class="layout-default">
		<main class="layout-default__main">
			<slot />
		</main>
		<AppFooter />
	</div>
</template>

<style scoped lang="scss">
.layout-default {
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
}

.layout-default__main {
	flex: 1;
}
</style>
