# Gene + Karien Wedding Website

Nuxt 4 + Vue 3 + GSAP + SCSS wedding website. Mobile-first. No Tailwind, no pixel units.

## Layout

Nuxt 4 `srcDir: 'app/'`. Three root-level dirs matter:

```
app/        Vue source (pages, components, composables, stores, services, plugins, layouts)
server/     Nitro API routes + utils (sheets.ts, storage.ts)
shared/     Types + Result class — imported by both app and server, no Vue deps allowed here
```

## Import aliases

- `~/` → `app/` (not repo root)
- `#shared/` → `shared/`

## Key files

| File | Purpose |
|---|---|
| `server/api/content.get.ts` | All site copy — edit here, never hardcode in components |
| `shared/types/types.ts` | All enums and interfaces |
| `shared/utils/result.ts` | `Result<T>` envelope |
| `app/services/api-service.ts` | `ApiService._request<T>()` — only way to call `/api/*` from client |
| `app/composables/use-gsap.ts` | GSAP access — always use this, never `import gsap` |
| `app/composables/use-reveal.ts` | Scroll-reveal helper (`useReveal(ref, { direction, delay })`) |
| `app/composables/use-content.ts` | `const { content, ready } = useContent()` |
| `app/assets/scss/_tokens.scss` | Design tokens (colours, fonts, easing) |

## Rules

- **Content**: all copy flows from `/api/content` → `content-store` → `useContent()`. Never hardcode strings in components.
- **API calls**: always `ApiService._request<T>()` → `Result<T>`. Check `result.success` before `result.data`.
- **GSAP**: `const { gsap, withCleanup } = useGsap()`. Wrap all tweens in `withCleanup()` to prevent leaks. Never import `gsap` directly.
- **Stores**: Pinia Options Store pattern with `isLoading: boolean`, `error: string | null`, and `acceptHMRUpdate` at the bottom.
- **SCSS**: `_tokens.scss` and `_mixins.scss` are auto-injected — do not `@use` them manually. No `px`, no Tailwind.
- **Types**: enums over string literals. Add to `shared/types/types.ts`.
- **`runtimeConfig`**: use `useRuntimeConfig()`, never `process.env`. Server secrets at top level; client-safe values under `public`.
- **Auto-imports**: composables, store factories, Vue APIs, and Nuxt composables are auto-imported. Types and `ApiService` need explicit imports.

## Sections (landing page order)

`HeroSection` → `CountdownTimer` → `WelcomeSection` → `DetailsSection` → `ProgramSection` → `DressCodeSection` → `VenueSection` → `AreaActivitiesSection` → `FaqSection` → `RsvpCta`

## Design

Figma (use MCP): `https://www.figma.com/design/CjzRkjDCORCg7vu2PhW1OI/Genie-San---Krienie-San?node-id=14-343&m=dev`

Tokens: Black `#4A4A4A`, Grey `#8A8A8A`, Gold `#C5B39A`, Light Gold `#E8DED0`/`#F4EFE7`. Fonts: Poppins Light (body), Bagien Regular (display). Embossed elements use neumorphic shadow.

## Status

All architecture, pages, components, and API routes are in place. Pending: content sign-off, real Sheets/GCS credentials, hero imagery, gallery grid.
