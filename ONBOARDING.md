# Onboarding — Gene & Karien Wedding Website

A developer guide for getting the project running, understanding how it's structured, and contributing correctly.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Bun** | latest | `npm install -g bun` if missing |
| **Node.js** | 20 LTS+ | Required by Bun/Nuxt internals |
| **Git** | any | — |

---

## First-time setup

```bash
git clone <repo-url>
cd gene-karien-trou-website
bun install
cp .env.example .env
bun run dev          # http://localhost:3000
```

The site will start in "locked" state (the envelope gate). To bypass it locally, visit:

```
http://localhost:3000/?invite=anything
```

Any value for the `invite` param unlocks the site. The param name is controlled by `NUXT_PUBLIC_ACCESS_PARAM` (default: `invite`). To test the password flow, set `NUXT_SITE_PASSWORD=yourpassword` in `.env` and visit without the param.

---

## Nuxt 4 caveats

This project uses **Nuxt 4** with its `app/` source directory layout. These are the points most likely to trip you up if you've worked on Nuxt 3 projects before.

### `app/` is the source root

All Vue/client source lives under `app/`. The project root holds `server/`, `shared/`, and `public/`.

```
app/         ← Vue pages, components, composables, stores, services, plugins, layouts
server/      ← Nitro API routes and server utilities
shared/      ← Types and utilities shared between app and server (no Vue imports allowed here)
public/      ← Static assets (fonts, images, favicon)
nuxt.config.ts
```

### `~/` resolves to `app/`, not the repo root

Imports inside `app/` use `~/`:

```ts
import { ApiService } from "~/services/api-service";   // app/services/api-service.ts
import "~/assets/scss/main.scss";                        // app/assets/scss/main.scss
```

Do **not** use `~/server/...` — that path doesn't exist. Server-side code imports from `../utils/` or uses `#shared/`.

### `#shared/` alias for the shared directory

Code in both `app/` and `server/` can import from `shared/` via the `#shared/` alias:

```ts
import type { SiteContent, Guest } from "#shared/types/types";
import { Result } from "#shared/utils/result";
```

Never import Vue-specific code (`ref`, `computed`, Pinia, etc.) into `shared/` — it's used server-side too.

### Auto-imports

Nuxt 4 auto-imports all composables from `app/composables/` and all Pinia store factories from `app/stores/`. You don't need to manually import `useContentStore`, `useReveal`, `useGsap`, etc. inside `<script setup>` blocks. Vue APIs (`ref`, `computed`, `onMounted`, etc.) and Nuxt composables (`useState`, `useRuntimeConfig`, `useNuxtApp`, `navigateTo`, etc.) are also auto-imported.

You **do** need explicit imports for:
- Anything from `shared/` (use the `#shared/` alias)
- Non-composable service classes like `ApiService`
- Types (`import type { ... }`)

### Server routes vs app code

Files in `server/api/` are Nitro event handlers. They run server-side only. Use `useRuntimeConfig()` to access env vars — do not reference `runtimeConfig.public.*` secrets here, and do not import `$fetch` (use `googleapis` / `@google-cloud/storage` directly). Server utils in `server/utils/` are available via Nitro's server auto-imports (no explicit import needed within server files).

### `runtimeConfig` vs `process.env`

Never read `process.env.NUXT_*` directly. Always use `useRuntimeConfig()`:

```ts
// server route or server util
const config = useRuntimeConfig();
const password = config.sitePassword;            // server-only

// inside a component or composable
const config = useRuntimeConfig();
const param = config.public.accessParam;         // client-safe
```

Nuxt maps `NUXT_FOO_BAR` → `config.fooBar` and `NUXT_PUBLIC_FOO_BAR` → `config.public.fooBar` automatically at runtime.

---

## Project structure at a glance

