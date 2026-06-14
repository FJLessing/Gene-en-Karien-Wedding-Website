# Gene & Karien — Wedding Website

A mobile-first wedding website built with **Nuxt 3 + Vue 3 + GSAP + SCSS**. See
[`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md) for the full brief and user stories.

> Status: **Work In Progress**. Architecture, conventions, and integrations are in place. 
> Most of the content is in. (served from `/api/content`) but needs review.
> progress — nothing is hardcoded.

## Stack

- Nuxt 3 (Vue 3, Composition API, `<script setup>`)
- Pinia (Options Store pattern)
- GSAP + ScrollTrigger for animation
- SCSS (tokens + mixins auto-injected; no Tailwind, no pixel units)
- fuse.js for RSVP fuzzy search
- Server: Nitro API routes → Google Sheets (RSVPs) + GCP Cloud Storage (photos)

## Getting started

```bash
bun install        # install dependencies
cp .env.example .env
bun run dev        # http://localhost:3000
```

Other scripts: `bun run build`, `bun run preview`, `bun run generate`, `bun run typecheck`.

## Conventions

Follows the `fj-vue` conventions adapted for Nuxt:

- 2-tab indentation, semicolons, no `var`, minimise `any`, enums over string literals.
- Components `PascalCase`; `.ts` files `kebab-case`; assets `snake_case`.
- Pinia Options Stores with `isLoading`/`error` + `acceptHMRUpdate`.
- `<style scoped lang="scss">` for components; global SCSS in `assets/scss/`.
- All client API calls go through the static `ApiService` (`$fetch` wrapper → `Result`).
- Content flows from `/api/content` → `content-store` → `use-content()` — never hardcoded.

## Project structure

```
assets/scss/        Design tokens, mixins, reset, global styles
components/ui/       Base UI (BaseButton, BaseModal, BaseAccordion, form fields)
components/app/      Sections, RSVP steps, layout, photo upload
composables/         use-content, use-access, use-gsap, use-reveal
helpers/             Result, shared types/enums
layouts/             default (with footer), minimal
middleware/          auth-gate.global (URL-param access gate)
pages/               index, rsvp, gallery
plugins/             gsap.client (registers GSAP + ScrollTrigger)
server/api/          content, auth, rsvp, guests, photos
server/utils/        sheets, storage (lazy-loaded integration stubs)
services/            api-service, seo-service
stores/              content-store, rsvp-store
```

## Environment

See `.env.example`. Nuxt maps `NUXT_`-prefixed env vars onto `runtimeConfig` at runtime
(works on Cloud Run). Secrets stay server-side; only `runtimeConfig.public.*` reaches the client.
