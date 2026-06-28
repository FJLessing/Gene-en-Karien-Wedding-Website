<script lang="ts" setup>
import MapTrifold from "~/components/ui/MapTrifold.vue";

defineProps<{
	href: string;
	label: string;
}>();
</script>

<template>
	<a :href="href" class="map-button" download>
		{{ label }}
		<MapTrifold class="map-button__icon" />
	</a>
</template>

<style scoped lang="scss">
.map-button {
	display: inline-flex;
	width: 100%;
	align-items: center;
	justify-content: center;
	gap: $space-sm;
	padding: $space-xs $space-md;
	border: 0.0625rem solid $color-text;
	border-radius: $radius-sm;
	font-size: $font-size-xs;
	font-weight: $font-weight-medium;
	color: $color-text;
	line-height: $line-height-loose;
	text-decoration: none;
	align-self: center;

	&__icon {
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
	}
}
</style>