```
app/
  assets/scss/
    _tokens.scss        Design tokens — colours, fonts, spacing, easing. Auto-injected.
    _mixins.scss        SCSS mixins and helpers. Auto-injected.
    _reset.scss         CSS reset
    main.scss           Entry — imports reset, fonts, global base styles
  components/
    ui/                 Generic, reusable primitives (BaseButton, BaseModal, BaseAccordion,
                        TextField, SelectField). No domain logic.
    app/
      layout/           AppLoader (route transition), AppFooter, EnvelopeGate (Story 1)
      sections/         One component per landing-page section (see below)
      rsvp/             RSVP multi-step flow components
      PhotoUpload.vue
  composables/
    use-gsap.ts         Access GSAP + ScrollTrigger; always use this, never import gsap directly
    use-reveal.ts       Scroll-entrance animation helper (wraps GSAP + ScrollTrigger)
    use-access.ts       Access gate state (isUnlocked, verifyPassword, unlock)
    use-content.ts      Hydrates and exposes site content from content-store
  layouts/
    default.vue         Standard layout with footer
    minimal.vue         Centered column, no footer (RSVP, gallery pages)
  middleware/
    auth-gate.global.ts Unlocks state if invite param present; runs on every nav
  pages/
    index.vue           Landing page (Stories 1 & 2)
    rsvp.vue            RSVP flow (Story 3)
    gallery.vue         Photo gallery (Story 4)
  plugins/
    gsap.client.ts      Registers GSAP + ScrollTrigger; provides $gsap and $ScrollTrigger
  services/
    api-service.ts      $fetch wrapper; every client HTTP call goes through here
    seo-service.ts      useSeoMeta() helper
  stores/
    content-store.ts    Site content (fetched once from /api/content)
    rsvp-store.ts       RSVP multi-step state + fuse.js guest search

server/
  api/
    auth.post.ts        POST /api/auth   — password verification
    content.get.ts      GET  /api/content — site copy (edit this to update text)
    guests.get.ts       GET  /api/guests  — guest list from Sheets
    rsvp.post.ts        POST /api/rsvp   — append RSVP to Sheets
    photos.post.ts      POST /api/photos — upload to GCS
  utils/
    sheets.ts           fetchGuestList(), appendRsvpRows() — Google Sheets integration
    storage.ts          uploadPhotos() — GCP Cloud Storage integration

shared/
  types/types.ts        All enums and interfaces used by both app and server
  utils/result.ts       Result<T> class
```

---

## Core patterns

### 1. Content — never hardcode

All user-facing copy lives in `server/api/content.get.ts`. It returns a `SiteContent` object (typed in `shared/types/types.ts`). Components read it through `use-content.ts`:

```ts
const { content, ready } = useContent();
// content.value?.event.dateLabel, etc.
```

To update wording, add a field, or change dates: edit `content.get.ts`. The shape is enforced by `SiteContent` — add new fields to the interface in `shared/types/types.ts` first if needed.

### 2. API calls — always `ApiService` → `Result<T>`

Every client-side HTTP call goes through `ApiService._request<T>()`, which wraps `$fetch` and returns a `Result<T>`. Never call `$fetch` directly in components or stores.

```ts
const result = await ApiService._request<{ valid: boolean }>("/api/auth", "POST", undefined, { password });
if (result.success && result.data?.valid) {
  // handle success
} else {
  // result.msg has the error string
}
```

`Result<T>` is defined in `shared/utils/result.ts`. Always check `result.success` before reading `result.data`.

### 3. Pinia stores — Options Store pattern

New stores follow this exact shape:

```ts
import { defineStore, acceptHMRUpdate } from "pinia";

interface MyState {
  data: MyType | null;
  isLoading: boolean;
  error: string | null;
}

export const useMyStore = defineStore("my-store", {
  state: (): MyState => ({ data: null, isLoading: false, error: null }),
  getters: { ... },
  actions: {
    async fetchSomething() {
      this.isLoading = true;
      this.error = null;
      try {
        const result = await ApiService._request<MyType>("/api/something", "GET");
        if (result.success && result.data) this.data = result.data;
        else this.error = result.msg;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot));
}
```

The `acceptHMRUpdate` line is mandatory — without it HMR breaks store state.

### 4. GSAP — always `useGsap()`, never `import gsap`

GSAP is registered as a Nuxt plugin (`app/plugins/gsap.client.ts`) and exposed via `useGsap()`. Direct imports of `gsap` will work in dev but break SSR. Always:

```ts
const { gsap, withCleanup } = useGsap();

onMounted(() => withCleanup((ctx) => {
  gsap.from(el.value, { y: 40, opacity: 0, duration: 0.8 });
}, el.value));
```

`withCleanup()` wraps `gsap.context()` and calls `.revert()` on `onBeforeUnmount` — this prevents memory leaks and orphaned ScrollTriggers. Always use it for any animation that attaches a ScrollTrigger.

For simple scroll-reveal entrances, use `useReveal()` instead:

```ts
const sectionEl = ref<HTMLElement | null>(null);
useReveal(sectionEl, { direction: "up", delay: 0.1 });
```

Respects `prefers-reduced-motion` automatically.

### 5. Enums over string literals

All discrete string values must be enums defined in `shared/types/types.ts`. Do not introduce new `"attending" | "declined"` union types — add an enum and use it everywhere.

