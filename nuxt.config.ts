// https://nuxt.com/docs/4.x/getting-started/upgrade
export default defineNuxtConfig({
	// Nuxt 4 — use latest compatibility date.
	compatibilityDate: "2025-06-07",

	devtools: { enabled: true },

	modules: ["@pinia/nuxt"],

	// Nuxt 4 default: srcDir is `app/`. Declared explicitly for clarity.
	// server/, public/, shared/ stay at the root.
	// future.compatibilityVersion: 4 is already the default in Nuxt 4.

	// Global SCSS entry. Tokens + mixins are auto-injected into every component
	// <style lang="scss"> block via additionalData so they don't need manual @use.
	// `~/` now resolves to `app/` (the srcDir) in Nuxt 4.
	css: ["~/assets/scss/main.scss"],

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/scss/_tokens.scss" as *;\n@use "~/assets/scss/_mixins.scss" as *;\n',
				},
			},
		},
	},

	// runtimeConfig replaces the fj-vue static `Env` class. Nuxt auto-overrides
	// these from NUXT_-prefixed env vars at runtime (correct for Cloud Run).
	// Server-only secrets live at the top level; client-exposed values under `public`.
	runtimeConfig: {
		// Server-only (never sent to the browser).
		sitePassword: "", // NUXT_SITE_PASSWORD — Story 1 password gate
		googleServiceAccountEmail: "", // NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL
		googlePrivateKey: "", // NUXT_GOOGLE_PRIVATE_KEY
		googleSheetId: "", // NUXT_GOOGLE_SHEET_ID — RSVP sheet
		gcsBucket: "", // NUXT_GCS_BUCKET — photo uploads
		gcsProjectId: "", // NUXT_GCS_PROJECT_ID
		public: {
			// Exposed to the client. Safe, non-secret values only.
			accessParam: "invite", // NUXT_PUBLIC_ACCESS_PARAM — URL param that grants access (Story 1)
			galleryFolderUrl: "", // NUXT_PUBLIC_GALLERY_FOLDER_URL — moderated gallery source
			galleryUnlockDate: "", // NUXT_PUBLIC_GALLERY_UNLOCK_DATE — ISO date the gallery opens
		},
	},

	app: {
		head: {
			htmlAttrs: { lang: "en" },
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
				{ name: "theme-color", content: "#F4EFE7" },
			],
			link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
		},
	},

	typescript: {
		strict: true,
	},
});
