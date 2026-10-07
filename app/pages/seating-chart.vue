<script lang="ts" setup>
// Seating chart (Figma node 199:67). A fixed, public route guests are linked to
// on the day, so it deliberately skips the access gate (like gallery.vue) and is
// kept out of search results. Table data lives in server/content/seating.ts.
import BaseMonogram from "~/components/ui/BaseMonogram.vue";
import { SEOService } from "~/services/seo-service";

// Self-manage the layout: the minimal layout's narrow column can't fit the
// 4- and 6-column desktop grids.
definePageMeta({ layout: false });

const { content } = useContent();

SEOService.set({
	title: () => content.value?.ui.seating.metaTitle,
	description: () => content.value?.ui.seating.metaDescription,
	robots: "noindex, nofollow",
});
</script>

<template>
	<main class="seating-page">
		<header class="seating-page__header">
			<BaseMonogram class="page-monogram seating-page__monogram" />
			<p v-if="content" class="seating-page__names">
				{{ content.couple.nameOne.split(/\s+/)[0] }} &amp; {{ content.couple.nameTwo.split(/\s+/)[0] }}
			</p>
			<h1 class="seating-page__heading">{{ content?.ui.seating.heading }}</h1>
		</header>

		<ol v-if="content" class="seating-page__tables">
			<li v-for="table in content.seating" :key="table.number" class="seating-page__table">
				<h2 class="seating-page__number">
					<span class="u-visually-hidden">{{ content.ui.seating.tableLabel }}&nbsp;</span>{{ table.number }}
				</h2>
				<ul class="seating-page__guests">
					<li v-for="(guest, index) in table.guests" :key="index">{{ guest }}</li>
				</ul>
			</li>
		</ol>
	</main>
</template>

<style scoped lang="scss">
.seating-page {
	min-height: 100dvh;
	padding-block: 0 $space-3xl;
	padding-inline: $space-lg;

	&__header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	&__monogram {
		margin-bottom: $space-lg;
	}

	&__names {
		font-weight: $font-weight-extralight;
		font-size: $font-size-lg;
	}

	&__heading {
		margin-top: $space-sm;
		font-family: $font-script;
		font-weight: $font-weight-regular;
		font-size: $font-size-3xl;
		line-height: $line-height-tight;
		letter-spacing: 0.1em; // the design sets the script's letters apart (~241px wide in Figma)
	}

	&__tables {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: $space-2xl $space-lg;
		margin-top: $space-2xl;

		// From here up columns are capped and the grid centred, so wide screens get
		// a tidy block instead of tables drifting apart.
		@include up($bp-sm) {
			grid-template-columns: repeat(3, minmax(0, 12rem));
			column-gap: $space-md;
			justify-content: center;
		}

		@include up($bp-lg) {
			grid-template-columns: repeat(4, minmax(0, 12rem));
		}

		@include up($bp-xl) {
			grid-template-columns: repeat(6, minmax(0, 12rem));
		}
	}

	&__table {
		display: grid;
		grid-template-columns: 3.5rem minmax(0, 1fr); // names start ~56px after the number
		align-items: start;
	}

	&__number {
		font-family: $font-display;
		font-weight: $font-weight-regular;
		font-size: $font-size-3xl;
		line-height: 1;
	}

	&__guests {
		padding-top: $space-3xs; // first name sits level with the number's top
		font-weight: $font-weight-extralight;
		font-size: $font-size-sm;
		line-height: 1.5;
		// Never split a name — "Melissa / DP" would read as two guests. On the
		// narrowest columns a long name runs into the column gap instead.
		white-space: nowrap;
	}
}
</style>