### 6. SCSS — tokens are auto-injected

`_tokens.scss` and `_mixins.scss` are injected into every `<style lang="scss">` block via Vite's `additionalData`. You can use `$gold`, `$font-display`, `@include respond-to(md)`, etc. without a manual `@use`. Do not add a `@use "~/assets/scss/_tokens"` line — it will cause a duplicate-definition error.

No `px` units. Use `rem`, `em`, `%`, `vh`, `dvh`. No Tailwind.

---

## Adding a new landing-page section

1. Create `app/components/app/sections/MySectionName.vue`
2. Use `useContent()` to pull data — add any new fields to `SiteContent` in `shared/types/types.ts` and to the return value in `server/api/content.get.ts`
3. Use `useReveal()` for scroll entrances
4. Mount it in `app/pages/index.vue` in the correct order
5. No hardcoded copy in the component — everything via `content.value`

---

## Adding a new API route

1. Create `server/api/<name>.<method>.ts` (e.g. `server/api/venue.get.ts`)
2. Export a `defineEventHandler` function
3. Use `useRuntimeConfig()` for any secrets
4. Return plain objects — Nuxt serialises them as JSON automatically
5. For errors, throw `createError({ statusCode: 400, message: "..." })`

---

## Getting API credentials

The site works offline without any credentials — all integrations degrade gracefully (Sheets/GCS calls log a warning and return empty/zero). Wire them up when you need to test the actual RSVP or upload flow.

### Site password (Story 1)

Set any value:

```
NUXT_SITE_PASSWORD=yourpassword
```

### Google Sheets (RSVP guest list + submissions)

The spreadsheet needs two sheets: **Guests** (columns A=id, B=name) and **RSVPs** (receives appended rows).

**Steps:**

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create or select a GCP project
2. Enable the **Google Sheets API** (APIs & Services → Library → search "Sheets")
3. Create a Service Account (IAM & Admin → Service Accounts → Create)
   - Role: **Editor** is sufficient for Sheets access
4. Open the service account → Keys tab → Add Key → JSON → download the file
5. From the downloaded JSON, copy:
   - `client_email` → `NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `NUXT_GOOGLE_PRIVATE_KEY` (keep the `\n` escapes as-is; the server converts them)
6. Open the RSVP spreadsheet in Google Sheets
   - Share it with the service account email (Editor access)
   - Copy the spreadsheet ID from the URL (`/spreadsheets/d/<ID>/edit`) → `NUXT_GOOGLE_SHEET_ID`
7. Ensure the sheet has a tab named **Guests** with rows `id | name` and a tab named **RSVPs** (can be empty)

```env
NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL=my-service@my-project.iam.gserviceaccount.com
NUXT_GOOGLE_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n
NUXT_GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
```

### GCP Cloud Storage (photo uploads)

1. In the same GCP project, enable the **Cloud Storage API**
2. Create a bucket (Cloud Storage → Buckets → Create)
   - Region: pick one close to your users (e.g. `africa-south1` or `europe-west1`)
   - Access: **Uniform** (recommended)
3. Grant the same service account (from the Sheets step) the **Storage Object Admin** role on the bucket
4. Set:

```env
NUXT_GCS_PROJECT_ID=my-gcp-project-id
NUXT_GCS_BUCKET=gene-karien-photos
```

The storage client uses [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials). Locally you can authenticate with:

```bash
gcloud auth application-default login
```

Or set `GOOGLE_APPLICATION_CREDENTIALS` to the path of the service account JSON file downloaded earlier.

### Gallery (Story 4)

```env
NUXT_PUBLIC_GALLERY_FOLDER_URL=https://...  # moderated public folder URL shown in the gallery
NUXT_PUBLIC_GALLERY_UNLOCK_DATE=2026-10-10  # ISO date — gallery is hidden before this date
```

---

## Useful scripts

```bash
bun run dev          # dev server with HMR
bun run build        # production build (outputs to .output/)
bun run preview      # serve the production build locally
bun run generate     # static export (not recommended — site uses server routes)
bun run typecheck    # full TypeScript check (vue-tsc + nuxt typecheck)
```

---

## Design reference

The Figma file is the source of truth for the visual design. Open via the Figma MCP or directly:

- Main design: `https://www.figma.com/design/CjzRkjDCORCg7vu2PhW1OI/Genie-San---Krienie-San?node-id=14-343`
- Loader animation: `node-id=17-491`

Design tokens are in `app/assets/scss/_tokens.scss`. If the Figma design changes, update the tokens file — don't hardcode values inline.
