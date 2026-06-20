# Gene + Karien Wedding Website

Nuxt 4 + Vue 3 + GSAP + SCSS wedding website. Mobile-first. No Tailwind, no pixel units.

## Layout

Nuxt 4 `srcDir: 'app/'`. Three root-level dirs matter:

```
app/        Vue source (pages, components, composables, stores, services, plugins, layouts)
server/     Nitro API routes + utils (sheets.ts, storage.ts) + content/ (per-locale copy)
shared/     Types + Result class — imported by both app and server, no Vue deps allowed here
```

## Import aliases

- `~/` → `app/` (not repo root)
- `#shared/` → `shared/`

## Key files

| File | Purpose |
|---|---|
| `server/content/en.ts`, `af.ts` | All site copy + UI strings, one file per locale — edit here, never hardcode in components |
| `server/api/content.get.ts` | Returns the right locale file for `?locale=` (defaults to `en`) |
| `shared/types/types.ts` | All enums and interfaces (incl. `Locale`, `SiteContent`, `SiteUi`) |
| `shared/utils/result.ts` | `Result<T>` envelope |
| `app/services/api-service.ts` | `ApiService._request<T>()` — only way to call `/api/*` from client |
| `app/services/seo-service.ts` | `SEOService.set({ title, description })` — accepts getters for reactive/localised meta |
| `app/composables/use-gsap.ts` | GSAP access — always use this, never `import gsap` |
| `app/composables/use-reveal.ts` | Scroll-reveal helper (`useReveal(ref, { direction, delay })`) |
| `app/composables/use-content.ts` | `const { content, ready } = useContent()` — locale-aware, refetches on language change |
| `app/stores/locale-store.ts` | Active language; detect/cookie/`setLocale()` |
| `app/plugins/locale.ts` | Resolves the locale on startup, binds `<html lang>` |
| `app/components/app/layout/LocaleToggle.vue` | Footer EN/AF switch |
| `app/assets/scss/_tokens.scss` | Design tokens (colours, fonts, easing) |

## Rules

- **Content**: all copy flows from `/api/content` → `content-store` → `useContent()`. Never hardcode strings in components — this includes UI chrome (headings, buttons, labels, placeholders, error/confirmation messages), which lives under `SiteContent.ui`.
- **i18n (EN/AF)**: every user-facing string is keyed per locale in `server/content/en.ts` and `server/content/af.ts` — keep both files structurally identical (the `SiteContent` type enforces this). Translate human-readable text only; keep option `value`s (meal/dietary/arrival — they key the Sheet), `program[].icon`, image paths, links, and `event.startsAt` identical across locales. Add a string → add the field to `SiteUi`/`SiteContent` in `shared/types/types.ts`, then fill it in **both** locale files, then read it via `content.ui.*` in the component. Default language is English; Afrikaans is auto-selected only when it's the visitor's most-preferred browser language, and the footer `LocaleToggle` overrides + persists the choice in a cookie. For page `<title>`/meta, pass getters to `SEOService.set` (e.g. `{ title: () => content.value?.ui.rsvp.metaTitle }`) so they update on language switch.
- **API calls**: always `ApiService._request<T>()` → `Result<T>`. Check `result.success` before `result.data`.
- **GSAP**: `const { gsap, withCleanup } = useGsap()`. Wrap all tweens in `withCleanup()` to prevent leaks. Never import `gsap` directly.
- **Stores**: Pinia Options Store pattern with `isLoading: boolean`, `error: string | null`, and `acceptHMRUpdate` at the bottom.
- **SCSS**: `_tokens.scss` and `_mixins.scss` are auto-injected — do not `@use` them manually. No `px`, no Tailwind.
- **SCSS structure**: one nested block per widget — reference children/modifiers/states with `&` (`&__child`, `&--modifier`, `&:hover`), never flat sibling selectors. Order nested selectors to match template source order; base declarations before modifiers. `@keyframes`, framework transition classes (`*-enter-active`, etc.), and local SCSS variables stay at top level. See [CountdownTimer.vue](app/components/app/sections/CountdownTimer.vue) for the reference shape.
- **Types**: enums over string literals. Add to `shared/types/types.ts`.
- **`runtimeConfig`**: use `useRuntimeConfig()`, never `process.env`. Server secrets at top level; client-safe values under `public`.
- **Auto-imports**: composables, store factories, Vue APIs, and Nuxt composables are auto-imported. Types and `ApiService` need explicit imports.

## Access gate (Story 1)

The whole site sits behind a soft access gate. **To view any page in local dev / preview, append the invite URL param** — e.g. `http://localhost:3000/?invite=preview`. The value can be anything truthy; the param name is `runtimeConfig.public.accessParam` (default `"invite"`).

How it works:

- `app/middleware/auth-gate.global.ts` runs on every navigation (server + client). It does **not** redirect — if the invite param is present it sets the shared `access-state` to `Unlocked`; otherwise the state stays `Locked` and pages render the envelope/password layout inline.
- State lives in `useState("access-state")`, surfaced by `app/composables/use-access.ts` (`isUnlocked`, `unlock`, `lock`, `verifyPassword`). Pages read `useAccess().isUnlocked` to choose envelope vs content.
- **Password path** (no invite param): `verifyPassword()` → `POST /api/auth` (`server/api/auth.post.ts`) compares the submitted password against `runtimeConfig.sitePassword` (env `NUXT_SITE_PASSWORD`). The password is never sent to the client. An empty/unset password always rejects. Local `.env` ships `NUXT_SITE_PASSWORD=TEST`.

For automated/preview verification, the `?invite=` param is the reliable bypass — don't try to type the password into the gate form.

## Sections (landing page order)

`HeroSection` → `CountdownTimer` → `WelcomeSection` → `DetailsSection` → `ProgramSection` → `DressCodeSection` → `VenueSection` → `AreaActivitiesSection` → `FaqSection` → `RsvpCta`

## Design

Figma (use MCP): `https://www.figma.com/design/CjzRkjDCORCg7vu2PhW1OI/Genie-San---Krienie-San?node-id=14-343&m=dev`

Tokens: Black `#4A4A4A`, Grey `#8A8A8A`, Gold `#C5B39A`, Light Gold `#E8DED0`/`#F4EFE7`. Fonts: Poppins Light (body), Bagien Regular (display). Embossed elements use neumorphic shadow.

## Status

All architecture, pages, components, and API routes are in place. English + Afrikaans translation is wired end-to-end (per-locale content files, auto-detect, footer toggle). Pending: content sign-off (incl. Afrikaans proofread), real Sheets/GCS credentials, hero imagery, gallery grid.
