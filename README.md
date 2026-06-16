# Gene & Karien — Wedding Website

A mobile-first wedding website built with **Nuxt 4 + Vue 3 + GSAP + SCSS**. See
[`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md) for the full brief and user stories.

## Implementation status

**Done**
- Architecture — Nuxt 4 (`app/` srcDir), TypeScript strict, Pinia, GSAP, SCSS design tokens
- All pages, layouts, composables, and middleware
- All 9 landing-page sections + RSVP CTA
- EnvelopeGate with GSAP hinge animation (access gate — Story 1)
- CountdownTimer — custom GSAP digit-roll (no third-party timer lib)
- Full RSVP multi-step flow: search → attendance → form → confirm; Sheets append (server util stubbed)
- Photo upload → GCS route (server util stubbed)
- All API routes, server utils, Pinia stores, shared types

**Pending / In Review**
- Content copy — served from `server/api/content.get.ts`; needs sign-off
- Google Sheets & GCS credentials (real env vars not yet wired)
- Hero imagery — venue + couple photos
- Gallery grid rendering + date-gated unlock
- Activity images — some still placeholder

## Stack

- **Nuxt 4** (Vue 3, Composition API, `<script setup>`) — `srcDir: 'app/'`; server routes and shared types live at the repo root
- **Pinia** (Options Store pattern)
- **GSAP + ScrollTrigger** for animation
- **SCSS** — design tokens + mixins auto-injected; no Tailwind; no pixel units
- **fuse.js** — RSVP fuzzy guest search
- **Server:** Nitro API routes → Google Sheets (RSVPs) + GCP Cloud Storage (photos)

## Getting started

```bash
bun install        # install dependencies
cp .env.example .env
bun run dev        # http://localhost:3000
```

Other scripts: `bun run build`, `bun run preview`, `bun run generate`, `bun run typecheck`.

## Conventions

Follows the `fj-vue` conventions adapted for Nuxt:

- 2-tab indentation, semicolons, no `var`, minimise `any`, enums over string literals
- Components `PascalCase`; `.ts` files `kebab-case`; assets `snake_case`
- Pinia Options Stores with `isLoading`/`error` + `acceptHMRUpdate`
- `<style scoped lang="scss">` for components; global SCSS in `app/assets/scss/`
- All client API calls go through the static `ApiService` (`$fetch` wrapper → `Result<T>`)
- Content flows from `/api/content` → `content-store` → `use-content()` — never hardcoded
- Auth is a URL-param/password gate in middleware — no user accounts, no cookies

## Project structure

```
app/
  assets/scss/          _tokens.scss, _mixins.scss, _reset.scss, main.scss
  components/
    ui/                 BaseButton, BaseModal, BaseAccordion, TextField, SelectField
    app/
      layout/           AppLoader, AppFooter, EnvelopeGate
      sections/         HeroSection, CountdownTimer, WelcomeSection, DetailsSection,
                        ProgramSection, DressCodeSection, VenueSection,
                        AreaActivitiesSection, FaqSection, RsvpCta
      rsvp/             RsvpSearch, RsvpAttendChoice, RsvpForm, RsvpConfirm
      PhotoUpload.vue
  composables/          use-gsap, use-reveal, use-access, use-content
  layouts/              default (with footer), minimal
  middleware/           auth-gate.global
  pages/                index, rsvp, gallery
  plugins/              gsap.client (registers GSAP + ScrollTrigger)
  services/             api-service, seo-service
  stores/               content-store, rsvp-store
server/
  api/                  auth.post, content.get, guests.get, rsvp.post, photos.post
  utils/                sheets.ts, storage.ts
shared/
  types/types.ts        Enums + interfaces (Guest, RsvpEntry, SiteContent, …)
  utils/result.ts       Result<T> envelope
public/
  fonts/                Poppins (Light/Regular/Medium), Bagien Regular
  logo.svg
```

## Environment

See `.env.example`. Nuxt maps `NUXT_`-prefixed vars onto `runtimeConfig` at runtime
(works on Cloud Run). Secrets stay server-side; only `runtimeConfig.public.*` reaches the client.

| Key | Purpose |
|---|---|
| `NUXT_SITE_PASSWORD` | Password for the envelope gate (Story 1) |
| `NUXT_PUBLIC_ACCESS_PARAM` | URL param name (default `invite`) |
| `NUXT_GOOGLE_SERVICE_ACCOUNT_EMAIL` | Sheets service account |
| `NUXT_GOOGLE_PRIVATE_KEY` | Sheets private key (escaped `\n`) |
| `NUXT_GOOGLE_SHEET_ID` | RSVP spreadsheet ID |
| `NUXT_GCS_PROJECT_ID` | GCP project |
| `NUXT_GCS_BUCKET` | Cloud Storage bucket for photos |
| `NUXT_PUBLIC_GALLERY_FOLDER_URL` | Public gallery URL |
| `NUXT_PUBLIC_GALLERY_UNLOCK_DATE` | ISO date the gallery unlocks |
